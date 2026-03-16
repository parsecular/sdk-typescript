// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';

export class Fills extends APIResource {
  /**
   * Returns fills (individual trade executions) for the authenticated customer on
   * the specified exchange. A single order can produce multiple fills.
   */
  list(params: FillListParams, options?: RequestOptions): APIPromise<FillListResponse> {
    const { 'X-Exchange-Credentials': xExchangeCredentials, ...query } = params;
    return this._client.get('/api/v1/fills', {
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
}

export type FillListResponse = Array<FillListResponse.FillListResponseItem>;

export namespace FillListResponse {
  export interface FillListResponseItem {
    /**
     * Timestamp of the fill (ISO 8601).
     */
    created_at: string;

    /**
     * Fee charged for this fill.
     */
    fee: number;

    /**
     * Unique fill identifier.
     */
    fill_id: string;

    /**
     * Whether this fill was a taker (market order hitting resting liquidity).
     */
    is_taker: boolean;

    /**
     * Market the fill occurred on (exchange-native ID).
     */
    market_id: string;

    /**
     * ID of the order that was filled.
     */
    order_id: string;

    /**
     * The outcome traded (e.g., "Yes" or "No").
     */
    outcome: string;

    /**
     * Execution price.
     */
    price: number;

    side: 'buy' | 'sell';

    /**
     * Number of contracts filled.
     */
    size: number;
  }
}

export interface FillListParams {
  /**
   * Query param: Exchange identifier (e.g., polymarket, kalshi, limitless, opinion,
   * predictfun).
   */
  exchange: string;

  /**
   * Query param: Maximum number of fills to return.
   */
  limit?: number;

  /**
   * Query param: Filter fills by a specific market ID (exchange-native).
   */
  market_id?: string;

  /**
   * Header param: Base64-encoded JSON of per-request exchange credentials (Mode B).
   * When provided, Parsec creates a transient exchange session instead of using
   * stored credentials. The JSON shape matches the RequestCredentials schema.
   */
  'X-Exchange-Credentials'?: string;
}

export declare namespace Fills {
  export { type FillListResponse as FillListResponse, type FillListParams as FillListParams };
}
