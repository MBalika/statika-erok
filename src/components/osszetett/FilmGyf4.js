"use client";

import FeladatFilm from "@/components/anim/FeladatFilm";
import { arany, lukteto } from "@/components/anim/Idovonal";
import { FeliratA, VonalA } from "@/components/anim/FilmElemek";
import { TartoHegyek, Tarto, Csuklo, Gorgo, Meret, TamaszCimke } from "@/components/tartok/TartoElemek";
import { EroA, Kar, Fokusz, Pipa, Kijelentes, FilmHegyek, SZ } from "@/components/tartok/FilmGyf1";

/*
 * GYF‑4 · Csuklóján terhelt Gerber-tartó (tankönyv 5.9) — film.
 * A(0) csukló, B(4) görgő, C(6) csukló F₂ = 10 kN-nal terhelve, D(9) görgő; F₁ = 12 kN (60°) x = 2; F₃ = 6 kN x = 8.
 * Eredmény: D = 4; C_II = (0; 2) ↑; C_I = (0; −12) ↓; B = 23,20; A_y = −0,804; A_x = −6.
 */

const OX = 80;
const Y = 190;
const L = 44;
const kx = (x) => OX + x * L;
const KEK = "#0369a1";

const T = { elk: 0, kij: 5, ii: 9, cs: 14, i: 19, ell: 24, ered: 28 };

const FEJEZETEK = [
  {
    t0: T.elk,
    cim: "A feladat és az elkülönítés — három test",
    szoveg: "A C csuklót közvetlenül terheli F₂ = 10 kN. Ezért nem két, hanem három részt különítünk el: az I. testet, a II. testet és magát a C csuklót. A csuklóra a teher és a két testről érkező csuklóerők ellentettjei hatnak.",
    kepletek: ["F_1 = 12\\ \\text{kN}\\ (60^\\circ),\\ F_2 = 10\\ \\text{kN}\\ (C\\text{-n}),\\ F_3 = 6\\ \\text{kN}"],
  },
  {
    t0: T.kij,
    cim: "Egyensúlyi kijelentések",
    szoveg: "A csuklóra ható közös metszéspontú erőrendszer két vetületi egyenletet ad. Összesen 3 + 3 + 2 = 8 egyenlet a 8 ismeretlenre.",
    kepletek: ["\\text{II: } (\\underline F_3, \\underline D, \\underline C_{II}) \\ekv \\underline O,\\quad \\text{C: } (\\underline F_2, \\underline C'_{I}, \\underline C'_{II}) \\ekv \\underline O,\\quad \\text{I: } (\\underline F_1, \\underline A, \\underline B, \\underline C_{I}) \\ekv \\underline O"],
  },
  {
    t0: T.ii,
    cim: "II. test (befüggesztett): D, C_IIy, C_IIx",
    szoveg: "Ugyanaz, mint egy kéttámaszú tartó: nyomaték C-re → D, nyomaték D-re → C_IIy, vízszintes vetület → C_IIx.",
    kepletek: ["\\text{II: } \\Mp{C}\\ -6\\cdot 2 + 3D = 0 \\Rightarrow D = 4{,}000", "\\text{II: } \\Mp{D}\\ 6\\cdot 1 - 3\\,C_{IIy} = 0 \\Rightarrow C_{IIy} = 2{,}000;\\quad \\Fx\\ C_{IIx} = 0"],
  },
  {
    t0: T.cs,
    cim: "A C csukló egyensúlya → C_I",
    szoveg: "A csuklóra lefelé hat F₂ = 10 és a II. test ellentett csuklóereje (2 kN lefelé); ezeket az I. testről érkező C′_I tartja. Az I. testre így 12 kN hat lefelé — több, mint a teher!",
    kepletek: ["\\text{C: } \\Fy\\ -10 - C_{Iy} - 2 = 0 \\Rightarrow C_{Iy} = -12{,}00\\ \\text{kN};\\quad \\Fx\\ C_{Ix} = 0"],
  },
  {
    t0: T.i,
    cim: "I. test (fix rész): B, A_y, A_x",
    szoveg: "Kéttámaszú tartó F₁-gyel és a C-ben lefelé ható 12 kN-nal. A_y kicsit negatív: a C-nél lógó teher a B körül majdnem felbillenti a gerendát.",
    kepletek: ["\\text{I: } \\Mp{A}\\ -10{,}39\\cdot 2 - 12\\cdot 6 + 4B = 0 \\Rightarrow B = 23{,}20", "\\text{I: } \\Mp{B}\\ 10{,}39\\cdot 2 - 12\\cdot 2 - 4A_y = 0 \\Rightarrow A_y = -0{,}804;\\quad \\Fx\\ A_x = -6{,}000"],
  },
  {
    t0: T.ell,
    cim: "Ellenőrzés: függőleges vetület az egészre",
    szoveg: "A csuklóerők kiesnek, de a csuklón ható F₂ benne marad!",
    kepletek: ["\\Sigma: \\Fy\\ -0{,}804 + 23{,}20 + 4 - 10{,}39 - 10 - 6 = 0{,}00\\ \\checkmark"],
  },
  {
    t0: T.ered,
    cim: "Eredményvázlat",
    szoveg: "A csuklóban: a II. testre 2 kN felfelé, az I. testre 12 kN lefelé — a különbség éppen a csuklón ható 10 kN. Az A_x és A_y nyila átfordul.",
    kepletek: ["A_x = 6\\ (\\leftarrow),\\ A_y = 0{,}804\\ (\\downarrow),\\ B = 23{,}20,\\ D = 4{,}000\\ (\\uparrow);\\ C_{II} = 2\\ (\\uparrow),\\ C_I = 12\\ (\\downarrow)"],
  },
];

