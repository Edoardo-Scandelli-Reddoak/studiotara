import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getBlogArticle, getBlogArticles } from "@/lib/api";

export async function generateStaticParams() {
  const articles = await getBlogArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getBlogArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <>
      <Navbar />

      <main className="flex flex-col items-center overflow-x-hidden max-w-[1440px] mx-auto w-full px-5 md:px-10 lg:px-[50px]">
        {/* ===== HERO IMAGE ===== */}
        <div className="w-full mt-3 rounded-[20px] md:rounded-[24px] lg:rounded-[28px] overflow-hidden h-[220px] md:h-[320px] lg:h-[400px] bg-[#e8e6e3]">
          {article.immagine_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={article.immagine_url}
              alt={article.titolo}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <img
                src="/images/logo.svg"
                alt=""
                className="w-24 h-24 opacity-20"
              />
            </div>
          )}
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
          {article.data_pubblicazione && (
            <p className="text-[14px] md:text-[15px] text-black/50 mt-6">
              {formatDate(article.data_pubblicazione)}
            </p>
          )}

          {/* Title */}
          <h1 className="text-[28px] md:text-[32px] lg:text-[36px] tracking-[-1.5px] md:tracking-[-2px] text-black leading-tight mt-3">
            {article.titolo}
          </h1>

          {/* Excerpt */}
          {article.excerpt && (
            <p className="text-[16px] md:text-[17px] text-black/70 mt-4 leading-relaxed">
              {article.excerpt}
            </p>
          )}

          {/* Divider */}
          <div className="w-full h-[2px] bg-black/10 rounded-full mt-8" />

          {/* Body */}
          <div
            className="mt-8 prose-studiotara"
            dangerouslySetInnerHTML={{ __html: article.contenuto }}
          />

        </article>

        {/* ===== CTA ===== */}
        <section className="w-full rounded-[20px] md:rounded-[24px] lg:rounded-[28px] bg-gradient-to-b from-blue-primary to-blue-secondary overflow-hidden mt-[80px] md:mt-[120px] lg:mt-[160px] mb-[40px] md:mb-[50px] lg:mb-[60px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.15)] text-white text-center py-12 md:py-16 px-6">
          <h2 className="text-[26px] md:text-[30px] lg:text-[32px] tracking-[-1.5px] md:tracking-[-2px]">
            Hai bisogno di una <strong>consulenza?</strong>
          </h2>
          <p className="text-[15px] md:text-[16px] mt-4 max-w-[520px] mx-auto leading-relaxed text-white/85">
            Il nostro team è a tua disposizione per rispondere a qualsiasi
            domanda sul mercato immobiliare.
          </p>
          <Link
            href="/contatti"
            className="inline-block mt-8 bg-red-primary text-white text-[16px] md:text-[17px] font-medium px-8 md:px-10 py-[10px] md:py-[11px] rounded-[6px] hover:scale-105 hover:shadow-lg transition-all duration-300"
          >
            Contattaci
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}
