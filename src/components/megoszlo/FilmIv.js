"use client";

import FeladatFilm from "@/components/anim/FeladatFilm";
import { arany, lerp, rugo } from "@/components/anim/Idovonal";
import { Hegy, NyilA, VonalA, FeliratA, PontA } from "@/components/anim/FilmElemek";

/* GYF‑A: félkörív mentén megoszló, az ívre merőleges teher eredője (Tankönyv 3.22. ábra). */

const CX = 300;
const CY = 300; // lejjebb, hogy a függőleges részeredők és feliratuk a viewBoxon belül maradjanak
const RP = 130; // képpont, R = 3 m
const H = 30; // a p teherábra vastagsága (px)
const R_M = 3;
const P = 4;
const RP_KN = R_M * P; // 12 kN
const DB = 16;
const NAR = "#e2590a";
const TEAL = "#0f766e";
const KEK = "#2563eb";
const LILA = "#7c3aed";
const BLOKK_FEL = CY - RP - 46; // a függőleges vetületi teher tömbjének alja
const BLOKK_BAL = CX - RP - 46; // a bal vízszintes tömb jobb széle
const BLOKK_JOBB = CX + RP + 46;
const ES = 3.2; // px / kN az eredő-nyilakhoz

const FEJEZETEK = [
  {
    t0: 0,
    cim: "Félkörív, az ívre merőleges teher",
    szoveg: "Egy R = 3 m sugarú boltívet az ívre mindenütt merőleges, p = 4 kN/m intenzitású teher nyom. Görbe vonal mentén változó irányú teher — integrálni kellene? Nem.",
    kepletek: ["(p) \\ekv \\underline{R},\\qquad R = 3\\ \\text{m},\\ p = 4\\ \\text{kN/m}"],
  },
  {
    t0: 2.6,
    cim: "Felbontás két negyedkörre",
    szoveg: "A bal és a jobb negyedkörre külön-külön alkalmazzuk a ferde rúdnál tanultat: a felületre merőleges teher két vetületi teherrel helyettesíthető, azonos intenzitással.",
    kepletek: ["(p_{bal}, p_{jobb}) \\ekv (\\underline{R}_{y1}, \\underline{R}_{x1}, \\underline{R}_{y2}, \\underline{R}_{x2})"],
  },
  {
    t0: 5.0,
    cim: "Vetületi terhek: ugyanaz a p",
    szoveg: "Mindkét negyedkör vízszintes vetülete R, függőleges vetülete is R. Ezekre p intenzitású függőleges, ill. vízszintes teher jut — mindegyik részeredője R·p = 12 kN.",
    kepletek: ["R_{y1} = R_{y2} = R\\,p = 3\\cdot 4 = 12\\ \\text{kN}", "R_{x1} = R_{x2} = R\\,p = 12\\ \\text{kN}"],
  },
  {
    t0: 7.8,
    cim: "Vízszintes vetület: kiejtik egymást",
    szoveg: "A bal negyedkör vízszintes részeredője jobbra, a jobbé balra mutat, mindkettő a fenéktől R/2 magasságban — közös hatásvonalon, ellentétesen. Az összegük nulla.",
    kepletek: ["\\Fx +12 - 12 = R_x = 0"],
  },
  {
    t0: 10.2,
    cim: "Függőleges vetület: 2Rp",
    szoveg: "A két függőleges részeredő azonos irányú, ezért összeadódik: az eredő 2Rp = 24 kN, lefelé.",
    kepletek: ["\\Fle 12 + 12 = R = 2Rp = 24\\ \\text{kN}"],
  },
  {
    t0: 12.6,
    cim: "Az eredő helye: szimmetria",
    szoveg: "A két függőleges részeredő O-tól ±1,5 m-re hat: a nyomatékuk O-ra kiejti egymást, tehát az eredő a kör középpontján halad át.",
    kepletek: ["\\Mj{O} 12\\cdot 1{,}5 - 12\\cdot 1{,}5 = R\\,x_R = 0\\ \\Rightarrow\\ x_R = 0"],
  },
];

const ivPont = (fi, r = RP) => ({ x: CX - r * Math.cos(fi), y: CY - r * Math.sin(fi) });

