"use client";

import FeladatFilm from "@/components/anim/FeladatFilm";
import { arany, lerp, rugo } from "@/components/anim/Idovonal";
import { Hegy, NyilA, VonalA, FeliratA, IvA, PontA } from "@/components/anim/FilmElemek";

const OX = 250;
const OY = 200;
const E = 1.1; // képpont / N
const RAD = Math.PI / 180;

const F1 = { x: -150 * Math.cos(55 * RAD), y: 150 * Math.sin(55 * RAD) }; // (−86,04; 122,9)
const F2 = { x: 150 * Math.sin(25 * RAD), y: -150 * Math.cos(25 * RAD) }; // (63,39; −135,9)
const P = { x: F1.x + F2.x, y: F1.y + F2.y }; // (−22,65; −13,0)
const F3 = { x: -P.x, y: -P.y };

const px = (x) => OX + x * E;
const py = (y) => OY - y * E;

const NAR = "#e2590a";
const TEAL = "#0f766e";
const LILA = "#7c3aed";

const FEJEZETEK = [
  {
    t0: 0,
    cim: "A két ismert erő",
    szoveg: "F₁ a második síknegyedbe mutat (55° a negatív x tengelytől), F₂ a negyedikbe (25° a függőlegestől). Mindkettő 150 N. A harmadik erőt keressük, amellyel a három erő egyensúlyban van.",
    kepletek: ["\\underline{F}_1 + \\underline{F}_2 + \\underline{F}_3 = \\underline{0}"],
  },
  {
    t0: 3,
    cim: "Komponensek",
    szoveg: "F₁-nél a szög az x tengelytől indul, de a vízszintes komponens negatív. F₂-nél a szög a függőlegestől indul, ezért a szinusz és a koszinusz szerepet cserél.",
    kepletek: ["\\underline{F}_1 = \\begin{bmatrix} -86{,}04 \\\\ 122{,}9 \\end{bmatrix},\\quad \\underline{F}_2 = \\begin{bmatrix} 63{,}39 \\\\ -135{,}9 \\end{bmatrix}\\ \\text{N}"],
  },
  {
    t0: 6.2,
    cim: "F₁ + F₂ láncban",
    szoveg: "F₂-t az F₁ hegyéhez toljuk. A lánc vége az első két erő összege — közel az origóhoz, de nem ott.",
    kepletek: ["\\underline{F}_1 + \\underline{F}_2 = \\begin{bmatrix} -22{,}65 \\\\ -13{,}0 \\end{bmatrix}\\ \\text{N}"],
  },
  {
    t0: 9.2,
    cim: "Egyensúly: a sokszög bezárul",
    szoveg: "Ha a három erő egyensúlyban van, a lánc vissza kell, hogy érjen az origóba. F₃ tehát a lánc végétől az origóba mutat — az első kettő összegének az ellentettje.",
    kepletek: ["\\underline{F}_3 = -(\\underline{F}_1 + \\underline{F}_2) = \\begin{bmatrix} 22{,}65 \\\\ 13{,}0 \\end{bmatrix}\\ \\text{N}"],
  },
  {
    t0: 12.2,
    cim: "F₃ nagysága és iránya",
    szoveg: "Mindkét komponens pozitív, ezért F₃ az első síknegyedbe mutat, és az arctg közvetlenül adja az irányszöget.",
    kepletek: ["|\\underline{F}_3| = \\sqrt{22{,}65^2 + 13{,}0^2} = 26{,}12\\ \\text{N},\\qquad \\alpha = \\operatorname{arctg}\\tfrac{13{,}0}{22{,}65} = 29{,}85^\\circ"],
  },
];

