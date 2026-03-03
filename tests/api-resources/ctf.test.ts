// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import ParsecAPI from 'parsec-api';

const client = new ParsecAPI({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource ctf', () => {
  // Mock server tests are disabled
  test.skip('merge: only required params', async () => {
    const responsePromise = client.ctf.merge({
      amount: '1000000',
      condition_id: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
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
  test.skip('merge: required and optional params', async () => {
    const response = await client.ctf.merge({
      amount: '1000000',
      condition_id: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    });
  });

  // Mock server tests are disabled
  test.skip('redeem: only required params', async () => {
    const responsePromise = client.ctf.redeem({
      condition_id: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
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
  test.skip('redeem: required and optional params', async () => {
    const response = await client.ctf.redeem({
      condition_id: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      amounts: ['500000', '500000'],
      neg_risk: true,
    });
  });

  // Mock server tests are disabled
  test.skip('split: only required params', async () => {
    const responsePromise = client.ctf.split({
      amount: '1000000',
      condition_id: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
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
  test.skip('split: required and optional params', async () => {
    const response = await client.ctf.split({
      amount: '1000000',
      condition_id: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    });
  });
});
