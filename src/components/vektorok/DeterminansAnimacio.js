"use client";

import { useEffect, useState } from "react";
import { M, MB } from "@/components/ui/Keplet";
import { szK } from "@/lib/szamok";

const POZ = "#15803d";
const NEG = "#be123c";

/*
 * A 3×3 determináns (Sarrus-szabály) lépésenként:
 *   | i   j   k  |
 *   | ax  ay  az |
 *   | bx  by  bz |
 * Jobbra-lefelé átlók (pozitív): i·ay·bz, j·az·bx, k·ax·by
 * Balra-lefelé átlók (negatív): k·ay·bx, i·az·by, j·ax·bz
 */
const CELLAK = [
  ["i", "j", "k"],
  ["a_x", "a_y", "a_z"],
  ["b_x", "b_y", "b_z"],
];

// Minden lépés: a kiemelt cellák [sor, oszlop] listája, előjel, és a képlethez adott tag
const LEPESEK = [
  { cellak: [[0, 0], [1, 1], [2, 2]], elojel: 1, tag: "a_y b_z\\,\\underline{i}", szo: "\\underline{i}\\,a_y b_z" },
  { cellak: [[0, 1], [1, 2], [2, 0]], elojel: 1, tag: "a_z b_x\\,\\underline{j}", szo: "\\underline{j}\\,a_z b_x" },
  { cellak: [[0, 2], [1, 0], [2, 1]], elojel: 1, tag: "a_x b_y\\,\\underline{k}", szo: "\\underline{k}\\,a_x b_y" },
  { cellak: [[0, 2], [1, 1], [2, 0]], elojel: -1, tag: "a_y b_x\\,\\underline{k}", szo: "\\underline{k}\\,a_y b_x" },
  { cellak: [[0, 0], [1, 2], [2, 1]], elojel: -1, tag: "a_z b_y\\,\\underline{i}", szo: "\\underline{i}\\,a_z b_y" },
  { cellak: [[0, 1], [1, 0], [2, 2]], elojel: -1, tag: "a_x b_z\\,\\underline{j}", szo: "\\underline{j}\\,a_x b_z" },
];

const SZ = 300;
const CX = [60, 150, 240];
const CY = [50, 115, 180];

function kepletEddig(n) {
  if (n === 0) return "\\underline{a}\\times\\underline{b} = \\ ?";
  const tagok = LEPESEK.slice(0, n).map((l, i) => {
    const jel = l.elojel > 0 ? (i === 0 ? "" : "+") : "-";
    return `${jel}${l.tag}`;
  });
  return `\\underline{a}\\times\\underline{b} = ${tagok.join(" ")}${n < LEPESEK.length ? "\\ \\dots" : ""}`;
}

function Mezo({ cimke, ertek, onChange }) {
  return (
    <label className="flex items-center gap-1.5 text-[12.5px] text-petrol-600">
      <span className="szamok w-6 text-right">{cimke}</span>
      <input
        type="number"
        step="any"
        value={ertek}
        onChange={(e) => onChange(e.target.value)}
        className="szamok w-16 rounded-md border border-petrol-200 bg-white px-1.5 py-1 text-right text-[13px] text-petrol-900 focus:border-naracs-400 focus:outline-none"
      />
    </label>
  );
}

