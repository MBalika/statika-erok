"use client";

import GyakorloDoboz from "@/components/GyakorloDoboz";
import { M, MB } from "@/components/ui/Keplet";
import { szK } from "@/lib/szamok";
import { elemez, ertekek, ugrasok } from "@/lib/tarto";
import { egesz, valaszt, fel, tag, tagE } from "@/components/tartok/GyakorloExtra";
import FeladatRajz from "./FeladatRajz";

/*
 * További generátorok a 9. modulhoz (a zh-szimulátor az EXTRA_GENERATOROK tömbből olvas):
 *   – Tört tengelyű keret sarka (tankönyv 8.4.3, vizsgaminta 2. példa)
 *   – Koncentrált nyomaték ugrása (8.3.3 táblázat)
 *   – Vizsga-típus: teljes ábra három értékkel (két szimmetrikus erő / konzol p + F)
 * Minden szám a számítómagból jön.
 */

const f1 = (v) => szK(v, Math.abs(v - Math.round(v)) < 1e-9 ? 0 : Math.abs(v * 10 - Math.round(v * 10)) < 1e-9 ? 1 : 2);
const f2 = (v) => szK(v, 2);
const reakcio = (e, id) => e.reakciok.find((r) => r.csomopont === id) ?? { Fx: 0, Fy: 0, M: 0 };

/* ============================================================
   1. Tört tengelyű keret sarka
   ============================================================ */

