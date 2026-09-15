import { ModulFejlec, SzakaszSav } from "@/components/ModulKeret";
import { Szakasz, Kartya, Kiemelo, AbraKeret, KetOszlop, TankonyvJel, Szotar } from "@/components/ui/Elemek";
import { M, MB, KepletDoboz } from "@/components/ui/Keplet";
import { AbraKenyszerek, AbraKettamaszu, AbraKonzol, AbraRuddal, AbraHaromRud, AbraSzerkesztes } from "@/components/abrak/TartoAbrak";
import KenyszerSzotar from "@/components/tartok/KenyszerSzotar";
import SzabadtestEpito from "@/components/tartok/SzabadtestEpito";
import EgyenletValaszto from "@/components/tartok/EgyenletValaszto";
import ReakcioFelfedezo from "@/components/tartok/ReakcioFelfedezo";
import ReakcioKalk from "@/components/tartok/ReakcioKalk";
import GyfBlokkok from "@/components/tartok/Gyf";
import JatekReakcio from "@/components/tartok/JatekReakcio";
import GyakorloSzekcio from "@/components/tartok/GyakorloSzekcio";
import Kviz from "@/components/Kviz";
import Hibakereso from "@/components/Hibakereso";
import { KVIZ, HIBAK } from "@/components/tartok/KvizAdatok";
import { modulSlugAlapjan } from "@/lib/oldalterkep";

export const metadata = {
  title: "Egyszerű tartók reakciói",
  description:
    "Kényszerek és fokszámuk, elkülönítés és szabadtest-ábra, egyensúlyi kijelentés, egyismeretlenes egyenletek — kéttámaszú tartó, konzol, rúddal megtámasztott tartó reakciói interaktív eszközökkel, kidolgozott feladatokkal és gyakorlással.",
};

const modul = modulSlugAlapjan("/tartok");

const Proba = ({ children }) => (
  <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">{children}</p>
);

