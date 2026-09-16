"use client";

import GyakorloDoboz from "@/components/GyakorloDoboz";
import GyakorloExtra, { egesz, valaszt, SzerkezetAbra, RacsAbra } from "./GyakorloExtra";
import { M, MB } from "@/components/ui/Keplet";
import { kinematika, racsKinematika, haromHatasvonal, KENYSZER_NEV, FOKSZAM } from "@/lib/hatarozottsag";

const FOK = Math.PI / 180;
const BETU = (j) => String.fromCharCode(65 + j);

/* ---------- véletlen gerenda / Gerber / keret (a generátorok közös alapja) ---------- */

function veletlenGerenda({ minTamasz = 2, maxTamasz = 4, csuklok = true } = {}) {
  const L = 8;
  const helyek = [0, 2, 4, 6, 8];
  const hx = csuklok && Math.random() < 0.45 ? valaszt([[4], [2], [6], [2, 6], [4, 6]]) : [];
  const oszto = [0, ...hx, L];
  const testek = oszto.slice(0, -1).map((x1, i) => ({ pontok: [[x1, 0], [oszto[i + 1], 0]] }));
  const testOf = (x) => hx.filter((h) => h < x).length;
  const db = egesz(minTamasz, maxTamasz);
  const valasztott = [...helyek].sort(() => Math.random() - 0.5).slice(0, db).sort((a, b) => a - b);
  const kenyszerek = valasztott.map((x) => {
    const t = valaszt(x === 0 || x === L ? ["gorgo", "gorgo", "csuklo", "csuklo", "befogas", "rud"] : ["gorgo", "gorgo", "csuklo", "rud"]);
    const test = testOf(x);
    if (t === "gorgo") return { tipus: "gorgo", test, x, y: 0, szog: Math.random() < 0.2 ? valaszt([60, 120]) : 90 };
    if (t === "rud") return { tipus: "rud", test, x, y: 0, irany: valaszt([[-1, -1], [1, -1]]) };
    if (t === "befogas") return { tipus: "befogas", test, x, y: 0, irany: x === 0 ? "bal" : "jobb" };
    return { tipus: "csuklo", test, x, y: 0 };
  });
  hx.forEach((x, i) => kenyszerek.push({ tipus: "belsoCsuklo", testek: [i, i + 1], x, y: 0 }));
  const terhek = [{ test: testOf(3), x: 3, y: 0, Fx: 0, Fy: -10, cimke: "F" }];
  return { testek, kenyszerek, terhek };
}

function veletlenKeret() {
  const ut = [
    [0, 0],
    [0, 4],
    [3, 4],
    [6, 4],
    [6, 0],
  ];
  const aktiv = [1, 2, 3].filter(() => Math.random() < 0.4);
  const testek = [];
  let akt = [ut[0]];
  for (let i = 1; i < ut.length; i++) {
    if (aktiv.includes(i)) {
      akt.push(ut[i]);
      testek.push({ pontok: akt });
      akt = [ut[i]];
    } else akt.push(ut[i]);
  }
  testek.push({ pontok: akt });
  const testOf = (s) => aktiv.filter((h) => h <= s).length;
  const kenyszerek = [];
  const kulso = (t, test, x, y) => {
    if (t === "gorgo") kenyszerek.push({ tipus: "gorgo", test, x, y, szog: 90 });
    else if (t === "csuklo") kenyszerek.push({ tipus: "csuklo", test, x, y });
    else kenyszerek.push({ tipus: "befogas", test, x, y, irany: "le" });
  };
  kulso(valaszt(["csuklo", "csuklo", "befogas", "gorgo"]), testOf(0), 0, 0);
  kulso(valaszt(["csuklo", "gorgo", "befogas"]), testOf(3), 6, 0);
  aktiv.forEach((i, k) => kenyszerek.push({ tipus: "belsoCsuklo", testek: [k, k + 1], x: ut[i][0], y: ut[i][1] }));
  return { testek, kenyszerek, terhek: [{ test: testOf(1), x: 1.5, y: 4, Fx: 0, Fy: -10, cimke: "F" }] };
}

