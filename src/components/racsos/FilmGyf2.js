"use client";

import FeladatFilm from "@/components/anim/FeladatFilm";
import { arany } from "@/components/anim/Idovonal";
import { FeliratA, VonalA } from "@/components/anim/FilmElemek";
import { EroA, Fokusz, Kar, Pipa, FilmHegyek, SZ } from "@/components/tartok/FilmGyf1";
import RacsosRajz from "./RacsosRajz";
import { M_GYF2 } from "./gyfModellek";
import { racsosMegold } from "@/lib/racsos";

/*
 * GYF‑2 · Hármas átmetszés (tankönyv 6.6) — film.
 * a = 2 m, b = 1,5 m, F = 12 kN a 4. csomóponton; A = 3, B = 9 kN.
 * S₂,₃ = −8 (nyomott), S₂,₈ = 5 (húzott), S₇,₈ = 4 kN (húzott).
 */

const E = racsosMegold(M_GYF2);
const T = { feladat: 0, reak: 3, vag: 6.5, elk: 10, m8: 14, fy: 18.5, m2: 22.5, ell: 26.5, ered: 30 };

const FEJEZETEK = [
  { t0: T.feladat, cim: "A feladat", szoveg: "Párhuzamos övű tartó, F = 12 kN a 4. csomóponton. Keressük az S₂,₃, S₂,₈ és S₇,₈ rúderőt — anélkül, hogy a csomópontokon végigmennénk.", kepletek: ["a = 2\\ \\text{m},\\ b = 1{,}5\\ \\text{m},\\ F = 12\\ \\text{kN}"] },
  { t0: T.reak, cim: "Reakciók", szoveg: "Az egész szerkezet mint merev test: nyomaték az A csuklóra → B, függőleges vetület → A_y; vízszintes teher nincs, A_x = 0.", kepletek: ["\\Mp{A} -6\\cdot 12 + 8\\,B = 0 \\Rightarrow B = 9;\\quad \\Fy A_y - 12 + 9 = 0 \\Rightarrow A_y = 3\\ \\text{kN}"] },
  { t0: T.vag, cim: "Az átmetszés: három rúd elvágva", szoveg: "A görbe vonal a 2–3, 2–8 és 7–8 rudat vágja át: a tartó két részre esik. A bal részre kevesebb külső erő hat (csak A), azt vizsgáljuk.", kepletek: [] },
  { t0: T.elk, cim: "A bal rész elkülönítése", szoveg: "A rész egy három rúddal megtámasztott merev test. Az átvágott rudak erejét húzottnak vesszük fel: a részből kifelé mutató nyilak a 2. és 7. csomóponton.", kepletek: ["(\\underline{A}, \\underline{S}_{2,3}, \\underline{S}_{2,8}, \\underline{S}_{7,8}) \\ekv \\underline{O}"] },
  { t0: T.m8, cim: "Nyomaték a 8. főpontra → S₂,₃", szoveg: "S₂,₈ és S₇,₈ hatásvonala átmegy a 8. ponton, csak S₂,₃ marad. A karja 1,5 m (a pont fölött, jobbra mutat → óramutató szerint), A_y karja 4 m.", kepletek: ["\\Mp{8} -4\\cdot 3 - 1{,}5\\,S_{2,3} = 0 \\Rightarrow S_{2,3} = -8\\ \\text{kN (nyomott)}"] },
  { t0: T.fy, cim: "Függőleges vetület → S₂,₈", szoveg: "A két övrúd vízszintes: a rájuk merőleges vetületben csak a rácsrúd szerepel (sin = 0,6).", kepletek: ["\\Fy 3 - 0{,}6\\,S_{2,8} = 0 \\Rightarrow S_{2,8} = 5\\ \\text{kN (húzott)}"] },
  { t0: T.m2, cim: "Nyomaték a 2. főpontra → S₇,₈", szoveg: "S₂,₃ és S₂,₈ átmegy a 2. ponton. A_y karja 2 m, S₇,₈ karja 1,5 m (a pont alatt, jobbra → óramutatóval ellentétes).", kepletek: ["\\Mp{2} -2\\cdot 3 + 1{,}5\\,S_{7,8} = 0 \\Rightarrow S_{7,8} = 4\\ \\text{kN (húzott)}"] },
  { t0: T.ell, cim: "Ellenőrzés: vízszintes vetület", szoveg: "Egy nem használt egyenlet, csupa ismert taggal.", kepletek: ["\\Fx -8 + 0{,}8\\cdot 5 + 4 = 0\\ \\checkmark"] },
  { t0: T.ered, cim: "Eredmény", szoveg: "A három rúderő egymástól függetlenül, egy-egy egyenletből jött ki. A tartó többi rúdja ugyanígy, további átmetszésekkel vagy a csomóponti módszerrel számolható.", kepletek: ["S_{2,3} = -8,\\quad S_{2,8} = 5,\\quad S_{7,8} = 4\\ \\text{kN}"] },
];

