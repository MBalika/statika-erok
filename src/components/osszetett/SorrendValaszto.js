"use client";

import { useMemo, useRef, useState } from "react";
import { M } from "@/components/ui/Keplet";
import { sz, szK } from "@/lib/szamok";
import { TartoHegyek, Tarto, Gorgo, Csuklo, Befogas, BelsoCsuklo, TeherNyil, TamaszCimke } from "@/components/tartok/TartoElemek";
import { OsszetettHegyek, EroNyil, TestCimke } from "./Rajz";

/*
 * Sorrend- és egyenletválasztó: a hallgató kiválasztja, melyik testre (I, II vagy az egész szerkezetre)
 * és melyik egyenletet (nyomatéki egy pontra / vetületi) írná fel. A program megszámolja, hány
 * még ismeretlen mennyiség marad az egyenletben, és csak egyismeretlenes lépést fogad el —
 * ugyanazzal a logikával, amivel a számítómag levezetése dolgozik.
 */

const SZ = 640;
const MA = 340;
const FOK = Math.PI / 180;

const SZERKEZETEK = [
  {
    id: "gerber",
    cim: "Gerber-tartó",
    origo: [70, 170],
    L: 52,
    rudak: [[0, 0, 9, 0]],
    testHatar: { 0: [0, 6], 1: [6, 9] },
    tamaszok: [
      { x: 0, y: 0, tipus: "csuklo", cimke: "A" },
      { x: 4, y: 0, tipus: "gorgo", cimke: "B" },
      { x: 9, y: 0, tipus: "gorgo", cimke: "D" },
    ],
    csuklo: [6, 0],
    pontok: [
      { id: "A", x: 0, y: 0 },
      { id: "B", x: 4, y: 0 },
      { id: "C", x: 6, y: 0 },
      { id: "D", x: 9, y: 0 },
    ],
    terhek: [
      { nev: "F_1", x: 2, y: 0, Fx: 12 * Math.cos(-60 * FOK), Fy: 12 * Math.sin(-60 * FOK), test: 0, cimke: "F₁ = 12 kN (60°)" },
      { nev: "F_2", x: 8, y: 0, Fx: 0, Fy: -8, test: 1, cimke: "F₂ = 8 kN" },
    ],
    ismeretlenek: [
      { id: "Ax", tex: "A_x", P: [0, 0], e: [1, 0], hat: [{ test: 0, elojel: 1 }] },
      { id: "Ay", tex: "A_y", P: [0, 0], e: [0, 1], hat: [{ test: 0, elojel: 1 }] },
      { id: "B", tex: "B", P: [4, 0], e: [0, 1], hat: [{ test: 0, elojel: 1 }] },
      { id: "D", tex: "D", P: [9, 0], e: [0, 1], hat: [{ test: 1, elojel: 1 }] },
      { id: "Cx", tex: "C_x", P: [6, 0], e: [1, 0], hat: [{ test: 1, elojel: 1 }, { test: 0, elojel: -1 }] },
      { id: "Cy", tex: "C_y", P: [6, 0], e: [0, 1], hat: [{ test: 1, elojel: 1 }, { test: 0, elojel: -1 }] },
    ],
    testCimkek: [
      { test: 0, x: 2.5, y: -0.9 },
      { test: 1, x: 7.5, y: -0.9 },
    ],
    tipp: "A II. test (C–D) három ismeretlennel áll szemben: kezdd vele! ΣM_C → D, ΣM_D → C_y, ΣF_x → C_x; utána az I. test: ΣM_A → B, ΣM_B → A_y, ΣF_x → A_x.",
  },
  {
    id: "befogas",
    cim: "Gerber befogással",
    origo: [40, 170],
    L: 37,
    rudak: [[0, 0, 14, 0]],
    testHatar: { 0: [0, 10], 1: [10, 14] },
    tamaszok: [
      { x: 2, y: 0, tipus: "gorgo", cimke: "A" },
      { x: 14, y: 0, tipus: "befogas", irany: "jobb", cimke: "B", cimkeDx: 14, cimkeDy: 28 },
    ],
    csuklo: [10, 0],
    pontok: [
      { id: "P", x: 0, y: 0 },
      { id: "A", x: 2, y: 0 },
      { id: "C", x: 10, y: 0 },
      { id: "B", x: 14, y: 0 },
    ],
    terhek: [{ nev: "F", x: 0, y: 0, Fx: 12 * Math.cos(150 * FOK), Fy: 12 * Math.sin(150 * FOK), test: 0, cimke: "F = 12 kN (30°)" }],
    ismeretlenek: [
      { id: "A", tex: "A", P: [2, 0], e: [0, 1], hat: [{ test: 0, elojel: 1 }] },
      { id: "Bx", tex: "B_x", P: [14, 0], e: [1, 0], hat: [{ test: 1, elojel: 1 }] },
      { id: "By", tex: "B_y", P: [14, 0], e: [0, 1], hat: [{ test: 1, elojel: 1 }] },
      { id: "MB", tex: "M_B", tipus: "nyomatek", hat: [{ test: 1, elojel: 1 }] },
      { id: "Cx", tex: "C_x", P: [10, 0], e: [1, 0], hat: [{ test: 1, elojel: 1 }, { test: 0, elojel: -1 }] },
      { id: "Cy", tex: "C_y", P: [10, 0], e: [0, 1], hat: [{ test: 1, elojel: 1 }, { test: 0, elojel: -1 }] },
    ],
    testCimkek: [
      { test: 0, x: 6, y: -0.9 },
      { test: 1, x: 12, y: -0.9 },
    ],
    tipp: "Most az I. test a befüggesztett rész (görgő + csukló = 3). ΣM_C (I) → A, ΣM_A (I) → C_y, ΣF_x (I) → C_x; majd a II. testre a két vetületi és a B-re írt nyomatéki egyenlet.",
  },
  {
    id: "harom",
    cim: "Háromcsuklós keret",
    origo: [110, 290],
    L: 52,
    rudak: [
      [0, 0, 0, 4],
      [0, 4, 8, 4],
      [8, 4, 8, 0],
    ],
    testHatar: null,
    tamaszok: [
      { x: 0, y: 0, tipus: "csuklo", cimke: "A", cimkeDx: -18, cimkeDy: 26 },
      { x: 8, y: 0, tipus: "csuklo", cimke: "B", cimkeDx: 18, cimkeDy: 26 },
    ],
    csuklo: [4, 4],
    pontok: [
      { id: "A", x: 0, y: 0 },
      { id: "B", x: 8, y: 0 },
      { id: "C", x: 4, y: 4 },
      { id: "D", x: 0, y: 4 },
      { id: "E", x: 8, y: 4 },
    ],
    terhek: [
      { nev: "F_1", x: 2, y: 4, Fx: 0, Fy: -10, test: 0, cimke: "F₁ = 10 kN" },
      { nev: "F_2", x: 6, y: 4, Fx: 0, Fy: -8, test: 1, cimke: "F₂ = 8 kN" },
    ],
    ismeretlenek: [
      { id: "Ax", tex: "A_x", P: [0, 0], e: [1, 0], hat: [{ test: 0, elojel: 1 }] },
      { id: "Ay", tex: "A_y", P: [0, 0], e: [0, 1], hat: [{ test: 0, elojel: 1 }] },
      { id: "Bx", tex: "B_x", P: [8, 0], e: [1, 0], hat: [{ test: 1, elojel: 1 }] },
      { id: "By", tex: "B_y", P: [8, 0], e: [0, 1], hat: [{ test: 1, elojel: 1 }] },
      { id: "Cx", tex: "C_x", P: [4, 4], e: [1, 0], hat: [{ test: 1, elojel: 1 }, { test: 0, elojel: -1 }] },
      { id: "Cy", tex: "C_y", P: [4, 4], e: [0, 1], hat: [{ test: 1, elojel: 1 }, { test: 0, elojel: -1 }] },
    ],
    testCimkek: [
      { test: 0, x: 0.6, y: 2 },
      { test: 1, x: 7.4, y: 2 },
    ],
    tipp: "Testenként 4 ismeretlen, 3 egyenlet: egyik testtel sem lehet kezdeni. Az egész szerkezetre írt ΣM_A → B_y és ΣM_B → A_y viszont egyismeretlenes (a támaszok azonos magasságban vannak). Utána II: ΣM_C → B_x, ΣF → C; I: ΣF_x → A_x.",
  },
];

