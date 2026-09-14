"use client";

import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, Line } from "@react-three/drei";
import * as THREE from "three";

/* Közös 3D építőelemek. A statikai (x, y, z) koordinátákat közvetlenül használjuk,
   a z tengely felfelé mutat (a kamera "up" vektora z). */

const FEL = new THREE.Vector3(0, 1, 0);

/** Nyíl két pont között: henger + kúp. */
export function Nyil3D({ tol = [0, 0, 0], ig, szin = "#e2590a", vastag = 0.09, opacitas = 1, fejHossz, u = 1 }) {
  const { pos, quat, hossz } = useMemo(() => {
    const a = new THREE.Vector3(...tol);
    const b = new THREE.Vector3(...ig);
    const d = new THREE.Vector3().subVectors(b, a);
    const h = d.length();
    const q = new THREE.Quaternion();
    if (h > 1e-9) q.setFromUnitVectors(FEL, d.clone().normalize());
    return { pos: a, quat: q, hossz: h };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tol[0], tol[1], tol[2], ig[0], ig[1], ig[2]]);
  const L = hossz * Math.max(0, Math.min(1, u));
  if (L < 0.05) return null;
  const fej = Math.min(fejHossz ?? vastag * 4.5, L * 0.6);
  const szar = Math.max(L - fej, 0.001);
  return (
    <group position={pos} quaternion={quat}>
      <mesh position={[0, szar / 2, 0]}>
        <cylinderGeometry args={[vastag, vastag, szar, 14]} />
        <meshStandardMaterial color={szin} transparent={opacitas < 1} opacity={opacitas} />
      </mesh>
      <mesh position={[0, szar + fej / 2, 0]}>
        <coneGeometry args={[vastag * 2.4, fej, 18]} />
        <meshStandardMaterial color={szin} transparent={opacitas < 1} opacity={opacitas} />
      </mesh>
    </group>
  );
}

/** Vékony vonal két pont között (segédvonalakhoz). */
export function Vonal3D({ tol, ig, szin = "#94a3b8", szaggatott = false, opacitas = 1, u = 1, vastag = 1.2 }) {
  if (u < 0.01 || opacitas <= 0.01) return null;
  const k = Math.max(0, Math.min(1, u));
  const c = [tol[0] + (ig[0] - tol[0]) * k, tol[1] + (ig[1] - tol[1]) * k, tol[2] + (ig[2] - tol[2]) * k];
  return (
    <Line
      points={[tol, c]}
      color={szin}
      lineWidth={vastag}
      dashed={szaggatott}
      dashSize={0.3}
      gapSize={0.18}
      transparent
      opacity={opacitas}
    />
  );
}

/** HTML felirat a térben. */
export function Cimke3D({ pozicio, children, szin = "#1d3c48", meret = 12.5, vastag = true, opacitas = 1 }) {
  if (opacitas <= 0.01) return null;
  return (
    <Html position={pozicio} center zIndexRange={[10, 0]} style={{ pointerEvents: "none" }}>
      <div
        style={{
          color: szin,
          fontSize: meret,
          fontWeight: vastag ? 650 : 450,
          whiteSpace: "nowrap",
          opacity: opacitas,
          textShadow: "0 0 3px #fff, 0 0 6px #fff, 0 0 2px #fff",
          fontFamily: "Inter, Segoe UI, system-ui, sans-serif",
        }}
      >
        {children}
      </div>
    </Html>
  );
}

/** Koordinátatengelyek az origóból. */
export function Tengelyek3D({ hossz = 6, cimkek = ["x", "y", "z"] }) {
  return (
    <group>
      <Nyil3D tol={[0, 0, 0]} ig={[hossz, 0, 0]} szin="#64748b" vastag={0.035} />
      <Nyil3D tol={[0, 0, 0]} ig={[0, hossz, 0]} szin="#64748b" vastag={0.035} />
      <Nyil3D tol={[0, 0, 0]} ig={[0, 0, hossz]} szin="#64748b" vastag={0.035} />
      <Cimke3D pozicio={[hossz + 0.5, 0, 0]} szin="#475569" meret={13}><i>{cimkek[0]}</i></Cimke3D>
      <Cimke3D pozicio={[0, hossz + 0.5, 0]} szin="#475569" meret={13}><i>{cimkek[1]}</i></Cimke3D>
      <Cimke3D pozicio={[0, 0, hossz + 0.5]} szin="#475569" meret={13}><i>{cimkek[2]}</i></Cimke3D>
    </group>
  );
}

/** Rács az x–y síkban. */
export function Racs3D({ meret = 20, osztas = 20, szin = "#cbd5e1" }) {
  return <gridHelper args={[meret, osztas, "#94a3b8", szin]} rotation={[Math.PI / 2, 0, 0]} />;
}

/** Egy pont (gömb). */
export function Pont3D({ pozicio, r = 0.14, szin = "#1d3c48", u = 1 }) {
  if (u < 0.01) return null;
  return (
    <mesh position={pozicio}>
      <sphereGeometry args={[r * Math.min(1, u), 16, 16]} />
      <meshStandardMaterial color={szin} />
    </mesh>
  );
}

/** A jelenet kerete: kamera, fények, forgatás. */
export function Jelenet3D({ children, kamera = [14, -18, 12], cel = [2, 2, 1], magassag = 380, tavolsagMin = 4, tavolsagMax = 120 }) {
  return (
    <div style={{ height: magassag }} className="w-full overflow-hidden rounded-xl bg-linear-to-b from-white to-petrol-50">
      <Canvas
        camera={{ position: kamera, fov: 40, up: [0, 0, 1], near: 0.1, far: 500 }}
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ camera }) => {
          camera.up.set(0, 0, 1);
          camera.lookAt(...cel);
        }}
      >
        <ambientLight intensity={0.85} />
        <directionalLight position={[10, -10, 20]} intensity={1.1} />
        <directionalLight position={[-10, 8, 6]} intensity={0.4} />
        <OrbitControls target={cel} minDistance={tavolsagMin} maxDistance={tavolsagMax} enablePan={false} makeDefault />
        {children}
      </Canvas>
    </div>
  );
}
