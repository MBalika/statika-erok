"use client";

import FeladatFilm from "@/components/anim/FeladatFilm";
import { arany } from "@/components/anim/Idovonal";
import { NyilA, FeliratA, PontA } from "@/components/anim/FilmElemek";
import { TartoHegyek, Tarto, Csuklo, Gorgo, MeretFugg, TamaszCimke } from "@/components/tartok/TartoElemek";
import { SZ, FilmHegyek, EroA, Kar, Fokusz, Pipa, Kijelentes } from "./FilmGyf1";

/*
 * GYF‑6 · Vízzel terhelt ferde gerenda (H04/4) — film.
 * a = 2 m, α = 30°, γ = 10 kN/m³, a víztömeg rajzra merőleges mérete a/10 = 0,2 m.
 * Merült hossz a/sin α = 4 m, p_max = γ·a·0,2 = 4 kN/m, R = 8 kN a gerendára merőlegesen (jobbra-le), A-tól 1,333 m-re.
 * B a (6,928; 4) pontban, függőleges. Eredmény: B = 1,540 kN ↑, A_x = −4 kN (balra), A_y = 5,389 kN ↑.
 */

const XA = 90;
const YA = 250;
const L = 75; // px / a
const RAD = Math.PI / 180;
const CA = Math.cos(30 * RAD);
const SA = Math.sin(30 * RAD);
const TG = Math.tan(30 * RAD);
const XB = XA + (2 * L) / TG; // 317,8
const YB = YA - 2 * L; // 170
const YV = YA - L; // vízszint
const XV = XA + L / TG; // ahol a vízszint metszi a gerendát (merült hossz vége)
const DQ = ((2 * L) / TG / CA) / 6; // 1,333 m a gerenda mentén: a merült hossz (4 m = 120 px) harmada
const Q = { x: XA + DQ * CA, y: YA - DQ * SA }; // az R támadáspontja

const T = { teher: 0, elk: 5, ma: 9, fx: 13, fy: 16.5, ell: 20, ered: 24.5 };

const FEJEZETEK = [
  {
    t0: T.teher,
    cim: "A teher: víznyomás a merült szakaszon",
    szoveg: "A víz a gerenda bal-fölső oldalán áll, a nyomás a gerendára merőleges és a mélységgel arányos. A merült hossz a/sin 30° = 4 m; az A-nál p_max = γ·a·(a/10) = 4 kN/m. A háromszögteher eredője R = ½·4·4 = 8 kN, az A-tól a merült hossz harmadánál.",
    kepletek: ["p_{\\max} = 10\\cdot 2\\cdot 0{,}2 = 4\\ \\text{kN/m},\\quad R = \\tfrac12\\cdot 4\\cdot 4 = 8\\ \\text{kN},\\quad d_R = \\tfrac43 = 1{,}333\\ \\text{m}"],
  },
  {
    t0: T.elk,
    cim: "Elkülönítés és egyensúlyi kijelentés",
    szoveg: "A csukló helyére A_x (jobbra) és A_y (felfelé), a görgő helyére a függőleges B (felfelé) kerül. R komponensei: 4,000 kN jobbra, 6,928 kN lefelé. B helye: x_B = 2a/tg 30° = 6,928 m.",
    kepletek: ["(\\underline{R}, \\underline{A}_x, \\underline{A}_y, \\underline{B}) \\ekv \\underline{O}", "R\\sin 30^\\circ = 4{,}000,\\quad R\\cos 30^\\circ = 6{,}928\\ \\text{kN}"],
  },
  {
    t0: T.ma,
    cim: "Nyomaték az A csuklóra → B",
    szoveg: "A-n átmegy A_x és A_y. R merőleges a gerendára, ezért a karja egyszerűen a gerenda menti távolság, 1,333 m — nem kell komponensekre bontani. Az óramutató irányába forgat (negatív). B karja 6,928 m.",
    kepletek: ["\\Mp{A} -8\\cdot 1{,}333 + B\\cdot 6{,}928 = 0\\ \\Rightarrow\\ B = 1{,}540\\ \\text{kN}"],
  },
  {
    t0: T.fx,
    cim: "Vízszintes vetület → A_x",
    szoveg: "Csak R vízszintes komponense és A_x. Negatív: A_x valójában balra mutat — a csukló tartja meg a víz vízszintes tolását.",
    kepletek: ["\\Fx 4{,}000 + A_x = 0\\ \\Rightarrow\\ A_x = -4{,}000\\ \\text{kN}"],
  },
  {
    t0: T.fy,
    cim: "Függőleges vetület → A_y",
    szoveg: "R függőleges komponense lefelé, A_y és B felfelé.",
    kepletek: ["\\Fy -6{,}928 + A_y + 1{,}540 = 0\\ \\Rightarrow\\ A_y = 5{,}389\\ \\text{kN}"],
  },
  {
    t0: T.ell,
    cim: "Ellenőrzés: nyomaték a B görgőre",
    szoveg: "R karja a gerenda mentén 8 − 1,333 = 6,667 m (most az óramutatóval ellentétesen forgat); A_y karja 6,928 m, A_x karja 4 m — mindkettő negatív.",
    kepletek: ["\\Mp{B} 8\\cdot 6{,}667 - 5{,}389\\cdot 6{,}928 - 4{,}000\\cdot 4 = 53{,}33 - 37{,}33 - 16{,}00 = 0{,}00\\ \\checkmark"],
  },
  {
    t0: T.ered,
    cim: "Eredményvázlat",
    szoveg: "A_x nyila átfordul balra. 4 jobbra – 4 balra; 5,389 + 1,540 = 6,929 fel – 6,928 le. A görgő keveset tart, mert a teher az A közelében nyom.",
    kepletek: ["A_x = 4{,}000\\ \\text{kN}\\ (\\leftarrow),\\quad A_y = 5{,}389\\ \\text{kN}\\ (\\uparrow),\\quad B = 1{,}540\\ \\text{kN}\\ (\\uparrow)"],
  },
];

