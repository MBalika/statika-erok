"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import JatekKeret from "@/components/ui/JatekKeret";
import SzerkezetRajz, { Jelveny, SZINEK } from "./SzerkezetRajz";
import { useOsszecsuklas, iteletCim } from "./Merleg";
import { kinematika, haromHatasvonal, egyEgyenesen } from "@/lib/hatarozottsag";

/*
 * „Stabil vagy mozog?” — 5 kör, körönként két véletlen szerkezet. Mindegyikről el kell dönteni, időre:
 * határozott / határozatlan / mozog (túlhatározott, akár kritikus elrendezés). A választ a kinematikai
 * rangvizsgálat ellenőrzi; a kör végén a mechanizmusok összecsuklanak, a határozatlanok megfeszülnek.
 * Pont: ábránként 30 + 20·(maradék idő aránya), ha jó; a kör 0–100; a végén átlag.
 */

const OSSZ_KOR = 5;
const IDO = 25; // s / kör
const egesz = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
const valaszt = (t) => t[Math.floor(Math.random() * t.length)];
const FOK = Math.PI / 180;

const KATEGORIA = (tipus) => (tipus === "hatarozott" ? "hatarozott" : tipus === "hatarozatlan" ? "hatarozatlan" : "mozog");
const GOMBOK = [
  { id: "hatarozott", cim: "Határozott", szin: "bg-emerald-600 hover:bg-emerald-700" },
  { id: "hatarozatlan", cim: "Határozatlan", szin: "bg-violet-600 hover:bg-violet-700" },
  { id: "mozog", cim: "Mozog!", szin: "bg-rose-600 hover:bg-rose-700" },
];

/* ---------------- véletlen szerkezetek ---------------- */

function gerendaVeletlen() {
  const helyek = [0, 2, 4, 6, 8];
  const db = valaszt([2, 2, 3, 3, 4]);
  const valasztott = [...helyek].sort(() => Math.random() - 0.5).slice(0, db).sort((a, b) => a - b);
  const kenyszerek = valasztott.map((x) => {
    const t = valaszt(x === 0 || x === 8 ? ["gorgo", "gorgo", "csuklo", "befogas", "rud"] : ["gorgo", "gorgo", "csuklo", "rud"]);
    if (t === "gorgo") return { tipus: "gorgo", test: 0, x, y: 0, szog: Math.random() < 0.25 ? valaszt([60, 120]) : 90 };
    if (t === "rud") return { tipus: "rud", test: 0, x, y: 0, irany: valaszt([[-1, -1], [1, -1], [0, -1]]) };
    if (t === "befogas") return { tipus: "befogas", test: 0, x, y: 0, irany: x === 0 ? "bal" : "jobb" };
    return { tipus: "csuklo", test: 0, x, y: 0 };
  });
  const terhek = [{ test: 0, x: valaszt([1, 3, 5, 7]), y: 0, Fx: 0, Fy: -10 }];
  return { testek: [{ pontok: [[0, 0], [8, 0]] }], kenyszerek, terhek, nev: "gerenda" };
}

function haromRudVeletlen() {
  const P = [
    [0.5, 2],
    [3, 2],
    [5.5, 2],
  ];
  const mod = valaszt(["jo", "jo", "parhuzamos", "kozos"]);
  let szogek;
  if (mod === "parhuzamos") {
    const a = valaszt([0, 20, -25]);
    szogek = [a, a, a];
  } else if (mod === "kozos") {
    const Px = valaszt([1.5, 3, 4.5]);
    const Py = valaszt([-1, -2, 5, 6]);
    szogek = P.map(([x, y]) => {
      const ang = (Math.atan2(Px - x, -(Py - y)) * 180) / Math.PI; // a függőlegestől, lefelé mutatva
      return ang;
    });
  } else {
    for (let p = 0; p < 50; p++) {
      szogek = [egesz(-45, -10), egesz(-15, 15), egesz(10, 45)];
      const v = P.map(([x, y], k) => ({ x, y, ex: Math.sin(szogek[k] * FOK), ey: -Math.cos(szogek[k] * FOK) }));
      if (haromHatasvonal(v).mertek > 0.06) break;
    }
  }
  const kenyszerek = P.map(([x, y], k) => {
    let ex = Math.sin(szogek[k] * FOK);
    let ey = -Math.cos(szogek[k] * FOK);
    if (ey > 0) {
      ex = -ex;
      ey = -ey;
    }
    return { tipus: "rud", test: 0, x, y, irany: [ex, ey] };
  });
  return { testek: [{ pontok: [[0, 2], [6, 2]] }], kenyszerek, terhek: [{ test: 0, x: 4, y: 2, Fx: 0, Fy: -10 }], nev: "három rúd" };
}

