// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class Orders extends APIResource {
  /**
   * Creates a new order on the selected exchange.
   */
  create(params: OrderCreateParams, options?: RequestOptions): APIPromise<Order> {
    const { exchange, ...body } = params;
    return this._client.post('/api/v1/orders', { query: { exchange }, body, ...options });
  }

  /**
   * Fetches a single order by ID from the selected exchange.
   */
  retrieve(orderID: string, query: OrderRetrieveParams, options?: RequestOptions): APIPromise<Order> {
    return this._client.get(path`/api/v1/orders/${orderID}`, { query, ...options });
  }

  /**
   * Lists open orders on the selected exchange.
   */
  list(query: OrderListParams, options?: RequestOptions): APIPromise<OrderListResponse> {
    return this._client.get('/api/v1/orders', { query, ...options });
  }

  /**
   * Cancels an order by ID on the selected exchange.
   */
  cancel(orderID: string, params: OrderCancelParams, options?: RequestOptions): APIPromise<Order> {
    const { exchange } = params;
    return this._client.delete(path`/api/v1/orders/${orderID}`, { query: { exchange }, ...options });
  }
}

export interface Order {
  id: string;

  created_at: string;

  filled: number;

  market_id: string;

  outcome: string;

  price: number;

  side: 'buy' | 'sell';

  size: number;

  status: 'pending' | 'open' | 'filled' | 'partially_filled' | 'cancelled' | 'rejected';

  updated_at?: string;
}

export type OrderListResponse = Array<Order>;

export interface OrderCreateParams {
  /**
   * Query param: Exchange identifier (e.g., kalshi, polymarket).
   */
  exchange: string;

  /**
   * Body param
   */
  market_id: string;

  /**
   * Body param
   */
  outcome: string;

  /**
   * Body param
   */
  price: number;

  /**
   * Body param
   */
  side: 'buy' | 'sell';

  /**
   * Body param
   */
  size: number;

  /**
   * Body param
   */
  params?: { [key: string]: string };
}

export interface OrderRetrieveParams {
  /**
   * Exchange identifier (e.g., kalshi, polymarket).
   */
  exchange: string;
}

export interface OrderListParams {
  /**
   * Exchange identifier (e.g., kalshi, polymarket).
   */
  exchange: string;

  /**
   * Optional market ID filter (exchange-native).
   */
  market_id?: string;
}

export interface OrderCancelParams {
  /**
   * Exchange identifier (e.g., kalshi, polymarket).
   */
  exchange: string;
}

export declare namespace Orders {
  export {
    type Order as Order,
    type OrderListResponse as OrderListResponse,
    type OrderCreateParams as OrderCreateParams,
    type OrderRetrieveParams as OrderRetrieveParams,
    type OrderListParams as OrderListParams,
    type OrderCancelParams as OrderCancelParams,
  };
}
