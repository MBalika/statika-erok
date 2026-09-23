/**
 * Kész tartók a Tartóépítőhöz (a szerkesztő állapotának alakjában, lásd modell.js).
 * Betöltés után szabadon szerkeszthetők. Mindegyik statikailag határozott és terhelt
 * (a teszt ellenőrzi).
 */

function allapot({ csomopontok, rudak, csuklok = [], tamaszok, terhek }) {
  return {
    csomopontok: csomopontok.map(([id, x, y]) => ({ id, x, y })),
    rudak: rudak.map(([id, a, b]) => ({ id, a, b })),
    csuklok: [...csuklok],
    tamaszok: tamaszok.map(([csomopont, tipus, szog]) => (tipus === "gorgo" ? { csomopont, tipus, szog: szog ?? 90 } : { csomopont, tipus })),
    terhek: terhek.map((t, i) => ({ id: `t${i + 1}`, ...t })),
  };
}

export const SABLONOK = [
  {
    id: "kettamaszu",
    nev: "Kéttámaszú tartó",
    rovid: "F középen",
    leiras: "Csukló + görgő, egy koncentrált erő a fesztáv közepén: a V két vízszintes szakasz, az M háromszög.",
    allapot: allapot({
      csomopontok: [["A", 2, 3], ["B", 8, 3]],
      rudak: [["1", "A", "B"]],
      tamaszok: [["A", "csuklo"], ["B", "gorgo", 90]],
      terhek: [{ fajta: "pontTeher", rud: "1", a: 3, F: 12, szog: -90 }],
    }),
  },
  {
    id: "konzol",
    nev: "Konzol",
    rovid: "q a teljes hosszon",
    leiras: "Befogott konzol egyenletesen megoszló teherrel: a V egyenes, az M parabola, a befogásnál a legnagyobb.",
    allapot: allapot({
      csomopontok: [["A", 2, 3], ["B", 6, 3]],
      rudak: [["1", "A", "B"]],
      tamaszok: [["A", "befogas"]],
      terhek: [{ fajta: "megoszlo", rud: "1", a1: 0, a2: 4, p1: 4, p2: 4, szog: -90 }],
    }),
  },
  {
    id: "konzolos",
    nev: "Konzolos kéttámaszú",
    rovid: "F + q",
    leiras: "Két támasz és egy kinyúló konzol: a megoszló teher alatt parabola, a konzolon negatív (felül húzott) nyomaték.",
    allapot: allapot({
      csomopontok: [["A", 2, 3], ["B", 8, 3], ["C", 10, 3]],
      rudak: [["1", "A", "B"], ["2", "B", "C"]],
      tamaszok: [["A", "csuklo"], ["B", "gorgo", 90]],
      terhek: [
        { fajta: "megoszlo", rud: "1", a1: 0, a2: 6, p1: 4, p2: 4, szog: -90 },
        { fajta: "csomopontiEro", csomopont: "C", F: 8, szog: -90 },
      ],
    }),
  },
  {
    id: "gerber",
    nev: "Gerber-tartó",
    rovid: "két mező, egy csukló",
    leiras: "Csukló, görgő, belső csukló (G), görgő: a befüggesztett rész egyszerű kéttámaszú tartó, a csuklóban M = 0.",
    allapot: allapot({
      csomopontok: [["A", 1, 3], ["B", 6, 3], ["G", 8, 3], ["C", 11, 3]],
      rudak: [["1", "A", "B"], ["2", "B", "G"], ["3", "G", "C"]],
      csuklok: ["G"],
      tamaszok: [["A", "csuklo"], ["B", "gorgo", 90], ["C", "gorgo", 90]],
      terhek: [
        { fajta: "pontTeher", rud: "3", a: 1.5, F: 10, szog: -90 },
        { fajta: "megoszlo", rud: "1", a1: 0, a2: 5, p1: 2, p2: 2, szog: -90 },
      ],
    }),
  },
  {
    id: "nyomatekos",
    nev: "Koncentrált nyomaték",
    rovid: "M₀ a gerendán",
    leiras: "Kéttámaszú tartó egy koncentrált nyomatékkal: a reakciók erőpárt alkotnak, a V állandó, az M a nyomaték helyén M₀-lal ugrik.",
    allapot: allapot({
      csomopontok: [["A", 2, 3], ["B", 8, 3]],
      rudak: [["1", "A", "B"]],
      tamaszok: [["A", "csuklo"], ["B", "gorgo", 90]],
      terhek: [{ fajta: "pontNyomatek", rud: "1", a: 2, M: 12 }],
    }),
  },
  {
    id: "ferde",
    nev: "Ferde gerenda",
    rovid: "3-4-5 lejtésű",
    leiras: "Ferde tartó függőleges erővel: a reakció a rúd mentén N-re és V-re bomlik, az ábrákat a rúdra merőlegesen rajzoljuk.",
    allapot: allapot({
      csomopontok: [["A", 2, 1], ["B", 6, 4]],
      rudak: [["1", "A", "B"]],
      tamaszok: [["A", "csuklo"], ["B", "gorgo", 90]],
      terhek: [{ fajta: "pontTeher", rud: "1", a: 2.5, F: 10, szog: -90 }],
    }),
  },
  {
    id: "keret",
    nev: "Egyszerű keret",
    rovid: "csukló + görgő",
    leiras: "Két oszlop és egy gerenda, csukló–görgő megtámasztás: a sarkokban a nyomaték átfordul az oszlopra, a vízszintes erő az oszlopot hajlítja.",
    allapot: allapot({
      csomopontok: [["A", 3, 1], ["B", 3, 5], ["C", 9, 5], ["D", 9, 1]],
      rudak: [["1", "A", "B"], ["2", "B", "C"], ["3", "C", "D"]],
      tamaszok: [["A", "csuklo"], ["D", "gorgo", 90]],
      terhek: [
        { fajta: "pontTeher", rud: "2", a: 3, F: 12, szog: -90 },
        { fajta: "csomopontiEro", csomopont: "B", F: 6, szog: 0 },
      ],
    }),
  },
  {
    id: "haromcsuklos",
    nev: "Háromcsuklós keret",
    rovid: "csukló a gerinc közepén",
    leiras: "Két csuklós támasz és egy belső csukló a gerenda közepén: a vízszintes reakciót a csuklóra írt nyomatéki egyenlet adja, a csuklóban M = 0.",
    allapot: allapot({
      csomopontok: [["A", 3, 1], ["B", 3, 5], ["G", 6, 5], ["C", 9, 5], ["D", 9, 1]],
      rudak: [["1", "A", "B"], ["2", "B", "G"], ["3", "G", "C"], ["4", "C", "D"]],
      csuklok: ["G"],
      tamaszok: [["A", "csuklo"], ["D", "csuklo"]],
      terhek: [
        { fajta: "megoszlo", rud: "2", a1: 0, a2: 3, p1: 4, p2: 4, szog: -90 },
        { fajta: "megoszlo", rud: "3", a1: 0, a2: 3, p1: 4, p2: 4, szog: -90 },
      ],
    }),
  },
  {
    id: "lkonzol",
    nev: "L-alakú konzolkeret",
    rovid: "befogott oszlop",
    leiras: "Befogott oszlop és egy kinyúló gerenda, a végén erővel: a gerenda nyomatéka a sarokban változatlanul átmegy az oszlopra, az oszlopban N is ébred.",
    allapot: allapot({
      csomopontok: [["A", 3, 1], ["B", 3, 5], ["C", 7, 5]],
      rudak: [["1", "A", "B"], ["2", "B", "C"]],
      tamaszok: [["A", "befogas"]],
      terhek: [{ fajta: "csomopontiEro", csomopont: "C", F: 8, szog: -90 }],
    }),
  },
];

export function sablon(id) {
  return SABLONOK.find((s) => s.id === id) ?? null;
}
