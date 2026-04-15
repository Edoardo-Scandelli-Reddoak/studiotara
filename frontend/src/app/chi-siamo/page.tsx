import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const servizi = [
  {
    icon: "/icons/3d-house.svg",
    title: "Compravendita residenziale",
    description:
      "Appartamenti, ville, attici e soluzioni abitative a Buccinasco, Corsico, Assago e nell'hinterland milanese. Ti seguiamo dalla prima visita fino al rogito, senza lasciare nulla al caso.",
  },
  {
    icon: "/icons/grocery-store.svg",
    title: "Immobili commerciali e industriali",
    description:
      "Uffici, capannoni, magazzini, negozi e aree produttive. Operiamo con riservatezza e competenza sulle operazioni più complesse, garantendo valore a lungo termine.",
  },
  {
    icon: "/icons/3d-valuation.svg",
    title: "Valutazione immobiliare",
    description:
      "Stima del valore reale basata su dati di mercato aggiornati e conoscenza diretta del territorio. Gratuita, obiettiva, senza impegno.",
  },
  {
    icon: "/icons/3d-speaker.svg",
    title: "Marketing immobiliare",
    description:
      "Visibilità massima sui principali portali, newsletter alla banca dati di oltre 6.000 contatti e strategie di comunicazione mirate per vendere al miglior prezzo.",
  },
  {
    icon: "/icons/key.svg",
    title: "Locazioni",
    description:
      "Affittiamo immobili residenziali e commerciali con la stessa cura della compravendita: selezione degli inquilini, contrattualistica e supporto continuo.",
  },
  {
    icon: "/icons/balance.svg",
    title: "Consulenza tecnica",
    description:
      "Supporto nelle pratiche burocratiche, consulenza fiscale e coordinamento con notai, tecnici e istituti di credito. Gestiamo anche le situazioni più complesse.",
  },
];

const timeline = [
  {
    year: "1994 — La fondazione",
    text: "Alessandro Tarantola apre Studiotara a Buccinasco. Nasce un punto di riferimento per il mercato immobiliare dell'hinterland sud-ovest di Milano.",
  },
  {
    year: "Anni 2000 — La crescita",
    text: "Il team si amplia, i servizi si evolvono. Studiotara inizia a gestire anche immobili commerciali e industriali, consolidando la presenza territoriale.",
  },
  {
    year: "Anni 2010 — Il network",
    text: "La banca dati supera i 6.000 contatti. Nasce un sistema di marketing immobiliare strutturato che riduce sensibilmente i tempi di vendita.",
  },
  {
    year: "Oggi — L'eccellenza",
    text: "Oltre 1.850 potenziali acquirenti annui, 650+ valutazioni e un team riconosciuto tra i più affidabili del territorio milanese.",
  },
];

