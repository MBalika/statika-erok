"use client";

import FilmIgenybevetel, { epitIdo } from "@/components/igenybevetel/FilmIgenybevetel";
import { eredmeny } from "@/components/igenybevetel/Modellek";

/*
 * GYF‑1 · Befogott konzol (H09/1) — film.
 * a = 2 m, F₁ = 10 kN (30°, jobbra-lefelé) az x = a-nál, F₂ = 5 kN ↓ a szabad végen.
 * Reakciók: A_x = −8,66 kN, A_y = 10 kN, M_A = 40 kNm ↶. N: +8,66 / 0; V: +10 / +5; M: −40 → −20 → 0.
 * A K keresztmetszet A-tól B felé vándorol; a fejezetek szakaszonként követik (a K az x = 2-t a 14,67 s-nál éri el).
 */

const T = { reak: 3.5, szak: 7.5, epit0: 10, epit1: 24, tores: 24.5, szelso: 28.5 };
const e = eredmeny("gyf1");

const FEJEZETEK = [
  {
    t0: 0,
    cim: "A feladat",
    szoveg: "Bal végén befogott, 6 m hosszú konzol. Az x = 2 m-nél 30°-os, jobbra-lefelé mutató 10 kN, a szabad végen 5 kN lefelé. A ferde erőt komponenseire bontjuk: 8,66 kN jobbra, 5 kN lefelé.",
    kepletek: ["F_{1x} = 10\\cos 30^\\circ = 8{,}660\\ \\text{kN},\\quad F_{1y} = 10\\sin 30^\\circ = 5{,}000\\ \\text{kN}"],
  },
  {
    t0: T.reak,
    cim: "Reakciók — röviden",
    szoveg: "Konzolon az ábrák a reakciók nélkül is megrajzolhatók (kívülről számolunk), de az ellenőrzéshez jól jönnek. A_x negatív: balra mutat.",
    kepletek: ["\\Fx A_x + 8{,}660 = 0 \\Rightarrow A_x = -8{,}660\\ \\text{kN}", "\\Fy A_y - 5 - 5 = 0 \\Rightarrow A_y = 10\\ \\text{kN}", "\\Mp{A} M_A - 5\\cdot 2 - 5\\cdot 6 = 0 \\Rightarrow M_A = 40\\ \\text{kNm}"],
  },
  {
    t0: T.szak,
    cim: "Szakaszok és a rajz oldala",
    szoveg: "Szakaszhatár ott van, ahol koncentrált hatás működik: az x = 2 m-nél. Két terheletlen szakasz: N és V konstans, M lineáris mindkettőn. Mindhárom ábrát a tartó pozitív (alsó) oldalára mérjük fel: a pozitív érték alul, a negatív felül — a + és − jel mutatja.",
  },
  {
    t0: T.epit0,
    cim: "1. szakasz (0 < x < 2): jobbról, F₁ és F₂ is a K-tól jobbra",
    szoveg: "Jobbról (a szabad vég felől) számolunk, a pozitív irányok: N (→), V (↓), M (↶). A 8,66 kN kifelé húzza a keresztmetszetet: N = +8,66. A két lefelé mutató erő: V = +10. Mindkettő az óramutató szerint forgat a K-ra: M negatív, felül húzott.",
    kepletek: [
      "(\\rightarrow):\\ N = +8{,}660\\ \\text{kN},\\qquad (\\downarrow):\\ V = +5 + 5 = +10\\ \\text{kN}",
      "(\\curvearrowleft):\\ M(x) = -5\\,(6-x) - 5\\,(2-x):\\quad M(0) = -40,\\ M(2) = -20\\ \\text{kNm}",
    ],
  },
  {
    t0: epitIdo(T, e, 2),
    cim: "2. szakasz (2 < x < 6): a K-tól jobbra már csak F₂",
    szoveg: "Az F₁ alatt az N ábra 8,66 kN-t, a V ábra 5 kN-t ugrik (a komponensek), az M ábra törik. Innen csak F₂ számít: N = 0, V = +5, M lineárisan tart a nullához.",
    kepletek: ["(\\rightarrow):\\ N = 0,\\qquad (\\downarrow):\\ V = +5\\ \\text{kN},\\qquad (\\curvearrowleft):\\ M(x) = -5\\,(6-x):\\ M(2) = -20,\\ M(6) = 0"],
  },
  {
    t0: T.tores,
    cim: "Töréspontok",
    szoveg: "Az F₁ alatt: N és V ugrik, M törik — ugrás az M-ben nincs. A befogásnál az ábrák végértékei a reakciók: N = 8,66 = |A_x|, V = 10 = A_y, M = −40 = −M_A. A szabad végen N = M = 0, V = 5 = F₂.",
  },
  {
    t0: T.szelso,
    cim: "Szélsőérték és ellenőrzés",
    szoveg: "V sehol sem nulla, ezért az M-nek nincs belső szélsőértéke: a legnagyobb nyomaték a befogásnál, 40 kNm (felül húzott). A pozitív N és V a tartó alatt, a negatív M fölötte — mindhárom ugyanarra a pozitív oldalra rajzolva.",
    kepletek: ["M_{\\max} = |M(0)| = 40\\ \\text{kNm} = M_A\\ \\checkmark"],
  },
];

export default function FilmGyf1() {
  return (
    <FilmIgenybevetel
      cim="GYF‑1 · Befogott konzol — a keresztmetszet vándorol, az ábrák épülnek"
      eredmeny={e}
      fejezetek={FEJEZETEK}
      T={T}
      hossz={33}
      megjegyzes="A K keresztmetszet balról jobbra vándorol, alatta épülnek az ábrák; az első ábra címsorában az aktuális x, N, V, M. A szaggatott függőleges vonalak a szakaszhatárok, a gyűrűk a töréspontok. A számítás jobbról (kívülről) megy, a rajz balról épül — a kettő ugyanoda vezet."
    />
  );
}
