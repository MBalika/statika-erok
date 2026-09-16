"use client";

import { useMemo, useState } from "react";
import { Csuszka } from "@/components/abrak/ErovektorBonto";
import { M } from "@/components/ui/Keplet";
import { sz } from "@/lib/szamok";
import { racsosMegold, sablon } from "@/lib/racsos";
import RacsosRajz, { RACS_SZIN } from "./RacsosRajz";

/*
 * Erőáramlás: csúszkával vándorló teher egy paraméteres rácsos tartón. A teher a két
 * szomszédos csomópontra oszlik (rúdján terhelt rúd → csomóponti helyettesítés), a rudak
 * színe és vastagsága élőben követi a rúderőt (CSS transition), a vakrudak kiszürkülnek.
 */

const TIPUSOK = [
  { id: "parhuzamosV", cim: "párhuzamos övű (V)", tipus: "parhuzamos", racs: "V" },
  { id: "parhuzamosN", cim: "Pratt (N)", tipus: "parhuzamos", racs: "N" },
  { id: "warren", cim: "Warren", tipus: "warren" },
  { id: "haromszog", cim: "nyeregtető", tipus: "haromszog" },
  { id: "k", cim: "K-rács", tipus: "k" },
];

export default function EroAramlas() {
  const [tipIdx, setTipIdx] = useState(0);
  const [n, setN] = useState(6);
  const [h, setH] = useState(1.5);
  const [x, setX] = useState(4);
  const [F, setF] = useState(10);
  const [alfa, setAlfa] = useState(90); // a teher iránya a vízszintestől mérve lefelé (90 = függőleges)
  const [ov, setOv] = useState("felso");
  const [feliratok, setFeliratok] = useState(false);

  const tip = TIPUSOK[tipIdx];
  const a = 2;
  const L = n * a;

  const { modell, e, terhelt } = useMemo(() => {
    const m = sablon(tip.tipus, { n, a, h, racs: tip.racs });
    const ovIds = ov === "felso" ? m.felso : m.also;
    const ovCs = ovIds.map((id) => m.csomopontok.find((c) => c.id === id)).sort((p, q) => p.x - q.x);
    // a teher helye: a két szomszédos övcsomópont közé oszlik (emelőszabály)
    const xx = Math.max(ovCs[0].x, Math.min(ovCs[ovCs.length - 1].x, x));
    let bal = ovCs[0];
    let jobb = ovCs[ovCs.length - 1];
    for (let i = 0; i + 1 < ovCs.length; i++) {
      if (xx >= ovCs[i].x - 1e-9 && xx <= ovCs[i + 1].x + 1e-9) {
        bal = ovCs[i];
        jobb = ovCs[i + 1];
        break;
      }
    }
    const Fx = F * Math.cos((alfa * Math.PI) / 180);
    const Fy = -F * Math.sin((alfa * Math.PI) / 180);
    const t = jobb.x > bal.x ? (xx - bal.x) / (jobb.x - bal.x) : 0;
    const terhek = [];
    if (1 - t > 1e-6) terhek.push({ csomopont: bal.id, Fx: Fx * (1 - t), Fy: Fy * (1 - t), cimke: `${sz(F * (1 - t), 1)} kN` });
    if (t > 1e-6) terhek.push({ csomopont: jobb.id, Fx: Fx * t, Fy: Fy * t, cimke: `${sz(F * t, 1)} kN` });
    m.terhek = terhek;
    const yT = bal.y + (jobb.y - bal.y) * t;
    return { modell: m, e: racsosMegold(m), terhelt: { x: xx, y: yT, Fx, Fy, bal, jobb, t } };
  }, [tip, n, h, x, F, alfa, ov]);

  const legnagyobb = e.ok ? [...e.rudTabla].sort((p, q) => Math.abs(q.S) - Math.abs(p.S)).slice(0, 3) : [];
  const vakDb = e.ok ? e.rudTabla.filter((r) => Math.abs(r.S) < 1e-6).length : 0;
  const huzDb = e.ok ? e.rudTabla.filter((r) => r.S > 1e-6).length : 0;
  const nyomDb = e.ok ? e.rudTabla.filter((r) => r.S < -1e-6).length : 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white">
      <div className="flex flex-wrap items-center gap-2 border-b border-[color:var(--keret)] bg-petrol-50/70 px-3 py-2">
        <div className="flex flex-wrap gap-1 rounded-lg bg-white p-0.5 ring-1 ring-petrol-200">
          {TIPUSOK.map((t, i) => (
            <button key={t.id} type="button" onClick={() => setTipIdx(i)} className={`rounded-md px-2.5 py-1 text-[12px] font-medium transition ${tipIdx === i ? "bg-petrol-700 text-white" : "text-petrol-600 hover:bg-petrol-50"}`}>
              {t.cim}
            </button>
          ))}
        </div>
        <label className="ml-auto flex cursor-pointer items-center gap-2 text-[12px] font-medium text-petrol-600">
          <input type="checkbox" checked={feliratok} onChange={(ev) => setFeliratok(ev.target.checked)} className="accent-[color:var(--color-naracs-500)]" />
          S értékek
        </label>
      </div>
      <div className="grid lg:grid-cols-[1.4fr_1fr] [&>*]:min-w-0">
        <div className="racs-vilagos border-b border-[color:var(--keret)] p-3 lg:border-r lg:border-b-0">
          <RacsosRajz
            modell={modell}
            eredmeny={e.ok ? e : null}
            reakciok
            rudFeliratok={feliratok}
            csomopontCimkek={false}
            terhek={false}
            cimke="A RUDAK SZÍNE ÉS VASTAGSÁGA A RÚDERŐT KÖVETI"
            extra={(kx, ky) => {
              const px = kx(terhelt.x);
              const py = ky(terhelt.y);
              const hossz = 30 + 2.2 * F;
              const r = (alfa * Math.PI) / 180;
              const x1 = px - hossz * Math.cos(r);
              const y1 = py - hossz * Math.sin(r);
              return (
                <g>
                  <line x1={x1} y1={y1} x2={px - 3 * Math.cos(r)} y2={py - 3 * Math.sin(r)} stroke="var(--color-jel-ero)" strokeWidth="3.2" strokeLinecap="round" markerEnd="url(#th-teher)" />
                  <text x={x1 + 8} y={y1 - 6} fontSize="12.5" fontWeight="650" style={{ fill: "var(--color-jel-ero)", paintOrder: "stroke", stroke: "white", strokeWidth: 3.5 }}>
                    F = {sz(F, 0)} kN
                  </text>
                  {terhelt.t > 1e-6 && terhelt.t < 1 - 1e-6 && (
                    <g opacity="0.8">
                      <circle cx={kx(terhelt.bal.x)} cy={ky(terhelt.bal.y)} r="6" fill="none" stroke="var(--color-jel-ero)" strokeWidth="1.6" strokeDasharray="3 2" />
                      <circle cx={kx(terhelt.jobb.x)} cy={ky(terhelt.jobb.y)} r="6" fill="none" stroke="var(--color-jel-ero)" strokeWidth="1.6" strokeDasharray="3 2" />
                    </g>
                  )}
                </g>
              );
            }}
          />
          <div className="mt-1 flex flex-wrap gap-3 text-[11.5px] text-petrol-500">
            <span className="flex items-center gap-1"><span className="inline-block h-1.5 w-5 rounded" style={{ background: RACS_SZIN.huzott }} /> húzott ({huzDb})</span>
            <span className="flex items-center gap-1"><span className="inline-block h-1.5 w-5 rounded" style={{ background: RACS_SZIN.nyomott }} /> nyomott ({nyomDb})</span>
            <span className="flex items-center gap-1"><span className="inline-block h-1.5 w-5 rounded" style={{ background: RACS_SZIN.vak }} /> vakrúd ({vakDb})</span>
          </div>
        </div>
        <div className="space-y-3 p-4 sm:p-5">
          <Csuszka cimke="a teher helye x" ertek={x} egyseg="m" min={0} max={L} lepes={0.1} tizedes={1} onChange={setX} />
          <div className="flex items-center gap-1 text-[12px] text-petrol-600">
            a teher az
            {["felso", "also"].map((o) => (
              <button key={o} type="button" onClick={() => setOv(o)} className={`rounded-md px-2 py-0.5 font-medium ring-1 ${ov === o ? "bg-petrol-700 text-white ring-petrol-700" : "bg-white text-petrol-700 ring-petrol-200"}`}>
                {o === "felso" ? "felső" : "alsó"}
              </button>
            ))}
            övön
          </div>
          <Csuszka cimke="F" ertek={F} egyseg="kN" min={2} max={30} lepes={1} tizedes={0} onChange={setF} />
          <Csuszka cimke="a teher iránya (90° = függőleges)" ertek={alfa} egyseg="°" min={30} max={150} lepes={5} tizedes={0} onChange={setAlfa} />
          <Csuszka cimke="mezők száma n" ertek={n} egyseg="" min={3} max={8} lepes={1} tizedes={0} onChange={(v) => { setN(v); setX((xx) => Math.min(xx, v * a)); }} />
          <Csuszka cimke="magasság h" ertek={h} egyseg="m" min={0.8} max={3} lepes={0.1} tizedes={1} onChange={setH} />
          {e.ok ? (
            <div className="szamok rounded-xl bg-petrol-50 p-3 text-[12.5px] text-petrol-800">
              <p>
                {terhelt.t > 1e-6 && terhelt.t < 1 - 1e-6 ? (
                  <>
                    A teher két csomópont közé esik → helyettesítés: <M>{`${sz(F * (1 - terhelt.t), 2)}`}</M> kN a(z) {terhelt.bal.id}. és <M>{`${sz(F * terhelt.t, 2)}`}</M> kN a(z) {terhelt.jobb.id}. csomópontra.
                  </>
                ) : (
                  <>A teher pontosan csomópontra esik.</>
                )}
              </p>
              <p className="mt-1">
                reakciók: {e.reakciok.map((r) => (r.tipus === "csuklo" ? `${r.jel} = (${sz(r.Fx, 2)}; ${sz(r.Fy, 2)})` : `${r.jel} = ${sz(r.nagysag, 2)}`)).join(", ")} kN
              </p>
              <p className="mt-1">
                legnagyobb rúderők:{" "}
                {legnagyobb.map((r) => (
                  <span key={r.id} className={`mr-2 font-semibold ${r.S > 0 ? "text-rose-700" : "text-sky-700"}`}>
                    S{r.id} = {sz(r.S, 2)}
                  </span>
                ))}
                kN
              </p>
            </div>
          ) : (
            <p className="text-[12.5px] text-rose-700">{e.hibak.join(" ")}</p>
          )}
          <p className="text-[12px] leading-relaxed text-petrol-500">
            <span className="font-semibold text-petrol-700">Nézd meg:</span> az övek a nyomatéki ábrát követik (a felső öv nyomott, az alsó húzott, a legnagyobb a teher alatt), a rácsrudak a nyíróerőt (a tehertől távolodva az irányuk váltakozik, a tehernél előjelet váltanak). A teher fölötti oszlop mindig „dolgozik”, a többi vakrúd is lehet.
          </p>
        </div>
      </div>
    </div>
  );
}
