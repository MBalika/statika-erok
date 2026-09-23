/**
 * A Tartóépítő tiszta logikájának tesztje:  node src/lib/epito/teszt-epito.mjs
 */
import { elemez } from "../tarto/index.js";
import {
  uresAllapot, hozzaadCsomopont, hozzaadRud, rudFeloszt, csukloValt, tamaszCiklus, tamaszBeallit, teherHozzaad, teherModosit, elemTorol,
  csomopontMozgat, motorModell, allapotJelzes, sorosit, beolvas, tomorit, ellenorzottAllapot, vanTeher, betujel,
} from "./modell.js";
import { SABLONOK } from "./sablonok.js";
import { veletlenTarto, hasznalhato } from "./veletlen.js";
import { rajzFeladat, uresRajz, pontosRajz, ellenoriz, alakTenyleges, reakcioKomponensek, tolerancia } from "./ellenorzes.js";
import { tippGorbe, pontosGorbe, rajzLeptekek, szepHatar } from "./rajz.js";

let db = 0, hibas = 0;
function ok(felt, nev) {
  db++;
  if (felt) console.log(`  ✓ ${nev}`);
  else { hibas++; console.log(`  ✗ ${nev}`); }
}
const kozel = (a, b, t = 1e-6) => Math.abs(a - b) <= t;
const elemzes = (all) => elemez(motorModell(all));
const masol = (o) => JSON.parse(JSON.stringify(o));

/* ------------------------------------------------------------ */
console.log("1. sorosítás oda-vissza");
for (const s of SABLONOK) {
  const szoveg = sorosit(s.allapot);
  const vissza = beolvas(szoveg);
  ok(vissza && JSON.stringify(tomorit(vissza)) === JSON.stringify(tomorit(s.allapot)), `${s.nev}: base64url ⇄ állapot (${szoveg.length} karakter, csak URL-biztos jelek: ${/^[A-Za-z0-9_-]+$/.test(szoveg)})`);
}
ok(beolvas("nem-base64!!") === null, "hibás szöveg → null");
ok(beolvas("") === null, "üres szöveg → null");
ok(ellenorzottAllapot({ csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "B", x: 4, y: 0 }], rudak: [{ id: "1", a: "A", b: "B" }] })?.rudak.length === 1, "ellenorzottAllapot: laza objektumból is állapot");
ok(betujel(0) === "A" && betujel(25) === "Z" && betujel(26) === "AA" && betujel(27) === "AB", "betűjelek: A … Z, AA, AB");

