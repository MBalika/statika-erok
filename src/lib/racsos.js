/**
 * Rácsos tartó megoldó — a 7. modul számítómagja (tiszta JS, nincs React).
 *
 * Modell (kN, m; x jobbra, y felfelé, nyomaték az óramutatóval ellentétesen pozitív):
 * {
 *   csomopontok: [{ id: "1", x: 0, y: 0 }, …],
 *   rudak:       [{ id: "1,2", a: "1", b: "2" }, …],
 *   tamaszok:    [{ csomopont: "6", tipus: "csuklo" | "gorgo", szog?: 90 }],   // szog: a görgő reakciójának iránya (fok), 90 = függőleges
 *   terhek:      [{ csomopont: "3", Fx: 0, Fy: -10 }],
 * }
 *
 * Fő függvények:
 *   racsosMegold(modell, { sorrend })  → { ok, hibak, hatarozottsag, reakciok, rudErok, vakrudak, vakrudIndokok,
 *                                          reakcioLepesek, csomopontiSorrend, ellenorzesek, csomopontok, rudak }
 *   atmetszes(modell, rudIds, oldal, { ismert }) → a hármas (négyes) átmetszés egyenletei főpontokkal
 *   vakrudak(modell, { reakciok })     → a három alapeset automatikus felismerése
 *   atvagottRudak(modell, p1, p2)      → egy szakasz által átvágott rudak
 *   sablon(tipus, opciok)              → paraméteres rácsos tartók (parhuzamos, warren, haromszog, k, trapez)
 *   rudTex(id), f4(v)                  → jelölés és számformázás (4 értékes jegy, magyar vessző)
 */

const EPS = 1e-9;

/* ============================================================
   Számformázás
   ============================================================ */

/** 4 értékes jegyre kerekítve, magyar tizedesvesszővel (a KaTeX-be a Keplet.js {,}-re cseréli). */
export function f4(v, maxTizedes = 4) {
  if (!Number.isFinite(v)) return "–";
  if (Math.abs(v) < 5e-7) return "0";
  const nagys = Math.floor(Math.log10(Math.abs(v)));
  const tiz = Math.max(0, Math.min(maxTizedes, 3 - nagys));
  let s = Math.abs(v).toFixed(tiz);
  if (s.includes(".")) s = s.replace(/0+$/, "").replace(/\.$/, "");
  if (s === "0") return "0";
  return (v < 0 ? "-" : "") + s.replace(".", ",");
}

/** Előjeles tag: „+ 12,5” / „- 3,2” (KaTeX). */
export function tagE(v) {
  return `${v < 0 ? "-" : "+"} ${f4(Math.abs(v))}`;
}

/** Előjeles tag ismeretlennel: „+ 0,8\,S_{1,2}” (|c| = 1 → „+ S_{1,2}”). */
export function tagS(c, tex) {
  const jel = c < 0 ? "-" : "+";
  if (Math.abs(Math.abs(c) - 1) < 1e-6) return `${jel} ${tex}`;
  return `${jel} ${f4(Math.abs(c))}\\,${tex}`;
}

/** Előjeles szorzat két számmal: „+ 0,6\cdot(-10,83)” — a második tényező zárójelben, ha negatív. */
export function tagSz(c, v) {
  const jel = c < 0 ? "-" : "+";
  const masodik = v < 0 ? `(${f4(v)})` : f4(v);
  if (Math.abs(Math.abs(c) - 1) < 1e-6) return v < 0 ? `${c < 0 ? "+" : "-"} ${f4(Math.abs(v))}` : `${jel} ${f4(v)}`;
  return `${jel} ${f4(Math.abs(c))}\\cdot ${masodik}`;
}

/** A rúderő KaTeX-jele: "1,3" → S_{1,3}; "AB" → S_{AB}. */
export function rudTex(id) {
  return `S_{${String(id)}}`;
}

/** Rúd-azonosító két csomópontból, a tankönyv szerint a kisebb sorszám elöl. */
export function rudId(a, b) {
  const na = Number(a);
  const nb = Number(b);
  if (Number.isFinite(na) && Number.isFinite(nb)) return na < nb ? `${na},${nb}` : `${nb},${na}`;
  return String(a) < String(b) ? `${a},${b}` : `${b},${a}`;
}

const jelleg = (S) => (Math.abs(S) < 1e-6 ? "vakrúd" : S > 0 ? "húzott" : "nyomott");
const kNszoveg = (S) => `${f4(S)}\\ \\text{kN}`;

/* ============================================================
   Normalizálás
   ============================================================ */

export function normalizal(be) {
  const hibak = [];
  const csomopontok = (be.csomopontok ?? []).map((cs, i) => ({ id: String(cs.id ?? i + 1), x: Number(cs.x) || 0, y: Number(cs.y) || 0, index: i }));
  const csIdx = new Map(csomopontok.map((c) => [c.id, c.index]));
  const rudak = (be.rudak ?? []).map((r, i) => {
    const ia = csIdx.get(String(r.a));
    const ib = csIdx.get(String(r.b));
    if (ia === undefined || ib === undefined) hibak.push(`A(z) ${r.id ?? i + 1} rúd végpontja ismeretlen csomópont (${r.a}, ${r.b}).`);
    const A = csomopontok[ia] ?? { x: 0, y: 0 };
    const B = csomopontok[ib] ?? { x: 1, y: 0 };
    const dx = B.x - A.x;
    const dy = B.y - A.y;
    const hossz = Math.hypot(dx, dy);
    if (hossz < EPS) hibak.push(`A(z) ${r.id ?? i + 1} rúd hossza nulla.`);
    return { id: String(r.id ?? rudId(r.a, r.b)), a: String(r.a), b: String(r.b), ia, ib, index: i, x1: A.x, y1: A.y, x2: B.x, y2: B.y, hossz, ex: dx / (hossz || 1), ey: dy / (hossz || 1) };
  });
  const tamaszok = (be.tamaszok ?? []).map((t, i) => {
    const ics = csIdx.get(String(t.csomopont));
    if (ics === undefined) hibak.push(`A(z) ${i + 1}. támasz ismeretlen csomóponton áll (${t.csomopont}).`);
    const tipus = t.tipus === "csuklo" ? "csuklo" : "gorgo";
    const szog = tipus === "gorgo" ? Number(t.szog ?? 90) : 90;
    return { csomopont: String(t.csomopont), ics, tipus, szog, ex: Math.cos((szog * Math.PI) / 180), ey: Math.sin((szog * Math.PI) / 180), index: i, jel: t.jel ?? (i === 0 ? "A" : i === 1 ? "B" : String.fromCharCode(67 + i - 2)) };
  });
  const terhek = csomopontok.map(() => ({ Fx: 0, Fy: 0 }));
  for (const t of be.terhek ?? []) {
    const ics = csIdx.get(String(t.csomopont));
    if (ics === undefined) {
      hibak.push(`Teher ismeretlen csomóponton (${t.csomopont}).`);
      continue;
    }
    terhek[ics].Fx += Number(t.Fx) || 0;
    terhek[ics].Fy += Number(t.Fy) || 0;
  }
  // csomópontonként a csatlakozó rudak: { rud, e: egységvektor a csomópontból a rúd másik vége felé }
  const csatlakozas = csomopontok.map(() => []);
  for (const r of rudak) {
    if (r.ia === undefined || r.ib === undefined) continue;
    csatlakozas[r.ia].push({ rud: r, ex: r.ex, ey: r.ey, masik: r.ib });
    csatlakozas[r.ib].push({ rud: r, ex: -r.ex, ey: -r.ey, masik: r.ia });
  }
  const k = tamaszok.reduce((s, t) => s + (t.tipus === "csuklo" ? 2 : 1), 0);
  const hatarozottsag = { r: rudak.length, k, c: csomopontok.length, e: 2 * csomopontok.length, i: rudak.length + k, tipus: "" };
  hatarozottsag.tipus = hatarozottsag.i < hatarozottsag.e ? "labilis" : hatarozottsag.i > hatarozottsag.e ? "hatarozatlan" : "hatarozott";
  return { hibak, csomopontok, rudak, tamaszok, terhek, csatlakozas, hatarozottsag };
}

/* ============================================================
   Lineáris egyenletrendszer (Gauss-elimináció főelem-kiválasztással)
   ============================================================ */

