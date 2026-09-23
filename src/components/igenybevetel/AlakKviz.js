"use client";

import { useEffect, useMemo, useState } from "react";
import FeladatRajz, { vizszintesModell, vizszintesElemzes, DSZIN } from "./FeladatRajz";

/*
 * Alakhelyesség-kvíz (a H09–H12 feladatlapok szellemében): egy tartó és a terhe, alatta négy kis
 * ábra — egy helyes és három tipikusan hibás (rossz görbület, hiányzó/fordított ugrás, rossz oldal,
 * rossz meredekség, csuklóban M ≠ 0). A hibás ábrákat a pontos ábrából programozottan torzítjuk,
 * a pontos ábra a számítómagból jön. Tíz feladat, azonnali magyarázattal.
 */

const poli = (a, x) => { let s = 0; for (let i = a.length - 1; i >= 0; i--) s = s * x + a[i]; return s; };
const N = 16; // minta / szakasz

/** A pontos ábra szakaszonkénti mintái: [{ x1, x2, pontok: [[x, v], …], fok }] */
function mintavetel(szakaszok, jel) {
  return szakaszok.map((s) => {
    const pontok = [];
    for (let k = 0; k <= N; k++) {
      const x = s.x1 + ((s.x2 - s.x1) * k) / N;
      pontok.push([x, poli(s[jel], x - s.lok)]);
    }
    const egyutthatok = [...s[jel]];
    while (egyutthatok.length > 1 && Math.abs(egyutthatok[egyutthatok.length - 1]) < 1e-9) egyutthatok.pop();
    return { x1: s.x1, x2: s.x2, pontok, fok: egyutthatok.length - 1, q: s.q };
  });
}

const maxAbs = (szak) => Math.max(1e-9, ...szak.flatMap((s) => s.pontok.map((p) => Math.abs(p[1]))));
const chord = (s, x) => {
  const v1 = s.pontok[0][1], v2 = s.pontok[s.pontok.length - 1][1];
  const t = (x - s.x1) / Math.max(1e-9, s.x2 - s.x1);
  return v1 + (v2 - v1) * t;
};
const masol = (szak) => szak.map((s) => ({ ...s, pontok: s.pontok.map((p) => [p[0], p[1]]) }));

