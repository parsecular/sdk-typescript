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
   * Returns the customer's tier and list of linked exchanges.
   */
  capabilities(options?: RequestOptions): APIPromise<AccountCapabilitiesResponse> {
    return this._client.get('/api/v1/session/capabilities', options);
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
   * Updates stored credentials for this API key. Returns 204 on success.
   */
  updateCredentials(body: AccountUpdateCredentialsParams, options?: RequestOptions): APIPromise<void> {
    return this._client.put('/api/v1/credentials', {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
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

export interface AccountCapabilitiesResponse {
  /**
   * Exchange IDs the customer has credentials linked for.
   */
  linked_exchanges: Array<string>;

  /**
   * Customer tier (e.g., "free", "pro", "admin").
   */
  tier: string;
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

export interface AccountUpdateCredentialsParams {
  /**
   * Kalshi API key ID.
   */
  api_key_id?: string | null;

  /**
   * Polymarket CLOB API key.
   */
  clob_api_key?: string | null;

  /**
   * Polymarket CLOB API passphrase.
   */
  clob_api_passphrase?: string | null;

  /**
   * Polymarket CLOB API secret.
   */
  clob_api_secret?: string | null;

  /**
   * Kalshi RSA private key (PEM format).
   */
  private_key?: string | null;
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
    type AccountCapabilitiesResponse as AccountCapabilitiesResponse,
    type AccountPingResponse as AccountPingResponse,
    type AccountUserActivityResponse as AccountUserActivityResponse,
    type AccountBalanceParams as AccountBalanceParams,
    type AccountPingParams as AccountPingParams,
    type AccountUpdateCredentialsParams as AccountUpdateCredentialsParams,
    type AccountUserActivityParams as AccountUserActivityParams,
  };
}
