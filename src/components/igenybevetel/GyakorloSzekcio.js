"use client";

import GyakorloDoboz from "@/components/GyakorloDoboz";
import { M, MB } from "@/components/ui/Keplet";
import { sz, szK } from "@/lib/szamok";
import { elemez, ertekek } from "@/lib/tarto";
import { egesz, valaszt, fel, helyek, tag, tagE } from "@/components/tartok/GyakorloExtra";
import FeladatRajz from "./FeladatRajz";
import GyakorloExtra from "./GyakorloExtra";

/*
 * Gyakorló generátorok a 9. modulhoz. Minden szám a számítómagból (elemez) jön; a levezetés a
 * tankönyv 8.2 fejezetének receptjét követi: reakciók → a K-tól balra (vagy jobbra) lévő tartórész
 * → vetületi egyenletek N-re és V-re, nyomatéki egyenlet K-ra M-re.
 * Előjelek: N húzás +, V pozitív a tengely fölé (bal oldali részen: felfelé mutató erők +),
 * M pozitív = alsó szál húzott (vízszintes tartónál lefelé rajzolva).
 */

const FOK = Math.PI / 180;
const f1 = (v) => szK(v, Math.abs(v - Math.round(v)) < 1e-9 ? 0 : Math.abs(v * 10 - Math.round(v * 10)) < 1e-9 ? 1 : 2);
const f2 = (v) => szK(v, 2);
const reakcio = (e, id) => e.reakciok.find((r) => r.csomopont === id) ?? { Fx: 0, Fy: 0 };

/** Kéttámaszú tartó (A csukló x = 0, B görgő x = L) modellje tetszőleges terhekkel. */
function kettamaszuModell(L, terhek, extraCsomopontok = []) {
  return {
    csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "B", x: L, y: 0 }, ...extraCsomopontok],
    rudak: [{ id: "1", a: "A", b: "B" }],
    tamaszok: [{ csomopont: "A", tipus: "csuklo" }, { csomopont: "B", tipus: "gorgo", szog: 90 }],
    terhek,
  };
}

/* ============================================================
   1. Igénybevételek adott keresztmetszetben (tankönyv 8.2, 8.4.a ábra)
   ============================================================ */

