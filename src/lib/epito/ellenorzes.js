/**
 * A rajz kiértékelése — tiszta függvények, React-mentes.
 *
 *   rajzFeladat(e)        – az elemez() eredményéből a rajzolandó töréspontok, szakaszok, csomópont-szerepek
 *   uresRajz(f)           – üres rajz (minden fogópont 0), alakok („egyenes”), szélsőértékek (nincs)
 *   pontosRajz(f)         – a pontos megoldásból kitöltött rajz (megoldás-mutatáshoz, teszthez)
 *   alakTenyleges(...)    – a szakaszok tényleges alakja (a szélsőérték-fogópont felülírja a választást)
 *   reakcioKomponensek(e) – a reakciók komponensei a tippeléshez (jel, helyes, feltételezett irány, egyenlet)
 *   ellenoriz({ eredmeny, rajz, alakok, szelsok, reakcioTippek, jelek, segitseg, reakciokMutatva })
 *        → { pont, hibak:[{ kod, rud, x, jel, oldal, sulyos, apro, cim, magyarazat, helyes, rajzolt, tipp, szabaly }], joPontok, osszefoglalo }
 *
 * Tolerancia: egy érték jó, ha |eltérés| ≤ max(10 % · |helyes|, 4 % · a jel maximuma).
 * Előjelek a tankönyv szerint: V pozitív = a bal oldali rész felfelé mutató erőinek összege (vízszintes,
 * balról jobbra haladó rúdon), M a húzott oldalra rajzolva (alul pozitív). A rajz oldala (8.3.2): mindhárom
 * ábra pozitív értéke a rúd ugyanazon pozitív oldalára kerül — arra, amelyiket az M-hez választottunk
 * (vízszintes rúdnál alul). Az itteni logika csak értékekkel dolgozik, a képernyő-oldalt a RajzoloRajz adja.
 */

import { ertek } from "../tarto/polinom.js";
import { sz } from "../szamok.js";

const EPS = 1e-7;
const JELEK = ["N", "V", "M"];
export const EGYSEG = { N: "kN", V: "kN", M: "kNm" };
export const JEL_NEV = { N: "normálerő", V: "nyíróerő", M: "hajlítónyomaték" };
const kerekFel = (v) => Math.round(v / 0.5) * 0.5;
const f1 = (v) => sz(v, Math.abs(v * 10 - Math.round(v * 10)) > 1e-6 ? 2 : Math.abs(v - Math.round(v)) > 1e-6 ? 1 : 0);
const fm = (v) => f1(v) + " m";
/** határozott névelő a csomópont / rúd neve elé */
const nevelo = (id) => (/^[aeiouáéíóöőúüű]/i.test(String(id)) || /^[15]/.test(String(id)) ? "az" : "a");
const rudNev = (id) => `${nevelo(id)} ${id}. rúd`;
const csNev = (id) => `${nevelo(id)} ${id} csomópont`;

/* ------------------------------------------------------------------ */
/*  a rajzolandó feladat                                                */
/* ------------------------------------------------------------------ */

/** A polinom értéke egy adott szakasz-oldalon (bal: az x2-ben végződő, jobb: az x1-ben kezdődő szakasz). */
function szakaszErtek(ig, x, oldal, jel) {
  const s = oldal === "bal" ? ig.szakaszok.find((q) => Math.abs(q.x2 - x) < 1e-6) : ig.szakaszok.find((q) => Math.abs(q.x1 - x) < 1e-6);
  return s ? ertek(s[jel], x) : null;
}

