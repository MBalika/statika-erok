"use client";

import GyakorloDoboz from "@/components/GyakorloDoboz";
import GyakorloExtra, { OsszetettRajz, egesz, valaszt, fel, tag, tagE } from "./GyakorloExtra";
import { M, MB } from "@/components/ui/Keplet";
import { sz, szK } from "@/lib/szamok";
import { gerberSzamit, gerberBefogasSzamit, haromcsuklosSzamit, fuggesztettCsukloSzamit, FOK } from "./szamitas";

/* ============================================================
   1. Gerber-tartó reakciói és csuklóereje (tankönyv 5.4)
   ============================================================ */
function gerberFeladat() {
  const L1 = fel(3, 6), L2 = fel(1, 3), L3 = fel(2, 5);
  const xB = L1, xC = L1 + L2, xD = xC + L3;
  const x1 = fel(0.5, xC - 0.5), F1 = egesz(6, 20);
  const x2 = fel(xC + 0.5, xD - 0.5), F2 = egesz(4, 16);
  const ferde = Math.random() < 0.35;
  const alfa = ferde ? valaszt([30, 45, 60]) : 90;
  const jobbra = Math.random() < 0.5;
  const szog = ferde ? (jobbra ? -alfa : -180 + alfa) : -90;
  const F1x = F1 * Math.cos(szog * FOK), F1y = F1 * Math.sin(szog * FOK);
  const r = gerberSzamit({ xB, xC, xD, terhekI: [{ x: x1, y: 0, Fx: F1x, Fy: F1y }], terhekII: [{ x: x2, y: 0, Fx: 0, Fy: -F2 }] });
  return {
    adat: { gerber: true },
    szoveg: (
      <p>
        Gerber-tartó: <M>{"A"}</M> csukló (<M>{"x = 0"}</M>), <M>{"B"}</M> görgő (<M>{`x = ${szK(xB, 1)}`}</M> m), <M>{"C"}</M> belső csukló (<M>{`x = ${szK(xC, 1)}`}</M> m), <M>{"D"}</M> görgő (<M>{`x = ${szK(xD, 1)}`}</M> m).
        Terhek: <M>{`F_1 = ${F1}\\ \\text{kN}`}</M> az <M>{`x = ${szK(x1, 1)}`}</M> m helyen{ferde ? <>, {jobbra ? "jobbra" : "balra"}-lefelé, a vízszintessel <M>{`${alfa}^\\circ`}</M>-ot bezárva</> : " függőlegesen lefelé"};{" "}
        <M>{`F_2 = ${F2}\\ \\text{kN}`}</M> függőlegesen lefelé az <M>{`x = ${szK(x2, 1)}`}</M> m helyen. Számítsd ki a <M>{"C"}</M>-ben a II. testre ható csuklóerő függőleges komponensét (felfelé +) és a
        függőleges reakciókat!
      </p>
    ),
    abra: (
      <OsszetettRajz
        rudak={[[0, 0, xD, 0]]}
        tamaszok={[{ x: 0, y: 0, tipus: "csuklo", cimke: "A" }, { x: xB, y: 0, tipus: "gorgo", cimke: "B" }, { x: xD, y: 0, tipus: "gorgo", cimke: "D" }]}
        csuklok={[[xC, 0, "C"]]}
        erok={[{ x: x1, y: 0, F: F1, szog, cimke: `F₁ = ${F1} kN${ferde ? `, ${alfa}°` : ""}` }, { x: x2, y: 0, F: F2, szog: -90, cimke: `F₂ = ${F2} kN` }]}
        testek={[{ x: xC / 2 + 0.3, y: -1, cimke: "I" }, { x: xC + L3 / 2, y: -1, cimke: "II" }]}
        meretek={[{ x1: 0, x2: x1, cimke: sz(x1, 1) }, { x1: x1, x2: xB, cimke: sz(xB - x1, 1) }, { x1: xB, x2: xC, cimke: sz(L2, 1) }, { x1: xC, x2: x2, cimke: sz(x2 - xC, 1) }, { x1: x2, x2: xD, cimke: sz(xD - x2, 1) }]}
      />
    ),
    sugo: (
      <p>
        Kezdd a befüggesztett résszel (II: <M>{"C"}</M>–<M>{"D"}</M>): <M>{"\\Mp{C}"}</M> → <M>{"D"}</M>, <M>{"\\Mp{D}"}</M> → <M>{"C_y"}</M>. A csuklóerő ellentettje (lefelé) terheli az I. testet, ami ezután egy
        kéttámaszú tartó: <M>{"\\Mp{A}"}</M> → <M>{"B"}</M>, <M>{"\\Mp{B}"}</M> → <M>{"A_y"}</M>.
      </p>
    ),
    oszlopok: 4,
    mezok: [
      { id: "cy", cimke: "C_y (a II. testre, ↑ +)", egyseg: "kN", helyes: r.Cy, tizedes: 2 },
      { id: "d", cimke: "D (↑ +)", egyseg: "kN", helyes: r.D, tizedes: 2 },
      { id: "b", cimke: "B (↑ +)", egyseg: "kN", helyes: r.B, tizedes: 2 },
      { id: "ay", cimke: "A_y (↑ +)", egyseg: "kN", helyes: r.Ay, tizedes: 2 },
    ],
    megoldas: (
      <>
        <p>
          <strong>Elkülönítés:</strong> a II. testre <M>{"C_x"}</M> (jobbra), <M>{"C_y"}</M> (felfelé) és <M>{"D"}</M>; az I. testre <M>{"A_x, A_y, B"}</M> és a csuklóerő ellentettje.
          {ferde ? <> Az <M>{"F_1"}</M> komponensei: <M>{`F_{1x} = ${szK(F1x, 3)}`}</M>, <M>{`F_{1y} = ${szK(F1y, 3)}`}</M> kN.</> : null}
        </p>
        <MB>{"\\text{II:}\\ (\\underline{F}_2, \\underline{D}, \\underline{C}) \\ekv \\underline{O}\\qquad \\text{I:}\\ (\\underline{F}_1, \\underline{A}, \\underline{B}, \\underline{C}') \\ekv \\underline{O}"}</MB>
        <MB>{`\\text{II:}\\ \\Mp{C}\\ ${tag(x2 - xC, -F2)} + ${szK(L3, 1)}\\cdot D = 0 \\;\\Rightarrow\\; D = ${szK(r.D, 2)}\\ \\text{kN}`}</MB>
        <MB>{`\\text{II:}\\ \\Mp{D}\\ ${tag(xD - x2, F2)} - ${szK(L3, 1)}\\cdot C_y = 0 \\;\\Rightarrow\\; C_y = ${szK(r.Cy, 2)}\\ \\text{kN};\\qquad \\Fx\\ C_x = 0`}</MB>
        <p>Az I. testre a <M>{"C"}</M> pontban <M>{`${szK(r.Cy, 2)}`}</M> kN hat lefelé:</p>
        <MB>{`\\text{I:}\\ \\Mp{A}\\ ${tag(x1, F1y, 1, 2)} ${tag(xC, -r.Cy, 1, 2)} + ${szK(xB, 1)}\\cdot B = 0 \\;\\Rightarrow\\; B = ${szK(r.B, 2)}\\ \\text{kN}`}</MB>
        <MB>{`\\text{I:}\\ \\Mp{B}\\ ${tag(x1 - xB, F1y, 1, 2)} ${tag(xC - xB, -r.Cy, 1, 2)} - ${szK(xB, 1)}\\cdot A_y = 0 \\;\\Rightarrow\\; A_y = ${szK(r.Ay, 2)}\\ \\text{kN}`}</MB>
        {ferde && <MB>{`\\text{I:}\\ \\Fx\\ ${tagE(F1x, 2)} + A_x = 0 \\;\\Rightarrow\\; A_x = ${szK(r.Ax, 2)}\\ \\text{kN}`}</MB>}
        <p>Ellenőrzés az egész szerkezetre (a csuklóerő kiesik):</p>
        <MB>{`\\Sigma:\\ \\Fy\\ ${tagE(r.Ay, 2)} ${tagE(r.B, 2)} ${tagE(r.D, 2)} ${tagE(F1y, 2)} - ${F2} = ${szK(r.ellenorzes, 2)} \\approx 0\\ \\checkmark`}</MB>
        <p className="mt-2 text-[13px] text-petrol-600">
          {r.Ay < 0 ? "A_y negatív: a B-n túlnyúló rész és a csuklóerő felemeli az A végét — a csuklónak lefelé kell tartania." : "Minden reakció felfelé mutat; B a legnagyobb, mert a konzol és a befüggesztett rész is rá terhel."}
        </p>
      </>
    ),
  };
}

