"use client";

import { useMemo } from "react";
import * as THREE from "three";
import FeladatFilm from "@/components/anim/FeladatFilm";
import { arany, lerp, rugo } from "@/components/anim/Idovonal";
import { Jelenet3D, Nyil3D, Vonal3D, Cimke3D, Tengelyek3D, Racs3D, Pont3D } from "./Jelenet3D";

const L = 4.5;
const W = 0.5;
const H = 0.35;
const P1 = 1.8;
const P2 = 3.6;
const PS = 0.45; // rajzmagasság / (kN/m)
const K = 2.5;
const R = 12.15;
const NX = 12;
const NY = 3;
const pHelyen = (x) => P1 + ((P2 - P1) * x) / L;

const FEJEZETEK = [
  {
    t0: 0,
    cim: "A gerenda és a teher — térben",
    szoveg: "A „vonal mentén megoszló” teher a valóságban a gerenda felső lapján oszlik el. A kN/m azt mondja, mennyi jut a gerenda egy méterére.",
    kepletek: ["p_1 = 1{,}8,\\quad p_2 = 3{,}6\\ \\text{kN/m},\\quad L = 4{,}5\\ \\text{m}"],
  },
  {
    t0: 3.2,
    cim: "A teherlepel",
    szoveg: "Ha a nyilak hegyét összekötjük, egy ferde lepel jön ki: ez a teherábra térbeli megfelelője. A lepel alatti térfogat az eredő.",
    kepletek: ["R = \\int_0^L p(x)\\,dx = \\frac{1{,}8 + 3{,}6}{2}\\cdot 4{,}5 = 12{,}15\\ \\text{kN}"],
  },
  {
    t0: 6.4,
    cim: "Az eredő a lepel súlypontja alatt",
    szoveg: "Az elemi erők egyetlen erővé húzódnak össze: a súlypont vonalán, k = 2,5 m-nél. A gerenda egészére nézve ez a két teher egyenértékű.",
    kepletek: ["k = \\frac{L}{3}\\cdot\\frac{p_1 + 2p_2}{p_1 + p_2} = 2{,}5\\ \\text{m}"],
  },
];

function Lepel({ opacitas }) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const z1 = H + P1 * PS;
    const z2 = H + P2 * PS;
    const v = new Float32Array([
      0, -W / 2, z1, L, -W / 2, z2, L, W / 2, z2,
      0, -W / 2, z1, L, W / 2, z2, 0, W / 2, z1,
    ]);
    g.setAttribute("position", new THREE.BufferAttribute(v, 3));
    g.computeVertexNormals();
    return g;
  }, []);
  if (opacitas <= 0.01) return null;
  return (
    <mesh geometry={geo}>
      <meshStandardMaterial color="#e2590a" transparent opacity={0.3 * opacitas} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

function Rajz(t) {
  const nyilU = arany(t, 0.4, 2.6);
  const lepelU = arany(t, 3.4, 4.4);
  const c = arany(t, 6.7, 8.2, rugo);
  const rFel = arany(t, 8.2, 8.8);

  const nyilak = [];
  for (let i = 0; i <= NX; i++) {
    for (let j = 0; j < NY; j++) {
      const x0 = (i / NX) * L;
      const y = -W / 2 + ((j + 0.5) / NY) * W;
      const p = pHelyen(x0);
      const u = arany(nyilU, i / (NX + 1), (i + 1) / (NX + 1));
      const x = lerp(x0, K, c);
      const mag = p * PS * (1 - c);
      nyilak.push({ x, y: lerp(y, 0, c), mag, u });
    }
  }

  return (
    <Jelenet3D kamera={[5.8, -5.6, 3.4]} cel={[2.25, 0, 1.0]} magassag={400} tavolsagMin={2} tavolsagMax={30}>
      <Racs3D meret={12} osztas={12} />
      <Tengelyek3D hossz={1.6} />
      {/* gerenda */}
      <mesh position={[L / 2, 0, H / 2]}>
        <boxGeometry args={[L, W, H]} />
        <meshStandardMaterial color="#8ec3cd" transparent opacity={0.85} />
      </mesh>
      <Vonal3D tol={[0, -W / 2 - 0.3, 0]} ig={[L, -W / 2 - 0.3, 0]} szin="#64748b" vastag={1.2} />
      <Cimke3D pozicio={[L / 2, -W / 2 - 0.6, 0]} szin="#64748b" meret={11} vastag={false}>L = 4,5 m</Cimke3D>

      {/* elemi nyilak */}
      {nyilak.map((n, i) =>
        n.mag > 0.05 ? (
          <Nyil3D key={i} tol={[n.x, n.y, H + n.mag]} ig={[n.x, n.y, H + 0.02]} szin="#e2590a" vastag={0.022} u={n.u} fejHossz={0.12} />
        ) : null,
      )}
      <Cimke3D pozicio={[0, 0, H + P1 * PS + 0.4]} szin="#e2590a" meret={12} opacitas={arany(t, 2.2, 2.6) * (1 - c)}>p₁ = 1,8 kN/m</Cimke3D>
      <Cimke3D pozicio={[L, 0, H + P2 * PS + 0.4]} szin="#e2590a" meret={12} opacitas={arany(t, 2.6, 3.0) * (1 - c)}>p₂ = 3,6 kN/m</Cimke3D>

      {/* lepel */}
      <Lepel opacitas={lepelU * (1 - c)} />

      {/* eredő */}
      <Nyil3D tol={[K, 0, H + 0.4 + R * 0.16]} ig={[K, 0, H + 0.03]} szin="#7c3aed" vastag={0.07} u={c} />
      <Cimke3D pozicio={[K, 0, H + 0.6 + R * 0.16]} szin="#7c3aed" meret={13} opacitas={c}>R = 12,15 kN</Cimke3D>
      <Pont3D pozicio={[K, 0, H]} r={0.06} szin="#7c3aed" u={rFel} />
      <Vonal3D tol={[0, W / 2 + 0.3, 0]} ig={[K, W / 2 + 0.3, 0]} szin="#7c3aed" vastag={1.5} u={rFel} />
      <Cimke3D pozicio={[K / 2, W / 2 + 0.6, 0]} szin="#7c3aed" meret={11.5} opacitas={rFel}>k = 2,5 m</Cimke3D>
    </Jelenet3D>
  );
}

export default function FilmTeherLepel() {
  return (
    <FeladatFilm
      cim="GYF‑1 · A trapéz teher térben: a lepel egy erővé húzódik össze"
      hossz={9.4}
      fejezetek={FEJEZETEK}
      rajz={Rajz}
      megjegyzes="Forgasd meg a gerendát: oldalról nézve visszakapod a síkbeli teherábrát."
    />
  );
}
