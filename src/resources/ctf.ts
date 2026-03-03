// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

export class Ctf extends APIResource {
  /**
   * Merges equal amounts of YES and NO outcome tokens back into USDC collateral. The
   * transaction is submitted gaslessly through Polymarket's relayer.
   * Polymarket-only.
   *
   * @example
   * ```ts
   * const ctfResponse = await client.ctf.merge({
   *   amount: '1000000',
   *   condition_id:
   *     '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
   * });
   * ```
   */
  merge(body: CtfMergeParams, options?: RequestOptions): APIPromise<CtfResponse> {
    return this._client.post('/api/v1/polymarket/ctf/merge', { body, ...options });
  }

  /**
   * Redeems winning outcome tokens for USDC after a market has resolved. The
   * transaction is submitted gaslessly through Polymarket's relayer. For neg-risk
   * markets, set `neg_risk: true` and provide `amounts`. Polymarket-only.
   *
   * @example
   * ```ts
   * const ctfResponse = await client.ctf.redeem({
   *   condition_id:
   *     '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
   * });
   * ```
   */
  redeem(body: CtfRedeemParams, options?: RequestOptions): APIPromise<CtfResponse> {
    return this._client.post('/api/v1/polymarket/ctf/redeem', { body, ...options });
  }

  /**
   * Splits USDC collateral into YES and NO outcome tokens for a binary market
   * condition. The transaction is submitted gaslessly through Polymarket's relayer.
   * Polymarket-only.
   *
   * @example
   * ```ts
   * const ctfResponse = await client.ctf.split({
   *   amount: '1000000',
   *   condition_id:
   *     '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
   * });
   * ```
   */
  split(body: CtfSplitParams, options?: RequestOptions): APIPromise<CtfResponse> {
    return this._client.post('/api/v1/polymarket/ctf/split', { body, ...options });
  }
}

export interface CtfResponse {
  /**
   * Relayer transaction status.
   */
  status?: string;

  /**
   * On-chain transaction hash.
   */
  transaction_hash?: string | null;
}

export interface CtfMergeParams {
  /**
   * USDC amount in smallest unit (6 decimals).
   */
  amount: string;

  /**
   * Condition ID (bytes32 hex).
   */
  condition_id: string;
}

export interface CtfRedeemParams {
  /**
   * Condition ID (bytes32 hex).
   */
  condition_id: string;

  /**
   * Token amounts for each outcome (required when neg_risk is true).
   */
  amounts?: Array<string>;

  /**
   * Set to true for neg-risk (multi-outcome) markets.
   */
  neg_risk?: boolean;
}

export interface CtfSplitParams {
  /**
   * USDC amount in smallest unit (6 decimals).
   */
  amount: string;

  /**
   * Condition ID (bytes32 hex).
   */
  condition_id: string;
}

export declare namespace Ctf {
  export {
    type CtfResponse as CtfResponse,
    type CtfMergeParams as CtfMergeParams,
    type CtfRedeemParams as CtfRedeemParams,
    type CtfSplitParams as CtfSplitParams,
  };
}
