// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

export class Orderbook extends APIResource {
  /**
   * When start_ts or end_ts is provided, returns historical orderbook snapshots
   * instead of a live L2 snapshot. Large time ranges are handled via internal
   * chunking and may be slow for very wide windows. In historical mode, limit
   * defaults to 500 (max 1000).
   */
  retrieve(query: OrderbookRetrieveParams, options?: RequestOptions): APIPromise<OrderbookRetrieveResponse> {
    return this._client.get('/api/v1/orderbook', { query, ...options });
  }
}

/**
 * Two-element tuple where `level[0]` is price and `level[1]` is size.
 *
 * NOTE: Stainless currently generates fixed-length arrays as `number[]`; we keep
 * the wire format but provide tuple typing for SDK consumers here.
 */
export type OrderbookLevel = [price: number, size: number];

export interface OrderbookRetrieveResponse {
  asks: Array<OrderbookLevel>;

  bids: Array<OrderbookLevel>;

  exchange: string;

  market_id: string;

  outcome: string;

  parsec_id: string;

  token_id: string;

  /**
   * Minimum order size in contracts.
   */
  min_order_size?: number;

  /**
   * Minimum price increment for orders on this market.
   */
  tick_size?: number;

  timestamp?: string | null;
}

export interface OrderbookRetrieveParams {
  /**
   * Unified market ID in format `{exchange}:{native_id}`.
   */
  parsec_id: string;

  /**
   * Opaque pagination cursor for historical mode.
   */
  cursor?: string;

  /**
   * Alias for `limit` (REST/WS symmetry).
   */
  depth?: number;

  /**
   * Unix seconds — end of time range. Defaults to now.
   */
  end_ts?: number;

  /**
   * Max depth per side (default 50; server clamps to 1..=100).
   */
  limit?: number;

  /**
   * Outcome selector. For binary markets this is typically "yes" or "no"
   * (case-insensitive). For categorical markets, this is required and may be an
   * outcome label or numeric index.
   */
  outcome?: string;

  /**
   * Unix seconds — when present, switches to historical mode (returns snapshots
   * instead of live book).
   */
  start_ts?: number;
}

export declare namespace Orderbook {
  export {
    type OrderbookRetrieveResponse as OrderbookRetrieveResponse,
    type OrderbookRetrieveParams as OrderbookRetrieveParams,
    type OrderbookLevel as OrderbookLevel,
  };
}
