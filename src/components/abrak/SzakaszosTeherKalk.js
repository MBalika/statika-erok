"use client";

import { useState } from "react";
import { Cimke, NyilHegyek } from "./SvgElemek";
import { sz, szK, zarojel } from "@/lib/szamok";
import { M } from "@/components/ui/Keplet";

const SZ = 640;
const MA = 384;
const BAL = 80;
const JOBB = 560;
const TARTO_Y = 206;

const ALAKOK = [
  ["tegla", "egyenletes"],
  ["harom-bal", "háromszög, magas oldal balra"],
  ["harom-jobb", "háromszög, magas oldal jobbra"],
];

const ELORE = {
  gyf2: [
    { alak: "tegla", L: 1.2, p: 7 },
    { alak: "tegla", L: 1.2, p: -7 },
    { alak: "tegla", L: 1.2, p: 7 },
  ],
  gyf3: [
    { alak: "harom-bal", L: 6, p: 4 },
    { alak: "harom-bal", L: 6, p: 4 },
  ],
};

const SZINEK = ["#e2590a", "#0f766e", "#2563eb", "#be123c", "#b45309"];

function reszEredo(s, kezd) {
  // R előjeles (lefelé pozitív), x a rész eredőjének helye a tartó bal végétől
  if (s.alak === "tegla") return { R: s.p * s.L, x: kezd + s.L / 2 };
  if (s.alak === "harom-bal") return { R: (s.p * s.L) / 2, x: kezd + s.L / 3 };
  return { R: (s.p * s.L) / 2, x: kezd + (2 * s.L) / 3 };
}

