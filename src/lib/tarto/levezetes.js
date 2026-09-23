/**
 * Levezetés-réteg: a megoldott szerkezethez a tankönyv receptje szerinti,
 * emberi nyelvű levezetést állít elő — elkülönítés, egyensúlyi kijelentés,
 * egyismeretlenes egyenletek (főpontokkal), ellenőrző egyenlet, majd
 * szakaszonként az igénybevételi függvények.
 *
 * A reakciókat itt az egyensúlyi egyenletekből számoljuk (nem a merevségi
 * megoldóból), így a két út egymást ellenőrzi.
 */

import { normalizal } from "./modell.js";
import { sz, szK } from "../szamok.js";

/** sima szöveg (nem KaTeX) számformázás */
const t2 = (v) => sz(Math.abs(v) < 5e-3 ? 0 : v, 2);
const t3 = (v) => f3(v).replace("{,}", ",");

const EPS = 1e-9;
const f2 = (v) => szK(Math.abs(v) < 5e-3 ? 0 : v, 2);
/** „okos” szám: egész → tizedes nélkül, különben a legrövidebb (max 3 tizedes) pontos alak */
function f3(v) {
  if (Math.abs(v) < 5e-4) return "0";
  for (let d = 0; d < 3; d++) if (Math.abs(v * 10 ** d - Math.round(v * 10 ** d)) < 1e-7) return szK(v, d);
  return szK(v, 3);
}
/** határozott névelő a pont/támasz neve elé */
const nevelo = (id) => (/^[aeiouáéíóöőúüű]/i.test(String(id)) || /^[15]/.test(String(id)) ? "az" : "a");
const romai = (n) => ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"][n] ?? String(n + 1);

/* ---------- alsó index KaTeX-ben ---------- */
const jel = (alap, index) => (index ? `${alap}_{${index}}` : alap);

/* ---------- merev testek ---------- */
function testekreBont(m) {
  const n = m.rudak.length;
  const szulo = m.rudak.map((_, i) => i);
  const gy = (i) => (szulo[i] === i ? i : (szulo[i] = gy(szulo[i])));
  const uni = (a, b) => { const x = gy(a), y = gy(b); if (x !== y) szulo[x] = y; };

  // csomópontonként a mereven csatlakozó rudak egy testbe kerülnek
  const merevRudak = m.csomopontok.map(() => []);
  const csuklosVegek = []; // { rud, cs }
  m.rudak.forEach((r) => {
    if (r.csukloA) csuklosVegek.push({ rud: r.index, cs: r.ia }); else merevRudak[r.ia].push(r.index);
    if (r.csukloB) csuklosVegek.push({ rud: r.index, cs: r.ib }); else merevRudak[r.ib].push(r.index);
  });
  merevRudak.forEach((lista) => { for (let i = 1; i < lista.length; i++) uni(lista[0], lista[i]); });

  // ha egy csomóponthoz csak csuklós rúdvégek tartoznak, az első lesz a „gazda” (merevnek tekintve)
  const gazdaRud = m.csomopontok.map((_, cs) => (merevRudak[cs][0] ?? null));
  const belsoCsuklok = [];
  for (const v of csuklosVegek) {
    if (gazdaRud[v.cs] === null) { gazdaRud[v.cs] = v.rud; continue; }
    if (gy(gazdaRud[v.cs]) === gy(v.rud)) continue; // ugyanabban a testben – nincs kapcsolati erő
    belsoCsuklok.push(v);
  }
  const testIndex = new Map();
  m.rudak.forEach((r) => { const g = gy(r.index); if (!testIndex.has(g)) testIndex.set(g, testIndex.size); });
  const testek = [...testIndex.keys()].map((g, i) => ({
    index: i,
    rudak: m.rudak.filter((r) => gy(r.index) === g).map((r) => r.index),
    csomopontok: [],
  }));
  m.csomopontok.forEach((cs) => {
    if (gazdaRud[cs.index] === null) return;
    testek[testIndex.get(gy(gazdaRud[cs.index]))].csomopontok.push(cs.index);
  });
  const testOf = (rudIdx) => testIndex.get(gy(rudIdx));
  const csomopontTeste = (cs) => (gazdaRud[cs] === null ? null : testOf(gazdaRud[cs]));
  return { testek, belsoCsuklok, testOf, csomopontTeste };
}

