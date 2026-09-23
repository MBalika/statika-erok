"use client";

import { useRef, useState } from "react";
import { Cimke, Fogopont, Nyil, NyilHegyek, Tengelyek } from "./SvgElemek";
import { derekszogu, polaris, sz, szEl, szK } from "@/lib/szamok";
import { M } from "@/components/ui/Keplet";

const SZ = 580;
const MA = 400;
const OX = 205;
const OY = 250;
const LEPTEK = 17;

const SZINEK = ["#e2590a", "#0f766e", "#2563eb", "#be123c"];
const KEZDO = [
  { F: 5, a: 40 },
  { F: 6, a: 0 },
  { F: 8, a: -65 },
];

export default function VektorOsszegzo() {
  const [vektorok, setVektorok] = useState(KEZDO);
  const [mod, setMod] = useState("lanc"); // "lanc" | "kozos"
  const svgRef = useRef(null);

  const komp = vektorok.map((v) => derekszogu(v.F, v.a));
  const Rx = komp.reduce((s, k) => s + k.x, 0);
  const Ry = komp.reduce((s, k) => s + k.y, 0);
  const R = polaris(Rx, Ry);

  // Kezdőpontok: láncszabálynál egymás után fűzve, különben mind az origóból
  const kezdopontok = [];
  let fx = 0;
  let fy = 0;
  komp.forEach((k) => {
    kezdopontok.push(mod === "lanc" ? { x: fx, y: fy } : { x: 0, y: 0 });
    fx += k.x;
    fy += k.y;
  });

  const kepX = (x) => OX + x * LEPTEK;
  const kepY = (y) => OY - y * LEPTEK;

  const huzas = (i) => (e) => {
    e.preventDefault();
    const svg = svgRef.current;
    if (!svg) return;
    const mozgat = (esem) => {
      const r = svg.getBoundingClientRect();
      const px = ((esem.clientX - r.left) / r.width) * SZ;
      const py = ((esem.clientY - r.top) / r.height) * MA;
      const modX = (px - OX) / LEPTEK - kezdopontok[i].x;
      const modY = (OY - py) / LEPTEK - kezdopontok[i].y;
      const { nagysag, szog } = polaris(modX, modY);
      setVektorok((elozo) =>
        elozo.map((v, j) =>
          j === i
            ? {
                F: Math.min(12, Math.max(0.5, Math.round(nagysag * 10) / 10)),
                a: Math.round(szog > 180 ? szog - 360 : szog),
              }
            : v,
        ),
      );
    };
    mozgat(e);
    const vege = () => {
      window.removeEventListener("pointermove", mozgat);
      window.removeEventListener("pointerup", vege);
    };
    window.addEventListener("pointermove", mozgat);
    window.addEventListener("pointerup", vege);
  };

  const modosit = (i, mezo, ertek) =>
    setVektorok((elozo) =>
      elozo.map((v, j) => (j === i ? { ...v, [mezo]: ertek } : v)),
    );

  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white">
      {/* Fejléc kapcsolókkal */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[color:var(--keret)] bg-petrol-50/70 px-4 py-2.5">
        <span className="text-[12.5px] font-semibold text-petrol-800">
          Vektorok összeadása
        </span>
        <div className="ml-auto flex gap-1 rounded-lg bg-white p-0.5 ring-1 ring-petrol-200">
          {[
            ["lanc", "Láncszabály"],
            ["kozos", "Közös kezdőpont"],
          ].map(([ertek, cimke]) => (
            <button
              key={ertek}
              type="button"
              onClick={() => setMod(ertek)}
              className={`rounded-md px-2.5 py-1 text-[12px] font-medium transition ${
                mod === ertek
                  ? "bg-petrol-700 text-white"
                  : "text-petrol-600 hover:bg-petrol-50"
              }`}
            >
              {cimke}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.3fr_1fr] [&>*]:min-w-0">
        {/* Ábra */}
        <div className="racs-vilagos border-b border-[color:var(--keret)] p-3 lg:border-r lg:border-b-0">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${SZ} ${MA}`}
            className="abra w-full touch-none select-none"
          >
            <NyilHegyek />
            <Tengelyek ox={OX} oy={OY} balra={190} jobbra={360} fel={235} le={135} />

            {/* Eredő – a lánc végéhez húzva */}
            {mod === "lanc" && (Math.abs(Rx) > 0.01 || Math.abs(Ry) > 0.01) && (
              <Nyil
                x1={kepX(0)}
                y1={kepY(0)}
                x2={kepX(Rx)}
                y2={kepY(Ry)}
                szin="eredo"
                vastagsag={3.6}
              />
            )}
            {mod === "kozos" && (
              <>
                <line
                  x1={kepX(Rx)}
                  y1={kepY(Ry)}
                  x2={kepX(Rx)}
                  y2={kepY(0)}
                  className="segedvonal"
                />
                <Nyil
                  x1={kepX(0)}
                  y1={kepY(0)}
                  x2={kepX(Rx)}
                  y2={kepY(Ry)}
                  szin="eredo"
                  vastagsag={3.6}
                />
              </>
            )}

            {/* Az egyes vektorok */}
            {komp.map((k, i) => {
              const k0 = kezdopontok[i];
              const x1 = kepX(k0.x);
              const y1 = kepY(k0.y);
              const x2 = kepX(k0.x + k.x);
              const y2 = kepY(k0.y + k.y);
              // a felirat a nyílra merőlegesen, a „felső” oldalon
              const h = Math.hypot(x2 - x1, y2 - y1) || 1;
              let nx = -(y2 - y1) / h;
              let ny = (x2 - x1) / h;
              if (ny > 0) {
                nx = -nx;
                ny = -ny;
              }
              return (
                <g key={i}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={SZINEK[i]}
                    strokeWidth="3"
                    strokeLinecap="round"
                    markerEnd={`url(#hegy-${["ero", "komp", "kek", "ero"][i]})`}
                  />
                  <Cimke
                    x={(x1 + x2) / 2 + nx * 14}
                    y={(y1 + y2) / 2 + ny * 14 + 4}
                    szin={SZINEK[i]}
                    meret={12.5}
                  >
                    F{i + 1}
                  </Cimke>
                  <Fogopont x={x2} y={y2} szin={SZINEK[i]} onPointerDown={huzas(i)} />
                </g>
              );
            })}

            <Cimke
              x={Math.max(34, Math.min(SZ - 34, kepX(Rx) + (Rx >= 0 ? 22 : -22)))}
              y={Math.max(14, Math.min(MA - 4, kepY(Ry) + (Ry >= 0 ? -14 : 22)))}
              szin="var(--color-jel-eredo)"
            >
              R = {sz(R.nagysag, 2)}
            </Cimke>
          </svg>
          <p className="mt-1 text-center text-[11.5px] text-petrol-400">
            Húzd bármelyik nyíl végét. Láncszabálynál az eredő az origóból a lánc
            végéig mutat.
          </p>
        </div>

        {/* Adatok */}
        <div className="p-4 sm:p-5">
          <div className="space-y-2.5">
            {vektorok.map((v, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-lg border border-petrol-100 bg-petrol-50/50 px-2.5 py-2"
              >
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: SZINEK[i] }}
                />
                <span className="text-[12.5px] font-semibold text-petrol-800">
                  F{i + 1}
                </span>
                <input
                  type="number"
                  value={v.F}
                  step="0.1"
                  min="0"
                  max="12"
                  onChange={(e) => modosit(i, "F", Number(e.target.value))}
                  className="szamok w-16 rounded-md border border-petrol-200 bg-white px-1.5 py-1 text-[12.5px] text-petrol-900 outline-none focus:border-petrol-400"
                />
                <span className="text-[11.5px] text-petrol-400">N</span>
                <input
                  type="number"
                  value={v.a}
                  step="1"
                  onChange={(e) => modosit(i, "a", Number(e.target.value))}
                  className="szamok ml-auto w-16 rounded-md border border-petrol-200 bg-white px-1.5 py-1 text-[12.5px] text-petrol-900 outline-none focus:border-petrol-400"
                />
                <span className="text-[11.5px] text-petrol-400">°</span>
                {vektorok.length > 2 && (
                  <button
                    type="button"
                    onClick={() =>
                      setVektorok((e) => e.filter((_, j) => j !== i))
                    }
                    className="text-[15px] leading-none text-petrol-300 transition hover:text-rose-500"
                    aria-label="Törlés"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          {vektorok.length < 4 && (
            <button
              type="button"
              onClick={() => setVektorok((e) => [...e, { F: 4, a: 150 }])}
              className="mt-2.5 w-full rounded-lg border border-dashed border-petrol-300 py-1.5 text-[12.5px] font-medium text-petrol-500 transition hover:bg-petrol-50"
            >
              + Vektor hozzáadása
            </button>
          )}

          {/* Komponenstáblázat */}
          <div className="mt-4 overflow-hidden rounded-xl border border-petrol-200">
            <table className="szamok w-full text-[12.5px]">
              <thead className="bg-petrol-50 text-[11px] text-petrol-500 uppercase">
                <tr>
                  <th className="px-2.5 py-1.5 text-left font-semibold">–</th>
                  <th className="px-2.5 py-1.5 text-right font-semibold">
                    Fx [N]
                  </th>
                  <th className="px-2.5 py-1.5 text-right font-semibold">
                    Fy [N]
                  </th>
                </tr>
              </thead>
              <tbody>
                {komp.map((k, i) => (
                  <tr key={i} className="border-t border-petrol-100">
                    <td className="px-2.5 py-1.5" style={{ color: SZINEK[i] }}>
                      F{i + 1}
                    </td>
                    <td className="px-2.5 py-1.5 text-right">{szEl(k.x, 3)}</td>
                    <td className="px-2.5 py-1.5 text-right">{szEl(k.y, 3)}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-petrol-300 bg-violet-50 font-semibold text-violet-900">
                  <td className="px-2.5 py-1.5">R</td>
                  <td className="px-2.5 py-1.5 text-right">{sz(Rx, 3)}</td>
                  <td className="px-2.5 py-1.5 text-right">{sz(Ry, 3)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="szamok mt-3 rounded-xl bg-violet-50 px-4 py-3 text-[13.5px] text-violet-950">
            <M>{`R = \\sqrt{R_x^2 + R_y^2} = ${szK(R.nagysag, 3)}\\ \\text{N}`}</M>
            <div className="mt-1">
              <M>{`\\alpha_R = \\operatorname{arctg}\\frac{R_y}{R_x} = ${szK(
                R.szog > 180 ? R.szog - 360 : R.szog,
                2,
              )}^\\circ`}</M>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