function keresztmetszetFeladat() {
  for (let proba = 0; proba < 100; proba++) {
    const L = fel(4, 8);
    const [x1, x2] = helyek(2, 0.5, L - 0.5);
    const F1 = egesz(4, 16);
    const F2 = egesz(4, 16);
    const alfa = valaszt([30, 45, 60]);
    const jobbra = Math.random() < 0.5;
    const beta = jobbra ? -alfa : -180 + alfa; // a ferde erő irányszöge (lefelé mutat)
    const F2x = F2 * Math.cos(beta * FOK), F2y = F2 * Math.sin(beta * FOK);
    const vanP = Math.random() < 0.5;
    const p = vanP ? egesz(2, 6) : 0;
    const pa = vanP ? valaszt([0, fel(0.5, L / 2)]) : 0;
    const pb = vanP ? (pa === 0 ? fel(L / 2, L) : L) : 0;
    // K: fél méteres hely, nem esik teherre
    const jeloltek = [];
    for (let x = 0.5; x <= L - 0.5; x += 0.5) if (Math.abs(x - x1) > 0.24 && Math.abs(x - x2) > 0.24 && (!vanP || (Math.abs(x - pa) > 0.24 && Math.abs(x - pb) > 0.24))) jeloltek.push(x);
    if (!jeloltek.length) continue;
    const xK = valaszt(jeloltek);
    const terhek = [
      { fajta: "pontTeher", rud: "1", a: x1, F: -F1, irany: "y", cimke: `F₁ = ${F1} kN` },
      { fajta: "pontTeher", rud: "1", a: x2, F: F2, irany: "szog", szog: beta, cimke: `F₂ = ${F2} kN, ${alfa}°` },
      ...(vanP ? [{ fajta: "megoszlo", rud: "1", a1: pa, a2: pb, p1: -p, irany: "y", cimke: `p = ${p} kN/m` }] : []),
    ];
    const modell = kettamaszuModell(L, terhek);
    const e = elemez(modell);
    if (!e.ok) continue;
    const A = reakcio(e, "A"), B = reakcio(e, "B");
    const ig = e.igenybevetelek[0];
    const K = ertekek(ig, xK);
    // a K-tól balra lévő terhek
    const balF1 = x1 < xK, balF2 = x2 < xK;
    const pBal = vanP ? Math.max(0, Math.min(pb, xK) - pa) : 0; // a K-tól balra eső teherhossz
    const Qb = p * pBal;
    const xQb = pa + pBal / 2;
    const Q = p * (pb - pa), xQ = (pa + pb) / 2;
    const NK = -(A.Fx + (balF2 ? F2x : 0));
    const VK = A.Fy + (balF1 ? -F1 : 0) + (balF2 ? F2y : 0) - Qb;
    const MK = A.Fy * xK + (balF1 ? -F1 * (xK - x1) : 0) + (balF2 ? F2y * (xK - x2) : 0) - Qb * (xK - xQb);
    if (Math.abs(NK - K.N) > 1e-6 || Math.abs(VK - K.V) > 1e-6 || Math.abs(MK - K.M) > 1e-6) continue; // biztonsági ellenőrzés

    return {
      adat: { tipus: "keresztmetszet", L, x1, x2, F1, F2, F2x, F2y, p, pa, pb, xK, Ax: A.Fx, Ay: A.Fy, B: B.Fy },
      szoveg: (
        <p>
          Egy <M>{`L = ${f1(L)}\\ \\text{m}`}</M> támaszközű kéttámaszú tartót (<M>{"A"}</M> csukló balra, <M>{"B"}</M> görgő jobbra) az <M>{`x_1 = ${f1(x1)}`}</M> m helyen <M>{`F_1 = ${F1}\\ \\text{kN}`}</M> függőleges erő, az{" "}
          <M>{`x_2 = ${f1(x2)}`}</M> m helyen <M>{`F_2 = ${F2}\\ \\text{kN}`}</M> {jobbra ? "jobbra" : "balra"}-lefelé mutató, a tengellyel <M>{`\\alpha = ${alfa}^\\circ`}</M>-ot bezáró erő terhel
          {vanP ? <>, továbbá az <M>{`x = ${f1(pa)}`}</M> és <M>{`${f1(pb)}`}</M> m közötti szakaszon <M>{`p = ${p}\\ \\text{kN/m}`}</M> egyenletesen megoszló teher</> : null}. Számítsd ki a{" "}
          <M>{`K`}</M> keresztmetszet (<M>{`x_K = ${f1(xK)}`}</M> m) igénybevételeit! (Húzás +, V a tengely fölé +, M az alsó szál húzása esetén +.)
        </p>
      ),
      abra: <FeladatRajz modell={modell} eredmeny={e} cimkek={{ A: "A", B: "B" }} metszetek={[{ rud: "1", a: xK, cimke: "K" }]} />,
      sugo: (
        <p>
          Először a reakciók (<M>{"\\Fx"}</M>, <M>{"\\Mp{A}"}</M>, <M>{"\\Mp{B}"}</M>). Utána vágd el a tartót <M>{"K"}</M>-nál, és a <strong>bal oldali</strong> részre írd fel a három egyensúlyi egyenletet: a
          keresztmetszetben a pozitív <M>{"N_K"}</M> jobbra (kifelé), a pozitív <M>{"V_K"}</M> lefelé, a pozitív <M>{"M_K"}</M> az óramutatóval ellentétesen hat a bal részre (a nyomatéki egyenletet célszerű az óramutató szerint pozitívan, <M>{"\\Mj{K}"}</M> alakban írni). Csak a <M>{"K"}</M>-tól balra lévő terhek
          számítanak; a megoszló teherből is csak a balra eső darab.
        </p>
      ),
      oszlopok: 3,
      mezok: [
        { id: "n", cimke: "N_K (húzás +)", egyseg: "kN", helyes: K.N, tizedes: 2 },
        { id: "v", cimke: "V_K", egyseg: "kN", helyes: K.V, tizedes: 2 },
        { id: "m", cimke: "M_K (alul húzott +)", egyseg: "kNm", helyes: K.M, tizedes: 2 },
      ],
      megoldas: (
        <>
          <p>
            <strong>Reakciók.</strong> A ferde erő komponensei: <M>{`F_{2x} = ${jobbra ? "" : "-"}${F2}\\cos ${alfa}^\\circ = ${f2(F2x)}`}</M>, <M>{`F_{2y} = -${F2}\\sin ${alfa}^\\circ = ${f2(F2y)}`}</M> kN
            {vanP ? <>; a megoszló teher eredője <M>{`Q = ${p}\\cdot ${f1(pb - pa)} = ${f2(Q)}`}</M> kN az <M>{`x_Q = ${f2(xQ)}`}</M> m helyen</> : null}.
          </p>
          <MB>{`(\\underline{F}_1, \\underline{F}_2${vanP ? ", \\underline{p}" : ""}, \\underline{A}, \\underline{B}) \\ekv \\underline{O}`}</MB>
          <MB>{`\\Fx A_x ${tagE(F2x, 2)} = 0 \\;\\Rightarrow\\; A_x = ${f2(A.Fx)}\\ \\text{kN}`}</MB>
          <MB>{`\\Mp{A} ${tag(x1, -F1)} ${tag(x2, F2y, 1, 2)}${vanP ? ` ${tag(xQ, -Q, 2, 2)}` : ""} + ${f1(L)}\\cdot B = 0 \\;\\Rightarrow\\; B = ${f2(B.Fy)}\\ \\text{kN}`}</MB>
          <MB>{`\\Mp{B} ${tag(L - x1, F1)} ${tag(L - x2, -F2y, 1, 2)}${vanP ? ` ${tag(L - xQ, Q, 2, 2)}` : ""} - ${f1(L)}\\cdot A_y = 0 \\;\\Rightarrow\\; A_y = ${f2(A.Fy)}\\ \\text{kN}`}</MB>
          <p>
            Ellenőrzés: <M>{`\\Fy ${tagE(A.Fy, 2)} ${tagE(B.Fy, 2)} - ${F1} ${tagE(F2y, 2)}${vanP ? ` - ${f2(Q)}` : ""} = ${f2(A.Fy + B.Fy - F1 + F2y - Q)} \\approx 0\\ \\checkmark`}</M>
          </p>
          <p>
            <strong>A K keresztmetszet — a bal oldali tartórész egyensúlya.</strong> A <M>{"K"}</M>-tól balra: <M>{"A_x"}</M>, <M>{"A_y"}</M>{balF1 ? <>, <M>{"F_1"}</M></> : null}{balF2 ? <>, <M>{"F_2"}</M></> : null}
            {Qb > 0 ? <>, és a megoszló teher <M>{`${f1(pBal)}`}</M> m hosszú darabja (<M>{`Q_b = ${f2(Qb)}`}</M> kN az <M>{`x = ${f2(xQb)}`}</M> m helyen)</> : null}. A keresztmetszetre a pozitív igénybevételeket rajzoljuk:{" "}
            <M>{"N_K"}</M> jobbra, <M>{"V_K"}</M> lefelé, <M>{"M_K"}</M> az óramutatóval ellentétesen — ezért az óramutató szerint pozitív nyomatéki egyenletben <M>{"-M_K"}</M> szerepel.
          </p>
          <MB>{`\\Fx ${tagE(A.Fx, 2)}${balF2 ? ` ${tagE(F2x, 2)}` : ""} + N_K = 0 \\;\\Rightarrow\\; N_K = ${f2(K.N)}\\ \\text{kN}`}</MB>
          <MB>{`\\Fy ${tagE(A.Fy, 2)}${balF1 ? ` - ${F1}` : ""}${balF2 ? ` ${tagE(F2y, 2)}` : ""}${Qb > 0 ? ` - ${f2(Qb)}` : ""} - V_K = 0 \\;\\Rightarrow\\; V_K = ${f2(K.V)}\\ \\text{kN}`}</MB>
          <MB>{`\\Mj{K} ${tag(xK, A.Fy, 1, 2)}${balF1 ? ` ${tag(xK - x1, -F1)}` : ""}${balF2 ? ` ${tag(xK - x2, F2y, 1, 2)}` : ""}${Qb > 0 ? ` ${tag(xK - xQb, -Qb, 2, 2)}` : ""} - M_K = 0 \\;\\Rightarrow\\; M_K = ${f2(K.M)}\\ \\text{kNm}`}</MB>
          <p className="mt-2 text-[13px] text-petrol-600">
            <M>{`N_K ${K.N < -1e-9 ? "< 0" : K.N > 1e-9 ? "> 0" : "= 0"}`}</M>: {Math.abs(K.N) < 1e-9 ? "a keresztmetszettől balra nincs vízszintes erő" : K.N < 0 ? "a keresztmetszet nyomott" : "a keresztmetszet húzott"}.{" "}
            <M>{`M_K ${K.M >= 0 ? "> 0" : "< 0"}`}</M>: {K.M >= 0 ? "az alsó szál húzott, az ábra a tengely alatt" : "a felső szál húzott, az ábra a tengely fölött"}. Ugyanezt a jobb oldali részből is megkapnád — az a jó ellenőrzés.
          </p>
          <FeladatRajz modell={modell} eredmeny={e} cimkek={{ A: "A", B: "B" }} metszetek={[{ rud: "1", a: xK, cimke: "K" }]} diagram="M" reakciok meretek={false} />
        </>
      ),
    };
  }
  return keresztmetszetFeladat();
}

