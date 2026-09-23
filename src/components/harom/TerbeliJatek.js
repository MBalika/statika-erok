"use client";

import { useEffect, useRef, useState } from "react";
import JatekKeret from "@/components/ui/JatekKeret";
import { Jelenet3D } from "./Jelenet3D";
import { P, kam, SZIN, RudT, TengelyekT, PadloT, TalpT, EroNyilT, VektorNyilT, CimkeT, PontT, rudStilus } from "./TerbeliAlap";
import { bakallvany } from "@/lib/terbeli";
import { sz } from "@/lib/szamok";

/*
 * „Melyik rúd húzott?” – játék a 3D bakállványon.
 * Körönként új véletlen teher (irány + nagyság) és néha új lábelrendezés. Tippeld meg mindhárom rúd előjelét
 * (húzott / nyomott) és azt, melyik rúdban a legnagyobb |S|. Ellenőrzéskor a rudak beszíneződnek, a rúderő-nyilak
 * animálva nőnek ki. Pont körönként: 25 minden helyes előjelre + 25 a legnagyobb rúdért; a végén az átlag.
 */

const OSSZ_KOR = 5;
const RAD = Math.PI / 180;
const ELRENDEZESEK = [
  [[-4, 0, 0], [5, 0, -4], [5, 0, 4]],
  [[0, 0, 4], [0, 0, 0], [5, 0, -4]],
  [[-3, 0, 3], [-3, 0, -3], [4, 0, 0]],
  [[-4, 0, -2], [3, 0, -3], [1, 0, 4]],
];
const egesz = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
const valaszt = (t) => t[Math.floor(Math.random() * t.length)];

function ujKor() {
  for (let proba = 0; proba < 100; proba++) {
    const labak = valaszt(ELRENDEZESEK);
    const h = valaszt([4, 5, 6]);
    const csucs = [0, h, 0];
    const Fn = egesz(6, 16);
    const az = egesz(0, 71) * 5;
    const em = valaszt([-75, -60, -45, -30, -15, 0, 15, 30]);
    const F = [Fn * Math.cos(em * RAD) * Math.cos(az * RAD), Fn * Math.sin(em * RAD), -Fn * Math.cos(em * RAD) * Math.sin(az * RAD)];
    const er = bakallvany({ csucs, labak, F });
    if (!er.ok) continue;
    const abs = er.S.map(Math.abs);
    const rendezett = [...abs].sort((a, b) => b - a);
    if (rendezett[0] - rendezett[1] < 0.8) continue; // legyen egyértelmű a legnagyobb
    if (abs.some((v) => v < 0.4)) continue; // ne legyen „majdnem nulla” rúd
    const maxIdx = abs.indexOf(rendezett[0]);
    return { labak, csucs, h, F, Fn, az, em, S: er.S, e: er.e, maxIdx };
  }
  const labak = ELRENDEZESEK[0];
  const csucs = [0, 6, 0];
  const F = [-7.071, -7.071, 0];
  const er = bakallvany({ csucs, labak, F });
  return { labak, csucs, h: 6, F, Fn: 10, az: 180, em: -45, S: er.S, e: er.e, maxIdx: 0 };
}

