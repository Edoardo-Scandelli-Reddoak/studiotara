"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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

const stats = [
  { value: "1.850", label: "Potenziali acquirenti annui nella nostra banca dati" },
  { value: "650", label: "Valutazioni effettuate ogni anno" },
  { value: "30", label: "Anni di esperienza sul territorio" },
  { value: "6.000", label: "Contatti annui attivi nel nostro archivio" },
];

const steps = [
  { num: "01", title: "Compili il form", text: "Inserisci le caratteristiche principali del tuo immobile. Ci vuole meno di tre minuti." },
  { num: "02", title: "Ti richiamiamo noi", text: "Uno dei nostri esperti ti contatta entro 24 ore per approfondire alcuni dettagli." },
  { num: "03", title: "Analizziamo il mercato", text: "Incrociamo i dati del tuo immobile con le compravendite reali della zona per una stima precisa." },
  { num: "04", title: "Ricevi la stima", text: "Ti consegniamo una valutazione dettagliata, gratuita e senza nessun obbligo di affidarci il mandato." },
];

const cards = [
  {
    icon: "/icons/3d-house.svg",
    title: "Vuoi vendere il tuo immobile",
    description:
      "Vendere casa non è un'attività di routine. Farlo senza esperienza e senza conoscere il mercato locale porta quasi sempre a svendere o ad aspettare troppo. Valutiamo il tuo immobile, costruiamo la strategia giusta e troviamo il compratore al prezzo che meriti.",
  },
  {
    icon: "/icons/cashflow.svg",
    title: "Vendi e compri nello stesso momento",
    description:
      "Gestire vendita e acquisto in parallelo è tra le situazioni più complesse nel mondo immobiliare. Coordiniamo i tempi di entrambe le operazioni per farti vivere il cambio casa nel modo più sereno possibile, senza il rischio di restare scoperti.",
  },
  {
    icon: "/icons/lightning.svg",
    title: "Hai bisogno di vendere in fretta",
    description:
      "Se hai necessità di liquidità rapida o vuoi accelerare i tempi per un nuovo acquisto, Studiotara può valutare l'acquisto diretto del tuo immobile. Un servizio su misura che elimina l'incertezza dei tempi di mercato.",
  },
];

const faqs = [
  { q: "La valutazione è davvero gratuita e senza impegno?", a: "Sì, la valutazione è completamente gratuita e non comporta nessun obbligo. Ricevi una stima professionale basata sui dati reali del mercato locale, senza dover firmare alcun mandato." },
  { q: "Perché dovrei affidarmi il mio immobile alla vostra agenzia?", a: "Perché conosciamo il territorio come nessun altro. Con oltre 30 anni di esperienza e una banca dati di 6.000+ contatti attivi, possiamo trovare l'acquirente giusto in tempi rapidi e al miglior prezzo di mercato." },
  { q: "Quanto tempo ci vuole per vendere un immobile?", a: "Dipende dalla tipologia e dalla zona, ma grazie alla nostra rete di contatti e alle strategie di marketing mirate, i tempi medi di vendita sono significativamente inferiori rispetto alla media di mercato." },
  { q: "Cosa succede dopo la proposta di acquisto?", a: "Ti accompagniamo in ogni fase: dalla negoziazione alla firma del preliminare, fino al rogito notarile. Ci occupiamo anche del coordinamento con notai, tecnici e istituti di credito." },
  { q: "Quanto mi costerebbe la vostra consulenza?", a: "La consulenza iniziale e la valutazione sono gratuite. La provvigione viene applicata solo in caso di vendita conclusa con successo, secondo le condizioni concordate in fase di mandato." },
  { q: "Posso vendere e comprare allo stesso tempo?", a: "Assolutamente sì. È una delle nostre specialità. Coordiniamo i tempi di vendita e acquisto per garantirti una transizione serena, senza il rischio di restare senza casa o di dover sostenere doppie spese." },
];

