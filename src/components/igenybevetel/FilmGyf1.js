"use client";

import FilmIgenybevetel from "@/components/igenybevetel/FilmIgenybevetel";
import { eredmeny } from "@/components/igenybevetel/Modellek";

/*
 * GYF‑1 · Befogott konzol (H09/1) — film.
 * a = 2 m, F₁ = 10 kN (30°, jobbra-lefelé) az x = a-nál, F₂ = 5 kN ↓ a szabad végen.
 * Reakciók: A_x = −8,66 kN, A_y = 10 kN, M_A = 40 kNm ↶. N: +8,66 / 0; V: +10 / +5; M: −40 → −20 → 0.
 */

const T = { reak: 3.5, szak: 7.5, epit0: 10, epit1: 24, tores: 24.5, szelso: 28.5 };

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
    cim: "Szakaszok",
    szoveg: "Szakaszhatár ott van, ahol koncentrált hatás működik: az x = 2 m-nél. Két terheletlen szakasz: N és V konstans, M lineáris mindkettőn.",
  },
  {
    t0: T.epit0,
    cim: "A keresztmetszet vándorol — N",
    szoveg: "Jobbról (a szabad vég felől) számolunk: a jobb oldali erők vízszintes vetülete (→ pozitív). A 8,66 kN kifelé húzza a keresztmetszetet, ezért N = +8,66 kN az első szakaszon; utána nincs vízszintes erő, N = 0.",
    kepletek: ["(\\rightarrow):\\ N = +8{,}660\\ \\text{kN}\\ (0 < x < 2),\\qquad N = 0\\ (2 < x < 6)"],
  },
  {
    t0: 14.5,
    cim: "V — a jobb oldali erők függőleges vetülete",
    szoveg: "Jobbról a lefelé mutató erők pozitívak (↓). A szabad vég felől: 5 kN, majd az F₁ alatt még 5 kN jön hozzá: V = +5, illetve +10 kN.",
    kepletek: ["(\\downarrow):\\ V = +5\\ \\text{kN}\\ (2 < x < 6),\\qquad V = +5 + 5 = +10\\ \\text{kN}\\ (0 < x < 2)"],
  },
  {
    t0: 19,
    cim: "M — a jobb oldali erők nyomatéka (↶ pozitív)",
    szoveg: "A lefelé mutató erők a K-tól jobbra az óramutató szerint forgatnak: M negatív, felül húzott. Lineáris szakaszok: elég a végpontok értéke.",
    kepletek: ["(\\curvearrowleft):\\ M(6) = 0,\\quad M(2) = -5\\cdot 4 = -20\\ \\text{kNm},\\quad M(0) = -5\\cdot 6 - 5\\cdot 2 = -40\\ \\text{kNm}"],
  },
  {
    t0: T.tores,
    cim: "Töréspontok",
    szoveg: "Az F₁ alatt: az N ábrában 8,66 kN-os, a V ábrában 5 kN-os ugrás (a komponensek), az M ábrában törés — ugrás nincs. A befogásnál az ábrák végértékei a reakciók: N = 8,66 = |A_x|, V = 10 = A_y, M = −40 = −M_A.",
  },
  {
    t0: T.szelso,
    cim: "Szélsőérték és ellenőrzés",
    szoveg: "V sehol sem nulla, ezért az M-nek nincs belső szélsőértéke: a legnagyobb nyomaték a befogásnál, 40 kNm (felül húzott). A szabad végen M = 0 és N = 0, V = 5 = F₂ — a végkeresztmetszet igénybevételei az ottani koncentrált hatásból.",
    kepletek: ["M_{\\max} = |M(0)| = 40\\ \\text{kNm} = M_A\\ \\checkmark"],
  },
];

export default function FilmGyf1() {
  return (
    <FilmIgenybevetel
      cim="GYF‑1 · Befogott konzol — a keresztmetszet vándorol, az ábrák épülnek"
      eredmeny={eredmeny("gyf1")}
      fejezetek={FEJEZETEK}
      T={T}
      hossz={33}
      megjegyzes="A K keresztmetszet balról jobbra vándorol, alatta épülnek az ábrák; a jobb felső sarokban az aktuális N, V, M. A szaggatott függőleges vonalak a szakaszhatárok, a gyűrűk a töréspontok."
    />
  );
}
