"use client";

import { useEffect, useMemo, useState } from "react";
import { M, MB } from "@/components/ui/Keplet";
import { sz } from "@/lib/szamok";
import { racsosMegold, PELDAK, rudTex } from "@/lib/racsos";
import RacsosRajz, { RACS_SZIN, RudErokTabla } from "./RacsosRajz";

/*
 * Csomóponti hullám: a csomóponti módszer lépésről lépésre. Gombnyomásra vagy
 * automatikusan a soron következő (legfeljebb két ismeretlen rúderőjű) csomópont
 * „kigyullad”, a jobb oldalon megjelenik a két egyenlete, a rudak felveszik a
 * színüket (húzott = rose, nyomott = sky, vakrúd = szürke) és a vastagságukat.
 */

const TARTOK = [
  { id: "tk61", cim: "Tankönyv 6.1 (Warren)", modell: () => PELDAK.tk61(1.5, 2, 10, -60), leiras: "a = 1,5 m, h = 2 m, F = 10 kN (60°-ban lefelé) az 5. csomóponton" },
  { id: "h07", cim: "H07 (párhuzamos övű)", modell: () => PELDAK.h07(2, 1.5, 10, 6), leiras: "a = 2 m, b = 1,5 m, F₁ = 10 kN, F₂ = 6 kN" },
  { id: "h08", cim: "H08/1 (K-rácsozás)", modell: () => PELDAK.h08a(2, 1.5, 10, 10), leiras: "b = 2 m, a = 1,5 m, F₁ = F₂ = 10 kN" },
  { id: "vizsga", cim: "Vizsgaminta (trapéz)", modell: () => PELDAK.vizsga(8), leiras: "8 kN a 3. csomóponton, 4 × 5 m, magasság 5 → 9 m" },
];

const jellegSzin = { húzott: "text-rose-700 bg-rose-50 ring-rose-200", nyomott: "text-sky-700 bg-sky-50 ring-sky-200", vakrúd: "text-petrol-500 bg-petrol-50 ring-petrol-200" };

