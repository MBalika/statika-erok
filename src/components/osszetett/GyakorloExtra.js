"use client";

import GyakorloDoboz from "@/components/GyakorloDoboz";
import { M, MB } from "@/components/ui/Keplet";
import { sz, szK } from "@/lib/szamok";
import { TartoHegyek, Tarto, Gorgo, Csuklo, Befogas, Rud, BelsoCsuklo, TeherNyil, MegoszloTeher, Meret, MeretFugg, TamaszCimke, SZIN } from "@/components/tartok/TartoElemek";
import { gerberSzamit, haromcsuklosSzamit, ruddalKapcsoltSzamit } from "./szamitas";

/* ============================================================
   Közös segédek a 6. modul gyakorló generátoraihoz (a GyakorloSzekcio is innen importál)
   ============================================================ */

export const egesz = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
export const valaszt = (tomb) => tomb[Math.floor(Math.random() * tomb.length)];
export const fel = (min, max) => egesz(Math.round(min * 2), Math.round(max * 2)) / 2;
/** Előjeles szorzat-tag: „+ 2·10” / „− 4,5·6”. */
export function tag(kar, ero, tizKar = 1, tizEro = 0) {
  const v = kar * ero;
  return `${v < 0 ? "-" : "+"} ${szK(Math.abs(kar), tizKar)}\\cdot ${szK(Math.abs(ero), tizEro)}`;
}
export function tagE(ero, tiz = 0) {
  return `${ero < 0 ? "-" : "+"} ${szK(Math.abs(ero), tiz)}`;
}
/** Méretlánc a rajz aljára a megadott x-koordináták (támaszok, erők, csuklók) rendezett sorából. */
export function meretLanc(xk) {
  const s = [...new Set(xk.map((x) => Math.round(x * 1000) / 1000))].sort((a, b) => a - b);
  return s.slice(1).map((x, i) => ({ x1: s[i], x2: x, cimke: sz(x - s[i], 1) }));
}
const KEK = "#2563eb";

/**
 * Általános összetett-tartó rajz méterben megadott adatokból (automatikus lépték, 600 px széles).
 *   rudak: [[x1,y1,x2,y2]]  tamaszok: [{x,y,tipus,cimke,szog?,irany?}]  csuklok: [[x,y,cimke?]]
 *   rudElemek: [[x1,y1,x2,y2,cimke]] (támasztórudak)  erok: [{x,y,F,szog,cimke}]  megoszlok: [{x1,x2,y,p,cimke}]
 *   vizszintesMegoszlo: {x, y1, y2, p, cimke} (oszlopon, jobbra)  pontok: [{x,y,cimke,dx,dy}]  testek: [{x,y,cimke}]
 *   meretek: [{x1,x2,cimke}] (a rajz alján)  fuggMeretek: [{y1,y2,cimke}] (a rajz jobb szélén)
 */
