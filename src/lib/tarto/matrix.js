/**
 * Kis méretű lineáris algebra a tartószerkezeti megoldóhoz.
 * Minden mátrix sorok tömbje: [[a11, a12], [a21, a22]].
 */

export function nullMatrix(n, m = n) {
  return Array.from({ length: n }, () => new Array(m).fill(0));
}

export function szorzas(A, B) {
  const n = A.length;
  const k = B.length;
  const m = B[0].length;
  const C = nullMatrix(n, m);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      let s = 0;
      for (let t = 0; t < k; t++) s += A[i][t] * B[t][j];
      C[i][j] = s;
    }
  }
  return C;
}

export function transzponalt(A) {
  const n = A.length;
  const m = A[0].length;
  const T = nullMatrix(m, n);
  for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) T[j][i] = A[i][j];
  return T;
}

/**
 * Lineáris egyenletrendszer megoldása Gauss-eliminációval, SORSKÁLÁZOTT
 * részleges főelem-kiválasztással. A skálázás azért kell, mert a
 * Lagrange-multiplikátoros (nyeregpont-) rendszerben a merevségi és a
 * kényszersorok nagyságrendje erősen eltérhet.
 * Visszaad { x, szingularis }.
 */
export function megold(Abe, bbe) {
  const n = Abe.length;
  const A = Abe.map((sor) => [...sor]);
  const b = [...bbe];
  // soronkénti nagyságrend (implicit skálázás)
  const skala = A.map((sor) => {
    let m = 0;
    for (const v of sor) m = Math.max(m, Math.abs(v));
    return m;
  });
  if (skala.some((s) => s === 0)) return { x: null, szingularis: true };

  for (let k = 0; k < n; k++) {
    let p = k;
    let legjobb = Math.abs(A[k][k]) / skala[k];
    for (let i = k + 1; i < n; i++) {
      const ertek = Math.abs(A[i][k]) / skala[i];
      if (ertek > legjobb) { legjobb = ertek; p = i; }
    }
    if (legjobb < 1e-12) return { x: null, szingularis: true, szingularisSor: k };
    if (p !== k) {
      [A[p], A[k]] = [A[k], A[p]];
      [b[p], b[k]] = [b[k], b[p]];
      [skala[p], skala[k]] = [skala[k], skala[p]];
    }
    for (let i = k + 1; i < n; i++) {
      const f = A[i][k] / A[k][k];
      if (f === 0) continue;
      for (let j = k; j < n; j++) A[i][j] -= f * A[k][j];
      b[i] -= f * b[k];
    }
  }
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let s = b[i];
    for (let j = i + 1; j < n; j++) s -= A[i][j] * x[j];
    x[i] = s / A[i][i];
  }
  return { x, szingularis: false };
}

/** Kis (1×1, 2×2) mátrix inverze – a csuklós végek kondenzálásához elég. */
export function inverz(A) {
  const n = A.length;
  if (n === 1) return [[1 / A[0][0]]];
  if (n === 2) {
    const d = A[0][0] * A[1][1] - A[0][1] * A[1][0];
    return [
      [A[1][1] / d, -A[0][1] / d],
      [-A[1][0] / d, A[0][0] / d],
    ];
  }
  // általános eset: Gauss–Jordan
  const M = A.map((sor, i) => [...sor, ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))]);
  for (let k = 0; k < n; k++) {
    let p = k;
    for (let i = k + 1; i < n; i++) if (Math.abs(M[i][k]) > Math.abs(M[p][k])) p = i;
    [M[p], M[k]] = [M[k], M[p]];
    const pivot = M[k][k];
    for (let j = 0; j < 2 * n; j++) M[k][j] /= pivot;
    for (let i = 0; i < n; i++) {
      if (i === k) continue;
      const f = M[i][k];
      if (f === 0) continue;
      for (let j = 0; j < 2 * n; j++) M[i][j] -= f * M[k][j];
    }
  }
  return M.map((sor) => sor.slice(n));
}

/** A mátrix rangja (a statikai határozottság vizsgálatához). */
export function rang(Abe, tures = 1e-9) {
  const A = Abe.map((sor) => [...sor]);
  const n = A.length;
  const m = A[0]?.length ?? 0;
  let r = 0;
  let skala = 0;
  for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) skala = Math.max(skala, Math.abs(A[i][j]));
  const hatar = Math.max(skala, 1) * tures;
  for (let oszlop = 0; oszlop < m && r < n; oszlop++) {
    let p = r;
    for (let i = r + 1; i < n; i++) if (Math.abs(A[i][oszlop]) > Math.abs(A[p][oszlop])) p = i;
    if (Math.abs(A[p][oszlop]) < hatar) continue;
    [A[p], A[r]] = [A[r], A[p]];
    for (let i = r + 1; i < n; i++) {
      const f = A[i][oszlop] / A[r][oszlop];
      for (let j = oszlop; j < m; j++) A[i][j] -= f * A[r][j];
    }
    r++;
  }
  return r;
}
