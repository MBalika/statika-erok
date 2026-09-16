"use client";

import { useMemo, useRef, useState } from "react";
import { M, MB } from "@/components/ui/Keplet";
import { sz } from "@/lib/szamok";
import { racsosMegold, atmetszes, atvagottRudak, PELDAK, sablon, rudTex } from "@/lib/racsos";
import RacsosRajz, { leptek, RACS_SZIN } from "./RacsosRajz";

/*
 * Átmetsző vonal húzása: a hallgató a pointerrel egy vonalat húz a tartón; a program
 * kiszínezi az átvágott rudakat, megmondja hányat vág (≤ 3 → hármas átmetszés), és ha a
 * vonal két részre vágja a tartót, kiírja a bal (vagy jobb) oldali rész három egyenletét
 * a főpontokkal.
 */

const SZ = 600;
const MA = 360;

const TARTOK = [
  { id: "tk66", cim: "Tankönyv 6.6", modell: () => PELDAK.tk66(2, 1.5, 12) },
  { id: "h07", cim: "H07", modell: () => PELDAK.h07(2, 1.5, 10, 6) },
  { id: "vizsga", cim: "Vizsgaminta", modell: () => PELDAK.vizsga(8) },
  { id: "warren", cim: "Warren", modell: () => ({ ...sablon("warren", { n: 4, a: 1.5, h: 2 }), terhek: [{ csomopont: "5", Fx: 0, Fy: -10 }, { csomopont: "3", Fx: 0, Fy: -6 }] }) },
  { id: "k", cim: "K-rács", modell: () => ({ ...sablon("k", { n: 4, a: 2, h: 1.5 }), terhek: [{ csomopont: "3", Fx: 0, Fy: -10 }] }) },
];

