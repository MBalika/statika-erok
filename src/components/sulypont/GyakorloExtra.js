"use client";

import GyakorloDoboz from "@/components/GyakorloDoboz";
import { M, MB } from "@/components/ui/Keplet";
import { sz } from "@/lib/szamok";

const egesz = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
const lepes = (min, max, l) => min + l * egesz(0, Math.round((max - min) / l));
const PI = Math.PI;

const rendszer = (
  <span className="text-[13px] text-petrol-500">
    {" "}
    (Koordináta-rendszer: az origó az idom <strong>jobb felső sarka</strong>, y balra, z lefelé.)
  </span>
);

/* ---------- 6. Aszimmetrikus I-szelvény ---------- */

function iSzelvenyFeladat() {
  const B1 = lepes(100, 300, 20);
  const t1 = lepes(10, 30, 5);
  const B2 = lepes(100, 300, 20);
  const t2 = lepes(10, 30, 5);
  const hw = lepes(150, 400, 10);
  const tw = lepes(8, 20, 2);
  const A1 = B1 * t1, z1 = t1 / 2;
  const A2 = tw * hw, z2 = t1 + hw / 2;
  const A3 = B2 * t2, z3 = t1 + hw + t2 / 2;
  const A = A1 + A2 + A3;
  const Sy = A1 * z1 + A2 * z2 + A3 * z3;
  const zs = Sy / A;
  return {
    szoveg: (
      <p>
        Egy I-szelvény felső öve <M>{`${B1}\\times${t1}`}</M> mm, alsó öve <M>{`${B2}\\times${t2}`}</M> mm, a gerince{" "}
        <M>{`${tw}\\times${hw}`}</M> mm. Mekkora a terület, és milyen mélyen van a súlypont a felső éltől?
      </p>
    ),
    sugo: <p>Három téglalap egymás alatt. A szimmetriatengely függőleges, tehát csak z_S kell — de a két öv nem egyforma, ezért nem a felezőmagasság!</p>,
    mezok: [
      { id: "a", cimke: "A", egyseg: "mm²", helyes: A, tizedes: 0 },
      { id: "zs", cimke: "zₛ (a felső éltől)", egyseg: "mm", helyes: zs, tizedes: 2 },
    ],
    megoldas: (
      <>
        <MB>{`A_1 = ${sz(A1, 0)},\\ z_1 = ${sz(z1, 1)};\\quad A_2 = ${sz(A2, 0)},\\ z_2 = ${t1} + \\tfrac{${hw}}{2} = ${sz(z2, 1)};\\quad A_3 = ${sz(A3, 0)},\\ z_3 = ${t1 + hw} + \\tfrac{${t2}}{2} = ${sz(z3, 1)}`}</MB>
        <MB>{`A = ${sz(A, 0)}\\ \\text{mm}^2,\\qquad S_y = ${sz(Sy, 0)}\\ \\text{mm}^3`}</MB>
        <MB>{`z_S = \\frac{S_y}{A} = ${sz(zs, 2)}\\ \\text{mm}\\quad(\\text{a felezőmagasság: } ${sz((t1 + hw + t2) / 2, 1)})`}</MB>
        <p className="mt-2 text-[13px] text-petrol-600">
          A súlypont a {A1 > A3 ? "nagyobb felső öv felé, a felezőmagasság fölé" : A1 < A3 ? "nagyobb alsó öv felé, a felezőmagasság alá" : "felezőmagasságra (egyforma övek)"} kerül.
        </p>
      </>
    ),
  };
}

/* ---------- 7. U-szelvény ---------- */