const kulsoLista = (sz) => sz.kenyszerek.filter((k) => ["gorgo", "rud", "csuklo", "befogas"].includes(k.tipus));
const belsoCsuklok = (sz) => sz.kenyszerek.filter((k) => k.tipus === "belsoCsuklo").length;
const kenyszerNev = (k) => (k.tipus === "gorgo" && Math.abs(k.szog - 90) > 1 ? "ferde görgő" : KENYSZER_NEV[k.tipus]);

function felsorolas(sz) {
  const kulsok = kulsoLista(sz);
  return kulsok.map((k, j) => `${BETU(j)}: ${kenyszerNev(k)} (${FOKSZAM[k.tipus]})`).join(", ");
}

/* ============================================================
   1. Ismeretlenek és egyenletek száma
   ============================================================ */
function ismeretlenekFeladat() {
  const sz = Math.random() < 0.6 ? veletlenGerenda({ minTamasz: 2, maxTamasz: 4 }) : veletlenKeret();
  const it = kinematika(sz);
  const kulsok = kulsoLista(sz);
  const bcs = belsoCsuklok(sz);
  return {
    szoveg: (
      <p>
        Az ábrán látható szerkezet {sz.testek.length} merev testből áll{bcs ? `, ${bcs} belső csuklóval` : ""}. Külső kényszerek: {felsorolas(sz)}. Hány független egyensúlyi egyenlet írható fel (<M>{"e"}</M>), és hány ismeretlen reakció-komponens van (<M>{"i"}</M>)?
      </p>
    ),
    abra: <SzerkezetAbra sz={sz} />,
    sugo: <p>Testenként 3 egyenlet; görgő és rúd 1, csukló 2, befogás 3, belső csukló 2 ismeretlen (két test között).</p>,
    mezok: [
      { id: "e", cimke: "e (egyenletek)", egyseg: "", helyes: it.e, tizedes: 0 },
      { id: "i", cimke: "i (ismeretlenek)", egyseg: "", helyes: it.i, tizedes: 0 },
    ],
    megoldas: (
      <>
        <MB>{`e = 3\\cdot ${sz.testek.length} = ${it.e}`}</MB>
        <MB>{`i = ${kulsok.map((k) => FOKSZAM[k.tipus]).join(" + ")}${bcs ? ` + ${bcs}\\cdot 2` : ""} = ${it.i}`}</MB>
        <p className="mt-2 text-[13px] text-petrol-600">
          {it.e === it.i ? "e = i: lehet határozott — a geometriát ellenőrizni kell." : it.e < it.i ? `i − e = ${it.i - it.e}: legalább ennyiszeresen határozatlan.` : `e − i = ${it.e - it.i}: legalább ennyi szabad mozgás, biztosan nem tartó.`} A rangvizsgálat szerint:{" "}
          {it.tipus === "hatarozott" ? "határozott." : it.tipus === "hatarozatlan" ? `${it.folos}-szeresen határozatlan.` : it.kritikus ? "kritikus elrendezés (mozog, pedig a számlálás nem mutatja)." : "mechanizmus."}
        </p>
      </>
    ),
  };
}

/* ============================================================
   2. A határozatlanság foka
   ============================================================ */