const cs = (id) => M_GYF2.csomopontok.find((c) => c.id === id);

function Rajz(t) {
  const reakU = arany(t, T.reak + 0.3, T.reak + 1.2);
  const vagU = arany(t, T.vag + 0.2, T.vag + 1.6);
  const elkU = arany(t, T.elk + 0.2, T.elk + 1);
  const eroU = arany(t, T.elk + 0.8, T.elk + 2);
  const fazis = t < T.m8 ? "elk" : t < T.fy ? "m8" : t < T.m2 ? "fy" : t < T.ell ? "m2" : t < T.ered ? "ell" : "ered";
  const ismert = fazis === "fy" ? ["2,3"] : fazis === "m2" ? ["2,3", "2,8"] : fazis === "ell" || fazis === "ered" ? ["2,3", "2,8", "7,8"] : [];
  const vege = fazis === "ered";
  return (
    <RacsosRajz
      modell={M_GYF2}
      eredmeny={E}
      szinez={vege}
      kiemeltRudak={vagU > 0.5 && !vege ? ["2,3", "2,8", "7,8"] : []}
      reakciok={reakU > 0.3}
      rudFeliratok={vege}
      meretek={t < T.vag}
      className="abra w-full select-none"
      extra={(kx, ky) => {
        const n2 = cs("2");
        const n7 = cs("7");
        const n8 = cs("8");
        const x2 = kx(n2.x);
        const y2 = ky(n2.y);
        const x7 = kx(n7.x);
        const y7 = ky(n7.y);
        const xVag = kx(3.05);
        const S = { "2,3": -8, "2,8": 5, "7,8": 4 };
        const cimke = (id, alap) => (ismert.includes(id) ? `${alap} = ${S[id] < 0 ? "−" : ""}${Math.abs(S[id])} kN` : alap);
        return (
          <g>
            <FilmHegyek />
            {/* a vágóvonal */}
            {vagU > 0 && !vege && <VonalA x1={xVag - 12} y1={ky(1.5) - 30} x2={xVag - 12 + 24 * vagU} y2={ky(1.5) - 30 + (ky(0) + 30 - (ky(1.5) - 30)) * vagU} u={1} szin="#0f172a" vastag={2} szaggatott />}
            {/* a jobb rész elhalványítása */}
            {elkU > 0 && !vege && <rect x={xVag} y={0} width={600 - xVag} height={360} fill="white" opacity={0.78 * elkU} />}
            {/* az átvágott rudak erői a bal részen */}
            {eroU > 0 && !vege && (
              <g>
                <EroA x={x2 + 54 * eroU} y={y2} hossz={50} szog={0} u={eroU} szin={SZ.kek} hegy="fg-kek" cimke={cimke("2,3", "S₂,₃")} dx={-6} dy={-10} horgony="start" cimkeHegy />
                <EroA x={x2 + 0.8 * 50 * eroU} y={y2 + 0.6 * 50 * eroU} hossz={50} szog={-36.87} u={eroU} szin={SZ.kek} hegy="fg-kek" cimke={cimke("2,8", "S₂,₈")} dx={6} dy={14} horgony="start" cimkeHegy />
                <EroA x={x7 + 54 * eroU} y={y7} hossz={50} szog={0} u={eroU} szin={SZ.kek} hegy="fg-kek" cimke={cimke("7,8", "S₇,₈")} dx={-6} dy={18} horgony="start" cimkeHegy />
              </g>
            )}
            {fazis === "m8" && (
              <g>
                <Fokusz x={kx(n8.x)} y={ky(n8.y)} t={t} cimke="8 = főpont" dx={10} dy={22} />
                <Kar x1={kx(0)} y1={ky(0) + 40} x2={kx(4)} y2={ky(0) + 40} u={arany(t, T.m8 + 0.6, T.m8 + 1.6)} cimke="4 m" dy={-5} />
                <Kar x1={kx(4) + 26} y1={ky(1.5)} x2={kx(4) + 26} y2={ky(0)} u={arany(t, T.m8 + 1.2, T.m8 + 2.2)} cimke="1,5 m" dx={24} dy={4} />
                <Pipa x={300} y={30} opacitas={arany(t, T.m8 + 2.4, T.m8 + 3)} szin={SZ.bordo}>
                  −4·3 − 1,5·S₂,₃ = 0 → S₂,₃ = −8 kN (nyomott)
                </Pipa>
              </g>
            )}
            {fazis === "fy" && (
              <g>
                <VonalA x1={kx(2) - 50} y1={ky(1.5) - 40} x2={kx(2) - 50} y2={ky(0) + 40} u={arany(t, T.fy + 0.3, T.fy + 1)} szin="#94a3b8" vastag={1} />
                <FeliratA x={kx(2) - 50} y={ky(0) + 56} szin={SZ.szurke} meret={11} vastag={false} opacitas={arany(t, T.fy + 0.6, T.fy + 1.2)}>
                  függőleges vetület: az övek kiesnek
                </FeliratA>
                <Pipa x={300} y={30} opacitas={arany(t, T.fy + 1.6, T.fy + 2.2)}>
                  3 − 0,6·S₂,₈ = 0 → S₂,₈ = 5 kN (húzott)
                </Pipa>
              </g>
            )}
            {fazis === "m2" && (
              <g>
                <Fokusz x={x2} y={y2} t={t} cimke="2 = főpont" dx={-70} dy={-14} />
                <Kar x1={kx(0)} y1={ky(1.5) - 34} x2={kx(2)} y2={ky(1.5) - 34} u={arany(t, T.m2 + 0.6, T.m2 + 1.6)} cimke="2 m" dy={-5} />
                <Pipa x={300} y={30} opacitas={arany(t, T.m2 + 2, T.m2 + 2.6)}>
                  −2·3 + 1,5·S₇,₈ = 0 → S₇,₈ = 4 kN (húzott)
                </Pipa>
              </g>
            )}
            {fazis === "ell" && (
              <Pipa x={300} y={30} opacitas={arany(t, T.ell + 0.6, T.ell + 1.4)}>
                ΣFx: −8 + 0,8·5 + 4 = 0 ✓
              </Pipa>
            )}
            {vege && (
              <Pipa x={300} y={30} opacitas={arany(t, T.ered + 0.3, T.ered + 1)}>
                a teljes rúderőkép — piros húzott, kék nyomott, szürke vakrúd
              </Pipa>
            )}
          </g>
        );
      }}
    />
  );
}

export default function FilmGyf2() {
  return <FeladatFilm cim="GYF‑2 · Hármas átmetszés — vágás, elkülönítés, három főpont" hossz={33} fejezetek={FEJEZETEK} rajz={Rajz} megjegyzes="A kék nyilak az átvágott rudak húzottnak felvett erői; a nyomatéki pontok (főpontok) lüktetnek. A végén a teljes megoldás színezése látszik." />;
}
