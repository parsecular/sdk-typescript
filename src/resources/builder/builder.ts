// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as EscrowAPI from './escrow';
import { Escrow, EscrowConfigResponse } from './escrow';
import * as OnboardAPI from './onboard';
import { Onboard, OnboardCreateParams, OnboardCreateResponse } from './onboard';
import * as UsersAPI from './users';
import {
  UserCreateParams,
  UserCreateResponse,
  UserListParams,
  UserListResponse,
  UserRetrieveResponse,
  UserUpdateParams,
  UserUpdateResponse,
  Users,
} from './users';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';

export class Builder extends APIResource {
  users: UsersAPI.Users = new UsersAPI.Users(this._client);
  onboard: OnboardAPI.Onboard = new OnboardAPI.Onboard(this._client);
  escrow: EscrowAPI.Escrow = new EscrowAPI.Escrow(this._client);

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

Builder.Users = Users;
Builder.Onboard = Onboard;
Builder.Escrow = Escrow;

export declare namespace Builder {
  export { type BuilderPoolResponse as BuilderPoolResponse };

  export {
    Users as Users,
    type UserCreateResponse as UserCreateResponse,
    type UserRetrieveResponse as UserRetrieveResponse,
    type UserUpdateResponse as UserUpdateResponse,
    type UserListResponse as UserListResponse,
    type UserCreateParams as UserCreateParams,
    type UserUpdateParams as UserUpdateParams,
    type UserListParams as UserListParams,
  };

  export {
    Onboard as Onboard,
    type OnboardCreateResponse as OnboardCreateResponse,
    type OnboardCreateParams as OnboardCreateParams,
  };

  export { Escrow as Escrow, type EscrowConfigResponse as EscrowConfigResponse };
}
