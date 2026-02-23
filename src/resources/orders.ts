// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class Orders extends APIResource {
  /**
   * Creates a new order on the selected exchange.
   */
  create(params: OrderCreateParams, options?: RequestOptions): APIPromise<Order> {
    const { exchange, 'X-Exchange-Credentials': xExchangeCredentials, ...body } = params;
    return this._client.post('/api/v1/orders', {
      query: { exchange },
      body,
      ...options,
      headers: buildHeaders([
        {
          ...(xExchangeCredentials != null ? { 'X-Exchange-Credentials': xExchangeCredentials } : undefined),
        },
        options?.headers,
      ]),
    });
  }

  /**
   * Fetches a single order by ID from the selected exchange.
   */
  retrieve(orderID: string, params: OrderRetrieveParams, options?: RequestOptions): APIPromise<Order> {
    const { 'X-Exchange-Credentials': xExchangeCredentials, ...query } = params;
    return this._client.get(path`/api/v1/orders/${orderID}`, {
      query,
      ...options,
      headers: buildHeaders([
        {
          ...(xExchangeCredentials != null ? { 'X-Exchange-Credentials': xExchangeCredentials } : undefined),
        },
        options?.headers,
      ]),
    });
  }

  /**
   * Lists open orders on the selected exchange.
   */
  list(params: OrderListParams, options?: RequestOptions): APIPromise<OrderListResponse> {
    const { 'X-Exchange-Credentials': xExchangeCredentials, ...query } = params;
    return this._client.get('/api/v1/orders', {
      query,
      ...options,
      headers: buildHeaders([
        {
          ...(xExchangeCredentials != null ? { 'X-Exchange-Credentials': xExchangeCredentials } : undefined),
        },
        options?.headers,
      ]),
    });
  }

  /**
   * Cancels an order by ID on the selected exchange.
   */
  cancel(orderID: string, params: OrderCancelParams, options?: RequestOptions): APIPromise<Order> {
    const { exchange, 'X-Exchange-Credentials': xExchangeCredentials } = params;
    return this._client.delete(path`/api/v1/orders/${orderID}`, {
      query: { exchange },
      ...options,
      headers: buildHeaders([
        {
          ...(xExchangeCredentials != null ? { 'X-Exchange-Credentials': xExchangeCredentials } : undefined),
        },
        options?.headers,
      ]),
    });
  }
}

export interface Order {
  id: string;

  created_at: string;

  filled: number;

  market_id: string;

  outcome: string;

  price: number;

  side: 'buy' | 'sell';

  size: number;

  status: 'pending' | 'open' | 'filled' | 'partially_filled' | 'cancelled' | 'rejected';

  updated_at?: string | null;
}

export type OrderListResponse = Array<Order>;

export interface OrderCreateParams {
  /**
   * Query param: Exchange identifier (e.g., kalshi, polymarket).
   */
  exchange: string;

  /**
   * Body param
   */
  market_id: string;

  /**
   * Body param
   */
  outcome: string;

  /**
   * Body param
   */
  price: number;

  /**
   * Body param
   */
  side: 'buy' | 'sell';

  /**
   * Body param
   */
  size: number;

  /**
   * Body param: Per-request exchange credentials (Mode B). When provided, Parsec
   * creates a transient exchange session instead of using stored credentials.
   * Credentials are never persisted.
   */
  credentials?: OrderCreateParams.Credentials;

  /**
   * Body param: Optional key-value parameters. Supported keys:
   *
   * - `order_type`: Order time-in-force. Values: `gtc` (default), `ioc`, `fok`.
   *   Unsupported types return 501 per exchange.
   */
  params?: { [key: string]: string };

  /**
   * Header param: Base64-encoded JSON of per-request exchange credentials (Mode B).
   * When provided, Parsec creates a transient exchange session instead of using
   * stored credentials. The JSON shape matches the RequestCredentials schema.
   */
  'X-Exchange-Credentials'?: string;
}

export namespace OrderCreateParams {
  /**
   * Per-request exchange credentials (Mode B). When provided, Parsec creates a
   * transient exchange session instead of using stored credentials. Credentials are
   * never persisted.
   */
  export interface Credentials {
    /**
     * Kalshi API key ID.
     */
    api_key_id?: string;

    /**
     * Polymarket CLOB API key.
     */
    clob_api_key?: string;

    /**
     * Polymarket CLOB API passphrase.
     */
    clob_api_passphrase?: string;

    /**
     * Polymarket CLOB API secret.
     */
    clob_api_secret?: string;

    /**
     * Kalshi RSA private key (PEM format).
     */
    private_key?: string;
  }
}

export interface OrderRetrieveParams {
  /**
   * Query param: Exchange identifier (e.g., kalshi, polymarket).
   */
  exchange: string;

  /**
   * Header param: Base64-encoded JSON of per-request exchange credentials (Mode B).
   * When provided, Parsec creates a transient exchange session instead of using
   * stored credentials. The JSON shape matches the RequestCredentials schema.
   */
  'X-Exchange-Credentials'?: string;
}

export interface OrderListParams {
  /**
   * Query param: Exchange identifier (e.g., kalshi, polymarket).
   */
  exchange: string;

  /**
   * Query param: Optional market ID filter (exchange-native).
   */
  market_id?: string;

  /**
   * Header param: Base64-encoded JSON of per-request exchange credentials (Mode B).
   * When provided, Parsec creates a transient exchange session instead of using
   * stored credentials. The JSON shape matches the RequestCredentials schema.
   */
  'X-Exchange-Credentials'?: string;
}

export interface OrderCancelParams {
  /**
   * Query param: Exchange identifier (e.g., kalshi, polymarket).
   */
  exchange: string;

  /**
   * Header param: Base64-encoded JSON of per-request exchange credentials (Mode B).
   * When provided, Parsec creates a transient exchange session instead of using
   * stored credentials. The JSON shape matches the RequestCredentials schema.
   */
  'X-Exchange-Credentials'?: string;
}

export declare namespace Orders {
  export {
    type Order as Order,
    type OrderListResponse as OrderListResponse,
    type OrderCreateParams as OrderCreateParams,
    type OrderRetrieveParams as OrderRetrieveParams,
    type OrderListParams as OrderListParams,
    type OrderCancelParams as OrderCancelParams,
  };
}
