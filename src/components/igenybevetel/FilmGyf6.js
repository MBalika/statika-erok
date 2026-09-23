"use client";

import FilmIgenybevetel, { epitIdo } from "@/components/igenybevetel/FilmIgenybevetel";
import { eredmeny } from "@/components/igenybevetel/Modellek";

/*
 * GYF‑6 · Tört tengelyű konzol (vizsgaminta 2. feladat) — film.
 * A befogás alul, oszlop 4 m, vízszintes kar 3 m, a karon 3 kN/m felfelé.
 * Reakciók: A_y = −9 kN (lefelé 9), M_A = −13,5 kNm (↷ 13,5). Oszlop: N = +9 (húzott), V = 0, M = 13,5 konstans (belső oldal húzott);
 * kar: N = 0, V: −9 → 0 lineáris, M: 13,5 → 0 parabola (alul húzott).
 * A K az A-tól indul az oszlopon fölfelé, a sarok után (18,5 s) a karon halad D felé.
 */

const T = { reak: 3.5, szak: 8, epit0: 10.5, epit1: 24.5, tores: 25, szelso: 29 };
const e = eredmeny("gyf6");

const FEJEZETEK = [
  {
    t0: 0,
    cim: "A feladat (vizsgaminta, 2. feladat)",
    szoveg: "Alul befogott, 4 m magas oszlop, a tetején 3 m-es vízszintes kar; a karon 3 kN/m felfelé mutató (szívó) teher, eredője 9 kN a kar közepén.",
  },
  {
    t0: T.reak,
    cim: "Reakciók",
    szoveg: "Vízszintes erő nincs, A_x = 0. A függőleges vetületből A_y negatív: a befogás lefelé tartja az oszlopot. A befogási nyomaték az óramutató szerint forgat.",
    kepletek: ["\\Fy A_y + 9 = 0 \\Rightarrow A_y = -9\\ \\text{kN}", "\\Mp{A} M_A + 9\\cdot 1{,}5 = 0 \\Rightarrow M_A = -13{,}5\\ \\text{kNm}\\ (\\curvearrowright)"],
  },
  {
    t0: T.szak,
    cim: "Szakaszok: a sarok mindig határ — és a pozitív oldal rudanként",
    szoveg: "A törésnél megváltozik a tengely iránya, vele az N és a V iránya is — ezért a sarok szakaszhatár. Az oszlop terheletlen (N, V konstans, M lineáris), a kar egyenletesen terhelt (V lineáris, M parabola). A pozitív oldal az oszlopon a jobb (belső), a karon az alsó oldal: mindhárom ábra pozitív értékei ide kerülnek.",
  },
  {
    t0: T.epit0,
    cim: "Az oszlop (A–C): felülről, a kar felől számolva",
    szoveg: "A kar 9 kN-nal felfelé húzza az oszlopot: az oszlop tengelyirányú vetülete N = +9 (húzott). Vízszintes erő nincs: V = 0, ezért M konstans. A 9 kN a sarokhoz képest 1,5 m karral forgat: M = 13,5 kNm az egész oszlopon — a húzott oldal a belső (a kar felőli) oldal, az ábra ott van.",
    kepletek: ["N = +9\\ \\text{kN},\\quad V = 0,\\quad M = 9\\cdot 1{,}5 = 13{,}5\\ \\text{kNm}"],
  },
  {
    t0: epitIdo(T, e, 4),
    cim: "A kar (C–D): a szabad vég felől",
    szoveg: "A kar végétől s távolságra a felfelé ható teher 3s: V = −3s (a felfelé mutató erő jobbról negatív), a sarokban −9 — az ábra a kar fölött (negatív oldal). Az M a húzott (alsó) oldalra: 3s·s/2 = 1,5s², a sarokban 13,5 — ugyanannyi, mint az oszlopon: a nyomaték átmegy a sarkon.",
    kepletek: ["V(s) = -3s,\\quad M(s) = 1{,}5\\,s^2,\\quad M(3) = 13{,}5\\ \\text{kNm}"],
  },
  {
    t0: T.tores,
    cim: "A sarok",
    szoveg: "A sarokban az oszlop N-je (+9) a kar V-jévé (−9) válik: N és V szerepet cserél. Az M ábra befordul a sarkon: mindkét csonkon a belső oldalon van, értéke 13,5. A szabad végen minden nulla.",
  },
  {
    t0: T.szelso,
    cim: "Ellenőrzés a befogásnál",
    szoveg: "Az oszlop alján: N = 9 = |A_y|, V = 0 = A_x, M = 13,5 = |M_A| — az ábrák végértékei a reakciók. A karon V csak a szabad végen nulla, ott M = 0: belső szélsőérték nincs.",
  },
];

export default function FilmGyf6() {
  return (
    <FilmIgenybevetel
      cim="GYF‑6 · Tört tengelyű konzol — N és V szerepet cserél, M átmegy a sarkon"
      eredmeny={e}
      fejezetek={FEJEZETEK}
      T={T}
      hossz={34}
      amp={34}
      megjegyzes="A rajz a befogástól indulva építi az ábrákat (előbb az oszlop, aztán a kar), a szöveg viszont a konzol-recept szerint kívülről számol — a kettő ugyanoda vezet. Az ábra címsorában a K helye: melyik rúdon, a rúd kezdetétől mérve."
    />
  );
}
