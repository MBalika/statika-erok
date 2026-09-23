/**
 * Térbeli tartók számítómagja — a 10. modul (tiszta JS, nincs React).
 *
 * Koordináta-rendszer a tankönyv 9. fejezete és a H13 feladatsor szerint:
 *   x jobbra, y felfelé, z a néző felé (jobbkezes). Mértékegységek: kN, m, kNm.
 *   A nyomatékvektor a jobbkézszabály szerint: a vektor hegye felől nézve az
 *   óramutató járásával ellentétesen forgat a pozitív.
 *
 * Fő függvények:
 *   megoldLin(A, b)                         – n×n lineáris egyenletrendszer, részleges pivotálással
 *   bakallvany({ csucs, labak, F })          – háromlábú bakállvány: a csomópont 3 vetületi egyenlete → S1..S3
 *   tamasztorudak({ rudak, gombcsuklo?, terhek, nyomatekok? })
 *                                           – rudakkal (és esetleg egy gömbcsuklóval) megtámasztott merev test:
 *                                             hat egyensúlyi egyenlet → S_i (húzás +), A_x, A_y, A_z
 *   befogottKonzol({ A, terhek, nyomatekok? }) – mereven befogott térbeli konzol: reakcióerő- és nyomatékvektor
 *   igenybevetelek({ K, t, oldal, erok, nyomatekok? })
 *                                           – egy keresztmetszet hat igénybevétele pontra redukálással
 *   terbeliRacsos({ csomopontok, rudak, tamaszok, terhek }) – térbeli rácsos tartó csomóponti módszere (3 egyenlet / csomópont)
 *   nyomatekTengelyre({ pont, F, Q, e })     – erő nyomatéka egy tengelyre: M_t = ((P−Q)×F)·e
 *   egyensulyEllenorzes(erok, nyomatekok, O) – az összes erő és nyomaték visszahelyettesítése a hat egyenletbe
 *
 * Minden megoldó a végén visszahelyettesít a hat egyensúlyi egyenletbe (`ellenorzes`),
 * ez a számítómag saját tesztje is.
 */

const EPS = 1e-9;

/* ============================================================
   Vektorműveletek
   ============================================================ */

export const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const skal = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
export const skalar = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const kereszt = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const hossz = (a) => Math.hypot(a[0], a[1], a[2]);
export const egyseg = (a) => {
  const h = hossz(a);
  return h < EPS ? [0, 0, 0] : [a[0] / h, a[1] / h, a[2] / h];
};
export const nulla = (a, tures = 1e-7) => hossz(a) < tures;
const kerek = (v) => (Math.abs(v) < 1e-10 ? 0 : v);
export const kerekV = (v) => v.map(kerek);

/** Előjeles tag KaTeX-be: „+ 3,5” / „- 2” (4 értékes jegy, magyar vessző). */
export function f4(v, maxTizedes = 4) {
  if (!Number.isFinite(v)) return "–";
  if (Math.abs(v) < 5e-7) return "0";
  const nagys = Math.floor(Math.log10(Math.abs(v)));
  const tiz = Math.max(0, Math.min(maxTizedes, 3 - nagys));
  let s = Math.abs(v).toFixed(tiz);
  if (s.includes(".")) s = s.replace(/0+$/, "").replace(/\.$/, "");
  if (s === "0") return "0";
  return (v < 0 ? "-" : "") + s.replace(".", "{,}");
}
export const tagK = (v) => `${v < 0 ? "-" : "+"} ${f4(Math.abs(v))}`;
export const zarK = (v) => (v < 0 ? `(${f4(v)})` : f4(v));
export const vekK = (v) => `(${f4(v[0])};\\ ${f4(v[1])};\\ ${f4(v[2])})`;

/* ============================================================
   Lineáris egyenletrendszer (Gauss-elimináció részleges pivotálással)
   ============================================================ */

/**
 * A·x = b megoldása; A: n×n tömb, b: n hosszú. Visszaad { x, ok, det }.
 * Szinguláris mátrixnál ok = false (a tartó nem határozott / az elrendezés kritikus).
 */
