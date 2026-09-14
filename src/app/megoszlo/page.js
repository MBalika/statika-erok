import { ModulFejlec, SzakaszSav } from "@/components/ModulKeret";
import { Szakasz, Kartya, Kiemelo, AbraKeret, KetOszlop } from "@/components/ui/Elemek";
import { M, MB, KepletDoboz } from "@/components/ui/Keplet";
import { KidolgozottFeladat, Lepes } from "@/components/KidolgozottFeladat";
import TrapezTeherFelfedezo from "@/components/abrak/TrapezTeherFelfedezo";
import SzakaszosTeherKalk from "@/components/abrak/SzakaszosTeherKalk";
import { AbraMegoszloFogalom, AbraAlapesetek, AbraFelbontas, AbraFerdeVetulet } from "@/components/abrak/MegoszloAbrak";
import { AbraTrapezTeher, AbraValtakozoTeher, AbraFureszfogTeher } from "@/components/abrak/MegoszloFeladatAbrak";
import GyakorloSzekcio from "@/components/megoszlo/GyakorloSzekcio";
import FilmGyf1 from "@/components/megoszlo/FilmGyf1";
import FilmGyf2 from "@/components/megoszlo/FilmGyf2";
import FilmGyf3 from "@/components/megoszlo/FilmGyf3";
import { Film3DTeherLepel } from "@/components/harom/Film3D";
import { modulSlugAlapjan } from "@/lib/oldalterkep";

export const metadata = {
  title: "Megoszló erők",
  description:
    "Vonal mentén megoszló teher eredőjének nagysága és helye, felbontási technikák, szakaszos és ferde terhek — interaktív ábrákkal, kidolgozott feladatokkal és gyakorlással.",
};

const modul = modulSlugAlapjan("/megoszlo");