/* ============================================================
   2. Háromcsuklós tartó (azonos magasságú támaszok) — két függőleges erővel
   ============================================================ */
function haromcsuklosFeladat() {
  const L = fel(6, 12), h = fel(3, 6);
  const xC = valaszt([L / 2, L / 2, fel(Math.max(2, L / 2 - 2), L / 2 + 2)]);
  const xF1 = fel(0.5, xC - 0.5), F1 = egesz(6, 20);
  const xF2 = fel(xC + 0.5, L - 0.5), F2 = egesz(4, 16);
  const r = haromcsuklosSzamit({ xB: L, yB: 0, xC, yC: h, terhekI: [{ x: xF1, y: h, Fx: 0, Fy: -F1 }], terhekII: [{ x: xF2, y: h, Fx: 0, Fy: -F2 }] });
  return {
    adat: { harom: true },
    szoveg: (
      <p>
        Háromcsuklós keret: <M>{"A"}</M> csukló <M>{"(0;\\ 0)"}</M>, <M>{"B"}</M> csukló <M>{`(${szK(L, 1)};\\ 0)`}</M>, a gerenda <M>{`h = ${szK(h, 1)}`}</M> m magasan, <M>{"C"}</M> belső csukló az{" "}
        <M>{`x = ${szK(xC, 1)}`}</M> m helyen. A gerendát <M>{`F_1 = ${F1}\\ \\text{kN}`}</M> (<M>{`x = ${szK(xF1, 1)}`}</M> m) és <M>{`F_2 = ${F2}\\ \\text{kN}`}</M> (<M>{`x = ${szK(xF2, 1)}`}</M> m)
        függőleges erő terheli. Számítsd ki a négy reakciót (<M>{"A_x, B_x"}</M> jobbra, <M>{"A_y, B_y"}</M> felfelé pozitív)!
      </p>
    ),
    abra: (
      <OsszetettRajz
        rudak={[[0, 0, 0, h], [0, h, L, h], [L, h, L, 0]]}
        tamaszok={[{ x: 0, y: 0, tipus: "csuklo", cimke: "A", dx: -18, dy: 26 }, { x: L, y: 0, tipus: "csuklo", cimke: "B", dx: 18, dy: 26 }]}
        csuklok={[[xC, h, "C"]]}
        erok={[{ x: xF1, y: h, F: F1, szog: -90, cimke: `F₁ = ${F1} kN` }, { x: xF2, y: h, F: F2, szog: -90, cimke: `F₂ = ${F2} kN` }]}
        testek={[{ x: 0.6, y: h * 0.45, cimke: "I" }, { x: L - 0.6, y: h * 0.45, cimke: "II" }]}
        meretek={[{ x1: 0, x2: xF1, cimke: sz(xF1, 1) }, { x1: xF1, x2: xC, cimke: sz(xC - xF1, 1) }, { x1: xC, x2: xF2, cimke: sz(xF2 - xC, 1) }, { x1: xF2, x2: L, cimke: sz(L - xF2, 1) }]}
        fuggMeretek={[{ y1: 0, y2: h, cimke: `h = ${sz(h, 1)}` }]}
      />
    ),
    sugo: (
      <p>
        Az egész szerkezetre <M>{"\\Mp{A}"}</M> és <M>{"\\Mp{B}"}</M>: a vízszintes reakciók hatásvonala mindkét ponton átmegy, tehát csak <M>{"B_y"}</M>, illetve <M>{"A_y"}</M> marad. Aztán a II. testre{" "}
        <M>{"\\Mp{C}"}</M>: <M>{"B_x"}</M> karja a magasság, <M>{"B_y"}</M> karja <M>{"L - x_C"}</M>. A vízszintes reakciók nem nullák — ez a háromcsuklós tartó lényege.
      </p>
    ),
    oszlopok: 4,
    mezok: [
      { id: "ay", cimke: "A_y (↑ +)", egyseg: "kN", helyes: r.Ay, tizedes: 2 },
      { id: "by", cimke: "B_y (↑ +)", egyseg: "kN", helyes: r.By, tizedes: 2 },
      { id: "bx", cimke: "B_x (→ +)", egyseg: "kN", helyes: r.Bx, tizedes: 2 },
      { id: "ax", cimke: "A_x (→ +)", egyseg: "kN", helyes: r.Ax, tizedes: 2 },
    ],
    megoldas: (
      <>
        <MB>{"\\Sigma:\\ (\\underline{F}_1, \\underline{F}_2, \\underline{A}, \\underline{B}) \\ekv \\underline{O}\\qquad \\text{II:}\\ (\\underline{F}_2, \\underline{B}, \\underline{C}) \\ekv \\underline{O}"}</MB>
        <MB>{`\\Sigma:\\ \\Mp{A}\\ ${tag(xF1, -F1)} ${tag(xF2, -F2)} + ${szK(L, 1)}\\cdot B_y = 0 \\;\\Rightarrow\\; B_y = ${szK(r.By, 2)}\\ \\text{kN}`}</MB>
        <MB>{`\\Sigma:\\ \\Mp{B}\\ ${tag(L - xF1, F1)} ${tag(L - xF2, F2)} - ${szK(L, 1)}\\cdot A_y = 0 \\;\\Rightarrow\\; A_y = ${szK(r.Ay, 2)}\\ \\text{kN}`}</MB>
        <p>
          A II. testre a <M>{"C"}</M> csuklóra: <M>{"B_y"}</M> karja <M>{`${szK(L - xC, 1)}`}</M> m (pozitív), a jobbra mutató <M>{"B_x"}</M> a pont alatt <M>{`${szK(h, 1)}`}</M> m-rel (pozitív), <M>{"F_2"}</M>{" "}
          jobbra lefelé (negatív):
        </p>
        <MB>{`\\text{II:}\\ \\Mp{C}\\ ${tag(L - xC, r.By, 1, 2)} ${tag(xF2 - xC, -F2)} + ${szK(h, 1)}\\cdot B_x = 0 \\;\\Rightarrow\\; B_x = ${szK(r.Bx, 2)}\\ \\text{kN}`}</MB>
        <MB>{`\\Sigma:\\ \\Fx\\ A_x + B_x = 0 \\;\\Rightarrow\\; A_x = ${szK(r.Ax, 2)}\\ \\text{kN}`}</MB>
        <p>Ellenőrzés az I. testre írt <M>{"\\Mp{C}"}</M> egyenlettel (minden tag ismert): <M>{`${szK(r.ellenorzes, 2)} \\approx 0\\ \\checkmark`}</M>.</p>
        <p className="mt-2 text-[13px] text-petrol-600">
          A csuklóban a II. testre <M>{`C_x = ${szK(r.Cx, 2)}`}</M>, <M>{`C_y = ${szK(r.Cy, 2)}`}</M> kN. A vízszintes tolóerő <M>{`H = ${szK(Math.abs(r.Ax), 2)}`}</M> kN befelé mutat mindkét támasznál: a két fél keret „egymásnak dől”.
        </p>
      </>
    ),
  };
}

