"use client";

import { useState } from "react";
import { Jelenet3D, Nyil3D, Vonal3D, Cimke3D, Tengelyek3D, Racs3D, Pont3D } from "./Jelenet3D";
import { Csuszka } from "@/components/abrak/ErovektorBonto";
import { M, MB } from "@/components/ui/Keplet";
import { sz, szK } from "@/lib/szamok";

/*
 * Nyomaték tengelyre – interaktív 3D.
 *   M_t = M_Q · e_t, ahol Q a tengely egy pontja (itt az origó).
 * Az erő és a helyvektor komponensei csúszkával, a tengely iránya azimuttal és emelkedéssel.
 */

const RAD = Math.PI / 180;
const FS = 0.45; // rajzlépték az erőhöz (egység / kN)
const MS = 0.09; // rajzlépték a nyomatékhoz (egység / kNm)
const ZOLD = "#0f766e";
const NAR = "#e2590a";
const LILA = "#7c3aed";
const BORDO = "#be123c";
const SZURKE = "#475569";

const kereszt = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const skalar = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const hossz = (a) => Math.hypot(a[0], a[1], a[2]);
const skal = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];

const ESETEK = [
  { nev: "metszi a tengelyt", r: [3, 0, 3], F: [0, 5, 0], azimut: 0, emel: 45 },
  { nev: "párhuzamos vele", r: [0, 3, 0], F: [4, 0, 4], azimut: 0, emel: 45 },
  { nev: "kitérő", r: [0, 3, 0], F: [0, 0, -5], azimut: 0, emel: 45 },
];

