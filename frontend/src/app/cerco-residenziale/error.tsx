"use client";

export default function PropertyError({ reset }: { reset: () => void }) {
  return <main className="mx-auto max-w-3xl px-6 py-20 text-center">
    <h1 className="text-2xl font-semibold">Immobili temporaneamente non disponibili</h1>
    <p className="mt-4">Riprova tra poco oppure contattaci al numero 02 3655 7365.</p>
    <button type="button" onClick={reset} className="mt-6 rounded-lg bg-blue-primary px-6 py-3 text-white">Riprova</button>
  </main>;
}
