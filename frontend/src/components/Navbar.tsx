"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Chi siamo", href: "/chi-siamo" },
  { label: "Vendi immobile", href: "/vendi-immobile" },
  { label: "Cerco Residenziale", href: "/cerco-residenziale" },
  { label: "Cerco Commerciale", href: "/cerco-commerciale" },
  { label: "Blog", href: "/blog" },
  { label: "Contatti", href: "/contatti" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  useBodyScrollLock(menuOpen);

  return (
    <header className="bg-white w-full sticky top-0 z-50 shadow-sm">
      <div className="h-[64px] md:h-[70px] lg:h-[80px] flex items-center justify-between px-5 md:px-10 lg:px-[50px] max-w-[1440px] mx-auto">
        <Link
          href="/"
          className="hover:opacity-80 transition-opacity"
          onClick={() => setMenuOpen(false)}
        >
          <Image
            src="/images/logo.png"
            alt="Studio Tara"
            width={140}
            height={30}
            className="md:w-[160px] lg:w-[180px] w-[130px] h-auto"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-[24px]">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[16px] tracking-[-0.6px] transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-red-primary after:transition-all after:duration-300 ${
                  active
                    ? "text-blue-primary font-medium after:w-full"
                    : "text-gray-text hover:text-blue-primary after:w-0 hover:after:w-full"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden flex items-center justify-center w-11 h-11 -mr-2 relative"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Chiudi menu" : "Apri menu"}
          aria-expanded={menuOpen}
        >
          <span className="flex flex-col gap-[5px]">
            <span
              className={`w-6 h-[2px] bg-blue-primary transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`}
            />
            <span
              className={`w-6 h-[2px] bg-blue-primary transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`w-6 h-[2px] bg-blue-primary transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`}
            />
          </span>
        </button>
      </div>

      {/* Mobile menu - full overlay */}
      <div
        className={`lg:hidden fixed inset-x-0 top-[64px] md:top-[70px] bottom-0 bg-white transition-opacity duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        <nav className="flex flex-col h-full overflow-y-auto px-5 pt-2 pb-8">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`text-[17px] py-4 border-b border-black/8 flex items-center justify-between ${
                  active ? "text-blue-primary font-semibold" : "text-gray-text"
                }`}
              >
                <span>{link.label}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Link>
            );
          })}

          {/* CTA in mobile menu */}
          <div className="flex flex-col gap-3 mt-6">
            <a
              href="tel:+39023655736"
              className="flex items-center justify-center gap-2 h-[48px] bg-red-primary text-white text-[15px] font-medium rounded-[8px]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              Chiama 02 365 5736
            </a>
            <Link
              href="/contatti"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-2 h-[48px] border-2 border-blue-primary text-blue-primary text-[15px] font-medium rounded-[8px]"
            >
              Scrivici
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 mt-6 text-blue-primary">
            <a
              href="https://www.facebook.com/profile.php?id=61569249446214"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-11 h-11 flex items-center justify-center"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/studiotara.immobiliare/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-11 h-11 flex items-center justify-center"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
