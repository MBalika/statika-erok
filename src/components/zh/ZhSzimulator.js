"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { GENERATOROK as V1 } from "@/components/vektorok/GyakorloSzekcio";
import { EXTRA_GENERATOROK as V2 } from "@/components/vektorok/GyakorloExtra";
import { GENERATOROK as N1 } from "@/components/nyomatek/GyakorloSzekcio";
import { EXTRA_GENERATOROK as N2 } from "@/components/nyomatek/GyakorloExtra";
import { GENERATOROK as M1 } from "@/components/megoszlo/GyakorloSzekcio";
import { EXTRA_GENERATOROK as M2 } from "@/components/megoszlo/GyakorloExtra";
import { GENERATOROK as S1 } from "@/components/sulypont/GyakorloSzekcio";
import { EXTRA_GENERATOROK as S2 } from "@/components/sulypont/GyakorloExtra";

const MODULOK = [
  { nev: "Vektorok", szin: "bg-petrol-600", gen: [...V1, ...V2] },
  { nev: "Nyomaték, eredő", szin: "bg-violet-600", gen: [...N1, ...N2] },
  { nev: "Megoszló erők", szin: "bg-naracs-500", gen: [...M1, ...M2] },
  { nev: "Súlypont", szin: "bg-emerald-600", gen: [...S1, ...S2] },
];
const KULCS = "statika-zh-elozmenyek";
const valaszt = (t) => t[Math.floor(Math.random() * t.length)];

