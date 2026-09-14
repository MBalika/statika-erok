"use client";

import FeladatFilm from "@/components/anim/FeladatFilm";
import { arany, lerp, rugo } from "@/components/anim/Idovonal";
import { Jelenet3D, Nyil3D, Vonal3D, Cimke3D, Tengelyek3D, Racs3D, Pont3D } from "./Jelenet3D";

const F = [
  { v: [5, 2, 6], szin: "#e2590a", nev: "F₁" },
  { v: [-3, 4, -9], szin: "#0f766e", nev: "F₂" },
  { v: [8, 11, -10], szin: "#2563eb", nev: "F₃" },
];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const P1 = F[0].v;
const P2 = add(P1, F[1].v);
const P3 = add(P2, F[2].v); // (10, 17, −13)
const lerpV = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)];
const fel = (v) => v.map((x) => x.toFixed(0)).join("; ");

const FEJEZETEK = [
  {
    t0: 0,
    cim: "Három vektor a térben",
    szoveg: "Mindhárom erő az origóból indul, és három-három komponense van. Forgasd a jelenetet az egérrel (vagy ujjal), hogy lásd a mélységet.",
    kepletek: ["\\underline{F}_1 = (5;\\ 2;\\ 6),\\quad \\underline{F}_2 = (-3;\\ 4;\\ -9),\\quad \\underline{F}_3 = (8;\\ 11;\\ -10)\\ \\text{kN}"],
  },
  {
    t0: 4,
    cim: "Mit jelentenek a komponensek?",
    szoveg: "F₁-hez az origóból 5 egységet lépünk x irányban, 2-t y irányban, 6-ot felfelé z irányban — a „lépcső” vége a vektor hegye.",
    kepletek: ["|\\underline{F}_1| = \\sqrt{5^2 + 2^2 + 6^2} = 8{,}06\\ \\text{kN}"],
  },
  {
    t0: 7.2,
    cim: "Láncszabály térben is",
    szoveg: "F₂-t az F₁ hegyéhez, F₃-at az F₂ új hegyéhez toljuk. A lánc vége az összeg — pontosan úgy, mint síkban.",
    kepletek: ["\\underline{F}_1 + \\underline{F}_2 = (2;\\ 6;\\ -3),\\qquad + \\underline{F}_3 \\to (10;\\ 17;\\ -13)"],
  },
  {
    t0: 11.4,
    cim: "Az eredő",
    szoveg: "Az eredő az origóból a lánc végébe mutat; komponensei egyszerűen az azonos komponensek összegei.",
    kepletek: ["\\underline{R} = (10;\\ 17;\\ -13)\\ \\text{kN},\\qquad |\\underline{R}| = \\sqrt{10^2 + 17^2 + 13^2} = 23{,}62\\ \\text{kN}"],
  },
];

