"use client";

import { useState } from "react";
import { sz, szK } from "@/lib/szamok";
import { M } from "@/components/ui/Keplet";

const KEZDO = [
  { x: 5, y: 2, z: 6 },
  { x: -3, y: 4, z: -9 },
  { x: 8, y: 11, z: -10 },
];

export default function TerbeliVektorKalk() {
  const [vektorok, setVektorok] = useState(KEZDO);
  const [egyseg, setEgyseg] = useState("kN");

  const R = vektorok.reduce(
    (a, v) => ({ x: a.x + v.x, y: a.y + v.y, z: a.z + v.z }),
    { x: 0, y: 0, z: 0 },
  );
  const hossz = Math.hypot(R.x, R.y, R.z);

  const modosit = (i, tengely, ertek) =>
    setVektorok((e) =>
      e.map((v, j) => (j === i ? { ...v, [tengely]: ertek } : v)),
    );

  const szog = (komp) =>
    hossz > 1e-9 ? (Math.acos(komp / hossz) * 180) / Math.PI : NaN;

  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white">
      <div className="flex flex-wrap items-center gap-2 border-b border-[color:var(--keret)] bg-petrol-50/70 px-5 py-3">
        <span className="text-[13px] font-semibold text-petrol-800">
          Térbeli vektorok összege
        </span>
        <div className="ml-auto flex gap-1 rounded-lg bg-white p-0.5 ring-1 ring-petrol-200">
          {["N", "kN"].map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setEgyseg(e)}
              className={`rounded-md px-2.5 py-1 text-[12px] font-medium transition ${
                egyseg === e
                  ? "bg-petrol-700 text-white"
                  : "text-petrol-600 hover:bg-petrol-50"
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5">
        {/* Beviteli rács */}
        <div className="finom-gorgeto overflow-x-auto">
          <table className="szamok w-full min-w-[380px] text-[13px]">
            <thead>
              <tr className="text-[11px] tracking-wider text-petrol-500 uppercase">
                <th className="pb-1.5 text-left font-semibold">Vektor</th>
                <th className="pb-1.5 text-center font-semibold">x</th>
                <th className="pb-1.5 text-center font-semibold">y</th>
                <th className="pb-1.5 text-center font-semibold">z</th>
                <th className="pb-1.5 text-right font-semibold">nagyság</th>
              </tr>
            </thead>
            <tbody>
              {vektorok.map((v, i) => (
                <tr key={i}>
                  <td className="py-1 pr-2 font-semibold text-petrol-700">
                    F{i + 1}
                  </td>
                  {["x", "y", "z"].map((t) => (
                    <td key={t} className="px-1 py-1">
                      <input
                        type="number"
                        value={v[t]}
                        step="0.1"
                        onChange={(e) => modosit(i, t, Number(e.target.value))}
                        className="szamok w-full min-w-[62px] rounded-md border border-petrol-200 bg-white px-2 py-1.5 text-center text-[13px] text-petrol-900 outline-none focus:border-petrol-400"
                      />
                    </td>
                  ))}
                  <td className="py-1 pl-2 text-right text-petrol-500">
                    {sz(Math.hypot(v.x, v.y, v.z), 2)}
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-petrol-200">
                <td className="py-2 pr-2 font-bold text-violet-800">R</td>
                {[R.x, R.y, R.z].map((k, i) => (
                  <td
                    key={i}
                    className="px-1 py-2 text-center text-[14px] font-semibold text-violet-900"
                  >
                    {sz(k, 2)}
                  </td>
                ))}
                <td className="py-2 pl-2 text-right font-semibold text-violet-900">
                  {sz(hossz, 2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-violet-50 px-4 py-3">
            <p className="text-[10.5px] font-bold tracking-[0.16em] text-violet-700 uppercase">
              Eredő
            </p>
            <div className="szamok mt-1.5 text-[13.5px] text-violet-950">
              <M>{`\\underline{R} = \\begin{bmatrix} ${sz(R.x, 2)} \\\\ ${sz(
                R.y,
                2,
              )} \\\\ ${sz(R.z, 2)} \\end{bmatrix}\\ \\text{${egyseg}}`}</M>
            </div>
            <div className="szamok mt-2 text-[13.5px] text-violet-950">
              <M>{`|\\underline{R}| = \\sqrt{R_x^2+R_y^2+R_z^2} = ${sz(
                hossz,
                3,
              )}\\ \\text{${egyseg}}`}</M>
            </div>
          </div>

          <div className="rounded-xl bg-petrol-50 px-4 py-3">
            <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">
              Az eredő iránya (tengelyekkel bezárt szögek)
            </p>
            <div className="szamok mt-2 space-y-1 text-[13px] text-petrol-800">
              <div>
                <M>{`\\cos\\alpha_x = \\tfrac{R_x}{|R|} \\Rightarrow \\alpha_x = ${sz(
                  szog(R.x),
                  1,
                )}^\\circ`}</M>
              </div>
              <div>
                <M>{`\\alpha_y = ${sz(szog(R.y), 1)}^\\circ`}</M>
              </div>
              <div>
                <M>{`\\alpha_z = ${sz(szog(R.z), 1)}^\\circ`}</M>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {vektorok.length < 5 && (
            <button
              type="button"
              onClick={() => setVektorok((e) => [...e, { x: 0, y: 0, z: 0 }])}
              className="rounded-lg bg-white px-3 py-1.5 text-[12.5px] font-medium text-petrol-600 ring-1 ring-petrol-200 transition hover:bg-petrol-50"
            >
              + Vektor
            </button>
          )}
          {vektorok.length > 2 && (
            <button
              type="button"
              onClick={() => setVektorok((e) => e.slice(0, -1))}
              className="rounded-lg bg-white px-3 py-1.5 text-[12.5px] font-medium text-petrol-600 ring-1 ring-petrol-200 transition hover:bg-petrol-50"
            >
              − Vektor
            </button>
          )}
          <button
            type="button"
            onClick={() => setVektorok(KEZDO)}
            className="rounded-lg px-3 py-1.5 text-[12.5px] font-medium text-petrol-500 transition hover:text-petrol-800"
          >
            Alaphelyzet (GYF‑1 adatai)
          </button>
        </div>
      </div>
    </div>
  );
}
