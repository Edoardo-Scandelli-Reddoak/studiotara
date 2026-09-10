const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

const FETCH_OPTIONS: RequestInit =
  process.env.NODE_ENV === 'development'
    ? { cache: 'no-store' }
    : { next: { revalidate: 3600 } };

// Blog content is edited manually and we need new/deleted articles to be
// visible immediately. ISR's "revalidate on next request" pattern is too
// stale for low-traffic sites — we always pull fresh.
const BLOG_FETCH_OPTIONS: RequestInit = { cache: 'no-store' };

export interface ApiPropertyImage {
  id: string;
  file_url: string | null;
  is_planimetria: boolean;
  ordine: number;
}

export interface ApiPropertyList {
  id: string;
  gestionale_id: string;
  titolo: string;
  tipologia: string;
  categoria_id: number | null;
  website_section?: 'residential' | 'commercial';
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
  ascensore: boolean | null;
  garage: boolean | null;
  classe_energetica: string;
  in_vetrina: boolean;
  in_carosello: boolean;
  visualizzazioni: number;
  immagine_principale: string | null;
}

export interface ApiPropertyDetail {
  id: string;
  gestionale_id: string;
  codice_agenzia: string;
  titolo: string;
  descrizione: string;
  abstract: string;
  prezzo: string | null;
  mq: number | null;
  tipologia: string;
  categoria_id: number | null;
  website_section?: 'residential' | 'commercial';
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
  ascensore: boolean | null;
  garage: boolean | null;
  riscaldamento: string;
  classe_energetica: string;
  in_vetrina: boolean;
  in_carosello: boolean;
  visualizzazioni: number;
  data_creazione: string;
  data_aggiornamento: string;
  video_url: string | null;
  virtual_tour_url?: string | null;
  images: ApiPropertyImage[];
}

export async function incrementPropertyViews(id: string): Promise<number | null> {
  try {
    const response = await fetch(`/api/property-views/${encodeURIComponent(id)}`, { method: 'POST' });
    if (!response.ok) return null;
    const data = await response.json();
    return typeof data.visualizzazioni === 'number' ? data.visualizzazioni : null;
  } catch { return null; }
}

// categoria_id residenziali dal feed GestionaleImmobiliare.
// Mappatura speculare a CATEGORIA_MAP in backend/apps/sync/.../sync_properties.py.
const CATEGORIA_ID_RESIDENZIALI = new Set<number>([
  1,  // appartamento
  2,  // villa
  3,  // villetta
  4,  // attico
  10, // rustico
  11, // appartamento
  12, // monolocale
  13, // bilocale
  14, // trilocale
  15, // quadrilocale
  16, // multilocale
  18, // villa
  19, // villetta
  20, // casale
]);

// Fallback usato solo quando categoria_id è assente.
const TIPOLOGIE_RESIDENZIALI = new Set([
  'appartamento', 'villa', 'villetta', 'attico', 'monolocale',
  'bilocale', 'trilocale', 'quadrilocale', 'multilocale', 'casale', 'rustico',
]);

// Override: parole nel titolo che identificano in modo inequivocabile un immobile
// commerciale. Sovrascrive qualunque altra classificazione (titolo scritto a mano
// dall'agente = segnale più affidabile).
const TITOLO_KEYWORDS_COMMERCIALI = [
  'capannone', 'capannoni',
  'industriale',
  'spazio commerciale', 'locale commerciale', 'fondo commerciale',
  'negozio', 'negozi',
  'ufficio', 'uffici',
  'magazzino', 'magazzini',
  'laboratorio',
  'terreno',
];

export function isResidenziale(p: {
  tipologia: string;
  titolo?: string;
  categoria_id?: number | null;
  website_section?: "residential" | "commercial";
}): boolean {
  if (p.website_section) return p.website_section === "residential";
  // 1) Override sul titolo — il testo scritto dall'agente vince sempre.
  const titolo = (p.titolo ?? '').toLowerCase();
  if (TITOLO_KEYWORDS_COMMERCIALI.some((k) => titolo.includes(k))) return false;

  // 2) categoria_id dal gestionale — segnale autoritativo numerico.
  if (typeof p.categoria_id === 'number') {
    return CATEGORIA_ID_RESIDENZIALI.has(p.categoria_id);
  }

  // 3) Fallback sulla stringa tipologia se categoria_id è mancante.
  return TIPOLOGIE_RESIDENZIALI.has(p.tipologia.toLowerCase());
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

export interface ApiBlogArticleList {
  id: number;
  titolo: string;
  slug: string;
  excerpt: string;
  immagine_url: string | null;
  immagine_card_url: string | null;
  data_pubblicazione: string | null;
}

export interface ApiBlogArticleDetail {
  id: number;
  titolo: string;
  slug: string;
  contenuto: string;
  excerpt: string;
  immagine_url: string | null;
  immagine_card_url: string | null;
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
      const res = await fetch(url, BLOG_FETCH_OPTIONS);
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
    const res = await fetch(`${API_BASE}/api/blog/articles/${slug}/`, BLOG_FETCH_OPTIONS);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export function youtubeEmbedUrl(value: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (!['https:', 'http:'].includes(url.protocol)) return null;
    let id: string | null = null;
    if (url.hostname === 'youtu.be') id = url.pathname.slice(1);
    else if (['youtube.com', 'www.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com'].includes(url.hostname)) {
      id = url.pathname.startsWith('/embed/') ? url.pathname.slice(7) : url.searchParams.get('v');
    }
    return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  } catch { return null; }
}
