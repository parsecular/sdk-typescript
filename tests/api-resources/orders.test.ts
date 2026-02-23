// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import ParsecAPI from 'parsec-api';

const client = new ParsecAPI({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource orders', () => {
  // Mock server tests are disabled
  test.skip('create: only required params', async () => {
    const responsePromise = client.orders.create({
      exchange: 'exchange',
      market_id: 'market_id',
      outcome: 'outcome',
      price: 0,
      side: 'buy',
      size: 0,
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
  test.skip('create: required and optional params', async () => {
    const response = await client.orders.create({
      exchange: 'exchange',
      market_id: 'market_id',
      outcome: 'outcome',
      price: 0,
      side: 'buy',
      size: 0,
      credentials: {
        api_key_id: 'api_key_id',
        clob_api_key: 'clob_api_key',
        clob_api_passphrase: 'clob_api_passphrase',
        clob_api_secret: 'clob_api_secret',
        private_key: 'private_key',
      },
      params: { foo: 'string' },
      'X-Exchange-Credentials': 'X-Exchange-Credentials',
    });
  });

  // Mock server tests are disabled
  test.skip('retrieve: only required params', async () => {
    const responsePromise = client.orders.retrieve('order_id', { exchange: 'exchange' });
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
    const response = await client.orders.retrieve('order_id', {
      exchange: 'exchange',
      'X-Exchange-Credentials': 'X-Exchange-Credentials',
    });
  });

  // Mock server tests are disabled
  test.skip('list: only required params', async () => {
    const responsePromise = client.orders.list({ exchange: 'exchange' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('list: required and optional params', async () => {
    const response = await client.orders.list({
      exchange: 'exchange',
      market_id: 'market_id',
      'X-Exchange-Credentials': 'X-Exchange-Credentials',
    });
  });

  // Mock server tests are disabled
  test.skip('cancel: only required params', async () => {
    const responsePromise = client.orders.cancel('order_id', { exchange: 'exchange' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('cancel: required and optional params', async () => {
    const response = await client.orders.cancel('order_id', {
      exchange: 'exchange',
      'X-Exchange-Credentials': 'X-Exchange-Credentials',
    });
  });
});
