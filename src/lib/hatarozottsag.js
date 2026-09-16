/**
 * Statikai határozottság — a 8. modul számítómagja (tiszta JS, nincs React).
 *
 * Két réteg:
 *   1. SZÁMLÁLÁS (a tankönyv 7.3.1): egyenletek (e) és ismeretlenek (i) száma
 *      testekből, külső kényszerekből, belső kapcsolatokból; rácsos tartón e = 2c, i = r + k.
 *   2. KINEMATIKA (a „szükséges, de nem elégséges” feltétel tényleges eldöntése):
 *      a merev testek kis elmozdulásaira felírt kényszer-egyenletek mátrixának rangja.
 *        szabad mozgások száma  = szabadságfokok − rang   (mechanizmus, ha > 0)
 *        fölös kényszerek száma = kényszerek − rang        (határozatlanság foka, ha > 0)
 *      A nulltér egy vektora maga a mechanizmus mozgása — ezt animálják a felfedezők.
 *
 * Mértékegység: m; x jobbra, y felfelé; a forgás az óramutatóval ellentétesen pozitív.
 * Egy test kis elmozdulása (u_x, u_y, ω): a P = (x, y) pont elmozdulása (u_x − ω·y, u_y + ω·x).
 */

const EPS = 1e-9;
const FOK = Math.PI / 180;

/* ============================================================
   1. Számlálás
   ============================================================ */

/** A négy síkbeli külső kényszer fokszáma (a tankönyv 4.1). */
export const FOKSZAM = { gorgo: 1, rud: 1, csuklo: 2, befogas: 3, csuszka: 2 };

export const KENYSZER_NEV = { gorgo: "görgő", rud: "támasztórúd", csuklo: "csukló", befogas: "befogás", csuszka: "csúszka" };

/**
 * Egyenletek és ismeretlenek száma egy síkbeli szerkezeten.
 *   testek         – a merev testek száma
 *   tamaszok       – külső kényszerek: ["csuklo", "gorgo", …] vagy [{ tipus }]
 *   belsoCsuklok   – belső csuklók: [2, 2, 3, …] (hány testet kapcsol össze) vagy egy szám (mind kéttestes)
 *   belsoRudak     – a testeket összekötő rudak száma (fokszám 1)
 *   terheltCsuklok – hány belső csuklóra hat közvetlenül teher (a tankönyv 5.3: a csukló külön „test”, +2 egyenlet, +2 ismeretlen)
 *   terben         – true: testenként 6 egyenlet (a kényszereket ilyenkor a fokszámukkal add meg)
 */
export function szamlal({ testek = 1, tamaszok = [], belsoCsuklok = [], belsoRudak = 0, terheltCsuklok = 0, terben = false } = {}) {
  const tamaszLista = tamaszok.map((t) => (typeof t === "string" ? { tipus: t } : t));
  const tamaszFok = tamaszLista.reduce((s, t) => s + (t.fokszam ?? FOKSZAM[t.tipus] ?? 0), 0);
  const csuklok = typeof belsoCsuklok === "number" ? Array.from({ length: belsoCsuklok }, () => 2) : belsoCsuklok;
  // egy belső csukló annyiszor kettővel növeli i-t, ahány testet kapcsol, MÍNUSZ egy (a kapcsolati erőt csak egyszer vesszük);
  // ha a csuklót külön elkülönítjük (terhelt csukló), akkor minden testhez 2 ismeretlen és a csuklóra 2 egyenlet jut
  const csukloFok = csuklok.reduce((s, n) => s + 2 * (n - 1), 0);
  const belsoFok = csukloFok + belsoRudak + 2 * terheltCsuklok;
  const testEgyenlet = terben ? 6 : 3;
  const e = testEgyenlet * testek + 2 * terheltCsuklok;
  const i = tamaszFok + belsoFok;
  return { e, i, tamaszFok, belsoFok, csukloFok, belsoRudak, testek, testEgyenlet, kulonbseg: i - e, elsodleges: elsodlegesItelet(e, i) };
}

/** Rácsos tartó számlálása: e = 2c, i = r + k (térben 3c). */
export function racsosSzamlal({ r, k, c, terben = false }) {
  const e = (terben ? 3 : 2) * c;
  const i = r + k;
  return { e, i, r, k, c, kulonbseg: i - e, elsodleges: elsodlegesItelet(e, i) };
}

