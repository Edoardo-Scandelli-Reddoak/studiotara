"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const faqs = [
  { q: "La valutazione è davvero gratuita e senza impegno?", a: "Sì, la valutazione è completamente gratuita e non comporta nessun obbligo. Ricevi una stima professionale basata sui dati reali del mercato locale, senza dover firmare alcun mandato." },
  { q: "Perché dovrei affidare il mio immobile alla vostra agenzia?", a: "Perché conosciamo il territorio come nessun altro. Con oltre 30 anni di esperienza e una banca dati di 6.000+ contatti attivi, possiamo trovare l'acquirente giusto in tempi rapidi e al miglior prezzo di mercato." },
  { q: "Quanto tempo ci vuole per vendere un immobile?", a: "Dipende dalla tipologia e dalla zona, ma grazie alla nostra rete di contatti e alle strategie di marketing mirate, i tempi medi di vendita sono significativamente inferiori rispetto alla media di mercato." },
  { q: "Cosa succede dopo la proposta d'acquisto?", a: "Ti accompagniamo in ogni fase: dalla negoziazione alla firma del preliminare, fino al rogito notarile. Ci occupiamo anche del coordinamento con notai, tecnici e istituti di credito." },
  { q: "Quanto mi costerà la vostra consulenza?", a: "La consulenza iniziale e la valutazione sono gratuite. La provvigione viene applicata solo in caso di vendita conclusa con successo, secondo le condizioni concordate in fase di mandato." },
  { q: "Posso vendere e comprare allo stesso tempo?", a: "Assolutamente sì. È una delle nostre specialità. Coordiniamo i tempi di vendita e acquisto per garantirti una transizione serena, senza il rischio di restare senza casa o di dover sostenere doppie spese." },
];

function PhoneIcon() {
  return (
    <div className="w-[44px] md:w-[48px] lg:w-[52px] h-[42px] md:h-[45px] lg:h-[49px] rounded-[8px] bg-red-primary flex items-center justify-center shrink-0">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    </div>
  );
}

function EmailIcon() {
  return (
    <div className="w-[44px] md:w-[48px] lg:w-[52px] h-[42px] md:h-[45px] lg:h-[49px] rounded-[8px] bg-red-primary flex items-center justify-center shrink-0">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    </div>
  );
}

function LocationIcon() {
  return (
    <div className="w-[44px] md:w-[48px] lg:w-[52px] h-[42px] md:h-[45px] lg:h-[49px] rounded-[8px] bg-red-primary flex items-center justify-center shrink-0">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    </div>
  );
}

function ClockIcon() {
  return (
    <div className="w-[44px] md:w-[48px] lg:w-[52px] h-[42px] md:h-[45px] lg:h-[49px] rounded-[8px] bg-red-primary flex items-center justify-center shrink-0">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    </div>
  );
}