/* ============================================================
   2. M_max helye és értéke (V = 0)
   ============================================================ */

function mMaxFeladat() {
  for (let proba = 0; proba < 100; proba++) {
    const L = fel(4, 8);
    const p = egesz(2, 8);
    const resz = Math.random() < 0.5;
    const pa = resz ? fel(0, L / 2 - 0.5) : 0;
    const pb = resz ? fel(pa + 2, L) : L;
    const vanF = Math.random() < 0.5;
    const xF = vanF ? fel(0.5, L - 0.5) : 0;
    const F = vanF ? egesz(4, 14) : 0;
    const terhek = [
      { fajta: "megoszlo", rud: "1", a1: pa, a2: pb, p1: -p, irany: "y", cimke: `p = ${p} kN/m` },
      ...(vanF ? [{ fajta: "pontTeher", rud: "1", a: xF, F: -F, irany: "y", cimke: `F = ${F} kN` }] : []),
    ];
    const modell = kettamaszuModell(L, terhek);
    const e = elemez(modell);
    if (!e.ok) continue;
    const ig = e.igenybevetelek[0];
    // V = 0 helyek a megoszló teher belsejében (szigorúan belül)
    const helyekV0 = ig.MszelsoHelyek.filter((h) => h.x > pa + 1e-6 && h.x < pb - 1e-6 && (!vanF || Math.abs(h.x - xF) > 1e-6));
    if (helyekV0.length !== 1) continue;
    const x0 = helyekV0[0].x;
    const M0 = helyekV0[0].M;
    const A = reakcio(e, "A"), B = reakcio(e, "B");
    const Q = p * (pb - pa), xQ = (pa + pb) / 2;
    const Fbal = vanF && xF < x0 ? F : 0;
    // globális maximum
    const Mmax = Math.abs(ig.szelso.M.max) >= Math.abs(ig.szelso.M.min) ? ig.szelso.M.max : ig.szelso.M.min;
    const masholMax = Math.abs(Mmax) > Math.abs(M0) + 1e-6;
    return {
      adat: { tipus: "mmax", L, p, pa, pb, F, xF, Ay: A.Fy, B: B.Fy, x0, M0 },
      szoveg: (
        <p>
          Egy <M>{`L = ${f1(L)}\\ \\text{m}`}</M> támaszközű kéttámaszú tartón (<M>{"A"}</M> csukló, <M>{"B"}</M> görgő) az <M>{`x = ${f1(pa)}`}</M> és <M>{`${f1(pb)}`}</M> m közötti szakaszon{" "}
          <M>{`p = ${p}\\ \\text{kN/m}`}</M> egyenletesen megoszló teher hat{vanF ? <>, az <M>{`x_F = ${f1(xF)}`}</M> m helyen pedig <M>{`F = ${F}\\ \\text{kN}`}</M> függőleges erő</> : null}. Hol nulla a
          nyíróerő a megoszló teher szakaszán belül (<M>{"x_0"}</M>, <M>{"A"}</M>-tól mérve), és mekkora ott a hajlítónyomaték?
        </p>
      ),
      abra: <FeladatRajz modell={modell} eredmeny={e} cimkek={{ A: "A", B: "B" }} />,
      sugo: (
        <p>
          <M>{"\\mathrm{d}M/\\mathrm{d}x = V"}</M>: ahol a nyíróerő nulla, ott a nyomatéknak szélsőértéke van. A megoszló teher szakaszán <M>{"V(x) = A_y - (\\text{balra lévő erők}) - p\\,(x - x_a)"}</M> lineáris —
          tedd egyenlővé nullával. Az <M>{"M(x_0)"}</M>-t a bal oldali részre írt nyomatéki egyenletből kapod: a megoszló teherből csak az <M>{"x_0"}</M>-ig eső darab, a felezőpontjában.
        </p>
      ),
      mezok: [
        { id: "x0", cimke: "x₀ (V = 0 helye)", egyseg: "m", helyes: x0, tizedes: 3 },
        { id: "m0", cimke: "M(x₀)", egyseg: "kNm", helyes: M0, tizedes: 2 },
      ],
      megoldas: (
        <>
          <p>
            <strong>Reakciók.</strong> <M>{`Q = ${p}\\cdot ${f1(pb - pa)} = ${f2(Q)}`}</M> kN az <M>{`x_Q = ${f2(xQ)}`}</M> m helyen.
          </p>
          <MB>{`\\Mp{A} ${tag(xQ, -Q, 2, 2)}${vanF ? ` ${tag(xF, -F)}` : ""} + ${f1(L)}\\cdot B = 0 \\;\\Rightarrow\\; B = ${f2(B.Fy)}\\ \\text{kN},\\qquad \\Fy A_y = ${f2(Q + F)} - ${f2(B.Fy)} = ${f2(A.Fy)}\\ \\text{kN}`}</MB>
          <p>
            <strong>A nyíróerő a teher szakaszán</strong> (a bal oldali részből, <M>{`${f1(pa)} \\le x \\le ${f1(pb)}`}</M>{vanF && xF > pa && xF < pb ? `, az F-től ${xF < x0 ? "jobbra" : "balra"}` : ""}):
          </p>
          <MB>{`V(x) = ${f2(A.Fy)}${Fbal ? ` - ${F}` : ""} - ${p}\\,(x - ${f1(pa)}) = 0 \\;\\Rightarrow\\; x_0 = ${f1(pa)} + \\frac{${f2(A.Fy - Fbal)}}{${p}} = ${szK(x0, 3)}\\ \\text{m}`}</MB>
          <p>
            <strong>A nyomaték ott</strong> — a bal oldali részre, a teherből az <M>{`${szK(x0 - pa, 3)}`}</M> m hosszú darab (<M>{`${f2(p * (x0 - pa))}`}</M> kN, a felezőpontjában):
          </p>
          <MB>{`\\Mj{K} ${tag(x0, A.Fy, 3, 2)}${Fbal ? ` ${tag(x0 - xF, -F, 3)}` : ""} ${tag((x0 - pa) / 2, -p * (x0 - pa), 3, 2)} - M(x_0) = 0 \\;\\Rightarrow\\; M(x_0) = ${f2(M0)}\\ \\text{kNm}`}</MB>
          <p className="mt-2 text-[13px] text-petrol-600">
            Ez a parabola csúcsa: itt az érintő vízszintes.{" "}
            {masholMax
              ? `A tartó legnagyobb nyomatéka viszont nem itt van, hanem az erő alatti törésben: M_max = ${sz(Mmax, 2)} kNm — a V = 0 hely a parabola szélsőértékét adja, a teljes ábra maximumát a töréspontokkal együtt kell megnézni.`
              : `Ez egyben a tartó legnagyobb hajlítónyomatéka is (M_max = ${sz(Mmax, 2)} kNm).`}
          </p>
          <FeladatRajz modell={modell} eredmeny={e} cimkek={{ A: "A", B: "B" }} metszetek={[{ rud: "1", a: x0, cimke: "x₀" }]} diagram="V" meretek={false} />
          <FeladatRajz modell={modell} eredmeny={e} cimkek={{ A: "A", B: "B" }} diagram="M" meretek={false} />
        </>
      ),
    };
  }
  return mMaxFeladat();
}

