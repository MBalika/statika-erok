"use client";

import FeladatFilm from "@/components/anim/FeladatFilm";
import { arany } from "@/components/anim/Idovonal";
import { VonalA, FeliratA, PontA } from "@/components/anim/FilmElemek";
import { TartoHegyek, Tarto, Csuklo, Gorgo, KoncentraltNyomatek, Meret, MeretFugg, TamaszCimke } from "@/components/tartok/TartoElemek";
import { SZ, FilmHegyek, EroA, Kar, Fokusz, Pipa, Kijelentes } from "./FilmGyf1";

/*
 * GYF‑5 · Keret csuklóval és ferde görgővel (H04/3) — film.
 * a = 1,5 m; A csukló (0,0); oszlop (0,0)…(0,2a); gerenda (0,2a)…(3a,2a); jobb oszlop (3a,2a)…(3a,a); B görgő (3a,a),
 * gördülési sík 30°-kal emelkedik jobbra → B a függőlegessel 30°-ot zár be, balra-felfelé. M = 12 kNm ↷ az x = a-nál.
 * Főpontok: P₁ = (5,366; 0) (B és A_x hatásvonalának metszése), P₂ = (0; 9,294) (B és A_y hatásvonalának metszése).
 * Eredmény: B = 2,582 kN, A_y = −2,236 kN (lefelé), A_x = 1,291 kN (jobbra).
 */

const OX = 150;
const YA = 312;
const L = 46; // px / a
const YT = YA - 2 * L;
const XJ = OX + 3 * L;
const YB = YA - L;
const XM = OX + L;
const TG = Math.tan(Math.PI / 6);
const XP1 = OX + (3 + TG) * L; // 5,366 m → 3,577 a
const YP2 = YA - (1 + 3 / TG) * L; // 9,294 m → 6,196 a
// az A-ból a B hatásvonalára bocsátott merőleges talppontja (2,683 a; 1,549 a)
const TALP = { x: OX + 2.683 * L, y: YA - 1.549 * L };

const T = { elk: 0, kij: 4.5, ma: 9, mp1: 13.5, mp2: 18, ell: 22.5, ered: 26 };