/**
 * A számlálásból levonható elsődleges következtetés (a tankönyv 7.3.1):
 *   e = i → LEHET határozott (szükséges, de nem elégséges);
 *   e > i → biztosan nem határozott: van szabad mozgás (túlhatározott / mechanizmus), legalább e − i;
 *   e < i → biztosan nem határozott: van fölös kényszer (határozatlan), legalább i − e.
 */
export function elsodlegesItelet(e, i) {
  if (e === i) return { kod: "lehetHatarozott", szoveg: "e = i: lehet határozott — de csak akkor, ha az elrendezés nem kritikus." };
  if (e > i) return { kod: "biztosMozog", szoveg: `e > i: legalább ${e - i} szabad mozgás — a szerkezet biztosan nem tartó (túlhatározott, mechanizmus).` };
  return { kod: "biztosHatarozatlan", szoveg: `e < i: legalább ${i - e} fölös kényszer — a szerkezet biztosan nem határozott (határozatlan).` };
}

/* ============================================================
   Lineáris algebra: rang és nulltér (redukált lépcsős alak)
   ============================================================ */

/** Gauss–Jordan elimináció részleges főelem-kiválasztással; { rang, pivotOszlopok, R (RREF) }. */
export function rref(A, tures = 1e-9) {
  const R = A.map((sor) => sor.slice());
  const m = R.length;
  const n = m ? R[0].length : 0;
  const pivotOszlopok = [];
  let sor = 0;
  for (let osz = 0; osz < n && sor < m; osz++) {
    let legjobb = sor;
    for (let r = sor + 1; r < m; r++) if (Math.abs(R[r][osz]) > Math.abs(R[legjobb][osz])) legjobb = r;
    if (Math.abs(R[legjobb][osz]) < tures) continue;
    [R[sor], R[legjobb]] = [R[legjobb], R[sor]];
    const p = R[sor][osz];
    for (let j = 0; j < n; j++) R[sor][j] /= p;
    for (let r = 0; r < m; r++) {
      if (r === sor) continue;
      const f = R[r][osz];
      if (Math.abs(f) < tures) continue;
      for (let j = 0; j < n; j++) R[r][j] -= f * R[sor][j];
    }
    pivotOszlopok.push(osz);
    sor++;
  }
  return { rang: pivotOszlopok.length, pivotOszlopok, R };
}

/** A · v = 0 megoldásainak bázisa (nulltér). */
export function nullter(A, n, tures = 1e-9) {
  if (!A.length) return Array.from({ length: n }, (_, k) => Array.from({ length: n }, (_, j) => (j === k ? 1 : 0)));
  const { rang, pivotOszlopok, R } = rref(A, tures);
  const szabad = [];
  for (let j = 0; j < n; j++) if (!pivotOszlopok.includes(j)) szabad.push(j);
  return szabad.map((s) => {
    const v = new Array(n).fill(0);
    v[s] = 1;
    pivotOszlopok.forEach((p, r) => {
      v[p] = -R[r][s];
    });
    // normálás: a legnagyobb komponens 1
    const max = Math.max(...v.map((x) => Math.abs(x)));
    return v.map((x) => x / (max || 1));
  }).concat(rang === 0 && !szabad.length ? [] : []);
}

/* ============================================================
   2. Merev testek kinematikája
   ============================================================ */

/**
 * Egy összetett síkbeli szerkezet kinematikai vizsgálata.
 *   testek     – a merev testek száma (0 … testek−1 indexekkel)
 *   kenyszerek – lista:
 *     { tipus: "gorgo",   test, x, y, szog }           // egy irányú eltolódás-gátlás; szog: a gátolt (reakció-) irány fokban, 90 = függőleges
 *     { tipus: "rud",     test, x, y, irany:[dx,dy] }  // földhöz kötött rúd (ugyanaz, mint a görgő, a rúd irányával)
 *     { tipus: "csuklo",  test, x, y }                 // külső csukló
 *     { tipus: "befogas", test, x, y }                 // külső befogás
 *     { tipus: "belsoCsuklo", testek:[a,b], x, y }     // belső csukló két test között (több testnél több bejegyzés, párokban)
 *     { tipus: "belsoRud", testA, xA, yA, testB, xB, yB } // két testet összekötő rúd
 *     { tipus: "belsoBefogas", testek:[a,b], x, y }    // merev kapcsolat (3 egyenlet) — testek összeolvasztásához
 * Eredmény: { e, i, rang, szabad, folos, tipus, kritikus, mozgasok: [v…], sorok }
 *   e = 3·testek, i = a kényszerek fokszámának összege, szabad = e − rang, folos = i − rang
 */
