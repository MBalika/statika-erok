"use client";

import { useState } from "react";
import { Cimke, Nyil, NyilHegyek, Tengelyek } from "./SvgElemek";
import { Csuszka } from "./ErovektorBonto";
import { derekszogu, fokRad, polaris, sz, szEl, szK } from "@/lib/szamok";
import { M } from "@/components/ui/Keplet";

const SZ = 560;
const MA = 390;
const OX = 270;
const OY = 205;
const LEPTEK = 19;

const SZINEK = ["#e2590a", "#0f766e", "#2563eb", "#be123c"];

const EROK = [
  { nev: "F₁", F: 5, a: 40 },
  { nev: "F₂", F: 6, a: 0 },
  { nev: "F₃", F: 8, a: -65 },
  { nev: "F₄", F: 4, a: -90 },
];

export default function VetuletFelfedezo() {
  const [tSzog, setTSzog] = useState(125);
  const [merolegesek, setMerolegesek] = useState(true);

  const tr = fokRad(tSzog);
  const tx = Math.cos(tr);
  const ty = Math.sin(tr);

  const adatok = EROK.map((e) => {
    const k = derekszogu(e.F, e.a);
    const vetulet = k.x * tx + k.y * ty; // skaláris szorzat az egységvektorral
    // Az erő és a tengely által bezárt szög, 0° és 180° közé hozva
    const nyers = (((e.a - tSzog) % 360) + 360) % 360;
    const bezart = nyers > 180 ? 360 - nyers : nyers;
    return { ...e, ...k, vetulet, bezart };
  });

  const Rx = adatok.reduce((s, d) => s + d.x, 0);
  const Ry = adatok.reduce((s, d) => s + d.y, 0);
  const Rt = Rx * tx + Ry * ty;
  const vetuletOsszeg = adatok.reduce((s, d) => s + d.vetulet, 0);
  const R = polaris(Rx, Ry);

  const kepX = (x) => OX + x * LEPTEK;
  const kepY = (y) => OY - y * LEPTEK;

  // A tengelyt mindkét irányban annyira húzzuk meg, hogy minden vetület ráférjen
  const legnagyobb = Math.max(...adatok.map((d) => Math.abs(d.vetulet)));
  const tHossz = 165;
  const tVissza = Math.max(60, legnagyobb * LEPTEK + 30);

  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white">
      <div className="grid lg:grid-cols-[1.25fr_1fr]">
        <div className="racs-vilagos border-b border-[color:var(--keret)] p-3 lg:border-r lg:border-b-0">
          <svg viewBox={`0 0 ${SZ} ${MA}`} className="abra w-full select-none">
            <NyilHegyek />
            <Tengelyek ox={OX} oy={OY} balra={250} jobbra={270} fel={190} le={175} />

            {/* A t tengely */}
            <line
              x1={OX - tx * tVissza}
              y1={OY + ty * tVissza}
              x2={OX + tx * tHossz}
              y2={OY - ty * tHossz}
              stroke="#7c3aed"
              strokeWidth="2"
              markerEnd="url(#hegy-eredo)"
            />
            <Cimke
              x={OX + tx * (tHossz + 16)}
              y={OY - ty * (tHossz + 16) + 5}
              szin="#7c3aed"
            >
              t
            </Cimke>

            {/* Vetületek a t tengelyen – vastag sáv */}
            {adatok.map((d, i) => (
              <g key={`v${i}`}>
                {merolegesek && (
                  <line
                    x1={kepX(d.x)}
                    y1={kepY(d.y)}
                    x2={kepX(d.vetulet * tx)}
                    y2={kepY(d.vetulet * ty)}
                    stroke={SZINEK[i]}
                    strokeWidth="1.1"
                    strokeDasharray="4 3"
                    opacity="0.7"
                  />
                )}
                <circle
                  cx={kepX(d.vetulet * tx)}
                  cy={kepY(d.vetulet * ty)}
                  r="4.5"
                  fill={SZINEK[i]}
                  stroke="white"
                  strokeWidth="1.5"
                />
              </g>
            ))}

            {/* Erővektorok */}
            {adatok.map((d, i) => (
              <g key={i}>
                <line
                  x1={OX}
                  y1={OY}
                  x2={kepX(d.x)}
                  y2={kepY(d.y)}
                  stroke={SZINEK[i]}
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  markerEnd={`url(#hegy-${["ero", "komp", "kek", "ero"][i]})`}
                />
                <Cimke
                  x={kepX(d.x) + (d.x >= 0 ? 16 : -16)}
                  y={kepY(d.y) + (d.y >= 0 ? -8 : 16)}
                  szin={SZINEK[i]}
                  meret={12.5}
                >
                  {d.nev}
                </Cimke>
              </g>
            ))}
          </svg>
          <p className="mt-1 text-center text-[11.5px] text-petrol-400">
            A pontok a nyilak merőleges vetületei a <em>t</em> tengelyen.
          </p>
        </div>

        <div className="p-4 sm:p-5">
          <Csuszka
            cimke="A t tengely iránya"
            ertek={tSzog}
            egyseg="°"
            min={0}
            max={180}
            lepes={1}
            tizedes={0}
            onChange={setTSzog}
          />

          <label className="mt-3 flex cursor-pointer items-center gap-2 text-[12.5px] text-petrol-600">
            <input
              type="checkbox"
              checked={merolegesek}
              onChange={(e) => setMerolegesek(e.target.checked)}
              className="h-3.5 w-3.5 accent-[color:var(--color-naracs-500)]"
            />
            Vetítővonalak mutatása
          </label>

          <div className="mt-4 overflow-hidden rounded-xl border border-petrol-200">
            <table className="szamok w-full text-[12.5px]">
              <thead className="bg-petrol-50 text-[11px] text-petrol-500 uppercase">
                <tr>
                  <th className="px-2.5 py-1.5 text-left font-semibold">Erő</th>
                  <th className="px-2.5 py-1.5 text-right font-semibold">
                    bezárt szög
                  </th>
                  <th className="px-2.5 py-1.5 text-right font-semibold">
                    Fit [N]
                  </th>
                </tr>
              </thead>
              <tbody>
                {adatok.map((d, i) => {
                  return (
                    <tr key={i} className="border-t border-petrol-100">
                      <td className="px-2.5 py-1.5" style={{ color: SZINEK[i] }}>
                        {d.nev}
                      </td>
                      <td className="px-2.5 py-1.5 text-right text-petrol-500">
                        {sz(d.bezart, 0)}°
                      </td>
                      <td
                        className={`px-2.5 py-1.5 text-right font-medium ${
                          d.vetulet < 0 ? "text-rose-600" : "text-emerald-700"
                        }`}
                      >
                        {szEl(d.vetulet, 3)}
                      </td>
                    </tr>
                  );
                })}
                <tr className="border-t-2 border-petrol-300 bg-violet-50 font-semibold text-violet-900">
                  <td className="px-2.5 py-1.5" colSpan={2}>
                    Σ Fit
                  </td>
                  <td className="px-2.5 py-1.5 text-right">
                    {sz(vetuletOsszeg, 3)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-3 rounded-xl border border-naracs-200 bg-naracs-50 p-3.5">
            <p className="text-[10.5px] font-bold tracking-[0.16em] text-naracs-700 uppercase">
              Amit érdemes észrevenni
            </p>
            <p className="szamok mt-1.5 text-[13px] leading-relaxed text-petrol-800">
              Az eredő vetülete <M>{`R_t = ${szK(Rt, 3)}`}</M> N, ugyanannyi,
              mint az egyes vetületek összege. A vetítés lineáris művelet: előbb
              összegezni és utána vetíteni ugyanaz, mint előbb vetíteni és utána
              összegezni.
            </p>
            <p className="szamok mt-2 text-[12.5px] text-petrol-500">
              (Az eredő: R = {sz(R.nagysag, 3)} N, α<sub>R</sub> ={" "}
              {sz(R.szog > 180 ? R.szog - 360 : R.szog, 2)}°)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
