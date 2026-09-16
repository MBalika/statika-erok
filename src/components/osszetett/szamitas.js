/**
 * A 6. modul (összetett tartók) számítási segédei — tiszta JS, JSX nélkül,
 * hogy Node-ból is ellenőrizhető legyen (`node` + `elemez`).
 *
 * Koordináta-rendszer: x jobbra, y felfelé, nyomaték ↶ pozitív (a számítómaggal azonos).
 * Minden belső csuklóerőt a „II. testre” (a befüggesztett / a csuklós rúdvégű testre)
 * ható értékkel adunk meg; az I. testre az ellentettje hat.
 *
 * Erő–kar konvenció: egy (Fx, Fy) erő nyomatéka a P pontra: (x − Px)·Fy − (y − Py)·Fx.
 */

export const FOK = Math.PI / 180;

/** Egy erőlista nyomatéka a P pontra (↶ +). Az erők: { x, y?, Fx?, Fy?, M? }. */
export function nyomatek(erok, P) {
  return erok.reduce((s, e) => s + (e.x - P[0]) * (e.Fy ?? 0) - ((e.y ?? 0) - P[1]) * (e.Fx ?? 0) + (e.M ?? 0), 0);
}
const szumX = (erok) => erok.reduce((s, e) => s + (e.Fx ?? 0), 0);
const szumY = (erok) => erok.reduce((s, e) => s + (e.Fy ?? 0), 0);

/* ============================================================
   1. Gerber-tartó (tankönyv 5.4): A csukló (x = 0), B görgő (xB), C belső csukló (xC), D görgő (xD)
      I. test: A…C (fix rész), II. test: C…D (befüggesztett rész).
      terhekI / terhekII: erők (eredők) { x, y?, Fx, Fy, M? }; FC: a csuklóra ható erő (opcionális).
   ============================================================ */
export function gerberSzamit({ xB, xC, xD, terhekI = [], terhekII = [], FC = null }) {
  // II. test: (F_II, C, D) ≐ O — három ismeretlen: C_x, C_y, D
  const D = -nyomatek(terhekII, [xC, 0]) / (xD - xC);
  const Cy = -nyomatek(terhekII, [xD, 0]) / (xC - xD);
  const Cx = -szumX(terhekII);
  // a csukló egyensúlya: F_C − C_I − C_II = 0  →  C_I = F_C − C_II  (C_I: az I. testre ható csuklóerő)
  const CIx = (FC?.Fx ?? 0) - Cx;
  const CIy = (FC?.Fy ?? 0) - Cy;
  const erokI = [...terhekI, { x: xC, y: 0, Fx: CIx, Fy: CIy }];
  const B = -nyomatek(erokI, [0, 0]) / xB;
  const Ay = nyomatek(erokI, [xB, 0]) / xB;
  const Ax = -szumX(erokI);
  const ellenorzes = Ay + B + D + szumY(terhekI) + szumY(terhekII) + (FC?.Fy ?? 0);
  return { Ax, Ay, B, D, Cx, Cy, CIx, CIy, ellenorzes };
}

/* ============================================================
   2. Gerber-tartó befogással (tankönyv 5.5, H05/3): a tartó 0-tól xB-ig;
      A görgő (xA), C belső csukló (xC), B befogás (xB). I. test: 0…xC (befüggesztett), II. test: xC…xB (fix).
      A belső csuklóerőt itt az I. testre ható értékkel adjuk (C_x, C_y), a II.-re −C hat.
   ============================================================ */
export function gerberBefogasSzamit({ xA, xC, xB, terhekI = [], terhekII = [] }) {
  const A = -nyomatek(terhekI, [xC, 0]) / (xA - xC);
  const Cy = -nyomatek(terhekI, [xA, 0]) / (xC - xA);
  const Cx = -szumX(terhekI);
  const erokII = [...terhekII, { x: xC, y: 0, Fx: -Cx, Fy: -Cy }];
  const Bx = -szumX(erokII);
  const By = -szumY(erokII);
  const MB = -nyomatek(erokII, [xB, 0]);
  const ellenorzes = nyomatek([...terhekI, ...terhekII, { x: xA, y: 0, Fx: 0, Fy: A }, { x: xB, y: 0, Fx: Bx, Fy: By, M: MB }], [0, 0]);
  return { A, Cx, Cy, Bx, By, MB, ellenorzes };
}

