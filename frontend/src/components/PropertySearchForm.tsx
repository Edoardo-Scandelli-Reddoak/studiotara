'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Non-linear price steps to handle both affitti (€300/mese) and vendite (€1.4M)
const PRICE_STEPS = [
  0, 500, 1000, 2000, 3000, 5000, 10000, 25000,
  50000, 100000, 150000, 200000, 300000, 400000,
  500000, 700000, 1000000, 1500000, 2000000,
];
const MAX_IDX = PRICE_STEPS.length - 1;

function fmtPrice(val: number, isMin: boolean): string {
  if (isMin && val === 0) return 'Nessun minimo';
  if (!isMin && val >= PRICE_STEPS[MAX_IDX]) return 'Nessun limite';
  return new Intl.NumberFormat('it-IT', {
    style: 'currency', currency: 'EUR', maximumFractionDigits: 0,
  }).format(val);
}

function idxFromValue(val: number): number {
  const idx = PRICE_STEPS.findIndex((s) => s >= val);
  return idx === -1 ? MAX_IDX : idx;
}

const COMUNI = [
  'Assago', 'Buccinasco', 'Cesano Boscone', 'Corsico', 'Milano',
  'Motta Visconti', 'Rozzano', 'San Giuliano Milanese',
  'Settimo Milanese', 'Trezzano sul Naviglio', 'Valtorta', 'Zibido San Giacomo',
];

interface Props {
  mode: 'residenziale' | 'commerciale';
  initial: { contratto?: string; comune?: string; prezzo_min?: string; prezzo_max?: string };
}

