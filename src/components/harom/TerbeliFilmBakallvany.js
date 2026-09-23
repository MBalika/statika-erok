"use client";

import FeladatFilm from "@/components/anim/FeladatFilm";
import { arany, rugo, lerp } from "@/components/anim/Idovonal";
import { Jelenet3D } from "./Jelenet3D";
import { P, kam, SZIN, RudT, TengelyekT, PadloT, TalpT, EroNyilT, VektorNyilT, CimkeT, PontT, VonalT, rudStilus } from "./TerbeliAlap";

/*
 * GYF‑3 filmen, 3D-ben: a H13/3 háromlábú bakállvány rúderői.
 * Csúcs C(0; 6; 0); talppontok 1: (−4; 0; 0), 2: (5; 0; −4), 3: (5; 0; 4).
 * F = 10 kN az xy síkban, a +x tengellyel α = 45°-ot bezáró egyenes mentén, balra-lefelé: F = (−7,071; −7,071; 0).
 * Eredmény: S1 = −10,39 kN (nyomott), S2 = S3 = 1,149 kN (húzott).
 */

const C = [0, 6, 0];
const L = [[-4, 0, 0], [5, 0, -4], [5, 0, 4]];
const F = [-7.071, -7.071, 0];
const S = [-10.387, 1.149, 1.149];
const E = [[-0.5547, -0.8321, 0], [0.5698, -0.6838, -0.4558], [0.5698, -0.6838, 0.4558]];
const LE = 0.2;

const FEJEZETEK = [
  {
    t0: 0,
    cim: "A bakállvány és a teher",
    szoveg: "Három rúd egy közös csomópontot támaszt 6 m magasan. A rudak talppontjai a földön: 1-es (−4; 0; 0), 2-es (5; 0; −4), 3-as (5; 0; 4). Az F = 10 kN teher az xy síkban hat, a +x tengellyel 45°-ot bezárva, balra-lefelé.",
    kepletek: ["\\underline F = (-10\\cos 45^\\circ;\\ -10\\sin 45^\\circ;\\ 0) = (-7{,}071;\\ -7{,}071;\\ 0)\\ \\text{kN}"],
  },
  {
    t0: 4.5,
    cim: "A csomópont elkülönítése",
    szoveg: "A rudak csak rúdirányú erőt adnak át. Mindhárom rúderőt húzóerőként vesszük fel: a csomópontra a talppont felé mutató S_i erő hat. A csomópontra ható erők közös metszéspontúak: három vetületi egyenlet marad.",
    kepletek: ["(\\underline F, \\underline S_1, \\underline S_2, \\underline S_3) \\ekv \\underline O"],
  },
  {
    t0: 8.5,
    cim: "A rudak hossza és a vetületek",
    szoveg: "A rúderő komponenseit a (9.1) képlettel a rúd vetületeiből számoljuk: S_ix = ±S_i·l_ix/l_i. A rúdhosszak: l₁ = √(4²+6²) = 7,211 m, l₂ = l₃ = √(5²+6²+4²) = 8,775 m.",
    kepletek: ["\\underline e_1 = (-0{,}5547;\\ -0{,}8321;\\ 0),\\quad \\underline e_2 = (0{,}5698;\\ -0{,}6838;\\ -0{,}4558),\\quad \\underline e_3 = (0{,}5698;\\ -0{,}6838;\\ 0{,}4558)"],
  },
  {
    t0: 13,
    cim: "z irányú vetület: S₂ = S₃",
    szoveg: "A teher és az 1-es rúd az xy síkban fekszik, z vetületük nulla. A 2-es és a 3-as rúd z vetülete ellentett: a két rúderő egyenlő — ezt a szimmetria is mutatja.",
    kepletek: ["\\Fz 0 - 0{,}4558\\,S_2 + 0{,}4558\\,S_3 = 0 \\;\\Rightarrow\\; S_2 = S_3"],
  },
  {
    t0: 17,
    cim: "x és y irányú vetület: S₁ és S₂",
    szoveg: "Két egyenlet két ismeretlennel (S₂ = S₃ már ismert). Az x egyenletből S₁-et kifejezve és az y-ba helyettesítve S₂ = 1,149 kN, majd S₁ = −10,39 kN.",
    kepletek: ["\\Fx -7{,}071 - 0{,}5547\\,S_1 + 2\\cdot 0{,}5698\\,S_2 = 0", "\\Fy -7{,}071 - 0{,}8321\\,S_1 - 2\\cdot 0{,}6838\\,S_2 = 0", "S_2 = S_3 = 1{,}149\\ \\text{kN},\\qquad S_1 = -10{,}39\\ \\text{kN}"],
  },
  {
    t0: 22,
    cim: "Eredmény és ellenőrzés",
    szoveg: "Az 1-es rúd nyomott (kék): a teher rádől; a 2-es és 3-as rúd kissé húzott (piros). Ellenőrzés: a három rúderő és a teher összege minden irányban nulla — pl. y: −7,071 + 8,643 − 2·0,7857 = 0 ✓.",
    kepletek: ["\\Fy -7{,}071 - 0{,}8321\\cdot(-10{,}39) - 2\\cdot 0{,}6838\\cdot 1{,}149 = 0{,}00\\ \\checkmark"],
  },
];

