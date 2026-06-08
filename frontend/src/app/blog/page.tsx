import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Pagination from "@/components/Pagination";
import NewsletterForm from "@/components/NewsletterForm";
import { getBlogArticles, ApiBlogArticleList } from "@/lib/api";

// Blog is edited live in admin — always render fresh.
export const dynamic = 'force-dynamic';

const ARTICLES_PER_PAGE = 15;

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default async function Blog({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam ?? '1', 10));

  const allArticles: ApiBlogArticleList[] = await getBlogArticles();
  const totalPages = Math.ceil(allArticles.length / ARTICLES_PER_PAGE);
  const safePage = Math.min(currentPage, totalPages || 1);
  const start = (safePage - 1) * ARTICLES_PER_PAGE;
  const articles = allArticles.slice(start, start + ARTICLES_PER_PAGE);

  return (
    <>
      <Navbar />

      <main className="flex flex-col items-center overflow-x-hidden max-w-[1440px] mx-auto w-full px-4 md:px-10 lg:px-[50px]">
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

          <section className="relative w-full rounded-[16px] md:rounded-[24px] lg:rounded-[28px] bg-gradient-to-b from-blue-primary to-blue-secondary overflow-hidden md:min-h-[380px] lg:min-h-[430px]">
            {/* Red decorative swoosh - desktop only (right side) */}
            <div className="hidden md:block absolute md:-right-[8%] md:bottom-[30px] md:w-[360px] md:h-[360px] lg:w-[400px] lg:h-[400px] -rotate-[65deg]">
              <Image
                src="/images/vector-decoration.svg"
                alt=""
                width={400}
                height={400}
                aria-hidden="true"
              />
            </div>

            {/* Text - left side */}
            <div className="relative z-10 px-5 pt-7 pb-6 md:absolute md:left-[50px] md:px-0 md:py-0 lg:left-[78px] md:top-1/2 md:-translate-y-1/2 md:w-[420px] lg:w-[604px]">
              <h1 className="text-[26px] md:text-[32px] lg:text-[36px] tracking-[-1px] md:tracking-[-2px] text-white leading-[1.15] md:leading-tight">
                Notizie e consigli dal
                <br className="hidden md:inline" />
                <span className="md:hidden"> </span>
                mondo <strong>immobiliare</strong>
              </h1>
              <p className="text-[14px] md:text-[16px] lg:text-[17px] text-white/90 mt-3 md:mt-4 lg:mt-5 leading-relaxed">
                Aggiornamenti sul mercato, guide pratiche e tutto quello che
                devi sapere prima di comprare, vendere o affittare casa
                nell&apos;area di Milano.
              </p>
              <Link
                href="#articoli"
                className="block w-full text-center md:inline-block md:w-auto mt-5 md:mt-6 bg-red-primary text-white text-[15px] md:text-[17px] font-medium px-6 md:px-10 py-3 md:py-[11px] rounded-[8px] md:rounded-[6px] md:hover:scale-105 md:hover:shadow-lg md:transition-all md:duration-300 active:scale-[0.99]"
              >
                Leggi il nostro blog
              </Link>

              {/* Mobile character (in flow, oversized + clipped at bottom by section overflow → mezzo busto). Negative top margin lifts it slightly over the button. */}
              <div className="md:hidden -mt-[40px] flex justify-end -mr-2 -mb-[200px] pointer-events-none">
                <div className="w-[210px] h-[400px] relative">
                  <Image
                    src="/images/personaggino_blog.png"
                    alt=""
                    fill
                    className="object-contain object-top"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ===== ARTICLE GRID ===== */}
        <section
          id="articoli"
          className="w-full mt-[64px] md:mt-[120px] lg:mt-[160px] scroll-mt-[80px]"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8 lg:gap-10">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="group bg-[#f5f3f0] rounded-[14px] md:rounded-[18px] lg:rounded-[20px] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.15)] md:shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] overflow-hidden md:hover:-translate-y-1 md:hover:shadow-[0px_8px_30px_0px_rgba(0,0,0,0.15)] md:transition-all md:duration-300 flex flex-col active:scale-[0.99]"
              >
                {/* Image */}
                <div className="w-full h-[180px] md:h-[190px] lg:h-[198px] overflow-hidden bg-[#e8e6e3]">
                  {(article.immagine_card_url ?? article.immagine_url) ? (
                    <img
                      src={article.immagine_card_url ?? article.immagine_url!}
                      alt={article.titolo}
                      className="w-full h-full object-cover md:group-hover:scale-105 md:transition-transform md:duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <img
                        src="/images/logo.svg"
                        alt=""
                        className="w-16 h-16 opacity-20"
                      />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 md:p-5 lg:p-[19px] flex flex-col flex-1">
                  {article.data_pubblicazione && (
                    <p className="text-[12px] text-black/40 mb-2">
                      {formatDate(article.data_pubblicazione)}
                    </p>
                  )}
                  <h2 className="text-[17px] md:text-[20px] lg:text-[22px] font-medium text-black tracking-[-0.6px] md:tracking-[-0.8px] lg:tracking-[-1.32px] leading-tight">
                    {article.titolo}
                  </h2>
                  {article.excerpt && (
                    <p className="text-[14px] md:text-[15px] lg:text-[16px] text-black/80 tracking-[-0.3px] md:tracking-[-0.5px] lg:tracking-[-1.08px] mt-2 md:mt-3 leading-relaxed line-clamp-3 md:line-clamp-4">
                      {article.excerpt}
                    </p>
                  )}
                  <p className="text-[15px] md:text-[16px] text-red-primary underline mt-auto pt-3 md:pt-4 tracking-[-0.3px] md:tracking-[-0.5px] lg:tracking-[-1.08px]">
                    Leggi di più
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            baseHref="/blog"
            anchor="articoli"
          />
        </section>

        {/* ===== TESTIMONIALS ===== */}
        <section className="text-center mt-[64px] md:mt-[120px] lg:mt-[160px] px-2 md:px-4">
          <h2 className="text-[24px] md:text-[30px] lg:text-[32px] tracking-[-1px] md:tracking-[-2px] text-black leading-tight">
            Cosa dicono i nostri <strong>clienti</strong>
          </h2>
          <p className="text-[14px] md:text-[16px] text-black mt-2 tracking-[-0.3px] md:tracking-[-0.5px]">
            Trent&apos;anni di fiducia, raccontati da chi ci ha scelto.
          </p>
        </section>

        <section className="flex flex-col md:flex-row gap-5 md:gap-6 mt-7 md:mt-8 w-full">
          <div className="flex-1 rounded-[14px] md:rounded-[20px] lg:rounded-[24px] border border-blue-border px-5 md:px-10 py-6 md:py-10 flex flex-col items-center gap-4 md:gap-6 md:hover:shadow-[0px_4px_20px_0px_rgba(10,47,120,0.1)] md:hover:-translate-y-1 md:transition-all md:duration-300">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/virgolette.svg"
              alt=""
              className="w-[40px] md:w-[48px] h-[40px] md:h-[48px]"
              aria-hidden="true"
            />
            <div className="text-center text-black">
              <p className="text-[14px] md:text-[16px] leading-relaxed">
                &ldquo;Dal primo contatto ho capito di essere nelle mani
                giuste. Stefano mi ha seguito in ogni fase
                dell&apos;acquisto con affidabilità e disponibilità
                costante. Lo consiglio a chiunque, soprattutto a chi compra
                casa per la prima volta.&rdquo;
              </p>
              <p className="text-[16px] md:text-[18px] font-bold tracking-[-0.6px] md:tracking-[-0.8px] mt-3">
                Francesco L.
              </p>
            </div>
          </div>

          <div className="flex-1 rounded-[14px] md:rounded-[20px] lg:rounded-[24px] border border-blue-border px-5 md:px-10 py-6 md:py-10 flex flex-col items-center gap-4 md:gap-6 md:hover:shadow-[0px_4px_20px_0px_rgba(10,47,120,0.1)] md:hover:-translate-y-1 md:transition-all md:duration-300">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/virgolette.svg"
              alt=""
              className="w-[40px] md:w-[48px] h-[40px] md:h-[48px]"
              aria-hidden="true"
            />
            <div className="text-center text-black">
              <p className="text-[14px] md:text-[16px] leading-relaxed">
                &ldquo;Avevo bisogno di vendere un appartamento in tempi
                rapidi. Studio Tara ha gestito tutto con professionalità,
                trovando l&apos;acquirente giusto in meno di un mese.
                Esperienza eccellente dall&apos;inizio alla fine.&rdquo;
              </p>
              <p className="text-[16px] md:text-[18px] font-bold tracking-[-0.6px] md:tracking-[-0.8px] mt-3">
                Maria G.
              </p>
            </div>
          </div>
        </section>

        {/* ===== NEWSLETTER ===== */}
        <section className="w-full rounded-[16px] md:rounded-[24px] lg:rounded-[28px] bg-gradient-to-b from-blue-primary to-blue-secondary overflow-hidden mt-[64px] md:mt-[120px] lg:mt-[160px] mb-[32px] md:mb-[50px] lg:mb-[60px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.15)] text-white text-center py-10 md:py-16 px-5 md:px-6">
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
