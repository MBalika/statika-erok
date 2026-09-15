/**
 * Polinomok együtthatós alakban: [c0, c1, c2, c3] ≙ c0 + c1·x + c2·x² + c3·x³.
 * Az igénybevételi függvények szakaszonként polinomok, ezért így egzaktak
 * (nem mintavételezünk), és a szélsőértékek helye is pontosan számolható.
 */

export function osszead(a, b) {
  const n = Math.max(a.length, b.length);
  const c = new Array(n).fill(0);
  for (let i = 0; i < n; i++) c[i] = (a[i] ?? 0) + (b[i] ?? 0);
  return c;
}

export function skalarral(a, k) {
  return a.map((c) => c * k);
}

export function ertek(a, x) {
  let s = 0;
  for (let i = a.length - 1; i >= 0; i--) s = s * x + a[i];
  return s;
}

export function derivalt(a) {
  if (a.length <= 1) return [0];
  return a.slice(1).map((c, i) => c * (i + 1));
}

/** k·(x − a)^n kifejtve x hatványai szerint. */
export function eltolt(n, a, k = 1) {
  // binomiális tétel: (x-a)^n = Σ C(n,i) x^i (-a)^(n-i)
  const c = new Array(n + 1).fill(0);
  let binom = 1;
  for (let i = n; i >= 0; i--) {
    c[i] = k * binom * Math.pow(-a, n - i);
    binom = (binom * i) / (n - i + 1);
  }
  return c;
}

/** Egy polinom valós gyökei a [x1, x2] szakaszon (legfeljebb harmadfokúra). */
export function gyokok(a, x1, x2) {
  const c = [...a];
  while (c.length > 1 && Math.abs(c[c.length - 1]) < 1e-12) c.pop();
  const fok = c.length - 1;
  const ki = [];
  const hozzaad = (x) => {
    if (x >= x1 - 1e-9 && x <= x2 + 1e-9 && !ki.some((y) => Math.abs(y - x) < 1e-7)) {
      ki.push(Math.min(x2, Math.max(x1, x)));
    }
  };
  if (fok <= 0) return ki;
  if (fok === 1) {
    hozzaad(-c[0] / c[1]);
    return ki;
  }
  if (fok === 2) {
    const [C, B, A] = c;
    const d = B * B - 4 * A * C;
    if (d >= 0) {
      const gy = Math.sqrt(d);
      hozzaad((-B + gy) / (2 * A));
      hozzaad((-B - gy) / (2 * A));
    }
    return ki;
  }
  // harmadfok: felezéssel, a derivált gyökei mentén szakaszolva
  const hatarok = [x1, ...gyokok(derivalt(c), x1, x2).sort((p, q) => p - q), x2];
  for (let i = 0; i < hatarok.length - 1; i++) {
    let lo = hatarok[i];
    let hi = hatarok[i + 1];
    let flo = ertek(c, lo);
    let fhi = ertek(c, hi);
    if (Math.abs(flo) < 1e-10) { hozzaad(lo); continue; }
    if (flo * fhi > 0) continue;
    for (let it = 0; it < 80; it++) {
      const kozep = (lo + hi) / 2;
      const f = ertek(c, kozep);
      if (flo * f <= 0) { hi = kozep; fhi = f; } else { lo = kozep; flo = f; }
    }
    hozzaad((lo + hi) / 2);
  }
  return ki;
}

/** Egy szakaszon a polinom szélsőértékei (végpontok + belső stacionárius pontok). */
export function szelsoertekek(a, x1, x2) {
  const helyek = [x1, x2, ...gyokok(derivalt(a), x1, x2)];
  let min = { x: x1, y: ertek(a, x1) };
  let max = { x: x1, y: ertek(a, x1) };
  for (const x of helyek) {
    const y = ertek(a, x);
    if (y < min.y) min = { x, y };
    if (y > max.y) max = { x, y };
  }
  return { min, max };
}
