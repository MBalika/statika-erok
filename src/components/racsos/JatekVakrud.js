"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import JatekKeret from "@/components/ui/JatekKeret";
import { sz } from "@/lib/szamok";
import { racsosMegold, sablon } from "@/lib/racsos";
import RacsosRajz, { RACS_SZIN } from "./RacsosRajz";

/*
 * Vakrúd-vadász: 5 kör, körönként egy véletlen rácsos tartó véletlen csomóponti terhekkel.
 * A hallgató 30 másodperc alatt rákattint azokra a rudakra, amelyekben szerinte nem ébred erő,
 * majd ellenőriz. Pont körönként: 100 · (talált − hibás) / összes vakrúd (0-nál levágva);
 * ha nincs vakrúd, a „nincs vakrúd” gomb ér 100-at. A végén a körök átlaga.
 */

const OSSZ_KOR = 5;
const IDO = 30;
const egesz = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
const valaszt = (t) => t[Math.floor(Math.random() * t.length)];

function ujKor(kor) {
  for (let proba = 0; proba < 60; proba++) {
    const tip = valaszt(["parhuzamos", "parhuzamos", "parhuzamos", "warren", "haromszog", "k"]);
    const n = tip === "k" ? valaszt([3, 4]) : tip === "haromszog" ? valaszt([4, 6]) : egesz(3, 6);
    const racs = valaszt(["V", "N", "Z"]);
    const m = sablon(tip, { n, a: 2, h: tip === "k" ? 1 : valaszt([1.5, 2]), racs });
    const jeloltek = [...m.felso, ...m.also].filter((id) => !m.tamaszok.some((t) => t.csomopont === id));
    const db = kor >= 4 ? 2 : valaszt([1, 1, 2]);
    const terhek = [];
    const hasznalt = new Set();
    for (let i = 0; i < db; i++) {
      const cs = valaszt(jeloltek.filter((id) => !hasznalt.has(id)));
      if (!cs) break;
      hasznalt.add(cs);
      const F = egesz(4, 20);
      const ferde = kor >= 3 && Math.random() < 0.4;
      const szog = ferde ? valaszt([-60, -120, -45, -135, 0, 180]) : -90;
      terhek.push({ csomopont: cs, Fx: F * Math.cos((szog * Math.PI) / 180), Fy: F * Math.sin((szog * Math.PI) / 180) });
    }
    // néha vízszintes teher a támaszra (A_x!) – kihagyjuk; néha ferde görgő?
    m.terhek = terhek;
    const e = racsosMegold(m);
    if (!e.ok) continue;
    const vakok = e.rudTabla.filter((r) => Math.abs(r.S) < 1e-9).map((r) => r.id);
    if (vakok.length === 0 && Math.random() < 0.8) continue; // ritkán engedjük a „nincs vakrúd” esetet
    if (vakok.length > 7) continue;
    return { modell: m, e, vakok };
  }
  const m = sablon("parhuzamos", { n: 4, a: 2, h: 1.5, racs: "V" });
  m.terhek = [{ csomopont: "3", Fx: 0, Fy: -10 }];
  const e = racsosMegold(m);
  return { modell: m, e, vakok: e.rudTabla.filter((r) => Math.abs(r.S) < 1e-9).map((r) => r.id) };
}

