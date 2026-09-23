"use client";

import { useState } from "react";
import { Jelenet3D } from "./Jelenet3D";
import { P, kam, SZIN, RudT, TengelyekT, PadloT, TalpT, EroNyilT, VektorNyilT, CimkeT, PontT, VonalT, rudStilus } from "./TerbeliAlap";
import { Csuszka } from "@/components/abrak/ErovektorBonto";
import { M, MB } from "@/components/ui/Keplet";
import { bakallvany, f4, zarK } from "@/lib/terbeli";
import { sz } from "@/lib/szamok";

/*
 * Háromlábú bakállvány – felfedező (tankönyv 9.2. ábra, H13/3).
 * A csúcs a (0, h, 0) pont, a lábak talppontjai a földön; a teher a csúcson hat, iránya
 * azimuttal és emelkedéssel állítható. A három rúderő élőben: piros = húzott, kék = nyomott,
 * vastagság ∝ |S|; mellette a csomópont három vetületi egyenlete (9.3)–(9.5).
 */

const RAD = Math.PI / 180;
const LE = 0.22;

const ELRENDEZESEK = [
  { nev: "H13/3", labak: [[-4, 0, 0], [5, 0, -4], [5, 0, 4]], h: 6 },
  { nev: "vizsgaminta", labak: [[0, 0, 4], [0, 0, 0], [5, 0, -4]], h: 6 },
  { nev: "szimmetrikus", labak: [[-3, 0, 3], [-3, 0, -3], [4, 0, 0]], h: 5 },
];

