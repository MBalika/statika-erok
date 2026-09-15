"use client";

import FeladatFilm from "@/components/anim/FeladatFilm";
import { arany, lerp, rugo } from "@/components/anim/Idovonal";
import { Hegy, NyilA, VonalA, FeliratA, IvA, PontA } from "@/components/anim/FilmElemek";

const OX = 120;
const OY = 140;
const E = 19; // képpont / N
const RAD = Math.PI / 180;

const EROK = [
  { nev: "F₁", F: 5, a: 40, szin: "#e2590a", hegy: "f2-a" },
  { nev: "F₂", F: 6, a: 0, szin: "#0f766e", hegy: "f2-b" },
  { nev: "F₃", F: 8, a: -65, szin: "#2563eb", hegy: "f2-c" },
  { nev: "F₄", F: 4, a: -90, szin: "#be123c", hegy: "f2-d" },
];
const komp = (e) => ({ x: e.F * Math.cos(e.a * RAD), y: e.F * Math.sin(e.a * RAD) });
const K = EROK.map(komp); // N-ban
const RX = K.reduce((s, k) => s + k.x, 0); // 13,211
const RY = K.reduce((s, k) => s + k.y, 0); // −8,036
const R = Math.hypot(RX, RY);

const px = (x) => OX + x * E;
const py = (y) => OY - y * E;
const f = (n, d = 3) => n.toFixed(d).replace(".", ",");

const FEJEZETEK = [
  {
    t0: 0,
    cim: "A négy erő",
    szoveg: "Mind a négy erő az origóból indul; az eredőt keressük, ezért az első sor az egyenértékűségi kijelentés. Két erő tengelyirányú, kettő ferde — csak a ferdéket kell felbontani.",
    kepletek: ["(\\underline{F}_1, \\underline{F}_2, \\underline{F}_3, \\underline{F}_4) \\ekv \\underline{R}", "F_1 = 5\\ \\text{N},\\ F_2 = 6\\ \\text{N},\\ F_3 = 8\\ \\text{N},\\ F_4 = 4\\ \\text{N}"],
  },
  {
    t0: 4.6,
    cim: "F₁ felbontása",
    szoveg: "A 40° az x tengelytől indul: a vízszintes komponenshez koszinusz, a függőlegeshez szinusz tartozik.",
    kepletek: ["F_{1x} = 5\\cos 40^\\circ = 3{,}830\\ \\text{N},\\quad F_{1y} = 5\\sin 40^\\circ = 3{,}214\\ \\text{N}"],
  },
  {
    t0: 7.2,
    cim: "F₃ felbontása",
    szoveg: "A 25° itt az y tengelytől indul, ezért a szerepek felcserélődnek: a függőleges komponenshez tartozik a koszinusz, és lefelé mutat.",
    kepletek: ["F_{3x} = 8\\sin 25^\\circ = 3{,}381\\ \\text{N},\\quad F_{3y} = -8\\cos 25^\\circ = -7{,}250\\ \\text{N}"],
  },
  {
    t0: 9.8,
    cim: "Az x komponensek összege",
    szoveg: "A vízszintes vetületi egyenlet: a kijelentés bal oldalának erői sorban, jobbra az eredő komponense. A tengelyirányú F₂ egyben egy komponens.",
    kepletek: ["\\Fx 3{,}830 + 6 + 3{,}381 + 0 = R_x \\;\\Rightarrow\\; R_x = 13{,}211\\ \\text{N}"],
  },
  {
    t0: 12.8,
    cim: "Az y komponensek összege",
    szoveg: "A függőleges darabok: egy felfelé, kettő lefelé. Az összeg negatív — az eredő lefelé is mutat.",
    kepletek: ["\\Fy 3{,}214 + 0 - 7{,}250 - 4 = R_y \\;\\Rightarrow\\; R_y = -8{,}036\\ \\text{N}"],
  },
  {
    t0: 15.8,
    cim: "Az eredő — és az ellenőrzés",
    szoveg: "Rx és Ry az eredő két komponense. Ellenőrzésként a négy erőt egymás után fűzzük (láncszabály): a lánc vége pontosan az eredő hegyére esik.",
    kepletek: ["\\underline{R} = \\begin{bmatrix} 13{,}211 \\\\ -8{,}036 \\end{bmatrix}\\ \\text{N},\\qquad |\\underline{R}| = 15{,}46\\ \\text{N}"],
  },
];

