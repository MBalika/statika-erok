"use client";

import GyakorloDoboz from "@/components/GyakorloDoboz";
import GyakorloExtra, { TartoRajz, egesz, valaszt, fel, helyek, tag, tagE } from "./GyakorloExtra";
import { M, MB } from "@/components/ui/Keplet";
import { szK } from "@/lib/szamok";

const FOK = Math.PI / 180;
const zar = (v) => (v < 0 ? `(${szK(v, 1)})` : szK(v, 1));

/* ============================================================
   1. Kéttámaszú tartó koncentrált erőkkel (két függőleges + egy ferde)
   ============================================================ */

function kettamaszuErokFeladat() {
  const L = fel(4, 8);
  const [x1, x2, x3] = helyek(3, 0.5, L - 0.5);
  const F1 = egesz(4, 16);
  const F2 = egesz(4, 16);
  const F3 = egesz(4, 16);
  const alfa = valaszt([30, 45, 60]);
  const jobbra = Math.random() < 0.5;
  const beta = jobbra ? -alfa : -180 + alfa;
  const F3x = F3 * Math.cos(beta * FOK);
  const F3y = F3 * Math.sin(beta * FOK); // negatív (lefelé)
  const B = (x1 * F1 + x2 * F2 - x3 * F3y) / L;
  const Ay = ((L - x1) * F1 + (L - x2) * F2 - (L - x3) * F3y) / L;
  const Ax = -F3x;
  const ell = Ay + B - F1 - F2 + F3y;

  return {
    adat: {
      ismeretlenek: [
        { id: "ax", pont: [0, 0], irany: [1, 0] },
        { id: "ay", pont: [0, 0], irany: [0, 1] },
        { id: "b", pont: [L, 0], irany: [0, 1] },
      ],
      terhek: [
        { pont: [x1, 0], F: [0, -F1] },
        { pont: [x2, 0], F: [0, -F2] },
        { pont: [x3, 0], F: [F3x, F3y] },
      ],
    },
    szoveg: (
      <p>
        Egy <M>{`L = ${szK(L, 1)}\\ \\text{m}`}</M> támaszközű kéttámaszú tartót (bal végén <M>{"A"}</M> csukló, jobb végén <M>{"B"}</M> vízszintes síkon gördülő görgő) három erő terhel, a helyüket <M>{"A"}</M>-tól mérjük:{" "}
        <M>{`F_1 = ${F1}\\ \\text{kN}`}</M> függőlegesen lefelé <M>{`x_1 = ${szK(x1, 1)}`}</M> m-nél, <M>{`F_2 = ${F2}\\ \\text{kN}`}</M> függőlegesen lefelé <M>{`x_2 = ${szK(x2, 1)}`}</M> m-nél, valamint{" "}
        <M>{`F_3 = ${F3}\\ \\text{kN}`}</M> az <M>{`x_3 = ${szK(x3, 1)}`}</M> m helyen, amely {jobbra ? "jobbra" : "balra"}-lefelé mutat és a tartó tengelyével <M>{`\\alpha = ${alfa}^\\circ`}</M>-ot zár be. Számítsd ki a
        reakciókat a felvett irányokkal: <M>{"A_x"}</M> jobbra, <M>{"A_y"}</M> felfelé, <M>{"B"}</M> felfelé!
      </p>
    ),
    abra: (
      <TartoRajz
        xMax={L}
        tamaszok={[
          { tipus: "csuklo", x: 0, cimke: "A" },
          { tipus: "gorgo", x: L, cimke: "B" },
        ]}
        erok={[
          { x: x1, F: F1, szog: -90, cimke: `F₁ = ${F1} kN` },
          { x: x2, F: F2, szog: -90, cimke: `F₂ = ${F2} kN` },
          { x: x3, F: F3, szog: beta, cimke: `F₃ = ${F3} kN, ${alfa}°` },
        ]}
      />
    ),
    sugo: (
      <p>
        A csuklóra írt nyomatéki egyenletben csak <M>{"B"}</M> marad, a görgőre írtban csak <M>{"A_y"}</M>, a vízszintes vetületi egyenletben csak <M>{"A_x"}</M>. A ferde erőt előbb bontsd fel: <M>{"F_3\\cos\\alpha"}</M>{" "}
        vízszintes, <M>{"F_3\\sin\\alpha"}</M> függőleges komponens — a nyomatéki egyenletekben csak a függőleges komponens forgat, mert a vízszintes hatásvonala a tartó tengelye.
      </p>
    ),
    oszlopok: 3,
    mezok: [
      { id: "ax", cimke: "A_x (jobbra +)", egyseg: "kN", helyes: Ax, tizedes: 2 },
      { id: "ay", cimke: "A_y (felfelé +)", egyseg: "kN", helyes: Ay, tizedes: 2 },
      { id: "b", cimke: "B (felfelé +)", egyseg: "kN", helyes: B, tizedes: 2 },
    ],
    megoldas: (
      <>
        <p>
          <strong>Elkülönítés:</strong> a csukló helyett <M>{"A_x"}</M> (jobbra) és <M>{"A_y"}</M> (felfelé), a görgő helyett a függőleges <M>{"B"}</M> (felfelé). A ferde erő komponensei:{" "}
          <M>{`F_{3x} = ${jobbra ? "" : "-"}${F3}\\cos ${alfa}^\\circ = ${szK(F3x, 3)}`}</M>, <M>{`F_{3y} = -${F3}\\sin ${alfa}^\\circ = ${szK(F3y, 3)}`}</M> kN.
        </p>
        <MB>{"(\\underline{F}_1, \\underline{F}_2, \\underline{F}_3, \\underline{A}, \\underline{B}) \\ekv \\underline{O}"}</MB>
        <p>Nyomatéki egyenlet a csuklóra — a lefelé mutató erők a ponttól jobbra az óramutató irányába (negatívan) forgatnak:</p>
        <MB>{`\\Mp{A} ${tag(x1, -F1)} ${tag(x2, -F2)} ${tag(x3, F3y, 1, 3)} + ${szK(L, 1)}\\cdot B = 0 \\;\\Rightarrow\\; B = ${szK(B, 2)}\\ \\text{kN}`}</MB>
        <p>Nyomatéki egyenlet a görgőre — itt <M>{"B"}</M> és <M>{"A_x"}</M> hatásvonala is átmegy, <M>{"A_y"}</M> az egyetlen ismeretlen:</p>
        <MB>{`\\Mp{B} ${tag(L - x1, F1)} ${tag(L - x2, F2)} ${tag(L - x3, -F3y, 1, 3)} - ${szK(L, 1)}\\cdot A_y = 0 \\;\\Rightarrow\\; A_y = ${szK(Ay, 2)}\\ \\text{kN}`}</MB>
        <p>Vízszintes vetületi egyenlet — a függőleges erők kiesnek:</p>
        <MB>{`\\Fx A_x ${tagE(F3x, 3)} = 0 \\;\\Rightarrow\\; A_x = ${szK(Ax, 2)}\\ \\text{kN}`}</MB>
        <p>Ellenőrzés a nem használt függőleges vetületi egyenlettel:</p>
        <MB>{`\\Fy ${tagE(Ay, 2)} ${tagE(B, 2)} - ${F1} - ${F2} ${tagE(F3y, 3)} = ${szK(ell, 2)} \\approx 0 \\;\\checkmark`}</MB>
        <p className="mt-2 text-[13px] text-petrol-600">
          <M>{"A_x"}</M> {Ax < 0 ? "negatív: a tényleges irány balra" : "pozitív: a felvett irány, jobbra, a tényleges"} — a csukló a ferde erő vízszintes komponensét ellensúlyozza. <M>{"A_y"}</M> és <M>{"B"}</M> pozitív, a
          felvett irányuk jó; az eredményvázlaton <M>{`A_x = ${szK(Math.abs(Ax), 2)}`}</M> kN {Ax < 0 ? "balra" : "jobbra"}, <M>{`A_y = ${szK(Ay, 2)}`}</M>, <M>{`B = ${szK(B, 2)}`}</M> kN felfelé szerepel.
        </p>
      </>
    ),
  };
}