export default function TerbeliBakallvany() {
  const [elr, setElr] = useState(0);
  const [h, setH] = useState(6);
  const [Fn, setFn] = useState(10);
  const [azimut, setAzimut] = useState(200);
  const [emel, setEmel] = useState(-45);
  const [xEltol, setXEltol] = useState(0);
  const [zEltol, setZEltol] = useState(0);

  const labak = ELRENDEZESEK[elr].labak;
  const csucs = [xEltol, h, zEltol];
  const F = [Fn * Math.cos(emel * RAD) * Math.cos(azimut * RAD), Fn * Math.sin(emel * RAD), -Fn * Math.cos(emel * RAD) * Math.sin(azimut * RAD)];
  const er = bakallvany({ csucs, labak, F });
  const { S, e, l, ok } = er;
  const Smax = ok ? Math.max(1, ...S.map((s) => Math.abs(s))) : 1;

  const valaszt = (i) => {
    setElr(i);
    setH(ELRENDEZESEK[i].h);
    setXEltol(0);
    setZEltol(0);
  };
  const tag = (i, k) => `${e[i][k] < 0 ? "-" : "+"} S_${i + 1}\\,\\tfrac{${f4(Math.abs(labak[i][k] - csucs[k]))}}{${f4(l[i])}}`;
  const komp = ["x", "y", "z"];
  const cimkeMakro = ["\\Fx", "\\Fy", "\\Fz"];

  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white">
      <div className="grid lg:grid-cols-[1.3fr_1fr] [&>*]:min-w-0">
        <div className="border-b border-[color:var(--keret)] p-2 lg:border-r lg:border-b-0">
          <Jelenet3D kamera={kam([11, 8, 14])} cel={P([1, 2.5, 0])} magassag={420} tavolsagMin={5} tavolsagMax={50}>
            <PadloT meret={20} osztas={20} magassag={-0.01} />
            <TengelyekT hossz={4} origo={[0, 0, 0]} />
            {labak.map((p, i) => {
              const st = rudStilus(ok ? S[i] : 0, Smax);
              return (
                <group key={i}>
                  <RudT tol={csucs} ig={p} sugar={st.sugar} szin={st.szin} />
                  <TalpT pozicio={p} />
                  <CimkeT pozicio={[(csucs[0] + p[0]) / 2, (csucs[1] + p[1]) / 2 + 0.35, (csucs[2] + p[2]) / 2]} szin={st.szin} meret={12}>
                    {i + 1}: S = {ok ? sz(S[i], 2) : "–"} kN
                  </CimkeT>
                  <VonalT tol={[p[0], 0, 0]} ig={p} szin="#94a3b8" szaggatott opacitas={0.6} />
                  <VonalT tol={[0, 0, p[2]]} ig={p} szin="#94a3b8" szaggatott opacitas={0.6} />
                  <CimkeT pozicio={[p[0], -0.45, p[2]]} szin="#475569" meret={11} vastag={false}>({sz(p[0], 0)}; 0; {sz(p[2], 0)})</CimkeT>
                </group>
              );
            })}
            <PontT pozicio={csucs} r={0.2} szin={SZIN.tarto} />
            <CimkeT pozicio={[csucs[0] + 0.5, csucs[1] + 0.4, csucs[2]]} szin={SZIN.tarto} meret={12} vastag={false}>C({sz(csucs[0], 1)}; {sz(h, 1)}; {sz(csucs[2], 1)})</CimkeT>
            <VonalT tol={[csucs[0], 0, csucs[2]]} ig={csucs} szin="#94a3b8" szaggatott opacitas={0.6} />
            <EroNyilT pont={csucs} F={F} leptek={LE} szin={SZIN.teher} cimke={`F = ${sz(Fn, 1)} kN`} cimkeEltolas={[0, 0.5, 0]} />
            {/* a csomópontra ható rúderők (elkülönítés): kis nyilak a csúcsban */}
            {ok &&
              S.map((s, i) => (Math.abs(s) > 0.05 ? <VektorNyilT key={`s${i}`} pont={csucs} F={[e[i][0] * s, e[i][1] * s, e[i][2] * s]} leptek={0.12} szin={rudStilus(s, Smax).szin} vastag={0.06} minHossz={0.6} /> : null))}
          </Jelenet3D>
          <p className="mt-1 text-center text-[11.5px] text-petrol-400">Piros rúd: húzott (S &gt; 0), kék: nyomott (S &lt; 0); a vastagság a rúderő nagyságával nő. A csúcsban a kis nyilak a csomópontra ható rúderők.</p>
        </div>

        <div className="p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {ELRENDEZESEK.map((el, i) => (
              <button key={el.nev} type="button" onClick={() => valaszt(i)} className={`rounded-lg px-2.5 py-1.5 text-[12px] font-medium ring-1 transition ${i === elr ? "bg-petrol-800 text-white ring-petrol-800" : "bg-white text-petrol-600 ring-petrol-200 hover:bg-petrol-50"}`}>
                {el.nev}
              </button>
            ))}
          </div>
          <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2">
            <Csuszka cimke="F nagysága" ertek={Fn} egyseg="kN" min={0} max={20} lepes={0.5} tizedes={1} onChange={setFn} />
            <Csuszka cimke="csúcs magassága, h" ertek={h} egyseg="m" min={2} max={9} lepes={0.5} tizedes={1} onChange={setH} />
            <Csuszka cimke="teher iránya: azimut φ (x-től z felé negatív)" ertek={azimut} egyseg="°" min={0} max={359} lepes={5} tizedes={0} onChange={setAzimut} />
            <Csuszka cimke="teher iránya: emelkedés ϑ" ertek={emel} egyseg="°" min={-90} max={60} lepes={5} tizedes={0} onChange={setEmel} />
            <Csuszka cimke="a csúcs x-eltolása" ertek={xEltol} egyseg="m" min={-3} max={3} lepes={0.5} tizedes={1} onChange={setXEltol} />
            <Csuszka cimke="a csúcs z-eltolása" ertek={zEltol} egyseg="m" min={-3} max={3} lepes={0.5} tizedes={1} onChange={setZEltol} />
          </div>

          <div className="mt-4 rounded-xl bg-petrol-50 p-3">
            <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">A csomópont egyensúlya – élőben</p>
            <div className="szamok mt-1 space-y-0.5 text-[12.5px] text-petrol-800">
              <MB>{"(\\underline F, \\underline S_1, \\underline S_2, \\underline S_3) \\ekv \\underline O"}</MB>
              <MB>{`\\underline F = (${f4(F[0])};\\ ${f4(F[1])};\\ ${f4(F[2])})\\ \\text{kN},\\quad l_1 = ${f4(l[0])},\\ l_2 = ${f4(l[1])},\\ l_3 = ${f4(l[2])}\\ \\text{m}`}</MB>
              {komp.map((k, i) => (
                <MB key={k}>{`${cimkeMakro[i]} ${zarK(F[i])} ${tag(0, i)} ${tag(1, i)} ${tag(2, i)} = 0`}</MB>
              ))}
              {ok ? (
                <MB>{`S_1 = ${f4(S[0])},\\quad S_2 = ${f4(S[1])},\\quad S_3 = ${f4(S[2])}\\ \\text{kN}`}</MB>
              ) : (
                <p className="text-[13px] text-rose-700">A három rúd egy síkba esik — nincs egyértelmű megoldás (kritikus elrendezés).</p>
              )}
            </div>
          </div>
          <div className="mt-3 rounded-xl border border-naracs-200 bg-naracs-50 px-4 py-3 text-[13px] leading-relaxed text-petrol-800">
            <p>
              A rúderőt <strong>húzóerőként</strong> vesszük fel: a csomópontra <M>{"S_i\\,\\underline e_i"}</M> hat, ahol <M>{"\\underline e_i"}</M> a csúcsból a talppont felé mutat, komponensei <M>{"l_{ix}/l_i"}</M> stb. — a tankönyv (9.3)–(9.5)
              egyenleteinek ± előjeleit itt a vetületek előjele adja. {ok && S.some((s) => s < 0) ? "A kék (nyomott) rúd valójában a csúcsot tolja, a negatív előjel ezt mondja." : ""}{" "}
              Próbáld: húzd a terhet felfelé (ϑ &gt; 0) — mind a három rúd húzottá válhat; csökkentsd <M>{"h"}</M>-t — a laposodó rudakban ugyanahhoz a teherhez egyre nagyobb rúderő kell; told a csúcsot valamelyik láb fölé — az a rúd
              majdnem egyedül viszi a függőleges terhet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
