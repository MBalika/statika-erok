"use client";

import { useRef, useState } from "react";
import { Cimke, Fogopont, Nyil, NyilHegyek, Tengelyek } from "./SvgElemek";
import { Csuszka } from "./ErovektorBonto";
import { derekszogu, sz, szK } from "@/lib/szamok";
import { M } from "@/components/ui/Keplet";

const SZ = 600;
const MA = 400;
const OX = 210;
const OY = 250;
const LEPTEK = 26; // képpont / méter

export default function NyomatekFelfedezo() {
  const [P, setP] = useState({ x: 4, y: 2 }); // támadáspont, méterben
  const [F, setF] = useState(6);
  const [alfa, setAlfa] = useState(35);
  const svgRef = useRef(null);

  const { x: Fx, y: Fy } = derekszogu(F, alfa);

  // Nyomaték az origóra, az óramutatóval ellentétes forgás a pozitív
  const Mo = P.x * Fy - P.y * Fx;
  // Az erőkar: az origó távolsága a hatásvonaltól
  const kar = Math.abs(Mo) / F;

  // A hatásvonal talppontja (az origóhoz legközelebbi pontja)
  const ex = Fx / F;
  const ey = Fy / F;
  const t = -(P.x * ex + P.y * ey);
  const talp = { x: P.x + t * ex, y: P.y + t * ey };

  const kepX = (x) => OX + x * LEPTEK;
  const kepY = (y) => OY - y * LEPTEK;

  const huzas = (e) => {
    e.preventDefault();
    const svg = svgRef.current;
    if (!svg) return;
    const mozgat = (esem) => {
      const r = svg.getBoundingClientRect();
      const px = ((esem.clientX - r.left) / r.width) * SZ;
      const py = ((esem.clientY - r.top) / r.height) * MA;
      setP({
        x: Math.max(-6, Math.min(13, Math.round(((px - OX) / LEPTEK) * 2) / 2)),
        y: Math.max(-5, Math.min(5, Math.round(((OY - py) / LEPTEK) * 2) / 2)),
      });
    };
    mozgat(e);
    const vege = () => {
      window.removeEventListener("pointermove", mozgat);
      window.removeEventListener("pointerup", vege);
    };
    window.addEventListener("pointermove", mozgat);
    window.addEventListener("pointerup", vege);
  };

  // A hatásvonal két végpontja, hogy átérjen az ábrán
  const hossz = 26;
  const hv1 = { x: talp.x - ex * hossz, y: talp.y - ey * hossz };
  const hv2 = { x: talp.x + ex * hossz, y: talp.y + ey * hossz };

  const forgasIrany = Mo > 0.001 ? "balra (pozitív)" : Mo < -0.001 ? "jobbra (negatív)" : "nem forgat";

  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white">
      <div className="grid lg:grid-cols-[1.3fr_1fr]">
        <div className="racs-vilagos border-b border-[color:var(--keret)] p-3 lg:border-r lg:border-b-0">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${SZ} ${MA}`}
            className="abra w-full touch-none select-none"
          >
            <NyilHegyek />
            <Tengelyek ox={OX} oy={OY} balra={190} jobbra={370} fel={215} le={135} />

            {/* hatásvonal */}
            <line
              x1={kepX(hv1.x)}
              y1={kepY(hv1.y)}
              x2={kepX(hv2.x)}
              y2={kepY(hv2.y)}
              stroke="#94a3b8"
              strokeWidth="1.2"
              strokeDasharray="6 4"
            />

            {/* erőkar: merőleges az origóból a hatásvonalra */}
            {kar > 0.05 && (
              <>
                <line
                  x1={OX}
                  y1={OY}
                  x2={kepX(talp.x)}
                  y2={kepY(talp.y)}
                  stroke="#7c3aed"
                  strokeWidth="2"
                  strokeDasharray="5 3"
                />
                <Cimke
                  x={(OX + kepX(talp.x)) / 2 - (talp.y / (kar || 1)) * 20}
                  y={(OY + kepY(talp.y)) / 2 - (talp.x / (kar || 1)) * 20 + 4}
                  szin="#7c3aed"
                  meret={12.5}
                >
                  k = {sz(kar, 2)} m
                </Cimke>
              </>
            )}

            {/* az erő */}
            <Nyil
              x1={kepX(P.x)}
              y1={kepY(P.y)}
              x2={kepX(P.x + Fx / 2.2)}
              y2={kepY(P.y + Fy / 2.2)}
              szin="ero"
              vastagsag={3.4}
            />
            <Cimke
              x={kepX(P.x + Fx / 2.2) + 18}
              y={kepY(P.y + Fy / 2.2) - 10}
              szin="var(--color-jel-ero)"
            >
              F = {sz(F, 1)} kN
            </Cimke>

            {/* origó és támadáspont */}
            <circle cx={OX} cy={OY} r="4.5" fill="#1d3c48" />
            <Cimke x={OX - 16} y={OY + 20} szin="#1d3c48" meret={13}>
              O
            </Cimke>
            <Fogopont x={kepX(P.x)} y={kepY(P.y)} onPointerDown={huzas} />
            <Cimke x={kepX(P.x) + 4} y={kepY(P.y) + 24} szin="#64748b" meret={11.5} vastag={false}>
              P ({sz(P.x, 1)}; {sz(P.y, 1)})
            </Cimke>

            {/* forgásirány jelzése az origó körül */}
            {Math.abs(Mo) > 0.001 && (
              <g>
                <path
                  d={
                    Mo > 0
                      ? "M 26 -15 A 30 30 0 0 0 -26 -15"
                      : "M -26 -15 A 30 30 0 0 1 26 -15"
                  }
                  transform={`translate(${OX} ${OY})`}
                  fill="none"
                  stroke="#7c3aed"
                  strokeWidth="2.4"
                  markerEnd="url(#hegy-eredo)"
                />
              </g>
            )}
          </svg>
          <p className="mt-1 text-center text-[11.5px] text-petrol-400">
            Húzd a támadáspontot. Ha a hatásvonala mentén tolod, a nyomaték nem
            változik.
          </p>
        </div>

        <div className="p-4 sm:p-5">
          <div className="space-y-4">
            <Csuszka cimke="Nagyság, F" ertek={F} egyseg="kN" min={1} max={10} lepes={0.5} tizedes={1} onChange={setF} />
            <Csuszka cimke="Irányszög, α" ertek={alfa} egyseg="°" min={0} max={359} lepes={1} tizedes={0} onChange={setAlfa} />
          </div>

          <div className="mt-5 rounded-xl bg-petrol-50 p-4">
            <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">
              Kétféleképpen, ugyanaz
            </p>
            <div className="szamok mt-2 space-y-2 text-[13.5px] text-petrol-800">
              <div>
                <M>{`M^{(O)} = x F_y - y F_x = ${szK(P.x, 1)}\\cdot ${szK(Fy, 2)} - ${szK(P.y, 1)}\\cdot ${szK(Fx, 2)}`}</M>
              </div>
              <div>
                <M>{`M^{(O)} = \\pm F\\,k = ${szK(F, 1)}\\cdot ${szK(kar, 2)}`}</M>
              </div>
            </div>
          </div>

          <div className="mt-3 rounded-xl border border-naracs-200 bg-naracs-50 px-4 py-3">
            <p className="text-[10.5px] font-bold tracking-[0.16em] text-naracs-700 uppercase">
              Eredmény
            </p>
            <p className="szamok mt-1 text-[17px] font-semibold text-petrol-900">
              M<sup>(O)</sup> = {sz(Mo, 2)} kNm
            </p>
            <p className="mt-0.5 text-[12.5px] text-petrol-600">
              az erő {forgasIrany} forgat az O pont körül
            </p>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setP({ x: talp.x, y: talp.y })}
              className="rounded-lg bg-white px-2.5 py-1.5 text-[12px] font-medium text-petrol-600 ring-1 ring-petrol-200 transition hover:bg-petrol-50"
            >
              Told a talppontba
            </button>
            <button
              type="button"
              onClick={() => setAlfa(Math.round(Math.atan2(P.y, P.x) * (180 / Math.PI)))}
              className="rounded-lg bg-white px-2.5 py-1.5 text-[12px] font-medium text-petrol-600 ring-1 ring-petrol-200 transition hover:bg-petrol-50"
            >
              Hatásvonal az O-n át
            </button>
            <button
              type="button"
              onClick={() => { setP({ x: 4, y: 2 }); setF(6); setAlfa(35); }}
              className="rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-petrol-500 transition hover:text-petrol-800"
            >
              Alaphelyzet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