/** A torzítások: mindegyik a mintázott ábrából egy hibás változatot készít. */
const TORZITAS = {
  tukroz: {
    cim: "rossz oldal / előjel",
    fn: (szak) => masol(szak).map((s) => ({ ...s, pontok: s.pontok.map((p) => [p[0], -p[1]]) })),
    miert: (jel) => (jel === "M" ? "Az ábra a nyomott oldalra került: a nyomatéki ábrát mindig a húzott oldalra rajzoljuk (vízszintes tartónál a pozitív, azaz alsó oldal a húzott), lefelé mutató teher alatt az M lefelé „lóg”." : "A nyíróerő előjele fordított: a bal oldali tartórészen a felfelé mutató erő (pl. a reakció) pozitív V-t ad — és a pozitív V-t is a tartó pozitív (alsó) oldalára rajzoljuk, ugyanoda, ahová a pozitív M-et (tankönyv 8.3.2)."),
  },
  gorbuletForditva: {
    cim: "rossz görbület",
    fn: (szak) => masol(szak).map((s) => (s.fok >= 2 ? { ...s, pontok: s.pontok.map((p) => [p[0], 2 * chord(s, p[0]) - p[1]]) } : s)),
    miert: () => "A parabola a rossz irányba domborodik. M″ = −q: lefelé mutató megoszló teher alatt a nyomatéki ábra (a húzott oldalra rajzolva) a teher irányába lóg, mint egy kötél — a húrjától lefelé tér el.",
  },
  egyenesitve: {
    cim: "parabola helyett egyenes",
    fn: (szak) => masol(szak).map((s) => (s.fok >= 2 ? { ...s, pontok: s.pontok.map((p) => [p[0], chord(s, p[0])]) } : s)),
    miert: () => "Megoszló teher alatt az M nem lehet egyenes: a nyíróerő ott lineárisan változik, a nyomaték tehát másodfokú parabola. Egyenes M csak terheletlen szakaszon (állandó V) lehet.",
  },
  parabolava: {
    cim: "egyenes helyett parabola",
    fn: (szak) => {
      const m = maxAbs(szak);
      return masol(szak).map((s) => {
        if (s.fok >= 2) return s;
        const kozep = (s.pontok[0][1] + s.pontok[s.pontok.length - 1][1]) / 2;
        const f = 0.35 * m * (kozep >= 0 ? 1 : -1);
        return { ...s, pontok: s.pontok.map((p, k) => { const t = k / N; return [p[0], p[1] + 4 * f * t * (1 - t)]; }) };
      });
    },
    miert: (jel) => (jel === "M" ? "Terheletlen szakaszon (állandó V) a nyomaték lineáris, nem parabola: parabolát csak megoszló teher ad." : "Koncentrált erők között a nyíróerő állandó (vízszintes szakasz): a V csak ott változik folyamatosan, ahol megoszló teher hat."),
  },
  lepcsos: {
    cim: "lépcső a lineáris helyett",
    fn: (szak) => masol(szak).map((s) => {
      if (s.fok !== 1) return s;
      const v1 = s.pontok[0][1], v2 = s.pontok[s.pontok.length - 1][1];
      return { ...s, pontok: s.pontok.map((p, k) => [p[0], k <= N / 2 ? v1 : v2]) };
    }),
    miert: () => "A megoszló terhet nem szabad egyetlen koncentrált erővel helyettesíteni az ábra rajzolásakor: a V folyamatosan, lineárisan csökken a teher hossza mentén (dV/dx = −q), nem egy ugrással a közepén.",
  },
  konstansra: {
    cim: "állandó a lineáris helyett",
    fn: (szak) => masol(szak).map((s) => {
      if (s.fok !== 1) return s;
      const v = s.pontok[0][1];
      return { ...s, pontok: s.pontok.map((p) => [p[0], v]) };
    }),
    miert: () => "Megoszló teher alatt a nyíróerő nem állandó: minden méter teher egy p·1 m-nyi változást ad, a V lineárisan változik (dV/dx = −q).",
  },
  forditva: {
    cim: "rossz meredekség / fordított lefutás",
    fn: (szak) => {
      const L = szak[szak.length - 1].x2, x0 = szak[0].x1;
      return [...masol(szak)].reverse().map((s) => ({ ...s, x1: x0 + L - s.x2, x2: x0 + L - s.x1, pontok: [...s.pontok].reverse().map((p) => [x0 + L - p[0], p[1]]) }));
    },
    miert: (jel) => (jel === "M" ? "A konzol szabad végén az M nulla (nincs ott koncentrált nyomaték), és a befogás felé nő: a legnagyobb nyomaték a befogásnál van, nem a szabad végen." : "A konzol szabad végén a V nulla (nincs ott erő), és a befogás felé nő a teherrel: a legnagyobb nyíróerő a befogásnál van."),
  },
  ugrasNelkul: {
    cim: "hiányzó ugrás",
    fn: (szak) => {
      const ki = masol(szak);
      let eltolas = 0, volt = false;
      for (let i = 1; i < ki.length; i++) {
        const bal = ki[i - 1].pontok[N][1], jobb = ki[i].pontok[0][1] + eltolas;
        if (!volt && Math.abs(bal - jobb) > 1e-6) { eltolas += bal - jobb; volt = true; }
        ki[i].pontok = ki[i].pontok.map((p) => [p[0], p[1] + eltolas]);
      }
      return ki;
    },
    miert: (jel) => (jel === "M" ? "A koncentrált nyomaték helyén az M ábrában ugrás van (a nyomaték nagyságával), a V nem változik. Törés helyett ugrás kell." : "A koncentrált erő (vagy reakció) helyén a nyíróerő ugrik az erő nagyságával — az ugrás elhagyása azt jelenti, hogy egy erőt kifelejtettünk."),
  },
  ugrasForditva: {
    cim: "fordított ugrás",
    fn: (szak) => {
      const ki = masol(szak);
      let eltolas = 0;
      for (let i = 1; i < ki.length; i++) {
        const bal = ki[i - 1].pontok[N][1], jobb = ki[i].pontok[0][1] + eltolas;
        if (Math.abs(bal - jobb) > 1e-6) eltolas += 2 * (bal - jobb);
        ki[i].pontok = ki[i].pontok.map((p) => [p[0], p[1] + eltolas]);
      }
      return ki;
    },
    miert: () => "Az ugrás iránya fordított. Balról jobbra haladva az óramutató járásával egyező koncentrált nyomaték a bal oldali tartórész nyomatéki egyenletében +M-mel jelenik meg — az ugrás iránya a nyomaték forgásirányából következik, nem szabad megtippelni.",
  },
  ugrasBele: {
    cim: "ugrás az erő alatt",
    fn: (szak) => {
      const ki = masol(szak);
      const m = maxAbs(szak);
      const bal = ki[0].pontok[N][1];
      const eltolas = 0.55 * m * (bal >= 0 ? 1 : -1);
      for (let i = 1; i < ki.length; i++) ki[i].pontok = ki[i].pontok.map((p) => [p[0], p[1] + eltolas]);
      return ki;
    },
    miert: () => "Koncentrált erő alatt a nyomatéki ábrában nincs ugrás, csak törés: az erő karja a saját támadáspontjára nulla. Ugrást az M-ben csak koncentrált nyomaték okoz.",
  },
  egyUgrasNelkul: {
    cim: "egy ugrás hiányzik",
    fn: (szak) => TORZITAS.ugrasNelkul.fn(szak),
    miert: () => "A második erő ugrása hiányzik: minden koncentrált erő alatt a V az erő nagyságával ugrik. Két egyforma, szimmetrikus erőnél a két ugrás is egyforma, és a végén a V a −B értékre (a reakcióra) ér.",
  },
  haromszog: {
    cim: "parabola helyett törés",
    fn: (szak) => masol(szak).map((s) => {
      if (s.fok < 2) return s;
      let kc = 0;
      s.pontok.forEach((p, k) => { if (Math.abs(p[1] - chord(s, p[0])) > Math.abs(s.pontok[kc][1] - chord(s, s.pontok[kc][0]))) kc = k; });
      const tc = kc / N, csucs = s.pontok[kc][1] - chord(s, s.pontok[kc][0]);
      return { ...s, pontok: s.pontok.map((p, k) => { const t = k / N; const w = t <= tc ? t / Math.max(tc, 1e-9) : (1 - t) / Math.max(1 - tc, 1e-9); return [p[0], chord(s, p[0]) + csucs * w]; }) };
    }),
    miert: () => "Megoszló teher alatt az M nem törik meg, hanem simán, parabola szerint görbül: törés csak koncentrált erő alatt van. A csúcsnál (V = 0) az érintő vízszintes.",
  },
  eltolva: {
    cim: "nem nulla a támasznál",
    fn: (szak) => {
      const m = maxAbs(szak);
      const atlag = szak.flatMap((s) => s.pontok.map((p) => p[1])).reduce((a, b) => a + b, 0);
      const d = 0.45 * m * (atlag >= 0 ? -1 : 1);
      return masol(szak).map((s) => ({ ...s, pontok: s.pontok.map((p) => [p[0], p[1] + d]) }));
    },
    miert: () => "A tartó végén, csuklós vagy görgős támasznál — ha ott nem hat koncentrált nyomaték — a hajlítónyomaték nulla: az ábrának a tengelyről kell indulnia és oda kell visszaérnie.",
  },
  csuklonNemNulla: {
    cim: "M ≠ 0 a csuklóban",
    fn: (szak, info) => {
      // az ábra „nem megy át” a csuklón: a támaszok között sátor-alakú eltolást adunk hozzá, csúcsa a csuklóban
      const m = maxAbs(szak);
      const xG = info.csuklok[0];
      const tam = [...info.tamaszX.map((t) => t.x)].sort((a, b) => a - b);
      const bal = Math.max(...tam.filter((x) => x < xG)), jobb = Math.min(...tam.filter((x) => x > xG));
      const h = -0.6 * m;
      const sator = (x) => (x <= bal || x >= jobb ? 0 : x <= xG ? (h * (x - bal)) / (xG - bal) : (h * (jobb - x)) / (jobb - xG));
      return masol(szak).map((s) => ({ ...s, pontok: s.pontok.map((p) => [p[0], p[1] + sator(p[0])]) }));
    },
    miert: () => "A belső csuklóban a hajlítónyomaték nulla (a csukló nem ad át nyomatékot), ezért a nyomatéki ábrának át kell mennie a csuklón — itt a csukló fölött az ábra nem metszi a tengelyt.",
  },
};