function hatarozatlansagFeladat() {
  for (let p = 0; p < 200; p++) {
    const sz = Math.random() < 0.6 ? veletlenGerenda({ minTamasz: 3, maxTamasz: 4, csuklok: Math.random() < 0.4 }) : veletlenKeret();
    const it = kinematika(sz);
    if (it.tipus !== "hatarozatlan") continue;
    const kulsok = kulsoLista(sz);
    const bcs = belsoCsuklok(sz);
    return {
      szoveg: (
        <p>
          A szerkezet {sz.testek.length} testből áll{bcs ? `, ${bcs} belső csuklóval` : ""}; külső kényszerek: {felsorolas(sz)}. Semmilyen mozgása nincs. Hányszorosan statikailag határozatlan, és hány kényszert kell elvenni (felszabadítani), hogy statikailag határozott törzstartót kapjunk?
        </p>
      ),
      abra: <SzerkezetAbra sz={sz} />,
      sugo: <p>Ha mozgás nincs, a határozatlanság foka i − e; ugyanennyi fölös kényszert kell megszüntetni (görgő elvétele, csukló görgővé alakítása, befogás csuklóvá lazítása, belső csukló beiktatása).</p>,
      mezok: [
        { id: "fok", cimke: "határozatlanság foka", egyseg: "", helyes: it.folos, tizedes: 0 },
        { id: "el", cimke: "elveendő kényszerek száma", egyseg: "", helyes: it.folos, tizedes: 0 },
      ],
      megoldas: (
        <>
          <MB>{`e = 3\\cdot ${sz.testek.length} = ${it.e},\\qquad i = ${kulsok.map((k) => FOKSZAM[k.tipus]).join(" + ")}${bcs ? ` + ${bcs}\\cdot 2` : ""} = ${it.i}`}</MB>
          <MB>{`i - e = ${it.folos}\\quad\\Rightarrow\\quad ${it.folos}\\text{-szeresen határozatlan}`}</MB>
          <p className="mt-2 text-[13px] text-petrol-600">
            {it.folos} fölös kényszer: ennyit kell felszabadítani a törzstartóhoz — de úgy, hogy a maradék ne legyen kritikus (pl. ne maradjon három párhuzamos görgő, és a görgő hatásvonala ne menjen át a csuklón).
          </p>
        </>
      ),
    };
  }
  return hatarozatlansagFeladat();
}

/* ============================================================
   3. Szabad mozgások és fölös kényszerek (a tankönyv 7.7 szellemében)
   ============================================================ */
