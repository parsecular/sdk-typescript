// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { attachBinaryOutcomeGetters } from './markets';

export class Events extends APIResource {
  /**
   * Aggregates markets by event ID from the Silver cache. Returns event summaries
   * sorted by total volume (descending). Markets without an event_id are excluded.
   */
  list(
    query: EventListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<EventListResponse> {
    const request = this._client.get('/api/v1/events', {
      query,
      ...options,
    }) as APIPromise<EventListResponse>;
    return request._thenUnwrap((data: EventListResponse) => {
      data.events.forEach((event) => {
        if (!event.markets) return;
        event.markets = event.markets.map((market) => attachBinaryOutcomeGetters(market));
      });
      return data;
    });
  }
}

export interface EventListResponse {
  events: Array<EventListResponse.Event>;

  pagination: EventListResponse.Pagination;
}

export namespace EventListResponse {
  export interface Event {
    /**
     * Canonical Parsec event ID.
     */
    event_id: string;

    /**
     * Deduplicated list of exchanges with markets in this event.
     */
    exchanges: Array<string>;

    /**
     * Number of markets in this event.
     */
    market_count: number;

    /**
     * Event status. Common values: active, closed, resolved, archived.
     */
    status: string;

    /**
     * Event title (derived from shortest constituent market title).
     */
    title: string;

    /**
     * Sum of volume across all markets in this event.
     */
    total_volume: number;

    /**
     * Earliest close time across constituent markets.
     */
    close_time?: string;

    /**
     * Constituent markets (only included when `include_markets=true`).
     */
    markets?: Array<Event.Market>;
  }

  export namespace Event {
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
       * Minimum order size in contracts. Varies per market on Polymarket (e.g. 5, 15);
       * typically 1 on Kalshi.
       */
      min_order_size?: number;

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

      /**
       * Minimum price increment for orders on this market.
       */
      tick_size?: number;

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

export interface EventListParams {
  /**
   * Pagination cursor (offset-based).
   */
  cursor?: string;

  /**
   * Exchanges to include (CSV). Defaults to all exchanges in the cache.
   */
  exchanges?: Array<string>;

  /**
   * Include constituent markets in the response (default false).
   */
  include_markets?: boolean;

  /**
   * Results per page (default 50, max 100).
   */
  limit?: number;

  /**
   * Minimum total volume across all markets in event.
   */
  min_volume?: number;

  /**
   * Keyword search in event title (case-insensitive).
   */
  search?: string;

  /**
   * Status filter (e.g., active, closed, resolved, archived).
   */
  status?: string;
}

export declare namespace Events {
  export { type EventListResponse as EventListResponse, type EventListParams as EventListParams };
}
