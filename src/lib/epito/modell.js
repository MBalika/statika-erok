/**
 * A Tartóépítő szerkesztő-állapota és a számítómag (src/lib/tarto) modellje közti híd.
 * Tiszta függvények, React-mentes — a teszt (teszt-epito.mjs) Node-ban futtatja.
 *
 * A szerkesztő állapota (minden hossz m, erő kN, nyomaték kNm; x jobbra, y felfelé,
 * a nyomaték az óramutatóval ellentétesen pozitív, a szög a matematikai irány fokban:
 * 0 = jobbra, 90 = felfelé, −90 = lefelé):
 * {
 *   csomopontok: [{ id: "A", x, y }],
 *   rudak:       [{ id: "1", a: "A", b: "B" }],
 *   csuklok:     ["C"],                                 // belső csukló ezekben a csomópontokban
 *   tamaszok:    [{ csomopont: "A", tipus: "csuklo"|"gorgo"|"befogas", szog?: 90 }], // görgőnél a gátolt irány
 *   terhek: [
 *     { id, fajta: "csomopontiEro",      csomopont, F, szog },
 *     { id, fajta: "csomopontiNyomatek", csomopont, M },
 *     { id, fajta: "pontTeher",          rud, a, F, szog },
 *     { id, fajta: "pontNyomatek",       rud, a, M },
 *     { id, fajta: "megoszlo",           rud, a1, a2, p1, p2, szog },
 *   ]
 * }
 * Belső csukló: a csomópontba futó rudak közül az első merev marad, a többi csuklós véget kap
 * (csukloA / csukloB) — így a Gerber-tartó és a háromcsuklós keret is helyesen áll elő.
 *
 * Minden módosító függvény ÚJ állapotot ad vissza (a régit nem írja).
 */

import { elemez } from "../tarto/index.js";

export const RACS = 0.5; // m
export const TARTOMANY = { xMax: 14, yMax: 7 };
export const GORGO_IRANYOK = [
  { szog: 90, nev: "függőleges (vízszintes sík)" },
  { szog: 0, nev: "vízszintes (fal mellett)" },
  { szog: 45, nev: "45°-os" },
  { szog: 135, nev: "135°-os" },
];
export const TAMASZ_CIKLUS = [null, "gorgo", "csuklo", "befogas"];
export const TAMASZ_NEV = { gorgo: "görgő", csuklo: "csukló", befogas: "befogás" };
export const TEHER_NEV = { csomopontiEro: "erő (csomóponton)", csomopontiNyomatek: "nyomaték (csomóponton)", pontTeher: "erő (rúdon)", pontNyomatek: "nyomaték (rúdon)", megoszlo: "megoszló teher" };

const EPS = 1e-9;
const FOK = Math.PI / 180;
export const kerekRacs = (v) => Math.round(v / RACS) * RACS;
const kerek3 = (v) => Math.round(v * 1000) / 1000;

/* ------------------------------------------------------------------ */
/*  alap                                                               */
/* ------------------------------------------------------------------ */

export function uresAllapot() {
  return { csomopontok: [], rudak: [], csuklok: [], tamaszok: [], terhek: [] };
}

function masol(all) {
  return {
    csomopontok: all.csomopontok.map((c) => ({ ...c })),
    rudak: all.rudak.map((r) => ({ ...r })),
    csuklok: [...all.csuklok],
    tamaszok: all.tamaszok.map((t) => ({ ...t })),
    terhek: all.terhek.map((t) => ({ ...t })),
  };
}

