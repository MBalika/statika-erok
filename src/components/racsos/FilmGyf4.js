"use client";

import FeladatFilm from "@/components/anim/FeladatFilm";
import { arany } from "@/components/anim/Idovonal";
import { FeliratA, VonalA } from "@/components/anim/FilmElemek";
import { Pipa } from "@/components/tartok/FilmGyf1";
import RacsosRajz from "./RacsosRajz";
import { M_GYF4 } from "./gyfModellek";
import { racsosMegold } from "@/lib/racsos";

/*
 * GYF‑4 · K-rácsozású tartó (H08/1) — film: vakrudak a három alapesetből, majd a
 * csomóponti módszer a bal szélső részen, végül a négyes átmetszés ellenőrzése.
 * b = 2 m, a = 1,5 m, F₁ = F₂ = 10 kN; A = 7,5, B = 12,5 kN.
 */

const E = racsosMegold(M_GYF4);
const LEPESEK = E.csomopontiSorrend; // 1, 5, 6, 10, 11, 2, 7, 12, 14, 4, 3, 8, 9

const T = { feladat: 0, reak: 3, cs: [6.5, 9.5, 12.5, 15.5, 18.5, 22.5, 26, 29.5], tobbi: 33.5, atm: 37, ered: 41 };

const FEJEZETEK = [
  { t0: T.feladat, cim: "A feladat: K-rácsozás", szoveg: "Négy 2 m-es mező, 3 m magas tartó; a 11–14. csomópontok az oszlopok felezőpontjában. F₁ = F₂ = 10 kN a 3. és 4. csomóponton. r = 25, k = 3, c = 14: 28 = 28, határozott.", kepletek: ["b = 2\\ \\text{m},\\ a = 1{,}5\\ \\text{m},\\ F_1 = F_2 = 10\\ \\text{kN}"] },
  { t0: T.reak, cim: "Reakciók", szoveg: "Nyomaték az A csuklóra → B, függőleges vetület → A_y, A_x = 0.", kepletek: ["\\Mp{A} -4\\cdot 10 - 6\\cdot 10 + 8\\,B = 0 \\Rightarrow B = 12{,}5;\\quad A_y = 7{,}5\\ \\text{kN}"] },
  { t0: T.cs[0], cim: "1. csomópont: terheletlen, két rúd → a eset", szoveg: "Az 1–2 vízszintes és az 1–11 függőleges rúd nem esik egy egyenesbe: a vízszintes vetületből S₁,₂ = 0, a függőlegesből S₁,₁₁ = 0. Mindkettő vakrúd.", kepletek: LEPESEK[0].egyenletek.map((q) => q.tex) },
  { t0: T.cs[1], cim: "5. csomópont: ugyanaz tükrözve", szoveg: "S₄,₅ = 0 és S₅,₁₄ = 0 — a eset.", kepletek: LEPESEK[1].egyenletek.map((q) => q.tex) },
  { t0: T.cs[2], cim: "6. csomópont (A): a reakció az oszlop egyenesében → c eset", szoveg: "Két rúd és a függőleges A reakció (A_x = 0): a vízszintes vetületből S₆,₇ = 0; a függőlegesből az oszlop alsó fele S₆,₁₁ = −7,5 kN (nyomott).", kepletek: LEPESEK[2].egyenletek.map((q) => q.tex) },
  { t0: T.cs[3], cim: "10. csomópont (B): ugyanígy", szoveg: "S₉,₁₀ = 0 (vakrúd), S₁₀,₁₄ = −12,5 kN.", kepletek: LEPESEK[3].egyenletek.map((q) => q.tex) },
  { t0: T.cs[4], cim: "11. csomópont: a K két szára", szoveg: "Ismert S₆,₁₁ = −7,5 (7,5 kN-nal felfelé tolja a csomópontot) és S₁,₁₁ = 0. A két ferde szár: a 7–11 rúdra merőleges vetületből S₂,₁₁, aztán a vízszintesből S₇,₁₁ — a két szár ereje ellentett.", kepletek: LEPESEK[4].egyenletek.map((q) => q.tex) },
  { t0: T.cs[5], cim: "2. csomópont → S₂,₃ és S₂,₁₂", szoveg: "S₁,₂ = 0 és S₂,₁₁ = −6,25 már ismert; a vízszintes vetületből a felső öv, a függőlegesből az oszlop felső fele.", kepletek: LEPESEK[5].egyenletek.map((q) => q.tex) },
  { t0: T.cs[6], cim: "7. csomópont → S₇,₈ és S₇,₁₂", szoveg: "Tükörképe a 2. csomópontnak: az alsó öv húzott, az oszlop alsó fele nyomott.", kepletek: LEPESEK[6].egyenletek.map((q) => q.tex) },
  { t0: T.cs[7], cim: "12. csomópont → a rombusz két rúdja", szoveg: "A két oszlopfél ereje ismert (3,75 és −3,75, mindkettő felfelé tol). A 8–12 rúdra merőleges vetületből S₃,₁₂, majd a vízszintesből S₈,₁₂.", kepletek: LEPESEK[7].egyenletek.map((q) => q.tex) },
  { t0: T.tobbi, cim: "A jobb oldal ugyanígy: 14 → 4 → 3 → 8 → 9", szoveg: "A hullám a jobb támasztól is elindulhat. A 9. csomópont második egyenlete és a 13. csomópont két egyenlete ellenőrzés: mind nullát ad.", kepletek: ["\\text{13:}\\ \\Fy -3{,}75 + 6{,}25 - 0{,}6\\cdot 2{,}083 - 0{,}6\\cdot 2{,}083 = 0\\ \\checkmark"] },
  { t0: T.atm, cim: "Ellenőrzés négyes átmetszéssel", szoveg: "Ferde átmetszés a 2–12–7 oszlopon és a 2–3, 7–8 öveken: a két oszlopfél ereje közös hatásvonalú, ezért a 7. és a 2. pontra írt nyomatéki egyenletben az övek egyenként kijönnek.", kepletek: ["\\Mp{7} -2\\cdot 7{,}5 - 3\\,S_{2,3} = 0 \\Rightarrow S_{2,3} = -5\\ \\checkmark;\\qquad \\Mp{2} -2\\cdot 7{,}5 + 3\\,S_{7,8} = 0 \\Rightarrow S_{7,8} = 5\\ \\checkmark"] },
  { t0: T.ered, cim: "Rúderőtáblázat", szoveg: "Hat vakrúd (szürke), a K-szárak ellentett előjelűek, a felső öv nyomott, az alsó húzott. A kért nyolc rúd: S₂,₃ = −5; S₂,₁₁ = −6,25; S₂,₁₂ = 3,75; S₃,₁₂ = −6,25; S₇,₈ = 5; S₇,₁₁ = 6,25; S₇,₁₂ = −3,75; S₈,₁₂ = 6,25 kN.", kepletek: [] },
];

