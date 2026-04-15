import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { articles } from "@/data/articles";

export default function Blog() {
  return (
    <>
      <Navbar />

      <main className="flex flex-col items-center overflow-x-hidden max-w-[1440px] mx-auto w-full px-5 md:px-10 lg:px-[50px]">
        {/* ===== HERO SECTION ===== */}
        <div className="relative w-full mt-3">
          {/* Character - right side, outside section for overflow */}
          <div className="hidden md:block absolute right-[40px] lg:right-[80px] top-[10px] w-[180px] lg:w-[282px] h-[380px] lg:h-[511px] z-10">
            <Image
              src="/images/personaggino_blog.png"
              alt="Studio Tara blog"
              fill
              className="object-contain object-bottom"
            />
          </div>

          <section className="relative w-full rounded-[20px] md:rounded-[24px] lg:rounded-[28px] bg-gradient-to-b from-blue-primary to-blue-secondary overflow-hidden min-h-[320px] md:min-h-[380px] lg:min-h-[430px]">
            {/* Red decorative swoosh - right side */}
            <div className="absolute -right-[8%] bottom-[30px] w-[300px] h-[300px] md:w-[360px] md:h-[360px] lg:w-[400px] lg:h-[400px] -rotate-[65deg]">
              <Image
                src="/images/vector-decoration.svg"
                alt=""
                width={400}
                height={400}
                aria-hidden="true"
              />
            </div>

            {/* Text - left side */}
            <div className="relative px-6 py-8 md:absolute md:left-[50px] lg:left-[78px] md:top-1/2 md:-translate-y-1/2 md:w-[420px] lg:w-[604px]">
              <h1 className="text-[28px] md:text-[32px] lg:text-[36px] tracking-[-1.5px] md:tracking-[-2px] text-white leading-tight">
                Notizie e consigli dal
                <br />
                mondo <strong>immobiliare</strong>
              </h1>
              <p className="text-[15px] md:text-[16px] lg:text-[17px] text-white/90 mt-4 lg:mt-5 leading-relaxed">
                Aggiornamenti sul mercato, guide pratiche e tutto quello che
                devi sapere prima di comprare, vendere o affittare casa
                nell&apos;area di Milano.
              </p>
              <Link
                href="#articoli"
                className="inline-block mt-6 bg-red-primary text-white text-[16px] md:text-[17px] font-medium px-8 md:px-10 py-[10px] md:py-[11px] rounded-[6px] hover:scale-105 hover:shadow-lg transition-all duration-300"
              >
                Leggi il nostro blog
              </Link>
            </div>
          </section>
        </div>

        {/* ===== ARTICLE GRID ===== */}
        <section
          id="articoli"
          className="w-full mt-[80px] md:mt-[120px] lg:mt-[160px]"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="group bg-[#f5f3f0] rounded-[16px] md:rounded-[18px] lg:rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] overflow-hidden hover:-translate-y-1 hover:shadow-[0px_8px_30px_0px_rgba(0,0,0,0.15)] transition-all duration-300 flex flex-col"
              >
                {/* Image */}
                <div className="w-full h-[180px] md:h-[190px] lg:h-[198px] overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    width={408}
                    height={198}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="p-5 lg:p-[19px] flex flex-col flex-1">
                  <h2 className="text-[18px] md:text-[20px] lg:text-[22px] font-medium text-black tracking-[-0.8px] lg:tracking-[-1.32px] leading-tight">
                    {article.title}
                  </h2>
                  <p className="text-[14px] md:text-[15px] lg:text-[16px] text-black/80 tracking-[-0.5px] lg:tracking-[-1.08px] mt-3 leading-relaxed line-clamp-4">
                    {article.excerpt}
                  </p>
                  <p className="text-[15px] md:text-[16px] text-red-primary underline mt-auto pt-4 tracking-[-0.5px] lg:tracking-[-1.08px]">
                    Leggi di più
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ===== TESTIMONIALS ===== */}
        <section className="text-center mt-[80px] md:mt-[120px] lg:mt-[160px] px-4">
          <h2 className="text-[26px] md:text-[30px] lg:text-[32px] tracking-[-1.5px] md:tracking-[-2px] text-black">
            Cosa dicono i nostri <strong>clienti</strong>
          </h2>
          <p className="text-[15px] md:text-[16px] text-black mt-2 tracking-[-0.5px]">
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
              <p className="text-[17px] md:text-[18px] font-bold tracking-[-0.8px] mt-3">
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
              <p className="text-[17px] md:text-[18px] font-bold tracking-[-0.8px] mt-3">
                Maria G.
              </p>
            </div>
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
