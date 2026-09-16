"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useHibanaplo, hibaMegoldva, hibaTorol, hibakTorles, TIPUS_NEV, JAVITAS_CEL } from "@/lib/hibanaplo";
import { generatorCimAlapjan, kvizKerdesAlapjan, hibakeresoCimAlapjan } from "@/lib/generatorok";
import { modulSlugAlapjan } from "@/lib/oldalterkep";
import GyakorloDoboz from "@/components/GyakorloDoboz";
import Kviz from "@/components/Kviz";
import Hibakereso from "@/components/Hibakereso";
import { M } from "@/components/ui/Keplet";

/*
 * Hibanapló: amit a hallgató elrontott (gyakorló feladat, kvízkérdés, hibakereső,
 * gyenge játékkör), az itt gyűlik modulonként, és az „Ismételd a hibáidat” mód
 * sorban újra felteszi ugyanazt a típust. Két sikeres ismétlés után a hiba „javítva”.
 */

const TIPUS_SZIN = {
  feladat: "bg-petrol-100 text-petrol-700",
  kviz: "bg-violet-100 text-violet-700",
  hibakereso: "bg-rose-100 text-rose-700",
  jatek: "bg-naracs-100 text-naracs-700",
};

function datumSzoveg(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("hu-HU", { month: "short", day: "numeric" }) + " " + d.toLocaleTimeString("hu-HU", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

/** Kis jelvény a kezdőlapra / fejlécbe: hány nyitott hiba van. */
export function HibanaploJelveny({ className = "" }) {
  const { nyitott, betoltve } = useHibanaplo();
  if (!betoltve || nyitott.length === 0) return null;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-bold text-rose-700 ${className}`} title="Nyitott hibák a hibanaplóban">
      {nyitott.length}
    </span>
  );
}

/** Kis kártya a kezdőlapra: nyitott hibák száma + link. */
export function HibanaploKartya() {
  const { lista, nyitott, betoltve } = useHibanaplo();
  if (!betoltve) return null;
  const javitva = lista.filter((h) => h.kesz).length;
  return (
    <Link
      href="/hibanaplo"
      className="group flex items-center gap-4 rounded-2xl border border-[color:var(--keret)] bg-white p-4 transition hover:border-petrol-300 hover:shadow-lg hover:shadow-petrol-900/5"
    >
      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-[17px] font-bold text-white ${nyitott.length ? "bg-linear-to-br from-rose-600 to-rose-500" : "bg-linear-to-br from-emerald-600 to-emerald-500"}`}>
        {nyitott.length}
      </span>
      <div className="min-w-0">
        <p className="text-[15px] font-semibold text-petrol-900">Hibanapló</p>
        <p className="text-[12.5px] text-petrol-600">
          {nyitott.length === 0
            ? javitva
              ? `Minden hibád javítva (${javitva}) — szép munka.`
              : "Még nincs benne semmi. Amit elrontasz, ide kerül, és itt ismételheted."
            : `${nyitott.length} nyitott hiba vár ismétlésre${javitva ? `, ${javitva} már javítva` : ""}.`}
        </p>
      </div>
      <span className="ml-auto hidden text-[13px] font-semibold text-naracs-600 opacity-0 transition group-hover:opacity-100 sm:inline">Megnyitás →</span>
    </Link>
  );
}

/* ---------- egy hiba ismétlése ---------- */

