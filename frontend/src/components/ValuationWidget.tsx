"use client";

const WIDGET_URL =
  "https://studiotara.agenziepro.it/widgets/10338/Ykg4aDlpK3QvRlRXckpRMzJMaDFaUT09/";

// Fixed responsive heights; the provider's resize messages overestimate them.
export default function ValuationWidget() {
  return (
    <iframe
      id="iFrameStimaOnline"
      name="iFrameStimaOnline"
      title="Stima online del valore del tuo immobile"
      src={WIDGET_URL}
      className="block h-[440px] w-full border-0 md:h-[420px]"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}
