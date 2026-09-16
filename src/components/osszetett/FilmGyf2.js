"use client";

import FeladatFilm from "@/components/anim/FeladatFilm";
import { arany } from "@/components/anim/Idovonal";
import { FeliratA, VonalA } from "@/components/anim/FilmElemek";
import { TartoHegyek, Tarto, Csuklo, BelsoCsuklo, Meret, MeretFugg, TamaszCimke } from "@/components/tartok/TartoElemek";
import { EroA, Kar, Fokusz, Pipa, Kijelentes, FilmHegyek, SZ } from "@/components/tartok/FilmGyf1";

/*
 * GYF‑2 · Háromcsuklós keret (H05/2) — film.
 * A(0,0), E(0,6), C(6,6), G(12,4), B(12,0); p = 4 kN/m → az AE oszlopon (R = 24 kN, y = 3), F = 12 kN ↓ a (9;5) pontban.
 * Eredmény: B_y = 15; A_y = −3; B_x = −9; A_x = −15; C (a II. testre) = (9; −3).
 */

const OX = 96;
const OY = 286;
const L = 27;
const kx = (x) => OX + x * L;
const ky = (y) => OY - y * L;
const KEK = "#0369a1";

const T = { elk: 0, kij: 5, by: 9, ay: 13, bx: 17, vet: 21, ell: 25, ered: 29 };

const FEJEZETEK = [
  {
    t0: T.elk,
    cim: "A feladat és az elkülönítés",
    szoveg: "Háromcsuklós keret: két külső csukló (A, B) és a C belső csukló. A bal oszlopot vízszintes p teher nyomja jobbra — eredője R = 24 kN a fél magasságban —, a ferde gerendaszakaszt F = 12 kN. Elkülönítés: a csuklók helyére erőpárok.",
    kepletek: ["R = p\\cdot 3a = 4\\cdot 6 = 24\\ \\text{kN}\\ (y = 3\\ \\text{m}),\\quad F = 12\\ \\text{kN}\\ \\text{a } (9;\\ 5) \\text{ pontban}"],
  },
  {
    t0: T.kij,
    cim: "Egyensúlyi kijelentések: mindenhol négy ismeretlen",
    szoveg: "Testenként 4 ismeretlen, 3 egyenlet: egyik testtel sem lehet kezdeni. Az egész szerkezetre írt nyomatéki egyenletekben viszont a két külső csukló komponensei kiesnek — mert azonos magasságban vannak.",
    kepletek: ["\\text{I: } (\\underline R, \\underline A_x, \\underline A_y, \\underline C') \\ekv \\underline O,\\quad \\text{II: } (\\underline F, \\underline B_x, \\underline B_y, \\underline C) \\ekv \\underline O", "\\Sigma: (\\underline R, \\underline F, \\underline A_x, \\underline A_y, \\underline B_x, \\underline B_y) \\ekv \\underline O"],
  },
  {
    t0: T.by,
    cim: "Egész: nyomaték A-ra → B_y",
    szoveg: "A-n átmegy A_x, A_y és — azonos magasság miatt — B_x hatásvonala is. R 3 m-rel az A fölött jobbra hat: óramutató szerint forgat (negatív); F karja 9 m.",
    kepletek: ["\\Sigma: \\Mp{A}\\ -24\\cdot 3 - 12\\cdot 9 + B_y\\cdot 12 = 0\\ \\Rightarrow\\ B_y = 15{,}00\\ \\text{kN}"],
  },
  {
    t0: T.ay,
    cim: "Egész: nyomaték B-re → A_y",
    szoveg: "B-re F 3 m-re balra lefelé: pozitív; R ugyanúgy negatív; A_y karja 12 m. Negatív eredmény: A_y lefelé mutat — a vízszintes teher fel akarja billenteni a keretet.",
    kepletek: ["\\Sigma: \\Mp{B}\\ -24\\cdot 3 + 12\\cdot 3 - A_y\\cdot 12 = 0\\ \\Rightarrow\\ A_y = -3{,}000\\ \\text{kN}"],
  },
  {
    t0: T.bx,
    cim: "II. test: nyomaték C-re → B_x",
    szoveg: "A II. testre F, B és a csuklóerő hat; C-re a csuklóerő kiesik. B a C-hez képest (6; −6): B_y karja 6 m (pozitív), B_x 6 m-rel a pont alatt jobbra (pozitív); F 3 m-re jobbra lefelé (negatív).",
    kepletek: ["\\text{II: } \\Mp{C}\\ 15\\cdot 6 + B_x\\cdot 6 - 12\\cdot 3 = 0\\ \\Rightarrow\\ B_x = -9{,}000\\ \\text{kN}"],
  },
  {
    t0: T.vet,
    cim: "Vetületi egyenletek → A_x, C_x, C_y",
    szoveg: "Az egészre a vízszintes vetület adja A_x-et; a II. testre a két vetület a csuklóerőt.",
    kepletek: ["\\Sigma: \\Fx\\ 24 + A_x + B_x = 0 \\Rightarrow A_x = -15{,}00", "\\text{II: } \\Fx\\ C_x + B_x = 0 \\Rightarrow C_x = 9{,}000;\\quad \\Fy\\ C_y + 15 - 12 = 0 \\Rightarrow C_y = -3{,}000\\ \\text{kN}"],
  },
  {
    t0: T.ell,
    cim: "Ellenőrzés: nyomaték C-re az I. testre",
    szoveg: "Nem használt egyenlet, csupa ismert taggal. A a C-hez képest (−6; −6), R pedig (−6; −3).",
    kepletek: ["\\text{I: } \\Mp{C}\\ (-6)(-3) - (-6)(-15) - (-3)(24) = 18 - 90 + 72 = 0\\ \\checkmark"],
  },
  {
    t0: T.ered,
    cim: "Eredményvázlat",
    szoveg: "A_x és B_x balra, A_y lefelé: a nyilak átfordulnak. A két csukló együtt tartja vissza a 24 kN oldalnyomást (15 + 9); a csuklóerő 9 kN vízszintes és 3 kN függőleges.",
    kepletek: ["A_x = 15\\ (\\leftarrow),\\ A_y = 3\\ (\\downarrow),\\ B_x = 9\\ (\\leftarrow),\\ B_y = 15\\ (\\uparrow),\\ C_x = 9,\\ C_y = 3\\ \\text{kN}"],
  },
];

