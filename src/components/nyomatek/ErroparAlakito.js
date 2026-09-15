"use client";

import { useState } from "react";
import { Csuszka } from "@/components/abrak/ErovektorBonto";
import { sz, szK } from "@/lib/szamok";
import { M } from "@/components/ui/Keplet";

/*
 * Nyomaték erőpárrá alakítása (tankönyv 3.9. ábra).
 * Adott M; vagy az erő nagyságát (→ d = |M|/F), vagy a kart (→ F = |M|/d) választjuk.
 * Az erők iránya szabadon forgatható — a kar nem függ tőle.
 */

const SZ = 600;
const MA = 420;
const CX = 300;
const CY = 215;
const L = 16; // képpont / m
const E = 5; // képpont / kN
const RAD = Math.PI / 180;

function Hegy({ id, szin }) {
  return (
    <marker id={id} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
      <path d="M 0 1 L 9 5 L 0 9 z" fill={szin} />
    </marker>
  );
}

export default function ErroparAlakito() {
  const [Mny, setMny] = useState(24);
  const [mod, setMod] = useState("F"); // "F": az erő adott, "d": a kar adott
  const [F, setF] = useState(6);
  const [dAdott, setDAdott] = useState(4);
  const [beta, setBeta] = useState(90);

  const nulla = Math.abs(Mny) < 1e-9;
  const d = mod === "F" ? Math.abs(Mny) / F : dAdott;
  const Fert = mod === "F" ? F : Math.abs(Mny) / dAdott;
  const s = Mny >= 0 ? 1 : -1;

  // u: az erők iránya, n: arra merőleges (a két hatásvonal ebben az irányban van eltolva)
  const u = { x: Math.cos(beta * RAD), y: Math.sin(beta * RAD) };
  const n = { x: -u.y, y: u.x };
  // F1 = −s·F·u a +n oldalon, F2 = +s·F·u a −n oldalon → M = s·F·d (l. levezetés a szövegben)
  const p1 = { x: (d / 2) * n.x, y: (d / 2) * n.y };
  const p2 = { x: -(d / 2) * n.x, y: -(d / 2) * n.y };
  const f1 = { x: -s * Fert * u.x, y: -s * Fert * u.y };
  const f2 = { x: s * Fert * u.x, y: s * Fert * u.y };

  const kx = (x) => CX + x * L;
  const ky = (y) => CY - y * L;
  const eroNyil = (p, f, id) => {
    // az erő a hatásvonalán, a talppontra centrálva
    const h = Math.min(Fert * E, 150);
    const ex = f.x / Fert;
    const ey = f.y / Fert;
    const x1 = kx(p.x) - (ex * h) / 2;
    const y1 = ky(p.y) + (ey * h) / 2;
    const x2 = kx(p.x) + (ex * h) / 2;
    const y2 = ky(p.y) - (ey * h) / 2;
    return { x1, y1, x2, y2, id };
  };
  const n1 = eroNyil(p1, f1, "F₁");
  const n2 = eroNyil(p2, f2, "F₂");
  const hv = 260; // a hatásvonal fele hossza képpontban

  const dKep = d * L;
  const tulNagy = dKep > 400;

  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white">
      <div className="grid lg:grid-cols-[1.3fr_1fr]">
        <div className="racs-vilagos border-b border-[color:var(--keret)] p-3 lg:border-r lg:border-b-0">
          <svg viewBox={`0 0 ${SZ} ${MA}`} className="abra w-full select-none">
            <defs>
              <Hegy id="ea-ero" szin="#e2590a" />
              <Hegy id="ea-m" szin="#be123c" />
              <Hegy id="ea-mer" szin="#94a3b8" />
            </defs>

            {/* hatásvonalak */}
            {[p1, p2].map((p, i) => (
              <line
                key={i}
                x1={kx(p.x) - u.x * hv}
                y1={ky(p.y) + u.y * hv}
                x2={kx(p.x) + u.x * hv}
                y2={ky(p.y) - u.y * hv}
                stroke="#94a3b8"
                strokeWidth="1.1"
                strokeDasharray="6 4"
              />
            ))}

            {/* a kar */}
            {dKep > 6 && (
              <>
                <line
                  x1={kx(p1.x) + u.x * 70}
                  y1={ky(p1.y) - u.y * 70}
                  x2={kx(p2.x) + u.x * 70}
                  y2={ky(p2.y) - u.y * 70}
                  stroke="#94a3b8"
                  strokeWidth="1"
                  markerStart="url(#ea-mer)"
                  markerEnd="url(#ea-mer)"
                />
                <text
                  x={CX + u.x * 84}
                  y={CY - u.y * 84 + 4}
                  textAnchor="middle"
                  fontSize="12.5"
                  fontWeight="650"
                  style={{ fill: "#475569", paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}
                >
                  d = {sz(d, 2)} m
                </text>
              </>
            )}

            {/* a nyomaték félköríves nyila középen */}
            {!nulla && (
              <>
                <path
                  d={s > 0 ? `M ${CX + 30} ${CY} A 30 30 0 1 0 ${CX - 30} ${CY}` : `M ${CX - 30} ${CY} A 30 30 0 1 1 ${CX + 30} ${CY}`}
                  fill="none"
                  stroke="#be123c"
                  strokeWidth="3"
                  markerEnd="url(#ea-m)"
                />
                <text
                  x={CX}
                  y={CY + 22}
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="700"
                  style={{ fill: "#be123c", paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}
                >
                  M = {sz(Mny, 0)} kNm {s > 0 ? "↶" : "↷"}
                </text>
              </>
            )}

            {/* a két erő */}
            {!nulla &&
              [n1, n2].map((ny) => (
                <g key={ny.id}>
                  <line x1={ny.x1} y1={ny.y1} x2={ny.x2} y2={ny.y2} stroke="#e2590a" strokeWidth="3.4" strokeLinecap="round" markerEnd="url(#ea-ero)" />
                  <text
                    x={ny.x2 + (ny.x2 >= ny.x1 ? 8 : -8)}
                    y={ny.y2 + (ny.y2 >= ny.y1 ? 14 : -8)}
                    textAnchor={ny.x2 >= ny.x1 ? "start" : "end"}
                    fontSize="12"
                    fontWeight="650"
                    style={{ fill: "#e2590a", paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}
                  >
                    {ny.id} = {sz(Fert, 2)} kN
                  </text>
                </g>
              ))}

            {nulla && (
              <text x={CX} y={CY} textAnchor="middle" fontSize="13" style={{ fill: "#64748b" }}>
                M = 0: nincs mit erőpárrá alakítani
              </text>
            )}
            {tulNagy && (
              <text x={CX} y={MA - 12} textAnchor="middle" fontSize="11.5" style={{ fill: "#94a3b8" }}>
                a kar kilóg a rajzból — kicsi erőhöz nagy kar tartozik
              </text>
            )}
          </svg>
          <p className="mt-1 text-center text-[11.5px] text-petrol-400">
            Forgasd az irányt: a két erő elfordul, de a kar ugyanakkora marad.
          </p>
        </div>

        <div className="p-4 sm:p-5">
          <div className="mb-3 flex gap-1 rounded-lg bg-petrol-50 p-0.5 ring-1 ring-petrol-200">
            {[
              ["F", "az erő adott → d"],
              ["d", "a kar adott → F"],
            ].map(([k, c]) => (
              <button
                key={k}
                type="button"
                onClick={() => setMod(k)}
                className={`flex-1 rounded-md px-2 py-1.5 text-[12px] font-semibold transition ${
                  mod === k ? "bg-petrol-700 text-white" : "text-petrol-600 hover:bg-white"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            <Csuszka cimke="Nyomaték, M (↶ pozitív)" ertek={Mny} egyseg="kNm" min={-60} max={60} lepes={1} tizedes={0} onChange={setMny} />
            {mod === "F" ? (
              <Csuszka cimke="Az erők nagysága, F" ertek={F} egyseg="kN" min={3} max={20} lepes={0.5} tizedes={1} onChange={setF} />
            ) : (
              <Csuszka cimke="A kar, d" ertek={dAdott} egyseg="m" min={0.5} max={20} lepes={0.5} tizedes={1} onChange={setDAdott} />
            )}
            <Csuszka cimke="Az erők iránya, β" ertek={beta} egyseg="°" min={0} max={180} lepes={1} tizedes={0} onChange={setBeta} />
          </div>

          <div className="mt-5 rounded-xl bg-petrol-50 p-4">
            <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">
              Az erőpár karja
            </p>
            <div className="szamok mt-2 space-y-2 text-[13.5px] text-petrol-800">
              <div>
                <M>{"M \\ekv (\\underline{F}_1, \\underline{F}_2),\\qquad |M| = F\\,d"}</M>
              </div>
              {!nulla && mod === "F" && (
                <div>
                  <M>{`d = \\frac{|M|}{F} = \\frac{${szK(Math.abs(Mny), 0)}}{${szK(F, 1)}} = ${szK(d, 3)}\\ \\text{m}`}</M>
                </div>
              )}
              {!nulla && mod === "d" && (
                <div>
                  <M>{`F = \\frac{|M|}{d} = \\frac{${szK(Math.abs(Mny), 0)}}{${szK(dAdott, 1)}} = ${szK(Fert, 3)}\\ \\text{kN}`}</M>
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 rounded-xl border border-naracs-200 bg-naracs-50 px-4 py-3">
            <p className="text-[10.5px] font-bold tracking-[0.16em] text-naracs-700 uppercase">
              Eredmény
            </p>
            {nulla ? (
              <p className="mt-1 text-[13px] text-petrol-700">Nulla nyomatékhoz nem tartozik erőpár.</p>
            ) : (
              <>
                <p className="szamok mt-1 text-[17px] font-semibold text-petrol-900">
                  d = {sz(d, 3)} m, F = {sz(Fert, 2)} kN
                </p>
                <p className="mt-0.5 text-[12.5px] text-petrol-600">
                  az erőpár {s > 0 ? "az óramutatóval ellentétesen" : "az óramutató járásával egyezően"} forgat, mint M; az irány (β) nem változtat d-n
                </p>
              </>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {[
              ["3.9.a: d adott", () => { setMod("d"); setMny(24); setDAdott(4); setBeta(90); }],
              ["3.9.b: F adott", () => { setMod("F"); setMny(24); setF(6); setBeta(90); }],
              ["3.9.c: ferde", () => { setMod("F"); setMny(24); setF(6); setBeta(40); }],
            ].map(([c, fn]) => (
              <button
                key={c}
                type="button"
                onClick={fn}
                className="rounded-lg bg-white px-2.5 py-1.5 text-[12px] font-medium text-petrol-600 ring-1 ring-petrol-200 transition hover:bg-petrol-50"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
