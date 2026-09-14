"use client";

import GyakorloDoboz from "@/components/GyakorloDoboz";
import { M, MB } from "@/components/ui/Keplet";
import { derekszogu, sz, zarojel } from "@/lib/szamok";

const egesz = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
const nemNulla = (min, max) => {
  let v = 0;
  while (v === 0) v = egesz(min, max);
  return v;
};

/* ---------- 6. Ferde erő nyomatéka kétféleképpen ---------- */

function ferdeFeladat() {
  const F = egesz(4, 30);
  const a = egesz(1, 35) * 10;
  const x = nemNulla(-6, 8);
  const y = nemNulla(-5, 6);
  const k = derekszogu(F, a);
  const Mo = x * k.y - y * k.x;
  const d = Math.abs(Mo) / F;
  return {
    szoveg: (
      <p>
        Egy <M>{`F = ${F}\\ \\text{kN}`}</M> nagyságú, <M>{`\\alpha = ${a}^\\circ`}</M> irányszögű erő a{" "}
        <M>{`P(${x};\\ ${y})`}</M> m pontban támad. Mekkora a nyomatéka az origóra, és mekkora az erőkar (az
        origó távolsága a hatásvonaltól)?
      </p>
    ),
    sugo: (
      <p>
        Varignon: <M>{"M = x F_y - y F_x"}</M> a komponensekkel. Az erőkar utána már csak{" "}
        <M>{"d = |M| / F"}</M>.
      </p>
    ),
    mezok: [
      { id: "m", cimke: "M (előjelesen)", egyseg: "kNm", helyes: Mo, tizedes: 2 },
      { id: "d", cimke: "d (erőkar)", egyseg: "m", helyes: d, tizedes: 3 },
    ],
    megoldas: (
      <>
        <MB>{`F_x = ${F}\\cos ${a}^\\circ = ${sz(k.x, 3)},\\qquad F_y = ${F}\\sin ${a}^\\circ = ${sz(k.y, 3)}\\ \\text{kN}`}</MB>
        <MB>{`M^{(O)} = x F_y - y F_x = ${zarojel(x, 0)}\\cdot ${zarojel(k.y, 3)} - ${zarojel(y, 0)}\\cdot ${zarojel(k.x, 3)} = ${sz(Mo, 2)}\\ \\text{kNm}`}</MB>
        <MB>{`d = \\frac{|M|}{F} = \\frac{${sz(Math.abs(Mo), 2)}}{${F}} = ${sz(d, 3)}\\ \\text{m}`}</MB>
        <p className="mt-2 text-[13px] text-petrol-600">
          {Mo > 0 ? "Pozitív: az óramutatóval ellentétesen forgat az origó körül." : "Negatív: az óramutató irányába forgat az origó körül."}
        </p>
      </>
    ),
  };
}

/* ---------- 7. Nyomaték átszámítása másik pontra ---------- */

function atszamitasFeladat() {
  const Rx = nemNulla(-20, 20);
  const Ry = nemNulla(-20, 20);
  const A = { x: nemNulla(-5, 5), y: nemNulla(-5, 5) };
  const B = { x: nemNulla(-6, 6), y: nemNulla(-6, 6) };
  const MA = egesz(-60, 60);
  // M_B = M_A + (xA − xB) Ry − (yA − yB) Rx
  const MB_ = MA + (A.x - B.x) * Ry - (A.y - B.y) * Rx;
  return {
    szoveg: (
      <p>
        Egy erőrendszert az <M>{`A(${A.x};\\ ${A.y})`}</M> pontra redukáltunk:{" "}
        <M>{`\\underline{R} = (${Rx};\\ ${Ry})\\ \\text{kN}`}</M>, <M>{`M^{(A)} = ${MA}\\ \\text{kNm}`}</M>.
        Mekkora a redukált nyomaték a <M>{`B(${B.x};\\ ${B.y})`}</M> pontra?
      </p>
    ),
    sugo: (
      <p>
        Az erő ugyanaz marad, a nyomatékhoz hozzájön az A-ban ülő R nyomatéka B-re:{" "}
        <M>{"M^{(B)} = M^{(A)} + (x_A - x_B)R_y - (y_A - y_B)R_x"}</M>.
      </p>
    ),
    mezok: [{ id: "mb", cimke: "M(B)", egyseg: "kNm", helyes: MB_, tizedes: 1 }],
    megoldas: (
      <>
        <MB>{`M^{(B)} = M^{(A)} + (x_A - x_B)R_y - (y_A - y_B)R_x`}</MB>
        <MB>{`M^{(B)} = ${zarojel(MA, 0)} + (${A.x} - ${zarojel(B.x, 0)})\\cdot ${zarojel(Ry, 0)} - (${A.y} - ${zarojel(B.y, 0)})\\cdot ${zarojel(Rx, 0)} = ${sz(MB_, 1)}\\ \\text{kNm}`}</MB>
        <p className="mt-2 text-[13px] text-petrol-600">
          Az R erő nem változik — csak a nyomaték függ attól, melyik pontra redukálunk. Erőpárnál (R = 0) a nyomaték minden pontra ugyanaz.
        </p>
      </>
    ),
  };
}

