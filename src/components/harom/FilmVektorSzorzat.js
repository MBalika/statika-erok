"use client";

import { useMemo } from "react";
import * as THREE from "three";
import FeladatFilm from "@/components/anim/FeladatFilm";
import { arany, lerp } from "@/components/anim/Idovonal";
import { Jelenet3D, Nyil3D, Vonal3D, Cimke3D, Tengelyek3D, Racs3D, Pont3D } from "./Jelenet3D";

const R = [-5, 3.3, 4.7]; // m
const FN = [800, 600, -300]; // N
const FS = 1 / 150; // rajzlépték az erőhöz
const FD = FN.map((x) => x * FS); // (5,33; 4; −2)
const MN = [-3810, 2260, -5640]; // Nm
const MS = 1 / 700;
const MD = MN.map((x) => x * MS);
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const P = R;
const NAR = "#e2590a";
const LILA = "#7c3aed";
const BORDO = "#9f1239";

const FEJEZETEK = [
  {
    t0: 0,
    cim: "A helyvektor: hol hat az erő?",
    szoveg: "r az origóból az erő támadáspontjába mutat. Komponensei: −5 m x-ben, 3,3 m y-ban, 4,7 m z-ben.",
    kepletek: ["\\underline{r} = (-5;\\ 3{,}3;\\ 4{,}7)\\ \\text{m}"],
  },
  {
    t0: 3.5,
    cim: "Az erő a P pontban",
    szoveg: "F = (800; 600; −300) N. A rajzon az erőt más léptékben rajzoljuk, mint a távolságot — a nyíl iránya a lényeg.",
    kepletek: ["\\underline{F} = (800;\\ 600;\\ -300)\\ \\text{N}"],
  },
  {
    t0: 6.5,
    cim: "A két vektor síkja",
    szoveg: "r és F egy síkot feszít ki (az origón és F hatásvonalán átmenő sík). A nyomaték erre a síkra merőleges lesz.",
    kepletek: ["\\underline{M}^{(O)} = \\underline{r} \\times \\underline{F}"],
  },
  {
    t0: 9.5,
    cim: "M = r × F: merőleges, jobbkéz-szabály",
    szoveg: "Ha a jobb kéz ujjai r-től F felé fordulnak, a hüvelykujj M irányába mutat. A nyomatékvektor hossza az r és F által kifeszített paralelogramma területe.",
    kepletek: ["|\\underline{M}| = |\\underline{r}|\\,|\\underline{F}|\\sin\\varphi = 7\\,172\\ \\text{Nm}"],
  },
  {
    t0: 13,
    cim: "A három komponens",
    szoveg: "A vektoriális szorzat komponensei: mindegyik „a másik két” komponensből jön. Ezek a tengelyek körüli forgatónyomatékok.",
    kepletek: [
      "M_x = y F_z - z F_y = 3{,}3\\cdot(-300) - 4{,}7\\cdot 600 = -3\\,810\\ \\text{Nm}",
      "M_y = z F_x - x F_z = 4{,}7\\cdot 800 - (-5)\\cdot(-300) = 2\\,260\\ \\text{Nm}",
      "M_z = x F_y - y F_x = (-5)\\cdot 600 - 3{,}3\\cdot 800 = -5\\,640\\ \\text{Nm}",
    ],
  },
];

