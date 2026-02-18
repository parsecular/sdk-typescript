// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

export class Approvals extends APIResource {
  /**
   * Polymarket-only helper for checking on-chain allowances required for trading.
   */
  list(query: ApprovalListParams, options?: RequestOptions): APIPromise<ApprovalListResponse> {
    return this._client.get('/api/v1/approvals', { query, ...options });
  }

  /**
   * Polymarket-only helper for submitting approval transactions.
   */
  set(params: ApprovalSetParams, options?: RequestOptions): APIPromise<ApprovalSetResponse> {
    const { exchange, ...body } = params;
    return this._client.post('/api/v1/approvals', { query: { exchange }, body, ...options });
  }
}

export type ApprovalListResponse = Array<ApprovalListResponse.ApprovalListResponseItem>;

export namespace ApprovalListResponse {
  export interface ApprovalListResponseItem {
    token: 'usdc' | 'ctf';

    approved: boolean;

    details: string;

    target: 'ctf_exchange' | 'neg_risk_ctf_exchange' | 'neg_risk_adapter';
  }
}

export interface ApprovalSetResponse {
  all_succeeded: boolean;

  results: Array<ApprovalSetResponse.Result>;
}

export namespace ApprovalSetResponse {
  export interface Result {
    token: 'usdc' | 'ctf';

    success: boolean;

    target: 'ctf_exchange' | 'neg_risk_ctf_exchange' | 'neg_risk_adapter';

    tx_hash: string | null;

    /**
     * Error message, omitted on success.
     */
    error?: string;
  }
}

export interface ApprovalListParams {
  /**
   * Must be "polymarket".
   */
  exchange: string;
}

export interface ApprovalSetParams {
  /**
   * Query param: Must be "polymarket".
   */
  exchange: string;

  /**
   * Body param
   */
  all?: boolean;

  /**
   * Body param
   */
  ctf?: boolean;

  /**
   * Body param
   */
  ctf_neg_risk?: boolean;

  /**
   * Body param
   */
  usdc?: boolean;

  /**
   * Body param
   */
  usdc_neg_risk?: boolean;
}

export declare namespace Approvals {
  export {
    type ApprovalListResponse as ApprovalListResponse,
    type ApprovalSetResponse as ApprovalSetResponse,
    type ApprovalListParams as ApprovalListParams,
    type ApprovalSetParams as ApprovalSetParams,
  };
}