function Rajz(t) {
  const reakU = arany(t, T.reak + 0.3, T.reak + 1.2);
  let kesz = 0;
  for (let i = 0; i < T.cs.length; i++) if (t >= T.cs[i] + 1.4) kesz = i + 1;
  let aktivIdx = -1;
  for (let i = 0; i < T.cs.length; i++) if (t >= T.cs[i] && t < T.cs[i] + 1.4) aktivIdx = i;
  const mind = t >= T.tobbi + 1.2;
  const ismert = new Set();
  const hatar = mind ? LEPESEK.length : kesz;
  for (let i = 0; i < hatar; i++) for (const id of Object.keys(LEPESEK[i].eredmenyek)) ismert.add(id);
  const keszCs = LEPESEK.slice(0, hatar).map((l) => l.csomopont);
  const aktiv = aktivIdx >= 0 ? [LEPESEK[aktivIdx].csomopont] : t >= T.tobbi && !mind ? ["14", "4", "3", "8", "9"] : [];
  const atm = t >= T.atm && t < T.ered;
  const atmU = arany(t, T.atm + 0.2, T.atm + 1.2);
  return (
    <RacsosRajz
      modell={M_GYF4}
      eredmeny={E}
      ismertRudak={t >= T.cs[0] ? ismert : []}
      szinez={t >= T.cs[0]}
      aktivCsomopontok={aktiv}
      keszCsomopontok={keszCs}
      reakciok={reakU > 0.3}
      rudFeliratok={t >= T.cs[0]}
      meretek={t < T.reak}
      kiemeltRudak={atm ? ["2,3", "7,8", "2,12", "7,12"] : []}
      magassag={400}
      className="abra w-full select-none"
      extra={(kx, ky) => (
        <g>
          {t < T.reak && (
            <FeliratA x={300} y={386} szin="#64748b" meret={12} vastag={false} opacitas={arany(t, 0.3, 1)}>
              r + k = 25 + 3 = 28 = 2c ✓ határozott
            </FeliratA>
          )}
          {t >= T.reak && t < T.cs[0] && (
            <Pipa x={300} y={386} opacitas={arany(t, T.reak + 1.4, T.reak + 2)}>
              B = 12,5 kN · A_y = 7,5 kN · A_x = 0
            </Pipa>
          )}
          {aktivIdx >= 0 && (
            <FeliratA x={300} y={386} szin="#e2590a" meret={12.5} opacitas={arany(t, T.cs[aktivIdx], T.cs[aktivIdx] + 0.5)}>
              {`${LEPESEK[aktivIdx].csomopont}. csomópont → ${Object.entries(LEPESEK[aktivIdx].eredmenyek).map(([id, S]) => `S${id} = ${S.toFixed(2).replace(".", ",")}`).join(", ")} kN`}
            </FeliratA>
          )}
          {aktivIdx >= 0 && aktivIdx < 4 && (
            <FeliratA x={300} y={370} szin="#94a3b8" meret={11.5} vastag={false} opacitas={arany(t, T.cs[aktivIdx] + 0.4, T.cs[aktivIdx] + 1)}>
              {aktivIdx < 2 ? "a eset: terheletlen csomópont, két rúd nem egy egyenesben → mindkettő vakrúd" : "c eset: a reakció az egyik rúd egyenesében → a másik rúd vakrúd"}
            </FeliratA>
          )}
          {atm && (
            <g>
              <VonalA x1={kx(2.9)} y1={ky(3) - 30} x2={kx(2.9) - 60 * atmU} y2={ky(3) - 30 + (ky(0) + 30 - (ky(3) - 30)) * atmU} u={1} szin="#0f172a" vastag={2} szaggatott />
              <Pipa x={300} y={386} opacitas={arany(t, T.atm + 1.4, T.atm + 2)}>
                ΣM₇ → S₂,₃ = −5 ✓ · ΣM₂ → S₇,₈ = 5 ✓ (a két oszlopfél közös hatásvonalú)
              </Pipa>
            </g>
          )}
          {t >= T.ered && (
            <Pipa x={300} y={386} opacitas={arany(t, T.ered + 0.3, T.ered + 1)}>
              6 vakrúd, 12 nyomott, 7 húzott rúd — kész a rúderőtáblázat
            </Pipa>
          )}
        </g>
      )}
    />
  );
}

export default function FilmGyf4() {
  return <FeladatFilm cim="GYF‑4 · K-rácsozás — vakrudak, csomóponti hullám, négyes átmetszés" hossz={44} fejezetek={FEJEZETEK} rajz={Rajz} megjegyzes="Szürke rúd = vakrúd (kis kör a közepén). A K szárai ellentett előjelűek; a rombusz két rúdja is. A sárga kiemelés a négyes átmetszés négy rúdja." />;
}