function gauss(A, b) {
  const n = A.length;
  const m = A[0]?.length ?? 0;
  const M = A.map((sor, i) => [...sor, b[i]]);
  let sor = 0;
  const pivotOszlopok = [];
  for (let osz = 0; osz < m && sor < n; osz++) {
    let leg = sor;
    for (let i = sor + 1; i < n; i++) if (Math.abs(M[i][osz]) > Math.abs(M[leg][osz])) leg = i;
    if (Math.abs(M[leg][osz]) < 1e-10) continue;
    [M[sor], M[leg]] = [M[leg], M[sor]];
    for (let i = 0; i < n; i++) {
      if (i === sor) continue;
      const f = M[i][osz] / M[sor][osz];
      if (f === 0) continue;
      for (let j = osz; j <= m; j++) M[i][j] -= f * M[sor][j];
    }
    pivotOszlopok.push(osz);
    sor++;
  }
  const rang = sor;
  if (rang < m) return { ok: false, rang };
  const x = new Array(m).fill(0);
  for (let i = 0; i < rang; i++) x[pivotOszlopok[i]] = M[i][m] / M[i][pivotOszlopok[i]];
  // ellentmondás?
  for (let i = rang; i < n; i++) if (Math.abs(M[i][m]) > 1e-7) return { ok: false, rang, ellentmondas: true };
  return { ok: true, x, rang };
}

/** A teljes egyenletrendszer megoldása: rúderők + reakciók. */
function globalisMegoldas(m) {
  const r = m.rudak.length;
  const reakcioOszlop = [];
  let osz = r;
  for (const t of m.tamaszok) {
    if (t.tipus === "csuklo") {
      reakcioOszlop.push({ t, x: osz, y: osz + 1 });
      osz += 2;
    } else {
      reakcioOszlop.push({ t, n: osz });
      osz += 1;
    }
  }
  const nIsm = osz;
  const A = [];
  const b = [];
  m.csomopontok.forEach((cs, i) => {
    const sx = new Array(nIsm).fill(0);
    const sy = new Array(nIsm).fill(0);
    for (const c of m.csatlakozas[i]) {
      sx[c.rud.index] += c.ex;
      sy[c.rud.index] += c.ey;
    }
    for (const ro of reakcioOszlop) {
      if (ro.t.ics !== i) continue;
      if (ro.t.tipus === "csuklo") {
        sx[ro.x] += 1;
        sy[ro.y] += 1;
      } else {
        sx[ro.n] += ro.t.ex;
        sy[ro.n] += ro.t.ey;
      }
    }
    A.push(sx, sy);
    b.push(-m.terhek[i].Fx, -m.terhek[i].Fy);
  });
  const g = gauss(A, b);
  if (!g.ok) return { ok: false, rang: g.rang, nIsm };
  const rudErok = {};
  m.rudak.forEach((rd) => {
    rudErok[rd.id] = Math.abs(g.x[rd.index]) < 1e-9 ? 0 : g.x[rd.index];
  });
  const reakciok = reakcioOszlop.map((ro) => {
    const cs = m.csomopontok[ro.t.ics];
    if (ro.t.tipus === "csuklo") {
      const Fx = Math.abs(g.x[ro.x]) < 1e-9 ? 0 : g.x[ro.x];
      const Fy = Math.abs(g.x[ro.y]) < 1e-9 ? 0 : g.x[ro.y];
      return { tamasz: ro.t.index, jel: ro.t.jel, csomopont: cs.id, tipus: "csuklo", Fx, Fy, nagysag: Math.hypot(Fx, Fy) };
    }
    const n = Math.abs(g.x[ro.n]) < 1e-9 ? 0 : g.x[ro.n];
    return { tamasz: ro.t.index, jel: ro.t.jel, csomopont: cs.id, tipus: "gorgo", szog: ro.t.szog, Fx: n * ro.t.ex, Fy: n * ro.t.ey, nagysag: n };
  });
  return { ok: true, rudErok, reakciok };
}

/* ============================================================
   Vakrudak — a három alapeset
   ============================================================ */

const parhuzamos = (u, v) => Math.abs(u.ex * v.ey - u.ey * v.ex) < 1e-7;

/**
 * A vakrudak felismerése a tankönyv 6.2.2. három alapesetével, iterálva.
 *   a) terheletlen csomópont két, nem egy egyenesbe eső rúddal → mindkettő vakrúd
 *   b) terheletlen csomópont három rúddal, kettő egy egyenesben → a harmadik vakrúd
 *   c) két rúd + a csomópont terhe (vagy ismert irányú reakciója) az egyik rúd egyenesében → a másik vakrúd
 * opciók.reakciok: a kiszámolt reakciók (ha adott, a csuklós/görgős csomópontokon is alkalmazható a c) eset).
 */
export function vakrudak(modell, opciok = {}) {
  const m = modell.csatlakozas ? modell : normalizal(modell);
  const reakciok = opciok.reakciok ?? null;
  const nulla = new Set();
  const indokok = [];
  // csomóponti külső erő: teher (+ reakció, ha ismert)
  const kulso = m.csomopontok.map((cs, i) => {
    let Fx = m.terhek[i].Fx;
    let Fy = m.terhek[i].Fy;
    const vanTeher = Math.hypot(Fx, Fy) > 1e-9;
    const tam = m.tamaszok.find((t) => t.ics === i);
    let reakcioIsmert = false;
    let nev = "terhe";
    if (tam) {
      const re = reakciok?.find((x) => x.csomopont === cs.id);
      if (re) {
        Fx += re.Fx;
        Fy += re.Fy;
        reakcioIsmert = true;
        nev = vanTeher ? "terhének és reakciójának eredője" : `${re.jel} reakciója`;
      }
    }
    return { Fx, Fy, tam, reakcioIsmert, nev };
  });

  let valtozott = true;
  let kor = 0;
  while (valtozott && kor++ < 50) {
    valtozott = false;
    m.csomopontok.forEach((cs, i) => {
      const aktiv = m.csatlakozas[i].filter((c) => !nulla.has(c.rud.id));
      const ku = kulso[i];
      const vanTeher = Math.hypot(ku.Fx, ku.Fy) > 1e-9;
      // ismert irányú, de ismeretlen nagyságú erő (görgő reakció, ha nincs kiszámolva): iránya (ex, ey)
      const iranyErok = [];
      if (vanTeher) iranyErok.push({ ex: ku.Fx, ey: ku.Fy, nev: ku.nev });
      if (ku.tam && !ku.reakcioIsmert) {
        if (ku.tam.tipus === "gorgo") iranyErok.push({ ex: ku.tam.ex, ey: ku.tam.ey, nev: `${ku.tam.jel} reakciója` });
        else return; // csukló ismeretlen irányú reakcióval: nincs szabály
      }
      const jegyez = (rudLista, eset, szoveg) => {
        const ujak = rudLista.filter((r) => !nulla.has(r.id));
        if (!ujak.length) return;
        for (const r of ujak) nulla.add(r.id);
        indokok.push({ rudak: ujak.map((r) => r.id), rud: ujak[0].id, csomopont: cs.id, eset, szoveg });
        valtozott = true;
      };
      if (iranyErok.length === 0) {
        if (aktiv.length === 2 && !parhuzamos(aktiv[0], aktiv[1])) {
          jegyez([aktiv[0].rud, aktiv[1].rud], "a", `${cs.id}. csomópont: terheletlen, csak a(z) ${aktiv[0].rud.id} és ${aktiv[1].rud.id} rúd csatlakozik, és nem esnek egy egyenesbe → a rájuk merőleges vetületi egyenletekből mindkettő vakrúd (a eset).`);
        } else if (aktiv.length === 3) {
          for (let p = 0; p < 3; p++) {
            const q = (p + 1) % 3;
            const s = (p + 2) % 3;
            if (parhuzamos(aktiv[q], aktiv[s]) && !parhuzamos(aktiv[p], aktiv[q])) {
              jegyez([aktiv[p].rud], "b", `${cs.id}. csomópont: terheletlen, a(z) ${aktiv[q].rud.id} és ${aktiv[s].rud.id} rúd egy egyenesbe esik → az egyenesükre merőleges vetületi egyenletből a(z) ${aktiv[p].rud.id} rúd vakrúd (b eset).`);
              break;
            }
          }
        }
      } else if (aktiv.length === 2 && iranyErok.length === 1) {
        const F = iranyErok[0];
        for (let p = 0; p < 2; p++) {
          const q = 1 - p;
          if (parhuzamos(aktiv[q], F) && !parhuzamos(aktiv[p], aktiv[q])) {
            jegyez([aktiv[p].rud], "c", `${cs.id}. csomópont: két rúd, és a csomópont ${F.nev} a(z) ${aktiv[q].rud.id} rúd egyenesébe esik → a rá merőleges vetületi egyenletből a(z) ${aktiv[p].rud.id} rúd vakrúd (c eset).`);
            break;
          }
        }
      }
    });
  }
  return { vakrudak: [...nulla], indokok };
}

/* ============================================================
   Vetületi / nyomatéki egyenlet szövegezése
   ============================================================ */