export default function ChiSiamo() {
  return (
    <>
      <Navbar />

      <main className="flex flex-col items-center overflow-x-hidden max-w-[1440px] mx-auto w-full px-5 md:px-10 lg:px-[50px]">
        {/* ===== HERO SECTION ===== */}
        <section className="relative w-full rounded-[20px] md:rounded-[24px] lg:rounded-[28px] bg-gradient-to-b from-blue-primary to-blue-secondary overflow-visible mt-3 min-h-[320px] md:min-h-[380px] lg:min-h-[430px]">
          {/* Photo - overflows left edge */}
          <div className="relative w-full h-[240px] md:absolute md:left-[-40px] lg:left-[-61px] md:top-[40px] lg:top-[98px] md:w-[380px] lg:w-[616px] md:h-[280px] lg:h-[411px] overflow-hidden md:rounded-none rounded-t-[20px]">
            <Image
              src="/images/foto_chisiamo.png"
              alt="Studio Tara sede"
              fill
              className="object-cover"
            />
          </div>

          {/* Text */}
          <div className="relative px-6 py-8 md:absolute md:left-[420px] lg:left-[592px] md:top-1/2 md:-translate-y-1/2 md:w-[340px] lg:w-[586px]">
            <h1 className="text-[28px] md:text-[32px] lg:text-[36px] tracking-[-1.5px] md:tracking-[-2px] text-white leading-tight">
              Trent&apos;anni di storia
              <br />
              nel mercato <strong>immobiliare</strong>
            </h1>
            <p className="text-[15px] md:text-[16px] lg:text-[17px] text-white/90 mt-4 lg:mt-5 leading-relaxed max-w-[604px]">
              Studiotara nasce dalla passione di Alessandro Tarantola per il
              settore immobiliare e dalla convinzione che ogni trattativa
              meriti serietà, competenza e un rapporto umano autentico.
            </p>
            <Link
              href="/contatti"
              className="inline-block mt-6 lg:mt-8 bg-red-primary text-white text-[16px] md:text-[17px] font-medium px-8 md:px-10 py-[10px] md:py-[11px] rounded-[6px] hover:scale-105 hover:shadow-lg transition-all duration-300"
            >
              Scopri chi siamo
            </Link>
          </div>
        </section>

        {/* ===== CHI C'E DIETRO STUDIOTARA ===== */}
        <section className="w-full mt-[80px] md:mt-[120px] lg:mt-[160px] flex flex-col lg:flex-row gap-10 lg:gap-[119px] items-center">
          <div className="flex flex-col gap-6 lg:gap-[34px] lg:w-[645px]">
            <h2 className="text-[26px] md:text-[30px] lg:text-[32px] tracking-[-1.5px] md:tracking-[-2px] text-black">
              Chi c&apos;è dietro <strong>Studiotara</strong>
            </h2>

            {/* Quote */}
            <div className="flex gap-5 lg:gap-[26px] items-start">
              <div className="w-[3px] bg-blue-primary rounded-full shrink-0 self-stretch" />
              <p className="text-[16px] md:text-[17px] lg:text-[18px] text-black italic leading-relaxed">
                &ldquo;Vendere o comprare casa non è mai solo una questione
                di numeri. È una delle decisioni più importanti della vita di
                una persona, e merita di essere trattata come tale.&rdquo;
              </p>
            </div>

            {/* Body text */}
            <div className="text-[15px] md:text-[16px] text-black leading-relaxed flex flex-col gap-5">
              <p>
                Studiotara nasce nel 1994 dall&apos;iniziativa di Alessandro
                Tarantola, professionista del settore immobiliare con una
                visione chiara: costruire un&apos;agenzia capace di offrire
                un servizio di qualità reale, non di facciata.
              </p>
              <p>
                Negli anni lo studio ha cresciuto il proprio team e ampliato
                il raggio d&apos;azione, ma il metodo è rimasto invariato:
                conoscenza profonda del territorio, attenzione alle esigenze
                del cliente, massima trasparenza in ogni fase della
                trattativa.
              </p>
              <p>
                Oggi Studiotara è un punto di riferimento consolidato per chi
                compra, vende o affitta nell&apos;hinterland sud-ovest di
                Milano, con una rete di oltre 6.000 contatti attivi e un
                team di professionisti che fanno di questo lavoro una vera
                vocazione.
              </p>
            </div>

            <Link
              href="/contatti"
              className="inline-block bg-red-primary text-white text-[16px] md:text-[17px] font-medium px-8 md:px-10 py-[10px] md:py-[11px] rounded-[6px] hover:scale-105 hover:shadow-lg transition-all duration-300 self-start"
            >
              Richiedi una consulenza
            </Link>
          </div>

          {/* Characters illustration */}
          <div className="w-full max-w-[400px] lg:max-w-[497px] lg:w-[497px] shrink-0">
            <Image
              src="/images/personaggi-chisiamo.png"
              alt="Team Studio Tara"
              width={497}
              height={347}
              className="w-full h-auto object-contain"
            />
          </div>
        </section>

        {/* ===== TRENT'ANNI VISSUTI SUL CAMPO ===== */}
        <section className="w-full mt-[80px] md:mt-[120px] lg:mt-[160px] bg-[#f5f3f0] rounded-[20px] md:rounded-[24px] lg:rounded-[28px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.25)] px-6 md:px-10 lg:px-[84px] py-10 md:py-14 lg:py-[78px]">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-[26px] md:text-[30px] lg:text-[32px] tracking-[-1.5px] md:tracking-[-2px] text-black">
              Trent&apos;anni vissuti sul <strong>campo</strong>
            </h2>
            <p className="text-[15px] md:text-[16px] text-black mt-3 lg:mt-4 max-w-[688px] mx-auto leading-relaxed">
              Non ci siamo costruiti una reputazione a tavolino.
              L&apos;abbiamo guadagnata trattativa dopo trattativa, anno
              dopo anno, zona per zona.
            </p>
          </div>

          {/* Content: text + timeline */}
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 mt-10 md:mt-12 lg:mt-[125px]">
            {/* Left text */}
            <div className="flex flex-col gap-6 lg:gap-[34px] lg:w-[544px]">
              <div className="text-[15px] md:text-[16px] text-black leading-relaxed flex flex-col gap-5">
                <p>
                  Tutto comincia a Buccinasco. Alessandro Tarantola apre lo
                  studio con un obiettivo preciso: offrire a chi vuole
                  comprare o vendere casa nell&apos;hinterland milanese un
                  servizio professionale, diretto e senza fronzoli.
                </p>
                <p>
                  Nel corso degli anni Studiotara amplia la propria presenza
                  sul territorio, affiancando ai servizi residenziali la
                  gestione di immobili commerciali e industriali. Il team
                  cresce, il metodo no: ascolto, competenza e risultati
                  concreti.
                </p>
                <p>
                  Oggi siamo presenti in tutto il corridoio sud-ovest di
                  Milano — da Buccinasco ad Assago, da Corsico a Trezzano
                  sul Naviglio — con una banca dati di oltre 6.000
                  potenziali acquirenti e un approccio che non smette mai di
                  mettere la persona al centro.
                </p>
              </div>
              <Link
                href="/contatti"
                className="inline-block bg-red-primary text-white text-[16px] md:text-[17px] font-medium px-8 md:px-10 py-[10px] md:py-[11px] rounded-[6px] hover:scale-105 hover:shadow-lg transition-all duration-300 self-start"
              >
                Richiedi una consulenza
              </Link>
            </div>

            {/* Right timeline */}
            <div className="relative flex-1 flex flex-col gap-8 lg:gap-[47px] pl-10 lg:pl-[80px]">
              {/* Vertical line */}
              <div className="absolute left-[22px] lg:left-[22px] top-[12px] bottom-[12px] w-[3px] bg-blue-primary/30 rounded-full" />

              {timeline.map((item, i) => (
                <div key={i} className="relative">
                  {/* Dot */}
                  <div className="absolute -left-10 lg:-left-[80px] top-[2px] w-[40px] lg:w-[47px] h-[40px] lg:h-[47px] rounded-full bg-blue-primary border-[4px] border-white shadow-md flex items-center justify-center">
                    <div className="w-[10px] h-[10px] rounded-full bg-white" />
                  </div>

                  <div className="flex flex-col gap-2 lg:gap-[10px]">
                    <p className="text-[16px] md:text-[17px] lg:text-[18px] font-semibold text-black">
                      {item.year}
                    </p>
                    <p className="text-[14px] md:text-[15px] lg:text-[16px] text-black leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SERVIZI ===== */}
        <section className="w-full mt-[80px] md:mt-[120px] lg:mt-[160px]">
          <div className="text-center">
            <h2 className="text-[26px] md:text-[30px] lg:text-[32px] tracking-[-1.5px] md:tracking-[-2px] text-black">
              Ogni operazione, <strong>gestita nel dettaglio</strong>
            </h2>
            <p className="text-[15px] md:text-[16px] text-black mt-3 lg:mt-4 max-w-[682px] mx-auto leading-relaxed tracking-[-0.5px] lg:tracking-[-1.2px]">
              Dalla stima iniziale alla firma del rogito, seguiamo ogni fase
              con la stessa attenzione. Perché le mezze misure non ci
              appartengono.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10 mt-10 md:mt-12 lg:mt-[86px]">
            {servizi.map((servizio, i) => (
              <div
                key={i}
                className="bg-gradient-to-b from-blue-primary to-blue-secondary rounded-[16px] md:rounded-[18px] lg:rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] p-6 md:p-7 lg:p-[30px] min-h-[280px] md:min-h-[310px] lg:min-h-[339px] flex flex-col hover:-translate-y-1 hover:shadow-[0px_8px_30px_0px_rgba(9,45,116,0.3)] transition-all duration-300"
              >
                <div className="bg-white rounded-[6px] w-[68px] md:w-[75px] lg:w-[82px] h-[64px] md:h-[70px] lg:h-[78px] flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={servizio.icon}
                    alt=""
                    className="w-[44px] md:w-[50px] lg:w-[56px] h-[44px] md:h-[50px] lg:h-[56px]"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-[20px] md:text-[22px] lg:text-[24px] font-medium text-white tracking-[-0.8px] lg:tracking-[-1.2px] mt-auto">
                  {servizio.title}
                </h3>
                <p className="text-[14px] md:text-[15px] lg:text-[16px] text-white/85 tracking-[-0.5px] mt-2 lg:mt-3 leading-relaxed">
                  {servizio.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== TESTIMONIALS ===== */}
        <section className="text-center mt-[80px] md:mt-[120px] lg:mt-[160px] px-4">
          <h2 className="text-[26px] md:text-[30px] lg:text-[32px] tracking-[-1.5px] md:tracking-[-2px] text-black">
            Cosa dicono i nostri <strong>clienti</strong>
          </h2>
          <p className="text-[15px] md:text-[16px] text-black mt-2 lg:mt-3 tracking-[-0.5px] lg:tracking-[-1.2px]">
            Trent&apos;anni di fiducia, raccontati da chi ci ha scelto.
          </p>
        </section>

        <section className="flex flex-col md:flex-row gap-5 md:gap-6 mt-8 w-full">
          <div className="flex-1 rounded-[18px] md:rounded-[20px] lg:rounded-[24px] border border-blue-border px-7 md:px-10 py-8 md:py-10 flex flex-col items-center gap-6 hover:shadow-[0px_4px_20px_0px_rgba(10,47,120,0.1)] hover:-translate-y-1 transition-all duration-300">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/virgolette.svg"
              alt=""
              className="w-[48px] h-[48px]"
              aria-hidden="true"
            />
            <div className="text-center text-black">
              <p className="text-[15px] md:text-[16px] leading-relaxed">
                &ldquo;Dal primo contatto ho capito di essere nelle mani
                giuste. Stefano mi ha seguito in ogni fase
                dell&apos;acquisto con affidabilità e disponibilità
                costante. Lo consiglio a chiunque, soprattutto a chi compra
                casa per la prima volta.&rdquo;
              </p>
              <p className="text-[17px] md:text-[18px] font-bold tracking-[-0.8px] mt-3 lg:mt-4">
                Francesco L.
              </p>
            </div>
          </div>

          <div className="flex-1 rounded-[18px] md:rounded-[20px] lg:rounded-[24px] border border-blue-border px-7 md:px-10 py-8 md:py-10 flex flex-col items-center gap-6 hover:shadow-[0px_4px_20px_0px_rgba(10,47,120,0.1)] hover:-translate-y-1 transition-all duration-300">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/virgolette.svg"
              alt=""
              className="w-[48px] h-[48px]"
              aria-hidden="true"
            />
            <div className="text-center text-black">
              <p className="text-[15px] md:text-[16px] leading-relaxed">
                &ldquo;Avevo bisogno di vendere un appartamento in tempi
                rapidi. Studio Tara ha gestito tutto con professionalità,
                trovando l&apos;acquirente giusto in meno di un mese.
                Esperienza eccellente dall&apos;inizio alla fine.&rdquo;
              </p>
              <p className="text-[17px] md:text-[18px] font-bold tracking-[-0.8px] mt-3 lg:mt-4">
                Maria G.
              </p>
            </div>
          </div>
        </section>

        {/* ===== NEWSLETTER ===== */}
        <section className="w-full rounded-[20px] md:rounded-[24px] lg:rounded-[28px] bg-gradient-to-b from-blue-primary to-blue-secondary overflow-hidden mt-[80px] md:mt-[120px] lg:mt-[160px] mb-[40px] md:mb-[50px] lg:mb-[60px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.25)] text-white text-center py-12 md:py-16 px-6">
          <h2 className="text-[26px] md:text-[30px] lg:text-[32px] tracking-[-1.5px] md:tracking-[-2px]">
            Resta aggiornato sul <strong>mercato immobiliare</strong>
          </h2>
          <p className="text-[15px] md:text-[16px] mt-4 max-w-[634px] mx-auto leading-relaxed text-white/85">
            Iscriviti alla newsletter di Studiotara: notizie, consigli
            pratici e aggiornamenti del settore una volta al mese, senza
            spam.
          </p>
          <form className="flex flex-col md:flex-row gap-4 md:gap-[25px] items-center justify-center mt-8 lg:mt-10">
            <input
              type="email"
              placeholder="La tua email"
              className="w-full md:w-[400px] lg:w-[460px] h-[44px] rounded-[6px] px-5 text-[15px] md:text-[16px] text-black bg-white outline-none focus:shadow-[0_0_0_3px_rgba(210,7,42,0.3)] transition-all"
            />
            <button
              type="submit"
              className="w-full md:w-auto bg-red-primary text-white text-[15px] md:text-[16px] font-medium px-8 md:px-10 py-[11px] rounded-[6px] hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer"
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