function Rajz(t) {
  const ivU = arany(t, 0.3, 1.6);
  const nyilU = arany(t, 1.4, 2.4);
  const felirat1 = arany(t, 2.0, 2.4);
  const negyed = arany(t, 2.9, 3.7); // színezés
  const c = arany(t, 5.3, 6.8, rugo); // vetületekre csúszás
  const blokk = arany(t, 6.4, 7.2);
  const rxU = arany(t, 8.0, 8.8, rugo); // vízszintes részeredők
  const rxOssz = arany(t, 9.0, 9.9); // egymás felé csúsznak és kioltódnak
  const ryU = arany(t, 10.4, 11.2, rugo);
  const ryOssz = arany(t, 11.4, 12.4);
  const helyU = arany(t, 12.9, 13.7);
  const vegU = arany(t, 13.9, 14.5);

  const nyilak = Array.from({ length: DB + 1 }, (_, i) => (Math.PI * i) / DB);

  return (
    <svg viewBox="0 0 600 440" className="abra w-full select-none">
      <defs>
        <Hegy id="iv-n" szin={NAR} />
        <Hegy id="iv-t" szin={TEAL} />
        <Hegy id="iv-k" szin={KEK} />
        <Hegy id="iv-l" szin={LILA} />
        <Hegy id="iv-sz" szin="#94a3b8" />
      </defs>

      {/* a p teherábra sávja az ív külső oldalán */}
      <path
        d={`M ${CX - RP - 8 - H} ${CY} A ${RP + 8 + H} ${RP + 8 + H} 0 0 1 ${CX + RP + 8 + H} ${CY} L ${CX + RP + 8} ${CY} A ${RP + 8} ${RP + 8} 0 0 0 ${CX - RP - 8} ${CY} Z`}
        fill={NAR}
        opacity={0.1 * nyilU * (1 - c)}
      />
      {/* negyedkörök színezése */}
      <path d={`M ${CX - RP - 8} ${CY} A ${RP + 8} ${RP + 8} 0 0 1 ${CX} ${CY - RP - 8} L ${CX} ${CY - RP + 8} A ${RP - 8} ${RP - 8} 0 0 0 ${CX - RP + 8} ${CY} Z`} fill={TEAL} opacity={0.28 * negyed} />
      <path d={`M ${CX} ${CY - RP - 8} A ${RP + 8} ${RP + 8} 0 0 1 ${CX + RP + 8} ${CY} L ${CX + RP - 8} ${CY} A ${RP - 8} ${RP - 8} 0 0 0 ${CX} ${CY - RP + 8} Z`} fill={KEK} opacity={0.28 * negyed} />

      {/* vetületi tömbök */}
      <g opacity={blokk * (1 - 0.6 * ryOssz)}>
        <rect x={CX - RP} y={BLOKK_FEL - H} width={RP} height={H} fill={TEAL} opacity="0.16" stroke={TEAL} strokeWidth="1.3" />
        <rect x={CX} y={BLOKK_FEL - H} width={RP} height={H} fill={KEK} opacity="0.16" stroke={KEK} strokeWidth="1.3" />
        <FeliratA x={CX - RP / 2 - 6} y={BLOKK_FEL - H - 8} szin={TEAL} meret={11.5}>p a bal vetületen</FeliratA>
        <FeliratA x={CX + RP / 2 + 6} y={BLOKK_FEL - H - 8} szin={KEK} meret={11.5}>p a jobb vetületen</FeliratA>
      </g>
      <g opacity={blokk * (1 - 0.6 * rxOssz)}>
        <rect x={BLOKK_BAL - H} y={CY - RP} width={H} height={RP} fill={TEAL} opacity="0.16" stroke={TEAL} strokeWidth="1.3" />
        <rect x={BLOKK_JOBB} y={CY - RP} width={H} height={RP} fill={KEK} opacity="0.16" stroke={KEK} strokeWidth="1.3" />
        <FeliratA x={BLOKK_BAL - H / 2} y={CY + 16} szin={TEAL} meret={11.5}>p (R)</FeliratA>
        <FeliratA x={BLOKK_JOBB + H / 2} y={CY + 16} szin={KEK} meret={11.5}>p (R)</FeliratA>
      </g>

      {/* az elemi nyilak: merőlegesből vetületi helyzetbe csúsznak */}
      {nyilak.map((fi, i) => {
        const u = arany(nyilU, i / (DB + 1), (i + 1) / (DB + 1));
        if (u <= 0.02) return null;
        const Pk = ivPont(fi, RP + 8);
        const n = { x: -Math.cos(fi), y: -Math.sin(fi) }; // kifelé mutató normális
        const bal = fi <= Math.PI / 2 + 1e-9;
        const szin = negyed > 0.5 ? (bal ? TEAL : KEK) : NAR;
        const hegy = negyed > 0.5 ? (bal ? "iv-t" : "iv-k") : "iv-n";
        // függőleges nyíl: a farka a merőleges helyzetből a felső tömbhöz csúszik
        const tailA = { x: Pk.x + n.x * H, y: Pk.y + n.y * H };
        const tailV = { x: Pk.x, y: BLOKK_FEL };
        const tv = { x: lerp(tailA.x, tailV.x, c), y: lerp(tailA.y, tailV.y, c) };
        // vízszintes nyíl: a tömbtől a pontig nő
        const oldalX = bal ? BLOKK_BAL : BLOKK_JOBB;
        const th = { x: lerp(Pk.x, oldalX, c), y: Pk.y };
        const op = u * (1 - 0.85 * Math.max(rxOssz, ryOssz));
        const lenV = Math.hypot(Pk.x - tv.x, Pk.y - tv.y);
        const lenH = Math.abs(Pk.x - th.x);
        return (
          <g key={i} opacity={op}>
            {lenV > 6 && <NyilA x1={tv.x} y1={tv.y} x2={lerp(tv.x, Pk.x, 0.93)} y2={lerp(tv.y, Pk.y, 0.93)} szin={szin} hegy={hegy} vastag={1.3} opacitas={1 - 0.8 * ryOssz} />}
            {c > 0.05 && lenH > 6 && <NyilA x1={th.x} y1={th.y} x2={lerp(th.x, Pk.x, 0.93)} y2={Pk.y} szin={szin} hegy={hegy} vastag={1.3} opacitas={c * (1 - 0.8 * rxOssz)} />}
          </g>
        );
      })}

      {/* a boltív */}
      <path
        d={`M ${CX - RP - 8} ${CY} A ${RP + 8} ${RP + 8} 0 0 1 ${CX + RP + 8} ${CY} L ${CX + RP - 8} ${CY} A ${RP - 8} ${RP - 8} 0 0 0 ${CX - RP + 8} ${CY} Z`}
        fill="#c7dde3"
        stroke="#1d3c48"
        strokeWidth="2"
        opacity={ivU}
      />
      <line x1={CX - RP - 8} y1={CY} x2={CX + RP + 8} y2={CY} stroke="#475569" strokeWidth="1.4" />
      <PontA x={CX} y={CY} r={3.5} szin="#1d3c48" u={ivU} />
      <FeliratA x={CX + 8} y={CY - 6} szin="#1d3c48" meret={11.5} vastag={false} opacitas={ivU}>O</FeliratA>
      <FeliratA x={CX} y={CY - RP - 8 - H - 12} szin={NAR} meret={12.5} opacitas={felirat1 * (1 - c)}>p = 4 kN/m, az ívre merőlegesen</FeliratA>
      <line x1={CX - RP} y1={CY + 22} x2={CX} y2={CY + 22} stroke="#94a3b8" strokeWidth="1" markerStart="url(#iv-sz)" markerEnd="url(#iv-sz)" />
      <line x1={CX} y1={CY + 22} x2={CX + RP} y2={CY + 22} stroke="#94a3b8" strokeWidth="1" markerStart="url(#iv-sz)" markerEnd="url(#iv-sz)" />
      <FeliratA x={CX - RP / 2} y={CY + 37} szin="#64748b" meret={11} vastag={false}>R = 3 m</FeliratA>
      <FeliratA x={CX + RP / 2} y={CY + 37} szin="#64748b" meret={11} vastag={false}>R = 3 m</FeliratA>

      {/* vízszintes részeredők: egymás felé, majd kioltás */}
      {rxU > 0.02 && (
        <g opacity={1 - rxOssz}>
          <NyilA x1={lerp(BLOKK_BAL - H - 60, CX - 40, rxOssz)} y1={CY - RP / 2} x2={lerp(BLOKK_BAL - H - 60, CX - 40, rxOssz) + RP_KN * ES} y2={CY - RP / 2} u={rxU} szin={TEAL} hegy="iv-t" vastag={3.6} />
          <NyilA x1={lerp(BLOKK_JOBB + H + 60, CX + 40, rxOssz)} y1={CY - RP / 2} x2={lerp(BLOKK_JOBB + H + 60, CX + 40, rxOssz) - RP_KN * ES} y2={CY - RP / 2} u={rxU} szin={KEK} hegy="iv-k" vastag={3.6} />
          <FeliratA x={BLOKK_BAL - H - 40} y={CY - RP / 2 - 10} szin={TEAL} meret={12} opacitas={rxU * (1 - rxOssz)}>Rₓ₁ = 12 kN →</FeliratA>
          <FeliratA x={BLOKK_JOBB + H + 40} y={CY - RP / 2 - 10} szin={KEK} meret={12} opacitas={rxU * (1 - rxOssz)}>← Rₓ₂ = 12 kN</FeliratA>
        </g>
      )}
      {rxOssz > 0.5 && (
        <FeliratA x={CX} y={CY - RP / 2 + 4} szin="#15803d" meret={12.5} opacitas={(rxOssz - 0.5) * 2 * (1 - 0.7 * ryU)}>
          +12 − 12 = 0 ✓
        </FeliratA>
      )}

      {/* függőleges részeredők: középre csúsznak, összeolvadnak */}
      {ryU > 0.02 && (
        <g opacity={1 - ryOssz}>
          <NyilA x1={lerp(CX - RP / 2, CX, ryOssz)} y1={BLOKK_FEL - H - 20 - RP_KN * ES} x2={lerp(CX - RP / 2, CX, ryOssz)} y2={BLOKK_FEL - H - 20} u={ryU} szin={TEAL} hegy="iv-t" vastag={3.6} />
          <NyilA x1={lerp(CX + RP / 2, CX, ryOssz)} y1={BLOKK_FEL - H - 20 - RP_KN * ES} x2={lerp(CX + RP / 2, CX, ryOssz)} y2={BLOKK_FEL - H - 20} u={ryU} szin={KEK} hegy="iv-k" vastag={3.6} />
          <FeliratA x={CX - RP / 2} y={BLOKK_FEL - H - 28 - RP_KN * ES} szin={TEAL} meret={12} opacitas={ryU}>Rᵧ₁ = 12 kN</FeliratA>
          <FeliratA x={CX + RP / 2} y={BLOKK_FEL - H - 28 - RP_KN * ES} szin={KEK} meret={12} opacitas={ryU}>Rᵧ₂ = 12 kN</FeliratA>
        </g>
      )}
      {ryOssz > 0.5 && (
        <g opacity={(ryOssz - 0.5) * 2}>
          <NyilA x1={CX} y1={CY - RP - 30 - 2 * RP_KN * ES} x2={CX} y2={CY - RP - 12} szin={LILA} hegy="iv-l" vastag={4.4} />
          <FeliratA x={CX} y={CY - RP - 38 - 2 * RP_KN * ES} szin={LILA} meret={13}>R = 2Rp = 24 kN</FeliratA>
        </g>
      )}
      {/* a hatásvonal O-n át */}
      <g opacity={helyU}>
        <VonalA x1={CX} y1={CY - RP - 12} x2={CX} y2={CY + 60} szin={LILA} vastag={1.3} u={helyU} />
        <PontA x={CX} y={CY} r={5} szin={LILA} u={helyU} />
        <FeliratA x={CX + 10} y={CY + 56} szin={LILA} meret={11.5} horgony="start">a hatásvonal átmegy O-n</FeliratA>
        <VonalA x1={CX - RP / 2} y1={CY + 78} x2={CX + RP / 2} y2={CY + 78} szin="#64748b" vastag={1} szaggatott={false} />
        <FeliratA x={CX - RP / 4} y={CY + 92} szin="#64748b" meret={11} vastag={false}>1,5 m</FeliratA>
        <FeliratA x={CX + RP / 4} y={CY + 92} szin="#64748b" meret={11} vastag={false}>1,5 m</FeliratA>
      </g>
      <FeliratA x={CX} y={24} szin="#15803d" meret={13} opacitas={vegU}>Integrálás nélkül: R = 2Rp, függőleges, a kör közepén át ✓</FeliratA>
    </svg>
  );
}

export default function FilmIv() {
  return (
    <FeladatFilm
      cim="GYF‑A · Félkörív merőleges terhe — a két vetület trükkje"
      hossz={14.8}
      fejezetek={FEJEZETEK}
      rajz={Rajz}
      megjegyzes="A merőleges nyilak a vetületi tömbökhöz csúsznak; a vízszintesek kioltják egymást, a függőlegesek összeadódnak."
    />
  );
}
