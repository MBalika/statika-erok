"use client";

import { useEffect, useState } from "react";

const KULCS = "statika-tema";

/** Sötét mód kapcsoló: a <html> elemre teszi a "dark" osztályt, és megjegyzi a választást. */
export default function SotetKapcsolo({ vilagos = false }) {
  const [sotet, setSotet] = useState(false);

  useEffect(() => {
    setSotet(document.documentElement.classList.contains("dark"));
  }, []);

  const valt = () => {
    const uj = !sotet;
    setSotet(uj);
    document.documentElement.classList.toggle("dark", uj);
    try {
      localStorage.setItem(KULCS, uj ? "sotet" : "vilagos");
    } catch {
      /* privát mód */
    }
  };

  return (
    <button
      type="button"
      onClick={valt}
      aria-label={sotet ? "Világos mód" : "Sötét mód"}
      title={sotet ? "Világos mód" : "Sötét mód"}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition ${
        vilagos ? "text-white hover:bg-white/10" : "text-petrol-600 ring-1 ring-petrol-200 hover:bg-petrol-100"
      }`}
    >
      {sotet ? (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
        </svg>
      )}
    </button>
  );
}
