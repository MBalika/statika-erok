"use client";

import FeladatFilm from "@/components/anim/FeladatFilm";
import { arany } from "@/components/anim/Idovonal";
import { VonalA, FeliratA } from "@/components/anim/FilmElemek";
import { TartoHegyek, Tarto, Csuklo, Rud, MegoszloTeher, Meret, MeretFugg, TamaszCimke } from "@/components/tartok/TartoElemek";
import { SZ, FilmHegyek, EroA, Kar, Fokusz, Pipa, Kijelentes } from "./FilmGyf1";

/*
 * GYF‑3 · Rúddal és csuklóval megtámasztott gerenda (H03/5) — film.
 * a = 1,2 m; gerenda 0…4a, B csukló a jobb végen, támasztórúd A(0, −a) → C(2a, 0); p₁ = 5 kN/m a 0…2a szakaszon.
 * Eredmény: S = −40,25 kN (nyomott), B_x = −36 kN (balra), B_y = −6 kN (lefelé).
 */

const OX = 90;
const Y = 110;
const L = 100;
const X0 = OX;
const XR = OX + L; // az eredő helye
const XC = OX + 2 * L;
const XB = OX + 4 * L;
const YA = Y + L;
const CB = 2 / Math.sqrt(5); // cos β = 0,8944
const SB = 1 / Math.sqrt(5); // sin β = 0,4472

const T = { elk: 0, kij: 4.5, mb: 8.5, fx: 13, fy: 16.5, ell: 20, ered: 24 };

const FEJEZETEK = [
  {
    t0: T.elk,
    cim: "A feladat és az elkülönítés",
    szoveg: "A rúd hajlása: tg β = a/2a = 0,5, β = 26,57°. A B csukló helyére B_x és B_y kerül; a rudat elvágjuk, és a C pontban a rúd tengelyében ható S rúderőt vesszük fel — húzóerőként, a C-ből az A felé mutatva.",
    kepletek: ["a = 1{,}2\\ \\text{m},\\ p_1 = 5\\ \\text{kN/m},\\quad \\sin\\beta = 0{,}4472,\\ \\cos\\beta = 0{,}8944"],
  },
  {
    t0: T.kij,
    cim: "Egyensúlyi kijelentés — a megoszló teher eredője",
    szoveg: "A megoszló terhet az eredőjével helyettesítjük: R = p₁·2a = 12 kN, a szakasz közepén, x = 1,2 m-nél. Az S komponensei: 0,8944 S balra, 0,4472 S lefelé.",
    kepletek: ["(\\underline{p}_1, \\underline{S}, \\underline{B}_x, \\underline{B}_y) \\ekv \\underline{O}", "R = 5\\cdot 2{,}4 = 12\\ \\text{kN}"],
  },
  {
    t0: T.mb,
    cim: "Nyomaték a B csuklóra → S",
    szoveg: "B-n átmegy B_x és B_y hatásvonala. S vízszintes komponense a gerenda tengelyében hat (karja nulla), a függőleges komponens karja 2,4 m, R karja 3,6 m — mindkettő a ponttól balra lefelé mutat, az óramutatóval ellentétesen forgat.",
    kepletek: ["\\Mp{B} 12\\cdot 3{,}6 + 0{,}4472\\,S\\cdot 2{,}4 = 0\\ \\Rightarrow\\ S = -40{,}25\\ \\text{kN}"],
  },
  {
    t0: T.fx,
    cim: "Vízszintes vetület → B_x",
    szoveg: "S-t az előjelével együtt helyettesítjük. B_x negatív: valójában balra mutat.",
    kepletek: ["\\Fx -0{,}8944\\,S + B_x = 0\\ \\Rightarrow\\ B_x = 0{,}8944\\cdot(-40{,}25) = -36{,}00\\ \\text{kN}"],
  },
  {
    t0: T.fy,
    cim: "Függőleges vetület → B_y",
    szoveg: "B_y is negatív: a nyomott rúd 18 kN-nal emeli a gerendát, a 12 kN teher ellenében a csuklónak 6 kN-nal lefelé kell tartania.",
    kepletek: ["\\Fy -12 - 0{,}4472\\,S + B_y = 0\\ \\Rightarrow\\ B_y = 12 - 18{,}00 = -6{,}000\\ \\text{kN}"],
  },
  {
    t0: T.ell,
    cim: "Ellenőrzés: nyomaték a C pontra",
    szoveg: "C-n átmegy S hatásvonala és B_x tengelye. R karja 1,2 m, B_y karja 2,4 m.",
    kepletek: ["\\Mp{C} 12\\cdot 1{,}2 + (-6{,}000)\\cdot 2{,}4 = 14{,}4 - 14{,}4 = 0{,}0\\ \\checkmark"],
  },
  {
    t0: T.ered,
    cim: "Eredményvázlat",
    szoveg: "A rúd nyomott: 40,25 kN-nal tolja a gerendát jobbra-felfelé (36,00 és 18,00 kN). B_x 36,00 kN balra, B_y 6,000 kN lefelé. Három új szám.",
    kepletek: ["|S| = 40{,}25\\ \\text{kN (nyomott)},\\quad B_x = 36{,}00\\ \\text{kN}\\ (\\leftarrow),\\quad B_y = 6{,}000\\ \\text{kN}\\ (\\downarrow)"],
  },
];