/* ============================================================
   2. Kéttámaszú tartó megoszló teherrel
   ============================================================ */

function kettamaszuMegoszloFeladat() {
  const L = fel(4, 8);
  const p = egesz(2, 8);
  let a = fel(0, L - 1.5);
  let b = fel(a + 1, L);
  if (Math.random() < 0.3) {
    a = 0;
    b = L;
  }
  let xF = fel(0.5, L - 0.5);
  const F = egesz(4, 16);
  const Q = p * (b - a);
  const xQ = (a + b) / 2;
  const B = (xQ * Q + xF * F) / L;
  const Ay = ((L - xQ) * Q + (L - xF) * F) / L;
  const ell = Ay + B - Q - F;

  return {
    adat: {
      ismeretlenek: [
        { id: "ax", pont: [0, 0], irany: [1, 0] },
        { id: "ay", pont: [0, 0], irany: [0, 1] },
        { id: "b", pont: [L, 0], irany: [0, 1] },
      ],
      terhek: [
        { pont: [xQ, 0], F: [0, -Q] },
        { pont: [xF, 0], F: [0, -F] },
      ],
    },
    szoveg: (
      <p>
        Egy <M>{`L = ${szK(L, 1)}\\ \\text{m}`}</M> támaszközű kéttámaszú tartón (<M>{"A"}</M> csukló balra, <M>{"B"}</M> görgő jobbra) az <M>{`x = ${szK(a, 1)}`}</M> m és <M>{`x = ${szK(b, 1)}`}</M> m közötti szakaszon
        egyenletesen megoszló, <M>{`p = ${p}\\ \\text{kN/m}`}</M> intenzitású, lefelé mutató teher hat, továbbá az <M>{`x_F = ${szK(xF, 1)}`}</M> m helyen egy <M>{`F = ${F}\\ \\text{kN}`}</M> függőleges erő. Mekkorák a
        függőleges reakciók? (Vízszintes teher nincs, ezért <M>{"A_x = 0"}</M>.)
      </p>
    ),
    abra: (
      <TartoRajz
        xMax={L}
        tamaszok={[
          { tipus: "csuklo", x: 0, cimke: "A" },
          { tipus: "gorgo", x: L, cimke: "B" },
        ]}
        megoszlok={[{ x1: a, x2: b, p, cimke: `p = ${p} kN/m` }]}
        erok={[{ x: xF, F, szog: -90, cimke: `F = ${F} kN` }]}
      />
    ),
    sugo: (
      <p>
        A megoszló terhet a reakciószámításhoz az eredőjével helyettesítheted: <M>{"Q = p\\,(b - a)"}</M> a szakasz <em>felezőpontjában</em> — nem a tartó közepén! Utána a két nyomatéki egyenlet a két
        támaszra.
      </p>
    ),
    mezok: [
      { id: "ay", cimke: "A_y (felfelé +)", egyseg: "kN", helyes: Ay, tizedes: 2 },
      { id: "b", cimke: "B (felfelé +)", egyseg: "kN", helyes: B, tizedes: 2 },
    ],
    megoldas: (
      <>
        <p>
          <strong>Elkülönítés:</strong> <M>{"A_x"}</M> jobbra, <M>{"A_y"}</M> felfelé, <M>{"B"}</M> felfelé. A megoszló teher eredője{" "}
          <M>{`Q = ${p}\\cdot(${szK(b, 1)} - ${szK(a, 1)}) = ${szK(Q, 2)}`}</M> kN, támadáspontja a szakasz felezőpontja, <M>{`x_Q = ${szK(xQ, 2)}`}</M> m.
        </p>
        <MB>{"(\\underline{p}, \\underline{F}, \\underline{A}, \\underline{B}) \\ekv \\underline{O}"}</MB>
        <MB>{`\\Fx A_x = 0`}</MB>
        <MB>{`\\Mp{A} ${tag(xQ, -Q, 2, 2)} ${tag(xF, -F)} + ${szK(L, 1)}\\cdot B = 0 \\;\\Rightarrow\\; B = \\frac{${szK(xQ * Q + xF * F, 2)}}{${szK(L, 1)}} = ${szK(B, 2)}\\ \\text{kN}`}</MB>
        <MB>{`\\Mp{B} ${tag(L - xQ, Q, 2, 2)} ${tag(L - xF, F)} - ${szK(L, 1)}\\cdot A_y = 0 \\;\\Rightarrow\\; A_y = \\frac{${szK((L - xQ) * Q + (L - xF) * F, 2)}}{${szK(L, 1)}} = ${szK(Ay, 2)}\\ \\text{kN}`}</MB>
        <p>Ellenőrzés a függőleges vetületi egyenlettel:</p>
        <MB>{`\\Fy ${tagE(Ay, 2)} ${tagE(B, 2)} - ${szK(Q, 2)} - ${F} = ${szK(ell, 2)} \\approx 0 \\;\\checkmark`}</MB>
        <p className="mt-2 text-[13px] text-petrol-600">
          Mindkét reakció pozitív, a felvett (felfelé) irány a tényleges. Az összegük <M>{`${szK(Ay + B, 2)}`}</M> kN = a teljes teher — és a nagyobb reakció azon az oldalon van, amelyikhez a teher közelebb esik.
        </p>
      </>
    ),
  };
}

