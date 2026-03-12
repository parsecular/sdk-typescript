// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

export class Orderbook extends APIResource {
  /**
   * Use `/markets` to discover a market first, then query by either `parsec_id` or
   * `exchange + market_id`. When start_ts or end_ts is provided, returns historical
   * orderbook snapshots instead of a live L2 snapshot. Large time ranges are handled
   * via internal chunking and may be slow for very wide windows. In historical mode,
   * limit defaults to 500 (max 1000). Historical data is tier-gated: Free=5d,
   * Pro=30d, Scale=unlimited.
   */
  retrieve(
    query: OrderbookRetrieveParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<OrderbookRetrieveResponse> {
    return this._client.get('/api/v1/orderbook', { query, ...options });
  }
}

export type OrderbookRetrieveResponse =
  | OrderbookRetrieveResponse.OrderbookResponse
  | OrderbookRetrieveResponse.OrderbookHistoryResult;

export namespace OrderbookRetrieveResponse {
  export interface OrderbookResponse {
    asks: Array<Array<number>>;

    bids: Array<Array<number>>;

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

  export interface OrderbookHistoryResult {
    exchange: string;

    has_more: boolean;

    market_id: string;

    outcome: string;

    parsec_id: string;

    snapshots: Array<OrderbookHistoryResult.Snapshot>;

    token_id: string;

    min_order_size?: number;

    next_cursor?: string;

    tick_size?: number;
  }

  export namespace OrderbookHistoryResult {
    export interface Snapshot {
      asks: Array<Array<number>>;

      bids: Array<Array<number>>;

      timestamp: string;

      hash?: string | null;

      recorded_at?: string | null;
    }
  }
}

export interface OrderbookRetrieveParams {
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
   * Exchange ID (alternative to parsec_id — use with market_id).
   */
  exchange?: string;

  /**
   * Max depth per side (default 50; server clamps to 1..=100).
   */
  limit?: number;

  /**
   * Exchange-native market ID (alternative to parsec_id — use with exchange).
   */
  market_id?: string;

  /**
   * Outcome selector. For binary markets this is typically "yes" or "no"
   * (case-insensitive). For categorical markets, this is required and may be an
   * outcome label or numeric index.
   */
  outcome?: string;

  /**
   * Unified market ID. Provide either `parsec_id` OR both `exchange` + `market_id`.
   */
  parsec_id?: string;

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
  };
}
