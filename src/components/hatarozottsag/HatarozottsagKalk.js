"use client";

import { useMemo, useState } from "react";
import { M, MB } from "@/components/ui/Keplet";
import Merleg from "./Merleg";
import { szamlal, racsosSzamlal, FOKSZAM } from "@/lib/hatarozottsag";

/*
 * Határozottság-számláló: testek száma, belső csuklók / rudak, támaszok listája → e, i, mérleg és ítélet,
 * a tankönyv 7.3.1 szerinti levezetéssel. Rácsos üzemmód: c, r, k → 2c = r + k. Térbeli üzemmód: 6 egyenlet testenként.
 */

function Szam({ cimke, ertek, min = 0, max = 20, onChange, sugo }) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between">
        <span className="text-[12.5px] font-medium text-petrol-600">{cimke}</span>
        {sugo && <span className="text-[11px] text-petrol-400">{sugo}</span>}
      </span>
      <div className="mt-1 flex items-center gap-1.5">
        <button type="button" onClick={() => onChange(Math.max(min, ertek - 1))} className="h-8 w-8 rounded-lg bg-petrol-50 text-[15px] font-bold text-petrol-700 ring-1 ring-petrol-200 hover:bg-petrol-100">
          −
        </button>
        <input type="number" min={min} max={max} value={ertek} onChange={(e) => onChange(Math.max(min, Math.min(max, Number(e.target.value) || 0)))} className="szamok h-8 w-16 rounded-lg border border-petrol-200 bg-white text-center text-[14px] font-semibold text-petrol-900" />
        <button type="button" onClick={() => onChange(Math.min(max, ertek + 1))} className="h-8 w-8 rounded-lg bg-petrol-50 text-[15px] font-bold text-petrol-700 ring-1 ring-petrol-200 hover:bg-petrol-100">
          +
        </button>
      </div>
    </label>
  );
}

