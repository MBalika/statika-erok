"use client";

import { useMemo, useState } from "react";
import { Csuszka } from "@/components/abrak/ErovektorBonto";
import { M, MB } from "@/components/ui/Keplet";
import { sz } from "@/lib/szamok";
import { racsosMegold, sablon, keresAtmetszes, rudTex } from "@/lib/racsos";
import RacsosRajz, { RudErokTabla } from "./RacsosRajz";

/*
 * Rácsos tartó kalkulátor: paraméteres tartó (típus, mezőszám, mezőszélesség, magasság),
 * legfeljebb három csomóponti teher; kiírja a reakciók levezetését, a rúderőtáblázatot,
 * a csomóponti módszer lépéseit és egy választott rúdra az átmetszés levezetését.
 */

const TIPUSOK = [
  { id: "parhuzamosV", cim: "párhuzamos övű (V rács)", tipus: "parhuzamos", racs: "V" },
  { id: "parhuzamosN", cim: "Pratt (N rács)", tipus: "parhuzamos", racs: "N" },
  { id: "parhuzamosZ", cim: "párhuzamos övű (Z rács)", tipus: "parhuzamos", racs: "Z" },
  { id: "warren", cim: "Warren (háromszög)", tipus: "warren" },
  { id: "haromszog", cim: "nyeregtető", tipus: "haromszog" },
  { id: "k", cim: "K-rácsozás", tipus: "k" },
  { id: "trapez", cim: "trapéz (vizsga-típus)", tipus: "trapez" },
];

const Mezo = ({ cimke, children }) => (
  <label className="block text-[12px] font-medium text-petrol-600">
    <span className="mb-0.5 block">{cimke}</span>
    {children}
  </label>
);

