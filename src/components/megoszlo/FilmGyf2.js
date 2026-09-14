"use client";

import FeladatFilm from "@/components/anim/FeladatFilm";
import { arany, lerp, rugo } from "@/components/anim/Idovonal";
import { Hegy, NyilA, VonalA, FeliratA } from "@/components/anim/FilmElemek";

const BAL = 120;
const JOBB = 480;
const TY = 210;
const L = 3.6;
const P = 7;
const PL = 9; // képpont / (kN/m)
const XL = (JOBB - BAL) / L;
const X = (x) => BAL + x * XL;
const R1 = P * 1.2; // 8,4
const SZ = ["#e2590a", "#0f766e", "#2563eb"];
const LILA = "#7c3aed";

const FEJEZETEK = [
  {
    t0: 0,
    cim: "Három szakasz, a középső felfelé",
    szoveg: "Három egyforma, 1,2 m hosszú szakasz, 7 kN/m. A középső felfelé hat, ezért a tartó alá rajzoljuk, és negatív előjelet kap.",
    kepletek: ["p = 7\\ \\text{kN/m},\\quad 3\\times 1{,}2\\ \\text{m}"],
  },
  {
    t0: 3,
    cim: "Részeredők a szakaszok közepén",
    szoveg: "Mindhárom szakasz egyenletes, az eredőjük a saját közepükön hat. Egyforma nagyságúak, csak az irányuk különbözik.",
    kepletek: ["R_1 = R_2 = R_3 = 7\\cdot 1{,}2 = 8{,}4\\ \\text{kN},\\quad x_1 = 0{,}6,\\ x_2 = 1{,}8,\\ x_3 = 3{,}0\\ \\text{m}"],
  },
  {
    t0: 7.2,
    cim: "Előjeles összeg",
    szoveg: "Lefelé pozitív, felfelé negatív: a középső kivonódik. Az eredő pont akkora, mint egyetlen szakaszé, és lefelé mutat.",
    kepletek: ["R = 8{,}4 - 8{,}4 + 8{,}4 = 8{,}4\\ \\text{kN}\\ (\\downarrow)"],
  },
  {
    t0: 10.2,
    cim: "Az eredő helye — nyomatéki egyenlet",
    szoveg: "A két szélső erő szimmetrikus a középre, a középső is a középen hat: az eredő a teljes szakasz közepére kerül. A nyomatéki egyenlet ugyanezt adja.",
    kepletek: ["R\\,k = 8{,}4\\cdot 0{,}6 - 8{,}4\\cdot 1{,}8 + 8{,}4\\cdot 3{,}0 = 15{,}12\\ \\text{kNm}", "k = \\frac{15{,}12}{8{,}4} = 1{,}8\\ \\text{m}"],
  },
];

const DB = 6; // kis nyíl szakaszonként

