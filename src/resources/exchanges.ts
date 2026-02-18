// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

export class Exchanges extends APIResource {
  /**
   * Returns exchange capability objects available to the authenticated customer.
   */
  list(options?: RequestOptions): APIPromise<ExchangeListResponse> {
    return this._client.get('/api/v1/exchanges', options);
  }
}

export type ExchangeListResponse = Array<ExchangeListResponse.ExchangeListResponseItem>;

export namespace ExchangeListResponse {
  export interface ExchangeListResponseItem {
    /**
     * Exchange identifier (e.g., "polymarket", "kalshi").
     */
    id: string;

    has: ExchangeListResponseItem.Has;

    /**
     * Human-readable exchange name.
     */
    name: string;
  }

  export namespace ExchangeListResponseItem {
    export interface Has {
      approvals: boolean;

      cancel_order: boolean;

      create_order: boolean;

      fetch_balance: boolean;

      fetch_events: boolean;

      fetch_markets: boolean;

      fetch_orderbook: boolean;

      fetch_positions: boolean;

      fetch_price_history: boolean;

      fetch_trades: boolean;

      fetch_user_activity: boolean;

      refresh_balance: boolean;

      websocket: boolean;
    }
  }
}

export declare namespace Exchanges {
  export { type ExchangeListResponse as ExchangeListResponse };
}
