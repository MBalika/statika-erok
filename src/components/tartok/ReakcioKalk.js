"use client";

import { useState } from "react";
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
  ReakcioNyil,
  MegoszloTeher,
  KoncentraltNyomatek,
  Meret,
  TamaszCimke,
  SZIN,
} from "./TartoElemek";

const EPSZ = 1e-9;
const rad = (fok) => (fok * Math.PI) / 180;

/* ==================================================================
   Tiszta számítás – a komponensen kívül, hogy Node-ban is tesztelhető
   ================================================================== */

/** Egy teher eredője: { Fx, Fy, x, y, M } – az erő az (x, 0) pontban hat, M koncentrált nyomaték. */
export function teherEredo(t) {
  if (t.tipus === "ero") {
    return { Fx: t.F * Math.cos(rad(t.alfa)), Fy: t.F * Math.sin(rad(t.alfa)), x: t.x, M: 0, cimke: "F" };
  }
  if (t.tipus === "megoszlo") {
    const l = t.x2 - t.x1;
    const Q = ((t.p1 + t.p2) / 2) * l; // pozitív p = lefelé
    const xq = Math.abs(t.p1 + t.p2) > EPSZ ? t.x1 + (l * (t.p1 + 2 * t.p2)) / (3 * (t.p1 + t.p2)) : (t.x1 + t.x2) / 2;
    return { Fx: 0, Fy: -Q, x: xq, M: 0, Q, cimke: "p" };
  }
  return { Fx: 0, Fy: 0, x: t.x, M: t.M, cimke: "M" };
}

/** A terhek nyomatéka a P = (Px, Py) pontra (óramutatóval ellentétes pozitív). */
function terhekNyomateka(eredok, Px, Py) {
  return eredok.reduce((s, e) => s + (e.x - Px) * e.Fy + Py * e.Fx + e.M, 0);
}

/**
 * Ismeretlenek: { id, tex, fajta: "ero" | "nyomatek", P: [x, y], e: [ex, ey] }.
 * Megoldja a három egyensúlyi egyenletet (Cramer-szabály). Visszaad: { ertekek: {id: érték}, det }.
 */
export function megoldMatrix(ismeretlenek, eredok) {
  const oszlop = (u) => (u.fajta === "nyomatek" ? [0, 0, 1] : [u.e[0], u.e[1], u.P[0] * u.e[1] - u.P[1] * u.e[0]]);
  const A = ismeretlenek.map(oszlop); // A[j] = j-edik oszlop
  const b = [-eredok.reduce((s, e) => s + e.Fx, 0), -eredok.reduce((s, e) => s + e.Fy, 0), -terhekNyomateka(eredok, 0, 0)];
  const det3 = (c0, c1, c2) => c0[0] * (c1[1] * c2[2] - c1[2] * c2[1]) - c1[0] * (c0[1] * c2[2] - c0[2] * c2[1]) + c2[0] * (c0[1] * c1[2] - c0[2] * c1[1]);
  const det = det3(A[0], A[1], A[2]);
  const ertekek = {};
  if (Math.abs(det) < 1e-9) return { ertekek, det: 0 };
  ismeretlenek.forEach((u, j) => {
    const cols = A.map((c, i) => (i === j ? b : c));
    ertekek[u.id] = det3(cols[0], cols[1], cols[2]) / det;
  });
  return { ertekek, det };
}

/** A szerkezet leírásából ismeretlenek listája. */
export function ismeretlenekSzerkezetbol(szk) {
  if (szk.tipus === "konzol") {
    const xA = szk.oldal === "bal" ? 0 : szk.L;
    return [
      { id: "Ax", tex: "A_x", fajta: "ero", P: [xA, 0], e: [1, 0] },
      { id: "Ay", tex: "A_y", fajta: "ero", P: [xA, 0], e: [0, 1] },
      { id: "MA", tex: "M_A", fajta: "nyomatek", P: [xA, 0], e: [0, 0] },
    ];
  }
  if (szk.tipus === "kettamaszu") {
    const fi = rad(90 + szk.szog);
    return [
      { id: "Ax", tex: "A_x", fajta: "ero", P: [szk.xA, 0], e: [1, 0] },
      { id: "Ay", tex: "A_y", fajta: "ero", P: [szk.xA, 0], e: [0, 1] },
      { id: "B", tex: "B", fajta: "ero", P: [szk.xB, 0], e: [Math.cos(fi), Math.sin(fi)] },
    ];
  }
  // csukló + rúd
  const dx = szk.xW - szk.xC;
  const dy = szk.yW;
  const h = Math.hypot(dx, dy) || 1;
  return [
    { id: "Ax", tex: "A_x", fajta: "ero", P: [szk.xA, 0], e: [1, 0] },
    { id: "Ay", tex: "A_y", fajta: "ero", P: [szk.xA, 0], e: [0, 1] },
    { id: "S", tex: "S", fajta: "ero", P: [szk.xC, 0], e: [dx / h, dy / h] },
  ];
}

