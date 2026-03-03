// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';

export class Account extends APIResource {
  /**
   * Returns the raw balance payload from the exchange (opaque JSON).
   */
  balance(params: AccountBalanceParams, options?: RequestOptions): APIPromise<AccountBalanceResponse> {
    const { 'X-Exchange-Credentials': xExchangeCredentials, ...query } = params;
    return this._client.get('/api/v1/balance', {
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

  /**
   * Performs a lightweight balance fetch per exchange to verify connectivity/auth
   * status.
   */
  ping(
    query: AccountPingParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<AccountPingResponse> {
    return this._client.get('/api/v1/ping', { query, ...options });
  }

  /**
   * Fetches user activity data from each requested exchange and returns a
   * per-exchange status map.
   */
  userActivity(
    query: AccountUserActivityParams,
    options?: RequestOptions,
  ): APIPromise<AccountUserActivityResponse> {
    return this._client.get('/api/v1/user-activity', { query, ...options });
  }
}

export interface AccountBalanceResponse {
  raw: { [key: string]: unknown };
}

export type AccountPingResponse = Array<AccountPingResponse.AccountPingResponseItem>;

export namespace AccountPingResponse {
  export interface AccountPingResponseItem {
    authenticated: boolean;

    exchange: string;

    has_credentials: boolean;

    message: string;
  }
}

export interface AccountUserActivityResponse {
  exchanges: { [key: string]: unknown };

  status: { [key: string]: AccountUserActivityResponse.Status };
}

export namespace AccountUserActivityResponse {
  export interface Status {
    success: boolean;

    error?: string;
  }
}

export interface AccountBalanceParams {
  /**
   * Query param: Exchange identifier (e.g., kalshi, polymarket).
   */
  exchange: string;

  /**
   * Query param: Refresh balance before returning (default false).
   */
  refresh?: boolean;

  /**
   * Header param: Base64-encoded JSON of per-request exchange credentials (Mode B).
   * When provided, Parsec creates a transient exchange session instead of using
   * stored credentials. The JSON shape matches the RequestCredentials schema.
   */
  'X-Exchange-Credentials'?: string;
}

export interface AccountPingParams {
  /**
   * Optional exchange ID to ping; if omitted, pings all available exchanges.
   */
  exchange?: string;
}

export interface AccountUserActivityParams {
  /**
   * User address (typically an EVM address).
   */
  address: string;

  /**
   * Exchanges to query (CSV). Defaults to: polymarket, opinion, limitless,
   * predictfun. In SDKs this is typically an array encoded as CSV on the wire.
   */
  exchanges?: Array<string>;

  /**
   * Max number of items per exchange (default 100).
   */
  limit?: number;
}

export declare namespace Account {
  export {
    type AccountBalanceResponse as AccountBalanceResponse,
    type AccountPingResponse as AccountPingResponse,
    type AccountUserActivityResponse as AccountUserActivityResponse,
    type AccountBalanceParams as AccountBalanceParams,
    type AccountPingParams as AccountPingParams,
    type AccountUserActivityParams as AccountUserActivityParams,
  };
}
