/**
 * A tartószerkezeti modell leírása és normalizálása.
 *
 * Mértékegységek: hossz m, erő kN, nyomaték kNm, megoszló teher kN/m.
 * Koordináta-rendszer: x jobbra, y felfelé, a nyomaték az óramutatóval
 * ellentétesen pozitív — ugyanaz, mint az 1–2. modulban.
 *
 * A modell alakja:
 * {
 *   csomopontok: [{ id: "A", x: 0, y: 0 }, ...],
 *   rudak: [{ id: "1", a: "A", b: "B", csukloA?: false, csukloB?: false,
 *             EI?: 1, EA?: 1, pozitivOldal?: -1 }],
 *   tamaszok: [{ csomopont: "A", tipus: "csuklo" | "gorgo" | "befogas" | "rud",
 *                szog?: 90,            // görgőnél a gátolt elmozdulás iránya fokban
 *                irany?: [dx, dy] }],  // rúdnál a rúd iránya a csomóponttól a másik vége felé
 *   terhek: [
 *     { fajta: "csomopontiEro",    csomopont, Fx, Fy },
 *     { fajta: "csomopontiNyomatek", csomopont, M },
 *     { fajta: "pontTeher",  rud, a, F, irany: "y"|"x"|"meroleges"|"tengely", szog? },
 *     { fajta: "pontNyomatek", rud, a, M },
 *     { fajta: "megoszlo",   rud, a1?, a2?, p1, p2?,
 *                            irany: "y"|"x"|"meroleges"|"tengely",
 *                            vetuletre?: false }   // true: a p a vízszintes vetület méterére vonatkozik
 *   ]
 * }
 *
 * A "pozitivOldal" a hajlítónyomaték előjeléhez tartozik: −1 (alapértelmezés)
 * esetén a pozitív oldal a rúd mentén a kezdőponttól a végpont felé haladva
 * a JOBB oldal — vízszintes, balról jobbra rajzolt rúdnál ez az alsó oldal,
 * ahogy a tankönyv is javasolja.
 */

const FOK = Math.PI / 180;

function hiba(uzenetek, szoveg) {
  uzenetek.push(szoveg);
}

