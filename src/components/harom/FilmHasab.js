"use client";

import FeladatFilm from "@/components/anim/FeladatFilm";
import { arany, lukteto } from "@/components/anim/Idovonal";
import { Jelenet3D, Nyil3D, Vonal3D, Cimke3D, Tengelyek3D, Racs3D } from "./Jelenet3D";

const A = 3.5, B = 3, C = 4;
const E = 0.42; // rajzhossz / N
const EROK = [
  { nev: "F₁", F: 7, tol: [0, B, 0], ir: [1, 0, 0], szin: "#e2590a" },
  { nev: "F₂", F: 6, tol: [A, B, 0], ir: [0, -1, 0], szin: "#0f766e" },
  { nev: "F₃", F: 8, tol: [A, 0, 0], ir: [0, 0, 1], szin: "#2563eb" },
  { nev: "F₄", F: 7, tol: [A, 0, C], ir: [-1, 0, 0], szin: "#be123c" },
  { nev: "F₅", F: 6, tol: [0, 0, C], ir: [0, 1, 0], szin: "#7c3aed" },
  { nev: "F₆", F: 8, tol: [0, B, C], ir: [0, 0, -1], szin: "#b45309" },
];
const ELHOSSZ = [A, B, C, A, B, C];
const M = [-48, -56, -42];
const MS = 1 / 17;

const FEJEZETEK = [
  {
    t0: 0,
    cim: "Hat erő a hasáb élein",
    szoveg: "A hasáb 3,5 × 3 × 4 m. A hat erő az élek mentén hat, és zárt láncot alkot: mindegyik ott kezdődik, ahol az előző véget ért.",
    kepletek: ["F_1 = F_4 = 7,\\quad F_2 = F_5 = 6,\\quad F_3 = F_6 = 8\\ \\text{N}"],
  },
  {
    t0: 5,
    cim: "Az erők összege nulla",
    szoveg: "Az erők párba állnak: minden irányban van egy oda- és egy ugyanakkora visszamutató. ΣF = 0 — de nem közös ponton mennek át, ezért a nyomatékot külön meg kell nézni.",
    kepletek: ["\\sum F_x = 7 - 7 = 0,\\quad \\sum F_y = -6 + 6 = 0,\\quad \\sum F_z = 8 - 8 = 0"],
  },
  {
    t0: 8.5,
    cim: "Nyomaték az x tengelyre",
    szoveg: "Az x tengely körül csak az y és z irányú, tőle távol futó erők forgatnak: F₅ (4 m magasan) és F₆ (3 m-re oldalt). A többi vagy párhuzamos x-szel, vagy metszi a tengelyt.",
    kepletek: ["M_x = -F_5\\cdot 4 - F_6\\cdot 3 = -24 - 24 = -48\\ \\text{Nm}"],
  },
  {
    t0: 11.5,
    cim: "Nyomaték az y és a z tengelyre",
    szoveg: "Ugyanez a logika: y körül F₃ (x = 3,5) és F₄ (z = 4) forgat, z körül F₁ (y = 3) és F₂ (x = 3,5).",
    kepletek: ["M_y = -8\\cdot 3{,}5 - 7\\cdot 4 = -56,\\qquad M_z = -7\\cdot 3 - 6\\cdot 3{,}5 = -42\\ \\text{Nm}"],
  },
  {
    t0: 14.5,
    cim: "Az eredő: tiszta forgatónyomaték",
    szoveg: "Az erő nulla, a nyomaték nem: az eredő egy nyomatékvektor, amelynek a három komponense az imént kiszámolt három szám. Ez a vektor bárhová eltolható — szabad vektor.",
    kepletek: ["\\underline{M} = (-48;\\ -56;\\ -42)\\ \\text{Nm},\\qquad |\\underline{M}| = 84{,}88\\ \\text{Nm}"],
  },
];

