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

export default function GyakorloExtra() {
  return (
    <>
      <GyakorloDoboz cim="Aszimmetrikus I-szelvény" leiras="Három téglalap, különböző övek — a súlypont nem a felezőmagasságon van." generator={iSzelvenyFeladat} />
      <GyakorloDoboz cim="U-szelvény" leiras="A szárak és a talp — figyelj a szárak valódi magasságára." generator={uSzelvenyFeladat} oszlopok={1} />
      <GyakorloDoboz cim="Kör alakú lyuk" leiras="Kivonásos módszer a legkényelmesebb kivont idommal: a kör súlypontja a középpontja." generator={korLyukFeladat} />
      <GyakorloDoboz cim="Háromszög három csúccsal" leiras="Általános háromszög: a súlypont a csúcsok átlaga, a terület a keresztszorzatból." generator={haromszogFeladat} oszlopok={3} />
    </>
  );
}
