"use client";

/**
 * Rajzolható szerkezet (lásd src/lib/hatarozottsag.js: tartoModell) megjelenítése,
 * a mechanizmus-mozgás animálásával: a testek a `mozgas` (nulltér-vektor) szerint,
 * `s`·amplitúdóval elmozdítva rajzolódnak; a támaszok a helyükön maradnak.
 *
 *   szerkezet   – { testek:[{pontok}], kenyszerek:[…], terhek:[{test,x,y,Fx,Fy}] }
 *   mozgas      – a kinematika() egy nulltér-vektora (3·testek hosszú) vagy null
 *   s           – 0…1 (…1.2): az elmozdulás aránya
 *   amplitudo   – a legnagyobb elmozdulás méterben s = 1-nél
 *   reakciok    – az elemez() reakciói (a külső kényszerek sorrendjében) – lila nyilak
 *   cimkek      – a külső kényszerek betűjelei (alapból A, B, C…)
 *   onKenyszer(i) / onCsuklo(i) – kattintás a kényszerre / belső csuklóra
 *   glow        – "piros" | "zold" | null: a testek kiemelése (határozatlan „megfeszül”, határozott pipa)
 */

import { pontElmozdulas, szerkezetBefoglalo } from "@/lib/hatarozottsag";
import { TartoHegyek, Tarto, Gorgo, Csuklo, Befogas, Rud, BelsoCsuklo, TeherNyil, ReakcioNyil, TamaszCimke, SZIN } from "@/components/tartok/TartoElemek";
import { sz } from "@/lib/szamok";

export const SZINEK = { lila: "#7c3aed", zold: "#15803d", bordo: "#be123c", kek: "#2563eb", nar: "#e2590a", szurke: "#64748b" };

export function leptekSzamit(szerkezet, szelesseg, magassag, margo = { bal: 60, jobb: 60, fel: 60, le: 70 }) {
  const b = szerkezetBefoglalo(szerkezet);
  const dx = Math.max(0.5, b.xMax - b.xMin);
  const dy = Math.max(0.5, b.yMax - b.yMin);
  const L = Math.min((szelesseg - margo.bal - margo.jobb) / dx, (magassag - margo.fel - margo.le) / dy);
  const ox = margo.bal + (szelesseg - margo.bal - margo.jobb - L * dx) / 2 - L * b.xMin;
  const oy = magassag - margo.le - (magassag - margo.fel - margo.le - L * dy) / 2 + L * b.yMin;
  return { L, kx: (x) => ox + L * x, ky: (y) => oy - L * y, b };
}

const KULSO = new Set(["gorgo", "rud", "csuklo", "befogas"]);

