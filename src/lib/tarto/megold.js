/**
 * Síkbeli rúdszerkezet megoldása elmozdulásmódszerrel (merevségi mátrix).
 *
 * Miért ez: statikailag HATÁROZOTT szerkezetnél az eredmény nem függ az EI és
 * EA értékétől, tehát egységnyi merevséggel is egzakt; határozatlan szerkezetre
 * viszont ugyanez a kód működik, csak ott a merevségek már számítanak.
 *
 * A kényszereket Lagrange-multiplikátorral írjuk elő, így a ferde görgő és a
 * támasztórúd is pontosan kezelhető, és a reakciók közvetlenül adódnak.
 */

import { megold as megoldRendszer, inverz, nullMatrix } from "./matrix.js";

/* ---------- Gauss–Legendre kvadratúra (4 pont, ötödfokig egzakt) ---------- */
const GP = [-0.8611363115940526, -0.3399810435848563, 0.3399810435848563, 0.8611363115940526];
const GW = [0.3478548451374538, 0.6521451548625461, 0.6521451548625461, 0.3478548451374538];

/* ---------- alakfüggvények ---------- */
/** Hermite- és lineáris alakfüggvények a lokális x helyen (L a rúd hossza). */
export function alakfuggvenyek(x, L) {
  const t = x / L;
  return [
    1 - t,                               // N1 – tengelyirányú, kezdőpont
    1 - 3 * t * t + 2 * t * t * t,       // N2 – kereszt, kezdőpont
    L * (t - 2 * t * t + t * t * t),     // N3 – elfordulás, kezdőpont
    t,                                   // N4 – tengelyirányú, végpont
    3 * t * t - 2 * t * t * t,           // N5 – kereszt, végpont
    L * (-t * t + t * t * t),            // N6 – elfordulás, végpont
  ];
}

/** Az alakfüggvények deriváltjai (koncentrált nyomaték tehervektorához). */
export function alakDerivalt(x, L) {
  const t = x / L;
  return [
    -1 / L,
    (-6 * t + 6 * t * t) / L,
    1 - 4 * t + 3 * t * t,
    1 / L,
    (6 * t - 6 * t * t) / L,
    -2 * t + 3 * t * t,
  ];
}

/** Lokális merevségi mátrix (6×6). */
export function lokalisMerevseg(rud) {
  const { hossz: L, EA, EI } = rud;
  const k = nullMatrix(6, 6);
  const a = EA / L;
  const b = (12 * EI) / (L * L * L);
  const c = (6 * EI) / (L * L);
  const d = (4 * EI) / L;
  const e = (2 * EI) / L;
  k[0][0] = a;  k[0][3] = -a;
  k[3][0] = -a; k[3][3] = a;
  k[1][1] = b;  k[1][2] = c;  k[1][4] = -b; k[1][5] = c;
  k[2][1] = c;  k[2][2] = d;  k[2][4] = -c; k[2][5] = e;
  k[4][1] = -b; k[4][2] = -c; k[4][4] = b;  k[4][5] = -c;
  k[5][1] = c;  k[5][2] = e;  k[5][4] = -c; k[5][5] = d;
  return k;
}

/** Transzformációs mátrix: d_lokális = T · d_globális. */
export function transzformacio(rud) {
  const { cos: c, sin: s } = rud;
  const T = nullMatrix(6, 6);
  T[0][0] = c;  T[0][1] = s;
  T[1][0] = -s; T[1][1] = c;
  T[2][2] = 1;
  T[3][3] = c;  T[3][4] = s;
  T[4][3] = -s; T[4][4] = c;
  T[5][5] = 1;
  return T;
}

/**
 * A rúdra jutó terhek konzisztens csomóponti tehervektora (lokális, 6 elem).
 * Q = ∫ Nᵀ q dx + Σ N(a)ᵀ P + Σ N'(a)ᵀ M
 */
