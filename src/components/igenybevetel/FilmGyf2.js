"use client";

import FilmIgenybevetel, { epitIdo } from "@/components/igenybevetel/FilmIgenybevetel";
import { eredmeny } from "@/components/igenybevetel/Modellek";

/*
 * GYF‑2 · Kéttámaszú tartó koncentrált és megoszló teherrel — film.
 * L = 6 m, F = 12 kN az x = 1 m-nél, p = 4 kN/m. A = 22 kN, B = 14 kN.
 * V: 22 → 18 | 6 → −14 (V = 0 az x = 2,5 m-nél); M: 0 → 20 → 24,5 (max) → 0.
 * A fejezetek a K helyét követik: x = 1 m-nél (12,83 s) és x = 2,5 m-nél (16,33 s) új fejezet.
 */

const T = { reak: 3.5, szak: 8, epit0: 10.5, epit1: 24.5, tores: 25, szelso: 29 };
const e = eredmeny("gyf2");

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
    szoveg: "Egyetlen szakaszhatár: az F helye. Mindkét szakaszon egyenletes teher működik, ezért V lineáris (meredeksége −p = −4 kN/m), M másodfokú parabola. Vízszintes tartón csak függőleges terhekkel N = 0. A V és az M ábra pozitív értékei a tartó alá kerülnek.",
  },
  {
    t0: T.epit0,
    cim: "0 < x < 1: balról, csak az A reakció van a K-tól balra",
    szoveg: "Balról számolunk: a bal oldali erők felfelé (↑) pozitívak a V-hez, az óramutató szerinti (↷) forgatás pozitív az M-hez. A-nál V = +22 (a reakció), a teher 4x-et von le: V(1⁻) = 18. Az M a reakció karja szerint nő, a teher (4x, karja x/2) csökkenti.",
    kepletek: ["(\\uparrow):\\ V(x) = 22 - 4x:\\quad V(0) = 22,\\ V(1^-) = 18", "(\\curvearrowright):\\ M(x) = 22x - 2x^2:\\quad M(1) = 22 - 2 = 20\\ \\text{kNm}"],
  },
  {
    t0: epitIdo(T, e, 1),
    cim: "1 < x < 6: az F is a K-tól balra esik",
    szoveg: "Az F alatt a V ábra 12-t ugrik lefelé: V(1⁺) = 6, és tovább csökken, B-nél −14 = −B. Az M-ben az F csak törést ad; a parabola folytatódik.",
    kepletek: ["(\\uparrow):\\ V(x) = 22 - 12 - 4x = 10 - 4x:\\quad V(1^+) = 6,\\ V(6) = -14", "(\\curvearrowright):\\ M(x) = 22x - 12(x-1) - 2x^2:\\quad M(6) = 132 - 60 - 72 = 0\\ \\checkmark"],
  },
  {
    t0: epitIdo(T, e, 2.5),
    cim: "x = 2,5 m: a V átmegy a nullán — itt az M csúcsa",
    szoveg: "dM/dx = V, ezért ahol V = 0, ott M-nek szélsőértéke van. A V függvényből: 10 − 4x = 0 → x = 2,5 m. Innen a K-tól jobbra a V negatív, az M csökken.",
    kepletek: ["V = 10 - 4x = 0 \\Rightarrow x = 2{,}5\\ \\text{m}", "M(2{,}5) = 22\\cdot 2{,}5 - 12\\cdot 1{,}5 - 4\\cdot 2{,}5\\cdot 1{,}25 = 24{,}5\\ \\text{kNm}"],
  },
  {
    t0: T.tores,
    cim: "Töréspontok",
    szoveg: "Az F alatt a V ábra 12 kN-t ugrik (az erő nagysága), az M ábra törik — a törés konvex oldala az erő nyila felé néz. A tartóvégeken M = 0, mert nincs ott koncentrált nyomaték; V a végeken a reakciók.",
  },
  {
    t0: T.szelso,
    cim: "Szélsőérték: ahol V = 0",
    szoveg: "M_max = 24,5 kNm az x = 2,5 m helyen (alul húzott). Ez nem az F alatt és nem a tartó közepén van — a ZH-n ezt a helyet mindig ki kell számolni. A bekarikázott pont a V = 0 hely és a hozzá tartozó M csúcs.",
    kepletek: ["V(x) = 10 - 4x = 0 \\Rightarrow x = 2{,}5\\ \\text{m},\\qquad M_{\\max} = 24{,}5\\ \\text{kNm}"],
  },
];

export default function FilmGyf2() {
  return (
    <FilmIgenybevetel
      cim="GYF‑2 · Kéttámaszú tartó — V lineáris, M parabola, a maximum ott, ahol V = 0"
      eredmeny={e}
      fejezetek={FEJEZETEK}
      T={T}
      hossz={34}
      abrak={["V", "M"]}
      megjegyzes="Vízszintes tartón csak függőleges terhekkel N = 0, ezért csak a V és M ábrát rajzoljuk. A pozitív V-t is a tartó alá mérjük fel, mint a pozitív M-et (tankönyv 8.9. ábra); a „(↑) pozitív” csak a számítás előjelszabálya."
    />
  );
}