export default function SzakaszosTeherKalk() {
  const [szakaszok, setSzakaszok] = useState(ELORE.gyf2);

  const teljesL = szakaszok.reduce((s, e) => s + e.L, 0) || 1;
  const xLeptek = (JOBB - BAL) / teljesL;
  const pMax = Math.max(1, ...szakaszok.map((s) => Math.abs(s.p)));
  const pLeptek = 85 / pMax;

  // részeredők
  let futo = 0;
  const reszek = szakaszok.map((s) => {
    const r = reszEredo(s, futo);
    const kezd = futo;
    futo += s.L;
    return { ...r, kezd, ...s };
  });
  const R = reszek.reduce((a, r) => a + r.R, 0);
  const Mo = reszek.reduce((a, r) => a + r.R * r.x, 0);
  const k = Math.abs(R) > 1e-9 ? Mo / R : null;

  const kepX = (x) => BAL + x * xLeptek;
  const magassag = (p) => -p * pLeptek; // pozitív p felfelé rajzolva (a tartó fölé), a nyilak lefelé mutatnak

  const modosit = (i, mezo, ertek) =>
    setSzakaszok((e) => e.map((s, j) => (j === i ? { ...s, [mezo]: ertek } : s)));

  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white">
      <div className="flex flex-wrap items-center gap-2 border-b border-[color:var(--keret)] bg-petrol-50/70 px-4 py-2.5">
        <span className="text-[12.5px] font-semibold text-petrol-800">Szakaszos megoszló teher eredője</span>
        <div className="ml-auto flex gap-1.5">
          <button type="button" onClick={() => setSzakaszok(ELORE.gyf2)} className="rounded-md bg-white px-2.5 py-1 text-[12px] font-medium text-petrol-600 ring-1 ring-petrol-200 transition hover:bg-petrol-50">GYF‑2</button>
          <button type="button" onClick={() => setSzakaszok(ELORE.gyf3)} className="rounded-md bg-white px-2.5 py-1 text-[12px] font-medium text-petrol-600 ring-1 ring-petrol-200 transition hover:bg-petrol-50">GYF‑3</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.35fr_1fr]">
        <div className="racs-vilagos flex flex-col justify-center border-b border-[color:var(--keret)] p-3 lg:border-r lg:border-b-0">
          <svg viewBox={`0 0 ${SZ} ${MA}`} className="abra w-full select-none">
            <NyilHegyek />

            {/* a szakaszok teherábrái */}
            {reszek.map((r, i) => {
              const x0 = kepX(r.kezd);
              const x1 = kepX(r.kezd + r.L);
              const h = magassag(r.p);
              let ut;
              if (r.alak === "tegla") ut = `M ${x0} ${TARTO_Y} L ${x0} ${TARTO_Y + h} L ${x1} ${TARTO_Y + h} L ${x1} ${TARTO_Y} Z`;
              else if (r.alak === "harom-bal") ut = `M ${x0} ${TARTO_Y} L ${x0} ${TARTO_Y + h} L ${x1} ${TARTO_Y} Z`;
              else ut = `M ${x0} ${TARTO_Y} L ${x1} ${TARTO_Y + h} L ${x1} ${TARTO_Y} Z`;

              // nyilak a szakaszon belül
              const db = Math.max(2, Math.round(r.L * xLeptek / 26));
              const nyilak = Array.from({ length: db + 1 }, (_, j) => {
                const t = j / db;
                const x = r.kezd + t * r.L;
                let pItt = r.p;
                if (r.alak === "harom-bal") pItt = r.p * (1 - t);
                if (r.alak === "harom-jobb") pItt = r.p * t;
                return { x: kepX(x), y: TARTO_Y + magassag(pItt), p: pItt };
              });

              return (
                <g key={i}>
                  <path d={ut} fill={SZINEK[i % SZINEK.length]} opacity="0.14" stroke={SZINEK[i % SZINEK.length]} strokeWidth="1.6" />
                  {nyilak.map((n, j) =>
                    Math.abs(n.p) > 0.05 * pMax ? (
                      <line
                        key={j}
                        x1={n.x}
                        y1={n.y}
                        x2={n.x}
                        y2={TARTO_Y + (n.p > 0 ? -5 : 5)}
                        stroke={SZINEK[i % SZINEK.length]}
                        strokeWidth="1.3"
                        markerEnd={`url(#hegy-${["ero", "komp", "kek", "ero", "ero"][i % 5]})`}
                      />
                    ) : null,
                  )}
                  <Cimke
                    x={(x0 + x1) / 2}
                    y={r.p > 0 ? TARTO_Y + h - 8 : TARTO_Y + h + 16}
                    szin={SZINEK[i % SZINEK.length]}
                    meret={11.5}
                  >
                    {sz(r.p, 1)} kN/m
                  </Cimke>
                  {/* részeredő */}
                  {Math.abs(r.R) > 0.01 && (
                    <>
                      <circle cx={kepX(r.x)} cy={TARTO_Y} r="3.5" fill={SZINEK[i % SZINEK.length]} />
                      <Cimke x={kepX(r.x)} y={r.p > 0 ? TARTO_Y + 18 : TARTO_Y - 9} szin={SZINEK[i % SZINEK.length]} meret={11}>
                        R{i + 1}
                      </Cimke>
                    </>
                  )}
                </g>
              );
            })}

            {/* tartó */}
            <line x1={BAL - 12} y1={TARTO_Y} x2={JOBB + 12} y2={TARTO_Y} stroke="#1d3c48" strokeWidth="4" strokeLinecap="round" />

            {/* eredő */}
            {k !== null && (
              <g>
                <line
                  x1={kepX(k)}
                  y1={R > 0 ? 22 : TARTO_Y - 10}
                  x2={kepX(k)}
                  y2={R > 0 ? 22 + 60 : 24}
                  stroke="#7c3aed"
                  strokeWidth="3.6"
                  strokeLinecap="round"
                  markerEnd="url(#hegy-eredo)"
                />
                <Cimke x={kepX(k)} y={14} szin="#7c3aed" meret={12.5}>
                  R = {sz(Math.abs(R), 2)} kN {R > 0 ? "↓" : "↑"}
                </Cimke>
                <line x1={kepX(k)} y1={TARTO_Y + 6} x2={kepX(k)} y2={TARTO_Y + 150} stroke="#7c3aed" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                <line x1={kepX(0)} y1={TARTO_Y + 146} x2={kepX(k)} y2={TARTO_Y + 146} stroke="#7c3aed" strokeWidth="1.1" markerStart="url(#hegy-szurke)" markerEnd="url(#hegy-szurke)" />
                <Cimke x={kepX(k / 2)} y={TARTO_Y + 162} szin="#7c3aed" meret={11.5} vastag={false}>
                  k = {sz(k, 3)} m
                </Cimke>
              </g>
            )}

            {/* hosszméretek */}
            {reszek.map((r, i) => (
              <g key={`m${i}`}>
                <line x1={kepX(r.kezd)} y1={TARTO_Y + 118} x2={kepX(r.kezd + r.L)} y2={TARTO_Y + 118} stroke="#94a3b8" strokeWidth="1" markerStart="url(#hegy-szurke)" markerEnd="url(#hegy-szurke)" />
                <Cimke x={kepX(r.kezd + r.L / 2)} y={TARTO_Y + 132} szin="#64748b" meret={11} vastag={false}>
                  {sz(r.L, 1)} m
                </Cimke>
              </g>
            ))}
          </svg>
          <p className="mt-1 text-center text-[11.5px] text-petrol-400">
            Lefelé ható teher pozitív (a tartó fölé rajzolva), felfelé ható negatív (a tartó alá). A pontok a részek eredőinek helye.
          </p>
        </div>

        <div className="p-4 sm:p-5">
          <div className="space-y-2">
            {szakaszok.map((s, i) => (
              <div key={i} className="rounded-lg border border-petrol-100 bg-petrol-50/50 p-2.5">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: SZINEK[i % SZINEK.length] }} />
                  <span className="text-[12px] font-semibold text-petrol-800">{i + 1}. szakasz</span>
                  <select
                    value={s.alak}
                    onChange={(e) => modosit(i, "alak", e.target.value)}
                    className="ml-auto rounded-md border border-petrol-200 bg-white px-1.5 py-1 text-[11.5px] text-petrol-800 outline-none focus:border-petrol-400"
                  >
                    {ALAKOK.map(([ertek, nev]) => (
                      <option key={ertek} value={ertek}>{nev}</option>
                    ))}
                  </select>
                </div>
                <div className="szamok mt-2 flex items-center gap-2 text-[12px] text-petrol-600">
                  <span>L =</span>
                  <input type="number" value={s.L} step="0.1" min="0.1" onChange={(e) => modosit(i, "L", Math.max(0.1, Number(e.target.value)))} className="szamok w-16 rounded-md border border-petrol-200 bg-white px-1.5 py-1 text-[12.5px] text-petrol-900 outline-none focus:border-petrol-400" />
                  <span>m</span>
                  <span className="ml-auto">p =</span>
                  <input type="number" value={s.p} step="0.5" onChange={(e) => modosit(i, "p", Number(e.target.value))} className="szamok w-16 rounded-md border border-petrol-200 bg-white px-1.5 py-1 text-[12.5px] text-petrol-900 outline-none focus:border-petrol-400" />
                  <span>kN/m</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {szakaszok.length < 5 && (
              <button type="button" onClick={() => setSzakaszok((e) => [...e, { alak: "tegla", L: 2, p: 5 }])} className="rounded-lg bg-white px-2.5 py-1.5 text-[12px] font-medium text-petrol-600 ring-1 ring-petrol-200 transition hover:bg-petrol-50">+ Szakasz</button>
            )}
            {szakaszok.length > 1 && (
              <button type="button" onClick={() => setSzakaszok((e) => e.slice(0, -1))} className="rounded-lg bg-white px-2.5 py-1.5 text-[12px] font-medium text-petrol-600 ring-1 ring-petrol-200 transition hover:bg-petrol-50">− Szakasz</button>
            )}
          </div>

          <div className="mt-4 rounded-xl bg-petrol-50 p-4">
            <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">Részeredők</p>
            <div className="finom-gorgeto mt-2 overflow-x-auto">
              <table className="szamok w-full text-[12.5px]">
                <thead className="text-[10.5px] text-petrol-500 uppercase">
                  <tr>
                    <th className="pb-1 text-left">rész</th>
                    <th className="pb-1 text-right">Rᵢ [kN]</th>
                    <th className="pb-1 text-right">xᵢ [m]</th>
                    <th className="pb-1 text-right">Rᵢ·xᵢ</th>
                  </tr>
                </thead>
                <tbody>
                  {reszek.map((r, i) => (
                    <tr key={i} className="border-t border-petrol-200">
                      <td className="py-1" style={{ color: SZINEK[i % SZINEK.length] }}>R{i + 1}</td>
                      <td className="py-1 text-right">{sz(r.R, 2)}</td>
                      <td className="py-1 text-right">{sz(r.x, 3)}</td>
                      <td className="py-1 text-right">{sz(r.R * r.x, 2)}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-petrol-300 font-semibold text-violet-900">
                    <td className="py-1">Σ</td>
                    <td className="py-1 text-right">{sz(R, 2)}</td>
                    <td className="py-1 text-right">–</td>
                    <td className="py-1 text-right">{sz(Mo, 2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-3 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3">
            <p className="text-[10.5px] font-bold tracking-[0.16em] text-violet-700 uppercase">Az eredő</p>
            {k !== null ? (
              <div className="szamok mt-1 text-[13.5px] text-violet-950">
                <div><M>{`R = \\sum R_i = ${szK(R, 2)}\\ \\text{kN}\\ (${R > 0 ? "\\downarrow" : "\\uparrow"})`}</M></div>
                <div className="mt-1"><M>{`k = \\frac{\\sum R_i x_i}{R} = \\frac{${szK(Mo, 2)}}{${zarojel(R, 2).replace(",", "{,}")}} = ${szK(k, 3)}\\ \\text{m}`}</M></div>
              </div>
            ) : (
              <p className="mt-1 text-[13.5px] text-violet-950">
                Az eredő erő zérus — a teher erőpárra redukálódik, amelynek nyomatéka {sz(Math.abs(Mo), 2)} kNm nagyságú.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