function mozgasokFeladat() {
  const L = 6;
  const mod = valaszt(["keves", "keves", "parhuzamos", "kozos", "fal"]);
  let kenyszerek = [];
  if (mod === "keves") {
    const db = egesz(1, 2);
    const helyek = [0, 3, 6].sort(() => Math.random() - 0.5).slice(0, db);
    kenyszerek = helyek.map((x) => {
      const t = valaszt(["gorgo", "gorgo", "csuklo", "rud"]);
      if (t === "gorgo") return { tipus: "gorgo", test: 0, x, y: 0, szog: Math.random() < 0.3 ? valaszt([60, 120]) : 90 };
      if (t === "rud") return { tipus: "rud", test: 0, x, y: 0, irany: valaszt([[-1, -1], [1, -1], [0, -1]]) };
      return { tipus: "csuklo", test: 0, x, y: 0 };
    });
  } else if (mod === "parhuzamos") {
    const n = valaszt([3, 4]);
    const helyek = n === 3 ? [0, 3, 6] : [0, 2, 4, 6];
    const szog = valaszt([90, 90, 60]);
    kenyszerek = helyek.map((x) => ({ tipus: "gorgo", test: 0, x, y: 0, szog }));
  } else if (mod === "kozos") {
    const Px = valaszt([1, 3, 5]);
    const Py = valaszt([-2, -3]);
    kenyszerek = [0, 3, 6].map((x) => ({ tipus: "rud", test: 0, x, y: 0, irany: [Px - x, Py] }));
  } else {
    // két vízszintes hatásvonalú görgő a két végen (7.7.c)
    kenyszerek = [
      { tipus: "gorgo", test: 0, x: 0, y: 0, szog: 0 },
      { tipus: "gorgo", test: 0, x: L, y: 0, szog: 180 },
    ];
  }
  const sz = { testek: [{ pontok: [[0, 0], [L, 0]] }], kenyszerek, terhek: [{ test: 0, x: 2, y: 0, Fx: 0, Fy: -10, cimke: "F" }] };
  const it = kinematika(sz);
  const kulsok = kulsoLista(sz);
  let geo = "";
  if ((mod === "parhuzamos" || mod === "kozos") && kulsok.length === 3) {
    const v = kulsok.map((k) => (k.tipus === "rud" ? { x: k.x, y: k.y, ex: k.irany[0], ey: k.irany[1] } : { x: k.x, y: k.y, ex: Math.cos(k.szog * FOK), ey: Math.sin(k.szog * FOK) }));
    geo = haromHatasvonal(v).indok;
  }
  return {
    szoveg: (
      <p>
        Egyetlen merev testet (gerendát) a következő kényszerek támasztanak: {felsorolas(sz)}. Hány szabad mozgása van a testnek (amit egyik kényszer sem gátol), és hány fölös kényszer van? (A tankönyv 7.5 és 7.7. ábrájának logikája: <M>{"e - i = "}</M> szabad mozgások − fölös kényszerek.)
      </p>
    ),
    abra: <SzerkezetAbra sz={sz} />,
    sugo: <p>Nézd meg, melyik eltolódást/elfordulást gátolja legalább egy kényszer. Párhuzamos hatásvonalak a rájuk merőleges eltolódást, egy ponton átmenők a pont körüli elfordulást nem gátolják — az ilyen kényszerek közül csak kettő „dolgozik”, a többi fölös.</p>,
    mezok: [
      { id: "sz", cimke: "szabad mozgások száma", egyseg: "", helyes: it.szabad, tizedes: 0 },
      { id: "f", cimke: "fölös kényszerek száma", egyseg: "", helyes: it.folos, tizedes: 0 },
    ],
    megoldas: (
      <>
        <MB>{`e = 3,\\qquad i = ${kulsok.map((k) => FOKSZAM[k.tipus]).join(" + ")} = ${it.i},\\qquad e - i = ${it.e - it.i} = ${it.szabad} - ${it.folos}`}</MB>
        <p className="mt-2 text-[13px] text-petrol-600">
          {geo ? `${geo.charAt(0).toUpperCase()}${geo.slice(1)}. ` : ""}
          {mod === "fal" ? "A két vízszintes reakció közös hatásvonalú: a függőleges eltolódást és a hatásvonal pontjai körüli elfordulást semmi nem gátolja (2 mozgás), a vízszintes irányban viszont két kényszer dolgozik egy helyett (1 fölös). " : ""}
          Rang = {it.rang}: a {it.i} kényszerből ennyi független; szabad mozgás = 3 − {it.rang} = {it.szabad}, fölös = {it.i} − {it.rang} = {it.folos}.{" "}
          {it.tipus === "hatarozott" ? "Statikailag határozott." : it.tipus === "hatarozatlan" ? "Határozatlan tartó." : it.tipus === "tulhatarozott" ? "Túlhatározott szerkezet (mechanizmus)." : "Határozatlan és túlhatározott szerkezet (kritikus elrendezés)."}
        </p>
      </>
    ),
  };
}

/* ============================================================
   4. Rácsos tartó: r + k = 2c
   ============================================================ */
