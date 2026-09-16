"use client";

import FeladatFilm from "@/components/anim/FeladatFilm";
import { arany } from "@/components/anim/Idovonal";
import { FeliratA } from "@/components/anim/FilmElemek";
import { TartoHegyek, Csuklo, Gorgo, TeherNyil, Meret } from "@/components/tartok/TartoElemek";
import { racsKinematika } from "@/lib/hatarozottsag";
import { SZ, SzamlaloA, Itelet } from "./FilmGyf1";

/*
 * GYF‑5 · Rácsos tartó: r + k = 2c — film.
 * A tankönyv 7.9 rácsa: 6 csomópont (e = 12), a rudak egyenként bejönnek (r = 1…9), aztán a támaszok (k = 2, 3):
 * 12 = 12 ✓, háromszögekből felépíthető. Egy rúd (1–5) elvétele: 11 < 12, a bal mező paralelogrammává ferdül.
 * Visszatesszük, és még egyet (2–4): 13 > 12, egyszeresen határozatlan — az X-rács megfeszül.
 */

const CS = [
  { id: "1", x: 0, y: 2 },
  { id: "2", x: 2, y: 2 },
  { id: "3", x: 4, y: 2 },
  { id: "4", x: 0, y: 0 },
  { id: "5", x: 2, y: 0 },
  { id: "6", x: 4, y: 0 },
];
const RUDAK = ["1,4", "4,5", "1,5", "1,2", "2,5", "2,6", "5,6", "2,3", "3,6"]; // a bejövetel sorrendje: háromszögenként
const HAROMSZOGEK = [
  ["1", "4", "5"],
  ["1", "2", "5"],
  ["2", "5", "6"],
  ["2", "3", "6"],
];
const kx = (x) => 150 + x * 75;
const ky = (y) => 220 - y * 75;
const cs = (id) => CS.find((c) => c.id === id);

const MECH = racsKinematika({
  csomopontok: CS,
  rudak: RUDAK.filter((r) => r !== "1,5").map((id) => ({ id, a: id.split(",")[0], b: id.split(",")[1] })),
  tamaszok: [
    { csomopont: "4", tipus: "csuklo" },
    { csomopont: "6", tipus: "gorgo", szog: 90 },
  ],
});
const MOZG = (() => {
  const v = MECH.mozgasok[0] ?? {};
  const max = Math.max(1e-9, ...CS.map((c) => Math.hypot(v[c.id]?.dx ?? 0, v[c.id]?.dy ?? 0)));
  const jel = (v["2"]?.dx ?? 1) < 0 ? -1 : 1; // a felső öv jobbra csússzon
  return Object.fromEntries(CS.map((c) => [c.id, { dx: (jel * 0.45 * (v[c.id]?.dx ?? 0)) / max, dy: (jel * 0.45 * (v[c.id]?.dy ?? 0)) / max }]));
})();

const T = { cs: 0, rud: 3, tam: 13, harom: 16.5, elvesz: 21, x: 26 };

