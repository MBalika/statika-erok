"use client";

import { Children, useState } from "react";

/**
 * Kidolgozott feladat lépésenkénti feltárással.
 * A gyerekelemek <Lepes> komponensek; alapból csak az első látszik.
 */
export function KidolgozottFeladat({
  jel,
  ido,
  cim,
  forras,
  feladat,
  abra,
  tanulsag,
  children,
}) {
  const lepesek = Children.toArray(children);
  const [lathato, setLathato] = useState(0);
  const kesz = lathato >= lepesek.length;

  return (
    <article className="my-7 overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white shadow-sm shadow-petrol-900/[0.03]">
      {/* Fejléc */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-[color:var(--keret)] bg-petrol-50/70 px-5 py-3.5">
        <span className="rounded-lg bg-petrol-800 px-2.5 py-1 text-[12px] font-bold tracking-wide text-white">
          {jel}
        </span>
        <h3 className="text-[15.5px] font-semibold text-petrol-900">{cim}</h3>
        <div className="ml-auto flex items-center gap-2">
          {ido && (
            <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-petrol-500 ring-1 ring-petrol-200">
              ⏱ {ido}
            </span>
          )}
          {forras && (
            <span className="hidden rounded-full bg-white px-2.5 py-1 text-[11px] text-petrol-400 ring-1 ring-petrol-100 sm:inline">
              {forras}
            </span>
          )}
        </div>
      </div>

      {/* Feladatkiírás */}
      <div className="px-5 py-5 sm:px-6">
        <p className="text-[10.5px] font-bold tracking-[0.16em] text-naracs-600 uppercase">
          Feladat
        </p>
        <div className="proza mt-2 text-[14.5px] leading-relaxed text-petrol-800">
          {feladat}
        </div>
        {abra && <div className="mt-4">{abra}</div>}
      </div>

      {/* Megoldás */}
      <div className="border-t border-[color:var(--keret)] bg-petrol-50/30 px-5 py-5 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-600 uppercase">
            Megoldás
          </p>
          <span className="text-[11.5px] text-petrol-400">
            {Math.min(lathato, lepesek.length)} / {lepesek.length} lépés
          </span>
        </div>

        {/* Haladásjelző */}
        <div className="mt-2 flex gap-1">
          {lepesek.map((_, i) => (
            <span
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                i < lathato ? "bg-naracs-500" : "bg-petrol-100"
              }`}
            />
          ))}
        </div>

        <div className="mt-5 space-y-5">
          {lepesek.slice(0, lathato).map((lepes, i) => (
            <div key={i} className="flex gap-3.5">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-petrol-700 text-[12px] font-bold text-white">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">{lepes}</div>
            </div>
          ))}
        </div>

        {lathato === 0 && (
          <p className="mt-4 rounded-xl border border-dashed border-petrol-200 bg-white px-4 py-3 text-[13.5px] text-petrol-500">
            Előbb próbáld meg magad! Ha elakadtál, tárd fel a megoldást
            lépésenként.
          </p>
        )}

        {/* Vezérlők */}
        <div className="mt-5 flex flex-wrap gap-2">
          {!kesz && (
            <button
              type="button"
              onClick={() => setLathato((v) => v + 1)}
              className="rounded-lg bg-naracs-500 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-naracs-600"
            >
              {lathato === 0 ? "Első lépés" : "Következő lépés"} →
            </button>
          )}
          {!kesz && (
            <button
              type="button"
              onClick={() => setLathato(lepesek.length)}
              className="rounded-lg bg-white px-4 py-2 text-[13px] font-medium text-petrol-700 ring-1 ring-petrol-200 transition hover:bg-petrol-50"
            >
              Teljes megoldás
            </button>
          )}
          {lathato > 0 && (
            <button
              type="button"
              onClick={() => setLathato(0)}
              className="rounded-lg px-3 py-2 text-[13px] font-medium text-petrol-500 transition hover:text-petrol-800"
            >
              Elrejtés
            </button>
          )}
        </div>

        {kesz && tanulsag && (
          <div className="mt-5 rounded-xl border border-naracs-200 bg-naracs-50 p-4">
            <p className="text-[10.5px] font-bold tracking-[0.16em] text-naracs-700 uppercase">
              Tanulság
            </p>
            <div className="proza mt-1.5 text-[14px] leading-relaxed text-petrol-800">
              {tanulsag}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

/** Egy megoldási lépés. */
export function Lepes({ cim, children }) {
  return (
    <div>
      {cim && (
        <p className="mb-1.5 text-[14px] font-semibold text-petrol-900">{cim}</p>
      )}
      <div className="proza text-[14px] leading-relaxed text-petrol-700">
        {children}
      </div>
    </div>
  );
}
