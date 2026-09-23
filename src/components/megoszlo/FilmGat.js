"use client";

import FeladatFilm from "@/components/anim/FeladatFilm";
import { arany, lerp, rugo } from "@/components/anim/Idovonal";
import { Hegy, NyilA, VonalA, FeliratA, PontA } from "@/components/anim/FilmElemek";

/* GYF‑B: víznyomás ferde gátfalon — vízszintes és függőleges komponens, az eredő merőleges a falra. */

const OX = 360; // a fal talppontja
const OY = 330;
const SC = 35; // px / m
const H = 6;
const BETA = 30;
const GAMMA = 10;
const RAD = Math.PI / 180;
const TG = Math.tan(BETA * RAD);
const CB = Math.cos(BETA * RAD);
const SB = Math.sin(BETA * RAD);
const ALAP = H * TG; // 3,464 m
const HP = H * SC;
const TX = OX - ALAP * SC;
const TY = OY - HP;
const RX = 0.5 * GAMMA * H * H; // 180
const RY = 0.5 * ALAP * H * GAMMA; // 103,9
const PS = 1.2; // px / (kN/m²)
const ES = 0.5; // px / (kN/m)
const Q = { x: OX - (ALAP * SC) / 3, y: OY - HP / 3 }; // az eredő döféspontja a falon
const KEK = "#2563eb";
const TEAL = "#0f766e";
const LILA = "#7c3aed";
const NAR = "#e2590a";

const FEJEZETEK = [
  {
    t0: 0,
    cim: "Ferde gátfal, víz fölötte",
    szoveg: "A fal 30°-kal dől a függőlegeshez képest, a víz 6 m mély. A nyomás mindenütt merőleges a falra, és a mélységgel arányosan nő: γ·z.",
    kepletek: ["(p_{v}) \\ekv \\underline{R},\\qquad p_v = \\gamma z,\\ \\gamma = 10\\ \\text{kN/m}^3"],
  },
  {
    t0: 2.8,
    cim: "Vízszintes komponens: háromszög a függőleges vetületen",
    szoveg: "A vízszintes részt a függőleges vetületre ható háromszög adja — pontosan úgy, mintha a fal függőleges volna. Eredője ½γh², a fenéktől h/3-ra.",
    kepletek: ["\\Fx R_x = \\tfrac12\\,\\gamma h^2 = \\tfrac12\\cdot 10\\cdot 6^2 = 180\\ \\text{kN/m}", "y_x = h/3 = 2\\ \\text{m}"],
  },
  {
    t0: 6.0,
    cim: "Függőleges komponens: a fal fölötti vízoszlop",
    szoveg: "A függőleges rész a fal vonala és a vízszint közötti síkidom (itt egy háromszög) területe szorozva γ-val, a síkidom súlypontján át.",
    kepletek: ["A = \\tfrac12\\cdot(6\\,\\mathrm{tg}\\,30^\\circ)\\cdot 6 = \\tfrac12\\cdot 3{,}464\\cdot 6 = 10{,}39\\ \\text{m}^2", "\\Fle R_y = \\gamma A = 103{,}9\\ \\text{kN/m},\\quad x_S = 3{,}464/3 = 1{,}155\\ \\text{m}"],
  },
  {
    t0: 9.4,
    cim: "Az eredő",
    szoveg: "A két komponens hatásvonala a falon metszi egymást — a fal alsó harmadolópontjában. Ott áll össze az eredő.",
    kepletek: ["R = \\sqrt{180^2 + 103{,}9^2} = 207{,}8\\ \\text{kN/m}"],
  },
  {
    t0: 12.2,
    cim: "Ellenőrzés: merőleges a falra",
    szoveg: "Mivel a nyomás minden pontban merőleges a falra, az eredőnek is annak kell lennie: R = R_x / cos 30° = 207,8 — egyezik.",
    kepletek: ["\\frac{R_x}{\\cos 30^\\circ} = \\frac{180}{0{,}866} = 207{,}8\\ \\text{kN/m}\\ \\checkmark"],
  },
];

