import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Pagination from "@/components/Pagination";
import PropertySearchForm from "@/components/PropertySearchForm";
import { getProperties, isResidenziale, formatPrezzo, formatTitolo } from "@/lib/api";

const PROPERTIES_PER_PAGE = 15;

export default async function CercoResidenziale({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; contratto?: string; comune?: string; prezzo_min?: string; prezzo_max?: string }>;
}) {
  const { page: pageParam, contratto, comune, prezzo_min, prezzo_max } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam ?? '1', 10));

  const allProperties = await getProperties();
  const allResidenziali = allProperties.filter((p) => {
    if (!isResidenziale(p.tipologia)) return false;
    if (contratto && p.contratto !== contratto) return false;
    if (comune && p.comune.toLowerCase() !== comune.toLowerCase()) return false;
    if (prezzo_min) {
      const min = parseFloat(prezzo_min);
      if (!isNaN(min) && min > 0 && (!p.prezzo || parseFloat(p.prezzo) < min)) return false;
    }
    if (prezzo_max) {
      const max = parseFloat(prezzo_max);
      if (!isNaN(max) && p.prezzo && parseFloat(p.prezzo) > max) return false;
    }
    return true;
  });

  const totalPages = Math.ceil(allResidenziali.length / PROPERTIES_PER_PAGE);
  const safePage = Math.min(currentPage, totalPages || 1);
  const start = (safePage - 1) * PROPERTIES_PER_PAGE;
  const residenziali = allResidenziali.slice(start, start + PROPERTIES_PER_PAGE);

  return (
    <>
      <Navbar />

      <main className="flex flex-col items-center overflow-x-hidden max-w-[1440px] mx-auto w-full px-5 md:px-10 lg:px-[50px]">
        {/* ===== HERO SECTION ===== */}
        <div className="relative w-full mt-3">
          {/* Character - right side */}
          <div className="hidden md:block absolute right-[20px] lg:right-[60px] top-[0px] w-[240px] lg:w-[380px] h-[400px] lg:h-[580px] z-10">
            <Image
              src="/images/personaggino_resdenziale.png"
              alt="Studio Tara residenziale"
              fill
              className="object-contain object-bottom"
            />
          </div>

          <section className="relative w-full rounded-[20px] md:rounded-[24px] lg:rounded-[28px] bg-gradient-to-b from-blue-primary to-blue-secondary overflow-hidden min-h-[320px] md:min-h-[380px] lg:min-h-[430px]">
            {/* Text - left side */}
            <div className="relative px-6 py-8 md:absolute md:left-[50px] lg:left-[78px] md:top-1/2 md:-translate-y-1/2 md:w-[420px] lg:w-[604px]">
              <h1 className="text-[28px] md:text-[32px] lg:text-[36px] tracking-[-1.5px] md:tracking-[-2px] text-white leading-tight">
                <strong>Case</strong> in vendita e affitto
                <br />
                nell&apos;hinterland di Milano
              </h1>
              <p className="text-[15px] md:text-[16px] lg:text-[17px] text-white/90 mt-4 lg:mt-5 leading-relaxed max-w-[524px]">
                Appartamenti, ville e attici in vendita e affitto a
                Buccinasco, Corsico, Assago e in tutto l&apos;hinterland
                sud-ovest di Milano.
              </p>
              <Link
                href="#immobili"
                className="inline-block mt-6 bg-red-primary text-white text-[16px] md:text-[17px] font-medium px-8 md:px-10 py-[10px] md:py-[11px] rounded-[6px] hover:scale-105 hover:shadow-lg transition-all duration-300"
              >
                Scopri i nostri immobili
              </Link>
            </div>
          </section>
        </div>

        {/* ===== SEARCH FORM ===== */}
        <section className="relative w-full max-w-[860px] mt-[24px] z-10 bg-white border-[6px] md:border-[8px] lg:border-[10px] border-blue-accent rounded-[12px] md:rounded-[14px] lg:rounded-[16px] shadow-[0px_0px_10.8px_0px_rgba(0,0,0,0.25)] px-5 md:px-12 lg:px-16 py-6 md:py-8 mx-auto">
          <h2 className="text-[22px] md:text-[26px] lg:text-[30px] tracking-[-1px] md:tracking-[-1.5px] text-black text-center">
            Cerca subito l&apos;immobile che fa <strong>per te!</strong>
          </h2>
          <PropertySearchForm
            mode="residenziale"
            initial={{ contratto, comune, prezzo_min, prezzo_max }}
          />
        </section>

        {/* ===== PROPERTY GRID ===== */}
        <section id="immobili" className="w-full mt-[40px] md:mt-[50px] lg:mt-[60px]">
          {residenziali.length === 0 ? (
            <p className="text-center text-black/50 py-16">Nessun immobile disponibile al momento.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-[44px]">
              {residenziali.map((property) => (
                <Link
                  key={property.id}
                  href={`/cerco-residenziale/${property.id}`}
                  className="group relative bg-[#f5f3f0] rounded-[16px] md:rounded-[18px] lg:rounded-[20px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.25)] overflow-hidden p-[14px] md:p-[16px] lg:p-[18px] flex flex-col gap-[13px] hover:-translate-y-1 hover:shadow-[0px_8px_30px_0px_rgba(0,0,0,0.2)] transition-all duration-300"
                >
                  {/* Badge */}
                  <div
                    className={`absolute top-[22px] md:top-[24px] lg:top-[26px] left-[22px] md:left-[24px] lg:left-[26px] z-10 px-[10px] py-[5px] rounded-[4px] text-[13px] md:text-[14px] text-white tracking-[-0.5px] ${
                      property.contratto === "vendita"
                        ? "bg-[#1152d2]"
                        : "bg-red-primary"
                    }`}
                  >
                    {property.contratto === "vendita" ? "In vendita" : "In affitto"}
                  </div>

                  {/* Image */}
                  <div className="w-full aspect-[4/3] rounded-[8px] overflow-hidden bg-[#e8e4df]">
                    {property.immagine_principale ? (
                      <Image
                        src={property.immagine_principale}
                        alt={property.titolo}
                        width={405}
                        height={304}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                          <circle cx="9" cy="9" r="2" />
                          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Title & location */}
                  <div className="flex flex-col gap-[6px]">
                    <h3 className="text-[18px] md:text-[20px] lg:text-[22px] font-medium text-black tracking-[-0.8px] lg:tracking-[-1.32px] leading-tight">
                      {formatTitolo(property.titolo)}
                    </h3>
                    <p className="text-[14px] md:text-[15px] lg:text-[16px] text-black/70 tracking-[-0.5px] lg:tracking-[-0.96px]">
                      {property.comune}{property.provincia ? `, ${property.provincia}` : ''}
                    </p>
                  </div>

                  {/* Sqm + Price row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[14px] md:text-[15px] text-black/70">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 3 21 3 21 9" />
                        <polyline points="9 21 3 21 3 15" />
                        <line x1="21" y1="3" x2="14" y2="10" />
                        <line x1="3" y1="21" x2="10" y2="14" />
                      </svg>
                      {property.mq ? `${property.mq} m²` : '—'}
                    </div>
                    <p className="text-[18px] md:text-[20px] lg:text-[22px] font-medium text-black tracking-[-0.8px] lg:tracking-[-1.32px]">
                      {formatPrezzo(property.prezzo)}
                    </p>
                  </div>

                  {/* Bottom row: features with icons */}
                  <div className="flex flex-wrap gap-4 sm:gap-5 pt-3 border-t border-black/10">
                    {/* Locali */}
                    <div className="flex flex-col items-center gap-[2px]">
                      <div className="flex items-center gap-1.5">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a4a4a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                          <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                        <span className="text-[15px] font-medium text-black">{property.locali ?? '—'}</span>
                      </div>
                      <span className="text-[10px] text-black/50 uppercase tracking-wide">Locali</span>
                    </div>
                    {/* Bagni */}
                    <div className="flex flex-col items-center gap-[2px]">
                      <div className="flex items-center gap-1.5">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a4a4a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3a1 1 0 0 1 1-1z" />
                          <path d="M6 12V5a2 2 0 0 1 2-2h3v2.25" />
                        </svg>
                        <span className="text-[15px] font-medium text-black">{property.bagni ?? '—'}</span>
                      </div>
                      <span className="text-[10px] text-black/50 uppercase tracking-wide">Bagni</span>
                    </div>
                    {/* Piano */}
                    <div className="flex flex-col items-center gap-[2px]">
                      <div className="flex items-center gap-1.5">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a4a4a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <line x1="3" y1="9" x2="21" y2="9" />
                          <line x1="3" y1="15" x2="21" y2="15" />
                        </svg>
                        <span className="text-[15px] font-medium text-black">{property.piano ? (property.piano.replace(/[^\d]/g, '') || property.piano) : '—'}</span>
                      </div>
                      <span className="text-[10px] text-black/50 uppercase tracking-wide">Piano</span>
                    </div>
                    {/* Camere */}
                    <div className="flex flex-col items-center gap-[2px]">
                      <div className="flex items-center gap-1.5">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a4a4a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 4v16" />
                          <path d="M2 8h18a2 2 0 0 1 2 2v10" />
                          <path d="M2 17h20" />
                          <path d="M6 8v9" />
                        </svg>
                        <span className="text-[15px] font-medium text-black">{property.camere ?? '—'}</span>
                      </div>
                      <span className="text-[10px] text-black/50 uppercase tracking-wide">Camere</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            baseHref="/cerco-residenziale"
            anchor="immobili"
          />
        </section>

        {/* ===== CTA VENDI ===== */}
        <section className="w-full rounded-[20px] md:rounded-[24px] lg:rounded-[28px] bg-gradient-to-b from-blue-primary to-blue-secondary overflow-hidden mt-[80px] md:mt-[120px] lg:mt-[160px] mb-[40px] md:mb-[50px] lg:mb-[60px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.15)] text-white text-center py-12 md:py-16 px-6">
          <h2 className="text-[26px] md:text-[30px] lg:text-[32px] tracking-[-1.5px] md:tracking-[-2px]">
            Hai un immobile <strong>da vendere?</strong>
          </h2>
          <p className="text-[15px] md:text-[16px] mt-4 max-w-[520px] mx-auto leading-relaxed text-white/85">
            Affidati a Studio Tara: oltre 30 anni di esperienza, valutazione
            gratuita e un piano di vendita su misura per ottenere il massimo dal tuo immobile.
          </p>
          <Link
            href="/vendi-immobile"
            className="inline-block mt-8 bg-red-primary text-white text-[15px] md:text-[16px] font-medium px-8 md:px-10 py-[11px] rounded-[6px] hover:scale-105 hover:shadow-lg transition-all duration-300"
          >
            Scopri come vendere
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}
