"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import type { ApiPropertyDetail } from "@/lib/api";
import { formatPrezzo } from "@/lib/api";

function buildBrochureRows(property: ApiPropertyDetail, ref: string, prezzoFormatted: string): string {
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const rows: { label: string; value: string | number }[] = [
    { label: 'Riferimento',     value: ref },
    { label: 'Tipologia',       value: cap(property.tipologia) },
    { label: 'Contratto',       value: property.contratto === 'vendita' ? 'Vendita' : 'Affitto' },
    { label: 'Prezzo',          value: prezzoFormatted },
    ...(property.mq             ? [{ label: 'Superficie',       value: `${property.mq} m²` }]       : []),
    ...(property.locali         ? [{ label: 'Locali',           value: property.locali }]            : []),
    ...(property.camere         ? [{ label: 'Camere da letto',  value: property.camere }]            : []),
    ...(property.bagni          ? [{ label: 'Bagni',            value: property.bagni }]             : []),
    ...(property.piano          ? [{ label: 'Piano',            value: property.piano }]             : []),
    { label: 'Ascensore',       value: property.ascensore ? 'Sì' : 'No' },
    { label: 'Garage',          value: property.garage    ? 'Sì' : 'No' },
    ...(property.riscaldamento  ? [{ label: 'Riscaldamento',    value: property.riscaldamento }]     : []),
    { label: 'Classe energetica', value: property.classe_energetica || 'In fase di definizione' },
    ...(property.indirizzo      ? [{ label: 'Indirizzo',        value: property.indirizzo }]         : []),
    ...(property.comune         ? [{ label: 'Comune',           value: property.comune }]            : []),
    ...(property.provincia      ? [{ label: 'Provincia',        value: property.provincia }]         : []),
    ...(property.zona           ? [{ label: 'Zona',             value: property.zona }]              : []),
  ];
  return rows.map((r, i) =>
    `<tr style="background:${i % 2 === 0 ? '#ffffff' : '#f5f3f0'}">
      <td style="padding:6px 10px;font-size:12px;border-bottom:1px solid #eee;color:#888;width:42%">${r.label}</td>
      <td style="padding:6px 10px;font-size:12px;border-bottom:1px solid #eee;font-weight:500;text-align:right">${r.value}</td>
    </tr>`
  ).join('');
}

