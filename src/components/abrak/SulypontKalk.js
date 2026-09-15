"use client";

import { useState } from "react";
import { TengelyekYZ, SJel } from "./SulypontAbrak";
import { sz, szK } from "@/lib/szamok";
import { M } from "@/components/ui/Keplet";

const SZ = 560;
const MA = 420;
const PI = Math.PI;
const SZINEK = ["#275767", "#bc4508", "#15803d", "#6d28d9", "#0e7490", "#a16207"];

const ALAKOK = [
  ["teglalap", "téglalap"],
  ["haromszog", "háromszög (3 csúcs)"],
  ["kor", "kör"],
  ["felkor", "félkör"],
  ["negyedkor", "negyedkör"],
];

const IRANYOK = [
  ["+y", "+y felé (balra)"],
  ["-y", "−y felé (jobbra)"],
  ["+z", "+z felé (lefelé)"],
  ["-z", "−z felé (felfelé)"],
];

const NEGYEDEK = [
  ["+y+z", "+y, +z (balra-le)"],
  ["-y+z", "−y, +z (jobbra-le)"],
  ["+y-z", "+y, −z (balra-fel)"],
  ["-y-z", "−y, −z (jobbra-fel)"],
];

function ujResz(alak = "teglalap") {
  const alap = { alak, elojel: 1 };
  switch (alak) {
    case "haromszog":
      return { ...alap, y1: 0, z1: 0, y2: 100, z2: 0, y3: 0, z3: 80 };
    case "kor":
      return { ...alap, r: 40, y0: 60, z0: 60 };
    case "felkor":
      return { ...alap, r: 50, y0: 50, z0: 0, irany: "+z" };
    case "negyedkor":
      return { ...alap, r: 50, y0: 0, z0: 0, negyed: "+y+z" };
    default:
      return { ...alap, b: 100, h: 60, y0: 0, z0: 0 };
  }
}

/** Egy rész területe és súlypontja (előjel nélkül), meg a rajzoláshoz a befoglaló doboz. */
function reszAdat(r) {
  const n = (v) => Number(v) || 0;
  switch (r.alak) {
    case "haromszog": {
      const y1 = n(r.y1), z1 = n(r.z1), y2 = n(r.y2), z2 = n(r.z2), y3 = n(r.y3), z3 = n(r.z3);
      const A = Math.abs((y2 - y1) * (z3 - z1) - (y3 - y1) * (z2 - z1)) / 2;
      return {
        A,
        y: (y1 + y2 + y3) / 3,
        z: (z1 + z2 + z3) / 3,
        doboz: [Math.min(y1, y2, y3), Math.max(y1, y2, y3), Math.min(z1, z2, z3), Math.max(z1, z2, z3)],
      };
    }
    case "kor": {
      const rr = n(r.r), y0 = n(r.y0), z0 = n(r.z0);
      return { A: rr * rr * PI, y: y0, z: z0, doboz: [y0 - rr, y0 + rr, z0 - rr, z0 + rr] };
    }
    case "felkor": {
      const rr = n(r.r), y0 = n(r.y0), z0 = n(r.z0);
      const e = (4 * rr) / (3 * PI);
      const ir = r.irany ?? "+z";
      const dy = ir === "+y" ? 1 : ir === "-y" ? -1 : 0;
      const dz = ir === "+z" ? 1 : ir === "-z" ? -1 : 0;
      const doboz = dy !== 0 ? [Math.min(y0, y0 + dy * rr), Math.max(y0, y0 + dy * rr), z0 - rr, z0 + rr] : [y0 - rr, y0 + rr, Math.min(z0, z0 + dz * rr), Math.max(z0, z0 + dz * rr)];
      return { A: (rr * rr * PI) / 2, y: y0 + dy * e, z: z0 + dz * e, doboz };
    }
    case "negyedkor": {
      const rr = n(r.r), y0 = n(r.y0), z0 = n(r.z0);
      const e = (4 * rr) / (3 * PI);
      const ng = r.negyed ?? "+y+z";
      const sy = ng.startsWith("+") ? 1 : -1;
      const szj = ng.endsWith("+z") ? 1 : -1;
      return {
        A: (rr * rr * PI) / 4,
        y: y0 + sy * e,
        z: z0 + szj * e,
        doboz: [Math.min(y0, y0 + sy * rr), Math.max(y0, y0 + sy * rr), Math.min(z0, z0 + szj * rr), Math.max(z0, z0 + szj * rr)],
      };
    }
    default: {
      const b = n(r.b), h = n(r.h), y0 = n(r.y0), z0 = n(r.z0);
      return { A: b * h, y: y0 + b / 2, z: z0 + h / 2, doboz: [y0, y0 + b, z0, z0 + h] };
    }
  }
}

