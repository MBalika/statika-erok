"use client";

import { useState } from "react";
import { Csuszka } from "./ErovektorBonto";
import { TengelyekYZ, SJel } from "./SulypontAbrak";
import { sz, szK } from "@/lib/szamok";
import { M } from "@/components/ui/Keplet";

const SZ = 560;
const MA = 420;
const RAJZ = 300; // a szelvény legfeljebb ekkora (képpont)
const SZINEK = ["#bcdce2", "#fed7aa", "#bbf7d0", "#ddd6fe", "#fecaca"];
const SZINEK_SOTET = ["#275767", "#bc4508", "#15803d", "#6d28d9", "#be123c"];

const TIPUSOK = [
  ["T", "T"],
  ["fT", "Fordított T"],
  ["L", "L"],
  ["U", "U"],
  ["I", "I"],
];

/** Ezres tagolás vékony szóközzel, magyar tizedesvesszővel. */
function ezres(ertek, tizedes = 0) {
  const s = sz(ertek, tizedes);
  const [egesz, tort] = s.split(",");
  const neg = egesz.startsWith("-");
  const szam = neg ? egesz.slice(1) : egesz;
  const tagolt = szam.replace(/\B(?=(\d{3})+(?!\d))/g, "\u202f");
  return (neg ? "−" : "") + tagolt + (tort ? "," + tort : "");
}

/** A szelvény téglalapjai: y0 a rész jobb széle (az origótól balra mérve), z0 a felső éle. */
function reszek(tipus, B, H, tf, tw) {
  const gerincY = (B - tw) / 2;
  switch (tipus) {
    case "T":
      return [
        { nev: "öv", y0: 0, z0: 0, b: B, h: tf },
        { nev: "gerinc", y0: gerincY, z0: tf, b: tw, h: H - tf },
      ];
    case "fT":
      return [
        { nev: "gerinc", y0: gerincY, z0: 0, b: tw, h: H - tf },
        { nev: "öv", y0: 0, z0: H - tf, b: B, h: tf },
      ];
    case "L":
      return [
        { nev: "függőleges szár", y0: B - tw, z0: 0, b: tw, h: H - tf },
        { nev: "vízszintes szár", y0: 0, z0: H - tf, b: B, h: tf },
      ];
    case "U":
      return [
        { nev: "bal szár", y0: B - tw, z0: 0, b: tw, h: H - tf },
        { nev: "jobb szár", y0: 0, z0: 0, b: tw, h: H - tf },
        { nev: "alsó öv", y0: 0, z0: H - tf, b: B, h: tf },
      ];
    case "I":
    default:
      return [
        { nev: "felső öv", y0: 0, z0: 0, b: B, h: tf },
        { nev: "gerinc", y0: gerincY, z0: tf, b: tw, h: H - 2 * tf },
        { nev: "alsó öv", y0: 0, z0: H - tf, b: B, h: tf },
      ];
  }
}

