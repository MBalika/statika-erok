"use client";

import FeladatFilm from "@/components/anim/FeladatFilm";
import { arany, lerp, rugo } from "@/components/anim/Idovonal";
import { Hegy, NyilA, VonalA, FeliratA } from "@/components/anim/FilmElemek";

const BAL = 110;
const JOBB = 490;
const TY = 236; // a tartó
const L = 4.5;
const P1 = 1.8;
const P2 = 3.6;
const PL = 28; // képpont / (kN/m)
const XL = (JOBB - BAL) / L; // képpont / m
const NYIL_DB = 14;

const X = (x) => BAL + x * XL;
const teto = (p) => TY - p * PL;
const pHelyen = (x) => P1 + ((P2 - P1) * x) / L;

const R1 = P1 * L; // téglalap 8,1
const R2 = ((P2 - P1) * L) / 2; // háromszög 4,05
const R = R1 + R2; // 12,15
const K = 2.5;
const RT1 = (P1 * L) / 2; // bal-magas háromszög 4,05
const RT2 = (P2 * L) / 2; // jobb-magas háromszög 8,1

const TEAL = "#0f766e";
const KEK = "#2563eb";
const LILA = "#7c3aed";
const NAR = "#e2590a";

const FEJEZETEK = [
  {
    t0: 0,
    cim: "A trapéz alakú teher",
    szoveg: "Az intenzitás a bal végen 1,8 kN/m, a jobb végen 3,6 kN/m, a szakasz 4,5 m. Az eredő nagysága a teherábra területe, a helye a súlypontja.",
    kepletek: ["p_1 = 1{,}8,\\ p_2 = 3{,}6\\ \\text{kN/m},\\quad L = 4{,}5\\ \\text{m}"],
  },
  {
    t0: 2.4,
    cim: "Felbontás: téglalap + háromszög",
    szoveg: "A trapéz egy 1,8 kN/m-es téglalap és egy 0-tól 1,8 kN/m-ig növekvő háromszög összege.",
    kepletek: ["(\\underline{R}_1, \\underline{R}_2) \\doteq \\underline{R}"],
  },
  {
    t0: 4.6,
    cim: "A téglalap eredője",
    szoveg: "A téglalap alatti sok kis nyíl egyetlen erővé húzódik össze a téglalap közepén.",
    kepletek: ["R_1 = 1{,}8\\cdot 4{,}5 = 8{,}1\\ \\text{kN},\\quad x_1 = \\tfrac{L}{2} = 2{,}25\\ \\text{m}"],
  },
  {
    t0: 6.6,
    cim: "A háromszög eredője",
    szoveg: "A háromszög súlypontja a magas (jobb) oldaltól a hossz harmadára van — a bal végtől tehát 2L/3-ra.",
    kepletek: ["R_2 = \\tfrac{1}{2}\\cdot 1{,}8\\cdot 4{,}5 = 4{,}05\\ \\text{kN},\\quad x_2 = \\tfrac{2L}{3} = 3{,}0\\ \\text{m}"],
  },
  {
    t0: 8.6,
    cim: "A két erő összevonása",
    szoveg: "Párhuzamos erők: az eredő az összegük, a helye a nyomatéki egyenletből. Az eredő a nagyobbik erőhöz esik közelebb.",
    kepletek: ["R = 8{,}1 + 4{,}05 = 12{,}15\\ \\text{kN}", "k = \\frac{8{,}1\\cdot 2{,}25 + 4{,}05\\cdot 3{,}0}{12{,}15} = \\frac{30{,}375}{12{,}15} = 2{,}5\\ \\text{m}"],
  },
  {
    t0: 11,
    cim: "Ellenőrzés: két háromszögből",
    szoveg: "Ugyanez a trapéz két háromszög összege is. Más részek, más helyek — de az eredő ugyanoda, ugyanakkorára áll össze.",
    kepletek: ["R = 4{,}05 + 8{,}1 = 12{,}15\\ \\text{kN}", "k = \\frac{4{,}05\\cdot 1{,}5 + 8{,}1\\cdot 3{,}0}{12{,}15} = 2{,}5\\ \\text{m}\\ \\checkmark"],
  },
];

