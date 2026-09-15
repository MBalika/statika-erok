import { elemez, ertekek } from "./index.js";

let jo = 0, rossz = 0;
const hibak = [];
function kozel(nev, kapott, vart, tures = 1e-6) {
  const t = Math.max(tures, Math.abs(vart) * tures);
  if (Math.abs(kapott - vart) <= t) { jo++; }
  else { rossz++; hibak.push(`${nev}: kapott ${kapott.toPrecision(8)}, várt ${vart.toPrecision(8)}`); }
}
function igaz(nev, felt) { if (felt) jo++; else { rossz++; hibak.push(`${nev}: hamis`); } }

const M = (x) => x; // olvashatóság

/* ============ 1. Kéttámaszú tartó, középen koncentrált erő ============ */
{
  const L = 6, P = 10;
  const e = elemez({
    csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "B", x: L, y: 0 }],
    rudak: [{ id: "1", a: "A", b: "B" }],
    tamaszok: [{ csomopont: "A", tipus: "csuklo" }, { csomopont: "B", tipus: "gorgo", szog: 90 }],
    terhek: [{ fajta: "pontTeher", rud: "1", a: L / 2, F: -P, irany: "y" }],
  });
  igaz("1. megoldható", e.ok);
  igaz("1. egyensúly", e.ellenorzes.rendben);
  kozel("1. A_y", e.reakciok[0].Fy, P / 2);
  kozel("1. B", e.reakciok[1].Fy, P / 2);
  const ig = e.igenybevetelek[0];
  kozel("1. M_max = PL/4", ig.szelso.M.max, (P * L) / 4);
  kozel("1. V(0+)", ertekek(ig, 0.01).V, P / 2, 1e-4);
  kozel("1. V(L−)", ertekek(ig, L - 0.01).V, -P / 2, 1e-4);
  kozel("1. M(L)", ertekek(ig, L).M, 0, 1e-9);
  igaz("1. határozott", e.merleg.tipus === "hatarozott");
}

/* ============ 2. Kéttámaszú tartó, egyenletes teher ============ */
{
  const L = 8, w = 5;
  const e = elemez({
    csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "B", x: L, y: 0 }],
    rudak: [{ id: "1", a: "A", b: "B" }],
    tamaszok: [{ csomopont: "A", tipus: "csuklo" }, { csomopont: "B", tipus: "gorgo" }],
    terhek: [{ fajta: "megoszlo", rud: "1", p1: -w, irany: "y" }],
  });
  kozel("2. A_y = wL/2", e.reakciok[0].Fy, (w * L) / 2);
  const ig = e.igenybevetelek[0];
  kozel("2. M_max = wL²/8", ig.szelso.M.max, (w * L * L) / 8);
  kozel("2. M_max helye", ig.szelso.M.maxX, L / 2, 1e-6);
  kozel("2. V(0)", ertekek(ig, 0).V, (w * L) / 2);
  kozel("2. M(L/4) = 3wL²/32", ertekek(ig, L / 4).M, (3 * w * L * L) / 32);
  igaz("2. M_max V=0 helyen", Math.abs(ig.MszelsoHelyek[0].x - L / 2) < 1e-6);
}

/* ============ 3. Befogott konzol, végén koncentrált erő ============ */
{
  const L = 4, P = 12;
  const e = elemez({
    csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "B", x: L, y: 0 }],
    rudak: [{ id: "1", a: "A", b: "B" }],
    tamaszok: [{ csomopont: "A", tipus: "befogas" }],
    terhek: [{ fajta: "csomopontiEro", csomopont: "B", Fx: 0, Fy: -P }],
  });
  kozel("3. A_y", e.reakciok[0].Fy, P);
  kozel("3. M_A = P·L", e.reakciok[0].M, P * L);
  const ig = e.igenybevetelek[0];
  kozel("3. M(0) = −PL", ertekek(ig, 0).M, -P * L);
  kozel("3. M(L) = 0", ertekek(ig, L).M, 0, 1e-8);
  kozel("3. V", ertekek(ig, L / 2).V, P);
}

/* ============ 4. Befogott konzol, egyenletes teher ============ */
{
  const L = 3, w = 6;
  const e = elemez({
    csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "B", x: L, y: 0 }],
    rudak: [{ id: "1", a: "A", b: "B" }],
    tamaszok: [{ csomopont: "A", tipus: "befogas" }],
    terhek: [{ fajta: "megoszlo", rud: "1", p1: -w, irany: "y" }],
  });
  kozel("4. M_A = wL²/2", e.reakciok[0].M, (w * L * L) / 2);
  const ig = e.igenybevetelek[0];
  kozel("4. M(0) = −wL²/2", ertekek(ig, 0).M, -(w * L * L) / 2);
  kozel("4. M(L/2) = −wL²/8", ertekek(ig, L / 2).M, -(w * L * L) / 8);
}

