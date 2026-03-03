// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import ParsecAPI from 'parsec-api';

const client = new ParsecAPI({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource onboard', () => {
  // Mock server tests are disabled
  test.skip('create: only required params', async () => {
    const responsePromise = client.onboard.create({ exchange: 'exchange', mode: 'managed' });
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
    const response = await client.onboard.create({
      exchange: 'exchange',
      mode: 'managed',
      api_key_id: 'api_key_id',
      chain_id: 0,
      clob_api_key: 'clob_api_key',
      clob_api_passphrase: 'clob_api_passphrase',
      clob_api_secret: 'clob_api_secret',
      eoa_address: 'eoa_address',
      private_key: 'private_key',
      wallet_type: 'wallet_type',
    });
  });
});
