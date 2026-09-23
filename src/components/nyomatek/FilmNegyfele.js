"use client";

import FeladatFilm from "@/components/anim/FeladatFilm";
import { arany, lerp, rugo } from "@/components/anim/Idovonal";
import { Hegy, NyilA, VonalA, FeliratA, IvA, PontA } from "@/components/anim/FilmElemek";

/*
 * GYF‑A · M = −24 kNm négyféleképpen (tankönyv 3.7. ábra)
 * r = (2; 3) m, F = (6; −3) kN. Ugyanaz a nyomaték: képlettel, erő×kar,
 * komponensekkel a támadáspontban, komponensekkel a tengelymetszetben.
 */

const OX = 70;
const OY = 262;
const L = 50; // képpont / m
const K = 0.32; // m / kN – az erőnyíl léptéke
const P = { x: 2, y: 3 };
const TALP = { x: 1.6, y: 3.2 };
const px = (x) => OX + x * L;
const py = (y) => OY - y * L;

const NAR = "#e2590a";
const ZOLD = "#0f766e";
const LILA = "#7c3aed";
const BORDO = "#9f1239";
const KEK = "#2563eb";

const FEJEZETEK = [
  {
    t0: 0,
    cim: "Az adatok: r és F",
    szoveg: "A helyvektor az origóból a P támadáspontba mutat, az erő (6; −3) kN. A hatásvonal az x tengelyt 8 m-nél, az y tengelyt 4 m-nél metszi — ezt később használjuk.",
    kepletek: ["\\underline{r} = (2;\\ 3)\\ \\text{m},\\qquad \\underline{F} = (6;\\ -3)\\ \\text{kN}"],
  },
  {
    t0: 4,
    cim: "(i) Képlettel",
    szoveg: "A vektoriális szorzat z-komponense. Az előjel automatikusan jön ki: negatív, tehát az óramutató járásával egyezően forgat az origó körül.",
    kepletek: ["M_O = x F_y - y F_x = 2\\cdot(-3) - 3\\cdot 6 = -24\\ \\text{kNm}"],
  },
  {
    t0: 8,
    cim: "(ii) Erő × kar, a terület-trükkel",
    szoveg: "Az origóba tűt szúrva F az óramutató irányába forgatná a papírt: az előjel negatív. A d kart a nagy derékszögű háromszög területéből kapjuk, kétféleképpen felírva.",
    kepletek: [
      "F = \\sqrt{6^2 + (-3)^2} = 6,708\\ \\text{kN}",
      "\\frac{8\\cdot 4}{2} = \\frac{\\sqrt{8^2 + 4^2}\\cdot d}{2}\\ \\Rightarrow\\ d = 3,578\\ \\text{m}",
      "M_O = -6,708\\cdot 3,578 = -24,00\\ \\text{kNm}",
    ],
  },
  {
    t0: 14,
    cim: "(iii) Komponensek a támadáspontban",
    szoveg: "A vízszintes komponens karja a függőleges távolság (3 m), a függőlegesé a vízszintes (2 m). Az előjeleket szemléletből: mindkét komponens az óramutató irányába forgat.",
    kepletek: ["M_O = -6\\cdot 3 - 3\\cdot 2 = -24\\ \\text{kNm}"],
  },
  {
    t0: 19,
    cim: "(iv) Komponensek a tengelymetszetben",
    szoveg: "Az erő a hatásvonala mentén eltolható. Az x tengelyen a vízszintes komponens karja nulla; az y tengelyen a függőlegesé. Ez a leggyorsabb kézi módszer.",
    kepletek: ["M_O = 0 - 3\\cdot 8 = -24\\ \\text{kNm}", "M_O = -6\\cdot 4 + 0 = -24\\ \\text{kNm}"],
  },
];