export default function SzerkezetRajz({
  szerkezet,
  mozgas = null,
  s = 0,
  amplitudo = 0.5,
  szelesseg = 600,
  magassag = 300,
  margo,
  reakciok = null,
  cimkek,
  onKenyszer,
  onCsuklo,
  glow = null,
  terhek = true,
  csoport = false,
  eltolas = [0, 0],
  extra,
  gyerekek,
  className = "abra w-full h-auto select-none",
  tamaszMeret = 14,
  testSzin = SZIN.tarto,
  vastag = 6,
}) {
  const lp = leptekSzamit(szerkezet, szelesseg, magassag, margo);
  const { kx, ky } = lp;

  // ---- elmozdulás-mező ----
  let k = 0;
  if (mozgas && s > 0) {
    let max = 0;
    szerkezet.testek.forEach((t, ti) => {
      for (const [x, y] of t.pontok) {
        const d = pontElmozdulas(mozgas, ti, x, y);
        max = Math.max(max, Math.hypot(d.dx, d.dy));
      }
    });
    k = max > 1e-9 ? amplitudo / max : 0;
  }
  const helyzet = (test, x, y) => {
    if (!k) return [kx(x), ky(y)];
    const d = pontElmozdulas(mozgas, test, x, y);
    return [kx(x + s * k * d.dx), ky(y + s * k * d.dy)];
  };
  const kulsok = szerkezet.kenyszerek.filter((c) => KULSO.has(c.tipus));
  const betuk = cimkek ?? kulsok.map((_, i) => String.fromCharCode(65 + i));
  const rudHossz = 1.2;

  const testek = szerkezet.testek.map((t, ti) => {
    const pts = t.pontok.map(([x, y]) => helyzet(ti, x, y));
    const d = pts.map(([x, y], i) => `${i ? "L" : "M"} ${x} ${y}`).join(" ");
    return (
      <g key={ti}>
        {glow === "piros" && <path d={d} fill="none" stroke={SZINEK.bordo} strokeWidth={vastag + 10} strokeLinecap="round" strokeLinejoin="round" opacity="0.28" className="animate-pulse" />}
        {glow === "zold" && <path d={d} fill="none" stroke={SZINEK.zold} strokeWidth={vastag + 8} strokeLinecap="round" strokeLinejoin="round" opacity="0.22" />}
        <path d={d} fill="none" stroke={glow === "piros" ? "#9f1239" : glow === "zold" ? "#166534" : testSzin} strokeWidth={vastag} strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.4s" }} />
      </g>
    );
  });

  let kulsoIdx = -1;
  const kenyszerek = szerkezet.kenyszerek.map((c, i) => {
    const kattint = onKenyszer ? { onClick: () => onKenyszer(i), style: { cursor: "pointer" } } : {};
    if (c.tipus === "belsoCsuklo") {
      const [x, y] = helyzet(c.testek[0], c.x, c.y);
      return (
        <g key={i} onClick={onCsuklo ? () => onCsuklo(i) : undefined} style={onCsuklo ? { cursor: "pointer" } : undefined}>
          {onCsuklo && <circle cx={x} cy={y} r="14" fill="transparent" />}
          <BelsoCsuklo x={x} y={y} r={5} />
        </g>
      );
    }
    if (c.tipus === "belsoRud") {
      const [x1, y1] = helyzet(c.testA, c.xA, c.yA);
      const [x2, y2] = helyzet(c.testB, c.xB, c.yB);
      return <Rud key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
    }
    if (!KULSO.has(c.tipus)) return null;
    kulsoIdx += 1;
    const j = kulsoIdx;
    const X = kx(c.x);
    const Y = ky(c.y);
    const betu = betuk[j];
    let jel = null;
    let cimkeY = Y + tamaszMeret * 2 + 12;
    let cimkeX = X;
    if (c.tipus === "gorgo") {
      const szog = c.szog ?? 90;
      const hajlas = szog - 90; // a gördülési sík hajlása (a Gorgo „szog” propja)
      jel = <Gorgo x={X} y={Y} szog={hajlas} meret={tamaszMeret} />;
      if (Math.abs(Math.cos((szog * Math.PI) / 180)) > 0.7) {
        // fal melletti görgő: a felirat oldalra
        cimkeX = X + (Math.cos((szog * Math.PI) / 180) > 0 ? -tamaszMeret * 2 - 8 : tamaszMeret * 2 + 8);
        cimkeY = Y + 5;
      } else if (Math.abs(hajlas) > 20) cimkeX = X + (hajlas > 0 ? 1 : -1) * 22;
    } else if (c.tipus === "csuklo") {
      jel = <Csuklo x={X} y={Y} meret={tamaszMeret} />;
    } else if (c.tipus === "befogas") {
      const b = lp.b;
      const irany = c.irany ?? (c.x <= b.xMin + 1e-9 ? "bal" : c.x >= b.xMax - 1e-9 ? "jobb" : c.y <= b.yMin + 1e-9 ? "le" : "fel");
      jel = <Befogas x={X} y={Y} irany={irany} hossz={2.6 * tamaszMeret + 8} />;
      cimkeX = X + (irany === "bal" ? 16 : irany === "jobb" ? -16 : 0);
      cimkeY = Y + (irany === "le" ? 30 : irany === "fel" ? -14 : 30);
    } else if (c.tipus === "rud") {
      const h = Math.hypot(c.irany[0], c.irany[1]) || 1;
      const ex = c.irany[0] / h;
      const ey = c.irany[1] / h;
      const X2 = kx(c.x + rudHossz * ex);
      const Y2 = ky(c.y + rudHossz * ey);
      jel = (
        <g>
          <Rud x1={X} y1={Y} x2={X2} y2={Y2} />
          <Csuklo x={X2} y={Y2} meret={tamaszMeret * 0.7} forgatas={ey > 0.05 ? 180 : 0} />
        </g>
      );
      cimkeX = X2 + (ex >= 0 ? 16 : -16);
      cimkeY = Y2 + (ey > 0.05 ? -tamaszMeret : tamaszMeret + 8);
    }
    return (
      <g key={i} {...kattint}>
        {onKenyszer && <circle cx={X} cy={Y + tamaszMeret} r={tamaszMeret + 10} fill="transparent" />}
        {jel}
        {betu && (
          <TamaszCimke x={cimkeX} y={cimkeY}>
            {betu}
          </TamaszCimke>
        )}
      </g>
    );
  });

  const terhekRajz =
    terhek &&
    (szerkezet.terhek ?? []).map((t, i) => {
      const F = Math.hypot(t.Fx ?? 0, t.Fy ?? 0);
      if (F < 1e-9) return null;
      const [X, Y] = helyzet(t.test, t.x, t.y);
      const szog = (Math.atan2(t.Fy, t.Fx) * 180) / Math.PI;
      const fugg = Math.abs(t.Fx) < 1e-9;
      const cim = t.cimke ?? `${sz(F, F % 1 ? 1 : 0)} kN`;
      return <TeherNyil key={i} x={X} y={Y - (t.Fy < 0 ? 3 : -3)} hossz={Math.min(64, 34 + 2.2 * F)} szog={szog} cimke={cim} cimkeEltolas={fugg ? [7, -4] : t.Fx > 0 ? [-8 - 6.2 * cim.length, -4] : [8, -4]} />;
    });

  // ---- reakciók (lila) ----
  const reakcioRajz =
    reakciok &&
    kulsok.map((c, j) => {
      const r = reakciok[j];
      if (!r) return null;
      const X = kx(c.x);
      const Y = ky(c.y);
      const el = [];
      const cim = betuk[j] ?? "";
      const hossz = (v) => Math.min(60, 22 + 2 * Math.abs(v));
      if (c.tipus === "csuklo" || c.tipus === "befogas") {
        if (Math.abs(r.Fx) > 1e-6) el.push(<ReakcioNyil key="x" x={X + (r.Fx > 0 ? -5 : 5)} y={Y + 10} hossz={hossz(r.Fx)} szog={r.Fx > 0 ? 0 : 180} cimke={`${cim}ₓ = ${sz(Math.abs(r.Fx), 2)}`} cimkeEltolas={r.Fx > 0 ? [-6 - 7 * (cim.length + 8), 16] : [6, 16]} />);
        if (Math.abs(r.Fy) > 1e-6) el.push(<ReakcioNyil key="y" x={X} y={Y + (r.Fy > 0 ? 5 : -5)} hossz={hossz(r.Fy)} szog={r.Fy > 0 ? 90 : -90} cimke={`${cim}ᵧ = ${sz(Math.abs(r.Fy), 2)}`} cimkeEltolas={[8, r.Fy > 0 ? 4 : -4]} />);
        if (c.tipus === "befogas" && Math.abs(r.M) > 1e-6) {
          const rr = 20;
          const irany = r.M > 0 ? 1 : -1;
          const sweep = irany === 1 ? 0 : 1;
          const d = irany === 1 ? `M ${X + rr} ${Y} A ${rr} ${rr} 0 1 ${sweep} ${X - rr} ${Y}` : `M ${X - rr} ${Y} A ${rr} ${rr} 0 1 ${sweep} ${X + rr} ${Y}`;
          el.push(
            <g key="m">
              <path d={d} fill="none" stroke={SZIN.reakcio} strokeWidth="2.4" markerEnd="url(#th-reakcio)" />
              <text x={X} y={Y - rr - 8} textAnchor="middle" fontSize="12" fontWeight="650" style={{ fill: SZIN.reakcio, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
                M{cim} = {sz(Math.abs(r.M), 2)}
              </text>
            </g>,
          );
        }
      } else {
        const n = r.nagysag ?? Math.hypot(r.Fx ?? 0, r.Fy ?? 0);
        if (Math.abs(n) > 1e-6) {
          const szog = (Math.atan2(r.Fy, r.Fx) * 180) / Math.PI;
          el.push(<ReakcioNyil key="n" x={X} y={Y + (r.Fy > 0 ? 5 : r.Fy < 0 ? -5 : 0)} hossz={hossz(n)} szog={szog} cimke={`${c.tipus === "rud" ? "S" : cim} = ${sz(Math.abs(n), 2)}`} cimkeEltolas={[8, 4]} />);
        }
      }
      return <g key={`r${j}`}>{el}</g>;
    });

  const tartalom = (
    <>
      {!csoport && <TartoHegyek />}
      {kenyszerek.filter((_, i) => szerkezet.kenyszerek[i].tipus !== "belsoCsuklo" && szerkezet.kenyszerek[i].tipus !== "belsoRud")}
      {testek}
      {kenyszerek.filter((_, i) => szerkezet.kenyszerek[i].tipus === "belsoRud")}
      {terhekRajz}
      {kenyszerek.filter((_, i) => szerkezet.kenyszerek[i].tipus === "belsoCsuklo")}
      {s < 0.02 && reakcioRajz}
      {extra ? extra(kx, ky, lp, helyzet) : null}
      {gyerekek}
    </>
  );
  if (csoport) return <g transform={`translate(${eltolas[0]} ${eltolas[1]})`}>{tartalom}</g>;
  return (
    <svg viewBox={`0 0 ${szelesseg} ${magassag}`} className={className}>
      {tartalom}
    </svg>
  );
}

/** Egyszerű pipa/kereszt jelvény a rajz sarkába. */
export function Jelveny({ x, y, szoveg, szin = SZINEK.zold, w = 120 }) {
  const W = Math.max(w, 7.4 * String(szoveg).length + 18);
  return (
    <g>
      <rect x={x - W / 2} y={y - 11} width={W} height={22} rx="11" fill="white" stroke={szin} strokeWidth="1.4" />
      <text x={x} y={y + 4} textAnchor="middle" fontSize="12" fontWeight="700" style={{ fill: szin }}>
        {szoveg}
      </text>
    </g>
  );
}