/* ---------- ismeretlenek felvétele ---------- */
function ismeretlenekFelvetele(m, bont) {
  const lista = [];
  const rudSzam = { db: 0 };
  m.tamaszok.forEach((t, ti) => {
    const cs = m.csomopontok[t.ics];
    const test = bont.csomopontTeste(t.ics);
    const P = [cs.x, cs.y];
    if (t.tipus === "csuklo" || t.tipus === "befogas") {
      lista.push({ jel: jel(cs.id, "x"), tipus: "ero", irany: [1, 0], P, hat: [{ test, elojel: 1 }], tamasz: ti, komponens: "Fx", leiras: `vízszintes reakció ${nevelo(cs.id)} ${cs.id} támasznál, jobbra felvéve` });
      lista.push({ jel: jel(cs.id, "y"), tipus: "ero", irany: [0, 1], P, hat: [{ test, elojel: 1 }], tamasz: ti, komponens: "Fy", leiras: `függőleges reakció ${nevelo(cs.id)} ${cs.id} támasznál, felfelé felvéve` });
      if (t.tipus === "befogas") lista.push({ jel: `M_{${cs.id}}`, tipus: "nyomatek", hat: [{ test, elojel: 1 }], tamasz: ti, komponens: "M", leiras: `befogási nyomaték ${nevelo(cs.id)} ${cs.id} támasznál, az óramutató járásával ellentétesen felvéve` });
    } else if (t.tipus === "gorgo") {
      lista.push({ jel: cs.id, tipus: "ero", irany: t.irany, P, hat: [{ test, elojel: 1 }], tamasz: ti, komponens: "nagysag", leiras: `a görgő reakciója ${nevelo(cs.id)} ${cs.id} támasznál, a gördülési síkra merőlegesen (${sz(t.szog, 0)}° irányban) felvéve` });
    } else {
      rudSzam.db++;
      lista.push({ jel: jel("S", m.tamaszok.filter((x) => x.tipus === "rud").length > 1 ? rudSzam.db : ""), tipus: "ero", irany: t.irany, P, hat: [{ test, elojel: 1 }], tamasz: ti, komponens: "nagysag", leiras: `a támasztórúd ereje ${nevelo(cs.id)} ${cs.id} pontban, húzóerőként felvéve (a rúd másik vége felé mutat)` });
    }
  });
  for (const v of bont.belsoCsuklok) {
    const cs = m.csomopontok[v.cs];
    const P = [cs.x, cs.y];
    const testRud = bont.testOf(v.rud);
    const testGazda = bont.csomopontTeste(v.cs);
    lista.push({ jel: jel(cs.id, "x"), tipus: "ero", irany: [1, 0], P, hat: [{ test: testRud, elojel: 1 }, { test: testGazda, elojel: -1 }], leiras: `vízszintes kapcsolati erő ${nevelo(cs.id)} ${cs.id} belső csuklóban (a két testen ellentett)` });
    lista.push({ jel: jel(cs.id, "y"), tipus: "ero", irany: [0, 1], P, hat: [{ test: testRud, elojel: 1 }, { test: testGazda, elojel: -1 }], leiras: `függőleges kapcsolati erő ${nevelo(cs.id)} ${cs.id} belső csuklóban (a két testen ellentett)` });
  }
  return lista;
}

