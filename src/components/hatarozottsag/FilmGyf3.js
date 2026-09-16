"use client";

import FeladatFilm from "@/components/anim/FeladatFilm";
import { arany, lerp } from "@/components/anim/Idovonal";
import { FeliratA } from "@/components/anim/FilmElemek";
import { TartoHegyek, Tarto, Csuklo, Gorgo, BelsoCsuklo, TeherNyil, ReakcioNyil, Meret, TamaszCimke } from "@/components/tartok/TartoElemek";
import { SZ, SzamlaloA, Itelet } from "./FilmGyf1";

/*
 * GYF‑3 · Gerber-tartó — film.
 * Egy 12 m-es gerenda; a támaszok egymás után bejönnek (A csukló, B, C, D görgő): i = 2, 3, 4, 5 — e = 3, kétszeresen
 * határozatlan. Két belső csukló (6 m, 10 m): e = 9, i = 9 → határozott, lefejtéssel igazolva; reakciók.
 * Aztán a csuklók az első mezőbe csúsznak (1,5 m, 3 m): 9 = 9 marad, de A–G₁–G₂ egy egyenesbe esik → összecsuklik.
 */

const OX = 60;
const Y = 180;
const L = 40; // px / m
const X = (m) => OX + m * L;

const T = { test: 0, tam: 3, csuk: 9.5, fejt: 14, reak: 18.5, mozgat: 22.5, csukl: 26 };

const FEJEZETEK = [
  { t0: T.test, cim: "Egy 12 m-es gerenda", szoveg: "Egyelőre egyetlen merev test: e = 3. Terhek: F₁ = 12 kN (x = 2 m), F₂ = 6 kN (x = 11 m).", kepletek: ["e = 3\\cdot 1 = 3"] },
  { t0: T.tam, cim: "Négy támasz jön be", szoveg: "A csukló (2), majd B, C, D görgő (1–1). Az ismeretlenek száma 5, az egyenleteké 3: kétszeresen határozatlan folytatólagos tartó — megfeszül.", kepletek: ["i = 2 + 1 + 1 + 1 = 5 > 3"] },
  { t0: T.csuk, cim: "Két belső csukló", szoveg: "Minden belső csukló új testet választ le (+3 egyenlet) és két kapcsolati erőt hoz (+2 ismeretlen). Két csuklóval: három test, e = 9, i = 5 + 4 = 9.", kepletek: ["e = 3\\cdot 3 = 9,\\qquad i = 5 + 2\\cdot 2 = 9"] },
  { t0: T.fejt, cim: "Lefejtés: befüggesztett részek", szoveg: "III (G₂–D): csukló + görgő, a G₂ nincs D függőlegesén → határozott, levehető. II (G₁–C–G₂): ugyanígy. Ami marad, I (A–B–G₁): kéttámaszú tartó. Így a szerkezet határozott.", kepletek: ["\\text{III: } \\Mp{G_2}\\to D;\\quad \\text{II: } \\Mp{G_1}\\to C;\\quad \\text{I: } \\Mp{A}\\to B"] },
  { t0: T.reak, cim: "A reakciók egyértelműek", szoveg: "III-ból D = 3 és G₂ = 3; II-ből C = 6 és G₁ = 3 (II-t lefelé húzza I… pontosabban I-re felfelé 3 kN hat); I-ből B = 1,5 és A = 7,5 kN.", kepletek: ["D = 3{,}000,\\ C = 6{,}000,\\ B = 1{,}500,\\ A_y = 7{,}500\\ \\text{kN}"] },
  { t0: T.mozgat, cim: "A csuklókat az első mezőbe toljuk", szoveg: "G₁ = 1,5 m, G₂ = 3 m. A számlálás semmit nem vesz észre: még mindig három test, 9 = 9.", kepletek: ["e = i = 9\\quad\\text{(változatlan)}"] },
  { t0: T.csukl, cim: "Egy egyenesbe eső három csukló", szoveg: "A, G₁, G₂ egy egyenesen: az I. test elfordulhat A körül, a II. visszafordul G₂ körül — a G₁ lezuhan. Kritikus elrendezés: határozatlan és túlhatározott, pedig e = i.", kepletek: ["\\text{szabad mozgás: } 1,\\quad \\text{fölös kényszer: } 1"] },
];

