"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import JatekKeret from "@/components/ui/JatekKeret";
import Rajzolo from "./Rajzolo";
import { veletlenTarto, hasznalhato, FOK_NEV } from "@/lib/epito/veletlen";
import { motorModell, ellenorzottAllapot } from "@/lib/epito/modell";

/*
 * Kihívás mód: öt kör, körönként egy véletlen (vagy a „Saját tartóim” közül húzott) tartó,
 * ugyanaz a Rajzoló + Ellenőrzés. A kör pontja az ELSŐ ellenőrzés pontja (segítség nélkül);
 * utána a kör még javítható tanulásra. A végén átlag és a leggyakoribb hibák listája.
 * A JatekKeret rögzíti a haladást és a hibanaplót (a cím állandó).
 */

const OSSZ_KOR = 5;
const CIM = "Kihívás: rajzold meg a saját tartód ábráit";
const KOD_NEV = {
  ertek: "rossz érték", elojel: "fordított előjel", ugras_hianyzik: "hiányzó ugrás", ugras_rossz: "rossz ugrás", ugras_felesleges: "fölösleges ugrás",
  csuklo_M: "nyomaték a csuklóban", szabad_veg: "szabad vég", tamasz_veg_M: "nyomaték a támasznál", alak: "rossz alak", meredekseg: "M-lejtés ≠ V", szelso: "szélsőérték", sarok: "sarok", reakcio: "reakció",
};

function sajatTartok() {
  if (typeof window === "undefined") return [];
  try {
    const t = JSON.parse(window.localStorage.getItem("statika-epito-mentett") || "[]");
    return Array.isArray(t) ? t : [];
  } catch {
    return [];
  }
}

