/**
 * Paraméteres szerkezet-sablonok a kalkulátorhoz.
 * Mindegyik egy `keszit(p)` függvényt ad, ami a paraméterekből modellt épít.
 */

export const SABLONOK = [
  {
    id: "kettamaszu",
    nev: "Kéttámaszú tartó",
    leiras: "Csukló és görgő, egy koncentrált erő és egy egyenletes teher.",
    parameterek: [
      { id: "L", nev: "Fesztáv, L", egyseg: "m", min: 2, max: 14, lepes: 0.5, ertek: 8 },
      { id: "F", nev: "Koncentrált erő, F", egyseg: "kN", min: 0, max: 60, lepes: 1, ertek: 20 },
      { id: "a", nev: "az F helye, a", egyseg: "m", min: 0, max: 14, lepes: 0.25, ertek: 3 },
      { id: "p", nev: "Megoszló teher, p", egyseg: "kN/m", min: 0, max: 30, lepes: 0.5, ertek: 5 },
    ],
    keszit: (p) => ({
      csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "B", x: p.L, y: 0 }],
      rudak: [{ id: "1", a: "A", b: "B" }],
      tamaszok: [{ csomopont: "A", tipus: "csuklo" }, { csomopont: "B", tipus: "gorgo", szog: 90 }],
      terhek: [
        ...(p.F ? [{ fajta: "pontTeher", rud: "1", a: Math.min(p.a, p.L), F: -p.F, irany: "y" }] : []),
        ...(p.p ? [{ fajta: "megoszlo", rud: "1", p1: -p.p, irany: "y" }] : []),
      ],
    }),
  },
  {
    id: "konzol",
    nev: "Befogott konzol",
    leiras: "Bal végén merev befogás, a szabad végén erő, a hosszon megoszló teher.",
    parameterek: [
      { id: "L", nev: "Hossz, L", egyseg: "m", min: 1, max: 10, lepes: 0.5, ertek: 4 },
      { id: "F", nev: "Erő a végén, F", egyseg: "kN", min: 0, max: 60, lepes: 1, ertek: 10 },
      { id: "p", nev: "Megoszló teher, p", egyseg: "kN/m", min: 0, max: 30, lepes: 0.5, ertek: 4 },
      { id: "M", nev: "Koncentrált nyomaték a végén", egyseg: "kNm", min: -60, max: 60, lepes: 2, ertek: 0 },
    ],
    keszit: (p) => ({
      csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "B", x: p.L, y: 0 }],
      rudak: [{ id: "1", a: "A", b: "B" }],
      tamaszok: [{ csomopont: "A", tipus: "befogas" }],
      terhek: [
        ...(p.F ? [{ fajta: "csomopontiEro", csomopont: "B", Fy: -p.F }] : []),
        ...(p.p ? [{ fajta: "megoszlo", rud: "1", p1: -p.p, irany: "y" }] : []),
        ...(p.M ? [{ fajta: "csomopontiNyomatek", csomopont: "B", M: p.M }] : []),
      ],
    }),
  },
  {
    id: "konzolos",
    nev: "Konzolos kéttámaszú tartó",
    leiras: "Két támasz között kinyúló konzolokkal — itt derül ki, mikor emelkedik fel a görgő.",
    parameterek: [
      { id: "k1", nev: "Bal konzol", egyseg: "m", min: 0, max: 5, lepes: 0.5, ertek: 1.5 },
      { id: "L", nev: "Támaszköz, L", egyseg: "m", min: 2, max: 12, lepes: 0.5, ertek: 6 },
      { id: "k2", nev: "Jobb konzol", egyseg: "m", min: 0, max: 5, lepes: 0.5, ertek: 2 },
      { id: "p", nev: "Egyenletes teher, p", egyseg: "kN/m", min: 0, max: 30, lepes: 0.5, ertek: 6 },
      { id: "F", nev: "Erő a jobb konzol végén", egyseg: "kN", min: 0, max: 60, lepes: 1, ertek: 10 },
    ],
    keszit: (p) => ({
      csomopontok: [
        { id: "V", x: 0, y: 0 }, { id: "A", x: p.k1, y: 0 },
        { id: "B", x: p.k1 + p.L, y: 0 }, { id: "C", x: p.k1 + p.L + p.k2, y: 0 },
      ],
      rudak: [
        ...(p.k1 > 0 ? [{ id: "b", a: "V", b: "A" }] : []),
        { id: "k", a: p.k1 > 0 ? "A" : "V", b: "B" },
        ...(p.k2 > 0 ? [{ id: "j", a: "B", b: "C" }] : []),
      ],
      tamaszok: [
        { csomopont: p.k1 > 0 ? "A" : "V", tipus: "csuklo" },
        { csomopont: "B", tipus: "gorgo", szog: 90 },
      ],
      terhek: [
        ...(p.k1 > 0 && p.p ? [{ fajta: "megoszlo", rud: "b", p1: -p.p, irany: "y" }] : []),
        ...(p.p ? [{ fajta: "megoszlo", rud: "k", p1: -p.p, irany: "y" }] : []),
        ...(p.k2 > 0 && p.p ? [{ fajta: "megoszlo", rud: "j", p1: -p.p, irany: "y" }] : []),
        ...(p.F ? [{ fajta: "csomopontiEro", csomopont: p.k2 > 0 ? "C" : "B", Fy: -p.F }] : []),
      ],
    }),
  },
  {
    id: "gerber",
    nev: "Gerber-tartó",
    leiras: "Befogás, belső csukló, görgő — a csuklóban a nyomaték nulla.",
    parameterek: [
      { id: "L1", nev: "Első szakasz", egyseg: "m", min: 2, max: 10, lepes: 0.5, ertek: 6 },
      { id: "L2", nev: "Második szakasz", egyseg: "m", min: 2, max: 10, lepes: 0.5, ertek: 4 },
      { id: "p", nev: "Egyenletes teher, p", egyseg: "kN/m", min: 0, max: 30, lepes: 0.5, ertek: 5 },
    ],
    keszit: (p) => ({
      csomopontok: [
        { id: "A", x: 0, y: 0 }, { id: "C", x: p.L1, y: 0 }, { id: "B", x: p.L1 + p.L2, y: 0 },
      ],
      rudak: [{ id: "1", a: "A", b: "C" }, { id: "2", a: "C", b: "B", csukloA: true }],
      tamaszok: [{ csomopont: "A", tipus: "befogas" }, { csomopont: "B", tipus: "gorgo", szog: 90 }],
      terhek: [
        { fajta: "megoszlo", rud: "1", p1: -p.p, irany: "y" },
        { fajta: "megoszlo", rud: "2", p1: -p.p, irany: "y" },
      ],
    }),
  },
  {
    id: "keret",
    nev: "Keret (tört tengelyű tartó)",
    leiras: "Befogott oszlop és vízszintes gerenda — a sarokban a nyomaték átfordul.",
    parameterek: [
      { id: "h", nev: "Oszlopmagasság, h", egyseg: "m", min: 1, max: 8, lepes: 0.5, ertek: 3 },
      { id: "L", nev: "Gerendahossz, L", egyseg: "m", min: 1, max: 10, lepes: 0.5, ertek: 4 },
      { id: "p", nev: "Teher a gerendán, p", egyseg: "kN/m", min: 0, max: 30, lepes: 0.5, ertek: 6 },
      { id: "H", nev: "Vízszintes erő az oszlop tetején", egyseg: "kN", min: -40, max: 40, lepes: 1, ertek: 8 },
    ],
    keszit: (p) => ({
      csomopontok: [
        { id: "A", x: 0, y: 0 }, { id: "C", x: 0, y: p.h }, { id: "D", x: p.L, y: p.h },
      ],
      rudak: [{ id: "o", a: "A", b: "C" }, { id: "g", a: "C", b: "D" }],
      tamaszok: [{ csomopont: "A", tipus: "befogas" }],
      terhek: [
        ...(p.p ? [{ fajta: "megoszlo", rud: "g", p1: -p.p, irany: "y" }] : []),
        ...(p.H ? [{ fajta: "csomopontiEro", csomopont: "C", Fx: p.H }] : []),
      ],
    }),
  },
  {
    id: "haromcsuklos",
    nev: "Háromcsuklós tartó",
    leiras: "Két csukló a támaszokban, egy a csúcson — a vízszintes tolóerő itt jelenik meg.",
    parameterek: [
      { id: "L", nev: "Fesztáv, L", egyseg: "m", min: 4, max: 16, lepes: 0.5, ertek: 8 },
      { id: "h", nev: "Csúcsmagasság, h", egyseg: "m", min: 1, max: 8, lepes: 0.5, ertek: 3 },
      { id: "F", nev: "Erő a csúcson, F", egyseg: "kN", min: 0, max: 60, lepes: 1, ertek: 20 },
      { id: "p", nev: "Teher a bal szárra, p", egyseg: "kN/m", min: 0, max: 20, lepes: 0.5, ertek: 0 },
    ],
    keszit: (p) => ({
      csomopontok: [
        { id: "A", x: 0, y: 0 }, { id: "C", x: p.L / 2, y: p.h }, { id: "B", x: p.L, y: 0 },
      ],
      rudak: [{ id: "1", a: "A", b: "C" }, { id: "2", a: "C", b: "B", csukloA: true }],
      tamaszok: [{ csomopont: "A", tipus: "csuklo" }, { csomopont: "B", tipus: "csuklo" }],
      terhek: [
        ...(p.F ? [{ fajta: "csomopontiEro", csomopont: "C", Fy: -p.F }] : []),
        ...(p.p ? [{ fajta: "megoszlo", rud: "1", p1: -p.p, irany: "y", vetuletre: true }] : []),
      ],
    }),
  },
  {
    id: "ketvegenbefogott",
    nev: "Kétoldalt befogott tartó",
    leiras: "Statikailag határozatlan — itt már a merevség (EI) is számít.",
    parameterek: [
      { id: "L", nev: "Fesztáv, L", egyseg: "m", min: 2, max: 14, lepes: 0.5, ertek: 6 },
      { id: "p", nev: "Egyenletes teher, p", egyseg: "kN/m", min: 0, max: 30, lepes: 0.5, ertek: 8 },
      { id: "F", nev: "Erő a közepén, F", egyseg: "kN", min: 0, max: 60, lepes: 1, ertek: 0 },
    ],
    keszit: (p) => ({
      csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "B", x: p.L, y: 0 }],
      rudak: [{ id: "1", a: "A", b: "B", EI: 1e4, EA: 1e6 }],
      tamaszok: [{ csomopont: "A", tipus: "befogas" }, { csomopont: "B", tipus: "befogas" }],
      terhek: [
        ...(p.p ? [{ fajta: "megoszlo", rud: "1", p1: -p.p, irany: "y" }] : []),
        ...(p.F ? [{ fajta: "pontTeher", rud: "1", a: p.L / 2, F: -p.F, irany: "y" }] : []),
      ],
    }),
  },
];

export function alapParameterek(sablon) {
  const p = {};
  for (const par of sablon.parameterek) p[par.id] = par.ertek;
  return p;
}