/* ============================================================
   3. Befogott konzol: erő + megoszló + koncentrált nyomaték
   ============================================================ */

function konzolFeladat() {
  const L = fel(2, 5);
  const a = fel(0, L - 1);
  const b = fel(a + 1, L);
  const p = egesz(2, 8);
  const Q = p * (b - a);
  const xQ = (a + b) / 2;
  const xF = fel(0.5, L);
  const F = egesz(4, 16);
  const alfa = valaszt([30, 45, 60, 90]);
  const jobbra = Math.random() < 0.5;
  const beta = alfa === 90 ? -90 : jobbra ? -alfa : -180 + alfa;
  const Fx = F * Math.cos(beta * FOK);
  const Fy = F * Math.sin(beta * FOK);
  let xM = fel(0.5, L);
  if (Math.abs(xM - xF) < 0.75) xM = xM - 1 >= 0.5 ? xM - 1 : xM + 1;
  const Mk = egesz(3, 20) * (Math.random() < 0.5 ? 1 : -1);
  const Ax = -Fx;
  const Ay = Q - Fy;
  const MA = -(xF * Fy - xQ * Q + Mk);
  const ellB = MA - L * Ay + (xF - L) * Fy - (xQ - L) * Q + Mk;

  return {
    adat: {
      ismeretlenek: [
        { id: "ax", pont: [0, 0], irany: [1, 0] },
        { id: "ay", pont: [0, 0], irany: [0, 1] },
        { id: "ma", nyomatek: true },
      ],
      terhek: [
        { pont: [xF, 0], F: [Fx, Fy] },
        { pont: [xQ, 0], F: [0, -Q] },
        { M: Mk },
      ],
    },
    szoveg: (
      <p>
        Egy <M>{`L = ${szK(L, 1)}\\ \\text{m}`}</M> hosszú vízszintes konzol bal végét (<M>{"A"}</M>) a falba mereven befogták, a jobb vége (<M>{"B"}</M>) szabad. Terhei (<M>{"A"}</M>-tól mérve): az{" "}
        <M>{`x = ${szK(a, 1)}`}</M> és <M>{`${szK(b, 1)}`}</M> m közötti szakaszon <M>{`p = ${p}\\ \\text{kN/m}`}</M> egyenletesen megoszló teher lefelé; az <M>{`x_F = ${szK(xF, 1)}`}</M> m helyen{" "}
        <M>{`F = ${F}\\ \\text{kN}`}</M> erő, amely {alfa === 90 ? "függőlegesen lefelé mutat" : <>{jobbra ? "jobbra" : "balra"}-lefelé mutat, a tengellyel <M>{`\\alpha = ${alfa}^\\circ`}</M>-ot bezárva</>}; az{" "}
        <M>{`x_M = ${szK(xM, 1)}`}</M> m helyen <M>{`M = ${Math.abs(Mk)}\\ \\text{kNm}`}</M> koncentrált nyomaték, amely {Mk > 0 ? "az óramutatóval ellentétesen" : "az óramutató járásával egyezően"} forgat. Számítsd ki a
        befogás reakcióit (<M>{"A_x"}</M> jobbra, <M>{"A_y"}</M> felfelé, <M>{"M_A"}</M> az óramutatóval ellentétesen pozitív)!
      </p>
    ),
    abra: (
      <TartoRajz
        xMax={L}
        tamaszok={[{ tipus: "befogas", x: 0, irany: "bal", cimke: "A" }]}
        megoszlok={[{ x1: a, x2: b, p, cimke: `p = ${p} kN/m` }]}
        erok={[{ x: xF, F, szog: beta, cimke: alfa === 90 ? `F = ${F} kN` : `F = ${F} kN, ${alfa}°` }]}
        nyomatekok={[{ x: xM, M: Mk, cimke: `M = ${Math.abs(Mk)} kNm` }]}
        pontok={[{ x: L, cimke: "B", dy: 22 }]}
      />
    ),
    sugo: (
      <p>
        A befogásnál a legegyszerűbb a recept: <M>{"M_A"}</M> a vetületi egyenletekben nem szerepel, tehát <M>{"\\Fx"}</M> adja <M>{"A_x"}</M>-et, <M>{"\\Fy"}</M> adja <M>{"A_y"}</M>-t, és a befogás pontjára
        írt nyomatéki egyenlet adja <M>{"M_A"}</M>-t. A koncentrált nyomaték csak az utóbbiba kerül — a helye nem számít, az előjele igen.
      </p>
    ),
    oszlopok: 3,
    mezok: [
      { id: "ax", cimke: "A_x (jobbra +)", egyseg: "kN", helyes: Ax, tizedes: 2 },
      { id: "ay", cimke: "A_y (felfelé +)", egyseg: "kN", helyes: Ay, tizedes: 2 },
      { id: "ma", cimke: "M_A (↶ +)", egyseg: "kNm", helyes: MA, tizedes: 2 },
    ],
    megoldas: (
      <>
        <p>
          <strong>Elkülönítés:</strong> a befogás helyett <M>{"A_x"}</M> jobbra, <M>{"A_y"}</M> felfelé és <M>{"M_A"}</M> az óramutatóval ellentétesen. A megoszló teher eredője{" "}
          <M>{`Q = ${p}\\cdot ${szK(b - a, 1)} = ${szK(Q, 2)}`}</M> kN az <M>{`x_Q = ${szK(xQ, 2)}`}</M> m helyen; a ferde erő komponensei <M>{`F_x = ${szK(Fx, 3)}`}</M>, <M>{`F_y = ${szK(Fy, 3)}`}</M> kN.
        </p>
        <MB>{"(\\underline{F}, \\underline{p}, M, \\underline{A}, M_A) \\ekv \\underline{O}"}</MB>
        <MB>{`\\Fx A_x ${tagE(Fx, 3)} = 0 \\;\\Rightarrow\\; A_x = ${szK(Ax, 2)}\\ \\text{kN}`}</MB>
        <MB>{`\\Fy A_y ${tagE(Fy, 3)} - ${szK(Q, 2)} = 0 \\;\\Rightarrow\\; A_y = ${szK(Ay, 2)}\\ \\text{kN}`}</MB>
        <p>Nyomatéki egyenlet a befogás pontjára — a két erőkomponens karja itt nulla, a koncentrált nyomaték a saját előjelével kerül be:</p>
        <MB>{`\\Mp{A} M_A ${tag(xF, Fy, 1, 3)} ${tag(xQ, -Q, 2, 2)} ${tagE(Mk)} = 0 \\;\\Rightarrow\\; M_A = ${szK(MA, 2)}\\ \\text{kNm}`}</MB>
        <p>Mindkét vetületi egyenletet elhasználtuk, ezért az ellenőrzés egy másik pontra — a szabad <M>{"B"}</M> végre — írt nyomatéki egyenlet:</p>
        <MB>{`\\Mp{B} ${tagE(MA, 2)} ${tag(L, -Ay, 1, 2)} ${tag(xF - L, Fy, 1, 3)} ${tag(xQ - L, -Q, 2, 2)} ${tagE(Mk)} = ${szK(ellB, 2)} \\approx 0 \\;\\checkmark`}</MB>
        <p className="mt-2 text-[13px] text-petrol-600">
          <M>{"M_A"}</M> {MA >= 0 ? "pozitív: a befogás az óramutatóval ellentétesen forgat" : "negatív: a befogási nyomaték valójában az óramutató járásával egyezően forgat"} — az eredményvázlaton{" "}
          <M>{`${szK(Math.abs(MA), 2)}`}</M> kNm a tényleges forgásiránnyal. <M>{"A_x"}</M> {Math.abs(Ax) < 1e-9 ? "nulla, mert nincs vízszintes teher" : Ax >= 0 ? "jobbra mutat" : "negatív, tehát balra mutat"}.
        </p>
      </>
    ),
  };
}

