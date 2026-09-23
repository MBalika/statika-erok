"use client";

import FeladatFilm from "@/components/anim/FeladatFilm";
import { arany, lerp, rugo, lukteto } from "@/components/anim/Idovonal";
import { Hegy, NyilA, VonalA, FeliratA, PontA } from "@/components/anim/FilmElemek";

const M = 0.8; // képpont / mm
const OX = 230; // az origó: a felső él közepe
const OY = 56;
const X = (y) => OX - y * M; // y balra
const Y = (z) => OY + z * M; // z lefelé

const A1 = 9000;
const Z1 = 15;
const A2 = 5400;
const Z2 = 165;
const ZS = 71.25;

// mérleg (vízszintes rúd, rajta a z koordináta 0→300 balról jobbra)
const MB = 385; // bal vég
const MJ = 595; // jobb vég
const MY = 300; // a rúd magassága (képpont)
const mz = (z) => MB + ((MJ - MB) * z) / 300;

const OV = "#bcdce2";
const OV_S = "#275767";
const GER = "#fed7aa";
const GER_S = "#bc4508";
const NAR = "#e2590a";

const FEJEZETEK = [
  {
    t0: 0,
    cim: "A T-szelvény",
    szoveg: "Fejlemez 300×30 mm, gerinc 20×270 mm. Az origó a felső él közepén, y balra, z lefelé. A szimmetria miatt y_S = 0, csak z_S kérdés.",
    kepletek: ["y_S = 0\\ (\\text{szimmetria}),\\qquad z_S = ?"],
  },
  {
    t0: 2.2,
    cim: "Felbontás két téglalapra",
    szoveg: "A fejlemez és a gerinc egy-egy téglalap — mindkettőnek a közepén van a súlypontja.",
    kepletek: ["A_1 = 300\\cdot 30 = 9\\,000\\ \\text{mm}^2,\\quad A_2 = 20\\cdot 270 = 5\\,400\\ \\text{mm}^2,\\quad A = 14\\,400\\ \\text{mm}^2"],
  },
  {
    t0: 4.4,
    cim: "A részek súlypontja — a közös origótól",
    szoveg: "A gerinc közepe nem 135, hanem 30 + 135 = 165 mm mélyen van, mert a fejlemez alatt kezdődik. Ez a lépés a leggyakoribb hibaforrás.",
    kepletek: ["z_1 = \\tfrac{30}{2} = 15\\ \\text{mm},\\qquad z_2 = 30 + \\tfrac{270}{2} = 165\\ \\text{mm}"],
  },
  {
    t0: 7,
    cim: "Mérleg: a területek mint súlyok",
    szoveg: "Képzeld a két részt egy mérlegrúdra akasztva, a z koordinátájuknál, a területükkel arányos súllyal. A rúd közepén alátámasztva a nehezebb fejlemez felé billen.",
    kepletek: ["S_y = A_1 z_1 + A_2 z_2 = 9\\,000\\cdot 15 + 5\\,400\\cdot 165 = 1\\,026\\,000\\ \\text{mm}^3"],
  },
  {
    t0: 10,
    cim: "Hol áll egyensúlyban? Ez z_S",
    szoveg: "Az alátámasztást addig toljuk, amíg a rúd vízszintes: ott a nyomatékok kiegyenlítik egymást. Ez épp a súlyozott átlag.",
    kepletek: ["z_S = \\frac{S_y}{A} = \\frac{1\\,026\\,000}{14\\,400} = 71{,}25\\ \\text{mm}"],
  },
  {
    t0: 12.2,
    cim: "Összeáll a kép",
    szoveg: "A súlypont a fejlemez alatt, a gerinc felső részében van — a nehezebb fejlemezhez közel, ahogy a mérleg is mutatta.",
    kepletek: ["S = (0;\\ 71{,}25)\\ \\text{mm}"],
  },
];

