import { NextResponse } from "next/server";
import { CRM_BASE, CRM_TOKEN, crmAuthHeaders, createCrmNote } from "@/lib/crmHelpers";

// Pipeline & stage for "SITO - richiesta info immobile residenziale"
const PIPELINE_ID = "100b214a-56cd-49da-be1c-f207028f1fc1";
const STAGE_ID = "14eb9eec-83e0-4716-8602-434b6707049b";
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

  const contactRes = await fetch(`${CRM_BASE}/api/contacts/`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      first_name: nome,
      last_name: cognome,
      email,
      phone: telefono ?? "",
      source_new_id: SOURCE_ID,
    }),
  });

  if (!contactRes.ok) {
    const errText = await contactRes.text();
    console.error("CRM contact create failed (info-residenziale):", contactRes.status, errText);
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
    }),
  });

  if (!dealRes.ok) {
    const errText = await dealRes.text();
    console.error("CRM deal create failed (info-residenziale):", dealRes.status, errText);
    return NextResponse.json(
      { error: "CRM deal create failed", status: dealRes.status, details: errText, contactId: contact.id },
      { status: 502 },
    );
  }

  const deal = (await dealRes.json()) as { id?: string };
  return NextResponse.json({ success: true, contactId: contact.id, dealId: deal.id });
}
