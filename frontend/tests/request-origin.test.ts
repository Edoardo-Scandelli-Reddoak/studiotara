import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isSameOriginRequest } from '../src/lib/request-origin';

test('uses the browser Host when Next constructs its request URL with an internal hostname', () => {
  assert.equal(isSameOriginRequest(new Request('http://localhost:4818/api/property-views/70', {
    headers: { host: '127.0.0.1:4818', origin: 'http://127.0.0.1:4818' },
  })), true);
  assert.equal(isSameOriginRequest(new Request('https://localhost:3000/api/property-views/70', {
    headers: { host: 'www.studiotara.it', origin: 'https://www.studiotara.it' },
  })), true);
});

test('refuses missing, foreign, opaque or wrong-protocol origins and ignores forged forwarded hosts', () => {
  for (const origin of [undefined, 'null', 'https://evil.test', 'http://www.studiotara.it', 'https://localhost:3000']) {
    const headers: Record<string, string> = { host: 'www.studiotara.it', 'x-forwarded-host': 'evil.test' };
    if (origin) headers.origin = origin;
    assert.equal(isSameOriginRequest(new Request('https://localhost:3000/api/property-views/70', { headers })), false, origin);
  }
});
