"use client";

import { useState } from "react";
import { sz, szK } from "@/lib/szamok";
import { M } from "@/components/ui/Keplet";

// Alaphelyzetben a GYF-1 feladat adatai
const KEZDO_R = { x: -5, y: 3.3, z: 4.7 };
const KEZDO_F = { x: 800, y: 600, z: -300 };

export default function TerbeliNyomatekKalk() {
  const [r, setR] = useState(KEZDO_R);
  const [F, setF] = useState(KEZDO_F);

  const Mx = r.y * F.z - r.z * F.y;
  const My = r.z * F.x - r.x * F.z;
  const Mz = r.x * F.y - r.y * F.x;
  const hossz = Math.hypot(Mx, My, Mz);

  const Mezo = ({ ertek, onChange, lepes = 0.1 }) => (
    <input
      type="number"
      value={ertek}
      step={lepes}
      onChange={(e) => onChange(Number(e.target.value))}
      className="szamok w-full min-w-[68px] rounded-md border border-petrol-200 bg-white px-2 py-1.5 text-center text-[13px] text-petrol-900 outline-none focus:border-petrol-400"
    />
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white">
      <div className="border-b border-[color:var(--keret)] bg-petrol-50/70 px-5 py-3">
        <span className="text-[13px] font-semibold text-petrol-800">
          Térbeli nyomaték: M = r × F
        </span>
      </div>

      <div className="p-5">
        <div className="finom-gorgeto overflow-x-auto">
          <table className="szamok w-full min-w-[400px] text-[13px]">
            <thead>
              <tr className="text-[11px] tracking-wider text-petrol-500 uppercase">
                <th className="pb-1.5 text-left font-semibold">–</th>
                <th className="pb-1.5 text-center font-semibold">x</th>
                <th className="pb-1.5 text-center font-semibold">y</th>
                <th className="pb-1.5 text-center font-semibold">z</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-1 pr-2 font-semibold text-petrol-700">
                  r [m]
                </td>
                {["x", "y", "z"].map((t) => (
                  <td key={t} className="px-1 py-1">
                    <Mezo
                      ertek={r[t]}
                      onChange={(v) => setR({ ...r, [t]: v })}
                    />
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-1 pr-2 font-semibold text-petrol-700">
                  F [N]
                </td>
                {["x", "y", "z"].map((t) => (
                  <td key={t} className="px-1 py-1">
                    <Mezo
                      ertek={F[t]}
                      onChange={(v) => setF({ ...F, [t]: v })}
                      lepes={10}
                    />
                  </td>
                ))}
              </tr>
              <tr className="border-t-2 border-petrol-200">
                <td className="py-2 pr-2 font-bold text-violet-800">M [Nm]</td>
                {[Mx, My, Mz].map((k, i) => (
                  <td
                    key={i}
                    className="px-1 py-2 text-center text-[14px] font-semibold text-violet-900"
                  >
                    {sz(k, 1)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 rounded-xl bg-violet-50 px-4 py-3">
          <p className="text-[10.5px] font-bold tracking-[0.16em] text-violet-700 uppercase">
            A három tengelyre vett nyomaték
          </p>
          <div className="szamok mt-2 space-y-1.5 text-[13.5px] text-violet-950">
            <div>
              <M>{`M_x = y F_z - z F_y = ${szK(r.y, 1)}\\cdot(${szK(F.z, 0)}) - ${szK(r.z, 1)}\\cdot(${szK(F.y, 0)}) = ${szK(Mx, 1)}`}</M>
            </div>
            <div>
              <M>{`M_y = z F_x - x F_z = ${szK(r.z, 1)}\\cdot(${szK(F.x, 0)}) - ${szK(r.x, 1)}\\cdot(${szK(F.z, 0)}) = ${szK(My, 1)}`}</M>
            </div>
            <div>
              <M>{`M_z = x F_y - y F_x = ${szK(r.x, 1)}\\cdot(${szK(F.y, 0)}) - ${szK(r.y, 1)}\\cdot(${szK(F.x, 0)}) = ${szK(Mz, 1)}`}</M>
            </div>
            <div className="border-t border-violet-200 pt-1.5">
              <M>{`|\\underline{M}| = ${szK(hossz, 1)}\\ \\text{Nm}`}</M>
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-xl border border-naracs-200 bg-naracs-50 px-4 py-3">
          <p className="text-[10.5px] font-bold tracking-[0.16em] text-naracs-700 uppercase">
            Figyeld meg
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-petrol-800">
            Mindegyik sorból hiányzik egy komponens: az <M>{"M_x"}</M>-ben nincs{" "}
            <M>{"F_x"}</M>, az <M>{"M_y"}</M>-ban nincs <M>{"F_y"}</M>, és így
            tovább. Ez nem véletlen: az erőnek az a komponense, amelyik
            párhuzamos egy tengellyel, nem forgat akörül a tengely körül. Írj be{" "}
            nullát az egyik erőkomponensbe, és nézd meg, melyik nyomaték nem
            változik.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setR(KEZDO_R);
            setF(KEZDO_F);
          }}
          className="mt-3 rounded-lg px-3 py-1.5 text-[12.5px] font-medium text-petrol-500 transition hover:text-petrol-800"
        >
          Alaphelyzet (GYF‑1 adatai)
        </button>
      </div>
    </div>
  );
}