function uSzelvenyFeladat() {
  const B = lepes(100, 300, 10);
  const H = lepes(80, 250, 10);
  const t = lepes(8, 30, 2);
  const nyitottFel = Math.random() < 0.5; // nyílása felfelé (talp alul) vagy lefelé
  // szárak: t × (H − t), talp: B × t
  const A1 = t * (H - t);
  const A2 = B * t;
  const A = 2 * A1 + A2;
  const z1 = nyitottFel ? (H - t) / 2 : t + (H - t) / 2;
  const z2 = nyitottFel ? H - t / 2 : t / 2;
  const zs = (2 * A1 * z1 + A2 * z2) / A;
  return {
    szoveg: (
      <p>
        Egy U-szelvény <M>{`${B}`}</M> mm széles, <M>{`${H}`}</M> mm magas, a falvastagsága mindenütt{" "}
        <M>{`t = ${t}`}</M> mm. A nyílása <strong>{nyitottFel ? "felfelé" : "lefelé"}</strong> néz (a talp{" "}
        {nyitottFel ? "alul" : "felül"} van). Milyen mélyen van a súlypont a felső éltől?{rendszer}
      </p>
    ),
    sugo: <p>Két egyforma szár és egy talp. A szimmetria miatt y_S = B/2, csak z_S kell. Vigyázz, a szárak magassága H − t!</p>,
    mezok: [{ id: "zs", cimke: "zₛ (a felső éltől)", egyseg: "mm", helyes: zs, tizedes: 2 }],
    megoldas: (
      <>
        <MB>{`A_{szár} = ${t}\\cdot ${H - t} = ${sz(A1, 0)},\\quad z_{szár} = ${sz(z1, 1)};\\qquad A_{talp} = ${B}\\cdot ${t} = ${sz(A2, 0)},\\quad z_{talp} = ${sz(z2, 1)}`}</MB>
        <MB>{`z_S = \\frac{2\\cdot ${sz(A1, 0)}\\cdot ${sz(z1, 1)} + ${sz(A2, 0)}\\cdot ${sz(z2, 1)}}{${sz(A, 0)}} = ${sz(zs, 2)}\\ \\text{mm}`}</MB>
        <p className="mt-2 text-[13px] text-petrol-600">A súlypont a talp felé tolódik — {nyitottFel ? "lefelé" : "felfelé"} a felezőmagasságtól ({sz(H / 2, 1)} mm).</p>
      </>
    ),
  };
}

/* ---------- 8. Kör alakú lyuk ---------- */

function korLyukFeladat() {
  const B = lepes(160, 400, 20);
  const H = lepes(120, 300, 20);
  const r = lepes(20, Math.min(B, H) / 4, 5);
  const y0 = lepes(r + 10, B - r - 10, 10);
  const z0 = lepes(r + 10, H - r - 10, 10);
  const A1 = B * H;
  const A2 = r * r * PI;
  const A = A1 - A2;
  const ys = (A1 * (B / 2) - A2 * y0) / A;
  const zs = (A1 * (H / 2) - A2 * z0) / A;
  return {
    szoveg: (
      <p>
        Egy <M>{`${B}\\times${H}`}</M> mm-es lemezből <M>{`r = ${r}`}</M> mm sugarú kört vágunk ki, a kör középpontja az
        origótól <M>{`y_0 = ${y0}`}</M> mm-re balra és <M>{`z_0 = ${z0}`}</M> mm-re lefelé van. Hol a lyukas lemez súlypontja?{rendszer}
      </p>
    ),
    sugo: <p>Teljes téglalap mínusz kör. A kör súlypontja a középpontja — ez a legkényelmesebb kivonásos feladat.</p>,
    mezok: [
      { id: "ys", cimke: "yₛ", egyseg: "mm", helyes: ys, tizedes: 2 },
      { id: "zs", cimke: "zₛ", egyseg: "mm", helyes: zs, tizedes: 2 },
    ],
    megoldas: (
      <>
        <MB>{`A_2 = ${r}^2\\pi = ${sz(A2, 1)}\\ \\text{mm}^2,\\qquad A = ${sz(A1, 0)} - ${sz(A2, 1)} = ${sz(A, 1)}\\ \\text{mm}^2`}</MB>
        <MB>{`y_S = \\frac{${sz(A1, 0)}\\cdot ${sz(B / 2, 0)} - ${sz(A2, 1)}\\cdot ${y0}}{${sz(A, 1)}} = ${sz(ys, 2)}\\ \\text{mm}`}</MB>
        <MB>{`z_S = \\frac{${sz(A1, 0)}\\cdot ${sz(H / 2, 0)} - ${sz(A2, 1)}\\cdot ${z0}}{${sz(A, 1)}} = ${sz(zs, 2)}\\ \\text{mm}`}</MB>
      </>
    ),
  };
}

