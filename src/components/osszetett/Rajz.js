"use client";

/**
 * Közös rajzsegédek a 6. modul felfedezőihez: méterben megadott testek rajza,
 * erőnyíl, amelynek a farka a támadáspontban van (a tankönyv reakció-rajzai szerint),
 * és a támaszjelek a TartoElemek-ből.
 */
import { Tarto, Gorgo, Csuklo, Befogas, Rud, BelsoCsuklo, TeherNyil, MegoszloTeher, TamaszCimke, SZIN } from "@/components/tartok/TartoElemek";

export const LILA = "#7c3aed";
export const NAR = "#e2590a";
export const ZOLD = "#15803d";
export const BORDO = "#be123c";
export const KEK = "#2563eb";

/** Extra nyílhegyek a felfedezőkhöz (a TartoHegyek mellé). */
export function OsszetettHegyek() {
  const lista = [
    ["oh-lila", LILA],
    ["oh-nar", NAR],
    ["oh-zold", ZOLD],
    ["oh-bordo", BORDO],
    ["oh-kek", KEK],
    ["oh-szurke", "#94a3b8"],
  ];
  return (
    <defs>
      {lista.map(([id, szin]) => (
        <marker key={id} id={id} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
          <path d="M 0 1 L 9 5 L 0 9 z" fill={szin} />
        </marker>
      ))}
    </defs>
  );
}

/** Alsó indexes jel SVG-szövegben. */
export function Ind({ alap, index, vesszo = false, utana }) {
  return (
    <>
      {alap}
      {vesszo && <tspan>′</tspan>}
      {index && (
        <tspan dy="3.5" fontSize="9">
          {index}
        </tspan>
      )}
      {utana != null && <tspan dy={index ? "-3.5" : "0"}>{utana}</tspan>}
    </>
  );
}

/**
 * Erőnyíl, amelynek a FARKA az (X, Y) képpontban van és az (Fx, Fy) irányba mutat (y felfelé pozitív!).
 * hossz: px; ha nincs megadva, |F|·leptek (legalább minHossz).
 */
export function EroNyil({ X, Y, Fx, Fy, leptek = 2.2, minHossz = 18, maxHossz = 90, szin = LILA, hegy = "oh-lila", vastag = 2.8, cimke, cimkeEltolas, opacitas = 1, szaggatott = false }) {
  const n = Math.hypot(Fx, Fy);
  if (n < 1e-9 || opacitas <= 0.01) return null;
  const h = Math.max(minHossz, Math.min(maxHossz, n * leptek));
  const ex = Fx / n, ey = -Fy / n; // képernyő-irány
  const x2 = X + ex * h, y2 = Y + ey * h;
  const [dx, dy] = cimkeEltolas ?? [ex * 10 + (Math.abs(ex) < 0.3 ? 8 : 0), ey * 12 + 4];
  return (
    <g opacity={opacitas}>
      <line x1={X} y1={Y} x2={x2} y2={y2} stroke={szin} strokeWidth={vastag} strokeLinecap="round" markerEnd={`url(#${hegy})`} strokeDasharray={szaggatott ? "5 4" : undefined} />
      {cimke && (
        <text x={x2 + dx} y={y2 + dy} textAnchor={ex < -0.3 ? "end" : "start"} fontSize="12" fontWeight="650" fontStyle="italic" style={{ fill: szin, paintOrder: "stroke", stroke: "white", strokeWidth: 3.5 }}>
          {cimke}
        </text>
      )}
    </g>
  );
}

/**
 * Egy merev test rajza méterben megadott adatokból.
 *   rudak: [[x1,y1,x2,y2], …]   tamaszok: [{x,y,tipus:"csuklo"|"gorgo"|"befogas", irany?, szog?, cimke?}]
 *   terhek: [{x,y,Fx,Fy,cimke}] (koncentrált erők, a hegye a pontban)  megoszlok: [{x1,x2,y,p,cimke}] (függőleges, lefelé)
 *   csuklok: [[x,y]] (belső csukló jele)   pontok: [{x,y,cimke,dx,dy}]
 *   kx, ky: m → px;  tamaszOpacitas: az elkülönítésnél elhalványuló támaszjel
 */