/** A nyers modellből indexelt, lokális teher-listás belső modellt készít. */
export function normalizal(be) {
  const hibak = [];
  const csomopontok = (be.csomopontok ?? []).map((cs, i) => ({
    id: String(cs.id ?? i + 1),
    x: Number(cs.x) || 0,
    y: Number(cs.y) || 0,
    index: i,
  }));
  const csIndex = new Map(csomopontok.map((cs) => [cs.id, cs.index]));
  if (csomopontok.length < 2) hiba(hibak, "Legalább két csomópont kell.");

  const rudak = (be.rudak ?? []).map((r, i) => {
    const ia = csIndex.get(String(r.a));
    const ib = csIndex.get(String(r.b));
    if (ia === undefined || ib === undefined) {
      hiba(hibak, `A(z) ${r.id ?? i + 1}. rúd végpontja ismeretlen csomópont (${r.a}, ${r.b}).`);
    }
    const A = csomopontok[ia] ?? { x: 0, y: 0 };
    const B = csomopontok[ib] ?? { x: 1, y: 0 };
    const dx = B.x - A.x;
    const dy = B.y - A.y;
    const hossz = Math.hypot(dx, dy);
    if (hossz < 1e-9) hiba(hibak, `A(z) ${r.id ?? i + 1}. rúd hossza nulla.`);
    return {
      id: String(r.id ?? i + 1),
      index: i,
      ia,
      ib,
      x1: A.x, y1: A.y, x2: B.x, y2: B.y,
      hossz,
      cos: dx / (hossz || 1),
      sin: dy / (hossz || 1),
      szogFok: (Math.atan2(dy, dx) / FOK),
      csukloA: !!r.csukloA,
      csukloB: !!r.csukloB,
      EI: Number(r.EI) > 0 ? Number(r.EI) : 1,
      EA: Number(r.EA) > 0 ? Number(r.EA) : 1,
      pozitivOldal: r.pozitivOldal === 1 ? 1 : -1,
      // lokális teherlisták (a normalizálás tölti fel)
      pontTerhek: [],   // { a, Px, Py, Mz }  – lokális komponensek
      megoszlok: [],    // { a1, a2, qx1, qy1, qx2, qy2 } – lokális komponensek
    };
  });
  const rudIndex = new Map(rudak.map((r) => [r.id, r.index]));

  const tamaszok = (be.tamaszok ?? []).map((t, i) => {
    const ics = csIndex.get(String(t.csomopont));
    if (ics === undefined) hiba(hibak, `Ismeretlen csomópont a támasznál: ${t.csomopont}.`);
    const tipus = t.tipus ?? "csuklo";
    let irany = null;
    if (tipus === "gorgo") {
      const sz = (t.szog ?? 90) * FOK;
      irany = [Math.cos(sz), Math.sin(sz)];
    } else if (tipus === "rud") {
      const v = t.irany ?? [0, -1];
      const h = Math.hypot(v[0], v[1]) || 1;
      irany = [v[0] / h, v[1] / h];
    }
    return { id: String(t.id ?? `T${i + 1}`), ics, tipus, irany, szog: t.szog ?? 90, fokszam: tipus === "befogas" ? 3 : tipus === "csuklo" ? 2 : 1 };
  });

  // ---- terhek lokálissá alakítása ----
  const csomopontiTerhek = csomopontok.map(() => ({ Fx: 0, Fy: 0, M: 0 }));

  /** globális (Fx, Fy) → a rúd lokális (Px, Py) komponensei */
  const lokalis = (rud, gx, gy) => ({
    Px: gx * rud.cos + gy * rud.sin,
    Py: -gx * rud.sin + gy * rud.cos,
  });

  /** teher iránya → globális egységvektor */
  function iranyVektor(rud, irany, szogFok) {
    switch (irany) {
      case "x": return [1, 0];
      case "y": return [0, 1];
      case "tengely": return [rud.cos, rud.sin];                 // a rúd tengelye mentén
      case "meroleges": return [-rud.sin, rud.cos];              // a rúdra merőlegesen (balra)
      case "szog": return [Math.cos((szogFok ?? 0) * FOK), Math.sin((szogFok ?? 0) * FOK)];
      default: return [0, 1];
    }
  }

  for (const t of be.terhek ?? []) {
    if (t.fajta === "csomopontiEro") {
      const i = csIndex.get(String(t.csomopont));
      if (i === undefined) { hiba(hibak, `Ismeretlen csomópont a tehernél: ${t.csomopont}.`); continue; }
      csomopontiTerhek[i].Fx += Number(t.Fx) || 0;
      csomopontiTerhek[i].Fy += Number(t.Fy) || 0;
    } else if (t.fajta === "csomopontiNyomatek") {
      const i = csIndex.get(String(t.csomopont));
      if (i === undefined) { hiba(hibak, `Ismeretlen csomópont a tehernél: ${t.csomopont}.`); continue; }
      csomopontiTerhek[i].M += Number(t.M) || 0;
    } else if (t.fajta === "pontTeher" || t.fajta === "pontNyomatek") {
      const ir = rudIndex.get(String(t.rud));
      if (ir === undefined) { hiba(hibak, `Ismeretlen rúd a tehernél: ${t.rud}.`); continue; }
      const rud = rudak[ir];
      const a = Math.min(rud.hossz, Math.max(0, Number(t.a) || 0));
      if (t.fajta === "pontNyomatek") {
        rud.pontTerhek.push({ a, Px: 0, Py: 0, Mz: Number(t.M) || 0 });
      } else {
        const e = iranyVektor(rud, t.irany ?? "y", t.szog);
        const F = Number(t.F) || 0;
        const { Px, Py } = lokalis(rud, e[0] * F, e[1] * F);
        rud.pontTerhek.push({ a, Px, Py, Mz: 0 });
      }
    } else if (t.fajta === "megoszlo") {
      const ir = rudIndex.get(String(t.rud));
      if (ir === undefined) { hiba(hibak, `Ismeretlen rúd a tehernél: ${t.rud}.`); continue; }
      const rud = rudak[ir];
      const a1 = Math.max(0, Number(t.a1) || 0);
      const a2 = Math.min(rud.hossz, t.a2 === undefined ? rud.hossz : Number(t.a2));
      if (a2 <= a1 + 1e-12) { hiba(hibak, `A(z) ${rud.id}. rúdon a megoszló teher szakasza üres.`); continue; }
      const e = iranyVektor(rud, t.irany ?? "y", t.szog);
      const p1 = Number(t.p1) || 0;
      const p2 = t.p2 === undefined ? p1 : Number(t.p2) || 0;
      // ha a vetületre van megadva, a rúd méterére eső intenzitás kisebb
      const atvalt = t.vetuletre ? Math.abs(rud.cos) : 1;
      const g1 = [e[0] * p1 * atvalt, e[1] * p1 * atvalt];
      const g2 = [e[0] * p2 * atvalt, e[1] * p2 * atvalt];
      const l1 = lokalis(rud, g1[0], g1[1]);
      const l2 = lokalis(rud, g2[0], g2[1]);
      rud.megoszlok.push({ a1, a2, qx1: l1.Px, qy1: l1.Py, qx2: l2.Px, qy2: l2.Py });
    } else {
      hiba(hibak, `Ismeretlen tehertípus: ${t.fajta}.`);
    }
  }

  return { csomopontok, rudak, tamaszok, csomopontiTerhek, hibak };
}

