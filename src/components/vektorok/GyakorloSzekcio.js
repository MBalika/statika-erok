"use client";

import GyakorloDoboz from "@/components/GyakorloDoboz";
import GyakorloExtra from "./GyakorloExtra";
import { M, MB } from "@/components/ui/Keplet";
import {
  derekszogu,
  fokRad,
  osszegLanc,
  polaris,
  sz,
  szEl,
  zarojel,
} from "@/lib/szamok";

/* ---------- segédfüggvények ---------- */

const egesz = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
const valaszt = (tomb) => tomb[Math.floor(Math.random() * tomb.length)];
const tizedes = (min, max) => Math.round((min + Math.random() * (max - min)) * 10) / 10;

/* ---------- 1. Komponensekre bontás ---------- */

function komponensFeladat() {
  const F = tizedes(2, 14);
  const alfa = valaszt([
    egesz(10, 80),
    egesz(100, 170),
    egesz(190, 260),
    egesz(280, 350),
  ]);
  const { x: Fx, y: Fy } = derekszogu(F, alfa);

  return {
    szoveg: (
      <p>
        Egy erő nagysága <M>{`F = ${sz(F, 1)}\\ \\text{kN}`}</M>, iránya az{" "}
        <M>{"x"}</M> tengelytől mérve <M>{`\\alpha = ${alfa}^\\circ`}</M>.
        Számítsd ki a két komponensét!
      </p>
    ),
    sugo: (
      <p>
        A szöget az <M>{"x"}</M> tengelytől mértük, tehát a vízszintes
        komponenshez koszinusz, a függőlegeshez szinusz tartozik. Figyelj az
        előjelekre: a <M>{`${alfa}^\\circ`}</M> a{" "}
        {alfa < 90 ? "I." : alfa < 180 ? "II." : alfa < 270 ? "III." : "IV."}{" "}
        síknegyedbe esik.
      </p>
    ),
    mezok: [
      { id: "fx", cimke: "Fx", egyseg: "kN", helyes: Fx, tizedes: 3 },
      { id: "fy", cimke: "Fy", egyseg: "kN", helyes: Fy, tizedes: 3 },
    ],
    megoldas: (
      <>
        <MB>{`F_x = F\\cos\\alpha = ${sz(F, 1)}\\cdot\\cos ${alfa}^\\circ = ${sz(Fx, 3)}\\ \\text{kN}`}</MB>
        <MB>{`F_y = F\\sin\\alpha = ${sz(F, 1)}\\cdot\\sin ${alfa}^\\circ = ${sz(Fy, 3)}\\ \\text{kN}`}</MB>
      </>
    ),
  };
}

/* ---------- 2. Síkbeli eredő ---------- */