/** A vetületi egyenlet fejléce egy d irány esetén. */
function vetuletFej(d, mertRud) {
  if (Math.abs(d.ey) < 1e-9) return { fej: "\\Fx", tex: "\\Fx" };
  if (Math.abs(d.ex) < 1e-9) return { fej: "\\Fy", tex: "\\Fy" };
  const jel = mertRud ? `\\ (t\\perp ${rudTex(mertRud)})` : "";
  return { fej: "\\Ft", tex: `\\textstyle\\sum F_{it}\\!\\nearrow${jel}:\\ ` };
}

/** Egy irányra merőleges egységvektor (a pozitív a bal oldali: (−ey, ex)), y felfelé mutató változat. */
function meroleges(e) {
  let d = { ex: -e.ey, ey: e.ex };
  if (d.ey < -1e-9 || (Math.abs(d.ey) < 1e-9 && d.ex < 0)) d = { ex: -d.ex, ey: -d.ey };
  return d;
}

/* ============================================================
   Reakciók az egész szerkezet egyensúlyából
   ============================================================ */

function nyomatekTagok(m, P, csIdxLista = null) {
  // a terhek nyomatéka a P pontra: (x−Px)·Fy − (y−Py)·Fx
  const tagok = [];
  let ossz = 0;
  m.csomopontok.forEach((cs, i) => {
    if (csIdxLista && !csIdxLista.has(i)) return;
    const t = m.terhek[i];
    if (Math.abs(t.Fy) > 1e-9) {
      const kar = cs.x - P.x;
      if (Math.abs(kar) > 1e-9) tagok.push(tagSzorzat(kar, t.Fy));
      ossz += kar * t.Fy;
    }
    if (Math.abs(t.Fx) > 1e-9) {
      const kar = -(cs.y - P.y);
      if (Math.abs(kar) > 1e-9) tagok.push(tagSzorzat(kar, t.Fx));
      ossz += kar * t.Fx;
    }
  });
  return { tagok, ossz };
}

/** „± |kar|·|F|” a szorzat előjelével. */
function tagSzorzat(kar, F) {
  const v = kar * F;
  return `${v < 0 ? "-" : "+"} ${f4(Math.abs(kar))}\\cdot ${f4(Math.abs(F))}`;
}

function reakcioLepesek(m, reakciok) {
  const lepesek = [];
  const csuklok = m.tamaszok.filter((t) => t.tipus === "csuklo");
  const gorgok = m.tamaszok.filter((t) => t.tipus === "gorgo");
  const sumFx = m.terhek.reduce((s, t) => s + t.Fx, 0);
  const sumFy = m.terhek.reduce((s, t) => s + t.Fy, 0);
  const re = (t) => reakciok.find((x) => x.tamasz === t.index);

  if (csuklok.length === 1 && gorgok.length === 1) {
    const A = csuklok[0];
    const B = gorgok[0];
    const PA = m.csomopontok[A.ics];
    const PB = m.csomopontok[B.ics];
    const rA = re(A);
    const rB = re(B);
    const karB = (PB.x - PA.x) * B.ey - (PB.y - PA.y) * B.ex;
    const nt = nyomatekTagok(m, PA);
    const Bj = B.jel;
    const Aj = A.jel;
    lepesek.push({
      cim: `Nyomatéki egyenlet az ${Aj} csuklóra → ${Bj}`,
      fej: `\\Mp{${Aj}}`,
      tex: `\\Mp{${Aj}} ${nt.tagok.join(" ")} ${tagS(karB, Bj)} = 0 \\;\\Rightarrow\\; ${Bj} = ${kNszoveg(rB.nagysag)}`,
      nev: Bj,
      ertek: rB.nagysag,
      magyarazat: `A csuklón átmegy ${Aj}_x és ${Aj}_y hatásvonala, egyedül a görgő ${Bj} reakciója marad (karja ${f4(Math.abs(karB))} m).`,
    });
    const bx = rB.nagysag * B.ex;
    const by = rB.nagysag * B.ey;
    lepesek.push({
      cim: `Vízszintes vetületi egyenlet → ${Aj}_x`,
      fej: "\\Fx",
      tex: `\\Fx ${Aj}_x ${Math.abs(sumFx) > 1e-9 ? tagE(sumFx) : ""} ${Math.abs(bx) > 1e-9 ? tagE(bx) : ""} = 0 \\;\\Rightarrow\\; ${Aj}_x = ${kNszoveg(rA.Fx)}`,
      nev: `${Aj}_x`,
      ertek: rA.Fx,
    });
    lepesek.push({
      cim: `Függőleges vetületi egyenlet → ${Aj}_y`,
      fej: "\\Fy",
      tex: `\\Fy ${Aj}_y ${Math.abs(sumFy) > 1e-9 ? tagE(sumFy) : ""} ${Math.abs(by) > 1e-9 ? tagE(by) : ""} = 0 \\;\\Rightarrow\\; ${Aj}_y = ${kNszoveg(rA.Fy)}`,
      nev: `${Aj}_y`,
      ertek: rA.Fy,
    });
    const ntB = nyomatekTagok(m, PB);
    const karAy = PA.x - PB.x;
    const karAx = -(PA.y - PB.y);
    const ell = ntB.ossz + karAy * rA.Fy + karAx * rA.Fx;
    lepesek.push({
      cim: `Ellenőrzés — nyomatéki egyenlet a ${Bj} görgőre`,
      fej: `\\Mp{${Bj}}`,
      tex: `\\Mp{${Bj}} ${ntB.tagok.join(" ")} ${Math.abs(karAy) > 1e-9 && Math.abs(rA.Fy) > 1e-9 ? tagSzorzat(karAy, rA.Fy) : ""} ${Math.abs(karAx) > 1e-9 && Math.abs(rA.Fx) > 1e-9 ? tagSzorzat(karAx, rA.Fx) : ""} = ${f4(ell)} \\approx 0\\ \\checkmark`,
      ellenorzes: true,
      ertek: ell,
    });
    return lepesek;
  }

  if (csuklok.length === 2 && gorgok.length === 0) {
    // háromcsuklós rendszer: keressük a két merev részt összekötő csomópontot
    const A = csuklok[0];
    const B = csuklok[1];
    const PA = m.csomopontok[A.ics];
    const PB = m.csomopontok[B.ics];
    const rA = re(A);
    const rB = re(B);
    const C = kozosCsomopont(m, A.ics, B.ics);
    const Aj = A.jel;
    const Bj = B.jel;
    if (C && Math.abs(PA.y - PB.y) < 1e-9) {
      const nt = nyomatekTagok(m, PA);
      const karB = PB.x - PA.x;
      lepesek.push({ cim: `Egész szerkezet: nyomatéki egyenlet ${Aj}-ra → ${Bj}_y`, fej: `\\Mp{${Aj}}`, tex: `\\Mp{${Aj}} ${nt.tagok.join(" ")} ${tagS(karB, `${Bj}_y`)} = 0 \\;\\Rightarrow\\; ${Bj}_y = ${kNszoveg(rB.Fy)}`, nev: `${Bj}_y`, ertek: rB.Fy });
      const ntB = nyomatekTagok(m, PB);
      lepesek.push({ cim: `Egész szerkezet: nyomatéki egyenlet ${Bj}-re → ${Aj}_y`, fej: `\\Mp{${Bj}}`, tex: `\\Mp{${Bj}} ${ntB.tagok.join(" ")} ${tagS(-karB, `${Aj}_y`)} = 0 \\;\\Rightarrow\\; ${Aj}_y = ${kNszoveg(rA.Fy)}`, nev: `${Aj}_y`, ertek: rA.Fy });
      // az A-t tartalmazó rész nyomatéka a C csomópontra (a C-ben ható rúderők átmennek C-n)
      const PC = m.csomopontok[C.index];
      const ntC = nyomatekTagok(m, PC, C.reszA);
      const karAy = PA.x - PC.x;
      const karAx = -(PA.y - PC.y);
      lepesek.push({
        cim: `Az ${Aj} oldali rész: nyomatéki egyenlet a(z) ${PC.id} kapcsoló csomópontra → ${Aj}_x`,
        fej: `\\Mp{${PC.id}}`,
        tex: `\\Mp{${PC.id}} ${ntC.tagok.join(" ")} ${Math.abs(karAy) > 1e-9 && Math.abs(rA.Fy) > 1e-9 ? tagSzorzat(karAy, rA.Fy) : ""} ${tagS(karAx, `${Aj}_x`)} = 0 \\;\\Rightarrow\\; ${Aj}_x = ${kNszoveg(rA.Fx)}`,
        nev: `${Aj}_x`,
        ertek: rA.Fx,
        magyarazat: `A(z) ${PC.id} csomópontban a két rész csak egy ponton kapcsolódik (a két rúd erője átmegy rajta), ezért az egyik rész egyensúlya külön is felírható — mint a háromcsuklós tartónál.`,
      });
      lepesek.push({ cim: `Egész szerkezet: vízszintes vetületi egyenlet → ${Bj}_x`, fej: "\\Fx", tex: `\\Fx ${Aj}_x + ${Bj}_x ${Math.abs(sumFx) > 1e-9 ? tagE(sumFx) : ""} = 0 \\;\\Rightarrow\\; ${Bj}_x = ${kNszoveg(rB.Fx)}`, nev: `${Bj}_x`, ertek: rB.Fx });
      const ell = rA.Fy + rB.Fy + sumFy;
      lepesek.push({ cim: "Ellenőrzés — függőleges vetületi egyenlet", fej: "\\Fy", tex: `\\Fy ${tagE(rA.Fy)} ${tagE(rB.Fy)} ${tagE(sumFy)} = ${f4(ell)} \\approx 0\\ \\checkmark`, ellenorzes: true, ertek: ell });
      return lepesek;
    }
  }

  // általános eset: a három (vagy több) egyenletből álló rendszer numerikus megoldása
  for (const r of reakciok) {
    if (r.tipus === "csuklo") {
      lepesek.push({ cim: `${r.jel} csukló`, fej: "", tex: `${r.jel}_x = ${kNszoveg(r.Fx)},\\quad ${r.jel}_y = ${kNszoveg(r.Fy)}`, nev: r.jel, ertek: r.nagysag, altalanos: true });
    } else {
      lepesek.push({ cim: `${r.jel} görgő`, fej: "", tex: `${r.jel} = ${kNszoveg(r.nagysag)}`, nev: r.jel, ertek: r.nagysag, altalanos: true });
    }
  }
  return lepesek;
}