/** SVG útvonal egy részhez (X, Y: koordináta → képpont; m: lépték). */
function reszUt(r, X, Y, m) {
  const n = (v) => Number(v) || 0;
  switch (r.alak) {
    case "haromszog":
      return `M ${X(n(r.y1))} ${Y(n(r.z1))} L ${X(n(r.y2))} ${Y(n(r.z2))} L ${X(n(r.y3))} ${Y(n(r.z3))} Z`;
    case "kor": {
      const R = n(r.r) * m;
      const cx = X(n(r.y0));
      const cy = Y(n(r.z0));
      return `M ${cx - R} ${cy} A ${R} ${R} 0 1 0 ${cx + R} ${cy} A ${R} ${R} 0 1 0 ${cx - R} ${cy} Z`;
    }
    case "felkor": {
      const R = n(r.r) * m;
      const cx = X(n(r.y0));
      const cy = Y(n(r.z0));
      const ir = r.irany ?? "+z";
      // képernyő-irány: +y balra (−x), +z lefelé (+y)
      const d = ir === "+y" ? [-1, 0] : ir === "-y" ? [1, 0] : ir === "+z" ? [0, 1] : [0, -1];
      const p = [-d[1], d[0]];
      const e1 = [cx + R * p[0], cy + R * p[1]];
      const e2 = [cx - R * p[0], cy - R * p[1]];
      return `M ${e1[0]} ${e1[1]} A ${R} ${R} 0 0 0 ${e2[0]} ${e2[1]} Z`;
    }
    case "negyedkor": {
      const R = n(r.r) * m;
      const cx = X(n(r.y0));
      const cy = Y(n(r.z0));
      const ng = r.negyed ?? "+y+z";
      const sy = ng.startsWith("+") ? 1 : -1;
      const szj = ng.endsWith("+z") ? 1 : -1;
      const p1 = [cx - sy * R, cy];
      const p2 = [cx, cy + szj * R];
      const sweep = sy * szj < 0 ? 1 : 0;
      return `M ${cx} ${cy} L ${p1[0]} ${p1[1]} A ${R} ${R} 0 0 ${sweep} ${p2[0]} ${p2[1]} Z`;
    }
    default: {
      const b = n(r.b) * m;
      const h = n(r.h) * m;
      return `M ${X(n(r.y0))} ${Y(n(r.z0))} h ${-b} v ${h} h ${b} Z`;
    }
  }
}

const ELORE = {
  gyf4: {
    egyseg: "mm",
    reszek: [
      { alak: "teglalap", elojel: 1, b: 300, h: 30, y0: -150, z0: 0 },
      { alak: "teglalap", elojel: 1, b: 20, h: 270, y0: -10, z0: 30 },
    ],
  },
  gyf5: {
    egyseg: "mm",
    reszek: [
      { alak: "teglalap", elojel: 1, b: 300, h: 200, y0: 0, z0: 0 },
      { alak: "teglalap", elojel: -1, b: 40, h: 150, y0: 220, z0: 0 },
      { alak: "teglalap", elojel: -1, b: 180, h: 150, y0: 0, z0: 0 },
    ],
  },
  gyf6: {
    egyseg: "cm",
    reszek: [
      { alak: "teglalap", elojel: 1, b: 50, h: 50, y0: 0, z0: 0 },
      { alak: "negyedkor", elojel: -1, r: 50, y0: 50, z0: 50, negyed: "-y-z" },
      { alak: "negyedkor", elojel: 1, r: 50, y0: 0, z0: 50, negyed: "-y-z" },
    ],
  },
};

