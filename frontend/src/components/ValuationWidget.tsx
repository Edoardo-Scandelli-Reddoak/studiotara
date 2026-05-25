"use client";

import { useEffect, useState } from "react";

const WIDGET_URL =
  "https://studiotara.agenziepro.it/widgets/10338/Ykg4aDlpK3QvRlRXckpRMzJMaDFaUT09/";

// Fixed heights tuned to step 1 of the widget — chosen so the iframe ends
// right under the "Procedi" button. AgenzieProm posts inflated resize events,
// so we deliberately do NOT honour them and pick the size ourselves.
const DESKTOP_HEIGHT = 480;
const MOBILE_HEIGHT = 440;

export default function ValuationWidget() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return (
    <iframe
      id="iFrameStimaOnline"
      name="iFrameStimaOnline"
      title="Stima online del valore del tuo immobile"
      src={WIDGET_URL}
      style={{ height: `${isMobile ? MOBILE_HEIGHT : DESKTOP_HEIGHT}px` }}
      className="block w-full border-0 mt-4 md:mt-5"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}