export default function JatekVakrud() {
  const [kor, setKor] = useState(1);
  const [adat, setAdat] = useState(null);
  const [fazis, setFazis] = useState("valaszt"); // valaszt | ellenoriz | kesz
  const [jelolt, setJelolt] = useState(new Set());
  const [pontok, setPontok] = useState([]);
  const [hatra, setHatra] = useState(IDO);
  const idoRef = useRef(null);

  useEffect(() => {
    setAdat(ujKor(1));
  }, []);

  const ellenoriz = useCallback(
    (nincs = false) => {
      if (!adat || fazis !== "valaszt") return;
      const vak = new Set(adat.vakok);
      const jel = nincs ? new Set() : jelolt;
      const talalt = [...jel].filter((id) => vak.has(id)).length;
      const hibas = [...jel].filter((id) => !vak.has(id)).length;
      let pont;
      if (vak.size === 0) pont = jel.size === 0 ? 100 : Math.max(0, 100 - 25 * hibas);
      else pont = Math.max(0, Math.round((100 * (talalt - hibas)) / vak.size));
      setPontok((p) => [...p, pont]);
      setFazis("ellenoriz");
    },
    [adat, fazis, jelolt],
  );

  // időzítő
  useEffect(() => {
    if (fazis !== "valaszt" || !adat) return undefined;
    setHatra(IDO);
    const kezdet = Date.now();
    idoRef.current = setInterval(() => {
      const h = IDO - (Date.now() - kezdet) / 1000;
      setHatra(Math.max(0, h));
      if (h <= 0) {
        clearInterval(idoRef.current);
        ellenoriz();
      }
    }, 100);
    return () => clearInterval(idoRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fazis, adat]);

  const kattint = (id) => {
    if (fazis !== "valaszt") return;
    setJelolt((s) => {
      const u = new Set(s);
      if (u.has(id)) u.delete(id);
      else u.add(id);
      return u;
    });
  };

  const kovetkezo = () => {
    if (kor >= OSSZ_KOR) {
      setFazis("kesz");
      return;
    }
    const uj = kor + 1;
    setKor(uj);
    setAdat(ujKor(uj));
    setJelolt(new Set());
    setFazis("valaszt");
  };

  const ujJatek = useCallback(() => {
    setKor(1);
    setPontok([]);
    setJelolt(new Set());
    setAdat(ujKor(1));
    setFazis("valaszt");
  }, []);

  const atlag = pontok.length ? pontok.reduce((s, p) => s + p, 0) / pontok.length : 0;
  const kesz = fazis === "kesz";
  const ellenorizve = fazis !== "valaszt";
  const utolsoPont = pontok[pontok.length - 1];
  const vak = useMemo(() => new Set(adat?.vakok ?? []), [adat]);
  const indokok = adat?.e.vakrudIndokok ?? [];

  let uzenet = null;
  if (adat && fazis === "valaszt") {
    uzenet = (
      <>
        Kattints a rudakra, amelyekben <strong>szerinted nem ébred erő</strong> (vakrudak), aztán ellenőrizd. Gondolkodj csomópontonként: terheletlen csomópont két rúddal, két egy egyenesbe eső rúd + egy harmadik, teher a rúd egyenesében — és amit egy vakrúd „felszabadít”, az továbbgyűrűzik.{" "}
        {kor >= 3 ? "Haladó kör: ferde teher is lehet — a reakció irányára is figyelj!" : ""}
      </>
    );
  } else if (adat && ellenorizve) {
    const talalt = [...jelolt].filter((id) => vak.has(id));
    const hibas = [...jelolt].filter((id) => !vak.has(id));
    const kimaradt = [...vak].filter((id) => !jelolt.has(id));
    uzenet = (
      <div>
        <p>
          <span className="szamok">{utolsoPont} pont.</span> Vakrudak: <strong>{vak.size ? [...vak].map((id) => `S${id}`).join(", ") : "nincs"}</strong>. Találat: {talalt.length}
          {hibas.length ? <>, téves: <span className="text-rose-700">{hibas.map((id) => `S${id}`).join(", ")}</span></> : null}
          {kimaradt.length ? <>, kimaradt: <span className="text-petrol-600">{kimaradt.map((id) => `S${id}`).join(", ")}</span></> : null}.
        </p>
        {indokok.length > 0 && (
          <ul className="mt-1.5 list-disc space-y-0.5 pl-5 text-[12.5px] text-petrol-600">
            {indokok.slice(0, 6).map((v, i) => (
              <li key={i}>{v.szoveg}</li>
            ))}
            {vak.size > indokok.reduce((s, v) => s + (v.rudak?.length ?? 1), 0) && <li>A többi vakrúd a három alapesetből nem következik közvetlenül (pl. szimmetria vagy a teljes megoldás mutatja) — ezeket a csomóponti módszer adja ki.</li>}
          </ul>
        )}
      </div>
    );
  }

  return (
    <JatekKeret
      cim="Vakrúd-vadász"
      leiras="Öt véletlen rácsos tartó. Találd meg időre az összes vakrudat: kattints rájuk, majd ellenőrizz. A téves kattintás pontot von le, a kimaradt vakrúd nem ad pontot."
      pont={atlag}
      kor={kor}
      osszKor={OSSZ_KOR}
      kesz={kesz}
      onUj={ujJatek}
      uzenet={uzenet}
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
        <div className="racs-vilagos min-w-0 overflow-hidden rounded-xl border border-[color:var(--keret)] p-2">
          {adat && (
            <RacsosRajz
              modell={adat.modell}
              eredmeny={ellenorizve ? adat.e : null}
              szinez={ellenorizve}
              kiemeltRudak={fazis === "valaszt" ? jelolt : []}
              onRud={fazis === "valaszt" ? kattint : undefined}
              csomopontCimkek={false}
              magassag={330}
              atmenet
              extra={(kx, ky) =>
                ellenorizve ? (
                  <g>
                    {adat.modell.rudak.map((r) => {
                      const a = adat.modell.csomopontok.find((c) => c.id === r.a);
                      const b = adat.modell.csomopontok.find((c) => c.id === r.b);
                      const mx = (kx(a.x) + kx(b.x)) / 2;
                      const my = (ky(a.y) + ky(b.y)) / 2;
                      const jel = jelolt.has(r.id);
                      const v = vak.has(r.id);
                      if (!jel && !v) return null;
                      const szin = jel && v ? "#15803d" : jel ? "#be123c" : "#f59e0b";
                      return (
                        <g key={r.id}>
                          <circle cx={mx} cy={my} r="10" fill="white" stroke={szin} strokeWidth="2.2" />
                          <text x={mx} y={my + 4} textAnchor="middle" fontSize="12" fontWeight="800" style={{ fill: szin }}>
                            {jel && v ? "✓" : jel ? "✗" : "!"}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                ) : null
              }
            />
          )}
          {fazis === "valaszt" && (
            <div className="mx-2 mb-1 h-1.5 overflow-hidden rounded-full bg-petrol-100">
              <div className="h-full rounded-full transition-[width] duration-100" style={{ width: `${(100 * hatra) / IDO}%`, background: hatra < 8 ? "#be123c" : "#e2590a" }} />
            </div>
          )}
        </div>
        <div className="min-w-0 space-y-3">
          <div className="szamok rounded-xl bg-petrol-50 p-3 text-[12.5px] text-petrol-700">
            <p>
              hátralévő idő: <strong>{sz(hatra, 0)} s</strong>
            </p>
            <p className="mt-1">
              kijelölt rudak: <strong>{jelolt.size}</strong>
              {jelolt.size ? ` (${[...jelolt].map((id) => `S${id}`).join(", ")})` : ""}
            </p>
            <p className="mt-1 text-[11.5px] text-petrol-500">
              {adat?.modell.rudak.length} rúd, {adat?.modell.csomopontok.length} csomópont
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {fazis === "valaszt" && (
              <>
                <button type="button" onClick={() => ellenoriz(false)} className="rounded-lg bg-naracs-500 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-naracs-600">
                  Ellenőrzés
                </button>
                <button type="button" onClick={() => ellenoriz(true)} className="rounded-lg bg-white px-3 py-2 text-[12.5px] font-semibold text-petrol-700 ring-1 ring-petrol-200 transition hover:bg-petrol-50">
                  Nincs vakrúd
                </button>
              </>
            )}
            {fazis === "ellenoriz" && (
              <button type="button" onClick={kovetkezo} className="rounded-lg bg-petrol-800 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-petrol-900">
                {kor >= OSSZ_KOR ? "Eredmény" : "Következő kör →"}
              </button>
            )}
          </div>
          {ellenorizve && (
            <div className="flex flex-wrap gap-2 text-[11.5px] text-petrol-500">
              <span className="flex items-center gap-1"><span className="inline-block h-1.5 w-5 rounded" style={{ background: RACS_SZIN.huzott }} /> húzott</span>
              <span className="flex items-center gap-1"><span className="inline-block h-1.5 w-5 rounded" style={{ background: RACS_SZIN.nyomott }} /> nyomott</span>
              <span className="flex items-center gap-1"><span className="inline-block h-1.5 w-5 rounded" style={{ background: RACS_SZIN.vak }} /> vakrúd</span>
            </div>
          )}
          {pontok.length > 0 && <p className="szamok text-[12px] text-petrol-500">eddigi körök pontjai: {pontok.join(" · ")}</p>}
        </div>
      </div>
    </JatekKeret>
  );
}
