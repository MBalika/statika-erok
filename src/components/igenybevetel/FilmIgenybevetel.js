"use client";

import FeladatFilm from "@/components/anim/FeladatFilm";
import { arany, lukteto } from "@/components/anim/Idovonal";
import Diagram, { osszHossz, helyIvhosszon, SZINEK, ert } from "@/components/igenybevetel/Diagram";

/**
 * Közös film-motor a 9. modul kidolgozott feladataihoz: a reakciók megjelennek,
 * a szakaszhatárok felvillannak, majd egy K keresztmetszet végigvándorol a tartón
 * (a rudak sorrendjében, az első rúd kezdőpontjától), és alatta épülnek az N, V, M ábrák;
 * végül a töréspontok és a szélsőértékek kiemelése. Az időzítést a T objektum adja (másodpercben):
 *   T.reak – a reakciók beúszása; T.szak – szakaszhatárok; T.epit0…T.epit1 – az ábrák épülése;
 *   T.tores – töréspontok; T.szelso – szélsőérték; a fejezetek t0-i ehhez igazodnak.
 * Segéd: epitIdo(T, e, s) – mikor ér a K az s ívhosszhoz (a szakaszonkénti fejezetek t0-jához).
 *
 * A rajz oldala (tankönyv 8.3.2): mindhárom ábra pozitív értékei a tartó pozitív (az M-hez választott,
 * vízszintes tartónál alsó) oldalára kerülnek — ezt a Diagram teszi, a + és − jelekkel együtt.
 */

/** Az az időpont, amikor az épülő ábra eléri az s ívhosszat (az első rúd kezdetétől mérve). */
export function epitIdo(T, e, s) {
  return T.epit0 + (T.epit1 - T.epit0) * (s / osszHossz(e));
}

export default function FilmIgenybevetel({ cim, eredmeny: e, fejezetek, T, hossz, megjegyzes, abrak = ["N", "V", "M"], amp = 40 }) {
  const teljes = osszHossz(e);
  const egyenes = e.igenybevetelek.every((ig) => Math.abs(ig.szogFok) < 1e-6);
  // van-e belső szélsőérték (V = 0 a rúd belsejében, M ≠ 0)? Csak akkor írjuk ki a „V = 0 ⇒ M szélső” jelet.
  const vanSzelso = e.igenybevetelek.some((ig) => ig.MszelsoHelyek.some((h) => h.x > 1e-6 && h.x < ig.hossz - 1e-6 && Math.abs(h.M) > 1e-6));
  const csomopontNev = (i) => e.modell.csomopontok[i]?.id ?? "";

  function Rajz(t) {
    const reakU = arany(t, T.reak, T.reak + 0.9);
    const szakU = t < T.epit0 ? arany(t, T.szak, T.szak + 0.6) : 0.35 * (1 - arany(t, T.epit1, T.epit1 + 1));
    const epitU = arany(t, T.epit0, T.epit1, (u) => u);
    const hatar = t < T.epit0 ? 0 : epitU * teljes;
    const vandorol = t >= T.epit0 && t < T.epit1;
    const toresU = arany(t, T.tores, T.tores + 0.6) * (t < T.szelso ? 1 : 0.45);
    const szelsoU = arany(t, T.szelso, T.szelso + 0.6);
    const h = vandorol ? helyIvhosszon(e, hatar) : null;

    // a K helyének kiírása: egyenes tartón a globális x (a bal végtől), tört tengelyűn a rúd neve és a rúd menti x
    let helySzoveg = "";
    if (h) {
      if (egyenes) helySzoveg = `x = ${ert(h.X - e.igenybevetelek[0].kezdo[0])} m`;
      else {
        const rud = e.modell.rudak[h.rudIndex];
        helySzoveg = `${csomopontNev(rud.ia)}–${csomopontNev(rud.ib)} rúd, x = ${ert(h.x)} m`;
      }
    }

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
        gyerekek={({ g, szerkMag, abraMag }) => {
          const mIndex = abrak.indexOf("M");
          return (
            <g>
              {/* a K aktuális értékei az első ábra-panel címsorában, a panelcím (bal, ≤ 200 px) után */}
              {h && (
                <text x={215} y={szerkMag + 15} fontSize="11.5" fontWeight="650" style={{ fill: "#334155", paintOrder: "stroke", stroke: "white", strokeWidth: 3.5 }}>
                  K: {helySzoveg}
                  {abrak.map((jel) => (
                    <tspan key={jel} style={{ fill: SZINEK[jel] }}>
                      {" · "}{jel} = {ert(h.ertek[jel])}
                    </tspan>
                  ))}
                </text>
              )}
              {vanSzelso && mIndex >= 0 && t >= T.szelso && (
                <text x={g.szel - 10} y={szerkMag + mIndex * abraMag + 15} textAnchor="end" fontSize="11.5" fontWeight="650" style={{ fill: SZINEK.M }} opacity={0.6 + 0.4 * lukteto(t, 1.4)}>
                  V = 0 ⇒ M szélsőérték
                </text>
              )}
            </g>
          );
        }}
      />
    );
  }

  return <FeladatFilm cim={cim} hossz={hossz} fejezetek={fejezetek} rajz={Rajz} megjegyzes={megjegyzes} />;
}
