"use client";

import GyakorloDoboz from "@/components/GyakorloDoboz";
import { M, MB } from "@/components/ui/Keplet";
import { sz, szK } from "@/lib/szamok";
import {
  TartoHegyek,
  Tarto,
  Gorgo,
  Csuklo,
  Befogas,
  Rud,
  TeherNyil,
  MegoszloTeher,
  KoncentraltNyomatek,
  Meret,
  TamaszCimke,
  SZIN,
} from "@/components/tartok/TartoElemek";

/* ============================================================
   Közös segédek a gyakorló generátorokhoz (a GyakorloSzekcio is innen importál)
   ============================================================ */

export const egesz = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
export const valaszt = (tomb) => tomb[Math.floor(Math.random() * tomb.length)];
/** Fél méteres lépésű véletlen érték min…max között. */
export const fel = (min, max) => egesz(Math.round(min * 2), Math.round(max * 2)) / 2;
/** n különböző, fél méteres lépésű hely min…max között, növekvő sorrendben. */
export function helyek(n, min, max) {
  const s = new Set();
  let proba = 0;
  while (s.size < n && proba++ < 500) s.add(fel(min, max));
  return [...s].sort((a, b) => a - b);
}
/** Előjeles szorzat-tag a nyomatéki egyenletbe: „+ 2·10” / „− 4,5·6” (kar és erő a saját előjelével). */
export function tag(kar, ero, tizKar = 1, tizEro = 0) {
  const v = kar * ero;
  const jel = v < 0 ? "-" : "+";
  return `${jel} ${szK(Math.abs(kar), tizKar)}\\cdot ${szK(Math.abs(ero), tizEro)}`;
}
/** Előjeles egyszerű tag: „+ 10” / „− 4,5”. */
export function tagE(ero, tiz = 0) {
  return `${ero < 0 ? "-" : "+"} ${szK(Math.abs(ero), tiz)}`;
}
const FOK = Math.PI / 180;

/**
 * Általános tartó-rajz a gyakorló feladatokhoz (méterben megadott geometria).
 *   xMin, xMax  – a tartó két vége (m)
 *   tamaszok    – [{tipus:"csuklo"|"gorgo"|"befogas"|"rud", x, szog?, irany?, xVeg?, yVeg?, cimke?}]
 *   erok        – [{x, F (kN), szog (fok, 0 = jobbra, 90 = fel), cimke}]
 *   megoszlok   – [{x1, x2, p (kN/m), cimke}]
 *   nyomatekok  – [{x, M (kNm, ↶ pozitív), cimke}]
 *   cimkek      – [{x, y (m), szoveg}] – tetszőleges felirat a tartó koordináta-rendszerében
 *   meretek     – true: automatikus méretlánc a jellegzetes pontok között
 */
