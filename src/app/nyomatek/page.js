import { ModulFejlec, SzakaszSav } from "@/components/ModulKeret";
import {
  Szakasz,
  Kartya,
  Kiemelo,
  AbraKeret,
  KetOszlop,
} from "@/components/ui/Elemek";
import { M, MB, KepletDoboz } from "@/components/ui/Keplet";
import { KidolgozottFeladat, Lepes } from "@/components/KidolgozottFeladat";
import NyomatekFelfedezo from "@/components/abrak/NyomatekFelfedezo";
import ErorendszerRedukalo from "@/components/abrak/ErorendszerRedukalo";
import TerbeliNyomatekKalk from "@/components/abrak/TerbeliNyomatekKalk";
import {
  AbraErokar,
  AbraEropar,
  AbraHaromEset,
  AbraTerbeliNyomatekElv,
} from "@/components/abrak/NyomatekAbrak";
import {
  AbraParhuzamos,
  AbraSzetszort,
  AbraHaromszog,
  AbraTerbeliErorendszer,
} from "@/components/abrak/NyomatekFeladatAbrak";
import GyakorloSzekcio from "@/components/nyomatek/GyakorloSzekcio";
import { modulSlugAlapjan } from "@/lib/oldalterkep";

export const metadata = {
  title: "Nyomaték, eredő, redukálás",
  description:
    "Forgatónyomaték síkban és térben, erőpár, erőrendszer redukálása egy pontra és az eredő három esete — interaktív ábrákkal, kidolgozott feladatokkal és gyakorlással.",
};

const modul = modulSlugAlapjan("/nyomatek");

