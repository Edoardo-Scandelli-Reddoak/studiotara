'use client';

import { useState } from 'react';
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";
import { TIPOLOGIE } from "@/lib/tipologie";

interface Props {
  triggerText: string;
  triggerClassName: string;
  propertyRef?: string;
  submitUrl?: string;
}

const STEPS = ['Situazione', 'Dettagli', 'Contatti'];

export default function AppointmentModal({ triggerText, triggerClassName, propertyRef, submitUrl }: Props) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState({
    vuoleVendere: '',
    tipologiaImmobile: '',
    tempistiche: '',
    nome: '',
    cognome: '',
    email: '',
    telefono: '',
    note: '',
  });

  const update = (field: string, value: string) => setData((prev) => ({ ...prev, [field]: value }));

  const canNext =
    step === 0
      ? data.vuoleVendere !== ''
      : step === 1
        ? data.tipologiaImmobile !== ''
        : data.nome && data.cognome && data.email && data.telefono;

  const handleSubmit = async () => {
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
        body: JSON.stringify({
          nome: data.nome,
          cognome: data.cognome,
          email: data.email,
          telefono: data.telefono,
          vuoleVendere: data.vuoleVendere,
          tipologiaImmobile: data.tipologiaImmobile,
          tempistiche: data.tempistiche,
          note: data.note,
          propertyRef,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || 'Invio non riuscito');
      }
      setSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Errore imprevisto');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setStep(0);
      setSent(false);
      setError(null);
      setSubmitting(false);
      setData({ vuoleVendere: '', tipologiaImmobile: '', tempistiche: '', nome: '', cognome: '', email: '', telefono: '', note: '' });
    }, 300);
  };

  useBodyScrollLock(open);

  const inputClass =
    'w-full border border-black/15 rounded-[8px] px-4 py-3 md:py-[10px] text-[15px] text-black outline-none focus:border-blue-primary focus:ring-1 focus:ring-blue-primary/30 transition-colors';

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
                Fissa un appuntamento
              </h3>
              {propertyRef && (
                <p className="text-[13px] text-white/70 mt-1">Rif. {propertyRef}</p>
              )}
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
              /* Success */
              <div className="px-5 md:px-6 py-8 md:py-10 text-center pb-[max(env(safe-area-inset-bottom),24px)] md:pb-10">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h4 className="text-[20px] font-semibold text-black tracking-[-0.5px]">Richiesta inviata!</h4>
                <p className="text-[15px] text-black/60 mt-2">Ti contatteremo al più presto per fissare l&apos;appuntamento.</p>
                <button
                  onClick={handleClose}
                  className="mt-6 bg-blue-primary text-white text-[15px] font-medium px-8 py-3 md:py-[10px] rounded-[8px] md:hover:scale-[1.02] md:transition-transform cursor-pointer active:scale-[0.99]"
                >
                  Chiudi
                </button>
              </div>
            ) : (
              <div className="px-5 md:px-6 py-5 md:py-6 pb-[max(env(safe-area-inset-bottom),20px)] md:pb-6">
                {/* Stepper indicator */}
                <div className="flex items-center gap-2 mb-6">
                  {STEPS.map((label, i) => (
                    <div key={label} className="flex items-center gap-2 flex-1">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-semibold shrink-0 transition-colors ${
                        i <= step ? 'bg-blue-primary text-white' : 'bg-black/8 text-black/40'
                      }`}>
                        {i + 1}
                      </div>
                      <span className={`text-[12px] tracking-[-0.3px] hidden sm:block ${
                        i <= step ? 'text-black font-medium' : 'text-black/40'
                      }`}>
                        {label}
                      </span>
                      {i < STEPS.length - 1 && (
                        <div className={`flex-1 h-[2px] rounded-full ${i < step ? 'bg-blue-primary' : 'bg-black/8'}`} />
                      )}
                    </div>
                  ))}
                </div>

                {/* Step 1: Situazione */}
                {step === 0 && (
                  <div className="flex flex-col gap-5">
                    <div>
                      <p className="text-[17px] font-semibold text-black tracking-[-0.5px]">
                        Hai un immobile da vendere?
                      </p>
                      <p className="text-[13px] text-black/50 mt-1">
                        Aiutaci a capire le tue esigenze per offrirti il miglior servizio.
                      </p>
                    </div>
                    <div className="flex flex-col gap-2.5">
                      {[
                        { value: 'si_vendere', label: 'Si, voglio vendere un immobile' },
                        { value: 'si_valutazione', label: 'Si, vorrei una valutazione gratuita' },
                        { value: 'no_acquisto', label: 'No, sono interessato ad acquistare' },
                        { value: 'no_affitto', label: 'No, cerco un immobile in affitto' },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => update('vuoleVendere', opt.value)}
                          className={`w-full text-left px-4 py-3 rounded-[8px] border-2 text-[14px] transition-all cursor-pointer ${
                            data.vuoleVendere === opt.value
                              ? 'border-blue-primary bg-blue-primary/5 text-blue-primary font-medium'
                              : 'border-black/10 text-black/70 hover:border-black/25'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Dettagli */}
                {step === 1 && (
                  <div className="flex flex-col gap-5">
                    <div>
                      <p className="text-[17px] font-semibold text-black tracking-[-0.5px]">
                        {data.vuoleVendere?.startsWith('si') ? 'Parlaci del tuo immobile' : 'Cosa stai cercando?'}
                      </p>
                      <p className="text-[13px] text-black/50 mt-1">
                        Queste informazioni ci aiuteranno a prepararci per l&apos;incontro.
                      </p>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[13px] font-medium text-black/70">Tipologia immobile</label>
                      <div className="flex flex-wrap gap-2">
                        {TIPOLOGIE.map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => update('tipologiaImmobile', t)}
                            className={`px-3.5 py-2 rounded-[6px] border text-[13px] transition-all cursor-pointer ${
                              data.tipologiaImmobile === t
                                ? 'border-blue-primary bg-blue-primary text-white'
                                : 'border-black/12 text-black/60 hover:border-black/25'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[13px] font-medium text-black/70">Tempistiche</label>
                      <div className="flex flex-wrap gap-2">
                        {['Il prima possibile', 'Entro 1 mese', 'Entro 3 mesi', 'Nessuna fretta'].map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => update('tempistiche', t)}
                            className={`px-3.5 py-2 rounded-[6px] border text-[13px] transition-all cursor-pointer ${
                              data.tempistiche === t
                                ? 'border-blue-primary bg-blue-primary text-white'
                                : 'border-black/12 text-black/60 hover:border-black/25'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[13px] font-medium text-black/70">Note aggiuntive</label>
                      <textarea
                        value={data.note}
                        onChange={(e) => update('note', e.target.value)}
                        rows={2}
                        className={`${inputClass} resize-none`}
                        placeholder="Qualcosa che vuoi farci sapere..."
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Contatti */}
                {step === 2 && (
                  <div className="flex flex-col gap-5">
                    <div>
                      <p className="text-[17px] font-semibold text-black tracking-[-0.5px]">
                        I tuoi contatti
                      </p>
                      <p className="text-[13px] text-black/50 mt-1">
                        Ti ricontatteremo per fissare giorno e orario dell&apos;appuntamento.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-medium text-black/70">Nome *</label>
                        <input type="text" required value={data.nome} onChange={(e) => update('nome', e.target.value)} className={inputClass} placeholder="Il tuo nome" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-medium text-black/70">Cognome *</label>
                        <input type="text" required value={data.cognome} onChange={(e) => update('cognome', e.target.value)} className={inputClass} placeholder="Il tuo cognome" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-medium text-black/70">Email *</label>
                        <input type="email" required value={data.email} onChange={(e) => update('email', e.target.value)} className={inputClass} placeholder="La tua email" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-medium text-black/70">Telefono *</label>
                        <input type="tel" required value={data.telefono} onChange={(e) => update('telefono', e.target.value)} className={inputClass} placeholder="Il tuo numero" />
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <p className="mt-4 text-[13px] text-red-600">{error}</p>
                )}

                {/* Navigation */}
                <div className="flex gap-3 mt-6">
                  {step > 0 && (
                    <button
                      type="button"
                      onClick={() => setStep((s) => s - 1)}
                      disabled={submitting}
                      className="px-5 py-3 md:py-[10px] rounded-[8px] border-2 border-blue-primary text-blue-primary text-[14px] font-medium md:hover:bg-blue-primary/5 md:transition-all cursor-pointer active:bg-blue-primary/5 disabled:opacity-40 disabled:cursor-default"
                    >
                      Indietro
                    </button>
                  )}
                  {step < 2 ? (
                    <button
                      type="button"
                      onClick={() => setStep((s) => s + 1)}
                      disabled={!canNext}
                      className="flex-1 bg-red-primary text-white text-[15px] font-medium py-3.5 md:py-[11px] rounded-[8px] md:hover:scale-[1.02] md:hover:shadow-lg md:transition-all disabled:opacity-40 md:disabled:hover:scale-100 cursor-pointer disabled:cursor-default active:scale-[0.99]"
                    >
                      Continua
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={!canNext || submitting}
                      className="flex-1 bg-red-primary text-white text-[15px] font-medium py-3.5 md:py-[11px] rounded-[8px] md:hover:scale-[1.02] md:hover:shadow-lg md:transition-all disabled:opacity-40 md:disabled:hover:scale-100 cursor-pointer disabled:cursor-default active:scale-[0.99]"
                    >
                      {submitting ? 'Invio in corso...' : 'Conferma appuntamento'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
