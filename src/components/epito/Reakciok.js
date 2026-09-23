"use client";

import { useState } from "react";
import { reakcioKomponensek } from "@/lib/epito/ellenorzes";
import { sz } from "@/lib/szamok";

/*
 * A rajzolás 0. (kihagyható) lépése: a reakciók tippelése.
 *   tippek / onTippek – { kulcs: "12" } (a Rajzoló tartja, az ellenőrzésbe is bekerül)
 *   mutatva / onMutat – „Mutasd a reakciókat” (a kör pontja 20 %-kal csökken)
 */
const f1 = (v) => sz(v, Math.abs(v - Math.round(v)) > 1e-9 ? 2 : 0);

const NYIL = { x: "→", y: "↑", M: "↶", n: "↗" };

export default function Reakciok({ e, tippek, onTippek, mutatva, onMutat, zart = false }) {
  const komp = reakcioKomponensek(e);
  const [visszajelzes, setVisszajelzes] = useState(null); // { kulcs: true|false }
  const [rontasok, setRontasok] = useState({});
  const [nyitva, setNyitva] = useState(false);

  const ellenoriz = () => {
    const uj = {}, r = { ...rontasok };
    for (const k of komp) {
      const t = Number(String(tippek[k.kulcs] ?? "").replace(",", "."));
      const jo = Number.isFinite(t) && tippek[k.kulcs] !== undefined && tippek[k.kulcs] !== "" && Math.abs(t - k.helyes) <= Math.max(0.1 * Math.abs(k.helyes), 0.5);
      uj[k.kulcs] = jo;
      if (!jo) r[k.kulcs] = (r[k.kulcs] ?? 0) + 1;
    }
    setVisszajelzes(uj);
    setRontasok(r);
  };
  const mindJo = visszajelzes && komp.every((k) => visszajelzes[k.kulcs]);

  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-violet-200 bg-violet-50/60">
      <button type="button" onClick={() => setNyitva((n) => !n)} className="flex w-full flex-wrap items-center gap-2 px-4 py-2.5 text-left text-[13px] font-semibold text-violet-900" aria-expanded={nyitva}>
        <span className={`inline-block transition-transform ${nyitva ? "rotate-90" : ""}`}>▸</span>
        0. lépés (kihagyható): a reakciók
        <span className="text-[11.5px] font-normal text-violet-700">
          {mutatva ? "— megmutatva (a pont 20 %-kal csökken)" : mindJo ? "— mind helyes ✓" : "— tippeld meg, és ellenőrizd"}
        </span>
      </button>
      {nyitva && (
        <div className="border-t border-violet-200 px-4 py-3">
          <p className="mb-2 text-[12.5px] text-petrol-600">
            Feltételezett irányok: x jobbra (→), y felfelé (↑), a befogási nyomaték az óramutatóval ellentétesen (↶), a görgő a gátolt irány mentén. Ha a valódi irány fordított, negatív számot írj.
          </p>
          <div className="szamok grid gap-2 sm:grid-cols-2 lg:grid-cols-3 [&>*]:min-w-0">
            {komp.map((k) => {
              const vj = visszajelzes?.[k.kulcs];
              const felfed = mutatva || (rontasok[k.kulcs] ?? 0) >= 2;
              return (
                <label key={k.kulcs} className={`flex items-center gap-2 rounded-lg border bg-white px-2.5 py-1.5 text-[13px] ${vj === true ? "border-emerald-400" : vj === false ? "border-rose-400" : "border-[color:var(--keret)]"}`}>
                  <span className="w-14 shrink-0 font-semibold text-petrol-800">
                    {k.jel.includes("_") ? <>{k.jel.split("_")[0]}<sub className="text-[10px]">{k.jel.split("_")[1]}</sub></> : k.jel} <span className="text-violet-600">{NYIL[k.kulcs.slice(-1)]}</span>
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    disabled={zart || mutatva}
                    value={mutatva ? f1(k.helyes) : tippek[k.kulcs] ?? ""}
                    onChange={(ev) => onTippek({ ...tippek, [k.kulcs]: ev.target.value })}
                    className="w-20 min-w-0 rounded-md border border-petrol-200 px-2 py-1 text-right text-[13px] text-petrol-900 focus:border-petrol-500 focus:outline-none disabled:bg-petrol-50"
                    placeholder="?"
                  />
                  <span className="text-[11px] text-petrol-500">{k.kulcs.endsWith("M") ? "kNm" : "kN"}</span>
                  {vj === true && <span className="ml-auto text-emerald-700">✓</span>}
                  {vj === false && !felfed && <span className="ml-auto text-rose-700">✗</span>}
                  {vj === false && felfed && !mutatva && <span className="ml-auto text-[11.5px] text-rose-700">✗ helyesen {f1(k.helyes)}</span>}
                </label>
              );
            })}
          </div>
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            {!mutatva && (
              <button type="button" onClick={ellenoriz} disabled={zart} className="rounded-lg bg-violet-700 px-3.5 py-1.5 text-[12.5px] font-semibold text-white transition hover:bg-violet-800 disabled:opacity-50">
                Ellenőrzöm
              </button>
            )}
            {!mutatva && (
              <button type="button" onClick={onMutat} disabled={zart} className="rounded-lg bg-white px-3.5 py-1.5 text-[12.5px] font-medium text-petrol-700 ring-1 ring-petrol-200 transition hover:bg-petrol-50 disabled:opacity-50">
                Mutasd a reakciókat (−20 %)
              </button>
            )}
            {visszajelzes && !mindJo && !mutatva && <span className="text-[12px] text-rose-700">Nem mind jó — a második rontás után a helyes értéket is megmutatjuk.</span>}
            {mindJo && <span className="text-[12px] text-emerald-700">Minden reakció helyes — a rajzolás így sokkal könnyebb.</span>}
            {komp.length > 0 && <span className="ml-auto text-[11.5px] text-petrol-500">főpont: {komp.find((k) => k.egyenlet.includes("ΣM"))?.egyenlet.split(" (")[0] ?? "ΣM = 0"}</span>}
          </div>
        </div>
      )}
    </div>
  );
}