function Rajz(t) {
  const f1U = arany(t, 0.5, 1.6);
  const f2U = arany(t, 1.8, 2.9);
  const szogU = arany(t, 3.2, 3.9);
  const kompU = arany(t, 3.9, 5.2);
  const csusz = arany(t, 6.4, 7.6, rugo);
  const pFel = arany(t, 7.6, 8.4);
  const f3U = arany(t, 9.5, 10.8);
  const zarFel = arany(t, 10.8, 11.4);
  const masol = arany(t, 12.4, 13.4, rugo);
  const vegFel = arany(t, 13.4, 14.0);

  // F2 kezdőpontja: origó → F1 hegye
  const s2 = { x: lerp(0, F1.x, csusz), y: lerp(0, F1.y, csusz) };
  // F3 másolat: a lánc végétől az origóba → az origóból kifelé
  const s3 = { x: lerp(P.x, 0, masol), y: lerp(P.y, 0, masol) };

  return (
    <svg viewBox="0 0 560 400" className="abra w-full select-none">
      <defs>
        <Hegy id="g3-a" szin={NAR} />
        <Hegy id="g3-b" szin={TEAL} />
        <Hegy id="g3-c" szin={LILA} />
        <Hegy id="g3-t" szin="#475569" />
      </defs>

      <line x1={OX - 200} y1={OY} x2={OX + 260} y2={OY} stroke="#475569" strokeWidth="1.2" markerEnd="url(#g3-t)" />
      <line x1={OX} y1={OY + 180} x2={OX} y2={OY - 170} stroke="#475569" strokeWidth="1.2" markerEnd="url(#g3-t)" />
      <text x={OX + 266} y={OY + 5} fontSize="13" fontStyle="italic" fill="#1d3c48">x</text>
      <text x={OX + 7} y={OY - 174} fontSize="13" fontStyle="italic" fill="#1d3c48">y</text>

      {/* F1 */}
      <NyilA x1={OX} y1={OY} x2={px(F1.x)} y2={py(F1.y)} u={f1U} szin={NAR} hegy="g3-a" />
      <FeliratA x={px(F1.x) - 10} y={py(F1.y) - 10} szin={NAR} opacitas={arany(t, 1.4, 1.8)} horgony="end">F₁ = 150 N</FeliratA>
      <IvA cx={OX} cy={OY} r={44} kezdoFok={180} vegFok={125} u={szogU} szin={NAR} />
      <FeliratA x={OX - 62} y={OY - 20} szin={NAR} meret={11.5} vastag={false} opacitas={szogU}>55°</FeliratA>
      {/* F1 komponensek */}
      <g opacity={kompU * (1 - 0.7 * csusz)}>
        <VonalA x1={px(F1.x)} y1={py(F1.y)} x2={px(F1.x)} y2={OY} szin={NAR} />
        <VonalA x1={px(F1.x)} y1={py(F1.y)} x2={OX} y2={py(F1.y)} szin={NAR} />
        <FeliratA x={px(F1.x / 2)} y={OY + 15} szin={NAR} meret={11}>−86,04</FeliratA>
        <FeliratA x={OX + 6} y={py(F1.y / 2)} szin={NAR} meret={11} horgony="start">122,9</FeliratA>
      </g>

      {/* F2 – az origóból, majd F1 hegyére csúszik */}
      <NyilA x1={px(s2.x)} y1={py(s2.y)} x2={px(s2.x + F2.x)} y2={py(s2.y + F2.y)} u={f2U} szin={TEAL} hegy="g3-b" />
      <FeliratA x={px(s2.x + F2.x) + 10} y={py(s2.y + F2.y) + 14} szin={TEAL} opacitas={arany(t, 2.7, 3.1) * (1 - csusz)} horgony="start">F₂ = 150 N</FeliratA>
      <FeliratA x={px(s2.x + F2.x / 2) + 12} y={py(s2.y + F2.y / 2) + 4} szin={TEAL} meret={11.5} opacitas={csusz} horgony="start">F₂</FeliratA>
      <g opacity={1 - csusz}>
        <IvA cx={OX} cy={OY} r={50} kezdoFok={-90} vegFok={-65} u={szogU} szin={TEAL} />
        <FeliratA x={OX + 20} y={OY + 66} szin={TEAL} meret={11.5} vastag={false} opacitas={szogU}>25°</FeliratA>
      </g>
      <g opacity={kompU * (1 - csusz)}>
        <VonalA x1={px(F2.x)} y1={py(F2.y)} x2={px(F2.x)} y2={OY} szin={TEAL} />
        <VonalA x1={px(F2.x)} y1={py(F2.y)} x2={OX} y2={py(F2.y)} szin={TEAL} />
        <FeliratA x={px(F2.x / 2)} y={OY - 8} szin={TEAL} meret={11}>63,39</FeliratA>
        <FeliratA x={OX - 6} y={py(F2.y / 2)} szin={TEAL} meret={11} horgony="end">−135,9</FeliratA>
      </g>
      {/* halvány F2 az eredeti helyén, miután elcsúszott */}
      {csusz > 0.05 && <NyilA x1={OX} y1={OY} x2={px(F2.x)} y2={py(F2.y)} szin={TEAL} hegy="g3-b" opacitas={0.2} />}

      {/* a lánc vége */}
      <PontA x={px(P.x)} y={py(P.y)} r={4} szin="#475569" u={pFel} />
      <VonalA x1={OX} y1={OY} x2={px(P.x)} y2={py(P.y)} u={pFel} szin="#475569" vastag={1.3} />
      <FeliratA x={px(P.x) - 16} y={py(P.y) + 36} szin="#475569" meret={11.5} opacitas={pFel} horgony="end">F₁ + F₂ = (−22,65; −13,0)</FeliratA>

      {/* F3: a lánc végétől az origóba, majd másolat az origóból */}
      <NyilA x1={px(P.x)} y1={py(P.y)} x2={OX} y2={OY} u={f3U} szin={LILA} hegy="g3-c" vastag={3.4} opacitas={1 - 0.6 * masol} />
      <FeliratA x={OX + 40} y={OY + 44} szin={LILA} opacitas={zarFel * (1 - masol)} horgony="start">F₃ bezárja a sokszöget</FeliratA>
      {/* nagyító az origó környékéről */}
      {(() => {
        const N = 2.2;
        const cx = 448;
        const cy = 300;
        const rad = 80;
        const ins = (x, y) => [cx + N * (x - OX), cy + N * (y - OY)];
        const op = Math.max(pFel, 0) * (masol > 0.02 ? 1 : 1);
        if (op <= 0.01) return null;
        const p0 = ins(px(P.x), py(P.y));
        const o = ins(OX, OY);
        const f3v = ins(px(s3.x + F3.x), py(s3.y + F3.y));
        const f3s = ins(px(s3.x), py(s3.y));
        return (
          <g opacity={op}>
            <clipPath id="g3-nagyito">
              <circle cx={cx} cy={cy} r={rad} />
            </clipPath>
            <circle cx={cx} cy={cy} r={rad} fill="white" stroke="#94a3b8" strokeWidth="1.2" />
            <g clipPath="url(#g3-nagyito)">
              <line x1={cx - rad} y1={cy} x2={cx + rad} y2={cy} stroke="#cbd5e1" strokeWidth="1" />
              <line x1={cx} y1={cy - rad} x2={cx} y2={cy + rad} stroke="#cbd5e1" strokeWidth="1" />
              <line x1={p0[0]} y1={p0[1]} x2={o[0]} y2={o[1]} stroke="#475569" strokeWidth="1" strokeDasharray="4 3" />
              <circle cx={p0[0]} cy={p0[1]} r="4" fill="#475569" />
              {f3U > 0.02 && <NyilA x1={p0[0]} y1={p0[1]} x2={o[0]} y2={o[1]} u={f3U} szin={LILA} hegy="g3-c" vastag={3.4} opacitas={1 - 0.6 * masol} />}
              {masol > 0.02 && <NyilA x1={f3s[0]} y1={f3s[1]} x2={f3v[0]} y2={f3v[1]} szin={LILA} hegy="g3-c" vastag={3.4} />}
              <circle cx={o[0]} cy={o[1]} r="3" fill="#1d3c48" />
            </g>
            <text x={cx} y={cy + rad + 16} textAnchor="middle" fontSize="11" fill="#64748b">nagyítás 2,2×</text>
          </g>
        );
      })()}
      {masol > 0.02 && (
        <>
          <NyilA x1={px(s3.x)} y1={py(s3.y)} x2={px(s3.x + F3.x)} y2={py(s3.y + F3.y)} szin={LILA} hegy="g3-c" vastag={3.4} />
          <IvA cx={OX} cy={OY} r={30} kezdoFok={0} vegFok={29.85} u={vegFel} szin={LILA} />
          <FeliratA x={OX + 38} y={OY - 8} szin={LILA} meret={11.5} vastag={false} opacitas={vegFel}>29,85°</FeliratA>
          <FeliratA x={px(F3.x) + 10} y={py(F3.y) - 8} szin={LILA} meret={13} opacitas={vegFel} horgony="start">F₃ = 26,12 N</FeliratA>
        </>
      )}
    </svg>
  );
}

export default function FilmGyf3() {
  return (
    <FeladatFilm
      cim="GYF‑3 · A hiányzó erő: a vektorsokszög bezárul"
      hossz={14.6}
      fejezetek={FEJEZETEK}
      rajz={Rajz}
      megjegyzes="Egyensúlynál a lánc mindig visszaér a kiindulópontba — a hiányzó erő az, ami bezárja."
    />
  );
}