function gerberVeletlen() {
  const tamHelyek = [0, 4, 8, 12];
  const tipusA = valaszt(["csuklo", "csuklo", "gorgo"]);
  const csuklok = valaszt([
    [6, 10],
    [2, 6],
    [2, 10],
    [6, 10],
    [5, 7],
    [1.5, 3],
    [9, 11],
    [6],
  ]);
  const oszto = [0, ...csuklok, 12];
  const testek = oszto.slice(0, -1).map((x1, i) => ({ pontok: [[x1, 0], [oszto[i + 1], 0]] }));
  const testOf = (x) => csuklok.filter((h) => h < x).length;
  const kenyszerek = tamHelyek.map((x) => (x === 0 ? { tipus: tipusA, test: 0, x, y: 0, szog: 90 } : { tipus: "gorgo", test: testOf(x), x, y: 0, szog: 90 }));
  csuklok.forEach((x, i) => kenyszerek.push({ tipus: "belsoCsuklo", testek: [i, i + 1], x, y: 0 }));
  if (Math.random() < 0.3) kenyszerek.splice(2, 1); // a C görgő néha hiányzik
  const terhek = [{ test: testOf(3), x: 3, y: 0, Fx: 0, Fy: -10 }];
  return { testek, kenyszerek, terhek, nev: "Gerber-tartó" };
}

function keretVeletlen() {
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
  const testOfSzakasz = (s) => aktiv.filter((h) => h <= s).length;
  const kenyszerek = [];
  const tA = valaszt(["csuklo", "csuklo", "befogas", "gorgo"]);
  const tB = valaszt(["csuklo", "gorgo", "gorgo", "befogas"]);
  const kulso = (t, test, x, y) => {
    if (t === "gorgo") kenyszerek.push({ tipus: "gorgo", test, x, y, szog: 90 });
    else if (t === "csuklo") kenyszerek.push({ tipus: "csuklo", test, x, y });
    else kenyszerek.push({ tipus: "befogas", test, x, y, irany: "le" });
  };
  kulso(tA, testOfSzakasz(0), 0, 0);
  kulso(tB, testOfSzakasz(3), 6, 0);
  if (Math.random() < 0.3) kenyszerek.push({ tipus: "gorgo", test: testOfSzakasz(0), x: 0, y: 4, szog: 0 });
  aktiv.forEach((i, k) => kenyszerek.push({ tipus: "belsoCsuklo", testek: [k, k + 1], x: ut[i][0], y: ut[i][1] }));
  const terhek = [{ test: testOfSzakasz(1), x: 1.5, y: 4, Fx: 0, Fy: -10 }];
  return { testek, kenyszerek, terhek, nev: "keret" };
}

function haromcsuklosVeletlen() {
  // háromcsuklós tartó: A(0,0), B(6,0) külső csukló, C(3, cy) belső csukló; cy = 0 → a három csukló egy egyenesbe esik
  const cy = valaszt([2.5, 2.5, 0, 0, -1.5]);
  let testek;
  if (cy === 0) testek = [{ pontok: [[0, 0], [3, 0]] }, { pontok: [[3, 0], [6, 0]] }];
  else if (cy < 0) testek = [{ pontok: [[0, 0], [1.5, -1.5], [3, -1.5]] }, { pontok: [[3, -1.5], [4.5, -1.5], [6, 0]] }];
  else testek = [{ pontok: [[0, 0], [0, 2.5], [3, 2.5]] }, { pontok: [[3, 2.5], [6, 2.5], [6, 0]] }];
  const kenyszerek = [
    { tipus: "csuklo", test: 0, x: 0, y: 0 },
    { tipus: "csuklo", test: 1, x: 6, y: 0 },
    { tipus: "belsoCsuklo", testek: [0, 1], x: 3, y: cy },
  ];
  const terhek = [{ test: 0, x: cy < 0 ? 2.2 : 1.5, y: cy, Fx: 0, Fy: -10 }];
  return { testek, kenyszerek, terhek, nev: "háromcsuklós" };
}