export function TestRajz({ rudak = [], tamaszok = [], terhek = [], megoszlok = [], csuklok = [], pontok = [], kx, ky, tamaszOpacitas = 1, szin = SZIN.tarto, opacitas = 1 }) {
  return (
    <g opacity={opacitas}>
      {tamaszOpacitas > 0.02 &&
        tamaszok.map((t, i) => {
          const x = kx(t.x), y = ky(t.y);
          if (t.tipus === "csuklo") return <Csuklo key={i} x={x} y={y} opacitas={tamaszOpacitas} />;
          if (t.tipus === "gorgo") return <Gorgo key={i} x={x} y={y} szog={t.szog ?? 0} opacitas={tamaszOpacitas} />;
          if (t.tipus === "befogas") return <Befogas key={i} x={x} y={y} irany={t.irany ?? "jobb"} hossz={40} opacitas={tamaszOpacitas} />;
          return null;
        })}
      {megoszlok.map((m, i) => (
        <g key={`m${i}`}>
          <MegoszloTeher x1={kx(m.x1)} x2={kx(m.x2)} y={ky(m.y) - 3} p1={m.p} p2={m.p2 ?? m.p} leptek={m.leptek ?? 5} />
          {m.cimke && (
            <text x={(kx(m.x1) + kx(m.x2)) / 2} y={ky(m.y) - 3 - Math.max(m.p, m.p2 ?? m.p) * (m.leptek ?? 5) - 7} textAnchor="middle" fontSize="12" fontWeight="650" style={{ fill: SZIN.teher, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
              {m.cimke}
            </text>
          )}
        </g>
      ))}
      {rudak.map((r, i) => (
        <Tarto key={`r${i}`} x1={kx(r[0])} y1={ky(r[1])} x2={kx(r[2])} y2={ky(r[3])} szin={szin} />
      ))}
      {terhek.map((t, i) => {
        const n = Math.hypot(t.Fx, t.Fy);
        const szog = (Math.atan2(t.Fy, t.Fx) * 180) / Math.PI;
        const ex = t.Fx / n, ey = t.Fy / n;
        return <TeherNyil key={`t${i}`} x={kx(t.x) - ex * 3} y={ky(t.y) + ey * 3} hossz={t.hossz ?? Math.max(30, Math.min(70, 26 + 2.2 * n))} szog={szog} cimke={t.cimke} cimkeEltolas={t.cimkeEltolas ?? (Math.abs(ex) < 0.3 ? [6, -2] : ex > 0 ? [-30, -6] : [8, -6])} />;
      })}
      {csuklok.map((c, i) => (
        <BelsoCsuklo key={`c${i}`} x={kx(c[0])} y={ky(c[1])} />
      ))}
      {tamaszok.map((t, i) => t.cimke && <TamaszCimke key={`tc${i}`} x={kx(t.x) + (t.cimkeDx ?? 0)} y={ky(t.y) + (t.cimkeDy ?? 40)}>{t.cimke}</TamaszCimke>)}
      {pontok.map((p, i) => (
        <TamaszCimke key={`p${i}`} x={kx(p.x) + (p.dx ?? 0)} y={ky(p.y) + (p.dy ?? -10)}>{p.cimke}</TamaszCimke>
      ))}
    </g>
  );
}

/** Római test-címke dobozban. */
export function TestCimke({ x, y, children, szin = "#334155", aktiv = false }) {
  return (
    <g>
      <rect x={x - 12} y={y - 10} width={24} height={16} rx="4" fill={aktiv ? szin : "white"} stroke={szin} strokeWidth="1.3" />
      <text x={x} y={y + 2} textAnchor="middle" fontSize="10.5" fontWeight="700" style={{ fill: aktiv ? "white" : szin }}>
        {children}
      </text>
    </g>
  );
}

export { Rud, Tarto, Csuklo, Gorgo, Befogas, BelsoCsuklo, TeherNyil, TamaszCimke, SZIN };
