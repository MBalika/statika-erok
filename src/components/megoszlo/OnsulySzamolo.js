"use client";

import { useEffect, useRef, useState } from "react";
import { Csuszka } from "@/components/abrak/ErovektorBonto";
import { M, MB } from "@/components/ui/Keplet";
import { sz, szK } from "@/lib/szamok";

/*
 * Önsúly-számoló: b×h keresztmetszet + anyag (fajsúly) → q = A·γ [kN/m],
 * majd egy L hosszú gerenda G = q·L súlya. A gerendán a nyilak száma és
 * hossza a q-val nő (simán animálva).
 */

const ANYAGOK = [
  { nev: "vasbeton", gamma: 25, szin: "#64748b" },
  { nev: "acél", gamma: 78.5, szin: "#334155" },
  { nev: "fenyő", gamma: 5, szin: "#b45309" },
  { nev: "tégla", gamma: 18, szin: "#b91c1c" },
];

const SZ = 620;
const MA = 320;
const NAR = "#e2590a";
const LILA = "#7c3aed";

function Hegy({ id, szin }) {
  return (
    <marker id={id} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
      <path d="M 0 1 L 9 5 L 0 9 z" fill={szin} />
    </marker>
  );
}

/** Simán a célérték felé húzódó szám (rAF). */
function useSimitott(cel, sebesseg = 8) {
  const [ertek, setErtek] = useState(cel);
  const ref = useRef(cel);
  useEffect(() => {
    let raf = null;
    let utolso = null;
    const lep = (most) => {
      if (utolso == null) utolso = most;
      const dt = Math.min(0.05, (most - utolso) / 1000);
      utolso = most;
      const d = cel - ref.current;
      if (Math.abs(d) < 1e-4) {
        ref.current = cel;
        setErtek(cel);
        return;
      }
      ref.current += d * Math.min(1, sebesseg * dt);
      setErtek(ref.current);
      raf = requestAnimationFrame(lep);
    };
    raf = requestAnimationFrame(lep);
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [cel, sebesseg]);
  return ertek;
}

export default function OnsulySzamolo() {
  const [b, setB] = useState(30);
  const [h, setH] = useState(50);
  const [L, setL] = useState(6);
  const [anyag, setAnyag] = useState(0);

  const gamma = ANYAGOK[anyag].gamma;
  const A = (b / 100) * (h / 100); // m²
  const q = A * gamma; // kN/m
  const G = q * L;

  const qRajz = useSimitott(q);

  // keresztmetszet rajza (bal oldalon), 1 cm = 1,6 px, legfeljebb ~190 px
  const lept = Math.min(1.6, 180 / Math.max(b, h));
  const kx = 120;
  const ky = 160;
  const bw = b * lept;
  const bh = h * lept;

  // gerenda (jobb oldalon)
  const gx0 = 270;
  const gx1 = 590;
  const gy = 200;
  const gerendaMag = Math.max(8, Math.min(44, bh * 0.35));
  const nyilHossz = 10 + 70 * Math.pow(Math.max(qRajz, 0) / 100, 0.4);
  const db = Math.round(5 + 20 * Math.sqrt(Math.max(qRajz, 0) / 100));
  const anyagSzin = ANYAGOK[anyag].szin;

  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white">
      <div className="grid lg:grid-cols-[1.3fr_1fr]">
        <div className="racs-vilagos border-b border-[color:var(--keret)] p-3 lg:border-r lg:border-b-0">
          <svg viewBox={`0 0 ${SZ} ${MA}`} className="abra w-full select-none">
            <defs>
              <Hegy id="os-ero" szin={NAR} />
              <Hegy id="os-r" szin={LILA} />
              <Hegy id="os-m" szin="#94a3b8" />
            </defs>

            {/* keresztmetszet */}
            <text x={kx} y="28" textAnchor="middle" style={{ fontSize: 12, fontWeight: 650, fill: "#275767" }}>
              keresztmetszet
            </text>
            <rect x={kx - bw / 2} y={ky - bh / 2} width={bw} height={bh} fill={anyagSzin} opacity="0.22" stroke={anyagSzin} strokeWidth="1.8" style={{ transition: "all 0.25s" }} />
            <line x1={kx - bw / 2} y1={ky + bh / 2 + 16} x2={kx + bw / 2} y2={ky + bh / 2 + 16} stroke="#94a3b8" strokeWidth="1" markerStart="url(#os-m)" markerEnd="url(#os-m)" style={{ transition: "all 0.25s" }} />
            <text x={kx} y={ky + bh / 2 + 31} textAnchor="middle" style={{ fontSize: 11.5, fill: "#64748b", transition: "all 0.25s" }}>
              b = {b} cm
            </text>
            <line x1={kx + bw / 2 + 16} y1={ky - bh / 2} x2={kx + bw / 2 + 16} y2={ky + bh / 2} stroke="#94a3b8" strokeWidth="1" markerStart="url(#os-m)" markerEnd="url(#os-m)" style={{ transition: "all 0.25s" }} />
            <text x={kx + bw / 2 + 22} y={ky + 4} style={{ fontSize: 11.5, fill: "#64748b", transition: "all 0.25s" }}>
              h = {h} cm
            </text>
            <text x={kx} y={ky + bh / 2 + 50} textAnchor="middle" style={{ fontSize: 12.5, fontWeight: 650, fill: anyagSzin, transition: "all 0.25s" }}>
              A = b·h = {sz(A, 3)} m²
            </text>
            <text x={kx} y="46" textAnchor="middle" style={{ fontSize: 11.5, fill: "#475569" }}>
              {ANYAGOK[anyag].nev}: γ = {sz(gamma, 1)} kN/m³
            </text>

            {/* gerenda oldalnézet */}
            <text x={(gx0 + gx1) / 2} y="28" textAnchor="middle" style={{ fontSize: 12, fontWeight: 650, fill: "#275767" }}>
              a gerenda önsúlya vonal mentén
            </text>
            <rect x={gx0} y={gy - nyilHossz - 4} width={gx1 - gx0} height={nyilHossz} fill={NAR} opacity="0.1" />
            <line x1={gx0} y1={gy - nyilHossz - 4} x2={gx1} y2={gy - nyilHossz - 4} stroke={NAR} strokeWidth="1.8" />
            {Array.from({ length: db + 1 }, (_, i) => {
              const x = gx0 + ((gx1 - gx0) * i) / db;
              return <line key={i} x1={x} y1={gy - nyilHossz - 4} x2={x} y2={gy - 6} stroke={NAR} strokeWidth="1.3" markerEnd="url(#os-ero)" />;
            })}
            <text x={(gx0 + gx1) / 2} y={gy - nyilHossz - 12} textAnchor="middle" style={{ fontSize: 12.5, fontWeight: 650, fill: NAR, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
              q = {sz(q, 2)} kN/m
            </text>
            <rect x={gx0 - 6} y={gy} width={gx1 - gx0 + 12} height={gerendaMag} rx="2" fill={anyagSzin} opacity="0.35" stroke={anyagSzin} strokeWidth="1.6" style={{ transition: "all 0.25s" }} />
            <line x1={gx0} y1={gy + gerendaMag + 18} x2={gx1} y2={gy + gerendaMag + 18} stroke="#94a3b8" strokeWidth="1" markerStart="url(#os-m)" markerEnd="url(#os-m)" />
            <text x={(gx0 + gx1) / 2} y={gy + gerendaMag + 33} textAnchor="middle" style={{ fontSize: 11.5, fill: "#64748b" }}>
              L = {sz(L, 1)} m
            </text>
            {/* eredő: a gerenda súlya a közepén */}
            <line x1={(gx0 + gx1) / 2} y1={gy + gerendaMag + 44} x2={(gx0 + gx1) / 2} y2={gy + gerendaMag + 44 + 18 + Math.min(50, G * 0.5)} stroke={LILA} strokeWidth="3.4" strokeLinecap="round" markerEnd="url(#os-r)" />
            <text x={(gx0 + gx1) / 2 + 10} y={gy + gerendaMag + 62} style={{ fontSize: 12.5, fontWeight: 700, fill: LILA }}>
              G = qL = {sz(G, 1)} kN
            </text>
          </svg>
          <p className="mt-1 text-center text-[11.5px] text-petrol-400">A nyilak sűrűsége és hossza a q intenzitással nő.</p>
        </div>

        <div className="p-4 sm:p-5">
          <p className="mb-2 text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">Anyag (tájékoztató fajsúlyok)</p>
          <div className="mb-4 flex flex-wrap gap-1.5">
            {ANYAGOK.map((a, i) => (
              <button
                key={a.nev}
                type="button"
                onClick={() => setAnyag(i)}
                className={`rounded-lg px-2.5 py-1.5 text-[12px] font-medium ring-1 transition ${
                  i === anyag ? "bg-naracs-500 text-white ring-naracs-500" : "bg-white text-petrol-600 ring-petrol-200 hover:bg-petrol-50"
                }`}
              >
                {a.nev} · {sz(a.gamma, 1)} kN/m³
              </button>
            ))}
          </div>
          <div className="space-y-3">
            <Csuszka cimke="szélesség, b" ertek={b} egyseg="cm" min={5} max={100} lepes={1} tizedes={0} onChange={setB} />
            <Csuszka cimke="magasság, h" ertek={h} egyseg="cm" min={5} max={120} lepes={1} tizedes={0} onChange={setH} />
            <Csuszka cimke="a gerenda hossza, L" ertek={L} egyseg="m" min={1} max={12} lepes={0.5} tizedes={1} onChange={setL} />
          </div>

          <div className="mt-4 rounded-xl bg-petrol-50 p-3">
            <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">Élőben</p>
            <div className="szamok mt-1 text-[13px] text-petrol-800">
              <MB>{`A = b\\,h = ${szK(b / 100, 2)}\\cdot ${szK(h / 100, 2)} = ${szK(A, 3)}\\ \\text{m}^2`}</MB>
              <MB>{`q = A\\,\\gamma = ${szK(A, 3)}\\cdot ${szK(gamma, 1)} = ${szK(q, 2)}\\ \\text{kN/m}`}</MB>
              <MB>{`G = q\\,L = ${szK(q, 2)}\\cdot ${szK(L, 1)} = ${szK(G, 1)}\\ \\text{kN}`}</MB>
            </div>
          </div>
          <p className="mt-2 text-[12px] text-petrol-500">
            A térfogat mentén megoszló önsúlyt (<M>{"\\gamma = \\varrho g"}</M>) keresztmetszetenként „összegyűjtve” vonal menti teher lesz:{" "}
            <M>{"q = A\\gamma"}</M>. A fajsúlyok tájékoztató értékek — a tervezésben szabványos értékekkel számolunk.
          </p>
        </div>
      </div>
    </div>
  );
}
