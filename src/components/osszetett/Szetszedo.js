"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { elemez } from "@/lib/tarto";
import { levezetes } from "@/lib/tarto/levezetes";
import { Csuszka } from "@/components/abrak/ErovektorBonto";
import { M } from "@/components/ui/Keplet";
import { sz } from "@/lib/szamok";
import { TartoHegyek } from "@/components/tartok/TartoElemek";
import { arany } from "@/components/anim/Idovonal";
import { gerberModell, haromcsuklosModell, ismeretlenTerkep, FOK } from "./szamitas";
import { OsszetettHegyek, EroNyil, TestRajz, TestCimke, NAR } from "./Rajz";

/*
 * Szétszedő animáció: a szerkezet a belső csuklónál kettéválik, a két test eltávolodik,
 * a támaszok reakciókra cserélődnek, és a csuklóban megjelenik az ellentett belső erőpár
 * (C_x, C_y) — a számítómag értékeivel. Három szerkezet: Gerber-tartó, háromcsuklós keret,
 * csuklóján terhelt Gerber-tartó.
 */

const SZ = 640;
const MA = 360;
const LEPTEK = 3; // px / kN a reakciónyilakon

const SZERKEZETEK = [
  {
    id: "gerber",
    cim: "Gerber-tartó",
    modell: gerberModell({ xB: 4, xC: 6, xD: 9, F1: 12, x1: 2, szog1: -60, F2: 8, x2: 8 }),
    origo: [80, 200],
    L: 46,
    csuklo: [6, 0],
    testek: [
      {
        nev: "I",
        eltolas: [-22, 34],
        rudak: [[0, 0, 6, 0]],
        tamaszok: [
          { x: 0, y: 0, tipus: "csuklo", cimke: "A" },
          { x: 4, y: 0, tipus: "gorgo", cimke: "B" },
        ],
        terhek: [{ x: 2, y: 0, Fx: 12 * Math.cos(-60 * FOK), Fy: 12 * Math.sin(-60 * FOK), cimke: "F₁ = 12 kN" }],
        cimkeHely: [2.8, -0.5],
      },
      {
        nev: "II",
        eltolas: [22, -34],
        rudak: [[6, 0, 9, 0]],
        tamaszok: [{ x: 9, y: 0, tipus: "gorgo", cimke: "D" }],
        terhek: [{ x: 8, y: 0, Fx: 0, Fy: -8, cimke: "F₂ = 8 kN" }],
        cimkeHely: [7.3, -0.5],
      },
    ],
    reakciok: [
      { pont: [0, 0], jel: "A_x", test: 0, cimkeEltolas: [0, 18], horgony: "start" },
      { pont: [0, 0], jel: "A_y", test: 0 },
      { pont: [4, 0], jel: "B", test: 0 },
      { pont: [9, 0], jel: "D", test: 1 },
    ],
    leiras: "A II. test (C–D) csak egy görgővel támaszkodik a földre: befüggesztett rész. Elkülönítve C-ben két ismeretlen csuklóerő-komponenst kap, a D görgővel együtt hármat — pont mint egy kéttámaszú tartó. Az I. test a fix rész: a C-ben átadódó erő ellentettje terheli.",
    kijelentesek: ["\\text{I: } (\\underline F_1, \\underline A, \\underline B, \\underline C') \\ekv \\underline O", "\\text{II: } (\\underline F_2, \\underline D, \\underline C) \\ekv \\underline O", "\\Sigma: (\\underline F_1, \\underline F_2, \\underline A, \\underline B, \\underline D) \\ekv \\underline O"],
  },
  {
    id: "harom",
    cim: "Háromcsuklós keret",
    modell: (() => {
      const m = haromcsuklosModell({ L: 8, hA: 4, xC: 4, F: 10, xF: 2, p: 0 });
      m.terhek.push({ fajta: "pontTeher", rud: "3", a: 2, F: -8, irany: "y" });
      return m;
    })(),
    origo: [120, 300],
    L: 48,
    csuklo: [4, 4],
    testek: [
      {
        nev: "I",
        eltolas: [-40, 0],
        rudak: [
          [0, 0, 0, 4],
          [0, 4, 4, 4],
        ],
        tamaszok: [{ x: 0, y: 0, tipus: "csuklo", cimke: "A" }],
        terhek: [{ x: 2, y: 4, Fx: 0, Fy: -10, cimke: "F₁ = 10 kN" }],
        cimkeHely: [0.5, 2],
      },
      {
        nev: "II",
        eltolas: [40, 0],
        rudak: [
          [4, 4, 8, 4],
          [8, 4, 8, 0],
        ],
        tamaszok: [{ x: 8, y: 0, tipus: "csuklo", cimke: "B" }],
        terhek: [{ x: 6, y: 4, Fx: 0, Fy: -8, cimke: "F₂ = 8 kN" }],
        cimkeHely: [7.5, 2],
      },
    ],
    reakciok: [
      { pont: [0, 0], jel: "A_x", test: 0 },
      { pont: [0, 0], jel: "A_y", test: 0 },
      { pont: [8, 0], jel: "B_x", test: 1 },
      { pont: [8, 0], jel: "B_y", test: 1, cimkeEltolas: [-8, -8], horgony: "end" },
    ],
    leiras: "Mindkét test két csuklóval kapcsolódik: egy külsővel a földhöz, a belsővel egymáshoz. Testenként négy ismeretlen áll három egyenlettel szemben — ezért az egész szerkezetre írt nyomatéki egyenletek segítenek ki. Figyeld a vízszintes csuklóerőt: függőleges terhek mellett is van, ez tartja össze a keretet.",
    kijelentesek: ["\\text{I: } (\\underline F_1, \\underline A, \\underline C) \\ekv \\underline O", "\\text{II: } (\\underline F_2, \\underline B, \\underline C') \\ekv \\underline O", "\\Sigma: (\\underline F_1, \\underline F_2, \\underline A, \\underline B) \\ekv \\underline O"],
  },
  {
    id: "terhelt",
    cim: "Terhelt csukló",
    modell: gerberModell({ xB: 4, xC: 6, xD: 9, F1: 12, x1: 2, szog1: -60, F2: 6, x2: 8, FC: 10 }),
    origo: [80, 196],
    L: 46,
    csuklo: [6, 0],
    FC: { Fx: 0, Fy: -10 },
    testek: [
      {
        nev: "I",
        eltolas: [-34, 64],
        rudak: [[0, 0, 6, 0]],
        tamaszok: [
          { x: 0, y: 0, tipus: "csuklo", cimke: "A" },
          { x: 4, y: 0, tipus: "gorgo", cimke: "B" },
        ],
        terhek: [{ x: 2, y: 0, Fx: 12 * Math.cos(-60 * FOK), Fy: 12 * Math.sin(-60 * FOK), cimke: "F₁ = 12 kN" }],
        cimkeHely: [2.8, -0.5],
      },
      {
        nev: "II",
        eltolas: [40, -80],
        rudak: [[6, 0, 9, 0]],
        tamaszok: [{ x: 9, y: 0, tipus: "gorgo", cimke: "D" }],
        terhek: [{ x: 8, y: 0, Fx: 0, Fy: -6, cimke: "F₃ = 6 kN" }],
        cimkeHely: [7.3, -0.5],
      },
    ],
    reakciok: [
      { pont: [0, 0], jel: "A_x", test: 0, cimkeEltolas: [0, -10], horgony: "start" },
      { pont: [0, 0], jel: "A_y", test: 0 },
      { pont: [4, 0], jel: "B", test: 0, cimkeEltolas: [-8, 4], horgony: "end" },
      { pont: [9, 0], jel: "D", test: 1 },
    ],
    leiras: "A C csuklót közvetlenül terheli F₂ = 10 kN. Ilyenkor a csuklót külön kell elkülöníteni: rá három erő hat — a teher és a két testről érkező csuklóerők ellentettjei —, és ezek közös metszéspontú erőrendszere egyensúlyban van. A két testre ható csuklóerő ezért most nem egymás ellentettje!",
    kijelentesek: ["\\text{II: } (\\underline F_3, \\underline D, \\underline C_{II}) \\ekv \\underline O", "\\text{C: } (\\underline F_2, \\underline C'_{I}, \\underline C'_{II}) \\ekv \\underline O", "\\text{I: } (\\underline F_1, \\underline A, \\underline B, \\underline C_{I}) \\ekv \\underline O"],
  },
];

