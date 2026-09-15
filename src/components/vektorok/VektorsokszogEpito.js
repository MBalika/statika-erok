"use client";

import { useState } from "react";
import { MB } from "@/components/ui/Keplet";
import { useUszoSzam } from "./useUszo";

/*
 * A tankönyv 3.2. ábrája: négy erő közös metszéspontban.
 *   F1 = 2 kN felfelé
 *   F2 = 2 kN, 30°-ra a függőlegestől jobbra → (2 sin30; 2 cos30) = (1; 1,732)
 *   F3 = 2,5 kN vízszintesen jobbra
 *   F4 = 4 kN, 30°-kal a vízszintes alá → (4 cos30; −4 sin30) = (3,464; −2)
 *   R = (6,964; 1,732) kN, |R| = 7,176 kN, αR = 13,97°
 */
const RAD = Math.PI / 180;
const EROK = [
  { nev: "F₁", x: 0, y: 2, szin: "#e2590a", kn: "2 kN" },
  { nev: "F₂", x: 2 * Math.sin(30 * RAD), y: 2 * Math.cos(30 * RAD), szin: "#0f766e", kn: "2 kN" },
  { nev: "F₃", x: 2.5, y: 0, szin: "#2563eb", kn: "2,5 kN" },
  { nev: "F₄", x: 4 * Math.cos(30 * RAD), y: -4 * Math.sin(30 * RAD), szin: "#be123c", kn: "4 kN" },
];
const LILA = "#7c3aed";
const SZURKE = "#64748b";

// a lánc csomópontjai
const LANC = [{ x: 0, y: 0 }];
EROK.forEach((e) => LANC.push({ x: LANC[LANC.length - 1].x + e.x, y: LANC[LANC.length - 1].y + e.y }));
const R = LANC[4];

const E = 30; // képpont / kN
// geometriai ábra (bal) és vektorábra (jobb) origója
const G = { x: 95, y: 200 };
const V = { x: 290, y: 250 };
const GE = 26; // a geometriai ábra léptéke (csak az irányokat mutatja)
const gx = (x) => G.x + x * GE;
const gy = (y) => G.y - y * GE;
const vx = (x) => V.x + x * E;
const vy = (y) => V.y - y * E;

const KIJELENTESEK = [
  { k: "(\\underline{F}_1, \\underline{F}_2, \\underline{F}_3, \\underline{F}_4) \\ekv \\underline{R}", mag: "A kiinduló egyenértékűségi kijelentés: a négy erő együtt ugyanazt a hatást fejti ki, mint az eredő." },
  { k: "(\\underline{F}_1, \\underline{F}_2, \\underline{F}_3, \\underline{F}_4) \\ekv \\underline{R}", mag: "Az F₁-et felmérjük a vektorábrában (erőlépték: 1 kN = 30 px)." },
  { k: "\\underline{R}_{12} \\ekv (\\underline{F}_1, \\underline{F}_2) \\quad\\Rightarrow\\quad (\\underline{R}_{12}, \\underline{F}_3, \\underline{F}_4) \\ekv \\underline{R}", mag: "Az F₂-t az F₁ végéhez fűzzük; a részeredő R₁₂ helyettesíti az első két erőt." },
  { k: "\\underline{R}_{123} \\ekv (\\underline{R}_{12}, \\underline{F}_3) \\quad\\Rightarrow\\quad (\\underline{R}_{123}, \\underline{F}_4) \\ekv \\underline{R}", mag: "Az F₃ jön a lánc végére; R₁₂₃ már három erőt helyettesít." },
  { k: "\\underline{R} \\ekv (\\underline{R}_{123}, \\underline{F}_4)", mag: "Az F₄ zárja a nyílt vektorsokszöget: az eredő az első vektor kezdőpontjából az utolsó végpontjába mutat." },
];

function Hegy({ id, szin }) {
  return (
    <marker id={id} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
      <path d="M 0 1 L 9 5 L 0 9 z" fill={szin} />
    </marker>
  );
}

