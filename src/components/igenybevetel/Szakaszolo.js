"use client";

import { useMemo, useRef, useState } from "react";
import { elemez } from "@/lib/tarto";
import Diagram, { geometria } from "@/components/igenybevetel/Diagram";
import { sz } from "@/lib/szamok";

/**
 * Szakaszoló: a hallgató kattintással jelöli meg egy vízszintes tartón, hol
 * kezdődik új szakasz az igénybevételi ábrákon (0,5 m-es rácsra pattan);
 * az „Ellenőrzés” összeveti a számítómag szakaszhatáraival, és minden
 * határhoz megmondja az okát (támasz, koncentrált erő/nyomaték, megoszló
 * teher kezdete/vége, belső csukló).
 */

const FELADATOK = [
  {
    nev: "Kéttámaszú tartó: F és részleges p",
    modell: {
      csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "B", x: 8, y: 0 }],
      rudak: [{ id: "1", a: "A", b: "B" }],
      tamaszok: [{ csomopont: "A", tipus: "csuklo" }, { csomopont: "B", tipus: "gorgo", szog: 90 }],
      terhek: [{ fajta: "pontTeher", rud: "1", a: 2, F: -10, irany: "y" }, { fajta: "megoszlo", rud: "1", a1: 4, a2: 8, p1: -3, irany: "y" }],
    },
  },
  {
    nev: "Konzolos tartó: p és koncentrált nyomaték",
    modell: {
      csomopontok: [{ id: "C", x: 0, y: 0 }, { id: "A", x: 2, y: 0 }, { id: "B", x: 6, y: 0 }, { id: "D", x: 8, y: 0 }],
      rudak: [{ id: "1", a: "C", b: "A" }, { id: "2", a: "A", b: "B" }, { id: "3", a: "B", b: "D" }],
      tamaszok: [{ csomopont: "A", tipus: "csuklo" }, { csomopont: "B", tipus: "gorgo", szog: 90 }],
      terhek: [{ fajta: "megoszlo", rud: "1", p1: -4, irany: "y" }, { fajta: "megoszlo", rud: "2", a1: 0, a2: 2, p1: -4, irany: "y" }, { fajta: "csomopontiNyomatek", csomopont: "D", M: -8 }],
    },
  },
  {
    nev: "Konzol: két erő és nyomaték a közepén",
    modell: {
      csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "B", x: 8, y: 0 }],
      rudak: [{ id: "1", a: "A", b: "B" }],
      tamaszok: [{ csomopont: "A", tipus: "befogas" }],
      terhek: [{ fajta: "pontTeher", rud: "1", a: 3, F: -8, irany: "y" }, { fajta: "pontNyomatek", rud: "1", a: 5, M: 12 }, { fajta: "csomopontiEro", csomopont: "B", Fy: -5 }],
    },
  },
  {
    nev: "Gerber-tartó: belső csukló és teher",
    modell: {
      csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "G", x: 3, y: 0 }, { id: "B", x: 8, y: 0 }],
      rudak: [{ id: "1", a: "A", b: "G" }, { id: "2", a: "G", b: "B", csukloA: true }],
      tamaszok: [{ csomopont: "A", tipus: "befogas" }, { csomopont: "B", tipus: "gorgo", szog: 90 }],
      terhek: [{ fajta: "megoszlo", rud: "2", a1: 2, a2: 5, p1: -4, irany: "y" }, { fajta: "pontTeher", rud: "1", a: 1.5, F: -6, irany: "y" }],
    },
  },
  {
    nev: "Két konzolos vég, ferde erő",
    modell: {
      csomopontok: [{ id: "C", x: 0, y: 0 }, { id: "A", x: 1, y: 0 }, { id: "B", x: 7, y: 0 }, { id: "D", x: 8, y: 0 }],
      rudak: [{ id: "1", a: "C", b: "A" }, { id: "2", a: "A", b: "B" }, { id: "3", a: "B", b: "D" }],
      tamaszok: [{ csomopont: "A", tipus: "csuklo" }, { csomopont: "B", tipus: "gorgo", szog: 90 }],
      terhek: [{ fajta: "megoszlo", rud: "2", a1: 0, a2: 2.5, p1: -3, irany: "y" }, { fajta: "pontTeher", rud: "2", a: 4.5, F: 10, irany: "szog", szog: -60 }, { fajta: "csomopontiEro", csomopont: "D", Fy: -4 }],
    },
  },
];

