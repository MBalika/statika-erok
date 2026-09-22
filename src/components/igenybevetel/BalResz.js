/**
 * A K keresztmetszettől balra (egy [xa, xb) tartományba) eső erők összegyűjtése
 * egy vízszintes tartó normalizált modelljéből (terhek + reakciók), és az
 * összegek tagjainak kiírása — a „Vágd el a tartót” felfedező és a
 * keresztmetszet-kalkulátor közös segédje.
 */

const EPS = 1e-6;

/** A tartó [xa, xb) darabjára ható erők (globális komponensekkel). */
export function reszErok(e, xa, xb) {
  const m = e.modell;
  const erok = []; // { x, Fx, Fy, M, nev, rajz }
  // csomóponti terhek
  m.csomopontiTerhek.forEach((t, i) => {
    const cs = m.csomopontok[i];
    if (cs.x < xa - EPS || cs.x >= xb - EPS) return;
    if (Math.abs(t.Fx) > EPS || Math.abs(t.Fy) > EPS) erok.push({ x: cs.x, Fx: t.Fx, Fy: t.Fy, M: 0, nev: `F(${cs.id})`, fajta: "ero" });
    if (Math.abs(t.M) > EPS) erok.push({ x: cs.x, Fx: 0, Fy: 0, M: t.M, nev: `M(${cs.id})`, fajta: "nyomatek" });
  });
  for (const r of m.rudak) {
    for (const p of r.pontTerhek) {
      const x = r.x1 + p.a * r.cos;
      if (x < xa - EPS || x >= xb - EPS) continue;
      if (Math.abs(p.Px) > EPS || Math.abs(p.Py) > EPS) erok.push({ x, Fx: p.Px * r.cos - p.Py * r.sin, Fy: p.Px * r.sin + p.Py * r.cos, M: 0, nev: "F", fajta: "ero" });
      if (Math.abs(p.Mz) > EPS) erok.push({ x, Fx: 0, Fy: 0, M: p.Mz, nev: "M", fajta: "nyomatek" });
    }
    for (const q of r.megoszlok) {
      const g1 = r.x1 + q.a1 * r.cos, g2 = r.x1 + q.a2 * r.cos;
      const a = Math.max(g1, xa), b = Math.min(g2, xb);
      if (b - a < EPS) continue;
      const qy = q.qy1; // egyenletes, vízszintes rúd
      erok.push({ x: (a + b) / 2, Fx: 0, Fy: qy * (b - a), M: 0, nev: "p", fajta: "megoszlo", a, b, qy, hossz: b - a });
    }
  }
  // reakciók
  for (const re of e.reakciok) {
    const cs = m.csomopontok.find((c) => c.id === re.csomopont);
    if (cs.x < xa - EPS || cs.x >= xb - EPS) continue;
    if (Math.abs(re.Fx ?? 0) > EPS) erok.push({ x: cs.x, Fx: re.Fx, Fy: 0, M: 0, nev: `${cs.id}_x`, fajta: "reakcio" });
    if (Math.abs(re.Fy ?? 0) > EPS) erok.push({ x: cs.x, Fx: 0, Fy: re.Fy, M: 0, nev: `${cs.id}_y`, fajta: "reakcio" });
    if (Math.abs(re.M ?? 0) > EPS) erok.push({ x: cs.x, Fx: 0, Fy: 0, M: re.M, nev: `M_${cs.id}`, fajta: "reakcioNyomatek" });
  }
  return erok;
}

/** Tagok összegzése és kiírása: „+ 22 − 12·1,5 …”. */
export function tagok(lista, fn) {
  const t = lista.flatMap(fn).filter((x) => x && Math.abs(x.ertek) > 1e-9);
  if (t.length === 0) return { szoveg: "0", osszeg: 0 };
  const osszeg = t.reduce((a, b) => a + b.ertek, 0);
  return { szoveg: kiir(t), osszeg, lista: t };
}

/** A tagok kiírása előjelekkel; szorzo = −1 esetén minden tag ellentett előjellel (pl. az ellentett irányú vetületi egyenlethez). */
export function kiir(lista, szorzo = 1) {
  if (!lista.length) return "0";
  return lista.map((x) => `${x.ertek * szorzo < 0 ? "-" : "+"} ${x.kif}`).join(" ").replace(/^\+ /, "");
}