export default function MegoszloOldal() {
  return (
    <>
      <ModulFejlec
        szam={3}
        cim="Megoszló erők"
        leiras="A valódi terhek ritkán egy pontban hatnak: a hó a tetőn, a víz a gáton, egy fal a gerendán mind hosszú szakaszon oszlik el. Ebben a modulban megtanulod, hogyan válts át egy ilyen terhet egyetlen erőre — nagyságban és helyben is."
        tartalom={["Intenzitás, kN/m", "Az eredő = terület", "A hely = súlypont", "Felbontás", "Előjeles szakaszok", "Ferde vonal mentén"]}
      />
      <SzakaszSav szakaszok={modul.szakaszok} />

      {/* ==================== ELMÉLET ==================== */}
      <Szakasz
        id="elmelet"
        cimke="1. rész"
        cim="Elmélet"
        bevezeto="Két szabály, és kész: az eredő nagysága a teherábra területe, a helye pedig a teherábra súlypontja. Minden más ebből következik."
      >
        <h3 className="mt-2 text-xl font-semibold text-petrol-900">3.1 Mi a megoszló teher?</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Az eddigi modulokban az erők egy-egy pontban hatottak. A szerkezetek nagy részét azonban{" "}
            <strong>megoszló teher</strong> éri: a gerenda önsúlya, a födémről érkező teher, a hó, a
            szél, a víznyomás mind egy vonal vagy felület mentén oszlik el. Az ilyen terhet nem
            nagyságával, hanem <strong>intenzitásával</strong> adjuk meg: mekkora erő jut a tartó egy
            méterére. Jele <M>{"p"}</M>, mértékegysége kN/m.
          </p>
          <p>
            Innentől egy másik koordináta-rendszert használunk, mint eddig: az <M>{"x"}</M> tengely a
            tartó mentén mutat, a <M>{"z"}</M> tengely pedig <strong>lefelé</strong>. Ez nem
            önkényes: a terhek túlnyomó része lefelé hat, így a leggyakoribb teher pozitív előjelű
            lesz, és kevesebb mínuszjellel kell bajlódni.
          </p>
        </div>

        <AbraKeret szam={1} cim="A megoszló teher egy dx hosszú darabjára p·dx erő jut. Az egész teher ilyen elemi erők összege.">
          <AbraMegoszloFogalom />
        </AbraKeret>

        <h3 className="mt-10 text-xl font-semibold text-petrol-900">3.2 Az eredő nagysága: a teherábra területe</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Ha a terhet apró darabokra vágjuk, minden darabra <M>{"p(x)\\,dx"}</M> erő jut, és ezek
            mind párhuzamosak. Az eredő ezek összege — vagyis a <M>{"p(x)"}</M> függvény alatti
            terület. Ezért mondjuk, hogy <strong>az eredő nagysága a teherábra területe</strong>. A
            mértékegység is kijön: kN/m szorozva méterrel az kN.
          </p>
        </div>
        <KepletDoboz cimke="Az eredő nagysága" keplet={"R = \\int_0^L p(x)\\,dx = \\text{a teherábra területe}"} />

        <h3 className="mt-10 text-xl font-semibold text-petrol-900">3.3 Az eredő helye: a teherábra súlypontja</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            A helyet ugyanúgy kapjuk, mint a 2. modulban a párhuzamos erőknél: az eredőnek ugyanakkora
            nyomatékot kell adnia, mint az elemi erőknek együtt. Ez éppen a teherábra súlypontjának a
            képlete — <strong>az eredő a teherábra súlypontján megy át</strong>. Téglalapnál ez a
            közép, háromszögnél a magas oldaltól a hossz harmada.
          </p>
        </div>
        <KepletDoboz cimke="Az eredő helye (nyomatéki egyenlet)" keplet={"R\\,k = \\int_0^L x\\,p(x)\\,dx \\quad\\Rightarrow\\quad k = \\frac{\\int x\\,p\\,dx}{\\int p\\,dx}"} />

        <AbraKeret szam={2} cim="A három alapeset. A háromszögnél a súlypont mindig a magas oldalhoz esik közelebb.">
          <AbraAlapesetek />
        </AbraKeret>

        <Kiemelo tipus="figyelem" cim="L/3 — de melyik végtől?">
          <p>
            A háromszög alakú teher eredője a hossz harmadánál működik, de <em>a magas oldaltól</em>{" "}
            mérve. Ha a teher balról jobbra nő, a súlypont a jobb véghez van közel, tehát a bal végtől{" "}
            <M>{"2L/3"}</M>-ra. Ez az a hiba, amit a legtöbben elkövetnek: fejben tartják az „L/3"-at,
            és rossz végtől mérik.
          </p>
        </Kiemelo>

        <h3 className="mt-10 text-xl font-semibold text-petrol-900">3.4 Felbontás egyszerű részekre</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Egy trapéz alakú terhet nem kell integrálni: felbontjuk olyan darabokra, amelyeknek ismert
            a területe és a súlypontja, és a darabok eredőit párhuzamos erőrendszerként vonjuk össze.
            Két természetes felbontás kínálkozik, és <strong>mindkettő ugyanarra az eredményre
            vezet</strong> — a GYF‑1 feladatot lentebb mindkét úton végigszámoljuk.
          </p>
        </div>

        <AbraKeret szam={3} cim="Ugyanaz a trapéz kétféleképpen felbontva. A részek mások, az eredő ugyanaz.">
          <AbraFelbontas />
        </AbraKeret>

        <KepletDoboz
          cimke="Trapéz teher közvetlenül (ha nem akarsz felbontani)"
          keplet={"R = \\frac{p_1 + p_2}{2}\\,L,\\qquad k = \\frac{L}{3}\\cdot\\frac{p_1 + 2p_2}{p_1 + p_2}\\quad(\\text{a } p_1 \\text{ oldaltól})"}
        />

        <div className="mt-6">
          <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Próbáld ki – húzd a teher sarkait</p>
          <TrapezTeherFelfedezo />
        </div>

        <h3 className="mt-10 text-xl font-semibold text-petrol-900">3.5 Szakaszos és előjeles terhek</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Ha a teher szakaszonként más — vagy egy szakaszon éppen felfelé hat —, minden szakaszt
            külön eredőre váltunk, és az eredőket előjelesen adjuk össze. A lefelé mutató teher
            pozitív, a felfelé mutató negatív, és ez az előjel végigmegy a nyomatéki egyenleten is.
            Az eredmény lehet nulla is: akkor a teher erőpárra redukálódik, pontosan úgy, ahogy a 2.
            modulban láttuk.
          </p>
        </div>
        <KepletDoboz cimke="Több szakasz összevonása" keplet={"R = \\sum_i R_i,\\qquad k = \\frac{\\sum_i R_i\\,x_i}{R}\\qquad(R_i \\text{ előjeles, } x_i \\text{ a rész súlypontja})"} />

        <h3 className="mt-10 text-xl font-semibold text-petrol-900">3.6 Ferde vonal mentén megoszló erő</h3>
        <KetOszlop>
          <div className="proza text-[15px] leading-relaxed text-petrol-700">
            <p>
              Ferde rúdnál két dolgot kell tisztázni: <strong>mire vonatkozik</strong> az intenzitás,
              és <strong>merre mutat</strong> a teher. A rúd hossza mentén megadott teher (például a
              felületre merőleges szélnyomás) eredője az intenzitás és a ferde hossz szorzata. A
              vízszintes vetületre megadott teher (például a hó, amit alaprajzi négyzetméterre adnak
              meg) eredője az intenzitás és a vetület hosszának szorzata. Az eredő helye mindkét
              esetben a szakasz felezőpontja, ha a teher egyenletes.
            </p>
          </div>
          <AbraKeret szam={4} cim="Ugyanaz a rúd, kétféle vonatkoztatás. A rajzon mindig nézd meg, mire vonatkozik a p.">
            <AbraFerdeVetulet />
          </AbraKeret>
        </KetOszlop>

        <Kiemelo tipus="kulcs" cim="Mire jó az eredő, és mire nem">
          <p>
            A megoszló teher eredőjével a tartó <em>egészének</em> egyensúlyát vizsgálhatod: reakciók,
            felborulás, elcsúszás. Amint a tartó belsejébe nézel — igénybevételi ábrák, egy
            keresztmetszet nyomatéka —, az eredő már nem használható, mert nem mindegy, hogy a teher
            egy pontban vagy hosszan oszlik el. Az eredő az egész teherre nézve egyenértékű, egy-egy
            darabjára nézve nem.
          </p>
        </Kiemelo>
      </Szakasz>

      {/* ==================== KIDOLGOZOTT FELADATOK ==================== */}
      <Szakasz
        id="peldak"
        cimke="2. rész"
        cim="Kidolgozott feladatok"
        bevezeto="A gyakorlat három feladata. Az elsőt szándékosan kétféle felbontással is végigszámoljuk, ahogy a gyakorlat megoldólapja is teszi."
        className="bg-white"
      >
        <KidolgozottFeladat
          jel="GYF‑1"
          ido="2 perc"
          forras="A1. gyakorlat"
          cim="Trapéz alakú teher eredője — kétféleképpen"
          feladat={<p>Határozd meg az ábrán látható megoszló erő eredőjét! A teher intenzitása a bal végen 1,8 kN/m, a jobb végen 3,6 kN/m, a szakasz hossza 4,5 m.</p>}
          abra={
            <AbraKeret cim="Lineárisan növekvő teher.">
              <AbraTrapezTeher />
            </AbraKeret>
          }
          tanulsag={
            <p>
              Két felbontás, ugyanaz az eredmény: 12,15 kN a bal végtől 2,5 méterre. Válaszd azt,
              amelyik kevesebb számolás — de ha bizonytalan vagy, számold ki a másikkal is, és ha
              egyezik, biztos lehetsz benne.
            </p>
          }
        >
          <Lepes cim="I. megoldás: téglalap + háromszög">
            <p>
              A trapézt egy 1,8 kN/m intenzitású téglalapra és egy 0-tól 1,8 kN/m-ig növekvő háromszögre
              bontjuk. Az egyenértékűségi kijelentés: <M>{"(\\underline{R}_1, \\underline{R}_2) \\doteq \\underline{R}"}</M>.
            </p>
            <MB>{"R_1 = \\frac{1{,}8\\cdot 4{,}5}{2} = 4{,}05\\ \\text{kN}\\quad(\\text{háromszög})"}</MB>
            <MB>{"R_2 = 1{,}8\\cdot 4{,}5 = 8{,}1\\ \\text{kN}\\quad(\\text{téglalap})"}</MB>
          </Lepes>

          <Lepes cim="I. megoldás: az eredő nagysága és helye">
            <p>A háromszög súlypontja a magas (jobb) oldaltól a hossz harmadára, tehát balról 3 m-re van; a téglalapé a felezőpontban.</p>
            <MB>{"R = R_1 + R_2 = 4{,}05 + 8{,}1 = 12{,}15\\ \\text{kN}"}</MB>
            <MB>{"R\\,k = R_1\\cdot 4{,}5\\cdot\\tfrac{2}{3} + R_2\\cdot\\tfrac{4{,}5}{2} = 4{,}05\\cdot 3 + 8{,}1\\cdot 2{,}25 = 30{,}375\\ \\text{kNm}"}</MB>
            <MB>{"k = \\frac{30{,}375}{12{,}15} = 2{,}5\\ \\text{m}"}</MB>
          </Lepes>

          <Lepes cim="II. megoldás: két háromszög">
            <p>
              Ugyanez a trapéz két háromszög összege is: az egyiknek a bal végen 1,8 kN/m a magassága,
              a másiknak a jobb végen 3,6 kN/m.
            </p>
            <MB>{"R_1 = 1{,}8\\cdot 4{,}5\\cdot\\tfrac12 = 4{,}05\\ \\text{kN}\\quad(\\text{magas oldal balra, } x_1 = 1{,}5\\ \\text{m})"}</MB>
            <MB>{"R_2 = 3{,}6\\cdot 4{,}5\\cdot\\tfrac12 = 8{,}1\\ \\text{kN}\\quad(\\text{magas oldal jobbra, } x_2 = 3{,}0\\ \\text{m})"}</MB>
          </Lepes>

          <Lepes cim="II. megoldás: ugyanaz az eredő">
            <MB>{"R = 4{,}05 + 8{,}1 = 12{,}15\\ \\text{kN}"}</MB>
            <MB>{"R\\,k = 4{,}05\\cdot 1{,}5 + 8{,}1\\cdot 3{,}0 = 6{,}075 + 24{,}3 = 30{,}375\\ \\text{kNm}"}</MB>
            <MB>{"k = 2{,}5\\ \\text{m}"}</MB>
            <p>
              Ellenőrzés a közvetlen képlettel:{" "}
              <M>{"k = \\tfrac{4{,}5}{3}\\cdot\\tfrac{1{,}8 + 2\\cdot 3{,}6}{1{,}8 + 3{,}6} = 1{,}5\\cdot 1{,}667 = 2{,}5\\ \\text{m}"}</M>.
            </p>
          </Lepes>
        </KidolgozottFeladat>

        <div className="my-8">
          <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Ugyanez filmen – a teher egyetlen erővé húzódik össze</p>
          <FilmGyf1 />
        </div>

        <div className="my-8">
          <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">És 3D-ben – a teherlepel a gerendán</p>
          <Film3DTeherLepel />
        </div>

        <KidolgozottFeladat
          jel="GYF‑2"
          ido="1 perc"
          forras="A1. gyakorlat"
          cim="Váltakozó irányú szakaszos teher"
          feladat={<p>Határozd meg az ábrán látható megoszló erő eredőjét! A teher intenzitása 7 kN/m, három egyenlő, 1,2 m hosszú szakaszon; a középső szakaszon felfelé hat.</p>}
          abra={
            <AbraKeret cim="Három egyforma szakasz, a középső ellentétes irányú.">
              <AbraValtakozoTeher />
            </AbraKeret>
          }
          tanulsag={
            <p>
              A három rész egyforma nagyságú, ezért az eredő pont annyi, mint egyetlen szakaszé, és a
              szimmetria miatt a teljes szakasz közepén működik. A nyomatéki egyenlet csak megerősíti,
              amit a szimmetria már megsúgott — mindig nézd meg, van-e ilyen rövidítés.
            </p>
          }
        >
          <Lepes cim="A három rész eredője">
            <MB>{"R_1 = R_2 = R_3 = 7\\cdot 1{,}2 = 8{,}4\\ \\text{kN}"}</MB>
            <p>Mindhárom a saját szakaszának a közepén működik: 0,6 m, 1,8 m és 3,0 m a bal végtől.</p>
          </Lepes>

          <Lepes cim="Az eredő nagysága, előjelesen">
            <p>A középső rész felfelé mutat, ezért negatív előjellel kerül az összegbe:</p>
            <MB>{"R = R_1 - R_2 + R_3 = 8{,}4 - 8{,}4 + 8{,}4 = 8{,}4\\ \\text{kN}\\quad(\\downarrow)"}</MB>
          </Lepes>

          <Lepes cim="Az eredő helye">
            <p>A nyomatéki egyenletben az előjelek ugyanúgy szerepelnek:</p>
            <MB>{"R\\,k = R_1\\cdot 0{,}6 - R_2\\cdot 1{,}8 + R_3\\cdot 3{,}0 = 5{,}04 - 15{,}12 + 25{,}2 = 15{,}12\\ \\text{kNm}"}</MB>
            <MB>{"k = \\frac{15{,}12}{8{,}4} = 1{,}8\\ \\text{m}"}</MB>
          </Lepes>
        </KidolgozottFeladat>

        <div className="my-8">
          <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Ugyanez filmen – előjeles szakaszok</p>
          <FilmGyf2 />
        </div>

        <KidolgozottFeladat
          jel="GYF‑3"
          ido="1 perc"
          forras="A1. gyakorlat"
          cim="Fűrészfog alakú teher"
          feladat={<p>Határozd meg az ábrán látható megoszló erő eredőjét! Két egyforma, háromszög alakú szakasz, mindegyik 6 m hosszú, a bal végén 4 kN/m intenzitással.</p>}
          abra={
            <AbraKeret cim="Két fűrészfog, mindkettőnek a bal oldala a magas.">
              <AbraFureszfogTeher />
            </AbraKeret>
          }
          tanulsag={
            <p>
              Az eredő nem a teljes szakasz közepén (6 m) van, hanem attól balra: mindkét háromszög a
              bal oldalán nehezebb. Ha az eredmény a közép lett volna, gyanakodnod kellene.
            </p>
          }
        >
          <Lepes cim="A két háromszög eredője">
            <MB>{"R_1 = R_2 = 4\\cdot\\frac{6}{2} = 12\\ \\text{kN}"}</MB>
            <MB>{"R = R_1 + R_2 = 24\\ \\text{kN}\\quad(\\downarrow)"}</MB>
          </Lepes>

          <Lepes cim="A részek helye">
            <p>Mindkét háromszögnek a bal oldala a magas, ezért a súlypont a saját bal végétől a hossz harmadára, 2 m-re van:</p>
            <MB>{"x_1 = \\frac{6}{3} = 2\\ \\text{m},\\qquad x_2 = 6 + \\frac{6}{3} = 8\\ \\text{m}"}</MB>
          </Lepes>

          <Lepes cim="Az eredő helye">
            <MB>{"R\\,k = R_1\\cdot 2 + R_2\\cdot 8 = 24 + 96 = 120\\ \\text{kNm}"}</MB>
            <MB>{"k = \\frac{120}{24} = 5\\ \\text{m}"}</MB>
          </Lepes>
        </KidolgozottFeladat>
        <div className="my-8">
          <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Ugyanez filmen – a fűrészfog eredője</p>
          <FilmGyf3 />
        </div>

      </Szakasz>

      {/* ==================== KALKULÁTOR ==================== */}
      <Szakasz
        id="kalkulator"
        cimke="3. rész"
        cim="Kalkulátor"
        bevezeto="Tetszőleges számú szakasz, egyenletes vagy háromszög alakú, előjeles intenzitással. A GYF‑2 és a GYF‑3 adatai egy gombbal betölthetők."
      >
        <SzakaszosTeherKalk />
        <Kiemelo tipus="tipp" cim="Trapéz szakasz a kalkulátorban">
          <p>
            A kalkulátor szakaszai egymás után következnek, ezért egy trapéz alakú szakaszt nem tud
            közvetlenül kezelni. Ilyenkor bontsd fel fejben egy egyenletes és egy háromszög alakú részre
            (ugyanazon a hosszon), és számold a két rész eredőjét külön — vagy használd a fenti
            trapéz-felfedezőt, az közvetlenül adja az eredőt és a helyét.
          </p>
        </Kiemelo>
      </Szakasz>

      {/* ==================== GYAKORLÁS ==================== */}
      <Szakasz
        id="gyakorlas"
        cimke="4. rész"
        cim="Gyakorlás"
        bevezeto="Az alapesetektől az összetett terhekig. Az ötödik típus már átvezet a tartók reakcióinak számításához."
        className="bg-white"
      >
        <GyakorloSzekcio />
        <Kiemelo tipus="kulcs" cim="Mikor mehetsz tovább">
          <p>
            Ha bármilyen megoszló terhet ránézésre két-három ismert darabra tudsz bontani, és a
            háromszögnél már nem kell gondolkodnod azon, melyik végtől mérjük az L/3-at, kész vagy. A
            következő modulban a súlypontszámítás jön — ugyanez a gondolat, csak nem teherábrákra,
            hanem keresztmetszetekre.
          </p>
        </Kiemelo>
      </Szakasz>
    </>
  );
}
