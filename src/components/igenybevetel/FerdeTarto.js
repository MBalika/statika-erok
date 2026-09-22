"use client";

import { useMemo, useState } from "react";
import { elemez } from "@/lib/tarto";
import { Csuszka } from "@/components/abrak/ErovektorBonto";
import Diagram, { SZINEK } from "@/components/igenybevetel/Diagram";
import { SZIN } from "@/components/tartok/TartoElemek";
import { M as Keplet, MB } from "@/components/ui/Keplet";
import { sz, szK } from "@/lib/szamok";

/**
 * Ferde tengelyű tartó felfedező: L = 5 m hosszú, csuklóval és görgővel
 * megtámasztott ferde gerenda, függőleges egyenletes teherrel. A dőlésszög
 * csúszkával állítható; a teher tengelyirányú és merőleges komponensre bomlik
 * (animált átmenettel), az N, V, M ábra élőben a számítómagból.
 */

const L = 5, p = 4;
const SZ = 300, MA = 210;

export default function FerdeTarto() {
  const [alfa, setAlfa] = useState(30);
  const [vetuletre, setVetuletre] = useState(false);
  const a = (alfa * Math.PI) / 180;
  const c = Math.cos(a), s = Math.sin(a);

  const e = useMemo(() => elemez({
    csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "B", x: L * c, y: L * s }],
    rudak: [{ id: "1", a: "A", b: "B" }],
    tamaszok: [{ csomopont: "A", tipus: "csuklo" }, { csomopont: "B", tipus: "gorgo", szog: 90 }],
    terhek: [{ fajta: "megoszlo", rud: "1", p1: -p, irany: "y", vetuletre }],
  }), [c, s, vetuletre]);

  // a hossz méterére eső intenzitás és komponensei
  const pHossz = vetuletre ? p * c : p;
  const pMer = pHossz * c, pTeng = pHossz * s;
  const R = pHossz * L;
  const Ay = R / 2, B = R / 2;
  const N0 = -Ay * s, V0 = Ay * c, Mmax = (pMer * L * L) / 8;

  // kis ábra: egy p nyíl felbontása a tengelyre és a merőlegesre
  const ox = 150, oy = 118, h = 70;
  const ux = c, uy = -s; // tengely a képernyőn
  const nx = s, ny = c; // a tengelyre merőleges, lefelé mutató komponens iránya (képernyő)
  const Ny = ({ x1, y1, x2, y2, szin, id }) => <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={szin} strokeWidth="2.6" markerEnd={`url(#ft-${id})`} style={{ transition: "all .35s ease" }} />;

  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white shadow-sm shadow-petrol-900/[0.04]">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-b border-[color:var(--keret)] bg-linear-to-r from-petrol-800 to-petrol-700 px-5 py-3.5">
        <span className="rounded-md bg-naracs-500 px-2 py-0.5 text-[10.5px] font-bold tracking-[0.14em] text-white uppercase">Felfedező</span>
        <h3 className="text-[15px] font-semibold text-white">Ferde tengelyű tartó — a teher komponensekre bomlik</h3>
        <span className="ml-auto text-[11.5px] text-petrol-200">L = 5 m, p = 4 kN/m függőleges</span>
      </div>
      <div className="grid lg:grid-cols-[1.4fr_1fr] [&>*]:min-w-0">
        <div className="racs-vilagos border-b border-[color:var(--keret)] p-3 lg:border-r lg:border-b-0">
          {e.ok && <Diagram eredmeny={e} abrak={["N", "V", "M"]} amp={34} kiemelSzelso={1} />}
        </div>
        <div className="p-4 sm:p-5">
          <Csuszka cimke="Dőlésszög, α" ertek={alfa} egyseg="°" min={0} max={50} lepes={1} tizedes={0} onChange={setAlfa} />
          <div className="mt-2 flex gap-1.5">
            {[[false, "p a ferde hossz méterére"], [true, "p a vízszintes vetület méterére"]].map(([v, nev]) => (
              <button key={String(v)} type="button" onClick={() => setVetuletre(v)} className={`rounded-lg px-3 py-1.5 text-[12px] font-semibold transition ${vetuletre === v ? "bg-petrol-800 text-white" : "bg-white text-petrol-700 ring-1 ring-petrol-200 hover:bg-petrol-50"}`}>{nev}</button>
            ))}
          </div>

          <svg viewBox={`0 0 ${SZ} ${MA}`} className="abra mt-3 h-auto w-full select-none rounded-xl bg-white ring-1 ring-petrol-100">
            <defs>
              {[["p", SZIN.teher], ["N", SZINEK.N], ["V", SZINEK.V]].map(([id, szin]) => (
                <marker key={id} id={`ft-${id}`} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
                  <path d="M 0 1 L 9 5 L 0 9 z" fill={szin} />
                </marker>
              ))}
            </defs>
            <text x={10} y={16} fontSize="11.5" fontWeight="700" style={{ fill: "#475569" }}>A hossz 1 méterére eső teher felbontása</text>
            {/* tengely */}
            <line x1={ox - ux * 110} y1={oy - uy * 110} x2={ox + ux * 110} y2={oy + uy * 110} stroke={SZIN.tarto} strokeWidth="5" strokeLinecap="round" style={{ transition: "all .35s ease" }} />
            {/* p függőlegesen */}
            <Ny x1={ox} y1={oy - h} x2={ox} y2={oy} szin={SZIN.teher} id="p" />
            <text x={ox + 6} y={oy - h + 4} fontSize="11.5" fontWeight="700" style={{ fill: SZIN.teher }}>{sz(pHossz, 2)} kN/m</text>
            {/* komponensek */}
            <Ny x1={ox - nx * h * c} y1={oy - ny * h * c} x2={ox} y2={oy} szin={SZINEK.V} id="V" />
            <Ny x1={ox + ux * h * s} y1={oy + uy * h * s} x2={ox} y2={oy} szin={SZINEK.N} id="N" />
            <line x1={ox} y1={oy - h} x2={ox - nx * h * c} y2={oy - ny * h * c} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" style={{ transition: "all .35s ease" }} />
            <line x1={ox} y1={oy - h} x2={ox + ux * h * s} y2={oy + uy * h * s} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" style={{ transition: "all .35s ease" }} />
            <text x={ox - nx * h * c - 8} y={oy - ny * h * c - 6} textAnchor="end" fontSize="11.5" fontWeight="700" style={{ fill: SZINEK.V }}>merőleges: {sz(pMer, 2)}</text>
            <text x={ox + ux * h * s + 6} y={oy + uy * h * s + 16} textAnchor="start" fontSize="11.5" fontWeight="700" style={{ fill: SZINEK.N }}>tengelyirányú: {sz(pTeng, 2)}</text>
            <text x={ox + ux * 60 + 10} y={oy + uy * 60 + 4} fontSize="11" fontStyle="italic" style={{ fill: "#475569" }}>α = {alfa}°</text>
            <text x={10} y={MA - 34} fontSize="11" style={{ fill: "#475569" }}>merőleges = p·cos α → V és M;  tengelyirányú = p·sin α → N</text>
            <text x={10} y={MA - 18} fontSize="11" style={{ fill: "#475569" }}>{vetuletre ? `vetületre adott p: a ferde hossz méterére p·cos α = ${sz(pHossz, 2)} kN/m jut` : "a ferde hossz méterére adott p: nincs átváltás"}</text>
          </svg>

          <div className="mt-3 space-y-1 text-[13px] text-petrol-800">
            <MB>{`R = ${szK(pHossz, 2)}\\cdot 5 = ${szK(R, 2)}\\ \\text{kN},\\quad A_y = B = ${szK(Ay, 2)}\\ \\text{kN},\\quad A_x = 0`}</MB>
            <MB>{`N(0) = -A_y\\sin\\alpha = ${szK(N0, 2)},\\qquad V(0) = +A_y\\cos\\alpha = ${szK(V0, 2)}\\ \\text{kN}`}</MB>
            <MB>{`M_{\\max} = \\frac{(p\\cos\\alpha)\\,L^2}{8} = \\frac{${szK(pMer, 2)}\\cdot 25}{8} = ${szK(Mmax, 2)}\\ \\text{kNm}`}</MB>
          </div>
          <p className="mt-2 text-[12px] leading-relaxed text-petrol-500">
            A függőleges reakció a ferde tengelyre nézve is ferde: az <Keplet>{"A_y"}</Keplet> egy része nyomja a rudat (N), a másik nyírja (V). A normálerő lineárisan változik (a tengelyirányú komponens miatt), a nyíróerő is lineáris, az M parabola — a belógás képletében L a ferde hossz, p pedig a merőleges komponens.
          </p>
        </div>
      </div>
    </div>
  );
}