/** Két csuklós támasz esetén a két merev részt összekötő csomópont (ha van): eltávolítva a gráf két részre esik, mindkettőben egy támasz. */
function kozosCsomopont(m, iA, iB) {
  for (let c = 0; c < m.csomopontok.length; c++) {
    if (c === iA || c === iB) continue;
    const komp = komponensek(m, new Set(), new Set([c]));
    if (komp.length !== 2) continue;
    const kA = komp.find((k) => k.has(iA));
    const kB = komp.find((k) => k.has(iB));
    if (kA && kB && kA !== kB) return { index: c, reszA: kA, reszB: kB };
  }
  return null;
}

/** Összefüggő komponensek a rudak gráfjában, a kihagyott rudak és csomópontok nélkül. */
function komponensek(m, kihagyottRudak, kihagyottCsomopontok = new Set()) {
  const latott = new Set();
  const komp = [];
  for (let s = 0; s < m.csomopontok.length; s++) {
    if (latott.has(s) || kihagyottCsomopontok.has(s)) continue;
    const halmaz = new Set([s]);
    const sor = [s];
    latott.add(s);
    while (sor.length) {
      const i = sor.pop();
      for (const c of m.csatlakozas[i]) {
        if (kihagyottRudak.has(c.rud.id) || kihagyottCsomopontok.has(c.masik) || latott.has(c.masik)) continue;
        latott.add(c.masik);
        halmaz.add(c.masik);
        sor.push(c.masik);
      }
    }
    komp.push(halmaz);
  }
  return komp;
}

/* ============================================================
   Csomóponti módszer — a lépések sorrendje és egyenletei
   ============================================================ */

/** A csomópontra ható ismert erők (teher, reakció, ismert rúderők) d irányú vetületének tagjai és összege. */
function ismertVetulet(m, i, d, ismert, reakciok) {
  const cs = m.csomopontok[i];
  const tagok = [];
  let ossz = 0;
  const t = m.terhek[i];
  const tv = t.Fx * d.ex + t.Fy * d.ey;
  if (Math.abs(tv) > 1e-9) {
    tagok.push(tagE(tv));
    ossz += tv;
  }
  const re = reakciok.find((x) => x.csomopont === cs.id);
  if (re) {
    const rv = re.Fx * d.ex + re.Fy * d.ey;
    if (Math.abs(rv) > 1e-9) {
      tagok.push(tagE(rv));
      ossz += rv;
    }
  }
  for (const c of m.csatlakozas[i]) {
    if (!(c.rud.id in ismert)) continue;
    const coef = c.ex * d.ex + c.ey * d.ey;
    if (Math.abs(coef) < 1e-9) continue;
    const S = ismert[c.rud.id];
    if (Math.abs(S) < 1e-9) {
      tagok.push(`${coef < 0 ? "-" : "+"} ${Math.abs(Math.abs(coef) - 1) < 1e-6 ? "" : `${f4(Math.abs(coef))}\\cdot `}0`);
      continue;
    }
    tagok.push(tagSz(coef, S));
    ossz += coef * S;
  }
  return { tagok, ossz };
}

/**
 * Egy csomópont egy lépése: kiválasztja a megoldható ismeretleneket és megírja az egyenleteket.
 * Visszatér null-lal, ha a csomópontban most nem lehet új rúderőt számolni.
 */
function csomopontLepes(m, i, ismert, reakciok, rudErok) {
  const cs = m.csomopontok[i];
  const ism = m.csatlakozas[i].filter((c) => !(c.rud.id in ismert));
  if (ism.length === 0) return null;
  const egyenletek = [];
  const eredmenyek = {};
  const ujIsmert = { ...ismert };

  const irjEgyenlet = (d, cel, mertRud) => {
    const fej = vetuletFej(d, mertRud);
    const iv = ismertVetulet(m, i, d, ujIsmert, reakciok);
    const coef = cel.ex * d.ex + cel.ey * d.ey;
    const S = rudErok[cel.rud.id];
    const tex = `${fej.tex} ${iv.tagok.join(" ")} ${tagS(coef, rudTex(cel.rud.id))} = 0 \\;\\Rightarrow\\; ${rudTex(cel.rud.id)} = ${kNszoveg(S)}`;
    egyenletek.push({ fej: fej.fej, tex, rud: cel.rud.id, ertek: S, jelleg: jelleg(S), irany: d });
    eredmenyek[cel.rud.id] = S;
    ujIsmert[cel.rud.id] = S;
  };

  if (ism.length === 1) {
    const c = ism[0];
    const d = Math.abs(c.ex) >= Math.abs(c.ey) ? { ex: 1, ey: 0 } : { ex: 0, ey: 1 };
    irjEgyenlet(d, c, null);
    // a másik egyenlet ellenőrzés
    const d2 = d.ex === 1 ? { ex: 0, ey: 1 } : { ex: 1, ey: 0 };
    const fej2 = vetuletFej(d2, null);
    const iv2 = ismertVetulet(m, i, d2, ujIsmert, reakciok);
    egyenletek.push({ fej: fej2.fej, tex: `${fej2.tex} ${iv2.tagok.length ? iv2.tagok.join(" ") : "0"} = ${f4(iv2.ossz)} \\approx 0\\ \\checkmark`, ellenorzes: true, ertek: iv2.ossz });
    return { csomopont: cs.id, ismeretlenek: [c.rud.id], egyenletek, eredmenyek, mod: "egy" };
  }

  if (ism.length === 2) {
    const [p, q] = ism;
    if (parhuzamos(p, q)) return null; // két egy egyenesbe eső ismeretlen: nem számolható innen
    // 1. egyenlet: a q-ra merőleges vetület → p; 2.: a p-re merőleges (ha p vízszintes/függőleges), különben kényelmes irány
    // Ha az egyik rúd vízszintes vagy függőleges, kezdjük azzal, amelyikre könnyebb merőlegest írni.
    const kenyelmes = (c) => Math.abs(c.ex) < 1e-9 || Math.abs(c.ey) < 1e-9;
    let elso = p;
    let masodik = q;
    if (kenyelmes(p) && !kenyelmes(q)) {
      elso = q;
      masodik = p;
    }
    // elso-t a masodik-ra merőleges vetületből
    const d1 = meroleges(masodik);
    irjEgyenlet(d1, elso, kenyelmes(masodik) ? null : masodik.rud.id);
    // masodik: ha elso kényelmes, a rá merőleges (kizárja); különben kényelmes irány, benne az elso már ismert értékével
    let d2;
    if (kenyelmes(elso)) d2 = meroleges(elso);
    else d2 = Math.abs(masodik.ex) >= Math.abs(masodik.ey) ? { ex: 1, ey: 0 } : { ex: 0, ey: 1 };
    if (Math.abs(masodik.ex * d2.ex + masodik.ey * d2.ey) < 1e-9) d2 = meroleges(elso);
    irjEgyenlet(d2, masodik, null);
    return { csomopont: cs.id, ismeretlenek: [elso.rud.id, masodik.rud.id], egyenletek, eredmenyek, mod: "ketto" };
  }

  // három vagy több ismeretlen: ha az egyiken kívül a többi mind egy egyenesbe esik, a rá merőleges vetületből az az egy számolható
  for (const k of ism) {
    const tobbi = ism.filter((c) => c !== k);
    const mindPar = tobbi.every((c) => parhuzamos(c, tobbi[0]));
    if (!mindPar || parhuzamos(k, tobbi[0])) continue;
    const d = meroleges(tobbi[0]);
    irjEgyenlet(d, k, kenyelmesIrany(d) ? null : tobbi[0].rud.id);
    return { csomopont: cs.id, ismeretlenek: [k.rud.id], egyenletek, eredmenyek, mod: "harom", kozosEgyenes: tobbi.map((c) => c.rud.id) };
  }
  return null;
}

