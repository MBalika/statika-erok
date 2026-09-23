/**
 * Véletlen tartó-generátor a Tartóépítő kihívás-módjához (szerkesztő-állapotot ad, lásd modell.js).
 *
 *   veletlenTarto(fok)  fok = 1: gerenda (kéttámaszú, konzol)
 *                       fok = 2: összetett gerenda (konzolos, Gerber-tartó, koncentrált nyomaték)
 *                       fok = 3: keret és ferde rúd (egyszerű keret, háromcsuklós keret, L-konzol, ferde gerenda)
 *
 * Mindig statikailag határozott és terhelt, kerek számokkal: F 5–30 kN, q 2–10 kN/m, M 5–20 kNm,
 * hosszak 1–6 m 0,5-ösével. A generátor a számítómaggal ellenőriz, és lehetőleg olyan tartót ad,
 * amelynek töréspont-értékei 0,5-re kerekek.
 */

import { elemez } from "../tarto/index.js";
import { motorModell, vanTeher } from "./modell.js";
import { rajzFeladat } from "./ellenorzes.js";

const egesz = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
const valaszt = (t) => t[Math.floor(Math.random() * t.length)];
const fel = (min, max) => egesz(Math.round(min * 2), Math.round(max * 2)) / 2;
const F_ERTEK = () => valaszt([5, 6, 8, 10, 12, 15, 16, 18, 20, 24, 25, 30]);
const Q_ERTEK = () => valaszt([2, 3, 4, 5, 6, 8, 10]);
const M_ERTEK = () => valaszt([5, 6, 8, 10, 12, 15, 16, 18, 20]);

function allapot({ csomopontok, rudak, csuklok = [], tamaszok, terhek }) {
  return {
    csomopontok: csomopontok.map(([id, x, y]) => ({ id, x, y })),
    rudak: rudak.map(([id, a, b]) => ({ id, a, b })),
    csuklok,
    tamaszok: tamaszok.map(([csomopont, tipus, szog]) => (tipus === "gorgo" ? { csomopont, tipus, szog: szog ?? 90 } : { csomopont, tipus })),
    terhek: terhek.map((t, i) => ({ id: `t${i + 1}`, ...t })),
  };
}

/* ---------------- 1. fok: gerendák ---------------- */

function kettamaszu() {
  const L = fel(4, 8);
  const x0 = valaszt([1, 2, 3]);
  const mod = valaszt(["F", "q", "Fq", "qResz", "FF"]);
  const terhek = [];
  if (mod === "F" || mod === "Fq") terhek.push({ fajta: "pontTeher", rud: "1", a: fel(1, L - 1), F: F_ERTEK(), szog: -90 });
  if (mod === "FF") {
    const a1 = fel(1, L / 2 - 0.5), a2 = fel(L / 2 + 0.5, L - 1);
    terhek.push({ fajta: "pontTeher", rud: "1", a: a1, F: F_ERTEK(), szog: -90 }, { fajta: "pontTeher", rud: "1", a: a2, F: F_ERTEK(), szog: -90 });
  }
  if (mod === "q" || mod === "Fq") terhek.push({ fajta: "megoszlo", rud: "1", a1: 0, a2: L, p1: Q_ERTEK(), p2: undefined, szog: -90 });
  if (mod === "qResz") {
    const balrol = Math.random() < 0.5;
    const h = fel(2, L - 1);
    terhek.push({ fajta: "megoszlo", rud: "1", a1: balrol ? 0 : L - h, a2: balrol ? h : L, p1: Q_ERTEK(), p2: undefined, szog: -90 });
  }
  terhek.forEach((t) => { if (t.fajta === "megoszlo") t.p2 = t.p1; });
  return { nev: "kéttámaszú tartó", allapot: allapot({ csomopontok: [["A", x0, 3], ["B", x0 + L, 3]], rudak: [["1", "A", "B"]], tamaszok: [["A", "csuklo"], ["B", "gorgo", 90]], terhek }) };
}