function Rajz(t) {
  const szakU = [0, 1, 2].map((i) => arany(t, 0.4 + i * 0.7, 1.1 + i * 0.7));
  const cU = [0, 1, 2].map((i) => arany(t, 3.2 + i * 1.2, 4.2 + i * 1.2, rugo));
  const halmoz = [0, 1, 2].map((i) => arany(t, 7.4 + i * 0.8, 8.1 + i * 0.8, rugo));
  const rFel = arany(t, 9.6, 10.1);
  const oss = arany(t, 10.5, 11.9, rugo);
  const kFel = arany(t, 12.0, 12.6);

  const elojel = [1, -1, 1];
  const kozep = [0.6, 1.8, 3.0];
  const halmozX = 4.0; // m, jobb oldali oszlop
  const H = R1 * 4.4; // az eredő-nyilak hossza (képpont)

  return (
    <svg viewBox="0 0 600 380" className="abra w-full select-none">
      <defs>
        {SZ.map((s, i) => (
          <Hegy key={i} id={`mv-${i}`} szin={s} />
        ))}
        <Hegy id="mv-l" szin={LILA} />
        <Hegy id="mv-sz" szin="#94a3b8" />
      </defs>

      {/* szakaszok kitöltése és kis nyilai */}
      {[0, 1, 2].map((i) => {
        const x0 = i * 1.2;
        const s = elojel[i];
        const w = (JOBB - BAL) / 3;
        const magas = P * PL * (1 - cU[i]);
        return (
          <g key={i}>
            <rect
              x={X(x0)}
              y={s > 0 ? TY - magas : TY}
              width={w * szakU[i]}
              height={magas}
              fill={SZ[i]}
              opacity={0.16}
            />
            {Array.from({ length: DB + 1 }, (_, j) => {
              const xx = x0 + (j / DB) * 1.2;
              if (xx > x0 + 1.2 * szakU[i] + 1e-6) return null;
              const xc = lerp(xx, kozep[i], cU[i]);
              if (magas < 3) return null;
              return s > 0 ? (
                <line key={j} x1={X(xc)} y1={TY - 5 - magas} x2={X(xc)} y2={TY - 5} stroke={SZ[i]} strokeWidth="1.3" markerEnd={`url(#mv-${i})`} />
              ) : (
                <line key={j} x1={X(xc)} y1={TY + 5 + magas} x2={X(xc)} y2={TY + 5} stroke={SZ[i]} strokeWidth="1.3" markerEnd={`url(#mv-${i})`} />
              );
            })}
            <FeliratA x={X(x0 + 0.6)} y={s > 0 ? TY - P * PL - 10 : TY + P * PL + 18} szin={SZ[i]} meret={11.5} opacitas={arany(t, 1.0 + i * 0.7, 1.3 + i * 0.7) * (1 - cU[i])}>
              {s > 0 ? "7 kN/m" : "−7 kN/m"}
            </FeliratA>
          </g>
        );
      })}

      {/* tartó és méretek */}
      <line x1={BAL - 14} y1={TY} x2={JOBB + 14} y2={TY} stroke="#1d3c48" strokeWidth="4" strokeLinecap="round" />
      {[0, 1, 2].map((i) => (
        <g key={`d${i}`}>
          <line x1={X(i * 1.2)} y1={TY + 96} x2={X((i + 1) * 1.2)} y2={TY + 96} stroke="#94a3b8" strokeWidth="1" markerStart="url(#mv-sz)" markerEnd="url(#mv-sz)" />
          <FeliratA x={X(i * 1.2 + 0.6)} y={TY + 111} szin="#64748b" meret={11} vastag={false}>1,2 m</FeliratA>
        </g>
      ))}

      {/* részeredők a szakaszok közepén, majd az oszlopba */}
      {[0, 1, 2].map((i) => {
        if (cU[i] <= 0.02) return null;
        const s = elojel[i];
        const h = H * cU[i];
        // helyben
        const xh = lerp(kozep[i], 1.8, oss); // az összevonáskor középre
        const opHelyben = 1 - 0.85 * halmoz[i] + 0.85 * oss;
        return (
          <g key={`r${i}`}>
            <g opacity={opHelyben * (1 - 0.5 * oss)}>
              {s > 0 ? (
                <NyilA x1={X(xh)} y1={TY - 8 - h} x2={X(xh)} y2={TY - 8} szin={SZ[i]} hegy={`mv-${i}`} vastag={3.4} />
              ) : (
                <NyilA x1={X(xh)} y1={TY + 8 + h} x2={X(xh)} y2={TY + 8} szin={SZ[i]} hegy={`mv-${i}`} vastag={3.4} />
              )}
              <FeliratA x={X(xh)} y={s > 0 ? TY - 8 - h - 8 : TY + 8 + h + 16} szin={SZ[i]} meret={12} opacitas={cU[i] * (1 - oss)}>
                R{["₁", "₂", "₃"][i]} = {s > 0 ? "" : "−"}8,4 kN
              </FeliratA>
              <FeliratA x={X(kozep[i])} y={TY + 24} szin={SZ[i]} meret={11} vastag={false} opacitas={cU[i] * (1 - oss)}>
                {kozep[i].toFixed(1).replace(".", ",")} m
              </FeliratA>
            </g>
            {/* oszlop: egymás alá, előjelesen */}
            {halmoz[i] > 0.02 && (
              (() => {
                // tetejétől: R1 lefelé, R2 felfelé (visszamegy), R3 lefelé
                const kezd = [0, H, 0][i];
                const y1 = 60 + kezd;
                const y2 = y1 + s * H;
                const cx = lerp(X(kozep[i]), X(halmozX), halmoz[i]);
                const cy1 = lerp(s > 0 ? TY - 8 - h : TY + 8 + h, y1, halmoz[i]);
                const cy2 = lerp(s > 0 ? TY - 8 : TY + 8, y2, halmoz[i]);
                return <NyilA x1={cx + [0, 7, 14][i] * halmoz[i]} y1={cy1} x2={cx + [0, 7, 14][i] * halmoz[i]} y2={cy2} szin={SZ[i]} hegy={`mv-${i}`} vastag={3} opacitas={1 - oss} />;
              })()
            )}
          </g>
        );
      })}
      <g opacity={rFel * (1 - oss)}>
        <VonalA x1={X(halmozX) - 12} y1={60} x2={X(halmozX) - 12} y2={60 + H} szin={LILA} vastag={1.4} szaggatott={false} />
        <FeliratA x={X(halmozX) - 18} y={60 + H / 2 + 4} szin={LILA} meret={12.5} horgony="end">R = 8,4 kN ↓</FeliratA>
      </g>

      {/* az eredő */}
      {oss > 0.5 && (
        <g opacity={(oss - 0.5) * 2}>
          <NyilA x1={X(1.8)} y1={TY - 8 - H} x2={X(1.8)} y2={TY - 8} szin={LILA} hegy="mv-l" vastag={4.4} />
          <FeliratA x={X(1.8)} y={TY - 8 - H - 8} szin={LILA} meret={13}>R = 8,4 kN</FeliratA>
          <g opacity={kFel}>
            <VonalA x1={X(0)} y1={TY + 60} x2={X(1.8)} y2={TY + 60} szin={LILA} vastag={1.3} szaggatott={false} />
            <FeliratA x={X(0.9)} y={TY + 75} szin={LILA} meret={12.5}>k = 1,8 m</FeliratA>
          </g>
        </g>
      )}
    </svg>
  );
}

export default function FilmGyf2() {
  return (
    <FeladatFilm
      cim="GYF‑2 · Váltakozó irányú szakaszos teher"
      hossz={12.8}
      fejezetek={FEJEZETEK}
      rajz={Rajz}
      megjegyzes="A felfelé ható szakasz a tartó alatt van, és negatív előjellel kerül az összegbe."
    />
  );
}