/** Csomópont-betűjel: A, B, …, Z, AA, AB, … */
export function betujel(i) {
  let s = "";
  let n = i;
  do {
    s = String.fromCharCode(65 + (n % 26)) + s;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return s;
}

function ujCsomopontId(all) {
  const volt = new Set(all.csomopontok.map((c) => c.id));
  for (let i = 0; i < 1000; i++) if (!volt.has(betujel(i))) return betujel(i);
  return `P${all.csomopontok.length + 1}`;
}
function ujRudId(all) {
  const volt = new Set(all.rudak.map((r) => r.id));
  for (let i = 1; i < 1000; i++) if (!volt.has(String(i))) return String(i);
  return `r${all.rudak.length + 1}`;
}
function ujTeherId(all) {
  const volt = new Set(all.terhek.map((t) => t.id));
  for (let i = 1; i < 1000; i++) if (!volt.has(`t${i}`)) return `t${i}`;
  return `t${all.terhek.length + 1}`;
}

export const csomopont = (all, id) => all.csomopontok.find((c) => c.id === id) ?? null;
export const rud = (all, id) => all.rudak.find((r) => r.id === id) ?? null;
export const tamasz = (all, csId) => all.tamaszok.find((t) => t.csomopont === csId) ?? null;
export const teher = (all, id) => all.terhek.find((t) => t.id === id) ?? null;

/** A rúd geometriája: hossz, irány-egységvektor, szög. */
export function rudGeometria(all, r) {
  const A = csomopont(all, r.a), B = csomopont(all, r.b);
  if (!A || !B) return null;
  const dx = B.x - A.x, dy = B.y - A.y;
  const hossz = Math.hypot(dx, dy);
  return { x1: A.x, y1: A.y, x2: B.x, y2: B.y, hossz, cos: hossz ? dx / hossz : 1, sin: hossz ? dy / hossz : 0, szogFok: Math.atan2(dy, dx) / FOK };
}

/** A csomópontba futó rudak. */
export function csatlakozoRudak(all, csId) {
  return all.rudak.filter((r) => r.a === csId || r.b === csId);
}

/* ------------------------------------------------------------------ */
/*  szerkesztő-műveletek                                               */
/* ------------------------------------------------------------------ */

/** Csomópont a rácspontra; ha ott már van, azt adja vissza. */
export function hozzaadCsomopont(all, x, y, { racsra = true } = {}) {
  const px = racsra ? kerekRacs(x) : kerek3(x);
  const py = racsra ? kerekRacs(y) : kerek3(y);
  const megvan = all.csomopontok.find((c) => Math.abs(c.x - px) < 1e-6 && Math.abs(c.y - py) < 1e-6);
  if (megvan) return { allapot: all, id: megvan.id, uj: false };
  const uj = masol(all);
  const id = ujCsomopontId(all);
  uj.csomopontok.push({ id, x: px, y: py });
  return { allapot: uj, id, uj: true };
}

/** Rúd két csomópont között. A közbeeső (a szakaszra eső) csomópontoknál automatikusan feloszlik. */
export function hozzaadRud(all, aId, bId) {
  if (aId === bId) return { allapot: all, ids: [] };
  const A = csomopont(all, aId), B = csomopont(all, bId);
  if (!A || !B) return { allapot: all, ids: [] };
  // a szakaszra eső csomópontok (a végek nélkül), a-tól b felé rendezve
  const dx = B.x - A.x, dy = B.y - A.y, L = Math.hypot(dx, dy);
  if (L < EPS) return { allapot: all, ids: [] };
  const kozbeeso = all.csomopontok
    .filter((c) => c.id !== aId && c.id !== bId)
    .map((c) => ({ id: c.id, t: ((c.x - A.x) * dx + (c.y - A.y) * dy) / (L * L), d: Math.abs((c.x - A.x) * dy - (c.y - A.y) * dx) / L }))
    .filter((c) => c.d < 1e-6 && c.t > 1e-6 && c.t < 1 - 1e-6)
    .sort((p, q) => p.t - q.t);
  const lanc = [aId, ...kozbeeso.map((c) => c.id), bId];
  let uj = masol(all);
  const ids = [];
  for (let i = 0; i < lanc.length - 1; i++) {
    const p = lanc[i], q = lanc[i + 1];
    if (uj.rudak.some((r) => (r.a === p && r.b === q) || (r.a === q && r.b === p))) continue;
    const id = ujRudId(uj);
    uj.rudak.push({ id, a: p, b: q });
    ids.push(id);
  }
  return { allapot: uj, ids };
}

/** Rúd felosztása az `a` ívhossznál új csomóponttal; a terhek átkerülnek a megfelelő részre. */
export function rudFeloszt(all, rudId, a, { racsra = true } = {}) {
  const r = rud(all, rudId);
  const g = r && rudGeometria(all, r);
  if (!g) return { allapot: all, id: null };
  let aa = racsra ? kerekRacs(a) : kerek3(a);
  aa = Math.min(g.hossz, Math.max(0, aa));
  if (aa < RACS / 2 || aa > g.hossz - RACS / 2) return { allapot: all, id: null };
  const x = kerek3(g.x1 + aa * g.cos), y = kerek3(g.y1 + aa * g.sin);
  const uj = masol(all);
  let id = uj.csomopontok.find((c) => Math.abs(c.x - x) < 1e-6 && Math.abs(c.y - y) < 1e-6)?.id;
  if (!id) {
    id = ujCsomopontId(uj);
    uj.csomopontok.push({ id, x, y });
  }
  const r1 = { id: r.id, a: r.a, b: id };
  const r2 = { id: ujRudId(uj), a: id, b: r.b };
  uj.rudak = uj.rudak.map((q) => (q.id === r.id ? r1 : q));
  uj.rudak.splice(uj.rudak.findIndex((q) => q.id === r.id) + 1, 0, r2);
  const terhek = [];
  for (const t of uj.terhek) {
    if (t.rud !== r.id) { terhek.push(t); continue; }
    if (t.fajta === "pontTeher" || t.fajta === "pontNyomatek") {
      if (t.a <= aa + 1e-9) terhek.push(t);
      else terhek.push({ ...t, rud: r2.id, a: kerek3(t.a - aa) });
    } else if (t.fajta === "megoszlo") {
      const a1 = t.a1, a2 = t.a2;
      const p = (s) => t.p1 + (t.p2 - t.p1) * ((s - a1) / Math.max(1e-9, a2 - a1));
      if (a2 <= aa + 1e-9) terhek.push(t);
      else if (a1 >= aa - 1e-9) terhek.push({ ...t, rud: r2.id, a1: kerek3(a1 - aa), a2: kerek3(a2 - aa) });
      else {
        terhek.push({ ...t, a2: aa, p2: kerek3(p(aa)) });
        terhek.push({ ...t, id: `${t.id}b`, rud: r2.id, a1: 0, a2: kerek3(a2 - aa), p1: kerek3(p(aa)) });
      }
    }
  }
  uj.terhek = terhek;
  return { allapot: uj, id };
}

export function csomopontMozgat(all, id, x, y) {
  const uj = masol(all);
  const c = uj.csomopontok.find((q) => q.id === id);
  if (!c) return all;
  c.x = kerek3(Math.min(TARTOMANY.xMax, Math.max(0, x)));
  c.y = kerek3(Math.min(TARTOMANY.yMax, Math.max(0, y)));
  // a rúdon ülő terhek helye ne lógjon le a rúdról
  for (const r of uj.rudak) {
    if (r.a !== id && r.b !== id) continue;
    const g = rudGeometria(uj, r);
    for (const t of uj.terhek) {
      if (t.rud !== r.id) continue;
      if (t.fajta === "pontTeher" || t.fajta === "pontNyomatek") t.a = Math.min(g.hossz, t.a);
      if (t.fajta === "megoszlo") { t.a2 = Math.min(g.hossz, t.a2); t.a1 = Math.min(t.a1, Math.max(0, t.a2 - RACS)); }
    }
  }
  return uj;
}

/** Belső csukló be/ki egy csomóponton. */
export function csukloValt(all, csId) {
  const uj = masol(all);
  if (uj.csuklok.includes(csId)) uj.csuklok = uj.csuklok.filter((c) => c !== csId);
  else uj.csuklok.push(csId);
  return uj;
}

/** Támasz-ciklus: nincs → görgő → csukló → befogás → nincs. */
export function tamaszCiklus(all, csId) {
  const most = tamasz(all, csId)?.tipus ?? null;
  const kov = TAMASZ_CIKLUS[(TAMASZ_CIKLUS.indexOf(most) + 1) % TAMASZ_CIKLUS.length];
  return tamaszBeallit(all, csId, kov);
}

export function tamaszBeallit(all, csId, tipus, szog = 90) {
  const uj = masol(all);
  uj.tamaszok = uj.tamaszok.filter((t) => t.csomopont !== csId);
  if (tipus) uj.tamaszok.push(tipus === "gorgo" ? { csomopont: csId, tipus, szog } : { csomopont: csId, tipus });
  return uj;
}

export function tamaszSzog(all, csId, szog) {
  const uj = masol(all);
  const t = uj.tamaszok.find((q) => q.csomopont === csId);
  if (t && t.tipus === "gorgo") t.szog = szog;
  return uj;
}

/** Új teher (az id-t a függvény adja). */
export function teherHozzaad(all, t) {
  const uj = masol(all);
  const id = ujTeherId(uj);
  const alap = { csomopontiEro: { F: 10, szog: -90 }, csomopontiNyomatek: { M: 10 }, pontTeher: { a: 0, F: 10, szog: -90 }, pontNyomatek: { a: 0, M: 10 }, megoszlo: { a1: 0, a2: 1, p1: 5, p2: 5, szog: -90 } }[t.fajta] ?? {};
  uj.terhek.push({ ...alap, ...t, id });
  return { allapot: uj, id };
}

export function teherModosit(all, id, valtozas) {
  const uj = masol(all);
  const t = uj.terhek.find((q) => q.id === id);
  if (!t) return all;
  Object.assign(t, valtozas);
  if (t.fajta === "megoszlo") {
    const g = rudGeometria(uj, rud(uj, t.rud));
    if (g) {
      t.a1 = Math.max(0, Math.min(t.a1, g.hossz));
      t.a2 = Math.max(0, Math.min(t.a2, g.hossz));
      if (t.a2 < t.a1) [t.a1, t.a2] = [t.a2, t.a1];
      if (t.a2 - t.a1 < RACS / 2) t.a2 = Math.min(g.hossz, t.a1 + RACS);
    }
  }
  if (t.fajta === "pontTeher" || t.fajta === "pontNyomatek") {
    const g = rudGeometria(uj, rud(uj, t.rud));
    if (g) t.a = Math.max(0, Math.min(t.a, g.hossz));
  }
  return uj;
}

/** Elem törlése: { tipus: "csomopont"|"rud"|"tamasz"|"csuklo"|"teher", id } */
export function elemTorol(all, { tipus, id }) {
  const uj = masol(all);
  if (tipus === "teher") uj.terhek = uj.terhek.filter((t) => t.id !== id);
  else if (tipus === "tamasz") uj.tamaszok = uj.tamaszok.filter((t) => t.csomopont !== id);
  else if (tipus === "csuklo") uj.csuklok = uj.csuklok.filter((c) => c !== id);
  else if (tipus === "rud") {
    uj.rudak = uj.rudak.filter((r) => r.id !== id);
    uj.terhek = uj.terhek.filter((t) => t.rud !== id);
  } else if (tipus === "csomopont") {
    const torolt = uj.rudak.filter((r) => r.a === id || r.b === id).map((r) => r.id);
    uj.rudak = uj.rudak.filter((r) => !torolt.includes(r.id));
    uj.terhek = uj.terhek.filter((t) => t.csomopont !== id && !torolt.includes(t.rud));
    uj.tamaszok = uj.tamaszok.filter((t) => t.csomopont !== id);
    uj.csuklok = uj.csuklok.filter((c) => c !== id);
    uj.csomopontok = uj.csomopontok.filter((c) => c.id !== id);
  }
  return uj;
}

/* ------------------------------------------------------------------ */
/*  a számítómag modellje                                              */
/* ------------------------------------------------------------------ */

/** Csomópontok, amelyekhez nem csatlakozik rúd (a motor-modellből kimaradnak). */
export function arvaCsomopontok(all) {
  return all.csomopontok.filter((c) => !all.rudak.some((r) => r.a === c.id || r.b === c.id)).map((c) => c.id);
}

/** A szerkesztő állapota → a src/lib/tarto modellje. */
export function motorModell(all) {
  const arva = new Set(arvaCsomopontok(all));
  const csomopontok = all.csomopontok.filter((c) => !arva.has(c.id)).map((c) => ({ id: c.id, x: c.x, y: c.y }));
  const rudak = all.rudak.map((r) => ({ id: r.id, a: r.a, b: r.b }));
  // belső csuklók: az első befutó rúd merev marad, a többi csuklós véget kap
  for (const cs of all.csuklok) {
    const lista = rudak.filter((r) => r.a === cs || r.b === cs);
    lista.slice(1).forEach((r) => {
      if (r.a === cs) r.csukloA = true;
      if (r.b === cs) r.csukloB = true;
    });
  }
  const tamaszok = all.tamaszok.filter((t) => !arva.has(t.csomopont)).map((t) => (t.tipus === "gorgo" ? { csomopont: t.csomopont, tipus: "gorgo", szog: t.szog ?? 90 } : { csomopont: t.csomopont, tipus: t.tipus }));
  const terhek = [];
  for (const t of all.terhek) {
    if (t.fajta === "csomopontiEro") {
      if (arva.has(t.csomopont)) continue;
      terhek.push({ fajta: "csomopontiEro", csomopont: t.csomopont, Fx: kerek3(t.F * Math.cos(t.szog * FOK)), Fy: kerek3(t.F * Math.sin(t.szog * FOK)) });
    } else if (t.fajta === "csomopontiNyomatek") {
      if (arva.has(t.csomopont)) continue;
      terhek.push({ fajta: "csomopontiNyomatek", csomopont: t.csomopont, M: t.M });
    } else if (t.fajta === "pontTeher") {
      terhek.push({ fajta: "pontTeher", rud: t.rud, a: t.a, F: t.F, irany: "szog", szog: t.szog });
    } else if (t.fajta === "pontNyomatek") {
      terhek.push({ fajta: "pontNyomatek", rud: t.rud, a: t.a, M: t.M });
    } else if (t.fajta === "megoszlo") {
      terhek.push({ fajta: "megoszlo", rud: t.rud, a1: t.a1, a2: t.a2, p1: t.p1, p2: t.p2 ?? t.p1, irany: "szog", szog: t.szog, vetuletre: false });
    }
  }
  return { csomopontok, rudak, tamaszok, terhek };
}

export function vanTeher(all) {
  return all.terhek.some((t) => (t.fajta === "csomopontiEro" || t.fajta === "pontTeher" ? Math.abs(t.F) > EPS : t.fajta === "megoszlo" ? Math.abs(t.p1) + Math.abs(t.p2 ?? t.p1) > EPS : Math.abs(t.M) > EPS));
}

/**
 * Élő állapotjelzés: mi hiányzik még a rajzoláshoz.
 * → { kod: "ures"|"mechanizmus"|"kritikus"|"hatarozatlan"|"terheletlen"|"kesz", szoveg, tipp, e }
 */
export function allapotJelzes(all) {
  const arva = arvaCsomopontok(all);
  const arvaSzoveg = arva.length ? ` (${arva.join(", ")}: rúd nélküli csomópont — nem számít bele)` : "";
  if (all.rudak.length === 0) return { kod: "ures", szoveg: "Még nincs rúd." + arvaSzoveg, tipp: "Kattints a rácsra csomópontért, majd húzz egy másik pontig — kész a rúd.", e: null };
  const modell = motorModell(all);
  let e;
  try {
    e = elemez(modell);
  } catch {
    e = { ok: false, hibak: ["A modell nem oldható meg."], merleg: null };
  }
  const merleg = e.merleg ?? null;
  const fok = merleg ? merleg.fok : -1;
  const szingularis = !e.ok;
  if (szingularis && fok >= 0) {
    return {
      kod: "kritikus",
      szoveg: `Kritikus elrendezés — a számlálás rendben (${merleg.ismeretlenek} ismeretlen, ${merleg.egyenletek} egyenlet), de a kényszerek úgy állnak, hogy a szerkezet mégis mozoghat${fok > 0 ? `, miközben ${fok} kényszer fölös` : ""}.` + arvaSzoveg,
      tipp: "Tipikus okok: három párhuzamos vagy egy ponton átmenő reakció-hatásvonal; egymás után két belső csukló ugyanabban a mezőben; a görgő hatásvonala átmegy a csuklón. Fordíts el egy görgőt, vagy tedd máshova a csuklót.",
      e,
    };
  }
  if (szingularis || fok < 0) {
    const hiany = fok < 0 ? -fok : 1;
    const csuklos = all.csuklok.length > 0;
    return {
      kod: "mechanizmus",
      szoveg: `Mozog (mechanizmus) — ${hiany} szabadságfok hiányzik.` + arvaSzoveg,
      tipp: hiany === 1
        ? `Adj még egy támaszt (görgő: +1, csukló: +2, befogás: +3 kényszer)${csuklos ? ", vagy vedd ki az egyik belső csuklót (+2)" : ""}, esetleg cseréld a görgőt csuklóra.`
        : `Adj még ${hiany} kényszert: pl. egy csuklót (+2)${hiany >= 3 ? " vagy egy befogást (+3)" : ""}${csuklos ? ", vagy vedd ki egy belső csuklót (+2)" : ""}.`,
      e,
    };
  }
  if (fok > 0) {
    return {
      kod: "hatarozatlan",
      szoveg: `Statikailag határozatlan (${fok} fölös kényszer) — ezt itt nem rajzoljuk, mert az igénybevételek a merevségektől is függenének.` + arvaSzoveg,
      tipp: fok === 1 ? "Vegyél ki egy görgőt, cserélj egy csuklót görgőre, vagy tegyél be egy belső csuklót (−2 helyett −1: a csukló egy fokot old, ha közben görgőt is teszel)." : `Vegyél ki ${fok} kényszert: pl. ${fok >= 2 ? "egy csuklós támaszt, vagy tegyél be egy belső csuklót (−2)" : "egy görgőt"}.`,
      e,
    };
  }
  if (!vanTeher(all)) {
    return { kod: "terheletlen", szoveg: "Határozott ✓ — de nincs teher." + arvaSzoveg, tipp: "Tegyél fel legalább egy terhet (Teher eszköz: csomópontra vagy rúdra kattintva erő, húzva megoszló teher).", e };
  }
  return { kod: "kesz", szoveg: "Határozott, terhelt ✓ — mehet a rajzolás." + arvaSzoveg, tipp: "", e };
}

/* ------------------------------------------------------------------ */
/*  sorosítás: tömör JSON ⇄ base64url                                  */
/* ------------------------------------------------------------------ */

const TEHER_KOD = { csomopontiEro: "e", csomopontiNyomatek: "m", pontTeher: "p", pontNyomatek: "n", megoszlo: "q" };
const KOD_TEHER = Object.fromEntries(Object.entries(TEHER_KOD).map(([k, v]) => [v, k]));

/** Tömör (rövid kulcsú) alak. */
export function tomorit(all) {
  return {
    v: 1,
    c: all.csomopontok.map((c) => [c.id, c.x, c.y]),
    r: all.rudak.map((r) => [r.id, r.a, r.b]),
    h: [...all.csuklok],
    t: all.tamaszok.map((t) => (t.tipus === "gorgo" ? [t.csomopont, t.tipus, t.szog ?? 90] : [t.csomopont, t.tipus])),
    l: all.terhek.map((t) => {
      const k = TEHER_KOD[t.fajta];
      if (k === "e") return [k, t.csomopont, t.F, t.szog];
      if (k === "m") return [k, t.csomopont, t.M];
      if (k === "p") return [k, t.rud, t.a, t.F, t.szog];
      if (k === "n") return [k, t.rud, t.a, t.M];
      return [k, t.rud, t.a1, t.a2, t.p1, t.p2 ?? t.p1, t.szog];
    }),
  };
}

const szam = (v, alap = 0) => (Number.isFinite(Number(v)) ? Number(v) : alap);

/** A tömör alakból teljes állapot (hibás bemenetre null). */
export function kibont(tomor) {
  if (!tomor || typeof tomor !== "object" || !Array.isArray(tomor.c) || !Array.isArray(tomor.r)) return null;
  const all = uresAllapot();
  all.csomopontok = tomor.c.map((c) => ({ id: String(c[0]), x: szam(c[1]), y: szam(c[2]) }));
  const csIds = new Set(all.csomopontok.map((c) => c.id));
  all.rudak = tomor.r.map((r) => ({ id: String(r[0]), a: String(r[1]), b: String(r[2]) })).filter((r) => csIds.has(r.a) && csIds.has(r.b) && r.a !== r.b);
  const rudIds = new Set(all.rudak.map((r) => r.id));
  all.csuklok = (tomor.h ?? []).map(String).filter((c) => csIds.has(c));
  all.tamaszok = (tomor.t ?? []).map((t) => ({ csomopont: String(t[0]), tipus: String(t[1]), szog: t[1] === "gorgo" ? szam(t[2], 90) : undefined })).filter((t) => csIds.has(t.csomopont) && TAMASZ_NEV[t.tipus]);
  all.tamaszok.forEach((t) => { if (t.tipus !== "gorgo") delete t.szog; });
  let n = 0;
  for (const l of tomor.l ?? []) {
    const fajta = KOD_TEHER[l[0]];
    if (!fajta) continue;
    const id = `t${++n}`;
    if (fajta === "csomopontiEro" && csIds.has(String(l[1]))) all.terhek.push({ id, fajta, csomopont: String(l[1]), F: szam(l[2], 10), szog: szam(l[3], -90) });
    else if (fajta === "csomopontiNyomatek" && csIds.has(String(l[1]))) all.terhek.push({ id, fajta, csomopont: String(l[1]), M: szam(l[2], 10) });
    else if (fajta === "pontTeher" && rudIds.has(String(l[1]))) all.terhek.push({ id, fajta, rud: String(l[1]), a: szam(l[2]), F: szam(l[3], 10), szog: szam(l[4], -90) });
    else if (fajta === "pontNyomatek" && rudIds.has(String(l[1]))) all.terhek.push({ id, fajta, rud: String(l[1]), a: szam(l[2]), M: szam(l[3], 10) });
    else if (fajta === "megoszlo" && rudIds.has(String(l[1]))) all.terhek.push({ id, fajta, rud: String(l[1]), a1: szam(l[2]), a2: szam(l[3], 1), p1: szam(l[4], 5), p2: szam(l[5], szam(l[4], 5)), szog: szam(l[6], -90) });
  }
  return all;
}

/* base64url — böngészőben és Node-ban egyformán */
function utf8Bajtok(s) {
  return new TextEncoder().encode(s);
}
function bajtokUtf8(b) {
  return new TextDecoder().decode(b);
}
function base64urlKodol(bajtok) {
  let bin = "";
  for (const b of bajtok) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function base64urlDekodol(s) {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (s.length % 4)) % 4);
  const bin = atob(b64);
  const ki = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) ki[i] = bin.charCodeAt(i);
  return ki;
}