function konzol() {
  const L = fel(2, 5);
  const balra = Math.random() < 0.65;
  const x0 = valaszt([2, 3, 4]);
  const mod = valaszt(["Fveg", "q", "FqVeg", "Fbelso", "qResz", "MvegF"]);
  const terhek = [];
  const vegId = balra ? "B" : "A";
  if (mod === "Fveg" || mod === "FqVeg") terhek.push({ fajta: "csomopontiEro", csomopont: vegId, F: F_ERTEK(), szog: -90 });
  if (mod === "Fbelso") terhek.push({ fajta: "pontTeher", rud: "1", a: fel(0.5, L - 0.5), F: F_ERTEK(), szog: -90 });
  if (mod === "q" || mod === "FqVeg") terhek.push({ fajta: "megoszlo", rud: "1", a1: 0, a2: L, p1: 0, p2: 0, szog: -90 });
  if (mod === "qResz") {
    const h = fel(1, L - 0.5);
    terhek.push({ fajta: "megoszlo", rud: "1", a1: balra ? L - h : 0, a2: balra ? L : h, p1: 0, p2: 0, szog: -90 });
  }
  if (mod === "MvegF") terhek.push({ fajta: "csomopontiNyomatek", csomopont: vegId, M: M_ERTEK() * (Math.random() < 0.5 ? 1 : -1) }, { fajta: "csomopontiEro", csomopont: vegId, F: F_ERTEK(), szog: -90 });
  terhek.forEach((t) => { if (t.fajta === "megoszlo") { t.p1 = Q_ERTEK(); t.p2 = t.p1; } });
  return { nev: "befogott konzol", allapot: allapot({ csomopontok: [["A", x0, 3], ["B", x0 + L, 3]], rudak: [["1", "A", "B"]], tamaszok: [[balra ? "A" : "B", "befogas"]], terhek }) };
}

/* ---------------- 2. fok: összetett gerendák ---------------- */

function konzolos() {
  const L = fel(3, 6), c = fel(1, 2.5);
  const jobbra = Math.random() < 0.6;
  const x0 = valaszt([1, 2]);
  const mod = valaszt(["Fveg", "FvegF", "q", "FvegQ", "qKonzol"]);
  const terhek = [];
  // A—B a főmező, B—C (vagy V—A) a konzol
  const csomopontok = jobbra ? [["A", x0, 3], ["B", x0 + L, 3], ["C", x0 + L + c, 3]] : [["C", x0, 3], ["A", x0 + c, 3], ["B", x0 + c + L, 3]];
  const rudak = jobbra ? [["1", "A", "B"], ["2", "B", "C"]] : [["1", "C", "A"], ["2", "A", "B"]];
  const foRud = jobbra ? "1" : "2", konzolRud = jobbra ? "2" : "1";
  if (mod !== "q" && mod !== "qKonzol") terhek.push({ fajta: "csomopontiEro", csomopont: "C", F: F_ERTEK(), szog: -90 });
  if (mod === "FvegF") terhek.push({ fajta: "pontTeher", rud: foRud, a: fel(1, L - 1), F: F_ERTEK(), szog: -90 });
  if (mod === "q") { const q = Q_ERTEK(); terhek.push({ fajta: "megoszlo", rud: foRud, a1: 0, a2: L, p1: q, p2: q, szog: -90 }, { fajta: "megoszlo", rud: konzolRud, a1: 0, a2: c, p1: q, p2: q, szog: -90 }); }
  if (mod === "FvegQ") { const q = Q_ERTEK(); terhek.push({ fajta: "megoszlo", rud: foRud, a1: 0, a2: L, p1: q, p2: q, szog: -90 }); }
  if (mod === "qKonzol") { const q = Q_ERTEK(); terhek.push({ fajta: "megoszlo", rud: konzolRud, a1: 0, a2: c, p1: q, p2: q, szog: -90 }, { fajta: "pontTeher", rud: foRud, a: fel(1, L - 1), F: F_ERTEK(), szog: -90 }); }
  return { nev: "konzolos kéttámaszú tartó", allapot: allapot({ csomopontok, rudak, tamaszok: [["A", "csuklo"], ["B", "gorgo", 90]], terhek }) };
}

