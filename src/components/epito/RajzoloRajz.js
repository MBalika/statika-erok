"use client";

import { TartoHegyek, BelsoCsuklo, TamaszCimke, SZIN } from "@/components/tartok/TartoElemek";
import { geometria, Szerkezet, AbraSav, SZINEK } from "@/components/igenybevetel/Diagram";
import { tippGorbe, pontosGorbe, kevertGorbe, szepLepes } from "@/lib/epito/rajz";
import { sz } from "@/lib/szamok";

/*
 * A rajzolás lépésének SVG-je (tiszta komponens, a teszt is ezt rendereli):
 *   fent a tartó a terhekkel (Diagram.js Szerkezet), lent a rajzoló sáv, ahol a diagramot
 *   A RÚDRA MERŐLEGESEN, a rúd mentén rajzoljuk (ferde és függőleges rúdon is), ugyanazzal a
 *   geometriával, mint a Diagram.js pontos ábrája — így a kettő egymásra illeszthető.
 *
 * A rajz oldala (tankönyv 8.3.2, 8.9. ábra): mindhárom ábrát a rúd ugyanazon pozitív oldalára rajzoljuk —
 * arra, amelyiket az M pozitív definíciójához választottuk (a kezdőponttól a végpont felé haladva a jobb
 * oldal; vízszintes rúdnál alul). Így a pozitív N, V és M a tartó alatt, a negatív fölötte van; a húzás
 * iránya is ebből származik (lefelé húzás = pozitív érték vízszintes rúdnál).
 */

export const SZ = 760;
export const AMP = 54;
const FOK = Math.PI / 180;
const ert = (v) => sz(v, Math.abs(v - Math.round(v)) > 1e-9 ? 1 : 0);

/** A rajz geometriája: léptékek, a két panel függőleges helye. */
export function rajzGeometria(e, { reakciok = false } = {}) {
  const g = geometria(e, { szel: SZ, margo: 112, maxMag: 176 });
  const szerkFent = 72, szerkLent = e.modell.tamaszok.length ? (reakciok ? 74 : 58) : 30;
  const szerkMag = szerkFent + g.magPx + szerkLent;
  const abraFent = AMP + 44;
  const abraMag = abraFent + g.magPx + AMP + 34;
  const H = szerkMag + abraMag;
  const ky1 = (y) => szerkFent + (g.maxY - y) * g.L;
  const ky2 = (y) => szerkMag + abraFent + (g.maxY - y) * g.L;
  return { g, kx: g.kx, ky1, ky2, szerkMag, abraMag, H, szerkFent, abraFent };
}

/**
 * Egy rúd tengelye és a pozitív oldala képernyő-egységvektorként (y lefelé). Az `ir` mindhárom jelre
 * ugyanaz: a kezdőponttól a végpont felé haladva a jobb oldal (vízszintes rúdnál lefelé) — a `jel`
 * paraméter csak az egységes hívásmód miatt marad. A `pozitivOldal: 1` rúdnál a bal oldal a pozitív.
 */
export function rudIranyok(r, jel) {
  const c = Math.cos(r.szogFok * FOK), s = Math.sin(r.szogFok * FOK);
  const tengely = [c, -s];
  const po = r.pozitivOldal === 1 ? -1 : 1;
  const ir = [po * s, po * c];
  return { c, s, tengely, ir };
}

/** Egy (rúd, lokális x, érték) → képernyő-pont. */
export function rajzPont(geo, r, jel, x, v, leptek) {
  const { c, s, ir } = rudIranyok(r, jel);
  const X = geo.kx(r.kezdo[0] + x * c), Y = geo.ky2(r.kezdo[1] + x * s);
  return [X + ir[0] * v * leptek, Y + ir[1] * v * leptek, X, Y];
}

