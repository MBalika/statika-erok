"use client";

import { TartoHegyek, Csuklo, Gorgo, TeherNyil, ReakcioNyil, Meret, MeretFugg, SZIN } from "@/components/tartok/TartoElemek";
import { befoglalo } from "@/lib/racsos";
import { sz } from "@/lib/szamok";

/**
 * Rácsos tartó rajza a modellből (és opcionálisan a megoldásból).
 *
 *   modell        – { csomopontok, rudak, tamaszok, terhek }
 *   eredmeny      – a racsosMegold() eredménye (rúderők, reakciók) – ha adott, a rudak színe/vastagsága az erő szerint
 *   szinez        – true: húzott = rose, nyomott = sky, vakrúd = szürke; false: minden rúd sötét
 *   ismertRudak   – Set/array: csak ezek a rudak kapnak színt (a többi még „ismeretlen”, sötét) – a csomóponti hullámhoz
 *   kiemeltRudak  – Set/array: vastag narancs keret (pl. átvágott rudak)
 *   aktivCsomopontok – Set/array: „kigyulladt” csomópontok (narancs gyűrű)
 *   keszCsomopontok  – Set/array: már feldolgozott csomópontok (zöld pötty)
 *   rudFeliratok  – true: S értékek a rudak mellett; "jel": csak S_{i,j}; false: semmi
 *   vakrudJel     – true: kis kör a vakrudak közepén
 *   reakciok      – true: a reakciónyilak (lila) a támaszoknál
 *   meretek       – true: méretlánc alul és magasság jobbra
 *   csomopontCimkek – true: a csomópontok sorszáma
 *   onRud(id), onCsomopont(id) – kattintás
 *   extra         – függvény (kx, ky, adatok) => JSX, a rajz tetejére kerül
 *   viewBox fixált: 0 0 szelesseg magassag; a lépték automatikus
 */

export const RACS_SZIN = {
  huzott: "#e11d48",
  nyomott: "#0284c7",
  vak: "#94a3b8",
  rud: "#1d3c48",
  ismeretlen: "#334155",
  aktiv: "#e2590a",
  kesz: "#15803d",
  kiemelt: "#f59e0b",
  csomopont: "#0f172a",
};

const halmaz = (x) => (x instanceof Set ? x : new Set(x ?? []));

export function rudSzin(S, maxS) {
  if (!Number.isFinite(S)) return RACS_SZIN.rud;
  if (Math.abs(S) < 1e-6 || Math.abs(S) < 1e-4 * (maxS || 1)) return RACS_SZIN.vak;
  return S > 0 ? RACS_SZIN.huzott : RACS_SZIN.nyomott;
}

export function rudVastag(S, maxS, min = 2.2, max = 9) {
  if (!Number.isFinite(S) || !maxS) return 4;
  const a = Math.abs(S) / maxS;
  if (a < 1e-6) return min;
  return min + (max - min) * Math.sqrt(a);
}

/** Lépték-számítás: a modell befoglalója a keretbe illesztve. */
export function leptek(modell, szelesseg = 600, magassag = 360, margo = { bal: 56, jobb: 56, fel: 74, le: 78 }) {
  const b = befoglalo(modell);
  const dx = Math.max(1e-6, b.xMax - b.xMin);
  const dy = Math.max(1e-6, b.yMax - b.yMin);
  const L = Math.min((szelesseg - margo.bal - margo.jobb) / dx, (magassag - margo.fel - margo.le) / dy);
  const ox = margo.bal + ((szelesseg - margo.bal - margo.jobb) - L * dx) / 2 - L * b.xMin;
  const oy = magassag - margo.le - ((magassag - margo.fel - margo.le) - L * dy) / 2 + L * b.yMin;
  return { L, kx: (x) => ox + L * x, ky: (y) => oy - L * y, b };
}

