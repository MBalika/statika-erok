"use client";

import FeladatFilm from "@/components/anim/FeladatFilm";
import { arany, lukteto } from "@/components/anim/Idovonal";
import { Hegy, NyilA, VonalA, FeliratA, IvA } from "@/components/anim/FilmElemek";
import { TartoHegyek, Tarto, Befogas, KoncentraltNyomatek, Meret, TamaszCimke } from "@/components/tartok/TartoElemek";

/*
 * GYF‑1 · Befogott konzol (H03/3) — film.
 * a = 2 m, F₁ = 10 kN (60°, jobbra-le), M = 8 kNm ↷ az x = 2a-nál, F₂ = 6 kN ↓ a szabad végen.
 * Eredmény: A_x = −5 kN (balra 5), A_y = 14,66 kN ↑, M_A = 61,32 kNm ↶.
 *
 * A fájl a többi tartós film közös segédelemeit is exportálja (EroA, Kar, Pipa, Fokusz, SZ).
 */

export const SZ = {
  lila: "var(--color-jel-eredo)",
  nar: "var(--color-jel-ero)",
  bordo: "#9f1239",
  zold: "#15803d",
  szurke: "#64748b",
  tarto: "#1d3c48",
  kek: "#2563eb",
};

/** A filmek közös nyílhegyei (a TartoHegyek mellé). */
export function FilmHegyek() {
  return (
    <defs>
      <Hegy id="fg-lila" szin="#7c3aed" />
      <Hegy id="fg-nar" szin="#e2590a" />
      <Hegy id="fg-bordo" szin={SZ.bordo} />
      <Hegy id="fg-zold" szin={SZ.zold} />
      <Hegy id="fg-kek" szin={SZ.kek} />
    </defs>
  );
}

/**
 * Erő-nyíl a filmhez: a hegye (x, y)-ban, iránya szog (matematikai fok, 0 = jobbra, 90 = fel), hossza px.
 * u: kihúzódás a farok felől; a felirat a farok mellé kerül (dx, dy eltolással), cimkeHegy = true esetén a hegy mellé.
 */
export function EroA({ x, y, hossz, szog, u = 1, opacitas = 1, szin = SZ.lila, hegy = "fg-lila", vastag = 3.4, cimke, dx = 8, dy = -6, horgony = "start", szaggatott = false, cimkeHegy = false }) {
  if (u <= 0.02 || opacitas <= 0.01) return null;
  const r = (szog * Math.PI) / 180;
  const x1 = x - hossz * Math.cos(r);
  const y1 = y + hossz * Math.sin(r);
  const cx = cimkeHegy ? x : x1;
  const cy = cimkeHegy ? y : y1;
  return (
    <g>
      <NyilA x1={x1} y1={y1} x2={x} y2={y} u={u} szin={szin} hegy={hegy} vastag={vastag} opacitas={opacitas} szaggatott={szaggatott} />
      {cimke && (
        <FeliratA x={cx + dx} y={cy + dy} szin={szin} meret={12} opacitas={opacitas * u} horgony={horgony}>
          {cimke}
        </FeliratA>
      )}
    </g>
  );
}

/** Kar: szaggatott méretvonal két pont között, felirattal a közepén (a szöveg a vonal alá/mellé, eltolással). */
export function Kar({ x1, y1, x2, y2, u = 1, opacitas = 1, cimke, dx = 0, dy = 14, szin = SZ.szurke }) {
  if (u <= 0.01 || opacitas <= 0.01) return null;
  return (
    <g opacity={opacitas}>
      <VonalA x1={x1} y1={y1} x2={x2} y2={y2} u={u} szin={szin} vastag={1.3} />
      <line x1={x1} y1={y1 - 5} x2={x1} y2={y1 + 5} stroke={szin} strokeWidth="1.2" />
      {u > 0.98 && <line x1={x2} y1={y2 - 5} x2={x2} y2={y2 + 5} stroke={szin} strokeWidth="1.2" />}
      {cimke && (
        <FeliratA x={(x1 + x2) / 2 + dx} y={(y1 + y2) / 2 + dy} szin={szin} meret={11.5} vastag={false} opacitas={u}>
          {cimke}
        </FeliratA>
      )}
    </g>
  );
}

