import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import VideoPlayer from "@/components/VideoPlayer";

const tipologie = [
  "Abitazioni in Stabili Medi",
  "Abitazioni in Stabili Signorili",
  "Abitazioni in Stabili Economici",
  "Ville & Villini",
  "Uffici",
  "Negozi",
  "Box & Autorimesse",
  "Posti Auto Coperti",
  "Posti Auto Scoperti",
  "Laboratori",
  "Magazzini",
  "Capannoni Tipici",
  "Capannoni Industriali",
];

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="flex flex-col items-center overflow-x-hidden max-w-[1440px] mx-auto w-full px-4 md:px-10 lg:px-[50px]">
        {/* ===== HERO SECTION ===== */}
        <section
          className="relative w-full rounded-[16px] md:rounded-[24px] bg-gradient-to-b from-blue-primary to-blue-secondary overflow-hidden mt-3 md:min-h-[520px] lg:min-h-[580px]"
        >
          {/* Red decorative swoosh - desktop */}
          <div className="hidden md:block absolute md:-left-[10%] md:bottom-[50px] md:w-[360px] md:h-[360px] lg:w-[400px] lg:h-[400px] -rotate-[34deg]">
            <Image
              src="/images/vector-decoration.svg"
              alt=""
              width={480}
              height={480}
              aria-hidden="true"
            />
          </div>

          {/* Mascot - desktop */}
          <div className="hidden md:block absolute left-1/2 -translate-x-[390px] lg:-translate-x-[450px] top-[20px] w-[160px] lg:w-[200px] h-[390px]">
            <Image
              src="/images/ominohome.png"
              alt="Studio Tara mascotte"
              width={180}
              height={360}
              className="object-contain"
            />
          </div>

          {/* Hero text */}
          <div className="relative z-10 px-5 pt-7 pb-[100px] md:absolute md:right-[40px] md:px-0 md:py-0 lg:right-[60px] md:top-[80px] lg:top-[90px] md:w-[480px] lg:w-[580px]">
            <h1 className="text-[26px] md:text-[32px] lg:text-[36px] tracking-[-1px] md:tracking-[-2px] text-white leading-[1.15] md:leading-tight">
              <strong>Vendi, acquisti</strong> o <strong>affitti </strong>
              casa a Milano e nell&apos;hinterland?
            </h1>
            <p className="text-[14px] md:text-[16px] lg:text-[17px] text-white/90 mt-4 md:mt-5 leading-relaxed max-w-[520px]">
              Siamo l&apos;agenzia immobiliare di Buccinasco con oltre 30 anni
              di esperienza. Professionisti seri, preparati e presenti in ogni
              fase della trattativa: ti accompagniamo dalla valutazione
              iniziale fino alla firma definitiva.
            </p>
            <Link
              href="/cerco-residenziale"
              className="block w-full text-center md:inline-block md:w-auto mt-5 md:mt-6 bg-red-primary text-white text-[15px] md:text-[17px] font-medium px-6 md:px-10 py-3 md:py-[11px] rounded-[8px] md:rounded-[6px] md:hover:scale-105 md:hover:shadow-lg md:transition-all md:duration-300 active:scale-[0.98]"
            >
              Scopri i nostri immobili
            </Link>
          </div>
        </section>

        {/* ===== VALUATION FORM ===== */}
        <section className="relative w-full max-w-[720px] -mt-[40px] md:-mt-[90px] z-10 bg-white border-[3px] md:border-[8px] border-blue-accent rounded-[12px] md:rounded-[14px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.15)] px-4 md:px-12 lg:px-16 py-5 md:py-7 mx-auto">
          {/* Mobile mascot - lives inside the white form, extends up into the hero (form's z-10 stacks it over the blue) */}
          <div className="md:hidden absolute right-0 -top-[110px] w-[150px] h-[260px] pointer-events-none">
            <Image
              src="/images/ominohome.png"
              alt=""
              fill
              className="object-contain object-bottom"
              aria-hidden="true"
            />
          </div>

          <h2 className="text-[19px] md:text-[24px] tracking-[-0.8px] md:tracking-[-1.2px] text-black text-left md:text-center leading-snug max-md:pr-[140px]">
            Scopri subito quanto vale il <strong>tuo immobile!</strong>
          </h2>
          <form className="flex flex-col gap-3 md:gap-4 mt-4 md:mt-5 max-w-[520px] mx-auto">
            <div className="flex flex-col md:flex-row gap-3 md:gap-4">
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-[13px] text-black/60 font-medium ml-1">Tipologia</label>
                <div className="relative">
                  <select
                    className="w-full h-[44px] md:h-[42px] border-2 md:border-[2.5px] border-blue-primary rounded-[8px] md:rounded-[6px] px-3 pr-9 text-[15px] md:text-[14px] outline-none bg-white focus:border-blue-secondary focus:shadow-[0_0_0_3px_rgba(17,85,218,0.15)] transition-all appearance-none cursor-pointer"
                    defaultValue=""
                  >
                    <option value="" disabled>Seleziona tipologia...</option>
                    {tipologie.map((t) => (
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
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-[13px] text-black/60 font-medium ml-1">Provincia</label>
                <input
                  type="text"
                  placeholder="Es. Milano"
                  className="h-[44px] md:h-[42px] border-2 md:border-[2.5px] border-blue-primary rounded-[8px] md:rounded-[6px] px-3 text-[15px] md:text-[14px] outline-none focus:border-blue-secondary focus:shadow-[0_0_0_3px_rgba(17,85,218,0.15)] transition-all"
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-3 md:gap-4">
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-[13px] text-black/60 font-medium ml-1">Comune</label>
                <input
                  type="text"
                  placeholder="Es. Buccinasco"
                  className="h-[44px] md:h-[42px] border-2 md:border-[2.5px] border-blue-primary rounded-[8px] md:rounded-[6px] px-3 text-[15px] md:text-[14px] outline-none focus:border-blue-secondary focus:shadow-[0_0_0_3px_rgba(17,85,218,0.15)] transition-all"
                />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-[13px] text-black/60 font-medium ml-1">Indirizzo</label>
                <input
                  type="text"
                  placeholder="Es. Via Roma 2"
                  className="h-[44px] md:h-[42px] border-2 md:border-[2.5px] border-blue-primary rounded-[8px] md:rounded-[6px] px-3 text-[15px] md:text-[14px] outline-none focus:border-blue-secondary focus:shadow-[0_0_0_3px_rgba(17,85,218,0.15)] transition-all"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-red-primary text-white text-[16px] md:text-[17px] font-medium py-3 md:py-[11px] rounded-[8px] md:rounded-[6px] md:hover:scale-[1.02] md:hover:shadow-lg md:transition-all md:duration-300 cursor-pointer active:scale-[0.99]"
            >
              Valuta ora
            </button>
          </form>
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
          <form className="flex flex-col md:flex-row gap-3 md:gap-5 items-center justify-center mt-6 md:mt-8">
            <input
              type="email"
              placeholder="La tua email"
              className="w-full md:w-[400px] lg:w-[460px] h-[48px] md:h-[44px] rounded-[8px] md:rounded-[6px] px-4 md:px-5 text-[15px] md:text-[16px] text-black bg-white outline-none focus:shadow-[0_0_0_3px_rgba(210,7,42,0.3)] transition-all"
            />
            <button
              type="submit"
              className="w-full md:w-auto bg-red-primary text-white text-[15px] md:text-[16px] font-medium px-6 md:px-10 py-3 md:py-[11px] rounded-[8px] md:rounded-[6px] md:hover:scale-105 md:hover:shadow-lg md:transition-all md:duration-300 cursor-pointer active:scale-[0.99]"
            >
              Iscriviti
            </button>
          </form>
        </section>
      </main>

      <Footer />
    </>
  );
}