/** Eredő-nyíl a tartó fölött: hossza az értékkel arányos. */
function Eredo({ x, ertek, szin, hegy, cimke, opacitas = 1, u = 1, felirat = true, vastag = 3.6 }) {
  if (opacitas <= 0.01 || ertek <= 0.01) return null;
  const h = 14 + ertek * 7;
  const csucs = teto(pHelyen(x)) - 8;
  return (
    <g opacity={opacitas}>
      <NyilA x1={X(x)} y1={csucs - h} x2={X(x)} y2={csucs} u={u} szin={szin} hegy={hegy} vastag={vastag} />
      {felirat && (
        <FeliratA x={X(x)} y={csucs - h - 8} szin={szin} meret={12.5} opacitas={u}>
          {cimke}
        </FeliratA>
      )}
    </g>
  );
}

function Rajz(t) {
  // 1. fejezet
  const elU = arany(t, 0.5, 1.9);
  const felirat1 = arany(t, 1.9, 2.3);
  // 2. fejezet
  const teglaU = arany(t, 2.6, 3.2);
  const haromU = arany(t, 3.4, 4.0);
  // 3–4. fejezet: összehúzódás
  const c1 = arany(t, 4.8, 6.1, rugo);
  const c2 = arany(t, 6.8, 8.1, rugo);
  // 5. fejezet: összevonás
  const oss = arany(t, 8.9, 10.3, rugo);
  const kFel = arany(t, 10.3, 10.8);
  // 6. fejezet: két háromszög
  const ujra = arany(t, 11.2, 11.9); // visszaáll a teher, két háromszög kitöltés
  const c3 = arany(t, 12.0, 13.2, rugo);
  const oss2 = arany(t, 13.3, 14.4, rugo);
  const vegFel = arany(t, 14.4, 14.9);

  const masodik = t >= 11.2;
  const nyilak = Array.from({ length: NYIL_DB + 1 }, (_, i) => (i / NYIL_DB) * L);

  // a teher kitöltése és felső éle
  const elX = lerp(0, L, elU);
  const utTrapez = `M ${X(0)} ${TY} L ${X(0)} ${teto(P1)} L ${X(elX)} ${teto(pHelyen(elX))} L ${X(elX)} ${TY} Z`;

  return (
    <svg viewBox="0 0 600 400" className="abra w-full select-none">
      <defs>
        <Hegy id="m1-n" szin={NAR} />
        <Hegy id="m1-t" szin={TEAL} />
        <Hegy id="m1-k" szin={KEK} />
        <Hegy id="m1-l" szin={LILA} />
        <Hegy id="m1-sz" szin="#94a3b8" />
      </defs>

      {/* teherábra kitöltése (halványul, ha már eredő van) */}
      <path d={utTrapez} fill={NAR} opacity={0.1 * (1 - 0.6 * Math.max(c1, c2))} />

      {/* felbontás színes részei */}
      {!masodik && (
        <>
          <rect x={X(0)} y={teto(P1)} width={(JOBB - BAL) * teglaU} height={P1 * PL} fill={TEAL} opacity={0.18 * (1 - c1)} />
          <path d={`M ${X(0)} ${teto(P1)} L ${X(L * haromU)} ${teto(pHelyen(L * haromU))} L ${X(L * haromU)} ${teto(P1)} Z`} fill={KEK} opacity={0.2 * (1 - c2)} />
        </>
      )}
      {masodik && (
        <>
          <path d={`M ${X(0)} ${TY} L ${X(0)} ${teto(P1)} L ${X(L)} ${TY} Z`} fill={TEAL} opacity={0.2 * ujra * (1 - c3)} />
          <path d={`M ${X(0)} ${TY} L ${X(L)} ${teto(P2)} L ${X(L)} ${TY} Z`} fill={KEK} opacity={0.2 * ujra * (1 - c3)} />
        </>
      )}

      {/* felső él */}
      <VonalA x1={X(0)} y1={teto(P1)} x2={X(L)} y2={teto(P2)} u={elU} szin={NAR} vastag={2.2} szaggatott={false} opacitas={1 - 0.5 * Math.max(c1, c2, c3)} />

      {/* a teher kis nyilai – az első felbontásban téglalap- és háromszög-részre osztva */}
      {nyilak.map((x, i) => {
        const megj = x <= elX + 1e-6 ? 1 : 0;
        if (!megj) return null;
        if (!masodik) {
          // téglalap rész: p1 magas, x → L/2 felé húzódik
          const xr = lerp(x, L / 2, c1);
          const hr = P1 * PL * (1 - c1);
          // háromszög rész: (p(x)−p1) magas, x → 2L/3 felé
          const xh = lerp(x, (2 * L) / 3, c2);
          const hh = (pHelyen(x) - P1) * PL * (1 - c2);
          return (
            <g key={i}>
              {hr > 2 && <line x1={X(xr)} y1={TY - 6 - hr} x2={X(xr)} y2={TY - 6} stroke={teglaU > 0.5 ? TEAL : NAR} strokeWidth="1.4" markerEnd={`url(#${teglaU > 0.5 ? "m1-t" : "m1-n"})`} />}
              {hh > 2 && (
                <line
                  x1={X(xh)}
                  y1={teto(P1) - hh}
                  x2={X(xh)}
                  y2={teto(P1)}
                  stroke={haromU > 0.5 ? KEK : NAR}
                  strokeWidth="1.4"
                  markerEnd={`url(#${haromU > 0.5 ? "m1-k" : "m1-n"})`}
                />
              )}
            </g>
          );
        }
        // második felbontás: bal-magas háromszög (p1·(1−x/L)) → L/3, jobb-magas (p2·x/L) → 2L/3
        const xa = lerp(x, L / 3, c3);
        const ha = P1 * (1 - x / L) * PL * (1 - c3);
        const xb = lerp(x, (2 * L) / 3, c3);
        const hb = ((P2 * x) / L) * PL * (1 - c3);
        return (
          <g key={i} opacity={ujra}>
            {ha > 2 && <line x1={X(xa)} y1={TY - 6 - ha} x2={X(xa)} y2={TY - 6} stroke={TEAL} strokeWidth="1.4" markerEnd="url(#m1-t)" />}
            {hb > 2 && <line x1={X(xb)} y1={TY - 6 - ha - hb} x2={X(xb)} y2={TY - 6 - ha} stroke={KEK} strokeWidth="1.4" markerEnd="url(#m1-k)" />}
          </g>
        );
      })}

      {/* tartó */}
      <line x1={BAL - 14} y1={TY} x2={JOBB + 14} y2={TY} stroke="#1d3c48" strokeWidth="4" strokeLinecap="round" />
      <line x1={X(0)} y1={TY + 22} x2={X(L)} y2={TY + 22} stroke="#94a3b8" strokeWidth="1" markerStart="url(#m1-sz)" markerEnd="url(#m1-sz)" />
      <FeliratA x={X(L / 2)} y={TY + 38} szin="#64748b" meret={12} vastag={false}>L = 4,5 m</FeliratA>

      {/* intenzitás feliratok */}
      <FeliratA x={X(0) - 8} y={teto(P1) - 8} szin={NAR} horgony="end" opacitas={felirat1}>p₁ = 1,8 kN/m</FeliratA>
      <FeliratA x={X(L) + 8} y={teto(P2) - 8} szin={NAR} horgony="start" opacitas={felirat1}>p₂ = 3,6 kN/m</FeliratA>
      {!masodik && (
        <>
          <FeliratA x={X(L / 2)} y={teto(P1 / 2) + 4} szin={TEAL} meret={11.5} opacitas={teglaU * (1 - c1)}>téglalap: 1,8 kN/m</FeliratA>
          <FeliratA x={X(3.4)} y={teto(P1) - 14} szin={KEK} meret={11.5} opacitas={haromU * (1 - c2)}>háromszög: 0 → 1,8 kN/m</FeliratA>
        </>
      )}

      {/* --- eredők, első felbontás --- */}
      {!masodik && (
        <>
          <Eredo x={lerp(L / 2, K, oss)} ertek={R1} szin={TEAL} hegy="m1-t" cimke="R₁ = 8,1 kN" u={c1} opacitas={1 - oss} />
          <Eredo x={lerp((2 * L) / 3, K, oss)} ertek={R2} szin={KEK} hegy="m1-k" cimke="R₂ = 4,05 kN" u={c2} opacitas={1 - oss} />
          {/* helyméretek */}
          <g opacity={c1 * (1 - oss)}>
            <VonalA x1={X(0)} y1={TY + 52} x2={X(L / 2)} y2={TY + 52} szin={TEAL} vastag={1.2} szaggatott={false} />
            <FeliratA x={X(L / 4)} y={TY + 66} szin={TEAL} meret={11.5} vastag={false}>x₁ = 2,25 m</FeliratA>
          </g>
          <g opacity={c2 * (1 - oss)}>
            <VonalA x1={X(0)} y1={TY + 78} x2={X((2 * L) / 3)} y2={TY + 78} szin={KEK} vastag={1.2} szaggatott={false} />
            <FeliratA x={X(L / 3)} y={TY + 92} szin={KEK} meret={11.5} vastag={false}>x₂ = 3,0 m (L/3 a magas oldaltól)</FeliratA>
          </g>
        </>
      )}

      {/* --- eredők, második felbontás --- */}
      {masodik && (
        <>
          <Eredo x={lerp(L / 3, K, oss2)} ertek={RT1} szin={TEAL} hegy="m1-t" cimke="R₁ = 4,05 kN" u={c3} opacitas={1 - oss2} />
          <Eredo x={lerp((2 * L) / 3, K, oss2)} ertek={RT2} szin={KEK} hegy="m1-k" cimke="R₂ = 8,1 kN" u={c3} opacitas={1 - oss2} />
          <g opacity={c3 * (1 - oss2)}>
            <VonalA x1={X(0)} y1={TY + 52} x2={X(L / 3)} y2={TY + 52} szin={TEAL} vastag={1.2} szaggatott={false} />
            <FeliratA x={X(L / 6)} y={TY + 66} szin={TEAL} meret={11.5} vastag={false}>1,5 m</FeliratA>
            <VonalA x1={X(0)} y1={TY + 78} x2={X((2 * L) / 3)} y2={TY + 78} szin={KEK} vastag={1.2} szaggatott={false} />
            <FeliratA x={X(L / 3)} y={TY + 92} szin={KEK} meret={11.5} vastag={false}>3,0 m</FeliratA>
          </g>
        </>
      )}

      {/* --- az eredő --- */}
      {(oss > 0.5 || (masodik && oss2 > 0.5)) && (
        <>
          <Eredo
            x={K}
            ertek={R}
            szin={LILA}
            hegy="m1-l"
            cimke="R = 12,15 kN"
            u={1}
            opacitas={masodik ? Math.max(oss2 > 0.5 ? (oss2 - 0.5) * 2 : 0, 0) : (oss - 0.5) * 2}
            vastag={4.4}
          />
          <g opacity={masodik ? oss2 > 0.5 ? (oss2 - 0.5) * 2 : 0 : kFel}>
            <VonalA x1={X(K)} y1={TY + 6} x2={X(K)} y2={TY + 110} szin={LILA} opacitas={0.6} />
            <VonalA x1={X(0)} y1={TY + 106} x2={X(K)} y2={TY + 106} szin={LILA} vastag={1.3} szaggatott={false} />
            <FeliratA x={X(K / 2)} y={TY + 121} szin={LILA} meret={12.5}>k = 2,5 m</FeliratA>
          </g>
        </>
      )}
      {masodik && (
        <FeliratA x={X(L / 2)} y={22} szin="#15803d" meret={13} opacitas={vegFel}>
          Két felbontás, ugyanaz az eredő ✓
        </FeliratA>
      )}
      {!masodik && (
        <FeliratA x={X(L / 2)} y={22} szin={LILA} meret={12.5} vastag={false} opacitas={kFel}>
          R·k = R₁·x₁ + R₂·x₂ → k = 30,375 / 12,15
        </FeliratA>
      )}
    </svg>
  );
}

export default function FilmGyf1() {
  return (
    <FeladatFilm
      cim="GYF‑1 · A trapéz teher egyetlen erővé húzódik össze"
      hossz={15.2}
      fejezetek={FEJEZETEK}
      rajz={Rajz}
      megjegyzes="A kis nyilak a teher elemi erői; figyeld, hogyan gyűlnek össze a rész-eredőkbe, majd az eredőbe."
    />
  );
}
