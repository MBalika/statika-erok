"use client";

import FeladatFilm from "@/components/anim/FeladatFilm";
import { arany, lerp, rugo } from "@/components/anim/Idovonal";
import { Hegy, NyilA, VonalA, FeliratA, IvA, PontA } from "@/components/anim/FilmElemek";

const OX = 420;
const OY = 200;
const L = 16; // képpont / m
const E = 5; // képpont / kN
const px = (x) => OX + x * L;
const py = (y) => OY - y * L;

const A = { x: -3, y: 8 };
const B = { x: 2, y: 0 };
const C = { x: -3, y: -4 };
const S41 = Math.sqrt(41);
const S89 = Math.sqrt(89);
// irányok: F1: B→C, F2: A→B, F3: C→A
const IR = [
  { x: -5 / S41, y: -4 / S41 },
  { x: 5 / S89, y: -8 / S89 },
  { x: 0, y: 1 },
];
const KOZEP = [
  { x: (B.x + C.x) / 2, y: (B.y + C.y) / 2 },
  { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 },
  { x: (C.x + A.x) / 2, y: (C.y + A.y) / 2 },
];
const ADAT = {
  a: { F: [12.81, 18.87, 24], M: 17, Msum: -103, cim: "a" },
  b: { F: [6.403, 9.434, 12], M: 0, Msum: -60, cim: "b" },
  c: { F: [4.4, 6.6, 10.1], M: 14, Msum: -32.99, cim: "c" },
};
const SZ = ["#e2590a", "#0f766e", "#2563eb"];
const X0 = -18.8;

const FEJEZETEK = [
  {
    t0: 0,
    cim: "A geometria: három hatásvonal, egy háromszög",
    szoveg: "A három erő hatásvonala a (−3; 8), (2; 0), (−3; −4) csúcsú háromszög három oldala; ehhez jön egy M forgatónyomaték. Ugyanezt az ábrát háromféle adattal nézzük meg.",
    kepletek: ["(\\underline{F}_1, \\underline{F}_2, \\underline{F}_3, M) \\ekv \\mathcal{D}", "\\text{a)}\\ F_1 = 12,81,\\ F_2 = 18,87,\\ F_3 = 24\\ \\text{kN},\\ M = 17\\ \\text{kNm}"],
  },
  {
    t0: 4,
    cim: "a) Az erők összege nulla",
    szoveg: "Ha a három erőt egymás után fűzzük, a lánc bezárul: ΣFx = 0, ΣFy = 0. Ez egyensúlynak látszik — de még nem az.",
    kepletek: ["\\Fx -10 + 10 + 0 = R_x = 0,\\qquad \\Fy -8 - 16 + 24 = R_y = 0"],
  },
  {
    t0: 8,
    cim: "a) …de a nyomaték nem: erőpár",
    szoveg: "F₁ és F₂ hatásvonala a (2; 0) ponton megy át, F₃-é az x = −3 egyenesen. A nyomatékok nem ejtik ki egymást — az eredő tiszta forgatónyomaték, minden pontra ugyanannyi.",
    kepletek: ["\\Mp{O} 2\\cdot(-8) + 2\\cdot(-16) + (-3)\\cdot 24 + 17 = -103\\ \\text{kNm}", "(\\underline{F}_1, \\underline{F}_2, \\underline{F}_3, M) \\ekv M^{(O)}"],
  },
  {
    t0: 12,
    cim: "b) Fele erők, M = 0 — megint erőpár",
    szoveg: "Az erők most pontosan az oldalvektorok: az összegük megint nulla. A nyomaték kisebb, de nem nulla — mert a hatásvonalak nem egy ponton mennek át.",
    kepletek: ["\\Mp{O} 2\\cdot(-4) + 2\\cdot(-8) + (-3)\\cdot 12 = -60\\ \\text{kNm}"],
  },
  {
    t0: 15.5,
    cim: "c) Itt már marad erő: egyetlen erő az eredő",
    szoveg: "A lánc nem zárul be: a hézag maga az eredő, egy majdnem függőleges 1,755 kN. A nyomaték −32,99 kNm, ezért az eredő hatásvonala az origótól balra, 18,8 m-re metszi az x tengelyt.",
    kepletek: ["\\Fx 0,062,\\quad \\Fy 1,754\\ \\text{kN};\\quad \\Mp{O} -32,99\\ \\text{kNm}", "(\\underline{F}_1, \\underline{F}_2, \\underline{F}_3, M) \\ekv \\underline{R},\\quad -32,99 = x_0\\cdot 1,754 \\;\\Rightarrow\\; x_0 = -18,81\\ \\text{m}"],
  },
];

