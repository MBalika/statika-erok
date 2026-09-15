"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { Jelenet3D, Nyil3D, Cimke3D, Racs3D, Pont3D } from "./Jelenet3D";

/*
 * Jobbkezes koordináta-rendszer – interaktív 3D (tankönyv 2.1.3).
 *   – a három tengely színes nyilakkal (x piros, y zöld, z kék),
 *   – gombbal választható, melyik tengely körül forgatunk: a jelenetben körív-nyíl
 *     mutatja a pozitív forgásirányt, és egy áttetsző „papírlap” lassan elfordul,
 *   – „nézd a tengely felől”: a kamera a választott tengely pozitív végére áll,
 *     ekkor látszik, hogy a pozitív forgatás az óramutatóval ellentétes.
 *
 * A pozitív forgatás ciklikus: x körül y → z, y körül z → x, z körül x → y.
 */

const TENGELYEK = [
  { nev: "x", szin: "#dc2626", e: [1, 0, 0] },
  { nev: "y", szin: "#16a34a", e: [0, 1, 0] },
  { nev: "z", szin: "#2563eb", e: [0, 0, 1] },
];
const HOSSZ = 4.2;
const IV_R = 2.3;
const LAP = 2.6;
const CEL = [0.6, 0.6, 0.6];

// Kameraállások a tengely pozitív vége felől (a kamera „up” vektora z, ezért a
// z tengelynél egy hajszálnyit eltolunk, hogy a nézet ne legyen elfajult).
const NEZET_TENGELYROL = [
  [13, 0.6, 0.6],
  [0.6, 13, 0.6],
  [0.6, -0.4, 13],
];
const NEZET_ALTALANOS = [8.5, -10, 6.5];

const skal = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];

/** A kamera beállítása gombnyomásra (az OrbitControls a jelenet „default” vezérlője). */
function KameraVezerlo({ nezet }) {
  const camera = useThree((s) => s.camera);
  const controls = useThree((s) => s.controls);
  useEffect(() => {
    if (!nezet) return;
    camera.up.set(0, 0, 1);
    camera.position.set(...nezet.pozicio);
    if (controls) {
      controls.target.set(...CEL);
      controls.update();
    } else {
      camera.lookAt(...CEL);
    }
  }, [nezet, camera, controls]);
  return null;
}

/** Körív-nyíl a tengely körül, a pozitív forgásirányban (j → k). */
function ForgasIv({ tengely }) {
  const pontok = useMemo(() => {
    const j = (tengely + 1) % 3;
    const k = (tengely + 2) % 3;
    const ej = TENGELYEK[j].e;
    const ek = TENGELYEK[k].e;
    const lista = [];
    const N = 40;
    const veg = (300 * Math.PI) / 180;
    for (let i = 0; i <= N; i++) {
      const t = (veg * i) / N;
      lista.push(add(skal(ej, IV_R * Math.cos(t)), skal(ek, IV_R * Math.sin(t))));
    }
    return lista;
  }, [tengely]);
  const szin = TENGELYEK[tengely].szin;
  const utolso = pontok[pontok.length - 1];
  const elozo = pontok[pontok.length - 3];
  // nyílhegy: rövid nyíl az ív érintője mentén
  const irany = add(utolso, skal(elozo, -1));
  const h = Math.hypot(...irany) || 1;
  const hegyVeg = add(utolso, skal(irany, 0.55 / h));
  return (
    <group>
      <Line points={pontok} color={szin} lineWidth={3} />
      <Nyil3D tol={elozo} ig={hegyVeg} szin={szin} vastag={0.06} fejHossz={0.45} />
      <Cimke3D pozicio={add(skal(TENGELYEK[tengely].e, 0.35), skal(pontok[22], 1.28))} szin={szin} meret={11.5} vastag={false}>
        pozitív forgatás
      </Cimke3D>
    </group>
  );
}

/** Áttetsző „papírlap” a másik két tengely síkjában, amely lassan elfordul pozitív irányban. */
function PapirLap({ tengely }) {
  const forgo = useRef();
  const ido = useRef(0);
  const j = (tengely + 1) % 3;
  const k = (tengely + 2) % 3;

  // Bázis: helyi x → e_j, helyi y → e_k, helyi z → e_i (ciklikus, tehát valódi forgatás).
  const alap = useMemo(() => {
    const m = new THREE.Matrix4().makeBasis(
      new THREE.Vector3(...TENGELYEK[j].e),
      new THREE.Vector3(...TENGELYEK[k].e),
      new THREE.Vector3(...TENGELYEK[tengely].e),
    );
    return new THREE.Quaternion().setFromRotationMatrix(m);
  }, [tengely, j, k]);

  useEffect(() => {
    ido.current = 0;
  }, [tengely]);

  useFrame((_, dt) => {
    ido.current = (ido.current + Math.min(dt, 0.05)) % 4.2;
    const t = ido.current;
    let szog;
    if (t < 2.6) {
      const u = t / 2.6;
      szog = (Math.PI / 2) * (u * u * (3 - 2 * u)); // simán 0 → 90°
    } else if (t < 3.6) {
      szog = Math.PI / 2; // megáll 90°-nál
    } else {
      szog = (Math.PI / 2) * (1 - (t - 3.6) / 0.6); // visszaáll
    }
    if (forgo.current) forgo.current.rotation.z = szog;
  });

  const szinJ = TENGELYEK[j].szin;
  const szinK = TENGELYEK[k].szin;
  return (
    <group quaternion={alap}>
      {/* a nyugalmi helyzet halvány kerete */}
      <Line points={[[0, 0, 0], [LAP, 0, 0], [LAP, LAP, 0], [0, LAP, 0], [0, 0, 0]]} color="#94a3b8" lineWidth={1} dashed dashSize={0.2} gapSize={0.12} />
      <group ref={forgo}>
        <mesh position={[LAP / 2, LAP / 2, 0]}>
          <planeGeometry args={[LAP, LAP]} />
          <meshStandardMaterial color="#fde68a" transparent opacity={0.45} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
        <Line points={[[0, 0, 0], [LAP, 0, 0]]} color={szinJ} lineWidth={3.5} />
        <Line points={[[0, 0, 0], [0, LAP, 0]]} color={szinK} lineWidth={3.5} />
        <Line points={[[LAP, 0, 0], [LAP, LAP, 0], [0, LAP, 0]]} color="#b45309" lineWidth={1.4} />
        <Pont3D pozicio={[LAP, 0, 0]} r={0.13} szin={szinJ} />
      </group>
    </group>
  );
}

