/**
 * Copies site leads to the "Contatti studiotara" Google Sheet through the Apps
 * Script web app in google-apps-script/lead-sheets.gs. The CRM stays the system
 * of record: a failure here is logged and never reaches the visitor.
 */
import type { Valutazione } from "@/lib/borsino";

const CONTACT = ["Nome", "Cognome", "Email", "Telefono"] as const;
const INFO = [...CONTACT, "Messaggio", "Rif. immobile"] as const;
const APPUNTAMENTO = [...CONTACT, "Vuole vendere", "Tipologia immobile", "Tempistiche", "Note", "Rif. immobile"] as const;
const RICERCA = [...CONTACT, "Tipologia", "Zona", "Mq min", "Mq max", "Budget massimo", "Locali", "Note"] as const;
const VENDITA = [...CONTACT, "Tipologia", "Provincia", "Comune", "Indirizzo"] as const;
const VALUTAZIONE = [...VENDITA, "Mq", "Valutazione stimata"] as const;

/** Sheet name → columns. "Data e ora" is added as first column by the script. */
export const LEAD_SHEETS = {
  "Info generali": [...CONTACT, "Messaggio"],
  Newsletter: ["Email"],
  "Info residenziale": INFO,
  "Info commerciale": INFO,
  "Appuntamento residenziale": APPUNTAMENTO,
  "Appuntamento commerciale": APPUNTAMENTO,
  "Ricerca residenziale": RICERCA,
  "Ricerca commerciale": RICERCA,
  "Vendita residenziale": VENDITA,
  "Vendita commerciale": VENDITA,
  "Valutazione home": VALUTAZIONE,
  "Valutazione vendi immobile": VALUTAZIONE,
} as const;

export type LeadSheet = keyof typeof LEAD_SHEETS;
type LeadRow<S extends LeadSheet> = Partial<Record<(typeof LEAD_SHEETS)[S][number], string | number | null>>;

const REQUEST_TIMEOUT_MS = 15_000;
const MAX_CELL_LENGTH = 5000;

function toCell(value: unknown): string {
  if (value === undefined || value === null) return "";
  const text = typeof value === "object" ? JSON.stringify(value) : String(value);
  return text.trim().slice(0, MAX_CELL_LENGTH);
}

/** Appends one row. Never throws, and logs no lead data. */
export async function appendLeadToSheet<S extends LeadSheet>(sheet: S, row: LeadRow<S>): Promise<void> {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const secret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET;
  if (!url || !secret) return;

  const columns: readonly string[] = LEAD_SHEETS[sheet];
  const cells = row as Record<string, unknown>;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, sheet, columns, values: columns.map((column) => toCell(cells[column])) }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    // Apps Script answers 200 even for script errors, and an HTML page when access is misconfigured.
    const reply = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
    if (!res.ok || !reply?.ok) {
      console.error(`Google Sheets append failed (${sheet}):`, res.status, reply?.error ?? "unexpected reply");
    }
  } catch (err) {
    console.error(`Google Sheets append exception (${sheet}):`, err instanceof Error ? err.message : "unknown");
  }
}

const VUOLE_VENDERE_LABELS: Record<string, string> = {
  si_vendere: "Sì, voglio vendere un immobile",
  si_valutazione: "Sì, vorrei una valutazione gratuita",
  no_acquisto: "No, sono interessato ad acquistare",
  no_affitto: "No, cerco un immobile in affitto",
};

export function formatVuoleVendere(value: string | undefined): string {
  if (!value) return "";
  return VUOLE_VENDERE_LABELS[value] ?? value;
}

export function formatValutazione(valutazione: Valutazione | null): string {
  if (!valutazione) return "";
  const euro = (value: number) => `€ ${value.toLocaleString("it-IT")}`;
  return `${euro(valutazione.min)} – ${euro(valutazione.max)}`;
}
