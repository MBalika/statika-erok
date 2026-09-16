"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Élő számláló: egyenletek (e) és ismeretlenek (i) színes „mérlege”, plusz az ítélet.
 *   e, i          – a számok
 *   eReszek       – [{ cimke, db, szin? }] az egyenletek felbontása (pl. 3 test × 3)
 *   iReszek       – [{ cimke, db }] az ismeretlenek felbontása (görgő 1, csukló 2, …)
 *   itelet        – a kinematika() eredménye: { tipus, szabad, folos, kritikus, rovid }
 *   kompakt       – kisebb változat (a játékhoz)
 */
export const ITELET_SZIN = {
  hatarozott: { szoveg: "text-emerald-700", hatter: "bg-emerald-50 ring-emerald-300", pont: "#15803d" },
  hatarozatlan: { szoveg: "text-violet-700", hatter: "bg-violet-50 ring-violet-300", pont: "#7c3aed" },
  tulhatarozott: { szoveg: "text-rose-700", hatter: "bg-rose-50 ring-rose-300", pont: "#be123c" },
  hatarozatlanEsTulhatarozott: { szoveg: "text-rose-700", hatter: "bg-rose-50 ring-rose-300", pont: "#be123c" },
};

export function iteletCim(it) {
  if (!it) return "";
  if (it.tipus === "hatarozott") return "Statikailag határozott tartó ✓";
  if (it.tipus === "hatarozatlan") return `${it.folos}-szeresen statikailag határozatlan tartó`;
  if (it.tipus === "tulhatarozott") return `Mechanizmus: ${it.szabad} szabad mozgás (túlhatározott)`;
  return `Kritikus: ${it.szabad} szabad mozgás és ${it.folos} fölös kényszer`;
}

function Kockak({ db, szin, max = 18 }) {
  const n = Math.min(db, max);
  return (
    <span className="inline-flex flex-wrap gap-[3px]">
      {Array.from({ length: n }, (_, k) => (
        <span key={k} className="inline-block h-3.5 w-3.5 rounded-[4px] transition-all duration-300" style={{ background: szin }} />
      ))}
      {db > max && <span className="text-[11px] text-petrol-500">…</span>}
    </span>
  );
}

export default function Merleg({ e, i, eReszek = [], iReszek = [], itelet, kompakt = false }) {
  const st = itelet ? ITELET_SZIN[itelet.tipus] : null;
  const [villan, setVillan] = useState(false);
  const elozo = useRef(`${e}|${i}`);
  useEffect(() => {
    const most = `${e}|${i}`;
    if (elozo.current !== most) {
      elozo.current = most;
      setVillan(true);
      const t = setTimeout(() => setVillan(false), 350);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [e, i]);
  const jel = e === i ? "=" : e > i ? ">" : "<";
  const jelSzin = e === i ? "text-emerald-700" : e > i ? "text-rose-700" : "text-violet-700";
  return (
    <div className={`rounded-xl border border-[color:var(--keret)] bg-white ${kompakt ? "p-2.5" : "p-3.5"}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10.5px] font-bold tracking-[0.14em] text-petrol-500 uppercase">egyenletek · e</p>
          <div className="mt-1 flex items-center gap-2">
            <span className={`szamok text-[22px] font-bold leading-none text-petrol-900 transition-transform ${villan ? "scale-125" : ""}`}>{e}</span>
            <Kockak db={e} szin="#0e7490" />
          </div>
          {!kompakt && eReszek.length > 0 && <p className="mt-1 text-[11.5px] text-petrol-500">{eReszek.map((r) => `${r.cimke}: ${r.db}`).join(" · ")}</p>}
        </div>
        <span className={`szamok text-[28px] font-black ${jelSzin}`}>{jel}</span>
        <div className="min-w-0 text-right">
          <p className="text-[10.5px] font-bold tracking-[0.14em] text-petrol-500 uppercase">ismeretlenek · i</p>
          <div className="mt-1 flex items-center justify-end gap-2">
            <Kockak db={i} szin="#7c3aed" />
            <span className={`szamok text-[22px] font-bold leading-none text-petrol-900 transition-transform ${villan ? "scale-125" : ""}`}>{i}</span>
          </div>
          {!kompakt && iReszek.length > 0 && <p className="mt-1 text-[11.5px] text-petrol-500">{iReszek.map((r) => `${r.cimke}: ${r.db}`).join(" · ")}</p>}
        </div>
      </div>
      {itelet && (
        <div className={`mt-3 flex items-center gap-2 rounded-lg px-3 py-1.5 ring-1 ${st.hatter}`}>
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: st.pont }} />
          <span className={`text-[12.5px] font-semibold ${st.szoveg}`}>{iteletCim(itelet)}</span>
        </div>
      )}
    </div>
  );
}

/**
 * Összecsuklás-animáció: ha `aktiv`, az s érték 0-ról felfut ~1-re, majd lassan leng (0,85…1,15);
 * ha nem aktív, visszaáll 0-ra. requestAnimationFrame-mel.
 */
export function useOsszecsuklas(aktiv, { felfutas = 1.1, lenges = 2.6 } = {}) {
  const [s, setS] = useState(0);
  const rafRef = useRef(null);
  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (!aktiv) {
      setS(0);
      return undefined;
    }
    let kezdet = null;
    const lep = (most) => {
      if (kezdet == null) kezdet = most;
      const t = (most - kezdet) / 1000;
      let ertek;
      if (t < felfutas) {
        const u = t / felfutas;
        ertek = 1 - (1 - u) * (1 - u) * (1 - u); // gyorsan indul, lassan áll be
      } else {
        ertek = 1 + 0.15 * Math.sin((2 * Math.PI * (t - felfutas)) / lenges);
      }
      setS(ertek);
      rafRef.current = requestAnimationFrame(lep);
    };
    rafRef.current = requestAnimationFrame(lep);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [aktiv, felfutas, lenges]);
  return s;
}
