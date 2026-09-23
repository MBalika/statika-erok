"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import RajzoloRajz, { SZ, rajzGeometria, rudIranyok, rajzPont, fogoPozicio } from "./RajzoloRajz";
import Ertekeles from "./Ertekeles";
import Reakciok from "./Reakciok";
import Szabalyok from "./Szabalyok";
import Diagram from "@/components/igenybevetel/Diagram";
import TartoLevezetes from "@/components/tarto/TartoLevezetes";
import { rajzFeladat, uresRajz, ellenoriz } from "@/lib/epito/ellenorzes";
import { rajzLeptekek } from "@/lib/epito/rajz";
import { sz } from "@/lib/szamok";

/*
 * 2–3. lépés: a hallgató megrajzolja a V, M (és opcionálisan N) ábrát, a program ellenőrzi.
 *   e        – elemez(modell) eredménye (határozott, terhelt)
 *   modell   – a motor-modell (a levezetéshez)
 *   nev      – a tartó neve
 *   kihivas  – kihívás mód: nincs visszalépés, az első ellenőrzés pontja számít
 *   onVissza – „Vissza az építéshez”
 *   onEllenorzes(eredmeny, probak) – minden ellenőrzés után
 *   gyerekek – extra gombok a gombsor végén (pl. „Következő kör”)
 */

const JELEK_ALAP = ["V", "M"];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const kerekLepes = (v, lepes) => Math.round(v / lepes) * lepes;
const SEGITSEG_NEV = ["", "Hol a hiba? (−5)", "A szabály és a helyes érték (−15)", "Mutasd a pontos ábrát (a kör 0 pont)"];

