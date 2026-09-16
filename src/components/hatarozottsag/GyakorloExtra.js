"use client";

import GyakorloDoboz from "@/components/GyakorloDoboz";
import { M, MB } from "@/components/ui/Keplet";
import { szK } from "@/lib/szamok";
import SzerkezetRajz from "./SzerkezetRajz";
import { TartoHegyek } from "@/components/tartok/TartoElemek";

/* ============================================================
   Közös segédek (a GyakorloSzekcio is innen importál)
   ============================================================ */

export const egesz = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
export const valaszt = (t) => t[Math.floor(Math.random() * t.length)];
export const fel = (min, max) => egesz(Math.round(min * 2), Math.round(max * 2)) / 2;

/** Statikus szerkezet-rajz a gyakorló feladatokhoz. */
export function SzerkezetAbra({ sz, magassag = 230, cimkek, tamaszMeret = 12 }) {
  return <SzerkezetRajz szerkezet={sz} szelesseg={600} magassag={magassag} margo={{ bal: 70, jobb: 70, fel: 56, le: 66 }} cimkek={cimkek} tamaszMeret={tamaszMeret} />;
}

/** Egyszerű rácsos tartó rajza (csomópontok, rudak, támaszok) a gyakorláshoz. */
export function RacsAbra({ csomopontok, rudak, tamaszok, magassag = 230 }) {
  const xs = csomopontok.map((c) => c.x);
  const ys = csomopontok.map((c) => c.y);
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yMin = Math.min(...ys);
  const yMax = Math.max(...ys);
  const L = Math.min(480 / Math.max(1, xMax - xMin), (magassag - 120) / Math.max(1, yMax - yMin));
  const kx = (x) => 300 + (x - (xMin + xMax) / 2) * L;
  const ky = (y) => magassag - 70 - (y - yMin) * L;
  const cs = (id) => csomopontok.find((c) => c.id === id);
  return (
    <svg viewBox={`0 0 600 ${magassag}`} className="abra w-full h-auto select-none">
      <TartoHegyek />
      {rudak.map((r) => {
        const a = cs(r.a);
        const b = cs(r.b);
        return <line key={r.id} x1={kx(a.x)} y1={ky(a.y)} x2={kx(b.x)} y2={ky(b.y)} stroke="#1d3c48" strokeWidth="4" strokeLinecap="round" />;
      })}
      {tamaszok.map((t, i) => {
        const c = cs(t.csomopont);
        const X = kx(c.x);
        const Y = ky(c.y);
        return (
          <g key={i}>
            {t.tipus === "csuklo" ? (
              <>
                <path d={`M ${X} ${Y + 3} L ${X - 11} ${Y + 18} L ${X + 11} ${Y + 18} Z`} fill="white" stroke="#475569" strokeWidth="1.5" />
                <line x1={X - 16} y1={Y + 18} x2={X + 16} y2={Y + 18} stroke="#475569" strokeWidth="1.4" />
              </>
            ) : (
              <>
                <path d={`M ${X} ${Y + 3} L ${X - 11} ${Y + 16} L ${X + 11} ${Y + 16} Z`} fill="white" stroke="#475569" strokeWidth="1.5" />
                <circle cx={X - 6} cy={Y + 20} r="3" fill="white" stroke="#475569" strokeWidth="1.3" />
                <circle cx={X + 6} cy={Y + 20} r="3" fill="white" stroke="#475569" strokeWidth="1.3" />
                <line x1={X - 16} y1={Y + 24} x2={X + 16} y2={Y + 24} stroke="#475569" strokeWidth="1.4" />
              </>
            )}
            <text x={X} y={Y + 40} textAnchor="middle" fontSize="12" fontStyle="italic" fontWeight="650" style={{ fill: "#1d3c48" }}>
              {t.tipus === "csuklo" ? "csukló" : "görgő"}
            </text>
          </g>
        );
      })}
      {csomopontok.map((c) => (
        <circle key={c.id} cx={kx(c.x)} cy={ky(c.y)} r="4" fill="white" stroke="#0f172a" strokeWidth="1.8" />
      ))}
    </svg>
  );
}

/* ============================================================
   7. Térbeli szerkezet: 6 egyenlet testenként
   ============================================================ */