export function kinematika({ testek, kenyszerek }) {
  const N = 3 * (Array.isArray(testek) ? testek.length : testek); // a rajzolható szerkezet-leírás (testek tömb) is átadható
  const sorok = [];
  const cimkek = [];
  const pontSor = (test, x, y, nx, ny) => {
    const sor = new Array(N).fill(0);
    sor[3 * test] += nx;
    sor[3 * test + 1] += ny;
    sor[3 * test + 2] += -nx * y + ny * x;
    return sor;
  };
  const osszead = (a, b, elojel = 1) => a.map((v, j) => v + elojel * b[j]);
  let i = 0;
  for (const k of kenyszerek) {
    if (k.tipus === "gorgo" || k.tipus === "rud") {
      let nx, ny;
      if (k.tipus === "gorgo") {
        const sz = (k.szog ?? 90) * FOK;
        nx = Math.cos(sz);
        ny = Math.sin(sz);
      } else {
        const h = Math.hypot(k.irany[0], k.irany[1]) || 1;
        nx = k.irany[0] / h;
        ny = k.irany[1] / h;
      }
      sorok.push(pontSor(k.test, k.x, k.y, nx, ny));
      cimkek.push({ ...k, fokszam: 1 });
      i += 1;
    } else if (k.tipus === "csuklo") {
      sorok.push(pontSor(k.test, k.x, k.y, 1, 0), pontSor(k.test, k.x, k.y, 0, 1));
      cimkek.push({ ...k, fokszam: 2 });
      i += 2;
    } else if (k.tipus === "befogas") {
      const forg = new Array(N).fill(0);
      forg[3 * k.test + 2] = 1;
      sorok.push(pontSor(k.test, k.x, k.y, 1, 0), pontSor(k.test, k.x, k.y, 0, 1), forg);
      cimkek.push({ ...k, fokszam: 3 });
      i += 3;
    } else if (k.tipus === "belsoCsuklo") {
      const [a, b] = k.testek;
      sorok.push(osszead(pontSor(a, k.x, k.y, 1, 0), pontSor(b, k.x, k.y, 1, 0), -1), osszead(pontSor(a, k.x, k.y, 0, 1), pontSor(b, k.x, k.y, 0, 1), -1));
      cimkek.push({ ...k, fokszam: 2 });
      i += 2;
    } else if (k.tipus === "belsoBefogas") {
      const [a, b] = k.testek;
      const forg = new Array(N).fill(0);
      forg[3 * a + 2] = 1;
      forg[3 * b + 2] = -1;
      sorok.push(osszead(pontSor(a, k.x, k.y, 1, 0), pontSor(b, k.x, k.y, 1, 0), -1), osszead(pontSor(a, k.x, k.y, 0, 1), pontSor(b, k.x, k.y, 0, 1), -1), forg);
      cimkek.push({ ...k, fokszam: 3 });
      i += 3;
    } else if (k.tipus === "belsoRud") {
      const dx = k.xB - k.xA;
      const dy = k.yB - k.yA;
      const h = Math.hypot(dx, dy) || 1;
      const ex = dx / h;
      const ey = dy / h;
      // e · (u_B − u_A) = 0
      sorok.push(osszead(pontSor(k.testB, k.xB, k.yB, ex, ey), pontSor(k.testA, k.xA, k.yA, ex, ey), -1));
      cimkek.push({ ...k, fokszam: 1 });
      i += 1;
    }
  }
  const e = N;
  const { rang } = rref(sorok);
  const szabad = N - rang;
  const folos = i - rang;
  const mozgasok = szabad > 0 ? nullter(sorok, N) : [];
  return { e, i, rang, szabad, folos, ...osztalyoz(e, i, szabad, folos), mozgasok, sorok, kenyszerek: cimkek };
}

