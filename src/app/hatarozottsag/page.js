import { ModulFejlec, SzakaszSav } from "@/components/ModulKeret";
import { Szakasz, Kartya, Kiemelo, AbraKeret, TankonyvJel, Szotar } from "@/components/ui/Elemek";
import { M, MB, KepletDoboz } from "@/components/ui/Keplet";
import { AbraFeladatok, AbraNegyKategoria, AbraEgyszeru, AbraTulhatarozott, AbraHatarozatlan, AbraKritikus, AbraOsszetettKritikus, AbraRacsos, AbraTorzstarto } from "@/components/abrak/HatarozottsagAbrak";
import SzerkezetEpito from "@/components/hatarozottsag/SzerkezetEpito";
import KritikusFelfedezo from "@/components/hatarozottsag/KritikusFelfedezo";
import RacsosEllenorzo from "@/components/hatarozottsag/RacsosEllenorzo";
import HatarozottsagKalk from "@/components/hatarozottsag/HatarozottsagKalk";
import GyfBlokkok from "@/components/hatarozottsag/Gyf";
import JatekStabil from "@/components/hatarozottsag/JatekStabil";
import GyakorloSzekcio from "@/components/hatarozottsag/GyakorloSzekcio";
import Kviz from "@/components/Kviz";
import Hibakereso from "@/components/Hibakereso";
import { KVIZ, HIBAK } from "@/components/hatarozottsag/KvizAdatok";
import { modulSlugAlapjan } from "@/lib/oldalterkep";

export const metadata = {
  title: "Statikai határozottság",
  description:
    "Mikor oldható meg a feladat az egyensúlyi egyenletekkel: egyenletek és ismeretlenek száma, határozott, határozatlan és túlhatározott szerkezetek, kritikus elrendezések, rácsos tartók 2c = r + k, a határozatlan tartó reakciói — szerkezet-építővel, játékkal, kidolgozott feladatokkal.",
};

const modul = modulSlugAlapjan("/hatarozottsag");

const Proba = ({ children }) => <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">{children}</p>;

