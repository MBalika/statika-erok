/** A 4. modul kidolgozott feladatainak ábrái, a feladatlap rajzai nyomán. y balra, z lefelé. */

import { TengelyekYZ, SJel } from "./SulypontAbrak";

const IDOM = "#bcdce2";
const KERET = "#234957";

function Hegy({ id, szin = "#94a3b8" }) {
  return (
    <marker id={id} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 1 L 9 5 L 0 9 z" fill={szin} />
    </marker>
  );
}

function MeretV({ x0, x1, y, szoveg, id, fent = false }) {
  return (
    <g>
      <line x1={x0} y1={y} x2={x1} y2={y} stroke="#94a3b8" strokeWidth="1" markerStart={`url(#${id})`} markerEnd={`url(#${id})`} />
      <text x={(x0 + x1) / 2} y={fent ? y - 5 : y + 14} textAnchor="middle" fontSize="11.5" fill="#64748b">{szoveg}</text>
    </g>
  );
}

function MeretF({ x, y0, y1, szoveg, id, balra = false }) {
  return (
    <g>
      <line x1={x} y1={y0} x2={x} y2={y1} stroke="#94a3b8" strokeWidth="1" markerStart={`url(#${id})`} markerEnd={`url(#${id})`} />
      <text x={balra ? x - 6 : x + 6} y={(y0 + y1) / 2 + 4} textAnchor={balra ? "end" : "start"} fontSize="11.5" fill="#64748b">{szoveg}</text>
    </g>
  );
}

/* ---------------- GYF-4: T-szelvény ---------------- */

export function AbraTSzelveny({ mutatS = false }) {
  const m = 0.5; // képpont / mm
  const ox = 330; // az origó: a felső él közepe
  const oy = 40;
  const X = (y) => ox - y * m;
  const Y = (z) => oy + z * m;
  return (
    <svg viewBox="0 0 560 230" className="abra w-full" role="img" aria-label="T-szelvény: 300×30 mm fejlemez, 20×270 mm gerinc">
      <defs>
        <Hegy id="hegy-ts" />
        <Hegy id="hegy-ts-t" szin="#475569" />
      </defs>
      <path
        d={`M ${X(150)} ${Y(0)} H ${X(-150)} V ${Y(30)} H ${X(-10)} V ${Y(300)} H ${X(10)} V ${Y(30)} H ${X(150)} Z`}
        fill={IDOM}
        stroke={KERET}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <TengelyekYZ x={ox} y={oy} hossz={200} zHossz={Y(300) + 10 - oy} id="hegy-ts-t" />
      <MeretV x0={X(150)} x1={X(-150)} y={oy - 16} szoveg="300 mm" id="hegy-ts" fent />
      <MeretF x={X(-150) + 24} y0={Y(0)} y1={Y(30)} szoveg="30" id="hegy-ts" />
      <MeretF x={X(-150) + 24} y0={Y(30)} y1={Y(300)} szoveg="270" id="hegy-ts" />
      <MeretF x={X(-150) + 70} y0={Y(0)} y1={Y(300)} szoveg="300" id="hegy-ts" />
      <line x1={X(10)} y1={Y(300) + 22} x2={X(-10)} y2={Y(300) + 22} stroke="#94a3b8" strokeWidth="1" markerStart="url(#hegy-ts)" markerEnd="url(#hegy-ts)" />
      <text x={X(-10) + 8} y={Y(300) + 26} fontSize="11.5" fill="#64748b">20</text>
      {mutatS && <SJel x={X(0)} y={Y(71.25)} cimke="S (z = 71,25)" dx={12} dy={4} />}
    </svg>
  );
}

/* ---------------- GYF-5: kivágott idom ---------------- */

