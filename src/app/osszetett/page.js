import { ModulFejlec, SzakaszSav } from "@/components/ModulKeret";
import { Szakasz, Kartya, Kiemelo, AbraKeret, TankonyvJel, Szotar } from "@/components/ui/Elemek";
import { M, MB, KepletDoboz } from "@/components/ui/Keplet";
import {
  AbraBelsoCsuklo,
  AbraCsukloHelye,
  AbraGerber,
  AbraGerberValtozatok,
  AbraHaromcsuklos,
  AbraTerheltCsuklo,
  AbraEgyszeruVissza,
  AbraFuggesztomu,
  AbraRudasCsuklo,
  AbraFokszamDoboz,
  AbraEgyebOsszetett,
} from "@/components/abrak/OsszetettAbrak";
import Szetszedo from "@/components/osszetett/Szetszedo";
import SorrendValaszto from "@/components/osszetett/SorrendValaszto";
import HaromcsuklosVandor from "@/components/osszetett/HaromcsuklosVandor";
import GerberCsuklohely from "@/components/osszetett/GerberCsuklohely";
import OsszetettKalk from "@/components/osszetett/OsszetettKalk";
import GyfBlokkok from "@/components/osszetett/Gyf";
import JatekSzetszed from "@/components/osszetett/JatekSzetszed";
import GyakorloSzekcio from "@/components/osszetett/GyakorloSzekcio";
import Kviz from "@/components/Kviz";
import Hibakereso from "@/components/Hibakereso";
import { KVIZ, HIBAK } from "@/components/osszetett/KvizAdatok";
import { modulSlugAlapjan } from "@/lib/oldalterkep";

export const metadata = {
  title: "Összetett tartók",
  description:
    "Belső csukló és elkülönítés, Gerber-tartó, háromcsuklós tartó, csuklón terhelt szerkezet, függesztőmű és feszítőmű — a megoldás sorrendje interaktív szétszedővel, kidolgozott feladatokkal, kalkulátorral és gyakorlással.",
};

const modul = modulSlugAlapjan("/osszetett");

const Proba = ({ children }) => (
  <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">{children}</p>
);