export default function HatarozottsagOldal() {
  return (
    <>
      <ModulFejlec
        szam={8}
        cim="Statikai határozottság"
        leiras="Eddig minden tartónk „jól” volt megtámasztva: a három egyenletből három ismeretlen egyértelműen kijött. Ebben a modulban megtanulod, mikor van ez így, mikor nincs — és mikor csal a számlálás: három párhuzamos görgő is 3 = 3-at ad, a gerenda mégis kicsúszik. Építesz, számolsz, játszol."
        tartalom={["Az egyenletrendszer megoldhatósága", "A feladat és a tartó határozottsága", "Számlálás: e és i, rácsos tartón 2c = r + k", "Kritikus elrendezések — a szükséges, de nem elégséges feltétel", "Összetett és rácsos szerkezetek, lefejtés", "Határozatlan tartó: törzstartó és a merevség"]}
      />
      <SzakaszSav szakaszok={modul.szakaszok} />

      {/* ==================== ELMÉLET ==================== */}
      <Szakasz
        id="elmelet"
        cimke="1. rész"
        cim="Elmélet"
        bevezeto="A kérdés egyszerű: az egyensúlyi kijelentés alapján felírt egyenletrendszerből kijönnek-e az ismeretlen reakciók? A válasz háromféle lehet, és nem mindegy, hogy egy adott teherre vagy bármilyen teherre kérdezzük."
      >
        {/* --- 8.1 --- */}
        <h3 className="mt-2 text-xl font-semibold text-petrol-900">8.1 Az egyensúlyi egyenletrendszer megoldhatósága</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            A szerkezetek viselkedése alapvetően a támaszaik <strong>fokszámától és elrendezésétől</strong> függ. Eddig olyan tartókkal dolgoztunk, ahol a támaszok összfokszáma három volt, és az elrendezésük olyan, hogy az egyensúlyi kijelentés bármilyen teher esetén teljesült. Most ezt
            általánosítjuk tetszőleges számú testre — és megnézzük, mi van, ha nem teljesül.
          </p>
          <p>
            Vetületi egyenletet végtelen sok irányban, nyomatéki egyenletet végtelen sok pontra írhatunk — de nem mind <strong>független</strong>. Egy ferde irányú vetületi egyenlet két másik lineáris kombinációja: az 1:1 meredekségű <M>{"t"}</M> tengelyre például
          </p>
        </div>
        <KepletDoboz cimke="A tankönyv (7.1) egyenlete: a ferde vetület nem hoz új információt" keplet={"\\sum F_{it} = \\tfrac{\\sqrt2}{2}\\sum F_{ix} + \\tfrac{\\sqrt2}{2}\\sum F_{iy}"} behelyettesitve={"\\text{lineárisan független egyenletek: a maximális halmaz, amelyben egyik sem a többi kombinációja}"} />
        <div className="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Kartya cimke="2 egyenlet" cim="Közös metszéspontú, síkban">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">Két vetületi egyenlet; a metszésponton átmenő tengelyre írt nyomatéki egyenlet azonosság. Ez jár egy rácsos tartó csomópontjának.</p>
          </Kartya>
          <Kartya cimke="2 egyenlet" cim="Párhuzamos, síkban">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">Az erők irányába mutató vetületi + egy nyomatéki; vagy két nyomatéki olyan pontokra, amelyek összekötője nem párhuzamos az erőkkel.</p>
          </Kartya>
          <Kartya cimke="3 egyenlet" cim="Szétszórt, síkban">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">Két vetületi + egy nyomatéki, vagy három nyomatéki nem egy egyenesre eső pontokra. Ez jár egy merev testnek.</p>
          </Kartya>
          <Kartya cimke="3 / 6 egyenlet" cim="Térben">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">Közös metszéspontú térbeli: 3 vetületi. Szétszórt térbeli: 3 vetületi + 3 nyomatéki merőleges tengelyekre.</p>
          </Kartya>
        </div>

        {/* --- 8.2 --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">8.2 A feladat statikai határozottsága</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Egy <M>{"(\\underline F_1, \\underline F_2, \\underline F_3, \\underline A, \\underline B) \\ekv \\underline O"}</M> alakú egyensúlyi kijelentés (vagy egy <M>{"(\\underline F_1, \\ldots) \\ekv \\underline R"}</M> egyenértékűségi kijelentés) egyenletrendszerének megoldása háromféle
            lehet. A teljes elkülönítés után csak az egyes testek kijelentéseivel kell foglalkozni: az összevont kijelentések nem adnak új független egyenletet — ha minden test egyensúlyban van, az egész is.
          </p>
        </div>
        <div className="mt-2 grid gap-4 sm:grid-cols-3">
          <Kartya cimke="van, egyértelmű" cim="Határozott feladat">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">Az egyenletrendszernek van megoldása, és az egyértelmű. A legfontosabb eset — eddig csak ilyet oldottunk meg.</p>
          </Kartya>
          <Kartya cimke="nincs" cim="Túlhatározott feladat">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">Ellentmondásra jutunk: nem a feltételezett jellegű az eredő, vagy nem biztosítható az egyensúly.</p>
          </Kartya>
          <Kartya cimke="van, nem egyértelmű" cim="Határozatlan feladat">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">A megoldás egy vagy több szabad paraméter függvényében adható meg — a választástól függően más eredményt kapunk.</p>
          </Kartya>
        </div>
        <AbraKeret szam={1} cim="Ugyanaz a teher, más támaszok — a tankönyv 7.1.a, 7.2.a és 7.3.a ábrája: határozott, határozatlan és túlhatározott feladat.">
          <AbraFeladatok />
        </AbraKeret>
        <TankonyvJel fejezet="7.2" cim="„Nincs egyértelmű megoldás” — nem jó jellemzés">
          <p>
            A tankönyv lábjegyzete: a „nincs egyértelmű megoldás” kifejezés nem árulja el, hogy nem egyértelmű megoldás létezik-e — csak annyit jelent, hogy a feladat nem határozott. Mondjuk ki, melyik: <em>túlhatározott</em> (nincs megoldás) vagy <em>határozatlan</em> (van, de nem egyértelmű).
            Terheletlen tartón a zérus reakció a határozatlan feladatnak is megoldása — de nem az egyetlen: <M>{"A_x"}</M> és a vele ellentett <M>{"B_x"}</M> bármekkora lehet (7.2.c ábra), ez a <strong>sajátfeszültségi állapot</strong>.
          </p>
        </TankonyvJel>

        {/* --- 8.3 --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">8.3 A tartó statikai határozottsága</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            A <strong>szerkezetről</strong> akkor mondunk ítéletet, ha <em>tetszőleges</em> teherre nézzük: biztosítható-e az egyensúly, és egyértelmű-e a megoldás. Két feltétel, négy eset:
          </p>
        </div>
        <AbraKeret szam={2} cim="A négy kategória: a két bal oldali tartó, a két jobb oldali nem — a jobb alsó mutatja, hogy a számlálás (3 = 3) önmagában nem dönt.">
          <AbraNegyKategoria />
        </AbraKeret>
        <Kiemelo tipus="definicio" cim="A négy kategória (tankönyv 7.3)">
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Statikailag határozott:</strong> bármilyen teherre egyensúlyban marad, és a reakciók egyértelműen meghatározhatók.
            </li>
            <li>
              <strong>Statikailag túlhatározott:</strong> létezik teher, amelyre nincs egyensúly; ha van, a megoldás egyértelmű. Mechanizmus — nem tartó.
            </li>
            <li>
              <strong>Statikailag határozatlan:</strong> bármilyen teherre van megoldás, de sosem egyértelmű. Tartó — a reakciókhoz a merevség is kell.
            </li>
            <li>
              <strong>Határozatlan és túlhatározott:</strong> létezik teher, amire nincs egyensúly, és ha van, az sem egyértelmű. Nem tartó — a kritikus elrendezések ide tartoznak.
            </li>
          </ul>
          <p className="mt-2">
            Csak a határozott és a határozatlan szerkezetet nevezzük <strong>tartószerkezetnek</strong>. A határozatlanság <strong>fokszáma</strong>: hány paraméter rögzítésével lesz egyértelmű a megoldás; a túlhatározottság fokszáma: hány független egyenletnél juthatunk ellentmondásra.
          </p>
        </Kiemelo>
        <div className="proza text-[15px] leading-relaxed text-petrol-700">
          <p>
            A határozatlan tartókat az építőmérnöki gyakorlat szereti: egy kényszer tönkremenetele után is tartó maradhat. Hátrányuk, hogy <strong>kinematikai teherre</strong> — hőmérsékletváltozás, gyártási méretpontatlanság, támaszsüllyedés — is reakciók és igénybevételek keletkeznek bennük; a
            határozott tartó ilyenkor egyszerűen „követi” a mozgást.
          </p>
        </div>

        {/* --- 8.4 --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">8.4 Számlálás: egyenletek és ismeretlenek</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Előkészítő lépés: hasonlítsuk össze a felírható független egyenletek számát (<M>{"e"}</M>) a független reakciókomponensek számával (<M>{"i"}</M>). Síkban minden test hárommal növeli <M>{"e"}</M>-t; egy görgő vagy rúd eggyel, egy csukló kettővel, egy befogás hárommal növeli{" "}
            <M>{"i"}</M>-t; egy belső csukló két test között kettővel (a kapcsolati erőt csak egyszer vesszük figyelembe — ha külön elkülönítjük a csuklót, két egyenlet és testenként két ismeretlen jár hozzá).
          </p>
        </div>
        <KepletDoboz cimke="A számlálás síkban és rácsos tartón" keplet={"e = 3\\cdot\\text{testek},\\qquad i = \\textstyle\\sum\\text{külső fokszám} + \\sum\\text{belső fokszám};\\qquad \\text{rácsos: } e = 2c,\\ i = r + k"} behelyettesitve={"\\text{térben: } e = 6\\cdot\\text{testek},\\quad \\text{térbeli rácsos: } e = 3c"} />
        <Kiemelo tipus="kulcs" cim="Az elsődleges következtetés — szükséges, de nem elégséges">
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <M>{"e = i"}</M>: <strong>lehetséges</strong>, hogy egyértelmű a megoldás — de nem biztos. A határozottság <em>szükséges, de nem elégséges</em> feltétele.
            </li>
            <li>
              <M>{"e > i"}</M>: az ismeretlenek meghatározása után marad egyenlet, amivel ellentmondásra juthatunk: a túlhatározottság <em>elégséges, de nem szükséges</em> feltétele — legalább <M>{"e - i"}</M> szabad mozgás.
            </li>
            <li>
              <M>{"e < i"}</M>: biztosan marad szabad paraméter: a határozatlanság <em>elégséges, de nem szükséges</em> feltétele — legalább <M>{"i - e"}</M> fölös kényszer.
            </li>
          </ul>
          <p className="mt-2">
            Az <M>{"i - e"}</M> különbség mindig csak a <strong>fölös kényszerek és a szabad mozgások számának különbsége</strong>: egyidejűleg határozatlan és túlhatározott szerkezet bármilyen <M>{"e, i"}</M> viszony mellett előfordulhat.
          </p>
        </Kiemelo>
        <div className="proza text-[15px] leading-relaxed text-petrol-700">
          <p>
            A számlálás után jön a <strong>döntés</strong>. A matematikai út az egyenletrendszer rangvizsgálata lenne; a tankönyv három kézzelfogható módszert ad: (1) ha egyetlen teherre egyértelmű megoldást találunk, az <M>{"e = i"}</M>-vel együtt bizonyítja a határozottságot; (2) tervezzük meg a
            reakciók számítási sorrendjét úgy, hogy mindig csak <strong>egyismeretlenes egyenlet</strong> jöjjön (a már kiszámolt reakciókat ismertnek véve) — ha ilyen menetrend létezik, a szerkezet határozott; (3) <strong>lefejtés</strong>: a csuklóval és görgővel megtámasztott befüggesztett
            részt, vagy a két-két-két fokú kényszerrel kapcsolt két testet levéve az egyszerűbb maradékot vizsgáljuk.
          </p>
        </div>
        <TankonyvJel fejezet="7.3.1, 3. lábjegyzet" cim="A G mátrix — egy év múlva olvasd el újra">
          <p>
            Az ismeretlenek együtthatóit egy <M>{"\\mathbf G"}</M> mátrixba gyűjtve <M>{"\\mathbf G\\,\\mathbf r = \\mathbf b"}</M> alakot kapunk: a sorok az egyenletek, az oszlopok az ismeretlenek. Bármely teherre akkor van egyértelmű megoldás, ha <M>{"\\mathbf G"}</M> nem szinguláris. A
            szerkezet-építő pontosan ezt számolja: a kényszermátrix <strong>rangját</strong> — a nulltér egy vektora maga a mechanizmus mozgása, amit az animációban látsz.
          </p>
        </TankonyvJel>

        <div className="mt-6">
          <Proba>Próbáld ki – építs tartót támaszokból, és nézd, áll-e</Proba>
          <SzerkezetEpito />
        </div>

        {/* --- 8.5 --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">8.5 Egyszerű szerkezetek — a tankönyv példatára</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Egyetlen testből álló szerkezetnél az osztályozás mindig könnyen elvégezhető. A határozott egyszerű tartókon az összfokszám három, és mindegyikre létezik egyismeretlenes menetrend: kéttámaszú tartón a csuklóra és a görgőre írt nyomatéki egyenlet + vízszintes vetület; három görgőn a
            hatásvonalak páronkénti metszéspontjaira írt nyomatékiak; befogásnál két vetületi + nyomatéki a befogás pontjára; három rúdon a páronkénti metszéspontok (főpontok).
          </p>
        </div>
        <AbraKeret szam={3} cim="Statikailag határozott egyszerű tartók a tankönyv 7.4. ábrája nyomán: a) kéttámaszú gerenda, b) három görgő (egy ferde), c) csukló + görgő tört testen, d) befogott konzol, e) három rúd.">
          <AbraEgyszeru />
        </AbraKeret>
        <AbraKeret szam={4} cim="Túlhatározott egyszerű szerkezetek (7.5. ábra): az összfokszám 2 vagy 1, a bordó nyíl a szabadon létrejövő mozgás. Az e − i különbség a szabad mozgások száma.">
          <AbraTulhatarozott />
        </AbraKeret>
        <div className="proza text-[15px] leading-relaxed text-petrol-700">
          <p>
            Túlhatározott szerkezeten mindig találunk egyenletet, amelyben <strong>nem szerepel reakció</strong>: az egy csuklóra írt nyomatéki, a két görgő vízszintes vetületi egyenlete. Létezhet teher, amire nincs egyensúly — de ha a teher olyan, hogy ez az egyenlet teljesül, a maradék reakciók
            egyértelműek.
          </p>
        </div>
        <AbraKeret szam={5} cim="Határozatlan egyszerű tartók (7.6. ábra): összfokszám 4 vagy 5, a + jel a fölös kényszer, amelyet elvéve határozott tartót kapunk vissza.">
          <AbraHatarozatlan />
        </AbraKeret>
        <div className="proza text-[15px] leading-relaxed text-petrol-700">
          <p>
            Hogy egy határozatlan szerkezet nem egyszerre túlhatározott is, azt úgy bizonyítjuk, hogy <strong>megtaláljuk a fölös kényszereket</strong>: elvételükkel egy 7.4-es határozott tartót kapunk. A háromtámaszú gerendán a középső görgő; a két csuklósnál az egyik csukló görgővé alakítása;
            a befogott + két görgősnél két kényszer (a két görgő, vagy a középső görgő és az elfordulási kényszer).
          </p>
        </div>
        <AbraKeret szam={6} cim="Határozatlan és túlhatározott szerkezetek (7.7. ábra): a számlálás jó vagy majdnem jó, az elrendezés mégis hibás. Zárójelben a tankönyvben: e − i = szabad mozgások − fölös kényszerek.">
          <AbraKritikus />
        </AbraKeret>
        <Kiemelo tipus="figyelem" cim="A kritikus elrendezések felismerése">
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Három (vagy több) párhuzamos hatásvonal</strong> egy testen: ha kettőt ki akarunk zárni, a merőleges vetületi egyenletben a harmadik sem szerepel — a test a merőleges irányban eltolódhat (7.7.a, b).
            </li>
            <li>
              <strong>Egy ponton átmenő három hatásvonal</strong> (három rúd, vagy görgő a csuklón át): a pontra írt nyomatéki egyenletben nincs ismeretlen — a test a pont körül elfordul (7.7.d).
            </li>
            <li>
              <strong>Közös hatásvonalú két reakció</strong>: két mozgás szabad, egy kényszer fölös (7.7.c).
            </li>
            <li>
              A számláló ezekből semmit sem lát: <M>{"e - i"}</M> csak a különbséget adja. Ezért kell a geometriai ellenőrzés — vagy a menetrend, amely ilyenkor elakad.
            </li>
          </ul>
        </Kiemelo>

        <div className="mt-6">
          <Proba>Próbáld ki – forgasd a rudakat, és keresd meg, mikor csúszik ki a gerenda</Proba>
          <KritikusFelfedezo />
        </div>

        {/* --- 8.6 --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">8.6 Összetett szerkezetek</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            A 6. modul példái mind határozottak voltak: az egyenletek és ismeretlenek száma egyezett, és mindig találtunk egyenlet-sorozatot, amiből a reakciók egyértelműen kijöttek. <strong>Gerber-tartónál</strong> a számítás egyszerű tartók egymás utáni megoldása — ezért a befüggesztett és a
            fix rész határozottságát egyszerű tartóként vizsgáljuk. A <strong>háromcsuklós tartónál</strong> a külső csuklókon átmenő és arra merőleges reakciókomponenseket a teljes szerkezet nyomatéki egyenleteiből mindig ki tudjuk számolni; utána a testek egyszerű tartóként számíthatók — ha a
            még ismeretlen külső reakció hatásvonala nem megy át a belső csuklón. Ez azt jelenti: a háromcsuklós tartó akkor határozott, ha <strong>a három csukló nem esik egy egyenesbe</strong>.
          </p>
        </div>
        <AbraKeret szam={7} cim="Határozatlan és túlhatározott összetett szerkezetek (7.8. ábra): a) egy egyenesbe eső három csukló — a szaggatott vonalra merőleges terhet nem tudja megtartani; b) a két oszlopot összekötő rudak párhuzamosak a külső csuklók egyenesével — vízszintes teherre elborul.">
          <AbraOsszetettKritikus />
        </AbraKeret>
        <Kiemelo tipus="tipp" cim="A tankönyv receptje összetett szerkezetre (7.3.2.2)">
          <ol className="list-decimal space-y-1 pl-5">
            <li>Elkülönítés, az egyenletek és ismeretlenek kigyűjtése az egyensúlyi kijelentésekből → elsődleges következtetés (mi lehet, mi biztosan nem).</li>
            <li>
              Az egyenletek felírása <em>nélkül</em> tervezzük meg, hogyan számolnánk a reakciókat: ha egymás után találunk egyenleteket, amelyekben mindig csak egy új ismeretlen szerepelne nemzérus együtthatóval, a szerkezet határozott.
            </li>
            <li>
              Rövidítés — <strong>lefejtés</strong>: a csuklóval és görgővel megtámasztott befüggesztett rész levehető; két, egymáshoz csuklósan kapcsolt test, amelyek egy-egy csuklóval kapcsolódnak máshoz, szintén — ha a három csukló nem esik egy egyenesbe.
            </li>
          </ol>
        </Kiemelo>

        {/* --- 8.7 --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">8.7 Rácsos tartók statikai határozottsága</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Rácsos tartón a számok a <strong>topológiából</strong> kiolvashatók: minden csomópontban közös metszéspontú erőrendszer — két egyenlet, <M>{"e = 2c"}</M>; az ismeretlenek a rudak száma és a külső kényszerfokok: <M>{"i = r + k"}</M>. A döntéshez a rács felépítését nézzük: ha
            háromszögek egymás mellé illesztésével — mindig egy új csuklót két új rúddal kötve be — merev testeket kapunk, akkor a merev testekből álló (esetleg összetett) szerkezet határozottságát vizsgáljuk. Visszafelé is: egy csukló, amelyre csak két nem párhuzamos ismeretlen rúderő hat, a két rúddal
            együtt kivehető (mint egy háromcsuklós tartó), a határozottság nem változik. Ha a két rúd egy egyenesbe esik, a rájuk merőleges vetületi egyenletben nem lesz ismeretlen — ezért nem vesszük ki a <strong>vakrudakat</strong>.
          </p>
        </div>
        <KepletDoboz cimke="Rácsos tartó (síkban; térben 3c)" keplet={"2c = r + k\\ \\text{(szükséges, nem elégséges)},\\qquad 2c < r + k\\ \\text{(határozatlan)},\\qquad 2c > r + k\\ \\text{(túlhatározott)}"} />
        <AbraKeret szam={8} cim="A tankönyv 7.9. ábrája (határozott) és a 7.10. ábra változatai: a, b túlhatározott; c határozatlan; e, f határozatlan és túlhatározott — pedig 2c = r + k.">
          <AbraRacsos />
        </AbraKeret>

        <div className="mt-6">
          <Proba>Próbáld ki – kapcsold ki-be a rudakat, nézd a mérleget és a mezőt</Proba>
          <RacsosEllenorzo />
        </div>

        {/* --- 8.8 --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">8.8 Következtetések: a feladat és a tartó, határozottá tétel</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>A szerkezet jellemzéséből megjósolható, milyen lehet rajta egy feladat (tankönyv 7.4.1):</p>
        </div>
        <div className="my-4 overflow-x-auto rounded-xl border border-[color:var(--keret)] bg-white">
          <table className="w-full text-[13px]">
            <thead className="bg-petrol-50 text-[10.5px] tracking-wider text-petrol-500 uppercase">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">a szerkezet…</th>
                <th className="px-3 py-2 text-left font-semibold">határozott feladat</th>
                <th className="px-3 py-2 text-left font-semibold">határozatlan feladat</th>
                <th className="px-3 py-2 text-left font-semibold">túlhatározott feladat</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["határozott tartó", "mindig", "sosem", "sosem"],
                ["határozatlan tartó", "sosem", "mindig", "sosem"],
                ["túlhatározott szerkezet", "lehet", "sosem", "lehet"],
                ["határozatlan és túlhatározott", "sosem", "lehet", "lehet"],
              ].map((sor) => (
                <tr key={sor[0]} className="border-t border-petrol-100">
                  <td className="px-3 py-2 font-semibold text-petrol-900">{sor[0]}</td>
                  {sor.slice(1).map((c, j) => (
                    <td key={j} className={`px-3 py-2 ${c === "mindig" ? "text-emerald-700" : c === "lehet" ? "text-amber-700" : "text-petrol-400"}`}>
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="proza text-[15px] leading-relaxed text-petrol-700">
          <p>
            Visszafelé óvatosan: egy határozott feladat határozott <em>vagy</em> túlhatározott szerkezetre utalhat; egy túlhatározott feladat túlhatározott vagy határozatlan és túlhatározott szerkezetre; egy határozatlan feladat határozatlan vagy határozatlan és túlhatározott szerkezetre.
          </p>
          <p>
            <strong>Határozottá tétel</strong> (7.4.2): a későbbi tanulmányokban egy határozatlan tartót határozottá kell tennünk — az elvett támaszok elmozdulásával számoljuk majd a tényleges reakciókat. Cél: <M>{"e = i"}</M> úgy, hogy a kapott tartó valóban határozott legyen; ha a kiindulás nem
            túlhatározott, <M>{"i - e"}</M> fölös kényszer elvételével.
          </p>
        </div>
        <Kiemelo tipus="kulcs" cim="Ökölszabályok az elvehető kényszerekre">
          <ul className="list-disc space-y-1 pl-5">
            <li>egy testre ható három vagy több, egymással párhuzamos külső reakcióból legfeljebb kettőt kell megtartani;</li>
            <li>egy testre ható három vagy több, közös metszéspontú külső reakcióból legfeljebb kettőt kell megtartani;</li>
            <li>ha a testre ismeretlen külső nyomaték is hat, az ugyanarra a testre ható két vagy több párhuzamos reakcióból legfeljebb egyet;</li>
            <li>ha a testre ható ismeretlen erők közül egy kivételével az összes párhuzamos, akkor az egy kivételt ne vegyük el.</li>
          </ul>
        </Kiemelo>

        {/* --- 8.9 --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">8.9 A határozatlan tartó reakciói — miért kell a merevség</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Határozatlan tartón minden feladat határozatlan: az egyensúlyi egyenletrendszernek van megoldása, de a határozatlanság fokától függően egy vagy több <strong>szabad paraméter</strong> függvényében. A paramétert egy vagy több <strong>fölös kényszer</strong> megszüntetésével és az ott ébredő
            ismeretlen reakció paraméteres teherként való működtetésével vezetjük be. A megmaradó tartó — a <strong>törzstartó</strong> — statikailag határozott kell legyen.
          </p>
        </div>
        <AbraKeret szam={9} cim="Határozatlan tartó határozottá tétele a tankönyv 7.11–7.12. ábrája nyomán: a) háromtámaszú tartó; b) görgő elvéve; c) a csukló ferde görgővé alakítva; d) belső csukló — a paraméter a hajlítónyomaték; e) befogás + görgő.">
          <AbraTorzstarto />
        </AbraKeret>
        <div className="proza text-[15px] leading-relaxed text-petrol-700">
          <p>
            Melyik <M>{"B"}</M> az igazi? Amelyiknél a tartó <strong>alakváltozása</strong> illeszkedik mindhárom támaszhoz: a törzstartó lehajlása a <M>{"B"}</M> pontban a teherből és a paraméteres <M>{"B"}</M> erőből együtt éppen nulla. Ez már a Szilárdságtan — de a következmény itt is látszik: a
            reakciók a tartó merevségétől függenek (a GYF‑7-ben egységnyi merevséggel <M>{"B = 8{,}25"}</M>, négyszer merevebb jobb mezővel <M>{"9{,}60"}</M> kN), és kinematikai teherre is ébrednek. Többszörösen határozatlan tartón annyi kényszert szüntetünk meg, hogy határozott legyen — például a
            7.13. ábra tartóján a <M>{"B"}</M> és <M>{"C"}</M>, vagy a <M>{"B"}</M> és <M>{"D"}</M> görgőt.
          </p>
        </div>
        <TankonyvJel fejezet="7.5, 5. lábjegyzet" cim="A belső csukló paramétere">
          <p>
            Belső kényszer felszabadításakor a paraméterként felvett reakciót <strong>mindkét testre</strong> működtetni kell: a belső csukló miatt egy-egy ellenkező irányba forgató nyomatékot a csukló két oldalán lévő testre. A következő fejezet után már tudni fogjuk: ezek a nyomatékok a felszabadított
            keresztmetszet <em>hajlítónyomatékának</em> felelnek meg.
          </p>
        </TankonyvJel>

        <Szotar
          sorok={[
            { itt: <>mechanizmus, labilis szerkezet</>, konyv: <>statikailag túlhatározott szerkezet</>, megjegyzes: "Létezik teher, amire nincs egyensúly; nem tartó." },
            { itt: <>kritikus (degenerált) elrendezés</>, konyv: <>statikailag határozatlan és túlhatározott szerkezet</>, megjegyzes: "Szabad mozgás ÉS fölös kényszer egyszerre; gyakran e = i." },
            { itt: <>e, i</>, konyv: <>független egyenletek száma, független reakciókomponensek száma</>, megjegyzes: "e = 3·testek (síkban); rácsos: e = 2c, i = r + k." },
            { itt: <>a határozatlanság foka</>, konyv: <>a határozatlanság fokszáma</>, megjegyzes: "Hány paraméter rögzítésével lesz egyértelmű a megoldás." },
            { itt: <>törzstartó, alapszerkezet</>, konyv: <>törzstartó</>, megjegyzes: "A fölös kényszerek elvétele után maradó határozott tartó." },
            { itt: <>sajátfeszültség</>, konyv: <>sajátfeszültségi állapot</>, megjegyzes: "Terheletlen határozatlan szerkezetben nem zérus reakciók / belső erők." },
            { itt: <>kinematikai teher</>, konyv: <>kinematikai teher</>, megjegyzes: "Hőmérséklet, gyártási hiba, támaszsüllyedés — határozatlan tartón reakciót ébreszt." },
          ]}
        />

        <Kiemelo tipus="tipp" cim="A leggyakoribb hibák — és hogyan kerüld el őket">
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>3 = 3, tehát határozott.</strong> Nem: nézd meg a hatásvonalakat (párhuzamos? egy ponton át? csuklón át?) és a csuklókat (egy egyenesen?). A menetrend elakadása árulkodik.
            </li>
            <li>
              <strong>A belső csukló ismeretlenjei duplán.</strong> Két test között 2 (nem 4): a kapcsolati erők egymás ellentettjei.
            </li>
            <li>
              <strong>e &gt; i = „határozatlan”.</strong> Fordítva: e &gt; i kevés kényszer → mozog; i &gt; e sok kényszer → határozatlan.
            </li>
            <li>
              <strong>Aₓ + Bₓ = 0 ⇒ mindkettő nulla.</strong> Ez határozatlan feladat, a paraméter nem nulla „alapból”.
            </li>
            <li>
              <strong>Törzstartó vízszintes görgővel a csukló helyén.</strong> Három párhuzamos görgő marad: kritikus. Ferde görgő vagy más kényszer elvétele.
            </li>
          </ul>
        </Kiemelo>
      </Szakasz>

      {/* ==================== KIDOLGOZOTT FELADATOK ==================== */}
      <Szakasz
        id="peldak"
        cimke="2. rész"
        cim="Kidolgozott feladatok"
        bevezeto="Minden feladat ugyanazt az utat járja: testek → külső kényszerek → belső kényszerek → mérleg (e, i) → geometriai ellenőrzés (menetrend, lefejtés, kritikus elrendezés) → ítélet. Ahol lehet, számokkal is: egy teherre egyértelmű megoldás a határozottság bizonyítéka."
        className="bg-white"
      >
        <GyfBlokkok />
      </Szakasz>

      {/* ==================== KALKULÁTOROK ==================== */}
      <Szakasz id="kalkulator" cimke="3. rész" cim="Kalkulátorok" bevezeto="A számláló a tankönyv 7.3.1 szerinti elsődleges ítéletet adja levezetéssel; a keret-építő és a rácsos ellenőrző a geometriát is eldönti — rangvizsgálattal.">
        <div className="space-y-8">
          <div>
            <h3 className="mb-2 text-[16px] font-semibold text-petrol-900">Határozottság-számláló — testek, kényszerek, rácsos tartó</h3>
            <p className="mb-3 text-[14px] text-petrol-600">
              Add meg a testek számát, a külső kényszereket és a belső kapcsolatokat (vagy rácsos üzemmódban <M>{"c, r, k"}</M>-t): a program kiírja <M>{"e"}</M>-t és <M>{"i"}</M>-t, az elsődleges következtetést, a határozatlanság fokát és a törzstartó-ökölszabályokat. Alaphelyzetben egy
              háromcsuklós tartó: 6 = 6.
            </p>
            <HatarozottsagKalk />
          </div>
          <div>
            <h3 className="mb-2 text-[16px] font-semibold text-petrol-900">Keret-építő — támaszok és sarokcsuklók</h3>
            <p className="mb-3 text-[14px] text-petrol-600">Ugyanaz az építő, mint az elméletben, kerettel: háromcsuklós, kétcsuklós, befogott, négycsuklós — és a falgörgő. A számítómag a próbateher reakcióit is kiírja, ha a szerkezet áll.</p>
            <SzerkezetEpito kezdoMod="keret" />
          </div>
        </div>
      </Szakasz>

      {/* ==================== GYAKORLÁS ==================== */}
      <Szakasz id="gyakorlas" cimke="4. rész" cim="Gyakorlás" bevezeto="Előbb a játék — időre, kritikus elrendezésekkel —, aztán a fogalmi kvíz, a hibakereső és a számolós generátorok." className="bg-white">
        <h3 className="mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Előbb játssz – stabil vagy mozog?</h3>
        <JatekStabil />
        <h3 className="mt-8 mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Az ötlet – fogalmi kvíz</h3>
        <Kviz cim="Érted, vagy csak számolod?" leiras="Tizennégy kérdés a feladat és a tartó határozottságáról, a számlálásról és a kritikus elrendezésekről." kerdesek={KVIZ} />
        <h3 className="mt-8 mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Hibakereső – találd meg a hibát</h3>
        <Hibakereso feladatok={HIBAK} />
        <h3 className="mt-8 mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Számolós gyakorlás</h3>
        <GyakorloSzekcio />

        <Kiemelo tipus="kulcs" cim="Mikor mehetsz tovább">
          <p>
            Akkor vagy kész ezzel a modullal, ha egy rajzról fél perc alatt megmondod az egyenletek és az ismeretlenek számát, tudod, hogy ez csak <em>szükséges</em> feltétel, és ránézésre kiszúrod a kritikus elrendezéseket: párhuzamos vagy egy ponton átmenő hatásvonalak, egy egyenesbe eső csuklók.
            A következő modul a határozott tartók <strong>belsejébe</strong> néz: igénybevételi ábrák — normálerő, nyíróerő, hajlítónyomaték a tartó hossza mentén. A belső csukló ott is visszatér: ahol csukló van, a hajlítónyomaték nulla.
          </p>
        </Kiemelo>
      </Szakasz>
    </>
  );
}
