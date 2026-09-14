"use client";

import FeladatFilm from "@/components/anim/FeladatFilm";
import { arany, lerp, rugo, lukteto } from "@/components/anim/Idovonal";
import { Hegy, VonalA, FeliratA, PontA } from "@/components/anim/FilmElemek";

const M = 2.4; // képpont / cm
const OX = 300; // az origó: a felső él és a z tengely metszése
const OY = 70;
const X = (y) => OX - y * M;
const Y = (z) => OY + z * M;
const R = 50;
const PI = Math.PI;
const E = (4 * R) / (3 * PI); // 21,22

const A1 = 2500, S1 = { y: 25, z: 25 };
const A2 = (R * R * PI) / 4, S2 = { y: 50 - E, z: 50 - E };
const A3 = A2, S3 = { y: -E, z: 50 - E };
const A12 = A1 - A2;
const S12 = { y: (A1 * S1.y - A2 * S2.y) / A12, z: (A1 * S1.z - A2 * S2.z) / A12 };
const A123 = A12 + A3;
const S123 = { y: (A12 * S12.y + A3 * S3.y) / A123, z: (A12 * S12.z + A3 * S3.z) / A123 }; // (−14,27; 25)

const IDOM = "#bcdce2";
const KERET = "#234957";
const PIROS = "#be123c";
const ZOLD = "#15803d";
const NAR = "#e2590a";
const f = (n, d = 2) => n.toFixed(d).replace(".", ",").replace("-", "−");

const FEJEZETEK = [
  {
    t0: 0,
    cim: "A négyzet",
    szoveg: "Az idom egy 50 cm-es négyzetből indul, a z tengelytől balra. Súlypontja a közepén: (25; 25).",
    kepletek: ["A_1 = 2\\,500\\ \\text{cm}^2,\\quad S_1 = (25;\\ 25)"],
  },
  {
    t0: 3,
    cim: "Kivonunk egy negyedkört",
    szoveg: "A négyzet bal alsó sarka körüli negyedkört kivágjuk. A negyedkör súlypontja a középponttól mindkét irányban 4r/3π = 21,22 cm-re van. S a kivágástól elfelé, az origó sarka felé szalad.",
    kepletek: ["A_2 = \\tfrac{50^2\\pi}{4} = 1\\,963{,}5,\\quad S_2 = (50 - 21{,}22;\\ 50 - 21{,}22) = (28{,}78;\\ 28{,}78)"],
  },
  {
    t0: 7.4,
    cim: "Hozzáadunk egy negyedkört a másik oldalon",
    szoveg: "A z tengely jobb oldalán ugyanakkora negyedkört adunk hozzá, (0; 50) középponttal. S most a hozzáadott rész felé mozdul — át a z tengely másik oldalára.",
    kepletek: ["A_3 = 1\\,963{,}5,\\quad S_3 = (-21{,}22;\\ 28{,}78)"],
  },
  {
    t0: 11.6,
    cim: "Az eredmény: negatív y_S",
    szoveg: "A két negyedkör területe kiejti egymást (A = 2 500 cm²), a z tengelyre vett statikai nyomatékuk viszont nem. z_S = 25 cm a szimmetria miatt; y_S negatív, mert a súlypont a z tengelytől jobbra van.",
    kepletek: ["y_S = \\frac{62\\,500 - 56\\,508 - 41\\,667}{2\\,500} = -14{,}27\\ \\text{cm},\\qquad z_S = 25\\ \\text{cm}"],
  },
];

