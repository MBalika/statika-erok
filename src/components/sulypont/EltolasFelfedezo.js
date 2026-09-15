"use client";

import { useEffect, useRef, useState } from "react";
import { Csuszka } from "@/components/abrak/ErovektorBonto";
import { M } from "@/components/ui/Keplet";
import { sz, szK } from "@/lib/szamok";

/*
 * A statikai nyomaték eltolása – felfedező.
 * Egy rögzített L-idom; az origó (O'') a rajzon húzható vagy csúszkával mozgatható.
 * Élőben látszik A, S_y'', S_z'' az aktuális origóra, a súlypont koordinátái,
 * és egy sáv-diagram mutatja, hogy S lineárisan változik az eltolással —
 * a súlypont a rajzon közben nem mozdul. „Ugorj a súlypontba”: az origó S-be
 * animálódik, és ott S_y = S_z = 0.
 *
 * Koordináták: y balra, z lefelé. A kiinduló O' rendszer origója az L felső
 * jobb sarka; a mozgó O'' origó helye O'-ben (y_0; z_0).
 */

const SZ = 600;
const MA = 420;
const LEPTEK = 2; // képpont / mm
const OX = 400; // O' a képen
const OY = 70;
const X = (y) => OX - y * LEPTEK; // y balra
const Y = (z) => OY + z * LEPTEK; // z lefelé

// L-idom két téglalapja az O' rendszerben: {y0 (jobb szél), z0 (felső él), b, h}
const RESZEK = [
  { nev: "álló szár", y0: 0, z0: 0, b: 20, h: 120, szin: "#bcdce2" },
  { nev: "fekvő szár", y0: 20, z0: 100, b: 100, h: 20, szin: "#fed7aa" },
];
const ADAT = RESZEK.map((r) => ({ ...r, A: r.b * r.h, y: r.y0 + r.b / 2, z: r.z0 + r.h / 2 }));
const A = ADAT.reduce((s, r) => s + r.A, 0); // 4 400
const SY1 = ADAT.reduce((s, r) => s + r.A * r.z, 0); // S_y' = 364 000
const SZ1 = ADAT.reduce((s, r) => s + r.A * r.y, 0); // S_z' = 164 000
const YS = SZ1 / A; // 37,27
const ZS = SY1 / A; // 82,73

const MIN = -40;
const MAX = 160;
const NAR = "#e2590a";
const LILA = "#7c3aed";
const ZOLD = "#15803d";
const SMAX = A * 100; // a sáv-diagram skálája (±100 mm eltolás)

function ezres(v) {
  const s = sz(v, 0);
  const neg = s.startsWith("-");
  const t = (neg ? s.slice(1) : s).replace(/\B(?=(\d{3})+(?!\d))/g, "\u202f");
  return (neg ? "−" : "") + t;
}
const ezresK = (v) => ezres(v).replace("−", "-").replace(/\u202f/g, "\\,");

function Sav({ cimke, ertek, nulla }) {
  const w = 220;
  const fel = Math.max(-1, Math.min(1, ertek / SMAX));
  const x0 = w / 2;
  const x1 = w / 2 + fel * (w / 2 - 6);
  return (
    <div className="flex items-center gap-2">
      <span className="szamok w-9 text-[12px] font-semibold text-petrol-700">{cimke}</span>
      <svg viewBox={`0 0 ${w} 18`} className="h-[18px] w-full max-w-[220px]">
        <line x1={4} y1={9} x2={w - 4} y2={9} stroke="#cbd5e1" strokeWidth="1" />
        <line x1={x0} y1={2} x2={x0} y2={16} stroke="#64748b" strokeWidth="1" />
        <rect x={Math.min(x0, x1)} y={4} width={Math.max(2, Math.abs(x1 - x0))} height={10} rx="2" fill={nulla ? ZOLD : LILA} opacity="0.85" style={{ transition: "width 120ms, x 120ms" }} />
      </svg>
      <span className={`szamok w-24 text-right text-[12px] font-semibold ${nulla ? "text-emerald-700" : "text-petrol-800"}`}>{nulla ? "≈ 0" : ezres(ertek)}</span>
    </div>
  );
}

