import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Chi siamo", href: "/chi-siamo" },
  { label: "Vendi immobile", href: "/vendi-immobile" },
  { label: "Cerco Residenziale", href: "/cerco-residenziale" },
  { label: "Cerco Commerciale", href: "/cerco-commerciale" },
  { label: "Blog", href: "/blog" },
  { label: "Contatti", href: "/contatti" },
];

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-blue-primary to-blue-secondary text-white">
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[50px] py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-10">
          {/* Logo & info */}
          <div className="flex flex-col gap-3 md:gap-4 items-center md:items-start text-center md:text-left">
            <Image
              src="/images/logo.png"
              alt="Studio Tara"
              width={150}
              height={32}
              className="brightness-0 invert w-[140px] md:w-[150px]"
            />
            <p className="text-[14px] md:text-[14px] leading-relaxed text-white/75 max-w-[320px]">
              Agenzia immobiliare di Buccinasco con oltre 30 anni di esperienza.
              Compravendita e locazione di immobili residenziali, commerciali e
              industriali a Milano e nell&apos;hinterland.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-3 max-md:border-t max-md:border-white/15 max-md:pt-6">
            <h3 className="text-[16px] md:text-[16px] font-bold tracking-[-0.6px]">
              Navigazione
            </h3>
            <nav className="flex flex-col">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[14px] md:text-[14px] text-white/80 md:text-white/75 py-2 md:py-0 md:gap-2 md:hover:text-white md:hover:translate-x-1 md:transition-all md:duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact info */}
          <div className="flex flex-col gap-3 max-md:border-t max-md:border-white/15 max-md:pt-6">
            <h3 className="text-[16px] md:text-[16px] font-bold tracking-[-0.6px]">
              Contatti
            </h3>
            <div className="flex flex-col gap-2 text-[14px] md:text-[14px] text-white/80 md:text-white/75">
              <a href="https://maps.google.com/?q=Viale+Lomellina+23+Buccinasco" target="_blank" rel="noopener noreferrer" className="py-1 underline-offset-2 md:no-underline md:py-0">
                Viale Lomellina, 23 — 20090 Buccinasco (MI)
              </a>
              <a href="tel:+393342334661" className="py-1 md:py-0">
                Tel: 334 233 4661
              </a>
              <a href="mailto:info@studiotara.it" className="py-1 md:py-0 break-words">
                Email: info@studiotara.it
              </a>
              <div className="flex gap-2 md:gap-4 mt-1 md:mt-2 -ml-2 md:ml-0">
                <a
                  href="https://www.facebook.com/profile.php?id=61569249446214"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-11 h-11 md:w-auto md:h-auto flex items-center justify-center md:hover:text-white md:hover:scale-110 md:transition-all md:duration-200"
                >
                  <svg width="22" height="22" className="md:w-5 md:h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/studiotara.immobiliare/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-11 h-11 md:w-auto md:h-auto flex items-center justify-center md:hover:text-white md:hover:scale-110 md:transition-all md:duration-200"
                >
                  <svg width="22" height="22" className="md:w-5 md:h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 md:mt-10 pt-5 md:pt-6 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-[12px] md:text-[13px] text-white/50 text-center md:text-left">
            &copy; {new Date().getFullYear()} Studio Tara S.r.l. — Tutti i diritti riservati
          </p>
          <div className="flex gap-4 md:gap-5 text-[13px] md:text-[13px] text-white/60 md:text-white/50">
            <Link href="#" className="py-2 md:py-0 md:hover:text-white md:transition-colors md:duration-200">
              Privacy Policy
            </Link>
            <Link href="#" className="py-2 md:py-0 md:hover:text-white md:transition-colors md:duration-200">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