export function AbraLyukasIdom({ mutatS = false }) {
  const m = 0.6; // képpont / mm
  const ox = 340; // az origó: a jobb felső sarok
  const oy = 34;
  const X = (y) => ox - y * m;
  const Y = (z) => oy + z * m;
  return (
    <svg viewBox="0 0 560 220" className="abra w-full" role="img" aria-label="Kivágott téglalap alakú idom: 300×200 mm, két 150 mm mély kivágással">
      <defs>
        <Hegy id="hegy-ly" />
        <Hegy id="hegy-ly-t" szin="#475569" />
      </defs>
      {/* az idom: 300×50 alsó lemez + két, 40 mm vastag, 150 mm magas fal (a jobb oldali kivágás a szélig ér) */}
      <path
        d={`M ${X(300)} ${Y(0)} V ${Y(200)} H ${X(0)} V ${Y(150)} H ${X(180)} V ${Y(0)} H ${X(220)} V ${Y(150)} H ${X(260)} V ${Y(0)} Z`}
        fill={IDOM}
        stroke={KERET}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <TengelyekYZ x={ox} y={oy} hossz={70} zHossz={Y(200) + 6 - oy} id="hegy-ly-t" />
      <MeretF x={ox + 38} y0={Y(0)} y1={Y(150)} szoveg="150" id="hegy-ly" />
      <MeretF x={ox + 38} y0={Y(150)} y1={Y(200)} szoveg="50" id="hegy-ly" />
      <MeretV x0={X(300)} x1={X(260)} y={Y(200) + 14} szoveg="40" id="hegy-ly" />
      <MeretV x0={X(260)} x1={X(220)} y={Y(200) + 14} szoveg="40" id="hegy-ly" />
      <MeretV x0={X(220)} x1={X(180)} y={Y(200) + 14} szoveg="40" id="hegy-ly" />
      <MeretV x0={X(180)} x1={X(0)} y={Y(200) + 14} szoveg="180" id="hegy-ly" />
      <MeretV x0={X(300)} x1={X(0)} y={Y(200) + 40} szoveg="300 mm" id="hegy-ly" />
      {mutatS && <SJel x={X(190)} y={Y(130.6)} cimke="S" dx={10} dy={-8} />}
    </svg>
  );
}

/* ---------------- GYF-6: negyedkörös idom ---------------- */

export function AbraNegyedkorIdom({ mutatS = false, reszek = false }) {
  const m = 2.2; // képpont / cm
  const ox = 300; // az origó: a z tengely és a felső él metszése
  const oy = 40;
  const X = (y) => ox - y * m;
  const Y = (z) => oy + z * m;
  const r = 50 * m;
  return (
    <svg viewBox="0 0 560 220" className="abra w-full" role="img" aria-label="Negyedkörös idom: 50 cm-es négyzetből kivont és hozzáadott negyedkör">
      <defs>
        <Hegy id="hegy-nk" />
        <Hegy id="hegy-nk-t" szin="#475569" />
      </defs>
      {/* az idom: a négyzet bal felső sarkától (y=50,z=0) ív a (0,50)-be, majd a jobb oldali negyedkör (0,0)→(−50,50) */}
      <path
        d={`M ${X(50)} ${Y(0)} A ${r} ${r} 0 0 1 ${X(0)} ${Y(50)} L ${X(-50)} ${Y(50)} A ${r} ${r} 0 0 0 ${X(0)} ${Y(0)} Z`}
        fill={IDOM}
        stroke={KERET}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {reszek && (
        <>
          <rect x={X(50)} y={Y(0)} width={50 * m} height={50 * m} fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="4 3" />
          {/* a megmaradó rész felirata az anyagban (a sarok közelében), a kivont negyedköré az üres részben */}
          <text x={X(30)} y={Y(6.5)} fontSize="11.5" fontWeight="650" style={{ fill: "#1d3c48", paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>A₁ − A₂</text>
          <text x={X(46)} y={Y(45)} fontSize="11.5" fontWeight="650" fill="#be123c">A₂ (kivonva)</text>
          <text x={X(-6)} y={Y(13)} fontSize="12" fontWeight="650" fill="#1d3c48">A₃</text>
          <circle cx={X(50 - 21.22)} cy={Y(50 - 21.22)} r="3" fill="#be123c" />
          <text x={X(50 - 21.22) + 6} y={Y(50 - 21.22) - 6} fontSize="11" fill="#be123c">S₂</text>
          <circle cx={X(-21.22)} cy={Y(50 - 21.22)} r="3" fill="#1d3c48" />
          <text x={X(-21.22) + 6} y={Y(50 - 21.22) + 14} fontSize="11" fill="#1d3c48">S₃</text>
        </>
      )}
      <TengelyekYZ x={ox} y={oy} hossz={150} zHossz={Y(50) + 30 - oy} id="hegy-nk-t" />
      <MeretV x0={X(50)} x1={X(0)} y={Y(50) + 16} szoveg="50 cm" id="hegy-nk" />
      <MeretV x0={X(0)} x1={X(-50)} y={Y(50) + 16} szoveg="50 cm" id="hegy-nk" />
      <MeretF x={X(-50) + 30} y0={Y(0)} y1={Y(50)} szoveg="50" id="hegy-nk" />
      {mutatS && <SJel x={X(-14.27)} y={Y(25)} cimke="S" dx={10} dy={-8} />}
    </svg>
  );
}