/* ============================================================
   3. Háromcsuklós tartó (tankönyv 5.8): A csukló (0, 0), B csukló (xB, yB), C belső csukló (xC, yC).
      terhekI: az I. (A-oldali) testre, terhekII: a II. (B-oldali) testre ható erők { x, y, Fx, Fy, M? }.
      FC: a csuklóra ható erő (terhelt csukló, 5.10) — a csukló egyensúlyából C_I = F_C − C_II.
      Általános helyzetben kétismeretlenes rendszert oldunk: ΣM_A (egész) és ΣM_C (II) → B_x, B_y.
   ============================================================ */
export function haromcsuklosSzamit({ xB, yB = 0, xC, yC, terhekI = [], terhekII = [], FC = null }) {
  const mind = [...terhekI, ...terhekII, ...(FC ? [{ x: xC, y: yC, Fx: FC.Fx ?? 0, Fy: FC.Fy ?? 0 }] : [])];
  // ΣM_A (egész): M1 + xB·By − yB·Bx = 0
  // ΣM_C (II):    M2 + (xB − xC)·By − (yB − yC)·Bx = 0
  const M1 = nyomatek(mind, [0, 0]);
  const M2 = nyomatek(terhekII, [xC, yC]);
  const a11 = -yB, a12 = xB, a21 = -(yB - yC), a22 = xB - xC;
  const det = a11 * a22 - a12 * a21;
  const Bx = (-M1 * a22 + M2 * a12) / det;
  const By = (-a11 * M2 + a21 * M1) / det;
  const Ax = -szumX(mind) - Bx;
  const Ay = -szumY(mind) - By;
  // a II. testre ható csuklóerő
  const Cx = -szumX(terhekII) - Bx;
  const Cy = -szumY(terhekII) - By;
  const CIx = (FC?.Fx ?? 0) - Cx;
  const CIy = (FC?.Fy ?? 0) - Cy;
  const ellenorzes = nyomatek([...terhekI, { x: 0, y: 0, Fx: Ax, Fy: Ay }, { x: xC, y: yC, Fx: CIx, Fy: CIy }], [0, 0]);
  return { Ax, Ay, Bx, By, Cx, Cy, CIx, CIy, ellenorzes, kozvetlen: Math.abs(yB) < 1e-9 };
}

/* ============================================================
   4. Rudakkal felfüggesztett terhelt csukló (H06/5–6): gerenda 0…xB, A görgő (xA), B csukló (xB),
      az E (xE, 0) pontból merev oszlop C (xE, h)-ig; a D (0, h) csuklót a DC és DE rúd tartja, D-n F hat.
   ============================================================ */
export function fuggesztettCsukloSzamit({ xA, xB, xE, h, Fx = 0, Fy }) {
  const lDE = Math.hypot(xE, h);
  const eDE = [xE / lDE, -h / lDE]; // D → E egységvektor
  const SDE = -Fy / eDE[1]; // ΣF_y (D): Fy + S_DE·e_y = 0
  const SDC = -Fx - SDE * eDE[0]; // ΣF_x (D): Fx + S_DC + S_DE·e_x = 0
  // a gerenda + oszlop (I. test) reakciói: az egész szerkezetre a teher F a D pontban
  const A = -nyomatek([{ x: 0, y: h, Fx, Fy }], [xB, 0]) / (xA - xB);
  const By = -Fy - A;
  const Bx = -Fx;
  return { SDE, SDC, A, Bx, By, lDE, eDE };
}

/* ============================================================
   5. Függesztőműves tartó (tankönyv 5.13): A csukló (0,0), C belső csukló (xC,0), B görgő (L,0);
      D (xD, h), E (xE, h) csuklók; rudak: S1 A–D, S2 D–(xD,0), S3 D–E, S4 E–(xE,0), S5 E–B.
      F1 az I. testen (x1), F2 a II. testen (x2), mindkettő lefelé (pozitív szám).
   ============================================================ */
