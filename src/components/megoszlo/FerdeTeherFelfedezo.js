"use client";

import { useEffect, useRef, useState } from "react";
import { Csuszka } from "@/components/abrak/ErovektorBonto";
import { M, MB } from "@/components/ui/Keplet";
import { sz, szK } from "@/lib/szamok";

/*
 * Felületre merőleges teher ferde rúdon – a két vetület.
 * Három nézet: a) a rúdra merőleges p teher, b) ugyanaz két vetületi teherre
 * bontva (függőleges p a vízszintes vetületen, vízszintes p a függőleges
 * vetületen), c) az eredők. A nézetek között a nyilak animálva csúsznak át.
 */

const SZ = 620;
const MA = 440;
const AX = 210; // a rúd alsó vége
const AY = 350;
const RUD = 260; // a rúd rajzolt hossza (px)
const PS = 6; // px / (kN/m)
const R_PX = 120; // az eredő nyíl rajzolt hossza (px) — a komponensek ehhez arányosak
const NAR = "#e2590a";
const TEAL = "#0f766e";
const KEK = "#2563eb";
const LILA = "#7c3aed";
const DB = 8;
const RAD = Math.PI / 180;

const NEZETEK = [
  { nev: "a) merőleges teher", cel: 0 },
  { nev: "b) a két vetületi teher", cel: 1 },
  { nev: "c) az eredők", cel: 2 },
];

function Hegy({ id, szin }) {
  return (
    <marker id={id} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
      <path d="M 0 1 L 9 5 L 0 9 z" fill={szin} />
    </marker>
  );
}

const lerp = (a, b, u) => a + (b - a) * u;
const clamp01 = (v) => Math.max(0, Math.min(1, v));