/* ------------------------------------------------------------ */
console.log("2. csukló-leképezés és motor-modell");
{
  const g = SABLONOK.find((s) => s.id === "gerber").allapot;
  const mm = motorModell(g);
  const r2 = mm.rudak.find((r) => r.id === "2"), r3 = mm.rudak.find((r) => r.id === "3");
  ok(!r2.csukloB && r3.csukloA === true, "Gerber: a G csuklóban az első rúd merev marad, a második csukloA-t kap");
  const e = elemez(mm);
  ok(e.ok && e.merleg.tipus === "hatarozott", "Gerber: határozott");
  const igG = e.igenybevetelek.find((i) => i.rud === "3");
  ok(kozel(igG.szakaszok[0].M[0], 0, 1e-6), "Gerber: a csuklóban M = 0 a 3. rúd elején");
}
{
  const h = SABLONOK.find((s) => s.id === "haromcsuklos").allapot;
  const mm = motorModell(h);
  ok(mm.rudak.find((r) => r.id === "3").csukloA === true && !mm.rudak.find((r) => r.id === "2").csukloB, "háromcsuklós keret: a G csukló a 3. rúd elejére kerül");
}
{
  let all = uresAllapot();
  let r = hozzaadCsomopont(all, 0, 0); all = r.allapot;
  r = hozzaadCsomopont(all, 4, 0); all = r.allapot;
  r = hozzaadCsomopont(all, 4, 3); all = r.allapot;
  all = hozzaadRud(all, "A", "B").allapot;
  all = hozzaadRud(all, "B", "C").allapot;
  all = tamaszBeallit(all, "A", "csuklo");
  all = tamaszBeallit(all, "B", "gorgo", 45);
  all = tamaszBeallit(all, "C", "befogas");
  all = teherHozzaad(all, { fajta: "csomopontiEro", csomopont: "B", F: 10, szog: -90 }).allapot;
  all = teherHozzaad(all, { fajta: "csomopontiEro", csomopont: "C", F: 8, szog: 0 }).allapot;
  all = teherHozzaad(all, { fajta: "csomopontiNyomatek", csomopont: "C", M: -5 }).allapot;
  all = teherHozzaad(all, { fajta: "pontTeher", rud: "1", a: 1, F: 6, szog: -90 }).allapot;
  all = teherHozzaad(all, { fajta: "pontNyomatek", rud: "1", a: 2, M: 4 }).allapot;
  all = teherHozzaad(all, { fajta: "megoszlo", rud: "2", a1: 0, a2: 3, p1: 2, p2: 4, szog: 180 }).allapot;
  const mm = motorModell(all);
  ok(mm.tamaszok.length === 3 && mm.tamaszok.find((t) => t.csomopont === "B").szog === 45 && mm.tamaszok.find((t) => t.csomopont === "C").tipus === "befogas", "támaszok: csukló, 45°-os görgő, befogás");
  const te = mm.terhek;
  ok(kozel(te[0].Fx, 0) && kozel(te[0].Fy, -10), "csomóponti erő −90° → Fx = 0, Fy = −10");
  ok(kozel(te[1].Fx, 8) && kozel(te[1].Fy, 0), "csomóponti erő 0° → Fx = 8");
  ok(te[2].fajta === "csomopontiNyomatek" && te[2].M === -5, "csomóponti nyomaték");
  ok(te[3].fajta === "pontTeher" && te[3].irany === "szog" && te[3].szog === -90 && te[3].F === 6 && te[3].a === 1, "pontTeher szöggel");
  ok(te[4].fajta === "pontNyomatek" && te[4].M === 4, "pontNyomatek");
  ok(te[5].fajta === "megoszlo" && te[5].p1 === 2 && te[5].p2 === 4 && te[5].szog === 180 && te[5].a2 === 3, "megoszló teher (trapéz, balra)");
  const e = elemez(mm);
  ok(e.ok, "a vegyes modell megoldható (a motor elfogadja)");
}

/* ------------------------------------------------------------ */
console.log("3. szerkesztő-műveletek");
{
  let all = uresAllapot();
  all = hozzaadCsomopont(all, 0.3, 0.2).allapot;
  ok(all.csomopontok[0].x === 0.5 && all.csomopontok[0].y === 0, "csomópont a 0,5 m-es rácsra kerekítve");
  all = hozzaadCsomopont(all, 6, 0).allapot;
  all = hozzaadCsomopont(all, 3, 0).allapot; // közbeeső
  const r = hozzaadRud(all, "A", "B");
  ok(r.ids.length === 2 && r.allapot.rudak.every((q) => q.a === "A" ? q.b === "C" : q.a === "C" && q.b === "B"), "rúd A–B a közbeeső C csomópontnál automatikusan feloszlik");
  all = r.allapot;
  all = teherHozzaad(all, { fajta: "megoszlo", rud: "1", a1: 0, a2: 2.5, p1: 4, p2: 4, szog: -90 }).allapot;
  all = teherHozzaad(all, { fajta: "pontTeher", rud: "1", a: 2, F: 10, szog: -90 }).allapot;
  const f = rudFeloszt(all, "1", 1);
  ok(f.id === "D" && f.allapot.rudak.length === 3, "rúd felosztása új csomóponttal");
  const q = f.allapot.terhek.filter((t) => t.fajta === "megoszlo");
  const p = f.allapot.terhek.find((t) => t.fajta === "pontTeher");
  ok(q.length === 2 && q[0].a2 === 1 && q[1].a1 === 0 && q[1].a2 === 1.5 && p.a === 1 && p.rud !== "1", "a terhek átkerülnek a felosztott részekre");
  all = f.allapot;
  all = csukloValt(all, "C");
  ok(all.csuklok.includes("C"), "belső csukló be");
  all = csukloValt(all, "C");
  ok(!all.csuklok.includes("C"), "belső csukló ki");
  let t = tamaszCiklus(all, "A");
  ok(t.tamaszok[0].tipus === "gorgo", "támasz-ciklus: nincs → görgő");
  t = tamaszCiklus(t, "A"); ok(t.tamaszok[0].tipus === "csuklo", "görgő → csukló");
  t = tamaszCiklus(t, "A"); ok(t.tamaszok[0].tipus === "befogas", "csukló → befogás");
  t = tamaszCiklus(t, "A"); ok(t.tamaszok.length === 0, "befogás → nincs");
  const torolt = elemTorol(all, { tipus: "csomopont", id: "C" });
  ok(torolt.csomopontok.length === 3 && torolt.rudak.length === 1 && torolt.terhek.every((x) => x.rud === "1"), "csomópont törlése viszi a rudait és azok terheit");
  const mozg = csomopontMozgat(all, "B", 20, -3);
  ok(mozg.csomopontok.find((c) => c.id === "B").x === 14 && mozg.csomopontok.find((c) => c.id === "B").y === 0, "csomópont mozgatása a tartományba szorítva");
  const mod = teherModosit(all, p.id, { a: 99 });
  ok(mod.terhek.find((x) => x.id === p.id).a <= 1.5, "teher helye a rúd hosszára szorítva");
}

