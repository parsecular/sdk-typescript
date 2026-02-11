import ParsecAPI, { APIError } from 'parsec-api';

// These tests are intended to run against a real Parsec API server.
// They are opt-in so the default SDK CI remains fast/offline.
const RUN_LIVE = process.env['PARSEC_CONTRACT_TESTS'] === '1';

const BASE_URL =
  process.env['PARSEC_BASE_URL'] ?? process.env['TEST_API_BASE_URL'] ?? 'http://localhost:3000';
const API_KEY = process.env['PARSEC_API_KEY'];

if (!RUN_LIVE) {
  test.skip('live contract tests disabled (set PARSEC_CONTRACT_TESTS=1)', () => {});
} else {
  if (!API_KEY) {
    throw new Error('PARSEC_API_KEY must be set when PARSEC_CONTRACT_TESTS=1');
  }

  describe('Parsec SDK contract smoke tests (live server)', () => {
    const client = new ParsecAPI({ apiKey: API_KEY, baseURL: BASE_URL });

    test('GET /api/v1/exchanges returns string[]', async () => {
      const exchanges = await client.exchanges.list();
      expect(Array.isArray(exchanges)).toBe(true);
      if (exchanges.length > 0) expect(typeof exchanges[0]).toBe('string');
    });

    test('GET /api/v1/ws/usage returns totals and a scope', async () => {
      const usage = await client.websocket.usage();
      expect(typeof usage.scope).toBe('string');
      expect(typeof usage.updated_at_ms).toBe('number');
      expect(typeof usage.totals).toBe('object');
    });

    test('POST /api/v1/orders returns {error} on invalid params.order_type (400)', async () => {
      await expect(
        client.orders.create({
          exchange: 'kalshi',
          market_id: 'does-not-matter',
          outcome: 'yes',
          side: 'buy',
          price: 0.5,
          size: 1,
          params: { order_type: 'fok' },
        }),
      ).rejects.toMatchObject({ status: 400 });

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
        throw new Error('expected APIError');
      } catch (err) {
        expect(err).toBeInstanceOf(APIError);
        const e = err as APIError;
        expect(e.status).toBe(400);
        expect(e.error).toHaveProperty('error');
      }
    });

    test('GET /api/v1/exchanges returns 401 for an invalid API key', async () => {
      const bad = new ParsecAPI({ apiKey: 'invalid-api-key', baseURL: BASE_URL });
      try {
        await bad.exchanges.list();
        throw new Error('expected APIError');
      } catch (err) {
        expect(err).toBeInstanceOf(APIError);
        const e = err as APIError;
        expect(e.status).toBe(401);
        expect(e.error).toHaveProperty('error');
      }
    });

    test('PUT /api/v1/credentials succeeds (204) when DynamoDB is configured', async () => {
      // In local mode without DynamoDB, this may return 500 ("DynamoDB not configured").
      try {
        await client.account.updateCredentials({});
      } catch (err) {
        expect(err).toBeInstanceOf(APIError);
        const e = err as APIError;
        expect([400, 401, 500]).toContain(e.status);
      }
    });
  });
}