/** Lüktető gyűrű a vonatkoztatási pont körül. */
export function Fokusz({ x, y, t, opacitas = 1, szin = SZ.bordo, cimke, dx = 12, dy = -12 }) {
  if (opacitas <= 0.01) return null;
  const l = lukteto(t, 1.2);
  return (
    <g opacity={opacitas}>
      <circle cx={x} cy={y} r={9 + 5 * l} fill="none" stroke={szin} strokeWidth="2" opacity={0.9 - 0.5 * l} />
      <circle cx={x} cy={y} r="4" fill={szin} stroke="white" strokeWidth="1.5" />
      {cimke && (
        <FeliratA x={x + dx} y={y + dy} szin={szin} meret={12} horgony="start">
          {cimke}
        </FeliratA>
      )}
    </g>
  );
}

/** Zöld pipa-felirat az ellenőrzéshez / eredményhez. */
export function Pipa({ x, y, opacitas = 1, children, szin = SZ.zold, meret = 12.5, horgony = "middle" }) {
  if (opacitas <= 0.01) return null;
  return (
    <FeliratA x={x} y={y} szin={szin} meret={meret} opacitas={opacitas} horgony={horgony}>
      {children}
    </FeliratA>
  );
}

/** Alsó indexes jel SVG-szövegben: <Ind alap="M" index="A" /> utána folytatható szöveg. */
export function Ind({ alap, index, utana }) {
  return (
    <>
      {alap}
      <tspan dy="3.5" fontSize="9">{index}</tspan>
      {utana != null && <tspan dy="-3.5">{utana}</tspan>}
    </>
  );
}

/** Kijelentés-sáv a rajz tetején. */
export function Kijelentes({ x = 300, y = 24, opacitas = 1, szeles = 300, children }) {
  if (opacitas <= 0.01) return null;
  return (
    <g opacity={opacitas}>
      <rect x={x - szeles / 2} y={y - 16} width={szeles} height={24} rx="7" fill="#f5f3ff" stroke="#c4b5fd" strokeWidth="1" />
      <FeliratA x={x} y={y + 1} szin="#5b21b6" meret={12.5}>
        {children}
      </FeliratA>
    </g>
  );
}

/* ---------------- a GYF‑1 film ---------------- */

const OX = 90;
const Y = 170;
const L = 140; // px / a
const XA = OX;
const X1 = OX + L;
const X2 = OX + 2 * L;
const XB = OX + 3 * L;

const T = { elk: 0, kij: 4.5, fx: 8, fy: 12, ma: 16, ell: 20.5, ered: 25 };

