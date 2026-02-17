import fs from 'node:fs';
import path from 'node:path';

import SwaggerParser from '@apidevtools/swagger-parser';
import Ajv2020, { type ValidateFunction } from 'ajv/dist/2020';
import addFormats from 'ajv-formats';
import ParsecAPI, { APIError } from 'parsec-api';

type HttpMethod = 'get' | 'post' | 'put' | 'delete';

const RUN_LIVE = process.env['PARSEC_CONTRACT_TESTS'] === '1';

const BASE_URL =
  process.env['PARSEC_BASE_URL'] ?? process.env['TEST_API_BASE_URL'] ?? 'http://localhost:3000';
const API_KEY = process.env['PARSEC_API_KEY'];

function getOpenapiSpecFromStats(): string | null {
  try {
    const raw = fs.readFileSync(path.resolve(process.cwd(), '.stats.yml'), 'utf8');
    const match = raw.match(/^openapi_spec_url:\\s*(.+)$/m);
    return match ? match[1]!.trim() : null;
  } catch {
    return null;
  }
}

const OPENAPI_SPEC = process.env['PARSEC_OPENAPI_SPEC'] ?? getOpenapiSpecFromStats();

let api: any;
let ajv: Ajv2020;
const validatorCache = new Map<string, ValidateFunction>();

function getJsonSchema(pathKey: string, method: HttpMethod, status: number): any | undefined {
  const op = api?.paths?.[pathKey]?.[method];
  if (!op) {
    throw new Error(`OpenAPI operation not found: ${method.toUpperCase()} ${pathKey}`);
  }

  const resp = op?.responses?.[String(status)];
  if (!resp) {
    throw new Error(`OpenAPI response not found: ${method.toUpperCase()} ${pathKey} ${status}`);
  }

  const json = resp?.content?.['application/json'];
  return json?.schema;
}

function getValidator(pathKey: string, method: HttpMethod, status: number): ValidateFunction | null {
  const schema = getJsonSchema(pathKey, method, status);
  if (!schema) return null;

  const cacheKey = `${method.toUpperCase()} ${pathKey} ${status}`;
  const cached = validatorCache.get(cacheKey);
  if (cached) return cached;

  const validate = ajv.compile(schema);
  validatorCache.set(cacheKey, validate);
  return validate;
}

function expectValidJsonBody(pathKey: string, method: HttpMethod, status: number, body: unknown) {
  const validate = getValidator(pathKey, method, status);
  if (!validate) {
    throw new Error(`No JSON schema found for ${method.toUpperCase()} ${pathKey} ${status}`);
  }

  const ok = validate(body);
  if (!ok) {
    const detail = ajv.errorsText(validate.errors, { separator: '\n' });
    throw new Error(`Schema validation failed for ${method.toUpperCase()} ${pathKey} ${status}:\n${detail}`);
  }
}

