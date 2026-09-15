/**
 * Igénybevételi függvények egy rúd mentén, szakaszonként EGZAKT polinomként.
 *
 * Előjelszabályok a tankönyv 8.1.2.2. pontja szerint:
 *  – N pozitív, ha húzza a keresztmetszetet (kifelé mutat);
 *  – a pozitív nyíróerő iránya a pozitív normálerő irányának óramutató szerinti
 *    90°-os elforgatása (ez a rúd lokális −y iránya);
 *  – a hajlítónyomatéknál a tengely egyik oldala a pozitív; alapértelmezés
 *    szerint a kezdőponttól a végpont felé haladva a jobb oldal (vízszintes,
 *    balról jobbra rajzolt rúdnál az alsó oldal, ahogy a tankönyv javasolja).
 *
 * A bal oldali tartórész egyensúlyából, ahol p a rúdvégerők lokális vektora:
 *    N(x) = −( p₁ + Σ Pₓ + ∫₀ˣ qₓ dξ )
 *    V(x) =    p₂ + Σ P_y + ∫₀ˣ q_y dξ
 *    M(x) = −p₃ + p₂·x + Σ [ P_y (x−a) − M_a ] + ∫₀ˣ (x−ξ) q_y dξ
 */

import { osszead, skalarral, ertek, eltolt, szelsoertekek, gyokok, derivalt } from "./polinom.js";

const EPS = 1e-9;

/** Egy rúd igénybevételi függvényei szakaszonként. */
export function rudIgenybevetel(rud, p) {
  const L = rud.hossz;

  // töréspontok: rúdvégek, koncentrált terhek, megoszló terhek határai
  const hatarok = new Set([0, L]);
  for (const pt of rud.pontTerhek) hatarok.add(Math.min(L, Math.max(0, pt.a)));
  for (const m of rud.megoszlok) { hatarok.add(m.a1); hatarok.add(m.a2); }
  const x = [...hatarok].sort((a, b) => a - b).filter((v, i, t) => i === 0 || v - t[i - 1] > 1e-7);

  const szakaszok = [];
  for (let i = 0; i < x.length - 1; i++) {
    const x1 = x[i];
    const x2 = x[i + 1];
    const kozep = (x1 + x2) / 2;

    let N = [-p[0]];
    let V = [p[1]];
    let M = [-p[2], p[1]];   // −p₃ + p₂·x

    // koncentrált terhek a szakasztól balra
    for (const pt of rud.pontTerhek) {
      if (pt.a > kozep) continue;
      N = osszead(N, [-pt.Px]);
      V = osszead(V, [pt.Py]);
      if (pt.Py) M = osszead(M, skalarral([-pt.a, 1], pt.Py));  // P_y·(x − a)
      if (pt.Mz) M = osszead(M, [-pt.Mz]);
    }

    // megoszló terhek
    for (const m of rud.megoszlok) {
      if (m.a1 >= kozep) continue;                       // teljesen jobbra: nem számít
      const dL = m.a2 - m.a1;
      const mx = (m.qx2 - m.qx1) / dL;
      const my = (m.qy2 - m.qy1) / dL;
      if (m.a2 <= kozep) {
        // teljesen balra: az eredővel számolunk
        const Rx = m.qx1 * dL + (mx * dL * dL) / 2;
        const Ry = m.qy1 * dL + (my * dL * dL) / 2;
        // ∫ξ q dξ a [a1, a2] szakaszon (a nyomatékhoz)
        const S = m.qy1 * ((m.a2 * m.a2 - m.a1 * m.a1) / 2)
          + my * (((m.a2 - m.a1) ** 2) * (2 * m.a2 + m.a1) / 6);
        N = osszead(N, [-Rx]);
        V = osszead(V, [Ry]);
        M = osszead(M, [-S, Ry]);                        // R·x − ∫ξq dξ
      } else {
        // a szakasz a teher belsejében van: részleges integrál
        N = osszead(N, skalarral(eltolt(1, m.a1), -m.qx1));
        N = osszead(N, skalarral(eltolt(2, m.a1), -mx / 2));
        V = osszead(V, skalarral(eltolt(1, m.a1), m.qy1));
        V = osszead(V, skalarral(eltolt(2, m.a1), my / 2));
        M = osszead(M, skalarral(eltolt(2, m.a1), m.qy1 / 2));
        M = osszead(M, skalarral(eltolt(3, m.a1), my / 6));
      }
    }

    if (rud.pozitivOldal === 1) M = skalarral(M, -1);

    szakaszok.push({ x1, x2, N, V, M });
  }

  // szélsőértékek és nevezetes értékek
  const osszesitett = { N: { min: Infinity, max: -Infinity }, V: { min: Infinity, max: -Infinity }, M: { min: Infinity, max: -Infinity } };
  const helyek = { N: {}, V: {}, M: {} };
  for (const sz of szakaszok) {
    for (const jel of ["N", "V", "M"]) {
      const e = szelsoertekek(sz[jel], sz.x1, sz.x2);
      if (e.min.y < osszesitett[jel].min) { osszesitett[jel].min = e.min.y; helyek[jel].minX = e.min.x; }
      if (e.max.y > osszesitett[jel].max) { osszesitett[jel].max = e.max.y; helyek[jel].maxX = e.max.x; }
    }
  }

  // a nyomaték szélsőértéke ott van, ahol a nyíróerő zérus – ezt külön kiírjuk
  const Mszelso = [];
  for (const sz of szakaszok) {
    for (const xv of gyokok(sz.V, sz.x1, sz.x2)) {
      Mszelso.push({ x: xv, M: ertek(sz.M, xv), honnan: "V = 0" });
    }
  }

  return {
    rud: rud.id,
    hossz: L,
    szakaszok,
    szelso: {
      N: { min: osszesitett.N.min, max: osszesitett.N.max, ...helyek.N },
      V: { min: osszesitett.V.min, max: osszesitett.V.max, ...helyek.V },
      M: { min: osszesitett.M.min, max: osszesitett.M.max, ...helyek.M },
    },
    MszelsoHelyek: Mszelso,
  };
}

