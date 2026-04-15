"use client";

import { useState } from "react";

export default function SearchRequestModal() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    email: "",
    telefono: "",
    tipologia: "",
    zona: "",
    mqMin: "",
    mqMax: "",
    budgetMax: "",
    locali: "",
    note: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: hook up to backend / email service
    setOpen(false);
    setFormData({
      nome: "",
      cognome: "",
      email: "",
      telefono: "",
      tipologia: "",
      zona: "",
      mqMin: "",
      mqMax: "",
      budgetMax: "",
      locali: "",
      note: "",
    });
  };

  return (
    <>
      {/* ===== BANNER ===== */}
      <section className="w-full rounded-[20px] md:rounded-[24px] lg:rounded-[28px] bg-gradient-to-b from-blue-primary to-blue-secondary overflow-hidden mt-[80px] md:mt-[120px] lg:mt-[160px] mb-[40px] md:mb-[50px] lg:mb-[60px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.15)] text-white text-center py-12 md:py-16 px-6">
        <h2 className="text-[26px] md:text-[30px] lg:text-[32px] tracking-[-1.5px] md:tracking-[-2px]">
          Non hai trovato <strong>l&apos;immobile giusto?</strong>
        </h2>
        <p className="text-[15px] md:text-[16px] mt-4 max-w-[560px] mx-auto leading-relaxed text-white/85">
          Raccontaci cosa stai cercando: tipologia, zona, metratura e budget.
          Ti avviseremo non appena un immobile in linea con le tue esigenze
          sara disponibile.
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-block mt-8 bg-red-primary text-white text-[15px] md:text-[16px] font-medium px-8 md:px-10 py-[11px] rounded-[6px] hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer"
        >
          Dicci cosa cerchi
        </button>
      </section>

      {/* ===== MODAL ===== */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-[560px] max-h-[90vh] overflow-y-auto bg-white rounded-[14px] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-primary to-blue-secondary px-6 py-5 text-white z-10">
              <h3 className="text-[22px] md:text-[24px] font-semibold tracking-[-1px]">
                Descrivici il tuo immobile ideale
              </h3>
              <p className="text-[14px] text-white/80 mt-1">
                Compila i campi e ti contatteremo quando troveremo la soluzione perfetta per te.
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
              {/* Dati personali */}
              <p className="text-[13px] font-semibold text-black/50 uppercase tracking-wider">Dati personali</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="sr-nome" className="text-[13px] font-medium text-black/70">Nome *</label>
                  <input
                    id="sr-nome"
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
                  <label htmlFor="sr-cognome" className="text-[13px] font-medium text-black/70">Cognome *</label>
                  <input
                    id="sr-cognome"
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
                  <label htmlFor="sr-email" className="text-[13px] font-medium text-black/70">Email *</label>
                  <input
                    id="sr-email"
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
                  <label htmlFor="sr-telefono" className="text-[13px] font-medium text-black/70">Telefono</label>
                  <input
                    id="sr-telefono"
                    name="telefono"
                    type="tel"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="w-full border border-black/15 rounded-[8px] px-4 py-[10px] text-[15px] text-black outline-none focus:border-blue-primary focus:ring-1 focus:ring-blue-primary/30 transition-colors"
                    placeholder="Il tuo numero"
                  />
                </div>
              </div>

              {/* Separatore */}
              <div className="border-t border-black/8 mt-2" />

              {/* Specifiche immobile */}
              <p className="text-[13px] font-semibold text-black/50 uppercase tracking-wider">Che immobile cerchi?</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="sr-tipologia" className="text-[13px] font-medium text-black/70">Tipologia</label>
                  <select
                    id="sr-tipologia"
                    name="tipologia"
                    value={formData.tipologia}
                    onChange={handleChange}
                    className="w-full border border-black/15 rounded-[8px] px-4 py-[10px] text-[15px] text-black outline-none focus:border-blue-primary focus:ring-1 focus:ring-blue-primary/30 transition-colors bg-white"
                  >
                    <option value="">Seleziona...</option>
                    <option value="appartamento">Appartamento</option>
                    <option value="villa">Villa / Casa indipendente</option>
                    <option value="attico">Attico / Mansarda</option>
                    <option value="loft">Loft / Open space</option>
                    <option value="ufficio">Ufficio</option>
                    <option value="negozio">Negozio</option>
                    <option value="capannone">Capannone / Laboratorio</option>
                    <option value="altro">Altro</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="sr-zona" className="text-[13px] font-medium text-black/70">Zona preferita</label>
                  <input
                    id="sr-zona"
                    name="zona"
                    type="text"
                    value={formData.zona}
                    onChange={handleChange}
                    className="w-full border border-black/15 rounded-[8px] px-4 py-[10px] text-[15px] text-black outline-none focus:border-blue-primary focus:ring-1 focus:ring-blue-primary/30 transition-colors"
                    placeholder="Es. Corsico, Buccinasco..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="sr-mqMin" className="text-[13px] font-medium text-black/70">Mq minimi</label>
                  <input
                    id="sr-mqMin"
                    name="mqMin"
                    type="number"
                    min="0"
                    value={formData.mqMin}
                    onChange={handleChange}
                    className="w-full border border-black/15 rounded-[8px] px-4 py-[10px] text-[15px] text-black outline-none focus:border-blue-primary focus:ring-1 focus:ring-blue-primary/30 transition-colors"
                    placeholder="Es. 60"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="sr-mqMax" className="text-[13px] font-medium text-black/70">Mq massimi</label>
                  <input
                    id="sr-mqMax"
                    name="mqMax"
                    type="number"
                    min="0"
                    value={formData.mqMax}
                    onChange={handleChange}
                    className="w-full border border-black/15 rounded-[8px] px-4 py-[10px] text-[15px] text-black outline-none focus:border-blue-primary focus:ring-1 focus:ring-blue-primary/30 transition-colors"
                    placeholder="Es. 120"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="sr-locali" className="text-[13px] font-medium text-black/70">N. locali</label>
                  <input
                    id="sr-locali"
                    name="locali"
                    type="number"
                    min="1"
                    value={formData.locali}
                    onChange={handleChange}
                    className="w-full border border-black/15 rounded-[8px] px-4 py-[10px] text-[15px] text-black outline-none focus:border-blue-primary focus:ring-1 focus:ring-blue-primary/30 transition-colors"
                    placeholder="Es. 3"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="sr-budget" className="text-[13px] font-medium text-black/70">Budget massimo</label>
                <input
                  id="sr-budget"
                  name="budgetMax"
                  type="text"
                  value={formData.budgetMax}
                  onChange={handleChange}
                  className="w-full border border-black/15 rounded-[8px] px-4 py-[10px] text-[15px] text-black outline-none focus:border-blue-primary focus:ring-1 focus:ring-blue-primary/30 transition-colors"
                  placeholder="Es. 250.000 &euro;"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="sr-note" className="text-[13px] font-medium text-black/70">Note aggiuntive</label>
                <textarea
                  id="sr-note"
                  name="note"
                  rows={3}
                  value={formData.note}
                  onChange={handleChange}
                  className="w-full border border-black/15 rounded-[8px] px-4 py-[10px] text-[15px] text-black outline-none focus:border-blue-primary focus:ring-1 focus:ring-blue-primary/30 transition-colors resize-none"
                  placeholder="Altre caratteristiche importanti per te (es. giardino, box auto, terrazzo...)"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-primary text-white text-[16px] font-medium py-[12px] rounded-[8px] hover:scale-[1.02] hover:shadow-lg transition-all duration-300 mt-1"
              >
                Invia la tua richiesta
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