/* ---------------- a feladatok ---------------- */

const kettamaszu = (L, terhek) => vizszintesModell({ hossz: L, tamaszok: [{ x: 0, tipus: "csuklo" }, { x: L, tipus: "gorgo" }], terhek });
const konzol = (L, terhek) => vizszintesModell({ hossz: L, tamaszok: [{ x: 0, tipus: "befogas" }], terhek });

const FELADATOK = [
  {
    cim: "Kéttámaszú tartó, erő a közepén — M ábra",
    modell: kettamaszu(6, [{ fajta: "F", x: 3, F: 12 }]),
    jel: "M",
    hibak: ["tukroz", "parabolava", "ugrasBele"],
    magyarazat: "Terheletlen szakaszokon az M lineáris, az erő alatt törés (a nyíróerő ott ugrik, a meredekség változik), a két támasznál M = 0. A törés konvex oldala az erő nyilának konvex oldalára esik — az ábra lefelé „csúcsosodik”, F·L/4 = 18 kNm.",
  },
  {
    cim: "Kéttámaszú tartó, egyenletes teher — M ábra",
    modell: kettamaszu(6, [{ fajta: "p", x1: 0, x2: 6, p: 4 }]),
    jel: "M",
    hibak: ["tukroz", "haromszog", "eltolva"],
    magyarazat: "Egyenletes teher alatt a V lineáris, az M másodfokú parabola, amely a teher irányába lóg (kötélalak); a végeken nulla, a közepén pL²/8 = 18 kNm. A húzott oldal alul van, ezért az ábra a tengely alatt.",
  },
  {
    cim: "Kéttámaszú tartó, egyenletes teher — V ábra",
    modell: kettamaszu(6, [{ fajta: "p", x1: 0, x2: 6, p: 4 }]),
    jel: "V",
    hibak: ["tukroz", "lepcsos", "parabolava"],
    magyarazat: "A bal támasznál V = +A = 12 kN (a felfelé mutató reakció pozitív), majd dV/dx = −q miatt lineárisan csökken, a közepén nulla (itt az M szélsőértéke), a jobb támasznál −12 kN. A pozitív értékek a tartó alatt vannak, a negatívak fölötte — ugyanúgy, mint az M-nél.",
  },
  {
    cim: "Befogott konzol, erő a szabad végen — M ábra",
    modell: konzol(3, [{ fajta: "F", x: 3, F: 8 }]),
    jel: "M",
    hibak: ["tukroz", "parabolava", "forditva"],
    magyarazat: "A konzolt a szabad vég felől számoljuk: M(x) = −F·(L − x): a szabad végen nulla, a befogásnál −F·L = −24 kNm. A felső szál a húzott, ezért az ábra a tengely fölött van, és lineáris (terheletlen szakasz).",
  },
  {
    cim: "Befogott konzol, egyenletes teher — M ábra",
    modell: konzol(3, [{ fajta: "p", x1: 0, x2: 3, p: 5 }]),
    jel: "M",
    hibak: ["tukroz", "gorbuletForditva", "egyenesitve"],
    magyarazat: "M(x) = −p·(L − x)²/2: parabola, a szabad végen nulla értékkel ÉS nulla meredekséggel (ott V = 0), a befogásnál −pL²/2 = −22,5 kNm. Felül húzott, a görbület a teher irányába lóg.",
  },
  {
    cim: "Befogott konzol, egyenletes teher — V ábra",
    modell: konzol(3, [{ fajta: "p", x1: 0, x2: 3, p: 5 }]),
    jel: "V",
    hibak: ["tukroz", "forditva", "konstansra"],
    magyarazat: "A szabad végen V = 0, a befogás felé haladva minden méter teher 5 kN-nal növeli: a befogásnál V = +pL = 15 kN (a bal oldali rész szempontjából a reakció felfelé mutat). Lineáris, nem állandó — és végig pozitív, ezért az ábra a tartó alatt fut (a pozitív oldalon, mint az M-nél).",
  },
  {
    cim: "Kéttámaszú tartó koncentrált nyomatékkal — M ábra",
    modell: kettamaszu(6, [{ fajta: "M", x: 2, M: -12 }]),
    jel: "M",
    hibak: ["ugrasNelkul", "tukroz", "ugrasForditva"],
    magyarazat: "A koncentrált nyomaték a V-t nem változtatja (V = −M₀/L = 2 kN állandó), az M-ben viszont a nyomaték nagyságával ugrás van; a két oldalon az érintő azonos meredekségű. A támaszoknál M = 0.",
  },
  {
    cim: "Gerber-tartó — M ábra",
    modell: vizszintesModell({ hossz: 9, tamaszok: [{ x: 0, tipus: "csuklo" }, { x: 4, tipus: "gorgo" }, { x: 9, tipus: "gorgo" }], csuklok: [5.5], terhek: [{ fajta: "F", x: 7.5, F: 10 }, { fajta: "p", x1: 0, x2: 4, p: 3 }] }),
    jel: "M",
    hibak: ["csuklonNemNulla", "tukroz", "egyenesitve"],
    magyarazat: "A G belső csuklóban M = 0: az ábra átmegy a csuklón. A befüggesztett GD részt előbb számoljuk (kéttámaszú tartóként), a B támasz fölött negatív (felül húzott) nyomaték, az AB szakaszon a megoszló teher parabolája.",
  },
  {
    cim: "Két szimmetrikus erő — V ábra",
    modell: kettamaszu(8, [{ fajta: "F", x: 2, F: 10 }, { fajta: "F", x: 6, F: 10 }]),
    jel: "V",
    hibak: ["tukroz", "egyUgrasNelkul", "parabolava"],
    magyarazat: "A = B = 10 kN. A V a bal támasznál +10, az első erőnél 10-zel leugrik nullára, a két erő között nulla (itt az M állandó, F·a = 20 kNm), a második erőnél −10-re ugrik, a jobb támasznál a B reakció zárja vissza nullára.",
  },
  {
    cim: "Kéttámaszú tartó, erő és megoszló teher — M ábra",
    modell: kettamaszu(6, [{ fajta: "F", x: 2, F: 12 }, { fajta: "p", x1: 0, x2: 6, p: 3 }]),
    jel: "M",
    hibak: ["egyenesitve", "tukroz", "gorbuletForditva"],
    magyarazat: "A megoszló teher miatt mindkét szakaszon parabola, az erő alatt törés (a két parabola érintője ott F-fel különböző meredekségű). Az ábra végig a húzott (alsó) oldalon, a teher irányába domborodva.",
  },
];

