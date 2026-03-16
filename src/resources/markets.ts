// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

export class Markets extends APIResource {
  /**
   * Query markets using one of four scopes:
   *
   * - **`list`** (default) — Browse markets with optional filters. Pass `exchanges`
   *   to restrict to specific exchanges.
   * - **`market`** — Fetch a single market by `parsec_id` or by `exchange` +
   *   `exchange_market_id`.
   * - **`market_batch`** — Fetch up to 100 markets by `parsec_ids` or
   *   `external_market_keys`.
   * - **`event`** — Fetch all markets in an event by `event_id` or by `exchange` +
   *   `exchange_group_id`.
   *
   * Each scope accepts a different set of parameters; see parameter descriptions for
   * details.
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

  pagination: MarketListResponse.Pagination;

  /**
   * Query scope that produced this response: `list`, `market`, `market_batch`, or
   * `event`.
   */
  scope: 'list' | 'market' | 'market_batch' | 'event';

  /**
   * IDs that appeared more than once in the request. Only present for
   * `scope=market_batch`.
   */
  duplicate_ids?: Array<string>;

  /**
   * Event context. Only present when `scope=event`.
   */
  event?: MarketListResponse.Event;

  /**
   * IDs that were not found in any data layer. Only present for
   * `scope=market_batch`.
   */
  not_found_ids?: Array<string>;
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

  /**
   * Event context. Only present when `scope=event`.
   */
  export interface Event {
    /**
     * Stored Parsec event-group ID.
     */
    event_id: string;

    /**
     * Number of exchanges covering this event.
     */
    exchange_count: number;

    /**
     * Total number of markets in this event.
     */
    market_count: number;

    /**
     * Event title.
     */
    title: string;
  }
}

export interface MarketListParams {
  /**
   * Pagination cursor (offset-based). Valid for `scope=list` and `scope=event`.
   */
  cursor?: string;

  /**
   * Stored Parsec event-group ID (exact match). The `ev:{event_id}` alias form is
   * also accepted. Used for `scope=event`. Mutually exclusive with `exchange` +
   * `exchange_group_id`.
   */
  event_id?: string;

  /**
   * Exchange selector for external-ID lookups. Used with `exchange_market_id` for
   * `scope=market`, or with `exchange_group_id` for `scope=event`.
   */
  exchange?: string;

  /**
   * Exchange-native event/group ID. Must be paired with `exchange` for
   * `scope=event`. Mutually exclusive with `event_id`.
   */
  exchange_group_id?: string;

  /**
   * Exchange-native market ID. Must be paired with `exchange` for `scope=market`.
   * Mutually exclusive with `parsec_id`.
   */
  exchange_market_id?: string;

  /**
   * Comma-separated exchange IDs to query (e.g., `polymarket,kalshi`). Only valid
   * for `scope=list`. Omit to query all exchanges. In SDKs this is typically an
   * array encoded as CSV on the wire.
   */
  exchanges?: Array<string>;

  /**
   * Comma-separated external market keys in format
   * `{exchange}:{exchange_market_id}`. Only valid for `scope=market_batch`. Max 100.
   * Mutually exclusive with `parsec_ids`.
   */
  external_market_keys?: Array<string>;

  /**
   * When true, each market includes a `matched_markets` array with cross-exchange
   * same-market relations.
   */
  include_matches?: boolean;

  /**
   * When true, each market includes a `related_markets` array with co-dependent
   * market relations.
   */
  include_related?: boolean;

  /**
   * Results per page (default 100, max 100).
   */
  limit?: number;

  /**
   * Minimum liquidity filter. Only valid for `scope=list`.
   */
  min_liquidity?: number;

  /**
   * Minimum volume filter. Only valid for `scope=list`.
   */
  min_volume?: number;

  /**
   * Single canonical parsec ID for direct lookup (format: `{exchange}:{native_id}`).
   * Only valid for `scope=market`. Mutually exclusive with `exchange` +
   * `exchange_market_id`.
   */
  parsec_id?: string;

  /**
   * Comma-separated parsec IDs for batch lookup (format: `{exchange}:{native_id}`).
   * Only valid for `scope=market_batch`. Max 100 IDs. Mutually exclusive with
   * `external_market_keys`. If `scope` is omitted, the server auto-infers
   * `scope=market_batch`. In SDKs this is typically an array encoded as CSV on the
   * wire.
   */
  parsec_ids?: Array<string>;

  /**
   * Query scope. Determines which parameters are valid and how results are returned.
   * One of: `list` (default), `market`, `market_batch`, `event`.
   */
  scope?: 'list' | 'market' | 'market_batch' | 'event';

  /**
   * Keyword search in question/description (case-insensitive). Only valid for
   * `scope=list`.
   */
  search?: string;

  /**
   * Status filter (e.g., active, closed, resolved, archived). Defaults to `active`
   * for `scope=list`.
   */
  status?: string;
}

export declare namespace Markets {
  export { type MarketListResponse as MarketListResponse, type MarketListParams as MarketListParams };
}