/* ---------- 9. Háromszög három csúccsal + téglalap ---------- */

function haromszogFeladat() {
  const y1 = lepes(0, 60, 10), z1 = lepes(0, 40, 10);
  const y2 = lepes(120, 260, 10), z2 = lepes(0, 60, 10);
  const y3 = lepes(20, 200, 10), z3 = lepes(120, 240, 10);
  const A = Math.abs((y2 - y1) * (z3 - z1) - (y3 - y1) * (z2 - z1)) / 2;
  const ys = (y1 + y2 + y3) / 3;
  const zs = (z1 + z2 + z3) / 3;
  return {
    szoveg: (
      <p>
        Egy háromszög csúcsai: <M>{`(${y1};\\ ${z1})`}</M>, <M>{`(${y2};\\ ${z2})`}</M>, <M>{`(${y3};\\ ${z3})`}</M> mm
        (y; z sorrendben). Mekkora a területe, és hol a súlypontja?
      </p>
    ),
    sugo: (
      <p>
        Általános háromszögnél a súlypont a csúcsok koordinátáinak <em>átlaga</em>; a terület a két oldalvektor
        „kereszt­szorzatának” fele: <M>{"A = \\tfrac12|(y_2-y_1)(z_3-z_1) - (y_3-y_1)(z_2-z_1)|"}</M>.
      </p>
    ),
    mezok: [
      { id: "a", cimke: "A", egyseg: "mm²", helyes: A, tizedes: 0 },
      { id: "ys", cimke: "yₛ", egyseg: "mm", helyes: ys, tizedes: 2 },
      { id: "zs", cimke: "zₛ", egyseg: "mm", helyes: zs, tizedes: 2 },
    ],
    megoldas: (
      <>
        <MB>{`A = \\tfrac12\\left|(${y2} - ${y1})(${z3} - ${z1}) - (${y3} - ${y1})(${z2} - ${z1})\\right| = ${sz(A, 0)}\\ \\text{mm}^2`}</MB>
        <MB>{`y_S = \\frac{${y1} + ${y2} + ${y3}}{3} = ${sz(ys, 2)},\\qquad z_S = \\frac{${z1} + ${z2} + ${z3}}{3} = ${sz(zs, 2)}\\ \\text{mm}`}</MB>
        <p className="mt-2 text-[13px] text-petrol-600">A csúcsátlag minden háromszögre igaz — a derékszögű háromszög „harmadolós” szabálya ennek a speciális esete.</p>
      </>
    ),
  };
}


/* ---------- 10. Statikai nyomaték eltolt tengelyre ---------- */