export default function VendiImmobile() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <Navbar />

      <main className="flex flex-col items-center overflow-x-hidden max-w-[1440px] mx-auto w-full px-5 md:px-10 lg:px-[50px]">
        {/* ===== HERO SECTION ===== */}
        <div className="relative w-full mt-3">
          {/* Characters illustration - outside section so it overflows */}
          <div className="hidden md:block absolute left-[20px] lg:left-[40px] top-[10px] w-[260px] lg:w-[386px] h-[380px] lg:h-[530px] z-10">
            <Image
              src="/images/personaggi_vendi_immobile.png"
              alt="Studio Tara consulenti"
              fill
              className="object-contain object-bottom"
            />
          </div>

        <section className="relative w-full rounded-[20px] md:rounded-[24px] lg:rounded-[28px] bg-gradient-to-b from-blue-primary to-blue-secondary overflow-hidden min-h-[320px] md:min-h-[380px] lg:min-h-[430px]">
          {/* Red decorative swoosh */}
          <div className="absolute -left-[8%] bottom-[50px] w-[300px] h-[300px] md:w-[360px] md:h-[360px] lg:w-[400px] lg:h-[400px] -rotate-[25deg]">
            <Image
              src="/images/vector-decoration.svg"
              alt=""
              width={400}
              height={400}
              aria-hidden="true"
            />
          </div>

          {/* Text */}
          <div className="relative px-6 py-8 md:absolute md:left-[320px] lg:left-[500px] md:top-1/2 md:-translate-y-1/2 md:w-[380px] lg:w-[580px]">
            <h1 className="text-[28px] md:text-[32px] lg:text-[36px] tracking-[-1.5px] md:tracking-[-2px] text-white leading-tight">
              Scopri subito quanto vale il{" "}
              <strong>tuo immobile!</strong>
            </h1>
            <p className="text-[15px] md:text-[16px] lg:text-[17px] text-white/90 mt-4 lg:mt-5 leading-relaxed">
              Scoprilo in pochi minuti. I nostri esperti analizzano il tuo
              immobile sulla base dei dati reali del mercato locale e ti
              ricontattano entro 24 ore, senza impegno.
            </p>
            <Link
              href="#valutazione"
              className="inline-block mt-6 bg-red-primary text-white text-[16px] md:text-[17px] font-medium px-8 md:px-10 py-[10px] md:py-[11px] rounded-[6px] hover:scale-105 hover:shadow-lg transition-all duration-300"
            >
              Valuta ora il tuo immobile!
            </Link>
          </div>
        </section>
        </div>

        {/* ===== VALUATION FORM ===== */}
        <section
          id="valutazione"
          className="relative w-full max-w-[860px] mt-[24px] z-10 bg-white border-[6px] md:border-[8px] lg:border-[10px] border-blue-accent rounded-[12px] md:rounded-[14px] lg:rounded-[16px] shadow-[0px_0px_10.8px_0px_rgba(0,0,0,0.25)] px-5 md:px-12 lg:px-16 py-6 md:py-8 mx-auto"
        >
          <h2 className="text-[22px] md:text-[26px] lg:text-[30px] tracking-[-1px] md:tracking-[-1.5px] text-black text-center">
            Richiedi la tua <strong>valutazione gratuita</strong>
          </h2>
          <form className="flex flex-col gap-4 md:gap-5 mt-5 md:mt-6 max-w-[604px] mx-auto">
            <div className="flex flex-col md:flex-row gap-4 md:gap-5">
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-[13px] text-black/60 font-medium ml-1">Tipologia</label>
                <select
                  className="h-[42px] md:h-[47px] border-[2.5px] md:border-[3px] border-blue-primary rounded-[6px] px-3 text-[14px] outline-none bg-white focus:border-blue-secondary focus:shadow-[0_0_0_3px_rgba(17,85,218,0.15)] transition-all appearance-none cursor-pointer"
                  defaultValue=""
                >
                  <option value="" disabled>Seleziona tipologia...</option>
                  {tipologie.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-[13px] text-black/60 font-medium ml-1">Provincia</label>
                <input
                  type="text"
                  placeholder="Es. Milano"
                  className="h-[42px] md:h-[47px] border-[2.5px] md:border-[3px] border-blue-primary rounded-[6px] px-3 text-[14px] outline-none focus:border-blue-secondary focus:shadow-[0_0_0_3px_rgba(17,85,218,0.15)] transition-all"
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-5">
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-[13px] text-black/60 font-medium ml-1">Comune</label>
                <input
                  type="text"
                  placeholder="Es. Buccinasco"
                  className="h-[42px] md:h-[47px] border-[2.5px] md:border-[3px] border-blue-primary rounded-[6px] px-3 text-[14px] outline-none focus:border-blue-secondary focus:shadow-[0_0_0_3px_rgba(17,85,218,0.15)] transition-all"
                />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-[13px] text-black/60 font-medium ml-1">Indirizzo</label>
                <input
                  type="text"
                  placeholder="Es. Via Roma 2"
                  className="h-[42px] md:h-[47px] border-[2.5px] md:border-[3px] border-blue-primary rounded-[6px] px-3 text-[14px] outline-none focus:border-blue-secondary focus:shadow-[0_0_0_3px_rgba(17,85,218,0.15)] transition-all"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-red-primary text-white text-[16px] md:text-[17px] font-medium py-[11px] rounded-[6px] hover:scale-[1.02] hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              Valuta ora
            </button>
          </form>
        </section>

        {/* ===== VALUTAZIONE DA CHI CONOSCE LA ZONA ===== */}
        <section className="w-full mt-[80px] md:mt-[120px] lg:mt-[160px] flex flex-col lg:flex-row gap-10 lg:gap-[81px] items-start">
          {/* Left text */}
          <div className="flex flex-col gap-6 lg:gap-[34px] lg:w-[645px] shrink-0">
            <h2 className="text-[26px] md:text-[30px] lg:text-[32px] tracking-[-1.5px] md:tracking-[-2px] text-black leading-tight">
              Una valutazione fatta{" "}
              <strong>da chi conosce la zona</strong>
            </h2>
            <div className="text-[15px] md:text-[16px] text-black leading-relaxed flex flex-col gap-5">
              <p>
                Ci sono tanti strumenti online che stimano il valore di un
                immobile in automatico. Noi facciamo qualcosa di diverso:
                mettiamo la nostra conoscenza diretta del mercato locale,
                costruita in trent&apos;anni di attività a Buccinasco e
                nell&apos;hinterland milanese, al servizio di chi vuole una
                risposta vera.
              </p>
              <p>
                Non si tratta di un algoritmo. Si tratta di professionisti
                che conoscono ogni via, ogni tipo edilizio e ogni dinamica di
                quartiere, che valutano il tuo immobile come valuterebbero
                quello di un familiare.
              </p>
            </div>
          </div>

          {/* Right stats + CTA */}
          <div className="flex flex-col gap-6 lg:gap-8 items-center w-full lg:w-auto">
            <div className="grid grid-cols-2 gap-5 lg:gap-[22px] w-full lg:w-[552px]">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-b from-blue-primary to-blue-secondary rounded-[12px] md:rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] p-5 lg:p-[23px] min-h-[110px] lg:min-h-[136px]"
                >
                  <p className="text-[24px] md:text-[28px] lg:text-[32px] font-bold text-white leading-none">
                    {stat.value}
                    <span className="text-red-primary">+</span>
                  </p>
                  <p className="text-[13px] md:text-[14px] lg:text-[16px] text-white tracking-[-0.5px] lg:tracking-[-0.96px] mt-3 leading-snug">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
            <Link
              href="#valutazione"
              className="inline-block bg-red-primary text-white text-[16px] md:text-[17px] font-medium px-8 md:px-10 py-[10px] md:py-[11px] rounded-[6px] hover:scale-105 hover:shadow-lg transition-all duration-300"
            >
              Valuta il tuo immobile
            </Link>
          </div>
        </section>

        {/* ===== QUATTRO PASSI ===== */}
        <section className="w-full mt-[80px] md:mt-[120px] lg:mt-[160px] bg-[#f5f3f0] rounded-[20px] md:rounded-[24px] lg:rounded-[28px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.25)] px-6 md:px-10 lg:px-[84px] py-10 md:py-14 lg:py-[78px]">
          <div className="text-center">
            <h2 className="text-[26px] md:text-[30px] lg:text-[32px] tracking-[-1.5px] md:tracking-[-2px] text-black">
              Quattro passi verso il <strong>valore reale</strong>
            </h2>
            <p className="text-[15px] md:text-[16px] text-black mt-3 max-w-[688px] mx-auto leading-relaxed">
              Dalla compilazione del form al valore stimato del tuo immobile,
              il processo è semplice e non richiede nessun impegno da parte
              tua.
            </p>
          </div>

          {/* Steps */}
          <div className="relative mt-10 md:mt-14 lg:mt-[90px]">
            {/* Connecting line - desktop only */}
            <div className="hidden lg:block absolute top-[50px] left-[50px] right-[50px] h-[3px] bg-blue-primary/30 rounded-full" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-[47px]">
              {steps.map((step) => (
                <div key={step.num} className="flex flex-col items-center text-center gap-5 lg:gap-6">
                  {/* Number circle */}
                  <div className="relative z-10 w-[70px] md:w-[85px] lg:w-[100px] h-[70px] md:h-[85px] lg:h-[100px] rounded-full bg-gradient-to-b from-blue-primary to-blue-secondary flex items-center justify-center shadow-md">
                    <span className="text-[28px] md:text-[34px] lg:text-[40px] font-bold text-white">
                      {step.num}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-[16px] md:text-[18px] font-semibold text-black">
                      {step.title}
                    </p>
                    <p className="text-[14px] md:text-[15px] lg:text-[16px] text-black leading-relaxed">
                      {step.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== COME POSSIAMO AIUTARTI ===== */}
        <section className="w-full mt-[80px] md:mt-[120px] lg:mt-[160px]">
          <div className="text-center">
            <h2 className="text-[26px] md:text-[30px] lg:text-[32px] tracking-[-1.5px] md:tracking-[-2px] text-black">
              Come possiamo <strong>aiutarti</strong>
            </h2>
            <p className="text-[15px] md:text-[16px] text-black mt-3 max-w-[506px] mx-auto leading-relaxed tracking-[-0.5px]">
              Ogni situazione è diversa. Ecco come lavoriamo in base alle tue
              esigenze specifiche.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10 mt-10 md:mt-12">
            {cards.map((card, i) => (
              <div
                key={i}
                className="bg-gradient-to-b from-blue-primary to-blue-secondary rounded-[16px] md:rounded-[18px] lg:rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] p-6 md:p-7 lg:p-[29px] min-h-[320px] md:min-h-[370px] lg:min-h-[405px] flex flex-col hover:-translate-y-1 hover:shadow-[0px_8px_30px_0px_rgba(9,45,116,0.3)] transition-all duration-300"
              >
                <div className="bg-white rounded-[6px] w-[68px] md:w-[75px] lg:w-[82px] h-[64px] md:h-[70px] lg:h-[78px] flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.icon}
                    alt=""
                    className="w-[44px] md:w-[50px] lg:w-[56px] h-[44px] md:h-[50px] lg:h-[56px]"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-[20px] md:text-[22px] lg:text-[24px] font-medium text-white tracking-[-0.8px] lg:tracking-[-1.2px] mt-5 lg:mt-6">
                  {card.title}
                </h3>
                <p className="text-[14px] md:text-[15px] lg:text-[16px] text-white/85 tracking-[-0.5px] mt-2 lg:mt-3 leading-relaxed">
                  {card.description}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-8 md:mt-10">
            <Link
              href="/contatti"
              className="inline-block bg-red-primary text-white text-[16px] md:text-[17px] font-medium px-8 md:px-10 py-[10px] md:py-[11px] rounded-[6px] hover:scale-105 hover:shadow-lg transition-all duration-300"
            >
              Richiedi una consulenza
            </Link>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section className="w-full mt-[80px] md:mt-[120px] lg:mt-[160px]">
          <div className="text-center">
            <h2 className="text-[26px] md:text-[30px] lg:text-[32px] tracking-[-1.5px] md:tracking-[-2px] text-black">
              Hai dei <strong>dubbi?</strong>
            </h2>
            <p className="text-[15px] md:text-[16px] text-black mt-3 max-w-[506px] mx-auto leading-relaxed tracking-[-0.5px]">
              Le domande che ci fanno più spesso. Se non trovi quello che
              cerchi, scrivici direttamente.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:gap-4 mt-8 md:mt-10 max-w-[900px] mx-auto">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-[#f0eeeb] rounded-[10px] md:rounded-[12px]">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 md:px-7 py-4 md:py-5 text-left cursor-pointer"
                >
                  <span className="text-[15px] md:text-[16px] font-medium text-black pr-4">
                    {faq.q}
                  </span>
                  <span
                    className={`w-[32px] h-[32px] md:w-[36px] md:h-[36px] rounded-full bg-blue-primary/10 flex items-center justify-center shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`}
                  >
                    <svg width="14" height="8" viewBox="0 0 14 8" fill="none" className="text-blue-primary">
                      <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${openFaq === i ? "max-h-[300px] pb-5" : "max-h-0"}`}
                >
                  <p className="text-[14px] md:text-[15px] text-black/70 leading-relaxed px-5 md:px-7">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== NEWSLETTER ===== */}
        <section className="w-full rounded-[20px] md:rounded-[24px] lg:rounded-[28px] bg-gradient-to-b from-blue-primary to-blue-secondary overflow-hidden mt-[80px] md:mt-[120px] lg:mt-[160px] mb-[40px] md:mb-[50px] lg:mb-[60px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.15)] text-white text-center py-12 md:py-16 px-6">
          <h2 className="text-[26px] md:text-[30px] lg:text-[32px] tracking-[-1.5px] md:tracking-[-2px]">
            Resta aggiornato sul <strong>mercato immobiliare</strong>
          </h2>
          <p className="text-[15px] md:text-[16px] mt-4 max-w-[520px] mx-auto leading-relaxed text-white/85">
            Iscriviti alla newsletter di Studiotara: notizie, consigli pratici
            e aggiornamenti del settore una volta al mese, senza spam.
          </p>
          <form className="flex flex-col md:flex-row gap-4 md:gap-5 items-center justify-center mt-8">
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
