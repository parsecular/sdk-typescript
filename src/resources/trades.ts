// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

export class Trades extends APIResource {
  /**
   * Returns an array of recent trades for the requested market+outcome (normalized
   * prices 0.0-1.0).
   */
  list(query: TradeListParams, options?: RequestOptions): APIPromise<TradeListResponse> {
    return this._client.get('/api/v1/trades', { query, ...options });
  }
}

export interface TradeListResponse {
  exchange: string;

  market_id: string;

  outcome: string;

  parsec_id: string;

  token_id: string;

  trades: Array<TradeListResponse.Trade>;
}

export namespace TradeListResponse {
  export interface Trade {
    /**
     * Trade price (normalized 0.0-1.0).
     */
    price: number;

    /**
     * Trade size in contracts.
     */
    size: number;

    source_channel: string;

    timestamp: string;

    /**
     * Aggressor side (typically "buy" or "sell").
     */
    aggressor_side?: string;

    /**
     * Trade side (typically "buy" or "sell").
     */
    side?: string;

    trade_id?: string;
  }
}

export interface TradeListParams {
  /**
   * Unified market ID in format `{exchange}:{native_id}`.
   */
  parsec_id: string;

  /**
   * Unix seconds end timestamp (inclusive).
   */
  end_ts?: number;

  /**
   * Max number of trades (default 200; server clamps to 1..=500).
   */
  limit?: number;

  /**
   * Outcome selector. For binary markets this is typically "yes" or "no"
   * (case-insensitive). For categorical markets, this is required and may be an
   * outcome label or numeric index.
   */
  outcome?: string;

  /**
   * Unix seconds start timestamp (inclusive).
   */
  start_ts?: number;
}

export declare namespace Trades {
  export { type TradeListResponse as TradeListResponse, type TradeListParams as TradeListParams };
}
