"use client";

import GyakorloDoboz from "@/components/GyakorloDoboz";
import GyakorloExtra from "./GyakorloExtra";
import { M, MB } from "@/components/ui/Keplet";
import { derekszogu, polaris, sz, szEl, zarojel } from "@/lib/szamok";

const egesz = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
const valaszt = (tomb) => tomb[Math.floor(Math.random() * tomb.length)];
const nemNulla = (min, max) => {
  let v = 0;
  while (v === 0) v = egesz(min, max);
  return v;
};

/* ---------- 1. Nyomaték egy pontra ---------- */

function nyomatekFeladat() {
  const x = nemNulla(-5, 8);
  const y = nemNulla(-4, 6);
  const F = egesz(3, 14);
  const alfa = valaszt([0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 240, 270, 300, 330]);
  const k = derekszogu(F, alfa);
  const Mo = x * k.y - y * k.x;
  const kar = Math.abs(Mo) / F;

  return {
    szoveg: (
      <p>
        Egy <M>{`F = ${F}\\ \\text{kN}`}</M> nagyságú erő támadáspontja a{" "}
        <M>{`P(${x};\\ ${y})`}</M> pont (méterben), iránya az <M>{"x"}</M>{" "}
        tengelytől mérve <M>{`\\alpha = ${alfa}^\\circ`}</M>. Mekkora az erő
        nyomatéka az origóra, és mekkora az erő karja?
      </p>
    ),
    sugo: (
      <p>
        Bontsd az erőt komponensekre, majd használd az{" "}
        <M>{"M^{(O)} = x F_y - y F_x"}</M> képletet. Az erő karja ebből{" "}
        <M>{"k = |M| / F"}</M>. A pozitív nyomaték az óramutatóval ellentétes
        forgatást jelent.
      </p>
    ),
    mezok: [
      { id: "m", cimke: "M⁽ᴼ⁾", egyseg: "kNm", helyes: Mo, tizedes: 2 },
      { id: "k", cimke: "az erő karja, k", egyseg: "m", helyes: kar, tizedes: 3 },
    ],
    megoldas: (
      <>
        <MB>{`F_x = ${F}\\cos ${alfa}^\\circ = ${sz(k.x, 3)}\\ \\text{kN},\\quad F_y = ${F}\\sin ${alfa}^\\circ = ${sz(k.y, 3)}\\ \\text{kN}`}</MB>
        <MB>{`M^{(O)} = x F_y - y F_x = ${zarojel(x, 0)}\\cdot ${zarojel(k.y, 3)} - ${zarojel(y, 0)}\\cdot ${zarojel(k.x, 3)} = ${sz(Mo, 2)}\\ \\text{kNm}`}</MB>
        <MB>{`k = \\frac{|M|}{F} = \\frac{${sz(Math.abs(Mo), 2)}}{${F}} = ${sz(kar, 3)}\\ \\text{m}`}</MB>
        <p className="mt-2 text-[13px] text-petrol-600">
          {Mo > 0
            ? "A pozitív érték azt jelenti, hogy az erő az óramutatóval ellentétesen forgat az origó körül."
            : "A negatív érték azt jelenti, hogy az erő az óramutató járásával egyezően forgat."}
        </p>
      </>
    ),
  };
}

/* ---------- 2. Erőpár nyomatéka ---------- */

function eroparFeladat() {
  const F = egesz(4, 18);
  const d = egesz(1, 7) * 0.5 + 0.5;
  const balra = Math.random() < 0.5;
  const Mo = balra ? F * d : -F * d;

  return {
    szoveg: (
      <p>
        Egy testre két egyenlő nagyságú, <M>{`F = ${F}\\ \\text{kN}`}</M>,
        ellentétes irányú, párhuzamos erő hat. A két hatásvonal távolsága{" "}
        <M>{`d = ${sz(d, 1)}\\ \\text{m}`}</M>, és az erőpár{" "}
        {balra ? "az óramutatóval ellentétesen" : "az óramutató járásával egyezően"}{" "}
        forgat. Mekkora az erőpár nyomatéka?
      </p>
    ),
    sugo: (
      <p>
        Az erőpár nyomatéka <M>{"M = F\\,d"}</M>, ahol <M>{"d"}</M> a két
        hatásvonal <em>merőleges</em> távolsága. Az előjelet a forgásirány adja:
        az óramutatóval ellentétes forgatás a pozitív.
      </p>
    ),
    oszlopok: 1,
    mezok: [{ id: "m", cimke: "M", egyseg: "kNm", helyes: Mo, tizedes: 2 }],
    megoldas: (
      <>
        <MB>{`M = ${balra ? "+" : "-"}F\\,d = ${balra ? "" : "-"}${F}\\cdot ${sz(d, 1)} = ${sz(Mo, 2)}\\ \\text{kNm}`}</MB>
        <p className="mt-2 text-[13px] text-petrol-600">
          Az erőpár eredő ereje zérus, ezért a nyomatéka minden pontra
          ugyanennyi — nem kell megadni, melyik pontra számoltuk.
        </p>
      </>
    ),
  };
}

