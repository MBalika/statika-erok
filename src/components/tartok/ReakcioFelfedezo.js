"use client";

import { useState } from "react";
import { Csuszka } from "@/components/abrak/ErovektorBonto";
import { M } from "@/components/ui/Keplet";
import { sz, szK, zarojel } from "@/lib/szamok";
import {
  TartoHegyek,
  Tarto,
  Gorgo,
  Csuklo,
  TeherNyil,
  ReakcioNyil,
  MegoszloTeher,
  Meret,
  TamaszCimke,
  SZIN,
} from "./TartoElemek";

const SZ = 620;
const MA = 350;
const X0 = 120;
const Y = 175;

/** Kéttámaszú (konzolos) tartó reakciói: A csukló x = 0-nál, B görgő x = L-nél, a tartó L + k hosszú. */
export function kettamaszuReakciok({ L, F, xF, beta, p, x1, x2 }) {
  const r = (beta * Math.PI) / 180;
  const Fx = F * Math.cos(r);
  const Fy = F * Math.sin(r);
  const Q = p * (x2 - x1); // lefelé
  const xq = (x1 + x2) / 2;
  const B = (-xF * Fy + Q * xq) / L;
  const Ay = ((xF - L) * Fy - Q * (xq - L)) / L;
  const Ax = -Fx;
  const ellenorzes = Ay + B + Fy - Q;
  return { Fx, Fy, Q, xq, B, Ay, Ax, ellenorzes };
}

