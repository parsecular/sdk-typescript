// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

export class Websocket extends APIResource {
  /**
   * Returns in-memory usage aggregates for the authenticated customer (or globally
   * for admin keys).
   */
  usage(
    query: WebsocketUsageParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<WebsocketUsageResponse> {
    return this._client.get('/api/v1/ws/usage', { query, ...options });
  }
}

export interface CustomerUsage {
  active_connections: number;

  active_subscriptions: number;

  auth_failures_total: number;

  bytes_sent_total: number;

  connections_closed_total: number;

  connections_opened_total: number;

  customer_id: string;

  messages_sent_total: number;

  subscribe_requests_total: number;

  unsubscribe_requests_total: number;
}

export interface WebsocketUsageResponse {
  customers: Array<CustomerUsage>;

  scope: string;

  top_markets: Array<WebsocketUsageResponse.TopMarket>;

  totals: WebsocketUsageResponse.Totals;

  updated_at_ms: number;

  customer?: CustomerUsage;
}

export namespace WebsocketUsageResponse {
  export interface TopMarket {
    parsec_id: string;

    subscriptions_total: number;
  }

  export interface Totals {
    active_connections: number;

    active_subscriptions: number;

    auth_failures_total: number;

    bytes_sent_total: number;

    connections_closed_total: number;

    connections_opened_total: number;

    messages_sent_total: number;

    subscribe_requests_total: number;

    unsubscribe_requests_total: number;
  }
}

export interface WebsocketUsageParams {
  /**
   * Max number of markets/customers returned (default 20; server clamps to 1..=100).
   */
  limit?: number;

  /**
   * "self" (default) or "global" (admin only).
   */
  scope?: string;
}

export declare namespace Websocket {
  export {
    type CustomerUsage as CustomerUsage,
    type WebsocketUsageResponse as WebsocketUsageResponse,
    type WebsocketUsageParams as WebsocketUsageParams,
  };
}