export function megoldLin(A, b) {
  const n = b.length;
  const M = A.map((sor, i) => [...sor, b[i]]);
  let det = 1;
  for (let k = 0; k < n; k++) {
    let p = k;
    for (let i = k + 1; i < n; i++) if (Math.abs(M[i][k]) > Math.abs(M[p][k])) p = i;
    if (Math.abs(M[p][k]) < 1e-11) return { x: null, ok: false, det: 0 };
    if (p !== k) {
      [M[p], M[k]] = [M[k], M[p]];
      det = -det;
    }
    det *= M[k][k];
    for (let i = k + 1; i < n; i++) {
      const f = M[i][k] / M[k][k];
      if (f === 0) continue;
      for (let j = k; j <= n; j++) M[i][j] -= f * M[k][j];
    }
  }
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let s = M[i][n];
    for (let j = i + 1; j < n; j++) s -= M[i][j] * x[j];
    x[i] = s / M[i][i];
  }
  return { x: x.map(kerek), ok: true, det };
}

/* ============================================================
   Egyensúly-ellenőrzés: a hat egyenlet visszahelyettesítve
   ============================================================ */

/**
 * erok: [{ pont:[x,y,z], F:[Fx,Fy,Fz] }], nyomatekok: [[Mx,My,Mz]], O: a nyomatéki pont.
 * → { F:[ΣFx,ΣFy,ΣFz], M:[ΣMx,ΣMy,ΣMz], rendben }
 */
export function egyensulyEllenorzes(erok, nyomatekok = [], O = [0, 0, 0], tures = 1e-6) {
  let F = [0, 0, 0];
  let M = [0, 0, 0];
  for (const e of erok) {
    F = add(F, e.F);
    M = add(M, kereszt(sub(e.pont, O), e.F));
  }
  for (const m of nyomatekok) M = add(M, m);
  F = kerekV(F);
  M = kerekV(M);
  const lepteke = Math.max(1, ...erok.map((e) => hossz(e.F)));
  const rendben = hossz(F) < tures * lepteke && hossz(M) < tures * lepteke * 10;
  return { F, M, rendben };
}

/* ============================================================
   Nyomaték tengelyre
   ============================================================ */

/** Az (pont, F) erő nyomatéka a Q ponton átmenő, e irányú tengelyre: M_t = ((P−Q)×F)·e. */
export function nyomatekTengelyre({ pont, F, Q = [0, 0, 0], e }) {
  const et = egyseg(e);
  const MQ = kereszt(sub(pont, Q), F);
  return { MQ: kerekV(MQ), et, Mt: kerek(skalar(MQ, et)) };
}

/* ============================================================
   Háromlábú bakállvány (tankönyv 9.2.2)
   ============================================================ */

/**
 * csucs: a csomópont, labak: [p1, p2, p3] a rudak talppontjai, F: a csomópontra ható erő.
 * A rúderőt húzóerőként vesszük fel: a csomópontra S_i·e_i hat, ahol e_i a csúcsból a talppont felé mutató egységvektor.
 *   ΣF_x: F_x + S1 e1x + S2 e2x + S3 e3x = 0  (9.3), stb.
 * → { S:[S1,S2,S3], e:[e1,e2,e3], l:[l1,l2,l3], A (mátrix), b, ok, ellenorzes }
 */
export function bakallvany({ csucs, labak, F }) {
  const d = labak.map((p) => sub(p, csucs));
  const l = d.map(hossz);
  const e = d.map(egyseg);
  const A = [0, 1, 2].map((k) => e.map((ei) => ei[k]));
  const b = [-F[0], -F[1], -F[2]];
  const { x, ok, det } = megoldLin(A, b);
  const S = ok ? x : [NaN, NaN, NaN];
  const erok = [{ pont: csucs, F }, ...e.map((ei, i) => ({ pont: csucs, F: skal(ei, ok ? S[i] : 0) }))];
  const ellenorzes = egyensulyEllenorzes(erok, [], csucs);
  return { S, e, l, d, A, b, ok, det, ellenorzes, egySikban: !ok };
}

/* ============================================================
   Támasztórudakkal (és gömbcsuklóval) megtámasztott merev test (9.2.3)
   ============================================================ */