/* ============================================================
   3. Konzolos összetett tartó: Gerber-tartó befogással (tankönyv 5.5)
   ============================================================ */
function gerberBefogasFeladat() {
  const xA = fel(1, 3), LAC = fel(3, 7), LCB = fel(2, 5);
  const xC = xA + LAC, xB = xC + LCB;
  const x1 = fel(0, xC - 0.5), F1 = egesz(6, 20);
  const x2 = fel(xC + 0.5, xB - 0.5), F2 = egesz(4, 16);
  const r = gerberBefogasSzamit({ xA, xC, xB, terhekI: [{ x: x1, y: 0, Fx: 0, Fy: -F1 }], terhekII: [{ x: x2, y: 0, Fx: 0, Fy: -F2 }] });
  return {
    adat: { befogas: true },
    szoveg: (
      <p>
        A gerenda bal vége (<M>{"x = 0"}</M>) szabad, az <M>{"A"}</M> görgő az <M>{`x = ${szK(xA, 1)}`}</M> m, a <M>{"C"}</M> belső csukló az <M>{`x = ${szK(xC, 1)}`}</M> m helyen van, a jobb vég (<M>{"B"}</M>,{" "}
        <M>{`x = ${szK(xB, 1)}`}</M> m) mereven befogott. Terhek: <M>{`F_1 = ${F1}\\ \\text{kN}`}</M> az <M>{`x = ${szK(x1, 1)}`}</M> m, <M>{`F_2 = ${F2}\\ \\text{kN}`}</M> az <M>{`x = ${szK(x2, 1)}`}</M> m
        helyen, lefelé. Számítsd ki az <M>{"A"}</M> reakciót, az I. testre ható <M>{"C_y"}</M> csuklóerőt, valamint <M>{"B_y"}</M>-t és a befogási nyomatékot (<M>{"M_B"}</M> ↶ pozitív)!
      </p>
    ),
    abra: (
      <OsszetettRajz
        rudak={[[0, 0, xB, 0]]}
        tamaszok={[{ x: xA, y: 0, tipus: "gorgo", cimke: "A" }, { x: xB, y: 0, tipus: "befogas", irany: "jobb", cimke: "B", dy: 28 }]}
        csuklok={[[xC, 0, "C"]]}
        erok={[{ x: x1, y: 0, F: F1, szog: -90, cimke: `F₁ = ${F1} kN` }, { x: x2, y: 0, F: F2, szog: -90, cimke: `F₂ = ${F2} kN` }]}
        testek={[{ x: xC / 2 + 0.5, y: -1, cimke: "I" }, { x: xC + LCB / 2, y: -1, cimke: "II" }]}
        meretek={[{ x1: 0, x2: xA, cimke: sz(xA, 1) }, { x1: xA, x2: xC, cimke: sz(LAC, 1) }, { x1: xC, x2: xB, cimke: sz(LCB, 1) }]}
      />
    ),
    sugo: (
      <p>
        A befogás egyedül három ismeretlent hoz, ezért a <em>bal</em> oldali test a befüggesztett rész (görgő 1 + csukló 2 = 3). I: <M>{"\\Mp{C}"}</M> → <M>{"A"}</M>, <M>{"\\Mp{A}"}</M> → <M>{"C_y"}</M>. A II. testre a
        csuklóerő ellentettje kerül; a befogás reakciói a két vetületi és a <M>{"B"}</M>-re írt nyomatéki egyenletből.
      </p>
    ),
    oszlopok: 4,
    mezok: [
      { id: "a", cimke: "A (↑ +)", egyseg: "kN", helyes: r.A, tizedes: 2 },
      { id: "cy", cimke: "C_y (az I. testre, ↑ +)", egyseg: "kN", helyes: r.Cy, tizedes: 2 },
      { id: "by", cimke: "B_y (↑ +)", egyseg: "kN", helyes: r.By, tizedes: 2 },
      { id: "mb", cimke: "M_B (↶ +)", egyseg: "kNm", helyes: r.MB, tizedes: 2 },
    ],
    megoldas: (
      <>
        <MB>{"\\text{I:}\\ (\\underline{F}_1, \\underline{A}, \\underline{C}) \\ekv \\underline{O}\\qquad \\text{II:}\\ (\\underline{F}_2, \\underline{C}', \\underline{B}_x, \\underline{B}_y, M_B) \\ekv \\underline{O}"}</MB>
        <MB>{`\\text{I:}\\ \\Mp{C}\\ ${tag(x1 - xC, -F1)} - ${szK(xC - xA, 1)}\\cdot A = 0 \\;\\Rightarrow\\; A = ${szK(r.A, 2)}\\ \\text{kN}`}</MB>
        <MB>{`\\text{I:}\\ \\Mp{A}\\ ${tag(x1 - xA, -F1)} + ${szK(LAC, 1)}\\cdot C_y = 0 \\;\\Rightarrow\\; C_y = ${szK(r.Cy, 2)}\\ \\text{kN};\\qquad \\Fx\\ C_x = 0`}</MB>
        <p>A II. testre a <M>{"C"}</M> pontban <M>{`${szK(r.Cy, 2)}`}</M> kN hat {r.Cy >= 0 ? "lefelé" : "felfelé"} (az I. testre hatónak az ellentettje):</p>
        <MB>{`\\text{II:}\\ \\Fy\\ ${tagE(-r.Cy, 2)} - ${F2} + B_y = 0 \\;\\Rightarrow\\; B_y = ${szK(r.By, 2)}\\ \\text{kN}`}</MB>
        <MB>{`\\text{II:}\\ \\Mp{B}\\ ${tag(xC - xB, -r.Cy, 1, 2)} ${tag(x2 - xB, -F2)} + M_B = 0 \\;\\Rightarrow\\; M_B = ${szK(r.MB, 2)}\\ \\text{kNm}`}</MB>
        <p>Ellenőrzés az egész szerkezetre írt nyomatéki egyenlettel az <M>{"x = 0"}</M> pontra: <M>{`${szK(r.ellenorzes, 2)} \\approx 0\\ \\checkmark`}</M>.</p>
        <p className="mt-2 text-[13px] text-petrol-600">
          {r.A < 0 ? "A negatív: a görgőnek lefelé kellene tartania — a bal konzol terhe a C körül felemelné a görgőt." : "A pozitív, a felvett irány a tényleges."} <M>{"M_B"}</M> {r.MB < 0 ? "negatív: a befogás az óramutató járásával egyezően forgat" : "pozitív"}.
        </p>
      </>
    ),
  };
}

