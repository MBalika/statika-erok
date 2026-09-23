"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import EpitoRajz from "./EpitoRajz";
import EpitoPanel from "./EpitoPanel";
import { SABLONOK } from "@/lib/epito/sablonok";
import { veletlenTarto, FOK_NEV } from "@/lib/epito/veletlen";
import { hozzaadCsomopont, hozzaadRud, rudFeloszt, csukloValt, tamaszCiklus, teherHozzaad, elemTorol, rudGeometria, sorosit, ellenorzottAllapot, tomorit, allapotLeiras, uresAllapot, RACS } from "@/lib/epito/modell";

/*
 * 1. lépés: Építés — eszköztár, rácsos vászon, oldalsó panel, élő állapotjelző, sablonok,
 * véletlen tartó, mentés/megosztás. Az állapotot a szülő (EpitoOldal) tartja; itt a visszavonás-
 * történet és a kijelölés él.
 *   allapot, onValtoztat(uj), jelzes (allapotJelzes eredménye), onTovabb()
 */

const MENTETT_KULCS = "statika-epito-mentett";
const MAX_MENTETT = 20;
const MAX_TORTENET = 40;
const ESZKOZOK = [
  { id: "epit", nev: "Csomópont / rúd", ikon: "╱", sugo: "Kattints a rácsra: csomópont. Húzz egy csomópontból: rúd (ferde is). Két csomópont egymás utáni kattintása is rúd. Rúdra kattintva a rúd ott feloszlik." },
  { id: "csuklo", nev: "Csukló", ikon: "○", sugo: "Csomópontra kattintva belső csukló (a befutó rudak közül az első merev marad, a többi csuklós). Másodszorra kattintva megszűnik." },
  { id: "tamasz", nev: "Támasz", ikon: "△", sugo: "Csomópontra kattintva: nincs → görgő → csukló → befogás → nincs. A görgő gátolt irányát a panelben állíthatod." },
  { id: "teher", nev: "Teher", ikon: "↓", sugo: "Csomópontra kattintva erő (10 kN lefelé), rúdra kattintva erő a kattintás helyén, rúd mentén húzva megoszló teher. Az értéket, irányt a panelben állítod." },
  { id: "torles", nev: "Törlés", ikon: "✕", sugo: "Kattints egy csomópontra, rúdra vagy teherre — törlődik (a csomóponttal a rudai is)." },
];

function mentettekOlvas() {
  if (typeof window === "undefined") return [];
  try {
    const t = JSON.parse(window.localStorage.getItem(MENTETT_KULCS) || "[]");
    return Array.isArray(t) ? t : [];
  } catch {
    return [];
  }
}
function mentettekIr(lista) {
  try {
    window.localStorage.setItem(MENTETT_KULCS, JSON.stringify(lista.slice(0, MAX_MENTETT)));
  } catch { /* tele tároló, privát mód */ }
}

/** Legközelebbi csomópont / rúd a ponthoz (m). */
function talalat(all, p, sugar = 0.32) {
  let legjobb = null, tav = sugar;
  for (const c of all.csomopontok) {
    const d = Math.hypot(c.x - p.x, c.y - p.y);
    if (d < tav) { tav = d; legjobb = { tipus: "csomopont", id: c.id }; }
  }
  if (legjobb) return legjobb;
  tav = sugar - 0.04;
  for (const r of all.rudak) {
    const g = rudGeometria(all, r);
    if (!g || g.hossz < 1e-9) continue;
    const a = (p.x - g.x1) * g.cos + (p.y - g.y1) * g.sin;
    if (a < 0 || a > g.hossz) continue;
    const d = Math.abs(-(p.x - g.x1) * g.sin + (p.y - g.y1) * g.cos);
    if (d < tav) { tav = d; legjobb = { tipus: "rud", id: r.id, a }; }
  }
  return legjobb;
}

