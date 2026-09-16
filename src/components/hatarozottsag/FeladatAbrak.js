"use client";

/**
 * A 8. modul kidolgozott feladatainak ábrái — a rajzolható szerkezet-leírásból (SzerkezetRajz).
 * A szerkezeteket exportáljuk is, hogy a filmek és a kalkulátor ugyanazt használják.
 */

import SzerkezetRajz, { Jelveny, SZINEK } from "./SzerkezetRajz";
import { kinematika } from "@/lib/hatarozottsag";
import { TartoHegyek } from "@/components/tartok/TartoElemek";

const FOK = Math.PI / 180;

/* ---------- GYF‑1: három görgő (7.4.b) és három párhuzamos görgő (7.7.a) ---------- */
export const GYF1_JO = {
  testek: [{ pontok: [[0, 0], [6, 0]] }],
  kenyszerek: [
    { tipus: "gorgo", test: 0, x: 0, y: 0, szog: 45 },
    { tipus: "gorgo", test: 0, x: 3, y: 0, szog: 90 },
    { tipus: "gorgo", test: 0, x: 6, y: 0, szog: 90 },
  ],
  terhek: [
    { test: 0, x: 4.5, y: 0, Fx: 0, Fy: -10, cimke: "F = 10 kN" },
    { test: 0, x: 3, y: 0, Fx: -2, Fy: 0, cimke: "H = 2 kN" },
  ],
};
export const GYF1_ROSSZ = { ...GYF1_JO, kenyszerek: GYF1_JO.kenyszerek.map((k) => ({ ...k, szog: 90 })) };

/* ---------- GYF‑2: H04/5 a) és b) ---------- */
export const GYF2_A = {
  testek: [{ pontok: [[0, 0], [0, 3]] }, { pontok: [[0, 3], [-3, 1.5]] }],
  kenyszerek: [
    { tipus: "befogas", test: 0, x: 0, y: 0, irany: "le" },
    { tipus: "belsoCsuklo", testek: [0, 1], x: 0, y: 3 },
    { tipus: "belsoRud", testA: 0, xA: 0, yA: 1.5, testB: 1, xB: -1.5, yB: 2.25 },
  ],
  terhek: [{ test: 1, x: -3, y: 1.5, Fx: 0, Fy: -10, cimke: "F" }],
};
export const GYF2_B = {
  testek: [{ pontok: [[0, 0], [0, 3]] }, { pontok: [[0, 3], [3, 1.5]] }],
  kenyszerek: [
    { tipus: "csuklo", test: 0, x: 0, y: 0 },
    { tipus: "gorgo", test: 1, x: 3, y: 1.5, szog: 90 },
    { tipus: "belsoCsuklo", testek: [0, 1], x: 0, y: 3 },
    { tipus: "belsoRud", testA: 0, xA: 0, yA: 1.5, testB: 1, xB: 1.5, yB: 2.25 },
  ],
  terhek: [{ test: 1, x: 2, y: 2, Fx: 10 * Math.cos(-60 * FOK), Fy: 10 * Math.sin(-60 * FOK), cimke: "F" }],
};

