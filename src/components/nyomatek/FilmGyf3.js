"use client";

import FeladatFilm from "@/components/anim/FeladatFilm";
import { arany, lerp, rugo } from "@/components/anim/Idovonal";
import { Hegy, NyilA, VonalA, FeliratA, IvA, PontA } from "@/components/anim/FilmElemek";

const OX = 330;
const OY = 215;
const L = 13; // képpont / m
const E = 4.2; // képpont / kN

// erők: támadáspont (m), komponensek (kN)
const EROK = [
  { nev: "F₁", p: { x: 0, y: 7 }, F: { x: 23, y: 0 }, M: -161, kar: "7 m", szin: "#e2590a", hegy: "f3-a" },
  { nev: "F₂", p: { x: 8, y: 0 }, F: { x: 0, y: -9 }, M: -72, kar: "8 m", szin: "#0f766e", hegy: "f3-b" },
  { nev: "F₃", p: { x: 0, y: -4 }, F: { x: 20, y: 0 }, M: 80, kar: "4 m", szin: "#2563eb", hegy: "f3-c" },
  { nev: "F₄", p: { x: -3, y: 0 }, F: { x: 0, y: 19 }, M: -57, kar: "3 m", szin: "#be123c", hegy: "f3-d" },
];
const RX = 43;
const RY = 10;
const MO = -210;
const X0 = -21;

const px = (x) => OX + x * L;
const py = (y) => OY - y * L;
const ex = (x0, Fx) => px(x0) + Fx * E; // erőnyíl vége (képpont)
const ey = (y0, Fy) => py(y0) - Fy * E;

const FEJEZETEK = [
  {
    t0: 0,
    cim: "Az erőrendszer",
    szoveg: "Négy tengelyirányú erő, mindegyik más hatásvonalon. Redukálás: minden erőt az origóba tolunk, és a „mozgatás árát” nyomatékkal fizetjük meg.",
    kepletek: ["(\\underline{F}_1, \\underline{F}_2, \\underline{F}_3, \\underline{F}_4) \\ekv (\\underline{R},\\ M^{(O)})"],
  },
  {
    t0: 4,
    cim: "F₁ az origóba — nyomatékkal",
    szoveg: "F₁ vízszintes, a hatásvonala 7 m-rel az origó fölött. Ha O-ba toljuk, egy erőpár marad hátra: −y·Fx = −7·23. A negatív előjel: az óramutató irányába forgat.",
    kepletek: ["M_1 = -y_1 F_{1x} = -7\\cdot 23 = -161\\ \\text{kNm}"],
  },
  {
    t0: 6.2,
    cim: "F₂, F₃, F₄ ugyanígy",
    szoveg: "Függőleges erőnél x·Fy, vízszintesnél −y·Fx. Figyeld az előjeleket: F₃ az egyetlen, amelyik az óramutatóval ellentétesen forgat.",
    kepletek: ["M_2 = 8\\cdot(-9) = -72,\\quad M_3 = -(-4)\\cdot 20 = +80,\\quad M_4 = (-3)\\cdot 19 = -57"],
  },
  {
    t0: 10,
    cim: "Az erők összege O-ban",
    szoveg: "Az origóban ülő négy erőt egymás után fűzzük. Csak a vízszintesek adnak Rx-et, csak a függőlegesek Ry-t.",
    kepletek: ["\\Fx 23 + 0 + 20 + 0 = R_x = 43\\ \\text{kN}", "\\Fy 0 - 9 + 0 + 19 = R_y = 10\\ \\text{kN}", "|\\underline{R}| = 44,15\\ \\text{kN},\\ \\alpha = 13,09^\\circ"],
  },
  {
    t0: 13.6,
    cim: "A nyomatékok összege",
    szoveg: "A négy erőpár egyetlen erőpárrá olvad össze. Az eredmény negatív: az egész rendszer az óramutató irányába forgat az origó körül.",
    kepletek: ["\\Mp{O} -161 - 72 + 80 - 57 = M^{(O)} = -210\\ \\text{kNm}"],
  },
  {
    t0: 15.4,
    cim: "Az eredő a saját hatásvonalán",
    szoveg: "R ≠ 0, ezért az eredő egyetlen erő. Ha R-t az x tengely mentén odébb toljuk, a nyomaték eltűnik — ott, ahol x₀·Ry = M. A negatív x₀: az origótól balra.",
    kepletek: ["\\Mp{O} -210 = x_0 R_y = x_0\\cdot 10 \\;\\Rightarrow\\; x_0 = -21\\ \\text{m}"],
  },
];