/* ---------- 3. Párhuzamos erőrendszer eredője ---------- */

function parhuzamosFeladat() {
  const n = valaszt([3, 3, 4]);
  const erok = Array.from({ length: n }, (_, i) => ({
    hely: egesz(1, 9),
    ero: valaszt([1, 1, 1, -1]) * egesz(3, 15), // lefelé pozitívnak vesszük
  }));
  // a lefelé mutató erőt negatív Fy-nal írjuk le
  const R = erok.reduce((s, e) => s - e.ero, 0); // Fy = -ero
  const Mo = erok.reduce((s, e) => s + e.hely * -e.ero, 0);
  const xR = Math.abs(R) > 1e-9 ? Mo / R : null;

  return {
    szoveg: (
      <>
        <p>
          Függőleges erők hatnak az <M>{"x"}</M> tengely mentén. Határozd meg az
          eredőt és a hatásvonalának helyét! (A lefelé mutató erő pozitív
          számmal szerepel a táblázatban.)
        </p>
        <div className="finom-gorgeto mt-2 overflow-x-auto">
          <table className="szamok w-full max-w-sm text-[13px]">
            <thead className="text-[11px] text-petrol-500 uppercase">
              <tr>
                <th className="pb-1 text-left">erő</th>
                <th className="pb-1 text-right">nagyság [kN]</th>
                <th className="pb-1 text-right">hely, x [m]</th>
              </tr>
            </thead>
            <tbody>
              {erok.map((e, i) => (
                <tr key={i} className="border-t border-petrol-200">
                  <td className="py-1">F{i + 1}</td>
                  <td className="py-1 text-right">
                    {e.ero > 0 ? `${e.ero} (lefelé)` : `${-e.ero} (felfelé)`}
                  </td>
                  <td className="py-1 text-right">{e.hely}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    ),
    sugo: (
      <p>
        Az eredő nagysága az előjeles összeg. A helyét abból kapod, hogy az
        eredő ugyanakkora nyomatékot ad az origóra, mint az egész erőrendszer:{" "}
        <M>{"x_R \\cdot R_y = \\sum x_i F_{iy}"}</M>.
      </p>
    ),
    mezok: [
      { id: "r", cimke: "Ry (felfelé a pozitív)", egyseg: "kN", helyes: R, tizedes: 1 },
      { id: "m", cimke: "M⁽ᴼ⁾", egyseg: "kNm", helyes: Mo, tizedes: 1 },
      { id: "x", cimke: "az eredő helye, xR", egyseg: "m", helyes: xR ?? 0, tizedes: 3 },
    ],
    megoldas: (
      <>
        <MB>{`(${erok.map((_, i) => `\\underline{F}_${i + 1}`).join(", ")}) \\ekv ${xR !== null ? "\\underline{R}" : "M"}`}</MB>
        <MB>{`\\Fy ${erok.map((e) => zarojel(-e.ero, 0)).join(" + ")} = R_y \\;\\Rightarrow\\; R_y = ${sz(R, 1)}\\ \\text{kN}`}</MB>
        <MB>{`\\Mp{O} ${erok.map((e) => `${e.hely}\\cdot ${zarojel(-e.ero, 0)}`).join(" + ")} = ${sz(Mo, 1)}\\ \\text{kNm}`}</MB>
        {xR !== null ? (
          <>
            <p>Az eredő erő, a helyét abból kapjuk, hogy ugyanezt a nyomatékot adja az origóra:</p>
            <MB>{`x_R R_y = M^{(O)} \\;\\Rightarrow\\; x_R = \\frac{${sz(Mo, 1)}}{${sz(R, 1)}} = ${sz(xR, 3)}\\ \\text{m}`}</MB>
          </>
        ) : (
          <p>Az eredő erő zérus, ezért az eredő maga a nyomaték: <M>{`M = ${sz(Mo, 1)}\\ \\text{kNm}`}</M>, minden pontra ugyanennyi.</p>
        )}
      </>
    ),
  };
}

/* ---------- 4. Redukálás az origóba ---------- */

function redukalasFeladat() {
  // tengelyirányú erők, hogy a számolás tiszta maradjon
  const erok = Array.from({ length: 3 }, () => {
    const vizszintes = Math.random() < 0.5;
    const nagysag = egesz(4, 20) * (Math.random() < 0.5 ? 1 : -1);
    return vizszintes
      ? { x: 0, y: nemNulla(-5, 7), Fx: nagysag, Fy: 0 }
      : { x: nemNulla(-4, 9), y: 0, Fx: 0, Fy: nagysag };
  });

  const Rx = erok.reduce((s, e) => s + e.Fx, 0);
  const Ry = erok.reduce((s, e) => s + e.Fy, 0);
  const Mo = erok.reduce((s, e) => s + e.x * e.Fy - e.y * e.Fx, 0);
  const R = polaris(Rx, Ry);
  const x0 = Math.abs(Ry) > 1e-9 ? Mo / Ry : null;

  return {
    szoveg: (
      <>
        <p>
          Redukáld az alábbi erőrendszert az origóra, majd add meg az eredő
          nagyságát és azt, hol metszi a hatásvonala az <M>{"x"}</M> tengelyt!
        </p>
        <div className="finom-gorgeto mt-2 overflow-x-auto">
          <table className="szamok w-full max-w-md text-[13px]">
            <thead className="text-[11px] text-petrol-500 uppercase">
              <tr>
                <th className="pb-1 text-left">erő</th>
                <th className="pb-1 text-right">irány</th>
                <th className="pb-1 text-right">nagyság [kN]</th>
                <th className="pb-1 text-right">hatásvonal</th>
              </tr>
            </thead>
            <tbody>
              {erok.map((e, i) => (
                <tr key={i} className="border-t border-petrol-200">
                  <td className="py-1">F{i + 1}</td>
                  <td className="py-1 text-right">
                    {e.Fx !== 0
                      ? e.Fx > 0
                        ? "→ (+x)"
                        : "← (−x)"
                      : e.Fy > 0
                        ? "↑ (+y)"
                        : "↓ (−y)"}
                  </td>
                  <td className="py-1 text-right">
                    {Math.abs(e.Fx !== 0 ? e.Fx : e.Fy)}
                  </td>
                  <td className="py-1 text-right">
                    {e.Fx !== 0 ? `y = ${e.y} m` : `x = ${e.x} m`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    ),
    sugo: (
      <p>
        A vízszintes erő nyomatéka <M>{"-y F_x"}</M>, a függőlegesé{" "}
        <M>{"x F_y"}</M>. Az eredő hatásvonala ott metszi az <M>{"x"}</M>{" "}
        tengelyt, ahol <M>{"x_0 R_y = M^{(O)}"}</M>.
      </p>
    ),
    mezok: [
      { id: "rx", cimke: "Rx", egyseg: "kN", helyes: Rx, tizedes: 1 },
      { id: "ry", cimke: "Ry", egyseg: "kN", helyes: Ry, tizedes: 1 },
      { id: "m", cimke: "M⁽ᴼ⁾", egyseg: "kNm", helyes: Mo, tizedes: 1 },
      { id: "r", cimke: "R (nagyság)", egyseg: "kN", helyes: R.nagysag, tizedes: 3 },
      ...(x0 !== null
        ? [{ id: "x0", cimke: "x₀", egyseg: "m", helyes: x0, tizedes: 3 }]
        : []),
    ],
    megoldas: (
      <>
        <MB>{`(\\underline{F}_1, \\underline{F}_2, \\underline{F}_3) \\ekv (\\underline{R}, M^{(O)})`}</MB>
        <MB>{`\\Fx ${erok.map((e) => zarojel(e.Fx, 0)).join(" + ")} = R_x \\;\\Rightarrow\\; R_x = ${sz(Rx, 1)}\\ \\text{kN}`}</MB>
        <MB>{`\\Fy ${erok.map((e) => zarojel(e.Fy, 0)).join(" + ")} = R_y \\;\\Rightarrow\\; R_y = ${sz(Ry, 1)}\\ \\text{kN}`}</MB>
        <MB>{`\\Mp{O} ${erok
          .map((e) =>
            e.Fx !== 0
              ? `\\left(-${sz(e.y, 0)}\\cdot ${zarojel(e.Fx, 0)}\\right)`
              : `\\left(${zarojel(e.x, 0)}\\cdot ${zarojel(e.Fy, 0)}\\right)`,
          )
          .join(" + ")} = M^{(O)} \\;\\Rightarrow\\; M^{(O)} = ${sz(Mo, 1)}\\ \\text{kNm}`}</MB>
        <MB>{`R = \\sqrt{${zarojel(Rx, 1)}^2 + ${zarojel(Ry, 1)}^2} = ${sz(R.nagysag, 3)}\\ \\text{kN}`}</MB>
        {x0 !== null && (
          <MB>{`x_0 = \\frac{M^{(O)}}{R_y} = \\frac{${sz(Mo, 1)}}{${sz(Ry, 1)}} = ${sz(x0, 3)}\\ \\text{m}`}</MB>
        )}
      </>
    ),
  };
}

/* ---------- 5. Térbeli nyomaték ---------- */

function terbeliFeladat() {
  const r = { x: nemNulla(-5, 6), y: nemNulla(-4, 6), z: nemNulla(-5, 6) };
  const F = {
    x: egesz(-8, 10) * 10,
    y: egesz(-8, 10) * 10,
    z: egesz(-8, 10) * 10,
  };
  const Mx = r.y * F.z - r.z * F.y;
  const My = r.z * F.x - r.x * F.z;
  const Mz = r.x * F.y - r.y * F.x;

  return {
    szoveg: (
      <>
        <p>
          Számítsd ki az <M>{"\\underline{r}"}</M> támadáspontú{" "}
          <M>{"\\underline{F}"}</M> erő nyomatékát az origón átmenő{" "}
          <M>{"x"}</M>, <M>{"y"}</M> és <M>{"z"}</M> tengelyekre!
        </p>
        <MB>
          {`\\underline{r} = \\begin{bmatrix} ${r.x} \\\\ ${r.y} \\\\ ${r.z} \\end{bmatrix}\\ \\text{m},\\qquad \\underline{F} = \\begin{bmatrix} ${F.x} \\\\ ${F.y} \\\\ ${F.z} \\end{bmatrix}\\ \\text{N}`}
        </MB>
      </>
    ),
    sugo: (
      <p>
        <M>{"\\underline{M} = \\underline{r} \\times \\underline{F}"}</M>, azaz{" "}
        <M>{"M_x = y F_z - z F_y"}</M>, <M>{"M_y = z F_x - x F_z"}</M>,{" "}
        <M>{"M_z = x F_y - y F_x"}</M>. Mindegyik sorból hiányzik az a
        komponens, amelyik párhuzamos az adott tengellyel.
      </p>
    ),
    oszlopok: 3,
    mezok: [
      { id: "mx", cimke: "Mx", egyseg: "Nm", helyes: Mx, tizedes: 0, tures: 0.5 },
      { id: "my", cimke: "My", egyseg: "Nm", helyes: My, tizedes: 0, tures: 0.5 },
      { id: "mz", cimke: "Mz", egyseg: "Nm", helyes: Mz, tizedes: 0, tures: 0.5 },
    ],
    megoldas: (
      <>
        <MB>{`M_x = y F_z - z F_y = ${zarojel(r.y, 0)}\\cdot ${zarojel(F.z, 0)} - ${zarojel(r.z, 0)}\\cdot ${zarojel(F.y, 0)} = ${Mx}\\ \\text{Nm}`}</MB>
        <MB>{`M_y = z F_x - x F_z = ${zarojel(r.z, 0)}\\cdot ${zarojel(F.x, 0)} - ${zarojel(r.x, 0)}\\cdot ${zarojel(F.z, 0)} = ${My}\\ \\text{Nm}`}</MB>
        <MB>{`M_z = x F_y - y F_x = ${zarojel(r.x, 0)}\\cdot ${zarojel(F.y, 0)} - ${zarojel(r.y, 0)}\\cdot ${zarojel(F.x, 0)} = ${Mz}\\ \\text{Nm}`}</MB>
        <MB>{`|\\underline{M}| = ${sz(Math.hypot(Mx, My, Mz), 1)}\\ \\text{Nm}`}</MB>
      </>
    ),
  };
}

/* ---------- a szekció ---------- */

export const GENERATOROK = [
  { cim: "Nyomaték egy pontra", fn: nyomatekFeladat },
  { cim: "Erőpár nyomatéka", fn: eroparFeladat },
  { cim: "Párhuzamos erőrendszer eredője és helye", fn: parhuzamosFeladat },
  { cim: "Redukálás az origóra", fn: redukalasFeladat },
  { cim: "Térbeli nyomaték (r × F)", fn: terbeliFeladat },
];

export default function GyakorloSzekcio() {
  return (
    <>
      <GyakorloDoboz
        cim="Nyomaték egy pontra"
        leiras="Egyetlen erő nyomatéka és az erő karja. Ez a modul alapművelete."
        generator={nyomatekFeladat}
      />
      <GyakorloDoboz
        cim="Erőpár nyomatéka"
        leiras="Rövid, de az előjelet könnyű elrontani."
        generator={eroparFeladat}
        oszlopok={1}
      />
      <GyakorloDoboz
        cim="Párhuzamos erőrendszer eredője és helye"
        leiras="A klasszikus feladattípus: nagyság előjeles összegzéssel, hely nyomatéki egyenletből."
        generator={parhuzamosFeladat}
        oszlopok={3}
      />
      <GyakorloDoboz
        cim="Redukálás az origóra"
        leiras="Szétszórt erőrendszer teljes végigszámolása az eredő hatásvonaláig."
        generator={redukalasFeladat}
      />
      <GyakorloDoboz
        cim="Térbeli nyomaték (r × F)"
        leiras="Három vektoriális szorzat, semmi trükk — csak figyelem az indexekre."
        generator={terbeliFeladat}
        oszlopok={3}
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
