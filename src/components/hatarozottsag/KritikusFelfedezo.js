"use client";

import { useMemo, useState } from "react";
import { Csuszka } from "@/components/abrak/ErovektorBonto";
import SzerkezetRajz, { Jelveny, SZINEK } from "./SzerkezetRajz";
import Merleg, { useOsszecsuklas } from "./Merleg";
import { haromHatasvonal, haromReakcio } from "@/lib/hatarozottsag";
import { sz } from "@/lib/szamok";

/*
 * Kritikus elrendezés felfedező: egy gerendát három támasztórúd tart. A rudak irányát csúszkával forgatod.
 * A számláló végig 3 = 3-at mutat — de ha a három hatásvonal párhuzamos lesz vagy egy ponton megy át,
 * a gerenda „kicsúszik” (animáció), a reakciók pedig a végtelenbe szaladnak, ahogy közeledünk a kritikus helyzethez.
 */

const FOK = Math.PI / 180;
const P = [
  [0.5, 2],
  [3, 2],
  [5.5, 2],
]; // a rudak csatlakozási pontjai a gerendán
const TEHER = { x: 4.5, y: 2, Fx: 3, Fy: -10 };
const KUSZOB = 0.02; // ez alatt „kritikusnak” tekintjük (normált determináns)

const ELORE = [
  { nev: "Jó elrendezés", sz: [-35, 0, 20] },
  { nev: "Három párhuzamos", sz: [0, 0, 0] },
  { nev: "Egy ponton átmenő", sz: [39.8, 0, -39.8] },
  { nev: "Párhuzamos, ferdén", sz: [25, 25, 25] },
  { nev: "Majdnem kritikus", sz: [36, 0, -39.8] },
];

function irany(szog) {
  // szog: a függőlegestől mért elfordulás (fok), pozitív = a rúd alsó vége jobbra; a rúd lefelé mutat
  return [Math.sin(szog * FOK), -Math.cos(szog * FOK)];
}