function eltolasFeladat() {
  const A = lepes(1000, 8000, 100);
  const ys = lepes(20, 150, 5);
  const zs = lepes(20, 150, 5);
  const y0 = lepes(-60, 200, 10);
  const z0 = lepes(-60, 200, 10);
  const Sy1 = zs * A; // S_y' = z_S' A
  const Sz1 = ys * A;
  const Sy2 = Sy1 - z0 * A; // S_y'' = S_y' − z_0 A
  const Sz2 = Sz1 - y0 * A;
  const tag = (v) => `${v < 0 ? "+" : "-"} ${sz(Math.abs(v), 0)}`;
  if (Math.random() < 0.5) {
    return {
      szoveg: (
        <p>
          Egy síkidom területe <M>{`A = ${sz(A, 0)}`}</M> mm², súlypontja az <M>{"O'"}</M> koordináta-rendszerben{" "}
          <M>{`(y_S';\\ z_S') = (${ys};\\ ${zs})`}</M> mm. Mekkora az idom statikai nyomatéka az{" "}
          <M>{"O''"}</M> rendszer tengelyeire, ha <M>{"O''"}</M> origója az <M>{"O'"}</M> rendszerben{" "}
          <M>{`(y_0;\\ z_0) = (${y0};\\ ${z0})`}</M> mm-nél van? (y balra, z lefelé; a vesszős tengelyek egymással párhuzamosak.)
        </p>
      ),
      sugo: (
        <p>
          Kétféleképpen is mehet: <M>{"S_{y'} = z_S' A"}</M>, majd eltolás: <M>{"S_{y''} = S_{y'} - z_0 A"}</M> —
          vagy rögtön a súlypont új koordinátájával: <M>{"S_{y''} = (z_S' - z_0)\\,A"}</M>. Az eredmény ugyanaz.
        </p>
      ),
      mezok: [
        { id: "sy", cimke: "Sy″ (az y″ tengelyre)", egyseg: "mm³", helyes: Sy2, tizedes: 0 },
        { id: "sz", cimke: "Sz″ (a z″ tengelyre)", egyseg: "mm³", helyes: Sz2, tizedes: 0 },
      ],
      megoldas: (
        <>
          <MB>{`S_{y'} = z_S' A = ${zs}\\cdot ${sz(A, 0)} = ${sz(Sy1, 0)}\\ \\text{mm}^3,\\qquad S_{z'} = y_S' A = ${ys}\\cdot ${sz(A, 0)} = ${sz(Sz1, 0)}\\ \\text{mm}^3`}</MB>
          <MB>{`S_{y''} = S_{y'} - z_0 A = ${sz(Sy1, 0)} ${tag(z0)}\\cdot ${sz(A, 0)} = ${sz(Sy2, 0)}\\ \\text{mm}^3`}</MB>
          <MB>{`S_{z''} = S_{z'} - y_0 A = ${sz(Sz1, 0)} ${tag(y0)}\\cdot ${sz(A, 0)} = ${sz(Sz2, 0)}\\ \\text{mm}^3`}</MB>
          <p className="mt-2 text-[13px] text-petrol-600">
            Ellenőrzés: a súlypont az új rendszerben <M>{`(${sz(ys - y0, 0)};\\ ${sz(zs - z0, 0)})`}</M>, és{" "}
            <M>{`${sz(zs - z0, 0)}\\cdot ${sz(A, 0)} = ${sz(Sy2, 0)}`}</M> — a statikai nyomaték az eltolás × terület szorzatával változott, a pont nem mozdult.
          </p>
        </>
      ),
    };
  }
  return {
    szoveg: (
      <p>
        Egy <M>{`A = ${sz(A, 0)}`}</M> mm² területű síkidom statikai nyomatékai az <M>{"O'"}</M> rendszerben:{" "}
        <M>{`S_{y'} = ${sz(Sy1, 0)}`}</M> mm³, <M>{`S_{z'} = ${sz(Sz1, 0)}`}</M> mm³. Hol a súlypont? Mekkora lesz{" "}
        <M>{"S_{y''}"}</M>, ha az origót az <M>{"O'"}</M>-ben <M>{`(y_0;\\ z_0) = (${y0};\\ ${z0})`}</M> mm-be toljuk?
      </p>
    ),
    sugo: (
      <p>
        A súlypont definíciója: <M>{"0 = S_{y'} - z_S' A"}</M>, innen <M>{"z_S' = S_{y'}/A"}</M>. Az eltolásnál{" "}
        <M>{"S_{y''} = S_{y'} - z_0 A"}</M>.
      </p>
    ),
    mezok: [
      { id: "ys", cimke: "yₛ′", egyseg: "mm", helyes: ys, tizedes: 1 },
      { id: "zs", cimke: "zₛ′", egyseg: "mm", helyes: zs, tizedes: 1 },
      { id: "sy", cimke: "Sy″", egyseg: "mm³", helyes: Sy2, tizedes: 0 },
    ],
    megoldas: (
      <>
        <MB>{`z_S' = \\frac{S_{y'}}{A} = \\frac{${sz(Sy1, 0)}}{${sz(A, 0)}} = ${zs}\\ \\text{mm},\\qquad y_S' = \\frac{S_{z'}}{A} = \\frac{${sz(Sz1, 0)}}{${sz(A, 0)}} = ${ys}\\ \\text{mm}`}</MB>
        <MB>{`S_{y''} = S_{y'} - z_0 A = ${sz(Sy1, 0)} ${tag(z0)}\\cdot ${sz(A, 0)} = ${sz(Sy2, 0)}\\ \\text{mm}^3`}</MB>
        <p className="mt-2 text-[13px] text-petrol-600">
          Ha az origót éppen a súlypontba tolnánk (<M>{`z_0 = ${zs}`}</M>), akkor <M>{"S_{y''} = 0"}</M> lenne: ez a súlyponti tengely.
        </p>
      </>
    ),
  };
}