/* ---------- GYF‑3: Gerber-tartó jó és rossz csuklóhelyekkel ---------- */
export const GYF3_JO = {
  testek: [{ pontok: [[0, 0], [6, 0]] }, { pontok: [[6, 0], [10, 0]] }, { pontok: [[10, 0], [12, 0]] }],
  kenyszerek: [
    { tipus: "csuklo", test: 0, x: 0, y: 0 },
    { tipus: "gorgo", test: 0, x: 4, y: 0, szog: 90 },
    { tipus: "gorgo", test: 1, x: 8, y: 0, szog: 90 },
    { tipus: "gorgo", test: 2, x: 12, y: 0, szog: 90 },
    { tipus: "belsoCsuklo", testek: [0, 1], x: 6, y: 0 },
    { tipus: "belsoCsuklo", testek: [1, 2], x: 10, y: 0 },
  ],
  terhek: [
    { test: 0, x: 2, y: 0, Fx: 0, Fy: -12, cimke: "F₁ = 12 kN" },
    { test: 2, x: 11, y: 0, Fx: 0, Fy: -6, cimke: "F₂ = 6 kN" },
  ],
};
export const GYF3_ROSSZ = {
  testek: [{ pontok: [[0, 0], [1.5, 0]] }, { pontok: [[1.5, 0], [3, 0]] }, { pontok: [[3, 0], [12, 0]] }],
  kenyszerek: [
    { tipus: "csuklo", test: 0, x: 0, y: 0 },
    { tipus: "gorgo", test: 2, x: 4, y: 0, szog: 90 },
    { tipus: "gorgo", test: 2, x: 8, y: 0, szog: 90 },
    { tipus: "gorgo", test: 2, x: 12, y: 0, szog: 90 },
    { tipus: "belsoCsuklo", testek: [0, 1], x: 1.5, y: 0 },
    { tipus: "belsoCsuklo", testek: [1, 2], x: 3, y: 0 },
  ],
  terhek: [{ test: 1, x: 2.25, y: 0, Fx: 0, Fy: -12, cimke: "F₁" }],
};

/* ---------- GYF‑4: keretek ---------- */
const KERET_TERHEK = [
  { test: 0, x: 1.5, y: 4, Fx: 0, Fy: -10, cimke: "F" },
  { test: 0, x: 0, y: 4, Fx: 6, Fy: 0, cimke: "H" },
];
export const GYF4_HAROMCSUKLOS = {
  testek: [{ pontok: [[0, 0], [0, 4], [3, 4]] }, { pontok: [[3, 4], [6, 4], [6, 0]] }],
  kenyszerek: [
    { tipus: "csuklo", test: 0, x: 0, y: 0 },
    { tipus: "csuklo", test: 1, x: 6, y: 0 },
    { tipus: "belsoCsuklo", testek: [0, 1], x: 3, y: 4 },
  ],
  terhek: KERET_TERHEK,
};
export const GYF4_KETCSUKLOS = {
  testek: [{ pontok: [[0, 0], [0, 4], [6, 4], [6, 0]] }],
  kenyszerek: [
    { tipus: "csuklo", test: 0, x: 0, y: 0 },
    { tipus: "csuklo", test: 0, x: 6, y: 0 },
  ],
  terhek: KERET_TERHEK,
};
export const GYF4_BEFOGOTT = {
  testek: [{ pontok: [[0, 0], [0, 4], [6, 4], [6, 0]] }],
  kenyszerek: [
    { tipus: "befogas", test: 0, x: 0, y: 0, irany: "le" },
    { tipus: "befogas", test: 0, x: 6, y: 0, irany: "le" },
  ],
  terhek: KERET_TERHEK,
};
export const GYF4_NEGYCSUKLOS = {
  testek: [{ pontok: [[0, 0], [0, 4]] }, { pontok: [[0, 4], [6, 4]] }, { pontok: [[6, 4], [6, 0]] }],
  kenyszerek: [
    { tipus: "csuklo", test: 0, x: 0, y: 0 },
    { tipus: "csuklo", test: 2, x: 6, y: 0 },
    { tipus: "belsoCsuklo", testek: [0, 1], x: 0, y: 4 },
    { tipus: "belsoCsuklo", testek: [1, 2], x: 6, y: 4 },
  ],
  terhek: [{ test: 1, x: 1.5, y: 4, Fx: 0, Fy: -10, cimke: "F" }, { test: 0, x: 0, y: 4, Fx: 6, Fy: 0, cimke: "H" }],
};

/* ---------- GYF‑6: három rúd egy ponton át (7.7.d) és a javított változat ---------- */
export const GYF6_KRITIKUS = {
  testek: [{ pontok: [[0, 2], [4, 2]] }],
  kenyszerek: [
    { tipus: "rud", test: 0, x: 0, y: 2, irany: [0, -1] },
    { tipus: "rud", test: 0, x: 2, y: 2, irany: [-1, -1] },
    { tipus: "rud", test: 0, x: 4, y: 2, irany: [-2, -1] },
  ],
  terhek: [{ test: 0, x: 3, y: 2, Fx: 0, Fy: -10, cimke: "F = 10 kN" }],
};
export const GYF6_JO = {
  ...GYF6_KRITIKUS,
  kenyszerek: [GYF6_KRITIKUS.kenyszerek[0], GYF6_KRITIKUS.kenyszerek[1], { tipus: "rud", test: 0, x: 4, y: 2, irany: [-3, -2] }],
};