/* ============ 5. Kéttámaszú, háromszög alakú teher (0 → w) ============ */
{
  const L = 6, w = 9;
  const e = elemez({
    csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "B", x: L, y: 0 }],
    rudak: [{ id: "1", a: "A", b: "B" }],
    tamaszok: [{ csomopont: "A", tipus: "csuklo" }, { csomopont: "B", tipus: "gorgo" }],
    terhek: [{ fajta: "megoszlo", rud: "1", p1: 0, p2: -w, irany: "y" }],
  });
  const R = (w * L) / 2;
  kozel("5. A_y = R/3", e.reakciok[0].Fy, R / 3);
  kozel("5. B = 2R/3", e.reakciok[1].Fy, (2 * R) / 3);
  const ig = e.igenybevetelek[0];
  // M_max = wL²/(9√3) az x = L/√3 helyen
  kozel("5. M_max", ig.szelso.M.max, (w * L * L) / (9 * Math.sqrt(3)));
  kozel("5. M_max helye", ig.szelso.M.maxX, L / Math.sqrt(3));
}

/* ============ 6. Kéttámaszú, koncentrált nyomaték a közepén ============ */
{
  const L = 6, Mo = 24;
  const e = elemez({
    csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "B", x: L, y: 0 }],
    rudak: [{ id: "1", a: "A", b: "B" }],
    tamaszok: [{ csomopont: "A", tipus: "csuklo" }, { csomopont: "B", tipus: "gorgo" }],
    terhek: [{ fajta: "pontNyomatek", rud: "1", a: L / 2, M: Mo }],
  });
  // ΣM_A: Mo + L·B = 0 → B = −Mo/L
  kozel("6. B", e.reakciok[1].Fy, -Mo / L);
  kozel("6. A_y", e.reakciok[0].Fy, Mo / L);
  const ig = e.igenybevetelek[0];
  kozel("6. M bal (L/2−)", ertekek(ig, L / 2 - 1e-6).M, Mo / 2, 1e-4);
  kozel("6. ugrás", ertekek(ig, L / 2 + 1e-6).M - ertekek(ig, L / 2 - 1e-6).M, -Mo, 1e-4);
}

/* ============ 7. Konzolos kéttámaszú tartó ============ */
{
  // A(0) csukló, B(6) görgő, 2 m konzol jobbra, végén 10 kN lefelé
  const e = elemez({
    csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "B", x: 6, y: 0 }, { id: "C", x: 8, y: 0 }],
    rudak: [{ id: "1", a: "A", b: "B" }, { id: "2", a: "B", b: "C" }],
    tamaszok: [{ csomopont: "A", tipus: "csuklo" }, { csomopont: "B", tipus: "gorgo" }],
    terhek: [{ fajta: "csomopontiEro", csomopont: "C", Fy: -10 }],
  });
  // ΣM_A: 6B − 8·10 = 0 → B = 13,333 ; A_y = 10 − 13,333 = −3,333
  kozel("7. B", e.reakciok[1].Fy, 80 / 6);
  kozel("7. A_y (lefelé!)", e.reakciok[0].Fy, 10 - 80 / 6);
  kozel("7. M(B)", ertekek(e.igenybevetelek[0], 6).M, -20);
  igaz("7. egyensúly", e.ellenorzes.rendben);
}

/* ============ 8. Kétoldalt befogott tartó, egyenletes teher (1× határozatlan) ============ */
{
  const L = 6, w = 4;
  const e = elemez({
    csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "B", x: L, y: 0 }],
    rudak: [{ id: "1", a: "A", b: "B", EI: 1000, EA: 1e6 }],
    tamaszok: [{ csomopont: "A", tipus: "befogas" }, { csomopont: "B", tipus: "befogas" }],
    terhek: [{ fajta: "megoszlo", rud: "1", p1: -w, irany: "y" }],
  });
  igaz("8. határozatlan", e.merleg.tipus === "hatarozatlan");
  const ig = e.igenybevetelek[0];
  kozel("8. M(0) = −wL²/12", ertekek(ig, 0).M, -(w * L * L) / 12);
  kozel("8. M(L/2) = wL²/24", ertekek(ig, L / 2).M, (w * L * L) / 24);
  kozel("8. A_y = wL/2", e.reakciok[0].Fy, (w * L) / 2);
}

