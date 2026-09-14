"use client";

import FeladatFilm from "@/components/anim/FeladatFilm";
import { arany, lerp, rugo } from "@/components/anim/Idovonal";
import { Hegy, NyilA, VonalA, FeliratA, IvA, PontA } from "@/components/anim/FilmElemek";

const OX = 90;
const OY = 150;
const L = 68; // képpont / m
const E = 3; // képpont / kN
const F = 11;
const XS = [2, 3, 4, 5];
const SZINEK = ["#e2590a", "#0f766e", "#2563eb", "#be123c"];
const R = -44;
const XR = 3.5;

const px = (x) => OX + x * L;

const FEJEZETEK = [
  {
    t0: 0,
    cim: "Négy egyforma, párhuzamos erő",
    szoveg: "Mind a négy 11 kN, mind lefelé mutat, 2, 3, 4 és 5 m-nél. Párhuzamos erőknél az eredő nagysága egyszerű összeg, a helye a nyomatéki egyenletből jön.",
    kepletek: ["(\\underline{F}_1, \\underline{F}_2, \\underline{F}_3, \\underline{F}_4) \\doteq \\underline{R}"],
  },
  {
    t0: 3.4,
    cim: "Az eredő nagysága",
    szoveg: "A négy erőt egymás után fűzve egyetlen, négyszer akkora erő lesz — mind negatív y irányú.",
    kepletek: ["R_y = -4\\cdot 11 = -44\\ \\text{kN}\\quad(\\downarrow)"],
  },
  {
    t0: 6.6,
    cim: "Nyomaték az origóra",
    szoveg: "Lefelé mutató erő az origótól jobbra az óramutató irányába forgat: minden tag negatív. Minél távolabb az erő, annál nagyobb a nyomatéka.",
    kepletek: ["M^{(O)} = 2\\cdot(-11) + 3\\cdot(-11) + 4\\cdot(-11) + 5\\cdot(-11) = -154\\ \\text{kNm}"],
  },
  {
    t0: 11,
    cim: "Az eredő helye",
    szoveg: "Az eredőnek ugyanezt a nyomatékot kell adnia. Az origóból indulva addig toljuk, amíg x·(−44) = −154 lesz — a négy erő „közepén” áll meg, a 2 és az 5 felezőjénél.",
    kepletek: ["x_R = \\frac{M^{(O)}}{R_y} = \\frac{-154}{-44} = 3{,}5\\ \\text{m}"],
  },
];

