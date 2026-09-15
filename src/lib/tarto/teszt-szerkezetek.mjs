import { elemez, ertekek } from "./index.js";
let jo = 0, rossz = 0; const hibak = [];
function kozel(nev, kapott, vart, tures = 1e-6) {
  const t = Math.max(tures, Math.abs(vart) * tures);
  if (Math.abs(kapott - vart) <= t) jo++; else { rossz++; hibak.push(`${nev}: kapott ${kapott?.toPrecision?.(8)}, várt ${vart.toPrecision(8)}`); }
}
function igaz(nev, felt) { if (felt) jo++; else { rossz++; hibak.push(`${nev}: hamis`); } }

/* ---- 17. Háromcsuklós tartó (szimmetrikus, csúcson koncentrált erő) ---- */
{
  // A(0,0) csukló – C(4,3) csúcs belső csuklóval – B(8,0) csukló, C-ben 20 kN lefelé
  const P = 20;
  const e = elemez({
    csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "C", x: 4, y: 3 }, { id: "B", x: 8, y: 0 }],
    rudak: [
      { id: "1", a: "A", b: "C" },
      { id: "2", a: "C", b: "B", csukloA: true },
    ],
    tamaszok: [{ csomopont: "A", tipus: "csuklo" }, { csomopont: "B", tipus: "csuklo" }],
    terhek: [{ fajta: "csomopontiEro", csomopont: "C", Fy: -P }],
  });
  igaz("17. határozott", e.merleg.tipus === "hatarozott");
  kozel("17. A_y", e.reakciok[0].Fy, P / 2);
  kozel("17. B_y", e.reakciok[1].Fy, P / 2);
  // vízszintes csuklóerő: ΣM_C a bal félre: A_y·4 − A_x·3 = 0 → A_x = 4·10/3
  kozel("17. A_x (vízszintes tolóerő)", e.reakciok[0].Fx, (P / 2) * 4 / 3);
  kozel("17. M a csúcsban", ertekek(e.igenybevetelek[1], 0).M, 0, 1e-8);
  igaz("17. egyensúly", e.ellenorzes.rendben);
}

/* ---- 18. Mechanizmus: három párhuzamos görgő ---- */
{
  const e = elemez({
    csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "B", x: 3, y: 0 }, { id: "C", x: 6, y: 0 }],
    rudak: [{ id: "1", a: "A", b: "B" }, { id: "2", a: "B", b: "C" }],
    tamaszok: [
      { csomopont: "A", tipus: "gorgo", szog: 90 },
      { csomopont: "B", tipus: "gorgo", szog: 90 },
      { csomopont: "C", tipus: "gorgo", szog: 90 },
    ],
    terhek: [{ fajta: "csomopontiEro", csomopont: "B", Fx: 5, Fy: -10 }],
  });
  igaz("18. a három párhuzamos görgőt elutasítja", e.ok === false && e.hibak.length > 0);
}

/* ---- 19. Kritikus elrendezés: három, egy ponton átmenő hatásvonalú rúd ---- */
{
  // három rúd, mindegyik hatásvonala az origón megy át → a szerkezet elfordulhat
  const e = elemez({
    csomopontok: [{ id: "A", x: -3, y: 4 }, { id: "B", x: 3, y: 4 }, { id: "C", x: 0, y: 6 }],
    rudak: [{ id: "1", a: "A", b: "B" }, { id: "2", a: "B", b: "C" }, { id: "3", a: "C", b: "A" }],
    tamaszok: [
      { csomopont: "A", tipus: "rud", irany: [3, -4] },   // az origó felé
      { csomopont: "B", tipus: "rud", irany: [-3, -4] },  // az origó felé
      { csomopont: "C", tipus: "rud", irany: [0, -6] },   // az origó felé
    ],
    terhek: [{ fajta: "csomopontiEro", csomopont: "C", Fx: 8 }],
  });
  igaz("19. az egy ponton átmenő hatásvonalakat elutasítja", e.ok === false);
}