export function rajzFeladat(e) {
  const m = e.modell;
  const maxE = { N: 0, V: 0, M: 0 };
  const rudak = e.igenybevetelek.map((ig, index) => {
    const rud = m.rudak.find((r) => r.id === ig.rud);
    for (const jel of JELEK) maxE[jel] = Math.max(maxE[jel], Math.abs(ig.szelso[jel].min), Math.abs(ig.szelso[jel].max));
    // töréspontok: a szakaszhatárok
    const xs = [ig.szakaszok[0].x1, ...ig.szakaszok.map((s) => s.x2)];
    const torespontok = xs.map((x, i) => {
      const pontTerhek = rud.pontTerhek.filter((p) => Math.abs(p.a - x) < 1e-6);
      const megoszloHatar = rud.megoszlok.some((q) => Math.abs(q.a1 - x) < 1e-6 || Math.abs(q.a2 - x) < 1e-6);
      const vanPy = pontTerhek.some((p) => Math.abs(p.Py) > EPS);
      const vanPx = pontTerhek.some((p) => Math.abs(p.Px) > EPS);
      const vanMz = pontTerhek.some((p) => Math.abs(p.Mz) > EPS);
      const cs = i === 0 ? rud.ia : i === xs.length - 1 ? rud.ib : null;
      const p = { x, i, cs: cs === null ? null : m.csomopontok[cs].id, ics: cs, ero: vanPy || vanPx, nyomatek: vanMz, megoszloHatar, pontTerhek };
      for (const jel of JELEK) {
        const b = i === 0 ? null : szakaszErtek(ig, x, "bal", jel);
        const j = i === xs.length - 1 ? null : szakaszErtek(ig, x, "jobb", jel);
        // két fogópont ott, ahol ugrás LEHET (a teher fajtája szerint, nem a megoldás szerint)
        const ketto = b !== null && j !== null && (jel === "V" ? vanPy : jel === "N" ? vanPx : vanMz);
        p[jel] = { bal: b, jobb: j, ugras: b !== null && j !== null && Math.abs(b - j) > 1e-6, fogok: b === null ? ["jobb"] : j === null ? ["bal"] : ketto ? ["bal", "jobb"] : ["jobb"] };
      }
      return p;
    });
    const szakaszok = ig.szakaszok.map((s, k) => {
      // a merőleges megoszló teher a szakaszon (lokális y, egyenletes rész) és a tengelyirányú
      let q = 0, qx = 0, qLinearis = false;
      for (const mg of rud.megoszlok) {
        if (mg.a1 <= s.x1 + 1e-9 && mg.a2 >= s.x2 - 1e-9) {
          q += (mg.qy1 + mg.qy2) / 2;
          qx += (mg.qx1 + mg.qx2) / 2;
          if (Math.abs(mg.qy1 - mg.qy2) > EPS) qLinearis = true;
        }
      }
      const c2 = s.M[2] ?? 0;
      const alakM = Math.abs(c2) < 1e-9 && Math.abs(s.M[3] ?? 0) < 1e-9 ? "egyenes" : c2 < 0 ? "U" : "A";
      let szelsoX = null, szelsoM = null;
      for (const h of ig.MszelsoHelyek) {
        if (h.x > s.x1 + 0.05 && h.x < s.x2 - 0.05) { szelsoX = Math.round(h.x * 1000) / 1000; szelsoM = h.M; }
      }
      return { k, x1: s.x1, x2: s.x2, hossz: s.x2 - s.x1, iKezd: k, iVeg: k + 1, q, qx, qLinearis, alakM, szelsoX, szelsoM, N: s.N, V: s.V, M: s.M };
    });
    return { rud: ig.rud, index, hossz: ig.hossz, szogFok: ig.szogFok, kezdo: ig.kezdo, veg: ig.veg, pozitivOldal: ig.pozitivOldal ?? rud.pozitivOldal ?? -1, ia: rud.ia, ib: rud.ib, aId: m.csomopontok[rud.ia].id, bId: m.csomopontok[rud.ib].id, csukloA: rud.csukloA, csukloB: rud.csukloB, ig, torespontok, szakaszok };
  });
  for (const jel of JELEK) maxE[jel] = Math.max(maxE[jel], 1);

  // csomópontok szerepe
  const csomopontok = m.csomopontok.map((cs) => {
    const rudVegek = [];
    for (const r of m.rudak) {
      if (r.ia === cs.index) rudVegek.push({ rud: r.id, oldal: "a", csuklos: r.csukloA });
      if (r.ib === cs.index) rudVegek.push({ rud: r.id, oldal: "b", csuklos: r.csukloB });
    }
    const tamasz = m.tamaszok.find((t) => t.ics === cs.index) ?? null;
    const teher = m.csomopontiTerhek[cs.index];
    const csukloE = rudVegek.some((v) => v.csuklos);
    const merevVegek = rudVegek.filter((v) => !v.csuklos);
    return {
      id: cs.id, index: cs.index, x: cs.x, y: cs.y, rudVegek, tamasz, teher,
      csukloE,
      szabadVeg: rudVegek.length === 1 && !tamasz,
      szelsoTamasz: rudVegek.length === 1 && !!tamasz,
      sarok: !tamasz && merevVegek.length >= 2 && Math.abs(teher.M) < EPS ? merevVegek : null,
      csomopontiEgyensuly: merevVegek.length >= 2 && !(tamasz && tamasz.tipus === "befogas") ? merevVegek : null,
    };
  });
  const kerekE = rudak.every((r) => r.torespontok.every((p) => ["V", "M"].every((jel) => p[jel].fogok.every((o) => Math.abs(p[jel][o] - kerekFel(p[jel][o])) < 1e-6))));
  return { rudak, csomopontok, maxE, kerekE, e };
}

/* ------------------------------------------------------------------ */
/*  rajz-állapotok                                                      */
/* ------------------------------------------------------------------ */

export function uresRajz(f) {
  const rajz = { N: {}, V: {}, M: {} }, alakok = {}, szelsok = {};
  for (const r of f.rudak) {
    for (const jel of JELEK) rajz[jel][r.rud] = r.torespontok.map(() => ({ bal: 0, jobb: 0 }));
    alakok[r.rud] = r.szakaszok.map(() => "egyenes");
    szelsok[r.rud] = r.szakaszok.map(() => null);
  }
  return { rajz, alakok, szelsok };
}

export function pontosRajz(f) {
  const rajz = { N: {}, V: {}, M: {} }, alakok = {}, szelsok = {};
  for (const r of f.rudak) {
    for (const jel of JELEK) rajz[jel][r.rud] = r.torespontok.map((p) => ({ bal: p[jel].bal ?? p[jel].jobb, jobb: p[jel].jobb ?? p[jel].bal }));
    alakok[r.rud] = r.szakaszok.map((s) => s.alakM);
    szelsok[r.rud] = r.szakaszok.map((s) => (s.szelsoX === null ? null : { x: s.szelsoX, ertek: s.szelsoM }));
  }
  return { rajz, alakok, szelsok };
}

/** A szakaszok tényleges M-alakja rudanként: ahol szélsőérték-fogópont van, a három pontra illesztett parabola dönt. */
export function alakTenyleges(f, rajz, alakok, szelsok) {
  const ki = {};
  for (const r of f.rudak) {
    ki[r.rud] = r.szakaszok.map((s, k) => {
      const sz_ = szelsok?.[r.rud]?.[k];
      if (!sz_) return alakok?.[r.rud]?.[k] ?? "egyenes";
      const v1 = rajz.M[r.rud][s.iKezd].jobb, v2 = rajz.M[r.rud][s.iVeg].bal;
      const t = (sz_.x - s.x1) / s.hossz;
      const chord = v1 + (v2 - v1) * t;
      const elt = sz_.ertek - chord;
      return Math.abs(elt) < 1e-9 ? "egyenes" : elt > 0 ? "U" : "A";
    });
  }
  return ki;
}

/* ------------------------------------------------------------------ */
/*  reakciók                                                            */
/* ------------------------------------------------------------------ */