function Ismetlo({ hiba, onKesz }) {
  const [eredmeny, setEredmeny] = useState(null); // true / false
  const modulNev = modulSlugAlapjan(hiba.modul)?.cim ?? hiba.modul;

  const tartalom = (() => {
    if (hiba.tipus === "feladat") {
      const g = generatorCimAlapjan(hiba.azonosito, hiba.modul);
      if (!g) return <Hianyzik hiba={hiba} />;
      return (
        <GyakorloDoboz
          cim={g.cim}
          leiras={`Ugyanaz a feladattípus új számokkal (${modulNev}).`}
          generator={g.fn}
          modul={hiba.modul}
          azonosito={hiba.azonosito}
          onEredmeny={(jo) => setEredmeny(jo)}
        />
      );
    }
    if (hiba.tipus === "kviz") {
      const q = kvizKerdesAlapjan(hiba.azonosito, hiba.modul) ?? (hiba.reszlet?.v ? { k: hiba.reszlet.k, v: hiba.reszlet.v, helyes: hiba.reszlet.helyes, magyarazat: hiba.reszlet.magyarazat } : null);
      if (!q) return <Hianyzik hiba={hiba} />;
      return (
        <Kviz
          cim="A kérdés még egyszer"
          leiras={`${modulNev} — ezt rontottad el ${hiba.db > 1 ? `${hiba.db}-szor` : "egyszer"}.`}
          kerdesek={[q]}
          modul={hiba.modul}
          haladas={false}
          onValasz={(jo) => setEredmeny(jo)}
        />
      );
    }
    if (hiba.tipus === "hibakereso") {
      const f = hibakeresoCimAlapjan(hiba.azonosito, hiba.modul);
      if (!f) return <Hianyzik hiba={hiba} />;
      return <Hibakereso feladatok={[f]} cim="Hibakereső — még egyszer" modul={hiba.modul} onEredmeny={(elsore) => setEredmeny(elsore)} />;
    }
    return (
      <div className="rounded-2xl border border-naracs-200 bg-naracs-50 p-5 text-[14px] text-petrol-800">
        <p>
          A(z) <strong>{hiba.cim}</strong> játékban {typeof hiba.reszlet === "number" ? `${hiba.reszlet} pontot értél el` : "gyenge kör volt"}. A játékot a modul oldalán játszhatod újra; 60 pont fölött a hiba javítottnak számít.
        </p>
        <Link href={`${hiba.modul}#gyakorlas`} className="mt-3 inline-block rounded-lg bg-petrol-800 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-petrol-700">
          Irány a játék →
        </Link>
      </div>
    );
  })();

  return (
    <div>
      {tartalom}
      {eredmeny !== null && (
        <div className={`mt-3 flex flex-wrap items-center gap-3 rounded-xl px-4 py-3 text-[13.5px] ${eredmeny ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"}`}>
          <span>
            {eredmeny
              ? hiba.javitva + 1 >= JAVITAS_CEL
                ? "Sikerült — ez a hiba javítva, kikerül a listából."
                : `Sikerült — még ${JAVITAS_CEL - hiba.javitva - 1} sikeres ismétlés, és javítva.`
              : "Még nem ment. Nézd át a levezetést, aztán jöhet a következő."}
          </span>
          <button type="button" onClick={onKesz} className="ml-auto rounded-lg bg-white px-3 py-1.5 text-[12.5px] font-semibold text-petrol-800 ring-1 ring-petrol-200 transition hover:bg-petrol-50">
            Következő →
          </button>
        </div>
      )}
      {eredmeny === null && (
        <div className="mt-3 text-right">
          <button type="button" onClick={onKesz} className="text-[12.5px] font-semibold text-petrol-500 hover:text-petrol-800">
            Kihagyom →
          </button>
        </div>
      )}
    </div>
  );
}

function Hianyzik({ hiba }) {
  return (
    <div className="rounded-2xl border border-[color:var(--keret)] bg-petrol-50 p-5 text-[14px] text-petrol-700">
      Ezt a feladatot (<strong>{hiba.cim}</strong>) már nem találom a modulban — valószínűleg átnevezték. A modul oldalán ugyanezt a típust gyakorolhatod:{" "}
      <Link href={`${hiba.modul}#gyakorlas`} className="font-semibold text-naracs-700 underline">
        {modulSlugAlapjan(hiba.modul)?.cim ?? hiba.modul}
      </Link>
      .
    </div>
  );
}

/* ---------- a fő komponens ---------- */