const FEJEZETEK = [
  {
    t0: T.elk,
    cim: "A feladat és az elkülönítés",
    szoveg: "Az egyetlen teher egy 12 kNm-es nyomaték (a rajzon az óramutató szerint). A csukló helyére A_x és A_y, a görgő helyére a gördülési síkra merőleges B kerül: a függőlegessel 30°-ot zár be, balra-felfelé mutat.",
    kepletek: ["a = 1{,}5\\ \\text{m},\\ M = 12\\ \\text{kNm},\\ \\alpha = 30^\\circ", "B_x = -0{,}5\\,B,\\quad B_y = 0{,}866\\,B"],
  },
  {
    t0: T.kij,
    cim: "Egyensúlyi kijelentés és a főpontok",
    szoveg: "A B hatásvonala metszi A_x hatásvonalát (az y = 0 egyenest) a P₁ = (5,366; 0) pontban, és A_y hatásvonalát (az x = 0 egyenest) a P₂ = (0; 9,294) pontban. Ezek a főpontok: rájuk írva egy-egy csuklóerő-komponens marad az egyenletben.",
    kepletek: ["(M, \\underline{A}_x, \\underline{A}_y, \\underline{B}) \\ekv \\underline{O}", "P_1 = (4{,}5 + 1{,}5\\,\\mathrm{tg}\\,30^\\circ;\\ 0),\\quad P_2 = (0;\\ 1{,}5 + 4{,}5/\\mathrm{tg}\\,30^\\circ)"],
  },
  {
    t0: T.ma,
    cim: "Nyomaték az A csuklóra → B",
    szoveg: "A-ra nézve csak B és M forgat. B karja a hatásvonalának távolsága A-tól: 4,647 m (komponensenként: 0,866B·4,5 + 0,5B·1,5). M az óramutató szerint forog, negatív.",
    kepletek: ["\\Mp{A} 0{,}866\\,B\\cdot 4{,}5 + 0{,}5\\,B\\cdot 1{,}5 - 12 = 0\\ \\Rightarrow\\ B = \\frac{12}{4{,}647} = 2{,}582\\ \\text{kN}"],
  },
  {
    t0: T.mp1,
    cim: "Nyomaték a P₁ főpontra → A_y",
    szoveg: "P₁-en átmegy B és A_x hatásvonala — csak A_y marad, B-t nem is használjuk. A_y karja 5,366 m; negatív eredmény: A_y valójában lefelé mutat.",
    kepletek: ["\\Mp{P_1} -A_y\\cdot 5{,}366 - 12 = 0\\ \\Rightarrow\\ A_y = -2{,}236\\ \\text{kN}"],
  },
  {
    t0: T.mp2,
    cim: "Nyomaték a P₂ főpontra → A_x",
    szoveg: "P₂-n átmegy B és A_y hatásvonala — csak A_x marad. Karja 9,294 m; a pont alatt jobbra ható erő az óramutatóval ellentétesen forgat.",
    kepletek: ["\\Mp{P_2} A_x\\cdot 9{,}294 - 12 = 0\\ \\Rightarrow\\ A_x = 1{,}291\\ \\text{kN}"],
  },
  {
    t0: T.ell,
    cim: "Ellenőrzés: mindkét vetületi egyenlet",
    szoveg: "Egyik vetületi egyenletet sem használtuk, mindkettő ellenőrzésre marad.",
    kepletek: ["\\Fx 1{,}291 - 0{,}5\\cdot 2{,}582 = 0{,}000\\ \\checkmark", "\\Fy -2{,}236 + 0{,}866\\cdot 2{,}582 = 0{,}000\\ \\checkmark"],
  },
  {
    t0: T.ered,
    cim: "Eredményvázlat — erőpár",
    szoveg: "A_y nyila átfordul lefelé. Az A csuklóerő nagysága √(1,291² + 2,236²) = 2,582 kN, a B-vel párhuzamos és ellentétes: a két reakció erőpárt alkot, nyomatéka 2,582·4,647 = 12 kNm — az M ellentettje.",
    kepletek: ["A_x = 1{,}291\\ \\text{kN}\\ (\\rightarrow),\\quad A_y = 2{,}236\\ \\text{kN}\\ (\\downarrow),\\quad B = 2{,}582\\ \\text{kN}\\ (\\nwarrow)"],
  },
];