function useSimitott(cel, sebesseg = 5) {
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
      if (Math.abs(d) < 0.002) {
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

export default function FerdeTeherFelfedezo() {
  const [alfa, setAlfa] = useState(30);
  const [p, setP] = useState(4);
  const [L, setL] = useState(6);
  const [nezet, setNezet] = useState(0);
  const t = useSimitott(nezet); // 0 … 2, simán

  const c = Math.cos(alfa * RAD);
  const s = Math.sin(alfa * RAD);
  const a = L * c; // vízszintes vetület
  const b = L * s; // függőleges vetület
  const R = p * L;
  const Rx = p * b; // = pL sinα
  const Ry = p * a; // = pL cosα
  const RS = R_PX / R; // px / kN, hogy az eredő mindig jól látható hosszú legyen

  // rajz
  const BX = AX + RUD * c;
  const BY = AY - RUD * s;
  const H = p * PS;
  const nTail = { x: -s, y: -c }; // a rúd „fölé” (bal-fel) mutató egységvektor, ide kerül a nyilak farka
  const wA = 1 - clamp01(Math.abs(t - 0)); // a) nézet súlya
  const wB = 1 - clamp01(Math.abs(t - 1));
  const wC = 1 - clamp01(Math.abs(t - 2));
  const ab = clamp01(t); // 0: a-nézet, 1: b-nézet (és utána is 1)
  const bc = clamp01(t - 1); // 0: b-nézet, 1: c-nézet

  const felsoBlokkAlja = BY - 22; // a függőleges vetületi teher tömbjének alja
  const balBlokkJobbja = AX - 26; // a vízszintes vetületi teher tömbjének jobb széle
  const KOZ = { x: (AX + BX) / 2, y: (AY + BY) / 2 }; // a rúd felezőpontja

  const pontok = Array.from({ length: DB + 1 }, (_, i) => {
    const u = i / DB;
    return { x: lerp(AX, BX, u), y: lerp(AY, BY, u) };
  });

  const teherOp = 1 - 0.7 * bc; // a c) nézetben a megoszló terhek elhalványulnak

  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white">
      <div className="grid lg:grid-cols-[1.3fr_1fr] [&>*]:min-w-0">
        <div className="racs-vilagos border-b border-[color:var(--keret)] p-3 lg:border-r lg:border-b-0">
          <svg viewBox={`0 0 ${SZ} ${MA}`} className="abra w-full select-none">
            <defs>
              <Hegy id="ft-n" szin={NAR} />
              <Hegy id="ft-t" szin={TEAL} />
              <Hegy id="ft-k" szin={KEK} />
              <Hegy id="ft-l" szin={LILA} />
              <Hegy id="ft-m" szin="#94a3b8" />
            </defs>

            {/* a) a merőleges teher sávja */}
            <g opacity={wA * 0.9}>
              <path d={`M ${AX + nTail.x * H} ${AY + nTail.y * H} L ${BX + nTail.x * H} ${BY + nTail.y * H} L ${BX} ${BY} L ${AX} ${AY} Z`} fill={NAR} opacity="0.12" />
              <line x1={AX + nTail.x * H} y1={AY + nTail.y * H} x2={BX + nTail.x * H} y2={BY + nTail.y * H} stroke={NAR} strokeWidth="1.8" />
              <text x={KOZ.x + nTail.x * (H + 28)} y={KOZ.y + nTail.y * (H + 28) + 4} textAnchor="middle" style={{ fontSize: 12.5, fontWeight: 650, fill: NAR }}>
                p = {sz(p, 1)} kN/m
              </text>
            </g>

            {/* b) a vetületi tömbök */}
            <g opacity={wB * teherOp + wC * 0.3}>
              <rect x={AX} y={felsoBlokkAlja - H} width={BX - AX} height={H} fill={TEAL} opacity="0.14" stroke={TEAL} strokeWidth="1.4" />
              <rect x={balBlokkJobbja - H} y={BY} width={H} height={AY - BY} fill={KEK} opacity="0.14" stroke={KEK} strokeWidth="1.4" />
              {/* a tömbök feliratai a c) nézetben eltűnnek (ott a bal felső sarokban vannak az értékek) */}
              <g opacity={1 - bc}>
                <text x={KOZ.x} y={felsoBlokkAlja - H - 8} textAnchor="middle" style={{ fontSize: 12, fontWeight: 650, fill: TEAL }}>
                  p a vízszintes vetületen (a = {sz(a, 2)} m)
                </text>
                <text x={balBlokkJobbja - H / 2} y={AY + 18} textAnchor="middle" style={{ fontSize: 12, fontWeight: 650, fill: KEK }}>
                  p
                </text>
                <text x={balBlokkJobbja - H / 2 - 4} y={AY + 34} textAnchor="middle" style={{ fontSize: 11, fill: KEK }}>
                  a függőleges vetületen
                </text>
                <text x={balBlokkJobbja - H / 2 - 4} y={AY + 48} textAnchor="middle" style={{ fontSize: 11, fill: KEK }}>
                  (b = {sz(b, 2)} m)
                </text>
              </g>
            </g>

            {/* a nyilak: a merőleges nyíl farka a felső tömbhöz csúszik, közben egy vízszintes nyíl nő ki a bal tömbből */}
            {pontok.map((P, i) => {
              const tailA = { x: P.x + nTail.x * (H - 2), y: P.y + nTail.y * (H - 2) };
              const tailV = { x: P.x, y: felsoBlokkAlja };
              const tv = { x: lerp(tailA.x, tailV.x, ab), y: lerp(tailA.y, tailV.y, ab) };
              const th = { x: lerp(P.x, balBlokkJobbja, ab), y: P.y };
              const szinV = ab < 0.5 ? NAR : TEAL;
              const hegyV = ab < 0.5 ? "ft-n" : "ft-t";
              return (
                <g key={i} opacity={teherOp}>
                  <line x1={tv.x} y1={tv.y} x2={lerp(tv.x, P.x, 0.94)} y2={lerp(tv.y, P.y, 0.94)} stroke={szinV} strokeWidth="1.3" markerEnd={`url(#${hegyV})`} />
                  {ab > 0.05 && b > 0.05 && P.x - th.x > 8 && (
                    <line x1={th.x} y1={th.y} x2={P.x - 4} y2={P.y} stroke={KEK} strokeWidth="1.3" opacity={ab} markerEnd="url(#ft-k)" />
                  )}
                </g>
              );
            })}

            {/* a rúd */}
            <line x1={AX} y1={AY} x2={BX} y2={BY} stroke="#1d3c48" strokeWidth="5" strokeLinecap="round" />
            {/* szög */}
            <line x1={AX} y1={AY} x2={AX + 70} y2={AY} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 3" />
            <path d={`M ${AX + 46} ${AY} A 46 46 0 0 0 ${AX + 46 * c} ${AY - 46 * s}`} fill="none" stroke="#64748b" strokeWidth="1.2" />
            <text x={AX + 58 * Math.cos((alfa / 2) * RAD)} y={AY - 58 * Math.sin((alfa / 2) * RAD) + 4} style={{ fontSize: 11.5, fill: "#64748b" }}>
              α = {alfa}°
            </text>
            {/* méretek */}
            <line x1={AX} y1={AY + 50} x2={BX} y2={AY + 50} stroke="#94a3b8" strokeWidth="1" markerStart="url(#ft-m)" markerEnd="url(#ft-m)" />
            <text x={KOZ.x} y={AY + 64} textAnchor="middle" style={{ fontSize: 11.5, fill: "#64748b" }}>
              a = L cos α = {sz(a, 2)} m
            </text>
            <line x1={BX + 40} y1={BY} x2={BX + 40} y2={AY} stroke="#94a3b8" strokeWidth="1" markerStart="url(#ft-m)" markerEnd="url(#ft-m)" />
            <text x={BX + 56} y={KOZ.y} textAnchor="middle" transform={`rotate(-90 ${BX + 56} ${KOZ.y})`} style={{ fontSize: 11.5, fill: "#64748b" }}>
              b = L sin α = {sz(b, 2)} m
            </text>
            <text x={KOZ.x + 14 * s} y={KOZ.y + 14 * c + 4} style={{ fontSize: 11.5, fill: "#1d3c48" }} transform={`rotate(${-alfa} ${KOZ.x + 14 * s} ${KOZ.y + 14 * c})`} textAnchor="middle">
              L = {sz(L, 1)} m
            </text>

            {/* c) az eredők — a nyilak mellett csak a jel, az értékek a bal felső sarokban, hogy ne írják egymást felül */}
            <g opacity={wC}>
              {/* R merőlegesen */}
              <line x1={KOZ.x + nTail.x * R * RS} y1={KOZ.y + nTail.y * R * RS} x2={KOZ.x + nTail.x * 4} y2={KOZ.y + nTail.y * 4} stroke={LILA} strokeWidth="4" strokeLinecap="round" markerEnd="url(#ft-l)" />
              <text x={KOZ.x + nTail.x * (R * RS + 12)} y={KOZ.y + nTail.y * (R * RS + 12) + 4} textAnchor="middle" style={{ fontSize: 13, fontWeight: 700, fill: LILA, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
                R
              </text>
              {/* R_y függőleges (lefelé), R_x vízszintes (jobbra) */}
              {Ry * RS > 6 && (
                <>
                  <line x1={KOZ.x} y1={KOZ.y - Ry * RS} x2={KOZ.x} y2={KOZ.y - 4} stroke={TEAL} strokeWidth="3.2" strokeLinecap="round" markerEnd="url(#ft-t)" />
                  {/* meredek rúdnál balra, különben jobbra, hogy se a rúd, se az R felirat ne fedje */}
                  <text x={alfa > 60 ? KOZ.x - 7 : KOZ.x + 7} y={KOZ.y - Ry * RS - 5} textAnchor={alfa > 60 ? "end" : "start"} style={{ fontSize: 12.5, fontWeight: 650, fill: TEAL, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
                    Rᵧ
                  </text>
                </>
              )}
              {Rx * RS > 6 && (
                <>
                  <line x1={KOZ.x - Rx * RS} y1={KOZ.y} x2={KOZ.x - 4} y2={KOZ.y} stroke={KEK} strokeWidth="3.2" strokeLinecap="round" markerEnd="url(#ft-k)" />
                  <text x={KOZ.x - Rx * RS - 4} y={KOZ.y - 6} textAnchor="end" style={{ fontSize: 12.5, fontWeight: 650, fill: KEK, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
                    Rₓ
                  </text>
                </>
              )}
              {/* összegzés: a két komponens téglalapja */}
              <line x1={KOZ.x - Rx * RS} y1={KOZ.y} x2={KOZ.x - Rx * RS} y2={KOZ.y - Ry * RS} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 3" />
              <line x1={KOZ.x} y1={KOZ.y - Ry * RS} x2={KOZ.x - Rx * RS} y2={KOZ.y - Ry * RS} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 3" />
              <circle cx={KOZ.x} cy={KOZ.y} r="4" fill={LILA} stroke="white" strokeWidth="1.5" />
              {/* értékek */}
              <text x={16} y={22} style={{ fontSize: 12.5, fontWeight: 700, fill: LILA }}>R = pL = {sz(R, 1)} kN (⊥ a rúdra)</text>
              <text x={16} y={40} style={{ fontSize: 12, fontWeight: 650, fill: TEAL }}>Rᵧ = p·a = {sz(Ry, 1)} kN ↓</text>
              <text x={16} y={58} style={{ fontSize: 12, fontWeight: 650, fill: KEK }}>Rₓ = p·b = {sz(Rx, 1)} kN →</text>
            </g>

            {/* a nézet címe jobbra lent, hogy nagy α-nál és p-nél a felső vetületi tömb felirata ne érjen bele */}
            <text x={SZ - 14} y={MA - 12} textAnchor="end" style={{ fontSize: 12.5, fontWeight: 650, fill: "#275767" }}>
              {NEZETEK[nezet].nev}
            </text>
          </svg>
        </div>

        <div className="p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {NEZETEK.map((n, i) => (
              <button
                key={n.nev}
                type="button"
                onClick={() => setNezet(i)}
                className={`rounded-lg px-2.5 py-1.5 text-[12px] font-medium ring-1 transition ${i === nezet ? "bg-naracs-500 text-white ring-naracs-500" : "bg-white text-petrol-600 ring-petrol-200 hover:bg-petrol-50"}`}
              >
                {n.nev}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            <Csuszka cimke="a rúd hajlásszöge, α" ertek={alfa} egyseg="°" min={0} max={70} lepes={1} tizedes={0} onChange={setAlfa} />
            <Csuszka cimke="intenzitás a rúdra merőlegesen, p" ertek={p} egyseg="kN/m" min={1} max={10} lepes={0.5} tizedes={1} onChange={setP} />
            <Csuszka cimke="a rúd hossza, L" ertek={L} egyseg="m" min={2} max={8} lepes={0.5} tizedes={1} onChange={setL} />
          </div>

          <div className="mt-4 rounded-xl bg-petrol-50 p-3">
            <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">Élőben</p>
            <div className="szamok mt-1 text-[13px] text-petrol-800">
              <MB>{`R = p\\,L = ${szK(p, 1)}\\cdot ${szK(L, 1)} = ${szK(R, 2)}\\ \\text{kN}\\quad(\\perp\\ \\text{a rúdra, a közepén})`}</MB>
              <MB>{`R_y = p\\,a = p\\,L\\cos\\alpha = ${szK(p, 1)}\\cdot ${szK(a, 3)} = ${szK(Ry, 2)}\\ \\text{kN}\\ (\\downarrow)`}</MB>
              <MB>{`R_x = p\\,b = p\\,L\\sin\\alpha = ${szK(p, 1)}\\cdot ${szK(b, 3)} = ${szK(Rx, 2)}\\ \\text{kN}\\ (\\rightarrow)`}</MB>
              <MB>{`\\sqrt{R_x^2 + R_y^2} = \\sqrt{${szK(Rx, 2)}^2 + ${szK(Ry, 2)}^2} = ${szK(Math.hypot(Rx, Ry), 2)}\\ \\text{kN} = R\\ \\checkmark`}</MB>
            </div>
          </div>
          <p className="mt-2 text-[12px] text-petrol-500">
            A vetületi terhek intenzitása <em>ugyanaz a p</em>, csak a hosszuk más: <M>{"a = L\\cos\\alpha"}</M>, <M>{"b = L\\sin\\alpha"}</M>. Ezért{" "}
            <M>{"R_y = pL\\cos\\alpha"}</M> és <M>{"R_x = pL\\sin\\alpha"}</M> pontosan az R komponensei.
          </p>
        </div>
      </div>
    </div>
  );
}