function racsosFeladat() {
  const n = egesz(2, 4);
  const a = 2;
  const h = valaszt([1.5, 2]);
  const csomopontok = [];
  for (let i = 0; i <= n; i++) csomopontok.push({ id: `${i + 1}`, x: i * a, y: h });
  for (let i = 0; i <= n; i++) csomopontok.push({ id: `${n + 2 + i}`, x: i * a, y: 0 });
  const felso = (i) => `${i + 1}`;
  const also = (i) => `${n + 2 + i}`;
  const rudak = [];
  const rud = (p, q) => rudak.push({ id: `${p},${q}`, a: p, b: q });
  for (let i = 0; i < n; i++) {
    rud(felso(i), felso(i + 1));
    rud(also(i), also(i + 1));
  }
  for (let i = 0; i <= n; i++) if (Math.random() < 0.85) rud(felso(i), also(i));
  for (let i = 0; i < n; i++) {
    const m = valaszt([1, 1, 1, 0, 2]);
    if (m >= 1) rud(felso(i), also(i + 1));
    if (m === 2) rud(also(i), felso(i + 1));
  }
  const tamaszok = valaszt([
    [
      { csomopont: also(0), tipus: "csuklo" },
      { csomopont: also(n), tipus: "gorgo", szog: 90 },
    ],
    [
      { csomopont: also(0), tipus: "csuklo" },
      { csomopont: also(n), tipus: "csuklo" },
    ],
    [
      { csomopont: also(0), tipus: "gorgo", szog: 90 },
      { csomopont: also(n), tipus: "gorgo", szog: 90 },
    ],
  ]);
  const modell = { csomopontok, rudak, tamaszok };
  const it = racsKinematika(modell);
  const kod = it.i === it.e ? 0 : it.i > it.e ? 1 : 2;
  return {
    szoveg: (
      <p>
        Az ábrán látható rácsos tartón számold meg a csomópontokat (<M>{"c"}</M>), a rudakat (<M>{"r"}</M>) és a külső kényszerek fokszámát (<M>{"k"}</M>)! Mennyi <M>{"2c"}</M> és <M>{"r + k"}</M>? Add meg az elsődleges ítélet kódját: 0 = a számlálás szerint lehet határozott, 1 = biztosan
        határozatlan, 2 = biztosan mozog.
      </p>
    ),
    abra: <RacsAbra csomopontok={csomopontok} rudak={rudak} tamaszok={tamaszok} />,
    sugo: <p>Minden csomópont 2 egyenlet; minden rúd és minden kényszerfok 1 ismeretlen. A számlálás a szükséges feltétel — a rangvizsgálat a megoldásban.</p>,
    oszlopok: 3,
    mezok: [
      { id: "e", cimke: "2c", egyseg: "", helyes: it.e, tizedes: 0 },
      { id: "i", cimke: "r + k", egyseg: "", helyes: it.i, tizedes: 0 },
      { id: "kod", cimke: "ítélet-kód (0/1/2)", egyseg: "", helyes: kod, tizedes: 0, tures: 0.1 },
    ],
    megoldas: (
      <>
        <MB>{`c = ${it.c},\\ r = ${it.r},\\ k = ${it.k}:\\qquad 2c = ${it.e},\\qquad r + k = ${it.r} + ${it.k} = ${it.i}`}</MB>
        <p className="mt-2 text-[13px] text-petrol-600">
          {kod === 0 ? "2c = r + k: lehet határozott (kód 0)." : kod === 1 ? `r + k > 2c: legalább ${it.i - it.e} fölös rúd/kényszer, határozatlan (kód 1).` : `2c > r + k: legalább ${it.e - it.i} szabad mozgás, mechanizmus (kód 2).`} A rangvizsgálat:{" "}
          {it.tipus === "hatarozott" ? "határozott rácsos tartó." : it.tipus === "hatarozatlan" ? `${it.folos}-szeresen határozatlan.` : it.kritikus ? `kritikus — ${it.szabad} szabad mozgás és ${it.folos} fölös rúd egyszerre (pl. átló nélküli mező + fölös átló máshol, vagy két görgő).` : `mechanizmus, ${it.szabad} szabad mozgás.`}
        </p>
      </>
    ),
  };
}

/* ============================================================
   5. Hány kényszerfok kell még?
   ============================================================ */
