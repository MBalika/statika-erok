"use client";

import FeladatFilm from "@/components/anim/FeladatFilm";
import { arany, lerp, rugo } from "@/components/anim/Idovonal";
import { Hegy, NyilA, VonalA, FeliratA, IvA, PontA } from "@/components/anim/FilmElemek";

/*
 * GYF‑B · Dinámrendszer: erők és nyomatékok együtt (tankönyv 3.10. ábra)
 * A, B, C egy egyenesen: AB = 3 m, BC = 5 m.
 * F₁ = 2 kN ↓ A-ban, F₂ = 5 kN ↑ B-ben, F₃ = 3 kN ↓ C-ben,
 * M₁ = 3 kNm ↷ (A és B között), M₂ = 12 kNm ↶ (B és C között).
 */

const OX = 90;
const OY = 200;
const L = 52; // képpont / m
const E = 9; // képpont / kN
const px = (x) => OX + x * L;

const NAR = "#e2590a";
const BORDO = "#be123c";
const LILA = "#7c3aed";
const ZOLD = "#15803d";

const FEJEZETEK = [
  {
    t0: 0,
    cim: "A dinámrendszer: három erő, két nyomaték",
    szoveg: "A tankönyv szava: az erőket és a nyomatékokat együtt dinámoknak hívjuk. Az egész egy párhuzamos erőrendszer — a nyomatékok is beleértendők. Négy részhalmaz eredőjét keressük.",
    kepletek: ["(\\underline{F}_1, \\underline{F}_2, \\underline{F}_3, M_1, M_2)"],
  },
  {
    t0: 4,
    cim: "a) Mind az öt — a vetületi egyenlet",
    szoveg: "Először az eredő típusát döntjük el. A nyomatékok a vetületi egyenletbe nem kerülnek be. Az összeg nulla: az eredő nem lehet erő.",
    kepletek: ["(\\underline{F}_1, \\underline{F}_2, \\underline{F}_3, M_1, M_2) \\ekv \\mathcal{D}", "\\Fy -2 + 5 - 3 = 0\\ \\text{kN}"],
  },
  {
    t0: 8,
    cim: "a) Nyomaték az A pontra — egyensúly",
    szoveg: "Az A pont F₁ hatásvonalán van, ezért F₁ karja nulla. A koncentrált nyomatékok előjelesen jönnek: M₁ −3, M₂ +12. Az összeg nulla — az erőrendszer egyensúlyi.",
    kepletek: ["\\Mp{A} 0 + 5\\cdot 3 - 3\\cdot 8 - 3 + 12 = 0\\ \\text{kNm}", "(\\underline{F}_1, \\underline{F}_2, \\underline{F}_3, M_1, M_2) \\ekv \\underline{O}"],
  },
  {
    t0: 12.5,
    cim: "b) Csak a három erő — nyomaték az eredő",
    szoveg: "A nyomatékok nélkül az erőösszeg még mindig nulla, de a B-re vett nyomaték már nem. Az eredő egy −9 kNm-es nyomaték, az óramutató irányába forgat.",
    kepletek: ["\\Fy -2 + 5 - 3 = 0", "\\Mp{B} 2\\cdot 3 + 0 - 3\\cdot 5 = -9\\ \\text{kNm}\\ (\\curvearrowright)", "(\\underline{F}_1, \\underline{F}_2, \\underline{F}_3) \\ekv M_B"],
  },
  {
    t0: 17,
    cim: "c) F₁, F₃ és M₂ — az eredő egy erő",
    szoveg: "Két lefelé mutató erő és egy nyomaték: az összeg −5 kN, tehát az eredő egy lefelé mutató 5 kN-os erő. A helyét a C pontra felírt nyomatéki egyenletből kapjuk: x_R a C-től jobbra pozitív.",
    kepletek: ["\\Fy -2 - 3 = -5\\ \\text{kN}\\ (\\downarrow)", "(\\underline{F}_1, \\underline{F}_3, M_2) \\ekv \\underline{R}"],
  },
  {
    t0: 21,
    cim: "c) Hol van az eredő?",
    szoveg: "Bal oldalon az erőrendszer nyomatéka C-re, jobb oldalon az eredőé: −5·x_R. A negatív x_R azt jelenti, hogy az eredő a C-től balra, 5,6 m-re van — a B-től 0,6 m-rel balra.",
    kepletek: ["\\Mp{C} 2\\cdot 8 + 0 + 12 = -5\\cdot x_R\\ \\Rightarrow\\ x_R = -5,6\\ \\text{m}"],
  },
  {
    t0: 25.5,
    cim: "d) F₂ és M₁ — az eredő egy erő",
    szoveg: "Egyetlen erő és egy nyomaték: az eredő ugyanakkora erő, mint F₂, csak eltolva. A B pontra írt nyomatéki egyenletben F₂ karja nulla.",
    kepletek: ["\\Fy +5 = +5\\ \\text{kN}\\ (\\uparrow)", "\\Mp{B} 0 - 3 = 5\\cdot x_R\\ \\Rightarrow\\ x_R = -0,6\\ \\text{m}"],
  },
  {
    t0: 29.5,
    cim: "Nem véletlen: ugyanott",
    szoveg: "A c) és a d) eredője ugyanazon a hatásvonalon áll, ellentétes irányban, azonos nagysággal. A két részrendszer együtt az a) eset — egyensúly —, tehát a részeredőik is kiejtik egymást.",
    kepletek: ["\\underline{R}_c = -\\underline{R}_d,\\quad x_{R} = 2,4\\ \\text{m az A-tól}"],
  },
];

