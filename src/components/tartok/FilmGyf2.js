"use client";

import FeladatFilm from "@/components/anim/FeladatFilm";
import { arany } from "@/components/anim/Idovonal";
import { VonalA, FeliratA } from "@/components/anim/FilmElemek";
import { TartoHegyek, Tarto, Csuklo, Gorgo, Meret, TamaszCimke } from "@/components/tartok/TartoElemek";
import { SZ, FilmHegyek, EroA, Kar, Fokusz, Pipa, Kijelentes } from "./FilmGyf1";

/*
 * GYF‑2 · Konzolos kéttámaszú tartó (H03/4) — film.
 * a = 1,5 m; csukló A az x = a-nál, görgő B az x = 3a-nál; F₁ = 12 kN (30°, balra-le) a bal végen, F₂ = 8 kN ↓ a jobb végen.
 * Eredmény: B = 9 kN ↑, A_y = 5 kN ↑, A_x = 10,39 kN →.
 */

const OX = 110;
const Y = 170;
const L = 115;
const X0 = OX;
const XA = OX + L;
const XB = OX + 3 * L;
const X4 = OX + 4 * L;

const T = { elk: 0, kij: 4.5, ma: 8, mb: 12.5, fx: 17, ell: 20.5, ered: 24 };

const FEJEZETEK = [
  {
    t0: T.elk,
    cim: "A feladat és az elkülönítés",
    szoveg: "Mindkét vég túlnyúlik a támaszokon. A csukló helyére A_x (jobbra) és A_y (felfelé), a görgő helyére a gördülési síkra merőleges, függőleges B (felfelé) kerül. Az F₁ a rajz szerint balra-lefelé mutat.",
    kepletek: ["a = 1{,}5\\ \\text{m},\\ F_1 = 12\\ \\text{kN},\\ \\alpha_1 = 30^\\circ,\\ F_2 = 8\\ \\text{kN}"],
  },
  {
    t0: T.kij,
    cim: "Egyensúlyi kijelentés",
    szoveg: "A terhek és a reakciók együtt egyensúlyi erőrendszer. F₁ komponensei: 10,39 kN balra, 6,000 kN lefelé.",
    kepletek: ["(\\underline{F}_1, \\underline{F}_2, \\underline{A}_x, \\underline{A}_y, \\underline{B}) \\ekv \\underline{O}", "F_1\\cos 30^\\circ = 10{,}39,\\quad F_1\\sin 30^\\circ = 6{,}000\\ \\text{kN}"],
  },
  {
    t0: T.ma,
    cim: "Nyomaték a csuklóra (A) → B",
    szoveg: "A-n átmegy A_x és A_y hatásvonala, csak B marad. F₁ függőleges komponense A-tól balra hat lefelé — az óramutatóval ellentétesen forgat (pozitív). A vízszintes komponens a tengelyben hat, karja nulla.",
    kepletek: ["\\Mp{A} 6{,}000\\cdot 1{,}5 + B\\cdot 3 - 8\\cdot 4{,}5 = 0\\ \\Rightarrow\\ B = 9{,}000\\ \\text{kN}"],
  },
  {
    t0: T.mb,
    cim: "Nyomaték a görgőre (B) → A_y",
    szoveg: "B-re nézve a görgőerő és A_x karja nulla, csak A_y marad — a már kiszámolt B-t nem használjuk, így egy esetleges hiba nem görög tovább.",
    kepletek: ["\\Mp{B} 6{,}000\\cdot 4{,}5 - A_y\\cdot 3 - 8\\cdot 1{,}5 = 0\\ \\Rightarrow\\ A_y = 5{,}000\\ \\text{kN}"],
  },
  {
    t0: T.fx,
    cim: "Vízszintes vetület → A_x",
    szoveg: "Az egyetlen vízszintes reakció A_x; vele szemben F₁ vízszintes komponense áll.",
    kepletek: ["\\Fx -10{,}39 + A_x = 0\\ \\Rightarrow\\ A_x = 10{,}39\\ \\text{kN}"],
  },
  {
    t0: T.ell,
    cim: "Ellenőrzés: függőleges vetület",
    szoveg: "A függőleges vetületi egyenletet nem használtuk — most minden tag ismert, csak nullának kell lennie.",
    kepletek: ["\\Fy -6{,}000 + 5{,}000 + 9{,}000 - 8 = 0{,}000\\ \\checkmark"],
  },
  {
    t0: T.ered,
    cim: "Eredményvázlat",
    szoveg: "Mindhárom reakció pozitív, a felvett irányok jók. A két támasz együtt 14 kN-t tart: a két teher függőleges összegét.",
    kepletek: ["A_x = 10{,}39\\ \\text{kN}\\ (\\rightarrow),\\quad A_y = 5{,}000\\ \\text{kN}\\ (\\uparrow),\\quad B = 9{,}000\\ \\text{kN}\\ (\\uparrow)"],
  },
];