export default function Hibanaplo() {
  const { lista, nyitott, betoltve } = useHibanaplo();
  const [mod, setMod] = useState("lista"); // "lista" | "ismetles"
  const [sor, setSor] = useState([]);
  const [i, setI] = useState(0);
  const [mutatKesz, setMutatKesz] = useState(false);

  const csoportok = useMemo(() => {
    const m = new Map();
    for (const h of lista) {
      if (h.kesz && !mutatKesz) continue;
      const k = h.modul;
      if (!m.has(k)) m.set(k, []);
      m.get(k).push(h);
    }
    return [...m.entries()].sort((a, b) => (modulSlugAlapjan(a[0])?.szam ?? 99) - (modulSlugAlapjan(b[0])?.szam ?? 99));
  }, [lista, mutatKesz]);

  const stat = useMemo(() => {
    const javitva = lista.filter((h) => h.kesz).length;
    const modulSzam = new Map();
    for (const h of nyitott) modulSzam.set(h.modul, (modulSzam.get(h.modul) ?? 0) + 1);
    let legtobb = null;
    for (const [k, v] of modulSzam) if (!legtobb || v > legtobb[1]) legtobb = [k, v];
    const tipusok = {};
    for (const h of nyitott) tipusok[h.tipus] = (tipusok[h.tipus] ?? 0) + 1;
    return { javitva, legtobb, tipusok };
  }, [lista, nyitott]);

  const ismetlesInditas = (lista2) => {
    const s = lista2.filter((h) => !h.kesz && h.tipus !== "jatek");
    if (!s.length) return;
    setSor(s);
    setI(0);
    setMod("ismetles");
  };

  if (!betoltve) return <div className="h-40" />;

  if (mod === "ismetles") {
    const aktualis = sor[i];
    const kesz = i >= sor.length;
    return (
      <div>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => setMod("lista")} className="rounded-lg bg-white px-3 py-1.5 text-[12.5px] font-semibold text-petrol-700 ring-1 ring-petrol-200 transition hover:bg-petrol-50">
            ← Vissza a listához
          </button>
          <span className="text-[12.5px] text-petrol-500">
            Ismétlés: {Math.min(i + 1, sor.length)} / {sor.length}
          </span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-petrol-100">
            <div className="h-full rounded-full bg-naracs-500 transition-all" style={{ width: `${(Math.min(i, sor.length) / sor.length) * 100}%` }} />
          </div>
        </div>
        {kesz ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
            <p className="text-[17px] font-bold text-emerald-800">Végigmentél a listán.</p>
            <p className="mt-1 text-[14px] text-emerald-700">Ami sikerült, az egy javítást kapott; ami nem, az fent maradt — holnap érdemes újra próbálni.</p>
            <button type="button" onClick={() => setMod("lista")} className="mt-4 rounded-lg bg-petrol-800 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-petrol-700">
              Vissza a listához
            </button>
          </div>
        ) : (
          <div key={aktualis.id}>
            <div className="mb-2 flex flex-wrap items-center gap-2 text-[12.5px] text-petrol-500">
              <span className={`rounded-md px-2 py-0.5 text-[10.5px] font-bold tracking-wide uppercase ${TIPUS_SZIN[aktualis.tipus]}`}>{TIPUS_NEV[aktualis.tipus]}</span>
              <span className="font-semibold text-petrol-800">{modulSlugAlapjan(aktualis.modul)?.cim ?? aktualis.modul}</span>
              <span>· {aktualis.db}× rontva · {aktualis.javitva}/{JAVITAS_CEL} javítás</span>
            </div>
            <Ismetlo hiba={aktualis} onKesz={() => setI((n) => n + 1)} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* statisztika */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-[color:var(--keret)] bg-white p-4">
          <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">Nyitott hibák</p>
          <p className={`szamok mt-1 text-3xl font-bold ${nyitott.length ? "text-rose-600" : "text-emerald-600"}`}>{nyitott.length}</p>
          <p className="mt-1 text-[12px] text-petrol-500">
            {Object.entries(stat.tipusok).map(([t, n]) => `${n} ${TIPUS_NEV[t].toLowerCase()}`).join(" · ") || "semmi — vagy még nem gyakoroltál"}
          </p>
        </div>
        <div className="rounded-2xl border border-[color:var(--keret)] bg-white p-4">
          <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">Javítva</p>
          <p className="szamok mt-1 text-3xl font-bold text-emerald-600">{stat.javitva}</p>
          <p className="mt-1 text-[12px] text-petrol-500">{JAVITAS_CEL} sikeres ismétlés után kerül ki egy hiba</p>
        </div>
        <div className="rounded-2xl border border-[color:var(--keret)] bg-white p-4">
          <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">Hol akadsz el?</p>
          <p className="mt-1 text-[15px] font-bold text-petrol-900">{stat.legtobb ? (modulSlugAlapjan(stat.legtobb[0])?.cim ?? stat.legtobb[0]) : "—"}</p>
          <p className="mt-1 text-[12px] text-petrol-500">{stat.legtobb ? `${stat.legtobb[1]} nyitott hiba ebben a modulban` : "nincs kiugró modul"}</p>
        </div>
      </div>

      {/* vezérlők */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={!nyitott.some((h) => h.tipus !== "jatek")}
          onClick={() => ismetlesInditas(nyitott)}
          className="rounded-lg bg-naracs-500 px-4 py-2 text-[13.5px] font-semibold text-white shadow-md shadow-naracs-500/20 transition hover:bg-naracs-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Ismételd a hibáidat →
        </button>
        <label className="ml-auto flex items-center gap-2 text-[12.5px] text-petrol-600">
          <input type="checkbox" checked={mutatKesz} onChange={(e) => setMutatKesz(e.target.checked)} className="accent-[color:var(--color-naracs-500)]" />
          javítottak mutatása
        </label>
        {lista.length > 0 && (
          <button
            type="button"
            onClick={() => { if (window.confirm("Biztosan törlöd az egész hibanaplót?")) hibakTorles(); }}
            className="rounded-lg px-3 py-2 text-[12.5px] font-semibold text-petrol-500 transition hover:bg-rose-50 hover:text-rose-700"
          >
            Törlés
          </button>
        )}
      </div>

      {/* lista */}
      {csoportok.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-petrol-200 bg-petrol-50/50 p-8 text-center">
          <p className="text-[16px] font-semibold text-petrol-900">Üres a napló.</p>
          <p className="mx-auto mt-2 max-w-md text-[14px] text-petrol-600">
            Ha egy gyakorló feladatot, kvízkérdést vagy hibakeresőt elrontasz, az ide kerül — és itt kérheted újra ugyanazt a típust, amíg nem megy. Kezdd a{" "}
            <Link href="/utvonal" className="font-semibold text-naracs-700 underline">heti útvonalon</Link>.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          {csoportok.map(([slug, hibak]) => {
            const m = modulSlugAlapjan(slug);
            const ny = hibak.filter((h) => !h.kesz);
            return (
              <section key={slug} className="overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white">
                <div className="flex flex-wrap items-center gap-3 border-b border-[color:var(--keret)] bg-petrol-50/60 px-4 py-2.5">
                  {m?.szam && <span className="grid h-7 w-7 place-items-center rounded-lg bg-petrol-800 text-[12px] font-bold text-white">{m.szam}</span>}
                  <Link href={slug} className="text-[14px] font-semibold text-petrol-900 hover:underline">{m?.cim ?? slug}</Link>
                  <span className="text-[12px] text-petrol-500">{ny.length} nyitott</span>
                  {ny.some((h) => h.tipus !== "jatek") && (
                    <button type="button" onClick={() => ismetlesInditas(ny)} className="ml-auto rounded-lg bg-white px-3 py-1 text-[12px] font-semibold text-petrol-700 ring-1 ring-petrol-200 transition hover:bg-petrol-50">
                      csak ezeket ismétlem →
                    </button>
                  )}
                </div>
                <ul className="divide-y divide-petrol-100">
                  {hibak.map((h) => (
                    <li key={h.id} className={`flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2.5 text-[13.5px] ${h.kesz ? "opacity-55" : ""}`}>
                      <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase ${TIPUS_SZIN[h.tipus]}`}>{TIPUS_NEV[h.tipus]}</span>
                      <span className="min-w-0 flex-1 text-petrol-800">
                        {h.cim}
                        {h.tipus === "jatek" && typeof h.reszlet === "number" && <span className="ml-1 text-petrol-400">({h.reszlet} pont)</span>}
                      </span>
                      <span className="text-[11.5px] text-petrol-400">{h.db}× · {datumSzoveg(h.datum)}</span>
                      <span className="flex items-center gap-0.5" title={`${h.javitva}/${JAVITAS_CEL} sikeres ismétlés`}>
                        {Array.from({ length: JAVITAS_CEL }).map((_, k) => (
                          <span key={k} className={`h-2 w-2 rounded-full ${k < h.javitva ? "bg-emerald-500" : "bg-petrol-200"}`} />
                        ))}
                      </span>
                      {h.kesz ? (
                        <span className="text-[11px] font-semibold text-emerald-700">javítva</span>
                      ) : (
                        <button type="button" onClick={() => hibaMegoldva(h.id)} className="text-[11.5px] font-semibold text-petrol-500 hover:text-emerald-700" title="Kézzel javítottnak jelölöm (egy lépés)">
                          ✓
                        </button>
                      )}
                      <button type="button" onClick={() => hibaTorol(h.id)} className="text-[12px] text-petrol-400 hover:text-rose-600" title="Törlés a naplóból">
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}

      <p className="mt-6 text-[12.5px] text-petrol-500">
        A napló csak ebben a böngészőben él (localStorage), ahogy a haladásod is. Az ismétlés a <M>{"\\text{rontás} \\to \\text{másnap újra} \\to \\text{még egyszer}"}</M> elvre épül: két sikeres ismétlés után tekintjük javítottnak.
      </p>
    </div>
  );
}
