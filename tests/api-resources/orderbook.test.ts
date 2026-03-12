// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import ParsecAPI from 'parsec-api';

const client = new ParsecAPI({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource orderbook', () => {
  // Mock server tests are disabled
  test.skip('retrieve', async () => {
    const responsePromise = client.orderbook.retrieve();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('retrieve: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.orderbook.retrieve(
        {
          cursor: 'cursor',
          depth: 1,
          end_ts: 0,
          exchange: 'exchange',
          limit: 1,
          market_id: 'market_id',
          outcome: 'outcome',
          parsec_id: 'parsec_id',
          start_ts: 0,
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(ParsecAPI.NotFoundError);
  });
});
