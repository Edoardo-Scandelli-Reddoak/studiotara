import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getBlogArticle, getBlogArticles } from "@/lib/api";

// Blog is edited live in admin — always render fresh, no static caching.
export const dynamic = 'force-dynamic';

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
}

/**
 * If the article body still uses plain newlines (no block-level tags),
 * split on blank lines to produce real paragraphs. Single newlines inside a
 * paragraph become <br>. Leaves real HTML (with <p>, <h2>, ...) untouched.
 */
function ensureParagraphs(html: string): string {
  if (!html) return '';
  if (/<(p|h[1-6]|ul|ol|div|blockquote|pre|table)\b/i.test(html)) return html;
  return html
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => `<p>${chunk.replace(/\n/g, '<br>')}</p>`)
    .join('');
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

      <main className="flex flex-col items-center overflow-x-hidden max-w-[1440px] mx-auto w-full px-4 md:px-10 lg:px-[50px]">
        {/* ===== HERO IMAGE ===== */}
        <div className="w-full mt-3 rounded-[14px] md:rounded-[24px] lg:rounded-[28px] overflow-hidden h-[180px] md:h-[320px] lg:h-[400px] bg-[#e8e6e3]">
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
                className="w-20 md:w-24 h-20 md:h-24 opacity-20"
              />
            </div>
          )}
        </div>

        {/* ===== ARTICLE CONTENT ===== */}
        <article className="w-full max-w-[800px] mx-auto mt-7 md:mt-14 lg:mt-16">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[14px] md:text-[15px] text-blue-primary md:hover:text-blue-secondary md:transition-colors py-1"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Torna al blog
          </Link>

          {/* Date */}
          {article.data_pubblicazione && (
            <p className="text-[13px] md:text-[15px] text-black/50 mt-4 md:mt-6">
              {formatDate(article.data_pubblicazione)}
            </p>
          )}

          {/* Title */}
          <h1 className="text-[24px] md:text-[32px] lg:text-[36px] tracking-[-1px] md:tracking-[-2px] text-black leading-tight mt-2 md:mt-3">
            {article.titolo}
          </h1>

          {/* Excerpt */}
          {article.excerpt && (
            <p className="text-[15px] md:text-[17px] text-black/70 mt-3 md:mt-4 leading-relaxed">
              {article.excerpt}
            </p>
          )}

          {/* Divider */}
          <div className="w-full h-[2px] bg-black/10 rounded-full mt-6 md:mt-8" />

          {/* Body */}
          <div
            className="mt-6 md:mt-8 prose-studiotara"
            dangerouslySetInnerHTML={{ __html: ensureParagraphs(article.contenuto) }}
          />

        </article>

        {/* ===== CTA ===== */}
        <section className="w-full rounded-[16px] md:rounded-[24px] lg:rounded-[28px] bg-gradient-to-b from-blue-primary to-blue-secondary overflow-hidden mt-[64px] md:mt-[120px] lg:mt-[160px] mb-[32px] md:mb-[50px] lg:mb-[60px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.15)] text-white text-center py-10 md:py-16 px-5 md:px-6">
          <h2 className="text-[24px] md:text-[30px] lg:text-[32px] tracking-[-1px] md:tracking-[-2px] leading-tight">
            Hai bisogno di una <strong>consulenza?</strong>
          </h2>
          <p className="text-[14px] md:text-[16px] mt-3 md:mt-4 max-w-[520px] mx-auto leading-relaxed text-white/85">
            Il nostro team è a tua disposizione per rispondere a qualsiasi
            domanda sul mercato immobiliare.
          </p>
          <Link
            href="/contatti"
            className="block w-full max-w-xs mx-auto md:inline-block md:max-w-none md:w-auto mt-6 md:mt-8 bg-red-primary text-white text-[15px] md:text-[17px] font-medium px-6 md:px-10 py-3 md:py-[11px] rounded-[8px] md:rounded-[6px] md:hover:scale-105 md:hover:shadow-lg md:transition-all md:duration-300 active:scale-[0.99]"
          >
            Contattaci
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}
