import { elemez } from "@/lib/tarto";

/**
 * A 9. modul kidolgozott feladatainak (GYF‑1…GYF‑8) modelljei a számítómag
 * bemeneti alakjában, és a kiszámolt eredmények. Minden számérték a modul
 * szövegében innen származik (a Gyf.js, a filmek és a feladat-ábrák ugyanezt
 * használják). Koordináták: x jobbra, y felfelé; kN, m, kNm.
 */

const COS30 = Math.cos(Math.PI / 6);

export const MODELLEK = {
  /** GYF‑1 · H09/1: befogott konzol, ferde F₁ az x = a-nál, F₂ a szabad végen. a = 2 m, F₁ = 10 kN (30°, jobbra-lefelé), F₂ = 5 kN. */
  gyf1: {
    csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "B", x: 6, y: 0 }],
    rudak: [{ id: "1", a: "A", b: "B" }],
    tamaszok: [{ csomopont: "A", tipus: "befogas" }],
    terhek: [
      { fajta: "pontTeher", rud: "1", a: 2, F: 10, irany: "szog", szog: -30 },
      { fajta: "csomopontiEro", csomopont: "B", Fy: -5 },
    ],
  },
  /** GYF‑2 · kéttámaszú tartó, L = 6 m, F = 12 kN az x = 1 m-nél, p = 4 kN/m a teljes hosszon. */
  gyf2: {
    csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "B", x: 6, y: 0 }],
    rudak: [{ id: "1", a: "A", b: "B" }],
    tamaszok: [{ csomopont: "A", tipus: "csuklo" }, { csomopont: "B", tipus: "gorgo", szog: 90 }],
    terhek: [
      { fajta: "pontTeher", rud: "1", a: 1, F: -12, irany: "y" },
      { fajta: "megoszlo", rud: "1", p1: -4, irany: "y" },
    ],
  },
  /** GYF‑3 · H09/3: konzolos kéttámaszú tartó, a = 1,5 m, F₁ = 12 kN (30°, balra-lefelé) a bal végen, F₂ = 8 kN a jobb végen. */
  gyf3: {
    csomopontok: [{ id: "C", x: 0, y: 0 }, { id: "A", x: 1.5, y: 0 }, { id: "B", x: 4.5, y: 0 }, { id: "D", x: 6, y: 0 }],
    rudak: [{ id: "1", a: "C", b: "A" }, { id: "2", a: "A", b: "B" }, { id: "3", a: "B", b: "D" }],
    tamaszok: [{ csomopont: "A", tipus: "csuklo" }, { csomopont: "B", tipus: "gorgo", szog: 90 }],
    terhek: [
      { fajta: "csomopontiEro", csomopont: "C", Fx: -12 * COS30, Fy: -6 },
      { fajta: "csomopontiEro", csomopont: "D", Fy: -8 },
    ],
  },
  /** GYF‑4 · H09/4: p = 4 kN/m a 0…2a szakaszon, A az x = a, B az x = 3a helyen, M = 8 kNm ↷ a jobb végen; a = 2 m. */
  gyf4: {
    csomopontok: [{ id: "C", x: 0, y: 0 }, { id: "A", x: 2, y: 0 }, { id: "B", x: 6, y: 0 }, { id: "D", x: 8, y: 0 }],
    rudak: [{ id: "1", a: "C", b: "A" }, { id: "2", a: "A", b: "B" }, { id: "3", a: "B", b: "D" }],
    tamaszok: [{ csomopont: "A", tipus: "csuklo" }, { csomopont: "B", tipus: "gorgo", szog: 90 }],
    terhek: [
      { fajta: "megoszlo", rud: "1", p1: -4, irany: "y" },
      { fajta: "megoszlo", rud: "2", a1: 0, a2: 2, p1: -4, irany: "y" },
      { fajta: "csomopontiNyomatek", csomopont: "D", M: -8 },
    ],
  },
  /** GYF‑5 · ferde tengelyű kéttámaszú tartó: A csukló (0;0), B görgő (4;3), p = 4 kN/m függőleges, a ferde hossz méterére. */
  gyf5: {
    csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "B", x: 4, y: 3 }],
    rudak: [{ id: "1", a: "A", b: "B" }],
    tamaszok: [{ csomopont: "A", tipus: "csuklo" }, { csomopont: "B", tipus: "gorgo", szog: 90 }],
    terhek: [{ fajta: "megoszlo", rud: "1", p1: -4, irany: "y" }],
  },
  /** GYF‑6 · vizsgaminta 2. feladat: L alakú konzol, A befogás alul, oszlop 4 m, kar 3 m, p = 3 kN/m felfelé a karon. */
  gyf6: {
    csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "C", x: 0, y: 4 }, { id: "D", x: 3, y: 4 }],
    rudak: [{ id: "1", a: "A", b: "C" }, { id: "2", a: "C", b: "D" }],
    tamaszok: [{ csomopont: "A", tipus: "befogas" }],
    terhek: [{ fajta: "megoszlo", rud: "2", p1: 3, irany: "y" }],
  },
  /** GYF‑7 · tankönyv 8.7. ábra: Gerber-tartó, p = 6 kN/m, A csukló x = 3, G belső csukló x = 7, B görgő x = 11, C görgő x = 16 m. */
  gyf7: {
    csomopontok: [{ id: "E", x: 0, y: 0 }, { id: "A", x: 3, y: 0 }, { id: "G", x: 7, y: 0 }, { id: "B", x: 11, y: 0 }, { id: "C", x: 16, y: 0 }],
    rudak: [{ id: "1", a: "E", b: "A" }, { id: "2", a: "A", b: "G" }, { id: "3", a: "G", b: "B", csukloA: true }, { id: "4", a: "B", b: "C" }],
    tamaszok: [{ csomopont: "A", tipus: "csuklo" }, { csomopont: "B", tipus: "gorgo", szog: 90 }, { csomopont: "C", tipus: "gorgo", szog: 90 }],
    terhek: ["1", "2", "3", "4"].map((r) => ({ fajta: "megoszlo", rud: r, p1: -6, irany: "y" })),
  },
  /** GYF‑8 · vizsgaminta 4. feladat: háromcsuklós tartó, A(0;0), C(5;2), B(10;0); 2 kN/m a bal, 4 kN/m a jobb félen (a vetületre). */
  gyf8: {
    csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "C", x: 5, y: 2 }, { id: "B", x: 10, y: 0 }],
    rudak: [{ id: "1", a: "A", b: "C", csukloB: true }, { id: "2", a: "C", b: "B" }],
    tamaszok: [{ csomopont: "A", tipus: "csuklo" }, { csomopont: "B", tipus: "csuklo" }],
    terhek: [
      { fajta: "megoszlo", rud: "1", p1: -2, irany: "y", vetuletre: true },
      { fajta: "megoszlo", rud: "2", p1: -4, irany: "y", vetuletre: true },
    ],
  },
  /** Tankönyv 8.4.a ábra: kéttámaszú tartó, L = 6 m, F = 24 kN az x = 4,5 m-nél (reakciók 6 és 18 kN). */
  tk84a: {
    csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "B", x: 6, y: 0 }],
    rudak: [{ id: "1", a: "A", b: "B" }],
    tamaszok: [{ csomopont: "A", tipus: "csuklo" }, { csomopont: "B", tipus: "gorgo", szog: 90 }],
    terhek: [{ fajta: "pontTeher", rud: "1", a: 4.5, F: -24, irany: "y" }],
  },
  /** Tankönyv 8.5.a ábra: ferde konzol (tg α = 3/4), a szabad végen 2 kN → és 5 kN ↑. */
  tk85a: {
    csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "T", x: 6, y: 4.5 }],
    rudak: [{ id: "1", a: "A", b: "T" }],
    tamaszok: [{ csomopont: "A", tipus: "befogas" }],
    terhek: [
      { fajta: "pontTeher", rud: "1", a: 7.5, F: 2, irany: "x" },
      { fajta: "pontTeher", rud: "1", a: 7.5, F: 5, irany: "y" },
    ],
  },
  /** Tankönyv 8.8. ábra: konzol, a szabad végen α = 30°-os, jobbra-lefelé mutató F = 10 kN; l = 4 m. */
  tk88: {
    csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "B", x: 4, y: 0 }],
    rudak: [{ id: "1", a: "A", b: "B" }],
    tamaszok: [{ csomopont: "A", tipus: "befogas" }],
    terhek: [{ fajta: "csomopontiEro", csomopont: "B", Fx: 10 * COS30, Fy: -5 }],
  },
};

const tar = new Map();
/** A kiszámolt eredmény (memoizálva). */
export function eredmeny(kulcs) {
  if (!tar.has(kulcs)) tar.set(kulcs, elemez(MODELLEK[kulcs]));
  return tar.get(kulcs);
}