/** A csomópont betűjelének helye: a rudaktól elfelé; támasznál a támaszjel alá. */
export function cimkeHely(m, i, kx, ky) {
  const cs = m.csomopontok[i];
  const x = kx(cs.x), y = ky(cs.y);
  const tam = m.tamaszok.find((t) => t.ics === i);
  const csatl = m.rudak.filter((r) => r.ia === i || r.ib === i);
  let dx = 0, dy = 0;
  for (const r of csatl) {
    const masikX = r.ia === i ? r.x2 : r.x1, masikY = r.ia === i ? r.y2 : r.y1;
    const h = Math.hypot(masikX - cs.x, masikY - cs.y) || 1;
    dx += (masikX - cs.x) / h;
    dy += (masikY - cs.y) / h;
  }
  const n = Math.hypot(dx, dy);
  if (tam) {
    if (tam.tipus === "befogas") {
      const fugg = csatl.length > 0 && csatl.every((r) => Math.abs(r.sin) > 0.7);
      return fugg ? [x + 18, y - 6] : [x, y + 30];
    }
    // a támaszjel alá, kicsit balra
    return [x - 17, y + (tam.tipus === "gorgo" ? 50 : 44)];
  }
  if (n < 0.3) {
    // átmenő csomópont (egy vonalban lévő rudak): a rúdra merőlegesen, lefelé
    const r = csatl[0];
    if (r && Math.abs(r.sin) > 0.7) return [x - 14, y + 4];
    return [x, y + 22];
  }
  const ex = -dx / n, ey = dy / n; // képernyőn y lefelé
  return [x + ex * 20, y + ey * 20 + 4];
}

/** Egy fogópont képernyő-helye (a rúd menti eltolással: két fogópont egymás mellett, közös csomópontban a saját rúd felé). */
export function fogoPozicio(geo, m, r, p, o, jel, v, leptek) {
  const { tengely } = rudIranyok(r, jel);
  const ketto = p[jel].fogok.length === 2;
  const kozos = p.cs !== null && m.rudak.filter((q) => q.ia === p.ics || q.ib === p.ics).length > 1;
  const elt = ketto ? (o === "bal" ? -9 : 9) : kozos ? (p.i === 0 ? 9 : -9) : 0;
  const [X0, Y0, AX, AY] = rajzPont(geo, r, jel, p.x, v, leptek);
  return { X: X0 + tengely[0] * elt, Y: Y0 + tengely[1] * elt, AX: AX + tengely[0] * elt, AY: AY + tengely[1] * elt, ketto, elt };
}

function utvonalak(f, r, jel, gorbe, geo, leptek) {
  const pontok = gorbe.map((szak) => szak.map(([x, v]) => rajzPont(geo, r, jel, x, v, leptek)));
  const vonal = pontok
    .map((szak, k) => {
      const elozo = k > 0 ? pontok[k - 1][pontok[k - 1].length - 1] : null;
      return (elozo ? `M ${elozo[0]} ${elozo[1]} L ` : "M ") + szak.map((p) => `${p[0]} ${p[1]}`).join(" L ");
    })
    .join(" ");
  const terulet = pontok.map((szak) => `M ${szak[0][2]} ${szak[0][3]} ` + szak.map((p) => `L ${p[0]} ${p[1]}`).join(" ") + ` L ${szak[szak.length - 1][2]} ${szak[szak.length - 1][3]} Z`).join(" ");
  const kezd = pontok[0][0], veg = pontok[pontok.length - 1][pontok[pontok.length - 1].length - 1];
  return { vonal: `M ${kezd[2]} ${kezd[3]} L ${vonal.slice(2)} L ${veg[2]} ${veg[3]}`, terulet };
}

/**
 * props:
 *   f, e            – rajzFeladat és elemez eredménye
 *   jel             – "V" | "M" | "N" (az aktív fül)
 *   rajz, alakok, szelsok, lept (rajzLeptekek), anim (0…1: a tipp → a pontos)
 *   pontosAbra      – 0…1: a Diagram.js pontos ábrájának áttetszősége (segítség 3 / megoldás)
 *   eredmeny        – ellenoriz() kimenete vagy null; jelolesek: a jó/rossz jelek mutatása
 *   kiemelt         – { rud, x, jel } — villogó gyűrű
 *   aktiv, onLe(esem) – a vászon pointerdown-ja (a Rajzoló keresi meg a legközelebbi fogópontot), zart, reakciok (0…1), svgRef, cimkek
 */