export default function CsomopontiHullam({ kezdo = 0 }) {
  const [tIdx, setTIdx] = useState(kezdo);
  const [sorrend, setSorrend] = useState("sorban");
  const [lepes, setLepes] = useState(0); // 0 = még csak a reakciók; k = az első k csomópont kész
  const [auto, setAuto] = useState(false);

  const { modell, e } = useMemo(() => {
    const m = TARTOK[tIdx].modell();
    return { modell: m, e: racsosMegold(m, { sorrend }) };
  }, [tIdx, sorrend]);

  const lepesek = e.csomopontiSorrend ?? [];
  const n = lepesek.length;

  useEffect(() => {
    if (!auto) return undefined;
    if (lepes >= n) {
      setAuto(false);
      return undefined;
    }
    const id = setTimeout(() => setLepes((l) => Math.min(n, l + 1)), 1700);
    return () => clearTimeout(id);
  }, [auto, lepes, n]);

  const ismert = useMemo(() => {
    const s = new Set();
    for (let i = 0; i < lepes; i++) for (const id of Object.keys(lepesek[i].eredmenyek)) s.add(id);
    return s;
  }, [lepes, lepesek]);
  const kesz = useMemo(() => new Set(lepesek.slice(0, Math.max(0, lepes - 1)).map((l) => l.csomopont)), [lepes, lepesek]);
  const aktiv = lepes > 0 && lepes <= n ? [lepesek[lepes - 1].csomopont] : [];
  const aktualis = lepes > 0 ? lepesek[lepes - 1] : null;

  const valt = (i) => {
    setTIdx(i);
    setLepes(0);
    setAuto(false);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white">
      <div className="flex flex-wrap items-center gap-2 border-b border-[color:var(--keret)] bg-petrol-50/70 px-3 py-2">
        <div className="flex flex-wrap gap-1 rounded-lg bg-white p-0.5 ring-1 ring-petrol-200">
          {TARTOK.map((t, i) => (
            <button key={t.id} type="button" onClick={() => valt(i)} className={`rounded-md px-2.5 py-1 text-[12px] font-medium transition ${tIdx === i ? "bg-petrol-700 text-white" : "text-petrol-600 hover:bg-petrol-50"}`}>
              {t.cim}
            </button>
          ))}
        </div>
        <label className="ml-auto flex items-center gap-1.5 text-[12px] text-petrol-600">
          sorrend:
          <select value={sorrend} onChange={(ev) => { setSorrend(ev.target.value); setLepes(0); setAuto(false); }} className="rounded-md border border-petrol-200 bg-white px-1.5 py-0.5 text-[12px]">
            <option value="sorban">a csomópontok sorszáma szerint</option>
            <option value="kevesebb">mindig a legkevesebb ismeretlen</option>
          </select>
        </label>
      </div>

      <div className="grid lg:grid-cols-[1.3fr_1fr] [&>*]:min-w-0">
        <div className="racs-vilagos border-b border-[color:var(--keret)] p-3 lg:border-r lg:border-b-0">
          <RacsosRajz modell={modell} eredmeny={e} ismertRudak={ismert} aktivCsomopontok={aktiv} keszCsomopontok={kesz} reakciok={lepes > 0} rudFeliratok={lepes > 0} cimke={TARTOK[tIdx].leiras.toUpperCase()} />
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => { setAuto(false); setLepes((l) => Math.min(n, l + 1)); }} disabled={lepes >= n} className="rounded-lg bg-naracs-500 px-3.5 py-1.5 text-[13px] font-semibold text-white transition hover:bg-naracs-600 disabled:opacity-40">
              {lepes === 0 ? "Indítás: reakciók, majd az 1. csomópont →" : lepes < n ? "Következő csomópont →" : "Kész"}
            </button>
            <button type="button" onClick={() => setAuto((a) => !a)} disabled={lepes >= n} className={`rounded-lg px-3 py-1.5 text-[13px] font-semibold ring-1 transition disabled:opacity-40 ${auto ? "bg-petrol-700 text-white ring-petrol-700" : "bg-white text-petrol-700 ring-petrol-200 hover:bg-petrol-50"}`}>
              {auto ? "⏸ Állj" : "▶ Automatikus hullám"}
            </button>
            <button type="button" onClick={() => { setLepes(0); setAuto(false); }} className="rounded-lg bg-white px-3 py-1.5 text-[13px] font-semibold text-petrol-700 ring-1 ring-petrol-200 transition hover:bg-petrol-50">
              ↺ Újra
            </button>
            <span className="ml-auto text-[12px] text-petrol-500">
              {lepes} / {n} csomópont · {ismert.size} / {modell.rudak.length} rúderő ismert
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-[11.5px] text-petrol-500">
            <span className="flex items-center gap-1"><span className="inline-block h-1.5 w-5 rounded" style={{ background: RACS_SZIN.huzott }} /> húzott</span>
            <span className="flex items-center gap-1"><span className="inline-block h-1.5 w-5 rounded" style={{ background: RACS_SZIN.nyomott }} /> nyomott</span>
            <span className="flex items-center gap-1"><span className="inline-block h-1.5 w-5 rounded" style={{ background: RACS_SZIN.vak }} /> vakrúd</span>
            <span className="flex items-center gap-1"><span className="inline-block h-1.5 w-5 rounded border border-dashed border-petrol-400" /> még ismeretlen</span>
            <span>· a vonalvastagság ∝ |S|</span>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          {lepes === 0 && (
            <div>
              <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">0. lépés — reakciók az egész szerkezetből</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-petrol-600">
                A rácsozat egyetlen merev test: a támaszok reakcióit a 5. modul receptjével számoljuk, csak azután kezdünk a csomópontokba. Nyomd meg az indítást — a reakciók megjelennek, és az első csomópont „kigyullad”.
              </p>
              <div className="szamok mt-3 space-y-1 text-[13px] text-petrol-800">
                {e.reakcioLepesek.map((l, i) => (
                  <MB key={i}>{l.tex}</MB>
                ))}
              </div>
            </div>
          )}
          {aktualis && (
            <div>
              <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">
                {lepes}. lépés — a(z) {aktualis.csomopont}. csomópont
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-petrol-600">
                {aktualis.mod === "ketto" && <>Két ismeretlen rúderő: <M>{rudTex(aktualis.ismeretlenek[0])}</M> és <M>{rudTex(aktualis.ismeretlenek[1])}</M>. Az első egyenletet úgy írjuk, hogy a másik rúdra <em>merőleges</em> irányba vetítünk — így csak egy ismeretlen marad benne.</>}
                {aktualis.mod === "egy" && <>Egyetlen ismeretlen maradt (<M>{rudTex(aktualis.ismeretlenek[0])}</M>): az egyik vetületi egyenlet adja, a másik ellenőrzés.</>}
                {aktualis.mod === "harom" && <>Háromnál nem kevesebb ismeretlen, de kettő (<M>{aktualis.kozosEgyenes.map(rudTex).join(",\\ ")}</M>) egy egyenesbe esik: a rájuk merőleges vetületből a harmadik számolható.</>}
              </p>
              <div className="szamok mt-3 space-y-1 text-[13px] text-petrol-800">
                {aktualis.egyenletek.map((q, i) => (
                  <MB key={i}>{q.tex}</MB>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {Object.entries(aktualis.eredmenyek).map(([id, S]) => {
                  const j = Math.abs(S) < 1e-6 ? "vakrúd" : S > 0 ? "húzott" : "nyomott";
                  return (
                    <span key={id} className={`szamok rounded-full px-2.5 py-1 text-[12px] font-semibold ring-1 ${jellegSzin[j]}`}>
                      S{id} = {sz(S, 2)} kN · {j}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
          {lepes >= n && n > 0 && (
            <div className="mt-4">
              <p className="text-[10.5px] font-bold tracking-[0.16em] text-emerald-700 uppercase">Kész — a nem használt egyenletek ellenőrzésre valók</p>
              <div className="szamok mt-1.5 space-y-1 text-[12.5px] text-petrol-700">
                {e.ellenorzesek.filter((c) => !c.hasznalt).slice(0, 2).flatMap((c) => c.egyenletek.map((q, i) => <MB key={`${c.csomopont}-${i}`}>{`\\text{${c.csomopont}. cs.: }${q.tex}`}</MB>))}
              </div>
              <div className="mt-3">
                <RudErokTabla eredmeny={e} cim="Rúderőtáblázat" kicsi />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
