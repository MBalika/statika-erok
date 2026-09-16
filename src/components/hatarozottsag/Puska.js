import { M, MB } from "@/components/ui/Keplet";

/** A 8. modul (statikai határozottság) puska-lapja: a Doboz komponenst a puska-oldal adja. */
export default function Puska({ Doboz }) {
  return (
    <>
      <Doboz cim="A feladat és a tartó határozottsága">
        <p>
          <strong>Feladat</strong> (adott teher): van megoldás és egyértelmű → <em>határozott</em>; nincs (ellentmondás) → <em>túlhatározott</em>; van, de nem egyértelmű → <em>határozatlan</em>. <strong>Tartó</strong> (bármilyen teher): határozott / határozatlan = tartó; túlhatározott / határozatlan és
          túlhatározott = nem tartó (van teher, amit nem bír).
        </p>
      </Doboz>
      <Doboz cim="Számlálás síkban">
        <MB>{"e = 3\\cdot\\text{testek}\\ (+2\\ \\text{terhelt csuklónként}),\\qquad i = \\textstyle\\sum\\text{külső fok} + \\sum\\text{belső fok}"}</MB>
        <p>
          görgő 1, rúd 1, csukló 2, befogás 3; belső csukló <M>{"2(n-1)"}</M> (n test), belső rúd 1. Térben: 6 egyenlet / test; rácsos tartó: <M>{"e = 2c"}</M>, <M>{"i = r + k"}</M> (térben <M>{"3c"}</M>).
        </p>
      </Doboz>
      <Doboz cim="Elsődleges következtetés">
        <p>
          <M>{"e = i"}</M>: <strong>lehet</strong> határozott (szükséges, nem elégséges). <M>{"e > i"}</M>: legalább <M>{"e - i"}</M> szabad mozgás — biztosan nem tartó. <M>{"e < i"}</M>: legalább <M>{"i - e"}</M> fölös kényszer — biztosan nem határozott. <M>{"i - e"}</M> mindig csak a (fölös − szabad)
          különbség!
        </p>
      </Doboz>
      <Doboz cim="Kritikus elrendezések (e = i, mégis mozog)">
        <ul className="list-disc space-y-0.5 pl-4">
          <li>három párhuzamos görgő / rúd → a merőleges eltolódás szabad;</li>
          <li>három egy ponton átmenő hatásvonal → a pont körüli elfordulás szabad;</li>
          <li>görgő, amelynek hatásvonala átmegy a csuklón;</li>
          <li>egy egyenesbe eső három csukló (háromcsuklós tartó, Gerber rossz csuklókkal);</li>
          <li>két testet összekötő rudak párhuzamosak a külső csuklók egyenesével;</li>
          <li>rácsos: mező átló nélkül + fölös átló máshol; két görgő.</li>
        </ul>
      </Doboz>
      <Doboz cim="Így döntsd el (e = i után)">
        <ol className="list-decimal space-y-0.5 pl-4">
          <li>Egyismeretlenes menetrend: minden egyenletben egy új ismeretlen, nemzérus együtthatóval → határozott.</li>
          <li>Vagy: egy teherre egyértelmű megoldás → határozott.</li>
          <li>Lefejtés: csukló + görgő (2 + 1) megtámasztású befüggesztett rész levehető, ha a görgő nem megy át a csuklón; két test, csuklókkal 2-2-2 → háromcsuklós, ha a csuklók nem egy egyenesen.</li>
          <li>Rácsos: háromszögekből építhető-e (új csukló két nem egy egyenesbe eső rúddal), és jól támasztott-e a merev test.</li>
        </ol>
      </Doboz>
      <Doboz cim="Határozatlan tartó és a törzstartó">
        <p>
          <M>{"i - e"}</M> fölös kényszer elvétele úgy, hogy a maradék határozott legyen: görgő elvétele, csukló <em>ferde</em> görgővé (vízszintes komponens maradjon!), befogás csuklóvá, belső csukló beiktatása (paraméter: a hajlítónyomaték, két ellentett nyomaték). A fölös reakció szabad paraméter,
          értékét az <strong>alakváltozás</strong> (merevség) dönti el → Szilárdságtan. Kinematikai teherre (hő, támaszsüllyedés) is ébred reakció.
        </p>
      </Doboz>
      <Doboz cim="Ökölszabályok (7.4.2)">
        <ul className="list-disc space-y-0.5 pl-4">
          <li>három vagy több párhuzamos külső reakcióból legfeljebb kettőt tarts meg;</li>
          <li>három vagy több közös metszéspontúból legfeljebb kettőt;</li>
          <li>ha ismeretlen nyomaték is hat a testre (befogás), a párhuzamos reakciókból legfeljebb egyet;</li>
          <li>ha egy kivételével minden ismeretlen párhuzamos, a kivételt ne vedd el.</li>
        </ul>
      </Doboz>
      <Doboz cim="Tipikus hibák" szeles>
        <ul className="list-disc space-y-0.5 pl-4">
          <li>3 = 3-ból „határozott”-at következtetni geometriai ellenőrzés nélkül.</li>
          <li>A belső csukló erőit kétszer számolni (2 test között 2 ismeretlen, nem 4).</li>
          <li>Rácsos tartón rudanként két ismeretlen / csomópontonként három egyenlet.</li>
          <li><M>{"A_x + B_x = 0"}</M>-ból <M>{"A_x = B_x = 0"}</M>-t olvasni: ez határozatlan feladat, nem nulla.</li>
          <li>e &gt; i-t „határozatlannak” nevezni: e &gt; i = kevés kényszer = mozog; i &gt; e = sok kényszer = határozatlan.</li>
          <li>Törzstartó vízszintes görgővel a csukló helyén → három párhuzamos görgő (kritikus).</li>
        </ul>
      </Doboz>
    </>
  );
}