/* ---------- ismert terhek testenként (eredőkkel) ---------- */
function terhekFelvetele(m, bont) {
  const lista = [];
  let nF = 0, nM = 0, nR = 0;
  m.csomopontiTerhek.forEach((t, i) => {
    const cs = m.csomopontok[i];
    const test = bont.csomopontTeste(i);
    if (Math.abs(t.Fx) > EPS || Math.abs(t.Fy) > EPS) lista.push({ nev: jel("F", ++nF), Fx: t.Fx, Fy: t.Fy, x: cs.x, y: cs.y, M: 0, test, leiras: `erő ${nevelo(cs.id)} ${cs.id} pontban (${t2(Math.hypot(t.Fx, t.Fy))} kN)` });
    if (Math.abs(t.M) > EPS) lista.push({ nev: jel("M", ++nM), Fx: 0, Fy: 0, x: cs.x, y: cs.y, M: t.M, test, leiras: `koncentrált nyomaték ${nevelo(cs.id)} ${cs.id} pontban (${t2(Math.abs(t.M))} kNm, ${t.M > 0 ? "az óramutatóval ellentétes" : "az óramutató járásával egyező"})` });
  });
  for (const r of m.rudak) {
    const test = bont.testOf(r.index);
    const { cos: c, sin: s } = r;
    const A = m.csomopontok[r.ia].id;
    for (const p of r.pontTerhek) {
      const x = r.x1 + p.a * c, y = r.y1 + p.a * s;
      const Fx = p.Px * c - p.Py * s, Fy = p.Px * s + p.Py * c;
      if (Math.abs(Fx) > EPS || Math.abs(Fy) > EPS) lista.push({ nev: jel("F", ++nF), Fx, Fy, x, y, M: 0, test, leiras: `erő a(z) ${r.id}. rúdon, ${nevelo(A)} ${A} ponttól ${t3(p.a)} m-re (${t2(Math.hypot(Fx, Fy))} kN)` });
      if (Math.abs(p.Mz) > EPS) lista.push({ nev: jel("M", ++nM), Fx: 0, Fy: 0, x, y, M: p.Mz, test, leiras: `koncentrált nyomaték a(z) ${r.id}. rúdon, ${nevelo(A)} ${A} ponttól ${t3(p.a)} m-re (${t2(Math.abs(p.Mz))} kNm)` });
    }
    for (const mm of r.megoszlok) {
      // (A a rúd kezdőpontja)
      const dL = mm.a2 - mm.a1;
      const I0x = ((mm.qx1 + mm.qx2) / 2) * dL;
      const I0y = ((mm.qy1 + mm.qy2) / 2) * dL;
      const I1y = mm.a1 * I0y + dL * dL * (mm.qy1 / 2 + (mm.qy2 - mm.qy1) / 3);
      const I1x = mm.a1 * I0x + dL * dL * (mm.qx1 / 2 + (mm.qx2 - mm.qx1) / 3);
      const Fx = I0x * c - I0y * s, Fy = I0x * s + I0y * c;
      const nagy = Math.abs(I0y) > EPS ? I1y / I0y : Math.abs(I0x) > EPS ? I1x / I0x : (mm.a1 + mm.a2) / 2;
      const x = r.x1 + nagy * c, y = r.y1 + nagy * s;
      // ha az eredő zérus (előjelet váltó teher), a hatás egy erőpár: M a nyomatéka
      const Mo = (r.x1 * s - r.y1 * c) * I0x + (r.x1 * c + r.y1 * s) * I0y + I1y;
      const M = Math.abs(Fx) + Math.abs(Fy) > EPS ? 0 : Mo;
      lista.push({ nev: jel("R", ++nR), Fx, Fy, x, y, M, test, megoszlo: true,
        leiras: Math.abs(Fx) + Math.abs(Fy) > EPS ? `a(z) ${r.id}. rúd megoszló terhének eredője (${t2(Math.hypot(Fx, Fy))} kN), ${nevelo(A)} ${A} ponttól ${t3(nagy)} m-re — a teherábra súlypontjában` : `a(z) ${r.id}. rúd előjelet váltó megoszló terhe: az eredő erő nulla, a hatása egy ${t2(Math.abs(M))} kNm nyomatékú erőpár` });
    }
  }
  return lista;
}

/* ---------- egy egyenlet együtthatói ---------- */
function egyenletEgyutthatok(egy, ismeretlenek, terhek, testIdx) {
  // egy = { tipus: "vet", e: [ex, ey] } vagy { tipus: "nyom", P: [x, y], nev }
  const ism = [];
  for (let i = 0; i < ismeretlenek.length; i++) {
    const u = ismeretlenek[i];
    const hatasok = u.hat.filter((x) => testIdx === "mind" || x.test === testIdx);
    if (!hatasok.length) continue;
    let k = 0;
    if (egy.tipus === "vet") k = u.tipus === "ero" ? u.irany[0] * egy.e[0] + u.irany[1] * egy.e[1] : 0;
    else k = u.tipus === "ero" ? (u.P[0] - egy.P[0]) * u.irany[1] - (u.P[1] - egy.P[1]) * u.irany[0] : 1;
    k *= hatasok.reduce((sum, h) => sum + h.elojel, 0); // belső erők az egész szerkezetre kiesnek
    if (Math.abs(k) > 1e-9) ism.push({ index: i, k });
  }
  const tagok = [];
  for (const t of terhek) {
    if (testIdx !== "mind" && t.test !== testIdx) continue;
    if (egy.tipus === "vet") {
      const v = t.Fx * egy.e[0] + t.Fy * egy.e[1];
      if (Math.abs(v) > 1e-9) tagok.push({ ertek: v, szoveg: f3(v), nev: t.nev });
    } else {
      const dx = t.x - egy.P[0], dy = t.y - egy.P[1];
      const a = t.Fy * dx, b = -t.Fx * dy;
      const szorzat = (v, p, q) => `${v < 0 ? "-" : ""}${f3(Math.abs(p))} \\cdot ${f3(Math.abs(q))}`;
      if (Math.abs(a) > 1e-9) tagok.push({ ertek: a, szoveg: szorzat(a, t.Fy, dx), nev: `${t.nev}\\ (F_y \\cdot \\Delta x)` });
      if (Math.abs(b) > 1e-9) tagok.push({ ertek: b, szoveg: szorzat(b, t.Fx, dy), nev: `${t.nev}\\ (-F_x \\cdot \\Delta y)` });
      if (Math.abs(t.M) > 1e-9) tagok.push({ ertek: t.M, szoveg: f3(t.M), nev: t.nev });
    }
  }
  return { ism, tagok };
}