/* ---------- 11. Súlypontból statikai nyomaték ---------- */

function sulypontNyomatekFeladat() {
  const b1 = lepes(60, 240, 20);
  const h1 = lepes(20, 60, 10);
  const b2 = lepes(20, 100, 10);
  const h2 = lepes(60, 200, 10);
  // felső téglalap b1×h1 (jobb felső sarok az origó), alatta a jobb élhez igazítva b2×h2
  const A1 = b1 * h1, z1 = h1 / 2;
  const A2 = b2 * h2, z2 = h1 + h2 / 2;
  const A = A1 + A2;
  const Sy = A1 * z1 + A2 * z2;
  const zs = Sy / A;
  return {
    szoveg: (
      <p>
        Egy idom két téglalapból áll: felül egy <M>{`${b1}\\times${h1}`}</M> mm-es, alatta — a jobb élhez igazítva — egy{" "}
        <M>{`${b2}\\times${h2}`}</M> mm-es (szélesség × magasság). Mekkora a terület, a <strong>felső élre</strong> (az y tengelyre)
        vett statikai nyomaték, és milyen mélyen van a súlypont?{rendszer}
      </p>
    ),
    sugo: (
      <p>
        <M>{"S_y = \\sum A_i z_i"}</M>, ahol <M>{"z_i"}</M> a részek súlypontjának mélysége a felső éltől. Az alsó téglalap közepe{" "}
        <M>{`${h1} + ${h2}/2`}</M> mélyen van. A végén nézd meg: a súlyponti tengelyre mennyi jönne ki?
      </p>
    ),
    mezok: [
      { id: "a", cimke: "A", egyseg: "mm²", helyes: A, tizedes: 0 },
      { id: "sy", cimke: "Sy (a felső élre)", egyseg: "mm³", helyes: Sy, tizedes: 0 },
      { id: "zs", cimke: "zₛ", egyseg: "mm", helyes: zs, tizedes: 2 },
    ],
    megoldas: (
      <>
        <MB>{`A_1 = ${b1}\\cdot ${h1} = ${sz(A1, 0)},\\ z_1 = ${sz(z1, 1)};\\qquad A_2 = ${b2}\\cdot ${h2} = ${sz(A2, 0)},\\ z_2 = ${h1} + \\tfrac{${h2}}{2} = ${sz(z2, 1)}`}</MB>
        <MB>{`A = ${sz(A, 0)}\\ \\text{mm}^2,\\qquad S_y = ${sz(A1, 0)}\\cdot ${sz(z1, 1)} + ${sz(A2, 0)}\\cdot ${sz(z2, 1)} = ${sz(Sy, 0)}\\ \\text{mm}^3`}</MB>
        <MB>{`z_S = \\frac{S_y}{A} = ${sz(zs, 2)}\\ \\text{mm}`}</MB>
        <MB>{`\\text{A súlyponti tengelyre: } S = A_1(z_1 - z_S) + A_2(z_2 - z_S) = ${sz(A1 * (z1 - zs), 0)} ${A2 * (z2 - zs) < 0 ? "-" : "+"} ${sz(Math.abs(A2 * (z2 - zs)), 0)} = 0`}</MB>
        <p className="mt-2 text-[13px] text-petrol-600">
          Tanulság: a felső élre a statikai nyomaték <M>{`${sz(Sy, 0)}`}</M>, a súlyponton átmenő tengelyre <strong>nulla</strong> — ez a súlypont definíciója (tankönyv 9.14). Ugyanez fordítva: <M>{"S_y = z_S A"}</M>.
        </p>
      </>
    ),
  };
}