/* ============================================================
   4. Csuklón terhelt szerkezet (tankönyv 5.9)
   ============================================================ */
function terheltCsukloFeladat() {
  const L1 = fel(3, 6), L2 = fel(1, 3), L3 = fel(2, 5);
  const xB = L1, xC = L1 + L2, xD = xC + L3;
  const x1 = fel(0.5, L1 - 0.5), F1 = egesz(6, 20);
  const x2 = fel(xC + 0.5, xD - 0.5), F3 = egesz(4, 14);
  const FC = egesz(4, 16);
  const r = gerberSzamit({ xB, xC, xD, terhekI: [{ x: x1, y: 0, Fx: 0, Fy: -F1 }], terhekII: [{ x: x2, y: 0, Fx: 0, Fy: -F3 }], FC: { Fx: 0, Fy: -FC } });
  return {
    adat: { terhelt: true },
    szoveg: (
      <p>
        Gerber-tartó (<M>{"A"}</M> csukló 0, <M>{"B"}</M> görgő <M>{`${szK(xB, 1)}`}</M> m, <M>{"C"}</M> csukló <M>{`${szK(xC, 1)}`}</M> m, <M>{"D"}</M> görgő <M>{`${szK(xD, 1)}`}</M> m), amelynek a{" "}
        <M>{"C"}</M> csuklóját közvetlenül <M>{`F_2 = ${FC}\\ \\text{kN}`}</M> függőleges erő terheli. További terhek: <M>{`F_1 = ${F1}\\ \\text{kN}`}</M> (<M>{`x = ${szK(x1, 1)}`}</M> m),{" "}
        <M>{`F_3 = ${F3}\\ \\text{kN}`}</M> (<M>{`x = ${szK(x2, 1)}`}</M> m), mind lefelé. Számítsd ki a II. testre és az I. testre ható csuklóerő függőleges komponensét (felfelé +), valamint <M>{"D"}</M>-t és{" "}
        <M>{"B"}</M>-t!
      </p>
    ),
    abra: (
      <OsszetettRajz
        rudak={[[0, 0, xD, 0]]}
        tamaszok={[{ x: 0, y: 0, tipus: "csuklo", cimke: "A" }, { x: xB, y: 0, tipus: "gorgo", cimke: "B" }, { x: xD, y: 0, tipus: "gorgo", cimke: "D" }]}
        csuklok={[[xC, 0]]}
        pontok={[{ x: xC, y: 0, cimke: "C", dy: 20 }]}
        erok={[{ x: x1, y: 0, F: F1, szog: -90, cimke: `F₁ = ${F1} kN` }, { x: xC, y: 0, F: FC, szog: -90, cimke: `F₂ = ${FC} kN` }, { x: x2, y: 0, F: F3, szog: -90, cimke: `F₃ = ${F3} kN` }]}
        testek={[{ x: xC / 2 + 0.3, y: -1, cimke: "I" }, { x: xC + L3 / 2 + 0.3, y: -1, cimke: "II" }]}
        meretek={[{ x1: 0, x2: x1, cimke: sz(x1, 1) }, { x1: x1, x2: xB, cimke: sz(xB - x1, 1) }, { x1: xB, x2: xC, cimke: sz(L2, 1) }, { x1: xC, x2: x2, cimke: sz(x2 - xC, 1) }, { x1: x2, x2: xD, cimke: sz(xD - x2, 1) }]}
      />
    ),
    sugo: (
      <p>
        A II. test ugyanúgy megy, mint a sima Gerber-tartónál (a csuklón lévő teher <em>nem</em> rá hat). Utána a csukló egyensúlya: rá <M>{"F_2"}</M> és a két csuklóerő ellentettje hat, tehát{" "}
        <M>{"C_{Iy} = -F_2 - C_{IIy}"}</M>. Az I. testre így <M>{"F_2 + C_{IIy}"}</M> hat lefelé a <M>{"C"}</M> pontban.
      </p>
    ),
    oszlopok: 4,
    mezok: [
      { id: "cii", cimke: "C_IIy (a II. testre, ↑ +)", egyseg: "kN", helyes: r.Cy, tizedes: 2 },
      { id: "ci", cimke: "C_Iy (az I. testre, ↑ +)", egyseg: "kN", helyes: r.CIy, tizedes: 2 },
      { id: "d", cimke: "D (↑ +)", egyseg: "kN", helyes: r.D, tizedes: 2 },
      { id: "b", cimke: "B (↑ +)", egyseg: "kN", helyes: r.B, tizedes: 2 },
    ],
    megoldas: (
      <>
        <MB>{"\\text{II:}\\ (\\underline{F}_3, \\underline{D}, \\underline{C}_{II}) \\ekv \\underline{O}\\qquad \\text{C:}\\ (\\underline{F}_2, \\underline{C}'_I, \\underline{C}'_{II}) \\ekv \\underline{O}\\qquad \\text{I:}\\ (\\underline{F}_1, \\underline{A}, \\underline{B}, \\underline{C}_I) \\ekv \\underline{O}"}</MB>
        <MB>{`\\text{II:}\\ \\Mp{C}\\ ${tag(x2 - xC, -F3)} + ${szK(L3, 1)}\\cdot D = 0 \\;\\Rightarrow\\; D = ${szK(r.D, 2)}\\ \\text{kN}`}</MB>
        <MB>{`\\text{II:}\\ \\Mp{D}\\ ${tag(xD - x2, F3)} - ${szK(L3, 1)}\\cdot C_{IIy} = 0 \\;\\Rightarrow\\; C_{IIy} = ${szK(r.Cy, 2)}\\ \\text{kN}`}</MB>
        <p>A csuklóra lefelé hat <M>{"F_2"}</M> és <M>{"C'_{II} = -C_{II}"}</M>; ezeket <M>{"C'_I"}</M> tartja:</p>
        <MB>{`\\text{C:}\\ \\Fy\\ -${FC} - C_{Iy} ${tagE(-r.Cy, 2)} = 0 \\;\\Rightarrow\\; C_{Iy} = ${szK(r.CIy, 2)}\\ \\text{kN}`}</MB>
        <p>Az I. testre tehát <M>{`${szK(Math.abs(r.CIy), 2)}`}</M> kN hat lefelé a <M>{"C"}</M> pontban:</p>
        <MB>{`\\text{I:}\\ \\Mp{A}\\ ${tag(x1, -F1)} ${tag(xC, r.CIy, 1, 2)} + ${szK(xB, 1)}\\cdot B = 0 \\;\\Rightarrow\\; B = ${szK(r.B, 2)}\\ \\text{kN}`}</MB>
        <MB>{`\\text{I:}\\ \\Mp{B}\\ ${tag(x1 - xB, -F1)} ${tag(xC - xB, r.CIy, 1, 2)} - ${szK(xB, 1)}\\cdot A_y = 0 \\;\\Rightarrow\\; A_y = ${szK(r.Ay, 2)}\\ \\text{kN}`}</MB>
        <p>Ellenőrzés az egészre — a csuklóerők kiesnek, de <M>{"F_2"}</M> benne marad:</p>
        <MB>{`\\Sigma:\\ \\Fy\\ ${tagE(r.Ay, 2)} ${tagE(r.B, 2)} ${tagE(r.D, 2)} - ${F1} - ${FC} - ${F3} = ${szK(r.ellenorzes, 2)} \\approx 0\\ \\checkmark`}</MB>
        <p className="mt-2 text-[13px] text-petrol-600">
          A két csuklóerő különbsége éppen a csuklón ható teher: <M>{`${szK(r.Cy, 2)} - (${szK(r.CIy, 2)}) = ${szK(FC, 0)}`}</M> kN.
        </p>
      </>
    ),
  };
}