const kenyelmesIrany = (d) => Math.abs(d.ex) < 1e-9 || Math.abs(d.ey) < 1e-9;

/**
 * A csomóponti módszer teljes lefuttatása.
 * sorrend: "sorban" (a csomópontok sorrendjében az első megoldható) | "kevesebb" (mindig a legkevesebb ismeretlenű)
 */
function csomopontiModszer(m, reakciok, rudErok, sorrend = "sorban") {
  const ismert = {};
  const lepesek = [];
  const hasznalt = new Set();
  let vedo = 0;
  while (Object.keys(ismert).length < m.rudak.length && vedo++ < 4 * m.csomopontok.length + 10) {
    let talalt = null;
    const jeloltek = [];
    for (let i = 0; i < m.csomopontok.length; i++) {
      const lp = csomopontLepes(m, i, ismert, reakciok, rudErok);
      if (!lp) continue;
      if (sorrend === "sorban") {
        talalt = lp;
        break;
      }
      jeloltek.push(lp);
    }
    if (!talalt && jeloltek.length) {
      jeloltek.sort((a, b) => m.csatlakozas[m.csomopontok.findIndex((c) => c.id === a.csomopont)].filter((c) => !(c.rud.id in ismert)).length - m.csatlakozas[m.csomopontok.findIndex((c) => c.id === b.csomopont)].filter((c) => !(c.rud.id in ismert)).length);
      talalt = jeloltek[0];
    }
    if (!talalt) break;
    Object.assign(ismert, talalt.eredmenyek);
    hasznalt.add(talalt.csomopont);
    lepesek.push(talalt);
  }
  // a nem használt csomópontok egyenletei: ellenőrzés
  const ellenorzesek = [];
  m.csomopontok.forEach((cs, i) => {
    if (m.csatlakozas[i].length === 0) return;
    const mind = m.csatlakozas[i].every((c) => c.rud.id in ismert);
    if (!mind) return;
    const egyenletek = [];
    for (const d of [{ ex: 1, ey: 0 }, { ex: 0, ey: 1 }]) {
      const fej = vetuletFej(d, null);
      const iv = ismertVetulet(m, i, d, ismert, reakciok);
      egyenletek.push({ fej: fej.fej, tex: `${fej.tex} ${iv.tagok.length ? iv.tagok.join(" ") : "0"} = ${f4(iv.ossz)} \\approx 0\\ \\checkmark`, ertek: iv.ossz });
    }
    ellenorzesek.push({ csomopont: cs.id, hasznalt: hasznalt.has(cs.id), egyenletek });
  });
  return { lepesek, ellenorzesek, hianyzo: m.rudak.filter((r) => !(r.id in ismert)).map((r) => r.id) };
}

/* ============================================================
   A fő függvény
   ============================================================ */

export function racsosMegold(modell, opciok = {}) {
  const m = normalizal(modell);
  const alap = { ok: false, hibak: m.hibak, hatarozottsag: m.hatarozottsag, csomopontok: m.csomopontok, rudak: m.rudak, tamaszok: m.tamaszok, terhek: m.terhek, csatlakozas: m.csatlakozas };
  if (m.hibak.length) return alap;
  if (m.hatarozottsag.tipus !== "hatarozott") {
    const uz = m.hatarozottsag.tipus === "labilis" ? `A szerkezet labilis: ${m.hatarozottsag.i} ismeretlen, ${m.hatarozottsag.e} egyenlet (2c > r + k).` : `A szerkezet statikailag határozatlan: ${m.hatarozottsag.i} ismeretlen, ${m.hatarozottsag.e} egyenlet (r + k > 2c) — a rúderők az egyensúlyi egyenletekből nem egyértelműek.`;
    return { ...alap, hibak: [uz] };
  }
  const g = globalisMegoldas(m);
  if (!g.ok) {
    return { ...alap, hatarozottsag: { ...m.hatarozottsag, tipus: "degeneralt" }, hibak: ["A szerkezet degenerált (2c = r + k, de az egyenletrendszer szinguláris): a rudak elrendezése nem merev."] };
  }
  const vk = vakrudak(m, { reakciok: g.reakciok });
  const cm = csomopontiModszer(m, g.reakciok, g.rudErok, opciok.sorrend ?? "sorban");
  const rudTabla = m.rudak.map((r) => ({ id: r.id, S: g.rudErok[r.id], jelleg: jelleg(g.rudErok[r.id]), huzo: g.rudErok[r.id] > 1e-9 ? g.rudErok[r.id] : 0, nyomo: g.rudErok[r.id] < -1e-9 ? -g.rudErok[r.id] : 0 }));
  return {
    ...alap,
    ok: true,
    hibak: [],
    reakciok: g.reakciok,
    rudErok: g.rudErok,
    rudTabla,
    vakrudak: vk.vakrudak,
    vakrudIndokok: vk.indokok,
    reakcioLepesek: reakcioLepesek(m, g.reakciok),
    csomopontiSorrend: cm.lepesek,
    ellenorzesek: cm.ellenorzesek,
    hianyzo: cm.hianyzo,
    maxS: Math.max(1e-9, ...m.rudak.map((r) => Math.abs(g.rudErok[r.id]))),
  };
}

/* ============================================================
   Átmetszés (hármas, négyes)
   ============================================================ */

function metszespont(P, e, Q, f) {
  // P + t·e = Q + s·f
  const det = e.ex * f.ey - e.ey * f.ex;
  if (Math.abs(det) < 1e-9) return null;
  const dx = Q.x - P.x;
  const dy = Q.y - P.y;
  const t = (dx * f.ey - dy * f.ex) / det;
  return { x: P.x + t * e.ex, y: P.y + t * e.ey };
}

/**
 * Átmetszés: a rudIds rudakat elvágjuk; oldal: "bal" | "jobb" | csomópont-azonosító (melyik részt vizsgáljuk).
 * opciok.ismert: már ismert rúderők azonosítói (négyes átmetszés második lépéséhez).
 * opciok.eredmeny: a racsosMegold eredménye (ha nincs, kiszámoljuk).
 */