export default function AtmetszoVonal({ kezdo = 0 }) {
  const [tIdx, setTIdx] = useState(kezdo);
  const [vonal, setVonal] = useState(null); // { p1, p2 } modell-koordinátákban
  const [huz, setHuz] = useState(false);
  const [oldal, setOldal] = useState("bal");
  const svgRef = useRef(null);

  const { modell, e, lp } = useMemo(() => {
    const m = TARTOK[tIdx].modell();
    return { modell: m, e: racsosMegold(m), lp: leptek(m, SZ, MA, { bal: 56, jobb: 56, fel: 74, le: 70 }) };
  }, [tIdx]);

  const modellPont = (ev) => {
    const svg = svgRef.current;
    const r = svg.getBoundingClientRect();
    const px = ((ev.clientX - r.left) / r.width) * SZ;
    const py = ((ev.clientY - r.top) / r.height) * MA;
    return { x: (px - lp.kx(0)) / lp.L, y: (lp.ky(0) - py) / lp.L };
  };

  const kezd = (ev) => {
    ev.preventDefault();
    const p = modellPont(ev);
    setVonal({ p1: p, p2: p });
    setHuz(true);
    ev.currentTarget.setPointerCapture?.(ev.pointerId);
  };
  const mozog = (ev) => {
    if (!huz) return;
    const p = modellPont(ev);
    setVonal((v) => (v ? { ...v, p2: p } : v));
  };
  const vege = () => setHuz(false);

  const vagott = useMemo(() => (vonal && e.ok ? atvagottRudak(e, vonal.p1, vonal.p2) : []), [vonal, e]);
  const at = useMemo(() => (vagott.length >= 2 && vagott.length <= 4 && !huz ? atmetszes(modell, vagott, oldal, { eredmeny: e }) : null), [vagott, oldal, modell, e, huz]);

  const db = vagott.length;
  let statusz;
  if (!vonal) statusz = { szin: "petrol", cim: "Húzz egy vonalat a tartón", szoveg: "Nyomd le a mutatót (vagy az ujjad) a tartó egyik oldalán, és húzd át a rudakon. A tankönyv görbe vonallal rajzolja, hogy ne keveredjen a rudakkal — itt egyenes is jó." };
  else if (huz) statusz = { szin: "petrol", cim: `${db} rudat vág`, szoveg: "Engedd el, ha kész." };
  else if (db === 0) statusz = { szin: "petrol", cim: "Nem vág át rudat", szoveg: "Húzd a vonalat a tartón keresztül." };
  else if (at && !at.ok) statusz = { szin: "rose", cim: `${db} rudat vág, de…`, szoveg: at.hibak[0] };
  else if (db > 3 && at?.ok) statusz = { szin: at.megoldhato ? "naracs" : "rose", cim: `Négyes átmetszés (${db} rúd)`, szoveg: at.megoldhato ? "Négy ismeretlen, három egyenlet — de a hatásvonalak elrendezése miatt mégis mindegyik egyismeretlenes egyenletből jön (K-rács trükk)." : "Négy ismeretlen, csak három egyensúlyi egyenlet: legalább egy rúd nem számolható ebből az átmetszésből (lásd K-rácsozás: kombinálni kell egy másik átmetszéssel)." };
  else if (db > 4) statusz = { szin: "rose", cim: `${db} rudat vág — túl sok`, szoveg: "Három (K-rácsnál négy) rudat szabad átvágni: három egyensúlyi egyenletünk van a tartórészre." };
  else if (at?.ok) statusz = { szin: "emerald", cim: db === 3 ? "Hármas átmetszés ✓" : `${db} rúd — megoldható`, szoveg: `A tartó két részre esik. A ${oldal} oldali részre írt egyensúlyi egyenletekből az átvágott rudak ereje egyenként számolható: minden rúdhoz a másik kettő metszéspontja (főpont) a nyomatéki pont — ha párhuzamosak, a rájuk merőleges vetületi egyenlet.` };
  else statusz = { szin: "petrol", cim: `${db} rudat vág`, szoveg: "" };
  const statuszOsztaly = { emerald: "border-emerald-300 bg-emerald-50 text-emerald-900", naracs: "border-naracs-300 bg-naracs-50 text-naracs-900", rose: "border-rose-300 bg-rose-50 text-rose-900", petrol: "border-petrol-200 bg-petrol-50 text-petrol-800" }[statusz.szin];

  const reszHalmaz = new Set(at?.ok ? at.resz : []);

  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white">
      <div className="flex flex-wrap items-center gap-2 border-b border-[color:var(--keret)] bg-petrol-50/70 px-3 py-2">
        <div className="flex flex-wrap gap-1 rounded-lg bg-white p-0.5 ring-1 ring-petrol-200">
          {TARTOK.map((t, i) => (
            <button key={t.id} type="button" onClick={() => { setTIdx(i); setVonal(null); }} className={`rounded-md px-2.5 py-1 text-[12px] font-medium transition ${tIdx === i ? "bg-petrol-700 text-white" : "text-petrol-600 hover:bg-petrol-50"}`}>
              {t.cim}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-1 text-[12px] text-petrol-600">
          vizsgált rész:
          {["bal", "jobb"].map((o) => (
            <button key={o} type="button" onClick={() => setOldal(o)} className={`rounded-md px-2 py-0.5 font-medium ring-1 ${oldal === o ? "bg-petrol-700 text-white ring-petrol-700" : "bg-white text-petrol-700 ring-petrol-200"}`}>
              {o}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.3fr_1fr] [&>*]:min-w-0">
        <div className="racs-vilagos border-b border-[color:var(--keret)] p-3 lg:border-r lg:border-b-0">
          <RacsosRajz
            svgRef={svgRef}
            modell={modell}
            eredmeny={e}
            szinez={false}
            kiemeltRudak={vagott}
            reakciok
            szelesseg={SZ}
            magassag={MA}
            onPointerDown={kezd}
            onPointerMove={mozog}
            onPointerUp={vege}
            style={{ cursor: "crosshair", touchAction: "none" }}
            className="abra w-full h-auto touch-none select-none"
            cimke="HÚZZ EGY VONALAT A RUDAKON KERESZTÜL"
            extra={(kx, ky) => (
              <g>
                {/* a vizsgált rész halványan kiemelve */}
                {at?.ok &&
                  modell.csomopontok
                    .filter((c) => reszHalmaz.has(c.id))
                    .map((c) => <circle key={c.id} cx={kx(c.x)} cy={ky(c.y)} r="11" fill="#15803d" opacity="0.14" />)}
                {vonal && <line x1={kx(vonal.p1.x)} y1={ky(vonal.p1.y)} x2={kx(vonal.p2.x)} y2={ky(vonal.p2.y)} stroke="#0f172a" strokeWidth="2" strokeDasharray="7 5" strokeLinecap="round" />}
                {vonal && <circle cx={kx(vonal.p1.x)} cy={ky(vonal.p1.y)} r="4" fill="#0f172a" />}
                {/* főpontok */}
                {at?.ok &&
                  at.egyenletek
                    .filter((q) => q.fopont)
                    .map((q, i) => {
                      const px = kx(q.fopont.x);
                      const py = ky(q.fopont.y);
                      const bent = px > 8 && px < SZ - 8 && py > 8 && py < MA - 8;
                      if (!bent) return null;
                      return (
                        <g key={i}>
                          <circle cx={px} cy={py} r="7" fill="none" stroke="#7c3aed" strokeWidth="2" />
                          <text x={px + 10} y={py - 8} fontSize="11.5" fontWeight="700" style={{ fill: "#6d28d9", paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
                            {q.fopont.nev.replace(/[{}]/g, "").replace("P_", "P")} → S{q.rud}
                          </text>
                        </g>
                      );
                    })}
              </g>
            )}
          />
          {vonal && (
            <div className="mt-2 flex flex-wrap items-center gap-2 text-[12px] text-petrol-500">
              <button type="button" onClick={() => setVonal(null)} className="rounded-lg bg-white px-2.5 py-1 font-semibold text-petrol-700 ring-1 ring-petrol-200 hover:bg-petrol-50">
                ✕ Törlés
              </button>
              <span>átvágott rudak: {vagott.length ? vagott.map((id) => `S${id}`).join(", ") : "—"}</span>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-5">
          <div className={`rounded-xl border p-3 ${statuszOsztaly}`}>
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-white text-lg font-bold ring-1 ring-black/5">{vonal ? db : "?"}</span>
              <span className="text-[13.5px] font-semibold">{statusz.cim}</span>
            </div>
            {statusz.szoveg && <p className="mt-1.5 text-[12.5px] leading-relaxed">{statusz.szoveg}</p>}
          </div>
          {at?.ok && (
            <div className="mt-3">
              <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">
                A {oldal} oldali rész ({at.resz.join(", ")}) egyensúlya
              </p>
              <p className="mt-1 text-[12.5px] text-petrol-600">
                Külső erők a részen: {at.kulsoErok.length ? at.kulsoErok.map((f) => f.nev.replace(/[_{}]/g, "") + (f.teher ? ` (${f.csomopont}. cs.)` : "")).join(", ") : "nincs"}; az átvágott rudak ereje húzottnak felvéve, a részből kifelé.
              </p>
              <MB>{`(${at.kulsoErok.map((f) => `\\underline{${f.nev}}`).join(", ")}${at.kulsoErok.length ? ", " : ""}${at.rudak.filter((r) => !r.ismert).map((r) => `\\underline{${rudTex(r.id)}}`).join(", ")}) \\ekv \\underline{O}`}</MB>
              <div className="szamok mt-2 space-y-1 text-[13px] text-petrol-800">
                {at.egyenletek.map((q, i) => (
                  <div key={i}>
                    {q.fopont && <p className="text-[11.5px] text-violet-700">főpont {q.fopont.nev.replace(/[{}]/g, "").replace("P_", "P")}{q.fopont.csomopont ? "" : ` (${sz(q.fopont.x, 2)}; ${sz(q.fopont.y, 2)}) m`}: a másik {at.egyenletek.length - 1 === 1 ? "rúd" : "rudak"} hatásvonala átmegy rajta → csak {`S${q.rud}`} marad</p>}
                    {q.parhuzamosak && <p className="text-[11.5px] text-violet-700">a többi átvágott rúd párhuzamos → a rájuk merőleges vetületi egyenlet</p>}
                    {q.nincsEgyismeretlenes ? (
                      <p className="text-[12.5px] text-rose-700">
                        <M>{rudTex(q.rud)}</M>: ebből az átmetszésből nincs egyismeretlenes egyenlet (a másik három hatásvonal nem megy át egy ponton és nem is párhuzamos). Értéke a teljes megoldásból: <M>{`${rudTex(q.rud)} = ${sz(q.S, 2)}\\ \\text{kN}`}</M>.
                      </p>
                    ) : (
                      <MB>{q.tex}</MB>
                    )}
                  </div>
                ))}
                {at.ellenorzes && (
                  <div>
                    <p className="text-[11.5px] text-emerald-700">ellenőrzés egy nem használt vetületi egyenlettel:</p>
                    <MB>{at.ellenorzes.tex}</MB>
                  </div>
                )}
              </div>
            </div>
          )}
          {!vonal && (
            <p className="mt-3 text-[12px] leading-relaxed text-petrol-500">
              <span className="font-semibold text-petrol-700">Tipp:</span> a vágás akkor jó, ha a tartó két részre esik szét, és legfeljebb három rudat vág. Próbáld ki az oszlopot is átvágni (négy rúd) — és nézd meg, mikor marad számolható.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