export default function JobbkezFelfedezo() {
  const [tengely, setTengely] = useState(2);
  const [nezet, setNezet] = useState(null);
  const t = TENGELYEK[tengely];
  const j = TENGELYEK[(tengely + 1) % 3];
  const k = TENGELYEK[(tengely + 2) % 3];

  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white">
      <div className="grid lg:grid-cols-[1.35fr_1fr] [&>*]:min-w-0">
        <div className="border-b border-[color:var(--keret)] p-2 lg:border-r lg:border-b-0">
          <Jelenet3D kamera={NEZET_ALTALANOS} cel={CEL} magassag={400} tavolsagMin={5} tavolsagMax={40}>
            <KameraVezerlo nezet={nezet} />
            <Racs3D meret={14} osztas={14} />
            {TENGELYEK.map((a, i) => (
              <group key={a.nev}>
                <Nyil3D tol={[0, 0, 0]} ig={skal(a.e, HOSSZ)} szin={a.szin} vastag={i === tengely ? 0.075 : 0.045} />
                <Cimke3D pozicio={skal(a.e, HOSSZ + 0.5)} szin={a.szin} meret={14}>
                  <i>{a.nev}</i>
                </Cimke3D>
              </group>
            ))}
            <Pont3D pozicio={[0, 0, 0]} r={0.12} szin="#1d3c48" />
            <ForgasIv tengely={tengely} />
            <PapirLap tengely={tengely} />
          </Jelenet3D>
          <p className="mt-1 text-center text-[11.5px] text-petrol-400">
            Forgasd az egérrel vagy ujjal. A sárga lap a {j.nev}–{k.nev} síkban fekszik, és a(z) {t.nev} tengely körül fordul el pozitív irányban.
          </p>
        </div>

        <div className="p-4 sm:p-5">
          <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">Forgatás a tengely körül</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {TENGELYEK.map((a, i) => (
              <button
                key={a.nev}
                type="button"
                onClick={() => setTengely(i)}
                className={`rounded-lg px-3 py-1.5 text-[13px] font-semibold ring-1 transition ${
                  i === tengely ? "bg-petrol-800 text-white ring-petrol-800" : "bg-white text-petrol-700 ring-petrol-200 hover:bg-petrol-50"
                }`}
                style={i === tengely ? { backgroundColor: a.szin, borderColor: a.szin, boxShadow: `0 0 0 1px ${a.szin}` } : undefined}
              >
                <i>{a.nev}</i> körül
              </button>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setNezet({ pozicio: NEZET_TENGELYROL[tengely], n: Date.now() })}
              className="rounded-lg bg-naracs-500 px-3 py-1.5 text-[12.5px] font-semibold text-white transition hover:bg-naracs-600"
            >
              Nézd a(z) <i>{t.nev}</i> tengely felől
            </button>
            <button
              type="button"
              onClick={() => setNezet({ pozicio: NEZET_ALTALANOS, n: Date.now() })}
              className="rounded-lg bg-white px-3 py-1.5 text-[12.5px] font-medium text-petrol-600 ring-1 ring-petrol-200 transition hover:bg-petrol-50"
            >
              Általános nézet
            </button>
          </div>

          <div className="mt-4 rounded-xl bg-petrol-50 p-3.5">
            <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">Mi történik</p>
            <p className="mt-1 text-[14px] leading-relaxed text-petrol-800">
              <strong style={{ color: t.szin }}>
                <i>{t.nev}</i> körül
              </strong>
              : a pozitív forgatás <strong style={{ color: j.szin }}><i>{j.nev}</i></strong>-ből{" "}
              <strong style={{ color: k.szin }}><i>{k.nev}</i></strong>-ba visz 90° után. A lap {j.nev} irányú éle (a kis golyóval)
              a {k.nev} tengely felé fordul.
            </p>
            <p className="mt-2 text-[12.5px] leading-relaxed text-petrol-600">
              Ciklikus sorrend: <span className="font-semibold text-petrol-800">x → y → z → x</span>. A három eset: x körül y → z, y körül z → x, z körül x → y.
            </p>
          </div>

          <div className="mt-3 rounded-xl border border-naracs-200 bg-naracs-50 px-4 py-3">
            <p className="text-[10.5px] font-bold tracking-[0.16em] text-naracs-700 uppercase">Az óramutató</p>
            <p className="mt-1 text-[13px] leading-relaxed text-petrol-800">
              Ha a(z) <i>{t.nev}</i> tengely pozitív vége felől nézed (a tengely feléd mutat), a görbe nyíl az{" "}
              <strong>óramutatóval ellentétesen</strong> forog. Ha a tengely tőled elfelé mutat, ugyanez a forgatás az óramutató
              járásával egyezőnek látszik — a forgatás előjele nem változik, csak a nézőpont.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