function gerber() {
  const L1 = fel(3, 5), L2 = fel(3, 5);
  const g = fel(1, Math.min(2, L2 - 1.5));
  const x0 = 1;
  const csomopontok = [["A", x0, 3], ["B", x0 + L1, 3], ["G", x0 + L1 + g, 3], ["C", x0 + L1 + L2, 3]];
  const rudak = [["1", "A", "B"], ["2", "B", "G"], ["3", "G", "C"]];
  const terhek = [{ fajta: "pontTeher", rud: "3", a: fel(0.5, L2 - g - 0.5), F: F_ERTEK(), szog: -90 }];
  const mod = valaszt(["F", "Fq", "Fq", "FF"]);
  if (mod === "Fq") { const q = Q_ERTEK(); terhek.push({ fajta: "megoszlo", rud: "1", a1: 0, a2: L1, p1: q, p2: q, szog: -90 }); }
  if (mod === "FF") terhek.push({ fajta: "pontTeher", rud: "1", a: fel(1, L1 - 1), F: F_ERTEK(), szog: -90 });
  return { nev: "Gerber-tartó (belső csukló G-ben)", allapot: allapot({ csomopontok, rudak, csuklok: ["G"], tamaszok: [["A", "csuklo"], ["B", "gorgo", 90], ["C", "gorgo", 90]], terhek }) };
}

function nyomatekos() {
  const konzolE = Math.random() < 0.35;
  const L = konzolE ? valaszt([2, 3, 4]) : valaszt([4, 5, 6, 8]);
  const x0 = valaszt([1, 2, 3]);
  const M0 = (konzolE ? M_ERTEK() : L * valaszt([1, 1.5, 2, 2.5, 3])) * (Math.random() < 0.5 ? 1 : -1);
  const terhek = [{ fajta: "pontNyomatek", rud: "1", a: konzolE ? fel(0.5, L - 0.5) : fel(1, L - 1), M: M0 }];
  if (konzolE) terhek.push({ fajta: "csomopontiEro", csomopont: "B", F: F_ERTEK(), szog: -90 });
  else {
    let a = valaszt([L / 2, L / 4, (3 * L) / 4].filter((v) => Math.abs(v * 2 - Math.round(v * 2)) < 1e-9));
    if (Math.abs(a - terhek[0].a) < 0.75) a = a + 1 <= L - 0.5 ? a + 1 : a - 1;
    terhek.push({ fajta: "pontTeher", rud: "1", a, F: valaszt([6, 8, 10, 12, 16, 20]), szog: -90 });
  }
  return {
    nev: konzolE ? "konzol koncentrált nyomatékkal" : "kéttámaszú tartó koncentrált nyomatékkal",
    allapot: allapot({ csomopontok: [["A", x0, 3], ["B", x0 + L, 3]], rudak: [["1", "A", "B"]], tamaszok: konzolE ? [["A", "befogas"]] : [["A", "csuklo"], ["B", "gorgo", 90]], terhek }),
  };
}

/* ---------------- 3. fok: keretek és ferde rúd ---------------- */