/**
 * rudak: [{ nev?, pont:[…] (a test csatlakozási pontja), masik:[…] (a rúd túlsó, rögzített vége) }]
 * gombcsuklo: [x,y,z] vagy null — ha van, A_x, A_y, A_z is ismeretlen.
 * terhek: [{ pont, F }], nyomatekok: [[Mx,My,Mz]], O: a nyomatéki egyenletek pontja (alapból a gömbcsukló, különben az origó).
 * Ismeretlenek: S_1…S_r (húzás +), majd A_x, A_y, A_z. Feltétel: r + (gömbcsukló? 3 : 0) = 6.
 * → { S, A, ismeretlenek:[nevek], matrix (6×6), jobb (6), sorok:[{cimke, egyutthatok, jobb}], ok, det, ellenorzes, e:[egységvektorok] }
 */
export function tamasztorudak({ rudak, gombcsuklo = null, terhek = [], nyomatekok = [], O }) {
  const r = rudak.length;
  const n = r + (gombcsuklo ? 3 : 0);
  const pontO = O ?? gombcsuklo ?? [0, 0, 0];
  const e = rudak.map((rd) => egyseg(sub(rd.masik, rd.pont)));
  const nevek = [...rudak.map((rd, i) => rd.nev ?? `S_${i + 1}`), ...(gombcsuklo ? ["A_x", "A_y", "A_z"] : [])];
  // együtthatók: oszloponként egy ismeretlen; sor 0..2 vetületi, 3..5 nyomatéki a pontO-ra
  const oszlop = (pont, irany) => {
    const m = kereszt(sub(pont, pontO), irany);
    return [irany[0], irany[1], irany[2], m[0], m[1], m[2]];
  };
  const oszlopok = [...rudak.map((rd, i) => oszlop(rd.pont, e[i]))];
  if (gombcsuklo) {
    oszlopok.push(oszlop(gombcsuklo, [1, 0, 0]), oszlop(gombcsuklo, [0, 1, 0]), oszlop(gombcsuklo, [0, 0, 1]));
  }
  // a terhek járuléka (a jobb oldalra negatív előjellel)
  let FT = [0, 0, 0];
  let MT = [0, 0, 0];
  for (const t of terhek) {
    FT = add(FT, t.F);
    MT = add(MT, kereszt(sub(t.pont, pontO), t.F));
  }
  for (const m of nyomatekok) MT = add(MT, m);
  const teher = [FT[0], FT[1], FT[2], MT[0], MT[1], MT[2]];
  const matrix = [0, 1, 2, 3, 4, 5].map((sor) => oszlopok.map((o) => o[sor]));
  const jobb = teher.map((v) => -v);
  const cimkek = ["\\Fx", "\\Fy", "\\Fz", "\\sum M_{ix}:\\ ", "\\sum M_{iy}:\\ ", "\\sum M_{iz}:\\ "];
  const sorok = matrix.map((egy, i) => ({ cimke: cimkek[i], egyutthatok: egy, teher: teher[i], jobb: jobb[i] }));
  if (n !== 6) {
    return { S: null, A: null, ismeretlenek: nevek, matrix, jobb, sorok, ok: false, hiba: `Az ismeretlenek száma ${n}, nem 6.`, e, pontO, teherOsszeg: FT, teherNyomatek: MT };
  }
  const { x, ok, det } = megoldLin(matrix, jobb);
  const S = ok ? x.slice(0, r) : null;
  const A = ok && gombcsuklo ? x.slice(r, r + 3) : null;
  const erok = [...terhek];
  if (ok) {
    rudak.forEach((rd, i) => erok.push({ pont: rd.pont, F: skal(e[i], S[i]) }));
    if (gombcsuklo) erok.push({ pont: gombcsuklo, F: A });
  }
  const ellenorzes = egyensulyEllenorzes(erok, nyomatekok, [0, 0, 0]);
  return { S, A, x: ok ? x : null, ismeretlenek: nevek, matrix, jobb, sorok, ok, det, hiba: ok ? null : "Az egyenletrendszer szinguláris: a megtámasztás kritikus (fölös kényszer és szabad mozgás).", e, pontO, teherOsszeg: FT, teherNyomatek: MT, ellenorzes };
}

