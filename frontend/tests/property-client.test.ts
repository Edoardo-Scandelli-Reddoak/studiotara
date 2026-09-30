import { afterEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { fetchProperties, fetchProperty, recordPropertyView, PropertyServiceError, type PropertyConnection } from '../src/lib/property-client';
import { formatOptionalBoolean, isResidenziale, youtubeEmbedUrl } from '../src/lib/api';

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

test('strips owner identities, documents, source snapshots and extra image data from browser DTOs', async () => {
  const privateName = 'OWNER-PRIVACY-SENTINEL-MARIA-ROSSI';
  const property = {
    id: 'native-cuid', titolo: 'Appartamento luminoso', descrizione: 'Descrizione pubblica approvata',
    ascensore: null, garage: false, website_section: 'residential',
    ownerName: privateName, owner_name: privateName, ownerId: 'private-owner-id',
    owners: [{ name: privateName, email: 'private-owner@example.test' }],
    internalNotes: privateName, documents: [{ title: privateName }],
    importSnapshot: { proprietario: privateName },
    images: [{ id: 'photo-0', file_url: 'https://media.test/public/photo-0.jpg', is_planimetria: false, ordine: 2,
      ownerName: privateName, original: { name: privateName }, privateStorageKey: privateName }],
  };
  for (const source of ['dashboard', 'legacy'] as const) {
    const selected = { ...connection, source };
    globalThis.fetch = async () => response({ count: 1, next: null, results: [property] });
    const list = await fetchProperties(selected);
    globalThis.fetch = async () => response(property);
    const detail = await fetchProperty(selected, property.id);
    const browserData = JSON.stringify({ list, detail });
    for (const privateValue of [privateName, 'private-owner-id', 'private-owner@example.test', 'ownerName', 'owner_name', 'owners', 'internalNotes', 'documents', 'importSnapshot', 'privateStorageKey']) {
      assert.equal(browserData.includes(privateValue), false, privateValue);
    }
    assert.equal(detail?.descrizione, property.descrizione);
    assert.equal(detail?.website_section, 'residential');
    assert.equal(detail?.ascensore, null);
    assert.equal(detail?.garage, false);
    assert.deepEqual(detail?.images, [{ id: 'photo-0', file_url: 'https://media.test/public/photo-0.jpg', is_planimetria: false, ordine: 2 }]);
  }
});

test('rejects nested private data disguised as a public field instead of serializing it', async () => {
  for (const extra of [
    { comune: { ownerName: 'PRIVATE-SENTINEL' } },
    { prezzo: { ownerName: 'PRIVATE-SENTINEL' } },
    { garage: { ownerName: 'PRIVATE-SENTINEL' } },
    { images: [{ id: 'photo-0', file_url: { ownerName: 'PRIVATE-SENTINEL' } }] },
  ]) {
    globalThis.fetch = async () => response({ id: 70, titolo: 'Immobile', images: [], ...extra });
    await assert.rejects(fetchProperty(connection, '70'), PropertyServiceError);
  }
});

test('distinguishes unspecified property features from explicit yes and no', () => {
  assert.equal(formatOptionalBoolean(null), '—');
  assert.equal(formatOptionalBoolean(undefined), '—');
  assert.equal(formatOptionalBoolean(false), 'No');
  assert.equal(formatOptionalBoolean(true), 'Sì');
});
