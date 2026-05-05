'use client';

import { useState } from 'react';

const TIPOLOGIE = [
  'Abitazioni in Stabili Medi',
  'Abitazioni in Stabili Signorili',
  'Abitazioni in Stabili Economici',
  'Ville & Villini',
  'Uffici',
  'Negozi',
  'Box & Autorimesse',
  'Posti Auto Coperti',
  'Posti Auto Scoperti',
  'Laboratori',
  'Magazzini',
  'Capannoni Tipici',
  'Capannoni Industriali',
];

interface Props {
  triggerText: string;
  triggerClassName: string;
}

export default function SellModal({ triggerText, triggerClassName }: Props) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [data, setData] = useState({
    tipologia: '',
    provincia: '',
    comune: '',
    indirizzo: '',
    nome: '',
    telefono: '',
    email: '',
  });

  const update = (field: string, value: string) => setData((prev) => ({ ...prev, [field]: value }));

  const canSubmit = data.tipologia && data.comune;

  const inputClass =
    'h-[42px] md:h-[47px] border-[2.5px] md:border-[3px] border-blue-primary rounded-[6px] px-3 text-[14px] outline-none bg-white focus:border-blue-secondary focus:shadow-[0_0_0_3px_rgba(17,85,218,0.15)] transition-all';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: hook up to backend
    setSent(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setSent(false);
      setData({ tipologia: '', provincia: '', comune: '', indirizzo: '', nome: '', telefono: '', email: '' });
    }, 300);
  };

  return (
    <>
      <button type="button" className={triggerClassName} onClick={() => setOpen(true)}>
        {triggerText}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={handleClose}
        >
          <div
            className="relative w-full max-w-[520px] max-h-[90vh] overflow-y-auto bg-white rounded-[14px] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-primary to-blue-secondary px-6 py-5 text-white z-10">
              <h3 className="text-[20px] md:text-[24px] font-semibold tracking-[-1px] pr-8">
                Vendi il tuo immobile
              </h3>
              <p className="text-[13px] md:text-[14px] text-white/80 mt-1">
                Richiedi una valutazione gratuita e senza impegno.
              </p>
            </div>

            {/* Close */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white z-20"
              aria-label="Chiudi"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {sent ? (
              <div className="px-6 py-10 text-center">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h4 className="text-[20px] font-semibold text-black tracking-[-0.5px]">Richiesta inviata!</h4>
                <p className="text-[15px] text-black/60 mt-2">Ti contatteremo al più presto per la valutazione del tuo immobile.</p>
                <button
                  onClick={handleClose}
                  className="mt-6 bg-blue-primary text-white text-[15px] font-medium px-8 py-[10px] rounded-[8px] hover:scale-[1.02] transition-transform cursor-pointer"
                >
                  Chiudi
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="px-6 py-6 flex flex-col gap-4">
                {/* Immobile info */}
                <p className="text-[15px] font-semibold text-black tracking-[-0.3px]">Il tuo immobile</p>

                <div className="flex flex-col gap-1">
                  <label className="text-[13px] text-black/60 font-medium ml-1">Tipologia *</label>
                  <div className="relative">
                    <select
                      value={data.tipologia}
                      onChange={(e) => update('tipologia', e.target.value)}
                      required
                      className={`w-full ${inputClass} appearance-none cursor-pointer`}
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[13px] text-black/60 font-medium ml-1">Provincia</label>
                    <input
                      type="text"
                      value={data.provincia}
                      onChange={(e) => update('provincia', e.target.value)}
                      placeholder="Es. Milano"
                      className={inputClass}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[13px] text-black/60 font-medium ml-1">Comune *</label>
                    <input
                      type="text"
                      value={data.comune}
                      onChange={(e) => update('comune', e.target.value)}
                      required
                      placeholder="Es. Buccinasco"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[13px] text-black/60 font-medium ml-1">Indirizzo</label>
                  <input
                    type="text"
                    value={data.indirizzo}
                    onChange={(e) => update('indirizzo', e.target.value)}
                    placeholder="Es. Via Roma 2"
                    className={inputClass}
                  />
                </div>

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full bg-red-primary text-white text-[16px] font-medium py-[12px] rounded-[8px] hover:scale-[1.02] hover:shadow-lg transition-all duration-300 mt-1 disabled:opacity-40 disabled:hover:scale-100 cursor-pointer disabled:cursor-default"
                >
                  Richiedi valutazione gratuita
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