export function atmetszes(modell, rudIds, oldal = "bal", opciok = {}) {
  const e0 = opciok.eredmeny ?? racsosMegold(modell);
  if (!e0.ok) return { ok: false, hibak: e0.hibak };
  const m = e0;
  const vagott = new Set(rudIds.map(String));
  const komp = komponensek(m, vagott);
  if (komp.length !== 2) return { ok: false, hibak: [komp.length < 2 ? "Az átmetszés nem vágja két részre a tartót — több (vagy más) rudat kell átvágni." : "Az átmetszés kettőnél több részre vágja a tartót."] };
  for (const id of vagott) {
    const r = m.rudak.find((x) => x.id === id);
    if (!r) return { ok: false, hibak: [`Nincs ${id} rúd.`] };
    const kA = komp.findIndex((k) => k.has(r.ia));
    const kB = komp.findIndex((k) => k.has(r.ib));
    if (kA === kB) return { ok: false, hibak: [`A(z) ${id} rúd mindkét vége ugyanabban a részben van — ez a rúd nem választja el a két részt (fölösleges vágás).`] };
  }
  let resz;
  if (oldal === "bal" || oldal === "jobb") {
    const atlagX = komp.map((k) => [...k].reduce((s, i) => s + m.csomopontok[i].x, 0) / k.size);
    resz = oldal === "bal" ? (atlagX[0] <= atlagX[1] ? komp[0] : komp[1]) : atlagX[0] > atlagX[1] ? komp[0] : komp[1];
  } else {
    const ics = m.csomopontok.findIndex((c) => c.id === String(oldal));
    resz = komp.find((k) => k.has(ics)) ?? komp[0];
  }
  const ismertIds = new Set((opciok.ismert ?? []).map(String));
  // az átvágott rudak a rész felőli csomóponttal és a húzó egységvektorral (a csomópontból a rúd másik vége felé)
  const vagottRudak = [...vagott].map((id) => {
    const r = m.rudak.find((x) => x.id === id);
    const reszben = resz.has(r.ia) ? r.ia : r.ib;
    const cs = m.csomopontok[reszben];
    const e = reszben === r.ia ? { ex: r.ex, ey: r.ey } : { ex: -r.ex, ey: -r.ey };
    return { id, csomopont: cs.id, P: { x: cs.x, y: cs.y }, e, S: m.rudErok[id], ismert: ismertIds.has(id) };
  });
  const ismeretlenek = vagottRudak.filter((r) => !r.ismert);
  const ismertek = vagottRudak.filter((r) => r.ismert);
  // a részre ható külső erők: terhek + reakciók a rész csomópontjain
  const kulsoErok = [];
  // a terhek sorszáma a csomópontok sorrendjében (F_1, F_2, …) az egész tartón
  const teherSorszam = new Map();
  m.csomopontok.forEach((cs, i) => {
    if (Math.hypot(m.terhek[i].Fx, m.terhek[i].Fy) > 1e-9) teherSorszam.set(i, teherSorszam.size + 1);
  });
  for (const i of resz) {
    const cs = m.csomopontok[i];
    const t = m.terhek[i];
    if (Math.hypot(t.Fx, t.Fy) > 1e-9) kulsoErok.push({ nev: `F_{${teherSorszam.get(i)}}`, csomopont: cs.id, P: { x: cs.x, y: cs.y }, Fx: t.Fx, Fy: t.Fy, teher: true });
    const re = m.reakciok.find((x) => x.csomopont === cs.id);
    if (re && Math.hypot(re.Fx, re.Fy) > 1e-9) kulsoErok.push({ nev: re.jel, P: { x: cs.x, y: cs.y }, Fx: re.Fx, Fy: re.Fy, reakcio: true });
  }
  for (const r of ismertek) kulsoErok.push({ nev: rudTex(r.id), P: r.P, Fx: r.S * r.e.ex, Fy: r.S * r.e.ey, rud: r.id, S: r.S });

  const nyomatekTagokRol = (P) => {
    const tagok = [];
    let ossz = 0;
    for (const f of kulsoErok) {
      if (Math.abs(f.Fy) > 1e-9) {
        const kar = f.P.x - P.x;
        if (Math.abs(kar) > 1e-9) tagok.push(tagSzorzat(kar, f.Fy));
        ossz += kar * f.Fy;
      }
      if (Math.abs(f.Fx) > 1e-9) {
        const kar = -(f.P.y - P.y);
        if (Math.abs(kar) > 1e-9) tagok.push(tagSzorzat(kar, f.Fx));
        ossz += kar * f.Fx;
      }
    }
    return { tagok, ossz };
  };
  const vetuletTagok = (d) => {
    const tagok = [];
    let ossz = 0;
    for (const f of kulsoErok) {
      const v = f.Fx * d.ex + f.Fy * d.ey;
      if (Math.abs(v) < 1e-9) continue;
      tagok.push(tagE(v));
      ossz += v;
    }
    return { tagok, ossz };
  };
  const pontNev = (P) => {
    const cs = m.csomopontok.find((c) => Math.hypot(c.x - P.x, c.y - P.y) < 1e-6);
    return cs ? cs.id : null;
  };

  const egyenletek = [];
  let fopontSzam = 0;
  for (const u of ismeretlenek) {
    const tobbi = ismeretlenek.filter((x) => x !== u);
    let egy = null;
    if (tobbi.length === 0) {
      const d = Math.abs(u.e.ex) >= Math.abs(u.e.ey) ? { ex: 1, ey: 0 } : { ex: 0, ey: 1 };
      const fej = vetuletFej(d, null);
      const vt = vetuletTagok(d);
      const coef = u.e.ex * d.ex + u.e.ey * d.ey;
      egy = { rud: u.id, fej: fej.fej, tex: `${fej.tex} ${vt.tagok.join(" ")} ${tagS(coef, rudTex(u.id))} = 0 \\;\\Rightarrow\\; ${rudTex(u.id)} = ${kNszoveg(u.S)}`, S: u.S, fopont: null };
    } else if (tobbi.every((x) => parhuzamos(x.e, tobbi[0].e))) {
      // a többi párhuzamos: a rájuk merőleges vetületi egyenlet
      const d = meroleges(tobbi[0].e);
      const coef = u.e.ex * d.ex + u.e.ey * d.ey;
      if (Math.abs(coef) > 1e-9) {
        const fej = vetuletFej(d, kenyelmesIrany(d) ? null : tobbi[0].id);
        const vt = vetuletTagok(d);
        egy = { rud: u.id, fej: fej.fej, tex: `${fej.tex} ${vt.tagok.join(" ")} ${tagS(coef, rudTex(u.id))} = 0 \\;\\Rightarrow\\; ${rudTex(u.id)} = ${kNszoveg(u.S)}`, S: u.S, fopont: null, parhuzamosak: tobbi.map((x) => x.id) };
      }
    } else {
      // közös pont a többi hatásvonalán?
      let P = null;
      let jo = true;
      for (let a = 0; a < tobbi.length && jo; a++) {
        for (let b = a + 1; b < tobbi.length && jo; b++) {
          const Q = metszespont(tobbi[a].P, tobbi[a].e, tobbi[b].P, tobbi[b].e);
          if (!Q) continue;
          if (!P) P = Q;
          else if (Math.hypot(P.x - Q.x, P.y - Q.y) > 1e-6) jo = false;
        }
      }
      if (P && jo) {
        // minden „többi” hatásvonala átmegy P-n?
        const mindAt = tobbi.every((x) => Math.abs((P.x - x.P.x) * x.e.ey - (P.y - x.P.y) * x.e.ex) < 1e-6);
        if (mindAt) {
          const kar = (u.P.x - P.x) * u.e.ey - (u.P.y - P.y) * u.e.ex;
          if (Math.abs(kar) > 1e-9) {
            const nev = pontNev(P) ?? `P_{${++fopontSzam}}`;
            const nt = nyomatekTagokRol(P);
            egy = {
              rud: u.id,
              fej: `\\Mp{${nev}}`,
              tex: `\\Mp{${nev}} ${nt.tagok.join(" ")} ${tagS(kar, rudTex(u.id))} = 0 \\;\\Rightarrow\\; ${rudTex(u.id)} = ${kNszoveg(u.S)}`,
              S: u.S,
              fopont: { nev, x: P.x, y: P.y, csomopont: pontNev(P) },
              kar,
            };
          }
        }
      }
    }
    if (!egy) egy = { rud: u.id, fej: "", tex: `${rudTex(u.id)} = ${kNszoveg(u.S)}`, S: u.S, fopont: null, nincsEgyismeretlenes: true };
    egyenletek.push(egy);
  }
  // ellenőrzés: egy nem használt vetületi egyenlet az összes (immár ismert) erővel
  let ellenorzes = null;
  const hasznaltFej = new Set(egyenletek.map((e) => e.fej));
  const dEll = !hasznaltFej.has("\\Fx") ? { ex: 1, ey: 0 } : !hasznaltFej.has("\\Fy") ? { ex: 0, ey: 1 } : null;
  if (dEll && ismeretlenek.every((u) => !egyenletek.find((e) => e.rud === u.id)?.nincsEgyismeretlenes)) {
    const fej = vetuletFej(dEll, null);
    const vt = vetuletTagok(dEll);
    const tagok = [...vt.tagok];
    let ossz = vt.ossz;
    for (const u of ismeretlenek) {
      const coef = u.e.ex * dEll.ex + u.e.ey * dEll.ey;
      if (Math.abs(coef) < 1e-9) continue;
      tagok.push(tagSz(coef, u.S));
      ossz += coef * u.S;
    }
    ellenorzes = { fej: fej.fej, tex: `${fej.tex} ${tagok.length ? tagok.join(" ") : "0"} = ${f4(ossz)} \\approx 0\\ \\checkmark`, ertek: ossz };
  }
  return {
    ok: true,
    hibak: [],
    resz: [...resz].map((i) => m.csomopontok[i].id),
    masikResz: [...(komp[0] === resz ? komp[1] : komp[0])].map((i) => m.csomopontok[i].id),
    rudak: vagottRudak,
    kulsoErok,
    egyenletek,
    ellenorzes,
    megoldhato: egyenletek.every((e) => !e.nincsEgyismeretlenes),
  };
}

/* ============================================================
   Vonallal átvágott rudak (interaktív átmetszés)
   ============================================================ */

function szakaszokMetszik(a, b, c, d) {
  const ker = (p, q, r) => (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x);
  const d1 = ker(c, d, a);
  const d2 = ker(c, d, b);
  const d3 = ker(a, b, c);
  const d4 = ker(a, b, d);
  return ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0));
}

/** A p1–p2 szakasz (modell-koordinátákban) által átvágott rudak azonosítói. */
export function atvagottRudak(modell, p1, p2) {
  const m = modell.csatlakozas ? modell : normalizal(modell);
  return m.rudak.filter((r) => szakaszokMetszik(p1, p2, { x: r.x1, y: r.y1 }, { x: r.x2, y: r.y2 })).map((r) => r.id);
}