/* ============================================================
   3. Ábraértékek a töréspontokban — konzol, kívülről számolva (tankönyv 8.4.1)
   ============================================================ */

function torespontFeladat() {
  const L = fel(2.5, 5);
  const c = fel(0.5, L - 1.5); // a megoszló teher kezdete
  const p = egesz(2, 8);
  const F = egesz(3, 12);
  const vanF2 = Math.random() < 0.5;
  const F2 = vanF2 ? egesz(3, 10) : 0;
  const terhek = [
    { fajta: "megoszlo", rud: "1", a1: c, a2: L, p1: -p, irany: "y", cimke: `p = ${p} kN/m` },
    { fajta: "csomopontiEro", csomopont: "B", Fy: -F, cimke: `F = ${F} kN` },
    ...(vanF2 ? [{ fajta: "pontTeher", rud: "1", a: c, F: -F2, irany: "y", cimke: `F₂ = ${F2} kN` }] : []),
  ];
  const modell = {
    csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "B", x: L, y: 0 }],
    rudak: [{ id: "1", a: "A", b: "B" }],
    tamaszok: [{ csomopont: "A", tipus: "befogas" }],
    terhek,
  };
  const e = elemez(modell);
  const ig = e.igenybevetelek[0];
  const A = reakcio(e, "A");
  const Cj = { V: ertekek(ig, c + 1e-6).V, M: ertekek(ig, c).M }; // C-től jobbra (az M folytonos)
  const Cb = ertekek(ig, c - 1e-6);
  const Aj = ertekek(ig, 0);
  const Q = p * (L - c);
  return {
    adat: { tipus: "torespont", L, c, p, F, F2, Ay: A.Fy, MA: A.M },
    szoveg: (
      <p>
        Egy <M>{`L = ${f1(L)}\\ \\text{m}`}</M> hosszú konzol bal végét (<M>{"A"}</M>) befogták. A szabad <M>{"B"}</M> végén <M>{`F = ${F}\\ \\text{kN}`}</M> függőleges erő hat, a <M>{`C`}</M> ponttól (
        <M>{`x_C = ${f1(c)}`}</M> m) a végéig <M>{`p = ${p}\\ \\text{kN/m}`}</M> egyenletesen megoszló teher{vanF2 ? <>, a <M>{"C"}</M> pontban pedig <M>{`F_2 = ${F2}\\ \\text{kN}`}</M> erő</> : null}. Add meg az igénybevételi ábrák
        töréspont-értékeit: a nyíróerőt és a nyomatékot a befogásnál, és a nyomatékot a <M>{"C"}</M> pontban! (Kívülről, a szabad vég felől számolj — nem kell hozzá reakció.)
      </p>
    ),
    abra: <FeladatRajz modell={modell} eredmeny={e} cimkek={{ A: "A", B: "B" }} metszetek={[{ rud: "1", a: c, cimke: "C" }]} />,
    sugo: (
      <p>
        Konzolnál a tankönyv 8.4.1 tanácsa: a szabad végtől befelé haladva minden keresztmetszet igénybevételét a tőle <strong>jobbra</strong> lévő terhekből számold. A jobb oldali részen a pozitív <M>{"V"}</M> felfelé, a
        pozitív <M>{"M"}</M> az óramutató járásával egyezően hat a keresztmetszetre; a tőle jobbra lévő lefelé mutató terhek is az óramutató szerint forgatnak — ezért <M>{"V"}</M> pozitív, <M>{"M"}</M> negatív (felül húzott) lesz.
      </p>
    ),
    oszlopok: 3,
    mezok: [
      { id: "va", cimke: "V a befogásnál", egyseg: "kN", helyes: Aj.V, tizedes: 2 },
      { id: "ma", cimke: "M a befogásnál (alul húzott +)", egyseg: "kNm", helyes: Aj.M, tizedes: 2 },
      { id: "mc", cimke: "M a C pontban", egyseg: "kNm", helyes: Cj.M, tizedes: 2 },
    ],
    megoldas: (
      <>
        <p>
          <strong>Kívülről befelé.</strong> A <M>{"B"}</M> szabad végen <M>{`V = ${F}`}</M> kN (az <M>{"F"}</M> erő ugrása) és <M>{"M = 0"}</M>. A <M>{"C"}</M> keresztmetszetre a tőle jobbra lévő rész hat:{" "}
          <M>{"F"}</M> és a megoszló teher <M>{`Q = ${p}\\cdot ${f1(L - c)} = ${f2(Q)}`}</M> kN eredője a szakasz felezőpontjában (<M>{`${f2((L - c) / 2)}`}</M> m-re <M>{"C"}</M>-től).
        </p>
        <MB>{`\\Fy V_C - ${F} - ${f2(Q)} = 0 \\;\\Rightarrow\\; V_{C,\\text{jobb}} = ${f2(Cj.V)}\\ \\text{kN}${vanF2 ? `,\\qquad V_{C,\\text{bal}} = ${f2(Cj.V)} + ${F2} = ${f2(Cb.V)}\\ \\text{kN}` : ""}`}</MB>
        <MB>{`\\Mj{C} M_C ${tag(L - c, F)} ${tag((L - c) / 2, Q, 2, 2)} = 0 \\;\\Rightarrow\\; M_C = ${f2(Cj.M)}\\ \\text{kNm}`}</MB>
        <p>A befogásnál ugyanígy, a teljes jobb oldali résszel (az erők karja <M>{"A"}</M>-tól mérve):</p>
        <MB>{`\\Fy V_A - ${F} - ${f2(Q)}${vanF2 ? ` - ${F2}` : ""} = 0 \\;\\Rightarrow\\; V_A = ${f2(Aj.V)}\\ \\text{kN}`}</MB>
        <MB>{`\\Mj{A} M_A ${tag(L, F, 1)} ${tag(c + (L - c) / 2, Q, 2, 2)}${vanF2 ? ` ${tag(c, F2)}` : ""} = 0 \\;\\Rightarrow\\; M_A = ${f2(Aj.M)}\\ \\text{kNm}`}</MB>
        <p className="mt-2 text-[13px] text-petrol-600">
          Az ábra alakja: a <M>{"CB"}</M> szakaszon <M>{"V"}</M> lineáris (<M>{`${F}`}</M>-ről <M>{`${f2(Cj.V)}`}</M>-ra), <M>{"M"}</M> parabola; az <M>{"AC"}</M> terheletlen szakaszon <M>{"V"}</M> állandó, <M>{"M"}</M> egyenes.
          A befogás reakciói a végértékekből olvashatók ki: <M>{`A_y = ${f2(A.Fy)}`}</M> kN felfelé, <M>{`M_A = ${f2(A.M)}`}</M> kNm — a negatív nyomaték felül húzott szálat jelent, az ábra a tengely fölött fut.
        </p>
        <FeladatRajz modell={modell} eredmeny={e} cimkek={{ A: "A", B: "B" }} metszetek={[{ rud: "1", a: c, cimke: "C" }]} diagram="V" meretek={false} />
        <FeladatRajz modell={modell} eredmeny={e} cimkek={{ A: "A", B: "B" }} diagram="M" meretek={false} />
      </>
    ),
  };
}

