'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { ApiGoogleReview } from '@/lib/api';

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

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(iso));
  } catch {
    return '';
  }
}

interface Props {
  reviews: ApiGoogleReview[];
}

export default function GoogleReviews({ reviews }: Props) {
  const [page, setPage] = useState(0);
  const perPage = 3;
  const totalPages = Math.ceil(reviews.length / perPage);
  const visible = reviews.slice(page * perPage, page * perPage + perPage);

  if (reviews.length === 0) return null;

  return (
    <div className="w-full">
      {/* Cards */}
      <div className="flex flex-col md:flex-row gap-5 md:gap-6 mt-8 w-full">
        {visible.map((review) => (
          <div
            key={review.id}
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
              <p className="text-[15px] md:text-[16px] leading-relaxed line-clamp-6">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="mt-3">
                <p className="text-[17px] md:text-[18px] font-bold tracking-[-0.8px]">
                  {review.author_name}
                </p>
                <p className="text-[12px] text-black/40 mt-1">
                  {formatDate(review.time)}
                </p>
              </div>
            </div>
          </div>
        ))}
        {/* Placeholder cards if fewer than 3 on last page */}
        {visible.length < perPage &&
          Array.from({ length: perPage - visible.length }).map((_, i) => (
            <div key={`ph-${i}`} className="flex-1 hidden md:block" />
          ))}
      </div>

      {/* Carousel dots */}
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
