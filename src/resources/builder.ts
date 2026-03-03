// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

export class Builder extends APIResource {
  /**
   * Returns the builder's QPS pool allocation, end-user count, and total allocated
   * QPS.
   */
  pool(options?: RequestOptions): APIPromise<BuilderPoolResponse> {
    return this._client.get('/api/v1/builder/pool', options);
  }
}

export interface BuilderPoolResponse {
  /**
   * Number of end-users created by this builder.
   */
  end_user_count: number;

  /**
   * Total QPS available to this builder.
   */
  qps_pool: number;

  /**
   * Total QPS allocated to end-users.
   */
  total_allocated_qps: number;
}

export declare namespace Builder {
  export { type BuilderPoolResponse as BuilderPoolResponse };
}
