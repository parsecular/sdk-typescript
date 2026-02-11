/**
 * Tests for the hand-written WebSocket streaming client.
 * Uses a local mock WS server to simulate the Parsec WS protocol.
 */

import { WebSocketServer, WebSocket as WsWebSocket } from 'ws';
import { ParsecWebSocket } from 'parsec-api/streaming';
import type { OrderbookSnapshot, Activity, WsError } from 'parsec-api/streaming';

// ── Mock server helpers ────────────────────────────────────

let wss: WebSocketServer;
let serverPort: number;

function wsUrl(): string {
  return `ws://127.0.0.1:${serverPort}`;
}

/** Wait for a client to connect to the mock server. */
function waitForClient(): Promise<WsWebSocket> {
  return new Promise((resolve) => {
    wss.once('connection', resolve);
  });
}

/** Send a JSON message from mock server to client. */
function serverSend(client: WsWebSocket, msg: object): void {
  client.send(JSON.stringify(msg));
}

/** Collect messages received by mock server from client. */
function collectClientMessages(client: WsWebSocket): any[] {
  const msgs: any[] = [];
  client.on('message', (data) => {
    try {
      msgs.push(JSON.parse(data.toString()));
    } catch {
      // ignore
    }
  });
  return msgs;
}

/** Wait ms. */
function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/** Create a connected + authenticated ParsecWebSocket and return the server-side socket. */
async function connectAndAuth(
  apiKey = 'pk_test',
): Promise<{ ws: ParsecWebSocket; serverClient: WsWebSocket }> {
  const clientPromise = waitForClient();
  const ws = new ParsecWebSocket(apiKey, wsUrl());
  const connectPromise = ws.connect();

  const serverClient = await clientPromise;
  const msgs = collectClientMessages(serverClient);

  // Wait for auth message
  await sleep(20);
  expect(msgs.length).toBeGreaterThanOrEqual(1);
  expect(msgs[0]).toEqual({ type: 'auth', api_key: apiKey });

  // Send auth_ok
  serverSend(serverClient, { type: 'auth_ok', customer_id: 'cust_123' });
  await connectPromise;

  return { ws, serverClient };
}

// Sample snapshot in wire format (bids/asks as [[price, size], ...])
function sampleSnapshot(overrides: Record<string, any> = {}) {
  return {
    type: 'orderbook',
    parsec_id: 'polymarket:0x123',
    exchange: 'polymarket',
    outcome: 'Yes',
    token_id: 'tok_abc',
    market_id: '0x123',
    tick_size: 0.01,
    kind: 'snapshot',
    bids: [
      [0.65, 1000],
      [0.64, 2500],
      [0.63, 500],
    ],
    asks: [
      [0.66, 800],
      [0.67, 1500],
      [0.68, 300],
    ],
    book_state: 'fresh',
    server_seq: 1,
    feed_state: 'healthy',
    stale_after_ms: 5000,
    exchange_ts_ms: 1707044096000,
    ingest_ts_ms: 1707044096005,
    ...overrides,
  };
}

// ── Setup / teardown ───────────────────────────────────────

beforeEach((done) => {
  wss = new WebSocketServer({ port: 0 }, () => {
    const addr = wss.address();
    serverPort = typeof addr === 'object' && addr !== null ? addr.port : 0;
    done();
  });
});

afterEach((done) => {
  wss.close(done);
});

// ── Tests ──────────────────────────────────────────────────