function Rajz(t) {
  const hszU = arany(t, 0.3, 1.4);
  const eroU = [0, 1, 2].map((i) => arany(t, 1.5 + i * 0.6, 2.1 + i * 0.6));
  const mU = arany(t, 3.3, 3.9);
  const lancU = [0, 1, 2].map((i) => arany(t, 4.3 + i * 0.8, 5.0 + i * 0.8));
  const zarFel = arany(t, 6.8, 7.4);
  const nyomU = [0, 1, 2, 3].map((i) => arany(t, 8.2 + i * 0.7, 8.8 + i * 0.7));
  const nagyIvU = arany(t, 11.0, 11.8);
  const abU = arany(t, 12.2, 13.0, rugo); // a → b átmenet
  const bFel = arany(t, 13.2, 13.8);
  const bcU = arany(t, 15.7, 16.5, rugo); // b → c átmenet
  const rU = arany(t, 16.6, 17.4);
  const rO = arany(t, 17.6, 18.2);
  const csusz = arany(t, 18.3, 19.6, rugo);
  const x0Fel = arany(t, 19.6, 20.2);

  // aktuális erők (a → b → c)
  const F = [0, 1, 2].map((i) => lerp(lerp(ADAT.a.F[i], ADAT.b.F[i], abU), ADAT.c.F[i], bcU));
  const Mkul = lerp(lerp(ADAT.a.M, ADAT.b.M, abU), ADAT.c.M, bcU);
  const komp = F.map((f, i) => ({ x: f * IR[i].x, y: f * IR[i].y }));
  const R = komp.reduce((s, k) => ({ x: s.x + k.x, y: s.y + k.y }), { x: 0, y: 0 });
  const Mreszek = [2 * komp[0].y, 2 * komp[1].y, -3 * komp[2].y, Mkul];
  const Msum = Mreszek.reduce((s, m) => s + m, 0);
  const halmaz = bcU > 0.5 ? "c" : abU > 0.5 ? "b" : "a";
  const f1 = (n, d = 2) => n.toFixed(d).replace(".", ",").replace("-", "−");

  // lánc a jobb oldalon
  const S0 = { x: 590, y: 80 };
  const lanc = [S0];
  komp.forEach((k) => lanc.push({ x: lanc[lanc.length - 1].x + k.x * E, y: lanc[lanc.length - 1].y - k.y * E }));
  const rTolas = lerp(0, X0, csusz);

  return (
    <svg viewBox="0 0 660 400" className="abra w-full select-none">
      <defs>
        {SZ.map((s, i) => (
          <Hegy key={i} id={`h4-${i}`} szin={s} />
        ))}
        <Hegy id="h4-t" szin="#475569" />
        <Hegy id="h4-m" szin="#9f1239" />
        <Hegy id="h4-r" szin="#7c3aed" />
      </defs>

      {/* tengelyek */}
      <line x1={OX - 330} y1={OY} x2={OX + 100} y2={OY} stroke="#475569" strokeWidth="1.2" markerEnd="url(#h4-t)" />
      <line x1={OX} y1={OY + 110} x2={OX} y2={OY - 170} stroke="#475569" strokeWidth="1.2" markerEnd="url(#h4-t)" />
      <text x={OX + 106} y={OY + 5} fontSize="13" fontStyle="italic" fill="#1d3c48">x</text>
      <text x={OX + 7} y={OY - 174} fontSize="13" fontStyle="italic" fill="#1d3c48">y</text>
      <text x={OX + 6} y={OY + 16} fontSize="12" fontWeight="600" fill="#475569">O</text>

      {/* háromszög */}
      <VonalA x1={px(A.x)} y1={py(A.y)} x2={px(B.x)} y2={py(B.y)} u={hszU} szin="#94a3b8" />
      <VonalA x1={px(B.x)} y1={py(B.y)} x2={px(C.x)} y2={py(C.y)} u={hszU} szin="#94a3b8" />
      <VonalA x1={px(C.x)} y1={py(C.y)} x2={px(A.x)} y2={py(A.y)} u={hszU} szin="#94a3b8" />
      <g opacity={hszU}>
        <FeliratA x={px(A.x) - 8} y={py(A.y) - 6} szin="#475569" meret={11} vastag={false} horgony="end">(−3; 8)</FeliratA>
        <FeliratA x={px(B.x) + 8} y={py(B.y) - 8} szin="#475569" meret={11} vastag={false} horgony="start">(2; 0)</FeliratA>
        <FeliratA x={px(C.x) - 8} y={py(C.y) + 14} szin="#475569" meret={11} vastag={false} horgony="end">(−3; −4)</FeliratA>
      </g>

      {/* erők az oldalak mentén, az oldal közepére centrálva */}
      {[0, 1, 2].map((i) => {
        const h = F[i] * E;
        const cx = px(KOZEP[i].x);
        const cy = py(KOZEP[i].y);
        const x1 = cx - (IR[i].x * h) / 2;
        const y1 = cy + (IR[i].y * h) / 2;
        const x2 = cx + (IR[i].x * h) / 2;
        const y2 = cy - (IR[i].y * h) / 2;
        const lab = [
          [-10, 14],
          [12, 4],
          [-10, 4],
        ][i];
        return (
          <g key={i}>
            <NyilA x1={x1} y1={y1} x2={x2} y2={y2} u={eroU[i]} szin={SZ[i]} hegy={`h4-${i}`} vastag={3.2} />
            <FeliratA x={cx + lab[0]} y={cy + lab[1]} szin={SZ[i]} meret={11.5} opacitas={arany(t, 2.0 + i * 0.6, 2.3 + i * 0.6)} horgony={lab[0] < 0 ? "end" : "start"}>
              F{["₁", "₂", "₃"][i]} = {f1(F[i], 2)} kN
            </FeliratA>
          </g>
        );
      })}
      {/* külső nyomaték az origóban */}
      {Math.abs(Mkul) > 0.05 && (
        <>
          <IvA cx={OX} cy={OY} r={22} kezdoFok={-40} vegFok={220} u={mU} szin="#9f1239" vastag={2} hegy="h4-m" />
          <FeliratA x={OX + 30} y={OY + 34} szin="#9f1239" meret={11.5} opacitas={mU} horgony="start">M = {f1(Mkul, 0)} kNm</FeliratA>
        </>
      )}

      {/* lánc a jobb felső sarokban */}
      {t >= 4.3 && (
        <g>
          <FeliratA x={S0.x - 20} y={S0.y - 18} szin="#475569" meret={11.5} vastag={false} opacitas={lancU[0]}>vektorlánc</FeliratA>
          {[0, 1, 2].map((i) => (
            <NyilA key={`l${i}`} x1={lanc[i].x} y1={lanc[i].y} x2={lanc[i + 1].x} y2={lanc[i + 1].y} u={lancU[i]} szin={SZ[i]} hegy={`h4-${i}`} vastag={2.6} />
          ))}
          <PontA x={S0.x} y={S0.y} r={4} szin="#475569" u={lancU[0]} />
          {halmaz !== "c" && (
            <FeliratA x={648} y={Math.max(lanc[2].y, lanc[1].y) + 34} szin="#15803d" meret={11.5} opacitas={zarFel * (1 - bcU)} horgony="end">
              bezárul: ΣF = 0
            </FeliratA>
          )}
          {/* c): a hézag az eredő */}
          {bcU > 0.5 && (
            <>
              <NyilA x1={lanc[3].x} y1={lanc[3].y} x2={S0.x} y2={S0.y} u={rU} szin="#7c3aed" hegy="h4-r" vastag={3.4} />
              <FeliratA x={648} y={Math.max(lanc[2].y, lanc[1].y) + 34} szin="#7c3aed" meret={11.5} opacitas={rU} horgony="end">nem zárul: R = 1,755 kN</FeliratA>
            </>
          )}
        </g>
      )}

      {/* nyomatékok listája */}
      {t >= 8.2 && (
        <g>
          {Mreszek.map((m, i) => (
            <FeliratA key={i} x={70} y={40 + i * 17} szin={i < 3 ? SZ[i] : "#9f1239"} meret={11.5} opacitas={nyomU[i]} horgony="start">
              {i < 3 ? `M${["₁", "₂", "₃"][i]} = ${f1(m, halmaz === "c" ? 2 : 0)}` : `M = ${f1(m, 0)}`}
            </FeliratA>
          ))}
          <VonalA x1={68} y1={44 + 4 * 17 - 12} x2={180} y2={44 + 4 * 17 - 12} u={nagyIvU} szin="#9f1239" vastag={1} szaggatott={false} />
          <FeliratA x={70} y={44 + 4 * 17 + 4} szin="#9f1239" meret={12.5} opacitas={nagyIvU} horgony="start">
            ΣM = {f1(Msum, halmaz === "c" ? 2 : 0)} kNm
          </FeliratA>
          <FeliratA x={70} y={44 + 5 * 17 + 6} szin="#475569" meret={11} vastag={false} opacitas={halmaz === "c" ? rO : Math.max(nagyIvU, bFel)} horgony="start">
            {halmaz === "c" ? "R ≠ 0 → az eredő egyetlen erő" : "R = 0, M ≠ 0 → az eredő erőpár"}
          </FeliratA>
          {/* az eredő nyomaték íve a lista alatt (szabad vektor: bárhová rajzolható); az órajárással egyező, mert ΣM < 0 */}
          <IvA cx={150} cy={172} r={26} kezdoFok={150} vegFok={30} u={nagyIvU} szin="#9f1239" vastag={2 + Math.min(4, Math.abs(Msum) / 30)} hegy="h4-m" opacitas={(1 - csusz) * 0.95} />
          <FeliratA x={150} y={176} szin="#9f1239" meret={11.5} opacitas={nagyIvU * (1 - csusz)}>ΣM</FeliratA>
        </g>
      )}

      {/* c): R az origóban, majd x0-ba csúszik */}
      {rO > 0.02 && (
        <g>
          <NyilA x1={px(rTolas)} y1={OY} x2={px(rTolas) + R.x * E * 6} y2={OY - R.y * E * 6} u={rO} szin="#7c3aed" hegy="h4-r" vastag={4} />
          <FeliratA x={px(rTolas) + 10} y={OY + 18} szin="#7c3aed" meret={12.5} opacitas={rO} horgony="start">R = 1,755 kN (6× nagyítva)</FeliratA>
          <PontA x={px(X0)} y={OY} r={4.5} szin="#7c3aed" u={x0Fel} />
          <g opacity={x0Fel}>
            <VonalA x1={OX} y1={OY + 96} x2={px(X0)} y2={OY + 96} szin="#7c3aed" vastag={1.3} szaggatott={false} />
            <FeliratA x={px(X0 / 2)} y={OY + 112} szin="#7c3aed" meret={12.5}>x₀ = −18,8 m</FeliratA>
          </g>
        </g>
      )}
    </svg>
  );
}

export default function FilmGyf4() {
  return (
    <FeladatFilm
      cim="GYF‑4 · Ugyanaz az ábra, három adat — erőpár, erőpár, egyetlen erő"
      hossz={20.6}
      fejezetek={FEJEZETEK}
      rajz={Rajz}
      megjegyzes="A jobb felső sarokban a vektorlánc mutatja, zárul-e az erők összege; a bal oldali lista a nyomatékokat."
    />
  );
}