export function TartoRajz({ xMin = 0, xMax, tamaszok = [], erok = [], megoszlok = [], nyomatekok = [], cimkek = [], meretek = true, pontok = [] }) {
  const hossz = Math.max(0.5, xMax - xMin);
  const rudMagas = Math.max(0, ...tamaszok.filter((t) => t.tipus === "rud").map((t) => Math.abs(t.yVeg ?? 0)));
  const PX = Math.min(90, 470 / hossz, rudMagas > 0 ? 190 / rudMagas : 90);
  const OX = 300 - (PX * (xMax + xMin)) / 2;
  const Y = 0;
  const kx = (x) => OX + (x - 0) * PX;
  const ky = (y) => Y - y * PX;
  const leptek = 5; // px / (kN/m)
  const eroHossz = (F) => Math.min(80, 40 + 2.2 * Math.abs(F)); // ferde erők hossza

  let fent = Y - 70;
  let lent = Y + 60;
  const jellegzetes = new Set([xMin, xMax]);

  const elemek = [];
  tamaszok.forEach((t, i) => {
    jellegzetes.add(t.x);
    const x = kx(t.x);
    if (t.tipus === "csuklo") elemek.push(<Csuklo key={`t${i}`} x={x} y={Y} />);
    else if (t.tipus === "gorgo") elemek.push(<Gorgo key={`t${i}`} x={x} y={Y} szog={t.szog ?? 0} />);
    else if (t.tipus === "befogas") elemek.push(<Befogas key={`t${i}`} x={x} y={Y} irany={t.irany ?? (t.x <= xMin ? "bal" : "jobb")} hossz={56} />);
    else if (t.tipus === "rud") {
      const x2 = kx(t.xVeg);
      const y2 = ky(t.yVeg);
      fent = Math.min(fent, y2 - 26);
      lent = Math.max(lent, y2 + 26);
      elemek.push(
        <g key={`t${i}`}>
          <Rud x1={x} y1={Y} x2={x2} y2={y2} />
          <Csuklo x={x2} y={y2} meret={10} forgatas={t.yVeg > 0 ? 180 : 0} />
          {t.cimke && (
            <text x={x + 0.68 * (x2 - x) + 8} y={Y + 0.68 * (y2 - Y) + (t.yVeg > 0 ? 10 : -6)} fontSize="12.5" fontStyle="italic" fontWeight="650" style={{ fill: SZIN.rud, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
              {t.cimke}
            </text>
          )}
        </g>,
      );
    }
    if (t.cimke && t.tipus !== "rud") elemek.push(<TamaszCimke key={`tc${i}`} x={x + (t.tipus === "befogas" ? 14 : 0)} y={Y + 44}>{t.cimke}</TamaszCimke>);
  });

  /** A megoszló teher feliratának helye: a szakasz három jelölt pontja közül az, amelyik a legtávolabb van minden erőnyíltól. */
  const cimkeHely = (m) => {
    const w = m.x2 - m.x1;
    const jeloltek = [m.x1 + 0.5 * w, m.x1 + 0.2 * w, m.x2 - 0.2 * w];
    const tav = (x) => Math.min(Infinity, ...erok.map((e) => Math.abs(e.x - x)), ...nyomatekok.map((n) => Math.abs(n.x - x)));
    return jeloltek.reduce((legjobb, x) => (tav(x) > tav(legjobb) + 1e-9 ? x : legjobb), jeloltek[0]);
  };
  megoszlok.forEach((m, i) => {
    jellegzetes.add(m.x1);
    jellegzetes.add(m.x2);
    fent = Math.min(fent, Y - m.p * leptek - 30);
    elemek.push(
      <g key={`m${i}`}>
        <MegoszloTeher x1={kx(m.x1)} x2={kx(m.x2)} y={Y - 3} p1={m.p} leptek={leptek} />
        {m.cimke && (
          <text x={kx(cimkeHely(m))} y={Y - 3 - m.p * leptek - 8} textAnchor="middle" fontSize="12.5" fontWeight="650" style={{ fill: SZIN.teher, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
            {m.cimke}
          </text>
        )}
      </g>,
    );
  });
  let fuggSzam = 0;
  erok.forEach((e, i) => {
    jellegzetes.add(e.x);
    const r = e.szog * FOK;
    let h = eroHossz(e.F);
    if (Math.abs(Math.cos(r)) < 1e-6) {
      // függőleges erő: ha megoszló teher fölé esik, a nyíl a teher tetejéről indul; a szomszédos feliratok ne fedjék egymást
      const alatta = megoszlok.find((m) => e.x >= m.x1 - 1e-9 && e.x <= m.x2 + 1e-9);
      h = (alatta ? alatta.p * leptek + 3 : 0) + 50 + (fuggSzam % 2) * 28;
      fuggSzam++;
    } else {
      const alatta = megoszlok.find((m) => e.x >= m.x1 - 1e-9 && e.x <= m.x2 + 1e-9);
      if (alatta && Math.abs(Math.sin(r)) > 0.3) h = Math.max(h, (alatta.p * leptek + 3 + 36) / Math.abs(Math.sin(r)));
    }
    const x1 = kx(e.x) - h * Math.cos(r);
    const y1 = Y + h * Math.sin(r);
    fent = Math.min(fent, y1 - 24);
    lent = Math.max(lent, y1 + 24);
    const fuggoleges = Math.abs(Math.cos(r)) < 1e-6;
    const jobbra = Math.cos(r) > 0;
    const szeles = 6.4 * (e.cimke?.length ?? 4);
    const eltolas = fuggoleges ? [6, -4] : jobbra || x1 + 8 + szeles > 596 ? [-4 - szeles, -4] : [8, -4];
    elemek.push(<TeherNyil key={`e${i}`} x={kx(e.x)} y={Y - (Math.sin(r) < 0 ? 3 : -3)} hossz={h} szog={e.szog} cimke={e.cimke} cimkeEltolas={eltolas} />);
  });
  nyomatekok.forEach((n, i) => {
    jellegzetes.add(n.x);
    fent = Math.min(fent, Y - 52);
    elemek.push(
      <g key={`n${i}`}>
        <KoncentraltNyomatek x={kx(n.x)} y={Y} r={17} irany={n.M >= 0 ? 1 : -1} />
        {n.cimke && (
          <text x={kx(n.x) + 24} y={Y - 14} fontSize="12.5" fontWeight="650" style={{ fill: SZIN.nyomatek, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
            {n.cimke}
          </text>
        )}
      </g>,
    );
  });
  pontok.forEach((p, i) => {
    elemek.push(
      <g key={`p${i}`}>
        <circle cx={kx(p.x)} cy={ky(p.y ?? 0)} r="3" fill="#0f172a" />
        <TamaszCimke x={kx(p.x) + (p.dx ?? 0)} y={ky(p.y ?? 0) + (p.dy ?? -8)}>{p.cimke}</TamaszCimke>
      </g>,
    );
  });
  cimkek.forEach((c, i) => {
    elemek.push(
      <text key={`c${i}`} x={kx(c.x)} y={ky(c.y)} textAnchor="middle" fontSize="12" style={{ fill: SZIN.meret, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
        {c.szoveg}
      </text>,
    );
  });

  let meretElemek = null;
  if (meretek) {
    const xs = [...jellegzetes].sort((a, b) => a - b);
    const yM = lent + 8;
    meretElemek = (
      <g>
        {xs.slice(0, -1).map((x, i) => {
          const d = xs[i + 1] - x;
          if (d < 1e-9) return null;
          return <Meret key={i} x1={kx(x)} x2={kx(xs[i + 1])} y={yM} cimke={sz(d, 1)} />;
        })}
        <text x={kx(xs[xs.length - 1]) + 10} y={yM + 4} fontSize="11" style={{ fill: SZIN.meret }}>
          m
        </text>
      </g>
    );
    lent = yM + 14;
  }

  const magas = lent - fent + 10;
  return (
    <div className="racs-vilagos overflow-hidden rounded-xl border border-[color:var(--keret)] p-2">
      <svg viewBox={`0 ${fent - 5} 600 ${magas}`} className="abra mx-auto h-auto w-full max-w-xl">
        <TartoHegyek />
        <Tarto x1={kx(xMin)} y1={Y} x2={kx(xMax)} y2={Y} />
        {elemek}
        {meretElemek}
      </svg>
    </div>
  );
}

/* ============================================================
   6. Kéttámaszú tartó ferde görgővel
   ============================================================ */

function ferdeGorgoFeladat() {
  const L = fel(4, 8);
  const [x1, x2] = helyek(2, 0.5, L - 0.5);
  const F1 = egesz(4, 16);
  const F2 = egesz(4, 16);
  const a = valaszt([15, 20, 25, 30, 35, 40, 45]);
  const jobbraEmelkedik = Math.random() < 0.5; // a gördülési sík jobbra emelkedik → a reakció balra-felfelé mutat
  const s = jobbraEmelkedik ? -1 : 1; // B_x előjele
  const sinA = Math.sin(a * FOK);
  const cosA = Math.cos(a * FOK);
  const tanA = Math.tan(a * FOK);
  const MA = x1 * F1 + x2 * F2; // a terhek ↷ nyomatéka A-ra (pozitív szám)
  const B = MA / (L * cosA);
  const Ay = ((L - x1) * F1 + (L - x2) * F2) / L;
  const yD = (s > 0 ? -1 : 1) * (L / tanA); // a B hatásvonalának és az A_y hatásvonalának (x = 0) metszéspontja
  const Ax = MA / yD;
  const Bx = s * B * sinA;
  const By = B * cosA;

  return {
    adat: {
      ismeretlenek: [
        { id: "ax", pont: [0, 0], irany: [1, 0] },
        { id: "ay", pont: [0, 0], irany: [0, 1] },
        { id: "b", pont: [L, 0], irany: [s * sinA, cosA] },
      ],
      terhek: [
        { pont: [x1, 0], F: [0, -F1] },
        { pont: [x2, 0], F: [0, -F2] },
      ],
    },
    szoveg: (
      <p>
        Egy <M>{`L = ${szK(L, 1)}\\ \\text{m}`}</M> támaszközű kéttámaszú tartót a bal végén (<M>{"A"}</M>) csukló, a jobb végén (<M>{"B"}</M>) olyan görgő támaszt meg, amelynek gördülési síkja a vízszintessel{" "}
        <M>{`\\alpha = ${a}^\\circ`}</M>-ot zár be, és {jobbraEmelkedik ? "jobbra emelkedik" : "balra emelkedik"}. A tartót két függőleges, lefelé mutató erő terheli: <M>{`F_1 = ${F1}\\ \\text{kN}`}</M> az{" "}
        <M>{`x_1 = ${szK(x1, 1)}\\ \\text{m}`}</M>, <M>{`F_2 = ${F2}\\ \\text{kN}`}</M> az <M>{`x_2 = ${szK(x2, 1)}\\ \\text{m}`}</M> helyen (<M>{"A"}</M>-tól mérve). Számítsd ki a reakciókat! A felvett irányok:{" "}
        <M>{"A_x"}</M> jobbra, <M>{"A_y"}</M> felfelé, <M>{"B"}</M> a gördülési síkra merőlegesen, felfelé.
      </p>
    ),
    abra: (
      <TartoRajz
        xMax={L}
        tamaszok={[
          { tipus: "csuklo", x: 0, cimke: "A" },
          { tipus: "gorgo", x: L, szog: jobbraEmelkedik ? a : -a, cimke: "B" },
        ]}
        erok={[
          { x: x1, F: F1, szog: -90, cimke: `F₁ = ${F1} kN` },
          { x: x2, F: F2, szog: -90, cimke: `F₂ = ${F2} kN` },
        ]}
      />
    ),
    sugo: (
      <p>
        A ferde görgő reakciója a gördülési síkra merőleges: a függőlegessel ugyanakkora szöget zár be, mint a sík a vízszintessel. A csuklóra írt nyomatéki egyenletben <M>{"B"}</M> függőleges komponense,{" "}
        <M>{"B\\cos\\alpha"}</M> forgat <M>{"L"}</M> karral. <M>{"A_x"}</M>-hez a főpont a <M>{"B"}</M> hatásvonalának és az <M>{"x = 0"}</M> függőlegesnek a metszéspontja — vagy egyszerűbben: vízszintes vetületi egyenlet.
      </p>
    ),
    oszlopok: 3,
    mezok: [
      { id: "ax", cimke: "A_x (jobbra +)", egyseg: "kN", helyes: Ax, tizedes: 2 },
      { id: "ay", cimke: "A_y (felfelé +)", egyseg: "kN", helyes: Ay, tizedes: 2 },
      { id: "b", cimke: "B (a síkra merőlegesen, felfelé +)", egyseg: "kN", helyes: B, tizedes: 2 },
    ],
    megoldas: (
      <>
        <p>
          <strong>Elkülönítés:</strong> a csukló helyett <M>{"A_x"}</M> (jobbra) és <M>{"A_y"}</M> (felfelé), a görgő helyett a gördülési síkra merőleges <M>{"B"}</M>, amely a függőlegessel <M>{`\\alpha = ${a}^\\circ`}</M>-ot zár be
          ({jobbraEmelkedik ? "balra" : "jobbra"}-felfelé mutat). Komponensei: <M>{`B_x = ${s < 0 ? "-" : ""}B\\sin ${a}^\\circ`}</M>, <M>{`B_y = B\\cos ${a}^\\circ`}</M>.
        </p>
        <MB>{"(\\underline{F}_1, \\underline{F}_2, \\underline{A}, \\underline{B}) \\ekv \\underline{O}"}</MB>
        <p>Nyomatéki egyenlet a csuklóra (a csuklóerő két komponense kiesik):</p>
        <MB>{`\\Mp{A} ${tag(x1, -F1)} ${tag(x2, -F2)} + ${szK(L, 1)}\\cdot B\\cos ${a}^\\circ = 0 \\;\\Rightarrow\\; B = \\frac{${szK(MA, 2)}}{${szK(L, 1)}\\cdot ${szK(cosA, 4)}} = ${szK(B, 2)}\\ \\text{kN}`}</MB>
        <p>
          Nyomatéki egyenlet a görgőre (<M>{"B"}</M> és <M>{"A_x"}</M> hatásvonala átmegy rajta):
        </p>
        <MB>{`\\Mp{B} ${tag(L - x1, F1)} ${tag(L - x2, F2)} - ${szK(L, 1)}\\cdot A_y = 0 \\;\\Rightarrow\\; A_y = ${szK(Ay, 2)}\\ \\text{kN}`}</MB>
        <p>
          Az <M>{"A_x"}</M> főpontja: a <M>{"B"}</M> hatásvonalának és az <M>{"A_y"}</M> hatásvonalának (az <M>{"x = 0"}</M> függőleges) metszéspontja, <M>{`D(0;\\ ${szK(yD, 3)})`}</M>, mert{" "}
          <M>{`y_D = ${yD < 0 ? "-" : ""}L/\\tan ${a}^\\circ`}</M>. A függőleges terhek karja <M>{"D"}</M>-re ugyanaz, mint <M>{"A"}</M>-ra, <M>{"A_x"}</M> karja <M>{`|y_D| = ${szK(Math.abs(yD), 3)}`}</M> m:
        </p>
        <MB>{`\\Mp{D} ${tag(x1, -F1)} ${tag(x2, -F2)} ${yD < 0 ? "-" : "+"} ${szK(Math.abs(yD), 3)}\\cdot A_x = 0 \\;\\Rightarrow\\; A_x = ${szK(Ax, 2)}\\ \\text{kN}`}</MB>
        <p>Ellenőrzés a nem használt függőleges vetületi egyenlettel:</p>
        <MB>{`\\Fy ${tagE(Ay, 2)} ${tagE(By, 2)} - ${F1} - ${F2} = ${szK(Ay + By - F1 - F2, 2)} \\approx 0 \\;\\checkmark`}</MB>
        <p className="mt-2 text-[13px] text-petrol-600">
          Ránézésre is stimmel: <M>{`\\Fx`}</M> <M>{`${szK(Ax, 2)} ${tagE(Bx, 2)} = ${szK(Ax + Bx, 2)}`}</M>. Mindhárom reakció pozitív, tehát a felvett irányuk a tényleges: <M>{"A_x"}</M> {Ax >= 0 ? "jobbra" : "balra"}{" "}
          — pontosan a görgőerő vízszintes komponensét egyensúlyozza ki.
        </p>
      </>
    ),
  };
}

/* ============================================================
   7. Három rúddal megtámasztott gerenda (két párhuzamos függőleges + egy ferde)
   ============================================================ */

function haromRudFeladat() {
  for (let proba = 0; proba < 100; proba++) {
    const L = fel(4, 8);
    const fent = Math.random() < 0.5; // a rudak felülről lógnak (függesztő) vagy alulról támasztanak
    const s = fent ? 1 : -1; // a függőleges rúderők iránya (húzott: a rúd másik vége felé)
    const h = fel(1.5, 3);
    const xC = fel(1, L - 1);
    let xD = fel(0, L);
    if (Math.abs(xD - xC) < 0.75) xD = xC + (xD >= xC ? 1 : -1);
    if (xD < 0 || xD > L) continue;
    const dx = xD - xC;
    const dy = s * h;
    const ell = Math.hypot(dx, dy);
    const u3 = [dx / ell, dy / ell];
    const xF = fel(0.5, L - 0.5);
    const F = egesz(5, 16);
    const alfa = valaszt([30, 45, 60]); // a ferde erő a vízszintessel bezárt szöge
    const jobbra = Math.random() < 0.5;
    const beta = jobbra ? -alfa : -180 + alfa; // matematikai irányszög (lefelé mutat)
    const Fx = F * Math.cos(beta * FOK);
    const Fy = F * Math.sin(beta * FOK);
    const xG = fel(0.5, L - 0.5);
    const G = egesz(4, 14); // függőleges erő
    // ΣFx: Fx + S3·u3x = 0
    const S3 = -Fx / u3[0];
    // O1 = S2 ∩ S3 (x = L): y1 = (L − xC)·u3y/u3x ; O2 = S1 ∩ S3 (x = 0): y2 = −xC·u3y/u3x
    const y1 = ((L - xC) * u3[1]) / u3[0];
    const y2 = (-xC * u3[1]) / u3[0];
    if (Math.abs(y1) > 12 || Math.abs(y2) > 12) continue;
    // ΣM_O1: (xF − L)·Fy + y1·Fx + (xG − L)·(−G) − s·L·S1 = 0
    const MO1 = (xF - L) * Fy + y1 * Fx + (xG - L) * -G;
    const S1 = MO1 / (s * L);
    // ΣM_O2: xF·Fy + y2·Fx + xG·(−G) + s·L·S2 = 0
    const MO2 = xF * Fy + y2 * Fx + xG * -G;
    const S2 = -MO2 / (s * L);
    const ellFy = s * S1 + s * S2 + S3 * u3[1] + Fy - G;

    return {
      adat: {
        ismeretlenek: [
          { id: "s1", pont: [0, 0], irany: [0, s] },
          { id: "s2", pont: [L, 0], irany: [0, s] },
          { id: "s3", pont: [xC, 0], irany: u3 },
        ],
        terhek: [
          { pont: [xF, 0], F: [Fx, Fy] },
          { pont: [xG, 0], F: [0, -G] },
        ],
      },
      szoveg: (
        <p>
          Egy <M>{`L = ${szK(L, 1)}\\ \\text{m}`}</M> hosszú vízszintes gerendát három rúd támaszt meg: az 1. rúd a bal végén (<M>{"A"}</M>, <M>{"x = 0"}</M>), a 2. rúd a jobb végén (<M>{"B"}</M>, <M>{`x = ${szK(L, 1)}`}</M> m),
          mindkettő függőleges, {fent ? "a gerenda fölötti mennyezethez" : "a gerenda alatti talajhoz"} csatlakozik. A 3. rúd a <M>{`C(${szK(xC, 1)};\\ 0)`}</M> pontban csatlakozik a gerendához, másik vége a{" "}
          <M>{`D(${szK(xD, 1)};\\ ${szK(s * h, 1)})`}</M> pont (méterben, az <M>{"A"}</M> pontból mért koordináták, <M>{"y"}</M> felfelé). Terhek: <M>{`F = ${F}\\ \\text{kN}`}</M> az{" "}
          <M>{`x_F = ${szK(xF, 1)}`}</M> m helyen, {jobbra ? "jobbra" : "balra"}-lefelé, a vízszintessel <M>{`\\alpha = ${alfa}^\\circ`}</M>-ot bezárva; <M>{`G = ${G}\\ \\text{kN}`}</M> függőlegesen lefelé az{" "}
          <M>{`x_G = ${szK(xG, 1)}`}</M> m helyen. Számítsd ki a három rúderőt (húzott = pozitív)!
        </p>
      ),
      abra: (
        <TartoRajz
          xMax={L}
          tamaszok={[
            { tipus: "rud", x: 0, xVeg: 0, yVeg: s * h, cimke: "S₁" },
            { tipus: "rud", x: L, xVeg: L, yVeg: s * h, cimke: "S₂" },
            { tipus: "rud", x: xC, xVeg: xD, yVeg: s * h, cimke: "S₃" },
          ]}
          erok={[
            { x: xF, F, szog: beta, cimke: `F = ${F} kN` },
            { x: xG, F: G, szog: -90, cimke: `G = ${G} kN` },
          ]}
          pontok={[
            { x: 0, cimke: "A", dy: s > 0 ? 22 : -10 },
            { x: L, cimke: "B", dy: s > 0 ? 22 : -10 },
            { x: xC, cimke: "C", dy: s > 0 ? 22 : -10 },
            { x: xD, y: s * h, cimke: "D", dx: 14, dy: 4 },
          ]}
        />
      ),
      sugo: (
        <p>
          Két rúd párhuzamos (függőleges), ezért a harmadikat a rájuk merőleges — vízszintes — vetületi egyenletből kapod. A két függőleges rúderő főpontja a másik két rúd hatásvonalának metszéspontja: <M>{"S_1"}</M>-hez <M>{"O_1 = S_2 \\cap S_3"}</M>{" "}
          (az <M>{"x = L"}</M> függőlegesen), <M>{"S_2"}</M>-höz <M>{"O_2 = S_1 \\cap S_3"}</M> (az <M>{"x = 0"}</M> függőlegesen).
        </p>
      ),
      oszlopok: 3,
      mezok: [
        { id: "s1", cimke: "S₁ (húzott +)", egyseg: "kN", helyes: S1, tizedes: 2 },
        { id: "s2", cimke: "S₂ (húzott +)", egyseg: "kN", helyes: S2, tizedes: 2 },
        { id: "s3", cimke: "S₃ (húzott +)", egyseg: "kN", helyes: S3, tizedes: 2 },
      ],
      megoldas: (
        <>
          <p>
            <strong>Elkülönítés:</strong> mindhárom rúderőt húzóerőként vesszük fel, a csatlakozási pontból a rúd másik vége felé: <M>{`S_1`}</M> és <M>{`S_2`}</M> {fent ? "felfelé" : "lefelé"}, <M>{"S_3"}</M> a{" "}
            <M>{"C \\to D"}</M> irányban. A 3. rúd hossza <M>{`\\ell_3 = \\sqrt{${szK(dx, 1)}^2 + ${szK(dy, 1)}^2} = ${szK(ell, 3)}`}</M> m, irányvektora{" "}
            <M>{`(${szK(u3[0], 4)};\\ ${szK(u3[1], 4)})`}</M>. A ferde teher komponensei: <M>{`F_x = ${jobbra ? "" : "-"}${F}\\cos ${alfa}^\\circ = ${szK(Fx, 3)}`}</M>,{" "}
            <M>{`F_y = -${F}\\sin ${alfa}^\\circ = ${szK(Fy, 3)}`}</M> kN.
          </p>
          <MB>{"(\\underline{F}, \\underline{G}, \\underline{S}_1, \\underline{S}_2, \\underline{S}_3) \\ekv \\underline{O}"}</MB>
          <p>
            <M>{"S_1"}</M> és <M>{"S_2"}</M> párhuzamosak (függőlegesek), ezért a rájuk merőleges vetületi egyenletben csak <M>{"S_3"}</M> szerepel:
          </p>
          <MB>{`\\Fx ${tagE(Fx, 3)} + ${szK(u3[0], 4)}\\cdot S_3 = 0 \\;\\Rightarrow\\; S_3 = ${szK(S3, 2)}\\ \\text{kN}`}</MB>
          <p>
            Az <M>{"S_1"}</M> főpontja <M>{`O_1(${szK(L, 1)};\\ ${szK(y1, 3)})`}</M> — itt metszi az <M>{"S_3"}</M> hatásvonala az <M>{"x = L"}</M> függőlegest, mert{" "}
            <M>{`y_1 = (L - x_C)\\,\\frac{${szK(dy, 1)}}{${szK(dx, 1)}}`}</M>. Az <M>{"S_2"}</M> főpontja <M>{`O_2(0;\\ ${szK(y2, 3)})`}</M>. A nyomatéki egyenletekbe a ferde erő mindkét komponense bekerül (a vízszintes karja a főpont{" "}
            <M>{"y"}</M> koordinátája):
          </p>
          <MB>{`\\Mp{O_1} ${tag(xF - L, Fy, 1, 3)} ${tag(y1, Fx, 3, 3)} ${tag(xG - L, -G)} ${s > 0 ? "-" : "+"} ${szK(L, 1)}\\cdot S_1 = 0 \\;\\Rightarrow\\; S_1 = ${szK(S1, 2)}\\ \\text{kN}`}</MB>
          <MB>{`\\Mp{O_2} ${tag(xF, Fy, 1, 3)} ${tag(y2, Fx, 3, 3)} ${tag(xG, -G)} ${s > 0 ? "+" : "-"} ${szK(L, 1)}\\cdot S_2 = 0 \\;\\Rightarrow\\; S_2 = ${szK(S2, 2)}\\ \\text{kN}`}</MB>
          <p>Ellenőrzés a függőleges vetületi egyenlettel (minden erő ismert):</p>
          <MB>{`\\Fy ${tagE(s * S1, 2)} ${tagE(s * S2, 2)} ${tagE(S3 * u3[1], 2)} ${tagE(Fy, 2)} - ${G} = ${szK(ellFy, 2)} \\approx 0 \\;\\checkmark`}</MB>
          <p className="mt-2 text-[13px] text-petrol-600">
            Előjelek: <M>{`S_1 ${S1 >= 0 ? "> 0" : "< 0"}`}</M> → az 1. rúd {S1 >= 0 ? "húzott" : "nyomott"}; <M>{`S_2 ${S2 >= 0 ? "> 0" : "< 0"}`}</M> → {S2 >= 0 ? "húzott" : "nyomott"};{" "}
            <M>{`S_3 ${S3 >= 0 ? "> 0" : "< 0"}`}</M> → {S3 >= 0 ? "húzott" : "nyomott"}. Az eredményvázlaton a nyomott rudak erejét fordított nyíllal, pozitív számmal rajzoljuk.
          </p>
        </>
      ),
    };
  }
  return haromRudFeladat();
}

/* ============================================================
   8. Felborulás-ellenőrzés: mekkora erőnél emelkedik fel a görgő?
   ============================================================ */

function felborulasFeladat() {
  const L = fel(3, 6);
  const c = fel(1.5, 3); // bal oldali konzol hossza
  const p = egesz(2, 6);
  const Q = p * L;
  const xQ = L / 2;
  const F1 = egesz(0, 1) ? egesz(4, 12) : 0; // néha egy második állandó teher
  const xF1 = fel(0.5, L - 0.5);
  const MA = xQ * Q + xF1 * F1; // az állandó terhek ↷ nyomatéka A-ra
  const Fhatar = MA / c;
  // egy konkrét F₀, hol a határ alatt, hol felette
  const F0 = Math.max(1, Math.round(Fhatar * valaszt([0.6, 0.8, 1.2, 1.5])));
  const B0 = (MA - c * F0) / L;
  const Ay0 = Q + F1 + F0 - B0;

  return {
    adat: {
      ismeretlenek: [
        { id: "ax", pont: [0, 0], irany: [1, 0] },
        { id: "ay0", pont: [0, 0], irany: [0, 1] },
        { id: "b0", pont: [L, 0], irany: [0, 1] },
      ],
      terhek: [
        { pont: [xQ, 0], F: [0, -Q] },
        { pont: [xF1, 0], F: [0, -F1] },
        { pont: [-c, 0], F: [0, -F0] },
      ],
    },
    szoveg: (
      <p>
        Egy kéttámaszú tartó támaszköze <M>{`L = ${szK(L, 1)}\\ \\text{m}`}</M> (<M>{"A"}</M> csukló balra, <M>{"B"}</M> görgő jobbra), és a csuklón túl balra <M>{`c = ${szK(c, 1)}\\ \\text{m}`}</M> hosszú konzolja van. A támaszok közötti
        szakaszon egyenletesen megoszló <M>{`p = ${p}\\ \\text{kN/m}`}</M> teher hat{F1 ? <>, és az <M>{`x = ${szK(xF1, 1)}`}</M> m helyen egy <M>{`F_1 = ${F1}\\ \\text{kN}`}</M> függőleges erő is</> : null}. A konzol végén egy{" "}
        <M>{"F"}</M> nagyságú, lefelé mutató erő áll. Mekkora <M>{"F_{\\text{határ}}"}</M> erőnél lesz a görgő reakciója éppen nulla (a görgő éppen felemelkedne)? Mekkora <M>{"B"}</M>, ha <M>{`F = F_0 = ${F0}\\ \\text{kN}`}</M>?
        (<M>{"B"}</M> felfelé pozitív.)
      </p>
    ),
    abra: (
      <TartoRajz
        xMin={-c}
        xMax={L}
        tamaszok={[
          { tipus: "csuklo", x: 0, cimke: "A" },
          { tipus: "gorgo", x: L, cimke: "B" },
        ]}
        megoszlok={[{ x1: 0, x2: L, p, cimke: `p = ${p} kN/m` }]}
        erok={[{ x: -c, F: F0, szog: -90, cimke: "F" }, ...(F1 ? [{ x: xF1, F: F1, szog: -90, cimke: `F₁ = ${F1} kN` }] : [])]}
      />
    ),
    sugo: (
      <p>
        Írd fel a csuklóra a nyomatéki egyenletet <M>{"F"}</M>-fel mint paraméterrel: a konzolon álló erő a csuklótól balra van, ezért a többi teherrel <em>ellentétesen</em> forgat. <M>{"B = 0"}</M> akkor, ha a két
        forgatás kiegyenlíti egymást: <M>{"c\\,F = \\sum x_i F_i"}</M>.
      </p>
    ),
    mezok: [
      { id: "fh", cimke: "F_határ", egyseg: "kN", helyes: Fhatar, tizedes: 2 },
      { id: "b0", cimke: "B, ha F = F₀ (felfelé +)", egyseg: "kN", helyes: B0, tizedes: 2 },
    ],
    megoldas: (
      <>
        <p>
          <strong>Elkülönítés:</strong> <M>{"A_x"}</M> jobbra, <M>{"A_y"}</M> felfelé, <M>{"B"}</M> felfelé; a megoszló teher eredője <M>{`Q = ${p}\\cdot ${szK(L, 1)} = ${szK(Q, 2)}`}</M> kN a szakasz felezőpontjában (<M>{`x_Q = ${szK(xQ, 2)}`}</M> m).
        </p>
        <MB>{`(\\underline{F}, \\underline{Q}${F1 ? ", \\underline{F}_1" : ""}, \\underline{A}, \\underline{B}) \\ekv \\underline{O}`}</MB>
        <p>Nyomatéki egyenlet a csuklóra — az <M>{"F"}</M> erő a csuklótól balra, tehát az óramutatóval ellentétesen (pozitívan) forgat:</p>
        <MB>{`\\Mp{A} ${tag(xQ, -Q, 2, 2)}${F1 ? ` ${tag(xF1, -F1)}` : ""} + ${szK(c, 1)}\\cdot F + ${szK(L, 1)}\\cdot B = 0 \\;\\Rightarrow\\; B = \\frac{${szK(MA, 2)} - ${szK(c, 1)}\\,F}{${szK(L, 1)}}`}</MB>
        <p>A görgő akkor emelkedik fel, ha <M>{"B"}</M> előjelet vált. A határon <M>{"B = 0"}</M>:</p>
        <MB>{`${szK(c, 1)}\\,F_{\\text{határ}} = ${szK(MA, 2)} \\;\\Rightarrow\\; F_{\\text{határ}} = \\frac{${szK(MA, 2)}}{${szK(c, 1)}} = ${szK(Fhatar, 2)}\\ \\text{kN}`}</MB>
        <p>
          Az adott <M>{`F_0 = ${F0}`}</M> kN-nal:
        </p>
        <MB>{`B = \\frac{${szK(MA, 2)} - ${szK(c, 1)}\\cdot ${F0}}{${szK(L, 1)}} = ${szK(B0, 2)}\\ \\text{kN}`}</MB>
        <MB>{`\\Mp{B} ${tag(L - xQ, Q, 2, 2)}${F1 ? ` ${tag(L - xF1, F1)}` : ""} ${tag(L + c, F0, 1)} - ${szK(L, 1)}\\cdot A_y = 0 \\;\\Rightarrow\\; A_y = ${szK(Ay0, 2)}\\ \\text{kN}`}</MB>
        <p>Ellenőrzés: <M>{`\\Fy ${tagE(Ay0, 2)} ${tagE(B0, 2)} - ${szK(Q, 2)}${F1 ? ` - ${F1}` : ""} - ${F0} = ${szK(Ay0 + B0 - Q - F1 - F0, 2)} \\approx 0\\ \\checkmark`}</M></p>
        <p className="mt-2 text-[13px] text-petrol-600">
          {B0 < 0
            ? `F₀ nagyobb a határerőnél, ezért B negatív jött ki: a görgő csak nyomni tud, lefelé húzni nem — a tartó az A csukló körül felborulna. A valóságban ilyenkor lehorgonyzás kell, vagy ellensúly.`
            : `F₀ kisebb a határerőnél, B pozitív: a görgő még a talajra támaszkodik, a tartó áll. A tartalék a határig ${sz(Fhatar - F0, 2)} kN.`}
        </p>
      </>
    ),
  };
}

/* ============================================================
   9. Ismeretlenek és egyenletek száma
   ============================================================ */

const KENYSZEREK = {
  csuklo: { nev: "csukló", fok: 2, tobbes: "csukló" },
  gorgo: { nev: "görgő", fok: 1, tobbes: "görgő" },
  rud: { nev: "támasztórúd", fok: 1, tobbes: "támasztórúd" },
  befogas: { nev: "befogás", fok: 3, tobbes: "befogás" },
};

function szamlalasFeladat() {
  const valtozatok = [
    ["csuklo", "gorgo"],
    ["csuklo", "gorgo", "gorgo"],
    ["csuklo", "rud"],
    ["befogas"],
    ["befogas", "gorgo"],
    ["gorgo", "gorgo", "rud"],
    ["rud", "rud", "rud"],
    ["gorgo", "gorgo"],
    ["csuklo", "csuklo"],
    ["gorgo", "rud"],
    ["befogas", "csuklo"],
    ["csuklo", "gorgo", "rud"],
    ["gorgo", "gorgo", "gorgo", "gorgo"],
  ];
  const kenyszerek = valaszt(valtozatok);
  const fokok = kenyszerek.map((k) => KENYSZEREK[k].fok);
  const n = fokok.reduce((s, f) => s + f, 0);
  const e = 3;
  const L = 6;
  // elrendezés a rajzhoz: a kényszereket a tartó mentén egyenletesen elosztjuk (befogás a végre)
  const db = kenyszerek.length;
  const xs = db === 1 ? [0] : kenyszerek.map((_, i) => (i * L) / (db - 1));
  const tamaszok = kenyszerek.map((k, i) => {
    const x = xs[i];
    const cimke = "ABCD"[i];
    if (k === "befogas") return { tipus: "befogas", x, irany: x === 0 ? "bal" : "jobb", cimke };
    if (k === "rud") return { tipus: "rud", x, xVeg: x + (x < L / 2 ? 1.2 : -1.2), yVeg: -1.6, cimke: `S${"₁₂₃₄"[i]}` };
    return { tipus: k, x, cimke };
  });
  const lista = kenyszerek.map((k, i) => `${"ABCD"[i]}: ${KENYSZEREK[k].nev}`);
  const osszefoglalo = (() => {
    const szamlalo = {};
    kenyszerek.forEach((k) => (szamlalo[k] = (szamlalo[k] || 0) + 1));
    const szavak = { 1: "egy", 2: "két", 3: "három", 4: "négy" };
    return Object.entries(szamlalo)
      .map(([k, c]) => `${szavak[c]} ${KENYSZEREK[k].tobbes}`)
      .join(" és ");
  })();
  const itelet = n < e ? "mechanizmus" : n === e ? "határozott" : "határozatlan";

  return {
    adat: { szamlalas: true },
    szoveg: (
      <p>
        Egy vízszintes gerendát <strong>{osszefoglalo}</strong> támaszt meg ({lista.join(", ")}). Hány ismeretlen reakció(komponens) jelenik meg az elkülönítéskor, és hány független
        egyensúlyi egyenlet írható fel síkban? Ebből: határozott-e a tartó?
      </p>
    ),
    abra: <TartoRajz xMax={L} tamaszok={tamaszok} meretek={false} />,
    sugo: (
      <p>
        Az ismeretlenek száma a kényszerek fokszámainak összege: görgő 1, rúd 1, csukló 2, befogás 3. Síkbeli erőrendszerre mindig <strong>három</strong> független egyensúlyi egyenlet van, függetlenül attól, hány támasz van.
      </p>
    ),
    mezok: [
      { id: "n", cimke: "ismeretlenek száma", egyseg: "", helyes: n, tizedes: 0, tures: 0.1 },
      { id: "e", cimke: "független egyenletek száma", egyseg: "", helyes: e, tizedes: 0, tures: 0.1 },
    ],
    megoldas: (
      <>
        <p>
          <strong>Elkülönítés:</strong> minden támaszt a fokszámának megfelelő számú reakcióra cserélünk — {kenyszerek.map((k, i) => (
            <span key={i}>
              {i > 0 ? "; " : ""}
              {"ABCD"[i]} {KENYSZEREK[k].nev}: {k === "csuklo" ? <><M>{`${"ABCD"[i]}_x`}</M>, <M>{`${"ABCD"[i]}_y`}</M></> : k === "befogas" ? <><M>{`${"ABCD"[i]}_x`}</M>, <M>{`${"ABCD"[i]}_y`}</M>, <M>{`M_${"ABCD"[i]}`}</M></> : k === "rud" ? <M>{`S_${i + 1}`}</M> : <M>{`${"ABCD"[i]}`}</M>}{" "}
              ({KENYSZEREK[k].fok})
            </span>
          ))}
          .
        </p>
        <MB>{`n = ${fokok.join(" + ")} = ${n},\\qquad e = 3\\ \\ (\\textstyle\\sum F_{ix},\\ \\sum F_{iy},\\ \\sum M_i^{(O)})`}</MB>
        <p>
          {itelet === "határozott" && (
            <>
              <M>{"n = e = 3"}</M>: a három egyenletből a három ismeretlen egyértelműen kiszámolható — a tartó <strong>statikailag határozott</strong> (feltéve, hogy a kényszerek elrendezése nem degenerált, pl. három
              görgő reakciója nem megy át egy ponton; ezt a 7. fejezet vizsgálja).
            </>
          )}
          {itelet === "mechanizmus" && (
            <>
              <M>{`n = ${n} < 3`}</M>: kevesebb kényszer van, mint ahány mozgáslehetőség — a test valamerre el tud mozdulni, ez <strong>nem tartó, hanem mechanizmus</strong>. Az egyenletrendszer általános teher mellett
              ellentmondásos (nincs egyensúly).
            </>
          )}
          {itelet === "határozatlan" && (
            <>
              <M>{`n = ${n} > 3`}</M>: több az ismeretlen, mint az egyenlet — a tartó <strong>statikailag határozatlan</strong>, a fölös <M>{`${n - 3}`}</M> ismeretlent az egyensúlyi egyenletekből nem lehet kiszámolni, ehhez a
              tartó alakváltozását is figyelembe kellene venni (ez már nem a Statika tárgya).
            </>
          )}
        </p>
      </>
    ),
  };
}

export const EXTRA_GENERATOROK = [
  { cim: "Kéttámaszú tartó ferde görgővel", fn: ferdeGorgoFeladat },
  { cim: "Három rúddal megtámasztott gerenda", fn: haromRudFeladat },
  { cim: "Felborulás-ellenőrzés: mikor emelkedik fel a görgő?", fn: felborulasFeladat },
  { cim: "Ismeretlenek és egyenletek száma", fn: szamlalasFeladat },
];

export default function GyakorloExtra() {
  return (
    <>
      <GyakorloDoboz cim="Kéttámaszú tartó ferde görgővel" leiras="A tankönyv 4.5.a ábrája számokkal: a görgőerő nem függőleges, és az A_x-nek is van főpontja." generator={ferdeGorgoFeladat} oszlopok={3} />
      <GyakorloDoboz cim="Három rúddal megtámasztott gerenda" leiras="A tankönyv 4.8.c ábrája: két párhuzamos rúd — az egyiket vetületi, a másik kettőt főpontra írt nyomatéki egyenletből." generator={haromRudFeladat} oszlopok={3} />
      <GyakorloDoboz cim="Felborulás-ellenőrzés: mikor emelkedik fel a görgő?" leiras="Konzolon álló erő: a reakció előjele dönti el, áll-e még a tartó." generator={felborulasFeladat} />
      <GyakorloDoboz cim="Ismeretlenek és egyenletek száma" leiras="A H04/5 feladat szellemében: fokszámok összege kontra három egyenlet." generator={szamlalasFeladat} />
    </>
  );
}