function ketOszlopVeletlen() {
  // két oszlop csuklóval, két összekötő rúd: párhuzamosak (kritikus) vagy ferde a második
  const ferde = Math.random() < 0.5;
  const testek = [{ pontok: [[0, 0], [0, 4]] }, { pontok: [[4, 0], [4, 4]] }];
  const kenyszerek = [
    { tipus: "csuklo", test: 0, x: 0, y: 0 },
    { tipus: "csuklo", test: 1, x: 4, y: 0 },
    { tipus: "belsoRud", testA: 0, xA: 0, yA: 4, testB: 1, xB: 4, yB: 4 },
    ferde ? { tipus: "belsoRud", testA: 0, xA: 0, yA: 1.2, testB: 1, xB: 4, yB: 3 } : { tipus: "belsoRud", testA: 0, xA: 0, yA: 2.4, testB: 1, xB: 4, yB: 2.4 },
  ];
  if (Math.random() < 0.3) kenyszerek[1] = { tipus: "befogas", test: 1, x: 4, y: 0, irany: "le" };
  return { testek, kenyszerek, terhek: [{ test: 0, x: 0, y: 4, Fx: 6, Fy: 0 }], nev: "két oszlop rudakkal" };
}

const GENERATOROK = [gerendaVeletlen, gerendaVeletlen, haromRudVeletlen, gerberVeletlen, keretVeletlen, haromcsuklosVeletlen, ketOszlopVeletlen];

function magyarazat(sz, it) {
  const reszek = [`e = ${it.e}, i = ${it.i}.`];
  if (it.tipus === "hatarozott") reszek.push("Teljes rang: minden mozgás gátolt, nincs fölös kényszer.");
  else if (it.tipus === "hatarozatlan") reszek.push(`${it.folos} fölös kényszer, mozgás nincs.`);
  else if (it.tipus === "tulhatarozott") reszek.push(`${it.szabad} szabad mozgás — kevés a kényszer.`);
  else {
    const egyfoku = sz.kenyszerek.filter((k) => k.tipus === "gorgo" || k.tipus === "rud");
    if (sz.testek.length === 1 && egyfoku.length === 3 && sz.kenyszerek.length === 3) {
      const v = egyfoku.map((k) => (k.tipus === "rud" ? { x: k.x, y: k.y, ex: k.irany[0], ey: k.irany[1] } : { x: k.x, y: k.y, ex: Math.cos((k.szog ?? 90) * FOK), ey: Math.sin((k.szog ?? 90) * FOK) }));
      reszek.push(`Kritikus: ${haromHatasvonal(v).indok}.`);
    } else {
      const cs = sz.kenyszerek.filter((k) => k.tipus === "csuklo" || k.tipus === "belsoCsuklo");
      let talalt = false;
      for (let a = 0; a < cs.length && !talalt; a++) for (let b = a + 1; b < cs.length && !talalt; b++) for (let c = b + 1; c < cs.length && !talalt; c++) if (egyEgyenesen(cs[a], cs[b], cs[c]).egyEgyenesen) talalt = true;
      let csuklonAt = false;
      if (!talalt)
        for (const k of egyfoku) {
          const ex = k.tipus === "rud" ? k.irany[0] : Math.cos((k.szog ?? 90) * FOK);
          const ey = k.tipus === "rud" ? k.irany[1] : Math.sin((k.szog ?? 90) * FOK);
          const h = Math.hypot(ex, ey) || 1;
          for (const c of cs) {
            const ugyanaz = c.tipus === "csuklo" ? c.test === k.test : c.testek.includes(k.test);
            if (ugyanaz && Math.abs((c.x - k.x) * ey - (c.y - k.y) * ex) / h < 1e-6) csuklonAt = true;
          }
        }
      reszek.push(talalt ? "Kritikus: három csukló egy egyenesbe esik." : csuklonAt ? "Kritikus: egy görgő (rúd) hatásvonala átmegy a testet tartó csuklón." : `Kritikus elrendezés: ${it.szabad} szabad mozgás és ${it.folos} fölös kényszer egyszerre.`);
    }
  }
  return reszek.join(" ");
}

