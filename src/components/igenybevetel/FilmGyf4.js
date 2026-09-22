"use client";

import FilmIgenybevetel from "@/components/igenybevetel/FilmIgenybevetel";
import { eredmeny } from "@/components/igenybevetel/Modellek";

/*
 * GYF‑4 · Konzolos kéttámaszú tartó megoszló teherrel és koncentrált nyomatékkal (H09/4) — film.
 * a = 2 m, p = 4 kN/m a 0…4 m-en, A az x = 2, B az x = 6 m-nél, M = 8 kNm ↷ a jobb végen (x = 8).
 * A_y = 14 kN, B = 2 kN. V: 0 → −8 | +6 → −2 → −2 | 0; M: 0 → −8 → −3,5 (V = 0 az x = 3,5-nél) → −4 → −8 → −8, ugrás 0-ra.
 */

const T = { reak: 3.5, szak: 8, epit0: 10.5, epit1: 25.5, tores: 26, szelso: 30 };

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
    szoveg: "Szakaszhatár a teher vége (x = 4), a két támasz és a végek. 0–2 és 2–4: teher alatt (V lineáris, M parabola); 4–6 és 6–8: terheletlen (V konstans, M lineáris). A koncentrált nyomaték a jobb végen ugrást ad az M-ben.",
  },
  {
    t0: T.epit0,
    cim: "V balról (↑)",
    szoveg: "A bal konzolon kívülről: V = −4x, A-nál −8. A reakció +14-et ugrik: +6. Tovább csökken: x = 4-nél −2, és ez marad B-ig; B-nél +2-t ugrik: 0 a jobb konzolon (ott csak a nyomaték hat, erő nem).",
    kepletek: ["V(2^-) = -8,\\quad V(2^+) = +6,\\quad V(4) = -2,\\quad V(6^-) = -2,\\quad V(6^+) = 0"],
  },
  {
    t0: 18,
    cim: "M balról (↷ pozitív)",
    szoveg: "A bal konzol: M(2) = −8·1 = −8 (felül húzott). A parabola x = 4-ig: M(4) = 14·2 − 16·2 = −4. Terheletlen szakaszon lineáris: M(6) = 14·4 − 16·4 = −8. B-től a végig V = 0, tehát M konstans −8, a végen a 8 kNm ugrással zárul nullára.",
    kepletek: ["M(2) = -8,\\quad M(4) = -4,\\quad M(6) = -8,\\quad M(8^-) = -8,\\quad M(8^+) = 0"],
  },
  {
    t0: T.tores,
    cim: "Töréspontok és ugrások",
    szoveg: "A támaszoknál a V ugrik a reakció értékével, az M törik. A teher végénél (x = 4) sem ugrás, sem törés: a parabola érintőlegesen megy át az egyenesbe. A jobb végen az M ábra ugrása pontosan a koncentrált nyomaték (8 kNm).",
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
      eredmeny={eredmeny("gyf4")}
      fejezetek={FEJEZETEK}
      T={T}
      hossz={35}
      abrak={["V", "M"]}
      megjegyzes="A koncentrált nyomaték helyén az M ábra ugrik, de a V ábra nem — a két oldali érintő azonos. A jobb konzolon V = 0, ezért M konstans."
    />
  );
}