function Sik({ opacitas }) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const o = [0, 0, 0];
    const a = P;
    const b = add(P, FD);
    const c = FD;
    const v = new Float32Array([...o, ...a, ...b, ...o, ...b, ...c]);
    g.setAttribute("position", new THREE.BufferAttribute(v, 3));
    g.computeVertexNormals();
    return g;
  }, []);
  if (opacitas <= 0.01) return null;
  return (
    <mesh geometry={geo}>
      <meshStandardMaterial color="#59a3b2" transparent opacity={0.28 * opacitas} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

function Rajz(t) {
  const rU = arany(t, 0.5, 1.8);
  const lep = [arany(t, 1.9, 2.4), arany(t, 2.4, 2.9), arany(t, 2.9, 3.4)];
  const fU = arany(t, 3.8, 5.0);
  const fLep = arany(t, 5.1, 5.9);
  const sikU = arany(t, 6.8, 8.0);
  const szellemU = arany(t, 7.0, 7.6);
  const mU = arany(t, 9.8, 11.2);
  const ivU = arany(t, 11.2, 12.2);
  const kompU = [arany(t, 13.2, 13.8), arany(t, 13.8, 14.4), arany(t, 14.4, 15.0)];

  const Fveg = add(P, FD);
  const mVeg = MD;

  // "forgó" ív r-től F felé (a síkban): pontok interpolálva
  const ivPontok = [];
  const n = 16;
  for (let i = 0; i <= n; i++) {
    const k = (i / n) * ivU;
    const a = new THREE.Vector3(...P).normalize().multiplyScalar(2.2);
    const b = new THREE.Vector3(...FD).normalize().multiplyScalar(2.2);
    const q = a.clone().lerp(b, k).normalize().multiplyScalar(2.2);
    ivPontok.push([q.x, q.y, q.z]);
  }

  return (
    <Jelenet3D kamera={[16, -20, 12]} cel={[-1, 3, 2]} magassag={420}>
      <Racs3D meret={24} osztas={12} />
      <Tengelyek3D hossz={8} />

      {/* r */}
      <Nyil3D tol={[0, 0, 0]} ig={P} szin="#0f766e" u={rU} vastag={0.08} />
      <Cimke3D pozicio={[-2.5, 1.65, 2.35 + 0.8]} szin="#0f766e" opacitas={rU}>r</Cimke3D>
      <Pont3D pozicio={P} r={0.18} szin="#0f766e" u={rU} />
      <Cimke3D pozicio={add(P, [0, 0, 0.9])} szin="#475569" meret={11.5} vastag={false} opacitas={arany(t, 1.6, 2.0)}>P (−5; 3,3; 4,7)</Cimke3D>
      <Vonal3D tol={[0, 0, 0]} ig={[-5, 0, 0]} szin="#0f766e" szaggatott u={lep[0]} vastag={2} />
      <Vonal3D tol={[-5, 0, 0]} ig={[-5, 3.3, 0]} szin="#0f766e" szaggatott u={lep[1]} vastag={2} />
      <Vonal3D tol={[-5, 3.3, 0]} ig={[-5, 3.3, 4.7]} szin="#0f766e" szaggatott u={lep[2]} vastag={2} />

      {/* F a P pontban */}
      <Nyil3D tol={P} ig={Fveg} szin={NAR} u={fU} vastag={0.1} />
      <Cimke3D pozicio={add(Fveg, [0.6, 0, 0.5])} szin={NAR} opacitas={fU}>F (800; 600; −300) N</Cimke3D>
      <Vonal3D tol={P} ig={add(P, [FD[0], 0, 0])} szin={NAR} szaggatott u={fLep} vastag={2} />
      <Vonal3D tol={add(P, [FD[0], 0, 0])} ig={add(P, [FD[0], FD[1], 0])} szin={NAR} szaggatott u={fLep} vastag={2} />
      <Vonal3D tol={add(P, [FD[0], FD[1], 0])} ig={Fveg} szin={NAR} szaggatott u={fLep} vastag={2} />

      {/* sík + F szellemképe az origóból */}
      <Sik opacitas={sikU} />
      <Nyil3D tol={[0, 0, 0]} ig={FD} szin={NAR} opacitas={0.25 * szellemU} vastag={0.08} />
      <Vonal3D tol={P} ig={Fveg} szin="#59a3b2" u={sikU} vastag={1} opacitas={0.6} />
      <Vonal3D tol={FD} ig={Fveg} szin="#59a3b2" u={sikU} vastag={1} opacitas={0.6} />

      {/* forgásív r → F */}
      {ivU > 0.05 && ivPontok.slice(1).map((p, i) => <Vonal3D key={i} tol={ivPontok[i]} ig={p} szin={BORDO} vastag={2.5} />)}

      {/* M */}
      <Nyil3D tol={[0, 0, 0]} ig={mVeg} szin={LILA} u={mU} vastag={0.13} />
      <Cimke3D pozicio={add(mVeg, [0, 0, -1])} szin={LILA} meret={13} opacitas={arany(t, 10.8, 11.2)}>M = r × F</Cimke3D>
      <Cimke3D pozicio={[MD[0] * 0.5 - 1.5, MD[1] * 0.5, MD[2] * 0.5]} szin={LILA} meret={11.5} vastag={false} opacitas={arany(t, 11.4, 11.9)}>merőleges a síkra</Cimke3D>

      {/* komponensek */}
      <Vonal3D tol={[0, 0, 0]} ig={[MD[0], 0, 0]} szin={LILA} szaggatott u={kompU[0]} vastag={2} />
      <Vonal3D tol={[MD[0], 0, 0]} ig={[MD[0], MD[1], 0]} szin={LILA} szaggatott u={kompU[1]} vastag={2} />
      <Vonal3D tol={[MD[0], MD[1], 0]} ig={mVeg} szin={LILA} szaggatott u={kompU[2]} vastag={2} />
      <Cimke3D pozicio={[MD[0] / 2, -0.8, 0]} szin={LILA} meret={11.5} vastag={false} opacitas={kompU[0]}>Mx = −3 810</Cimke3D>
      <Cimke3D pozicio={[MD[0] - 1, MD[1] / 2, 0]} szin={LILA} meret={11.5} vastag={false} opacitas={kompU[1]}>My = 2 260</Cimke3D>
      <Cimke3D pozicio={[MD[0] - 1.6, MD[1], MD[2] / 2]} szin={LILA} meret={11.5} vastag={false} opacitas={kompU[2]}>Mz = −5 640</Cimke3D>
    </Jelenet3D>
  );
}

export default function FilmVektorSzorzat() {
  return (
    <FeladatFilm
      cim="GYF‑1 · Nyomaték a térben: r × F — 3D-ben"
      hossz={15.6}
      fejezetek={FEJEZETEK}
      rajz={Rajz}
      megjegyzes="Forgasd úgy, hogy a síkra merőlegesen nézz: akkor M pont feléd (vagy tőled el) mutat."
    />
  );
}
