"use client";

import { useMemo, useState } from "react";
import { TartoHegyek, Csuklo, Gorgo, TeherNyil, Meret } from "@/components/tartok/TartoElemek";
import Merleg, { useOsszecsuklas } from "./Merleg";
import { Jelveny, SZINEK } from "./SzerkezetRajz";
import { racsKinematika } from "@/lib/hatarozottsag";

/*
 * Rácsos tartó ellenőrző: a tankönyv 7.9/7.10 ábrájának kétmezős rácsa. Rudak ki-be kapcsolása kattintással
 * (a hiányzó rudak halvány szellemként látszanak), a támaszok kattintásra váltanak (csukló ↔ görgő).
 * Élő számláló: r + k = 2c; a rangvizsgálat dönt; mechanizmusnál a hiányzó rúd mezője elferdül (animáció).
 */

const CS = [
  { id: "1", x: 0, y: 2 },
  { id: "2", x: 2, y: 2 },
  { id: "3", x: 4, y: 2 },
  { id: "4", x: 0, y: 0 },
  { id: "5", x: 2, y: 0 },
  { id: "6", x: 4, y: 0 },
];
const LEHETSEGES = ["1,2", "2,3", "4,5", "5,6", "1,4", "2,5", "3,6", "1,5", "2,6", "2,4", "3,5"];
const ALAP = ["1,2", "2,3", "4,5", "5,6", "1,4", "2,5", "3,6", "1,5", "2,6"];
const TERHEK = [
  { csomopont: "2", Fx: 0, Fy: -10 },
  { csomopont: "3", Fx: 5, Fy: 0 },
];
const ELORE = [
  { nev: "7.9 · határozott", rudak: ALAP, A: "csuklo", B: "gorgo" },
  { nev: "7.10.a · hiányzó rúd", rudak: ALAP.filter((r) => r !== "1,5"), A: "csuklo", B: "gorgo" },
  { nev: "7.10.b · két görgő", rudak: ALAP, A: "gorgo", B: "gorgo" },
  { nev: "7.10.c · X-rács", rudak: [...ALAP, "2,4"], A: "csuklo", B: "gorgo" },
  { nev: "7.10.d · két csukló", rudak: ALAP, A: "csuklo", B: "csuklo" },
  { nev: "7.10.e · X + két görgő", rudak: [...ALAP, "2,4"], A: "gorgo", B: "gorgo" },
  { nev: "7.10.f · rúd a csuklón át", rudak: [...ALAP.filter((r) => r !== "2,6"), "2,4"], A: "csuklo", B: "gorgo" },
];

const W = 600;
const Hh = 320;
const kx = (x) => 130 + x * 85;
const ky = (y) => 220 - y * 85;

