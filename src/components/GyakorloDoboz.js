"use client";

import { useCallback, useEffect, useState } from "react";
import Konfetti from "@/components/ui/Konfetti";

/**
 * Általános gyakorlófeladat-motor.
 *
 * A `generator` egy függvény, amely minden hívásnál új feladatot ad vissza:
 * {
 *   szoveg:  JSX – a feladat kiírása
 *   abra:    JSX – opcionális ábra
 *   sugo:    JSX – opcionális segítség
 *   mezok:   [{ id, cimke, egyseg, helyes, tures?, tizedes? }]
 *   megoldas: JSX – a teljes levezetés
 * }
 */
export default function GyakorloDoboz({
  cim,
  leiras,
  generator,
  oszlopok = 2,
}) {
  const [feladat, setFeladat] = useState(null);
  const [valaszok, setValaszok] = useState({});
  const [ellenorizve, setEllenorizve] = useState(false);
  const [megoldasLathato, setMegoldasLathato] = useState(false);
  const [sugoLathato, setSugoLathato] = useState(false);
  const [statisztika, setStatisztika] = useState({ jo: 0, osszes: 0 });
  const [sorozat, setSorozat] = useState(0); // egymás utáni hibátlan megoldások
  const [konfetti, setKonfetti] = useState(false);
  const konfettiVege = useCallback(() => setKonfetti(false), []);

  const ujFeladat = useCallback(() => {
    setFeladat(generator());
    setValaszok({});
    setEllenorizve(false);
    setMegoldasLathato(false);
    setSugoLathato(false);
  }, [generator]);

  // Az első feladat csak a kliensen generálódik, hogy a szerver- és a
  // kliensoldali kimenet ne térjen el egymástól.
  useEffect(() => {
    ujFeladat();
  }, [ujFeladat]);

  if (!feladat) {
    return (
      <div className="my-6 h-64 animate-pulse rounded-2xl border border-[color:var(--keret)] bg-white" />
    );
  }

  const ellenoriz = () => {
    if (ellenorizve) return;
    setEllenorizve(true);
    const mind = feladat.mezok.every((m) => jo(m, valaszok[m.id]));
    setStatisztika((s) => ({ jo: s.jo + (mind ? 1 : 0), osszes: s.osszes + 1 }));
    setSorozat((n) => {
      const uj = mind ? n + 1 : 0;
      if (uj > 0 && uj % 5 === 0) setKonfetti(true);
      return uj;
    });
  };

  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white shadow-sm shadow-petrol-900/[0.03]">
      <Konfetti aktiv={konfetti} onVege={konfettiVege} />
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-b border-[color:var(--keret)] bg-linear-to-r from-petrol-800 to-petrol-700 px-5 py-3.5">
        <span className="text-[10.5px] font-bold tracking-[0.16em] text-naracs-300 uppercase">
          Gyakorlás
        </span>
        <h3 className="text-[15px] font-semibold text-white">{cim}</h3>
        {statisztika.osszes > 0 && (
          <span className="szamok ml-auto rounded-full bg-white/10 px-2.5 py-1 text-[12px] font-medium text-white">
            {statisztika.jo} / {statisztika.osszes} hibátlan
            {sorozat >= 2 ? ` · ${sorozat} egymás után 🔥` : ""}
          </span>
        )}
      </div>

      <div className="px-5 py-5 sm:px-6">
        {leiras && (
          <p className="mb-4 text-[13px] text-petrol-500">{leiras}</p>
        )}

        <div className="proza text-[14.5px] leading-relaxed text-petrol-800">
          {feladat.szoveg}
        </div>

        {feladat.abra && <div className="mt-4">{feladat.abra}</div>}

        {/* Beviteli mezők */}
        <div
          className={`mt-5 grid gap-3 ${
            oszlopok === 1 ? "" : "sm:grid-cols-2"
          } ${oszlopok === 3 ? "lg:grid-cols-3" : ""}`}
        >
          {feladat.mezok.map((m) => {
            const ertek = valaszok[m.id] ?? "";
            const allapot = ellenorizve ? (jo(m, ertek) ? "jo" : "rossz") : null;
            return (
              <label key={m.id} className="block">
                <span className="mb-1 block text-[12.5px] font-medium text-petrol-600">
                  {m.cimke}
                </span>
                <div
                  className={`flex items-center overflow-hidden rounded-lg border bg-white transition ${
                    allapot === "jo"
                      ? "border-emerald-400 ring-2 ring-emerald-100"
                      : allapot === "rossz"
                        ? "border-rose-400 ring-2 ring-rose-100"
                        : "border-petrol-200 focus-within:border-petrol-400 focus-within:ring-2 focus-within:ring-petrol-100"
                  }`}
                >
                  <input
                    type="text"
                    inputMode="decimal"
                    value={ertek}
                    disabled={ellenorizve}
                    onChange={(e) =>
                      setValaszok((v) => ({ ...v, [m.id]: e.target.value }))
                    }
                    onKeyDown={(e) => e.key === "Enter" && ellenoriz()}
                    placeholder="?"
                    className="szamok w-full bg-transparent px-3 py-2 text-[14.5px] text-petrol-900 outline-none disabled:text-petrol-600"
                  />
                  {m.egyseg && (
                    <span className="shrink-0 border-l border-petrol-100 bg-petrol-50 px-2.5 py-2 text-[12.5px] text-petrol-500">
                      {m.egyseg}
                    </span>
                  )}
                </div>
                {allapot === "rossz" && (
                  <span className="szamok mt-1 block text-[12px] text-rose-600">
                    Helyesen: {kerekit(m.helyes, m.tizedes ?? 2)}
                    {m.egyseg ? ` ${m.egyseg}` : ""}
                  </span>
                )}
                {allapot === "jo" && (
                  <span className="mt-1 block text-[12px] font-medium text-emerald-600">
                    Helyes
                  </span>
                )}
              </label>
            );
          })}
        </div>

        {/* Vezérlők */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {!ellenorizve && (
            <button
              type="button"
              onClick={ellenoriz}
              className="rounded-lg bg-petrol-700 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-petrol-800"
            >
              Ellenőrzés
            </button>
          )}
          <button
            type="button"
            onClick={ujFeladat}
            className="rounded-lg bg-naracs-500 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-naracs-600"
          >
            Új feladat ↻
          </button>
          {feladat.sugo && !sugoLathato && !ellenorizve && (
            <button
              type="button"
              onClick={() => setSugoLathato(true)}
              className="rounded-lg bg-white px-4 py-2 text-[13px] font-medium text-petrol-700 ring-1 ring-petrol-200 transition hover:bg-petrol-50"
            >
              Segítség
            </button>
          )}
          {feladat.megoldas && (
            <button
              type="button"
              onClick={() => setMegoldasLathato((v) => !v)}
              className="rounded-lg px-3 py-2 text-[13px] font-medium text-petrol-500 transition hover:text-petrol-800"
            >
              {megoldasLathato ? "Levezetés elrejtése" : "Levezetés megmutatása"}
            </button>
          )}
        </div>

        {sugoLathato && feladat.sugo && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-[10.5px] font-bold tracking-[0.16em] text-emerald-700 uppercase">
              Segítség
            </p>
            <div className="proza mt-1.5 text-[13.5px] leading-relaxed text-petrol-800">
              {feladat.sugo}
            </div>
          </div>
        )}

        {megoldasLathato && feladat.megoldas && (
          <div className="mt-4 rounded-xl border border-petrol-200 bg-petrol-50 p-4 sm:p-5">
            <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-600 uppercase">
              Levezetés
            </p>
            <div className="proza mt-2 text-[14px] leading-relaxed text-petrol-800">
              {feladat.megoldas}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- segédfüggvények ---------- */

function szammaAlakit(szoveg) {
  if (typeof szoveg === "number") return szoveg;
  if (!szoveg) return NaN;
  return Number(String(szoveg).replace(/\s/g, "").replace(",", "."));
}

function jo(mezo, valasz) {
  const v = szammaAlakit(valasz);
  if (Number.isNaN(v)) return false;
  const tures =
    mezo.tures ?? Math.max(0.01, Math.abs(mezo.helyes) * 0.015);
  return Math.abs(v - mezo.helyes) <= tures;
}

function kerekit(szam, tizedes) {
  // csak a tizedesjegyek végéről vágjuk le a nullákat (10340 maradjon 10340)
  return szam
    .toFixed(tizedes)
    .replace(/(\.\d*?)0+$/, "$1")
    .replace(/\.$/, "")
    .replace(".", ",");
}