function szamol(szk) {
  const modell = szk.modell;
  const e = elemez(modell);
  const lv = levezetes(modell, e);
  const t = ismeretlenTerkep(lv);
  const CII = { x: t.C_x ?? 0, y: t.C_y ?? 0 };
  const CI = { x: (szk.FC?.Fx ?? 0) - CII.x, y: (szk.FC?.Fy ?? 0) - CII.y };
  const reakcio = {};
  for (const r of e.reakciok) {
    if (r.tipus === "csuklo") {
      reakcio[`${r.csomopont}_x`] = r.Fx;
      reakcio[`${r.csomopont}_y`] = r.Fy;
    } else reakcio[r.csomopont] = r.Fy;
  }
  return { CII, CI, reakcio, e };
}

export default function Szetszedo({ kezdoIdx = 0, kezdoU = 0 }) {
  const [idx, setIdx] = useState(kezdoIdx);
  const [u, setU] = useState(kezdoU);
  const rafRef = useRef(null);
  const szk = SZERKEZETEK[idx];
  const adat = useMemo(() => szamol(szk), [szk]);

  const animal = (cel) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    let kezdet = null;
    let u0 = u;
    const lep = (most) => {
      if (kezdet == null) kezdet = most;
      const t = Math.min(1, (most - kezdet) / 1100);
      const s = t * t * (3 - 2 * t);
      setU(u0 + (cel - u0) * s);
      if (t < 1) rafRef.current = requestAnimationFrame(lep);
    };
    rafRef.current = requestAnimationFrame(lep);
  };
  useEffect(() => () => rafRef.current && cancelAnimationFrame(rafRef.current), []);

  const [OX, OY] = szk.origo;
  const L = szk.L;
  const kx = (x) => OX + x * L;
  const ky = (y) => OY - y * L;
  const tamaszHalv = 1 - arany(u, 0.15, 0.55);
  const reakU = arany(u, 0.3, 0.7);
  const csuklU = arany(u, 0.45, 0.85);
  const [cx, cy] = szk.csuklo;

  const { CII, CI, reakcio } = adat;
  const reakcioErtek = (jel) => reakcio[jel] ?? 0;
  const reakcioVektor = (jel) => {
    const v = reakcioErtek(jel);
    if (jel.endsWith("_x")) return [v, 0];
    return [0, v];
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white">
      <div className="flex flex-wrap items-center gap-2 border-b border-[color:var(--keret)] bg-petrol-50/70 px-3 py-2">
        <div className="flex flex-wrap gap-1 rounded-lg bg-white p-0.5 ring-1 ring-petrol-200">
          {SZERKEZETEK.map((s, i) => (
            <button key={s.id} type="button" onClick={() => { setIdx(i); }} className={`rounded-md px-2.5 py-1 text-[12px] font-medium transition ${idx === i ? "bg-petrol-700 text-white" : "text-petrol-600 hover:bg-petrol-50"}`}>
              {s.cim}
            </button>
          ))}
        </div>
        <div className="ml-auto flex gap-1.5">
          <button type="button" onClick={() => animal(1)} className="rounded-lg bg-naracs-500 px-3 py-1.5 text-[12px] font-semibold text-white transition hover:bg-naracs-600">
            Szétszedés ▶
          </button>
          <button type="button" onClick={() => animal(0)} className="rounded-lg bg-white px-3 py-1.5 text-[12px] font-semibold text-petrol-700 ring-1 ring-petrol-200 transition hover:bg-petrol-50">
            Összerakás
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] [&>*]:min-w-0">
        <div className="racs-vilagos border-b border-[color:var(--keret)] p-3 lg:border-r lg:border-b-0">
          <svg viewBox={`0 0 ${SZ} ${MA}`} className="abra h-auto w-full select-none">
            <TartoHegyek />
            <OsszetettHegyek />
            <text x={12} y={20} fontSize="11" fontWeight="700" letterSpacing="1.5" style={{ fill: "#64748b" }}>
              {u < 0.1 ? "A SZERKEZET" : u < 0.6 ? "ELKÜLÖNÍTÉS: A TÁMASZOK HELYETT REAKCIÓK" : "A KÉT TEST KÜLÖN — A CSUKLÓBAN ELLENTETT ERŐPÁR"}
            </text>

            {szk.testek.map((test, ti) => {
              const dx = test.eltolas[0] * u, dy = test.eltolas[1] * u;
              const Cero = ti === 0 ? CI : CII;
              return (
                <g key={test.nev} transform={`translate(${dx} ${dy})`}>
                  <TestRajz {...test} kx={kx} ky={ky} tamaszOpacitas={tamaszHalv} csuklok={u < 0.05 || ti === 1 ? [szk.csuklo] : []} />
                  <TestCimke x={kx(test.cimkeHely[0])} y={ky(test.cimkeHely[1])} aktiv={u > 0.5}>
                    {test.nev}
                  </TestCimke>
                  {/* reakciók */}
                  {szk.reakciok
                    .filter((r) => r.test === ti)
                    .map((r) => {
                      const [Fx, Fy] = reakcioVektor(r.jel);
                      const v = reakcioErtek(r.jel);
                      return (
                        <EroNyil key={r.jel} X={kx(r.pont[0])} Y={ky(r.pont[1])} Fx={Fx} Fy={Fy} leptek={LEPTEK} opacitas={reakU} cimke={`${r.jel.replace("_x", "ₓ").replace("_y", "ᵧ")} = ${sz(Math.abs(v), 2)}`} cimkeEltolas={r.cimkeEltolas} horgony={r.horgony} />
                      );
                    })}
                  {/* belső csuklóerő */}
                  {u > 0.05 && (
                    <g opacity={csuklU}>
                      <EroNyil X={kx(cx)} Y={ky(cy)} Fx={Cero.x} Fy={0} leptek={LEPTEK} szin="#0369a1" hegy="oh-kek" cimke={`C${ti === 0 ? "′" : ""}ₓ = ${sz(Math.abs(Cero.x), 2)}`} cimkeEltolas={[0, 18]} />
                      <EroNyil X={kx(cx)} Y={ky(cy)} Fx={0} Fy={Cero.y} leptek={LEPTEK} szin="#0369a1" hegy="oh-kek" cimke={`C${ti === 0 ? "′" : ""}ᵧ = ${sz(Math.abs(Cero.y), 2)}`} cimkeEltolas={ti === 0 ? [-8, Cero.y >= 0 ? -6 : 4] : [8, Cero.y >= 0 ? -6 : 18]} horgony={ti === 0 ? "end" : "start"} />
                      <circle cx={kx(cx)} cy={ky(cy)} r="4" fill="#0369a1" stroke="white" strokeWidth="1.5" />
                    </g>
                  )}
                </g>
              );
            })}

            {/* a csuklón ható teher: mindig látszik (összerakva a csuklóra mutat, szétszedve a külön elkülönített csuklóra) */}
            {szk.FC && (
              <g>
                <line x1={kx(cx)} y1={ky(cy) - 56} x2={kx(cx)} y2={ky(cy) - (u > 0.05 ? 12 : 7)} stroke={NAR} strokeWidth="3" strokeLinecap="round" markerEnd="url(#oh-nar)" />
                <text x={kx(cx)} y={ky(cy) - 62} textAnchor="middle" fontSize="12" fontWeight="650" style={{ fill: NAR, paintOrder: "stroke", stroke: "white", strokeWidth: 3.5 }}>
                  F₂ = {sz(Math.abs(szk.FC.Fy), 0)} kN (a csuklón)
                </text>
              </g>
            )}
            {/* a terhelt csukló külön testként */}
            {szk.FC && u > 0.05 && (
              <g opacity={csuklU}>
                <circle cx={kx(cx)} cy={ky(cy)} r="9" fill="white" stroke="#1d3c48" strokeWidth="2.2" />
                <text x={kx(cx)} y={ky(cy) + 4} textAnchor="middle" fontSize="11" fontWeight="700" fontStyle="italic" style={{ fill: "#1d3c48" }}>C</text>
                <EroNyil X={kx(cx) - 14} Y={ky(cy) + 10} Fx={-CI.x} Fy={-CI.y} leptek={LEPTEK} szin="#0369a1" hegy="oh-kek" cimke={`−C′ᵢ: ${sz(Math.abs(CI.y), 2)}`} cimkeEltolas={[-6, 4]} horgony="end" />
                <EroNyil X={kx(cx) + 14} Y={ky(cy) + 10} Fx={-CII.x} Fy={-CII.y} leptek={LEPTEK} szin="#0369a1" hegy="oh-kek" cimke={`−C′ᵢᵢ: ${sz(Math.abs(CII.y), 2)}`} cimkeEltolas={[6, 4]} horgony="start" />
              </g>
            )}

            {/* hatás–ellenhatás felirat */}
            {u > 0.6 && !szk.FC && (
              <g opacity={csuklU}>
                <text x={SZ / 2} y={MA - 5} textAnchor="middle" fontSize="12" fontWeight="650" style={{ fill: "#0369a1", paintOrder: "stroke", stroke: "white", strokeWidth: 3.5 }}>
                  a két testre ható csuklóerő egymás ellentettje: C′ = −C (hatás–ellenhatás)
                </text>
              </g>
            )}
            {u > 0.6 && szk.FC && (
              <g opacity={csuklU}>
                <text x={SZ / 2} y={MA - 5} textAnchor="middle" fontSize="12" fontWeight="650" style={{ fill: "#0369a1", paintOrder: "stroke", stroke: "white", strokeWidth: 3.5 }}>
                  a csuklón: F₂ + (−C′ᵢ) + (−C′ᵢᵢ) = 0 → {sz(10, 0)} = {sz(Math.abs(CI.y), 0)} − {sz(Math.abs(CII.y), 0)} ✓
                </text>
              </g>
            )}
          </svg>
          <div className="mt-2">
            <Csuszka cimke="szétszedés" ertek={u} egyseg="" min={0} max={1} lepes={0.01} tizedes={2} onChange={setU} />
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">{szk.cim}</p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-petrol-700">{szk.leiras}</p>

          <div className="mt-3 space-y-1 rounded-xl bg-petrol-50 px-3 py-2">
            {szk.kijelentesek.map((k, i) => (
              <div key={i} className="szamok text-[13px] text-petrol-800">
                <M>{k}</M>
              </div>
            ))}
          </div>

          <p className="mt-3 text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">A belső csuklóerő (a számítómagból)</p>
          <div className="mt-1.5 grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-2">
              <p className="text-[11px] font-semibold text-sky-800">a II. testre</p>
              <p className="szamok text-[13px] text-sky-900">
                <M>{`C_x = ${sz(CII.x, 2).replace(",", "{,}")}`}</M>, <M>{`C_y = ${sz(CII.y, 2).replace(",", "{,}")}`}</M> kN
              </p>
            </div>
            <div className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-2">
              <p className="text-[11px] font-semibold text-sky-800">az I. testre</p>
              <p className="szamok text-[13px] text-sky-900">
                <M>{`C'_x = ${sz(CI.x, 2).replace(",", "{,}")}`}</M>, <M>{`C'_y = ${sz(CI.y, 2).replace(",", "{,}")}`}</M> kN
              </p>
            </div>
          </div>
          <p className="mt-2 text-[12px] leading-relaxed text-petrol-500">
            {szk.FC
              ? "A csukló egyensúlyából: C_I = F_C − C_II. A két csuklóerő különbsége éppen a csuklón ható teher."
              : "A két érték egymás ellentettje. Az egész szerkezetre írt egyenletekben ki is esnek — ezért érdemes velük kezdeni, ha a külső reakciót keressük."}
          </p>
          <p className="mt-2 text-[12px] leading-relaxed text-petrol-500">
            Reakciók: {szk.reakciok.map((r) => `${r.jel.replace("_x", "ₓ").replace("_y", "ᵧ")} = ${sz(reakcioErtek(r.jel), 2)}`).join(", ")} kN (negatív: a felvett iránnyal ellentétes — a rajzon már a tényleges irány látszik).
          </p>
        </div>
      </div>
    </div>
  );
}
