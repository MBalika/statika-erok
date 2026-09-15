"use client";

import { useState } from "react";
import { sz, szK } from "@/lib/szamok";
import { M, MB } from "@/components/ui/Keplet";

/*
 * Térbeli eredő osztályozása: a pontra redukált (R, M) párból
 *   1. egyensúly (R = 0, M = 0)     2. nyomaték (R = 0, M ≠ 0)
 *   3. erő (R ≠ 0, R·M = 0)         4. erőcsavar (R ≠ 0, R·M ≠ 0)
 */

const ESETEK = {
  1: { nev: "Egyensúlyi erőrendszer", szin: "emerald", leiras: "A társerő és a társnyomaték is zérus: az eredő zéruserő." },
  2: { nev: "Nyomaték", szin: "rose", leiras: "A társerő zérus, a társnyomaték nem: az eredő ez a nyomatékvektor, bármely pontra ugyanaz." },
  3: { nev: "Egyetlen erő", szin: "violet", leiras: "R ≠ 0 és M ⊥ R (vagy M = 0): az erőt az M-re és R-re egyszerre merőleges irányban eltolva a nyomaték eltűnik." },
  4: { nev: "Erőcsavar", szin: "naracs", leiras: "R ≠ 0 és M-nek van R-rel párhuzamos vetülete: az eltolás után marad egy, az erővel párhuzamos tengely körüli nyomaték — mint a facsavar." },
};

const PELDAK = [
  { nev: "GYF‑5 adatai (N, Nm)", R: [0, 0, 0], Mv: [-48, -56, -42] },
  { nev: "egyetlen erő", R: [4, 0, 0], Mv: [0, 6, -3] },
  { nev: "erőcsavar", R: [4, 0, 3], Mv: [2, 5, 1] },
  { nev: "egyensúly", R: [0, 0, 0], Mv: [0, 0, 0] },
];

function Mezo({ ertek, onChange }) {
  return (
    <input
      type="number"
      value={ertek}
      step={1}
      onChange={(e) => onChange(Number(e.target.value))}
      className="szamok w-full min-w-[68px] rounded-md border border-petrol-200 bg-white px-2 py-1.5 text-center text-[13px] text-petrol-900 outline-none focus:border-petrol-400"
    />
  );
}

export default function TerbeliEredoOsztalyozo() {
  const [R, setR] = useState([4, 0, 3]);
  const [Mv, setMv] = useState([2, 5, 1]);

  const Rh = Math.hypot(...R);
  const Mh = Math.hypot(...Mv);
  const RM = R[0] * Mv[0] + R[1] * Mv[1] + R[2] * Mv[2];
  const eps = 1e-9;
  const kod = Rh < eps ? (Mh < eps ? 1 : 2) : Math.abs(RM) < eps ? 3 : 4;
  const eset = ESETEK[kod];
  const Mpar = Rh > eps ? RM / Rh : 0; // az R-rel párhuzamos nyomatékvetület
  const Mmer = Rh > eps ? Math.sqrt(Math.max(0, Mh * Mh - Mpar * Mpar)) : Mh;

  const keret = {
    emerald: "border-emerald-300 bg-emerald-50 text-emerald-900",
    rose: "border-rose-300 bg-rose-50 text-rose-900",
    violet: "border-violet-300 bg-violet-50 text-violet-900",
    naracs: "border-naracs-300 bg-naracs-50 text-naracs-800",
  }[eset.szin];

  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white">
      <div className="border-b border-[color:var(--keret)] bg-petrol-50/70 px-5 py-3">
        <span className="text-[13px] font-semibold text-petrol-800">Térbeli eredő: erő, nyomaték vagy erőcsavar?</span>
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
                <td className="py-1 pr-2 font-semibold text-petrol-700">R [kN]</td>
                {[0, 1, 2].map((i) => (
                  <td key={i} className="px-1 py-1">
                    <Mezo ertek={R[i]} onChange={(v) => setR(R.map((c, j) => (j === i ? v : c)))} />
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-1 pr-2 font-semibold text-petrol-700">M [kNm]</td>
                {[0, 1, 2].map((i) => (
                  <td key={i} className="px-1 py-1">
                    <Mezo ertek={Mv[i]} onChange={(v) => setMv(Mv.map((c, j) => (j === i ? v : c)))} />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 rounded-xl bg-petrol-50 px-4 py-3">
          <div className="szamok space-y-1 text-[13.5px] text-petrol-800">
            <MB>{`\\underline{R}\\cdot\\underline{M} = ${szK(R[0], 0)}\\cdot${szK(Mv[0], 0)} + ${szK(R[1], 0)}\\cdot${szK(Mv[1], 0)} + ${szK(R[2], 0)}\\cdot${szK(Mv[2], 0)} = ${szK(RM, 0)}\\ \\text{kN}^2\\text{m}`}</MB>
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-[13px]">
              <M>{`|\\underline{R}| = ${szK(Rh, 2)}\\ \\text{kN}`}</M>
              <M>{`|\\underline{M}| = ${szK(Mh, 2)}\\ \\text{kNm}`}</M>
              {kod >= 3 && (
                <>
                  <M>{`M_{\\parallel} = \\frac{\\underline{R}\\cdot\\underline{M}}{|\\underline{R}|} = ${szK(Mpar, 2)}\\ \\text{kNm}`}</M>
                  <M>{`M_{\\perp} = ${szK(Mmer, 2)}\\ \\text{kNm}`}</M>
                </>
              )}
            </div>
          </div>
        </div>

        <div className={`mt-3 rounded-xl border px-4 py-3 ${keret}`}>
          <p className="text-[10.5px] font-bold tracking-[0.16em] uppercase opacity-80">{kod}. eset</p>
          <p className="mt-0.5 text-[16px] font-semibold">{eset.nev}</p>
          <p className="mt-1 text-[13px] leading-relaxed">{eset.leiras}</p>
          {kod === 3 && Mh > eps && (
            <p className="mt-1 text-[12.5px] opacity-80">
              Az eltolás nagysága: <M>{`d = |\\underline{M}|/|\\underline{R}| = ${szK(Mh / Rh, 3)}\\ \\text{m}`}</M>.
            </p>
          )}
          {kod === 4 && (
            <p className="mt-1 text-[12.5px] opacity-80">
              Az erőt <M>{`d = M_{\\perp}/|\\underline{R}| = ${szK(Mmer / Rh, 3)}\\ \\text{m}`}</M>-rel eltoljuk, és marad{" "}
              <M>{`M_{\\parallel} = ${szK(Mpar, 2)}\\ \\text{kNm}`}</M> az erő tengelye körül.
            </p>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {PELDAK.map((p) => (
            <button
              key={p.nev}
              type="button"
              onClick={() => {
                setR(p.R);
                setMv(p.Mv);
              }}
              className="rounded-lg bg-white px-2.5 py-1.5 text-[12px] font-medium text-petrol-600 ring-1 ring-petrol-200 transition hover:bg-petrol-50"
            >
              {p.nev}
            </button>
          ))}
        </div>
        <p className="mt-3 text-[12px] text-petrol-500">
          Az <M>{"\\underline{R}\\cdot\\underline{M}"}</M> értéke nem függ attól, melyik pontra redukáltunk: a pont váltásakor M-hez egy R-re merőleges vektor adódik hozzá, aminek R-rel vett skaláris szorzata nulla.
        </p>
      </div>
    </div>
  );
}