const F1 = { x: 0, F: -2, nev: "F₁ = 2 kN" };
const F2 = { x: 3, F: 5, nev: "F₂ = 5 kN" };
const F3 = { x: 8, F: -3, nev: "F₃ = 3 kN" };

function Ero({ x, F, nev, u = 1, opacitas = 1, szin = NAR, hegy = "dn-ero", vastag = 3, felirat = true, balra = false }) {
  const y1 = F < 0 ? OY + 6 : OY - 6;
  const y2 = F < 0 ? OY + 6 + Math.abs(F) * E : OY - 6 - Math.abs(F) * E;
  return (
    <g>
      <NyilA x1={px(x)} y1={y1} x2={px(x)} y2={y2} u={u} szin={szin} hegy={hegy} vastag={vastag} opacitas={opacitas} />
      {felirat && (
        <FeliratA x={px(x) + (balra ? -8 : 8)} y={y2 + 4} szin={szin} meret={11.5} opacitas={opacitas * u} horgony={balra ? "end" : "start"}>
          {nev}
        </FeliratA>
      )}
    </g>
  );
}

function Nyomatek({ x, cw, nev, u = 1, opacitas = 1 }) {
  return (
    <g>
      <IvA cx={px(x)} cy={OY - 40} r={20} kezdoFok={cw ? 180 : 0} vegFok={cw ? 0 : 180} u={u} szin={BORDO} vastag={2.6} hegy="dn-m" opacitas={opacitas} />
      <FeliratA x={px(x)} y={OY - 70} szin={BORDO} meret={11.5} opacitas={opacitas * u}>
        {nev}
      </FeliratA>
    </g>
  );
}