export default function HatarozottsagKalk() {
  const [mod, setMod] = useState("testek");
  const [terben, setTerben] = useState(false);
  const [testek, setTestek] = useState(2);
  const [gorgo, setGorgo] = useState(1);
  const [rud, setRud] = useState(0);
  const [csuklo, setCsuklo] = useState(1);
  const [befogas, setBefogas] = useState(0);
  const [terFok, setTerFok] = useState(6);
  const [bcs2, setBcs2] = useState(1);
  const [bcs3, setBcs3] = useState(0);
  const [brud, setBrud] = useState(0);
  const [terhelt, setTerhelt] = useState(0);
  // rácsos
  const [c, setC] = useState(6);
  const [r, setR] = useState(9);
  const [rcs, setRcs] = useState(1);
  const [rg, setRg] = useState(1);

  const eredm = useMemo(() => {
    if (mod === "racsos") return racsosSzamlal({ c, r, k: 2 * rcs + rg, terben });
    const tamaszok = [
      ...Array.from({ length: gorgo }, () => "gorgo"),
      ...Array.from({ length: rud }, () => "rud"),
      ...Array.from({ length: csuklo }, () => "csuklo"),
      ...Array.from({ length: befogas }, () => "befogas"),
    ];
    if (terben) return szamlal({ testek, tamaszok: [{ fokszam: terFok }], belsoCsuklok: [], belsoRudak: 0, terben: true });
    return szamlal({ testek, tamaszok, belsoCsuklok: [...Array.from({ length: bcs2 }, () => 2), ...Array.from({ length: bcs3 }, () => 3)], belsoRudak: brud, terheltCsuklok: terhelt });
  }, [mod, terben, testek, gorgo, rud, csuklo, befogas, terFok, bcs2, bcs3, brud, terhelt, c, r, rcs, rg]);

  const e = eredm.e;
  const i = eredm.i;
  const kul = i - e;
  const itelet = kul === 0 ? null : kul > 0 ? { tipus: "hatarozatlan", folos: kul, szabad: 0 } : { tipus: "tulhatarozott", szabad: -kul, folos: 0 };

  return (
    <div className="rounded-2xl border border-[color:var(--keret)] bg-white p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {[
          ["testek", "Testek és kényszerek"],
          ["racsos", "Rácsos tartó"],
        ].map(([m, cim]) => (
          <button key={m} type="button" onClick={() => setMod(m)} className={`rounded-lg px-3 py-1.5 text-[12.5px] font-semibold transition ${mod === m ? "bg-petrol-800 text-white" : "bg-petrol-50 text-petrol-700 ring-1 ring-petrol-200 hover:bg-petrol-100"}`}>
            {cim}
          </button>
        ))}
        <label className="ml-auto flex items-center gap-2 text-[12.5px] text-petrol-600">
          <input type="checkbox" checked={terben} onChange={(ev) => setTerben(ev.target.checked)} className="h-4 w-4 accent-[color:var(--color-naracs-500)]" />
          térbeli szerkezet ({mod === "racsos" ? "3c" : "6 egyenlet / test"})
        </label>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
        <div className="min-w-0 space-y-3">
          {mod === "testek" ? (
            <>
              <Szam cimke="Merev testek száma" ertek={testek} min={1} max={12} onChange={setTestek} sugo={terben ? "×6 egyenlet" : "×3 egyenlet"} />
              {terben ? (
                <Szam cimke="A kényszerek fokszámának összege" ertek={terFok} min={0} max={60} onChange={setTerFok} sugo="térbeli csukló 3, befogás 6, rúd 1" />
              ) : (
                <>
                  <p className="mt-2 text-[10.5px] font-bold tracking-[0.14em] text-petrol-500 uppercase">külső kényszerek</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Szam cimke="Görgő (1)" ertek={gorgo} onChange={setGorgo} />
                    <Szam cimke="Támasztórúd (1)" ertek={rud} onChange={setRud} />
                    <Szam cimke="Csukló (2)" ertek={csuklo} onChange={setCsuklo} />
                    <Szam cimke="Befogás (3)" ertek={befogas} onChange={setBefogas} />
                  </div>
                  <p className="mt-2 text-[10.5px] font-bold tracking-[0.14em] text-petrol-500 uppercase">belső kapcsolatok</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Szam cimke="Belső csukló, 2 testet kapcsol (2)" ertek={bcs2} onChange={setBcs2} />
                    <Szam cimke="Belső csukló, 3 testet kapcsol (4)" ertek={bcs3} onChange={setBcs3} />
                    <Szam cimke="Belső rúd (1)" ertek={brud} onChange={setBrud} />
                    <Szam cimke="Terhelt belső csukló (+2 egyenlet, +2 ismeretlen)" ertek={terhelt} max={bcs2 + bcs3} onChange={setTerhelt} />
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <Szam cimke="Csomópontok (csuklók) száma · c" ertek={c} min={2} max={60} onChange={setC} sugo={terben ? "×3 egyenlet" : "×2 egyenlet"} />
              <Szam cimke="Rudak száma · r" ertek={r} min={1} max={150} onChange={setR} />
              <div className="grid grid-cols-2 gap-3">
                <Szam cimke="Külső csukló (2)" ertek={rcs} onChange={setRcs} />
                <Szam cimke="Külső görgő / rúd (1)" ertek={rg} onChange={setRg} />
              </div>
            </>
          )}
        </div>

        <div className="min-w-0 space-y-3">
          <Merleg e={e} i={i} itelet={itelet} eReszek={mod === "racsos" ? [{ cimke: `${terben ? 3 : 2}·c = ${terben ? 3 : 2}·${c}`, db: e }] : [{ cimke: `${terben ? 6 : 3}·${testek} test${terhelt ? ` + 2·${terhelt} terhelt csukló` : ""}`, db: e }]} iReszek={mod === "racsos" ? [{ cimke: `r = ${r}`, db: r }, { cimke: `k = ${2 * rcs + rg}`, db: 2 * rcs + rg }] : [{ cimke: "külső", db: eredm.tamaszFok }, { cimke: "belső", db: eredm.belsoFok }]} />
          <div className="rounded-xl bg-petrol-50/70 p-3 text-[13px] leading-relaxed text-petrol-700">
            <p className="mb-1 text-[10.5px] font-bold tracking-[0.14em] text-petrol-500 uppercase">levezetés</p>
            {mod === "racsos" ? (
              <>
                <MB>{`e = ${terben ? 3 : 2}c = ${terben ? 3 : 2}\\cdot ${c} = ${e},\\qquad i = r + k = ${r} + ${2 * rcs + rg} = ${i}`}</MB>
              </>
            ) : terben ? (
              <MB>{`e = 6\\cdot ${testek} = ${e},\\qquad i = ${i}`}</MB>
            ) : (
              <>
                <MB>{`e = 3\\cdot ${testek}${terhelt ? ` + 2\\cdot ${terhelt}` : ""} = ${e}`}</MB>
                <MB>{`i = \\underbrace{${gorgo}\\cdot 1 + ${rud}\\cdot 1 + ${csuklo}\\cdot 2 + ${befogas}\\cdot 3}_{\\text{külső} = ${eredm.tamaszFok}} + \\underbrace{${bcs2}\\cdot 2 + ${bcs3}\\cdot 4 + ${brud}\\cdot 1${terhelt ? ` + ${terhelt}\\cdot 2` : ""}}_{\\text{belső} = ${eredm.belsoFok}} = ${i}`}</MB>
              </>
            )}
            <p className="mt-2">
              <strong>Elsődleges következtetés (7.3.1):</strong> {eredm.elsodleges.szoveg}
            </p>
            {kul === 0 && (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[12.5px]">
                <li>
                  A számlálás <em>szükséges, de nem elégséges</em>: ellenőrizd a geometriát — nincs-e három párhuzamos vagy egy ponton átmenő hatásvonal egy testen, három egy egyenesbe eső csukló, görgő, amelynek hatásvonala átmegy a csuklón.
                </li>
                <li>Keress egyismeretlenes menetrendet (vagy fejtsd le a csukló + görgővel megtámasztott részeket): ha végigér, a szerkezet határozott.</li>
                {mod === "racsos" && <li>Rácsos tartón: háromszögekből felépíthető-e (új csukló mindig két új, nem egy egyenesbe eső rúddal), és a kapott merev test(ek) jól vannak-e megtámasztva?</li>}
              </ul>
            )}
            {kul > 0 && (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[12.5px]">
                <li>
                  Ha mozgás nincs, a tartó <strong>{kul}-szeresen határozatlan</strong>: a reakciók csak a merevség (alakváltozás) figyelembevételével számíthatók. Törzstartó: {kul} fölös kényszer elvétele — ökölszabályok: párhuzamos vagy közös metszéspontú reakciókból legfeljebb kettőt tarts meg; ha
                  ismeretlen nyomaték is hat a testre, a párhuzamos reakciókból legfeljebb egyet; ha egy kivételével minden ismeretlen párhuzamos, a kivételt ne vedd el.
                </li>
                <li>Az {kul} csak a fölös kényszerek és a szabad mozgások <em>különbsége</em>: kritikus elrendezésnél egyszerre lehet határozatlan és túlhatározott (pl. négy párhuzamos görgő).</li>
              </ul>
            )}
            {kul < 0 && (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[12.5px]">
                <li>
                  Legalább {-kul} szabad mozgás: a szerkezet <strong>túlhatározott</strong> (mechanizmus), létezik teher, amelyre nincs egyensúly. Legalább {-kul} fokszámú kényszer hiányzik — de a helye is számít.
                </li>
              </ul>
            )}
          </div>
          <div className="szamok rounded-xl border border-[color:var(--keret)] bg-white p-3 text-[12.5px] text-petrol-600">
            <p className="mb-1 text-[10.5px] font-bold tracking-[0.14em] text-petrol-500 uppercase">fokszám-emlékeztető</p>
            <p>
              görgő {FOKSZAM.gorgo} · támasztórúd {FOKSZAM.rud} · csukló {FOKSZAM.csuklo} · befogás {FOKSZAM.befogas} · belső csukló <M>{"2\\,(n-1)"}</M> (n test) · belső rúd 1 · térben: csukló 3, befogás 6, rúd 1; testenként 6 egyenlet, rácsos tartón <M>{"3c"}</M>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
