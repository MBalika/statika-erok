"use client";

import { TartoHegyek, Gorgo, Csuklo, Befogas, BelsoCsuklo, TeherNyil, KoncentraltNyomatek, TamaszCimke, SZIN } from "@/components/tartok/TartoElemek";
import { rudGeometria, tamasz as tamaszOf, TARTOMANY, RACS } from "@/lib/epito/modell";
import { sz } from "@/lib/szamok";

/*
 * Az építő rácsos vászna (SVG, 760×440). Minden koordináta a szerkesztő állapotából jön (m),
 * a rács 0,5 m, a tartomány 14 m × 7 m. A vászon csak rajzol és a nyers mutató-eseményeket adja
 * vissza modell-koordinátákkal; a döntés (mit csinál egy kattintás) az Epito.js dolga.
 *
 *   onLe(pt, esem) / onMozog(pt, esem) / onFel(pt, esem)  – pt = { x, y } méterben
 *   onElem({ tipus, id }, esem)  – kattintás egy teherre (a többi elemet a találat-kereső adja)
 *   kijelolt – { tipus, id } ; gumi – { x1, y1, x2, y2 } (húzás közbeni segédvonal)
 *   rudKezd – a rúd-rajzolás kezdő csomópontja (kiemelve)
 */

export const SZ = 760;
export const MA = 440;
export const PX = 48;
const OX = 44, OY = 396;
export const kx = (x) => OX + x * PX;
export const ky = (y) => OY - y * PX;
export const modellPont = (X, Y) => ({ x: (X - OX) / PX, y: (OY - Y) / PX });
const FOK = Math.PI / 180;
const ert = (v) => sz(v, Math.abs(v - Math.round(v)) > 1e-9 ? 1 : 0);

function befogasIrany(all, csId) {
  const r = all.rudak.find((q) => q.a === csId || q.b === csId);
  if (!r) return "bal";
  const g = rudGeometria(all, r);
  const kifele = r.a === csId ? [g.cos, g.sin] : [-g.cos, -g.sin];
  if (Math.abs(kifele[0]) >= Math.abs(kifele[1])) return kifele[0] > 0 ? "bal" : "jobb";
  return kifele[1] > 0 ? "le" : "fel";
}

