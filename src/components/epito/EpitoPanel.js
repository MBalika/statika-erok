"use client";

import { csomopont as csOf, rud as rudOf, tamasz as tamaszOf, teher as teherOf, rudGeometria, csomopontMozgat, csukloValt, tamaszBeallit, tamaszSzog, teherModosit, teherHozzaad, elemTorol, GORGO_IRANYOK, TAMASZ_NEV, TEHER_NEV, RACS } from "@/lib/epito/modell";
import { sz } from "@/lib/szamok";

/*
 * Oldalsó szerkesztő-panel: a kijelölt elem tulajdonságai számbeviteli mezőkkel,
 * és a teljes elemlista (csomópontok, rudak, támaszok, terhek) — kattintásra kijelöl.
 *   allapot, kijelolt { tipus, id }, onValtoztat(ujAllapot), onKijelol(kijelolt | null)
 */

const ert = (v) => sz(v, Math.abs(v - Math.round(v)) > 1e-9 ? (Math.abs(v * 10 - Math.round(v * 10)) > 1e-9 ? 2 : 1) : 0);
const IRANY_GOMBOK = [["↓", -90], ["↑", 90], ["→", 0], ["←", 180]];

function Mezo({ cimke, ertek, onChange, lepes = 0.5, min, max, egyseg }) {
  return (
    <label className="flex min-w-0 items-center gap-1.5 text-[12.5px] text-petrol-700">
      <span className="w-14 shrink-0">{cimke}</span>
      <input
        type="number"
        step={lepes}
        min={min}
        max={max}
        value={Number.isFinite(ertek) ? ertek : ""}
        onChange={(e) => { const v = Number(e.target.value); if (Number.isFinite(v)) onChange(v); }}
        className="szamok w-20 min-w-0 rounded-md border border-petrol-200 bg-white px-2 py-1 text-right text-[13px] text-petrol-900 focus:border-petrol-500 focus:outline-none"
      />
      {egyseg && <span className="text-[11px] text-petrol-500">{egyseg}</span>}
    </label>
  );
}

function Gomb({ aktiv, onClick, children, title }) {
  return (
    <button type="button" onClick={onClick} title={title} className={`rounded-md px-2 py-1 text-[12px] font-medium transition ${aktiv ? "bg-petrol-800 text-white" : "bg-white text-petrol-700 ring-1 ring-petrol-200 hover:bg-petrol-50"}`}>
      {children}
    </button>
  );
}

function TorlesGomb({ onClick }) {
  return (
    <button type="button" onClick={onClick} className="rounded-md bg-white px-2 py-1 text-[12px] font-medium text-rose-700 ring-1 ring-rose-200 transition hover:bg-rose-50">
      Törlés
    </button>
  );
}

