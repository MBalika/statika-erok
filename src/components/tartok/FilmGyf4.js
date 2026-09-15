"use client";

import FeladatFilm from "@/components/anim/FeladatFilm";
import { arany } from "@/components/anim/Idovonal";
import { VonalA, FeliratA, IvA } from "@/components/anim/FilmElemek";
import { TartoHegyek, Tarto, Befogas, MegoszloTeher, Meret, MeretFugg, TamaszCimke } from "@/components/tartok/TartoElemek";
import { SZ, FilmHegyek, EroA, Kar, Fokusz, Pipa, Kijelentes, Ind } from "./FilmGyf1";

/*
 * GYF‑4 · Tört tengelyű befogott tartó (H04/2) — film.
 * a = 2 m; L alak: függőleges szár (0,−a)…(0,0), vízszintes szár (0,0)…(2a,0), befogás B a (2a,0)-ban.
 * F = 5 kN → a szár alsó végén; háromszögteher 0…a között felfelé, 0 → p = 4 kN/m.
 * Eredmény: B_x = −5 kN (balra), B_y = −4 kN (lefelé), M_B = +0,6667 kNm ↶.
 */

const OX = 150;
const Y0 = 110;
const L = 140;
const XA = OX + L;
const XB = OX + 2 * L;
const YF = Y0 + L;
const XR = OX + (2 * L) / 3; // az eredő helye: 2a/3

const T = { elk: 0, kij: 4.5, fx: 8.5, fy: 12, mb: 15.5, ell: 20, ered: 24 };

const FEJEZETEK = [
  {
    t0: T.elk,
    cim: "A feladat és az elkülönítés",
    szoveg: "L alakú tartó, jobb végén befogva. A befogás helyére B_x (jobbra), B_y (felfelé) és M_B (óramutatóval ellentétesen) kerül. A háromszögteher felfelé mutat: a sarokban nulla, a-nál p.",
    kepletek: ["a = 2\\ \\text{m},\\ F = 5\\ \\text{kN},\\ p = 4\\ \\text{kN/m}"],
  },
  {
    t0: T.kij,
    cim: "Egyensúlyi kijelentés — a háromszög eredője",
    szoveg: "A megoszló terhet előbb az eredőjével helyettesítjük: R = ½·p·a = 4 kN felfelé, a magasabb oldal felé tolva, a saroktól 2a/3 = 1,333 m-re.",
    kepletek: ["(\\underline{F}, \\underline{p}, \\underline{B}_x, \\underline{B}_y, M_B) \\ekv \\underline{O}", "R = \\tfrac12\\cdot 4\\cdot 2 = 4\\ \\text{kN},\\quad x_R = \\tfrac23\\cdot 2 = 1{,}333\\ \\text{m}"],
  },
  {
    t0: T.fx,
    cim: "Vízszintes vetület → B_x",
    szoveg: "Csak F és B_x vízszintes. B_x negatív: valójában balra mutat.",
    kepletek: ["\\Fx 5 + B_x = 0\\ \\Rightarrow\\ B_x = -5{,}000\\ \\text{kN}"],
  },
  {
    t0: T.fy,
    cim: "Függőleges vetület → B_y",
    szoveg: "Csak R és B_y függőleges. B_y negatív: a felfelé nyomó teher ellen a falnak lefelé kell húznia.",
    kepletek: ["\\Fy 4 + B_y = 0\\ \\Rightarrow\\ B_y = -4{,}000\\ \\text{kN}"],
  },
  {
    t0: T.mb,
    cim: "Nyomaték a B befogásra → M_B",
    szoveg: "B-re nézve B_x és B_y karja nulla. F karja a függőleges távolság, 2 m (a pont alatt jobbra: óramutatóval ellentétes, pozitív); R karja a vízszintes távolság, 2,667 m (a ponttól balra felfelé: negatív).",
    kepletek: ["\\Mp{B} M_B + 5\\cdot 2 - 4\\cdot 2{,}667 = 0\\ \\Rightarrow\\ M_B = 0{,}6667\\ \\text{kNm}"],
  },
  {
    t0: T.ell,
    cim: "Ellenőrzés: nyomaték a sarokpontra (O)",
    szoveg: "A sarokra nézve F karja 2 m, R karja 1,333 m, B_y karja 4 m; B_x a tengelyben hat; M_B pontra nem érzékeny.",
    kepletek: ["\\Mp{O} 5\\cdot 2 + 4\\cdot 1{,}333 - 4\\cdot 4 + 0{,}6667 = 0{,}000\\ \\checkmark"],
  },
  {
    t0: T.ered,
    cim: "Eredményvázlat",
    szoveg: "B_x és B_y nyila átfordul. A reakcióerő a terhek eredőjének ellentettje (5 balra, 4 le), a kis M_B a megmaradó erőpárt egyenlíti ki.",
    kepletek: ["B_x = 5{,}000\\ \\text{kN}\\ (\\leftarrow),\\quad B_y = 4{,}000\\ \\text{kN}\\ (\\downarrow),\\quad M_B = 0{,}6667\\ \\text{kNm}\\ (\\curvearrowleft)"],
  },
];

