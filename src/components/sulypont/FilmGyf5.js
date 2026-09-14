"use client";

import FeladatFilm from "@/components/anim/FeladatFilm";
import { arany, lerp, rugo, lukteto } from "@/components/anim/Idovonal";
import { Hegy, VonalA, FeliratA, PontA } from "@/components/anim/FilmElemek";

const M = 0.9; // képpont / mm
const OX = 420; // az origó: a jobb felső sarok
const OY = 60;
const X = (y) => OX - y * M;
const Y = (z) => OY + z * M;

const A1 = 60000, S1 = { y: 150, z: 100 };
const A2 = 6000, S2 = { y: 240, z: 75 };
const A3 = 27000, S3 = { y: 90, z: 75 };
// S az első kivágás után
const A12 = A1 - A2;
const S12 = { y: (A1 * S1.y - A2 * S2.y) / A12, z: (A1 * S1.z - A2 * S2.z) / A12 }; // (140; 102,78)
const A123 = A12 - A3;
const S123 = { y: (A12 * S12.y - A3 * S3.y) / A123, z: (A12 * S12.z - A3 * S3.z) / A123 }; // (190; 130,6)

const IDOM = "#bcdce2";
const KERET = "#234957";
const PIROS = "#be123c";
const NAR = "#e2590a";

const FEJEZETEK = [
  {
    t0: 0,
    cim: "A teljes téglalap",
    szoveg: "Kivonásos módszer: a 300×200-as teljes téglalapból indulunk, aminek a súlypontja a közepén van. Az origó a jobb felső sarok, y balra, z lefelé.",
    kepletek: ["A_1 = 300\\cdot 200 = 60\\,000\\ \\text{mm}^2,\\quad S_1 = (150;\\ 100)"],
  },
  {
    t0: 3,
    cim: "Az első kivágás: a súlypont elfelé tolódik",
    szoveg: "A 40×150-es kivágás negatív területként számít. Figyeld, merre mozdul S: a lyuktól elfelé, mert onnan „hiányzik az anyag”.",
    kepletek: ["A_2 = 40\\cdot 150 = 6\\,000,\\quad S_2 = (240;\\ 75)"],
  },
  {
    t0: 7,
    cim: "A második kivágás",
    szoveg: "A 180×150-es kivágás sokkal nagyobb, ezért sokkal messzebbre tolja S-t: balra (a bal fal felé) és lefelé (az alsó lemezbe).",
    kepletek: ["A_3 = 180\\cdot 150 = 27\\,000,\\quad S_3 = (90;\\ 75)"],
  },
  {
    t0: 11,
    cim: "A számítás egyben",
    szoveg: "A táblázat ugyanezt adja egy lépésben: a három rész előjeles területe és statikai nyomatéka.",
    kepletek: [
      "A = 60\\,000 - 6\\,000 - 27\\,000 = 27\\,000\\ \\text{mm}^2",
      "y_S = \\frac{60\\,000\\cdot 150 - 6\\,000\\cdot 240 - 27\\,000\\cdot 90}{27\\,000} = 190\\ \\text{mm}",
      "z_S = \\frac{60\\,000\\cdot 100 - 6\\,000\\cdot 75 - 27\\,000\\cdot 75}{27\\,000} = 130{,}6\\ \\text{mm}",
    ],
  },
];

