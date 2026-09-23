import Link from "next/link";
import { ModulFejlec, SzakaszSav } from "@/components/ModulKeret";
import { Szakasz, Kartya, Kiemelo, AbraKeret, TankonyvJel, Szotar } from "@/components/ui/Elemek";
import { M, MB, KepletDoboz } from "@/components/ui/Keplet";
import { AbraKenyszerek, AbraVetites, AbraBakallvany, AbraBakallvanyCsomopont, AbraKonzol, AbraKonzolElkulonites, AbraIgenybevetelek, AbraRacsosTer, AbraTartaly } from "@/components/abrak/TerbeliAbrak";
import { TerbeliSzabadtest3D, TerbeliBakallvany3D, TerbeliKonzolVagas3D, TerbeliRacsos3D, TerbeliJatek3D } from "@/components/harom/Film3D";
import GyfBlokkok from "@/components/terbeli/Gyf";
import TamasztorudKalk from "@/components/terbeli/TamasztorudKalk";
import BakallvanyKalk from "@/components/terbeli/BakallvanyKalk";
import GyakorloSzekcio from "@/components/terbeli/GyakorloSzekcio";
import Kviz from "@/components/Kviz";
import Hibakereso from "@/components/Hibakereso";
import { KVIZ, HIBAK } from "@/components/terbeli/KvizAdatok";
import { modulSlugAlapjan } from "@/lib/oldalterkep";

export const metadata = {
  title: "Térbeli tartók",
  description:
    "Térbeli erőrendszerek, síkba vetítés, térbeli kényszerek és a hat egyensúlyi egyenlet, háromlábú bakállvány, mereven befogott térbeli konzol, gömbcsukló és támasztórudak, térbeli rácsos tartó, a keresztmetszet hat igénybevétele (N, V, V, T, M, M) — forgatható 3D jelenetekkel, filmekkel, kidolgozott feladatokkal, kalkulátorral és játékkal.",
};

const modul = modulSlugAlapjan("/terbeli");

const Proba = ({ children }) => <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">{children}</p>;