function hianyzoFeladat() {
  for (let p = 0; p < 200; p++) {
    const sz = Math.random() < 0.7 ? veletlenGerenda({ minTamasz: 1, maxTamasz: 3, csuklok: Math.random() < 0.5 }) : veletlenKeret();
    const it = kinematika(sz);
    if (!(it.i < it.e)) continue;
    const kulsok = kulsoLista(sz);
    const bcs = belsoCsuklok(sz);
    return {
      szoveg: (
        <p>
          A szerkezet {sz.testek.length} testből áll{bcs ? `, ${bcs} belső csuklóval` : ""}; külső kényszerek: {felsorolas(sz)}. Legalább hány kényszerfokot kell még hozzáadni, hogy a határozottság szükséges feltétele teljesüljön? Hány szabad mozgása van most a szerkezetnek?
        </p>
      ),
      abra: <SzerkezetAbra sz={sz} />,
      sugo: <p>A hiányzó fokszám e − i. A szabad mozgások száma ennél több is lehet, ha a meglévő kényszerek egy része fölös (pl. két párhuzamos görgő csak egy irányt gátol).</p>,
      mezok: [
        { id: "h", cimke: "hiányzó kényszerfok (e − i)", egyseg: "", helyes: it.e - it.i, tizedes: 0 },
        { id: "m", cimke: "szabad mozgások száma", egyseg: "", helyes: it.szabad, tizedes: 0 },
      ],
      megoldas: (
        <>
          <MB>{`e = 3\\cdot ${sz.testek.length} = ${it.e},\\qquad i = ${kulsok.length ? kulsok.map((k) => FOKSZAM[k.tipus]).join(" + ") : "0"}${bcs ? ` + ${bcs}\\cdot 2` : ""} = ${it.i},\\qquad e - i = ${it.e - it.i}`}</MB>
          <p className="mt-2 text-[13px] text-petrol-600">
            Rang = {it.rang}, szabad mozgás = {it.e} − {it.rang} = {it.szabad}{it.folos ? `, és ${it.folos} kényszer fölös (kritikus részlet)` : ""}. Legalább {it.e - it.i} fokszám hiányzik — és a helye is számít: ne kerüljön párhuzamosan a meglévőkkel, ne menjen át a csuklón.
          </p>
        </>
      ),
    };
  }
  return hianyzoFeladat();
}

/* ============================================================
   6. Melyik támasz felesleges (vagy melyik nem vehető el)?
   ============================================================ */
function folosTamaszFeladat() {
  for (let p = 0; p < 400; p++) {
    const sz = veletlenGerenda({ minTamasz: 3, maxTamasz: 4, csuklok: Math.random() < 0.3 });
    const it = kinematika(sz);
    if (it.tipus !== "hatarozatlan" || it.folos !== 1) continue;
    const kulsok = kulsoLista(sz);
    const elveheto = kulsok.map((k) => {
      const uj = { ...sz, kenyszerek: sz.kenyszerek.filter((q) => q !== k) };
      return kinematika(uj).tipus === "hatarozott";
    });
    const igen = elveheto.filter(Boolean).length;
    const nem = elveheto.length - igen;
    let kerdes;
    let helyes;
    if (igen === 1) {
      kerdes = "elvehető";
      helyes = elveheto.indexOf(true) + 1;
    } else if (nem === 1) {
      kerdes = "nem vehető el";
      helyes = elveheto.indexOf(false) + 1;
    } else continue;
    return {
      szoveg: (
        <p>
          Az egyszeresen határozatlan gerendát a következő kényszerek támasztják: {felsorolas(sz)}. Pontosan egy támasz van, amelyik <strong>{kerdes}</strong> úgy, hogy {kerdes === "elvehető" ? "statikailag határozott tartó maradjon" : "a maradék határozott legyen — a többi elvéve a tartó mechanizmussá vagy kritikus elrendezéssé válik"}. Melyik az? (Add meg a sorszámát: A = 1, B = 2, C = 3, D = 4.)
        </p>
      ),
      abra: <SzerkezetAbra sz={sz} />,
      sugo: <p>Vedd el gondolatban egyenként a támaszokat, és nézd meg a maradékot: 3 = 3 marad-e, és nem lesz-e három párhuzamos vagy egy ponton átmenő hatásvonal, illetve csuklón átmenő görgő-hatásvonal.</p>,
      mezok: [{ id: "melyik", cimke: `a támasz sorszáma (${kerdes})`, egyseg: "", helyes, tizedes: 0, tures: 0.1 }],
      megoldas: (
        <>
          <ul className="list-disc space-y-1 pl-5 text-[13.5px]">
            {kulsok.map((k, j) => {
              const uj = { ...sz, kenyszerek: sz.kenyszerek.filter((q) => q !== k) };
              const r = kinematika(uj);
              return (
                <li key={j}>
                  <strong>{BETU(j)}</strong> ({kenyszerNev(k)}) elvéve: e = {r.e}, i = {r.i} — {r.tipus === "hatarozott" ? "határozott ✓" : r.tipus === "hatarozatlan" ? `még mindig határozatlan (${r.folos})` : r.kritikus ? "kritikus elrendezés, mozog ✗" : "mechanizmus ✗"}
                </li>
              );
            })}
          </ul>
          <p className="mt-2 text-[13px] text-petrol-600">
            A helyes válasz: <strong>{BETU(helyes - 1)}</strong> ({helyes}). A tankönyv ökölszabályai (7.4.2): párhuzamos vagy közös metszéspontú reakciókból legfeljebb kettőt tarts meg; ha egy kivételével minden ismeretlen párhuzamos, a kivételt ne vedd el.
          </p>
        </>
      ),
    };
  }
  return folosTamaszFeladat();
}

