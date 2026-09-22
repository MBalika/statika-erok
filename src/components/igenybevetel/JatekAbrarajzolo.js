"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import JatekKeret from "@/components/ui/JatekKeret";
import { TartoHegyek } from "@/components/tartok/TartoElemek";
import { geometria, SzerkezetRajz, TerhekRajz, ReakciokRajz, Meretlanc, DSZIN, vizszintesModell, vizszintesElemzes } from "./FeladatRajz";
import { sz } from "@/lib/szamok";

/*
 * „Rajzold meg a V és az M ábrát!”
 * Öt kör, körönként egy véletlen, statikailag határozott vízszintes tartó (kéttámaszú, konzol,
 * konzolos kéttámaszú; a 3–5. körben Gerber-tartó vagy koncentrált nyomaték is). A program
 * kijelöli a szakaszhatárokat; a hallgató minden töréspontnál fogópontokkal állítja be a V és az
 * M értékét (ugrásnál külön bal/jobb érték), és az M minden szakaszára kiválasztja az alakot:
 * egyenes / parabola ∪ / parabola ∩. A pontos ábrát a számítómag (elemez) adja.
 * Ellenőrzéskor a pontos ábra ráúszik a rajzolt vonalra, a jó fogópontok zöldek, a hibásak pirosak.
 * Pont = 100·(1 − átlagos relatív hiba) − 8/alakhiba, 0-nál levágva; „Segítség” (reakciók + kész
 * V-ábra) esetén a kör pontja feleződik. A végén az öt kör átlaga.
 */

const OSSZ_KOR = 5;
const SZ = 640;
const MA = 560;
const X0 = 100; // a tartó bal vége
const X1 = 540; // a tartó jobb vége (a jobb margó = a bal, így a geometria() középre teszi)
const YT = 118; // a tartó tengelye
const YV = 285; // a V ábra tengelye
const YM = 455; // az M ábra tengelye
const FEL_V = 62; // a V sáv félmagassága
const FEL_M = 78; // az M sáv félmagassága
const LEPES = 0.5;

const egesz = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
const valaszt = (t) => t[Math.floor(Math.random() * t.length)];
const fel = (min, max) => egesz(Math.round(min * 2), Math.round(max * 2)) / 2;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const kerek = (v) => Math.round(v / LEPES) * LEPES;
const poli = (a, x) => { let s = 0; for (let i = a.length - 1; i >= 0; i--) s = s * x + a[i]; return s; };
const feldolgoz = (gen) => { const f = vizszintesElemzes(gen.modell); return f ? { ...gen, ...f } : null; };

/* ---------------- véletlen tartók ---------------- */

function kettamaszuVeletlen() {
  const L = fel(4, 8);
  const mod = valaszt(["F", "p", "Fp", "pResz"]);
  const terhek = [];
  if (mod === "F" || mod === "Fp") terhek.push({ fajta: "F", x: fel(1, L - 1), F: egesz(4, 16) });
  if (mod === "p" || mod === "Fp") terhek.push({ fajta: "p", x1: 0, x2: L, p: egesz(2, 6) });
  if (mod === "pResz") {
    const x1 = valaszt([0, fel(1, L / 2)]);
    const x2 = x1 === 0 ? fel(L / 2, L - 1) : L;
    terhek.push({ fajta: "p", x1, x2, p: egesz(2, 6) });
  }
  return { nev: "kéttámaszú tartó", modell: vizszintesModell({ hossz: L, tamaszok: [{ x: 0, tipus: "csuklo" }, { x: L, tipus: "gorgo" }], terhek }) };
}

function konzolVeletlen() {
  const L = fel(2, 5);
  const balra = Math.random() < 0.65; // a befogás bal oldalon
  const mod = valaszt(["Fveg", "p", "FpVeg", "Fbelso", "pResz"]);
  const terhek = [];
  const veg = balra ? L : 0;
  if (mod === "Fveg" || mod === "FpVeg") terhek.push({ fajta: "F", x: veg, F: egesz(4, 14) });
  if (mod === "Fbelso") terhek.push({ fajta: "F", x: balra ? fel(1, L - 0.5) : fel(0.5, L - 1), F: egesz(4, 14) });
  if (mod === "p" || mod === "FpVeg") terhek.push({ fajta: "p", x1: 0, x2: L, p: egesz(2, 6) });
  if (mod === "pResz") terhek.push(balra ? { fajta: "p", x1: fel(1, L - 1), x2: L, p: egesz(2, 8) } : { fajta: "p", x1: 0, x2: fel(1, L - 1), p: egesz(2, 8) });
  return { nev: "befogott konzol", modell: vizszintesModell({ hossz: L, tamaszok: [{ x: balra ? 0 : L, tipus: "befogas" }], terhek }) };
}