/* ---- 20. GYF‑3 (5. modul): rúddal és csuklóval megtámasztott gerenda ---- */
{
  // gerenda 0..4,8 (a = 1,2); B csukló a jobb végén; rúd az A(0;−1,2) talajcsuklóból
  // a gerenda x = 2,4 pontjához; p₁ = 5 kN/m a 0..2,4 szakaszon
  const a = 1.2, p1 = 5;
  const e = elemez({
    csomopontok: [
      { id: "V", x: 0, y: 0 }, { id: "C", x: 2 * a, y: 0 }, { id: "B", x: 4 * a, y: 0 },
    ],
    rudak: [{ id: "1", a: "V", b: "C" }, { id: "2", a: "C", b: "B" }],
    tamaszok: [
      { csomopont: "B", tipus: "csuklo" },
      { csomopont: "C", tipus: "rud", irany: [-2 * a, -a] }, // C-ből az A talajcsukló felé
    ],
    terhek: [{ fajta: "megoszlo", rud: "1", p1: -p1, irany: "y" }],
  });
  igaz("20. megoldható", e.ok);
  const S = e.reakciok.find((r) => r.tipus === "rud").S;
  kozel("20. GYF‑3 rúderő", S, -40.2492, 1e-3);
  igaz("20. a rúd nyomott", S < 0);
  const B = e.reakciok.find((r) => r.tipus === "csuklo");
  kozel("20. GYF‑3 B_x", B.Fx, -36, 1e-3);
  kozel("20. GYF‑3 B_y", B.Fy, -6, 1e-3);
}

/* ---- 21. GYF‑5 (5. modul): keret ferde görgővel ---- */
{
  // A(0,0) csukló; oszlop A→D(0,3); gerenda D→E(4,5;3); oszlop E→B(4,5;1,5)
  // B-ben görgő, a gördülési sík 30°-os → a reakció a függőlegessel 30°
  // M = 12 kNm óramutató szerint a gerendán x = 1,5-nél
  const a = 1.5, Mo = 12, alfa = 30;
  const e = elemez({
    csomopontok: [
      { id: "A", x: 0, y: 0 }, { id: "D", x: 0, y: 2 * a },
      { id: "E", x: 3 * a, y: 2 * a }, { id: "B", x: 3 * a, y: a },
    ],
    rudak: [{ id: "o1", a: "A", b: "D" }, { id: "g", a: "D", b: "E" }, { id: "o2", a: "E", b: "B" }],
    tamaszok: [
      { csomopont: "A", tipus: "csuklo" },
      // a gördülési sík a vízszintessel 30°: a reakció erre merőleges
      { csomopont: "B", tipus: "gorgo", szog: 90 + alfa },
    ],
    terhek: [{ fajta: "pontNyomatek", rud: "g", a: a, M: -Mo }],
  });
  igaz("21. megoldható", e.ok);
  const B = e.reakciok[1];
  kozel("21. GYF‑5 |B|", Math.abs(B.nagysag), 2.582, 1e-3);
  kozel("21. GYF‑5 A_y", e.reakciok[0].Fy, -2.236, 1e-3);
  kozel("21. GYF‑5 A_x", e.reakciok[0].Fx, 1.291, 1e-3);
  igaz("21. egyensúly", e.ellenorzes.rendben);
}

/* ---- 22. Differenciális összefüggések: dM/dx = V ---- */
{
  const e = elemez({
    csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "B", x: 7, y: 0 }],
    rudak: [{ id: "1", a: "A", b: "B" }],
    tamaszok: [{ csomopont: "A", tipus: "csuklo" }, { csomopont: "B", tipus: "gorgo" }],
    terhek: [
      { fajta: "megoszlo", rud: "1", a1: 1, a2: 5, p1: -3, p2: -8, irany: "y" },
      { fajta: "pontTeher", rud: "1", a: 6, F: -12, irany: "y" },
    ],
  });
  const ig = e.igenybevetelek[0];
  let max = 0;
  for (let x = 0.05; x < 7; x += 0.05) {
    const h = 1e-5;
    const dM = (ertekek(ig, x + h).M - ertekek(ig, x - h).M) / (2 * h);
    const V = ertekek(ig, x).V;
    if (Math.abs(x - 1) < 0.02 || Math.abs(x - 5) < 0.02 || Math.abs(x - 6) < 0.02) continue;
    max = Math.max(max, Math.abs(dM - V));
  }
  igaz(`22. dM/dx = V mindenütt (max eltérés ${max.toExponential(2)})`, max < 1e-4);
  igaz("22. egyensúly", e.ellenorzes.rendben);
}

console.log(`\n${jo} rendben, ${rossz} hibás`);
if (hibak.length) { console.log("\nHIBÁK:"); hibak.forEach((h) => console.log("  ✗ " + h)); process.exit(1); }
