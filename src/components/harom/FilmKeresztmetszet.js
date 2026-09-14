"use client";

import { useMemo } from "react";
import * as THREE from "three";
import FeladatFilm from "@/components/anim/FeladatFilm";
import { arany, lerp } from "@/components/anim/Idovonal";
import { Jelenet3D, Nyil3D, Vonal3D, Cimke3D, Tengelyek3D, Racs3D, Pont3D } from "./Jelenet3D";

// T-szelvény dm-ben: fejlemez 3,0 × 0,3, gerinc 0,2 × 2,7; a felső él z = 3,0
const B = 3.0, TF = 0.3, HW = 2.7, TW = 0.2;
const HOSSZ = 6; // a gerenda hossza (dm) – csak szemléltetés
const ZS = 3.0 - 0.7125; // súlypont magassága a talptól

const FEJEZETEK = [
  {
    t0: 0,
    cim: "A keresztmetszet",
    szoveg: "A T-szelvény egy gerenda keresztmetszete: a rúd x tengelye merőleges rá. A y–z sík az, amiben a súlypontot számoltuk.",
    kepletek: ["S:\\ z_S = 71{,}25\\ \\text{mm a felső éltől}"],
  },
  {
    t0: 3,
    cim: "Kihúzva gerendává",
    szoveg: "A keresztmetszet minden x-nél ugyanaz — a gerenda a szelvény „kihúzása” a hossza mentén.",
    kepletek: [],
  },
  {
    t0: 6.2,
    cim: "A súlyponti tengely",
    szoveg: "A súlypontok sora a gerenda hossza mentén egy egyenes: a súlyponti tengely. Hajlításnál ez lesz a semleges tengely — ezért kell tudni, hol van S.",
    kepletek: ["S_y = 0\\ \\text{a súlyponti tengelyre}"],
  },
];

function TSzelveny({ hossz }) {
  const geo = useMemo(() => {
    const sh = new THREE.Shape();
    // a szelvény a (y, z) síkban, y jobbra (a rajzban), z fel
    sh.moveTo(-B / 2, 3.0);
    sh.lineTo(B / 2, 3.0);
    sh.lineTo(B / 2, 3.0 - TF);
    sh.lineTo(TW / 2, 3.0 - TF);
    sh.lineTo(TW / 2, 0);
    sh.lineTo(-TW / 2, 0);
    sh.lineTo(-TW / 2, 3.0 - TF);
    sh.lineTo(-B / 2, 3.0 - TF);
    sh.closePath();
    const g = new THREE.ExtrudeGeometry(sh, { depth: 1, bevelEnabled: false });
    // az extrude a helyi +z irányba megy; átforgatjuk: helyi x → világ y, helyi y → világ z, helyi z (mélység) → világ x
    g.applyMatrix4(new THREE.Matrix4().set(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1));
    return g;
  }, []);
  return (
    <mesh geometry={geo} scale={[Math.max(hossz, 0.02), 1, 1]}>
      <meshStandardMaterial color="#8ec3cd" transparent opacity={0.9} />
    </mesh>
  );
}

function Rajz(t) {
  const szU = arany(t, 0.3, 1.2);
  const sFel = arany(t, 1.4, 2.0);
  const huz = arany(t, 3.3, 5.2);
  const tengU = arany(t, 6.5, 7.8);
  const hossz = lerp(0.05, HOSSZ, huz);

  return (
    <Jelenet3D kamera={[8, -8, 5]} cel={[2.5, 0, 1.6]} magassag={400} tavolsagMin={2} tavolsagMax={40}>
      <Racs3D meret={16} osztas={16} />
      <Tengelyek3D hossz={2.2} />
      {szU > 0.05 && <TSzelveny hossz={hossz} />}
      {/* S a keresztmetszeten és a tengely */}
      <Pont3D pozicio={[0, 0, ZS]} r={0.11} szin="#e2590a" u={sFel} />
      <Cimke3D pozicio={[0, 0, ZS + 0.5]} szin="#e2590a" meret={12.5} opacitas={sFel}>S</Cimke3D>
      <Vonal3D tol={[-0.4, 0, ZS]} ig={[0, 0, ZS]} szin="#e2590a" vastag={1.5} u={sFel} />
      <Cimke3D pozicio={[-0.9, 0, 3.4]} szin="#64748b" meret={11} vastag={false} opacitas={sFel}>felső él</Cimke3D>
      <Nyil3D tol={[-0.6, 0, ZS]} ig={[HOSSZ + 0.8, 0, ZS]} szin="#e2590a" vastag={0.04} u={tengU} />
      <Cimke3D pozicio={[HOSSZ / 2, 0, ZS - 0.6]} szin="#e2590a" meret={12.5} opacitas={tengU}>súlyponti tengely</Cimke3D>
      <Cimke3D pozicio={[HOSSZ / 2, 0, 4.3]} szin="#475569" meret={11.5} vastag={false} opacitas={huz}>a gerenda: a szelvény kihúzva x mentén</Cimke3D>
    </Jelenet3D>
  );
}

export default function FilmKeresztmetszet() {
  return (
    <FeladatFilm
      cim="A T-szelvény mint gerenda — a súlyponti tengely 3D-ben"
      hossz={8.4}
      fejezetek={FEJEZETEK}
      rajz={Rajz}
      megjegyzes="Rövid ráhangoló a szilárdságtanra: a súlypont nem csak egy pont, hanem egy tengely a rúd mentén."
    />
  );
}
