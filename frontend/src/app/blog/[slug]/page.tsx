import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { articles } from "@/data/articles";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <>
      <Navbar />

      <main className="flex flex-col items-center overflow-x-hidden max-w-[1440px] mx-auto w-full px-5 md:px-10 lg:px-[50px]">
        {/* ===== HERO IMAGE ===== */}
        <div className="w-full mt-3 rounded-[20px] md:rounded-[24px] lg:rounded-[28px] overflow-hidden h-[220px] md:h-[320px] lg:h-[400px]">
          <Image
            src={article.image}
            alt={article.title}
            width={1340}
            height={400}
            className="w-full h-full object-cover"
            priority
          />
        </div>

        {/* ===== ARTICLE CONTENT ===== */}
        <article className="w-full max-w-[800px] mx-auto mt-10 md:mt-14 lg:mt-16">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[14px] md:text-[15px] text-blue-primary hover:text-blue-secondary transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Torna al blog
          </Link>

          {/* Date */}
          <p className="text-[14px] md:text-[15px] text-black/50 mt-6">
            {article.date}
          </p>

          {/* Title */}
          <h1 className="text-[28px] md:text-[32px] lg:text-[36px] tracking-[-1.5px] md:tracking-[-2px] text-black leading-tight mt-3">
            {article.title}
          </h1>

          {/* Excerpt */}
          <p className="text-[16px] md:text-[17px] text-black/70 mt-4 leading-relaxed">
            {article.excerpt}
          </p>

          {/* Divider */}
          <div className="w-full h-[2px] bg-black/10 rounded-full mt-8" />

          {/* Body */}
          <div
            className="mt-8 prose-studiotara"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* CTA */}
          <div className="mt-12 md:mt-16 bg-gradient-to-b from-blue-primary to-blue-secondary rounded-[16px] md:rounded-[20px] p-8 md:p-12 text-center text-white">
            <h2 className="text-[22px] md:text-[26px] lg:text-[28px] tracking-[-1px] md:tracking-[-1.5px]">
              Hai bisogno di una <strong>consulenza?</strong>
            </h2>
            <p className="text-[15px] md:text-[16px] text-white/85 mt-3 max-w-[480px] mx-auto leading-relaxed">
              Il nostro team è a tua disposizione per rispondere a qualsiasi
              domanda sul mercato immobiliare.
            </p>
            <Link
              href="/contatti"
              className="inline-block mt-6 bg-red-primary text-white text-[16px] md:text-[17px] font-medium px-8 md:px-10 py-[10px] md:py-[11px] rounded-[6px] hover:scale-105 hover:shadow-lg transition-all duration-300"
            >
              Contattaci
            </Link>
          </div>
        </article>

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
