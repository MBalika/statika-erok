import { AbraKeret } from "@/components/ui/Elemek";
import { M, MB } from "@/components/ui/Keplet";
import { KidolgozottFeladat, Lepes } from "@/components/KidolgozottFeladat";
import { AbraGyf1, AbraGyf2, AbraGyf3, AbraGyf4, AbraGyf5, AbraGyf6 } from "@/components/tartok/FeladatAbrak";
import FilmGyf1 from "@/components/tartok/FilmGyf1";
import FilmGyf2 from "@/components/tartok/FilmGyf2";
import FilmGyf3 from "@/components/tartok/FilmGyf3";
import FilmGyf4 from "@/components/tartok/FilmGyf4";
import FilmGyf5 from "@/components/tartok/FilmGyf5";
import FilmGyf6 from "@/components/tartok/FilmGyf6";

/**
 * Az 5. modul kidolgozott feladatai (GYF‑1…GYF‑6) a H03 és H04 szintemelő
 * feladatsorokból, számokkal – mindegyik a tankönyv 4.2. receptjét követi:
 * elkülönítés → egyensúlyi kijelentés → egyismeretlenes egyenletek →
 * ellenőrzés → eredményvázlat. Minden feladat után a film ugyanezt mutatja.
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
        ido="6 perc"
        forras="H03 szintemelő, 3. feladat"
        cim="Befogott konzol ferde erővel és koncentrált nyomatékkal"
        feladat={
          <p>
            A bal végén befogott, <M>{"3a"}</M> hosszú gerendát az <M>{"x = a"}</M> helyen a vízszintessel <M>{"\\alpha_1"}</M> szöget bezáró,
            jobbra-lefelé mutató <M>{"F_1"}</M> erő, az <M>{"x = 2a"}</M> helyen az óramutató járásával megegyező értelmű <M>{"M"}</M> koncentrált
            nyomaték, a szabad végén pedig a függőleges <M>{"F_2"}</M> erő terheli. Határozd meg a befogás reakcióit!{" "}
            <M>{"a = 2\\ \\text{m},\\ F_1 = 10\\ \\text{kN},\\ \\alpha_1 = 60^\\circ,\\ M = 8\\ \\text{kNm},\\ F_2 = 6\\ \\text{kN}"}</M>.
          </p>
        }
        abra={
          <AbraKeret cim="A feladatlap rajza. Az M nyíl a rajzon az óramutató járásával egyezően forog, ezért a nyomatéki egyenletben negatív előjellel szerepel.">
            <AbraGyf1 />
          </AbraKeret>
        }
        tanulsag={
          <p>
            Befogásnál a két vetületi egyenlet azonnal a két erőkomponenst adja, a befogás pontjára írt nyomatéki egyenletben pedig egyedül{" "}
            <M>{"M_A"}</M> marad — ezért itt nincs mit ügyeskedni a főponttal. Az ellenőrzés viszont csak nyomatéki lehet (a vetületieket
            elhasználtuk), és <strong>minden</strong> tagot bele kell írni: a befogási nyomaték pontra nem érzékeny, a már kiszámolt{" "}
            <M>{"A_y"}</M> viszont a <M>{"B"}</M>-re nézve <M>{"3a"}</M> karral forgat. A negatív <M>{"A_x"}</M> nem hiba: a feltételezett irány
            volt fordított.
          </p>
        }
      >
        <Lepes cim="Elkülönítés — a szabadtest-ábra">
          <p>
            Eltávolítjuk a befogást, és a helyére a három reakciót vesszük fel: <M>{"A_x"}</M> jobbra, <M>{"A_y"}</M> felfelé, a befogási
            nyomaték <M>{"M_A"}</M> az óramutató járásával ellentétesen (pozitívan). Az aktív terhek: <M>{"F_1"}</M> komponensei{" "}
            <M>{"F_1\\cos 60^\\circ = 5{,}000\\ \\text{kN}"}</M> jobbra és <M>{"F_1\\sin 60^\\circ = 8{,}660\\ \\text{kN}"}</M> lefelé, az{" "}
            <M>{"M = 8\\ \\text{kNm}"}</M> nyomaték az óramutató járásával egyezően, <M>{"F_2 = 6\\ \\text{kN}"}</M> lefelé. Három ismeretlen — három
            egyenlet.
          </p>
        </Lepes>
        <Lepes cim="Egyensúlyi kijelentés">
          <MB>{"(\\underline{F}_1, M, \\underline{F}_2, \\underline{A}_x, \\underline{A}_y, M_A) \\ekv \\underline{O}"}</MB>
        </Lepes>
        <Lepes cim="Vízszintes vetületi egyenlet → A_x">
          <p>A függőleges erők és a nyomatékok nem szerepelnek benne, egyedül <M>{"A_x"}</M> ismeretlen:</p>
          <MB>{"\\Fx A_x + 5{,}000 = 0\\ \\Rightarrow\\ A_x = -5{,}000\\ \\text{kN}"}</MB>
          <p>Negatív: <M>{"A_x"}</M> valójában <strong>balra</strong> mutat.</p>
        </Lepes>
        <Lepes cim="Függőleges vetületi egyenlet → A_y">
          <MB>{"\\Fy A_y - 8{,}660 - 6 = 0\\ \\Rightarrow\\ A_y = 14{,}66\\ \\text{kN}"}</MB>
        </Lepes>
        <Lepes cim="Nyomatéki egyenlet az A pontra → M_A">
          <p>
            Az <M>{"A"}</M> pontra írjuk, mert <M>{"A_x"}</M> és <M>{"A_y"}</M> hatásvonala átmegy rajta (karjuk nulla), így csak{" "}
            <M>{"M_A"}</M> marad ismeretlen. <M>{"F_1"}</M> vízszintes komponense a tartó tengelyében hat, karja szintén nulla; a függőleges
            komponens karja <M>{"a = 2\\ \\text{m}"}</M>, <M>{"F_2"}</M> karja <M>{"3a = 6\\ \\text{m}"}</M>, mindkettő az óramutató irányába
            forgat, ahogy az <M>{"M"}</M> is:
          </p>
          <MB>{"\\Mp{A} M_A - 8{,}660\\cdot 2 - 8 - 6\\cdot 6 = 0\\ \\Rightarrow\\ M_A = 61{,}32\\ \\text{kNm}"}</MB>
        </Lepes>
        <Lepes cim="Ellenőrzés — nyomatéki egyenlet a szabad végre (B)">
          <p>
            Egy eddig nem használt egyenlet, amelyben már minden tag ismert. <M>{"B"}</M>-re nézve <M>{"A_y"}</M> karja <M>{"6\\ \\text{m}"}</M>, az{" "}
            <M>{"F_1"}</M> függőleges komponensének karja <M>{"4\\ \\text{m}"}</M> (most az óramutatóval ellentétesen forgat, mert a pont tőle
            jobbra van), <M>{"F_2"}</M> a ponton megy át:
          </p>
          <MB>{"\\Mp{B} 61{,}32 - 14{,}66\\cdot 6 + 8{,}660\\cdot 4 - 8 = 61{,}32 - 87{,}96 + 34{,}64 - 8 = 0{,}00\\ \\checkmark"}</MB>
        </Lepes>
        <Lepes cim="Eredményvázlat">
          <p>
            A tényleges irányokkal és pozitív nagyságokkal: <M>{"A_x = 5{,}000\\ \\text{kN}"}</M> <strong>balra</strong> (a felvett irány fordított
            volt), <M>{"A_y = 14{,}66\\ \\text{kN}"}</M> felfelé, <M>{"M_A = 61{,}32\\ \\text{kNm}"}</M> az óramutató járásával ellentétesen.
            Ránézésre: van jobbra (5 kN) és balra (5 kN) mutató erő, van fel (14,66) és le (8,66 + 6) mutató, és a befogási nyomaték
            ellentétesen forog, mint a terhek — rendben.
          </p>
        </Lepes>
      </KidolgozottFeladat>
      <FilmCim>Ugyanez filmen – a befogás reakcióra cserélése és a három egyenlet</FilmCim>
      <FilmGyf1 />

      {/* ==================== GYF‑2 ==================== */}
      <KidolgozottFeladat
        jel="GYF‑2"
        ido="6 perc"
        forras="H03 szintemelő, 4. feladat"
        cim="Konzolos kéttámaszú tartó — nyomatéki egyenlet a csuklóra, aztán a görgőre"
        feladat={
          <p>
            A <M>{"4a"}</M> hosszú gerendát az <M>{"x = a"}</M> helyen csukló (<M>{"A"}</M>), az <M>{"x = 3a"}</M> helyen vízszintes síkon gördülő
            görgő (<M>{"B"}</M>) támasztja. A bal végén a vízszintessel <M>{"\\alpha_1"}</M> szöget bezáró, a rajz szerint balra-lefelé mutató{" "}
            <M>{"F_1"}</M> erő, a jobb végén a függőleges <M>{"F_2"}</M> erő hat. Határozd meg a reakciókat!{" "}
            <M>{"a = 1{,}5\\ \\text{m},\\ F_1 = 12\\ \\text{kN},\\ \\alpha_1 = 30^\\circ,\\ F_2 = 8\\ \\text{kN}"}</M>.
          </p>
        }
        abra={
          <AbraKeret cim="A feladatlap rajza: mindkét vég túlnyúlik a támaszokon (konzolos tartó). Az F₁ nyíl hegye a gerenda bal végén van, az erő balra-lefelé mutat.">
            <AbraGyf2 />
          </AbraKeret>
        }
        tanulsag={
          <p>
            A kéttámaszú tartó ökölszabálya: <strong>nyomaték a csuklóra</strong> → görgőerő; <strong>nyomaték a görgőre</strong> → a csuklóerő
            függőleges komponense; <strong>vízszintes vetület</strong> → a vízszintes komponens. Így egyik reakció sem épül a másikra, egy
            esetleges hiba nem görög tovább, és a függőleges vetületi egyenlet érintetlenül marad ellenőrzésre. A konzolos túlnyúlás csak a
            karok előjelére figyelmeztet: az <M>{"A"}</M>-tól balra ható lefelé mutató erő az óramutatóval <em>ellentétesen</em> forgat.
          </p>
        }
      >
        <Lepes cim="Elkülönítés — a szabadtest-ábra">
          <p>
            A csukló helyére <M>{"A_x"}</M> (jobbra) és <M>{"A_y"}</M> (felfelé), a görgő helyére a gördülési síkra merőleges, függőleges{" "}
            <M>{"B"}</M> (felfelé) kerül. Az <M>{"F_1"}</M> komponensei: <M>{"F_1\\cos 30^\\circ = 10{,}39\\ \\text{kN}"}</M> balra és{" "}
            <M>{"F_1\\sin 30^\\circ = 6{,}000\\ \\text{kN}"}</M> lefelé; <M>{"F_2 = 8\\ \\text{kN}"}</M> lefelé.
          </p>
        </Lepes>
        <Lepes cim="Egyensúlyi kijelentés">
          <MB>{"(\\underline{F}_1, \\underline{F}_2, \\underline{A}_x, \\underline{A}_y, \\underline{B}) \\ekv \\underline{O}"}</MB>
        </Lepes>
        <Lepes cim="Nyomatéki egyenlet az A csuklóra → B">
          <p>
            Az <M>{"A"}</M> ponton átmegy <M>{"A_x"}</M> és <M>{"A_y"}</M> hatásvonala, csak <M>{"B"}</M> marad. Az <M>{"F_1"}</M> függőleges
            komponense az <M>{"A"}</M>-tól <strong>balra</strong>, <M>{"a = 1{,}5\\ \\text{m}"}</M>-re hat lefelé, ezért az óramutatóval ellentétesen
            forgat (pozitív); a vízszintes komponens a tengelyben hat, karja nulla. <M>{"B"}</M> karja <M>{"2a = 3\\ \\text{m}"}</M>, <M>{"F_2"}</M>-é{" "}
            <M>{"3a = 4{,}5\\ \\text{m}"}</M>:
          </p>
          <MB>{"\\Mp{A} 6{,}000\\cdot 1{,}5 + B\\cdot 3 - 8\\cdot 4{,}5 = 0\\ \\Rightarrow\\ B = \\frac{36 - 9}{3} = 9{,}000\\ \\text{kN}"}</MB>
        </Lepes>
        <Lepes cim="Nyomatéki egyenlet a B görgőre → A_y">
          <p>
            A <M>{"B"}</M> pontra nézve a görgőerő és <M>{"A_x"}</M> karja nulla, egyedül <M>{"A_y"}</M> ismeretlen — így a már kiszámolt{" "}
            <M>{"B"}</M>-t nem is használjuk. Az <M>{"F_1"}</M> függőleges komponensének karja <M>{"3a = 4{,}5\\ \\text{m}"}</M>, <M>{"A_y"}</M>-é{" "}
            <M>{"2a = 3\\ \\text{m}"}</M>, <M>{"F_2"}</M>-é <M>{"a = 1{,}5\\ \\text{m}"}</M>:
          </p>
          <MB>{"\\Mp{B} 6{,}000\\cdot 4{,}5 - A_y\\cdot 3 - 8\\cdot 1{,}5 = 0\\ \\Rightarrow\\ A_y = \\frac{27 - 12}{3} = 5{,}000\\ \\text{kN}"}</MB>
        </Lepes>
        <Lepes cim="Vízszintes vetületi egyenlet → A_x">
          <MB>{"\\Fx -10{,}39 + A_x = 0\\ \\Rightarrow\\ A_x = 10{,}39\\ \\text{kN}"}</MB>
        </Lepes>
        <Lepes cim="Ellenőrzés — függőleges vetületi egyenlet">
          <MB>{"\\Fy -6{,}000 + 5{,}000 + 9{,}000 - 8 = 0{,}000\\ \\checkmark"}</MB>
        </Lepes>
        <Lepes cim="Eredményvázlat">
          <p>
            Mindhárom reakció pozitívra jött ki, a felvett irányok jók: <M>{"A_x = 10{,}39\\ \\text{kN}"}</M> jobbra,{" "}
            <M>{"A_y = 5{,}000\\ \\text{kN}"}</M> felfelé, <M>{"B = 9{,}000\\ \\text{kN}"}</M> felfelé. A két támasz együtt 14 kN-t tart, pontosan a
            két teher függőleges összegét (6 + 8).
          </p>
        </Lepes>
      </KidolgozottFeladat>
      <FilmCim>Ugyanez filmen – csukló és görgő, két nyomatéki egyenlet</FilmCim>
      <FilmGyf2 />

      {/* ==================== GYF‑3 ==================== */}
      <KidolgozottFeladat
        jel="GYF‑3"
        ido="7 perc"
        forras="H03 szintemelő, 5. feladat"
        cim="Rúddal és csuklóval megtámasztott gerenda — húzott vagy nyomott a rúd?"
        feladat={
          <p>
            A <M>{"4a"}</M> hosszú vízszintes gerendát a jobb végén csukló (<M>{"B"}</M>), a közepén (<M>{"C"}</M>, <M>{"x = 2a"}</M>) pedig egy
            ferde támasztórúd tartja, amelynek másik vége az <M>{"A"}</M> talajcsuklóhoz kapcsolódik, a gerenda alatt <M>{"a"}</M>-val, a bal
            vég alatt. A gerenda bal felét (<M>{"0 \\le x \\le 2a"}</M>) egyenletesen megoszló <M>{"p_1"}</M> teher terheli. Határozd meg a
            reakciókat és a rúderőt! <M>{"a = 1{,}2\\ \\text{m},\\ p_1 = 5\\ \\text{kN/m}"}</M>.
          </p>
        }
        abra={
          <AbraKeret cim="A feladatlap rajza. A rúd hajlásszöge: tg β = a / 2a = 0,5, azaz β = 26,57°; sin β = 0,4472, cos β = 0,8944.">
            <AbraGyf3 />
          </AbraKeret>
        }
        tanulsag={
          <p>
            A rúd számításilag ugyanaz, mint egy görgő: ismert hatásvonalú erő. A trükk, hogy <strong>mindig húzóerőnek vesszük fel</strong> —
            így az előjel maga mondja meg, húzott vagy nyomott a rúd. Itt <M>{"S < 0"}</M>: a rúd <strong>nyomott</strong>, alulról
            támasztja a gerendát, ahogy a szemlélet is súgja. Az ellenőrző nyomatéki egyenletet a rúd csatlakozási pontjára írtuk, mert ott a
            legkevesebb a tag.
          </p>
        }
      >
        <Lepes cim="Elkülönítés — a szabadtest-ábra">
          <p>
            A csukló helyére <M>{"B_x"}</M> (jobbra) és <M>{"B_y"}</M> (felfelé) kerül. A rudat elvágjuk, és a <M>{"C"}</M> pontban a rúd
            tengelyében ható <M>{"S"}</M> rúderőt vesszük fel <strong>húzóerőként</strong>: a <M>{"C"}</M>-ből az <M>{"A"}</M> felé, azaz
            balra-lefelé mutat; komponensei <M>{"S\\cos\\beta = 0{,}8944\\,S"}</M> balra és <M>{"S\\sin\\beta = 0{,}4472\\,S"}</M> lefelé. A
            megoszló terhet az eredőjével helyettesítjük: <M>{"R = p_1\\cdot 2a = 5\\cdot 2{,}4 = 12\\ \\text{kN}"}</M> lefelé, a szakasz
            közepén, <M>{"x = a = 1{,}2\\ \\text{m}"}</M>-nél.
          </p>
        </Lepes>
        <Lepes cim="Egyensúlyi kijelentés">
          <MB>{"(\\underline{p}_1, \\underline{S}, \\underline{B}_x, \\underline{B}_y) \\ekv \\underline{O}"}</MB>
        </Lepes>
        <Lepes cim="Nyomatéki egyenlet a B csuklóra → S">
          <p>
            A <M>{"B"}</M>-n átmegy <M>{"B_x"}</M> és <M>{"B_y"}</M> hatásvonala, marad az <M>{"S"}</M>. Az <M>{"S"}</M> vízszintes komponense a
            gerenda tengelyében hat (karja nulla), a függőleges komponens <M>{"C"}</M>-ben, <M>{"B"}</M>-től <M>{"2a = 2{,}4\\ \\text{m}"}</M>-re
            lefelé mutat — a ponttól balra lefelé ható erő az óramutatóval ellentétesen forgat, ahogy az <M>{"R"}</M> is (karja{" "}
            <M>{"3a = 3{,}6\\ \\text{m}"}</M>):
          </p>
          <MB>{"\\Mp{B} 12\\cdot 3{,}6 + 0{,}4472\\,S\\cdot 2{,}4 = 0\\ \\Rightarrow\\ S = -\\frac{43{,}2}{1{,}073} = -40{,}25\\ \\text{kN}"}</MB>
          <p>
            Negatív: a rúd <strong>nyomott</strong>. A rúd valójában <M>{"40{,}25\\ \\text{kN}"}</M>-nal tolja a gerendát az <M>{"A"}</M>-tól a{" "}
            <M>{"C"}</M> felé, azaz jobbra-felfelé.
          </p>
        </Lepes>
        <Lepes cim="Vízszintes vetületi egyenlet → B_x">
          <p>Az <M>{"S"}</M> már ismert, az előjelével együtt helyettesítjük be:</p>
          <MB>{"\\Fx -0{,}8944\\,S + B_x = 0\\ \\Rightarrow\\ B_x = 0{,}8944\\cdot(-40{,}25) = -36{,}00\\ \\text{kN}"}</MB>
          <p>Negatív: <M>{"B_x"}</M> valójában <strong>balra</strong> mutat.</p>
        </Lepes>
        <Lepes cim="Függőleges vetületi egyenlet → B_y">
          <MB>{"\\Fy -12 - 0{,}4472\\,S + B_y = 0\\ \\Rightarrow\\ B_y = 12 + 0{,}4472\\cdot(-40{,}25) = 12 - 18{,}00 = -6{,}000\\ \\text{kN}"}</MB>
          <p>Ez is negatív: <M>{"B_y"}</M> valójában <strong>lefelé</strong> mutat — a nyomott rúd „felemeli” a gerendát, a csuklónak lefelé kell tartania.</p>
        </Lepes>
        <Lepes cim="Ellenőrzés — nyomatéki egyenlet a C pontra">
          <p>
            A <M>{"C"}</M>-n átmegy az <M>{"S"}</M> hatásvonala és <M>{"B_x"}</M> tengelye; <M>{"R"}</M> karja <M>{"a = 1{,}2\\ \\text{m}"}</M>,{" "}
            <M>{"B_y"}</M> karja <M>{"2a = 2{,}4\\ \\text{m}"}</M>:
          </p>
          <MB>{"\\Mp{C} 12\\cdot 1{,}2 + B_y\\cdot 2{,}4 = 14{,}4 + (-6{,}000)\\cdot 2{,}4 = 14{,}4 - 14{,}4 = 0{,}0\\ \\checkmark"}</MB>
        </Lepes>
        <Lepes cim="Eredményvázlat">
          <p>
            A rúd <strong>nyomott</strong>, <M>{"|S| = 40{,}25\\ \\text{kN}"}</M> (a gerendát <M>{"C"}</M>-ben jobbra-felfelé tolja: 36,00 kN
            jobbra, 18,00 kN felfelé); <M>{"B_x = 36{,}00\\ \\text{kN}"}</M> <strong>balra</strong>, <M>{"B_y = 6{,}000\\ \\text{kN}"}</M>{" "}
            <strong>lefelé</strong>. Ránézésre: 36 jobbra – 36 balra; 18 fel – 12 + 6 le. Három új szám: <M>{"S"}</M>, <M>{"B_x"}</M>,{" "}
            <M>{"B_y"}</M>.
          </p>
        </Lepes>
      </KidolgozottFeladat>
      <FilmCim>Ugyanez filmen – a rúderő húzóként felvéve, majd az előjel dönt</FilmCim>
      <FilmGyf3 />

      {/* ==================== GYF‑4 ==================== */}
      <KidolgozottFeladat
        jel="GYF‑4"
        ido="6 perc"
        forras="H04 szintemelő, 2. feladat"
        cim="Tört tengelyű befogott tartó — vízszintes erő és felfelé mutató háromszögteher"
        feladat={
          <p>
            Az L alakú tartó függőleges szára <M>{"a"}</M>, vízszintes szára <M>{"2a"}</M> hosszú; a vízszintes szár jobb végén (<M>{"B"}</M>)
            befogás. A függőleges szár alsó végén jobbra mutató, vízszintes <M>{"F"}</M> erő, a vízszintes szár bal felén (<M>{"0 \\le x \\le a"}</M>)
            lineárisan változó, <strong>felfelé</strong> mutató teher hat, amely a sarokban nulla, <M>{"x = a"}</M>-nál <M>{"p"}</M>. Határozd
            meg a befogás reakcióit! <M>{"a = 2\\ \\text{m},\\ F = 5\\ \\text{kN},\\ p = 4\\ \\text{kN/m}"}</M>.
          </p>
        }
        abra={
          <AbraKeret cim="A feladatlap rajza. A felfelé mutató terhet itt alulról, a tartóra mutató nyilakkal rajzoltuk — az erő iránya ugyanaz. A háromszög eredője a magasabb oldal felé, 2a/3-nál van.">
            <AbraGyf4 />
          </AbraKeret>
        }
        tanulsag={
          <p>
            Tört tengelyű tartónál semmi új: az <M>{"F"}</M> vízszintes erő karja a befogásra a <em>függőleges</em> távolság (<M>{"a"}</M>),
            a függőleges eredőé a vízszintes távolság. A megoszló terhet előbb eredővel helyettesítjük (3. modul), csak azután írunk
            egyenletet. A befogási nyomaték itt kicsi (0,667 kNm), mert a két teher majdnem kiegyensúlyozza egymást a <M>{"B"}</M> körül — az
            ellenőrző egyenlet pont az ilyen „kicsi különbséget” fogja meg.
          </p>
        }
      >
        <Lepes cim="Elkülönítés — a szabadtest-ábra">
          <p>
            A befogás helyére <M>{"B_x"}</M> (jobbra), <M>{"B_y"}</M> (felfelé) és <M>{"M_B"}</M> (az óramutatóval ellentétesen) kerül. A
            háromszögteher eredője <M>{"R = \\tfrac12\\,p\\,a = \\tfrac12\\cdot 4\\cdot 2 = 4\\ \\text{kN}"}</M> <strong>felfelé</strong>, a
            sarokponttól <M>{"\\tfrac23 a = 1{,}333\\ \\text{m}"}</M>-re (a magasabb oldal felé tolva). Az <M>{"F = 5\\ \\text{kN}"}</M> a
            sarok alatt <M>{"a = 2\\ \\text{m}"}</M>-rel, jobbra mutat.
          </p>
        </Lepes>
        <Lepes cim="Egyensúlyi kijelentés">
          <MB>{"(\\underline{F}, \\underline{p}, \\underline{B}_x, \\underline{B}_y, M_B) \\ekv \\underline{O}"}</MB>
        </Lepes>
        <Lepes cim="Vízszintes vetületi egyenlet → B_x">
          <MB>{"\\Fx 5 + B_x = 0\\ \\Rightarrow\\ B_x = -5{,}000\\ \\text{kN}"}</MB>
          <p>Negatív: <M>{"B_x"}</M> valójában balra mutat.</p>
        </Lepes>
        <Lepes cim="Függőleges vetületi egyenlet → B_y">
          <MB>{"\\Fy 4 + B_y = 0\\ \\Rightarrow\\ B_y = -4{,}000\\ \\text{kN}"}</MB>
          <p>Negatív: <M>{"B_y"}</M> valójában lefelé mutat — a felfelé nyomó teher ellen a falnak lefelé kell húznia.</p>
        </Lepes>
        <Lepes cim="Nyomatéki egyenlet a B befogásra → M_B">
          <p>
            <M>{"B"}</M>-re nézve <M>{"B_x"}</M>, <M>{"B_y"}</M> karja nulla. Az <M>{"F"}</M> jobbra mutat, a <M>{"B"}</M> alatt{" "}
            <M>{"2\\ \\text{m}"}</M>-rel — egy pont alatt jobbra ható erő az óramutatóval ellentétesen forgat (pozitív). Az <M>{"R"}</M> felfelé
            mutat, <M>{"B"}</M>-től balra <M>{"2a - \\tfrac23 a = 2{,}667\\ \\text{m}"}</M>-re — az óramutató irányába forgat (negatív):
          </p>
          <MB>{"\\Mp{B} M_B + 5\\cdot 2 - 4\\cdot 2{,}667 = 0\\ \\Rightarrow\\ M_B = 10{,}67 - 10 = 0{,}6667\\ \\text{kNm}"}</MB>
        </Lepes>
        <Lepes cim="Ellenőrzés — nyomatéki egyenlet a sarokpontra (O)">
          <p>
            A sarokra nézve <M>{"F"}</M> karja <M>{"2\\ \\text{m}"}</M> (pozitív), <M>{"R"}</M> karja <M>{"1{,}333\\ \\text{m}"}</M> (jobbra
            felfelé: pozitív), <M>{"B_y"}</M> karja <M>{"4\\ \\text{m}"}</M>, <M>{"B_x"}</M> a tengelyben hat:
          </p>
          <MB>{"\\Mp{O} 5\\cdot 2 + 4\\cdot 1{,}333 + B_y\\cdot 4 + M_B = 10 + 5{,}333 - 16 + 0{,}6667 = 0{,}000\\ \\checkmark"}</MB>
        </Lepes>
        <Lepes cim="Eredményvázlat">
          <p>
            <M>{"B_x = 5{,}000\\ \\text{kN}"}</M> <strong>balra</strong>, <M>{"B_y = 4{,}000\\ \\text{kN}"}</M> <strong>lefelé</strong>,{" "}
            <M>{"M_B = 0{,}6667\\ \\text{kNm}"}</M> az óramutató járásával ellentétesen. A reakcióerő a terhek eredőjének ellentettje
            (5 balra, 4 le), a nyomaték pedig azt a kis erőpárt egyenlíti ki, ami a teher és a reakcióerő között marad.
          </p>
        </Lepes>
      </KidolgozottFeladat>
      <FilmCim>Ugyanez filmen – háromszögteher eredője, majd a befogás három reakciója</FilmCim>
      <FilmGyf4 />

      {/* ==================== GYF‑5 ==================== */}
      <KidolgozottFeladat
        jel="GYF‑5"
        ido="8 perc"
        forras="H04 szintemelő, 3. feladat"
        cim="Keret csuklóval és ferde görgővel — a főpont haszna"
        feladat={
          <p>
            A keret bal oszlopa az <M>{"A"}</M> csuklóból indul, <M>{"2a"}</M> magas; a gerenda <M>{"3a"}</M> hosszú; a jobb oszlop{" "}
            <M>{"a"}</M>-val lóg le a gerendáról, alsó végén a <M>{"B"}</M> görgő a vízszintessel <M>{"\\alpha"}</M> szöget bezáró, jobbra
            emelkedő síkon gördül. A gerendán az <M>{"x = a"}</M> helyen az óramutató járásával megegyező értelmű <M>{"M"}</M> koncentrált nyomaték
            hat. Határozd meg a reakciókat! <M>{"a = 1{,}5\\ \\text{m},\\ M = 12\\ \\text{kNm},\\ \\alpha = 30^\\circ"}</M>.
          </p>
        }
        abra={
          <AbraKeret cim="A feladatlap rajza. A görgő reakciója a gördülési síkra merőleges: a függőlegessel α = 30°-ot zár be, balra-felfelé mutat.">
            <AbraGyf5 />
          </AbraKeret>
        }
        tanulsag={
          <p>
            Ferde görgőnél a görgőerőnek <em>mindkét</em> csuklóerő-komponenssel van metszéspontja: ezek a <strong>főpontok</strong>. A rájuk írt
            nyomatéki egyenletekben egyetlen ismeretlen marad, és egyik reakció sem épül a másikra — a két vetületi egyenlet érintetlen, mindkettő
            ellenőrzésre marad. A számok is beszédesek: az egyetlen teher egy nyomaték, ezért a két reakcióerő egyenlő nagyságú és ellentétes
            (<M>{"A = B = 2{,}582\\ \\text{kN}"}</M>): erőpárt alkotnak, amelynek nyomatéka <M>{"2{,}582\\cdot 4{,}647 = 12\\ \\text{kNm}"}</M> —
            pontosan az <M>{"M"}</M> ellentettje.
          </p>
        }
      >
        <Lepes cim="Elkülönítés — a szabadtest-ábra és a főpontok">
          <p>
            A csukló helyére <M>{"A_x"}</M> (jobbra) és <M>{"A_y"}</M> (felfelé), a görgő helyére a síkra merőleges <M>{"B"}</M> kerül, amely a
            függőlegessel <M>{"30^\\circ"}</M>-ot zár be és balra-felfelé mutat: komponensei <M>{"B\\sin 30^\\circ = 0{,}5\\,B"}</M> balra és{" "}
            <M>{"B\\cos 30^\\circ = 0{,}866\\,B"}</M> felfelé. Koordináták az <M>{"A"}</M>-ból: <M>{"B = (4{,}5;\\ 1{,}5)\\ \\text{m}"}</M>. A{" "}
            <M>{"B"}</M> hatásvonala az <M>{"A_x"}</M> hatásvonalát (az <M>{"y = 0"}</M> egyenest) a{" "}
            <M>{"P_1 = (4{,}5 + 1{,}5\\,\\mathrm{tg}\\,30^\\circ;\\ 0) = (5{,}366;\\ 0)"}</M> pontban, az <M>{"A_y"}</M> hatásvonalát (az{" "}
            <M>{"x = 0"}</M> egyenest) a <M>{"P_2 = (0;\\ 1{,}5 + 4{,}5/\\mathrm{tg}\\,30^\\circ) = (0;\\ 9{,}294)"}</M> pontban metszi. Ezek a
            főpontok.
          </p>
        </Lepes>
        <Lepes cim="Egyensúlyi kijelentés">
          <MB>{"(M, \\underline{A}_x, \\underline{A}_y, \\underline{B}) \\ekv \\underline{O}"}</MB>
        </Lepes>
        <Lepes cim="Nyomatéki egyenlet az A csuklóra → B">
          <p>
            <M>{"A"}</M>-ra nézve csak <M>{"B"}</M> és <M>{"M"}</M> forgat. <M>{"B"}</M> nyomatékát komponensenként írjuk: a felfelé mutató
            komponens karja <M>{"4{,}5\\ \\text{m}"}</M> (pozitív), a balra mutató komponens a pont fölött <M>{"1{,}5\\ \\text{m}"}</M>-rel hat, ez
            is az óramutatóval ellentétesen forgat (pozitív). Az <M>{"M"}</M> az óramutató irányába forog (negatív):
          </p>
          <MB>{"\\Mp{A} 0{,}866\\,B\\cdot 4{,}5 + 0{,}5\\,B\\cdot 1{,}5 - 12 = 0\\ \\Rightarrow\\ 4{,}647\\,B = 12\\ \\Rightarrow\\ B = 2{,}582\\ \\text{kN}"}</MB>
          <p>(A 4,647 m épp a <M>{"B"}</M> hatásvonalának távolsága az <M>{"A"}</M>-tól — az erő karja.)</p>
        </Lepes>
        <Lepes cim="Nyomatéki egyenlet a P₁ főpontra → A_y">
          <p>
            <M>{"P_1"}</M>-en átmegy a <M>{"B"}</M> és az <M>{"A_x"}</M> hatásvonala is, csak <M>{"A_y"}</M> marad — a már kiszámolt <M>{"B"}</M>-t nem
            használjuk. <M>{"A_y"}</M> karja <M>{"5{,}366\\ \\text{m}"}</M>, a ponttól balra felfelé ható erő az óramutató irányába forgat:
          </p>
          <MB>{"\\Mp{P_1} -A_y\\cdot 5{,}366 - 12 = 0\\ \\Rightarrow\\ A_y = -2{,}236\\ \\text{kN}"}</MB>
          <p>Negatív: <M>{"A_y"}</M> valójában <strong>lefelé</strong> mutat.</p>
        </Lepes>
        <Lepes cim="Nyomatéki egyenlet a P₂ főpontra → A_x">
          <p>
            <M>{"P_2"}</M>-n átmegy a <M>{"B"}</M> és az <M>{"A_y"}</M> hatásvonala, csak <M>{"A_x"}</M> marad. Karja <M>{"9{,}294\\ \\text{m}"}</M>; a
            pont alatt jobbra ható erő az óramutatóval ellentétesen forgat:
          </p>
          <MB>{"\\Mp{P_2} A_x\\cdot 9{,}294 - 12 = 0\\ \\Rightarrow\\ A_x = 1{,}291\\ \\text{kN}"}</MB>
        </Lepes>
        <Lepes cim="Ellenőrzés — mindkét vetületi egyenlet">
          <p>Egyik vetületi egyenletet sem használtuk, mindkettő ellenőrzésre való:</p>
          <MB>{"\\Fx 1{,}291 - 0{,}5\\cdot 2{,}582 = 1{,}291 - 1{,}291 = 0{,}000\\ \\checkmark"}</MB>
          <MB>{"\\Fy -2{,}236 + 0{,}866\\cdot 2{,}582 = -2{,}236 + 2{,}236 = 0{,}000\\ \\checkmark"}</MB>
        </Lepes>
        <Lepes cim="Eredményvázlat">
          <p>
            <M>{"A_x = 1{,}291\\ \\text{kN}"}</M> jobbra, <M>{"A_y = 2{,}236\\ \\text{kN}"}</M> <strong>lefelé</strong> (a felvett irány fordított
            volt), <M>{"B = 2{,}582\\ \\text{kN}"}</M> a gördülési síkra merőlegesen, balra-felfelé. Az <M>{"A"}</M> csuklóerő nagysága{" "}
            <M>{"\\sqrt{1{,}291^2 + 2{,}236^2} = 2{,}582\\ \\text{kN}"}</M>, iránya a <M>{"B"}</M>-vel párhuzamos és ellentétes — erőpár.
          </p>
        </Lepes>
      </KidolgozottFeladat>
      <FilmCim>Ugyanez filmen – a hatásvonalak metszéspontjai, a főpontok</FilmCim>
      <FilmGyf5 />

      {/* ==================== GYF‑6 ==================== */}
      <KidolgozottFeladat
        jel="GYF‑6"
        ido="8 perc"
        forras="H04 szintemelő, 4. feladat"
        cim="Vízzel terhelt ferde gerenda — a 3. modul és a reakciók együtt"
        feladat={
          <p>
            A gerenda az <M>{"A"}</M> csuklóból a vízszintessel <M>{"\\alpha"}</M> szöget bezárva emelkedik a <M>{"B"}</M> görgőig, amely{" "}
            <M>{"2a"}</M>-val van az <M>{"A"}</M> fölött, vízszintes síkon gördül. A gerenda bal-fölső oldalán víz áll, a vízszint <M>{"a"}</M>-val az{" "}
            <M>{"A"}</M> fölött. A víztömeg rajzra merőleges mérete <M>{"a/10"}</M>. Határozd meg a reakciókat!{" "}
            <M>{"a = 2\\ \\text{m},\\ \\alpha = 30^\\circ,\\ \\gamma = 10\\ \\text{kN/m}^3"}</M>.
          </p>
        }
        abra={
          <AbraKeret cim="A feladatlap rajza. A víz a gerenda bal-fölső oldalán áll, ezért a nyomás a gerendát jobbra-lefelé, a tengelyére merőlegesen nyomja; a vízszintnél nulla, az A-nál a legnagyobb.">
            <AbraGyf6 />
          </AbraKeret>
        }
        tanulsag={
          <p>
            A víz a felületre mindig <strong>merőlegesen</strong> nyom, és a nyomás a mélységgel arányos — a ferde gerendán ezért egy, a
            gerendára merőleges háromszögteher keletkezik. A <M>{"a/10"}</M> szélesség váltja át a felületi nyomást (kN/m²) vonal menti
            teherré (kN/m). A nyomatéki egyenletben a merőleges eredő karja egyszerűen a gerenda menti távolság — nem kell komponensekre
            bontani. A vetületi egyenletekhez viszont igen: <M>{"R\\sin\\alpha"}</M> vízszintes, <M>{"R\\cos\\alpha"}</M> függőleges.
          </p>
        }
      >
        <Lepes cim="A teher: nyomás a merült szakaszon">
          <p>
            A vízbe a gerenda <M>{"A"}</M>-tól a vízszintig merül, a merült hossz <M>{"a/\\sin 30^\\circ = 4\\ \\text{m}"}</M>. A nyomás a
            mélységgel arányos: a vízszintnél nulla, az <M>{"A"}</M>-nál (2 m mélyen) <M>{"\\gamma\\,a = 20\\ \\text{kN/m}^2"}</M>, ami a{" "}
            <M>{"a/10 = 0{,}2\\ \\text{m}"}</M> szélességgel a gerenda 1 m hosszára{" "}
            <M>{"p_{\\max} = 20\\cdot 0{,}2 = 4\\ \\text{kN/m}"}</M>. Ez egy háromszögteher a gerendára merőlegesen, jobbra-lefelé:
          </p>
          <MB>{"R = \\tfrac12\\,p_{\\max}\\cdot 4 = \\tfrac12\\cdot 4\\cdot 4 = 8\\ \\text{kN},\\qquad \\text{az } A\\text{-tól } \\tfrac{4}{3} = 1{,}333\\ \\text{m-re a gerenda mentén}"}</MB>
          <p>
            Komponensei: <M>{"R\\sin 30^\\circ = 4{,}000\\ \\text{kN}"}</M> jobbra, <M>{"R\\cos 30^\\circ = 6{,}928\\ \\text{kN}"}</M> lefelé.
          </p>
        </Lepes>
        <Lepes cim="Elkülönítés és egyensúlyi kijelentés">
          <p>
            A csukló helyére <M>{"A_x"}</M> (jobbra), <M>{"A_y"}</M> (felfelé), a görgő helyére a függőleges <M>{"B"}</M> (felfelé) kerül. A{" "}
            <M>{"B"}</M> helye: <M>{"x_B = 2a/\\mathrm{tg}\\,30^\\circ = 6{,}928\\ \\text{m}"}</M>, <M>{"y_B = 4\\ \\text{m}"}</M>; a gerenda hossza{" "}
            <M>{"2a/\\sin 30^\\circ = 8\\ \\text{m}"}</M>.
          </p>
          <MB>{"(\\underline{R}, \\underline{A}_x, \\underline{A}_y, \\underline{B}) \\ekv \\underline{O}"}</MB>
        </Lepes>
        <Lepes cim="Nyomatéki egyenlet az A csuklóra → B">
          <p>
            Az <M>{"A"}</M>-n átmegy <M>{"A_x"}</M> és <M>{"A_y"}</M>. Az <M>{"R"}</M> merőleges a gerendára, karja a gerenda menti távolság,{" "}
            <M>{"1{,}333\\ \\text{m}"}</M>; a jobbra-lefelé nyomó erő az óramutató irányába forgat (negatív). A függőleges <M>{"B"}</M> karja{" "}
            <M>{"x_B = 6{,}928\\ \\text{m}"}</M>:
          </p>
          <MB>{"\\Mp{A} -8\\cdot 1{,}333 + B\\cdot 6{,}928 = 0\\ \\Rightarrow\\ B = \\frac{10{,}67}{6{,}928} = 1{,}540\\ \\text{kN}"}</MB>
        </Lepes>
        <Lepes cim="Vízszintes vetületi egyenlet → A_x">
          <MB>{"\\Fx 4{,}000 + A_x = 0\\ \\Rightarrow\\ A_x = -4{,}000\\ \\text{kN}"}</MB>
          <p>Negatív: <M>{"A_x"}</M> valójában <strong>balra</strong> mutat — a csukló tartja meg a víz vízszintes tolását.</p>
        </Lepes>
        <Lepes cim="Függőleges vetületi egyenlet → A_y">
          <MB>{"\\Fy -6{,}928 + A_y + 1{,}540 = 0\\ \\Rightarrow\\ A_y = 5{,}389\\ \\text{kN}"}</MB>
        </Lepes>
        <Lepes cim="Ellenőrzés — nyomatéki egyenlet a B görgőre">
          <p>
            <M>{"R"}</M> karja a gerenda mentén <M>{"8 - 1{,}333 = 6{,}667\\ \\text{m}"}</M>, most az óramutatóval ellentétesen forgat;{" "}
            <M>{"A_y"}</M> karja <M>{"6{,}928\\ \\text{m}"}</M> (a ponttól balra felfelé: negatív); <M>{"A_x"}</M> balra mutat a pont alatt{" "}
            <M>{"4\\ \\text{m}"}</M>-rel (negatív):
          </p>
          <MB>{"\\Mp{B} 8\\cdot 6{,}667 - 5{,}389\\cdot 6{,}928 - 4{,}000\\cdot 4 = 53{,}33 - 37{,}33 - 16{,}00 = 0{,}00\\ \\checkmark"}</MB>
        </Lepes>
        <Lepes cim="Eredményvázlat">
          <p>
            <M>{"A_x = 4{,}000\\ \\text{kN}"}</M> <strong>balra</strong> (a felvett irány fordított volt), <M>{"A_y = 5{,}389\\ \\text{kN}"}</M>{" "}
            felfelé, <M>{"B = 1{,}540\\ \\text{kN}"}</M> felfelé. Ránézésre: 4 jobbra – 4 balra; 5,389 + 1,540 = 6,929 fel – 6,928 le. A
            görgő keveset tart, mert a teher az <M>{"A"}</M> közelében nyom.
          </p>
        </Lepes>
      </KidolgozottFeladat>
      <FilmCim>Ugyanez filmen – víznyomásból teher, teherből reakciók</FilmCim>
      <FilmGyf6 />
    </>
  );
}
