"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HETEK, VIZSGA_TIPUSOK, elerhetoHetek, keszModulSlugok } from "@/lib/utvonal";
import { modulSlugAlapjan } from "@/lib/oldalterkep";
import { useHaladas, modulSzazalek, jelvenyek } from "@/lib/haladas";
import { HaladasGyuru } from "@/components/HaladasKartyak";

/*
 * Tanulási útvonal – függőleges idővonal hetenként, „Hol tartasz?” választóval.
 * Az aktuális hetet a böngésző jegyzi meg (localStorage: statika-het).
 * A haladás a modulok játékaiból, kvízeiből, feladataiból áll össze (useHaladas).
 */

const HET_KULCS = "statika-het";

function hetOlvas() {
  try {
    const n = parseInt(window.localStorage.getItem(HET_KULCS) || "", 10);
    return n >= 1 && n <= HETEK.length ? n : 1;
  } catch {
    return 1;
  }
}

function hetIr(n) {
  try {
    window.localStorage.setItem(HET_KULCS, String(n));
  } catch {
    /* privát mód – nem baj */
  }
}

/* ---------- Hol tartasz? ---------- */

function HetValaszto({ het, onValaszt }) {
  return (
    <div className="rounded-2xl border border-[color:var(--keret)] bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-[15px] font-bold text-petrol-900">Hol tartasz?</h2>
        <p className="text-[12.5px] text-petrol-500">
          Állítsd be az aktuális hetet – a böngésződ megjegyzi.
        </p>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5" role="radiogroup" aria-label="Aktuális hét">
        {HETEK.map((h) => {
          const aktiv = h.het === het;
          return (
            <button
              key={h.het}
              type="button"
              role="radio"
              aria-checked={aktiv}
              title={`${h.het}. hét: ${h.cim}`}
              onClick={() => onValaszt(h.het)}
              className={`grid h-9 w-9 place-items-center rounded-lg text-[13px] font-bold transition ${
                aktiv
                  ? "bg-naracs-500 text-white shadow-md"
                  : h.het < het
                    ? "bg-petrol-100 text-petrol-500 hover:bg-petrol-200"
                    : "bg-petrol-50 text-petrol-700 ring-1 ring-petrol-200 hover:bg-petrol-100"
              }`}
            >
              {h.het}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-[13px] text-petrol-700">
        <span className="font-semibold text-petrol-900">{het}. hét:</span> {HETEK[het - 1].cim}
      </p>
    </div>
  );
}

/* ---------- Összesítő sáv ---------- */

function Osszesito({ adat }) {
  const slugok = keszModulSlugok();
  const ertekek = slugok.map((s) => modulSzazalek(adat[s]));
  const atlag = Math.round(ertekek.reduce((a, b) => a + b, 0) / Math.max(1, ertekek.length));
  const elerheto = elerhetoHetek();
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-2xl border border-[color:var(--keret)] bg-white px-4 py-3 text-petrol-900">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-petrol-100 text-[15px] font-bold text-petrol-800 szamok">
          {elerheto}
        </span>
        <div>
          <p className="text-[13.5px] font-semibold text-petrol-900">
            {elerheto} / {HETEK.length} hét anyaga elérhető az oldalon
          </p>
          <p className="text-[12px] text-petrol-500">a többi hét: tankönyvi hivatkozás, a modul hamarosan</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <HaladasGyuru szazalek={atlag} meret={40} vastag={4} />
        <div>
          <p className="text-[13.5px] font-semibold text-petrol-900">teljes haladás</p>
          <p className="text-[12px] text-petrol-500">a {slugok.length} kész modul átlaga</p>
        </div>
      </div>
    </div>
  );
}

/* ---------- Egy modul sora a kártyán ---------- */

function ModulSor({ slug, adat }) {
  const m = modulSlugAlapjan(slug);
  if (!m) return null;
  const bevezetes = m.szam === null;
  const h = adat[slug];
  const szazalek = modulSzazalek(h);
  const jelek = jelvenyek(h);

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl bg-petrol-50 px-3 py-2.5">
      {!bevezetes && <HaladasGyuru szazalek={szazalek} meret={38} vastag={4} />}
      <div className="min-w-0 flex-1">
        <Link href={m.slug} className="text-[13.5px] font-semibold text-petrol-900 hover:text-naracs-700">
          {bevezetes ? m.cim : `${m.szam}. modul: ${m.cim}`}
        </Link>
        {jelek.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {jelek.map((j) => (
              <span
                key={j.cim}
                title={j.cim}
                className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800"
              >
                <span aria-hidden="true">{j.jel}</span>
                {j.cim}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {bevezetes ? (
          <Link
            href="/#utmutato"
            className="rounded-lg bg-white px-2.5 py-1 text-[12px] font-semibold text-petrol-700 ring-1 ring-petrol-200 transition hover:bg-petrol-100"
          >
            Útmutató →
          </Link>
        ) : (
          <>
            <Link
              href={`${m.slug}#elmelet`}
              className="rounded-lg bg-naracs-500 px-2.5 py-1 text-[12px] font-semibold text-white transition hover:bg-naracs-600"
            >
              Kezdd itt →
            </Link>
            <Link
              href={`${m.slug}#gyakorlas`}
              className="rounded-lg bg-white px-2.5 py-1 text-[12px] font-semibold text-violet-800 ring-1 ring-petrol-200 transition hover:bg-violet-50"
            >
              Játék
            </Link>
            <Link
              href={`${m.slug}#gyakorlas`}
              className="rounded-lg bg-white px-2.5 py-1 text-[12px] font-semibold text-petrol-700 ring-1 ring-petrol-200 transition hover:bg-petrol-100"
            >
              Kvíz
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- Egy hét kártyája ---------- */

function HetKartya({ h, allapot, adat }) {
  // allapot: "mult" | "aktualis" | "jovo"
  const aktualis = allapot === "aktualis";
  const mult = allapot === "mult";
  const kesz = h.allapot === "kesz";

  return (
    <li className={`relative pl-12 sm:pl-14 ${mult ? "opacity-60 transition hover:opacity-100" : ""}`}>
      {/* hét-számos kör az idővonalon */}
      <span
        className={`absolute top-4 left-0 grid h-9 w-9 place-items-center rounded-full text-[13px] font-bold ring-4 ring-[color:var(--hatter)] ${
          aktualis
            ? "bg-naracs-500 text-white"
            : mult
              ? "bg-emerald-100 text-emerald-800"
              : kesz
                ? "bg-petrol-100 text-petrol-800"
                : "bg-petrol-50 text-petrol-500 outline outline-1 outline-petrol-200"
        }`}
        aria-hidden="true"
      >
        {h.het}
      </span>

      <article
        id={`het-${h.het}`}
        className={`rounded-2xl border bg-white p-4 sm:p-5 ${
          aktualis ? "border-naracs-300 ring-2 ring-naracs-400 shadow-md" : "border-[color:var(--keret)]"
        }`}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold tracking-[0.16em] text-petrol-500 uppercase">{h.het}. hét</span>
          {aktualis && (
            <span className="rounded-full bg-naracs-100 px-2 py-0.5 text-[11px] font-bold text-naracs-800">Ezen a héten</span>
          )}
          {mult && (
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">korábbi hét</span>
          )}
          {!kesz && (
            <span className="rounded-full bg-petrol-100 px-2 py-0.5 text-[11px] font-semibold text-petrol-500">modul hamarosan</span>
          )}
        </div>
        <h3 className="mt-1.5 text-[17px] font-bold text-petrol-900">{h.cim}</h3>

        <ul className="mt-3 space-y-1">
          {h.temak.map((t) => (
            <li key={t} className="flex items-start gap-2 text-[13.5px] text-petrol-700">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-naracs-400" aria-hidden="true" />
              {t}
            </li>
          ))}
        </ul>

        <dl className="mt-4 grid gap-2 text-[13px] sm:grid-cols-[auto_1fr] sm:gap-x-4">
          <dt className="font-semibold text-violet-800">Olvasd:</dt>
          <dd className="min-w-0 text-petrol-700">tankönyv {h.tankonyv}</dd>

          <dt className="font-semibold text-petrol-800">Itt az oldalon:</dt>
          <dd className="min-w-0">
            {h.modulok.length > 0 ? (
              <div className="space-y-2">
                {h.modulok.map((s) => (
                  <ModulSor key={s} slug={s} adat={adat} />
                ))}
              </div>
            ) : (
              <span className="inline-flex items-center gap-2 text-petrol-500">
                <span className="rounded-full bg-petrol-100 px-2 py-0.5 text-[11px] font-semibold text-petrol-500">hamarosan</span>
                addig a tankönyv {h.tankonyv}
                {h.het === HETEK.length && (
                  <>
                    {" "}
                    ·{" "}
                    <Link href="/zh" className="font-semibold text-petrol-700 underline decoration-petrol-300 hover:text-naracs-700">
                      Zh-szimulátor
                    </Link>
                  </>
                )}
              </span>
            )}
          </dd>

          <dt className="font-semibold text-naracs-800">Gyakorold:</dt>
          <dd className="min-w-0 text-petrol-700">
            <span className="font-semibold text-petrol-900">{h.hFeladat}</span> szintemelő feladatsor
            {h.hTemak && <span className="text-petrol-500"> – {h.hTemak}</span>}
          </dd>
        </dl>

        <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-[13px] text-emerald-900">
          <span className="font-bold">A hét végén:</span> {h.cel}
        </p>
      </article>
    </li>
  );
}

/* ---------- Vizsgaminta ---------- */

const VIZSGA_ALLAPOT = {
  kesz: { szoveg: "elérhető", osztaly: "bg-emerald-100 text-emerald-800" },
  reszben: { szoveg: "részben", osztaly: "bg-naracs-100 text-naracs-800" },
  hamarosan: { szoveg: "hamarosan", osztaly: "bg-petrol-100 text-petrol-500" },
};

function VizsgaTipusok({ het, onValaszt }) {
  return (
    <section className="mt-12">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-xl font-bold text-petrol-900">A vizsgaminta öt feladattípusa</h2>
        <p className="text-[12.5px] text-petrol-500">melyik hét és modul készít fel rá</p>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {VIZSGA_TIPUSOK.map((v) => {
          const a = VIZSGA_ALLAPOT[v.allapot] || VIZSGA_ALLAPOT.hamarosan;
          return (
            <div key={v.szam} className="flex min-w-0 flex-col rounded-2xl border border-[color:var(--keret)] bg-white p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-petrol-100 text-[13px] font-bold text-petrol-800">
                  {v.szam}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${a.osztaly}`}>{a.szoveg}</span>
              </div>
              <h3 className="mt-2 text-[14.5px] font-bold text-petrol-900">{v.tipus}</h3>
              <p className="mt-1 text-[12.5px] leading-relaxed text-petrol-600">{v.leiras}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {v.hetek.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => onValaszt(n)}
                    title={`Ugrás a(z) ${n}. hét kártyájára`}
                    className={`rounded-md px-2 py-0.5 text-[11.5px] font-semibold transition ${
                      n === het ? "bg-naracs-500 text-white" : "bg-petrol-50 text-petrol-700 ring-1 ring-petrol-200 hover:bg-petrol-100"
                    }`}
                  >
                    {n}. hét
                  </button>
                ))}
              </div>
              {v.modulok.length > 0 && (
                <p className="mt-2 text-[12px] text-petrol-500">
                  Modul:{" "}
                  {v.modulok.map((s, i) => {
                    const m = modulSlugAlapjan(s);
                    return (
                      <span key={s}>
                        {i > 0 && ", "}
                        <Link href={s} className="font-semibold text-petrol-700 hover:text-naracs-700">
                          {m ? `${m.szam}. ${m.rovid}` : s}
                        </Link>
                      </span>
                    );
                  })}
                </p>
              )}
            </div>
          );
        })}
        <div className="flex min-w-0 flex-col justify-between rounded-2xl border border-dashed border-petrol-300 bg-petrol-50 p-4">
          <div>
            <h3 className="text-[14.5px] font-bold text-petrol-900">Próbáld élesben</h3>
            <p className="mt-1 text-[12.5px] leading-relaxed text-petrol-600">
              A Zh-szimulátor a kész modulokból ad négy véletlen feladatot órával. A vizsga-szimulátor (mind az öt típussal)
              hamarosan.
            </p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href="/zh"
              className="rounded-lg bg-naracs-500 px-3 py-1.5 text-[12.5px] font-semibold text-white transition hover:bg-naracs-600"
            >
              Zh-szimulátor →
            </Link>
            <span className="rounded-lg bg-petrol-100 px-3 py-1.5 text-[12.5px] font-semibold text-petrol-500">
              Vizsga-szimulátor · hamarosan
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Fő komponens ---------- */

export default function Utvonal() {
  const [het, setHet] = useState(1);
  const adat = useHaladas();

  useEffect(() => {
    setHet(hetOlvas());
  }, []);

  const valaszt = (n, gorget = false) => {
    setHet(n);
    hetIr(n);
    if (gorget && typeof document !== "undefined") {
      const el = document.getElementById(`het-${n}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div>
      <Osszesito adat={adat} />
      <div className="mt-4">
        <HetValaszto het={het} onValaszt={(n) => valaszt(n, true)} />
      </div>

      <ol className="relative mt-8 space-y-5 before:absolute before:top-4 before:bottom-4 before:left-[17px] before:w-0.5 before:bg-petrol-200 before:content-['']">
        {HETEK.map((h) => (
          <HetKartya key={h.het} h={h} adat={adat} allapot={h.het === het ? "aktualis" : h.het < het ? "mult" : "jovo"} />
        ))}
      </ol>

      <VizsgaTipusok het={het} onValaszt={(n) => valaszt(n, true)} />

      <p className="mt-8 text-[12px] leading-relaxed text-petrol-500">
        A heti kiosztás javaslat, a tankönyv fejezetrendjét és a H01–H13 szintemelő feladatsorok témáit követi; a tanszéki
        ütemezés ettől eltérhet. A haladás a modulok gyakorló feladataiból (40 %), kvízéből (30 %) és játékából (30 %) áll
        össze, és csak ebben a böngészőben tárolódik.
      </p>
    </div>
  );
}