function Rajz(t) {
  const tartoU = arany(t, 0.2, 1.2);
  const teherU = arany(t, 1.0, 2.2);
  const aU = arany(t, T.tam + 0.2, T.tam + 1.0);
  const bU = arany(t, T.tam + 1.4, T.tam + 2.2);
  const cU = arany(t, T.tam + 2.6, T.tam + 3.4);
  const dU = arany(t, T.tam + 3.8, T.tam + 4.6);
  const g1U = arany(t, T.csuk + 0.3, T.csuk + 1.1);
  const g2U = arany(t, T.csuk + 1.5, T.csuk + 2.3);
  const fejt3 = arany(t, T.fejt + 0.2, T.fejt + 1.2);
  const fejt2 = arany(t, T.fejt + 1.4, T.fejt + 2.4);
  const fejt1 = arany(t, T.fejt + 2.6, T.fejt + 3.6);
  const reakU = arany(t, T.reak + 0.2, T.reak + 1.4);
  const mozgU = arany(t, T.mozgat + 0.3, T.mozgat + 2.2);
  const csuklU = arany(t, T.csukl + 0.2, T.csukl + 1.8);
  const leng = t > T.csukl + 1.8 ? 0.1 * Math.sin((2 * Math.PI * (t - T.csukl - 1.8)) / 2.2) : 0;

  const i = 2 * Math.round(aU) + Math.round(bU) + Math.round(cU) + Math.round(dU) + 2 * Math.round(g1U) + 2 * Math.round(g2U);
  const testek = 1 + Math.round(g1U) + Math.round(g2U);
  const e = 3 * testek;
  const xG1 = lerp(6, 1.5, mozgU);
  const xG2 = lerp(10, 3, mozgU);
  const kritikus = mozgU > 0.99;
  const allapot = t < T.tam + 1 ? undefined : kritikus ? "rossz" : e === i && t > T.fejt + 3.6 ? "jo" : e < i ? "lila" : undefined;
  const hatarozatlan = t > T.tam + 4.6 && t < T.csuk + 2.3 && e < i;

  // összecsuklás: G1 lesüllyed d-vel; I: A→G1, II: G1→G2 (G2 marad), III változatlan
  const d = (csuklU + leng) * 46;
  const pI = [X(0), Y, X(xG1), Y + d];
  const pII = [X(xG1), Y + d, X(xG2), Y];

  const testSzin = hatarozatlan ? "#9f1239" : allapot === "jo" ? "#166534" : kritikus && csuklU > 0.1 ? "#9f1239" : SZ.tarto;

  return (
    <svg viewBox="0 0 600 330" className="abra w-full select-none">
      <TartoHegyek />
      <SzamlaloA e={e} i={i} opacitas={tartoU} allapot={allapot} />

      {/* támaszok */}
      <g opacity={aU} transform={`translate(0 ${(1 - aU) * 30})`}>
        <Csuklo x={X(0)} y={Y} meret={14} />
      </g>
      <g opacity={bU} transform={`translate(0 ${(1 - bU) * 30})`}>
        <Gorgo x={X(4)} y={Y} meret={14} />
      </g>
      <g opacity={cU} transform={`translate(0 ${(1 - cU) * 30})`}>
        <Gorgo x={X(8)} y={Y} meret={14} />
      </g>
      <g opacity={dU} transform={`translate(0 ${(1 - dU) * 30})`}>
        <Gorgo x={X(12)} y={Y} meret={14} />
      </g>
      <TamaszCimke x={X(0)} y={Y + 48}>A</TamaszCimke>
      <TamaszCimke x={X(4)} y={Y + 48}>B</TamaszCimke>
      <TamaszCimke x={X(8)} y={Y + 48}>C</TamaszCimke>
      <TamaszCimke x={X(12)} y={Y + 48}>D</TamaszCimke>
      {[0, 4, 8].map((m) => (
        <Meret key={m} x1={X(m)} x2={X(m + 4)} y={Y + 92} cimke="4 m" opacitas={0.8} />
      ))}

      {/* lefejtés-kiemelés */}
      <g opacity={(1 - mozgU) * 0.35}>
        {fejt3 > 0 && <rect x={X(10) - 6} y={Y - 30} width={X(12) - X(10) + 12} height={60} rx="8" fill={SZ.zold} opacity={fejt3} />}
        {fejt2 > 0 && <rect x={X(6) - 6} y={Y - 30} width={X(10) - X(6) + 12} height={60} rx="8" fill={SZ.zold} opacity={fejt2 * 0.8} />}
        {fejt1 > 0 && <rect x={X(0) - 6} y={Y - 30} width={X(6) - X(0) + 12} height={60} rx="8" fill={SZ.zold} opacity={fejt1 * 0.6} />}
      </g>
      <FeliratA x={X(11)} y={Y - 40} szin={SZ.zold} meret={11} opacitas={fejt3 * (1 - mozgU)}>III ✓</FeliratA>
      <FeliratA x={X(8)} y={Y - 40} szin={SZ.zold} meret={11} opacitas={fejt2 * (1 - mozgU)}>II: csukló + görgő ✓</FeliratA>
      <FeliratA x={X(3)} y={Y - 40} szin={SZ.zold} meret={11} opacitas={fejt1 * (1 - mozgU)}>I: kéttámaszú ✓</FeliratA>

      {/* a tartó: egy darabban, vagy három testben */}
      {hatarozatlan && <line x1={X(0)} y1={Y} x2={X(12)} y2={Y} stroke={SZ.bordo} strokeWidth="16" strokeLinecap="round" opacity="0.25" />}
      {g1U < 0.5 ? (
        <Tarto x1={X(0) - 4} y1={Y} x2={X(12) + 4} y2={Y} szin={testSzin} opacitas={tartoU} />
      ) : (
        <>
          <Tarto x1={pI[0] - 4} y1={pI[1]} x2={pI[2]} y2={pI[3]} szin={testSzin} />
          {g2U < 0.5 ? <Tarto x1={X(xG1)} y1={Y} x2={X(12) + 4} y2={Y} szin={testSzin} /> : (
            <>
              <Tarto x1={pII[0]} y1={pII[1]} x2={pII[2]} y2={pII[3]} szin={testSzin} />
              <Tarto x1={X(xG2)} y1={Y} x2={X(12) + 4} y2={Y} szin={testSzin} />
            </>
          )}
        </>
      )}
      {g1U > 0.5 && <BelsoCsuklo x={X(xG1)} y={Y + d} r={5.5} />}
      {g2U > 0.5 && <BelsoCsuklo x={X(xG2)} y={Y} r={5.5} />}
      <FeliratA x={X(xG1)} y={Y + d - 14} szin={SZ.tarto} meret={11} opacitas={g1U}>G₁</FeliratA>
      <FeliratA x={X(xG2)} y={Y - 14} szin={SZ.tarto} meret={11} opacitas={g2U}>G₂</FeliratA>

      {/* terhek (a jó változatban) */}
      <g opacity={teherU * (1 - mozgU)}>
        <TeherNyil x={X(2)} y={Y - 3} hossz={60} szog={-90} cimke="F₁ = 12 kN" cimkeEltolas={[6, -2]} />
        <TeherNyil x={X(11)} y={Y - 3} hossz={44} szog={-90} cimke="F₂ = 6 kN" cimkeEltolas={[8, -2]} />
      </g>
      {/* teher a rossz változatban: a G₁–G₂ mezőre */}
      <g opacity={mozgU}>
        <TeherNyil x={X(2.25)} y={Y + d * 0.5 - 3} hossz={54} szog={-90} cimke="F₁" cimkeEltolas={[6, -2]} />
      </g>

      {/* reakciók */}
      <g opacity={reakU * (1 - mozgU)}>
        <ReakcioNyil x={X(0)} y={Y + 4} hossz={56} szog={90} cimke="Aᵧ = 7,500" cimkeEltolas={[8, 4]} />
        <ReakcioNyil x={X(4)} y={Y + 4} hossz={26} szog={90} cimke="B = 1,500" cimkeEltolas={[8, 4]} />
        <ReakcioNyil x={X(8)} y={Y + 4} hossz={48} szog={90} cimke="C = 6,000" cimkeEltolas={[8, 4]} />
        <ReakcioNyil x={X(12)} y={Y + 4} hossz={34} szog={90} cimke="D = 3,000" cimkeEltolas={[-64, 4]} />
      </g>

      <Itelet y={300} szoveg="5 > 3: kétszeresen határozatlan — megfeszül" szin={SZ.lila} opacitas={hatarozatlan ? 1 : 0} />
      <Itelet y={300} szoveg="9 = 9 és lefejthető → határozott ✓" opacitas={fejt1 * (1 - mozgU)} />
      <Itelet y={300} szoveg="9 = 9, de A–G₁–G₂ egy egyenesen → összecsuklik" szin={SZ.bordo} opacitas={csuklU} />
      {kritikus && <line x1={X(0) - 20} y1={Y} x2={X(3) + 40} y2={Y} stroke={SZ.bordo} strokeWidth="1.2" strokeDasharray="5 4" opacity={arany(t, T.mozgat + 2.2, T.mozgat + 3)} />}
    </svg>
  );
}

export default function FilmGyf3() {
  return (
    <FeladatFilm
      cim="GYF‑3 · Gerber-tartó — támaszok, csuklók, lefejtés, összecsuklás"
      hossz={31}
      fejezetek={FEJEZETEK}
      rajz={Rajz}
      megjegyzes="A csuklók helye dönt: a 2. és 3. mezőben határozott Gerber-tartó, az 1. mezőben egy egyenesbe eső három csukló — mechanizmus. A számláló mindkét esetben 9 = 9."
    />
  );
}