function keretSarokFeladat() {
  for (let proba = 0; proba < 100; proba++) {
    const h = fel(2, 4);
    const b = fel(1.5, 4);
    const p = egesz(2, 6);
    const vanF = Math.random() < 0.6;
    const F = vanF ? egesz(3, 10) : 0;
    const Fhely = valaszt(["B", "C"]); // vízszintes erő a gerenda végén vagy a sarokban
    const jobbra = Math.random() < 0.5;
    const Fx = jobbra ? F : -F;
    const modell = {
      csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "C", x: 0, y: h }, { id: "B", x: b, y: h }],
      rudak: [{ id: "1", a: "A", b: "C" }, { id: "2", a: "C", b: "B" }],
      tamaszok: [{ csomopont: "A", tipus: "befogas" }],
      terhek: [
        { fajta: "megoszlo", rud: "2", p1: -p, irany: "y", cimke: `p = ${p} kN/m` },
        ...(vanF ? [{ fajta: "csomopontiEro", csomopont: Fhely, Fx, Fy: 0, cimke: `F = ${F} kN` }] : []),
      ],
    };
    const e = elemez(modell);
    if (!e.ok) continue;
    const igO = e.igenybevetelek[0]; // oszlop A → C
    const igG = e.igenybevetelek[1]; // gerenda C → B
    const Cg = ertekek(igG, 1e-9); // a gerenda sarok melletti keresztmetszete
    const Co = ertekek(igO, h - 1e-9); // az oszlop sarok melletti keresztmetszete
    const Ao = ertekek(igO, 1e-9);
    if (Math.abs(Math.abs(Cg.M) - Math.abs(Co.M)) > 1e-6) continue; // a sarokban a két nyomaték egyenlő
    const Q = p * b;
    const A = reakcio(e, "A");
    const MC = Math.abs(Cg.M);
    return {
      adat: { tipus: "keret", h, b, p, F: vanF ? Fx : 0, Fhely, MC, N: Co.N, V: Co.V, MA: Ao.M, Ax: A.Fx, Ay: A.Fy, MAreak: A.M },
      szoveg: (
        <p>
          Egy tört tengelyű tartó <M>{`h = ${f1(h)}`}</M> m magas <M>{"AC"}</M> oszlopát alul (<M>{"A"}</M>) befogták; a sarokból <M>{`b = ${f1(b)}`}</M> m hosszú vízszintes <M>{"CB"}</M> gerenda nyúlik ki, amelyet{" "}
          <M>{`p = ${p}\\ \\text{kN/m}`}</M> függőleges megoszló teher terhel{vanF ? <>, és a <M>{Fhely}</M> pontban egy <M>{`F = ${F}\\ \\text{kN}`}</M> vízszintes, {jobbra ? "jobbra" : "balra"} mutató erő is hat</> : null}. Mekkora a
          hajlítónyomaték a <M>{"C"}</M> sarokban, és mekkora a normálerő és a nyíróerő az oszlopban (a sarok alatt)? (A nyomatékot és a nyíróerőt abszolút értékben, a normálerőt előjelesen: húzás +.)
        </p>
      ),
      abra: <FeladatRajz modell={modell} eredmeny={e} cimkek={{ A: "A", B: "B", C: "C" }} />,
      sugo: (
        <p>
          Kívülről, a szabad <M>{"B"}</M> vég felől számolj, nem kell reakció. A sarokban a két csonkra ható nyomaték egyenlő nagyságú és ellentétes irányba forgat (a sarok egyensúlya, tankönyv 8.4.3) — a nyomatéki ábra „befordul” a sarkon. Az
          oszlopban a normálerő a függőleges, a nyíróerő a vízszintes erők eredője.
        </p>
      ),
      oszlopok: 3,
      mezok: [
        { id: "mc", cimke: "|M_C| a sarokban", egyseg: "kNm", helyes: MC, tizedes: 2 },
        { id: "n", cimke: "N az oszlopban (húzás +)", egyseg: "kN", helyes: Co.N, tizedes: 2 },
        { id: "v", cimke: "|V| az oszlopban", egyseg: "kN", helyes: Math.abs(Co.V), tizedes: 2 },
      ],
      megoldas: (
        <>
          <p>
            <strong>A gerenda, kívülről.</strong> A <M>{"B"}</M> szabad végen <M>{"M = 0"}</M>; a sarok melletti keresztmetszetre a gerenda teljes terhe hat: <M>{`Q = ${p}\\cdot ${f1(b)} = ${f2(Q)}`}</M> kN, karja <M>{`b/2 = ${f2(b / 2)}`}</M> m
            {vanF && Fhely === "B" ? <>; a <M>{"B"}</M>-beli vízszintes erő hatásvonala a gerenda tengelye, a sarokra nincs nyomatéka</> : null}.
          </p>
          <MB>{`\\Mj{C} M_C ${tag(b / 2, Q, 2, 2)} = 0 \\;\\Rightarrow\\; M_{C,\\text{ger}} = ${f2(Cg.M)}\\ \\text{kNm}\\quad (\\text{felül húzott})`}</MB>
          <p>
            <strong>A sarok egyensúlya.</strong> A sarokra a gerendacsonkról <M>{`${f2(MC)}`}</M> kNm, az oszlopcsonkról ugyanekkora, ellentétes forgatású nyomaték hat: <M>{`|M_{C,\\text{oszlop}}| = |M_{C,\\text{ger}}| = ${f2(MC)}`}</M> kNm. Az ábra a gerendán a
            felső (külső) oldalon, az oszlopon ugyanígy a külső oldalon fut — befordul a sarkon.
          </p>
          <p>
            <strong>Az oszlop igénybevételei a sarok alatt</strong> — a felette lévő részre (gerenda + sarok) ható erőkből: függőleges: <M>{`Q = ${f2(Q)}`}</M> kN lefelé{vanF ? <>; vízszintes: <M>{`F = ${F}`}</M> kN {jobbra ? "jobbra" : "balra"}</> : null}.
          </p>
          <MB>{`N = -${f2(Q)} = ${f2(Co.N)}\\ \\text{kN}\\ (\\text{nyomott}),\\qquad |V| = ${vanF ? `${F}` : "0"}\\ \\text{kN}`}</MB>
          <p>
            Az oszlopban a nyomaték {vanF ? <>a vízszintes erő miatt lineárisan változik: a befogásnál <M>{`M_A = ${f2(Ao.M)}`}</M> kNm</> : <>állandó (nincs vízszintes erő, <M>{"V = 0"}</M>): a befogásnál is <M>{`${f2(Ao.M)}`}</M> kNm</>}. Ellenőrzés a reakciókkal: <M>{`A_y = ${f2(A.Fy)}`}</M>,{" "}
            <M>{`A_x = ${f2(A.Fx)}`}</M> kN, <M>{`M_A = ${f2(A.M)}`}</M> kNm.
          </p>
          <FeladatRajz modell={modell} eredmeny={e} cimkek={{ A: "A", B: "B", C: "C" }} diagram="M" reakciok meretek={false} />
          <FeladatRajz modell={modell} eredmeny={e} cimkek={{ A: "A", B: "B", C: "C" }} diagram="N" meretek={false} />
        </>
      ),
    };
  }
  return keretSarokFeladat();
}

