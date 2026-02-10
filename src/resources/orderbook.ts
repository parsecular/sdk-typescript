// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

export class Orderbook extends APIResource {
  /**
   * Returns bids/asks as `[price, size]` tuples.
   */
  retrieve(query: OrderbookRetrieveParams, options?: RequestOptions): APIPromise<OrderbookRetrieveResponse> {
    return this._client.get('/api/v1/orderbook', { query, ...options });
  }
}

export interface OrderbookRetrieveResponse {
  asks: Array<Array<number>>;

  bids: Array<Array<number>>;

  exchange: string;

  market_id: string;

  outcome: string;

  parsec_id: string;

  timestamp: string | null;

  token_id: string;
}

export interface OrderbookRetrieveParams {
  /**
   * Unified market ID in format `{exchange}:{native_id}`.
   */
  parsec_id: string;

  /**
   * Alias for `limit` (REST/WS symmetry).
   */
  depth?: number;

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
}

export declare namespace Orderbook {
  export {
    type OrderbookRetrieveResponse as OrderbookRetrieveResponse,
    type OrderbookRetrieveParams as OrderbookRetrieveParams,
  };
}