/** A feladat elemzése: helyes és hibás ábrák. */
function keszitFeladat(f) {
  const modell = f.modell;
  const el = vizszintesElemzes(modell);
  const helyes = mintavetel(el.szakaszok, f.jel);
  const tamaszX = el.m.tamaszok.map((t) => ({ x: el.m.csomopontok[t.ics].x, tipus: t.tipus }));
  const info = { tamaszX, csuklok: modell.csuklok ?? [] };
  const hibasak = f.hibak.map((nev) => {
    const t = TORZITAS[nev];
    return { nev, cim: t.cim, szak: t.fn(helyes, info), miert: t.miert(f.jel) };
  });
  const cimkek = {};
  [...el.m.tamaszok].sort((a, b) => el.m.csomopontok[a.ics].x - el.m.csomopontok[b.ics].x).forEach((t, i) => { cimkek[el.m.csomopontok[t.ics].id] = "ABCD"[i]; });
  return { ...f, modell, e: el.e, helyes, hibasak, hossz: el.hossz, tamaszX, csuklok: modell.csuklok ?? [], cimkek, torespontok: el.torespontok.filter((p) => !p.szelso).map((p) => p.x) };
}

/* ---------------- kis ábra ---------------- */

function KisAbra({ szak, jel, hossz, tamaszX, csuklok, torespontok, betu, allapot, onClick, tiltva }) {
  const W = 280, H = 118, X0 = 22, X1 = 258, Y0 = 72, FEL = 38;
  const kx = (x) => X0 + (x / hossz) * (X1 - X0);
  const m = maxAbs(szak);
  // V és M egyaránt a tartó pozitív (alsó) oldalára: a pozitív érték lefelé (tankönyv 8.3.2, 8.9. ábra)
  const y = (v) => Y0 + (v / m) * FEL;
  const szin = DSZIN[jel];
  const ut = szak.map((s, i) => {
    const elozo = i > 0 ? szak[i - 1].pontok[N] : null;
    return (elozo ? `M ${kx(elozo[0])} ${y(elozo[1])} L ` : "M ") + s.pontok.map((p) => `${kx(p[0])} ${y(p[1])}`).join(" L ");
  }).join(" ");
  const terulet = szak.map((s) => `M ${kx(s.x1)} ${Y0} ` + s.pontok.map((p) => `L ${kx(p[0])} ${y(p[1])}`).join(" ") + ` L ${kx(s.x2)} ${Y0} Z`).join(" ");
  const eleje = szak[0].pontok[0], vege = szak[szak.length - 1].pontok[N];
  const keret = allapot === "helyes" ? "border-emerald-500 ring-2 ring-emerald-200" : allapot === "rossz" ? "border-rose-500 ring-2 ring-rose-200" : "border-[color:var(--keret)] hover:border-petrol-400";
  return (
    <button type="button" onClick={onClick} disabled={tiltva} className={`racs-vilagos min-w-0 overflow-hidden rounded-xl border bg-white text-left transition disabled:cursor-default ${keret}`}>
      <svg viewBox={`0 0 ${W} ${H}`} className="abra h-auto w-full">
        <text x={8} y={16} fontSize="12" fontWeight="700" style={{ fill: "#475569" }}>{betu})</text>
        {/* a tartó halványan */}
        <line x1={X0} y1={22} x2={X1} y2={22} stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
        {tamaszX.map((t, i) => (
          t.tipus === "befogas"
            ? <line key={i} x1={kx(t.x)} y1={12} x2={kx(t.x)} y2={32} stroke="#64748b" strokeWidth="2" />
            : <path key={i} d={`M ${kx(t.x)} 23 l -5 8 l 10 0 z`} fill={t.tipus === "gorgo" ? "white" : "#94a3b8"} stroke="#64748b" strokeWidth="1" />
        ))}
        {csuklok.map((x) => <circle key={x} cx={kx(x)} cy={22} r="3" fill="white" stroke="#64748b" strokeWidth="1.3" />)}
        {/* töréspont-függőlegesek, tengely */}
        {torespontok.map((x) => <line key={x} x1={kx(x)} y1={Y0 - FEL - 2} x2={kx(x)} y2={Y0 + FEL + 2} stroke="#cbd5e1" strokeWidth="0.7" strokeDasharray="2 2" />)}
        <line x1={X0 - 4} y1={Y0} x2={X1 + 4} y2={Y0} stroke="#64748b" strokeWidth="1" />
        <text x={W - 6} y={H - 6} textAnchor="end" fontSize="9.5" style={{ fill: "#94a3b8" }}>{jel === "M" ? "+ lefelé (húzott oldal)" : "+ lefelé (mint az M)"}</text>
        {/* a „+” és „−” oldal jele a tengely bal végénél */}
        <text x={X0 - 12} y={Y0 + 13} textAnchor="middle" fontSize="10" fontWeight="700" style={{ fill: szin, opacity: 0.85 }}>+</text>
        <text x={X0 - 12} y={Y0 - 6} textAnchor="middle" fontSize="10" fontWeight="700" style={{ fill: "#64748b", opacity: 0.85 }}>−</text>
        <path d={terulet} fill={szin} fillOpacity="0.14" />
        <path d={`M ${kx(eleje[0])} ${Y0} L ${ut.slice(2)} L ${kx(vege[0])} ${Y0}`} fill="none" stroke={szin} strokeWidth="1.9" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

/* ---------------- a kvíz ---------------- */

function kever(t) {
  const a = [...t];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

export default function AlakKviz() {
  const feladatok = useMemo(() => FELADATOK.map(keszitFeladat), []);
  const [i, setI] = useState(0);
  const [sorrend, setSorrend] = useState(null); // az opciók keverése feladatonként
  const [valasz, setValasz] = useState(null);
  const [pont, setPont] = useState(0);
  const [kesz, setKesz] = useState(false);

  useEffect(() => {
    setSorrend(feladatok.map((f) => kever([{ helyes: true, szak: f.helyes }, ...f.hibasak.map((h) => ({ helyes: false, ...h }))])));
  }, [feladatok]);

  if (!sorrend) return <div className="my-6 h-64 animate-pulse rounded-2xl border border-[color:var(--keret)] bg-white" />;

  const f = feladatok[i];
  const opciok = sorrend[i];
  const helyesIdx = opciok.findIndex((o) => o.helyes);

  const valaszol = (k) => {
    if (valasz !== null) return;
    setValasz(k);
    if (k === helyesIdx) setPont((p) => p + 1);
  };
  const tovabb = () => {
    if (i + 1 >= feladatok.length) { setKesz(true); return; }
    setI(i + 1);
    setValasz(null);
  };
  const ujra = () => {
    setSorrend(feladatok.map((f2) => kever([{ helyes: true, szak: f2.helyes }, ...f2.hibasak.map((h) => ({ helyes: false, ...h }))])));
    setI(0);
    setValasz(null);
    setPont(0);
    setKesz(false);
  };

  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white shadow-sm shadow-petrol-900/[0.04]">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-b border-[color:var(--keret)] bg-linear-to-r from-petrol-800 to-petrol-700 px-5 py-3.5">
        <span className="rounded-md bg-naracs-500 px-2 py-0.5 text-[10.5px] font-bold tracking-[0.14em] text-white uppercase">Alakhelyesség</span>
        <h3 className="text-[15px] font-semibold text-white">Melyik ábra a helyes?</h3>
        <span className="szamok ml-auto rounded-full bg-white/10 px-2.5 py-1 text-[12px] text-white">
          {Math.min(i + 1, feladatok.length)} / {feladatok.length} · {pont} pont
        </span>
      </div>
      <div className="px-4 py-4 sm:px-5">
        {kesz ? (
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-naracs-200 bg-naracs-50 px-4 py-3">
            <span className="text-[14px] font-semibold text-petrol-900">
              Vége: {pont} / {feladatok.length}.{" "}
              {pont >= 9 ? "Az alakhelyes ábra már a szemedben van." : pont >= 6 ? "Jó — a hibás válaszok magyarázatát olvasd vissza." : "Nézd át a teher → V → M alak táblázatot a puskában, aztán újra!"}
            </span>
            <button type="button" onClick={ujra} className="ml-auto rounded-lg bg-naracs-500 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-naracs-600">Újra ↻</button>
          </div>
        ) : (
          <>
            <p className="mb-2 text-[13px] text-petrol-500">
              A H09 feladatlap szellemében: számok nélkül is el kell tudni dönteni, melyik az alakhelyes <strong style={{ color: DSZIN[f.jel] }}>{f.jel}</strong> ábra. Kattints a helyesre!
            </p>
            <p className="mb-2 text-[14.5px] font-semibold text-petrol-900">{i + 1}. {f.cim}</p>
            <FeladatRajz modell={f.modell} eredmeny={f.e} cimkek={f.cimkek} meretek={false} />
            <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {opciok.map((o, k) => (
                <KisAbra
                  key={k}
                  szak={o.szak}
                  jel={f.jel}
                  hossz={f.hossz}
                  tamaszX={f.tamaszX}
                  csuklok={f.csuklok}
                  torespontok={f.torespontok}
                  betu={"abcd"[k]}
                  allapot={valasz === null ? null : k === helyesIdx ? "helyes" : k === valasz ? "rossz" : null}
                  onClick={() => valaszol(k)}
                  tiltva={valasz !== null}
                />
              ))}
            </div>
            {valasz !== null && (
              <div className={`mt-3 rounded-xl border px-4 py-3 text-[13.5px] leading-relaxed ${valasz === helyesIdx ? "border-emerald-200 bg-emerald-50 text-petrol-800" : "border-rose-200 bg-rose-50 text-petrol-800"}`}>
                <p>
                  <strong>{valasz === helyesIdx ? "Helyes!" : `Nem: a ${"abcd"[valasz]}) ábra hibája — ${opciok[valasz].cim}.`}</strong>{" "}
                  {valasz !== helyesIdx && opciok[valasz].miert}
                </p>
                <p className="mt-1.5">
                  <span className="font-semibold">A helyes ({"abcd"[helyesIdx]}):</span> {f.magyarazat}
                </p>
                {valasz === helyesIdx && (
                  <p className="mt-1.5 text-[12.5px] text-petrol-600">
                    A többi: {opciok.filter((o) => !o.helyes).map((o, k) => `${"abcd"[opciok.indexOf(o)]}) ${o.cim}`).join(", ")}.
                  </p>
                )}
                <div className="mt-2.5">
                  <button type="button" onClick={tovabb} className="rounded-lg bg-petrol-800 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-petrol-900">
                    {i + 1 >= feladatok.length ? "Eredmény" : "Következő →"}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export const _teszt = { FELADATOK, keszitFeladat, TORZITAS, maxAbs };