export default function TengelyNyomatekFelfedezo() {
  const [r, setR] = useState([2, 3, 1]);
  const [F, setF] = useState([3, -2, 4]);
  const [azimut, setAzimut] = useState(35);
  const [emel, setEmel] = useState(25);

  const et = [Math.cos(emel * RAD) * Math.cos(azimut * RAD), Math.cos(emel * RAD) * Math.sin(azimut * RAD), Math.sin(emel * RAD)];
  const MO = kereszt(r, F);
  const Mt = skalar(MO, et);
  const Fh = hossz(F);
  const rh = hossz(r);

  // osztályozás: párhuzamos, metsző vagy kitérő
  const FxE = kereszt(F, et);
  const parhuzamos = Fh > 1e-9 && hossz(FxE) < 1e-6 * Math.max(1, Fh);
  const egysiku = Math.abs(skalar(r, FxE)) < 1e-6 * Math.max(1, rh * Fh); // r, F, e_t egy síkban → a hatásvonal metszi a tengelyt
  const metszi = !parhuzamos && egysiku && Fh > 1e-9;
  const nullaEro = Fh < 1e-9;
  const nulla = Math.abs(Mt) < 1e-6;

  // rajz
  const P = r;
  const Fveg = add(P, skal(F, FS));
  const Mveg = skal(MO, MS);
  const Mtveg = skal(et, Mt * MS);
  const tHossz = 9;

  const beallit = (e) => {
    setR(e.r);
    setF(e.F);
    setAzimut(e.azimut);
    setEmel(e.emel);
  };
  const komp = (v) => `(${szK(v[0], 1)};\\ ${szK(v[1], 1)};\\ ${szK(v[2], 1)})`;
  const zk = (v, d) => (v < 0 ? `(${szK(v, d)})` : szK(v, d));

  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white">
      <div className="grid lg:grid-cols-[1.35fr_1fr] [&>*]:min-w-0">
        <div className="border-b border-[color:var(--keret)] p-2 lg:border-r lg:border-b-0">
          <Jelenet3D kamera={[13, -15, 10]} cel={[1, 1, 1.5]} magassag={400}>
            <Racs3D meret={20} osztas={10} />
            <Tengelyek3D hossz={6} />

            {/* a t tengely az origón át */}
            <Vonal3D tol={skal(et, -tHossz)} ig={skal(et, tHossz)} szin={SZURKE} vastag={2.2} />
            <Nyil3D tol={skal(et, tHossz - 1)} ig={skal(et, tHossz)} szin={SZURKE} vastag={0.06} />
            <Cimke3D pozicio={skal(et, tHossz + 0.7)} szin={SZURKE} meret={13}><i>t</i></Cimke3D>
            <Nyil3D tol={[0, 0, 0]} ig={skal(et, 1.5)} szin="#0369a1" vastag={0.07} />
            <Cimke3D pozicio={add(skal(et, 1.5), [0, 0, -0.6])} szin="#0369a1" meret={11.5} vastag={false}>e<sub>t</sub></Cimke3D>

            {/* r és F */}
            <Nyil3D tol={[0, 0, 0]} ig={P} szin={ZOLD} vastag={0.07} />
            <Cimke3D pozicio={add(skal(P, 0.5), [0, 0, 0.5])} szin={ZOLD}>r</Cimke3D>
            <Pont3D pozicio={P} r={0.16} szin={ZOLD} />
            {Fh > 1e-9 && (
              <>
                <Vonal3D tol={add(P, skal(F, -4 / Fh))} ig={add(P, skal(F, 4 / Fh))} szin={NAR} szaggatott opacitas={0.5} />
                <Nyil3D tol={P} ig={Fveg} szin={NAR} vastag={0.1} />
                <Cimke3D pozicio={add(Fveg, [0, 0, 0.6])} szin={NAR}>F = {sz(Fh, 2)} kN</Cimke3D>
              </>
            )}

            {/* M_O és a vetülete a tengelyre */}
            {hossz(MO) > 1e-6 && (
              <>
                <Nyil3D tol={[0, 0, 0]} ig={Mveg} szin={LILA} vastag={0.11} />
                <Cimke3D pozicio={add(Mveg, [0, 0, 0.6])} szin={LILA}>M<sub>O</sub> = {sz(hossz(MO), 1)} kNm</Cimke3D>
                <Vonal3D tol={Mveg} ig={Mtveg} szin={LILA} szaggatott opacitas={0.6} />
              </>
            )}
            {!nulla && (
              <>
                <Nyil3D tol={[0, 0, 0]} ig={Mtveg} szin={BORDO} vastag={0.14} />
                <Cimke3D pozicio={add(Mtveg, skal([-et[1], et[0], 0], 0.9))} szin={BORDO}>M<sub>t</sub> = {sz(Mt, 1)}</Cimke3D>
              </>
            )}
            {nulla && hossz(MO) > 1e-6 && (
              <Cimke3D pozicio={[0, 0, -0.8]} szin={BORDO} meret={12}>M<sub>t</sub> = 0</Cimke3D>
            )}
          </Jelenet3D>
          <p className="mt-1 text-center text-[11.5px] text-petrol-400">
            Forgasd a jelenetet. A bordó nyíl a lila M<sub>O</sub> vetülete a t tengelyre.
          </p>
        </div>

        <div className="p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {ESETEK.map((e) => (
              <button
                key={e.nev}
                type="button"
                onClick={() => beallit(e)}
                className="rounded-lg bg-white px-2.5 py-1.5 text-[12px] font-medium text-petrol-600 ring-1 ring-petrol-200 transition hover:bg-petrol-50"
              >
                {e.nev}
              </button>
            ))}
          </div>
          <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2">
            {["x", "y", "z"].map((k, i) => (
              <Csuszka key={`r${k}`} cimke={`r${k}`} ertek={r[i]} egyseg="m" min={-5} max={5} lepes={0.5} tizedes={1} onChange={(v) => setR(r.map((c, j) => (j === i ? v : c)))} />
            ))}
            {["x", "y", "z"].map((k, i) => (
              <Csuszka key={`F${k}`} cimke={`F${k}`} ertek={F[i]} egyseg="kN" min={-8} max={8} lepes={0.5} tizedes={1} onChange={(v) => setF(F.map((c, j) => (j === i ? v : c)))} />
            ))}
            <Csuszka cimke="tengely azimutja, φ" ertek={azimut} egyseg="°" min={0} max={359} lepes={1} tizedes={0} onChange={setAzimut} />
            <Csuszka cimke="tengely emelkedése, ϑ" ertek={emel} egyseg="°" min={-89} max={89} lepes={1} tizedes={0} onChange={setEmel} />
          </div>

          <div className="mt-4 rounded-xl bg-petrol-50 p-3">
            <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">Élőben</p>
            <div className="szamok mt-1 space-y-0.5 text-[13px] text-petrol-800">
              <MB>{`\\underline{M}_O = \\underline{r}\\times\\underline{F} = ${komp(MO)}\\ \\text{kNm}`}</MB>
              <MB>{`\\underline{e}_t = ${komp(et)}`}</MB>
              <MB>{`M_t = \\underline{M}_O\\cdot\\underline{e}_t = ${zk(MO[0], 1)}\\cdot${zk(et[0], 2)} + ${zk(MO[1], 1)}\\cdot${zk(et[1], 2)} + ${zk(MO[2], 1)}\\cdot${zk(et[2], 2)} = ${szK(Mt, 2)}\\ \\text{kNm}`}</MB>
            </div>
          </div>

          <div className={`mt-3 rounded-xl border px-4 py-3 ${nulla ? "border-emerald-300 bg-emerald-50" : "border-naracs-200 bg-naracs-50"}`}>
            <p className={`text-[10.5px] font-bold tracking-[0.16em] uppercase ${nulla ? "text-emerald-800" : "text-naracs-700"}`}>
              {nulla ? "Mₜ = 0 — nem forgat a tengely körül" : "Forgat a tengely körül"}
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-petrol-800">
              {nullaEro
                ? "Nincs erő."
                : parhuzamos
                  ? "Az erő párhuzamos a t tengellyel — nincs forgató hatása rá."
                  : metszi
                    ? "Az erő hatásvonala metszi a t tengelyt — a karja nulla, nem forgat."
                    : nulla
                      ? "A nyomatékvektor merőleges a tengelyre."
                      : `Az erő hatásvonala kitérő a tengelyhez képest. Mₜ = ${sz(Mt, 2)} kNm: a t felől nézve ${Mt > 0 ? "az óramutatóval ellentétesen" : "az óramutató járásával egyezően"} forgat.`}
            </p>
            <p className="mt-1 text-[12px] text-petrol-500">
              Q a tengely bármely pontja lehet: az r tengelyirányú változtatása csak az M tengelyre merőleges részét módosítja.
            </p>
          </div>
          <p className="mt-2 text-[12px] text-petrol-500">
            <M>{"M_t = \\underline{M}_Q\\cdot\\underline{e}_t"}</M> — előjel: a tengely pozitív vége felől nézve az óramutatóval ellentétes a pozitív.
          </p>
        </div>
      </div>
    </div>
  );
}
