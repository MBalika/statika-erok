"use client";

import { useRef, useState } from "react";
import { Cimke, Fogopont, NyilHegyek } from "./SvgElemek";
import { Csuszka } from "./ErovektorBonto";
import { sz, szK } from "@/lib/szamok";
import { M } from "@/components/ui/Keplet";

const SZ = 700;
const MA = 400;
const BAL = 130; // a tartó bal vége (képpont)
const JOBB = 560; // a tartó jobb vége
const TARTO_Y = 270; // a tartó tengelyvonala
const P_LEPTEK = 19; // képpont / (kN/m)

export default function TrapezTeherFelfedezo() {
  const [p1, setP1] = useState(1.8);
  const [p2, setP2] = useState(3.6);
  const [L, setL] = useState(4.5);
  const [mod, setMod] = useState("egyben"); // egyben | tegla | ketharom
  const svgRef = useRef(null);

  const hossz = JOBB - BAL; // a rajzon mindig ugyanakkora, a méretarány L-től függ
  const xLeptek = hossz / L; // képpont / méter

  const R = ((p1 + p2) / 2) * L;
  const k = R > 1e-9 ? (L * (p1 + 2 * p2)) / (3 * (p1 + p2)) : L / 2;

  // Felbontás A: téglalap a kisebb intenzitással + háromszög a különbséggel
  const pMin = Math.min(p1, p2);
  const pDiff = Math.abs(p2 - p1);
  const tallJobb = p2 >= p1; // a háromszög magas oldala jobbra van?
  const Ra1 = pMin * L; // téglalap
  const xa1 = L / 2;
  const Ra2 = (pDiff * L) / 2; // háromszög
  const xa2 = tallJobb ? (2 * L) / 3 : L / 3;

  // Felbontás B: két háromszög
  const Rb1 = (p1 * L) / 2; // bal oldali intenzitásból, magas oldal balra
  const xb1 = L / 3;
  const Rb2 = (p2 * L) / 2; // jobb oldali intenzitásból, magas oldal jobbra
  const xb2 = (2 * L) / 3;

  const kepX = (x) => BAL + x * xLeptek;
  const tetoY = (p) => TARTO_Y - p * P_LEPTEK;

  const huzas = (melyik) => (e) => {
    e.preventDefault();
    const svg = svgRef.current;
    if (!svg) return;
    const mozgat = (esem) => {
      const r = svg.getBoundingClientRect();
      const py = ((esem.clientY - r.top) / r.height) * MA;
      const ertek = Math.max(0, Math.min(10, Math.round(((TARTO_Y - py) / P_LEPTEK) * 10) / 10));
      (melyik === "p1" ? setP1 : setP2)(ertek);
    };
    mozgat(e);
    const vege = () => {
      window.removeEventListener("pointermove", mozgat);
      window.removeEventListener("pointerup", vege);
    };
    window.addEventListener("pointermove", mozgat);
    window.addEventListener("pointerup", vege);
  };

  // Teher-nyilak egyenletes osztásban
  const nyilDb = 12;
  const nyilak = Array.from({ length: nyilDb + 1 }, (_, i) => {
    const x = (i / nyilDb) * L;
    const p = p1 + ((p2 - p1) * x) / L;
    return { x: kepX(x), y: tetoY(p), p };
  });

  const pHelyen = (x) => p1 + ((p2 - p1) * x) / L;

  /** Eredő nyíl: a teherábra felső éle fölött áll, hegye az élre mutat.
   *  sor: 0 vagy 1 – a helyméret-vonal sora a tartó alatt; oldal: a felirat iránya. */
  const Eredo = ({ x, ertek, szin, cimke, sor = 0, oldal = "kozep", vastag = 3.4 }) => {
    if (ertek < 0.01) return null;
    const ex = kepX(x);
    const elY = tetoY(pHelyen(x)) - 7; // a nyíl hegye
    let hosszPx = Math.min(78, 30 + ertek * 2.6);
    let y0 = elY - hosszPx;
    if (y0 < 30) {
      y0 = 30;
      hosszPx = elY - y0;
    }
    const jelolo = szin === "#7c3aed" ? "eredo" : szin === "#0f766e" ? "komp" : "kek";
    const horgony = oldal === "bal" ? "end" : oldal === "jobb" ? "start" : "middle";
    const cx = oldal === "bal" ? ex - 7 : oldal === "jobb" ? ex + 7 : ex;
    const meretY = TARTO_Y + 44 + sor * 24;
    return (
      <g>
        <line x1={ex} y1={y0} x2={ex} y2={elY} stroke={szin} strokeWidth={vastag} strokeLinecap="round" markerEnd={`url(#hegy-${jelolo})`} />
        <Cimke x={cx} y={y0 - 8} szin={szin} meret={12.5} horgony={horgony}>
          {cimke} = {sz(ertek, 2)} kN
        </Cimke>
        {/* helyméret a tartó alatt, szaggatott vezetővonallal */}
        <line x1={ex} y1={TARTO_Y + 6} x2={ex} y2={meretY + 4} stroke={szin} strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
        <line x1={kepX(0)} y1={meretY} x2={ex} y2={meretY} stroke={szin} strokeWidth="1.1" markerStart="url(#hegy-szurke)" markerEnd="url(#hegy-szurke)" />
        <Cimke x={kepX(x / 2)} y={meretY - 5} szin={szin} meret={11.5} vastag={false}>
          {oldal === "kozep" ? "k" : cimke.replace("R", "x")} = {sz(x, 2)} m
        </Cimke>
      </g>
    );
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white">
      <div className="flex flex-wrap items-center gap-2 border-b border-[color:var(--keret)] bg-petrol-50/70 px-4 py-2.5">
        <span className="text-[12.5px] font-semibold text-petrol-800">
          Trapéz alakú megoszló teher
        </span>
        <div className="ml-auto flex gap-1 rounded-lg bg-white p-0.5 ring-1 ring-petrol-200">
          {[
            ["egyben", "Az eredő"],
            ["tegla", "Téglalap + háromszög"],
            ["ketharom", "Két háromszög"],
          ].map(([ertek, cimke]) => (
            <button
              key={ertek}
              type="button"
              onClick={() => setMod(ertek)}
              className={`rounded-md px-2.5 py-1 text-[12px] font-medium transition ${
                mod === ertek ? "bg-petrol-700 text-white" : "text-petrol-600 hover:bg-petrol-50"
              }`}
            >
              {cimke}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] [&>*]:min-w-0">
        <div className="racs-vilagos flex flex-col justify-center border-b border-[color:var(--keret)] p-3 lg:border-r lg:border-b-0">
          <svg ref={svgRef} viewBox={`0 0 ${SZ} ${MA}`} className="abra w-full touch-none select-none">
            <NyilHegyek />

            {/* teherábra kitöltése */}
            <path
              d={`M ${kepX(0)} ${TARTO_Y} L ${kepX(0)} ${tetoY(p1)} L ${kepX(L)} ${tetoY(p2)} L ${kepX(L)} ${TARTO_Y} Z`}
              fill="#e2590a"
              opacity="0.12"
            />
            {/* felbontás körvonalai */}
            {mod === "tegla" && (
              <>
                <rect
                  x={kepX(0)}
                  y={tetoY(pMin)}
                  width={hossz}
                  height={pMin * P_LEPTEK}
                  fill="#0f766e"
                  opacity="0.16"
                />
                <path
                  d={
                    tallJobb
                      ? `M ${kepX(0)} ${tetoY(pMin)} L ${kepX(L)} ${tetoY(p2)} L ${kepX(L)} ${tetoY(pMin)} Z`
                      : `M ${kepX(0)} ${tetoY(p1)} L ${kepX(0)} ${tetoY(pMin)} L ${kepX(L)} ${tetoY(pMin)} Z`
                  }
                  fill="#2563eb"
                  opacity="0.16"
                />
              </>
            )}
            {mod === "ketharom" && (
              <>
                <path
                  d={`M ${kepX(0)} ${TARTO_Y} L ${kepX(0)} ${tetoY(p1)} L ${kepX(L)} ${TARTO_Y} Z`}
                  fill="#0f766e"
                  opacity="0.18"
                />
                <path
                  d={`M ${kepX(0)} ${TARTO_Y} L ${kepX(L)} ${tetoY(p2)} L ${kepX(L)} ${TARTO_Y} Z`}
                  fill="#2563eb"
                  opacity="0.18"
                />
              </>
            )}

            {/* teher felső éle és nyilak */}
            <line x1={kepX(0)} y1={tetoY(p1)} x2={kepX(L)} y2={tetoY(p2)} stroke="#e2590a" strokeWidth="2.2" />
            {nyilak.map((n, i) =>
              n.p > 0.15 ? (
                <line
                  key={i}
                  x1={n.x}
                  y1={n.y}
                  x2={n.x}
                  y2={TARTO_Y - 6}
                  stroke="#e2590a"
                  strokeWidth="1.4"
                  markerEnd="url(#hegy-ero)"
                />
              ) : null,
            )}

            {/* tartó */}
            <line x1={BAL - 14} y1={TARTO_Y} x2={JOBB + 14} y2={TARTO_Y} stroke="#1d3c48" strokeWidth="4" strokeLinecap="round" />

            {/* tengelyek: x jobbra, z lefelé */}
            <line x1={BAL - 104} y1={TARTO_Y + 40} x2={BAL - 60} y2={TARTO_Y + 40} className="tengely" markerEnd="url(#hegy-tengely)" />
            <line x1={BAL - 104} y1={TARTO_Y + 40} x2={BAL - 104} y2={TARTO_Y + 84} className="tengely" markerEnd="url(#hegy-tengely)" />
            <text x={BAL - 56} y={TARTO_Y + 44} className="cimke-kicsi" fontStyle="italic">x</text>
            <text x={BAL - 116} y={TARTO_Y + 98} className="cimke-kicsi" fontStyle="italic">z</text>

            {/* hosszméret */}
            <line x1={kepX(0)} y1={TARTO_Y + 96} x2={kepX(L)} y2={TARTO_Y + 96} stroke="#94a3b8" strokeWidth="1" markerStart="url(#hegy-szurke)" markerEnd="url(#hegy-szurke)" />
            <Cimke x={kepX(L / 2)} y={TARTO_Y + 112} szin="#64748b" meret={12} vastag={false}>
              L = {sz(L, 1)} m
            </Cimke>
            <line x1={kepX(0)} y1={TARTO_Y + 6} x2={kepX(0)} y2={TARTO_Y + 100} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
            <line x1={kepX(L)} y1={TARTO_Y + 6} x2={kepX(L)} y2={TARTO_Y + 100} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />

            {/* intenzitás feliratok és fogópontok */}
            <Cimke x={kepX(0) - 8} y={tetoY(p1) - 10} szin="var(--color-jel-ero)" meret={12.5} horgony="end">
              p₁ = {sz(p1, 1)} kN/m
            </Cimke>
            <Cimke x={kepX(L) + 8} y={tetoY(p2) - 10} szin="var(--color-jel-ero)" meret={12.5} horgony="start">
              p₂ = {sz(p2, 1)} kN/m
            </Cimke>
            <Fogopont x={kepX(0)} y={tetoY(p1)} onPointerDown={huzas("p1")} />
            <Fogopont x={kepX(L)} y={tetoY(p2)} onPointerDown={huzas("p2")} />

            {/* eredők */}
            {mod === "egyben" && <Eredo x={k} ertek={R} szin="#7c3aed" cimke="R" />}
            {mod === "tegla" && (
              <>
                <Eredo x={xa1} ertek={Ra1} szin="#0f766e" cimke="R₁" sor={0} oldal={xa2 > xa1 ? "bal" : "jobb"} vastag={3} />
                <Eredo x={xa2} ertek={Ra2} szin="#2563eb" cimke="R₂" sor={1} oldal={xa2 > xa1 ? "jobb" : "bal"} vastag={3} />
              </>
            )}
            {mod === "ketharom" && (
              <>
                <Eredo x={xb1} ertek={Rb1} szin="#0f766e" cimke="R₁" sor={0} oldal="bal" vastag={3} />
                <Eredo x={xb2} ertek={Rb2} szin="#2563eb" cimke="R₂" sor={1} oldal="jobb" vastag={3} />
              </>
            )}
          </svg>
          <p className="mt-1 text-center text-[11.5px] text-petrol-400">
            Húzd a teherábra két felső sarkát. A z tengely lefelé mutat, a lefelé ható teher a pozitív.
          </p>
        </div>

        <div className="p-4 sm:p-5">
          <div className="space-y-3.5">
            <Csuszka cimke="p₁ (bal oldali intenzitás)" ertek={p1} egyseg="kN/m" min={0} max={10} lepes={0.1} tizedes={1} onChange={setP1} />
            <Csuszka cimke="p₂ (jobb oldali intenzitás)" ertek={p2} egyseg="kN/m" min={0} max={10} lepes={0.1} tizedes={1} onChange={setP2} />
            <Csuszka cimke="Hossz, L" ertek={L} egyseg="m" min={1} max={10} lepes={0.5} tizedes={1} onChange={setL} />
          </div>

          <div className="mt-4 rounded-xl bg-petrol-50 p-4">
            <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">
              {mod === "egyben" ? "Közvetlenül" : mod === "tegla" ? "Téglalap + háromszög" : "Két háromszög"}
            </p>
            <div className="szamok mt-2 space-y-1.5 text-[13px] text-petrol-800">
              {mod === "egyben" && (
                <>
                  <div><M>{`R = \\frac{p_1 + p_2}{2}\\,L = \\frac{${szK(p1, 1)} + ${szK(p2, 1)}}{2}\\cdot ${szK(L, 1)} = ${szK(R, 3)}\\ \\text{kN}`}</M></div>
                  <div><M>{`k = \\frac{L}{3}\\cdot\\frac{p_1 + 2p_2}{p_1 + p_2} = ${szK(k, 3)}\\ \\text{m}`}</M></div>
                </>
              )}
              {mod === "tegla" && (
                <>
                  <div><M>{`R_1 = ${szK(pMin, 1)}\\cdot ${szK(L, 1)} = ${szK(Ra1, 3)}\\ \\text{kN},\\quad x_1 = L/2 = ${szK(xa1, 3)}\\ \\text{m}`}</M></div>
                  <div><M>{`R_2 = \\tfrac{1}{2}\\cdot ${szK(pDiff, 1)}\\cdot ${szK(L, 1)} = ${szK(Ra2, 3)}\\ \\text{kN},\\quad x_2 = ${tallJobb ? "2L/3" : "L/3"} = ${szK(xa2, 3)}\\ \\text{m}`}</M></div>
                  <div className="border-t border-petrol-200 pt-1.5"><M>{`R = R_1 + R_2 = ${szK(R, 3)}\\ \\text{kN}`}</M></div>
                  <div><M>{`k = \\frac{R_1 x_1 + R_2 x_2}{R} = ${szK(k, 3)}\\ \\text{m}`}</M></div>
                </>
              )}
              {mod === "ketharom" && (
                <>
                  <div><M>{`R_1 = \\tfrac{1}{2}\\cdot ${szK(p1, 1)}\\cdot ${szK(L, 1)} = ${szK(Rb1, 3)}\\ \\text{kN},\\quad x_1 = L/3 = ${szK(xb1, 3)}\\ \\text{m}`}</M></div>
                  <div><M>{`R_2 = \\tfrac{1}{2}\\cdot ${szK(p2, 1)}\\cdot ${szK(L, 1)} = ${szK(Rb2, 3)}\\ \\text{kN},\\quad x_2 = 2L/3 = ${szK(xb2, 3)}\\ \\text{m}`}</M></div>
                  <div className="border-t border-petrol-200 pt-1.5"><M>{`R = R_1 + R_2 = ${szK(R, 3)}\\ \\text{kN}`}</M></div>
                  <div><M>{`k = \\frac{R_1 x_1 + R_2 x_2}{R} = ${szK(k, 3)}\\ \\text{m}`}</M></div>
                </>
              )}
            </div>
          </div>

          <div className="mt-3 rounded-xl border border-naracs-200 bg-naracs-50 px-4 py-3">
            <p className="text-[10.5px] font-bold tracking-[0.16em] text-naracs-700 uppercase">Az eredő</p>
            <p className="szamok mt-1 text-[16px] font-semibold text-petrol-900">
              {R > 1e-9 ? `R = ${sz(R, 3)} kN, a bal végtől k = ${sz(k, 3)} m-re` : "R = 0 kN — nincs teher, nincs eredő"}
            </p>
            <p className="mt-0.5 text-[12.5px] text-petrol-600">
              Kapcsolgasd a három nézetet: a felbontás módja változik, az eredő nem.
            </p>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            <button type="button" onClick={() => { setP1(1.8); setP2(3.6); setL(4.5); }} className="rounded-lg bg-white px-2.5 py-1.5 text-[12px] font-medium text-petrol-600 ring-1 ring-petrol-200 transition hover:bg-petrol-50">GYF‑1 adatai</button>
            <button type="button" onClick={() => { setP1(4); setP2(4); }} className="rounded-lg bg-white px-2.5 py-1.5 text-[12px] font-medium text-petrol-600 ring-1 ring-petrol-200 transition hover:bg-petrol-50">Egyenletes</button>
            <button type="button" onClick={() => { setP1(0); setP2(6); }} className="rounded-lg bg-white px-2.5 py-1.5 text-[12px] font-medium text-petrol-600 ring-1 ring-petrol-200 transition hover:bg-petrol-50">Háromszög</button>
          </div>
        </div>
      </div>
    </div>
  );
}