/* ============================================================
   5. Függesztőmű rúdereje: két rúddal tartott terhelt csukló (H06/5–6)
   ============================================================ */
function fuggesztomuRudFeladat() {
  const valtozat = valaszt([
    { xE: 4, h: 3 },
    { xE: 8, h: 6 },
    { xE: 3, h: 4 },
    { xE: 6, h: 4.5 },
  ]);
  const a = fel(1, 2.5);
  const xA = a, xE = valtozat.xE, h = valtozat.h;
  const xB = xE + fel(3, 6);
  const F = egesz(6, 24);
  const r = fuggesztettCsukloSzamit({ xA, xB, xE, h, Fx: 0, Fy: -F });
  return {
    adat: { fuggeszto: true },
    szoveg: (
      <p>
        A gerendát (0-tól <M>{`${szK(xB, 1)}`}</M> m-ig) az <M>{"A"}</M> görgő (<M>{`x = ${szK(xA, 1)}`}</M>) és a <M>{"B"}</M> csukló (a jobb végen) támasztja. Az <M>{"E"}</M> pontban (<M>{`x = ${szK(xE, 1)}`}</M>){" "}
        <M>{`h = ${szK(h, 1)}`}</M> m magas oszlop áll mereven a gerendán (teteje <M>{"C"}</M>). A <M>{"D"}</M> csukló a gerenda bal vége fölött <M>{"h"}</M> magasan van, a vízszintes <M>{"DC"}</M> és a ferde{" "}
        <M>{"DE"}</M> rúd tartja; <M>{"D"}</M>-t <M>{`F = ${F}\\ \\text{kN}`}</M> függőleges erő terheli. Számítsd ki a két rúderőt (húzott +) és a reakciókat!
      </p>
    ),
    abra: (
      <OsszetettRajz
        rudak={[[0, 0, xB, 0], [xE, 0, xE, h]]}
        rudElemek={[[0, h, xE, h, "S_DC"], [0, h, xE, 0, "S_DE"]]}
        tamaszok={[{ x: xA, y: 0, tipus: "gorgo", cimke: "A" }, { x: xB, y: 0, tipus: "csuklo", cimke: "B" }]}
        erok={[{ x: 0, y: h, F, szog: -90, cimke: `F = ${F} kN` }]}
        pontok={[{ x: 0, y: h, cimke: "D", dx: -12, dy: -8 }, { x: xE, y: h, cimke: "C", dx: 12, dy: -6 }, { x: xE, y: 0, cimke: "E", dx: 12, dy: 20 }]}
        testek={[{ x: xB - 1, y: -1, cimke: "I" }]}
        meretek={[{ x1: 0, x2: xA, cimke: sz(xA, 1) }, { x1: xA, x2: xE, cimke: sz(xE - xA, 1) }, { x1: xE, x2: xB, cimke: sz(xB - xE, 1) }]}
        fuggMeretek={[{ y1: 0, y2: h, cimke: `h = ${sz(h, 1)}` }]}
      />
    ),
    sugo: (
      <p>
        A <M>{"D"}</M> csuklóra három erő hat (<M>{"F"}</M> és a két rúderő), közös metszéspontú erőrendszer: két vetületi egyenlet. A <M>{"DE"}</M> rúd egységvektora <M>{"D"}</M>-ből <M>{"E"}</M> felé{" "}
        <M>{"(x_E;\\ -h)/\\ell"}</M>. A reakciókhoz elég az egész szerkezet: a rúderők belső erők, kívülről csak <M>{"F"}</M> hat.
      </p>
    ),
    oszlopok: 4,
    mezok: [
      { id: "sde", cimke: "S_DE (húzott +)", egyseg: "kN", helyes: r.SDE, tizedes: 2 },
      { id: "sdc", cimke: "S_DC (húzott +)", egyseg: "kN", helyes: r.SDC, tizedes: 2 },
      { id: "a", cimke: "A (↑ +)", egyseg: "kN", helyes: r.A, tizedes: 2 },
      { id: "by", cimke: "B_y (↑ +)", egyseg: "kN", helyes: r.By, tizedes: 2 },
    ],
    megoldas: (
      <>
        <p>
          <strong>Elkülönítés:</strong> a <M>{"DE"}</M> rúd hossza <M>{`\\ell = \\sqrt{${szK(xE, 1)}^2 + ${szK(h, 1)}^2} = ${szK(r.lDE, 3)}`}</M> m, egységvektora <M>{`(${szK(r.eDE[0], 4)};\\ ${szK(r.eDE[1], 4)})`}</M>.
          A <M>{"DC"}</M> rúd vízszintes. A csuklóra a rúderőket húzottnak (<M>{"D"}</M>-től a rúd másik vége felé) vesszük fel.
        </p>
        <MB>{"\\text{D:}\\ (\\underline{F}, \\underline{S}_{DC}, \\underline{S}_{DE}) \\ekv \\underline{O}\\qquad \\Sigma:\\ (\\underline{F}, \\underline{A}, \\underline{B}) \\ekv \\underline{O}"}</MB>
        <MB>{`\\text{D:}\\ \\Fy\\ -${F} ${tagE(r.eDE[1], 4)}\\cdot S_{DE} = 0 \\;\\Rightarrow\\; S_{DE} = ${szK(r.SDE, 2)}\\ \\text{kN}`}</MB>
        <MB>{`\\text{D:}\\ \\Fx\\ S_{DC} + ${szK(r.eDE[0], 4)}\\cdot S_{DE} = 0 \\;\\Rightarrow\\; S_{DC} = ${szK(r.SDC, 2)}\\ \\text{kN}`}</MB>
        <p>Az egész szerkezetre kívülről csak <M>{"F"}</M> hat a <M>{"D"}</M> pontban (<M>{"x = 0"}</M>):</p>
        <MB>{`\\Sigma:\\ \\Mp{B}\\ ${tag(xB, F)} - ${szK(xB - xA, 1)}\\cdot A = 0 \\;\\Rightarrow\\; A = ${szK(r.A, 2)}\\ \\text{kN}`}</MB>
        <MB>{`\\Sigma:\\ \\Fy\\ A + B_y - ${F} = 0 \\;\\Rightarrow\\; B_y = ${szK(r.By, 2)}\\ \\text{kN};\\qquad \\Fx\\ B_x = 0`}</MB>
        <p className="mt-2 text-[13px] text-petrol-600">
          A ferde rúd nyomott (<M>{"S_{DE} < 0"}</M>), a vízszintes húzott. <M>{"B_y"}</M> {r.By < 0 ? "negatív: a B csukló lefelé tartja a gerendát, mert a teher az A-tól balra lóg" : "pozitív"}.
        </p>
      </>
    ),
  };
}

