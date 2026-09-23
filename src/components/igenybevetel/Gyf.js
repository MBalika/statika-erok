import { AbraKeret } from "@/components/ui/Elemek";
import { M, MB } from "@/components/ui/Keplet";
import { KidolgozottFeladat, Lepes } from "@/components/KidolgozottFeladat";
import { FeladatAbra, MegoldasAbra, gyf1Jelek, gyf3Jelek, gyf8Jelek } from "@/components/igenybevetel/FeladatAbrak";
import FilmGyf1 from "@/components/igenybevetel/FilmGyf1";
import FilmGyf2 from "@/components/igenybevetel/FilmGyf2";
import FilmGyf4 from "@/components/igenybevetel/FilmGyf4";
import FilmGyf6 from "@/components/igenybevetel/FilmGyf6";

/**
 * A 9. modul kidolgozott feladatai (GYF‑1…GYF‑8): a tankönyv 8.4–8.7 példái és a
 * H09–H12 feladatsorok számokkal. A recept mindegyiknél: reakciók (röviden, a
 * tankönyv írásmódjával) → szakaszok → szakaszonként N(x), V(x), M(x) →
 * töréspontok és szélsőértékek → ábrák (a Diagram egzakt rajza) → ellenőrzés.
 * Minden szám a Modellek.js modelljeiből, a számítómaggal ellenőrizve.
 */

const FilmCim = ({ children }) => (
  <h3 className="mt-4 mb-2 text-[13px] font-semibold text-petrol-500 uppercase tracking-wider">{children}</h3>
);

/** A megoldás ábrái; szelso: a V = 0 helyek és az M szélsőértékeinek kiemelése (gyűrű). */
const Abrak = ({ kulcs, cim, abrak, amp, szelso = false, gyerekek, teherCimkek }) => (
  <AbraKeret cim={cim}>
    <MegoldasAbra kulcs={kulcs} abrak={abrak} amp={amp} kiemelSzelso={szelso ? 1 : 0} gyerekek={gyerekek} teherCimkek={teherCimkek} />
  </AbraKeret>
);

