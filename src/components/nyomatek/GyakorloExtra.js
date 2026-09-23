"use client";

import GyakorloDoboz from "@/components/GyakorloDoboz";
import { M, MB } from "@/components/ui/Keplet";
import { derekszogu, sz, zarojel } from "@/lib/szamok";

const egesz = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
/** A lebegőpontos „−0” helyett pontosan 0. */
const tiszta = (v) => (Math.abs(v) < 5e-7 ? 0 : v);
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
  const k0 = derekszogu(F, a);
  const k = { x: tiszta(k0.x), y: tiszta(k0.y) };
  const Mo = tiszta(x * k.y - y * k.x);
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
        A nyomaték a komponensek nyomatékainak összege: <M>{"M = x F_y - y F_x"}</M>. Az erő karja utána már csak{" "}
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
          {Mo > 0 ? "Pozitív: az óramutatóval ellentétesen forgat az origó körül." : Mo < 0 ? "Negatív: az óramutató irányába forgat az origó körül." : "Nulla: a hatásvonal átmegy az origón, az erőkar nulla."}
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
        <MB>{`(\\underline{R}_A, M^{(A)}) \\ekv (\\underline{R}_B, M^{(B)}),\\qquad \\underline{R}_B = \\underline{R}_A`}</MB>
        <MB>{`\\Mp{B} M^{(A)} + (x_A - x_B)R_y - (y_A - y_B)R_x = M^{(B)}`}</MB>
        <MB>{`\\Mp{B} ${zarojel(MA, 0)} + (${A.x} - ${zarojel(B.x, 0)})\\cdot ${zarojel(Ry, 0)} - (${A.y} - ${zarojel(B.y, 0)})\\cdot ${zarojel(Rx, 0)} = ${sz(MB_, 1)}\\ \\text{kNm}`}</MB>
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
  const x0 = tiszta(Mo / Fy);
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
        <MB>{`(\\underline{F}, M) \\ekv \\underline{R},\\qquad \\Fy ${zarojel(Fy, 0)} = R_y`}</MB>
        <MB>{`\\Mp{O} ${zarojel(a, 0)}\\cdot ${zarojel(Fy, 0)} + ${zarojel(Mp, 0)} = x_0 R_y \\;\\Rightarrow\\; ${Mo} = x_0\\cdot${zarojel(Fy, 0)}`}</MB>
        <MB>{`x_0 = \\frac{${Mo}}{${zarojel(Fy, 0)}} = ${sz(x0, 3)}\\ \\text{m}`}</MB>
        <p className="mt-2 text-[13px] text-petrol-600">
          Az eltolás <M>{`M/F_y = ${sz(Mp / Fy, 3)}`}</M> m: az erőpárt „elnyeli” az erő párhuzamos eltolása.
        </p>
      </>
    ),
  };
}

/* ---------- 10. Nyomaték erőpárrá alakítása ---------- */

function eroparraFeladat() {
  const Mny = nemNulla(-60, 60);
  const valtozat = Math.random() < 0.5 ? "F" : "d";
  const F = egesz(2, 20);
  const d = egesz(1, 16) * 0.5;
  const dEredmeny = Math.abs(Mny) / F;
  const FEredmeny = Math.abs(Mny) / d;
  const forgas = Mny > 0 ? "az óramutatóval ellentétesen" : "az óramutató járásával egyezően";
  return {
    szoveg: (
      <p>
        Egy <M>{`M = ${Math.abs(Mny)}\\ \\text{kNm}`}</M> nagyságú, {forgas} forgató nyomatékot erőpárral akarunk
        helyettesíteni.{" "}
        {valtozat === "F" ? (
          <>
            Az erők nagysága <M>{`F = ${F}\\ \\text{kN}`}</M>. Mekkora legyen a két hatásvonal <M>{"d"}</M> távolsága?
          </>
        ) : (
          <>
            A két hatásvonal távolsága <M>{`d = ${sz(d, 1)}\\ \\text{m}`}</M>. Mekkora legyen az erők nagysága?
          </>
        )}
      </p>
    ),
    sugo: (
      <p>
        <M>{"M \\ekv (\\underline{F}_1, \\underline{F}_2)"}</M>, és <M>{"|M| = F\\,d"}</M>. Az irány szabadon választható, a
        kar nem függ tőle — csak az számít, hogy az erőpár ugyanabba az irányba forgasson, mint <M>{"M"}</M>.
      </p>
    ),
    oszlopok: 1,
    mezok:
      valtozat === "F"
        ? [{ id: "d", cimke: "d (az erőpár karja)", egyseg: "m", helyes: dEredmeny, tizedes: 3 }]
        : [{ id: "f", cimke: "F (mindkét erő nagysága)", egyseg: "kN", helyes: FEredmeny, tizedes: 3 }],
    megoldas: (
      <>
        <MB>{`M \\ekv (\\underline{F}_1, \\underline{F}_2),\\qquad |M| = F\\,d`}</MB>
        {valtozat === "F" ? (
          <MB>{`d = \\frac{|M|}{F} = \\frac{${Math.abs(Mny)}}{${F}} = ${sz(dEredmeny, 3)}\\ \\text{m}`}</MB>
        ) : (
          <MB>{`F = \\frac{|M|}{d} = \\frac{${Math.abs(Mny)}}{${sz(d, 1)}} = ${sz(FEredmeny, 3)}\\ \\text{kN}`}</MB>
        )}
        <p className="mt-2 text-[13px] text-petrol-600">
          A két erő egyenlő nagyságú, ellentétes irányú, párhuzamos; a forgásirány ({forgas}) dönti el, melyik hatásvonalon melyik irányba mutat.
        </p>
      </>
    ),
  };
}

