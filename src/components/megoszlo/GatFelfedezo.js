"use client";

import { useState } from "react";
import { Csuszka } from "@/components/abrak/ErovektorBonto";
import { M, MB } from "@/components/ui/Keplet";
import { sz, szK } from "@/lib/szamok";

/*
 * Víznyomás ferde gátfalon – interaktív.
 *   vízszintes komponens: a függőleges vetületre ható háromszög, R_x = ½γh², h/3-ra a fenéktől
 *   függőleges komponens: a fal vonala és a vízszint közötti síkidom területe × γ, a súlypontján át
 *   az eredő merőleges a falra: R = R_x / cos β
 */

const SZ = 640;
const MA = 420;
const OX = 330; // a fal talppontja
const OY = 372;
const NAR = "#e2590a";
const KEK = "#2563eb";
const TEAL = "#0f766e";
const LILA = "#7c3aed";
const RAD = Math.PI / 180;

function Hegy({ id, szin }) {
  return (
    <marker id={id} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
      <path d="M 0 1 L 9 5 L 0 9 z" fill={szin} />
    </marker>
  );
}

export default function GatFelfedezo() {
  const [h, setH] = useState(6);
  const [beta, setBeta] = useState(30);
  const [gamma, setGamma] = useState(10);

  const tg = Math.tan(beta * RAD);
  const cb = Math.cos(beta * RAD);
  const alap = h * tg; // a fal fölötti háromszög alapja (vízszintes)
  const Rx = 0.5 * gamma * h * h;
  const A = 0.5 * alap * h;
  const Ry = gamma * A;
  const R = Math.hypot(Rx, Ry);
  const Rell = Rx / cb;
  const xS = alap / 3; // a háromszög súlypontja a talppont függőlegesétől
  const yRx = h / 3;

  // rajzlépték
  const sc = Math.min(60, 240 / h, 250 / (alap + 0.5)); // px / m — kis h-nál is kitölti a rajzot
  const hp = h * sc;
  const TX = OX - alap * sc;
  const TY = OY - hp;
  const PS = Math.min(1.2, 80 / Math.max(gamma * h, 1)); // px / (kN/m²) a nyomásábrához (legfeljebb 80 px széles)
  const RS = 90 / Math.max(R, 1); // px / (kN/m): az eredő mindig 90 px, a komponensek arányosak
  const fuggoleges = beta < 2; // függőleges fal: R = Rₓ, egy nyíl
  const Q = { x: OX - (alap * sc) / 3, y: OY - hp / 3 }; // ahol az eredő a falat metszi
  const dir = { x: -cb, y: Math.sin(beta * RAD) }; // az eredő iránya (a víz felől a falra, merőlegesen)

  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white">
      <div className="grid lg:grid-cols-[1.3fr_1fr] [&>*]:min-w-0">
        <div className="racs-vilagos border-b border-[color:var(--keret)] p-3 lg:border-r lg:border-b-0">
          <svg viewBox={`0 0 ${SZ} ${MA}`} className="abra w-full select-none">
            <defs>
              <Hegy id="gf-n" szin={NAR} />
              <Hegy id="gf-k" szin={KEK} />
              <Hegy id="gf-t" szin={TEAL} />
              <Hegy id="gf-l" szin={LILA} />
              <Hegy id="gf-m" szin="#94a3b8" />
            </defs>

            {/* víz */}
            <path d={`M ${OX} ${OY} L ${TX} ${TY} L ${SZ - 20} ${TY} L ${SZ - 20} ${OY} Z`} fill="#7dd3fc" opacity="0.3" />
            <line x1={TX - 30} y1={TY} x2={SZ - 20} y2={TY} stroke="#0284c7" strokeWidth="1.2" strokeDasharray="6 3" />
            {/* gát teste */}
            <path d={`M ${OX} ${OY} L ${TX} ${TY} L ${Math.min(TX, OX) - 50} ${TY} L ${Math.min(TX, OX) - 50} ${OY} Z`} fill="#cbd5e1" />
            <line x1={20} y1={OY} x2={SZ - 20} y2={OY} stroke="#475569" strokeWidth="1.6" />

            {/* a fal fölötti síkidom (függőleges komponens) */}
            {alap > 0.02 && (
              <g>
                <path d={`M ${OX} ${OY} L ${TX} ${TY} L ${OX} ${TY} Z`} fill={TEAL} opacity="0.22" stroke={TEAL} strokeWidth="1.4" />
                {Array.from({ length: 5 }, (_, i) => {
                  const u = (i + 1) / 6;
                  const x = OX - alap * sc * u;
                  const yFal = OY - hp * u; // a fal y-ja ennél az x-nél (egyenes fal)
                  return yFal - TY > 10 ? <line key={i} x1={x} y1={TY + 2} x2={x} y2={yFal - 5} stroke={TEAL} strokeWidth="1.1" opacity="0.8" markerEnd="url(#gf-t)" /> : null;
                })}
                <line x1={OX - xS * sc} y1={TY - 22 - Ry * RS} x2={OX - xS * sc} y2={TY - 8} stroke={TEAL} strokeWidth="3.4" strokeLinecap="round" markerEnd="url(#gf-t)" />
                <text x={OX - xS * sc - 8} y={TY - 14 - Ry * RS} textAnchor="end" style={{ fontSize: 12, fontWeight: 650, fill: TEAL, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
                  Rᵧ = γA = {sz(Ry, 1)} kN/m
                </text>
                <line x1={OX - xS * sc} y1={TY - 8} x2={OX - xS * sc} y2={Q.y} stroke={TEAL} strokeWidth="1" strokeDasharray="4 3" />
              </g>
            )}

            {/* vízszintes komponens: háromszög a függőleges vetületen (a talppont függőlegesén) */}
            <g>
              <line x1={OX} y1={OY} x2={OX} y2={TY - 8} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 3" />
              <path d={`M ${OX} ${TY} L ${OX} ${OY} L ${OX + gamma * h * PS} ${OY} Z`} fill={KEK} opacity="0.16" stroke={KEK} strokeWidth="1.4" />
              {Array.from({ length: 6 }, (_, i) => {
                const u = (i + 1) / 6;
                const y = TY + hp * u;
                const len = gamma * h * PS * u;
                return <line key={i} x1={OX + len} y1={y} x2={OX + 5} y2={y} stroke={KEK} strokeWidth="1.1" opacity="0.8" markerEnd="url(#gf-k)" />;
              })}
              <text x={OX + gamma * h * PS + 6} y={OY - 4} style={{ fontSize: 11, fill: KEK }}>
                γh = {sz(gamma * h, 0)} kN/m²
              </text>
              <line x1={OX + 24 + Rx * RS} y1={OY - hp / 3} x2={OX + 12} y2={OY - hp / 3} stroke={KEK} strokeWidth="3.4" strokeLinecap="round" markerEnd="url(#gf-k)" />
              <text x={OX + 30 + Rx * RS} y={OY - hp / 3 - 8} style={{ fontSize: 12, fontWeight: 650, fill: KEK, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
                Rₓ = ½γh² = {sz(Rx, 1)} kN/m
              </text>
              <line x1={OX + 12} y1={OY - hp / 3} x2={Q.x} y2={Q.y} stroke={KEK} strokeWidth="1" strokeDasharray="4 3" />
            </g>

            {/* a fal */}
            <line x1={OX} y1={OY} x2={TX} y2={TY} stroke="#1d3c48" strokeWidth="5" strokeLinecap="round" />

            {/* az eredő: a falra merőleges, a metszéspontban (függőleges falnál egybeesik Rₓ-szel) */}
            {!fuggoleges && (
              <>
                <line x1={Q.x - dir.x * (R * RS + 10)} y1={Q.y - dir.y * (R * RS + 10)} x2={Q.x - dir.x * 6} y2={Q.y - dir.y * 6} stroke={LILA} strokeWidth="4" strokeLinecap="round" markerEnd="url(#gf-l)" />
                <text x={Q.x - dir.x * (R * RS + 26)} y={Q.y - dir.y * (R * RS + 26) + 4} textAnchor="middle" style={{ fontSize: 12.5, fontWeight: 700, fill: LILA, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
                  R = {sz(R, 1)} kN/m
                </text>
              </>
            )}
            {fuggoleges && (
              <text x={OX + 30 + Rx * RS} y={OY - hp / 3 + 18} style={{ fontSize: 12.5, fontWeight: 700, fill: LILA, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
                R = Rₓ = {sz(R, 1)} kN/m
              </text>
            )}
            <circle cx={Q.x} cy={Q.y} r="4" fill={LILA} stroke="white" strokeWidth="1.5" />

            {/* méretek */}
            <line x1={SZ - 40} y1={OY} x2={SZ - 40} y2={TY} stroke="#94a3b8" strokeWidth="1" markerStart="url(#gf-m)" markerEnd="url(#gf-m)" />
            <text x={SZ - 34} y={(OY + TY) / 2 + 4} style={{ fontSize: 11.5, fill: "#64748b" }} textAnchor="start">
              h
            </text>
            <line x1={SZ - 46} y1={OY - hp / 3} x2={SZ - 46} y2={OY} stroke="#94a3b8" strokeWidth="1" markerStart="url(#gf-m)" markerEnd="url(#gf-m)" />
            <text x={SZ - 52} y={OY - hp / 6 + 4} textAnchor="end" style={{ fontSize: 10.5, fill: "#64748b" }}>
              h/3
            </text>
            {beta > 2 && (
              <>
                {/* a dőlésszög a fal tetejénél, a függőlegeshez képest (a gát testében) */}
                <line x1={TX} y1={TY} x2={TX} y2={TY + 70} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 3" />
                <path d={`M ${TX} ${TY + 50} A 50 50 0 0 0 ${TX + 50 * Math.sin(beta * RAD)} ${TY + 50 * cb}`} fill="none" stroke="#64748b" strokeWidth="1.2" />
                <text x={TX - 5} y={TY + 62} textAnchor="end" style={{ fontSize: 11.5, fill: "#64748b" }}>
                  β = {beta}°
                </text>
                <line x1={TX} y1={OY + 16} x2={OX} y2={OY + 16} stroke="#94a3b8" strokeWidth="1" markerStart="url(#gf-m)" markerEnd="url(#gf-m)" />
                <text x={(TX + OX) / 2} y={OY + 30} textAnchor="middle" style={{ fontSize: 10.5, fill: "#64748b" }}>
                  h·tg β = {sz(alap, 2)} m
                </text>
              </>
            )}
            <text x={OX + 40} y={TY + 16} style={{ fontSize: 11, fill: "#0284c7" }}>
              γ = {sz(gamma, 0)} kN/m³
            </text>
          </svg>
          <p className="mt-1 text-center text-[11.5px] text-petrol-400">Kék: a vízszintes vetületre ható háromszög. Zöld: a fal fölötti vízoszlop. Lila: az eredő, a falra merőlegesen.</p>
        </div>

        <div className="p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-[12px] text-petrol-500">a víz fajsúlya:</span>
            {[10, 15].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGamma(g)}
                className={`rounded-lg px-2.5 py-1.5 text-[12px] font-medium ring-1 transition ${g === gamma ? "bg-naracs-500 text-white ring-naracs-500" : "bg-white text-petrol-600 ring-petrol-200 hover:bg-petrol-50"}`}
              >
                γ = {g} kN/m³
              </button>
            ))}
          </div>
          <div className="space-y-3">
            <Csuszka cimke="vízmélység, h" ertek={h} egyseg="m" min={2} max={10} lepes={0.5} tizedes={1} onChange={setH} />
            <Csuszka cimke="a fal dőlése a függőlegestől, β" ertek={beta} egyseg="°" min={0} max={60} lepes={1} tizedes={0} onChange={setBeta} />
          </div>

          <div className="mt-4 rounded-xl bg-petrol-50 p-3">
            <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">Élőben (1 m széles sávra)</p>
            <div className="szamok mt-1 text-[13px] text-petrol-800">
              <MB>{`R_x = \\tfrac12\\,\\gamma h^2 = \\tfrac12\\cdot ${szK(gamma, 0)}\\cdot ${szK(h, 1)}^2 = ${szK(Rx, 1)}\\ \\text{kN/m},\\quad \\tfrac{h}{3} = ${szK(yRx, 2)}\\ \\text{m-re a fenéktől}`}</MB>
              <MB>{`A = \\tfrac12\\,(h\\,\\mathrm{tg}\\,\\beta)\\,h = \\tfrac12\\cdot ${szK(alap, 3)}\\cdot ${szK(h, 1)} = ${szK(A, 3)}\\ \\text{m}^2`}</MB>
              <MB>{`R_y = \\gamma A = ${szK(gamma, 0)}\\cdot ${szK(A, 3)} = ${szK(Ry, 1)}\\ \\text{kN/m},\\quad x_S = \\tfrac{h\\,\\mathrm{tg}\\,\\beta}{3} = ${szK(xS, 3)}\\ \\text{m a talpponttól}`}</MB>
              <MB>{`R = \\sqrt{R_x^2 + R_y^2} = \\sqrt{${szK(Rx, 1)}^2 + ${szK(Ry, 1)}^2} = ${szK(R, 1)}\\ \\text{kN/m}`}</MB>
            </div>
          </div>
          <div className="mt-3 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3">
            <p className="text-[10.5px] font-bold tracking-[0.16em] text-emerald-800 uppercase">Ellenőrzés: az eredő merőleges a falra</p>
            <p className="mt-1 text-[13px] leading-relaxed text-petrol-800">
              A nyomás minden pontban merőleges a falra, ezért az eredő is az:{" "}
              <M>{`R = \\frac{R_x}{\\cos\\beta} = \\frac{${szK(Rx, 1)}}{\\cos ${beta}^\\circ} = ${szK(Rell, 1)}\\ \\text{kN/m}\\ \\checkmark`}</M>
              {beta > 0 && (
                <>
                  {" "}— és <M>{`\\mathrm{tg}\\,\\varphi = R_y / R_x = ${szK(Ry / Rx, 3)} = \\mathrm{tg}\\,${beta}^\\circ`}</M>, tehát az eredő pontosan
                  a fal normálisa mentén hat.
                </>
              )}
            </p>
          </div>
          <p className="mt-2 text-[12px] text-petrol-500">
            A H13 feladatsor γ = 15 kN/m³-rel számol — a gombbal átválthatsz. Függőleges falnál (β = 0) a függőleges komponens eltűnik, marad a klasszikus háromszög.
          </p>
        </div>
      </div>
    </div>
  );
}