/** A négy tankönyvi kategória a rangvizsgálat alapján. */
export function osztalyoz(e, i, szabad, folos) {
  let tipus;
  if (szabad === 0 && folos === 0) tipus = "hatarozott";
  else if (szabad === 0) tipus = "hatarozatlan";
  else if (folos === 0) tipus = "tulhatarozott";
  else tipus = "hatarozatlanEsTulhatarozott";
  const kritikus = i >= e && szabad > 0; // a számlálás nem jelezné, az elrendezés hibás
  return { tipus, kritikus, nev: TIPUS_NEV[tipus], rovid: TIPUS_ROVID[tipus] };
}

export const TIPUS_NEV = {
  hatarozott: "statikailag határozott tartó",
  hatarozatlan: "statikailag határozatlan tartó",
  tulhatarozott: "statikailag túlhatározott szerkezet (mechanizmus)",
  hatarozatlanEsTulhatarozott: "statikailag határozatlan és túlhatározott szerkezet",
};
export const TIPUS_ROVID = { hatarozott: "határozott", hatarozatlan: "határozatlan", tulhatarozott: "mozog", hatarozatlanEsTulhatarozott: "mozog + fölös" };

/** Egy test (ux, uy, ω) elmozdulásával a (x, y) pont eltolódása. */
export function pontElmozdulas(v, test, x, y) {
  const ux = v[3 * test] ?? 0;
  const uy = v[3 * test + 1] ?? 0;
  const w = v[3 * test + 2] ?? 0;
  return { dx: ux - w * y, dy: uy + w * x, w };
}

/* ============================================================
   Geometriai ellenőrzések (a kritikus elrendezések felismerése szavakkal)
   ============================================================ */

/** Hatásvonal: { x, y, ex, ey } (pont + irány). */
function metszes(a, b) {
  const det = a.ex * b.ey - a.ey * b.ex;
  if (Math.abs(det) < 1e-9) return null;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const t = (dx * b.ey - dy * b.ex) / det;
  return { x: a.x + t * a.ex, y: a.y + t * a.ey };
}

function parhuzamos(a, b, tures = 1e-6) {
  return Math.abs(a.ex * b.ey - a.ey * b.ex) < tures;
}

/**
 * Három egy-fokszámú kényszer (görgő/rúd) hatásvonalának vizsgálata egy testen.
 * Visszaad: { parhuzamos, kozosPont, kritikus, det, indok }
 *   det – a kényszer-mátrix determinánsa (0 = kritikus); normált 0…1 értékben `mertek` is
 */
export function haromHatasvonal(vonalak, tures = 1e-6) {
  const [a, b, c] = vonalak.map((v) => {
    const h = Math.hypot(v.ex, v.ey) || 1;
    return { x: v.x, y: v.y, ex: v.ex / h, ey: v.ey / h };
  });
  const mindParhuzamos = parhuzamos(a, b, tures) && parhuzamos(b, c, tures);
  let kozosPont = null;
  if (!mindParhuzamos) {
    const p = metszes(a, b) ?? metszes(b, c) ?? metszes(a, c);
    if (p) {
      const tav = (v) => Math.abs((p.x - v.x) * v.ey - (p.y - v.y) * v.ex);
      if (tav(a) < 1e-6 + tures && tav(b) < 1e-6 + tures && tav(c) < 1e-6 + tures) kozosPont = p;
    }
  }
  // determináns: a három (ex, ey, x·ey − y·ex) sor
  const s = [a, b, c].map((v) => [v.ex, v.ey, v.x * v.ey - v.y * v.ex]);
  const det = s[0][0] * (s[1][1] * s[2][2] - s[1][2] * s[2][1]) - s[0][1] * (s[1][0] * s[2][2] - s[1][2] * s[2][0]) + s[0][2] * (s[1][0] * s[2][1] - s[1][1] * s[2][0]);
  const meret = Math.max(1, ...[a, b, c].map((v) => Math.hypot(v.x, v.y)));
  const mertek = Math.min(1, Math.abs(det) / meret);
  const kritikus = mindParhuzamos || kozosPont !== null || Math.abs(det) < tures * meret;
  const indok = mindParhuzamos
    ? "a három hatásvonal párhuzamos: a rájuk merőleges irányban a test szabadon eltolódhat"
    : kozosPont
      ? "a három hatásvonal egy ponton megy át: e pont körül a test szabadon elfordulhat"
      : kritikus
        ? "a három hatásvonal (közelítőleg) egy ponton megy át vagy párhuzamos"
        : "a három hatásvonal páronként különböző pontokban metszi egymást — az elrendezés jó";
  return { parhuzamos: mindParhuzamos, kozosPont, kritikus, det, mertek, indok };
}

