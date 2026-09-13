"use client";

import { useEffect, useState } from "react";

/** Nagy modulfejléc a modul-oldalak tetején. */
export function ModulFejlec({ szam, cim, leiras, tartalom = [] }) {
  return (
    <div className="racs-hatter border-b border-petrol-800 bg-linear-to-br from-petrol-900 via-petrol-800 to-petrol-700">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-naracs-500 text-[17px] font-bold text-white">
            {szam}
          </span>
          <span className="text-[11px] font-semibold tracking-[0.2em] text-petrol-300 uppercase">
            Modul
          </span>
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {cim}
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-petrol-200">
          {leiras}
        </p>
        {tartalom.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
            {tartalom.map((t) => (
              <li
                key={t}
                className="flex items-center gap-2 text-[13px] text-petrol-200"
              >
                <span className="h-1 w-1 rounded-full bg-naracs-400" />
                {t}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/** Ragadós szakasz-navigáció, amely kiemeli az éppen látható szakaszt. */
export function SzakaszSav({ szakaszok }) {
  const [aktiv, setAktiv] = useState(szakaszok[0]?.id);

  useEffect(() => {
    const elemek = szakaszok
      .map((sz) => document.getElementById(sz.id))
      .filter(Boolean);
    if (elemek.length === 0) return;

    const figyelo = new IntersectionObserver(
      (bejegyzesek) => {
        const lathato = bejegyzesek
          .filter((b) => b.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (lathato[0]) setAktiv(lathato[0].target.id);
      },
      { rootMargin: "-140px 0px -55% 0px", threshold: 0 },
    );

    elemek.forEach((e) => figyelo.observe(e));
    return () => figyelo.disconnect();
  }, [szakaszok]);

  return (
    <div className="nyomtatasban-rejtve sticky top-14 z-30 border-b border-[color:var(--keret)] bg-white/90 backdrop-blur md:top-[97px]">
      <div className="finom-gorgeto mx-auto flex max-w-5xl gap-1.5 overflow-x-auto px-4 py-2.5 sm:px-6">
        {szakaszok.map((sz) => (
          <a
            key={sz.id}
            href={`#${sz.id}`}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12.5px] font-medium whitespace-nowrap transition ${
              aktiv === sz.id
                ? "bg-petrol-800 text-white"
                : "bg-petrol-50 text-petrol-600 hover:bg-petrol-100"
            }`}
          >
            {sz.cim}
          </a>
        ))}
      </div>
    </div>
  );
}
