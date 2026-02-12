import ParsecAPI, { APIError } from 'parsec-api';
import type { OrderbookSnapshot } from 'parsec-api/streaming';

// These tests are intended to run against a real Parsec API server.
// They are opt-in so the default SDK CI remains fast/offline.
const RUN_LIVE = process.env['PARSEC_CONTRACT_TESTS'] === '1';

const BASE_URL =
  process.env['PARSEC_BASE_URL'] ?? process.env['TEST_API_BASE_URL'] ?? 'http://localhost:3000';
const API_KEY = process.env['PARSEC_API_KEY'];

// Server can be slow during relay warmup — generous per-test timeouts.
jest.setTimeout(15_000);

if (!RUN_LIVE) {
  test.skip('live contract tests disabled (set PARSEC_CONTRACT_TESTS=1)', () => {});
} else {
  if (!API_KEY) {
    throw new Error('PARSEC_API_KEY must be set when PARSEC_CONTRACT_TESTS=1');
  }

  // ── Shared client ─────────────────────────────────────────

  const client = new ParsecAPI({ apiKey: API_KEY, baseURL: BASE_URL });

  // ── REST contract tests ──────────────────────────────────

  describe('REST: exchanges', () => {
    test('GET /api/v1/exchanges returns string[]', async () => {
      const exchanges = await client.exchanges.list();
      expect(Array.isArray(exchanges)).toBe(true);
      expect(exchanges.length).toBeGreaterThan(0);
      expect(typeof exchanges[0]).toBe('string');
      // Should include known exchanges
      expect(exchanges).toEqual(expect.arrayContaining(['kalshi']));
    });
  });

  describe('REST: markets', () => {
    test('GET /api/v1/markets returns paginated market list with correct shape', async () => {
      const resp = await client.markets.list({ exchanges: ['kalshi'], limit: 3 });
      expect(resp).toHaveProperty('markets');
      expect(Array.isArray(resp.markets)).toBe(true);
      expect(resp.markets.length).toBeGreaterThan(0);
      expect(resp.markets.length).toBeLessThanOrEqual(3); // limit respected

      const market = resp.markets[0]!;
      expect(typeof market.parsec_id).toBe('string');
      expect(market.parsec_id).toMatch(/^kalshi:/); // parsec_id has exchange prefix
      expect(market.exchange).toBe('kalshi'); // filtered to kalshi
      expect(Array.isArray(market.outcomes)).toBe(true);
      expect(market.outcomes.length).toBeGreaterThan(0);
      expect(typeof market.outcomes[0]).toBe('string');
      expect(['active', 'closed', 'settled']).toContain(market.status);
      expect(typeof market.title).toBe('string');
      expect(market.title.length).toBeGreaterThan(0);
    });

    test('GET /api/v1/markets supports multi-exchange filter', async () => {
      const resp = await client.markets.list({ exchanges: ['kalshi', 'polymarket'], limit: 20 });
      expect(resp.markets.length).toBeGreaterThan(0);
      const exchangeSet = new Set(resp.markets.map((m) => m.exchange));
      // Multi-exchange filter should return results — ideally from both,
      // but Polymarket relay can be slow, so we require at least 1 exchange
      // and verify the filter doesn't return exchanges we didn't ask for.
      expect(exchangeSet.size).toBeGreaterThanOrEqual(1);
      for (const ex of exchangeSet) {
        expect(['kalshi', 'polymarket']).toContain(ex);
      }
    }, 30_000);
  });

  describe('REST: orderbook', () => {
    test('GET /api/v1/orderbook returns correctly structured bids/asks', async () => {
      // Find an active market with actual orderbook depth — some 'active'
      // markets on Kalshi have zero liquidity (e.g. esports).
      const allMarkets = await client.markets.list({ exchanges: ['kalshi'], limit: 20 });
      let market: (typeof allMarkets.markets)[number] | undefined;
      let ob: any;
      for (const m of allMarkets.markets) {
        if (m.status !== 'active' || m.outcomes.length === 0) continue;
        const book = await client.orderbook.retrieve({
          parsec_id: m.parsec_id,
          outcome: m.outcomes[0]!,
        });
        if (book.bids.length + book.asks.length > 0) {
          market = m;
          ob = book;
          break;
        }
      }
      expect(market).toBeDefined();
      expect(ob).toBeDefined();

      expect(ob).toHaveProperty('bids');
      expect(ob).toHaveProperty('asks');
      expect(Array.isArray(ob.bids)).toBe(true);
      expect(Array.isArray(ob.asks)).toBe(true);

      // REST orderbook returns raw wire format: [[price, size], ...]
      const totalLevels = ob.bids.length + ob.asks.length;
      expect(totalLevels).toBeGreaterThan(0);

      if (ob.bids.length > 0) {
        const bid = ob.bids[0]!;
        expect(bid.length).toBe(2);
        expect(typeof bid[0]).toBe('number'); // price
        expect(typeof bid[1]).toBe('number'); // size
        expect(bid[0]).toBeGreaterThan(0); // price > 0
        expect(bid[0]).toBeLessThan(1); // price < 1 (prediction market)
        expect(bid[1]).toBeGreaterThan(0); // size > 0
      }

      // Verify bids are sorted descending by price
      for (let i = 1; i < ob.bids.length; i++) {
        expect(ob.bids[i - 1]![0]).toBeGreaterThanOrEqual(ob.bids[i]![0]);
      }
      // Verify asks are sorted ascending by price
      for (let i = 1; i < ob.asks.length; i++) {
        expect(ob.asks[i - 1]![0]).toBeLessThanOrEqual(ob.asks[i]![0]);
      }
    }, 30_000);
  });

  describe('REST: price-history', () => {
    test('GET /api/v1/price-history returns candles with correct structure', async () => {
      const markets = await client.markets.list({ exchanges: ['kalshi'], limit: 5 });
      const market = markets.markets.find((m) => m.status === 'active' && m.outcomes.length > 0);
      expect(market).toBeDefined();

      const history = await client.priceHistory.retrieve({
        parsec_id: market!.parsec_id,
        outcome: market!.outcomes[0]!,
        interval: '1h',
      });
      expect(history).toHaveProperty('candles');
      expect(Array.isArray(history.candles)).toBe(true);

      // Active markets should have at least some recent candles
      if (history.candles.length > 0) {
        const candle = history.candles[0]!;
        // Candles should have OHLC-like fields
        expect(typeof candle.t).toBe('number'); // timestamp
        expect(candle.t).toBeGreaterThan(0);
      }
    });
  });

  describe('REST: ws/usage', () => {
    test('GET /api/v1/ws/usage returns metering data', async () => {
      const usage = await client.websocket.usage();
      expect(typeof usage.scope).toBe('string');
      expect(usage.scope.length).toBeGreaterThan(0);
      expect(typeof usage.updated_at_ms).toBe('number');
      expect(usage.updated_at_ms).toBeGreaterThan(0);
      expect(typeof usage.totals).toBe('object');
      expect(usage.totals).not.toBeNull();
    });
  });

  describe('REST: orders', () => {
    test('POST /api/v1/orders returns 400 with error body on invalid params', async () => {
      try {
        await client.orders.create({
          exchange: 'kalshi',
          market_id: 'does-not-matter',
          outcome: 'yes',
          side: 'buy',
          price: 0.5,
          size: 1,
          params: { order_type: 'fok' },
        });
        throw new Error('expected APIError — should never reach here');
      } catch (err) {
        expect(err).toBeInstanceOf(APIError);
        const e = err as APIError;
        expect(e.status).toBe(400);
        expect(e.error).toHaveProperty('error');
        expect(typeof (e.error as any).error).toBe('string');
      }
    });

    test('GET /api/v1/orders returns array', async () => {
      const orders = await client.orders.list({ exchange: 'kalshi' });
      // API returns a bare array (empty when no active orders)
      expect(Array.isArray(orders)).toBe(true);
      // If any orders exist, verify structure
      if ((orders as any[]).length > 0) {
        const order = (orders as any[])[0];
        expect(order).toHaveProperty('order_id');
        expect(order).toHaveProperty('exchange');
      }
    });
  });

  describe('REST: positions', () => {
    test('GET /api/v1/positions returns array', async () => {
      const positions = await client.positions.list({ exchange: 'kalshi' });
      // API returns a bare array (empty when no positions)
      expect(Array.isArray(positions)).toBe(true);
      // If any positions exist, verify structure
      if ((positions as any[]).length > 0) {
        const pos = (positions as any[])[0];
        expect(pos).toHaveProperty('market_id');
        expect(pos).toHaveProperty('exchange');
      }
    });
  });

  describe('REST: account', () => {
    test('GET /api/v1/ping returns exchange connectivity status', async () => {
      const ping = await client.account.ping({ exchange: 'kalshi' });
      expect(ping).toBeDefined();
      // Ping response should contain connectivity info
      expect(typeof ping).toBe('object');
    });
  });

  describe('REST: authentication', () => {
    test('returns 401 with error body for invalid API key', async () => {
      const bad = new ParsecAPI({ apiKey: 'invalid-api-key', baseURL: BASE_URL });
      try {
        await bad.exchanges.list();
        throw new Error('expected APIError — should never reach here');
      } catch (err) {
        expect(err).toBeInstanceOf(APIError);
        const e = err as APIError;
        expect(e.status).toBe(401);
        expect(e.error).toHaveProperty('error');
      }
    });
  });

  // ── WebSocket contract tests ─────────────────────────────

  describe('WebSocket contract tests (live server)', () => {
    /** Find active markets with actual orderbook depth for WS tests.
     *  Probes each market's orderbook to avoid picking empty/illiquid ones. */
    async function findActiveMarketsWithDepth(
      count: number = 1,
    ): Promise<Array<{ parsecId: string; outcome: string }>> {
      const resp = await client.markets.list({ exchanges: ['kalshi'], limit: 30 });
      const result: Array<{ parsecId: string; outcome: string }> = [];
      for (const m of resp.markets) {
        if (m.status !== 'active' || m.outcomes.length === 0) continue;
        const ob = await client.orderbook.retrieve({
          parsec_id: m.parsec_id,
          outcome: m.outcomes[0]!,
        });
        if (ob.bids.length + ob.asks.length > 0) {
          result.push({ parsecId: m.parsec_id, outcome: m.outcomes[0]! });
          if (result.length >= count) break;
        }
      }
      if (result.length < count) {
        throw new Error(`Need ${count} markets with depth, found ${result.length}`);
      }
      return result;
    }

    test('connects, authenticates, subscribes, and receives valid orderbook snapshot', async () => {
      const [market] = await findActiveMarketsWithDepth(1);
      const ws = client.ws();

      const books: OrderbookSnapshot[] = [];
      const errors: any[] = [];

      ws.on('orderbook', (book) => books.push(book));
      ws.on('error', (err) => errors.push(err));

      await ws.connect();

      try {
        ws.subscribe({ parsecId: market!.parsecId, outcome: market!.outcome });

        const deadline = Date.now() + 20_000;
        while (books.length === 0 && Date.now() < deadline) {
          await new Promise((r) => setTimeout(r, 200));
        }

        expect(errors).toEqual([]);
        expect(books.length).toBeGreaterThanOrEqual(1);

        const book = books[0]!;

        // ── Identity: matches what we subscribed to ──
        expect(book.parsecId).toBe(market!.parsecId);
        expect(book.outcome).toBe(market!.outcome);
        expect(book.kind).toBe('snapshot');

        // ── Structure: all expected fields present with correct types ──
        expect(Array.isArray(book.bids)).toBe(true);
        expect(Array.isArray(book.asks)).toBe(true);
        expect(typeof book.serverSeq).toBe('number');
        expect(book.serverSeq).toBeGreaterThan(0);
        expect(['healthy', 'degraded', 'disconnected']).toContain(book.feedState);
        expect(['fresh', 'stale']).toContain(book.bookState);
        expect(typeof book.midPrice).toBe('number');
        expect(typeof book.spread).toBe('number');
        expect(book.spread).toBeGreaterThanOrEqual(0);

        // ── Content: at least one side should have levels for an active market ──
        const totalLevels = book.bids.length + book.asks.length;
        expect(totalLevels).toBeGreaterThan(0);

        // ── Level structure: WS client transforms [[p,s]] → { price, size } ──
        if (book.bids.length > 0) {
          expect(typeof book.bids[0]!.price).toBe('number');
          expect(typeof book.bids[0]!.size).toBe('number');
          expect(book.bids[0]!.price).toBeGreaterThan(0);
          expect(book.bids[0]!.price).toBeLessThan(1);
          expect(book.bids[0]!.size).toBeGreaterThan(0);
        }
        if (book.asks.length > 0) {
          expect(typeof book.asks[0]!.price).toBe('number');
          expect(typeof book.asks[0]!.size).toBe('number');
          expect(book.asks[0]!.price).toBeGreaterThan(0);
          expect(book.asks[0]!.price).toBeLessThanOrEqual(1);
          expect(book.asks[0]!.size).toBeGreaterThan(0);
        }

        // ── Ordering: bids descending, asks ascending ──
        for (let i = 1; i < book.bids.length; i++) {
          expect(book.bids[i - 1]!.price).toBeGreaterThanOrEqual(book.bids[i]!.price);
        }
        for (let i = 1; i < book.asks.length; i++) {
          expect(book.asks[i - 1]!.price).toBeLessThanOrEqual(book.asks[i]!.price);
        }

        // ── Consistency: midPrice and spread match the book ──
        if (book.bids.length > 0 && book.asks.length > 0) {
          const bestBid = book.bids[0]!.price;
          const bestAsk = book.asks[0]!.price;
          expect(book.midPrice).toBeCloseTo((bestBid + bestAsk) / 2, 4);
          expect(book.spread).toBeCloseTo(bestAsk - bestBid, 4);
          expect(bestAsk).toBeGreaterThanOrEqual(bestBid); // no crossed book
        }
      } finally {
        ws.close();
      }
    }, 45_000);

    test('batch subscribe to 2 markets receives 2 distinct snapshots', async () => {
      const markets = await findActiveMarketsWithDepth(2);
      const ws = client.ws();

      const books: OrderbookSnapshot[] = [];
      ws.on('orderbook', (book) => books.push(book));

      await ws.connect();

      try {
        ws.subscribe(markets.map((m) => ({ parsecId: m.parsecId, outcome: m.outcome })));

        const deadline = Date.now() + 20_000;
        while (books.length < 2 && Date.now() < deadline) {
          await new Promise((r) => setTimeout(r, 200));
        }

        expect(books.length).toBeGreaterThanOrEqual(2);

        // Each market should have its own snapshot — verify distinct parsecIds
        const ids = new Set(books.map((b) => b.parsecId));
        expect(ids.size).toBe(2);
        expect(ids).toEqual(new Set(markets.map((m) => m.parsecId)));

        // Both must be snapshots with valid structure
        for (const book of books.slice(0, 2)) {
          expect(book.kind).toBe('snapshot');
          expect(Array.isArray(book.bids)).toBe(true);
          expect(Array.isArray(book.asks)).toBe(true);
          expect(typeof book.serverSeq).toBe('number');
        }
      } finally {
        ws.close();
      }
    }, 45_000);

    test('unsubscribe stops receiving updates for that market', async () => {
      const [market] = await findActiveMarketsWithDepth(1);
      const ws = client.ws();

      const books: OrderbookSnapshot[] = [];
      ws.on('orderbook', (book) => books.push(book));

      await ws.connect();

      try {
        ws.subscribe({ parsecId: market!.parsecId, outcome: market!.outcome });

        // Wait for first snapshot
        const deadline = Date.now() + 20_000;
        while (books.length === 0 && Date.now() < deadline) {
          await new Promise((r) => setTimeout(r, 200));
        }
        expect(books.length).toBeGreaterThanOrEqual(1);
        expect(books[0]!.kind).toBe('snapshot'); // got the initial snapshot

        const countAfterSub = books.length;
        ws.unsubscribe({ parsecId: market!.parsecId, outcome: market!.outcome });

        // Wait 3s — with polling every 3s, should get at most 1-2 in-flight messages
        await new Promise((r) => setTimeout(r, 3000));
        expect(books.length).toBeLessThanOrEqual(countAfterSub + 2);
      } finally {
        ws.close();
      }
    }, 30_000);

    test('auth_error on invalid API key — rejects connect and does not hang', async () => {
      const bad = new ParsecAPI({ apiKey: 'pk_invalid_key', baseURL: BASE_URL });
      const ws = bad.ws();

      await expect(ws.connect()).rejects.toThrow();

      ws.close();
    }, 15_000);
  });
}