/** Három pont egy egyenesbe esik-e (a háromcsuklós tartó kritikus esete). */
export function egyEgyenesen(p1, p2, p3, tures = 1e-6) {
  const ter = (p2.x - p1.x) * (p3.y - p1.y) - (p2.y - p1.y) * (p3.x - p1.x);
  const meret = Math.max(1, Math.hypot(p2.x - p1.x, p2.y - p1.y), Math.hypot(p3.x - p1.x, p3.y - p1.y));
  return { egyEgyenesen: Math.abs(ter) < tures * meret, ter };
}

/**
 * Egy merev test három egy-fokszámú kényszerére a reakciók egy adott teherre
 * (Fx, Fy, M az origóra): G·r = −F. Ha a determináns nulla, nincs (egyértelmű) megoldás.
 */
export function haromReakcio(vonalak, teher) {
  const s = vonalak.map((v) => {
    const h = Math.hypot(v.ex, v.ey) || 1;
    const ex = v.ex / h;
    const ey = v.ey / h;
    return [ex, ey, v.x * ey - v.y * ex];
  });
  // egyenletek: Σ r_j ex_j = −Fx; Σ r_j ey_j = −Fy; Σ r_j (x ey − y ex)_j = −M
  const A = [
    [s[0][0], s[1][0], s[2][0]],
    [s[0][1], s[1][1], s[2][1]],
    [s[0][2], s[1][2], s[2][2]],
  ];
  const b = [-teher.Fx, -teher.Fy, -teher.M];
  const det = A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) - A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) + A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0]);
  if (Math.abs(det) < 1e-12) return { ok: false, det, r: null };
  const cr = (M) => M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1]) - M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0]) + M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0]);
  const csere = (j) => A.map((sor, r) => sor.map((v, c) => (c === j ? b[r] : v)));
  return { ok: true, det, r: [cr(csere(0)) / det, cr(csere(1)) / det, cr(csere(2)) / det] };
}

/* ============================================================
   3. Rácsos tartó kinematikája (csomópontonként 2 szabadságfok)
   ============================================================ */

/**
 * modell: { csomopontok:[{id,x,y}], rudak:[{id,a,b}], tamaszok:[{csomopont, tipus:"csuklo"|"gorgo", szog}] }
 * Eredmény: { c, r, k, e: 2c, i: r + k, rang, szabad, folos, tipus, kritikus, mozgasok: [{ [id]: {dx, dy} }] }
 */