/* ============================================================
   Mereven befogott térbeli konzol (9.2.3, 9.3. ábra)
   ============================================================ */

/**
 * A: a befogás pontja; terhek: [{ pont, F }]; nyomatekok: [[Mx,My,Mz]] (koncentrált nyomatékvektorok).
 * Reakció: A = −ΣF, M_A = −Σ (r_i − A) × F_i − Σ M_j.
 * → { R:[Ax,Ay,Az], MA:[MAx,MAy,MAz], tagok:{F:[…], M:[…]}, ellenorzes }
 */
export function befogottKonzol({ A = [0, 0, 0], terhek = [], nyomatekok = [] }) {
  let SF = [0, 0, 0];
  let SM = [0, 0, 0];
  const tagokM = [];
  for (const t of terhek) {
    SF = add(SF, t.F);
    const m = kereszt(sub(t.pont, A), t.F);
    tagokM.push({ r: sub(t.pont, A), F: t.F, m });
    SM = add(SM, m);
  }
  for (const m of nyomatekok) SM = add(SM, m);
  const R = kerekV(skal(SF, -1));
  const MA = kerekV(skal(SM, -1));
  const ellenorzes = egyensulyEllenorzes([...terhek, { pont: A, F: R }], [...nyomatekok, MA], [0, 0, 0]);
  return { R, MA, tagokM, teherOsszeg: SF, teherNyomatek: SM, ellenorzes };
}

/* ============================================================
   Egy keresztmetszet térbeli igénybevételei (9.3)
   ============================================================ */

/**
 * K: a keresztmetszet pontja; t: a tartótengely (lokális x) egységvektora a K-ban, a követő tartórész felé mutat;
 * oldal: "megelozo" | "koveto" — melyik tartórész erőit adjuk meg (erok: [{pont, F}], nyomatekok: [[…]]).
 * A keresztmetszetre a követő rész felől ható belső erő (R, M_K):
 *   követő rész erőiből:   R = ΣF,  M_K = Σ (r_i − K) × F_i + Σ M_j
 *   megelőző rész erőiből: R = −ΣF, M_K = −Σ (r_i − K) × F_i − Σ M_j
 * Előjel (tankönyv 9.3): a globális tengelyek pozitív irányába mutató komponens pozitív;
 * N = R·t (húzás +), T = M_K·t (a keresztmetszetből kifelé mutató csavarónyomaték +),
 * a nyíróerők és a hajlítónyomatékok a két másik globális tengely szerint.
 * → { R, MK, N, T, nyiro:{x?,y?,z?}, hajlito:{x?,y?,z?}, lista:[{nev, ertek, fajta}] }
 */
export function igenybevetelek({ K, t, oldal = "megelozo", erok = [], nyomatekok = [] }) {
  const et = egyseg(t);
  let SF = [0, 0, 0];
  let SM = [0, 0, 0];
  for (const e of erok) {
    SF = add(SF, e.F);
    SM = add(SM, kereszt(sub(e.pont, K), e.F));
  }
  for (const m of nyomatekok) SM = add(SM, m);
  const jel = oldal === "koveto" ? 1 : -1;
  const R = kerekV(skal(SF, jel));
  const MK = kerekV(skal(SM, jel));
  const N = kerek(skalar(R, et));
  const T = kerek(skalar(MK, et));
  const tengelyek = ["x", "y", "z"];
  // a tartótengellyel párhuzamos globális tengely (ha van)
  let fo = -1;
  tengelyek.forEach((_, i) => {
    if (Math.abs(Math.abs(et[i]) - 1) < 1e-9) fo = i;
  });
  const nyiro = {};
  const hajlito = {};
  const lista = [];
  if (fo >= 0) {
    lista.push({ nev: "N", tex: "N", ertek: N, fajta: "ero", tengely: tengelyek[fo] });
    tengelyek.forEach((nev, i) => {
      if (i === fo) return;
      nyiro[nev] = R[i];
      lista.push({ nev: `V_${nev}`, tex: `V_${nev}`, ertek: R[i], fajta: "ero", tengely: nev });
    });
    lista.push({ nev: "T", tex: "T", ertek: T, fajta: "nyomatek", tengely: tengelyek[fo] });
    tengelyek.forEach((nev, i) => {
      if (i === fo) return;
      hajlito[nev] = MK[i];
      lista.push({ nev: `M_${nev}`, tex: `M_${nev}`, ertek: MK[i], fajta: "nyomatek", tengely: nev });
    });
  } else {
    // ferde tengely: a nyíróerő és a hajlítónyomaték a tengelyre merőleges vetület
    const Rm = sub(R, skal(et, N));
    const Mm = sub(MK, skal(et, T));
    lista.push({ nev: "N", tex: "N", ertek: N, fajta: "ero" }, { nev: "V", tex: "V", ertek: hossz(Rm), fajta: "ero" }, { nev: "T", tex: "T", ertek: T, fajta: "nyomatek" }, { nev: "M", tex: "M", ertek: hossz(Mm), fajta: "nyomatek" });
  }
  return { R, MK, N, T, nyiro, hajlito, lista, et, fo };
}

