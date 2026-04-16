import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseHref: string; // e.g. "/blog" or "/cerco-residenziale"
  anchor?: string;  // e.g. "articoli" or "immobili"
}

export default function Pagination({ currentPage, totalPages, baseHref, anchor }: PaginationProps) {
  if (totalPages <= 1) return null;

  const hash = anchor ? `#${anchor}` : '';

  function href(p: number) {
    return `${baseHref}?page=${p}${hash}`;
  }

  const chevronLeft = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
  const chevronRight = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );

  const btnBase = "flex items-center justify-center w-10 h-10 rounded-[8px] text-[15px] transition-all";
  const btnActive = "bg-blue-primary text-white shadow-sm font-medium";
  const btnIdle = "border border-blue-border text-blue-primary hover:bg-blue-primary hover:text-white";
  const btnDisabled = "border border-black/10 text-black/25 cursor-not-allowed";

  // Build visible page list with ellipsis markers
  const pages: (number | 'ellipsis')[] = [];
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2) {
      pages.push(p);
    } else if (pages[pages.length - 1] !== 'ellipsis') {
      pages.push('ellipsis');
    }
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-12 md:mt-16">
      {/* Previous */}
      {currentPage > 1 ? (
        <Link href={href(currentPage - 1)} className={`${btnBase} ${btnIdle}`} aria-label="Pagina precedente">
          {chevronLeft}
        </Link>
      ) : (
        <span className={`${btnBase} ${btnDisabled}`} aria-disabled="true">{chevronLeft}</span>
      )}

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === 'ellipsis' ? (
          <span key={`ellipsis-${i}`} className="text-black/40 px-1">…</span>
        ) : (
          <Link
            key={p}
            href={href(p)}
            className={`${btnBase} ${p === currentPage ? btnActive : btnIdle}`}
          >
            {p}
          </Link>
        )
      )}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link href={href(currentPage + 1)} className={`${btnBase} ${btnIdle}`} aria-label="Pagina successiva">
          {chevronRight}
        </Link>
      ) : (
        <span className={`${btnBase} ${btnDisabled}`} aria-disabled="true">{chevronRight}</span>
      )}
    </div>
  );
}