/** A reakciók komponensei a tippeléshez. A feltételezett irány: x jobbra, y felfelé, M az óramutatóval ellentétesen, görgő a gátolt irány mentén. */
export function reakcioKomponensek(e) {
  const m = e.modell;
  const ki = [];
  const masikTamasz = (re) => e.reakciok.find((q) => q.csomopont !== re.csomopont);
  e.reakciok.forEach((re, ti) => {
    const cs = re.csomopont;
    const masik = masikTamasz(re);
    const nyomEgyenlet = masik ? `ΣM_${masik.csomopont} = 0` : `ΣM_${cs} = 0`;
    if (re.tipus === "csuklo" || re.tipus === "befogas") {
      ki.push({ tamasz: ti, csomopont: cs, jel: `${cs}_x`, kulcs: `${cs}x`, helyes: re.Fx, leiras: `vízszintes reakció ${cs}-ban (jobbra pozitív)`, egyenlet: "ΣF_x = 0" });
      ki.push({ tamasz: ti, csomopont: cs, jel: `${cs}_y`, kulcs: `${cs}y`, helyes: re.Fy, leiras: `függőleges reakció ${cs}-ban (felfelé pozitív)`, egyenlet: masik ? `ΣM_${masik.csomopont} = 0 (${masik.csomopont} a főpont, ott a másik reakció kiesik)` : "ΣF_y = 0" });
      if (re.tipus === "befogas") ki.push({ tamasz: ti, csomopont: cs, jel: `M_${cs}`, kulcs: `${cs}M`, helyes: re.M, leiras: `befogási nyomaték ${cs}-ban (óramutatóval ellentétesen pozitív)`, egyenlet: `ΣM_${cs} = 0` });
    } else {
      const sz_ = m.tamaszok[ti]?.szog ?? 90;
      const iranyNev = Math.abs(sz_ - 90) < 1e-6 ? "függőleges, felfelé pozitív" : Math.abs(sz_) < 1e-6 ? "vízszintes, jobbra pozitív" : `${f1(sz_)}° irányú`;
      ki.push({ tamasz: ti, csomopont: cs, jel: `${cs}`, kulcs: `${cs}n`, helyes: re.nagysag ?? Math.hypot(re.Fx, re.Fy), leiras: `görgő reakciója ${cs}-ban (${iranyNev})`, egyenlet: nyomEgyenlet + (masik ? ` (${masik.csomopont} a főpont)` : "") });
    }
  });
  return ki;
}

/* ------------------------------------------------------------------ */
/*  az ellenőrzés                                                       */
/* ------------------------------------------------------------------ */

const SULYOS = new Set(["elojel", "ugras_hianyzik", "ugras_rossz", "csuklo_M", "szabad_veg", "tamasz_veg_M", "sarok"]);
const SZABALY = {
  ertek: "Az igénybevétel egy keresztmetszetben az egyik oldali rész erőinek eredője: V = a bal oldali erők összege (a felfelé mutató erő pozitív), M = a bal oldali erők nyomatéka a metszetre (alul húzott = pozitív).",
  elojel: "Előjelszabály: N húzás = +; a pozitív V iránya az N pozitív irányának óramutató szerinti 90°-os elforgatása (vízszintes rúdon: a bal oldali rész felfelé mutató ereje +); az M-et a húzott oldalra rajzoljuk (alul húzott = +). Az ábrán mindhárom pozitív értéke ugyanarra a pozitív oldalra kerül — vízszintes rúdnál a tartó alá.",
  ugras_hianyzik: "Koncentrált erőnél a V-ábra pontosan az erővel ugrik (dV/dx = −q miatt máshol folytonos); koncentrált nyomatéknál az M ugrik a nyomaték nagyságával.",
  ugras_rossz: "Az ugrás nagysága = a koncentrált teher nagysága, az iránya = a teher iránya (lefelé mutató erő: a V balról jobbra haladva az erő nagyságával csökken, azaz a negatív irányba ugrik).",
  ugras_felesleges: "Ugrás csak ott lehet, ahol koncentrált teher hat, és csak abban az ábrában, amelyikre a teher iránya hat: a rúdra merőleges erő a V-t, a tengelyirányú az N-t, a nyomaték az M-et ugratja.",
  csuklo_M: "A belső csukló nem visz át nyomatékot: M = 0 a csuklóban (ezt a Gerber-tartónál egy külön egyenletként is használjuk).",
  szabad_veg: "Terheletlen szabad végen N = V = M = 0; ha a végen koncentrált erő vagy nyomaték hat, az igénybevétel pontosan azzal egyenlő.",
  tamasz_veg_M: "Csuklós vagy görgős szélső támasznál nincs nyomaték (M = 0), mert a támasz nem gátolja az elfordulást; befogásnál M = a befogási nyomaték.",
  alak: "d²M/dx² = −q: terheletlen szakaszon az M egyenes, egyenletes megoszló teher alatt parabola, amely a teher irányába domborodik (a húzott oldal felől nézve). A V ilyenkor ferde egyenes (dV/dx = −q).",
  meredekseg: "dM/dx = V: az M-ábra meredeksége a V értéke, ezért terheletlen szakaszon az M változása = V · a szakasz hossza.",
  szelso: "Ahol a V előjelet vált (V = 0), ott az M-nek szélsőértéke van — a helyét a V-ábrából (x = V₁/q), az értékét a bal oldali rész nyomatékából számoljuk.",
  sarok: "Merev sarokban (csomóponti nyomaték nélkül) a két rúdvég nyomatéka egyenlő: az M-ábra a sarkon „átfordul”; több rúdnál a csomópont nyomatéki egyensúlya: ΣM = 0.",
  reakcio: "A reakciókat az egyensúlyi egyenletekből számoljuk: egyismeretlenes nyomatéki egyenlet a főpontra (ΣM_A = 0, ahol a másik reakció kiesik), majd ΣF_x = 0, ΣF_y = 0.",
};

export function tolerancia(jel, helyes, maxE) {
  return Math.max(0.1 * Math.abs(helyes), 0.04 * (maxE?.[jel] ?? 1));
}