/* ---------- 12. Félkörös idom átmérővel megadva ---------- */

function felkorAtmeroFeladat() {
  const D = lepes(40, 200, 10);
  const h = lepes(20, 160, 10);
  const r = D / 2;
  if (Math.random() < 0.4) {
    // egyetlen kör alakú idom, átmérővel: félkör vagy negyedkör
    const negyed = Math.random() < 0.5;
    const A = negyed ? (D * D * PI) / 16 : (D * D * PI) / 8;
    const e = (2 * D) / (3 * PI);
    return {
      szoveg: (
        <p>
          Egy {negyed ? "negyedkör" : "félkör"} <strong>átmérője</strong> <M>{`D = ${D}`}</M> mm (tehát a sugara <M>{"R = D/2"}</M>).
          Mekkora a területe, és milyen messze van a súlypontja {negyed ? "az egyik egyenes élétől" : "az egyenes élétől (az átmérőtől)"}?
        </p>
      ),
      sugo: (
        <p>
          A tankönyv 9.4. ábrája átmérővel: félkör <M>{"D^2\\pi/8"}</M>, negyedkör <M>{"D^2\\pi/16"}</M>. A súlypont az egyenes éltől{" "}
          <M>{"4R/3\\pi = 2D/3\\pi \\approx 0{,}2122\\,D"}</M> — a 424-es mozdony: <M>{"4/3\\pi \\approx 0{,}4244"}</M>, de <em>sugárral</em>.
        </p>
      ),
      mezok: [
        { id: "a", cimke: "A", egyseg: "mm²", helyes: A, tizedes: 1 },
        { id: "e", cimke: "a súlypont távolsága az egyenes éltől", egyseg: "mm", helyes: e, tizedes: 2 },
      ],
      megoldas: (
        <>
          <MB>{`R = \\frac{D}{2} = ${sz(r, 0)}\\ \\text{mm},\\qquad A = \\frac{D^2\\pi}{${negyed ? 16 : 8}} = \\frac{${D}^2\\pi}{${negyed ? 16 : 8}} = \\frac{R^2\\pi}{${negyed ? 4 : 2}} = ${sz(A, 1)}\\ \\text{mm}^2`}</MB>
          <MB>{`e = \\frac{4R}{3\\pi} = \\frac{4\\cdot ${sz(r, 0)}}{3\\pi} = \\frac{2D}{3\\pi} = ${sz(e, 2)}\\ \\text{mm}`}</MB>
          <p className="mt-2 text-[13px] text-petrol-600">
            {negyed
              ? "Negyedkörnél ugyanez a távolság mindkét egyenes éltől (a kör középpontjától mérve) — a súlypont a szögfelezőn van."
              : "Félkörnél a súlypont a szimmetriatengelyen, az átmérőtől e távolságra, a domború oldal felé."}{" "}
            Ha D-t sugárnak nézed, a terület a négyszeresére, a távolság a kétszeresére nő.
          </p>
        </>
      ),
    };
  }
  const A1 = D * h, z1 = h / 2;
  const A2 = (D * D * PI) / 8;
  const e = (2 * D) / (3 * PI); // 4r/3π = 2D/3π
  const z2 = h + e;
  const A = A1 + A2;
  const Sy = A1 * z1 + A2 * z2;
  const zs = Sy / A;
  return {
    szoveg: (
      <p>
        Egy <M>{`D = ${D}`}</M> mm <strong>átmérőjű</strong> félkör domború oldalával lefelé egy <M>{`${D}\\times${h}`}</M> mm-es
        téglalap alsó éléhez illeszkedik (az idom „U”-szerű, lekerekített aljú). Mekkora a terület, és milyen mélyen van a súlypont
        a felső éltől?{rendszer}
      </p>
    ),
    sugo: (
      <p>
        Vigyázz: <M>{"D"}</M> az átmérő, a sugár <M>{`R = D/2 = ${r}`}</M>. A félkör területe <M>{"R^2\\pi/2 = D^2\\pi/8"}</M>, a
        súlypontja az átmérőtől <M>{"4R/3\\pi = 2D/3\\pi"}</M>-re van — itt lefelé, a téglalap alsó éle alatt.
      </p>
    ),
    mezok: [
      { id: "a", cimke: "A", egyseg: "mm²", helyes: A, tizedes: 0 },
      { id: "zs", cimke: "zₛ (a felső éltől)", egyseg: "mm", helyes: zs, tizedes: 2 },
    ],
    megoldas: (
      <>
        <MB>{`A_1 = ${D}\\cdot ${h} = ${sz(A1, 0)},\\quad z_1 = ${sz(z1, 1)};\\qquad A_2 = \\frac{D^2\\pi}{8} = \\frac{${D}^2\\pi}{8} = ${sz(A2, 1)},\\quad z_2 = ${h} + \\frac{2\\cdot ${D}}{3\\pi} = ${h} + ${sz(e, 2)} = ${sz(z2, 2)}`}</MB>
        <MB>{`A = ${sz(A, 1)}\\ \\text{mm}^2,\\qquad S_y = ${sz(A1, 0)}\\cdot ${sz(z1, 1)} + ${sz(A2, 1)}\\cdot ${sz(z2, 2)} = ${sz(Sy, 0)}\\ \\text{mm}^3`}</MB>
        <MB>{`z_S = \\frac{S_y}{A} = ${sz(zs, 2)}\\ \\text{mm}`}</MB>
        <p className="mt-2 text-[13px] text-petrol-600">
          Ha D-t sugárnak nézed, a félkör területe négyszeres (<M>{`${sz(D * D * PI / 2, 0)}`}</M>) lesz, és a súlypont mélyen lecsúszik. A szimmetria miatt <M>{`y_S = D/2 = ${r}`}</M>.
        </p>
      </>
    ),
  };
}