function ezres(ertek, tizedes = 0) {
  const s = sz(ertek, tizedes);
  const [egesz, tort] = s.split(",");
  const neg = egesz.startsWith("-");
  const szam = neg ? egesz.slice(1) : egesz;
  const tagolt = szam.replace(/\B(?=(\d{3})+(?!\d))/g, "\u202f");
  return (neg ? "−" : "") + tagolt + (tort ? "," + tort : "");
}

function Mezo({ cimke, ertek, onChange, szeles = "w-16" }) {
  return (
    <label className="flex items-center gap-1 text-[12px] text-petrol-600">
      <span className="szamok">{cimke}</span>
      <input
        type="number"
        value={ertek}
        onChange={(e) => onChange(e.target.value)}
        className={`${szeles} rounded-md border border-petrol-200 px-1.5 py-1 text-right text-[12.5px] text-petrol-900 focus:border-petrol-500 focus:outline-none`}
      />
    </label>
  );
}

export default function SulypontKalk() {
  const [egyseg, setEgyseg] = useState("mm");
  const [reszek, setReszek] = useState(ELORE.gyf5.reszek);
  const [eltol, setEltol] = useState({ nyitva: false, y0: "0", z0: "0" });

  const adatok = reszek.map((r) => ({ ...reszAdat(r), elojel: r.elojel }));
  const A = adatok.reduce((s, a) => s + a.elojel * a.A, 0);
  const Sy = adatok.reduce((s, a) => s + a.elojel * a.A * a.z, 0);
  const Sz = adatok.reduce((s, a) => s + a.elojel * a.A * a.y, 0);
  const van = Math.abs(A) > 1e-9;
  const ys = van ? Sz / A : 0;
  const zs = van ? Sy / A : 0;

  // origó eltolása: O″ helye az O′ rendszerben (y0; z0) → S_y″ = S_y′ − z0·A, S_z″ = S_z′ − y0·A
  const y0e = Number(eltol.y0) || 0;
  const z0e = Number(eltol.z0) || 0;
  const eltolva = eltol.nyitva && (y0e !== 0 || z0e !== 0);
  const Sy2 = Sy - z0e * A;
  const Sz2 = Sz - y0e * A;
  // „nulla”, ha a súlypont az O″-től 0,005 egységen belül van (a kerekített koordináták miatt)
  const nullaY = Math.abs(Sy2) < 0.0051 * Math.abs(A);
  const nullaZ = Math.abs(Sz2) < 0.0051 * Math.abs(A);
  const kerek = (v) => Math.round(v * 100) / 100;
  const tagK = (v) => `${v < 0 ? "+" : "-"} ${szK(Math.abs(v), Number.isInteger(v) ? 0 : 2)}`;

  // befoglaló doboz (az origót is beleértve)
  let yMin = 0, yMax = 0, zMin = 0, zMax = 0;
  adatok.forEach((a) => {
    yMin = Math.min(yMin, a.doboz[0]);
    yMax = Math.max(yMax, a.doboz[1]);
    zMin = Math.min(zMin, a.doboz[2]);
    zMax = Math.max(zMax, a.doboz[3]);
  });
  if (eltolva) {
    yMin = Math.min(yMin, y0e);
    yMax = Math.max(yMax, y0e);
    zMin = Math.min(zMin, z0e);
    zMax = Math.max(zMax, z0e);
  }
  const szel = Math.max(yMax - yMin, 1);
  const mag = Math.max(zMax - zMin, 1);
  const m = Math.min(330 / szel, 290 / mag);
  // az idom vízszintesen középre; y balra nő, ezért yMax a bal szél
  const bal = (SZ - szel * m) / 2 + 20;
  const ox = bal + yMax * m; // az origó képpont-x
  const oy = 60 + (290 - mag * m) / 2 - zMin * m;
  const X = (y) => ox - y * m;
  const Y = (z) => oy + z * m;

  const modosit = (i, mezo, ertek) =>
    setReszek((rs) => rs.map((r, j) => (j === i ? { ...r, [mezo]: ertek } : r)));
  const alakValt = (i, alak) => setReszek((rs) => rs.map((r, j) => (j === i ? { ...ujResz(alak), elojel: r.elojel } : r)));
  const betolt = (kulcs) => {
    setEgyseg(ELORE[kulcs].egyseg);
    setReszek(ELORE[kulcs].reszek);
  };

  const e2 = `${egyseg}²`;
  const e3 = `${egyseg}³`;

  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white">
      <div className="flex flex-wrap items-center gap-2 border-b border-[color:var(--keret)] bg-petrol-50/70 px-4 py-2.5">
        <span className="text-[12.5px] font-semibold text-petrol-800">Összetett síkidom súlypontja</span>
        <div className="ml-auto flex flex-wrap gap-1.5">
          {["gyf4", "gyf5", "gyf6"].map((k, i) => (
            <button key={k} type="button" onClick={() => betolt(k)} className="rounded-lg bg-white px-2.5 py-1 text-[12px] font-medium text-petrol-600 ring-1 ring-petrol-200 transition hover:bg-petrol-50">
              GYF‑{i + 4}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.1fr_1fr] [&>*]:min-w-0">
        <div className="racs-vilagos flex flex-col justify-center border-b border-[color:var(--keret)] p-3 lg:border-r lg:border-b-0">
          <svg viewBox={`0 0 ${SZ} ${MA}`} className="abra w-full select-none">
            <defs>
              <marker id="hegy-sk-t" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 1 L 9 5 L 0 9 z" fill="#475569" />
              </marker>
              <marker id="hegy-sk-l" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 1 L 9 5 L 0 9 z" fill="#7c3aed" />
              </marker>
              <pattern id="sk-vonalka" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="6" stroke="#be123c" strokeWidth="1" opacity="0.5" />
              </pattern>
            </defs>

            {/* pozitív részek */}
            {reszek.map((r, i) =>
              r.elojel > 0 ? <path key={i} d={reszUt(r, X, Y, m)} fill="#bcdce2" stroke="#234957" strokeWidth="1.4" opacity="0.9" /> : null,
            )}
            {/* negatív részek kivágják */}
            {reszek.map((r, i) =>
              r.elojel < 0 ? (
                <g key={i}>
                  <path d={reszUt(r, X, Y, m)} fill="white" stroke="none" />
                  <path d={reszUt(r, X, Y, m)} fill="url(#sk-vonalka)" stroke="#be123c" strokeWidth="1.2" strokeDasharray="4 3" />
                </g>
              ) : null,
            )}
            {/* részek súlypontjai */}
            {adatok.map((a, i) =>
              a.A > 0 ? (
                <g key={`s${i}`}>
                  <circle cx={X(a.y)} cy={Y(a.z)} r="3.4" fill={a.elojel > 0 ? SZINEK[i % SZINEK.length] : "#be123c"} stroke="white" strokeWidth="1.2" />
                  <text x={X(a.y) + 6} y={Y(a.z) - 5} fontSize="11" fontWeight="650" style={{ fill: a.elojel > 0 ? SZINEK[i % SZINEK.length] : "#be123c", paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
                    S{i + 1}
                  </text>
                </g>
              ) : null,
            )}

            <g opacity={eltolva ? 0.5 : 1}>
              <TengelyekYZ x={ox} y={oy} hossz={Math.max(50, yMax * m + 30)} zHossz={Math.max(50, zMax * m + 30)} id="hegy-sk-t" />
              <circle cx={ox} cy={oy} r="2.2" fill="#475569" />
              {eltolva && (
                <text x={ox + 6} y={oy - 6} fontSize="11" fontWeight="600" style={{ fill: "#475569" }}>O′</text>
              )}
            </g>

            {/* az eltolt O″ rendszer */}
            {eltolva && (
              <g>
                <line x1={X(y0e)} y1={Y(z0e)} x2={X(y0e) - 80} y2={Y(z0e)} stroke="#7c3aed" strokeWidth="1.6" markerEnd="url(#hegy-sk-l)" />
                <line x1={X(y0e)} y1={Y(z0e)} x2={X(y0e)} y2={Y(z0e) + 80} stroke="#7c3aed" strokeWidth="1.6" markerEnd="url(#hegy-sk-l)" />
                <text x={X(y0e) - 86} y={Y(z0e) + 4} textAnchor="end" fontSize="11.5" fontStyle="italic" fontWeight="600" style={{ fill: "#7c3aed", paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>y″</text>
                <text x={X(y0e) + 5} y={Y(z0e) + 90} fontSize="11.5" fontStyle="italic" fontWeight="600" style={{ fill: "#7c3aed", paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>z″</text>
                <circle cx={X(y0e)} cy={Y(z0e)} r="4.5" fill="white" stroke="#7c3aed" strokeWidth="2" />
                <text x={X(y0e) + 8} y={Y(z0e) + 19} fontSize="11" fontWeight="650" style={{ fill: "#7c3aed", paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
                  O″ ({sz(y0e, Number.isInteger(y0e) ? 0 : 2)}; {sz(z0e, Number.isInteger(z0e) ? 0 : 2)})
                </text>
              </g>
            )}

            {van && (
              <>
                <line x1={X(ys)} y1={oy} x2={X(ys)} y2={Y(zs)} stroke="#e2590a" strokeWidth="1" strokeDasharray="4 3" opacity="0.7" />
                <line x1={ox} y1={Y(zs)} x2={X(ys)} y2={Y(zs)} stroke="#e2590a" strokeWidth="1" strokeDasharray="4 3" opacity="0.7" />
                <SJel x={X(ys)} y={Y(zs)} dx={10} dy={-9} />
              </>
            )}
          </svg>
          <p className="mt-1 text-center text-[11.5px] text-petrol-400">
            y balra, z lefelé. A kivont (−) részek vonalkázva. Az egység csak a feliratokat érinti.
            {eltolva ? " A lila O″ az eltolt rendszer — a súlypont ugyanott van." : ""}
          </p>
        </div>

        <div className="p-4 sm:p-5">
          <div className="mb-3 flex items-center gap-2 text-[12px] text-petrol-600">
            <span>Mértékegység:</span>
            {["mm", "cm"].map((e) => (
              <button key={e} type="button" onClick={() => setEgyseg(e)} className={`rounded-md px-2 py-0.5 font-medium ${egyseg === e ? "bg-petrol-700 text-white" : "bg-white text-petrol-600 ring-1 ring-petrol-200"}`}>
                {e}
              </button>
            ))}
          </div>

          <div className="finom-gorgeto max-h-[340px] space-y-2 overflow-y-auto pr-1">
            {reszek.map((r, i) => (
              <div key={i} className="rounded-xl border border-petrol-100 bg-petrol-50/60 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: r.elojel > 0 ? SZINEK[i % SZINEK.length] : "#be123c" }} />
                  <span className="text-[12.5px] font-semibold text-petrol-800">{i + 1}. rész</span>
                  <select value={r.alak} onChange={(e) => alakValt(i, e.target.value)} className="rounded-md border border-petrol-200 bg-white px-1.5 py-1 text-[12px] text-petrol-800">
                    {ALAKOK.map(([k, c]) => (
                      <option key={k} value={k}>{c}</option>
                    ))}
                  </select>
                  <select value={r.elojel} onChange={(e) => modosit(i, "elojel", Number(e.target.value))} className="rounded-md border border-petrol-200 bg-white px-1.5 py-1 text-[12px] text-petrol-800">
                    <option value={1}>+ hozzáadott</option>
                    <option value={-1}>− kivont</option>
                  </select>
                </div>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1.5">
                  {r.alak === "teglalap" && (
                    <>
                      <Mezo cimke="b =" ertek={r.b} onChange={(v) => modosit(i, "b", v)} />
                      <Mezo cimke="h =" ertek={r.h} onChange={(v) => modosit(i, "h", v)} />
                      <Mezo cimke="y₀ =" ertek={r.y0} onChange={(v) => modosit(i, "y0", v)} />
                      <Mezo cimke="z₀ =" ertek={r.z0} onChange={(v) => modosit(i, "z0", v)} />
                      <span className="w-full text-[11px] text-petrol-400">(y₀, z₀): a téglalap jobb felső sarka</span>
                    </>
                  )}
                  {r.alak === "haromszog" && (
                    <>
                      {[1, 2, 3].map((k) => (
                        <span key={k} className="flex gap-1.5">
                          <Mezo cimke={`y${["₁", "₂", "₃"][k - 1]} =`} ertek={r[`y${k}`]} onChange={(v) => modosit(i, `y${k}`, v)} szeles="w-14" />
                          <Mezo cimke={`z${["₁", "₂", "₃"][k - 1]} =`} ertek={r[`z${k}`]} onChange={(v) => modosit(i, `z${k}`, v)} szeles="w-14" />
                        </span>
                      ))}
                      <span className="w-full text-[11px] text-petrol-400">a három csúcs koordinátái; S a csúcsok átlaga</span>
                    </>
                  )}
                  {r.alak === "kor" && (
                    <>
                      <Mezo cimke="r =" ertek={r.r} onChange={(v) => modosit(i, "r", v)} />
                      <Mezo cimke="y₀ =" ertek={r.y0} onChange={(v) => modosit(i, "y0", v)} />
                      <Mezo cimke="z₀ =" ertek={r.z0} onChange={(v) => modosit(i, "z0", v)} />
                      <span className="w-full text-[11px] text-petrol-400">(y₀, z₀): a középpont</span>
                    </>
                  )}
                  {r.alak === "felkor" && (
                    <>
                      <Mezo cimke="r =" ertek={r.r} onChange={(v) => modosit(i, "r", v)} />
                      <Mezo cimke="y₀ =" ertek={r.y0} onChange={(v) => modosit(i, "y0", v)} />
                      <Mezo cimke="z₀ =" ertek={r.z0} onChange={(v) => modosit(i, "z0", v)} />
                      <select value={r.irany} onChange={(e) => modosit(i, "irany", e.target.value)} className="rounded-md border border-petrol-200 bg-white px-1.5 py-1 text-[12px] text-petrol-800">
                        {IRANYOK.map(([k, c]) => (
                          <option key={k} value={k}>domború {c}</option>
                        ))}
                      </select>
                      <span className="w-full text-[11px] text-petrol-400">(y₀, z₀): az átmérő felezőpontja</span>
                    </>
                  )}
                  {r.alak === "negyedkor" && (
                    <>
                      <Mezo cimke="r =" ertek={r.r} onChange={(v) => modosit(i, "r", v)} />
                      <Mezo cimke="y₀ =" ertek={r.y0} onChange={(v) => modosit(i, "y0", v)} />
                      <Mezo cimke="z₀ =" ertek={r.z0} onChange={(v) => modosit(i, "z0", v)} />
                      <select value={r.negyed} onChange={(e) => modosit(i, "negyed", e.target.value)} className="rounded-md border border-petrol-200 bg-white px-1.5 py-1 text-[12px] text-petrol-800">
                        {NEGYEDEK.map(([k, c]) => (
                          <option key={k} value={k}>{c}</option>
                        ))}
                      </select>
                      <span className="w-full text-[11px] text-petrol-400">(y₀, z₀): a kör középpontja (a derékszögű csúcs); a negyed iránya a középponttól</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 flex gap-2">
            <button type="button" onClick={() => setReszek((rs) => [...rs, ujResz()])} className="rounded-lg bg-white px-3 py-1.5 text-[12.5px] font-medium text-petrol-700 ring-1 ring-petrol-200 transition hover:bg-petrol-50">+ Rész</button>
            <button type="button" onClick={() => setReszek((rs) => (rs.length > 1 ? rs.slice(0, -1) : rs))} className="rounded-lg bg-white px-3 py-1.5 text-[12.5px] font-medium text-petrol-700 ring-1 ring-petrol-200 transition hover:bg-petrol-50">− Rész</button>
          </div>

          <div className="mt-4 overflow-x-auto rounded-xl bg-petrol-50 p-3">
            <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">Táblázat</p>
            <table className="szamok mt-1.5 w-full text-[12px] text-petrol-800">
              <thead>
                <tr className="text-[10.5px] tracking-wider text-petrol-500 uppercase">
                  <th className="py-1 text-left font-semibold">Rész</th>
                  <th className="py-1 text-right font-semibold">±Aᵢ [{e2}]</th>
                  <th className="py-1 text-right font-semibold">yᵢ</th>
                  <th className="py-1 text-right font-semibold">zᵢ</th>
                  <th className="py-1 text-right font-semibold">±Aᵢyᵢ</th>
                  <th className="py-1 text-right font-semibold">±Aᵢzᵢ</th>
                </tr>
              </thead>
              <tbody>
                {adatok.map((a, i) => (
                  <tr key={i} className="border-t border-petrol-200/70">
                    <td className="py-1 font-semibold" style={{ color: a.elojel > 0 ? SZINEK[i % SZINEK.length] : "#be123c" }}>
                      {i + 1}. ({a.elojel > 0 ? "+" : "−"})
                    </td>
                    <td className="py-1 text-right">{ezres(a.elojel * a.A, 1)}</td>
                    <td className="py-1 text-right">{sz(a.y, 2)}</td>
                    <td className="py-1 text-right">{sz(a.z, 2)}</td>
                    <td className="py-1 text-right">{ezres(a.elojel * a.A * a.y)}</td>
                    <td className="py-1 text-right">{ezres(a.elojel * a.A * a.z)}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-petrol-300 font-semibold text-petrol-900">
                  <td className="py-1">Σ</td>
                  <td className="py-1 text-right">{ezres(A, 1)}</td>
                  <td className="py-1 text-right">–</td>
                  <td className="py-1 text-right">–</td>
                  <td className="py-1 text-right">{ezres(Sz)}</td>
                  <td className="py-1 text-right">{ezres(Sy)}</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-1.5 text-[11px] text-petrol-500">
              Sz = Σ Aᵢyᵢ [{e3}] a z tengelyre, Sy = Σ Aᵢzᵢ [{e3}] az y tengelyre.
            </p>
          </div>

          <div className="mt-3 rounded-xl border border-naracs-200 bg-naracs-50 px-4 py-3">
            <p className="text-[10.5px] font-bold tracking-[0.16em] text-naracs-700 uppercase">A súlypont</p>
            {van ? (
              <div className="szamok mt-1 space-y-1 text-[13.5px] text-petrol-900">
                <div><M>{`y_S = \\frac{S_z}{A} = \\frac{${szK(Sz, 0)}}{${szK(A, 1)}} = ${szK(ys, 2)}\\ \\text{${egyseg}}`}</M></div>
                <div><M>{`z_S = \\frac{S_y}{A} = \\frac{${szK(Sy, 0)}}{${szK(A, 1)}} = ${szK(zs, 2)}\\ \\text{${egyseg}}`}</M></div>
              </div>
            ) : (
              <p className="mt-1 text-[13px] text-petrol-700">Az összterület nulla — így nincs súlypont. Ellenőrizd az előjeleket.</p>
            )}
          </div>

          {/* origó eltolása – a 4.3 eltolási szabálya */}
          <div className={`mt-3 rounded-xl border px-4 py-3 ${eltolva ? "border-violet-200 bg-violet-50" : "border-petrol-100 bg-petrol-50/60"}`}>
            <div className="flex flex-wrap items-center gap-2">
              <p className={`text-[10.5px] font-bold tracking-[0.16em] uppercase ${eltolva ? "text-violet-800" : "text-petrol-500"}`}>Origó eltolása</p>
              <button
                type="button"
                onClick={() => setEltol((e) => ({ ...e, nyitva: !e.nyitva }))}
                className="ml-auto rounded-md bg-white px-2 py-0.5 text-[11.5px] font-medium text-petrol-600 ring-1 ring-petrol-200 transition hover:bg-petrol-50"
              >
                {eltol.nyitva ? "elrejt" : "megnyit"}
              </button>
            </div>
            {eltol.nyitva && (
              <>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  <Mezo cimke="y₀ =" ertek={eltol.y0} onChange={(v) => setEltol((e) => ({ ...e, y0: v }))} />
                  <Mezo cimke="z₀ =" ertek={eltol.z0} onChange={(v) => setEltol((e) => ({ ...e, z0: v }))} />
                  <button
                    type="button"
                    disabled={!van}
                    onClick={() => setEltol((e) => ({ ...e, y0: String(kerek(ys)), z0: String(kerek(zs)) }))}
                    className="rounded-md bg-naracs-500 px-2.5 py-1 text-[11.5px] font-semibold text-white transition hover:bg-naracs-600 disabled:opacity-40"
                  >
                    a súlypontba
                  </button>
                  <button type="button" onClick={() => setEltol((e) => ({ ...e, y0: "0", z0: "0" }))} className="rounded-md bg-white px-2.5 py-1 text-[11.5px] font-medium text-petrol-600 ring-1 ring-petrol-200 transition hover:bg-petrol-50">
                    vissza
                  </button>
                  <span className="w-full text-[11px] text-petrol-400">(y₀, z₀): az új O″ origó helye a mostani rendszerben — a részek adatait nem kell átírni</span>
                </div>
                {van && (
                  <div className="szamok mt-2 space-y-1 text-[13px] text-petrol-900">
                    <div><M>{`S_{y''} = S_{y'} - z_0 A = ${szK(Sy, 0)} ${tagK(z0e)}\\cdot ${szK(A, 1)} = ${nullaY ? "0" : szK(Sy2, 0)}\\ \\text{${e3}}`}</M></div>
                    <div><M>{`S_{z''} = S_{z'} - y_0 A = ${szK(Sz, 0)} ${tagK(y0e)}\\cdot ${szK(A, 1)} = ${nullaZ ? "0" : szK(Sz2, 0)}\\ \\text{${e3}}`}</M></div>
                    <div><M>{`z_S'' = z_S' - z_0 = ${szK(zs - z0e, 2)},\\quad y_S'' = y_S' - y_0 = ${szK(ys - y0e, 2)}\\ \\text{${egyseg}}`}</M></div>
                    <p className="mt-1 text-[12px] text-petrol-600">
                      {nullaY && nullaZ
                        ? "Az origó a súlypontban: mindkét statikai nyomaték nulla — ez a súlyponti koordináta-rendszer."
                        : "A statikai nyomaték az eltolás × terület szorzatával változik; a súlypont a rajzon nem mozdul, csak a koordinátái mások."}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
