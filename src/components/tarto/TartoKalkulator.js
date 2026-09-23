"use client";

import { useMemo, useState } from "react";
import { elemez, ertekek, mintak } from "@/lib/tarto";
import { SABLONOK, alapParameterek } from "@/lib/tarto/sablonok";
import { TartoHegyek, Gorgo, Csuklo, Befogas, TeherNyil, KoncentraltNyomatek, SZIN } from "@/components/tartok/TartoElemek";
import { Csuszka } from "@/components/abrak/ErovektorBonto";
import { M as Keplet } from "@/components/ui/Keplet";
import { sz } from "@/lib/szamok";
import TartoLevezetes from "./TartoLevezetes";

const SZ = 680;
const MA = 460;
// a terhek narancs, a reakciók lila színétől eltérő: N zöld, V kék, M bordó
const SZINEK = { N: "#059669", V: "#0369a1", M: "#be123c" };
const NEVEK = { N: "Normálerő, N", V: "Nyíróerő, V", M: "Hajlítónyomaték, M" };
const EGYSEG = { N: "kN", V: "kN", M: "kNm" };

/**
 * A terhek rajza a normalizált modellből: koncentrált erők (csomóponti és rúdon),
 * koncentrált nyomatékok, megoszló terhek (ferde rúdon is). A csúszkával együtt
 * mozognak, így látszik, hová kerül az erő és hogyan követi az ábra.
 */
function Terhek({ m, kx, ky }) {
  const elemek = [];
  let maxQ = 0;
  for (const rud of m.rudak) for (const q of rud.megoszlok) maxQ = Math.max(maxQ, Math.hypot(q.qx1, q.qy1), Math.hypot(q.qx2, q.qy2));
  const qLeptek = maxQ > 1e-9 ? 34 / maxQ : 0;
  const H = 56; // koncentrált erő nyílhossza

  const ero = (kulcs, X, Y, Fx, Fy) => {
    const n = Math.hypot(Fx, Fy);
    if (n < 1e-9) return;
    const szog = (Math.atan2(Fy, Fx) * 180) / Math.PI;
    // a felirat a nyíl farkánál
    const ex = Fx / n, ey = Fy / n;
    elemek.push(
      <TeherNyil key={kulcs} x={X} y={Y} hossz={H} szog={szog} cimke={`${sz(n, n % 1 ? 1 : 0)} kN`}
        cimkeEltolas={[-ex * 4 + (Math.abs(ex) < 0.3 ? 8 : -ex * 26 - 14), ey * 4 + (Math.abs(ey) < 0.3 ? -8 : ey * 10 + 4)]} />
    );
  };

  m.csomopontiTerhek.forEach((t, i) => {
    const cs = m.csomopontok[i];
    ero(`cs${i}`, kx(cs.x), ky(cs.y), t.Fx, t.Fy);
    if (Math.abs(t.M) > 1e-9) elemek.push(<KoncentraltNyomatek key={`csm${i}`} x={kx(cs.x)} y={ky(cs.y)} irany={t.M > 0 ? 1 : -1} cimke={`${sz(Math.abs(t.M), 0)} kNm`} />);
  });

  for (const rud of m.rudak) {
    const { cos: c, sin: s } = rud;
    rud.pontTerhek.forEach((p, i) => {
      const X = kx(rud.x1 + p.a * c), Y = ky(rud.y1 + p.a * s);
      ero(`p${rud.id}-${i}`, X, Y, p.Px * c - p.Py * s, p.Px * s + p.Py * c);
      if (Math.abs(p.Mz) > 1e-9) elemek.push(<KoncentraltNyomatek key={`pm${rud.id}-${i}`} x={X} y={Y} irany={p.Mz > 0 ? 1 : -1} cimke={`${sz(Math.abs(p.Mz), 0)} kNm`} />);
    });
    rud.megoszlok.forEach((q, i) => {
      const dL = q.a2 - q.a1;
      if (dL < 1e-9 || qLeptek === 0) return;
      const pxHossz = dL * Math.hypot(kx(1) - kx(0), ky(1) - ky(0));
      const n = Math.max(2, Math.round(pxHossz / 22));
      const nyilak = [], farkak = [];
      for (let k = 0; k <= n; k++) {
        const u = k / n;
        const a = q.a1 + dL * u;
        const qx = q.qx1 + (q.qx2 - q.qx1) * u, qy = q.qy1 + (q.qy2 - q.qy1) * u;
        const Fx = qx * c - qy * s, Fy = qx * s + qy * c;
        const nagy = Math.hypot(Fx, Fy);
        const X = kx(rud.x1 + a * c), Y = ky(rud.y1 + a * s);
        if (nagy < 1e-9) { farkak.push([X, Y]); continue; }
        const h = nagy * qLeptek;
        const tx = X - (Fx / nagy) * h, ty = Y + (Fy / nagy) * h;
        farkak.push([tx, ty]);
        nyilak.push(<line key={k} x1={tx} y1={ty} x2={X} y2={Y} stroke={SZIN.teher} strokeWidth="1.6" markerEnd="url(#th-teher)" />);
      }
      // a felirat a szakasz első harmadánál, hogy ne takarja a középre eső koncentrált erő címkéjét
      const kozep = farkak[Math.max(1, Math.floor(farkak.length * 0.3))] ?? farkak[0];
      const q1 = Math.hypot(q.qx1, q.qy1), q2 = Math.hypot(q.qx2, q.qy2);
      const cimke = Math.abs(q1 - q2) < 1e-9 ? `${sz(q1, q1 % 1 ? 1 : 0)} kN/m` : `${sz(q1, q1 % 1 ? 1 : 0)} … ${sz(q2, q2 % 1 ? 1 : 0)} kN/m`;
      // a felirat a farkak vonalától kifelé (a teherrel ellentétes irányban)
      const Fy0 = q.qx1 * s + q.qy1 * c + q.qx2 * s + q.qy2 * c;
      elemek.push(
        <g key={`q${rud.id}-${i}`}>
          <polyline points={farkak.map((f) => f.join(",")).join(" ")} fill="none" stroke={SZIN.teher} strokeWidth="1.8" />
          {nyilak}
          <text x={kozep[0]} y={kozep[1] + (Fy0 <= 0 ? -7 : 15)} textAnchor="middle" fontSize="12.5" fontWeight="650"
            style={{ fill: SZIN.teher, paintOrder: "stroke", stroke: "white", strokeWidth: 3.5 }}>
            {cimke}
          </text>
        </g>
      );
    });
  }
  return <g>{elemek}</g>;
}