/* ============================================================
   6. Hány ismeretlen, hány egyenlet? — a fokszám-számlálás dobozként
   ============================================================ */
const SZERKEZETEK = [
  { nev: "Gerber-tartó (csukló + görgő + belső csukló + görgő)", testek: 2, kulso: ["csukló (2)", "görgő (1)", "görgő (1)"], belso: ["belső csukló (2)"], csuklok: 0 },
  { nev: "háromcsuklós keret (két külső csukló, egy belső csukló)", testek: 2, kulso: ["csukló (2)", "csukló (2)"], belso: ["belső csukló (2)"], csuklok: 0 },
  { nev: "Gerber-tartó befogással (görgő + belső csukló + befogás)", testek: 2, kulso: ["görgő (1)", "befogás (3)"], belso: ["belső csukló (2)"], csuklok: 0 },
  { nev: "háromtestű Gerber-lánc (csukló, görgő, görgő, görgő; két belső csukló)", testek: 3, kulso: ["csukló (2)", "görgő (1)", "görgő (1)", "görgő (1)"], belso: ["belső csukló (2)", "belső csukló (2)"], csuklok: 0 },
  { nev: "két test egy belső csuklóval és egy belső rúddal, kívül csukló + görgő (5.11)", testek: 2, kulso: ["csukló (2)", "görgő (1)"], belso: ["belső csukló (2)", "belső rúd (1)"], csuklok: 0 },
  { nev: "függesztőműves tartó: két gerendatest, belső csukló, 5 rúd, két rúdcsukló (5.13)", testek: 2, kulso: ["csukló (2)", "görgő (1)"], belso: ["belső csukló (2)", "5 rúd (5×1)"], csuklok: 2 },
  { nev: "két test két belső rúddal összekötve, mindkettő csuklóval a földhöz (5.15)", testek: 2, kulso: ["csukló (2)", "csukló (2)"], belso: ["rúd (1)", "rúd (1)"], csuklok: 0 },
  { nev: "háromcsuklós keret, de a B támasz csak görgő", testek: 2, kulso: ["csukló (2)", "görgő (1)"], belso: ["belső csukló (2)"], csuklok: 0 },
  { nev: "két test, két belső csuklóval összekötve, kívül csukló + görgő", testek: 2, kulso: ["csukló (2)", "görgő (1)"], belso: ["belső csukló (2)", "belső csukló (2)"], csuklok: 0 },
  { nev: "zárt keret három belső csuklóval, kívül csukló + görgő (5.18)", testek: 3, kulso: ["csukló (2)", "görgő (1)"], belso: ["belső csukló (2)", "belső csukló (2)", "belső csukló (2)"], csuklok: 0 },
];
const fokszam = (s) => parseInt(s.match(/\((\d+)(?:×(\d+))?\)/)[1], 10) * (s.match(/×(\d+)\)/) ? parseInt(s.match(/×(\d+)\)/)[1], 10) : 1);

