"use client";

import { useMemo, useState } from "react";
import SzerkezetRajz, { Jelveny, SZINEK } from "./SzerkezetRajz";
import Merleg, { useOsszecsuklas, iteletCim } from "./Merleg";
import { kinematika, tartoModell, haromHatasvonal, egyEgyenesen, FOKSZAM, KENYSZER_NEV } from "@/lib/hatarozottsag";
import { elemez } from "@/lib/tarto";
import { sz } from "@/lib/szamok";

/*
 * Szerkezet-építő: gerendára vagy keretre kattintással rakunk támaszokat (görgő → csukló → befogás → rúd → üres)
 * és belső csuklókat. Élő számláló (e, i), a kinematikai rangvizsgálat dönt:
 *   mechanizmus → összecsuklás-animáció a nulltér-vektor irányába,
 *   határozatlan → piros „megfeszülés”, n-szeresen,
 *   határozott → zöld pipa és a próbateher reakciói a számítómagból (src/lib/tarto).
 */

const CIKLUS_VEG = [null, "gorgo", "csuklo", "befogas", "rud"];
const CIKLUS_KOZEP = [null, "gorgo", "csuklo", "rud"];

const GERENDA = {
  L: 8,
  helyek: [0, 2, 4, 6, 8],
  csuklok: [2, 4, 6],
  terhek: [
    { x: 3, Fx: 0, Fy: -10 },
    { x: 5, Fx: 4, Fy: 0 },
  ],
  eloreAllitott: [
    { nev: "Kéttámaszú", tamaszok: { 0: "csuklo", 8: "gorgo" }, csuklok: [] },
    { nev: "Konzol", tamaszok: { 0: "befogas" }, csuklok: [] },
    { nev: "Három párhuzamos görgő", tamaszok: { 0: "gorgo", 4: "gorgo", 8: "gorgo" }, csuklok: [] },
    { nev: "Ferde rúd + két görgő", tamaszok: { 0: "rud", 4: "gorgo", 8: "gorgo" }, csuklok: [] },
    { nev: "Háromtámaszú", tamaszok: { 0: "csuklo", 4: "gorgo", 8: "gorgo" }, csuklok: [] },
    { nev: "Gerber-tartó", tamaszok: { 0: "csuklo", 4: "gorgo", 8: "gorgo" }, csuklok: [6] },
    { nev: "Rossz Gerber (két csukló egy mezőben)", tamaszok: { 0: "csuklo", 4: "gorgo", 6: "gorgo", 8: "gorgo" }, csuklok: [2, 4] },
    { nev: "Befogás + görgő", tamaszok: { 0: "befogas", 8: "gorgo" }, csuklok: [] },
  ],
};

const KERET = {
  ut: [
    [0, 0],
    [0, 4],
    [3, 4],
    [6, 4],
    [6, 0],
  ], // A, C, M, D, B
  csuklok: [1, 2, 3], // C, M, D
  terhek: [
    { szakasz: 1, x: 1.5, y: 4, Fx: 0, Fy: -10 },
    { szakasz: 0, x: 0, y: 4, Fx: 5, Fy: 0 },
  ],
  eloreAllitott: [
    { nev: "Háromcsuklós keret", tamaszok: { A: "csuklo", B: "csuklo" }, csuklok: [2] },
    { nev: "Kétcsuklós keret", tamaszok: { A: "csuklo", B: "csuklo" }, csuklok: [] },
    { nev: "Befogott keret", tamaszok: { A: "befogas", B: "befogas" }, csuklok: [] },
    { nev: "Csukló + görgő, két sarokcsukló (mozog)", tamaszok: { A: "csuklo", B: "gorgo" }, csuklok: [1, 3] },
    { nev: "Négy csukló (mechanizmus)", tamaszok: { A: "csuklo", B: "csuklo" }, csuklok: [1, 3] },
    { nev: "Falgörgő + csukló a gerenda közepén", tamaszok: { A: "csuklo", B: "gorgo", C: "gorgoFal" }, csuklok: [2] },
    { nev: "Görgő a sarokcsukló alatt (kritikus)", tamaszok: { A: "csuklo", B: "gorgo", C: "gorgoFal" }, csuklok: [3] },
  ],
};