const TESTEK = [
  { id: 0, cimke: "I. test", szin: "#0f766e" },
  { id: 1, cimke: "II. test", szin: "#0369a1" },
  { id: "mind", cimke: "Σ egész szerkezet", szin: "#6d28d9" },
];

function egyutthato(egy, u, testIdx) {
  const hatasok = u.hat.filter((h) => testIdx === "mind" || h.test === testIdx);
  if (!hatasok.length) return 0;
  let k;
  if (egy.tipus === "vet") k = u.tipus === "nyomatek" ? 0 : u.e[0] * egy.e[0] + u.e[1] * egy.e[1];
  else k = u.tipus === "nyomatek" ? 1 : (u.P[0] - egy.P[0]) * u.e[1] - (u.P[1] - egy.P[1]) * u.e[0];
  return k * hatasok.reduce((s, h) => s + h.elojel, 0);
}
function teherTag(egy, t) {
  if (egy.tipus === "vet") return t.Fx * egy.e[0] + t.Fy * egy.e[1];
  return (t.x - egy.P[0]) * t.Fy - (t.y - egy.P[1]) * t.Fx;
}
const fej = (egy) => (egy.tipus === "vet" ? (egy.e[0] ? "\\Fx" : "\\Fy") : `\\Mp{${egy.nev}}`);
const tagK = (v, tiz = 3) => `${v < 0 ? "-" : "+"} ${szK(Math.abs(v), tiz)}`;