function ujAbra(kerult) {
  for (let p = 0; p < 40; p++) {
    const sz = valaszt(GENERATOROK)();
    const it = kinematika(sz);
    const kat = KATEGORIA(it.tipus);
    if (kerult && kat === kerult && p < 30) continue;
    return { sz, it, kat, magyarazat: magyarazat(sz, it) };
  }
  const sz = gerendaVeletlen();
  const it = kinematika(sz);
  return { sz, it, kat: KATEGORIA(it.tipus), magyarazat: magyarazat(sz, it) };
}

function ujKor() {
  const a = ujAbra(null);
  const b = ujAbra(a.kat);
  return [a, b];
}

/* ---------------- egy ábra-kártya ---------------- */

function AbraKartya({ abra, valasz, felfedve, onValasz, sorszam }) {
  const mozog = felfedve && abra.it.szabad > 0;
  const s = useOsszecsuklas(mozog);
  const mozgas = abra.it.mozgasok[0] ?? null;
  const jo = valasz === abra.kat;
  const glow = felfedve ? (abra.it.tipus === "hatarozatlan" ? "piros" : abra.it.tipus === "hatarozott" ? "zold" : null) : null;
  const keret = !felfedve ? "border-[color:var(--keret)]" : jo ? "border-emerald-400 ring-2 ring-emerald-200" : "border-rose-400 ring-2 ring-rose-200";
  return (
    <div className={`min-w-0 rounded-xl border bg-white p-2 transition ${keret} ${felfedve && !jo ? "animate-[wiggle_0.5s_ease-in-out]" : ""}`}>
      <div className="racs-vilagos overflow-hidden rounded-lg">
        <SzerkezetRajz
          szerkezet={abra.sz}
          mozgas={mozgas}
          s={s}
          amplitudo={0.6}
          szelesseg={600}
          magassag={270}
          margo={{ bal: 60, jobb: 60, fel: 52, le: 62 }}
          glow={glow}
          tamaszMeret={13}
          extra={() =>
            felfedve ? (
              <Jelveny x={300} y={20} szoveg={`${jo ? "✓" : "✗"} ${iteletCim(abra.it)}`} szin={jo ? SZINEK.zold : SZINEK.bordo} w={Math.max(180, 8.4 * (iteletCim(abra.it).length + 2))} />
            ) : (
              <text x={16} y={22} fontSize="12" fontWeight="700" style={{ fill: "#64748b" }}>
                {sorszam}. ábra · {abra.sz.nev}
              </text>
            )
          }
        />
      </div>
      <div className="mt-2 grid grid-cols-3 gap-1.5">
        {GOMBOK.map((g) => {
          const kivalasztva = valasz === g.id;
          const helyes = felfedve && abra.kat === g.id;
          return (
            <button
              key={g.id}
              type="button"
              disabled={felfedve || valasz != null}
              onClick={() => onValasz(g.id)}
              className={`rounded-lg px-2 py-1.5 text-[12px] font-semibold text-white transition disabled:cursor-default ${g.szin} ${kivalasztva ? "ring-2 ring-offset-1 ring-petrol-800" : ""} ${felfedve && !helyes && !kivalasztva ? "opacity-35" : ""} ${helyes ? "ring-2 ring-offset-1 ring-emerald-500" : ""}`}
            >
              {g.cim}
            </button>
          );
        })}
      </div>
      {felfedve && <p className="szamok mt-2 text-[12px] leading-snug text-petrol-600">{abra.magyarazat}</p>}
    </div>
  );
}

/* ---------------- a játék ---------------- */