function tagSor(tagok, ismTagok) {
  const reszek = [];
  const push = (elojelesSzoveg, elso) => reszek.push(elso ? elojelesSzoveg.replace(/^\+\s*/, "") : elojelesSzoveg);
  let elso = true;
  for (const t of tagok) {
    const s = t.szoveg.startsWith("-") ? `- ${t.szoveg.slice(1)}` : `+ ${t.szoveg}`;
    // szorzatnál a negatív előjelet emeljük ki: -(a·b) alakban egyszerűbb: (a·b) előjelét a szorzat adja
    push(s, elso); elso = false;
  }
  for (const it of ismTagok) push(it, elso), (elso = false);
  return reszek.join(" ");
}

/** már ismert mennyiség behelyettesítve: (együttható)·(érték), a negatív érték zárójelben */
function ismertSzoveg(k, v) {
  const ertekSzoveg = v < 0 ? `(${f3(v)})` : f3(v);
  const a = Math.abs(k);
  if (Math.abs(a - 1) < 1e-9) return f3(k * v);
  return `${k < 0 ? "-" : ""}${f3(a)} \\cdot ${ertekSzoveg}`;
}

function ismTag(k, jelNev) {
  const a = Math.abs(k);
  const eloj = k < 0 ? "-" : "+";
  if (Math.abs(a - 1) < 1e-9) return `${eloj} ${jelNev}`;
  return `${eloj} ${f3(a)} \\cdot ${jelNev}`;
}

function egyenletFej(egy) {
  if (egy.tipus === "nyom") return `\\Mp{${egy.nev}}\\ `;
  if (Math.abs(egy.e[0] - 1) < 1e-9 && Math.abs(egy.e[1]) < 1e-9) return "\\Fx ";
  if (Math.abs(egy.e[1] - 1) < 1e-9 && Math.abs(egy.e[0]) < 1e-9) return "\\Fy ";
  const fok = (Math.atan2(egy.e[1], egy.e[0]) * 180) / Math.PI;
  return `\\textstyle\\sum F_{i,${szK(fok, 0)}^\\circ}\\!\\nearrow\\,:\\ `;
}

