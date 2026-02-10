// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

export class PriceHistory extends APIResource {
  /**
   * Returns an array of candlesticks with timestamps at period start (UTC).
   */
  retrieve(
    query: PriceHistoryRetrieveParams,
    options?: RequestOptions,
  ): APIPromise<PriceHistoryRetrieveResponse> {
    return this._client.get('/api/v1/price-history', { query, ...options });
  }
}

export interface PriceHistoryRetrieveResponse {
  candles: Array<PriceHistoryRetrieveResponse.Candle>;

  exchange: string;

  interval: '1m' | '1h' | '6h' | '1d' | '1w' | 'max';

  outcome: string;

  parsec_id: string;
}

export namespace PriceHistoryRetrieveResponse {
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
  }
}

export interface PriceHistoryRetrieveParams {
  /**
   * Price history interval.
   */
  interval: '1m' | '1h' | '6h' | '1d' | '1w' | 'max';

  /**
   * Unified market ID in format `{exchange}:{native_id}`.
   */
  parsec_id: string;

  /**
   * Unix seconds end timestamp (inclusive). Defaults to now.
   */
  end_ts?: number;

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

export declare namespace PriceHistory {
  export {
    type PriceHistoryRetrieveResponse as PriceHistoryRetrieveResponse,
    type PriceHistoryRetrieveParams as PriceHistoryRetrieveParams,
  };
}