const FEJEZETEK = [
  {
    t0: T.elk,
    cim: "A feladat és az elkülönítés",
    szoveg: "Befogott konzol: ferde F₁ az x = a-nál, M nyomaték az x = 2a-nál (a rajzon az óramutató szerint forog), F₂ a szabad végen. A befogást eltávolítjuk, és a helyére a három reakciót vesszük fel: A_x jobbra, A_y felfelé, M_A pozitív (óramutatóval ellentétes) értelemben.",
    kepletek: ["a = 2\\ \\text{m},\\ F_1 = 10\\ \\text{kN},\\ \\alpha_1 = 60^\\circ,\\ M = 8\\ \\text{kNm},\\ F_2 = 6\\ \\text{kN}"],
  },
  {
    t0: T.kij,
    cim: "Egyensúlyi kijelentés",
    szoveg: "Az aktív terhek és a felvett reakciók együtt egyensúlyi erőrendszert alkotnak. Az F₁-et komponenseire bontjuk: 5,000 kN jobbra, 8,660 kN lefelé.",
    kepletek: ["(\\underline{F}_1, M, \\underline{F}_2, \\underline{A}_x, \\underline{A}_y, M_A) \\ekv \\underline{O}", "F_1\\cos 60^\\circ = 5{,}000,\\quad F_1\\sin 60^\\circ = 8{,}660\\ \\text{kN}"],
  },
  {
    t0: T.fx,
    cim: "Vízszintes vetület → A_x",
    szoveg: "A függőleges erők és a nyomatékok kiesnek. A_x negatív: a felvett irány fordított, valójában balra mutat.",
    kepletek: ["\\Fx A_x + 5{,}000 = 0\\ \\Rightarrow\\ A_x = -5{,}000\\ \\text{kN}"],
  },
  {
    t0: T.fy,
    cim: "Függőleges vetület → A_y",
    szoveg: "A vízszintes erők és a nyomatékok kiesnek; a két lefelé mutató teher összegét tartja A_y.",
    kepletek: ["\\Fy A_y - 8{,}660 - 6 = 0\\ \\Rightarrow\\ A_y = 14{,}66\\ \\text{kN}"],
  },
  {
    t0: T.ma,
    cim: "Nyomaték az A pontra → M_A",
    szoveg: "Az A-n átmegy A_x és A_y hatásvonala (és F₁ vízszintes komponenséé is): karjuk nulla. Marad M_A, a 2 m karú 8,660 kN, a 8 kNm és a 6 m karú 6 kN — mind az óramutató irányába forgat.",
    kepletek: ["\\Mp{A} M_A - 8{,}660\\cdot 2 - 8 - 6\\cdot 6 = 0\\ \\Rightarrow\\ M_A = 61{,}32\\ \\text{kNm}"],
  },
  {
    t0: T.ell,
    cim: "Ellenőrzés: nyomaték a szabad végre (B)",
    szoveg: "Egy nem használt egyenlet, csupa ismert taggal. B-re nézve A_y karja 6 m (óramutató szerint), F₁ függőleges komponensének karja 4 m (ellentétesen), F₂ átmegy a ponton.",
    kepletek: ["\\Mp{B} 61{,}32 - 14{,}66\\cdot 6 + 8{,}660\\cdot 4 - 8 = 0{,}00\\ \\checkmark"],
  },
  {
    t0: T.ered,
    cim: "Eredményvázlat",
    szoveg: "A tényleges irányokkal és pozitív nagyságokkal: A_x nyila átfordul balra. Van jobbra és balra, fel és le mutató erő, és a befogási nyomaték a terhekkel ellentétesen forog.",
    kepletek: ["A_x = 5{,}000\\ \\text{kN}\\ (\\leftarrow),\\quad A_y = 14{,}66\\ \\text{kN}\\ (\\uparrow),\\quad M_A = 61{,}32\\ \\text{kNm}\\ (\\curvearrowleft)"],
  },
];