/* ------------------------------------------------------------ */
console.log("4. élő állapotjelzés");
{
  const k = SABLONOK.find((s) => s.id === "kettamaszu").allapot;
  ok(allapotJelzes(k).kod === "kesz", "kéttámaszú + teher: kész");
  ok(allapotJelzes(tamaszBeallit(k, "B", null)).kod === "mechanizmus", "görgő nélkül: mechanizmus");
  ok(allapotJelzes(tamaszBeallit(k, "B", "csuklo")).kod === "hatarozatlan", "két csukló: határozatlan (1 fölös)");
  ok(allapotJelzes({ ...k, terhek: [] }).kod === "terheletlen", "teher nélkül: terheletlen");
  ok(allapotJelzes(uresAllapot()).kod === "ures", "üres: ures");
  // három párhuzamos görgő: a számlálás rendben, de kritikus
  let krit = { ...k, csomopontok: [...k.csomopontok, { id: "C", x: 5, y: 3 }], rudak: [{ id: "1", a: "A", b: "C" }, { id: "2", a: "C", b: "B" }] };
  krit = tamaszBeallit(krit, "A", "gorgo", 90);
  krit = tamaszBeallit(krit, "C", "gorgo", 90);
  krit = tamaszBeallit(krit, "B", "gorgo", 90);
  krit.terhek = [{ id: "t1", fajta: "pontTeher", rud: "1", a: 2, F: 10, szog: -90 }];
  ok(allapotJelzes(krit).kod === "kritikus", "három párhuzamos görgő: kritikus elrendezés");
}

/* ------------------------------------------------------------ */
console.log("5. sablonok");
for (const s of SABLONOK) {
  const e = elemzes(s.allapot);
  ok(e.ok && e.merleg.tipus === "hatarozott" && vanTeher(s.allapot) && e.ellenorzes.rendben, `${s.nev}: határozott, terhelt, ΣF = ΣM = 0`);
}

/* ------------------------------------------------------------ */
console.log("6. véletlen generátor (3 × 300)");
for (const fok of [1, 2, 3]) {
  let rossz = 0, kerek = 0;
  const nevek = new Set();
  for (let i = 0; i < 300; i++) {
    const v = veletlenTarto(fok);
    const h = hasznalhato(v.allapot);
    if (!h.ok) { rossz++; continue; }
    nevek.add(v.nev);
    if (h.f.kerekE) kerek++;
    const modell = motorModell(v.allapot);
    for (const t of modell.terhek) {
      if (t.fajta === "pontTeher" && (Math.abs(t.F) < 5 || Math.abs(t.F) > 30)) rossz++;
      if (t.fajta === "megoszlo" && (Math.abs(t.p1) < 2 || Math.abs(t.p1) > 10)) rossz++;
    }
  }
  ok(rossz === 0, `${fok}. fok: 300 futtatás, 0 hibás modell (kerek értékű: ${kerek}, fajták: ${[...nevek].join(", ")})`);
}

/* ------------------------------------------------------------ */
console.log("7. ellenőrzés: pontos rajz 100 pont");
const feladatok = {};
for (const s of SABLONOK) {
  const e = elemzes(s.allapot);
  const f = rajzFeladat(e);
  feladatok[s.id] = { e, f };
  const p = pontosRajz(f);
  const ki = ellenoriz({ eredmeny: e, feladat: f, ...p, jelek: ["N", "V", "M"] });
  ok(ki.pont === 100 && ki.hibak.length === 0, `${s.nev}: 100 pont, 0 hiba (N, V, M) — ${f.rudak.reduce((a, r) => a + r.torespontok.length, 0)} töréspont`);
}

