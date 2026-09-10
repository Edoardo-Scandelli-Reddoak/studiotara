import { afterEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { fetchProperties, fetchProperty, recordPropertyView, PropertyServiceError, type PropertyConnection } from '../src/lib/property-client';
import { isResidenziale, youtubeEmbedUrl } from '../src/lib/api';

const originalFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = originalFetch; });
const connection: PropertyConnection = { baseUrl: 'https://dashboard.test', source: 'dashboard', apiKey: 'private-test-key' };
const response = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

test('fetches every page with server credentials and no caching, retaining numeric and native IDs', async () => {
  const calls: { url: string; init?: RequestInit }[] = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), init });
    return calls.length === 1
      ? response({ count: 2, next: '/api/website/properties?page=2', results: [{ id: 70, titolo: 'Imported' }] })
      : response({ count: 2, next: null, results: [{ id: 'native-cuid', titolo: 'Native' }] });
  };
  const result = await fetchProperties(connection);
  assert.deepEqual(result.map(p => p.id), ['70', 'native-cuid']);
  assert.equal(calls[1].url, 'https://dashboard.test/api/website/properties?page=2');
  assert.equal(calls[0].init?.cache, 'no-store');
  assert.equal(calls[0].init?.redirect, 'error');
  assert.deepEqual(calls[0].init?.headers, { Authorization: 'Bearer private-test-key' });
});

test('rejects a failed later page rather than serving a partial inventory', async () => {
  let count = 0;
  globalThis.fetch = async () => ++count === 1 ? response({ count: 2, next: '/api/website/properties?page=2', results: [{ id: '70', titolo: 'Imported' }] }) : response({}, 503);
  await assert.rejects(fetchProperties(connection), PropertyServiceError);
});

test('never forwards credentials to another pagination origin or endpoint', async () => {
  for (const next of ['https://evil.test/steal', '/api/internal', 'https://dashboard.test@evil.test/api/website/properties']) {
    let calls = 0;
    globalThis.fetch = async () => { calls++; return response({ count: 1, next, results: [] }); };
    await assert.rejects(fetchProperties(connection), PropertyServiceError); assert.equal(calls, 1);
  }
});

test('distinguishes missing properties from unavailable services and supports native slugs', async () => {
  globalThis.fetch = async url => { assert.equal(String(url), 'https://dashboard.test/api/website/properties/native-cuid'); return response({ id: 'native-cuid', titolo: 'Native', images: [{ id: 'photo-0' }] }); };
  assert.equal((await fetchProperty(connection, 'native-cuid'))?.id, 'native-cuid');
  globalThis.fetch = async () => response({}, 404); assert.equal(await fetchProperty(connection, '70'), null);
  globalThis.fetch = async () => response({}, 503); await assert.rejects(fetchProperty(connection, '70'), PropertyServiceError);
});

test('uses the Django trailing slash only in legacy mode and never sends dashboard credentials there', async () => {
  globalThis.fetch = async (url, init) => { assert.equal(String(url), 'https://legacy.test/api/properties/70/'); assert.deepEqual(init?.headers, {}); return response({ id: 70, titolo: 'Legacy', images: [{ id: 8 }] }); };
  const result = await fetchProperty({ source: 'legacy', baseUrl: 'https://legacy.test' }, '70');
  assert.equal(result?.id, '70'); assert.equal(result?.images[0].id, '8');
});

test('uses the authoritative returned view count', async () => {
  globalThis.fetch = async (url, init) => { assert.equal(String(url), 'https://dashboard.test/api/website/properties/70/view'); assert.equal(init?.method, 'POST'); return response({ visualizzazioni: 16 }); };
  assert.equal(await recordPropertyView(connection, '70'), 16);
});

test('honors explicit website placement even when title text would move the property', () => {
  assert.equal(isResidenziale({ titolo: 'Villa con ufficio', tipologia: 'villa', website_section: 'residential' }), true);
  assert.equal(isResidenziale({ titolo: 'Capannone', tipologia: 'multilocale', categoria_id: 16 }), false);
});

test('normalizes supported YouTube links and refuses unrelated iframe hosts', () => {
  assert.equal(youtubeEmbedUrl('https://youtu.be/abcdefghijk'), 'https://www.youtube-nocookie.com/embed/abcdefghijk');
  assert.equal(youtubeEmbedUrl('https://www.youtube.com/watch?v=abcdefghijk'), 'https://www.youtube-nocookie.com/embed/abcdefghijk');
  assert.equal(youtubeEmbedUrl('https://youtube.com.evil.test/embed/abcdefghijk'), null);
  assert.equal(youtubeEmbedUrl('javascript:alert(1)'), null);
});
