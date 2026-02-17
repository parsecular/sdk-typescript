// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

function findOutcomeByName<T extends { name: string }>(outcomes: Array<T>, target: string): T | undefined {
  const normalized = target.toLowerCase();
  return outcomes.find((outcome) => outcome.name.toLowerCase() === normalized);
}

export function attachBinaryOutcomeGetters<
  TOutcome extends { name: string },
  TMarket extends { outcomes: Array<TOutcome> },
>(market: TMarket): TMarket & { readonly yes?: TOutcome; readonly no?: TOutcome } {
  if (!Object.prototype.hasOwnProperty.call(market, 'yes')) {
    Object.defineProperty(market, 'yes', {
      configurable: false,
      enumerable: false,
      get: () => findOutcomeByName(market.outcomes, 'yes'),
    });
  }

  if (!Object.prototype.hasOwnProperty.call(market, 'no')) {
    Object.defineProperty(market, 'no', {
      configurable: false,
      enumerable: false,
      get: () => findOutcomeByName(market.outcomes, 'no'),
    });
  }

  return market as TMarket & { readonly yes?: TOutcome; readonly no?: TOutcome };
}

export class Markets extends APIResource {
  /**
   * Provide either `exchanges` (CSV) or `parsec_ids` (CSV). When `parsec_ids` is
   * provided, other filters are not allowed.
   */
  list(
    query: MarketListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<MarketListResponse> {
    const request = this._client.get('/api/v1/markets', {
      query,
      ...options,
    }) as APIPromise<MarketListResponse>;
    return request._thenUnwrap((data: MarketListResponse) => {
      data.markets = data.markets.map((market) => attachBinaryOutcomeGetters(market));
      return data;
    });
  }
}

export interface MarketListResponse {
  markets: Array<MarketListResponse.Market>;

  pagination: MarketListResponse.Pagination;
}

export namespace MarketListResponse {
  export interface Market {
    exchange: string;

    /**
     * Source-native exchange event/group ID.
     */
    exchange_group_id: string;

    /**
     * Native exchange market ID.
     */
    exchange_market_id: string;

    /**
     * Title of the group/event this market belongs to.
     */
    group_title: string;

    /**
     * Market type (e.g., binary, categorical).
     */
    market_type: string;

    /**
     * Market outcomes with optional price and token ID.
     */
    outcomes: Array<Market.Outcome>;

    /**
     * Convenience getter for binary markets: outcome where `name` is "Yes"
     * (case-insensitive).
     */
    readonly yes?: Market.Outcome;

    /**
     * Convenience getter for binary markets: outcome where `name` is "No"
     * (case-insensitive).
     */
    readonly no?: Market.Outcome;

    /**
     * Parsec group ID for cross-exchange event grouping.
     */
    parsec_group_id: string;

    /**
     * Primary key in format `{exchange}:{native_id}`.
     */
    parsec_id: string;

    /**
     * Market question text.
     */
    question: string;

    /**
     * Market status. Common values: active, closed, resolved, archived.
     */
    status: string;

    /**
     * Total trading volume (USDC).
     */
    volume_total: number;

    /**
     * Best ask price (normalized 0.0-1.0).
     */
    best_ask?: number;

    /**
     * Best bid price (normalized 0.0-1.0).
     */
    best_bid?: number;

    /**
     * Date when this market was first collected.
     */
    collection_date?: string;

    /**
     * Exchange-native condition ID.
     */
    condition_id?: string;

    created_at?: string;

    /**
     * Detailed market description.
     */
    description?: string;

    /**
     * Market end/close date.
     */
    end_date?: string;

    /**
     * Event start time.
     */
    event_start_time?: string;

    /**
     * Date of last data collection.
     */
    last_collected?: string;

    /**
     * Last traded price (normalized 0.0-1.0).
     */
    last_price?: number;

    /**
     * Current liquidity (USDC).
     */
    liquidity?: number;

    /**
     * Current open interest (contracts/pairs).
     */
    open_interest?: number;

    /**
     * Number of outcomes in this market.
     */
    outcome_count?: number;

    /**
     * Market resolution rules.
     */
    rules?: string;

    slug?: string;

    updated_at?: string;

    /**
     * Direct URL to the market on the exchange.
     */
    url?: string;

    /**
     * 24-hour trading volume (USDC).
     */
    volume_24h?: number;

    /**
     * Cross-reference data (exchange-specific metadata).
     */
    xref?: { [key: string]: unknown };
  }

  export namespace Market {
    export interface Outcome {
      /**
       * Outcome label (e.g., "Yes", "No", or a categorical name).
       */
      name: string;

      /**
       * Last known price for this outcome (normalized 0.0-1.0).
       */
      price?: number;

      /**
       * Exchange-native token ID for this outcome.
       */
      token_id?: string;
    }
  }

  export interface Pagination {
    /**
     * Number of items in this response.
     */
    count: number;

    /**
     * True if there are more results.
     */
    has_more: boolean;

    /**
     * Total number of items matching the filters (before pagination).
     */
    total: number;

    /**
     * Cursor for the next page (offset-based).
     */
    next_cursor?: string;
  }
}

export interface MarketListParams {
  /**
   * Pagination cursor (offset-based).
   */
  cursor?: string;

  /**
   * Canonical Parsec event ID filter (exact match).
   */
  event_id?: string;

  /**
   * Exchanges to query. In SDKs this is typically an array encoded as CSV on the
   * wire. Required unless `parsec_ids` is provided.
   */
  exchanges?: Array<string>;

  /**
   * Source-native exchange event/group ID filter (exact match).
   */
  group_id?: string;

  /**
   * Results per page (default 100).
   */
  limit?: number;

  /**
   * Minimum liquidity filter.
   */
  min_liquidity?: number;

  /**
   * Minimum volume filter.
   */
  min_volume?: number;

  /**
   * Parsec market IDs to fetch directly (format: `{exchange}:{native_id}`). In SDKs
   * this is typically an array encoded as CSV on the wire. Required unless
   * `exchanges` is provided.
   */
  parsec_ids?: Array<string>;

  /**
   * Keyword search in question/description (case-insensitive).
   */
  search?: string;

  /**
   * Status filter (e.g., active, closed, resolved, archived).
   */
  status?: string;
}

export declare namespace Markets {
  export { type MarketListResponse as MarketListResponse, type MarketListParams as MarketListParams };
}