/* ---------- GYF‑7: háromtámaszú tartó ---------- */
export const GYF7 = {
  testek: [{ pontok: [[0, 0], [8, 0]] }],
  kenyszerek: [
    { tipus: "csuklo", test: 0, x: 0, y: 0 },
    { tipus: "gorgo", test: 0, x: 4, y: 0, szog: 90 },
    { tipus: "gorgo", test: 0, x: 8, y: 0, szog: 90 },
  ],
  terhek: [{ test: 0, x: 2, y: 0, Fx: 0, Fy: -12, cimke: "F = 12 kN" }],
};

/** Két szerkezet egymás mellett, jelvénnyel (a GYF-ek „jó / rossz” párjaihoz). */
export function ParosAbra({ bal, jobb, balCim, jobbCim, magassag = 250, reakciokBal, reakciokJobb, cimkekBal, cimkekJobb, meretek }) {
  const it = (sz) => kinematika(sz);
  const ib = it(bal);
  const ij = it(jobb);
  const szin = (i) => (i.tipus === "hatarozott" ? SZINEK.zold : i.tipus === "hatarozatlan" ? SZINEK.lila : SZINEK.bordo);
  const felirat = (i) => (i.tipus === "hatarozott" ? `e = ${i.e} = i · határozott` : i.tipus === "hatarozatlan" ? `i − e = ${i.folos} · határozatlan` : i.kritikus ? `e = i = ${i.e}, mégis mozog` : `e = ${i.e} > i = ${i.i} · mozog`);
  return (
    <svg viewBox={`0 0 600 ${magassag}`} className="abra w-full h-auto select-none">
      <TartoHegyek />
      <SzerkezetRajz szerkezet={bal} csoport eltolas={[0, 0]} szelesseg={300} magassag={magassag} margo={{ bal: 40, jobb: 30, fel: 64, le: 78 }} tamaszMeret={11} reakciok={reakciokBal} cimkek={cimkekBal} />
      <SzerkezetRajz szerkezet={jobb} csoport eltolas={[300, 0]} szelesseg={300} magassag={magassag} margo={{ bal: 30, jobb: 40, fel: 64, le: 78 }} tamaszMeret={11} reakciok={reakciokJobb} cimkek={cimkekJobb} />
      <line x1="300" y1="16" x2="300" y2={magassag - 12} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />
      {balCim && (
        <text x="150" y="20" textAnchor="middle" fontSize="12" fontWeight="700" style={{ fill: "#1d3c48" }}>
          {balCim}
        </text>
      )}
      {jobbCim && (
        <text x="450" y="20" textAnchor="middle" fontSize="12" fontWeight="700" style={{ fill: "#1d3c48" }}>
          {jobbCim}
        </text>
      )}
      <Jelveny x={150} y={magassag - 16} szoveg={felirat(ib)} szin={szin(ib)} w={Math.max(150, 8.2 * felirat(ib).length)} />
      <Jelveny x={450} y={magassag - 16} szoveg={felirat(ij)} szin={szin(ij)} w={Math.max(150, 8.2 * felirat(ij).length)} />
      {meretek}
    </svg>
  );
}