/* ============ 9. Egyik végén befogott, másikon megtámasztott (1× határozatlan) ============ */
{
  const L = 8, w = 3;
  const e = elemez({
    csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "B", x: L, y: 0 }],
    rudak: [{ id: "1", a: "A", b: "B", EI: 500, EA: 1e6 }],
    tamaszok: [{ csomopont: "A", tipus: "befogas" }, { csomopont: "B", tipus: "gorgo" }],
    terhek: [{ fajta: "megoszlo", rud: "1", p1: -w, irany: "y" }],
  });
  kozel("9. B = 3wL/8", e.reakciok[1].Fy, (3 * w * L) / 8);
  kozel("9. M_A = wL²/8", e.reakciok[0].M, (w * L * L) / 8);
  const ig = e.igenybevetelek[0];
  kozel("9. M_max = 9wL²/128", ig.szelso.M.max, (9 * w * L * L) / 128);
  kozel("9. M_max helye = 5L/8", ig.szelso.M.maxX, (5 * L) / 8);
}

/* ============ 10. Gerber-tartó (belső csuklóval) ============ */
{
  // A(0) csukló – C(6) belső csukló – B(10) görgő, egyenletes teher végig
  // A CB rész kéttámaszú? Nem: A–C konzolszerű? Vizsgáljuk számmal:
  // Rudak: 1: A→C, 2: C→B, a 2. rúd A-végén csukló
  const w = 4, L1 = 6, L2 = 4;
  const e = elemez({
    csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "C", x: L1, y: 0 }, { id: "B", x: L1 + L2, y: 0 }],
    rudak: [
      { id: "1", a: "A", b: "C" },
      { id: "2", a: "C", b: "B", csukloA: true },
    ],
    tamaszok: [
      { csomopont: "A", tipus: "befogas" },
      { csomopont: "B", tipus: "gorgo" },
    ],
    terhek: [
      { fajta: "megoszlo", rud: "1", p1: -w, irany: "y" },
      { fajta: "megoszlo", rud: "2", p1: -w, irany: "y" },
    ],
  });
  igaz("10. határozott", e.merleg.tipus === "hatarozott");
  // A CB rész: csuklós bal vég + görgő → egyszerű kéttámaszú: B = wL2/2
  kozel("10. B = wL₂/2", e.reakciok[1].Fy, (w * L2) / 2);
  // a csuklóban a nyomaték nulla
  kozel("10. M a csuklóban", ertekek(e.igenybevetelek[1], 0).M, 0, 1e-8);
  kozel("10. M(A) = −(wL₁²/2 + V_C·L₁)", e.reakciok[0].M, (w * L1 * L1) / 2 + ((w * L2) / 2) * L1);
  igaz("10. egyensúly", e.ellenorzes.rendben);
}

/* ============ 11. Ferde rúd, tengelyére merőleges egyenletes teher ============ */
{
  // 30°-os ferde rúd, két végén csukló+görgő; a teher a rúdra merőleges
  const L = 5, w = 4, alfa = 30 * Math.PI / 180;
  const e = elemez({
    csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "B", x: L * Math.cos(alfa), y: L * Math.sin(alfa) }],
    rudak: [{ id: "1", a: "A", b: "B" }],
    tamaszok: [{ csomopont: "A", tipus: "csuklo" }, { csomopont: "B", tipus: "gorgo", szog: 90 }],
    terhek: [{ fajta: "megoszlo", rud: "1", p1: -w, irany: "meroleges" }],
  });
  const ig = e.igenybevetelek[0];
  // a rúdra merőleges egyenletes teher: M_max = wL²/8 a felezőpontban
  kozel("11. M_max = wL²/8", ig.szelso.M.max, (w * L * L) / 8, 1e-5);
  igaz("11. egyensúly", e.ellenorzes.rendben);
}

/* ============ 12. Vetületre megadott teher (hóteher) ============ */
{
  const Lv = 6, alfa = 40 * Math.PI / 180, p = 3;
  const Lf = Lv / Math.cos(alfa);
  const e = elemez({
    csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "B", x: Lv, y: Lv * Math.tan(alfa) }],
    rudak: [{ id: "1", a: "A", b: "B" }],
    tamaszok: [{ csomopont: "A", tipus: "csuklo" }, { csomopont: "B", tipus: "gorgo" }],
    terhek: [{ fajta: "megoszlo", rud: "1", p1: -p, irany: "y", vetuletre: true }],
  });
  // az eredő a vízszintes vetület hosszával számolandó: R = p·Lv
  kozel("12. A_y + B = p·Lv", e.reakciok[0].Fy + e.reakciok[1].Fy, p * Lv, 1e-6);
}