/* ============================================================
   4. Konzolos kéttámaszú tartó — felemelkedik-e a görgő?
   ============================================================ */

function konzolosFeladat() {
  const L = fel(3, 6);
  const mindketto = Math.random() < 0.4;
  const c1 = Math.random() < 0.6 || mindketto ? fel(1, 2.5) : 0;
  const c2 = c1 === 0 || mindketto ? fel(1, 2.5) : 0;
  const xMin = -c1;
  const xMax = L + c2;
  // két erő: az egyik gyakran a konzolon
  const erok = [];
  const balKonzolon = c1 > 0 && Math.random() < 0.75;
  const F1 = balKonzolon ? egesz(8, 20) : egesz(4, 18);
  const x1 = balKonzolon ? -fel(Math.max(0.5, c1 - 1), c1) : fel(0.5, L - 0.5);
  erok.push({ x: x1, F: F1 });
  const F2 = balKonzolon ? egesz(3, 10) : egesz(4, 18);
  let x2 = c2 > 0 && Math.random() < 0.6 ? L + fel(0.5, c2) : fel(0.5, L - 0.5);
  if (Math.abs(x2 - x1) < 0.25) x2 = x2 + 0.5 <= xMax ? x2 + 0.5 : x2 - 0.5;
  erok.push({ x: x2, F: F2 });
  // néha megoszló teher a támaszok között
  const p = Math.random() < (balKonzolon ? 0.3 : 0.5) ? egesz(2, 6) : 0;
  const Q = p * L;
  const xQ = L / 2;
  const MA = erok.reduce((s, e) => s + e.x * e.F, 0) + xQ * Q; // ↷ nyomaték (pozitív szám, ha jobbra van)
  const B = MA / L;
  const MB_ = erok.reduce((s, e) => s + (L - e.x) * e.F, 0) + (L - xQ) * Q;
  const Ay = MB_ / L;
  const fel_ = B < 0 ? 1 : 0;
  const ell = Ay + B - F1 - F2 - Q;

  return {
    adat: {
      ismeretlenek: [
        { id: "ax", pont: [0, 0], irany: [1, 0] },
        { id: "ay", pont: [0, 0], irany: [0, 1] },
        { id: "b", pont: [L, 0], irany: [0, 1] },
      ],
      terhek: [...erok.map((e) => ({ pont: [e.x, 0], F: [0, -e.F] })), { pont: [xQ, 0], F: [0, -Q] }],
    },
    szoveg: (
      <p>
        Egy vízszintes gerendát az <M>{"A"}</M> csukló és a tőle <M>{`L = ${szK(L, 1)}\\ \\text{m}`}</M>-re jobbra lévő <M>{"B"}</M> görgő támaszt meg; a gerenda {c1 > 0 && c2 > 0 ? <>mindkét támaszon túlnyúlik: balra <M>{`${szK(c1, 1)}`}</M> m-rel, jobbra <M>{`${szK(c2, 1)}`}</M> m-rel</> : c1 > 0 ? <>az <M>{"A"}</M> csuklón túl balra <M>{`${szK(c1, 1)}`}</M> m-rel túlnyúlik</> : <>a <M>{"B"}</M> görgőn túl jobbra <M>{`${szK(c2, 1)}`}</M> m-rel túlnyúlik</>}. Terhek (<M>{"A"}</M>-tól mérve, jobbra pozitív):{" "}
        <M>{`F_1 = ${F1}\\ \\text{kN}`}</M> az <M>{`x_1 = ${szK(x1, 1)}`}</M> m, <M>{`F_2 = ${F2}\\ \\text{kN}`}</M> az <M>{`x_2 = ${szK(x2, 1)}`}</M> m helyen, mindkettő lefelé{p ? <>, továbbá a támaszok között <M>{`p = ${p}\\ \\text{kN/m}`}</M> egyenletesen megoszló teher</> : null}. Számítsd ki
        a két függőleges reakciót (felfelé pozitív), és döntsd el: felemelkedik-e a görgő?
      </p>
    ),
    abra: (
      <TartoRajz
        xMin={xMin}
        xMax={xMax}
        tamaszok={[
          { tipus: "csuklo", x: 0, cimke: "A" },
          { tipus: "gorgo", x: L, cimke: "B" },
        ]}
        megoszlok={p ? [{ x1: 0, x2: L, p, cimke: `p = ${p} kN/m` }] : []}
        erok={erok.map((e, i) => ({ x: e.x, F: e.F, szog: -90, cimke: `F${"₁₂"[i]} = ${e.F} kN` }))}
      />
    ),
    sugo: (
      <p>
        A konzolon lévő teher a csuklótól balra az óramutatóval <em>ellentétesen</em> forgat — ezért csökkenti <M>{"B"}</M>-t. Ha <M>{"B"}</M> negatívra jön ki, a görgőnek lefelé kellene húznia a tartót, amit
        nem tud: a görgő felemelkedik, a tartó felborul a csukló körül.
      </p>
    ),
    oszlopok: 3,
    mezok: [
      { id: "b", cimke: "B (felfelé +)", egyseg: "kN", helyes: B, tizedes: 2 },
      { id: "ay", cimke: "A_y (felfelé +)", egyseg: "kN", helyes: Ay, tizedes: 2 },
      { id: "fel", cimke: "felemelkedik a görgő? (1 = igen, 0 = nem)", egyseg: "", helyes: fel_, tizedes: 0, tures: 0.1 },
    ],
    megoldas: (
      <>
        <p>
          <strong>Elkülönítés:</strong> <M>{"A_x"}</M> jobbra, <M>{"A_y"}</M> felfelé, <M>{"B"}</M> felfelé{p ? <>; a megoszló teher eredője <M>{`Q = ${p}\\cdot ${szK(L, 1)} = ${szK(Q, 2)}`}</M> kN az <M>{`x_Q = ${szK(xQ, 2)}`}</M> m helyen</> : null}. Vízszintes teher nincs:{" "}
          <M>{"\\Fx A_x = 0"}</M>.
        </p>
        <MB>{`(\\underline{F}_1, \\underline{F}_2${p ? ", \\underline{p}" : ""}, \\underline{A}, \\underline{B}) \\ekv \\underline{O}`}</MB>
        <p>Nyomatéki egyenlet a csuklóra (a konzolon, a csuklótól balra lévő erő pozitív nyomatékot ad):</p>
        <MB>{`\\Mp{A} ${erok.map((e) => tag(e.x, -e.F)).join(" ")}${p ? ` ${tag(xQ, -Q, 2, 2)}` : ""} + ${szK(L, 1)}\\cdot B = 0 \\;\\Rightarrow\\; B = \\frac{${szK(MA, 2)}}{${szK(L, 1)}} = ${szK(B, 2)}\\ \\text{kN}`}</MB>
        <p>Nyomatéki egyenlet a görgőre:</p>
        <MB>{`\\Mp{B} ${erok.map((e) => tag(L - e.x, e.F)).join(" ")}${p ? ` ${tag(L - xQ, Q, 2, 2)}` : ""} - ${szK(L, 1)}\\cdot A_y = 0 \\;\\Rightarrow\\; A_y = \\frac{${szK(MB_, 2)}}{${szK(L, 1)}} = ${szK(Ay, 2)}\\ \\text{kN}`}</MB>
        <p>Ellenőrzés:</p>
        <MB>{`\\Fy ${tagE(Ay, 2)} ${tagE(B, 2)} - ${F1} - ${F2}${p ? ` - ${szK(Q, 2)}` : ""} = ${szK(ell, 2)} \\approx 0 \\;\\checkmark`}</MB>
        <p className="mt-2 text-[13px] text-petrol-600">
          {B < 0
            ? `B negatív: a görgőnek lefelé kellene húznia a gerendát, de a görgő csak nyomni tud. A görgő felemelkedik, a gerenda az A csukló körül felborul — a tartó ebben a teherállásban nem működik (kódja: 1).`
            : `B pozitív: a görgő nyomja a gerendát, a felvett irány a tényleges, a tartó áll (kódja: 0).`}{" "}
          {Ay < 0 ? "A_y viszont negatív: a csuklónak lefelé kell tartania a gerendát — a csukló ezt tudja, mert két irányban is fog." : ""}
        </p>
      </>
    ),
  };
}

