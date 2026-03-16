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
   * Lists orders on the selected exchange.
   *
   * `status=open` preserves open-order behavior. `status=closed|all` enables order
   * history on supported exchanges.
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
   * Query param: Exchange identifier (e.g., polymarket, kalshi, limitless, opinion,
   * predictfun).
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
   * Body param: Affiliate address override. Builder-only.
   */
  affiliate?: string;

  /**
   * Body param: Per-request exchange credentials passed in the
   * `X-Exchange-Credentials` header. Parsec creates a transient exchange session
   * instead of using stored credentials. For Polymarket transient sessions,
   * `private_key` is required; CLOB API credentials are optional. Credentials are
   * never persisted.
   */
  credentials?: OrderCreateParams.Credentials;

  /**
   * Body param: EIP-712 fee authorization signed by the end-user's wallet. Required
   * to collect fees via fee escrow. Builder-only.
   */
  fee_auth?: OrderCreateParams.FeeAuth;

  /**
   * Body param: Optional key-value parameters. Supported keys:
   *
   * - `order_type`: Order time-in-force. Values: `gtc` (default), `ioc`, `fok`,
   *   `gtd`. Unsupported types return 501 per exchange.
   * - `expiration`: Unix timestamp in seconds. Required when `order_type` is `gtd`
   *   (must be at least 60s in the future). Polymarket only.
   */
  params?: { [key: string]: string };

  /**
   * Body param: End-user's wallet address (fee escrow payer). Builder-only.
   */
  payer_address?: string;

  /**
   * Body param: End-user's signing wallet address. Builder-only.
   */
  signer_address?: string;

  /**
   * Header param: Base64-encoded JSON of per-request exchange credentials (Mode B).
   * When provided, Parsec creates a transient exchange session instead of using
   * stored credentials. The JSON shape matches the RequestCredentials schema.
   */
  'X-Exchange-Credentials'?: string;
}

export namespace OrderCreateParams {
  /**
   * Per-request exchange credentials passed in the `X-Exchange-Credentials` header.
   * Parsec creates a transient exchange session instead of using stored credentials.
   * For Polymarket transient sessions, `private_key` is required; CLOB API
   * credentials are optional. Credentials are never persisted.
   */
  export interface Credentials {
    /**
     * Kalshi API key ID.
     */
    api_key_id?: string;

    /**
     * Optional Polymarket CLOB API key.
     */
    clob_api_key?: string;

    /**
     * Optional Polymarket CLOB API passphrase.
     */
    clob_api_passphrase?: string;

    /**
     * Optional Polymarket CLOB API secret.
     */
    clob_api_secret?: string;

    /**
     * Kalshi RSA private key (PEM) or Polymarket wallet private key (`0x`-prefixed
     * hex).
     */
    private_key?: string;
  }

  /**
   * EIP-712 fee authorization signed by the end-user's wallet. Required to collect
   * fees via fee escrow. Builder-only.
   */
  export interface FeeAuth {
    /**
     * Unix timestamp after which the authorization expires.
     */
    deadline: number;

    /**
     * Fee in USDC base units (6 decimals), as a string.
     */
    fee_amount: string;

    /**
     * 0x-prefixed hex bytes32 order identifier.
     */
    order_id: string;

    /**
     * 0x-prefixed payer wallet address.
     */
    payer: string;

    /**
     * 0x-prefixed hex EIP-712 signature.
     */
    signature: string;
  }
}

export interface OrderRetrieveParams {
  /**
   * Query param: Exchange identifier (e.g., polymarket, kalshi, limitless, opinion,
   * predictfun).
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
   * Query param: Exchange identifier (e.g., polymarket, kalshi, limitless, opinion,
   * predictfun).
   */
  exchange: string;

  /**
   * Query param: Filter orders created at or before this Unix timestamp (seconds).
   */
  end_ts?: number;

  /**
   * Query param: Max orders to return. For `status=closed|all`, defaults to 100 and
   * clamps to 1..=500.
   */
  limit?: number;

  /**
   * Query param: Optional market ID filter (exchange-native).
   */
  market_id?: string;

  /**
   * Query param: Filter orders created at or after this Unix timestamp (seconds).
   */
  start_ts?: number;

  /**
   * Query param: Order status view. `open` returns active orders, `closed` returns
   * terminal orders, and `all` returns both. Defaults to `open`.
   */
  status?: 'open' | 'closed' | 'all';

  /**
   * Header param: Base64-encoded JSON of per-request exchange credentials (Mode B).
   * When provided, Parsec creates a transient exchange session instead of using
   * stored credentials. The JSON shape matches the RequestCredentials schema.
   */
  'X-Exchange-Credentials'?: string;
}

export interface OrderCancelParams {
  /**
   * Query param: Exchange identifier (e.g., polymarket, kalshi, limitless, opinion,
   * predictfun).
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