export default function Kihivas() {
  const [fok, setFok] = useState(1);
  const [kor, setKor] = useState(1);
  const [feladat, setFeladat] = useState(null); // { nev, allapot, e }
  const [pontok, setPontok] = useState([]);
  const [hibaKodok, setHibaKodok] = useState([]);
  const [korPont, setKorPont] = useState(null);
  const [kesz, setKesz] = useState(false);
  const [sajatDb, setSajatDb] = useState(0);
  const [elindult, setElindult] = useState(false);

  useEffect(() => { setSajatDb(sajatTartok().filter((s) => hasznalhato(ellenorzottAllapot(s.m)).ok).length); }, []);

  const ujFeladat = useCallback((f) => {
    if (f === "sajat") {
      const lista = sajatTartok().map((s) => ({ nev: s.nev, allapot: ellenorzottAllapot(s.m) })).filter((s) => s.allapot && hasznalhato(s.allapot).ok);
      if (lista.length) {
        const v = lista[Math.floor(Math.random() * lista.length)];
        return { nev: `saját tartó: ${v.nev}`, allapot: v.allapot, e: hasznalhato(v.allapot).e };
      }
      return veletlenTarto(2);
    }
    return veletlenTarto(f);
  }, []);

  const indit = (f) => {
    setFok(f);
    setKor(1);
    setPontok([]);
    setHibaKodok([]);
    setKorPont(null);
    setKesz(false);
    setFeladat(ujFeladat(f));
    setElindult(true);
  };
  const ellenorzes = (eredmeny, probak) => {
    if (probak !== 1) return;
    setKorPont(eredmeny.pont);
    setPontok((l) => [...l, eredmeny.pont]);
    setHibaKodok((l) => [...l, ...eredmeny.hibak.map((h) => h.kod)]);
  };
  const kovetkezo = () => {
    if (kor >= OSSZ_KOR) { setKesz(true); return; }
    setKor(kor + 1);
    setKorPont(null);
    setFeladat(ujFeladat(fok));
  };
  const ujJatek = () => indit(fok);

  const modell = useMemo(() => (feladat ? motorModell(feladat.allapot) : null), [feladat]);
  const atlag = pontok.length ? pontok.reduce((s, p) => s + p, 0) / pontok.length : 0;
  const gyakoriak = useMemo(() => {
    const db = {};
    for (const k of hibaKodok) db[k] = (db[k] ?? 0) + 1;
    return Object.entries(db).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [hibaKodok]);

  let uzenet = null;
  if (!elindult) uzenet = "Válassz nehézséget, és indítsd a kihívást: öt kör, körönként egy új tartó. A kör pontja az első ellenőrzés pontja — segítség nélkül. Utána még javíthatsz tanulásra.";
  else if (feladat && korPont === null) uzenet = <><strong>{kor}. kör – {feladat.nev}.</strong> Rajzold meg a V és M ábrát, majd „Ellenőrzés”. Az első ellenőrzés számít a pontba.</>;
  else if (feladat) uzenet = <><span className="szamok font-semibold">{korPont} pont</span> ebben a körben (az első próbálkozás). Javíthatsz még segítséggel — az már nem számít —, vagy jöhet a következő kör. {pontok.length > 0 && <span className="szamok text-petrol-500">eddig: {pontok.join(" · ")}</span>}</>;

  return (
    <JatekKeret cim={CIM} leiras="Öt kör, körönként egy véletlen tartó a választott nehézségen (vagy a „Saját tartóim” közül). Ugyanaz a rajzoló és ellenőrzés, mint fent — a kör pontja az első ellenőrzésé, segítség nélkül." pont={atlag} kor={kor} osszKor={OSSZ_KOR} kesz={kesz} onUj={ujJatek} uzenet={uzenet}>
      {(!elindult || kesz) && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[12.5px] font-semibold text-petrol-700">Nehézség:</span>
          {[1, 2, 3].map((f) => (
            <button key={f} type="button" onClick={() => indit(f)} className={`rounded-lg px-3 py-1.5 text-[12.5px] font-semibold transition ${fok === f && elindult ? "bg-petrol-800 text-white" : "bg-white text-petrol-700 ring-1 ring-petrol-200 hover:bg-petrol-50"}`}>
              {f}. {FOK_NEV[f]}
            </button>
          ))}
          <button type="button" onClick={() => indit("sajat")} disabled={sajatDb === 0} className="rounded-lg bg-violet-50 px-3 py-1.5 text-[12.5px] font-semibold text-violet-800 ring-1 ring-violet-200 transition hover:bg-violet-100 disabled:opacity-40" title={sajatDb === 0 ? "Előbb ments el egy határozott, terhelt tartót az építőben." : ""}>
            Saját tartóim ({sajatDb})
          </button>
        </div>
      )}
      {elindult && !kesz && feladat && modell && (
        <div className="mt-3">
          <Rajzolo
            e={feladat.e}
            modell={modell}
            nev={feladat.nev}
            kihivas
            onEllenorzes={ellenorzes}
            gyerekek={korPont !== null && (
              <button type="button" onClick={kovetkezo} className="rounded-lg bg-naracs-500 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-naracs-600">
                {kor >= OSSZ_KOR ? "Eredmény" : "Következő kör →"}
              </button>
            )}
          />
        </div>
      )}
      {kesz && (
        <div className="mt-3 grid gap-3 sm:grid-cols-2 [&>*]:min-w-0">
          <div className="rounded-xl border border-[color:var(--keret)] bg-white p-3">
            <p className="text-[10.5px] font-bold tracking-[0.14em] text-petrol-500 uppercase">A körök</p>
            <p className="szamok mt-1 text-[13px] text-petrol-800">{pontok.map((p, i) => `${i + 1}. kör: ${p}`).join(" · ")}</p>
            <p className="szamok mt-1 text-[14px] font-semibold text-petrol-900">Átlag: {Math.round(atlag)} pont</p>
          </div>
          <div className="rounded-xl border border-[color:var(--keret)] bg-white p-3">
            <p className="text-[10.5px] font-bold tracking-[0.14em] text-petrol-500 uppercase">Leggyakoribb hibáid</p>
            {gyakoriak.length === 0 ? (
              <p className="mt-1 text-[13px] text-emerald-700">Egyetlen hiba sem — hibátlan sorozat!</p>
            ) : (
              <ul className="mt-1 space-y-0.5 text-[13px] text-petrol-800">
                {gyakoriak.map(([k, db]) => (
                  <li key={k}><span className="szamok font-semibold">{db}×</span> {KOD_NEV[k] ?? k}</li>
                ))}
              </ul>
            )}
            <p className="mt-1.5 text-[11.5px] text-petrol-500">Ezekre nézz rá a puskában, és építs olyan tartót, ahol pont ez a szabály dönt.</p>
          </div>
        </div>
      )}
    </JatekKeret>
  );
}