export default function RacsosEllenorzo() {
  const [rudak, setRudak] = useState(ALAP);
  const [tamasz, setTamasz] = useState({ A: "csuklo", B: "gorgo" });

  const modell = useMemo(
    () => ({
      csomopontok: CS,
      rudak: rudak.map((id) => ({ id, a: id.split(",")[0], b: id.split(",")[1] })),
      tamaszok: [
        { csomopont: "4", tipus: tamasz.A, szog: 90 },
        { csomopont: "6", tipus: tamasz.B, szog: 90 },
      ],
    }),
    [rudak, tamasz],
  );
  const itelet = useMemo(() => racsKinematika(modell), [modell]);
  const mozog = itelet.szabad > 0;
  const s = useOsszecsuklas(mozog);
  const mozgas = useMemo(() => {
    if (!itelet.mozgasok.length) return null;
    // a bázisvektorok összege, a terhek munkája szerint előjelezve; normálás: a legnagyobb elmozdulás 0,45 m
    const v = {};
    for (const c of CS) v[c.id] = { dx: 0, dy: 0 };
    for (const b of itelet.mozgasok) {
      let munka = 0;
      for (const t of TERHEK) munka += b[t.csomopont].dx * t.Fx + b[t.csomopont].dy * t.Fy;
      const jel = munka < -1e-9 ? -1 : 1;
      for (const c of CS) {
        v[c.id].dx += jel * b[c.id].dx;
        v[c.id].dy += jel * b[c.id].dy;
      }
    }
    const max = Math.max(1e-9, ...CS.map((c) => Math.hypot(v[c.id].dx, v[c.id].dy)));
    for (const c of CS) {
      v[c.id].dx *= 0.45 / max;
      v[c.id].dy *= 0.45 / max;
    }
    return v;
  }, [itelet]);

  const hely = (id) => {
    const c = CS.find((q) => q.id === id);
    const d = mozgas && s > 0 ? mozgas[id] : { dx: 0, dy: 0 };
    return [kx(c.x + s * d.dx), ky(c.y + s * d.dy)];
  };

  const valt = (id) => setRudak((r) => (r.includes(id) ? r.filter((x) => x !== id) : [...r, id]));
  const tamaszValt = (b) => setTamasz((t) => ({ ...t, [b]: t[b] === "csuklo" ? "gorgo" : "csuklo" }));

  const szin = itelet.tipus === "hatarozott" ? SZINEK.zold : itelet.tipus === "hatarozatlan" ? SZINEK.lila : SZINEK.bordo;
  const jelveny = itelet.tipus === "hatarozott" ? "✓ határozott rácsos tartó" : itelet.tipus === "hatarozatlan" ? `${itelet.folos}-szeresen határozatlan` : itelet.kritikus ? "kritikus — mozog, pedig 2c = r + k" : "mechanizmus — mozog!";
  const rudSzin = itelet.tipus === "hatarozatlan" ? "#9f1239" : itelet.tipus === "hatarozott" ? "#166534" : "#1d3c48";

  return (
    <div className="rounded-2xl border border-[color:var(--keret)] bg-white p-4 sm:p-5">
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="min-w-0">
          <div className="racs-vilagos overflow-hidden rounded-xl border border-[color:var(--keret)]">
            <svg viewBox={`0 0 ${W} ${Hh}`} className="abra h-auto w-full select-none">
              <TartoHegyek />
              {/* szellem-rudak */}
              {LEHETSEGES.filter((id) => !rudak.includes(id)).map((id) => {
                const [a, b] = id.split(",");
                const [x1, y1] = hely(a);
                const [x2, y2] = hely(b);
                return (
                  <g key={id} onClick={() => valt(id)} style={{ cursor: "pointer" }}>
                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="transparent" strokeWidth="18" />
                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 5" opacity="0.55" />
                  </g>
                );
              })}
              {/* támaszok */}
              {[
                ["A", "4"],
                ["B", "6"],
              ].map(([betu, id]) => {
                const c = CS.find((q) => q.id === id);
                const X = kx(c.x);
                const Y = ky(c.y);
                return (
                  <g key={betu} onClick={() => tamaszValt(betu)} style={{ cursor: "pointer" }}>
                    <circle cx={X} cy={Y + 14} r="22" fill="transparent" />
                    {tamasz[betu] === "csuklo" ? <Csuklo x={X} y={Y} meret={14} /> : <Gorgo x={X} y={Y} meret={14} />}
                    <text x={X} y={Y + 48} textAnchor="middle" fontSize="12.5" fontStyle="italic" fontWeight="650" style={{ fill: "#1d3c48", paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
                      {betu} · {tamasz[betu] === "csuklo" ? "csukló (2)" : "görgő (1)"}
                    </text>
                  </g>
                );
              })}
              {/* rudak */}
              {rudak.map((id) => {
                const [a, b] = id.split(",");
                const [x1, y1] = hely(a);
                const [x2, y2] = hely(b);
                return (
                  <g key={id} onClick={() => valt(id)} style={{ cursor: "pointer" }}>
                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="transparent" strokeWidth="18" />
                    {itelet.tipus === "hatarozatlan" && <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={SZINEK.bordo} strokeWidth="14" strokeLinecap="round" opacity="0.22" className="animate-pulse" />}
                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={rudSzin} strokeWidth="5" strokeLinecap="round" style={{ transition: "stroke 0.4s" }} />
                  </g>
                );
              })}
              {/* terhek */}
              {TERHEK.map((t, i) => {
                const [X, Y] = hely(t.csomopont);
                const F = Math.hypot(t.Fx, t.Fy);
                const szog = (Math.atan2(t.Fy, t.Fx) * 180) / Math.PI;
                return <TeherNyil key={i} x={X} y={Y - (t.Fy < 0 ? 4 : 0)} hossz={34 + 2.2 * F} szog={szog} cimke={`${F} kN`} cimkeEltolas={t.Fx > 0 ? [-40, -6] : [8, -4]} />;
              })}
              {/* csomópontok */}
              {CS.map((c) => {
                const [X, Y] = hely(c.id);
                return (
                  <g key={c.id}>
                    <circle cx={X} cy={Y} r="4.5" fill="white" stroke="#0f172a" strokeWidth="1.8" />
                    <text x={X + (c.y > 1 ? -9 : 9)} y={Y + (c.y > 1 ? -8 : 18)} textAnchor={c.y > 1 ? "end" : "start"} fontSize="12" fontWeight="650" style={{ fill: "#0f172a", paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
                      {c.id}
                    </text>
                  </g>
                );
              })}
              <Meret x1={kx(0)} x2={kx(2)} y={ky(0) + 66} cimke="2 m" />
              <Meret x1={kx(2)} x2={kx(4)} y={ky(0) + 66} cimke="2 m" />
              <Jelveny x={300} y={22} szoveg={jelveny} szin={szin} w={Math.max(160, 8.6 * jelveny.length)} />
            </svg>
          </div>
          <p className="mt-2 text-[12px] text-petrol-500">
            Kattints egy <strong>rúdra</strong> az elvételéhez, egy <strong>szaggatott szellemre</strong> a hozzáadásához, a <strong>támaszra</strong> a csukló/görgő váltáshoz.
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {ELORE.map((p) => (
              <button
                key={p.nev}
                type="button"
                onClick={() => {
                  setRudak(p.rudak);
                  setTamasz({ A: p.A, B: p.B });
                }}
                className="rounded-full bg-petrol-50 px-2.5 py-1 text-[11.5px] font-medium text-petrol-700 ring-1 ring-petrol-200 transition hover:bg-naracs-50 hover:text-naracs-700 hover:ring-naracs-300"
              >
                {p.nev}
              </button>
            ))}
          </div>
        </div>
        <div className="min-w-0 space-y-3">
          <Merleg e={itelet.e} i={itelet.i} eReszek={[{ cimke: `2 · c = 2 · ${itelet.c}`, db: itelet.e }]} iReszek={[{ cimke: `r = ${itelet.r} rúd`, db: itelet.r }, { cimke: `k = ${itelet.k} kényszerfok`, db: itelet.k }]} itelet={itelet} />
          <div className="rounded-xl bg-petrol-50/70 p-3 text-[13px] leading-relaxed text-petrol-700">
            {itelet.tipus === "hatarozott" && (
              <p>
                <strong className="text-emerald-700">2c = r + k, és a rang teljes.</strong> Háromszögekből építhető, egy csukló és egy görgő tartja: minden rúderő egyértelmű bármilyen csomóponti teherre.
              </p>
            )}
            {itelet.tipus === "hatarozatlan" && (
              <p>
                <strong className="text-violet-700">r + k &gt; 2c: {itelet.folos} fölös rúd vagy kényszerfok.</strong> Az egyensúly mindig biztosítható, de az egyik rúderő (vagy reakció) szabad paraméter marad — csak a rudak merevségével dönthető el (Szilárdságtan). Az X-rácsozás pont ilyen.
              </p>
            )}
            {itelet.tipus === "tulhatarozott" && (
              <p>
                <strong className="text-rose-700">2c &gt; r + k: {itelet.szabad} szabad mozgás.</strong> {itelet.k < 3 ? "A külső kényszerek összfokszáma kevesebb háromnál: az egész rács elgördül." : "Egy mező elvesztette a merevségét: paralelogrammává ferdül."} Nem tartó.
              </p>
            )}
            {itelet.tipus === "hatarozatlanEsTulhatarozott" && (
              <p>
                <strong className="text-rose-700">2c = r + k, mégsem tartó:</strong> {itelet.szabad} szabad mozgás és {itelet.folos} fölös rúd egyszerre. {itelet.k < 3 ? "A vízszintes eltolódást egyetlen külső reakció sem gátolja, miközben az X-rácsban egy rúd fölös." : "A jobb felső sarok „háromcsuklós tartóját” lefejtve a maradék testet egy csukló és egy olyan rúd támasztja, amelynek hatásvonala átmegy a csuklón."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