export function ellenoriz({ eredmeny, feladat, rajz, alakok = {}, szelsok = {}, reakcioTippek = null, jelek = ["V", "M"], segitseg = 0, reakciokMutatva = false }) {
  const f = feladat ?? rajzFeladat(eredmeny);
  const m = f.e.modell;
  const tobbRud = f.rudak.length > 1;
  const hibak = [];
  const joPontok = [];
  const tol = (jel, helyes) => tolerancia(jel, helyes, f.maxE);
  const egys = (jel) => EGYSEG[jel];
  const csById = (id) => f.csomopontok.find((c) => c.id === id);

  /** a hely neve a szövegekhez */
  const helyNev = (r, p, oldal) => {
    const rudSzo = tobbRud ? `${rudNev(r.rud)}on ` : "";
    let hol;
    if (p.cs) hol = `${csNev(p.cs)}ban`;
    else if (p.ero || p.nyomatek) hol = `a koncentrált ${p.nyomatek && !p.ero ? "nyomaték" : "erő"} helyén (x = ${fm(p.x)})`;
    else if (p.megoszloHatar) hol = `a megoszló teher határán (x = ${fm(p.x)})`;
    else hol = `x = ${fm(p.x)}-nél`;
    const old = oldal && (p.ero || p.nyomatek) ? (oldal === "bal" ? ", a bal oldali érték" : oldal === "jobb" ? ", a jobb oldali érték" : "") : "";
    return `${rudSzo}${hol}${old}`;
  };
  const rajzolt = (jel, r, i, o) => rajz?.[jel]?.[r.rud]?.[i]?.[o] ?? 0;
  const felhasznalt = new Set(); // `${jel}|${rud}|${i}|${oldal}` — már megmagyarázott fogópontok
  const kulcs = (jel, r, i, o) => `${jel}|${r.rud}|${i}|${o}`;
  const hiba = (h) => hibak.push({ sulyos: SULYOS.has(h.kod), apro: false, szabaly: SZABALY[h.kod], ...h });

  /* ---- 1. ugrások a két-fogópontos helyeken ---- */
  for (const jel of jelek) {
    for (const r of f.rudak) {
      r.torespontok.forEach((p, i) => {
        if (p[jel].fogok.length !== 2) return;
        const hb = p[jel].bal, hj = p[jel].jobb;
        const valodi = hj - hb;
        const rb = rajzolt(jel, r, i, "bal"), rj = rajzolt(jel, r, i, "jobb");
        const rajzoltUgras = rj - rb;
        const t = tol(jel, valodi);
        const teherLeiras = () => {
          const pt = p.pontTerhek;
          if (jel === "M") { const Mz = pt.reduce((s, q) => s + q.Mz, 0); return `a ${f1(Math.abs(Mz))} kNm nyomaték`; }
          const komp = pt.reduce((s, q) => s + (jel === "V" ? q.Py : q.Px), 0);
          const F = pt.reduce((s, q) => s + Math.hypot(q.Px, q.Py), 0);
          return Math.abs(Math.abs(komp) - F) < 1e-6 ? `a ${f1(F)} kN erő` : `a ${f1(F)} kN erő ${jel === "V" ? "rúdra merőleges" : "tengelyirányú"} összetevője (${f1(Math.abs(komp))} kN)`;
        };
        if (Math.abs(valodi) > t) {
          const volt = hibak.length;
          if (Math.abs(rajzoltUgras) <= t) {
            hiba({ kod: "ugras_hianyzik", rud: r.rud, x: p.x, i, jel, oldal: "jobb", helyes: valodi, rajzolt: rajzoltUgras,
              cim: `Hiányzik az ugrás a ${jel}-ábrában ${helyNev(r, p)}`,
              magyarazat: `Itt ${teherLeiras()} hat, ezért a ${jel}-nek ${f1(Math.abs(valodi))} ${egys(jel)}-${valodi > 0 ? "t a pozitív irányba (a + oldal felé)" : "t a negatív irányba (a − oldal felé)"} kell ugrania: balról ${f1(hb)}, jobbról ${f1(hj)} ${egys(jel)}. Te folytonosan rajzoltad (bal: ${f1(rb)}, jobb: ${f1(rj)}).`,
              tipp: "Húzd szét a két fogópontot: a jobb oldali érték = a bal oldali ± a koncentrált teher." });
          } else if (Math.abs(rajzoltUgras - valodi) > t) {
            const forditott = Math.sign(rajzoltUgras) !== Math.sign(valodi);
            hiba({ kod: "ugras_rossz", rud: r.rud, x: p.x, i, jel, oldal: "jobb", helyes: valodi, rajzolt: rajzoltUgras,
              cim: `${forditott ? "Rossz irányú" : "Rossz nagyságú"} ugrás a ${jel}-ábrában ${helyNev(r, p)}`,
              magyarazat: `Az ugrásnak pontosan ${teherLeiras()} nagyságával egyenlőnek kell lennie: ${f1(Math.abs(valodi))} ${egys(jel)}, ${valodi > 0 ? "a pozitív" : "a negatív"} irányba. Te ${f1(Math.abs(rajzoltUgras))} ${egys(jel)}-t ugrattál ${rajzoltUgras > 0 ? "a pozitív" : "a negatív"} irányba.${forditott ? " Az irány a teher irányát követi: balról jobbra haladva a lefelé mutató erő csökkenti a V-t (az ugrás a negatív irányba, a − oldal felé mutat)." : ""}`,
              tipp: `Helyes: bal ${f1(hb)}, jobb ${f1(hj)} ${egys(jel)}.` });
          }
          // a jobb oldali fogópontot az ugrás magyarázza; a bal oldalit (a szint) külön nézzük
          if (hibak.length > volt) felhasznalt.add(kulcs(jel, r, i, "jobb"));
        } else if (Math.abs(rajzoltUgras) > t) {
          hiba({ kod: "ugras_felesleges", rud: r.rud, x: p.x, i, jel, oldal: "jobb", helyes: 0, rajzolt: rajzoltUgras,
            cim: `Fölösleges ugrás a ${jel}-ábrában ${helyNev(r, p)}`,
            magyarazat: `Itt van ugyan koncentrált teher, de annak nincs ${jel === "V" ? "a rúdra merőleges" : jel === "N" ? "tengelyirányú" : "nyomaték"} összetevője, így a ${jel} nem ugrik: bal és jobb oldalon ugyanaz az érték (${f1(hb)} ${egys(jel)}). Te ${f1(Math.abs(rajzoltUgras))} ${egys(jel)}-t ugrattál.`,
            tipp: "Csak abban az ábrában ugrik az érték, amelyikre a teher hat: merőleges erő → V, tengelyirányú erő → N, nyomaték → M." });
          felhasznalt.add(kulcs(jel, r, i, "jobb"));
        }
      });
    }
  }

  /* ---- 1b. fölösleges ugrás egy közbenső, terheletlen csomópontban (egy vonalba eső rudak) ---- */
  for (const cs of f.csomopontok) {
    if (cs.rudVegek.length !== 2 || cs.tamasz || Math.hypot(cs.teher.Fx, cs.teher.Fy) > EPS) continue;
    const v1 = cs.rudVegek.find((v) => v.oldal === "b"), v2 = cs.rudVegek.find((v) => v.oldal === "a");
    if (!v1 || !v2) continue;
    const r1 = f.rudak.find((q) => q.rud === v1.rud), r2 = f.rudak.find((q) => q.rud === v2.rud);
    if (Math.abs(r1.szogFok - r2.szogFok) > 1e-6) continue;
    for (const jel of jelek) {
      if (jel === "M") continue;
      const i1 = r1.torespontok.length - 1;
      const rb = rajzolt(jel, r1, i1, "bal"), rj = rajzolt(jel, r2, 0, "jobb");
      const helyes = r1.torespontok[i1][jel].bal;
      if (Math.abs(rj - rb) <= tol(jel, helyes)) continue;
      if (Math.abs(rb - helyes) > tol(jel, helyes) && Math.abs(rj - helyes) <= tol(jel, helyes)) continue; // a másik oldal a hibás, azt az értékellenőrzés fogja
      hiba({ kod: "ugras_felesleges", rud: r2.rud, x: 0, i: 0, jel, oldal: "jobb", helyes, rajzolt: rj, csomopont: cs.id,
        cim: `Fölösleges ugrás a ${jel}-ábrában ${csNev(cs.id)}nál`,
        magyarazat: `${csNev(cs.id)[0].toUpperCase()}${csNev(cs.id).slice(1)}ban nincs támasz és nincs koncentrált erő, ezért a ${jel} folytonosan megy át ${rudNev(r1.rud)}ról ${rudNev(r2.rud)}ra: mindkét oldalon ${f1(helyes)} ${egys(jel)}. Nálad ${rudNev(r1.rud)} végén ${f1(rb)}, ${rudNev(r2.rud)} elején ${f1(rj)} ${egys(jel)}.${cs.csukloE ? " A belső csukló csak a nyomatékot nullázza, a nyíróerőt és a normálerőt átviszi!" : ""}`,
        tipp: "Ugrás csak ott lehet, ahol koncentrált teher vagy reakció hat." });
      felhasznalt.add(kulcs(jel, r2, 0, "jobb"));
    }
  }

  /* ---- 2. sarok / csomóponti nyomatéki egyensúly (M) ---- */
  if (jelek.includes("M")) {
    for (const cs of f.csomopontok) {
      const vegek = cs.csomopontiEgyensuly;
      if (!vegek) continue;
      let S = 0, Sigaz = 0, tMax = 0;
      const resztvevok = [];
      for (const v of vegek) {
        const r = f.rudak.find((q) => q.rud === v.rud);
        const i = v.oldal === "a" ? 0 : r.torespontok.length - 1;
        const oldal = v.oldal === "a" ? "jobb" : "bal";
        const elojel = (v.oldal === "a" ? 1 : -1) * (r.pozitivOldal === 1 ? -1 : 1);
        const helyes = r.torespontok[i].M[oldal];
        const raj = rajzolt("M", r, i, oldal);
        S += elojel * raj;
        Sigaz += elojel * helyes;
        tMax = Math.max(tMax, tol("M", helyes));
        resztvevok.push({ r, i, oldal, helyes, raj, elojel });
      }
      S += cs.teher.M;
      Sigaz += cs.teher.M;
      if (Math.abs(Sigaz) > 1e-6) continue; // (elvben nem fordul elő) — ilyenkor nem ítélünk
      if (Math.abs(S) <= tMax) continue;
      const rosszak = resztvevok.filter((q) => Math.abs(q.raj - q.helyes) > tol("M", q.helyes));
      if (!rosszak.length) continue;
      const ketRud = resztvevok.length === 2 && Math.abs(cs.teher.M) < EPS;
      const lista = resztvevok.map((q) => `${q.r.rud}. rúd: ${f1(q.raj)} (helyesen ${f1(q.helyes)})`).join("; ");
      hiba({ kod: "sarok", rud: rosszak[0].r.rud, x: rosszak[0].r.torespontok[rosszak[0].i].x, i: rosszak[0].i, jel: "M", oldal: rosszak[0].oldal, helyes: rosszak[0].helyes, rajzolt: rosszak[0].raj, csomopont: cs.id,
        cim: `A nyomaték nem „fordul át” ${nevelo(cs.id)} ${cs.id} ${ketRud ? "sarokban" : "csomópontban"}`,
        magyarazat: ketRud
          ? `Merev sarokban a két rúdvég nyomatéka egyenlő nagyságú (${f1(Math.abs(resztvevok[0].helyes))} kNm), és a húzott oldal is ugyanoda esik — az M-ábra folytonosan megy át a sarkon. Nálad: ${lista} kNm.`
          : `${csNev(cs.id)[0].toUpperCase()}${csNev(cs.id).slice(1)} nyomatéki egyensúlyából a rúdvégek nyomatékainak (${Math.abs(cs.teher.M) > EPS ? `a ${f1(Math.abs(cs.teher.M))} kNm csomóponti nyomatékkal együtt ` : ""}) nullát kell adniuk. Nálad: ${lista} kNm.`,
        tipp: ketRud ? "Számold ki az egyik rúdvég nyomatékát a bal (vagy külső) részből, és írd át a másik rúd végére ugyanazt." : "Írd fel a csomópontra ΣM = 0-t a rúdvégek nyomatékaival." });
      for (const q of rosszak) felhasznalt.add(kulcs("M", q.r, q.i, q.oldal));
    }
  }

  /* ---- 3. pontonkénti értékek ---- */
  for (const jel of jelek) {
    for (const r of f.rudak) {
      r.torespontok.forEach((p, i) => {
        for (const o of p[jel].fogok) {
          const helyes = p[jel][o];
          const raj = rajzolt(jel, r, i, o);
          const elt = raj - helyes;
          const t = tol(jel, helyes);
          if (Math.abs(elt) <= t) { joPontok.push({ rud: r.rud, i, x: p.x, jel, oldal: o }); continue; }
          if (felhasznalt.has(kulcs(jel, r, i, o))) continue;
          const apro = Math.abs(elt) <= 2 * t;
          const cs = p.cs ? csById(p.cs) : null;
          const alap = { rud: r.rud, x: p.x, i, jel, oldal: o, helyes, rajzolt: raj, apro };
          const eltSzoveg = `Te ${f1(raj)} ${egys(jel)}-t rajzoltál, a helyes ${f1(helyes)} ${egys(jel)} (eltérés ${f1(Math.abs(elt))} ${egys(jel)}).`;
          // belső csukló: M = 0
          if (jel === "M" && cs && cs.csukloE && Math.abs(helyes) < 1e-6) {
            hiba({ ...alap, kod: "csuklo_M", apro: false, cim: `Nyomaték a belső csuklóban (${cs.id})`,
              magyarazat: `A csukló nem visz át nyomatékot, ezért ott M = 0 — a rúdvégen is. ${eltSzoveg}`,
              tipp: "Húzd a csukló fogópontját a tengelyre. Gerber-tartónál a csuklóra írt ΣM = 0 adja a hiányzó egyenletet." });
            continue;
          }
          // szabad vég
          if (cs && cs.szabadVeg) {
            const th = cs.teher;
            const terhelt = Math.abs(th.Fx) + Math.abs(th.Fy) + Math.abs(th.M) > EPS;
            hiba({ ...alap, kod: "szabad_veg", apro: false, cim: `${jel} ${nevelo(cs.id)} ${cs.id} szabad végen`,
              magyarazat: terhelt
                ? `A szabad végen az igénybevétel pontosan a rajta ható teherrel egyenlő: ${jel} = ${f1(helyes)} ${egys(jel)} (a végen ${Math.abs(th.M) > EPS ? `${f1(Math.abs(th.M))} kNm nyomaték` : ""}${Math.abs(th.M) > EPS && Math.hypot(th.Fx, th.Fy) > EPS ? " és " : ""}${Math.hypot(th.Fx, th.Fy) > EPS ? `${f1(Math.hypot(th.Fx, th.Fy))} kN erő` : ""} hat). ${eltSzoveg}`
                : `A terheletlen szabad végen nincs mitől igénybevétel lennie: N = V = M = 0. ${eltSzoveg}`,
              tipp: terhelt ? "Vágd el a rudat közvetlenül a vég mellett: a levágott apró darabon csak a végteher hat." : "A szabad végtől indulva a rajz egyszerű: nulláról indulsz, és csak a terhek változtatják." });
            continue;
          }
          // szélső támasz, M
          if (jel === "M" && cs && cs.szelsoTamasz) {
            const bef = cs.tamasz.tipus === "befogas";
            hiba({ ...alap, kod: "tamasz_veg_M", apro: false, cim: bef ? `Befogási nyomaték ${cs.id}-ban` : `Nyomaték ${nevelo(cs.id)} ${cs.id} ${cs.tamasz.tipus === "gorgo" ? "görgős" : "csuklós"} támasznál`,
              magyarazat: bef
                ? `Befogásnál a rúdvég nyomatéka a befogási nyomatékkal egyenlő: M = ${f1(helyes)} kNm. ${eltSzoveg}`
                : `A ${cs.tamasz.tipus === "gorgo" ? "görgő" : "csukló"} nem gátolja az elfordulást, ezért a szélső támasznál M = ${f1(helyes)} kNm${Math.abs(cs.teher.M) > EPS ? " (a csomóponti nyomaték miatt nem nulla)" : " (nulla)"}. ${eltSzoveg}`,
              tipp: bef ? "A befogási nyomatékot ΣM_A = 0-ból számold, az előjelét a húzott oldal dönti el." : "Csuklós/görgős szélső támasznál az M-ábra mindig a tengelyről indul." });
            continue;
          }
          // fordított előjel
          if (Math.abs(helyes) > t && Math.abs(raj + helyes) <= t) {
            hiba({ ...alap, kod: "elojel", apro: false, cim: `Fordított előjel: ${jel} ${helyNev(r, p, o)}`,
              magyarazat: `A nagyság stimmel (${f1(Math.abs(helyes))} ${egys(jel)}), de az előjel fordított: helyesen ${f1(helyes)} ${egys(jel)}. ${jel === "V" ? "A V a bal oldali rész felfelé mutató erőinek összege (vízszintes, balról jobbra haladó rúdon); ha a bal oldali eredő lefelé mutat, a V negatív. Az ábrán a pozitív V a rúd pozitív (vízszintes rúdnál alsó) oldalára kerül, ugyanoda, ahová a pozitív M — nem a tartó fölé!" : jel === "M" ? "Az M-et a húzott oldalra rajzoljuk: ha a rúd alul húzott (a tartó „lelóg”), az M pozitív; felül húzott szakaszon (konzol, támasz fölött) negatív." : "Az N akkor pozitív, ha húzza a keresztmetszetet (a rúdból kifelé mutat); nyomásnál negatív. Az ábrán a pozitív N is a rúd pozitív (vízszintes rúdnál alsó) oldalára kerül, mint az M."}`,
              tipp: jel === "M" ? "Nézd meg, melyik oldal nyúlik meg — a nyomatéki ábra mindig arra az oldalra kerül." : "Vágd el a rudat, tartsd meg a bal oldali részt, és nézd, merre mutat a rajta ható erők eredője." });
            continue;
          }
          // meredekség: egyenes M-szakasz vége, a kezdete és a V jó
          if (jel === "M" && (o === "bal" || p[jel].fogok.length === 1) && i > 0) {
            const s = r.szakaszok[i - 1];
            const kezdJo = Math.abs(rajzolt("M", r, s.iKezd, "jobb") - r.torespontok[s.iKezd].M.jobb) <= tol("M", r.torespontok[s.iKezd].M.jobb);
            const Vk = r.torespontok[s.iKezd].V.jobb, Vv = r.torespontok[s.iVeg].V.bal;
            const vJo = Math.abs(rajzolt("V", r, s.iKezd, "jobb") - Vk) <= tol("V", Vk) && Math.abs(rajzolt("V", r, s.iVeg, "bal") - Vv) <= tol("V", Vv);
            if (Math.abs(s.q) < EPS && s.alakM === "egyenes" && kezdJo && (vJo || !jelek.includes("V"))) {
              const M1 = r.torespontok[s.iKezd].M.jobb;
              hiba({ ...alap, kod: "meredekseg", cim: `Az M lejtése nem egyezik a V-vel (${i}. szakasz${tobbRud ? `, ${r.rud}. rúd` : ""})`,
                magyarazat: `dM/dx = V: a ${fm(s.hossz)} hosszú, terheletlen szakaszon V = ${f1(Vk)} kN állandó, ezért az M-nek ${f1(Vk)} · ${f1(s.hossz)} = ${f1(Vk * s.hossz)} kNm-rel kell változnia: ${f1(M1)} → ${f1(helyes)} kNm. Te ${f1(raj)} kNm-re jutottál (változás ${f1(raj - M1)} kNm).`,
                tipp: "A szakasz végén az M = a szakasz eleji M + V · L. A V-ábra területe adja az M változását." });
              continue;
            }
          }
          hiba({ ...alap, kod: "ertek", cim: `${apro ? "Kicsit pontatlan" : "Rossz"} ${jel} ${helyNev(r, p, o)}`,
            magyarazat: eltSzoveg + (apro ? " Ez már majdnem jó — a tolerancián kívül van, de csak kevéssel." : ""),
            tipp: jel === "M" ? "Vágd el itt a tartót, és írd fel a bal (vagy jobb) oldali rész erőinek nyomatékát a metszetre." : jel === "V" ? "Add össze a metszettől balra eső, a rúdra merőleges erőket (a reakciókkal együtt)." : "Add össze a metszettől balra eső tengelyirányú erőket; húzás pozitív." });
        }
      });
    }
  }

  /* ---- 4. alak (M) ---- */
  const teny = alakTenyleges(f, rajz, alakok, szelsok);
  if (jelek.includes("M")) {
    for (const r of f.rudak) {
      r.szakaszok.forEach((s, k) => {
        const tenyl = teny[r.rud][k];
        if (tenyl === s.alakM) return;
        const vanQ = Math.abs(s.q) > EPS;
        const nev = (a) => (a === "egyenes" ? "egyenes" : a === "U" ? "a pozitív (húzott, +) oldal felé domborodó parabola" : "a negatív oldal felé domborodó parabola");
        hiba({ kod: "alak", rud: r.rud, x: (s.x1 + s.x2) / 2, i: s.iKezd, szakasz: k, jel: "M", helyes: null, rajzolt: null,
          cim: `Rossz alak az M-ábrán (${k + 1}. szakasz${tobbRud ? `, ${r.rud}. rúd` : ""})`,
          magyarazat: s.alakM === "egyenes"
            ? `A ${fm(s.x1)}–${fm(s.x2)} szakaszon nincs a rúdra merőleges megoszló teher${Math.abs(s.qx) > EPS ? " (a tengelyirányú megoszló teher az M-et nem görbíti)" : ""}, ezért a V állandó és az M egyenes. Te parabolát választottál.`
            : `A ${fm(s.x1)}–${fm(s.x2)} szakaszon ${f1(Math.abs(s.q))} kN/m megoszló teher hat, ezért az M parabola (d²M/dx² = −q), és a teher irányába domborodik: itt ${nev(s.alakM)}. Te ${tenyl === "egyenes" ? "egyenest rajzoltál" : "az ellenkező irányba domborítottad"}.`,
          tipp: vanQ ? "Az M-parabola mindig „belóg” a teher irányába — lefelé mutató teher alatt lefelé (∪) domborodik, ha az M-et alul (a húzott oldalon) rajzolod." : "Terheletlen szakaszon a V-ábra vízszintes, az M pedig egyenes (a lejtése a V)." });
      });
    }
  }

  /* ---- 5. szélsőérték (M) ---- */
  if (jelek.includes("M")) {
    for (const r of f.rudak) {
      r.szakaszok.forEach((s, k) => {
        const sz_ = szelsok?.[r.rud]?.[k] ?? null;
        if (s.szelsoX === null) {
          if (sz_) hiba({ kod: "szelso", rud: r.rud, x: sz_.x, i: s.iKezd, szakasz: k, jel: "M", helyes: null, rajzolt: sz_.ertek,
            cim: `Nincs szélsőérték ${nevelo(k + 1)} ${k + 1}. szakasz belsejében${tobbRud ? ` (${r.rud}. rúd)` : ""}`,
            magyarazat: `Az M-nek ott van szélsőértéke, ahol V = 0 (előjelet vált). A ${fm(s.x1)}–${fm(s.x2)} szakaszon a V nem vált előjelet, ezért az M szélsőértéke a szakasz végén van, nem a belsejében.`,
            tipp: "Kapcsold ki a szélsőérték-fogópontot ezen a szakaszon." });
          return;
        }
        const helyTol = Math.max(0.15, 0.08 * s.hossz);
        if (!sz_) {
          hiba({ kod: "szelso", rud: r.rud, x: s.szelsoX, i: s.iKezd, szakasz: k, jel: "M", helyes: s.szelsoM, rajzolt: null,
            cim: `Hiányzik az M szélsőértéke (${k + 1}. szakasz${tobbRud ? `, ${r.rud}. rúd` : ""})`,
            magyarazat: `A ${fm(s.x1)}–${fm(s.x2)} szakaszon a V előjelet vált (V = 0 az x = ${fm(s.szelsoX)} helyen), ezért az M-nek ott szélsőértéke van: M = ${f1(s.szelsoM)} kNm. A rajzodon ez a pont nincs bejelölve, így a parabola csúcsa rossz helyen van.`,
            tipp: "Kapcsold be az „itt van szélsőérték” fogópontot, a helyét a V = 0-ból (x = V₁/q), az értékét a bal oldali rész nyomatékából számold." });
          return;
        }
        const helyRossz = Math.abs(sz_.x - s.szelsoX) > helyTol;
        const ertekRossz = Math.abs(sz_.ertek - s.szelsoM) > tol("M", s.szelsoM);
        if (!helyRossz && !ertekRossz) { joPontok.push({ rud: r.rud, i: s.iKezd, szakasz: k, x: sz_.x, jel: "M", oldal: "szelso" }); return; }
        hiba({ kod: "szelso", rud: r.rud, x: sz_.x, i: s.iKezd, szakasz: k, jel: "M", helyes: s.szelsoM, rajzolt: sz_.ertek, helyesX: s.szelsoX,
          cim: `${helyRossz && ertekRossz ? "Rossz helyen és rossz értékkel" : helyRossz ? "Rossz helyen" : "Rossz értékkel"} van az M szélsőértéke (${k + 1}. szakasz${tobbRud ? `, ${r.rud}. rúd` : ""})`,
          magyarazat: `${helyRossz ? `A V = 0 hely x = ${fm(s.szelsoX)} (te x = ${fm(sz_.x)}-hez tetted). ` : ""}${ertekRossz ? `Az M ott ${f1(s.szelsoM)} kNm (te ${f1(sz_.ertek)} kNm-t rajzoltál). ` : ""}A szélsőérték helye a V-ábrából jön: ahol a V a tengelyt metszi.`,
          tipp: "Számold ki: x₀ = V(szakasz eleje) / q, majd M(x₀) = M(szakasz eleje) + V · x₀ / 2 (a V-háromszög területe)." });
      });
    }
  }

  /* ---- 6. reakciók ---- */
  if (reakcioTippek) {
    const komp = reakcioKomponensek(f.e);
    for (const k of komp) {
      const tipp = reakcioTippek[k.kulcs];
      if (tipp === undefined || tipp === null || tipp === "") continue;
      const t = Number(tipp);
      if (!Number.isFinite(t) || Math.abs(t - k.helyes) > Math.max(0.1 * Math.abs(k.helyes), 0.5)) {
        const fordit = Number.isFinite(t) && Math.abs(k.helyes) > 0.5 && Math.abs(t + k.helyes) <= Math.max(0.1 * Math.abs(k.helyes), 0.5);
        hiba({ kod: "reakcio", rud: null, x: null, jel: "R", kulcs: k.kulcs, csomopont: k.csomopont, helyes: k.helyes, rajzolt: t,
          cim: `Rossz reakció: ${k.jel}`,
          magyarazat: `${k.leiras[0].toUpperCase()}${k.leiras.slice(1)}: helyesen ${f1(k.helyes)} ${k.kulcs.endsWith("M") ? "kNm" : "kN"}, te ${Number.isFinite(t) ? f1(t) : "—"}-t írtál.${fordit ? " A nagyság jó, csak az irány fordított: a negatív előjel azt jelenti, hogy a reakció a feltételezettel ellentétes irányú." : ""} Ez a ${k.egyenlet} egyenletből jön.`,
          tipp: "Írd fel a nyomatéki egyenletet arra a pontra, ahol a másik reakció kiesik (főpont), és ellenőrizd a vetületi egyenlettel." });
      }
    }
  }

  /* ---- pontozás ---- */
  let levonas = 0;
  for (const h of hibak) levonas += h.apro ? 2 : h.sulyos ? 12 : 6;
  let pont = Math.max(0, 100 - levonas);
  // felső korlát: a pont nem lehet több, mint a jó fogópontok súlyozott aránya (a nulla értékű,
  // „magától” jó fogópont fél súllyal számít) — így az üres, hozzá sem nyúlt rajz nem ér sokat
  let sulyOssz = 0, sulyJo = 0;
  for (const jel of jelek) {
    for (const r of f.rudak) {
      r.torespontok.forEach((p, i) => {
        for (const o of p[jel].fogok) {
          const w = Math.abs(p[jel][o]) < 1e-9 ? 0.5 : 1;
          sulyOssz += w;
          if (joPontok.some((j) => j.jel === jel && j.rud === r.rud && j.i === i && j.oldal === o)) sulyJo += w;
        }
      });
    }
  }
  if (sulyOssz > 0) pont = Math.min(pont, Math.round((100 * sulyJo) / sulyOssz));
  if (segitseg >= 3) pont = 0;
  else if (segitseg === 2) pont = Math.max(0, pont - 15);
  else if (segitseg === 1) pont = Math.max(0, pont - 5);
  if (reakciokMutatva) pont = Math.round(pont * 0.8);
  pont = Math.round(pont);

  const sulyosDb = hibak.filter((h) => h.sulyos).length, aproDb = hibak.filter((h) => h.apro).length;
  let osszefoglalo;
  if (!hibak.length) osszefoglalo = segitseg >= 3 ? "A rajz jó — de a pontos ábrát megmutattuk, ezért a kör 0 pont. Próbáld újra segítség nélkül!" : "Hibátlan ábra! Minden töréspont, ugrás és alak stimmel.";
  else {
    const kodok = [...new Set(hibak.map((h) => h.kod))];
    const nevek = { ertek: "érték", elojel: "előjel", ugras_hianyzik: "hiányzó ugrás", ugras_rossz: "rossz ugrás", ugras_felesleges: "fölösleges ugrás", csuklo_M: "nyomaték a csuklóban", szabad_veg: "szabad vég", tamasz_veg_M: "nyomaték a támasznál", alak: "alak", meredekseg: "meredekség", szelso: "szélsőérték", sarok: "sarok", reakcio: "reakció" };
    osszefoglalo = `${hibak.length} hiba (${sulyosDb} súlyos${aproDb ? `, ${aproDb} apró` : ""}): ${kodok.map((k) => nevek[k]).join(", ")}. Kattints egy hibára a listában — a rajzon kiemeljük, és elmondjuk a szabályt.`;
  }
  // a súlyosak előre
  hibak.sort((a, b) => (b.sulyos ? 1 : 0) - (a.sulyos ? 1 : 0) || (a.apro ? 1 : 0) - (b.apro ? 1 : 0));
  return { pont, hibak, joPontok, osszefoglalo, levonas };
}