export default function TerbeliOldal() {
  return (
    <>
      <ModulFejlec
        szam={10}
        cim="Térbeli tartók"
        leiras="Minden tényleges szerkezet térbeli — eddig azért boldogultunk síkban, mert a feladat síkba egyszerűsíthető volt. Ebben a modulban a három egyenletből hat lesz, a nyomatékból nyomatékvektor, a támaszokból gömbcsukló, támasztórúd és térbeli befogás, egy keresztmetszeten pedig hat igénybevétel. Az ábrák forgathatók: nézd meg őket minden oldalról."
        tartalom={["Térbeli erőrendszerek és a síkba vetítés", "Térbeli kényszerek és a hat egyensúlyi egyenlet", "Háromlábú bakállvány — csomóponti egyensúly térben", "Mereven befogott konzol, gömbcsukló és támasztórudak", "Térbeli rácsos tartó", "A keresztmetszet hat igénybevétele: N, V, V, T, M, M"]}
      />
      <SzakaszSav szakaszok={modul.szakaszok} />

      {/* ==================== ELMÉLET ==================== */}
      <Szakasz
        id="elmelet"
        cimke="1. rész"
        cim="Elmélet"
        bevezeto="A tankönyv 9. fejezete ugyanazon a három lépésen megy végig, mint a síkbeli feladatoknál: erőkkel végzett műveletek, megtámasztás és reakciók, végül a rúdszerkezet igénybevételei — mindenhol a síkban megszokott műveletekre építve. A koordináta-rendszer: x jobbra, y felfelé, z a néző felé (jobbkezes)."
      >
        {/* --- 10.1 --- */}
        <h3 className="mt-2 text-xl font-semibold text-petrol-900">10.1 Térbeli erőrendszerek — amit a 2. modulból már tudsz</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Az erő térben is <strong>kötött vektor</strong>: három komponens (vagy a nagyság és három hajlásszög, amelyek koszinuszainak négyzetösszege 1) és a támadáspont három koordinátája adja meg. A forgató hatást a <M>{"\\underline M = \\underline r\\times\\underline F"}</M>{" "}
            vektoriális szorzat írja le: az eddig síkban számolt nyomaték mindig a síkra merőleges tengely körüli forgatás volt, térben a nyomatékvektor <strong>mindhárom komponense</strong> lényeges. A jobbkezes rendszerben a vektort szemből nézve (a nyila
            felénk mutat) az óramutató járásával ellentétesen forgat a pozitív.
          </p>
          <p>
            Mindezt — a vektoriális szorzatot, a nyomatékot tengelyre (<M>{"M_t = \\underline M_Q\\cdot\\underline e_t"}</M>), a pontra redukálást és az eredő négy térbeli esetét (egyensúly, nyomaték, erő, erőcsavar) — a{" "}
            <Link href="/nyomatek" className="font-semibold text-petrol-800 underline decoration-naracs-400 underline-offset-2 hover:text-naracs-600">2. modulban</Link> (2.6–2.8) részletesen kidolgoztuk. Itt csak összefoglaljuk, ami a tartókhoz kell.
          </p>
        </div>
        <div className="mt-2 grid gap-4 sm:grid-cols-3">
          <Kartya cimke="3 + 3 egyenlet" cim="Egyensúly térben">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">
              Három vetületi egyenlet (<M>{"x, y, z"}</M>) és három nyomatéki egyenlet a tengelyek körül. A nyomatéki tengelyeket bármely párhuzamos helyzetbe tolhatjuk — de két ponton átmenő hat tengely egyenletei már nem függetlenek.
            </p>
          </Kartya>
          <Kartya cimke="(9.1)" cim="Ferde erő komponensei">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">
              Ha a hatásvonal egy szakaszának vetületei <M>{"l_x, l_y, l_z"}</M>: <M>{"F_x = \\pm F\\,l_x/l"}</M> stb., <M>{"l = \\sqrt{l_x^2 + l_y^2 + l_z^2}"}</M>. Az előjelet szemléletből döntjük el. Ugyanígy vetítjük a nyomatékvektort is.
            </p>
          </Kartya>
          <Kartya cimke="9.1.2" cim="Az eredő térben">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">
              Pontra redukálás: társerő <M>{"\\underline F_A"}</M> és társnyomaték <M>{"\\underline M_A"}</M>, hat egyismeretlenes egyenletből. Mindkettő zérus → egyensúly; csak az erő zérus → nyomaték; <M>{"\\underline F_A\\cdot\\underline M_A = 0"}</M> → egyetlen
              erő; egyébként erőcsavar.
            </p>
          </Kartya>
        </div>
        <KepletDoboz cimke="A nyomatékvektor komponensei — ezt fogjuk minden feladatban használni" keplet={"\\underline r\\times\\underline F = (yF_z - zF_y;\\ zF_x - xF_z;\\ xF_y - yF_x)"} behelyettesitve={"\\text{tengelyre: } M_t = \\underline M_Q\\cdot\\underline e_t;\\quad \\text{az erővel párhuzamos vagy azt metsző tengelyre } M_t = 0"} />
        <TankonyvJel fejezet="9.1.3" cim="Megoszló erő térbeli eredője">
          <p>
            Térbeli tartón a teher térfogat vagy felület mentén is megoszolhat. Az állandó intenzitású térfogati teher részeredője a rész térfogatának és az intenzitásnak a szorzata, helye a rész <strong>súlypontjában</strong> — vagy alakítsuk felületi teherré
            (az intenzitást az erő irányú kiterjedéssel szorozva). Felületi tehernél a síkidom területe × intenzitás a síkidom súlypontjában; változó intenzitásnál a terhelési test térfogata, a test súlypontján át. Háromszögön lineárisan változó teher (egy
            oldalon zérus, a szemközti csúcsban <M>{"q_0"}</M>): az eredő a terület és <M>{"q_0"}</M> szorzatának harmada, a csúcsból induló súlyvonal csúcs felőli felezőpontjában. A folyadékkal töltött tartály (H13/4) épp ilyen feladat: <M>{"G = \\gamma V"}</M> a
            töltés súlypontjában.
          </p>
        </TankonyvJel>

        {/* --- 10.2 --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">10.2 Síkba vetítés — a térbeli feladat két-három síkbeli rajza</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            A ferde vetületi egyenlet vagy a ferde tengelyre írt nyomatéki egyenlet „sok munkával, de kivitelezhető” — a tankönyv ezért a megfelelő térlátás kialakulásáig a feladat <strong>síkba vetítését</strong> javasolja. Az <M>{"xy"}</M> síkba vetített
            feladatnál az <M>{"x, y"}</M> vetületi és a <M>{"z"}</M> tengely körüli nyomatéki egyenletet használhatjuk, az <M>{"yz"}</M> síkban az <M>{"y, z"}</M> vetületit és az <M>{"x"}</M> körülit, a <M>{"zx"}</M> síkban a <M>{"z, x"}</M> vetületit és az{" "}
            <M>{"y"}</M> körülit. Kilenc egyenlet, de a vetületiek kétszer szerepelnek: <strong>hat független</strong> marad. Egyetlen csapda: a ferde erő komponenseinél a harmadik irányról se feledkezz meg.
          </p>
        </div>
        <AbraKeret szam={1} cim="Ugyanaz a konzol térben és a három koordinátasíkba vetítve: minden nézetben két erőkomponens és egy nyomatéki tengely „él”. A karok mindig abban a nézetben látszanak, amelynek síkjára a tengely merőleges.">
          <AbraVetites />
        </AbraKeret>

        {/* --- 10.3 --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">10.3 Térbeli kényszerek és a hat egyensúlyi egyenlet</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Egy megtámasztott pontban három irányú eltolódást és három tengely körüli elfordulást gátolhatunk meg — a kényszerek ezek különböző kombinációit fogják le, a fokszámuk a felvett ismeretlen reakció-adatok száma. A tankönyv négy kapcsolattal foglalkozik:
          </p>
        </div>
        <AbraKeret szam={2} cim="Térbeli kényszerek és az elkülönítésükkor felvett reakciók a tankönyv 9.1. ábrája nyomán. Lila: reakcióerő-komponensek, bordó kettős nyíl: reakciónyomaték-komponensek (nyomatékvektor).">
          <AbraKenyszerek />
        </AbraKeret>
        <Kiemelo tipus="definicio" cim="Fokszámok térben (tankönyv 9.2.1)">
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Merev befogás — 6:</strong> három reakcióerő- és három befogási nyomaték-komponens (<M>{"A_x, A_y, A_z, M_{Ax}, M_{Ay}, M_{Az}"}</M>).
            </li>
            <li>
              <strong>Támasztórúd — 1:</strong> csak rúdirányú erő, a rúderő <M>{"S"}</M> nagysága az ismeretlen (húzottnak vesszük fel).
            </li>
            <li>
              <strong>Gömbcsukló — 3:</strong> semmilyen eltolódás, de a ponton átmenő bármely tengely körül szabad elfordulás: <M>{"A_x, A_y, A_z"}</M>.
            </li>
            <li>
              <strong>Tengelycsukló — 5:</strong> a síkbeli csukló térbeli megvalósítása: három erő és a tengelyre merőleges két nyomaték; csak a tengely körül foroghat.
            </li>
          </ul>
          <p className="mt-2">
            Egy merev testre hat független egyensúlyi egyenlet írható, ezért a határozott megtámasztáshoz a fokszámok összege <strong>hat</strong> kell legyen (szükséges, nem elégséges feltétel — 8. modul). Ezt hat megfelelően elhelyezett rúddal vagy egy
            gömbcsuklóval és három rúddal érhetjük el.
          </p>
        </Kiemelo>
        <KepletDoboz cimke="Az egyensúlyi kijelentés és a hat egyenlet írásmódja" keplet={"(\\underline F_1, \\ldots, \\underline A, \\underline M_A) \\ekv \\underline O:\\quad \\Fx\\ \\ \\Fy\\ \\ \\Fz\\ \\ \\textstyle\\sum M_{ix}:\\ \\ \\sum M_{iy}:\\ \\ \\sum M_{iz}:"} behelyettesitve={"\\text{a nyomatéki egyenletek tengelyeit oda tesszük, ahol a legtöbb ismeretlen kiesik (pl. a gömbcsuklón át)}"} />
        <Kiemelo tipus="figyelem" cim="Nem megfelelő megtámasztások (tankönyv 9.2.3) — a számlálás itt is csal">
          <ul className="list-disc space-y-1 pl-5">
            <li>gömbcsukló + három rúd, ha az egyik rúd hatásvonala átmegy a csuklón, vagy mindhárom rúd párhuzamos;</li>
            <li>hat rúd, ha négy párhuzamos, vagy a hatásvonalak egy közös pontban metszik egymást, vagy három rúd egy síkban fekszik és párhuzamos / egy ponton átmenő;</li>
            <li>
              <strong>két gömbcsukló:</strong> a csuklókat összekötő egyenes körüli forgatást semmi nem egyensúlyozza — létezik teher, amire nincs egyensúly.
            </li>
          </ul>
          <p className="mt-2">
            A hatismeretlenes egyenletrendszer felírását mindenképpen kerüljük: keressük az <strong>egyismeretlenes egyenletet</strong> — ha három rúd párhuzamos, a velük párhuzamos, két másik rúd hatásvonalát metsző tengelyre írt nyomatéki egyenletben csak a
            hatodik rúderő marad; gömbcsuklónál a csuklón átmenő tengelyek a nyeremény. Ha az ismeretlen együtthatója az így talált egyenletben nem nulla, a megoldás bármilyen teherre egyértelmű.
          </p>
        </Kiemelo>

        {/* --- 10.4 --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">10.4 Háromlábú bakállvány — csomóponti egyensúly térben</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Három támasztórúd egyetlen csomópontot támaszt, amelyre egyetlen koncentrált erő hat. A csomópontra ható erők <strong>közös metszéspontú térbeli erőrendszert</strong> alkotnak: a csomópontra írt három nyomatéki egyenlet <M>{"0 = 0"}</M> azonosság,
            marad a három vetületi egyenlet a három rúderőre. A rúderőket húzóerőként vesszük fel, komponenseiket a rudak vetületeivel írjuk fel:
          </p>
        </div>
        <KepletDoboz cimke="A tankönyv (9.2)–(9.5) egyenletei" keplet={"(\\underline F, \\underline S_1, \\underline S_2, \\underline S_3) \\ekv \\underline O:\\qquad \\Fx F_x \\pm S_1\\tfrac{l_{1x}}{l_1} \\pm S_2\\tfrac{l_{2x}}{l_2} \\pm S_3\\tfrac{l_{3x}}{l_3} = 0"} behelyettesitve={"\\text{ugyanígy } y \\text{ és } z\\text{-re; a } \\pm \\text{ az erők tényleges irányából, szemléletből (vagy az egységvektor előjeléből)}"} />
        <AbraKeret szam={3} cim="A tankönyv 9.2.a ábrája számokkal (H13/3): a rudak vetületeit a talppontok koordinátáiból olvassuk le.">
          <AbraBakallvany />
        </AbraKeret>
        <AbraKeret szam={4} cim="A csomópont elkülönítése (9.2.b ábra): a teher és a három, talppont felé mutató rúderő.">
          <AbraBakallvanyCsomopont />
        </AbraKeret>
        <TankonyvJel fejezet="9.2.2" cim="Mikor egyértelmű a megoldás — és a tankönyv két tippje">
          <p>
            Ha a három rúd <strong>nem esik egy síkba</strong>, a megoldás bármilyen teherre egyértelmű: páronként két rúd közös síkjára merőleges vetületi egyenletben csak a harmadik rúderő vetülete szerepel. Ugyanez nyomatéki egyenlettel: két támasztórúd
            talppontját összekötő egyenesre, mint tengelyre felírt egyenletben csak a harmadik rúderő nyomatéka ismeretlen — ebből az közvetlenül számítható. A GYF‑3-ban ezt ellenőrzésnek használjuk.
          </p>
        </TankonyvJel>
        <div className="mt-6">
          <Proba>Próbáld ki – forgasd a bakállványt, változtasd a terhet: melyik rúd húzott, melyik nyomott?</Proba>
          <TerbeliBakallvany3D />
        </div>

        {/* --- 10.5 --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">10.5 Térbeli tartó reakciói — a mereven befogott konzol</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            A recept ugyanaz, mint síkban: <strong>elkülönítés → egyensúlyi kijelentés → egyenletek felírása és megoldása → ellenőrzés</strong>. Általános esetben többismeretlenes rendszer vagy korábban kiszámolt mennyiségek használata is kellhet (ilyenkor a
            később számolt mennyiséget tegyük az ellenőrző egyenletbe — így azt is ellenőrizzük, amire építettük). A mereven befogott konzolnál nincs ilyen nehézség: a három vetületi egyenletből a három reakcióerő-komponens, a befogás ponton átmenő tengelyekre írt
            három nyomatéki egyenletből a három nyomatékkomponens <strong>egyenként</strong> jön ki, mert a reakcióerők metszik a tengelyeket, a merőleges nyomatékkomponensek vetülete pedig nulla.
          </p>
        </div>
        <AbraKeret szam={5} cim="Mereven befogott, tört tengelyű konzol általános térbeli erővel (tankönyv 9.3.a ábra).">
          <AbraKonzol />
        </AbraKeret>
        <AbraKeret szam={6} cim="Az elkülönítés (9.3.b ábra): a befogás helyett három erő- és három nyomatékkomponens, a pozitív tengelyirányokban felvéve.">
          <AbraKonzolElkulonites />
        </AbraKeret>
        <KepletDoboz cimke="A befogott konzol reakciói vektorosan" keplet={"\\underline A = -\\sum\\underline F_i,\\qquad \\underline M_A = -\\sum(\\underline r_i - \\underline r_A)\\times\\underline F_i - \\sum\\underline M_j"} behelyettesitve={"\\text{ellenőrzés: nyomatéki egyenlet a szabad végre — minden tag ismert}"} />
        <div className="mt-6">
          <Proba>Próbáld ki – a szabadtest-ábra 3D-ben: cseréld le a befogást a hat reakcióra</Proba>
          <TerbeliSzabadtest3D />
        </div>

        {/* --- 10.6 --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">10.6 Térbeli rácsos tartók</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Csuklós csomópontok, csak a csomópontokban ható koncentrált erők, csak erőt átadó (nyomatékot nem) támaszok: a csomópontokban <strong>közös metszéspontú térbeli erőrendszer</strong> működik, csomópontonként három vetületi egyenlettel. A számlálás{" "}
            <M>{"e = 3c"}</M>, <M>{"i = r + k"}</M>. A csomóponti módszer csomópontonként három rúderőt ad; egyetlen rúderő akkor számolható önmagában, ha a többi ismeretlen rúd egy síkban fekszik — az erre merőleges vetületi egyenletben csak ő szerepel (ez a
            térbeli vakrúd-keresés alapja is). Az átmetszéses módszer térben <strong>hatos átmetszés</strong>: a levágott rész szétszórt térbeli erőrendszer, hat egyenlet, hat rúd.
          </p>
        </div>
        <AbraKeret szam={7} cim="Térbeli rácsos tartó a GYF‑6-ból: hat rúd, két szabad csomópont, négy gömbcsuklós talppont — e = 3·6 = 18 = 6 + 12 = i.">
          <AbraRacsosTer />
        </AbraKeret>
        <div className="mt-6">
          <Proba>Próbáld ki – csomóponti módszer 3D-ben: válaszd ki a csomópontot, nézd a három egyenletét</Proba>
          <TerbeliRacsos3D />
        </div>

        {/* --- 10.7 --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">10.7 Térbeli igénybevételek: N, V<sub>y</sub>, V<sub>z</sub>, T, M<sub>y</sub>, M<sub>z</sub></h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            A belső erők definíciója térben is ugyanaz: a keresztmetszet egyik oldalán lévő tartórész egyensúlyát biztosító erők. Egy térbeli keresztmetszeten a keresztmetszet középpontján átmenő <strong>erővektor</strong> és a hozzá tartozó{" "}
            <strong>nyomatékvektor</strong> komponensei az igénybevételek: a tengelyirányú erő a <strong>normálerő</strong> (<M>{"N"}</M>, húzás pozitív), a keresztmetszet síkjába eső két erőkomponens a <strong>nyíróerők</strong>; a tengelyirányú nyomaték a{" "}
            <strong>csavarónyomaték</strong> (<M>{"T"}</M>, pozitív, ha vektora kifelé mutat — kívülről a keresztmetszetre nézve az óramutatóval ellentétesen forgat), a síkba eső két komponens a <strong>hajlítónyomatékok</strong>.
          </p>
        </div>
        <AbraKeret szam={8} cim="A hat igénybevétel egy keresztmetszeten: a megelőző rész keresztmetszetén a pozitív komponensek a globális tengelyek pozitív irányába mutatnak, a követő részén ugyanezek ellentetten (hatás–ellenhatás).">
          <AbraIgenybevetelek />
        </AbraKeret>
        <Kiemelo tipus="definicio" cim="Az előjelek térben (tankönyv 9.3)">
          <ul className="list-disc space-y-1 pl-5">
            <li>
              A síkbeli „forgasd el a pozitív normálerőt 90°-kal” szabály térben nem egyértelmű (melyik tengely körül?). Ehelyett a tartó szakaszán <strong>lokális koordináta-rendszert</strong> veszünk fel; a keresztmetszetre a <em>követő</em> tartórész felől
              ható igénybevétel pozitív, ha nyila a lokális tengely pozitív irányába mutat; a <em>megelőző</em> részre ható igénybevétel ugyanezzel az előjellel az ellenkező irányba mutat.
            </li>
            <li>
              Ha a tartó szakaszai a globális tengelyekkel párhuzamosak, nem kell külön lokális rendszer: a <strong>követő rész</strong> az, amelyik felé a tartó tengelyével párhuzamos globális tengely mutat, és a nyíróerők, hajlítónyomatékok előjelét a
              keresztmetszet síkjába eső két globális tengely adja.
            </li>
            <li>
              A számítás elve <strong>pontra redukálás</strong>: az egyik rész összes erejét a keresztmetszet pontjába redukáljuk — a követő rész erőiből <M>{"\\underline R_K = \\sum\\underline F"}</M>, <M>{"\\underline M_K = \\sum(\\underline r_i - \\underline r_K)\\times\\underline F_i"}</M>; a megelőző részből ugyanez mínusz előjellel.
            </li>
          </ul>
        </Kiemelo>
        <TankonyvJel fejezet="9.3" cim="Igénybevételi ábrák térben?">
          <p>
            Lehetne rajzolni axonometrikus nézetben, de az ábra pozitív és negatív oldalának meghatározása ugyanolyan problémás, mint az előjeleké. A két hajlítónyomatéki ábra kivétel: azokra előjeltől függetlenül igaz, hogy a <strong>húzott oldalra</strong>{" "}
            kerülnek — akárcsak síkban. A vizsgán egy keresztmetszet igénybevételeit kérik, berajzolva a keresztmetszet képébe (H13/2).
          </p>
        </TankonyvJel>
        <div className="mt-6">
          <Proba>Próbáld ki – vágd el a konzolt bárhol: a hat igénybevétel a keresztmetszeten</Proba>
          <TerbeliKonzolVagas3D />
        </div>

        {/* --- 10.8 --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">10.8 Térfogati teher: folyadékkal terhelt szerkezet</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            A H13/4 feladat mindent összefoglal: egy tartályt <M>{"\\gamma = 15\\ \\text{kN/m}^3"}</M> fajsúlyú folyadék tölt ki, a tartályt gömbcsukló és három rúd támasztja, a sarkán vízszintes erő hat. A folyadék súlya térfogat mentén megoszló teher: eredője{" "}
            <M>{"G = \\gamma V"}</M> a töltés súlypontjában (a falakra ható nyomás a tartály belső erője, a támaszokat nem terheli külön). Utána a 10.5 receptje: nyomatéki egyenletek a csuklón átmenő tengelyekre → a három rúderő egyenként; vetületi egyenletek →
            a csukló három komponense. Részletesen a GYF‑5-ben.
          </p>
        </div>
        <AbraKeret szam={9} cim="A H13/4 szerkezete: 4 × 4 × 2 m-es tartály, γ = 15 kN/m³, gömbcsukló A(4; 0; 4), két függőleges és egy vízszintes támasztórúd, F a felső sarkon.">
          <AbraTartaly />
        </AbraKeret>

        <Szotar
          sorok={[
            { itt: <>nyomatékvektor, <M>{"\\underline r\\times\\underline F"}</M></>, konyv: <>forgatónyomaték a (3.39) szerint; „mindhárom tengely körüli forgató hatás”</>, megjegyzes: "Jobbkezes rendszer: szemből nézve az óramutatóval ellentétes a pozitív." },
            { itt: <>gömbcsukló (3), rúd (1), befogás (6), tengelycsukló (5)</>, konyv: <>térbeli kényszerek és fokszámuk (9.2.1)</>, megjegyzes: "A fokszám = az ismeretlen reakció-adatok száma." },
            { itt: <>bakállvány, csomóponti egyensúly</>, konyv: <>háromlábú bakállvány, (F, S₁, S₂, S₃) ≐ 0</>, megjegyzes: "Közös metszéspontú térbeli erőrendszer: 3 vetületi egyenlet." },
            { itt: <><M>{"\\underline e_i = \\underline l_i/l_i"}</M></>, konyv: <><M>{"\\pm S_i\\,l_{ix}/l_i"}</M></>, megjegyzes: "A ± előjeleket a könyv szemléletből, mi az egységvektor komponenséből vesszük." },
            { itt: <>megelőző / követő tartórész</>, konyv: <>a keresztmetszetet megelőző, illetve követő tartórész</>, megjegyzes: "A követő rész felé mutat a tengelyirányú koordinátatengely." },
            { itt: <>N, Vy, Vz, T, My, Mz</>, konyv: <>normálerő, nyíróerők, csavarónyomaték, hajlítónyomatékok</>, megjegyzes: "A tengelyirányú komponensek N és T; a másik kettő a keresztmetszet síkjában." },
            { itt: <>térfogati teher, <M>{"G = \\gamma V"}</M></>, konyv: <>térfogat mentén megoszló erő (9.1.3)</>, megjegyzes: "Eredője a térfogat súlypontjában." },
            { itt: <>e = 3c, i = r + k</>, konyv: <>térbeli rácsos tartó egyenletei és ismeretlenei</>, megjegyzes: "Hatos átmetszés a síkbeli hármas helyett." },
          ]}
        />

        <Kiemelo tipus="tipp" cim="A leggyakoribb hibák — és hogyan kerüld el őket">
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>A rúderő nem a rúd mentén.</strong> A rúd csak a tengelye irányában hat: bontsd <M>{"S_i\\underline e_i"}</M>-re, a vetületi rajzról leolvasott (rövidebb) hossz helyett a térbeli <M>{"l_i"}</M>-vel ossz.
            </li>
            <li>
              <strong>Kar a rossz tengelyhez.</strong> Az erővel párhuzamos vagy azt metsző tengelyre a nyomaték nulla; ha bizonytalan vagy, <M>{"M_x = yF_z - zF_y"}</M> és társai döntenek.
            </li>
            <li>
              <strong>Megelőző rész plusz előjellel.</strong> A megelőző részből <M>{"-\\sum"}</M>, a követőből <M>{"+\\sum"}</M>; a két oldal ugyanazt adja — ez az ellenőrzésed.
            </li>
            <li>
              <strong>6 × 6-os egyenletrendszer.</strong> Kerüld: nyomaték a csuklón átmenő tengelyekre, vetület a többi rúd síkjára merőlegesen, szimmetria.
            </li>
            <li>
              <strong>Előjel nélküli rúderő.</strong> Nyomott = negatív. A vizsga 5. feladatában „a helyes nagyságú és irányú reakciók érnek pontot”.
            </li>
          </ul>
        </Kiemelo>
      </Szakasz>

      {/* ==================== KIDOLGOZOTT FELADATOK ==================== */}
      <Szakasz
        id="peldak"
        cimke="2. rész"
        cim="Kidolgozott feladatok"
        bevezeto="Hét feladat a H13 feladatsorból, a vizsgamintából és a tankönyv 9.2–9.3 példáiból, számokkal. A recept mindig ugyanaz: elkülönítés → egyensúlyi kijelentés → egyismeretlenes egyenletek (hat egyenlet térben, három a csomópontban) → ellenőrzés → eredményvázlat. Három feladatot film is kísér — kettő közülük forgatható 3D-ben."
        className="bg-white"
      >
        <GyfBlokkok />
      </Szakasz>

      {/* ==================== KALKULÁTOROK ==================== */}
      <Szakasz id="kalkulator" cimke="3. rész" cim="Kalkulátorok" bevezeto="Mindkét kalkulátor a levezetést is kiírja a tankönyv írásmódjával, és a végén visszahelyettesít a hat (illetve három) egyensúlyi egyenletbe.">
        <div className="space-y-8">
          <div>
            <h3 className="mb-2 text-[16px] font-semibold text-petrol-900">Támasztórudak kalkulátora — merev test térben, 3–6 rúddal és gömbcsuklóval</h3>
            <p className="mb-3 text-[14px] text-petrol-600">
              Add meg a rudak két végpontját, a gömbcsuklót, a terheket és a koncentrált nyomatékot: a program kiírja a hat egyensúlyi egyenletet (<M>{"\\Fx"}</M> … <M>{"\\sum M_{iz}"}</M>) az ismeretlenek együtthatóival, megoldja, és visszahelyettesít.
              Alaphelyzetben a H13/4 tartály.
            </p>
            <TamasztorudKalk />
          </div>
          <div>
            <h3 className="mb-2 text-[16px] font-semibold text-petrol-900">Bakállvány kalkulátor — csúcs, három talppont, teher → három rúderő</h3>
            <p className="mb-3 text-[14px] text-petrol-600">A tankönyv (9.3)–(9.5) egyenletei számokkal: rúdhosszak, egységvektorok, a három vetületi egyenlet, megoldás és ellenőrzés; felülnézeti vázlat a rúderők előjelével.</p>
            <BakallvanyKalk />
          </div>
        </div>
      </Szakasz>

      {/* ==================== GYAKORLÁS ==================== */}
      <Szakasz id="gyakorlas" cimke="4. rész" cim="Gyakorlás" bevezeto="Előbb a játék a 3D bakállványon, aztán a fogalmi kvíz, a hibakereső és a számolós generátorok — a vizsga 5. feladatára készülve, minden indításkor új számokkal." className="bg-white">
        <h3 className="mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Előbb játssz – melyik rúd húzott?</h3>
        <TerbeliJatek3D />
        <h3 className="mt-8 mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Az ötlet – fogalmi kvíz</h3>
        <Kviz cim="Érted, vagy csak számolod?" leiras="Tizenöt kérdés a hat egyenletről, a térbeli kényszerekről, a bakállványról, a rácsos tartóról és a térbeli igénybevételek előjeléről." kerdesek={KVIZ} />
        <h3 className="mt-8 mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Hibakereső – találd meg a hibát</h3>
        <Hibakereso feladatok={HIBAK} />
        <h3 className="mt-8 mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Számolós gyakorlás</h3>
        <GyakorloSzekcio />

        <Kiemelo tipus="kulcs" cim="A félév vége — és mi jön ezután">
          <p>
            Akkor vagy kész ezzel a modullal (és a Statikával), ha egy térbeli rajzról fel tudod írni a hat egyensúlyi egyenletet, a bakállvány rúderőit előjelhelyesen kiszámolod, egy befogott konzol reakcióit és egy keresztmetszet hat igénybevételét
            pontra redukálással megkapod, és a végén mindig ellenőrzöl egy nem használt egyenlettel. A <strong>Szilárdságtanban</strong> ugyanezek az igénybevételek folytatódnak: a keresztmetszet súlypontja és másodrendű nyomatéka (4. modul) segítségével az{" "}
            <M>{"N, V, T, M"}</M>-ből feszültségek lesznek — <M>{"\\sigma = N/A + M z/I"}</M> —, és a határozatlan tartók fölös reakcióit is az alakváltozásból számoljuk ki. Vissza az{" "}
            <Link href="/utvonal" className="font-semibold text-petrol-800 underline decoration-naracs-400 underline-offset-2 hover:text-naracs-600">útvonalra</Link>, ha valamelyik korábbi modul még hiányzik.
          </p>
        </Kiemelo>
      </Szakasz>
    </>
  );
}
