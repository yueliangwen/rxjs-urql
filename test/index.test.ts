import { createClient } from '@urql/core';

const client = createClient({
  url: 'https://0ufyz.sse.codesandbox.io',
});

describe('index', () => {
  it('urql', () => {
    expect(client);
  });
});
