// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

export class Onboard extends APIResource {
  /**
   * Unified onboarding endpoint. Managed mode creates wallet + exchange credentials
   * (Polymarket only). Self mode stores user-provided credentials (Polymarket or
   * Kalshi). Idempotent and resumable.
   */
  create(body: OnboardCreateParams, options?: RequestOptions): APIPromise<OnboardCreateResponse> {
    return this._client.post('/api/v1/onboard', { body, ...options });
  }
}

export interface OnboardCreateResponse {
  /**
   * Exchange that was onboarded.
   */
  exchange: string;

  /**
   * All exchanges linked to this account.
   */
  linked_exchanges: Array<string>;

  /**
   * Onboard mode used ("managed" or "self").
   */
  mode: string;

  /**
   * Onboard status ("complete" or "already_linked").
   */
  status: string;

  /**
   * Steps completed during this call.
   */
  steps_completed: Array<string>;

  /**
   * EOA wallet address (managed mode only).
   */
  eoa_address?: string | null;

  /**
   * Safe wallet address (present when wallet_type is "safe").
   */
  safe_address?: string | null;
}

export interface OnboardCreateParams {
  /**
   * Exchange to onboard ("polymarket" or "kalshi").
   */
  exchange: string;

  /**
   * Managed = Parsec creates wallet + credentials. Self = you provide credentials.
   */
  mode: 'managed' | 'self';

  /**
   * Kalshi API key ID (self mode).
   */
  api_key_id?: string;

  /**
   * Chain ID for Safe wallet creation. Only used with wallet_type "safe".
   */
  chain_id?: number;

  /**
   * Polymarket CLOB API key (self mode).
   */
  clob_api_key?: string;

  /**
   * Polymarket CLOB API passphrase (self mode).
   */
  clob_api_passphrase?: string;

  /**
   * Polymarket CLOB API secret (self mode).
   */
  clob_api_secret?: string;

  /**
   * External wallet address (42-char hex, 0x-prefixed). Required when wallet_type is
   * "safe". Parsec skips embedded EOA creation and uses this address as the Safe
   * owner. Must not be provided when wallet_type is "eoa".
   */
  eoa_address?: string;

  /**
   * Self-mode signing key. For Polymarket this is an Ethereum private key (optional
   * for order placement). For Kalshi this is an RSA private key in PEM format
   * (required).
   */
  private_key?: string;

  /**
   * Wallet type for managed mode. "eoa" (default) creates an embedded EOA wallet.
   * "safe" creates a Safe wallet owned by the external address in eoa_address.
   * "safe" requires eoa_address. Providing eoa_address with "eoa" returns 400.
   */
  wallet_type?: string;
}

export declare namespace Onboard {
  export {
    type OnboardCreateResponse as OnboardCreateResponse,
    type OnboardCreateParams as OnboardCreateParams,
  };
}