/** Töröttvonal (pontok listája) által átvágott rudak. */
export function atvagottRudakVonal(modell, pontok) {
  const s = new Set();
  for (let i = 0; i + 1 < pontok.length; i++) for (const id of atvagottRudak(modell, pontok[i], pontok[i + 1])) s.add(id);
  return [...s];
}

/* ============================================================
   Paraméteres sablonok
   ============================================================ */

/**
 * sablon(tipus, opciok) → modell (terhek nélkül, vagy opciok.terhek-kel)
 *   "parhuzamos": párhuzamos övű, n mező, a mezőszélesség, h magasság, racs: "V" (H07: a rácsrudak a középső alsó csomópont felé lejtenek) | "N" | "Z"
 *                 felső csomópontok 1…n+1, alsók n+2…2n+2; támaszok az alsó öv két végén
 *   "warren":     háromszögrácsozás (tankönyv 6.1), n háromszög-pár; alsó csomópontok páratlan, felsők páros sorszámúak
 *   "haromszog":  nyeregtető (tankönyv 6.3.e-szerű), n mező, magasság h a középen
 *   "k":          K-rácsozás, n mező, magasság 2h (középső csomópontok az oszlopokon)
 *   "trapez":     vizsga-minta: alsó öv vízszintes, felső öv h0-ról h1-re emelkedik, rácsrudak balra dőlnek
 */
export function sablon(tipus, o = {}) {
  const n = o.n ?? 4;
  const a = o.a ?? 2;
  const h = o.h ?? 1.5;
  const csomopontok = [];
  const rudak = [];
  const rud = (p, q) => rudak.push({ id: rudId(p, q), a: String(p), b: String(q) });
  let tamaszok = [];
  let felso = [];
  let also = [];
  if (tipus === "parhuzamos" || tipus === "trapez") {
    const h0 = tipus === "trapez" ? (o.h0 ?? 5) : h;
    const h1 = tipus === "trapez" ? (o.h1 ?? 9) : h;
    for (let i = 0; i <= n; i++) csomopontok.push({ id: String(i + 1), x: i * a, y: h0 + ((h1 - h0) * i) / n });
    for (let i = 0; i <= n; i++) csomopontok.push({ id: String(n + 2 + i), x: i * a, y: 0 });
    felso = csomopontok.slice(0, n + 1).map((c) => c.id);
    also = csomopontok.slice(n + 1).map((c) => c.id);
    for (let i = 0; i < n; i++) {
      rud(felso[i], felso[i + 1]);
      rud(also[i], also[i + 1]);
    }
    for (let i = 0; i <= n; i++) rud(felso[i], also[i]);
    const racs = o.racs ?? (tipus === "trapez" ? "Z" : "V");
    for (let i = 0; i < n; i++) {
      if (racs === "V") {
        // a rácsrudak a középső alsó csomópont felé lejtenek (H07 / tankönyv 6.6)
        if (i < n / 2) rud(felso[i], also[i + 1]);
        else rud(also[i], felso[i + 1]);
      } else if (racs === "Z") rud(felso[i], also[i + 1]);
      else rud(also[i], felso[i + 1]);
    }
    tamaszok = [
      { csomopont: also[0], tipus: "csuklo" },
      { csomopont: also[n], tipus: "gorgo", szog: 90 },
    ];
  } else if (tipus === "warren") {
    // alsó csomópontok: 1, 3, 5, … (x = 0, 2a, 4a …); felsők: 2, 4, … (x = a, 3a, …), magasság h
    for (let i = 0; i <= n; i++) csomopontok.push({ id: String(2 * i + 1), x: 2 * i * a, y: 0 });
    for (let i = 0; i < n; i++) csomopontok.push({ id: String(2 * i + 2), x: (2 * i + 1) * a, y: h });
    csomopontok.sort((p, q) => Number(p.id) - Number(q.id));
    also = Array.from({ length: n + 1 }, (_, i) => String(2 * i + 1));
    felso = Array.from({ length: n }, (_, i) => String(2 * i + 2));
    for (let i = 0; i < n; i++) {
      rud(also[i], also[i + 1]);
      rud(also[i], felso[i]);
      rud(felso[i], also[i + 1]);
      if (i < n - 1) rud(felso[i], felso[i + 1]);
    }
    tamaszok = [
      { csomopont: also[0], tipus: "csuklo" },
      { csomopont: also[n], tipus: "gorgo", szog: 90 },
    ];
  } else if (tipus === "haromszog") {
    // nyeregtető: alsó öv n mező (n páros), a felső öv a közepén h magas; oszlopok és rácsrudak
    const nn = n % 2 ? n + 1 : n;
    const L = nn * a;
    for (let i = 0; i <= nn; i++) csomopontok.push({ id: String(i + 1), x: i * a, y: 0 });
    also = csomopontok.map((c) => c.id);
    for (let i = 1; i < nn; i++) {
      const x = i * a;
      csomopontok.push({ id: String(nn + 1 + i), x, y: (h * (L / 2 - Math.abs(x - L / 2))) / (L / 2) });
      felso.push(String(nn + 1 + i));
    }
    for (let i = 0; i < nn; i++) rud(also[i], also[i + 1]);
    const fels = [also[0], ...felso, also[nn]];
    for (let i = 0; i < fels.length - 1; i++) rud(fels[i], fels[i + 1]);
    for (let i = 1; i < nn; i++) rud(also[i], felso[i - 1]);
    for (let i = 1; i < nn; i++) {
      // rácsrudak a gerinc felé
      if (i < nn / 2) rud(also[i], felso[i]);
      else if (i > nn / 2) rud(also[i], felso[i - 2]);
    }
    tamaszok = [
      { csomopont: also[0], tipus: "csuklo" },
      { csomopont: also[nn], tipus: "gorgo", szog: 90 },
    ];
  } else if (tipus === "k") {
    // K-rácsozás: felső 1…n+1, alsó n+2…2n+2, középső csomópontok az oszlopokon 2n+3…3n+3 (magasság 2h)
    for (let i = 0; i <= n; i++) csomopontok.push({ id: String(i + 1), x: i * a, y: 2 * h });
    for (let i = 0; i <= n; i++) csomopontok.push({ id: String(n + 2 + i), x: i * a, y: 0 });
    const kozep = [];
    for (let i = 0; i <= n; i++) {
      csomopontok.push({ id: String(2 * n + 3 + i), x: i * a, y: h });
      kozep.push(String(2 * n + 3 + i));
    }
    felso = csomopontok.slice(0, n + 1).map((c) => c.id);
    also = csomopontok.slice(n + 1, 2 * n + 2).map((c) => c.id);
    for (let i = 0; i < n; i++) {
      rud(felso[i], felso[i + 1]);
      rud(also[i], also[i + 1]);
    }
    for (let i = 0; i <= n; i++) {
      rud(felso[i], kozep[i]);
      rud(kozep[i], also[i]);
    }
    for (let i = 0; i < n; i++) {
      // a K-k szára a mező bal oldali középső csomópontjából a jobb oldali felső és alsó csomópontba (a tankönyv 6.3.f: a bal félen), tükrözve a jobb félen
      if (i < n / 2) {
        rud(kozep[i], felso[i + 1]);
        rud(kozep[i], also[i + 1]);
      } else {
        rud(kozep[i + 1], felso[i]);
        rud(kozep[i + 1], also[i]);
      }
    }
    // a szélső középső csomópontok csak két egy egyenesbe eső rúddal: ezeket elhagyjuk (a szélső oszlop egy rúd)
    const elhagy = new Set();
    for (const k of kozep) {
      const fok = rudak.filter((r) => r.a === k || r.b === k).length;
      if (fok === 2) elhagy.add(k);
    }
    if (elhagy.size) {
      for (const k of elhagy) {
        const idx = kozep.indexOf(k);
        const tors = rudak.filter((r) => r.a === k || r.b === k);
        for (const t of tors) rudak.splice(rudak.indexOf(t), 1);
        rud(felso[idx], also[idx]);
      }
      const cs2 = csomopontok.filter((c) => !elhagy.has(c.id));
      csomopontok.length = 0;
      csomopontok.push(...cs2);
    }
    tamaszok = [
      { csomopont: also[0], tipus: "csuklo" },
      { csomopont: also[n], tipus: "gorgo", szog: 90 },
    ];
  }
  return { csomopontok, rudak, tamaszok: o.tamaszok ?? tamaszok, terhek: o.terhek ?? [], felso, also };
}