/* ============================================================
   4. Hol nulla a nyíróerő? — konzolos kéttámaszú tartó, végig megoszló teherrel
   ============================================================ */

function nyiroNullaFeladat() {
  for (let proba = 0; proba < 100; proba++) {
    const L = fel(4, 7);
    const c = fel(1, 2.5);
    const p = egesz(2, 6);
    const vanF = Math.random() < 0.5;
    const F = vanF ? egesz(3, 10) : 0;
    const modell = {
      csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "B", x: L, y: 0 }, { id: "C", x: L + c, y: 0 }],
      rudak: [{ id: "1", a: "A", b: "B" }, { id: "2", a: "B", b: "C" }],
      tamaszok: [{ csomopont: "A", tipus: "csuklo" }, { csomopont: "B", tipus: "gorgo", szog: 90 }],
      terhek: [
        { fajta: "megoszlo", rud: "1", p1: -p, irany: "y", cimke: `p = ${p} kN/m` },
        { fajta: "megoszlo", rud: "2", p1: -p, irany: "y" },
        ...(vanF ? [{ fajta: "csomopontiEro", csomopont: "C", Fy: -F, cimke: `F = ${F} kN` }] : []),
      ],
    };
    const e = elemez(modell);
    if (!e.ok) continue;
    const ig1 = e.igenybevetelek[0];
    const helyekV0 = ig1.MszelsoHelyek.filter((h) => h.x > 1e-6 && h.x < L - 1e-6);
    if (helyekV0.length !== 1) continue;
    const x0 = helyekV0[0].x, M0 = helyekV0[0].M;
    const A = reakcio(e, "A"), B = reakcio(e, "B");
    const MB_ = ertekek(ig1, L).M;
    const Q = p * (L + c), xQ = (L + c) / 2;
    return {
      adat: { tipus: "nyironulla", L, c, p, F, Ay: A.Fy, B: B.Fy, x0, M0, MB: MB_ },
      szoveg: (
        <p>
          Egy gerendát az <M>{"A"}</M> csukló (<M>{"x = 0"}</M>) és a <M>{"B"}</M> görgő (<M>{`x = ${f1(L)}`}</M> m) támaszt meg, a <M>{"B"}</M>-n túl <M>{`c = ${f1(c)}`}</M> m-es konzol nyúlik ki. A teljes hosszon{" "}
          <M>{`p = ${p}\\ \\text{kN/m}`}</M> egyenletesen megoszló teher hat{vanF ? <>, a konzol <M>{"C"}</M> végén pedig <M>{`F = ${F}\\ \\text{kN}`}</M> erő</> : null}. Hol nulla a nyíróerő a támaszok között (<M>{"x_0"}</M>), mekkora
          ott a nyomaték, és mekkora a nyomaték a <M>{"B"}</M> támasz fölött?
        </p>
      ),
      abra: <FeladatRajz modell={modell} eredmeny={e} cimkek={{ A: "A", B: "B", C: "C" }} />,
      sugo: (
        <p>
          A konzolt kívülről számold: <M>{"M_B"}</M> a <M>{"B"}</M>-től jobbra lévő terhekből, felül húzott (negatív). A támaszok közti szakaszon <M>{"V(x) = A_y - p\\,x"}</M>, ez nulla az <M>{"x_0 = A_y/p"}</M> helyen — de vigyázz, <M>{"A_y"}</M>
          a konzol miatt kisebb, mint <M>{"pL/2"}</M>, ezért <M>{"x_0"}</M> nem a támaszköz közepe.
        </p>
      ),
      oszlopok: 3,
      mezok: [
        { id: "x0", cimke: "x₀ (V = 0 a támaszok között)", egyseg: "m", helyes: x0, tizedes: 3 },
        { id: "m0", cimke: "M(x₀)", egyseg: "kNm", helyes: M0, tizedes: 2 },
        { id: "mb", cimke: "M_B (alul húzott +)", egyseg: "kNm", helyes: MB_, tizedes: 2 },
      ],
      megoldas: (
        <>
          <p>
            <strong>Reakciók.</strong> A teljes teher <M>{`Q = ${p}\\cdot ${f1(L + c)} = ${f2(Q)}`}</M> kN az <M>{`x_Q = ${f2(xQ)}`}</M> m helyen.
          </p>
          <MB>{`\\Mp{A} ${tag(xQ, -Q, 2, 2)}${vanF ? ` ${tag(L + c, -F, 1)}` : ""} + ${f1(L)}\\cdot B = 0 \\;\\Rightarrow\\; B = ${f2(B.Fy)}\\ \\text{kN},\\qquad \\Fy A_y = ${f2(Q + F)} - ${f2(B.Fy)} = ${f2(A.Fy)}\\ \\text{kN}`}</MB>
          <p><strong>A konzol kívülről</strong> — a <M>{"B"}</M> fölötti nyomaték a jobb oldali részből, az óramutató szerint pozitív egyenlettel (a jobb részre a pozitív <M>{"M_B"}</M> az óramutató szerint hat; <M>{`Q_c = ${p}\\cdot ${f1(c)} = ${f2(p * c)}`}</M> kN, <M>{`${f2(c / 2)}`}</M> m-re):</p>
          <MB>{`\\Mj{B} M_B ${tag(c / 2, p * c, 2, 2)}${vanF ? ` ${tag(c, F)}` : ""} = 0 \\;\\Rightarrow\\; M_B = ${f2(MB_)}\\ \\text{kNm}`}</MB>
          <p><strong>A támaszok között</strong> (a bal oldali részből):</p>
          <MB>{`V(x) = ${f2(A.Fy)} - ${p}\\,x = 0 \\;\\Rightarrow\\; x_0 = \\frac{${f2(A.Fy)}}{${p}} = ${szK(x0, 3)}\\ \\text{m}`}</MB>
          <MB>{`\\Mj{K} ${tag(x0, A.Fy, 3, 2)} ${tag(x0 / 2, -p * x0, 3, 2)} - M(x_0) = 0 \\;\\Rightarrow\\; M(x_0) = ${f2(M0)}\\ \\text{kNm}`}</MB>
          <p className="mt-2 text-[13px] text-petrol-600">
            A nyomatéki ábra a támaszok között lefelé lógó parabola, a <M>{"B"}</M> fölött <M>{`${f2(MB_)}`}</M> kNm-rel a tengely fölé megy (felül húzott), a konzolon parabolával fut le a <M>{"C"}</M> végi{" "}
            <M>{"0"}</M>-ra. Ahol az ábra átmetszi a tengelyt, ott <M>{"M = 0"}</M> — a valós szerkezetben ott váltana húzottból nyomottba az alsó szál.
          </p>
          <FeladatRajz modell={modell} eredmeny={e} cimkek={{ A: "A", B: "B", C: "C" }} metszetek={[{ rud: "1", a: x0, cimke: "x₀" }]} diagram="V" meretek={false} />
          <FeladatRajz modell={modell} eredmeny={e} cimkek={{ A: "A", B: "B", C: "C" }} diagram="M" meretek={false} />
        </>
      ),
    };
  }
  return nyiroNullaFeladat();
}