export default function RacsosRajz({
  modell,
  eredmeny = null,
  szinez = true,
  ismertRudak = null,
  kiemeltRudak = null,
  aktivCsomopontok = null,
  keszCsomopontok = null,
  rudFeliratok = false,
  vakrudJel = true,
  reakciok = false,
  meretek = false,
  csomopontCimkek = true,
  terhek = true,
  tamaszok = true,
  szelesseg = 600,
  magassag = 360,
  margo,
  onRud,
  onCsomopont,
  extra,
  vastagsag = true,
  atmenet = true,
  className = "abra w-full h-auto select-none",
  gyerekek,
  svgRef,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  style,
  cimke,
  csoport = false,
  eltolas = [0, 0],
  tamaszMeret = 14,
}) {
  const lp = leptek(modell, szelesseg, magassag, margo ?? { bal: 56, jobb: 56, fel: 74, le: meretek ? 96 : 70 });
  const { kx, ky } = lp;
  const csIdx = new Map(modell.csomopontok.map((c) => [String(c.id), c]));
  const ismert = ismertRudak == null ? null : halmaz(ismertRudak);
  const kiemelt = halmaz(kiemeltRudak);
  const aktiv = halmaz(aktivCsomopontok);
  const kesz = halmaz(keszCsomopontok);
  const rudErok = eredmeny?.rudErok ?? null;
  const maxS = eredmeny?.maxS ?? 1;
  const terhekLista = (modell.terhek ?? []).filter((t) => Math.hypot(t.Fx ?? 0, t.Fy ?? 0) > 1e-9);

  const tartalom = (
    <>
      {!csoport && <TartoHegyek />}
      <defs>
        <marker id="rr-huzott" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 9 5 L 0 9 z" fill={RACS_SZIN.huzott} />
        </marker>
        <marker id="rr-nyomott" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 9 5 L 0 9 z" fill={RACS_SZIN.nyomott} />
        </marker>
      </defs>
      {cimke && (
        <text x={12} y={18} fontSize="11" fontWeight="700" letterSpacing="1.5" style={{ fill: "#64748b" }}>
          {cimke}
        </text>
      )}

      {/* támaszok */}
      {tamaszok &&
        (modell.tamaszok ?? []).map((t, i) => {
          const c = csIdx.get(String(t.csomopont));
          if (!c) return null;
          const jel = t.jel ?? (i === 0 ? "A" : i === 1 ? "B" : String.fromCharCode(65 + i));
          return (
            <g key={`t${i}`}>
              {t.tipus === "csuklo" ? <Csuklo x={kx(c.x)} y={ky(c.y)} meret={tamaszMeret} /> : <Gorgo x={kx(c.x)} y={ky(c.y)} szog={(t.szog ?? 90) - 90} meret={tamaszMeret} />}
              <text x={kx(c.x)} y={ky(c.y) + tamaszMeret * 2 + 12} textAnchor="middle" fontSize="12.5" fontStyle="italic" fontWeight="650" style={{ fill: RACS_SZIN.rud, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
                {jel}
              </text>
            </g>
          );
        })}

      {/* rudak */}
      {modell.rudak.map((r) => {
        const a = csIdx.get(String(r.a));
        const b = csIdx.get(String(r.b));
        if (!a || !b) return null;
        const S = rudErok ? rudErok[r.id] : undefined;
        const lathatoS = szinez && rudErok && (ismert == null || ismert.has(r.id));
        const szin = lathatoS ? rudSzin(S, maxS) : ismert && !ismert.has(r.id) ? RACS_SZIN.ismeretlen : RACS_SZIN.rud;
        const vast = lathatoS && vastagsag ? rudVastag(S, maxS) : 4;
        const mx = (kx(a.x) + kx(b.x)) / 2;
        const my = (ky(a.y) + ky(b.y)) / 2;
        const dx = kx(b.x) - kx(a.x);
        const dy = ky(b.y) - ky(a.y);
        const len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;
        const vak = lathatoS && Math.abs(S) < 1e-6;
        const kiem = kiemelt.has(r.id);
        const felirat = rudFeliratok && lathatoS ? (rudFeliratok === "jel" ? `S${r.id}` : `${sz(S, 2)}`) : rudFeliratok === "jel" ? `S${r.id}` : null;
        return (
          <g key={r.id} onClick={onRud ? () => onRud(r.id) : undefined} style={onRud ? { cursor: "pointer" } : undefined}>
            {onRud && <line x1={kx(a.x)} y1={ky(a.y)} x2={kx(b.x)} y2={ky(b.y)} stroke="transparent" strokeWidth={18} />}
            {kiem && <line x1={kx(a.x)} y1={ky(a.y)} x2={kx(b.x)} y2={ky(b.y)} stroke={RACS_SZIN.kiemelt} strokeWidth={vast + 8} strokeLinecap="round" opacity="0.55" />}
            <line
              x1={kx(a.x)}
              y1={ky(a.y)}
              x2={kx(b.x)}
              y2={ky(b.y)}
              stroke={szin}
              strokeWidth={vast}
              strokeLinecap="round"
              strokeDasharray={ismert && !ismert.has(r.id) && szinez ? "7 5" : undefined}
              style={atmenet ? { transition: "stroke 0.45s ease, stroke-width 0.45s ease" } : undefined}
            />
            {vak && vakrudJel && <circle cx={mx} cy={my} r="5" fill="white" stroke={RACS_SZIN.vak} strokeWidth="1.8" />}
            {felirat && (
              <text x={mx + nx * 11} y={my + ny * 11 + 4} textAnchor="middle" fontSize="10.5" fontWeight="650" style={{ fill: lathatoS ? szin : RACS_SZIN.rud, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
                {felirat}
              </text>
            )}
          </g>
        );
      })}

      {/* terhek */}
      {terhek &&
        terhekLista.map((t, i) => {
          const c = csIdx.get(String(t.csomopont));
          if (!c) return null;
          const F = Math.hypot(t.Fx, t.Fy);
          const szog = (Math.atan2(t.Fy, t.Fx) * 180) / Math.PI;
          const hossz = Math.min(70, 34 + 2.2 * F);
          const fugg = Math.abs(t.Fx) < 1e-9;
          const cim = t.cimke ?? `${sz(F, F % 1 ? 1 : 0)} kN`;
          return <TeherNyil key={`f${i}`} x={kx(c.x)} y={ky(c.y) - (t.Fy < 0 ? 4 : -4)} hossz={hossz} szog={szog} cimke={cim} cimkeEltolas={fugg ? [7, -4] : t.Fx > 0 ? [-8 - 6 * cim.length, -4] : [8, -4]} />;
        })}

      {/* reakciók */}
      {reakciok &&
        eredmeny?.reakciok?.map((r, i) => {
          const c = csIdx.get(String(r.csomopont));
          if (!c) return null;
          const elemek = [];
          const jobbOldal = c.x > (lp.b.xMin + lp.b.xMax) / 2;
          const yElt = jobbOldal ? [-64, 4] : [8, 4];
          if (r.tipus === "csuklo") {
            if (Math.abs(r.Fx) > 1e-6) elemek.push(<ReakcioNyil key="x" x={kx(c.x) - (r.Fx > 0 ? 4 : -4)} y={ky(c.y) + 12} hossz={Math.min(60, 26 + 1.8 * Math.abs(r.Fx))} szog={r.Fx > 0 ? 0 : 180} cimke={`${r.jel}x = ${sz(Math.abs(r.Fx), 2)}`} cimkeEltolas={r.Fx > 0 ? [-64, 14] : [4, 14]} />);
            if (Math.abs(r.Fy) > 1e-6) elemek.push(<ReakcioNyil key="y" x={kx(c.x)} y={ky(c.y) + (r.Fy > 0 ? 4 : -4)} hossz={Math.min(64, 26 + 1.8 * Math.abs(r.Fy))} szog={r.Fy > 0 ? 90 : -90} cimke={`${r.jel}y = ${sz(Math.abs(r.Fy), 2)}`} cimkeEltolas={yElt} />);
          } else if (Math.abs(r.nagysag) > 1e-6) {
            const sg = (Math.atan2(r.Fy, r.Fx) * 180) / Math.PI;
            elemek.push(<ReakcioNyil key="n" x={kx(c.x)} y={ky(c.y) + 4} hossz={Math.min(64, 26 + 1.8 * Math.abs(r.nagysag))} szog={sg} cimke={`${r.jel} = ${sz(Math.abs(r.nagysag), 2)}`} cimkeEltolas={yElt} />);
          }
          return <g key={`r${i}`}>{elemek}</g>;
        })}

      {/* csomópontok */}
      {modell.csomopontok.map((c) => {
        const akt = aktiv.has(String(c.id));
        const ks = kesz.has(String(c.id));
        return (
          <g key={c.id} onClick={onCsomopont ? () => onCsomopont(String(c.id)) : undefined} style={onCsomopont ? { cursor: "pointer" } : undefined}>
            {onCsomopont && <circle cx={kx(c.x)} cy={ky(c.y)} r="16" fill="transparent" />}
            {akt && (
              <circle cx={kx(c.x)} cy={ky(c.y)} r="13" fill={RACS_SZIN.aktiv} opacity="0.25">
                <animate attributeName="r" values="9;15;9" dur="1.2s" repeatCount="indefinite" />
              </circle>
            )}
            <circle cx={kx(c.x)} cy={ky(c.y)} r={akt ? 5.5 : 4} fill={akt ? RACS_SZIN.aktiv : ks ? RACS_SZIN.kesz : "white"} stroke={akt ? RACS_SZIN.aktiv : ks ? RACS_SZIN.kesz : RACS_SZIN.csomopont} strokeWidth="1.8" style={atmenet ? { transition: "fill 0.3s, stroke 0.3s" } : undefined} />
            {csomopontCimkek && (
              <text
                x={kx(c.x) + (c.y >= lp.b.yMax - 1e-9 ? -9 : 9)}
                y={ky(c.y) + (c.y >= lp.b.yMax - 1e-9 ? -9 : c.y <= lp.b.yMin + 1e-9 ? 18 : -8)}
                textAnchor={c.y >= lp.b.yMax - 1e-9 ? "end" : "start"}
                fontSize="12"
                fontWeight="650"
                style={{ fill: akt ? RACS_SZIN.aktiv : RACS_SZIN.csomopont, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}
              >
                {c.id}
              </text>
            )}
          </g>
        );
      })}

      {/* méretek */}
      {meretek && <Meretek modell={modell} kx={kx} ky={ky} b={lp.b} />}

      {extra ? extra(kx, ky, lp) : null}
      {gyerekek}
    </>
  );
  if (csoport) return <g transform={`translate(${eltolas[0]} ${eltolas[1]})`}>{tartalom}</g>;
  return (
    <svg ref={svgRef} viewBox={`0 0 ${szelesseg} ${magassag}`} className={className} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} style={style}>
      {tartalom}
    </svg>
  );
}

function Meretek({ modell, kx, ky, b }) {
  const xs = [...new Set(modell.csomopontok.map((c) => Math.round(c.x * 1000) / 1000))].sort((p, q) => p - q);
  const ys = [...new Set(modell.csomopontok.map((c) => Math.round(c.y * 1000) / 1000))].sort((p, q) => p - q);
  const yM = ky(b.yMin) + 70;
  const xM = kx(b.xMax) + 30;
  return (
    <g>
      {xs.slice(0, -1).map((x, i) => (
        <Meret key={i} x1={kx(x)} x2={kx(xs[i + 1])} y={yM} cimke={sz(xs[i + 1] - x, 1)} />
      ))}
      <text x={kx(xs[xs.length - 1]) + 8} y={yM + 4} fontSize="11" style={{ fill: SZIN.meret }}>
        m
      </text>
      {ys.length <= 4 &&
        ys.slice(0, -1).map((y, i) => <MeretFugg key={i} x={xM} y1={ky(ys[i + 1])} y2={ky(y)} cimke={sz(ys[i + 1] - y, 1)} />)}
    </g>
  );
}

/** Rúderőtáblázat a tankönyv szerint: rúd | húzott [kN] | nyomott [kN]. */
export function RudErokTabla({ eredmeny, rudak, cim, kicsi = false }) {
  const lista = (rudak ? rudak.map((id) => eredmeny.rudTabla.find((r) => r.id === id)).filter(Boolean) : eredmeny.rudTabla) ?? [];
  return (
    <div className={`overflow-hidden rounded-xl border border-[color:var(--keret)] bg-white ${kicsi ? "text-[12px]" : "text-[13px]"}`}>
      {cim && <div className="border-b border-[color:var(--keret)] bg-petrol-50 px-3 py-1.5 text-[10.5px] font-bold tracking-[0.14em] text-petrol-500 uppercase">{cim}</div>}
      <table className="szamok w-full">
        <thead className="bg-petrol-50/70 text-[10.5px] tracking-wider text-petrol-500 uppercase">
          <tr>
            <th className="px-3 py-1.5 text-left font-semibold">rúd</th>
            <th className="px-3 py-1.5 text-right font-semibold text-rose-700">húzott [kN]</th>
            <th className="px-3 py-1.5 text-right font-semibold text-sky-700">nyomott [kN]</th>
          </tr>
        </thead>
        <tbody>
          {lista.map((r) => (
            <tr key={r.id} className="border-t border-petrol-100">
              <td className="px-3 py-1 text-petrol-800">S{r.id}</td>
              <td className="px-3 py-1 text-right text-rose-700">{r.huzo > 1e-6 ? sz(r.huzo, 2) : ""}</td>
              <td className="px-3 py-1 text-right text-sky-700">{r.nyomo > 1e-6 ? sz(r.nyomo, 2) : r.huzo > 1e-6 ? "" : <span className="text-petrol-400">0 (vakrúd)</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
