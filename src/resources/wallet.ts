// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

export class Wallet extends APIResource {
  /**
   * Returns the current state of the managed wallet, session signer, and linked
   * exchanges.
   */
  retrieve(options?: RequestOptions): APIPromise<WalletRetrieveResponse> {
    return this._client.get('/api/v1/wallet', options);
  }

  /**
   * Exports the private key for a managed wallet. The key is retrieved via
   * HPKE-encrypted exchange with Privy and returned in hex format.
   *
   * **Security:** Treat the returned key as highly sensitive. Anyone with access to
   * it has full control over the wallet and its funds.
   */
  exportKey(body: WalletExportKeyParams, options?: RequestOptions): APIPromise<WalletExportKeyResponse> {
    return this._client.post('/api/v1/wallet/export-key', { body, ...options });
  }
}

export interface WalletRetrieveResponse {
  linked_exchanges: Array<WalletRetrieveResponse.LinkedExchange>;

  /**
   * All wallets associated with this account.
   */
  wallets: Array<WalletRetrieveResponse.Wallet>;

  session_signer?: WalletRetrieveResponse.SessionSigner;

  wallet?: WalletRetrieveResponse.Wallet;
}

export namespace WalletRetrieveResponse {
  export interface LinkedExchange {
    /**
     * Exchange identifier.
     */
    exchange: string;

    /**
     * Whether credentials are stored for this exchange.
     */
    has_credentials: boolean;
  }

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

  export interface SessionSigner {
    /**
     * Whether the session signer is currently active.
     */
    active: boolean;

    /**
     * Session signer expiration timestamp.
     */
    expires_at?: string | null;

    /**
     * Session signer identifier.
     */
    signer_id?: string | null;
  }

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

export interface WalletExportKeyResponse {
  /**
   * Hex-encoded private key (0x-prefixed).
   */
  private_key: string;
}

export interface WalletExportKeyParams {
  /**
   * Type of wallet to export ("eoa" or "safe").
   */
  wallet_type?: 'eoa' | 'safe';
}

export declare namespace Wallet {
  export {
    type WalletRetrieveResponse as WalletRetrieveResponse,
    type WalletExportKeyResponse as WalletExportKeyResponse,
    type WalletExportKeyParams as WalletExportKeyParams,
  };
}