/* ============================================================
   5. Gerber-tartó: csuklóban M = 0 ellenőrzés (tankönyv 8.2.2, 8.4.6)
   ============================================================ */

function gerberFeladat() {
  for (let proba = 0; proba < 100; proba++) {
    const L1 = fel(3, 5);
    const L2 = fel(3, 5);
    const g = fel(1, Math.min(2, L2 - 1.5));
    const xG = L1 + g;
    const xF = xG + fel(0.5, L2 - g - 0.5);
    const F = egesz(4, 14);
    const p = egesz(2, 5);
    const modell = {
      csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "B", x: L1, y: 0 }, { id: "G", x: xG, y: 0 }, { id: "D", x: L1 + L2, y: 0 }],
      rudak: [{ id: "1", a: "A", b: "B" }, { id: "2", a: "B", b: "G" }, { id: "3", a: "G", b: "D", csukloA: true }],
      tamaszok: [{ csomopont: "A", tipus: "csuklo" }, { csomopont: "B", tipus: "gorgo", szog: 90 }, { csomopont: "D", tipus: "gorgo", szog: 90 }],
      terhek: [
        { fajta: "megoszlo", rud: "1", p1: -p, irany: "y", cimke: `p = ${p} kN/m` },
        { fajta: "pontTeher", rud: "3", a: xF - xG, F: -F, irany: "y", cimke: `F = ${F} kN` },
      ],
    };
    const e = elemez(modell);
    if (!e.ok || e.merleg.tipus !== "hatarozott") continue;
    const A = reakcio(e, "A"), B = reakcio(e, "B"), D = reakcio(e, "D");
    const ig1 = e.igenybevetelek[0];
    const MB_ = ertekek(ig1, L1).M;
    const Q = p * L1;
    const G = -D.Fy + F; // a csuklóerő (a GD részre a G-nél ható függőleges erő, felfelé +) — a GD rész egyensúlyából
    const ell = A.Fy * xG - Q * (xG - L1 / 2) + B.Fy * g; // M_G balról
    return {
      adat: { tipus: "gerber", L1, L2, g, xG, xF, F, p, Ay: A.Fy, B: B.Fy, D: D.Fy, MB: MB_, G, ell },
      szoveg: (
        <p>
          Gerber-tartó: az <M>{"A"}</M> csukló (<M>{"x = 0"}</M>), a <M>{"B"}</M> görgő (<M>{`x = ${f1(L1)}`}</M> m) és a <M>{"D"}</M> görgő (<M>{`x = ${f1(L1 + L2)}`}</M> m) között a <M>{"G"}</M> belső csukló az{" "}
          <M>{`x_G = ${f1(xG)}`}</M> m helyen van. Az <M>{"AB"}</M> szakaszon <M>{`p = ${p}\\ \\text{kN/m}`}</M> megoszló teher, az <M>{`x_F = ${f1(xF)}`}</M> m helyen <M>{`F = ${F}\\ \\text{kN}`}</M> erő hat. Számítsd ki a{" "}
          <M>{"D"}</M> és a <M>{"B"}</M> reakciót és a <M>{"B"}</M> fölötti nyomatékot — és ellenőrizd, hogy a csuklóban <M>{"M_G = 0"}</M>!
        </p>
      ),
      abra: <FeladatRajz modell={modell} eredmeny={e} cimkek={{ A: "A", B: "B", G: "G", D: "D" }} />,
      sugo: (
        <p>
          Először a befüggesztett <M>{"GD"}</M> rész (kéttámaszú tartó a <M>{"G"}</M> csuklón és a <M>{"D"}</M> görgőn): ebből <M>{"D"}</M> és a <M>{"G"}</M> csuklóerő. A csuklóerő ellentettje terheli az <M>{"ABG"}</M> fix részt a
          konzol végén. Ellenőrzés: a bal oldali részre <M>{"G"}</M>-ig felírt nyomatéki egyenlet nullát kell adjon.
        </p>
      ),
      oszlopok: 3,
      mezok: [
        { id: "d", cimke: "D (felfelé +)", egyseg: "kN", helyes: D.Fy, tizedes: 2 },
        { id: "b", cimke: "B (felfelé +)", egyseg: "kN", helyes: B.Fy, tizedes: 2 },
        { id: "mb", cimke: "M_B (alul húzott +)", egyseg: "kNm", helyes: MB_, tizedes: 2 },
      ],
      megoldas: (
        <>
          <p><strong>1. A befüggesztett GD rész</strong> (<M>{`\\ell = ${f1(L2 - g)}`}</M> m, az <M>{"F"}</M> a csuklótól <M>{`${f1(xF - xG)}`}</M> m-re):</p>
          <MB>{`\\Mp{G} ${tag(xF - xG, -F)} + ${f1(L2 - g)}\\cdot D = 0 \\;\\Rightarrow\\; D = ${f2(D.Fy)}\\ \\text{kN},\\qquad \\Fy G_y = ${F} - ${f2(D.Fy)} = ${f2(G)}\\ \\text{kN}`}</MB>
          <p>
            <strong>2. A fix ABG rész</strong>: a <M>{"G"}</M> pontban a csuklóerő ellentettje, <M>{`${f2(G)}`}</M> kN <strong>lefelé</strong> terheli a konzol végét; a megoszló teher eredője{" "}
            <M>{`Q = ${p}\\cdot ${f1(L1)} = ${f2(Q)}`}</M> kN az <M>{`x = ${f2(L1 / 2)}`}</M> m helyen.
          </p>
          <MB>{`\\Mp{A} ${tag(L1 / 2, -Q, 2, 2)} ${tag(xG, -G, 1, 2)} + ${f1(L1)}\\cdot B = 0 \\;\\Rightarrow\\; B = ${f2(B.Fy)}\\ \\text{kN},\\qquad \\Fy A_y = ${f2(Q + G)} - ${f2(B.Fy)} = ${f2(A.Fy)}\\ \\text{kN}`}</MB>
          <p><strong>3. Nyomaték a B fölött</strong> — kívülről, a <M>{"BG"}</M> konzolról (jobbról, csak a csuklóerő):</p>
          <MB>{`\\Mj{B} M_B ${tag(g, G, 1, 2)} = 0 \\;\\Rightarrow\\; M_B = ${f2(MB_)}\\ \\text{kNm}`}</MB>
          <p><strong>4. Ellenőrzés a csuklóban</strong> — a bal oldali részre <M>{"G"}</M>-ig (óramutató szerint pozitív egyenlet, a bal részre a pozitív <M>{"M_G"}</M> az óramutatóval ellentétesen hat):</p>
          <MB>{`\\Mj{G} ${tag(xG, A.Fy, 1, 2)} ${tag(xG - L1 / 2, -Q, 2, 2)} ${tag(g, B.Fy, 1, 2)} - M_G = 0 \\;\\Rightarrow\\; M_G = ${f2(ell)} \\approx 0\\ \\checkmark`}</MB>
          <p className="mt-2 text-[13px] text-petrol-600">
            A nyomatéki ábra a <M>{"G"}</M> csuklón átmegy a tengelyen, a <M>{"B"}</M> fölött felül húzott (negatív), a <M>{"GD"}</M> részen az erő alatt <M>{`${f2(D.Fy * (L1 + L2 - xF))}`}</M> kNm alul húzott — ugyanaz, mint egy{" "}
            <M>{`${f1(L2 - g)}`}</M> m-es kéttámaszú tartóé.
          </p>
          <FeladatRajz modell={modell} eredmeny={e} cimkek={{ A: "A", B: "B", G: "G", D: "D" }} diagram="M" reakciok meretek={false} />
        </>
      ),
    };
  }
  return gerberFeladat();
}