/** A tankönyv 6.1/6.4 ábrájának tartója (Warren, 3 pár) és a példák gyors elérése. */
export const PELDAK = {
  tk61: (a = 1.5, h = 2, F = 10, alfa = -60) => ({
    ...sablon("warren", { n: 3, a, h }),
    terhek: [{ csomopont: "5", Fx: F * Math.cos((alfa * Math.PI) / 180), Fy: F * Math.sin((alfa * Math.PI) / 180) }],
  }),
  tk66: (a = 2, b = 1.5, F = 12) => ({ ...sablon("parhuzamos", { n: 4, a, h: b, racs: "V" }), terhek: [{ csomopont: "4", Fx: 0, Fy: -F }] }),
  h07: (a = 2, b = 1.5, F1 = 10, F2 = 6) => ({
    ...sablon("parhuzamos", { n: 4, a, h: b, racs: "V" }),
    terhek: [
      { csomopont: "3", Fx: 0, Fy: -F1 },
      { csomopont: "4", Fx: 0, Fy: -F2 },
    ],
  }),
  h08a: (b = 2, a = 1.5, F1 = 10, F2 = 10) => {
    const cs = [];
    for (let i = 0; i <= 4; i++) cs.push({ id: String(i + 1), x: i * b, y: 2 * a });
    for (let i = 0; i <= 4; i++) cs.push({ id: String(6 + i), x: i * b, y: 0 });
    cs.push({ id: "11", x: 0, y: a }, { id: "12", x: b, y: a }, { id: "13", x: 3 * b, y: a }, { id: "14", x: 4 * b, y: a });
    const parok = [
      [1, 2], [2, 3], [3, 4], [4, 5],
      [6, 7], [7, 8], [8, 9], [9, 10],
      [1, 11], [6, 11], [5, 14], [10, 14],
      [2, 12], [7, 12], [4, 13], [9, 13], [3, 8],
      [2, 11], [7, 11], [4, 14], [9, 14],
      [3, 12], [8, 12], [3, 13], [8, 13],
    ];
    return {
      csomopontok: cs,
      rudak: parok.map(([p, q]) => ({ id: rudId(p, q), a: String(p), b: String(q) })),
      tamaszok: [
        { csomopont: "6", tipus: "csuklo" },
        { csomopont: "10", tipus: "gorgo", szog: 90 },
      ],
      terhek: [
        { csomopont: "3", Fx: 0, Fy: -F1 },
        { csomopont: "4", Fx: 0, Fy: -F2 },
      ],
    };
  },
  h08b: (b = 2, a = 2, bm = 2.5, F1 = 10, F2 = 20) => {
    // felső öv: y = a + bm·x/(5b); alsó csomópontok 2, 4, 6, 8, 10, 12; felsők 1, 3, 5, 7, 9, 11
    const top = (i) => a + (bm * i) / 5;
    const cs = [
      { id: "1", x: 0, y: top(0) }, { id: "2", x: 0, y: 0 },
      { id: "3", x: b, y: top(1) }, { id: "4", x: b, y: 0 },
      { id: "5", x: 2 * b, y: top(2) }, { id: "6", x: 2 * b, y: 0 },
      { id: "7", x: 3 * b, y: top(3) }, { id: "8", x: 3 * b, y: 0 },
      { id: "9", x: 4 * b, y: top(4) }, { id: "10", x: 4 * b, y: 0 },
      { id: "11", x: 5 * b, y: top(5) }, { id: "12", x: 5 * b, y: 0 },
    ];
    const parok = [
      [1, 2], [1, 3], [2, 3], [3, 4], [3, 5], [3, 6], [5, 6], [2, 4], [4, 6],
      [5, 7], [6, 7],
      [7, 8], [7, 9], [8, 9], [9, 10], [9, 11], [9, 12], [11, 12], [8, 10], [10, 12],
    ];
    return {
      csomopontok: cs,
      rudak: parok.map(([p, q]) => ({ id: rudId(p, q), a: String(p), b: String(q) })),
      tamaszok: [
        { csomopont: "2", tipus: "csuklo" },
        { csomopont: "12", tipus: "csuklo" },
      ],
      terhek: [
        { csomopont: "3", Fx: 0, Fy: -F1 },
        { csomopont: "9", Fx: 0, Fy: -F2 },
      ],
    };
  },
  vizsga: (F = 8) => ({ ...sablon("trapez", { n: 4, a: 5, h0: 5, h1: 9, racs: "Z" }), terhek: [{ csomopont: "3", Fx: 0, Fy: -F }] }),
};

/* ============================================================
   Segédek a rajzokhoz
   ============================================================ */

/** A modell befoglaló téglalapja. */
export function befoglalo(modell) {
  const cs = modell.csomopontok ?? [];
  const xs = cs.map((c) => Number(c.x));
  const ys = cs.map((c) => Number(c.y));
  return { xMin: Math.min(...xs), xMax: Math.max(...xs), yMin: Math.min(...ys), yMax: Math.max(...ys) };
}

/** A csomópontra ható erők listája (rajzhoz): teher, reakció, rúderők (húzott = a csomópontból kifelé). */
export function csomopontErok(eredmeny, csomopontId) {
  const i = eredmeny.csomopontok.findIndex((c) => c.id === String(csomopontId));
  if (i < 0) return [];
  const lista = [];
  const t = eredmeny.terhek[i];
  if (Math.hypot(t.Fx, t.Fy) > 1e-9) lista.push({ fajta: "teher", Fx: t.Fx, Fy: t.Fy });
  const re = eredmeny.reakciok?.find((x) => x.csomopont === String(csomopontId));
  if (re) lista.push({ fajta: "reakcio", Fx: re.Fx, Fy: re.Fy, jel: re.jel });
  for (const c of eredmeny.csatlakozas[i]) {
    const S = eredmeny.rudErok?.[c.rud.id] ?? 0;
    lista.push({ fajta: "rud", rud: c.rud.id, ex: c.ex, ey: c.ey, S, Fx: S * c.ex, Fy: S * c.ey });
  }
  return lista;
}

/* ============================================================
   Átmetszés keresése egy adott rúdhoz
   ============================================================ */

/**
 * Egy adott rúdhoz keres olyan átmetszést (legfeljebb `maxRud` átvágott rúd), amely két részre vágja a tartót
 * és amelyből a rúd ereje egyismeretlenes egyenletből számolható. Vízszintes és ferde vágóvonalakat próbál a rúd
 * felezőpontján át. Visszatér { vonal: [p1, p2], rudak: [ids], eredmeny: atmetszes(...) } vagy null.
 */
export function keresAtmetszes(modell, rudIdKeresett, opciok = {}) {
  const e = opciok.eredmeny ?? racsosMegold(modell);
  if (!e.ok) return null;
  const r = e.rudak.find((x) => x.id === String(rudIdKeresett));
  if (!r) return null;
  const maxRud = opciok.maxRud ?? 4;
  const b = befoglalo(modell);
  const H = Math.max(1e-6, b.yMax - b.yMin) + 1;
  const mx = (r.x1 + r.x2) / 2;
  const my = (r.y1 + r.y2) / 2;
  const iranyok = [];
  // függőleges, majd ferde vonalak (a rúd irányára nem párhuzamosan)
  for (const [dx, dy] of [[0, 1], [0.35, 1], [-0.35, 1], [0.7, 1], [-0.7, 1], [1, 0.4], [1, -0.4], [1, 0.15], [1, -0.15]]) {
    if (Math.abs(dx * r.ey - dy * r.ex) < 1e-6) continue; // párhuzamos a rúddal
    iranyok.push([dx, dy]);
  }
  const eltolasok = [0, 0.08, -0.08, 0.2, -0.2, 0.32, -0.32];
  let legjobb = null;
  for (const [dx, dy] of iranyok) {
    const n = Math.hypot(dx, dy);
    const ux = dx / n;
    const uy = dy / n;
    for (const el of eltolasok) {
      // a vonal a rúd mentén el·hossz-nyival eltolva megy át
      const cx = mx + el * (r.x2 - r.x1);
      const cy = my + el * (r.y2 - r.y1);
      const p1 = { x: cx - ux * 3 * H, y: cy - uy * 3 * H };
      const p2 = { x: cx + ux * 3 * H, y: cy + uy * 3 * H };
      const rudak = atvagottRudak(e, p1, p2);
      if (!rudak.includes(r.id) || rudak.length > maxRud || rudak.length < 2) continue;
      for (const oldal of ["bal", "jobb"]) {
        const ismert = opciok.ismert === "ovek" ? rudak.filter((id) => id !== r.id && Math.abs(e.rudak.find((x) => x.id === id)?.ey ?? 1) < 1e-9) : opciok.ismert ?? [];
        const at = atmetszes(modell, rudak, oldal, { eredmeny: e, ismert });
        if (!at.ok) continue;
        const egy = at.egyenletek.find((q) => q.rud === r.id);
        if (!egy || egy.nincsEgyismeretlenes) continue;
        const pont = rudak.length * 10 + at.kulsoErok.length;
        if (!legjobb || pont < legjobb.pont) legjobb = { vonal: [p1, p2], rudak, oldal, eredmeny: at, pont, egyenlet: egy, ismert };
      }
    }
    if (legjobb && legjobb.rudak.length <= 3) break;
  }
  return legjobb;
}
