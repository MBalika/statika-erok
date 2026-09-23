"use client";

import FeladatFilm from "@/components/anim/FeladatFilm";
import { arany } from "@/components/anim/Idovonal";
import { VonalA, FeliratA } from "@/components/anim/FilmElemek";
import { TartoHegyek, Tarto, Csuklo, Gorgo, BelsoCsuklo, Meret, TamaszCimke } from "@/components/tartok/TartoElemek";
import { EroA, Kar, Fokusz, Pipa, Kijelentes, FilmHegyek, SZ } from "@/components/tartok/FilmGyf1";

/*
 * GYF‑1 · Gerber-tartó (tankönyv 5.4) — film.
 * A(0) csukló, B(4) görgő, C(6) belső csukló, D(9) görgő; F₁ = 12 kN (60°) x = 2; F₂ = 8 kN x = 8.
 * Eredmény: D = 5,333; C_y = 2,667 (a II. testre ↑); C_x = 0; B = 9,196; A_y = 3,863; A_x = −6 (balra).
 */

const OX = 56;
const Y = 175;
const L = 52;
const kx = (x) => OX + x * L;
const KEK = "#0369a1";

const T = { elk: 0, kij: 5, d: 9, cy: 13, b: 17, ay: 21, ell: 25, ered: 29 };

const FEJEZETEK = [
  {
    t0: T.elk,
    cim: "A feladat és az elkülönítés",
    szoveg: "Gerber-tartó: a C csuklónál kettéválasztjuk. A II. test (C–D) csak egy görgővel áll — befüggesztett rész; az I. test (A–C) csuklóval és görgővel — fix rész. A csuklóban a két testre ellentett erőpárt veszünk fel.",
    kepletek: ["F_1 = 12\\ \\text{kN}\\ (60^\\circ):\\ 6{,}000 \\to,\\ 10{,}39 \\downarrow;\\quad F_2 = 8\\ \\text{kN} \\downarrow"],
  },
  {
    t0: T.kij,
    cim: "Egyensúlyi kijelentések",
    szoveg: "Testenként és az egészre. A II. kijelentésben három ismeretlen van (C_x, C_y, D) — ezzel kezdünk. Az egészre írtban a csuklóerő kiesett.",
    kepletek: ["\\text{II: } (\\underline F_2, \\underline D, \\underline C_x, \\underline C_y) \\ekv \\underline O", "\\text{I: } (\\underline F_1, \\underline A_x, \\underline A_y, \\underline B, \\underline C'_x, \\underline C'_y) \\ekv \\underline O"],
  },
  {
    t0: T.d,
    cim: "II. test: nyomaték C-re → D",
    szoveg: "A C ponton átmegy C_x és C_y hatásvonala: kiesnek. Marad F₂ (2 m kar, óramutató szerint) és D (3 m kar).",
    kepletek: ["\\text{II: } \\Mp{C}\\ -8\\cdot 2 + D\\cdot 3 = 0\\ \\Rightarrow\\ D = 5{,}333\\ \\text{kN}"],
  },
  {
    t0: T.cy,
    cim: "II. test: nyomaték D-re → C_y, vízszintes vetület → C_x",
    szoveg: "D-re nézve D és C_x karja nulla. F₂ 1 m-re balra lefelé: pozitív; C_y 3 m-re balra felfelé: negatív. A II. testet a csukló 2,667 kN-nal tartja felfelé — az I. testre ugyanennyi hat lefelé.",
    kepletek: ["\\text{II: } \\Mp{D}\\ 8\\cdot 1 - C_y\\cdot 3 = 0\\ \\Rightarrow\\ C_y = 2{,}667\\ \\text{kN}", "\\text{II: } \\Fx\\ C_x = 0"],
  },
  {
    t0: T.b,
    cim: "I. test: nyomaték A-ra → B",
    szoveg: "Az I. test most egy kéttámaszú tartó, terhei F₁ és a C-ben lefelé ható 2,667 kN. Az A-n átmegy A_x, A_y; F₁ vízszintes komponense a tengelyben hat.",
    kepletek: ["\\text{I: } \\Mp{A}\\ -10{,}39\\cdot 2 - 2{,}667\\cdot 6 + B\\cdot 4 = 0\\ \\Rightarrow\\ B = 9{,}196\\ \\text{kN}"],
  },
  {
    t0: T.ay,
    cim: "I. test: nyomaték B-re → A_y, vízszintes vetület → A_x",
    szoveg: "B-re a görgőerő és A_x kiesik. A_x negatív: valójában balra mutat, az F₁ vízszintes komponensét egyensúlyozza.",
    kepletek: ["\\text{I: } \\Mp{B}\\ 10{,}39\\cdot 2 - 2{,}667\\cdot 2 - A_y\\cdot 4 = 0\\ \\Rightarrow\\ A_y = 3{,}863\\ \\text{kN}", "\\text{I: } \\Fx\\ 6{,}000 + A_x = 0\\ \\Rightarrow\\ A_x = -6{,}000\\ \\text{kN}"],
  },
  {
    t0: T.ell,
    cim: "Ellenőrzés: függőleges vetület az egészre",
    szoveg: "Nem használt egyenlet, és a csuklóerő nem is szerepel benne: az egész szerkezetre a belső erők kiesnek.",
    kepletek: ["\\Sigma:\\ \\Fy\\ 3{,}863 + 9{,}196 + 5{,}333 - 10{,}39 - 8 = 0{,}00\\ \\checkmark"],
  },
  {
    t0: T.ered,
    cim: "Eredményvázlat testenként",
    szoveg: "A tényleges irányokkal: A_x átfordul balra. Hat új szám: négy külső reakció és a csuklóerő két komponense.",
    kepletek: ["A_x = 6{,}000\\ (\\leftarrow),\\ A_y = 3{,}863\\ (\\uparrow),\\ B = 9{,}196,\\ D = 5{,}333\\ (\\uparrow),\\ C_y = 2{,}667\\ \\text{kN}"],
  },
];