/* ============================================================
   2. Koncentrált nyomaték ugrása
   ============================================================ */

function nyomatekUgrasFeladat() {
  for (let proba = 0; proba < 100; proba++) {
    const L = fel(4, 8);
    const xM = fel(1, L - 1);
    let xF = fel(0.5, L - 0.5);
    if (Math.abs(xF - xM) < 0.75) continue;
    const F = egesz(4, 14);
    const M0 = egesz(3, 12) * (Math.random() < 0.5 ? 1 : -1);
    const modell = {
      csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "B", x: L, y: 0 }],
      rudak: [{ id: "1", a: "A", b: "B" }],
      tamaszok: [{ csomopont: "A", tipus: "csuklo" }, { csomopont: "B", tipus: "gorgo", szog: 90 }],
      terhek: [
        { fajta: "pontTeher", rud: "1", a: xF, F: -F, irany: "y", cimke: `F = ${F} kN` },
        { fajta: "pontNyomatek", rud: "1", a: xM, M: M0, cimke: `M₀ = ${Math.abs(M0)} kNm` },
      ],
    };
    const e = elemez(modell);
    if (!e.ok) continue;
    const ig = e.igenybevetelek[0];
    const u = ugrasok(ig).find((q) => Math.abs(q.x - xM) < 1e-6);
    if (!u) continue;
    const A = reakcio(e, "A"), B = reakcio(e, "B");
    const balF = xF < xM;
    const V = u.bal.V;
    return {
      adat: { tipus: "ugras", L, xF, xM, F, M0, Ay: A.Fy, B: B.Fy, Mbal: u.bal.M, Mjobb: u.jobb.M, V },
      szoveg: (
        <p>
          Egy <M>{`L = ${f1(L)}\\ \\text{m}`}</M> támaszközű kéttámaszú tartón (<M>{"A"}</M> csukló, <M>{"B"}</M> görgő) az <M>{`x_F = ${f1(xF)}`}</M> m helyen <M>{`F = ${F}\\ \\text{kN}`}</M> függőleges erő, az{" "}
          <M>{`x_M = ${f1(xM)}`}</M> m helyen <M>{`M_0 = ${Math.abs(M0)}\\ \\text{kNm}`}</M> koncentrált nyomaték hat, amely {M0 > 0 ? "az óramutatóval ellentétesen" : "az óramutató járásával egyezően"} forgat. Mekkora a
          hajlítónyomaték közvetlenül a nyomaték támadáspontjától balra és jobbra, és mekkora ott a nyíróerő?
        </p>
      ),
      abra: <FeladatRajz modell={modell} eredmeny={e} cimkek={{ A: "A", B: "B" }} metszetek={[{ rud: "1", a: xM, cimke: "K" }]} />,
      sugo: (
        <p>
          A koncentrált nyomaték a reakciókban erőpárként jelenik meg (<M>{"M_0/L"}</M>), a vetületi egyenletekben nem. A <M>{"V"}</M> ábrában nincs ugrás a támadáspontban, az <M>{"M"}</M> ábrában viszont pontosan{" "}
          <M>{"M_0"}</M> nagyságú ugrás van; a bal oldali részre írt nyomatéki egyenletbe a támadásponttól balra még nem, jobbra már bekerül <M>{"M_0"}</M> — a forgásirányának megfelelő előjellel (az óramutató szerint
          pozitív egyenletben a <M>{"\\curvearrowleft"}</M> nyomaték negatív).
        </p>
      ),
      oszlopok: 3,
      mezok: [
        { id: "mb", cimke: "M közvetlenül balra", egyseg: "kNm", helyes: u.bal.M, tizedes: 2 },
        { id: "mj", cimke: "M közvetlenül jobbra", egyseg: "kNm", helyes: u.jobb.M, tizedes: 2 },
        { id: "v", cimke: "V a támadáspontban", egyseg: "kN", helyes: V, tizedes: 2 },
      ],
      megoldas: (
        <>
          <p><strong>Reakciók</strong> — a koncentrált nyomaték a nyomatéki egyenletekbe közvetlenül, a saját előjelével kerül:</p>
          <MB>{`\\Mp{A} ${tag(xF, -F)} ${tagE(M0)} + ${f1(L)}\\cdot B = 0 \\;\\Rightarrow\\; B = ${f2(B.Fy)}\\ \\text{kN},\\qquad \\Fy A_y = ${F} - ${f2(B.Fy)} = ${f2(A.Fy)}\\ \\text{kN}`}</MB>
          <p>
            <strong>Balra a támadásponttól</strong> (<M>{"x_M^-"}</M>): a bal oldali részen <M>{"A_y"}</M>{balF ? <> és <M>{"F"}</M></> : null}, <M>{"M_0"}</M> még nem:
          </p>
          <MB>{`\\Fy ${f2(A.Fy)}${balF ? ` - ${F}` : ""} - V = 0 \\;\\Rightarrow\\; V = ${f2(V)}\\ \\text{kN}`}</MB>
          <MB>{`\\Mj{K} ${tag(xM, A.Fy, 1, 2)}${balF ? ` ${tag(xM - xF, -F)}` : ""} - M^- = 0 \\;\\Rightarrow\\; M^- = ${f2(u.bal.M)}\\ \\text{kNm}`}</MB>
          <p><strong>Jobbra a támadásponttól</strong> (<M>{"x_M^+"}</M>): ugyanaz, plusz <M>{"M_0"}</M>, amely a bal részre hat, az óramutatóval {M0 > 0 ? "ellentétesen — az óramutató szerint pozitív egyenletben tehát −" : "egyezően — az óramutató szerint pozitív egyenletben +"}:</p>
          <MB>{`\\Mj{K} ${tag(xM, A.Fy, 1, 2)}${balF ? ` ${tag(xM - xF, -F)}` : ""} ${tagE(-M0)} - M^+ = 0 \\;\\Rightarrow\\; M^+ = ${f2(u.jobb.M)}\\ \\text{kNm}`}</MB>
          <p className="mt-2 text-[13px] text-petrol-600">
            Az ugrás <M>{`M^+ - M^- = ${f2(u.jobb.M - u.bal.M)} = ${M0 > 0 ? "-" : "+"}M_0`}</M>: az óramutatóval {M0 > 0 ? "ellentétesen" : "egyezően"} forgató nyomaték balról jobbra haladva {M0 > 0 ? "csökkenti" : "növeli"} az <M>{"M"}</M>-et (az alsó
            szál húzása felé mérve) — csak az <M>{"A_y"}</M>-nal azonos irányba (az óramutató szerint) forgató nyomaték növeli az alsó szál húzását. A <M>{"V"}</M> a támadáspontban nem változik (<M>{`${f2(V)}`}</M> kN mindkét oldalon), ezért az <M>{"M"}</M> ábra érintője az ugrás két oldalán párhuzamos.
          </p>
          <FeladatRajz modell={modell} eredmeny={e} cimkek={{ A: "A", B: "B" }} diagram="M" meretek={false} />
        </>
      ),
    };
  }
  return nyomatekUgrasFeladat();
}

