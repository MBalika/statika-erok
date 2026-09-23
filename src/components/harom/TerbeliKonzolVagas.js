"use client";

import { useState } from "react";
import { Jelenet3D } from "./Jelenet3D";
import { P, kam, SZIN, RudT, TengelyekT, PadloT, BefogasT, EroNyilT, VektorNyilT, CimkeT, PontT, KorongT } from "./TerbeliAlap";
import { Csuszka } from "@/components/abrak/ErovektorBonto";
import { M, MB } from "@/components/ui/Keplet";
import { igenybevetelek, befogottKonzol, f4, zarK, vekK } from "@/lib/terbeli";
import { sz } from "@/lib/szamok";

/*
 * Térbeli konzol elvágása – felfedező (tankönyv 9.3, H13/2).
 * Tört tengelyű befogott konzol (A az origó, függőleges szár b, vízszintes szár a a −x irányba, a végén F).
 * A keresztmetszet helye csúszkán a tört tengely mentén; a hat igénybevétel-komponens a keresztmetszeten
 * nyilakkal (erők) és kettős nyilakkal (nyomatékok); a levágott rész halványan.
 */

const LE = 0.2;
const LM = 0.07;

export default function TerbeliKonzolVagas() {
  const a = 2;
  const b = 3;
  const [F, setF] = useState([4, -5, 3]);
  const [s, setS] = useState(1.5);
  const [oldal, setOldal] = useState("teher"); // "teher": a terhelt (szabad végi) rész erőiből; "befogas": a befogás felőli részből

  const E = [-a, b, 0];
  const C = [0, b, 0];
  const A = [0, 0, 0];
  const fuggoleges = s < b - 1e-9;
  const K = fuggoleges ? [0, s, 0] : [-(s - b), b, 0];
  const t = fuggoleges ? [0, 1, 0] : [1, 0, 0];
  // a terhelt rész: függőleges száron a K feletti (követő) rész; vízszintes száron a K-tól −x-re eső (megelőző) rész
  const terheltOldal = fuggoleges ? "koveto" : "megelozo";
  const reak = befogottKonzol({ A, terhek: [{ pont: E, F }] });
  const ig =
    oldal === "teher"
      ? igenybevetelek({ K, t, oldal: terheltOldal, erok: [{ pont: E, F }] })
      : igenybevetelek({ K, t, oldal: terheltOldal === "koveto" ? "megelozo" : "koveto", erok: [{ pont: A, F: reak.R }], nyomatekok: [reak.MA] });
  const { R, MK, lista } = ig;
  // a nyilak a megtartott részre hatnak: a megelőző rész keresztmetszetén a pozitív komponens a +tengely felé, a követőén a −tengely felé mutat
  const megtartott = oldal === "teher" ? terheltOldal : terheltOldal === "koveto" ? "megelozo" : "koveto";
  const jel = megtartott === "megelozo" ? 1 : -1;
  const setFk = (i, v) => setF(F.map((c, j) => (j === i ? v : c)));
  const halvany = 0.18;
  const tartoResz = (tol, ig2, op) => <RudT tol={tol} ig={ig2} sugar={0.13} szin={SZIN.tarto} opacitas={op} />;
  const teherOp = megtartott === terheltOldal ? 1 : halvany;
  const befOp = megtartott === terheltOldal ? halvany : 1;
  const rK = fuggoleges ? [E[0] - K[0], E[1] - K[1], E[2] - K[2]] : [E[0] - K[0], 0, 0];
  const rA = [A[0] - K[0], A[1] - K[1], A[2] - K[2]];

  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white">
      <div className="grid lg:grid-cols-[1.3fr_1fr] [&>*]:min-w-0">
        <div className="border-b border-[color:var(--keret)] p-2 lg:border-r lg:border-b-0">
          <Jelenet3D kamera={kam([7.5, 5.5, 9])} cel={P([-1, 1.6, 0])} magassag={420} tavolsagMin={4} tavolsagMax={40}>
            <PadloT meret={16} osztas={16} magassag={-0.01} />
            <TengelyekT hossz={3.2} origo={[0.3, 0, 0.3]} />
            {/* tartó két része */}
            {fuggoleges ? (
              <>
                {tartoResz(A, K, befOp)}
                {tartoResz(K, C, teherOp)}
                {tartoResz(C, E, teherOp)}
              </>
            ) : (
              <>
                {tartoResz(A, C, befOp)}
                {tartoResz(C, K, befOp)}
                {tartoResz(K, E, teherOp)}
              </>
            )}
            <PontT pozicio={C} r={0.16} szin={SZIN.tarto} />
            <BefogasT pozicio={A} normal={[0, 1, 0]} meret={1.8} opacitas={befOp} />
            <CimkeT pozicio={[0.35, -0.35, 0.3]} szin={SZIN.tarto}>A</CimkeT>
            <CimkeT pozicio={[E[0] - 0.4, E[1] + 0.35, 0]} szin={SZIN.tarto} meret={12} vastag={false}>E</CimkeT>
            <EroNyilT pont={E} F={F} leptek={LE} szin={SZIN.teher} cimke={`F = (${sz(F[0], 1)}; ${sz(F[1], 1)}; ${sz(F[2], 1)})`} cimkeEltolas={[0, 0.5, 0]} opacitas={teherOp} />
            {/* reakciók, ha a befogás felőli részből számolunk */}
            {oldal === "befogas" && (
              <>
                <VektorNyilT pont={A} F={reak.R} leptek={LE} szin={SZIN.reakcio} cimke="A" cimkeEltolas={[0.3, 0.3, 0]} />
                <VektorNyilT pont={A} F={reak.MA} leptek={LM} szin={SZIN.nyomatek} kettos vastag={0.08} cimke="M_A" cimkeEltolas={[0.3, 0.3, 0]} minHossz={1.2} />
              </>
            )}
            {/* a keresztmetszet és az igénybevételek */}
            <KorongT pozicio={K} normal={t} r={0.34} />
            <CimkeT pozicio={[K[0] + (fuggoleges ? 0.6 : 0), K[1] + (fuggoleges ? 0 : -0.55), K[2] + 0.2]} szin="#b45309" meret={12}>K</CimkeT>
            {lista.map((el) => {
              if (Math.abs(el.ertek) < 1e-6) return null;
              const idx = el.tengely === "x" ? 0 : el.tengely === "y" ? 1 : 2;
              const v = [0, 0, 0];
              v[idx] = el.ertek * jel;
              const ero = el.fajta === "ero";
              return (
                <VektorNyilT
                  key={el.nev}
                  pont={K}
                  F={v}
                  leptek={ero ? LE : LM}
                  szin={ero ? SZIN.kek : SZIN.nyomatek}
                  kettos={!ero}
                  vastag={ero ? 0.07 : 0.07}
                  minHossz={ero ? 0.8 : 1.0}
                  cimke={`${el.nev.replace("_", "")} = ${sz(el.ertek, 2)}`}
                  cimkeEltolas={[idx === 0 ? 0.5 * Math.sign(v[0]) : 0.15, idx === 1 ? 0.35 * Math.sign(v[1]) : ero ? 0.25 : -0.3, idx === 2 ? 0.5 * Math.sign(v[2]) : 0]}
                />
              );
            })}
          </Jelenet3D>
          <p className="mt-1 text-center text-[11.5px] text-petrol-400">
            A sárga korong a K keresztmetszet; kék nyilak: N és a nyíróerők, bordó kettős nyilak: T és a hajlítónyomatékok — a megtartott (nem halvány) részre ható belső erők.
          </p>
        </div>

        <div className="p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {[
              ["teher", "a terhelt rész erőiből"],
              ["befogas", "a befogás felőli részből (reakciókkal)"],
            ].map(([k, nev]) => (
              <button key={k} type="button" onClick={() => setOldal(k)} className={`rounded-lg px-2.5 py-1.5 text-[12px] font-medium ring-1 transition ${oldal === k ? "bg-petrol-800 text-white ring-petrol-800" : "bg-white text-petrol-600 ring-petrol-200 hover:bg-petrol-50"}`}>
                {nev}
              </button>
            ))}
          </div>
          <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Csuszka cimke="a keresztmetszet helye a tengely mentén A-tól (s)" ertek={s} egyseg="m" min={0.25} max={a + b - 0.25} lepes={0.25} tizedes={2} onChange={setS} />
            </div>
            {["x", "y", "z"].map((k, i) => (
              <Csuszka key={k} cimke={`F${k}`} ertek={F[i]} egyseg="kN" min={-10} max={10} lepes={0.5} tizedes={1} onChange={(v) => setFk(i, v)} />
            ))}
          </div>

          <div className="mt-4 rounded-xl bg-petrol-50 p-3">
            <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">
              K = ({sz(K[0], 2)}; {sz(K[1], 2)}; {sz(K[2], 2)}), tengely: {fuggoleges ? "y" : "x"} — {fuggoleges ? "a követő rész a K feletti" : "a követő rész a K-tól +x felé eső (a sarok felőli)"}
            </p>
            <div className="szamok mt-1 space-y-0.5 text-[12.5px] text-petrol-800">
              {oldal === "teher" ? (
                <>
                  <MB>{`\\underline R_K = ${terheltOldal === "koveto" ? "+" : "-"}\\underline F = ${vekK(R)}\\ \\text{kN}`}</MB>
                  <MB>{`\\underline M_K = ${terheltOldal === "koveto" ? "+" : "-"}(\\underline r_{E} - \\underline r_K)\\times\\underline F = ${terheltOldal === "koveto" ? "" : "-"}${vekK(rK)}\\times${vekK(F)} = ${vekK(MK)}\\ \\text{kNm}`}</MB>
                </>
              ) : (
                <>
                  <MB>{`\\underline R_K = ${terheltOldal === "koveto" ? "-" : "+"}\\underline A = ${vekK(R)}\\ \\text{kN}`}</MB>
                  <MB>{`\\underline M_K = ${terheltOldal === "koveto" ? "-" : "+"}\\big[(\\underline r_A - \\underline r_K)\\times\\underline A + \\underline M_A\\big] = ${terheltOldal === "koveto" ? "-" : ""}\\big[${vekK(rA)}\\times${vekK(reak.R)} + ${vekK(reak.MA)}\\big] = ${vekK(MK)}`}</MB>
                </>
              )}
              <MB>{lista.map((el) => `${el.tex} = ${f4(el.ertek)}`).join(",\\quad ")}</MB>
            </div>
          </div>
          <div className="mt-3 rounded-xl border border-naracs-200 bg-naracs-50 px-4 py-3 text-[13px] leading-relaxed text-petrol-800">
            <p>
              <strong>Előjelek (tankönyv 9.3):</strong> <M>{"N"}</M> pozitív, ha húz (a keresztmetszetből kifelé mutat); <M>{"T"}</M> pozitív, ha a nyomatékvektora kifelé mutat; a nyíróerők és a hajlítónyomatékok akkor pozitívak, ha a{" "}
              <em>megelőző</em> rész keresztmetszetén a globális tengelyek pozitív irányába mutatnak (a <em>követő</em> rész keresztmetszetén ugyanezek a negatív irányba mutató nyilak). Mindkét részből ugyanaz jön ki — kapcsold át, és nézd meg.
              {fuggoleges ? " A függőleges száron a lokális tengely az y: itt N a függőleges erő, a csavarónyomaték a T = M_y." : " A vízszintes száron a tengely az x: a csavarónyomaték a T = M_x, a két hajlítónyomaték M_y és M_z."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
