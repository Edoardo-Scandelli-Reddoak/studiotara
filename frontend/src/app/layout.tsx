import type { Metadata, Viewport } from "next";
import "./globals.css";
import AnalyticsPing from "@/components/AnalyticsPing";

export const metadata: Metadata = {
  title: "Studio Tara — Agenzia Immobiliare Buccinasco",
  description:
    "Agenzia immobiliare di Buccinasco con oltre 30 anni di esperienza. Compravendita e locazione di immobili residenziali, commerciali e industriali a Milano e nell'hinterland.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#092d74",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className="antialiased">
      <body className="min-h-screen flex flex-col">
        <AnalyticsPing />
        {children}
      </body>
    </html>
  );
}