const FEJEZETEK = [
  { t0: T.cs, cim: "Hat csomópont", szoveg: "Rácsos tartón csomópontonként két független egyenlet írható (közös metszéspontú erők): e = 2c = 12. A rudak és a külső kényszerfokok az ismeretlenek: i = r + k.", kepletek: ["e = 2c = 2\\cdot 6 = 12"] },
  { t0: T.rud, cim: "A rudak egyenként", szoveg: "Kilenc rúd — mindegyik egy-egy ismeretlen rúderő. Háromszögenként építjük: egy új csuklót két új rúddal kötünk a meglévőkhöz.", kepletek: ["r = 9"] },
  { t0: T.tam, cim: "Csukló és görgő", szoveg: "A külső kényszerek: A csukló (2) + B görgő (1), k = 3. Összesen i = 9 + 3 = 12 = e. A számlálás rendben.", kepletek: ["i = r + k = 9 + 3 = 12 = 2c"] },
  { t0: T.harom, cim: "Háromszögekből építhető → merev test", szoveg: "A négy háromszög egyetlen merev testet ad, amit egy csukló és egy görgő támaszt kéttámaszú tartóként: a szerkezet statikailag határozott (tankönyv 7.9. ábra).", kepletek: ["\\text{merev test} + (2 + 1) = 3\\ \\Rightarrow\\ \\text{határozott}"] },
  { t0: T.elvesz, cim: "Egy rúd elvéve (7.10.a)", szoveg: "Az 1–5 rúd nélkül r = 8, i = 11 < 12: túlhatározott. A bal mező négyszöge nem merev — paralelogrammává ferdül, a szerkezet mozog.", kepletek: ["r + k = 8 + 3 = 11 < 12"] },
  { t0: T.x, cim: "Két átló a bal mezőben (7.10.c)", szoveg: "Visszatesszük az 1–5 rudat, és beteszünk egy 2–4 rudat is: r = 10, i = 13 > 12, egyszeresen határozatlan. Az X-rács minden terhet elbír, de az egyik átló ereje csak a rudak merevségéből számítható.", kepletek: ["r + k = 10 + 3 = 13 > 12"] },
];

