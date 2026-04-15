import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Studio Tara — Agenzia Immobiliare Buccinasco",
  description:
    "Agenzia immobiliare di Buccinasco con oltre 30 anni di esperienza. Compravendita e locazione di immobili residenziali, commerciali e industriali nell'area sud-ovest di Milano.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