function Rajz(t) {
  // --- 1. fejezet: erők ---
  const eroU = EROK.map((_, i) => arany(t, 0.6 + i * 0.9, 1.4 + i * 0.9));
  // --- 2. fejezet: F1 komponensei ---
  const f1seged = arany(t, 4.8, 5.5);
  const f1komp = arany(t, 5.5, 6.4);
  // --- 3. fejezet: F3 ---
  const f3seged = arany(t, 7.4, 8.1);
  const f3komp = arany(t, 8.1, 9.1);
  // --- 4. fejezet: x komponensek ---
  const halvany = 1 - 0.85 * arany(t, 9.8, 10.4); // az eredeti erők elhalványulnak
  const f2csusz = arany(t, 10.4, 11.2, rugo);
  const f3xcsusz = arany(t, 11.2, 12.0, rugo);
  const rxFel = arany(t, 12.0, 12.6);
  // --- 5. fejezet: y komponensek ---
  const f3ycsusz = arany(t, 13.2, 14.0, rugo);
  const f4csusz = arany(t, 14.0, 14.8, rugo);
  const ryFel = arany(t, 14.8, 15.4);
  // --- 6. fejezet: eredő és lánc ---
  const rU = arany(t, 16.0, 17.2);
  const lancU = EROK.map((_, i) => arany(t, 17.6 + i * 0.6, 18.2 + i * 0.6));
  const vegFel = arany(t, 20.2, 20.8);

  // a lánc pontjai
  const lanc = [{ x: 0, y: 0 }];
  K.forEach((k) => lanc.push({ x: lanc[lanc.length - 1].x + k.x, y: lanc[lanc.length - 1].y + k.y }));

  return (
    <svg viewBox="0 0 580 360" className="abra w-full select-none">
      <defs>
        {EROK.map((e) => (
          <Hegy key={e.hegy} id={e.hegy} szin={e.szin} />
        ))}
        <Hegy id="f2-t" szin="#475569" />
        <Hegy id="f2-r" szin="#7c3aed" />
        <Hegy id="f2-sz" szin="#94a3b8" />
      </defs>

      {/* tengelyek */}
      <line x1={OX - 40} y1={OY} x2={OX + 420} y2={OY} stroke="#475569" strokeWidth="1.2" markerEnd="url(#f2-t)" />
      <line x1={OX} y1={OY + 200} x2={OX} y2={OY - 120} stroke="#475569" strokeWidth="1.2" markerEnd="url(#f2-t)" />
      <text x={OX + 426} y={OY + 5} fontSize="13" fontStyle="italic" fill="#1d3c48">x</text>
      <text x={OX + 7} y={OY - 124} fontSize="13" fontStyle="italic" fill="#1d3c48">y</text>

      {/* --- eredeti erők --- */}
      {EROK.map((e, i) => {
        const k = K[i];
        const cimkeElt = [
          [14, -8],
          [12, -10],
          [12, 16],
          [-24, 14],
        ][i];
        return (
          <g key={e.nev} opacity={halvany}>
            <NyilA x1={OX} y1={OY} x2={px(k.x)} y2={py(k.y)} u={eroU[i]} szin={e.szin} hegy={e.hegy} />
            <FeliratA x={px(k.x) + cimkeElt[0]} y={py(k.y) + cimkeElt[1]} szin={e.szin} opacitas={arany(t, 1.2 + i * 0.9, 1.5 + i * 0.9)}>
              {e.nev} = {e.F} N
            </FeliratA>
          </g>
        );
      })}

      {/* szögjelölések */}
      <g opacity={halvany}>
        <IvA cx={OX} cy={OY} r={40} kezdoFok={0} vegFok={40} u={f1seged} szin="#e2590a" />
        <FeliratA x={OX + 50} y={OY - 12} szin="#e2590a" meret={11.5} vastag={false} opacitas={f1seged}>40°</FeliratA>
        <IvA cx={OX} cy={OY} r={46} kezdoFok={-90} vegFok={-65} u={f3seged} szin="#2563eb" />
        <FeliratA x={OX + 18} y={OY + 62} szin="#2563eb" meret={11.5} vastag={false} opacitas={f3seged}>25°</FeliratA>
      </g>

      {/* F1 segédvonalak és komponensek (a helyükön, az erő mellett) */}
      <g opacity={halvany}>
        <VonalA x1={px(K[0].x)} y1={py(K[0].y)} x2={px(K[0].x)} y2={OY} u={f1seged} szin="#e2590a" />
        <VonalA x1={px(K[0].x)} y1={py(K[0].y)} x2={OX} y2={py(K[0].y)} u={f1seged} szin="#e2590a" />
        <NyilA x1={OX} y1={OY} x2={px(K[0].x)} y2={OY} u={f1komp} szin="#e2590a" hegy="f2-a" vastag={2.2} />
        <NyilA x1={OX} y1={OY} x2={OX} y2={py(K[0].y)} u={f1komp} szin="#e2590a" hegy="f2-a" vastag={2.2} />
        <FeliratA x={px(K[0].x / 2)} y={OY + 15} szin="#e2590a" meret={11} opacitas={f1komp}>3,830</FeliratA>
        <FeliratA x={OX - 20} y={py(K[0].y / 2) + 4} szin="#e2590a" meret={11} opacitas={f1komp}>3,214</FeliratA>

        {/* F3 */}
        <VonalA x1={px(K[2].x)} y1={py(K[2].y)} x2={px(K[2].x)} y2={OY} u={f3seged} szin="#2563eb" />
        <VonalA x1={px(K[2].x)} y1={py(K[2].y)} x2={OX} y2={py(K[2].y)} u={f3seged} szin="#2563eb" />
        <NyilA x1={OX} y1={OY} x2={px(K[2].x)} y2={OY} u={f3komp} szin="#2563eb" hegy="f2-c" vastag={2.2} />
        <NyilA x1={OX} y1={OY} x2={OX} y2={py(K[2].y)} u={f3komp} szin="#2563eb" hegy="f2-c" vastag={2.2} />
        <FeliratA x={px(K[2].x / 2)} y={OY - 8} szin="#2563eb" meret={11} opacitas={f3komp}>3,381</FeliratA>
        <FeliratA x={OX - 24} y={py(K[2].y / 2) + 4} szin="#2563eb" meret={11} opacitas={f3komp}>−7,250</FeliratA>
      </g>

      {/* --- 4. fejezet: x komponensek egymás után --- */}
      {t >= 9.8 && (
        <g opacity={1 - 0.75 * lancU[0]}>
          {/* F1x marad az origóból */}
          <NyilA x1={OX} y1={OY} x2={px(K[0].x)} y2={OY} szin="#e2590a" hegy="f2-a" vastag={3} />
          {/* F2 az origóból F1x végére csúszik */}
          {(() => {
            const s = lerp(0, K[0].x, f2csusz);
            return <NyilA x1={px(s)} y1={OY} x2={px(s + 6)} y2={OY} szin="#0f766e" hegy="f2-b" vastag={3} />;
          })()}
          {(() => {
            const s = lerp(0, K[0].x + 6, f3xcsusz);
            return <NyilA x1={px(s)} y1={OY} x2={px(s + K[2].x)} y2={OY} szin="#2563eb" hegy="f2-c" vastag={3} />;
          })()}
          {/* Rx felirat és kapocs */}
          <VonalA x1={OX} y1={OY + 26} x2={px(RX)} y2={OY + 26} u={rxFel} szin="#7c3aed" vastag={1.4} szaggatott={false} />
          <VonalA x1={OX} y1={OY + 20} x2={OX} y2={OY + 32} u={rxFel} szin="#7c3aed" vastag={1.4} szaggatott={false} />
          <VonalA x1={px(RX)} y1={OY + 20} x2={px(RX)} y2={OY + 32} u={rxFel} szin="#7c3aed" vastag={1.4} szaggatott={false} />
          <FeliratA x={px(RX / 2)} y={OY + 44} szin="#7c3aed" opacitas={rxFel}>Rx = 13,211 N</FeliratA>
        </g>
      )}

      {/* --- 5. fejezet: y komponensek --- */}
      {t >= 12.8 && (
        <g opacity={1 - 0.75 * lancU[0]}>
          <NyilA x1={OX} y1={OY} x2={OX} y2={py(K[0].y)} szin="#e2590a" hegy="f2-a" vastag={3} />
          {(() => {
            const s = lerp(0, K[0].y, f3ycsusz);
            return <NyilA x1={OX} y1={py(s)} x2={OX} y2={py(s + K[2].y)} szin="#2563eb" hegy="f2-c" vastag={3} />;
          })()}
          {(() => {
            const s = lerp(0, K[0].y + K[2].y, f4csusz);
            return <NyilA x1={OX} y1={py(s)} x2={OX} y2={py(s - 4)} szin="#be123c" hegy="f2-d" vastag={3} />;
          })()}
          <VonalA x1={OX - 26} y1={OY} x2={OX - 26} y2={py(RY)} u={ryFel} szin="#7c3aed" vastag={1.4} szaggatott={false} />
          <VonalA x1={OX - 32} y1={OY} x2={OX - 20} y2={OY} u={ryFel} szin="#7c3aed" vastag={1.4} szaggatott={false} />
          <VonalA x1={OX - 32} y1={py(RY)} x2={OX - 20} y2={py(RY)} u={ryFel} szin="#7c3aed" vastag={1.4} szaggatott={false} />
          <FeliratA x={OX - 36} y={py(RY / 2) + 4} szin="#7c3aed" horgony="end" opacitas={ryFel}>Ry = −8,036 N</FeliratA>
        </g>
      )}

      {/* --- 6. fejezet: eredő és lánc --- */}
      {t >= 15.8 && (
        <g>
          <VonalA x1={px(RX)} y1={OY} x2={px(RX)} y2={py(RY)} u={rU} szin="#7c3aed" />
          <VonalA x1={OX} y1={py(RY)} x2={px(RX)} y2={py(RY)} u={rU} szin="#7c3aed" />
          <NyilA x1={OX} y1={OY} x2={px(RX)} y2={py(RY)} u={rU} szin="#7c3aed" hegy="f2-r" vastag={4} />
          <FeliratA x={px(RX) + 14} y={py(RY) + 6} szin="#7c3aed" meret={13.5} opacitas={arany(t, 17.0, 17.4)} horgony="start">R = 15,46 N</FeliratA>
          {/* lánc */}
          {EROK.map((e, i) => (
            <NyilA
              key={`l${i}`}
              x1={px(lanc[i].x)}
              y1={py(lanc[i].y)}
              x2={px(lanc[i + 1].x)}
              y2={py(lanc[i + 1].y)}
              u={lancU[i]}
              szin={e.szin}
              hegy={e.hegy}
              vastag={2.4}
              opacitas={0.85}
            />
          ))}
          {EROK.map((e, i) => (
            <PontA key={`p${i}`} x={px(lanc[i + 1].x)} y={py(lanc[i + 1].y)} r={3.5} szin={e.szin} u={lancU[i] > 0.98 ? 1 : 0} />
          ))}
          <FeliratA x={px(lanc[2].x) + 10} y={py(lanc[2].y) - 12} szin="#475569" meret={11.5} vastag={false} opacitas={vegFel} horgony="start">
            láncszabály: F₁ → F₂ → F₃ → F₄
          </FeliratA>
          <FeliratA x={px(RX) + 14} y={py(RY) + 24} szin="#475569" meret={11.5} vastag={false} opacitas={vegFel} horgony="start">
            a lánc vége = az eredő hegye ✓
          </FeliratA>
        </g>
      )}
    </svg>
  );
}

export default function FilmGyf2() {
  return (
    <FeladatFilm
      cim="GYF‑2 · Négy erő eredője lépésről lépésre"
      hossz={21.5}
      fejezetek={FEJEZETEK}
      rajz={Rajz}
      megjegyzes="Kattints egy fejezetre az ugráshoz, vagy húzd az idősávot."
    />
  );
}