/* ============================================================
   3. Vizsga-típus: teljes ábra három értékkel
   ============================================================ */

function vizsgaFeladat() {
  if (Math.random() < 0.5) {
    // két szimmetrikus erő
    const a = fel(1, 3);
    const c = fel(1, 4); // a két erő távolsága
    const L = 2 * a + c;
    const F = egesz(4, 16);
    const modell = {
      csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "B", x: L, y: 0 }],
      rudak: [{ id: "1", a: "A", b: "B" }],
      tamaszok: [{ csomopont: "A", tipus: "csuklo" }, { csomopont: "B", tipus: "gorgo", szog: 90 }],
      terhek: [
        { fajta: "pontTeher", rud: "1", a, F: -F, irany: "y", cimke: `F = ${F} kN` },
        { fajta: "pontTeher", rud: "1", a: L - a, F: -F, irany: "y", cimke: `F = ${F} kN` },
      ],
    };
    const e = elemez(modell);
    const ig = e.igenybevetelek[0];
    const A = reakcio(e, "A");
    const kozep = ertekek(ig, L / 2);
    const Ma = ertekek(ig, a).M;
    return {
      adat: { tipus: "vizsgaSzimm", a, c, L, F, A: A.Fy, Vk: kozep.V, Ma },
      szoveg: (
        <p>
          Vizsga-típusú feladat (a vizsgaminta 2. példája szerint: „egyszerű terhelés, esetleg két szimmetrikusan elhelyezkedő erő”). Egy <M>{`L = ${f1(L)}\\ \\text{m}`}</M> támaszközű kéttámaszú tartót két egyforma,{" "}
          <M>{`F = ${F}\\ \\text{kN}`}</M> függőleges erő terhel, a támaszoktól <M>{`a = ${f1(a)}`}</M> m-re. Rajzold meg a <M>{"V"}</M> és <M>{"M"}</M> ábrát, és add meg a három jellemző értéket: a reakciót, a nyíróerőt a két erő
          között és a legnagyobb nyomatékot!
        </p>
      ),
      abra: <FeladatRajz modell={modell} eredmeny={e} cimkek={{ A: "A", B: "B" }} />,
      sugo: (
        <p>
          Szimmetria: <M>{"A = B = F"}</M>. A <M>{"V"}</M> ábra: <M>{"+F"}</M>, majd a két erő között nulla, majd <M>{"-F"}</M>. Ahol <M>{"V = 0"}</M>, ott az <M>{"M"}</M> állandó — a két erő között „tiszta hajlítás” van,{" "}
          <M>{"M = F\\,a"}</M>.
        </p>
      ),
      oszlopok: 3,
      mezok: [
        { id: "a", cimke: "A (felfelé +)", egyseg: "kN", helyes: A.Fy, tizedes: 2 },
        { id: "v", cimke: "V a két erő között", egyseg: "kN", helyes: kozep.V, tizedes: 2, tures: 0.02 },
        { id: "m", cimke: "M_max", egyseg: "kNm", helyes: Ma, tizedes: 2 },
      ],
      megoldas: (
        <>
          <MB>{`\\Mp{A} ${tag(a, -F)} ${tag(L - a, -F)} + ${f1(L)}\\cdot B = 0 \\;\\Rightarrow\\; B = ${f2(A.Fy)}\\ \\text{kN} = A\\ (\\text{szimmetria})`}</MB>
          <p><strong>V ábra</strong> balról: a támasznál <M>{`+${F}`}</M> (az <M>{"A"}</M> reakció ugrása), az első erőnél <M>{`${F}`}</M>-fel leugrik nullára, a másodiknál <M>{`-${F}`}</M>-ra, a <M>{"B"}</M> zárja vissza nullára:</p>
          <MB>{`V_{AF_1} = ${f2(A.Fy)},\\qquad V_{F_1F_2} = ${f2(A.Fy)} - ${F} = ${f2(kozep.V)},\\qquad V_{F_2B} = ${f2(kozep.V - F)}\\ \\text{kN}`}</MB>
          <p><strong>M ábra</strong>: a támaszoknál nulla, az erőkig lineáris, a két erő között állandó (<M>{"V = 0"}</M>):</p>
          <MB>{`\\Mp{F_1} ${tag(a, A.Fy, 1, 2)} - M = 0 \\;\\Rightarrow\\; M_{\\max} = F\\,a = ${f2(Ma)}\\ \\text{kNm}`}</MB>
          <p className="mt-2 text-[13px] text-petrol-600">
            Ellenőrzés a közepén, mindkét erővel: <M>{`${f2(A.Fy)}\\cdot ${f2(L / 2)} - ${F}\\cdot ${f2(L / 2 - a)} = ${f2(kozep.M)}`}</M> kNm — ugyanannyi, mert a két erő között az ábra vízszintes. Ez a vizsgán részpont nélkül, egyben kell:
            a helyes N (= 0), V és M ábra.
          </p>
          <FeladatRajz modell={modell} eredmeny={e} cimkek={{ A: "A", B: "B" }} diagram="V" meretek={false} />
          <FeladatRajz modell={modell} eredmeny={e} cimkek={{ A: "A", B: "B" }} diagram="M" meretek={false} />
        </>
      ),
    };
  }
  // konzol: megoszló teher a teljes hosszon + erő a végén (vizsgaminta 2. példa szellemében)
  const L = fel(2, 5);
  const p = egesz(2, 6);
  const F = egesz(2, 10);
  const modell = {
    csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "B", x: L, y: 0 }],
    rudak: [{ id: "1", a: "A", b: "B" }],
    tamaszok: [{ csomopont: "A", tipus: "befogas" }],
    terhek: [
      { fajta: "megoszlo", rud: "1", p1: -p, irany: "y", cimke: `p = ${p} kN/m` },
      { fajta: "csomopontiEro", csomopont: "B", Fy: -F, cimke: `F = ${F} kN` },
    ],
  };
  const e = elemez(modell);
  const ig = e.igenybevetelek[0];
  const Aj = ertekek(ig, 1e-9);
  const kozep = ertekek(ig, L / 2);
  return {
    adat: { tipus: "vizsgaKonzol", L, p, F, VA: Aj.V, MA: Aj.M, MK: kozep.M, VK: kozep.V },
    szoveg: (
      <p>
        Vizsga-típusú feladat. Egy <M>{`L = ${f1(L)}\\ \\text{m}`}</M> hosszú, bal végén befogott konzolt a teljes hosszán <M>{`p = ${p}\\ \\text{kN/m}`}</M> megoszló teher és a szabad végén <M>{`F = ${F}\\ \\text{kN}`}</M> erő terhel.
        Rajzold meg a <M>{"V"}</M> és az <M>{"M"}</M> ábrát, és add meg: a nyíróerőt és a nyomatékot a befogásnál, valamint a nyomatékot a konzol közepén!
      </p>
    ),
    abra: <FeladatRajz modell={modell} eredmeny={e} cimkek={{ A: "A", B: "B" }} metszetek={[{ rud: "1", a: L / 2, cimke: "K" }]} />,
    sugo: (
      <p>
        Kívülről: a szabad végen <M>{`V = F`}</M>, <M>{"M = 0"}</M>; befelé haladva a <M>{"V"}</M> lineárisan nő (<M>{"+p\\,x"}</M>), az <M>{"M"}</M> parabola: <M>{"M(s) = -F s - p s^2/2"}</M>, ahol <M>{"s"}</M> a
        szabad végtől mért távolság. Vigyázz: a szabad végen <M>{"V = F \\ne 0"}</M>, tehát a parabola érintője ott nem vízszintes — a meredeksége éppen <M>{"F"}</M>.
      </p>
    ),
    oszlopok: 3,
    mezok: [
      { id: "va", cimke: "V a befogásnál", egyseg: "kN", helyes: Aj.V, tizedes: 2 },
      { id: "ma", cimke: "M a befogásnál (alul húzott +)", egyseg: "kNm", helyes: Aj.M, tizedes: 2 },
      { id: "mk", cimke: "M a konzol közepén", egyseg: "kNm", helyes: kozep.M, tizedes: 2 },
    ],
    megoldas: (
      <>
        <p><strong>Kívülről befelé</strong>, a jobb oldali részből (a jobb részen a pozitív <M>{"V"}</M> felfelé, a pozitív <M>{"M"}</M> az óramutató járásával egyezően hat; a nyomatéki egyenlet az óramutató szerint pozitív):</p>
        <MB>{`\\Fy V_K - ${F} - ${p}\\cdot ${f2(L / 2)} = 0 \\;\\Rightarrow\\; V_K = ${f2(kozep.V)}\\ \\text{kN};\\qquad \\Mj{K} M_K ${tag(L / 2, F, 2)} ${tag(L / 4, p * L / 2, 2, 2)} = 0 \\;\\Rightarrow\\; M_K = ${f2(kozep.M)}\\ \\text{kNm}`}</MB>
        <MB>{`\\Fy V_A - ${F} - ${p}\\cdot ${f1(L)} = 0 \\;\\Rightarrow\\; V_A = ${f2(Aj.V)}\\ \\text{kN};\\qquad \\Mj{A} M_A ${tag(L, F, 1)} ${tag(L / 2, p * L, 2, 2)} = 0 \\;\\Rightarrow\\; M_A = ${f2(Aj.M)}\\ \\text{kNm}`}</MB>
        <p className="mt-2 text-[13px] text-petrol-600">
          Az ábra: <M>{"V"}</M> lineáris <M>{`${F}`}</M>-től <M>{`${f2(Aj.V)}`}</M>-ig; <M>{"M"}</M> parabola, végig a felső (húzott) oldalon, a befogásnál <M>{`${f2(Math.abs(Aj.M))}`}</M> kNm = <M>{`FL + pL^2/2 = ${f2(F * L)} + ${f2((p * L * L) / 2)}`}</M>.
          A befogás reakciói innen: <M>{`A_y = ${f2(Aj.V)}`}</M> kN, <M>{`M_A = ${f2(Aj.M)}`}</M> kNm.
        </p>
        <FeladatRajz modell={modell} eredmeny={e} cimkek={{ A: "A", B: "B" }} diagram="V" meretek={false} />
        <FeladatRajz modell={modell} eredmeny={e} cimkek={{ A: "A", B: "B" }} diagram="M" meretek={false} />
      </>
    ),
  };
}

export const EXTRA_GENERATOROK = [
  { cim: "Tört tengelyű keret sarka", fn: keretSarokFeladat },
  { cim: "Koncentrált nyomaték ugrása", fn: nyomatekUgrasFeladat },
  { cim: "Vizsga-típus: teljes ábra három értékkel", fn: vizsgaFeladat },
];

export default function GyakorloExtra() {
  return (
    <>
      <GyakorloDoboz cim="Tört tengelyű keret sarka" leiras="A vizsgaminta 2. példája: L alakú tartó, a nyomatéki ábra befordul a sarkon (8.4.3)." generator={keretSarokFeladat} oszlopok={3} />
      <GyakorloDoboz cim="Koncentrált nyomaték ugrása" leiras="A 8.3.3 táblázat utolsó sora: a V-ben semmi, az M-ben M₀ nagyságú ugrás — de merre?" generator={nyomatekUgrasFeladat} oszlopok={3} />
      <GyakorloDoboz cim="Vizsga-típus: teljes ábra három értékkel" leiras="A vizsga 2. példájának két tipikus alakja: szimmetrikus erőpár, illetve konzol p + F teherrel." generator={vizsgaFeladat} oszlopok={3} />
    </>
  );
}