export default function EpitoPanel({ allapot: all, kijelolt, onValtoztat, onKijelol }) {
  const v = (uj) => onValtoztat(uj);

  let tulaj = null;
  if (kijelolt?.tipus === "csomopont" || kijelolt?.tipus === "tamasz" || kijelolt?.tipus === "csuklo") {
    const c = csOf(all, kijelolt.id);
    if (c) {
      const tam = tamaszOf(all, c.id);
      const csuklo = all.csuklok.includes(c.id);
      const rudak = all.rudak.filter((r) => r.a === c.id || r.b === c.id);
      tulaj = (
        <div className="space-y-2">
          <p className="text-[13px] font-semibold text-petrol-900">{c.id} csomópont <span className="font-normal text-petrol-500">({rudak.length} rúd)</span></p>
          <div className="flex flex-wrap gap-2">
            <Mezo cimke="x" ertek={c.x} lepes={RACS} min={0} max={14} egyseg="m" onChange={(x) => v(csomopontMozgat(all, c.id, x, c.y))} />
            <Mezo cimke="y" ertek={c.y} lepes={RACS} min={0} max={7} egyseg="m" onChange={(y) => v(csomopontMozgat(all, c.id, c.x, y))} />
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="w-14 text-[12.5px] text-petrol-700">Támasz</span>
            {[null, "gorgo", "csuklo", "befogas"].map((t) => (
              <Gomb key={t ?? "nincs"} aktiv={(tam?.tipus ?? null) === t} onClick={() => v(tamaszBeallit(all, c.id, t, tam?.szog ?? 90))}>
                {t ? TAMASZ_NEV[t] : "nincs"}
              </Gomb>
            ))}
          </div>
          {tam?.tipus === "gorgo" && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="w-14 text-[12.5px] text-petrol-700">Gátolt irány</span>
              {GORGO_IRANYOK.map((g) => (
                <Gomb key={g.szog} aktiv={(tam.szog ?? 90) === g.szog} onClick={() => v(tamaszSzog(all, c.id, g.szog))} title={g.nev}>
                  {g.szog}°
                </Gomb>
              ))}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="w-14 text-[12.5px] text-petrol-700">Belső csukló</span>
            <Gomb aktiv={csuklo} onClick={() => v(csukloValt(all, c.id))}>{csuklo ? "van" : "nincs"}</Gomb>
            {csuklo && rudak.length < 2 && <span className="text-[11px] text-amber-700">csak ≥ 2 rúdnál van értelme</span>}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="w-14 text-[12.5px] text-petrol-700">Teher ide</span>
            <Gomb onClick={() => { const r = teherHozzaad(all, { fajta: "csomopontiEro", csomopont: c.id }); v(r.allapot); onKijelol({ tipus: "teher", id: r.id }); }}>+ erő</Gomb>
            <Gomb onClick={() => { const r = teherHozzaad(all, { fajta: "csomopontiNyomatek", csomopont: c.id }); v(r.allapot); onKijelol({ tipus: "teher", id: r.id }); }}>+ nyomaték</Gomb>
            <TorlesGomb onClick={() => { v(elemTorol(all, { tipus: "csomopont", id: c.id })); onKijelol(null); }} />
          </div>
        </div>
      );
    }
  } else if (kijelolt?.tipus === "rud") {
    const r = rudOf(all, kijelolt.id);
    const g = r && rudGeometria(all, r);
    if (g) {
      tulaj = (
        <div className="space-y-2">
          <p className="text-[13px] font-semibold text-petrol-900">
            {r.id}. rúd <span className="font-normal text-petrol-500">{r.a} → {r.b}, {ert(g.hossz)} m, {ert(g.szogFok)}°</span>
          </p>
          <p className="text-[12px] text-petrol-600">A rúdmenti helyeket (a) a(z) {r.a} csomóponttól mérjük. Az ábrák (N, V, M) pozitív oldala: {r.a}-tól {r.b} felé haladva a jobb oldal.</p>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="w-14 text-[12.5px] text-petrol-700">Teher ide</span>
            <Gomb onClick={() => { const q = teherHozzaad(all, { fajta: "pontTeher", rud: r.id, a: Math.round((g.hossz / 2) / RACS) * RACS }); v(q.allapot); onKijelol({ tipus: "teher", id: q.id }); }}>+ erő</Gomb>
            <Gomb onClick={() => { const q = teherHozzaad(all, { fajta: "pontNyomatek", rud: r.id, a: Math.round((g.hossz / 2) / RACS) * RACS }); v(q.allapot); onKijelol({ tipus: "teher", id: q.id }); }}>+ nyomaték</Gomb>
            <Gomb onClick={() => { const q = teherHozzaad(all, { fajta: "megoszlo", rud: r.id, a1: 0, a2: g.hossz, p1: 5, p2: 5 }); v(q.allapot); onKijelol({ tipus: "teher", id: q.id }); }}>+ megoszló</Gomb>
            <TorlesGomb onClick={() => { v(elemTorol(all, { tipus: "rud", id: r.id })); onKijelol(null); }} />
          </div>
        </div>
      );
    }
  } else if (kijelolt?.tipus === "teher") {
    const t = teherOf(all, kijelolt.id);
    if (t) {
      const g = t.rud ? rudGeometria(all, rudOf(all, t.rud)) : null;
      const mod = (valt) => v(teherModosit(all, t.id, valt));
      tulaj = (
        <div className="space-y-2">
          <p className="text-[13px] font-semibold text-petrol-900">
            {TEHER_NEV[t.fajta]} <span className="font-normal text-petrol-500">{t.csomopont ? `${t.csomopont} csomópont` : `${t.rud}. rúd`}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {(t.fajta === "csomopontiEro" || t.fajta === "pontTeher") && <Mezo cimke="F" ertek={t.F} lepes={1} min={0} max={200} egyseg="kN" onChange={(F) => mod({ F })} />}
            {(t.fajta === "csomopontiNyomatek" || t.fajta === "pontNyomatek") && <Mezo cimke="M" ertek={t.M} lepes={1} min={-200} max={200} egyseg="kNm" onChange={(M) => mod({ M })} />}
            {t.fajta === "megoszlo" && <Mezo cimke="p₁" ertek={t.p1} lepes={0.5} min={0} max={50} egyseg="kN/m" onChange={(p1) => mod({ p1 })} />}
            {t.fajta === "megoszlo" && <Mezo cimke="p₂" ertek={t.p2 ?? t.p1} lepes={0.5} min={0} max={50} egyseg="kN/m" onChange={(p2) => mod({ p2 })} />}
          </div>
          {(t.fajta === "pontTeher" || t.fajta === "pontNyomatek") && g && <Mezo cimke="hely, a" ertek={t.a} lepes={RACS} min={0} max={g.hossz} egyseg="m" onChange={(a) => mod({ a })} />}
          {t.fajta === "megoszlo" && g && (
            <div className="flex flex-wrap gap-2">
              <Mezo cimke="a₁" ertek={t.a1} lepes={RACS} min={0} max={g.hossz} egyseg="m" onChange={(a1) => mod({ a1 })} />
              <Mezo cimke="a₂" ertek={t.a2} lepes={RACS} min={0} max={g.hossz} egyseg="m" onChange={(a2) => mod({ a2 })} />
            </div>
          )}
          {(t.fajta === "csomopontiEro" || t.fajta === "pontTeher" || t.fajta === "megoszlo") && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="w-14 text-[12.5px] text-petrol-700">Irány</span>
              {IRANY_GOMBOK.map(([jel, szog]) => (
                <Gomb key={szog} aktiv={t.szog === szog} onClick={() => mod({ szog })}>{jel}</Gomb>
              ))}
              <Mezo cimke="szög" ertek={t.szog} lepes={15} min={-180} max={180} egyseg="°" onChange={(szog) => mod({ szog })} />
            </div>
          )}
          {(t.fajta === "csomopontiNyomatek" || t.fajta === "pontNyomatek") && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="w-14 text-[12.5px] text-petrol-700">Forgás</span>
              <Gomb aktiv={t.M >= 0} onClick={() => mod({ M: Math.abs(t.M) })}>↶ óramutatóval ellentétes (+)</Gomb>
              <Gomb aktiv={t.M < 0} onClick={() => mod({ M: -Math.abs(t.M) })}>↷ óramutató szerint (−)</Gomb>
            </div>
          )}
          <TorlesGomb onClick={() => { v(elemTorol(all, { tipus: "teher", id: t.id })); onKijelol(null); }} />
        </div>
      );
    }
  }

  const sor = (kulcs, tipus, id, szoveg, extra) => (
    <li key={kulcs}>
      <button type="button" onClick={() => onKijelol({ tipus, id })} className={`flex w-full items-baseline gap-2 rounded-md px-2 py-1 text-left text-[12.5px] transition ${kijelolt && kijelolt.tipus === tipus && kijelolt.id === id ? "bg-amber-100 text-petrol-900" : "text-petrol-700 hover:bg-petrol-50"}`}>
        <span className="szamok min-w-0 flex-1 truncate">{szoveg}</span>
        {extra && <span className="shrink-0 text-[11px] text-petrol-500">{extra}</span>}
      </button>
    </li>
  );

  return (
    <div className="min-w-0 space-y-3">
      <div className="min-w-0 rounded-xl border border-amber-200 bg-amber-50/60 p-3">
        <p className="mb-1.5 text-[10.5px] font-bold tracking-[0.14em] text-amber-800 uppercase">Kijelölt elem</p>
        {tulaj ?? <p className="text-[12.5px] text-petrol-600">Kattints egy csomópontra, rúdra vagy teherre a vásznon vagy a listában — itt szerkesztheted a számait.</p>}
      </div>
      <div className="min-w-0 rounded-xl border border-[color:var(--keret)] bg-white p-3">
        <p className="mb-1.5 text-[10.5px] font-bold tracking-[0.14em] text-petrol-500 uppercase">Elemlista</p>
        {all.csomopontok.length === 0 && <p className="text-[12.5px] text-petrol-500">Még üres a vászon.</p>}
        <ul className="space-y-0.5">
          {all.csomopontok.map((c) => {
            const tam = tamaszOf(all, c.id);
            return sor(`c${c.id}`, "csomopont", c.id, `${c.id} (${ert(c.x)}; ${ert(c.y)})`, [tam ? TAMASZ_NEV[tam.tipus] + (tam.tipus === "gorgo" ? ` ${tam.szog}°` : "") : null, all.csuklok.includes(c.id) ? "belső csukló" : null].filter(Boolean).join(", ") || "csomópont");
          })}
          {all.rudak.map((r) => {
            const g = rudGeometria(all, r);
            return sor(`r${r.id}`, "rud", r.id, `${r.id}. rúd: ${r.a} → ${r.b}`, g ? `${ert(g.hossz)} m, ${ert(g.szogFok)}°` : "");
          })}
          {all.terhek.map((t) => {
            const hol = t.csomopont ? `${t.csomopont}-ban` : `${t.rud}. rúdon${t.fajta === "megoszlo" ? ` ${ert(t.a1)}–${ert(t.a2)} m` : ` a = ${ert(t.a)} m`}`;
            const mennyi = t.fajta === "megoszlo" ? `${ert(t.p1)}${Math.abs((t.p2 ?? t.p1) - t.p1) > 1e-9 ? `…${ert(t.p2)}` : ""} kN/m` : t.M !== undefined ? `${ert(t.M)} kNm` : `${ert(t.F)} kN, ${ert(t.szog)}°`;
            return sor(`t${t.id}`, "teher", t.id, `${TEHER_NEV[t.fajta]} ${hol}`, mennyi);
          })}
        </ul>
      </div>
    </div>
  );
}
