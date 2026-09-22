"use client";

import FeladatFilm from "@/components/anim/FeladatFilm";
import { arany, lukteto } from "@/components/anim/Idovonal";
import Diagram, { osszHossz, helyIvhosszon, SZINEK, ert } from "@/components/igenybevetel/Diagram";

/**
 * Közös film-motor a 9. modul kidolgozott feladataihoz: a reakciók megjelennek,
 * a szakaszhatárok felvillannak, majd egy K keresztmetszet végigvándorol a tartón,
 * és alatta épülnek az N, V, M ábrák; végül a töréspontok és a szélsőértékek
 * kiemelése. Az időzítést a T objektum adja (másodpercben):
 *   T.reak – a reakciók beúszása; T.szak – szakaszhatárok; T.epit0…T.epit1 – az ábrák épülése;
 *   T.tores – töréspontok; T.szelso – szélsőérték; a fejezetek t0-i ehhez igazodnak.
 */
export default function FilmIgenybevetel({ cim, eredmeny: e, fejezetek, T, hossz, megjegyzes, abrak = ["N", "V", "M"], amp = 40 }) {
  const teljes = osszHossz(e);

  function Rajz(t) {
    const reakU = arany(t, T.reak, T.reak + 0.9);
    const szakU = t < T.epit0 ? arany(t, T.szak, T.szak + 0.6) : 0.35 * (1 - arany(t, T.epit1, T.epit1 + 1));
    const epitU = arany(t, T.epit0, T.epit1, (u) => u);
    const hatar = t < T.epit0 ? 0 : epitU * teljes;
    const vandorol = t >= T.epit0 && t < T.epit1;
    const toresU = arany(t, T.tores, T.tores + 0.6) * (t < T.szelso ? 1 : 0.45);
    const szelsoU = arany(t, T.szelso, T.szelso + 0.6);
    const h = vandorol ? helyIvhosszon(e, hatar) : null;

    return (
      <Diagram
        eredmeny={e}
        abrak={abrak}
        amp={amp}
        hatar={hatar}
        metszet={vandorol ? hatar : undefined}
        reakcioOpacitas={reakU}
        szakaszJelek={szakU}
        kiemelTorespontok={toresU}
        kiemelSzelso={szelsoU}
        className="abra w-full h-auto select-none"
        gyerekek={({ g }) => (
          <g>
            {h && (
              <g>
                <rect x={g.szel - 232} y={6} width={224} height={22} rx="6" fill="white" stroke="#cbd5e1" />
                <text x={g.szel - 224} y={21} fontSize="11.5" fontWeight="650" style={{ fill: "#334155" }}>
                  x = {ert(h.x)} m ·{" "}
                  <tspan style={{ fill: SZINEK.N }}>N = {ert(h.ertek.N)}</tspan> ·{" "}
                  <tspan style={{ fill: SZINEK.V }}>V = {ert(h.ertek.V)}</tspan> ·{" "}
                  <tspan style={{ fill: SZINEK.M }}>M = {ert(h.ertek.M)}</tspan>
                </text>
              </g>
            )}
            {t >= T.szelso && (
              <text x={g.szel - 8} y={21} textAnchor="end" fontSize="11.5" fontWeight="650" style={{ fill: SZINEK.M }} opacity={0.6 + 0.4 * lukteto(t, 1.4)}>
                V = 0 ⇒ M szélső
              </text>
            )}
          </g>
        )}
      />
    );
  }

  return <FeladatFilm cim={cim} hossz={hossz} fejezetek={fejezetek} rajz={Rajz} megjegyzes={megjegyzes} />;
}