export default function EltolasFelfedezo() {
  const [y0, setY0] = useState(0);
  const [z0, setZ0] = useState(0);
  const [huzasban, setHuzasban] = useState(false);
  const svgRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => () => rafRef.current && cancelAnimationFrame(rafRef.current), []);

  const Sy = SY1 - z0 * A; // S_y'' = S_y' − z_0 A
  const Sz = SZ1 - y0 * A; // S_z'' = S_z' − y_0 A
  const ys2 = Sz / A; // a súlypont O''-ben
  const zs2 = Sy / A;
  const nullaY = Math.abs(Sy) < 0.5 * A; // fél mm-en belül
  const nullaZ = Math.abs(Sz) < 0.5 * A;
  const sulypontban = nullaY && nullaZ;

  const huzas = (e) => {
    e.preventDefault();
    const svg = svgRef.current;
    if (!svg) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setHuzasban(true);
    const mozgat = (esem) => {
      const ctm = svg.getScreenCTM();
      let px, py;
      if (ctm) {
        const pt = new DOMPoint(esem.clientX, esem.clientY).matrixTransform(ctm.inverse());
        px = pt.x;
        py = pt.y;
      } else {
        const r = svg.getBoundingClientRect();
        px = ((esem.clientX - r.left) / r.width) * SZ;
        py = ((esem.clientY - r.top) / r.height) * MA;
      }
      const y = Math.round((OX - px) / LEPTEK);
      const z = Math.round((py - OY) / LEPTEK);
      // „kattanás”: a súlypont 4 mm-es körzetében az origó beugrik pontosan S-be
      if (Math.hypot(y - YS, z - ZS) < 4) {
        setY0(YS);
        setZ0(ZS);
        return;
      }
      setY0(Math.max(MIN, Math.min(MAX, y)));
      setZ0(Math.max(MIN, Math.min(MAX, z)));
    };
    mozgat(e);
    const vege = () => {
      setHuzasban(false);
      window.removeEventListener("pointermove", mozgat);
      window.removeEventListener("pointerup", vege);
    };
    window.addEventListener("pointermove", mozgat);
    window.addEventListener("pointerup", vege);
  };

  const ugras = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const yk = y0;
    const zk = z0;
    let kezdet = null;
    const lep = (most) => {
      if (kezdet == null) kezdet = most;
      const u = Math.min(1, (most - kezdet) / 700);
      const s = u * u * (3 - 2 * u);
      setY0(yk + (YS - yk) * s);
      setZ0(zk + (ZS - zk) * s);
      if (u < 1) rafRef.current = requestAnimationFrame(lep);
      else {
        setY0(YS);
        setZ0(ZS);
      }
    };
    rafRef.current = requestAnimationFrame(lep);
  };

  const ox2 = X(y0);
  const oy2 = Y(z0);
  const kiir = (v) => sz(v, Number.isInteger(v) ? 0 : 2);
  // „− z_0 A” kiírása: negatív eltolásnál „+ 40 · A”
  const tag = (v) => `${v < 0 ? "+" : "-"} ${szK(Math.abs(v), Number.isInteger(v) ? 0 : 2)}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white">
      <div className="flex flex-wrap items-center gap-2 border-b border-[color:var(--keret)] bg-petrol-50/70 px-4 py-2.5">
        <span className="text-[12.5px] font-semibold text-petrol-800">Az origó eltolása — mi változik és mi nem?</span>
        <button type="button" onClick={ugras} className="ml-auto rounded-lg bg-naracs-500 px-3 py-1.5 text-[12px] font-semibold text-white transition hover:bg-naracs-600">
          Ugorj a súlypontba →
        </button>
        <button type="button" onClick={() => { setY0(0); setZ0(0); }} className="rounded-lg bg-white px-3 py-1.5 text-[12px] font-medium text-petrol-600 ring-1 ring-petrol-200 transition hover:bg-petrol-50">
          Vissza O′-be
        </button>
      </div>

      <div className="grid lg:grid-cols-[1.2fr_1fr] [&>*]:min-w-0">
        <div className="racs-vilagos border-b border-[color:var(--keret)] p-3 lg:border-r lg:border-b-0">
          <svg ref={svgRef} viewBox={`0 0 ${SZ} ${MA}`} className="abra w-full touch-none select-none" style={{ cursor: huzasban ? "grabbing" : "default" }}>
            <defs>
              <marker id="hegy-ef-l" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 1 L 9 5 L 0 9 z" fill={LILA} />
              </marker>
              <marker id="hegy-ef-sz" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 9 5 L 0 9 z" fill="#94a3b8" />
              </marker>
            </defs>

            {/* az idom */}
            {ADAT.map((r, i) => (
              <g key={i}>
                <rect x={X(r.y0 + r.b)} y={Y(r.z0)} width={r.b * LEPTEK} height={r.h * LEPTEK} fill={r.szin} stroke="#234957" strokeWidth="1.4" />
                <circle cx={X(r.y)} cy={Y(r.z)} r="3" fill="#1d3c48" stroke="white" strokeWidth="1.2" />
                <text x={X(r.y) + 6} y={Y(r.z) - 5} fontSize="11" fontWeight="650" style={{ fill: "#1d3c48", paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
                  S{i + 1}
                </text>
              </g>
            ))}
            {/* méretek */}
            <line x1={X(120)} y1={Y(120) + 16} x2={X(0)} y2={Y(120) + 16} stroke="#94a3b8" strokeWidth="1" markerStart="url(#hegy-ef-sz)" markerEnd="url(#hegy-ef-sz)" />
            <text x={X(60)} y={Y(120) + 30} textAnchor="middle" fontSize="11" style={{ fill: "#64748b" }}>120</text>
            <line x1={X(0) + 16} y1={Y(0)} x2={X(0) + 16} y2={Y(120)} stroke="#94a3b8" strokeWidth="1" markerStart="url(#hegy-ef-sz)" markerEnd="url(#hegy-ef-sz)" />
            <text x={X(0) + 22} y={Y(60) + 4} fontSize="11" style={{ fill: "#64748b" }}>120</text>
            <text x={X(10)} y={Y(0) + 14} textAnchor="middle" fontSize="10.5" style={{ fill: "#475569" }}>20</text>
            <text x={X(120) - 6} y={Y(110) + 4} textAnchor="end" fontSize="10.5" style={{ fill: "#64748b" }}>20</text>

            {/* a kiinduló O' rendszer (halványan) */}
            <g opacity="0.55">
              <line x1={OX} y1={OY} x2={OX - 60} y2={OY} stroke="#64748b" strokeWidth="1" strokeDasharray="3 3" />
              <line x1={OX} y1={OY} x2={OX} y2={OY + 60} stroke="#64748b" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx={OX} cy={OY} r="2.5" fill="#64748b" />
              <text x={OX + 6} y={OY - 6} fontSize="11.5" fontWeight="600" style={{ fill: "#475569" }}>O′</text>
            </g>

            {/* a súlypont – nem mozdul */}
            <line x1={ox2} y1={oy2} x2={X(YS)} y2={oy2} stroke={NAR} strokeWidth="1" strokeDasharray="4 3" opacity="0.7" />
            <line x1={X(YS)} y1={oy2} x2={X(YS)} y2={Y(ZS)} stroke={NAR} strokeWidth="1" strokeDasharray="4 3" opacity="0.7" />
            {!sulypontban && (
              <>
                <text x={(ox2 + X(YS)) / 2} y={oy2 - 6} textAnchor="middle" fontSize="11" fontWeight="650" style={{ fill: NAR, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
                  yₛ″ = {sz(ys2, 1)}
                </text>
                <text x={X(YS) + (zs2 >= 0 ? -6 : 6)} y={(oy2 + Y(ZS)) / 2 + 4} textAnchor={zs2 >= 0 ? "end" : "start"} fontSize="11" fontWeight="650" style={{ fill: NAR, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
                  zₛ″ = {sz(zs2, 1)}
                </text>
              </>
            )}
            <g>
              <line x1={X(YS) - 9} y1={Y(ZS)} x2={X(YS) + 9} y2={Y(ZS)} stroke={NAR} strokeWidth="1" />
              <line x1={X(YS)} y1={Y(ZS) - 9} x2={X(YS)} y2={Y(ZS) + 9} stroke={NAR} strokeWidth="1" />
              <circle cx={X(YS)} cy={Y(ZS)} r="5" fill={NAR} stroke="white" strokeWidth="1.6" />
              <text x={X(YS) + 10} y={Y(ZS) + 15} fontSize="12.5" fontWeight="700" style={{ fill: NAR, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
                S
              </text>
            </g>

            {/* a mozgó O'' rendszer */}
            <g style={{ pointerEvents: "none" }}>
              <line x1={ox2} y1={oy2} x2={ox2 - 90} y2={oy2} stroke={LILA} strokeWidth="1.6" markerEnd="url(#hegy-ef-l)" />
              <line x1={ox2} y1={oy2} x2={ox2} y2={oy2 + 90} stroke={LILA} strokeWidth="1.6" markerEnd="url(#hegy-ef-l)" />
              <text x={ox2 - 96} y={oy2 + 4} textAnchor="end" fontSize="12" fontStyle="italic" fontWeight="600" style={{ fill: LILA, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>y″</text>
              <text x={ox2 + 6} y={oy2 + 100} fontSize="12" fontStyle="italic" fontWeight="600" style={{ fill: LILA, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>z″</text>
              <text x={ox2 + 10} y={oy2 - 10} fontSize="11.5" fontWeight="650" style={{ fill: LILA, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
                O″ ({kiir(y0)}; {kiir(z0)})
              </text>
            </g>
            {sulypontban && (
              <g style={{ pointerEvents: "none" }}>
                <circle cx={ox2} cy={oy2} r="16" fill="none" stroke={ZOLD} strokeWidth="2" opacity="0.7" />
                <circle cx={ox2} cy={oy2} r="24" fill="none" stroke={ZOLD} strokeWidth="1" opacity="0.35" />
              </g>
            )}
            <g onPointerDown={huzas} style={{ cursor: "grab", touchAction: "none" }}>
              <circle cx={ox2} cy={oy2} r="18" fill="transparent" />
              <circle cx={ox2} cy={oy2} r="7" fill={huzasban ? LILA : "white"} stroke={LILA} strokeWidth="2.5" />
            </g>

            {sulypontban && (
              <text x={SZ / 2} y={MA - 10} textAnchor="middle" fontSize="12.5" fontWeight="700" style={{ fill: ZOLD, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
                Az origó a súlypontban: Sy = Sz = 0 — ez a súlyponti koordináta-rendszer.
              </text>
            )}
            {!sulypontban && !huzasban && (
              <text x={SZ / 2} y={MA - 10} textAnchor="middle" fontSize="11.5" style={{ fill: LILA }}>
                húzd a lila origót — vagy használd a csúszkákat
              </text>
            )}
          </svg>
        </div>

        <div className="p-4 sm:p-5">
          <div className="grid gap-x-4 gap-y-2 sm:grid-cols-2 lg:grid-cols-1">
            <Csuszka cimke="az origó eltolása balra, y₀" ertek={y0} egyseg="mm" min={MIN} max={MAX} lepes={1} tizedes={0} onChange={(v) => { if (rafRef.current) cancelAnimationFrame(rafRef.current); setY0(v); }} />
            <Csuszka cimke="az origó eltolása lefelé, z₀" ertek={z0} egyseg="mm" min={MIN} max={MAX} lepes={1} tizedes={0} onChange={(v) => { if (rafRef.current) cancelAnimationFrame(rafRef.current); setZ0(v); }} />
          </div>

          <div className="szamok mt-4 space-y-1.5 rounded-xl bg-petrol-50 px-3.5 py-3 text-[13px] text-petrol-900">
            <div className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">Az O′ rendszerben (rögzített)</div>
            <div><M>{`A = 2400 + 2000 = ${ezresK(A)}\\ \\text{mm}^2`}</M></div>
            <div><M>{`S_{y'} = ${ezresK(SY1)},\\quad S_{z'} = ${ezresK(SZ1)}\\ \\text{mm}^3`}</M></div>
            <div><M>{`y_S' = ${szK(YS, 2)},\\quad z_S' = ${szK(ZS, 2)}\\ \\text{mm}`}</M></div>
          </div>

          <div className={`mt-3 rounded-xl border px-3.5 py-3 text-[13px] ${sulypontban ? "border-emerald-300 bg-emerald-50" : "border-violet-200 bg-violet-50"}`}>
            <div className={`text-[10.5px] font-bold tracking-[0.16em] uppercase ${sulypontban ? "text-emerald-800" : "text-violet-800"}`}>
              Az O″ rendszerben — eltolás × terület
            </div>
            <div className="szamok mt-1.5 space-y-1.5 text-petrol-900">
              <div><M>{`S_{y''} = S_{y'} - z_0 A = ${ezresK(SY1)} ${tag(z0)}\\cdot ${ezresK(A)} = ${nullaY ? "0" : ezresK(Sy)}`}</M></div>
              <div><M>{`S_{z''} = S_{z'} - y_0 A = ${ezresK(SZ1)} ${tag(y0)}\\cdot ${ezresK(A)} = ${nullaZ ? "0" : ezresK(Sz)}`}</M></div>
            </div>
            <div className="mt-2.5 space-y-1">
              <Sav cimke="Sy″" ertek={Sy} nulla={nullaY} />
              <Sav cimke="Sz″" ertek={Sz} nulla={nullaZ} />
            </div>
            <div className="szamok mt-2 text-petrol-900">
              <M>{`z_S'' = \\frac{S_{y''}}{A} = ${szK(zs2, 2)},\\quad y_S'' = \\frac{S_{z''}}{A} = ${szK(ys2, 2)}\\ \\text{mm}`}</M>
            </div>
            <p className="mt-2 text-[12px] text-petrol-600">
              {sulypontban ? (
                <>
                  A súlyponton átmenő tengelyekre a statikai nyomaték nulla — ez a súlypont definíciója (tankönyv 9.14). A
                  súlyponti koordináták: <M>{"y = y' - y_S'"}</M>, <M>{"z = z' - z_S'"}</M>.
                </>
              ) : (
                "A statikai nyomaték az eltolással lineárisan változik (a sáv), a narancs S a rajzon egy hajszálnyit sem mozdul: csak a koordinátái mások."
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
