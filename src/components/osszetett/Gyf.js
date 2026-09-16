import { AbraKeret } from "@/components/ui/Elemek";
import { M, MB } from "@/components/ui/Keplet";
import { KidolgozottFeladat, Lepes } from "@/components/KidolgozottFeladat";
import { AbraGyf1, AbraGyf2, AbraGyf3, AbraGyf4, AbraGyf5, AbraGyf6 } from "@/components/osszetett/FeladatAbrak";
import FilmGyf1 from "@/components/osszetett/FilmGyf1";
import FilmGyf2 from "@/components/osszetett/FilmGyf2";
import FilmGyf4 from "@/components/osszetett/FilmGyf4";

/**
 * A 6. modul kidolgozott feladatai (GYF‑1…GYF‑6): a tankönyv 5.3 példái számokkal
 * (Gerber, háromcsuklós, terhelt csukló, függesztőmű) és a H05/H06 feladatsor feladatai.
 * Minden feladat a tankönyv 5.2 receptjét követi: elkülönítés testenként → egyensúlyi
 * kijelentések → egyismeretlenes egyenletek (a befüggesztett résszel kezdve) → ellenőrzés →
 * eredményvázlat. Minden számot a számítómag (elemez) ellenőrzött.
 */

const FilmCim = ({ children }) => (
  <h3 className="mt-4 mb-2 text-[13px] font-semibold text-petrol-500 uppercase tracking-wider">{children}</h3>
);