export default function KritikusFelfedezo() {
  const [szogek, setSzogek] = useState([-35, 0, 20]);

  const vonalak = useMemo(() => P.map(([x, y], k) => ({ x, y, ex: irany(szogek[k])[0], ey: irany(szogek[k])[1] })), [szogek]);
  const geo = useMemo(() => haromHatasvonal(vonalak, 1e-4), [vonalak]);
  const reak = useMemo(() => haromReakcio(vonalak, { Fx: TEHER.Fx, Fy: TEHER.Fy, M: TEHER.x * TEHER.Fy - TEHER.y * TEHER.Fx }), [vonalak]);
  const kritikus = geo.kritikus || geo.mertek < KUSZOB;

  // a szabad mozgás iránya: párhuzamos rudaknál eltolódás a rudakra merőlegesen, egyébként forgás a (közelítő) közös pont körül
  const mozgas = useMemo(() => {
    if (!kritikus) return null;
    const [a, b, c] = vonalak;
    const par = (p, q) => Math.abs(p.ex * q.ey - p.ey * q.ex) < 0.05;
    if (par(a, b) && par(b, c)) return [-a.ey, a.ex, 0];
    // a két legkevésbé párhuzamos vonal metszéspontja
    const parok = [
      [a, b],
      [b, c],
      [a, c],
    ];
    let legjobb = null;
    let legjobbDet = 0;
    for (const [p, q] of parok) {
      const det = p.ex * q.ey - p.ey * q.ex;
      if (Math.abs(det) > Math.abs(legjobbDet)) {
        legjobbDet = det;
        legjobb = [p, q];
      }
    }
    const [p, q] = legjobb;
    const t = ((q.x - p.x) * q.ey - (q.y - p.y) * q.ex) / legjobbDet;
    const Px = p.x + t * p.ex;
    const Py = p.y + t * p.ey;
    // forgás P körül: u_x = ω·P_y, u_y = −ω·P_x
    return [Py, -Px, 1];
  }, [kritikus, vonalak]);
  const s = useOsszecsuklas(kritikus);

  const szerkezet = useMemo(
    () => ({
      testek: [{ pontok: [[0, 2], [6, 2]] }],
      kenyszerek: vonalak.map((v) => ({ tipus: "rud", test: 0, x: v.x, y: v.y, irany: [v.ex, v.ey] })),
      terhek: [{ test: 0, ...TEHER }],
    }),
    [vonalak],
  );
  const itelet = kritikus ? { tipus: "hatarozatlanEsTulhatarozott", szabad: 1, folos: 1, kritikus: true } : { tipus: "hatarozott", szabad: 0, folos: 0, kritikus: false };

  // hatásvonalak és metszéspontok a rajzra
  const extra = (kx, ky) => {
    const el = [];
    vonalak.forEach((v, k) => {
      el.push(<line key={`v${k}`} x1={kx(v.x - 6 * v.ex)} y1={ky(v.y - 6 * v.ey)} x2={kx(v.x + 6 * v.ex)} y2={ky(v.y + 6 * v.ey)} stroke={kritikus ? SZINEK.bordo : "#94a3b8"} strokeWidth="1" strokeDasharray="4 3" opacity="0.8" />);
    });
    const parok = [
      [0, 1],
      [1, 2],
      [0, 2],
    ];
    for (const [a, b] of parok) {
      const p = vonalak[a];
      const q = vonalak[b];
      const det = p.ex * q.ey - p.ey * q.ex;
      if (Math.abs(det) < 1e-6) continue;
      const t = ((q.x - p.x) * q.ey - (q.y - p.y) * q.ex) / det;
      const X = p.x + t * p.ex;
      const Y = p.y + t * p.ey;
      if (Math.abs(X) > 12 || Math.abs(Y) > 12) continue;
      el.push(<circle key={`m${a}${b}`} cx={kx(X)} cy={ky(Y)} r={kritikus ? 6 : 4} fill={kritikus ? SZINEK.bordo : "white"} stroke={kritikus ? SZINEK.bordo : "#64748b"} strokeWidth="1.5" />);
    }
    if (geo.kozosPont && !geo.parhuzamos) {
      el.push(
        <text key="kp" x={kx(geo.kozosPont.x) + 10} y={ky(geo.kozosPont.y) + 4} fontSize="11.5" fontWeight="700" style={{ fill: SZINEK.bordo, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
          közös pont — itt forog
        </text>,
      );
    }
    const szoveg = kritikus ? (geo.parhuzamos ? "3 = 3, mégis eltolódik" : "3 = 3, mégis elfordul") : geo.mertek < 0.08 ? "3 = 3 — de vigyázz, közel a kritikushoz" : "3 = 3 ✓ jó elrendezés";
    el.push(<Jelveny key="j" x={300} y={22} szoveg={szoveg} szin={kritikus ? SZINEK.bordo : geo.mertek < 0.08 ? "#b45309" : SZINEK.zold} w={Math.max(150, 8.5 * szoveg.length)} />);
    return el;
  };

  const meroSzin = kritikus ? "#be123c" : geo.mertek < 0.08 ? "#d97706" : "#15803d";

  return (
    <div className="rounded-2xl border border-[color:var(--keret)] bg-white p-4 sm:p-5">
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="min-w-0">
          <div className="racs-vilagos overflow-hidden rounded-xl border border-[color:var(--keret)]">
            <SzerkezetRajz szerkezet={szerkezet} mozgas={mozgas} s={s} amplitudo={0.5} szelesseg={600} magassag={340} margo={{ bal: 60, jobb: 60, fel: 60, le: 40 }} cimkek={["1", "2", "3"]} extra={extra} glow={kritikus ? null : "zold"} />
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {ELORE.map((p) => (
              <button key={p.nev} type="button" onClick={() => setSzogek(p.sz)} className="rounded-full bg-petrol-50 px-2.5 py-1 text-[11.5px] font-medium text-petrol-700 ring-1 ring-petrol-200 transition hover:bg-naracs-50 hover:text-naracs-700 hover:ring-naracs-300">
                {p.nev}
              </button>
            ))}
          </div>
        </div>
        <div className="min-w-0 space-y-3">
          {szogek.map((v, k) => (
            <Csuszka key={k} cimke={`${k + 1}. rúd hajlása a függőlegestől`} ertek={v} egyseg="°" min={-80} max={80} lepes={0.5} tizedes={1} onChange={(u) => setSzogek((sz0) => sz0.map((x, j) => (j === k ? u : x)))} />
          ))}
          <Merleg e={3} i={3} itelet={itelet} kompakt />
          <div className="rounded-xl border border-[color:var(--keret)] bg-white p-3">
            <div className="flex items-baseline justify-between">
              <span className="text-[10.5px] font-bold tracking-[0.14em] text-petrol-500 uppercase">elrendezés-mérő · |det G|</span>
              <span className="szamok text-[12px] font-semibold" style={{ color: meroSzin }}>
                {sz(geo.mertek, 3)}
              </span>
            </div>
            <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-petrol-100">
              <div className="h-full rounded-full transition-all duration-300" style={{ width: `${Math.max(2, 100 * Math.min(1, geo.mertek / 0.45))}%`, background: meroSzin }} />
            </div>
            <p className="mt-2 text-[12.5px] leading-relaxed text-petrol-700">{geo.indok}.</p>
          </div>
          <div className="szamok rounded-xl bg-petrol-50/70 p-3 text-[12.5px] text-petrol-700">
            <p className="mb-1 text-[10.5px] font-bold tracking-[0.14em] text-petrol-500 uppercase">rúderők a próbateherre (10 kN ↓, 3 kN →)</p>
            {reak.ok && !kritikus ? (
              <p>
                S₁ = {sz(reak.r[0], 2)}, S₂ = {sz(reak.r[1], 2)}, S₃ = {sz(reak.r[2], 2)} kN{geo.mertek < 0.08 ? " — figyeld, hogy szaladnak el a kritikus helyzet felé közeledve!" : ""}
              </p>
            ) : (
              <p className="text-rose-700">Nincs (egyértelmű) megoldás: a G együtthatómátrix determinánsa nulla. A hallgatói szem 3 = 3-at lát, az egyenletrendszer mégis megoldhatatlan — illetve terhelés nélkül végtelen sok megoldása van (sajátfeszültség).</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