/** Alak-ikon: a rúd irányához igazított kis rajz (egyenes / parabola a + oldal felé / a − oldal felé). */
function AlakIkon({ alak, szogFok, szin = "#be123c" }) {
  const d = alak === "egyenes" ? "M 2 0 L 26 0" : alak === "U" ? "M 2 0 Q 14 16 26 0" : "M 2 0 Q 14 -16 26 0";
  return (
    <svg viewBox="-16 -16 32 32" width="26" height="26" aria-hidden="true">
      <g transform={`rotate(${-szogFok}) translate(-14 0)`}>
        <line x1="0" y1="0" x2="28" y2="0" stroke="#94a3b8" strokeWidth="1.2" />
        <path d={d} fill="none" stroke={szin} strokeWidth="2.2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export default function Rajzolo({ e, modell, nev, kihivas = false, onVissza, onEllenorzes, gyerekek }) {
  const f = useMemo(() => rajzFeladat(e), [e]);
  const lept = useMemo(() => rajzLeptekek(f), [f]);
  const tobbIrany = useMemo(() => e.modell.rudak.some((r) => Math.abs(r.sin) > 1e-6), [e]);

  const [jel, setJel] = useState("V");
  const [mutatN, setMutatN] = useState(false);
  const [{ rajz, alakok, szelsok }, setRajzAll] = useState(() => uresRajz(f));
  const [fazis, setFazis] = useState("rajzol"); // rajzol | ellenorizve | megoldas
  const [eredmeny, setEredmeny] = useState(null);
  const [segitseg, setSegitseg] = useState(0);
  const [probak, setProbak] = useState(0);
  const [kiemelt, setKiemelt] = useState(null);
  const [aktiv, setAktiv] = useState(null);
  const [anim, setAnim] = useState(0);
  const [reakcioTippek, setReakcioTippek] = useState({});
  const [reakciokMutatva, setReakciokMutatva] = useState(false);
  const svgRef = useRef(null);
  const rafRef = useRef(null);

  // új tartó → tiszta lap
  useEffect(() => {
    setRajzAll(uresRajz(f));
    setFazis("rajzol");
    setEredmeny(null);
    setSegitseg(0);
    setProbak(0);
    setKiemelt(null);
    setAnim(0);
    setJel("V");
    setReakcioTippek({});
    setReakciokMutatva(false);
  }, [f]);

  const jelek = mutatN ? ["N", "V", "M"] : JELEK_ALAP;
  const zart = fazis === "megoldas";
  const reakciok = reakciokMutatva || segitseg >= 2 || fazis === "megoldas";

  /* ---------- képernyő → viewBox ---------- */
  const viewBoxPont = useCallback((esem) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const r = svg.getBoundingClientRect();
    const k = SZ / r.width;
    return [(esem.clientX - r.left) * k, (esem.clientY - r.top) * k];
  }, []);

  const figyel = (mozgat, cel, pointerId) => {
    try { cel.setPointerCapture(pointerId); } catch { /* régi böngésző */ }
    const vege = (esem) => {
      window.removeEventListener("pointermove", mozgat);
      window.removeEventListener("pointerup", vege);
      window.removeEventListener("pointercancel", vege);
      try { cel.releasePointerCapture(esem.pointerId); } catch { /* semmi */ }
      setAktiv(null);
    };
    window.addEventListener("pointermove", mozgat);
    window.addEventListener("pointerup", vege);
    window.addEventListener("pointercancel", vege);
  };

  /* ---------- fogópont húzása: a rúd normálisára vetített távolság ---------- */
  const huzas = (rudId, i, oldal) => (ev) => {
    if (zart) return;
    ev.preventDefault();
    ev.stopPropagation();
    const r = f.rudak.find((q) => q.rud === rudId);
    const p = r.torespontok[i];
    const geo = rajzGeometria(e, { reakciok });
    const { c, s, ir } = rudIranyok(r, jel);
    const AX = geo.kx(r.kezdo[0] + p.x * c), AY = geo.ky2(r.kezdo[1] + p.x * s);
    const leptek = lept.leptek[jel], hatar = lept.hatar[jel], lepes = lept.lepes[jel];
    setAktiv(`${jel}|${rudId}|${i}|${oldal}`);
    if (fazis === "ellenorizve") setFazis("rajzol");
    const mozgat = (esem) => {
      const P = viewBoxPont(esem);
      if (!P) return;
      let v = ((P[0] - AX) * ir[0] + (P[1] - AY) * ir[1]) / leptek;
      v = clamp(kerekLepes(v, lepes), -hatar, hatar);
      if (Object.is(v, -0)) v = 0;
      setRajzAll((all) => {
        const lista = all.rajz[jel][rudId].map((q) => ({ ...q }));
        if (p[jel].fogok.length === 1) lista[i] = { bal: v, jobb: v };
        else lista[i][oldal] = v;
        return { ...all, rajz: { ...all.rajz, [jel]: { ...all.rajz[jel], [rudId]: lista } } };
      });
    };
    mozgat(ev);
    figyel(mozgat, ev.currentTarget, ev.pointerId);
  };

  /* ---------- szélsőérték-fogópont: hely a rúd mentén + érték a normális mentén ---------- */
  const szelsoHuzas = (rudId, k) => (ev) => {
    if (zart) return;
    ev.preventDefault();
    ev.stopPropagation();
    const r = f.rudak.find((q) => q.rud === rudId);
    const s_ = r.szakaszok[k];
    const geo = rajzGeometria(e, { reakciok });
    const { c, s, ir, tengely } = rudIranyok(r, "M");
    const AX = geo.kx(r.kezdo[0] + s_.x1 * c), AY = geo.ky2(r.kezdo[1] + s_.x1 * s);
    const leptek = lept.leptek.M, hatar = lept.hatar.M, lepes = lept.lepes.M;
    setAktiv(`szelso|${rudId}|${k}`);
    if (fazis === "ellenorizve") setFazis("rajzol");
    const mozgat = (esem) => {
      const P = viewBoxPont(esem);
      if (!P) return;
      let v = ((P[0] - AX) * ir[0] + (P[1] - AY) * ir[1]) / leptek;
      v = clamp(kerekLepes(v, lepes), -hatar, hatar);
      let x = ((P[0] - AX) * tengely[0] + (P[1] - AY) * tengely[1]) / geo.g.L;
      x = clamp(Math.round(x * 10) / 10, 0.1, Math.max(0.1, s_.hossz - 0.1));
      setRajzAll((all) => {
        const lista = [...all.szelsok[rudId]];
        lista[k] = { x: Math.round((s_.x1 + x) * 1000) / 1000, ertek: v };
        return { ...all, szelsok: { ...all.szelsok, [rudId]: lista } };
      });
    };
    mozgat(ev);
    figyel(mozgat, ev.currentTarget, ev.pointerId);
  };

  /* ---------- a vászon pointerdown-ja: a legközelebbi fogópont (≥ 22 képernyő-px sugárban) ---------- */
  const vaszonLe = (ev) => {
    if (zart) return;
    const P = viewBoxPont(ev);
    const svg = svgRef.current;
    if (!P || !svg) return;
    const k = SZ / svg.getBoundingClientRect().width;
    const geo = rajzGeometria(e, { reakciok });
    const leptek = lept.leptek[jel];
    let legjobb = null, tav = 24 * k;
    for (const r of f.rudak) {
      for (const p of r.torespontok) {
        for (const o of p[jel].fogok) {
          const { X, Y } = fogoPozicio(geo, e.modell, r, p, o, jel, rajz[jel][r.rud][p.i][o], leptek);
          const d = Math.hypot(P[0] - X, P[1] - Y);
          if (d < tav) { tav = d; legjobb = { rud: r.rud, i: p.i, oldal: o }; }
        }
      }
      if (jel === "M") {
        r.szakaszok.forEach((s_, kk) => {
          const sz_ = szelsok[r.rud][kk];
          if (!sz_) return;
          const [X, Y] = rajzPont(geo, r, "M", sz_.x, sz_.ertek, leptek);
          const d = Math.hypot(P[0] - X, P[1] - Y);
          if (d < tav) { tav = d; legjobb = { rud: r.rud, szelso: kk }; }
        });
      }
    }
    if (!legjobb) return;
    if (legjobb.szelso !== undefined) szelsoHuzas(legjobb.rud, legjobb.szelso)(ev);
    else huzas(legjobb.rud, legjobb.i, legjobb.oldal)(ev);
  };

  const alakValt = (rudId, k, alak) => { if (fazis === "ellenorizve") setFazis("rajzol"); setRajzAll((all) => ({ ...all, alakok: { ...all.alakok, [rudId]: all.alakok[rudId].map((v, j) => (j === k ? alak : v)) } })); };
  const szelsoValt = (rudId, k) => {
    if (fazis === "ellenorizve") setFazis("rajzol");
    setRajzAll((all) => {
      const r = f.rudak.find((q) => q.rud === rudId);
      const s_ = r.szakaszok[k];
      const lista = [...all.szelsok[rudId]];
      if (lista[k]) lista[k] = null;
      else {
        const v1 = all.rajz.M[rudId][s_.iKezd].jobb, v2 = all.rajz.M[rudId][s_.iVeg].bal;
        const kozep = (v1 + v2) / 2;
        lista[k] = { x: Math.round((s_.x1 + s_.hossz / 2) * 10) / 10, ertek: kerekLepes(kozep + (kozep >= 0 ? 1 : -1) * Math.max(1, 0.15 * lept.hatar.M), lept.lepes.M) };
      }
      return { ...all, szelsok: { ...all.szelsok, [rudId]: lista } };
    });
  };

  /* ---------- ellenőrzés ---------- */
  const ellenorzes = () => {
    if (zart) return;
    const ki = ellenoriz({ eredmeny: e, feladat: f, rajz, alakok, szelsok, reakcioTippek, jelek, segitseg, reakciokMutatva });
    setEredmeny(ki);
    setFazis("ellenorizve");
    setKiemelt(null);
    setProbak((p) => p + 1);
    onEllenorzes?.(ki, probak + 1);
  };
  const javit = () => {
    setFazis("rajzol");
    setKiemelt(null);
  };
  const nullaz = () => {
    setRajzAll(uresRajz(f));
    setEredmeny(null);
    setKiemelt(null);
    setFazis("rajzol");
    setAnim(0);
  };
  const segit = () => {
    if (segitseg >= 3) return;
    const uj = segitseg + 1;
    setSegitseg(uj);
    if (eredmeny) {
      // a pontot a segítség szintjével újraszámoljuk (a hibák ugyanazok)
      const ki = ellenoriz({ eredmeny: e, feladat: f, rajz, alakok, szelsok, reakcioTippek, jelek, segitseg: uj, reakciokMutatva });
      setEredmeny(ki);
    }
  };
  const megoldas = () => {
    setFazis("megoldas");
    setSegitseg(3);
    setKiemelt(null);
    if (eredmeny) setEredmeny({ ...eredmeny, pont: 0 });
  };

  // a pontos ábra ráúszása: 3. szinten halványan a rajz alá (a rajz szerkeszthető marad),
  // a megoldásnál a rajzolt vonal is átúszik a pontosba
  const pontosAbra = segitseg >= 3;
  useEffect(() => {
    if (!pontosAbra) { setAnim(0); return undefined; }
    let kezdet = null;
    const lep = (most) => {
      if (kezdet == null) kezdet = most;
      const t = Math.min(1, (most - kezdet) / 900);
      setAnim(1 - Math.pow(1 - t, 3));
      if (t < 1) rafRef.current = requestAnimationFrame(lep);
    };
    rafRef.current = requestAnimationFrame(lep);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [pontosAbra, jel, fazis]);

  const jelolesek = !!eredmeny && segitseg >= 1;
  const nyomatekosSzakaszok = f.rudak.flatMap((r) => r.szakaszok.map((s_) => ({ r, s_ })));

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-[13px] text-petrol-700">
          <strong>{nev}.</strong> Húzd a fogópontokat a helyes értékre (a rúdra merőlegesen mérve, {sz(lept.lepes.V, 1)} kN / {sz(lept.lepes.M, 1)} kNm lépésekben; a pozitív érték mindhárom ábrán a „+” jellel jelölt oldalon — vízszintes rúdnál lefelé). A töréspontokat megadjuk, az értékeket nem.
        </p>
        <label className="ml-auto flex items-center gap-1.5 text-[12px] text-petrol-600">
          <input type="checkbox" checked={mutatN} onChange={(ev) => { setMutatN(ev.target.checked); if (!ev.target.checked && jel === "N") setJel("V"); }} disabled={zart} />
          haladó: az N-ábrát is{tobbIrany && !mutatN ? " (keretnél / ferde rúdnál érdemes!)" : ""}
        </label>
      </div>

      <Reakciok e={e} tippek={reakcioTippek} onTippek={setReakcioTippek} mutatva={reakciokMutatva} onMutat={() => setReakciokMutatva(true)} zart={zart} />

      {/* fülek */}
      <div className="flex flex-wrap items-center gap-1.5">
        {jelek.map((j) => (
          <button key={j} type="button" onClick={() => setJel(j)} className={`rounded-lg px-3.5 py-1.5 text-[13px] font-bold transition ${jel === j ? "text-white" : "bg-white text-petrol-700 ring-1 ring-petrol-200 hover:bg-petrol-50"}`} style={jel === j ? { backgroundColor: { N: "#059669", V: "#0369a1", M: "#be123c" }[j] } : undefined}>
            {j}-ábra
          </button>
        ))}
        <span className="text-[11.5px] text-petrol-500">{jel === "M" ? "M: a húzott oldalra (vízszintes rúdnál alul pozitív)" : jel === "V" ? "V: a bal oldali rész felfelé mutató erőinek összege — a pozitív érték a tartó pozitív (alsó) oldalán, mint az M-nél" : "N: húzás pozitív — a pozitív érték a tartó pozitív (alsó) oldalán, mint az M-nél"}</span>
      </div>

      <div className="racs-vilagos min-w-0 overflow-hidden rounded-xl border border-[color:var(--keret)]">
        <RajzoloRajz
          svgRef={svgRef}
          f={f}
          e={e}
          jel={jel}
          rajz={rajz}
          alakok={alakok}
          szelsok={szelsok}
          lept={lept}
          anim={fazis === "megoldas" ? anim : 0}
          pontosAbra={pontosAbra ? 0.5 * anim : 0}
          eredmeny={eredmeny}
          jelolesek={jelolesek}
          kiemelt={kiemelt}
          aktiv={aktiv}
          onLe={vaszonLe}
          zart={zart}
          reakciok={reakciok ? 1 : 0}
        />
      </div>

      {/* alak-választók és szélsőérték-kapcsolók az M-hez */}
      {jel === "M" && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-[color:var(--keret)] bg-white px-3 py-2">
          <span className="text-[11px] font-bold tracking-[0.14em] text-petrol-500 uppercase">Az M szakaszainak alakja</span>
          {nyomatekosSzakaszok.map(({ r, s_ }) => {
            const k = s_.k;
            const sz_ = szelsok[r.rud][k];
            const jo = jelolesek && eredmeny ? !eredmeny.hibak.some((h) => (h.kod === "alak" || h.kod === "szelso") && h.rud === r.rud && h.szakasz === k) : null;
            return (
              <div key={`${r.rud}-${k}`} className={`flex items-center gap-1 rounded-lg px-1.5 py-1 ${jo === false ? "ring-1 ring-rose-300" : jo === true ? "ring-1 ring-emerald-300" : ""}`}>
                <span className="szamok text-[12px] text-petrol-600">{f.rudak.length > 1 ? `${r.rud}.${k + 1}` : `${k + 1}.`} <span className="text-petrol-400">({sz(s_.x1, s_.x1 % 1 ? 1 : 0)}–{sz(s_.x2, s_.x2 % 1 ? 1 : 0)} m)</span></span>
                {sz_ ? (
                  <span className="text-[11px] text-amber-700">a szélsőérték-fogópont dönti el</span>
                ) : (
                  ["egyenes", "U", "A"].map((id) => (
                    <button key={id} type="button" disabled={zart} onClick={() => alakValt(r.rud, k, id)} className={`grid h-8 w-8 place-items-center rounded-md transition disabled:cursor-default ${alakok[r.rud][k] === id ? "bg-petrol-800" : "bg-white ring-1 ring-petrol-200 hover:bg-petrol-50"}`} title={id === "egyenes" ? "egyenes (terheletlen szakasz)" : id === "U" ? "parabola a + (húzott) oldal felé domborodva" : "parabola a − oldal felé domborodva"}>
                      <AlakIkon alak={id} szogFok={r.szogFok} szin={alakok[r.rud][k] === id ? "white" : "#be123c"} />
                    </button>
                  ))
                )}
                <button type="button" disabled={zart} onClick={() => szelsoValt(r.rud, k)} className={`ml-1 rounded-md px-2 py-1 text-[11.5px] font-medium transition disabled:cursor-default ${sz_ ? "bg-amber-500 text-white" : "bg-white text-petrol-600 ring-1 ring-petrol-200 hover:bg-amber-50"}`} title="szélsőérték (V = 0) a szakasz belsejében — húzható fogópont">
                  {sz_ ? "◆ szélsőérték be" : "◇ itt van szélsőérték"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* gombok */}
      <div className="flex flex-wrap items-center gap-2">
        {fazis === "rajzol" && (
          <button type="button" onClick={ellenorzes} className="rounded-lg bg-petrol-800 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-petrol-900">
            Ellenőrzés
          </button>
        )}
        {fazis === "ellenorizve" && (
          <button type="button" onClick={javit} className="rounded-lg bg-petrol-800 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-petrol-900">
            Javítom
          </button>
        )}
        {!zart && segitseg < 3 && (
          <button type="button" onClick={segit} className="rounded-lg bg-amber-100 px-4 py-2 text-[13px] font-medium text-amber-900 ring-1 ring-amber-300 transition hover:bg-amber-200" title={SEGITSEG_NEV[segitseg + 1]}>
            Segítség: {SEGITSEG_NEV[segitseg + 1]}
          </button>
        )}
        {!zart && (
          <button type="button" onClick={nullaz} className="rounded-lg bg-white px-4 py-2 text-[13px] font-medium text-petrol-700 ring-1 ring-petrol-200 transition hover:bg-petrol-50">
            Nulláz
          </button>
        )}
        {!zart && (!kihivas || probak > 0) && (
          <button type="button" onClick={megoldas} className="rounded-lg bg-white px-4 py-2 text-[13px] font-medium text-rose-700 ring-1 ring-rose-200 transition hover:bg-rose-50">
            Megoldás és levezetés
          </button>
        )}
        {onVissza && !kihivas && (
          <button type="button" onClick={onVissza} className="rounded-lg bg-white px-4 py-2 text-[13px] font-medium text-petrol-700 ring-1 ring-petrol-200 transition hover:bg-petrol-50">
            ← Vissza az építéshez
          </button>
        )}
        {gyerekek}
        {probak > 0 && <span className="szamok ml-auto text-[12px] text-petrol-500">{probak} próbálkozás</span>}
      </div>

      {eredmeny && fazis !== "megoldas" && <Ertekeles eredmeny={eredmeny} segitseg={segitseg} kiemelt={kiemelt} onKiemel={setKiemelt} probak={probak} kihivas={kihivas} />}

      {fazis === "megoldas" && (
        <div className="min-w-0 space-y-3 overflow-hidden rounded-xl border border-rose-200 bg-white p-3 sm:p-4">
          <p className="text-[13px] text-petrol-700">
            <strong className="text-rose-700">A pontos ábrák és a levezetés.</strong> A rajzod {eredmeny ? `(${eredmeny.pont} pont ezért a körre)` : ""} megmarad fent, a pontos vonal ráúszott. Lent a három ábra egymás alatt, majd a reakciók levezetése a tankönyv receptje szerint.
          </p>
          <div className="racs-vilagos overflow-hidden rounded-xl border border-[color:var(--keret)] p-2">
            <Diagram eredmeny={e} abrak={["N", "V", "M"]} szel={760} reakciok meretek kiemelSzelso={1} />
          </div>
          <TartoLevezetes modell={modell} eredmeny={e} />
        </div>
      )}

      <Szabalyok tomor />
    </div>
  );
}
