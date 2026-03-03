// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

export class PolymarketAuth extends APIResource {
  /**
   * Submits a signed EIP-712 ClobAuth message and derives Polymarket CLOB API
   * credentials. Optionally stores them with ?store=true.
   */
  credentials(
    params: PolymarketAuthCredentialsParams,
    options?: RequestOptions,
  ): APIPromise<PolymarketAuthCredentialsResponse> {
    const { store, ...body } = params;
    return this._client.post('/api/v1/exchange/polymarket/auth-credentials', {
      query: { store },
      body,
      ...options,
    });
  }

  /**
   * Returns the EIP-712 ClobAuth typed data to sign with your wallet. Use the
   * signature with POST /exchange/polymarket/auth-credentials.
   */
  message(
    query: PolymarketAuthMessageParams,
    options?: RequestOptions,
  ): APIPromise<PolymarketAuthMessageResponse> {
    return this._client.get('/api/v1/exchange/polymarket/auth-message', { query, ...options });
  }
}

export interface PolymarketAuthCredentialsResponse {
  /**
   * Polymarket CLOB API key.
   */
  clob_api_key: string;

  /**
   * Polymarket CLOB API passphrase.
   */
  clob_api_passphrase: string;

  /**
   * Polymarket CLOB API secret.
   */
  clob_api_secret: string;
}

export interface PolymarketAuthMessageResponse {
  /**
   * Timestamp used in the typed data.
   */
  timestamp: string;

  /**
   * EIP-712 typed data to sign with your wallet.
   */
  typed_data: unknown;
}

export interface PolymarketAuthCredentialsParams {
  /**
   * Body param: Your Ethereum wallet address.
   */
  address: string;

  /**
   * Body param: EIP-712 signature of the ClobAuth typed data.
   */
  signature: string;

  /**
   * Body param: Timestamp from the auth message response.
   */
  timestamp: string;

  /**
   * Query param: Set to true to store derived credentials for future use.
   */
  store?: boolean;
}

export interface PolymarketAuthMessageParams {
  /**
   * Your Ethereum wallet address.
   */
  address: string;
}

export declare namespace PolymarketAuth {
  export {
    type PolymarketAuthCredentialsResponse as PolymarketAuthCredentialsResponse,
    type PolymarketAuthMessageResponse as PolymarketAuthMessageResponse,
    type PolymarketAuthCredentialsParams as PolymarketAuthCredentialsParams,
    type PolymarketAuthMessageParams as PolymarketAuthMessageParams,
  };
}