const z = (v, t = 2) => (v < 0 ? `(${szK(v, t)})` : szK(v, t));

/** Nyomatéki egyenlet szövege a P pontra: terhek + kar·U = 0 ⇒ U. */
function nyomatekiEgyenlet(nev, P, eredok, u, ertek) {
  const tagok = [];
  let osszeg = 0;
  for (const e of eredok) {
    const dx = e.x - P[0];
    if (Math.abs(e.Fy) > EPSZ && Math.abs(dx) > EPSZ) {
      tagok.push(`${z(dx)}\\cdot ${z(e.Fy)}`);
      osszeg += dx * e.Fy;
    }
    if (Math.abs(e.Fx) > EPSZ && Math.abs(P[1]) > EPSZ) {
      tagok.push(`${z(P[1])}\\cdot ${z(e.Fx)}`);
      osszeg += P[1] * e.Fx;
    }
    if (Math.abs(e.M) > EPSZ) {
      tagok.push(z(e.M));
      osszeg += e.M;
    }
  }
  const kar = u.fajta === "nyomatek" ? 1 : (u.P[0] - P[0]) * u.e[1] - (u.P[1] - P[1]) * u.e[0];
  const bal = tagok.length ? tagok.join(" + ") : "0";
  const karTex = u.fajta === "nyomatek" ? "" : `${z(kar)}\\cdot `;
  return {
    tex: `\\Mp{${nev}}\\ ${bal} + ${karTex}${u.tex} = 0`,
    megoldas:
      u.fajta === "nyomatek"
        ? `${u.tex} = ${szK(ertek, 2)}\\ \\text{kNm}`
        : `${u.tex} = \\frac{${szK(-osszeg, 2)}}{${szK(kar, 2)}} = ${szK(ertek, 2)}\\ \\text{kN}`,
    kar,
  };
}

/** Vetületi egyenlet (x vagy y) szövege: terhek + Σ e·U = 0. */
function vetuletiEgyenlet(irany, eredok, ismeretlenek, ertekek, cel) {
  const idx = irany === "x" ? 0 : 1;
  const tagok = [];
  let osszeg = 0;
  for (const e of eredok) {
    const v = irany === "x" ? e.Fx : e.Fy;
    if (Math.abs(v) > EPSZ) {
      tagok.push(z(v));
      osszeg += v;
    }
  }
  const ismertek = [];
  for (const u of ismeretlenek) {
    if (u.fajta === "nyomatek" || u.id === cel.id) continue;
    const c = u.e[idx];
    if (Math.abs(c) > EPSZ) {
      ismertek.push(Math.abs(c - 1) < EPSZ ? u.tex : `${z(c)}\\cdot ${u.tex}`);
      osszeg += c * ertekek[u.id];
    }
  }
  const celEgy = cel.e[idx];
  const celTex = Math.abs(celEgy - 1) < EPSZ ? cel.tex : `${z(celEgy)}\\cdot ${cel.tex}`;
  const bal = [...tagok, ...ismertek].join(" + ") || "0";
  return {
    tex: `${irany === "x" ? "\\Fx" : "\\Fy"}\\ ${bal} + ${celTex} = 0`,
    megoldas: `${cel.tex} = ${szK(ertekek[cel.id], 2)}\\ \\text{kN}`,
    hasznaltIsmertet: ismertek.length > 0,
  };
}