export function fuggesztomuSzamit({ L, xC, xD, xE, h, x1, F1, x2, F2 }) {
  const B = (x1 * F1 + x2 * F2) / L;
  const Ay = ((L - x1) * F1 + (L - x2) * F2) / L;
  const Ax = 0;
  // I + D: ΣM_C: −xC·Ay − (x1 − xC)·F1 − h·S3 = 0
  const S3 = (-xC * Ay - (x1 - xC) * F1) / h;
  const Cx = -S3; // az I. testre ható C_x
  const Cy = F1 - Ay;
  const l1 = Math.hypot(xD, h);
  const S1 = (S3 * l1) / xD;
  const S2 = (-S1 * h) / l1;
  const l5 = Math.hypot(L - xE, h);
  const S5 = (S3 * l5) / (L - xE);
  const S4 = (-S5 * h) / l5;
  const ellenorzes = -Cx * 0 + (-Cy - F2 + B); // II: ΣF_y
  return { Ax, Ay, B, S1, S2, S3, S4, S5, Cx, Cy, ellenorzes, l1, l5 };
}

/* ============================================================
   6. Egyetlen rúddal befüggesztett rész (tankönyv 5.6.c): I. test: gerenda 0…xP (A görgő xA, B csukló xB);
      a P (xP, 0) végből rúd a Q (xQ, h) pontba; II. test: gerenda Q…D vízszintesen h magasságban, D csukló (xD, h).
      F1 az I. testen (x1, lefelé), F2 a II. testen (x2, lefelé).
   ============================================================ */
export function ruddalKapcsoltSzamit({ xA, xB, xP, xQ, xD, h, x1, F1, x2, F2 }) {
  const l = Math.hypot(xP - xQ, h);
  const e = [(xP - xQ) / l, -h / l]; // Q → P (a rúderő iránya a II. testen, húzottnak felvéve)
  // II: ΣM_D: −(x2 − xD)·F2 + (xQ − xD)·S·e_y = 0
  const S = ((x2 - xD) * F2) / ((xQ - xD) * e[1]);
  const Dx = -S * e[0];
  const Dy = F2 - S * e[1];
  // I: a rúd a P pontban −S·e-vel hat (a rúd az I. testet P-ből Q felé húzza): S·(−e)
  const Sx = -S * e[0], Sy = -S * e[1];
  const erokI = [{ x: x1, y: 0, Fx: 0, Fy: -F1 }, { x: xP, y: 0, Fx: Sx, Fy: Sy }];
  const A = -nyomatek(erokI, [xB, 0]) / (xA - xB);
  const By = -szumY(erokI) - A;
  const Bx = -szumX(erokI);
  return { S, Dx, Dy, A, Bx, By, l, e, Sx, Sy };
}

/* ============================================================
   Modell-építők a számítómaghoz (elemez) — a felfedezők és a kalkulátor ezeket használják.
   ============================================================ */

/** Gerber-tartó modell: A csukló 0, B görgő xB, C csukló xC, D görgő xD; F1 (szög) az I. testen, F2 és p a II. testen, FC a csuklón. */
export function gerberModell({ xB, xC, xD, F1 = 0, x1 = 1, szog1 = -90, F2 = 0, x2 = 1, p = 0, FC = 0 }) {
  const terhek = [];
  if (F1) terhek.push({ fajta: "pontTeher", rud: x1 <= xB ? "1" : "2", a: x1 <= xB ? x1 : x1 - xB, F: F1, irany: "szog", szog: szog1 });
  if (F2) terhek.push({ fajta: "pontTeher", rud: "3", a: Math.max(0, Math.min(xD - xC, x2 - xC)), F: -F2, irany: "y" });
  if (p) terhek.push({ fajta: "megoszlo", rud: "3", p1: -p, irany: "y" });
  if (FC) terhek.push({ fajta: "csomopontiEro", csomopont: "C", Fy: -FC });
  return {
    csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "B", x: xB, y: 0 }, { id: "C", x: xC, y: 0 }, { id: "D", x: xD, y: 0 }],
    rudak: [{ id: "1", a: "A", b: "B" }, { id: "2", a: "B", b: "C" }, { id: "3", a: "C", b: "D", csukloA: true }],
    tamaszok: [{ csomopont: "A", tipus: "csuklo" }, { csomopont: "B", tipus: "gorgo", szog: 90 }, { csomopont: "D", tipus: "gorgo", szog: 90 }],
    terhek,
  };
}