function eredoFeladat() {
  const n = valaszt([3, 3, 4]);
  const erok = Array.from({ length: n }, () => ({
    F: egesz(2, 12),
    a: egesz(0, 35) * 10,
  }));
  const k = erok.map((e) => derekszogu(e.F, e.a));
  const Rx = k.reduce((s, v) => s + v.x, 0);
  const Ry = k.reduce((s, v) => s + v.y, 0);
  const R = polaris(Rx, Ry);
  const alfaR = R.szog > 180 ? R.szog - 360 : R.szog;

  return {
    szoveg: (
      <>
        <p>
          Egy közös metszéspontú erőrendszer {n} erőből áll. Határozd meg az
          eredő komponenseit, nagyságát és irányszögét!
        </p>
        <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
          {erok.map((e, i) => (
            <li key={i} className="szamok text-[13.5px] text-petrol-700">
              <M>{`F_${i + 1} = ${e.F}\\ \\text{kN},\\ \\alpha_${i + 1} = ${e.a}^\\circ`}</M>
            </li>
          ))}
        </ul>
      </>
    ),
    sugo: (
      <p>
        Bontsd mindegyik erőt komponensekre, majd külön add össze az{" "}
        <M>{"x"}</M> és külön az <M>{"y"}</M> irányú komponenseket. A nagyságot
        Pitagorasz-tétellel, az irányt <M>{"\\operatorname{arctg}(R_y/R_x)"}</M>{" "}
        alapján kapod — de az arctg-nél mindig ellenőrizd a síknegyedet!
      </p>
    ),
    mezok: [
      { id: "rx", cimke: "Rx", egyseg: "kN", helyes: Rx, tizedes: 3 },
      { id: "ry", cimke: "Ry", egyseg: "kN", helyes: Ry, tizedes: 3 },
      { id: "r", cimke: "R (nagyság)", egyseg: "kN", helyes: R.nagysag, tizedes: 3 },
      { id: "ar", cimke: "αR", egyseg: "°", helyes: alfaR, tizedes: 2, tures: 0.6 },
    ],
    megoldas: (
      <>
        <p className="mb-1 text-[13px] text-petrol-600">Egyenértékűségi kijelentés (helyettesítés: az ismertek balra, az ismeretlen eredő jobbra):</p>
        <MB>{`(${erok.map((_, i) => `\\underline{F}_${i + 1}`).join(", ")}) \\ekv \\underline{R}`}</MB>
        <div className="finom-gorgeto mb-3 overflow-x-auto">
          <table className="szamok w-full text-[13px]">
            <thead className="text-[11px] text-petrol-500 uppercase">
              <tr>
                <th className="pb-1 text-left">erő</th>
                <th className="pb-1 text-right">Fx [kN]</th>
                <th className="pb-1 text-right">Fy [kN]</th>
              </tr>
            </thead>
            <tbody>
              {k.map((v, i) => (
                <tr key={i} className="border-t border-petrol-200">
                  <td className="py-1">F{i + 1}</td>
                  <td className="py-1 text-right">{szEl(v.x, 3)}</td>
                  <td className="py-1 text-right">{szEl(v.y, 3)}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-petrol-300 font-semibold">
                <td className="py-1">R</td>
                <td className="py-1 text-right">{sz(Rx, 3)}</td>
                <td className="py-1 text-right">{sz(Ry, 3)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <MB>{`\\Fx ${osszegLanc(k.map((v) => v.x), 3)} = R_x \\;\\Rightarrow\\; R_x = ${sz(Rx, 3)}\\ \\text{kN}`}</MB>
        <MB>{`\\Fy ${osszegLanc(k.map((v) => v.y), 3)} = R_y \\;\\Rightarrow\\; R_y = ${sz(Ry, 3)}\\ \\text{kN}`}</MB>
        <MB>{`R = \\sqrt{${zarojel(Rx, 3)}^2 + ${zarojel(Ry, 3)}^2} = ${sz(
          R.nagysag,
          3,
        )}\\ \\text{kN}`}</MB>
        <MB>{`\\alpha_R = ${sz(alfaR, 2)}^\\circ`}</MB>
      </>
    ),
  };
}

/* ---------- 3. Vetület ferde tengelyre ---------- */

function vetuletFeladat() {
  const F = egesz(3, 15);
  const alfa = egesz(0, 35) * 10;
  const t = valaszt([20, 35, 50, 65, 110, 125, 140, 155]);
  const bezart = alfa - t;
  const Ft = F * Math.cos(fokRad(bezart));

  return {
    szoveg: (
      <p>
        Egy <M>{`F = ${F}\\ \\text{kN}`}</M> nagyságú erő iránya{" "}
        <M>{`\\alpha = ${alfa}^\\circ`}</M>. Mekkora az erő vetülete egy olyan{" "}
        <M>{"t"}</M> tengelyre, amelynek iránya <M>{`${t}^\\circ`}</M>?
      </p>
    ),
    sugo: (
      <p>
        A vetület <M>{"F_t = F\\cos\\vartheta"}</M>, ahol{" "}
        <M>{"\\vartheta"}</M> az erő és a tengely által bezárt szög. Itt{" "}
        <M>{`\\vartheta = ${alfa}^\\circ - ${t}^\\circ`}</M>. Ha a bezárt szög
        tompaszög, a vetület negatív lesz.
      </p>
    ),
    mezok: [
      { id: "ft", cimke: "Ft", egyseg: "kN", helyes: Ft, tizedes: 3 },
    ],
    oszlopok: 1,
    megoldas: (
      <>
        <MB>{`\\vartheta = ${alfa}^\\circ - ${t}^\\circ = ${bezart}^\\circ`}</MB>
        <MB>{`F_t = F\\cos\\vartheta = ${F}\\cdot\\cos(${bezart}^\\circ) = ${sz(Ft, 3)}\\ \\text{kN}`}</MB>
        <p className="mt-2 text-[13px] text-petrol-600">
          {Ft < 0
            ? "A negatív előjel azt jelenti, hogy a vetület a t tengely irányával ellentétes."
            : "A pozitív érték azt jelenti, hogy a vetület a t tengely irányába mutat."}
        </p>
      </>
    ),
  };
}

/* ---------- 4. Egyensúly: a hiányzó erő ---------- */

function egyensulyFeladat() {
  const F1 = egesz(4, 14);
  const a1 = egesz(2, 16) * 10;
  const F2 = egesz(4, 14);
  const a2 = a1 + egesz(8, 20) * 10;
  const k1 = derekszogu(F1, a1);
  const k2 = derekszogu(F2, a2);
  const F3x = -(k1.x + k2.x);
  const F3y = -(k1.y + k2.y);
  const F3 = polaris(F3x, F3y);
  const alfa3 = F3.szog > 180 ? F3.szog - 360 : F3.szog;

  return {
    szoveg: (
      <p>
        Egy pontra három erő hat, és a test egyensúlyban van, vagyis a három
        vektor összege zérusvektor. Adott{" "}
        <M>{`F_1 = ${F1}\\ \\text{kN}`}</M> (<M>{`\\alpha_1 = ${a1}^\\circ`}</M>
        ) és <M>{`F_2 = ${F2}\\ \\text{kN}`}</M> (
        <M>{`\\alpha_2 = ${a2 % 360}^\\circ`}</M>). Határozd meg a harmadik erő
        komponenseit és nagyságát!
      </p>
    ),
    sugo: (
      <p>
        Egyensúlyi kijelentés: <M>{"(\\underline{F}_1, \\underline{F}_2, \\underline{F}_3) \\ekv \\underline{O}"}</M>, ebből{" "}
        <M>{"\\Fx \\dots = 0"}</M> és <M>{"\\Fy \\dots = 0"}</M>, az ismeretlen a bal oldalon. A harmadik erő
        komponensei az első kettő összegének ellentettjei.
      </p>
    ),
    mezok: [
      { id: "x", cimke: "F3x", egyseg: "kN", helyes: F3x, tizedes: 3 },
      { id: "y", cimke: "F3y", egyseg: "kN", helyes: F3y, tizedes: 3 },
      { id: "n", cimke: "F3 (nagyság)", egyseg: "kN", helyes: F3.nagysag, tizedes: 3 },
      { id: "a", cimke: "α3", egyseg: "°", helyes: alfa3, tizedes: 2, tures: 0.6 },
    ],
    megoldas: (
      <>
        <p className="mb-1 text-[13px] text-petrol-600">Egyensúlyi kijelentés — az ismeretlen erő is a bal oldalon:</p>
        <MB>{"(\\underline{F}_1, \\underline{F}_2, \\underline{F}_3) \\ekv \\underline{O}"}</MB>
        <MB>{`F_{1x} = ${sz(k1.x, 3)},\\quad F_{1y} = ${sz(k1.y, 3)}`}</MB>
        <MB>{`F_{2x} = ${sz(k2.x, 3)},\\quad F_{2y} = ${sz(k2.y, 3)}`}</MB>
        <MB>{`\\Fx ${osszegLanc([k1.x, k2.x], 3)} + F_{3x} = 0 \\;\\Rightarrow\\; F_{3x} = ${sz(F3x, 3)}\\ \\text{kN}`}</MB>
        <MB>{`\\Fy ${osszegLanc([k1.y, k2.y], 3)} + F_{3y} = 0 \\;\\Rightarrow\\; F_{3y} = ${sz(F3y, 3)}\\ \\text{kN}`}</MB>
        <MB>{`F_3 = \\sqrt{F_{3x}^2+F_{3y}^2} = ${sz(F3.nagysag, 3)}\\ \\text{kN},\\quad \\alpha_3 = ${sz(alfa3, 2)}^\\circ`}</MB>
      </>
    ),
  };
}

/* ---------- 5. Térbeli vektorok összege ---------- */

function terbeliFeladat() {
  const v = Array.from({ length: 3 }, () => ({
    x: egesz(-9, 12),
    y: egesz(-9, 12),
    z: egesz(-12, 9),
  }));
  const R = v.reduce(
    (a, e) => ({ x: a.x + e.x, y: a.y + e.y, z: a.z + e.z }),
    { x: 0, y: 0, z: 0 },
  );
  const hossz = Math.hypot(R.x, R.y, R.z);

  return {
    szoveg: (
      <>
        <p>Add össze az alábbi három térbeli vektort, és add meg az eredő hosszát is!</p>
        <div className="szamok mt-3">
          <MB>
            {v
              .map(
                (e, i) =>
                  `\\underline{F}_${i + 1} = \\begin{bmatrix} ${e.x} \\\\ ${e.y} \\\\ ${e.z} \\end{bmatrix}`,
              )
              .join(",\\quad ") + "\\ \\text{kN}"}
          </MB>
        </div>
      </>
    ),
    sugo: (
      <p>
        A térbeli összeadás komponensenként történik, ugyanúgy, mint síkban —
        csak eggyel több sorral. A hossz:{" "}
        <M>{"|\\underline{R}| = \\sqrt{R_x^2+R_y^2+R_z^2}"}</M>.
      </p>
    ),
    mezok: [
      { id: "x", cimke: "Rx", egyseg: "kN", helyes: R.x, tizedes: 0, tures: 0.001 },
      { id: "y", cimke: "Ry", egyseg: "kN", helyes: R.y, tizedes: 0, tures: 0.001 },
      { id: "z", cimke: "Rz", egyseg: "kN", helyes: R.z, tizedes: 0, tures: 0.001 },
      { id: "h", cimke: "|R|", egyseg: "kN", helyes: hossz, tizedes: 3 },
    ],
    megoldas: (
      <>
        <MB>{"(\\underline{F}_1, \\underline{F}_2, \\underline{F}_3) \\ekv \\underline{R}"}</MB>
        <MB>{`\\Fx ${osszegLanc(v.map((e) => e.x))} = R_x,\\quad \\Fy ${osszegLanc(v.map((e) => e.y))} = R_y,\\quad \\Fz ${osszegLanc(v.map((e) => e.z))} = R_z`}</MB>
        <MB>{`\\underline{R} = \\begin{bmatrix} ${osszegLanc(
          v.map((e) => e.x),
        )} \\\\ ${osszegLanc(v.map((e) => e.y))} \\\\ ${osszegLanc(
          v.map((e) => e.z),
        )} \\end{bmatrix} = \\begin{bmatrix} ${R.x} \\\\ ${R.y} \\\\ ${R.z} \\end{bmatrix}\\ \\text{kN}`}</MB>
        <MB>{`|\\underline{R}| = \\sqrt{${zarojel(R.x, 0)}^2 + ${zarojel(
          R.y,
          0,
        )}^2 + ${zarojel(R.z, 0)}^2} = ${sz(hossz, 3)}\\ \\text{kN}`}</MB>
      </>
    ),
  };
}

/* ---------- a szekció ---------- */

export const GENERATOROK = [
  { cim: "Komponensekre bontás", fn: komponensFeladat },
  { cim: "Síkbeli erőrendszer eredője", fn: eredoFeladat },
  { cim: "Vetület ferde tengelyre", fn: vetuletFeladat },
  { cim: "Egyensúly: a hiányzó erő", fn: egyensulyFeladat },
  { cim: "Térbeli vektorok összege", fn: terbeliFeladat },
];

export default function GyakorloSzekcio() {
  return (
    <>
      <GyakorloDoboz
        cim="Komponensekre bontás"
        leiras="A legalapvetőbb művelet. Addig gyakorold, amíg az előjelek is automatikusan jönnek."
        generator={komponensFeladat}
      />
      <GyakorloDoboz
        cim="Síkbeli erőrendszer eredője"
        leiras="Több erő összegzése komponensenként, majd a nagyság és az irány meghatározása."
        generator={eredoFeladat}
      />
      <GyakorloDoboz
        cim="Vetület ferde tengelyre"
        leiras="A bezárt szög koszinusza — és a helyes előjel."
        generator={vetuletFeladat}
        oszlopok={1}
      />
      <GyakorloDoboz
        cim="Egyensúly: a hiányzó erő"
        leiras="Ha az eredő zérus, a harmadik erő visszafejthető. Ez a típus a zárthelyiken is gyakran előkerül."
        generator={egyensulyFeladat}
      />
      <GyakorloDoboz
        cim="Térbeli vektorok összege"
        leiras="Ugyanaz a gondolat három komponenssel."
        generator={terbeliFeladat}
      />
      <div className="mt-10 mb-4 flex items-center gap-3">
        <span className="h-px flex-1 bg-petrol-200" />
        <span className="text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">További feladattípusok</span>
        <span className="h-px flex-1 bg-petrol-200" />
      </div>
      <GyakorloExtra />
    </>
  );
}
