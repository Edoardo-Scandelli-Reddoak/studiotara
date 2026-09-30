import { afterEach, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { act, createElement, StrictMode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { JSDOM } from 'jsdom';
import ViewCounter, { ViewCounterProvider } from '../src/components/ViewCounter';

const originalFetch = globalThis.fetch;
const originalDescriptors = new Map<string, PropertyDescriptor | undefined>();
let dom: JSDOM;
let root: Root;
let container: HTMLElement;

beforeEach(() => {
  dom = new JSDOM('<!doctype html><div id="root"></div>', { url: 'https://website.test/' });
  for (const [key, value] of Object.entries({ window: dom.window, document: dom.window.document, IS_REACT_ACT_ENVIRONMENT: true })) {
    originalDescriptors.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
    Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
  }
  container = document.getElementById('root')!;
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => root.unmount());
  dom.window.close();
  globalThis.fetch = originalFetch;
  for (const [key, descriptor] of originalDescriptors) {
    if (descriptor) Object.defineProperty(globalThis, key, descriptor);
    else Reflect.deleteProperty(globalThis, key);
  }
  originalDescriptors.clear();
});

function propertyVisit(propertyId: string, initialViews: number) {
  return createElement(StrictMode, {}, createElement(ViewCounterProvider, { propertyId, initialViews },
    createElement('div', { className: 'sm:hidden' }, createElement(ViewCounter)),
    createElement('div', { className: 'hidden sm:flex' }, createElement(ViewCounter)),
  ));
}

function counts() {
  return [...container.querySelectorAll('span')].map(span => span.textContent);
}

test('mobile and desktop share one increment and authoritative count, including Strict Mode replay', async () => {
  const calls: string[] = [];
  globalThis.fetch = async (url, init) => {
    calls.push(String(url));
    assert.equal(init?.method, 'POST');
    return new Response(JSON.stringify({ visualizzazioni: 11 }));
  };
  await act(async () => root.render(propertyVisit('70', 10)));
  assert.deepEqual(calls, ['/api/property-views/70']);
  assert.deepEqual(counts(), ['11 Interessati', '11 Interessati']);
  await act(async () => root.render(propertyVisit('70', 10)));
  assert.equal(calls.length, 1);
});

test('navigation resets the displayed count, ignores stale responses and counts return visits', async () => {
  const calls: string[] = [];
  const pending: ((response: Response) => void)[] = [];
  globalThis.fetch = (url) => {
    calls.push(String(url));
    return new Promise(resolve => pending.push(resolve));
  };
  await act(async () => root.render(propertyVisit('70', 10)));
  assert.deepEqual(counts(), ['10 Interessati', '10 Interessati']);
  await act(async () => root.render(propertyVisit('native-cuid', 20)));
  assert.deepEqual(counts(), ['20 Interessati', '20 Interessati']);
  await act(async () => pending[0](new Response(JSON.stringify({ visualizzazioni: 999 }))));
  assert.deepEqual(counts(), ['20 Interessati', '20 Interessati']);
  await act(async () => pending[1](new Response(JSON.stringify({ visualizzazioni: 21 }))));
  assert.deepEqual(counts(), ['21 Interessati', '21 Interessati']);
  await act(async () => root.render(propertyVisit('70', 11)));
  assert.deepEqual(counts(), ['11 Interessati', '11 Interessati']);
  assert.deepEqual(calls, ['/api/property-views/70', '/api/property-views/native-cuid', '/api/property-views/70']);
  await act(async () => pending[2](new Response('{}', { status: 503 })));
  assert.deepEqual(counts(), ['11 Interessati', '11 Interessati']);
});