/* ============ 13. Támasztórúd mint kényszer ============ */
{
  // vízszintes gerenda A(0) csuklóval, B(4) ponton 45°-os támasztórúd lefelé-jobbra
  // teher: 10 kN lefelé a jobb végen (x=4)
  const e = elemez({
    csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "B", x: 4, y: 0 }],
    rudak: [{ id: "1", a: "A", b: "B" }],
    tamaszok: [
      { csomopont: "A", tipus: "csuklo" },
      { csomopont: "B", tipus: "rud", irany: [1, -1] }, // a rúd jobbra-lefelé megy
    ],
    terhek: [{ fajta: "csomopontiEro", csomopont: "B", Fy: -10 }],
  });
  // a rúd iránya (1,−1)/√2; a húzóerő a csomópontot a rúd másik vége felé húzza (jobbra-le)
  // függőleges egyensúly B-ben a gerenda végén: a rúd függőleges komponense
  // −S/√2 = ... ; ΣM_A: 4·(rúd függőleges komponense) − 4·10 = 0
  const S = e.reakciok[1].S;
  kozel("13. rúderő függőleges komponense", (-S) / Math.SQRT2, 10, 1e-6);
  igaz("13. a rúd nyomott (S < 0)", S < 0);
  igaz("13. egyensúly", e.ellenorzes.rendben);
}

/* ============ 14. Keret: befogott oszlop + konzol (tört tengely) ============ */
{
  // A(0,0) befogás, oszlop fel A→C(0,3), majd vízszintes C→D(4,3); D-ben 5 kN lefelé
  const e = elemez({
    csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "C", x: 0, y: 3 }, { id: "D", x: 4, y: 3 }],
    rudak: [{ id: "o", a: "A", b: "C" }, { id: "g", a: "C", b: "D" }],
    tamaszok: [{ csomopont: "A", tipus: "befogas" }],
    terhek: [{ fajta: "csomopontiEro", csomopont: "D", Fy: -5 }],
  });
  kozel("14. A_y", e.reakciok[0].Fy, 5);
  kozel("14. M_A", e.reakciok[0].M, 20);
  kozel("14. az oszlopban N", ertekek(e.igenybevetelek[0], 1.5).N, -5, 1e-6);
  igaz("14. egyensúly", e.ellenorzes.rendben);
}

/* ============ 15–20. Az 5. modul kidolgozott feladatai ============ */
{
  // GYF‑1: befogott konzol, a=2 m, F1=10 kN 60°-ban jobbra-lefelé x=2-nél,
  // M=8 kNm óramutató szerint x=4-nél, F2=6 kN lefelé x=6-nál
  const e = elemez({
    csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "B", x: 6, y: 0 }],
    rudak: [{ id: "1", a: "A", b: "B" }],
    tamaszok: [{ csomopont: "A", tipus: "befogas" }],
    terhek: [
      { fajta: "pontTeher", rud: "1", a: 2, F: 10, irany: "szog", szog: -60 },
      { fajta: "pontNyomatek", rud: "1", a: 4, M: -8 },
      { fajta: "pontTeher", rud: "1", a: 6, F: -6, irany: "y" },
    ],
  });
  kozel("15. GYF‑1 A_x", e.reakciok[0].Fx, -5, 1e-4);
  kozel("15. GYF‑1 A_y", e.reakciok[0].Fy, 10 * Math.sin(Math.PI / 3) + 6, 1e-4);
  kozel("15. GYF‑1 M_A", e.reakciok[0].M, 10 * Math.sin(Math.PI / 3) * 2 + 8 + 36, 1e-4);
}
{
  // GYF‑2: 0..6 gerenda, csukló x=1,5, görgő x=4,5;
  // F1=12 kN 30°-ban balra-lefelé x=0-nál, F2=8 kN lefelé x=6-nál
  const e = elemez({
    csomopontok: [
      { id: "V", x: 0, y: 0 }, { id: "A", x: 1.5, y: 0 },
      { id: "B", x: 4.5, y: 0 }, { id: "C", x: 6, y: 0 },
    ],
    rudak: [{ id: "1", a: "V", b: "A" }, { id: "2", a: "A", b: "B" }, { id: "3", a: "B", b: "C" }],
    tamaszok: [{ csomopont: "A", tipus: "csuklo" }, { csomopont: "B", tipus: "gorgo" }],
    terhek: [
      { fajta: "csomopontiEro", csomopont: "V", Fx: -12 * Math.cos(Math.PI / 6), Fy: -12 * 0.5 },
      { fajta: "csomopontiEro", csomopont: "C", Fy: -8 },
    ],
  });
  kozel("16. GYF‑2 B", e.reakciok[1].Fy, 9, 1e-6);
  kozel("16. GYF‑2 A_y", e.reakciok[0].Fy, 5, 1e-6);
  kozel("16. GYF‑2 A_x", e.reakciok[0].Fx, 12 * Math.cos(Math.PI / 6), 1e-6);
}

/* ---- összegzés ---- */
console.log(`\n${jo} rendben, ${rossz} hibás`);
if (hibak.length) { console.log("\nHIBÁK:"); hibak.forEach((h) => console.log("  ✗ " + h)); process.exit(1); }