export default function JatekStabil() {
  const [kor, setKor] = useState(1);
  const [abrak, setAbrak] = useState(null);
  const [valaszok, setValaszok] = useState([null, null]);
  const [felfedve, setFelfedve] = useState(false);
  const [pontok, setPontok] = useState([]);
  const [kesz, setKesz] = useState(false);
  const [ido, setIdo] = useState(IDO);
  const idoRef = useRef(IDO);
  const valaszIdo = useRef([null, null]);

  useEffect(() => {
    setAbrak(ujKor());
  }, []);

  // időzítő
  useEffect(() => {
    if (!abrak || felfedve || kesz) return undefined;
    idoRef.current = IDO;
    setIdo(IDO);
    const kezdet = performance.now();
    const t = setInterval(() => {
      const maradt = Math.max(0, IDO - (performance.now() - kezdet) / 1000);
      idoRef.current = maradt;
      setIdo(maradt);
      if (maradt <= 0) {
        clearInterval(t);
        setFelfedve(true);
      }
    }, 100);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abrak, felfedve, kesz]);

  // pontozás a felfedéskor
  useEffect(() => {
    if (!felfedve || !abrak) return;
    let p = 0;
    abrak.forEach((a, i) => {
      if (valaszok[i] === a.kat) {
        const arany = (valaszIdo.current[i] ?? 0) / IDO;
        p += 30 + 20 * arany;
      }
    });
    setPontok((l) => [...l, Math.round(p)]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [felfedve]);

  const valaszol = (i, v) => {
    if (felfedve) return;
    const uj = [...valaszok];
    uj[i] = v;
    valaszIdo.current[i] = idoRef.current;
    setValaszok(uj);
    if (uj.every((x) => x != null)) setFelfedve(true);
  };

  const kovetkezo = () => {
    if (kor >= OSSZ_KOR) {
      setKesz(true);
      return;
    }
    setKor(kor + 1);
    setAbrak(ujKor());
    setValaszok([null, null]);
    valaszIdo.current = [null, null];
    setFelfedve(false);
  };

  const ujJatek = useCallback(() => {
    setKor(1);
    setPontok([]);
    setValaszok([null, null]);
    valaszIdo.current = [null, null];
    setFelfedve(false);
    setKesz(false);
    setAbrak(ujKor());
  }, []);

  const atlag = pontok.length ? pontok.reduce((s, p) => s + p, 0) / pontok.length : 0;
  const utolso = pontok[pontok.length - 1];

  const uzenet = useMemo(() => {
    if (!abrak) return null;
    if (!felfedve)
      return (
        <>
          Döntsd el mindkét ábráról: <strong>határozott</strong> tartó, <strong>határozatlan</strong> tartó, vagy <strong>mozog</strong> (mechanizmus — akár kritikus elrendezés miatt)? Figyeld a támaszok <em>elrendezését</em> is, ne csak számolj!
        </>
      );
    const jok = abrak.filter((a, i) => valaszok[i] === a.kat).length;
    return (
      <>
        {jok === 2 ? "Mindkettő talált! " : jok === 1 ? "Egy talált, egy nem. " : ido <= 0 && valaszok.every((v) => v == null) ? "Lejárt az idő. " : "Egyik sem talált. "}
        <span className="szamok">{utolso} pont</span> ebben a körben. A mechanizmusok összecsuklanak, a határozatlanok pirosan megfeszülnek — az ábrák alatt a számlálás és az indoklás.
      </>
    );
  }, [abrak, felfedve, valaszok, utolso, ido]);

  return (
    <JatekKeret cim="Stabil vagy mozog?" leiras="Öt kör, körönként két véletlen szerkezet: gerendák, keretek, Gerber-tartók, három rúd, egy egyenesbe eső csuklók. Időre, a kritikus elrendezésekkel együtt." pont={atlag} kor={kor} osszKor={OSSZ_KOR} kesz={kesz} onUj={ujJatek} uzenet={uzenet}>
      <style>{`@keyframes wiggle { 0%,100% { transform: translateX(0) } 25% { transform: translateX(-5px) } 75% { transform: translateX(5px) } }`}</style>
      <div className="mb-3 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-petrol-100">
          <div className="h-full rounded-full transition-[width] duration-100" style={{ width: `${(100 * ido) / IDO}%`, background: ido > 8 ? "#0e7490" : "#be123c" }} />
        </div>
        <span className="szamok w-12 text-right text-[12px] font-semibold text-petrol-600">{Math.ceil(ido)} s</span>
      </div>
      {abrak && (
        <div className="grid gap-3 md:grid-cols-2">
          {abrak.map((a, i) => (
            <AbraKartya key={`${kor}-${i}`} abra={a} sorszam={i + 1} valasz={valaszok[i]} felfedve={felfedve} onValasz={(v) => valaszol(i, v)} />
          ))}
        </div>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {felfedve && !kesz && (
          <button type="button" onClick={kovetkezo} className="rounded-lg bg-petrol-800 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-petrol-900">
            {kor >= OSSZ_KOR ? "Eredmény" : "Következő kör →"}
          </button>
        )}
        {pontok.length > 0 && <span className="szamok text-[12px] text-petrol-500">eddigi körök: {pontok.join(" · ")}</span>}
      </div>
    </JatekKeret>
  );
}