export default function RajzoloRajz({ f, e, jel, rajz, alakok, szelsok, lept, anim = 0, pontosAbra = 0, eredmeny = null, jelolesek = false, kiemelt = null, aktiv = null, onLe, zart = false, reakciok = 0, svgRef, cimkek = true }) {
  const geo = rajzGeometria(e, { reakciok: reakciok > 0.01 });
  const { g, kx, ky1, ky2 } = geo;
  const leptek = lept.leptek[jel];
  const hatar = lept.hatar[jel];
  const szin = SZINEK[jel];
  const tipp = tippGorbe(f, rajz, alakok, szelsok, jel);
  const pontos = pontosGorbe(f, jel);
  const kevert = anim > 0 ? kevertGorbe(tipp, pontos, anim) : tipp;
  const m = e.modell;
  const csuklok = new Set();
  for (const r of m.rudak) { if (r.csukloA) csuklok.add(r.ia); if (r.csukloB) csuklok.add(r.ib); }
  const reszlet = (rud, i, o) => eredmeny?.joPontok.find((q) => q.rud === rud && q.i === i && q.jel === jel && q.oldal === o);
  const hibaItt = (rud, i, o) => eredmeny?.hibak.find((h) => h.rud === rud && h.i === i && h.jel === jel && (h.oldal === o || h.kod === "ugras_hianyzik" || h.kod === "ugras_rossz" || h.kod === "ugras_felesleges" || (h.kod === "sarok" && h.oldal === o)));
  const fogoSzin = (rud, i, o) => {
    if (!jelolesek || !eredmeny) return szin;
    if (reszlet(rud, i, o)) return "#15803d";
    return hibaItt(rud, i, o) ? "#dc2626" : szin;
  };
  const lepesFelirat = szepLepes(hatar);

  return (
    <svg ref={svgRef} viewBox={`0 0 ${SZ} ${geo.H}`} className="abra h-auto w-full select-none" style={{ touchAction: "none" }} onPointerDown={zart ? undefined : onLe}>
      <TartoHegyek />
      {/* ---------- a tartó a terhekkel ---------- */}
      <text x={12} y={16} fontSize="11" fontWeight="700" style={{ fill: "#64748b" }}>A tartó és a terhek</text>
      <Szerkezet e={e} g={g} ky={ky1} reakciok={reakciok > 0.01} reakcioOpacitas={reakciok} terhek teherCimkek csomopontCimkek={false} meretek={false} />
      {cimkek && m.csomopontok.map((cs, i) => {
        const [X, Y] = cimkeHely(m, i, kx, ky1);
        return <TamaszCimke key={cs.id} x={X} y={Y}>{cs.id}</TamaszCimke>;
      })}

      {/* ---------- a rajzoló sáv ---------- */}
      <g>
        <line x1={12} y1={geo.szerkMag + 2} x2={SZ - 12} y2={geo.szerkMag + 2} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 4" />
        <text x={12} y={geo.szerkMag + 18} fontSize="12" fontWeight="700" style={{ fill: szin }}>
          {jel === "V" ? "V – nyíróerő [kN]" : jel === "M" ? "M – hajlítónyomaték [kNm]" : "N – normálerő [kN]"}
        </text>
        <text x={12} y={geo.szerkMag + 32} fontSize="10" style={{ fill: "#64748b" }}>
          {jel === "M" ? "+ a húzott (pozitív) oldalon — vízszintes rúdnál alul" : jel === "V" ? "+ a pozitív oldalon, mint az M-nél — vízszintes rúdnál alul" : "+ húzás; a pozitív oldalon, mint az M-nél — vízszintes rúdnál alul"}
        </text>
        {/* lépték-vonalzó a bal szélen: a pozitív érték lefelé (vízszintes rúd pozitív oldala), mint az ábrán */}
        {(() => {
          const X = 34, Y0 = geo.szerkMag + geo.abraFent + (g.magPx > 0 ? g.magPx / 2 : 0);
          const ticks = [];
          for (let v = -Math.floor(hatar / lepesFelirat) * lepesFelirat; v <= hatar + 1e-9; v += lepesFelirat) ticks.push(Math.round(v * 100) / 100);
          return (
            <g>
              <line x1={X} y1={Y0 - hatar * leptek} x2={X} y2={Y0 + hatar * leptek} stroke="#94a3b8" strokeWidth="1" />
              {ticks.map((v) => (
                <g key={v}>
                  <line x1={X - 3} y1={Y0 + v * leptek} x2={X + 3} y2={Y0 + v * leptek} stroke="#94a3b8" strokeWidth="1" />
                  <text x={X - 6} y={Y0 + v * leptek + 3.5} textAnchor="end" fontSize="9.5" style={{ fill: "#64748b" }}>{ert(v)}</text>
                </g>
              ))}
              <text x={X + 8} y={Y0 + hatar * leptek + 4} fontSize="9.5" fontWeight="700" style={{ fill: szin, opacity: 0.85 }}>+</text>
              <text x={X + 8} y={Y0 - hatar * leptek + 4} fontSize="9.5" fontWeight="700" style={{ fill: "#94a3b8" }}>−</text>
            </g>
          );
        })()}

        {/* a rudak tengelye, a töréspont-jelek, a pozitív oldal jele */}
        {f.rudak.map((r) => {
          const { tengely, ir } = rudIranyok(r, jel);
          const A = [kx(r.kezdo[0]), ky2(r.kezdo[1])], B = [kx(r.veg[0]), ky2(r.veg[1])];
          const Lpx = Math.hypot(B[0] - A[0], B[1] - A[1]);
          return (
            <g key={r.rud}>
              <line x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]} stroke={SZIN.tarto} strokeWidth="1.8" opacity="0.75" />
              {r.torespontok.map((p) => {
                const X = A[0] + tengely[0] * p.x * g.L, Y = A[1] + tengely[1] * p.x * g.L;
                return <line key={p.i} x1={X + ir[0] * (AMP + 8)} y1={Y + ir[1] * (AMP + 8)} x2={X - ir[0] * (AMP + 8)} y2={Y - ir[1] * (AMP + 8)} stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="2 3" />;
              })}
              {/* a szakaszok alakjának jele (M) — a szakasz közepén, a negatív oldalon */}
              {jel === "M" && r.szakaszok.map((s, k) => {
                const xk = (s.x1 + s.x2) / 2;
                const X = A[0] + tengely[0] * xk * g.L - ir[0] * (AMP + 20), Y = A[1] + tengely[1] * xk * g.L - ir[1] * (AMP + 20);
                const sz_ = szelsok?.[r.rud]?.[k];
                const alak = sz_ ? "•" : alakok?.[r.rud]?.[k] ?? "egyenes";
                const helyes = jelolesek && eredmeny ? !eredmeny.hibak.some((h) => h.kod === "alak" && h.rud === r.rud && h.szakasz === k) : null;
                return (
                  <text key={k} x={X} y={Y + 4} textAnchor="middle" fontSize="10.5" fontWeight="700" style={{ fill: helyes === null ? "#64748b" : helyes ? "#15803d" : "#dc2626", paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
                    {f.rudak.length > 1 ? `${r.rud}.${k + 1}` : `${k + 1}.`} {alak === "•" ? "◆" : alak === "egyenes" ? "—" : alak === "U" ? "∪" : "∩"}
                  </text>
                );
              })}
              {/* + jel a pozitív (az M-hez választott) oldalon, − a másikon, a rúd elejénél — mindhárom ábrán ugyanott */}
              <text x={A[0] + tengely[0] * 10 + ir[0] * (AMP + 4)} y={A[1] + tengely[1] * 10 + ir[1] * (AMP + 4) + 3.5} textAnchor="middle" fontSize="10" fontWeight="700" style={{ fill: szin, opacity: 0.7 }}>+</text>
              <text x={A[0] + tengely[0] * 10 - ir[0] * (AMP + 4)} y={A[1] + tengely[1] * 10 - ir[1] * (AMP + 4) + 3.5} textAnchor="middle" fontSize="10" fontWeight="700" style={{ fill: "#94a3b8", opacity: 0.8 }}>−</text>
              {Lpx > 0 && f.rudak.length > 1 && (
                <text x={(A[0] + B[0]) / 2 - ir[0] * 11} y={(A[1] + B[1]) / 2 - ir[1] * 11 + (Math.abs(tengely[0]) > 0.7 ? -2 : 4)} textAnchor="middle" fontSize="9.5" fontStyle="italic" style={{ fill: "#64748b", paintOrder: "stroke", stroke: "white", strokeWidth: 2.5 }}>{r.rud}.</text>
              )}
            </g>
          );
        })}
        {[...csuklok].map((ics) => <BelsoCsuklo key={ics} x={kx(m.csomopontok[ics].x)} y={ky2(m.csomopontok[ics].y)} r={4} />)}
        {cimkek && m.csomopontok.map((cs, i) => {
          const [X, Y] = cimkeHely({ ...m, tamaszok: [] }, i, kx, ky2);
          return <TamaszCimke key={cs.id} x={X} y={Y} meret={11.5}>{cs.id}</TamaszCimke>;
        })}

        {/* a pontos ábra (segítség 3 / megoldás) */}
        {pontosAbra > 0.01 && (
          <g opacity={pontosAbra}>
            <AbraSav e={e} g={g} ky={ky2} jel={jel} leptek={leptek} cimkek kiemelSzelso={jel === "M" ? 1 : 0} oldalJelek={false} />
          </g>
        )}

        {/* a rajzolt görbék */}
        {f.rudak.map((r) => {
          const u = utvonalak(f, r, jel, kevert[r.rud], geo, leptek);
          return (
            <g key={r.rud}>
              <path d={u.terulet} fill={szin} fillOpacity={0.1 + 0.08 * anim} stroke="none" />
              <path d={u.vonal} fill="none" stroke={szin} strokeWidth={2 + 0.4 * anim} strokeLinejoin="round" />
            </g>
          );
        })}

        {/* fogópontok */}
        {f.rudak.map((r) => {
          const { tengely } = rudIranyok(r, jel);
          return r.torespontok.map((p) =>
            p[jel].fogok.map((o) => {
              const v = rajz[jel][r.rud][p.i][o];
              const { X, Y, AX, AY, ketto } = fogoPozicio(geo, m, r, p, o, jel, v, leptek);
              const szinF = fogoSzin(r.rud, p.i, o);
              const kulcs = `${jel}|${r.rud}|${p.i}|${o}`;
              const kiem = kiemelt && kiemelt.kod !== "szelso" && kiemelt.kod !== "alak" && kiemelt.rud === r.rud && kiemelt.jel === jel && kiemelt.i === p.i && (!kiemelt.oldal || kiemelt.oldal === o || !ketto);
              const felirat = ert(v);
              const jobbra = tengely[0] >= 0 ? (ketto ? o === "jobb" : p.x < r.hossz * 0.85) : (ketto ? o === "bal" : p.x > r.hossz * 0.15);
              const fugg = Math.abs(tengely[0]) < 0.5;
              return (
                <g key={kulcs} style={{ cursor: zart ? "default" : "move" }}>
                  <line x1={AX} y1={AY} x2={X} y2={Y} stroke={szinF} strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
                  {kiem && <circle cx={X} cy={Y} r="14" fill="none" stroke="#f59e0b" strokeWidth="2.5"><animate attributeName="r" values="11;20;11" dur="1.1s" repeatCount="indefinite" /><animate attributeName="opacity" values="1;0.2;1" dur="1.1s" repeatCount="indefinite" /></circle>}
                  <circle cx={X} cy={Y} r="24" fill="transparent" />
                  <circle cx={X} cy={Y} r={aktiv === kulcs ? 9.5 : 7.5} fill={jelolesek && eredmeny ? szinF : "white"} stroke={szinF} strokeWidth="2.5" style={{ transition: "r 0.15s" }} />
                  {jelolesek && eredmeny && (reszlet(r.rud, p.i, o) ? <path d={`M ${X - 3.5} ${Y} l 2.5 2.5 l 4.5 -5`} fill="none" stroke="white" strokeWidth="1.8" /> : hibaItt(r.rud, p.i, o) ? <path d={`M ${X - 3} ${Y - 3} l 6 6 M ${X + 3} ${Y - 3} l -6 6`} fill="none" stroke="white" strokeWidth="1.8" /> : null)}
                  {!zart && !fugg && <path d={`M ${X - 3} ${Y - 11} l 3 -4 l 3 4 M ${X - 3} ${Y + 11} l 3 4 l 3 -4`} fill="none" stroke={szinF} strokeWidth="1.3" />}
                  {!zart && fugg && <path d={`M ${X - 11} ${Y - 3} l -4 3 l 4 3 M ${X + 11} ${Y - 3} l 4 3 l -4 3`} fill="none" stroke={szinF} strokeWidth="1.3" />}
                  <text x={fugg ? X : jobbra ? X + 12 : X - 12} y={fugg ? Y + (o === "bal" ? -13 : 20) : Y + 4} textAnchor={fugg ? "middle" : jobbra ? "start" : "end"} fontSize="11" fontWeight="700" style={{ fill: szinF, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
                    {felirat}
                  </text>
                </g>
              );
            }),
          );
        })}

        {/* szélsőérték-fogópontok (M) */}
        {jel === "M" && f.rudak.map((r) =>
          r.szakaszok.map((s, k) => {
            const sz_ = szelsok?.[r.rud]?.[k];
            if (!sz_) return null;
            const [X, Y, AX, AY] = rajzPont(geo, r, jel, sz_.x, sz_.ertek, leptek);
            const jo = jelolesek && eredmeny ? (eredmeny.joPontok.some((q) => q.rud === r.rud && q.szakasz === k && q.oldal === "szelso") ? true : eredmeny.hibak.some((h) => h.kod === "szelso" && h.rud === r.rud && h.szakasz === k) ? false : null) : null;
            const szinF = jo === null ? "#b45309" : jo ? "#15803d" : "#dc2626";
            const kulcs = `szelso|${r.rud}|${k}`;
            const kiem = kiemelt && kiemelt.kod === "szelso" && kiemelt.rud === r.rud && kiemelt.szakasz === k;
            return (
              <g key={kulcs} style={{ cursor: zart ? "default" : "move" }}>
                <line x1={AX} y1={AY} x2={X} y2={Y} stroke={szinF} strokeWidth="1" strokeDasharray="2 2" opacity="0.7" />
                {kiem && <circle cx={X} cy={Y} r="14" fill="none" stroke="#f59e0b" strokeWidth="2.5"><animate attributeName="r" values="11;20;11" dur="1.1s" repeatCount="indefinite" /></circle>}
                <circle cx={X} cy={Y} r="24" fill="transparent" />
                <path d={`M ${X} ${Y - 9} L ${X + 9} ${Y} L ${X} ${Y + 9} L ${X - 9} ${Y} Z`} fill={aktiv === kulcs ? szinF : "white"} stroke={szinF} strokeWidth="2.4" />
                <text x={X} y={Y - 14} textAnchor="middle" fontSize="10.5" fontWeight="700" style={{ fill: szinF, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
                  x = {ert(sz_.x)} m · M = {ert(sz_.ertek)}
                </text>
              </g>
            );
          }),
        )}
        {/* a hiányzó szélsőérték kiemelése (a hiba listából) */}
        {kiemelt && kiemelt.kod === "szelso" && kiemelt.rajzolt === null && (() => {
          const r = f.rudak.find((q) => q.rud === kiemelt.rud);
          if (!r) return null;
          const [, , AX, AY] = rajzPont(geo, r, jel, kiemelt.x, 0, leptek);
          return <circle cx={AX} cy={AY} r="12" fill="none" stroke="#f59e0b" strokeWidth="2.5"><animate attributeName="r" values="9;18;9" dur="1.1s" repeatCount="indefinite" /></circle>;
        })()}
        {/* alak-hiba kiemelése: a szakasz közepén */}
        {kiemelt && kiemelt.kod === "alak" && (() => {
          const r = f.rudak.find((q) => q.rud === kiemelt.rud);
          if (!r) return null;
          const [, , AX, AY] = rajzPont(geo, r, jel, kiemelt.x, 0, leptek);
          return <circle cx={AX} cy={AY} r="16" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="4 3"><animate attributeName="r" values="12;24;12" dur="1.1s" repeatCount="indefinite" /></circle>;
        })()}
      </g>
    </svg>
  );
}