/* ============================================================
   Térbeli rácsos tartó — csomóponti módszer (9.2.4)
   ============================================================ */

/**
 * csomopontok: [{ id, p:[x,y,z] }]; rudak: [{ id?, a, b }];
 * tamaszok: [{ csomopont, tipus: "gomb" | "rud", irany?:[…] (rúd: a reakció iránya) }];
 * terhek: [{ csomopont, F:[…] }].
 * Ismeretlenek: rúderők (húzás +) és reakciókomponensek; egyenletek: csomópontonként három vetületi.
 * → { ok, e (egyenletek száma 3c), i (ismeretlenek), rudErok:{id: S}, reakciok:[{csomopont, tipus, F:[…], S?}], hiba, ellenorzes, csomopontiEgyenletek }
 */
export function terbeliRacsos({ csomopontok, rudak, tamaszok = [], terhek = [] }) {
  const idx = new Map(csomopontok.map((c, i) => [c.id, i]));
  const P = (id) => csomopontok[idx.get(id)].p;
  const c = csomopontok.length;
  const ismeretlenek = [];
  rudak.forEach((r) => ismeretlenek.push({ tipus: "rud", id: r.id ?? `${r.a}${r.b}`, a: r.a, b: r.b, e: egyseg(sub(P(r.b), P(r.a))) }));
  tamaszok.forEach((t, k) => {
    if (t.tipus === "gomb") {
      ismeretlenek.push({ tipus: "reakcio", id: `${t.csomopont}_x`, csomopont: t.csomopont, irany: [1, 0, 0], tamasz: k });
      ismeretlenek.push({ tipus: "reakcio", id: `${t.csomopont}_y`, csomopont: t.csomopont, irany: [0, 1, 0], tamasz: k });
      ismeretlenek.push({ tipus: "reakcio", id: `${t.csomopont}_z`, csomopont: t.csomopont, irany: [0, 0, 1], tamasz: k });
    } else {
      ismeretlenek.push({ tipus: "reakcio", id: `${t.csomopont}_S`, csomopont: t.csomopont, irany: egyseg(t.irany), tamasz: k });
    }
  });
  const n = ismeretlenek.length;
  const e = 3 * c;
  if (n !== e) {
    return { ok: false, e, i: n, hiba: `3c = ${e} egyenlet, ${n} ismeretlen: ${n < e ? "túlhatározott (mozog)" : "határozatlan"} szerkezet.` };
  }
  const A = Array.from({ length: e }, () => new Array(n).fill(0));
  const b = new Array(e).fill(0);
  ismeretlenek.forEach((u, j) => {
    if (u.tipus === "rud") {
      const ia = idx.get(u.a);
      const ib = idx.get(u.b);
      for (let k = 0; k < 3; k++) {
        A[3 * ia + k][j] += u.e[k]; // az a csomópontra a b felé mutató húzóerő
        A[3 * ib + k][j] -= u.e[k]; // a b csomópontra az a felé
      }
    } else {
      const ic = idx.get(u.csomopont);
      for (let k = 0; k < 3; k++) A[3 * ic + k][j] += u.irany[k];
    }
  });
  terhek.forEach((t) => {
    const ic = idx.get(t.csomopont);
    for (let k = 0; k < 3; k++) b[3 * ic + k] -= t.F[k];
  });
  const { x, ok } = megoldLin(A, b);
  if (!ok) return { ok: false, e, i: n, hiba: "Kritikus elrendezés: az egyenletrendszer szinguláris." };
  const rudErok = {};
  const reakciok = [];
  ismeretlenek.forEach((u, j) => {
    if (u.tipus === "rud") rudErok[u.id] = x[j];
    else reakciok.push({ csomopont: u.csomopont, id: u.id, S: x[j], F: skal(u.irany, x[j]) });
  });
  // ellenőrzés: minden csomópont három egyenlete, és a teljes tartó hat egyenlete
  const csomopontiEgyenletek = csomopontok.map((cs) => {
    let s = [0, 0, 0];
    terhek.filter((t) => t.csomopont === cs.id).forEach((t) => (s = add(s, t.F)));
    ismeretlenek.forEach((u, j) => {
      if (u.tipus === "rud") {
        if (u.a === cs.id) s = add(s, skal(u.e, x[j]));
        if (u.b === cs.id) s = sub(s, skal(u.e, x[j]));
      } else if (u.csomopont === cs.id) s = add(s, skal(u.irany, x[j]));
    });
    return { csomopont: cs.id, osszeg: kerekV(s) };
  });
  const kulso = [...terhek.map((t) => ({ pont: P(t.csomopont), F: t.F })), ...reakciok.map((r) => ({ pont: P(r.csomopont), F: r.F }))];
  const ellenorzes = egyensulyEllenorzes(kulso, [], [0, 0, 0]);
  return { ok: true, e, i: n, rudErok, reakciok, ismeretlenek, A, b, x, csomopontiEgyenletek, ellenorzes };
}