function Rajz(t) {
  const terhU = arany(t, 0.2, 1.0);
  const szetU = arany(t, 1.4, 2.8); // a két test eltávolodik
  const tamaszHalv = 1 - 0.85 * arany(t, 2.0, 3.0);
  const reakU = arany(t, 2.8, 4.0);
  const kijU = arany(t, T.kij + 0.2, T.kij + 0.9);
  const eredU = arany(t, T.ered + 0.2, T.ered + 1.0);
  const fordulU = arany(t, T.ered + 1.0, T.ered + 2.0);

  const fazis = t < T.kij ? "elk" : t < T.d ? "kij" : t < T.cy ? "d" : t < T.b ? "cy" : t < T.ay ? "b" : t < T.ell ? "ay" : t < T.ered ? "ell" : "ered";
  const el = {
    d: { F2: 1, D: 1, Cx: 0.3, Cy: 0.3 },
    cy: { F2: 1, Cy: 1, Cx: 1, D: 0.3 },
    b: { F1: 1, B: 1, Cyi: 1 },
    ay: { F1: 1, Ay: 1, Ax: 1, Cyi: 1 },
    ell: { F1: 1, F2: 1, Ay: 1, B: 1, D: 1 },
  }[fazis];
  const op = (nev) => (el ? (el[nev] ? el[nev] : 0.18) : 1);
  const testOp = (test) => (fazis === "d" || fazis === "cy" ? (test === 2 ? 1 : 0.35) : fazis === "b" || fazis === "ay" ? (test === 1 ? 1 : 0.35) : 1);

  // a két test eltolása
  const dI = [-16 * szetU, 26 * szetU];
  const dII = [16 * szetU, -26 * szetU];
  const szamU = arany(t, T.ered + 1.8, T.ered + 2.6);
  const fopont = fazis === "d" ? { x: kx(6) + dII[0], y: Y + dII[1], nev: "C", test: 2 } : fazis === "cy" ? { x: kx(9) + dII[0], y: Y + dII[1], nev: "D", test: 2 } : fazis === "b" ? { x: kx(0) + dI[0], y: Y + dI[1], nev: "A", test: 1 } : fazis === "ay" ? { x: kx(4) + dI[0], y: Y + dI[1], nev: "B", test: 1 } : null;

  return (
    <svg viewBox="0 0 600 352" className="abra w-full select-none">
      <TartoHegyek />
      <FilmHegyek />
      <Kijelentes opacitas={kijU * (fazis === "kij" ? 1 : 0.35)} y={22}>
        II: (F₂, D, C) ≐ O · I: (F₁, A, B, C′) ≐ O
      </Kijelentes>

      {/* I. test */}
      <g transform={`translate(${dI[0]} ${dI[1]})`} opacity={testOp(1)}>
        <Csuklo x={kx(0)} y={Y} opacitas={tamaszHalv} />
        <Gorgo x={kx(4)} y={Y} opacitas={tamaszHalv} />
        <Tarto x1={kx(0)} y1={Y} x2={kx(6)} y2={Y} />
        <TamaszCimke x={kx(0) - 16} y={Y + 26}>A</TamaszCimke>
        <TamaszCimke x={kx(4) + 16} y={Y + 26}>B</TamaszCimke>
        <FeliratA x={kx(3)} y={Y + 44} szin="#334155" meret={11} opacitas={szetU}>I. test (fix rész)</FeliratA>
        <EroA x={kx(2)} y={Y} hossz={62} szog={-60} u={terhU} opacitas={op("F1")} szin={SZ.nar} hegy="fg-nar" cimke="F₁ = 12 kN" dx={-4} dy={-8} horgony="end" />
        {/* reakciók */}
        <EroA x={kx(0)} y={Y} hossz={40} szog={0} u={reakU} opacitas={op("Ax") * (1 - fordulU)} cimke="Aₓ" dx={-4} dy={-10} horgony="end" />
        <EroA x={kx(0) - 2} y={Y - 9} hossz={40} szog={180} u={fordulU} cimke="Aₓ = 6,000" dx={4} dy={-8} />
        <EroA x={kx(0)} y={Y + 2} hossz={50} szog={90} u={reakU} opacitas={op("Ay")} cimke={szamU > 0.5 ? "Aᵧ = 3,863" : "Aᵧ"} dx={6} dy={6} />
        <EroA x={kx(4)} y={Y + 2} hossz={56} szog={90} u={reakU} opacitas={op("B")} cimke={szamU > 0.5 ? "B = 9,196" : "B"} dx={6} dy={6} />
        {/* a csuklóerő ellentettje az I. testen: lefelé */}
        <g opacity={op("Cyi")}>
          <EroA x={kx(6)} y={Y + 2 + 40 * szetU} hossz={40 * szetU} szog={-90} u={szetU} szin={KEK} hegy="fg-kek" vastag={2.6} cimke={t > T.cy + 1.5 ? "C′ᵧ = 2,667" : "C′ᵧ"} dx={6} dy={4} cimkeHegy />
          <EroA x={kx(6) - 30 * szetU} y={Y} hossz={30 * szetU} szog={180} u={szetU} szin={KEK} hegy="fg-kek" vastag={2.2} cimke="C′ₓ" dx={-2} dy={-8} horgony="end" cimkeHegy />
        </g>
      </g>

      {/* II. test */}
      <g transform={`translate(${dII[0]} ${dII[1]})`} opacity={testOp(2)}>
        <Gorgo x={kx(9)} y={Y} opacitas={tamaszHalv} />
        <Tarto x1={kx(6)} y1={Y} x2={kx(9)} y2={Y} />
        <BelsoCsuklo x={kx(6)} y={Y} />
        <TamaszCimke x={kx(6)} y={Y - 12}>C</TamaszCimke>
        <TamaszCimke x={kx(9) + 16} y={Y + 26}>D</TamaszCimke>
        <FeliratA x={kx(7.5)} y={Y - 44} szin="#334155" meret={11} opacitas={szetU}>II. test (befüggesztett)</FeliratA>
        <EroA x={kx(8)} y={Y} hossz={52} szog={-90} u={terhU} opacitas={op("F2")} szin={SZ.nar} hegy="fg-nar" cimke="F₂ = 8 kN" dx={6} dy={-2} />
        <EroA x={kx(9)} y={Y + 2} hossz={44} szog={90} u={reakU} opacitas={op("D")} cimke={t > T.d + 1.5 ? "D = 5,333" : "D"} dx={-8} dy={18} horgony="end" />
        <g opacity={op("Cy") * szetU}>
          <EroA x={kx(6)} y={Y - 2 - 36} hossz={36} szog={90} u={szetU} szin={KEK} hegy="fg-kek" vastag={2.6} cimke={t > T.cy + 1.5 ? "Cᵧ = 2,667" : "Cᵧ"} dx={-6} dy={-2} horgony="end" cimkeHegy />
        </g>
        <g opacity={op("Cx") * szetU}>
          <EroA x={kx(6) + 30} y={Y} hossz={30} szog={0} u={szetU} szin={KEK} hegy="fg-kek" vastag={2.2} cimke={t > T.cy + 2.5 ? "Cₓ = 0" : "Cₓ"} dx={4} dy={-8} />
        </g>
      </g>

      {/* méretek (az összerakott helyzethez) */}
      <g opacity={1 - szetU}>
        <Meret x1={kx(0)} x2={kx(2)} y={Y + 96} cimke="2" opacitas={0.8} />
        <Meret x1={kx(2)} x2={kx(4)} y={Y + 96} cimke="2" opacitas={0.8} />
        <Meret x1={kx(4)} x2={kx(6)} y={Y + 96} cimke="2" opacitas={0.8} />
        <Meret x1={kx(6)} x2={kx(8)} y={Y + 96} cimke="2" opacitas={0.8} />
        <Meret x1={kx(8)} x2={kx(9)} y={Y + 96} cimke="1 m" opacitas={0.8} />
      </g>

      {/* főpont és karok */}
      {fopont && (
        <g>
          <Fokusz x={fopont.x} y={fopont.y} t={t} cimke={fopont.nev} dx={fopont.test === 2 ? 10 : -26} dy={fopont.test === 2 ? 26 : -14} />
          {fazis === "d" && <Kar x1={kx(6) + dII[0]} y1={Y + dII[1] + 30} x2={kx(8) + dII[0]} y2={Y + dII[1] + 30} u={arany(t, T.d + 0.6, T.d + 1.4)} cimke="2 m" dy={14} />}
          {fazis === "d" && <Kar x1={kx(6) + dII[0]} y1={Y + dII[1] + 46} x2={kx(9) + dII[0]} y2={Y + dII[1] + 46} u={arany(t, T.d + 1.2, T.d + 2.0)} cimke="3 m" dy={14} />}
          {fazis === "cy" && <Kar x1={kx(8) + dII[0]} y1={Y + dII[1] + 30} x2={kx(9) + dII[0]} y2={Y + dII[1] + 30} u={arany(t, T.cy + 0.6, T.cy + 1.4)} cimke="1 m" dy={14} />}
          {fazis === "cy" && <Kar x1={kx(6) + dII[0]} y1={Y + dII[1] + 46} x2={kx(9) + dII[0]} y2={Y + dII[1] + 46} u={arany(t, T.cy + 1.2, T.cy + 2.0)} cimke="3 m" dy={14} />}
          {fazis === "b" && <Kar x1={kx(0) + dI[0]} y1={Y + dI[1] + 70} x2={kx(2) + dI[0]} y2={Y + dI[1] + 70} u={arany(t, T.b + 0.6, T.b + 1.2)} cimke="2 m" dy={14} />}
          {fazis === "b" && <Kar x1={kx(0) + dI[0]} y1={Y + dI[1] + 86} x2={kx(4) + dI[0]} y2={Y + dI[1] + 86} u={arany(t, T.b + 1.0, T.b + 1.6)} cimke="4 m" dy={14} />}
          {fazis === "b" && <Kar x1={kx(0) + dI[0]} y1={Y + dI[1] + 102} x2={kx(6) + dI[0]} y2={Y + dI[1] + 102} u={arany(t, T.b + 1.4, T.b + 2.0)} cimke="6 m" dy={14} />}
          {fazis === "ay" && <Kar x1={kx(2) + dI[0]} y1={Y + dI[1] + 70} x2={kx(4) + dI[0]} y2={Y + dI[1] + 70} u={arany(t, T.ay + 0.6, T.ay + 1.2)} cimke="2 m" dy={14} />}
          {fazis === "ay" && <Kar x1={kx(4) + dI[0]} y1={Y + dI[1] + 86} x2={kx(6) + dI[0]} y2={Y + dI[1] + 86} u={arany(t, T.ay + 1.0, T.ay + 1.6)} cimke="2 m" dy={14} />}
          {fazis === "ay" && <Kar x1={kx(0) + dI[0]} y1={Y + dI[1] + 102} x2={kx(4) + dI[0]} y2={Y + dI[1] + 102} u={arany(t, T.ay + 1.4, T.ay + 2.0)} cimke="4 m" dy={14} />}
        </g>
      )}

      {fazis === "d" && <Pipa x={300} y={336} opacitas={arany(t, T.d + 2.2, T.d + 2.8)}>D = 16 / 3 = 5,333 kN</Pipa>}
      {fazis === "cy" && <Pipa x={300} y={336} opacitas={arany(t, T.cy + 2.2, T.cy + 2.8)}>Cᵧ = 8 / 3 = 2,667 kN — a II. testre felfelé, az I.-re lefelé</Pipa>}
      {fazis === "b" && <Pipa x={300} y={336} opacitas={arany(t, T.b + 2.2, T.b + 2.8)}>B = (20,78 + 16,00) / 4 = 9,196 kN</Pipa>}
      {fazis === "ay" && <Pipa x={300} y={336} opacitas={arany(t, T.ay + 2.2, T.ay + 2.8)}>Aᵧ = (20,78 − 5,333) / 4 = 3,863 kN · Aₓ = −6,000 kN</Pipa>}
      {fazis === "ell" && (
        <g opacity={arany(t, T.ell + 0.2, T.ell + 0.8)}>
          <VonalA x1={30} y1={Y + 120} x2={570} y2={Y + 120} szin="#94a3b8" vastag={1} />
          <FeliratA x={300} y={Y + 134} szin={SZ.szurke} meret={11.5} vastag={false}>függőleges vetület az egészre: a csuklóerő nincs benne</FeliratA>
          <Pipa x={300} y={336} opacitas={arany(t, T.ell + 1.6, T.ell + 2.2)}>3,863 + 9,196 + 5,333 − 10,39 − 8 = 0,00 ✓</Pipa>
        </g>
      )}
      {fazis === "ered" && (
        <g opacity={eredU}>
          <FeliratA x={300} y={336} szin={SZ.zold} meret={12.5}>Eredményvázlat testenként: 6 új szám, tényleges irányokkal</FeliratA>
        </g>
      )}
    </svg>
  );
}

export default function FilmGyf1() {
  return (
    <FeladatFilm
      cim="GYF‑1 · Gerber-tartó — szétszedés, befüggesztett rész, fix rész"
      hossz={33}
      fejezetek={FEJEZETEK}
      rajz={Rajz}
      megjegyzes="A kék nyilak a belső csuklóerő-pár: a két testen ellentett irányúak, azonos nagyságúak. A halvány elemek az adott egyenletben nem szerepelnek."
    />
  );
}
