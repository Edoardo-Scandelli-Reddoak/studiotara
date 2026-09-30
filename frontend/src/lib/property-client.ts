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
function stringOf(value: unknown, fallback = ''): string {
  if (value === undefined) return fallback;
  if (typeof value !== 'string') throw new PropertyServiceError();
  return value;
}
function nullableStringOf(value: unknown): string | null {
  return value == null ? null : stringOf(value);
}
function nullableNumberOf(value: unknown): number | null {
  if (value == null) return null;
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new PropertyServiceError();
  return value;
}
function nullableBooleanOf(value: unknown): boolean | null {
  if (value == null) return null;
  if (typeof value !== 'boolean') throw new PropertyServiceError();
  return value;
}
function countOf(value: unknown, fallback = 0): number {
  if (value === undefined) return fallback;
  if (!Number.isSafeInteger(value) || (value as number) < 0) throw new PropertyServiceError();
  return value as number;
}

// Construct the browser DTO explicitly. Upstream models may acquire private
// fields; neither unknown fields nor nested objects belong in client props.
function publicFields(value: unknown): Omit<ApiPropertyList, 'immagine_principale'> {
  const item = record(value);
  if (typeof item.titolo !== 'string') throw new PropertyServiceError();
  const section = item.website_section;
  if (section !== undefined && section !== 'residential' && section !== 'commercial') throw new PropertyServiceError();
  return {
    id: idOf(item.id),
    gestionale_id: stringOf(item.gestionale_id),
    titolo: item.titolo,
    tipologia: stringOf(item.tipologia),
    categoria_id: nullableNumberOf(item.categoria_id),
    ...(section === undefined ? {} : { website_section: section }),
    contratto: stringOf(item.contratto),
    prezzo: nullableStringOf(item.prezzo),
    mq: nullableNumberOf(item.mq),
    comune: stringOf(item.comune),
    provincia: stringOf(item.provincia),
    zona: stringOf(item.zona),
    locali: nullableNumberOf(item.locali),
    bagni: nullableNumberOf(item.bagni),
    camere: nullableNumberOf(item.camere),
    piano: stringOf(item.piano),
    ascensore: nullableBooleanOf(item.ascensore),
    garage: nullableBooleanOf(item.garage),
    classe_energetica: stringOf(item.classe_energetica),
    in_vetrina: nullableBooleanOf(item.in_vetrina) ?? false,
    in_carosello: nullableBooleanOf(item.in_carosello) ?? false,
    visualizzazioni: countOf(item.visualizzazioni),
  };
}
function listItem(value: unknown): ApiPropertyList {
  const item = record(value);
  return { ...publicFields(item), immagine_principale: nullableStringOf(item.immagine_principale) };
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
  return {
    ...publicFields(data),
    codice_agenzia: stringOf(data.codice_agenzia),
    descrizione: stringOf(data.descrizione),
    abstract: stringOf(data.abstract),
    indirizzo: stringOf(data.indirizzo),
    latitudine: nullableStringOf(data.latitudine),
    longitudine: nullableStringOf(data.longitudine),
    codice_istat: stringOf(data.codice_istat),
    riscaldamento: stringOf(data.riscaldamento),
    data_creazione: stringOf(data.data_creazione),
    data_aggiornamento: stringOf(data.data_aggiornamento),
    video_url: nullableStringOf(data.video_url),
    virtual_tour_url: nullableStringOf(data.virtual_tour_url),
    images: data.images.map(value => {
      const item = record(value);
      return {
        id: idOf(item.id),
        file_url: nullableStringOf(item.file_url),
        is_planimetria: nullableBooleanOf(item.is_planimetria) ?? false,
        ordine: nullableNumberOf(item.ordine) ?? 0,
      };
    }),
  };
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