export default function RacsosKalk() {
  const [tipId, setTipId] = useState("parhuzamosV");
  const [n, setN] = useState(4);
  const [a, setA] = useState(2);
  const [h, setH] = useState(1.5);
  const [h1, setH1] = useState(2.5);
  const [terhek, setTerhek] = useState([{ cs: "3", F: 10, szog: -90 }, { cs: "4", F: 6, szog: -90 }]);
  const [ful, setFul] = useState("reakciok");
  const [valasztottRud, setValasztottRud] = useState("");
  const [sorrend, setSorrend] = useState("sorban");
  const [ismertOvek, setIsmertOvek] = useState(false);

  const tip = TIPUSOK.find((t) => t.id === tipId);
  const alap = useMemo(() => sablon(tip.tipus, { n, a, h, h0: h, h1, racs: tip.racs }), [tip, n, a, h, h1]);
  const csomopontIds = alap.csomopontok.map((c) => c.id);

  const modell = useMemo(() => {
    const t = terhek
      .filter((x) => csomopontIds.includes(x.cs) && Math.abs(x.F) > 1e-9)
      .map((x) => ({ csomopont: x.cs, Fx: x.F * Math.cos((x.szog * Math.PI) / 180), Fy: x.F * Math.sin((x.szog * Math.PI) / 180) }));
    return { ...alap, terhek: t };
  }, [alap, terhek, csomopontIds]);

  const e = useMemo(() => racsosMegold(modell, { sorrend }), [modell, sorrend]);
  const rudId = valasztottRud && modell.rudak.some((r) => r.id === valasztottRud) ? valasztottRud : modell.rudak[0]?.id;
  const at = useMemo(() => (e.ok && rudId ? keresAtmetszes(modell, rudId, { eredmeny: e, ismert: ismertOvek ? "ovek" : [] }) : null), [modell, e, rudId, ismertOvek]);

  const setTeher = (i, kulcs, ertek) => setTerhek((t) => t.map((x, j) => (j === i ? { ...x, [kulcs]: ertek } : x)));

  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white">
      <div className="grid gap-4 border-b border-[color:var(--keret)] bg-petrol-50/70 p-3 sm:grid-cols-2 lg:grid-cols-[1.1fr_1fr_1.4fr]">
        <div className="space-y-2">
          <Mezo cimke="tartótípus">
            <select value={tipId} onChange={(ev) => setTipId(ev.target.value)} className="w-full rounded-md border border-petrol-200 bg-white px-2 py-1 text-[13px]">
              {TIPUSOK.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.cim}
                </option>
              ))}
            </select>
          </Mezo>
          <Csuszka cimke="mezők száma n" ertek={n} egyseg="" min={2} max={8} lepes={1} tizedes={0} onChange={setN} />
        </div>
        <div className="space-y-2">
          <Csuszka cimke="mezőszélesség a" ertek={a} egyseg="m" min={1} max={5} lepes={0.5} tizedes={1} onChange={setA} />
          <Csuszka cimke={tip.tipus === "trapez" ? "magasság balra h₀" : "magasság h"} ertek={h} egyseg="m" min={0.5} max={5} lepes={0.5} tizedes={1} onChange={setH} />
          {tip.tipus === "trapez" && <Csuszka cimke="magasság jobbra h₁" ertek={h1} egyseg="m" min={0.5} max={6} lepes={0.5} tizedes={1} onChange={setH1} />}
        </div>
        <div>
          <p className="mb-1 text-[12px] font-medium text-petrol-600">csomóponti terhek (F nagyság, irány: −90° = lefelé, 0° = jobbra)</p>
          <div className="space-y-1.5">
            {terhek.map((t, i) => (
              <div key={i} className="szamok flex flex-wrap items-center gap-1.5 text-[12.5px]">
                <span className="text-petrol-500">F{"₁₂₃"[i]}:</span>
                <select value={t.cs} onChange={(ev) => setTeher(i, "cs", ev.target.value)} className="rounded-md border border-petrol-200 bg-white px-1.5 py-0.5">
                  {csomopontIds.map((id) => (
                    <option key={id} value={id}>
                      {id}. cs.
                    </option>
                  ))}
                </select>
                <input type="number" value={t.F} step={1} onChange={(ev) => setTeher(i, "F", Number(ev.target.value))} className="w-16 rounded-md border border-petrol-200 bg-white px-1.5 py-0.5" />
                <span className="text-petrol-500">kN,</span>
                <input type="number" value={t.szog} step={15} onChange={(ev) => setTeher(i, "szog", Number(ev.target.value))} className="w-16 rounded-md border border-petrol-200 bg-white px-1.5 py-0.5" />
                <span className="text-petrol-500">°</span>
                <button type="button" onClick={() => setTerhek((tt) => tt.filter((_, j) => j !== i))} className="rounded-md px-1.5 text-petrol-400 hover:bg-white hover:text-rose-600" aria-label="törlés">
                  ✕
                </button>
              </div>
            ))}
            {terhek.length < 3 && (
              <button type="button" onClick={() => setTerhek((tt) => [...tt, { cs: csomopontIds[Math.min(2, csomopontIds.length - 1)], F: 8, szog: -90 }])} className="rounded-md bg-white px-2 py-0.5 text-[12px] font-medium text-petrol-700 ring-1 ring-petrol-200 hover:bg-petrol-50">
                + teher
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.25fr_1fr] [&>*]:min-w-0">
        <div className="racs-vilagos border-b border-[color:var(--keret)] p-3 lg:border-r lg:border-b-0">
          <RacsosRajz modell={modell} eredmeny={e.ok ? e : null} reakciok={e.ok} rudFeliratok={e.ok} meretek kiemeltRudak={ful === "atmetszes" && at ? at.rudak : []} onRud={(id) => { setValasztottRud(id); setFul("atmetszes"); }} magassag={380} cimke={e.ok ? `r = ${e.hatarozottsag.r}, k = ${e.hatarozottsag.k}, c = ${e.hatarozottsag.c}: r + k = ${e.hatarozottsag.i} = 2c = ${e.hatarozottsag.e} ✓ HATÁROZOTT` : "NEM MEGOLDHATÓ"} extra={(kx, ky) => (ful === "atmetszes" && at ? <line x1={kx(at.vonal[0].x)} y1={ky(at.vonal[0].y)} x2={kx(at.vonal[1].x)} y2={ky(at.vonal[1].y)} stroke="#0f172a" strokeWidth="1.8" strokeDasharray="7 5" /> : null)} />
          <p className="mt-1 text-[11.5px] text-petrol-500">Kattints egy rúdra: az átmetszés fülön arra a rúdra kapsz levezetést. A rudak mellett a rúderő (kN), rose = húzott, sky = nyomott, szürke = vakrúd.</p>
        </div>
        <div className="p-4 sm:p-5">
          {!e.ok ? (
            <p className="text-[13px] text-rose-700">{e.hibak.join(" ")}</p>
          ) : (
            <>
              <div className="mb-3 flex flex-wrap gap-1 rounded-lg bg-petrol-50 p-0.5">
                {[
                  ["reakciok", "Reakciók + táblázat"],
                  ["csomoponti", "Csomóponti módszer"],
                  ["atmetszes", "Átmetszés egy rúdra"],
                ].map(([id, cim]) => (
                  <button key={id} type="button" onClick={() => setFul(id)} className={`rounded-md px-2.5 py-1 text-[12px] font-medium transition ${ful === id ? "bg-petrol-700 text-white" : "text-petrol-600 hover:bg-white"}`}>
                    {cim}
                  </button>
                ))}
              </div>

              {ful === "reakciok" && (
                <div>
                  <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">A rácsozat mint merev test</p>
                  <MB>{`(${modell.terhek.map((_, i) => `\\underline{F}_{${i + 1}}`).join(", ")}${modell.terhek.length ? ", " : ""}${e.reakciok.map((r) => `\\underline{${r.jel}}`).join(", ")}) \\ekv \\underline{O}`}</MB>
                  <div className="szamok space-y-1 text-[13px] text-petrol-800">
                    {e.reakcioLepesek.map((l, i) => (
                      <div key={i}>
                        {l.magyarazat && <p className="text-[11.5px] text-petrol-500">{l.magyarazat}</p>}
                        <MB>{l.tex}</MB>
                      </div>
                    ))}
                  </div>
                  {e.vakrudak.length > 0 && (
                    <div className="mt-3 rounded-xl border border-petrol-200 bg-petrol-50 p-3 text-[12.5px] text-petrol-700">
                      <p className="font-semibold text-petrol-800">Vakrudak ránézésre: {e.vakrudak.map((id) => `S${id}`).join(", ")}</p>
                      <ul className="mt-1 list-disc space-y-0.5 pl-5">
                        {e.vakrudIndokok.map((v, i) => (
                          <li key={i}>{v.szoveg}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="mt-3">
                    <RudErokTabla eredmeny={e} cim="Rúderőtáblázat" kicsi />
                  </div>
                </div>
              )}

              {ful === "csomoponti" && (
                <div>
                  <div className="mb-2 flex items-center gap-2 text-[12px] text-petrol-600">
                    sorrend:
                    <select value={sorrend} onChange={(ev) => setSorrend(ev.target.value)} className="rounded-md border border-petrol-200 bg-white px-1.5 py-0.5 text-[12px]">
                      <option value="sorban">a csomópontok sorszáma szerint</option>
                      <option value="kevesebb">mindig a legkevesebb ismeretlen</option>
                    </select>
                  </div>
                  <div className="max-h-[520px] space-y-3 overflow-y-auto pr-1">
                    {e.csomopontiSorrend.map((l, i) => (
                      <div key={i} className="rounded-xl border border-petrol-100 p-2.5">
                        <p className="text-[11px] font-bold tracking-wider text-petrol-500 uppercase">
                          {i + 1}. — {l.csomopont}. csomópont · ismeretlen: {l.ismeretlenek.map((id) => `S${id}`).join(", ")}
                        </p>
                        <div className="szamok mt-1 space-y-0.5 text-[12.5px] text-petrol-800">
                          {l.egyenletek.map((q, j) => (
                            <MB key={j}>{q.tex}</MB>
                          ))}
                        </div>
                      </div>
                    ))}
                    {e.hianyzo.length > 0 && <p className="text-[12.5px] text-rose-700">A csomóponti módszer itt elakad ({e.hianyzo.map((id) => `S${id}`).join(", ")}): átmetszéssel kell folytatni.</p>}
                    {e.ellenorzesek.filter((c) => !c.hasznalt).length > 0 && (
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-2.5">
                        <p className="text-[11px] font-bold tracking-wider text-emerald-700 uppercase">Ellenőrzés — a nem használt csomópont(ok)</p>
                        <div className="szamok mt-1 space-y-0.5 text-[12.5px] text-petrol-800">
                          {e.ellenorzesek
                            .filter((c) => !c.hasznalt)
                            .flatMap((c) => c.egyenletek.map((q, j) => <MB key={`${c.csomopont}${j}`}>{`\\text{${c.csomopont}. cs.: }${q.tex}`}</MB>))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {ful === "atmetszes" && (
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-[12px] text-petrol-600">
                    rúd:
                    <select value={rudId ?? ""} onChange={(ev) => setValasztottRud(ev.target.value)} className="rounded-md border border-petrol-200 bg-white px-1.5 py-0.5 text-[12px]">
                      {modell.rudak.map((r) => (
                        <option key={r.id} value={r.id}>
                          S{r.id}
                        </option>
                      ))}
                    </select>
                    {tip.tipus === "k" && (
                      <label className="flex items-center gap-1">
                        <input type="checkbox" checked={ismertOvek} onChange={(ev) => setIsmertOvek(ev.target.checked)} className="accent-[color:var(--color-naracs-500)]" />
                        az övrudak már ismertek (négyes átmetszés 2. lépése)
                      </label>
                    )}
                  </div>
                  {at ? (
                    <div>
                      <p className="text-[12.5px] text-petrol-600">
                        Átmetszés a(z) {at.rudak.map((id) => `S${id}`).join(", ")} rudakon át; a <strong>{at.oldal}</strong> oldali rész ({at.eredmeny.resz.join(", ")}) egyensúlya. Külső erők a részen: {at.eredmeny.kulsoErok.length ? at.eredmeny.kulsoErok.map((f) => f.nev.replace(/[_{}]/g, "") + (f.teher ? ` (${f.csomopont}. cs.)` : "")).join(", ") : "nincs"}.
                      </p>
                      <MB>{`(${at.eredmeny.kulsoErok.map((f) => `\\underline{${f.nev}}`).join(", ")}${at.eredmeny.kulsoErok.length ? ", " : ""}${at.eredmeny.rudak.filter((r) => !r.ismert).map((r) => `\\underline{${rudTex(r.id)}}`).join(", ")}) \\ekv \\underline{O}`}</MB>
                      <div className="szamok space-y-1 text-[13px] text-petrol-800">
                        {at.eredmeny.egyenletek.map((q, i) => (
                          <div key={i}>
                            {q.fopont && (
                              <p className="text-[11.5px] text-violet-700">
                                főpont {q.fopont.nev.replace(/[{}]/g, "").replace("P_", "P")}
                                {q.fopont.csomopont ? "" : ` = (${sz(q.fopont.x, 2)}; ${sz(q.fopont.y, 2)}) m`} — a többi átvágott rúd hatásvonala átmegy rajta
                              </p>
                            )}
                            {q.parhuzamosak && <p className="text-[11.5px] text-violet-700">a többi átvágott rúd párhuzamos → a rájuk merőleges vetületi egyenlet</p>}
                            {q.nincsEgyismeretlenes ? (
                              <p className="text-[12.5px] text-rose-700">
                                <M>{rudTex(q.rud)}</M>: ebből az átmetszésből nincs egyismeretlenes egyenlet; a teljes megoldásból <M>{`${rudTex(q.rud)} = ${sz(q.S, 2)}\\ \\text{kN}`}</M>.
                              </p>
                            ) : (
                              <MB>{q.tex}</MB>
                            )}
                          </div>
                        ))}
                        {at.eredmeny.ellenorzes && (
                          <div>
                            <p className="text-[11.5px] text-emerald-700">ellenőrzés:</p>
                            <MB>{at.eredmeny.ellenorzes.tex}</MB>
                          </div>
                        )}
                      </div>
                      <p className="mt-2 text-[12px] text-petrol-500">
                        A keresett rúd: <M>{`${rudTex(rudId)} = ${sz(e.rudErok[rudId], 2)}\\ \\text{kN}`}</M> — {Math.abs(e.rudErok[rudId]) < 1e-6 ? "vakrúd" : e.rudErok[rudId] > 0 ? "húzott" : "nyomott"}.
                      </p>
                    </div>
                  ) : (
                    <p className="text-[12.5px] text-petrol-600">
                      Ehhez a rúdhoz nem találtam olyan (legfeljebb négy rudat vágó) átmetszést, amelyből egyismeretlenes egyenlettel jönne ki. K-rácsnál pipáld be, hogy az övrudak már ismertek, vagy használd a csomóponti módszert: <M>{`${rudTex(rudId)} = ${sz(e.rudErok[rudId], 2)}\\ \\text{kN}`}</M>.
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