/**
 * Egy csomópont elkülönítése: ismert erők + legfeljebb három ismeretlen rúd → a három rúderő.
 * ismertErok: [[Fx,Fy,Fz]], rudIranyok: [e1, e2, e3] (a csomópontból kifelé mutató egységvektorok).
 */
export function csomopontHaromRud({ ismertErok = [], rudIranyok }) {
  let F = [0, 0, 0];
  for (const f of ismertErok) F = add(F, f);
  const e = rudIranyok.map(egyseg);
  const A = [0, 1, 2].map((k) => e.map((ei) => ei[k]));
  const { x, ok } = megoldLin(A, [-F[0], -F[1], -F[2]]);
  let ell = F;
  if (ok) e.forEach((ei, i) => (ell = add(ell, skal(ei, x[i]))));
  return { S: ok ? x : null, ok, e, osszeg: F, ellenorzes: kerekV(ell) };
}

/* ============================================================
   Térfogat mentén megoszló teher (9.1.3): téglatest alakú tartály
   ============================================================ */

/** Egy [x0..x1]×[y0..y1]×[z0..z1] téglatest γ fajsúlyú töltésének súlya és súlypontja (a teher −y irányú). */
export function terfogatiTeher({ x: [x0, x1], y: [y0, y1], z: [z0, z1], gamma }) {
  const V = (x1 - x0) * (y1 - y0) * (z1 - z0);
  const G = gamma * V;
  return { V, G, sulypont: [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], F: [0, -G, 0] };
}

/* ============================================================
   Az eredő jellege térben (9.1.2)
   ============================================================ */

/** F_A (társerő) és M_A (társnyomaték) alapján az eredő négy esete. */
export function eredoJellege(FA, MA, tures = 1e-7) {
  const f = hossz(FA);
  const m = hossz(MA);
  if (f < tures && m < tures) return { eset: "egyensuly", nev: "egyensúlyi erőrendszer (zéruserő)" };
  if (f < tures) return { eset: "nyomatek", nev: "az eredő egy nyomaték (erőpár)" };
  const p = skalar(FA, MA) / f;
  if (Math.abs(p) < tures * Math.max(1, m)) return { eset: "ero", nev: "az eredő egy erő (eltolt hatásvonalon)" };
  return { eset: "erocsavar", nev: "erőcsavar: erő + vele párhuzamos nyomaték", parhuzamosNyomatek: p };
}