/* ---------- a fő eljárás ---------- */
export function levezetes(be, megoldott) {
  const m = megoldott?.modell ?? normalizal(be);
  const bont = testekreBont(m);
  const ismeretlenek = ismeretlenekFelvetele(m, bont);
  const terhek = terhekFelvetele(m, bont);
  const lepesek = [];
  const testNev = (idx) => {
    if (bont.testek.length === 1) return "";
    if (idx === "mind") return " (az egész szerkezetre)";
    const t = bont.testek[idx];
    const rid = m.rudak[t.rudak[0]].id;
    return t.rudak.length === 1 ? ` (${nevelo(rid)} ${rid}. rúdra)` : ` (${nevelo(romai(idx))} ${romai(idx)}. testre)`;
  };

  // 1. elkülönítés
  lepesek.push({
    cim: "Elkülönítés — a szabadtest-ábra",
    szoveg: bont.testek.length === 1
      ? "A támaszokat eltávolítjuk, és a helyükre a reakciókat vesszük fel feltételezett iránnyal. Ha egy reakció negatív lesz, az iránya a felvettel ellentétes."
      : `A szerkezet ${bont.testek.length} merev testből áll; a belső csuklókban a két testre ellentett kapcsolati erőpárt veszünk fel (hatás–ellenhatás). Minden testre külön egyensúlyi kijelentés írható.`,
    felsorolas: ismeretlenek.map((u) => ({ jel: u.jel, leiras: u.leiras })),
    terhek: terhek.map((t) => ({ nev: t.nev, leiras: t.leiras, Fx: t.Fx, Fy: t.Fy, M: t.M })),
  });

  // 2. egyensúlyi kijelentés(ek)
  const kijelentesek = bont.testek.map((t) => {
    const ter = terhek.filter((x) => x.test === t.index).map((x) => `\\underline{${x.nev}}`);
    const ism = ismeretlenek.filter((u) => u.hat.some((h) => h.test === t.index)).map((u) => (u.tipus === "nyomatek" ? u.jel : `\\underline{${u.jel}}`));
    const nev = bont.testek.length > 1 ? (t.rudak.length === 1 ? `\\text{${m.rudak[t.rudak[0]].id}. rúd}` : `\\text{${romai(t.index)}. test: ${t.rudak.map((i) => m.rudak[i].id).join(", ")}. rúd}`) : "";
    return `(${[...ter, ...ism].join(",\\ ")}) \\ekv \\underline{O}${nev ? `\\quad(${nev})` : ""}`;
  });
  if (bont.testek.length > 1) {
    const kulso = ismeretlenek.filter((u) => u.hat.length === 1).map((u) => (u.tipus === "nyomatek" ? u.jel : `\\underline{${u.jel}}`));
    kijelentesek.unshift(`(${[...terhek.map((x) => `\\underline{${x.nev}}`), ...kulso].join(",\\ ")}) \\ekv \\underline{O}\\quad(\\text{az egész szerkezet})`);
  }
  lepesek.push({
    cim: "Egyensúlyi kijelentés",
    szoveg: bont.testek.length > 1
      ? "Az aktív terhek és a reakciók együtt egyensúlyi erőrendszert alkotnak — az egész szerkezetre és minden testre külön is. Az egész szerkezetre írt egyenletekben a belső csuklóerők kiesnek (hatás–ellenhatás), ezért érdemes velük kezdeni."
      : "Az aktív terhek és a reakciók együtt egyensúlyi erőrendszert alkotnak.",
    kepletek: kijelentesek,
  });

  // 3. jelölt egyenletek testenként
  const jeloltek = [];
  const testLista = bont.testek.length > 1
    ? [{ index: "mind", rudak: m.rudak.map((r) => r.index), csomopontok: m.csomopontok.map((c) => c.index) }, ...bont.testek]
    : bont.testek;
  for (const t of testLista) {
    const pontok = new Map();
    const addP = (P, nev) => { const k = `${P[0].toFixed(6)},${P[1].toFixed(6)}`; if (!pontok.has(k)) pontok.set(k, { P, nev }); };
    const erintett = new Set(t.csomopontok);
    for (const ri of t.rudak) { erintett.add(m.rudak[ri].ia); erintett.add(m.rudak[ri].ib); }
    for (const cs of erintett) addP([m.csomopontok[cs].x, m.csomopontok[cs].y], m.csomopontok[cs].id);
    // főpontok: két ismeretlen erő hatásvonalának metszéspontja
    const erok = ismeretlenek.filter((u) => u.tipus === "ero" && (t.index === "mind" ? u.hat.length === 1 : u.hat.some((h) => h.test === t.index)));
    let fp = 0;
    for (let i = 0; i < erok.length; i++) for (let j = i + 1; j < erok.length; j++) {
      const a = erok[i], b = erok[j];
      const det = a.irany[0] * b.irany[1] - a.irany[1] * b.irany[0];
      if (Math.abs(det) < 1e-9) continue;
      const dx = b.P[0] - a.P[0], dy = b.P[1] - a.P[1];
      const ta = (dx * b.irany[1] - dy * b.irany[0]) / det;
      const P = [a.P[0] + ta * a.irany[0], a.P[1] + ta * a.irany[1]];
      const k = `${P[0].toFixed(6)},${P[1].toFixed(6)}`;
      if (!pontok.has(k)) pontok.set(k, { P, nev: `O_{${++fp}}`, fopont: true, ebbol: [a.jel, b.jel] });
    }
    for (const p of pontok.values()) jeloltek.push({ test: t.index, tipus: "nyom", P: p.P, nev: p.nev, fopont: p.fopont, ebbol: p.ebbol });
    jeloltek.push({ test: t.index, tipus: "vet", e: [1, 0] });
    jeloltek.push({ test: t.index, tipus: "vet", e: [0, 1] });
    for (const u of erok) {
      const e = [-u.irany[1], u.irany[0]];
      if (Math.abs(e[0]) > 1e-9 && Math.abs(e[1]) > 1e-9) jeloltek.push({ test: t.index, tipus: "vet", e, meroleges: u.jel });
    }
  }

  // 4. mohó egyenletválasztás
  const ertekek = new Array(ismeretlenek.length).fill(null);
  const hasznalt = new Set();
  const egyenletLepesek = [];
  let biztonsag = 0;
  while (ertekek.some((v) => v === null) && biztonsag++ < 40) {
    let legjobb = null;
    for (const egy of jeloltek) {
      if (hasznalt.has(egy)) continue;
      const { ism, tagok } = egyenletEgyutthatok(egy, ismeretlenek, terhek, egy.test);
      const nyitott = ism.filter((x) => ertekek[x.index] === null);
      if (nyitott.length === 0) continue;
      // preferencia: kevesebb nyitott ismeretlen, azon belül kevesebb tag (rövidebb egyenlet);
      // holtversenyben a jelöltek sorrendje dönt: csomóponti nyomaték, főpont, vetület
      const tagSzam = tagok.length + ism.length;
      const rang = nyitott.length * 100 + tagSzam;
      if (!legjobb || rang < legjobb.rang) legjobb = { egy, ism, tagok, nyitott, rang };
    }
    if (!legjobb) break;
    const { egy, ism, tagok, nyitott } = legjobb;
    hasznalt.add(egy);
    // a már ismert ismeretlenek behelyettesítve
    const ismertek = ism.filter((x) => ertekek[x.index] !== null);
    const ismertTagok = ismertek.filter((x) => Math.abs(x.k * ertekek[x.index]) > 5e-4).map((x) => ({ ertek: x.k * ertekek[x.index], szoveg: ismertSzoveg(x.k, ertekek[x.index]), nev: ismeretlenek[x.index].jel }));
    const behelyettesitve = ismertek.length ? ` Behelyettesítve: ${ismertek.map((x) => `${ismeretlenek[x.index].jel.replace(/[{}\\]/g, "")} = ${t2(ertekek[x.index])}`).join(", ")}.` : "";
    const osszes = [...tagok, ...ismertTagok];
    const konst = osszes.reduce((s, x) => s + x.ertek, 0);
    const ismTagok = nyitott.map((x) => ismTag(x.k, ismeretlenek[x.index].jel));
    const sor = tagSor(osszes, ismTagok);
    if (nyitott.length === 1) {
      const x = nyitott[0];
      const v = -konst / x.k;
      ertekek[x.index] = v;
      const u = ismeretlenek[x.index];
      let miert = "";
      if (egy.tipus === "nyom") {
        const kiesok = ismeretlenek.filter((w, i) => w.tipus === "ero" && (egy.test === "mind" ? w.hat.length === 1 : w.hat.some((h) => h.test === egy.test)) && !ism.some((q) => q.index === i)).map((w) => w.jel);
        miert = egy.fopont
          ? (() => { const t = (j) => j.replace(/[{}\\]/g, ""); const n = t(egy.nev); return `${nevelo(n) === "az" ? "Az" : "A"} ${n} főpont ${nevelo(t(egy.ebbol[0]))} ${t(egy.ebbol[0])} és ${t(egy.ebbol[1])} hatásvonalának metszéspontja, ezért mindkettő kiesik.`; })()
          : kiesok.length ? `Erre a pontra írva ${kiesok.map((j) => j.replace(/[{}\\]/g, "")).join(", ")} nem szerepel (a hatásvonala átmegy a ponton, a karja nulla).` : "";
      } else if (egy.meroleges) {
        miert = `A(z) ${egy.meroleges.replace(/[{}\\]/g, "")} irányára merőleges vetület: az kiesik belőle.`;
      } else if (Math.abs(egy.e[0]) > 0.5) {
        miert = "Vízszintes vetületi egyenlet: a függőleges erők és a nyomatékok nem szerepelnek benne.";
      } else {
        miert = "Függőleges vetületi egyenlet: a vízszintes erők és a nyomatékok nem szerepelnek benne.";
      }
      miert += behelyettesitve;
      const egyenletTex = `${egyenletFej(egy)}${sor} = 0 \\ \\Rightarrow\\ ${u.jel} = ${f2(v)}\\ \\text{${u.tipus === "nyomatek" ? "kNm" : "kN"}}`;
      if (egy.test === "mind") miert = "Az egész szerkezetre írva a belső csuklóerők kiesnek. " + miert;
      egyenletLepesek.push({
        cim: `${egy.tipus === "nyom" ? `Nyomatéki egyenlet ${nevelo(egy.nev)} ${egy.nev.replace(/_\{(\d+)\}/, "$1")} pontra` : "Vetületi egyenlet"}${testNev(egy.test)} → ${u.jel.replace(/[{}\\]/g, "")}`,
        szoveg: miert + (v < 0 ? ` Az eredmény negatív: ${u.jel.replace(/[{}\\]/g, "")} a felvett iránnyal ellentétesen hat.` : ""),
        kepletek: [egyenletTex],
        fopont: egy.fopont ? { P: egy.P, nev: egy.nev } : null,
        eredmeny: { jel: u.jel, ertek: v },
      });
    } else {
      // két ismeretlen: keresünk egy másik, ugyanazokat tartalmazó egyenletet, és kettesével oldunk
      const a = nyitott[0], b = nyitott[1];
      let masik = null;
      for (const egy2 of jeloltek) {
        if (hasznalt.has(egy2)) continue;
        const r = egyenletEgyutthatok(egy2, ismeretlenek, terhek, egy2.test);
        const ny2 = r.ism.filter((x) => ertekek[x.index] === null);
        if (ny2.length === 2 && ny2.some((x) => x.index === a.index) && ny2.some((x) => x.index === b.index)) { masik = { egy: egy2, ...r, ny: ny2 }; break; }
      }
      if (!masik) break;
      hasznalt.add(masik.egy);
      const ka = a.k, kb = b.k;
      const ka2 = masik.ny.find((x) => x.index === a.index).k, kb2 = masik.ny.find((x) => x.index === b.index).k;
      const ism2 = masik.ism.filter((x) => ertekek[x.index] !== null && Math.abs(x.k * ertekek[x.index]) > 5e-4).map((x) => ({ ertek: x.k * ertekek[x.index], szoveg: ismertSzoveg(x.k, ertekek[x.index]), nev: "" }));
      const konst2 = [...masik.tagok, ...ism2].reduce((s, x) => s + x.ertek, 0);
      const det = ka * kb2 - kb * ka2;
      if (Math.abs(det) < 1e-12) break;
      const va = (-konst * kb2 + konst2 * kb) / det;
      const vb = (-ka * konst2 + ka2 * konst) / det;
      ertekek[a.index] = va; ertekek[b.index] = vb;
      const sor2 = tagSor([...masik.tagok, ...ism2], masik.ny.map((x) => ismTag(x.k, ismeretlenek[x.index].jel)));
      egyenletLepesek.push({
        cim: `Két egyenlet, két ismeretlen${testNev(egy.test)} → ${ismeretlenek[a.index].jel.replace(/[{}\\]/g, "")}, ${ismeretlenek[b.index].jel.replace(/[{}\\]/g, "")}`,
        szoveg: "Nem található egyismeretlenes egyenlet, ezért két egyenletet oldunk meg együtt.",
        kepletek: [`${egyenletFej(egy)}${sor} = 0`, `${egyenletFej(masik.egy)}${sor2} = 0`, `\\Rightarrow\\ ${ismeretlenek[a.index].jel} = ${f2(va)},\\quad ${ismeretlenek[b.index].jel} = ${f2(vb)}`],
      });
    }
  }
  lepesek.push(...egyenletLepesek);

  // 4b. ha maradt ismeretlen: statikailag határozatlan (vagy a mohó keresés elakadt)
  const hatarozatlan = ertekek.some((v) => v === null);
  if (hatarozatlan) {
    const egyenletSzam = 3 * bont.testek.length;
    const nyitottak = ismeretlenek.filter((u, i) => ertekek[i] === null).map((u) => u.jel);
    let potolt = 0;
    if (megoldott?.reakciok) {
      ismeretlenek.forEach((u, i) => {
        if (ertekek[i] !== null || u.tamasz === undefined) return;
        const r = megoldott.reakciok[u.tamasz];
        if (r && typeof r[u.komponens] === "number") { ertekek[i] = r[u.komponens]; potolt++; }
      });
    }
    lepesek.push({
      cim: "Az egyensúlyi egyenletek itt elfogynak",
      szoveg: ismeretlenek.length > egyenletSzam
        ? `A szerkezet statikailag határozatlan: ${ismeretlenek.length} ismeretlen áll szemben ${egyenletSzam} egyensúlyi egyenlettel (${nyitottak.map((j) => j.replace(/[{}\\]/g, "")).join(", ")} nem határozható meg csak egyensúlyból). A reakciókhoz a szerkezet alakváltozását is figyelembe kell venni — ez a Szilárdságtan és a Tartók statikája anyaga. ${potolt ? "Az alábbi értékeket a program a merevségi módszerrel számolta." : ""}`
        : `Nem sikerült egyismeretlenes egyenletekkel végigmenni a levezetésen (${nyitottak.join(", ")} nyitott maradt). ${potolt ? "A hiányzó értékeket a program a merevségi módszerrel számolta." : ""}`,
      hatarozatlan: ismeretlenek.length > egyenletSzam,
    });
  }

  // 5. ellenőrző egyenlet: egy nem használt egyenlet, amiben minden ismert
  let ellenorzes = null;
  for (const egy of jeloltek) {
    if (hasznalt.has(egy)) continue;
    if (egy.tipus === "vet" && egy.meroleges) continue;
    const { ism, tagok } = egyenletEgyutthatok(egy, ismeretlenek, terhek, egy.test);
    if (ism.length === 0 && bont.testek.length > 1) continue;
    if (ism.some((x) => ertekek[x.index] === null)) continue;
    const tag2 = ism.filter((x) => Math.abs(x.k * ertekek[x.index]) > 5e-4).map((x) => ({ ertek: x.k * ertekek[x.index], szoveg: ismertSzoveg(x.k, ertekek[x.index]), nev: ismeretlenek[x.index].jel }));
    const osszes = [...tagok, ...tag2];
    const s = osszes.reduce((a, b) => a + b.ertek, 0);
    ellenorzes = { egy, sor: tagSor(osszes, []), osszeg: s };
    if (egy.tipus === "vet") break; // vetületi ellenőrzést szeretünk
  }
  if (ellenorzes) {
    lepesek.push({
      cim: `Ellenőrzés — egy eddig nem használt egyenlet${testNev(ellenorzes.egy.test)}`,
      szoveg: `Minden tag ismert, az összegnek nullát kell adnia. ${Math.abs(ellenorzes.osszeg) < 1e-6 ? "Rendben." : "Az eltérés a kerekítésből adódik."}`,
      kepletek: [`${egyenletFej(ellenorzes.egy)}${ellenorzes.sor} = ${f3(ellenorzes.osszeg)} \\approx 0\\ \\checkmark`],
    });
  }

  // 6. eredményvázlat
  lepesek.push({
    cim: "Eredményvázlat",
    szoveg: "A reakciók a tényleges irányukkal és pozitív nagysággal:",
    felsorolas: ismeretlenek.map((u, i) => ({ jel: u.jel, ertek: ertekek[i], leiras: ertekek[i] === null ? "nem sikerült egyismeretlenes egyenlettel meghatározni" : `${t2(Math.abs(ertekek[i]))} ${u.tipus === "nyomatek" ? "kNm" : "kN"}${ertekek[i] < 0 ? " — a felvett iránnyal ellentétesen" : ""}` })),
  });

  return {
    lepesek,
    ismeretlenek: ismeretlenek.map((u, i) => ({ jel: u.jel, ertek: ertekek[i], tipus: u.tipus, irany: u.irany, P: u.P })),
    testekSzama: bont.testek.length,
    hatarozatlan,
    teljes: !hatarozatlan,
  };
}