export function racsKinematika(modell) {
  const cs = modell.csomopontok.map((c, idx) => ({ id: String(c.id), x: Number(c.x), y: Number(c.y), idx }));
  const idx = new Map(cs.map((c) => [c.id, c.idx]));
  const N = 2 * cs.length;
  const sorok = [];
  let k = 0;
  for (const r of modell.rudak) {
    const a = cs[idx.get(String(r.a))];
    const b = cs[idx.get(String(r.b))];
    if (!a || !b) continue;
    const h = Math.hypot(b.x - a.x, b.y - a.y) || 1;
    const ex = (b.x - a.x) / h;
    const ey = (b.y - a.y) / h;
    const sor = new Array(N).fill(0);
    sor[2 * a.idx] -= ex;
    sor[2 * a.idx + 1] -= ey;
    sor[2 * b.idx] += ex;
    sor[2 * b.idx + 1] += ey;
    sorok.push(sor);
  }
  for (const t of modell.tamaszok ?? []) {
    const c = cs[idx.get(String(t.csomopont))];
    if (!c) continue;
    if (t.tipus === "csuklo") {
      const s1 = new Array(N).fill(0);
      s1[2 * c.idx] = 1;
      const s2 = new Array(N).fill(0);
      s2[2 * c.idx + 1] = 1;
      sorok.push(s1, s2);
      k += 2;
    } else {
      const sz = (t.szog ?? 90) * FOK;
      const s = new Array(N).fill(0);
      s[2 * c.idx] = Math.cos(sz);
      s[2 * c.idx + 1] = Math.sin(sz);
      sorok.push(s);
      k += 1;
    }
  }
  const r = modell.rudak.length;
  const e = N;
  const i = r + k;
  const { rang } = rref(sorok);
  const szabad = N - rang;
  const folos = i - rang;
  const mozgasok = (szabad > 0 ? nullter(sorok, N) : []).map((v) => Object.fromEntries(cs.map((c) => [c.id, { dx: v[2 * c.idx], dy: v[2 * c.idx + 1] }])));
  return { c: cs.length, r, k, e, i, rang, szabad, folos, ...osztalyoz(e, i, szabad, folos), mozgasok };
}

/* ============================================================
   4. Szöveges ítélet (a kalkulátorhoz és a játékhoz)
   ============================================================ */

export function iteletSzoveg({ e, i, szabad, folos, tipus }) {
  const reszek = [];
  reszek.push(`Egyenletek: e = ${e}, ismeretlenek: i = ${i}.`);
  if (tipus === "hatarozott") reszek.push("A rang teljes: minden mozgás gátolt, és egyetlen kényszer sem fölös — statikailag határozott tartó.");
  else if (tipus === "hatarozatlan") reszek.push(`Minden mozgás gátolt, de ${folos} kényszer fölös: ${folos}-szeresen statikailag határozatlan tartó — a reakciók csak a merevség (alakváltozás) figyelembevételével számíthatók.`);
  else if (tipus === "tulhatarozott") reszek.push(`${szabad} szabad mozgás maradt: a szerkezet mechanizmus (statikailag túlhatározott), nem tartó.`);
  else reszek.push(`${szabad} szabad mozgás ÉS ${folos} fölös kényszer egyszerre: határozatlan és túlhatározott szerkezet — a számlálás${i === e ? " (e = i)" : ""} nem jelezte, az elrendezés kritikus.`);
  return reszek.join(" ");
}

/** Görgő reakció-iránya a gördülési sík hajlásából (a tankönyv: a reakció a síkra merőleges). */
export function gorgoIrany(sikHajlasFok) {
  return sikHajlasFok + 90;
}

/* ============================================================
   5. Rajzolható szerkezet-leírás → a tartó-számítómag (src/lib/tarto) modellje
   ============================================================
 * szerkezet = {
 *   testek:     [{ pontok: [[x, y], …] }],       // merev testek töröttvonala (m)
 *   kenyszerek: [ … a kinematika() bemenete … ],  // gorgo | rud | csuklo | befogas | belsoCsuklo | belsoRud
 *   terhek:     [{ test, x, y, Fx, Fy }],          // csomóponti erők (kN)
 * }
 * A belső csuklót annak a testnek a rúdvégén jelöljük csuklósnak, amelyiknek a pont a végpontja.
 */
