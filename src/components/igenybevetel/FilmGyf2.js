"use client";

import FilmIgenybevetel from "@/components/igenybevetel/FilmIgenybevetel";
import { eredmeny } from "@/components/igenybevetel/Modellek";

/*
 * GYF‑2 · Kéttámaszú tartó koncentrált és megoszló teherrel — film.
 * L = 6 m, F = 12 kN az x = 1 m-nél, p = 4 kN/m. A = 22 kN, B = 14 kN.
 * V: 22 → 18 | 6 → −14 (V = 0 az x = 2,5 m-nél); M: 0 → 20 → 24,5 (max) → 0.
 */

const T = { reak: 3.5, szak: 8, epit0: 10.5, epit1: 24.5, tores: 25, szelso: 29 };

const FEJEZETEK = [
  {
    t0: 0,
    cim: "A feladat",
    szoveg: "Kéttámaszú tartó, L = 6 m: csukló A-ban, görgő B-ben. Az x = 1 m-nél 12 kN koncentrált erő, a teljes hosszon 4 kN/m egyenletes teher (eredője 24 kN a tartó közepén).",
  },
  {
    t0: T.reak,
    cim: "Reakciók a csuklóra és a görgőre írt nyomatéki egyenletből",
    szoveg: "Mindkét reakció külön egyenletből jön, a függőleges vetület marad ellenőrzésre.",
    kepletek: ["\\Mp{A} -12\\cdot 1 - 24\\cdot 3 + B\\cdot 6 = 0 \\Rightarrow B = 14\\ \\text{kN}", "\\Mp{B} A_y\\cdot 6 - 12\\cdot 5 - 24\\cdot 3 = 0 \\Rightarrow A_y = 22\\ \\text{kN}", "\\Fy 22 + 14 - 12 - 24 = 0\\ \\checkmark"],
  },
  {
    t0: T.szak,
    cim: "Szakaszok és jellegük",
    szoveg: "Egyetlen szakaszhatár: az F helye. Mindkét szakaszon egyenletes teher működik, ezért V lineáris (meredeksége −p = −4 kN/m²), M másodfokú parabola.",
  },
  {
    t0: T.epit0,
    cim: "V balról: a bal oldali erők felfelé (↑) pozitívak",
    szoveg: "Balról indulunk és végig balról számolunk. A-nál V = +22 (a reakció). Az x = 1-ig a teher 4x-et von le: V(1⁻) = 18; az F alatt 12-t ugrik: V(1⁺) = 6; onnan tovább csökken, B-nél −14 = −B.",
    kepletek: ["(\\uparrow):\\ V(x) = 22 - 4x\\ (x<1),\\qquad V(x) = 22 - 12 - 4x = 10 - 4x\\ (x>1)", "V = 0 \\Rightarrow x = 2{,}5\\ \\text{m}"],
  },
  {
    t0: 17.5,
    cim: "M balról: a bal oldali erők nyomatéka (↷ pozitív, alul húzott)",
    szoveg: "A reakció kar × erő pozitívan forgat, a terhek negatívan. A megoszló teher eredője a K-tól balra eső részre: 4x, karja x/2.",
    kepletek: ["(\\curvearrowright):\\ M(1) = 22\\cdot 1 - 4\\cdot 1\\cdot 0{,}5 = 20\\ \\text{kNm}", "M(2{,}5) = 22\\cdot 2{,}5 - 12\\cdot 1{,}5 - 4\\cdot 2{,}5\\cdot 1{,}25 = 24{,}5\\ \\text{kNm}", "M(6) = 22\\cdot 6 - 12\\cdot 5 - 24\\cdot 3 = 0\\ \\checkmark"],
  },
  {
    t0: T.tores,
    cim: "Töréspontok",
    szoveg: "Az F alatt a V ábra 12 kN-t ugrik (az erő nagysága), az M ábra törik — a törés konvex oldala az erő nyila felé néz. A tartóvégeken M = 0, mert nincs ott koncentrált nyomaték; V a végeken a reakciók.",
  },
  {
    t0: T.szelso,
    cim: "Szélsőérték: ahol V = 0",
    szoveg: "dM/dx = V, ezért az M szélsőértéke ott van, ahol a V ábra átmegy a nullán: x = 2,5 m, M_max = 24,5 kNm. Ez nem az F alatt és nem a tartó közepén van — a ZH-n ezt a helyet mindig ki kell számolni.",
    kepletek: ["V(x) = 10 - 4x = 0 \\Rightarrow x = 2{,}5\\ \\text{m},\\qquad M_{\\max} = 24{,}5\\ \\text{kNm}"],
  },
];

export default function FilmGyf2() {
  return (
    <FilmIgenybevetel
      cim="GYF‑2 · Kéttámaszú tartó — V lineáris, M parabola, a maximum ott, ahol V = 0"
      eredmeny={eredmeny("gyf2")}
      fejezetek={FEJEZETEK}
      T={T}
      hossz={34}
      abrak={["V", "M"]}
      megjegyzes="Vízszintes tartón csak függőleges terhekkel N = 0, ezért csak a V és M ábrát rajzoljuk. A bekarikázott pont a V = 0 hely és a hozzá tartozó M szélsőérték."
    />
  );
}
