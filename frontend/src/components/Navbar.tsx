"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

  return (
    <header className="bg-white w-full sticky top-0 z-50 shadow-sm">
      <div className="h-[70px] lg:h-[80px] flex items-center justify-between px-5 md:px-10 lg:px-[50px] max-w-[1440px] mx-auto">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Image
            src="/images/logo.png"
            alt="Studio Tara"
            width={160}
            height={34}
            className="lg:w-[180px]"
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
          className="lg:hidden flex flex-col gap-[5px] p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span
            className={`w-6 h-[2px] bg-blue-primary transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`}
          />
          <span
            className={`w-6 h-[2px] bg-blue-primary transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`w-6 h-[2px] bg-blue-primary transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <nav
        className={`lg:hidden bg-white border-t border-gray-100 overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-[80vh] py-4" : "max-h-0"}`}
      >
        <div className="flex flex-col px-5">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`text-[16px] py-3 border-b border-gray-50 transition-colors ${
                  active
                    ? "text-blue-primary font-medium"
                    : "text-gray-text hover:text-blue-primary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