/** Az igénybevétel értéke egy adott lokális x helyen (a bal oldali határértékkel). */
export function ertekek(ig, x) {
  const sz = ig.szakaszok.find((s) => x >= s.x1 - EPS && x <= s.x2 + EPS) ?? ig.szakaszok[ig.szakaszok.length - 1];
  return { N: ertek(sz.N, x), V: ertek(sz.V, x), M: ertek(sz.M, x) };
}

/** Ugrások a szakaszhatárokon (koncentrált erő / nyomaték helyén). */
export function ugrasok(ig) {
  const ki = [];
  for (let i = 0; i < ig.szakaszok.length - 1; i++) {
    const bal = ig.szakaszok[i];
    const jobb = ig.szakaszok[i + 1];
    const x = bal.x2;
    const b = { N: ertek(bal.N, x), V: ertek(bal.V, x), M: ertek(bal.M, x) };
    const j = { N: ertek(jobb.N, x), V: ertek(jobb.V, x), M: ertek(jobb.M, x) };
    if (Math.abs(b.N - j.N) > 1e-7 || Math.abs(b.V - j.V) > 1e-7 || Math.abs(b.M - j.M) > 1e-7) {
      ki.push({ x, bal: b, jobb: j });
    }
  }
  return ki;
}

/** Mintavételezés rajzoláshoz (a görbült szakaszokon sűrűbben). */
export function mintak(ig, dbSzakaszonkent = 24) {
  const ki = [];
  for (const sz of ig.szakaszok) {
    const fok = sz.M.length - 1;
    const db = fok <= 1 ? 1 : dbSzakaszonkent;
    for (let i = 0; i <= db; i++) {
      const x = sz.x1 + ((sz.x2 - sz.x1) * i) / db;
      ki.push({ x, N: ertek(sz.N, x), V: ertek(sz.V, x), M: ertek(sz.M, x), szakaszHatar: i === 0 || i === db });
    }
  }
  return ki;
}