function Rajz(t) {
  const terhU = arany(t, 0.2, 1.2);
  const tamaszHalv = arany(t, 1.6, 2.6);
  const reakU = arany(t, 2.4, 3.8);
  const kijU = arany(t, T.kij + 0.2, T.kij + 0.9);
  const eredoU = arany(t, T.kij + 1.2, T.kij + 2.2);
  const fxU = arany(t, T.fx + 0.2, T.fx + 0.8);
  const fyU = arany(t, T.fy + 0.2, T.fy + 0.8);
  const mbU = arany(t, T.mb + 0.2, T.mb + 0.8);
  const mbKar = arany(t, T.mb + 0.8, T.mb + 2.4);
  const ellU = arany(t, T.ell + 0.2, T.ell + 0.8);
  const ellKar = arany(t, T.ell + 0.8, T.ell + 2.6);
  const fordulU = arany(t, T.ered + 0.6, T.ered + 1.8);
  const szamU = arany(t, T.ered + 1.6, T.ered + 2.4);

  const fazis = t < T.fx ? "elk" : t < T.fy ? "fx" : t < T.mb ? "fy" : t < T.ell ? "mb" : t < T.ered ? "ell" : "ered";
  const el = {
    fx: { F: 1, Bx: 1 },
    fy: { R: 1, By: 1 },
    mb: { F: 1, R: 1, MB: 1 },
    ell: { F: 1, R: 1, By: 1, MB: 1 },
  }[fazis];
  const op = (nev) => (el ? (el[nev] ?? 0.18) : 1);

  return (
    <svg viewBox="0 0 600 340" className="abra w-full select-none">
      <TartoHegyek />
      <FilmHegyek />
      <Kijelentes x={330} opacitas={kijU * (fazis === "elk" ? 1 : 0.35)}>(F, p, Bₓ, Bᵧ, <Ind alap="M" index="B" utana=") ≐ O" /></Kijelentes>

      <Befogas x={XB} y={Y0} irany="jobb" hossz={56} opacitas={1 - 0.88 * tamaszHalv} />
      <MegoszloTeher x1={OX} x2={XA} y={Y0} p1={0} p2={-4} leptek={9} cimke2="p = 4 kN/m" opacitas={terhU * (1 - 0.8 * eredoU)} />
      <Tarto x1={OX} y1={YF} x2={OX} y2={Y0} />
      <Tarto x1={OX} y1={Y0} x2={XB} y2={Y0} />
      <TamaszCimke x={XB + 18} y={Y0 + 22}>B</TamaszCimke>
      <TamaszCimke x={OX - 14} y={Y0 - 10}>O</TamaszCimke>
      <Meret x1={OX} x2={XA} y={YF + 30} cimke="2 m" opacitas={0.8} />
      <Meret x1={XA} x2={XB} y={YF + 30} cimke="2 m" opacitas={0.8} />
      <MeretFugg x={XB + 70} y1={Y0} y2={YF} cimke="2 m" opacitas={0.8} />

      {/* terhek */}
      <EroA x={OX} y={YF} hossz={64} szog={0} u={terhU} opacitas={op("F")} szin={SZ.nar} hegy="fg-nar" cimke="F = 5 kN" dx={4} dy={-10} />
      <EroA x={XR} y={Y0} hossz={56} szog={90} u={eredoU} opacitas={op("R")} szin={SZ.nar} hegy="fg-nar" cimke="R = 4 kN" dx={8} dy={4} />

      {/* reakciók a befogásban (felvett irányok) */}
      <EroA x={XB + 46} y={Y0} hossz={46} szog={0} u={reakU} opacitas={op("Bx") * (1 - fordulU)} cimke="Bₓ" dx={4} dy={-8} cimkeHegy />
      <EroA x={XB} y={Y0} hossz={60} szog={90} u={reakU} opacitas={op("By") * (1 - fordulU)} cimke="Bᵧ" dx={8} dy={4} />
      <g opacity={reakU * op("MB")}>
        <IvA cx={XB} cy={Y0} r={30} kezdoFok={-100} vegFok={160} u={reakU} szin="#7c3aed" vastag={2.6} hegy="fg-lila" />
        <FeliratA x={XB - 8} y={Y0 - 40} szin={SZ.lila} meret={12} horgony="end" opacitas={reakU}>
          <Ind alap="M" index="B" utana={szamU > 0.5 ? " = 0,6667 kNm" : ""} />
        </FeliratA>
      </g>
      {/* átfordult nyilak */}
      <EroA x={XB} y={Y0} hossz={46} szog={180} u={fordulU} cimke={szamU > 0.5 ? "Bₓ = 5,000 kN" : "Bₓ"} dx={4} dy={-8} />
      <EroA x={XB} y={Y0 + 60} hossz={60} szog={-90} u={fordulU} cimke={szamU > 0.5 ? "Bᵧ = 4,000 kN" : "Bᵧ"} dx={8} dy={42} />

      {fazis === "fx" && (
        <g opacity={fxU}>
          <FeliratA x={330} y={YF + 62} szin={SZ.szurke} meret={11.5} vastag={false}>vízszintes vetület: csak F és Bₓ</FeliratA>
          <Pipa x={330} y={YF + 82} opacitas={arany(t, T.fx + 1.4, T.fx + 2.0)}>Bₓ = −5,000 kN → balra</Pipa>
        </g>
      )}
      {fazis === "fy" && (
        <g opacity={fyU}>
          <FeliratA x={330} y={YF + 62} szin={SZ.szurke} meret={11.5} vastag={false}>függőleges vetület: csak R és Bᵧ</FeliratA>
          <Pipa x={330} y={YF + 82} opacitas={arany(t, T.fy + 1.4, T.fy + 2.0)}>Bᵧ = −4,000 kN → lefelé</Pipa>
        </g>
      )}
      {fazis === "mb" && (
        <g opacity={mbU}>
          <Fokusz x={XB} y={Y0} t={t} cimke="B" dx={12} dy={-14} />
          <Kar x1={XB - 20} y1={Y0} x2={XB - 20} y2={YF} u={arany(mbKar, 0, 0.5)} cimke="2 m" dx={-22} dy={4} />
          <VonalA x1={XB - 26} y1={YF} x2={OX + 60} y2={YF} szin="#94a3b8" u={arany(mbKar, 0.1, 0.5)} />
          <Kar x1={XB} y1={Y0 - 20} x2={XR} y2={Y0 - 20} u={arany(mbKar, 0.5, 1)} cimke="2,667 m" dy={-5} />
          <Pipa x={330} y={YF + 82} opacitas={arany(t, T.mb + 2.6, T.mb + 3.2)}><Ind alap="M" index="B" utana=" + 10 − 10,67 = 0 → " /><Ind alap="M" index="B" utana=" = 0,6667 kNm" /></Pipa>
        </g>
      )}
      {fazis === "ell" && (
        <g opacity={ellU}>
          <Fokusz x={OX} y={Y0} t={t} szin={SZ.zold} cimke="O" dx={-26} dy={-12} />
          <Kar x1={OX - 20} y1={Y0} x2={OX - 20} y2={YF} u={arany(ellKar, 0, 0.35)} cimke="2 m" dx={-22} dy={4} szin={SZ.zold} />
          <Kar x1={OX} y1={Y0 - 20} x2={XR} y2={Y0 - 20} u={arany(ellKar, 0.3, 0.65)} cimke="1,333 m" dy={-5} szin={SZ.zold} />
          <Kar x1={OX} y1={Y0 - 34} x2={XB} y2={Y0 - 34} u={arany(ellKar, 0.6, 1)} cimke="4 m" dy={-5} dx={40} szin={SZ.zold} />
          <Pipa x={330} y={YF + 82} opacitas={arany(t, T.ell + 2.8, T.ell + 3.4)}>10 + 5,333 − 16 + 0,6667 = 0,000 ✓</Pipa>
        </g>
      )}
      {fazis === "ered" && (
        <FeliratA x={330} y={YF + 82} szin={SZ.zold} meret={12.5} opacitas={arany(t, T.ered + 0.2, T.ered + 0.8)}>
          Eredményvázlat: 5 jobbra – 5 balra, 4 fel – 4 le, és egy kis nyomaték
        </FeliratA>
      )}
    </svg>
  );
}

export default function FilmGyf4() {
  return (
    <FeladatFilm
      cim="GYF‑4 · Tört tengelyű befogott tartó — eredő, majd három reakció"
      hossz={28}
      fejezetek={FEJEZETEK}
      rajz={Rajz}
      megjegyzes="Tört tengelynél a vízszintes erő karja a függőleges távolság, a függőlegesé a vízszintes. A felfelé mutató terhet alulról, a tartóra mutató nyilakkal rajzoltuk — az irány ugyanaz."
    />
  );
}