/** A gerenda állapotából rajzolható szerkezet. */
function gerendaSzerkezet(tamaszok, csuklok) {
  const hx = GERENDA.csuklok.filter((x) => csuklok.includes(x)).sort((a, b) => a - b);
  const oszto = [0, ...hx, GERENDA.L];
  const testek = oszto.slice(0, -1).map((x1, i) => ({ pontok: [[x1, 0], [oszto[i + 1], 0]] }));
  const testOf = (x) => hx.filter((h) => h < x).length;
  const kenyszerek = [];
  for (const x of GERENDA.helyek) {
    const t = tamaszok[x];
    if (!t) continue;
    const test = testOf(x);
    if (t === "gorgo") kenyszerek.push({ tipus: "gorgo", test, x, y: 0, szog: 90 });
    else if (t === "csuklo") kenyszerek.push({ tipus: "csuklo", test, x, y: 0 });
    else if (t === "befogas") kenyszerek.push({ tipus: "befogas", test, x, y: 0, irany: x === 0 ? "bal" : "jobb" });
    else if (t === "rud") kenyszerek.push({ tipus: "rud", test, x, y: 0, irany: [-1, -1] });
  }
  hx.forEach((x, i) => kenyszerek.push({ tipus: "belsoCsuklo", testek: [i, i + 1], x, y: 0 }));
  const terhek = GERENDA.terhek.map((t) => ({ ...t, y: 0, test: testOf(t.x) }));
  return { testek, kenyszerek, terhek };
}

/** A keret állapotából rajzolható szerkezet. */
function keretSzerkezet(tamaszok, csuklok) {
  const ut = KERET.ut;
  const aktiv = KERET.csuklok.filter((i) => csuklok.includes(i)).sort((a, b) => a - b);
  const testOfSzakasz = (s) => aktiv.filter((h) => h <= s).length;
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
  const kenyszerek = [];
  const [ax, ay] = ut[0];
  const [bx, by] = ut[4];
  const kulso = (t, test, x, y, oldal) => {
    if (t === "gorgo") kenyszerek.push({ tipus: "gorgo", test, x, y, szog: 90 });
    else if (t === "csuklo") kenyszerek.push({ tipus: "csuklo", test, x, y });
    else if (t === "befogas") kenyszerek.push({ tipus: "befogas", test, x, y, irany: "le" });
    else if (t === "rud") kenyszerek.push({ tipus: "rud", test, x, y, irany: [oldal, -1] });
    else if (t === "gorgoFal") kenyszerek.push({ tipus: "gorgo", test, x, y, szog: 0 });
  };
  kulso(tamaszok.A, testOfSzakasz(0), ax, ay, -1);
  kulso(tamaszok.B, testOfSzakasz(3), bx, by, 1);
  if (tamaszok.C) kulso(tamaszok.C, testOfSzakasz(0), ut[1][0], ut[1][1], 0);
  aktiv.forEach((i, k) => kenyszerek.push({ tipus: "belsoCsuklo", testek: [k, k + 1], x: ut[i][0], y: ut[i][1] }));
  const terhek = KERET.terhek.map((t) => ({ x: t.x, y: t.y, Fx: t.Fx, Fy: t.Fy, test: testOfSzakasz(t.szakasz) }));
  return { testek, kenyszerek, terhek };
}

/** Szöveges indoklás kritikus elrendezéshez (ha felismerhető). */
function kritikusIndok(szerkezet, itelet) {
  if (!itelet.kritikus) return null;
  const egyfoku = szerkezet.kenyszerek.filter((k) => k.tipus === "gorgo" || k.tipus === "rud");
  if (szerkezet.testek.length === 1 && egyfoku.length === 3 && szerkezet.kenyszerek.length === 3) {
    const vonalak = egyfoku.map((k) => {
      if (k.tipus === "rud") return { x: k.x, y: k.y, ex: k.irany[0], ey: k.irany[1] };
      const sz = ((k.szog ?? 90) * Math.PI) / 180;
      return { x: k.x, y: k.y, ex: Math.cos(sz), ey: Math.sin(sz) };
    });
    const h = haromHatasvonal(vonalak);
    return `Kritikus elrendezés: ${h.indok}.`;
  }
  const csuklok = szerkezet.kenyszerek.filter((k) => k.tipus === "csuklo" || k.tipus === "belsoCsuklo");
  if (csuklok.length >= 3) {
    for (let a = 0; a < csuklok.length; a++)
      for (let b = a + 1; b < csuklok.length; b++)
        for (let c = b + 1; c < csuklok.length; c++) {
          if (egyEgyenesen(csuklok[a], csuklok[b], csuklok[c]).egyEgyenesen) return "Kritikus elrendezés: három csukló egy egyenesbe esik — a rá merőleges terhet a szerkezet ebben a helyzetében nem tudja megtartani.";
        }
  }
  // görgő vagy rúd, amelynek hatásvonala átmegy ugyanannak a testnek egy csuklóján
  for (const k of egyfoku) {
    const sz0 = k.tipus === "rud" ? null : ((k.szog ?? 90) * Math.PI) / 180;
    const ex = k.tipus === "rud" ? k.irany[0] : Math.cos(sz0);
    const ey = k.tipus === "rud" ? k.irany[1] : Math.sin(sz0);
    const h = Math.hypot(ex, ey) || 1;
    for (const c of csuklok) {
      const ugyanaz = c.tipus === "csuklo" ? c.test === k.test : c.testek.includes(k.test);
      if (!ugyanaz) continue;
      const tav = Math.abs((c.x - k.x) * ey - (c.y - k.y) * ex) / h;
      if (tav < 1e-6) return "Kritikus elrendezés: egy görgő (rúd) hatásvonala átmegy a testet tartó csuklón — a test e csukló körül elfordulhat, miközben a csukló egyik iránya fölös.";
    }
  }
  return "Kritikus elrendezés: a számlálás rendben, de a kényszerek úgy állnak, hogy egy mozgást egyik sem gátol, miközben egy másik irányban fölös kényszer van.";
}

