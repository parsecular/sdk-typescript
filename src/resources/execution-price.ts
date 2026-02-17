// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

export class ExecutionPrice extends APIResource {
  /**
   * Estimates execution price (VWAP) for a hypothetical order without placing it.
   */
  retrieve(
    query: ExecutionPriceRetrieveParams,
    options?: RequestOptions,
  ): APIPromise<ExecutionPriceRetrieveResponse> {
    return this._client.get('/api/v1/execution-price', { query, ...options });
  }
}

export interface ExecutionPriceRetrieveResponse {
  /**
   * Volume-weighted average execution price, or null when no liquidity is available.
   */
  avg_price?: number | null;

  /**
   * Number of contracts that would be filled.
   */
  filled_amount: number;

  /**
   * True when the full requested amount is fillable from current depth.
   */
  fully_filled: boolean;

  /**
   * Number of orderbook levels consumed.
   */
  levels_consumed: number;

  /**
   * Price impact vs best price, or null when no liquidity is available.
   */
  slippage?: number | null;

  /**
   * Total notional cost of the filled amount.
   */
  total_cost: number;
}

export interface ExecutionPriceRetrieveParams {
  /**
   * Requested order size in contracts.
   */
  amount: number;

  /**
   * Unified market ID in format `{exchange}:{native_id}`.
   */
  parsec_id: string;

  /**
   * Order side.
   */
  side: 'buy' | 'sell';

  /**
   * Outcome selector. For binary markets this is typically "yes" or "no"
   * (case-insensitive). For categorical markets, this is required.
   */
  outcome?: string;
}

export declare namespace ExecutionPrice {
  export {
    type ExecutionPriceRetrieveResponse as ExecutionPriceRetrieveResponse,
    type ExecutionPriceRetrieveParams as ExecutionPriceRetrieveParams,
  };
}