function szamlalasFeladat() {
  const szk = valaszt(SZERKEZETEK);
  const ism = [...szk.kulso, ...szk.belso].reduce((s, k) => s + fokszam(k), 0);
  const egy = 3 * szk.testek + 2 * szk.csuklok;
  const fok = ism - egy;
  return {
    adat: { szamlalas: true },
    szoveg: (
      <p>
        Szerkezet: <strong>{szk.nev}</strong>. Külső kényszerek: {szk.kulso.join(", ")}; belső kényszerek: {szk.belso.join(", ")}. A merev testek száma {szk.testek}
        {szk.csuklok ? `, és ${szk.csuklok} olyan csukló van, amelyre több mint két erő hat (rúdcsuklók)` : ""}. Hány ismeretlen skalár jelenik meg az elkülönítéskor, hány független egyensúlyi egyenlet
        írható fel, és mennyi a különbségük (ismeretlen − egyenlet)?
      </p>
    ),
    sugo: (
      <p>
        Ismeretlen = a külső kényszerek fokszáma + a belső kényszerek fokszáma (belső csukló 2, belső rúd 1). Egyenlet = 3 × testek + 2 × (több mint két erővel terhelt csuklók). Nulla különbség: statikailag
        határozott (ha a kényszerek elrendezése nem degenerált); pozitív: határozatlan; negatív: mechanizmus.
      </p>
    ),
    oszlopok: 3,
    mezok: [
      { id: "ism", cimke: "ismeretlenek száma", egyseg: "", helyes: ism, tizedes: 0, tures: 0.1 },
      { id: "egy", cimke: "egyenletek száma", egyseg: "", helyes: egy, tizedes: 0, tures: 0.1 },
      { id: "fok", cimke: "ismeretlen − egyenlet", egyseg: "", helyes: fok, tizedes: 0, tures: 0.1 },
    ],
    megoldas: (
      <>
        <MB>{`n = ${[...szk.kulso, ...szk.belso].map(fokszam).join(" + ")} = ${ism},\\qquad e = 3\\cdot ${szk.testek}${szk.csuklok ? ` + 2\\cdot ${szk.csuklok}` : ""} = ${egy}`}</MB>
        <p>
          {fok === 0 && <>Az ismeretlenek és az egyenletek száma egyenlő: a szerkezet <strong>statikailag határozott</strong> — ha a kényszerek elrendezése nem degenerált (erről a 7. fejezet szól).</>}
          {fok > 0 && <>Több az ismeretlen, mint az egyenlet: <strong>{fok}-szeresen statikailag határozatlan</strong>; a reakciók csak az alakváltozás figyelembevételével számíthatók.</>}
          {fok < 0 && <>Kevesebb a kényszer, mint a mozgáslehetőség: ez <strong>mechanizmus</strong>, nem tartó — pl. a görgővel megtámasztott „háromcsuklós” keret eldőlne.</>}
        </p>
      </>
    ),
  };
}