function Rajz(t) {
  const terhU = arany(t, 0.2, 1.2);
  const tamaszHalv = arany(t, 1.6, 2.6);
  const reakU = arany(t, 2.4, 3.8);
  const kijU = arany(t, T.kij + 0.2, T.kij + 0.9);
  const eredoU = arany(t, T.kij + 1.2, T.kij + 2.2);
  const kompU = arany(t, T.kij + 2.2, T.kij + 3.0);
  const mbU = arany(t, T.mb + 0.2, T.mb + 0.8);
  const mbKar = arany(t, T.mb + 0.8, T.mb + 2.4);
  const fxU = arany(t, T.fx + 0.2, T.fx + 0.8);
  const fyU = arany(t, T.fy + 0.2, T.fy + 0.8);
  const ellU = arany(t, T.ell + 0.2, T.ell + 0.8);
  const ellKar = arany(t, T.ell + 0.8, T.ell + 2.2);
  const fordulU = arany(t, T.ered + 0.6, T.ered + 1.8);
  const szamU = arany(t, T.ered + 1.6, T.ered + 2.4);

  const fazis = t < T.mb ? "elk" : t < T.fx ? "mb" : t < T.fy ? "fx" : t < T.ell ? "fy" : t < T.ered ? "ell" : "ered";
  const el = {
    mb: { S: 1, Sy: 1, R: 1 },
    fx: { Sx: 1, Bx: 1, S: 0.4 },
    fy: { Sy: 1, By: 1, R: 1, S: 0.4 },
    ell: { R: 1, By: 1 },
  }[fazis];
  const op = (nev) => (el ? (el[nev] ?? 0.18) : 1);
  const kompLat = fazis === "elk" ? kompU : 1;

  // az S húzóerő: a C-ből az A felé mutat; a nyíl farka C-ben, hegye a rúd mentén
  const sH = 66;
  const sTip = { x: XC - sH * CB, y: Y + sH * SB };

  return (
    <svg viewBox="0 0 600 340" className="abra w-full select-none">
      <TartoHegyek />
      <FilmHegyek />
      <Kijelentes x={330} opacitas={kijU * (fazis === "elk" ? 1 : 0.35)}>(p₁, S, Bₓ, Bᵧ) ≐ O</Kijelentes>

      {/* teher: a megoszló, majd az eredője */}
      <MegoszloTeher x1={X0} x2={XC} y={Y} p1={5} leptek={6} cimke1="p₁ = 5 kN/m" opacitas={terhU * (1 - 0.8 * eredoU)} />
      <EroA x={XR} y={Y} hossz={62} szog={-90} u={eredoU} opacitas={op("R")} szin={SZ.nar} hegy="fg-nar" cimke="R = 12 kN" dx={8} dy={-4} />

      {/* a rúd és a támaszok elhalványulnak */}
      <Rud x1={X0} y1={YA} x2={XC} y2={Y} opacitas={1 - 0.85 * tamaszHalv} />
      <Csuklo x={X0} y={YA} opacitas={1 - 0.85 * tamaszHalv} />
      <Tarto x1={X0} y1={Y} x2={XB} y2={Y} />
      <Csuklo x={XB} y={Y} opacitas={1 - 0.88 * tamaszHalv} />
      <TamaszCimke x={X0 - 18} y={YA - 6}>A</TamaszCimke>
      <TamaszCimke x={XB + 18} y={Y + 20}>B</TamaszCimke>
      <TamaszCimke x={XC + 12} y={Y - 10}>C</TamaszCimke>
      <MeretFugg x={X0 - 44} y1={Y} y2={YA} cimke="1,2 m" opacitas={0.8} />
      <Meret x1={X0} x2={XC} y={YA + 50} cimke="2,4 m" opacitas={0.8} />
      <Meret x1={XC} x2={XB} y={YA + 50} cimke="2,4 m" opacitas={0.8} />

      {/* reakciók: S húzóként (C → A), B_x jobbra, B_y felfelé */}
      <EroA x={sTip.x} y={sTip.y} hossz={sH} szog={-153.43} u={reakU} opacitas={op("S") * (1 - fordulU)} cimke="S (húzó)" dx={-6} dy={16} horgony="end" cimkeHegy />
      <EroA x={XC - 44} y={Y - 14} hossz={44} szog={180} u={kompLat} opacitas={op("Sx") * (fazis === "elk" ? 0.9 : 1) * (1 - fordulU)} vastag={2.2} cimke="0,8944 S" dx={-4} dy={-6} horgony="end" />
      <EroA x={XC} y={Y + 46} hossz={40} szog={-90} u={kompLat} opacitas={op("Sy") * (fazis === "elk" ? 0.9 : 1) * (1 - fordulU)} vastag={2.2} cimke="0,4472 S" dx={8} dy={14} />
      <EroA x={XB + 46} y={Y} hossz={46} szog={0} u={reakU} opacitas={op("Bx") * (1 - fordulU)} cimke="Bₓ" dx={-6} dy={-10} horgony="end" />
      <EroA x={XB} y={Y} hossz={60} szog={90} u={reakU} opacitas={op("By") * (1 - fordulU)} cimke="Bᵧ" dx={8} dy={4} />

      {/* eredmény: átfordult nyilak */}
      <EroA x={XC} y={Y} hossz={sH} szog={26.57} u={fordulU} cimke={szamU > 0.5 ? "S = 40,25 kN (nyomott)" : "S"} dx={10} dy={18} />
      <EroA x={XB} y={Y} hossz={46} szog={180} u={fordulU} cimke={szamU > 0.5 ? "Bₓ = 36,00 kN" : "Bₓ"} dx={-30} dy={-12} />
      <EroA x={XB} y={Y + 60} hossz={60} szog={-90} u={fordulU} cimke={szamU > 0.5 ? "Bᵧ = 6,000 kN" : "Bᵧ"} dx={8} dy={40} />

      {fazis === "mb" && (
        <g opacity={mbU}>
          <Fokusz x={XB} y={Y} t={t} cimke="B" dx={12} dy={-14} />
          <Kar x1={XB} y1={Y - 26} x2={XR} y2={Y - 26} u={arany(mbKar, 0, 0.5)} cimke="3,6 m" dy={-5} />
          <Kar x1={XB} y1={Y + 24} x2={XC} y2={Y + 24} u={arany(mbKar, 0.45, 1)} cimke="2,4 m" dy={16} dx={40} />
          <Pipa x={330} y={YA + 90} opacitas={arany(t, T.mb + 2.6, T.mb + 3.2)}>43,2 + 1,073 S = 0 → S = −40,25 kN: a rúd nyomott</Pipa>
        </g>
      )}
      {fazis === "fx" && (
        <g opacity={fxU}>
          <VonalA x1={30} y1={Y + 26} x2={570} y2={Y + 26} szin="#94a3b8" vastag={1} />
          <Pipa x={330} y={YA + 90} opacitas={arany(t, T.fx + 1.4, T.fx + 2.0)}>Bₓ = 0,8944·(−40,25) = −36,00 kN → balra</Pipa>
        </g>
      )}
      {fazis === "fy" && (
        <g opacity={fyU}>
          <Pipa x={330} y={YA + 90} opacitas={arany(t, T.fy + 1.4, T.fy + 2.0)}>Bᵧ = 12 − 18,00 = −6,000 kN → lefelé</Pipa>
        </g>
      )}
      {fazis === "ell" && (
        <g opacity={ellU}>
          <Fokusz x={XC} y={Y} t={t} szin={SZ.zold} cimke="C" dx={10} dy={-14} />
          <Kar x1={XC} y1={Y - 26} x2={XR} y2={Y - 26} u={arany(ellKar, 0, 0.5)} cimke="1,2 m" dy={-5} szin={SZ.zold} />
          <Kar x1={XC} y1={Y + 24} x2={XB} y2={Y + 24} u={arany(ellKar, 0.45, 1)} cimke="2,4 m" dy={16} szin={SZ.zold} />
          <Pipa x={330} y={YA + 90} opacitas={arany(t, T.ell + 2.4, T.ell + 3.0)}>14,4 − 14,4 = 0,0 ✓</Pipa>
        </g>
      )}
      {fazis === "ered" && (
        <FeliratA x={330} y={YA + 90} szin={SZ.zold} meret={12.5} opacitas={arany(t, T.ered + 0.2, T.ered + 0.8)}>
          Eredményvázlat: 36 jobbra – 36 balra, 18 fel – 12 + 6 le
        </FeliratA>
      )}
    </svg>
  );
}

export default function FilmGyf3() {
  return (
    <FeladatFilm
      cim="GYF‑3 · Rúddal megtámasztott gerenda — a rúderő húzóként felvéve"
      hossz={28}
      fejezetek={FEJEZETEK}
      rajz={Rajz}
      megjegyzes="A rúderőt mindig húzóerőnek vesszük fel; a negatív előjel mondja meg, hogy a rúd valójában nyomott. A végén mindhárom nyíl átfordul a tényleges irányba."
    />
  );
}
