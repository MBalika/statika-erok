"use client";

import FeladatFilm from "@/components/anim/FeladatFilm";
import { arany, lerp, rugo } from "@/components/anim/Idovonal";
import { Hegy, NyilA, VonalA, FeliratA, PontA } from "@/components/anim/FilmElemek";

const BAL = 90;
const JOBB = 510;
const TY = 210;
const L = 12;
const P = 4;
const PL = 22;
const XL = (JOBB - BAL) / L;
const X = (x) => BAL + x * XL;
const TEAL = "#0f766e";
const KEK = "#2563eb";
const LILA = "#7c3aed";
const NAR = "#e2590a";
const R1 = 12;
const DB = 9;

const FEJEZETEK = [
  {
    t0: 0,
    cim: "Két fűrészfog",
    szoveg: "Két egyforma háromszög alakú szakasz, 6–6 m, mindkettőnek a bal végén 4 kN/m az intenzitás, a jobb végén nulla.",
    kepletek: ["(p_1, p_2) \\ekv \\underline{R},\\qquad p_{max} = 4\\ \\text{kN/m},\\quad 2\\times 6\\ \\text{m}"],
  },
  {
    t0: 2.8,
    cim: "Az első háromszög eredője",
    szoveg: "Terület: fél alap szor magasság. A súlypont a magas (bal) oldaltól a hossz harmadára van — a bal végtől 2 m-re.",
    kepletek: ["R_1 = \\tfrac12\\cdot 4\\cdot 6 = 12\\ \\text{kN},\\quad x_1 = \\tfrac{6}{3} = 2\\ \\text{m}"],
  },
  {
    t0: 6,
    cim: "A második háromszög eredője",
    szoveg: "Ugyanaz, csak 6 m-rel odébb: a súlypont a saját bal végétől 2 m-re, tehát az origótól 8 m-re.",
    kepletek: ["R_2 = 12\\ \\text{kN},\\quad x_2 = 6 + \\tfrac{6}{3} = 8\\ \\text{m}"],
  },
  {
    t0: 9.2,
    cim: "Összevonás — nem a közép!",
    szoveg: "Két egyforma erő eredője a kettő felezőjén van: 5 m-nél. Nem 6 m-nél, a tartó közepén — mert mindkét háromszög a bal oldalán nehezebb.",
    kepletek: ["\\Fle 12 + 12 = R = 24\\ \\text{kN}", "\\Mj{O} 12\\cdot 2 + 12\\cdot 8 = R\\,k\\ \\Rightarrow\\ k = \\frac{120}{24} = 5\\ \\text{m}"],
  },
];