function Rajz(t) {
  const csU = arany(t, 0.2, 1.4);
  const rudU = RUDAK.map((_, k) => arany(t, T.rud + 0.2 + k * 1.05, T.rud + 0.9 + k * 1.05));
  const aU = arany(t, T.tam + 0.2, T.tam + 1.0);
  const bU = arany(t, T.tam + 1.3, T.tam + 2.1);
  const haromU = HAROMSZOGEK.map((_, k) => arany(t, T.harom + 0.3 + k * 0.9, T.harom + 0.9 + k * 0.9));
  const elveszU = arany(t, T.elvesz + 0.2, T.elvesz + 1.0);
  const mozgasU = arany(t, T.elvesz + 1.0, T.elvesz + 2.6);
  const leng = t > T.elvesz + 2.6 && t < T.x ? 0.12 * Math.sin((2 * Math.PI * (t - T.elvesz - 2.6)) / 2.2) : 0;
  const visszaU = arany(t, T.x + 0.2, T.x + 1.0);
  const xU = arany(t, T.x + 1.4, T.x + 2.4);

  const elvett = elveszU > 0.5 && visszaU < 0.5;
  const r = rudU.reduce((s, u) => s + Math.round(u), 0) - (elvett ? 1 : 0) + Math.round(xU);
  const k = 2 * Math.round(aU) + Math.round(bU);
  const i = r + k;
  const allapot = t < T.tam + 2.1 ? undefined : elvett ? "rossz" : xU > 0.5 ? "lila" : "jo";

  const s = elvett ? mozgasU + leng : 0;
  const hely = (id) => {
    const c = cs(id);
    const m = MOZG[id] ?? { dx: 0, dy: 0 };
    return [kx(c.x + s * m.dx), ky(c.y + s * m.dy)];
  };
  const rudSzin = elvett && s > 0.05 ? "#9f1239" : allapot === "lila" ? "#9f1239" : allapot === "jo" ? "#166534" : SZ.tarto;

  return (
    <svg viewBox="0 0 600 330" className="abra w-full select-none">
      <TartoHegyek />
      <SzamlaloA e={12} i={i} opacitas={csU} allapot={allapot} />
      <text x={16} y={30} fontSize="12" fontWeight="700" style={{ fill: SZ.szurke }} opacity={csU}>
        c = 6 · r = {r} · k = {k}
      </text>

      {/* háromszög-kiemelés */}
      {HAROMSZOGEK.map((h, kk) => {
        const p = h.map((id) => hely(id));
        return <path key={kk} d={`M ${p[0][0]} ${p[0][1]} L ${p[1][0]} ${p[1][1]} L ${p[2][0]} ${p[2][1]} Z`} fill={SZ.zold} opacity={haromU[kk] * 0.22 * (1 - elveszU)} />;
      })}

      {/* támaszok */}
      <g opacity={aU} transform={`translate(0 ${(1 - aU) * 30})`}>
        <Csuklo x={kx(0)} y={ky(0)} meret={14} />
      </g>
      <g opacity={bU} transform={`translate(0 ${(1 - bU) * 30})`}>
        <Gorgo x={kx(4)} y={ky(0)} meret={14} />
      </g>
      <FeliratA x={kx(0)} y={ky(0) + 48} szin={SZ.tarto} meret={12} opacitas={aU} dolt>A</FeliratA>
      <FeliratA x={kx(4)} y={ky(0) + 48} szin={SZ.tarto} meret={12} opacitas={bU} dolt>B</FeliratA>
      <Meret x1={kx(0)} x2={kx(2)} y={ky(0) + 70} cimke="2 m" opacitas={0.8} />
      <Meret x1={kx(2)} x2={kx(4)} y={ky(0) + 70} cimke="2 m" opacitas={0.8} />

      {/* rudak */}
      {RUDAK.map((id, kk) => {
        const [a, b] = id.split(",");
        const [x1, y1] = hely(a);
        const [x2, y2] = hely(b);
        let u = rudU[kk];
        let op = 1;
        if (id === "1,5") op = elvett ? 1 - elveszU : 1;
        if (id === "1,5" && visszaU > 0) op = Math.max(op, visszaU);
        if (u <= 0.02 || op <= 0.02) return null;
        return (
          <g key={id} opacity={op}>
            {allapot === "lila" && <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={SZ.bordo} strokeWidth="14" strokeLinecap="round" opacity="0.22" />}
            <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * u} y2={y1 + (y2 - y1) * u} stroke={rudSzin} strokeWidth="5" strokeLinecap="round" />
          </g>
        );
      })}
      {/* az X második átlója */}
      {xU > 0.02 && (
        <g>
          <line x1={kx(2)} y1={ky(2)} x2={kx(2) + (kx(0) - kx(2)) * xU} y2={ky(2) + (ky(0) - ky(2)) * xU} stroke={SZ.lila} strokeWidth="5" strokeLinecap="round" />
        </g>
      )}

      {/* teher */}
      <TeherNyil x={hely("2")[0]} y={hely("2")[1] - 4} hossz={50} szog={-90} cimke="F" cimkeEltolas={[8, -2]} opacitas={csU} />

      {/* csomópontok */}
      {CS.map((c) => {
        const [X, Y] = hely(c.id);
        return (
          <g key={c.id} opacity={csU}>
            <circle cx={X} cy={Y} r="4.5" fill="white" stroke="#0f172a" strokeWidth="1.8" />
            <text x={X + (c.y > 1 ? -9 : 9)} y={Y + (c.y > 1 ? -8 : 18)} textAnchor={c.y > 1 ? "end" : "start"} fontSize="12" fontWeight="650" style={{ fill: "#0f172a", paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
              {c.id}
            </text>
          </g>
        );
      })}

      <Itelet y={300} szoveg="2c = r + k = 12, háromszögekből építve → határozott ✓" opacitas={haromU[3] * (1 - elveszU)} />
      <Itelet y={300} szoveg="11 < 12: túlhatározott — a bal mező elferdül" szin={SZ.bordo} opacitas={elvett ? mozgasU : 0} />
      <Itelet y={300} szoveg="13 > 12: egyszeresen határozatlan — az X megfeszül" szin={SZ.lila} opacitas={xU} />
    </svg>
  );
}

export default function FilmGyf5() {
  return (
    <FeladatFilm
      cim="GYF‑5 · Rácsos tartó — r + k = 2c élőben"
      hossz={30}
      fejezetek={FEJEZETEK}
      rajz={Rajz}
      megjegyzes="A bal felső sarokban a három szám (c, r, k), jobbra a mérleg. A ferdülő mező alakját a kinematikai rangvizsgálat nulltere adja — ugyanaz a számítás, amit a Rácsos tartó ellenőrző használ."
    />
  );
}