export default function GyfBlokkok() {
  return (
    <>
      {/* ==================== GYF‑1 ==================== */}
      <KidolgozottFeladat
        jel="GYF‑1"
        ido="6 perc"
        forras="H09 szintemelő, 1. feladat"
        cim="Befogott konzol ferde erővel — kívülről számolva"
        feladat={
          <p>
            A bal végén befogott, <M>{"3a"}</M> hosszú konzolt az <M>{"x = a"}</M> helyen a vízszintessel <M>{"\\alpha"}</M> szöget bezáró, jobbra-lefelé mutató{" "}
            <M>{"F_1"}</M>, a szabad végén a függőleges <M>{"F_2"}</M> erő terheli. Rajzold meg az alakhelyes igénybevételi ábrákat a jellemző értékekkel!{" "}
            <M>{"a = 2\\ \\text{m},\\ F_1 = 10\\ \\text{kN},\\ \\alpha = 30^\\circ,\\ F_2 = 5\\ \\text{kN}"}</M>.
          </p>
        }
        abra={<AbraKeret cim="A feladat rajza (H09/1). Az F₁ komponensei: 10·cos 30° = 8,660 kN jobbra és 10·sin 30° = 5,000 kN lefelé."><FeladatAbra kulcs="gyf1" gyerekek={gyf1Jelek} /></AbraKeret>}
        tanulsag={
          <p>
            Konzolon a szabad vég felől haladva a reakciókra nincs is szükség: minden keresztmetszetben a K-tól jobbra eső erőket redukáljuk. A befogásnál kapott végértékek
            (<M>{"N = 8{,}66,\\ V = 10,\\ M = -40"}</M>) éppen a reakciók — ez a beépített ellenőrzés. A ferde erő <em>két</em> ábrában ad ugrást (N és V), az M-ben csak törést.
          </p>
        }
      >
        <Lepes cim="Reakciók — röviden, csak az ellenőrzéshez">
          <MB>{"\\Fx A_x + 8{,}660 = 0 \\Rightarrow A_x = -8{,}660\\ \\text{kN}\\ (\\leftarrow)"}</MB>
          <MB>{"\\Fy A_y - 5 - 5 = 0 \\Rightarrow A_y = 10\\ \\text{kN}\\qquad \\Mp{A} M_A - 5\\cdot 2 - 5\\cdot 6 = 0 \\Rightarrow M_A = 40\\ \\text{kNm}"}</MB>
        </Lepes>
        <Lepes cim="Szakaszok">
          <p>Egyetlen belső szakaszhatár: az <M>{"F_1"}</M> támadáspontja (<M>{"x = 2"}</M> m). Két terheletlen szakasz — mindkettőn <M>{"N"}</M> és <M>{"V"}</M> konstans, <M>{"M"}</M> lineáris.</p>
        </Lepes>
        <Lepes cim="Igénybevételi függvények jobbról (a szabad vég felől)">
          <p>Jobbról számolva a pozitív irányok: N (→), V (↓), M (↶). A <M>{"2 < x < 6"}</M> szakaszon csak <M>{"F_2"}</M> van a keresztmetszettől jobbra:</p>
          <MB>{"(\\rightarrow):\\ N = 0,\\qquad (\\downarrow):\\ V = +5\\ \\text{kN},\\qquad (\\curvearrowleft):\\ M(x) = -5\\,(6 - x)"}</MB>
          <p>A <M>{"0 < x < 2"}</M> szakaszon az <M>{"F_1"}</M> is jobbra esik:</p>
          <MB>{"(\\rightarrow):\\ N = +8{,}660\\ \\text{kN},\\qquad (\\downarrow):\\ V = +5 + 5 = +10\\ \\text{kN},\\qquad (\\curvearrowleft):\\ M(x) = -5\\,(6-x) - 5\\,(2-x)"}</MB>
        </Lepes>
        <Lepes cim="Jellemző értékek">
          <MB>{"M(6) = 0,\\quad M(2) = -5\\cdot 4 = -20\\ \\text{kNm},\\quad M(0) = -30 - 10 = -40\\ \\text{kNm}"}</MB>
          <p>Az <M>{"F_1"}</M> alatt: N ugrik 8,66-ot, V ugrik 5-öt, M törik. V sehol nem nulla, az M-nek nincs belső szélsőértéke: a legnagyobb a befogásnál (40 kNm, felül húzott).</p>
        </Lepes>
        <Lepes cim="Az ábrák">
          <p>
            Mindhárom ábrát a tartó ugyanazon <strong>pozitív oldalára</strong> rajzoljuk — arra, amelyiket a nyomaték pozitív definíciójához választottunk (vízszintes tartónál alulra): a pozitív N és V
            a tartó alatt van, a negatív M (felül húzott) fölötte. A tengely melletti + és − jel mutatja az oldalt.
          </p>
          <Abrak kulcs="gyf1" cim="GYF‑1 megoldása: N és V konstans szakaszokból (pozitív: a tartó alatt), M lineáris, negatív: a felső (húzott) oldalon." />
        </Lepes>
        <Lepes cim="Ellenőrzés">
          <p>A befogás keresztmetszetében az ábrák végértékei: <M>{"N = 8{,}66 = |A_x|"}</M>, <M>{"V = 10 = A_y"}</M>, <M>{"|M| = 40 = M_A"}</M> ✓. A szabad végen <M>{"N = M = 0"}</M>, <M>{"V = 5 = F_2"}</M> ✓.</p>
        </Lepes>
      </KidolgozottFeladat>
      <FilmCim>Ugyanez filmen – a keresztmetszet vándorol, az ábrák épülnek</FilmCim>
      <FilmGyf1 />

      {/* ==================== GYF‑2 ==================== */}
      <KidolgozottFeladat
        jel="GYF‑2"
        ido="8 perc"
        forras="Tankönyv 8.4.a ábra nyomán, megoszló teherrel"
        cim="Kéttámaszú tartó koncentrált és megoszló teherrel — a maximum ott, ahol V = 0"
        feladat={
          <p>
            <M>{"L = 6"}</M> m-es kéttámaszú tartó (csukló A-ban, görgő B-ben). Az <M>{"x = 1"}</M> m-nél <M>{"F = 12"}</M> kN koncentrált erő, a teljes hosszon <M>{"p = 4"}</M> kN/m egyenletes teher.
            Rajzold meg a V és M ábrát, számítsd ki a legnagyobb nyomatékot!
          </p>
        }
        abra={<AbraKeret cim="A feladat rajza. A megoszló teher eredője 24 kN a tartó közepén."><FeladatAbra kulcs="gyf2" /></AbraKeret>}
        tanulsag={
          <p>
            A nyomatéki ábra maximuma <strong>nem</strong> az erő alatt és nem a tartó közepén van, hanem ott, ahol a V ábra átmegy a nullán — ezt a helyet mindig ki kell számolni a V függvényből.
            Egyenletes teher alatt a V lineáris, meredeksége <M>{"-p"}</M>; a koncentrált erő <M>{"F"}</M>-fel ugrasztja.
          </p>
        }
      >
        <Lepes cim="Reakciók">
          <MB>{"\\Mp{A} -12\\cdot 1 - 24\\cdot 3 + B\\cdot 6 = 0 \\Rightarrow B = 14\\ \\text{kN}"}</MB>
          <MB>{"\\Mp{B} A_y\\cdot 6 - 12\\cdot 5 - 24\\cdot 3 = 0 \\Rightarrow A_y = 22\\ \\text{kN}\\qquad \\Fy 22 + 14 - 12 - 24 = 0\\ \\checkmark"}</MB>
        </Lepes>
        <Lepes cim="Szakaszok">
          <p>Egy belső határ: <M>{"x = 1"}</M> (az F). Mindkét szakaszon egyenletes teher: V lineáris, M másodfokú parabola. N mindenhol nulla (csak függőleges erők).</p>
        </Lepes>
        <Lepes cim="V(x) és M(x) balról">
          <MB>{"(\\uparrow):\\ V(x) = 22 - 4x\\ \\ (0<x<1),\\qquad V(x) = 22 - 12 - 4x = 10 - 4x\\ \\ (1<x<6)"}</MB>
          <MB>{"(\\curvearrowright):\\ M(x) = 22x - 2x^2\\ \\ (0<x<1),\\qquad M(x) = 22x - 12(x-1) - 2x^2\\ \\ (1<x<6)"}</MB>
          <p>(A K-tól balra eső <M>{"4x"}</M> teher eredője az <M>{"x/2"}</M> karral forgat: <M>{"4x\\cdot x/2 = 2x^2"}</M>.)</p>
        </Lepes>
        <Lepes cim="Jellemző értékek, töréspontok, szélsőérték">
          <MB>{"V(0) = 22,\\quad V(1^-) = 18,\\quad V(1^+) = 6,\\quad V(6) = -14 = -B"}</MB>
          <MB>{"V = 0:\\ 10 - 4x = 0 \\Rightarrow x = 2{,}5\\ \\text{m}"}</MB>
          <MB>{"M(1) = 22 - 2 = 20,\\quad M(2{,}5) = 55 - 18 - 12{,}5 = 24{,}5\\ \\text{kNm},\\quad M(6) = 132 - 60 - 72 = 0"}</MB>
          <p>Az F alatt a V ugrik 12-t, az M törik; a maximum <M>{"M_{\\max} = 24{,}5"}</M> kNm az <M>{"x = 2{,}5"}</M> m helyen (alul húzott).</p>
        </Lepes>
        <Lepes cim="Az ábrák">
          <Abrak kulcs="gyf2" abrak={["V", "M"]} szelso cim="GYF‑2 megoldása: V lineáris szakaszok 12 kN-os ugrással (pozitív alul), M parabola, csúcsa x = 2,5 m-nél (V = 0 — a bekarikázott pont)." />
        </Lepes>
        <Lepes cim="Ellenőrzés">
          <p>A tartóvégeken <M>{"M = 0"}</M> (nincs koncentrált nyomaték) ✓; <M>{"V(0) = A_y"}</M>, <M>{"V(6) = -B"}</M> ✓. Jobbról számolva <M>{"M(2{,}5) = 14\\cdot 3{,}5 - 4\\cdot 3{,}5\\cdot 1{,}75 = 49 - 24{,}5 = 24{,}5"}</M> ✓.</p>
        </Lepes>
      </KidolgozottFeladat>
      <FilmCim>Ugyanez filmen – V lineáris, M parabola, a maximum a V = 0 helyen</FilmCim>
      <FilmGyf2 />

      {/* ==================== GYF‑3 ==================== */}
      <KidolgozottFeladat
        jel="GYF‑3"
        ido="8 perc"
        forras="H09 szintemelő, 3. feladat (a reakciók: 5. modul GYF‑2)"
        cim="Konzolos kéttámaszú tartó — a konzolokon kívülről, a támaszközön belülről"
        feladat={
          <p>
            A <M>{"4a"}</M> hosszú gerendát az <M>{"x = a"}</M> helyen csukló (A), az <M>{"x = 3a"}</M> helyen görgő (B) támasztja. A bal végén a vízszintessel <M>{"\\alpha"}</M> szöget bezáró,
            balra-lefelé mutató <M>{"F_1"}</M>, a jobb végén a függőleges <M>{"F_2"}</M> hat. Rajzold meg az igénybevételi ábrákat!{" "}
            <M>{"a = 1{,}5\\ \\text{m},\\ F_1 = 12\\ \\text{kN},\\ \\alpha = 30^\\circ,\\ F_2 = 8\\ \\text{kN}"}</M>.
          </p>
        }
        abra={<AbraKeret cim="A feladat rajza (H09/3): mindkét vég túlnyúlik a támaszokon. F₁ komponensei 10,39 kN balra és 6 kN lefelé."><FeladatAbra kulcs="gyf3" gyerekek={gyf3Jelek} /></AbraKeret>}
        tanulsag={
          <p>
            A konzolokon a reakciók nélkül, kívülről számolunk; a támaszok között az egyik támasztól a másikig ugyanarról az oldalról haladunk. A támaszoknál a V ugrik a reakcióval, az M törik.
            A normálerő csak a bal konzolon nem nulla: a csukló vízszintes reakciója „lezárja”.
          </p>
        }
      >
        <Lepes cim="Reakciók (részletesen az 5. modul GYF‑2-jében)">
          <MB>{"\\Mp{A} 6\\cdot 1{,}5 + B\\cdot 3 - 8\\cdot 4{,}5 = 0 \\Rightarrow B = 9\\ \\text{kN}\\qquad \\Mp{B} 6\\cdot 4{,}5 - A_y\\cdot 3 - 8\\cdot 1{,}5 = 0 \\Rightarrow A_y = 5\\ \\text{kN}"}</MB>
          <MB>{"\\Fx -10{,}39 + A_x = 0 \\Rightarrow A_x = 10{,}39\\ \\text{kN}\\ (\\rightarrow)"}</MB>
        </Lepes>
        <Lepes cim="Szakaszok">
          <p>Határok a két támasznál: C–A (bal konzol), A–B (támaszköz), B–D (jobb konzol). Mind terheletlen: N, V konstans, M lineáris — elég a szakaszvégeken számolni.</p>
        </Lepes>
        <Lepes cim="Bal konzol (C–A) kívülről, balról">
          <MB>{"(\\leftarrow):\\ N = +10{,}39\\ \\text{kN (húzás)},\\qquad (\\uparrow):\\ V = -6\\ \\text{kN},\\qquad (\\curvearrowright):\\ M(A) = -6\\cdot 1{,}5 = -9\\ \\text{kNm}"}</MB>
        </Lepes>
        <Lepes cim="Jobb konzol (B–D) kívülről, jobbról">
          <MB>{"(\\rightarrow):\\ N = 0,\\qquad (\\downarrow):\\ V = +8\\ \\text{kN},\\qquad (\\curvearrowleft):\\ M(B) = -8\\cdot 1{,}5 = -12\\ \\text{kNm}"}</MB>
        </Lepes>
        <Lepes cim="Támaszköz (A–B) balról, az A után">
          <MB>{"(\\leftarrow):\\ N = 10{,}39 - 10{,}39 = 0,\\qquad (\\uparrow):\\ V = -6 + 5 = -1\\ \\text{kN}"}</MB>
          <p>Az M lineáris a két már ismert végérték között: <M>{"M(A) = -9"}</M>, <M>{"M(B) = -12"}</M>; ellenőrzés: <M>{"-9 + (-1)\\cdot 3 = -12"}</M> ✓ (a meredekség a V).</p>
        </Lepes>
        <Lepes cim="Az ábrák">
          <Abrak kulcs="gyf3" cim="GYF‑3 megoldása: N csak a bal konzolon; V ugrások az A-nál (+5) és a B-nél (+9); M mindenhol felül húzott, a támaszoknál törik." />
        </Lepes>
        <Lepes cim="Ellenőrzés">
          <p>A V ugrásai a támaszoknál: <M>{"-6 \\to -1"}</M> (+5 = A_y) és <M>{"-1 \\to +8"}</M> (+9 = B) ✓. A tartóvégeken <M>{"M = 0"}</M> ✓. Az N ugrása A-nál 10,39 = <M>{"A_x"}</M> ✓.</p>
        </Lepes>
      </KidolgozottFeladat>

      {/* ==================== GYF‑4 ==================== */}
      <KidolgozottFeladat
        jel="GYF‑4"
        ido="9 perc"
        forras="H09 szintemelő, 4. feladat"
        cim="Megoszló teher és koncentrált nyomaték — ugrás az M ábrában"
        feladat={
          <p>
            A <M>{"4a"}</M> hosszú tartót az <M>{"x = a"}</M> helyen csukló (A), az <M>{"x = 3a"}</M> helyen görgő (B) támasztja. A bal végétől <M>{"2a"}</M> hosszon <M>{"p"}</M> egyenletes teher,
            a jobb végén <M>{"M"}</M> koncentrált nyomaték hat az óramutató járásával egyezően. Rajzold meg az ábrákat! <M>{"a = 2\\ \\text{m},\\ p = 4\\ \\text{kN/m},\\ M = 8\\ \\text{kNm}"}</M>.
          </p>
        }
        abra={<AbraKeret cim="A feladat rajza. A teher eredője 16 kN az x = 2 m-nél — éppen az A támasz fölött."><FeladatAbra kulcs="gyf4" /></AbraKeret>}
        tanulsag={
          <p>
            A koncentrált nyomaték helyén az M ábra <strong>ugrik</strong> a nyomaték értékével, a V nem változik. Ahol V = 0 (x = 3,5 m), az M-nek lokális szélsőértéke van (−3,5 kNm), de a
            mértékadó nyomaték abszolút értékben a támaszoknál és a jobb konzolon: 8 kNm. A megoszló teher végénél az ábrák jellege változik, de sem ugrás, sem törés nincs.
          </p>
        }
      >
        <Lepes cim="Reakciók">
          <p>A csuklóra írt nyomatéki egyenletben a teher eredőjének karja nulla; az ↷ nyomaték az ↶ egyenletben negatív:</p>
          <MB>{"\\Mp{A} B\\cdot 4 - 8 = 0 \\Rightarrow B = 2\\ \\text{kN}\\qquad \\Fy A_y + 2 - 16 = 0 \\Rightarrow A_y = 14\\ \\text{kN}"}</MB>
          <MB>{"\\Mp{B} 16\\cdot 4 - 14\\cdot 4 - 8 = 0\\ \\checkmark"}</MB>
        </Lepes>
        <Lepes cim="Szakaszok">
          <p>Határok: A (x = 2), a teher vége (x = 4), B (x = 6). 0–2 és 2–4: teher alatt (V lineáris, M parabola); 4–6 és 6–8: terheletlen (V konstans, M lineáris).</p>
        </Lepes>
        <Lepes cim="V(x) balról">
          <MB>{"V(x) = -4x\\ (0<x<2):\\ V(2^-) = -8;\\qquad V(x) = -4x + 14\\ (2<x<4):\\ V(2^+) = 6,\\ V(4) = -2"}</MB>
          <MB>{"V = -2\\ (4<x<6);\\qquad V = -2 + 2 = 0\\ (6<x<8)"}</MB>
        </Lepes>
        <Lepes cim="M(x) balról (↷ pozitív)">
          <MB>{"M(x) = -2x^2\\ (0<x<2):\\ M(2) = -8;\\qquad M(x) = -2x^2 + 14(x-2)\\ (2<x<4):\\ M(4) = -32 + 28 = -4"}</MB>
          <MB>{"M(6) = -4 + (-2)\\cdot 2 = -8;\\qquad M = -8\\ (6<x<8^-),\\quad M(8^+) = -8 + 8 = 0"}</MB>
          <p>Szélsőérték a V = 0 helyen: <M>{"-4x + 14 = 0 \\Rightarrow x = 3{,}5"}</M>, <M>{"M(3{,}5) = -24{,}5 + 21 = -3{,}5"}</M> kNm.</p>
        </Lepes>
        <Lepes cim="Az ábrák">
          <Abrak kulcs="gyf4" abrak={["V", "M"]} szelso cim="GYF‑4 megoldása: V ugrások a támaszoknál (+14, +2); M parabola 0–4 m között (csúcs x = 3,5-nél, ahol V = 0), lineáris 4–6, konstans 6–8, a végén 8 kNm ugrás nullára." />
        </Lepes>
        <Lepes cim="Ellenőrzés">
          <p>Jobbról: a jobb konzolon csak a 8 kNm ↷ hat, (↶) szerint <M>{"M = -8"}</M> és <M>{"V = 0"}</M> ✓ — egyezik a balról kapott értékekkel. A teher végénél (x = 4) a parabola érintője a folytatás egyenese (V folytonos) ✓.</p>
        </Lepes>
      </KidolgozottFeladat>
      <FilmCim>Ugyanez filmen – parabola, egyenes, ugrás a nyomatéknál</FilmCim>
      <FilmGyf4 />

      {/* ==================== GYF‑5 ==================== */}
      <KidolgozottFeladat
        jel="GYF‑5"
        ido="8 perc"
        forras="Tankönyv 8.4.3 és 8.5. ábra nyomán"
        cim="Ferde tengelyű tartó — a teher tengelyirányú és merőleges komponense"
        feladat={
          <p>
            Ferde gerenda: A csukló a <M>{"(0;0)"}</M>, B vízszintes síkon gördülő görgő a <M>{"(4;3)"}</M> m pontban (hossza <M>{"L = 5"}</M> m, <M>{"\\operatorname{tg}\\alpha = 3/4"}</M>). A ferde hossz méterére{" "}
            <M>{"p = 4"}</M> kN/m függőleges teher hat. Rajzold meg az N, V, M ábrát!
          </p>
        }
        abra={<AbraKeret cim="A feladat rajza: a teher a ferde hossz mentén egyenletes, eredője pL = 20 kN a rúd közepén."><FeladatAbra kulcs="gyf5" /></AbraKeret>}
        tanulsag={
          <p>
            Ferde rúdon a függőleges erőket a tengellyel párhuzamos és arra merőleges komponensre bontjuk (a „virág”: <M>{"\\sin\\alpha = 0{,}6,\\ \\cos\\alpha = 0{,}8"}</M>). A tengelyirányú komponens
            miatt a <strong>normálerő sem nulla</strong>, és lineárisan változik. A nyomatékot a vízszintes és függőleges komponensekből, vízszintes karokkal könnyebb számolni; a parabola belógása{" "}
            <M>{"q l^2/8"}</M>, ahol <M>{"l"}</M> a ferde hossz és <M>{"q = p\\cos\\alpha"}</M> a merőleges komponens.
          </p>
        }
      >
        <Lepes cim="Reakciók">
          <MB>{"\\Fx A_x = 0\\qquad \\Mp{A} B\\cdot 4 - 20\\cdot 2 = 0 \\Rightarrow B = 10\\ \\text{kN}\\qquad \\Fy A_y + 10 - 20 = 0 \\Rightarrow A_y = 10\\ \\text{kN}"}</MB>
        </Lepes>
        <Lepes cim="A teher felbontása">
          <MB>{"p_{\\perp} = p\\cos\\alpha = 3{,}2\\ \\text{kN/m},\\qquad p_{\\parallel} = p\\sin\\alpha = 2{,}4\\ \\text{kN/m (a tengely mentén, lefelé)}"}</MB>
          <p>Egy szakasz, végig egyenletes ferde teher: N lineáris, V lineáris, M parabola.</p>
        </Lepes>
        <Lepes cim="N(x), V(x), M(x) balról (x a ferde tengely mentén, A-tól)">
          <p>A-ban az <M>{"A_y = 10"}</M> reakció komponensei: a tengelyre merőleges <M>{"10\\cos\\alpha = 8"}</M>, tengelyirányú <M>{"10\\sin\\alpha = 6"}</M> (a rudat nyomja).</p>
          <MB>{"(\\swarrow):\\ N(x) = -6 + 2{,}4x,\\qquad (\\nwarrow):\\ V(x) = 8 - 3{,}2x,\\qquad (\\curvearrowright):\\ M(x) = 8x - 3{,}2\\,\\frac{x^2}{2} = 8x - 1{,}6x^2"}</MB>
          <MB>{"N(0) = -6,\\ N(5) = +6\\ \\text{kN};\\qquad V(0) = 8,\\ V(5) = -8\\ \\text{kN};\\qquad V = 0 \\Rightarrow x = 2{,}5,\\ M_{\\max} = 20 - 10 = 10\\ \\text{kNm}"}</MB>
          <p>Ugyanez a belógással: <M>{"M_{\\max} = p_\\perp L^2/8 = 3{,}2\\cdot 25/8 = 10"}</M> kNm ✓. Vízszintes karokkal: <M>{"M(2{,}5) = 10\\cdot 2 - 10\\cdot 1 = 10"}</M> (az A_y karja 2 m, a fél teher 10 kN karja 1 m) ✓.</p>
        </Lepes>
        <Lepes cim="Az ábrák">
          <Abrak kulcs="gyf5" szelso cim="GYF‑5 megoldása: N −6-tól +6-ig (nyomásból húzás), V 8-tól −8-ig, M parabola 10 kNm csúccsal a közepén — mind a ferde tengelyre merőlegesen felmérve, a pozitív értékek a rúd alsó-jobb (pozitív) oldalán." amp={34} />
        </Lepes>
        <Lepes cim="Ellenőrzés">
          <p>B-ben a görgő 10 kN függőleges reakciójának komponensei: <M>{"N = +6"}</M> (a tengely irányában húz), <M>{"V = -8"}</M> ✓; <M>{"M(5) = 40 - 40 = 0"}</M> ✓ (görgőn nincs nyomaték).</p>
        </Lepes>
      </KidolgozottFeladat>

      {/* ==================== GYF‑6 ==================== */}
      <KidolgozottFeladat
        jel="GYF‑6"
        ido="8 perc"
        forras="Vizsgaminta, 2. feladat"
        cim="Tört tengelyű konzol — a sarokban N és V szerepet cserél, M átmegy"
        feladat={
          <p>
            Alul befogott, 4 m magas oszlop, tetején 3 m-es vízszintes kar; a karon <M>{"p = 3"}</M> kN/m <em>felfelé</em> mutató teher. Határozd meg az igénybevételi ábrákat!
          </p>
        }
        abra={<AbraKeret cim="A vizsgaminta 2. feladatának rajza. A teher eredője 9 kN felfelé, a kar közepén."><FeladatAbra kulcs="gyf6" /></AbraKeret>}
        tanulsag={
          <p>
            Tört tengelyű tartón a törés mindig szakaszhatár: az N és V ábra a sarokban „szerepet cserél” (a kar nyíróereje az oszlop normálereje lesz), a nyomaték viszont
            átmegy a sarkon, azonos nagysággal — az M ábra befordul, és mindkét csonkon ugyanazon (itt a belső, húzott) oldalon marad. Ez a vizsga 2. feladatának tipikus alakja.
          </p>
        }
      >
        <Lepes cim="Reakciók — csak az ellenőrzéshez">
          <MB>{"\\Fx A_x = 0\\qquad \\Fy A_y + 9 = 0 \\Rightarrow A_y = -9\\ \\text{kN}\\ (\\downarrow)\\qquad \\Mp{A} M_A + 9\\cdot 1{,}5 = 0 \\Rightarrow M_A = -13{,}5\\ \\text{kNm}\\ (\\curvearrowright)"}</MB>
        </Lepes>
        <Lepes cim="Szakaszok">
          <p>Két szakasz: a kar (C–D, egyenletes teher: V lineáris, M parabola) és az oszlop (A–C, terheletlen: N, V konstans, M lineáris). A sarok C mindkettőnek határa.</p>
        </Lepes>
        <Lepes cim="A kar, a szabad végtől (s a D-től mért távolság)">
          <p>A kar keresztmetszetétől kifelé eső részen a felfelé ható <M>{"3s"}</M> teher hat, karja <M>{"s/2"}</M>. Jobbról: V (↓) pozitív, M (↶) pozitív:</p>
          <MB>{"N = 0,\\qquad V(s) = -3s,\\qquad M(s) = +3s\\cdot\\frac{s}{2} = 1{,}5\\,s^2\\qquad\\Rightarrow\\quad V(C) = -9\\ \\text{kN},\\ M(C) = 13{,}5\\ \\text{kNm (alul húzott)}"}</MB>
        </Lepes>
        <Lepes cim="Az oszlop, felülről (a kar felől)">
          <p>Az oszlop bármely keresztmetszetétől felfelé eső részre a kar teljes terhe (9 kN felfelé) hat, karja a sarokhoz képest 1,5 m — ez nem változik az oszlop mentén:</p>
          <MB>{"N = +9\\ \\text{kN (húzott: a kar felfelé húzza)},\\qquad V = 0,\\qquad M = 9\\cdot 1{,}5 = 13{,}5\\ \\text{kNm konstans}"}</MB>
          <p>A húzott oldal az oszlop <strong>belső</strong> (kar felőli) oldala: a felfelé emelt kar a sarkot „kinyitja”, a sarok belső szála húzódik.</p>
        </Lepes>
        <Lepes cim="Az ábrák">
          <Abrak kulcs="gyf6" cim="GYF‑6 megoldása: az oszlopon N = 9 (húzás), V = 0, M = 13,5 konstans; a karon V lineáris −9-től 0-ig, M parabola 13,5-től 0-ig — az M ábra befordul a sarkon, a belső oldalon." amp={34} />
        </Lepes>
        <Lepes cim="Ellenőrzés a sarokban és a befogásnál">
          <p>Sarok: a kar V-je (−9) az oszlop N-je (+9) — a csonkok egyensúlyban; a két csonk nyomatéka 13,5 = 13,5 ✓, mindkettő a belső oldalról indul. Befogás: <M>{"N = 9 = |A_y|,\\ V = 0 = A_x,\\ M = 13{,}5 = |M_A|"}</M> ✓.</p>
        </Lepes>
      </KidolgozottFeladat>
      <FilmCim>Ugyanez filmen – az oszloptól a karig, a sarok szerepcseréje</FilmCim>
      <FilmGyf6 />

      {/* ==================== GYF‑7 ==================== */}
      <KidolgozottFeladat
        jel="GYF‑7"
        ido="12 perc"
        forras="Tankönyv 8.7. ábra"
        cim="Gerber-tartó — előbb a befüggesztett rész, a csuklóban M = 0"
        feladat={
          <p>
            16 m hosszú Gerber-tartó, végig <M>{"p = 6"}</M> kN/m teherrel. Támaszok: csukló A az <M>{"x = 3"}</M>, görgő B az <M>{"x = 11"}</M>, görgő C az <M>{"x = 16"}</M> m-nél; belső csukló G az{" "}
            <M>{"x = 7"}</M> m-nél. Számítsd ki a reakciókat, és rajzold meg a V és M ábrát!
          </p>
        }
        abra={<AbraKeret cim="A tankönyv 8.7.a ábrája: a bal test E–G (konzol E–A, csukló A, belső csukló G), a jobb test G–C (görgők B és C)."><FeladatAbra kulcs="gyf7" /></AbraKeret>}
        tanulsag={
          <p>
            A Gerber-tartót testenként számoljuk (először az, amelyik a másikra támaszkodik), az ábrákat viszont közös rajzba tesszük: azonos lépték mellett a csuklónál az ábrák
            folytonosan csatlakoznak, és a nyomatéki ábra pontosan a csuklón megy át (ott M = 0, ha nincs a csuklón koncentrált nyomaték). A tankönyv K₁, K₂, K₃ keresztmetszeteinek
            értékei (6,75 / −1,5; −17,25 / −22,5; 16,8 / −23,4) az ábrákról leolvashatók.
          </p>
        }
      >
        <Lepes cim="Elkülönítés és reakciók testenként">
          <p>A bal test (E–G, 7 m, 42 kN teher) az A csuklón és a G belső csuklón támaszkodik; vízszintes erő nincs, így <M>{"A_x = G_x = 0"}</M>:</p>
          <MB>{"\\Mp{A} -42\\cdot 0{,}5 + G_y\\cdot 4 = 0 \\Rightarrow G_y = 5{,}25\\ \\text{kN}\\qquad \\Fy A_y + 5{,}25 - 42 = 0 \\Rightarrow A_y = 36{,}75\\ \\text{kN}"}</MB>
          <p>A jobb testre (G–C, 9 m, 54 kN) a csuklóban <M>{"5{,}25"}</M> kN hat lefelé:</p>
          <MB>{"\\Mp{C} -5{,}25\\cdot 9 - 54\\cdot 4{,}5 + B\\cdot 5 = 0 \\Rightarrow B = 58{,}05\\ \\text{kN}\\qquad \\Fy C + 58{,}05 - 54 - 5{,}25 = 0 \\Rightarrow C = 1{,}2\\ \\text{kN}"}</MB>
          <MB>{"\\text{ellenőrzés az egészre: } \\Fy 36{,}75 + 58{,}05 + 1{,}2 - 96 = 0\\ \\checkmark"}</MB>
        </Lepes>
        <Lepes cim="Szakaszok">
          <p>Négy szakasz, mind egyenletes teher alatt (V lineáris, M parabola): E–A (konzol), A–G, G–B, B–C. Határok: A, G (csukló), B.</p>
        </Lepes>
        <Lepes cim="V balról, végig ugyanarról az oldalról">
          <MB>{"V(A^-) = -18,\\quad V(A^+) = +18{,}75,\\quad V(G) = 18{,}75 - 24 = -5{,}25,\\quad V(B^-) = -29{,}25,\\quad V(B^+) = +28{,}8,\\quad V(C) = -1{,}2"}</MB>
          <p>V = 0 helyek: <M>{"18{,}75 - 6x' = 0 \\Rightarrow x' = 3{,}125"}</M> m az A-tól; <M>{"28{,}8 - 6x'' = 0 \\Rightarrow x'' = 4{,}8"}</M> m a B-től.</p>
        </Lepes>
        <Lepes cim="M balról (↷ pozitív)">
          <MB>{"M(A) = -6\\cdot 3\\cdot 1{,}5 = -27,\\qquad M(G) = 36{,}75\\cdot 4 - 42\\cdot 3{,}5 = 0\\ \\checkmark\\ (\\text{csukló})"}</MB>
          <MB>{"M(A + 3{,}125) = -27 + 18{,}75\\cdot 3{,}125 - 3\\cdot 3{,}125^2 = +2{,}30\\ \\text{kNm}"}</MB>
          <MB>{"M(B) = 1{,}2\\cdot 5 - 30\\cdot 2{,}5 = -69\\ \\text{kNm (jobbról)},\\qquad M(B + 4{,}8) = -69 + 28{,}8\\cdot 4{,}8 - 3\\cdot 4{,}8^2 = +0{,}12\\ \\text{kNm}"}</MB>
        </Lepes>
        <Lepes cim="Az ábrák">
          <Abrak kulcs="gyf7" abrak={["V", "M"]} szelso cim="GYF‑7 megoldása: a V ábra a támaszoknál ugrik (36,75 és 58,05), a csuklónál folytonos; az M ábra a G csuklón átmegy (0), a támaszok fölött −27 és −69, a mezőkben kis pozitív csúcsok (2,30 és 0,12) a V = 0 helyeken." amp={40} />
        </Lepes>
        <Lepes cim="Ellenőrzés a tankönyv keresztmetszeteivel">
          <MB>{"K_1\\ (x=5):\\ V = 36{,}75 - 6\\cdot 5 = 6{,}75,\\quad M = 36{,}75\\cdot 2 - 30\\cdot 2{,}5 = -1{,}5\\ \\checkmark"}</MB>
          <MB>{"K_3\\ (x=13),\\ \\text{jobbról}:\\ V = -1{,}2 + 6\\cdot 3 = 16{,}8,\\quad M = 1{,}2\\cdot 3 - 18\\cdot 1{,}5 = -23{,}4\\ \\checkmark"}</MB>
        </Lepes>
      </KidolgozottFeladat>

      {/* ==================== GYF‑8 ==================== */}
      <KidolgozottFeladat
        jel="GYF‑8"
        ido="12 perc"
        forras="Vizsgaminta, 4. feladat"
        cim="Háromcsuklós tartó — ferde rudak, csuklóban M = 0, a normálerő nem nulla"
        feladat={
          <p>
            Háromcsuklós tartó: A csukló <M>{"(0;0)"}</M>, C belső csukló <M>{"(5;2)"}</M>, B csukló <M>{"(10;0)"}</M> m. A bal rúdon a vízszintes vetület méterére <M>{"2"}</M> kN/m, a jobbon{" "}
            <M>{"4"}</M> kN/m függőleges teher. Határozd meg a reakciókat, és rajzold meg az igénybevételi ábrákat!
          </p>
        }
        abra={<AbraKeret cim="A vizsgaminta 4. feladatának rajza: 2, ill. 4 kN/m a vízszintes vetület méterére (a ferde hossz méterére ez 2·cos α = 1,86 és 4·cos α = 3,71 kN/m). A terhek eredője 10 kN (x = 2,5) és 20 kN (x = 7,5)."><FeladatAbra kulcs="gyf8" teherCimkek={false} gyerekek={gyf8Jelek} /></AbraKeret>}
        tanulsag={
          <p>
            Háromcsuklós tartón a vízszintes reakciót a csuklóra írt nyomatéki egyenlet adja — és ez a vízszintes erő a ferde rudakban jelentős <strong>nyomó normálerőt</strong> okoz.
            A vetületre adott teher a ferde hosszon kisebb intenzitású (<M>{"p\\cos\\alpha"}</M>), a merőleges komponens pedig <M>{"p\\cos^2\\alpha"}</M>. A csuklókban M = 0, az M ábra a rudakra merőlegesen mérve parabola.
          </p>
        }
      >
        <Lepes cim="Reakciók az egész szerkezetből és a C csuklóból">
          <MB>{"\\Mp{A} B_y\\cdot 10 - 10\\cdot 2{,}5 - 20\\cdot 7{,}5 = 0 \\Rightarrow B_y = 17{,}5\\ \\text{kN}\\qquad \\Fy A_y + 17{,}5 - 30 = 0 \\Rightarrow A_y = 12{,}5\\ \\text{kN}"}</MB>
          <p>A bal rúdra, a C csuklóra írt nyomatéki egyenlet (ott <M>{"M = 0"}</M>):</p>
          <MB>{"\\Mp{C} 12{,}5\\cdot 5 - A_x\\cdot 2 - 10\\cdot 2{,}5 = 0 \\Rightarrow A_x = 18{,}75\\ \\text{kN}\\ (\\rightarrow)\\qquad \\Fx 18{,}75 + B_x = 0 \\Rightarrow B_x = -18{,}75\\ \\text{kN}\\ (\\leftarrow)"}</MB>
        </Lepes>
        <Lepes cim="A ferde rudak geometriája és a teher átváltása">
          <MB>{"\\operatorname{tg}\\alpha = 2/5,\\quad \\alpha = 21{,}80^\\circ,\\quad \\cos\\alpha = 0{,}9285,\\ \\sin\\alpha = 0{,}3714,\\quad l = \\sqrt{29} = 5{,}385\\ \\text{m}"}</MB>
          <p>A ferde hossz méterére <M>{"2\\cos\\alpha = 1{,}857"}</M>, ill. <M>{"4\\cos\\alpha = 3{,}714"}</M> kN/m jut; ennek merőleges komponense <M>{"1{,}724"}</M>, ill. <M>{"3{,}448"}</M> kN/m.</p>
        </Lepes>
        <Lepes cim="A bal rúd végkeresztmetszetei">
          <p>A-ban a reakció <M>{"(18{,}75;\\ 12{,}5)"}</M> tengelyirányú és merőleges vetülete:</p>
          <MB>{"N(A) = -(18{,}75\\cos\\alpha + 12{,}5\\sin\\alpha) = -22{,}05\\ \\text{kN (nyomás)},\\qquad V(A) = -18{,}75\\sin\\alpha + 12{,}5\\cos\\alpha = +4{,}64\\ \\text{kN}"}</MB>
          <MB>{"N(C^-) = -22{,}05 + 10\\sin\\alpha = -18{,}34,\\qquad V(C^-) = 4{,}64 - 10\\cos\\alpha = -4{,}64\\ \\text{kN},\\qquad M(A) = M(C) = 0"}</MB>
          <p>A rúd közepén (V = 0), vízszintes karokkal: <M>{"M = 12{,}5\\cdot 2{,}5 - 18{,}75\\cdot 1 - 10\\cdot 1{,}25 = 6{,}25"}</M> kNm (alul húzott). Ugyanez a belógással: <M>{"1{,}724\\cdot 5{,}385^2/8 = 6{,}25"}</M> ✓.</p>
        </Lepes>
        <Lepes cim="A jobb rúd">
          <MB>{"M_{\\max} = 17{,}5\\cdot 2{,}5 - 18{,}75\\cdot 1 - 20\\cdot 1{,}25 = 12{,}5\\ \\text{kNm},\\qquad N(B) = -(18{,}75\\cos\\alpha + 17{,}5\\sin\\alpha) = -23{,}91\\ \\text{kN}"}</MB>
          <MB>{"V(C^+) = +9{,}28,\\quad V(B) = -9{,}28\\ \\text{kN},\\qquad N(C^+) = -16{,}48\\ \\text{kN}"}</MB>
        </Lepes>
        <Lepes cim="Az ábrák">
          <Abrak kulcs="gyf8" szelso teherCimkek={false} gyerekek={gyf8Jelek} cim="GYF‑8 megoldása: N végig nyomás (−16,5 … −23,9, a rudak negatív, külső oldalán), V lineáris mindkét rúdon, M parabolák 6,25 és 12,5 kNm csúccsal a belső (pozitív) oldalon, a csuklókban nulla — a rudakra merőlegesen felmérve." amp={34} />
        </Lepes>
        <Lepes cim="Ellenőrzés a C csuklóban">
          <p>A csuklón nem hat koncentrált erő, ezért a két rúd C-beli belső ereje egyensúlyban van: a bal rúd <M>{"(N, V) = (-18{,}34;\\ -4{,}64)"}</M> és a jobb rúd <M>{"(-16{,}48;\\ +9{,}28)"}</M> vektorai globális komponensekre átszámolva ugyanazt az erőt adják: a bal rúdra C-ben <M>{"(-18{,}75;\\ -2{,}5)"}</M> kN hat (a bal rúd egyensúlyából: <M>{"18{,}75 - 18{,}75 = 0"}</M>, <M>{"12{,}5 - 10 - 2{,}5 = 0"}</M>), a jobb rúdra az ellentettje. <M>{"M(C) = 0"}</M> mindkét oldalról ✓.</p>
        </Lepes>
      </KidolgozottFeladat>
    </>
  );
}