function Rajz(t) {
  const hasabU = arany(t, 0.3, 1.2);
  const eroU = EROK.map((_, i) => arany(t, 1.3 + i * 0.55, 1.9 + i * 0.55));
  const parU = arany(t, 5.2, 5.8);
  const parIdx = t < 6.3 ? 0 : t < 7.4 ? 1 : 2; // melyik pár lüktet
  const xU = arany(t, 8.7, 9.5);
  const yzU = arany(t, 11.7, 12.5);
  const mU = arany(t, 14.8, 16.0);
  const halvany = 1 - 0.7 * mU;
  const luk = 0.75 + 0.25 * lukteto(t, 0.9);

  const kiemelt = (i) => {
    if (t >= 5 && t < 8.5) return i % 3 === parIdx;
    if (t >= 8.5 && t < 11.5) return i === 4 || i === 5;
    if (t >= 11.5 && t < 14.5) return i === 2 || i === 3 || i === 0 || i === 1;
    return true;
  };

  const csucsok = [
    [0, 0, 0], [A, 0, 0], [A, B, 0], [0, B, 0],
    [0, 0, C], [A, 0, C], [A, B, C], [0, B, C],
  ];
  const elek = [
    [0, 1], [1, 2], [2, 3], [3, 0],
    [4, 5], [5, 6], [6, 7], [7, 4],
    [0, 4], [1, 5], [2, 6], [3, 7],
  ];

  return (
    <Jelenet3D kamera={[10, -10.5, 7]} cel={[1.2, 1, 1.6]} magassag={420} tavolsagMin={3} tavolsagMax={40}>
      <Racs3D meret={16} osztas={16} />
      <Tengelyek3D hossz={6} />

      {/* hasáb: áttetsző test + élek */}
      <mesh position={[A / 2, B / 2, C / 2]}>
        <boxGeometry args={[A, B, C]} />
        <meshStandardMaterial color="#8ec3cd" transparent opacity={0.13 * hasabU * halvany} depthWrite={false} />
      </mesh>
      {elek.map(([a, b], i) => (
        <Vonal3D key={i} tol={csucsok[a]} ig={csucsok[b]} szin="#275767" u={hasabU} vastag={1.4} opacitas={0.8 * halvany} />
      ))}
      <Cimke3D pozicio={[A / 2, -0.6, 0]} szin="#64748b" meret={11} vastag={false} opacitas={hasabU * halvany}>3,5 m</Cimke3D>
      <Cimke3D pozicio={[A + 0.6, B / 2, 0]} szin="#64748b" meret={11} vastag={false} opacitas={hasabU * halvany}>3 m</Cimke3D>
      <Cimke3D pozicio={[A + 0.6, 0, C / 2]} szin="#64748b" meret={11} vastag={false} opacitas={hasabU * halvany}>4 m</Cimke3D>

      {/* erők az élek közepén */}
      {EROK.map((e, i) => {
        const h = e.F * E;
        const kozep = e.tol.map((c, k) => c + (e.ir[k] * ELHOSSZ[i]) / 2);
        const tol = kozep.map((c, k) => c - (e.ir[k] * h) / 2);
        const ig = kozep.map((c, k) => c + (e.ir[k] * h) / 2);
        const ki = kiemelt(i);
        const op = (ki ? 1 : 0.22) * (i >= 4 || t < 14.5 ? 1 : 1) * (mU > 0 ? 1 - 0.6 * mU : 1);
        return (
          <group key={i}>
            <Nyil3D tol={tol} ig={ig} szin={e.szin} u={eroU[i]} vastag={ki && t >= 5 ? 0.1 * luk : 0.09} opacitas={op} />
            <Cimke3D pozicio={ig.map((c, k) => c + e.ir[k] * 0.5 + (k === 2 ? 0.25 : 0))} szin={e.szin} meret={12} opacitas={eroU[i] * op}>
              {e.nev} = {e.F} N
            </Cimke3D>
          </group>
        );
      })}

      {/* párok kiemelése: felirat */}
      {t >= 5 && t < 8.5 && (
        <Cimke3D pozicio={[A / 2, B / 2, C + 1.3]} szin="#15803d" meret={12.5} opacitas={parU}>
          {["F₁ és F₄: x irány, kiejtik egymást", "F₂ és F₅: y irány, kiejtik egymást", "F₃ és F₆: z irány, kiejtik egymást"][parIdx]}
        </Cimke3D>
      )}

      {/* erőkarok az x tengelyhez */}
      {t >= 8.5 && t < 11.5 && (
        <group>
          <Vonal3D tol={[0, 0, 0]} ig={[0, 0, C]} szin="#7c3aed" szaggatott u={xU} vastag={2} />
          <Cimke3D pozicio={[-0.5, 0, C / 2]} szin="#7c3aed" meret={11.5} vastag={false} opacitas={xU}>4 m</Cimke3D>
          <Vonal3D tol={[0, 0, 0]} ig={[0, B, 0]} szin="#b45309" szaggatott u={xU} vastag={2} />
          <Cimke3D pozicio={[-0.5, B / 2, -0.3]} szin="#b45309" meret={11.5} vastag={false} opacitas={xU}>3 m</Cimke3D>
          <Cimke3D pozicio={[A / 2, B / 2, C + 1.3]} szin="#9f1239" meret={12.5} opacitas={xU}>Mx = −6·4 − 8·3 = −48 Nm</Cimke3D>
        </group>
      )}
      {t >= 11.5 && t < 14.5 && (
        <group>
          <Cimke3D pozicio={[A / 2, B / 2, C + 1.3]} szin="#9f1239" meret={12.5} opacitas={yzU}>My = −8·3,5 − 7·4 = −56 Nm · Mz = −7·3 − 6·3,5 = −42 Nm</Cimke3D>
        </group>
      )}

      {/* M vektor */}
      <Nyil3D tol={[0, 0, 0]} ig={M.map((m) => m * MS)} szin="#9f1239" u={mU} vastag={0.14} />
      <Cimke3D pozicio={M.map((m) => m * MS * 0.6 + 0)} szin="#9f1239" meret={13} opacitas={arany(t, 15.6, 16.0)}>M = (−48; −56; −42) Nm</Cimke3D>
      <Cimke3D pozicio={M.map((m) => m * MS).map((c, k) => c + (k === 2 ? -0.9 : 0))} szin="#9f1239" meret={12} vastag={false} opacitas={arany(t, 16.0, 16.5)}>|M| = 84,88 Nm</Cimke3D>
    </Jelenet3D>
  );
}

export default function FilmHasab() {
  return (
    <FeladatFilm
      cim="GYF‑5 · Hat erő a hasáb élein — 3D-ben"
      hossz={16.8}
      fejezetek={FEJEZETEK}
      rajz={Rajz}
      megjegyzes="Forgasd úgy, hogy egy-egy tengely irányából nézz rá: akkor látszik, mely erők forgatnak körülötte."
    />
  );
}