export default function EpitoRajz({ allapot: all, kijelolt, gumi, rudKezd, mod, onLe, onMozog, onFel, onElem, svgRef, allapotKod = "kesz" }) {
  const pt = (esem) => {
    const svg = svgRef?.current ?? esem.currentTarget.ownerSVGElement ?? esem.currentTarget;
    const r = svg.getBoundingClientRect();
    const k = SZ / r.width;
    return modellPont((esem.clientX - r.left) * k, (esem.clientY - r.top) * k);
  };
  const kij = (tipus, id) => kijelolt && kijelolt.tipus === tipus && kijelolt.id === id;
  const racs = [];
  for (let x = 0; x <= TARTOMANY.xMax + 1e-9; x += RACS) {
    const fo = Math.abs(x - Math.round(x)) < 1e-9;
    racs.push(<line key={`x${x}`} x1={kx(x)} y1={ky(0)} x2={kx(x)} y2={ky(TARTOMANY.yMax)} stroke={fo ? "#cbd5e1" : "#e8edf2"} strokeWidth={fo ? 0.9 : 0.6} />);
    if (fo) racs.push(<text key={`xt${x}`} x={kx(x)} y={ky(0) + 16} textAnchor="middle" fontSize="9.5" style={{ fill: "#94a3b8" }}>{x}</text>);
  }
  for (let y = 0; y <= TARTOMANY.yMax + 1e-9; y += RACS) {
    const fo = Math.abs(y - Math.round(y)) < 1e-9;
    racs.push(<line key={`y${y}`} x1={kx(0)} y1={ky(y)} x2={kx(TARTOMANY.xMax)} y2={ky(y)} stroke={fo ? "#cbd5e1" : "#e8edf2"} strokeWidth={fo ? 0.9 : 0.6} />);
    if (fo) racs.push(<text key={`yt${y}`} x={kx(0) - 8} y={ky(y) + 3.5} textAnchor="end" fontSize="9.5" style={{ fill: "#94a3b8" }}>{y}</text>);
  }

  // megoszló terhek léptéke
  let maxP = 0;
  for (const t of all.terhek) if (t.fajta === "megoszlo") maxP = Math.max(maxP, Math.abs(t.p1), Math.abs(t.p2 ?? t.p1));
  const pLeptek = maxP > 0 ? Math.min(6, 30 / maxP) : 0;

  const kurzor = mod === "torles" ? "not-allowed" : mod === "epit" ? "crosshair" : "pointer";
  const keret = allapotKod === "kesz" ? "#15803d" : allapotKod === "mechanizmus" || allapotKod === "kritikus" ? "#be123c" : allapotKod === "hatarozatlan" ? "#7c3aed" : "#94a3b8";

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${SZ} ${MA}`}
      className="abra h-auto w-full select-none"
      style={{ touchAction: "none", cursor: kurzor }}
      onPointerDown={(esem) => onLe?.(pt(esem), esem)}
      onPointerMove={(esem) => onMozog?.(pt(esem), esem)}
      onPointerUp={(esem) => onFel?.(pt(esem), esem)}
      onPointerCancel={(esem) => onFel?.(pt(esem), esem)}
    >
      <TartoHegyek />
      <rect x={kx(0) - 10} y={ky(TARTOMANY.yMax) - 10} width={TARTOMANY.xMax * PX + 20} height={TARTOMANY.yMax * PX + 20} rx="8" fill="white" fillOpacity="0.5" stroke={keret} strokeWidth="1.2" strokeDasharray={allapotKod === "kesz" ? undefined : "5 4"} />
      {racs}
      <text x={kx(TARTOMANY.xMax) + 20} y={ky(0) + 16} fontSize="9.5" style={{ fill: "#94a3b8" }}>m</text>

      {/* megoszló terhek (a rudak alatt, hogy a rúd kattintható maradjon) */}
      {all.terhek.map((t) => {
        if (t.fajta !== "megoszlo" || pLeptek === 0) return null;
        const r = all.rudak.find((q) => q.id === t.rud);
        const g = r && rudGeometria(all, r);
        if (!g) return null;
        const e = [Math.cos(t.szog * FOK), -Math.sin(t.szog * FOK)]; // képernyő-irány
        const P = (a) => [kx(g.x1 + a * g.cos), ky(g.y1 + a * g.sin)];
        const n = Math.max(2, Math.round(((t.a2 - t.a1) * PX) / 18));
        const farkak = [], nyilak = [];
        for (let k = 0; k <= n; k++) {
          const u = k / n;
          const a = t.a1 + (t.a2 - t.a1) * u;
          const p = t.p1 + ((t.p2 ?? t.p1) - t.p1) * u;
          const [X, Y] = P(a);
          const h = Math.abs(p) * pLeptek;
          farkak.push([X - e[0] * h, Y - e[1] * h]);
          if (h > 2) nyilak.push(<line key={k} x1={X - e[0] * h} y1={Y - e[1] * h} x2={X - e[0] * 1.5} y2={Y - e[1] * 1.5} stroke={SZIN.teher} strokeWidth="1.5" markerEnd="url(#th-teher)" />);
        }
        const [X1, Y1] = P(t.a1), [X2, Y2] = P(t.a2);
        const ut = `M ${X1} ${Y1} ` + farkak.map((q) => `L ${q[0]} ${q[1]}`).join(" ") + ` L ${X2} ${Y2} Z`;
        const kozep = farkak[Math.floor(farkak.length / 2)];
        const cimke = Math.abs(t.p1 - (t.p2 ?? t.p1)) < 1e-9 ? `${ert(Math.abs(t.p1))} kN/m` : `${ert(Math.abs(t.p1))} … ${ert(Math.abs(t.p2))} kN/m`;
        const sel = kij("teher", t.id);
        return (
          <g key={t.id} onPointerDown={(esem) => { esem.stopPropagation(); onElem?.({ tipus: "teher", id: t.id }, esem); }} style={{ cursor: "pointer" }}>
            <path d={ut} fill={SZIN.teher} fillOpacity={sel ? 0.28 : 0.13} stroke={sel ? "#f59e0b" : SZIN.teher} strokeWidth={sel ? 2.2 : 1.3} />
            {nyilak}
            <text x={kozep[0] - e[0] * 9} y={kozep[1] - e[1] * 9 + (Math.abs(e[1]) < 0.3 ? 4 : e[1] > 0 ? -2 : 12)} textAnchor={Math.abs(e[1]) < 0.3 ? (e[0] > 0 ? "end" : "start") : "middle"} fontSize="11.5" fontWeight="650" style={{ fill: SZIN.teher, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
              {cimke}
            </text>
          </g>
        );
      })}

      {/* rudak */}
      {all.rudak.map((r) => {
        const g = rudGeometria(all, r);
        if (!g) return null;
        const sel = kij("rud", r.id);
        return (
          <g key={r.id}>
            {sel && <line x1={kx(g.x1)} y1={ky(g.y1)} x2={kx(g.x2)} y2={ky(g.y2)} stroke="#f59e0b" strokeWidth="14" strokeLinecap="round" opacity="0.35" />}
            <line x1={kx(g.x1)} y1={ky(g.y1)} x2={kx(g.x2)} y2={ky(g.y2)} stroke={SZIN.tarto} strokeWidth="5.5" strokeLinecap="round" />
            <text x={(kx(g.x1) + kx(g.x2)) / 2 + (Math.abs(g.sin) > 0.7 ? 9 : g.sin * 13)} y={(ky(g.y1) + ky(g.y2)) / 2 + g.cos * 13 + 4} textAnchor={Math.abs(g.sin) > 0.7 ? "start" : "middle"} fontSize="10" fontStyle="italic" style={{ fill: "#64748b", paintOrder: "stroke", stroke: "white", strokeWidth: 2.5 }}>
              {r.id}. ({ert(g.hossz)} m)
            </text>
          </g>
        );
      })}

      {/* segédvonal húzás közben */}
      {gumi && <line x1={kx(gumi.x1)} y1={ky(gumi.y1)} x2={kx(gumi.x2)} y2={ky(gumi.y2)} stroke={gumi.szin ?? SZIN.tarto} strokeWidth={gumi.vastag ?? 3} strokeDasharray="6 4" opacity="0.7" strokeLinecap="round" />}

      {/* támaszok */}
      {all.tamaszok.map((t) => {
        const c = all.csomopontok.find((q) => q.id === t.csomopont);
        if (!c) return null;
        const X = kx(c.x), Y = ky(c.y);
        const sel = kij("tamasz", t.csomopont) || kij("csomopont", t.csomopont);
        return (
          <g key={t.csomopont} opacity={sel ? 1 : 0.95}>
            {t.tipus === "gorgo" && <Gorgo x={X} y={Y} szog={(t.szog ?? 90) - 90} meret={14} />}
            {t.tipus === "csuklo" && <Csuklo x={X} y={Y} meret={14} />}
            {t.tipus === "befogas" && <Befogas x={X} y={Y} irany={befogasIrany(all, t.csomopont)} hossz={40} />}
          </g>
        );
      })}

      {/* koncentrált erők és nyomatékok */}
      {all.terhek.map((t) => {
        if (t.fajta === "megoszlo") return null;
        let X, Y;
        if (t.fajta === "csomopontiEro" || t.fajta === "csomopontiNyomatek") {
          const c = all.csomopontok.find((q) => q.id === t.csomopont);
          if (!c) return null;
          X = kx(c.x); Y = ky(c.y);
        } else {
          const r = all.rudak.find((q) => q.id === t.rud);
          const g = r && rudGeometria(all, r);
          if (!g) return null;
          X = kx(g.x1 + t.a * g.cos); Y = ky(g.y1 + t.a * g.sin);
        }
        const sel = kij("teher", t.id);
        const kattint = (esem) => { esem.stopPropagation(); onElem?.({ tipus: "teher", id: t.id }, esem); };
        if (t.fajta === "csomopontiNyomatek" || t.fajta === "pontNyomatek") {
          return (
            <g key={t.id} onPointerDown={kattint} style={{ cursor: "pointer" }}>
              <circle cx={X} cy={Y} r="24" fill={sel ? "#f59e0b" : "transparent"} fillOpacity={sel ? 0.2 : 0} />
              <KoncentraltNyomatek x={X} y={Y} r={16} irany={t.M >= 0 ? 1 : -1} cimke={`${ert(Math.abs(t.M))} kNm`} />
            </g>
          );
        }
        // erő: a hegye a ponton; megoszló teher fölé emeljük, ha ugyanabból az irányból jön
        let hossz = 46;
        for (const q of all.terhek) {
          if (q.fajta !== "megoszlo" || t.fajta !== "pontTeher" || q.rud !== t.rud) continue;
          if (t.a >= q.a1 - 1e-9 && t.a <= q.a2 + 1e-9 && Math.abs(((q.szog - t.szog) % 360 + 360) % 360) < 1) hossz += Math.max(Math.abs(q.p1), Math.abs(q.p2 ?? q.p1)) * pLeptek;
        }
        const ex = Math.cos(t.szog * FOK), ey = Math.sin(t.szog * FOK);
        const fugg = Math.abs(ex) < 0.3;
        const szoveg = `${ert(Math.abs(t.F))} kN`;
        const eltolas = fugg ? [7, ey < 0 ? -5 : 13] : Math.abs(ey) < 0.3 ? [ex > 0 ? -6.6 * szoveg.length - 4 : 6, -7] : [ex > 0 ? -6.6 * szoveg.length - 6 : 8, ey < 0 ? -3 : 12];
        const x1 = X - ex * hossz, y1 = Y + ey * hossz;
        return (
          <g key={t.id} onPointerDown={kattint} style={{ cursor: "pointer" }}>
            <line x1={x1} y1={y1} x2={X} y2={Y} stroke={sel ? "#f59e0b" : "transparent"} strokeWidth="16" strokeLinecap="round" opacity={sel ? 0.35 : 0} />
            <line x1={x1} y1={y1} x2={X} y2={Y} stroke="transparent" strokeWidth="18" />
            <TeherNyil x={X - ex * 2} y={Y + ey * 2} hossz={hossz - 2} szog={t.szog} cimke={szoveg} cimkeEltolas={eltolas} />
          </g>
        );
      })}

      {/* csomópontok, belső csuklók, betűjelek */}
      {all.csomopontok.map((c) => {
        const X = kx(c.x), Y = ky(c.y);
        const csuklo = all.csuklok.includes(c.id);
        const sel = kij("csomopont", c.id);
        const kezd = rudKezd === c.id;
        const arva = !all.rudak.some((r) => r.a === c.id || r.b === c.id);
        const tam = tamaszOf(all, c.id);
        const rudak = all.rudak.filter((r) => r.a === c.id || r.b === c.id);
        // betűjel a rudaktól elfelé
        let dx = 0, dy = 0;
        for (const r of rudak) {
          const g = rudGeometria(all, r);
          const s = r.a === c.id ? 1 : -1;
          dx += s * g.cos; dy += s * g.sin;
        }
        const n = Math.hypot(dx, dy);
        let cx = X, cy = Y - 14;
        if (tam) { cx = X - 16; cy = Y + (tam.tipus === "befogas" ? (befogasIrany(all, c.id) === "le" ? 34 : -10) : tam.tipus === "gorgo" ? 46 : 40); }
        else if (n > 0.3) { cx = X - (dx / n) * 18; cy = Y + (dy / n) * 18 + 4; }
        return (
          <g key={c.id}>
            {(sel || kezd) && <circle cx={X} cy={Y} r="13" fill={kezd ? "#0369a1" : "#f59e0b"} fillOpacity="0.28" />}
            {csuklo ? <BelsoCsuklo x={X} y={Y} r={5.5} /> : <circle cx={X} cy={Y} r={arva ? 4 : 3.6} fill={arva ? "white" : SZIN.tarto} stroke={arva ? "#94a3b8" : "white"} strokeWidth="1.5" strokeDasharray={arva ? "2 2" : undefined} />}
            <TamaszCimke x={cx} y={cy} meret={12}>{c.id}</TamaszCimke>
          </g>
        );
      })}
    </svg>
  );
}
