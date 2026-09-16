"use client";

import RacsosRajz from "./RacsosRajz";

/*
 * A 7. modul kidolgozott feladatainak ábrái (GYF‑1 … GYF‑7): a feladatlap rajza
 * a csomópontok sorszámával, a terhekkel és a méretekkel.
 */

import { M_GYF1, M_GYF2, M_GYF3, M_GYF4, M_GYF5, M_GYF6, M_GYF7_EREDETI } from "./gyfModellek";

const alap = { szinez: false, meretek: true, magassag: 330 };

export function AbraGyf1() {
  return <RacsosRajz modell={M_GYF1} {...alap} cimke="A = CSUKLÓ (1), B = GÖRGŐ (7); A RÁCSRUDAK 3–4–5-ÖS HÁROMSZÖGEK: cos = 0,6, sin = 0,8" />;
}
export function AbraGyf2() {
  return <RacsosRajz modell={M_GYF2} {...alap} kiemeltRudak={["2,3", "2,8", "7,8"]} cimke="A KIEMELT RUDAK: AZ ÁTMETSZÉS (S₂,₃, S₂,₈, S₇,₈)" />;
}
export function AbraGyf3() {
  return <RacsosRajz modell={M_GYF3} {...alap} cimke="H07: a = 2 m, b = 1,5 m — A RÁCSRUDAK HOSSZA 2,5 m" />;
}
export function AbraGyf4() {
  return <RacsosRajz modell={M_GYF4} {...alap} magassag={360} cimke="H08/1: b = 2 m, a = 1,5 m — K-RÁCSOZÁS A SZÉLSŐ MEZŐKBEN" />;
}
export function AbraGyf5() {
  return <RacsosRajz modell={M_GYF5} {...alap} magassag={360} cimke="H08/2: b = 2 m, a = 2 m, A FELSŐ ÖV 2 m-t EMELKEDIK; A ÉS B CSUKLÓ" />;
}
export function AbraGyf6() {
  return <RacsosRajz modell={M_GYF6} {...alap} magassag={360} kiemeltRudak={["2,3", "2,8", "7,8"]} cimke="VIZSGAMINTA 3. FELADAT — AZ ÁTMETSZÉS RÚDJAI KIEMELVE" />;
}
export function AbraGyf7() {
  return (
    <RacsosRajz
      modell={M_GYF7_EREDETI}
      {...alap}
      cimke="P = 8 kN A 3–5 RÚD KÖZEPÉN (NEM CSOMÓPONTON!)"
      extra={(kx, ky) => (
        <g>
          <line x1={kx(4.5)} y1={ky(0) - 58} x2={kx(4.5)} y2={ky(0) - 4} stroke="var(--color-jel-ero)" strokeWidth="3" strokeLinecap="round" markerEnd="url(#th-teher)" />
          <text x={kx(4.5) + 7} y={ky(0) - 62} fontSize="13" fontWeight="650" style={{ fill: "var(--color-jel-ero)", paintOrder: "stroke", stroke: "white", strokeWidth: 3.5 }}>
            P = 8 kN
          </text>
        </g>
      )}
    />
  );
}