function Rajz(t) {
  const rudU = [arany(t, 0.3, 1.3), arany(t, 0.9, 1.9), arany(t, 1.5, 2.5)];
  const teher = arany(t, 2.8, 3.8, rugo);
  const elk = arany(t, 4.8, 6.2);
  const vetU = arany(t, 8.8, 10.5);
  const zU = arany(t, 13.3, 14.5);
  const xyU = arany(t, 17.3, 20);
  const vegU = arany(t, 22.3, 23.5);
  const kesz = t >= 22.3;
  const halvanyRud = elk * (1 - vegU);

  return (
    <Jelenet3D kamera={kam([11, 8, 14])} cel={P([1, 2.5, 0])} magassag={420} tavolsagMin={5} tavolsagMax={50}>
      <PadloT meret={20} osztas={20} magassag={-0.01} />
      <TengelyekT hossz={4} origo={[0, 0, 0]} />
      {L.map((p, i) => {
        const st = rudStilus(S[i], 10.4);
        const szin = kesz ? st.szin : SZIN.rud;
        const sugar = kesz ? lerp(0.09, st.sugar, vegU) : 0.09;
        return (
          <group key={i}>
            <RudT tol={C} ig={p} sugar={sugar} szin={szin} u={rudU[i]} opacitas={1 - 0.7 * halvanyRud} />
            <TalpT pozicio={p} opacitas={rudU[i]} />
            <CimkeT pozicio={[(C[0] + p[0]) / 2 - 0.3, (C[1] + p[1]) / 2 + 0.4, (C[2] + p[2]) / 2]} szin={kesz ? st.szin : SZIN.tarto} meret={12} opacitas={rudU[i]}>
              {kesz ? `${i + 1}: S = ${["−10,39", "1,149", "1,149"][i]} kN` : `${i + 1}`}
            </CimkeT>
            <CimkeT pozicio={[p[0], -0.45, p[2]]} szin="#475569" meret={11} vastag={false} opacitas={rudU[i]}>({p[0]}; 0; {p[2]})</CimkeT>
            {/* vetületek: lépcső a talpponttól a csúcs alá */}
            <VonalT tol={p} ig={[0, 0, p[2]]} szin={SZIN.zold} szaggatott u={vetU} vastag={1.6} />
            <VonalT tol={[0, 0, p[2]]} ig={[0, 0, 0]} szin={SZIN.zold} szaggatott u={vetU} vastag={1.6} />
          </group>
        );
      })}
      <VonalT tol={[0, 0, 0]} ig={C} szin={SZIN.zold} szaggatott u={vetU} vastag={1.6} />
      <CimkeT pozicio={[0.4, 3, 0]} szin={SZIN.zold} meret={11} vastag={false} opacitas={vetU}>l_iy = 6 m</CimkeT>
      <CimkeT pozicio={[2.5, -0.5, -4.4]} szin={SZIN.zold} meret={11} vastag={false} opacitas={vetU}>l_2x = 5</CimkeT>
      <CimkeT pozicio={[-0.6, -0.5, -2]} szin={SZIN.zold} meret={11} vastag={false} opacitas={vetU}>l_2z = 4</CimkeT>
      <CimkeT pozicio={[-2, -0.5, 0.4]} szin={SZIN.zold} meret={11} vastag={false} opacitas={vetU}>l_1x = 4</CimkeT>

      <PontT pozicio={C} r={0.2} szin={SZIN.tarto} u={rudU[0]} />
      <CimkeT pozicio={[C[0] + 0.5, C[1] + 0.4, C[2]]} szin={SZIN.tarto} meret={12} vastag={false} opacitas={rudU[0]}>C(0; 6; 0)</CimkeT>
      <EroNyilT pont={C} F={F} leptek={LE} szin={SZIN.teher} u={teher} cimke="F = 10 kN" cimkeEltolas={[0, 0.5, 0]} />
      <VonalT tol={C} ig={[3.5, 6, 0]} szin={SZIN.teher} szaggatott opacitas={0.6 * teher} />
      <CimkeT pozicio={[2.4, 6.35, 0]} szin={SZIN.teher} meret={11} vastag={false} opacitas={teher}>α = 45°</CimkeT>

      {/* elkülönítés: a csomópontra ható rúderők, húzóerőként felvéve */}
      {elk > 0.05 && (
        <>
          {E.map((e, i) => {
            const nagysag = kesz ? Math.abs(S[i]) : 6;
            const irany = kesz && S[i] < 0 ? -1 : 1;
            const v = [e[0] * nagysag * irany, e[1] * nagysag * irany, e[2] * nagysag * irany];
            const szin = kesz ? rudStilus(S[i]).szin : xyU > 0.05 && i === 0 ? SZIN.nyomott : zU > 0.05 && i > 0 ? SZIN.huzott : SZIN.reakcio;
            return <VektorNyilT key={i} pont={C} F={v} leptek={0.16} szin={szin} vastag={0.07} u={elk} minHossz={0.9} cimke={kesz ? "" : `S${i + 1}`} cimkeEltolas={[e[0] * 0.5, e[1] * 0.5 - 0.2, e[2] * 0.5]} />;
          })}
          {kesz && <CimkeT pozicio={[C[0] - 1.6, C[1] - 1.4, 0.3]} szin={SZIN.nyomott} meret={11.5}>S₁ a csúcsot tolja</CimkeT>}
        </>
      )}
      {/* z irányú vetületek jelzése */}
      {zU > 0.05 && !kesz && (
        <>
          <VonalT tol={C} ig={[0, 6, -2.2]} szin={SZIN.kek} vastag={2.2} u={zU} />
          <VonalT tol={C} ig={[0, 6, 2.2]} szin={SZIN.kek} vastag={2.2} u={zU} />
          <CimkeT pozicio={[0, 6.5, -2.2]} szin={SZIN.kek} meret={11} vastag={false} opacitas={zU}>−0,4558·S₂</CimkeT>
          <CimkeT pozicio={[0, 6.5, 2.2]} szin={SZIN.kek} meret={11} vastag={false} opacitas={zU}>+0,4558·S₃</CimkeT>
        </>
      )}
    </Jelenet3D>
  );
}

export default function TerbeliFilmBakallvany() {
  return <FeladatFilm cim="GYF‑3 · A háromlábú bakállvány rúderői — 3D-ben" hossz={25} fejezetek={FEJEZETEK} rajz={Rajz} megjegyzes="A jelenet forgatható. A csúcsban a nyilak a csomópontra ható rúderők (húzóerőként felvéve); a végén piros = húzott, kék = nyomott rúd." />;
}