function konzolosVeletlen() {
  const L = fel(3, 6);
  const c = fel(1, 2.5);
  const jobbra = Math.random() < 0.6; // a konzol a jobb oldalon
  const hossz = L + c;
  const tamaszok = jobbra ? [{ x: 0, tipus: "csuklo" }, { x: L, tipus: "gorgo" }] : [{ x: c, tipus: "csuklo" }, { x: hossz, tipus: "gorgo" }];
  const terhek = [];
  const mod = valaszt(["Fveg", "FvegF", "p", "FvegP"]);
  const vegX = jobbra ? hossz : 0;
  if (mod !== "p") terhek.push({ fajta: "F", x: vegX, F: egesz(4, 12) });
  if (mod === "FvegF") terhek.push({ fajta: "F", x: jobbra ? fel(1, L - 1) : c + fel(1, L - 1), F: egesz(4, 14) });
  if (mod === "p") terhek.push({ fajta: "p", x1: 0, x2: hossz, p: egesz(2, 6) });
  if (mod === "FvegP") terhek.push(jobbra ? { fajta: "p", x1: 0, x2: L, p: egesz(2, 5) } : { fajta: "p", x1: c, x2: hossz, p: egesz(2, 5) });
  return { nev: "konzolos kéttámaszú tartó", modell: vizszintesModell({ hossz, tamaszok, terhek }) };
}

function gerberVeletlen() {
  const L1 = fel(3, 5);
  const L2 = fel(3, 5);
  const g = fel(1, Math.min(2, L2 - 1.5)); // a csukló távolsága B-től
  const hossz = L1 + L2;
  const tamaszok = [{ x: 0, tipus: "csuklo" }, { x: L1, tipus: "gorgo" }, { x: hossz, tipus: "gorgo" }];
  const terhek = [];
  const mod = valaszt(["F", "Fp", "Fp"]); // a befüggesztett részen mindig van erő, különben ott üres az ábra
  terhek.push({ fajta: "F", x: L1 + g + fel(0.5, L2 - g - 0.5), F: egesz(4, 14) });
  if (mod !== "F") terhek.push({ fajta: "p", x1: 0, x2: L1, p: egesz(2, 5) });
  return { nev: "Gerber-tartó (belső csukló G-ben)", modell: vizszintesModell({ hossz, tamaszok, csuklok: [L1 + g], terhek }) };
}

function nyomatekVeletlen() {
  const konzol = Math.random() < 0.35;
  const L = konzol ? valaszt([2, 3, 4]) : valaszt([4, 5, 6, 8]);
  const M0 = L * valaszt([1, 1.5, 2, 2.5, 3]) * (Math.random() < 0.5 ? 1 : -1); // M₀/L kerek → kerek reakciók
  const terhek = [{ fajta: "M", x: konzol ? fel(0.5, L - 0.5) : fel(1, L - 1), M: M0 }];
  if (konzol) terhek.push({ fajta: "F", x: L, F: egesz(3, 10) });
  else {
    let x = valaszt([L / 2, L / 4, (3 * L) / 4].filter((v) => Math.abs(v * 2 - Math.round(v * 2)) < 1e-9));
    if (Math.abs(x - terhek[0].x) < 0.75) x = x + 1 <= L - 0.5 ? x + 1 : x - 1;
    terhek.push({ fajta: "F", x, F: egesz(2, 8) * 2 });
  }
  const tamaszok = konzol ? [{ x: 0, tipus: "befogas" }] : [{ x: 0, tipus: "csuklo" }, { x: L, tipus: "gorgo" }];
  return { nev: konzol ? "konzol koncentrált nyomatékkal" : "kéttámaszú tartó koncentrált nyomatékkal", modell: vizszintesModell({ hossz: L, tamaszok, terhek }) };
}