/** A tényleges szakaszhatárok (globális x) az okukkal, a tartó belsejében. */
function hatarok(e) {
  const m = e.modell;
  const lista = new Map();
  const add = (x, ok) => {
    const k = Math.round(x * 1000) / 1000;
    if (!lista.has(k)) lista.set(k, new Set());
    lista.get(k).add(ok);
  };
  m.tamaszok.forEach((t) => add(m.csomopontok[t.ics].x, "támasz (a reakció koncentrált erő: V ugrik, M törik)"));
  m.csomopontiTerhek.forEach((t, i) => {
    if (Math.abs(t.Fx) + Math.abs(t.Fy) > 1e-9) add(m.csomopontok[i].x, "koncentrált erő (V ugrik, M törik)");
    if (Math.abs(t.M) > 1e-9) add(m.csomopontok[i].x, "koncentrált nyomaték (M ugrik)");
  });
  for (const r of m.rudak) {
    if (r.csukloA) add(r.x1, "belső csukló (itt M = 0)");
    if (r.csukloB) add(r.x2, "belső csukló (itt M = 0)");
    for (const p of r.pontTerhek) {
      if (Math.abs(p.Px) + Math.abs(p.Py) > 1e-9) add(r.x1 + p.a * r.cos, "koncentrált erő (V ugrik, M törik)");
      if (Math.abs(p.Mz) > 1e-9) add(r.x1 + p.a * r.cos, "koncentrált nyomaték (M ugrik)");
    }
    for (const q of r.megoszlok) {
      add(r.x1 + q.a1 * r.cos, "a megoszló teher kezdete (V-ben törés, M-ben a parabola indul)");
      add(r.x1 + q.a2 * r.cos, "a megoszló teher vége (V-ben törés, M érintőlegesen megy át)");
    }
  }
  const xs = m.csomopontok.map((c) => c.x);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  // a rudak közös csomópontjai, ha nincs más ok: a belső csomópont önmagában nem határ; a tartóvégek sem
  return [...lista.entries()].filter(([x]) => x > minX + 1e-6 && x < maxX - 1e-6).map(([x, okok]) => ({ x, okok: [...okok] })).sort((a, b) => a.x - b.x);
}

