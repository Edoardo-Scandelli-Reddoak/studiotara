// Creates every lead sheet and its header row in the Google Sheet. Safe to re-run.
// Usage: npx tsx --env-file=.env.local scripts/setup-lead-sheets.ts
import { LEAD_SHEETS } from "../src/lib/googleSheets";

async function main() {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const secret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET;
  if (!url || !secret) throw new Error("GOOGLE_SHEETS_WEBHOOK_URL and GOOGLE_SHEETS_WEBHOOK_SECRET are required");

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret, setup: LEAD_SHEETS }),
  });
  const reply = await res.json();
  if (!reply.ok) throw new Error(`Setup failed: ${reply.error}`);
  console.log(`Fogli pronti: ${Object.keys(LEAD_SHEETS).length}`);
}

main();