/** Ellenőrző egyenlet: minden tag ismert, az összeg ≈ 0. */
function ellenorzoEgyenlet(fajta, nev, P, eredok, ismeretlenek, ertekek) {
  const tagok = [];
  let osszeg = 0;
  if (fajta === "M") {
    for (const e of eredok) {
      const dx = e.x - P[0];
      if (Math.abs(e.Fy) > EPSZ && Math.abs(dx) > EPSZ) {
        tagok.push(`${z(dx)}\\cdot ${z(e.Fy)}`);
        osszeg += dx * e.Fy;
      }
      if (Math.abs(e.Fx) > EPSZ && Math.abs(P[1]) > EPSZ) {
        tagok.push(`${z(P[1])}\\cdot ${z(e.Fx)}`);
        osszeg += P[1] * e.Fx;
      }
      if (Math.abs(e.M) > EPSZ) {
        tagok.push(z(e.M));
        osszeg += e.M;
      }
    }
    for (const u of ismeretlenek) {
      const kar = u.fajta === "nyomatek" ? 1 : (u.P[0] - P[0]) * u.e[1] - (u.P[1] - P[1]) * u.e[0];
      if (Math.abs(kar) > EPSZ) {
        tagok.push(u.fajta === "nyomatek" ? z(ertekek[u.id]) : `${z(kar)}\\cdot ${z(ertekek[u.id])}`);
        osszeg += kar * ertekek[u.id];
      }
    }
    return { tex: `\\Mp{${nev}}\\ ${tagok.join(" + ") || "0"} = ${szK(Math.abs(osszeg) < 5e-3 ? 0 : osszeg, 2)}\\ \\checkmark`, osszeg };
  }
  const idx = fajta === "x" ? 0 : 1;
  for (const e of eredok) {
    const v = idx === 0 ? e.Fx : e.Fy;
    if (Math.abs(v) > EPSZ) {
      tagok.push(z(v));
      osszeg += v;
    }
  }
  for (const u of ismeretlenek) {
    if (u.fajta === "nyomatek") continue;
    const c = u.e[idx];
    if (Math.abs(c) > EPSZ) {
      tagok.push(Math.abs(c - 1) < EPSZ ? z(ertekek[u.id]) : `${z(c)}\\cdot ${z(ertekek[u.id])}`);
      osszeg += c * ertekek[u.id];
    }
  }
  return { tex: `${idx === 0 ? "\\Fx" : "\\Fy"}\\ ${tagok.join(" + ") || "0"} = ${szK(Math.abs(osszeg) < 5e-3 ? 0 : osszeg, 2)}\\ \\checkmark`, osszeg };
}

/**
 * A teljes számítás: reakciók + egyismeretlenes egyenletek a tankönyvi írásmóddal.
 * Visszaad: { ertekek, lepesek: [{cim, tex, megoldas}], ellenorzes, hiba }
 */
export function reakciokAltalanos(szk, terhek) {
  const eredok = terhek.map(teherEredo);
  const ismeretlenek = ismeretlenekSzerkezetbol(szk);
  const { ertekek, det } = megoldMatrix(ismeretlenek, eredok);
  if (det === 0) return { ertekek: {}, lepesek: [], hiba: "A három reakció hatásvonala egy ponton megy át vagy párhuzamos — ez a szerkezet nem tartó (a 7. fejezet szerint határozatlan)." };
  const [Ax, Ay, U] = ismeretlenek;
  const lepesek = [];
  let ellenorzes;

  if (szk.tipus === "konzol") {
    const xA = Ax.P[0];
    const nev = "A";
    const vx = vetuletiEgyenlet("x", eredok, ismeretlenek, ertekek, Ax);
    const vy = vetuletiEgyenlet("y", eredok, ismeretlenek, ertekek, Ay);
    const m = nyomatekiEgyenlet(nev, [xA, 0], eredok, U, ertekek.MA);
    lepesek.push({ cim: "Vízszintes vetületi egyenlet → A_x", ...vx });
    lepesek.push({ cim: "Függőleges vetületi egyenlet → A_y", ...vy });
    lepesek.push({ cim: "Nyomatéki egyenlet a befogásra → M_A", ...m });
    const xP = szk.oldal === "bal" ? szk.L : 0;
    ellenorzes = { cim: `Ellenőrzés: nyomatéki egyenlet a szabad végre (x = ${sz(xP, 1)} m)`, ...ellenorzoEgyenlet("M", "P", [xP, 0], eredok, ismeretlenek, ertekek) };
  } else {
    // kéttámaszú vagy csukló + rúd: az A csuklóra, majd az U hatásvonalának főpontjaira
    const nevU = U.id === "B" ? "B" : "C";
    const m1 = nyomatekiEgyenlet("A", Ax.P, eredok, U, ertekek[U.id]);
    lepesek.push({ cim: `Nyomatéki egyenlet a csuklóra → ${U.tex.replace("_", "")}`, ...m1 });
    const m2 = nyomatekiEgyenlet(nevU, U.P, eredok, Ay, ertekek.Ay);
    lepesek.push({ cim: `Nyomatéki egyenlet a(z) ${nevU} pontra → A_y`, ...m2 });
    if (Math.abs(U.e[0]) < 1e-6) {
      const vx = vetuletiEgyenlet("x", eredok, ismeretlenek, ertekek, Ax);
      lepesek.push({ cim: "Vízszintes vetületi egyenlet → A_x (a másik két erő függőleges)", ...vx });
    } else {
      // D: U hatásvonala ∩ az A-n átmenő függőleges
      const t = (Ax.P[0] - U.P[0]) / U.e[0];
      const D = [Ax.P[0], t * U.e[1]];
      const m3 = nyomatekiEgyenlet("D", D, eredok, Ax, ertekek.Ax);
      lepesek.push({ cim: `Nyomatéki egyenlet a D főpontra (${sz(D[0], 2)}; ${sz(D[1], 2)}) → A_x`, ...m3, D });
    }
    ellenorzes = { cim: "Ellenőrzés: függőleges vetületi egyenlet", ...ellenorzoEgyenlet("y", "", null, eredok, ismeretlenek, ertekek) };
  }
  return { ertekek, ismeretlenek, eredok, lepesek, ellenorzes };
}

