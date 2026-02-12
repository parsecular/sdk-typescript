// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

export class Markets extends APIResource {
  /**
   * Provide either `exchanges` (CSV) or `parsec_ids` (CSV). When `parsec_ids` is
   * provided, other filters are not allowed.
   */
  list(
    query: MarketListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<MarketListResponse> {
    return this._client.get('/api/v1/markets', { query, ...options });
  }
}

export interface MarketListResponse {
  markets: Array<MarketListResponse.Market>;

  meta: MarketListResponse.Meta;

  pagination: MarketListResponse.Pagination;
}

export namespace MarketListResponse {
  export interface Market {
    /**
     * Native exchange market ID.
     */
    id: string;

    description: string;

    exchange: string;

    market_type: string;

    outcome_tokens: Array<Market.OutcomeToken>;

    outcomes: Array<string>;

    /**
     * Primary key in format `{exchange}:{native_id}`.
     */
    parsec_id: string;

    status: 'active' | 'closed' | 'resolved';

    title: string;

    volume: number;

    close_time?: string;

    condition_id?: string;

    /**
     * Canonical Parsec event ID for cross-exchange grouping.
     */
    event_id?: string | null;

    /**
     * Source-native exchange event/group ID.
     */
    group_id?: string | null;

    liquidity?: number | null;

    open_time?: string;

    question?: string | null;

    slug?: string;

    token_id_no?: string;

    token_id_yes?: string;
  }

  export namespace Market {
    export interface OutcomeToken {
      outcome: string;

      token_id: string;
    }
  }

  export interface Meta {
    exchanges_queried: Array<string>;

    exchanges_succeeded: Array<string>;

    exchanges_failed?: { [key: string]: string };
  }

  export interface Pagination {
    count: number;

    has_more: boolean;

    total: number;

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
   * Keyword search in title/description/question (case-insensitive).
   */
  search?: string;

  /**
   * Status filter.
   */
  status?: 'active' | 'closed' | 'resolved';
}

export declare namespace Markets {
  export { type MarketListResponse as MarketListResponse, type MarketListParams as MarketListParams };
}