/* ---------- a szekció ---------- */

export const GENERATOROK = [
  { cim: "Ismeretlenek és egyenletek száma", fn: ismeretlenekFeladat },
  { cim: "A határozatlanság foka", fn: hatarozatlansagFeladat },
  { cim: "Szabad mozgások és fölös kényszerek", fn: mozgasokFeladat },
  { cim: "Rácsos tartó: r + k = 2c", fn: racsosFeladat },
  { cim: "Hány kényszerfok kell még?", fn: hianyzoFeladat },
  { cim: "Melyik támasz felesleges?", fn: folosTamaszFeladat },
];

export default function GyakorloSzekcio() {
  return (
    <>
      <GyakorloDoboz cim="Ismeretlenek és egyenletek száma" leiras="A tankönyv 7.3.1: testenként három egyenlet, kényszerenként a fokszám — belső csuklóval is." generator={ismeretlenekFeladat} />
      <GyakorloDoboz cim="A határozatlanság foka" leiras="i − e, ha mozgás nincs: hányszorosan határozatlan, hány kényszert kell felszabadítani a törzstartóhoz." generator={hatarozatlansagFeladat} />
      <GyakorloDoboz cim="Szabad mozgások és fölös kényszerek" leiras="A tankönyv 7.7. ábrájának gondolata: e − i csak a különbséget mutatja — kritikus elrendezésnél mindkettő lehet nulla fölött." generator={mozgasokFeladat} />
      <GyakorloDoboz cim="Rácsos tartó: r + k = 2c" leiras="Számold meg a csomópontokat, a rudakat és a kényszerfokokat egy véletlen rácson." generator={racsosFeladat} oszlopok={3} />
      <GyakorloDoboz cim="Hány kényszerfok kell még?" leiras="Alultámasztott szerkezet: hány fokszám hiányzik, és hány szabad mozgás van valójában." generator={hianyzoFeladat} />
      <GyakorloDoboz cim="Melyik támasz felesleges?" leiras="Egyszeresen határozatlan gerenda: melyik támasz vehető el (vagy melyik nem) úgy, hogy határozott tartó maradjon." generator={folosTamaszFeladat} oszlopok={1} />
      <div className="mt-10 mb-4 flex items-center gap-3">
        <span className="h-px flex-1 bg-petrol-200" />
        <span className="text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">További feladattípusok</span>
        <span className="h-px flex-1 bg-petrol-200" />
      </div>
      <GyakorloExtra />
    </>
  );
}