export default function PropertySearchForm({ mode, initial }: Props) {
  const router = useRouter();
  const basePath = mode === 'residenziale' ? '/cerco-residenziale' : '/cerco-commerciale';

  const [contratto, setContratto] = useState(initial.contratto ?? '');
  const [comune, setComune] = useState(initial.comune ?? '');
  const [minIdx, setMinIdx] = useState(idxFromValue(parseInt(initial.prezzo_min ?? '0', 10)));
  const [maxIdx, setMaxIdx] = useState(idxFromValue(parseInt(initial.prezzo_max ?? String(PRICE_STEPS[MAX_IDX]), 10)));

  const minPrice = PRICE_STEPS[minIdx];
  const maxPrice = PRICE_STEPS[maxIdx];
  const minPct = (minIdx / MAX_IDX) * 100;
  const maxPct = (maxIdx / MAX_IDX) * 100;

  const hasFilters = contratto || comune || minIdx > 0 || maxIdx < MAX_IDX;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (contratto) params.set('contratto', contratto);
    if (comune) params.set('comune', comune);
    if (minIdx > 0) params.set('prezzo_min', String(minPrice));
    if (maxIdx < MAX_IDX) params.set('prezzo_max', String(maxPrice));
    const qs = params.toString();
    router.push(`${basePath}${qs ? `?${qs}` : ''}#immobili`);
  }

  function handleReset() {
    setContratto('');
    setComune('');
    setMinIdx(0);
    setMaxIdx(MAX_IDX);
    router.push(`${basePath}#immobili`);
  }

  const inputClass =
    'h-[42px] md:h-[47px] border-[2.5px] md:border-[3px] border-blue-primary rounded-[6px] px-3 text-[14px] outline-none bg-white focus:border-blue-secondary focus:shadow-[0_0_0_3px_rgba(17,85,218,0.15)] transition-all';

  return (
    <>
      {/* Slider-specific styles */}
      <style>{`
        .price-slider {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          position: absolute;
          left: 0; right: 0; top: 0; bottom: 0;
          width: 100%;
          margin: 0;
          pointer-events: none;
        }
        .price-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          pointer-events: all;
          width: 22px; height: 22px;
          border-radius: 50%;
          background: transparent;
          cursor: pointer;
        }
        .price-slider::-moz-range-thumb {
          pointer-events: all;
          width: 22px; height: 22px;
          border-radius: 50%;
          background: transparent;
          border: none;
          cursor: pointer;
        }
        .price-slider::-webkit-slider-track { background: transparent; }
        .price-slider::-moz-range-track { background: transparent; }
      `}</style>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-5 mt-5 md:mt-6 max-w-[604px] mx-auto">

        {/* Row 1: Contratto + Zona */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-5">
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-[13px] text-black/60 font-medium ml-1">Tipologia</label>
            <div className="relative">
              <select
                value={contratto}
                onChange={(e) => setContratto(e.target.value)}
                className={`w-full ${inputClass} appearance-none cursor-pointer`}
              >
                <option value="">Vendita e affitto</option>
                <option value="vendita">In vendita</option>
                <option value="affitto">In affitto</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1152d2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-[13px] text-black/60 font-medium ml-1">Comune</label>
            <div className="relative">
              <select
                value={comune}
                onChange={(e) => setComune(e.target.value)}
                className={`w-full ${inputClass} appearance-none cursor-pointer`}
              >
                <option value="">Tutti i comuni</option>
                {COMUNI.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1152d2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Dual price slider */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-[13px] text-black/60 font-medium ml-1">Prezzo</label>
            <span className="text-[13px] text-black/80 font-medium">
              {minIdx === 0 && maxIdx === MAX_IDX
                ? 'Qualsiasi prezzo'
                : `${fmtPrice(minPrice, true)} – ${fmtPrice(maxPrice, false)}`}
            </span>
          </div>

          {/* Slider track + inputs */}
          <div className="relative h-[22px] flex items-center px-[11px]">
            {/* Track background */}
            <div className="absolute left-[11px] right-[11px] h-[4px] rounded-full bg-black/10" />
            {/* Active range */}
            <div
              className="absolute h-[4px] rounded-full bg-blue-primary"
              style={{ left: `calc(${minPct}% * (100% - 22px) / 100% + 11px)`, right: `calc(${(100 - maxPct)}% * (100% - 22px) / 100% + 11px)` }}
            />
            {/* Custom thumb – min */}
            <div
              className="absolute w-[22px] h-[22px] rounded-full bg-white border-[3px] border-blue-primary shadow-md pointer-events-none z-10"
              style={{ left: `calc(${minPct}% * (100% - 22px) / 100%)` }}
            />
            {/* Custom thumb – max */}
            <div
              className="absolute w-[22px] h-[22px] rounded-full bg-white border-[3px] border-blue-primary shadow-md pointer-events-none z-10"
              style={{ left: `calc(${maxPct}% * (100% - 22px) / 100%)` }}
            />
            {/* Min range input (invisible, interactive) */}
            <input
              type="range"
              min={0}
              max={MAX_IDX}
              step={1}
              value={minIdx}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                setMinIdx(Math.min(v, maxIdx - 1));
              }}
              className="price-slider"
              style={{ zIndex: minIdx >= maxIdx - 1 ? 5 : 3 }}
            />
            {/* Max range input (invisible, interactive) */}
            <input
              type="range"
              min={0}
              max={MAX_IDX}
              step={1}
              value={maxIdx}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                setMaxIdx(Math.max(v, minIdx + 1));
              }}
              className="price-slider"
              style={{ zIndex: 4 }}
            />
          </div>

          {/* Step labels */}
          <div className="flex justify-between text-[11px] text-black/35 px-[11px]">
            <span>€0</span>
            <span>€50k</span>
            <span>€200k</span>
            <span>€700k</span>
            <span>€2M</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-red-primary text-white text-[16px] md:text-[17px] font-medium py-[11px] rounded-[6px] hover:scale-[1.02] hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            Cerca ora
          </button>
          {hasFilters && (
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-[11px] rounded-[6px] border-[2px] border-blue-primary text-blue-primary text-[14px] font-medium hover:bg-blue-primary/10 transition-all cursor-pointer"
            >
              Azzera
            </button>
          )}
        </div>
      </form>
    </>
  );
}
