import type { ApiPropertyDetail, ApiPropertyList } from './api';

export type PropertyConnection = { baseUrl: string; source: 'legacy' | 'dashboard'; apiKey?: string };

export class PropertyServiceError extends Error {
  constructor() { super('Gli immobili sono temporaneamente non disponibili. Riprova tra poco.'); }
}

function connectionUrl(connection: PropertyConnection) {
  const base = new URL(connection.baseUrl);
  if (!['https:', 'http:'].includes(base.protocol) || base.username || base.password || base.search || base.hash) throw new PropertyServiceError();
  if (connection.source === 'dashboard' && !connection.apiKey) throw new PropertyServiceError();
  const path = connection.source === 'dashboard' ? '/api/website/properties' : '/api/properties/';
  return new URL(path, base.origin);
}

function assertNextUrl(url: URL, root: URL) {
  if (url.origin !== root.origin || url.pathname.replace(/\/$/, '') !== root.pathname.replace(/\/$/, '') || url.username || url.password || url.hash) {
    throw new PropertyServiceError();
  }
}

async function request(url: URL, connection: PropertyConnection, method = 'GET') {
  try {
    return await fetch(url, {
      method, cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(10000),
      headers: connection.source === 'dashboard' ? { Authorization: `Bearer ${connection.apiKey}` } : {},
    });
  } catch { throw new PropertyServiceError(); }
}

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new PropertyServiceError();
  return value as Record<string, unknown>;
}
function idOf(value: unknown) {
  if ((typeof value !== 'number' && typeof value !== 'string') || !/^[A-Za-z0-9_-]{1,100}$/.test(String(value))) throw new PropertyServiceError();
  return String(value);
}
function listItem(value: unknown): ApiPropertyList {
  const item = record(value);
  if (typeof item.titolo !== 'string') throw new PropertyServiceError();
  return { ...item, id: idOf(item.id) } as unknown as ApiPropertyList;
}

export async function fetchProperties(connection: PropertyConnection): Promise<ApiPropertyList[]> {
  const root = connectionUrl(connection);
  let url: URL | null = root;
  const visited = new Set<string>(), result: ApiPropertyList[] = [], ids = new Set<string>();
  let expectedCount: number | undefined;
  while (url) {
    assertNextUrl(url, root);
    if (visited.has(url.href) || visited.size >= 1000) throw new PropertyServiceError();
    visited.add(url.href);
    const response = await request(url, connection);
    if (!response.ok) throw new PropertyServiceError();
    let data: Record<string, unknown>;
    try { data = record(await response.json()); } catch { throw new PropertyServiceError(); }
    if (!Array.isArray(data.results) || !Number.isSafeInteger(data.count) || (data.count as number) < 0) throw new PropertyServiceError();
    if (expectedCount !== undefined && data.count !== expectedCount) throw new PropertyServiceError();
    expectedCount = data.count as number;
    for (const value of data.results) {
      const item = listItem(value);
      if (ids.has(item.id)) throw new PropertyServiceError();
      ids.add(item.id); result.push(item);
    }
    if (data.next !== null && typeof data.next !== 'string') throw new PropertyServiceError();
    url = data.next ? new URL(data.next as string, root) : null;
  }
  if (result.length !== expectedCount) throw new PropertyServiceError();
  return result;
}

export async function fetchProperty(connection: PropertyConnection, id: string): Promise<ApiPropertyDetail | null> {
  if (!/^[A-Za-z0-9_-]{1,100}$/.test(id)) return null;
  const root = connectionUrl(connection);
  const response = await request(new URL(`${root.pathname.replace(/\/$/, '')}/${id}${connection.source === 'legacy' ? '/' : ''}`, root), connection);
  if (response.status === 404) return null;
  if (!response.ok) throw new PropertyServiceError();
  let data: Record<string, unknown>;
  try { data = record(await response.json()); } catch { throw new PropertyServiceError(); }
  if (!Array.isArray(data.images)) throw new PropertyServiceError();
  return { ...listItem(data), ...data, id: idOf(data.id), images: data.images.map(value => {
    const item = record(value); return { ...item, id: idOf(item.id) };
  }) } as unknown as ApiPropertyDetail;
}

export async function recordPropertyView(connection: PropertyConnection, id: string): Promise<number | null> {
  if (!/^[A-Za-z0-9_-]{1,100}$/.test(id)) return null;
  const root = connectionUrl(connection);
  const response = await request(new URL(`${root.pathname.replace(/\/$/, '')}/${id}/view${connection.source === 'legacy' ? '/' : ''}`, root), connection, 'POST');
  if (response.status === 404) return null;
  if (!response.ok) throw new PropertyServiceError();
  const data = record(await response.json());
  if (!Number.isSafeInteger(data.visualizzazioni) || (data.visualizzazioni as number) < 0) throw new PropertyServiceError();
  return data.visualizzazioni as number;
}
