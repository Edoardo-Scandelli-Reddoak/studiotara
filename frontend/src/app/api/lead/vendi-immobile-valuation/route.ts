import { NextResponse } from "next/server";
import { fetchValutazione } from "@/lib/borsino";

const CRM_BASE = process.env.RELATIA_CRM_URL ?? "https://studiotara.relatiacrm.com";
const CRM_TOKEN = process.env.RELATIA_CRM_TOKEN;

// Pipeline & stage for "SITO - richiesta vendita (vendi immobile)"
const PIPELINE_ID = "ef3a85b1-400f-4e8a-9147-804514b9dc6a";
const STAGE_ID = "64740df9-a832-4498-8f47-490b17fda9d0";
const SOURCE_ID = 1;

const CUSTOM_FIELDS = {
  tipologia: "60068460-82f2-4569-8d87-261205fa62a9",
  provincia: "360905aa-c9a7-480e-912c-bdd682f51692",
  comune: "9d1e949a-91be-47de-ba6b-a4cdd3348ff6",
  indirizzo: "0d16f9d1-dd7f-4669-a0c2-0fc233365a05",
};

type CustomValue = { custom_field: string; value_text: string };

type Body = {
  nome?: string;
  cognome?: string;
  email?: string;
  telefono?: string;
  tipologia?: string;
  provincia?: string;
  comune?: string;
  indirizzo?: string;
  mq?: string | number;
};

export async function POST(req: Request) {
  if (!CRM_TOKEN) {
    console.error("RELATIA_CRM_TOKEN env var missing");
    return NextResponse.json(
      { error: "CRM token not configured on server" },
      { status: 500 },
    );
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { nome, cognome, email, telefono, tipologia, provincia, comune, indirizzo, mq } = body;
  const mqNum = Number(mq);
  const mqValid = Number.isFinite(mqNum) && mqNum > 0;

  if (
    !nome?.trim() ||
    !cognome?.trim() ||
    !email?.trim() ||
    !telefono?.trim() ||
    !tipologia?.trim() ||
    !comune?.trim() ||
    !indirizzo?.trim() ||
    !mqValid
  ) {
    return NextResponse.json(
      { error: "Missing required fields (nome, cognome, email, telefono, tipologia, comune, indirizzo, mq)" },
      { status: 400 },
    );
  }

  const indirizzoConMq = `${indirizzo} (${mqNum} m²)`;
  const customValues: CustomValue[] = [
    { custom_field: CUSTOM_FIELDS.tipologia, value_text: tipologia },
    { custom_field: CUSTOM_FIELDS.indirizzo, value_text: indirizzoConMq },
  ];
  if (provincia?.trim()) customValues.push({ custom_field: CUSTOM_FIELDS.provincia, value_text: provincia });
  if (comune?.trim()) customValues.push({ custom_field: CUSTOM_FIELDS.comune, value_text: comune });

  const headers = {
    Authorization: `Token ${CRM_TOKEN}`,
    "Content-Type": "application/json",
  };

  // 1) Create contact
  const contactPayload = {
    first_name: nome,
    last_name: cognome,
    email,
    phone: telefono,
    source_new_id: SOURCE_ID,
    custom_values_create: customValues,
  };

  const contactRes = await fetch(`${CRM_BASE}/api/contacts/`, {
    method: "POST",
    headers,
    body: JSON.stringify(contactPayload),
  });

  if (!contactRes.ok) {
    const errText = await contactRes.text();
    console.error("CRM contact create failed (vendi-immobile):", contactRes.status, errText);
    return NextResponse.json(
      { error: "CRM contact create failed", status: contactRes.status, details: errText },
      { status: 502 },
    );
  }

  const contact = (await contactRes.json()) as { id?: string };
  if (!contact.id) {
    console.error("CRM contact response missing id:", contact);
    return NextResponse.json({ error: "Unexpected CRM response (missing contact id)" }, { status: 502 });
  }

  // 2) Create deal in the "vendi immobile" pipeline
  const dealPayload = {
    contact_id: contact.id,
    pipeline_id: PIPELINE_ID,
    current_stage_id: STAGE_ID,
    custom_name: `${nome} ${cognome}`,
    custom_values_create: customValues,
  };

  const dealRes = await fetch(`${CRM_BASE}/api/deals/`, {
    method: "POST",
    headers,
    body: JSON.stringify(dealPayload),
  });

  if (!dealRes.ok) {
    const errText = await dealRes.text();
    console.error("CRM deal create failed (vendi-immobile):", dealRes.status, errText);
    return NextResponse.json(
      {
        error: "CRM deal create failed",
        status: dealRes.status,
        details: errText,
        contactId: contact.id,
      },
      { status: 502 },
    );
  }

  const deal = (await dealRes.json()) as { id?: string };

  // 3) Fetch Borsino valuation (best-effort: failures don't break the lead).
  const valutazione = await fetchValutazione({
    tipologia,
    indirizzo,
    comune,
    provincia,
    mq: mqNum,
  });

  return NextResponse.json({
    success: true,
    contactId: contact.id,
    dealId: deal.id,
    valutazione,
  });
}