const TER_KENYSZEREK = [
  { nev: "térbeli csukló (gömbcsukló)", fok: 3 },
  { nev: "térbeli befogás", fok: 6 },
  { nev: "támasztórúd", fok: 1 },
  { nev: "görgő (egy irányt gátol)", fok: 1 },
  { nev: "hengeres csukló (5 fokú)", fok: 5 },
];
function terbeliFeladat() {
  const testek = valaszt([1, 1, 2]);
  const db = testek === 1 ? egesz(2, 4) : egesz(3, 5);
  const lista = Array.from({ length: db }, () => valaszt(TER_KENYSZEREK));
  const belso = testek === 2 ? valaszt([{ nev: "térbeli belső csukló", fok: 3 }, { nev: "belső rúd", fok: 1 }, { nev: "két belső rúd", fok: 2 }]) : null;
  const e = 6 * testek;
  const i = lista.reduce((s, k) => s + k.fok, 0) + (belso ? belso.fok : 0);
  const kul = i - e;
  const osszefoglal = lista.reduce((m, k) => ({ ...m, [k.nev]: (m[k.nev] || 0) + 1 }), {});
  return {
    szoveg: (
      <p>
        Térbeli szerkezet: <M>{`${testek}`}</M> merev test, külső kényszerek: {Object.entries(osszefoglal).map(([n, d], j, arr) => (
          <span key={n}>
            {d} db {n}
            {j < arr.length - 1 ? ", " : ""}
          </span>
        ))}
        {belso ? <>; a két testet {belso.nev} kapcsolja</> : null}. Hány független egyensúlyi egyenlet írható, hány az ismeretlen, és mennyi az <M>{"i - e"}</M> különbség?
      </p>
    ),
    sugo: <p>Térben egy merev testre 6 független egyenlet írható (3 vetületi + 3 nyomatéki). A gömbcsukló 3, a befogás 6, a rúd 1 ismeretlent hoz; a térbeli belső csukló 3-at.</p>,
    oszlopok: 3,
    mezok: [
      { id: "e", cimke: "e (egyenletek)", egyseg: "", helyes: e, tizedes: 0 },
      { id: "i", cimke: "i (ismeretlenek)", egyseg: "", helyes: i, tizedes: 0 },
      { id: "k", cimke: "i − e", egyseg: "", helyes: kul, tizedes: 0 },
    ],
    megoldas: (
      <>
        <MB>{`e = 6\\cdot ${testek} = ${e},\\qquad i = ${lista.map((k) => k.fok).join(" + ")}${belso ? ` + ${belso.fok}` : ""} = ${i}`}</MB>
        <p>
          <M>{`i - e = ${kul}`}</M>: {kul === 0 ? "lehet határozott (a geometriát külön ellenőrizni kell)." : kul > 0 ? `legalább ${kul}-szeresen határozatlan.` : `legalább ${-kul} szabad mozgás — biztosan nem tartó.`}
        </p>
      </>
    ),
  };
}

/* ============================================================
   8. Rácsos tartó: hány rúd hiányzik vagy fölös?
   ============================================================ */
function racsosHianyFeladat() {
  const c = egesz(6, 14);
  const k = valaszt([3, 3, 4, 2]);
  const kell = 2 * c - k;
  const r = kell + valaszt([-2, -1, 0, 1, 2, 3]);
  const kul = kell - r;
  return {
    szoveg: (
      <p>
        Egy síkbeli rácsos tartónak <M>{`c = ${c}`}</M> csomópontja és <M>{`r = ${r}`}</M> rúdja van, a külső kényszerek összfokszáma <M>{`k = ${k}`}</M>. Hány rudat kellene hozzáadni (pozitív szám) vagy elvenni (negatív), hogy a határozottság szükséges feltétele teljesüljön? Mennyi a <M>{"2c"}</M> és az{" "}
        <M>{"r + k"}</M>?
      </p>
    ),
    sugo: <p>Csomópontonként két egyenlet: e = 2c; ismeretlenek: r + k. A szükséges feltétel 2c = r + k.</p>,
    oszlopok: 3,
    mezok: [
      { id: "e", cimke: "2c", egyseg: "", helyes: 2 * c, tizedes: 0 },
      { id: "i", cimke: "r + k", egyseg: "", helyes: r + k, tizedes: 0 },
      { id: "d", cimke: "hozzáadandó rudak (+/−)", egyseg: "", helyes: kul, tizedes: 0 },
    ],
    megoldas: (
      <>
        <MB>{`2c = ${2 * c},\\qquad r + k = ${r} + ${k} = ${r + k},\\qquad 2c - (r + k) = ${kul}`}</MB>
        <p>
          {kul > 0 ? `${kul} rúd hiányzik (túlhatározott: legalább ${kul} szabad mozgás).` : kul < 0 ? `${-kul} rúd fölös (legalább ${-kul}-szeresen határozatlan).` : "A számlálás rendben — a geometriát (háromszögekből építhetőség, támaszok) még ellenőrizni kell."}{" "}
          {k < 3 ? "Figyelem: k < 3 — a külső kényszerek önmagukban sem elegendők, az egész rács elmozdulhat." : ""}
        </p>
      </>
    ),
  };
}

/* ============================================================
   9. Határozatlan feladat egy szabad paraméterrel (háromtámaszú tartó)
   ============================================================ */