export default function Contatti() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <Navbar />

      <main className="flex flex-col items-center overflow-x-hidden max-w-[1440px] mx-auto w-full px-5 md:px-10 lg:px-[50px]">
        {/* ===== HERO SECTION ===== */}
        <div className="relative w-full mt-3">
          {/* Character - outside section for overflow */}
          <div className="hidden md:block absolute left-[40px] lg:left-[80px] top-[10px] w-[160px] lg:w-[203px] h-[380px] lg:h-[503px] z-10">
            <Image
              src="/images/personaggino-contatti.png"
              alt="Studio Tara consulente"
              fill
              className="object-contain object-bottom"
            />
          </div>

          <section className="relative w-full rounded-[20px] md:rounded-[24px] lg:rounded-[28px] bg-gradient-to-b from-blue-primary to-blue-secondary overflow-hidden min-h-[320px] md:min-h-[380px] lg:min-h-[430px]">
            {/* Red decorative swoosh */}
            <div className="absolute -left-[8%] bottom-[50px] w-[300px] h-[300px] md:w-[360px] md:h-[360px] lg:w-[400px] lg:h-[400px] -rotate-[67deg]">
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
                Parlaci del tuo
                <br />
                progetto <strong>immobiliare</strong>
              </h1>
              <p className="text-[15px] md:text-[16px] lg:text-[17px] text-white/90 mt-4 lg:mt-5 leading-relaxed">
                Che tu voglia vendere, acquistare o affittare, il primo passo
                è una chiacchierata. Contattaci senza impegno: ti
                ricontattiamo noi nel minor tempo possibile.
              </p>
              <Link
                href="#contatto"
                className="inline-block mt-6 bg-red-primary text-white text-[16px] md:text-[17px] font-medium px-8 md:px-10 py-[10px] md:py-[11px] rounded-[6px] hover:scale-105 hover:shadow-lg transition-all duration-300"
              >
                Contattaci adesso!
              </Link>
            </div>
          </section>
        </div>

        {/* ===== TROVACI, CHIAMACI O SCRIVICI ===== */}
        <section
          id="contatto"
          className="w-full mt-[80px] md:mt-[120px] lg:mt-[160px] flex flex-col lg:flex-row gap-10 lg:gap-[81px] items-start"
        >
          {/* Left - contact info */}
          <div className="flex flex-col gap-6 lg:gap-[34px] lg:w-[602px] shrink-0">
            <h2 className="text-[26px] md:text-[30px] lg:text-[32px] tracking-[-1.5px] md:tracking-[-2px] text-black leading-tight">
              Trovaci, chiamaci o <strong>scrivici</strong>
            </h2>
            <p className="text-[15px] md:text-[16px] text-black leading-relaxed">
              Il nostro studio è a Buccinasco, a pochi minuti da Assago e
              Corsico. Puoi venire a trovarci di persona, chiamarci o
              mandarci un messaggio: risponderemo al più presto.
            </p>

            {/* Contact details */}
            <div className="flex flex-col gap-6 lg:gap-[35px]">
              <div className="flex gap-5 lg:gap-[35px] items-center">
                <PhoneIcon />
                <p className="text-[16px] md:text-[17px] lg:text-[18px] text-black">
                  339 3333333
                </p>
              </div>
              <div className="flex gap-5 lg:gap-[35px] items-center">
                <EmailIcon />
                <p className="text-[16px] md:text-[17px] lg:text-[18px] text-black">
                  nome@mail.com
                </p>
              </div>
              <div className="flex gap-5 lg:gap-[35px] items-center">
                <LocationIcon />
                <p className="text-[16px] md:text-[17px] lg:text-[18px] text-black">
                  Viale Lomellina, 23 — Buccinasco (MI)
                </p>
              </div>
              <div className="flex gap-5 lg:gap-[35px] items-start">
                <ClockIcon />
                <div className="text-[16px] md:text-[17px] lg:text-[18px] text-black leading-relaxed">
                  <p>Lun - Ven: 9:00 – 13:00 / 14:30 – 18:30</p>
                  <p>Sab: 9:00 – 12:30</p>
                  <p>Dom: Chiuso</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - contact form */}
          <div className="w-full lg:w-[620px] shrink-0 bg-gradient-to-b from-blue-primary to-blue-secondary rounded-[16px] md:rounded-[18px] lg:rounded-[20px] p-6 md:p-10 lg:p-[54px]">
            <form className="flex flex-col gap-5 lg:gap-[32px]">
              <div className="flex flex-col md:flex-row gap-5 lg:gap-[28px]">
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-[13px] text-white/70 font-medium ml-1">Nome</label>
                  <input
                    type="text"
                    placeholder="Es. Mario"
                    className="h-[48px] md:h-[54px] lg:h-[59px] bg-white rounded-[6px] px-4 text-[14px] md:text-[15px] outline-none focus:shadow-[0_0_0_3px_rgba(210,7,42,0.3)] transition-all"
                  />
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-[13px] text-white/70 font-medium ml-1">Cognome</label>
                  <input
                    type="text"
                    placeholder="Es. Rossi"
                    className="h-[48px] md:h-[54px] lg:h-[59px] bg-white rounded-[6px] px-4 text-[14px] md:text-[15px] outline-none focus:shadow-[0_0_0_3px_rgba(210,7,42,0.3)] transition-all"
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-5 lg:gap-[28px]">
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-[13px] text-white/70 font-medium ml-1">Email</label>
                  <input
                    type="email"
                    placeholder="Es. mario.rossi@email.com"
                    className="h-[48px] md:h-[54px] lg:h-[59px] bg-white rounded-[6px] px-4 text-[14px] md:text-[15px] outline-none focus:shadow-[0_0_0_3px_rgba(210,7,42,0.3)] transition-all"
                  />
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-[13px] text-white/70 font-medium ml-1">Telefono</label>
                  <input
                    type="tel"
                    placeholder="Es. 339 1234567"
                    className="h-[48px] md:h-[54px] lg:h-[59px] bg-white rounded-[6px] px-4 text-[14px] md:text-[15px] outline-none focus:shadow-[0_0_0_3px_rgba(210,7,42,0.3)] transition-all"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] text-white/70 font-medium ml-1">Messaggio</label>
                <textarea
                  placeholder="Es. Vorrei vendere il mio appartamento a Buccinasco..."
                  rows={4}
                  className="w-full min-h-[90px] md:min-h-[100px] lg:min-h-[112px] bg-white rounded-[6px] px-4 py-3 text-[14px] md:text-[15px] outline-none resize-none focus:shadow-[0_0_0_3px_rgba(210,7,42,0.3)] transition-all"
                />
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-red-primary text-white text-[16px] md:text-[17px] font-medium px-8 md:px-10 py-[10px] md:py-[11px] rounded-[6px] hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  Contattaci adesso!
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* ===== DOVE TROVARCI ===== */}
        <section className="w-full mt-[80px] md:mt-[120px] lg:mt-[160px] bg-[#f5f3f0] rounded-[20px] md:rounded-[24px] lg:rounded-[28px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.25)] px-6 md:px-10 lg:px-[47px] py-10 md:py-14 lg:py-[78px]">
          <div className="text-center">
            <h2 className="text-[26px] md:text-[30px] lg:text-[32px] tracking-[-1.5px] md:tracking-[-2px] text-black">
              Dove <strong>trovarci</strong>
            </h2>
            <p className="text-[15px] md:text-[16px] text-black mt-3 leading-relaxed">
              Viale Lomellina, 23 — 20090 Buccinasco (MI)
            </p>
          </div>

          <div className="mt-8 md:mt-10 lg:mt-[51px] rounded-[10px] md:rounded-[12px] lg:rounded-[14px] overflow-hidden border border-black/20 h-[250px] md:h-[300px] lg:h-[321px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2801.5!2d9.1!3d45.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDXCsDI0JzAwLjAiTiA5wrAwNicwMC4wIkU!5e0!3m2!1sit!2sit!4v1"
              title="Posizione Studio Tara"
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
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
