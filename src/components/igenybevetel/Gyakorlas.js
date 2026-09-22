"use client";

import Kviz from "@/components/Kviz";
import Hibakereso from "@/components/Hibakereso";
import JatekAbrarajzolo from "./JatekAbrarajzolo";
import AlakKviz from "./AlakKviz";
import GyakorloSzekcio from "./GyakorloSzekcio";
import { KVIZ, HIBAK } from "./KvizAdatok";

/**
 * A 9. modul Gyakorlás-szakaszának teljes tartalma (az oldal csak <Gyakorlas />-t hív):
 * bevezető → ábrarajzoló játék → alakhelyesség-kvíz → számolós generátorok → fogalmi kvíz → hibakereső.
 */
function Cim({ children, elso = false }) {
  return <h3 className={`${elso ? "mb-2" : "mt-10 mb-2"} text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase`}>{children}</h3>;
}

export default function Gyakorlas() {
  return (
    <>
      <div className="proza text-[15px] leading-relaxed text-petrol-700">
        <p>
          A vizsgán az igénybevételi ábrák „egyben” érnek pontot: a helyes <strong>N</strong>, <strong>V</strong> és <strong>M</strong> ábra, alakhelyesen, a jellemző értékekkel. Ezért itt a sorrend: előbb{" "}
          <em>rajzolj</em> (a program adja a töréspontokat, te az értékeket és az alakot), aztán <em>ismerd fel</em> a hibás ábrákat, majd <em>számolj</em> — végül a fogalmak és a tipikus hibák.
        </p>
      </div>

      <Cim>Rajzold meg te — az ábrarajzoló játék</Cim>
      <JatekAbrarajzolo />

      <Cim>Alakhelyesség — melyik ábra a helyes?</Cim>
      <AlakKviz />

      <Cim>Számolós gyakorlás — a feladatlapok (H09–H12) típusai</Cim>
      <GyakorloSzekcio />

      <Cim>Az ötlet — fogalmi kvíz</Cim>
      <Kviz cim="Érted, vagy csak rajzolod?" leiras="Tíz véletlen kérdés az előjelekről, a differenciális összefüggésekről, a töréspont-szabályokról és a tankönyv 8.4 trükkjeiről." kerdesek={KVIZ} db={10} />

      <Cim>Hibakereső — találd meg a hibát</Cim>
      <Hibakereso feladatok={HIBAK} />
    </>
  );
}
