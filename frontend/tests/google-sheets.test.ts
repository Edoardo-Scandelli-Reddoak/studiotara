import { afterEach, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { appendLeadToSheet, formatValutazione, formatVuoleVendere, LEAD_SHEETS } from '../src/lib/googleSheets';

const originalFetch = globalThis.fetch;
const originalError = console.error;
const webhookUrl = 'https://script.test/exec';
const secret = 'test-secret';
const okResponse = () => new Response(JSON.stringify({ ok: true }), { status: 200 });

beforeEach(() => {
  process.env.GOOGLE_SHEETS_WEBHOOK_URL = webhookUrl;
  process.env.GOOGLE_SHEETS_WEBHOOK_SECRET = secret;
});
afterEach(() => {
  globalThis.fetch = originalFetch;
  console.error = originalError;
  delete process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  delete process.env.GOOGLE_SHEETS_WEBHOOK_SECRET;
});

const captureRequest = () => {
  const calls: { url: string; init?: RequestInit }[] = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), init });
    return okResponse();
  };
  return { calls, payload: () => JSON.parse(String(calls[0].init?.body)) };
};

const captureErrors = () => {
  const errors: string[] = [];
  console.error = (...args: unknown[]) => { errors.push(args.join(' ')); };
  return errors;
};

test('defines one sheet for each of the 12 lead routes', () => {
  assert.equal(Object.keys(LEAD_SHEETS).length, 12);
});

test('posts values aligned to the sheet columns, leaving missing fields empty', async () => {
  const { calls, payload } = captureRequest();
  await appendLeadToSheet('Info generali', { Nome: 'Anna', Email: 'anna@example.com', Messaggio: 'Ciao' });
  assert.equal(calls[0].url, webhookUrl);
  assert.equal(calls[0].init?.method, 'POST');
  assert.deepEqual(payload(), {
    secret,
    sheet: 'Info generali',
    columns: ['Nome', 'Cognome', 'Email', 'Telefono', 'Messaggio'],
    values: ['Anna', '', 'anna@example.com', '', 'Ciao'],
  });
});

test('trims text and truncates values that exceed the size limit', async () => {
  const { payload } = captureRequest();
  await appendLeadToSheet('Newsletter', { Email: `  ${'a'.repeat(6000)}  ` });
  assert.equal(payload().values[0].length, 5000);
  assert.equal(payload().values[0][0], 'a');
});

test('stringifies numbers and non-text values sent by a client', async () => {
  const { payload } = captureRequest();
  const untrusted = { nested: true } as unknown as string;
  await appendLeadToSheet('Ricerca residenziale', { 'Mq min': 80, Note: untrusted });
  const { columns, values } = payload();
  assert.equal(values[columns.indexOf('Mq min')], '80');
  assert.equal(values[columns.indexOf('Note')], '{"nested":true}');
});

test('skips the request when the webhook is not configured', async () => {
  delete process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const { calls } = captureRequest();
  await appendLeadToSheet('Newsletter', { Email: 'anna@example.com' });
  assert.equal(calls.length, 0);
});

test('logs a network failure without throwing or leaking lead data', async () => {
  const errors = captureErrors();
  globalThis.fetch = async () => { throw new Error('boom'); };
  await appendLeadToSheet('Newsletter', { Email: 'anna@example.com' });
  assert.equal(errors.length, 1);
  assert.match(errors[0], /Newsletter/);
  assert.doesNotMatch(errors[0], /anna@example\.com/);
});

test('treats an Apps Script error reply as a failure even with HTTP 200', async () => {
  const errors = captureErrors();
  globalThis.fetch = async () => new Response(JSON.stringify({ ok: false, error: 'unauthorized' }), { status: 200 });
  await appendLeadToSheet('Newsletter', { Email: 'anna@example.com' });
  assert.equal(errors.length, 1);
  assert.match(errors[0], /unauthorized/);
});

test('treats a non-JSON reply, such as a Google login page, as a failure', async () => {
  const errors = captureErrors();
  globalThis.fetch = async () => new Response('<html>Sign in</html>', { status: 200 });
  await appendLeadToSheet('Newsletter', { Email: 'anna@example.com' });
  assert.equal(errors.length, 1);
});

test('shows the appointment choice with its form label, keeping unknown values as sent', () => {
  assert.equal(formatVuoleVendere('si_vendere'), 'Sì, voglio vendere un immobile');
  assert.equal(formatVuoleVendere('altro'), 'altro');
  assert.equal(formatVuoleVendere(undefined), '');
});

test('formats the estimate as a euro range and leaves a missing estimate empty', () => {
  const range = formatValutazione({ min: 200000, max: 250000, med: 225000, prezzoMqMin: 2000, prezzoMqMax: 2500, prezzoMqMed: 2250 });
  assert.equal(range, '€ 200.000 – € 250.000');
  assert.equal(formatValutazione(null), '');
});