export default function ReakcioFelfedezo({ kezdo = {} }) {
  const [L, setL] = useState(kezdo.L ?? 6);
  const [k, setK] = useState(kezdo.k ?? 0);
  const [F, setF] = useState(kezdo.F ?? 12);
  const [xF0, setXF] = useState(kezdo.xF ?? 2);
  const [beta, setBeta] = useState(kezdo.beta ?? -90);
  const [p, setP] = useState(kezdo.p ?? 0);
  const [x10, setX1] = useState(kezdo.x1 ?? 0);
  const [x20, setX2] = useState(kezdo.x2 ?? 3);

  const teljes = L + k;
  const xF = Math.min(xF0, teljes);
  const x1 = Math.min(x10, teljes);
  const x2 = Math.max(x1, Math.min(x20, teljes));

  const e = kettamaszuReakciok({ L, F, xF, beta, p, x1, x2 });
  const { Fx, Fy, Q, xq, B, Ay, Ax, ellenorzes } = e;

  const leptek = Math.min(46, 440 / teljes);
  const kx = (x) => X0 + x * leptek;
  const maxR = Math.max(Math.abs(Ax), Math.abs(Ay), Math.abs(B), 1);
  const hossz = (v) => 16 + (54 * Math.abs(v)) / maxR;
  const felbillen = B < -1e-6;

  const kNm = (v) => `${szK(v, 2)}`;
  const tagF = (kar) => (Math.abs(Fy) > 1e-9 && Math.abs(kar) > 1e-9 ? ` ${zarojel(kar, 2).replace(",", "{,}")}\\cdot(${kNm(Fy)})` : "");
  const tagQ = (kar) => (Q > 1e-9 && Math.abs(kar) > 1e-9 ? ` - ${kNm(Q)}\\cdot ${zarojel(kar, 2).replace(",", "{,}")}` : "");
  const osszefuz = (tagok) => {
    const t = tagok.join("").trim();
    return t.startsWith("-") || t === "" ? t : t.replace(/^\+\s*/, "");
  };

  const egyA = `\\Mp{A}\\ ${osszefuz([tagF(xF), tagQ(xq)]) || "0"} + ${kNm(L)}\\,B = 0\\ \\Rightarrow\\ B = ${kNm(B)}\\ \\text{kN}`;
  const egyB = `\\Mp{B}\\ ${osszefuz([tagF(xF - L), tagQ(xq - L)]) || "0"} - ${kNm(L)}\\,A_y = 0\\ \\Rightarrow\\ A_y = ${kNm(Ay)}\\ \\text{kN}`;
  const egyX = `\\Fx\\ A_x + (${kNm(Fx)}) = 0\\ \\Rightarrow\\ A_x = ${kNm(Ax)}\\ \\text{kN}`;
  const ell = `\\Fy\\ ${kNm(Ay)} + (${kNm(B)}) + (${kNm(Fy)})${Q > 1e-9 ? ` - ${kNm(Q)}` : ""} = ${szK(Math.abs(ellenorzes) < 5e-3 ? 0 : ellenorzes, 2)}\\ \\checkmark`;

  const gomb = "rounded-lg bg-white px-2.5 py-1.5 text-[12px] font-medium text-petrol-600 ring-1 ring-petrol-200 transition hover:bg-petrol-50";

  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white">
      <div className="grid lg:grid-cols-[1.3fr_1fr] [&>*]:min-w-0">
        <div className="racs-vilagos border-b border-[color:var(--keret)] p-3 lg:border-r lg:border-b-0">
          <svg viewBox={`0 0 ${SZ} ${MA}`} className="abra w-full h-auto select-none">
            <TartoHegyek />
            {/* megoszló teher */}
            {p > 0 && x2 - x1 > 0.01 && <MegoszloTeher x1={kx(x1)} x2={kx(x2)} y={Y - 3} p1={p} p2={p} leptek={4.2} cimke1={`p = ${sz(p, 1)} kN/m`} />}
            {/* koncentrált erő */}
            {F > 0 && <TeherNyil x={kx(xF)} y={Y - 3} hossz={56} szog={beta} cimke={`F = ${sz(F, 1)} kN`} cimkeEltolas={beta > -90 ? [-70, -6] : [8, -6]} />}

            {/* tartó és támaszok */}
            <Tarto x1={kx(0) - 8} y1={Y} x2={kx(teljes) + (k > 0 ? 0 : 8)} y2={Y} />
            <Csuklo x={kx(0)} y={Y} />
            <Gorgo x={kx(L)} y={Y} />
            <TamaszCimke x={kx(0) - 26} y={Y + 32}>A</TamaszCimke>
            <TamaszCimke x={kx(L) + 26} y={Y + 32}>B</TamaszCimke>

            {/* reakciók */}
            <g>
              {Math.abs(Ax) > 1e-6 &&
                (Ax >= 0 ? <ReakcioNyil x={kx(0) - 8} y={Y} hossz={hossz(Ax)} szog={0} /> : <ReakcioNyil x={kx(0) - 8 - hossz(Ax)} y={Y} hossz={hossz(Ax)} szog={180} />)}
              <text x={kx(0) - 12} y={Y + 17} textAnchor="end" fontSize="12.5" fontWeight="650" style={{ fill: SZIN.reakcio, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
                Aₓ = {sz(Ax, 2)} kN
              </text>
              {Ay >= 0 ? <ReakcioNyil x={kx(0)} y={Y + 40} hossz={hossz(Ay)} szog={90} /> : <ReakcioNyil x={kx(0)} y={Y + 40 + hossz(Ay)} hossz={hossz(Ay)} szog={-90} />}
              <text x={kx(0) + 8} y={Y + 46 + hossz(Ay)} fontSize="12.5" fontWeight="650" style={{ fill: SZIN.reakcio, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
                A<tspan dy="3" fontSize="9.5">y</tspan>
                <tspan dy="-3"> = {sz(Ay, 2)} kN</tspan>
              </text>
              {B >= 0 ? <ReakcioNyil x={kx(L)} y={Y + 44} hossz={hossz(B)} szog={90} /> : <ReakcioNyil x={kx(L)} y={Y + 44 + hossz(B)} hossz={hossz(B)} szog={-90} szin="#be123c" hegy="th-nyomatek" />}
              <text x={kx(L) + 8} y={Y + 50 + hossz(B)} fontSize="12.5" fontWeight="650" style={{ fill: felbillen ? "#be123c" : SZIN.reakcio, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
                B = {sz(B, 2)} kN
              </text>
            </g>

            {/* méretek */}
            <Meret x1={kx(0)} x2={kx(L)} y={Y + 140} cimke={`L = ${sz(L, 1)} m`} />
            {k > 0 && <Meret x1={kx(L)} x2={kx(teljes)} y={Y + 140} cimke={`k = ${sz(k, 1)} m`} />}
            {F > 0 && <Meret x1={kx(0)} x2={kx(xF)} y={Y - 92} cimke={`x = ${sz(xF, 1)} m`} />}

            {felbillen && (
              <text x={SZ / 2} y={MA - 10} textAnchor="middle" fontSize="13" fontWeight="700" style={{ fill: "#be123c", paintOrder: "stroke", stroke: "white", strokeWidth: 4 }}>
                B negatív: a görgő nem tud húzni — a tartó felbillenne!
              </text>
            )}
          </svg>
          <div className="mt-2 flex flex-wrap justify-center gap-1.5">
            <button type="button" className={gomb} onClick={() => { setXF(L); setP(0); }}>
              A teher a támasz fölött
            </button>
            <button type="button" className={gomb} onClick={() => { setK(2); setXF(L + 2); setP(0); }}>
              A teher a konzolon
            </button>
            <button type="button" className={gomb} onClick={() => { setF(0); setP(4); setX1(0); setX2(L); }}>
              Csak megoszló teher
            </button>
            <button type="button" className="rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-petrol-500 transition hover:text-petrol-800" onClick={() => { setL(6); setK(0); setF(12); setXF(2); setBeta(-90); setP(0); setX1(0); setX2(3); }}>
              Alaphelyzet
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            <Csuszka cimke="Támaszköz, L" ertek={L} egyseg="m" min={2} max={10} lepes={0.5} tizedes={1} onChange={setL} />
            <Csuszka cimke="Konzol jobbra, k" ertek={k} egyseg="m" min={0} max={3} lepes={0.5} tizedes={1} onChange={setK} />
            <Csuszka cimke="Erő, F" ertek={F} egyseg="kN" min={0} max={20} lepes={0.5} tizedes={1} onChange={setF} />
            <Csuszka cimke="Helye, x" ertek={xF} egyseg="m" min={0} max={teljes} lepes={0.5} tizedes={1} onChange={setXF} />
            <Csuszka cimke="Iránya, β" ertek={beta} egyseg="°" min={-180} max={0} lepes={5} tizedes={0} onChange={setBeta} />
            <Csuszka cimke="Megoszló, p" ertek={p} egyseg="kN/m" min={0} max={10} lepes={0.5} tizedes={1} onChange={setP} />
            <Csuszka cimke="p kezdete, x₁" ertek={x1} egyseg="m" min={0} max={teljes} lepes={0.5} tizedes={1} onChange={setX1} />
            <Csuszka cimke="p vége, x₂" ertek={x2} egyseg="m" min={0} max={teljes} lepes={0.5} tizedes={1} onChange={setX2} />
          </div>

          {/* oszlopdiagram */}
          <div className="mt-4 space-y-1.5">
            {[
              ["Aₓ", Ax],
              ["A_y", Ay],
              ["B", B],
            ].map(([nev, v]) => (
              <div key={nev} className="flex items-center gap-2 text-[12px]">
                <span className="szamok w-8 shrink-0 font-semibold text-petrol-700">{nev === "A_y" ? <M>{"A_y"}</M> : nev}</span>
                <div className="relative h-4 flex-1 overflow-hidden rounded bg-petrol-50">
                  <div className={`absolute top-0 h-full rounded ${v < 0 ? "bg-rose-400" : "bg-violet-400"}`} style={{ left: "50%", width: `${(50 * Math.abs(v)) / maxR}%`, transform: v < 0 ? "translateX(-100%)" : undefined }} />
                  <div className="absolute top-0 left-1/2 h-full w-px bg-petrol-300" />
                </div>
                <span className="szamok w-20 shrink-0 text-right font-semibold text-petrol-800">{sz(v, 2)} kN</span>
              </div>
            ))}
          </div>

          <div className="szamok mt-4 space-y-1.5 overflow-x-auto rounded-xl bg-petrol-50 px-3 py-2 text-[12.5px] text-petrol-800">
            <div><M>{egyA}</M></div>
            <div><M>{egyB}</M></div>
            <div><M>{egyX}</M></div>
            <div className="border-t border-dashed border-petrol-200 pt-1.5 text-emerald-800"><M>{ell}</M></div>
          </div>
          {felbillen && (
            <p className="mt-2 rounded-lg bg-rose-50 px-3 py-2 text-[12.5px] text-rose-800">
              A görgő csak nyomni tudja a tartót. Negatív B azt jelentené, hogy le kellene húznia — ez a szerkezet így nem tartó: a konzol lebillenne. Told a terhet a támaszok közé, vagy tegyél ellensúlyt a másik oldalra.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