export default function DeterminansAnimacio() {
  const [lepes, setLepes] = useState(0); // 0..6
  const [auto, setAuto] = useState(false);
  const [av, setAv] = useState({ x: "1", y: "2", z: "3" });
  const [bv, setBv] = useState({ x: "4", y: "5", z: "6" });

  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => {
      setLepes((l) => {
        if (l >= LEPESEK.length) {
          setAuto(false);
          return l;
        }
        return l + 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [auto]);

  const aktiv = lepes > 0 ? LEPESEK[lepes - 1] : null;
  const szinLepes = (l) => (l.elojel > 0 ? POZ : NEG);

  // melyik cella melyik lépéssel kiemelt (az aktuálisnál csak az aktív; a régiek halványan)
  const cellaAllapot = (s, o) => {
    if (aktiv && aktiv.cellak.some(([r, c]) => r === s && c === o)) return { szin: szinLepes(aktiv), eros: true };
    return null;
  };

  // a számpélda
  const n = (v) => {
    const x = parseFloat(String(v).replace(",", "."));
    return Number.isFinite(x) ? x : 0;
  };
  const a = { x: n(av.x), y: n(av.y), z: n(av.z) };
  const b = { x: n(bv.x), y: n(bv.y), z: n(bv.z) };
  const c = {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
  const f = (v) => szK(v, Number.isInteger(v) ? 0 : 3);
  const zar = (v) => (v < 0 ? `(${f(v)})` : f(v));

  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white">
      <div className="grid lg:grid-cols-[1fr_1.1fr]">
        {/* ---- bal: a determináns ---- */}
        <div className="racs-vilagos border-b border-[color:var(--keret)] p-3 lg:border-r lg:border-b-0">
          <svg viewBox={`0 0 ${SZ} 215`} className="abra mx-auto w-full max-w-[360px] select-none">
            {/* determináns oldalvonalai */}
            <line x1="22" y1="22" x2="22" y2="205" stroke="#1d3c48" strokeWidth="1.6" />
            <line x1={SZ - 22} y1="22" x2={SZ - 22} y2="205" stroke="#1d3c48" strokeWidth="1.6" />

            {/* átló-vonalak az aktív lépéshez (körbefutó: a szélen átlép a másik oldalra) */}
            {aktiv &&
              (() => {
                const pts = aktiv.cellak.map(([s, o]) => ({ x: CX[o], y: CY[s] }));
                const szin = szinLepes(aktiv);
                // ha az oszlopindexek nem monoton (átlépés a szélen), a szakaszokat külön rajzoljuk
                const szak = [];
                for (let i = 0; i < pts.length - 1; i++) {
                  const o1 = aktiv.cellak[i][1];
                  const o2 = aktiv.cellak[i + 1][1];
                  const atlep = Math.abs(o2 - o1) > 1;
                  if (!atlep) {
                    szak.push([pts[i], pts[i + 1]]);
                  } else {
                    // kilép a szélen, belép a másik oldalon
                    const irany = aktiv.elojel > 0 ? 1 : -1; // jobbra-lefelé vagy balra-lefelé
                    const kx = irany > 0 ? SZ - 30 : 30;
                    const bx = irany > 0 ? 30 : SZ - 30;
                    const ky = (pts[i].y + pts[i + 1].y) / 2;
                    szak.push([pts[i], { x: kx, y: ky }]);
                    szak.push([{ x: bx, y: ky }, pts[i + 1]]);
                  }
                }
                return (
                  <g key={lepes}>
                    {szak.map(([p, q], i) => (
                      <line
                        key={i}
                        x1={p.x}
                        y1={p.y}
                        x2={q.x}
                        y2={q.y}
                        stroke={szin}
                        strokeWidth="3"
                        strokeLinecap="round"
                        opacity="0.55"
                        strokeDasharray="200"
                        strokeDashoffset="200"
                        style={{ animation: "det-huz 0.5s ease forwards" }}
                      />
                    ))}
                  </g>
                );
              })()}

            {/* cellák */}
            {CELLAK.map((sor, s) =>
              sor.map((c2, o) => {
                const all = cellaAllapot(s, o);
                return (
                  <g key={`${s}${o}`} style={{ transition: "opacity 0.3s" }}>
                    <circle
                      cx={CX[o]}
                      cy={CY[s]}
                      r="19"
                      fill={all ? all.szin : "white"}
                      fillOpacity={all ? 0.18 : 0.9}
                      stroke={all ? all.szin : "#cbd5e1"}
                      strokeWidth={all ? 2.2 : 1}
                      style={{ transition: "fill 0.3s, stroke 0.3s" }}
                    />
                    <text
                      x={CX[o]}
                      y={CY[s] + 5}
                      textAnchor="middle"
                     
                      fontStyle="italic"
                      fontWeight={all ? 700 : 500}
                      style={{ fontSize: 15, fill: all ? all.szin : "#1d3c48" }}
                    >
                      {c2[0]}
                      {s > 0 && (
                        <tspan style={{ fontSize: 10 }} dy="4">
                          {c2.slice(2)}
                        </tspan>
                      )}
                    </text>
                    {s === 0 && (
                      <line x1={CX[o] - 5} y1={CY[s] + 9} x2={CX[o] + 5} y2={CY[s] + 9} stroke={all ? all.szin : "#1d3c48"} strokeWidth="1.1" />
                    )}
                  </g>
                );
              }),
            )}
            <style>{`@keyframes det-huz { to { stroke-dashoffset: 0; } }`}</style>
          </svg>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                setAuto(false);
                setLepes((l) => Math.min(LEPESEK.length, l + 1));
              }}
              disabled={lepes >= LEPESEK.length}
              className="rounded-lg bg-petrol-800 px-3 py-1.5 text-[12.5px] font-semibold text-white transition hover:bg-petrol-900 disabled:opacity-40"
            >
              Következő átló →
            </button>
            <button
              type="button"
              onClick={() => {
                if (lepes >= LEPESEK.length) setLepes(0);
                setAuto((v) => !v);
              }}
              className="rounded-lg bg-naracs-500 px-3 py-1.5 text-[12.5px] font-semibold text-white transition hover:bg-naracs-600"
            >
              {auto ? "Szünet" : "Lejátszás ▶"}
            </button>
            <button
              type="button"
              onClick={() => {
                setAuto(false);
                setLepes(0);
              }}
              className="rounded-lg bg-petrol-100 px-3 py-1.5 text-[12.5px] font-semibold text-petrol-700 transition hover:bg-petrol-200"
            >
              Elölről
            </button>
          </div>
          <p className="mt-2 text-center text-[11.5px] text-petrol-400">
            <span style={{ color: POZ }} className="font-semibold">Zöld</span>: jobbra-lefelé átló, + előjel ·{" "}
            <span style={{ color: NEG }} className="font-semibold">piros</span>: balra-lefelé átló, − előjel. A szélen átlépünk a másik oldalra.
          </p>
        </div>

        {/* ---- jobb: a képlet és a számpélda ---- */}
        <div className="p-4 sm:p-5">
          <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">
            A képlet épül — {lepes} / {LEPESEK.length} átló
          </p>
          <div className="szamok mt-1 min-h-[3.2rem] text-[14px]">
            <MB>{kepletEddig(lepes)}</MB>
          </div>
          {aktiv && (
            <p className="szamok text-[13px] font-semibold" style={{ color: szinLepes(aktiv) }}>
              {aktiv.elojel > 0 ? "jobbra-lefelé, + " : "balra-lefelé, − "}
              <M>{aktiv.szo}</M>
            </p>
          )}
          {lepes >= LEPESEK.length && (
            <div className="szamok mt-1 rounded-lg bg-naracs-50 px-3 py-2 text-[13.5px]">
              <MB>{"= (a_y b_z - a_z b_y)\\,\\underline{i} + (a_z b_x - a_x b_z)\\,\\underline{j} + (a_x b_y - a_y b_x)\\,\\underline{k}"}</MB>
            </div>
          )}

          <div className="mt-4 border-t border-petrol-100 pt-3">
            <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">Számpélda — írd át a komponenseket</p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[13px] font-semibold" style={{ color: "#e2590a" }}>a =</span>
                <Mezo cimke="x" ertek={av.x} onChange={(v) => setAv({ ...av, x: v })} />
                <Mezo cimke="y" ertek={av.y} onChange={(v) => setAv({ ...av, y: v })} />
                <Mezo cimke="z" ertek={av.z} onChange={(v) => setAv({ ...av, z: v })} />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[13px] font-semibold" style={{ color: "#0f766e" }}>b =</span>
                <Mezo cimke="x" ertek={bv.x} onChange={(v) => setBv({ ...bv, x: v })} />
                <Mezo cimke="y" ertek={bv.y} onChange={(v) => setBv({ ...bv, y: v })} />
                <Mezo cimke="z" ertek={bv.z} onChange={(v) => setBv({ ...bv, z: v })} />
              </div>
            </div>
            <div className="szamok mt-2 text-[13px]">
              <MB>{`\\underline{a}\\times\\underline{b} = \\begin{bmatrix} ${f(a.y)}\\cdot${zar(b.z)} - ${zar(a.z)}\\cdot${zar(b.y)} \\\\ ${f(a.z)}\\cdot${zar(b.x)} - ${zar(a.x)}\\cdot${zar(b.z)} \\\\ ${f(a.x)}\\cdot${zar(b.y)} - ${zar(a.y)}\\cdot${zar(b.x)} \\end{bmatrix} = \\begin{bmatrix} ${f(c.x)} \\\\ ${f(c.y)} \\\\ ${f(c.z)} \\end{bmatrix}`}</MB>
            </div>
            <p className="mt-1 text-[12.5px] text-petrol-500">
              Ellenőrzés: az eredmény merőleges mindkettőre —{" "}
              <M>{`\\underline{a}\\cdot(\\underline{a}\\times\\underline{b}) = ${f(a.x * c.x + a.y * c.y + a.z * c.z)}`}</M>,{" "}
              <M>{`\\underline{b}\\cdot(\\underline{a}\\times\\underline{b}) = ${f(b.x * c.x + b.y * c.y + b.z * c.z)}`}</M>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
