"use client";

import { useRef, useState } from "react";
import {
  Cimke,
  Fogopont,
  Nyil,
  NyilHegyek,
  SzogIv,
  Tengelyek,
} from "./SvgElemek";
import {
  derekszogu,
  fokRad,
  normalizalSzog,
  polaris,
  siknegyed,
  sz,
  szK,
} from "@/lib/szamok";
import { M } from "@/components/ui/Keplet";

const SZ = 540;
const MA = 360;
const OX = 250;
const OY = 185;
const LEPTEK = 17; // képpont / N (10 N = 170 px, még a rajzon belül)

export default function ErovektorBonto() {
  const [F, setF] = useState(5);
  const [alfa, setAlfa] = useState(40);
  const svgRef = useRef(null);

  const { x: Fx, y: Fy } = derekszogu(F, alfa);
  const vx = OX + Fx * LEPTEK;
  const vy = OY - Fy * LEPTEK;
  const neg = siknegyed(alfa);

  const huzas = (e) => {
    e.preventDefault();
    const svg = svgRef.current;
    if (!svg) return;
    const mozgat = (esem) => {
      const r = svg.getBoundingClientRect();
      const px = ((esem.clientX - r.left) / r.width) * SZ;
      const py = ((esem.clientY - r.top) / r.height) * MA;
      const { nagysag, szog } = polaris((px - OX) / LEPTEK, (OY - py) / LEPTEK);
      setF(Math.min(10, Math.max(0.5, Math.round(nagysag * 10) / 10)));
      setAlfa(Math.round(szog));
    };
    mozgat(e);
    const vege = () => {
      window.removeEventListener("pointermove", mozgat);
      window.removeEventListener("pointerup", vege);
    };
    window.addEventListener("pointermove", mozgat);
    window.addEventListener("pointerup", vege);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white">
      <div className="grid lg:grid-cols-[1.25fr_1fr] [&>*]:min-w-0">
        {/* Ábra */}
        <div className="racs-vilagos border-b border-[color:var(--keret)] p-3 lg:border-r lg:border-b-0">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${SZ} ${MA}`}
            className="abra w-full touch-none select-none"
          >
            <NyilHegyek />
            <Tengelyek ox={OX} oy={OY} balra={235} jobbra={265} fel={162} le={160} />

            {/* Segédvonalak a komponensekhez */}
            <line x1={vx} y1={vy} x2={vx} y2={OY} className="segedvonal" />
            <line x1={vx} y1={vy} x2={OX} y2={vy} className="segedvonal" />

            {/* Komponensek */}
            <Nyil x1={OX} y1={OY} x2={vx} y2={OY} szin="komp" vastagsag={3} />
            <Nyil x1={OX} y1={OY} x2={OX} y2={vy} szin="komp" vastagsag={3} />

            {/* Eredeti vektor */}
            <Nyil x1={OX} y1={OY} x2={vx} y2={vy} szin="ero" vastagsag={3.4} />

            <SzogIv ox={OX} oy={OY} sugar={40} kezdoFok={0} vegFok={alfa} />
            {(() => {
              // az α felirat: az ív közepénél, kifelé; kis szögnél az F nyíl fölé, hogy ne az Fx komponensre kerüljön
              const kicsi = alfa < 26;
              const kozep = kicsi ? alfa + 24 : alfa / 2;
              const r = kicsi ? 72 : 64;
              return (
                <Cimke x={OX + r * Math.cos(fokRad(kozep))} y={OY - r * Math.sin(fokRad(kozep)) + 4} szin="#64748b" meret={12} vastag={false}>
                  α = {alfa}°
                </Cimke>
              );
            })()}

            <Cimke x={vx + (Fx >= 0 ? 16 : -16)} y={vy - 10} szin="var(--color-jel-ero)">
              F = {sz(F, 1)} N
            </Cimke>
            <Cimke
              x={(OX + vx) / 2 + (Math.abs(Fx) < 1.2 ? 48 : 0)}
              y={OY + (Fy >= 0 ? 20 : -10)}
              szin="var(--color-jel-komp)"
              meret={12.5}
            >
              Fx = {sz(Fx, 2)}
            </Cimke>
            <Cimke
              x={OX + (Fx >= 0 ? -12 : 12)}
              y={(OY + vy) / 2 + 4 - (Math.abs(Fy) < 1.2 ? 10 : 0)}
              szin="var(--color-jel-komp)"
              meret={12.5}
              horgony={Fx >= 0 ? "end" : "start"}
            >
              Fy = {sz(Fy, 2)}
            </Cimke>

            <Fogopont x={vx} y={vy} onPointerDown={huzas} />
          </svg>
          <p className="mt-1 text-center text-[11.5px] text-petrol-400">
            Húzd a vektor végét, vagy állítsd a csúszkákat.
          </p>
        </div>

        {/* Vezérlők és kiírás */}
        <div className="p-5">
          <div className="space-y-4">
            <Csuszka
              cimke="Nagyság, F"
              ertek={F}
              egyseg="N"
              min={0.5}
              max={10}
              lepes={0.1}
              tizedes={1}
              onChange={setF}
            />
            <Csuszka
              cimke="Irányszög, α (az x tengelytől)"
              ertek={alfa}
              egyseg="°"
              min={0}
              max={360}
              lepes={1}
              tizedes={0}
              onChange={(v) => setAlfa(normalizalSzog(v))}
            />
          </div>

          <div className="mt-5 rounded-xl bg-petrol-50 p-4">
            <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">
              Komponensek
            </p>
            <div className="szamok mt-2 space-y-1.5 text-[14px] text-petrol-800">
              <div>
                <M>{`F_x = F\\cos\\alpha = ${szK(F, 1)}\\cdot\\cos ${alfa}^\\circ = ${szK(Fx, 3)}\\ \\text{N}`}</M>
              </div>
              <div>
                <M>{`F_y = F\\sin\\alpha = ${szK(F, 1)}\\cdot\\sin ${alfa}^\\circ = ${szK(Fy, 3)}\\ \\text{N}`}</M>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 rounded-xl border border-naracs-200 bg-naracs-50 px-4 py-2.5">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-naracs-500 text-[12px] font-bold text-white">
              {neg.szam}
            </span>
            <span className="szamok text-[13px] text-petrol-800">
              síknegyed → {neg.jelek}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {[
              ["I.", 40],
              ["II.", 125],
              ["III.", 215],
              ["IV.", 305],
            ].map(([nev, s]) => (
              <button
                key={nev}
                type="button"
                onClick={() => setAlfa(s)}
                className="rounded-lg bg-white px-2.5 py-1.5 text-[12px] font-medium text-petrol-600 ring-1 ring-petrol-200 transition hover:bg-petrol-50"
              >
                {nev} negyed
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Csuszka({
  cimke,
  ertek,
  egyseg,
  min,
  max,
  lepes,
  tizedes = 1,
  onChange,
}) {
  return (
    <label className="block">
      <span className="mb-1 flex items-baseline justify-between">
        <span className="text-[12.5px] font-medium text-petrol-600">
          {cimke}
        </span>
        <span className="szamok rounded-md bg-petrol-100 px-2 py-0.5 text-[12.5px] font-semibold text-petrol-800">
          {sz(ertek, tizedes)}
          {egyseg ? ` ${egyseg}` : ""}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={lepes}
        value={ertek}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-petrol-100 accent-[color:var(--color-naracs-500)]"
      />
    </label>
  );
}
