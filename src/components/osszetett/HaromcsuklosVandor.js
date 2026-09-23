"use client";

import { useMemo, useState } from "react";
import { elemez, ertekek } from "@/lib/tarto";
import { levezetes } from "@/lib/tarto/levezetes";
import { Csuszka } from "@/components/abrak/ErovektorBonto";
import { M, MB } from "@/components/ui/Keplet";
import { sz, szK } from "@/lib/szamok";
import { TartoHegyek, Tarto, Csuklo, BelsoCsuklo, TeherNyil, TamaszCimke, Meret, MeretFugg } from "@/components/tartok/TartoElemek";
import { haromcsuklosModell, ismeretlenTerkep } from "./szamitas";
import { OsszetettHegyek, EroNyil, TestCimke } from "./Rajz";

/*
 * Háromcsuklós keret a teher vándoroltatásával: csúszkával mozog a függőleges F a gerendán,
 * élőben frissülnek a reakciók és a belső csuklóerő. A lényeg: függőleges teher mellett is
 * megszületik a vízszintes „tolóerő” (A_x = −B_x), és a csuklóban a nyomaték mindig nulla.
 */

const SZ = 640;
const MA = 400;
const L = 8;

export default function HaromcsuklosVandor() {
  const [xF, setXF] = useState(2.5);
  const [F, setF] = useState(12);
  const [h, setH] = useState(4);
  const [xC, setXC] = useState(4);
  const [hC, setHC] = useState(4);

  const adat = useMemo(() => {
    const modell = haromcsuklosModell({ L, hA: h, hB: h, xC, hC, F, xF });
    const e = elemez(modell);
    if (!e.ok) return null;
    const lv = levezetes(modell, e);
    const t = ismeretlenTerkep(lv);
    const A = e.reakciok[0], B = e.reakciok[1];
    // nyomaték a csuklóban és a legnagyobb nyomaték
    let Mmax = 0;
    for (const ig of e.igenybevetelek) Mmax = Math.max(Mmax, Math.abs(ig.szelso.M.min), Math.abs(ig.szelso.M.max));
    const igC = e.igenybevetelek.find((ig) => ig.rud === "3");
    const MC = igC ? ertekek(igC, 0).M : 0;
    return { Ax: A.Fx, Ay: A.Fy, Bx: B.Fx, By: B.Fy, Cx: t.C_x ?? 0, Cy: t.C_y ?? 0, MC, Mmax, e };
  }, [xF, F, h, xC, hC]);

  const OY = 300;
  // egységes lépték: magas keretnél (h vagy h_C nagy) kisebb, hogy a rajz és a tehernyíl a cím alatt maradjon
  const PX = Math.min(44, (OY - 112) / Math.max(h, hC, 1));
  const OX = (SZ - L * PX) / 2 - 20;
  const kx = (x) => OX + x * PX;
  const ky = (y) => OY - y * PX;
  const yF = xF <= xC ? h + ((hC - h) * xF) / xC : hC + ((h - hC) * (xF - xC)) / (L - xC);
  const LEPTEK = 3;

  const oszlopok = adat
    ? [
        { jel: "Aₓ", v: adat.Ax, szin: "#7c3aed" },
        { jel: "Aᵧ", v: adat.Ay, szin: "#7c3aed" },
        { jel: "Bₓ", v: adat.Bx, szin: "#7c3aed" },
        { jel: "Bᵧ", v: adat.By, szin: "#7c3aed" },
        { jel: "Cₓ", v: adat.Cx, szin: "#0369a1" },
        { jel: "Cᵧ", v: adat.Cy, szin: "#0369a1" },
      ]
    : [];
  const maxV = Math.max(1, ...oszlopok.map((o) => Math.abs(o.v)));

  // képlet-szöveg az azonos magasságú támaszokra
  const By = adat ? adat.By : 0;
  const Ay = adat ? adat.Ay : 0;
  const balOldalon = xF <= xC;

  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white">
      <div className="grid lg:grid-cols-[1.35fr_1fr] [&>*]:min-w-0">
        <div className="racs-vilagos border-b border-[color:var(--keret)] p-3 lg:border-r lg:border-b-0">
          <svg viewBox={`0 0 ${SZ} ${MA}`} className="abra h-auto w-full select-none">
            <TartoHegyek />
            <OsszetettHegyek />
            <text x={12} y={18} fontSize="11" fontWeight="700" letterSpacing="1.5" style={{ fill: "#64748b" }}>
              HÁROMCSUKLÓS KERET — A TEHER VÁNDOROL, A REAKCIÓK KÖVETIK
            </text>
            {/* keret */}
            <Tarto x1={kx(0)} y1={ky(0)} x2={kx(0)} y2={ky(h)} szin="#0f766e" />
            <Tarto x1={kx(0)} y1={ky(h)} x2={kx(xC)} y2={ky(hC)} szin="#0f766e" />
            <Tarto x1={kx(xC)} y1={ky(hC)} x2={kx(L)} y2={ky(h)} szin="#0369a1" />
            <Tarto x1={kx(L)} y1={ky(h)} x2={kx(L)} y2={ky(0)} szin="#0369a1" />
            <Csuklo x={kx(0)} y={ky(0)} opacitas={0.45} />
            <Csuklo x={kx(L)} y={ky(0)} opacitas={0.45} />
            <BelsoCsuklo x={kx(xC)} y={ky(hC)} />
            <TamaszCimke x={kx(0) - 18} y={ky(0) + 26}>A</TamaszCimke>
            <TamaszCimke x={kx(L) + 18} y={ky(0) + 26}>B</TamaszCimke>
            <TamaszCimke x={kx(xC)} y={ky(hC) - 12}>C</TamaszCimke>
            <TestCimke x={kx(0.5)} y={ky(h / 2)} szin="#0f766e">I</TestCimke>
            <TestCimke x={kx(L - 0.5)} y={ky(h / 2)} szin="#0369a1">II</TestCimke>
            <Meret x1={kx(0)} x2={kx(xC)} y={ky(0) + 44} cimke={`${sz(xC, 1)} m`} opacitas={0.8} />
            <Meret x1={kx(xC)} x2={kx(L)} y={ky(0) + 44} cimke={`${sz(L - xC, 1)} m`} opacitas={0.8} />
            <MeretFugg x={kx(L) + 46} y1={ky(0)} y2={ky(h)} cimke={`h = ${sz(h, 1)} m`} opacitas={0.8} />
            {/* teher */}
            <TeherNyil x={kx(xF)} y={ky(yF) - 3} hossz={26 + 1.6 * F} szog={-90} cimke={`F = ${sz(F, 0)} kN`} cimkeEltolas={[6, -2]} />
            <Meret x1={kx(0)} x2={kx(xF)} y={ky(0) + 66} cimke={`x = ${sz(xF, 2)} m`} opacitas={0.7} />
            {/* reakciók */}
            {adat && (
              <>
                <EroNyil X={kx(0)} Y={ky(0)} Fx={adat.Ax} Fy={0} leptek={LEPTEK} cimke={`Aₓ = ${sz(Math.abs(adat.Ax), 2)}`} />
                <EroNyil X={kx(0)} Y={ky(0)} Fx={0} Fy={adat.Ay} leptek={LEPTEK} cimke={`Aᵧ = ${sz(Math.abs(adat.Ay), 2)}`} cimkeEltolas={[-70, 4]} />
                <EroNyil X={kx(L)} Y={ky(0)} Fx={adat.Bx} Fy={0} leptek={LEPTEK} cimke={`Bₓ = ${sz(Math.abs(adat.Bx), 2)}`} />
                <EroNyil X={kx(L)} Y={ky(0)} Fx={0} Fy={adat.By} leptek={LEPTEK} cimke={`Bᵧ = ${sz(Math.abs(adat.By), 2)}`} cimkeEltolas={[-8, -6]} horgony="end" />
                {/* a csuklóerő a II. testre (kék, kisebb) */}
                <EroNyil X={kx(xC) + 8} Y={ky(hC)} Fx={adat.Cx} Fy={0} leptek={LEPTEK * 0.8} szin="#0369a1" hegy="oh-kek" vastag={2.2} cimke={`Cₓ = ${sz(Math.abs(adat.Cx), 2)}`} cimkeEltolas={[4, -8]} />
                <EroNyil X={kx(xC) + 8} Y={ky(hC)} Fx={0} Fy={adat.Cy} leptek={LEPTEK * 0.8} szin="#0369a1" hegy="oh-kek" vastag={2.2} cimke={`Cᵧ = ${sz(Math.abs(adat.Cy), 2)}`} cimkeEltolas={[8, adat.Cy >= 0 ? -4 : 12]} />
                <text x={kx(xC) - 14} y={ky(hC) + 24} textAnchor="end" fontSize="11" fontWeight="650" style={{ fill: "#0369a1", paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
                  M<tspan dy="3" fontSize="8">C</tspan>
                  <tspan dy="-3"> = {sz(Math.abs(adat.MC) < 1e-6 ? 0 : adat.MC, 2)} kNm</tspan>
                </text>
              </>
            )}
            <text x={SZ / 2} y={MA - 10} textAnchor="middle" fontSize="11.5" style={{ fill: "#64748b" }}>
              a lila nyilak a tényleges irányba mutatnak, hosszuk az erővel arányos
            </text>
          </svg>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <Csuszka cimke="a teher helye, x" ertek={xF} egyseg="m" min={0} max={L} lepes={0.1} tizedes={1} onChange={setXF} />
            <Csuszka cimke="a teher, F" ertek={F} egyseg="kN" min={0} max={30} lepes={1} tizedes={0} onChange={setF} />
            <Csuszka cimke="a keret magassága, h" ertek={h} egyseg="m" min={2} max={6} lepes={0.5} tizedes={1} onChange={(v) => { setH(v); if (hC < v) setHC(v); }} />
            <Csuszka cimke="a csukló helye, x_C" ertek={xC} egyseg="m" min={1.5} max={L - 1.5} lepes={0.5} tizedes={1} onChange={setXC} />
            <Csuszka cimke="a csukló magassága (törtvonalú gerenda)" ertek={hC} egyseg="m" min={h} max={h + 3} lepes={0.5} tizedes={1} onChange={setHC} />
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">Reakciók és csuklóerő (kN)</p>
          {/* oszlopdiagram */}
          <svg viewBox="0 0 300 150" className="abra mt-2 h-auto w-full">
            <line x1={20} y1={75} x2={290} y2={75} stroke="#cbd5e1" />
            {oszlopok.map((o, i) => {
              const x = 30 + i * 44;
              const hh = (Math.abs(o.v) / maxV) * 55;
              const y = o.v >= 0 ? 75 - hh : 75;
              return (
                <g key={o.jel}>
                  <rect x={x} y={y} width={26} height={Math.max(0.5, hh)} rx="3" fill={o.szin} opacity="0.85" style={{ transition: "all 120ms linear" }} />
                  <text x={x + 13} y={o.v >= 0 ? y - 5 : y + hh + 12} textAnchor="middle" fontSize="10.5" fontWeight="650" style={{ fill: o.szin }}>
                    {sz(o.v, 1)}
                  </text>
                  <text x={x + 13} y={143} textAnchor="middle" fontSize="12" fontWeight="650" style={{ fill: "#334155" }}>
                    {o.jel}
                  </text>
                </g>
              );
            })}
          </svg>

          {adat && (
            <>
              <p className="mt-2 text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">Így számolod (azonos magasságú támaszok)</p>
              <div className="szamok mt-1 space-y-0.5 text-[13px] text-petrol-800">
                <MB>{`\\Mp{A}\\ -${szK(F, 0)}\\cdot ${szK(xF, 2)} + ${szK(L, 0)}\\,B_y = 0 \\Rightarrow B_y = ${szK(By, 2)}`}</MB>
                <MB>{`\\Mp{B}\\ ${szK(F, 0)}\\cdot ${szK(L - xF, 2)} - ${szK(L, 0)}\\,A_y = 0 \\Rightarrow A_y = ${szK(Ay, 2)}`}</MB>
                {balOldalon ? (
                  <MB>{`\\Mp{C}\\ (\\text{II}):\\ ${szK(L - xC, 1)}\\,B_y + ${szK(hC, 1)}\\,B_x = 0 \\Rightarrow B_x = ${szK(adat.Bx, 2)}`}</MB>
                ) : (
                  <MB>{`\\Mp{C}\\ (\\text{I}):\\ -${szK(xC, 1)}\\,A_y + ${szK(hC, 1)}\\,A_x = 0 \\Rightarrow A_x = ${szK(adat.Ax, 2)}`}</MB>
                )}
                <MB>{`\\Fx\\ A_x + B_x = 0 \\Rightarrow ${balOldalon ? `A_x = ${szK(adat.Ax, 2)}` : `B_x = ${szK(adat.Bx, 2)}`}`}</MB>
              </div>
              <div className="mt-3 rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-[12.5px] leading-relaxed text-sky-900">
                <strong>A vízszintes tolóerő:</strong> <M>{`H = |A_x| = |B_x| = ${szK(Math.abs(adat.Ax), 2)}\\ \\text{kN}`}</M> — pedig a teher függőleges. A C csuklóban nem lehet nyomaték, ezért a fél keretet a támaszok vízszintes „tolása” tartja meg. Minél <strong>laposabb</strong> a keret (kisebb <M>{"h_C"}</M>), annál nagyobb a tolóerő; a csukló <strong>fölött</strong> álló teher adja a legnagyobbat.
              </div>
              <p className="mt-2 text-[12px] text-petrol-500">
                A csuklóban a nyomaték: <span className="szamok font-semibold">{sz(Math.abs(adat.MC) < 1e-6 ? 0 : adat.MC, 2)} kNm</span> (mindig nulla) · a legnagyobb nyomaték a szerkezetben: <span className="szamok font-semibold">{sz(adat.Mmax, 2)} kNm</span>.
                {F === 0 && " Teher nélkül minden reakció nulla — a passzív erők a terhekből erednek."}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