export const EXTRA_GENERATOROK = [
  { cim: "Aszimmetrikus I-szelvény", fn: iSzelvenyFeladat },
  { cim: "U-szelvény", fn: uSzelvenyFeladat },
  { cim: "Kör alakú lyuk", fn: korLyukFeladat },
  { cim: "Háromszög három csúccsal", fn: haromszogFeladat },
  { cim: "Statikai nyomaték eltolt tengelyre", fn: eltolasFeladat },
  { cim: "Súlypontból statikai nyomaték", fn: sulypontNyomatekFeladat },
  { cim: "Kör alakú idomok átmérővel", fn: felkorAtmeroFeladat },
];

export default function GyakorloExtra() {
  return (
    <>
      <GyakorloDoboz cim="Aszimmetrikus I-szelvény" leiras="Három téglalap, különböző övek — a súlypont nem a felezőmagasságon van." generator={iSzelvenyFeladat} />
      <GyakorloDoboz cim="U-szelvény" leiras="A szárak és a talp — figyelj a szárak valódi magasságára." generator={uSzelvenyFeladat} oszlopok={1} />
      <GyakorloDoboz cim="Kör alakú lyuk" leiras="Kivonásos módszer a legkényelmesebb kivont idommal: a kör súlypontja a középpontja." generator={korLyukFeladat} />
      <GyakorloDoboz cim="Háromszög három csúccsal" leiras="Általános háromszög: a súlypont a csúcsok átlaga, a terület a keresztszorzatból." generator={haromszogFeladat} oszlopok={3} />
      <GyakorloDoboz cim="Statikai nyomaték eltolt tengelyre" leiras="A tankönyv 9.12–9.16 képletei: S = z_S·A, és az eltolásnál S változik az eltolás × terület szorzatával." generator={eltolasFeladat} oszlopok={3} />
      <GyakorloDoboz cim="Súlypontból statikai nyomaték" leiras="Két téglalap: terület, a felső élre vett Sy, súlypont — és a tanulság, hogy a súlyponti tengelyre nulla." generator={sulypontNyomatekFeladat} oszlopok={3} />
      <GyakorloDoboz cim="Kör alakú idomok átmérővel" leiras="Félkör vagy negyedkör D-vel megadva, önmagában vagy téglalappal: D²π/8, D²π/16 és 2D/3π — ne nézd D-t sugárnak!" generator={felkorAtmeroFeladat} />
    </>
  );
}
