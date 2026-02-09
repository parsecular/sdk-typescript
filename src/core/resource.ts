// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import type { ParsecAPI } from '../client';

export abstract class APIResource {
  protected _client: ParsecAPI;

  constructor(client: ParsecAPI) {
    this._client = client;
  }
}