function Rajz(t) {
  const rectU = arany(t, 0.4, 1.4);
  const s1U = arany(t, 1.6, 2.2);
  const k2U = arany(t, 3.2, 4.0); // kivágás megjelenik
  const s2U = arany(t, 4.0, 4.5);
  const moz1 = arany(t, 4.7, 6.2, rugo); // S → S12
  const k3U = arany(t, 7.2, 8.0);
  const s3U = arany(t, 8.0, 8.5);
  const moz2 = arany(t, 8.7, 10.4, rugo); // S12 → S123
  const meretFel = arany(t, 11.2, 12.0);

  // S aktuális helye
  let S = { ...S1 };
  if (moz1 > 0) S = { y: lerp(S1.y, S12.y, moz1), z: lerp(S1.z, S12.z, moz1) };
  if (moz2 > 0) S = { y: lerp(S12.y, S123.y, moz2), z: lerp(S12.z, S123.z, moz2) };

  const luk = 1 + 0.15 * lukteto(t, 1.2);

  return (
    <svg viewBox="0 0 560 330" className="abra w-full select-none">
      <defs>
        <Hegy id="s5-t" szin="#475569" />
        <Hegy id="s5-m" szin="#94a3b8" />
        <pattern id="s5-vonalka" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke={PIROS} strokeWidth="1" opacity="0.55" />
        </pattern>
      </defs>

      {/* teljes téglalap */}
      <rect x={X(300)} y={Y(0)} width={300 * M * rectU} height={200 * M} fill={IDOM} stroke={KERET} strokeWidth="1.5" />
      {/* kivágások */}
      <g opacity={k2U}>
        <rect x={X(260)} y={Y(0)} width={40 * M} height={150 * M} fill="white" />
        <rect x={X(260)} y={Y(0)} width={40 * M} height={150 * M} fill="url(#s5-vonalka)" stroke={PIROS} strokeWidth="1.2" strokeDasharray="4 3" />
        <FeliratA x={X(240)} y={Y(75) - 12} szin={PIROS} meret={11.5} opacitas={s2U}>−A₂</FeliratA>
        <PontA x={X(240)} y={Y(75)} r={4} szin={PIROS} u={s2U} />
      </g>
      <g opacity={k3U}>
        <rect x={X(180)} y={Y(0)} width={180 * M} height={150 * M} fill="white" />
        <rect x={X(180)} y={Y(0)} width={180 * M} height={150 * M} fill="url(#s5-vonalka)" stroke={PIROS} strokeWidth="1.2" strokeDasharray="4 3" />
        <FeliratA x={X(90)} y={Y(75) - 12} szin={PIROS} meret={11.5} opacitas={s3U}>−A₃</FeliratA>
        <PontA x={X(90)} y={Y(75)} r={4} szin={PIROS} u={s3U} />
      </g>
      {/* a jobb oldali kivágás széle: a külső kontúr ott nem létezik */}
      <line x1={X(0)} y1={Y(0)} x2={X(0)} y2={Y(150)} stroke="white" strokeWidth="2.5" opacity={k3U} />

      {/* tengelyek */}
      <line x1={OX} y1={OY} x2={OX - 80} y2={OY} stroke="#475569" strokeWidth="1.2" markerEnd="url(#s5-t)" />
      <line x1={OX} y1={OY} x2={OX} y2={Y(200) + 30} stroke="#475569" strokeWidth="1.2" markerEnd="url(#s5-t)" />
      <text x={OX - 86} y={OY + 4} textAnchor="end" fontSize="12" fontStyle="italic" fill="#1d3c48">y</text>
      <text x={OX + 6} y={Y(200) + 34} fontSize="12" fontStyle="italic" fill="#1d3c48">z</text>

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
            S ({S.y.toFixed(0)}; {S.z.toFixed(1).replace(".", ",")})
          </FeliratA>
        </>
      )}

      {/* végső méretek */}
      <g opacity={meretFel}>
        <VonalA x1={X(0)} y1={Y(200) + 22} x2={X(S123.y)} y2={Y(200) + 22} szin={NAR} vastag={1.3} szaggatott={false} />
        <FeliratA x={X(S123.y / 2)} y={Y(200) + 37} szin={NAR} meret={12}>yₛ = 190 mm</FeliratA>
        <VonalA x1={X(300) - 22} y1={Y(0)} x2={X(300) - 22} y2={Y(S123.z)} szin={NAR} vastag={1.3} szaggatott={false} />
        <FeliratA x={X(300) - 28} y={Y(S123.z / 2) + 4} szin={NAR} meret={12} horgony="end">zₛ = 130,6</FeliratA>
        <VonalA x1={X(S123.y)} y1={Y(S123.z)} x2={X(S123.y)} y2={Y(200) + 26} szin={NAR} opacitas={0.6} />
        <VonalA x1={X(S123.y)} y1={Y(S123.z)} x2={X(300) - 26} y2={Y(S123.z)} szin={NAR} opacitas={0.6} />
      </g>
    </svg>
  );
}

export default function FilmGyf5() {
  return (
    <FeladatFilm
      cim="GYF‑5 · Kivonás: a súlypont a lyuktól elfelé tolódik"
      hossz={12.4}
      fejezetek={FEJEZETEK}
      rajz={Rajz}
      megjegyzes="A pont mindig a hozzáadott részek felé és a kivont részektől elfelé mozdul — ez jó ellenőrzés fejben is."
    />
  );
}
