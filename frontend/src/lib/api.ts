const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

const FETCH_OPTIONS: RequestInit =
  process.env.NODE_ENV === 'development'
    ? { cache: 'no-store' }
    : { next: { revalidate: 3600 } };

export interface ApiPropertyImage {
  id: number;
  file_url: string | null;
  is_planimetria: boolean;
  ordine: number;
}

export interface ApiPropertyList {
  id: number;
  gestionale_id: string;
  titolo: string;
  tipologia: string;
  contratto: 'vendita' | 'affitto' | string;
  prezzo: string | null;
  mq: number | null;
  comune: string;
  provincia: string;
  zona: string;
  locali: number | null;
  bagni: number | null;
  camere: number | null;
  piano: string;
  ascensore: boolean;
  garage: boolean;
  classe_energetica: string;
  in_vetrina: boolean;
  in_carosello: boolean;
  visualizzazioni: number;
  immagine_principale: string | null;
}

export interface ApiPropertyDetail {
  id: number;
  gestionale_id: string;
  codice_agenzia: string;
  titolo: string;
  descrizione: string;
  abstract: string;
  prezzo: string | null;
  mq: number | null;
  tipologia: string;
  categoria_id: number | null;
  contratto: 'vendita' | 'affitto' | string;
  indirizzo: string;
  comune: string;
  provincia: string;
  zona: string;
  latitudine: string | null;
  longitudine: string | null;
  codice_istat: string;
  bagni: number | null;
  camere: number | null;
  locali: number | null;
  piano: string;
  ascensore: boolean;
  garage: boolean;
  riscaldamento: string;
  classe_energetica: string;
  in_vetrina: boolean;
  in_carosello: boolean;
  visualizzazioni: number;
  data_creazione: string;
  data_aggiornamento: string;
  video_url: string | null;
  images: ApiPropertyImage[];
}

export async function incrementPropertyViews(id: number): Promise<void> {
  try {
    await fetch(`${API_BASE}/api/properties/${id}/view/`, { method: 'POST' });
  } catch {
    // silent fail
  }
}

// Tipologie residenziali (tutto il resto è commerciale)
const TIPOLOGIE_RESIDENZIALI = new Set([
  'appartamento', 'villa', 'villetta', 'attico', 'monolocale',
  'bilocale', 'trilocale', 'quadrilocale', 'multilocale', 'casale', 'rustico',
]);

export function isResidenziale(tipologia: string): boolean {
  return TIPOLOGIE_RESIDENZIALI.has(tipologia.toLowerCase());
}

export function formatTitolo(titolo: string): string {
  return titolo
    .toLowerCase()
    .replace(/\b\p{L}/gu, (c) => c.toUpperCase());
}

export function formatPrezzo(prezzo: string | null): string {
  if (!prezzo) return 'Prezzo su richiesta';
  const num = parseFloat(prezzo);
  if (isNaN(num) || num === 0) return 'Prezzo su richiesta';
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(num);
}

interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiPropertyList[];
}

export async function getProperties(): Promise<ApiPropertyList[]> {
  const all: ApiPropertyList[] = [];
  let url: string | null = `${API_BASE}/api/properties/`;

  try {
    while (url) {
      const res = await fetch(url, FETCH_OPTIONS);
      if (!res.ok) break;
      const data: PaginatedResponse = await res.json();
      all.push(...data.results);
      url = data.next;
    }
  } catch {
    // return what we collected so far
  }

  return all;
}

export async function getProperty(id: number): Promise<ApiPropertyDetail | null> {
  try {
    const res = await fetch(`${API_BASE}/api/properties/${id}/`, FETCH_OPTIONS);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export interface ApiBlogArticleList {
  id: number;
  titolo: string;
  slug: string;
  excerpt: string;
  immagine_url: string | null;
  data_pubblicazione: string | null;
}

export interface ApiBlogArticleDetail {
  id: number;
  titolo: string;
  slug: string;
  contenuto: string;
  excerpt: string;
  immagine_url: string | null;
  data_pubblicazione: string | null;
}

interface PaginatedBlogResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiBlogArticleList[];
}

export async function getBlogArticles(): Promise<ApiBlogArticleList[]> {
  const all: ApiBlogArticleList[] = [];
  let url: string | null = `${API_BASE}/api/blog/articles/`;

  try {
    while (url) {
      const res = await fetch(url, FETCH_OPTIONS);
      if (!res.ok) break;
      const data: PaginatedBlogResponse = await res.json();
      all.push(...data.results);
      url = data.next;
    }
  } catch {
    // return what we collected so far
  }

  return all;
}

export interface ApiGoogleReview {
  id: number;
  author_name: string;
  profile_photo_url: string;
  rating: number;
  text: string;
  time: string;
}

export async function getGoogleReviews(): Promise<ApiGoogleReview[]> {
  try {
    const res = await fetch(`${API_BASE}/api/reviews/`, FETCH_OPTIONS);
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function getBlogArticle(slug: string): Promise<ApiBlogArticleDetail | null> {
  try {
    const res = await fetch(`${API_BASE}/api/blog/articles/${slug}/`, FETCH_OPTIONS);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
