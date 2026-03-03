// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';

export class Escrow extends APIResource {
  /**
   * Returns the builder's fee escrow configuration including contract address, fee
   * rates, and treasury address. Read-only — fee escrow is configured by Parsec
   * admins during onboarding.
   */
  config(options?: RequestOptions): APIPromise<EscrowConfigResponse> {
    return this._client.get('/api/v1/builder/escrow/config', options);
  }
}

export interface EscrowConfigResponse {
  /**
   * Affiliate fee rate in basis points.
   */
  affiliate_fee_bps: number;

  /**
   * Escrow smart contract address.
   */
  escrow_contract_address: string;

  /**
   * Whether fee escrow is enabled for this builder.
   */
  fee_escrow_enabled: boolean;

  /**
   * Minimum fee in basis points.
   */
  min_fee_bps: number;

  /**
   * Minimum fee in USDC (human-readable).
   */
  min_fee_usdc: string;

  /**
   * Treasury address for fee distribution.
   */
  treasury_address: string;

  /**
   * Affiliate fee recipient address.
   */
  affiliate_address?: string | null;

  /**
   * Fee rate in basis points.
   */
  fee_bps?: number | null;
}

export declare namespace Escrow {
  export { type EscrowConfigResponse as EscrowConfigResponse };
}