function Rajz(t) {
  const terhU = arany(t, 0.2, 1.2);
  const tamaszHalv = arany(t, 1.6, 2.6);
  const reakU = arany(t, 2.4, 3.8);
  const kijU = arany(t, T.kij + 0.2, T.kij + 0.9);
  const kompU = arany(t, T.kij + 1.4, T.kij + 2.4);
  const maU = arany(t, T.ma + 0.2, T.ma + 0.8);
  const maKar = arany(t, T.ma + 0.8, T.ma + 2.6);
  const mbU = arany(t, T.mb + 0.2, T.mb + 0.8);
  const mbKar = arany(t, T.mb + 0.8, T.mb + 2.6);
  const fxU = arany(t, T.fx + 0.2, T.fx + 0.8);
  const ellU = arany(t, T.ell + 0.2, T.ell + 0.8);
  const szamU = arany(t, T.ered + 0.4, T.ered + 1.4);

  const fazis = t < T.ma ? "elk" : t < T.mb ? "ma" : t < T.fx ? "mb" : t < T.ell ? "fx" : t < T.ered ? "ell" : "ered";
  const el = {
    ma: { B: 1, F1y: 1, F2: 1 },
    mb: { Ay: 1, F1y: 1, F2: 1 },
    fx: { Ax: 1, F1x: 1 },
    ell: { Ay: 1, B: 1, F1y: 1, F2: 1 },
  }[fazis];
  const op = (nev) => (el ? (el[nev] ? 1 : 0.18) : 1);
  const kompLat = fazis === "elk" ? kompU : 1;
  const f1Egesz = fazis === "elk" ? 1 - 0.75 * kompU : 0.25;

  return (
    <svg viewBox="0 0 600 340" className="abra w-full select-none">
      <TartoHegyek />
      <FilmHegyek />
      <Kijelentes opacitas={kijU * (fazis === "elk" ? 1 : 0.35)}>(F₁, F₂, Aₓ, Aᵧ, B) ≐ O</Kijelentes>

      <Tarto x1={X0} y1={Y} x2={X4} y2={Y} />
      <Csuklo x={XA} y={Y} opacitas={1 - 0.88 * tamaszHalv} />
      <Gorgo x={XB} y={Y} opacitas={1 - 0.88 * tamaszHalv} />
      <TamaszCimke x={XA + 14} y={Y + 18}>A</TamaszCimke>
      <TamaszCimke x={XB + 16} y={Y + 18}>B</TamaszCimke>
      <Meret x1={X0} x2={XA} y={Y + 96} cimke="1,5 m" opacitas={0.8} />
      <Meret x1={XA} x2={XB} y={Y + 96} cimke="3 m" opacitas={0.8} />
      <Meret x1={XB} x2={X4} y={Y + 96} cimke="1,5 m" opacitas={0.8} />

      {/* terhek */}
      <EroA x={X0} y={Y} hossz={66} szog={-150} u={terhU} opacitas={f1Egesz} szin={SZ.nar} hegy="fg-nar" cimke="F₁ = 12 kN" dx={-6} dy={-14} horgony="middle" />
      <EroA x={X0} y={Y - 10} hossz={52} szog={180} u={kompLat} opacitas={op("F1x")} szin={SZ.nar} hegy="fg-nar" vastag={2.4} cimke="10,39" dx={4} dy={-6} />
      <EroA x={X0} y={Y} hossz={48} szog={-90} u={kompLat} opacitas={op("F1y")} szin={SZ.nar} hegy="fg-nar" vastag={2.4} cimke="6,000 kN" dx={-6} dy={6} horgony="end" />
      <EroA x={X4} y={Y} hossz={64} szog={-90} u={terhU} opacitas={op("F2")} szin={SZ.nar} hegy="fg-nar" cimke="F₂ = 8 kN" dx={8} dy={-2} />

      {/* reakciók */}
      <EroA x={XA} y={Y} hossz={46} szog={0} u={reakU} opacitas={op("Ax")} cimke={szamU > 0.5 ? "Aₓ = 10,39 kN" : "Aₓ"} dx={-2} dy={18} horgony="end" />
      <EroA x={XA} y={Y} hossz={60} szog={90} u={reakU} opacitas={op("Ay")} cimke={szamU > 0.5 ? "Aᵧ = 5,000 kN" : "Aᵧ"} dx={8} dy={4} />
      <EroA x={XB} y={Y} hossz={64} szog={90} u={reakU} opacitas={op("B")} cimke={szamU > 0.5 ? "B = 9,000 kN" : "B"} dx={8} dy={4} />

      {fazis === "ma" && (
        <g opacity={maU}>
          <Fokusz x={XA} y={Y} t={t} cimke="A" dx={-30} dy={-12} />
          <Kar x1={XA} y1={Y - 22} x2={X0} y2={Y - 22} u={arany(maKar, 0, 0.35)} cimke="1,5 m" dy={-5} />
          <Kar x1={XA} y1={Y + 28} x2={XB} y2={Y + 28} u={arany(maKar, 0.3, 0.65)} cimke="3 m" dy={-5} />
          <Kar x1={XA} y1={Y + 44} x2={X4} y2={Y + 44} u={arany(maKar, 0.6, 1)} cimke="4,5 m" dy={-5} />
          <Pipa x={300} y={Y - 100} opacitas={arany(t, T.ma + 2.8, T.ma + 3.4)}>9 + 3B − 36 = 0 → B = 9,000 kN</Pipa>
        </g>
      )}
      {fazis === "mb" && (
        <g opacity={mbU}>
          <Fokusz x={XB} y={Y} t={t} cimke="B" dx={14} dy={-12} />
          <Kar x1={XB} y1={Y - 22} x2={X0} y2={Y - 22} u={arany(mbKar, 0, 0.4)} cimke="4,5 m" dy={-5} />
          <Kar x1={XB} y1={Y + 28} x2={XA} y2={Y + 28} u={arany(mbKar, 0.35, 0.7)} cimke="3 m" dy={-5} />
          <Kar x1={XB} y1={Y + 44} x2={X4} y2={Y + 44} u={arany(mbKar, 0.65, 1)} cimke="1,5 m" dy={-5} />
          <Pipa x={300} y={Y - 100} opacitas={arany(t, T.mb + 2.8, T.mb + 3.4)}>27 − 3Aᵧ − 12 = 0 → Aᵧ = 5,000 kN</Pipa>
        </g>
      )}
      {fazis === "fx" && (
        <g opacity={fxU}>
          <VonalA x1={30} y1={Y + 22} x2={570} y2={Y + 22} szin="#94a3b8" vastag={1} />
          <FeliratA x={300} y={Y + 40} szin={SZ.szurke} meret={11.5} vastag={false}>vízszintes vetület: csak Aₓ és a 10,39 kN</FeliratA>
          <Pipa x={300} y={Y - 100} opacitas={arany(t, T.fx + 1.4, T.fx + 2.0)}>Aₓ = 10,39 kN → a felvett irány jó</Pipa>
        </g>
      )}
      {fazis === "ell" && (
        <g opacity={ellU}>
          <FeliratA x={300} y={Y + 40} szin={SZ.szurke} meret={11.5} vastag={false}>függőleges vetület: −6 + 5 + 9 − 8</FeliratA>
          <Pipa x={300} y={Y - 100} opacitas={arany(t, T.ell + 1.4, T.ell + 2.0)}>ΣFᵢᵧ = 0,000 ✓</Pipa>
        </g>
      )}
      {fazis === "ered" && (
        <FeliratA x={300} y={Y - 100} szin={SZ.zold} meret={12.5} opacitas={arany(t, T.ered + 0.2, T.ered + 0.8)}>
          Eredményvázlat: 5 + 9 = 14 kN felfelé, 6 + 8 = 14 kN lefelé
        </FeliratA>
      )}
    </svg>
  );
}

export default function FilmGyf2() {
  return (
    <FeladatFilm
      cim="GYF‑2 · Konzolos kéttámaszú tartó — nyomaték a csuklóra, nyomaték a görgőre"
      hossz={27.5}
      fejezetek={FEJEZETEK}
      rajz={Rajz}
      megjegyzes="A két nyomatéki egyenlet egymástól független: egyik sem használja a másik eredményét. A függőleges vetületi egyenlet érintetlen maradt — ez az ellenőrzés."
    />
  );
}