export function tehervektor(rud) {
  const L = rud.hossz;
  const Q = new Array(6).fill(0);
  for (const m of rud.megoszlok) {
    const fel = (m.a2 - m.a1) / 2;
    const kozep = (m.a1 + m.a2) / 2;
    for (let g = 0; g < GP.length; g++) {
      const x = kozep + fel * GP[g];
      const w = GW[g] * fel;
      const u = (x - m.a1) / (m.a2 - m.a1);
      const qx = m.qx1 + (m.qx2 - m.qx1) * u;
      const qy = m.qy1 + (m.qy2 - m.qy1) * u;
      const N = alakfuggvenyek(x, L);
      Q[0] += w * N[0] * qx;
      Q[3] += w * N[3] * qx;
      Q[1] += w * N[1] * qy;
      Q[2] += w * N[2] * qy;
      Q[4] += w * N[4] * qy;
      Q[5] += w * N[5] * qy;
    }
  }
  for (const p of rud.pontTerhek) {
    const N = alakfuggvenyek(p.a, L);
    const dN = alakDerivalt(p.a, L);
    Q[0] += N[0] * p.Px;
    Q[3] += N[3] * p.Px;
    Q[1] += N[1] * p.Py;
    Q[2] += N[2] * p.Py;
    Q[4] += N[4] * p.Py;
    Q[5] += N[5] * p.Py;
    if (p.Mz) {
      Q[1] += dN[1] * p.Mz;
      Q[2] += dN[2] * p.Mz;
      Q[4] += dN[4] * p.Mz;
      Q[5] += dN[5] * p.Mz;
    }
  }
  return Q;
}

/** Csuklós rúdvégek kikondenzálása. Visszaad { k, Q, R, kRRinv, kRK, QR }. */
function kondenzal(k, Q, rud) {
  const R = [];
  if (rud.csukloA) R.push(2);
  if (rud.csukloB) R.push(5);
  if (R.length === 0) return { k, Q, R, kRRinv: null };
  const K = [0, 1, 2, 3, 4, 5].filter((i) => !R.includes(i));
  const kRR = R.map((i) => R.map((j) => k[i][j]));
  const kRK = R.map((i) => K.map((j) => k[i][j]));
  const kKR = K.map((i) => R.map((j) => k[i][j]));
  const kRRinv = inverz(kRR);
  // k* = k_KK − k_KR · k_RR⁻¹ · k_RK ;  Q* = Q_K − k_KR · k_RR⁻¹ · Q_R
  const kc = nullMatrix(6, 6);
  const Qc = new Array(6).fill(0);
  const seged = K.map((_, a) =>
    R.map((_, b) => R.reduce((s, __, c) => s + kKR[a][c] * kRRinv[c][b], 0)),
  ); // k_KR · k_RR⁻¹  (|K| × |R|)
  for (let a = 0; a < K.length; a++) {
    for (let b = 0; b < K.length; b++) {
      let s = k[K[a]][K[b]];
      for (let c = 0; c < R.length; c++) s -= seged[a][c] * kRK[c][b];
      kc[K[a]][K[b]] = s;
    }
    let q = Q[K[a]];
    for (let c = 0; c < R.length; c++) q -= seged[a][c] * Q[R[c]];
    Qc[K[a]] = q;
  }
  return { k: kc, Q: Qc, R, kRRinv, kRK, K };
}

/**
 * A szerkezet megoldása.
 * @returns { ok, hibak, eltolodasok, reakciok, rudVegErok, hatarozatlan }
 */