function Rajz(t) {
  const negyU = arany(t, 0.4, 1.4);
  const s1U = arany(t, 1.6, 2.2);
  const k2U = arany(t, 3.2, 4.0);
  const s2U = arany(t, 4.0, 4.5);
  const moz1 = arany(t, 4.8, 6.6, rugo);
  const k3U = arany(t, 7.6, 8.4);
  const s3U = arany(t, 8.4, 8.9);
  const moz2 = arany(t, 9.2, 11.0, rugo);
  const meretFel = arany(t, 11.8, 12.6);

  let S = { ...S1 };
  if (moz1 > 0) S = { y: lerp(S1.y, S12.y, moz1), z: lerp(S1.z, S12.z, moz1) };
  if (moz2 > 0) S = { y: lerp(S12.y, S123.y, moz2), z: lerp(S12.z, S123.z, moz2) };
  const luk = 1 + 0.15 * lukteto(t, 1.2);
  const r = R * M;

  return (
    <svg viewBox="0 0 560 330" className="abra w-full select-none">
      <defs>
        <Hegy id="s6-t" szin="#475569" />
        <pattern id="s6-vonalka" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke={PIROS} strokeWidth="1" opacity="0.55" />
        </pattern>
      </defs>

      {/* négyzet */}
      <rect x={X(50)} y={Y(0)} width={50 * M} height={50 * M * negyU} fill={IDOM} stroke={KERET} strokeWidth="1.5" />
      {/* kivont negyedkör: középpont (50;50), a négyzet bal alsó sarka */}
      <g opacity={k2U}>
        <path d={`M ${X(50)} ${Y(50)} L ${X(50)} ${Y(0)} A ${r} ${r} 0 0 1 ${X(0)} ${Y(50)} Z`} fill="white" />
        <path d={`M ${X(50)} ${Y(50)} L ${X(50)} ${Y(0)} A ${r} ${r} 0 0 1 ${X(0)} ${Y(50)} Z`} fill="url(#s6-vonalka)" stroke={PIROS} strokeWidth="1.2" strokeDasharray="4 3" />
        <PontA x={X(S2.y)} y={Y(S2.z)} r={4} szin={PIROS} u={s2U} />
        <FeliratA x={X(S2.y)} y={Y(S2.z) + 18} szin={PIROS} meret={11.5} opacitas={s2U}>S₂ (−A₂)</FeliratA>
      </g>
      {/* hozzáadott negyedkör: középpont (0;50) */}
      <g opacity={k3U}>
        <path d={`M ${X(0)} ${Y(50)} L ${X(-50)} ${Y(50)} A ${r} ${r} 0 0 0 ${X(0)} ${Y(0)} Z`} fill={IDOM} stroke={KERET} strokeWidth="1.5" />
        <PontA x={X(S3.y)} y={Y(S3.z)} r={4} szin={ZOLD} u={s3U} />
        <FeliratA x={X(S3.y)} y={Y(S3.z) + 18} szin={ZOLD} meret={11.5} opacitas={s3U}>S₃ (+A₃)</FeliratA>
      </g>

      {/* tengelyek */}
      <line x1={OX} y1={OY} x2={OX - 150} y2={OY} stroke="#475569" strokeWidth="1.2" markerEnd="url(#s6-t)" />
      <line x1={OX} y1={OY} x2={OX} y2={Y(50) + 40} stroke="#475569" strokeWidth="1.2" markerEnd="url(#s6-t)" />
      <text x={OX - 156} y={OY + 4} textAnchor="end" fontSize="12" fontStyle="italic" fill="#1d3c48">y</text>
      <text x={OX + 6} y={Y(50) + 44} fontSize="12" fontStyle="italic" fill="#1d3c48">z</text>
      <FeliratA x={X(25)} y={Y(50) + 18} szin="#64748b" meret={11} vastag={false} opacitas={negyU}>50 cm</FeliratA>
      <FeliratA x={X(-25)} y={Y(50) + 18} szin="#64748b" meret={11} vastag={false} opacitas={k3U}>50 cm</FeliratA>

      {/* S nyoma */}
      {moz1 > 0.02 && <VonalA x1={X(S1.y)} y1={Y(S1.z)} x2={X(S.y)} y2={Y(S.z)} szin={NAR} opacitas={0.6} />}
      {moz2 > 0.02 && <VonalA x1={X(S12.y)} y1={Y(S12.z)} x2={X(S.y)} y2={Y(S.z)} szin={NAR} opacitas={0.6} />}
      {moz1 > 0.02 && <circle cx={X(S1.y)} cy={Y(S1.z)} r="3" fill="none" stroke={NAR} strokeWidth="1" opacity="0.5" />}
      {moz2 > 0.02 && <circle cx={X(S12.y)} cy={Y(S12.z)} r="3" fill="none" stroke={NAR} strokeWidth="1" opacity="0.5" />}

      {/* S */}
      {s1U > 0.02 && (
        <>
          <circle cx={X(S.y)} cy={Y(S.z)} r={7 * luk} fill={NAR} opacity="0.25" />
          <PontA x={X(S.y)} y={Y(S.z)} r={5.5} szin={NAR} u={s1U} />
          <FeliratA x={X(S.y) + 12} y={Y(S.z) - 8} szin={NAR} meret={13} opacitas={s1U} horgony="start">
            S ({f(S.y, 2)}; {f(S.z, 2)})
          </FeliratA>
        </>
      )}

      {/* végső méretek */}
      <g opacity={meretFel}>
        <VonalA x1={OX} y1={Y(50) + 60} x2={X(S123.y)} y2={Y(50) + 60} szin={NAR} vastag={1.3} szaggatott={false} />
        <FeliratA x={X(S123.y / 2)} y={Y(50) + 75} szin={NAR} meret={12}>yₛ = −14,27 cm (a z tengelytől jobbra)</FeliratA>
        <VonalA x1={X(S123.y)} y1={Y(S123.z)} x2={X(S123.y)} y2={Y(50) + 64} szin={NAR} opacitas={0.6} />
        <VonalA x1={X(-50) + 30} y1={Y(0)} x2={X(-50) + 30} y2={Y(S123.z)} szin={NAR} vastag={1.3} szaggatott={false} />
        <FeliratA x={X(-50) + 36} y={Y(S123.z / 2) + 4} szin={NAR} meret={12} horgony="start">zₛ = 25 cm</FeliratA>
      </g>
    </svg>
  );
}

export default function FilmGyf6() {
  return (
    <FeladatFilm
      cim="GYF‑6 · Negyedkör ki, negyedkör be — S átvándorol a tengelyen"
      hossz={13}
      fejezetek={FEJEZETEK}
      rajz={Rajz}
      megjegyzes="A negatív koordináta nem hiba: a súlypont az origó másik oldalán van."
    />
  );
}
