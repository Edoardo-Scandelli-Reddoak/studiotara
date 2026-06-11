import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyGallery from "@/components/PropertyGallery";
import ScrollToTop from "@/components/ScrollToTop";
import ContactModal from "@/components/ContactModal";
import AppointmentModal from "@/components/AppointmentModal";
import SellModal from "@/components/SellModal";
import SearchRequestModal from "@/components/SearchRequestModal";
import ViewCounter from "@/components/ViewCounter";
import { getProperty, formatPrezzo, formatTitolo } from "@/lib/api";
import type { ApiPropertyDetail } from "@/lib/api";

function getMapSrc(property: ApiPropertyDetail): string {
  if (property.latitudine && property.longitudine) {
    return `https://maps.google.com/maps?q=${property.latitudine},${property.longitudine}&z=15&output=embed`;
  }
  const parts = [property.indirizzo, property.comune, property.provincia, "Italia"].filter(Boolean);
  if (parts.length) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(parts.join(", "))}&z=15&output=embed`;
  }
  return `https://maps.google.com/maps?q=Milano,+Italia&z=12&output=embed`;
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const id = parseInt(slug, 10);
  if (isNaN(id)) notFound();

  const property = await getProperty(id);
  if (!property) notFound();

  const ref = property.codice_agenzia || property.gestionale_id;
  const prezzoFormatted = formatPrezzo(property.prezzo);

  return (
    <>
      <ScrollToTop />
      <Navbar />

      <main className="flex flex-col items-center overflow-x-clip max-w-[1440px] mx-auto w-full px-4 md:px-10 lg:px-[50px]">
        {/* ===== CTA BANNER ===== */}
        <div className="relative w-full mt-3 bg-gradient-to-b from-blue-primary to-blue-secondary rounded-[10px] md:rounded-[12px] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.15)] md:shadow-[0px_0px_10px_0px_rgba(0,0,0,0.25)] px-5 md:px-10 lg:pl-[160px] py-4 md:py-7 flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4 overflow-visible">
          {/* Character */}
          <div className="hidden lg:block absolute left-[15px] bottom-0 w-[120px] h-[120px]">
            <Image
              src="/images/personaggino-singolo-immobile.png"
              alt=""
              width={120}
              height={120}
              className="object-contain object-bottom"
              aria-hidden="true"
            />
          </div>
          <p className="text-[16px] md:text-[22px] lg:text-[26px] text-white tracking-[-0.6px] md:tracking-[-1.5px] text-center sm:text-left leading-tight">
            Vuoi <strong>vendere</strong> il tuo immobile? Comincia subito!
          </p>
          <SellModal
            triggerText="Vendi adesso!"
            triggerClassName="w-full sm:w-auto shrink-0 bg-red-primary text-white text-[15px] md:text-[16px] font-medium px-6 md:px-10 py-3 md:py-[11px] rounded-[8px] md:rounded-[6px] md:hover:scale-105 md:hover:shadow-lg md:transition-all md:duration-300 cursor-pointer active:scale-[0.99]"
            submitUrl="/api/lead/vendita-commerciale"
          />
        </div>

        {/* ===== TWO COLUMN LAYOUT ===== */}
        <div className="w-full mt-6 md:mt-10 flex flex-col lg:flex-row gap-7 md:gap-8 lg:gap-10">
          {/* Left column */}
          <div className="flex-1 min-w-0">
            <Link
              href="/cerco-commerciale"
              className="inline-flex items-center gap-2 text-[14px] md:text-[15px] text-blue-primary md:hover:text-blue-secondary md:transition-colors py-1"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
              Torna agli immobili
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-stretch sm:justify-between gap-3 sm:gap-4 mt-3 md:mt-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 sm:hidden mb-2">
                  <div
                    className={`px-[10px] py-[5px] rounded-[4px] text-[12px] text-white tracking-[-0.3px] ${
                      property.contratto === "vendita" ? "bg-[#1152d2]" : "bg-red-primary"
                    }`}
                  >
                    {property.contratto === "vendita" ? "In vendita" : "In affitto"}
                  </div>
                  <ViewCounter propertyId={property.id} initialViews={property.visualizzazioni} />
                </div>
                <h1 className="text-[22px] md:text-[28px] lg:text-[30px] tracking-[-0.8px] md:tracking-[-1.5px] text-black leading-tight">
                  {formatTitolo(property.titolo)}
                </h1>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="inline-flex items-center shrink-0 bg-blue-primary text-white text-[12px] md:text-[13px] font-medium px-2.5 py-1 rounded-[6px] tracking-[-0.2px]">
                    Rif. {ref}
                  </span>
                  <p className="text-[14px] md:text-[16px] text-black/60">
                    {property.comune}{property.provincia ? `, ${property.provincia}` : ''}
                  </p>
                </div>
              </div>
              <div className="shrink-0 hidden sm:flex flex-col items-end justify-between">
                <div
                  className={`px-[10px] py-[5px] rounded-[4px] text-[14px] text-white tracking-[-0.5px] ${
                    property.contratto === "vendita" ? "bg-[#1152d2]" : "bg-red-primary"
                  }`}
                >
                  {property.contratto === "vendita" ? "In vendita" : "In affitto"}
                </div>
                <ViewCounter propertyId={property.id} initialViews={property.visualizzazioni} />
              </div>
            </div>

            {/* Gallery + Tabs */}
            <PropertyGallery property={property} />

            {property.descrizione && (
              <>
                <h2 className="text-[20px] md:text-[28px] lg:text-[30px] tracking-[-0.8px] md:tracking-[-1.5px] text-black mt-8 md:mt-12">
                  Descrizione
                </h2>
                <div className="text-[15px] md:text-[16px] text-black/80 leading-relaxed mt-3 md:mt-4 flex flex-col gap-3 md:gap-4">
                  {property.descrizione.split("\n\n").map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </>
            )}

            <ContactModal
              triggerText="Contattaci subito"
              triggerClassName="block w-full text-center md:inline-block md:w-auto mt-6 md:mt-8 bg-red-primary text-white text-[16px] md:text-[17px] font-medium px-6 md:px-10 py-3 md:py-[11px] rounded-[8px] md:rounded-[6px] md:hover:scale-105 md:hover:shadow-lg md:transition-all md:duration-300 cursor-pointer active:scale-[0.99]"
              propertyRef={ref}
              submitUrl="/api/lead/info-commerciale"
            />

            {/* Tutti i dettagli */}
            {(() => {
              const rows: { label: string; value: string | number }[] = [
                { label: 'Riferimento',       value: ref },
                { label: 'Tipologia',         value: property.tipologia.charAt(0).toUpperCase() + property.tipologia.slice(1) },
                { label: 'Contratto',         value: property.contratto === 'vendita' ? 'Vendita' : 'Affitto' },
                { label: 'Prezzo',            value: prezzoFormatted },
                ...(property.mq        ? [{ label: 'Superficie',        value: `${property.mq} m²` }]        : []),
                ...(property.locali    ? [{ label: 'Locali',            value: property.locali }]             : []),
                ...(property.bagni     ? [{ label: 'Bagni',             value: property.bagni }]              : []),
                ...(property.piano     ? [{ label: 'Piano',             value: property.piano }]              : []),
                { label: 'Ascensore',         value: property.ascensore ? 'Sì' : 'No' },
                { label: 'Garage',            value: property.garage    ? 'Sì' : 'No' },
                ...(property.riscaldamento     ? [{ label: 'Riscaldamento',      value: property.riscaldamento }]     : []),
                { label: 'Classe energetica', value: property.classe_energetica || 'In fase di definizione' },
                ...(property.indirizzo ? [{ label: 'Indirizzo',         value: property.indirizzo }]          : []),
                ...(property.comune    ? [{ label: 'Comune',            value: property.comune }]             : []),
                ...(property.provincia ? [{ label: 'Provincia',         value: property.provincia }]          : []),
                ...(property.zona      ? [{ label: 'Zona',              value: property.zona }]               : []),
              ];
              return (
                <>
                  <h2 className="text-[20px] md:text-[28px] lg:text-[30px] tracking-[-0.8px] md:tracking-[-1.5px] text-black mt-8 md:mt-12">
                    Tutti i dettagli
                  </h2>
                  <div className="mt-3 md:mt-4 rounded-[10px] md:rounded-[12px] overflow-hidden border border-black/10">
                    <table className="w-full text-[14px] md:text-[15px]">
                      <tbody>
                        {rows.map((row, i) => (
                          <tr key={row.label} className={`border-b border-black/8 last:border-b-0 ${i % 2 === 0 ? 'bg-white' : 'bg-[#f5f3f0]'}`}>
                            <td className="px-3 md:px-5 py-2.5 md:py-[11px] text-black/50 font-medium w-[40%] md:w-[42%]">{row.label}</td>
                            <td className="px-3 md:px-5 py-2.5 md:py-[11px] text-black break-words">{row.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              );
            })()}

            <h2 className="text-[20px] md:text-[28px] lg:text-[30px] tracking-[-0.8px] md:tracking-[-1.5px] text-black mt-8 md:mt-12">
              Posizione
            </h2>
            <div className="mt-3 md:mt-4 rounded-[10px] md:rounded-[14px] overflow-hidden border border-black/20 h-[220px] md:h-[300px] lg:h-[311px]">
              <iframe
                src={getMapSrc(property)}
                title="Posizione immobile"
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right column - sidebar */}
          <div className="lg:w-[405px] shrink-0">
            <div className="lg:sticky lg:top-[100px] flex flex-col gap-6">
              <div className="rounded-[12px] overflow-hidden shadow-[0px_0px_15px_0px_rgba(0,0,0,0.12)]">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-primary to-blue-secondary px-4 md:px-6 py-3.5 md:py-4 flex items-center justify-between">
                  <p className="text-[15px] md:text-[17px] text-white font-medium tracking-[-0.4px] md:tracking-[-0.5px]">In sintesi</p>
                  <p className="text-[12px] md:text-[13px] text-white">Rif. {ref}</p>
                </div>

                {/* Body */}
                <div className="bg-white px-4 md:px-6 py-5 md:py-6">
                  <div className="flex items-baseline gap-2 md:gap-3 flex-wrap">
                    <p className="text-[26px] md:text-[30px] lg:text-[32px] font-semibold text-blue-primary tracking-[-1px] md:tracking-[-1.5px]">
                      {prezzoFormatted}
                    </p>
                    <span className="text-[13px] md:text-[14px] text-blue-primary">
                      {property.contratto === 'vendita' ? 'In vendita' : 'In affitto'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 md:mt-5 pt-4 md:pt-5 border-t border-black/8">
                    <div className="flex flex-col items-center gap-1 bg-[#f5f3f0] rounded-[8px] py-3">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#092d74" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" /></svg>
                      <span className="text-[16px] font-semibold text-black">{property.mq ?? '—'}</span>
                      <span className="text-[10px] text-black/70 uppercase tracking-wider">m²</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 bg-[#f5f3f0] rounded-[8px] py-3">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#092d74" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                      <span className="text-[16px] font-semibold text-black">{property.locali ?? '—'}</span>
                      <span className="text-[10px] text-black/70 uppercase tracking-wider">Locali</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 bg-[#f5f3f0] rounded-[8px] py-3">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#092d74" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3a1 1 0 0 1 1-1z" /><path d="M6 12V5a2 2 0 0 1 2-2h3v2.25" /></svg>
                      <span className="text-[16px] font-semibold text-black">{property.bagni ?? '—'}</span>
                      <span className="text-[10px] text-black/70 uppercase tracking-wider">Bagni</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 bg-[#f5f3f0] rounded-[8px] py-3">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#092d74" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" /></svg>
                      <span className="text-[16px] font-semibold text-black">
                        {property.piano ? (property.piano.replace(/[^\d]/g, '') || property.piano) : '—'}
                      </span>
                      <span className="text-[10px] text-black/70 uppercase tracking-wider">Piano</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-black/8">
                    <span className="text-[12px] bg-green-600/10 text-green-700 font-medium px-2.5 py-1 rounded-[4px]">
                      Classe {property.classe_energetica || 'In definizione'}
                    </span>
                    {property.ascensore && (
                      <span className="text-[12px] bg-blue-primary/10 text-blue-primary font-medium px-2.5 py-1 rounded-[4px]">
                        Ascensore
                      </span>
                    )}
                    {property.garage && (
                      <span className="text-[12px] bg-blue-primary/10 text-blue-primary font-medium px-2.5 py-1 rounded-[4px]">
                        Garage
                        </span>
                      )}
                    </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 md:gap-4">
                <h3 className="text-[20px] md:text-[28px] lg:text-[30px] tracking-[-0.8px] md:tracking-[-1.5px] text-black">
                  Contattaci subito
                </h3>
                <AppointmentModal
                  triggerText="Fissa appuntamento"
                  triggerClassName="block w-full text-center bg-red-primary text-white text-[16px] md:text-[17px] font-semibold py-3.5 md:py-[13px] rounded-[8px] md:hover:scale-[1.02] md:hover:shadow-lg md:transition-all md:duration-300 cursor-pointer active:scale-[0.99]"
                  propertyRef={ref}
                  submitUrl="/api/lead/appuntamento-commerciale"
                />
                <ContactModal
                  triggerText="Richiedi informazioni"
                  triggerClassName="block w-full text-center border-2 border-blue-primary text-blue-primary text-[15px] md:text-[16px] font-medium py-3 md:py-[11px] rounded-[8px] md:hover:bg-blue-primary/5 md:transition-all md:duration-300 cursor-pointer active:bg-blue-primary/5"
                  propertyRef={ref}
                  submitUrl="/api/lead/info-commerciale"
                />
                <a
                  href="tel:+390236557365"
                  className="flex items-center justify-center gap-2 text-[14px] md:text-[15px] text-black/70 md:hover:text-black md:transition-colors mt-1 md:mt-2 py-2"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>Chiama: 02 3655 7365</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ===== CTA RICERCA ===== */}
        <SearchRequestModal submitUrl="/api/lead/ricerca-commerciale" />
      </main>

      <Footer />
    </>
  );
}
