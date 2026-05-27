/**
 * Shared helpers for the RelatIA CRM HTTP API.
 */

export const CRM_BASE = process.env.RELATIA_CRM_URL ?? "https://studiotara.relatiacrm.com";
export const CRM_TOKEN = process.env.RELATIA_CRM_TOKEN;

/** UUIDs of the custom fields used across the site forms (RelatIA CRM). */
export const CRM_CUSTOM_FIELDS = {
  tipologia: "60068460-82f2-4569-8d87-261205fa62a9", // text
  provincia: "360905aa-c9a7-480e-912c-bdd682f51692", // text
  comune: "9d1e949a-91be-47de-ba6b-a4cdd3348ff6", // text
  indirizzo: "0d16f9d1-dd7f-4669-a0c2-0fc233365a05", // text
  mqMin: "a7ea998a-e810-45a1-9b98-2b57c34cf185", // number
  mqMax: "b2501d02-0645-4c84-bdeb-a9d5b832e43b", // number
  numeroLocali: "80783b5b-acba-46a9-bbda-5dad21520603", // number
  budgetMassimo: "e0bf4b1a-475f-421f-90f6-a7a779429016", // number
  zonaPreferita: "4d113019-0668-45e7-96ae-6b7578dc6456", // text
  noteImmobileIdeale: "41e46d8e-7ee9-4d91-8e1a-95f2f4a08b5f", // text
  noteAppuntamento: "36cedee6-8796-4eb0-afa0-b916710000aa", // text (contacts only)
  tempistiche: "5d042b08-cadf-4655-8968-4bd0ae3aa028", // text (contacts only)
  tipologiaAppuntamento: "fb4783de-507b-4eff-8f7c-a4005ea9ecaa", // text (contacts only)
  immobileDaVendere: "cce89bdc-b95f-49ac-acbe-b44c27499b7b", // text
  rifImmobile: "46986490-cf50-495e-a335-fd24e506a651", // text ("riferimento immobile")
} as const;

export const crmAuthHeaders = (): Record<string, string> | null => {
  if (!CRM_TOKEN) return null;
  return {
    Authorization: `Token ${CRM_TOKEN}`,
    "Content-Type": "application/json",
  };
};

export type CustomValue =
  | { custom_field: string; value_text: string }
  | { custom_field: string; value_number: string };

/** Helper that drops empty/falsy values and trims strings. */
export function pushTextValue(
  list: CustomValue[],
  field: string,
  value: string | undefined,
) {
  const v = value?.trim();
  if (v) list.push({ custom_field: field, value_text: v });
}

/** Helper for numeric custom fields. Accepts string (from form) or number. */
export function pushNumberValue(
  list: CustomValue[],
  field: string,
  value: string | number | undefined,
) {
  if (value === undefined || value === null || value === "") return;
  const num = typeof value === "number" ? value : Number(String(value).replace(",", "."));
  if (!Number.isFinite(num)) return;
  list.push({ custom_field: field, value_number: String(num) });
}

/**
 * Attach a free-text note to a contact via the CRM /api/notes/ endpoint.
 * Notes show up in the standard "Notes" tab of the CRM UI, separately from
 * custom fields. No-ops if `content` is empty. Errors are logged but do not
 * fail the request (the lead has already been created at this point).
 */
export async function createCrmNote(
  headers: Record<string, string>,
  contactId: string,
  content: string | undefined,
): Promise<void> {
  const text = content?.trim();
  if (!text) return;
  try {
    const res = await fetch(`${CRM_BASE}/api/notes/`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        contact: contactId,
        content: text,
        note_type: "general",
      }),
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error("CRM note create failed:", res.status, errText);
    }
  } catch (err) {
    console.error("CRM note create exception:", err);
  }
}