function Rajz(t) {
  const eroU = EROK.map((_, i) => arany(t, 0.5 + i * 0.75, 1.2 + i * 0.75));
  // mozgatás ideje erőnként
  const mozgKezd = [4.2, 6.4, 7.5, 8.6];
  const mozgU = EROK.map((_, i) => arany(t, mozgKezd[i], mozgKezd[i] + 0.8, rugo));
  const karU = EROK.map((_, i) => arany(t, mozgKezd[i] - 0.2, mozgKezd[i] + 0.3));
  const ivU = EROK.map((_, i) => arany(t, mozgKezd[i] + 0.6, mozgKezd[i] + 1.3));
  // lánc O-ban
  const lancU = EROK.map((_, i) => arany(t, 10.2 + i * 0.5, 10.7 + i * 0.5));
  const rU = arany(t, 12.3, 13.1);
  // nyomatékok egyesülnek
  const egyU = arany(t, 13.8, 14.8);
  // eredő átcsúszik a hatásvonalára
  const csuszU = arany(t, 15.6, 17.0, rugo);
  const x0Fel = arany(t, 17.2, 17.8);

  const rTolas = lerp(0, X0, csuszU); // m
  const ivSugar = (i) => 26 + i * 9;

  // lánc pontjai kN-ban
  const lanc = [{ x: 0, y: 0 }];
  EROK.forEach((e) => lanc.push({ x: lanc[lanc.length - 1].x + e.F.x, y: lanc[lanc.length - 1].y + e.F.y }));

  return (
    <svg viewBox="0 0 640 400" className="abra w-full select-none">
      <defs>
        {EROK.map((e) => (
          <Hegy key={e.hegy} id={e.hegy} szin={e.szin} />
        ))}
        <Hegy id="f3-t" szin="#475569" />
        <Hegy id="f3-r" szin="#7c3aed" />
        <Hegy id="f3-m" szin="#9f1239" />
      </defs>

      {/* tengelyek */}
      <line x1={OX - 300} y1={OY} x2={OX + 290} y2={OY} stroke="#475569" strokeWidth="1.2" markerEnd="url(#f3-t)" />
      <line x1={OX} y1={OY + 150} x2={OX} y2={OY - 175} stroke="#475569" strokeWidth="1.2" markerEnd="url(#f3-t)" />
      <text x={OX + 296} y={OY + 5} fontSize="13" fontStyle="italic" fill="#1d3c48">x</text>
      <text x={OX + 7} y={OY - 179} fontSize="13" fontStyle="italic" fill="#1d3c48">y</text>
      <text x={OX - 14} y={OY + 16} fontSize="12" fontWeight="600" fill="#475569">O</text>

      {/* --- erők: eredeti helyükről az origóba csúsznak --- */}
      {EROK.map((e, i) => {
        const tx = lerp(e.p.x, 0, mozgU[i]);
        const ty = lerp(e.p.y, 0, mozgU[i]);
        const elt = t >= 10.2 ? 0 : 1; // a lánc fejezetétől az O-ban ülő erőket a lánc rajzolja
        const lab = [
          [12, -8],
          [12, 16],
          [12, 16],
          [-14, -8],
        ][i];
        return (
          <g key={e.nev}>
            {/* szellemkép az eredeti helyen */}
            {mozgU[i] > 0.02 && (
              <NyilA x1={px(e.p.x)} y1={py(e.p.y)} x2={ex(e.p.x, e.F.x)} y2={ey(e.p.y, e.F.y)} szin={e.szin} hegy={e.hegy} opacitas={0.22} />
            )}
            {/* erőkar */}
            <VonalA x1={OX} y1={OY} x2={px(e.p.x)} y2={py(e.p.y)} u={karU[i]} szin={e.szin} vastag={1.3} opacitas={1 - 0.7 * mozgU[i]} />
            <FeliratA
              x={(OX + px(e.p.x)) / 2 + (e.F.x !== 0 ? -18 : 0)}
              y={(OY + py(e.p.y)) / 2 + (e.F.x !== 0 ? 4 : -8)}
              szin={e.szin}
              meret={11}
              vastag={false}
              opacitas={karU[i] * (1 - 0.6 * mozgU[i])}
            >
              {e.kar}
            </FeliratA>
            {/* az erő */}
            {elt === 1 && (
              <NyilA x1={px(tx)} y1={py(ty)} x2={ex(tx, e.F.x)} y2={ey(ty, e.F.y)} u={eroU[i]} szin={e.szin} hegy={e.hegy} />
            )}
            <FeliratA
              x={ex(e.p.x, e.F.x) + lab[0]}
              y={ey(e.p.y, e.F.y) + lab[1]}
              szin={e.szin}
              opacitas={arany(t, 1.0 + i * 0.75, 1.3 + i * 0.75) * (1 - 0.5 * mozgU[i])}
              horgony={i === 3 ? "end" : "start"}
            >
              {e.nev} = {Math.abs(e.F.x || e.F.y)} kN
            </FeliratA>
            {/* a hátramaradó nyomaték íve */}
            {egyU < 0.98 && (
              <IvA
                cx={OX}
                cy={OY}
                r={ivSugar(i)}
                kezdoFok={e.M < 0 ? 150 : 30}
                vegFok={e.M < 0 ? 30 : 150}
                u={ivU[i]}
                szin={e.szin}
                vastag={2}
                hegy={e.hegy}
                opacitas={1 - egyU}
              />
            )}
            <FeliratA
              x={OX - 150}
              y={OY - 118 - i * 16}
              szin={e.szin}
              meret={11.5}
              opacitas={ivU[i] * (1 - egyU)}
              horgony="end"
            >
              M{["₁", "₂", "₃", "₄"][i]} = {e.M > 0 ? "+" : "−"}{Math.abs(e.M)} kNm
            </FeliratA>
          </g>
        );
      })}

      {/* --- lánc O-ban és R --- */}
      {t >= 10.2 && (
        <g>
          {EROK.map((e, i) => (
            <NyilA
              key={`l${i}`}
              x1={px(rTolas) + lanc[i].x * E}
              y1={OY - lanc[i].y * E}
              x2={px(rTolas) + lanc[i + 1].x * E}
              y2={OY - lanc[i + 1].y * E}
              u={lancU[i]}
              szin={e.szin}
              hegy={e.hegy}
              vastag={2.4}
              opacitas={0.9 - 0.6 * csuszU}
            />
          ))}
          <NyilA x1={px(rTolas)} y1={OY} x2={px(rTolas) + RX * E} y2={OY - RY * E} u={rU} szin="#7c3aed" hegy="f3-r" vastag={4.2} />
          <FeliratA x={px(rTolas) + RX * E + 10} y={OY - RY * E - 6} szin="#7c3aed" meret={13} opacitas={arany(t, 12.9, 13.3)} horgony="start">
            R = 44,15 kN
          </FeliratA>
          <FeliratA x={px(rTolas) + RX * E + 10} y={OY - RY * E + 10} szin="#7c3aed" meret={11} vastag={false} opacitas={arany(t, 12.9, 13.3)} horgony="start">
            α = 13,09°
          </FeliratA>
        </g>
      )}

      {/* --- egyesített nyomaték --- */}
      {t >= 13.8 && (
        <g>
          <IvA cx={OX} cy={OY} r={44} kezdoFok={150} vegFok={30} u={egyU} szin="#9f1239" vastag={3.4 * (1 - csuszU) + 0.1} hegy="f3-m" opacitas={1 - csuszU} />
          <FeliratA x={OX - 150} y={OY - 118} szin="#9f1239" meret={13} opacitas={arany(t, 14.4, 14.9) * (1 - csuszU)} horgony="end">
            M = −210 kNm
          </FeliratA>
        </g>
      )}

      {/* --- x0 --- */}
      {t >= 15.6 && (
        <g>
          <PontA x={px(X0)} y={OY} r={4.5} szin="#7c3aed" u={csuszU} />
          <VonalA x1={px(X0) - 40 * (RX / 44.15)} y1={OY + 40 * (RY / 44.15)} x2={px(X0) + 290 * (RX / 44.15)} y2={OY - 290 * (RY / 44.15)} u={x0Fel} szin="#7c3aed" opacitas={0.6} />
          <VonalA x1={OX} y1={OY + 30} x2={px(X0)} y2={OY + 30} u={x0Fel} szin="#7c3aed" vastag={1.3} szaggatott={false} />
          <FeliratA x={px(X0 / 2)} y={OY + 46} szin="#7c3aed" opacitas={x0Fel}>x₀ = −21 m</FeliratA>
          <FeliratA x={px(X0 / 2)} y={OY + 62} szin="#475569" meret={11} vastag={false} opacitas={x0Fel}>
            itt x₀·Ry = −21·10 = −210 kNm — ugyanaz, amit az erőpár adott
          </FeliratA>
        </g>
      )}
    </svg>
  );
}

export default function FilmGyf3() {
  return (
    <FeladatFilm
      cim="GYF‑3 · Redukálás az origóra, majd az eredő hatásvonala"
      hossz={18.5}
      fejezetek={FEJEZETEK}
      rajz={Rajz}
      megjegyzes="Az ívek a hátramaradó erőpárokat mutatják: az óramutató irányába forgató negatív, az ellentétes pozitív."
    />
  );
}
