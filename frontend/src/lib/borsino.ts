const ENDPOINT = "https://api.borsinopro.it/rest/standard-v1/getQuotazione/";

const TIPOLOGIA_TO_BORSINO_ID: Record<string, number> = {
  Appartamento: 20, // Abitazioni in stabili civili
  Villa: 1,         // Ville e Villini
  Negozio: 5,       // Negozi
  Ufficio: 6,       // Uffici
  Capannone: 7,     // Capannoni tipici
  Altro: 20,        // fallback
};

export type Valutazione = {
  min: number;
  max: number;
  med: number;
  prezzoMqMin: number;
  prezzoMqMax: number;
  prezzoMqMed: number;
  zona?: string;
  anno?: number;
  semestre?: number;
};

type BorsinoResponse = {
  response?: {
    nome?: string;
    quotazione?: {
      min?: string | number;
      max?: string | number;
      med?: string | number;
      anno?: number;
      semestre?: number;
    };
  };
};

type Args = {
  tipologia: string;
  indirizzo: string;
  comune: string;
  provincia?: string;
  mq: number;
};

export async function fetchValutazione({
  tipologia,
  indirizzo,
  comune,
  provincia,
  mq,
}: Args): Promise<Valutazione | null> {
  const apiKey = process.env.BORSINO_API_KEY;
  if (!apiKey) return null;

  const typeId = TIPOLOGIA_TO_BORSINO_ID[tipologia];
  if (!typeId) return null;

  const address = [indirizzo, comune, provincia]
    .filter((p) => p && p.trim())
    .join(" ")
    .trim();
  if (address.length < 5) return null;

  // HTTP Basic Auth: API key as username, empty password (per Borsino doc:
  // CURLOPT_USERPWD = "Api Key").
  const auth = Buffer.from(`${apiKey}:`).toString("base64");

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address, type: typeId, for: "sale" }),
    });
    if (!res.ok) {
      console.error("Borsino getQuotazione failed:", res.status, await res.text());
      return null;
    }
    const data = (await res.json()) as BorsinoResponse;
    const q = data.response?.quotazione;
    const min = Number(q?.min);
    const max = Number(q?.max);
    const med = Number(q?.med);
    if (!Number.isFinite(min) || !Number.isFinite(max) || !Number.isFinite(med)) {
      return null;
    }

    return {
      min: Math.round(min * mq),
      max: Math.round(max * mq),
      med: Math.round(med * mq),
      prezzoMqMin: min,
      prezzoMqMax: max,
      prezzoMqMed: med,
      zona: data.response?.nome,
      anno: q?.anno,
      semestre: q?.semestre,
    };
  } catch (err) {
    console.error("Borsino getQuotazione error:", err);
    return null;
  }
}