/* ==================================================================
   A komponens
   ================================================================== */

const SZ = 640;
const MA = 360;
const YT = 215;

const ALAP_SZERKEZET = { tipus: "kettamaszu", L: 6, xA: 0, xB: 6, szog: 0, oldal: "bal", xC: 3, xW: 0, yW: 3 };
const ALAP_TERHEK = [{ id: 1, tipus: "ero", x: 2, F: 12, alfa: -90 }];

const mezo = "szamok w-full min-w-[56px] rounded-md border border-petrol-200 bg-white px-1 py-1 text-center text-[12.5px] text-petrol-900 outline-none focus:border-petrol-400";
const gomb = "rounded-lg bg-white px-2.5 py-1.5 text-[12px] font-medium text-petrol-600 ring-1 ring-petrol-200 transition hover:bg-petrol-50";

function Szam({ ertek, onChange, lepes = 0.5, min, max }) {
  return <input type="number" value={ertek} step={lepes} min={min} max={max} onChange={(e) => onChange(Number(e.target.value))} className={mezo} />;
}

export default function ReakcioKalk({ kezdoSzerkezet, kezdoTerhek }) {
  const [szk, setSzk] = useState({ ...ALAP_SZERKEZET, ...(kezdoSzerkezet ?? {}) });
  const [terhek, setTerhek] = useState(kezdoTerhek ?? ALAP_TERHEK);
  const [kov, setKov] = useState(100);

  const L = Math.max(0.5, szk.L);
  const szkTiszta = {
    ...szk,
    L,
    xA: Math.min(Math.max(0, szk.xA), L),
    xB: Math.min(Math.max(0, szk.xB), L),
    xC: Math.min(Math.max(0, szk.xC), L),
  };
  const ered = reakciokAltalanos(szkTiszta, terhek);
  const { ertekek, hiba } = ered;

  const modSzk = (k, v) => setSzk((s) => ({ ...s, [k]: v }));
  const modTeher = (id, k, v) => setTerhek((t) => t.map((x) => (x.id === id ? { ...x, [k]: v } : x)));
  const torol = (id) => setTerhek((t) => t.filter((x) => x.id !== id));
  const ujTeher = (tipus) => {
    const uj = tipus === "ero" ? { id: kov, tipus, x: L / 2, F: 10, alfa: -90 } : tipus === "megoszlo" ? { id: kov, tipus, p1: 4, p2: 4, x1: 0, x2: L } : { id: kov, tipus, M: 10, x: L / 2 };
    setTerhek((t) => [...t, uj]);
    setKov((k) => k + 1);
  };

  // ---- rajz ----
  const magas = szk.tipus === "rud" ? Math.max(1, Math.abs(szk.yW)) : 1;
  const leptek = Math.min(480 / L, 150 / magas, 70);
  const kx = (x) => 80 + x * leptek;
  const ky = (y) => YT - y * leptek;
  const maxR = Math.max(...Object.values(ertekek).filter((v) => Number.isFinite(v)).map(Math.abs), 1);
  const hossz = (v) => 16 + (50 * Math.abs(v)) / maxR;
  const maxF = Math.max(...terhek.filter((t) => t.tipus === "ero").map((t) => Math.abs(t.F)), 1);
  const maxP = Math.max(...terhek.filter((t) => t.tipus === "megoszlo").map((t) => Math.max(Math.abs(t.p1), Math.abs(t.p2))), 1);

  const iranySzoveg = (id, v) => {
    if (!Number.isFinite(v)) return "";
    if (id === "Ax") return v >= 0 ? "jobbra mutat" : "balra mutat";
    if (id === "Ay") return v >= 0 ? "felfelé mutat" : "lefelé mutat";
    if (id === "B") return v >= 0 ? "a görgő nyomja a tartót" : "a görgő húzná a tartót — nem tartó, felbillen!";
    if (id === "S") return v >= 0 ? "a rúd húzott" : "a rúd nyomott";
    if (id === "MA") return v >= 0 ? "óramutatóval ellentétesen forgat" : "óramutató szerint forgat";
    return "";
  };

  const reakcioRajz = (u) => {
    const v = ertekek[u.id];
    if (!Number.isFinite(v) || Math.abs(v) < 0.005) return null;
    const px = kx(u.P[0]);
    const py = ky(u.P[1]);
    if (u.fajta === "nyomatek") {
      return (
        <g key={u.id}>
          <KoncentraltNyomatek x={px} y={py} r={22} irany={v >= 0 ? 1 : -1} />
          <text x={px} y={py - 32} textAnchor="middle" fontSize="12" fontWeight="650" style={{ fill: SZIN.nyomatek, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
            <tspan fontStyle="italic">M</tspan>
            <tspan dy="3" fontSize="9" fontStyle="italic">A</tspan>
            <tspan dy="-3"> = {sz(Math.abs(v), 2)} kNm</tspan>
          </text>
        </g>
      );
    }
    const h = hossz(v);
    // d: a nyíl tényleges iránya (matematikai), s: melyik oldalon legyen a nyíl (a tartón kívül)
    const d = { x: Math.sign(v) * u.e[0], y: Math.sign(v) * u.e[1] };
    let sOld;
    if (u.id === "Ax") sOld = { x: u.P[0] <= L / 2 ? -1 : 1, y: 0 };
    else if (u.id === "S") sOld = { x: u.e[0], y: u.e[1] };
    else sOld = { x: 0, y: -1 };
    const kifele = d.x * sOld.x + d.y * sOld.y > 0;
    const szog = (Math.atan2(d.y, d.x) * 180) / Math.PI;
    const tip = kifele ? { x: px + h * d.x, y: py - h * d.y } : { x: px, y: py };
    const kulso = kifele ? tip : { x: px - h * d.x, y: py + h * d.y };
    const [betu, index] = u.tex.split("_");
    let cx;
    let cy;
    let horgony = "start";
    const balra = kulso.x < px - 0.5;
    if (u.id === "Ax") {
      // a felirat a nyíl alatt, a támasztól kifelé
      cx = sOld.x < 0 ? px - 12 : px + 12;
      cy = py + 18;
      horgony = sOld.x < 0 ? "end" : "start";
    } else if (Math.abs(d.x) < 0.3) {
      cx = kulso.x + 8;
      cy = kulso.y + (kulso.y > py ? 14 : -6);
    } else {
      cx = kulso.x + (balra ? -8 : 8);
      cy = kulso.y + (kifele ? 16 : 4);
      horgony = balra ? "end" : "start";
    }
    return (
      <g key={u.id}>
        <ReakcioNyil x={tip.x} y={tip.y} hossz={h} szog={szog} {...(v < 0 && u.id === "B" ? { szin: "#be123c", hegy: "th-nyomatek" } : {})} />
        <text x={cx} y={cy} textAnchor={horgony} fontSize="12" fontWeight="650" style={{ fill: v < 0 && u.id === "B" ? "#be123c" : SZIN.reakcio, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
          <tspan fontStyle="italic">{betu}</tspan>
          {index && (
            <tspan dy="3" fontSize="9" fontStyle="italic">
              {index}
            </tspan>
          )}
          <tspan dy={index ? -3 : 0}> = {sz(Math.abs(v), 2)} kN</tspan>
        </text>
      </g>
    );
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white">
      <div className="flex flex-wrap items-center gap-2 border-b border-[color:var(--keret)] bg-petrol-50/70 px-3 py-2">
        <span className="text-[12.5px] font-semibold text-petrol-800">Tartótípus</span>
        <div className="flex flex-wrap gap-1 rounded-lg bg-white p-0.5 ring-1 ring-petrol-200">
          {[
            ["kettamaszu", "Kéttámaszú (csukló + görgő)"],
            ["konzol", "Befogott konzol"],
            ["rud", "Csukló + rúd"],
          ].map(([id, cimke]) => (
            <button key={id} type="button" onClick={() => modSzk("tipus", id)} className={`rounded-md px-2.5 py-1 text-[12px] font-medium transition ${szk.tipus === id ? "bg-petrol-700 text-white" : "text-petrol-600 hover:bg-petrol-50"}`}>
              {cimke}
            </button>
          ))}
        </div>
        <button type="button" onClick={() => { setSzk(ALAP_SZERKEZET); setTerhek(ALAP_TERHEK); }} className="ml-auto rounded-lg px-2.5 py-1 text-[12px] font-medium text-petrol-500 transition hover:text-petrol-800">
          Alaphelyzet
        </button>
      </div>

      <div className="grid lg:grid-cols-[1.25fr_1fr] [&>*]:min-w-0">
        {/* ---------- rajz ---------- */}
        <div className="racs-vilagos border-b border-[color:var(--keret)] p-3 lg:border-r lg:border-b-0">
          <svg viewBox={`0 0 ${SZ} ${MA}`} className="abra w-full h-auto select-none">
            <TartoHegyek />
            {/* terhek */}
            {terhek.map((t) => {
              if (t.tipus === "megoszlo") return <MegoszloTeher key={t.id} x1={kx(Math.min(t.x1, t.x2))} x2={kx(Math.max(t.x1, t.x2))} y={YT - 3} p1={t.x1 <= t.x2 ? t.p1 : t.p2} p2={t.x1 <= t.x2 ? t.p2 : t.p1} leptek={38 / maxP} cimke1={`${sz(t.p1, 1)}`} cimke2={`${sz(t.p2, 1)} kN/m`} />;
              if (t.tipus === "nyomatek") return <KoncentraltNyomatek key={t.id} x={kx(t.x)} y={YT} r={16} irany={t.M >= 0 ? 1 : -1} cimke={`${sz(Math.abs(t.M), 1)} kNm`} />;
              return <TeherNyil key={t.id} x={kx(t.x)} y={YT - 3} hossz={26 + (34 * Math.abs(t.F)) / maxF} szog={t.alfa} cimke={`${sz(t.F, 1)} kN`} cimkeEltolas={Math.cos(rad(t.alfa)) > 0.1 ? [-44, -6] : [6, -6]} />;
            })}

            {/* szerkezet */}
            {szk.tipus === "rud" && (
              <>
                <Befogas x={kx(szkTiszta.xW) - (szkTiszta.xW <= szkTiszta.xC ? 4 : -4)} y={ky(szk.yW)} irany={szkTiszta.xW <= szkTiszta.xC ? "bal" : "jobb"} hossz={26} />
                <Rud x1={kx(szkTiszta.xW)} y1={ky(szk.yW)} x2={kx(szkTiszta.xC)} y2={YT} />
              </>
            )}
            <Tarto x1={kx(0) - 6} y1={YT} x2={kx(L) + 6} y2={YT} />
            {szk.tipus === "kettamaszu" && (
              <>
                <Csuklo x={kx(szkTiszta.xA)} y={YT} />
                <Gorgo x={kx(szkTiszta.xB)} y={YT} szog={szk.szog} />
                <TamaszCimke x={kx(szkTiszta.xA) - 16} y={YT + 30}>A</TamaszCimke>
                <TamaszCimke x={kx(szkTiszta.xB) + 18} y={YT + 30}>B</TamaszCimke>
              </>
            )}
            {szk.tipus === "konzol" && (
              <>
                <Befogas x={kx(szk.oldal === "bal" ? 0 : L)} y={YT} irany={szk.oldal} hossz={48} />
                <TamaszCimke x={kx(szk.oldal === "bal" ? 0 : L) + (szk.oldal === "bal" ? 16 : -16)} y={YT + 28}>A</TamaszCimke>
              </>
            )}
            {szk.tipus === "rud" && (
              <>
                <Csuklo x={kx(szkTiszta.xA)} y={YT} />
                <TamaszCimke x={kx(szkTiszta.xA) - 16} y={YT + 30}>A</TamaszCimke>
                <TamaszCimke x={kx(szkTiszta.xC) + 10} y={YT + 18}>C</TamaszCimke>
              </>
            )}

            {/* reakciók */}
            {!hiba && ered.ismeretlenek.map(reakcioRajz)}

            <Meret x1={kx(0)} x2={kx(L)} y={YT + 112} cimke={`L = ${sz(L, 1)} m`} />
            {hiba && (
              <text x={SZ / 2} y={MA - 12} textAnchor="middle" fontSize="12.5" fontWeight="700" style={{ fill: "#be123c", paintOrder: "stroke", stroke: "white", strokeWidth: 4 }}>
                Nem tartó — lásd a magyarázatot.
              </text>
            )}
          </svg>
        </div>

        {/* ---------- bevitel ---------- */}
        <div className="p-4 sm:p-5">
          <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">Geometria</p>
          <div className="mt-2 grid grid-cols-3 gap-2 text-[11.5px] text-petrol-600">
            <label>
              L (m)
              <Szam ertek={szk.L} onChange={(v) => modSzk("L", v)} min={0.5} max={30} />
            </label>
            {szk.tipus === "kettamaszu" && (
              <>
                <label>
                  x<sub>A</sub> (m)
                  <Szam ertek={szk.xA} onChange={(v) => modSzk("xA", v)} min={0} max={szk.L} />
                </label>
                <label>
                  x<sub>B</sub> (m)
                  <Szam ertek={szk.xB} onChange={(v) => modSzk("xB", v)} min={0} max={szk.L} />
                </label>
                <label>
                  görgő síkja (°)
                  <Szam ertek={szk.szog} onChange={(v) => modSzk("szog", v)} lepes={5} min={-80} max={80} />
                </label>
              </>
            )}
            {szk.tipus === "konzol" && (
              <label className="col-span-2">
                befogás oldala
                <div className="mt-0.5 flex gap-1 rounded-lg bg-white p-0.5 ring-1 ring-petrol-200">
                  {[
                    ["bal", "bal (x = 0)"],
                    ["jobb", "jobb (x = L)"],
                  ].map(([id, c]) => (
                    <button key={id} type="button" onClick={() => modSzk("oldal", id)} className={`flex-1 rounded-md px-2 py-1 text-[12px] font-medium ${szk.oldal === id ? "bg-petrol-700 text-white" : "text-petrol-600"}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </label>
            )}
            {szk.tipus === "rud" && (
              <>
                <label>
                  x<sub>A</sub> (m)
                  <Szam ertek={szk.xA} onChange={(v) => modSzk("xA", v)} min={0} max={szk.L} />
                </label>
                <label>
                  x<sub>C</sub> (m) rúd a tartón
                  <Szam ertek={szk.xC} onChange={(v) => modSzk("xC", v)} min={0} max={szk.L} />
                </label>
                <label>
                  x<sub>W</sub> (m) rúd másik vége
                  <Szam ertek={szk.xW} onChange={(v) => modSzk("xW", v)} min={-10} max={30} />
                </label>
                <label>
                  y<sub>W</sub> (m)
                  <Szam ertek={szk.yW} onChange={(v) => modSzk("yW", v)} min={-6} max={6} />
                </label>
              </>
            )}
          </div>

          <p className="mt-4 text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">Terhek</p>
          <div className="mt-2 space-y-1.5">
            {terhek.map((t) => (
              <div key={t.id} className="flex flex-wrap items-end gap-1.5 rounded-lg bg-petrol-50 p-1.5 text-[11px] text-petrol-600">
                <span className="w-16 shrink-0 pb-1 text-[11.5px] font-semibold text-petrol-800">{t.tipus === "ero" ? "erő" : t.tipus === "megoszlo" ? "megoszló" : "nyomaték"}</span>
                {t.tipus === "ero" && (
                  <>
                    <label>x (m)<Szam ertek={t.x} onChange={(v) => modTeher(t.id, "x", v)} min={0} max={szk.L} /></label>
                    <label>F (kN)<Szam ertek={t.F} onChange={(v) => modTeher(t.id, "F", v)} /></label>
                    <label>α (°)<Szam ertek={t.alfa} onChange={(v) => modTeher(t.id, "alfa", v)} lepes={5} min={-360} max={360} /></label>
                  </>
                )}
                {t.tipus === "megoszlo" && (
                  <>
                    <label>p₁ (kN/m)<Szam ertek={t.p1} onChange={(v) => modTeher(t.id, "p1", v)} /></label>
                    <label>p₂<Szam ertek={t.p2} onChange={(v) => modTeher(t.id, "p2", v)} /></label>
                    <label>x₁ (m)<Szam ertek={t.x1} onChange={(v) => modTeher(t.id, "x1", v)} min={0} max={szk.L} /></label>
                    <label>x₂<Szam ertek={t.x2} onChange={(v) => modTeher(t.id, "x2", v)} min={0} max={szk.L} /></label>
                  </>
                )}
                {t.tipus === "nyomatek" && (
                  <>
                    <label>x (m)<Szam ertek={t.x} onChange={(v) => modTeher(t.id, "x", v)} min={0} max={szk.L} /></label>
                    <label>M (kNm, ↶ +)<Szam ertek={t.M} onChange={(v) => modTeher(t.id, "M", v)} /></label>
                  </>
                )}
                <button type="button" onClick={() => torol(t.id)} className="ml-auto pb-1 text-[14px] leading-none text-petrol-400 hover:text-rose-600" aria-label="Teher törlése">
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <button type="button" className={gomb} onClick={() => ujTeher("ero")}>+ erő</button>
            <button type="button" className={gomb} onClick={() => ujTeher("megoszlo")}>+ megoszló teher</button>
            <button type="button" className={gomb} onClick={() => ujTeher("nyomatek")}>+ nyomaték</button>
          </div>
          <p className="mt-2 text-[11.5px] leading-relaxed text-petrol-500">
            Előjelek: α az erő iránya (0° jobbra, −90° lefelé), p pozitív = lefelé, M pozitív = óramutatóval ellentétes. Az erő komponensei: <M>{"F_x = F\\cos\\alpha"}</M>, <M>{"F_y = F\\sin\\alpha"}</M>.
          </p>
        </div>
      </div>

      {/* ---------- eredmények ---------- */}
      <div className="border-t border-[color:var(--keret)] p-4 sm:p-5">
        {hiba ? (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-[13px] text-rose-800">{hiba}</p>
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-3">
              {ered.ismeretlenek.map((u) => (
                <div key={u.id} className={`rounded-xl px-3 py-2 ring-1 ${ertekek[u.id] < 0 && (u.id === "B") ? "bg-rose-50 ring-rose-200" : "bg-violet-50 ring-violet-200"}`}>
                  <p className="szamok text-[16px] font-semibold text-petrol-900">
                    <M>{`${u.tex} = ${szK(ertekek[u.id], 2)}\\ \\text{${u.fajta === "nyomatek" ? "kNm" : "kN"}}`}</M>
                  </p>
                  <p className="text-[12px] text-petrol-600">{iranySzoveg(u.id, ertekek[u.id])}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">Egyensúlyi kijelentés és az egyismeretlenes egyenletek</p>
            <MB>{`(${terhek.map((t, i) => (t.tipus === "nyomatek" ? `M_${i + 1}` : `\\underline{${t.tipus === "ero" ? "F" : "p"}}_{${i + 1}}`)).join(",\\ ") || "\\text{terhek}"},\\ ${ered.ismeretlenek.map((u) => (u.fajta === "nyomatek" ? u.tex : `\\underline{${u.tex}}`)).join(",\\ ")}) \\ekv \\underline{O}`}</MB>
            <ol className="mt-1 space-y-2">
              {ered.lepesek.map((l, i) => (
                <li key={i} className="rounded-xl border border-petrol-100 bg-white px-3 py-2">
                  <p className="text-[11.5px] font-semibold text-petrol-500">
                    {i + 1}. {l.cim}
                  </p>
                  <div className="szamok overflow-x-auto text-[13px] text-petrol-800">
                    <MB>{l.tex}</MB>
                    <MB>{l.megoldas}</MB>
                  </div>
                </li>
              ))}
              <li className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2">
                <p className="text-[11.5px] font-semibold text-emerald-800">{ered.ellenorzes.cim}</p>
                <div className="szamok overflow-x-auto text-[13px] text-emerald-900">
                  <MB>{ered.ellenorzes.tex}</MB>
                </div>
              </li>
            </ol>
            <p className="mt-2 text-[12px] leading-relaxed text-petrol-500">
              A reakciókat a feltételezett irányukkal (A<sub>x</sub> jobbra, A<sub>y</sub> felfelé, B a görgő síkjára merőlegesen, S húzóerőként, M<sub>A</sub> az óramutatóval ellentétesen) vettük fel; negatív eredmény = ellentétes tényleges irány. A rajzon a tényleges irány és a pozitív nagyság szerepel — így néz ki az eredményvázlat.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