function ujKor(kor) {
  const lista = kor <= 1 ? [kettamaszuVeletlen] : kor === 2 ? [konzolVeletlen, kettamaszuVeletlen] : kor === 3 ? [konzolosVeletlen, nyomatekVeletlen] : kor === 4 ? [gerberVeletlen, konzolosVeletlen] : [gerberVeletlen, nyomatekVeletlen, konzolosVeletlen];
  let utolso = null;
  for (let p = 0; p < 80; p++) {
    const f = feldolgoz(valaszt(lista)());
    if (!f || f.szakaszok.length > 5 || f.maxV > 60 || f.maxM > 120) continue;
    utolso = f;
    if (f.kerekE) return f;
  }
  return utolso ?? feldolgoz({ nev: "kéttámaszú tartó", modell: vizszintesModell({ hossz: 6, tamaszok: [{ x: 0, tipus: "csuklo" }, { x: 6, tipus: "gorgo" }], terhek: [{ fajta: "F", x: 2, F: 12 }] }) });
}

/** Szép lépték a tengelyfeliratokhoz. */
function szepLepes(max) {
  const cel = max / 2.5;
  const lehet = [0.5, 1, 2, 2.5, 5, 10, 20, 25, 50, 100];
  return lehet.reduce((l, v) => (Math.abs(v - cel) < Math.abs(l - cel) ? v : l), lehet[0]);
}

/* ---------------- a rajzolt (tipp) és a pontos görbék mintavételezése ---------------- */

/** A szakasz tényleges alakja: ahol szélsőérték-fogópont van, azt a három pontra illesztett parabola dönti el. */
function alakTenyleges(f, tipp, alak) {
  return f.szakaszok.map((s, i) => {
    if (s.iSzelso === null) return alak[i];
    const v1 = tipp.M[s.iKezd].jobb, vs = tipp.M[s.iSzelso].jobb, v2 = tipp.M[s.iVeg].bal;
    const t = (s.szelsoX - s.x1) / (s.x2 - s.x1);
    const chord = v1 + (v2 - v1) * t;
    const elt = vs - chord;
    return Math.abs(elt) < 1e-9 ? "egyenes" : elt > 0 ? "U" : "A";
  });
}

function tippGorbe(f, tipp, alak, jel) {
  // szakaszonként [x, érték] pontok; ugrásnál a szakaszhatáron két pont
  const gorbek = [];
  f.szakaszok.forEach((s, i) => {
    const v1 = tipp[jel][s.iKezd]?.jobb ?? 0;
    const v2 = tipp[jel][s.iVeg]?.bal ?? 0;
    const pontok = [];
    const n = 20; // egyenesnél is sűrű minta, hogy a ráúszás parabolába is át tudjon menni
    const haromPont = jel === "M" && s.iSzelso !== null;
    const parab = jel === "M" && !haromPont && alak[i] !== "egyenes";
    // a parabola belógása: |q|·l²/8, terheletlen szakaszon látható alapérték
    let fMag = Math.abs(s.q) * s.hosszM * s.hosszM / 8;
    if (fMag < 1e-9) fMag = 0.12 * f.maxM;
    const elojel = alak[i] === "U" ? 1 : -1;
    // három ponton átmenő parabola (Lagrange): a szélsőérték-fogópont a t_s helyen
    const vs = haromPont ? tipp.M[s.iSzelso].jobb : 0;
    const ts = haromPont ? (s.szelsoX - s.x1) / (s.x2 - s.x1) : 0.5;
    for (let k = 0; k <= n; k++) {
      const t = k / n;
      let v;
      if (haromPont) {
        v = (v1 * (t - ts) * (t - 1)) / ((0 - ts) * (0 - 1)) + (vs * (t - 0) * (t - 1)) / ((ts - 0) * (ts - 1)) + (v2 * (t - 0) * (t - ts)) / ((1 - 0) * (1 - ts));
      } else {
        v = v1 + (v2 - v1) * t;
        if (parab) v += elojel * fMag * 4 * t * (1 - t);
      }
      pontok.push([s.x1 + (s.x2 - s.x1) * t, v]);
    }
    gorbek.push(pontok);
  });
  return gorbek;
}

function pontosGorbe(f, jel) {
  return f.szakaszok.map((s) => {
    const n = 20;
    const pontok = [];
    for (let k = 0; k <= n; k++) {
      const x = s.x1 + (s.x2 - s.x1) * (k / n);
      pontok.push([x, poli(s[jel], x - s.lok)]);
    }
    return pontok;
  });
}

function leptekek(f) {
  const PX = (X1 - X0) / f.hossz;
  const kx = (x) => X0 + x * PX;
  const hatarV = Math.max(f.maxV * 1.25, 2);
  const hatarM = Math.max(f.maxM * 1.25, 2);
  const lV = (FEL_V - 8) / hatarV;
  const lM = (FEL_M - 8) / hatarM;
  // V pozitív felfelé, M pozitív lefelé (húzott oldal)
  const yV = (v) => YV - v * lV;
  const yM = (v) => YM + v * lM;
  return { PX, kx, yV, yM, lV, lM, hatarV, hatarM, lepesV: szepLepes(hatarV), lepesM: szepLepes(hatarM) };
}

