"use client";

import { useState } from "react";
import { TIPOLOGIE } from "@/lib/tipologie";

type Data = {
  tipologia: string;
  provincia: string;
  comune: string;
  indirizzo: string;
  nome: string;
  cognome: string;
  email: string;
  telefono: string;
};

type Variant = "default" | "large";

type Props = {
  variant?: Variant;
  /** When set, POSTs the form data as JSON to this URL on submit. */
  submitUrl?: string;
};

const inputClasses = (variant: Variant) =>
  variant === "large"
    ? "w-full h-[44px] md:h-[47px] border-2 md:border-[3px] border-blue-primary rounded-[8px] md:rounded-[6px] px-3 text-[15px] md:text-[14px] outline-none bg-white focus:border-blue-secondary focus:shadow-[0_0_0_3px_rgba(17,85,218,0.15)] transition-all"
    : "w-full h-[44px] md:h-[42px] border-2 md:border-[2.5px] border-blue-primary rounded-[8px] md:rounded-[6px] px-3 text-[15px] md:text-[14px] outline-none bg-white focus:border-blue-secondary focus:shadow-[0_0_0_3px_rgba(17,85,218,0.15)] transition-all";

export default function ValuationForm({ variant = "default", submitUrl }: Props) {
  const inputBase = inputClasses(variant);
  const formGap = variant === "large" ? "gap-3 md:gap-5" : "gap-3 md:gap-4";
  const formTop = variant === "large" ? "mt-4 md:mt-6" : "mt-4 md:mt-5";
  const maxWidth = variant === "large" ? "max-w-[604px]" : "max-w-[520px]";
  const [step, setStep] = useState<0 | 1>(0);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Data>({
    tipologia: "",
    provincia: "",
    comune: "",
    indirizzo: "",
    nome: "",
    cognome: "",
    email: "",
    telefono: "",
  });

  const update = (field: keyof Data, value: string) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const canStep1 = data.tipologia !== "" && data.comune.trim() !== "";
  const canSubmit =
    data.nome.trim() !== "" &&
    data.cognome.trim() !== "" &&
    data.email.trim() !== "" &&
    data.telefono.trim() !== "";

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (canStep1) setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;

    if (!submitUrl) {
      // No endpoint configured: just mark as sent (used for forms not yet wired up).
      setSent(true);
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(submitUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSent(true);
    } catch (err) {
      console.error("Valuation submit error:", err);
      setError("Si è verificato un problema nell'invio. Riprova o contattaci direttamente.");
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center text-center mt-5 md:mt-6 max-w-[520px] mx-auto py-6">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="text-[18px] md:text-[20px] font-semibold text-black tracking-[-0.5px]">
          Richiesta inviata!
        </p>
        <p className="text-[14px] md:text-[15px] text-black/60 mt-2">
          Ti contatteremo al più presto per la valutazione del tuo immobile.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={step === 0 ? handleNext : handleSubmit}
      className={`flex flex-col ${formGap} ${formTop} ${maxWidth} mx-auto`}
    >
      {/* Step indicator */}
      <div className="flex items-center justify-start md:justify-center gap-2 text-[12px] mb-1">
        <span className={step === 0 ? "text-blue-primary font-semibold" : "text-black/40"}>
          1. Immobile
        </span>
        <span className="text-black/30">·</span>
        <span className={step === 1 ? "text-blue-primary font-semibold" : "text-black/40"}>
          2. I tuoi dati
        </span>
      </div>

      {step === 0 ? (
        <>
          <div className={`flex flex-col md:flex-row ${formGap}`}>
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-[13px] text-black/60 font-medium ml-1">Tipologia *</label>
              <div className="relative">
                <select
                  value={data.tipologia}
                  onChange={(e) => update("tipologia", e.target.value)}
                  required
                  className={`${inputBase} pr-9 appearance-none cursor-pointer`}
                >
                  <option value="" disabled>Seleziona tipologia...</option>
                  {TIPOLOGIE.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1152d2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-[13px] text-black/60 font-medium ml-1">Provincia</label>
              <input
                type="text"
                placeholder="Es. Milano"
                value={data.provincia}
                onChange={(e) => update("provincia", e.target.value)}
                className={inputBase}
              />
            </div>
          </div>
          <div className={`flex flex-col md:flex-row ${formGap}`}>
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-[13px] text-black/60 font-medium ml-1">Comune *</label>
              <input
                type="text"
                placeholder="Es. Buccinasco"
                required
                value={data.comune}
                onChange={(e) => update("comune", e.target.value)}
                className={inputBase}
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-[13px] text-black/60 font-medium ml-1">Indirizzo</label>
              <input
                type="text"
                placeholder="Es. Via Roma 2"
                value={data.indirizzo}
                onChange={(e) => update("indirizzo", e.target.value)}
                className={inputBase}
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-red-primary text-white text-[16px] md:text-[17px] font-medium py-3 md:py-[11px] rounded-[8px] md:rounded-[6px] md:hover:scale-[1.02] md:hover:shadow-lg md:transition-all md:duration-300 cursor-pointer active:scale-[0.99]"
          >
            Continua
          </button>
        </>
      ) : (
        <>
          <div className={`flex flex-col md:flex-row ${formGap}`}>
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-[13px] text-black/60 font-medium ml-1">Nome *</label>
              <input
                type="text"
                placeholder="Es. Mario"
                required
                value={data.nome}
                onChange={(e) => update("nome", e.target.value)}
                className={inputBase}
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-[13px] text-black/60 font-medium ml-1">Cognome *</label>
              <input
                type="text"
                placeholder="Es. Rossi"
                required
                value={data.cognome}
                onChange={(e) => update("cognome", e.target.value)}
                className={inputBase}
              />
            </div>
          </div>
          <div className={`flex flex-col md:flex-row ${formGap}`}>
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-[13px] text-black/60 font-medium ml-1">Email *</label>
              <input
                type="email"
                placeholder="Es. mario.rossi@email.com"
                required
                value={data.email}
                onChange={(e) => update("email", e.target.value)}
                className={inputBase}
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-[13px] text-black/60 font-medium ml-1">Telefono *</label>
              <input
                type="tel"
                placeholder="Es. 334 1234567"
                required
                value={data.telefono}
                onChange={(e) => update("telefono", e.target.value)}
                className={inputBase}
              />
            </div>
          </div>
          {error && (
            <p className="text-[13px] text-red-primary text-center -mb-1">{error}</p>
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(0)}
              disabled={submitting}
              className="px-5 py-3 md:py-[11px] rounded-[8px] md:rounded-[6px] border-2 border-blue-primary text-blue-primary text-[14px] md:text-[15px] font-medium md:hover:bg-blue-primary/5 md:transition-all cursor-pointer active:bg-blue-primary/5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Indietro
            </button>
            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className="flex-1 bg-red-primary text-white text-[16px] md:text-[17px] font-medium py-3 md:py-[11px] rounded-[8px] md:rounded-[6px] md:hover:scale-[1.02] md:hover:shadow-lg md:transition-all md:duration-300 cursor-pointer active:scale-[0.99] disabled:opacity-40 md:disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              {submitting ? "Invio in corso..." : "Richiedi valutazione"}
            </button>
          </div>
        </>
      )}
    </form>
  );
}
