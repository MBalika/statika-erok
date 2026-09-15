"use client";

import GyakorloDoboz from "@/components/GyakorloDoboz";
import GyakorloExtra from "./GyakorloExtra";
import { M, MB } from "@/components/ui/Keplet";
import { sz, zarojel } from "@/lib/szamok";

const egesz = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
const feles = (min, max) => egesz(min * 2, max * 2) / 2;
const valaszt = (tomb) => tomb[Math.floor(Math.random() * tomb.length)];

/* ---------- 1. Egyenletes teher ---------- */

function egyenletesFeladat() {
  const p = feles(2, 12);
  const L = feles(2, 8);
  const R = p * L;
  const k = L / 2;
  return {
    szoveg: (
      <p>
        Egy tartó <M>{`L = ${sz(L, 1)}\\ \\text{m}`}</M> hosszú szakaszán egyenletesen
        megoszló, <M>{`p = ${sz(p, 1)}\\ \\text{kN/m}`}</M> intenzitású teher működik.
        Mekkora az eredője, és hol működik a szakasz bal végétől mérve?
      </p>
    ),
    sugo: <p>Az eredő a teherábra területe (téglalap), a helye a téglalap közepe.</p>,
    mezok: [
      { id: "r", cimke: "R", egyseg: "kN", helyes: R, tizedes: 2 },
      { id: "k", cimke: "k (a bal végtől)", egyseg: "m", helyes: k, tizedes: 2 },
    ],
    megoldas: (
      <>
        <MB>{`(p) \\ekv \\underline{R}:\\qquad \\Fle p\\,L = ${sz(p, 1)}\\cdot ${sz(L, 1)} = R = ${sz(R, 2)}\\ \\text{kN}`}</MB>
        <MB>{`k = \\frac{L}{2} = ${sz(k, 2)}\\ \\text{m}\\quad(\\text{a téglalap súlypontja})`}</MB>
      </>
    ),
  };
}

/* ---------- 2. Háromszög teher ---------- */

function haromszogFeladat() {
  const p = feles(2, 12);
  const L = feles(2, 9);
  const balra = Math.random() < 0.5;
  const R = (p * L) / 2;
  const k = balra ? L / 3 : (2 * L) / 3;
  return {
    szoveg: (
      <p>
        Egy <M>{`L = ${sz(L, 1)}\\ \\text{m}`}</M> hosszú szakaszon a teher lineárisan
        változik: a <strong>{balra ? "bal" : "jobb"}</strong> végén{" "}
        <M>{`p = ${sz(p, 1)}\\ \\text{kN/m}`}</M>, a másik végén zérus. Mekkora az
        eredő, és hol működik a bal végtől mérve?
      </p>
    ),
    sugo: (
      <p>
        A háromszög területe <M>{"\\tfrac12 p L"}</M>, a súlypontja a magas oldaltól{" "}
        <M>{"L/3"}</M>-ra van. Vigyázz, melyik oldal a magas!
      </p>
    ),
    mezok: [
      { id: "r", cimke: "R", egyseg: "kN", helyes: R, tizedes: 2 },
      { id: "k", cimke: "k (a bal végtől)", egyseg: "m", helyes: k, tizedes: 3 },
    ],
    megoldas: (
      <>
        <MB>{`(p) \\ekv \\underline{R}:\\qquad \\Fle \\tfrac12\\,p\\,L = \\tfrac12\\cdot ${sz(p, 1)}\\cdot ${sz(L, 1)} = R = ${sz(R, 2)}\\ \\text{kN}`}</MB>
        <MB>{balra ? `k = \\frac{L}{3} = ${sz(k, 3)}\\ \\text{m}` : `k = L - \\frac{L}{3} = \\frac{2L}{3} = ${sz(k, 3)}\\ \\text{m}`}</MB>
        <p className="mt-2 text-[13px] text-petrol-600">
          A magas oldal {balra ? "balra" : "jobbra"} van, ezért az eredő a{" "}
          {balra ? "bal" : "jobb"} véghez esik közelebb.
        </p>
      </>
    ),
  };
}

/* ---------- 3. Trapéz teher ---------- */