function parameteresFeladat() {
  const L = valaszt([6, 8, 9, 10]);
  const xB = valaszt([L / 2, L / 3, (2 * L) / 3].map((v) => Math.round(v * 2) / 2));
  const F = egesz(6, 20);
  let xF = fel(0.5, L - 0.5);
  if (Math.abs(xF - xB) < 0.5) xF = xB + 1 <= L - 0.5 ? xB + 1 : xB - 1;
  const B = valaszt([0, egesz(1, F), egesz(1, F)]);
  const C = (F * xF - B * xB) / L;
  const Ay = F - B - C;
  const sz = {
    testek: [{ pontok: [[0, 0], [L, 0]] }],
    kenyszerek: [
      { tipus: "csuklo", test: 0, x: 0, y: 0 },
      { tipus: "gorgo", test: 0, x: xB, y: 0, szog: 90 },
      { tipus: "gorgo", test: 0, x: L, y: 0, szog: 90 },
    ],
    terhek: [{ test: 0, x: xF, y: 0, Fx: 0, Fy: -F, cimke: `F = ${F} kN` }],
  };
  return {
    szoveg: (
      <p>
        Háromtámaszú tartó: <M>{"A"}</M> csukló (<M>{"x = 0"}</M>), <M>{"B"}</M> görgő (<M>{`x = ${szK(xB, 1)}`}</M> m), <M>{"C"}</M> görgő (<M>{`x = ${L}`}</M> m); teher <M>{`F = ${F}\\ \\text{kN}`}</M> lefelé az <M>{`x = ${szK(xF, 1)}`}</M> m helyen. A tartó egyszeresen határozatlan: a{" "}
        <M>{"B"}</M> reakciót szabad paraméternek tekintjük. Ha <M>{`B = ${B}\\ \\text{kN}`}</M> (felfelé), mekkora <M>{"A_y"}</M> és <M>{"C"}</M>?
      </p>
    ),
    abra: <SzerkezetAbra sz={sz} magassag={200} cimkek={["A", "B", "C"]} />,
    sugo: (
      <p>
        Az egyensúlyi egyenletek egy egyparaméteres megoldássereget adnak: <M>{"\\Mp{A}"}</M>-ból <M>{"C"}</M> a <M>{"B"}</M> függvényében, <M>{"\\Fy"}</M>-ból <M>{"A_y"}</M>. A tényleges <M>{"B"}</M>-t a merevség dönti el — itt csak a statikát kérjük.
      </p>
    ),
    mezok: [
      { id: "ay", cimke: "A_y (felfelé +)", egyseg: "kN", helyes: Ay, tizedes: 2 },
      { id: "c", cimke: "C (felfelé +)", egyseg: "kN", helyes: C, tizedes: 2 },
    ],
    megoldas: (
      <>
        <MB>{"(\\underline{F}, \\underline{A}, \\underline{B}, \\underline{C}) \\ekv \\underline{O},\\qquad e = 3 < i = 4"}</MB>
        <MB>{`\\Mp{A} -${F}\\cdot ${szK(xF, 1)} + ${szK(xB, 1)}\\,B + ${L}\\,C = 0 \\;\\Rightarrow\\; C = \\frac{${szK(F * xF, 1)} - ${szK(xB, 1)}\\cdot ${B}}{${L}} = ${szK(C, 2)}\\ \\text{kN}`}</MB>
        <MB>{`\\Fy A_y + ${B} + ${szK(C, 2)} - ${F} = 0 \\;\\Rightarrow\\; A_y = ${szK(Ay, 2)}\\ \\text{kN}`}</MB>
        <p className="mt-2 text-[13px] text-petrol-600">
          {B === 0 ? "B = 0: ez éppen a kéttámaszú törzstartó megoldása." : `Más B-hez más A_y és C tartozik — a megoldás nem egyértelmű, a tartó minden feladata statikailag határozatlan.`} {C < 0 ? "C negatív: a görgőnek lefelé kellene tartania — egyoldali görgő felemelkedne." : ""}
        </p>
      </>
    ),
  };
}

export const EXTRA_GENERATOROK = [
  { cim: "Térbeli szerkezet: 6 egyenlet testenként", fn: terbeliFeladat },
  { cim: "Rácsos tartó: hány rúd hiányzik vagy fölös?", fn: racsosHianyFeladat },
  { cim: "Határozatlan feladat egy szabad paraméterrel", fn: parameteresFeladat },
];

export default function GyakorloExtra() {
  return (
    <>
      <GyakorloDoboz cim="Térbeli szerkezet: 6 egyenlet testenként" leiras="Ugyanaz a számlálás térben: testenként hat egyenlet, a kényszerek fokszáma más." generator={terbeliFeladat} oszlopok={3} />
      <GyakorloDoboz cim="Rácsos tartó: hány rúd hiányzik vagy fölös?" leiras="2c = r + k a topológiából — és hogy hány rúd kell még." generator={racsosHianyFeladat} oszlopok={3} />
      <GyakorloDoboz cim="Határozatlan feladat egy szabad paraméterrel" leiras="A tankönyv 7.5: a fölös reakció paraméter, a többi az egyensúlyból." generator={parameteresFeladat} />
    </>
  );
}
