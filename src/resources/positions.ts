// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';

export class Positions extends APIResource {
  /**
   * Lists positions for the authenticated customer on the selected exchange.
   */
  list(params: PositionListParams, options?: RequestOptions): APIPromise<PositionListResponse> {
    const { 'X-Exchange-Credentials': xExchangeCredentials, ...query } = params;
    return this._client.get('/api/v1/positions', {
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

export type PositionListResponse = Array<PositionListResponse.PositionListResponseItem>;

export namespace PositionListResponse {
  export interface PositionListResponseItem {
    average_price: number;

    current_price: number;

    market_id: string;

    outcome: string;

    size: number;
  }
}

export interface PositionListParams {
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

export declare namespace Positions {
  export { type PositionListResponse as PositionListResponse, type PositionListParams as PositionListParams };
}