function trapezFeladat() {
  const p1 = feles(1, 8);
  let p2 = feles(1, 10);
  while (p2 === p1) p2 = feles(1, 10);
  const L = feles(2, 8);
  const R = ((p1 + p2) / 2) * L;
  const k = (L * (p1 + 2 * p2)) / (3 * (p1 + p2));
  const pMin = Math.min(p1, p2);
  const pD = Math.abs(p2 - p1);
  const xH = p2 > p1 ? (2 * L) / 3 : L / 3;
  return {
    szoveg: (
      <p>
        Egy <M>{`L = ${sz(L, 1)}\\ \\text{m}`}</M> hosszú szakaszon a teher a bal végen{" "}
        <M>{`p_1 = ${sz(p1, 1)}\\ \\text{kN/m}`}</M>, a jobb végen{" "}
        <M>{`p_2 = ${sz(p2, 1)}\\ \\text{kN/m}`}</M>, közöttük lineárisan változik.
        Mekkora az eredő, és hol működik a bal végtől mérve?
      </p>
    ),
    sugo: (
      <p>
        Bontsd fel téglalapra (a kisebb intenzitással) és háromszögre (a különbséggel), vagy
        két háromszögre. A helyet a nyomatéki egyenletből kapod:{" "}
        <M>{"R\\,k = R_1 x_1 + R_2 x_2"}</M>.
      </p>
    ),
    mezok: [
      { id: "r", cimke: "R", egyseg: "kN", helyes: R, tizedes: 2 },
      { id: "k", cimke: "k (a bal végtől)", egyseg: "m", helyes: k, tizedes: 3 },
    ],
    megoldas: (
      <>
        <MB>{`R_1 = ${sz(pMin, 1)}\\cdot ${sz(L, 1)} = ${sz(pMin * L, 2)}\\ \\text{kN}\\quad (\\text{téglalap, } x_1 = ${sz(L / 2, 2)}\\ \\text{m})`}</MB>
        <MB>{`R_2 = \\tfrac12\\cdot ${sz(pD, 1)}\\cdot ${sz(L, 1)} = ${sz((pD * L) / 2, 2)}\\ \\text{kN}\\quad (\\text{háromszög, } x_2 = ${sz(xH, 3)}\\ \\text{m})`}</MB>
        <MB>{`(\\underline{R}_1, \\underline{R}_2) \\ekv \\underline{R}:\\qquad \\Fle R_1 + R_2 = R = ${sz(R, 2)}\\ \\text{kN}`}</MB>
        <MB>{`\\Mj{O} R_1 x_1 + R_2 x_2 = R\\,k\\ \\Rightarrow\\ k = \\frac{${sz(pMin * L, 2)}\\cdot ${sz(L / 2, 2)} + ${sz((pD * L) / 2, 2)}\\cdot ${sz(xH, 3)}}{${sz(R, 2)}} = ${sz(k, 3)}\\ \\text{m}`}</MB>
      </>
    ),
  };
}

/* ---------- 4. Szakaszos, előjeles teher ---------- */

