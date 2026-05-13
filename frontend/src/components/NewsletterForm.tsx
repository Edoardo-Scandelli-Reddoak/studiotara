"use client";

import { useState } from "react";

const SUBMIT_URL = "/api/lead/newsletter";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || !email.trim()) return;

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(SUBMIT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSent(true);
      setEmail("");
    } catch (err) {
      console.error("Newsletter submit error:", err);
      setError("Si è verificato un problema. Riprova più tardi.");
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-2 mt-6 md:mt-8">
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="text-[15px] md:text-[16px] text-white font-medium">
          Iscrizione completata!
        </p>
        <p className="text-[13px] md:text-[14px] text-white/80">
          Riceverai le prossime novità nella tua inbox.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 md:gap-5 items-center justify-center mt-6 md:mt-8">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="La tua email"
        className="w-full md:w-[400px] lg:w-[460px] h-[48px] md:h-[44px] rounded-[8px] md:rounded-[6px] px-4 md:px-5 text-[15px] md:text-[16px] text-black bg-white outline-none focus:shadow-[0_0_0_3px_rgba(210,7,42,0.3)] transition-all"
      />
      <button
        type="submit"
        disabled={submitting}
        className="w-full md:w-auto bg-red-primary text-white text-[15px] md:text-[16px] font-medium px-6 md:px-10 py-3 md:py-[11px] rounded-[8px] md:rounded-[6px] md:hover:scale-105 md:hover:shadow-lg md:transition-all md:duration-300 cursor-pointer active:scale-[0.99] disabled:opacity-60 md:disabled:hover:scale-100 disabled:cursor-not-allowed"
      >
        {submitting ? "Invio..." : "Iscriviti"}
      </button>
      {error && (
        <p className="md:w-full text-[13px] text-white bg-red-primary/80 rounded-[6px] px-3 py-1.5 text-center">
          {error}
        </p>
      )}
    </form>
  );
}