export default function SorrendValaszto() {
  const [szIdx, setSzIdx] = useState(0);
  const [test, setTest] = useState(1);
  const [egy, setEgy] = useState(null); // { tipus:"nyom", P, nev } | { tipus:"vet", e }
  const [megoldott, setMegoldott] = useState({}); // id → érték
  const [lepesek, setLepesek] = useState([]); // { test, tex, eredmenyId, ertek }
  const [tippLatszik, setTippLatszik] = useState(false);
  const svgRef = useRef(null);
  const szk = SZERKEZETEK[szIdx];
  const [OX, OY] = szk.origo;
  const L = szk.L;
  const kx = (x) => OX + x * L;
  const ky = (y) => OY - y * L;
  const testSzin = TESTEK.find((t) => t.id === test).szin;

  const valtSzerkezet = (i) => {
    setSzIdx(i);
    setTest(1);
    setEgy(null);
    setMegoldott({});
    setLepesek([]);
    setTippLatszik(false);
  };
  const ujra = () => {
    setEgy(null);
    setMegoldott({});
    setLepesek([]);
  };

  const kattint = (e) => {
    const svg = svgRef.current;
    if (!svg) return;
    const r = svg.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * SZ;
    const py = ((e.clientY - r.top) / r.height) * MA;
    let P = [Math.round(((px - OX) / L) * 2) / 2, Math.round(((OY - py) / L) * 2) / 2];
    let nev = `P(${sz(P[0], 1)};\\ ${sz(P[1], 1)})`;
    for (const p of szk.pontok) {
      if (Math.hypot(kx(p.x) - px, ky(p.y) - py) < 16) {
        P = [p.x, p.y];
        nev = p.id;
        break;
      }
    }
    setEgy({ tipus: "nyom", P, nev });
  };

  // ---- az aktuális egyenlet elemzése ----
  const elemzes = useMemo(() => {
    if (!egy) return null;
    const tagok = szk.ismeretlenek.map((u) => ({ u, k: egyutthato(egy, u, test) })).filter((x) => Math.abs(x.k) > 1e-9);
    const nyitott = tagok.filter((x) => megoldott[x.u.id] === undefined);
    const ismert = tagok.filter((x) => megoldott[x.u.id] !== undefined);
    const terhek = szk.terhek.filter((t) => test === "mind" || t.test === test);
    const konst = terhek.reduce((s, t) => s + teherTag(egy, t), 0) + ismert.reduce((s, x) => s + x.k * megoldott[x.u.id], 0);
    let ertek = null;
    if (nyitott.length === 1) ertek = -konst / nyitott[0].k;
    const teherSor = terhek.map((t) => { const v = teherTag(egy, t); return Math.abs(v) < 1e-9 ? "" : `${tagK(v, 2)}`; }).filter(Boolean).join(" ");
    const ismertSor = ismert.map((x) => tagK(x.k * megoldott[x.u.id], 2)).join(" ");
    const nyitottSor = nyitott.map((x) => `${x.k < 0 ? "-" : "+"} ${Math.abs(Math.abs(x.k) - 1) < 1e-9 ? "" : `${szK(Math.abs(x.k), 2)}\\cdot `}${x.u.tex}`).join(" ");
    const tex = `${fej(egy)}\\ ${[teherSor, ismertSor, nyitottSor].filter(Boolean).join(" ").replace(/^\+\s*/, "") || "0"} = 0`;
    return { tagok, nyitott, ismert, ertek, tex };
  }, [egy, test, megoldott, szk]);

  const testenkentHasznalt = (t) => lepesek.filter((l) => l.test === t).length;
  const osszes = szk.ismeretlenek.length;
  const keszDb = Object.keys(megoldott).length;
  const kesz = keszDb >= osszes;

  const elfogad = () => {
    if (!elemzes || elemzes.nyitott.length !== 1) return;
    const u = elemzes.nyitott[0].u;
    setMegoldott((m) => ({ ...m, [u.id]: elemzes.ertek }));
    setLepesek((l) => [...l, { test, tex: `${elemzes.tex.replace(/= 0$/, "")}= 0\\ \\Rightarrow\\ ${u.tex} = ${szK(elemzes.ertek, 2)}\\ \\text{${u.tipus === "nyomatek" ? "kNm" : "kN"}}`, id: u.id, cimke: `${TESTEK.find((t) => t.id === test).cimke}: ${egy.tipus === "vet" ? (egy.e[0] ? "ΣFx" : "ΣFy") : `ΣM (${egy.nev.replace(/\\ /g, " ")})`}` }]);
    setEgy(null);
  };

  const ismeretlenSzam = (t) => szk.ismeretlenek.filter((u) => u.hat.some((h) => t === "mind" ? u.hat.length === 1 : h.test === t) && megoldott[u.id] === undefined).length;

  // ---- állapot-doboz ----
  let statusz = null;
  if (elemzes) {
    const n = elemzes.nyitott.length;
    const tulSok = testenkentHasznalt(test) >= 3;
    if (tulSok) statusz = { szin: "rose", cim: "Erre a testre már három egyenletet írtál", szoveg: "Egy merev testre csak három független egyensúlyi egyenlet írható — a negyedik már a többiből következik. Válts testet (vagy az egész szerkezetet)." };
    else if (n === 1) statusz = { szin: "emerald", cim: "Egyismeretlenes egyenlet", szoveg: <>Ebből <M>{elemzes.nyitott[0].u.tex}</M> közvetlenül kijön. Fogadd el!</> };
    else if (n === 0) statusz = { szin: "petrol", cim: "Nincs benne ismeretlen", szoveg: elemzes.tagok.length ? "Minden benne lévő mennyiséget már kiszámoltál — ez ellenőrző egyenletnek jó, új információt nem ad." : "Ebben az egyenletben egyik ismeretlen sem szerepel (a hatásvonaluk átmegy a ponton vagy merőlegesek a vetítésre)." };
    else statusz = { szin: "naracs", cim: `${n} ismeretlen maradt`, szoveg: <>Még nem: <M>{elemzes.nyitott.map((x) => x.u.tex).join(",\\ ")}</M> egyszerre van benne. Keress másik pontot, másik irányt — vagy másik testet, ahol ezek közül csak egy szerepel.</> };
  }
  const statuszOsztaly = { emerald: "border-emerald-300 bg-emerald-50 text-emerald-900", naracs: "border-naracs-300 bg-naracs-50 text-naracs-900", rose: "border-rose-300 bg-rose-50 text-rose-900", petrol: "border-petrol-200 bg-petrol-50 text-petrol-800" };

  const aktivTest = (t) => test === "mind" || test === t;
  const rajzTerhek = szk.terhek.map((t, i) => {
    const n = Math.hypot(t.Fx, t.Fy);
    const szog = (Math.atan2(t.Fy, t.Fx) * 180) / Math.PI;
    return <TeherNyil key={i} x={kx(t.x)} y={ky(t.y) - 3} hossz={44} szog={szog} cimke={t.cimke} cimkeEltolas={Math.abs(t.Fx) < 0.3 ? [6, -2] : t.Fx > 0 ? [-34, -6] : [8, -6]} opacitas={aktivTest(t.test) ? 1 : 0.3} />;
  });

  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white">
      <div className="flex flex-wrap items-center gap-2 border-b border-[color:var(--keret)] bg-petrol-50/70 px-3 py-2">
        <div className="flex flex-wrap gap-1 rounded-lg bg-white p-0.5 ring-1 ring-petrol-200">
          {SZERKEZETEK.map((s, i) => (
            <button key={s.id} type="button" onClick={() => valtSzerkezet(i)} className={`rounded-md px-2.5 py-1 text-[12px] font-medium transition ${szIdx === i ? "bg-petrol-700 text-white" : "text-petrol-600 hover:bg-petrol-50"}`}>
              {s.cim}
            </button>
          ))}
        </div>
        <span className="szamok ml-auto rounded-full bg-white px-2.5 py-1 text-[12px] font-semibold text-petrol-700 ring-1 ring-petrol-200">
          {keszDb} / {osszes} ismeretlen kész
        </span>
        <button type="button" onClick={ujra} className="rounded-lg bg-white px-2.5 py-1 text-[12px] font-medium text-petrol-600 ring-1 ring-petrol-200 hover:bg-petrol-50">
          ↺ elölről
        </button>
      </div>

      <div className="grid lg:grid-cols-[1.35fr_1fr] [&>*]:min-w-0">
        <div className="racs-vilagos border-b border-[color:var(--keret)] p-3 lg:border-r lg:border-b-0">
          {/* test-választó */}
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold tracking-[0.14em] text-petrol-500 uppercase">1. Melyik testre?</span>
            {TESTEK.map((t) => (
              <button key={String(t.id)} type="button" onClick={() => { setTest(t.id); setEgy(null); }} className="rounded-lg px-2.5 py-1 text-[12px] font-semibold ring-1 transition" style={test === t.id ? { backgroundColor: t.szin, color: "white", borderColor: t.szin } : { backgroundColor: "white", color: t.szin }}>
                {t.cimke} <span className="szamok opacity-80">({ismeretlenSzam(t.id)})</span>
              </button>
            ))}
          </div>
          <svg ref={svgRef} viewBox={`0 0 ${SZ} ${MA}`} className="abra h-auto w-full select-none" onClick={kattint} style={{ cursor: "crosshair" }}>
            <TartoHegyek />
            <OsszetettHegyek />
            <rect x={0} y={0} width={SZ} height={MA} fill="transparent" />
            <text x={12} y={18} fontSize="11" fontWeight="700" letterSpacing="1.5" style={{ fill: "#64748b" }}>
              2. KATTINTS EGY PONTRA (NYOMATÉKI) VAGY VÁLASSZ VETÜLETET
            </text>
            {/* a rudak, testenként színezve */}
            {szk.rudak.map((r, i) => {
              if (szk.testHatar) {
                return [0, 1].map((t) => {
                  const [a, b] = szk.testHatar[t];
                  return <Tarto key={`${i}-${t}`} x1={kx(a)} y1={ky(0)} x2={kx(b)} y2={ky(0)} szin={aktivTest(t) ? (test === "mind" ? "#6d28d9" : testSzin) : "#94a3b8"} />;
                });
              }
              // keret: az első két rúd fele az I., a többi a II. testé
              const t = i === 0 ? 0 : i === 2 ? 1 : null;
              if (t === null) {
                return (
                  <g key={i}>
                    <Tarto x1={kx(r[0])} y1={ky(r[1])} x2={kx(szk.csuklo[0])} y2={ky(szk.csuklo[1])} szin={aktivTest(0) ? (test === "mind" ? "#6d28d9" : testSzin) : "#94a3b8"} />
                    <Tarto x1={kx(szk.csuklo[0])} y1={ky(szk.csuklo[1])} x2={kx(r[2])} y2={ky(r[3])} szin={aktivTest(1) ? (test === "mind" ? "#6d28d9" : testSzin) : "#94a3b8"} />
                  </g>
                );
              }
              return <Tarto key={i} x1={kx(r[0])} y1={ky(r[1])} x2={kx(r[2])} y2={ky(r[3])} szin={aktivTest(t) ? (test === "mind" ? "#6d28d9" : testSzin) : "#94a3b8"} />;
            })}
            {szk.tamaszok.map((t, i) => {
              const x = kx(t.x), y = ky(t.y);
              return (
                <g key={i} opacity={0.35}>
                  {t.tipus === "csuklo" && <Csuklo x={x} y={y} />}
                  {t.tipus === "gorgo" && <Gorgo x={x} y={y} />}
                  {t.tipus === "befogas" && <Befogas x={x} y={y} irany={t.irany} hossz={44} />}
                </g>
              );
            })}
            {szk.tamaszok.map((t, i) => (
              <TamaszCimke key={`c${i}`} x={kx(t.x) + (t.cimkeDx ?? 0)} y={ky(t.y) + (t.cimkeDy ?? 40)}>{t.cimke}</TamaszCimke>
            ))}
            <BelsoCsuklo x={kx(szk.csuklo[0])} y={ky(szk.csuklo[1])} />
            <TamaszCimke x={kx(szk.csuklo[0])} y={ky(szk.csuklo[1]) - 12}>C</TamaszCimke>
            {szk.testCimkek.map((c) => (
              <TestCimke key={c.test} x={kx(c.x)} y={ky(c.y)} aktiv={aktivTest(c.test)} szin={c.test === 0 ? "#0f766e" : "#0369a1"}>
                {c.test === 0 ? "I" : "II"}
              </TestCimke>
            ))}
            {rajzTerhek}
            {/* ismeretlenek nyilai */}
            {szk.ismeretlenek.map((u) => {
              if (u.tipus === "nyomatek") {
                const x = kx(14), y = ky(0);
                const kesz = megoldott[u.id] !== undefined;
                return (
                  <g key={u.id} opacity={aktivTest(1) ? 1 : 0.3}>
                    <path d={`M ${x + 18} ${y} A 18 18 0 1 0 ${x - 18} ${y}`} fill="none" stroke={kesz ? "#15803d" : "#7c3aed"} strokeWidth="2.4" markerEnd={`url(#${kesz ? "oh-zold" : "oh-lila"})`} />
                    <text x={x} y={y - 26} textAnchor="middle" fontSize="12" fontWeight="650" fontStyle="italic" style={{ fill: kesz ? "#15803d" : "#7c3aed", paintOrder: "stroke", stroke: "white", strokeWidth: 3.5 }}>
                      M<tspan dy="3.5" fontSize="9">B</tspan>
                      {kesz && <tspan dy="-3.5"> = {sz(megoldott[u.id], 2)}</tspan>}
                    </text>
                  </g>
                );
              }
              const h = u.hat.find((x) => test === "mind" ? u.hat.length === 1 : x.test === test);
              const benne = !!h;
              const kesz = megoldott[u.id] !== undefined;
              const elojel = h ? h.elojel : 1;
              // a belső csuklóerőt a csukló két oldalára rajzoljuk (a testnek megfelelően)
              const belso = u.hat.length === 2;
              const oldal = belso ? (test === 0 ? -1 : 1) : 0;
              const X = kx(u.P[0]) + (belso ? oldal * 10 : 0) + (u.e[0] ? 0 : 0);
              const Y = ky(u.P[1]) + (belso && u.e[0] ? 0 : 0);
              const cimke = `${u.tex.replace("_x", "ₓ").replace("_y", "ᵧ")}${kesz ? ` = ${sz(megoldott[u.id], 2)}` : ""}`;
              return <EroNyil key={u.id} X={X} Y={Y} Fx={u.e[0] * elojel} Fy={u.e[1] * elojel} minHossz={36} leptek={0} szin={kesz ? "#15803d" : "#7c3aed"} hegy={kesz ? "oh-zold" : "oh-lila"} cimke={cimke} opacitas={belso && test === "mind" ? 0.25 : benne ? 1 : 0.3} szaggatott={belso && test === "mind"} />;
            })}
            {/* a választott pont és a karok */}
            {egy?.tipus === "nyom" && (
              <g>
                {elemzes.tagok
                  .filter((x) => x.u.tipus !== "nyomatek")
                  .map((x) => {
                    const u = x.u;
                    const vx = egy.P[0] - u.P[0], vy = egy.P[1] - u.P[1];
                    const t = vx * u.e[0] + vy * u.e[1];
                    const tp = [u.P[0] + t * u.e[0], u.P[1] + t * u.e[1]];
                    return <line key={u.id} x1={kx(egy.P[0])} y1={ky(egy.P[1])} x2={kx(tp[0])} y2={ky(tp[1])} stroke={megoldott[u.id] === undefined ? "#7c3aed" : "#15803d"} strokeWidth="1.6" strokeDasharray="3 3" />;
                  })}
                <circle cx={kx(egy.P[0])} cy={ky(egy.P[1])} r="9" fill="none" stroke="#e2590a" strokeWidth="2.2" />
                <circle cx={kx(egy.P[0])} cy={ky(egy.P[1])} r="2.5" fill="#e2590a" />
                <text x={kx(egy.P[0]) + 12} y={ky(egy.P[1]) - 12} fontSize="12" fontWeight="700" style={{ fill: "#e2590a", paintOrder: "stroke", stroke: "white", strokeWidth: 3.5 }}>
                  ΣM erre a pontra
                </text>
              </g>
            )}
          </svg>
          <div className="mt-1 flex flex-wrap items-center justify-center gap-1.5">
            <span className="text-[11.5px] text-petrol-500">Vetületi egyenlet:</span>
            {[
              [[1, 0], "ΣFx (vízszintes)"],
              [[0, 1], "ΣFy (függőleges)"],
            ].map(([e, cimke]) => (
              <button key={cimke} type="button" onClick={() => setEgy({ tipus: "vet", e })} className={`rounded-lg px-2.5 py-1.5 text-[12px] font-medium ring-1 transition ${egy?.tipus === "vet" && egy.e[0] === e[0] ? "bg-petrol-700 text-white ring-petrol-700" : "bg-white text-petrol-700 ring-petrol-200 hover:bg-petrol-50"}`}>
                {cimke}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-5">
          {kesz ? (
            <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-emerald-900">
              <p className="text-[13.5px] font-semibold">Kész! Mind a {osszes} ismeretlent egyismeretlenes egyenletekkel számoltad ki.</p>
              <p className="mt-1 text-[12.5px]">{lepesek.length} egyenlet; az ellenőrzéshez maradt még {6 - lepesek.length > 0 ? 6 - lepesek.length : "egy összegzett"} független egyenlet — pl. az egész szerkezetre írt ΣFy.</p>
            </div>
          ) : elemzes && statusz ? (
            <div className={`rounded-xl border p-3 ${statuszOsztaly[statusz.szin]}`}>
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-white text-lg font-bold ring-1 ring-black/5">{elemzes.nyitott.length}</span>
                <span className="text-[13.5px] font-semibold">{statusz.cim}</span>
              </div>
              <p className="mt-1.5 text-[12.5px] leading-relaxed">{statusz.szoveg}</p>
              <div className="szamok mt-2 overflow-x-auto rounded-lg bg-white/70 px-2 py-1 text-[13px]">
                <M>{elemzes.tex}</M>
              </div>
              {elemzes.nyitott.length === 1 && testenkentHasznalt(test) < 3 && (
                <button type="button" onClick={elfogad} className="mt-2 rounded-lg bg-emerald-600 px-3 py-1.5 text-[12.5px] font-semibold text-white transition hover:bg-emerald-700">
                  Elfogadom → <M>{`${elemzes.nyitott[0].u.tex} = ${szK(elemzes.ertek, 2)}`}</M>
                </button>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-petrol-200 bg-petrol-50 p-3 text-[12.5px] leading-relaxed text-petrol-700">
              Válassz testet, aztán kattints egy pontra a rajzon (nyomatéki egyenlet arra a pontra) vagy válassz vetületi egyenletet. A program megszámolja, hány <em>még ismeretlen</em> mennyiség marad benne — csak az egyismeretlenes lépést fogadja el. A zárójelben a testekre még nyitott ismeretlenek száma.
            </div>
          )}

          <p className="mt-3 text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">Az eddigi lépések</p>
          {lepesek.length === 0 ? (
            <p className="mt-1 text-[12px] text-petrol-400">Még nincs elfogadott egyenlet.</p>
          ) : (
            <ol className="mt-1 space-y-1">
              {lepesek.map((l, i) => (
                <li key={i} className="rounded-lg bg-petrol-50 px-2.5 py-1.5 text-[12px] text-petrol-800">
                  <span className="mr-1 font-semibold text-petrol-500">{i + 1}.</span>
                  <span className="text-petrol-500">{l.cimke}</span>
                  <div className="szamok overflow-x-auto">
                    <M>{l.tex}</M>
                  </div>
                </li>
              ))}
            </ol>
          )}
          <button type="button" onClick={() => setTippLatszik((v) => !v)} className="mt-3 text-[12px] font-semibold text-naracs-600 hover:underline">
            {tippLatszik ? "Tipp elrejtése" : "Tipp: melyik testtel kezdenél?"}
          </button>
          {tippLatszik && <p className="mt-1 text-[12px] leading-relaxed text-petrol-600">{szk.tipp}</p>}
        </div>
      </div>
    </div>
  );
}
