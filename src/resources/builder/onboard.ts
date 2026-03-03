// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';

export class Onboard extends APIResource {
  /**
   * Sets up an end-user for trading on a specific exchange. Managed mode creates
   * wallet + exchange credentials. Self mode stores user-provided credentials.
   */
  create(body: OnboardCreateParams, options?: RequestOptions): APIPromise<OnboardCreateResponse> {
    return this._client.post('/api/v1/builder/onboard', { body, ...options });
  }
}

export interface OnboardCreateResponse {
  /**
   * Parsec customer ID of the onboarded user.
   */
  customer_id: string;

  /**
   * Exchange that was onboarded.
   */
  exchange: string;

  /**
   * Whether fee escrow is enabled for this user.
   */
  fee_escrow_enabled: boolean;

  /**
   * All exchanges linked to this user.
   */
  linked_exchanges: Array<string>;

  /**
   * Onboard mode used ("managed" or "self").
   */
  mode: string;

  /**
   * Onboard status ("complete").
   */
  status: string;

  /**
   * Steps completed during this call.
   */
  steps_completed: Array<string>;

  /**
   * Affiliate fee recipient address.
   */
  affiliate_address?: string | null;

  /**
   * EOA wallet address (managed mode only).
   */
  eoa_address?: string | null;

  /**
   * Fee rate in basis points.
   */
  fee_bps?: number | null;

  /**
   * Safe wallet address (present when wallet_type is "safe").
   */
  safe_address?: string | null;

  wallet?: OnboardCreateResponse.Wallet;
}

export namespace OnboardCreateResponse {
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

export interface OnboardCreateParams {
  /**
   * Parsec customer ID of the end-user to onboard.
   */
  customer_id: string;

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
   * Chain ID for Safe wallet creation.
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
   * External wallet address (required when wallet_type is "safe").
   */
  eoa_address?: string;

  /**
   * Kalshi RSA private key in PEM format (self mode).
   */
  private_key?: string;

  /**
   * Wallet type for managed mode ("eoa" or "safe").
   */
  wallet_type?: string;
}

export declare namespace Onboard {
  export {
    type OnboardCreateResponse as OnboardCreateResponse,
    type OnboardCreateParams as OnboardCreateParams,
  };
}
