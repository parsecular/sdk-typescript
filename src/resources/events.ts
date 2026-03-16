// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

export class Events extends APIResource {
  /**
   * Aggregates markets by event ID from the DuckDB gold layer. Returns event
   * summaries sorted by total volume (descending). Markets without an event_id are
   * excluded.
   *
   * Exact lookup mode is available via either `event_id` or `exchange` +
   * `exchange_group_id`. Exact lookup returns the normal `EventsResponse` wrapper
   * with either zero or one event. Returned `event_id` values are the stored
   * gold-layer event-group IDs (typically `parsec_group_id`); lookup also accepts
   * `ev:{event_id}` aliases.
   */
  list(
    query: EventListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<EventListResponse> {
    return this._client.get('/api/v1/events', { query, ...options });
  }
}

export interface EventListResponse {
  events: Array<EventListResponse.Event>;

  pagination: EventListResponse.Pagination;
}

export namespace EventListResponse {
  export interface Event {
    /**
     * Stored Parsec event-group ID from the gold snapshot. Lookup also accepts
     * `ev:{event_id}` aliases.
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

    /**
     * Cross-exchange event counterparts from published `same_event` matches.
     */
    matched_events?: Array<Event.MatchedEvent>;
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
       * Market icon URL.
       */
      icon_url?: string | null;

      /**
       * Market image URL.
       */
      image_url?: string | null;

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
       * Cross-exchange same-market relations. Only included when `include_matches=true`.
       */
      matched_markets?: Array<Market.MatchedMarket>;

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
       * When bid/ask/last_price was last refreshed (upgraded to now when live WS data
       * overlays the snapshot).
       */
      price_updated_at?: string | null;

      /**
       * Co-dependent market relations. Only included when `include_related=true`.
       */
      related_markets?: Array<Market.RelatedMarket>;

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

      export interface MatchedMarket {
        /**
         * Match confidence score (0.0–1.0).
         */
        confidence: number;

        /**
         * Confidence tier: HIGH, MEDIUM, or LOW.
         */
        confidence_tier: string;

        /**
         * Exchange of the related market.
         */
        exchange: string;

        /**
         * Parsec ID of the related market.
         */
        parsec_id: string;

        /**
         * Source of the match (e.g., embedding, llm).
         */
        source: string;

        /**
         * Direction of dependency (for related markets only).
         */
        dependency_direction?: string | null;

        /**
         * Type of dependency (for related markets only).
         */
        dependency_type?: string | null;

        /**
         * Counterpart market status (e.g., active, closed, archived).
         */
        status?: string;
      }

      export interface RelatedMarket {
        /**
         * Match confidence score (0.0–1.0).
         */
        confidence: number;

        /**
         * Confidence tier: HIGH, MEDIUM, or LOW.
         */
        confidence_tier: string;

        /**
         * Exchange of the related market.
         */
        exchange: string;

        /**
         * Parsec ID of the related market.
         */
        parsec_id: string;

        /**
         * Source of the match (e.g., embedding, llm).
         */
        source: string;

        /**
         * Direction of dependency (for related markets only).
         */
        dependency_direction?: string | null;

        /**
         * Type of dependency (for related markets only).
         */
        dependency_type?: string | null;

        /**
         * Counterpart market status (e.g., active, closed, archived).
         */
        status?: string;
      }
    }

    export interface MatchedEvent {
      /**
       * Match confidence score.
       */
      confidence: number;

      /**
       * Confidence bucket metadata for the event match.
       */
      confidence_tier: string;

      /**
       * Stored Parsec event-group ID for the matched event.
       */
      event_id: string;

      /**
       * Exchanges represented in the matched event.
       */
      exchanges: Array<string>;

      /**
       * Event match source label from the matching pipeline.
       */
      source: string;

      /**
       * Matched event title.
       */
      title: string;
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
   * Pagination cursor (offset-based). Only valid for list mode.
   */
  cursor?: string;

  /**
   * Exact event lookup by stored event-group ID. The `ev:{event_id}` alias form is
   * also accepted. Mutually exclusive with `exchange` + `exchange_group_id`.
   */
  event_id?: string;

  /**
   * Exchange selector for exact external event lookup. Must be paired with
   * `exchange_group_id`.
   */
  exchange?: string;

  /**
   * Exchange-native event/group ID. Must be paired with `exchange`.
   */
  exchange_group_id?: string;

  /**
   * Exchanges to include (CSV). Defaults to all exchanges in the cache. Only valid
   * for list mode.
   */
  exchanges?: Array<string>;

  /**
   * Include constituent markets in the response (default false).
   */
  include_markets?: boolean;

  /**
   * Results per page (default 50, max 100). Only valid for list mode.
   */
  limit?: number;

  /**
   * Minimum total volume across all markets in event. Only valid for list mode.
   */
  min_volume?: number;

  /**
   * Keyword search in event title (case-insensitive). Only valid for list mode.
   */
  search?: string;

  /**
   * Status filter (e.g., active, closed, resolved, archived). Only valid for list
   * mode.
   */
  status?: string;
}

export declare namespace Events {
  export { type EventListResponse as EventListResponse, type EventListParams as EventListParams };
}