function Rajz(t) {
  const eroU = XS.map((_, i) => arany(t, 0.5 + i * 0.6, 1.1 + i * 0.6));
  const halmoz = XS.map((_, i) => arany(t, 3.6 + i * 0.6, 4.2 + i * 0.6, rugo)); // a jobb oldali oszlopba
  const rFel = arany(t, 6.0, 6.5);
  const ivU = XS.map((_, i) => arany(t, 6.8 + i * 0.9, 7.5 + i * 0.9));
  const osszFel = arany(t, 10.4, 10.9);
  const rO = arany(t, 11.2, 11.9); // R megjelenik az origóban
  const csusz = arany(t, 12.1, 13.4, rugo);
  const xFel = arany(t, 13.5, 14.0);

  const halmozX = 6.4; // m – az összeadás oszlopa
  const rX = lerp(0, XR, csusz);
  const mMarad = 1 - csusz; // az origóban maradó nyomaték aránya

  return (
    <svg viewBox="0 0 600 330" className="abra w-full select-none">
      <defs>
        {SZINEK.map((s, i) => (
          <Hegy key={i} id={`p2-${i}`} szin={s} />
        ))}
        <Hegy id="p2-t" szin="#475569" />
        <Hegy id="p2-r" szin="#7c3aed" />
        <Hegy id="p2-m" szin="#9f1239" />
      </defs>

      {/* tengely */}
      <line x1={OX - 30} y1={OY} x2={OX + 7.3 * L} y2={OY} stroke="#475569" strokeWidth="1.2" markerEnd="url(#p2-t)" />
      <line x1={OX} y1={OY + 100} x2={OX} y2={OY - 110} stroke="#475569" strokeWidth="1.2" markerEnd="url(#p2-t)" />
      <text x={OX + 7.3 * L + 6} y={OY + 5} fontSize="13" fontStyle="italic" fill="#1d3c48">x</text>
      <text x={OX + 7} y={OY - 114} fontSize="13" fontStyle="italic" fill="#1d3c48">y</text>
      <text x={OX - 14} y={OY + 16} fontSize="12" fontWeight="600" fill="#475569">O</text>
      <FeliratA x={px(3.5)} y={OY - F * E - 30} szin="#64748b" meret={11} vastag={false} opacitas={arany(t, 2.6, 3.0) * (1 - halmoz[0])}>mind a négy 11 kN</FeliratA>
      {XS.map((x) => (
        <g key={x}>
          <line x1={px(x)} y1={OY - 4} x2={px(x)} y2={OY + 4} stroke="#475569" strokeWidth="1" />
          <text x={px(x)} y={OY + 18} textAnchor="middle" fontSize="11" fill="#64748b">{x} m</text>
        </g>
      ))}

      {/* erők a helyükön (felülről lefelé, hegy a tengelyen) */}
      {XS.map((x, i) => (
        <g key={i} opacity={1 - 0.75 * halmoz[i]}>
          <NyilA x1={px(x)} y1={OY - F * E - 4} x2={px(x)} y2={OY - 4} u={eroU[i]} szin={SZINEK[i]} hegy={`p2-${i}`} />
          <FeliratA x={px(x)} y={OY - F * E - 12} szin={SZINEK[i]} meret={11.5} opacitas={arany(t, 1.0 + i * 0.6, 1.3 + i * 0.6)}>
            F{["₁", "₂", "₃", "₄"][i]}
          </FeliratA>
        </g>
      ))}

      {/* összeadás oszlopa: a négy erő egymás alá csúszik */}
      {XS.map((x, i) => {
        if (halmoz[i] <= 0.01) return null;
        const cx = lerp(px(x), px(halmozX), halmoz[i]);
        const cy = lerp(OY - F * E - 4, OY - 4 - F * E * (4 - i) + 0, halmoz[i]); // az i-edik a tetejétől lefelé
        return <NyilA key={`h${i}`} x1={cx} y1={cy} x2={cx} y2={cy + F * E} szin={SZINEK[i]} hegy={`p2-${i}`} />;
      })}
      <g opacity={rFel * (1 - rO)}>
        <VonalA x1={px(halmozX) - 12} y1={OY - 4 - 4 * F * E} x2={px(halmozX) - 12} y2={OY - 4} szin="#7c3aed" vastag={1.4} szaggatott={false} />
        <FeliratA x={px(halmozX) - 18} y={OY - 2 * F * E} szin="#7c3aed" meret={12.5} horgony="end">R = −44 kN</FeliratA>
      </g>

      {/* nyomaték-ívek az origó körül */}
      {XS.map((x, i) => (
        <g key={`m${i}`} opacity={1 - csusz}>
          <IvA cx={OX} cy={OY} r={24 + i * 9} kezdoFok={120} vegFok={30} u={ivU[i]} szin={SZINEK[i]} vastag={1.8} hegy={`p2-${i}`} />
          <FeliratA x={OX + 34} y={OY + 40 + i * 15} szin={SZINEK[i]} meret={11.5} opacitas={ivU[i]} horgony="start">
            {x}·(−11) = −{x * 11}
          </FeliratA>
        </g>
      ))}
      <FeliratA x={OX + 34} y={OY + 40 + 4 * 15 + 4} szin="#9f1239" meret={12.5} opacitas={osszFel * (1 - csusz)} horgony="start">
        M = −154 kNm
      </FeliratA>
      {csusz > 0.02 && csusz < 0.98 && (
        <IvA cx={OX} cy={OY} r={40} kezdoFok={120} vegFok={30} u={mMarad} szin="#9f1239" vastag={3} hegy="p2-m" opacitas={mMarad} />
      )}

      {/* R az origóban, majd elcsúszik */}
      {rO > 0.02 && (
        <>
          <NyilA x1={px(rX)} y1={OY - 4 - 4 * F * E * rO} x2={px(rX)} y2={OY - 4} szin="#7c3aed" hegy="p2-r" vastag={4.2} />
          <FeliratA x={px(rX)} y={OY - 4 - 4 * F * E - 10} szin="#7c3aed" meret={13} opacitas={rO}>R = 44 kN ↓</FeliratA>
          <PontA x={px(XR)} y={OY} r={4.5} szin="#7c3aed" u={xFel} />
          <g opacity={xFel}>
            <VonalA x1={OX} y1={OY + 34} x2={px(XR)} y2={OY + 34} szin="#7c3aed" vastag={1.3} szaggatott={false} />
            <FeliratA x={px(XR / 2)} y={OY + 50} szin="#7c3aed" meret={12.5}>xᵣ = 3,5 m</FeliratA>
            <FeliratA x={px(XR / 2)} y={OY + 66} szin="#475569" meret={11} vastag={false}>ellenőrzés: 3,5·(−44) = −154 ✓</FeliratA>
          </g>
        </>
      )}
    </svg>
  );
}

export default function FilmGyf2() {
  return (
    <FeladatFilm
      cim="GYF‑2 · Négy párhuzamos erő eredője és helye"
      hossz={14.4}
      fejezetek={FEJEZETEK}
      rajz={Rajz}
      megjegyzes="Az ívek a nyomatékok: mind az óramutató irányába forgat, ezért mind negatív."
    />
  );
}