/* ---------- 8. A hatásvonal tengelymetszetei ---------- */

function metszetFeladat() {
  const Rx = nemNulla(-20, 20);
  const Ry = nemNulla(-20, 20);
  const Mo = nemNulla(-80, 80);
  const x0 = Mo / Ry;
  const y0 = -Mo / Rx;
  return {
    szoveg: (
      <p>
        Egy erőrendszer origóra redukált eredője <M>{`\\underline{R} = (${Rx};\\ ${Ry})\\ \\text{kN}`}</M>,{" "}
        <M>{`M^{(O)} = ${Mo}\\ \\text{kNm}`}</M>. Hol metszi az eredő hatásvonala az x és az y tengelyt?
      </p>
    ),
    sugo: (
      <p>
        Az x tengelyen (y = 0) az R nyomatéka <M>{"x_0 R_y"}</M>, az y tengelyen (x = 0) <M>{"-y_0 R_x"}</M> — mindkettőnek
        M-mel kell egyeznie.
      </p>
    ),
    mezok: [
      { id: "x0", cimke: "x₀", egyseg: "m", helyes: x0, tizedes: 3 },
      { id: "y0", cimke: "y₀", egyseg: "m", helyes: y0, tizedes: 3 },
    ],
    megoldas: (
      <>
        <MB>{`x_0 R_y = M \\ \\Rightarrow\\ x_0 = \\frac{${Mo}}{${zarojel(Ry, 0)}} = ${sz(x0, 3)}\\ \\text{m}`}</MB>
        <MB>{`-y_0 R_x = M \\ \\Rightarrow\\ y_0 = -\\frac{${Mo}}{${zarojel(Rx, 0)}} = ${sz(y0, 3)}\\ \\text{m}`}</MB>
        <p className="mt-2 text-[13px] text-petrol-600">
          A két pont összekötő egyenese az eredő hatásvonala; meredeksége <M>{`R_y/R_x = ${sz(Ry / Rx, 3)}`}</M> — érdemes ellenőrizni.
        </p>
      </>
    ),
  };
}

/* ---------- 9. Erő + erőpár eredője ---------- */

function eroEsParFeladat() {
  const Fy = nemNulla(-20, 20);
  const a = nemNulla(-5, 6);
  const Mp = nemNulla(-40, 40);
  const Mo = a * Fy + Mp;
  const x0 = Mo / Fy;
  return {
    szoveg: (
      <p>
        Egy függőleges, <M>{`F_y = ${Fy}\\ \\text{kN}`}</M> erő az <M>{`x = ${a}\\ \\text{m}`}</M> helyen hat, és
        ugyanarra a testre egy <M>{`M = ${Mp}\\ \\text{kNm}`}</M> erőpár is. Mi az eredő, és hol metszi a hatásvonala az x tengelyt?
      </p>
    ),
    sugo: (
      <p>
        Erő + erőpár eredője mindig egyetlen erő, ugyanakkora, mint F — csak odébb csúszik annyival, hogy a
        nyomatéka az origóra a teljes nyomatékkal egyezzen.
      </p>
    ),
    mezok: [{ id: "x0", cimke: "x₀", egyseg: "m", helyes: x0, tizedes: 3 }],
    megoldas: (
      <>
        <MB>{`M^{(O)} = a F_y + M = ${zarojel(a, 0)}\\cdot ${zarojel(Fy, 0)} + ${zarojel(Mp, 0)} = ${Mo}\\ \\text{kNm}`}</MB>
        <MB>{`x_0 = \\frac{M^{(O)}}{F_y} = \\frac{${Mo}}{${zarojel(Fy, 0)}} = ${sz(x0, 3)}\\ \\text{m}`}</MB>
        <p className="mt-2 text-[13px] text-petrol-600">
          Az eltolás <M>{`M/F_y = ${sz(Mp / Fy, 3)}`}</M> m: az erőpárt „elnyeli” az erő párhuzamos eltolása.
        </p>
      </>
    ),
  };
}

export default function GyakorloExtra() {
  return (
    <>
      <GyakorloDoboz cim="Ferde erő nyomatéka és az erőkar" leiras="Varignon-tétel komponensekkel, majd az erőkar a nyomatékból." generator={ferdeFeladat} />
      <GyakorloDoboz cim="Nyomaték átszámítása másik pontra" leiras="Az erő marad, a nyomaték változik — a redukálás egyik alaptétele." generator={atszamitasFeladat} oszlopok={1} />
      <GyakorloDoboz cim="A hatásvonal tengelymetszetei" leiras="Redukált rendszerből az eredő hatásvonalának két pontja." generator={metszetFeladat} />
      <GyakorloDoboz cim="Erő és erőpár együtt" leiras="Az erőpár eltolja az erőt — mennyivel?" generator={eroEsParFeladat} oszlopok={1} />
    </>
  );
}