/* ============================================================
   6. Ferde tartó: N és V egy keresztmetszetben (tankönyv 8.5.a ábra, 8.4.3)
   ============================================================ */

function ferdeFeladat() {
  for (let proba = 0; proba < 100; proba++) {
    const a = fel(3, 6);
    const h = fel(1.5, 4);
    const ell = Math.hypot(a, h);
    const alfa = Math.atan2(h, a) / FOK;
    const sinA = h / ell, cosA = a / ell;
    const vanP = Math.random() < 0.5;
    const p = vanP ? egesz(2, 6) : 0;
    const F = vanP ? 0 : egesz(4, 16);
    const sF = vanP ? 0 : Math.round((ell * valaszt([0.25, 0.4, 0.5, 0.6, 0.75])) * 10) / 10;
    const sK = Math.round(ell * valaszt([0.3, 0.45, 0.55, 0.7]) * 10) / 10;
    if (!vanP && Math.abs(sK - sF) < 0.3) continue;
    const modell = {
      csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "B", x: a, y: h }],
      rudak: [{ id: "1", a: "A", b: "B" }],
      tamaszok: [{ csomopont: "A", tipus: "csuklo" }, { csomopont: "B", tipus: "gorgo", szog: 90 }],
      terhek: vanP
        ? [{ fajta: "megoszlo", rud: "1", p1: -p, irany: "y", cimke: `p = ${p} kN/m` }]
        : [{ fajta: "pontTeher", rud: "1", a: sF, F: -F, irany: "y", cimke: `F = ${F} kN` }],
    };
    const e = elemez(modell);
    if (!e.ok) continue;
    const A = reakcio(e, "A"), B = reakcio(e, "B");
    const ig = e.igenybevetelek[0];
    const K = ertekek(ig, sK);
    const xK = sK * cosA;
    const Q = p * ell;
    const balF = !vanP && sF < sK ? F : 0;
    const Qb = vanP ? p * sK : 0; // a K-tól balra eső teher
    const xF = sF * cosA;
    const fugg = A.Fy - balF - Qb; // a bal rész függőleges erőinek összege
    return {
      adat: { tipus: "ferde", a, h, ell, sinA, cosA, p, F, sF, sK, Ay: A.Fy, B: B.Fy, N: K.N, V: K.V, M: K.M, fugg },
      szoveg: (
        <p>
          Egy ferde tengelyű tartó <M>{"A"}</M> csuklója az origóban, <M>{"B"}</M> görgője (függőleges reakcióval) a <M>{`(${f1(a)};\\ ${f1(h)})`}</M> m pontban van; a tengely hossza{" "}
          <M>{`\\ell = ${szK(ell, 3)}`}</M> m, hajlása <M>{`\\alpha = ${szK(alfa, 2)}^\\circ`}</M>. {vanP ? <>A tartót a hossza mentén <M>{`p = ${p}\\ \\text{kN/m}`}</M> függőleges megoszló teher terheli.</> : <>A tartót az <M>{"A"}</M>-tól a tengely mentén <M>{`s_F = ${f1(sF)}`}</M> m-re ható <M>{`F = ${F}\\ \\text{kN}`}</M> függőleges erő terheli.</>}{" "}
          Számítsd ki a tengely mentén <M>{`s_K = ${f1(sK)}`}</M> m-re lévő <M>{"K"}</M> keresztmetszet igénybevételeit! (N húzás +, V a bal részen az <M>{"N"}</M> óramutató szerinti elforgatottja, M a jobb alsó oldal húzása esetén +.)
        </p>
      ),
      abra: <FeladatRajz modell={modell} eredmeny={e} cimkek={{ A: "A", B: "B" }} metszetek={[{ rud: "1", a: sK, cimke: "K" }]} />,
      sugo: (
        <p>
          A reakciókat a szokásos módon, <strong>vízszintes karokkal</strong> számold (a függőleges erők karja a vízszintes vetület). Az <M>{"N"}</M>-hez és <M>{"V"}</M>-hez a bal rész függőleges erőinek eredőjét bontsd
          tengelyirányú (<M>{"\\sin\\alpha"}</M>) és merőleges (<M>{"\\cos\\alpha"}</M>) komponensre; az <M>{"M"}</M>-hez a vízszintes karok jók. A megoszló teherből a <M>{"K"}</M>-ig eső darab hossza{" "}
          <M>{"s_K"}</M> (a rúd mentén mért), eredője a felénél.
        </p>
      ),
      oszlopok: 3,
      mezok: [
        { id: "n", cimke: "N_K (húzás +)", egyseg: "kN", helyes: K.N, tizedes: 2 },
        { id: "v", cimke: "V_K", egyseg: "kN", helyes: K.V, tizedes: 2 },
        { id: "m", cimke: "M_K", egyseg: "kNm", helyes: K.M, tizedes: 2 },
      ],
      megoldas: (
        <>
          <p>
            <strong>Reakciók</strong> (<M>{"A_x = 0"}</M>, mert nincs vízszintes teher). {vanP ? <>A teher eredője <M>{`Q = ${p}\\cdot ${szK(ell, 3)} = ${f2(Q)}`}</M> kN a tartó közepén, vízszintes karja <M>{`a/2 = ${f2(a / 2)}`}</M> m.</> : <>Az erő vízszintes karja <M>{`x_F = s_F\\cos\\alpha = ${f2(xF)}`}</M> m.</>}
          </p>
          <MB>{`\\Mp{A} ${vanP ? tag(a / 2, -Q, 2, 2) : tag(xF, -F, 2)} + ${f1(a)}\\cdot B = 0 \\;\\Rightarrow\\; B = ${f2(B.Fy)}\\ \\text{kN},\\qquad \\Fy A_y = ${f2(vanP ? Q : F)} - ${f2(B.Fy)} = ${f2(A.Fy)}\\ \\text{kN}`}</MB>
          <p>
            <strong>A K keresztmetszet a bal oldali részből.</strong> A <M>{"K"}</M>-tól balra: <M>{"A_y"}</M>{balF ? <> és <M>{"F"}</M></> : null}{Qb ? <> és a teher <M>{`s_K = ${f1(sK)}`}</M> m-es darabja, <M>{`Q_b = ${f2(Qb)}`}</M> kN</> : null}; függőleges eredőjük{" "}
            <M>{`R = ${f2(fugg)}`}</M> kN (felfelé +). Ezt bontjuk a tengely (<M>{`\\sin\\alpha = ${szK(sinA, 4)}`}</M>) és a merőleges (<M>{`\\cos\\alpha = ${szK(cosA, 4)}`}</M>) irányába:
          </p>
          <MB>{`\\Fz ${f2(fugg)}\\cdot ${szK(sinA, 4)} + N_K = 0 \\;\\Rightarrow\\; N_K = ${f2(K.N)}\\ \\text{kN}`}</MB>
          <MB>{`\\textstyle\\sum F_{i\\perp}\\!\\nwarrow\\,:\\ ${f2(fugg)}\\cdot ${szK(cosA, 4)} - V_K = 0 \\;\\Rightarrow\\; V_K = ${f2(K.V)}\\ \\text{kN}`}</MB>
          <p>A nyomaték a vízszintes karokkal (<M>{`x_K = s_K\\cos\\alpha = ${f2(xK)}`}</M> m):</p>
          <MB>{`\\Mj{K} ${tag(xK, A.Fy, 2, 2)}${balF ? ` ${tag(xK - xF, -F, 2)}` : ""}${Qb ? ` ${tag(xK / 2, -Qb, 2, 2)}` : ""} - M_K = 0 \\;\\Rightarrow\\; M_K = ${f2(K.M)}\\ \\text{kNm}`}</MB>
          <p className="mt-2 text-[13px] text-petrol-600">
            <M>{`N_K ${K.N < 0 ? "< 0" : "> 0"}`}</M>: a felfelé emelkedő tartó alsó szakasza {K.N < 0 ? "nyomott" : "húzott"} — a bal rész felfelé mutató eredője a tengely mentén „betol” a keresztmetszetbe. A ferde tartón a{" "}
            <M>{"V"}</M> és az <M>{"N"}</M> ábra is „ferde” vetületekből jön, az <M>{"M"}</M> viszont ugyanaz, mint egy <M>{`${f1(a)}`}</M> m-es vízszintes tartóé{vanP ? <> — a parabola belógása <M>{"q\\ell^2/8"}</M>-cal a ferde hosszal és a merőleges teherkomponenssel: <M>{`${f2(p * cosA)}\\cdot ${szK(ell, 3)}^2/8 = ${f2((p * cosA * ell * ell) / 8)}`}</M> kNm</> : null}.
          </p>
          <FeladatRajz modell={modell} eredmeny={e} cimkek={{ A: "A", B: "B" }} metszetek={[{ rud: "1", a: sK, cimke: "K" }]} diagram="N" meretek={false} />
          <FeladatRajz modell={modell} eredmeny={e} cimkek={{ A: "A", B: "B" }} diagram="M" meretek={false} />
        </>
      ),
    };
  }
  return ferdeFeladat();
}