function Nyil({ x1, y1, x2, y2, u = 1, szin, hegy, vastag = 3, opacitas = 1, szaggatott = false }) {
  if (u <= 0.02) return null;
  const ex = x1 + (x2 - x1) * u;
  const ey = y1 + (y2 - y1) * u;
  return (
    <line
      x1={x1}
      y1={y1}
      x2={ex}
      y2={ey}
      stroke={szin}
      strokeWidth={vastag}
      strokeLinecap="round"
      strokeDasharray={szaggatott ? "6 4" : undefined}
      markerEnd={`url(#${hegy})`}
      opacity={opacitas}
    />
  );
}

function Felirat({ x, y, children, szin, meret = 12.5, horgony = "middle", opacitas = 1 }) {
  return (
    <text x={x} y={y} textAnchor={horgony} fontWeight={650} opacity={opacitas} style={{ fontSize: meret, fill: szin, paintOrder: "stroke", stroke: "white", strokeWidth: 3.5 }}>
      {children}
    </text>
  );
}

export default function VektorsokszogEpito() {
  const [lepes, setLepes] = useState(0); // 0..4
  const [reszeredok, setReszeredok] = useState(true);
  const uszo = useUszoSzam(lepes, 650);
  const u = (i) => Math.max(0, Math.min(1, uszo - (i - 1))); // az i-edik erő kihúzódása

  const kesz = lepes >= 4;

  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white">
      <div className="grid lg:grid-cols-[1.3fr_1fr] [&>*]:min-w-0">
        <div className="racs-vilagos border-b border-[color:var(--keret)] p-3 lg:border-r lg:border-b-0">
          <svg viewBox="0 0 600 330" className="abra w-full select-none">
            <defs>
              {EROK.map((e, i) => (
                <Hegy key={i} id={`vs-${i}`} szin={e.szin} />
              ))}
              <Hegy id="vs-r" szin={LILA} />
              <Hegy id="vs-sz" szin={SZURKE} />
              <Hegy id="vs-t" szin="#475569" />
            </defs>

            {/* ---- geometriai ábra ---- */}
            <text x="24" y="24" fontWeight="700" style={{ fontSize: 11.5, fill: "#275767" }}>
              geometriai ábra
            </text>
            <line x1={G.x - 70} y1={G.y} x2={G.x + 130} y2={G.y} stroke="#475569" strokeWidth="1.1" markerEnd="url(#vs-t)" />
            <line x1={G.x} y1={G.y + 80} x2={G.x} y2={G.y - 100} stroke="#475569" strokeWidth="1.1" markerEnd="url(#vs-t)" />
            <text x={G.x + 134} y={G.y + 4} fontStyle="italic" style={{ fontSize: 12, fill: "#1d3c48" }}>x</text>
            <text x={G.x + 6} y={G.y - 102} fontStyle="italic" style={{ fontSize: 12, fill: "#1d3c48" }}>y</text>
            {EROK.map((e, i) => {
              const aktivan = lepes >= i + 1;
              const cimke = [
                { x: gx(0) - 8, y: gy(2) - 2, h: "end" },
                { x: gx(1) + 4, y: gy(1.732) - 12, h: "start" },
                { x: gx(2.5) + 4, y: gy(0) + 16, h: "start" },
                { x: gx(3.464) + 6, y: gy(-2) + 14, h: "start" },
              ][i];
              return (
                <g key={e.nev} opacity={aktivan ? 1 : 0.45} style={{ transition: "opacity 0.3s" }}>
                  <line x1={G.x} y1={G.y} x2={gx(e.x)} y2={gy(e.y)} stroke={e.szin} strokeWidth={aktivan ? 3 : 2.2} strokeLinecap="round" markerEnd={`url(#vs-${i})`} />
                  <Felirat x={cimke.x} y={cimke.y} szin={e.szin} meret={11.5} horgony={cimke.h}>
                    {e.nev} = {e.kn}
                  </Felirat>
                </g>
              );
            })}
            {/* szögjelölések */}
            <path d={`M ${G.x} ${G.y - 22} A 22 22 0 0 1 ${G.x + 11} ${G.y - 19}`} fill="none" stroke="#0f766e" strokeWidth="1" />
            <text x={G.x + 11} y={G.y - 48} textAnchor="middle" style={{ fontSize: 10, fill: "#0f766e", paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>30°</text>
            <path d={`M ${G.x + 30} ${G.y} A 30 30 0 0 1 ${G.x + 26} ${G.y + 15}`} fill="none" stroke="#be123c" strokeWidth="1" />
            <text x={G.x + 36} y={G.y + 20} style={{ fontSize: 10, fill: "#be123c", paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>30°</text>
            {/* az eredő a geometriai ábrában, a végén */}
            {kesz && (
              <g>
                {/* a geometriai ábrán csak az eredő hatásvonala és iránya számít, a hosszát a vektorábra adja */}
                <Nyil x1={G.x} y1={G.y} x2={gx((R.x / 7.176) * 3.6)} y2={gy((R.y / 7.176) * 3.6)} u={u(4)} szin={LILA} hegy="vs-r" vastag={3.6} />
                <Felirat x={gx((R.x / 7.176) * 3.6) + 8} y={gy((R.y / 7.176) * 3.6) - 6} szin={LILA} opacitas={u(4)} horgony="start">R</Felirat>
              </g>
            )}

            {/* ---- vektorábra ---- */}
            <text x="262" y="24" fontWeight="700" style={{ fontSize: 11.5, fill: "#275767" }}>
              vektorábra
            </text>
            <line x1="262" y1="38" x2={262 + E} y2="38" stroke="#475569" strokeWidth="1.2" />
            <line x1="262" y1="34" x2="262" y2="42" stroke="#475569" strokeWidth="1.2" />
            <line x1={262 + E} y1="34" x2={262 + E} y2="42" stroke="#475569" strokeWidth="1.2" />
            <text x={262 + E + 6} y="42" style={{ fontSize: 10.5, fill: "#475569" }}>1 kN (erőlépték)</text>
            <line x1="245" y1="10" x2="245" y2="320" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />

            <circle cx={vx(0)} cy={vy(0)} r="3.5" fill="#1d3c48" />

            {/* a lánc */}
            {EROK.map((e, i) => (
              <g key={e.nev}>
                <Nyil x1={vx(LANC[i].x)} y1={vy(LANC[i].y)} x2={vx(LANC[i + 1].x)} y2={vy(LANC[i + 1].y)} u={u(i + 1)} szin={e.szin} hegy={`vs-${i}`} />
                {u(i + 1) > 0.9 && (
                  <Felirat
                    x={vx((LANC[i].x + LANC[i + 1].x) / 2) + [-14, -14, 0, 14][i]}
                    y={vy((LANC[i].y + LANC[i + 1].y) / 2) + [0, 0, -8, -6][i]}
                    szin={e.szin}
                    meret={12}
                  >
                    {e.nev}
                  </Felirat>
                )}
              </g>
            ))}

            {/* részeredők */}
            {reszeredok && (
              <>
                <Nyil x1={vx(0)} y1={vy(0)} x2={vx(LANC[2].x)} y2={vy(LANC[2].y)} u={u(2)} szin={SZURKE} hegy="vs-sz" vastag={2} szaggatott opacitas={lepes >= 3 ? 0.45 : 0.9} />
                {u(2) > 0.9 && (
                  <Felirat x={vx(LANC[2].x / 2) + 22} y={vy(LANC[2].y / 2) + 4} szin={SZURKE} meret={11.5} opacitas={lepes >= 3 ? 0.55 : 1}>
                    R₁₂
                  </Felirat>
                )}
                <Nyil x1={vx(0)} y1={vy(0)} x2={vx(LANC[3].x)} y2={vy(LANC[3].y)} u={u(3)} szin={SZURKE} hegy="vs-sz" vastag={2} szaggatott opacitas={lepes >= 4 ? 0.45 : 0.9} />
                {u(3) > 0.9 && (
                  <Felirat x={vx(LANC[3].x / 2) + 26} y={vy(LANC[3].y / 2) + 14} szin={SZURKE} meret={11.5} opacitas={lepes >= 4 ? 0.55 : 1}>
                    R₁₂₃
                  </Felirat>
                )}
              </>
            )}

            {/* eredő */}
            <Nyil x1={vx(0)} y1={vy(0)} x2={vx(R.x)} y2={vy(R.y)} u={u(4)} szin={LILA} hegy="vs-r" vastag={4} />
            {u(4) > 0.9 && (
              <>
                <Felirat x={vx(R.x) + 8} y={vy(R.y) + 5} szin={LILA} meret={13} horgony="start">
                  R = 7,176 kN
                </Felirat>
                <line x1={vx(0)} y1={vy(0)} x2={vx(2.4)} y2={vy(0)} stroke={LILA} strokeWidth="0.8" strokeDasharray="3 3" />
                <path d={`M ${vx(1.6)} ${vy(0)} A ${1.6 * E} ${1.6 * E} 0 0 0 ${vx(1.6 * Math.cos(13.97 * RAD))} ${vy(1.6 * Math.sin(13.97 * RAD))}`} fill="none" stroke={LILA} strokeWidth="1" />
                <text x={vx(1.7)} y={vy(0) + 14} style={{ fontSize: 10.5, fill: LILA }}>αR = 13,97°</text>
              </>
            )}
          </svg>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setLepes((l) => Math.min(4, l + 1))}
              disabled={kesz}
              className="rounded-lg bg-petrol-800 px-3.5 py-1.5 text-[12.5px] font-semibold text-white transition hover:bg-petrol-900 disabled:opacity-40"
            >
              {lepes === 0 ? "Kezdjük: F₁ felmérése →" : kesz ? "Kész" : `Következő lépés: ${["", "F₂", "F₃", "F₄"][lepes]} hozzáfűzése →`}
            </button>
            <button type="button" onClick={() => setLepes(0)} className="rounded-lg bg-petrol-100 px-3 py-1.5 text-[12.5px] font-semibold text-petrol-700 transition hover:bg-petrol-200">
              Elölről
            </button>
            <label className="ml-1 flex cursor-pointer items-center gap-1.5 text-[12px] text-petrol-600">
              <input type="checkbox" checked={reszeredok} onChange={(e) => setReszeredok(e.target.checked)} className="h-3.5 w-3.5 accent-[color:var(--color-naracs-500)]" />
              {reszeredok ? "részeredők is látszanak" : "csak a lánc"}
            </label>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">Az egyenértékűségi kijelentés alakul</p>
          <ol className="mt-2 space-y-1.5">
            {KIJELENTESEK.map((k, i) => {
              const lathato = i <= lepes;
              const aktualis = i === lepes;
              if (!lathato) return null;
              if (i === 1 && lepes > 1) return null; // az 1. lépés kijelentése ugyanaz, mint a 0.-é
              return (
                <li
                  key={i}
                  className={`szamok rounded-lg border px-3 py-1.5 text-[13px] transition ${
                    aktualis ? "border-naracs-300 bg-naracs-50 text-petrol-900" : "border-petrol-100 bg-white text-petrol-500"
                  }`}
                >
                  <MB>{k.k}</MB>
                </li>
              );
            })}
          </ol>
          <p className="mt-2 text-[13px] leading-relaxed text-petrol-700">{KIJELENTESEK[lepes].mag}</p>

          <div className={`mt-4 border-t border-petrol-100 pt-3 transition ${kesz ? "opacity-100" : "opacity-50"}`}>
            <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">Ugyanez számítással</p>
            <div className="szamok mt-1 text-[13px]">
              <MB>{"\\Fx 0 + 2\\sin 30^\\circ + 2,5 + 4\\cos 30^\\circ = R_x \\;\\Rightarrow\\; R_x = 6,964\\ \\text{kN}\\ (\\rightarrow)"}</MB>
              <MB>{"\\Fy 2 + 2\\cos 30^\\circ + 0 - 4\\sin 30^\\circ = R_y \\;\\Rightarrow\\; R_y = 1,732\\ \\text{kN}\\ (\\uparrow)"}</MB>
              <MB>{"R = \\sqrt{6,964^2 + 1,732^2} = 7,176\\ \\text{kN},\\qquad \\operatorname{tg}\\alpha_R = \\frac{1,732}{6,964} \\;\\Rightarrow\\; \\alpha_R = 13,97^\\circ"}</MB>
            </div>
            <p className="mt-1 text-[12px] text-petrol-500">
              A vetületi egyenletek bal oldalán a kijelentés bal oldalának erői állnak sorban, a jobb oldalon az eredő megfelelő komponense.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