function Rajz(t) {
  const terhU = arany(t, 0.2, 1.0);
  const szetU = arany(t, 1.6, 3.2);
  const tamaszHalv = 1 - 0.85 * arany(t, 2.0, 3.0);
  const reakU = arany(t, 3.0, 4.2);
  const kijU = arany(t, T.kij + 0.2, T.kij + 0.9);
  const eredU = arany(t, T.ered + 0.2, T.ered + 1.0);
  const fordulU = arany(t, T.ered + 1.0, T.ered + 2.0);
  const fazis = t < T.kij ? "elk" : t < T.ii ? "kij" : t < T.cs ? "ii" : t < T.i ? "cs" : t < T.ell ? "i" : t < T.ered ? "ell" : "ered";
  const testOp = (nev) => {
    if (fazis === "ii") return nev === "II" ? 1 : 0.3;
    if (fazis === "cs") return nev === "C" ? 1 : 0.3;
    if (fazis === "i") return nev === "I" ? 1 : 0.3;
    return 1;
  };
  const szamII = t > T.ii + 2.5 ? 1 : 0;
  const szamC = t > T.cs + 2.2 ? 1 : 0;
  const szamI = t > T.i + 2.5 ? 1 : 0;

  // a két test eltolása a szétszedéskor; a C csukló középen marad
  const dI = [-28 * szetU, 40 * szetU];
  const dII = [28 * szetU, -40 * szetU];
  const CX = kx(6), CY = Y;
  const l = lukteto(t, 1.2);

  return (
    <svg viewBox="0 0 600 360" className="abra w-full select-none">
      <TartoHegyek />
      <FilmHegyek />
      <Kijelentes opacitas={kijU * (fazis === "kij" ? 1 : 0.35)} y={22} szeles={470}>
        II: (F₃, D, Cᵢᵢ) ≐ O · C: (F₂, C′ᵢ, C′ᵢᵢ) ≐ O · I: (F₁, A, B, Cᵢ) ≐ O
      </Kijelentes>

      {/* I. test */}
      <g transform={`translate(${dI[0]} ${dI[1]})`} opacity={testOp("I")}>
        <Csuklo x={kx(0)} y={Y} opacitas={tamaszHalv} />
        <Gorgo x={kx(4)} y={Y} opacitas={tamaszHalv} />
        <Tarto x1={kx(0)} y1={Y} x2={kx(6)} y2={Y} />
        <TamaszCimke x={kx(0) - 16} y={Y + 26}>A</TamaszCimke>
        <TamaszCimke x={kx(4) + 16} y={Y + 26}>B</TamaszCimke>
        <FeliratA x={kx(2.6)} y={Y + 44} szin="#334155" meret={11} opacitas={szetU}>I. test</FeliratA>
        <EroA x={kx(2)} y={Y} hossz={62} szog={-60} u={terhU} szin={SZ.nar} hegy="fg-nar" cimke="F₁ = 12" dx={-4} dy={-8} horgony="end" />
        <EroA x={kx(0)} y={Y} hossz={32} szog={0} u={reakU} opacitas={1 - fordulU} cimke="Aₓ" dx={4} dy={-10} />
        <EroA x={kx(0) - 2} y={Y - 9} hossz={34} szog={180} u={fordulU} cimke="Aₓ = 6" dx={4} dy={-8} />
        <EroA x={kx(0)} y={Y + 2} hossz={34} szog={90} u={reakU} opacitas={1 - fordulU} cimke={szamI ? "Aᵧ = −0,80" : "Aᵧ"} dx={6} dy={6} />
        <EroA x={kx(0) + 8} y={Y + 36} hossz={30} szog={-90} u={fordulU} cimke="Aᵧ = 0,80" dx={6} dy={14} cimkeHegy />
        <EroA x={kx(4)} y={Y + 2} hossz={66} szog={90} u={reakU} cimke={szamI ? "B = 23,20" : "B"} dx={6} dy={6} />
        {/* C_I: az I. testre; a felvett irány felfelé, a valóságban 12 kN lefelé */}
        <EroA x={kx(6)} y={Y + 2 + 44 * szetU} hossz={44 * szetU} szog={-90} u={szetU} opacitas={szamC ? 1 : 0.55} szin={KEK} hegy="fg-kek" vastag={2.6} cimke={szamC ? "Cᵢᵧ: 12 kN ↓" : "Cᵢᵧ"} dx={-6} dy={4} horgony="end" cimkeHegy />
      </g>

      {/* II. test */}
      <g transform={`translate(${dII[0]} ${dII[1]})`} opacity={testOp("II")}>
        <Gorgo x={kx(9)} y={Y} opacitas={tamaszHalv} />
        <Tarto x1={kx(6)} y1={Y} x2={kx(9)} y2={Y} />
        <TamaszCimke x={kx(9) + 16} y={Y + 26}>D</TamaszCimke>
        <FeliratA x={kx(7)} y={Y + 24} szin="#334155" meret={11} opacitas={szetU}>II. test</FeliratA>
        <EroA x={kx(8)} y={Y} hossz={44} szog={-90} u={terhU} szin={SZ.nar} hegy="fg-nar" cimke="F₃ = 6" dx={6} dy={-2} />
        <EroA x={kx(9)} y={Y + 2} hossz={40} szog={90} u={reakU} cimke={szamII ? "D = 4,000" : "D"} dx={6} dy={6} />
        <EroA x={kx(6)} y={Y - 2 - 30} hossz={30} szog={90} u={szetU} szin={KEK} hegy="fg-kek" vastag={2.6} cimke={szamII ? "Cᵢᵢᵧ = 2" : "Cᵢᵢᵧ"} dx={6} dy={-4} cimkeHegy />
        <EroA x={kx(6) + 26} y={Y} hossz={26} szog={0} u={szetU} szin={KEK} hegy="fg-kek" vastag={2.2} cimke={szamII ? "Cᵢᵢₓ = 0" : "Cᵢᵢₓ"} dx={4} dy={-8} />
      </g>

      {/* a C csukló középen — külön test: rá hat F₂ és a két csuklóerő ellentettje */}
      <g opacity={testOp("C")}>
        {szetU > 0.05 && (
          <>
            <circle cx={CX} cy={CY} r={9 + (fazis === "cs" ? 3 * l : 0)} fill="white" stroke="#1d3c48" strokeWidth="2.2" opacity={szetU} />
            <FeliratA x={CX} y={CY + 4} szin="#1d3c48" meret={11} opacitas={szetU}>C</FeliratA>
            <EroA x={CX} y={CY - 11} hossz={54} szog={-90} u={szetU} szin={SZ.nar} hegy="fg-nar" cimke="F₂ = 10" dx={-6} dy={-2} horgony="end" />
            {/* −C′_II: 2 kN lefelé a csuklón; −C′_I: 12 kN felfelé */}
            <EroA x={CX + 6} y={CY + 11 + 24 * szetU} hossz={24 * szetU} szog={-90} u={szetU} szin={KEK} hegy="fg-kek" vastag={2.2} cimke={szamII ? "C′ᵢᵢ = 2 ↓" : "C′ᵢᵢ"} dx={4} dy={12} cimkeHegy />
            <EroA x={CX - 6} y={CY + 11} hossz={60 * szetU} szog={90} u={szetU} szin={KEK} hegy="fg-kek" vastag={2.2} cimke={szamC ? "C′ᵢ = 12 ↑" : "C′ᵢ"} dx={10} dy={12} />
          </>
        )}
        {fazis === "elk" && szetU < 0.05 && (
          <>
            <circle cx={CX} cy={CY} r={5.5} fill="white" stroke="#1d3c48" strokeWidth="2" />
            <EroA x={CX} y={CY - 7} hossz={54} szog={-90} u={terhU} szin={SZ.nar} hegy="fg-nar" cimke="F₂ = 10" dx={6} dy={-2} />
          </>
        )}
      </g>

      <g opacity={1 - szetU}>
        <Meret x1={kx(0)} x2={kx(2)} y={Y + 90} cimke="2" opacitas={0.8} />
        <Meret x1={kx(2)} x2={kx(4)} y={Y + 90} cimke="2" opacitas={0.8} />
        <Meret x1={kx(4)} x2={kx(6)} y={Y + 90} cimke="2" opacitas={0.8} />
        <Meret x1={kx(6)} x2={kx(8)} y={Y + 90} cimke="2" opacitas={0.8} />
        <Meret x1={kx(8)} x2={kx(9)} y={Y + 90} cimke="1 m" opacitas={0.8} />
      </g>

      {fazis === "ii" && (
        <g>
          <Fokusz x={kx(6) + dII[0]} y={Y + dII[1]} t={t} />
          <Kar x1={kx(6) + dII[0]} y1={Y + dII[1] + 40} x2={kx(8) + dII[0]} y2={Y + dII[1] + 40} u={arany(t, T.ii + 0.6, T.ii + 1.2)} cimke="2 m" dy={14} />
          <Kar x1={kx(6) + dII[0]} y1={Y + dII[1] + 58} x2={kx(9) + dII[0]} y2={Y + dII[1] + 58} u={arany(t, T.ii + 1.0, T.ii + 1.6)} cimke="3 m" dy={14} />
          <Pipa x={300} y={346} opacitas={arany(t, T.ii + 2.2, T.ii + 2.8)}>D = 4,000 kN · Cᵢᵢᵧ = 2,000 kN (a II. testre ↑) · Cᵢᵢₓ = 0</Pipa>
        </g>
      )}
      {fazis === "cs" && (
        <g>
          <FeliratA x={300} y={Y + 118} szin={SZ.szurke} meret={11.5} vastag={false} opacitas={arany(t, T.cs + 0.2, T.cs + 0.8)}>a csuklón: 10 (F₂) + 2 (C′ᵢᵢ) lefelé = 12 felfelé (C′ᵢ)</FeliratA>
          <Pipa x={300} y={346} opacitas={arany(t, T.cs + 1.8, T.cs + 2.4)}>Cᵢᵧ = −12,00 kN → az I. testre 12 kN lefelé hat</Pipa>
        </g>
      )}
      {fazis === "i" && (
        <g>
          <Fokusz x={kx(0) + dI[0]} y={Y + dI[1]} t={t} />
          <Kar x1={kx(0) + dI[0]} y1={Y + dI[1] + 58} x2={kx(2) + dI[0]} y2={Y + dI[1] + 58} u={arany(t, T.i + 0.6, T.i + 1.2)} cimke="2 m" dy={14} />
          <Kar x1={kx(0) + dI[0]} y1={Y + dI[1] + 74} x2={kx(4) + dI[0]} y2={Y + dI[1] + 74} u={arany(t, T.i + 1.0, T.i + 1.6)} cimke="4 m" dy={14} />
          <Kar x1={kx(0) + dI[0]} y1={Y + dI[1] + 90} x2={kx(6) + dI[0]} y2={Y + dI[1] + 90} u={arany(t, T.i + 1.4, T.i + 2.0)} cimke="6 m" dy={14} />
          <Pipa x={300} y={346} opacitas={arany(t, T.i + 2.2, T.i + 2.8)}>B = (20,78 + 72) / 4 = 23,20 · Aᵧ = (20,78 − 24) / 4 = −0,804 · Aₓ = −6</Pipa>
        </g>
      )}
      {fazis === "ell" && (
        <g opacity={arany(t, T.ell + 0.2, T.ell + 0.8)}>
          <VonalA x1={30} y1={Y + 116} x2={570} y2={Y + 116} szin="#94a3b8" vastag={1} />
          <Pipa x={300} y={346} opacitas={arany(t, T.ell + 1.4, T.ell + 2.0)}>−0,804 + 23,20 + 4 − 10,39 − 10 − 6 = 0,00 ✓ (F₂ benne van, a csuklóerők nem)</Pipa>
        </g>
      )}
      {fazis === "ered" && (
        <g opacity={eredU}>
          <FeliratA x={300} y={346} szin={SZ.zold} meret={12.5}>Eredményvázlat: 8 új szám — a csuklóerők különbsége a csuklón ható 10 kN</FeliratA>
        </g>
      )}
    </svg>
  );
}

export default function FilmGyf4() {
  return (
    <FeladatFilm
      cim="GYF‑4 · Terhelt csukló — a csukló mint külön test"
      hossz={32}
      fejezetek={FEJEZETEK}
      rajz={Rajz}
      megjegyzes="A kék nyilak a csuklóerők: a II. testre 2 kN felfelé, az I. testre 12 kN lefelé — a különbség a csuklón ható teher. A csuklóra a testekről érkező erők ellentettjei hatnak."
    />
  );
}