function Rajz(t) {
  const eroU = F.map((_, i) => arany(t, 0.5 + i * 1.0, 1.4 + i * 1.0));
  const lepcsoU = [arany(t, 4.3, 4.9), arany(t, 4.9, 5.5), arany(t, 5.5, 6.1)];
  const csusz2 = arany(t, 7.5, 8.7, rugo);
  const csusz3 = arany(t, 8.9, 10.1, rugo);
  const pontFel = arany(t, 10.2, 10.8);
  const rU = arany(t, 11.7, 13.0);
  const rLepcso = arany(t, 13.0, 13.8);

  const s2 = lerpV([0, 0, 0], P1, csusz2);
  const s3 = lerpV([0, 0, 0], P2, csusz3);
  const e2 = add(s2, F[1].v);
  const e3 = add(s3, F[2].v);

  return (
    <Jelenet3D kamera={[25, -22, 13]} cel={[4, 7, -2]} magassag={420}>
      <Racs3D meret={40} osztas={20} />
      <Tengelyek3D hossz={12} />

      {/* F1 és a lépcsője */}
      <Nyil3D tol={[0, 0, 0]} ig={P1} szin={F[0].szin} u={eroU[0]} />
      <Cimke3D pozicio={add(P1, [0, 0, 1])} szin={F[0].szin} opacitas={eroU[0]}>F₁ (5; 2; 6)</Cimke3D>
      <Vonal3D tol={[0, 0, 0]} ig={[5, 0, 0]} szin={F[0].szin} szaggatott u={lepcsoU[0]} vastag={2} />
      <Vonal3D tol={[5, 0, 0]} ig={[5, 2, 0]} szin={F[0].szin} szaggatott u={lepcsoU[1]} vastag={2} />
      <Vonal3D tol={[5, 2, 0]} ig={[5, 2, 6]} szin={F[0].szin} szaggatott u={lepcsoU[2]} vastag={2} />
      <Cimke3D pozicio={[2.5, -0.9, 0]} szin={F[0].szin} meret={11.5} vastag={false} opacitas={lepcsoU[0]}>5</Cimke3D>
      <Cimke3D pozicio={[5.8, 1, 0]} szin={F[0].szin} meret={11.5} vastag={false} opacitas={lepcsoU[1]}>2</Cimke3D>
      <Cimke3D pozicio={[5.8, 2, 3]} szin={F[0].szin} meret={11.5} vastag={false} opacitas={lepcsoU[2]}>6</Cimke3D>

      {/* F2: az origóból, majd F1 hegyére */}
      <Nyil3D tol={s2} ig={e2} szin={F[1].szin} u={eroU[1]} />
      <Cimke3D pozicio={add(e2, [0, 0, -1])} szin={F[1].szin} opacitas={eroU[1]}>F₂ (−3; 4; −9)</Cimke3D>
      {csusz2 > 0.05 && <Nyil3D tol={[0, 0, 0]} ig={F[1].v} szin={F[1].szin} opacitas={0.18} />}

      {/* F3 */}
      <Nyil3D tol={s3} ig={e3} szin={F[2].szin} u={eroU[2]} />
      <Cimke3D pozicio={add(e3, [1, 0, -1])} szin={F[2].szin} opacitas={eroU[2]}>F₃ (8; 11; −10)</Cimke3D>
      {csusz3 > 0.05 && <Nyil3D tol={[0, 0, 0]} ig={F[2].v} szin={F[2].szin} opacitas={0.18} />}

      {/* a lánc vége */}
      <Pont3D pozicio={P3} r={0.3} szin="#7c3aed" u={pontFel} />
      <Cimke3D pozicio={add(P3, [0, 0, 1.4])} szin="#475569" meret={11.5} vastag={false} opacitas={pontFel * (1 - rU)}>a lánc vége: (10; 17; −13)</Cimke3D>

      {/* eredő */}
      <Nyil3D tol={[0, 0, 0]} ig={P3} szin="#7c3aed" vastag={0.13} u={rU} />
      <Cimke3D pozicio={lerpV([0, 0, 0], P3, 0.55)} szin="#7c3aed" meret={13} opacitas={arany(t, 12.6, 13.0)}>R = 23,62 kN</Cimke3D>
      <Vonal3D tol={[0, 0, 0]} ig={[10, 0, 0]} szin="#7c3aed" szaggatott u={rLepcso} vastag={2} />
      <Vonal3D tol={[10, 0, 0]} ig={[10, 17, 0]} szin="#7c3aed" szaggatott u={rLepcso} vastag={2} />
      <Vonal3D tol={[10, 17, 0]} ig={[10, 17, -13]} szin="#7c3aed" szaggatott u={rLepcso} vastag={2} />
      <Cimke3D pozicio={[10.8, 8.5, 0]} szin="#7c3aed" meret={11.5} vastag={false} opacitas={rLepcso}>17</Cimke3D>
      <Cimke3D pozicio={[5, -1, 0]} szin="#7c3aed" meret={11.5} vastag={false} opacitas={rLepcso}>10</Cimke3D>
      <Cimke3D pozicio={[10.8, 17, -6.5]} szin="#7c3aed" meret={11.5} vastag={false} opacitas={rLepcso}>−13</Cimke3D>
    </Jelenet3D>
  );
}

export default function FilmTerbeliOsszeg() {
  return (
    <FeladatFilm
      cim="GYF‑1 · Három térbeli vektor összege — 3D-ben"
      hossz={14.2}
      fejezetek={FEJEZETEK}
      rajz={Rajz}
      megjegyzes="A jelenet forgatható: húzd az egérrel, görgess a nagyításhoz. A z tengely felfelé mutat."
    />
  );
}