export default function Epito({ allapot: all, onValtoztat, jelzes, onTovabb }) {
  const [mod, setMod] = useState("epit");
  const [teherMod, setTeherMod] = useState("ero");
  const [kijelolt, setKijelolt] = useState(null);
  const [rudKezd, setRudKezd] = useState(null);
  const [gumi, setGumi] = useState(null);
  const [mentettek, setMentettek] = useState([]);
  const [mentesNev, setMentesNev] = useState("");
  const [uzenet, setUzenet] = useState(null);
  const tort = useRef({ mult: [], jovo: [] });
  const [tortDb, setTortDb] = useState({ mult: 0, jovo: 0 });
  const huzas = useRef(null); // { fajta: "rud"|"megoszlo", ... }
  const svgRef = useRef(null);
  const allRef = useRef(all);
  allRef.current = all;

  useEffect(() => { setMentettek(mentettekOlvas()); }, []);

  /* ---------- állapotváltás visszavonás-történettel ---------- */
  const valtoztat = useCallback((uj) => {
    if (uj === allRef.current) return;
    tort.current.mult = [...tort.current.mult.slice(-(MAX_TORTENET - 1)), allRef.current];
    tort.current.jovo = [];
    setTortDb({ mult: tort.current.mult.length, jovo: 0 });
    onValtoztat(uj);
  }, [onValtoztat]);
  const visszavon = useCallback(() => {
    const elozo = tort.current.mult.pop();
    if (!elozo) return;
    tort.current.jovo.push(allRef.current);
    setTortDb({ mult: tort.current.mult.length, jovo: tort.current.jovo.length });
    setKijelolt(null);
    onValtoztat(elozo);
  }, [onValtoztat]);
  const ujra = useCallback(() => {
    const kov = tort.current.jovo.pop();
    if (!kov) return;
    tort.current.mult.push(allRef.current);
    setTortDb({ mult: tort.current.mult.length, jovo: tort.current.jovo.length });
    onValtoztat(kov);
  }, [onValtoztat]);

  const torolKijelolt = useCallback(() => {
    if (!kijelolt) return;
    valtoztat(elemTorol(allRef.current, kijelolt));
    setKijelolt(null);
  }, [kijelolt, valtoztat]);

  /* ---------- billentyűk ---------- */
  useEffect(() => {
    const kezel = (ev) => {
      const cel = ev.target;
      if (cel && (cel.tagName === "INPUT" || cel.tagName === "TEXTAREA" || cel.isContentEditable)) return;
      if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === "z") { ev.preventDefault(); if (ev.shiftKey) ujra(); else visszavon(); }
      else if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === "y") { ev.preventDefault(); ujra(); }
      else if (ev.key === "Delete" || ev.key === "Backspace") { if (kijelolt) { ev.preventDefault(); torolKijelolt(); } }
      else if (ev.key === "Escape") { setRudKezd(null); setKijelolt(null); setGumi(null); huzas.current = null; }
    };
    window.addEventListener("keydown", kezel);
    return () => window.removeEventListener("keydown", kezel);
  }, [kijelolt, visszavon, ujra, torolKijelolt]);

  /* ---------- a vászon eseményei ---------- */
  const le = (p, esem) => {
    if (esem.button !== undefined && esem.button !== 0) return;
    // építő módban a rácspont a fontos (új csomópont), a többi módban a meglévő elemet keressük, nagyobb sugárral (ujjal is)
    const t = talalat(all, p, mod === "epit" ? 0.32 : 0.48);
    try { esem.currentTarget.setPointerCapture(esem.pointerId); } catch { /* semmi */ }
    if (mod === "epit") {
      if (t?.tipus === "csomopont") {
        const c = all.csomopontok.find((q) => q.id === t.id);
        huzas.current = { fajta: "rud", kezd: t.id, x: c.x, y: c.y, mozgott: false };
        setKijelolt({ tipus: "csomopont", id: t.id });
      } else if (t?.tipus === "rud") {
        const r = rudFeloszt(all, t.id, t.a);
        if (r.id) { valtoztat(r.allapot); setKijelolt({ tipus: "csomopont", id: r.id }); setRudKezd(null); }
        else setKijelolt({ tipus: "rud", id: t.id });
      } else {
        const r = hozzaadCsomopont(all, p.x, p.y);
        let uj = r.allapot;
        if (rudKezd && rudKezd !== r.id) uj = hozzaadRud(uj, rudKezd, r.id).allapot;
        valtoztat(uj);
        setKijelolt({ tipus: "csomopont", id: r.id });
        setRudKezd(r.id);
        const c = uj.csomopontok.find((q) => q.id === r.id);
        huzas.current = { fajta: "rud", kezd: r.id, x: c.x, y: c.y, mozgott: false, frissenLetrehozott: true };
      }
    } else if (mod === "csuklo") {
      if (t?.tipus === "csomopont") { valtoztat(csukloValt(all, t.id)); setKijelolt({ tipus: "csomopont", id: t.id }); }
      else if (t?.tipus === "rud") setKijelolt({ tipus: "rud", id: t.id });
    } else if (mod === "tamasz") {
      if (t?.tipus === "csomopont") { valtoztat(tamaszCiklus(all, t.id)); setKijelolt({ tipus: "csomopont", id: t.id }); }
      else if (t?.tipus === "rud") setKijelolt({ tipus: "rud", id: t.id });
    } else if (mod === "teher") {
      if (t?.tipus === "csomopont") {
        const r = teherHozzaad(all, teherMod === "ero" ? { fajta: "csomopontiEro", csomopont: t.id } : { fajta: "csomopontiNyomatek", csomopont: t.id });
        valtoztat(r.allapot);
        setKijelolt({ tipus: "teher", id: r.id });
      } else if (t?.tipus === "rud") {
        const g = rudGeometria(all, all.rudak.find((q) => q.id === t.id));
        const a = Math.min(g.hossz, Math.max(0, Math.round(t.a / RACS) * RACS));
        if (teherMod === "nyomatek") {
          const r = teherHozzaad(all, { fajta: "pontNyomatek", rud: t.id, a });
          valtoztat(r.allapot);
          setKijelolt({ tipus: "teher", id: r.id });
        } else {
          huzas.current = { fajta: "megoszlo", rud: t.id, a0: a, a1: a, g, mozgott: false };
        }
      } else setKijelolt(null);
    } else if (mod === "torles") {
      if (t) { valtoztat(elemTorol(all, t)); setKijelolt(null); setRudKezd(null); }
    }
  };

  const mozog = (p) => {
    const h = huzas.current;
    if (!h) return;
    const all = allRef.current;
    if (h.fajta === "rud") {
      const d = Math.hypot(p.x - h.x, p.y - h.y);
      if (d > 0.3) h.mozgott = true;
      if (h.mozgott) {
        const t = talalat(all, p);
        const cel = t?.tipus === "csomopont" ? all.csomopontok.find((q) => q.id === t.id) : { x: Math.round(p.x / RACS) * RACS, y: Math.round(p.y / RACS) * RACS };
        setGumi({ x1: h.x, y1: h.y, x2: cel.x, y2: cel.y });
      }
    } else if (h.fajta === "megoszlo") {
      const g = h.g;
      const a = Math.min(g.hossz, Math.max(0, Math.round(((p.x - g.x1) * g.cos + (p.y - g.y1) * g.sin) / RACS) * RACS));
      if (Math.abs(a - h.a0) >= RACS - 1e-9) h.mozgott = true;
      h.a1 = a;
      if (h.mozgott) {
        const lo = Math.min(h.a0, a), hi = Math.max(h.a0, a);
        setGumi({ x1: g.x1 + lo * g.cos, y1: g.y1 + lo * g.sin, x2: g.x1 + hi * g.cos, y2: g.y1 + hi * g.sin, szin: "#e2590a", vastag: 8 });
      }
    }
  };

  const fel = (p, esem) => {
    const h = huzas.current;
    huzas.current = null;
    setGumi(null);
    try { esem.currentTarget.releasePointerCapture(esem.pointerId); } catch { /* semmi */ }
    if (!h) return;
    const all = allRef.current;
    if (h.fajta === "rud") {
      if (h.mozgott) {
        const t = talalat(all, p);
        let uj = all, celId;
        if (t?.tipus === "csomopont") celId = t.id;
        else {
          const r = hozzaadCsomopont(all, p.x, p.y);
          uj = r.allapot; celId = r.id;
        }
        if (celId !== h.kezd) {
          uj = hozzaadRud(uj, h.kezd, celId).allapot;
          valtoztat(uj);
          setKijelolt({ tipus: "csomopont", id: celId });
          setRudKezd(celId);
        }
      } else if (!h.frissenLetrehozott) {
        // kattintás egy csomópontra: a második kattintás rudat rajzol az elsőtől
        if (rudKezd && rudKezd !== h.kezd) {
          const r = hozzaadRud(all, rudKezd, h.kezd);
          if (r.ids.length) valtoztat(r.allapot);
          setRudKezd(h.kezd);
        } else setRudKezd(rudKezd === h.kezd ? null : h.kezd);
      }
    } else if (h.fajta === "megoszlo") {
      if (h.mozgott) {
        const lo = Math.min(h.a0, h.a1), hi = Math.max(h.a0, h.a1);
        const r = teherHozzaad(all, { fajta: "megoszlo", rud: h.rud, a1: lo, a2: hi, p1: 5, p2: 5, szog: -90 });
        valtoztat(r.allapot);
        setKijelolt({ tipus: "teher", id: r.id });
      } else {
        const r = teherHozzaad(all, { fajta: "pontTeher", rud: h.rud, a: h.a0 });
        valtoztat(r.allapot);
        setKijelolt({ tipus: "teher", id: r.id });
      }
    }
  };

  const elemKattint = (elem) => {
    if (mod === "torles") { valtoztat(elemTorol(all, elem)); setKijelolt(null); }
    else setKijelolt(elem);
  };

  /* ---------- sablonok, véletlen, mentés ---------- */
  const betolt = (allapot) => {
    valtoztat(allapot);
    setKijelolt(null);
    setRudKezd(null);
  };
  const ment = () => {
    const nev = mentesNev.trim() || `Tartó ${new Date().toLocaleDateString("hu-HU")}`;
    const lista = [{ nev, datum: new Date().toISOString(), leiras: allapotLeiras(all), m: tomorit(all) }, ...mentettek].slice(0, MAX_MENTETT);
    mentettekIr(lista);
    setMentettek(lista);
    setMentesNev("");
    setUzenet(`Elmentve: „${nev}”.`);
  };
  const mentettTorol = (i) => {
    const lista = mentettek.filter((_, k) => k !== i);
    mentettekIr(lista);
    setMentettek(lista);
  };
  const linkMasol = async () => {
    const url = `${window.location.origin}${window.location.pathname}#m=${sorosit(all)}`;
    try {
      await navigator.clipboard.writeText(url);
      setUzenet("A link a vágólapon — a címzett ugyanezt a tartót kapja.");
    } catch {
      window.prompt("Másold ki a linket:", url);
    }
    try { window.history.replaceState(null, "", `#m=${sorosit(all)}`); } catch { /* semmi */ }
  };

  const eszkoz = ESZKOZOK.find((q) => q.id === mod);
  const jelSzin = jelzes.kod === "kesz" ? "border-emerald-300 bg-emerald-50 text-emerald-900" : jelzes.kod === "hatarozatlan" ? "border-violet-300 bg-violet-50 text-violet-900" : jelzes.kod === "ures" || jelzes.kod === "terheletlen" ? "border-petrol-200 bg-petrol-50 text-petrol-800" : "border-rose-300 bg-rose-50 text-rose-900";

  return (
    <div className="space-y-3">
      {/* eszköztár */}
      <div className="flex flex-wrap items-center gap-1.5">
        {ESZKOZOK.map((q) => (
          <button key={q.id} type="button" onClick={() => { setMod(q.id); setRudKezd(null); }} className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px] font-semibold transition ${mod === q.id ? "bg-petrol-800 text-white" : "bg-white text-petrol-700 ring-1 ring-petrol-200 hover:bg-petrol-50"}`} title={q.sugo}>
            <span className="text-[14px]">{q.ikon}</span> {q.nev}
          </button>
        ))}
        {mod === "teher" && (
          <span className="ml-1 flex items-center gap-1 rounded-lg bg-naracs-50 p-0.5 ring-1 ring-naracs-200">
            {[["ero", "erő / megoszló"], ["nyomatek", "nyomaték"]].map(([id, nev]) => (
              <button key={id} type="button" onClick={() => setTeherMod(id)} className={`rounded-md px-2 py-1 text-[12px] font-medium ${teherMod === id ? "bg-naracs-500 text-white" : "text-naracs-800 hover:bg-naracs-100"}`}>{nev}</button>
            ))}
          </span>
        )}
        <span className="ml-auto flex items-center gap-1">
          <button type="button" onClick={visszavon} disabled={tortDb.mult === 0} className="rounded-lg bg-white px-2.5 py-1.5 text-[12.5px] font-medium text-petrol-700 ring-1 ring-petrol-200 transition hover:bg-petrol-50 disabled:opacity-40" title="Visszavonás (Ctrl+Z)">↶ Vissza</button>
          <button type="button" onClick={ujra} disabled={tortDb.jovo === 0} className="rounded-lg bg-white px-2.5 py-1.5 text-[12.5px] font-medium text-petrol-700 ring-1 ring-petrol-200 transition hover:bg-petrol-50 disabled:opacity-40" title="Újra (Ctrl+Y)">↷</button>
          <button type="button" onClick={() => { betolt(uresAllapot()); }} className="rounded-lg bg-white px-2.5 py-1.5 text-[12.5px] font-medium text-rose-700 ring-1 ring-rose-200 transition hover:bg-rose-50" title="Üres vászon">Törlés mind</button>
        </span>
      </div>
      <p className="text-[12px] text-petrol-500">{eszkoz.sugo}{mod === "epit" && rudKezd ? ` — a rúd kezdőpontja: ${rudKezd} (Esc: mégse).` : ""} Billentyűk: Delete törli a kijelöltet, Ctrl+Z visszavon.</p>

      <div className="grid gap-4 lg:grid-cols-[1.55fr_1fr] [&>*]:min-w-0">
        <div className="min-w-0 space-y-3">
          <div className="racs-vilagos min-w-0 overflow-hidden rounded-xl border border-[color:var(--keret)]">
            <EpitoRajz allapot={all} kijelolt={kijelolt} gumi={gumi} rudKezd={rudKezd} mod={mod} svgRef={svgRef} onLe={le} onMozog={mozog} onFel={fel} onElem={elemKattint} allapotKod={jelzes.kod} />
          </div>
          {/* élő állapotjelző */}
          <div className={`rounded-xl border px-4 py-2.5 text-[13px] leading-relaxed ${jelSzin}`}>
            <p className="font-semibold">{jelzes.szoveg}</p>
            {jelzes.tipp && <p className="mt-0.5 text-[12.5px] opacity-90">{jelzes.tipp}</p>}
            {jelzes.e?.merleg && (
              <p className="szamok mt-0.5 text-[11.5px] opacity-80">
                fokszám-mérleg: {jelzes.e.merleg.ismeretlenek} ismeretlen (támaszok: {jelzes.e.merleg.tamaszFok}, kapcsolatok: {jelzes.e.merleg.ismeretlenek - jelzes.e.merleg.tamaszFok}) − {jelzes.e.merleg.egyenletek} egyenlet ({jelzes.e.merleg.testSzam} test × 3) = {jelzes.e.merleg.fok}
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={onTovabb} disabled={jelzes.kod !== "kesz"} className="rounded-lg bg-naracs-500 px-4 py-2 text-[13.5px] font-semibold text-white transition hover:bg-naracs-600 disabled:cursor-not-allowed disabled:opacity-40">
              Tovább a rajzoláshoz →
            </button>
            {jelzes.kod !== "kesz" && <span className="text-[12px] text-petrol-500">csak határozott, terhelt tartóval mehetsz tovább</span>}
          </div>
        </div>
        <EpitoPanel allapot={all} kijelolt={kijelolt} onValtoztat={valtoztat} onKijelol={setKijelolt} />
      </div>

      {/* sablonok */}
      <div className="min-w-0 rounded-xl border border-[color:var(--keret)] bg-white p-3">
        <p className="mb-1.5 text-[10.5px] font-bold tracking-[0.14em] text-petrol-500 uppercase">Sablonok — kattintásra betöltődnek, utána szabadon szerkeszthetők</p>
        <div className="flex flex-wrap gap-1.5">
          {SABLONOK.map((s) => (
            <button key={s.id} type="button" onClick={() => betolt(s.allapot)} title={s.leiras} className="rounded-full bg-petrol-50 px-2.5 py-1 text-[11.5px] font-medium text-petrol-700 ring-1 ring-petrol-200 transition hover:bg-naracs-50 hover:text-naracs-700 hover:ring-naracs-300">
              {s.nev} <span className="text-petrol-400">· {s.rovid}</span>
            </button>
          ))}
        </div>
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <span className="text-[12px] font-semibold text-petrol-700">Véletlen tartó:</span>
          {[1, 2, 3].map((fok) => (
            <button key={fok} type="button" onClick={() => { const v = veletlenTarto(fok); betolt(v.allapot); setUzenet(`Véletlen: ${v.nev}.`); }} className="rounded-lg bg-violet-50 px-2.5 py-1 text-[11.5px] font-medium text-violet-800 ring-1 ring-violet-200 transition hover:bg-violet-100">
              {fok}. {FOK_NEV[fok]}
            </button>
          ))}
        </div>
      </div>

      {/* mentés, megosztás */}
      <div className="min-w-0 rounded-xl border border-[color:var(--keret)] bg-white p-3">
        <p className="mb-1.5 text-[10.5px] font-bold tracking-[0.14em] text-petrol-500 uppercase">Mentés és megosztás</p>
        <div className="flex flex-wrap items-center gap-2">
          <input type="text" value={mentesNev} onChange={(e) => setMentesNev(e.target.value)} placeholder="a tartó neve" className="w-44 min-w-0 rounded-md border border-petrol-200 px-2 py-1 text-[12.5px] text-petrol-900 focus:border-petrol-500 focus:outline-none" />
          <button type="button" onClick={ment} disabled={all.rudak.length === 0} className="rounded-lg bg-petrol-800 px-3 py-1.5 text-[12.5px] font-semibold text-white transition hover:bg-petrol-900 disabled:opacity-40">Mentés a „Saját tartóim” közé</button>
          <button type="button" onClick={linkMasol} disabled={all.rudak.length === 0} className="rounded-lg bg-white px-3 py-1.5 text-[12.5px] font-medium text-petrol-700 ring-1 ring-petrol-200 transition hover:bg-petrol-50 disabled:opacity-40">Link másolása</button>
          {uzenet && <span className="text-[12px] text-emerald-700">{uzenet}</span>}
        </div>
        {mentettek.length > 0 && (
          <ul className="mt-2 grid gap-1 sm:grid-cols-2 [&>*]:min-w-0">
            {mentettek.map((s, i) => (
              <li key={`${s.datum}-${i}`} className="flex min-w-0 items-center gap-2 rounded-md bg-petrol-50/70 px-2 py-1 text-[12.5px]">
                <button type="button" onClick={() => { const a = ellenorzottAllapot(s.m); if (a) betolt(a); }} className="min-w-0 flex-1 truncate text-left font-medium text-petrol-800 hover:text-naracs-700">
                  {s.nev} <span className="font-normal text-petrol-500">· {s.leiras} · {new Date(s.datum).toLocaleDateString("hu-HU")}</span>
                </button>
                <button type="button" onClick={() => mentettTorol(i)} className="shrink-0 text-[11px] text-rose-600 hover:underline">törlés</button>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-1.5 text-[11.5px] text-petrol-500">A „Saját tartóim” a böngésződben marad (localStorage), a link a tartót magát hordozza (#m=…). Az utolsó állapot magától mentődik, újratöltéskor visszajön.</p>
      </div>
    </div>
  );
}