/* ------------------------------------------------------------ */
console.log("8. szándékos rontások → a megfelelő hibakód");
const kodok = (ki) => ki.hibak.map((h) => h.kod);
{
  const { e, f } = feladatok.kettamaszu;
  const p = pontosRajz(f);
  // fordított előjel az M-nél a középső ponton
  let r = masol(p);
  r.rajz.M["1"][1] = { bal: -18, jobb: -18 };
  let ki = ellenoriz({ eredmeny: e, feladat: f, ...r });
  ok(kodok(ki).includes("elojel") && ki.hibak.find((h) => h.kod === "elojel").sulyos, `fordított előjel → elojel (pont: ${ki.pont})`);
  // kihagyott ugrás a V-ben (bal = jobb = 6)
  r = masol(p);
  r.rajz.V["1"][1] = { bal: 6, jobb: 6 };
  ki = ellenoriz({ eredmeny: e, feladat: f, ...r });
  ok(kodok(ki).includes("ugras_hianyzik") && !kodok(ki).includes("ertek"), `kihagyott ugrás → ugras_hianyzik, és nincs külön „ertek” hiba a jobb oldalra (${kodok(ki).join(", ")})`);
  // rossz nagyságú ugrás
  r = masol(p);
  r.rajz.V["1"][1] = { bal: 6, jobb: -3 };
  ki = ellenoriz({ eredmeny: e, feladat: f, ...r });
  ok(kodok(ki).includes("ugras_rossz"), "rossz nagyságú ugrás → ugras_rossz");
  ok(f.rudak[0].torespontok[1].N.fogok.length === 1 && f.rudak[0].torespontok[1].M.fogok.length === 1, "függőleges erőnél csak a V-nek van két fogópontja (N, M: egy)");
  // nyomaték a görgős támasznál
  r = masol(p);
  r.rajz.M["1"][2] = { bal: 6, jobb: 6 };
  ki = ellenoriz({ eredmeny: e, feladat: f, ...r });
  ok(kodok(ki).includes("tamasz_veg_M"), "M ≠ 0 a görgős szélső támasznál → tamasz_veg_M");
  // meredekség: a szakasz eleje és a V jó, a vége nem
  r = masol(p);
  r.rajz.M["1"][1] = { bal: 12, jobb: 12 };
  r.rajz.M["1"][2] = { bal: 0, jobb: 0 };
  ki = ellenoriz({ eredmeny: e, feladat: f, ...r });
  ok(kodok(ki).includes("meredekseg"), `M-lejtés ≠ V → meredekseg (${kodok(ki).join(", ")})`);
  // tolerancia: 9 % jó, 12 % nem
  r = masol(p);
  r.rajz.M["1"][1] = { bal: 18 * 1.09, jobb: 18 * 1.09 };
  ki = ellenoriz({ eredmeny: e, feladat: f, ...r });
  ok(ki.pont === 100, "9 %-os eltérés még jó (100 pont)");
  r = masol(p);
  r.rajz.M["1"][1] = { bal: 18 * 1.12, jobb: 18 * 1.12 };
  ki = ellenoriz({ eredmeny: e, feladat: f, ...r });
  ok(ki.pont < 100 && ki.hibak.length === 1 && ki.hibak[0].apro, `12 %-os eltérés már hiba (apró, ${ki.pont} pont)`);
  ok(kozel(tolerancia("M", 18, f.maxE), 1.8) && kozel(tolerancia("M", 0, f.maxE), 0.04 * 18), "tolerancia: max(10 %·|helyes|, 4 %·max)");
  // a segítség szintjei
  ok(ellenoriz({ eredmeny: e, feladat: f, ...p, segitseg: 1 }).pont === 95 && ellenoriz({ eredmeny: e, feladat: f, ...p, segitseg: 2 }).pont === 85 && ellenoriz({ eredmeny: e, feladat: f, ...p, segitseg: 3 }).pont === 0, "segítség: −5, −15, 0 pont");
  ok(ellenoriz({ eredmeny: e, feladat: f, ...p, reakciokMutatva: true }).pont === 80, "mutatott reakciók: −20 %");
  // reakció-tipp
  const komp = reakcioKomponensek(e);
  ok(komp.length === 3 && kozel(komp.find((k) => k.kulcs === "Ay").helyes, 6) && kozel(komp.find((k) => k.kulcs === "Bn").helyes, 6), "reakció-komponensek: A_x, A_y, B");
  ki = ellenoriz({ eredmeny: e, feladat: f, ...p, reakcioTippek: { Ax: 0, Ay: 6, Bn: 9 } });
  ok(kodok(ki).includes("reakcio") && ki.hibak[0].magyarazat.includes("ΣM_A = 0"), "rossz reakció → reakcio, az egyenlet megnevezve");
  ki = ellenoriz({ eredmeny: e, feladat: f, ...p, reakcioTippek: { Ax: 0, Ay: 6, Bn: 6 } });
  ok(!kodok(ki).includes("reakcio"), "jó reakciók → nincs reakcio-hiba");
}
{
  const { e, f } = feladatok.gerber;
  const p = pontosRajz(f);
  const r = masol(p);
  r.rajz.M["3"][0] = { bal: 4, jobb: 4 };
  let ki = ellenoriz({ eredmeny: e, feladat: f, ...r });
  ok(kodok(ki).includes("csuklo_M"), "M ≠ 0 a belső csuklóban → csuklo_M");
  // fölösleges ugrás a V-ben a G csuklónál (a csukló a nyíróerőt átviszi)
  const r2 = masol(p);
  r2.rajz.V["3"][0] = { bal: r2.rajz.V["3"][0].jobb + 6, jobb: r2.rajz.V["3"][0].jobb + 6 };
  ki = ellenoriz({ eredmeny: e, feladat: f, ...r2 });
  ok(kodok(ki).includes("ugras_felesleges") && ki.hibak.find((h) => h.kod === "ugras_felesleges").magyarazat.includes("csukló"), `V-ugrás a terheletlen G csuklónál → ugras_felesleges (${kodok(ki).join(", ")})`);
}
{
  const { e, f } = feladatok.konzol;
  const p = pontosRajz(f);
  let r = masol(p);
  r.alakok["1"] = ["egyenes"];
  let ki = ellenoriz({ eredmeny: e, feladat: f, ...r });
  ok(kodok(ki).includes("alak"), "egyenesnek rajzolt parabola → alak");
  r = masol(p);
  r.alakok["1"] = ["A"];
  ki = ellenoriz({ eredmeny: e, feladat: f, ...r });
  ok(kodok(ki).includes("alak") && ki.hibak[0].magyarazat.includes("ellenkező"), "ellenkező irányú parabola → alak");
  // szabad vég
  r = masol(p);
  r.rajz.V["1"][1] = { bal: 4, jobb: 4 };
  ki = ellenoriz({ eredmeny: e, feladat: f, ...r });
  ok(kodok(ki).includes("szabad_veg"), "V ≠ 0 a terheletlen szabad végen → szabad_veg");
  // befogási nyomaték rossz
  r = masol(p);
  r.rajz.M["1"][0] = { bal: -10, jobb: -10 };
  ki = ellenoriz({ eredmeny: e, feladat: f, ...r });
  ok(kodok(ki).includes("tamasz_veg_M") && ki.hibak[0].cim.includes("Befogási"), "rossz befogási nyomaték → tamasz_veg_M (befogás)");
}
{
  // kéttámaszú tartó egyenletes teherrel: szélsőérték a mező közepén
  const all = { ...SABLONOK.find((s) => s.id === "kettamaszu").allapot, terhek: [{ id: "t1", fajta: "megoszlo", rud: "1", a1: 0, a2: 6, p1: 4, p2: 4, szog: -90 }] };
  const e = elemzes(all);
  const f = rajzFeladat(e);
  const s = f.rudak[0].szakaszok[0];
  ok(kozel(s.szelsoX, 3) && kozel(s.szelsoM, 18) && s.alakM === "U", "q alatt: V = 0 a közepén, M = 18, alak ∪");
  const p = pontosRajz(f);
  let ki = ellenoriz({ eredmeny: e, feladat: f, ...p });
  ok(ki.pont === 100, "pontos rajz szélsőérték-fogóponttal: 100");
  let r = masol(p);
  r.szelsok["1"] = [null];
  r.alakok["1"] = ["U"];
  ki = ellenoriz({ eredmeny: e, feladat: f, ...r });
  ok(kodok(ki).includes("szelso") && ki.hibak[0].cim.startsWith("Hiányzik"), "bekapcsolatlan szélsőérték → szelso (hiányzik)");
  r = masol(p);
  r.szelsok["1"] = [{ x: 2, ertek: 18 }];
  ki = ellenoriz({ eredmeny: e, feladat: f, ...r });
  ok(kodok(ki).includes("szelso") && ki.hibak[0].cim.includes("helyen"), "rossz helyű szélsőérték → szelso (hely)");
  r = masol(p);
  r.szelsok["1"] = [{ x: 3, ertek: 12 }];
  ki = ellenoriz({ eredmeny: e, feladat: f, ...r });
  ok(kodok(ki).includes("szelso") && ki.hibak[0].cim.includes("értékkel"), "rossz értékű szélsőérték → szelso (érték)");
  const teny = alakTenyleges(f, r.rajz, r.alakok, r.szelsok);
  ok(teny["1"][0] === "U", "a szélsőérték-fogópont dönti el az alakot (∪)");
  // a tipp-görbe a szélsőértéken átmegy, a pontos görbe a polinom
  const tg = tippGorbe(f, p.rajz, p.alakok, p.szelsok, "M");
  const pg = pontosGorbe(f, "M");
  ok(kozel(tg["1"][0][10][1], 18, 1e-6) && kozel(pg["1"][0][10][1], 18, 1e-6), "tipp- és pontos görbe a közepén 18 kNm");
  const l = rajzLeptekek(f);
  ok(l.hatar.M >= 18 * 1.3 && l.hatar.M !== 18 && l.lepes.M === 0.5 && szepHatar(100) === 150, "lépték: kerek határ a maximum fölött, 0,5-ös lépés");
}
{
  const { e, f } = feladatok.keret;
  const p = pontosRajz(f);
  const r = masol(p);
  // a B sarok: az 1. rúd vége és a 2. rúd eleje — a 2. rúd elejét elrontjuk
  const iVeg = f.rudak[0].torespontok.length - 1;
  const helyes = f.rudak[0].torespontok[iVeg].M.bal;
  r.rajz.M["2"][0] = { bal: -helyes, jobb: -helyes };
  const ki = ellenoriz({ eredmeny: e, feladat: f, ...r });
  ok(kodok(ki).includes("sarok") && !kodok(ki).includes("elojel"), `rossz sarok-M → sarok (és nem külön elojel): ${kodok(ki).join(", ")}`);
  const cs = f.csomopontok.find((c) => c.id === "B");
  ok(cs.sarok && cs.sarok.length === 2 && !cs.szabadVeg, "B: merev sarok két rúddal");
  ok(f.rudak.every((rr) => rr.torespontok.every((pt) => pt.V.fogok.length >= 1)), "minden töréspontnak van fogópontja");
}
{
  const { f } = feladatok.ferde;
  const p = f.rudak[0].torespontok[1];
  ok(p.V.fogok.length === 2 && p.N.fogok.length === 2 && p.M.fogok.length === 1, "ferde rúdon a függőleges erő: V-nél és N-nél két fogópont, M-nél egy");
  ok(kozel(p.V.bal, 4) && kozel(p.V.jobb, -4) && kozel(p.N.bal, -3) && kozel(p.M.bal, 10), "ferde rúd értékei: V ±4, N −3, M 10");
}
{
  const { e, f } = feladatok.lkonzol;
  const p = pontosRajz(f);
  const ki = ellenoriz({ eredmeny: e, feladat: f, ...p, jelek: ["N", "V", "M"] });
  ok(ki.pont === 100, "L-konzol N, V, M pontos: 100");
  const ur = uresRajz(f);
  const ki0 = ellenoriz({ eredmeny: e, feladat: f, ...ur });
  ok(ki0.pont < 60 && ki0.hibak.length >= 3, `üres rajz: ${ki0.pont} pont, ${ki0.hibak.length} hiba`);
}

/* ------------------------------------------------------------ */
console.log(`\n${db} ellenőrzés, ${hibas} hibás.`);
if (hibas) process.exit(1);
