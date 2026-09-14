"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * Fogalmi kvíz: feleletválasztós kérdések azonnali magyarázattal.
 *   kerdesek: [{ k: JSX|string, v: [JSX|string ×4], helyes: index, magyarazat: JSX|string }]
 */
function kever(tomb) {
  const t = [...tomb];
  for (let i = t.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [t[i], t[j]] = [t[j], t[i]];
  }
  return t;
}

export default function Kviz({ cim = "Fogalmi kvíz", leiras, kerdesek, db }) {
  const [sor, setSor] = useState(null); // kikevert kérdések, kikevert válaszokkal
  const [i, setI] = useState(0);
  const [valasz, setValasz] = useState(null);
  const [pont, setPont] = useState(0);
  const [kesz, setKesz] = useState(false);

  const ujraKever = () => {
    const kiv = kever(kerdesek).slice(0, db ?? kerdesek.length);
    setSor(
      kiv.map((q) => {
        const idx = kever(q.v.map((_, k) => k));
        return { ...q, v: idx.map((k) => q.v[k]), helyes: idx.indexOf(q.helyes) };
      }),
    );
    setI(0);
    setValasz(null);
    setPont(0);
    setKesz(false);
  };

  useEffect(() => {
    ujraKever();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const aktualis = sor ? sor[i] : null;
  const betuk = ["A", "B", "C", "D"];

  const valaszt = (k) => {
    if (valasz !== null) return;
    setValasz(k);
    if (k === aktualis.helyes) setPont((p) => p + 1);
  };
  const tovabb = () => {
    if (i + 1 >= sor.length) setKesz(true);
    else {
      setI(i + 1);
      setValasz(null);
    }
  };

  const ertekeles = useMemo(() => {
    if (!sor) return "";
    const ar = pont / sor.length;
    if (ar === 1) return "Hibátlan — a fogalmak a helyükön vannak.";
    if (ar >= 0.75) return "Jó! Egy-két fogalmat érdemes még átolvasni az elméletben.";
    if (ar >= 0.5) return "Közepes — a számolás mehet, de a miértek még nem ülnek. Nézd át a kiemelt dobozokat.";
    return "Érdemes visszamenni az elmélethez, mielőtt számolni kezdesz: a tipikus hibák épp ezekből a félreértésekből jönnek.";
  }, [pont, sor]);

  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white shadow-sm shadow-petrol-900/[0.03]">
      <div className="flex flex-wrap items-center gap-2 border-b border-[color:var(--keret)] bg-linear-to-r from-petrol-800 to-petrol-700 px-4 py-2.5">
        <span className="rounded-md bg-emerald-500 px-2 py-0.5 text-[10.5px] font-bold tracking-[0.14em] text-white uppercase">Kvíz</span>
        <span className="text-[13px] font-semibold text-white">{cim}</span>
        {sor && !kesz && (
          <span className="ml-auto text-[11.5px] text-petrol-200">
            {i + 1} / {sor.length} · {pont} pont
          </span>
        )}
      </div>

      <div className="p-4 sm:p-5">
        {leiras && !kesz && <p className="mb-3 text-[13px] text-petrol-500">{leiras}</p>}

        {!sor && <p className="text-[13px] text-petrol-500">Kérdések betöltése…</p>}

        {sor && !kesz && aktualis && (
          <>
            <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-petrol-100">
              <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${(i / sor.length) * 100}%` }} />
            </div>
            <p className="proza text-[15px] leading-relaxed font-medium text-petrol-900">{aktualis.k}</p>
            <div className="mt-3 grid gap-2">
              {aktualis.v.map((opt, k) => {
                let stilus = "border-petrol-200 bg-white hover:border-petrol-400 hover:bg-petrol-50";
                if (valasz !== null) {
                  if (k === aktualis.helyes) stilus = "border-emerald-400 bg-emerald-50";
                  else if (k === valasz) stilus = "border-rose-400 bg-rose-50";
                  else stilus = "border-petrol-100 bg-white opacity-60";
                }
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => valaszt(k)}
                    disabled={valasz !== null}
                    className={`flex items-start gap-3 rounded-xl border px-3.5 py-2.5 text-left text-[14px] text-petrol-800 transition ${stilus}`}
                  >
                    <span
                      className={`mt-0.5 flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                        valasz !== null && k === aktualis.helyes
                          ? "bg-emerald-500 text-white"
                          : valasz === k
                            ? "bg-rose-500 text-white"
                            : "bg-petrol-100 text-petrol-600"
                      }`}
                    >
                      {betuk[k]}
                    </span>
                    <span className="proza">{opt}</span>
                  </button>
                );
              })}
            </div>
            {valasz !== null && (
              <div className={`mt-3 rounded-xl border px-4 py-3 ${valasz === aktualis.helyes ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"}`}>
                <p className={`text-[11px] font-bold tracking-[0.14em] uppercase ${valasz === aktualis.helyes ? "text-emerald-700" : "text-rose-700"}`}>
                  {valasz === aktualis.helyes ? "Helyes" : "Nem ez az"}
                </p>
                <div className="proza mt-1 text-[13.5px] leading-relaxed text-petrol-800">{aktualis.magyarazat}</div>
                <button
                  type="button"
                  onClick={tovabb}
                  className="mt-3 rounded-lg bg-petrol-700 px-3.5 py-1.5 text-[13px] font-semibold text-white transition hover:bg-petrol-800"
                >
                  {i + 1 >= sor.length ? "Eredmény" : "Következő kérdés →"}
                </button>
              </div>
            )}
          </>
        )}

        {sor && kesz && (
          <div className="text-center">
            <p className="text-[11px] font-bold tracking-[0.16em] text-petrol-500 uppercase">Eredmény</p>
            <p className="szamok mt-1 text-4xl font-bold text-petrol-900">
              {pont} <span className="text-lg font-semibold text-petrol-400">/ {sor.length}</span>
            </p>
            <p className="mx-auto mt-2 max-w-md text-[14px] text-petrol-600">{ertekeles}</p>
            <button
              type="button"
              onClick={ujraKever}
              className="mt-4 rounded-lg bg-naracs-500 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-naracs-600"
            >
              Újra, más sorrendben ↻
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
