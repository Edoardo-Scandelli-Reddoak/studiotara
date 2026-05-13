"use client";

import { useState } from "react";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";

interface ContactModalProps {
  triggerText: string;
  triggerClassName: string;
  propertyRef?: string;
  /** When set, POSTs the form data as JSON to this URL on submit. */
  submitUrl?: string;
}

export default function ContactModal({ triggerText, triggerClassName, propertyRef, submitUrl }: ContactModalProps) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initialMessage = propertyRef
    ? `Sono interessato/a all'immobile Rif. ${propertyRef}. Vorrei ricevere maggiori informazioni.`
    : "";
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    email: "",
    telefono: "",
    messaggio: initialMessage,
  });

  useBodyScrollLock(open);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setSent(false);
      setSubmitting(false);
      setError(null);
      setFormData({ nome: "", cognome: "", email: "", telefono: "", messaggio: initialMessage });
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!submitUrl) {
      setSent(true);
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(submitUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, propertyRef }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSent(true);
    } catch (err) {
      console.error("ContactModal submit error:", err);
      setError("Si è verificato un problema nell'invio. Riprova o contattaci direttamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button type="button" className={triggerClassName} onClick={() => setOpen(true)}>
        {triggerText}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/60"
          onClick={handleClose}
        >
          <div
            className="relative w-full max-w-none md:max-w-[520px] max-h-[92vh] md:max-h-[90vh] overflow-y-auto bg-white rounded-t-[20px] rounded-b-none md:rounded-[14px] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle for mobile */}
            <div className="md:hidden sticky top-0 z-30 bg-white pt-2 pb-1 flex justify-center">
              <div className="w-10 h-1 rounded-full bg-black/15" />
            </div>

            {/* Header */}
            <div className="sticky top-3 md:top-0 bg-gradient-to-r from-blue-primary to-blue-secondary px-5 md:px-6 py-4 md:py-5 text-white z-10">
              <h3 className="text-[19px] md:text-[24px] font-semibold tracking-[-0.6px] md:tracking-[-1px] pr-9">
                Richiedi informazioni
              </h3>
              <p className="text-[13px] md:text-[14px] text-white/80 mt-1">
                Compila il modulo e ti ricontatteremo al più presto.
              </p>
            </div>

            {/* Close */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-[18px] md:top-4 right-3 md:right-4 w-9 h-9 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-white/20 md:hover:bg-white/30 md:transition-colors text-white z-20 active:bg-white/30"
              aria-label="Chiudi"
            >
              <svg width="20" height="20" className="md:w-[18px] md:h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {sent ? (
              <div className="px-5 md:px-6 py-8 md:py-10 text-center pb-[max(env(safe-area-inset-bottom),24px)] md:pb-10">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h4 className="text-[20px] font-semibold text-black tracking-[-0.5px]">Richiesta inviata!</h4>
                <p className="text-[15px] text-black/60 mt-2">Ti contatteremo al più presto.</p>
                <button
                  onClick={handleClose}
                  className="mt-6 bg-blue-primary text-white text-[15px] font-medium px-8 py-3 md:py-[10px] rounded-[8px] md:hover:scale-[1.02] md:transition-transform cursor-pointer active:scale-[0.99]"
                >
                  Chiudi
                </button>
              </div>
            ) : (
            <form onSubmit={handleSubmit} className="px-5 md:px-6 py-5 md:py-6 flex flex-col gap-4 pb-[max(env(safe-area-inset-bottom),20px)] md:pb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="modal-nome" className="text-[13px] font-medium text-black/70">
                    Nome *
                  </label>
                  <input
                    id="modal-nome"
                    name="nome"
                    type="text"
                    required
                    value={formData.nome}
                    onChange={handleChange}
                    className="w-full border border-black/15 rounded-[8px] px-4 py-[10px] text-[15px] text-black outline-none focus:border-blue-primary focus:ring-1 focus:ring-blue-primary/30 transition-colors"
                    placeholder="Il tuo nome"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="modal-cognome" className="text-[13px] font-medium text-black/70">
                    Cognome *
                  </label>
                  <input
                    id="modal-cognome"
                    name="cognome"
                    type="text"
                    required
                    value={formData.cognome}
                    onChange={handleChange}
                    className="w-full border border-black/15 rounded-[8px] px-4 py-[10px] text-[15px] text-black outline-none focus:border-blue-primary focus:ring-1 focus:ring-blue-primary/30 transition-colors"
                    placeholder="Il tuo cognome"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="modal-email" className="text-[13px] font-medium text-black/70">
                    Email *
                  </label>
                  <input
                    id="modal-email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-black/15 rounded-[8px] px-4 py-[10px] text-[15px] text-black outline-none focus:border-blue-primary focus:ring-1 focus:ring-blue-primary/30 transition-colors"
                    placeholder="La tua email"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="modal-telefono" className="text-[13px] font-medium text-black/70">
                    Telefono
                  </label>
                  <input
                    id="modal-telefono"
                    name="telefono"
                    type="tel"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="w-full border border-black/15 rounded-[8px] px-4 py-[10px] text-[15px] text-black outline-none focus:border-blue-primary focus:ring-1 focus:ring-blue-primary/30 transition-colors"
                    placeholder="Il tuo numero"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="modal-messaggio" className="text-[13px] font-medium text-black/70">
                  Messaggio
                </label>
                <textarea
                  id="modal-messaggio"
                  name="messaggio"
                  rows={4}
                  value={formData.messaggio}
                  onChange={handleChange}
                  className="w-full border border-black/15 rounded-[8px] px-4 py-[10px] text-[15px] text-black outline-none focus:border-blue-primary focus:ring-1 focus:ring-blue-primary/30 transition-colors resize-none"
                  placeholder="Scrivi il tuo messaggio..."
                />
              </div>

              {error && (
                <p className="text-[13px] text-red-primary text-center -mb-1">{error}</p>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-red-primary text-white text-[16px] font-medium py-3.5 md:py-[12px] rounded-[8px] md:hover:scale-[1.02] md:hover:shadow-lg md:transition-all md:duration-300 mt-1 active:scale-[0.99] disabled:opacity-40 md:disabled:hover:scale-100 disabled:cursor-not-allowed"
              >
                {submitting ? "Invio in corso..." : "Invia richiesta"}
              </button>
            </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