/* ============================================================
   5. Csuklóval és ferde rúddal megtámasztott tartó
   ============================================================ */

function csukloRudFeladat() {
  for (let proba = 0; proba < 100; proba++) {
    const L = fel(3, 6);
    const xC = fel(Math.max(1.5, L / 2), L);
    const fuggeszto = Math.random() < 0.6; // a rúd másik vége felül (függesztőrúd) vagy alul (támasztórúd)
    const h = fel(1.5, 3);
    const xD = fel(0, xC - 1);
    const yD = fuggeszto ? h : -h;
    const dx = xD - xC;
    if (h / Math.abs(dx) < 0.45) continue; // túl lapos rúd: irreálisan nagy rúderő
    const p = Math.random() < 0.5 ? egesz(2, 4) : 0;
    const ell = Math.hypot(dx, yD);
    const u = [dx / ell, yD / ell];
    const xF = fel(0.5, L);
    const F = egesz(4, 16);
    const Q = p * L;
    const xQ = L / 2;
    const Mt = xF * F + xQ * Q; // a terhek ↷ nyomatéka A-ra (pozitív szám)
    // ΣM_A: −Mt + xC·u_y·S = 0
    const S = Mt / (xC * u[1]);
    // ΣM_C: (xC−xF)·F + (xC−xQ)·Q − xC·A_y = 0
    const Ay = ((xC - xF) * F + (xC - xQ) * Q) / xC;
    // E főpont: a rúd hatásvonala és az x = 0 függőleges metszéspontja
    const yE = (xC * yD) / (xC - xD);
    if (Math.abs(yE) > 15 || Math.abs(yE) < 0.3) continue;
    // ΣM_E: −Mt + yE·A_x = 0
    const Ax = Mt / yE;
    const Sx = S * u[0];
    const Sy = S * u[1];
    const ellFx = Ax + Sx;
    const ellFy = Ay + Sy - F - Q;

    return {
      adat: {
        ismeretlenek: [
          { id: "ax", pont: [0, 0], irany: [1, 0] },
          { id: "ay", pont: [0, 0], irany: [0, 1] },
          { id: "s", pont: [xC, 0], irany: u },
        ],
        terhek: [
          { pont: [xF, 0], F: [0, -F] },
          { pont: [xQ, 0], F: [0, -Q] },
        ],
      },
      szoveg: (
        <p>
          Egy <M>{`L = ${szK(L, 1)}\\ \\text{m}`}</M> hosszú vízszintes gerendát a bal végén (<M>{"A"}</M>, az origó) csukló támaszt meg, a <M>{`C(${szK(xC, 1)};\\ 0)`}</M> pontjához pedig egy rúd csatlakozik,
          amelynek másik vége a falhoz csuklósan rögzített <M>{`D(${szK(xD, 1)};\\ ${szK(yD, 1)})`}</M> pont (méterben, <M>{"x"}</M> jobbra, <M>{"y"}</M> felfelé). A gerendát az <M>{`x_F = ${szK(xF, 1)}`}</M> m helyen{" "}
          <M>{`F = ${F}\\ \\text{kN}`}</M> függőleges erő terheli{p ? <>, és a teljes hosszán <M>{`p = ${p}\\ \\text{kN/m}`}</M> egyenletesen megoszló teher</> : null}. Számítsd ki a rúderőt (húzott = pozitív) és a csukló
          reakcióit (<M>{"A_x"}</M> jobbra, <M>{"A_y"}</M> felfelé)!
        </p>
      ),
      abra: (
        <TartoRajz
          xMax={L}
          tamaszok={[
            { tipus: "csuklo", x: 0, cimke: "A" },
            { tipus: "rud", x: xC, xVeg: xD, yVeg: yD, cimke: "S" },
          ]}
          megoszlok={p ? [{ x1: 0, x2: L, p, cimke: `p = ${p} kN/m` }] : []}
          erok={[{ x: xF, F, szog: -90, cimke: `F = ${F} kN` }]}
          pontok={[
            { x: xC, cimke: "C", dy: fuggeszto ? 22 : -10 },
            { x: xD, y: yD, cimke: "D", dx: -14, dy: 4 },
          ]}
        />
      ),
      sugo: (
        <p>
          A rúderőt a <M>{"C \\to D"}</M> irányba, húzóerőként vedd fel, és bontsd komponensekre a rúd hosszával: <M>{"S_x = S\\,(x_D - x_C)/\\ell"}</M>, <M>{"S_y = S\\,y_D/\\ell"}</M>. A csuklóra írt nyomatéki
          egyenletben csak <M>{"S"}</M> marad. <M>{"A_y"}</M> főpontja <M>{"C"}</M> (itt metszi a rúd hatásvonala az <M>{"A_x"}</M> hatásvonalát), <M>{"A_x"}</M> főpontja pedig az <M>{"E"}</M> pont, ahol a rúd
          hatásvonala az <M>{"x = 0"}</M> függőlegest metszi.
        </p>
      ),
      oszlopok: 3,
      mezok: [
        { id: "s", cimke: "S (húzott +)", egyseg: "kN", helyes: S, tizedes: 2 },
        { id: "ax", cimke: "A_x (jobbra +)", egyseg: "kN", helyes: Ax, tizedes: 2 },
        { id: "ay", cimke: "A_y (felfelé +)", egyseg: "kN", helyes: Ay, tizedes: 2 },
      ],
      megoldas: (
        <>
          <p>
            <strong>Elkülönítés:</strong> a csukló helyett <M>{"A_x"}</M>, <M>{"A_y"}</M>; a rúd helyett a <M>{"C"}</M> pontban ható, <M>{"D"}</M> felé mutató (húzó) <M>{"S"}</M>. A rúd hossza{" "}
            <M>{`\\ell = \\sqrt{${zar(dx)}^2 + ${zar(yD)}^2} = ${szK(ell, 3)}`}</M> m, így <M>{`S_x = S\\cdot\\frac{${szK(dx, 1)}}{${szK(ell, 3)}} = ${szK(u[0], 4)}\\,S`}</M>,{" "}
            <M>{`S_y = S\\cdot\\frac{${szK(yD, 1)}}{${szK(ell, 3)}} = ${szK(u[1], 4)}\\,S`}</M>.{p ? <> A megoszló teher eredője <M>{`Q = ${szK(Q, 2)}`}</M> kN az <M>{`x_Q = ${szK(xQ, 2)}`}</M> m helyen.</> : null}
          </p>
          <MB>{`(\\underline{F}${p ? ", \\underline{p}" : ""}, \\underline{A}, \\underline{S}) \\ekv \\underline{O}`}</MB>
          <p>Nyomatéki egyenlet a csuklóra — <M>{"S"}</M> vízszintes komponensének hatásvonala a tartó tengelye (karja 0), csak <M>{"S_y"}</M> forgat, <M>{"x_C"}</M> karral:</p>
          <MB>{`\\Mp{A} ${tag(xF, -F)}${p ? ` ${tag(xQ, -Q, 2, 2)}` : ""} + ${szK(xC, 1)}\\cdot ${szK(u[1], 4)}\\,S = 0 \\;\\Rightarrow\\; S = ${szK(S, 2)}\\ \\text{kN}`}</MB>
          <p>
            Az <M>{"A_y"}</M> főpontja a <M>{"C"}</M> pont: itt metszi egymást <M>{"S"}</M> és <M>{"A_x"}</M> hatásvonala, mindkettő kiesik.
          </p>
          <MB>{`\\Mp{C} ${tag(xC - xF, F)}${p ? ` ${tag(xC - xQ, Q, 2, 2)}` : ""} - ${szK(xC, 1)}\\cdot A_y = 0 \\;\\Rightarrow\\; A_y = ${szK(Ay, 2)}\\ \\text{kN}`}</MB>
          <p>
            Az <M>{"A_x"}</M> főpontja az <M>{"E"}</M> pont, ahol a rúd hatásvonala az <M>{"x = 0"}</M> függőlegest (az <M>{"A_y"}</M> hatásvonalát) metszi:{" "}
            <M>{`y_E = x_C\\cdot\\frac{y_D}{x_C - x_D} = ${szK(xC, 1)}\\cdot\\frac{${szK(yD, 1)}}{${szK(xC - xD, 1)}} = ${szK(yE, 3)}`}</M> m. Itt <M>{"S"}</M> és <M>{"A_y"}</M> kiesik; a függőleges terhek karja{" "}
            <M>{"E"}</M>-re ugyanaz, mint <M>{"A"}</M>-ra, <M>{"A_x"}</M> karja <M>{`|y_E|`}</M>:
          </p>
          <MB>{`\\Mp{E} ${tag(xF, -F)}${p ? ` ${tag(xQ, -Q, 2, 2)}` : ""} ${yE < 0 ? "-" : "+"} ${szK(Math.abs(yE), 3)}\\cdot A_x = 0 \\;\\Rightarrow\\; A_x = ${szK(Ax, 2)}\\ \\text{kN}`}</MB>
          <p>Ellenőrzés a nem használt vetületi egyenletekkel (minden erő ismert):</p>
          <MB>{`\\Fx ${tagE(Ax, 2)} ${tagE(Sx, 2)} = ${szK(ellFx, 2)} \\approx 0,\\qquad \\Fy ${tagE(Ay, 2)} ${tagE(Sy, 2)} - ${F}${p ? ` - ${szK(Q, 2)}` : ""} = ${szK(ellFy, 2)} \\approx 0 \\;\\checkmark`}</MB>
          <p className="mt-2 text-[13px] text-petrol-600">
            <M>{`S ${S >= 0 ? "> 0" : "< 0"}`}</M>: a rúd {S >= 0 ? "húzott — függesztőrúdként működik" : "nyomott — támasztórúdként működik, a tényleges erő C-ből D-vel ellentétes irányba mutat"}.{" "}
            <M>{"A_x"}</M> {Ax >= 0 ? "jobbra" : "balra"} mutat, ellensúlyozza a rúderő vízszintes komponensét; <M>{"A_y"}</M> {Ay >= 0 ? "felfelé" : "lefelé (negatív: a csukló tartja lefelé a gerendát)"}.
          </p>
        </>
      ),
    };
  }
  return csukloRudFeladat();
}