/* ---------- igénybevételi függvények szövegesen ---------- */
function polinomTex(p, valtozo = "x") {
  const reszek = [];
  p.forEach((c, i) => {
    if (Math.abs(c) < 5e-4) return;
    const a = Math.abs(c);
    const szam = f3(a);
    const hatv = i === 0 ? "" : i === 1 ? valtozo : `${valtozo}^{${i}}`;
    const egy = Math.abs(a - 1) < 1e-9 && i > 0;
    reszek.push(`${c < 0 ? "-" : "+"} ${egy ? "" : szam}${hatv}`);
  });
  if (reszek.length === 0) return "0";
  return reszek.join(" ").replace(/^\+ /, "").replace(/^- /, "-");
}

export function igenybevetelSzoveg(igenybevetelek, modell) {
  return igenybevetelek.map((ig) => {
    const rud = modell.rudak.find((r) => r.id === ig.rud);
    const A = modell.csomopontok[rud.ia].id, B = modell.csomopontok[rud.ib].id;
    return {
      rud: ig.rud,
      cim: igenybevetelek.length > 1 ? `${ig.rud}. rúd (${A} → ${B})` : `A tartó (${A} → ${B})`,
      megjegyzes: `Az x koordinátát a(z) ${A} ponttól mérjük a rúd mentén; a pozitív oldal (az M előjeléhez, és ide kerül mindhárom ábra pozitív értéke) a ${rud.pozitivOldal === -1 ? "haladási irány szerinti jobb" : "bal"} oldal.`,
      szakaszok: ig.szakaszok.map((sz) => ({
        tartomany: `${f2(sz.x1)} \\le x \\le ${f2(sz.x2)}`,
        N: `N(x) = ${polinomTex(sz.N)}`,
        V: `V(x) = ${polinomTex(sz.V)}`,
        M: `M(x) = ${polinomTex(sz.M)}`,
        fok: sz.M.length - 1,
      })),
    };
  });
}
