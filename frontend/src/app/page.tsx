import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import VideoPlayer from "@/components/VideoPlayer";
import ValuationWidget from "@/components/ValuationWidget";
import NewsletterForm from "@/components/NewsletterForm";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="flex flex-col items-center overflow-x-hidden max-w-[1440px] mx-auto w-full px-4 md:px-10 lg:px-[50px]">
        {/* ===== HERO SECTION ===== */}
        <section className="relative w-full rounded-[16px] md:rounded-[24px] bg-white overflow-hidden mt-3 [transform:translateZ(0)] [-webkit-mask-image:-webkit-radial-gradient(white,black)]">
          {/* Navy gradient background (kept off the section itself so the rounded
              corner's anti-aliased edge blends into white, not navy) */}
          <div
            className="absolute inset-0 z-0 bg-gradient-to-b from-blue-primary to-blue-secondary"
            aria-hidden="true"
          />
          {/* Decorative "peel" badge in the top-left corner */}
          <div className="absolute top-0 left-0 z-20 w-[92%] sm:w-[62%] lg:w-[46%] max-w-[330px] md:max-w-[370px] pointer-events-none">
            {/* White shape, extended a few px past the top-left so it fully
                covers the section's rounded corner (no image sliver) */}
            <svg
              viewBox="0 0 370 210"
              preserveAspectRatio="none"
              className="absolute -top-[10px] -left-[10px] w-[calc(100%+20px)] h-[180px] md:h-[206px]"
              aria-hidden="true"
            >
              <path
                d="M0 0 H370 C330 84 278 140 168 178 C108 198 50 205 0 208 Z"
                fill="#ffffff"
              />
            </svg>
            <div className="relative pt-4 pl-4 md:pt-6 md:pl-6 max-w-[85%]">
              <p className="text-red-primary font-bold text-[19px] md:text-[25px] leading-tight">
                Siamo di Casa.
              </p>
              <p className="text-blue-primary text-[12.5px] md:text-[14px] leading-snug mt-1.5">
                Soluzioni immobiliari costruite intorno{" "}
                <br className="hidden lg:block" />
                alle persone, non agli immobili.
              </p>
            </div>
          </div>

          <div className="relative z-[2] flex flex-col lg:flex-row">
            {/* ===== LEFT COLUMN — agent image =====
                Fade the image edge to transparent (not to a solid colour) so the
                section's vertical gradient shows through underneath — the seam
                between photo and copy disappears at every height.
                Mobile: fade the bottom edge. Desktop: fade the right edge. */}
            <div className="relative w-full h-[240px] md:h-[340px] lg:h-auto lg:w-[46%] lg:min-h-[580px] lg:self-stretch">
              <Image
                src="/images/hero-home.png"
                alt="Consulente Studio Tara parla con una coppia davanti a una casa"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 46vw"
                className="object-cover object-[center_35%] [-webkit-mask-image:linear-gradient(to_bottom,#000_58%,transparent_100%)] [mask-image:linear-gradient(to_bottom,#000_58%,transparent_100%)] lg:[-webkit-mask-image:linear-gradient(to_right,#000_55%,transparent_98%)] lg:[mask-image:linear-gradient(to_right,#000_55%,transparent_98%)]"
              />
            </div>

            {/* ===== RIGHT COLUMN — copy ===== */}
            <div className="w-full lg:w-[54%] px-5 pt-8 pb-[64px] md:px-10 md:pt-12 md:pb-[128px] lg:px-12 lg:pt-14 flex flex-col justify-center">
              <h1 className="text-[26px] md:text-[34px] lg:text-[40px] font-bold tracking-[-1px] md:tracking-[-1.5px] leading-[1.12]">
                <span className="block text-white">
                  Vendere casa non significa pubblicare un annuncio.
                </span>
                <span className="block text-[#5bbbf4] mt-2">
                  Significa prendere la decisione giusta.
                </span>
              </h1>

              <p className="text-[14px] md:text-[16px] lg:text-[17px] text-white/80 mt-5 leading-relaxed max-w-[560px]">
                Da oltre 30 anni accompagniamo i proprietari di Milano,
                Buccinasco e dell&apos;hinterland con un metodo preciso:
                analisi, valutazione professionale, strategia di vendita e
                assistenza fino al rogito.
              </p>

              {/* Three features with thin vertical dividers */}
              <ul className="grid grid-cols-3 mt-7 md:mt-8 max-w-[560px]">
                {[
                  {
                    label: "Oltre 30 anni di esperienza",
                    icon: (
                      <>
                        <path
                          d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
                          stroke="#092d74"
                        />
                        <path d="m9 12 2 2 4-4" stroke="#d2072a" />
                      </>
                    ),
                  },
                  {
                    label: "Valutazioni basate su dati reali",
                    icon: (
                      <>
                        <path
                          d="M3 3v16a2 2 0 0 0 2 2h16"
                          stroke="#092d74"
                        />
                        <path d="M18 17V9" stroke="#092d74" />
                        <path d="M13 17V5" stroke="#d2072a" />
                        <path d="M8 17v-3" stroke="#092d74" />
                      </>
                    ),
                  },
                  {
                    label: "Assistenza completa fino al rogito",
                    icon: (
                      <>
                        <path
                          d="m11 17 2 2a1 1 0 1 0 3-3"
                          stroke="#d2072a"
                        />
                        <path
                          d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25H21"
                          stroke="#092d74"
                        />
                        <path d="M21 3 20 14" stroke="#092d74" />
                        <path
                          d="M3 4 4 15l6.5 6.5a1 1 0 1 0 3-3"
                          stroke="#092d74"
                        />
                        <path d="M3 4h8" stroke="#092d74" />
                      </>
                    ),
                  },
                ].map((f, i) => (
                  <li
                    key={f.label}
                    className={`flex flex-col items-center text-center px-2 md:px-3 ${
                      i > 0 ? "border-l border-white/20" : ""
                    }`}
                  >
                    <span className="flex items-center justify-center w-11 h-11 md:w-14 md:h-14 rounded-full bg-white shadow-sm">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-5 h-5 md:w-7 md:h-7"
                      >
                        {f.icon}
                      </svg>
                    </span>
                    <span className="mt-2.5 text-[11px] md:text-[13px] font-bold leading-tight text-white">
                      {f.label}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-7 md:mt-9 max-w-[560px]">
                <Link
                  href="/vendi-immobile"
                  className="w-full sm:flex-1 min-w-0 text-center bg-red-primary text-white text-[14px] md:text-[15px] font-semibold px-5 md:px-6 py-3 md:py-[13px] rounded-[8px] md:hover:scale-[1.03] md:hover:shadow-lg md:transition-all md:duration-300 active:scale-[0.98]"
                >
                  Richiedi una valutazione professionale
                </Link>
                <Link
                  href="/cerco-residenziale"
                  className="w-full sm:flex-1 min-w-0 text-center bg-transparent border border-white text-white text-[14px] md:text-[15px] font-semibold px-5 md:px-6 py-3 md:py-[13px] rounded-[8px] md:hover:bg-white/10 md:transition-all md:duration-300 active:scale-[0.98]"
                >
                  Guarda gli immobili disponibili
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ===== VALUATION FORM ===== */}
        <section className="relative w-full max-w-[980px] -mt-[40px] md:-mt-[90px] z-10 bg-white rounded-[14px] md:rounded-[18px] shadow-[0px_12px_40px_-8px_rgba(0,0,0,0.2)] px-4 md:px-10 lg:px-12 py-6 md:py-8 mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-10">
            {/* Left: pitch */}
            <div className="lg:w-[42%] lg:shrink-0">
              <h2 className="text-[21px] md:text-[27px] lg:text-[30px] font-bold tracking-[-0.8px] md:tracking-[-1.4px] text-black leading-tight">
                Quanto vale realmente la tua casa?
              </h2>
              <p className="text-[15px] md:text-[16px] text-black/70 mt-3 md:mt-4 leading-relaxed">
                Ricevi una prima analisi professionale basata sulla posizione
                dell&apos;immobile e sui dati del mercato locale.
              </p>
              <span className="flex items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-light mt-5 md:mt-6">
                <svg
                  viewBox="0 0 512 512"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  className="w-14 h-14 md:w-[76px] md:h-[76px]"
                >
                  {/* house */}
                  <path
                    fill="#092d74"
                    d="m59.843 153.17v150.14c0 21.463 17.561 39.024 39.023 39.024h49.976v-129.785c0-10.096 8.26-18.356 18.356-18.356h38.939c10.096 0 18.356 8.26 18.356 18.356v26.713c22.343-23.632 53.944-38.415 88.999-38.542v-47.55l16.537 12.015c12.204 8.844 29.268 6.119 38.112-6.085s6.12-29.268-6.085-38.112l-158.902-115.45c-9.325-7.072-22.532-7.566-32.499-.344l-159.376 115.794c-12.205 8.844-14.929 25.908-6.085 38.112s25.908 14.929 38.112 6.085z"
                  />
                  {/* magnifying glass */}
                  <path
                    fill="#d2072a"
                    d="M435.179 417.881l1.298-1.338c3.728-3.842 9.925-3.936 13.767-.207l58.811 57.069c3.842 3.729 3.937 9.923.208 13.767l-21.234 21.883c-3.729 3.843-9.924 3.935-13.767.207l-58.812-57.068c-3.843-3.729-3.936-9.925-.207-13.768l1.121-1.156-32.845-32.048c-18.714 16.009-43.012 25.68-69.571 25.68-59.147 0-107.095-47.948-107.095-107.094 0-59.147 47.948-107.095 107.095-107.095s107.095 47.948 107.095 107.095c0 22.846-7.159 44.018-19.349 61.404zM313.949 246.907c42.471 0 76.901 34.43 76.901 76.901s-34.43 76.901-76.901 76.901-76.901-34.43-76.901-76.901 34.43-76.901 76.901-76.901z"
                  />
                </svg>
              </span>
            </div>

            {/* Right: form */}
            <div className="lg:flex-1 lg:min-w-0">
              <ValuationWidget />
            </div>
          </div>
        </section>

        {/* ===== METODO ===== */}
        <section className="w-full mt-[52px] md:mt-[80px] lg:mt-[100px]">
          <div className="text-center">
            <p className="text-red-primary text-[12px] md:text-[13px] font-bold uppercase tracking-[2.5px]">
              Il nostro metodo
            </p>
            <span className="block mx-auto mt-3 w-10 h-[3px] rounded-full bg-red-primary" />
            <h2 className="text-[27px] md:text-[36px] lg:text-[42px] tracking-[-1px] md:tracking-[-1.6px] text-blue-primary leading-tight mt-4">
              Un percorso strutturato.{" "}
              <span className="text-red-primary font-bold">
                Un risultato sicuro.
              </span>
            </h2>
          </div>

          <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 lg:gap-6">
            {[
              {
                n: 1,
                title: "Sopralluogo professionale",
                desc: "Analizziamo il tuo immobile direttamente sul posto per valutarne ogni potenzialità.",
                icon: (
                  <>
                    <path d="M4 10.5 11 4.5l7 6" stroke="#092d74" />
                    <path d="M6 9V19.5h4.6" stroke="#092d74" />
                    <circle cx="15.4" cy="14.6" r="3.3" stroke="#d2072a" />
                    <path d="m17.9 17.1 2.6 2.6" stroke="#092d74" />
                  </>
                ),
              },
              {
                n: 2,
                title: "Consegna della perizia",
                desc: "Elaboriamo una valutazione basata su dati concreti e sul mercato locale.",
                icon: (
                  <>
                    <rect width="8" height="4" x="8" y="2" rx="1" stroke="#092d74" />
                    <path
                      d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
                      stroke="#092d74"
                    />
                    <path d="m9 14 2 2 4-4" stroke="#d2072a" />
                  </>
                ),
              },
              {
                n: 3,
                title: "Valorizzazione e promozione",
                desc: "Realizziamo fotografie professionali, Virtual Tour e campagne dedicate.",
                icon: (
                  <>
                    <path
                      d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"
                      stroke="#092d74"
                    />
                    <circle cx="12" cy="13" r="3" stroke="#d2072a" />
                  </>
                ),
              },
              {
                n: 4,
                title: "Strategia di vendita",
                desc: "Ti accompagniamo con una strategia su misura fino alla firma definitiva.",
                icon: (
                  <>
                    <path
                      d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
                      stroke="#092d74"
                    />
                    <circle cx="16.5" cy="7.5" r="0.9" fill="#d2072a" stroke="#d2072a" />
                  </>
                ),
              },
            ].map((s) => (
              <div
                key={s.n}
                className="group relative bg-white rounded-[14px] md:rounded-[20px] border border-blue-border px-5 md:px-6 pt-9 md:pt-10 pb-7 md:pb-8 flex flex-col items-center text-center md:hover:bg-gray-light md:hover:shadow-[0px_4px_20px_0px_rgba(10,47,120,0.1)] md:hover:-translate-y-1 md:transition-all md:duration-300"
              >
                {/* Number badge, floating over the card's top edge */}
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-blue-primary text-white text-[15px] font-bold border-4 border-white shadow-sm">
                  {s.n}
                </span>
                {/* Icon in a light circle (inverts to white on card hover) */}
                <span className="flex items-center justify-center w-[80px] h-[80px] rounded-full bg-gray-light md:group-hover:bg-white md:transition-colors md:duration-300">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-11 h-11"
                  >
                    {s.icon}
                  </svg>
                </span>
                <h3 className="text-[16px] md:text-[17px] font-bold text-blue-primary leading-snug mt-5 max-w-[190px]">
                  {s.title}
                </h3>
                <p className="text-[14px] text-black/65 leading-relaxed mt-2 max-w-[220px]">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== ABOUT SECTION (with video) ===== */}
        <section className="w-full rounded-[16px] md:rounded-[24px] bg-gradient-to-b from-white to-[#f2f2f2] overflow-hidden mt-[48px] md:mt-[80px] lg:mt-[100px] flex flex-col-reverse lg:flex-row min-h-0 lg:min-h-[500px]">
          <div className="px-5 py-7 md:p-10 lg:w-1/2 lg:p-[45px] flex flex-col justify-center">
            <h2 className="text-[24px] md:text-[30px] lg:text-[32px] tracking-[-1px] md:tracking-[-2px] text-black leading-tight">
              Molto più di una semplice{" "}
              <strong>agenzia immobiliare.</strong>
            </h2>
            <p className="text-[15px] md:text-[16px] text-black/80 mt-4 md:mt-5 leading-relaxed max-w-[440px]">
              Studiotara nasce a Buccinasco nel 1994 e da allora lavora ogni
              giorno per chi vuole comprare, vendere o affittare casa
              a Milano e nell&apos;hinterland. Non siamo una grande
              catena: siamo professionisti del territorio, con una conoscenza
              diretta di Buccinasco, Corsico, Assago e dei comuni vicini che
              nessun database riesce a restituire davvero. Ci prendiamo cura di
              ogni pratica, di ogni dubbio, di ogni fase della trattativa —
              perché per noi ogni operazione è quella di una persona, non di un
              numero.
            </p>
            <Link
              href="/chi-siamo"
              className="block w-full text-center md:inline-block md:w-auto mt-5 md:mt-7 bg-red-primary text-white text-[15px] md:text-[16px] font-medium px-6 md:px-10 py-3 md:py-[10px] rounded-[8px] md:rounded-[6px] md:hover:scale-105 md:hover:shadow-lg md:transition-all md:duration-300 md:self-start active:scale-[0.99]"
            >
              Scopri chi siamo
            </Link>
          </div>

          {/* Video container */}
          <div className="lg:w-1/2 flex items-center justify-center p-3 md:p-8 lg:p-[30px]">
            <div className="w-full max-w-[580px] rounded-[14px] md:rounded-[22px] bg-gradient-to-t from-[#f2f2f2] to-white p-2 md:p-[12px]">
              <div className="w-full aspect-video rounded-[10px] md:rounded-[18px] overflow-hidden bg-black">
                <VideoPlayer videoId="8dO12buHcRA" />
              </div>
            </div>
          </div>
        </section>

        {/* ===== TRUST / CHI SIAMO ===== */}
        <section className="text-center mt-[64px] md:mt-[120px] lg:mt-[160px] px-2 md:px-4">
          <h2 className="text-[24px] md:text-[30px] lg:text-[32px] tracking-[-1px] md:tracking-[-2px] text-black leading-tight">
            La tua agenzia immobiliare di fiducia{" "}
            <strong>da oltre 30 anni</strong>
          </h2>
          <p className="text-[15px] md:text-[16px] text-black/70 mt-3 max-w-[520px] mx-auto tracking-[-0.3px] md:tracking-[-0.5px]">
            Compravendita e locazione di immobili residenziali, commerciali e
            industriali a Milano e nell&apos;hinterland.
          </p>
        </section>

        {/* ===== PROPERTY CARDS ===== */}
        <section className="flex flex-col lg:flex-row gap-5 md:gap-6 lg:gap-8 mt-6 md:mt-10 w-full">
          {/* Residential */}
          <div className="group relative flex-1 min-h-[440px] md:min-h-[460px] rounded-[14px] md:rounded-[18px] border-[4px] md:border-[6px] border-blue-primary overflow-hidden shadow-[0px_0px_10px_0px_rgba(0,0,0,0.15)] md:hover:shadow-[0px_8px_30px_0px_rgba(9,45,116,0.3)] md:hover:-translate-y-1 md:transition-all md:duration-300">
            <div className="absolute inset-[-6px] bg-gradient-to-b from-blue-primary to-blue-secondary">
              <div className="absolute right-[-5%] bottom-[-10%] w-[65%] h-[55%] opacity-90">
                <Image
                  src="/images/ellipse-decoration.svg"
                  alt=""
                  fill
                  aria-hidden="true"
                />
              </div>
              <div className="absolute right-2 md:right-4 bottom-3 w-[55%] md:w-[58%] max-w-[360px] h-[180px] md:h-[220px] md:group-hover:scale-105 md:transition-transform md:duration-500">
                <Image
                  src="/images/casahome.png"
                  alt="Immobili residenziali"
                  fill
                  className="object-contain object-bottom"
                />
              </div>
              <div className="px-6 pt-7 pb-[200px] md:pb-0 md:px-9 md:pt-9 relative z-10">
                <h3 className="text-[20px] md:text-[24px] tracking-[-0.8px] md:tracking-[-1.2px] text-white leading-tight">
                  Cerchi casa o vuoi venderla?
                </h3>
                <p className="text-[14px] md:text-[16px] text-white/85 mt-3 tracking-[-0.3px] md:tracking-[-0.5px] max-w-[460px] leading-relaxed">
                  Appartamenti, ville e attici a Buccinasco, Corsico, Assago e
                  nell&apos;hinterland milanese. Ti seguiamo dalla prima visita
                  fino al rogito, senza lasciare nulla al caso.
                </p>
                <Link
                  href="/cerco-residenziale"
                  className="inline-block mt-5 md:mt-6 bg-red-primary text-white text-[14px] md:text-[16px] font-medium px-5 md:px-9 py-[10px] md:py-[10px] rounded-[8px] md:rounded-[6px] md:hover:scale-105 md:hover:shadow-lg md:transition-all md:duration-300 active:scale-[0.98]"
                >
                  Vedi immobili residenziali
                </Link>
              </div>
            </div>
          </div>

          {/* Commercial */}
          <div className="group relative flex-1 min-h-[440px] md:min-h-[460px] rounded-[14px] md:rounded-[18px] border-[4px] md:border-[6px] border-blue-primary overflow-hidden shadow-[0px_0px_10px_0px_rgba(0,0,0,0.15)] md:hover:shadow-[0px_8px_30px_0px_rgba(9,45,116,0.3)] md:hover:-translate-y-1 md:transition-all md:duration-300">
            <div className="absolute inset-[-6px] bg-gradient-to-b from-blue-primary to-blue-secondary">
              <div className="absolute right-[-5%] bottom-[-10%] w-[65%] h-[55%] opacity-90">
                <Image
                  src="/images/ellipse-decoration.svg"
                  alt=""
                  fill
                  aria-hidden="true"
                />
              </div>
              <div className="absolute right-4 md:right-6 bottom-3 w-[50%] md:w-[52%] max-w-[320px] h-[180px] md:h-[220px] md:group-hover:scale-105 md:transition-transform md:duration-500">
                <Image
                  src="/images/negoziohome.png"
                  alt="Immobili commerciali"
                  fill
                  className="object-contain object-bottom"
                />
              </div>
              <div className="px-6 pt-7 pb-[200px] md:pb-0 md:px-9 md:pt-9 relative z-10">
                <h3 className="text-[20px] md:text-[24px] tracking-[-0.8px] md:tracking-[-1.2px] text-white leading-tight">
                  Cerchi uno spazio per la tua attività?
                </h3>
                <p className="text-[14px] md:text-[16px] text-white/85 mt-3 tracking-[-0.3px] md:tracking-[-0.5px] max-w-[460px] leading-relaxed">
                  Uffici, capannoni, magazzini e aree produttive per
                  imprenditori e investitori. Operiamo con riservatezza e
                  competenza sulle operazioni più complesse.
                </p>
                <Link
                  href="/cerco-commerciale"
                  className="inline-block mt-5 md:mt-6 bg-red-primary text-white text-[14px] md:text-[16px] font-medium px-5 md:px-9 py-[10px] md:py-[10px] rounded-[8px] md:rounded-[6px] md:hover:scale-105 md:hover:shadow-lg md:transition-all md:duration-300 active:scale-[0.98]"
                >
                  Vedi immobili commerciali
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ===== CONSULTATION SECTION ===== */}
        <section className="w-full rounded-[16px] md:rounded-[24px] bg-gradient-to-b from-white to-[#f2f2f2] overflow-hidden mt-[64px] md:mt-[120px] lg:mt-[160px] flex flex-col-reverse lg:flex-row min-h-0 lg:min-h-[500px]">
          {/* Photo */}
          <div className="lg:w-1/2 flex items-center justify-center p-3 md:p-8 lg:p-[30px]">
            <div className="w-full max-w-[580px] rounded-[14px] md:rounded-[22px] bg-gradient-to-t from-[#f2f2f2] to-white p-2 md:p-[12px]">
              <div className="w-full aspect-[577/407] rounded-[10px] md:rounded-[18px] overflow-hidden">
                <Image
                  src="/images/fotohome.png"
                  alt="Studio Tara ufficio"
                  width={580}
                  height={409}
                  className="object-cover w-full h-full md:hover:scale-105 md:transition-transform md:duration-700"
                />
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="px-5 py-7 md:p-10 lg:w-1/2 lg:p-[45px] flex flex-col justify-center">
            <h2 className="text-[24px] md:text-[30px] lg:text-[32px] tracking-[-1px] md:tracking-[-2px] text-black leading-tight">
              Comprare o vendere casa non deve essere{" "}
              <strong>uno stress.</strong>
            </h2>
            <p className="text-[15px] md:text-[16px] text-black/80 mt-4 md:mt-5 leading-relaxed max-w-[440px]">
              Lo sappiamo: una compravendita immobiliare è spesso la decisione
              economica più importante della vita. Per questo in Studiotara non
              ti lasciamo mai da solo. Dalla valutazione iniziale alla firma del
              contratto definitivo, ogni passaggio viene gestito con cura,
              trasparenza e la competenza di chi conosce questo mercato da
              trent&apos;anni. Che tu stia cercando il primo appartamento o
              voglia vendere al prezzo giusto, siamo il punto di riferimento che
              ti serve.
            </p>
            <Link
              href="/contatti"
              className="block w-full text-center md:inline-block md:w-auto mt-5 md:mt-7 bg-red-primary text-white text-[15px] md:text-[16px] font-medium px-6 md:px-10 py-3 md:py-[10px] rounded-[8px] md:rounded-[6px] md:hover:scale-105 md:hover:shadow-lg md:transition-all md:duration-300 md:self-start active:scale-[0.99]"
            >
              Richiedi una consulenza
            </Link>
          </div>
        </section>

        {/* ===== NUMBERS SECTION ===== */}
        <section className="w-full rounded-[16px] md:rounded-[24px] bg-gradient-to-b from-blue-primary to-blue-secondary overflow-hidden mt-[64px] md:mt-[120px] lg:mt-[160px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.15)] text-white text-center py-10 md:py-16 px-5 md:px-6">
          <h2 className="text-[24px] md:text-[30px] lg:text-[32px] tracking-[-1px] md:tracking-[-2px] leading-tight">
            I numeri di Studiotara
          </h2>
          <div className="grid grid-cols-3 md:flex md:flex-row md:justify-center gap-4 md:gap-20 lg:gap-[140px] mt-7 md:mt-10">
            <div className="flex flex-col items-center gap-2 md:gap-3 group">
              <span className="text-[32px] md:text-[48px] lg:text-[52px] font-bold tracking-[-1.5px] md:tracking-[-2.5px] leading-none md:group-hover:scale-110 md:transition-transform md:duration-300">
                1850+
              </span>
              <span className="text-[12px] md:text-[20px] lg:text-[22px] tracking-[-0.3px] md:tracking-[-0.8px] text-white/80 leading-tight">
                Potenziali acquirenti annui
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 md:gap-3 group">
              <span className="text-[32px] md:text-[48px] lg:text-[52px] font-bold tracking-[-1.5px] md:tracking-[-2.5px] leading-none md:group-hover:scale-110 md:transition-transform md:duration-300">
                30+
              </span>
              <span className="text-[12px] md:text-[20px] lg:text-[22px] tracking-[-0.3px] md:tracking-[-0.8px] text-white/80 leading-tight">
                Anni di attività
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 md:gap-3 group">
              <span className="text-[32px] md:text-[48px] lg:text-[52px] font-bold tracking-[-1.5px] md:tracking-[-2.5px] leading-none md:group-hover:scale-110 md:transition-transform md:duration-300">
                650+
              </span>
              <span className="text-[12px] md:text-[20px] lg:text-[22px] tracking-[-0.3px] md:tracking-[-0.8px] text-white/80 leading-tight">
                Valutazioni annue
              </span>
            </div>
          </div>
        </section>

        {/* ===== TESTIMONIALS (Google Reviews) ===== */}
        <section className="text-center mt-[64px] md:mt-[120px] lg:mt-[160px] px-2 md:px-4">
          <h2 className="text-[24px] md:text-[30px] lg:text-[32px] tracking-[-1px] md:tracking-[-2px] text-black leading-tight">
            Cosa dicono i nostri <strong>clienti</strong>
          </h2>
          <p className="text-[15px] md:text-[16px] text-black/70 mt-2 tracking-[-0.3px] md:tracking-[-0.5px]">
            Trent&apos;anni di fiducia, raccontati da chi ci ha scelto.
          </p>
        </section>

        <ReviewsCarousel />

        {/* ===== BLOG SECTION (provisional) ===== */}
        <section className="text-center mt-[64px] md:mt-[120px] lg:mt-[160px] px-2 md:px-4">
          <h2 className="text-[24px] md:text-[30px] lg:text-[32px] tracking-[-1px] md:tracking-[-2px] text-black leading-tight">
            Notizie e consigli dal <strong>mondo immobiliare</strong>
          </h2>
          <p className="text-[15px] md:text-[16px] text-black/70 mt-2 tracking-[-0.3px] md:tracking-[-0.5px] max-w-[720px] mx-auto">
            La tua agenzia immobiliare di fiducia con oltre 30 anni di
            esperienza nella compravendita e locazione di immobili
            residenziali, commerciali e industriali a Milano e
            nell&apos;hinterland.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7 mt-7 md:mt-8 w-full">
          {[
            {
              title: "La nuova disciplina delle donazioni immobiliari",
              excerpt:
                "Dal 18 dicembre 2025 è in vigore la Legge n. 182/2025. Ecco cosa cambia concretamente per chi vuole trasferire un immobile a un familiare o a un terzo.",
              image: "/images/blog1.jpg",
              bgColor: "bg-blog-gray",
            },
            {
              title: "Bonus 2026: cosa resta e cosa è stato eliminato",
              excerpt:
                "Dal 18 dicembre 2025 è in vigore la Legge n. 182/2025. Ecco cosa cambia concretamente per chi vuole trasferire un immobile a un familiare o a un terzo.",
              image: "/images/blog2.jpg",
              bgColor: "bg-blog-blue",
            },
            {
              title: "Le nuove regole per i fabbricati",
              excerpt:
                "Dal 18 dicembre 2025 è in vigore la Legge n. 182/2025. Ecco cosa cambia concretamente per chi vuole trasferire un immobile a un familiare o a un terzo.",
              image: "/images/blog3.jpg",
              bgColor: "bg-blog-gray",
            },
          ].map((article, i) => (
            <article
              key={i}
              className="group bg-gray-light rounded-[14px] md:rounded-[18px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.1)] overflow-hidden md:hover:shadow-[0px_8px_30px_0px_rgba(0,0,0,0.15)] md:hover:-translate-y-1 md:transition-all md:duration-300"
            >
              <div
                className={`mx-4 md:mx-6 mt-5 md:mt-6 h-[180px] md:h-[180px] ${article.bgColor} rounded-[10px] md:rounded-[12px] overflow-hidden`}
              >
                <Image
                  src={article.image}
                  alt={article.title}
                  width={340}
                  height={180}
                  className="w-full h-full object-cover md:group-hover:scale-105 md:transition-transform md:duration-500"
                />
              </div>
              <div className="px-4 md:px-6 pt-4 md:pt-5 pb-5 md:pb-7">
                <h3 className="text-[18px] md:text-[22px] tracking-[-0.6px] md:tracking-[-1px] text-black leading-tight">
                  {article.title}
                </h3>
                <p className="text-[14px] md:text-[15px] text-black/70 mt-3 tracking-[-0.2px] md:tracking-[-0.3px] leading-relaxed line-clamp-3">
                  {article.excerpt}
                </p>
                <Link
                  href="/blog"
                  className="inline-block mt-4 bg-red-primary text-white text-[14px] md:text-[15px] font-medium py-[10px] md:py-[9px] px-5 md:px-6 rounded-[8px] md:rounded-[6px] md:hover:scale-105 md:hover:shadow-lg md:transition-all md:duration-300 active:scale-[0.98]"
                >
                  Leggi l&apos;articolo
                </Link>
              </div>
            </article>
          ))}
        </section>

        {/* ===== NEWSLETTER ===== */}
        <section className="w-full rounded-[16px] md:rounded-[24px] bg-gradient-to-b from-blue-primary to-blue-secondary overflow-hidden mt-[64px] md:mt-[120px] lg:mt-[160px] mb-[32px] md:mb-[50px] lg:mb-[60px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.15)] text-white text-center py-10 md:py-16 px-5 md:px-6">
          <h2 className="text-[24px] md:text-[30px] lg:text-[32px] tracking-[-1px] md:tracking-[-2px] leading-tight">
            Resta aggiornato sul <strong>mercato immobiliare</strong>
          </h2>
          <p className="text-[14px] md:text-[16px] mt-3 md:mt-4 max-w-[520px] mx-auto leading-relaxed text-white/85">
            Iscriviti alla newsletter di Studiotara: notizie, consigli pratici
            e aggiornamenti del settore una volta al mese, senza spam.
          </p>
          <NewsletterForm />
        </section>
      </main>

      <Footer />
    </>
  );
}