/**
 * Statikai határozottság megszámlálással (a tankönyv 7. fejezete szerint).
 * Síkban testenként 3 egyenlet; az ismeretlenek a támaszreakciók és a
 * belső kapcsolatok erői. Itt az egyszerű számlálást adjuk:
 *   ismeretlenek = Σ támaszfokszám + 3·(rudak) − Σ csuklós végek
 * A tényleges eldöntés a megoldó rangvizsgálata (kritikus elrendezés!).
 */
export function fokszamMerleg(m) {
  const tamaszFok = m.tamaszok.reduce((s, t) => s + t.fokszam, 0);
  // merev testek: a rudak, amelyeket egy csomópontban merev (nem csuklós) végük köt össze
  const szulo = m.rudak.map((_, i) => i);
  const gyoker = (i) => (szulo[i] === i ? i : (szulo[i] = gyoker(szulo[i])));
  const egyesit = (i, j) => { const a = gyoker(i), b = gyoker(j); if (a !== b) szulo[a] = b; };
  const merevVegek = m.csomopontok.map(() => []);
  const csuklosVegek = [];
  for (const r of m.rudak) {
    if (r.csukloA) csuklosVegek.push({ rud: r.index, cs: r.ia }); else merevVegek[r.ia].push(r.index);
    if (r.csukloB) csuklosVegek.push({ rud: r.index, cs: r.ib }); else merevVegek[r.ib].push(r.index);
  }
  merevVegek.forEach((lista) => { for (let i = 1; i < lista.length; i++) egyesit(lista[0], lista[i]); });
  // egy csuklós rúdvég kapcsolati erőpárt (2 ismeretlen) jelent, ha a csomópontot
  // egy másik test „birtokolja”; ha ott csak csuklós végek vannak, az első a gazda
  const gazda = m.csomopontok.map((_, cs) => merevVegek[cs][0] ?? null);
  let kapcsolatok = 0;
  for (const v of csuklosVegek) {
    if (gazda[v.cs] === null) { gazda[v.cs] = v.rud; continue; }
    if (gyoker(gazda[v.cs]) === gyoker(v.rud)) continue;
    kapcsolatok += 2;
  }
  const testek = new Set(m.rudak.map((r) => gyoker(r.index)));
  const testSzam = testek.size || 1;
  const egyenletek = 3 * testSzam;
  const ismeretlenek = tamaszFok + kapcsolatok;
  return { tamaszFok, testSzam, egyenletek, ismeretlenek, fok: ismeretlenek - egyenletek };
}