function keret() {
  const h = valaszt([3, 4, 5]), L = valaszt([4, 5, 6]);
  const x0 = valaszt([2, 3, 4]);
  const csomopontok = [["A", x0, 1], ["B", x0, 1 + h], ["C", x0 + L, 1 + h], ["D", x0 + L, 1]];
  const rudak = [["1", "A", "B"], ["2", "B", "C"], ["3", "C", "D"]];
  const mod = valaszt(["F", "FH", "q", "qH", "Hoszlop"]);
  const terhek = [];
  if (mod === "F" || mod === "FH") terhek.push({ fajta: "pontTeher", rud: "2", a: fel(1, L - 1), F: F_ERTEK(), szog: -90 });
  if (mod === "q" || mod === "qH") { const q = Q_ERTEK(); terhek.push({ fajta: "megoszlo", rud: "2", a1: 0, a2: L, p1: q, p2: q, szog: -90 }); }
  if (mod === "FH" || mod === "qH") terhek.push({ fajta: "csomopontiEro", csomopont: "B", F: valaszt([5, 6, 8, 10]), szog: 0 });
  if (mod === "Hoszlop") terhek.push({ fajta: "pontTeher", rud: "1", a: fel(1, h - 1), F: F_ERTEK(), szog: 0 }, { fajta: "pontTeher", rud: "2", a: L / 2, F: F_ERTEK(), szog: -90 });
  const tamaszok = Math.random() < 0.7 ? [["A", "csuklo"], ["D", "gorgo", 90]] : [["A", "gorgo", 90], ["D", "csuklo"]];
  return { nev: "egyszerű keret", allapot: allapot({ csomopontok, rudak, tamaszok, terhek }) };
}

function haromcsuklos() {
  const h = valaszt([3, 4]), L = valaszt([4, 6]);
  const x0 = valaszt([2, 3, 4]);
  const csomopontok = [["A", x0, 1], ["B", x0, 1 + h], ["G", x0 + L / 2, 1 + h], ["C", x0 + L, 1 + h], ["D", x0 + L, 1]];
  const rudak = [["1", "A", "B"], ["2", "B", "G"], ["3", "G", "C"], ["4", "C", "D"]];
  const mod = valaszt(["qq", "F", "FH", "qH"]);
  const terhek = [];
  const q = Q_ERTEK();
  if (mod === "qq" || mod === "qH") terhek.push({ fajta: "megoszlo", rud: "2", a1: 0, a2: L / 2, p1: q, p2: q, szog: -90 }, { fajta: "megoszlo", rud: "3", a1: 0, a2: L / 2, p1: q, p2: q, szog: -90 });
  if (mod === "F" || mod === "FH") terhek.push({ fajta: "pontTeher", rud: valaszt(["2", "3"]), a: L / 4, F: F_ERTEK(), szog: -90 });
  if (mod === "FH" || mod === "qH") terhek.push({ fajta: "csomopontiEro", csomopont: "B", F: valaszt([5, 6, 8]), szog: 0 });
  return { nev: "háromcsuklós keret", allapot: allapot({ csomopontok, rudak, csuklok: ["G"], tamaszok: [["A", "csuklo"], ["D", "csuklo"]], terhek }) };
}

function lKonzol() {
  const h = valaszt([3, 4]), L = valaszt([2, 3, 4]);
  const x0 = valaszt([3, 4, 5]);
  const jobbra = Math.random() < 0.6;
  const csomopontok = [["A", x0, 1], ["B", x0, 1 + h], ["C", jobbra ? x0 + L : x0 - L, 1 + h]];
  const rudak = [["1", "A", "B"], ["2", "B", "C"]];
  const mod = valaszt(["F", "q", "FH", "M"]);
  const terhek = [];
  if (mod === "F" || mod === "FH") terhek.push({ fajta: "csomopontiEro", csomopont: "C", F: F_ERTEK(), szog: -90 });
  if (mod === "q") { const q = Q_ERTEK(); terhek.push({ fajta: "megoszlo", rud: "2", a1: 0, a2: L, p1: q, p2: q, szog: -90 }); }
  if (mod === "FH") terhek.push({ fajta: "csomopontiEro", csomopont: "B", F: valaszt([5, 6, 8]), szog: jobbra ? 0 : 180 });
  if (mod === "M") terhek.push({ fajta: "csomopontiNyomatek", csomopont: "C", M: M_ERTEK() * (Math.random() < 0.5 ? 1 : -1) }, { fajta: "csomopontiEro", csomopont: "C", F: F_ERTEK(), szog: -90 });
  return { nev: "L-alakú konzolkeret", allapot: allapot({ csomopontok, rudak, tamaszok: [["A", "befogas"]], terhek }) };
}