function Rajz(t) {
  const nyomU = arany(t, 0.6, 2.2);
  const haromU = arany(t, 3.0, 3.9);
  const rxU = arany(t, 4.2, 5.0, rugo);
  const rxFel = arany(t, 5.0, 5.6);
  const oszlopU = arany(t, 6.2, 7.1);
  const ryU = arany(t, 7.4, 8.2, rugo);
  const ryFel = arany(t, 8.2, 8.9);
  const oss = arany(t, 9.7, 11.0, rugo); // a komponensek a döféspontba csúsznak
  const rU = arany(t, 11.0, 11.8, rugo);
  const merU = arany(t, 12.5, 13.3);
  const vegU = arany(t, 13.5, 14.0);

  const nyomOp = nyomU * (1 - 0.7 * Math.max(haromU, oszlopU));
  // a vízszintes komponens helye: kezdetben a háromszög mellett, majd a döféspontnál
  const rxTail = { x: lerp(OX + 24 + RX * ES, Q.x + RX * ES, oss), y: lerp(OY - HP / 3, Q.y, oss) };
  const rxHead = { x: lerp(OX + 12, Q.x, oss), y: lerp(OY - HP / 3, Q.y, oss) };
  const ryX = lerp(OX - (ALAP * SC) / 3, Q.x, oss);
  const ryTail = lerp(TY - 20 - RY * ES, Q.y - RY * ES, oss);
  const ryHead = lerp(TY - 8, Q.y, oss);

  return (
    <svg viewBox="0 0 600 400" className="abra w-full select-none">
      <defs>
        <Hegy id="gt-n" szin={NAR} />
        <Hegy id="gt-k" szin={KEK} />
        <Hegy id="gt-t" szin={TEAL} />
        <Hegy id="gt-l" szin={LILA} />
        <Hegy id="gt-sz" szin="#94a3b8" />
      </defs>

      {/* víz, gát, fenék */}
      <path d={`M ${OX} ${OY} L ${TX} ${TY} L 580 ${TY} L 580 ${OY} Z`} fill="#7dd3fc" opacity="0.3" />
      <line x1={TX - 30} y1={TY} x2={580} y2={TY} stroke="#0284c7" strokeWidth="1.2" strokeDasharray="6 3" />
      <path d={`M ${OX} ${OY} L ${TX} ${TY} L ${TX - 60} ${TY} L ${TX - 60} ${OY} Z`} fill="#cbd5e1" />
      <line x1={20} y1={OY} x2={580} y2={OY} stroke="#475569" strokeWidth="1.6" />

      {/* a falra merőleges nyomás nyilai */}
      {Array.from({ length: 8 }, (_, i) => {
        const s = (i + 1) / 8;
        const x = TX + (OX - TX) * s;
        const y = TY + (OY - TY) * s;
        const len = 4 + 60 * s;
        const u = arany(nyomU, i / 9, (i + 1) / 9);
        return <NyilA key={i} x1={x + CB * len} y1={y - SB * len} x2={x + CB * 6} y2={y - SB * 6} u={u} szin={NAR} hegy="gt-n" vastag={1.4} opacitas={nyomOp} />;
      })}
      <FeliratA x={OX + 112} y={OY - 160} szin={NAR} meret={12} opacitas={nyomOp}>γ·z, merőlegesen</FeliratA>

      {/* vízszintes: háromszög a függőleges vetületen */}
      <g opacity={haromU * (1 - 0.6 * oss)}>
        <VonalA x1={OX} y1={OY} x2={OX} y2={TY - 10} szin="#94a3b8" u={haromU} />
        <path d={`M ${OX} ${TY} L ${OX} ${OY} L ${OX + GAMMA * H * PS * haromU} ${OY} Z`} fill={KEK} opacity="0.18" stroke={KEK} strokeWidth="1.4" />
        {Array.from({ length: 6 }, (_, i) => {
          const s = (i + 1) / 6;
          return <NyilA key={i} x1={OX + GAMMA * H * PS * s} y1={TY + HP * s} x2={OX + 5} y2={TY + HP * s} u={haromU} szin={KEK} hegy="gt-k" vastag={1.2} opacitas={0.8} />;
        })}
        <FeliratA x={OX + GAMMA * H * PS + 8} y={OY - 4} szin={KEK} meret={11} vastag={false} horgony="start" opacitas={haromU}>γh = 60 kN/m²</FeliratA>
      </g>
      {rxU > 0.02 && (
        <g>
          <NyilA x1={rxTail.x} y1={rxTail.y} x2={rxHead.x} y2={rxHead.y} u={rxU} szin={KEK} hegy="gt-k" vastag={3.8} opacitas={1 - 0.5 * rU} />
          <FeliratA x={(rxTail.x + rxHead.x) / 2} y={rxTail.y - 10} szin={KEK} meret={12} opacitas={rxU * (1 - oss)}>Rₓ = 180 kN/m</FeliratA>
          <g opacity={rxFel * (1 - oss)}>
            <VonalA x1={OX + 100} y1={OY} x2={OX + 100} y2={OY - HP / 3} szin={KEK} vastag={1.2} szaggatott={false} />
            <FeliratA x={OX + 106} y={OY - HP / 6 + 4} szin={KEK} meret={11.5} vastag={false} horgony="start">h/3 = 2 m</FeliratA>
          </g>
        </g>
      )}

      {/* függőleges: a fal fölötti háromszög */}
      <g opacity={oszlopU * (1 - 0.6 * oss)}>
        <path d={`M ${OX} ${OY} L ${TX} ${TY} L ${OX} ${TY} Z`} fill={TEAL} opacity="0.24" stroke={TEAL} strokeWidth="1.4" />
        {Array.from({ length: 5 }, (_, i) => {
          const u = (i + 1) / 6;
          const x = OX - ALAP * SC * u;
          const yFal = OY - HP * u;
          return <NyilA key={i} x1={x} y1={TY + 2} x2={x} y2={yFal - 5} u={oszlopU} szin={TEAL} hegy="gt-t" vastag={1.2} opacitas={0.8} />;
        })}
        {/* a feliratok az Rᵧ nyíl (x = OX − a/3) vonalától balra, hogy ne fedje őket a nyíl */}
        <FeliratA x={OX - (ALAP * SC) / 3 - 10} y={TY - 44} szin={TEAL} meret={11.5} horgony="end" opacitas={oszlopU}>A = ½ · 3,464 · 6 = 10,39 m²</FeliratA>
        <VonalA x1={TX} y1={TY - 24} x2={OX} y2={TY - 24} szin="#94a3b8" vastag={1} szaggatott={false} u={oszlopU} />
        <FeliratA x={OX - (ALAP * SC) / 3 - 8} y={TY - 28} szin="#64748b" meret={10.5} vastag={false} horgony="end" opacitas={oszlopU}>h·tg 30° = 3,464 m</FeliratA>
      </g>
      {ryU > 0.02 && (
        <g>
          <NyilA x1={ryX} y1={ryTail} x2={ryX} y2={ryHead} u={ryU} szin={TEAL} hegy="gt-t" vastag={3.8} opacitas={1 - 0.5 * rU} />
          <FeliratA x={ryX - 8} y={ryTail - 6} szin={TEAL} meret={12} horgony="end" opacitas={ryU * (1 - oss)}>Rᵧ = 103,9 kN/m</FeliratA>
          <g opacity={ryFel * (1 - oss)}>
            <VonalA x1={ryX} y1={TY - 8} x2={ryX} y2={Q.y} szin={TEAL} vastag={1} />
            <VonalA x1={OX} y1={OY + 22} x2={ryX} y2={OY + 22} szin={TEAL} vastag={1.2} szaggatott={false} />
            <FeliratA x={(OX + ryX) / 2} y={OY + 37} szin={TEAL} meret={11.5} vastag={false}>x_S = 1,155 m</FeliratA>
          </g>
        </g>
      )}

      {/* a fal */}
      <line x1={OX} y1={OY} x2={TX} y2={TY} stroke="#1d3c48" strokeWidth="5" strokeLinecap="round" />
      <path d={`M ${OX} ${OY - 50} A 50 50 0 0 0 ${OX - 50 * SB} ${OY - 50 * CB}`} fill="none" stroke="#64748b" strokeWidth="1.2" />
      <FeliratA x={OX - 18} y={OY - 58} szin="#64748b" meret={11.5} vastag={false}>30°</FeliratA>
      <line x1={540} y1={OY} x2={540} y2={TY} stroke="#94a3b8" strokeWidth="1" markerStart="url(#gt-sz)" markerEnd="url(#gt-sz)" />
      <FeliratA x={548} y={(OY + TY) / 2 + 4} szin="#64748b" meret={11.5} vastag={false} horgony="start">h = 6 m</FeliratA>

      {/* az eredő */}
      {oss > 0.6 && <PontA x={Q.x} y={Q.y} r={5} szin={LILA} u={(oss - 0.6) * 2.5} />}
      {rU > 0.02 && (
        <g>
          <VonalA x1={Q.x} y1={Q.y - RY * ES} x2={Q.x + RX * ES} y2={Q.y - RY * ES} szin="#94a3b8" u={rU} />
          <VonalA x1={Q.x + RX * ES} y1={Q.y} x2={Q.x + RX * ES} y2={Q.y - RY * ES} szin="#94a3b8" u={rU} />
          <NyilA x1={Q.x + RX * ES} y1={Q.y - RY * ES} x2={Q.x} y2={Q.y} u={rU} szin={LILA} hegy="gt-l" vastag={4.4} />
          <FeliratA x={Q.x + RX * ES + 8} y={Q.y - RY * ES - 8} szin={LILA} meret={13} horgony="start" opacitas={rU}>R = 207,8 kN/m</FeliratA>
        </g>
      )}
      {/* merőlegesség jele */}
      <g opacity={merU}>
        <VonalA x1={Q.x} y1={Q.y} x2={Q.x + CB * 150} y2={Q.y - SB * 150} szin={LILA} vastag={1} u={merU} />
        <path d={`M ${Q.x - SB * 12} ${Q.y - CB * 12} L ${Q.x - SB * 12 + CB * 12} ${Q.y - CB * 12 - SB * 12} L ${Q.x + CB * 12} ${Q.y - SB * 12}`} fill="none" stroke={LILA} strokeWidth="1.3" />
        <FeliratA x={Q.x + CB * 160} y={Q.y - SB * 160 - 4} szin={LILA} meret={11.5} vastag={false} horgony="start">a fal normálisa</FeliratA>
      </g>
      <FeliratA x={300} y={24} szin="#15803d" meret={13} opacitas={vegU}>R = 180 / cos 30° = 207,8 kN/m — merőleges a falra ✓</FeliratA>
    </svg>
  );
}

export default function FilmGat() {
  return (
    <FeladatFilm
      cim="GYF‑B · Víznyomás ferde gáton — két komponens, egy eredő"
      hossz={14.2}
      fejezetek={FEJEZETEK}
      rajz={Rajz}
      megjegyzes="A kék háromszög a függőleges vetületre, a zöld vízoszlop a fal fölé rajzolódik; a kettő eredője a fal normálisa mentén hat."
    />
  );
}
