// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import ParsecAPI from 'parsec-api';

const client = new ParsecAPI({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource price', () => {
  // Mock server tests are disabled
  test.skip('retrieve: only required params', async () => {
    const responsePromise = client.price.retrieve({ parsec_id: 'parsec_id' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('retrieve: required and optional params', async () => {
    const response = await client.price.retrieve({
      parsec_id: 'parsec_id',
      at_ts: 0,
      end_ts: 0,
      interval: '1m',
      outcome: 'outcome',
      start_ts: 0,
    });
  });
});
