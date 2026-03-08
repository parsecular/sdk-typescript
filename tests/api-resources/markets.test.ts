// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import ParsecAPI from 'parsec-api';

const client = new ParsecAPI({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource markets', () => {
  // Mock server tests are disabled
  test.skip('list', async () => {
    const responsePromise = client.markets.list();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('list: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.markets.list(
        {
          cursor: 'cursor',
          event_id: 'event_id',
          exchange: 'exchange',
          exchange_group_id: 'exchange_group_id',
          exchange_market_id: 'exchange_market_id',
          exchanges: ['string'],
          external_market_keys: 'external_market_keys',
          include_matches: true,
          include_related: true,
          limit: 1,
          min_liquidity: 0,
          min_volume: 0,
          parsec_id: 'parsec_id',
          parsec_ids: ['string'],
          scope: 'list',
          search: 'search',
          status: 'status',
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(ParsecAPI.NotFoundError);
  });
});