/* ---------- a szekció ---------- */

export const GENERATOROK = [
  { cim: "Gerber-tartó reakciói és csuklóereje", fn: gerberFeladat },
  { cim: "Háromcsuklós tartó", fn: haromcsuklosFeladat },
  { cim: "Konzolos összetett tartó (Gerber befogással)", fn: gerberBefogasFeladat },
  { cim: "Csuklón terhelt szerkezet", fn: terheltCsukloFeladat },
  { cim: "Függesztőmű rúdereje — két rúddal tartott csukló", fn: fuggesztomuRudFeladat },
  { cim: "Hány ismeretlen, hány egyenlet?", fn: szamlalasFeladat },
];

export default function GyakorloSzekcio() {
  return (
    <>
      <GyakorloDoboz cim="Gerber-tartó reakciói és csuklóereje" leiras="A modul alapfeladata: előbb a befüggesztett rész, aztán a csuklóerő ellentettjével a fix rész." generator={gerberFeladat} oszlopok={4} />
      <GyakorloDoboz cim="Háromcsuklós tartó" leiras="Azonos magasságú támaszok: az egészre írt nyomatéki egyenletek, majd a C-re írt egy testre — a vízszintes reakció mindig megjelenik." generator={haromcsuklosFeladat} oszlopok={4} />
      <GyakorloDoboz cim="Konzolos összetett tartó (Gerber befogással)" leiras="A tankönyv 5.5. ábrája: a bal oldal a befüggesztett rész, a befogott jobb oldal a fix." generator={gerberBefogasFeladat} oszlopok={4} />
      <GyakorloDoboz cim="Csuklón terhelt szerkezet" leiras="A csuklót külön kell elkülöníteni: a két testre ható csuklóerő különbsége a csuklón ható teher." generator={terheltCsukloFeladat} oszlopok={4} />
      <GyakorloDoboz cim="Függesztőmű rúdereje — két rúddal tartott csukló" leiras="H06/5–6: a D csukló közös metszéspontú erőrendszere adja a rúderőket, az egész szerkezet a reakciókat." generator={fuggesztomuRudFeladat} oszlopok={4} />
      <GyakorloDoboz cim="Hány ismeretlen, hány egyenlet?" leiras="A fokszám-számlálás dobozként: 3 egyenlet testenként, 2 a terhelt csuklókra; a kényszerek fokszámai az ismeretlenek." generator={szamlalasFeladat} oszlopok={3} />
      <div className="mt-10 mb-4 flex items-center gap-3">
        <span className="h-px flex-1 bg-petrol-200" />
        <span className="text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">További feladattípusok</span>
        <span className="h-px flex-1 bg-petrol-200" />
      </div>
      <GyakorloExtra />
    </>
  );
}
