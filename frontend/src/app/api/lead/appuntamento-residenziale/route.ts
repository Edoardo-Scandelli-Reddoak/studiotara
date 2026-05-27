import { NextResponse } from "next/server";
import {
  CRM_BASE,
  CRM_CUSTOM_FIELDS,
  CRM_TOKEN,
  CustomValue,
  crmAuthHeaders,
  createCrmNote,
  pushTextValue,
} from "@/lib/crmHelpers";

// Pipeline & stage for "SITO - appuntamento residenziale"
const PIPELINE_ID = "d9ed1330-f79b-410c-a4b7-478574a0ca9c";
const STAGE_ID = "645eff73-5040-4500-8591-4c15828121c6";
const SOURCE_ID = 1;

type Body = {
  // Contact (always required)
  nome?: string;
  cognome?: string;
  email?: string;
  telefono?: string;
  // SellModal fields
  tipologia?: string;
  provincia?: string;
  comune?: string;
  indirizzo?: string;
  // AppointmentModal fields
  vuoleVendere?: string;
  tipologiaImmobile?: string;
  tempistiche?: string;
  note?: string;
  propertyRef?: string;
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

  const {
    nome,
    cognome,
    email,
    telefono,
    tipologia,
    provincia,
    comune,
    indirizzo,
    vuoleVendere,
    tipologiaImmobile,
    tempistiche,
    note,
    propertyRef,
  } = body;

  if (!nome?.trim() || !cognome?.trim() || !email?.trim() || !telefono?.trim()) {
    return NextResponse.json(
      { error: "Missing required fields (nome, cognome, email, telefono)" },
      { status: 400 },
    );
  }

  const customValues: CustomValue[] = [];
  // SellModal-style address fields
  pushTextValue(customValues, CRM_CUSTOM_FIELDS.tipologia, tipologia);
  pushTextValue(customValues, CRM_CUSTOM_FIELDS.provincia, provincia);
  pushTextValue(customValues, CRM_CUSTOM_FIELDS.comune, comune);
  pushTextValue(customValues, CRM_CUSTOM_FIELDS.indirizzo, indirizzo);
  // AppointmentModal-style fields
  pushTextValue(customValues, CRM_CUSTOM_FIELDS.tipologiaAppuntamento, tipologiaImmobile);
  pushTextValue(customValues, CRM_CUSTOM_FIELDS.tempistiche, tempistiche);
  pushTextValue(customValues, CRM_CUSTOM_FIELDS.immobileDaVendere, vuoleVendere);
  pushTextValue(
    customValues,
    CRM_CUSTOM_FIELDS.noteAppuntamento,
    propertyRef ? `Immobile rif. ${propertyRef}${note ? ` — ${note}` : ""}` : note,
  );
  // Riferimento immobile: auto, non modificabile dall'utente.
  pushTextValue(customValues, CRM_CUSTOM_FIELDS.rifImmobile, propertyRef);

  const contactRes = await fetch(`${CRM_BASE}/api/contacts/`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      first_name: nome,
      last_name: cognome,
      email,
      phone: telefono,
      source_new_id: SOURCE_ID,
      custom_values_create: customValues,
    }),
  });

  if (!contactRes.ok) {
    const errText = await contactRes.text();
    console.error("CRM contact create failed (appuntamento-residenziale):", contactRes.status, errText);
    return NextResponse.json(
      { error: "CRM contact create failed", status: contactRes.status, details: errText },
      { status: 502 },
    );
  }

  const contact = (await contactRes.json()) as { id?: string };
  if (!contact.id) {
    return NextResponse.json({ error: "Unexpected CRM response (missing contact id)" }, { status: 502 });
  }

  const noteContent = propertyRef
    ? `Immobile rif. ${propertyRef}${note?.trim() ? ` — ${note.trim()}` : ""}`
    : note;
  await createCrmNote(headers, contact.id, noteContent);

  // Custom fields that apply to deals only (not contacts-only fields).
  const dealCustomValues = customValues.filter((v) =>
    [
      CRM_CUSTOM_FIELDS.tipologia,
      CRM_CUSTOM_FIELDS.provincia,
      CRM_CUSTOM_FIELDS.comune,
      CRM_CUSTOM_FIELDS.indirizzo,
      CRM_CUSTOM_FIELDS.immobileDaVendere,
      CRM_CUSTOM_FIELDS.rifImmobile,
    ].includes(v.custom_field as never),
  );

  const dealRes = await fetch(`${CRM_BASE}/api/deals/`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      contact_id: contact.id,
      pipeline_id: PIPELINE_ID,
      current_stage_id: STAGE_ID,
      custom_name: `${nome} ${cognome}`,
      custom_values_create: dealCustomValues,
    }),
  });

  if (!dealRes.ok) {
    const errText = await dealRes.text();
    console.error("CRM deal create failed (appuntamento-residenziale):", dealRes.status, errText);
    return NextResponse.json(
      { error: "CRM deal create failed", status: dealRes.status, details: errText, contactId: contact.id },
      { status: 502 },
    );
  }

  const deal = (await dealRes.json()) as { id?: string };
  return NextResponse.json({ success: true, contactId: contact.id, dealId: deal.id });
}