/** A rajzolt és a pontos görbe keveréke (anim: 0 = a tipp, 1 = a pontos) SVG-útvonalként. */
function gorbekSzamol(f, g, tipp, alak, anim) {
  const ki = {};
  for (const jel of ["V", "M"]) {
    const tg = tippGorbe(f, tipp, alak, jel);
    const pg = pontosGorbe(f, jel);
    const y = jel === "V" ? g.yV : g.yM;
    // a két görbe ugyanazon az x-rácson van, így a ráúszás egyszerű keverés
    const kevert = tg.map((szak, i) => szak.map((p, k) => [g.kx(p[0]), y(p[1] + (pg[i][k][1] - p[1]) * anim)]));
    const vonal = kevert.map((szak, i) => {
      const elozo = i > 0 ? kevert[i - 1][kevert[i - 1].length - 1] : null;
      return (elozo ? `M ${elozo[0]} ${elozo[1]} L ` : "M ") + szak.map((p) => `${p[0]} ${p[1]}`).join(" L ");
    }).join(" ");
    const tengelyY = y(0);
    const terulet = kevert.map((szak) => `M ${szak[0][0]} ${tengelyY} ` + szak.map((p) => `L ${p[0]} ${p[1]}`).join(" ") + ` L ${szak[szak.length - 1][0]} ${tengelyY} Z`).join(" ");
    const kezdo = kevert[0][0], vegso = kevert[kevert.length - 1][kevert[kevert.length - 1].length - 1];
    ki[jel] = { vonal: `M ${kezdo[0]} ${tengelyY} L ${vonal.slice(2)} L ${vegso[0]} ${tengelyY}`, terulet };
  }
  return ki;
}