export default function SzerkezetEpito({ kezdoMod = "gerenda" }) {
  const [mod, setMod] = useState(kezdoMod);
  const [gTamasz, setGTamasz] = useState({ 0: "csuklo", 8: "gorgo" });
  const [gCsuklo, setGCsuklo] = useState([]);
  const [kTamasz, setKTamasz] = useState({ A: "csuklo", B: "csuklo" });
  const [kCsuklo, setKCsuklo] = useState([2]);

  const szerkezet = useMemo(() => (mod === "gerenda" ? gerendaSzerkezet(gTamasz, gCsuklo) : keretSzerkezet(kTamasz, kCsuklo)), [mod, gTamasz, gCsuklo, kTamasz, kCsuklo]);
  const itelet = useMemo(() => kinematika(szerkezet), [szerkezet]);
  const mozog = itelet.szabad > 0;
  const s = useOsszecsuklas(mozog);
  const mozgas = useMemo(() => {
    if (!itelet.mozgasok.length) return null;
    // a próbateher irányába „billenő” mozgás: az összes bázisvektor összege, előjelezve a teher munkája szerint
    const N = itelet.mozgasok[0].length;
    const v = new Array(N).fill(0);
    for (const b of itelet.mozgasok) {
      let munka = 0;
      for (const t of szerkezet.terhek) {
        const ux = b[3 * t.test] - b[3 * t.test + 2] * t.y;
        const uy = b[3 * t.test + 1] + b[3 * t.test + 2] * t.x;
        munka += ux * t.Fx + uy * t.Fy;
      }
      const jel = munka < -1e-9 ? -1 : 1;
      for (let j = 0; j < N; j++) v[j] += jel * b[j];
    }
    return v;
  }, [itelet, szerkezet]);

  const megoldas = useMemo(() => {
    if (mozog) return null;
    try {
      return elemez(tartoModell(szerkezet));
    } catch {
      return null;
    }
  }, [szerkezet, mozog]);

  const kulsok = szerkezet.kenyszerek.filter((k) => ["gorgo", "rud", "csuklo", "befogas"].includes(k.tipus));
  const iReszek = kulsok.map((k) => ({ cimke: k.tipus === "gorgo" && Math.abs(Math.cos(((k.szog ?? 90) * Math.PI) / 180)) > 0.7 ? "falgörgő" : KENYSZER_NEV[k.tipus], db: FOKSZAM[k.tipus] }));
  const belsoDb = szerkezet.kenyszerek.filter((k) => k.tipus === "belsoCsuklo").length;
  if (belsoDb) iReszek.push({ cimke: `${belsoDb} belső csukló`, db: 2 * belsoDb });

  // ---- kattintások ----
  const gerendaKattint = (i) => {
    const k = szerkezet.kenyszerek[i];
    if (!k || k.tipus === "belsoCsuklo") return;
    const x = k.x;
    const ciklus = x === 0 || x === GERENDA.L ? CIKLUS_VEG : CIKLUS_KOZEP;
    const idx = ciklus.indexOf(gTamasz[x] ?? null);
    const uj = ciklus[(idx + 1) % ciklus.length];
    setGTamasz((t) => {
      const n = { ...t };
      if (uj) n[x] = uj;
      else delete n[x];
      return n;
    });
  };
  const gerendaUres = (x) => {
    const ciklus = x === 0 || x === GERENDA.L ? CIKLUS_VEG : CIKLUS_KOZEP;
    setGTamasz((t) => ({ ...t, [x]: ciklus[1] }));
  };
  const gerendaCsuklo = (x) => setGCsuklo((c) => (c.includes(x) ? c.filter((v) => v !== x) : [...c, x]));

  const keretKattint = (betu) => {
    const ciklus = betu === "C" ? [null, "gorgoFal"] : CIKLUS_VEG;
    const idx = ciklus.indexOf(kTamasz[betu] ?? null);
    const uj = ciklus[(idx + 1) % ciklus.length];
    setKTamasz((t) => {
      const n = { ...t };
      if (uj) n[betu] = uj;
      else delete n[betu];
      return n;
    });
  };
  const keretCsuklo = (i) => setKCsuklo((c) => (c.includes(i) ? c.filter((v) => v !== i) : [...c, i]));

  const eloreAllitott = mod === "gerenda" ? GERENDA.eloreAllitott : KERET.eloreAllitott;
  const beallit = (p) => {
    if (mod === "gerenda") {
      setGTamasz({ ...p.tamaszok });
      setGCsuklo([...p.csuklok]);
    } else {
      setKTamasz({ ...p.tamaszok });
      setKCsuklo([...p.csuklok]);
    }
  };

  const glow = itelet.tipus === "hatarozatlan" ? "piros" : itelet.tipus === "hatarozott" ? "zold" : null;
  const indok = kritikusIndok(szerkezet, itelet);

  // ---- a rajz „üres helyei” (kattintható helyőrzők) ----
  const extra = (kx, ky, lp, helyzet) => {
    const el = [];
    if (mod === "gerenda") {
      for (const x of GERENDA.helyek) {
        if (gTamasz[x]) continue;
        el.push(
          <g key={`u${x}`} onClick={() => gerendaUres(x)} style={{ cursor: "pointer" }}>
            <circle cx={kx(x)} cy={ky(0) + 14} r="18" fill="transparent" />
            <path d={`M ${kx(x)} ${ky(0) + 4} L ${kx(x) - 11} ${ky(0) + 22} L ${kx(x) + 11} ${ky(0) + 22} Z`} fill="white" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="3 2" />
            <text x={kx(x)} y={ky(0) + 36} textAnchor="middle" fontSize="10" style={{ fill: "#94a3b8" }}>
              + támasz
            </text>
          </g>,
        );
      }
      for (const x of GERENDA.csuklok) {
        if (gCsuklo.includes(x)) continue;
        el.push(
          <g key={`c${x}`} onClick={() => gerendaCsuklo(x)} style={{ cursor: "pointer" }}>
            <circle cx={kx(x)} cy={ky(0)} r="14" fill="transparent" />
            <circle cx={kx(x)} cy={ky(0)} r="5" fill="none" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="2 2" />
          </g>,
        );
      }
      el.push(
        <g key="meret">
          {GERENDA.helyek.slice(0, -1).map((x) => (
            <text key={x} x={(kx(x) + kx(x + 2)) / 2} y={ky(0) + 62} textAnchor="middle" fontSize="11" fontStyle="italic" style={{ fill: "#64748b" }}>
              2 m
            </text>
          ))}
        </g>,
      );
    } else {
      const ut = KERET.ut;
      const helyek = [
        ["A", ut[0]],
        ["B", ut[4]],
        ["C", ut[1]],
      ];
      for (const [betu, [x, y]] of helyek) {
        if (kTamasz[betu]) continue;
        const X = kx(x);
        const Y = ky(y);
        el.push(
          <g key={`u${betu}`} onClick={() => keretKattint(betu)} style={{ cursor: "pointer" }}>
            {betu === "C" ? (
              <>
                <circle cx={X - 14} cy={Y} r="16" fill="transparent" />
                <path d={`M ${X - 4} ${Y} L ${X - 22} ${Y - 11} L ${X - 22} ${Y + 11} Z`} fill="white" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="3 2" />
                <text x={X - 26} y={Y + 4} textAnchor="end" fontSize="10" style={{ fill: "#94a3b8" }}>
                  + falgörgő
                </text>
              </>
            ) : (
              <>
                <circle cx={X} cy={Y + 14} r="18" fill="transparent" />
                <path d={`M ${X} ${Y + 4} L ${X - 11} ${Y + 22} L ${X + 11} ${Y + 22} Z`} fill="white" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="3 2" />
                <text x={X} y={Y + 36} textAnchor="middle" fontSize="10" style={{ fill: "#94a3b8" }}>
                  + támasz
                </text>
              </>
            )}
          </g>,
        );
      }
      for (const i of KERET.csuklok) {
        if (kCsuklo.includes(i)) continue;
        const [x, y] = ut[i];
        el.push(
          <g key={`c${i}`} onClick={() => keretCsuklo(i)} style={{ cursor: "pointer" }}>
            <circle cx={kx(x)} cy={ky(y)} r="14" fill="transparent" />
            <circle cx={kx(x)} cy={ky(y)} r="5" fill="none" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="2 2" />
          </g>,
        );
      }
      el.push(
        <g key="meret">
          <text x={(kx(0) + kx(6)) / 2} y={ky(0) + 62} textAnchor="middle" fontSize="11" fontStyle="italic" style={{ fill: "#64748b" }}>
            6 m
          </text>
          <text x={kx(6) + 30} y={(ky(0) + ky(4)) / 2} textAnchor="middle" fontSize="11" fontStyle="italic" style={{ fill: "#64748b" }}>
            4 m
          </text>
        </g>,
      );
    }
    // ítélet-jelvény
    const szin = itelet.tipus === "hatarozott" ? SZINEK.zold : itelet.tipus === "hatarozatlan" ? SZINEK.lila : SZINEK.bordo;
    const szoveg = itelet.tipus === "hatarozott" ? "✓ határozott tartó" : itelet.tipus === "hatarozatlan" ? `${itelet.folos}-szeresen határozatlan` : itelet.kritikus ? "kritikus elrendezés — mozog!" : "mechanizmus — mozog!";
    el.push(<Jelveny key="j" x={300} y={22} szoveg={szoveg} szin={szin} w={Math.max(150, 9 * szoveg.length)} />);
    return el;
  };

  const betuk = kulsok.map((k) => (mod === "keret" ? (k.x === 0 && k.y === 0 ? "A" : k.x === 6 && k.y === 0 ? "B" : "C") : undefined));
  const cimkek = mod === "keret" ? betuk : undefined;

  const kenyszerKattint = (i) => {
    if (mod === "gerenda") gerendaKattint(i);
    else {
      const k = szerkezet.kenyszerek[i];
      if (!k || !["gorgo", "rud", "csuklo", "befogas"].includes(k.tipus)) return;
      keretKattint(k.x === 0 && k.y === 0 ? "A" : k.x === 6 && k.y === 0 ? "B" : "C");
    }
  };
  const csukloKattint = (i) => {
    const k = szerkezet.kenyszerek[i];
    if (mod === "gerenda") gerendaCsuklo(k.x);
    else keretCsuklo(KERET.ut.findIndex(([x, y]) => x === k.x && y === k.y));
  };

  return (
    <div className="rounded-2xl border border-[color:var(--keret)] bg-white p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {["gerenda", "keret"].map((m) => (
          <button key={m} type="button" onClick={() => setMod(m)} className={`rounded-lg px-3 py-1.5 text-[12.5px] font-semibold transition ${mod === m ? "bg-petrol-800 text-white" : "bg-petrol-50 text-petrol-700 ring-1 ring-petrol-200 hover:bg-petrol-100"}`}>
            {m === "gerenda" ? "Gerenda" : "Keret"}
          </button>
        ))}
        <span className="ml-auto text-[11.5px] text-petrol-500">próbateher: 10 kN lefelé + {mod === "gerenda" ? 4 : 5} kN vízszintesen</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="min-w-0">
          <div className="racs-vilagos overflow-hidden rounded-xl border border-[color:var(--keret)]">
            <SzerkezetRajz szerkezet={szerkezet} mozgas={mozgas} s={s} amplitudo={0.7} szelesseg={600} magassag={350} margo={{ bal: 80, jobb: 70, fel: 100, le: 84 }} reakciok={megoldas?.ok ? megoldas.reakciok : null} cimkek={cimkek} onKenyszer={kenyszerKattint} onCsuklo={csukloKattint} glow={glow} extra={extra} />
          </div>
          <p className="mt-2 text-[12px] text-petrol-500">
            Kattints egy <strong>támaszra</strong> a váltáshoz (görgő → csukló → befogás → rúd → üres) és a szaggatott <strong>körökre</strong> belső csuklóért. A támaszok maradnak, a testek mozognak — ha tudnak.
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {eloreAllitott.map((p) => (
              <button key={p.nev} type="button" onClick={() => beallit(p)} className="rounded-full bg-petrol-50 px-2.5 py-1 text-[11.5px] font-medium text-petrol-700 ring-1 ring-petrol-200 transition hover:bg-naracs-50 hover:text-naracs-700 hover:ring-naracs-300">
                {p.nev}
              </button>
            ))}
          </div>
        </div>
        <div className="min-w-0 space-y-3">
          <Merleg e={itelet.e} i={itelet.i} eReszek={[{ cimke: `${szerkezet.testek.length} test × 3`, db: itelet.e }]} iReszek={iReszek} itelet={itelet} />
          <div className="rounded-xl bg-petrol-50/70 p-3 text-[13px] leading-relaxed text-petrol-700">
            {itelet.tipus === "hatarozott" && (
              <p>
                <strong className="text-emerald-700">{iteletCim(itelet)}</strong> — a rang teljes (rang = {itelet.rang}): minden mozgás gátolt, egyetlen kényszer sem fölös. A próbateher reakciói egyértelműek (lila nyilak), a számítómag ellenőrzése:{" "}
                {megoldas?.ellenorzes?.rendben ? "ΣF = 0, ΣM = 0 ✓" : "…"}
              </p>
            )}
            {itelet.tipus === "hatarozatlan" && (
              <p>
                <strong className="text-violet-700">{iteletCim(itelet)}</strong> — minden mozgás gátolt, de {itelet.folos} kényszer fölös: az egyensúlyi egyenletek {itelet.folos} szabad paramétert hagynak. A rajzon látható reakciókat a számítómag <em>egységnyi merevséggel</em> számolta — más
                merevségaránynál mások lennének. Ez a tartó „megfeszül”: hőmérsékletváltozásra, támaszsüllyedésre is reakciók ébrednek benne.
              </p>
            )}
            {itelet.tipus === "tulhatarozott" && (
              <p>
                <strong className="text-rose-700">{iteletCim(itelet)}</strong> — {itelet.szabad} mozgást semmi nem gátol, a szerkezet nem tartó. A számlálás is mutatja: e = {itelet.e} &gt; i = {itelet.i}.
              </p>
            )}
            {itelet.tipus === "hatarozatlanEsTulhatarozott" && (
              <p>
                <strong className="text-rose-700">{iteletCim(itelet)}</strong>. {indok} A számlálás {itelet.i === itelet.e ? "(e = i) nem jelzi" : `(i − e = ${itelet.i - itelet.e}) csak a különbséget mutatja`}: szabad mozgások − fölös kényszerek = {itelet.szabad} − {itelet.folos} = {itelet.szabad - itelet.folos}.
              </p>
            )}
            {mozog && megoldas === null && <p className="mt-1 text-[12px] text-petrol-500">A számítómag (src/lib/tarto) ugyanezt mondja: az egyenletrendszer szinguláris, a próbateherre nincs megoldás.</p>}
          </div>
          {megoldas?.ok && (
            <div className="szamok rounded-xl border border-[color:var(--keret)] bg-white p-3 text-[12.5px] text-petrol-700">
              <p className="mb-1 text-[10.5px] font-bold tracking-[0.14em] text-petrol-500 uppercase">a próbateher reakciói [kN, kNm]</p>
              <ul className="space-y-0.5">
                {megoldas.reakciok.map((r, j) => {
                  const betu = cimkek ? cimkek[j] : String.fromCharCode(65 + j);
                  return (
                    <li key={j}>
                      <strong>{betu}</strong> ({KENYSZER_NEV[r.tipus]}):{" "}
                      {r.tipus === "csuklo" || r.tipus === "befogas" ? `Fx = ${sz(r.Fx, 2)}, Fy = ${sz(r.Fy, 2)}${r.tipus === "befogas" ? `, M = ${sz(r.M, 2)}` : ""}` : `${r.tipus === "rud" ? "S" : "R"} = ${sz(r.nagysag, 2)}`}
                    </li>
                  );
                })}
              </ul>
              {megoldas.merevsegfuggo && <p className="mt-1 text-[11.5px] text-violet-700">merevségfüggő értékek (határozatlan tartó)</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