export default function TartokOldal() {
  return (
    <>
      <ModulFejlec
        szam={5}
        cim="Egyszerű tartók reakciói"
        leiras="Eddig erőrendszereket adtunk össze és egyensúlyoztunk ki. Most a test kap támaszokat: ebben a modulban megtanulod, mit csinál egy görgő, egy csukló vagy egy befogás, hogyan cseréled le őket reakciókra, és hogyan írod fel úgy a három egyensúlyi egyenletet, hogy mindegyikben csak egy ismeretlen legyen."
        tartalom={[
          "Kényszerek és fokszámuk",
          "Elkülönítés, szabadtest-ábra",
          "Egyensúlyi kijelentés",
          "Egyismeretlenes egyenletek",
          "Kéttámaszú tartó, konzol, rúddal megtámasztott tartó",
          "Ellenőrzés és eredményvázlat",
        ]}
      />
      <SzakaszSav szakaszok={modul.szakaszok} />

      {/* ==================== ELMÉLET ==================== */}
      <Szakasz
        id="elmelet"
        cimke="1. rész"
        cim="Elmélet"
        bevezeto="A tartószámítás első lépése mindig ugyanaz: a támaszokat reakciókra cseréljük, és kimondjuk, hogy a terhek és a reakciók együtt egyensúlyi erőrendszert alkotnak. A többi már a 2. modul: vetületi és nyomatéki egyenletek — csak most ügyesen kell megválasztani őket."
      >
        {/* --- 5.1 --- */}
        <h3 className="mt-2 text-xl font-semibold text-petrol-900">5.1 Szerkezet, tartó, teher, reakció</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Egy gerenda a két végén feltámasztva, egy erkélylemez a falba fogva, egy előtető egy ferde rúdra függesztve: mindegyik <strong>egyszerű tartó</strong>. Ami közös bennük: egyetlen merev test, amely <strong>kényszerekkel</strong> — más szóval támaszokkal — kapcsolódik a környezetéhez, és bármilyen elrendezésű külső teher mellett egyensúlyban marad.
          </p>
          <p>
            A kényszer dolga, hogy a megtámasztott pont egyes elmozdulás-komponenseit megakadályozza. És ha megakadályoz egy elmozdulást, akkor cserébe erőt (vagy nyomatékot) ad át a testre. Ezeket az átadott erőket és nyomatékokat nevezzük <strong>reakcióknak</strong>. A terheletlen tartó zérus reakciókkal is egyensúlyban van — a nem nulla reakció mindig a terhekből ered. Ezért hívja a tankönyv a terheket <strong>aktív</strong>, a reakciókat <strong>passzív erőknek</strong>.
          </p>
        </div>

        <Kiemelo tipus="definicio" cim="A kényszer fokszáma">
          <p>
            A kényszer <strong>fokszáma</strong> a megakadályozott elmozdulás-komponensek száma. Ugyanennyi skalár adattal írható le a támaszról a testre átadódó reakció — vagyis a fokszám azt is megmondja, <em>hány ismeretlent</em> hoz a támasz a számításba. Görgő: 1, támasztórúd: 1, csukló: 2, befogás: 3.
          </p>
        </Kiemelo>

        {/* --- 5.2 --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">5.2 A négy kényszer</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Az építőmérnöki gyakorlatban négy síkbeli kényszer fordul elő szinte kizárólag. Mindegyikhez tartozik egy rajzi jel, egy megengedett mozgás (szaggatottan rajzoljuk), és egy reakció, amit az elkülönítésnél a támasz helyére felveszünk.
          </p>
        </div>

        <AbraKeret szam={1} cim="A négy kényszer a tankönyv 4.1–4.4. ábrája nyomán: felül a támaszjel és a megengedett mozgás, alul az elkülönítésnél felveendő reakció(k).">
          <AbraKenyszerek />
        </AbraKeret>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Kartya cimke="fokszám 1" cim="Görgő">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">
              A gördülés síkja mentén elgurul, a pont körül el is fordul — egyedül a síkra <strong>merőleges</strong> eltolódást gátolja. A reakció egy erre a síkra merőleges erő, a támadáspontja ismert, az iránya ismert, csak a nagysága nem. Ferde gördülési síknál (merőleges szárú szögek!) az erő függőlegessel bezárt szöge <strong>megegyezik a sík vízszintessel bezárt hajlásszögével</strong>.
            </p>
          </Kartya>
          <Kartya cimke="fokszám 1" cim="Támasztórúd és kötél">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">
              Két végén csuklós rúd: csak a saját tengelye irányában gátolja az eltolódást. A reakció rúdirányú erő, jele <M>{"S"}</M>, és <strong>mindig húzóerőnek tételezzük fel</strong>: a támadáspontból a rúd másik vége felé mutat. Így az előjel azt is elárulja, húzott-e a rúd (<M>{"S > 0"}</M>) vagy nyomott (<M>{"S < 0"}</M>). A függesztőrúd jellemzően húzott, a támasztórúd jellemzően nyomott. A kötél olyan rúd, amely <em>csak</em> húzni tud: rúdként számoljuk, és a végén ellenőrizzük, hogy <M>{"S > 0"}</M> lett-e.
            </p>
          </Kartya>
          <Kartya cimke="fokszám 2" cim="Csukló">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">
              A pont körül a test szabadon elfordul, de sehová nem tolódhat el. A reakcióerő iránya tetszőleges lehet, csak annyit tudunk, hogy a hatásvonala átmegy a megtámasztás pontján — ezért két komponensével adjuk meg: <M>{"A_x"}</M> és <M>{"A_y"}</M>. (Két másik, egymásra merőleges irány is jó lenne, de a vízszintes–függőleges a szokásos; grafikus megoldásnál csak egy X-szel jelöljük a támadáspontot.)
            </p>
          </Kartya>
          <Kartya cimke="fokszám 3" cim="Merev befogás">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">
              A falba beépített gerenda vége sem eltolódni, sem elfordulni nem tud. Három reakció: <M>{"A_x"}</M>, <M>{"A_y"}</M> és az elfordulást gátló <M>{"M_A"}</M> <strong>befogási nyomaték</strong>. A falban valójában megoszló erők adják át a reakciót, de ezeket a befogás pontjába redukált erőrendszerként kezeljük.
            </p>
          </Kartya>
        </div>

        <div className="proza mt-4 text-[13.5px] leading-relaxed text-petrol-500">
          <p>
            <em>Lábjegyzet a tankönyvből:</em> létezik olyan kényszer is, amely az elfordulás mellett csak egyetlen eltolódás-komponenst gátol — ez a <strong>csúszka</strong> vagy <strong>vezeték</strong> (fokszáma 2). Ritkán fordul elő, ebben a félévben nem lesz rá szükség.
          </p>
        </div>

        <TankonyvJel fejezet="4.1.2" cim="A rúderő négy helyen jelenik meg">
          <p>
            A tankönyv 4.2.d ábrája szerint egyetlen rúd rúdereje négy helyen bukkan fel: a rúd húzza a megtámasztott testet (<M>{"S"}</M>), a hatás–ellenhatás elve szerint a test húzza a rudat (<M>{"S'"}</M>), a rúd másik végén a rúd egyensúlyát biztosító erő húzza a rudat (<M>{"S''"}</M>), ennek ellentettje pedig a földre hat (<M>{"S'''"}</M>). A négy érték azonos; nyomott rúdnál mind a négy nyíl tényleges iránya megfordul. Az elnevezés — <M>{"S"}</M> — a német <em>der Stab</em> rövidítése.
          </p>
        </TankonyvJel>

        <div className="mt-6">
          <Proba>Próbáld ki – told meg a tartót, és nézd, mi ébred</Proba>
          <KenyszerSzotar />
        </div>

        {/* --- 5.3 --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">5.3 Hány kényszer kell?</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Egy merev test síkban háromféleképpen tud elmozdulni: két irányban eltolódhat és egy tengely körül elfordulhat. Ugyanez az egyenletek oldaláról: síkbeli erőrendszerre <strong>három független egyensúlyi egyenlet</strong> írható fel. Egy egyszerű tartót ezért úgy kell megtámasztani, hogy a támaszok fokszámainak összege <strong>legalább három</strong> legyen — és amíg pontosan három, addig az egyenletrendszernek egyértelmű megoldása van.
          </p>
        </div>
        <div className="mt-2 grid gap-4 sm:grid-cols-3">
          <Kartya cimke="3 = 3" cim="Egy befogás">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">Önmagában három a fokszáma: befogott konzol. Egyetlen támasz, három ismeretlen.</p>
          </Kartya>
          <Kartya cimke="3 = 2 + 1" cim="Csukló + görgő vagy rúd">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">A klasszikus kéttámaszú tartó, illetve a csuklóval és rúddal megtámasztott előtető.</p>
          </Kartya>
          <Kartya cimke="3 = 1 + 1 + 1" cim="Három görgő vagy rúd">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">Három rúddal megtámasztott gerenda — a rúd és a görgő számításilag azonosan viselkedik.</p>
          </Kartya>
        </div>

        <Kiemelo tipus="figyelem" cim="Szükséges, de nem elégséges">
          <p>
            A „fokszámok összege három” csak szükséges feltétel. Két egyfokú kényszert és egy csuklót, vagy három egyfokút úgy is fel lehet venni, hogy valamelyik mozgást nem gátolják: három görgő, amelyek reakcióinak hatásvonala egy ponton megy át, nem tartó — a test e pont körül elfordulhat. Ugyanez a degenerált eset a kéttámaszú tartónál, ha a görgő reakciójának hatásvonala átmegy a csuklón. Ezekkel a <strong>7. fejezet</strong> (statikai határozottság) foglalkozik; addig csak olyan tartókkal dolgozunk, ahol az egyenletrendszernek egyértelmű megoldása van.
          </p>
        </Kiemelo>

        <TankonyvJel fejezet="4.1.2" cim="Kényszer = előírt elmozdulás">
          <p>
            Építőmérnökként úgy tekintünk a támaszokra, hogy <em>megakadályoznak</em> egy elmozdulást. Általánosabb szemlélet, hogy a támasz <strong>előírja</strong> az adott elmozdulás értékét — ez általában nulla, de támaszsüllyedésnél vagy gyártási hibánál nem zérus is lehet. A „kényszer” szó pontosan erre utal.
          </p>
        </TankonyvJel>

        {/* --- 5.4 --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">5.4 A reakciószámítás receptje</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            A tankönyv 4.2. fejezete öt lépésben adja meg a receptet. A GYF-ek mind ezt követik — és a ZH-n is ezt a szerkezetet várják el.
          </p>
        </div>
        <div className="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Kartya cimke="1. lépés" cim="Elkülönítés">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">
              Lerajzoljuk a szerkezetet a támaszok <em>nélkül</em>, és a támaszok helyére berajzoljuk az ott fellépő reakciókat (nagyságuk még ismeretlen). Ez a <strong>szabadtest-ábra</strong>.
            </p>
          </Kartya>
          <Kartya cimke="2. lépés" cim="Egyensúlyi kijelentés">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">
              Kimondjuk: az aktív terhek és a reakciók együtt egyensúlyi erőrendszert alkotnak, <M>{"(\\underline{F}_1, \\underline{p}, \\underline{A}, \\underline{B}) \\ekv \\underline{O}"}</M>.
            </p>
          </Kartya>
          <Kartya cimke="3. lépés" cim="Három egyenlet">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">
              Három független skaláregyenlet (vetületi és nyomatéki) — lehetőleg úgy, hogy mindegyikben <strong>egy ismeretlen</strong> legyen.
            </p>
          </Kartya>
          <Kartya cimke="4. lépés" cim="Ellenőrző egyenlet">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">
              Egy eddig nem használt egyensúlyi egyenlet, amelyben már minden erő ismert: nem megoldani kell, csak megnézni, mennyire nulla.
            </p>
          </Kartya>
          <Kartya cimke="5. lépés" cim="Eredményvázlat">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">
              Az elkülönített szerkezet az összes rá ható erővel és nyomatékkal, a reakciók <strong>tényleges irányával</strong> és pozitív nagyságával.
            </p>
          </Kartya>
        </div>

        <div className="proza mt-4 text-[13.5px] leading-relaxed text-petrol-500">
          <p>
            <em>A tankönyv lábjegyzete a nulladik lépésről:</em> a nulladik lépés természetesen most is a feladat szövegének elolvasása — ha csak az a feladat, hogy színezzük ki lilára, akkor a fenti lépések értelemszerűen kihagyhatók.
          </p>
        </div>

        <Kiemelo tipus="tipp" cim="Mit lehet ránézésre ellenőrizni az eredményvázlaton?">
          <ul className="list-disc space-y-1 pl-5">
            <li>Ha van olyan erő, amelynek <strong>jobbra</strong> mutató komponense van, kell lennie olyannak is, amelynek <strong>balra</strong> — és ugyanígy fel–le.</li>
            <li>Ha valami egy pont körül <strong>pozitív</strong> irányba forgat, kell lennie olyannak is, ami <strong>negatív</strong> irányba.</li>
            <li>Az eredményvázlaton csak az újonnan kapott számértékek szerepelnek: <strong>pontosan három</strong> skalár adatnak kell lennie — annyi, ahány egyenletet megoldottunk.</li>
            <li>Az ellenőrző egyenlet hibája a kerekítés nagyságrendjében legyen. Ha a hiba éppen valamelyik tag kétszerese, esélyes, hogy ott egy előjelet elrontottál.</li>
          </ul>
        </Kiemelo>

        <div className="mt-6">
          <Proba>Próbáld ki – építsd fel a szabadtest-ábrát</Proba>
          <SzabadtestEpito />
        </div>

        {/* --- 5.5 --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">5.5 Egyismeretlenes egyenletek — az egyenletválasztás művészete</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            A <M>{"\\sum F_{ix},\\ \\sum F_{iy},\\ \\sum M_i^{(O)}"}</M> egyenletrendszer receptszerű felírása három ismeretlennel működik, csak lassú és hibalehetőségekkel teli. („Hogy oldottad meg ezt az egyenletrendszert? Három ismeretlennel.”) A tankönyv ehelyett <strong>egyismeretlenes egyenletek sorozatát</strong> javasolja. Ehhez olyan egyenleteket keresünk, amelyekből a három ismeretlen közül <em>kettő kiesik</em>. Két dolgot kell tudni:
          </p>
        </div>
        <Kiemelo tipus="kulcs" cim="Mikor esik ki egy ismeretlen az egyenletből?">
          <ul className="list-disc space-y-1 pl-5">
            <li>Egy <strong>erő</strong> nem szerepel az irányára <strong>merőleges vetületi</strong> egyenletben, és nem szerepel azokban a <strong>nyomatéki</strong> egyenletekben, amelyeket a <strong>hatásvonala valamelyik pontjára</strong> írunk fel (a karja nulla).</li>
            <li>Egy <strong>nyomaték</strong> nem szerepel a vetületi egyenletekben.</li>
          </ul>
          <p className="mt-2">Ebből a három recept:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>egy <strong>erőt és egy nyomatékot</strong> kell kizárni → az erőre merőleges <strong>vetületi</strong> egyenlet;</li>
            <li>két <strong>párhuzamos erőt</strong> kell kizárni → a közös irányra merőleges <strong>vetületi</strong> egyenlet;</li>
            <li>két <strong>nem párhuzamos erőt</strong> kell kizárni → a hatásvonalaik <strong>metszéspontjára</strong> írt nyomatéki egyenlet. Ezt a metszéspontot nevezi a tankönyv a harmadik ismeretlen <strong>főpontjának</strong>.</li>
          </ul>
        </Kiemelo>
        <div className="proza text-[15px] leading-relaxed text-petrol-700">
          <p>
            Az egyismeretlenes egyenletnek van egy másik haszna is: ha már az elkülönítésnél látjuk, melyik egyenletből fog kijönni egy-egy reakció, gyakran előre meg tudjuk becsülni a végleges irányát — és ha jól becsültünk, pozitív számot kapunk, és nem kell az irányváltoztatással bajlódni.
          </p>
        </div>

        <div className="mt-6">
          <Proba>Próbáld ki – hány ismeretlen marad az egyenletben?</Proba>
          <EgyenletValaszto />
        </div>

        {/* --- 5.6 --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">5.6 A jellemző egyszerű tartók</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Négy tartótípus fedi le a félév feladatainak nagy részét. Mindegyikhez a tankönyv ábrája nyomán megmutatjuk az elkülönítést és az egyenlet-stratégiát.
          </p>
        </div>

        <h4 className="mt-8 text-[16px] font-semibold text-petrol-900">Kéttámaszú tartó (tankönyv 4.3.1)</h4>
        <AbraKeret szam={2} cim="Kéttámaszú tartók a tankönyv 4.5. ábrája nyomán: ferde görgővel (a, b) és vízszintes görgővel (c, d); az elkülönítésen a főpontok és az egyismeretlenes egyenletek.">
          <AbraKettamaszu />
        </AbraKeret>
        <div className="proza text-[15px] leading-relaxed text-petrol-700">
          <p>
            Csukló + görgő: két komponens a csuklóban, egy erő a görgőben, összesen három ismeretlen. <strong>Ökölszabály:</strong> az első egyenlet mindig lehet a <strong>csuklóra írt nyomatéki</strong> egyenlet — a csuklóerő két komponensének karja ott nulla, így csak a görgő reakciója marad benne. A folytatásra több út van:
          </p>
        </div>
        <KepletDoboz
          cimke="Kéttámaszú tartó, vízszintes görgő — három független egyenlet és az ellenőrzés"
          keplet={"\\Mp{A} \\ \\ldots + L\\,B = 0 \\;\\Rightarrow\\; B\\qquad \\Mp{B}\\ \\ldots - L\\,A_y = 0 \\;\\Rightarrow\\; A_y\\qquad \\Fx\\ \\ldots + A_x = 0 \\;\\Rightarrow\\; A_x"}
          behelyettesitve={"\\text{ellenőrzés:}\\quad \\Fy\\ A_y + B + \\sum F_{iy} \\approx 0"}
        />
        <div className="mt-2 grid gap-4 lg:grid-cols-2">
          <Kartya cimke="Hibatovábbgörgetés nélkül" cim="Mindhárom reakciót külön egyenletből">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">
              Ha a már kiszámolt reakciót nem használjuk a következő egyenletben, egy korábbi hiba nem gördül tovább. Vízszintes tartón a görgőre írt nyomatéki egyenletben sem a görgőerő, sem <M>{"A_x"}</M> nem szerepel → <M>{"A_y"}</M>. Ferde görgőnél a görgőerő hatásvonalának az egyik csuklóerő-komponens hatásvonalával biztosan van metszéspontja (a <M>{"D"}</M> főpont): az arra írt nyomatéki egyenletben a másik komponens az egyetlen ismeretlen. Ha a görgőerő függőleges, ez a metszéspont nem létezik — az egyenlet vízszintes vetületi egyenletté „fajul”. Így az ellenőrzéshez mindig marad legalább egy vetületi egyenlet, és a sorrend is tetszőleges.
            </p>
          </Kartya>
          <Kartya cimke="Gyorsabb, de kockázatosabb" cim="A görgőerő után két vetületi">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">
              A görgőerő ismeretében egy vízszintes és egy függőleges vetületi egyenletből is kijön <M>{"A_x"}</M> és <M>{"A_y"}</M>. Ilyenkor a görgőerő komponenseit már a kiszámolt értékükkel írjuk be — vagyis a görgőerő számításának hibáját <strong>továbbgörgetjük</strong>. Cserébe az ellenőrző egyenletnek egy újabb nyomatéki egyenletnek kell lennie (a két vetületit elhasználtuk), amiben legalább az egyik csuklóerő-komponens biztosan szerepel.
            </p>
          </Kartya>
        </div>

        <h4 className="mt-8 text-[16px] font-semibold text-petrol-900">Befogott konzol (tankönyv 4.3.2)</h4>
        <AbraKeret szam={3} cim="Befogott konzolok a tankönyv 4.6. ábrája nyomán: vízszintes gerenda (a, b) és függőleges oszlop (c, d).">
          <AbraKonzol />
        </AbraKeret>
        <div className="proza text-[15px] leading-relaxed text-petrol-700">
          <p>
            A befogás minden mozgást gátol, ezért két erőkomponenst és egy nyomatékot veszünk fel. A recept a legegyszerűbb: az <M>{"M_A"}</M> nyomaték a vetületi egyenletekben nem szerepel, így a <strong>vízszintes vetületi</strong> egyenletből <M>{"A_x"}</M>, a <strong>függőlegesből</strong> <M>{"A_y"}</M>, a <strong>befogás pontjára írt nyomatéki</strong> egyenletből pedig <M>{"M_A"}</M> jön ki. Mindkét vetületi egyenletet elhasználtuk, ezért az ellenőrzés egy <strong>másik pontra</strong> (például a szabad végre) írt nyomatéki egyenlet.
          </p>
        </div>
        <KepletDoboz
          cimke="Befogott konzol"
          keplet={"\\Fx\\ \\ldots + A_x = 0 \\;\\Rightarrow\\; A_x\\qquad \\Fy\\ \\ldots + A_y = 0 \\;\\Rightarrow\\; A_y\\qquad \\Mp{A}\\ \\ldots + M_A = 0 \\;\\Rightarrow\\; M_A"}
          behelyettesitve={"\\text{ellenőrzés:}\\quad \\Mp{P}\\ \\text{(a konzol tetszőleges pontjára)} \\approx 0"}
        />

        <h4 className="mt-8 text-[16px] font-semibold text-petrol-900">Csuklóval és rúddal megtámasztott tartó (tankönyv 4.3.3)</h4>
        <AbraKeret szam={4} cim="Előtetők a tankönyv 4.7. ábrája nyomán: ferde függesztőrúddal (a, b) és függőleges támasztórúddal (c, d).">
          <AbraRuddal />
        </AbraKeret>
        <div className="proza text-[15px] leading-relaxed text-petrol-700">
          <p>
            Lényegében ugyanaz, mint a kéttámaszú tartó: két komponensével ismeretlen csuklóerő, és egy erő ismert hatásvonallal — csak most ez a hatásvonal a <strong>rúd iránya</strong>, nem a gördülési síkra merőleges. Egyetlen megkötés, hogy a rúderőt húzóerőnek kell felvenni. A csuklóra írt nyomatéki egyenletből <M>{"S"}</M>, a rúderő hatásvonalának a függőleges, illetve vízszintes csuklóerő-komponenssel vett metszéspontjára (<M>{"C"}</M> és <M>{"D"}</M> főpontok) írt nyomatéki egyenletekből <M>{"A_y"}</M> és <M>{"A_x"}</M> — vagy szükség esetén egy vetületi egyenlet. Ellenőrzés: nyomatéki egyenlet egy általános helyzetű pontra, vagy egy vetületi egyenlet.
          </p>
        </div>

        <h4 className="mt-8 text-[16px] font-semibold text-petrol-900">Három rúddal megtámasztott gerenda (tankönyv 4.3.4)</h4>
        <AbraKeret szam={5} cim="Három rúddal megtámasztott gerendák a tankönyv 4.8. ábrája nyomán: páronként metsző hatásvonalak (a, b) és két párhuzamos rúd (c, d).">
          <AbraHaromRud />
        </AbraKeret>
        <div className="proza text-[15px] leading-relaxed text-petrol-700">
          <p>
            Három ismert hatásvonalú, húzottnak feltételezett rúderő a három ismeretlen. Két-két rúderő hatásvonalának metszéspontjára — a harmadik rúderő <strong>főpontjára</strong> (<M>{"O_1, O_2, O_3"}</M>) — írt nyomatéki egyenletben mindig csak a harmadik rúderő szerepel. Egyetlen kivétel, ha két rúd párhuzamos: akkor nincs metszéspontjuk, és a nyomatéki egyenlet helyett a párhuzamos rudak irányára <strong>merőleges (t irányú) vetületi</strong> egyenletből számoljuk a harmadikat. Ehhez még az sem kell, hogy a párhuzamos rudak függőlegesek legyenek.
          </p>
        </div>
        <div className="proza text-[13.5px] leading-relaxed text-petrol-500">
          <p>
            <em>Lábjegyzet a tankönyvből:</em> a rúd és a görgő a számítás szempontjából azonosan viselkedik, ezért mindez érvényes a három görgővel, a két görgővel és egy rúddal, továbbá az egy görgővel és két rúddal megtámasztott tartókra is.
          </p>
        </div>

        <div className="mt-6">
          <Proba>Próbáld ki – élő reakciók kéttámaszú tartón</Proba>
          <ReakcioFelfedezo />
        </div>

        {/* --- 5.7 --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">5.7 Grafikus megoldás röviden</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Egyetlen teher esetén a reakciók szerkesztéssel is megkaphatók. Az alap a <strong>három erő egyensúlya</strong>: három erő akkor van egyensúlyban, ha <strong>közös metszéspontúak</strong> és <strong>zárt vektorháromszög</strong> szerkeszthető belőlük. A közös metszéspont egy erő hiányzó irányát adja meg, a vektorháromszög a nagyságokat. Több teher esetén előbb az eredőjüket vesszük, vagy a szuperpozíció elvével terhenként külön szerkesztünk és a reakciókat kényszerenként összegezzük.
          </p>
        </div>
        <AbraKeret szam={6} cim="Csuklóval és rúddal megtámasztott előtető szerkesztése a tankönyv 4.9. ábrája nyomán: a geometriai ábrán a három hatásvonal közös M pontja, a vektorábrán a zárt háromszög.">
          <AbraSzerkesztes />
        </AbraKeret>
        <div className="mt-2 grid gap-4 lg:grid-cols-2">
          <Kartya cimke="csukló + rúd" cim="A csuklóerő iránya a metszéspontból">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">
              A teher és a rúderő hatásvonala ismert, a csuklóerőnek csak a támadáspontja. Három erő egyensúlya miatt a csuklóerő hatásvonalának át kell mennie a másik kettő metszéspontján — ezzel a három iránnyal rajzoljuk meg a zárt vektorháromszöget, amelyben a tehervektor hossza ismert; a reakciók hosszát leolvassuk és az erőlépték szerint átváltjuk. Ha a teher hatásvonala átmegy a csuklón, a csuklóerő a teher ellentettje, a rúdban nem ébred erő.
            </p>
          </Kartya>
          <Kartya cimke="csukló + görgő" cim="Ha a két ismert hatásvonal párhuzamos">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">
              Függőleges teher és vízszintes görgő: nincs metszéspont. Két trükk: (1) a terhet a hatásvonala mentén <strong>két ferde komponensre bontjuk</strong>, és a két részfeladat reakcióit összegezzük; (2) a terhet <strong>kiegészítjük</strong> egy, a csuklót közvetlenül terhelő <M>{"S_0"}</M> erővel, amelynek reakciója a csuklóban <M>{"-S_0"}</M>, és a végén levonjuk. Grafoanalitikusan: ha tudjuk, hogy mindkét reakció függőleges, az eredőjük a teher ellentettje, és a terhet a hatásvonalak távolságával <strong>fordított arányban</strong> osztjuk fel (3.12. ábra).
            </p>
          </Kartya>
          <Kartya cimke="három rúd" cim="Visszavezetés a csuklós-rudas esetre">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">
              Két rúderőt helyettesítünk az eredőjükkel, amely átmegy a hatásvonalaik metszéspontján — ez játssza a „csukló” szerepét. A kapott erőt a végén felbontjuk a két rúdtengely irányába.
            </p>
          </Kartya>
          <Kartya cimke="befogás" cim="Reakcióerő + reakciónyomaték">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">
              A reakciók eredője a teher ellentettje: a reakcióerő a teherrel azonos nagyságú, ellentétes irányú. A teher és a reakcióerő erőpárt alkot, amelyet a befogási nyomatékkal egyensúlyozunk: nagysága erő × kar, forgásiránya szemléletből.
            </p>
          </Kartya>
        </div>
        <div className="proza mt-4 text-[15px] leading-relaxed text-petrol-700">
          <p>
            A tényleges szerkesztés helyett hasonló háromszögekből gyakran számolni is lehet — ezt hívja a tankönyv <strong>grafoanalitikus</strong> módszernek.
          </p>
        </div>

        <Szotar
          sorok={[
            { itt: <>támasz</>, konyv: <>kényszer</>, megjegyzes: "Ugyanaz: a megtámasztott pont elmozdulását előíró (általában megakadályozó) szerkezeti elem." },
            { itt: <>szabadtest-ábra</>, konyv: <>elkülönítés, az elkülönített szerkezet ábrája</>, megjegyzes: "A támaszok helyett a reakciók, az ismert terhekkel együtt." },
            { itt: <>terhek / reakciók</>, konyv: <>aktív erők / passzív erők</>, megjegyzes: "A terheletlen tartó reakciói nullák." },
            { itt: <>metszéspont, amelyre a nyomatéki egyenletet írjuk</>, konyv: <>főpont</>, megjegyzes: "Két ismeretlen hatásvonalának metszéspontja; az ott felírt egyenlet a harmadikat adja." },
            { itt: <>reakciók rajza a végén</>, konyv: <>eredményvázlat</>, megjegyzes: "Tényleges irány, pozitív nagyság, pontosan három új szám." },
            { itt: <><M>{"S > 0"}</M> húzott</>, konyv: <>a rúderőt húzóerőnek feltételezzük</>, megjegyzes: "Negatív S: nyomott rúd; kötélnél ez hiba." },
          ]}
        />

        <Kiemelo tipus="tipp" cim="A leggyakoribb hibák — és hogyan kerüld el őket">
          <ul className="list-disc space-y-1 pl-5">
            <li><strong>Előjel a nyomatéki egyenletben.</strong> Döntsd el az elején, hogy ↶ a pozitív (a tankönyv így írja: <M>{"\\Mp{A}"}</M>), és minden tagot ehhez képest írj. A lefelé mutató erő a ponttól jobbra ↷ forgat, tehát negatív.</li>
            <li><strong>A megoszló teher eredője rossz helyen.</strong> Az eredő az ábra súlypontjában hat: egyenletes tehernél a szakasz felezőpontjában, háromszögnél a nagyobbik intenzitástól a hossz harmadára — <em>nem</em> a tartó közepén.</li>
            <li><strong>A ferde görgő reakciója nem függőleges.</strong> A gördülési síkra merőleges: a függőlegessel akkora szöget zár be, amekkorát a sík a vízszintessel.</li>
            <li><strong>A rúderőt nyomottnak felvenni.</strong> Mindig húzottnak vedd fel — így az előjel elárulja a valóságot, és a szilárdságtanban is ez lesz a megállapodás.</li>
            <li><strong>Kihagyott ellenőrzés.</strong> Az ellenőrző egyenletbe minden tag már ismert: két perc, és kiderül a hiba. Ha nem jön ki, a hiba nagysága gyakran megmondja, melyik tagot rontottad el.</li>
          </ul>
        </Kiemelo>
      </Szakasz>

      {/* ==================== KIDOLGOZOTT FELADATOK ==================== */}
      <Szakasz
        id="peldak"
        cimke="2. rész"
        cim="Kidolgozott feladatok"
        bevezeto="Minden feladat a tankönyv receptjét követi: elkülönítés, egyensúlyi kijelentés, egyismeretlenes egyenletek, ellenőrzés, eredményvázlat. Figyeld, hogy a nyomatéki egyenletet mindig a főpontra írjuk."
        className="bg-white"
      >
        <GyfBlokkok />
      </Szakasz>

      {/* ==================== KALKULÁTOROK ==================== */}
      <Szakasz
        id="kalkulator"
        cimke="3. rész"
        cim="Kalkulátorok"
        bevezeto="Egy általános reakciószámító a házi feladatok ellenőrzéséhez, és az élő kéttámaszú tartó még egyszer — ha a felfedezés közben már számolni is akarsz."
      >
        <div className="space-y-8">
          <div>
            <h3 className="mb-2 text-[16px] font-semibold text-petrol-900">Reakciószámító — kéttámaszú tartó, konzol, csukló + rúd</h3>
            <p className="mb-3 text-[14px] text-petrol-600">
              Válaszd ki a tartótípust, add meg a geometriát és tetszőleges számú terhet (koncentrált erő, egyenletes vagy trapéz alakú megoszló teher, koncentrált nyomaték). A program kiszámolja a három reakciót, és a tankönyvi írásmóddal kiírja az egyismeretlenes egyenleteket meg az ellenőrzést. Alaphelyzetben: <M>{"L = 6\\ \\text{m}"}</M>, <M>{"F = 12\\ \\text{kN}"}</M> lefelé <M>{"x = 2\\ \\text{m}"}</M>-nél — <M>{"A_y = 8"}</M>, <M>{"B = 4\\ \\text{kN}"}</M>.
            </p>
            <ReakcioKalk />
          </div>
          <div>
            <h3 className="mb-2 text-[16px] font-semibold text-petrol-900">Élő reakciók kéttámaszú tartón</h3>
            <p className="mb-3 text-[14px] text-petrol-600">
              Ugyanaz a felfedező, mint az elméletben: csúszkákkal állítod a támaszközt, a konzolt, az erőt és a megoszló terhet, a három egyenlet behelyettesítve frissül. Nézd meg, mikor lesz <M>{"B"}</M> negatív.
            </p>
            <ReakcioFelfedezo />
          </div>
        </div>
      </Szakasz>

      {/* ==================== GYAKORLÁS ==================== */}
      <Szakasz
        id="gyakorlas"
        cimke="4. rész"
        cim="Gyakorlás"
        bevezeto="Előbb egy játék a szemnek, aztán a fogalmi kvíz, a hibakereső és a számolós generátorok — mindegyik új számokkal minden indításkor."
        className="bg-white"
      >
        <h3 className="mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Előbb játssz – tippeld meg a reakciókat</h3>
        <JatekReakcio />
        <h3 className="mt-8 mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Az ötlet – fogalmi kvíz</h3>
        <Kviz cim="Érted, vagy csak számolod?" leiras="Tizenkét kérdés a kényszerekről, az elkülönítésről és az egyenletválasztásról." kerdesek={KVIZ} />
        <h3 className="mt-8 mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Hibakereső – találd meg a hibát</h3>
        <Hibakereso feladatok={HIBAK} />
        <h3 className="mt-8 mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Számolós gyakorlás</h3>
        <GyakorloSzekcio />

        <Kiemelo tipus="kulcs" cim="Mikor mehetsz tovább">
          <p>
            Akkor vagy kész ezzel a modullal, ha egy kéttámaszú tartó és egy befogott konzol reakcióit segítség nélkül, a recept öt lépésével végig tudod számolni — és ha egy ferde rúddal megtámasztott tartónál meg tudod mondani, melyik pontra írt nyomatéki egyenletből jön ki egyetlen lépésben <M>{"A_x"}</M>. A következő modulokban ugyanezek a reakciók lesznek a kiindulópont az igénybevételi ábrákhoz.
          </p>
        </Kiemelo>
      </Szakasz>
    </>
  );
}
