"use client";

import FeladatFilm from "@/components/anim/FeladatFilm";
import { arany } from "@/components/anim/Idovonal";
import { FeliratA } from "@/components/anim/FilmElemek";
import { Pipa } from "@/components/tartok/FilmGyf1";
import RacsosRajz from "./RacsosRajz";
import { M_GYF1 } from "./gyfModellek";
import { racsosMegold } from "@/lib/racsos";

/*
 * GYF‑1 · Csomóponti módszer (tankönyv 6.1/6.4) — film.
 * a = 1,5 m, h = 2 m, F = 10 kN 60°-ban lefelé az 5. csomóponton.
 * A csomópontok a megoldás sorrendjében „kigyulladnak”, a rudak felveszik a színüket.
 */

const E = racsosMegold(M_GYF1);
const LEPESEK = E.csomopontiSorrend; // 1, 2, 3, 4, 5, 6

const T = { feladat: 0, reak: 3.5, cs: [7.5, 11.5, 15.5, 19.5, 23.5, 27.5], ell: 31 };

const FEJEZETEK = [
  {
    t0: T.feladat,
    cim: "A feladat: Warren-tartó, ferde erő az 5. csomóponton",
    szoveg: "r = 11 rúd, k = 3, c = 7 csomópont: r + k = 2c = 14, a tartó határozott. Minden rácsrúd 2,5 m hosszú (cos = 0,6, sin = 0,8). Az F erő komponensei: 5,000 kN jobbra, 8,660 kN lefelé.",
    kepletek: ["a = 1{,}5\\ \\text{m},\\ h = 2\\ \\text{m},\\ F = 10\\ \\text{kN},\\ \\alpha = 60^\\circ"],
  },
  {
    t0: T.reak,
    cim: "0. lépés: reakciók az egész szerkezetből",
    szoveg: "A rácsozat egyetlen merev test. Nyomaték az A csuklóra → B; vízszintes vetület → A_x (negatív: balra mutat); függőleges vetület → A_y.",
    kepletek: ["\\Mp{A} -6\\cdot 8{,}660 + 9\\,B = 0 \\Rightarrow B = 5{,}774", "\\Fx A_x + 5 = 0 \\Rightarrow A_x = -5{,}000;\\quad \\Fy A_y - 8{,}660 + 5{,}774 = 0 \\Rightarrow A_y = 2{,}887"],
  },
  ...LEPESEK.map((l, i) => ({
    t0: T.cs[i],
    cim: `${i + 1}. csomópont${l.ismeretlenek.length === 2 ? ` — két ismeretlen: S${l.ismeretlenek[0]}, S${l.ismeretlenek[1]}` : ` — egy ismeretlen: S${l.ismeretlenek[0]}`}`,
    szoveg:
      i === 0
        ? "Az 1. csomóponton az A reakció és két rúderő hat. Az S₁,₃ vízszintes, ezért a függőleges vetületben csak S₁,₂ marad; a vízszintesbe már beírjuk S₁,₂ értékét."
        : i === 5
          ? "A 6. csomópontban már csak egy ismeretlen maradt: a függőleges vetületből S₆,₇, a vízszintes egyenlet ellenőrzés."
          : "A már ismert rúderőket a saját előjelükkel írjuk be (a rúd a csomópontot mindig a rúd másik vége felé húzza). Az első egyenlet a vízszintes rúdra merőleges vetület.",
    kepletek: l.egyenletek.map((q) => q.tex),
  })),
  {
    t0: T.ell,
    cim: "Ellenőrzés a 7. csomóponton és a rúderőtáblázat",
    szoveg: "A 7. csomópont két egyenletét nem használtuk (a teljes szerkezetből három egyenletet már elhasználtunk): mindkettő nullát ad. Piros = húzott, kék = nyomott; a vonalvastagság a rúderővel arányos.",
    kepletek: ["\\Fx -4{,}330 - 0{,}6\\cdot(-7{,}217) = 0\\ \\checkmark,\\qquad \\Fy 5{,}774 + 0{,}8\\cdot(-7{,}217) = 0\\ \\checkmark"],
  },
];

function Rajz(t) {
  const reakU = arany(t, T.reak + 0.3, T.reak + 1.2);
  // hány csomópont kész?
  let kesz = 0;
  for (let i = 0; i < T.cs.length; i++) if (t >= T.cs[i] + 1.6) kesz = i + 1;
  let aktivIdx = -1;
  for (let i = 0; i < T.cs.length; i++) if (t >= T.cs[i] && t < T.cs[i] + 1.6) aktivIdx = i;
  if (t >= T.cs[T.cs.length - 1] + 1.6) kesz = LEPESEK.length;
  const ismert = new Set();
  for (let i = 0; i < kesz; i++) for (const id of Object.keys(LEPESEK[i].eredmenyek)) ismert.add(id);
  const keszCs = LEPESEK.slice(0, kesz).map((l) => l.csomopont);
  const aktiv = aktivIdx >= 0 ? [LEPESEK[aktivIdx].csomopont] : t >= T.ell ? ["7"] : [];
  const vege = t >= T.ell;
  return (
    <RacsosRajz
      modell={M_GYF1}
      eredmeny={E}
      ismertRudak={t >= T.cs[0] ? ismert : []}
      szinez={t >= T.cs[0]}
      aktivCsomopontok={aktiv}
      keszCsomopontok={keszCs}
      reakciok={reakU > 0.3}
      rudFeliratok={t >= T.cs[0]}
      meretek={t < T.reak}
      className="abra w-full select-none"
      extra={(kx, ky) => (
        <g>
          {t < T.reak && (
            <FeliratA x={300} y={30} szin="#64748b" meret={12} vastag={false} opacitas={arany(t, 0.3, 1)}>
              r + k = 11 + 3 = 14 = 2c ✓ határozott
            </FeliratA>
          )}
          {t >= T.reak && t < T.cs[0] && (
            <Pipa x={300} y={30} opacitas={arany(t, T.reak + 1.4, T.reak + 2)}>
              B = 5,774 · A_x = −5,000 (balra) · A_y = 2,887 kN
            </Pipa>
          )}
          {aktivIdx >= 0 && (
            <FeliratA x={300} y={30} szin="#e2590a" meret={12.5} opacitas={arany(t, T.cs[aktivIdx], T.cs[aktivIdx] + 0.5)}>
              {`${LEPESEK[aktivIdx].csomopont}. csomópont: ${LEPESEK[aktivIdx].ismeretlenek.map((id) => `S${id}`).join(", ")} → ${Object.entries(LEPESEK[aktivIdx].eredmenyek).map(([id, S]) => `${S.toFixed(2).replace(".", ",")}`).join(", ")} kN`}
            </FeliratA>
          )}
          {vege && (
            <Pipa x={300} y={30} opacitas={arany(t, T.ell + 0.3, T.ell + 1)}>
              7. csomópont: ΣFx = 0 ✓, ΣFy = 0 ✓ — minden rúderő ismert
            </Pipa>
          )}
        </g>
      )}
    />
  );
}

export default function FilmGyf1() {
  return (
    <FeladatFilm
      cim="GYF‑1 · Csomóponti módszer — a hullám az 1. csomóponttól a 7-esig"
      hossz={35}
      fejezetek={FEJEZETEK}
      rajz={Rajz}
      megjegyzes="A szaggatott rudak ereje még ismeretlen; a narancs gyűrű a soron következő csomópont, a zöld pötty a már feldolgozott. Piros = húzott, kék = nyomott, a vonalvastagság ∝ |S|."
    />
  );
}