function Rajz(t) {
  const elU = [arany(t, 0.4, 1.4), arany(t, 1.4, 2.4)];
  const cU = [arany(t, 3.0, 4.4, rugo), arany(t, 6.2, 7.6, rugo)];
  const xFel = [arany(t, 4.4, 5.0), arany(t, 7.6, 8.2)];
  const oss = arany(t, 9.4, 10.8, rugo);
  const kFel = arany(t, 10.8, 11.4);
  const kozepFel = arany(t, 11.6, 12.2);
  const H = R1 * 4.2;
  const szin = [TEAL, KEK];
  const hegy = ["mf-t", "mf-k"];
  const kozep = [2, 8];

  return (
    <svg viewBox="0 0 600 340" className="abra w-full select-none">
      <defs>
        <Hegy id="mf-t" szin={TEAL} />
        <Hegy id="mf-k" szin={KEK} />
        <Hegy id="mf-l" szin={LILA} />
        <Hegy id="mf-sz" szin="#94a3b8" />
      </defs>

      {[0, 1].map((i) => {
        const x0 = i * 6;
        const veg = x0 + 6 * elU[i];
        return (
          <g key={i}>
            <path d={`M ${X(x0)} ${TY} L ${X(x0)} ${TY - P * PL} L ${X(veg)} ${TY - P * PL * (1 - (veg - x0) / 6)} L ${X(veg)} ${TY} Z`} fill={szin[i]} opacity={0.16 * (1 - cU[i])} />
            <VonalA x1={X(x0)} y1={TY - P * PL} x2={X(x0 + 6)} y2={TY} u={elU[i]} szin={szin[i]} vastag={2} szaggatott={false} opacitas={1 - 0.6 * cU[i]} />
            <line x1={X(x0)} y1={TY} x2={X(x0)} y2={TY - P * PL} stroke={szin[i]} strokeWidth="2" opacity={elU[i] > 0.05 ? 1 - 0.6 * cU[i] : 0} />
            {Array.from({ length: DB + 1 }, (_, j) => {
              const xx = x0 + (j / DB) * 6;
              if (xx > veg + 1e-6) return null;
              const mag = P * PL * (1 - (xx - x0) / 6) * (1 - cU[i]);
              if (mag < 3) return null;
              const xc = lerp(xx, kozep[i], cU[i]);
              return <line key={j} x1={X(xc)} y1={TY - 5 - mag} x2={X(xc)} y2={TY - 5} stroke={szin[i]} strokeWidth="1.3" markerEnd={`url(#${hegy[i]})`} />;
            })}
            <FeliratA x={X(x0) + 6} y={TY - P * PL - 8} szin={szin[i]} meret={11.5} opacitas={arany(t, 1.2 + i, 1.5 + i) * (1 - cU[i])} horgony="start">4 kN/m</FeliratA>
            {/* részeredő */}
            {cU[i] > 0.02 && (
              <g opacity={1 - oss}>
                <NyilA x1={X(lerp(kozep[i], 5, oss))} y1={TY - 8 - H * cU[i]} x2={X(lerp(kozep[i], 5, oss))} y2={TY - 8} szin={szin[i]} hegy={hegy[i]} vastag={3.4} />
                <FeliratA x={X(lerp(kozep[i], 5, oss))} y={TY - 8 - H * cU[i] - 8} szin={szin[i]} meret={12} opacitas={cU[i]}>
                  R{["₁", "₂"][i]} = 12 kN
                </FeliratA>
                <g opacity={xFel[i]}>
                  <VonalA x1={X(0)} y1={TY + 44 + i * 22} x2={X(kozep[i])} y2={TY + 44 + i * 22} szin={szin[i]} vastag={1.2} szaggatott={false} />
                  <FeliratA x={X(kozep[i] / 2)} y={TY + 58 + i * 22} szin={szin[i]} meret={11.5} vastag={false}>
                    x{["₁", "₂"][i]} = {kozep[i]} m
                  </FeliratA>
                </g>
              </g>
            )}
          </g>
        );
      })}

      {/* tartó és hosszméret */}
      <line x1={BAL - 14} y1={TY} x2={JOBB + 14} y2={TY} stroke="#1d3c48" strokeWidth="4" strokeLinecap="round" />
      <line x1={X(0)} y1={TY + 22} x2={X(6)} y2={TY + 22} stroke="#94a3b8" strokeWidth="1" markerStart="url(#mf-sz)" markerEnd="url(#mf-sz)" />
      <line x1={X(6)} y1={TY + 22} x2={X(12)} y2={TY + 22} stroke="#94a3b8" strokeWidth="1" markerStart="url(#mf-sz)" markerEnd="url(#mf-sz)" />
      <FeliratA x={X(3)} y={TY + 36} szin="#64748b" meret={11} vastag={false}>6 m</FeliratA>
      <FeliratA x={X(9)} y={TY + 36} szin="#64748b" meret={11} vastag={false}>6 m</FeliratA>

      {/* eredő */}
      {oss > 0.5 && (
        <g opacity={(oss - 0.5) * 2}>
          <NyilA x1={X(5)} y1={TY - 8 - 2 * H} x2={X(5)} y2={TY - 8} szin={LILA} hegy="mf-l" vastag={4.4} />
          <FeliratA x={X(5)} y={TY - 8 - 2 * H - 8} szin={LILA} meret={13}>R = 24 kN</FeliratA>
          <g opacity={kFel}>
            <VonalA x1={X(0)} y1={TY + 92} x2={X(5)} y2={TY + 92} szin={LILA} vastag={1.3} szaggatott={false} />
            <FeliratA x={X(2.5)} y={TY + 107} szin={LILA} meret={12.5}>k = 5 m</FeliratA>
          </g>
          <g opacity={kozepFel}>
            <VonalA x1={X(6)} y1={TY - 40} x2={X(6)} y2={TY + 80} szin={NAR} />
            <FeliratA x={X(6) + 6} y={TY + 76} szin={NAR} meret={11} vastag={false} horgony="start">a tartó közepe: 6 m — nem itt!</FeliratA>
          </g>
          <PontA x={X(5)} y={TY} r={4.5} szin={LILA} u={kFel} />
        </g>
      )}
    </svg>
  );
}

export default function FilmGyf3() {
  return (
    <FeladatFilm
      cim="GYF‑3 · Fűrészfog alakú teher — hol az eredő?"
      hossz={12.6}
      fejezetek={FEJEZETEK}
      rajz={Rajz}
      megjegyzes="Mindkét háromszögnek a bal oldala a magas, ezért az eredő a középtől balra kerül."
    />
  );
}