function szamma(s) {
  if (s === "" || s == null) return NaN;
  return Number(String(s).replace(/\s/g, "").replace(",", "."));
}
function helyesE(mezo, ertek) {
  const v = szamma(ertek);
  if (!Number.isFinite(v)) return false;
  const tures = mezo.tures ?? Math.max(0.01, Math.abs(mezo.helyes) * 0.015);
  return Math.abs(v - mezo.helyes) <= tures;
}
function kerekit(szam, tizedes) {
  return szam.toFixed(tizedes).replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "").replace(".", ",");
}
function ido(mp) {
  const m = Math.floor(mp / 60);
  const s = mp % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
function jegy(arany) {
  if (arany >= 0.85) return { jegy: 5, nev: "jeles" };
  if (arany >= 0.7) return { jegy: 4, nev: "jó" };
  if (arany >= 0.55) return { jegy: 3, nev: "közepes" };
  if (arany >= 0.4) return { jegy: 2, nev: "elégséges" };
  return { jegy: 1, nev: "elégtelen" };
}

function ujFeladatsor() {
  return MODULOK.map((m, i) => {
    const g = valaszt(m.gen);
    return { modul: m.nev, szin: m.szin, cim: g.cim, adat: g.fn(), i };
  });
}

export default function ZhSzimulator() {
  const [fazis, setFazis] = useState("kezdo");
  const [perc, setPerc] = useState(20);
  const [feladatok, setFeladatok] = useState(null);
  const [valaszok, setValaszok] = useState({});
  const [hatra, setHatra] = useState(0);
  const [elozmenyek, setElozmenyek] = useState([]);
  const [nyitott, setNyitott] = useState({});
  const idozito = useRef(null);
  const beadRef = useRef(null);

  useEffect(() => {
    try {
      const t = JSON.parse(localStorage.getItem(KULCS) || "[]");
      if (Array.isArray(t)) setElozmenyek(t);
    } catch {
      /* nincs tárolt előzmény */
    }
  }, []);

  const indit = () => {
    setFeladatok(ujFeladatsor());
    setValaszok({});
    setNyitott({});
    setHatra(perc * 60);
    setFazis("fut");
  };

  const bead = () => {
    setFazis("kesz");
    if (idozito.current) clearInterval(idozito.current);
  };
  beadRef.current = bead;

  useEffect(() => {
    if (fazis !== "fut") return undefined;
    idozito.current = setInterval(() => {
      setHatra((h) => {
        if (h <= 1) {
          clearInterval(idozito.current);
          setTimeout(() => beadRef.current(), 0);
          return 0;
        }
        return h - 1;
      });
    }, 1000);
    return () => clearInterval(idozito.current);
  }, [fazis]);

  // értékelés
  const ertekeles = useMemo(() => {
    if (fazis !== "kesz" || !feladatok) return null;
    let jo = 0;
    let ossz = 0;
    const reszlet = feladatok.map((f) => {
      const mez = f.adat.mezok.map((m) => {
        const v = valaszok[`${f.i}-${m.id}`];
        const ok = helyesE(m, v);
        ossz += 1;
        if (ok) jo += 1;
        return { ...m, adott: v, ok };
      });
      return { ...f, mez, joDb: mez.filter((m) => m.ok).length };
    });
    return { jo, ossz, arany: ossz ? jo / ossz : 0, reszlet };
  }, [fazis, feladatok, valaszok]);

  useEffect(() => {
    if (!ertekeles) return;
    const uj = {
      mikor: new Date().toISOString(),
      jo: ertekeles.jo,
      ossz: ertekeles.ossz,
      perc,
      hasznalt: perc * 60 - hatra,
    };
    setElozmenyek((e) => {
      const lista = [uj, ...e].slice(0, 12);
      try {
        localStorage.setItem(KULCS, JSON.stringify(lista));
      } catch {
        /* privát mód */
      }
      return lista;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ertekeles]);

  const surgos = hatra <= 120;

  /* ---------- kezdőképernyő ---------- */
  if (fazis === "kezdo") {
    return (
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-2xl border border-[color:var(--keret)] bg-white p-5 sm:p-6">
          <p className="text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Hogyan működik</p>
          <ul className="mt-3 space-y-2 text-[14.5px] leading-relaxed text-petrol-700">
            <li>Négy véletlen feladat, modulonként egy — ugyanazokból a típusokból, mint a gyakorló dobozok, de <strong>segítség és ellenőrzés nélkül</strong>.</li>
            <li>Az óra indul, és a beadásig (vagy az idő lejártáig) nincs visszajelzés. Papírral, számológéppel dolgozz, ahogy a zh-n.</li>
            <li>A végén mezőnként látod, mi volt jó, mi nem, és minden feladathoz megnyithatod a teljes levezetést.</li>
            <li>Az eredményeid ebben a böngészőben elmentődnek, hogy lásd a fejlődést.</li>
          </ul>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="text-[13px] font-medium text-petrol-600">Időkeret:</span>
            <div className="flex gap-1 rounded-lg bg-petrol-50 p-0.5 ring-1 ring-petrol-200">
              {[15, 20, 30].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPerc(p)}
                  className={`rounded-md px-3 py-1 text-[13px] font-semibold ${perc === p ? "bg-petrol-700 text-white" : "text-petrol-600 hover:bg-white"}`}
                >
                  {p} perc
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={indit}
              className="ml-auto rounded-xl bg-naracs-500 px-5 py-2.5 text-[14px] font-bold text-white shadow-md shadow-naracs-500/25 transition hover:bg-naracs-600"
            >
              Zh indítása ▶
            </button>
          </div>
        </div>
        <div className="rounded-2xl border border-[color:var(--keret)] bg-white p-5 sm:p-6">
          <p className="text-[11px] font-bold tracking-[0.16em] text-petrol-500 uppercase">Korábbi próbálkozásaid</p>
          {elozmenyek.length === 0 ? (
            <p className="mt-3 text-[13.5px] text-petrol-500">Még nincs. Az első zh után itt jelenik meg az eredmény.</p>
          ) : (
            <ul className="mt-3 space-y-1.5">
              {elozmenyek.map((e, i) => {
                const ar = e.ossz ? e.jo / e.ossz : 0;
                const j = jegy(ar);
                const d = new Date(e.mikor);
                return (
                  <li key={i} className="flex items-center gap-3 rounded-lg bg-petrol-50 px-3 py-2 text-[13px]">
                    <span className={`grid h-7 w-7 place-items-center rounded-md text-[13px] font-bold text-white ${j.jegy >= 4 ? "bg-emerald-600" : j.jegy >= 2 ? "bg-naracs-500" : "bg-rose-500"}`}>{j.jegy}</span>
                    <span className="szamok text-petrol-800">
                      {e.jo} / {e.ossz} mező · {Math.round(ar * 100)} %
                    </span>
                    <span className="ml-auto text-[11.5px] text-petrol-500">
                      {d.toLocaleDateString("hu-HU")} · {ido(e.hasznalt ?? 0)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    );
  }

  /* ---------- futó zh ---------- */
  if (fazis === "fut" && feladatok) {
    return (
      <div>
        <div className={`sticky top-[110px] z-30 mb-4 flex items-center gap-3 rounded-xl border px-4 py-2.5 shadow-sm md:top-[150px] ${surgos ? "border-rose-300 bg-rose-50" : "border-[color:var(--keret)] bg-white"}`}>
          <span className={`text-[11px] font-bold tracking-[0.16em] uppercase ${surgos ? "text-rose-700" : "text-petrol-500"}`}>Hátralévő idő</span>
          <span className={`szamok text-2xl font-bold ${surgos ? "text-rose-700" : "text-petrol-900"}`}>{ido(hatra)}</span>
          <button
            type="button"
            onClick={bead}
            className="ml-auto rounded-lg bg-petrol-700 px-4 py-1.5 text-[13px] font-semibold text-white transition hover:bg-petrol-800"
          >
            Beadás
          </button>
        </div>
        <div className="space-y-4">
          {feladatok.map((f) => (
            <div key={f.i} className="rounded-2xl border border-[color:var(--keret)] bg-white p-4 sm:p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-md px-2 py-0.5 text-[10.5px] font-bold tracking-[0.12em] text-white uppercase ${f.szin}`}>{f.i + 1}. feladat</span>
                <span className="text-[12px] font-semibold text-petrol-500">{f.modul}</span>
                <span className="text-[12px] text-petrol-400">· {f.cim}</span>
              </div>
              <div className="proza mt-3 text-[14.5px] leading-relaxed text-petrol-800">{f.adat.szoveg}</div>
              <div className={`mt-3 grid gap-3 ${f.adat.mezok.length > 1 ? "sm:grid-cols-2" : ""} ${f.adat.mezok.length > 2 ? "lg:grid-cols-3" : ""}`}>
                {f.adat.mezok.map((m) => (
                  <label key={m.id} className="block">
                    <span className="mb-1 block text-[12px] font-medium text-petrol-600">{m.cimke}</span>
                    <span className="flex items-stretch overflow-hidden rounded-lg border border-petrol-200 bg-white focus-within:border-petrol-500">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={valaszok[`${f.i}-${m.id}`] ?? ""}
                        onChange={(e) => setValaszok((v) => ({ ...v, [`${f.i}-${m.id}`]: e.target.value }))}
                        className="szamok min-w-0 flex-1 px-3 py-2 text-[14px] text-petrol-900 focus:outline-none"
                        placeholder="…"
                      />
                      <span className="flex items-center border-l border-petrol-100 bg-petrol-50 px-2.5 text-[12px] text-petrol-500">{m.egyseg}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 flex justify-end">
          <button type="button" onClick={bead} className="rounded-xl bg-naracs-500 px-5 py-2.5 text-[14px] font-bold text-white shadow-md shadow-naracs-500/25 transition hover:bg-naracs-600">
            Beadom
          </button>
        </div>
      </div>
    );
  }

  /* ---------- eredmény ---------- */
  if (fazis === "kesz" && ertekeles) {
    const j = jegy(ertekeles.arany);
    return (
      <div>
        <div className="rounded-2xl border border-[color:var(--keret)] bg-white p-5 text-center sm:p-6">
          <p className="text-[11px] font-bold tracking-[0.16em] text-petrol-500 uppercase">Eredmény</p>
          <p className="szamok mt-1 text-5xl font-bold text-petrol-900">
            {ertekeles.jo} <span className="text-xl font-semibold text-petrol-400">/ {ertekeles.ossz} mező</span>
          </p>
          <p className="mt-1 text-[15px] text-petrol-700">
            {Math.round(ertekeles.arany * 100)} % · tájékoztató jegy: <strong>{j.jegy} ({j.nev})</strong> · felhasznált idő: {ido(perc * 60 - hatra)}
          </p>
          <p className="mx-auto mt-2 max-w-xl text-[13px] text-petrol-500">
            A jegyhatárok csak tájékoztatók (85 / 70 / 55 / 40 %). A valódi zh-n a levezetés is pontot ér — itt csak a végeredményt nézzük.
          </p>
          <button type="button" onClick={() => setFazis("kezdo")} className="mt-4 rounded-xl bg-naracs-500 px-5 py-2.5 text-[14px] font-bold text-white transition hover:bg-naracs-600">
            Új zh ↻
          </button>
        </div>
        <div className="mt-5 space-y-4">
          {ertekeles.reszlet.map((f) => (
            <div key={f.i} className={`rounded-2xl border p-4 sm:p-5 ${f.joDb === f.mez.length ? "border-emerald-200 bg-emerald-50/40" : f.joDb === 0 ? "border-rose-200 bg-rose-50/40" : "border-naracs-200 bg-naracs-50/40"}`}>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-md px-2 py-0.5 text-[10.5px] font-bold tracking-[0.12em] text-white uppercase ${f.szin}`}>{f.i + 1}. feladat</span>
                <span className="text-[12px] font-semibold text-petrol-500">{f.modul} · {f.cim}</span>
                <span className="ml-auto szamok text-[13px] font-bold text-petrol-800">{f.joDb} / {f.mez.length}</span>
              </div>
              <div className="proza mt-2 text-[13.5px] text-petrol-700">{f.adat.szoveg}</div>
              <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                {f.mez.map((m) => (
                  <li key={m.id} className={`szamok rounded-lg px-3 py-1.5 text-[13px] ${m.ok ? "bg-emerald-100 text-emerald-900" : "bg-rose-100 text-rose-900"}`}>
                    <span className="font-semibold">{m.cimke}:</span> {m.adott ? String(m.adott) : "—"} {m.egyseg}
                    {!m.ok && (
                      <span className="ml-2 text-rose-700">→ helyesen {kerekit(m.helyes, m.tizedes ?? 2)} {m.egyseg}</span>
                    )}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => setNyitott((n) => ({ ...n, [f.i]: !n[f.i] }))}
                className="mt-3 text-[13px] font-semibold text-petrol-700 underline-offset-2 hover:underline"
              >
                {nyitott[f.i] ? "Levezetés elrejtése" : "Levezetés megmutatása"}
              </button>
              {nyitott[f.i] && <div className="proza szamok mt-2 rounded-xl bg-white p-4 text-[14px] text-petrol-800">{f.adat.megoldas}</div>}
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}
