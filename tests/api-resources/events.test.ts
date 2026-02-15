// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import ParsecAPI from 'parsec-api';

const client = new ParsecAPI({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource events', () => {
  // Prism tests are disabled
  test.skip('list', async () => {
    const responsePromise = client.events.list();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('list: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.events.list(
        {
          cursor: 'cursor',
          exchanges: ['string'],
          include_markets: true,
          limit: 1,
          min_volume: 0,
          search: 'search',
          status: 'status',
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(ParsecAPI.NotFoundError);
  });
});