export function tartoModell(szerkezet) {
  const kulcs = (x, y) => `${Math.round(x * 1000) / 1000},${Math.round(y * 1000) / 1000}`;
  const csomopontok = [];
  const idMap = new Map();
  const csomopont = (x, y) => {
    const k = kulcs(x, y);
    if (!idMap.has(k)) {
      const id = `P${csomopontok.length + 1}`;
      idMap.set(k, id);
      csomopontok.push({ id, x, y });
    }
    return idMap.get(k);
  };
  // a testek töröttvonalait a rajtuk fekvő kényszer- és teherpontokban felosztjuk
  const testPontok = szerkezet.testek.map((t) => t.pontok.map(([x, y]) => [x, y]));
  const beszur = (test, x, y) => {
    const p = testPontok[test];
    for (let i = 0; i < p.length; i++) if (kulcs(p[i][0], p[i][1]) === kulcs(x, y)) return;
    for (let i = 0; i < p.length - 1; i++) {
      const [x1, y1] = p[i];
      const [x2, y2] = p[i + 1];
      const L = Math.hypot(x2 - x1, y2 - y1) || 1;
      const t = ((x - x1) * (x2 - x1) + (y - y1) * (y2 - y1)) / (L * L);
      const tav = Math.abs((x - x1) * (y2 - y1) - (y - y1) * (x2 - x1)) / L;
      if (t > 1e-6 && t < 1 - 1e-6 && tav < 1e-6) {
        p.splice(i + 1, 0, [x, y]);
        return;
      }
    }
  };
  const csuklosVegek = new Map(); // "test|kulcs" → true
  for (const k of szerkezet.kenyszerek) {
    if (k.tipus === "belsoCsuklo") {
      const [a, b] = k.testek;
      beszur(a, k.x, k.y);
      beszur(b, k.x, k.y);
      const vegpont = (t) => {
        const p = testPontok[t];
        return kulcs(p[0][0], p[0][1]) === kulcs(k.x, k.y) || kulcs(p[p.length - 1][0], p[p.length - 1][1]) === kulcs(k.x, k.y);
      };
      const melyik = vegpont(b) ? b : a;
      csuklosVegek.set(`${melyik}|${kulcs(k.x, k.y)}`, true);
    } else if (k.tipus === "belsoRud") {
      beszur(k.testA, k.xA, k.yA);
      beszur(k.testB, k.xB, k.yB);
    } else if (k.test !== undefined) beszur(k.test, k.x, k.y);
  }
  for (const t of szerkezet.terhek ?? []) beszur(t.test, t.x, t.y);

  const rudak = [];
  testPontok.forEach((p, test) => {
    for (let i = 0; i < p.length - 1; i++) {
      const a = csomopont(p[i][0], p[i][1]);
      const b = csomopont(p[i + 1][0], p[i + 1][1]);
      rudak.push({ id: `T${test + 1}_${i + 1}`, a, b, csukloA: !!csuklosVegek.get(`${test}|${kulcs(p[i][0], p[i][1])}`), csukloB: !!csuklosVegek.get(`${test}|${kulcs(p[i + 1][0], p[i + 1][1])}`) });
    }
  });
  const tamaszok = [];
  for (const k of szerkezet.kenyszerek) {
    if (k.tipus === "gorgo") tamaszok.push({ csomopont: csomopont(k.x, k.y), tipus: "gorgo", szog: k.szog ?? 90 });
    else if (k.tipus === "rud") tamaszok.push({ csomopont: csomopont(k.x, k.y), tipus: "rud", irany: k.irany });
    else if (k.tipus === "csuklo" || k.tipus === "befogas") tamaszok.push({ csomopont: csomopont(k.x, k.y), tipus: k.tipus });
    else if (k.tipus === "belsoRud") rudak.push({ id: `S${rudak.length + 1}`, a: csomopont(k.xA, k.yA), b: csomopont(k.xB, k.yB), csukloA: true, csukloB: true });
  }
  const terhek = (szerkezet.terhek ?? []).map((t) => ({ fajta: "csomopontiEro", csomopont: csomopont(t.x, t.y), Fx: t.Fx ?? 0, Fy: t.Fy ?? 0 }));
  return { csomopontok, rudak, tamaszok, terhek };
}

/** A szerkezet befoglaló téglalapja (a kényszerek rúdjait is beleértve). */
export function szerkezetBefoglalo(szerkezet) {
  let xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity;
  const p = (x, y) => {
    xMin = Math.min(xMin, x); xMax = Math.max(xMax, x); yMin = Math.min(yMin, y); yMax = Math.max(yMax, y);
  };
  for (const t of szerkezet.testek) for (const [x, y] of t.pontok) p(x, y);
  for (const k of szerkezet.kenyszerek) {
    if (k.tipus === "rud") {
      const h = Math.hypot(k.irany[0], k.irany[1]) || 1;
      p(k.x + (1.2 * k.irany[0]) / h, k.y + (1.2 * k.irany[1]) / h);
    }
  }
  if (!Number.isFinite(xMin)) return { xMin: 0, xMax: 1, yMin: 0, yMax: 1 };
  return { xMin, xMax, yMin, yMax };
}