export default function OsszetettOldal() {
  return (
    <>
      <ModulFejlec
        szam={6}
        cim="Összetett tartók"
        leiras="Eddig egyetlen merev testet támasztottunk meg. Most több test kapcsolódik egymáshoz csuklóval vagy rúddal: ebben a modulban megtanulod, mit ad át egy belső csukló, hogyan szeded szét a szerkezetet testekre, és milyen sorrendben írod fel az egyenleteket, hogy mindegyikben egy ismeretlen legyen — Gerber-tartón, háromcsuklós tartón, terhelt csuklón és függesztőművön."
        tartalom={[
          "Belső kényszerek: csukló és rúd",
          "Elkülönítés hatás–ellenhatással",
          "Gerber-tartó: befüggesztett és fix rész",
          "Háromcsuklós tartó és a tolóerő",
          "Terhelt csukló, függesztőmű, feszítőmű",
          "A fokszám-számlálás dobozként",
        ]}
      />
      <SzakaszSav szakaszok={modul.szakaszok} />

      {/* ==================== ELMÉLET ==================== */}
      <Szakasz
        id="elmelet"
        cimke="1. rész"
        cim="Elmélet"
        bevezeto="Az összetett tartó több merev test, amelyeket belső kényszerek kapcsolnak össze. A recept ugyanaz, mint az egyszerű tartónál — csak most a testeket egymástól is elkülönítjük, és a belső csuklóban ellentett erőpárt veszünk fel. A művészet a sorrend: mindig azzal a testtel kezdünk, amelyiknek három ismeretlene van."
      >
        {/* --- 6.1 --- */}
        <h3 className="mt-2 text-xl font-semibold text-petrol-900">6.1 Összetett szerkezet, külső és belső kényszer</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            A több, egymással összekapcsolt merev testből álló szerkezet <strong>összetett szerkezet</strong>; ha bármilyen elrendezésű terhet elvisel, <strong>összetett tartó</strong>. A testeket a földhöz{" "}
            <strong>külső kényszerek</strong> kötik — ezek pontosan az 5. modul görgői, rúdjai, csuklói és befogásai —, egymáshoz pedig <strong>belső kényszerek</strong>. A belső kényszer az összekapcsolt pontok{" "}
            <em>egyes</em> elmozdulás-komponenseit teszi azonossá a két testen, a többi különbözhet.
          </p>
        </div>
        <Kiemelo tipus="definicio" cim="A belső kényszer fokszáma és a belső reakció">
          <p>
            A belső kényszer <strong>fokszáma</strong> az azonosan tartott elmozdulás-komponensek száma. A belső kényszerben <strong>belső reakció</strong> ébred: azonos eltolódásoknál belső reakcióerő, azonos elfordulásoknál
            belső reakciónyomaték. A belső reakciók <strong>mindig párban</strong> lépnek fel, és Newton harmadik törvénye szerint egymás <strong>ellentettei</strong>.
          </p>
        </Kiemelo>
        <div className="proza text-[15px] leading-relaxed text-petrol-700">
          <p>
            Ebből következik az elkülönítés trükkje: az egyik testre felvesszük és elnevezzük a belső reakciót (<M>{"C_x, C_y"}</M>), a másik testre pedig <em>rögzítetten</em> az ellentett irányban vesszük fel (
            <M>{"C'_x, C'_y"}</M>). Így két ismeretlen helyett kettő van összesen, nem négy — a vessző csak azt jelzi, hogy a másik testre hat.
          </p>
        </div>
        <AbraKeret szam={1} cim="A belső csukló és az elkülönítése a tankönyv 5.1. ábrája nyomán: a II. testre C_x, C_y, az I. testre az ellentettjük, azonos nagysággal.">
          <AbraBelsoCsuklo />
        </AbraKeret>
        <TankonyvJel fejezet="5.1.1" cim="A vessző jelentése">
          <p>
            A tankönyv a másik testre ható belső reakciót <M>{"C'_x, C'_y"}</M>-vel jelöli, és kimondja: „ezek nagysága számszerűen azonos az ellentettjükével”. A GYF-ekben ugyanezt írjuk: a csuklóerőt a befüggesztett
            (II.) testre nevezzük el, a fix (I.) testre <M>{"C' = -C"}</M> hat. Terhelt csuklónál a tankönyv <M>{"C_I, C_{II}"}</M> indexekkel különbözteti meg a két testre ható erőt — mert azok már nem ellentettek.
          </p>
        </TankonyvJel>

        {/* --- 6.2 --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">6.2 A belső csukló és a belső rúd</h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <Kartya cimke="fokszám 2" cim="Belső csukló">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">
              A két test pontjainak eltolódását teszi azonossá, egymáshoz képest elfordulhatnak — mint a csukló az alkar és a kézfej között. Jele egy kis kör. Elkülönítéskor <strong>két erőkomponenst</strong> ad át (
              <M>{"C_x, C_y"}</M>), nyomatékot <strong>nem</strong>: a csuklóban a nyomaték nulla. Ez lesz a leghasznosabb egyenletünk.
            </p>
          </Kartya>
          <Kartya cimke="fokszám 1" cim="Belső rúd">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">
              Ugyanúgy viselkedik, mint a támasztórúd: a két csuklót összekötő hatásvonalú, húzottnak feltételezett <M>{"S"}</M> erő, csak most a rúd mindkét végén a kapcsolódó testet húzza (<M>{"S"}</M> és <M>{"S'"}</M>). A
              rudat nem kell elkülöníteni: két erő hat rá, azok közös hatásvonalúak és ellentettek. Ez igaz <strong>töröttvonalú</strong> elemre is, ha csak két pontján kapcsolódik és más erő nem hat rá.
            </p>
          </Kartya>
        </div>
        <Kiemelo tipus="figyelem" cim="Nézd meg jól, mihez kapcsolódik a csukló!">
          <p>
            Három hasonló rajz, három különböző szerkezet: a csukló kapcsolhatja az oszlopot a folytatólagos gerendához (két test), a jobb gerendát a bal gerenda + oszlop merev sarkához (két test), vagy megszakíthatja a
            gerendát úgy, hogy az oszlop is a csuklóhoz fut (három test — és a csuklót külön kell elkülöníteni, mert három erő hat rá). A csuklót akkor is külön elkülönítjük, ha közvetlenül koncentrált erő terheli.
          </p>
        </Kiemelo>
        <AbraKeret szam={2} cim="Hová kapcsolódik a csukló? A tankönyv 5.2. ábrája nyomán: a), b) két test; c) három test és a külön elkülönítendő csukló; d) terhelt csukló.">
          <AbraCsukloHelye />
        </AbraKeret>
        <div className="mt-6">
          <Proba>Próbáld ki – szedd szét a szerkezetet a csuklónál</Proba>
          <Szetszedo />
        </div>

        {/* --- 6.3 --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">6.3 A reakciószámítás lépései összetett tartón</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Az általános elv: <strong>egy összetett szerkezet csak akkor lehet egyensúlyban, ha minden alkotórésze egyensúlyban van.</strong> A recept az egyszerű tartókénak a testenkénti változata.
          </p>
        </div>
        <div className="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Kartya cimke="1. lépés" cim="Elkülönítés">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">A testeket a földtől <em>és egymástól</em> is elválasztjuk; mindegyiket külön kirajzoljuk a terheivel, a külső és a belső reakciókkal. Kivétel: amire csak két erő hat (rúd).</p>
          </Kartya>
          <Kartya cimke="2. lépés" cim="Kijelentés testenként">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">Minden testre egyensúlyi kijelentés; szokás az összegüket, az egész szerkezet kijelentését is felírni — ebben a belső reakciók kiesnek.</p>
          </Kartya>
          <Kartya cimke="3. lépés" cim="Egyenletek — sorrendben">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">Egyismeretlenes egyenletek sorozata; néha egy korábbi eredményt is fel kell használni. <strong>Minden egyenletnél feltüntetjük, melyik kijelentésből jön.</strong></p>
          </Kartya>
          <Kartya cimke="4. lépés" cim="Ellenőrzés">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">Egy nem használt egyenlet — az általánosság kedvéért egy eddig nem használt kijelentésből (pl. az egészre).</p>
          </Kartya>
          <Kartya cimke="5. lépés" cim="Eredményvázlat testenként">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">Minden testre külön, a rá ható tényleges reakcióerőkkel.</p>
          </Kartya>
        </div>
        <TankonyvJel fejezet="5.2" cim="Három különböző ΣFᵢₓ egyenlet">
          <p>
            A tankönyv lábjegyzete: egy két részre bontott tartón már három <M>{"\\sum F_{ix}"}</M> fejlécű, mégis különböző egyenlet írható fel — aszerint, hogy az egyik rész, a másik rész vagy a teljes szerkezet
            egyensúlyából számolunk. Ezért írjuk az egyenlet elé az <strong>I:</strong>, <strong>II:</strong>, <strong>Σ:</strong> jelet, például <M>{"\\text{II:}\\ \\Mp{C}\\ \\ldots = 0"}</M>.
          </p>
        </TankonyvJel>
        <Kiemelo tipus="kulcs" cim="Számold dobozként: hány ismeretlen, hány egyenlet?">
          <p>
            Az egyenletválasztáshoz a tankönyv azt javasolja, hogy tartsuk számon: egy-egy kijelentésben hány ismeretlen skalár szerepel, hány független egyenlet írható belőle (merev testre <strong>3</strong>, csuklóra
            ható közös metszéspontú erőrendszerre <strong>2</strong>), és ezekből hányat használtunk már el. Összesen: <M>{"\\text{ismeretlen} = \\sum\\text{külső fokszám} + \\sum\\text{belső fokszám}"}</M>,{" "}
            <M>{"\\text{egyenlet} = 3\\cdot\\text{testek} + 2\\cdot\\text{terhelt csuklók}"}</M>. Ha a kettő egyenlő, a tartó statikailag határozott (feltéve, hogy az elrendezés nem degenerált — 7. fejezet).
          </p>
        </Kiemelo>
        <AbraKeret szam={3} cim="A fokszám-mérleg három tipikus szerkezetre: a belső csukló 2, a rúd 1 ismeretlent hoz; a testek 3-3 egyenletet, a rúdcsuklók 2-2-t.">
          <AbraFokszamDoboz />
        </AbraKeret>
        <div className="mt-6">
          <Proba>Próbáld ki – melyik testtel, melyik pontra, milyen sorrendben?</Proba>
          <SorrendValaszto />
        </div>

        {/* --- 6.4 --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">6.4 Gerber-tartó (tankönyv 5.3.1)</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            <strong>Gerber-tartónak</strong> nevezzük azt az összetett tartót, amelynek van legalább egy <strong>fix</strong> és egy <strong>befüggesztett</strong> része. A fix rész csupán a külső kényszereivel is
            tartóként viselkedik; a befüggesztett rész a külső kényszereivel még nem tudná megtartani a terheit, csak a többi részre támaszkodva. A Gerber-tartó vizsgálatát <strong>egyszerű tartók sorozatára</strong>{" "}
            vezetjük vissza: a befüggesztett rész egyensúlyából kapott belső reakciókat külső teherként működtetjük a fix részen. Ez egyben az építés sorrendje is — fordítva: előbb a fix rész épül, arra kerül a
            befüggesztett.
          </p>
        </div>
        <AbraKeret szam={4} cim="Gerber-tartó a tankönyv 5.4. ábrája nyomán: a II. test egy görgővel + a belső csuklóval pontosan három ismeretlent hoz — vele kezdünk; a csuklóerő ellentettje a fix részre kerül.">
          <AbraGerber />
        </AbraKeret>
        <KepletDoboz
          cimke="A Gerber-tartó egyenleteinek célszerű sorrendje (5.4.c)"
          keplet={"\\text{II:}\\ \\Mp{C} \\to D,\\quad \\text{II:}\\ \\Mp{D} \\to C_y\\,(C'_y),\\quad \\text{II:}\\ \\Fx \\to C_x\\,(C'_x)"}
          behelyettesitve={"\\text{I:}\\ \\Mp{B} \\to A_y,\\quad \\text{I:}\\ \\Mp{A} \\to B,\\quad \\text{I:}\\ \\Fx \\to A_x;\\qquad \\text{ellenőrzés: } \\Sigma\\!:\\ \\Fy"}
        />
        <Kiemelo tipus="kulcs" cim="A kulcslépés: a befüggesztett rész felismerése">
          <p>
            Kellő gyakorlattal ránézésre megy; addig segít a <strong>három ismeretlent tartalmazó egyensúlyi kijelentés</strong> keresése. Befogott fix résznél (5.5. ábra) a befogás egyedül három ismeretlent hoz, ezért a{" "}
            <em>másik</em> oldal a befüggesztett: ott a görgő + belső csukló ad hármat. Egy fix részhez több befüggesztett rész is kapcsolódhat, befüggesztett rész egy másik befüggesztettre is támaszkodhat (akkor a
            láncot a végéről kezdjük), és a kapcsolat lehet egyetlen rúd is — akkor a befüggesztett rész külső kényszerét kell növelni.
          </p>
        </Kiemelo>
        <AbraKeret szam={5} cim="Gerber-változatok a tankönyv 5.5. és 5.6. ábrája nyomán: befogott fix rész, lánc, egyetlen rúddal befüggesztett rész.">
          <AbraGerberValtozatok />
        </AbraKeret>
        <div className="mt-6">
          <Proba>Próbáld ki – hová tedd a csuklót? (nyomatékok kiegyenlítése)</Proba>
          <GerberCsuklohely />
        </div>

        {/* --- 6.5 --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">6.5 Háromcsuklós tartó (tankönyv 5.3.2)</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Két test, egymáshoz egy csuklóval, a földhöz egy-egy csuklóval kapcsolva: csarnokok keretállásai, ívhidak. A külső támaszok lehetnek azonos vagy eltérő magasságban. A számítás kezdetekor{" "}
            <strong>mindegyik egyensúlyi kijelentésben négy ismeretlen szerepel</strong>, miközben csak három független egyenlet írható — ezért általános esetben kivételesen az első egyenlet helyett{" "}
            <strong>két egyenletből álló egyenletrendszert</strong> oldunk meg: az <M>{"A"}</M> reakcióhoz az I. testre a <M>{"C"}</M>-re írt nyomatéki egyenlet (kizárja a csuklóerőket) és az egész szerkezetre a{" "}
            <M>{"B"}</M>-re írt nyomatéki egyenlet (kizárja <M>{"B"}</M>-t). A két rendszer megoldása után egy-egy test vetületi egyenleteiből jön a belső reakció.
          </p>
        </div>
        <AbraKeret szam={6} cim="Háromcsuklós keret a tankönyv 5.7–5.8. ábrája nyomán: a váz és az elkülönítés a csuklóerő-párral.">
          <AbraHaromcsuklos />
        </AbraKeret>
        <div className="mt-2 grid gap-4 lg:grid-cols-2">
          <Kartya cimke="Ha azonos magasságban vannak a támaszok" cim="Nem kell egyenletrendszer">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">
              Az egész szerkezetre a külső csuklókra írt nyomatéki egyenletekből a <strong>függőleges reakciók közvetlenül</strong> számolhatók (a másik csukló vízszintes komponensének hatásvonala átmegy a ponton). Utána
              egy testre a <M>{"C"}</M>-re írt nyomatéki egyenlet adja a vízszintes reakciót. <strong>Kiemelten fontos, hogy ne hagyjuk ki a vízszintes reakciókat</strong> — függőleges teher mellett sem nullák.
            </p>
          </Kartya>
          <Kartya cimke="Két másik út" cim="Speciális csuklóhelyzet, ferde koordináták, szuperpozíció">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">
              Ha a belső csukló különleges helyen van, az egyik testre a <M>{"C"}</M>-re írt egyenletben egy ismeretlen maradhat. Ferdén felvett koordináta-rendszerrel is elérhető, hogy az egészre írt nyomatéki egyenlet
              egyismeretlenes legyen. Szuperpozícióval a terhelést testenként bontjuk: a terheletlen test két csuklóval rúdként viselkedik, és teheresetenként egy csuklóval és rúddal megtámasztott testet oldunk meg — ez
              grafikus megoldáshoz kényelmes.
            </p>
          </Kartya>
        </div>
        <KepletDoboz
          cimke="Háromcsuklós tartó, azonos magasságú támaszok"
          keplet={"\\Sigma\\!:\\ \\Mp{A} \\to B_y,\\quad \\Sigma\\!:\\ \\Mp{B} \\to A_y,\\quad \\text{II:}\\ \\Mp{C} \\to B_x,\\quad \\Sigma\\!:\\ \\Fx \\to A_x"}
          behelyettesitve={"\\text{II:}\\ \\Fx \\to C_x,\\quad \\text{II:}\\ \\Fy \\to C_y;\\qquad \\text{ellenőrzés: I:}\\ \\Mp{C}"}
        />
        <div className="mt-6">
          <Proba>Próbáld ki – vándoroltasd a terhet, nézd a tolóerőt</Proba>
          <HaromcsuklosVandor />
        </div>

        {/* --- 6.6 --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">6.6 Terhelt csukló (tankönyv 5.3.3)</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Ha a Gerber- vagy a háromcsuklós tartó csuklóját közvetlenül koncentrált erő terheli, a testekre ható csuklóerők <strong>nem egymás ellentettjei</strong>: a csuklóra ható ellentettjeik a terhelő erővel
            tartanak egyensúlyt. A csuklót ezért az elkülönítésben, a kijelentésekben és az egyenletekben is külön kezeljük — közös metszéspontú erőrendszer, két vetületi egyenlet.
          </p>
        </div>
        <AbraKeret szam={7} cim="Csuklóján terhelt Gerber-tartó elkülönítése a tankönyv 5.9. ábrája nyomán: a csuklóra a teher és a két csuklóerő ellentettje hat.">
          <AbraTerheltCsuklo />
        </AbraKeret>
        <div className="mt-2 grid gap-4 lg:grid-cols-2">
          <Kartya cimke="Gerber-tartó" cim="Befüggesztett rész → csukló → fix rész">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">
              A befüggesztett rész kijelentése most is egy egyszerű tartóé. Utána a csuklót mint közös metszéspontú erőrendszert kezeljük: két vetületi egyenletből a fix részről a csuklóra átadódó erő. Végül ennek
              ellentettjét működtetjük a fix részre — ismét egyszerű tartó.
            </p>
          </Kartya>
          <Kartya cimke="Háromcsuklós tartó" cim="Kétismeretlenes rendszerek, a csukló ellenőrzésre">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">
              Az I. test külső csuklóerőihez: I-re <M>{"\\Mp{C}"}</M> + az egészre <M>{"\\Mp{B}"}</M>; a II. test külső csuklóerőihez: II-re <M>{"\\Mp{C}"}</M> + az egészre <M>{"\\Mp{A}"}</M>. A belső csuklóerőket testenként
              vetületi egyenletekből, és a <strong>terhelt csukló egyensúlyával ellenőrzünk</strong>.
            </p>
          </Kartya>
        </div>
        <TankonyvJel fejezet="5.3.3" cim="Miért nem kell a terheletlen csuklót elkülöníteni?">
          <p>
            Ugyanezt a teljes elkülönítést az egyszerű belső csuklónál is el lehetne végezni — de ha a csuklóra csak két erő hat (a két testre ható csuklóerők ellentettjei), akkor az a két erő egymás ellentettje kell
            legyen. Pontosan ezt használtuk ki, amikor a terheletlen csuklóban <M>{"C' = -C"}</M>-t vettünk fel.
          </p>
        </TankonyvJel>

        {/* --- 6.7 --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">6.7 Egyszerű tartóra visszavezethető kialakítások (tankönyv 5.3.4)</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Ha a két testet összekapcsoló belső kényszerek fokszáma összesen <strong>három</strong> (pl. csukló + rúd), akkor a külső kényszerek fokszáma is három, és a teljes szerkezet egyensúlyi kijelentése olyan,
            mint egy egyszerű tartóé: azzal kezdhetünk. A külső reakciók ismeretében akár az I., akár a II. test egyensúlyából számolhatók a belső reakciók. Ha a II. test csak az I.-hez kapcsolódik (a földhöz nem),
            akkor a II. test kijelentése önmagában is egyszerű tartóé — vele is kezdhetünk: ez egy olyan Gerber-tartó, ahol a befüggesztett rész csak a fix részhez kapcsolódik.
          </p>
        </div>
        <AbraKeret szam={8} cim="A tankönyv 5.11. és 5.12. ábrája nyomán: csukló + rúd köti a két testet — az egész szerkezet egyszerű tartóként indul.">
          <AbraEgyszeruVissza />
        </AbraKeret>

        {/* --- 6.8 --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">6.8 Függesztőműves és feszítőműves tartó (tankönyv 5.3.5–5.3.6)</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Két test egy csuklóval összekötve, az egyik csuklóval, a másik görgővel a földhöz: <strong>nem tartó</strong>. A Gerber-tartóhoz képest a fix rész megtámasztása hiányos, a háromcsuklóshoz képest a görgő
            kevés. Tartóvá további kényszerekkel tehető: a <strong>függesztőmű</strong> egymáshoz és a testekhez csuklósan kapcsolódó rudak rendszere a gerenda fölött; a <strong>feszítőmű</strong> ugyanez az x
            tengelyre tükrözve, a gerenda alatt. Fontos, hogy elkülönítsük azokat a csuklókat, amelyekre <strong>kettőnél több erő</strong> hat (<M>{"D, E"}</M>), a rudak erejét viszont egyszerű rúderőként kezeljük.
          </p>
        </div>
        <AbraKeret szam={9} cim="Függesztőmű és feszítőmű a tankönyv 5.13–5.14. ábrája nyomán: 10 ismeretlen, 3 + 3 + 2 + 2 egyenlet.">
          <AbraFuggesztomu />
        </AbraKeret>
        <KepletDoboz
          cimke="A függesztőmű megoldásának sorrendje (5.13.d)"
          keplet={"\\Sigma\\!:\\ \\Mp{A}, \\Mp{B}, \\Fx \\to B, A_y, A_x;\\qquad \\text{I+D:}\\ \\Mp{C}, \\Fx, \\Fy \\to S_3, C_x, C_y"}
          behelyettesitve={"\\text{D:}\\ \\Fx, \\Fy \\to S_1, S_2;\\qquad \\text{E:}\\ \\Fx, \\Fy \\to S_4, S_5"}
        />
        <Kiemelo tipus="tipp" cim="Az összevonás trükkje">
          <p>
            Az I. testet és a <M>{"D"}</M> csuklót <strong>együtt</strong> különítjük el (5.13.c ábra): a rajtuk átmenő <M>{"S_1, S_2"}</M> belső erővé válik és kiesik, marad egy egyszerű tartó képe az{" "}
            <M>{"A"}</M>, <M>{"C"}</M> és a vízszintes <M>{"S_3"}</M> ismeretlenekkel. A csuklók vetületi egyenletei ezután egyenként adják a rúderőket — a feszítőműnél (több csuklóval) ugyanígy, csak hosszabban.
          </p>
        </Kiemelo>
        <AbraKeret szam={10} cim="A H06/5–6 szerkezete: rudakkal tartott, terhelt csukló — a GYF‑5 feladata. A rudak nem kell elkülöníteni, a D csuklót igen.">
          <AbraRudasCsuklo />
        </AbraKeret>

        {/* --- 6.9 --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">6.9 Egyéb összetett tartók (tankönyv 5.3.7)</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            <strong>Ál-háromcsuklós tartók:</strong> két testet két rúd köt össze, mindkettő csuklóval a földhöz (5.15) — a fokszámok testenkénti összege a háromcsuklós tartóéval egyezik, és a megoldás is hasonló:
            kétismeretlenes rendszer az egészre írt <M>{"\\Mp{B}"}</M> és az I. testre a két rúd hatásvonalának metszéspontjára írt nyomatéki egyenletből. A 2-2-2 fokszámú kialakítás (5.16) két fél-Gerber-tartóként is
            megoldható: a vízszintes erőkre az egyik, a függőlegesekre a másik test a befüggesztett.
          </p>
          <p>
            <strong>Többszörösen összetett tartók</strong> (5.17): egy megépült részhez kapcsoljuk a hozzáépítetteket, amelyek sokszor befüggesztett részként viselkednek — a reakciókat az építéssel <em>ellentétes</em>{" "}
            sorrendben számoljuk: előbb a befüggesztettek, aztán a fix háromcsuklós tartó a belső reakciók ellentettjeivel. <strong>Zárt keret</strong> (5.18): a külső erők szempontjából egyetlen test, a{" "}
            <M>{"CDE"}</M> rész pedig olyan, mintha <M>{"C"}</M> és <M>{"E"}</M> külső csuklók lennének — háromcsuklós tartóként számolható, az I. test egyenletei ellenőrzésre maradnak.
          </p>
        </div>
        <AbraKeret szam={11} cim="Ál-háromcsuklós tartó és zárt keret a tankönyv 5.15. és 5.18. ábrája nyomán.">
          <AbraEgyebOsszetett />
        </AbraKeret>

        <Szotar
          sorok={[
            { itt: <>belső csuklóerő <M>{"C_x, C_y"}</M></>, konyv: <>belső reakció, <M>{"C_x, C_y"}</M> és <M>{"C'_x, C'_y"}</M></>, megjegyzes: "A vesszős a másik testre hat, az ellentett irányban rögzítve; számértékük azonos." },
            { itt: <>II. test = „amelyik nem áll meg egyedül”</>, konyv: <>befüggesztett rész / fix rész</>, megjegyzes: "A befüggesztett rész kijelentésében pontosan három ismeretlen van." },
            { itt: <>szétszedés</>, konyv: <>elkülönítés (a földtől és egymástól)</>, megjegyzes: "Amire csak két erő hat, azt nem: rúd." },
            { itt: <>I:, II:, Σ: az egyenlet előtt</>, konyv: <>„fel kell tüntetni, melyik egyensúlyi kijelentés alapján”</>, megjegyzes: "Három különböző ΣFx egyenlet létezik egy kéttestű szerkezeten." },
            { itt: <>tolóerő <M>{"H"}</M></>, konyv: <>a külső csuklók vízszintes reakciókomponense</>, megjegyzes: "Háromcsuklós tartónál sose felejtsd ki." },
            { itt: <>a csukló mint külön test</>, konyv: <>terhelt csukló: közös metszéspontú erőrendszer</>, megjegyzes: "Két vetületi egyenlet; C_I ≠ −C_II." },
            { itt: <>test + csukló együtt</>, konyv: <>csukló és test összevonása (5.13.c)</>, megjegyzes: "A közös rudak erői belsővé válnak és kiesnek." },
          ]}
        />

        <Kiemelo tipus="tipp" cim="A leggyakoribb hibák — és hogyan kerüld el őket">
          <ul className="list-disc space-y-1 pl-5">
            <li><strong>A csuklóerő ellentettje lemarad</strong> a fix részről. Ha egy testen „nincs teher”, ott van a csuklóerő.</li>
            <li><strong>Háromcsuklós tartónál A_x = B_x = 0</strong>, „mert a teher függőleges”. A ΣF<sub>x</sub> csak annyit mond: <M>{"A_x = -B_x"}</M>. A C-re írt nyomatéki egyenlet adja a nagyságukat.</li>
            <li><strong>Terhelt csuklón a terhet „odaadod” egy testnek</strong> — a csukló egyensúlya osztja szét, három részt különíts el.</li>
            <li><strong>Egy testre négy egyenlet.</strong> Testenként három független; a negyedik ellenőrzés. A hiányzó ismeretlent a másik testből hozd.</li>
            <li><strong>A teljes megoszló teher eredője</strong> egy testre írt egyenletben — csak a testre eső rész eredője jár.</li>
            <li><strong>Az ellenőrzés a Σ-ból</strong>: a csuklóerők kiesnek, minden reakció benne van — terhelt csuklónál a csuklón ható teher is.</li>
          </ul>
        </Kiemelo>
      </Szakasz>

      {/* ==================== KIDOLGOZOTT FELADATOK ==================== */}
      <Szakasz
        id="peldak"
        cimke="2. rész"
        cim="Kidolgozott feladatok"
        bevezeto="A tankönyv 5.3 példái számokkal és a H05–H06 feladatai. Minden feladatban ugyanaz a recept: elkülönítés testenként, kijelentések, egyismeretlenes egyenletek a befüggesztett résszel (vagy az egésszel) kezdve, ellenőrzés, eredményvázlat. Az egyenletek előtt mindig ott az I:, II:, Σ: — figyeld, melyik testből jön."
        className="bg-white"
      >
        <GyfBlokkok />
      </Szakasz>

      {/* ==================== KALKULÁTOR ==================== */}
      <Szakasz
        id="kalkulator"
        cimke="3. rész"
        cim="Kalkulátorok"
        bevezeto="Paraméteres Gerber-tartó, Gerber befogással és háromcsuklós keret — mindegyiknél terhelhető a csukló is. A program kiszámolja a reakciókat és a belső csuklóerőt, és kiírja a tankönyvi levezetést testenként; a főpontokra rámutat a rajzon, ha a lépés fölé viszed az egeret."
      >
        <div className="space-y-8">
          <div>
            <h3 className="mb-2 text-[16px] font-semibold text-petrol-900">Összetett tartó kalkulátor — reakciók, csuklóerő, levezetés</h3>
            <p className="mb-3 text-[14px] text-petrol-600">
              Alaphelyzetben a GYF‑1 Gerber-tartója: <M>{"D = 5{,}333"}</M>, <M>{"C_y = 2{,}667"}</M>, <M>{"B = 9{,}196"}</M>, <M>{"A_y = 3{,}863"}</M>, <M>{"A_x = -6\\ \\text{kN}"}</M>. Told el a csuklót, tegyél terhet a
              csuklóra, vagy válts háromcsuklós keretre — a levezetés sorrendje követi a szerkezetet.
            </p>
            <OsszetettKalk />
          </div>
          <div>
            <h3 className="mb-2 text-[16px] font-semibold text-petrol-900">Gerber-tartó csuklóhely-csúszkával</h3>
            <p className="mb-3 text-[14px] text-petrol-600">Ugyanaz a felfedező, mint az elméletben: hol legyen a csukló, hogy a támasz feletti és a mezőbeli nyomaték egyenlő legyen?</p>
            <GerberCsuklohely />
          </div>
        </div>
      </Szakasz>

      {/* ==================== GYAKORLÁS ==================== */}
      <Szakasz
        id="gyakorlas"
        cimke="4. rész"
        cim="Gyakorlás"
        bevezeto="Előbb a játék: szedd szét és számold. Aztán a fogalmi kvíz, a hibakereső és a számolós generátorok — kilenc feladattípus, mindegyik új számokkal minden indításkor."
        className="bg-white"
      >
        <h3 className="mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Előbb játssz – szedd szét és számold</h3>
        <JatekSzetszed />
        <h3 className="mt-8 mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Az ötlet – fogalmi kvíz</h3>
        <Kviz cim="Érted, vagy csak számolod?" leiras="Tizenhárom kérdés a belső csuklóról, a befüggesztett részről, a tolóerőről és a terhelt csuklóról." kerdesek={KVIZ} />
        <h3 className="mt-8 mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Hibakereső – találd meg a hibát</h3>
        <Hibakereso feladatok={HIBAK} />
        <h3 className="mt-8 mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Számolós gyakorlás</h3>
        <GyakorloSzekcio />

        <Kiemelo tipus="kulcs" cim="Mikor mehetsz tovább">
          <p>
            Akkor vagy kész ezzel a modullal, ha egy Gerber-tartót és egy háromcsuklós keretet segítség nélkül szét tudsz szedni, meg tudod mondani, melyik testtel kezdesz és miért, és a csuklóerőt a helyes előjellel
            írod át a másik testre. A következő modulban (rácsos tartók) ugyanez a gondolat megy tovább: ott <em>minden</em> elem rúd, és minden csomópont egy közös metszéspontú erőrendszer — a csomóponti módszer a
            terhelt csukló egyenleteinek sokszorozása. A 8. modul pedig azt vizsgálja, mikor <em>nem</em> elég a fokszámok egyezése: a degenerált elrendezéseket.
          </p>
        </Kiemelo>
      </Szakasz>
    </>
  );
}
