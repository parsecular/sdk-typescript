// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

export class ExecutionPrice extends APIResource {
  /**
   * Walks the orderbook to estimate the volume-weighted average price (VWAP) for a
   * hypothetical order of the given size. Does not place an order.
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
   * Number of contracts that would be filled.
   */
  filled_amount: number;

  /**
   * True if the entire requested amount can be filled.
   */
  fully_filled: boolean;

  /**
   * Number of orderbook levels consumed.
   */
  levels_consumed: number;

  /**
   * Total cost of the filled portion.
   */
  total_cost: number;

  /**
   * Volume-weighted average execution price (null if no liquidity).
   */
  avg_price?: number | null;

  /**
   * Price impact vs best price (null if no liquidity).
   */
  slippage?: number | null;
}

export interface ExecutionPriceRetrieveParams {
  /**
   * Order size in contracts.
   */
  amount: number;

  /**
   * Unified market ID in format `{exchange}:{native_id}`.
   */
  parsec_id: string;

  /**
   * Order side ("buy" or "sell").
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