function Rajz(t) {
  const alapU = [0, 1, 2, 3, 4].map((i) => arany(t, 0.4 + i * 0.5, 0.9 + i * 0.5));
  // részhalmazok kiemelése
  const bU = arany(t, 12.6, 13.2); // M1, M2 halványul
  const cU = arany(t, 17.1, 17.7); // F2, M1 halványul, M2 vissza
  const dU = arany(t, 25.6, 26.2); // csak F2, M1
  const vegU = arany(t, 29.6, 30.2);

  const halv = (nev) => {
    let o = 1;
    if (nev === "M1" || nev === "M2") o = lerp(1, 0.15, bU);
    if (nev === "M2") o = lerp(o, 1, cU);
    if (nev === "F2") o = lerp(1, 0.15, cU);
    if (nev === "M1") o = lerp(o, 0.15, cU);
    if (dU > 0) {
      if (nev === "F2" || nev === "M1") o = lerp(o, 1, dU);
      else o = lerp(o, 0.15, dU);
    }
    if (vegU > 0) o = lerp(o, 0.15, vegU);
    return o;
  };

  // a) eredmény: egyensúly felirat
  const aKesz = arany(t, 10.6, 11.2);
  // b) nyomaték-eredő B-ben
  const bIv = arany(t, 14.6, 15.6);
  // c) R a C pontban, majd elcsúszik
  const cR = arany(t, 18.6, 19.4);
  const cCsusz = arany(t, 22.2, 23.6, rugo);
  const cFel = arany(t, 23.7, 24.3);
  const cX = lerp(8, 2.4, cCsusz);
  // d) R a B-ben, majd elcsúszik
  const dR = arany(t, 26.6, 27.4);
  const dCsusz = arany(t, 28.0, 29.0, rugo);
  const dX = lerp(3, 2.4, dCsusz);

  const pont = (x, nev) => (
    <g key={nev}>
      <line x1={px(x) - 5} y1={OY - 5} x2={px(x) + 5} y2={OY + 5} stroke="#1d3c48" strokeWidth="1.4" />
      <line x1={px(x) - 5} y1={OY + 5} x2={px(x) + 5} y2={OY - 5} stroke="#1d3c48" strokeWidth="1.4" />
      <text x={px(x) - 9} y={OY - 10} textAnchor="end" fontSize="12.5" fontWeight="650" fill="#1d3c48">{nev}</text>
    </g>
  );

  return (
    <svg viewBox="0 0 600 330" className="abra w-full select-none">
      <defs>
        <Hegy id="dn-ero" szin={NAR} />
        <Hegy id="dn-m" szin={BORDO} />
        <Hegy id="dn-r" szin={LILA} />
        <Hegy id="dn-mer" szin="#94a3b8" />
      </defs>

      <line x1={px(0) - 40} y1={OY} x2={px(8) + 60} y2={OY} stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="6 4" />
      {pont(0, "A")}
      {pont(3, "B")}
      {pont(8, "C")}
      <line x1={px(0)} y1={OY + 70} x2={px(3)} y2={OY + 70} stroke="#94a3b8" strokeWidth="1" markerStart="url(#dn-mer)" markerEnd="url(#dn-mer)" />
      <line x1={px(3)} y1={OY + 70} x2={px(8)} y2={OY + 70} stroke="#94a3b8" strokeWidth="1" markerStart="url(#dn-mer)" markerEnd="url(#dn-mer)" />
      <text x={px(1.5)} y={OY + 86} textAnchor="middle" fontSize="11.5" fill="#64748b">3 m</text>
      <text x={px(5.5)} y={OY + 86} textAnchor="middle" fontSize="11.5" fill="#64748b">5 m</text>

      <Ero {...F1} u={alapU[0]} opacitas={halv("F1")} />
      <Ero {...F2} u={alapU[1]} opacitas={halv("F2")} />
      <Ero {...F3} u={alapU[2]} opacitas={halv("F3")} />
      <Nyomatek x={1.5} cw nev="M₁ = 3 kNm" u={alapU[3]} opacitas={halv("M1")} />
      <Nyomatek x={5.5} cw={false} nev="M₂ = 12 kNm" u={alapU[4]} opacitas={halv("M2")} />

      {/* a) egyensúly */}
      <g opacity={aKesz * (1 - bU)}>
        <rect x={px(1.6)} y={OY + 100} width={250} height={26} rx="8" fill="#dcfce7" stroke={ZOLD} strokeWidth="1" />
        <text x={px(1.6) + 125} y={OY + 118} textAnchor="middle" fontSize="12.5" fontWeight="650" fill={ZOLD}>
          ΣF = 0 és ΣM = 0 → egyensúly
        </text>
      </g>

      {/* b) M_B = −9 kNm ↷ a B pont körül */}
      {bU > 0.5 && cU < 0.5 && (
        <g>
          <IvA cx={px(3)} cy={OY} r={34} kezdoFok={150} vegFok={-60} u={bIv} szin={BORDO} vastag={3.2} hegy="dn-m" />
          <FeliratA x={px(3) + 44} y={OY + 58} szin={BORDO} meret={12.5} opacitas={bIv} horgony="start">
            M<tspan fontSize="9" dy="3">B</tspan><tspan dy="-3"> = −9 kNm ↷ — az eredő</tspan>
          </FeliratA>
        </g>
      )}

      {/* c) R = 5 kN ↓ a C-ből x_R = −5,6 m-re */}
      {cU > 0.5 && dU < 0.5 && (
        <g>
          {cCsusz > 0.02 && <Ero x={8} F={-5} nev="" u={1} opacitas={0.2} szin={LILA} hegy="dn-r" vastag={4} felirat={false} />}
          <Ero x={cX} F={-5} nev="R = 5 kN ↓" u={cR} szin={LILA} hegy="dn-r" vastag={4} />
          <g opacity={cFel}>
            <VonalA x1={px(8)} y1={OY + 110} x2={px(2.4)} y2={OY + 110} szin={LILA} vastag={1.3} szaggatott={false} />
            <PontA x={px(2.4)} y={OY} r={4.5} szin={LILA} />
            <FeliratA x={px(5.2)} y={OY + 126} szin={LILA} meret={12.5}>xᵣ = −5,6 m (C-től balra)</FeliratA>
          </g>
        </g>
      )}

      {/* d) R = 5 kN ↑ a B-ből x_R = −0,6 m-re */}
      {dU > 0.5 && (
        <g>
          {dCsusz > 0.02 && <Ero x={3} F={5} nev="" u={1} opacitas={0.2} szin={LILA} hegy="dn-r" vastag={4} felirat={false} />}
          <Ero x={dX} F={5} nev="R = 5 kN ↑" u={dR} szin={LILA} hegy="dn-r" vastag={4} balra />
          <g opacity={arany(t, 29.0, 29.4)}>
            <VonalA x1={px(3)} y1={OY + 110} x2={px(2.4)} y2={OY + 110} szin={LILA} vastag={1.3} szaggatott={false} />
            <PontA x={px(2.4)} y={OY} r={4.5} szin={LILA} />
            <FeliratA x={px(2.7)} y={OY + 126} szin={LILA} meret={12.5}>xᵣ = −0,6 m (B-től balra)</FeliratA>
          </g>
          {/* a c) eredője halványan, hogy látszódjon: ugyanott */}
          <Ero x={2.4} F={-5} nev="R a c)-ből" u={vegU} opacitas={0.55} szin={LILA} hegy="dn-r" vastag={4} />
        </g>
      )}
    </svg>
  );
}

export default function FilmDinam() {
  return (
    <FeladatFilm
      cim="GYF‑B · Dinámrendszer: erők és nyomatékok együtt"
      hossz={32}
      fejezetek={FEJEZETEK}
      rajz={Rajz}
      megjegyzes="A halvány elemek nem tartoznak az éppen vizsgált részhalmazba. A koncentrált nyomatékok csak a nyomatéki egyenletbe kerülnek."
    />
  );
}