export function OsszetettRajz({ rudak = [], tamaszok = [], csuklok = [], rudElemek = [], erok = [], megoszlok = [], vizszintesMegoszlo = null, pontok = [], testek = [], meretek = [], fuggMeretek = [] }) {
  const xs = [...rudak.flatMap((r) => [r[0], r[2]]), ...rudElemek.flatMap((r) => [r[0], r[2]])];
  const ys = [...rudak.flatMap((r) => [r[1], r[3]]), ...rudElemek.flatMap((r) => [r[1], r[3]])];
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const szel = Math.max(1, maxX - minX), mag = maxY - minY;
  const leptek = 5;
  // bal/jobb margó: az oszlopon lévő vízszintes teher feliratának, ill. a függőleges méretvonalnak is jusson hely a 600 px-en belül
  const balMargo = vizszintesMegoszlo ? vizszintesMegoszlo.p * leptek + 92 : 65;
  const jobbMargo = fuggMeretek.length ? 112 : 65;
  const PX = Math.min(70, (600 - balMargo - jobbMargo) / szel, mag > 0 ? 170 / mag : 70);
  const OX = balMargo + (600 - balMargo - jobbMargo - PX * szel) / 2 - minX * PX;
  const OY = 0;
  const kx = (x) => OX + x * PX;
  const ky = (y) => OY - (y - maxY) * PX;
  let fent = ky(maxY) - 100;
  let lent = ky(minY) + 60;

  const elemek = [];
  const feliratDobozok = []; // a már elhelyezett feliratok téglalapjai (ütközés-elkerüléshez)
  const metszi = (a, b) => a.x1 < b.x2 && b.x1 < a.x2 && a.y1 < b.y2 && b.y1 < a.y2;
  tamaszok.forEach((t, i) => {
    const x = kx(t.x), y = ky(t.y);
    if (t.tipus === "csuklo") elemek.push(<Csuklo key={`t${i}`} x={x} y={y} />);
    else if (t.tipus === "gorgo") elemek.push(<Gorgo key={`t${i}`} x={x} y={y} szog={t.szog ?? 0} />);
    else if (t.tipus === "befogas") elemek.push(<Befogas key={`t${i}`} x={x} y={y} irany={t.irany ?? "jobb"} hossz={48} />);
    if (t.cimke) {
      const cx = x + (t.tipus === "befogas" ? 14 : 0) + (t.dx ?? 0), cy = y + (t.dy ?? 44);
      feliratDobozok.push({ x1: cx - 7, x2: cx + 7, y1: cy - 13, y2: cy + 3 });
      elemek.push(<TamaszCimke key={`tc${i}`} x={cx} y={cy}>{t.cimke}</TamaszCimke>);
    }
  });
  /** A megoszló teher feliratának helye: a szakasz három jelölt pontja közül az, amelyik a legtávolabb esik a csuklók betűitől és az erőktől. */
  const megoszloCimkeX = (mm) => {
    const w = mm.x2 - mm.x1;
    const jeloltek = [mm.x1 + 0.5 * w, mm.x1 + 0.25 * w, mm.x2 - 0.25 * w];
    const tav = (x) => Math.min(Infinity, ...csuklok.filter((c) => c[2]).map((c) => Math.abs(c[0] - x)), ...erok.map((e) => Math.abs(e.x - x)));
    return jeloltek.reduce((legjobb, x) => (tav(x) > tav(legjobb) + 1e-9 ? x : legjobb), jeloltek[0]);
  };
  megoszlok.forEach((mm, i) => {
    elemek.push(
      <g key={`m${i}`}>
        <MegoszloTeher x1={kx(mm.x1)} x2={kx(mm.x2)} y={ky(mm.y ?? 0) - 3} p1={mm.p} leptek={leptek} />
        {mm.cimke && (
          <text x={kx(megoszloCimkeX(mm))} y={ky(mm.y ?? 0) - 3 - mm.p * leptek - 8} textAnchor="middle" fontSize="12.5" fontWeight="650" style={{ fill: SZIN.teher, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
            {mm.cimke}
          </text>
        )}
      </g>,
    );
  });
  if (vizszintesMegoszlo) {
    const v = vizszintesMegoszlo;
    const n = Math.max(3, Math.round(((v.y2 - v.y1) * PX) / 20));
    const ny = [];
    for (let k = 0; k <= n; k++) {
      const y = ky(v.y1 + ((v.y2 - v.y1) * k) / n);
      ny.push(<line key={k} x1={kx(v.x) - v.p * leptek - 2} y1={y} x2={kx(v.x) - 4} y2={y} stroke={SZIN.teher} strokeWidth="1.5" markerEnd="url(#th-teher)" />);
    }
    elemek.push(
      <g key="vm">
        <line x1={kx(v.x) - v.p * leptek - 2} y1={ky(v.y1)} x2={kx(v.x) - v.p * leptek - 2} y2={ky(v.y2)} stroke={SZIN.teher} strokeWidth="1.4" />
        {ny}
        <text x={kx(v.x) - v.p * leptek - 8} y={ky((v.y1 + v.y2) / 2) + 4} textAnchor="end" fontSize="12.5" fontWeight="650" style={{ fill: SZIN.teher, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
          {v.cimke}
        </text>
      </g>,
    );
  }
  rudak.forEach((r, i) => elemek.push(<Tarto key={`r${i}`} x1={kx(r[0])} y1={ky(r[1])} x2={kx(r[2])} y2={ky(r[3])} />));
  rudElemek.forEach((r, i) =>
    elemek.push(
      <g key={`re${i}`}>
        <Rud x1={kx(r[0])} y1={ky(r[1])} x2={kx(r[2])} y2={ky(r[3])} />
        {r[4] && (
          <text x={(kx(r[0]) + kx(r[2])) / 2 + 8} y={(ky(r[1]) + ky(r[3])) / 2 - 6} fontSize="12.5" fontStyle="italic" fontWeight="650" style={{ fill: KEK, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
            {r[4].includes("_") ? (
              <>
                {r[4].split("_")[0]}
                <tspan dy="4" fontSize="9.5">{r[4].split("_")[1]}</tspan>
              </>
            ) : r[4]}
          </text>
        )}
      </g>,
    ),
  );
  erok.forEach((e, i) => {
    const rad = (e.szog * Math.PI) / 180;
    let h = Math.min(80, 36 + 2.2 * Math.abs(e.F));
    const fugg = Math.abs(Math.cos(rad)) < 1e-6;
    const szeles = 6.4 * (e.cimke?.length ?? 4);
    let eltolas = fugg ? [6, -4] : Math.cos(rad) > 0 ? [-szeles - 4, -4] : [8, -4];
    const X = kx(e.x), Y = ky(e.y ?? 0) - (Math.sin(rad) < 0 ? 3 : -3);
    // ferde erő felirata: ha a rajz szélén kilógna, a farok másik oldalára kerül
    const farokX = X - h * Math.cos(rad);
    if (!fugg && farokX + eltolas[0] < 2) eltolas = [8, -4];
    else if (!fugg && farokX + eltolas[0] + szeles > 598) eltolas = [-szeles - 4, -4];
    const doboz = (el) => {
      const x1 = X - h * Math.cos(rad) + el[0], y1 = Y + h * Math.sin(rad) + el[1];
      return { x1, x2: x1 + szeles, y1: y1 - 13, y2: y1 + 3 };
    };
    // függőleges nyílnál a felirat jobbra, ha ott ütközne (vagy kilógna), balra; ha egyik sem jó, a nyilat hosszabbra vesszük és újra próbáljuk
    const jeloltek = fugg ? [[6, -4], [-szeles - 6, -4]] : [eltolas];
    let d = null;
    for (let k = 0; k < 4 && !d; k++) {
      const jo = jeloltek.find((el) => { const dd = doboz(el); return dd.x1 >= 2 && dd.x2 <= 598 && !feliratDobozok.some((b) => metszi(b, dd)); });
      if (jo) { eltolas = jo; d = doboz(jo); }
      else if (!fugg) d = doboz(eltolas);
      else h += 26;
    }
    if (!d) d = doboz(eltolas);
    feliratDobozok.push(d);
    fent = Math.min(fent, d.y1 - 8);
    elemek.push(<TeherNyil key={`e${i}`} x={X} y={Y} hossz={h} szog={e.szog} cimke={e.cimke} cimkeEltolas={eltolas} />);
  });
  csuklok.forEach((c, i) => {
    elemek.push(<BelsoCsuklo key={`c${i}`} x={kx(c[0])} y={ky(c[1])} />);
    // a csukló betűje a rúd fölé kerül; ha ott megoszló teher fut, a rúd alá
    const teherFolotte = megoszlok.some((mm) => c[0] >= mm.x1 - 1e-9 && c[0] <= mm.x2 + 1e-9 && Math.abs((mm.y ?? 0) - c[1]) < 1e-9);
    if (c[2]) elemek.push(<TamaszCimke key={`cc${i}`} x={kx(c[0])} y={ky(c[1]) + (teherFolotte ? 22 : -12)}>{c[2]}</TamaszCimke>);
  });
  pontok.forEach((p, i) => elemek.push(<TamaszCimke key={`p${i}`} x={kx(p.x) + (p.dx ?? 0)} y={ky(p.y ?? 0) + (p.dy ?? -10)}>{p.cimke}</TamaszCimke>));
  const testY = testek.map((t) => {
    // ha a test-címke egy támaszbetűre esne, 20 px-szel lejjebb tesszük
    let y = ky(t.y);
    const d = () => ({ x1: kx(t.x) - 11, x2: kx(t.x) + 11, y1: y - 10, y2: y + 5 });
    if (feliratDobozok.some((b) => metszi(b, d()))) y += 20;
    return y;
  });
  testek.forEach((t, i) =>
    elemek.push(
      <g key={`te${i}`}>
        <rect x={kx(t.x) - 11} y={testY[i] - 10} width={22} height={15} rx="3" fill="white" stroke="#334155" strokeWidth="1.2" />
        <text x={kx(t.x)} y={testY[i] + 1.5} textAnchor="middle" fontSize="10.5" fontWeight="700" style={{ fill: "#334155" }}>{t.cimke}</text>
      </g>,
    ),
  );
  if (meretek.length) {
    // a méretvonal a test-címkék alá kerüljön (a címke doboza y − 10 … + 5)
    const testAlja = Math.max(-Infinity, ...testY.map((y) => y + 5));
    const yM = Math.max(ky(minY) + 66, testAlja + 22);
    meretek.forEach((mm, i) => elemek.push(<Meret key={`me${i}`} x1={kx(mm.x1)} x2={kx(mm.x2)} y={yM} cimke={mm.cimke} />));
    lent = yM + 14;
  }
  fuggMeretek.forEach((fm, i) => elemek.push(<MeretFugg key={`fm${i}`} x={kx(maxX) + 48} y1={ky(fm.y1)} y2={ky(fm.y2)} cimke={fm.cimke} />));

  return (
    <div className="racs-vilagos overflow-hidden rounded-xl border border-[color:var(--keret)] p-2">
      <svg viewBox={`0 ${fent} 600 ${lent - fent + 10}`} className="abra mx-auto h-auto w-full max-w-xl">
        <TartoHegyek />
        {elemek}
      </svg>
    </div>
  );
}

/* ============================================================
   7. Gerber-tartó egyenletes teherrel — a csuklóerő és a három reakció
   ============================================================ */
function gerberMegoszloFeladat() {
  const L1 = fel(3, 6), L2 = fel(1, 3), L3 = fel(2, 5);
  const xB = L1, xC = L1 + L2, xD = xC + L3;
  const p = egesz(2, 8);
  const QI = p * xC, xQI = xC / 2;
  const QII = p * L3, xQII = xC + L3 / 2;
  const r = gerberSzamit({ xB, xC, xD, terhekI: [{ x: xQI, y: 0, Fx: 0, Fy: -QI }], terhekII: [{ x: xQII, y: 0, Fx: 0, Fy: -QII }] });
  return {
    adat: { gerber: true, par: { xB, xC, xD, p } },
    szoveg: (
      <p>
        Gerber-tartó: <M>{"A"}</M> csukló (<M>{"x = 0"}</M>), <M>{"B"}</M> görgő (<M>{`x = ${szK(xB, 1)}`}</M> m), <M>{"C"}</M> belső csukló (<M>{`x = ${szK(xC, 1)}`}</M> m), <M>{"D"}</M> görgő (
        <M>{`x = ${szK(xD, 1)}`}</M> m). A teljes hosszon <M>{`p = ${p}\\ \\text{kN/m}`}</M> egyenletesen megoszló teher hat lefelé. Számítsd ki a <M>{"C"}</M>-ben átadódó csuklóerőt (a II. testre, felfelé pozitív) és a három
        függőleges reakciót!
      </p>
    ),
    abra: (
      <OsszetettRajz
        rudak={[[0, 0, xD, 0]]}
        tamaszok={[{ x: 0, y: 0, tipus: "csuklo", cimke: "A" }, { x: xB, y: 0, tipus: "gorgo", cimke: "B" }, { x: xD, y: 0, tipus: "gorgo", cimke: "D" }]}
        csuklok={[[xC, 0, "C"]]}
        megoszlok={[{ x1: 0, x2: xD, p, cimke: `p = ${p} kN/m` }]}
        testek={[{ x: xC / 2, y: -1, cimke: "I" }, { x: xC + L3 / 2, y: -1, cimke: "II" }]}
        meretek={[{ x1: 0, x2: xB, cimke: sz(L1, 1) }, { x1: xB, x2: xC, cimke: sz(L2, 1) }, { x1: xC, x2: xD, cimke: sz(L3, 1) }]}
      />
    ),
    sugo: (
      <p>
        A II. test (<M>{"C"}</M>–<M>{"D"}</M>) egy <M>{`${szK(L3, 1)}`}</M> m-es kéttámaszú tartó egyenletes teherrel: a csuklóerő és <M>{"D"}</M> egyaránt a fele a rajta lévő tehernek. Az I. testre ezután a saját
        terhe <em>és</em> a <M>{"C"}</M>-ben lefelé ható csuklóerő hat — a megoszló terhet az eredőjével helyettesítsd (<M>{"Q = p\\,\\ell"}</M> a szakasz közepén), de csak a testre eső részét!
      </p>
    ),
    oszlopok: 4,
    mezok: [
      { id: "cy", cimke: "C_y (a II. testre, ↑ +)", egyseg: "kN", helyes: r.Cy, tizedes: 2 },
      { id: "d", cimke: "D (↑ +)", egyseg: "kN", helyes: r.D, tizedes: 2 },
      { id: "b", cimke: "B (↑ +)", egyseg: "kN", helyes: r.B, tizedes: 2 },
      { id: "ay", cimke: "A_y (↑ +)", egyseg: "kN", helyes: r.Ay, tizedes: 2 },
    ],
    megoldas: (
      <>
        <p>
          <strong>Elkülönítés:</strong> a II. test terhe <M>{`Q_{II} = ${p}\\cdot ${szK(L3, 1)} = ${szK(QII, 2)}`}</M> kN a <M>{"C"}</M>–<M>{"D"}</M> szakasz közepén; az I. test terhe{" "}
          <M>{`Q_I = ${p}\\cdot ${szK(xC, 1)} = ${szK(QI, 2)}`}</M> kN az <M>{`x = ${szK(xQI, 2)}`}</M> m helyen. A csuklóban a II. testre <M>{"C_x, C_y"}</M>, az I.-re az ellentettjük.
        </p>
        <MB>{"\\text{II:}\\ (\\underline{Q}_{II}, \\underline{D}, \\underline{C}) \\ekv \\underline{O}\\qquad \\text{I:}\\ (\\underline{Q}_I, \\underline{A}, \\underline{B}, \\underline{C}') \\ekv \\underline{O}"}</MB>
        <MB>{`\\text{II:}\\ \\Mp{C}\\ ${tag(L3 / 2, -QII, 2, 2)} + ${szK(L3, 1)}\\cdot D = 0 \\;\\Rightarrow\\; D = ${szK(r.D, 2)}\\ \\text{kN}`}</MB>
        <MB>{`\\text{II:}\\ \\Mp{D}\\ ${tag(L3 / 2, QII, 2, 2)} - ${szK(L3, 1)}\\cdot C_y = 0 \\;\\Rightarrow\\; C_y = ${szK(r.Cy, 2)}\\ \\text{kN}\\qquad \\Fx\\ C_x = 0`}</MB>
        <p>Az I. testre a <M>{"C"}</M> pontban <M>{`${szK(r.Cy, 2)}`}</M> kN hat lefelé:</p>
        <MB>{`\\text{I:}\\ \\Mp{A}\\ ${tag(xQI, -QI, 2, 2)} ${tag(xC, -r.Cy, 1, 2)} + ${szK(xB, 1)}\\cdot B = 0 \\;\\Rightarrow\\; B = ${szK(r.B, 2)}\\ \\text{kN}`}</MB>
        <MB>{`\\text{I:}\\ \\Mp{B}\\ ${tag(xB - xQI, QI, 2, 2)} ${tag(xC - xB, -r.Cy, 1, 2)} - ${szK(xB, 1)}\\cdot A_y = 0 \\;\\Rightarrow\\; A_y = ${szK(r.Ay, 2)}\\ \\text{kN}`}</MB>
        <p>Ellenőrzés az egész szerkezetre (a csuklóerő kiesik):</p>
        <MB>{`\\Sigma:\\ \\Fy\\ ${tagE(r.Ay, 2)} ${tagE(r.B, 2)} ${tagE(r.D, 2)} - ${szK(p * xD, 2)} = ${szK(r.ellenorzes, 2)} \\approx 0\\ \\checkmark`}</MB>
        <p className="mt-2 text-[13px] text-petrol-600">
          {r.Ay < 0 ? "A_y negatív: a hosszú konzol és a befüggesztett rész terhe felemeli az A csuklót — az A-nak lefelé kell tartania." : "Mindhárom reakció felfelé mutat; a B görgő viszi a legtöbbet, mert rá két oldalról is jut teher."}
        </p>
      </>
    ),
  };
}
/* ============================================================
   8. Háromcsuklós keret vízszintes teherrel (H05/2 típus) — A_x, B_x sem nulla
   ============================================================ */
function haromcsuklosVizszintesFeladat() {
  const L = fel(6, 12), h = fel(3, 6);
  const xC = valaszt([fel(L / 2, L / 2), fel(Math.max(2, L / 2 - 2), L / 2 + 2)]);
  const p = egesz(2, 6);
  const F = egesz(6, 20);
  const xF = fel(1, L - 1);
  const R = p * h;
  const terhekI = [{ x: 0, y: h / 2, Fx: R, Fy: 0 }];
  const terhekII = [];
  (xF <= xC ? terhekI : terhekII).push({ x: xF, y: h, Fx: 0, Fy: -F });
  const r = haromcsuklosSzamit({ xB: L, yB: 0, xC, yC: h, terhekI, terhekII });
  const balOldalon = xF <= xC;
  return {
    adat: { harom: true, par: { L, h, xC, p, F, xF } },
    szoveg: (
      <p>
        Háromcsuklós keret: <M>{"A"}</M> csukló <M>{"(0;\\ 0)"}</M>, <M>{"B"}</M> csukló <M>{`(${szK(L, 1)};\\ 0)`}</M>, a gerenda <M>{`h = ${szK(h, 1)}`}</M> m magasan, a <M>{"C"}</M> belső csukló az{" "}
        <M>{`x = ${szK(xC, 1)}`}</M> m helyen. A bal oszlopot teljes magasságában jobbra nyomó <M>{`p = ${p}\\ \\text{kN/m}`}</M> teher, a gerendát az <M>{`x = ${szK(xF, 1)}`}</M> m helyen{" "}
        <M>{`F = ${F}\\ \\text{kN}`}</M> függőleges erő terheli. Számítsd ki a négy külső reakciót (<M>{"A_x, B_x"}</M> jobbra, <M>{"A_y, B_y"}</M> felfelé pozitív)!
      </p>
    ),
    abra: (
      <OsszetettRajz
        rudak={[[0, 0, 0, h], [0, h, L, h], [L, h, L, 0]]}
        tamaszok={[{ x: 0, y: 0, tipus: "csuklo", cimke: "A" }, { x: L, y: 0, tipus: "csuklo", cimke: "B" }]}
        csuklok={[[xC, h, "C"]]}
        vizszintesMegoszlo={{ x: 0, y1: 0, y2: h, p, cimke: `p = ${p} kN/m` }}
        erok={[{ x: xF, y: h, F, szog: -90, cimke: `F = ${F} kN` }]}
        testek={[{ x: 0.6, y: h * 0.45, cimke: "I" }, { x: L - 0.6, y: h * 0.45, cimke: "II" }]}
        meretek={meretLanc([0, xF, xC, L])}
        fuggMeretek={[{ y1: 0, y2: h, cimke: `h = ${sz(h, 1)}` }]}
      />
    ),
    sugo: (
      <p>
        Azonos magasságú támaszok: az egész szerkezetre <M>{"\\Mp{A}"}</M> → <M>{"B_y"}</M>, <M>{"\\Mp{B}"}</M> → <M>{"A_y"}</M> (a vízszintes reakciók hatásvonala átmegy mindkét ponton). A <M>{"p"}</M> teher eredője{" "}
        <M>{"R = p\\,h"}</M> a fél magasságban — nyomatéki karja a <em>magasság</em>! Utána a <M>{"C"}</M>-re írt nyomatéki egyenlet arra a testre, amelyen kevesebb a teher.
      </p>
    ),
    oszlopok: 4,
    mezok: [
      { id: "ay", cimke: "A_y (↑ +)", egyseg: "kN", helyes: r.Ay, tizedes: 2 },
      { id: "by", cimke: "B_y (↑ +)", egyseg: "kN", helyes: r.By, tizedes: 2 },
      { id: "bx", cimke: "B_x (→ +)", egyseg: "kN", helyes: r.Bx, tizedes: 2 },
      { id: "ax", cimke: "A_x (→ +)", egyseg: "kN", helyes: r.Ax, tizedes: 2 },
    ],
    megoldas: (
      <>
        <p>
          <strong>Elkülönítés:</strong> <M>{`R = p\\,h = ${p}\\cdot ${szK(h, 1)} = ${szK(R, 2)}`}</M> kN jobbra, <M>{`y = ${szK(h / 2, 2)}`}</M> m magasan; a csuklók helyére <M>{"A_x, A_y, B_x, B_y"}</M> és a{" "}
          <M>{"C"}</M>-ben az ellentett erőpár.
        </p>
        <MB>{"\\Sigma:\\ (\\underline{R}, \\underline{F}, \\underline{A}_x, \\underline{A}_y, \\underline{B}_x, \\underline{B}_y) \\ekv \\underline{O}"}</MB>
        <p>Az <M>{"R"}</M> a pont fölött jobbra hat: az óramutató irányába forgat (negatív), karja <M>{`${szK(h / 2, 2)}`}</M> m.</p>
        <MB>{`\\Sigma:\\ \\Mp{A}\\ ${tag(h / 2, -R, 2, 2)} ${tag(xF, -F)} + ${szK(L, 1)}\\cdot B_y = 0 \\;\\Rightarrow\\; B_y = ${szK(r.By, 2)}\\ \\text{kN}`}</MB>
        <MB>{`\\Sigma:\\ \\Mp{B}\\ ${tag(h / 2, -R, 2, 2)} ${tag(L - xF, F)} - ${szK(L, 1)}\\cdot A_y = 0 \\;\\Rightarrow\\; A_y = ${szK(r.Ay, 2)}\\ \\text{kN}`}</MB>
        <p>
          Nyomatéki egyenlet a <M>{"C"}</M>-re a {balOldalon ? "II." : "I."} testre (ott {balOldalon ? "nincs teher" : "csak R hat"}), a csuklóerő kiesik:
        </p>
        {balOldalon ? (
          <MB>{`\\text{II:}\\ \\Mp{C}\\ ${tag(L - xC, r.By, 1, 2)} + ${szK(h, 1)}\\cdot B_x = 0 \\;\\Rightarrow\\; B_x = ${szK(r.Bx, 2)}\\ \\text{kN}`}</MB>
        ) : (
          <MB>{`\\text{I:}\\ \\Mp{C}\\ ${tag(xC, -r.Ay, 1, 2)} ${tag(h / 2, R, 2, 2)} + ${szK(h, 1)}\\cdot A_x = 0 \\;\\Rightarrow\\; A_x = ${szK(r.Ax, 2)}\\ \\text{kN}`}</MB>
        )}
        <MB>{`\\Sigma:\\ \\Fx\\ ${szK(R, 2)} + A_x + B_x = 0 \\;\\Rightarrow\\; ${balOldalon ? `A_x = ${szK(r.Ax, 2)}` : `B_x = ${szK(r.Bx, 2)}`}\\ \\text{kN}`}</MB>
        <p>Ellenőrzés a másik testre írt nyomatéki egyenlettel a <M>{"C"}</M>-re (minden tag ismert): <M>{`${szK(r.ellenorzes, 2)} \\approx 0\\ \\checkmark`}</M></p>
        <p className="mt-2 text-[13px] text-petrol-600">
          Mindkét vízszintes reakció balra mutat (negatív): együtt tartják vissza az <M>{`${szK(R, 1)}`}</M> kN oldalnyomást. {r.Ay < 0 ? "A_y negatív: a vízszintes teher felbillentené a keretet az A oldalon." : ""}
        </p>
      </>
    ),
  };
}

/* ============================================================
   9. Egyetlen rúddal befüggesztett rész (tankönyv 5.6.c)
   ============================================================ */
function ruddalKapcsoltFeladat() {
  const xA = fel(0.5, 1.5), xB = xA + fel(3, 5), xP = xB + fel(1, 2.5);
  const h = fel(1.5, 3), xQ = xP + fel(1, 2.5), xD = xQ + fel(3, 6);
  const x1 = fel(xA + 0.5, xB - 0.5), F1 = egesz(6, 18);
  const x2 = fel(xQ + 0.5, xD - 0.5), F2 = egesz(6, 18);
  const r = ruddalKapcsoltSzamit({ xA, xB, xP, xQ, xD, h, x1, F1, x2, F2 });
  return {
    adat: { rud: true, par: { xA, xB, xP, xQ, xD, h, x1, F1, x2, F2 } },
    szoveg: (
      <p>
        Az I. gerenda (0-tól <M>{`${szK(xP, 1)}`}</M> m-ig) az <M>{"A"}</M> görgőn (<M>{`x = ${szK(xA, 1)}`}</M>) és a <M>{"B"}</M> csuklón (<M>{`x = ${szK(xB, 1)}`}</M>) áll. A <M>{"P"}</M> végéből{" "}
        <M>{"S"}</M> rúd megy a <M>{`Q(${szK(xQ, 1)};\\ ${szK(h, 1)})`}</M> pontba, ahol a II. gerenda kezdődik; a II. gerenda vízszintes, jobb végét a <M>{`D(${szK(xD, 1)};\\ ${szK(h, 1)})`}</M> csukló tartja.
        Terhek: <M>{`F_1 = ${F1}\\ \\text{kN}`}</M> az I. gerendán (<M>{`x = ${szK(x1, 1)}`}</M>), <M>{`F_2 = ${F2}\\ \\text{kN}`}</M> a II.-on (<M>{`x = ${szK(x2, 1)}`}</M>), mindkettő lefelé. Számítsd ki a rúderőt
        (húzott +) és a <M>{"D"}</M>, <M>{"B"}</M> reakciókat!
      </p>
    ),
    abra: (
      <OsszetettRajz
        rudak={[[0, 0, xP, 0], [xQ, h, xD, h]]}
        rudElemek={[[xP, 0, xQ, h, "S"]]}
        tamaszok={[{ x: xA, y: 0, tipus: "gorgo", cimke: "A" }, { x: xB, y: 0, tipus: "csuklo", cimke: "B" }, { x: xD, y: h, tipus: "csuklo", cimke: "D" }]}
        erok={[{ x: x1, y: 0, F: F1, szog: -90, cimke: `F₁ = ${F1} kN` }, { x: x2, y: h, F: F2, szog: -90, cimke: `F₂ = ${F2} kN` }]}
        pontok={[{ x: xP, y: 0, cimke: "P", dy: 20 }, { x: xQ, y: h, cimke: "Q", dx: -12, dy: -10 }]}
        testek={[{ x: (xA + xB) / 2, y: -0.6, cimke: "I" }, { x: xD - 1.5, y: h - 0.5, cimke: "II" }]}
        meretek={[{ x1: 0, x2: xA, cimke: sz(xA, 1) }, { x1: xA, x2: xB, cimke: sz(xB - xA, 1) }, { x1: xB, x2: xP, cimke: sz(xP - xB, 1) }, { x1: xP, x2: xQ, cimke: sz(xQ - xP, 1) }, { x1: xQ, x2: xD, cimke: sz(xD - xQ, 1) }]}
        fuggMeretek={[{ y1: 0, y2: h, cimke: `h = ${sz(h, 1)}` }]}
      />
    ),
    sugo: (
      <p>
        A II. test kényszerei: rúd (1) + csukló (2) = 3 → befüggesztett rész, vele kezdünk. A <M>{"D"}</M>-re írt nyomatéki egyenletben csak <M>{"S"}</M> marad — a rúderőt húzottnak, <M>{"Q \\to P"}</M> irányban vedd
        fel, és bontsd komponensekre a rúd hosszával. A rúd az I. testet <M>{"P"}</M>-ben az ellentett erővel terheli.
      </p>
    ),
    oszlopok: 4,
    mezok: [
      { id: "s", cimke: "S (húzott +)", egyseg: "kN", helyes: r.S, tizedes: 2 },
      { id: "dx", cimke: "D_x (→ +)", egyseg: "kN", helyes: r.Dx, tizedes: 2 },
      { id: "dy", cimke: "D_y (↑ +)", egyseg: "kN", helyes: r.Dy, tizedes: 2 },
      { id: "by", cimke: "B_y (↑ +)", egyseg: "kN", helyes: r.By, tizedes: 2 },
    ],
    megoldas: (
      <>
        <p>
          <strong>Elkülönítés:</strong> a rúd hossza <M>{`\\ell = \\sqrt{${szK(xQ - xP, 1)}^2 + ${szK(h, 1)}^2} = ${szK(r.l, 3)}`}</M> m, egységvektora <M>{"Q"}</M>-ból <M>{"P"}</M> felé{" "}
          <M>{`(${szK(r.e[0], 4)};\\ ${szK(r.e[1], 4)})`}</M>. A II. testre <M>{"S"}</M> a <M>{"Q"}</M> pontban ebben az irányban, <M>{"D_x, D_y"}</M> a csuklóban.
        </p>
        <MB>{"\\text{II:}\\ (\\underline{F}_2, \\underline{S}, \\underline{D}) \\ekv \\underline{O}\\qquad \\text{I:}\\ (\\underline{F}_1, \\underline{S}', \\underline{A}, \\underline{B}) \\ekv \\underline{O}"}</MB>
        <p>A <M>{"D"}</M>-re csak <M>{"S"}</M> függőleges komponense forgat (a vízszintes a gerenda tengelyében hat), karja <M>{`${szK(xD - xQ, 1)}`}</M> m:</p>
        <MB>{`\\text{II:}\\ \\Mp{D}\\ ${tag(x2 - xD, -F2)} + ${szK(xD - xQ, 1)}\\cdot ${szK(Math.abs(r.e[1]), 4)}\\cdot S = 0 \\;\\Rightarrow\\; S = ${szK(r.S, 2)}\\ \\text{kN}`}</MB>
        <MB>{`\\text{II:}\\ \\Fx\\ ${szK(r.e[0], 4)}\\,S + D_x = 0 \\;\\Rightarrow\\; D_x = ${szK(r.Dx, 2)};\\qquad \\Fy\\ ${szK(r.e[1], 4)}\\,S + D_y - ${F2} = 0 \\;\\Rightarrow\\; D_y = ${szK(r.Dy, 2)}\\ \\text{kN}`}</MB>
        <p>Az I. testre a rúd a <M>{"P"}</M> pontban az ellentett erővel hat: <M>{`S'_x = ${szK(r.Sx, 2)}`}</M>, <M>{`S'_y = ${szK(r.Sy, 2)}`}</M> kN.</p>
        <MB>{`\\text{I:}\\ \\Mp{B}\\ ${tag(x1 - xB, -F1)} ${tag(xP - xB, r.Sy, 1, 2)} - ${szK(xB - xA, 1)}\\cdot A = 0 \\;\\Rightarrow\\; A = ${szK(r.A, 2)}\\ \\text{kN}`}</MB>
        <MB>{`\\text{I:}\\ \\Fy\\ A + B_y - ${F1} ${tagE(r.Sy, 2)} = 0 \\;\\Rightarrow\\; B_y = ${szK(r.By, 2)};\\qquad \\Fx\\ B_x ${tagE(r.Sx, 2)} = 0 \\;\\Rightarrow\\; B_x = ${szK(r.Bx, 2)}\\ \\text{kN}`}</MB>
        <p className="mt-2 text-[13px] text-petrol-600">
          <M>{`S ${r.S < 0 ? "< 0" : "> 0"}`}</M>: a rúd {r.S < 0 ? "nyomott — alulról támasztja a II. gerendát" : "húzott"}. A rúderő vízszintes komponensét a <M>{"D"}</M> és a <M>{"B"}</M> csukló együtt egyensúlyozza.
        </p>
      </>
    ),
  };
}

export const EXTRA_GENERATOROK = [
  { cim: "Gerber-tartó egyenletes teherrel", fn: gerberMegoszloFeladat },
  { cim: "Háromcsuklós keret vízszintes teherrel", fn: haromcsuklosVizszintesFeladat },
  { cim: "Egyetlen rúddal befüggesztett rész", fn: ruddalKapcsoltFeladat },
];

export default function GyakorloExtra() {
  return (
    <>
      <GyakorloDoboz cim="Gerber-tartó egyenletes teherrel" leiras="A megoszló terhet testenként külön eredővel: a befüggesztett rész fele-fele, aztán a fix rész a csuklóerővel." generator={gerberMegoszloFeladat} oszlopok={4} />
      <GyakorloDoboz cim="Háromcsuklós keret vízszintes teherrel" leiras="H05/2 szellemében: az oldalnyomás miatt a vízszintes reakciók nem egyenlők és nem is nullák." generator={haromcsuklosVizszintesFeladat} oszlopok={4} />
      <GyakorloDoboz cim="Egyetlen rúddal befüggesztett rész" leiras="A tankönyv 5.6.c ábrája: a rúd + csukló megtámasztású rész a befüggesztett, a rúderő ellentettje terheli a fix részt." generator={ruddalKapcsoltFeladat} oszlopok={4} />
    </>
  );
}
