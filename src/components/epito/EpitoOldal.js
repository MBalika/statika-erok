"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Epito from "./Epito";
import Rajzolo from "./Rajzolo";
import { allapotJelzes, motorModell, beolvas, ellenorzottAllapot, tomorit } from "@/lib/epito/modell";
import { SABLONOK } from "@/lib/epito/sablonok";

/*
 * A Tartóépítő három lépése egy oldalon: 1 Építés → 2 Rajzolás → 3 Ellenőrzés.
 * Az állapot forrása sorrendben: az URL #m=… része, a localStorage utolsó állapota
 * (statika-epito-utolso), különben az első sablon.
 */

const UTOLSO_KULCS = "statika-epito-utolso";
const LEPESEK = [
  { n: 1, nev: "Építés", leiras: "rudak, csuklók, támaszok, terhek" },
  { n: 2, nev: "Rajzolás", leiras: "V, M (és N) fogópontokkal" },
  { n: 3, nev: "Ellenőrzés", leiras: "hibák, szabályok, segítség" },
];

function urlAllapot() {
  if (typeof window === "undefined") return null;
  const m = window.location.hash.match(/[#&]m=([A-Za-z0-9_-]+)/);
  return m ? beolvas(m[1]) : null;
}
function utolsoAllapot() {
  if (typeof window === "undefined") return null;
  try {
    return ellenorzottAllapot(JSON.parse(window.localStorage.getItem(UTOLSO_KULCS) || "null"));
  } catch {
    return null;
  }
}

export default function EpitoOldal() {
  const [allapot, setAllapot] = useState(() => SABLONOK[0].allapot);
  const [lepes, setLepes] = useState(1);
  const [betoltve, setBetoltve] = useState(false);
  const [nev, setNev] = useState("Saját tartó");
  const [ellenorizve, setEllenorizve] = useState(false);
  const mentesIdo = useRef(null);

  // betöltés: URL → utolsó → sablon
  useEffect(() => {
    const u = urlAllapot();
    const t = u ?? utolsoAllapot();
    if (t && t.rudak.length) { setAllapot(t); setNev(u ? "Megosztott tartó" : "Saját tartó"); }
    setBetoltve(true);
    const hashValt = () => { const a = urlAllapot(); if (a) { setAllapot(a); setLepes(1); setNev("Megosztott tartó"); } };
    window.addEventListener("hashchange", hashValt);
    return () => window.removeEventListener("hashchange", hashValt);
  }, []);

  // az utolsó állapot automatikus mentése (késleltetve)
  useEffect(() => {
    if (!betoltve) return undefined;
    if (mentesIdo.current) clearTimeout(mentesIdo.current);
    mentesIdo.current = setTimeout(() => {
      try { window.localStorage.setItem(UTOLSO_KULCS, JSON.stringify(tomorit(allapot))); } catch { /* semmi */ }
    }, 400);
    return () => { if (mentesIdo.current) clearTimeout(mentesIdo.current); };
  }, [allapot, betoltve]);

  const jelzes = useMemo(() => allapotJelzes(allapot), [allapot]);
  const modell = useMemo(() => motorModell(allapot), [allapot]);
  const valtoztat = useCallback((uj) => { setAllapot(uj); setNev("Saját tartó"); setEllenorizve(false); }, []);

  const tovabb = () => { if (jelzes.kod === "kesz") { setLepes(2); setEllenorizve(false); } };
  const vissza = () => { setLepes(1); setEllenorizve(false); };

  return (
    <div className="min-w-0 space-y-4">
      {/* lépésjelző */}
      <ol className="flex flex-wrap gap-2">
        {LEPESEK.map((l) => {
          const aktiv = l.n === 1 ? lepes === 1 : l.n === 2 ? lepes === 2 && !ellenorizve : lepes === 2 && ellenorizve;
          const kesz = l.n < lepes || (l.n === 2 && lepes === 2 && ellenorizve);
          const kattinthato = l.n === 1 || (l.n === 2 && jelzes.kod === "kesz");
          return (
            <li key={l.n} className="min-w-0 flex-1 basis-40">
              <button type="button" disabled={!kattinthato} onClick={() => setLepes(l.n === 3 ? 2 : l.n)} className={`flex w-full items-center gap-2.5 rounded-xl border px-3 py-2 text-left transition disabled:cursor-default ${aktiv ? "border-naracs-400 bg-naracs-50" : kesz ? "border-emerald-300 bg-emerald-50" : "border-[color:var(--keret)] bg-white"}`}>
                <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[13px] font-bold ${aktiv ? "bg-naracs-500 text-white" : kesz ? "bg-emerald-600 text-white" : "bg-petrol-100 text-petrol-600"}`}>{kesz ? "✓" : l.n}</span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-semibold text-petrol-900">{l.nev}</span>
                  <span className="block truncate text-[11.5px] text-petrol-500">{l.leiras}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {lepes === 1 && <Epito allapot={allapot} onValtoztat={valtoztat} jelzes={jelzes} onTovabb={tovabb} />}
      {lepes === 2 && jelzes.e?.ok && <Rajzolo e={jelzes.e} modell={modell} nev={nev} onVissza={vissza} onEllenorzes={() => setEllenorizve(true)} />}
      {lepes === 2 && !jelzes.e?.ok && (
        <div className="rounded-xl border border-rose-300 bg-rose-50 p-4 text-[13px] text-rose-900">
          A tartó közben megváltozott és már nem oldható meg. <button type="button" onClick={vissza} className="font-semibold underline">Vissza az építéshez</button>
        </div>
      )}
    </div>
  );
}

