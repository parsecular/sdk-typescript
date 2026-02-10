// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

export class Positions extends APIResource {
  /**
   * Lists positions for the authenticated customer on the selected exchange.
   */
  list(query: PositionListParams, options?: RequestOptions): APIPromise<PositionListResponse> {
    return this._client.get('/api/v1/positions', { query, ...options });
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
   * Exchange identifier (e.g., kalshi, polymarket).
   */
  exchange: string;

  /**
   * Optional market ID filter (exchange-native).
   */
  market_id?: string;
}

export declare namespace Positions {
  export { type PositionListResponse as PositionListResponse, type PositionListParams as PositionListParams };
}
