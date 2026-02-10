// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

export class Exchanges extends APIResource {
  /**
   * Returns the exchange IDs that the current API key can access.
   */
  list(options?: RequestOptions): APIPromise<ExchangeListResponse> {
    return this._client.get('/api/v1/exchanges', options);
  }
}

export type ExchangeListResponse = Array<string>;

export declare namespace Exchanges {
  export { type ExchangeListResponse as ExchangeListResponse };
}