function Rajz(t) {
  const nyomU = arany(t, 0.3, 1.8);
  const eredoU = arany(t, 2.2, 3.2);
  const dqU = arany(t, 3.2, 4.2);
  const tamaszHalv = arany(t, T.elk + 0.2, T.elk + 1.0);
  const reakU = arany(t, T.elk + 0.8, T.elk + 2.2);
  const kijU = arany(t, T.elk + 2.2, T.elk + 2.9);
  const kompU = arany(t, T.elk + 2.6, T.elk + 3.4);
  const maU = arany(t, T.ma + 0.2, T.ma + 0.8);
  const maKar = arany(t, T.ma + 0.8, T.ma + 2.4);
  const fxU = arany(t, T.fx + 0.2, T.fx + 0.8);
  const fyU = arany(t, T.fy + 0.2, T.fy + 0.8);
  const ellU = arany(t, T.ell + 0.2, T.ell + 0.8);
  const ellKar = arany(t, T.ell + 0.8, T.ell + 2.8);
  const fordulU = arany(t, T.ered + 0.6, T.ered + 1.8);
  const szamU = arany(t, T.ered + 1.6, T.ered + 2.4);

  const fazis = t < T.ma ? "elk" : t < T.fx ? "ma" : t < T.fy ? "fx" : t < T.ell ? "fy" : t < T.ered ? "ell" : "ered";
  const el = {
    ma: { R: 1, B: 1 },
    fx: { Rx: 1, Ax: 1, R: 0.35 },
    fy: { Ry: 1, Ay: 1, B: 1, R: 0.35 },
    ell: { R: 1, Ax: 1, Ay: 1 },
  }[fazis];
  const op = (nev) => (el ? (el[nev] ?? 0.18) : 1);
  const kompLat = fazis === "elk" ? kompU : fazis === "fx" || fazis === "fy" ? 1 : 0;
  const nyomOp = nyomU * (1 - 0.8 * eredoU);

  return (
    <svg viewBox="0 0 600 350" className="abra w-full select-none">
      <TartoHegyek />
      <FilmHegyek />
      <Kijelentes x={430} y={40} opacitas={kijU * (fazis === "elk" ? 1 : 0.35)}>(R, Aₓ, Aᵧ, B) ≐ O</Kijelentes>

      {/* víz */}
      <path d={`M ${XA - 60} ${YA} L ${XA} ${YA} L ${XV} ${YV} L ${XA - 60} ${YV} Z`} fill="#7dd3fc" opacity="0.3" />
      <line x1={XA - 60} y1={YV} x2={XV} y2={YV} stroke="#0284c7" strokeWidth="1.2" />
      <path d={`M ${XA - 38} ${YV - 12} L ${XA - 22} ${YV - 12} L ${XA - 30} ${YV} Z`} fill="none" stroke="#0284c7" strokeWidth="1.2" />
      <line x1={XA - 70} y1={YA} x2={XA + 110} y2={YA} stroke={SZ.szurke} strokeWidth="1.2" />

      {/* a nyomás nyilai (merőlegesek, a mélységgel arányosak) */}
      {Array.from({ length: 7 }, (_, i) => {
        const s = i / 7;
        const px = XA + (XV - XA) * s;
        const py = YA + (YV - YA) * s;
        const h = 40 * (1 - s);
        const u = arany(nyomU, s * 0.6, s * 0.6 + 0.4);
        return <NyilA key={i} x1={px - h * SA} y1={py - h * CA} x2={px} y2={py} u={u} szin="#e2590a" hegy="fg-nar" vastag={1.5} opacitas={nyomOp} />;
      })}
      <FeliratA x={XA - 70} y={YV + 18} szin={SZ.nar} meret={11.5} vastag={false} horgony="start" opacitas={nyomOp}>pₘₐₓ = 4 kN/m</FeliratA>
      <FeliratA x={XV - 4} y={YV - 10} szin={SZ.nar} meret={11} vastag={false} horgony="end" opacitas={nyomOp}>0</FeliratA>

      {/* a gerenda és a támaszok */}
      <Tarto x1={XA} y1={YA} x2={XB} y2={YB} />
      <Csuklo x={XA} y={YA} opacitas={1 - 0.88 * tamaszHalv} />
      <Gorgo x={XB} y={YB} opacitas={1 - 0.88 * tamaszHalv} />
      <TamaszCimke x={XA - 22} y={YA + 20}>A</TamaszCimke>
      <TamaszCimke x={XB + 24} y={YB + 4}>B</TamaszCimke>
      <MeretFugg x={XB + 108} y1={YB} y2={YV} cimke="2 m" opacitas={0.8} />
      <MeretFugg x={XB + 108} y1={YV} y2={YA} cimke="2 m" opacitas={0.8} />

      {/* az eredő: merőleges a gerendára, jobbra-lefelé, a Q pontban */}
      <PontA x={Q.x} y={Q.y} r={4} szin="#e2590a" u={eredoU} />
      <EroA x={Q.x} y={Q.y} hossz={70} szog={-60} u={eredoU} opacitas={op("R")} szin={SZ.nar} hegy="fg-nar" vastag={3.8} cimke="R = 8 kN" dx={-10} dy={-6} horgony="end" />
      <Kar x1={XA} y1={YA} x2={Q.x} y2={Q.y} u={dqU} opacitas={fazis === "elk" || fazis === "ma" ? 1 : fazis === "ered" ? 0 : 0.3} cimke="1,333 m" dx={26} dy={20} />
      {/* komponensek */}
      <EroA x={Q.x + 44} y={Q.y} hossz={44} szog={0} u={kompLat} opacitas={op("Rx")} szin={SZ.nar} hegy="fg-nar" vastag={2.2} cimke="4,000" dx={6} dy={4} cimkeHegy />
      <EroA x={Q.x} y={Q.y + 60} hossz={60} szog={-90} u={kompLat} opacitas={op("Ry")} szin={SZ.nar} hegy="fg-nar" vastag={2.2} cimke="6,928 kN" dx={6} dy={2} cimkeHegy />

      {/* reakciók */}
      <EroA x={XA} y={YA} hossz={46} szog={0} u={reakU} opacitas={op("Ax") * (1 - fordulU)} cimke="Aₓ" dx={-4} dy={-10} horgony="end" />
      <EroA x={XA - 2} y={YA - 9} hossz={46} szog={180} u={fordulU} cimke={szamU > 0.5 ? "Aₓ = 4,000 kN" : "Aₓ"} dx={6} dy={18} />
      <EroA x={XA} y={YA} hossz={50} szog={90} u={reakU} opacitas={op("Ay")} cimke={szamU > 0.5 ? "Aᵧ = 5,389 kN" : "Aᵧ"} dx={8} dy={2} />
      <EroA x={XB} y={YB} hossz={50} szog={90} u={reakU} opacitas={op("B")} cimke={szamU > 0.5 ? "B = 1,540 kN" : "B"} dx={8} dy={4} />

      {fazis === "ma" && (
        <g opacity={maU}>
          <Fokusz x={XA} y={YA} t={t} cimke="A" dx={-30} dy={-14} />
          <Kar x1={XA} y1={YA + 34} x2={XB} y2={YA + 34} u={maKar} cimke="6,928 m" dy={-5} />
          <Pipa x={330} y={YA + 50} opacitas={arany(t, T.ma + 2.6, T.ma + 3.2)}>−10,67 + 6,928·B = 0 → B = 1,540 kN</Pipa>
        </g>
      )}
      {fazis === "fx" && (
        <g opacity={fxU}>
          <Pipa x={330} y={YA + 50} opacitas={arany(t, T.fx + 1.4, T.fx + 2.0)}>Aₓ = −4,000 kN → balra</Pipa>
        </g>
      )}
      {fazis === "fy" && (
        <g opacity={fyU}>
          <Pipa x={330} y={YA + 50} opacitas={arany(t, T.fy + 1.4, T.fy + 2.0)}>Aᵧ = 6,928 − 1,540 = 5,389 kN</Pipa>
        </g>
      )}
      {fazis === "ell" && (
        <g opacity={ellU}>
          <Fokusz x={XB} y={YB} t={t} szin={SZ.zold} cimke="B" dx={12} dy={-14} />
          <Kar x1={XB} y1={YB} x2={Q.x} y2={Q.y} u={arany(ellKar, 0, 0.4)} cimke="6,667 m" dx={30} dy={-14} szin={SZ.zold} />
          <Kar x1={XB} y1={YA + 34} x2={XA} y2={YA + 34} u={arany(ellKar, 0.35, 0.7)} cimke="6,928 m" dy={-5} szin={SZ.zold} />
          <Kar x1={XB + 40} y1={YB} x2={XB + 40} y2={YA} u={arany(ellKar, 0.65, 1)} cimke="4 m" dx={-18} dy={4} szin={SZ.zold} />
          <Pipa x={330} y={YA + 50} opacitas={arany(t, T.ell + 3.0, T.ell + 3.6)}>53,33 − 37,33 − 16,00 = 0,00 ✓</Pipa>
        </g>
      )}
      {fazis === "ered" && (
        <FeliratA x={330} y={YA + 74} szin={SZ.zold} meret={12.5} opacitas={arany(t, T.ered + 0.2, T.ered + 0.8)}>
          Eredményvázlat: 4 jobbra – 4 balra; 5,389 + 1,540 fel – 6,928 le
        </FeliratA>
      )}
    </svg>
  );
}

export default function FilmGyf6() {
  return (
    <FeladatFilm
      cim="GYF‑6 · Vízzel terhelt ferde gerenda — víznyomásból teher, teherből reakciók"
      hossz={28.5}
      fejezetek={FEJEZETEK}
      rajz={Rajz}
      megjegyzes="A nyomás a gerendára merőleges, ezért az eredő karja a nyomatéki egyenletben a gerenda menti távolság. A vetületi egyenletekhez az eredőt komponensekre bontjuk."
    />
  );
}