export default function TerbeliJatek() {
  const [kor, setKor] = useState(1);
  const [adat, setAdat] = useState(null);
  const [tipp, setTipp] = useState([0, 0, 0]); // 1 húzott, −1 nyomott, 0 nincs tipp
  const [maxTipp, setMaxTipp] = useState(-1);
  const [fazis, setFazis] = useState("tipp"); // tipp | mutat | kesz
  const [pontok, setPontok] = useState([]);
  const [u, setU] = useState(0);
  const raf = useRef(null);

  useEffect(() => {
    setAdat(ujKor());
  }, []);

  useEffect(() => {
    if (fazis !== "mutat") return undefined;
    let t0 = null;
    const lep = (most) => {
      if (t0 == null) t0 = most;
      const k = Math.min(1, (most - t0) / 1100);
      setU(k * k * (3 - 2 * k));
      if (k < 1) raf.current = requestAnimationFrame(lep);
    };
    raf.current = requestAnimationFrame(lep);
    return () => cancelAnimationFrame(raf.current);
  }, [fazis]);

  if (!adat) return <div className="my-6 h-64 animate-pulse rounded-2xl border border-[color:var(--keret)] bg-white" />;

  const { labak, csucs, F, Fn, S, e, maxIdx } = adat;
  const Smax = Math.max(1, ...S.map(Math.abs));
  const teljes = tipp.every((v) => v !== 0) && maxTipp >= 0;
  const korPont = () => {
    let p = 0;
    S.forEach((s, i) => {
      if (Math.sign(s) === tipp[i]) p += 25;
    });
    if (maxTipp === maxIdx) p += 25;
    return p;
  };
  const ellenoriz = () => {
    if (!teljes || fazis !== "tipp") return;
    const p = korPont();
    setPontok((l) => [...l, p]);
    setU(0);
    setFazis("mutat");
  };
  const kovetkezo = () => {
    if (kor >= OSSZ_KOR) {
      setFazis("kesz");
      return;
    }
    setKor((k) => k + 1);
    setAdat(ujKor());
    setTipp([0, 0, 0]);
    setMaxTipp(-1);
    setU(0);
    setFazis("tipp");
  };
  const ujJatek = () => {
    setKor(1);
    setPontok([]);
    setAdat(ujKor());
    setTipp([0, 0, 0]);
    setMaxTipp(-1);
    setU(0);
    setFazis("tipp");
  };
  const osszPont = pontok.length ? pontok.reduce((a, b) => a + b, 0) / OSSZ_KOR : 0;
  const atlagEddig = pontok.length ? pontok.reduce((a, b) => a + b, 0) / pontok.length : 0;
  const mutat = fazis !== "tipp";
  const utolso = pontok[pontok.length - 1];

  const uzenet =
    fazis === "tipp" ? (
      <>Nézd meg, merre húz a teher: a rúd, amelyik „alátámaszt”, nyomott; amelyik „visszatart”, húzott. A legnagyobb rúderő általában abban a rúdban van, amelyik a teher irányához a legközelebb áll.</>
    ) : fazis === "mutat" ? (
      <>
        {utolso === 100 ? "Tökéletes kör!" : utolso >= 50 ? "Részben jó." : "Ezt nézd meg jobban:"}{" "}
        S₁ = {sz(S[0], 2)}, S₂ = {sz(S[1], 2)}, S₃ = {sz(S[2], 2)} kN — a legnagyobb a(z) {maxIdx + 1}-es rúdban. Ebben a körben {utolso} pont.
      </>
    ) : (
      <>Eddigi átlag: {sz(atlagEddig, 0)} pont.</>
    );

  return (
    <JatekKeret cim="Melyik rúd húzott?" leiras="Egy háromlábú bakállványt véletlen irányú erő terhel. Tippeld meg mindhárom rúd előjelét és a legnagyobb rúderőt — utána a 3D modell megmutatja a valóságot." pont={fazis === "kesz" ? osszPont : atlagEddig} kor={kor} osszKor={OSSZ_KOR} kesz={fazis === "kesz"} onUj={ujJatek} uzenet={uzenet}>
      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr] [&>*]:min-w-0">
        <div>
          <Jelenet3D kamera={kam([11, 8, 14])} cel={P([1, 2.5, 0])} magassag={380} tavolsagMin={5} tavolsagMax={50}>
            <PadloT meret={20} osztas={20} magassag={-0.01} />
            <TengelyekT hossz={4} origo={[0, 0, 0]} />
            {labak.map((p, i) => {
              const st = rudStilus(S[i], Smax);
              const szin = mutat ? st.szin : tipp[i] === 1 ? "#fca5a5" : tipp[i] === -1 ? "#93c5fd" : SZIN.rud;
              const sugar = mutat ? 0.09 + (st.sugar - 0.09) * u : 0.09;
              return (
                <group key={i}>
                  <RudT tol={csucs} ig={p} sugar={sugar} szin={szin} />
                  <TalpT pozicio={p} />
                  <CimkeT pozicio={[(csucs[0] + p[0]) / 2, (csucs[1] + p[1]) / 2 + 0.35, (csucs[2] + p[2]) / 2]} szin={mutat ? st.szin : SZIN.tarto} meret={12.5}>
                    {i + 1}
                    {mutat && u > 0.6 ? `: ${sz(S[i], 1)} kN` : ""}
                  </CimkeT>
                  <CimkeT pozicio={[p[0], -0.45, p[2]]} szin="#475569" meret={11} vastag={false}>({p[0]}; 0; {p[2]})</CimkeT>
                  {mutat && Math.abs(S[i]) > 0.05 && <VektorNyilT pont={csucs} F={[e[i][0] * S[i], e[i][1] * S[i], e[i][2] * S[i]]} leptek={0.12} szin={st.szin} vastag={0.06} minHossz={0.6} u={u} />}
                </group>
              );
            })}
            <PontT pozicio={csucs} r={0.2} szin={SZIN.tarto} />
            <EroNyilT pont={csucs} F={F} leptek={0.2} szin={SZIN.teher} cimke={`F = ${Fn} kN`} cimkeEltolas={[0, 0.5, 0]} />
          </Jelenet3D>
          <p className="mt-1 text-center text-[11.5px] text-petrol-400">Forgasd a modellt, mielőtt tippelsz! F = ({sz(F[0], 1)}; {sz(F[1], 1)}; {sz(F[2], 1)}) kN, a csúcs (0; {csucs[1]}; 0).</p>
        </div>
        <div>
          <div className="space-y-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex flex-wrap items-center gap-2 rounded-xl border border-petrol-100 bg-petrol-50/60 px-3 py-2">
                <span className="w-14 text-[13px] font-semibold text-petrol-800">{i + 1}. rúd</span>
                {[
                  [1, "húzott", "bg-rose-600 text-white", "text-rose-700 ring-rose-300"],
                  [-1, "nyomott", "bg-sky-700 text-white", "text-sky-800 ring-sky-300"],
                ].map(([v, nev, aktiv, passziv]) => (
                  <button key={nev} type="button" disabled={fazis !== "tipp"} onClick={() => setTipp(tipp.map((t, j) => (j === i ? v : t)))} className={`rounded-lg px-3 py-1.5 text-[12.5px] font-semibold ring-1 transition disabled:opacity-70 ${tipp[i] === v ? aktiv + " ring-transparent" : "bg-white " + passziv}`}>
                    {nev}
                  </button>
                ))}
                {mutat && <span className={`ml-auto text-[12px] font-semibold ${Math.sign(S[i]) === tipp[i] ? "text-emerald-700" : "text-rose-700"}`}>{Math.sign(S[i]) === tipp[i] ? "✓ +25" : `✗ (${S[i] > 0 ? "húzott" : "nyomott"})`}</span>}
              </div>
            ))}
            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-petrol-100 bg-petrol-50/60 px-3 py-2">
              <span className="text-[13px] font-semibold text-petrol-800">Legnagyobb |S|:</span>
              {[0, 1, 2].map((i) => (
                <button key={i} type="button" disabled={fazis !== "tipp"} onClick={() => setMaxTipp(i)} className={`rounded-lg px-3 py-1.5 text-[12.5px] font-semibold ring-1 transition disabled:opacity-70 ${maxTipp === i ? "bg-petrol-800 text-white ring-transparent" : "bg-white text-petrol-700 ring-petrol-200"}`}>
                  {i + 1}. rúd
                </button>
              ))}
              {mutat && <span className={`ml-auto text-[12px] font-semibold ${maxTipp === maxIdx ? "text-emerald-700" : "text-rose-700"}`}>{maxTipp === maxIdx ? "✓ +25" : `✗ (${maxIdx + 1}.)`}</span>}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {fazis === "tipp" && (
              <button type="button" disabled={!teljes} onClick={ellenoriz} className="rounded-lg bg-naracs-500 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-naracs-600 disabled:opacity-40">
                Ellenőrzés
              </button>
            )}
            {fazis === "mutat" && (
              <button type="button" onClick={kovetkezo} className="rounded-lg bg-petrol-800 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-petrol-900">
                {kor >= OSSZ_KOR ? "Eredmény" : "Következő kör →"}
              </button>
            )}
          </div>
          {pontok.length > 0 && (
            <div className="szamok mt-3 flex flex-wrap gap-1.5">
              {pontok.map((p, i) => (
                <span key={i} className={`rounded-full px-2.5 py-1 text-[12px] font-semibold ${p === 100 ? "bg-emerald-100 text-emerald-800" : p >= 50 ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"}`}>
                  {i + 1}. kör: {p}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </JatekKeret>
  );
}
