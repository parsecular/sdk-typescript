// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

export class Exchanges extends APIResource {
  /**
   * Returns exchange capabilities available to the authenticated customer.
   */
  list(options?: RequestOptions): APIPromise<ExchangeListResponse> {
    return this._client.get('/api/v1/exchanges', options);
  }
}

export type ExchangeListResponse = Array<ExchangeListResponse.ExchangeCapability>;

export namespace ExchangeListResponse {
  export interface ExchangeCapability {
    /**
     * Exchange identifier (e.g., "polymarket", "kalshi").
     */
    id: string;

    /**
     * Human-readable exchange name.
     */
    name: string;

    has: ExchangeCapability.Has;
  }

  export namespace ExchangeCapability {
    export interface Has {
      create_order: boolean;
      fetch_markets: boolean;
      websocket: boolean;
    }
  }
}

export declare namespace Exchanges {
  export { type ExchangeListResponse as ExchangeListResponse };
}