/** Állapot → URL-be illő szöveg (#m=…). */
export function sorosit(all) {
  return base64urlKodol(utf8Bajtok(JSON.stringify(tomorit(all))));
}

/** URL-szövegből állapot, hibára null. */
export function beolvas(szoveg) {
  if (!szoveg || typeof szoveg !== "string") return null;
  try {
    return kibont(JSON.parse(bajtokUtf8(base64urlDekodol(szoveg.trim()))));
  } catch {
    return null;
  }
}

/** Tetszőleges (pl. localStorage-ból jött) objektum ellenőrzött állapottá. */
export function ellenorzottAllapot(obj) {
  if (!obj || typeof obj !== "object") return null;
  if (Array.isArray(obj.c)) return kibont(obj);
  if (Array.isArray(obj.csomopontok)) return kibont(tomorit({ csomopontok: obj.csomopontok, rudak: obj.rudak ?? [], csuklok: obj.csuklok ?? [], tamaszok: obj.tamaszok ?? [], terhek: obj.terhek ?? [] }));
  return null;
}

/** Rövid leírás listákhoz: „3 rúd, 2 támasz, 2 teher”. */
export function allapotLeiras(all) {
  const r = all.rudak.length, t = all.tamaszok.length, l = all.terhek.length, h = all.csuklok.length;
  return `${r} rúd, ${t} támasz${h ? `, ${h} csukló` : ""}, ${l} teher`;
}