/* ---------- 11. Párhuzamos erők és nyomatékok (dinámrendszer) ---------- */

function dinamFeladat() {
  const n = Math.random() < 0.5 ? 2 : 3;
  const helyek = [];
  while (helyek.length < n) {
    const h = egesz(0, 8);
    if (!helyek.includes(h)) helyek.push(h);
  }
  const erok = helyek.map((hely) => ({ hely, F: nemNulla(-9, 9) })); // felfelé pozitív
  if (Math.random() < 0.35) {
    // az eredő erő legyen nulla: az utolsó erő kiegyenlíti a többit
    const s = erok.slice(0, -1).reduce((a, e) => a + e.F, 0);
    if (s !== 0) erok[erok.length - 1].F = -s;
    else erok[erok.length - 1].F = nemNulla(-9, 9);
  }
  const m = Math.random() < 0.5 ? 1 : 2;
  const nyomatekok = Array.from({ length: m }, () => nemNulla(-20, 20));
  const R = erok.reduce((s, e) => s + e.F, 0);
  const Mo = erok.reduce((s, e) => s + e.hely * e.F, 0) + nyomatekok.reduce((s, v) => s + v, 0);
  const eroE = Math.abs(R) > 1e-9;
  const xR = eroE ? tiszta(Mo / R) : 0;
  const Mered = eroE ? 0 : Mo;

  return {
    szoveg: (
      <>
        <p>
          Egy vízszintes egyenes mentén függőleges erők és koncentrált nyomatékok hatnak (dinámrendszer). Döntsd el,
          mi az eredő, és számítsd ki! Felfelé és az óramutatóval ellentétesen a pozitív. Ha az eredő erő, add meg a helyét
          (<M>{"x_R"}</M>) és írj 0-t az <M>{"M"}</M> mezőbe; ha nyomaték, add meg <M>{"M"}</M>-et és írj 0-t az{" "}
          <M>{"x_R"}</M> mezőbe.
        </p>
        <div className="finom-gorgeto mt-2 overflow-x-auto">
          <table className="szamok w-full max-w-sm text-[13px]">
            <thead className="text-[11px] text-petrol-500 uppercase">
              <tr>
                <th className="pb-1 text-left">dinám</th>
                <th className="pb-1 text-right">érték</th>
                <th className="pb-1 text-right">hely, x [m]</th>
              </tr>
            </thead>
            <tbody>
              {erok.map((e, i) => (
                <tr key={`f${i}`} className="border-t border-petrol-200">
                  <td className="py-1">F{i + 1}</td>
                  <td className="py-1 text-right">{Math.abs(e.F)} kN {e.F > 0 ? "↑" : "↓"}</td>
                  <td className="py-1 text-right">{e.hely}</td>
                </tr>
              ))}
              {nyomatekok.map((v, i) => (
                <tr key={`m${i}`} className="border-t border-petrol-200">
                  <td className="py-1">M{i + 1}</td>
                  <td className="py-1 text-right">{Math.abs(v)} kNm {v > 0 ? "↶" : "↷"}</td>
                  <td className="py-1 text-right text-petrol-400">bárhol</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    ),
    sugo: (
      <p>
        Először a vetületi egyenlet — a nyomatékok ebbe nem kerülnek bele! Ha <M>{"R \\neq 0"}</M>, az eredő erő, és a
        helye a nyomatéki egyenletből: <M>{"\\Mp{O} \\sum x_i F_i + \\sum M_j = x_R R"}</M>. Ha <M>{"R = 0"}</M>, az
        eredő maga az origóra vett nyomaték (ami ekkor minden pontra ugyanannyi).
      </p>
    ),
    oszlopok: 3,
    mezok: [
      { id: "r", cimke: "R (felfelé pozitív)", egyseg: "kN", helyes: R, tizedes: 1, tures: 0.05 },
      { id: "x", cimke: "x_R (ha erő; különben 0)", egyseg: "m", helyes: xR, tizedes: 3, tures: eroE ? Math.max(0.01, Math.abs(xR) * 0.015) : 0.01 },
      { id: "m", cimke: "M (ha nyomaték; különben 0)", egyseg: "kNm", helyes: Mered, tizedes: 1, tures: 0.05 },
    ],
    megoldas: (
      <>
        <MB>{`(${erok.map((_, i) => `\\underline{F}_${i + 1}`).join(", ")}, ${nyomatekok.map((_, i) => `M_${i + 1}`).join(", ")}) \\ekv \\mathcal{D}`}</MB>
        <MB>{`\\Fy ${erok.map((e) => zarojel(e.F, 0)).join(" + ")} = ${sz(R, 1)}\\ \\text{kN}`}</MB>
        {eroE ? (
          <>
            <p>Az eredő erő: <M>{`R = ${sz(Math.abs(R), 1)}\\ \\text{kN}`}</M> {R > 0 ? "felfelé" : "lefelé"}. A helyét az origóra írt nyomatéki egyenlet adja:</p>
            <MB>{`\\Mp{O} ${erok.map((e) => `${e.hely}\\cdot${zarojel(e.F, 0)}`).join(" + ")} ${nyomatekok.map((v) => `${v > 0 ? "+" : "-"} ${Math.abs(v)}`).join(" ")} = x_R\\cdot${zarojel(R, 0)}`}</MB>
            <MB>{`${sz(Mo, 1)} = x_R\\cdot${zarojel(R, 0)}\\ \\Rightarrow\\ x_R = ${sz(xR, 3)}\\ \\text{m}`}</MB>
          </>
        ) : (
          <>
            <p>Az eredő erő zérus, tehát az eredő nyomaték vagy egyensúly. Nyomatéki egyenlet az origóra:</p>
            <MB>{`\\Mp{O} ${erok.map((e) => `${e.hely}\\cdot${zarojel(e.F, 0)}`).join(" + ")} ${nyomatekok.map((v) => `${v > 0 ? "+" : "-"} ${Math.abs(v)}`).join(" ")} = ${sz(Mo, 1)}\\ \\text{kNm}`}</MB>
            <p>
              {Math.abs(Mo) > 1e-9
                ? `Az eredő egy ${sz(Math.abs(Mo), 1)} kNm nagyságú nyomaték, amely ${Mo > 0 ? "az óramutatóval ellentétesen" : "az óramutató járásával egyezően"} forgat — bármely pontra ugyanennyi.`
                : "Ez is nulla: az erőrendszer egyensúlyi (zéruserő az eredője)."}
            </p>
          </>
        )}
      </>
    ),
  };
}

/* ---------- 12. Térbeli eredő: erő, nyomaték vagy erőcsavar? ---------- */

function erocsavarFeladat() {
  const veletlen3 = () => [nemNulla(-6, 6), nemNulla(-6, 6), nemNulla(-6, 6)];
  const p = Math.random();
  let R;
  let Mv;
  if (p < 0.2) {
    R = [0, 0, 0];
    Mv = Math.random() < 0.8 ? veletlen3() : [0, 0, 0];
  } else if (p < 0.55) {
    // M merőleges R-re: M = R × a
    R = veletlen3();
    const a = veletlen3();
    Mv = [R[1] * a[2] - R[2] * a[1], R[2] * a[0] - R[0] * a[2], R[0] * a[1] - R[1] * a[0]];
    if (Math.random() < 0.2) Mv = [0, 0, 0];
  } else {
    R = veletlen3();
    Mv = veletlen3();
  }
  const RM = tiszta(R[0] * Mv[0] + R[1] * Mv[1] + R[2] * Mv[2]);
  const Rh = Math.hypot(...R);
  const Mh = Math.hypot(...Mv);
  const kod = Rh < 1e-9 ? (Mh < 1e-9 ? 1 : 2) : RM === 0 ? 3 : 4;
  const nevek = { 1: "egyensúlyi erőrendszer", 2: "nyomaték", 3: "egyetlen erő", 4: "erőcsavar" };
  const v = (t) => `(${t[0]};\\ ${t[1]};\\ ${t[2]})`;
  return {
    szoveg: (
      <p>
        Egy térbeli erőrendszert az <M>{"A"}</M> pontra redukáltunk: a társerő <M>{`\\underline{R}_A = ${v(R)}\\ \\text{kN}`}</M>, a
        társnyomaték <M>{`\\underline{M}_A = ${v(Mv)}\\ \\text{kNm}`}</M>. Számítsd ki az <M>{"\\underline{R}_A\\cdot\\underline{M}_A"}</M>{" "}
        skaláris szorzatot, és döntsd el az eredő típusát! Kód: 1 = egyensúly, 2 = nyomaték, 3 = egyetlen erő, 4 = erőcsavar.
      </p>
    ),
    sugo: (
      <p>
        <M>{"\\underline{R} = 0"}</M> és <M>{"\\underline{M} = 0"}</M>: egyensúly. <M>{"\\underline{R} = 0"}</M>,{" "}
        <M>{"\\underline{M} \\neq 0"}</M>: nyomaték. <M>{"\\underline{R} \\neq 0"}</M> és <M>{"\\underline{R}\\cdot\\underline{M} = 0"}</M>{" "}
        (M merőleges R-re vagy nulla): egyetlen erő, eltolva. <M>{"\\underline{R}\\cdot\\underline{M} \\neq 0"}</M>: erőcsavar.
      </p>
    ),
    mezok: [
      { id: "rm", cimke: "R·M", egyseg: "kN²m", helyes: RM, tizedes: 0, tures: 0.5 },
      { id: "kod", cimke: "az eredő típusának kódja (1–4)", egyseg: "", helyes: kod, tizedes: 0, tures: 0.1 },
    ],
    megoldas: (
      <>
        <MB>{`\\underline{R}\\cdot\\underline{M} = ${zarojel(R[0], 0)}\\cdot${zarojel(Mv[0], 0)} + ${zarojel(R[1], 0)}\\cdot${zarojel(Mv[1], 0)} + ${zarojel(R[2], 0)}\\cdot${zarojel(Mv[2], 0)} = ${RM}\\ \\text{kN}^2\\text{m}`}</MB>
        <p>
          {Rh < 1e-9 ? "A társerő zérus" : "A társerő nem zérus"}
          {Rh < 1e-9 ? (Mh < 1e-9 ? ", és a társnyomaték is zérus" : ", a társnyomaték nem") : RM === 0 ? ", és R·M = 0, azaz M merőleges R-re (vagy nulla)" : ", és R·M ≠ 0, azaz M-nek van R-rel párhuzamos vetülete"}
          {" → "}
          <strong>{kod}. eset: {nevek[kod]}</strong>.
        </p>
        {kod === 4 && (
          <MB>{`M_{\\parallel} = \\frac{\\underline{R}\\cdot\\underline{M}}{|\\underline{R}|} = \\frac{${RM}}{${sz(Rh, 3)}} = ${sz(RM / Rh, 3)}\\ \\text{kNm}`}</MB>
        )}
      </>
    ),
  };
}

export const EXTRA_GENERATOROK = [
  { cim: "Ferde erő nyomatéka és az erőkar", fn: ferdeFeladat },
  { cim: "Nyomaték átszámítása másik pontra", fn: atszamitasFeladat },
  { cim: "A hatásvonal tengelymetszetei", fn: metszetFeladat },
  { cim: "Erő és erőpár együtt", fn: eroEsParFeladat },
  { cim: "Nyomaték erőpárrá alakítása", fn: eroparraFeladat },
  { cim: "Párhuzamos erők és nyomatékok", fn: dinamFeladat },
  { cim: "Térbeli eredő: erő, nyomaték vagy erőcsavar?", fn: erocsavarFeladat },
];

export default function GyakorloExtra() {
  return (
    <>
      <GyakorloDoboz cim="Ferde erő nyomatéka és az erőkar" leiras="A nyomaték a komponensek nyomatékainak összege; utána az erő karja a nyomatékból." generator={ferdeFeladat} />
      <GyakorloDoboz cim="Nyomaték átszámítása másik pontra" leiras="Az erő marad, a nyomaték változik — a redukálás egyik alaptétele." generator={atszamitasFeladat} oszlopok={1} />
      <GyakorloDoboz cim="A hatásvonal tengelymetszetei" leiras="Redukált rendszerből az eredő hatásvonalának két pontja." generator={metszetFeladat} />
      <GyakorloDoboz cim="Erő és erőpár együtt" leiras="Az erőpár eltolja az erőt — mennyivel?" generator={eroEsParFeladat} oszlopok={1} />
      <GyakorloDoboz cim="Nyomaték erőpárrá alakítása" leiras="A tankönyv 3.9. ábrája számokkal: adott M-hez erőpár, adott F-fel vagy adott karral." generator={eroparraFeladat} oszlopok={1} />
      <GyakorloDoboz cim="Párhuzamos erők és nyomatékok" leiras="Dinámrendszer: előbb a típus (erő vagy nyomaték?), aztán a hely vagy a nagyság. A tankönyv 3.10. ábrájának véletlen változata." generator={dinamFeladat} oszlopok={3} />
      <GyakorloDoboz cim="Térbeli eredő: erő, nyomaték vagy erőcsavar?" leiras="A társerő és a társnyomaték skaláris szorzata dönt — a négy eset." generator={erocsavarFeladat} />
    </>
  );
}
