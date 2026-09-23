"use client";

import { useEffect, useRef, useState } from "react";
import { Jelenet3D } from "./Jelenet3D";
import { P, kam, SZIN, RudT, TengelyekT, PadloT, BefogasT, EroNyilT, VektorNyilT, CimkeT, PontT, VonalT } from "./TerbeliAlap";
import { Csuszka } from "@/components/abrak/ErovektorBonto";
import { M, MB } from "@/components/ui/Keplet";
import { befogottKonzol, f4, tagK, zarK } from "@/lib/terbeli";
import { sz } from "@/lib/szamok";

/*
 * Forgatható szabadtest-ábra: mereven befogott, tört tengelyű térbeli konzol (tankönyv 9.3. ábra, H13/1).
 * A: befogás az origóban, függőleges szár b, vízszintes szár a (−x irányba), a végén F erő (három komponens).
 * Gombra a befogás eltűnik, és a hat reakciókomponens animálva nő ki; mellette a hat egyenlet élő számokkal.
 */

const LE = 0.22; // egység / kN
const LM = 0.08; // egység / kNm

export default function TerbeliSzabadtest() {
  const [a, setA] = useState(2);
  const [b, setB] = useState(3);
  const [F, setF] = useState([4, -5, 3]);
  const [elkulonitve, setElkulonitve] = useState(false);
  const [u, setU] = useState(0);
  const raf = useRef(null);

  const E = [-a, b, 0];
  const C = [0, b, 0];
  const A = [0, 0, 0];
  const eredm = befogottKonzol({ A, terhek: [{ pont: E, F }] });
  const { R, MA } = eredm;

  useEffect(() => {
    const cel = elkulonitve ? 1 : 0;
    let t0 = null;
    const kezdo = u;
    const lep = (most) => {
      if (t0 == null) t0 = most;
      const k = Math.min(1, (most - t0) / 900);
      const s = k * k * (3 - 2 * k);
      setU(kezdo + (cel - kezdo) * s);
      if (k < 1) raf.current = requestAnimationFrame(lep);
    };
    raf.current = requestAnimationFrame(lep);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elkulonitve]);

  const setFk = (i, v) => setF(F.map((c, j) => (j === i ? v : c)));
  const komp = ["x", "y", "z"];
  const rxF = [E[1] * F[2] - E[2] * F[1], E[2] * F[0] - E[0] * F[2], E[0] * F[1] - E[1] * F[0]];

  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white">
      <div className="grid lg:grid-cols-[1.3fr_1fr] [&>*]:min-w-0">
        <div className="border-b border-[color:var(--keret)] p-2 lg:border-r lg:border-b-0">
          <Jelenet3D kamera={kam([7.5, 5.5, 9])} cel={P([-1, 1.6, 0])} magassag={420} tavolsagMin={4} tavolsagMax={40}>
            <PadloT meret={16} osztas={16} magassag={-0.01} />
            <TengelyekT hossz={3.2} origo={[0.3, 0, 0.3]} />
            {/* a tartó */}
            <RudT tol={A} ig={C} sugar={0.13} szin={SZIN.tarto} />
            <RudT tol={C} ig={E} sugar={0.13} szin={SZIN.tarto} />
            <PontT pozicio={C} r={0.16} szin={SZIN.tarto} />
            <CimkeT pozicio={[0.35, -0.35, 0.3]} szin={SZIN.tarto}>A</CimkeT>
            <CimkeT pozicio={[E[0] - 0.4, E[1] + 0.35, 0]} szin={SZIN.tarto} meret={12} vastag={false}>E(−{sz(a, 1)}; {sz(b, 1)}; 0)</CimkeT>
            {/* méretek */}
            <VonalT tol={[-a, b + 0.6, 0]} ig={[0, b + 0.6, 0]} szin="#64748b" vastag={1.2} />
            <CimkeT pozicio={[-a / 2, b + 0.95, 0]} szin="#475569" meret={11.5} vastag={false}>a = {sz(a, 1)} m</CimkeT>
            <VonalT tol={[0.7, 0, 0]} ig={[0.7, b, 0]} szin="#64748b" vastag={1.2} />
            <CimkeT pozicio={[1.3, b / 2, 0]} szin="#475569" meret={11.5} vastag={false}>b = {sz(b, 1)} m</CimkeT>
            {/* befogás */}
            <BefogasT pozicio={A} normal={[0, 1, 0]} meret={1.8} opacitas={1 - u} />
            {/* a teher */}
            <EroNyilT pont={E} F={F} leptek={LE} szin={SZIN.teher} cimke={`F = ${sz(Math.hypot(...F), 2)} kN`} cimkeEltolas={[0, 0.5, 0]} />
            {/* reakciók */}
            {u > 0.02 && (
              <>
                {komp.map((k, i) => {
                  const v = [0, 0, 0];
                  v[i] = R[i];
                  return Math.abs(R[i]) > 1e-6 ? <VektorNyilT key={`R${k}`} pont={A} F={v} leptek={LE} szin={SZIN.reakcio} u={u} cimke={`A${k} = ${sz(R[i], 2)}`} cimkeEltolas={[i === 0 ? 0.6 : 0, i === 1 ? 0.45 : -0.3 * (i === 2), i === 2 ? 0.6 : 0]} /> : null;
                })}
                {komp.map((k, i) => {
                  const v = [0, 0, 0];
                  v[i] = MA[i];
                  return Math.abs(MA[i]) > 1e-6 ? <VektorNyilT key={`M${k}`} pont={A} F={v} leptek={LM} szin={SZIN.nyomatek} u={u} kettos vastag={0.08} cimke={`MA${k} = ${sz(MA[i], 2)}`} cimkeEltolas={[i === 0 ? 0.9 : 0.3, i === 1 ? 0.5 : -0.65, i === 2 ? 0.9 : 0]} minHossz={1.2} /> : null;
                })}
              </>
            )}
          </Jelenet3D>
          <p className="mt-1 text-center text-[11.5px] text-petrol-400">
            Forgasd a jelenetet. Narancs: teher; lila: reakcióerő-komponensek; bordó kettős nyíl: befogási nyomaték-komponensek (nyomatékvektor).
          </p>
        </div>

        <div className="p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setElkulonitve((v) => !v)}
              className={`rounded-lg px-3 py-2 text-[13px] font-semibold transition ${elkulonitve ? "bg-white text-petrol-700 ring-1 ring-petrol-200 hover:bg-petrol-50" : "bg-naracs-500 text-white hover:bg-naracs-600"}`}
            >
              {elkulonitve ? "Vissza a befogáshoz" : "Elkülönítés: a befogás helyett reakciók"}
            </button>
            <button type="button" onClick={() => { setA(2); setB(3); setF([4, -5, 3]); }} className="rounded-lg bg-white px-2.5 py-2 text-[12px] font-medium text-petrol-600 ring-1 ring-petrol-200 hover:bg-petrol-50">
              alaphelyzet
            </button>
          </div>
          <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2">
            <Csuszka cimke="a (vízszintes szár)" ertek={a} egyseg="m" min={0.5} max={4} lepes={0.5} tizedes={1} onChange={setA} />
            <Csuszka cimke="b (függőleges szár)" ertek={b} egyseg="m" min={1} max={5} lepes={0.5} tizedes={1} onChange={setB} />
            {komp.map((k, i) => (
              <Csuszka key={k} cimke={`F${k}`} ertek={F[i]} egyseg="kN" min={-10} max={10} lepes={0.5} tizedes={1} onChange={(v) => setFk(i, v)} />
            ))}
          </div>

          <div className="mt-4 rounded-xl bg-petrol-50 p-3">
            <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">A hat egyensúlyi egyenlet – élőben</p>
            <div className="szamok mt-1 space-y-0.5 text-[12.5px] text-petrol-800">
              <MB>{`(\\underline F, \\underline A, \\underline M_A) \\ekv \\underline O`}</MB>
              <MB>{`\\Fx ${f4(F[0])} + A_x = 0 \\Rightarrow A_x = ${f4(R[0])}`}</MB>
              <MB>{`\\Fy ${f4(F[1])} + A_y = 0 \\Rightarrow A_y = ${f4(R[1])}`}</MB>
              <MB>{`\\Fz ${f4(F[2])} + A_z = 0 \\Rightarrow A_z = ${f4(R[2])}`}</MB>
              <MB>{`\\sum M_{ix}: \\ ${f4(E[1])}\\cdot${zarK(F[2])} - 0\\cdot${zarK(F[1])} + M_{Ax} = 0 \\Rightarrow M_{Ax} = ${f4(MA[0])}`}</MB>
              <MB>{`\\sum M_{iy}: \\ 0\\cdot${zarK(F[0])} - ${zarK(E[0])}\\cdot${zarK(F[2])} + M_{Ay} = 0 \\Rightarrow M_{Ay} = ${f4(MA[1])}`}</MB>
              <MB>{`\\sum M_{iz}: \\ ${zarK(E[0])}\\cdot${zarK(F[1])} - ${f4(E[1])}\\cdot${zarK(F[0])} + M_{Az} = 0 \\Rightarrow M_{Az} = ${f4(MA[2])}`}</MB>
            </div>
          </div>
          <div className="mt-3 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-[13px] leading-relaxed text-petrol-800">
            <p>
              Vektorosan: <M>{"\\underline A = -\\underline F"}</M>, <M>{"\\underline M_A = -\\underline r_E\\times\\underline F"}</M>, ahol{" "}
              <M>{`\\underline r_E\\times\\underline F = (${f4(rxF[0])};\\ ${f4(rxF[1])};\\ ${f4(rxF[2])})`}</M> kNm. Az <M>{"A"}</M> ponton átmenő tengelyekre a reakcióerők nem forgatnak (metszik a tengelyt), ezért mind a hat egyenlet
              egyismeretlenes. Ellenőrzés: <M>{`\\sum M_{iE}`}</M> az <M>{"E"}</M> pontra: <M>{`${tagK(MA[0])}\\ ${tagK(-(E[1] * R[2] - E[2] * R[1]))} = 0`}</M> (x-komponens) ✓.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