function Rajz(t) {
  const rU = arany(t, 0.4, 1.2);
  const fU = arany(t, 1.3, 2.1);
  const hvU = arany(t, 2.2, 3.2);
  const metszFel = arany(t, 3.0, 3.6);

  const forgIv = arany(t, 4.6, 5.6);
  const kepletFel = arany(t, 5.8, 6.4);

  const haromszogU = arany(t, 8.4, 9.4);
  const karU = arany(t, 9.6, 10.4);
  const karFel = arany(t, 10.6, 11.2);

  const kompPU = arany(t, 14.4, 15.2);
  const karPU = arany(t, 15.4, 16.2);

  const csuszX = arany(t, 19.3, 20.6, rugo); // P → (8; 0)
  const kompXU = arany(t, 20.7, 21.4);
  const csuszY = arany(t, 22.6, 23.9, rugo); // (8; 0) → (0; 4)
  const kompYU = arany(t, 24.0, 24.7);

  // az erő aktuális támadáspontja a hatásvonalon
  const cel1 = { x: 8, y: 0 };
  const cel2 = { x: 0, y: 4 };
  let Q = { x: lerp(P.x, cel1.x, csuszX), y: lerp(P.y, cel1.y, csuszX) };
  if (csuszY > 0) Q = { x: lerp(cel1.x, cel2.x, csuszY), y: lerp(cel1.y, cel2.y, csuszY) };
  const fejezet4 = t >= 19;
  const Fx = 6 * K;
  const Fy = -3 * K;

  return (
    <svg viewBox="0 0 600 330" className="abra w-full select-none">
      <defs>
        <Hegy id="nf4-ero" szin={NAR} />
        <Hegy id="nf4-r" szin={ZOLD} />
        <Hegy id="nf4-k" szin={KEK} />
        <Hegy id="nf4-m" szin={BORDO} />
        <Hegy id="nf4-t" szin="#475569" />
      </defs>

      {/* tengelyek */}
      <line x1={OX - 30} y1={OY} x2={OX + 500} y2={OY} stroke="#475569" strokeWidth="1.2" markerEnd="url(#nf4-t)" />
      <line x1={OX} y1={OY + 30} x2={OX} y2={OY - 240} stroke="#475569" strokeWidth="1.2" markerEnd="url(#nf4-t)" />
      <text x={OX + 506} y={OY + 5} fontSize="13" fontStyle="italic" fill="#1d3c48">x</text>
      <text x={OX + 7} y={OY - 244} fontSize="13" fontStyle="italic" fill="#1d3c48">y</text>
      <text x={OX - 14} y={OY + 16} fontSize="12" fontWeight="600" fill="#475569">O</text>

      {/* a nagy derékszögű háromszög (ii) */}
      {haromszogU > 0.01 && (
        <path
          d={`M ${OX} ${OY} L ${px(8)} ${OY} L ${px(0)} ${py(4)} Z`}
          fill={LILA}
          opacity={0.1 * haromszogU}
        />
      )}

      {/* hatásvonal */}
      <VonalA x1={px(0)} y1={py(4)} x2={px(8)} y2={py(0)} u={hvU} szin="#94a3b8" vastag={1.3} />
      <PontA x={px(8)} y={py(0)} r={3.5} szin="#94a3b8" u={metszFel} />
      <PontA x={px(0)} y={py(4)} r={3.5} szin="#94a3b8" u={metszFel} />
      <FeliratA x={px(8)} y={OY + 18} szin="#64748b" meret={11.5} vastag={false} opacitas={metszFel}>8 m</FeliratA>
      <FeliratA x={OX - 10} y={py(4) + 4} szin="#64748b" meret={11.5} vastag={false} opacitas={metszFel} horgony="end">4 m</FeliratA>

      {/* méretvonalak P-hez */}
      <VonalA x1={px(P.x)} y1={py(P.y)} x2={px(P.x)} y2={OY} u={rU} szin="#cbd5e1" />
      <VonalA x1={px(P.x)} y1={py(P.y)} x2={OX} y2={py(P.y)} u={rU} szin="#cbd5e1" />
      <FeliratA x={px(P.x)} y={OY + 18} szin="#64748b" meret={11.5} vastag={false} opacitas={rU}>2 m</FeliratA>
      <FeliratA x={OX - 10} y={py(P.y) + 4} szin="#64748b" meret={11.5} vastag={false} opacitas={rU} horgony="end">3 m</FeliratA>

      {/* r */}
      <NyilA x1={OX} y1={OY} x2={px(P.x)} y2={py(P.y)} u={rU} szin={ZOLD} hegy="nf4-r" vastag={2.8} />
      <FeliratA x={px(P.x) - 20} y={py(P.y) + 34} szin={ZOLD} meret={13} opacitas={rU} dolt>r</FeliratA>
      <PontA x={px(P.x)} y={py(P.y)} r={4} szin="#1d3c48" u={rU} />
      <FeliratA x={px(P.x) + 8} y={py(P.y) - 10} szin="#475569" meret={11.5} vastag={false} opacitas={arany(t, 1.0, 1.4) * (1 - csuszX)}>P (2; 3)</FeliratA>

      {/* (ii) a kar */}
      <VonalA x1={OX} y1={OY} x2={px(TALP.x)} y2={py(TALP.y)} u={karU} szin={LILA} vastag={2.2} />
      <FeliratA x={px(TALP.x / 2) - 18} y={py(TALP.y / 2)} szin={LILA} meret={13} opacitas={karFel} dolt>d = 3,578 m</FeliratA>
      <g opacity={karU}>
        <path d={`M ${px(TALP.x) - 6} ${py(TALP.y) + 4} l 4 8 l 8 -4`} fill="none" stroke="#94a3b8" strokeWidth="1.1" />
      </g>
      <FeliratA x={px(3.4)} y={py(1.2)} szin={LILA} meret={11.5} vastag={false} opacitas={haromszogU * (1 - karU)}>
        terület = 8·4/2 = 16 m²
      </FeliratA>
      <FeliratA x={px(3.4)} y={py(1.2)} szin={LILA} meret={11.5} vastag={false} opacitas={karFel * (1 - kompPU)}>
        terület = √(8²+4²)·d/2 → d = 3,578 m
      </FeliratA>

      {/* (iii) komponensek a P pontban és a karjaik */}
      {kompPU > 0.01 && !fejezet4 && (
        <g>
          <NyilA x1={px(P.x)} y1={py(P.y)} x2={px(P.x + Fx)} y2={py(P.y)} u={kompPU} szin={KEK} hegy="nf4-k" vastag={2.6} />
          <NyilA x1={px(P.x)} y1={py(P.y)} x2={px(P.x)} y2={py(P.y + Fy)} u={kompPU} szin={KEK} hegy="nf4-k" vastag={2.6} />
          <FeliratA x={px(P.x + Fx) + 4} y={py(P.y) + 16} szin={KEK} meret={11.5} opacitas={kompPU} horgony="start">6 kN</FeliratA>
          <FeliratA x={px(P.x) + 8} y={py(P.y + Fy) + 14} szin={KEK} meret={11.5} opacitas={kompPU} horgony="start">3 kN</FeliratA>
          <VonalA x1={OX + 2} y1={py(P.y)} x2={px(P.x) - 2} y2={py(P.y)} u={karPU} szin={KEK} vastag={2} szaggatott={false} />
          <VonalA x1={px(P.x)} y1={OY - 2} x2={px(P.x)} y2={py(P.y) + 2} u={karPU} szin={KEK} vastag={2} szaggatott={false} />
          <FeliratA x={px(P.x / 2)} y={py(P.y) - 6} szin={KEK} meret={11} vastag={false} opacitas={karPU}>kar: 2 m</FeliratA>
          <FeliratA x={px(P.x) + 6} y={py(P.y / 2)} szin={KEK} meret={11} vastag={false} opacitas={karPU} horgony="start">kar: 3 m</FeliratA>
          <FeliratA x={px(6.6)} y={py(3.9)} szin={KEK} meret={12.5} opacitas={karPU}>−6·3 − 3·2 = −24</FeliratA>
        </g>
      )}

      {/* az erő (a P-ben, majd a hatásvonal mentén elcsúszik) */}
      {fejezet4 && csuszX > 0.02 && (
        <NyilA x1={px(P.x)} y1={py(P.y)} x2={px(P.x + Fx)} y2={py(P.y + Fy)} szin={NAR} hegy="nf4-ero" vastag={3.4} opacitas={0.2} />
      )}
      <NyilA x1={px(Q.x)} y1={py(Q.y)} x2={px(Q.x + Fx)} y2={py(Q.y + Fy)} u={fU} szin={NAR} hegy="nf4-ero" vastag={3.4} />
      <FeliratA x={px(Q.x + Fx) + 6} y={py(Q.y + Fy) - 8} szin={NAR} meret={13.5} opacitas={fU} horgony="start" dolt>F</FeliratA>
      <FeliratA x={px(Q.x + Fx) + 6} y={py(Q.y + Fy) + 8} szin={NAR} meret={11} vastag={false} opacitas={fU * (1 - kompPU)} horgony="start">(6; −3) kN</FeliratA>

      {/* (iv) komponensek az x-metszetben */}
      {fejezet4 && kompXU > 0.01 && csuszY < 0.02 && (
        <g>
          <NyilA x1={px(8)} y1={OY} x2={px(8 + Fx)} y2={OY} u={kompXU} szin={KEK} hegy="nf4-k" vastag={2.6} />
          <NyilA x1={px(8)} y1={OY} x2={px(8)} y2={py(Fy)} u={kompXU} szin={KEK} hegy="nf4-k" vastag={2.6} />
          <FeliratA x={px(8) + 16} y={OY + 22} szin={KEK} meret={11.5} opacitas={kompXU} horgony="start">6 kN — karja 0</FeliratA>
          <FeliratA x={px(8) - 8} y={py(Fy) + 4} szin={KEK} meret={11.5} opacitas={kompXU} horgony="end">3 kN — karja 8 m</FeliratA>
          <VonalA x1={OX + 2} y1={OY + 8} x2={px(8) - 2} y2={OY + 8} u={kompXU} szin={KEK} vastag={2} szaggatott={false} />
          <FeliratA x={px(6.6)} y={py(3.9)} szin={KEK} meret={12.5} opacitas={kompXU}>0 − 3·8 = −24</FeliratA>
        </g>
      )}
      {/* (iv) komponensek az y-metszetben */}
      {fejezet4 && kompYU > 0.01 && (
        <g>
          <NyilA x1={OX} y1={py(4)} x2={px(Fx)} y2={py(4)} u={kompYU} szin={KEK} hegy="nf4-k" vastag={2.6} />
          <NyilA x1={OX} y1={py(4)} x2={OX} y2={py(4 + Fy)} u={kompYU} szin={KEK} hegy="nf4-k" vastag={2.6} />
          <FeliratA x={px(Fx) + 4} y={py(4) - 8} szin={KEK} meret={11.5} opacitas={kompYU} horgony="start">6 kN — karja 4 m</FeliratA>
          <FeliratA x={OX + 8} y={py(4 + Fy) + 18} szin={KEK} meret={10.5} opacitas={kompYU} horgony="start">3 kN, karja 0</FeliratA>
          <VonalA x1={OX - 8} y1={OY - 2} x2={OX - 8} y2={py(4) + 2} u={kompYU} szin={KEK} vastag={2} szaggatott={false} />
          <FeliratA x={px(6.6)} y={py(3.9)} szin={KEK} meret={12.5} opacitas={kompYU}>−6·4 + 0 = −24</FeliratA>
        </g>
      )}

      {/* a forgásirány az origó körül (mindegyik módszernél ugyanaz) */}
      <IvA cx={OX} cy={OY} r={30} kezdoFok={150} vegFok={30} u={forgIv} szin={BORDO} vastag={2.6} hegy="nf4-m" />
      <FeliratA x={OX + 44} y={OY - 34} szin={BORDO} meret={12.5} opacitas={kepletFel} horgony="start">
        M<tspan baselineShift="sub" fontSize="9">O</tspan> = −24 kNm ↷
      </FeliratA>
    </svg>
  );
}

export default function FilmNegyfele() {
  return (
    <FeladatFilm
      cim="GYF‑A · Ugyanaz a nyomaték négyféleképpen"
      hossz={25.4}
      fejezetek={FEJEZETEK}
      rajz={Rajz}
      megjegyzes="A négy módszer közül a tengelymetszetbe tolás a leggyorsabb kézi út: az egyik komponens karja mindig nulla."
    />
  );
}
