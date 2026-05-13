import { NextResponse } from "next/server";
import {
  CRM_BASE,
  CRM_CUSTOM_FIELDS,
  CRM_TOKEN,
  CustomValue,
  crmAuthHeaders,
  pushTextValue,
} from "@/lib/crmHelpers";

// Pipeline & stage for "SITO - richiesta vendita residenziale"
const PIPELINE_ID = "8a9b8333-67fe-487b-a2b1-4d013682d7d0";
const STAGE_ID = "6c33b470-e0ca-40e6-bc40-b95f6a45313a";
const SOURCE_ID = 1;

type Body = {
  nome?: string;
  cognome?: string;
  email?: string;
  telefono?: string;
  tipologia?: string;
  provincia?: string;
  comune?: string;
  indirizzo?: string;
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

  const { nome, cognome, email, telefono, tipologia, provincia, comune, indirizzo } = body;

  if (
    !nome?.trim() ||
    !cognome?.trim() ||
    !email?.trim() ||
    !telefono?.trim() ||
    !tipologia?.trim() ||
    !comune?.trim()
  ) {
    return NextResponse.json(
      { error: "Missing required fields (nome, cognome, email, telefono, tipologia, comune)" },
      { status: 400 },
    );
  }

  const customValues: CustomValue[] = [];
  pushTextValue(customValues, CRM_CUSTOM_FIELDS.tipologia, tipologia);
  pushTextValue(customValues, CRM_CUSTOM_FIELDS.provincia, provincia);
  pushTextValue(customValues, CRM_CUSTOM_FIELDS.comune, comune);
  pushTextValue(customValues, CRM_CUSTOM_FIELDS.indirizzo, indirizzo);

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
    console.error("CRM contact create failed (vendita-residenziale):", contactRes.status, errText);
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
      custom_values_create: customValues,
    }),
  });

  if (!dealRes.ok) {
    const errText = await dealRes.text();
    console.error("CRM deal create failed (vendita-residenziale):", dealRes.status, errText);
    return NextResponse.json(
      { error: "CRM deal create failed", status: dealRes.status, details: errText, contactId: contact.id },
      { status: 502 },
    );
  }

  const deal = (await dealRes.json()) as { id?: string };
  return NextResponse.json({ success: true, contactId: contact.id, dealId: deal.id });
}
