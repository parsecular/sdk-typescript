// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Users extends APIResource {
  /**
   * Creates a new end-user with an API key. The user inherits the builder's QPS
   * pool. Optionally provide an external EOA address to skip embedded wallet
   * creation.
   */
  create(body: UserCreateParams, options?: RequestOptions): APIPromise<UserCreateResponse> {
    return this._client.post('/api/v1/builder/users', { body, ...options });
  }

  /**
   * Returns details for a single end-user owned by this builder.
   */
  retrieve(customerID: string, options?: RequestOptions): APIPromise<UserRetrieveResponse> {
    return this._client.get(path`/api/v1/builder/users/${customerID}`, options);
  }

  /**
   * Updates mutable fields on an end-user (currently only qps_limit).
   */
  update(
    customerID: string,
    body: UserUpdateParams,
    options?: RequestOptions,
  ): APIPromise<UserUpdateResponse> {
    return this._client.patch(path`/api/v1/builder/users/${customerID}`, { body, ...options });
  }

  /**
   * Returns a paginated list of end-users created by this builder.
   */
  list(
    query: UserListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<UserListResponse> {
    return this._client.get('/api/v1/builder/users', { query, ...options });
  }

  /**
   * Deactivates the end-user, revoking their API key. This action is irreversible.
   */
  deactivate(customerID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/api/v1/builder/users/${customerID}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

export interface UserCreateResponse {
  /**
   * API key for the created user.
   */
  api_key: string;

  /**
   * Parsec customer ID for the created user.
   */
  customer_id: string;

  /**
   * Your application's identifier for this user.
   */
  external_id: string;

  /**
   * Whether fee escrow is enabled for this user.
   */
  fee_escrow_enabled: boolean;

  /**
   * Exchanges linked to this user.
   */
  linked_exchanges: Array<string>;

  /**
   * Response status ("complete").
   */
  status: string;

  /**
   * Affiliate fee recipient address.
   */
  affiliate_address?: string | null;

  /**
   * Fee rate in basis points.
   */
  fee_bps?: number | null;

  wallet?: UserCreateResponse.Wallet;
}

export namespace UserCreateResponse {
  export interface Wallet {
    /**
     * EVM wallet address on Polygon.
     */
    eoa_address: string;

    /**
     * Privy wallet identifier.
     */
    privy_wallet_id: string;

    /**
     * Wallet type ("eoa" or "safe").
     */
    wallet_type: string;

    /**
     * Token balances for this wallet.
     */
    balances?: Array<Wallet.Balance> | null;

    /**
     * Chain ID for the wallet (e.g. 137 for Polygon).
     */
    chain_id?: number | null;

    /**
     * Wallet creation timestamp.
     */
    created_at?: string | null;

    /**
     * Safe wallet address (present when wallet_type is "safe").
     */
    safe_address?: string | null;
  }

  export namespace Wallet {
    export interface Balance {
      /**
       * Token symbol (e.g. "USDC").
       */
      token: string;

      /**
       * Human-readable balance (e.g. "100.50").
       */
      balance: string;

      /**
       * Token decimal places.
       */
      decimals: number;

      /**
       * Raw balance in smallest unit (e.g. "100500000").
       */
      raw_balance: string;

      /**
       * ERC-20 contract address. Null for native token.
       */
      contract_address?: string | null;
    }
  }
}

export interface UserRetrieveResponse {
  /**
   * API key for this user.
   */
  api_key: string;

  /**
   * Parsec customer ID.
   */
  customer_id: string;

  /**
   * Your application's identifier for this user.
   */
  external_id: string;

  /**
   * Whether fee escrow is enabled for this user.
   */
  fee_escrow_enabled: boolean;

  /**
   * Exchanges linked to this user.
   */
  linked_exchanges: Array<string>;

  /**
   * User's tier.
   */
  tier: string;

  /**
   * Affiliate fee recipient address.
   */
  affiliate_address?: string | null;

  /**
   * User creation timestamp.
   */
  created_at?: string | null;

  /**
   * Fee rate in basis points.
   */
  fee_bps?: number | null;

  /**
   * Per-second rate limit allocated from builder's pool.
   */
  qps_limit?: number | null;

  wallet?: UserRetrieveResponse.Wallet;
}

export namespace UserRetrieveResponse {
  export interface Wallet {
    /**
     * EVM wallet address on Polygon.
     */
    eoa_address: string;

    /**
     * Privy wallet identifier.
     */
    privy_wallet_id: string;

    /**
     * Wallet type ("eoa" or "safe").
     */
    wallet_type: string;

    /**
     * Token balances for this wallet.
     */
    balances?: Array<Wallet.Balance> | null;

    /**
     * Chain ID for the wallet (e.g. 137 for Polygon).
     */
    chain_id?: number | null;

    /**
     * Wallet creation timestamp.
     */
    created_at?: string | null;

    /**
     * Safe wallet address (present when wallet_type is "safe").
     */
    safe_address?: string | null;
  }

  export namespace Wallet {
    export interface Balance {
      /**
       * Token symbol (e.g. "USDC").
       */
      token: string;

      /**
       * Human-readable balance (e.g. "100.50").
       */
      balance: string;

      /**
       * Token decimal places.
       */
      decimals: number;

      /**
       * Raw balance in smallest unit (e.g. "100500000").
       */
      raw_balance: string;

      /**
       * ERC-20 contract address. Null for native token.
       */
      contract_address?: string | null;
    }
  }
}

export interface UserUpdateResponse {
  /**
   * API key for this user.
   */
  api_key: string;

  /**
   * Parsec customer ID.
   */
  customer_id: string;

  /**
   * Your application's identifier for this user.
   */
  external_id: string;

  /**
   * Whether fee escrow is enabled for this user.
   */
  fee_escrow_enabled: boolean;

  /**
   * Exchanges linked to this user.
   */
  linked_exchanges: Array<string>;

  /**
   * User's tier.
   */
  tier: string;

  /**
   * Affiliate fee recipient address.
   */
  affiliate_address?: string | null;

  /**
   * User creation timestamp.
   */
  created_at?: string | null;

  /**
   * Fee rate in basis points.
   */
  fee_bps?: number | null;

  /**
   * Per-second rate limit allocated from builder's pool.
   */
  qps_limit?: number | null;

  wallet?: UserUpdateResponse.Wallet;
}

export namespace UserUpdateResponse {
  export interface Wallet {
    /**
     * EVM wallet address on Polygon.
     */
    eoa_address: string;

    /**
     * Privy wallet identifier.
     */
    privy_wallet_id: string;

    /**
     * Wallet type ("eoa" or "safe").
     */
    wallet_type: string;

    /**
     * Token balances for this wallet.
     */
    balances?: Array<Wallet.Balance> | null;

    /**
     * Chain ID for the wallet (e.g. 137 for Polygon).
     */
    chain_id?: number | null;

    /**
     * Wallet creation timestamp.
     */
    created_at?: string | null;

    /**
     * Safe wallet address (present when wallet_type is "safe").
     */
    safe_address?: string | null;
  }

  export namespace Wallet {
    export interface Balance {
      /**
       * Token symbol (e.g. "USDC").
       */
      token: string;

      /**
       * Human-readable balance (e.g. "100.50").
       */
      balance: string;

      /**
       * Token decimal places.
       */
      decimals: number;

      /**
       * Raw balance in smallest unit (e.g. "100500000").
       */
      raw_balance: string;

      /**
       * ERC-20 contract address. Null for native token.
       */
      contract_address?: string | null;
    }
  }
}

export interface UserListResponse {
  /**
   * Number of users in this page.
   */
  count: number;

  /**
   * List of end-users.
   */
  users: Array<UserListResponse.User>;

  /**
   * Cursor for the next page. Null if no more results.
   */
  next_cursor?: string | null;
}

export namespace UserListResponse {
  export interface User {
    /**
     * API key for this user.
     */
    api_key: string;

    /**
     * Parsec customer ID.
     */
    customer_id: string;

    /**
     * Your application's identifier for this user.
     */
    external_id: string;

    /**
     * Whether fee escrow is enabled for this user.
     */
    fee_escrow_enabled: boolean;

    /**
     * Exchanges linked to this user.
     */
    linked_exchanges: Array<string>;

    /**
     * User's tier.
     */
    tier: string;

    /**
     * Affiliate fee recipient address.
     */
    affiliate_address?: string | null;

    /**
     * User creation timestamp.
     */
    created_at?: string | null;

    /**
     * Fee rate in basis points.
     */
    fee_bps?: number | null;

    /**
     * Per-second rate limit allocated from builder's pool.
     */
    qps_limit?: number | null;

    wallet?: User.Wallet;
  }

  export namespace User {
    export interface Wallet {
      /**
       * EVM wallet address on Polygon.
       */
      eoa_address: string;

      /**
       * Privy wallet identifier.
       */
      privy_wallet_id: string;

      /**
       * Wallet type ("eoa" or "safe").
       */
      wallet_type: string;

      /**
       * Token balances for this wallet.
       */
      balances?: Array<Wallet.Balance> | null;

      /**
       * Chain ID for the wallet (e.g. 137 for Polygon).
       */
      chain_id?: number | null;

      /**
       * Wallet creation timestamp.
       */
      created_at?: string | null;

      /**
       * Safe wallet address (present when wallet_type is "safe").
       */
      safe_address?: string | null;
    }

    export namespace Wallet {
      export interface Balance {
        /**
         * Token symbol (e.g. "USDC").
         */
        token: string;

        /**
         * Human-readable balance (e.g. "100.50").
         */
        balance: string;

        /**
         * Token decimal places.
         */
        decimals: number;

        /**
         * Raw balance in smallest unit (e.g. "100500000").
         */
        raw_balance: string;

        /**
         * ERC-20 contract address. Null for native token.
         */
        contract_address?: string | null;
      }
    }
  }
}

export interface UserCreateParams {
  /**
   * Your application's unique identifier for this user.
   */
  external_id: string;

  /**
   * Optional email address for the user.
   */
  email?: string;

  /**
   * External EOA address (42-char hex, 0x-prefixed). Skips embedded wallet creation.
   */
  eoa_address?: string;

  /**
   * Per-second rate limit for this user. Deducted from builder's QPS pool.
   */
  qps_limit?: number;
}

export interface UserUpdateParams {
  /**
   * New per-second rate limit for this user.
   */
  qps_limit?: number;
}

export interface UserListParams {
  /**
   * Pagination cursor from a previous response.
   */
  cursor?: string;

  /**
   * Maximum number of users to return.
   */
  limit?: number;
}

export declare namespace Users {
  export {
    type UserCreateResponse as UserCreateResponse,
    type UserRetrieveResponse as UserRetrieveResponse,
    type UserUpdateResponse as UserUpdateResponse,
    type UserListResponse as UserListResponse,
    type UserCreateParams as UserCreateParams,
    type UserUpdateParams as UserUpdateParams,
    type UserListParams as UserListParams,
  };
}
