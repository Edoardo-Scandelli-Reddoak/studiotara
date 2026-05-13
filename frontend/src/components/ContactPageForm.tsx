"use client";

import { useState } from "react";

const SUBMIT_URL = "/api/lead/info-generale";

export default function ContactPageForm() {
  const [data, setData] = useState({
    nome: "",
    cognome: "",
    email: "",
    telefono: "",
    messaggio: "",
  });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (field: keyof typeof data, value: string) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(SUBMIT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSent(true);
    } catch (err) {
      console.error("ContactPageForm submit error:", err);
      setError("Si è verificato un problema nell'invio. Riprova o contattaci direttamente.");
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center text-center py-6">
        <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="text-[20px] md:text-[22px] font-semibold text-white tracking-[-0.5px]">
          Richiesta inviata!
        </p>
        <p className="text-[15px] text-white/85 mt-2 max-w-[420px]">
          Ti contatteremo al più presto. Grazie per averci scritto!
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-5 lg:gap-[32px]">
      <div className="flex flex-col md:flex-row gap-4 md:gap-5 lg:gap-[28px]">
        <div className="flex-1 flex flex-col gap-1.5">
          <label className="text-[13px] text-white/80 md:text-white/70 font-medium ml-1">Nome *</label>
          <input
            type="text"
            required
            value={data.nome}
            onChange={(e) => update("nome", e.target.value)}
            placeholder="Es. Mario"
            className="h-[48px] md:h-[54px] lg:h-[59px] bg-white rounded-[8px] md:rounded-[6px] px-4 text-[15px] md:text-[15px] outline-none focus:shadow-[0_0_0_3px_rgba(210,7,42,0.3)] transition-all"
          />
        </div>
        <div className="flex-1 flex flex-col gap-1.5">
          <label className="text-[13px] text-white/80 md:text-white/70 font-medium ml-1">Cognome *</label>
          <input
            type="text"
            required
            value={data.cognome}
            onChange={(e) => update("cognome", e.target.value)}
            placeholder="Es. Rossi"
            className="h-[48px] md:h-[54px] lg:h-[59px] bg-white rounded-[8px] md:rounded-[6px] px-4 text-[15px] md:text-[15px] outline-none focus:shadow-[0_0_0_3px_rgba(210,7,42,0.3)] transition-all"
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 md:gap-5 lg:gap-[28px]">
        <div className="flex-1 flex flex-col gap-1.5">
          <label className="text-[13px] text-white/80 md:text-white/70 font-medium ml-1">Email *</label>
          <input
            type="email"
            required
            value={data.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="Es. mario.rossi@email.com"
            className="h-[48px] md:h-[54px] lg:h-[59px] bg-white rounded-[8px] md:rounded-[6px] px-4 text-[15px] md:text-[15px] outline-none focus:shadow-[0_0_0_3px_rgba(210,7,42,0.3)] transition-all"
          />
        </div>
        <div className="flex-1 flex flex-col gap-1.5">
          <label className="text-[13px] text-white/80 md:text-white/70 font-medium ml-1">Telefono</label>
          <input
            type="tel"
            value={data.telefono}
            onChange={(e) => update("telefono", e.target.value)}
            placeholder="Es. 334 1234567"
            className="h-[48px] md:h-[54px] lg:h-[59px] bg-white rounded-[8px] md:rounded-[6px] px-4 text-[15px] md:text-[15px] outline-none focus:shadow-[0_0_0_3px_rgba(210,7,42,0.3)] transition-all"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] text-white/80 md:text-white/70 font-medium ml-1">Messaggio</label>
        <textarea
          value={data.messaggio}
          onChange={(e) => update("messaggio", e.target.value)}
          placeholder="Es. Vorrei vendere il mio appartamento a Buccinasco..."
          rows={4}
          className="w-full min-h-[110px] md:min-h-[100px] lg:min-h-[112px] bg-white rounded-[8px] md:rounded-[6px] px-4 py-3 text-[15px] md:text-[15px] outline-none resize-none focus:shadow-[0_0_0_3px_rgba(210,7,42,0.3)] transition-all"
        />
      </div>
      {error && (
        <p className="text-[13px] text-white bg-red-primary/80 rounded-[6px] px-3 py-2 text-center">
          {error}
        </p>
      )}
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={submitting}
          className="w-full md:w-auto bg-red-primary text-white text-[16px] md:text-[17px] font-medium px-6 md:px-10 py-3 md:py-[11px] rounded-[8px] md:rounded-[6px] md:hover:scale-105 md:hover:shadow-lg md:transition-all md:duration-300 cursor-pointer active:scale-[0.99] disabled:opacity-60 md:disabled:hover:scale-100 disabled:cursor-not-allowed"
        >
          {submitting ? "Invio in corso..." : "Contattaci adesso!"}
        </button>
      </div>
    </form>
  );
}
