"use client";

import { useMemo, useState } from "react";
import { elemez } from "@/lib/tarto";
import { Csuszka } from "@/components/abrak/ErovektorBonto";
import Diagram, { SZINEK, fokszam, ert } from "@/components/igenybevetel/Diagram";
import { M as Keplet } from "@/components/ui/Keplet";
import { sz } from "@/lib/szamok";

/**
 * q–V–M felfedező: csúszkákkal állítható teherábra (egyenletes p, koncentrált F
 * a helyével, koncentrált nyomaték a helyével) egy 8 m-es kéttámaszú tartón;
 * élőben a V és M ábra, a V = 0 helyek és az ott lévő M szélsőértékek kiemelve,
 * szakaszonként a differenciális összefüggések következménye (fokszámok).
 */

const L = 8;
const FOKNEV = ["konstans", "lineáris", "másodfokú parabola", "harmadfokú"];

export default function QVMFelfedezo() {
  const [p, setP] = useState(5);
  const [F, setF] = useState(20);
  const [a, setA] = useState(3);
  const [M0, setM0] = useState(0);
  const [b, setB] = useState(6);

  const e = useMemo(() => elemez({
    csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "B", x: L, y: 0 }],
    rudak: [{ id: "1", a: "A", b: "B" }],
    tamaszok: [{ csomopont: "A", tipus: "csuklo" }, { csomopont: "B", tipus: "gorgo", szog: 90 }],
    terhek: [
      ...(p ? [{ fajta: "megoszlo", rud: "1", p1: -p, irany: "y" }] : []),
      ...(F ? [{ fajta: "pontTeher", rud: "1", a, F: -F, irany: "y" }] : []),
      ...(M0 ? [{ fajta: "pontNyomatek", rud: "1", a: b, M: M0 }] : []),
    ],
  }), [p, F, a, M0, b]);

  const ig = e.ok ? e.igenybevetelek[0] : null;
  const szelsok = ig ? ig.MszelsoHelyek.filter((h) => h.x > 1e-6 && h.x < L - 1e-6) : [];
  const Mmax = ig ? (Math.abs(ig.szelso.M.max) >= Math.abs(ig.szelso.M.min) ? { v: ig.szelso.M.max, x: ig.szelso.M.maxX } : { v: ig.szelso.M.min, x: ig.szelso.M.minX }) : null;

  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white shadow-sm shadow-petrol-900/[0.04]">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-b border-[color:var(--keret)] bg-linear-to-r from-petrol-800 to-petrol-700 px-5 py-3.5">
        <span className="rounded-md bg-naracs-500 px-2 py-0.5 text-[10.5px] font-bold tracking-[0.14em] text-white uppercase">Felfedező</span>
        <h3 className="text-[15px] font-semibold text-white">q → V → M: a differenciális összefüggések élőben</h3>
        <span className="ml-auto text-[11.5px] text-petrol-200">kéttámaszú tartó, L = 8 m</span>
      </div>
      <div className="grid lg:grid-cols-[1.5fr_1fr] [&>*]:min-w-0">
        <div className="racs-vilagos border-b border-[color:var(--keret)] p-3 lg:border-r lg:border-b-0">
          {e.ok ? <Diagram eredmeny={e} abrak={["V", "M"]} amp={40} kiemelSzelso={1} /> : <p className="p-4 text-rose-700">Nem megoldható.</p>}
          <p className="mt-1 text-center text-[11.5px] text-petrol-500">
            A bekarikázott pontok: ahol V = 0, ott az M-nek szélsőértéke van (dM/dx = V).
          </p>
        </div>
        <div className="p-4 sm:p-5">
          <div className="space-y-2.5">
            <Csuszka cimke="Egyenletes teher, p" ertek={p} egyseg="kN/m" min={0} max={12} lepes={0.5} tizedes={1} onChange={setP} />
            <Csuszka cimke="Koncentrált erő, F" ertek={F} egyseg="kN" min={0} max={40} lepes={1} tizedes={0} onChange={setF} />
            <Csuszka cimke="az F helye, a" ertek={a} egyseg="m" min={0} max={L} lepes={0.25} tizedes={2} onChange={setA} />
            <Csuszka cimke="Koncentrált nyomaték, M₀ (↶ pozitív)" ertek={M0} egyseg="kNm" min={-40} max={40} lepes={2} tizedes={0} onChange={setM0} />
            <Csuszka cimke="az M₀ helye, b" ertek={b} egyseg="m" min={0} max={L} lepes={0.25} tizedes={2} onChange={setB} />
          </div>

          {ig && (
            <>
              <p className="mt-4 text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">Szakaszok és jellegük</p>
              <div className="mt-1.5 overflow-hidden rounded-xl border border-[color:var(--keret)]">
                <table className="w-full text-[12px]">
                  <thead className="bg-petrol-50 text-[10px] tracking-wider text-petrol-500 uppercase">
                    <tr><th className="px-2 py-1 text-left">szakasz</th><th className="px-2 py-1 text-left">teher</th><th className="px-2 py-1 text-left" style={{ color: SZINEK.V }}>V</th><th className="px-2 py-1 text-left" style={{ color: SZINEK.M }}>M</th></tr>
                  </thead>
                  <tbody className="szamok">
                    {ig.szakaszok.map((szk, i) => (
                      <tr key={i} className="border-t border-petrol-100">
                        <td className="px-2 py-1 text-petrol-800">{ert(szk.x1)}–{ert(szk.x2)} m</td>
                        <td className="px-2 py-1 text-petrol-600">{p ? `p = ${sz(p, 1)}` : "nincs"}</td>
                        <td className="px-2 py-1 text-petrol-800">{FOKNEV[fokszam(szk.V)]}</td>
                        <td className="px-2 py-1 text-petrol-800">{FOKNEV[fokszam(szk.M)]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mt-4 text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">Szélsőértékek</p>
              <div className="mt-1.5 space-y-1.5 text-[13px] text-petrol-800">
                {szelsok.length === 0 && <p className="text-petrol-500">A V ábra a tartó belsejében nem megy át a nullán — az M szélsőértéke a végén vagy egy ugrásnál/törésnél van.</p>}
                {szelsok.map((h, i) => (
                  <p key={i}>
                    <Keplet>{`V = 0\\ \\text{az}\\ x = ${sz(h.x, 2).replace(",", "{,}")}\\ \\text{m helyen}\\ \\Rightarrow\\ M = ${sz(h.M, 2).replace(",", "{,}")}\\ \\text{kNm}`}</Keplet>
                  </p>
                ))}
                {Mmax && (
                  <p className="rounded-lg bg-rose-50 px-3 py-2 text-[12.5px] text-rose-900 ring-1 ring-rose-200">
                    A legnagyobb nyomaték: <strong>{sz(Mmax.v, 2)} kNm</strong> az x = {sz(Mmax.x, 2)} m helyen{Mmax.v > 0 ? " (alul húzott)" : Mmax.v < 0 ? " (felül húzott)" : ""}.
                    {F > 0 && szelsok.some((h) => Math.abs(h.x - a) < 1e-6) ? " Az F alatt: a V ott vált előjelet (ugrással), az M ott törik." : ""}
                  </p>
                )}
              </div>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-[12px] leading-relaxed text-petrol-500">
                <li>Egyenletes teher: a V meredeksége −p, az M parabola (belógása pl²/8 a húrhoz képest).</li>
                <li>Koncentrált erő: V ugrik F-fel, M törik (ugrás nincs).</li>
                <li>Koncentrált nyomaték: M ugrik M₀-lal, V nem változik — a két oldali érintő azonos.</li>
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