function ferde() {
  // 3-4-5 vagy 1:1 lejtés, hogy a hosszak kerekek maradjanak
  const [dx, dy] = valaszt([[4, 3], [8, 6], [4, 4], [6, 4.5]]);
  const x0 = valaszt([1, 2, 3]);
  const fel_ = Math.random() < 0.5;
  const csomopontok = [["A", x0, 1], ["B", x0 + dx, fel_ ? 1 + dy : 1]];
  if (!fel_) csomopontok[0][2] = 1 + dy;
  const Lr = Math.hypot(dx, dy);
  const mod = valaszt(["Fkozep", "Fpont", "q"]);
  const terhek = [];
  if (mod === "Fkozep") terhek.push({ fajta: "pontTeher", rud: "1", a: Lr / 2, F: F_ERTEK(), szog: -90 });
  if (mod === "Fpont") terhek.push({ fajta: "pontTeher", rud: "1", a: valaszt([Lr / 4, (3 * Lr) / 4, Lr / 2]), F: F_ERTEK(), szog: valaszt([-90, -90, 0]) });
  if (mod === "q") { const q = valaszt([2, 4, 6]); terhek.push({ fajta: "megoszlo", rud: "1", a1: 0, a2: Lr, p1: q, p2: q, szog: -90 }); }
  const gorgoB = Math.random() < 0.5;
  return { nev: "ferde gerenda", allapot: allapot({ csomopontok, rudak: [["1", "A", "B"]], tamaszok: gorgoB ? [["A", "csuklo"], ["B", "gorgo", 90]] : [["A", "gorgo", 90], ["B", "csuklo"]], terhek }) };
}

/* ---------------- kiválasztás és ellenőrzés ---------------- */

const FOKOK = {
  1: [kettamaszu, kettamaszu, konzol],
  2: [konzolos, gerber, nyomatekos],
  3: [keret, haromcsuklos, lKonzol, ferde],
};
export const FOK_NEV = { 1: "gerenda", 2: "összetett gerenda", 3: "keret és ferde rúd" };

/** Egy állapot használható-e: határozott, terhelt, ép, nem túl nagy értékek. */
export function hasznalhato(all) {
  if (!all || !all.rudak.length || !vanTeher(all)) return { ok: false };
  let e;
  try { e = elemez(motorModell(all)); } catch { return { ok: false }; }
  if (!e.ok || e.merleg.tipus !== "hatarozott") return { ok: false };
  const f = rajzFeladat(e);
  if (f.maxE.V > 80 || f.maxE.M > 200) return { ok: false };
  return { ok: true, e, f };
}

/** Egy véletlen, ellenőrzött tartó a kért fokon: { nev, allapot, e }. */
export function veletlenTarto(fok = 1) {
  const lista = FOKOK[fok] ?? FOKOK[1];
  let tartalek = null;
  for (let p = 0; p < 120; p++) {
    const gen = valaszt(lista)();
    const h = hasznalhato(gen.allapot);
    if (!h.ok) continue;
    const kerek = h.f.kerekE;
    if (kerek) return { ...gen, e: h.e, fok };
    if (!tartalek) tartalek = { ...gen, e: h.e, fok };
  }
  if (tartalek) return tartalek;
  // biztos tartalék: kéttámaszú tartó, F középen
  const all = allapot({ csomopontok: [["A", 2, 3], ["B", 8, 3]], rudak: [["1", "A", "B"]], tamaszok: [["A", "csuklo"], ["B", "gorgo", 90]], terhek: [{ fajta: "pontTeher", rud: "1", a: 3, F: 12, szog: -90 }] });
  return { nev: "kéttámaszú tartó", allapot: all, e: elemez(motorModell(all)), fok };
}