function Rajz(t) {
  const korvU = arany(t, 0.4, 1.6);
  const meretFel = arany(t, 1.6, 2.1);
  const szet = arany(t, 2.4, 3.2, rugo); // szétcsúszás
  const teruletFel = arany(t, 3.2, 3.7);
  const s1 = arany(t, 4.6, 5.2);
  const s2 = arany(t, 5.4, 6.2);
  const rudU = arany(t, 7.2, 7.8);
  const repul = arany(t, 7.9, 9.0, rugo);
  const tamasz = arany(t, 9.0, 9.5);
  const billen = arany(t, 9.4, 10.0);
  const csuszik = arany(t, 10.3, 11.6, rugo);
  const zsFel = arany(t, 11.6, 12.1);
  const vissza = arany(t, 12.4, 13.2, rugo);
  const sFel = arany(t, 13.2, 13.8);

  // részek eltolása (képpont)
  const ovDy = -8 * szet * (1 - vissza);
  const gerDy = 16 * szet * (1 - vissza);
  const ovSzin = szet > 0.02 ? OV : "#dcedf0";

  // mérleg
  const tam = lerp(150, ZS, csuszik); // az alátámasztás z-koordinátája
  const nyomatek = A1 * (Z1 - tam) + A2 * (Z2 - tam); // mm³, előjeles
  const dolesFok = Math.max(-7, Math.min(7, (nyomatek / 1215000) * 7)) * billen * (1 - csuszik);
  const r1 = 5 + Math.sqrt(A1) * 0.16; // súlyok mérete
  const r2 = 5 + Math.sqrt(A2) * 0.16;

  // a részek súlypontjának képpontjai (a szétcsúszott állapotban)
  const p1 = { x: X(0), y: Y(Z1) + ovDy };
  const p2 = { x: X(0), y: Y(Z2) + gerDy };
  // a mérlegen a helyük
  const m1 = { x: mz(Z1), y: MY };
  const m2 = { x: mz(Z2), y: MY };
  const q1 = { x: lerp(p1.x, m1.x, repul), y: lerp(p1.y, m1.y, repul) };
  const q2 = { x: lerp(p2.x, m2.x, repul), y: lerp(p2.y, m2.y, repul) };

  return (
    <svg viewBox="0 0 620 390" className="abra w-full select-none">
      <defs>
        <Hegy id="s4-t" szin="#475569" />
        <Hegy id="s4-m" szin="#94a3b8" />
        <Hegy id="s4-n" szin={NAR} />
      </defs>

      {/* tengelyek */}
      <line x1={OX} y1={OY} x2={OX - 150} y2={OY} stroke="#475569" strokeWidth="1.2" markerEnd="url(#s4-t)" />
      <line x1={OX} y1={OY} x2={OX} y2={Y(300) + 24} stroke="#475569" strokeWidth="1.2" markerEnd="url(#s4-t)" opacity={0.7} />
      <text x={OX - 150} y={OY - 6} textAnchor="middle" fontSize="12" fontStyle="italic" fill="#1d3c48">y</text>
      <text x={OX + 6} y={Y(300) + 30} fontSize="12" fontStyle="italic" fill="#1d3c48">z</text>

      {/* fejlemez */}
      <g transform={`translate(0 ${ovDy})`}>
        <rect x={X(150)} y={Y(0)} width={300 * M} height={30 * M} fill={ovSzin} stroke={OV_S} strokeWidth="1.5" opacity={korvU} />
        <FeliratA x={X(82)} y={Y(30) + 15} szin={OV_S} meret={12} opacitas={teruletFel * (1 - repul * 0.5)}>A₁ = 9 000 mm²</FeliratA>
      </g>
      {/* gerinc */}
      <g transform={`translate(0 ${gerDy})`}>
        <rect x={X(10)} y={Y(30)} width={20 * M} height={270 * M} fill={szet > 0.02 ? GER : "#dcedf0"} stroke={szet > 0.02 ? GER_S : OV_S} strokeWidth="1.5" opacity={korvU} />
        <FeliratA x={X(-18)} y={Y(200)} szin={GER_S} meret={12} horgony="start" opacitas={teruletFel * (1 - repul * 0.5)}>A₂ = 5 400 mm²</FeliratA>
      </g>

      {/* méretek */}
      <g opacity={meretFel}>
        <VonalA x1={X(150)} y1={OY - 16} x2={X(-150)} y2={OY - 16} szin="#94a3b8" vastag={1} szaggatott={false} />
        <FeliratA x={X(0)} y={OY - 21} szin="#64748b" meret={11} vastag={false}>300</FeliratA>
        <FeliratA x={X(-150) + 8} y={Y(15) + 4} szin="#64748b" meret={11} vastag={false} horgony="start">30</FeliratA>
        <FeliratA x={X(-10) + 8} y={Y(300) + 12} szin="#64748b" meret={11} vastag={false} horgony="start">20</FeliratA>
        <FeliratA x={X(-10) + 8} y={Y(170)} szin="#64748b" meret={11} vastag={false} horgony="start">270</FeliratA>
      </g>

      {/* a részek súlypontja és a z méretek (bal oldalon) */}
      <PontA x={p1.x} y={p1.y} r={4} szin={OV_S} u={s1} opacitas={1 - repul} />
      <PontA x={p2.x} y={p2.y} r={4} szin={GER_S} u={s2} opacitas={1 - repul} />
      <g opacity={s1 * (1 - 0.6 * repul)}>
        <VonalA x1={X(150) - 22} y1={Y(0)} x2={X(150) - 22} y2={p1.y} szin={OV_S} vastag={1.2} szaggatott={false} />
        <VonalA x1={X(150) - 22} y1={p1.y} x2={p1.x} y2={p1.y} szin={OV_S} vastag={1} />
        <FeliratA x={X(150) - 28} y={p1.y + 4} szin={OV_S} meret={11.5} horgony="end">z₁ = 15</FeliratA>
      </g>
      <g opacity={s2 * (1 - 0.6 * repul)}>
        <VonalA x1={X(150) - 44} y1={Y(0)} x2={X(150) - 44} y2={p2.y} szin={GER_S} vastag={1.2} szaggatott={false} />
        <VonalA x1={X(150) - 44} y1={p2.y} x2={p2.x} y2={p2.y} szin={GER_S} vastag={1} />
        <FeliratA x={X(150) - 50} y={p2.y + 4} szin={GER_S} meret={11.5} horgony="end">z₂ = 165</FeliratA>
      </g>

      {/* --- mérleg --- */}
      {t >= 7.2 && (
        <g>
          {/* skála */}
          <g opacity={rudU}>
            {[0, 50, 100, 150, 200, 250, 300].map((z) => (
              <g key={z}>
                <line x1={mz(z)} y1={MY + 26} x2={mz(z)} y2={MY + 31} stroke="#94a3b8" strokeWidth="1" />
                <text x={mz(z)} y={MY + 43} textAnchor="middle" fontSize="9.5" fill="#94a3b8">{z}</text>
              </g>
            ))}
            <text x={(MB + MJ) / 2} y={MY + 58} textAnchor="middle" fontSize="11" fill="#64748b">z [mm] a felső éltől</text>
          </g>
          {/* rúd + súlyok, forgatva az alátámasztás körül */}
          <g transform={`rotate(${dolesFok} ${mz(tam)} ${MY})`}>
            <line x1={MB - 10} y1={MY} x2={MB - 10 + (MJ - MB + 20) * rudU} y2={MY} stroke="#1d3c48" strokeWidth="3.5" strokeLinecap="round" />
            {/* súlyok */}
            <g opacity={repul}>
              <line x1={m1.x} y1={MY} x2={m1.x} y2={MY - 10} stroke={OV_S} strokeWidth="1.2" />
              <circle cx={m1.x} cy={MY - 10 - r1} r={r1 * (0.95 + 0.05 * lukteto(t, 1.4))} fill={OV} stroke={OV_S} strokeWidth="1.6" />
              <text x={m1.x} y={MY - 10 - r1 + 4} textAnchor="middle" fontSize="10.5" fontWeight="650" fill={OV_S}>A₁</text>
              <line x1={m2.x} y1={MY} x2={m2.x} y2={MY - 10} stroke={GER_S} strokeWidth="1.2" />
              <circle cx={m2.x} cy={MY - 10 - r2} r={r2 * (0.95 + 0.05 * lukteto(t, 1.4))} fill={GER} stroke={GER_S} strokeWidth="1.6" />
              <text x={m2.x} y={MY - 10 - r2 + 4} textAnchor="middle" fontSize="10.5" fontWeight="650" fill={GER_S}>A₂</text>
            </g>
          </g>
          {/* alátámasztás */}
          <g opacity={tamasz}>
            <path d={`M ${mz(tam)} ${MY + 2} l -9 16 h 18 z`} fill={NAR} stroke="white" strokeWidth="1" />
          </g>
          <FeliratA x={mz(tam)} y={MY - 52} szin={NAR} meret={11.5} opacitas={tamasz * (1 - csuszik) * (t < 10.3 ? 1 : 0)}>
            középen: billen
          </FeliratA>
          <FeliratA x={mz(tam)} y={MY - 52} szin={NAR} meret={12.5} opacitas={zsFel}>
            zₛ = 71,25 mm — egyensúly
          </FeliratA>
        </g>
      )}

      {/* repülő pontok (a részek súlypontjai a mérlegre) */}
      {repul > 0.01 && repul < 0.99 && (
        <>
          <circle cx={q1.x} cy={q1.y} r={lerp(4, r1, repul)} fill={OV} stroke={OV_S} strokeWidth="1.5" />
          <circle cx={q2.x} cy={q2.y} r={lerp(4, r2, repul)} fill={GER} stroke={GER_S} strokeWidth="1.5" />
        </>
      )}

      {/* --- S és a végső méret --- */}
      {t >= 12.4 && (
        <g>
          <VonalA x1={mz(ZS)} y1={MY - 2} x2={X(0)} y2={Y(ZS)} u={vissza} szin={NAR} opacitas={0.45} />
          <line x1={X(0) - 8 - 5} y1={Y(ZS)} x2={X(0) + 8 + 5} y2={Y(ZS)} stroke={NAR} strokeWidth="1" opacity={sFel} />
          <PontA x={X(0)} y={Y(ZS)} r={5.5} szin={NAR} u={sFel} />
          <FeliratA x={X(0) + 12} y={Y(ZS) - 8} szin={NAR} meret={13} opacitas={sFel} horgony="start">S</FeliratA>
          <g opacity={sFel}>
            <VonalA x1={X(-150) + 30} y1={Y(0)} x2={X(-150) + 30} y2={Y(ZS)} szin={NAR} vastag={1.3} szaggatott={false} />
            <VonalA x1={X(-150) + 24} y1={Y(0)} x2={X(-150) + 36} y2={Y(0)} szin={NAR} vastag={1.3} szaggatott={false} />
            <VonalA x1={X(-150) + 24} y1={Y(ZS)} x2={X(-150) + 36} y2={Y(ZS)} szin={NAR} vastag={1.3} szaggatott={false} />
            <FeliratA x={X(-150) + 40} y={Y(ZS / 2) + 4} szin={NAR} meret={12} horgony="start">71,25 mm</FeliratA>
          </g>
        </g>
      )}
    </svg>
  );
}

export default function FilmGyf4() {
  return (
    <FeladatFilm
      cim="GYF‑4 · A T-szelvény súlypontja — mérleggel"
      hossz={14.2}
      fejezetek={FEJEZETEK}
      rajz={Rajz}
      megjegyzes="A mérleg csak szemléltetés: a rúd pozíciója a z koordináta, a súlyok a területek."
    />
  );
}
