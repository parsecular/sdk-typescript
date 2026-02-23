import ParsecAPI, { APIError } from 'parsec-api';
import type { OrderbookSnapshot } from 'parsec-api/streaming';

// These tests are intended to run against a real Parsec API server.
// They are opt-in so the default SDK CI remains fast/offline.
const RUN_LIVE = process.env['PARSEC_CONTRACT_TESTS'] === '1';

const BASE_URL =
  process.env['PARSEC_BASE_URL'] ?? process.env['TEST_API_BASE_URL'] ?? 'http://localhost:3000';
const API_KEY = process.env['PARSEC_API_KEY'];

const PUBLIC_ENDPOINT_CONTRACT_COVERAGE = [
  'GET /api/v1/exchanges',
  'GET /api/v1/markets',
  'GET /api/v1/orderbook',
  'GET /api/v1/price',
  'GET /api/v1/trades',
  'GET /api/v1/events',
  'GET /api/v1/ws/usage',
  'GET /api/v1/execution-price',
  'POST /api/v1/orders',
  'GET /api/v1/orders',
  'GET /api/v1/orders/{order_id}',
  'DELETE /api/v1/orders/{order_id}',
  'GET /api/v1/positions',
  'GET /api/v1/balance',
  'GET /api/v1/ping',
  'GET /api/v1/user-activity',
  'GET /api/v1/approvals',
  'POST /api/v1/approvals',
  'PUT /api/v1/credentials',
  'GET /api/v1/session/capabilities',
] as const;

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
  type MarketSelection = { parsecId: string; outcome: string; exchange: string };

  let privateExchangeCache: { exchange: string; hasCredentials: boolean } | null = null;

  function assertAPIError(err: unknown, allowedStatuses: number[]): APIError {
    expect(err).toBeInstanceOf(APIError);
    const apiErr = err as APIError;
    expect(allowedStatuses).toContain(apiErr.status);
    expect(apiErr.error).toHaveProperty('error');
    expect(typeof (apiErr.error as any).error).toBe('string');
    return apiErr;
  }

  async function resolvePrivateExchange(): Promise<{ exchange: string; hasCredentials: boolean }> {
    if (privateExchangeCache) {
      return privateExchangeCache;
    }

    const ping = await client.account.ping();
    if (Array.isArray(ping) && ping.length > 0) {
      const authenticated = ping.find((entry) => entry.has_credentials && entry.authenticated);
      const withCreds = ping.find((entry) => entry.has_credentials);
      const selected = authenticated ?? withCreds ?? ping[0]!;

      privateExchangeCache = {
        exchange: selected.exchange,
        hasCredentials: Boolean(authenticated ?? withCreds),
      };
      return privateExchangeCache;
    }

    privateExchangeCache = { exchange: 'kalshi', hasCredentials: false };
    return privateExchangeCache;
  }

  async function findActiveMarketWithOutcome(): Promise<MarketSelection> {
    for (const exchange of ['kalshi', 'polymarket']) {
      const resp = await client.markets.list({
        exchanges: [exchange],
        status: 'active',
        limit: 50,
      });

      const market = resp.markets.find((m) => m.outcomes.length > 0);
      if (market) {
        return {
          parsecId: market.parsec_id,
          outcome: market.outcomes[0]!.name,
          exchange,
        };
      }
    }

    throw new Error('No active market with outcomes found');
  }

  async function findActiveMarketsWithDepth(count: number = 1): Promise<MarketSelection[]> {
    const result: MarketSelection[] = [];

    for (const exchange of ['kalshi', 'polymarket']) {
      if (result.length >= count) break;
      const resp = await client.markets.list({
        exchanges: [exchange],
        status: 'active',
        min_volume: 10000,
        limit: 50,
      });

      for (const market of resp.markets) {
        if (market.outcomes.length === 0) continue;
        const book = await client.orderbook.retrieve({
          parsec_id: market.parsec_id,
          outcome: market.outcomes[0]!.name,
        });
        if (book.bids.length + book.asks.length > 0) {
          result.push({
            parsecId: market.parsec_id,
            outcome: market.outcomes[0]!.name,
            exchange,
          });
          if (result.length >= count) break;
        }
      }
    }

    if (result.length < count) {
      throw new Error(`Need ${count} markets with depth, found ${result.length}`);
    }
    return result;
  }

  // ── REST contract tests ──────────────────────────────────

  describe('REST: coverage manifest', () => {
    test('declares unique public endpoint operations', async () => {
      const unique = new Set(PUBLIC_ENDPOINT_CONTRACT_COVERAGE);
      expect(unique.size).toBe(PUBLIC_ENDPOINT_CONTRACT_COVERAGE.length);
    });
  });

  describe('REST: exchanges', () => {
    test('GET /api/v1/exchanges returns capability objects', async () => {
      const exchanges = await client.exchanges.list();
      expect(Array.isArray(exchanges)).toBe(true);
      expect(exchanges.length).toBeGreaterThan(0);
      expect(typeof exchanges[0]!.id).toBe('string');
      expect(typeof exchanges[0]!.name).toBe('string');
      expect(typeof exchanges[0]!.has).toBe('object');
      const caps = exchanges[0]!.has;
      expect(typeof caps.fetch_markets).toBe('boolean');
      expect(typeof caps.create_order).toBe('boolean');
      expect(typeof caps.cancel_order).toBe('boolean');
      expect(typeof caps.fetch_positions).toBe('boolean');
      expect(typeof caps.fetch_balance).toBe('boolean');
      expect(typeof caps.fetch_orderbook).toBe('boolean');
      expect(typeof caps.fetch_price_history).toBe('boolean');
      expect(typeof caps.fetch_trades).toBe('boolean');
      expect(typeof caps.fetch_events).toBe('boolean');
      expect(typeof caps.fetch_user_activity).toBe('boolean');
      expect(typeof caps.approvals).toBe('boolean');
      expect(typeof caps.refresh_balance).toBe('boolean');
      expect(typeof caps.websocket).toBe('boolean');
      expect(exchanges.some((ex) => ex.id === 'kalshi')).toBe(true);
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
      expect(typeof market.outcomes[0]!.name).toBe('string');
      expect(typeof market.status).toBe('string');
      expect(market.status.length).toBeGreaterThan(0);
      expect(typeof market.question).toBe('string');
      expect(market.question.length).toBeGreaterThan(0);
    }, 30_000);

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

  describe('REST: events', () => {
    test('GET /api/v1/events returns paginated event list with correct shape', async () => {
      const resp = await client.events.list({ exchanges: ['kalshi'], limit: 3 });
      expect(resp).toHaveProperty('events');
      expect(Array.isArray(resp.events)).toBe(true);
      expect(resp.events.length).toBeGreaterThan(0);
      expect(resp.events.length).toBeLessThanOrEqual(3);

      const event = resp.events[0]!;
      expect(typeof event.event_id).toBe('string');
      expect(typeof event.title).toBe('string');
      expect(event.title.length).toBeGreaterThan(0);
      expect(typeof event.market_count).toBe('number');
      expect(event.market_count).toBeGreaterThan(0);
      expect(typeof event.total_volume).toBe('number');
      expect(Array.isArray(event.exchanges)).toBe(true);
      expect(typeof event.status).toBe('string');
    }, 60_000);

    test('GET /api/v1/events with include_markets returns nested markets', async () => {
      const resp = await client.events.list({ exchanges: ['kalshi'], limit: 1, include_markets: true });
      const event = resp.events[0]!;
      expect(event.markets).toBeDefined();
      expect(Array.isArray(event.markets)).toBe(true);
      if (event.markets!.length > 0) {
        const market = event.markets![0]!;
        expect(typeof market.parsec_id).toBe('string');
        expect(typeof market.question).toBe('string');
      }
    }, 60_000);
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
          outcome: m.outcomes[0]!.name,
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

  describe('REST: execution-price', () => {
    test('GET /api/v1/execution-price returns VWAP estimate shape', async () => {
      const markets = await client.markets.list({ exchanges: ['kalshi'], limit: 5 });
      const market = markets.markets.find((m) => m.outcomes.length > 0);
      expect(market).toBeDefined();

      const estimate = await client.executionPrice.retrieve({
        parsec_id: market!.parsec_id,
        outcome: market!.outcomes[0]!.name,
        side: 'buy',
        amount: 1,
      });

      expect(typeof estimate.filled_amount).toBe('number');
      expect(typeof estimate.total_cost).toBe('number');
      expect(typeof estimate.fully_filled).toBe('boolean');
      expect(typeof estimate.levels_consumed).toBe('number');
      if (estimate.avg_price !== null && estimate.avg_price !== undefined) {
        expect(typeof estimate.avg_price).toBe('number');
      }
      if (estimate.slippage !== null && estimate.slippage !== undefined) {
        expect(typeof estimate.slippage).toBe('number');
      }
      if (estimate.worst_price !== null && estimate.worst_price !== undefined) {
        expect(typeof estimate.worst_price).toBe('number');
      }
      if (estimate.fee_estimate !== null && estimate.fee_estimate !== undefined) {
        expect(typeof estimate.fee_estimate).toBe('number');
      }
      if (estimate.net_cost !== null && estimate.net_cost !== undefined) {
        expect(typeof estimate.net_cost).toBe('number');
      }
      if (estimate.fee_estimate != null && estimate.net_cost != null) {
        expect(estimate.net_cost).toBeCloseTo(estimate.total_cost + estimate.fee_estimate, 8);
      }
    });
  });

  describe('REST: price', () => {
    test('GET /api/v1/price returns candles with correct structure', async () => {
      const markets = await client.markets.list({ exchanges: ['kalshi'], limit: 5 });
      const market = markets.markets.find((m) => m.status === 'active' && m.outcomes.length > 0);
      expect(market).toBeDefined();

      const history = await client.price.retrieve({
        parsec_id: market!.parsec_id,
        outcome: market!.outcomes[0]!.name,
        interval: '1h',
      });
      expect(history).toHaveProperty('candles');
      expect(Array.isArray(history.candles)).toBe(true);

      // Active markets should have at least some recent candles
      if (history.candles.length > 0) {
        const candle = history.candles[0]!;
        // Candles should have OHLC-like fields
        expect(typeof candle.timestamp).toBe('string');
        expect(candle.timestamp.length).toBeGreaterThan(0);
      }
    });
  });

  describe('REST: trades', () => {
    test('GET /api/v1/trades returns normalized trade response shape', async () => {
      const market = await findActiveMarketWithOutcome();
      const resp = await client.trades.list({
        parsec_id: market.parsecId,
        outcome: market.outcome,
        limit: 10,
      });

      expect(resp.parsec_id).toBe(market.parsecId);
      expect(typeof resp.exchange).toBe('string');
      expect(typeof resp.outcome).toBe('string');
      expect(Array.isArray(resp.trades)).toBe(true);

      if (resp.trades.length > 0) {
        const trade = resp.trades[0]!;
        expect(typeof (trade as any).id).toBe('string');
        expect(typeof trade.price).toBe('number');
        expect(typeof trade.size).toBe('number');
      }
    }, 30_000);
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
    test('POST /api/v1/orders covers create-order contract path', async () => {
      // Use a deterministic exchange for negative-path coverage.
      const exchange = 'kalshi';
      try {
        await client.orders.create({
          exchange,
          market_id: 'does-not-matter',
          outcome: 'yes',
          side: 'buy',
          price: 0.5,
          size: 1,
          params: { order_type: 'fok' },
        });
        throw new Error('expected APIError — should never reach here');
      } catch (err) {
        assertAPIError(err, [400, 401, 403, 404, 501, 503]);
      }
    });

    test('GET /api/v1/orders returns array (or auth error when no linked creds)', async () => {
      const { exchange, hasCredentials } = await resolvePrivateExchange();
      try {
        const orders = await client.orders.list({ exchange });
        expect(Array.isArray(orders)).toBe(true);
        if ((orders as any[]).length > 0) {
          const order = (orders as any[])[0];
          expect(order).toHaveProperty('id');
          expect(order).toHaveProperty('market_id');
          expect(order).toHaveProperty('status');
        }
      } catch (err) {
        const allowed = hasCredentials ? [401, 403, 503] : [401, 403, 503];
        assertAPIError(err, allowed);
      }
    });

    test('GET /api/v1/orders/{order_id} returns not-found/auth error for unknown order', async () => {
      const exchange = 'kalshi';
      const missingOrderID = `contract-missing-${Date.now()}`;

      try {
        await client.orders.retrieve(missingOrderID, { exchange });
        throw new Error('expected APIError — should never reach here');
      } catch (err) {
        assertAPIError(err, [400, 401, 403, 404, 503]);
      }
    });

    test('DELETE /api/v1/orders/{order_id} returns not-found/auth error for unknown order', async () => {
      const exchange = 'kalshi';
      const missingOrderID = `contract-missing-${Date.now() + 1}`;

      try {
        await client.orders.cancel(missingOrderID, { exchange });
        throw new Error('expected APIError — should never reach here');
      } catch (err) {
        assertAPIError(err, [400, 401, 403, 404, 503]);
      }
    });
  });

  describe('REST: positions', () => {
    test('GET /api/v1/positions returns array (or auth error)', async () => {
      const { exchange } = await resolvePrivateExchange();
      try {
        const positions = await client.positions.list({ exchange });
        expect(Array.isArray(positions)).toBe(true);
        if ((positions as any[]).length > 0) {
          const pos = (positions as any[])[0];
          expect(pos).toHaveProperty('market_id');
          expect(pos).toHaveProperty('outcome');
          expect(pos).toHaveProperty('size');
        }
      } catch (err) {
        assertAPIError(err, [401, 403, 503]);
      }
    });
  });

  describe('REST: account', () => {
    test('GET /api/v1/ping returns exchange connectivity statuses', async () => {
      const ping = await client.account.ping();
      expect(Array.isArray(ping)).toBe(true);
      expect(ping.length).toBeGreaterThan(0);
      expect(typeof ping[0]!.exchange).toBe('string');
      expect(typeof ping[0]!.has_credentials).toBe('boolean');
      expect(typeof ping[0]!.authenticated).toBe('boolean');
    });

    test('GET /api/v1/session/capabilities returns tier + linked exchanges', async () => {
      const caps = await client.account.capabilities();
      expect(typeof caps.tier).toBe('string');
      expect(Array.isArray(caps.linked_exchanges)).toBe(true);
    });

    test('GET /api/v1/balance returns raw balance object (or auth error)', async () => {
      const { exchange, hasCredentials } = await resolvePrivateExchange();
      try {
        const balance = await client.account.balance({ exchange });
        expect(balance).toHaveProperty('raw');
        expect(typeof balance.raw).toBe('object');
        expect(balance.raw).not.toBeNull();
      } catch (err) {
        const allowed = hasCredentials ? [401, 403, 503] : [401, 403, 503];
        assertAPIError(err, allowed);
      }
    });

    test('GET /api/v1/user-activity returns status map', async () => {
      const activity = await client.account.userActivity({
        address: '0x0000000000000000000000000000000000000000',
        exchanges: ['polymarket'],
        limit: 1,
      });
      expect(typeof activity).toBe('object');
      expect(typeof activity.status).toBe('object');
      expect(activity.status).toHaveProperty('polymarket');
      expect(typeof activity.exchanges).toBe('object');
    });

    test('PUT /api/v1/credentials validates malformed kalshi credentials', async () => {
      try {
        await client.account.updateCredentials({
          api_key_id: 'bad-key-id',
          private_key: 'not-a-pem',
        });
        throw new Error('expected APIError — should never reach here');
      } catch (err) {
        assertAPIError(err, [400]);
      }
    });
  });

  describe('REST: approvals', () => {
    test('GET /api/v1/approvals rejects unsupported exchange with typed error body', async () => {
      try {
        await client.approvals.list({ exchange: 'kalshi' });
        throw new Error('expected APIError — should never reach here');
      } catch (err) {
        assertAPIError(err, [501]);
      }
    });

    test('POST /api/v1/approvals rejects unsupported exchange with typed error body', async () => {
      try {
        await client.approvals.set({ exchange: 'kalshi', all: true });
        throw new Error('expected APIError — should never reach here');
      } catch (err) {
        assertAPIError(err, [501]);
      }
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