function szakaszosFeladat() {
  let szakaszok;
  let R;
  do {
    const n = valaszt([2, 3, 3]);
    szakaszok = Array.from({ length: n }, (_, i) => ({
      L: feles(1, 4),
      p: feles(2, 10) * (i === 1 && Math.random() < 0.6 ? -1 : 1),
    }));
    R = szakaszok.reduce((s, e) => s + e.p * e.L, 0);
  } while (Math.abs(R) < 2);

  let futo = 0;
  const reszek = szakaszok.map((s) => {
    const r = { R: s.p * s.L, x: futo + s.L / 2, L: s.L, p: s.p, kezd: futo };
    futo += s.L;
    return r;
  });
  const Mo = reszek.reduce((s, r) => s + r.R * r.x, 0);
  const k = Mo / R;

  return {
    szoveg: (
      <>
        <p>
          Egy tartón egymás után több egyenletesen megoszló teherszakasz működik. A lefelé
          mutató teher pozitív, a felfelé mutató negatív. Határozd meg az eredőt és a
          helyét a tartó bal végétől!
        </p>
        <div className="finom-gorgeto mt-2 overflow-x-auto">
          <table className="szamok w-full max-w-sm text-[13px]">
            <thead className="text-[11px] text-petrol-500 uppercase">
              <tr>
                <th className="pb-1 text-left">szakasz</th>
                <th className="pb-1 text-right">hossz [m]</th>
                <th className="pb-1 text-right">p [kN/m]</th>
              </tr>
            </thead>
            <tbody>
              {szakaszok.map((s, i) => (
                <tr key={i} className="border-t border-petrol-200">
                  <td className="py-1">{i + 1}.</td>
                  <td className="py-1 text-right">{sz(s.L, 1)}</td>
                  <td className="py-1 text-right">{s.p > 0 ? sz(s.p, 1) : `−${sz(-s.p, 1)} (felfelé)`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    ),
    sugo: (
      <p>
        Minden szakasz eredője <M>{"p_i L_i"}</M> előjelesen, a szakasz közepén. Az eredő
        az előjeles összeg, a helye <M>{"k = \\sum R_i x_i / R"}</M>.
      </p>
    ),
    mezok: [
      { id: "r", cimke: "R (lefelé pozitív)", egyseg: "kN", helyes: R, tizedes: 2 },
      { id: "k", cimke: "k (a bal végtől)", egyseg: "m", helyes: k, tizedes: 3 },
    ],
    megoldas: (
      <>
        <MB>{`(${reszek.map((_, i) => `\\underline{R}_${i + 1}`).join(", ")}) \\ekv \\underline{R}`}</MB>
        {reszek.map((r, i) => (
          <MB key={i}>{`R_${i + 1} = ${zarojel(r.p, 1)}\\cdot ${sz(r.L, 1)} = ${sz(r.R, 2)}\\ \\text{kN},\\quad x_${i + 1} = ${sz(r.kezd, 1)} + \\tfrac{${sz(r.L, 1)}}{2} = ${sz(r.x, 2)}\\ \\text{m}`}</MB>
        ))}
        <MB>{`\\Fle ${reszek.map((r) => zarojel(r.R, 2)).join(" + ")} = R = ${sz(R, 2)}\\ \\text{kN}`}</MB>
        <MB>{`\\Mj{O} \\sum R_i x_i = R\\,k\\ \\Rightarrow\\ k = \\frac{${reszek.map((r) => `${zarojel(r.R, 2)}\\cdot ${sz(r.x, 2)}`).join(" + ")}}{${zarojel(R, 2)}} = ${sz(k, 3)}\\ \\text{m}`}</MB>
      </>
    ),
  };
}

/* ---------- 5. Megoszló teher + koncentrált erő ---------- */

function vegyesFeladat() {
  const p = feles(2, 10);
  const L = feles(3, 8);
  const F = egesz(5, 30);
  const a = feles(0.5, L - 0.5);
  const Rp = p * L;
  const R = Rp + F;
  const k = (Rp * (L / 2) + F * a) / R;
  return {
    szoveg: (
      <p>
        Egy <M>{`L = ${sz(L, 1)}\\ \\text{m}`}</M> hosszú tartón egyenletesen megoszló{" "}
        <M>{`p = ${sz(p, 1)}\\ \\text{kN/m}`}</M> teher működik, és ezen felül a bal végtől{" "}
        <M>{`a = ${sz(a, 1)}\\ \\text{m}`}</M>-re egy <M>{`F = ${F}\\ \\text{kN}`}</M>{" "}
        koncentrált erő is, szintén lefelé. Mekkora a teljes teher eredője, és hol működik?
      </p>
    ),
    sugo: (
      <p>
        Előbb a megoszló terhet váltsd át eredőre (a közepén), aztán a két koncentrált erőt
        vond össze úgy, mint a 2. modulban a párhuzamos erőket.
      </p>
    ),
    mezok: [
      { id: "r", cimke: "R", egyseg: "kN", helyes: R, tizedes: 2 },
      { id: "k", cimke: "k (a bal végtől)", egyseg: "m", helyes: k, tizedes: 3 },
    ],
    megoldas: (
      <>
        <MB>{`R_p = p\\,L = ${sz(p, 1)}\\cdot ${sz(L, 1)} = ${sz(Rp, 2)}\\ \\text{kN},\\quad x_p = \\tfrac{L}{2} = ${sz(L / 2, 2)}\\ \\text{m}`}</MB>
        <MB>{`(\\underline{R}_p, \\underline{F}) \\ekv \\underline{R}:\\qquad \\Fle R_p + F = ${sz(Rp, 2)} + ${F} = R = ${sz(R, 2)}\\ \\text{kN}`}</MB>
        <MB>{`\\Mj{O} R_p x_p + F a = R\\,k\\ \\Rightarrow\\ k = \\frac{${sz(Rp, 2)}\\cdot ${sz(L / 2, 2)} + ${F}\\cdot ${sz(a, 1)}}{${sz(R, 2)}} = ${sz(k, 3)}\\ \\text{m}`}</MB>
      </>
    ),
  };
}

/* ---------- a szekció ---------- */

export const GENERATOROK = [
  { cim: "Egyenletes teher eredője", fn: egyenletesFeladat },
  { cim: "Háromszög alakú teher", fn: haromszogFeladat },
  { cim: "Trapéz alakú teher", fn: trapezFeladat },
  { cim: "Szakaszos, előjeles teher", fn: szakaszosFeladat },
  { cim: "Megoszló teher és koncentrált erő együtt", fn: vegyesFeladat },
];

export default function GyakorloSzekcio() {
  return (
    <>
      <GyakorloDoboz cim="Egyenletes teher eredője" leiras="A legegyszerűbb eset — bemelegítésnek." generator={egyenletesFeladat} />
      <GyakorloDoboz cim="Háromszög alakú teher" leiras="Itt dől el, hogy megjegyezted-e: L/3 a magas oldaltól." generator={haromszogFeladat} />
      <GyakorloDoboz cim="Trapéz alakú teher" leiras="Felbontás és nyomatéki egyenlet — a GYF‑1 mintájára." generator={trapezFeladat} />
      <GyakorloDoboz cim="Szakaszos, előjeles teher" leiras="Több szakasz, néha felfelé ható is — a GYF‑2 mintájára." generator={szakaszosFeladat} />
      <GyakorloDoboz cim="Megoszló teher és koncentrált erő együtt" leiras="Átvezetés a tartók reakcióihoz: minden teher egyetlen eredőbe." generator={vegyesFeladat} />
      <div className="mt-10 mb-4 flex items-center gap-3">
        <span className="h-px flex-1 bg-petrol-200" />
        <span className="text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">További feladattípusok</span>
        <span className="h-px flex-1 bg-petrol-200" />
      </div>
      <GyakorloExtra />
    </>
  );
}
