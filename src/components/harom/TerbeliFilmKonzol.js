"use client";

import FeladatFilm from "@/components/anim/FeladatFilm";
import { arany, rugo } from "@/components/anim/Idovonal";
import { Jelenet3D } from "./Jelenet3D";
import { P, kam, SZIN, RudT, TengelyekT, PadloT, BefogasT, EroNyilT, VektorNyilT, CimkeT, PontT, VonalT } from "./TerbeliAlap";

/*
 * GYF‑1 filmen, 3D-ben: a H13/1 tört tengelyű befogott konzol reakciói.
 * A = origó, b = 3 m függőleges szár, a = 2 m vízszintes szár (−x), E(−2; 3; 0)-ban F = 10 kN a −z irányban.
 * Eredmény: A = (0; 0; 10) kN, M_A = (30; 20; 0) kNm.
 */

const A = [0, 0, 0];
const C = [0, 3, 0];
const E = [-2, 3, 0];
const F = [0, 0, -10];
const LE = 0.2;
const LM = 0.07;

const FEJEZETEK = [
  {
    t0: 0,
    cim: "A szerkezet és a teher",
    szoveg: "Az A pontban mereven befogott konzol: 3 m függőleges szár, majd 2 m-es vízszintes szár a −x irányba. A végén F = 10 kN hat a z tengellyel párhuzamosan, a rajz szerint a −z irányba (a néző felől befelé).",
    kepletek: ["\\underline r_E = (-2;\\ 3;\\ 0)\\ \\text{m},\\qquad \\underline F = (0;\\ 0;\\ -10)\\ \\text{kN}"],
  },
  {
    t0: 4,
    cim: "Elkülönítés: a befogás helyett hat reakció",
    szoveg: "A merev befogás fokszáma hat: három erőkomponens (A_x, A_y, A_z) és három nyomatékkomponens (M_Ax, M_Ay, M_Az). Mindet a pozitív tengelyirányban vesszük fel — a nyomatékokat kettős nyíllal rajzoljuk.",
    kepletek: ["(\\underline F, \\underline A, \\underline M_A) \\ekv \\underline O"],
  },
  {
    t0: 8,
    cim: "Három vetületi egyenlet → a reakcióerő",
    szoveg: "A nyomatékok a vetületi egyenletekben nem szerepelnek. Az x és y irányú vetületben csak egy-egy ismeretlen van, és a teher vetülete nulla; a z irányúban a teher −10.",
    kepletek: ["\\Fx A_x = 0,\\qquad \\Fy A_y = 0", "\\Fz -10 + A_z = 0 \\;\\Rightarrow\\; A_z = 10\\ \\text{kN}"],
  },
  {
    t0: 12.5,
    cim: "Három nyomatéki egyenlet az A-n átmenő tengelyekre",
    szoveg: "A reakcióerők metszik ezeket a tengelyeket (karjuk nulla), így mindhárom egyenlet egyismeretlenes. F karja az x tengelyre 3 m (a magasság), az y tengelyre 2 m (a kinyúlás), a z tengellyel párhuzamos, ezért arra nem forgat.",
    kepletek: ["\\sum M_{ix}:\\ 3\\cdot(-10) + M_{Ax} = 0 \\Rightarrow M_{Ax} = 30", "\\sum M_{iy}:\\ -(-2)\\cdot(-10) + M_{Ay} = 0 \\Rightarrow M_{Ay} = 20", "\\sum M_{iz}:\\ 0 + M_{Az} = 0"],
  },
  {
    t0: 18,
    cim: "Eredményvázlat és ellenőrzés",
    szoveg: "Három reakció nulla, három nem: A_z = 10 kN a +z irányba (a néző felé, a teherrel ellentétesen), M_Ax = 30 kNm az x, M_Ay = 20 kNm az y tengely körül. Ellenőrzés az E ponton átmenő tengelyekre: az x tengely körül M_Ax − 3·A_z = 30 − 30 = 0 ✓.",
    kepletek: ["\\underline A = (0;\\ 0;\\ 10)\\ \\text{kN},\\qquad \\underline M_A = (30;\\ 20;\\ 0)\\ \\text{kNm}", "\\sum M_{iE,x}:\\ 30 - 3\\cdot 10 = 0\\ \\checkmark"],
  },
];

