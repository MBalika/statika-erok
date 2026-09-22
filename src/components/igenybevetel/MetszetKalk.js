"use client";

import { useMemo, useState } from "react";
import { elemez } from "@/lib/tarto";
import { SABLONOK, alapParameterek } from "@/lib/tarto/sablonok";
import { Csuszka } from "@/components/abrak/ErovektorBonto";
import Diagram, { helyIvhosszon, osszHossz, SZINEK } from "@/components/igenybevetel/Diagram";
import { reszErok, tagok, kiir } from "@/components/igenybevetel/BalResz";
import { M as Keplet, MB } from "@/components/ui/Keplet";
import { sz, szK } from "@/lib/szamok";

/**
 * Keresztmetszet-kalkulátor: egy választható vízszintes tartón (kéttámaszú,
 * konzol, konzolos) az x helyen megadott K keresztmetszet N, V, M értéke —
 * a bal oldali rész egyensúlyából, a tankönyv (8.5) egyenértékűsége szerint,
 * a \Fx / \Fy / \Mp írásmóddal kiírt levezetéssel.
 */

const HASZNALT = ["kettamaszu", "konzol", "konzolos"];
const k = (v, t = 2) => szK(v, t);

export default function MetszetKalk() {
  const sablonok = SABLONOK.filter((s) => HASZNALT.includes(s.id));
  const [sablonId, setSablonId] = useState(sablonok[0].id);
  const sablon = sablonok.find((s) => s.id === sablonId);
  const [parak, setParak] = useState(() => alapParameterek(sablonok[0]));
  const [xK, setXK] = useState(2.5);

  const valt = (id) => {
    const uj = sablonok.find((s) => s.id === id);
    setSablonId(id);
    setParak(alapParameterek(uj));
    setXK(1.5);
  };

  const bemenet = useMemo(() => sablon.keszit(parak), [sablon, parak]);
  const e = useMemo(() => { try { return elemez(bemenet); } catch (err) { return { ok: false, hibak: [err.message] }; } }, [bemenet]);

  if (!e.ok) {
    return <div className="my-6 rounded-2xl border border-rose-300 bg-rose-50 p-5 text-[14px] text-petrol-800">Nem megoldható: {(e.hibak ?? []).join(" ")}</div>;
  }

  const teljes = osszHossz(e);
  const s = Math.min(xK, teljes);
  const minX = e.modell.csomopontok[0].x;
  const xs = minX + s;
  const hely = helyIvhosszon(e, s);
  const { N, V, M } = hely.ertek;
  const bal = reszErok(e, minX, xs);

  const oN = tagok(bal, (f) => (f.Fx ? [{ ertek: -f.Fx, kif: k(Math.abs(f.Fx)) }] : []));
  const oV = tagok(bal, (f) => (f.Fy ? [{ ertek: f.Fy, kif: f.fajta === "megoszlo" ? `${k(Math.abs(f.qy), 1)}\\cdot ${k(f.hossz)}` : k(Math.abs(f.Fy)) }] : []));
  const oM = tagok(bal, (f) => {
    const t = [];
    if (f.Fy) t.push({ ertek: f.Fy * (xs - f.x), kif: `${f.fajta === "megoszlo" ? `${k(Math.abs(f.qy), 1)}\\cdot ${k(f.hossz)}` : k(Math.abs(f.Fy))}\\cdot ${k(xs - f.x)}` });
    if (f.M) t.push({ ertek: -f.M, kif: k(Math.abs(f.M)) });
    return t;
  });
  const erokNevei = bal.map((f) => (f.fajta === "reakcio" || f.fajta === "reakcioNyomatek" ? `\\underline{${f.nev.replace(/_(\w+)/, "_{$1}")}}` : f.fajta === "megoszlo" ? "\\underline{p}" : f.fajta === "nyomatek" ? "M" : "\\underline{F}"));
  const negal = (o) => kiir(o.lista, -1);

  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white shadow-sm shadow-petrol-900/[0.04]">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-b border-[color:var(--keret)] bg-linear-to-r from-petrol-800 to-petrol-700 px-5 py-3.5">
        <span className="rounded-md bg-naracs-500 px-2 py-0.5 text-[10.5px] font-bold tracking-[0.14em] text-white uppercase">Kalkulátor</span>
        <h3 className="text-[15px] font-semibold text-white">Igénybevétel egy adott keresztmetszetben</h3>
        <span className="ml-auto text-[11.5px] text-petrol-200">a bal részből, levezetéssel</span>
      </div>
      <div className="flex flex-wrap gap-1.5 border-b border-[color:var(--keret)] bg-petrol-50/60 px-4 py-2.5">
        {sablonok.map((sb) => (
          <button key={sb.id} type="button" onClick={() => valt(sb.id)}
            className={`rounded-lg px-3 py-1.5 text-[12.5px] font-semibold transition ${sb.id === sablonId ? "bg-petrol-800 text-white" : "bg-white text-petrol-700 ring-1 ring-petrol-200 hover:bg-petrol-50"}`}>
            {sb.nev}
          </button>
        ))}
      </div>
      <div className="grid lg:grid-cols-[1.2fr_1fr] [&>*]:min-w-0">
        <div className="racs-vilagos border-b border-[color:var(--keret)] p-3 lg:border-r lg:border-b-0">
          <Diagram eredmeny={e} abrak={["N", "V", "M"]} amp={30} metszet={s} />
          <p className="mt-1 text-center text-[11.5px] text-petrol-500">A szaggatott vonal a K keresztmetszet; a pontok az ábrákon a K-beli értékek.</p>
        </div>
        <div className="finom-gorgeto max-h-[720px] overflow-y-auto p-4 sm:p-5">
          <p className="text-[13px] text-petrol-500">{sablon.leiras}</p>
          <div className="mt-3 space-y-2.5">
            {sablon.parameterek.map((par) => (
              <Csuszka key={par.id} cimke={par.nev} ertek={parak[par.id]} egyseg={par.egyseg} min={par.min} max={par.max} lepes={par.lepes} tizedes={par.lepes < 1 ? 1 : 0}
                onChange={(v) => setParak((p) => ({ ...p, [par.id]: v }))} />
            ))}
            <Csuszka cimke="A K keresztmetszet helye, x (a bal végtől)" ertek={s} egyseg="m" min={0} max={teljes} lepes={0.05} tizedes={2} onChange={setXK} />
          </div>

          <div className="szamok mt-4 grid grid-cols-3 gap-2 text-center">
            {[["N", N, "kN"], ["V", V, "kN"], ["M", M, "kNm"]].map(([jel, v, egys]) => (
              <div key={jel} className="rounded-lg bg-petrol-50 px-2 py-1.5 ring-1 ring-petrol-200">
                <div className="text-[11px] font-semibold" style={{ color: SZINEK[jel] }}>{jel}<sub>K</sub></div>
                <div className="text-[14px] font-semibold text-petrol-900">{sz(v, 2)}</div>
                <div className="text-[10.5px] text-petrol-400">{egys}</div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">Levezetés — a K-tól balra eső rész egyensúlyából</p>
          <div className="proza mt-1.5 text-[13px] leading-relaxed text-petrol-800">
            <p>
              <strong>Elkülönítés.</strong> A tartót elvágjuk a K keresztmetszetben (x = {sz(s, 2)} m), és a bal részt vizsgáljuk. Rá hat{bal.length ? ":" : " — semmi (a bal végtől számolva még nincs erő)."}{" "}
              {bal.map((f, i) => (
                <span key={i}>
                  {i > 0 ? ", " : ""}
                  {f.fajta === "megoszlo" ? `p = ${sz(Math.abs(f.qy), 1)} kN/m a ${sz(f.hossz, 2)} m hosszon (eredője ${sz(Math.abs(f.Fy), 2)} kN, a K-tól ${sz(xs - f.x, 2)} m-re)` :
                    f.fajta === "ero" ? `F = ${sz(Math.hypot(f.Fx, f.Fy), 2)} kN az x = ${sz(f.x - minX, 2)} m-nél` :
                    f.fajta === "nyomatek" ? `M = ${sz(Math.abs(f.M), 1)} kNm (${f.M > 0 ? "↶" : "↷"})` :
                    f.fajta === "reakcioNyomatek" ? `a ${sz(Math.abs(f.M), 2)} kNm befogási nyomaték (${f.M > 0 ? "↶" : "↷"})` :
                    `a ${sz(Math.hypot(f.Fx, f.Fy), 2)} kN reakció (${f.nev.replace("_", "")}) az x = ${sz(f.x - minX, 2)} m-nél`}
                </span>
              ))}
              {bal.length ? ", és a keresztmetszeten a pozitív értelemben felvett N_K (→), V_K (↓) és M_K (↶) belső erők." : ""}
            </p>
            <p className="mt-2"><strong>Egyensúlyi kijelentés.</strong></p>
            <MB>{`(${erokNevei.length ? erokNevei.join(", ") + ", " : ""}\\underline{N}_K, \\underline{V}_K, M_K) \\ekv \\underline{O}`}</MB>
            <p className="mt-2"><strong>Egyismeretlenes egyenletek.</strong> Vízszintes vetület (a bal rész vízszintes erői + a jobbra mutató, pozitív N_K):</p>
            <MB>{`\\Fx ${oN.szoveg === "0" ? "N_K" : negal(oN) + " + N_K"} = 0 \\ \\Rightarrow\\ N_K = ${k(N)}\\ \\text{kN}`}</MB>
            <p>Függőleges vetület (a pozitív V_K a bal rész keresztmetszetén lefelé mutat, ezért −V_K):</p>
            <MB>{`\\Fy ${oV.szoveg === "0" ? "-V_K" : oV.szoveg + " - V_K"} = 0 \\ \\Rightarrow\\ V_K = ${k(V)}\\ \\text{kN}`}</MB>
            <p>Nyomaték a K pontra (a pozitív M_K a bal részen ↶; a K-n átmenő N_K, V_K karja nulla):</p>
            <MB>{`\\Mp{K} ${oM.szoveg === "0" ? "M_K" : negal(oM) + " + M_K"} = 0 \\ \\Rightarrow\\ M_K = ${k(M)}\\ \\text{kNm}`}</MB>
            <p className="mt-2"><strong>Ugyanez a tankönyv rövid írásmódjával</strong> — a bal oldali erők vetülete a megadott irányra közvetlenül az igénybevételt adja:</p>
            <MB>{`(\\leftarrow):\\ N_K = ${oN.szoveg} = ${k(N)}\\ \\text{kN}`}</MB>
            <MB>{`(\\uparrow):\\ V_K = ${oV.szoveg} = ${k(V)}\\ \\text{kN}`}</MB>
            <MB>{`(\\curvearrowright):\\ M_K = ${oM.szoveg} = ${k(M)}\\ \\text{kNm}`}</MB>
            <p className="mt-2 text-[12px] text-petrol-500">
              Értelmezés: <Keplet>{"N_K"}</Keplet> {N > 1e-6 ? "pozitív: húzás" : N < -1e-6 ? "negatív: nyomás" : "nulla"};{" "}
              <Keplet>{"M_K"}</Keplet> {M > 1e-6 ? "pozitív: az alsó oldal húzott" : M < -1e-6 ? "negatív: a felső oldal húzott" : "nulla"}.
              A jobb részből számolva ugyanezt kell kapni — próbáld ki fejben ellenőrzésnek.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
