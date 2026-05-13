import { NextResponse } from "next/server";

const CRM_BASE = process.env.RELATIA_CRM_URL ?? "https://studiotara.relatiacrm.com";
const CRM_TOKEN = process.env.RELATIA_CRM_TOKEN;

// Pipeline & stage for "SITO - richiesta informazioni" (generic contact form)
const PIPELINE_ID = "71da0b37-32b6-4061-a5d4-b3d2b0f9e1ec";
const STAGE_ID = "d4889bbb-da2e-4daf-aaea-c2979e2ea75f";
const SOURCE_ID = 1;

type Body = {
  nome?: string;
  cognome?: string;
  email?: string;
  telefono?: string;
  messaggio?: string;
};

export async function POST(req: Request) {
  if (!CRM_TOKEN) {
    console.error("RELATIA_CRM_TOKEN env var missing");
    return NextResponse.json({ error: "CRM token not configured on server" }, { status: 500 });
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { nome, cognome, email, telefono, messaggio } = body;

  if (!nome?.trim() || !cognome?.trim() || !email?.trim()) {
    return NextResponse.json(
      { error: "Missing required fields (nome, cognome, email)" },
      { status: 400 },
    );
  }

  const headers = {
    Authorization: `Token ${CRM_TOKEN}`,
    "Content-Type": "application/json",
  };

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
    console.error("CRM contact create failed (info-generale):", contactRes.status, errText);
    return NextResponse.json(
      { error: "CRM contact create failed", status: contactRes.status, details: errText },
      { status: 502 },
    );
  }

  const contact = (await contactRes.json()) as { id?: string };
  if (!contact.id) {
    return NextResponse.json({ error: "Unexpected CRM response (missing contact id)" }, { status: 502 });
  }

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
    console.error("CRM deal create failed (info-generale):", dealRes.status, errText);
    return NextResponse.json(
      { error: "CRM deal create failed", status: dealRes.status, details: errText, contactId: contact.id },
      { status: 502 },
    );
  }

  const deal = (await dealRes.json()) as { id?: string };
  return NextResponse.json({ success: true, contactId: contact.id, dealId: deal.id });
}