export default function Szakaszolo() {
  const [idx, setIdx] = useState(0);
  const [jelek, setJelek] = useState([]);
  const [ellen, setEllen] = useState(false);
  const ref = useRef(null);
  const feladat = FELADATOK[idx];
  const e = useMemo(() => elemez(feladat.modell), [feladat]);
  const g = useMemo(() => geometria(e, { szel: 600 }), [e]);
  const helyes = useMemo(() => hatarok(e), [e]);

  const uj = (i) => { setIdx(i); setJelek([]); setEllen(false); };

  const katt = (ev) => {
    const svg = ref.current?.querySelector("svg");
    if (!svg || ellen) return;
    const r = svg.getBoundingClientRect();
    const px = ((ev.clientX - r.left) / r.width) * 600;
    let x = Math.round(((px - g.kx(0)) / g.L) * 2) / 2;
    if (x <= g.minX + 1e-6 || x >= g.maxX - 1e-6) return;
    setJelek((j) => (j.some((v) => Math.abs(v - x) < 1e-6) ? j.filter((v) => Math.abs(v - x) > 1e-6) : [...j, x].sort((a, b) => a - b)));
  };

  const talalat = (x) => helyes.some((h) => Math.abs(h.x - x) < 1e-6);
  const hianyzo = helyes.filter((h) => !jelek.some((x) => Math.abs(h.x - x) < 1e-6));
  const jo = jelek.filter(talalat).length, rossz = jelek.length - jo;
  const teljes = ellen && rossz === 0 && hianyzo.length === 0;

  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white shadow-sm shadow-petrol-900/[0.04]">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-b border-[color:var(--keret)] bg-linear-to-r from-petrol-800 to-petrol-700 px-5 py-3.5">
        <span className="rounded-md bg-naracs-500 px-2 py-0.5 text-[10.5px] font-bold tracking-[0.14em] text-white uppercase">Felfedező</span>
        <h3 className="text-[15px] font-semibold text-white">Szakaszoló — hol kezdődik új szakasz?</h3>
        <span className="ml-auto text-[11.5px] text-petrol-200">kattints a tartóra (0,5 m-es rács)</span>
      </div>
      <div className="flex flex-wrap gap-1.5 border-b border-[color:var(--keret)] bg-petrol-50/60 px-4 py-2.5">
        {FELADATOK.map((f, i) => (
          <button key={i} type="button" onClick={() => uj(i)} className={`rounded-lg px-3 py-1.5 text-[12px] font-semibold transition ${i === idx ? "bg-petrol-800 text-white" : "bg-white text-petrol-700 ring-1 ring-petrol-200 hover:bg-petrol-50"}`}>{i + 1}. {f.nev}</button>
        ))}
      </div>
      <div className="grid lg:grid-cols-[1.5fr_1fr] [&>*]:min-w-0">
        <div ref={ref} onClick={katt} className={`racs-vilagos border-b border-[color:var(--keret)] p-3 lg:border-r lg:border-b-0 ${ellen ? "" : "cursor-crosshair"}`}>
          <Diagram eredmeny={e} abrak={ellen ? ["V", "M"] : []} amp={30} reakciok={false} meretek gyerekek={({ g: gg, szerkFent }) => (
            <g>
              {jelek.map((x) => {
                const X = gg.kx(x);
                const ok = talalat(x);
                const szin = ellen ? (ok ? "#059669" : "#be123c") : "#0e7490";
                return (
                  <g key={x}>
                    <line x1={X} y1={szerkFent - 30} x2={X} y2={szerkFent + 30} stroke={szin} strokeWidth="2" strokeDasharray="4 3" />
                    <circle cx={X} cy={szerkFent} r="5" fill={szin} stroke="white" strokeWidth="1.5" />
                    <text x={X} y={szerkFent - 36} textAnchor="middle" fontSize="11" fontWeight="700" style={{ fill: szin, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>{ellen ? (ok ? "✓" : "✗") : sz(x - gg.minX, 1)}</text>
                  </g>
                );
              })}
              {ellen && hianyzo.map((h) => (
                <g key={`h${h.x}`}>
                  <circle cx={gg.kx(h.x)} cy={szerkFent} r="9" fill="none" stroke="#d97706" strokeWidth="2.2" strokeDasharray="3 2" />
                  <text x={gg.kx(h.x)} y={szerkFent - 36} textAnchor="middle" fontSize="11" fontWeight="700" style={{ fill: "#d97706", paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>hiányzik</text>
                </g>
              ))}
            </g>
          )} />
          <p className="mt-1 text-center text-[11.5px] text-petrol-500">{ellen ? "Zöld: helyes határ, piros: fölösleges, narancs: hiányzó. Alatta a V és M ábra — nézd meg, tényleg ott változik-e a jelleg." : "Kattints oda, ahol az N, V vagy M ábra jellege megváltozhat (ismételt kattintás töröl). A tartó két vége nem számít."}</p>
        </div>
        <div className="p-4 sm:p-5">
          <p className="text-[13px] leading-relaxed text-petrol-700">
            Szakaszhatár ott van, ahol a teher jellege megváltozik: koncentrált erő vagy nyomaték támadáspontja (a támaszok reakciója is az!), a megoszló teher kezdete és vége, belső csukló, a tengely törése vagy elágazása.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={() => setEllen(true)} disabled={ellen} className="rounded-lg bg-petrol-800 px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-40">Ellenőrzés</button>
            <button type="button" onClick={() => { setJelek([]); setEllen(false); }} className="rounded-lg bg-white px-4 py-2 text-[13px] font-semibold text-petrol-700 ring-1 ring-petrol-200">Törlés</button>
            <button type="button" onClick={() => uj((idx + 1) % FELADATOK.length)} className="rounded-lg bg-white px-4 py-2 text-[13px] font-semibold text-petrol-700 ring-1 ring-petrol-200">Következő tartó</button>
          </div>
          <p className="mt-3 text-[12.5px] text-petrol-600">Jelölt határok: {jelek.length ? jelek.map((x) => `${sz(x - g.minX, 1)} m`).join(", ") : "még nincs"}.</p>
          {ellen && (
            <div className={`mt-3 rounded-xl px-4 py-3 text-[13px] ring-1 ${teljes ? "bg-emerald-50 text-emerald-900 ring-emerald-200" : "bg-amber-50 text-amber-900 ring-amber-200"}`}>
              <p className="font-semibold">{teljes ? "Hibátlan — minden szakaszhatár megvan." : `${jo} helyes, ${rossz} fölösleges, ${hianyzo.length} hiányzó.`}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {helyes.map((h) => (
                  <li key={h.x}><strong>x = {sz(h.x - g.minX, 1)} m:</strong> {h.okok.join("; ")}</li>
                ))}
              </ul>
              {rossz > 0 && <p className="mt-2 text-[12px]">A fölösleges jelöléseknél a teher nem változik: ott az ábrák jellege ugyanaz marad — a szakaszt fölöslegesen bontanád ketté (nem hiba, csak több munka).</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
