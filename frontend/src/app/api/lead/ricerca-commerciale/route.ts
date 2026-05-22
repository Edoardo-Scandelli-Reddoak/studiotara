import { NextResponse } from "next/server";
import {
  CRM_BASE,
  CRM_CUSTOM_FIELDS,
  CRM_TOKEN,
  CustomValue,
  crmAuthHeaders,
  createCrmNote,
  pushNumberValue,
  pushTextValue,
} from "@/lib/crmHelpers";

// Pipeline & stage for "SITO - ricerca immobile ideale (commerciale)"
const PIPELINE_ID = "35de9a97-bdbc-4d2c-844c-2f698a64068c";
const STAGE_ID = "e1f329f3-6392-4a11-aa31-855ec8c080a9";
const SOURCE_ID = 1;

type Body = {
  nome?: string;
  cognome?: string;
  email?: string;
  telefono?: string;
  tipologia?: string;
  zona?: string;
  mqMin?: string;
  mqMax?: string;
  budgetMax?: string;
  locali?: string;
  note?: string;
};

export async function POST(req: Request) {
  const headers = crmAuthHeaders();
  if (!headers || !CRM_TOKEN) {
    console.error("RELATIA_CRM_TOKEN env var missing");
    return NextResponse.json({ error: "CRM token not configured on server" }, { status: 500 });
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { nome, cognome, email, telefono, tipologia, zona, mqMin, mqMax, budgetMax, locali, note } = body;

  if (!nome?.trim() || !cognome?.trim() || !email?.trim()) {
    return NextResponse.json(
      { error: "Missing required fields (nome, cognome, email)" },
      { status: 400 },
    );
  }

  const customValues: CustomValue[] = [];
  pushTextValue(customValues, CRM_CUSTOM_FIELDS.tipologia, tipologia);
  pushTextValue(customValues, CRM_CUSTOM_FIELDS.zonaPreferita, zona);
  pushNumberValue(customValues, CRM_CUSTOM_FIELDS.mqMin, mqMin);
  pushNumberValue(customValues, CRM_CUSTOM_FIELDS.mqMax, mqMax);
  pushNumberValue(customValues, CRM_CUSTOM_FIELDS.numeroLocali, locali);
  pushNumberValue(customValues, CRM_CUSTOM_FIELDS.budgetMassimo, budgetMax);
  pushTextValue(customValues, CRM_CUSTOM_FIELDS.noteImmobileIdeale, note);

  const contactRes = await fetch(`${CRM_BASE}/api/contacts/`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      first_name: nome,
      last_name: cognome,
      email,
      phone: telefono ?? "",
      source_new_id: SOURCE_ID,
      custom_values_create: customValues,
    }),
  });

  if (!contactRes.ok) {
    const errText = await contactRes.text();
    console.error("CRM contact create failed (ricerca-commerciale):", contactRes.status, errText);
    return NextResponse.json(
      { error: "CRM contact create failed", status: contactRes.status, details: errText },
      { status: 502 },
    );
  }

  const contact = (await contactRes.json()) as { id?: string };
  if (!contact.id) {
    return NextResponse.json({ error: "Unexpected CRM response (missing contact id)" }, { status: 502 });
  }

  await createCrmNote(headers, contact.id, note);

  const dealRes = await fetch(`${CRM_BASE}/api/deals/`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      contact_id: contact.id,
      pipeline_id: PIPELINE_ID,
      current_stage_id: STAGE_ID,
      custom_name: `${nome} ${cognome}`,
      custom_values_create: customValues,
    }),
  });

  if (!dealRes.ok) {
    const errText = await dealRes.text();
    console.error("CRM deal create failed (ricerca-commerciale):", dealRes.status, errText);
    return NextResponse.json(
      { error: "CRM deal create failed", status: dealRes.status, details: errText, contactId: contact.id },
      { status: 502 },
    );
  }

  const deal = (await dealRes.json()) as { id?: string };
  return NextResponse.json({ success: true, contactId: contact.id, dealId: deal.id });
}