/* ---------- a szekció ---------- */

export const GENERATOROK = [
  { cim: "Kéttámaszú tartó koncentrált erőkkel", fn: kettamaszuErokFeladat },
  { cim: "Kéttámaszú tartó megoszló teherrel", fn: kettamaszuMegoszloFeladat },
  { cim: "Befogott konzol", fn: konzolFeladat },
  { cim: "Konzolos kéttámaszú tartó — felemelkedik-e a görgő?", fn: konzolosFeladat },
  { cim: "Csuklóval és ferde rúddal megtámasztott tartó", fn: csukloRudFeladat },
];

export default function GyakorloSzekcio() {
  return (
    <>
      <GyakorloDoboz cim="Kéttámaszú tartó koncentrált erőkkel" leiras="A modul alapfeladata: két nyomatéki egyenlet a két támaszra, egy vetületi a csuklóerő vízszintes komponensére." generator={kettamaszuErokFeladat} oszlopok={3} />
      <GyakorloDoboz cim="Kéttámaszú tartó megoszló teherrel" leiras="A megoszló teher eredője a szakasz felezőpontjában — a leggyakoribb hiba a rossz kar." generator={kettamaszuMegoszloFeladat} />
      <GyakorloDoboz cim="Befogott konzol" leiras="Két vetületi és egy nyomatéki egyenlet; az ellenőrzés a szabad végre írt nyomatéki egyenlet." generator={konzolFeladat} oszlopok={3} />
      <GyakorloDoboz cim="Konzolos kéttámaszú tartó — felemelkedik-e a görgő?" leiras="Túlnyúló gerenda: a konzolon lévő teher a csukló körül visszafelé forgat, és B akár negatív is lehet." generator={konzolosFeladat} oszlopok={3} />
      <GyakorloDoboz cim="Csuklóval és ferde rúddal megtámasztott tartó" leiras="A tankönyv 4.7. ábrája számokkal: a rúderő a csuklóra, a csuklóerő komponensei a főpontokra írt nyomatéki egyenletből." generator={csukloRudFeladat} oszlopok={3} />
      <div className="mt-10 mb-4 flex items-center gap-3">
        <span className="h-px flex-1 bg-petrol-200" />
        <span className="text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">További feladattípusok</span>
        <span className="h-px flex-1 bg-petrol-200" />
      </div>
      <GyakorloExtra />
    </>
  );
}