export default function GyfBlokkok() {
  return (
    <>
      {/* ==================== GYF‑1 ==================== */}
      <KidolgozottFeladat
        jel="GYF‑1"
        ido="8 perc"
        forras="Tankönyv 5.4. ábra, számokkal"
        cim="Gerber-tartó — előbb a befüggesztett rész, aztán a fix rész"
        feladat={
          <p>
            A 9 m hosszú gerendát az <M>{"A"}</M> csukló (<M>{"x = 0"}</M>), a <M>{"B"}</M> görgő (<M>{"x = 4"}</M> m) és a <M>{"D"}</M> görgő (<M>{"x = 9"}</M> m) támasztja, az{" "}
            <M>{"x = 6"}</M> m helyen <M>{"C"}</M> belső csukló szakítja meg. Terhek: <M>{"F_1 = 12\\ \\text{kN}"}</M> az <M>{"x = 2"}</M> m helyen, jobbra-lefelé, a vízszintessel{" "}
            <M>{"60^\\circ"}</M>-ot bezárva; <M>{"F_2 = 8\\ \\text{kN}"}</M> függőleges az <M>{"x = 8"}</M> m helyen. Határozd meg a külső reakciókat és a <M>{"C"}</M> csuklóban átadódó erőt!
          </p>
        }
        abra={
          <AbraKeret cim="Az I. test (A–C) csuklóval és görgővel áll: fix rész. A II. test (C–D) egyetlen görgővel csak a C csuklóra támaszkodva áll: befüggesztett rész.">
            <AbraGyf1 />
          </AbraKeret>
        }
        tanulsag={
          <p>
            A Gerber-tartó kulcsa a <strong>befüggesztett rész felismerése</strong>: az a test, amelynek egyensúlyi kijelentésében pontosan három ismeretlen van (itt <M>{"C_x, C_y, D"}</M>). Azt egy
            kéttámaszú tartóként oldjuk meg, a csuklóerő ellentettjét pedig <strong>teherként</strong> tesszük a fix részre — ami ezután megint csak egy egyszerű tartó. Az egész szerkezetre írt ΣF<sub>y</sub> a
            legjobb ellenőrzés, mert abban a csuklóerő ki sem esik hibásan: ott nincs.
          </p>
        }
      >
        <Lepes cim="Elkülönítés — a két test és a csuklóerő-pár">
          <p>
            A szerkezetet nemcsak a földtől, hanem a <M>{"C"}</M> csuklónál egymástól is elválasztjuk. A II. testre <M>{"C_x"}</M> (jobbra) és <M>{"C_y"}</M> (felfelé) hat, az I. testre az ellentettjük:{" "}
            <M>{"C'_x"}</M> balra, <M>{"C'_y"}</M> lefelé — a nagyságuk azonos. Külső reakciók: <M>{"A_x, A_y"}</M> (csukló), <M>{"B"}</M> és <M>{"D"}</M> függőlegesen felfelé. Az <M>{"F_1"}</M> komponensei:{" "}
            <M>{"12\\cos 60^\\circ = 6{,}000\\ \\text{kN}"}</M> jobbra, <M>{"12\\sin 60^\\circ = 10{,}39\\ \\text{kN}"}</M> lefelé. Számlálás: 2 test → 6 egyenlet; ismeretlen: <M>{"A_x, A_y, B, D, C_x, C_y"}</M> = 6 ✓.
          </p>
        </Lepes>
        <Lepes cim="Egyensúlyi kijelentések — testenként és az egészre">
          <MB>{"\\text{I:}\\ (\\underline{F}_1, \\underline{A}_x, \\underline{A}_y, \\underline{B}, \\underline{C}'_x, \\underline{C}'_y) \\ekv \\underline{O}\\qquad \\text{II:}\\ (\\underline{F}_2, \\underline{D}, \\underline{C}_x, \\underline{C}_y) \\ekv \\underline{O}"}</MB>
          <MB>{"\\Sigma:\\ (\\underline{F}_1, \\underline{F}_2, \\underline{A}_x, \\underline{A}_y, \\underline{B}, \\underline{D}) \\ekv \\underline{O}"}</MB>
          <p>
            A II. kijelentésben három ismeretlen van: ezzel kezdünk. Az I.-ben öt — abból még nem lehet. Az egészre írtban négy, de a csuklóerők kiestek: ez ellenőrzésre kiváló.
          </p>
        </Lepes>
        <Lepes cim="II. test: nyomatéki egyenlet a C csuklóra → D">
          <p><M>{"C"}</M>-n átmegy <M>{"C_x"}</M> és <M>{"C_y"}</M> hatásvonala; <M>{"F_2"}</M> karja 2 m (a ponttól jobbra lefelé: negatív), <M>{"D"}</M> karja 3 m:</p>
          <MB>{"\\text{II:}\\ \\Mp{C}\\ -8\\cdot 2 + D\\cdot 3 = 0\\ \\Rightarrow\\ D = 5{,}333\\ \\text{kN}"}</MB>
        </Lepes>
        <Lepes cim="II. test: nyomatéki egyenlet a D görgőre → C_y, vízszintes vetület → C_x">
          <p>A <M>{"D"}</M> pontra nézve <M>{"D"}</M> és <M>{"C_x"}</M> karja nulla; <M>{"F_2"}</M> a ponttól balra 1 m-re lefelé hat (pozitív), <M>{"C_y"}</M> 3 m-re balra felfelé (negatív):</p>
          <MB>{"\\text{II:}\\ \\Mp{D}\\ 8\\cdot 1 - C_y\\cdot 3 = 0\\ \\Rightarrow\\ C_y = 2{,}667\\ \\text{kN}"}</MB>
          <MB>{"\\text{II:}\\ \\Fx\\ C_x = 0"}</MB>
          <p>A II. testre ható csuklóerő tehát <M>{"2{,}667\\ \\text{kN}"}</M> felfelé — a fix rész „megtartja” a befüggesztett részt. Az I. testre az ellentettje, 2,667 kN <strong>lefelé</strong> hat a <M>{"C"}</M> pontban.</p>
        </Lepes>
        <Lepes cim="I. test: nyomatéki egyenlet az A csuklóra → B">
          <p>Az I. test már egy kéttámaszú tartó, terhei <M>{"F_1"}</M> és a <M>{"C"}</M>-ben lefelé ható 2,667 kN. <M>{"A"}</M>-ra <M>{"A_x, A_y"}</M> kiesik; <M>{"F_1"}</M> vízszintes komponense a tengelyben hat:</p>
          <MB>{"\\text{I:}\\ \\Mp{A}\\ -10{,}39\\cdot 2 - 2{,}667\\cdot 6 + B\\cdot 4 = 0\\ \\Rightarrow\\ B = \\frac{20{,}78 + 16{,}00}{4} = 9{,}196\\ \\text{kN}"}</MB>
        </Lepes>
        <Lepes cim="I. test: nyomatéki egyenlet a B görgőre → A_y, vízszintes vetület → A_x">
          <MB>{"\\text{I:}\\ \\Mp{B}\\ 10{,}39\\cdot 2 - 2{,}667\\cdot 2 - A_y\\cdot 4 = 0\\ \\Rightarrow\\ A_y = \\frac{20{,}78 - 5{,}333}{4} = 3{,}863\\ \\text{kN}"}</MB>
          <MB>{"\\text{I:}\\ \\Fx\\ 6{,}000 - C'_x + A_x = 0\\ \\Rightarrow\\ A_x = -6{,}000\\ \\text{kN}"}</MB>
          <p>Negatív: <M>{"A_x"}</M> valójában <strong>balra</strong> mutat, az <M>{"F_1"}</M> vízszintes komponensét egyensúlyozza.</p>
        </Lepes>
        <Lepes cim="Ellenőrzés — függőleges vetületi egyenlet az egész szerkezetre">
          <p>Ezt az egyenletet nem használtuk, és a csuklóerő nem is szerepel benne (kiesik, hatás–ellenhatás):</p>
          <MB>{"\\Sigma:\\ \\Fy\\ 3{,}863 + 9{,}196 + 5{,}333 - 10{,}39 - 8 = 18{,}39 - 18{,}39 = 0{,}00\\ \\checkmark"}</MB>
        </Lepes>
        <Lepes cim="Eredményvázlat — testenként">
          <p>
            Külső reakciók: <M>{"A_x = 6{,}000\\ \\text{kN}"}</M> <strong>balra</strong>, <M>{"A_y = 3{,}863\\ \\text{kN}"}</M> felfelé, <M>{"B = 9{,}196\\ \\text{kN}"}</M> felfelé,{" "}
            <M>{"D = 5{,}333\\ \\text{kN}"}</M> felfelé. Belső csuklóerő: <M>{"C_x = 0"}</M>, <M>{"C_y = 2{,}667\\ \\text{kN}"}</M> — a II. testre felfelé, az I.-re lefelé. Hat új szám, hat egyenlet.
            Ránézésre: a II. test 8 kN-ját 5,333 (D) + 2,667 (C) tartja, a C-nél a fix rész „segít be”.
          </p>
        </Lepes>
      </KidolgozottFeladat>
      <FilmCim>Ugyanez filmen – szétszedés a csuklónál, előbb a II., aztán az I. test</FilmCim>
      <FilmGyf1 />

      {/* ==================== GYF‑2 ==================== */}
      <KidolgozottFeladat
        jel="GYF‑2"
        ido="9 perc"
        forras="H05 szintemelő, 2. feladat"
        cim="Háromcsuklós keret vízszintes teherrel — az egész szerkezetre írt nyomatéki egyenletek"
        feladat={
          <p>
            A keret <M>{"A"}</M> csuklójából <M>{"3a"}</M> magas oszlop indul, a gerenda vízszintesen fut a <M>{"C"}</M> belső csuklóig (<M>{"3a"}</M>), majd <M>{"a"}</M>-val lejt a jobb sarokig (<M>{"3a"}</M>{" "}
            vízszintesen), ahonnan <M>{"2a"}</M> magas oszlop megy le a <M>{"B"}</M> csuklóig. A bal oszlopot jobbra mutató, egyenletes <M>{"p"}</M> teher, a ferde gerendaszakasz közepét függőleges{" "}
            <M>{"F"}</M> terheli. Határozd meg a reakciókat és a csuklóerőt! <M>{"a = 2\\ \\text{m},\\ p = 4\\ \\text{kN/m},\\ F = 12\\ \\text{kN}"}</M>.
          </p>
        }
        abra={
          <AbraKeret cim="Koordináták az A-ból: E(0; 6), C(6; 6), G(12; 4), B(12; 0). A két külső csukló azonos magasságban van — ezért az egészre írt nyomatéki egyenletekből a függőleges reakciók közvetlenül kijönnek.">
            <AbraGyf2 />
          </AbraKeret>
        }
        tanulsag={
          <p>
            Háromcsuklós tartónál testenként négy ismeretlen van, ezért <strong>egyik testtel sem lehet kezdeni</strong>. A mentőöv az egész szerkezet: azonos magasságú támaszoknál az <M>{"A"}</M>-ra és{" "}
            <M>{"B"}</M>-re írt nyomatéki egyenletben csak egy-egy függőleges reakció marad. Utána a <M>{"C"}</M>-re írt nyomatéki egyenlet <em>egy testre</em> adja a vízszintes reakciót. A tankönyv
            lábjegyzete: <strong>a külső csuklók vízszintes komponenseiről sose feledkezz meg</strong> — itt 15 és 9 kN, nem elhanyagolható. A negatív <M>{"A_y"}</M> sem hiba: a vízszintes teher
            fel akarja billenteni a keretet az <M>{"A"}</M> oldalon.
          </p>
        }
      >
        <Lepes cim="Elkülönítés — a megoszló teher eredője és a csuklóerők">
          <p>
            A bal oszlop terhének eredője <M>{"R = p\\cdot 3a = 4\\cdot 6 = 24\\ \\text{kN}"}</M> jobbra, a fél magasságban, <M>{"y = 3\\ \\text{m}"}</M>-en. Az <M>{"F = 12\\ \\text{kN}"}</M> a{" "}
            <M>{"C"}</M>–<M>{"G"}</M> szakasz közepén, a <M>{"(9;\\ 5)"}</M> pontban hat. A csuklók helyére: <M>{"A_x, A_y"}</M>, <M>{"B_x, B_y"}</M> (jobbra, felfelé), a <M>{"C"}</M>-ben a II. testre{" "}
            <M>{"C_x, C_y"}</M>, az I.-re az ellentettjük. Számlálás: 2 test, 6 egyenlet; ismeretlen 4 + 2 = 6 ✓.
          </p>
        </Lepes>
        <Lepes cim="Egyensúlyi kijelentések">
          <MB>{"\\text{I:}\\ (\\underline{R}, \\underline{A}_x, \\underline{A}_y, \\underline{C}'_x, \\underline{C}'_y) \\ekv \\underline{O}\\qquad \\text{II:}\\ (\\underline{F}, \\underline{B}_x, \\underline{B}_y, \\underline{C}_x, \\underline{C}_y) \\ekv \\underline{O}"}</MB>
          <MB>{"\\Sigma:\\ (\\underline{R}, \\underline{F}, \\underline{A}_x, \\underline{A}_y, \\underline{B}_x, \\underline{B}_y) \\ekv \\underline{O}"}</MB>
          <p>Mindhárom kijelentésben négy ismeretlen — de az egészre írt nyomatéki egyenletekben a csuklók miatt kettő-kettő kiesik.</p>
        </Lepes>
        <Lepes cim="Egész szerkezet: nyomatéki egyenlet A-ra → B_y">
          <p>
            <M>{"A"}</M>-n átmegy <M>{"A_x, A_y"}</M>, és mivel <M>{"B"}</M> ugyanabban a magasságban van, <M>{"B_x"}</M> hatásvonala is átmegy rajta. Az <M>{"R"}</M> 3 m-rel az <M>{"A"}</M> fölött jobbra hat — az
            óramutató irányába forgat (negatív); <M>{"F"}</M> karja 9 m:
          </p>
          <MB>{"\\Sigma:\\ \\Mp{A}\\ -24\\cdot 3 - 12\\cdot 9 + B_y\\cdot 12 = 0\\ \\Rightarrow\\ B_y = \\frac{72 + 108}{12} = 15{,}00\\ \\text{kN}"}</MB>
        </Lepes>
        <Lepes cim="Egész szerkezet: nyomatéki egyenlet B-re → A_y">
          <p><M>{"F"}</M> most a ponttól 3 m-re balra hat lefelé (pozitív), <M>{"R"}</M> ugyanúgy negatív, <M>{"A_y"}</M> karja 12 m:</p>
          <MB>{"\\Sigma:\\ \\Mp{B}\\ -24\\cdot 3 + 12\\cdot 3 - A_y\\cdot 12 = 0\\ \\Rightarrow\\ A_y = \\frac{-72 + 36}{12} = -3{,}000\\ \\text{kN}"}</MB>
          <p>Negatív: <M>{"A_y"}</M> valójában <strong>lefelé</strong> mutat — a talaj lefelé húzza az <M>{"A"}</M> csuklót (lehorgonyzás kell!).</p>
        </Lepes>
        <Lepes cim="II. test: nyomatéki egyenlet a C csuklóra → B_x">
          <p>
            A II. testre <M>{"F"}</M>, <M>{"B_x"}</M>, <M>{"B_y"}</M> és a csuklóerő hat; <M>{"C"}</M>-re a csuklóerő kiesik. A <M>{"B"}</M> pont <M>{"C"}</M>-hez képest <M>{"(6;\\ -6)"}</M>: a felfelé mutató{" "}
            <M>{"B_y"}</M> karja 6 m (pozitív), a jobbra mutató <M>{"B_x"}</M> a pont alatt 6 m-rel szintén pozitívan forgat; <M>{"F"}</M> 3 m-re jobbra lefelé (negatív):
          </p>
          <MB>{"\\text{II:}\\ \\Mp{C}\\ 15\\cdot 6 + B_x\\cdot 6 - 12\\cdot 3 = 0\\ \\Rightarrow\\ B_x = \\frac{36 - 90}{6} = -9{,}000\\ \\text{kN}"}</MB>
          <p>Negatív: <M>{"B_x"}</M> <strong>balra</strong> mutat.</p>
        </Lepes>
        <Lepes cim="Vetületi egyenletek → A_x, majd C_x és C_y">
          <MB>{"\\Sigma:\\ \\Fx\\ 24 + A_x + B_x = 0\\ \\Rightarrow\\ A_x = -24 + 9 = -15{,}00\\ \\text{kN}"}</MB>
          <MB>{"\\text{II:}\\ \\Fx\\ C_x + B_x = 0\\ \\Rightarrow\\ C_x = 9{,}000\\ \\text{kN}\\qquad \\text{II:}\\ \\Fy\\ C_y + 15 - 12 = 0\\ \\Rightarrow\\ C_y = -3{,}000\\ \\text{kN}"}</MB>
          <p>A II. testre a csuklóerő 9 kN jobbra és 3 kN lefelé; az I. testre 9 kN balra és 3 kN felfelé.</p>
        </Lepes>
        <Lepes cim="Ellenőrzés — nyomatéki egyenlet a C csuklóra az I. testre">
          <p>Egy eddig nem használt egyenlet: <M>{"A"}</M> a <M>{"C"}</M>-hez képest <M>{"(-6;\\ -6)"}</M>, <M>{"R"}</M> pedig <M>{"(-6;\\ -3)"}</M>:</p>
          <MB>{"\\text{I:}\\ \\Mp{C}\\ (-6)(-3) - (-6)(-15) - (-3)(24) = 18 - 90 + 72 = 0\\ \\checkmark"}</MB>
        </Lepes>
        <Lepes cim="Eredményvázlat">
          <p>
            <M>{"A_x = 15{,}00\\ \\text{kN}"}</M> <strong>balra</strong>, <M>{"A_y = 3{,}000\\ \\text{kN}"}</M> <strong>lefelé</strong>; <M>{"B_x = 9{,}000\\ \\text{kN}"}</M> <strong>balra</strong>,{" "}
            <M>{"B_y = 15{,}00\\ \\text{kN}"}</M> felfelé; a csuklóban <M>{"C_x = 9{,}000"}</M>, <M>{"C_y = 3{,}000\\ \\text{kN}"}</M>. Ránézésre: 24 jobbra – (15 + 9) balra; 15 fel – (12 + 3) le. A két
            támasz együtt tartja vissza a 24 kN-os oldalnyomást.
          </p>
        </Lepes>
      </KidolgozottFeladat>
      <FilmCim>Ugyanez filmen – az egész szerkezet segít ki, aztán jön a csukló</FilmCim>
      <FilmGyf2 />

      {/* ==================== GYF‑3 ==================== */}
      <KidolgozottFeladat
        jel="GYF‑3"
        ido="7 perc"
        forras="H05 szintemelő, 3. feladat (tankönyv 5.5. ábra)"
        cim="Gerber-tartó befogással — most a bal oldal a befüggesztett rész"
        feladat={
          <p>
            A <M>{"7a"}</M> hosszú gerenda bal végét (<M>{"P"}</M>) a vízszintessel <M>{"\\alpha"}</M> szöget bezáró, balra-felfelé húzó <M>{"F"}</M> erő terheli. Az <M>{"A"}</M> görgő <M>{"a"}</M>-ra, a{" "}
            <M>{"C"}</M> belső csukló <M>{"5a"}</M>-ra van a bal végtől, a jobb vég (<M>{"B"}</M>) mereven befogott. Határozd meg a külső és belső reakciókat!{" "}
            <M>{"a = 2\\ \\text{m},\\ F = 12\\ \\text{kN},\\ \\alpha = 30^\\circ"}</M>.
          </p>
        }
        abra={
          <AbraKeret cim="Az I. test (P–C) görgővel és belső csuklóval: 1 + 2 = 3 ismeretlen → befüggesztett. A II. test (C–B) a befogással önmagában is tartó: fix rész.">
            <AbraGyf3 />
          </AbraKeret>
        }
        tanulsag={
          <p>
            Ugyanaz a recept, mint a GYF‑1-ben, csak tükrözve: a befüggesztett rész most a <em>bal</em> oldalon van, mert a befogás egyedül is három ismeretlent hoz. A befogott fix részre a csuklóerő
            ellentettje kerül teherként, és a befogás reakciói két vetületi és egy nyomatéki egyenletből jönnek. Figyeld a negatív <M>{"A"}</M>-t: a felfelé húzó erő a görgőt <em>felemelné</em> — a valóságban
            egy görgő ezt nem tudja, a feladat szintjén viszont az előjel az üzenet.
          </p>
        }
      >
        <Lepes cim="Elkülönítés">
          <p>
            Az <M>{"F"}</M> komponensei: <M>{"12\\cos 30^\\circ = 10{,}39\\ \\text{kN}"}</M> balra, <M>{"12\\sin 30^\\circ = 6{,}000\\ \\text{kN}"}</M> felfelé. Az I. testre: <M>{"A"}</M> (felfelé), a{" "}
            <M>{"C"}</M>-ben <M>{"C_x"}</M> (jobbra) és <M>{"C_y"}</M> (felfelé). A II. testre: <M>{"C'_x, C'_y"}</M> (az ellentettek), a befogásban <M>{"B_x, B_y, M_B"}</M>. Számlálás: 6 ismeretlen, 6
            egyenlet ✓.
          </p>
        </Lepes>
        <Lepes cim="Egyensúlyi kijelentések">
          <MB>{"\\text{I:}\\ (\\underline{F}, \\underline{A}, \\underline{C}_x, \\underline{C}_y) \\ekv \\underline{O}\\qquad \\text{II:}\\ (\\underline{C}'_x, \\underline{C}'_y, \\underline{B}_x, \\underline{B}_y, M_B) \\ekv \\underline{O}"}</MB>
          <p>Az I. kijelentésben három ismeretlen: vele kezdünk.</p>
        </Lepes>
        <Lepes cim="I. test: nyomatéki egyenlet a C csuklóra → A">
          <p><M>{"C"}</M>-re a csuklóerő kiesik; <M>{"F"}</M> függőleges komponense 10 m-re balra felfelé hat (negatív), a vízszintes komponens a tengelyben; <M>{"A"}</M> 8 m-re balra felfelé (negatív):</p>
          <MB>{"\\text{I:}\\ \\Mp{C}\\ -6{,}000\\cdot 10 - A\\cdot 8 = 0\\ \\Rightarrow\\ A = -7{,}500\\ \\text{kN}"}</MB>
          <p>Negatív: a görgőnek <strong>lefelé</strong> kellene tartania a gerendát.</p>
        </Lepes>
        <Lepes cim="I. test: nyomatéki egyenlet A-ra → C_y, vízszintes vetület → C_x">
          <MB>{"\\text{I:}\\ \\Mp{A}\\ -6{,}000\\cdot 2 + C_y\\cdot 8 = 0\\ \\Rightarrow\\ C_y = 1{,}500\\ \\text{kN}"}</MB>
          <MB>{"\\text{I:}\\ \\Fx\\ -10{,}39 + C_x = 0\\ \\Rightarrow\\ C_x = 10{,}39\\ \\text{kN}"}</MB>
          <p>A csukló az I. testet 10,39 kN-nal jobbra húzza és 1,5 kN-nal felfelé tartja. A II. testre az ellentett: 10,39 kN balra, 1,5 kN lefelé a <M>{"C"}</M> pontban.</p>
        </Lepes>
        <Lepes cim="II. test: két vetületi egyenlet → B_x, B_y; nyomatéki egyenlet B-re → M_B">
          <MB>{"\\text{II:}\\ \\Fx\\ -10{,}39 + B_x = 0\\ \\Rightarrow\\ B_x = 10{,}39\\ \\text{kN}\\qquad \\Fy\\ -1{,}500 + B_y = 0\\ \\Rightarrow\\ B_y = 1{,}500\\ \\text{kN}"}</MB>
          <p>A <M>{"B"}</M>-re a lefelé ható 1,5 kN 4 m-re balra van, pozitívan forgat:</p>
          <MB>{"\\text{II:}\\ \\Mp{B}\\ 1{,}500\\cdot 4 + M_B = 0\\ \\Rightarrow\\ M_B = -6{,}000\\ \\text{kNm}"}</MB>
          <p>Negatív: a befogási nyomaték az <strong>óramutató járásával egyezően</strong> forgat.</p>
        </Lepes>
        <Lepes cim="Ellenőrzés — nyomatéki egyenlet B-re az egész szerkezetre">
          <p>A csuklóerő nem szerepel benne. <M>{"F"}</M> függőleges komponense 14 m-re balra felfelé (negatív), <M>{"A"}</M> 12 m-re balra (a negatív érték lefelé mutat: pozitív forgatás):</p>
          <MB>{"\\Sigma:\\ \\Mp{B}\\ -6{,}000\\cdot 14 - (-7{,}500)\\cdot 12 + M_B = -84 + 90 - 6 = 0\\ \\checkmark"}</MB>
        </Lepes>
        <Lepes cim="Eredményvázlat">
          <p>
            <M>{"A = 7{,}500\\ \\text{kN}"}</M> <strong>lefelé</strong>; <M>{"B_x = 10{,}39\\ \\text{kN}"}</M> jobbra, <M>{"B_y = 1{,}500\\ \\text{kN}"}</M> felfelé, <M>{"M_B = 6{,}000\\ \\text{kNm}"}</M>{" "}
            az óramutató járásával egyezően; a csuklóban <M>{"C_x = 10{,}39"}</M>, <M>{"C_y = 1{,}500\\ \\text{kN}"}</M>. Ránézésre: 10,39 balra – 10,39 jobbra; 6 + 1,5 fel – 7,5 le.
          </p>
        </Lepes>
      </KidolgozottFeladat>

      {/* ==================== GYF‑4 ==================== */}
      <KidolgozottFeladat
        jel="GYF‑4"
        ido="9 perc"
        forras="Tankönyv 5.9. ábra, számokkal"
        cim="Csuklóján terhelt Gerber-tartó — a csuklót is el kell különíteni"
        feladat={
          <p>
            A GYF‑1 tartója (<M>{"A"}</M> csukló 0, <M>{"B"}</M> görgő 4 m, <M>{"C"}</M> csukló 6 m, <M>{"D"}</M> görgő 9 m), de most a <M>{"C"}</M> csuklót közvetlenül is terheli egy{" "}
            <M>{"F_2 = 10\\ \\text{kN}"}</M> függőleges erő. További terhek: <M>{"F_1 = 12\\ \\text{kN}"}</M> (60°, jobbra-lefelé) az <M>{"x = 2"}</M> m helyen és <M>{"F_3 = 6\\ \\text{kN}"}</M> az{" "}
            <M>{"x = 8"}</M> m helyen. Határozd meg a reakciókat és a két testre ható csuklóerőket!
          </p>
        }
        abra={
          <AbraKeret cim="A terhelt csuklóra három erő hat: F₂ és a két testről érkező csuklóerők ellentettjei. Ezek most nem egymás ellentettjei!">
            <AbraGyf4 />
          </AbraKeret>
        }
        tanulsag={
          <p>
            Terhelt csuklónál a hallgató leggyakoribb hibája, hogy a terhet „odaadja” valamelyik testnek, és a két csuklóerőt továbbra is ellentettnek veszi. A tiszta megoldás: a csukló egy külön
            (pontszerű) test, közös metszéspontú erőrendszerrel, két vetületi egyenlettel. A sorrend: befüggesztett rész → csukló → fix rész. Az egészre írt ΣF<sub>y</sub> ellenőrzésben a csuklóerők
            kiesnek, de az <M>{"F_2"}</M> teher benne marad!
          </p>
        }
      >
        <Lepes cim="Elkülönítés — három „test”: I, II és a C csukló">
          <p>
            A II. testre <M>{"C_{IIx}, C_{IIy}"}</M>, az I. testre <M>{"C_{Ix}, C_{Iy}"}</M> hat (mindkettőt jobbra és felfelé vesszük fel). A csuklóra az <M>{"F_2"}</M> és a két csuklóerő ellentettje:{" "}
            <M>{"C'_{I} = -C_I"}</M>, <M>{"C'_{II} = -C_{II}"}</M>. Ismeretlenek: <M>{"A_x, A_y, B, D"}</M> + 4 csuklóerő-komponens = 8; egyenletek: 3 + 3 + 2 (a csukló) = 8 ✓.
          </p>
        </Lepes>
        <Lepes cim="Egyensúlyi kijelentések">
          <MB>{"\\text{II:}\\ (\\underline{F}_3, \\underline{D}, \\underline{C}_{IIx}, \\underline{C}_{IIy}) \\ekv \\underline{O}\\qquad \\text{C:}\\ (\\underline{F}_2, \\underline{C}'_{I}, \\underline{C}'_{II}) \\ekv \\underline{O}"}</MB>
          <MB>{"\\text{I:}\\ (\\underline{F}_1, \\underline{A}_x, \\underline{A}_y, \\underline{B}, \\underline{C}_{Ix}, \\underline{C}_{Iy}) \\ekv \\underline{O}\\qquad \\Sigma:\\ (\\underline{F}_1, \\underline{F}_2, \\underline{F}_3, \\underline{A}_x, \\underline{A}_y, \\underline{B}, \\underline{D}) \\ekv \\underline{O}"}</MB>
        </Lepes>
        <Lepes cim="II. test (befüggesztett): ΣM_C → D, ΣM_D → C_IIy, ΣF_x → C_IIx">
          <MB>{"\\text{II:}\\ \\Mp{C}\\ -6\\cdot 2 + D\\cdot 3 = 0\\ \\Rightarrow\\ D = 4{,}000\\ \\text{kN}"}</MB>
          <MB>{"\\text{II:}\\ \\Mp{D}\\ 6\\cdot 1 - C_{IIy}\\cdot 3 = 0\\ \\Rightarrow\\ C_{IIy} = 2{,}000\\ \\text{kN}\\qquad \\Fx\\ C_{IIx} = 0"}</MB>
        </Lepes>
        <Lepes cim="A C csukló egyensúlya → C_I">
          <p>A csuklóra <M>{"F_2"}</M> lefelé, <M>{"C'_{II}"}</M> = a II. testre ható erő ellentettje (2 kN lefelé), és <M>{"C'_I"}</M> hat:</p>
          <MB>{"\\text{C:}\\ \\Fx\\ -C_{Ix} - C_{IIx} = 0\\ \\Rightarrow\\ C_{Ix} = 0\\qquad \\Fy\\ -10 - C_{Iy} - 2{,}000 = 0\\ \\Rightarrow\\ C_{Iy} = -12{,}00\\ \\text{kN}"}</MB>
          <p>Az I. testre tehát a <M>{"C"}</M> pontban <strong>12 kN lefelé</strong> hat: a csuklón lévő 10 kN és a befüggesztett részről érkező 2 kN együtt.</p>
        </Lepes>
        <Lepes cim="I. test (fix rész): ΣM_A → B, ΣM_B → A_y, ΣF_x → A_x">
          <MB>{"\\text{I:}\\ \\Mp{A}\\ -10{,}39\\cdot 2 - 12\\cdot 6 + B\\cdot 4 = 0\\ \\Rightarrow\\ B = \\frac{20{,}78 + 72}{4} = 23{,}20\\ \\text{kN}"}</MB>
          <MB>{"\\text{I:}\\ \\Mp{B}\\ 10{,}39\\cdot 2 - 12\\cdot 2 - A_y\\cdot 4 = 0\\ \\Rightarrow\\ A_y = \\frac{20{,}78 - 24}{4} = -0{,}8038\\ \\text{kN}"}</MB>
          <MB>{"\\text{I:}\\ \\Fx\\ 6{,}000 + A_x = 0\\ \\Rightarrow\\ A_x = -6{,}000\\ \\text{kN}"}</MB>
          <p><M>{"A_y"}</M> kicsit negatív: a <M>{"C"}</M>-nél lógó nagy teher a <M>{"B"}</M> körül éppen felbillenti a gerendát, az <M>{"A"}</M> csuklónak lefelé kell tartania.</p>
        </Lepes>
        <Lepes cim="Ellenőrzés — függőleges vetület az egész szerkezetre">
          <MB>{"\\Sigma:\\ \\Fy\\ -0{,}8038 + 23{,}20 + 4{,}000 - 10{,}39 - 10 - 6 = 26{,}39 - 26{,}39 = 0{,}00\\ \\checkmark"}</MB>
        </Lepes>
        <Lepes cim="Eredményvázlat">
          <p>
            <M>{"A_x = 6{,}000\\ \\text{kN}"}</M> balra, <M>{"A_y = 0{,}8038\\ \\text{kN}"}</M> <strong>lefelé</strong>, <M>{"B = 23{,}20\\ \\text{kN}"}</M> felfelé, <M>{"D = 4{,}000\\ \\text{kN}"}</M>{" "}
            felfelé. A csuklóban: a II. testre 2 kN felfelé, az I. testre 12 kN lefelé; a csuklón: 10 kN teher + 2 kN (II-től) lefelé = 12 kN, amit az I. test tart. Nyolc új szám.
          </p>
        </Lepes>
      </KidolgozottFeladat>
      <FilmCim>Ugyanez filmen – a csukló mint külön test</FilmCim>
      <FilmGyf4 />

      {/* ==================== GYF‑5 ==================== */}
      <KidolgozottFeladat
        jel="GYF‑5"
        ido="8 perc"
        forras="H06 szintemelő, 5–6. feladat"
        cim="Két rúddal tartott, terhelt csukló — rúderők és a gerenda reakciói"
        feladat={
          <p>
            A <M>{"7a"}</M> hosszú gerendát az <M>{"A"}</M> görgő (<M>{"a"}</M>-nál) és a <M>{"B"}</M> csukló (a jobb végen) támasztja. Az <M>{"E"}</M> pontból (<M>{"4a"}</M>) <M>{"3a"}</M> magas
            oszlop áll mereven a gerendán, teteje <M>{"C"}</M>. A <M>{"D"}</M> csukló a gerenda bal vége fölött <M>{"3a"}</M> magasan van; a <M>{"D"}</M>–<M>{"C"}</M> vízszintes és a <M>{"D"}</M>–<M>{"E"}</M>{" "}
            ferde rúd tartja. A <M>{"D"}</M> csuklót függőleges <M>{"F"}</M> erő terheli. Végezd el az elkülönítést, írd fel a kijelentéseket, és számítsd ki a rúderőket és a reakciókat!{" "}
            <M>{"a = 2\\ \\text{m},\\ F = 12\\ \\text{kN}"}</M>.
          </p>
        }
        abra={
          <AbraKeret cim="A gerenda és az E–C oszlop egy merev test (I). A DC és DE rudakra csak a végükön hat erő: rúdként kezeljük. A D csuklóra három erő hat: F, S_DC, S_DE. A DE rúd 3-4-5-ös: hossza 5a = 10 m.">
            <AbraGyf5 />
          </AbraKeret>
        }
        tanulsag={
          <p>
            A tankönyv 5.1.2 szerint a rudat nem kell elkülöníteni (két erő hat rá, ezek közös hatásvonalúak), de a csuklót igen, ha <strong>több mint két erő</strong> hat rá. A <M>{"D"}</M> csukló
            közös metszéspontú erőrendszere két vetületi egyenletet ad — pont a két rúderőre. A gerenda reakcióihoz pedig elég az egész szerkezet: a rúderők belső erők, kiesnek, csak <M>{"F"}</M> marad.
            A nyomott <M>{"DE"}</M> rúd (<M>{"S_{DE} < 0"}</M>) támasztórúdként, a húzott <M>{"DC"}</M> függesztőrúdként dolgozik.
          </p>
        }
      >
        <Lepes cim="Elkülönítés és kijelentések">
          <p>
            Testek: I (gerenda + oszlop), a <M>{"DC"}</M> és <M>{"DE"}</M> rúd (rúderők <M>{"S_{DC}, S_{DE}"}</M>, húzottnak felvéve: a <M>{"D"}</M>-ből a másik vég felé), és a <M>{"D"}</M> csukló.
            Külső reakciók: <M>{"A"}</M> (felfelé), <M>{"B_x, B_y"}</M>. A <M>{"DE"}</M> rúd egységvektora <M>{"D"}</M>-ből <M>{"E"}</M> felé: <M>{"(8;\\ -6)/10 = (0{,}8;\\ -0{,}6)"}</M>.
          </p>
          <MB>{"\\text{D:}\\ (\\underline{F}, \\underline{S}_{DC}, \\underline{S}_{DE}) \\ekv \\underline{O}\\qquad \\text{I:}\\ (\\underline{S}'_{DC}, \\underline{S}'_{DE}, \\underline{A}, \\underline{B}_x, \\underline{B}_y) \\ekv \\underline{O}\\qquad \\Sigma:\\ (\\underline{F}, \\underline{A}, \\underline{B}_x, \\underline{B}_y) \\ekv \\underline{O}"}</MB>
          <p>Ismeretlen: 5 (<M>{"A, B_x, B_y, S_{DC}, S_{DE}"}</M>); egyenlet: 3 (I) + 2 (D csukló) = 5 ✓.</p>
        </Lepes>
        <Lepes cim="A D csukló: függőleges vetület → S_DE, vízszintes vetület → S_DC">
          <MB>{"\\text{D:}\\ \\Fy\\ -12 - 0{,}6\\,S_{DE} = 0\\ \\Rightarrow\\ S_{DE} = -20{,}00\\ \\text{kN}"}</MB>
          <MB>{"\\text{D:}\\ \\Fx\\ S_{DC} + 0{,}8\\,S_{DE} = 0\\ \\Rightarrow\\ S_{DC} = -0{,}8\\cdot(-20) = 16{,}00\\ \\text{kN}"}</MB>
          <p>A ferde rúd <strong>nyomott</strong> (20 kN), a vízszintes rúd <strong>húzott</strong> (16 kN).</p>
        </Lepes>
        <Lepes cim="Az egész szerkezet: nyomatéki egyenlet B-re → A">
          <p>Kívülről csak <M>{"F"}</M> hat, a <M>{"D"}</M> pontban, <M>{"B"}</M>-től 14 m-re balra lefelé (pozitív forgatás); <M>{"A"}</M> 12 m-re balra felfelé (negatív):</p>
          <MB>{"\\Sigma:\\ \\Mp{B}\\ 12\\cdot 14 - A\\cdot 12 = 0\\ \\Rightarrow\\ A = 14{,}00\\ \\text{kN}"}</MB>
        </Lepes>
        <Lepes cim="Vetületi egyenletek az egészre → B_y, B_x">
          <MB>{"\\Sigma:\\ \\Fy\\ 14 + B_y - 12 = 0\\ \\Rightarrow\\ B_y = -2{,}000\\ \\text{kN}\\qquad \\Fx\\ B_x = 0"}</MB>
          <p>Negatív <M>{"B_y"}</M>: a jobb csukló <strong>lefelé</strong> tartja a gerendát — a teher az <M>{"A"}</M>-tól balra lóg, a gerenda az <M>{"A"}</M> körül billenne fel.</p>
        </Lepes>
        <Lepes cim="Ellenőrzés — az I. test nyomatéki egyenlete E-re, a rúderőkkel">
          <p>
            Az I. testre a rudak a <M>{"C"}</M> és az <M>{"E"}</M> pontban hatnak: <M>{"C"}</M>-ben 16 kN balra (a <M>{"DC"}</M> rúd <M>{"D"}</M> felé húz), <M>{"E"}</M>-ben a nyomott rúd 16 kN jobbra és
            12 kN lefelé nyom. <M>{"E"}</M>-re nézve az <M>{"E"}</M>-beli erők karja nulla; a <M>{"C"}</M>-beli 16 kN 6 m-rel a pont fölött balra hat (pozitív); <M>{"A"}</M> 6 m-re balra felfelé
            (negatív); <M>{"B_y"}</M> 6 m-re jobbra:
          </p>
          <MB>{"\\text{I:}\\ \\Mp{E}\\ 16\\cdot 6 - 14\\cdot 6 + (-2)\\cdot 6 = 96 - 84 - 12 = 0\\ \\checkmark"}</MB>
        </Lepes>
        <Lepes cim="Eredményvázlat">
          <p>
            <M>{"S_{DC} = 16{,}00\\ \\text{kN}"}</M> húzott, <M>{"S_{DE} = 20{,}00\\ \\text{kN}"}</M> nyomott; <M>{"A = 14{,}00\\ \\text{kN}"}</M> felfelé, <M>{"B_y = 2{,}000\\ \\text{kN}"}</M>{" "}
            <strong>lefelé</strong>, <M>{"B_x = 0"}</M>. Ránézésre: a 12 kN-t az <M>{"A"}</M> 14 kN-ja tartja, a fölös 2 kN-t a <M>{"B"}</M> húzza vissza.
          </p>
        </Lepes>
      </KidolgozottFeladat>

      {/* ==================== GYF‑6 ==================== */}
      <KidolgozottFeladat
        jel="GYF‑6"
        ido="10 perc"
        forras="Tankönyv 5.13. ábra, számokkal"
        cim="Függesztőműves tartó — test + csukló összevonása"
        feladat={
          <p>
            A 8 m-es gerendát az <M>{"A"}</M> csukló és a <M>{"B"}</M> görgő támasztja, a közepén (<M>{"C"}</M>, 4 m) belső csukló szakítja meg. A függesztőmű: <M>{"D(2;\\ 2)"}</M> és{" "}
            <M>{"E(6;\\ 2)"}</M> csuklók, rudak: <M>{"S_1"}</M> (<M>{"A"}</M>–<M>{"D"}</M>), <M>{"S_2"}</M> (<M>{"D"}</M>–<M>{"P"}</M>, függőleges), <M>{"S_3"}</M> (<M>{"D"}</M>–<M>{"E"}</M>),{" "}
            <M>{"S_4"}</M> (<M>{"E"}</M>–<M>{"Q"}</M>, függőleges), <M>{"S_5"}</M> (<M>{"E"}</M>–<M>{"B"}</M>). Terhek: <M>{"F_1 = 12\\ \\text{kN}"}</M> az <M>{"x = 3"}</M> m, <M>{"F_2 = 8\\ \\text{kN}"}</M>{" "}
            az <M>{"x = 5"}</M> m helyen. Határozd meg a reakciókat, a csuklóerőt és az öt rúderőt!
          </p>
        }
        abra={
          <AbraKeret cim="Gerenda + csukló önmagában mechanizmus lenne (a fix rész megtámasztása hiányos); a függesztőmű rúdjai teszik tartóvá. A D és E csuklóra három-három erő hat.">
            <AbraGyf6 />
          </AbraKeret>
        }
        tanulsag={
          <p>
            A tankönyv trükkje az <strong>összevonás</strong>: az I. testet és a <M>{"D"}</M> csuklót együtt különítjük el (5.13.c ábra), így a rajta átmenő <M>{"S_1, S_2"}</M> belső erővé válik és
            kiesik — marad egy egyszerű tartó képe <M>{"A, C, S_3"}</M> ismeretlenekkel. Utána a csuklók vetületi egyenletei adják a többi rúderőt. A felső öv (<M>{"S_3"}</M>) és a ferde rudak nyomottak,
            a függőlegesek húzottak: a függesztőmű „felakasztja” a gerendát a ferde rudakra.
          </p>
        }
      >
        <Lepes cim="Elkülönítés és számlálás">
          <p>
            Testek: I (<M>{"A"}</M>–<M>{"C"}</M>), II (<M>{"C"}</M>–<M>{"B"}</M>), a <M>{"D"}</M> és <M>{"E"}</M> csukló; a rudakat nem kell. Ismeretlen: <M>{"A_x, A_y, B, C_x, C_y, S_1 \\ldots S_5"}</M>{" "}
            = 10; egyenlet: 3 + 3 + 2 + 2 = 10 ✓. A rúderőket húzottnak vesszük fel. <M>{"S_1"}</M> egységvektora <M>{"D"}</M>-ből <M>{"A"}</M> felé: <M>{"(-0{,}7071;\\ -0{,}7071)"}</M>; <M>{"S_5"}</M>-é{" "}
            <M>{"E"}</M>-ből <M>{"B"}</M> felé: <M>{"(0{,}7071;\\ -0{,}7071)"}</M>.
          </p>
          <MB>{"\\Sigma:\\ (\\underline{F}_1, \\underline{F}_2, \\underline{A}, \\underline{B}) \\ekv \\underline{O}\\qquad \\text{I+D:}\\ (\\underline{F}_1, \\underline{A}, \\underline{S}_3, \\underline{C}) \\ekv \\underline{O}\\qquad \\text{D:}\\ (\\underline{S}_1, \\underline{S}_2, \\underline{S}_3) \\ekv \\underline{O}"}</MB>
        </Lepes>
        <Lepes cim="Az egész szerkezet: ΣM_A → B, ΣM_B → A_y, ΣF_x → A_x">
          <MB>{"\\Sigma:\\ \\Mp{A}\\ -12\\cdot 3 - 8\\cdot 5 + B\\cdot 8 = 0\\ \\Rightarrow\\ B = 9{,}500\\ \\text{kN}"}</MB>
          <MB>{"\\Sigma:\\ \\Mp{B}\\ 12\\cdot 5 + 8\\cdot 3 - A_y\\cdot 8 = 0\\ \\Rightarrow\\ A_y = 10{,}50\\ \\text{kN}\\qquad \\Fx\\ A_x = 0"}</MB>
        </Lepes>
        <Lepes cim="I. test + D csukló együtt: ΣM_C → S₃">
          <p>
            Az összevont testre <M>{"A"}</M>, <M>{"F_1"}</M>, a <M>{"D"}</M>-ben ható vízszintes <M>{"S_3"}</M> (jobbra, <M>{"E"}</M> felé) és a <M>{"C"}</M>-beli csuklóerő hat. <M>{"C"}</M>-re: <M>{"A_y"}</M>{" "}
            karja 4 m (balra felfelé: negatív), <M>{"F_1"}</M> 1 m-re balra lefelé (pozitív), <M>{"S_3"}</M> 2 m-rel a pont fölött jobbra (negatív):
          </p>
          <MB>{"\\text{I+D:}\\ \\Mp{C}\\ -10{,}5\\cdot 4 + 12\\cdot 1 - S_3\\cdot 2 = 0\\ \\Rightarrow\\ S_3 = -15{,}00\\ \\text{kN}"}</MB>
          <p>Nyomott felső öv.</p>
        </Lepes>
        <Lepes cim="I. test + D: vetületi egyenletek → C_x, C_y">
          <MB>{"\\text{I+D:}\\ \\Fx\\ 0 + S_3 + C_x = 0\\ \\Rightarrow\\ C_x = 15{,}00\\ \\text{kN}\\qquad \\Fy\\ 10{,}5 - 12 + C_y = 0\\ \\Rightarrow\\ C_y = 1{,}500\\ \\text{kN}"}</MB>
          <p>(Az I. testre ható értékek; a II. testre az ellentettek: 15 kN balra, 1,5 kN lefelé.)</p>
        </Lepes>
        <Lepes cim="A D csukló → S₁, S₂; az E csukló → S₅, S₄">
          <MB>{"\\text{D:}\\ \\Fx\\ -0{,}7071\\,S_1 + S_3 = 0\\ \\Rightarrow\\ S_1 = \\frac{-15}{0{,}7071} = -21{,}21\\ \\text{kN}\\qquad \\Fy\\ -0{,}7071\\,S_1 - S_2 = 0\\ \\Rightarrow\\ S_2 = 15{,}00\\ \\text{kN}"}</MB>
          <p>Az <M>{"E"}</M>-re az <M>{"S_3"}</M> rúd a <M>{"D"}</M> felé húz: <M>{"-S_3 = +15"}</M> kN jobbra… azaz a nyomott rúd 15 kN-nal <em>tolja</em> az <M>{"E"}</M> csuklót jobbra:</p>
          <MB>{"\\text{E:}\\ \\Fx\\ 15 + 0{,}7071\\,S_5 = 0\\ \\Rightarrow\\ S_5 = -21{,}21\\ \\text{kN}\\qquad \\Fy\\ -S_4 - 0{,}7071\\,S_5 = 0\\ \\Rightarrow\\ S_4 = 15{,}00\\ \\text{kN}"}</MB>
        </Lepes>
        <Lepes cim="Ellenőrzés — a II. test + E csukló nyomatéki egyenlete C-re">
          <p><M>{"F_2"}</M> 1 m-re jobbra lefelé (negatív), <M>{"B"}</M> 4 m-re (pozitív), az <M>{"E"}</M>-ben ható 15 kN jobbra a pont fölött 2 m-rel (negatív):</p>
          <MB>{"\\text{II+E:}\\ \\Mp{C}\\ -8\\cdot 1 + 9{,}5\\cdot 4 - 15\\cdot 2 = -8 + 38 - 30 = 0\\ \\checkmark"}</MB>
        </Lepes>
        <Lepes cim="Eredményvázlat">
          <p>
            <M>{"A_y = 10{,}50"}</M>, <M>{"B = 9{,}500\\ \\text{kN}"}</M> felfelé, <M>{"A_x = 0"}</M>; <M>{"C_x = 15{,}00"}</M>, <M>{"C_y = 1{,}500\\ \\text{kN}"}</M>; rúderők:{" "}
            <M>{"S_1 = S_5 = 21{,}21\\ \\text{kN}"}</M> nyomott, <M>{"S_3 = 15{,}00\\ \\text{kN}"}</M> nyomott, <M>{"S_2 = S_4 = 15{,}00\\ \\text{kN}"}</M> húzott. A gerendában a <M>{"C_x"}</M> = 15 kN
            húzó normálerő az alsó öv szerepét játssza.
          </p>
        </Lepes>
      </KidolgozottFeladat>
    </>
  );
}