if (!RUN_LIVE) {
  test.skip('live schema validation disabled (set PARSEC_CONTRACT_TESTS=1)', () => {});
} else {
  if (!API_KEY) {
    throw new Error('PARSEC_API_KEY must be set when PARSEC_CONTRACT_TESTS=1');
  }
  if (!OPENAPI_SPEC) {
    throw new Error('PARSEC_OPENAPI_SPEC must be set (or .stats.yml must contain openapi_spec_url)');
  }

  describe('OpenAPI schema validation (live responses)', () => {
    const client = new ParsecAPI({ apiKey: API_KEY, baseURL: BASE_URL });

    beforeAll(async () => {
      api = await SwaggerParser.dereference(OPENAPI_SPEC);
      ajv = new Ajv2020({ strict: false, allErrors: true, allowUnionTypes: true });
      addFormats(ajv);
    });

    test('GET /api/v1/exchanges (200) matches schema', async () => {
      const body = await client.exchanges.list();
      expectValidJsonBody('/api/v1/exchanges', 'get', 200, body);
    });

    test('GET /api/v1/markets (200) matches schema', async () => {
      const body = await client.markets.list({ exchanges: ['kalshi'], limit: 1 });
      expectValidJsonBody('/api/v1/markets', 'get', 200, body);
    });

    test('GET /api/v1/markets (400) matches schema when exchanges/parsec_ids are missing', async () => {
      try {
        await client.markets.list();
        throw new Error('expected APIError');
      } catch (err) {
        expect(err).toBeInstanceOf(APIError);
        const e = err as APIError;
        expect(e.status).toBe(400);
        expectValidJsonBody('/api/v1/markets', 'get', 400, e.error);
      }
    });

    test('GET /api/v1/orderbook (400) matches schema for invalid parsec_id', async () => {
      try {
        await client.orderbook.retrieve({ parsec_id: 'invalid' });
        throw new Error('expected APIError');
      } catch (err) {
        expect(err).toBeInstanceOf(APIError);
        const e = err as APIError;
        expect(e.status).toBe(400);
        expectValidJsonBody('/api/v1/orderbook', 'get', 400, e.error);
      }
    });

    test('GET /api/v1/orderbook (404) matches schema for unknown exchange', async () => {
      try {
        await client.orderbook.retrieve({ parsec_id: 'doesnotexist:1', outcome: 'yes' });
        throw new Error('expected APIError');
      } catch (err) {
        expect(err).toBeInstanceOf(APIError);
        const e = err as APIError;
        expect(e.status).toBe(404);
        expectValidJsonBody('/api/v1/orderbook', 'get', 404, e.error);
      }
    });

    test('GET /api/v1/ws/usage (200) matches schema', async () => {
      const body = await client.websocket.usage();
      expectValidJsonBody('/api/v1/ws/usage', 'get', 200, body);
    });

    test('GET /api/v1/orders (404) matches schema for unknown exchange', async () => {
      try {
        await client.orders.list({ exchange: 'doesnotexist' });
        throw new Error('expected APIError');
      } catch (err) {
        expect(err).toBeInstanceOf(APIError);
        const e = err as APIError;
        expect(e.status).toBe(404);
        expectValidJsonBody('/api/v1/orders', 'get', 404, e.error);
      }
    });

    test('GET /api/v1/positions (404) matches schema for unknown exchange', async () => {
      try {
        await client.positions.list({ exchange: 'doesnotexist' });
        throw new Error('expected APIError');
      } catch (err) {
        expect(err).toBeInstanceOf(APIError);
        const e = err as APIError;
        expect(e.status).toBe(404);
        expectValidJsonBody('/api/v1/positions', 'get', 404, e.error);
      }
    });

    test('POST /api/v1/orders (501) matches schema for unsupported params.order_type on exchange', async () => {
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
        expect(e.status).toBe(501);
        expectValidJsonBody('/api/v1/orders', 'post', 501, e.error);
      }
    });

    test('GET /api/v1/balance (404) matches schema for unknown exchange', async () => {
      try {
        await client.account.balance({ exchange: 'doesnotexist' });
        throw new Error('expected APIError');
      } catch (err) {
        expect(err).toBeInstanceOf(APIError);
        const e = err as APIError;
        expect(e.status).toBe(404);
        expectValidJsonBody('/api/v1/balance', 'get', 404, e.error);
      }
    });

    test('GET /api/v1/ping (404) matches schema for unknown exchange', async () => {
      try {
        await client.account.ping({ exchange: 'doesnotexist' });
        throw new Error('expected APIError');
      } catch (err) {
        expect(err).toBeInstanceOf(APIError);
        const e = err as APIError;
        expect(e.status).toBe(404);
        expectValidJsonBody('/api/v1/ping', 'get', 404, e.error);
      }
    });

    test('GET /api/v1/user-activity (400) matches schema for empty address', async () => {
      try {
        await client.account.userActivity({ address: '' });
        throw new Error('expected APIError');
      } catch (err) {
        expect(err).toBeInstanceOf(APIError);
        const e = err as APIError;
        expect(e.status).toBe(400);
        expectValidJsonBody('/api/v1/user-activity', 'get', 400, e.error);
      }
    });

    test('GET /api/v1/approvals (501) matches schema when exchange is not polymarket', async () => {
      try {
        await client.approvals.list({ exchange: 'kalshi' });
        throw new Error('expected APIError');
      } catch (err) {
        expect(err).toBeInstanceOf(APIError);
        const e = err as APIError;
        expect(e.status).toBe(501);
        expectValidJsonBody('/api/v1/approvals', 'get', 501, e.error);
      }
    });

    test('POST /api/v1/approvals (501) matches schema when exchange is not polymarket', async () => {
      try {
        await client.approvals.set({ exchange: 'kalshi' });
        throw new Error('expected APIError');
      } catch (err) {
        expect(err).toBeInstanceOf(APIError);
        const e = err as APIError;
        expect(e.status).toBe(501);
        expectValidJsonBody('/api/v1/approvals', 'post', 501, e.error);
      }
    });

    test('GET /api/v1/exchanges (401) matches schema for an invalid API key', async () => {
      const bad = new ParsecAPI({ apiKey: 'invalid-api-key', baseURL: BASE_URL });
      try {
        await bad.exchanges.list();
        throw new Error('expected APIError');
      } catch (err) {
        expect(err).toBeInstanceOf(APIError);
        const e = err as APIError;
        expect(e.status).toBe(401);
        expectValidJsonBody('/api/v1/exchanges', 'get', 401, e.error);
      }
    });
  });
}
