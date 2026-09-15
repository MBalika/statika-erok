import { ModulFejlec, SzakaszSav } from "@/components/ModulKeret";
import {
  Szakasz,
  Kartya,
  Kiemelo,
  AbraKeret,
  KetOszlop,
  TankonyvJel,
  Szotar,
} from "@/components/ui/Elemek";
import { M, MB, KepletDoboz } from "@/components/ui/Keplet";
import { KidolgozottFeladat, Lepes } from "@/components/KidolgozottFeladat";
import NyomatekFelfedezo from "@/components/abrak/NyomatekFelfedezo";
import ErorendszerRedukalo from "@/components/abrak/ErorendszerRedukalo";
import TerbeliNyomatekKalk from "@/components/abrak/TerbeliNyomatekKalk";
import TerbeliEredoOsztalyozo from "@/components/abrak/TerbeliEredoOsztalyozo";
import ErroparAlakito from "@/components/nyomatek/ErroparAlakito";
import JatekMerleg from "@/components/nyomatek/JatekMerleg";
import {
  AbraErokar,
  AbraEropar,
  AbraHaromEset,
  AbraTerbeliNyomatekElv,
  AbraTengelyre,
  AbraEroparValtozatok,
  AbraEltolasSzabaly,
  AbraNegyEsetTer,
} from "@/components/abrak/NyomatekAbrak";
import {
  AbraParhuzamos,
  AbraSzetszort,
  AbraHaromszog,
  AbraTerbeliErorendszer,
  AbraNegyfele,
  AbraDinam,
} from "@/components/abrak/NyomatekFeladatAbrak";
import GyakorloSzekcio from "@/components/nyomatek/GyakorloSzekcio";
import Kviz from "@/components/Kviz";
import Hibakereso from "@/components/Hibakereso";
import { KVIZ, HIBAK } from "@/components/nyomatek/KvizAdatok";
import FilmGyf3 from "@/components/nyomatek/FilmGyf3";
import FilmGyf2 from "@/components/nyomatek/FilmGyf2";
import FilmGyf4 from "@/components/nyomatek/FilmGyf4";
import FilmNegyfele from "@/components/nyomatek/FilmNegyfele";
import FilmDinam from "@/components/nyomatek/FilmDinam";
import { Film3DVektorSzorzat, Film3DHasab, TengelyNyomatekFelfedezo3D } from "@/components/harom/Film3D";
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
          "Forgatónyomaték és az erő karja",
          "Erőpár, nyomaték erőpárrá alakítása",
          "Redukálás, dinámrendszer",
          "Az eredő három esete",
          "Nyomaték tengelyre",
          "Térben négy eset: erőcsavar",
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
          cimke="Nyomaték egy pontra, síkban (tankönyv 3.43)"
          keplet={"M^{(O)} = \\pm F\\,k"}
        />

        <TankonyvJel fejezet="3.3.2">
          <p>
            A könyv a pontot alsó indexbe írja: <M>{"\\underline{M}_P = \\underline{r}\\times\\underline{F}"}</M>, síkban{" "}
            <M>{"M_P = \\pm|\\underline{F}|\\,k"}</M>. Itt a gyakorlat jelölését használjuk, a pont felső indexben:{" "}
            <M>{"M^{(O)}"}</M> — ugyanazt jelenti. Az erő karja mindkét helyen <M>{"k"}</M>, a hatásvonal és a pont
            távolsága. A vektoriális szorzatból a nagyság:{" "}
            <M>{"|M_P| = |\\underline{F}|\\,|\\underline{r}|\\sin\\varphi"}</M>, ahol{" "}
            <M>{"k = |\\underline{r}|\\sin\\varphi"}</M> az <M>{"\\underline{r}"}</M> vektornak az erőre merőleges vetülete.
          </p>
        </TankonyvJel>

        <AbraKeret
          szam={1}
          cim="Ugyanaz az erőkar, ellentétes forgásirány — az előjel dönti el, melyikről van szó."
        >
          <AbraErokar />
        </AbraKeret>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <Kartya cimke="1. út" cim="Erő × kar, előjel szemléletből">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">
              A tankönyv gyakorlati módszere: az origóba tűt szúrva eldöntjük, merre
              forgatná az erő a papírt (↶ pozitív, ↷ negatív), a nagyságot pedig
              az erő és a karja <em>abszolút értékének</em> szorzataként írjuk fel:{" "}
              <M>{"M_P = \\pm|\\underline{F}|\\,k"}</M>. Az előjel a rajzról, a szám a
              képletből.
            </p>
          </Kartya>
          <Kartya cimke="2. út" cim="Komponensekkel, előjel a képletből">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">
              Ha az erő támadáspontja <M>{"P(x;\\,y)"}</M>, a nyomaték a két
              komponens nyomatékának összege: a függőleges komponens karja{" "}
              <M>{"x"}</M>, a vízszintesé <M>{"y"}</M>. Az előjelet itt a képlet
              hozza magával — a könyv ezt nem nevezi néven, mi Varignon-tételként
              hivatkozunk rá.
            </p>
          </Kartya>
        </div>

        <KepletDoboz
          cimke="Nyomaték komponensekkel (a könyv 3.41 z-komponense)"
          keplet={"M^{(O)} = x\\,F_y - y\\,F_x"}
        />

        <Kiemelo tipus="tipp" cim="Terület-trükk a karhoz (tankönyv 3.46)">
          <p>
            Ha a hatásvonal a két tengelyt <M>{"a"}</M> és <M>{"b"}</M> távolságban
            metszi, az origó, a két metszéspont derékszögű háromszöget alkot. A
            területét kétféleképpen felírva a kar kiesik:{" "}
            <M>{"\\dfrac{a\\,b}{2} = \\dfrac{\\sqrt{a^2+b^2}\\,k}{2}\\ \\Rightarrow\\ k = \\dfrac{a\\,b}{\\sqrt{a^2+b^2}}"}</M>.
            Nem kell szög, nem kell szinusz. A GYF‑A ezt mutatja meg számokkal.
          </p>
        </Kiemelo>

        <Szotar
          sorok={[
            { itt: <>zérusrendszer</>, konyv: <>egyensúlyi erőrendszer, az eredője zéruserő <M>{"\\underline{O}"}</M></>, megjegyzes: "Ugyanaz: R = 0 és M = 0." },
            { itt: <>redukált erő és nyomaték, <M>{"(\\underline{R},\\ M^{(O)})"}</M></>, konyv: <>társerő és társnyomaték, <M>{"(\\underline{F}_A,\\ \\underline{M}_A)"}</M></>, megjegyzes: "A társnyomaték az A ponton átmenő társerőhöz tartozik." },
            { itt: <>Varignon-tétel</>, konyv: <>nem nevezi néven: a nyomaték a komponensek nyomatékainak összege</>, megjegyzes: "A 3.7. ábra harmadik módszere." },
            { itt: <>erőkar</>, konyv: <>az erő karja, <M>{"k"}</M></>, megjegyzes: "A hatásvonal és a pont távolsága." },
            { itt: <>erőpár nyomatéka</>, konyv: <><M>{"\\underline{M}_P = \\underline{r}_{BA}\\times\\underline{F}_A"}</M>, szabad vektor</>, megjegyzes: "Síkban ↶ / ↷ félköríves nyíllal." },
          ]}
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

        <div className="proza text-[15px] leading-relaxed text-petrol-700">
          <p>
            Hogy miért nem függ a nyomaték a ponttól, két sorban látszik. Az{" "}
            <M>{"A"}</M> és <M>{"B"}</M> pontban ható <M>{"\\underline{F}_A"}</M>,{" "}
            <M>{"\\underline{F}_B = -\\underline{F}_A"}</M> erők nyomatéka egy tetszőleges{" "}
            <M>{"P"}</M> pontra:
          </p>
        </div>
        <MB>{"\\underline{M}_P = \\underline{r}_{PA}\\times\\underline{F}_A + \\underline{r}_{PB}\\times(-\\underline{F}_A) = (\\underline{r}_{PA} - \\underline{r}_{PB})\\times\\underline{F}_A = \\underline{r}_{BA}\\times\\underline{F}_A"}</MB>
        <div className="proza text-[15px] leading-relaxed text-petrol-700">
          <p>
            A <M>{"P"}</M> pont kiesett: csak a <M>{"B"}</M>-ből <M>{"A"}</M>-ba mutató
            vektor és az erő maradt. Az egyenértékűségi kijelentés tehát{" "}
            <M>{"(\\underline{F}_A, \\underline{F}_B) \\ekv M"}</M>, és a nagyság{" "}
            <M>{"|M| = F\\,d"}</M>.
          </p>
        </div>

        <h4 className="mt-8 text-[16px] font-semibold text-petrol-900">
          Nyomaték erőpárrá alakítása
        </h4>
        <div className="proza mt-2 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Visszafelé is megy: egy adott <M>{"M"}</M> nyomatékot bármikor
            helyettesíthetünk egy erőpárral. A tankönyv 3.9. ábrája három
            változatot mutat, attól függően, mi adott.
          </p>
        </div>
        <AbraKeret szam={3} cim="Nyomaték erőpárrá alakítása a tankönyv 3.9. ábrája szerint: (a) adott hatásvonalak, (b) adott erő, (c) szabadon választott irány.">
          <AbraEroparValtozatok />
        </AbraKeret>
        <div className="mt-2 grid gap-4 lg:grid-cols-3">
          <Kartya cimke="a)" cim="Adott a két hatásvonal">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">
              A kar <M>{"d"}</M> ismert, az erők nagysága <M>{"F = |M|/d"}</M>. Az
              irányukat úgy választjuk, hogy az erőpár <M>{"M"}</M>-mel azonos
              értelemben forgasson.
            </p>
          </Kartya>
          <Kartya cimke="b)" cim="Adott az egyik erő">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">
              A másik erő az ellentettje; a helyét a kar adja:{" "}
              <M>{"d = |M|/|F_1|"}</M>. Ha rossz oldalra tesszük, az erőpár a
              kívánttal ellentétesen forgat — a rajz elárulja.
            </p>
          </Kartya>
          <Kartya cimke="c)" cim="Az irány szabadon választható">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">
              Csak az erő nagysága adott: az irányt tetszőlegesen vehetjük fel. A
              kar nem függ tőle, mindig <M>{"|M|/F"}</M> — csak a hatásvonalak
              fordulnak el vele együtt.
            </p>
          </Kartya>
        </div>

        <div className="mt-6">
          <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">
            Próbáld ki – nyomatékból erőpár
          </p>
          <ErroparAlakito />
        </div>

        <Kiemelo tipus="kulcs" cim="Több nyomaték eredője">
          <p>
            Ha az erőrendszert csak nyomatékok alkotják, azok szabad vektorként egy
            közös pontba tolhatók, és komponensenként összeadódnak, mint a közös
            metszéspontú erők: <M>{"(M_1, M_2, M_3) \\ekv M"}</M>,{" "}
            <M>{"\\sum M_{ix} = M_x"}</M> stb. Síkban ez egyetlen előjeles összeg.
          </p>
        </Kiemelo>

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
          cimke="Az erőrendszer redukálása az O pontba (társerő és társnyomaték)"
          keplet={
            "(\\underline{F}_1,\\dots,\\underline{F}_n, M_1,\\dots,M_m) \\ekv (\\underline{R},\\ M^{(O)})"
          }
          behelyettesitve={
            "\\Fx \\sum F_{ix} = R_x,\\qquad \\Fy \\sum F_{iy} = R_y,\\qquad \\Mp{O} \\sum \\left( x_i F_{iy} - y_i F_{ix} \\right) + \\sum M_j = M^{(O)}"
          }
        />

        <TankonyvJel fejezet="3.3.3–3.3.4" cim="Dinámrendszer: erők és nyomatékok együtt">
          <p>
            Az erőket és a nyomatékokat együtt a könyv <strong>dinámoknak</strong>{" "}
            nevezi, a nyomatékot is tartalmazó erőrendszert{" "}
            <strong>dinámrendszernek</strong>. A koncentrált <M>{"M_j"}</M>{" "}
            nyomatékok <em>csak</em> a nyomatéki egyenletbe kerülnek be (erőpárrá
            alakítva a vetületi egyenletben kiejtenék egymást), ott viszont
            előjelesen, karral szorzás nélkül. A síkbeli párhuzamos erőrendszerbe
            a nyomatékokat is beleértjük — a GYF‑B a tankönyv 3.10. ábráját
            számolja végig négyféle részhalmazzal.
          </p>
        </TankonyvJel>

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

        <AbraKeret szam={4} cim="Minden síkbeli erőrendszer e három eset valamelyikébe esik.">
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

        <Kiemelo tipus="tipp" cim="Melyik oldalra tolódik az erő? (tankönyv 3.11. ábra)">
          <p>
            Erő + nyomaték eredője ugyanakkora erő, <M>{"d = M/F"}</M>-fel eltolva.
            Az oldalt a tankönyv félköríves-nyíl szabálya adja: az erő
            vektorának <em>kezdőpontjából hátrafelé</em> (az erővel ellentétes
            irányba) indítunk egy félköríves nyilat, amely <M>{"M"}</M>-mel azonos
            irányba forgat — amelyik oldalra a nyíl vége kerül, ott van az eredő.
            A bizonyítás: <M>{"M"}</M>-et erőpárrá alakítjuk úgy, hogy az egyik
            erő <M>{"\\underline{F}_1 = -\\underline{F}"}</M> legyen; ez <M>{"\\underline{F}"}</M>-fel
            zéruserőt ad, és marad a pár másik tagja: <M>{"\\underline{F}_2 \\ekv \\underline{R}"}</M>.
          </p>
        </Kiemelo>
        <AbraKeret szam={5} cim="Egyetlen erő és nyomaték eredője: (a) a félköríves nyíl kijelöli az oldalt; (b) ugyanez erőpárrá alakítással bizonyítva.">
          <AbraEltolasSzabaly />
        </AbraKeret>

        <div className="mt-2 grid gap-4 lg:grid-cols-2">
          <Kartya cimke="Kvalitatív szabály 1" cim="Azonos irányú párhuzamos erők">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">
              Az eredő a két hatásvonal <strong>között</strong> van, a nagyobb
              erőhöz közelebb; egyenlő erőknél középen. (A GYF‑2 négy egyenlő
              erőjének eredője ezért a számtani középen áll.)
            </p>
          </Kartya>
          <Kartya cimke="Kvalitatív szabály 2" cim="Ellentétes irányú párhuzamos erők">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">
              Az eredő a két hatásvonalon <strong>kívül</strong> esik, a nagyobb
              erő oldalán. Ha a két erő egyenlő nagyságú, nincs eredő erő — az
              erőpár.
            </p>
          </Kartya>
        </div>

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
          <AbraKeret szam={6} cim="A nyomatékvektor merőleges az r és az F síkjára.">
            <AbraTerbeliNyomatekElv />
          </AbraKeret>
        </KetOszlop>

        {/* --- 2.7 --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">
          2.7 Nyomaték tengelyre
        </h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            A három komponens a három koordinátatengelyre vett nyomaték volt. De
            tengely bármilyen irányú lehet. Egy <M>{"t"}</M> tengelyre vett
            nyomatékot úgy kapunk, hogy a tengely egy tetszőleges{" "}
            <M>{"Q"}</M> pontjára kiszámoljuk a nyomatékvektort, majd azt a tengely
            irányába eső <M>{"\\underline{e}_t"}</M> egységvektorra vetítjük:
          </p>
        </div>
        <KepletDoboz
          cimke="Nyomaték tengelyre (tankönyv 3.42)"
          keplet={"M_t = \\underline{M}_Q\\cdot\\underline{e}_t = M_{Qx}e_{tx} + M_{Qy}e_{ty} + M_{Qz}e_{tz}"}
        />
        <div className="proza text-[15px] leading-relaxed text-petrol-700">
          <p>
            A <M>{"Q"}</M> pont helye a tengelyen mindegy: ha a tengely mentén
            odébb visszük, <M>{"\\underline{M}_Q"}</M> csak egy tengelyre merőleges
            vektorral változik, aminek a vetülete nulla. Az előjel: a tengely
            pozitív vége felől nézve az óramutatóval ellentétes forgatás a
            pozitív. Két megállapítás következik, amelyeket a tankönyv külön
            kiemel:
          </p>
        </div>
        <AbraKeret szam={7} cim="Egy erő csak a hozzá képest kitérő tengely körül forgat.">
          <AbraTengelyre />
        </AbraKeret>
        <Kiemelo tipus="kulcs" cim="Mikor nem forgat egy erő egy tengely körül?">
          <ul className="list-disc space-y-1 pl-5">
            <li>Ha a hatásvonala <strong>metszi</strong> a tengelyt (a karja nulla).</li>
            <li>Ha <strong>párhuzamos</strong> vele (a tengely irányában tol, nem forgat).</li>
          </ul>
          <p className="mt-2">
            Következmény: egy erő csakis a hozzá képest <strong>kitérő</strong>{" "}
            helyzetű tengelyek körül forgat. Ezért hiányzott a GYF‑1-ben minden
            komponensképletből az adott tengellyel párhuzamos erőkomponens.
          </p>
        </Kiemelo>
        <div className="mt-6">
          <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">
            Próbáld ki 3D-ben – erő, tengely, vetület
          </p>
          <TengelyNyomatekFelfedezo3D />
        </div>

        {/* --- 2.8 --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">
          2.8 Térben négy eset: az erőcsavar
        </h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Térben a redukálás ugyanúgy megy, csak a társerő és a társnyomaték is
            háromkomponensű: három vetületi és három, az{" "}
            <M>{"A"}</M> ponton átmenő tengelyekre felírt nyomatéki egyenlet. A
            döntés viszont már nem három-, hanem négyesélyes, és a negyedik
            esetnek síkban nincs párja.
          </p>
        </div>
        <AbraKeret szam={8} cim="A térbeli eredő négy esete a társerő és a társnyomaték skaláris szorzata alapján.">
          <AbraNegyEsetTer />
        </AbraKeret>
        <div className="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Kartya cimke="1. eset" cim="Egyensúly">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">
              <M>{"\\underline{F}_A = 0"}</M> és <M>{"\\underline{M}_A = 0"}</M>. Bármely
              más pontra ugyanez.
            </p>
          </Kartya>
          <Kartya cimke="2. eset" cim="Nyomaték">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">
              <M>{"\\underline{F}_A = 0"}</M>, <M>{"\\underline{M}_A \\neq 0"}</M>: az
              eredő a nyomatékvektor, pontfüggetlen. Ez a GYF‑5.
            </p>
          </Kartya>
          <Kartya cimke="3. eset" cim="Erő">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">
              <M>{"\\underline{F}_A \\neq 0"}</M> és{" "}
              <M>{"\\underline{F}_A\\cdot\\underline{M}_A = 0"}</M>: a nyomaték merőleges az
              erőre (vagy nulla), az erő eltolásával eltüntethető — mint síkban.
            </p>
          </Kartya>
          <Kartya cimke="4. eset" cim="Erőcsavar">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">
              <M>{"\\underline{F}_A\\cdot\\underline{M}_A \\neq 0"}</M>: a nyomaték erőre
              merőleges részét eltolással elnyeljük, de marad egy, az erővel{" "}
              <em>párhuzamos</em> tengely körül forgató nyomaték. Erő + vele
              párhuzamos nyomaték: mint a facsavar behajtása.
            </p>
          </Kartya>
        </div>
        <Kiemelo tipus="kulcs" cim="A skaláris szorzat nem függ a ponttól">
          <p>
            Más pontra redukálva a társnyomatékhoz az <M>{"\\underline{F}_A"}</M>-ra
            merőleges vektor adódik hozzá, aminek <M>{"\\underline{F}_A"}</M>-val vett
            skaláris szorzata nulla — ezért <M>{"\\underline{F}_A\\cdot\\underline{M}_A"}</M>{" "}
            értéke minden pontra ugyanaz, és a döntés egyértelmű. A Kalkulátorok
            részben egy osztályozó eszköz számolja ezt bármilyen adatra.
          </p>
        </Kiemelo>
      </Szakasz>

      {/* ==================== KIDOLGOZOTT FELADATOK ==================== */}
      <Szakasz
        id="peldak"
        cimke="2. rész"
        cim="Kidolgozott feladatok"
        bevezeto="A gyakorlat öt feladata, kiegészítve a tankönyv két példájával (GYF‑A és GYF‑B). Minden megoldás az egyenértékűségi kijelentéssel kezdődik. A GYF‑4 különösen fontos: ugyanazt az ábrát számolja végig háromféle adattal, és ezzel mind a három esetet megmutatja."
        className="bg-white"
      >
        {/* ---- GYF-A ---- */}
        <KidolgozottFeladat
          jel="GYF‑A"
          ido="5 perc"
          forras="Tankönyv 3.7. ábra"
          cim="M = −24 kNm négyféleképpen"
          feladat={
            <p>
              Az <M>{"\\underline{r} = (2;\\ 3)\\ \\text{m}"}</M> támadáspontú{" "}
              <M>{"\\underline{F} = (6;\\ -3)\\ \\text{kN}"}</M> erő nyomatékát az origóra
              négy különböző módon számítsd ki, és győződj meg róla, hogy mind
              ugyanazt adja!
            </p>
          }
          abra={
            <AbraKeret cim="A tankönyv 3.7. ábrája: az erő karja d, a hatásvonal tengelymetszetei 8 m és 4 m.">
              <AbraNegyfele />
            </AbraKeret>
          }
          tanulsag={
            <p>
              Négy út, egy eredmény. Kézi számolásnál a leggyorsabb a{" "}
              <strong>tengelymetszetbe tolás</strong>: ott az egyik komponens
              karja nulla, a másiké leolvasható. A képlet a legbiztosabb (az
              előjelet is hozza), az erő×kar módszer pedig akkor jó, ha a kar a
              rajzról adódik — a terület-trükkel ez is gyors.
            </p>
          }
        >
          <Lepes cim="Mit keresünk">
            <p>
              Egyetlen erő nyomatéka egy pontra: <M>{"M_O"}</M>. A forgatási
              értelmet előre eldönthetjük: az origóba tűt szúrva az erő az
              óramutató járásával egyezően forgatná a papírt, tehát negatív
              számot várunk.
            </p>
          </Lepes>
          <Lepes cim="(i) Képlettel">
            <MB>{"M_O = x F_y - y F_x = 2\\cdot(-3) - 3\\cdot 6 = -6 - 18 = -24\\ \\text{kNm}"}</MB>
          </Lepes>
          <Lepes cim="(ii) Erő szorozva a karjával — a terület-trükk">
            <p>
              Az erő nagysága <M>{"F = \\sqrt{6^2 + (-3)^2} = 6,708\\ \\text{kN}"}</M>. A
              hatásvonal az x tengelyt 8 m-nél, az y tengelyt 4 m-nél metszi
              (ellenőrzés: <M>{"y - 3 = -\\tfrac{1}{2}(x - 2)"}</M>). A nagy derékszögű
              háromszög területét kétféleképpen felírva:
            </p>
            <MB>{"\\frac{8\\cdot 4}{2} = \\frac{\\sqrt{8^2 + 4^2}\\cdot d}{2}\\ \\Rightarrow\\ d = \\frac{32}{8,944} = 3,578\\ \\text{m}"}</MB>
            <MB>{"M_O = -6,708\\cdot 3,578 = -24,00\\ \\text{kNm}"}</MB>
          </Lepes>
          <Lepes cim="(iii) Komponensek a támadáspontban">
            <p>
              A vízszintes 6 kN karja a függőleges távolság (3 m), a függőleges 3
              kN karja a vízszintes távolság (2 m). Mindkettő az óramutató
              irányába forgat — az előjel szemléletből, a képletbe abszolút értékek:
            </p>
            <MB>{"M_O = -6\\cdot 3 - 3\\cdot 2 = -24\\ \\text{kNm}"}</MB>
          </Lepes>
          <Lepes cim="(iv) Komponensek a hatásvonal tengelymetszetében">
            <p>
              Az erő a hatásvonala mentén eltolható. Az x tengelyen (8; 0)-ban a
              vízszintes komponens karja nulla; az y tengelyen (0; 4)-ben a
              függőlegesé:
            </p>
            <MB>{"M_O = 0 - 3\\cdot 8 = -24\\ \\text{kNm},\\qquad M_O = -6\\cdot 4 + 0 = -24\\ \\text{kNm}"}</MB>
          </Lepes>
        </KidolgozottFeladat>

        <div className="my-8">
          <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Ugyanez filmen – a négy módszer egymás után</p>
          <FilmNegyfele />
        </div>

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
          <Lepes cim="Kijelentés: egyetlen erő nyomatéka az origóra">
            <p>
              Egy erő nyomatéka egy pontra a helyvektor és az erő vektoriális
              szorzata; a három komponens a három tengelyre vett nyomaték:
            </p>
            <MB>{"\\underline{M}_O = \\underline{r}\\times\\underline{F},\\qquad M_x = \\underline{M}_O\\cdot\\underline{i},\\ M_y = \\underline{M}_O\\cdot\\underline{j},\\ M_z = \\underline{M}_O\\cdot\\underline{k}"}</MB>
          </Lepes>

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

        <div className="my-8">
          <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Ugyanez 3D-ben – r × F forgatható jelenetben</p>
          <Film3DVektorSzorzat />
        </div>

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
            <MB>{"(\\underline{F}_1,\\ \\underline{F}_2,\\ \\underline{F}_3,\\ \\underline{F}_4) \\ekv \\underline{R}"}</MB>
          </Lepes>

          <Lepes cim="Vetületi egyenlet: az eredő nagysága">
            <p>
              Mind a négy erő lefelé mutat, tehát mind negatív{" "}
              <M>{"y"}</M> irányú:
            </p>
            <MB>{"\\Fy -11 - 11 - 11 - 11 = R_y \\;\\Rightarrow\\; R_y = -44\\ \\text{kN}\\quad(\\downarrow)"}</MB>
          </Lepes>

          <Lepes cim="Nyomatéki egyenlet az origóra">
            <p>
              Bal oldalon az erőrendszer nyomatéka, jobb oldalon az{" "}
              <M>{"x_R"}</M> helyen működő eredőé:
            </p>
            <MB>{"\\Mp{O} 2\\cdot(-11) + 3\\cdot(-11) + 4\\cdot(-11) + 5\\cdot(-11) = x_R\\cdot(-44)"}</MB>
          </Lepes>

          <Lepes cim="Az eredő helye">
            <MB>{"-154 = -44\\,x_R \\quad\\Rightarrow\\quad x_R = \\frac{-154}{-44} = 3,5\\ \\text{m}"}</MB>
          </Lepes>
        </KidolgozottFeladat>

        <div className="my-8">
          <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Ugyanez filmen – párhuzamos erők eredője</p>
          <FilmGyf2 />
        </div>

        {/* ---- GYF-B ---- */}
        <KidolgozottFeladat
          jel="GYF‑B"
          ido="8 perc"
          forras="Tankönyv 3.10. ábra"
          cim="Dinámrendszer: négy részhalmaz, négyféle eredő"
          feladat={
            <p>
              Az <M>{"A"}</M>, <M>{"B"}</M>, <M>{"C"}</M> pontok egy vízszintes
              egyenesen vannak, <M>{"AB = 3\\ \\text{m}"}</M>, <M>{"BC = 5\\ \\text{m}"}</M>.
              Az ábra dinámjaiból képzett négy erőrendszer eredőjét keressük:{" "}
              <strong>a)</strong> <M>{"(\\underline{F}_1, \\underline{F}_2, \\underline{F}_3, M_1, M_2)"}</M>,{" "}
              <strong>b)</strong> <M>{"(\\underline{F}_1, \\underline{F}_2, \\underline{F}_3)"}</M>,{" "}
              <strong>c)</strong> <M>{"(\\underline{F}_1, \\underline{F}_3, M_2)"}</M>,{" "}
              <strong>d)</strong> <M>{"(\\underline{F}_2, M_1)"}</M>.
            </p>
          }
          abra={
            <AbraKeret cim="A tankönyv 3.10. ábrája: F₁ = 2 kN ↓ A-ban, F₂ = 5 kN ↑ B-ben, F₃ = 3 kN ↓ C-ben; M₁ = 3 kNm ↷, M₂ = 12 kNm ↶.">
              <AbraDinam />
            </AbraKeret>
          }
          tanulsag={
            <p>
              Mindig ugyanaz a menet: <em>előbb a típus</em> a vetületi
              egyenletből (a nyomatékok ebbe nem kerülnek bele!), <em>aztán</em> a
              nyomatéki egyenlet — ha az eredő erő, abból a helye, ha nem, abból a
              nyomaték nagysága. A c) és d) eredője ugyanazon a hatásvonalon áll,
              ellentétesen: a két részrendszer együtt az a) eset, egyensúly.
            </p>
          }
        >
          <Lepes cim="a) Kijelentés és vetületi egyenlet">
            <p>
              Még nem tudjuk, mi lesz az eredő, ezért a könyv{" "}
              <M>{"\\mathcal{D}"}</M>-vel jelöli. A nyomatékok a vetületi
              egyenletben nem szerepelnek:
            </p>
            <MB>{"(\\underline{F}_1, \\underline{F}_2, \\underline{F}_3, M_1, M_2) \\ekv \\mathcal{D}"}</MB>
            <MB>{"\\Fy -2 + 5 - 3 = 0\\ \\text{kN}"}</MB>
            <p>Az eredő tehát nem lehet erő — csak nyomaték vagy egyensúly.</p>
          </Lepes>
          <Lepes cim="a) Nyomatéki egyenlet az A pontra">
            <p>
              Az <M>{"A"}</M> az <M>{"F_1"}</M> hatásvonalán van, ezért annak karja
              nulla. <M>{"M_1"}</M> az óramutató irányába forgat (−3),{" "}
              <M>{"M_2"}</M> ellentétesen (+12):
            </p>
            <MB>{"\\Mp{A} 0 + 5\\cdot 3 - 3\\cdot 8 - 3 + 12 = 0\\ \\text{kNm}"}</MB>
            <p>
              Ez is nulla: az erőrendszer <strong>egyensúlyi</strong>,{" "}
              <M>{"(\\underline{F}_1, \\underline{F}_2, \\underline{F}_3, M_1, M_2) \\ekv \\underline{O}"}</M>.
            </p>
          </Lepes>
          <Lepes cim="b) Csak a három erő">
            <MB>{"(\\underline{F}_1, \\underline{F}_2, \\underline{F}_3) \\ekv \\mathcal{D},\\qquad \\Fy -2 + 5 - 3 = 0"}</MB>
            <p>
              Nem erő. A nyomatéki egyenletet a <M>{"B"}</M> pontra írjuk (ott{" "}
              <M>{"F_2"}</M> karja nulla); <M>{"F_1"}</M> 3 m-rel balra lefelé mutat,
              az óramutatóval ellentétesen forgat:
            </p>
            <MB>{"\\Mp{B} 2\\cdot 3 + 0 - 3\\cdot 5 = -9\\ \\text{kNm}\\ (\\curvearrowright)"}</MB>
            <p>
              Az eredő az <M>{"M_B = -9\\ \\text{kNm}"}</M> nyomaték:{" "}
              <M>{"(\\underline{F}_1, \\underline{F}_2, \\underline{F}_3) \\ekv M_B"}</M>.
            </p>
          </Lepes>
          <Lepes cim="c) Két erő és egy nyomaték">
            <MB>{"(\\underline{F}_1, \\underline{F}_3, M_2) \\ekv \\mathcal{D},\\qquad \\Fy -2 - 3 = -5\\ \\text{kN}\\ (\\downarrow)"}</MB>
            <p>
              Az eredő egy 5 kN-os, lefelé mutató erő:{" "}
              <M>{"(\\underline{F}_1, \\underline{F}_3, M_2) \\ekv \\underline{R}"}</M>. A
              helyét a <M>{"C"}</M> pontra írt nyomatéki egyenletből kapjuk; jelölje{" "}
              <M>{"x_R"}</M> az eredő helyét C-hez képest (jobbra pozitív):
            </p>
            <MB>{"\\Mp{C} 2\\cdot 8 + 0 + 12 = -5\\cdot x_R \\quad\\Rightarrow\\quad x_R = \\frac{28}{-5} = -5,6\\ \\text{m}"}</MB>
            <p>
              A negatív előjel: az eredő a <M>{"C"}</M>-től <strong>balra</strong>{" "}
              5,6 m-re van, vagyis a <M>{"B"}</M>-től 0,6 m-rel balra.
            </p>
          </Lepes>
          <Lepes cim="d) Egy erő és egy nyomaték">
            <MB>{"(\\underline{F}_2, M_1) \\ekv \\mathcal{D},\\qquad \\Fy +5 = +5\\ \\text{kN}\\ (\\uparrow)"}</MB>
            <p>
              Az eredő egy felfelé mutató 5 kN. A <M>{"B"}</M>-re írt nyomatéki
              egyenletben <M>{"F_2"}</M> karja nulla:
            </p>
            <MB>{"\\Mp{B} 0 - 3 = 5\\cdot x_R \\quad\\Rightarrow\\quad x_R = -0,6\\ \\text{m}"}</MB>
            <p>
              Ugyanott, mint a c) eredője — nem véletlen: a két részrendszer
              együtt az a) eset, amely egyensúlyi, tehát a részeredőik is
              egyensúlyban vannak.
            </p>
          </Lepes>
        </KidolgozottFeladat>

        <div className="my-8">
          <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Ugyanez filmen – a négy részhalmaz</p>
          <FilmDinam />
        </div>

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
          <Lepes cim="Egyenértékűségi kijelentés">
            <p>
              A négy erőt az origóba redukáljuk: társerő és társnyomaték. A
              típust csak a végén döntjük el.
            </p>
            <MB>{"(\\underline{F}_1, \\underline{F}_2, \\underline{F}_3, \\underline{F}_4) \\ekv (\\underline{R},\\ M^{(O)})"}</MB>
          </Lepes>

          <Lepes cim="Vetületi egyenletek: az eredő komponensei">
            <p>
              Csak a vízszintes erők adnak <M>{"R_x"}</M>-et, és csak a
              függőlegesek <M>{"R_y"}</M>-t:
            </p>
            <MB>{"\\Fx 23 + 0 + 20 + 0 = R_x \\;\\Rightarrow\\; R_x = 43\\ \\text{kN}\\quad(\\rightarrow)"}</MB>
            <MB>{"\\Fy 0 - 9 + 0 + 19 = R_y \\;\\Rightarrow\\; R_y = 10\\ \\text{kN}\\quad(\\uparrow)"}</MB>
          </Lepes>

          <Lepes cim="Az eredő nagysága és iránya">
            <MB>{"R = \\sqrt{43^2 + 10^2} = 44{,}15\\ \\text{kN}"}</MB>
            <MB>{"\\alpha_R = \\operatorname{arctg}\\frac{10}{43} = 13{,}09^\\circ"}</MB>
          </Lepes>

          <Lepes cim="Nyomatéki egyenlet az origóra">
            <p>
              A vízszintes erő nyomatéka <M>{"-y F_x"}</M>, a függőlegesé{" "}
              <M>{"x F_y"}</M>. Menjünk végig sorban a négy erőn:
            </p>
            <MB>{"\\Mp{O} -7\\cdot 23 + 8\\cdot(-9) - (-4)\\cdot 20 + (-3)\\cdot 19 = M^{(O)}"}</MB>
            <MB>{"M^{(O)} = -161 - 72 + 80 - 57 = -210\\ \\text{kNm}"}</MB>
          </Lepes>

          <Lepes cim="Az eredő típusa és a hatásvonala">
            <p>
              Mivel <M>{"\\underline{R} \\neq 0"}</M>, az eredő egyetlen erő. A
              hatásvonala ott metszi az <M>{"x"}</M> tengelyt, ahol ugyanazt a
              nyomatékot adja:
            </p>
            <MB>{"\\Mp{O} -210 = x_0 R_y = x_0\\cdot 10 \\quad\\Rightarrow\\quad x_0 = -21\\ \\text{m}"}</MB>
          </Lepes>
        </KidolgozottFeladat>

        <div className="my-8">
          <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Ugyanez filmen – a redukálás lépésről lépésre</p>
          <FilmGyf3 />
        </div>

        <KepletDoboz
          cimke="Ferde erő komponensei a hatásvonal egy szakaszának vetületeiből (tankönyv 9.1)"
          keplet={"F_x = \\pm F\\,\\frac{l_x}{l},\\qquad F_y = \\pm F\\,\\frac{l_y}{l},\\qquad l = \\sqrt{l_x^2 + l_y^2}"}
          behelyettesitve={"\\text{GYF-4:}\\quad F_{1x} = -F_1\\frac{5}{\\sqrt{41}},\\quad F_{1y} = -F_1\\frac{4}{\\sqrt{41}}\\qquad\\text{(az előjelek szemléletből)}"}
        />

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
          <Lepes cim="Egyenértékűségi kijelentés">
            <p>
              Három erő és egy nyomaték (dinámrendszer) redukálva az origóra;
              a típust a végén döntjük el:
            </p>
            <MB>{"(\\underline{F}_1, \\underline{F}_2, \\underline{F}_3, M) \\ekv (\\underline{R},\\ M^{(O)})"}</MB>
          </Lepes>

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
            <MB>{"\\Fx -10 + 10 + 0 = R_x = 0,\\qquad \\Fy -8 - 16 + 24 = R_y = 0"}</MB>
            <p>
              Az összegük mindkét irányban zérus. Eddig minden úgy fest, mintha
              egyensúly volna.
            </p>
          </Lepes>

          <Lepes cim="a) A nyomaték — itt derül ki az igazság">
            <p>
              Az <M>{"F_1"}</M> és az <M>{"F_2"}</M> hatásvonala átmegy a{" "}
              <M>{"(2;\\,0)"}</M> ponton, ezért a nyomatékuk{" "}
              <M>{"2 F_{iy}"}</M>. Az <M>{"F_3"}</M> függőleges, az{" "}
              <M>{"x = -3"}</M> egyenesen:
            </p>
            <MB>{"\\Mp{O} 2\\cdot(-8{,}00) + 2\\cdot(-16{,}00) + (-3)\\cdot 24{,}00 + 17 = M^{(O)}"}</MB>
            <MB>{"M^{(O)} = -16 - 32 - 72 + 17 = -103\\ \\text{kNm}"}</MB>
            <p>
              Az eredő tehát <strong>forgatónyomaték</strong>,{" "}
              <M>{"(\\underline{F}_1, \\underline{F}_2, \\underline{F}_3, M) \\ekv M^{(O)}"}</M>: erő
              nincs, de a rendszer −103 kNm-mel forgat, és ez minden pontra
              ugyanennyi.
            </p>
          </Lepes>

          <Lepes cim="b) Ugyanaz feleakkora erőkkel, nyomaték nélkül">
            <p>
              A b) adatsorban az erők pontosan a háromszög oldalvektorainak
              hosszával egyeznek meg, így az összegük megint zérus:
            </p>
            <MB>{"F_{1} = (-5;\\,-4),\\quad F_{2} = (5;\\,-8),\\quad F_{3} = (0;\\,12)\\ \\text{kN}"}</MB>
            <MB>{"\\Fx -5 + 5 + 0 = 0,\\qquad \\Fy -4 - 8 + 12 = 0"}</MB>
            <MB>{"\\Mp{O} 2\\cdot(-4) + 2\\cdot(-8) + (-3)\\cdot 12 + 0 = -60\\ \\text{kNm}"}</MB>
            <p>
              Az eredő itt is erőpár. Hiába zárul be a három erő vektorháromszöge,
              a hatásvonalaik nem egy ponton mennek át, ezért a forgatóhatás
              megmarad.
            </p>
          </Lepes>

          <Lepes cim="c) Most már marad erő is">
            <MB>{"F_{1} = (-3{,}436;\\,-2{,}749),\\quad F_{2} = (3{,}498;\\,-5{,}597),\\quad F_{3} = (0;\\,10{,}1)\\ \\text{kN}"}</MB>
            <MB>{"\\Fx -3,436 + 3,498 + 0 = R_x = 0,062\\ \\text{kN},\\qquad \\Fy -2,749 - 5,597 + 10,1 = R_y = 1,754\\ \\text{kN}"}</MB>
            <MB>{"\\Mp{O} 2\\cdot(-2{,}749) + 2\\cdot(-5{,}597) + (-3)\\cdot 10{,}1 + 14 = M^{(O)} = -32{,}99\\ \\text{kNm}"}</MB>
          </Lepes>

          <Lepes cim="c) Az eredő és a hatásvonala">
            <MB>{"R = \\sqrt{0{,}062^2 + 1{,}754^2} = 1{,}755\\ \\text{kN},\\qquad \\alpha_R = 87{,}98^\\circ"}</MB>
            <MB>{"(\\underline{F}_1, \\underline{F}_2, \\underline{F}_3, M) \\ekv \\underline{R},\\qquad \\Mp{O} -32,99 = x_0\\cdot 1,754 \\;\\Rightarrow\\; x_0 = -18,80\\ \\text{m}"}</MB>
            <p>
              Az eredő tehát egyetlen, majdnem függőleges erő, amelynek
              hatásvonala az origótól 18,8 méterrel balra metszi az{" "}
              <M>{"x"}</M> tengelyt.
            </p>
          </Lepes>
        </KidolgozottFeladat>

        <div className="my-8">
          <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Ugyanez filmen – a három eset egymás után</p>
          <FilmGyf4 />
        </div>

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
          <Lepes cim="Egyenértékűségi kijelentés">
            <p>
              A hat erőt az origóra redukáljuk: társerő és társnyomaték, mindkettő
              háromkomponensű vektor.
            </p>
            <MB>{"(\\underline{F}_1,\\dots,\\underline{F}_6) \\ekv (\\underline{R},\\ \\underline{M}_O)"}</MB>
          </Lepes>

          <Lepes cim="Vetületi egyenletek: az erők összege">
            <p>
              Az erők párba állnak: mindegyik irányban van egy oda- és egy
              visszamutató, azonos nagyságú erő.
            </p>
            <MB>{"\\Fx F_1 - F_4 = 7 - 7 = 0\\ \\text{N}"}</MB>
            <MB>{"\\Fy -F_2 + F_5 = -6 + 6 = 0\\ \\text{N}"}</MB>
            <MB>{"\\Fz F_3 - F_6 = 8 - 8 = 0\\ \\text{N}"}</MB>
            <p>
              Az eredő erő tehát <M>{"\\underline{R} = 0"}</M>: az eredő nyomaték
              vagy egyensúly.
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
            <MB>{"(\\underline{F}_1,\\dots,\\underline{F}_6) \\ekv \\underline{M}_O,\\qquad |\\underline{M}| = \\sqrt{(-48)^2 + (-56)^2 + (-42)^2} = 84{,}88\\ \\text{Nm}"}</MB>
            <p>
              A négy térbeli eset közül ez a 2.: <M>{"\\underline{R} = 0"}</M>,{" "}
              <M>{"\\underline{M} \\neq 0"}</M>. A Kalkulátorok részben az
              osztályozóba betöltve ugyanezt kapod.
            </p>
          </Lepes>
        </KidolgozottFeladat>
        <div className="my-8">
          <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Ugyanez 3D-ben – a hasáb és a hat erő</p>
          <Film3DHasab />
        </div>

      </Szakasz>

      {/* ==================== KALKULÁTOROK ==================== */}
      <Szakasz
        id="kalkulator"
        cimke="3. rész"
        cim="Kalkulátorok"
        bevezeto="Három eszköz: síkbeli erőrendszer redukálása, térbeli nyomaték számítása, és a térbeli eredő osztályozása — erő, nyomaték vagy erőcsavar."
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

          <div>
            <h3 className="mb-2 text-[16px] font-semibold text-petrol-900">
              Térbeli eredő osztályozása
            </h3>
            <p className="mb-3 text-[14px] text-petrol-600">
              Írd be a pontra redukált társerő és társnyomaték komponenseit: a
              program kiszámolja az <M>{"\\underline{R}\\cdot\\underline{M}"}</M>{" "}
              szorzatot, és besorolja az eredőt a négy eset egyikébe. A GYF‑5
              adatai egy gombbal betölthetők.
            </p>
            <TerbeliEredoOsztalyozo />
          </div>
        </div>
      </Szakasz>

      {/* ==================== GYAKORLÁS ==================== */}
      <Szakasz
        id="gyakorlas"
        cimke="4. rész"
        cim="Gyakorlás"
        bevezeto="Előbb egy játék a szemnek, aztán kvíz, hibakereső és tizenkét feladattípus — mindegyik új számokkal minden indításkor."
        className="bg-white"
      >
        <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Előbb játssz – hova tedd az erőt?</p>
        <JatekMerleg />
        <p className="mt-8 mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Az ötlet – fogalmi kvíz</p>
        <Kviz cim="Érted, vagy csak számolod?" leiras="Tizenkét kérdés a modul tipikus félreértéseiről. Minden válasz után rövid magyarázat." kerdesek={KVIZ} />
        <p className="mt-8 mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Hibakereső – találd meg a hibát</p>
        <Hibakereso feladatok={HIBAK} />
        <p className="mt-8 mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Számolós gyakorlás</p>
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