function Rajz(t) {
  const terhU = arany(t, 0.2, 1.0);
  const eredoU = arany(t, 1.0, 1.8); // a megoszló teher eredője
  const szetU = arany(t, 1.8, 3.0);
  const tamaszHalv = 1 - 0.85 * arany(t, 2.0, 3.0);
  const reakU = arany(t, 2.8, 4.0);
  const kijU = arany(t, T.kij + 0.2, T.kij + 0.9);
  const eredU = arany(t, T.ered + 0.2, T.ered + 1.0);
  const fordulU = arany(t, T.ered + 1.0, T.ered + 2.0);
  const szamU = t > T.vet + 2.5 ? 1 : 0;

  const fazis = t < T.kij ? "elk" : t < T.by ? "kij" : t < T.ay ? "by" : t < T.bx ? "ay" : t < T.vet ? "bx" : t < T.ell ? "vet" : t < T.ered ? "ell" : "ered";
  const el = {
    by: { R: 1, F: 1, By: 1 },
    ay: { R: 1, F: 1, Ay: 1 },
    bx: { F: 1, By: 1, Bx: 1 },
    vet: { R: 1, F: 1, Ax: 1, Bx: 1, By: 1, Cx: 1, Cy: 1 },
    ell: { R: 1, Ax: 1, Ay: 1, Cxi: 1, Cyi: 1 },
  }[fazis];
  const op = (nev) => (el ? (el[nev] ? 1 : 0.18) : 1);
  const testOp = (test) => (fazis === "bx" ? (test === 2 ? 1 : 0.35) : fazis === "ell" ? (test === 1 ? 1 : 0.35) : 1);
  const dI = [-14 * szetU, 0];
  const dII = [14 * szetU, 0];

  // p nyilak
  const pNyilak = [];
  for (let i = 0; i <= 6; i++) pNyilak.push(<line key={i} x1={kx(0) - 26} y1={ky(i)} x2={kx(0) - 4} y2={ky(i)} stroke={SZ.nar} strokeWidth="1.5" markerEnd="url(#fg-nar)" opacity={terhU * (1 - 0.7 * eredoU)} />);

  const fopont = fazis === "by" ? { x: kx(0) + dI[0], y: ky(0), nev: "A" } : fazis === "ay" ? { x: kx(12) + dII[0], y: ky(0), nev: "B" } : fazis === "bx" || fazis === "ell" ? { x: kx(6) + (fazis === "bx" ? dII[0] : dI[0]), y: ky(6), nev: "C" } : null;

  return (
    <svg viewBox="0 0 600 340" className="abra w-full select-none">
      <TartoHegyek />
      <FilmHegyek />
      <Kijelentes opacitas={kijU * (fazis === "kij" ? 1 : 0.35)} y={22}>
        Σ: (R, F, A, B) ≐ O · I: (R, A, C′) ≐ O · II: (F, B, C) ≐ O
      </Kijelentes>

      {/* I. test: A–E–C */}
      <g transform={`translate(${dI[0]} ${dI[1]})`} opacity={testOp(1)}>
        <Csuklo x={kx(0)} y={ky(0)} opacitas={tamaszHalv} />
        <Tarto x1={kx(0)} y1={ky(0)} x2={kx(0)} y2={ky(6)} />
        <Tarto x1={kx(0)} y1={ky(6)} x2={kx(6)} y2={ky(6)} />
        <TamaszCimke x={kx(0) - 18} y={ky(0) + 24}>A</TamaszCimke>
        <FeliratA x={kx(1.2)} y={ky(4.6)} szin="#334155" meret={11} opacitas={szetU}>I</FeliratA>
        <line x1={kx(0) - 26} y1={ky(0)} x2={kx(0) - 26} y2={ky(6)} stroke={SZ.nar} strokeWidth="1.3" opacity={terhU * (1 - 0.7 * eredoU)} />
        {pNyilak}
        <FeliratA x={kx(0) - 32} y={ky(4.5)} szin={SZ.nar} meret={11.5} horgony="end" opacitas={terhU * (1 - 0.7 * eredoU)}>p = 4 kN/m</FeliratA>
        <EroA x={kx(0)} y={ky(3)} hossz={60} szog={0} u={eredoU} opacitas={op("R")} szin={SZ.nar} hegy="fg-nar" cimke="R = 24 kN" dx={-4} dy={-8} horgony="end" />
        <EroA x={kx(0)} y={ky(0)} hossz={44} szog={0} u={reakU} opacitas={op("Ax") * (1 - fordulU)} cimke="Aₓ" dx={-4} dy={-10} horgony="end" />
        <EroA x={kx(0) - 2} y={ky(0) - 10} hossz={44} szog={180} u={fordulU} cimke="Aₓ = 15" dx={4} dy={-8} />
        <EroA x={kx(0)} y={ky(0) + 2} hossz={40} szog={90} u={reakU} opacitas={op("Ay") * (1 - fordulU)} cimke={szamU ? "Aᵧ = −3" : "Aᵧ"} dx={6} dy={8} />
        <EroA x={kx(0) + 8} y={ky(0) + 42} hossz={40} szog={-90} u={fordulU} cimke="Aᵧ = 3" dx={6} dy={-2} />
        {/* csuklóerő az I. testen: C′ = (−9; +3) → balra, felfelé */}
        <g opacity={op("Cxi")}>
          <EroA x={kx(6) - 34 * szetU} y={ky(6)} hossz={34 * szetU} szog={180} u={szetU} szin={KEK} hegy="fg-kek" vastag={2.4} cimke={szamU ? "C′ₓ = 9" : "C′ₓ"} dx={-2} dy={-8} horgony="end" cimkeHegy />
        </g>
        <g opacity={op("Cyi")}>
          <EroA x={kx(6)} y={ky(6) - 2 - 28 * szetU} hossz={28 * szetU} szog={90} u={szetU} szin={KEK} hegy="fg-kek" vastag={2.4} cimke={szamU ? "C′ᵧ = 3" : "C′ᵧ"} dx={-6} dy={-4} horgony="end" cimkeHegy />
        </g>
      </g>

      {/* II. test: C–G–B */}
      <g transform={`translate(${dII[0]} ${dII[1]})`} opacity={testOp(2)}>
        <Csuklo x={kx(12)} y={ky(0)} opacitas={tamaszHalv} />
        <Tarto x1={kx(6)} y1={ky(6)} x2={kx(12)} y2={ky(4)} />
        <Tarto x1={kx(12)} y1={ky(4)} x2={kx(12)} y2={ky(0)} />
        <BelsoCsuklo x={kx(6)} y={ky(6)} />
        <TamaszCimke x={kx(6)} y={ky(6) - 12}>C</TamaszCimke>
        <TamaszCimke x={kx(12) + 18} y={ky(0) + 24}>B</TamaszCimke>
        <FeliratA x={kx(11)} y={ky(2)} szin="#334155" meret={11} opacitas={szetU}>II</FeliratA>
        <EroA x={kx(9)} y={ky(5)} hossz={52} szog={-90} u={terhU} opacitas={op("F")} szin={SZ.nar} hegy="fg-nar" cimke="F = 12 kN" dx={6} dy={-2} />
        <EroA x={kx(12)} y={ky(0)} hossz={40} szog={0} u={reakU} opacitas={op("Bx") * (1 - fordulU)} cimke={szamU ? "Bₓ = −9" : "Bₓ"} dx={4} dy={-8} />
        <EroA x={kx(12) - 2} y={ky(0) - 10} hossz={36} szog={180} u={fordulU} cimke="Bₓ = 9" dx={4} dy={-8} />
        <EroA x={kx(12)} y={ky(0) + 2} hossz={52} szog={90} u={reakU} opacitas={op("By")} cimke={t > T.by + 2.5 ? "Bᵧ = 15" : "Bᵧ"} dx={6} dy={8} />
        <g opacity={op("Cx")}>
          <EroA x={kx(6) + 34 * szetU} y={ky(6)} hossz={34 * szetU} szog={0} u={szetU} szin={KEK} hegy="fg-kek" vastag={2.4} cimke={szamU ? "Cₓ = 9" : "Cₓ"} dx={4} dy={-8} />
        </g>
        <g opacity={op("Cy")}>
          <EroA x={kx(6)} y={ky(6) + 2 + 28 * szetU} hossz={28 * szetU} szog={-90} u={szetU} szin={KEK} hegy="fg-kek" vastag={2.4} cimke={szamU ? "Cᵧ = 3" : "Cᵧ"} dx={6} dy={4} cimkeHegy />
        </g>
      </g>

      <g opacity={1 - szetU}>
        <Meret x1={kx(0)} x2={kx(6)} y={ky(0) + 40} cimke="6 m" opacitas={0.8} />
        <Meret x1={kx(6)} x2={kx(9)} y={ky(0) + 40} cimke="3" opacitas={0.8} />
        <Meret x1={kx(9)} x2={kx(12)} y={ky(0) + 40} cimke="3 m" opacitas={0.8} />
        <MeretFugg x={kx(12) + 44} y1={ky(4)} y2={ky(6)} cimke="2" opacitas={0.8} />
        <MeretFugg x={kx(12) + 44} y1={ky(0)} y2={ky(4)} cimke="4 m" opacitas={0.8} />
      </g>

      {fopont && <Fokusz x={fopont.x} y={fopont.y} t={t} cimke={fopont.nev} dx={fazis === "ay" ? 12 : -26} dy={-14} />}
      {fazis === "by" && (
        <g>
          <Kar x1={kx(0) + dI[0] + 40} y1={ky(0)} x2={kx(0) + dI[0] + 40} y2={ky(3)} u={arany(t, T.by + 0.6, T.by + 1.2)} cimke="3 m" dx={22} dy={4} />
          <Kar x1={kx(0) + dI[0]} y1={ky(0) + 20} x2={kx(9) + dII[0]} y2={ky(0) + 20} u={arany(t, T.by + 1.0, T.by + 1.8)} cimke="9 m" dy={14} />
          <Kar x1={kx(0) + dI[0]} y1={ky(0) + 34} x2={kx(12) + dII[0]} y2={ky(0) + 34} u={arany(t, T.by + 1.6, T.by + 2.4)} cimke="12 m" dy={14} />
          <Pipa x={300} y={322} opacitas={arany(t, T.by + 2.4, T.by + 3.0)}>Bᵧ = (72 + 108) / 12 = 15,00 kN</Pipa>
        </g>
      )}
      {fazis === "ay" && (
        <g>
          <Kar x1={kx(9) + dII[0]} y1={ky(0) + 20} x2={kx(12) + dII[0]} y2={ky(0) + 20} u={arany(t, T.ay + 0.6, T.ay + 1.2)} cimke="3 m" dy={14} />
          <Kar x1={kx(0) + dI[0]} y1={ky(0) + 34} x2={kx(12) + dII[0]} y2={ky(0) + 34} u={arany(t, T.ay + 1.2, T.ay + 2.0)} cimke="12 m" dy={14} />
          <Pipa x={300} y={322} opacitas={arany(t, T.ay + 2.4, T.ay + 3.0)}>Aᵧ = (−72 + 36) / 12 = −3,000 kN → lefelé</Pipa>
        </g>
      )}
      {fazis === "bx" && (
        <g>
          <Kar x1={kx(6) + dII[0]} y1={ky(6) - 30} x2={kx(12) + dII[0]} y2={ky(6) - 30} u={arany(t, T.bx + 0.6, T.bx + 1.2)} cimke="6 m" dy={-6} />
          <Kar x1={kx(12) + dII[0] + 28} y1={ky(6)} x2={kx(12) + dII[0] + 28} y2={ky(0)} u={arany(t, T.bx + 1.0, T.bx + 1.6)} cimke="6 m" dx={20} dy={4} />
          <Kar x1={kx(6) + dII[0]} y1={ky(6) - 16} x2={kx(9) + dII[0]} y2={ky(6) - 16} u={arany(t, T.bx + 1.4, T.bx + 2.0)} cimke="3 m" dy={-6} />
          <Pipa x={300} y={322} opacitas={arany(t, T.bx + 2.4, T.bx + 3.0)}>Bₓ = (36 − 90) / 6 = −9,000 kN → balra</Pipa>
        </g>
      )}
      {fazis === "vet" && (
        <g opacity={arany(t, T.vet + 0.2, T.vet + 0.8)}>
          <VonalA x1={30} y1={ky(0) + 60} x2={570} y2={ky(0) + 60} szin="#94a3b8" vastag={1} />
          <FeliratA x={300} y={ky(0) + 76} szin={SZ.szurke} meret={11.5} vastag={false}>vízszintes vetület az egészre: 24 + Aₓ − 9 = 0 → Aₓ = −15</FeliratA>
          <Pipa x={300} y={322} opacitas={arany(t, T.vet + 1.6, T.vet + 2.2)}>II: Cₓ = 9,000 kN, Cᵧ = −3,000 kN (a II. testre)</Pipa>
        </g>
      )}
      {fazis === "ell" && <Pipa x={300} y={322} opacitas={arany(t, T.ell + 1.6, T.ell + 2.2)}>I: ΣM_C = 18 − 90 + 72 = 0 ✓</Pipa>}
      {fazis === "ered" && (
        <g opacity={eredU}>
          <FeliratA x={300} y={322} szin={SZ.zold} meret={12.5}>Eredményvázlat: 24 jobbra − (15 + 9) balra; 15 fel − (12 + 3) le</FeliratA>
        </g>
      )}
    </svg>
  );
}

export default function FilmGyf2() {
  return (
    <FeladatFilm
      cim="GYF‑2 · Háromcsuklós keret — az egész szerkezet segít ki"
      hossz={33}
      fejezetek={FEJEZETEK}
      rajz={Rajz}
      megjegyzes="A lila nyilak a felvett reakciók, a kékek a belső csuklóerő-pár. A végén a negatív értékek nyilai átfordulnak a tényleges irányba."
    />
  );
}