export default function NyomatekOldal() {
  return (
    <>
      <ModulFejlec
        szam={2}
        cim="Nyomaték, eredő, redukálás"
        leiras="Az erő nemcsak tolni akarja a testet, hanem forgatni is. Ebben a modulban megtanulod, hogyan mérjük ezt a forgatóhatást, és hogyan lehet egy egész erőrendszert egyetlen erővel vagy egyetlen nyomatékkal helyettesíteni."
        tartalom={[
          "Forgatónyomaték és erőkar",
          "Erőpár",
          "Redukálás egy pontra",
          "Az eredő három esete",
          "Térbeli nyomaték",
        ]}
      />
      <SzakaszSav szakaszok={modul.szakaszok} />

      {/* ==================== ELMÉLET ==================== */}
      <Szakasz
        id="elmelet"
        cimke="1. rész"
        cim="Elmélet"
        bevezeto="Az előző modulban az erők összeadása volt a téma. Most jön az, ami ezt statikává teszi: az, hogy az erőnek helye is van, és ez a hely számít."
      >
        {/* --- 2.1 --- */}
        <h3 className="mt-2 text-xl font-semibold text-petrol-900">
          2.1 A forgatónyomaték
        </h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Két azonos nagyságú és irányú erő egészen mást csinál attól függően,
            hogy hol támad. Egy ajtót a kilincsnél könnyű kinyitni, a
            zsanérnál lehetetlen — pedig az erő ugyanaz. Amit itt érzünk, az a{" "}
            <strong>forgatónyomaték</strong>: az erő forgatóhatása egy adott
            pontra.
          </p>
          <p>
            Síkban a nyomaték előjeles skalár. Nagysága az erő nagyságának és az{" "}
            <strong>erőkarnak</strong> a szorzata, ahol az erőkar a pont
            merőleges távolsága az erő hatásvonalától. Előjele a forgásirányból
            adódik: megállapodás szerint az óramutató járásával ellentétes
            forgatás a pozitív.
          </p>
        </div>

        <KepletDoboz
          cimke="Nyomaték egy pontra, síkban"
          keplet={"M^{(O)} = \\pm F\\,k"}
        />

        <AbraKeret
          szam={1}
          cim="Ugyanaz az erőkar, ellentétes forgásirány — az előjel dönti el, melyikről van szó."
        >
          <AbraErokar />
        </AbraKeret>

        <div className="proza text-[15px] leading-relaxed text-petrol-700">
          <p>
            Az erőkar leolvasása rajzról körülményes, ezért a gyakorlatban szinte
            mindig komponensekkel számolunk. Ha az erő támadáspontja{" "}
            <M>{"P(x;\\,y)"}</M>, akkor az origóra vett nyomaték a két komponens
            nyomatékának összege — ez a Varignon-tétel:
          </p>
        </div>

        <KepletDoboz
          cimke="Nyomaték komponensekkel"
          keplet={"M^{(O)} = x\\,F_y - y\\,F_x"}
        />

        <Kiemelo tipus="kulcs" cim="Miért nem kell tudni, hol pontosan támad az erő">
          <p>
            Ha az erőt a saját hatásvonala mentén eltoljuk, a nyomatéka nem
            változik — hiszen sem az erő, sem az erőkar nem lett más. Ezért elég
            a hatásvonalat ismerni, a támadáspontot nem. Az alábbi ábrán próbáld
            ki: told a támadáspontot a szaggatott vonal mentén, és figyeld, hogy
            a <M>{"k"}</M> és az <M>{"M"}</M> változatlan marad.
          </p>
        </Kiemelo>

        <div className="mt-6">
          <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">
            Próbáld ki
          </p>
          <NyomatekFelfedezo />
        </div>

        {/* --- 2.2 --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">
          2.2 Az erőpár
        </h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Két egyenlő nagyságú, ellentétes irányú, párhuzamos erő különleges
            eset: az eredő erejük zérus, tehát tolni nem tolják a testet — de
            forgatni forgatják. Az ilyen erőkettőst <strong>erőpárnak</strong>{" "}
            nevezzük, a nyomatéka pedig <M>{"M = F\\,d"}</M>, ahol{" "}
            <M>{"d"}</M> a két hatásvonal merőleges távolsága.
          </p>
          <p>
            Az erőpár nyomatéka <strong>minden pontra ugyanakkora</strong>.
            Éppen ezért nem kell megmondani, melyik pontra vonatkozik, és a
            rajzon bárhová oda lehet írni — a nyomaték szabad vektor.
          </p>
        </div>

        <AbraKeret
          szam={2}
          cim="Az erőpár és az őt helyettesítő forgatónyomaték."
        >
          <AbraEropar />
        </AbraKeret>

        {/* --- 2.3 --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">
          2.3 Redukálás egy pontra
        </h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Egy erőt el lehet tolni egy tetszőleges pontba, ha közben hozzáadunk
            egy forgatónyomatékot, amely pótolja az elveszett forgatóhatást. Ha
            ezt minden erővel megtesszük, az egész erőrendszer két adatra
            zsugorodik: egy <M>{"\\underline{R}"}</M> erőre és egy{" "}
            <M>{"M^{(O)}"}</M> nyomatékra a választott pontban.
          </p>
        </div>

        <KepletDoboz
          cimke="Az erőrendszer redukálása az O pontba"
          keplet={
            "R_x = \\sum F_{ix},\\qquad R_y = \\sum F_{iy},\\qquad M^{(O)} = \\sum \\left( x_i F_{iy} - y_i F_{ix} \\right)"
          }
        />

        <Kiemelo tipus="tipp" cim="Melyik pontot válasszuk?">
          <p>
            Bármelyiket — az eredmény ugyanaz az erőrendszer marad, csak más
            alakban. Érdemes olyan pontot választani, amelyre sok erő nyomatéka
            nulla (mert a hatásvonala átmegy rajta), mert akkor kevesebbet kell
            számolni. Tartóknál ez általában az egyik támasz.
          </p>
        </Kiemelo>

        {/* --- 2.4 --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">
          2.4 Az eredő három esete
        </h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            A redukálás után kapott <M>{"(\\underline{R},\\ M^{(O)})"}</M> pár
            alapján három eset lehetséges, és minden síkbeli erőrendszer
            pontosan az egyikbe tartozik.
          </p>
        </div>

        <AbraKeret szam={3} cim="Minden síkbeli erőrendszer e három eset valamelyikébe esik.">
          <AbraHaromEset />
        </AbraKeret>

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          <Kartya cimke="1. eset" cim="Egyetlen erő">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">
              Ha <M>{"\\underline{R} \\neq 0"}</M>, az erőrendszer egyetlen
              erővel helyettesíthető. Ennek az erőnek a hatásvonalát úgy kell
              megkeresni, hogy ugyanakkora nyomatékot adjon, mint az eredeti
              rendszer.
            </p>
          </Kartya>
          <Kartya cimke="2. eset" cim="Erőpár">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">
              Ha <M>{"\\underline{R} = 0"}</M>, de <M>{"M^{(O)} \\neq 0"}</M>,
              az eredő tiszta forgatónyomaték. Ilyenkor a nyomaték minden pontra
              ugyanannyi.
            </p>
          </Kartya>
          <Kartya cimke="3. eset" cim="Zérusrendszer">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">
              Ha <M>{"\\underline{R} = 0"}</M> és <M>{"M^{(O)} = 0"}</M>, az
              erőrendszer semmit nem csinál: a test egyensúlyban van. Erre épül
              majd az egész tartószámítás.
            </p>
          </Kartya>
        </div>

        <Kiemelo tipus="figyelem" cim="Az eredő erő zérus, de a rendszer mégsem zérusrendszer">
          <p>
            A leggyakoribb tévedés az, hogy valaki kiszámolja a{" "}
            <M>{"\\sum F_{ix} = 0"}</M> és <M>{"\\sum F_{iy} = 0"}</M>{" "}
            egyenleteket, és ebből azt a következtetést vonja le, hogy az
            erőrendszer egyensúlyi. Pedig ez csak a <em>fele</em> a feltételnek:
            a nyomatéki egyenletet is fel kell írni. Ha az nem nulla, az eredő
            egy erőpár — a test nem mozdul el, de forogni fog. A 4. kidolgozott
            feladat éppen erről szól.
          </p>
        </Kiemelo>

        {/* --- 2.5 --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">
          2.5 Az eredő hatásvonalának helye
        </h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Ha az eredő egyetlen erő, akkor van egy hatásvonala, és azon
            működve már nem kell mellé nyomaték. A hatásvonal helyét abból
            kapjuk meg, hogy az eredőnek ugyanazt a nyomatékot kell adnia az{" "}
            <M>{"O"}</M> pontra, mint az egész eredeti erőrendszernek.
          </p>
        </div>

        <KepletDoboz
          cimke="A hatásvonal metszéspontja a tengelyekkel"
          keplet={
            "x_0 R_y = M^{(O)} \\quad\\Rightarrow\\quad x_0 = \\frac{M^{(O)}}{R_y} \\qquad\\text{illetve}\\qquad y_0 = -\\frac{M^{(O)}}{R_x}"
          }
        />

        <div className="mt-6">
          <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">
            Próbáld ki – kapcsolgasd a három nézetet
          </p>
          <ErorendszerRedukalo />
        </div>

        {/* --- 2.6 --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">
          2.6 Nyomaték a térben
        </h3>
        <KetOszlop>
          <div>
            <div className="proza text-[15px] leading-relaxed text-petrol-700">
              <p>
                Térben a nyomaték már nem skalár, hanem vektor: nemcsak azt kell
                tudni, mekkora a forgatás, hanem azt is, melyik tengely körül
                történik. A nyomatékvektort a helyvektor és az erő vektoriális
                szorzata adja, iránya pedig merőleges mindkettőre.
              </p>
              <p>
                A három komponens egyben a három koordinátatengelyre vett
                nyomaték is. Figyeld meg, hogy mindegyik képletből hiányzik egy
                erőkomponens: amelyik párhuzamos az adott tengellyel, az nem
                forgat akörül.
              </p>
            </div>
            <MB>
              {"\\underline{M} = \\underline{r} \\times \\underline{F}"}
            </MB>
            <MB>
              {"M_x = y F_z - z F_y,\\quad M_y = z F_x - x F_z,\\quad M_z = x F_y - y F_x"}
            </MB>
          </div>
          <AbraKeret szam={4} cim="A nyomatékvektor merőleges az r és az F síkjára.">
            <AbraTerbeliNyomatekElv />
          </AbraKeret>
        </KetOszlop>
      </Szakasz>

      {/* ==================== KIDOLGOZOTT FELADATOK ==================== */}
      <Szakasz
        id="peldak"
        cimke="2. rész"
        cim="Kidolgozott feladatok"
        bevezeto="A gyakorlat öt feladata. A negyedik különösen fontos: ugyanazt az ábrát számolja végig háromféle adattal, és ezzel mind a három esetet megmutatja."
        className="bg-white"
      >
        {/* ---- GYF-1 ---- */}
        <KidolgozottFeladat
          jel="GYF‑1"
          ido="4 perc"
          forras="A1. gyakorlat"
          cim="Térbeli erő nyomatéka a koordinátatengelyekre"
          feladat={
            <>
              <p>
                Számítsd ki az <M>{"\\underline{r}"}</M> támadáspontú{" "}
                <M>{"\\underline{F}"}</M> erő nyomatékait az origón átmenő{" "}
                <M>{"x"}</M>, <M>{"y"}</M> és <M>{"z"}</M> tengelyekre!
              </p>
              <MB>
                {"\\underline{r} = \\begin{bmatrix} -5{,}0 \\\\ +3{,}3 \\\\ +4{,}7 \\end{bmatrix}\\ \\text{m},\\qquad \\underline{F} = \\begin{bmatrix} 800 \\\\ 600 \\\\ -300 \\end{bmatrix}\\ \\text{N}"}
              </MB>
            </>
          }
          tanulsag={
            <p>
              Az erő azon komponensei, amelyek párhuzamosak az adott tengellyel,
              nem forgatnak akörül a tengely körül. Ezért hiányzik az{" "}
              <M>{"M_x"}</M> képletéből az <M>{"F_x"}</M>, az{" "}
              <M>{"M_y"}</M>-ból az <M>{"F_y"}</M>, az <M>{"M_z"}</M>-ből
              pedig az <M>{"F_z"}</M>. Ha ezt megjegyzed, sosem kell a
              vektoriális szorzat kifejtésével bajlódnod.
            </p>
          }
        >
          <Lepes cim="Nyomaték az x tengelyre">
            <p>
              Az <M>{"x"}</M> tengely körüli forgatásban csak az{" "}
              <M>{"F_y"}</M> és az <M>{"F_z"}</M> komponens vesz részt:
            </p>
            <MB>{"M_x = y F_z - z F_y = 3{,}3\\cdot(-300) - 4{,}7\\cdot 600 = -3810\\ \\text{Nm}"}</MB>
          </Lepes>

          <Lepes cim="Nyomaték az y tengelyre">
            <MB>{"M_y = z F_x - x F_z = 4{,}7\\cdot 800 - (-5{,}0)\\cdot(-300) = 3760 - 1500 = 2260\\ \\text{Nm}"}</MB>
            <p>
              Vigyázz a második tag két negatív előjelére: a szorzatuk pozitív,
              és a kivonás miatt végül levonjuk.
            </p>
          </Lepes>

          <Lepes cim="Nyomaték a z tengelyre">
            <MB>{"M_z = x F_y - y F_x = (-5{,}0)\\cdot 600 - 3{,}3\\cdot 800 = -3000 - 2640 = -5640\\ \\text{Nm}"}</MB>
          </Lepes>

          <Lepes cim="Kiegészítés: a nyomatékvektor nagysága">
            <p>
              A három komponens egyértelműen meghatározza a nyomatékvektort, így
              a nagysága is számolható:
            </p>
            <MB>{"|\\underline{M}| = \\sqrt{3810^2 + 2260^2 + 5640^2} = 7172\\ \\text{Nm}"}</MB>
          </Lepes>
        </KidolgozottFeladat>

        {/* ---- GYF-2 ---- */}
        <KidolgozottFeladat
          jel="GYF‑2"
          ido="2 perc"
          forras="A1. gyakorlat"
          cim="Négy párhuzamos erő eredője és helye"
          feladat={
            <p>
              Az ábrán négy azonos, <M>{"11\\ \\text{kN}"}</M> nagyságú,
              lefelé mutató erő látható. Számítsd ki az eredőjük nagyságát és
              helyét!
            </p>
          }
          abra={
            <AbraKeret cim="Négy párhuzamos erő az x tengely mentén.">
              <AbraParhuzamos />
            </AbraKeret>
          }
          tanulsag={
            <p>
              Párhuzamos erőknél az eredő mindig az erők közé esik, és a
              „súlypontjukban” működik. Itt négy egyenlő erő van 2, 3, 4 és 5
              méternél, ezért az eredő a számtani középre, 3,5 méterre kerül — a
              nyomatéki egyenlet ezt csak megerősíti.
            </p>
          }
        >
          <Lepes cim="Egyenértékűségi kijelentés">
            <p>
              Kimondjuk, hogy a négy erő helyettesíthető egyetlen eredővel, és
              ezután két egyenletet írunk fel rá: egyet az erőre, egyet a
              nyomatékra.
            </p>
            <MB>{"(\\underline{F}_1,\\ \\underline{F}_2,\\ \\underline{F}_3,\\ \\underline{F}_4) \\doteq \\underline{R}"}</MB>
          </Lepes>

          <Lepes cim="Az eredő nagysága">
            <p>
              Mind a négy erő lefelé mutat, tehát mind negatív{" "}
              <M>{"y"}</M> irányú:
            </p>
            <MB>{"R_y = -4\\cdot 11 = -44\\ \\text{kN}\\quad(\\downarrow)"}</MB>
          </Lepes>

          <Lepes cim="Nyomaték az origóra">
            <MB>{"M^{(O)} = \\sum x_i F_{iy} = (2 + 3 + 4 + 5)\\cdot(-11) = -154\\ \\text{kNm}"}</MB>
          </Lepes>

          <Lepes cim="Az eredő helye">
            <p>
              Az eredőnek ugyanezt a nyomatékot kell adnia az origóra, ha a{" "}
              <M>{"x_R"}</M> helyen működik:
            </p>
            <MB>{"x_R R_y = M^{(O)} \\quad\\Rightarrow\\quad x_R = \\frac{-154}{-44} = 3{,}5\\ \\text{m}"}</MB>
          </Lepes>
        </KidolgozottFeladat>

        {/* ---- GYF-3 ---- */}
        <KidolgozottFeladat
          jel="GYF‑3"
          ido="4 perc"
          forras="A1. gyakorlat"
          cim="Szétszórt erőrendszer redukálása az origóra"
          feladat={
            <p>
              Redukáld az ábrán látható erőrendszert az origóra! Döntsd el, mi
              lesz az erőrendszer eredője, és számítsd ki!
            </p>
          }
          abra={
            <AbraKeret cim="Négy erő, mindegyik tengelyirányú, de más-más hatásvonalon.">
              <AbraSzetszort />
            </AbraKeret>
          }
          tanulsag={
            <p>
              A negatív <M>{"x_0"}</M> nem hiba: azt jelenti, hogy az eredő
              hatásvonala az origótól <strong>balra</strong>, 21 méterre metszi
              az <M>{"x"}</M> tengelyt. Ha csak a távolságot kérdezik, 21 m a
              válasz — de mindig írd oda, melyik oldalon, különben az
              információ fele elvész.
            </p>
          }
        >
          <Lepes cim="Az eredő komponensei">
            <p>
              Csak a vízszintes erők adnak <M>{"R_x"}</M>-et, és csak a
              függőlegesek <M>{"R_y"}</M>-t:
            </p>
            <MB>{"R_x = 23 + 20 = 43\\ \\text{kN}\\quad(\\rightarrow)"}</MB>
            <MB>{"R_y = -9 + 19 = 10\\ \\text{kN}\\quad(\\uparrow)"}</MB>
          </Lepes>

          <Lepes cim="Az eredő nagysága és iránya">
            <MB>{"R = \\sqrt{43^2 + 10^2} = 44{,}15\\ \\text{kN}"}</MB>
            <MB>{"\\alpha_R = \\operatorname{arctg}\\frac{10}{43} = 13{,}09^\\circ"}</MB>
          </Lepes>

          <Lepes cim="Nyomaték az origóra">
            <p>
              A vízszintes erő nyomatéka <M>{"-y F_x"}</M>, a függőlegesé{" "}
              <M>{"x F_y"}</M>. Menjünk végig sorban a négy erőn:
            </p>
            <MB>{"M^{(O)} = -7\\cdot 23 + 8\\cdot(-9) - (-4)\\cdot 20 + (-3)\\cdot 19"}</MB>
            <MB>{"M^{(O)} = -161 - 72 + 80 - 57 = -210\\ \\text{kNm}"}</MB>
          </Lepes>

          <Lepes cim="Az eredő típusa és a hatásvonala">
            <p>
              Mivel <M>{"\\underline{R} \\neq 0"}</M>, az eredő egyetlen erő. A
              hatásvonala ott metszi az <M>{"x"}</M> tengelyt, ahol ugyanazt a
              nyomatékot adja:
            </p>
            <MB>{"x_0 = \\frac{M^{(O)}}{R_y} = \\frac{-210}{10} = -21\\ \\text{m}"}</MB>
          </Lepes>
        </KidolgozottFeladat>

        {/* ---- GYF-4 ---- */}
        <KidolgozottFeladat
          jel="GYF‑4"
          ido="10 perc"
          forras="A1. gyakorlat"
          cim="Ugyanaz az ábra, háromféle adattal — mindhárom eset"
          feladat={
            <>
              <p>
                Redukáld az ábrán látható erőket és forgatónyomatékot az
                origóra! Döntsd el, mi lesz az erőrendszer eredője, és számítsd
                ki! A három hatásvonal a szaggatott háromszög három oldala, az{" "}
                <M>{"M"}</M> pedig az óramutatóval ellentétesen forgat.
              </p>
              <ul className="mt-2 space-y-1 text-[14px]">
                <li>
                  <strong>a)</strong>{" "}
                  <M>{"F_1 = 12{,}81\\ \\text{kN},\\ F_2 = 18{,}87\\ \\text{kN},\\ F_3 = 24{,}00\\ \\text{kN},\\ M = 17\\ \\text{kNm}"}</M>
                </li>
                <li>
                  <strong>b)</strong>{" "}
                  <M>{"F_1 = 6{,}403\\ \\text{kN},\\ F_2 = 9{,}434\\ \\text{kN},\\ F_3 = 12{,}00\\ \\text{kN},\\ M = 0"}</M>
                </li>
                <li>
                  <strong>c)</strong>{" "}
                  <M>{"F_1 = 4{,}4\\ \\text{kN},\\ F_2 = 6{,}6\\ \\text{kN},\\ F_3 = 10{,}1\\ \\text{kN},\\ M = 14\\ \\text{kNm}"}</M>
                </li>
              </ul>
            </>
          }
          abra={
            <AbraKeret cim="A három erő hatásvonala a háromszög három oldala.">
              <AbraHaromszog />
            </AbraKeret>
          }
          tanulsag={
            <p>
              Az a) és a b) adatsornál az erők kiegyenlítik egymást, a rendszer
              mégsem egyensúlyi: mindkét esetben erőpár marad. A c) esetben már
              az erők sem oltják ki egymást, ezért ott egyetlen erő az eredő. A
              tanulság: az <M>{"\\sum F_{ix} = \\sum F_{iy} = 0"}</M>{" "}
              önmagában soha nem jelent egyensúlyt — a nyomatéki egyenletet
              mindig fel kell írni mellé.
            </p>
          }
        >
          <Lepes cim="A geometria: a hatásvonalak">
            <p>
              A három hatásvonal a <M>{"(-3;\\,8)"}</M>, <M>{"(2;\\,0)"}</M> és{" "}
              <M>{"(-3;\\,-4)"}</M> csúcsú háromszög három oldala. Az{" "}
              <M>{"F_1"}</M> és az <M>{"F_2"}</M> hatásvonala egyaránt átmegy a{" "}
              <M>{"(2;\\,0)"}</M> ponton, az <M>{"F_3"}</M> pedig függőleges, az{" "}
              <M>{"x = -3\\ \\text{m}"}</M> egyenesen. Az oldalak
              meredeksége adja a komponensek arányait:{" "}
              <M>{"\\sqrt{5^2+4^2} = \\sqrt{41}"}</M> az{" "}
              <M>{"F_1"}</M>-hez, <M>{"\\sqrt{5^2+8^2} = \\sqrt{89}"}</M> az{" "}
              <M>{"F_2"}</M>-höz.
            </p>
          </Lepes>

          <Lepes cim="a) Komponensek">
            <MB>{"F_{1x} = -F_1\\frac{5}{\\sqrt{41}} = -10{,}00,\\qquad F_{1y} = -F_1\\frac{4}{\\sqrt{41}} = -8{,}00\\ \\text{kN}"}</MB>
            <MB>{"F_{2x} = F_2\\frac{5}{\\sqrt{89}} = 10{,}00,\\qquad F_{2y} = -F_2\\frac{8}{\\sqrt{89}} = -16{,}00\\ \\text{kN}"}</MB>
            <MB>{"F_{3x} = 0,\\qquad F_{3y} = 24{,}00\\ \\text{kN}"}</MB>
            <p>
              Az összegük mindkét irányban zérus:{" "}
              <M>{"R_x = 0"}</M>, <M>{"R_y = 0"}</M>. Eddig minden úgy fest,
              mintha egyensúly volna.
            </p>
          </Lepes>

          <Lepes cim="a) A nyomaték — itt derül ki az igazság">
            <p>
              Az <M>{"F_1"}</M> és az <M>{"F_2"}</M> hatásvonala átmegy a{" "}
              <M>{"(2;\\,0)"}</M> ponton, ezért a nyomatékuk{" "}
              <M>{"2 F_{iy}"}</M>. Az <M>{"F_3"}</M> függőleges, az{" "}
              <M>{"x = -3"}</M> egyenesen:
            </p>
            <MB>{"M^{(O)} = 2\\cdot(-8{,}00) + 2\\cdot(-16{,}00) + (-3)\\cdot 24{,}00 + 17"}</MB>
            <MB>{"M^{(O)} = -16 - 32 - 72 + 17 = -103\\ \\text{kNm}"}</MB>
            <p>
              Az eredő tehát <strong>forgatónyomaték</strong>: erő nincs, de a
              rendszer −103 kNm-mel forgat, és ez minden pontra ugyanennyi.
            </p>
          </Lepes>

          <Lepes cim="b) Ugyanaz feleakkora erőkkel, nyomaték nélkül">
            <p>
              A b) adatsorban az erők pontosan a háromszög oldalvektorainak
              hosszával egyeznek meg, így az összegük megint zérus:
            </p>
            <MB>{"F_{1} = (-5;\\,-4),\\quad F_{2} = (5;\\,-8),\\quad F_{3} = (0;\\,12)\\ \\text{kN}"}</MB>
            <MB>{"M^{(O)} = 2\\cdot(-4) + 2\\cdot(-8) + (-3)\\cdot 12 + 0 = -60\\ \\text{kNm}"}</MB>
            <p>
              Az eredő itt is erőpár. Hiába zárul be a három erő vektorháromszöge,
              a hatásvonalaik nem egy ponton mennek át, ezért a forgatóhatás
              megmarad.
            </p>
          </Lepes>

          <Lepes cim="c) Most már marad erő is">
            <MB>{"F_{1} = (-3{,}436;\\,-2{,}749),\\quad F_{2} = (3{,}498;\\,-5{,}597),\\quad F_{3} = (0;\\,10{,}1)\\ \\text{kN}"}</MB>
            <MB>{"R_x = 0{,}062\\ \\text{kN},\\qquad R_y = 1{,}754\\ \\text{kN}"}</MB>
            <MB>{"M^{(O)} = 2\\cdot(-2{,}749) + 2\\cdot(-5{,}597) + (-3)\\cdot 10{,}1 + 14 = -32{,}99\\ \\text{kNm}"}</MB>
          </Lepes>

          <Lepes cim="c) Az eredő és a hatásvonala">
            <MB>{"R = \\sqrt{0{,}062^2 + 1{,}754^2} = 1{,}755\\ \\text{kN},\\qquad \\alpha_R = 87{,}98^\\circ"}</MB>
            <MB>{"x_0 = \\frac{M^{(O)}}{R_y} = \\frac{-32{,}99}{1{,}754} = -18{,}80\\ \\text{m}"}</MB>
            <p>
              Az eredő tehát egyetlen, majdnem függőleges erő, amelynek
              hatásvonala az origótól 18,8 méterrel balra metszi az{" "}
              <M>{"x"}</M> tengelyt.
            </p>
          </Lepes>
        </KidolgozottFeladat>

        <Kiemelo tipus="tipp" cim="Mi kellene ahhoz, hogy tényleg zérusrendszer legyen?">
          <p>
            A b) esetben az erők kioltják egymást, de a nyomaték megmarad. Ha az{" "}
            <M>{"F_3"}</M> hatásvonala nem az <M>{"x = -3"}</M> egyenes lenne,
            hanem átmenne a másik két erő metszéspontján, a{" "}
            <M>{"(2;\\,0)"}</M> ponton, akkor mindhárom erő egy ponton menne át.
            Ekkor a közös pontra vett nyomatékuk nulla volna, és mivel az
            erőösszeg is nulla, a rendszer valódi zérusrendszerré válna. Ez a
            különbség a „nem mozdul el” és az „egyensúlyban van” között.
          </p>
        </Kiemelo>

        {/* ---- GYF-5 ---- */}
        <KidolgozottFeladat
          jel="GYF‑5"
          ido="6 perc"
          forras="A1. gyakorlat"
          cim="Térbeli erőrendszer eredője"
          feladat={
            <p>
              Határozd meg az ábrán látható térbeli erőrendszer eredőjét! A hat
              erő a hasáb élei mentén hat.
            </p>
          }
          abra={
            <AbraKeret cim="Hat erő a hasáb élein, zárt láncot alkotva.">
              <AbraTerbeliErorendszer />
            </AbraKeret>
          }
          tanulsag={
            <p>
              Ugyanaz a csapda, mint a GYF‑4-ben, csak térben: mind a három
              erőegyenlet nullát ad, mégsem egyensúlyi a rendszer. A
              nyomatékvektort a három komponense már egyértelműen meghatározza,
              és ez lesz az eredő.
            </p>
          }
        >
          <Lepes cim="Az erők összege">
            <p>
              Az erők párba állnak: mindegyik irányban van egy oda- és egy
              visszamutató, azonos nagyságú erő.
            </p>
            <MB>{"\\sum F_{ix} = F_1 - F_4 = 7 - 7 = 0\\ \\text{N}"}</MB>
            <MB>{"\\sum F_{iy} = -F_2 + F_5 = -6 + 6 = 0\\ \\text{N}"}</MB>
            <MB>{"\\sum F_{iz} = F_3 - F_6 = 8 - 8 = 0\\ \\text{N}"}</MB>
            <p>
              Az eredő erő tehát <M>{"\\underline{R} = 0"}</M>.
            </p>
          </Lepes>

          <Lepes cim="Nyomaték az x tengelyre">
            <p>
              Az <M>{"x"}</M> tengely körül csak az <M>{"y"}</M> és{" "}
              <M>{"z"}</M> irányú erők forgatnak, vagyis az{" "}
              <M>{"F_5"}</M> és az <M>{"F_6"}</M>:
            </p>
            <MB>{"\\sum M_x^{(O)} = -F_5\\cdot 4 - F_6\\cdot 3 = -6\\cdot 4 - 8\\cdot 3 = -48\\ \\text{Nm}"}</MB>
          </Lepes>

          <Lepes cim="Nyomaték az y és a z tengelyre">
            <MB>{"\\sum M_y^{(O)} = -F_3\\cdot 3{,}5 - F_4\\cdot 4 = -8\\cdot 3{,}5 - 7\\cdot 4 = -56\\ \\text{Nm}"}</MB>
            <MB>{"\\sum M_z^{(O)} = -F_1\\cdot 3 - F_2\\cdot 3{,}5 = -7\\cdot 3 - 6\\cdot 3{,}5 = -42\\ \\text{Nm}"}</MB>
          </Lepes>

          <Lepes cim="Az eredő">
            <p>
              Az eredő tiszta forgatónyomaték, amelyet a három komponense
              egyértelműen meghatároz:
            </p>
            <MB>{"|\\underline{M}| = \\sqrt{(-48)^2 + (-56)^2 + (-42)^2} = 84{,}88\\ \\text{Nm}"}</MB>
          </Lepes>
        </KidolgozottFeladat>
      </Szakasz>

      {/* ==================== KALKULÁTOROK ==================== */}
      <Szakasz
        id="kalkulator"
        cimke="3. rész"
        cim="Kalkulátorok"
        bevezeto="Két eszköz: az egyikkel tetszőleges síkbeli erőrendszert tudsz redukálni, a másikkal térbeli nyomatékot számolni."
      >
        <div className="space-y-8">
          <div>
            <h3 className="mb-2 text-[16px] font-semibold text-petrol-900">
              Síkbeli erőrendszer redukálása
            </h3>
            <p className="mb-3 text-[14px] text-petrol-600">
              Add meg az erők helyét és irányát, a program pedig kiszámolja az
              eredőt, a nyomatékot és a hatásvonal helyét — és megmondja, a
              három eset melyikébe esik a rendszer. Alaphelyzetben a GYF‑3
              adatai vannak betöltve.
            </p>
            <ErorendszerRedukalo />
          </div>

          <div>
            <h3 className="mb-2 text-[16px] font-semibold text-petrol-900">
              Térbeli nyomaték
            </h3>
            <p className="mb-3 text-[14px] text-petrol-600">
              A vektoriális szorzat mindhárom komponense, behelyettesítve.
              Próbáld ki, mi történik, ha az egyik erőkomponenst nullára
              állítod.
            </p>
            <TerbeliNyomatekKalk />
          </div>
        </div>
      </Szakasz>

      {/* ==================== GYAKORLÁS ==================== */}
      <Szakasz
        id="gyakorlas"
        cimke="4. rész"
        cim="Gyakorlás"
        bevezeto="Öt feladattípus, mindegyik új számokkal minden indításkor. Az első kettő rövid, a harmadik és a negyedik már zárthelyi-méretű."
        className="bg-white"
      >
        <GyakorloSzekcio />

        <Kiemelo tipus="kulcs" cim="Mikor mehetsz tovább">
          <p>
            Akkor vagy kész ezzel a modullal, ha a „redukálás az origóra”
            feladatot végig tudod számolni segítség nélkül, és a végén meg tudod
            mondani, hogy az eredő erő, erőpár vagy zérusrendszer. A következő
            modulban ugyanezt fogod csinálni, csak az erők megoszló teherként
            lesznek megadva — előbb az eredőjüket kell megkeresni, és onnantól
            minden ugyanígy megy.
          </p>
        </Kiemelo>
      </Szakasz>
    </>
  );
}
