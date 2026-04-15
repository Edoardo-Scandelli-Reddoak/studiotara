"use client";

import { useState } from "react";

interface ContactModalProps {
  triggerText: string;
  triggerClassName: string;
  propertyRef?: string;
}

export default function ContactModal({ triggerText, triggerClassName, propertyRef }: ContactModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    email: "",
    telefono: "",
    messaggio: propertyRef ? `Sono interessato/a all'immobile Rif. ${propertyRef}. Vorrei ricevere maggiori informazioni.` : "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: hook up to backend / email service
    setOpen(false);
    setFormData({ nome: "", cognome: "", email: "", telefono: "", messaggio: "" });
  };

  return (
    <>
      <button type="button" className={triggerClassName} onClick={() => setOpen(true)}>
        {triggerText}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-[520px] max-h-[90vh] overflow-y-auto bg-white rounded-[14px] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-primary to-blue-secondary px-6 py-5 text-white z-10">
              <h3 className="text-[20px] md:text-[24px] font-semibold tracking-[-1px] pr-8">
                Richiedi informazioni
              </h3>
              <p className="text-[13px] md:text-[14px] text-white/80 mt-1">
                Compila il modulo e ti ricontatteremo al più presto.
              </p>
            </div>

            {/* Close */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white z-20"
              aria-label="Chiudi"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-6 py-6 flex flex-col gap-4">
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

              <button
                type="submit"
                className="w-full bg-red-primary text-white text-[16px] font-medium py-[12px] rounded-[8px] hover:scale-[1.02] hover:shadow-lg transition-all duration-300 mt-1"
              >
                Invia richiesta
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