function Rajz(t) {
  const szerk = arany(t, 0.2, 1.4);
  const teher = arany(t, 1.6, 2.6, rugo);
  const elk = arany(t, 4.3, 5.5);
  const ismeretlenU = arany(t, 5.6, 7.2);
  const vetU = arany(t, 8.3, 10.5);
  const nyomU = arany(t, 12.8, 16.5);
  const vegU = arany(t, 18.2, 19.5);
  const kesz = t >= 18.2;

  const szamitott = (i) => (i === 2 ? vetU : 0); // csak A_z nem nulla
  const R = [0, 0, 10];
  const MA = [30, 20, 0];

  return (
    <Jelenet3D kamera={kam([7.5, 5.5, 9])} cel={P([-1, 1.6, 0])} magassag={420} tavolsagMin={4} tavolsagMax={40}>
      <PadloT meret={16} osztas={16} magassag={-0.01} />
      <TengelyekT hossz={3.2} origo={[0.3, 0, 0.3]} />
      <RudT tol={A} ig={C} sugar={0.13} szin={SZIN.tarto} u={szerk} />
      <RudT tol={C} ig={E} sugar={0.13} szin={SZIN.tarto} u={arany(t, 0.9, 1.6)} />
      <PontT pozicio={C} r={0.16} szin={SZIN.tarto} u={szerk} />
      <CimkeT pozicio={[0.35, -0.35, 0.3]} szin={SZIN.tarto} opacitas={szerk}>A</CimkeT>
      <CimkeT pozicio={[E[0] - 0.4, E[1] + 0.35, 0]} szin={SZIN.tarto} meret={12} vastag={false} opacitas={teher}>E(−2; 3; 0)</CimkeT>
      <VonalT tol={[-2, 3.6, 0]} ig={[0, 3.6, 0]} szin="#64748b" vastag={1.2} opacitas={szerk} />
      <CimkeT pozicio={[-1, 3.95, 0]} szin="#475569" meret={11.5} vastag={false} opacitas={szerk}>a = 2 m</CimkeT>
      <VonalT tol={[0.7, 0, 0]} ig={[0.7, 3, 0]} szin="#64748b" vastag={1.2} opacitas={szerk} />
      <CimkeT pozicio={[1.3, 1.5, 0]} szin="#475569" meret={11.5} vastag={false} opacitas={szerk}>b = 3 m</CimkeT>
      <BefogasT pozicio={A} normal={[0, 1, 0]} meret={1.8} opacitas={Math.max(0.02, 1 - elk)} />
      <EroNyilT pont={E} F={F} leptek={LE} szin={SZIN.teher} u={teher} cimke="F = 10 kN (−z)" cimkeEltolas={[0, 0.5, 0]} />

      {/* ismeretlen reakciók (szürke), majd a kiszámoltak */}
      {elk > 0.3 && !kesz && (
        <>
          {[0, 1, 2].map((i) => {
            const v = [0, 0, 0];
            v[i] = 1;
            const nev = ["Ax", "Ay", "Az"][i];
            const kiszamolt = vetU > 0.05;
            const nullaLett = kiszamolt && i !== 2;
            return (
              <VektorNyilT
                key={nev}
                pont={A}
                F={v}
                leptek={1.4}
                szin={kiszamolt ? SZIN.reakcio : "#94a3b8"}
                u={ismeretlenU * (nullaLett ? Math.max(0.02, 1 - vetU) : 1)}
                opacitas={nullaLett ? Math.max(0.05, 1 - vetU) : 1}
                cimke={kiszamolt ? (i === 2 ? "Az = 10 kN" : `${nev} = 0`) : `${nev} = ?`}
                cimkeEltolas={[i === 0 ? 0.6 : 0, i === 1 ? 0.4 : 0, i === 2 ? 0.6 : 0]}
              />
            );
          })}
          {[0, 1, 2].map((i) => {
            const v = [0, 0, 0];
            v[i] = 1;
            const nev = ["MAx", "MAy", "MAz"][i];
            const kiszamolt = nyomU > 0.05;
            const nullaLett = kiszamolt && i === 2;
            return (
              <VektorNyilT
                key={nev}
                pont={A}
                F={v}
                leptek={1.9}
                szin={kiszamolt ? SZIN.nyomatek : "#94a3b8"}
                kettos
                vastag={0.08}
                u={ismeretlenU * (nullaLett ? Math.max(0.02, 1 - nyomU) : 1)}
                opacitas={nullaLett ? Math.max(0.05, 1 - nyomU) : 1}
                cimke={kiszamolt ? [`MAx = 30 kNm`, `MAy = 20 kNm`, `MAz = 0`][i] : `${nev} = ?`}
                cimkeEltolas={[i === 0 ? 0.9 : 0.3, i === 1 ? 0.5 : -0.65, i === 2 ? 0.9 : 0]}
              />
            );
          })}
        </>
      )}
      {kesz && (
        <>
          <VektorNyilT pont={A} F={R} leptek={LE} szin={SZIN.reakcio} u={vegU} cimke="A = 10 kN" cimkeEltolas={[0, 0, 0.6]} />
          <VektorNyilT pont={A} F={[MA[0], 0, 0]} leptek={LM} szin={SZIN.nyomatek} kettos vastag={0.08} u={vegU} cimke="MAx = 30 kNm" cimkeEltolas={[0.9, 0.3, 0]} />
          <VektorNyilT pont={A} F={[0, MA[1], 0]} leptek={LM} szin={SZIN.nyomatek} kettos vastag={0.08} u={vegU} cimke="MAy = 20 kNm" cimkeEltolas={[0.3, 0.5, 0]} />
          {/* kar-vonalak az ellenőrzéshez */}
          <VonalT tol={A} ig={[0, 3, 0]} szin={SZIN.nyomatek} szaggatott opacitas={0.5 * vegU} />
          <CimkeT pozicio={[-0.5, 1.5, 0.4]} szin={SZIN.nyomatek} meret={11} vastag={false} opacitas={vegU}>kar 3 m</CimkeT>
        </>
      )}
      {/* a nyomatéki karok szemléltetése a 4. fejezetben */}
      {nyomU > 0.05 && !kesz && (
        <>
          <VonalT tol={[0, 3, 0]} ig={E} szin={SZIN.nyomatek} szaggatott opacitas={0.6} />
          <VonalT tol={A} ig={C} szin={SZIN.nyomatek} szaggatott opacitas={0.6} />
          <CimkeT pozicio={[-1, 2.6, 0]} szin={SZIN.nyomatek} meret={11} vastag={false}>kar az y-ra: 2 m</CimkeT>
          <CimkeT pozicio={[-0.6, 1.5, 0.4]} szin={SZIN.nyomatek} meret={11} vastag={false}>kar az x-re: 3 m</CimkeT>
        </>
      )}
    </Jelenet3D>
  );
}

export default function TerbeliFilmKonzol() {
  return <FeladatFilm cim="GYF‑1 · A befogott térbeli konzol reakciói — 3D-ben" hossz={21} fejezetek={FEJEZETEK} rajz={Rajz} megjegyzes="A jelenet forgatható: húzd az egérrel, görgess a nagyításhoz. Az y tengely mutat felfelé, a z a néző felé." />;
}
