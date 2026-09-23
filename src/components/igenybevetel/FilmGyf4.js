"use client";

import FilmIgenybevetel, { epitIdo } from "@/components/igenybevetel/FilmIgenybevetel";
import { eredmeny } from "@/components/igenybevetel/Modellek";

/*
 * GYF‑4 · Konzolos kéttámaszú tartó megoszló teherrel és koncentrált nyomatékkal (H09/4) — film.
 * a = 2 m, p = 4 kN/m a 0…4 m-en, A az x = 2, B az x = 6 m-nél, M = 8 kNm ↷ a jobb végen (x = 8).
 * A_y = 14 kN, B = 2 kN. V: 0 → −8 | +6 → −2 → −2 | 0; M: 0 → −8 → −3,5 (V = 0 az x = 3,5-nél) → −4 → −8 → −8, ugrás 0-ra.
 * A fejezetek a K helyét követik: x = 2 (14,25 s), x = 4 (18 s), x = 6 (21,75 s).
 */

const T = { reak: 3.5, szak: 8, epit0: 10.5, epit1: 25.5, tores: 26, szelso: 30 };
const e = eredmeny("gyf4");

const FEJEZETEK = [
  {
    t0: 0,
    cim: "A feladat",
    szoveg: "Mindkét végén konzolos kéttámaszú tartó: csukló A-ban (x = 2 m), görgő B-ben (x = 6 m). A bal konzoltól az A utáni 2 m-ig 4 kN/m (eredője 16 kN az x = 2-nél, éppen A fölött), a jobb végen 8 kNm koncentrált nyomaték az óramutató szerint.",
  },
  {
    t0: T.reak,
    cim: "Reakciók",
    szoveg: "A csuklóra írt nyomatéki egyenletben a teher eredőjének karja nulla (A fölött hat), így csak B és a koncentrált nyomaték marad. Az ↷ nyomaték az ↶ egyenletben negatív.",
    kepletek: ["\\Mp{A} B\\cdot 4 - 8 = 0 \\Rightarrow B = 2\\ \\text{kN}", "\\Fy A_y + 2 - 16 = 0 \\Rightarrow A_y = 14\\ \\text{kN}", "\\Mp{B} 16\\cdot 4 - 14\\cdot 4 - 8 = 0\\ \\checkmark"],
  },
  {
    t0: T.szak,
    cim: "Négy szakasz",
    szoveg: "Szakaszhatár a teher vége (x = 4), a két támasz és a végek. 0–2 és 2–4: teher alatt (V lineáris, M parabola); 4–6 és 6–8: terheletlen (V konstans, M lineáris). A koncentrált nyomaték a jobb végen ugrást ad az M-ben. A negatív értékek a tartó fölé kerülnek (mindhárom ábrán a + oldal alul van).",
  },
  {
    t0: T.epit0,
    cim: "C–A (0 < x < 2): a bal konzol kívülről",
    szoveg: "A K-tól balra csak a teher 4x eredője (karja x/2), reakció nincs: V negatív, M negatív (felül húzott) — mindkettő a tartó fölött. A-nál V(2⁻) = −8, M(2) = −8.",
    kepletek: ["(\\uparrow):\\ V(x) = -4x:\\quad V(2^-) = -8", "(\\curvearrowright):\\ M(x) = -2x^2:\\quad M(2) = -8\\ \\text{kNm}"],
  },
  {
    t0: epitIdo(T, e, 2),
    cim: "A után (2 < x < 4): a reakció +14-et ugraszt",
    szoveg: "A-nál a V ábra +14-et ugrik: V(2⁺) = +6, majd a teher miatt tovább csökken: x = 3,5-nél nulla (itt az M-nek lokális szélsőértéke van: −3,5), x = 4-nél −2. Az M parabola folytatódik: M(4) = −4.",
    kepletek: ["(\\uparrow):\\ V(x) = -4x + 14:\\quad V(2^+) = 6,\\ V(3{,}5) = 0,\\ V(4) = -2", "(\\curvearrowright):\\ M(x) = -2x^2 + 14(x-2):\\quad M(3{,}5) = -3{,}5,\\ M(4) = -4"],
  },
  {
    t0: epitIdo(T, e, 4),
    cim: "4 < x < 6: terheletlen szakasz",
    szoveg: "A teher véget ért: V konstans −2, M lineáris (meredeksége a V, azaz −2 kNm/m): −4-ről −8-ra csökken B-ig. A teher végénél sem ugrás, sem törés: a parabola érintőlegesen megy át az egyenesbe.",
    kepletek: ["V = -2\\ \\text{kN},\\qquad M(6) = -4 + (-2)\\cdot 2 = -8\\ \\text{kNm}"],
  },
  {
    t0: epitIdo(T, e, 6),
    cim: "B–D (6 < x < 8): a jobb konzol — csak a nyomaték hat",
    szoveg: "B-nél a V +2-t ugrik: nulla a jobb konzolon (ott erő nem hat). V = 0, tehát M konstans −8, és a végen a 8 kNm koncentrált nyomaték ugrással zárja nullára — jobbról nézve ez az egyetlen hatás.",
    kepletek: ["V = -2 + 2 = 0,\\qquad M = -8\\ (6 < x < 8^-),\\quad M(8^+) = -8 + 8 = 0"],
  },
  {
    t0: T.tores,
    cim: "Töréspontok és ugrások",
    szoveg: "A támaszoknál a V ugrik a reakció értékével, az M törik. A teher végénél (x = 4) sem ugrás, sem törés. A jobb végen az M ábra ugrása pontosan a koncentrált nyomaték (8 kNm).",
  },
  {
    t0: T.szelso,
    cim: "Szélsőérték",
    szoveg: "V = 0 az x = 3,5 m-nél: M(3,5) = −3,5 kNm — a parabola csúcsa, egy lokális szélsőérték. A legnagyobb nyomaték abszolút értékben mégis a támaszoknál és a jobb konzolon: |M| = 8 kNm. Mindenhol felül húzott a tartó.",
    kepletek: ["V(x) = 6 - 4(x-2) = 0 \\Rightarrow x = 3{,}5\\ \\text{m},\\quad M(3{,}5) = -8 + 6\\cdot 1{,}5 - 4\\cdot 1{,}5\\cdot 0{,}75 = -3{,}5\\ \\text{kNm}"],
  },
];

export default function FilmGyf4() {
  return (
    <FilmIgenybevetel
      cim="GYF‑4 · Megoszló teher és koncentrált nyomaték — ugrás az M ábrában"
      eredmeny={e}
      fejezetek={FEJEZETEK}
      T={T}
      hossz={35}
      abrak={["V", "M"]}
      megjegyzes="A koncentrált nyomaték helyén az M ábra ugrik, de a V ábra nem — a két oldali érintő azonos. A jobb konzolon V = 0, ezért M konstans. A pozitív V és M a tartó alatt, a negatív fölötte."
    />
  );
}
