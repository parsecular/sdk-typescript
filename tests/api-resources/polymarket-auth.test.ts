// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import ParsecAPI from 'parsec-api';

const client = new ParsecAPI({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource polymarketAuth', () => {
  // Mock server tests are disabled
  test.skip('credentials: only required params', async () => {
    const responsePromise = client.polymarketAuth.credentials({
      address: 'address',
      signature: 'signature',
      timestamp: 'timestamp',
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('credentials: required and optional params', async () => {
    const response = await client.polymarketAuth.credentials({
      address: 'address',
      signature: 'signature',
      timestamp: 'timestamp',
      store: true,
    });
  });

  // Mock server tests are disabled
  test.skip('message: only required params', async () => {
    const responsePromise = client.polymarketAuth.message({ address: 'address' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('message: required and optional params', async () => {
    const response = await client.polymarketAuth.message({ address: 'address' });
  });
});