/** Egy szerkezet nagyban, jelvénnyel. */
export function EgyAbra({ sz, magassag = 260, reakciok, cimkek, jelveny = true, extra }) {
  const i = kinematika(sz);
  const szin = i.tipus === "hatarozott" ? SZINEK.zold : i.tipus === "hatarozatlan" ? SZINEK.lila : SZINEK.bordo;
  const felirat = i.tipus === "hatarozott" ? `e = ${i.e} = i · határozott` : i.tipus === "hatarozatlan" ? `i − e = ${i.folos} · ${i.folos}-szeresen határozatlan` : i.kritikus ? `e = i = ${i.e}, mégis mozog` : `e = ${i.e} > i = ${i.i} · mozog`;
  return (
    <SzerkezetRajz
      szerkezet={sz}
      szelesseg={600}
      magassag={magassag}
      margo={{ bal: 70, jobb: 70, fel: 60, le: 70 }}
      reakciok={reakciok}
      cimkek={cimkek}
      extra={(kx, ky, lp, helyzet) => (
        <>
          {jelveny && <Jelveny x={300} y={magassag - 20} szoveg={felirat} szin={szin} w={Math.max(180, 8.2 * felirat.length)} />}
          {extra ? extra(kx, ky, lp, helyzet) : null}
        </>
      )}
    />
  );
}

export function AbraGyf1() {
  return <ParosAbra bal={GYF1_JO} jobb={GYF1_ROSSZ} balCim="a) A ferde, B és C vízszintes síkon gördül" jobbCim="b) mindhárom görgő vízszintes síkon" />;
}
export function AbraGyf2() {
  return <ParosAbra bal={GYF2_A} jobb={GYF2_B} balCim="a) befogott oszlop, csukló + rúd" jobbCim="b) csuklós oszlop, görgős gerenda" magassag={280} cimkekBal={["A"]} cimkekJobb={["A", "B"]} />;
}
export function AbraGyf3() {
  return <ParosAbra bal={GYF3_JO} jobb={GYF3_ROSSZ} balCim="a) csuklók a 2. és 3. mezőben" jobbCim="b) mindkét csukló az 1. mezőben" magassag={230} cimkekBal={["A", "B", "C", "D"]} cimkekJobb={["A", "B", "C", "D"]} />;
}
export function AbraGyf4() {
  return (
    <svg viewBox="0 0 600 480" className="abra w-full h-auto select-none">
      <TartoHegyek />
      {[
        [GYF4_HAROMCSUKLOS, 0, 0, "a) háromcsuklós keret"],
        [GYF4_KETCSUKLOS, 300, 0, "b) kétcsuklós keret"],
        [GYF4_BEFOGOTT, 0, 240, "c) befogott keret"],
        [GYF4_NEGYCSUKLOS, 300, 240, "d) négy csukló"],
      ].map(([sz, ox, oy, cim]) => {
        const i = kinematika(sz);
        const szin = i.tipus === "hatarozott" ? SZINEK.zold : i.tipus === "hatarozatlan" ? SZINEK.lila : SZINEK.bordo;
        const felirat = i.tipus === "hatarozott" ? `e = i = ${i.e} · határozott` : i.tipus === "hatarozatlan" ? `i − e = ${i.folos} · határozatlan` : `e = ${i.e} > i = ${i.i} · mozog`;
        return (
          <g key={cim}>
            <SzerkezetRajz szerkezet={sz} csoport eltolas={[ox, oy]} szelesseg={300} magassag={240} margo={{ bal: 56, jobb: 44, fel: 96, le: 74 }} tamaszMeret={11} cimkek={["A", "B"]} />
            <text x={ox + 150} y={oy + 20} textAnchor="middle" fontSize="12" fontWeight="700" style={{ fill: "#1d3c48" }}>
              {cim}
            </text>
            <Jelveny x={ox + 150} y={oy + 226} szoveg={felirat} szin={szin} w={Math.max(150, 8.2 * felirat.length)} />
          </g>
        );
      })}
      <line x1="300" y1="10" x2="300" y2="470" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />
      <line x1="10" y1="240" x2="590" y2="240" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />
    </svg>
  );
}
export function AbraGyf6() {
  return (
    <ParosAbra
      bal={GYF6_KRITIKUS}
      jobb={GYF6_JO}
      balCim="a) mindhárom rúd az A ponton át"
      jobbCim="b) a 3. rúd a D pontba vezet"
      magassag={260}
      cimkekBal={["1", "2", "3"]}
      cimkekJobb={["1", "2", "3"]}
    />
  );
}
export function AbraGyf7({ reakciok }) {
  return <EgyAbra sz={GYF7} magassag={230} reakciok={reakciok} cimkek={["A", "B", "C"]} />;
}
