'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Review {
  quote: string;
  author: string;
  rating: number;
}

const REVIEWS: Review[] = [
  {
    quote: "Dal primo contatto ho capito di essere nelle mani giuste. Stefano mi ha seguito in ogni fase dell'acquisto con affidabilità e disponibilità costante. Lo consiglio a chiunque, soprattutto a chi compra casa per la prima volta.",
    author: 'Francesco L.',
    rating: 5,
  },
  {
    quote: "Avevo bisogno di vendere un appartamento in tempi rapidi. Studio Tara ha gestito tutto con professionalità, trovando l'acquirente giusto in meno di un mese. Esperienza eccellente dall'inizio alla fine.",
    author: 'Maria G.',
    rating: 5,
  },
  {
    quote: 'Cercavo un negozio in affitto a Buccinasco e grazie a Studio Tara ho trovato la soluzione perfetta in pochissimo tempo. Disponibili, precisi e molto competenti sulla zona.',
    author: 'Andrea P.',
    rating: 5,
  },
  {
    quote: "Ho venduto la mia villa tramite Studio Tara. Valutazione corretta fin da subito, foto professionali e tante visite organizzate. In due mesi abbiamo chiuso la trattativa a un prezzo che non mi aspettavo.",
    author: 'Laura M.',
    rating: 5,
  },
  {
    quote: "Agenzia seria e affidabile. Ci hanno aiutato con tutta la documentazione per il mutuo e il rogito senza mai lasciarci soli. Dopo 30 anni di attività si vede l'esperienza.",
    author: 'Giuseppe R.',
    rating: 5,
  },
  {
    quote: "Ho acquistato un bilocale a Corsico come investimento. Studio Tara mi ha consigliato al meglio, sia sulla zona che sul prezzo. Ottimo rapporto qualità-prezzo del servizio.",
    author: 'Chiara B.',
    rating: 4,
  },
  {
    quote: "Professionalità e trasparenza. Mi hanno seguito passo passo nella vendita del mio appartamento ad Assago. Sempre reperibili e puntuali negli aggiornamenti.",
    author: 'Roberto F.',
    rating: 5,
  },
  {
    quote: "Abbiamo trovato la nostra prima casa grazie a Stefano e al suo team. Pazienti, competenti e sempre con il sorriso. Non posso che raccomandarli a tutti.",
    author: 'Silvia e Marco T.',
    rating: 5,
  },
  {
    quote: 'Cercavo un capannone in zona sud-ovest Milano. Studio Tara conosceva perfettamente il mercato e mi ha proposto esattamente quello che cercavo. Affare concluso in tempi record.',
    author: 'Davide C.',
    rating: 5,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-[2px]">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill={star <= rating ? '#facc15' : '#e5e7eb'}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewsCarousel() {
  const [page, setPage] = useState(0);
  const perPage = 3;
  const totalPages = Math.ceil(REVIEWS.length / perPage);
  const visible = REVIEWS.slice(page * perPage, page * perPage + perPage);

  return (
    <div className="w-full">
      {/* Cards */}
      <div className="flex flex-col md:flex-row gap-5 md:gap-6 mt-8 w-full min-h-[280px]">
        {visible.map((review, i) => (
          <div
            key={page * perPage + i}
            className="flex-1 rounded-[18px] md:rounded-[20px] border border-blue-border px-7 md:px-10 py-8 md:py-10 flex flex-col items-center gap-5 hover:shadow-[0px_4px_20px_0px_rgba(10,47,120,0.1)] hover:-translate-y-1 transition-all duration-300"
          >
            <Image
              src="/icons/virgolette.svg"
              alt=""
              width={36}
              height={36}
              aria-hidden="true"
            />
            <StarRating rating={review.rating} />
            <div className="text-center text-black flex-1 flex flex-col justify-between">
              <p className="text-[15px] md:text-[16px] leading-relaxed">
                &ldquo;{review.quote}&rdquo;
              </p>
              <p className="text-[17px] md:text-[18px] font-bold tracking-[-0.8px] mt-3">
                {review.author}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Carousel controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="w-9 h-9 rounded-full border border-blue-primary flex items-center justify-center text-blue-primary disabled:opacity-30 hover:bg-blue-primary hover:text-white transition-all cursor-pointer disabled:cursor-default"
            aria-label="Recensioni precedenti"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  i === page
                    ? 'bg-blue-primary scale-125'
                    : 'bg-blue-primary/25 hover:bg-blue-primary/50'
                }`}
                aria-label={`Pagina ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="w-9 h-9 rounded-full border border-blue-primary flex items-center justify-center text-blue-primary disabled:opacity-30 hover:bg-blue-primary hover:text-white transition-all cursor-pointer disabled:cursor-default"
            aria-label="Recensioni successive"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