export default function SzelvenyFelfedezo() {
  const [tipus, setTipus] = useState("T");
  const [B, setB] = useState(300);
  const [H, setH] = useState(300);
  const [tf, setTf] = useState(30);
  const [tw, setTw] = useState(20);

  const tfK = Math.min(tf, tipus === "I" ? H / 2 - 5 : H - 5);
  const twK = Math.min(tw, tipus === "U" ? B / 2 - 5 : B - 5); // U-nál a két szár nem érhet össze
  const r = reszek(tipus, B, H, tfK, twK).map((p) => ({
    ...p,
    A: p.b * p.h,
    y: p.y0 + p.b / 2,
    z: p.z0 + p.h / 2,
  }));
  const A = r.reduce((s, p) => s + p.A, 0);
  const Sy = r.reduce((s, p) => s + p.A * p.z, 0); // az y tengelyre: z távolságokkal
  const Sz = r.reduce((s, p) => s + p.A * p.y, 0); // a z tengelyre: y távolságokkal
  const ys = Sz / A;
  const zs = Sy / A;

  const m = RAJZ / Math.max(B, H);
  const ox = 130 + RAJZ; // az origó: a szelvény jobb felső sarka
  const oy = 60;
  const X = (y) => ox - y * m;
  const Y = (z) => oy + z * m;

  const szimm = tipus !== "L" && tipus !== "U" ? "y" : null;

  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white">
      <div className="flex flex-wrap items-center gap-2 border-b border-[color:var(--keret)] bg-petrol-50/70 px-4 py-2.5">
        <span className="text-[12.5px] font-semibold text-petrol-800">Szelvény súlypontja</span>
        <div className="ml-auto flex gap-1 rounded-lg bg-white p-0.5 ring-1 ring-petrol-200">
          {TIPUSOK.map(([ertek, cimke]) => (
            <button
              key={ertek}
              type="button"
              onClick={() => setTipus(ertek)}
              className={`rounded-md px-2.5 py-1 text-[12px] font-medium transition ${
                tipus === ertek ? "bg-petrol-700 text-white" : "text-petrol-600 hover:bg-petrol-50"
              }`}
            >
              {cimke}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.2fr_1fr] [&>*]:min-w-0">
        <div className="racs-vilagos flex flex-col justify-center border-b border-[color:var(--keret)] p-3 lg:border-r lg:border-b-0">
          <svg viewBox={`0 0 ${SZ} ${MA}`} className="abra w-full select-none">
            <defs>
              <marker id="hegy-szf" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 1 L 9 5 L 0 9 z" fill="#94a3b8" />
              </marker>
              <marker id="hegy-szf-t" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 1 L 9 5 L 0 9 z" fill="#475569" />
              </marker>
            </defs>

            {/* részek */}
            {r.map((p, i) => (
              <g key={i}>
                <rect x={X(p.y0 + p.b)} y={Y(p.z0)} width={p.b * m} height={p.h * m} fill={SZINEK[i % SZINEK.length]} stroke="#234957" strokeWidth="1.4" opacity="0.92" />
              </g>
            ))}
            {r.map((p, i) => (
              <g key={`c${i}`}>
                <circle cx={X(p.y)} cy={Y(p.z)} r="3.6" fill={SZINEK_SOTET[i % SZINEK_SOTET.length]} stroke="white" strokeWidth="1.2" />
                <text
                  x={X(p.y) + 7}
                  y={Y(p.z) - 6}
                  fontSize="11.5"
                  fontWeight="650"
                  style={{ fill: SZINEK_SOTET[i % SZINEK_SOTET.length], paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}
                >
                  A{i + 1}
                </text>
              </g>
            ))}

            {/* tengelyek az origóból (jobb felső sarok) */}
            <TengelyekYZ x={ox} y={oy} hossz={B * m + 34} zHossz={H * m + 34} id="hegy-szf-t" />

            {/* fő méretek */}
            <line x1={X(B)} y1={oy - 22} x2={X(0)} y2={oy - 22} stroke="#94a3b8" strokeWidth="1" markerStart="url(#hegy-szf)" markerEnd="url(#hegy-szf)" />
            <text x={X(B / 2)} y={oy - 27} textAnchor="middle" fontSize="11.5" fill="#64748b">B = {B} mm</text>
            <line x1={X(B) - 22} y1={Y(0)} x2={X(B) - 22} y2={Y(H)} stroke="#94a3b8" strokeWidth="1" markerStart="url(#hegy-szf)" markerEnd="url(#hegy-szf)" />
            <text x={X(B) - 28} y={Y(H / 2) + 4} textAnchor="end" fontSize="11.5" fill="#64748b">H = {H}</text>

            {/* a súlypont helye */}
            <line x1={X(ys)} y1={oy - 6} x2={X(ys)} y2={Y(H) + 6} stroke="#e2590a" strokeWidth="1" strokeDasharray="4 3" opacity="0.7" />
            <line x1={X(0) + 6} y1={Y(zs)} x2={X(B) - 6} y2={Y(zs)} stroke="#e2590a" strokeWidth="1" strokeDasharray="4 3" opacity="0.7" />
            <line x1={X(0)} y1={Y(H) + 24} x2={X(ys)} y2={Y(H) + 24} stroke="#e2590a" strokeWidth="1.1" markerStart="url(#hegy-szf)" markerEnd="url(#hegy-szf)" />
            <text x={X(ys / 2)} y={Y(H) + 38} textAnchor="middle" fontSize="11.5" fontWeight="650" style={{ fill: "#e2590a", paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
              yₛ = {sz(ys, 1)}
            </text>
            <line x1={X(0) + 26} y1={Y(0)} x2={X(0) + 26} y2={Y(zs)} stroke="#e2590a" strokeWidth="1.1" markerStart="url(#hegy-szf)" markerEnd="url(#hegy-szf)" />
            <text x={X(0) + 32} y={Y(zs / 2) + 4} fontSize="11.5" fontWeight="650" style={{ fill: "#e2590a", paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
              zₛ = {sz(zs, 1)}
            </text>
            <SJel x={X(ys)} y={Y(zs)} dx={10} dy={-9} />
          </svg>
          <p className="mt-1 text-center text-[11.5px] text-petrol-400">
            Az origó a szelvény jobb felső sarka; y balra, z lefelé. A méretek mm-ben.
          </p>
        </div>

        <div className="p-4 sm:p-5">
          <div className="space-y-3.5">
            <Csuszka cimke="Szélesség, B" ertek={B} egyseg="mm" min={60} max={400} lepes={10} tizedes={0} onChange={setB} />
            <Csuszka cimke="Magasság, H" ertek={H} egyseg="mm" min={60} max={400} lepes={10} tizedes={0} onChange={setH} />
            <Csuszka cimke={tipus === "L" || tipus === "U" ? "Vízszintes szár vastagsága, t" : "Övvastagság, t"} ertek={tfK} egyseg="mm" min={5} max={100} lepes={5} tizedes={0} onChange={setTf} />
            <Csuszka cimke={tipus === "L" || tipus === "U" ? "Függőleges szár vastagsága, v" : "Gerincvastagság, v"} ertek={twK} egyseg="mm" min={5} max={100} lepes={5} tizedes={0} onChange={setTw} />
          </div>

          <div className="mt-4 overflow-x-auto rounded-xl bg-petrol-50 p-3">
            <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">Részek</p>
            <table className="szamok mt-1.5 w-full text-[12px] text-petrol-800">
              <thead>
                <tr className="text-[10.5px] tracking-wider text-petrol-500 uppercase">
                  <th className="py-1 text-left font-semibold">Rész</th>
                  <th className="py-1 text-right font-semibold">Aᵢ [mm²]</th>
                  <th className="py-1 text-right font-semibold">yᵢ</th>
                  <th className="py-1 text-right font-semibold">zᵢ</th>
                  <th className="py-1 text-right font-semibold">Aᵢ·yᵢ</th>
                  <th className="py-1 text-right font-semibold">Aᵢ·zᵢ</th>
                </tr>
              </thead>
              <tbody>
                {r.map((p, i) => (
                  <tr key={i} className="border-t border-petrol-200/70">
                    <td className="py-1 font-semibold" style={{ color: SZINEK_SOTET[i % SZINEK_SOTET.length] }}>
                      A{i + 1} <span className="font-normal text-petrol-500">({p.nev})</span>
                    </td>
                    <td className="py-1 text-right">{ezres(p.A)}</td>
                    <td className="py-1 text-right">{sz(p.y, 1)}</td>
                    <td className="py-1 text-right">{sz(p.z, 1)}</td>
                    <td className="py-1 text-right">{ezres(p.A * p.y)}</td>
                    <td className="py-1 text-right">{ezres(p.A * p.z)}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-petrol-300 font-semibold text-petrol-900">
                  <td className="py-1">Σ</td>
                  <td className="py-1 text-right">{ezres(A)}</td>
                  <td className="py-1 text-right">–</td>
                  <td className="py-1 text-right">–</td>
                  <td className="py-1 text-right">{ezres(Sz)}</td>
                  <td className="py-1 text-right">{ezres(Sy)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-3 rounded-xl border border-naracs-200 bg-naracs-50 px-4 py-3">
            <p className="text-[10.5px] font-bold tracking-[0.16em] text-naracs-700 uppercase">A súlypont</p>
            <div className="szamok mt-1 space-y-1 text-[13.5px] text-petrol-900">
              <div>
                <M>{`z_S = \\frac{S_y}{A} = \\frac{${ezres(Sy).replace(/\u202f/g, "\\,")}}{${ezres(A).replace(/\u202f/g, "\\,")}} = ${szK(zs, 2)}\\ \\text{mm}`}</M>
              </div>
              <div>
                {szimm ? (
                  <M>{`y_S = \\frac{B}{2} = ${szK(ys, 2)}\\ \\text{mm}\\quad(\\text{szimmetria})`}</M>
                ) : (
                  <M>{`y_S = \\frac{S_z}{A} = \\frac{${ezres(Sz).replace(/\u202f/g, "\\,")}}{${ezres(A).replace(/\u202f/g, "\\,")}} = ${szK(ys, 2)}\\ \\text{mm}`}</M>
                )}
              </div>
            </div>
            <p className="mt-1.5 text-[12.5px] text-petrol-600">
              {tipus === "L" || tipus === "U"
                ? "Figyeld meg: a súlypont az anyagon kívülre is eshet — akkor is a súlypont."
                : "A függőleges szimmetriatengelyen a súlypont mindig rajta van, ezért yₛ-t nem kell számolni."}
            </p>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            <button type="button" onClick={() => { setTipus("T"); setB(300); setH(300); setTf(30); setTw(20); }} className="rounded-lg bg-white px-2.5 py-1.5 text-[12px] font-medium text-petrol-600 ring-1 ring-petrol-200 transition hover:bg-petrol-50">GYF‑4 adatai</button>
            <button type="button" onClick={() => { setTipus("I"); setB(200); setH(400); setTf(20); setTw(10); }} className="rounded-lg bg-white px-2.5 py-1.5 text-[12px] font-medium text-petrol-600 ring-1 ring-petrol-200 transition hover:bg-petrol-50">Karcsú I</button>
            <button type="button" onClick={() => { setTipus("L"); setB(200); setH(300); setTf(30); setTw(30); }} className="rounded-lg bg-white px-2.5 py-1.5 text-[12px] font-medium text-petrol-600 ring-1 ring-petrol-200 transition hover:bg-petrol-50">Szögvas</button>
          </div>
        </div>
      </div>
    </div>
  );
}