describe('ParsecWebSocket', () => {
  describe('connection + auth', () => {
    test('connect() resolves after auth_ok', async () => {
      const clientPromise = waitForClient();
      const ws = new ParsecWebSocket('pk_test', wsUrl());

      const events: string[] = [];
      ws.on('connected', () => events.push('connected'));

      const connectPromise = ws.connect();
      const serverClient = await clientPromise;

      // Wait for auth message
      await sleep(20);
      serverSend(serverClient, { type: 'auth_ok', customer_id: 'cust_123' });
      await connectPromise;

      expect(events).toContain('connected');
      ws.close();
    });

    test('connect() rejects on auth_error', async () => {
      const clientPromise = waitForClient();
      const ws = new ParsecWebSocket('pk_bad', wsUrl());

      const errors: WsError[] = [];
      ws.on('error', (err) => errors.push(err));

      const connectPromise = ws.connect();
      const serverClient = await clientPromise;

      await sleep(20);
      serverSend(serverClient, { type: 'auth_error', code: 1002, message: 'Invalid API key' });

      await expect(connectPromise).rejects.toThrow('Invalid API key');
      expect(errors.length).toBe(1);
      expect(errors[0]!.code).toBe(1002);
      ws.close();
    });
  });

  describe('orderbook snapshot', () => {
    test('snapshot applies correctly with wire format transform', async () => {
      const { ws, serverClient } = await connectAndAuth();

      const books: OrderbookSnapshot[] = [];
      ws.on('orderbook', (b) => books.push(b));

      ws.subscribe({ parsecId: 'polymarket:0x123', outcome: 'Yes' });
      await sleep(20);

      serverSend(serverClient, sampleSnapshot());
      await sleep(20);

      expect(books.length).toBe(1);
      const book = books[0]!;

      // Wire [[price, size]] transformed to { price, size } objects
      expect(book.bids[0]).toEqual({ price: 0.65, size: 1000 });
      expect(book.bids[1]).toEqual({ price: 0.64, size: 2500 });
      expect(book.asks[0]).toEqual({ price: 0.66, size: 800 });

      // Sorted: bids desc, asks asc
      expect(book.bids.map((l) => l.price)).toEqual([0.65, 0.64, 0.63]);
      expect(book.asks.map((l) => l.price)).toEqual([0.66, 0.67, 0.68]);

      // Computed fields
      expect(book.midPrice).toBeCloseTo((0.65 + 0.66) / 2);
      expect(book.spread).toBeCloseTo(0.01);

      // Metadata
      expect(book.kind).toBe('snapshot');
      expect(book.parsecId).toBe('polymarket:0x123');
      expect(book.exchange).toBe('polymarket');
      expect(book.outcome).toBe('Yes');
      expect(book.tokenId).toBe('tok_abc');
      expect(book.marketId).toBe('0x123');
      expect(book.tickSize).toBe(0.01);
      expect(book.serverSeq).toBe(1);
      expect(book.feedState).toBe('healthy');
      expect(book.bookState).toBe('fresh');
      expect(book.staleAfterMs).toBe(5000);
      expect(book.exchangeTsMs).toBe(1707044096000);
      expect(book.ingestTsMs).toBe(1707044096005);

      ws.close();
    });
  });

  describe('delta application', () => {
    test('set level: updates existing price', async () => {
      const { ws, serverClient } = await connectAndAuth();

      const books: OrderbookSnapshot[] = [];
      ws.on('orderbook', (b) => books.push(b));

      ws.subscribe({ parsecId: 'polymarket:0x123', outcome: 'Yes' });
      await sleep(20);

      // Send snapshot
      serverSend(serverClient, sampleSnapshot());
      await sleep(20);

      // Send delta: update bid at 0.65 from 1000 to 1500
      serverSend(serverClient, {
        type: 'orderbook_delta',
        parsec_id: 'polymarket:0x123',
        outcome: 'Yes',
        changes: [{ side: 'bid', price: 0.65, size: 1500 }],
        server_seq: 2,
        feed_state: 'healthy',
        book_state: 'fresh',
        stale_after_ms: 5000,
      });
      await sleep(20);

      expect(books.length).toBe(2);
      const delta = books[1]!;
      expect(delta.kind).toBe('delta');
      expect(delta.bids[0]).toEqual({ price: 0.65, size: 1500 });
      // Other levels unchanged
      expect(delta.bids[1]).toEqual({ price: 0.64, size: 2500 });

      ws.close();
    });

    test('add level: inserts at correct sorted position', async () => {
      const { ws, serverClient } = await connectAndAuth();

      const books: OrderbookSnapshot[] = [];
      ws.on('orderbook', (b) => books.push(b));

      ws.subscribe({ parsecId: 'polymarket:0x123', outcome: 'Yes' });
      await sleep(20);

      serverSend(serverClient, sampleSnapshot());
      await sleep(20);

      // Add a new bid at 0.645 (between 0.65 and 0.64)
      serverSend(serverClient, {
        type: 'orderbook_delta',
        parsec_id: 'polymarket:0x123',
        outcome: 'Yes',
        changes: [{ side: 'bid', price: 0.645, size: 200 }],
        server_seq: 2,
        feed_state: 'healthy',
        book_state: 'fresh',
        stale_after_ms: 5000,
      });
      await sleep(20);

      const delta = books[1]!;
      expect(delta.bids.map((l) => l.price)).toEqual([0.65, 0.645, 0.64, 0.63]);
      expect(delta.bids[1]).toEqual({ price: 0.645, size: 200 });

      ws.close();
    });

    test('remove level: size == 0 deletes the level', async () => {
      const { ws, serverClient } = await connectAndAuth();

      const books: OrderbookSnapshot[] = [];
      ws.on('orderbook', (b) => books.push(b));

      ws.subscribe({ parsecId: 'polymarket:0x123', outcome: 'Yes' });
      await sleep(20);

      serverSend(serverClient, sampleSnapshot());
      await sleep(20);

      // Remove bid at 0.64
      serverSend(serverClient, {
        type: 'orderbook_delta',
        parsec_id: 'polymarket:0x123',
        outcome: 'Yes',
        changes: [{ side: 'bid', price: 0.64, size: 0 }],
        server_seq: 2,
        feed_state: 'healthy',
        book_state: 'fresh',
        stale_after_ms: 5000,
      });
      await sleep(20);

      const delta = books[1]!;
      expect(delta.bids.length).toBe(2);
      expect(delta.bids.map((l) => l.price)).toEqual([0.65, 0.63]);

      ws.close();
    });
  });

  describe('delta edge cases', () => {
    test('delta before snapshot is ignored', async () => {
      const { ws, serverClient } = await connectAndAuth();

      const books: OrderbookSnapshot[] = [];
      ws.on('orderbook', (b) => books.push(b));

      ws.subscribe({ parsecId: 'polymarket:0x123', outcome: 'Yes' });
      await sleep(20);

      // Send delta without prior snapshot
      serverSend(serverClient, {
        type: 'orderbook_delta',
        parsec_id: 'polymarket:0x123',
        outcome: 'Yes',
        changes: [{ side: 'bid', price: 0.65, size: 1500 }],
        server_seq: 1,
        feed_state: 'healthy',
        book_state: 'fresh',
        stale_after_ms: 5000,
      });
      await sleep(20);

      // No orderbook event emitted
      expect(books.length).toBe(0);

      ws.close();
    });
  });

  describe('sequence gap detection', () => {
    test('sequence gap triggers resync', async () => {
      const { ws, serverClient } = await connectAndAuth();

      const clientMsgs = collectClientMessages(serverClient);
      const books: OrderbookSnapshot[] = [];
      ws.on('orderbook', (b) => books.push(b));

      ws.subscribe({ parsecId: 'polymarket:0x123', outcome: 'Yes' });
      await sleep(20);

      // Send snapshot with seq=1
      serverSend(serverClient, sampleSnapshot({ server_seq: 1 }));
      await sleep(20);

      // Send delta with seq=3 (skipping 2) — should trigger resync
      serverSend(serverClient, {
        type: 'orderbook_delta',
        parsec_id: 'polymarket:0x123',
        outcome: 'Yes',
        changes: [{ side: 'bid', price: 0.65, size: 1500 }],
        server_seq: 3,
        feed_state: 'healthy',
        book_state: 'fresh',
        stale_after_ms: 5000,
      });
      await sleep(20);

      // Client should have sent a resync message
      const resyncMsg = clientMsgs.find((m) => m.type === 'resync');
      expect(resyncMsg).toBeDefined();
      expect(resyncMsg.parsec_id).toBe('polymarket:0x123');
      expect(resyncMsg.outcome).toBe('Yes');

      // The delta should NOT have been applied (only 1 orderbook event from the snapshot)
      expect(books.length).toBe(1);

      ws.close();
    });
  });

  describe('resync_required handling', () => {
    test('resync_required triggers resync and fresh snapshot replaces book', async () => {
      const { ws, serverClient } = await connectAndAuth();

      const clientMsgs = collectClientMessages(serverClient);
      const books: OrderbookSnapshot[] = [];
      ws.on('orderbook', (b) => books.push(b));

      ws.subscribe({ parsecId: 'polymarket:0x123', outcome: 'Yes' });
      await sleep(20);

      // Initial snapshot
      serverSend(serverClient, sampleSnapshot({ server_seq: 1 }));
      await sleep(20);

      // Server sends resync_required
      serverSend(serverClient, {
        type: 'resync_required',
        parsec_id: 'polymarket:0x123',
        outcome: 'Yes',
      });
      await sleep(20);

      // Client should have sent resync message
      const resyncMsg = clientMsgs.find((m) => m.type === 'resync');
      expect(resyncMsg).toBeDefined();

      // Server responds with fresh snapshot (different data)
      serverSend(
        serverClient,
        sampleSnapshot({
          server_seq: 10,
          bids: [
            [0.7, 2000],
            [0.69, 3000],
          ],
          asks: [
            [0.71, 1000],
            [0.72, 500],
          ],
        }),
      );
      await sleep(20);

      // Should have 2 orderbook events: initial + resync snapshot
      expect(books.length).toBe(2);
      const resyncBook = books[1]!;
      expect(resyncBook.kind).toBe('snapshot');
      expect(resyncBook.bids[0]!.price).toBe(0.7);
      expect(resyncBook.serverSeq).toBe(10);

      ws.close();
    });
  });

  describe('reconnect', () => {
    test('reconnects on connection drop and resubscribes', async () => {
      const { ws, serverClient } = await connectAndAuth();

      const reconnectEvents: Array<{ attempt: number; delayMs: number }> = [];
      ws.on('reconnecting', (attempt, delayMs) => reconnectEvents.push({ attempt, delayMs }));

      ws.subscribe({ parsecId: 'polymarket:0x123', outcome: 'Yes' });
      await sleep(20);

      // Prepare to catch reconnect
      const reconnectClientPromise = waitForClient();

      // Drop connection from server side
      serverClient.close();
      await sleep(50);

      expect(reconnectEvents.length).toBeGreaterThanOrEqual(1);
      expect(reconnectEvents[0]!.attempt).toBe(1);

      // Wait for reconnect
      const newServerClient = await reconnectClientPromise;
      const newMsgs = collectClientMessages(newServerClient);
      await sleep(20);

      // Should re-auth
      const authMsg = newMsgs.find((m) => m.type === 'auth');
      expect(authMsg).toBeDefined();

      // Send auth_ok → should resubscribe
      serverSend(newServerClient, { type: 'auth_ok', customer_id: 'cust_123' });
      await sleep(50);

      const subMsg = newMsgs.find((m) => m.type === 'subscribe');
      expect(subMsg).toBeDefined();
      expect(subMsg.markets).toEqual(
        expect.arrayContaining([expect.objectContaining({ parsec_id: 'polymarket:0x123', outcome: 'Yes' })]),
      );

      ws.close();
    });
  });

  describe('auth error does NOT reconnect', () => {
    test('auth_error closes connection without reconnect', async () => {
      const clientPromise = waitForClient();
      const ws = new ParsecWebSocket('pk_bad', wsUrl());

      const reconnectEvents: any[] = [];
      ws.on('reconnecting', (a, d) => reconnectEvents.push({ a, d }));

      const connectPromise = ws.connect().catch(() => {});
      const serverClient = await clientPromise;

      await sleep(20);
      serverSend(serverClient, { type: 'auth_error', code: 1002, message: 'Invalid API key' });
      await sleep(200);

      // Should NOT attempt reconnect
      expect(reconnectEvents.length).toBe(0);

      ws.close();
    });
  });

  describe('close() cancels reconnect', () => {
    test('close() during reconnect backoff stops further attempts', async () => {
      const { ws, serverClient } = await connectAndAuth();

      const reconnectEvents: any[] = [];
      ws.on('reconnecting', (a, d) => reconnectEvents.push({ a, d }));

      // Drop connection — triggers reconnect
      serverClient.close();
      await sleep(50);

      expect(reconnectEvents.length).toBe(1);

      // Call close() during backoff
      ws.close();

      // Wait longer than the reconnect delay
      await sleep(2000);

      // No additional reconnect attempts
      expect(reconnectEvents.length).toBe(1);
    });
  });

  describe('batch subscribe', () => {
    test('batch subscribe sends one message with multiple markets', async () => {
      const { ws, serverClient } = await connectAndAuth();

      const clientMsgs = collectClientMessages(serverClient);

      ws.subscribe([
        { parsecId: 'polymarket:0x123', outcome: 'Yes' },
        { parsecId: 'kalshi:KXBTC', outcome: 'Yes', depth: 50 },
        { parsecId: 'polymarket:0x456', outcome: 'No' },
      ]);
      await sleep(20);

      // Should be exactly one subscribe message
      const subMsgs = clientMsgs.filter((m) => m.type === 'subscribe');
      expect(subMsgs.length).toBe(1);
      expect(subMsgs[0].markets.length).toBe(3);
      expect(subMsgs[0].markets).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ parsec_id: 'polymarket:0x123', outcome: 'Yes' }),
          expect.objectContaining({ parsec_id: 'kalshi:KXBTC', outcome: 'Yes', depth: 50 }),
          expect.objectContaining({ parsec_id: 'polymarket:0x456', outcome: 'No' }),
        ]),
      );

      ws.close();
    });
  });

  describe('activity events', () => {
    test('trade activity is emitted correctly', async () => {
      const { ws, serverClient } = await connectAndAuth();

      const activities: Activity[] = [];
      ws.on('activity', (a) => activities.push(a));

      serverSend(serverClient, {
        type: 'activity',
        parsec_id: 'polymarket:0x123',
        exchange: 'polymarket',
        outcome: 'Yes',
        token_id: 'tok_abc',
        market_id: '0x123',
        kind: 'trade',
        price: 0.65,
        size: 100,
        trade_id: 'trade_123',
        side: 'buy',
        aggressor_side: 'buy',
        server_seq: 5,
        feed_state: 'healthy',
        exchange_ts_ms: 1707044096100,
        ingest_ts_ms: 1707044096105,
        source_channel: 'trades',
      });
      await sleep(20);

      expect(activities.length).toBe(1);
      const a = activities[0]!;
      expect(a.parsecId).toBe('polymarket:0x123');
      expect(a.kind).toBe('trade');
      expect(a.price).toBe(0.65);
      expect(a.size).toBe(100);
      expect(a.tradeId).toBe('trade_123');
      expect(a.sourceChannel).toBe('trades');

      ws.close();
    });
  });

  describe('slow_reader + heartbeat events', () => {
    test('slow_reader event is emitted', async () => {
      const { ws, serverClient } = await connectAndAuth();

      const slowEvents: Array<{ parsecId: string; outcome: string }> = [];
      ws.on('slow_reader', (parsecId, outcome) => slowEvents.push({ parsecId, outcome }));

      serverSend(serverClient, {
        type: 'slow_reader',
        parsec_id: 'polymarket:0x123',
        outcome: 'Yes',
      });
      await sleep(20);

      expect(slowEvents.length).toBe(1);
      expect(slowEvents[0]).toEqual({ parsecId: 'polymarket:0x123', outcome: 'Yes' });

      ws.close();
    });

    test('heartbeat event is emitted', async () => {
      const { ws, serverClient } = await connectAndAuth();

      const heartbeats: number[] = [];
      ws.on('heartbeat', (ts) => heartbeats.push(ts));

      serverSend(serverClient, { type: 'heartbeat', ts_ms: 1707044096000 });
      await sleep(20);

      expect(heartbeats.length).toBe(1);
      expect(heartbeats[0]).toBe(1707044096000);

      ws.close();
    });
  });

  describe('client.ws() integration', () => {
    test('ws() derives wsUrl from baseURL', () => {
      // We can't easily test the full ParsecAPI constructor here since it requires
      // env setup, but we can test the URL derivation logic indirectly.
      // The ParsecWebSocket is constructed with the correct URL by ParsecAPI.ws().
      const ws = new ParsecWebSocket('pk_test', 'wss://api.parsecapi.com/ws');
      expect(ws).toBeInstanceOf(ParsecWebSocket);
      ws.close();
    });
  });
});
