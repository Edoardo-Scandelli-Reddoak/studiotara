'use client';

import { useState } from 'react';
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";
import { TIPOLOGIE } from "@/lib/tipologie";

interface Props {
  triggerText: string;
  triggerClassName: string;
  /** When set, POSTs the form data as JSON to this URL on submit. */
  submitUrl?: string;
}

export default function SellModal({ triggerText, triggerClassName, submitUrl }: Props) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<0 | 1>(0);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState({
    tipologia: '',
    provincia: '',
    comune: '',
    indirizzo: '',
    nome: '',
    cognome: '',
    telefono: '',
    email: '',
  });

  const update = (field: string, value: string) => setData((prev) => ({ ...prev, [field]: value }));

  const canStep1 = data.tipologia !== '' && data.comune.trim() !== '';
  const canSubmit =
    data.nome.trim() !== '' &&
    data.cognome.trim() !== '' &&
    data.email.trim() !== '' &&
    data.telefono.trim() !== '';

  useBodyScrollLock(open);

  const inputClass =
    'h-[44px] md:h-[47px] border-2 md:border-[3px] border-blue-primary rounded-[8px] md:rounded-[6px] px-3 text-[15px] md:text-[14px] outline-none bg-white focus:border-blue-secondary focus:shadow-[0_0_0_3px_rgba(17,85,218,0.15)] transition-all';

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (canStep1) setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;

    if (!submitUrl) {
      setSent(true);
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(submitUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSent(true);
    } catch (err) {
      console.error('SellModal submit error:', err);
      setError("Si è verificato un problema nell'invio. Riprova o contattaci direttamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setStep(0);
      setSent(false);
      setSubmitting(false);
      setError(null);
      setData({ tipologia: '', provincia: '', comune: '', indirizzo: '', nome: '', cognome: '', telefono: '', email: '' });
    }, 300);
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
                <p className="text-[15px] text-black/60 mt-2">Ti contatteremo al più presto per la valutazione del tuo immobile.</p>
                <button
                  onClick={handleClose}
                  className="mt-6 bg-blue-primary text-white text-[15px] font-medium px-8 py-3 md:py-[10px] rounded-[8px] md:hover:scale-[1.02] md:transition-transform cursor-pointer active:scale-[0.99]"
                >
                  Chiudi
                </button>
              </div>
            ) : (
              <form onSubmit={step === 0 ? handleNext : handleSubmit} className="px-5 md:px-6 py-5 md:py-6 flex flex-col gap-4 pb-[max(env(safe-area-inset-bottom),20px)] md:pb-6">
                {/* Step indicator */}
                <div className="flex items-center justify-start md:justify-center gap-2 text-[12px]">
                  <span className={step === 0 ? 'text-blue-primary font-semibold' : 'text-black/40'}>
                    1. Immobile
                  </span>
                  <span className="text-black/30">·</span>
                  <span className={step === 1 ? 'text-blue-primary font-semibold' : 'text-black/40'}>
                    2. I tuoi dati
                  </span>
                </div>

                {step === 0 ? (
                  <>
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
                      className="w-full bg-red-primary text-white text-[16px] font-medium py-3.5 md:py-[12px] rounded-[8px] md:hover:scale-[1.02] md:hover:shadow-lg md:transition-all md:duration-300 mt-1 cursor-pointer active:scale-[0.99]"
                    >
                      Continua
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-[15px] font-semibold text-black tracking-[-0.3px]">I tuoi dati</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[13px] text-black/60 font-medium ml-1">Nome *</label>
                        <input
                          type="text"
                          value={data.nome}
                          onChange={(e) => update('nome', e.target.value)}
                          required
                          placeholder="Es. Mario"
                          className={inputClass}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[13px] text-black/60 font-medium ml-1">Cognome *</label>
                        <input
                          type="text"
                          value={data.cognome}
                          onChange={(e) => update('cognome', e.target.value)}
                          required
                          placeholder="Es. Rossi"
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[13px] text-black/60 font-medium ml-1">Email *</label>
                        <input
                          type="email"
                          value={data.email}
                          onChange={(e) => update('email', e.target.value)}
                          required
                          placeholder="Es. mario.rossi@email.com"
                          className={inputClass}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[13px] text-black/60 font-medium ml-1">Telefono *</label>
                        <input
                          type="tel"
                          value={data.telefono}
                          onChange={(e) => update('telefono', e.target.value)}
                          required
                          placeholder="Es. 334 1234567"
                          className={inputClass}
                        />
                      </div>
                    </div>

                    {error && (
                      <p className="text-[13px] text-red-primary text-center -mb-1">{error}</p>
                    )}
                    <div className="flex gap-3 mt-1">
                      <button
                        type="button"
                        onClick={() => setStep(0)}
                        disabled={submitting}
                        className="px-5 py-3 md:py-[12px] rounded-[8px] border-2 border-blue-primary text-blue-primary text-[14px] md:text-[15px] font-medium md:hover:bg-blue-primary/5 md:transition-all cursor-pointer active:bg-blue-primary/5 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Indietro
                      </button>
                      <button
                        type="submit"
                        disabled={!canSubmit || submitting}
                        className="flex-1 bg-red-primary text-white text-[16px] font-medium py-3.5 md:py-[12px] rounded-[8px] md:hover:scale-[1.02] md:hover:shadow-lg md:transition-all md:duration-300 disabled:opacity-40 md:disabled:hover:scale-100 cursor-pointer disabled:cursor-default active:scale-[0.99]"
                      >
                        {submitting ? 'Invio in corso...' : 'Richiedi valutazione'}
                      </button>
                    </div>
                  </>
                )}
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
