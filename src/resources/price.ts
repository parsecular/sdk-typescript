// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

export class Price extends APIResource {
  /**
   * Returns an array of candlesticks with timestamps at period start (UTC).
   */
  retrieve(query: PriceRetrieveParams, options?: RequestOptions): APIPromise<PriceRetrieveResponse> {
    return this._client.get('/api/v1/price', { query, ...options });
  }
}

export interface PriceRetrieveResponse {
  candles: Array<PriceRetrieveResponse.Candle>;

  exchange: string;

  interval: '1m' | '1h' | '6h' | '1d' | '1w' | 'max';

  outcome: string;

  parsec_id: string;
}

export namespace PriceRetrieveResponse {
  export interface Candle {
    /**
     * Close price (normalized 0.0-1.0).
     */
    close: number;

    /**
     * High price (normalized 0.0-1.0).
     */
    high: number;

    /**
     * Low price (normalized 0.0-1.0).
     */
    low: number;

    /**
     * Open price (normalized 0.0-1.0).
     */
    open: number;

    /**
     * Period start timestamp (UTC).
     */
    timestamp: string;

    /**
     * Trade volume in contracts.
     */
    volume: number;

    /**
     * Open interest at this candle's close.
     */
    open_interest?: number;
  }
}

export interface PriceRetrieveParams {
  /**
   * Unified market ID in format `{exchange}:{native_id}`.
   */
  parsec_id: string;

  /**
   * Point-in-time lookup (Unix seconds). Returns the single closest candle. Cannot
   * be combined with start_ts/end_ts.
   */
  at_ts?: number;

  /**
   * Unix seconds end timestamp (inclusive). Defaults to now.
   */
  end_ts?: number;

  /**
   * Defaults to 1h for point-in-time (at_ts)
   */
  interval?: '1m' | '1h' | '6h' | '1d' | '1w' | 'max';

  /**
   * Outcome selector. For binary markets this is typically "yes" or "no"
   * (case-insensitive). For categorical markets, this is required and may be an
   * outcome label or numeric index.
   */
  outcome?: string;

  /**
   * Unix seconds start timestamp (inclusive). If omitted, the server selects a
   * default range based on `interval`.
   */
  start_ts?: number;
}

export declare namespace Price {
  export {
    type PriceRetrieveResponse as PriceRetrieveResponse,
    type PriceRetrieveParams as PriceRetrieveParams,
  };
}