/** Gerber-tartó befogással (5.5): a gerenda 0…xB, A görgő xA, C csukló xC, B befogás xB; F1 a bal végen (szög), F2 a II. testen. */
export function gerberBefogasModell({ xA, xC, xB, F1 = 0, szog1 = -90, F2 = 0, x2 = 1, p = 0 }) {
  const terhek = [];
  if (F1) terhek.push({ fajta: "csomopontiEro", csomopont: "P", Fx: F1 * Math.cos(szog1 * FOK), Fy: F1 * Math.sin(szog1 * FOK) });
  if (F2) terhek.push({ fajta: "pontTeher", rud: "3", a: Math.max(0, Math.min(xB - xC, x2 - xC)), F: -F2, irany: "y" });
  if (p) terhek.push({ fajta: "megoszlo", rud: "2", p1: -p, irany: "y" });
  return {
    csomopontok: [{ id: "P", x: 0, y: 0 }, { id: "A", x: xA, y: 0 }, { id: "C", x: xC, y: 0 }, { id: "B", x: xB, y: 0 }],
    rudak: [{ id: "1", a: "P", b: "A" }, { id: "2", a: "A", b: "C" }, { id: "3", a: "C", b: "B", csukloA: true }],
    tamaszok: [{ csomopont: "A", tipus: "gorgo", szog: 90 }, { csomopont: "B", tipus: "befogas" }],
    terhek,
  };
}

/**
 * Háromcsuklós keret: A (0,0) csukló, D (0,hA) sarok, C (xC, hC) csukló, E (L, hB) sarok, B (L, yB) csukló.
 * F függőleges erő a gerendán x = xF helyen (a C-től balra az I., jobbra a II. testen), p vízszintes teher a bal oszlopon,
 * FC a csuklón (lefelé).
 */
export function haromcsuklosModell({ L, hA, hB = hA, yB = 0, xC, hC = hA, F = 0, xF = 1, p = 0, FC = 0 }) {
  const terhek = [];
  const balHossz = Math.hypot(xC, hC - hA), jobbHossz = Math.hypot(L - xC, hB - hC);
  if (F) {
    if (xF <= xC) terhek.push({ fajta: "pontTeher", rud: "2", a: (xF / xC) * balHossz, F: -F, irany: "y" });
    else terhek.push({ fajta: "pontTeher", rud: "3", a: ((xF - xC) / (L - xC)) * jobbHossz, F: -F, irany: "y" });
  }
  if (p) terhek.push({ fajta: "megoszlo", rud: "1", p1: p, irany: "x" });
  if (FC) terhek.push({ fajta: "csomopontiEro", csomopont: "C", Fy: -FC });
  return {
    csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "D", x: 0, y: hA }, { id: "C", x: xC, y: hC }, { id: "E", x: L, y: hB }, { id: "B", x: L, y: yB }],
    rudak: [{ id: "1", a: "A", b: "D" }, { id: "2", a: "D", b: "C" }, { id: "3", a: "C", b: "E", csukloA: true }, { id: "4", a: "E", b: "B" }],
    tamaszok: [{ csomopont: "A", tipus: "csuklo" }, { csomopont: "B", tipus: "csuklo" }],
    terhek,
  };
}

/**
 * A levezetés ismeretleneiből kiszedi a támaszreakciókat és a belső csuklóerőket.
 * A belső csuklóerő előjele: a csuklós rúdvégű (II.) testre ható érték.
 */
export function ismeretlenTerkep(lv) {
  const t = {};
  for (const u of lv.ismeretlenek) {
    const kulcs = u.jel.replace(/[{}\\]/g, "");
    t[kulcs] = u.ertek;
  }
  return t;
}

/** Fokszám-mérleg egy leírásból: testek száma és a kényszerek fokszámai. */
export function fokszamMerleg({ testek, kulso, belso }) {
  const ismeretlen = kulso.reduce((s, k) => s + k, 0) + belso.reduce((s, k) => s + k, 0);
  const egyenlet = 3 * testek;
  return { ismeretlen, egyenlet, fok: ismeretlen - egyenlet };
}
