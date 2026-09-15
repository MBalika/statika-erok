"use client";

import { useMemo, useState } from "react";
import * as THREE from "three";
import { Jelenet3D, Nyil3D, Vonal3D, Cimke3D, Tengelyek3D, Racs3D, Pont3D } from "./Jelenet3D";
import { Csuszka } from "@/components/abrak/ErovektorBonto";
import { M, MB } from "@/components/ui/Keplet";
import { sz, szK } from "@/lib/szamok";

/*
 * Felület mentén megoszló teher és a terhelési test – interaktív 3D.
 * Egy L×b lemezen q [kN/m²] teher; a lemez mellett a gerenda, amire a
 * vonal menti p = q·b [kN/m] teher jut. Kapcsoló: háromszög alakú tehermező
 * (a szélesség b·x/L, ezért a vonal menti teher lineárisan változik).
 */

const QS = 0.16; // rajzmagasság / (kN/m²)
const PS = 0.045; // rajzmagasság / (kN/m)
const NAR = "#e2590a";
const LILA = "#7c3aed";
const TEAL = "#0f766e";
const YB = -1.3; // a gerenda y-helye (a lemez előtt)

function TerhelesiTest({ L, b, H, haromszog }) {
  const geo = useMemo(() => {
    const alak = new THREE.Shape();
    alak.moveTo(0, 0);
    alak.lineTo(L, 0);
    alak.lineTo(L, b);
    if (!haromszog) alak.lineTo(0, b);
    alak.closePath();
    return new THREE.ExtrudeGeometry(alak, { depth: H, bevelEnabled: false });
  }, [L, b, H, haromszog]);
  return (
    <mesh geometry={geo}>
      <meshStandardMaterial color={NAR} transparent opacity={0.22} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

function Lemez({ L, b, haromszog }) {
  const geo = useMemo(() => {
    const alak = new THREE.Shape();
    alak.moveTo(0, 0);
    alak.lineTo(L, 0);
    alak.lineTo(L, b);
    if (!haromszog) alak.lineTo(0, b);
    alak.closePath();
    return new THREE.ExtrudeGeometry(alak, { depth: 0.12, bevelEnabled: false });
  }, [L, b, haromszog]);
  return (
    <mesh geometry={geo} position={[0, 0, -0.12]}>
      <meshStandardMaterial color="#8ec3cd" transparent opacity={0.9} />
    </mesh>
  );
}

export default function TeherLepelFelfedezo() {
  const [L, setL] = useState(4);
  const [b, setB] = useState(2);
  const [q, setQ] = useState(5);
  const [haromszog, setHaromszog] = useState(false);
  const [nyilak, setNyilak] = useState(true);

  const H = q * QS;
  const pMax = q * b; // kN/m (a legszélesebb helyen)
  const R = haromszog ? (pMax * L) / 2 : pMax * L; // = a terhelési test térfogata × q-lépték
  const xR = haromszog ? (2 * L) / 3 : L / 2;
  const yS = haromszog ? b / 3 : b / 2;
  const terfogat = haromszog ? (L * b) / 2 : L * b; // m² (× q = R)

  // nyílmező a lemezen
  const mezo = [];
  if (nyilak) {
    const nx = Math.max(4, Math.round(L * 2));
    const ny = Math.max(2, Math.round(b * 2));
    for (let i = 0; i <= nx; i++) {
      for (let j = 0; j <= ny; j++) {
        const x = (i / nx) * L;
        const y = (j / ny) * b;
        if (haromszog && y > (b * x) / L + 1e-9) continue;
        mezo.push([x, y]);
      }
    }
  }
  // vonal menti nyilak a gerendán
  const nb = Math.max(6, Math.round(L * 3));
  const gerendaNyilak = Array.from({ length: nb + 1 }, (_, i) => {
    const x = (i / nb) * L;
    const p = haromszog ? (pMax * x) / L : pMax;
    return { x, mag: p * PS };
  });

  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white">
      <div className="grid lg:grid-cols-[1.35fr_1fr]">
        <div className="border-b border-[color:var(--keret)] p-2 lg:border-r lg:border-b-0">
          <Jelenet3D kamera={[5.8, -5.6, 3.4]} cel={[L / 2, b / 2 - 0.4, 0.5]} magassag={420} tavolsagMin={2} tavolsagMax={30}>
            <Racs3D meret={14} osztas={14} />
            <Tengelyek3D hossz={1.2} />

            {/* a lemez és a terhelési test */}
            <Lemez L={L} b={b} haromszog={haromszog} />
            <TerhelesiTest L={L} b={b} H={H} haromszog={haromszog} />
            {mezo.map(([x, y], i) => (
              <Nyil3D key={i} tol={[x, y, H]} ig={[x, y, 0.02]} szin={NAR} vastag={0.018} fejHossz={0.1} />
            ))}
            <Cimke3D pozicio={[L / 2, b, H + 0.35]} szin={NAR} meret={12}>q = {sz(q, 1)} kN/m²</Cimke3D>
            {/* a terhelési test súlypontja és az eredő */}
            <Nyil3D tol={[xR, yS, H + 0.3 + R * 0.03]} ig={[xR, yS, 0.03]} szin={LILA} vastag={0.05} />
            <Pont3D pozicio={[xR, yS, 0]} r={0.05} szin={LILA} />
            <Cimke3D pozicio={[xR, yS, H + 0.55 + R * 0.03]} szin={LILA} meret={12.5}>R = {sz(R, 1)} kN</Cimke3D>
            {/* méretek */}
            <Vonal3D tol={[0, -0.35, 0]} ig={[L, -0.35, 0]} szin="#64748b" vastag={1.2} />
            <Cimke3D pozicio={[L / 2, -0.55, 0]} szin="#64748b" meret={11} vastag={false}>L = {sz(L, 1)} m</Cimke3D>
            <Vonal3D tol={[L + 0.35, 0, 0]} ig={[L + 0.35, b, 0]} szin="#64748b" vastag={1.2} />
            <Cimke3D pozicio={[L + 0.75, b / 2, 0]} szin="#64748b" meret={11} vastag={false}>b = {sz(b, 1)} m</Cimke3D>

            {/* vetítés jele: szaggatott vonalak a lemez széleitől a gerendáig */}
            <Vonal3D tol={[0, 0, 0]} ig={[0, YB, 0]} szin={TEAL} szaggatott opacitas={0.5} />
            <Vonal3D tol={[L, 0, 0]} ig={[L, YB, 0]} szin={TEAL} szaggatott opacitas={0.5} />

            {/* a gerenda a vonal menti teherrel */}
            <mesh position={[L / 2, YB, -0.14]}>
              <boxGeometry args={[L, 0.28, 0.28]} />
              <meshStandardMaterial color="#c7dde3" />
            </mesh>
            {gerendaNyilak.map((n, i) =>
              n.mag > 0.04 ? <Nyil3D key={i} tol={[n.x, YB, n.mag]} ig={[n.x, YB, 0.02]} szin={TEAL} vastag={0.022} fejHossz={0.12} /> : null,
            )}
            {/* a teherábra felső éle */}
            <Vonal3D tol={[0, YB, haromszog ? 0 : pMax * PS]} ig={[L, YB, pMax * PS]} szin={TEAL} vastag={2} />
            <Cimke3D pozicio={[L, YB, pMax * PS + 0.3]} szin={TEAL} meret={12}>
              p = q·b = {sz(pMax, 1)} kN/m
            </Cimke3D>
            <Nyil3D tol={[xR, YB, pMax * PS + 0.35 + R * 0.03]} ig={[xR, YB, 0.03]} szin={LILA} vastag={0.05} opacitas={0.85} />
            <Cimke3D pozicio={[xR, YB - 0.5, 0]} szin={LILA} meret={11} vastag={false}>x_R = {sz(xR, 2)} m</Cimke3D>
          </Jelenet3D>
          <p className="mt-1 text-center text-[11.5px] text-petrol-400">Forgasd a jelenetet. Elölről nézve a gerendán a síkbeli teherábrát látod.</p>
        </div>

        <div className="p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setHaromszog((v) => !v)}
              className={`rounded-lg px-2.5 py-1.5 text-[12px] font-medium ring-1 transition ${haromszog ? "bg-naracs-500 text-white ring-naracs-500" : "bg-white text-petrol-600 ring-petrol-200 hover:bg-petrol-50"}`}
            >
              háromszög alakú tehermező
            </button>
            <button
              type="button"
              onClick={() => setNyilak((v) => !v)}
              className={`rounded-lg px-2.5 py-1.5 text-[12px] font-medium ring-1 transition ${nyilak ? "bg-white text-petrol-600 ring-petrol-200 hover:bg-petrol-50" : "bg-petrol-800 text-white ring-petrol-800"}`}
            >
              {nyilak ? "nyílmező elrejtése" : "nyílmező mutatása"}
            </button>
          </div>
          <div className="space-y-3">
            <Csuszka cimke="a lemez hossza, L" ertek={L} egyseg="m" min={2} max={8} lepes={0.5} tizedes={1} onChange={setL} />
            <Csuszka cimke="a tehermező szélessége, b" ertek={b} egyseg="m" min={0.5} max={4} lepes={0.5} tizedes={1} onChange={setB} />
            <Csuszka cimke="felületi intenzitás, q" ertek={q} egyseg="kN/m²" min={0.5} max={10} lepes={0.5} tizedes={1} onChange={setQ} />
          </div>

          <div className="mt-4 rounded-xl bg-petrol-50 p-3">
            <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">Élőben</p>
            <div className="szamok mt-1 text-[13px] text-petrol-800">
              {haromszog ? (
                <>
                  <MB>{`p_{max} = q\\,b = ${szK(q, 1)}\\cdot ${szK(b, 1)} = ${szK(pMax, 2)}\\ \\text{kN/m}\\quad(\\text{a széles végen})`}</MB>
                  <MB>{`R = \\tfrac12\\,p_{max}\\,L = \\tfrac12\\cdot ${szK(pMax, 2)}\\cdot ${szK(L, 1)} = ${szK(R, 2)}\\ \\text{kN},\\quad x_R = \\tfrac{2L}{3} = ${szK(xR, 2)}\\ \\text{m}`}</MB>
                </>
              ) : (
                <>
                  <MB>{`p = q\\,b = ${szK(q, 1)}\\cdot ${szK(b, 1)} = ${szK(pMax, 2)}\\ \\text{kN/m}`}</MB>
                  <MB>{`R = p\\,L = ${szK(pMax, 2)}\\cdot ${szK(L, 1)} = ${szK(R, 2)}\\ \\text{kN},\\quad x_R = \\tfrac{L}{2} = ${szK(xR, 2)}\\ \\text{m}`}</MB>
                </>
              )}
            </div>
          </div>
          <div className="mt-3 rounded-xl border border-naracs-200 bg-naracs-50 px-4 py-3">
            <p className="text-[10.5px] font-bold tracking-[0.16em] text-naracs-700 uppercase">A terhelési test</p>
            <p className="mt-1 text-[13px] leading-relaxed text-petrol-800">
              Az eredő a terhelési test „térfogata”: <M>{`q\\cdot A_{mező} = ${szK(q, 1)}\\cdot ${szK(terfogat, 2)} = ${szK(R, 2)}\\ \\text{kN}`}</M>, és a
              test súlypontján megy át (lila pont). A gerendán ugyanez a teher már vonal menti: az egy méterre jutó rész a{" "}
              <em>b szélességű sáv</em> terhe, <M>{"p = q\\,b"}</M>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
