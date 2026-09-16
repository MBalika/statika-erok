"use client";

import { useMemo, useState } from "react";
import { elemez, mintak } from "@/lib/tarto";
import { Csuszka } from "@/components/abrak/ErovektorBonto";
import { M } from "@/components/ui/Keplet";
import { sz } from "@/lib/szamok";
import { TartoHegyek, Tarto, Csuklo, Gorgo, BelsoCsuklo, MegoszloTeher, TamaszCimke, Meret } from "@/components/tartok/TartoElemek";
import { OsszetettHegyek, EroNyil } from "./Rajz";

/*
 * Gerber-tartó csuklóhely-csúszkával: kétnyílású gerenda egyenletes teherrel, a második nyílásban
 * belső csuklóval. Hová tedd a csuklót, hogy a támasz feletti (negatív) és a mezőbeli (pozitív)
 * legnagyobb nyomaték kiegyenlítődjön? A nyomatéki ábra a számítómag `elemez` szélsőértékeiből jön.
 */

const SZ = 640;
const MA = 330;
const L1 = 6, L2 = 6;

export default function GerberCsuklohely() {
  const [s, setS] = useState(1.5); // a csukló távolsága B-től
  const [p, setP] = useState(5);

  const adat = useMemo(() => {
    const xC = L1 + s;
    const modell = {
      csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "B", x: L1, y: 0 }, { id: "C", x: xC, y: 0 }, { id: "D", x: L1 + L2, y: 0 }],
      rudak: [{ id: "1", a: "A", b: "B" }, { id: "2", a: "B", b: "C" }, { id: "3", a: "C", b: "D", csukloA: true }],
      tamaszok: [{ csomopont: "A", tipus: "csuklo" }, { csomopont: "B", tipus: "gorgo", szog: 90 }, { csomopont: "D", tipus: "gorgo", szog: 90 }],
      terhek: ["1", "2", "3"].map((rud) => ({ fajta: "megoszlo", rud, p1: -p, irany: "y" })),
    };
    const e = elemez(modell);
    if (!e.ok) return null;
    let Mmin = 0, Mmax = 0, xMin = 0, xMax = 0;
    const pontok = [];
    for (const ig of e.igenybevetelek) {
      for (const q of mintak(ig, 40)) pontok.push([ig.kezdo[0] + q.x, q.M]);
      if (ig.szelso.M.min < Mmin) { Mmin = ig.szelso.M.min; xMin = ig.kezdo[0] + ig.szelso.M.minX; }
      if (ig.szelso.M.max > Mmax) { Mmax = ig.szelso.M.max; xMax = ig.kezdo[0] + ig.szelso.M.maxX; }
    }
    const reak = { A: e.reakciok[0].Fy, B: e.reakciok[1].Fy, D: e.reakciok[2].Fy };
    return { e, pontok, Mmin, Mmax, xMin, xMax, reak, xC };
  }, [s, p]);

  const OX = 60, OY = 150, PX = 44;
  const kx = (x) => OX + x * PX;
  const ky = (y) => OY - y * PX;
  const Mlep = adat ? 70 / Math.max(1, Math.abs(adat.Mmin), Math.abs(adat.Mmax)) : 1;
  const arany_ = adat ? Math.abs(adat.Mmin) / Math.max(1e-9, adat.Mmax) : 0;
  const kiegyenlitett = adat && Math.abs(arany_ - 1) < 0.06;

  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white">
      <div className="grid lg:grid-cols-[1.4fr_1fr] [&>*]:min-w-0">
        <div className="racs-vilagos border-b border-[color:var(--keret)] p-3 lg:border-r lg:border-b-0">
          <svg viewBox={`0 0 ${SZ} ${MA}`} className="abra h-auto w-full select-none">
            <TartoHegyek />
            <OsszetettHegyek />
            <text x={12} y={18} fontSize="11" fontWeight="700" letterSpacing="1.5" style={{ fill: "#64748b" }}>
              HOVÁ TEDD A CSUKLÓT? — A NYOMATÉKI ÁBRA A HÚZOTT OLDALRA RAJZOLVA
            </text>
            {adat && (
              <>
                {/* nyomatéki ábra: pozitív (alsó húzott) lefelé */}
                <path d={`M ${kx(0)} ${OY} ${adat.pontok.map(([x, m]) => `L ${kx(x)} ${OY + m * Mlep}`).join(" ")} L ${kx(L1 + L2)} ${OY} Z`} fill="#be123c" fillOpacity="0.14" stroke="#be123c" strokeWidth="1.8" strokeLinejoin="round" style={{ transition: "d 80ms linear" }} />
                <text x={kx(adat.xMax)} y={OY + adat.Mmax * Mlep + 14} textAnchor="middle" fontSize="11.5" fontWeight="700" style={{ fill: "#be123c", paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
                  M<tspan dy="3" fontSize="8">mező</tspan><tspan dy="-3"> = {sz(adat.Mmax, 2)}</tspan>
                </text>
                <text x={kx(adat.xMin)} y={OY + adat.Mmin * Mlep - 8} textAnchor="middle" fontSize="11.5" fontWeight="700" style={{ fill: "#be123c", paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
                  M<tspan dy="3" fontSize="8">B</tspan><tspan dy="-3"> = {sz(adat.Mmin, 2)}</tspan>
                </text>
              </>
            )}
            <MegoszloTeher x1={kx(0)} x2={kx(L1 + L2)} y={OY - 3} p1={p} leptek={3} cimke1={`p = ${sz(p, 0)} kN/m`} />
            <Tarto x1={kx(0)} y1={OY} x2={kx(L1 + L2)} y2={OY} />
            <Csuklo x={kx(0)} y={OY} />
            <Gorgo x={kx(L1)} y={OY} />
            <Gorgo x={kx(L1 + L2)} y={OY} />
            {adat && <BelsoCsuklo x={kx(adat.xC)} y={OY} />}
            <TamaszCimke x={kx(0) - 16} y={OY + 26}>A</TamaszCimke>
            <TamaszCimke x={kx(L1) + 16} y={OY + 26}>B</TamaszCimke>
            <TamaszCimke x={kx(L1 + L2) + 16} y={OY + 26}>D</TamaszCimke>
            {adat && <TamaszCimke x={kx(adat.xC)} y={OY - 12}>C</TamaszCimke>}
            {adat && (
              <>
                <Meret x1={kx(L1)} x2={kx(adat.xC)} y={OY + 118} cimke={`s = ${sz(s, 2)} m`} opacitas={0.85} />
                <Meret x1={kx(0)} x2={kx(L1)} y={OY + 140} cimke="6 m" opacitas={0.7} />
                <Meret x1={kx(L1)} x2={kx(L1 + L2)} y={OY + 140} cimke="6 m" opacitas={0.7} />
                <EroNyil X={kx(0)} Y={OY + 40} Fx={0} Fy={adat.reak.A} leptek={1.4} maxHossz={40} cimke={`A = ${sz(adat.reak.A, 2)}`} cimkeEltolas={[-40, 16]} />
                <EroNyil X={kx(L1)} Y={OY + 40} Fx={0} Fy={adat.reak.B} leptek={1.4} maxHossz={40} cimke={`B = ${sz(adat.reak.B, 2)}`} cimkeEltolas={[6, 16]} />
                <EroNyil X={kx(L1 + L2)} Y={OY + 40} Fx={0} Fy={adat.reak.D} leptek={1.4} maxHossz={40} cimke={`D = ${sz(adat.reak.D, 2)}`} cimkeEltolas={[6, 16]} />
              </>
            )}
          </svg>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <Csuszka cimke="a csukló távolsága B-től, s" ertek={s} egyseg="m" min={0.25} max={5.75} lepes={0.05} tizedes={2} onChange={setS} />
            <Csuszka cimke="egyenletes teher, p" ertek={p} egyseg="kN/m" min={1} max={12} lepes={0.5} tizedes={1} onChange={setP} />
          </div>
        </div>
        <div className="p-4 sm:p-5">
          <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">Miért van egyáltalán csukló?</p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-petrol-700">
            Három támasz és egy folytatólagos gerenda: 4 ismeretlen, 3 egyenlet — statikailag határozatlan. Egy belső csukló egy plusz egyenletet ad (<M>{"M_C = 0"}</M>), a tartó határozottá válik, és a csukló helyével még a nyomatékok eloszlását is te szabod meg.
          </p>
          {adat && (
            <>
              <div className={`mt-3 rounded-xl border p-3 ${kiegyenlitett ? "border-emerald-300 bg-emerald-50 text-emerald-900" : "border-petrol-200 bg-petrol-50 text-petrol-800"}`}>
                <p className="text-[13px] font-semibold">{kiegyenlitett ? "Kiegyenlítve! ✓" : "Még nem egyenlő a két szélsőérték"}</p>
                <div className="szamok mt-1 text-[12.5px]">
                  <M>{`|M_B| = ${sz(Math.abs(adat.Mmin), 2).replace(",", "{,}")}\\ \\text{kNm}`}</M>, <M>{`M_{\\text{mező}} = ${sz(adat.Mmax, 2).replace(",", "{,}")}\\ \\text{kNm}`}</M>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white ring-1 ring-black/5">
                  <div className="h-full bg-rose-500 transition-all" style={{ width: `${Math.min(100, (Math.abs(adat.Mmin) / (Math.abs(adat.Mmin) + adat.Mmax)) * 100)}%` }} />
                </div>
                <p className="mt-1 text-[11.5px] opacity-80">a csík: a támasznyomaték aránya a kettő összegéből (50 % = kiegyenlített)</p>
              </div>
              <p className="mt-3 text-[12.5px] leading-relaxed text-petrol-600">
                A csukló a B–D nyílásban van, <M>{`s = ${sz(s, 2).replace(",", "{,}")}`}</M> m-re B-től. Ha a csukló közel van B-hez, a B feletti negatív nyomaték kicsi és a mezőnyomaték nagy; ha távol, a konzolos rész hosszú és a támasznyomaték nő. A mérnök ott teszi a csuklót, ahol a kettő nagysága azonos — így a gerenda anyaga egyenletesebben dolgozik. Tipp: két egyforma nyílásnál <M>{"s \\approx 0{,}17\\,L"}</M> környékén keresd.
              </p>
              <p className="mt-2 text-[12px] text-petrol-500">
                Reakciók: A = {sz(adat.reak.A, 2)}, B = {sz(adat.reak.B, 2)}, D = {sz(adat.reak.D, 2)} kN (összegük {sz(adat.reak.A + adat.reak.B + adat.reak.D, 1)} = {sz(p * (L1 + L2), 1)} kN, a teljes teher).
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
