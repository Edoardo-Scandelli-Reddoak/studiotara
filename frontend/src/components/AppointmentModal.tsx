'use client';

import { useState } from 'react';

interface Props {
  triggerText: string;
  triggerClassName: string;
  propertyRef?: string;
}

const STEPS = ['Situazione', 'Dettagli', 'Contatti'];

export default function AppointmentModal({ triggerText, triggerClassName, propertyRef }: Props) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [sent, setSent] = useState(false);
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

  const handleSubmit = () => {
    // TODO: hook up to backend
    setSent(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setStep(0);
      setSent(false);
      setData({ vuoleVendere: '', tipologiaImmobile: '', tempistiche: '', nome: '', cognome: '', email: '', telefono: '', note: '' });
    }, 300);
  };

  const inputClass =
    'w-full border border-black/15 rounded-[8px] px-4 py-[10px] text-[15px] text-black outline-none focus:border-blue-primary focus:ring-1 focus:ring-blue-primary/30 transition-colors';

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
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white z-20"
              aria-label="Chiudi"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {sent ? (
              /* Success */
              <div className="px-6 py-10 text-center">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h4 className="text-[20px] font-semibold text-black tracking-[-0.5px]">Richiesta inviata!</h4>
                <p className="text-[15px] text-black/60 mt-2">Ti contatteremo al più presto per fissare l&apos;appuntamento.</p>
                <button
                  onClick={handleClose}
                  className="mt-6 bg-blue-primary text-white text-[15px] font-medium px-8 py-[10px] rounded-[8px] hover:scale-[1.02] transition-transform cursor-pointer"
                >
                  Chiudi
                </button>
              </div>
            ) : (
              <div className="px-6 py-6">
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
                        {['Appartamento', 'Villa', 'Negozio', 'Ufficio', 'Capannone', 'Altro'].map((t) => (
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

                {/* Navigation */}
                <div className="flex gap-3 mt-6">
                  {step > 0 && (
                    <button
                      type="button"
                      onClick={() => setStep((s) => s - 1)}
                      className="px-5 py-[10px] rounded-[8px] border-2 border-blue-primary text-blue-primary text-[14px] font-medium hover:bg-blue-primary/5 transition-all cursor-pointer"
                    >
                      Indietro
                    </button>
                  )}
                  {step < 2 ? (
                    <button
                      type="button"
                      onClick={() => setStep((s) => s + 1)}
                      disabled={!canNext}
                      className="flex-1 bg-red-primary text-white text-[15px] font-medium py-[11px] rounded-[8px] hover:scale-[1.02] hover:shadow-lg transition-all disabled:opacity-40 disabled:hover:scale-100 cursor-pointer disabled:cursor-default"
                    >
                      Continua
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={!canNext}
                      className="flex-1 bg-red-primary text-white text-[15px] font-medium py-[11px] rounded-[8px] hover:scale-[1.02] hover:shadow-lg transition-all disabled:opacity-40 disabled:hover:scale-100 cursor-pointer disabled:cursor-default"
                    >
                      Conferma appuntamento
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