export default function PropertyGallery({ property }: { property: ApiPropertyDetail }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [planimetriaOpen, setPlanimetriaOpen] = useState(false);
  const [planimetriaIndex, setPlanimetriaIndex] = useState(0);
  const [generating, setGenerating] = useState(false);

  const hasVideo = !!property.video_url;

  const planimetrieUrls = property.images
    .filter(img => img.is_planimetria && img.file_url)
    .map(img => img.file_url as string);
  const hasPlanimetria = planimetrieUrls.length > 0;

  const galleryImages = property.images
    .filter(img => !img.is_planimetria && img.file_url)
    .map(img => img.file_url as string);

  const images = galleryImages.length > 0
    ? galleryImages
    : property.images.filter(img => img.file_url).map(img => img.file_url as string);

  const prev = () => setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  const ref = property.codice_agenzia || property.gestionale_id;
  const prezzoFormatted = formatPrezzo(property.prezzo);

  const downloadBrochure = useCallback(async () => {
    setGenerating(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const tableRows = buildBrochureRows(property, ref, prezzoFormatted);

      const mainImage = images.length > 0 ? images[0] : '';

      const html = `
<div id="brochure-content" style="font-family:'Helvetica Neue',Arial,sans-serif;color:#1a1a1a;line-height:1.6;padding:0">

  <div style="background:linear-gradient(135deg,#092d74,#1155da);color:white;padding:28px 28px 28px 28px;border-radius:10px;margin-bottom:16px">
    <span style="display:inline-block;background:${property.contratto === 'vendita' ? '#1152d2' : '#d2072a'};color:white;padding:3px 10px;border-radius:4px;font-size:12px;margin-bottom:10px">
      ${property.contratto === 'vendita' ? 'In vendita' : 'In affitto'}
    </span>
    <div style="font-size:22px;letter-spacing:-0.5px;font-weight:600;margin:0 0 4px 0">${property.titolo}</div>
    <div style="font-size:13px;opacity:0.8">${property.indirizzo || [property.comune, property.provincia].filter(Boolean).join(', ')}</div>
    <div style="font-size:26px;font-weight:700;margin:12px 0 0 0">${prezzoFormatted}</div>
  </div>

  <div style="display:flex;gap:0;margin-bottom:24px;border-radius:10px;overflow:hidden;border:1px solid #e0ddd8">
    ${mainImage ? `<img src="${mainImage}" crossorigin="anonymous" style="width:50%;min-height:170px;max-height:190px;object-fit:cover;display:block" />` : ''}
    <div style="width:${mainImage ? '50%' : '100%'};background:#f5f3f0;display:flex;flex-wrap:wrap;align-content:center;padding:20px 16px">
      <div style="width:33.33%;text-align:center;padding:10px 0"><div style="font-size:24px;font-weight:700;color:#092d74;line-height:1">${property.mq ?? '—'}</div><div style="font-size:10px;text-transform:uppercase;color:#555;letter-spacing:0.8px;margin-top:5px;font-weight:600">m²</div></div>
      <div style="width:33.33%;text-align:center;padding:10px 0"><div style="font-size:24px;font-weight:700;color:#092d74;line-height:1">${property.locali ?? '—'}</div><div style="font-size:10px;text-transform:uppercase;color:#555;letter-spacing:0.8px;margin-top:5px;font-weight:600">Locali</div></div>
      <div style="width:33.33%;text-align:center;padding:10px 0"><div style="font-size:24px;font-weight:700;color:#092d74;line-height:1">${property.camere ?? '—'}</div><div style="font-size:10px;text-transform:uppercase;color:#555;letter-spacing:0.8px;margin-top:5px;font-weight:600">Camere</div></div>
      <div style="width:33.33%;text-align:center;padding:10px 0"><div style="font-size:24px;font-weight:700;color:#092d74;line-height:1">${property.bagni ?? '—'}</div><div style="font-size:10px;text-transform:uppercase;color:#555;letter-spacing:0.8px;margin-top:5px;font-weight:600">Bagni</div></div>
      <div style="width:33.33%;text-align:center;padding:10px 0"><div style="font-size:24px;font-weight:700;color:#092d74;line-height:1">${property.piano || '—'}</div><div style="font-size:10px;text-transform:uppercase;color:#555;letter-spacing:0.8px;margin-top:5px;font-weight:600">Piano</div></div>
      <div style="width:33.33%;text-align:center;padding:10px 0"><div style="font-size:24px;font-weight:700;color:#092d74;line-height:1">${property.classe_energetica || 'N/D'}</div><div style="font-size:10px;text-transform:uppercase;color:#555;letter-spacing:0.8px;margin-top:5px;font-weight:600">Classe energ.</div></div>
    </div>
  </div>

  ${property.descrizione ? `
  <div style="font-size:18px;letter-spacing:-0.3px;margin:22px 0 8px;color:#092d74;font-weight:600">Descrizione</div>
  <div>${property.descrizione.split('\n\n').map((p: string) => `<p style="font-size:13px;color:#444;margin:0 0 8px 0">${p}</p>`).join('')}</div>
  ` : ''}

  <div style="font-size:18px;letter-spacing:-0.3px;margin:22px 0 8px;color:#092d74;font-weight:600">Tutti i dettagli</div>
  <table style="width:100%;border-collapse:collapse">
    ${tableRows}
  </table>

  <div style="margin-top:28px;padding-top:14px;border-top:2px solid #092d74;text-align:center;color:#888;font-size:11px">
    <strong style="color:#092d74">STUDIO TARA</strong> — Agenzia Immobiliare<br>
    Viale Lomellina, 23 — 20090 Buccinasco (MI)<br>
    Tel: 339 3333333 — info@studiotara.it — www.studiotara.it
  </div>
</div>`;

      const container = document.createElement("div");
      container.innerHTML = html;
      document.body.appendChild(container);

      const element = container.querySelector("#brochure-content") as HTMLElement;

      await html2pdf()
        .set({
          margin: [10, 12, 10, 12],
          filename: `immobile-${property.gestionale_id}-brochure.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(element)
        .save();

      document.body.removeChild(container);
    } catch {
      const fallbackHtml = `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8"><title>${property.titolo}</title>
<style>@page{margin:40px}*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Helvetica Neue',Arial,sans-serif;color:#1a1a1a;line-height:1.6}.header{background:linear-gradient(135deg,#092d74,#1155da);color:white;padding:40px;border-radius:12px;margin-bottom:30px}.header h1{font-size:28px}.header p{font-size:16px;opacity:.85;margin-top:6px}.header .price{font-size:32px;font-weight:700;margin-top:16px}h2{font-size:22px;margin:28px 0 12px;color:#092d74}.description p{font-size:15px;color:#444;margin-bottom:12px}.footer{margin-top:40px;padding-top:20px;border-top:2px solid #092d74;text-align:center;color:#888;font-size:13px}.footer strong{color:#092d74}@media print{body{print-color-adjust:exact;-webkit-print-color-adjust:exact}}</style></head><body>
<div class="header"><h1>${property.titolo}</h1><p>${property.indirizzo || property.comune}</p><div class="price">${prezzoFormatted}</div></div>
<h2>Descrizione</h2><div class="description">${property.descrizione.split('\n\n').map((p: string) => `<p>${p}</p>`).join('')}</div>
<div class="footer"><strong>STUDIO TARA</strong> — Agenzia Immobiliare<br>Viale Lomellina, 23 — 20090 Buccinasco (MI)<br>Tel: 339 3333333 — info@studiotara.it</div>
<script>window.onload=function(){window.print()}</script></body></html>`;
      const blob = new Blob([fallbackHtml], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } finally {
      setGenerating(false);
    }
  }, [property, prezzoFormatted, ref]);

  return (
    <>
      {/* Gallery */}
      {images.length > 0 ? (
        <div className="relative w-full aspect-[4/3] rounded-[16px] md:rounded-[20px] overflow-hidden mt-5 group">
          <Image
            src={images[currentIndex]}
            alt={`${property.titolo} - Foto ${currentIndex + 1}`}
            fill
            className="object-cover cursor-pointer"
            onClick={() => setLightboxOpen(true)}
            priority={currentIndex === 0}
          />

          <div className="absolute top-4 right-4 bg-black/50 text-white text-[13px] px-3 py-1 rounded-full">
            {currentIndex + 1} / {images.length}
          </div>

          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-[36px] h-[36px] md:w-[40px] md:h-[40px] bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <svg width="16" height="16" className="md:w-[18px] md:h-[18px]" viewBox="0 0 24 24" fill="none" stroke="#092d74" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-[36px] h-[36px] md:w-[40px] md:h-[40px] bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <svg width="16" height="16" className="md:w-[18px] md:h-[18px]" viewBox="0 0 24 24" fill="none" stroke="#092d74" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </>
          )}

          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-[8px] h-[8px] rounded-full transition-all cursor-pointer ${
                    i === currentIndex ? "bg-white scale-125" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="w-full aspect-[4/3] rounded-[16px] md:rounded-[20px] overflow-hidden mt-5 bg-[#f5f3f0] flex items-center justify-center">
          <span className="text-black/30 text-[15px]">Nessuna immagine disponibile</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mt-3">
        {/* Foto */}
        <button className="px-4 py-2 rounded-[6px] text-[14px] font-medium bg-blue-primary text-white flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
          Foto ({images.length})
        </button>

        {/* Video */}
        <button
          onClick={() => hasVideo && setVideoOpen(true)}
          disabled={!hasVideo}
          title={!hasVideo ? "Video non disponibile" : "Guarda il video"}
          className={`px-4 py-2 rounded-[6px] text-[14px] font-medium flex items-center gap-1.5 transition-all ${
            hasVideo
              ? "bg-[#f5f3f0] text-black/70 hover:bg-[#eae8e5] cursor-pointer"
              : "bg-[#f5f3f0] text-black/30 cursor-not-allowed"
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          Video
        </button>

        {/* Planimetria */}
        <button
          onClick={() => hasPlanimetria && (setPlanimetriaIndex(0), setPlanimetriaOpen(true))}
          disabled={!hasPlanimetria}
          title={!hasPlanimetria ? "Planimetria non disponibile" : "Visualizza planimetria"}
          className={`px-4 py-2 rounded-[6px] text-[14px] font-medium flex items-center gap-1.5 transition-all ${
            hasPlanimetria
              ? "bg-[#f5f3f0] text-black/70 hover:bg-[#eae8e5] cursor-pointer"
              : "bg-[#f5f3f0] text-black/30 cursor-not-allowed"
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="12" y1="3" x2="12" y2="21" />
          </svg>
          Planimetria
        </button>

        {/* Brochure */}
        <button
          onClick={downloadBrochure}
          disabled={generating}
          className={`px-4 py-2 rounded-[6px] text-[14px] font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
            generating
              ? "bg-blue-primary text-white"
              : "bg-[#f5f3f0] text-black/70 hover:bg-[#eae8e5]"
          }`}
        >
          {generating ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          )}
          {generating ? "Generando..." : "Brochure"}
        </button>
      </div>

      {/* Video modal */}
      {videoOpen && hasVideo && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setVideoOpen(false)}
        >
          <button
            onClick={() => setVideoOpen(false)}
            className="absolute top-6 right-6 w-[40px] h-[40px] bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center cursor-pointer z-10"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <div
            className="relative w-full max-w-[900px] aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={property.video_url!}
              className="w-full h-full rounded-[12px]"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Planimetria modal */}
      {planimetriaOpen && hasPlanimetria && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setPlanimetriaOpen(false)}
        >
          <button
            onClick={() => setPlanimetriaOpen(false)}
            className="absolute top-6 right-6 w-[40px] h-[40px] bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center cursor-pointer z-10"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {planimetrieUrls.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setPlanimetriaIndex((i) => (i === 0 ? planimetrieUrls.length - 1 : i - 1)); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-[40px] h-[40px] bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center cursor-pointer z-10"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setPlanimetriaIndex((i) => (i === planimetrieUrls.length - 1 ? 0 : i + 1)); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-[40px] h-[40px] bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center cursor-pointer z-10"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
              </button>
            </>
          )}

          <div className="relative flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {planimetrieUrls.length > 1 && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-[13px] px-3 py-1 rounded-full z-10">
                {planimetriaIndex + 1} / {planimetrieUrls.length}
              </div>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={planimetrieUrls[planimetriaIndex]}
              alt={`Planimetria ${planimetriaIndex + 1}`}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-[12px]"
            />
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && images.length > 0 && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 w-[40px] h-[40px] bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center cursor-pointer z-10"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div
            className="relative max-w-[90vw] max-h-[85vh] w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[currentIndex]}
              alt={`${property.titolo} - Foto ${currentIndex + 1}`}
              fill
              className="object-contain"
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-[48px] h-[48px] bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center cursor-pointer"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-[48px] h-[48px] bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center cursor-pointer"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-[14px] px-4 py-1.5 rounded-full">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
