"use client";

import { useState } from "react";

/**
 * Hibakereső: egy kész, de hibás megoldás lépései; a tanuló megjelöli, melyik lépésben a hiba.
 *   feladatok: [{ cim, feladat: JSX, lepesek: [{ szoveg: JSX, hibas?: true, javitas?: JSX }], tanulsag?: JSX }]
 */
export default function Hibakereso({ feladatok, cim = "Hibakereső" }) {
  const [i, setI] = useState(0);
  const [tipp, setTipp] = useState(null);
  const [rossz, setRossz] = useState([]);
  const f = feladatok[i];
  const hibasIdx = f.lepesek.findIndex((l) => l.hibas);
  const megvan = tipp === hibasIdx;

  const valaszt = (k) => {
    if (megvan) return;
    setTipp(k);
    if (k !== hibasIdx) setRossz((r) => [...r, k]);
  };
  const tovabb = () => {
    setI((i + 1) % feladatok.length);
    setTipp(null);
    setRossz([]);
  };

  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white shadow-sm shadow-petrol-900/[0.03]">
      <div className="flex flex-wrap items-center gap-2 border-b border-[color:var(--keret)] bg-linear-to-r from-petrol-800 to-petrol-700 px-4 py-2.5">
        <span className="rounded-md bg-rose-500 px-2 py-0.5 text-[10.5px] font-bold tracking-[0.14em] text-white uppercase">Hibakereső</span>
        <span className="text-[13px] font-semibold text-white">{f.cim}</span>
        <span className="ml-auto text-[11.5px] text-petrol-200">
          {i + 1} / {feladatok.length}
        </span>
      </div>
      <div className="p-4 sm:p-5">
        <p className="mb-2 text-[13px] text-petrol-500">
          Az alábbi megoldás <strong>egy helyen hibás</strong>. Kattints arra a lépésre, ahol a hiba van!
        </p>
        <div className="proza rounded-xl bg-petrol-50 px-4 py-3 text-[14px] text-petrol-800">{f.feladat}</div>
        <ol className="mt-3 space-y-2">
          {f.lepesek.map((l, k) => {
            let stilus = "border-petrol-200 bg-white hover:border-petrol-400 hover:bg-petrol-50";
            if (megvan && k === hibasIdx) stilus = "border-emerald-400 bg-emerald-50";
            else if (rossz.includes(k)) stilus = "border-rose-300 bg-rose-50/70";
            else if (megvan) stilus = "border-petrol-100 bg-white opacity-70";
            return (
              <li key={k}>
                <button
                  type="button"
                  onClick={() => valaszt(k)}
                  disabled={megvan}
                  className={`flex w-full items-start gap-3 rounded-xl border px-3.5 py-2.5 text-left transition ${stilus}`}
                >
                  <span className="mt-0.5 flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full bg-petrol-100 text-[11px] font-bold text-petrol-600">
                    {k + 1}
                  </span>
                  <span className="szamok proza min-w-0 flex-1 text-[14px] text-petrol-800">{l.szoveg}</span>
                </button>
                {rossz.includes(k) && !megvan && (
                  <p className="mt-1 pl-9 text-[12.5px] text-rose-700">Ez a lépés rendben van — keress tovább.</p>
                )}
              </li>
            );
          })}
        </ol>
        {megvan && (
          <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <p className="text-[11px] font-bold tracking-[0.14em] text-emerald-700 uppercase">
              Megvan{rossz.length ? ` (${rossz.length} tipp után)` : " — elsőre"}
            </p>
            <div className="proza szamok mt-1 text-[13.5px] leading-relaxed text-petrol-800">{f.lepesek[hibasIdx].javitas}</div>
            {f.tanulsag && <div className="proza mt-2 border-t border-emerald-200 pt-2 text-[13px] text-petrol-700">{f.tanulsag}</div>}
            <button
              type="button"
              onClick={tovabb}
              className="mt-3 rounded-lg bg-petrol-700 px-3.5 py-1.5 text-[13px] font-semibold text-white transition hover:bg-petrol-800"
            >
              Következő hibás megoldás →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
