"use client";

import { useEffect, useState } from "react";
import { useHaladas, modulSzazalek, jelvenyek, haladasTorles } from "@/lib/haladas";
import { modulok } from "@/lib/oldalterkep";

/*
 * Haladás-kijelzés a kezdőlap modulkártyáihoz (localStorage-ból, csak a böngészőben).
 *   <HaladasJelzo slug="/vektorok" />  – körgyűrű + jelvények + rövid szöveg egy kártyában
 *   <HaladasOsszesito />               – a modulok együtt, egy sorban
 *   <HaladasTorlesGomb />              – kétlépcsős törlés („Biztos?”)
 */

const MODUL_LISTA = modulok.filter((m) => m.slug !== "/");

/** Kis körgyűrű-diagram (SVG) a modul készültségével. */
export function HaladasGyuru({ szazalek, meret = 44, vastag = 5 }) {
  const r = (meret - vastag) / 2;
  const kerulet = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(100, szazalek || 0));
  const szin = p >= 80 ? "#059669" : p >= 40 ? "#e2590a" : "#2e6c7f";
  return (
    <svg width={meret} height={meret} viewBox={`0 0 ${meret} ${meret}`} className="shrink-0" role="img" aria-label={`${p} % kész`}>
      <circle cx={meret / 2} cy={meret / 2} r={r} fill="none" stroke="rgba(100,116,139,0.18)" strokeWidth={vastag} />
      <circle
        cx={meret / 2}
        cy={meret / 2}
        r={r}
        fill="none"
        stroke={szin}
        strokeWidth={vastag}
        strokeLinecap="round"
        strokeDasharray={`${(kerulet * p) / 100} ${kerulet}`}
        transform={`rotate(-90 ${meret / 2} ${meret / 2})`}
        style={{ transition: "stroke-dasharray .6s ease" }}
      />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fontSize={meret * 0.27} fontWeight="700" fill="currentColor">
        {p}%
      </text>
    </svg>
  );
}

function reszletek(m) {
  const r = [];
  if (m.feladat) r.push(`${m.feladat} feladat`);
  if (m.kvizOsszes) r.push(`kvíz ${m.kviz}/${m.kvizOsszes}`);
  if (m.jatek) r.push(`játék ${m.jatek}`);
  return r.join(" · ");
}

/** Egy modul haladása – a kezdőlap kártyájába illesztve. */
export function HaladasJelzo({ slug }) {
  const adat = useHaladas();
  const m = adat[slug];
  const szazalek = modulSzazalek(m);
  const jelek = jelvenyek(m);
  const vanAdat = m && (m.feladat || m.kvizOsszes || m.jatek);

  return (
    <div className="mt-3 flex items-center gap-3 border-t border-petrol-100 pt-3 text-petrol-900 sm:pr-24">
      <HaladasGyuru szazalek={szazalek} />
      <div className="min-w-0">
        {vanAdat ? (
          <>
            <p className="truncate text-[12.5px] text-petrol-600">{reszletek(m)}</p>
            {jelek.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {jelek.map((j) => (
                  <span
                    key={j.cim}
                    title={j.cim}
                    className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800"
                  >
                    <span aria-hidden="true">{j.jel}</span>
                    {j.cim}
                  </span>
                ))}
              </div>
            )}
          </>
        ) : (
          <p className="text-[12.5px] text-petrol-500">még nem kezdted el</p>
        )}
      </div>
    </div>
  );
}

/** Összesítő sor: a modulok készültsége egymás mellett + átlag. */
export function HaladasOsszesito() {
  const adat = useHaladas();
  const ertekek = MODUL_LISTA.map((m) => modulSzazalek(adat[m.slug]));
  const atlag = Math.round(ertekek.reduce((a, b) => a + b, 0) / Math.max(1, ertekek.length));
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-petrol-900">
      <div className="flex items-center gap-2">
        <HaladasGyuru szazalek={atlag} meret={36} vastag={4} />
        <span className="text-[13px] font-semibold text-petrol-800">összesen</span>
      </div>
      {MODUL_LISTA.map((m, i) => (
        <div key={m.slug} className="flex items-center gap-1.5 text-[12.5px] text-petrol-600">
          <span className="grid h-5 w-5 place-items-center rounded-md bg-petrol-100 text-[11px] font-bold text-petrol-700">{m.szam}</span>
          <span className="szamok">{ertekek[i]}%</span>
        </div>
      ))}
    </div>
  );
}

/** „Haladás törlése” – első kattintásra megerősítést kér, a másodikra töröl. */
export function HaladasTorlesGomb() {
  const [fazis, setFazis] = useState(0); // 0: nyugalom, 1: „Biztos?”, 2: törölve
  useEffect(() => {
    if (fazis === 0) return;
    const t = setTimeout(() => setFazis(0), fazis === 1 ? 4000 : 2500);
    return () => clearTimeout(t);
  }, [fazis]);

  if (fazis === 2) {
    return <span className="text-[12px] text-emerald-700">A haladás törölve.</span>;
  }
  return (
    <button
      type="button"
      onClick={() => {
        if (fazis === 0) setFazis(1);
        else {
          haladasTorles();
          setFazis(2);
        }
      }}
      className={`rounded-lg px-2.5 py-1 text-[12px] font-medium ring-1 transition ${
        fazis === 1 ? "bg-rose-50 text-rose-800 ring-rose-300 hover:bg-rose-100" : "bg-white text-petrol-500 ring-petrol-200 hover:bg-petrol-50"
      }`}
    >
      {fazis === 1 ? "Biztos? Kattints még egyszer a törléshez" : "Haladás törlése"}
    </button>
  );
}

/** Teljes blokk: összesítő balra, törlés jobbra (a modulok szakasz aljára). */
export default function HaladasKartyak() {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[color:var(--keret)] bg-white px-4 py-3">
      <HaladasOsszesito />
      <HaladasTorlesGomb />
    </div>
  );
}