function Rajz(t) {
  const terhU = arany(t, 0.2, 1.2);
  const tamaszHalv = arany(t, 1.6, 2.6); // a befogás elhalványul
  const reakU = arany(t, 2.4, 3.8); // a reakciók beúsznak
  const kijU = arany(t, T.kij + 0.2, T.kij + 0.9);
  const kompU = arany(t, T.kij + 1.4, T.kij + 2.4); // F₁ komponensei
  const fxU = arany(t, T.fx + 0.2, T.fx + 0.8);
  const fyU = arany(t, T.fy + 0.2, T.fy + 0.8);
  const maU = arany(t, T.ma + 0.2, T.ma + 0.8);
  const karU = arany(t, T.ma + 0.8, T.ma + 2.2);
  const ellU = arany(t, T.ell + 0.2, T.ell + 0.8);
  const ellKarU = arany(t, T.ell + 0.8, T.ell + 2.2);
  const eredU = arany(t, T.ered + 0.2, T.ered + 1.0);
  const fordulU = arany(t, T.ered + 1.0, T.ered + 2.0);
  const szamU = arany(t, T.ered + 1.8, T.ered + 2.6);

  const fazis = t < T.fx ? "elk" : t < T.fy ? "fx" : t < T.ma ? "fy" : t < T.ell ? "ma" : t < T.ered ? "ell" : "ered";
  // mely elemek élnek az adott egyenletben
  const el = {
    fx: { Ax: 1, F1x: 1 },
    fy: { Ay: 1, F1y: 1, F2: 1 },
    ma: { MA: 1, F1y: 1, M: 1, F2: 1 },
    ell: { MA: 1, Ay: 1, F1y: 1, M: 1 },
  }[fazis];
  const op = (nev) => (el ? (el[nev] ? 1 : 0.18) : 1);
  const kompLat = fazis === "elk" ? kompU : 1; // a komponensek láthatósága
  const f1Egesz = fazis === "elk" ? 1 - 0.75 * kompU : 0.25; // az eredeti F₁ halványul, ha a komponensek megjelentek

  const axHossz = 46;

  return (
    <svg viewBox="0 0 600 340" className="abra w-full select-none">
      <TartoHegyek />
      <FilmHegyek />

      <Kijelentes opacitas={kijU * (fazis === "elk" || fazis === "fx" ? 1 : 0.35)}>(F₁, M, F₂, Aₓ, Aᵧ, <Ind alap="M" index="A" utana=") ≐ O" /></Kijelentes>

      {/* a támasz elhalványul, a tartó marad */}
      <Befogas x={XA} y={Y} irany="bal" hossz={56} opacitas={1 - 0.88 * tamaszHalv} />
      <Tarto x1={XA} y1={Y} x2={XB} y2={Y} />
      <TamaszCimke x={XA - 16} y={Y + 32}>A</TamaszCimke>
      <TamaszCimke x={XB + 16} y={Y + 24}>B</TamaszCimke>
      <Meret x1={XA} x2={X1} y={Y + 100} cimke="a = 2 m" opacitas={0.8} />
      <Meret x1={X1} x2={X2} y={Y + 100} cimke="a = 2 m" opacitas={0.8} />
      <Meret x1={X2} x2={XB} y={Y + 100} cimke="a = 2 m" opacitas={0.8} />

      {/* terhek */}
      <EroA x={X1} y={Y} hossz={66} szog={-60} u={terhU} opacitas={f1Egesz} szin={SZ.nar} hegy="fg-nar" cimke="F₁ = 10 kN" dx={-2} dy={-8} horgony="end" />
      <EroA x={X1} y={Y} hossz={40} szog={0} u={kompLat} opacitas={op("F1x")} szin={SZ.nar} hegy="fg-nar" vastag={2.4} cimke="5,000" dx={-4} dy={-8} horgony="end" />
      <EroA x={X1} y={Y} hossz={60} szog={-90} u={kompLat} opacitas={op("F1y")} szin={SZ.nar} hegy="fg-nar" vastag={2.4} cimke="8,660 kN" dx={8} dy={4} />
      <KoncentraltNyomatek x={X2} y={Y} r={18} irany={-1} cimke="M = 8 kNm" opacitas={terhU * op("M")} />
      <EroA x={XB} y={Y} hossz={60} szog={-90} u={terhU} opacitas={op("F2")} szin={SZ.nar} hegy="fg-nar" cimke="F₂ = 6 kN" dx={8} dy={-2} />

      {/* reakciók a befogás helyén */}
      <EroA x={XA} y={Y} hossz={axHossz} szog={0} u={reakU} opacitas={op("Ax") * (1 - fordulU)} cimke="Aₓ" dx={-4} dy={-10} horgony="end" />
      {/* az átfordult A_x: a hegye A-nál, balra mutat (a tengely fölé rajzolva) */}
      <EroA x={XA - 2} y={Y - 9} hossz={axHossz} szog={180} u={fordulU} cimke="Aₓ = 5,000 kN" dx={6} dy={26} />
      <EroA x={XA} y={Y} hossz={64} szog={90} u={reakU} opacitas={op("Ay")} cimke={szamU > 0.5 ? "Aᵧ = 14,66 kN" : "Aᵧ"} dx={8} dy={4} />
      <g opacity={reakU * op("MA")}>
        <IvA cx={XA} cy={Y} r={30} kezdoFok={-60} vegFok={200} u={reakU} szin="#7c3aed" vastag={2.6} hegy="fg-lila" />
        <FeliratA x={XA + 8} y={Y - 40} szin={SZ.lila} meret={12} horgony="start" opacitas={reakU}>
          <Ind alap="M" index="A" utana={szamU > 0.5 ? " = 61,32 kNm" : ""} />
        </FeliratA>
      </g>

      {/* ΣFx: a vízszintes irány kiemelése */}
      {fazis === "fx" && (
        <g opacity={fxU}>
          <VonalA x1={30} y1={Y + 22} x2={570} y2={Y + 22} szin="#94a3b8" vastag={1} />
          <FeliratA x={300} y={Y + 40} szin={SZ.szurke} meret={11.5} vastag={false}>vízszintes vetület: csak Aₓ és 5,000 kN</FeliratA>
          <Pipa x={300} y={Y - 110} opacitas={arany(t, T.fx + 1.6, T.fx + 2.2)} szin={SZ.bordo}>Aₓ = −5,000 kN → a felvett irány fordított</Pipa>
        </g>
      )}
      {fazis === "fy" && (
        <g opacity={fyU}>
          <FeliratA x={300} y={Y + 40} szin={SZ.szurke} meret={11.5} vastag={false}>függőleges vetület: Aᵧ, 8,660 kN és 6 kN</FeliratA>
          <Pipa x={300} y={Y - 110} opacitas={arany(t, T.fy + 1.6, T.fy + 2.2)}>Aᵧ = 8,660 + 6 = 14,66 kN</Pipa>
        </g>
      )}

      {/* ΣM_A: a pont felvillan, a karok kirajzolódnak */}
      {fazis === "ma" && (
        <g opacity={maU}>
          <Fokusz x={XA} y={Y} t={t} cimke="A" dx={-26} dy={-14} />
          <Kar x1={XA} y1={Y + 28} x2={X1} y2={Y + 28} u={arany(karU, 0, 0.5)} cimke="2 m" dy={-5} />
          <Kar x1={XA} y1={Y + 42} x2={XB} y2={Y + 42} u={arany(karU, 0.4, 1)} cimke="6 m" dy={-5} />
          <Pipa x={300} y={Y - 110} opacitas={arany(t, T.ma + 2.4, T.ma + 3.0)}><Ind alap="M" index="A" utana=" = 17,32 + 8 + 36 = 61,32 kNm" /></Pipa>
        </g>
      )}

      {/* ellenőrzés: nyomaték B-re */}
      {fazis === "ell" && (
        <g opacity={ellU}>
          <Fokusz x={XB} y={Y} t={t} szin={SZ.zold} cimke="B" dx={12} dy={-14} />
          <Kar x1={X1} y1={Y + 28} x2={XB} y2={Y + 28} u={arany(ellKarU, 0, 0.5)} cimke="4 m" dy={-5} szin={SZ.zold} />
          <Kar x1={XA} y1={Y + 42} x2={XB} y2={Y + 42} u={arany(ellKarU, 0.4, 1)} cimke="6 m" dy={16} szin={SZ.zold} />
          <Pipa x={300} y={Y - 110} opacitas={arany(t, T.ell + 2.4, T.ell + 3.0)}>61,32 − 87,96 + 34,64 − 8 = 0,00 ✓</Pipa>
        </g>
      )}

      {fazis === "ered" && (
        <g opacity={eredU}>
          <FeliratA x={300} y={Y - 110} szin={SZ.zold} meret={12.5}>Eredményvázlat: három új szám, tényleges irányokkal</FeliratA>
        </g>
      )}
    </svg>
  );
}

export default function FilmGyf1() {
  return (
    <FeladatFilm
      cim="GYF‑1 · Befogott konzol — elkülönítés, három egyenlet, ellenőrzés"
      hossz={28.5}
      fejezetek={FEJEZETEK}
      rajz={Rajz}
      megjegyzes="A halvány elemek az adott egyenletben nem szerepelnek (a karjuk nulla vagy merőlegesek a vetítés irányára). A lila nyilak a felvett reakciók; a végén Aₓ nyila átfordul a tényleges irányba."
    />
  );
}
