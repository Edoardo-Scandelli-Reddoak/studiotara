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

// Pipeline & stage for "SITO - richiesta info immobile commerciale"
const PIPELINE_ID = "83dce14e-6c93-46ae-b74d-510c1fd311ce";
const STAGE_ID = "31db3c22-4f7a-4a32-ae16-ea7bafd3e680";
const SOURCE_ID = 1;

type Body = {
  nome?: string;
  cognome?: string;
  email?: string;
  telefono?: string;
  messaggio?: string;
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

  const { nome, cognome, email, telefono, messaggio, propertyRef } = body;

  if (!nome?.trim() || !cognome?.trim() || !email?.trim()) {
    return NextResponse.json(
      { error: "Missing required fields (nome, cognome, email)" },
      { status: 400 },
    );
  }

  // Riferimento immobile: auto, non modificabile dall'utente.
  const customValues: CustomValue[] = [];
  pushTextValue(customValues, CRM_CUSTOM_FIELDS.rifImmobile, propertyRef);

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
    console.error("CRM contact create failed (info-commerciale):", contactRes.status, errText);
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
    ? `Immobile rif. ${propertyRef}${messaggio?.trim() ? ` — ${messaggio.trim()}` : ""}`
    : messaggio;
  await createCrmNote(headers, contact.id, noteContent);

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
    console.error("CRM deal create failed (info-commerciale):", dealRes.status, errText);
    return NextResponse.json(
      { error: "CRM deal create failed", status: dealRes.status, details: errText, contactId: contact.id },
      { status: 502 },
    );
  }

  const deal = (await dealRes.json()) as { id?: string };
  return NextResponse.json({ success: true, contactId: contact.id, dealId: deal.id });
}