export function megoldSzerkezet(m) {
  const n = m.csomopontok.length;
  const ndof = 3 * n;
  const K = nullMatrix(ndof, ndof);
  const F = new Array(ndof).fill(0);
  const hibak = [];

  // csomóponti terhek
  m.csomopontiTerhek.forEach((t, i) => {
    F[3 * i] += t.Fx;
    F[3 * i + 1] += t.Fy;
    F[3 * i + 2] += t.M;
  });

  // rudak hozzájárulása
  const rudAdat = [];
  for (const rud of m.rudak) {
    const kLok = lokalisMerevseg(rud);
    const QLok = tehervektor(rud);
    const kond = kondenzal(kLok, QLok, rud);
    const T = transzformacio(rud);
    // k_glob = Tᵀ k T ;  Q_glob = Tᵀ Q
    const kGlob = nullMatrix(6, 6);
    for (let i = 0; i < 6; i++)
      for (let j = 0; j < 6; j++) {
        let s = 0;
        for (let a = 0; a < 6; a++)
          for (let b = 0; b < 6; b++) s += T[a][i] * kond.k[a][b] * T[b][j];
        kGlob[i][j] = s;
      }
    const QGlob = new Array(6).fill(0);
    for (let i = 0; i < 6; i++) {
      let s = 0;
      for (let a = 0; a < 6; a++) s += T[a][i] * kond.Q[a];
      QGlob[i] = s;
    }
    const dof = [3 * rud.ia, 3 * rud.ia + 1, 3 * rud.ia + 2, 3 * rud.ib, 3 * rud.ib + 1, 3 * rud.ib + 2];
    for (let i = 0; i < 6; i++) {
      F[dof[i]] += QGlob[i];
      for (let j = 0; j < 6; j++) K[dof[i]][dof[j]] += kGlob[i][j];
    }
    rudAdat.push({ rud, kLok, QLok, kond, T, dof });
  }

  // ---- kényszerek (Lagrange-multiplikátorok) ----
  const C = [];
  const kenyszerLeiro = [];
  const kotottDof = new Set();
  for (const t of m.tamaszok) {
    const d0 = 3 * t.ics;
    const ujSor = () => new Array(ndof).fill(0);
    if (t.tipus === "befogas") {
      for (const k of [0, 1, 2]) {
        const sor = ujSor(); sor[d0 + k] = 1; C.push(sor);
        kenyszerLeiro.push({ tamasz: t, komponens: k });
        kotottDof.add(d0 + k);
      }
    } else if (t.tipus === "csuklo") {
      for (const k of [0, 1]) {
        const sor = ujSor(); sor[d0 + k] = 1; C.push(sor);
        kenyszerLeiro.push({ tamasz: t, komponens: k });
        kotottDof.add(d0 + k);
      }
    } else {
      const [ex, ey] = t.irany;
      const sor = ujSor(); sor[d0] = ex; sor[d0 + 1] = ey; C.push(sor);
      kenyszerLeiro.push({ tamasz: t, komponens: "irany", irany: [ex, ey] });
    }
  }

  // merevség nélküli szabadságfokok (pl. csupa csuklóval kapcsolódó csomópont elfordulása)
  for (let i = 0; i < ndof; i++) {
    if (kotottDof.has(i)) continue;
    let max = 0;
    for (let j = 0; j < ndof; j++) max = Math.max(max, Math.abs(K[i][j]));
    if (max < 1e-12) {
      if (Math.abs(F[i]) > 1e-9) {
        hibak.push(
          `A(z) ${m.csomopontok[Math.floor(i / 3)].id} csomópont ${["vízszintes eltolódását", "függőleges eltolódását", "elfordulását"][i % 3]} semmi nem gátolja, mégis teher hat rá: a szerkezet mozgó (mechanizmus).`,
        );
      }
      const sor = new Array(ndof).fill(0); sor[i] = 1; C.push(sor);
      kenyszerLeiro.push({ tamasz: null, komponens: "szabad", dof: i });
    }
  }

  // ---- kibővített rendszer megoldása ----
  // A kényszersorokat a merevségi mátrix nagyságrendjéhez skálázzuk, különben
  // a nyeregpont-rendszer numerikusan rosszul kondicionált lesz.
  let merevsegSkala = 0;
  for (let i = 0; i < ndof; i++) merevsegSkala = Math.max(merevsegSkala, Math.abs(K[i][i]));
  if (!(merevsegSkala > 0)) merevsegSkala = 1;
  const Cs = C.map((sor) => sor.map((v) => v * merevsegSkala));
  const mDb = C.length;
  const A = nullMatrix(ndof + mDb, ndof + mDb);
  const b = new Array(ndof + mDb).fill(0);
  for (let i = 0; i < ndof; i++) {
    for (let j = 0; j < ndof; j++) A[i][j] = K[i][j];
    b[i] = F[i];
  }
  for (let r = 0; r < mDb; r++) {
    for (let j = 0; j < ndof; j++) {
      A[ndof + r][j] = Cs[r][j];
      A[j][ndof + r] = Cs[r][j];
    }
    b[ndof + r] = 0;
  }
  const megoldas = megoldRendszer(A, b);
  if (megoldas.szingularis) {
    hibak.push(
      "A szerkezet nem oldható meg: az egyenletrendszer szinguláris. Ez mozgó szerkezetet (mechanizmust) vagy hiányzó/rosszul felvett kényszert jelent — például három olyan görgőt vagy rudat, amelyek hatásvonala egy ponton megy át.",
    );
    return { ok: false, hibak, eltolodasok: null, reakciok: [], rudVegErok: [] };
  }
  const d = megoldas.x.slice(0, ndof);
  const lambda = megoldas.x.slice(ndof);

  // ---- reakciók: R = −Cᵀ λ ----
  const Rglob = new Array(ndof).fill(0);
  for (let r = 0; r < mDb; r++)
    for (let j = 0; j < ndof; j++) Rglob[j] -= Cs[r][j] * lambda[r];

  const reakciok = m.tamaszok.map((t) => {
    const d0 = 3 * t.ics;
    const kimenet = { tamasz: t.id, csomopont: m.csomopontok[t.ics].id, tipus: t.tipus };
    if (t.tipus === "befogas") {
      kimenet.Fx = Rglob[d0]; kimenet.Fy = Rglob[d0 + 1]; kimenet.M = Rglob[d0 + 2];
    } else if (t.tipus === "csuklo") {
      kimenet.Fx = Rglob[d0]; kimenet.Fy = Rglob[d0 + 1];
    } else {
      const [ex, ey] = t.irany;
      // az összes ilyen irányú multiplikátor együtt; egyszerű esetben egy
      const nagysag = Rglob[d0] * ex + Rglob[d0 + 1] * ey;
      kimenet.Fx = nagysag * ex; kimenet.Fy = nagysag * ey;
      kimenet.nagysag = nagysag;
      if (t.tipus === "rud") kimenet.S = nagysag; // húzott rúd: pozitív
    }
    return kimenet;
  });

  // ---- rúdvégerők lokális rendszerben ----
  const rudVegErok = rudAdat.map(({ rud, kLok, QLok, kond, T, dof }) => {
    const dGlob = dof.map((g) => d[g]);
    const dLok = new Array(6).fill(0);
    for (let i = 0; i < 6; i++) {
      let s = 0;
      for (let j = 0; j < 6; j++) s += T[i][j] * dGlob[j];
      dLok[i] = s;
    }
    // csuklós végek elfordulásának visszaszámítása: d_R = k_RR⁻¹ (Q_R − k_RK d_K)
    if (kond.R.length > 0) {
      const dK = kond.K.map((i) => dLok[i]);
      for (let a = 0; a < kond.R.length; a++) {
        let s = 0;
        for (let c = 0; c < kond.R.length; c++) {
          let belso = QLok[kond.R[c]];
          for (let j = 0; j < kond.K.length; j++) belso -= kond.kRK[c][j] * dK[j];
          s += kond.kRRinv[a][c] * belso;
        }
        dLok[kond.R[a]] = s;
      }
    }
    const p = new Array(6).fill(0);
    for (let i = 0; i < 6; i++) {
      let s = -QLok[i];
      for (let j = 0; j < 6; j++) s += kLok[i][j] * dLok[j];
      p[i] = s;
    }
    return { rud, p, dLok };
  });

  return { ok: hibak.length === 0, hibak, eltolodasok: d, reakciok, rudVegErok, Rglob };
}