export default function TartoKalkulator() {
  const [sablonId, setSablonId] = useState(SABLONOK[0].id);
  const sablon = SABLONOK.find((s) => s.id === sablonId) ?? SABLONOK[0];
  const [parak, setParak] = useState(() => alapParameterek(SABLONOK[0]));
  const [abra, setAbra] = useState("M");
  const [metszetU, setMetszetU] = useState(0.35);
  const [kiemeles, setKiemeles] = useState(null); // a levezetés aktuális főpontja

  const valt = (id) => {
    const uj = SABLONOK.find((s) => s.id === id);
    setSablonId(id);
    setParak(alapParameterek(uj));
    setMetszetU(0.35);
  };

  const bemenet = useMemo(() => sablon.keszit(parak), [sablon, parak]);
  const eredmeny = useMemo(() => {
    try {
      return elemez(bemenet);
    } catch (e) {
      return { ok: false, hibak: ["Számítási hiba: " + e.message] };
    }
  }, [bemenet]);

  /* ---------- geometria és lépték ---------- */
  const rajz = useMemo(() => {
    if (!eredmeny.ok) return null;
    const m = eredmeny.modell;
    const xs = m.csomopontok.map((c) => c.x);
    const ys = m.csomopontok.map((c) => c.y);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    const szel = Math.max(maxX - minX, 1);
    const mag = Math.max(maxY - minY, 0.5);
    const L = Math.min((SZ - 150) / szel, (MA - 230) / Math.max(mag, 1.5));
    const OX = (SZ - szel * L) / 2 - minX * L;
    const OY = MA * 0.46 + maxY * L;
    const kx = (x) => OX + x * L;
    const ky = (y) => OY - y * L;

    // diagram-lépték: a legnagyobb érték a rendelkezésre álló magasság ~26 %-a legyen
    const maxErtek = { N: 0, V: 0, M: 0 };
    for (const ig of eredmeny.igenybevetelek) {
      for (const jel of ["N", "V", "M"]) {
        maxErtek[jel] = Math.max(maxErtek[jel], Math.abs(ig.szelso[jel].min), Math.abs(ig.szelso[jel].max));
      }
    }
    const dLeptek = {};
    for (const jel of ["N", "V", "M"]) {
      dLeptek[jel] = maxErtek[jel] > 1e-9 ? (MA * 0.22) / maxErtek[jel] : 0;
    }
    return { kx, ky, L, maxErtek, dLeptek, modell: m };
  }, [eredmeny]);

  /* ---------- metszet helye (teljes ívhossz mentén) ---------- */
  const metszet = useMemo(() => {
    if (!eredmeny.ok) return null;
    const hosszak = eredmeny.igenybevetelek.map((i) => i.hossz);
    const osszes = hosszak.reduce((a, b) => a + b, 0);
    let s = metszetU * osszes;
    for (let i = 0; i < hosszak.length; i++) {
      if (s <= hosszak[i] || i === hosszak.length - 1) {
        const x = Math.min(hosszak[i], Math.max(0, s));
        const ig = eredmeny.igenybevetelek[i];
        return { rudIndex: i, x, ig, ertek: ertekek(ig, x) };
      }
      s -= hosszak[i];
    }
    return null;
  }, [eredmeny, metszetU]);

  /* ---------- rajzelemek ---------- */
  /**
   * A rúd pozitív oldala képernyő-egységvektorként (y lefelé): a kezdőponttól a végpont felé haladva a jobb
   * oldal, vízszintes rúdnál lefelé. Mindhárom ábra (N, V, M) pozitív értéke erre az oldalra kerül — arra,
   * amelyiket a nyomaték pozitív definíciójához választottuk (tankönyv 8.3.2, 8.9. ábra).
   */
  function pozitivIrany(ig) {
    const c = Math.cos((ig.szogFok * Math.PI) / 180);
    const s = Math.sin((ig.szogFok * Math.PI) / 180);
    const po = ig.pozitivOldal === 1 ? -1 : 1;
    return [po * s, po * c];
  }

  function diagramUt(ig, jel) {
    if (!rajz || rajz.dLeptek[jel] === 0) return null;
    const r = rajz;
    const c = Math.cos((ig.szogFok * Math.PI) / 180);
    const s = Math.sin((ig.szogFok * Math.PI) / 180);
    const ir = pozitivIrany(ig);
    const pontok = mintak(ig, 28).map((p) => {
      const mx = ig.kezdo[0] + p.x * c;
      const my = ig.kezdo[1] + p.x * s;
      const e = p[jel] * r.dLeptek[jel];
      return [r.kx(mx) + ir[0] * e, r.ky(my) + ir[1] * e];
    });
    const alap = mintak(ig, 28).map((p) => {
      const mx = ig.kezdo[0] + p.x * c;
      const my = ig.kezdo[1] + p.x * s;
      return [r.kx(mx), r.ky(my)];
    });
    const d = `M ${alap[0][0]} ${alap[0][1]} ` +
      pontok.map((p) => `L ${p[0]} ${p[1]}`).join(" ") +
      ` L ${alap[alap.length - 1][0]} ${alap[alap.length - 1][1]} Z`;
    const vonal = "M " + pontok.map((p) => `${p[0]} ${p[1]}`).join(" L ");
    return { d, vonal };
  }

  if (!eredmeny.ok) {
    return (
      <div className="my-6 rounded-2xl border border-rose-300 bg-rose-50 p-5">
        <p className="text-[13px] font-bold tracking-[0.16em] text-rose-700 uppercase">Nem megoldható</p>
        <ul className="mt-2 list-disc pl-5 text-[14px] text-petrol-800">
          {(eredmeny.hibak ?? []).map((h, i) => <li key={i}>{h}</li>)}
        </ul>
        <button type="button" onClick={() => valt(sablonId)} className="mt-4 rounded-lg bg-petrol-700 px-4 py-2 text-[13px] font-semibold text-white">
          Alaphelyzet
        </button>
      </div>
    );
  }

  const r = rajz;
  const ig0 = eredmeny.igenybevetelek;

  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white shadow-sm shadow-petrol-900/[0.04]">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-b border-[color:var(--keret)] bg-linear-to-r from-petrol-800 to-petrol-700 px-5 py-3.5">
        <span className="rounded-md bg-naracs-500 px-2 py-0.5 text-[10.5px] font-bold tracking-[0.14em] text-white uppercase">Kalkulátor</span>
        <h3 className="text-[15px] font-semibold text-white">Igénybevételi ábrák</h3>
        <span className="ml-auto text-[11.5px] text-petrol-200">
          {eredmeny.merleg.tipus === "hatarozatlan"
            ? `${eredmeny.merleg.fok}× határozatlan`
            : "statikailag határozott"}
          {eredmeny.ellenorzes.rendben ? " · egyensúly ✓" : " · egyensúly ✗"}
        </span>
      </div>

      {/* sablonválasztó */}
      <div className="flex flex-wrap gap-1.5 border-b border-[color:var(--keret)] bg-petrol-50/60 px-4 py-2.5">
        {SABLONOK.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => valt(s.id)}
            className={`rounded-lg px-3 py-1.5 text-[12.5px] font-semibold transition ${
              s.id === sablonId ? "bg-petrol-800 text-white" : "bg-white text-petrol-700 ring-1 ring-petrol-200 hover:bg-petrol-50"
            }`}
          >
            {s.nev}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1.45fr_1fr] [&>*]:min-w-0">
        {/* ---------- rajz ---------- */}
        <div className="racs-vilagos border-b border-[color:var(--keret)] p-3 lg:border-r lg:border-b-0">
          <div className="mb-2 flex flex-wrap gap-1.5">
            {["szerkezet", "N", "V", "M"].map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setAbra(k)}
                className={`rounded-lg px-3 py-1 text-[12.5px] font-semibold transition ${
                  abra === k ? "text-white" : "bg-white text-petrol-700 ring-1 ring-petrol-200 hover:bg-petrol-50"
                }`}
                style={abra === k ? { backgroundColor: k === "szerkezet" ? SZIN.tarto : SZINEK[k] } : undefined}
              >
                {k === "szerkezet" ? "Szerkezet" : `${k} ábra`}
              </button>
            ))}
          </div>

          <svg viewBox={`0 0 ${SZ} ${MA}`} className="abra h-auto w-full">
            <TartoHegyek />

            {/* igénybevételi ábra */}
            {abra !== "szerkezet" && ig0.map((ig, i) => {
              const u = diagramUt(ig, abra);
              if (!u) return null;
              return (
                <g key={`d${i}`}>
                  <path d={u.d} fill={SZINEK[abra]} fillOpacity="0.16" stroke="none" />
                  <path d={u.vonal} fill="none" stroke={SZINEK[abra]} strokeWidth="2.2" strokeLinejoin="round" />
                </g>
              );
            })}
            {/* a „+” és „−” oldal jele a rúd elejénél (tankönyv 8.9. ábra): az első rúdon és a szabad kezdetű rudakon (az előző rúd végéhez csatlakozó saroknál nem) */}
            {abra !== "szerkezet" && ig0.map((ig, i) => {
              const elozoIg = i > 0 ? ig0[i - 1] : null;
              if (elozoIg && Math.hypot(elozoIg.veg[0] - ig.kezdo[0], elozoIg.veg[1] - ig.kezdo[1]) < 1e-6) return null;
              const c = Math.cos((ig.szogFok * Math.PI) / 180);
              const s = Math.sin((ig.szogFok * Math.PI) / 180);
              const ir = pozitivIrany(ig);
              // a támaszjel elé, a rúd kezdete előtt 24 px-szel, a rúdra merőlegesen ±15 px
              const hx = r.kx(ig.kezdo[0]) - c * 24, hy = r.ky(ig.kezdo[1]) + s * 24;
              return (
                <g key={`oj${i}`} opacity="0.85">
                  <text x={hx + ir[0] * 15} y={hy + ir[1] * 15 + 3.5} textAnchor="middle" fontSize="11" fontWeight="700" style={{ fill: SZINEK[abra], paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>+</text>
                  <text x={hx - ir[0] * 15} y={hy - ir[1] * 15 + 3.5} textAnchor="middle" fontSize="11" fontWeight="700" style={{ fill: "#64748b", paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>−</text>
                </g>
              );
            })}

            {/* a szerkezet */}
            {r.modell.rudak.map((rud) => (
              <line
                key={rud.id}
                x1={r.kx(rud.x1)} y1={r.ky(rud.y1)}
                x2={r.kx(rud.x2)} y2={r.ky(rud.y2)}
                stroke={SZIN.tarto} strokeWidth="5" strokeLinecap="round"
              />
            ))}

            {/* csuklók a rúdvégeken */}
            {r.modell.rudak.filter((rud) => rud.csukloA || rud.csukloB).map((rud) => {
              const p = rud.csukloA ? [rud.x1, rud.y1] : [rud.x2, rud.y2];
              return <circle key={`cs${rud.id}`} cx={r.kx(p[0])} cy={r.ky(p[1])} r="5" fill="white" stroke={SZIN.tarto} strokeWidth="2.2" />;
            })}

            {/* támaszok */}
            {r.modell.tamaszok.map((t, i) => {
              const cs = r.modell.csomopontok[t.ics];
              const x = r.kx(cs.x), y = r.ky(cs.y);
              if (t.tipus === "csuklo") return <Csuklo key={i} x={x} y={y} />;
              if (t.tipus === "befogas") {
                // a fal a rúd folytatásában
                const rud = r.modell.rudak.find((rr) => rr.ia === t.ics || rr.ib === t.ics);
                const fuggoleges = rud && Math.abs(rud.sin) > 0.7;
                return <Befogas key={i} x={x} y={y} irany={fuggoleges ? "le" : "bal"} />;
              }
              if (t.tipus === "gorgo") return <Gorgo key={i} x={x} y={y} szog={t.szog - 90} />;
              return (
                <g key={i}>
                  <line x1={x} y1={y} x2={x + t.irany[0] * 34} y2={y - t.irany[1] * 34} stroke={SZIN.rud} strokeWidth="3.5" />
                  <circle cx={x} cy={y} r="3.5" fill="white" stroke={SZIN.tamasz} strokeWidth="1.5" />
                  <circle cx={x + t.irany[0] * 34} cy={y - t.irany[1] * 34} r="3.5" fill="white" stroke={SZIN.tamasz} strokeWidth="1.5" />
                </g>
              );
            })}

            {/* terhek */}
            <Terhek m={r.modell} kx={r.kx} ky={r.ky} />

            {/* reakciók */}
            {eredmeny.reakciok.map((re, i) => {
              const cs = r.modell.csomopontok.find((c) => c.id === re.csomopont);
              const x = r.kx(cs.x), y = r.ky(cs.y);
              const fx = re.Fx ?? 0, fy = re.Fy ?? 0;
              const n = Math.hypot(fx, fy);
              if (n < 1e-6) return null;
              const h = 40;
              const ex = (fx / n) * h, ey = (fy / n) * h;
              return (
                <g key={`re${i}`}>
                  <line x1={x - ex} y1={y + ey} x2={x} y2={y} stroke={SZIN.reakcio} strokeWidth="2.6" markerEnd="url(#th-reakcio)" />
                  <text x={x - ex * 1.25} y={y + ey * 1.25 + 4} textAnchor="middle" fontSize="11.5" fontWeight="650"
                    style={{ fill: SZIN.reakcio, paintOrder: "stroke", stroke: "white", strokeWidth: 3.5 }}>
                    {sz(n, 2)}
                  </text>
                </g>
              );
            })}

            {/* a levezetés főpontja */}
            {kiemeles && (() => {
              const X = r.kx(kiemeles.P[0]), Y = r.ky(kiemeles.P[1]);
              const nev = String(kiemeles.nev).replace(/_\{(\d+)\}/, "$1");
              return (
                <g>
                  <circle cx={X} cy={Y} r="9" fill="none" stroke="#6d28d9" strokeWidth="2" strokeDasharray="3 2.5" />
                  <circle cx={X} cy={Y} r="3" fill="#6d28d9" />
                  <text x={X + 12} y={Y - 9} fontSize="12" fontWeight="700"
                    style={{ fill: "#6d28d9", paintOrder: "stroke", stroke: "white", strokeWidth: 3.5 }}>
                    {nev} (főpont)
                  </text>
                </g>
              );
            })()}

            {/* metszet jelölése */}
            {metszet && (() => {
              const ig = metszet.ig;
              const c = Math.cos((ig.szogFok * Math.PI) / 180);
              const s = Math.sin((ig.szogFok * Math.PI) / 180);
              const mx = ig.kezdo[0] + metszet.x * c;
              const my = ig.kezdo[1] + metszet.x * s;
              const X = r.kx(mx), Y = r.ky(my);
              const e = abra !== "szerkezet" ? metszet.ertek[abra] * r.dLeptek[abra] : 0;
              const ir = pozitivIrany(ig);
              return (
                <g>
                  <line x1={X - s * 20} y1={Y - c * 20} x2={X + s * 20} y2={Y + c * 20}
                    stroke="#334155" strokeWidth="1.6" strokeDasharray="4 3" />
                  {abra !== "szerkezet" && (
                    <>
                      <line x1={X} y1={Y} x2={X + ir[0] * e} y2={Y + ir[1] * e} stroke={SZINEK[abra]} strokeWidth="1.4" strokeDasharray="3 2" />
                      <circle cx={X + ir[0] * e} cy={Y + ir[1] * e} r="4.5" fill={SZINEK[abra]} stroke="white" strokeWidth="1.5" />
                      <text x={X + ir[0] * e + 8} y={Y + ir[1] * e - 7} fontSize="12" fontWeight="700"
                        style={{ fill: SZINEK[abra], paintOrder: "stroke", stroke: "white", strokeWidth: 3.5 }}>
                        {sz(metszet.ertek[abra], 2)} {EGYSEG[abra]}
                      </text>
                    </>
                  )}
                  <circle cx={X} cy={Y} r="4" fill="#334155" stroke="white" strokeWidth="1.5" />
                </g>
              );
            })()}

            {/* szélsőérték felirat */}
            {abra !== "szerkezet" && ig0.map((ig, i) => {
              const jel = abra;
              const e = ig.szelso[jel];
              const nagy = Math.abs(e.max) >= Math.abs(e.min);
              const v = nagy ? e.max : e.min;
              const xv = nagy ? e.maxX : e.minX;
              if (Math.abs(v) < 1e-6 || r.dLeptek[jel] === 0) return null;
              const c = Math.cos((ig.szogFok * Math.PI) / 180);
              const s = Math.sin((ig.szogFok * Math.PI) / 180);
              const mx = ig.kezdo[0] + xv * c, my = ig.kezdo[1] + xv * s;
              const ir = pozitivIrany(ig);
              const X = r.kx(mx) + ir[0] * v * r.dLeptek[jel];
              const Y = r.ky(my) + ir[1] * v * r.dLeptek[jel];
              // a felirat a görbe külső oldalán (a tengelytől elfelé): a kifelé mutató irány ir·sign(v)
              const kifele = ir[1] * Math.sign(v);
              return (
                <text key={`sz${i}`} x={X + ir[0] * Math.sign(v) * 10} y={Y + (kifele > 0.35 ? 15 : kifele < -0.35 ? -8 : 4)} textAnchor={Math.abs(ir[0]) < 0.35 ? "middle" : ir[0] * Math.sign(v) > 0 ? "start" : "end"} fontSize="12" fontWeight="700"
                  style={{ fill: SZINEK[jel], paintOrder: "stroke", stroke: "white", strokeWidth: 3.5 }}>
                  {sz(v, 2)}
                </text>
              );
            })}
          </svg>

          <p className="mt-1 text-center text-[11.5px] text-petrol-500">
            {abra === "M"
              ? "A nyomatéki ábrát a húzott oldalra rajzoljuk (vízszintes tartónál a pozitív érték alul), ahogy a gyakorlaton is."
              : abra === "szerkezet"
                ? "A lila nyilak a reakciók, a tényleges irányukkal."
                : `A ${abra} ábra pozitív értéke a tartó pozitív oldalára kerül — ugyanoda, ahová a pozitív M (vízszintes tartónál alulra); a „+” jel mutatja.`}
          </p>
        </div>

        {/* ---------- vezérlők és eredmény ---------- */}
        <div className="finom-gorgeto max-h-[640px] overflow-y-auto p-4 sm:p-5">
          <p className="text-[13px] text-petrol-500">{sablon.leiras}</p>

          <div className="mt-3 space-y-2.5">
            {sablon.parameterek.map((par) => (
              <Csuszka
                key={par.id}
                cimke={par.nev}
                ertek={parak[par.id]}
                egyseg={par.egyseg}
                min={par.min}
                max={par.max}
                lepes={par.lepes}
                tizedes={par.lepes < 1 ? 1 : 0}
                onChange={(v) => setParak((p) => ({ ...p, [par.id]: v }))}
              />
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-petrol-200 bg-petrol-50 p-3">
            <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-600 uppercase">Metszet</p>
            <input
              type="range" min={0} max={1} step={0.002} value={metszetU}
              onChange={(e) => setMetszetU(Number(e.target.value))}
              className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-petrol-200 accent-[color:var(--color-naracs-500)]"
              aria-label="A metszet helye"
            />
            {metszet && (
              <div className="szamok mt-2 grid grid-cols-3 gap-2 text-center">
                {["N", "V", "M"].map((jel) => (
                  <div key={jel} className="rounded-lg bg-white px-2 py-1.5 ring-1 ring-petrol-200">
                    <div className="text-[11px] font-semibold" style={{ color: SZINEK[jel] }}>{jel}</div>
                    <div className="text-[13.5px] font-semibold text-petrol-900">{sz(metszet.ertek[jel], 2)}</div>
                    <div className="text-[10.5px] text-petrol-400">{EGYSEG[jel]}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <p className="mt-4 text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">Reakciók</p>
          <div className="mt-1.5 overflow-hidden rounded-xl border border-[color:var(--keret)]">
            <table className="w-full text-[12.5px]">
              <thead className="bg-petrol-50 text-[10.5px] tracking-wider text-petrol-500 uppercase">
                <tr><th className="px-2.5 py-1.5 text-left">Hely</th><th className="px-2.5 py-1.5 text-right">Vízsz.</th><th className="px-2.5 py-1.5 text-right">Függ.</th><th className="px-2.5 py-1.5 text-right">Nyomaték</th></tr>
              </thead>
              <tbody className="szamok">
                {eredmeny.reakciok.map((re, i) => (
                  <tr key={i} className="border-t border-petrol-100">
                    <td className="px-2.5 py-1.5 text-petrol-800">
                      {re.csomopont}
                      <span className="ml-1 text-[10.5px] text-petrol-400">
                        {{ csuklo: "csukló", gorgo: "görgő", befogas: "befogás", rud: "rúd" }[re.tipus]}
                      </span>
                    </td>
                    <td className="px-2.5 py-1.5 text-right text-petrol-900">{re.Fx === undefined ? "–" : sz(re.Fx, 2)}</td>
                    <td className="px-2.5 py-1.5 text-right text-petrol-900">{re.Fy === undefined ? "–" : sz(re.Fy, 2)}</td>
                    <td className="px-2.5 py-1.5 text-right text-petrol-900">{re.M === undefined ? "–" : sz(re.M, 2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">Szélsőértékek</p>
          <div className="mt-1.5 space-y-1.5">
            {ig0.map((ig, i) => (
              <div key={i} className="rounded-lg bg-petrol-50 px-3 py-2 text-[12.5px]">
                <span className="font-semibold text-petrol-800">{ig0.length > 1 ? `${ig.rud}. rúd` : "A tartó"}</span>
                <span className="szamok ml-2 text-petrol-600">
                  M: {sz(ig.szelso.M.min, 2)} … {sz(ig.szelso.M.max, 2)} kNm · V: {sz(ig.szelso.V.min, 2)} … {sz(ig.szelso.V.max, 2)} kN
                  {Math.abs(ig.szelso.N.min) + Math.abs(ig.szelso.N.max) > 1e-6 && <> · N: {sz(ig.szelso.N.min, 2)} … {sz(ig.szelso.N.max, 2)} kN</>}
                </span>
              </div>
            ))}
          </div>

          {eredmeny.merevsegfuggo && (
            <p className="mt-3 rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-[12.5px] text-petrol-700">
              Ez a szerkezet statikailag határozatlan: az igénybevételek már a merevségtől (EI) is függenek — ez már a következő félév anyaga.
            </p>
          )}

          <p className="mt-3 text-[11.5px] text-petrol-500">
            Ellenőrzés: <Keplet>{"\\sum F_x"}</Keplet> = {sz(eredmeny.ellenorzes.SzFx, 6)},{" "}
            <Keplet>{"\\sum F_y"}</Keplet> = {sz(eredmeny.ellenorzes.SzFy, 6)},{" "}
            <Keplet>{"\\sum M"}</Keplet> = {sz(eredmeny.ellenorzes.SzM, 6)} — a terhek és a reakciók egyensúlyi erőrendszert alkotnak.
          </p>
        </div>
      </div>

      <TartoLevezetes modell={bemenet} eredmeny={eredmeny} onKiemel={setKiemeles} />
    </div>
  );
}