function Rajz(t) {
  const terhU = arany(t, 0.2, 1.2);
  const tamaszHalv = arany(t, 1.6, 2.6);
  const reakU = arany(t, 2.4, 3.8);
  const kijU = arany(t, T.kij + 0.2, T.kij + 0.9);
  const hatU = arany(t, T.kij + 1.0, T.kij + 2.6); // a hatásvonalak kirajzolódnak
  const fopU = arany(t, T.kij + 2.6, T.kij + 3.4); // a főpontok felpattannak
  const maU = arany(t, T.ma + 0.2, T.ma + 0.8);
  const maKar = arany(t, T.ma + 0.8, T.ma + 2.2);
  const mp1U = arany(t, T.mp1 + 0.2, T.mp1 + 0.8);
  const mp1Kar = arany(t, T.mp1 + 0.8, T.mp1 + 2.2);
  const mp2U = arany(t, T.mp2 + 0.2, T.mp2 + 0.8);
  const mp2Kar = arany(t, T.mp2 + 0.8, T.mp2 + 2.2);
  const ellU = arany(t, T.ell + 0.2, T.ell + 0.8);
  const fordulU = arany(t, T.ered + 0.6, T.ered + 1.8);
  const szamU = arany(t, T.ered + 1.6, T.ered + 2.4);

  const fazis = t < T.ma ? "elk" : t < T.mp1 ? "ma" : t < T.mp2 ? "mp1" : t < T.ell ? "mp2" : t < T.ered ? "ell" : "ered";
  const el = {
    ma: { B: 1, M: 1 },
    mp1: { Ay: 1, M: 1, B: 0.35, Ax: 0.35 },
    mp2: { Ax: 1, M: 1, B: 0.35, Ay: 0.35 },
  }[fazis];
  const op = (nev) => (el ? (el[nev] ?? 0.18) : 1);
  const hatLat = fazis === "elk" ? hatU : 0.6; // a hatásvonalak a későbbi fázisokban halványan maradnak

  // a B reakció: hegye B-ben, iránya 120° (balra-fel)
  const bH = 62;
  // a B hatásvonala: B-től a P₁-ig (le-jobbra) és a P₂-ig (fel-balra)
  return (
    <svg viewBox="0 0 600 380" className="abra w-full select-none">
      <TartoHegyek />
      <FilmHegyek />
      <Kijelentes x={430} y={40} opacitas={kijU * (fazis === "elk" ? 1 : 0.35)}>(M, Aₓ, Aᵧ, B) ≐ O</Kijelentes>

      {/* hatásvonalak */}
      <g opacity={hatLat}>
        <VonalA x1={XJ} y1={YB} x2={XP1} y2={YA} u={arany(hatU, 0, 0.4)} szin="#a78bfa" vastag={1.3} />
        <VonalA x1={XJ} y1={YB} x2={OX} y2={YP2} u={arany(hatU, 0.3, 1)} szin="#a78bfa" vastag={1.3} />
        <VonalA x1={OX - 50} y1={YA} x2={XP1 + 40} y2={YA} u={arany(hatU, 0, 0.5)} szin="#a78bfa" vastag={1} />
        <VonalA x1={OX} y1={YA + 20} x2={OX} y2={YP2 - 14} u={arany(hatU, 0.3, 1)} szin="#a78bfa" vastag={1} />
      </g>
      <g opacity={fopU}>
        <PontA x={XP1} y={YA} r={5} szin="#7c3aed" u={fopU} />
        <FeliratA x={XP1 + 12} y={YA - 10} szin={SZ.lila} meret={12} horgony="start">P₁ (5,366; 0)</FeliratA>
        <PontA x={OX} y={YP2} r={5} szin="#7c3aed" u={fopU} />
        <FeliratA x={OX + 12} y={YP2 + 16} szin={SZ.lila} meret={12} horgony="start">P₂ (0; 9,294)</FeliratA>
      </g>

      {/* a keret és a támaszok */}
      <Tarto x1={OX} y1={YA} x2={OX} y2={YT} />
      <Tarto x1={OX} y1={YT} x2={XJ} y2={YT} />
      <Tarto x1={XJ} y1={YT} x2={XJ} y2={YB} />
      <Csuklo x={OX} y={YA} opacitas={1 - 0.88 * tamaszHalv} />
      <Gorgo x={XJ} y={YB} szog={30} opacitas={1 - 0.88 * tamaszHalv} />
      <TamaszCimke x={OX + 14} y={YA + 18}>A</TamaszCimke>
      <TamaszCimke x={XJ - 16} y={YB + 12}>B</TamaszCimke>
      <Meret x1={OX} x2={XM} y={YA + 56} cimke="1,5 m" opacitas={0.8} />
      <Meret x1={XM} x2={XJ} y={YA + 56} cimke="3 m" opacitas={0.8} />
      <MeretFugg x={XJ + 112} y1={YT} y2={YB} cimke="1,5 m" opacitas={0.8} />
      <MeretFugg x={XJ + 112} y1={YB} y2={YA} cimke="1,5 m" opacitas={0.8} />

      {/* teher */}
      <KoncentraltNyomatek x={XM} y={YT} r={18} irany={-1} cimke="M = 12 kNm" opacitas={terhU * op("M")} />

      {/* reakciók */}
      <EroA x={OX} y={YA} hossz={46} szog={0} u={reakU} opacitas={op("Ax")} cimke={szamU > 0.5 ? "Aₓ = 1,291 kN" : "Aₓ"} dx={-4} dy={-10} horgony="end" />
      <EroA x={OX} y={YA} hossz={40} szog={90} u={reakU} opacitas={op("Ay") * (1 - fordulU)} cimke="Aᵧ" dx={-8} dy={4} horgony="end" />
      <EroA x={OX} y={YA + 40} hossz={40} szog={-90} u={fordulU} cimke={szamU > 0.5 ? "Aᵧ = 2,236 kN" : "Aᵧ"} dx={8} dy={-2} />
      <EroA x={XJ} y={YB} hossz={bH} szog={120} u={reakU} opacitas={op("B")} cimke={szamU > 0.5 ? "B = 2,582 kN" : "B"} dx={8} dy={6} />

      {fazis === "ma" && (
        <g opacity={maU}>
          <Fokusz x={OX} y={YA} t={t} cimke="A" dx={-30} dy={-14} />
          <Kar x1={OX} y1={YA} x2={TALP.x} y2={TALP.y} u={maKar} cimke="4,647 m" dx={20} dy={18} />
          <Pipa x={440} y={YT - 30} opacitas={arany(t, T.ma + 2.4, T.ma + 3.0)}>4,647·B = 12 → B = 2,582 kN</Pipa>
        </g>
      )}
      {fazis === "mp1" && (
        <g opacity={mp1U}>
          <Fokusz x={XP1} y={YA} t={t} cimke="P₁" dx={10} dy={-14} />
          <Kar x1={XP1} y1={YA + 18} x2={OX} y2={YA + 18} u={mp1Kar} cimke="5,366 m" dy={-5} dx={60} />
          <Pipa x={440} y={YT - 30} opacitas={arany(t, T.mp1 + 2.4, T.mp1 + 3.0)}>−5,366·Aᵧ − 12 = 0 → Aᵧ = −2,236 kN</Pipa>
        </g>
      )}
      {fazis === "mp2" && (
        <g opacity={mp2U}>
          <Fokusz x={OX} y={YP2} t={t} cimke="P₂" dx={-30} dy={4} />
          <Kar x1={OX - 36} y1={YP2} x2={OX - 36} y2={YA} u={mp2Kar} cimke="9,294 m" dx={-30} dy={4} />
          <Pipa x={440} y={YT - 30} opacitas={arany(t, T.mp2 + 2.4, T.mp2 + 3.0)}>9,294·Aₓ − 12 = 0 → Aₓ = 1,291 kN</Pipa>
        </g>
      )}
      {fazis === "ell" && (
        <g opacity={ellU}>
          <Pipa x={440} y={YT - 44} opacitas={arany(t, T.ell + 0.8, T.ell + 1.4)}>ΣFᵢₓ: 1,291 − 1,291 = 0 ✓</Pipa>
          <Pipa x={440} y={YT - 24} opacitas={arany(t, T.ell + 1.8, T.ell + 2.4)}>ΣFᵢᵧ: −2,236 + 2,236 = 0 ✓</Pipa>
        </g>
      )}
      {fazis === "ered" && (
        <g opacity={arany(t, T.ered + 2.2, T.ered + 3.0)}>
          <VonalA x1={OX} y1={YA} x2={OX - 0.5 * bH} y2={YA + 0.866 * bH} szin="#7c3aed" vastag={1} />
          <FeliratA x={440} y={YT - 44} szin={SZ.zold} meret={12.5}>A = B = 2,582 kN: erőpár,</FeliratA>
          <FeliratA x={440} y={YT - 24} szin={SZ.zold} meret={12.5}>2,582 · 4,647 = 12 kNm = −M</FeliratA>
        </g>
      )}
    </svg>
  );
}

export default function FilmGyf5() {
  return (
    <FeladatFilm
      cim="GYF‑5 · Keret ferde görgővel — a főpontok haszna"
      hossz={30}
      fejezetek={FEJEZETEK}
      rajz={Rajz}
      megjegyzes="A lila vékony vonalak a hatásvonalak; metszéspontjaik a főpontok. Rájuk írva a nyomatéki egyenletet, egyszerre két ismeretlen esik ki, és egyik reakció sem épül a másikra."
    />
  );
}