/* ---------- a szekció ---------- */

export const GENERATOROK = [
  { cim: "Igénybevételek adott keresztmetszetben", fn: keresztmetszetFeladat },
  { cim: "M_max helye és értéke", fn: mMaxFeladat },
  { cim: "Ábraértékek a töréspontokban", fn: torespontFeladat },
  { cim: "Hol nulla a nyíróerő?", fn: nyiroNullaFeladat },
  { cim: "Gerber-tartó: csuklóban M = 0 ellenőrzés", fn: gerberFeladat },
  { cim: "Ferde tartó: N és V egy keresztmetszetben", fn: ferdeFeladat },
];

export default function GyakorloSzekcio() {
  return (
    <>
      <GyakorloDoboz cim="Igénybevételek adott keresztmetszetben" leiras="A tankönyv 8.2 receptje: reakciók, elvágás K-nál, a bal oldali rész három egyensúlyi egyenlete." generator={keresztmetszetFeladat} oszlopok={3} />
      <GyakorloDoboz cim="M_max helye és értéke" leiras="dM/dx = V: a parabola csúcsa ott van, ahol a nyíróerő nulla — de a teljes ábra maximuma lehet egy törésben is." generator={mMaxFeladat} />
      <GyakorloDoboz cim="Ábraértékek a töréspontokban" leiras="Konzol kívülről számolva (8.4.1): a szabad végtől befelé, reakció nélkül." generator={torespontFeladat} oszlopok={3} />
      <GyakorloDoboz cim="Hol nulla a nyíróerő?" leiras="Konzolos kéttámaszú tartó: a támasz fölött negatív nyomaték, a mezőben eltolt parabola-csúcs." generator={nyiroNullaFeladat} oszlopok={3} />
      <GyakorloDoboz cim="Gerber-tartó: csuklóban M = 0 ellenőrzés" leiras="Előbb a befüggesztett rész, aztán a fix rész — és a csuklóban a nyomatéknak nullának kell lennie (8.4.6)." generator={gerberFeladat} oszlopok={3} />
      <GyakorloDoboz cim="Ferde tartó: N és V egy keresztmetszetben" leiras="A tankönyv 8.5.a ábrája: N és V ferde vetületekből, M vízszintes karokkal (8.4.3)." generator={ferdeFeladat} oszlopok={3} />
      <div className="mt-10 mb-4 flex items-center gap-3">
        <span className="h-px flex-1 bg-petrol-200" />
        <span className="text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">További feladattípusok</span>
        <span className="h-px flex-1 bg-petrol-200" />
      </div>
      <GyakorloExtra />
    </>
  );
}
