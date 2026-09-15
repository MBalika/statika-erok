"use client";

import { useRef, useState } from "react";
import { Cimke, Fogopont, Nyil, NyilHegyek, Tengelyek } from "./SvgElemek";
import { derekszogu, polaris, sz, szEl, szK } from "@/lib/szamok";
import { M } from "@/components/ui/Keplet";

const SZ = 660;
const MA = 430;
const OX = 250;
const OY = 250;
const LEPTEK = 17; // képpont / méter
const ERO_LEPTEK = 2.6; // képpont / kN

const SZINEK = ["#e2590a", "#0f766e", "#2563eb", "#be123c"];
const EPSZ = 0.02;

// Alaphelyzetben a GYF-3 feladat adatai
const KEZDO = [
  { x: 0, y: 7, F: 23, a: 0 },
  { x: 8, y: 0, F: 9, a: -90 },
  { x: 0, y: -4, F: 20, a: 0 },
  { x: -3, y: 0, F: 19, a: 90 },
];

export default function ErorendszerRedukalo() {
  const [erok, setErok] = useState(KEZDO);
  const [nezet, setNezet] = useState("eredeti"); // eredeti | redukalt | eredo
  const svgRef = useRef(null);

  const komp = erok.map((e) => derekszogu(e.F, e.a));
  const Rx = komp.reduce((s, k) => s + k.x, 0);
  const Ry = komp.reduce((s, k) => s + k.y, 0);
  const Mo = erok.reduce((s, e, i) => s + e.x * komp[i].y - e.y * komp[i].x, 0);
  const R = polaris(Rx, Ry);
  const vanEro = R.nagysag > EPSZ;
  const vanNyomatek = Math.abs(Mo) > EPSZ;

  const tipus = vanEro
    ? "ero"
    : vanNyomatek
      ? "eropar"
      : "zerus";

  // Az eredő hatásvonalának origóhoz legközelebbi pontja
  const n2 = Rx * Rx + Ry * Ry;
  const talp = vanEro
    ? { x: (Mo * Ry) / n2, y: (-Mo * Rx) / n2 }
    : { x: 0, y: 0 };
  const x0 = Math.abs(Ry) > EPSZ ? Mo / Ry : null; // metszéspont az x tengellyel
  const y0 = Math.abs(Rx) > EPSZ ? -Mo / Rx : null; // metszéspont az y tengellyel

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
      setErok((elozo) =>
        elozo.map((v, j) =>
          j === i
            ? {
                ...v,
                x: Math.max(-13, Math.min(22, Math.round((px - OX) / LEPTEK))),
                y: Math.max(-10, Math.min(13, Math.round((OY - py) / LEPTEK))),
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
    setErok((elozo) => elozo.map((v, j) => (j === i ? { ...v, [mezo]: ertek } : v)));

  // Az eredő hatásvonala az ábra széléig kihúzva
  const iranyX = vanEro ? Rx / R.nagysag : 1;
  const iranyY = vanEro ? Ry / R.nagysag : 0;
  const nyujtas = 40;

  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white">
      <div className="flex flex-wrap items-center gap-2 border-b border-[color:var(--keret)] bg-petrol-50/70 px-4 py-2.5">
        <span className="text-[12.5px] font-semibold text-petrol-800">
          Erőrendszer redukálása
        </span>
        <div className="ml-auto flex gap-1 rounded-lg bg-white p-0.5 ring-1 ring-petrol-200">
          {[
            ["eredeti", "Eredeti rendszer"],
            ["redukalt", "Redukálva O-ba"],
            ["eredo", "Az eredő"],
          ].map(([ertek, cimke]) => (
            <button
              key={ertek}
              type="button"
              onClick={() => setNezet(ertek)}
              className={`rounded-md px-2.5 py-1 text-[12px] font-medium transition ${
                nezet === ertek
                  ? "bg-petrol-700 text-white"
                  : "text-petrol-600 hover:bg-petrol-50"
              }`}
            >
              {cimke}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.35fr_1fr] [&>*]:min-w-0">
        <div className="racs-vilagos border-b border-[color:var(--keret)] p-3 lg:border-r lg:border-b-0">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${SZ} ${MA}`}
            className="abra w-full touch-none select-none"
          >
            <NyilHegyek />
            <Tengelyek ox={OX} oy={OY} balra={230} jobbra={390} fel={230} le={170} />

            {/* --- eredeti erők --- */}
            {nezet === "eredeti" &&
              erok.map((e, i) => {
                const k = komp[i];
                return (
                  <g key={i}>
                    <line
                      x1={kepX(e.x) - (k.x / e.F) * 400}
                      y1={kepY(e.y) + (k.y / e.F) * 400}
                      x2={kepX(e.x) + (k.x / e.F) * 400}
                      y2={kepY(e.y) - (k.y / e.F) * 400}
                      stroke={SZINEK[i]}
                      strokeWidth="0.9"
                      strokeDasharray="5 5"
                      opacity="0.4"
                    />
                    <line
                      x1={kepX(e.x)}
                      y1={kepY(e.y)}
                      x2={kepX(e.x) + k.x * ERO_LEPTEK}
                      y2={kepY(e.y) - k.y * ERO_LEPTEK}
                      stroke={SZINEK[i]}
                      strokeWidth="3"
                      strokeLinecap="round"
                      markerEnd={`url(#hegy-${["ero", "komp", "kek", "ero"][i]})`}
                    />
                    <Cimke
                      x={kepX(e.x) + k.x * ERO_LEPTEK + (k.x >= 0 ? 16 : -16)}
                      y={kepY(e.y) - k.y * ERO_LEPTEK + (k.y >= 0 ? -8 : 18)}
                      szin={SZINEK[i]}
                      meret={12.5}
                    >
                      F{i + 1}
                    </Cimke>
                    <Fogopont
                      x={kepX(e.x)}
                      y={kepY(e.y)}
                      szin={SZINEK[i]}
                      onPointerDown={huzas(i)}
                    />
                  </g>
                );
              })}

            {/* --- redukálva az origóba --- */}
            {nezet === "redukalt" && (
              <g>
                {vanEro && (
                  <>
                    <Nyil
                      x1={OX}
                      y1={OY}
                      x2={OX + Rx * ERO_LEPTEK}
                      y2={OY - Ry * ERO_LEPTEK}
                      szin="eredo"
                      vastagsag={3.8}
                    />
                    <Cimke
                      x={OX + Rx * ERO_LEPTEK + 26}
                      y={OY - Ry * ERO_LEPTEK - 10}
                      szin="var(--color-jel-eredo)"
                    >
                      R = {sz(R.nagysag, 2)} kN
                    </Cimke>
                  </>
                )}
                {vanNyomatek && (
                  <>
                    <path
                      d={
                        Mo > 0
                          ? "M 42 -24 A 48 48 0 0 0 -42 -24"
                          : "M -42 -24 A 48 48 0 0 1 42 -24"
                      }
                      transform={`translate(${OX} ${OY})`}
                      fill="none"
                      stroke="#be123c"
                      strokeWidth="2.8"
                      markerEnd="url(#hegy-ero)"
                    />
                    <Cimke x={OX - 62} y={OY - 58} szin="#be123c" meret={12.5}>
                      M = {sz(Mo, 1)} kNm
                    </Cimke>
                  </>
                )}
                <circle cx={OX} cy={OY} r="5" fill="#1d3c48" />
              </g>
            )}

            {/* --- az eredő a hatásvonalán --- */}
            {nezet === "eredo" && (
              <g>
                {vanEro ? (
                  <>
                    <line
                      x1={kepX(talp.x - iranyX * nyujtas)}
                      y1={kepY(talp.y - iranyY * nyujtas)}
                      x2={kepX(talp.x + iranyX * nyujtas)}
                      y2={kepY(talp.y + iranyY * nyujtas)}
                      stroke="#7c3aed"
                      strokeWidth="1.2"
                      strokeDasharray="6 4"
                    />
                    <Nyil
                      x1={kepX(talp.x)}
                      y1={kepY(talp.y)}
                      x2={kepX(talp.x) + Rx * ERO_LEPTEK}
                      y2={kepY(talp.y) - Ry * ERO_LEPTEK}
                      szin="eredo"
                      vastagsag={3.8}
                    />
                    <Cimke
                      x={kepX(talp.x) + Rx * ERO_LEPTEK + 26}
                      y={kepY(talp.y) - Ry * ERO_LEPTEK - 10}
                      szin="var(--color-jel-eredo)"
                    >
                      R = {sz(R.nagysag, 2)} kN
                    </Cimke>
                    {x0 !== null && Math.abs(x0) < 21 && (
                      <>
                        <circle cx={kepX(x0)} cy={OY} r="4.5" fill="#7c3aed" />
                        <Cimke x={kepX(x0)} y={OY + 24} szin="#7c3aed" meret={12}>
                          x₀ = {sz(x0, 2)} m
                        </Cimke>
                      </>
                    )}
                  </>
                ) : vanNyomatek ? (
                  <>
                    <path
                      d={
                        Mo > 0
                          ? "M 42 -24 A 48 48 0 0 0 -42 -24"
                          : "M -42 -24 A 48 48 0 0 1 42 -24"
                      }
                      transform={`translate(${OX} ${OY})`}
                      fill="none"
                      stroke="#be123c"
                      strokeWidth="2.8"
                      markerEnd="url(#hegy-ero)"
                    />
                    <Cimke x={OX - 62} y={OY - 58} szin="#be123c" meret={12.5}>
                      tiszta erőpár
                    </Cimke>
                  </>
                ) : (
                  <Cimke x={OX} y={OY - 26} szin="#15803d" meret={13}>
                    zérusrendszer
                  </Cimke>
                )}
                <circle cx={OX} cy={OY} r="5" fill="#1d3c48" />
              </g>
            )}

            <Cimke x={OX - 16} y={OY + 20} szin="#1d3c48" meret={13}>
              O
            </Cimke>
          </svg>
          <p className="mt-1 text-center text-[11.5px] text-petrol-400">
            {nezet === "eredeti"
              ? "Húzd az erők támadáspontját. A halvány szaggatott vonal a hatásvonal."
              : nezet === "redukalt"
                ? "Az origóba tolt erőrendszer: egy erő és egy forgatónyomaték."
                : "Az eredő a saját hatásvonalán, nyomaték nélkül."}
          </p>
        </div>

        <div className="p-4 sm:p-5">
          <div className="finom-gorgeto overflow-x-auto">
            <table className="szamok w-full min-w-[300px] text-[12.5px]">
              <thead className="text-[10.5px] tracking-wider text-petrol-500 uppercase">
                <tr>
                  <th className="pb-1 text-left font-semibold">erő</th>
                  <th className="pb-1 text-center font-semibold">x [m]</th>
                  <th className="pb-1 text-center font-semibold">y [m]</th>
                  <th className="pb-1 text-center font-semibold">F [kN]</th>
                  <th className="pb-1 text-center font-semibold">α [°]</th>
                </tr>
              </thead>
              <tbody>
                {erok.map((e, i) => (
                  <tr key={i}>
                    <td className="py-1 pr-1">
                      <span
                        className="mr-1 inline-block h-2.5 w-2.5 rounded-full align-middle"
                        style={{ backgroundColor: SZINEK[i] }}
                      />
                      F{i + 1}
                    </td>
                    {[
                      ["x", 1],
                      ["y", 1],
                      ["F", 0.5],
                      ["a", 5],
                    ].map(([mezo, lepes]) => (
                      <td key={mezo} className="px-0.5 py-1">
                        <input
                          type="number"
                          value={e[mezo]}
                          step={lepes}
                          onChange={(ev) => modosit(i, mezo, Number(ev.target.value))}
                          className="szamok w-full min-w-[52px] rounded-md border border-petrol-200 bg-white px-1 py-1 text-center text-[12.5px] text-petrol-900 outline-none focus:border-petrol-400"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {erok.length < 4 && (
              <button
                type="button"
                onClick={() => setErok((e) => [...e, { x: 2, y: 2, F: 10, a: 0 }])}
                className="rounded-lg bg-white px-2.5 py-1.5 text-[12px] font-medium text-petrol-600 ring-1 ring-petrol-200 transition hover:bg-petrol-50"
              >
                + Erő
              </button>
            )}
            {erok.length > 2 && (
              <button
                type="button"
                onClick={() => setErok((e) => e.slice(0, -1))}
                className="rounded-lg bg-white px-2.5 py-1.5 text-[12px] font-medium text-petrol-600 ring-1 ring-petrol-200 transition hover:bg-petrol-50"
              >
                − Erő
              </button>
            )}
            <button
              type="button"
              onClick={() => setErok(KEZDO)}
              className="rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-petrol-500 transition hover:text-petrol-800"
            >
              GYF‑3 adatai
            </button>
          </div>

          <div className="mt-4 rounded-xl bg-petrol-50 p-4">
            <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">
              Redukálás az O pontba
            </p>
            <div className="szamok mt-2 space-y-1 text-[13px] text-petrol-800">
              <div>
                <M>{`R_x = \\sum F_{ix} = ${szK(Rx, 3)}\\ \\text{kN}`}</M>
              </div>
              <div>
                <M>{`R_y = \\sum F_{iy} = ${szK(Ry, 3)}\\ \\text{kN}`}</M>
              </div>
              <div>
                <M>{`M^{(O)} = \\sum (x_i F_{iy} - y_i F_{ix}) = ${szK(Mo, 2)}\\ \\text{kNm}`}</M>
              </div>
            </div>
          </div>

          <div
            className={`mt-3 rounded-xl border px-4 py-3 ${
              tipus === "ero"
                ? "border-violet-200 bg-violet-50"
                : tipus === "eropar"
                  ? "border-rose-200 bg-rose-50"
                  : "border-emerald-200 bg-emerald-50"
            }`}
          >
            <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">
              Az eredő
            </p>
            {tipus === "ero" && (
              <div className="szamok mt-1 space-y-0.5 text-[13.5px] text-violet-950">
                <p className="text-[15px] font-semibold">
                  egyetlen erő: R = {sz(R.nagysag, 3)} kN
                </p>
                <p>
                  iránya: α<sub>R</sub> ={" "}
                  {sz(R.szog > 180 ? R.szog - 360 : R.szog, 2)}°
                </p>
                {x0 !== null && (
                  <p>
                    hatásvonala az x tengelyt x₀ = {sz(x0, 2)} m-nél metszi
                  </p>
                )}
                {y0 !== null && (
                  <p>az y tengelyt y₀ = {sz(y0, 2)} m-nél metszi</p>
                )}
              </div>
            )}
            {tipus === "eropar" && (
              <div className="szamok mt-1 text-[13.5px] text-rose-950">
                <p className="text-[15px] font-semibold">
                  tiszta forgatónyomaték: M = {sz(Mo, 2)} kNm
                </p>
                <p className="mt-0.5 text-[12.5px]">
                  az erők kiegyenlítik egymást, de a forgatás megmarad — és ez
                  minden pontra ugyanennyi
                </p>
              </div>
            )}
            {tipus === "zerus" && (
              <p className="mt-1 text-[15px] font-semibold text-emerald-900">
                zérusrendszer: a test egyensúlyban van
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