/** A játéktér rajza (tiszta komponens, a teszt is ezt rendereli). */
export function JatekRajz({ svgRef, f, g, rajz, gorbek, tipp, alakT, ellenorizve, eredmeny, segitseg, aktiv, huzas, anim, fogoSzin }) {
  return (
        <div className="racs-vilagos overflow-hidden rounded-xl border border-[color:var(--keret)]">
          <svg ref={svgRef} viewBox={`0 0 ${SZ} ${MA}`} className="abra h-auto w-full select-none" style={{ touchAction: "none" }}>
            <TartoHegyek />
            {/* ---- a tartó ---- */}
            <SzerkezetRajz m={f.m} kx={rajz.kx} ky={rajz.ky} cimkek={f.cimkek} />
            <TerhekRajz modell={f.modell} m={f.m} kx={rajz.kx} ky={rajz.ky} />
            {(segitseg || ellenorizve) && <ReakciokRajz eredmeny={f.e} kx={rajz.kx} ky={rajz.ky} />}
            <Meretlanc xs={f.torespontok.map((p) => p.x)} y={YT + 62} kx={g.kx} />
            {f.modell.csuklok?.map((x) => (
              <text key={x} x={g.kx(x)} y={YT - 12} textAnchor="middle" fontSize="12" fontWeight="700" fontStyle="italic" style={{ fill: "#1d3c48" }}>G</text>
            ))}

            {/* ---- V és M sáv ---- */}
            {["V", "M"].map((jel) => {
              const y0 = jel === "V" ? YV : YM;
              const felM = jel === "V" ? FEL_V : FEL_M;
              const y = jel === "V" ? g.yV : g.yM;
              const lepes = jel === "V" ? g.lepesV : g.lepesM;
              const hatar = jel === "V" ? g.hatarV : g.hatarM;
              const ticks = [];
              for (let v = -Math.floor(hatar / lepes) * lepes; v <= hatar + 1e-9; v += lepes) ticks.push(Math.round(v * 100) / 100);
              const szin = DSZIN[jel];
              return (
                <g key={jel}>
                  <rect x={X0 - 6} y={y0 - felM} width={X1 - X0 + 12} height={2 * felM} fill="white" fillOpacity="0.55" rx="6" />
                  {ticks.map((v) => (
                    <g key={v}>
                      <line x1={X0 - 4} y1={y(v)} x2={X1 + 4} y2={y(v)} stroke={v === 0 ? "#64748b" : "#cbd5e1"} strokeWidth={v === 0 ? 1.4 : 0.8} strokeDasharray={v === 0 ? undefined : "3 3"} />
                      <text x={X0 - 10} y={y(v) + 3.5} textAnchor="end" fontSize="10" style={{ fill: "#64748b" }}>{sz(v, v % 1 ? 1 : 0)}</text>
                    </g>
                  ))}
                  <text x={14} y={y0 - felM + 14} fontSize="13" fontWeight="700" style={{ fill: szin }}>{jel}</text>
                  <text x={14} y={y0 - felM + 28} fontSize="10" style={{ fill: "#64748b" }}>[{jel === "V" ? "kN" : "kNm"}]</text>
                  <text x={14} y={y0 + felM - 4} fontSize="9.5" style={{ fill: "#94a3b8" }}>{jel === "V" ? "+ felfelé" : "+ lefelé"}</text>
                  {/* töréspont-függőlegesek; a V = 0 hely jele */}
                  {f.torespontok.map((p) => (
                    <line key={p.x} x1={g.kx(p.x)} y1={y0 - felM + 4} x2={g.kx(p.x)} y2={y0 + felM - 4} stroke={p.szelso ? "#f59e0b" : "#94a3b8"} strokeWidth="0.8" strokeDasharray="2 3" />
                  ))}
                  {jel === "V" && f.torespontok.filter((p) => p.szelso).map((p) => (
                    <g key={`sz${p.x}`}>
                      <circle cx={g.kx(p.x)} cy={y0} r="4" fill="#f59e0b" stroke="white" strokeWidth="1.5" />
                      <text x={g.kx(p.x)} y={y0 - felM + 13} textAnchor="middle" fontSize="10" fontWeight="700" style={{ fill: "#b45309" }}>V = 0</text>
                    </g>
                  ))}
                  {jel === "M" && f.torespontok.filter((p) => p.szelso).map((p) => (
                    <text key={`szm${p.x}`} x={g.kx(p.x)} y={y0 - felM + 13} textAnchor="middle" fontSize="10" fontWeight="700" style={{ fill: "#b45309" }}>M szélső</text>
                  ))}
                  {/* a görbe */}
                  <path d={gorbek[jel].terulet} fill={szin} fillOpacity={ellenorizve ? 0.1 + 0.1 * anim : 0.1} stroke="none" />
                  <path d={gorbek[jel].vonal} fill="none" stroke={szin} strokeWidth={ellenorizve ? 2.4 : 2} strokeLinejoin="round" style={{ transition: "stroke-width 0.3s" }} />
                  {/* a szakaszok alakjának jele (M) */}
                  {jel === "M" && f.szakaszok.map((s, i) => (
                    <text key={i} x={g.kx((s.x1 + s.x2) / 2)} y={y0 + felM - 5} textAnchor="middle" fontSize="10.5" fontWeight="700" style={{ fill: ellenorizve ? (alakT[i] === s.alakM ? "#15803d" : "#dc2626") : "#64748b" }}>
                      {i + 1}. {alakT[i] === "egyenes" ? "—" : alakT[i] === "U" ? "∪" : "∩"}
                    </text>
                  ))}
                  {/* fogópontok */}
                  {f.torespontok.map((p, i) =>
                    p[jel].fogok.map((o) => {
                      const v = tipp[jel][i][o];
                      const ketto = p[jel].fogok.length === 2;
                      const X = g.kx(p.x) + (ketto ? (o === "bal" ? -9 : 9) : 0);
                      const Y = y(v);
                      const szinF = fogoSzin(jel, i, o);
                      const zart = ellenorizve || (jel === "V" && segitseg);
                      const r = eredmeny?.reszletek.find((q) => q.jel === jel && q.i === i && q.oldal === o);
                      // ellenőrzés után a hibás fogópont mellett a helyes érték áll (pirossal)
                      const felirat = ellenorizve && r && !r.jo ? sz(r.helyes, Math.abs(r.helyes % 1) > 1e-9 ? 1 : 0) : sz(v, Math.abs(v % 1) > 1e-9 ? 1 : 0);
                      const balra = ketto ? o === "bal" : p.x > f.hossz * 0.8;
                      return (
                        <g key={`${i}${o}`} onPointerDown={zart ? undefined : huzas(jel, i, o)} style={{ cursor: zart ? "default" : "ns-resize", touchAction: "none" }}>
                          <line x1={g.kx(p.x)} y1={y(0)} x2={X} y2={Y} stroke={szinF} strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
                          <circle cx={X} cy={Y} r="16" fill="transparent" />
                          <circle cx={X} cy={Y} r={aktiv === `${jel}${i}${o}` ? 9.5 : 7.5} fill={ellenorizve ? szinF : "white"} stroke={szinF} strokeWidth="2.5" style={{ transition: "r 0.15s" }} />
                          {!zart && <path d={`M ${X - 3} ${Y - 11} l 3 -4 l 3 4 M ${X - 3} ${Y + 11} l 3 4 l 3 -4`} fill="none" stroke={szinF} strokeWidth="1.4" />}
                          <text x={balra ? X - 12 : X + 12} y={Y + 4} textAnchor={balra ? "end" : "start"} fontSize="11" fontWeight="700" style={{ fill: szinF, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
                            {felirat}
                          </text>
                        </g>
                      );
                    }),
                  )}
                </g>
              );
            })}
          </svg>
        </div>
  );
}

/* ---------------- a játék ---------------- */

export default function JatekAbrarajzolo() {
  const [kor, setKor] = useState(1);
  const [f, setF] = useState(null);
  const [fazis, setFazis] = useState("rajzol"); // rajzol | ellenoriz | kesz
  const [tipp, setTipp] = useState({ V: [], M: [] });
  const [alak, setAlak] = useState([]);
  const [segitseg, setSegitseg] = useState(false);
  const [pontok, setPontok] = useState([]);
  const [anim, setAnim] = useState(0); // 0: a tipp, 1: a pontos ábra
  const [aktiv, setAktiv] = useState(null); // a húzott fogópont
  const [eredmeny, setEredmeny] = useState(null);
  const svgRef = useRef(null);
  const rafRef = useRef(null);

  const inditKor = useCallback((k) => {
    const uj = ujKor(k);
    setF(uj);
    setTipp({ V: uj.torespontok.map(() => ({ bal: 0, jobb: 0 })), M: uj.torespontok.map(() => ({ bal: 0, jobb: 0 })) });
    setAlak(uj.szakaszok.map(() => "egyenes"));
    setSegitseg(false);
    setAnim(0);
    setEredmeny(null);
    setFazis("rajzol");
  }, []);

  useEffect(() => {
    inditKor(1);
  }, [inditKor]);

  /* léptékek */
  const g = useMemo(() => (f ? leptekek(f) : null), [f]);
  const rajz = useMemo(() => (f ? geometria(f.m, { SZ, bal: X0, jobb: SZ - X1, fel: YT, le: 0, maxPX: 1e9, minPX: 1 }) : null), [f]);

  /* fogópont húzása */
  const huzas = (jel, i, oldal) => (e) => {
    if (fazis !== "rajzol" || !f || (jel === "V" && segitseg)) return;
    e.preventDefault();
    e.stopPropagation();
    const svg = svgRef.current;
    if (!svg) return;
    const cel = e.currentTarget;
    try { cel.setPointerCapture(e.pointerId); } catch { /* régi böngésző */ }
    setAktiv(`${jel}${i}${oldal}`);
    const mozgat = (esem) => {
      const r = svg.getBoundingClientRect();
      const py = ((esem.clientY - r.top) / r.height) * MA;
      let v = jel === "V" ? (YV - py) / g.lV : (py - YM) / g.lM;
      v = clamp(kerek(v), -(jel === "V" ? g.hatarV : g.hatarM), jel === "V" ? g.hatarV : g.hatarM);
      setTipp((t) => {
        const lista = t[jel].map((p) => ({ ...p }));
        const p = f.torespontok[i][jel];
        if (p.fogok.length === 1) lista[i] = { bal: v, jobb: v };
        else lista[i][oldal] = v;
        return { ...t, [jel]: lista };
      });
    };
    mozgat(e);
    // a figyelők az ablakon: pointer capture-rel és anélkül is megkapjuk a mozgást
    const vege = (esem) => {
      window.removeEventListener("pointermove", mozgat);
      window.removeEventListener("pointerup", vege);
      window.removeEventListener("pointercancel", vege);
      try { cel.releasePointerCapture(esem.pointerId); } catch { /* semmi */ }
      setAktiv(null);
    };
    window.addEventListener("pointermove", mozgat);
    window.addEventListener("pointerup", vege);
    window.addEventListener("pointercancel", vege);
  };

  const segit = () => {
    if (!f || fazis !== "rajzol") return;
    setSegitseg(true);
    setTipp((t) => ({ ...t, V: f.torespontok.map((p) => ({ bal: p.V.bal ?? p.V.jobb, jobb: p.V.jobb ?? p.V.bal })) }));
  };

  /* pontozás */
  const ellenoriz = () => {
    if (!f || fazis !== "rajzol") return;
    const hibak = []; // [hiba, súly] — a nulla értékű fogópontok fele súllyal (a nulla tipp ne érjen sokat)
    const reszletek = [];
    for (const jel of ["V", "M"]) {
      if (jel === "V" && segitseg) continue;
      const ref = 0.15 * (jel === "V" ? f.maxV : f.maxM);
      f.torespontok.forEach((p, i) => {
        for (const o of p[jel].fogok) {
          const helyes = p[jel][o];
          const t = tipp[jel][i][o];
          const h = Math.min(1, Math.abs(t - helyes) / Math.max(Math.abs(helyes), ref));
          hibak.push([h, Math.abs(helyes) < 1e-9 ? 0.5 : 1]);
          reszletek.push({ jel, i, oldal: o, x: p.x, helyes, tipp: t, jo: h <= 0.1 });
        }
      });
    }
    const teny = alakTenyleges(f, tipp, alak);
    const alakHibak = f.szakaszok.map((s, i) => (teny[i] !== s.alakM ? { i, helyes: s.alakM, tipp: teny[i], q: s.q } : null)).filter(Boolean);
    const sulyOssz = hibak.reduce((a, b) => a + b[1], 0);
    const atlag = sulyOssz ? hibak.reduce((a, b) => a + b[0] * b[1], 0) / sulyOssz : 0;
    let pont = Math.max(0, 100 * (1 - atlag) - 8 * alakHibak.length);
    if (segitseg) pont *= 0.5;
    pont = Math.round(pont);
    setPontok((l) => [...l, pont]);
    setEredmeny({ pont, reszletek, alakHibak, atlag });
    setFazis("ellenoriz");
  };

  // a pontos ábra ráúszása
  useEffect(() => {
    if (fazis !== "ellenoriz") return undefined;
    let kezdet = null;
    const lep = (most) => {
      if (kezdet == null) kezdet = most;
      const t = Math.min(1, (most - kezdet) / 900);
      const u = 1 - Math.pow(1 - t, 3);
      setAnim(u);
      if (t < 1) rafRef.current = requestAnimationFrame(lep);
    };
    rafRef.current = requestAnimationFrame(lep);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [fazis]);

  const kovetkezo = () => {
    if (kor >= OSSZ_KOR) { setFazis("kesz"); return; }
    setKor(kor + 1);
    inditKor(kor + 1);
  };

  const ujJatek = useCallback(() => {
    setKor(1);
    setPontok([]);
    inditKor(1);
  }, [inditKor]);

  const atlag = pontok.length ? pontok.reduce((s, p) => s + p, 0) / pontok.length : 0;
  const kesz = fazis === "kesz";
  const ellenorizve = fazis !== "rajzol";

  /* görbék */
  const gorbek = useMemo(() => (f && g ? gorbekSzamol(f, g, tipp, alak, anim) : null), [f, g, tipp, alak, anim]);

  let uzenet = null;
  if (f && fazis === "rajzol") {
    uzenet = (
      <>
        <strong>{kor}. kör – {f.nev}.</strong> Húzd a fogópontokat a töréspontoknál a helyes értékre (V: pozitív felfelé; M: pozitív, azaz húzott oldal lefelé), a szakaszok alakját az M-nél a gombokkal állítsd be.
        {f.torespontok.some((p) => p.szelso) ? " A narancs jelnél V = 0: ott az M szélsőértékét is be kell állítanod." : ""}
        {segitseg ? " A V-ábra készen van, csak az M-et rajzold — a kör pontja feleződik." : ""}
      </>
    );
  } else if (f && eredmeny) {
    const rosszak = eredmeny.reszletek.filter((r) => !r.jo);
    uzenet = (
      <>
        <span className="szamok font-semibold">{eredmeny.pont} pont.</span>{" "}
        {rosszak.length === 0 && eredmeny.alakHibak.length === 0
          ? "Hibátlan ábra — a pontos vonal pontosan a tiédre úszott."
          : `${rosszak.length} fogópont hibás, ${eredmeny.alakHibak.length} szakasz alakja hibás — a pirosak mellett a helyes érték.`}
        {eredmeny.alakHibak.map((h) => (
          <span key={h.i} className="block text-[12.5px] text-petrol-600">
            {h.i + 1}. szakasz: {h.helyes === "egyenes" ? "terheletlen szakaszon az M egyenes (a V állandó)" : h.helyes === "U" ? "lefelé mutató megoszló teher alatt az M parabola lefelé domborodik (∪, a teher irányába lóg)" : "felfelé mutató teher alatt az M parabola felfelé domborodik (∩)"}.
          </span>
        ))}
      </>
    );
  }

  const alakT = useMemo(() => (f ? alakTenyleges(f, tipp, alak) : []), [f, tipp, alak]);

  const fogoSzin = (jel, i, o) => {
    if (!ellenorizve || !eredmeny) return DSZIN[jel];
    const r = eredmeny.reszletek.find((q) => q.jel === jel && q.i === i && q.oldal === o);
    if (!r) return "#94a3b8";
    return r.jo ? "#15803d" : "#dc2626";
  };

  return (
    <JatekKeret cim="Rajzold meg a V és az M ábrát!" leiras="Öt kör, körönként egy véletlen tartó. A program megadja a töréspontokat, te a fogópontokkal beállítod az értékeket és a szakaszok alakját — ellenőrzéskor a pontos ábra ráúszik a tiédre." pont={atlag} kor={kor} osszKor={OSSZ_KOR} kesz={kesz} onUj={ujJatek} uzenet={uzenet}>
      {f && g && rajz && gorbek && (
        <JatekRajz svgRef={svgRef} f={f} g={g} rajz={rajz} gorbek={gorbek} tipp={tipp} alakT={alakT} ellenorizve={ellenorizve} eredmeny={eredmeny} segitseg={segitseg} aktiv={aktiv} huzas={huzas} anim={anim} fogoSzin={fogoSzin} />
      )}

      {/* alak-választók az M szakaszaira */}
      {f && (
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="text-[11px] font-bold tracking-[0.14em] text-petrol-500 uppercase">M-szakaszok alakja</span>
          {f.szakaszok.map((s, i) => (
            <div key={i} className="flex items-center gap-1">
              <span className="szamok text-[12px] text-petrol-600">{i + 1}. ({sz(s.x1, s.x1 % 1 ? 1 : 0)}–{sz(s.x2, s.x2 % 1 ? 1 : 0)} m)</span>
              {s.iSzelso !== null && <span className="text-[11px] text-petrol-500">a szélsőérték-fogópont dönti el ({alakT[i] === "egyenes" ? "—" : alakT[i] === "U" ? "∪" : "∩"})</span>}
              {s.iSzelso === null && [["egyenes", "—"], ["U", "∪"], ["A", "∩"]].map(([id, jel]) => (
                <button
                  key={id}
                  type="button"
                  disabled={ellenorizve}
                  onClick={() => setAlak((a) => a.map((v, k) => (k === i ? id : v)))}
                  className={`h-8 min-w-8 rounded-md px-2 text-[14px] font-bold transition disabled:cursor-default ${alak[i] === id ? "bg-petrol-800 text-white" : "bg-white text-petrol-700 ring-1 ring-petrol-200 hover:bg-petrol-50"} ${ellenorizve && s.alakM === id ? "ring-2 ring-emerald-500" : ""}`}
                  title={id === "egyenes" ? "egyenes (terheletlen szakasz)" : id === "U" ? "parabola, lefelé domborodó" : "parabola, felfelé domborodó"}
                >
                  {jel}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {fazis === "rajzol" && (
          <button type="button" onClick={ellenoriz} className="rounded-lg bg-petrol-800 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-petrol-900">
            Ellenőrzés
          </button>
        )}
        {fazis === "rajzol" && !segitseg && (
          <button type="button" onClick={segit} className="rounded-lg bg-white px-4 py-2 text-[13px] font-medium text-petrol-700 ring-1 ring-petrol-200 transition hover:bg-petrol-50">
            Segítség: reakciók + V-ábra (félpontért)
          </button>
        )}
        {fazis === "ellenoriz" && (
          <button type="button" onClick={kovetkezo} className="rounded-lg bg-naracs-500 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-naracs-600">
            {kor >= OSSZ_KOR ? "Eredmény" : "Következő kör →"}
          </button>
        )}
        {pontok.length > 0 && <span className="szamok text-[12px] text-petrol-500">eddigi körök: {pontok.join(" · ")}</span>}
      </div>
    </JatekKeret>
  );
}

/* a tesztekhez */
export const _teszt = { ujKor, feldolgoz, tippGorbe, pontosGorbe, alakTenyleges, leptekek, gorbekSzamol, kettamaszuVeletlen, konzolVeletlen, konzolosVeletlen, gerberVeletlen, nyomatekVeletlen };
