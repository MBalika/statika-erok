import { ModulFejlec, SzakaszSav } from "@/components/ModulKeret";
import { Szakasz, Kiemelo, AbraKeret, KetOszlop, TankonyvJel, Szotar } from "@/components/ui/Elemek";
import { M, MB, KepletDoboz } from "@/components/ui/Keplet";
import { KidolgozottFeladat, Lepes } from "@/components/KidolgozottFeladat";
import TrapezTeherFelfedezo from "@/components/abrak/TrapezTeherFelfedezo";
import SzakaszosTeherKalk from "@/components/abrak/SzakaszosTeherKalk";
import {
  AbraMegoszloFogalom,
  AbraAlapesetek,
  AbraFelbontas,
  AbraFerdeVetulet,
  AbraMegoszloFajtak,
  AbraFeluletVetites,
  AbraKetVetulet,
  AbraIvTeher,
  AbraViznyomas,
} from "@/components/abrak/MegoszloAbrak";
import { AbraTrapezTeher, AbraValtakozoTeher, AbraFureszfogTeher, AbraFelkorivTeher, AbraFerdeGat } from "@/components/abrak/MegoszloFeladatAbrak";
import GyakorloSzekcio from "@/components/megoszlo/GyakorloSzekcio";
import Kviz from "@/components/Kviz";
import Hibakereso from "@/components/Hibakereso";
import { KVIZ, HIBAK } from "@/components/megoszlo/KvizAdatok";
import FilmGyf1 from "@/components/megoszlo/FilmGyf1";
import FilmGyf2 from "@/components/megoszlo/FilmGyf2";
import FilmGyf3 from "@/components/megoszlo/FilmGyf3";
import FilmIv from "@/components/megoszlo/FilmIv";
import FilmGat from "@/components/megoszlo/FilmGat";
import OnsulySzamolo from "@/components/megoszlo/OnsulySzamolo";
import FerdeTeherFelfedezo from "@/components/megoszlo/FerdeTeherFelfedezo";
import GatFelfedezo from "@/components/megoszlo/GatFelfedezo";
import JatekEredo from "@/components/megoszlo/JatekEredo";
import { Film3DTeherLepel, TeherLepelFelfedezo3D } from "@/components/harom/Film3D";
import { modulSlugAlapjan } from "@/lib/oldalterkep";

export const metadata = {
  title: "Megoszló erők",
  description:
    "Térfogat, felület és vonal mentén megoszló erők: az eredő nagysága és helye, terhelési test, felbontás, ferde és ívmenti terhek, víznyomás — interaktív ábrákkal, kidolgozott feladatokkal és gyakorlással.",
};

const modul = modulSlugAlapjan("/megoszlo");

export default function MegoszloOldal() {
  return (
    <>
      <ModulFejlec
        szam={3}
        cim="Megoszló erők"
        leiras="A valódi terhek ritkán egy pontban hatnak: a hó a tetőn, a víz a gáton, egy fal a gerendán mind hosszú szakaszon vagy felületen oszlik el. Ebben a modulban megtanulod, hogyan válts át egy ilyen terhet egyetlen erőre — nagyságban és helyben is."
        tartalom={["Intenzitás, kN/m", "Az eredő = terület", "A hely = súlypont", "Felület menti teher", "Felbontás", "Előjeles szakaszok", "Ferde vonal mentén", "Ívmenti teher", "Víznyomás"]}
      />
      <SzakaszSav szakaszok={modul.szakaszok} />

      {/* ==================== ELMÉLET ==================== */}
      <Szakasz
        id="elmelet"
        cimke="1. rész"
        cim="Elmélet"
        bevezeto="Két szabály, és kész: az eredő nagysága a teherábra területe, a helye pedig a teherábra súlypontja. Minden más — a felületi teher, a ferde rúd, az ív, a víznyomás — ebből következik."
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

        <TankonyvJel fejezet="3.4">
          <p>
            A tankönyv a megoszló erő intenzitását <strong>kisbetűvel</strong> jelöli, és többféle betűt használ: <M>{"g,\\ p,\\ q,\\ w"}</M>{" "}
            (a példákban leggyakrabban <M>{"q"}</M>). Itt és a gyakorlaton egységesen <M>{"p"}</M>-t írunk. Az eredő helyét a könyv{" "}
            <M>{"x_R"}</M>-rel jelöli, mi <M>{"k"}</M>-val — figyelj, mert a 2. modulban <M>{"k"}</M> az <em>erő karja</em> volt, itt az
            eredő hatásvonalának <em>x koordinátája</em>. Az egyenleteket a könyv írásmódjában adjuk: előbb az egyenértékűségi
            kijelentés, <M>{"(q) \\ekv \\underline{R}"}</M>, majd a vetületi egyenlet lefelé pozitív iránnyal (<M>{"\\Fle"}</M>) és a
            nyomatéki egyenlet, amelyben az óramutató szerinti forgás a pozitív (<M>{"\\Mj{O}"}</M>) — így a lefelé ható{" "}
            <M>{"R\\,x_R"}</M> pozitív előjelű.
          </p>
          <Szotar
            sorok={[
              { itt: <M>{"p\\ [\\text{kN/m}]"}</M>, konyv: <M>{"q\\ (g,\\ p,\\ w)"}</M>, megjegyzes: "az intenzitás — kisbetű, többféle jelölés" },
              { itt: <M>{"k"}</M>, konyv: <M>{"x_R"}</M>, megjegyzes: "az eredő helye a bal végtől; a 2. modulban k az erő karja volt" },
              { itt: "teherábra", konyv: "terhelési síkidom", megjegyzes: "a p(x) függvény alatti síkidom; területe R, súlypontja az eredő helye" },
              { itt: "terhelési test", konyv: "terhelési test", megjegyzes: "felület menti tehernél a q fölé rajzolt (fiktív) test" },
              { itt: "egymásra halmozás", konyv: "szuperpozíció", megjegyzes: "a részek eredőit külön számoljuk, majd összevonjuk" },
              { itt: <M>{"\\Fle\\ \\ \\Mj{O}"}</M>, konyv: <M>{"\\Fle\\ \\ \\Mj{O}"}</M>, megjegyzes: "lefelé és az óramutató szerint pozitív" },
            ]}
          />
        </TankonyvJel>

        <h4 className="mt-8 text-[16px] font-semibold text-petrol-900">Megoszló erők fajtái: térfogat, felület, vonal mentén</h4>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Aszerint csoportosítjuk a megoszló erőket, hogy <strong>mi mentén</strong> oszlanak el. A{" "}
            <strong>térfogat mentén</strong> megoszló erő a gravitáció: a test minden <M>{"V"}</M> térfogatú darabjára{" "}
            <M>{"\\varrho V g"}</M> súly jut. A <M>{"\\gamma = \\varrho g"}</M> szorzat az egységnyi térfogat súlya, a{" "}
            <strong>fajsúly</strong> (kN/m³) — ez a gravitációs erő intenzitása, és az egész test súlya{" "}
            <M>{"G = mg = V\\varrho g = V\\gamma"}</M>, amely a test súlypontjában működik. A <strong>felület mentén</strong> megoszló
            erő tipikusan két test között adódik át (hó a tetőn, hasznos teher a födémen, víznyomás a gáton), intenzitása kN/m².
            A gyakorlati számításban mindkettőt <strong>vonal mentén</strong> megoszló erőre vezetjük vissza: a gerenda önsúlyát
            keresztmetszetenként „összegyűjtve” a vonal menti intenzitás <M>{"q = A\\gamma"}</M> (A a keresztmetszet területe),
            a felületi terhet pedig a tehermező szélességével szorozva.
          </p>
        </div>
        <AbraKeret szam={2} cim="Ugyanaz a gondolat három kiterjedésben: az intenzitás az egységnyi térfogatra, felületre, illetve hosszra jutó erő.">
          <AbraMegoszloFajtak />
        </AbraKeret>
        <KepletDoboz
          cimke="Térfogati erő → vonal menti teher"
          keplet={"\\gamma = \\varrho g\\ \\left[\\tfrac{\\text{kN}}{\\text{m}^3}\\right],\\qquad G = V\\gamma,\\qquad q = A\\gamma\\ \\left[\\tfrac{\\text{kN}}{\\text{m}}\\right]"}
          behelyettesitve={"\\text{pl. } 30\\times 50\\ \\text{cm vasbeton gerenda: } q = 0{,}3\\cdot 0{,}5\\cdot 25 = 3{,}75\\ \\text{kN/m}"}
        />
        <div className="mt-6">
          <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Próbáld ki – a gerenda önsúlya</p>
          <OnsulySzamolo />
        </div>

        <h3 className="mt-10 text-xl font-semibold text-petrol-900">3.2 Az eredő nagysága: a teherábra területe</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Ha a terhet apró darabokra vágjuk, minden darabra <M>{"p(x)\\,dx"}</M> erő jut, és ezek
            mind párhuzamosak. Az egyenértékűségi kijelentés <M>{"(p) \\ekv \\underline{R}"}</M>, és mivel minden erő
            függőleges, a párhuzamos erőknél tanultak szerint egyetlen vetületi egyenletet írunk. Az eredő az elemi erők
            összege — vagyis a <M>{"p(x)"}</M> függvény alatti terület. Ezért mondjuk, hogy{" "}
            <strong>az eredő nagysága a teherábra területe</strong>. A mértékegység is kijön: kN/m szorozva méterrel az kN.
          </p>
        </div>
        <KepletDoboz cimke="Az eredő nagysága (vetületi egyenlet)" keplet={"\\Fle \\int_0^L p(x)\\,dx = R\\qquad\\Rightarrow\\qquad R = \\text{a teherábra területe}"} />

        <h3 className="mt-10 text-xl font-semibold text-petrol-900">3.3 Az eredő helye: a teherábra súlypontja</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            A helyet ugyanúgy kapjuk, mint a 2. modulban a párhuzamos erőknél: az eredőnek ugyanakkora
            nyomatékot kell adnia, mint az elemi erőknek együtt. Ez éppen a teherábra súlypontjának a
            képlete — <strong>az eredő a teherábra súlypontján megy át</strong>. Téglalapnál ez a
            közép, háromszögnél a magas oldaltól a hossz harmada.
          </p>
        </div>
        <KepletDoboz cimke="Az eredő helye (nyomatéki egyenlet)" keplet={"\\Mj{O} \\int_0^L x\\,p(x)\\,dx = R\\,k \\quad\\Rightarrow\\quad k = \\frac{\\int x\\,p\\,dx}{\\int p\\,dx}"} />

        <AbraKeret szam={3} cim="A három alapeset. A háromszögnél a súlypont mindig a magas oldalhoz esik közelebb.">
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

        <h3 className="mt-10 text-xl font-semibold text-petrol-900">3.4 Felület mentén megoszló erő és a terhelési test</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Egy lemezre, födémre, tetőre ható teher intenzitása <M>{"q"}</M> [kN/m²]. Ha ezt az intenzitást minden
            pontban a felületre merőlegesen felmérjük, egy (fiktív) testet kapunk: ez a <strong>terhelési test</strong>. A
            teherábra két szabálya itt egy dimenzióval feljebb ismétlődik: <strong>az eredő a terhelési test térfogata</strong>{" "}
            (egyenletes q-nál <M>{"R = q\\,A"}</M>), és <strong>a terhelési test súlypontján megy át</strong>.
          </p>
          <p>
            Síkbeli feladatban a vizsgálat síkjára merőleges kiterjedést a síkra <strong>vetítjük</strong>: egy adott x-nél a b
            szélességű sávra jutó terhet összegyűjtjük, és az így kapott <M>{"p = q\\,b"}</M> [kN/m] már vonal menti teher.
            Téglalap alakú, egyenletesen terhelt felületből így egyenletes, háromszög alakú felületből (ahol a sáv szélessége
            x-szel arányosan nő) lineárisan változó vonal menti teher lesz.
          </p>
        </div>
        <AbraKeret szam={4} cim="A tankönyv 3.24–3.25. ábrája: felületi teher → terhelési test → síkba vetítve vonal menti teher. A tehermező szélessége adja a szorzót.">
          <AbraFeluletVetites />
        </AbraKeret>
        <KepletDoboz
          cimke="Felületi teherből vonal menti teher"
          keplet={"p = q\\,b\\ \\left[\\tfrac{\\text{kN}}{\\text{m}^2}\\cdot\\text{m} = \\tfrac{\\text{kN}}{\\text{m}}\\right],\\qquad R = p\\,L = q\\,(bL) = q\\cdot A_{mező}"}
        />
        <Kiemelo tipus="figyelem" cim="kN/m² szorozva hosszal még nem erő">
          <p>
            A leggyakoribb hiba: a q [kN/m²] felületi terhet közvetlenül a gerenda hosszával szorozzák. Ebből kN/m jön ki, nem
            kN — az még intenzitás. Előbb a tehermező szélességével kell szorozni (<M>{"p = q\\,b"}</M>), csak aztán a hosszal.
            Mindig nézd meg a mértékegységet.
          </p>
        </Kiemelo>
        <div className="mt-6">
          <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Próbáld ki 3D-ben – a terhelési test és a vonal menti teher</p>
          <TeherLepelFelfedezo3D />
        </div>

        <h3 className="mt-10 text-xl font-semibold text-petrol-900">3.5 Felbontás egyszerű részekre</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Egy trapéz alakú terhet nem kell integrálni: felbontjuk olyan darabokra, amelyeknek ismert
            a területe és a súlypontja, és a darabok eredőit párhuzamos erőrendszerként vonjuk össze — ez az{" "}
            <strong>egymásra halmozás</strong> (szuperpozíció). Két természetes felbontás kínálkozik, és{" "}
            <strong>mindkettő ugyanarra az eredményre vezet</strong> — a GYF‑1 feladatot lentebb mindkét úton végigszámoljuk.
            A trapéz súlypontjának helyét nem érdemes megjegyezni, a tankönyv sem teszi; a felbontás mindig működik.
          </p>
        </div>

        <AbraKeret szam={5} cim="Ugyanaz a trapéz kétféleképpen felbontva. A részek mások, az eredő ugyanaz.">
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

        <h3 className="mt-10 text-xl font-semibold text-petrol-900">3.6 Szakaszos és előjeles terhek</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Ha a teher szakaszonként más — vagy egy szakaszon éppen felfelé hat —, minden szakaszt
            külön eredőre váltunk, és az eredőket előjelesen adjuk össze. A lefelé mutató teher
            pozitív, a felfelé mutató negatív, és ez az előjel végigmegy a nyomatéki egyenleten is.
            Az eredmény lehet nulla is: akkor a teher erőpárra redukálódik, pontosan úgy, ahogy a 2.
            modulban láttuk — a <M>{"k = \\sum R_i x_i / R"}</M> képlet nevezője ilyenkor nulla, ami jelzi, hogy az eredő nem erő.
          </p>
        </div>
        <KepletDoboz cimke="Több szakasz összevonása" keplet={"\\Fle \\sum_i R_i = R,\\qquad \\Mj{O} \\sum_i R_i\\,x_i = R\\,k\\qquad(R_i \\text{ előjeles, } x_i \\text{ a rész súlypontja})"} />
        <Kiemelo tipus="tipp" cim="Előjelet váltó lineáris teher: ne a zérushelyet számold">
          <p>
            Ha egy lineárisan változó teher az egyik végén lefelé, a másikon felfelé mutat, elvileg kiszámolhatnád, hol vált
            előjelet (hasonló háromszögekből), és a két kis háromszöget külön kezelhetnéd. A tankönyv ezt kifejezetten{" "}
            <em>nem</em> ajánlja: a zérushely számításába kerekítési hiba kerül, ami a végeredményt is elrontja. Bontsd inkább{" "}
            <strong>két, a teljes hosszra kiterjedő háromszögre</strong>: az egyik a bal végi, a másik a jobb végi intenzitással —
            az egyik lefelé, a másik felfelé mutat, és előjelesen vonod össze őket. Így csak ismert területek és harmadolópontok
            szerepelnek a számításban.
          </p>
        </Kiemelo>

        <h3 className="mt-10 text-xl font-semibold text-petrol-900">3.7 Ferde vonal mentén megoszló erő</h3>
        <KetOszlop>
          <div className="proza text-[15px] leading-relaxed text-petrol-700">
            <p>
              Ferde rúdnál két dolgot kell tisztázni: <strong>mire vonatkozik</strong> az intenzitás,
              és <strong>merre mutat</strong> a teher. A rúd hossza mentén megadott teher (például a
              felületre merőleges szélnyomás, vagy a szarufa függőleges önsúlya) eredője az intenzitás és a ferde hossz szorzata. A
              vízszintes vetületre megadott teher (például a hó, amit alaprajzi négyzetméterre adnak
              meg) eredője az intenzitás és a vetület hosszának szorzata. Az eredő helye mindkét
              esetben a szakasz felezőpontja, ha a teher egyenletes. A kétféle megadás egymásba átváltható: az intenzitást a
              hosszak fordított arányában módosítjuk.
            </p>
          </div>
          <AbraKeret szam={6} cim="Ugyanaz a rúd, kétféle vonatkoztatás. A rajzon mindig nézd meg, mire vonatkozik a p.">
            <AbraFerdeVetulet />
          </AbraKeret>
        </KetOszlop>

        <h3 className="mt-10 text-xl font-semibold text-petrol-900">3.8 Felületre merőleges teher ferde rúdon: a két vetület</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Ha a teher a ferde rúdra <strong>merőleges</strong> (szélnyomás), az eredője is merőleges a rúdra, nagysága{" "}
            <M>{"pL"}</M>, a szakasz közepén. A további számításhoz gyakran a vízszintes és függőleges komponensére van szükség —
            és itt jön a tankönyv szép trükkje: a merőleges teher helyettesíthető egy{" "}
            <strong>vízszintes vetület mentén megoszló függőleges</strong> és egy{" "}
            <strong>függőleges vetület mentén megoszló vízszintes</strong> teherrel, <em>ugyanazzal a p intenzitással</em>. A
            vízszintes vetület <M>{"a = L\\cos\\alpha"}</M>, a függőleges <M>{"b = L\\sin\\alpha"}</M>, ezért{" "}
            <M>{"R_y = p\\,a = pL\\cos\\alpha"}</M> és <M>{"R_x = p\\,b = pL\\sin\\alpha"}</M> — pontosan az <M>{"R = pL"}</M>{" "}
            komponensei. A két részeredő eredője tehát az eredetivel egyezik, de vízszintes és függőleges erőkkel könnyebb tovább
            számolni.
          </p>
        </div>
        <AbraKeret szam={7} cim="A tankönyv 3.21. ábrája: a merőleges teher (a) és a két vetületi teher (b). Az intenzitás mindkét vetületen ugyanaz a p.">
          <AbraKetVetulet />
        </AbraKeret>
        <KepletDoboz
          cimke="A két vetület"
          keplet={"R = pL\\ (\\perp),\\qquad R_y = p\\,L\\cos\\alpha\\ \\text{a vízszintes vetületen},\\qquad R_x = p\\,L\\sin\\alpha\\ \\text{a függőleges vetületen}"}
        />
        <div className="mt-6">
          <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Próbáld ki – nézd végig a három nézetet</p>
          <FerdeTeherFelfedezo />
        </div>

        <h3 className="mt-10 text-xl font-semibold text-petrol-900">3.9 Ívmenti teher</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            A vetületi trükk görbe vonalon is működik, mert szakaszonként alkalmazható. Egy R sugarú <strong>félkörívre</strong>{" "}
            mindenütt merőlegesen ható p teher (boltívre ható nyomás) eredőjét így integrálás nélkül kapjuk: a bal és a jobb
            negyedkörre külön-külön a vízszintes vetületre (hossza R) függőleges, a függőleges vetületre (hossza szintén R)
            vízszintes p teher jut. A két vízszintes részeredő (<M>{"Rp"}</M> és <M>{"Rp"}</M>) közös hatásvonalon, ellentétesen
            hat — kiejtik egymást. A két függőleges részeredő összeadódik: <strong>az eredő 2Rp, függőleges, a kör középpontján
            át</strong>.
          </p>
        </div>
        <AbraKeret szam={8} cim="A tankönyv 3.22. ábrája: félkörív merőleges terhe (a) és a vetületi terhek (b). Az eredő 2Rp, a kör közepén át.">
          <AbraIvTeher />
        </AbraKeret>
        <KepletDoboz cimke="Félkörív, az ívre merőleges egyenletes teher" keplet={"\\Fx +Rp - Rp = R_x = 0,\\qquad \\Fle Rp + Rp = R = 2Rp\\quad(\\text{a kör középpontján át})"} />

        <h3 className="mt-10 text-xl font-semibold text-petrol-900">3.10 Víznyomás</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            A víznyomás is megoszló teher, két jellemzővel: <strong>mindig merőleges a felületre</strong>, és az intenzitása a
            mélységgel arányosan nő, <M>{"p_v = \\gamma_v z"}</M> (a víz fajsúlya kb. 10 kN/m³). Függőleges falon ebből a
            klasszikus háromszög lesz: a fal 1 m széles sávján <M>{"R = \\tfrac12\\gamma h^2"}</M>, a fenéktől <M>{"h/3"}</M>-ra.
          </p>
          <p>
            Görbe vagy ferde gáton látszólag bonyolult a helyzet — változó intenzitású, változó irányú teher görbe vonalon —, de a
            két hatás együttállása miatt a számítás meglepően egyszerű. <strong>A vízszintes komponens</strong> a függőleges
            vetületre ható háromszög eredője, <M>{"\\tfrac12\\gamma h^2"}</M>, a fenéktől h/3-ra: pontosan az, mintha a fal
            függőleges lenne. <strong>A függőleges komponens</strong> intenzitása a vízmélységgel arányos, ezért a gát vonala és
            a vízszint közötti síkidom maga a teherábra: a függőleges erő ennek a <em>területe szorozva γ-val</em> (a fal fölötti
            vízoszlop súlya), és a síkidom <em>súlypontján</em> megy át. Ha ismered a síkidom területét és súlypontját, kész a
            feladat.
          </p>
        </div>
        <AbraKeret szam={9} cim="A tankönyv 3.23. ábrája: a felületre merőleges, mélységgel növő nyomás (a), a vízszintes komponens háromszöge (b) és a függőleges komponens síkidoma (c).">
          <AbraViznyomas />
        </AbraKeret>
        <KepletDoboz
          cimke="Víznyomás görbe vagy ferde gáton (1 m széles sáv)"
          keplet={"R_x = \\tfrac12\\,\\gamma h^2\\ \\ (h/3\\text{-ra a fenéktől}),\\qquad R_y = \\gamma\\cdot A_{\\text{fal fölötti síkidom}}\\ \\ (\\text{a súlypontján át})"}
        />
        <div className="mt-6">
          <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Próbáld ki – döntsd meg a gátat</p>
          <GatFelfedezo />
        </div>

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
        bevezeto="A gyakorlat három feladata, majd két tankönyvi eset: az ívmenti teher és a ferde gát. Az elsőt szándékosan kétféle felbontással is végigszámoljuk, ahogy a gyakorlat megoldólapja is teszi."
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
          <Lepes cim="Egyenértékűségi kijelentés és felbontás (I. megoldás: téglalap + háromszög)">
            <p>
              A megoszló terhet egyetlen erővel helyettesítjük; a trapézt egy 1,8 kN/m intenzitású téglalapra és egy 0-tól 1,8
              kN/m-ig növekvő háromszögre bontjuk, és a két részeredő eredőjét keressük:
            </p>
            <MB>{"(q) \\ekv \\underline{R},\\qquad (\\underline{R}_1, \\underline{R}_2) \\ekv \\underline{R}"}</MB>
            <MB>{"R_1 = 1{,}8\\cdot 4{,}5 = 8{,}1\\ \\text{kN}\\quad(\\text{téglalap, a felezőpontban: } x_1 = 2{,}25\\ \\text{m})"}</MB>
            <MB>{"R_2 = \\frac{1{,}8\\cdot 4{,}5}{2} = 4{,}05\\ \\text{kN}\\quad(\\text{háromszög, a magas oldaltól } L/3\\text{-ra: } x_2 = 3{,}0\\ \\text{m})"}</MB>
          </Lepes>

          <Lepes cim="I. megoldás: vetületi és nyomatéki egyenlet">
            <p>Minden erő függőleges: egy vetületi egyenlet (lefelé pozitív) és egy nyomatéki egyenlet a bal végpontra (az óramutató szerint pozitív).</p>
            <MB>{"\\Fle 8{,}1 + 4{,}05 = R = 12{,}15\\ \\text{kN}"}</MB>
            <MB>{"\\Mj{O} 8{,}1\\cdot 2{,}25 + 4{,}05\\cdot 3{,}0 = R\\,k = 30{,}375\\ \\text{kNm}"}</MB>
            <MB>{"k = \\frac{30{,}375}{12{,}15} = 2{,}5\\ \\text{m}"}</MB>
          </Lepes>

          <Lepes cim="II. megoldás: két háromszög">
            <p>
              Ugyanez a trapéz két háromszög összege is: az egyiknek a bal végen 1,8 kN/m a magassága,
              a másiknak a jobb végen 3,6 kN/m. Mindkettő a teljes 4,5 m-re terjed ki.
            </p>
            <MB>{"(\\underline{R}_1, \\underline{R}_2) \\ekv \\underline{R}"}</MB>
            <MB>{"R_1 = 1{,}8\\cdot 4{,}5\\cdot\\tfrac12 = 4{,}05\\ \\text{kN}\\quad(\\text{magas oldal balra, } x_1 = 1{,}5\\ \\text{m})"}</MB>
            <MB>{"R_2 = 3{,}6\\cdot 4{,}5\\cdot\\tfrac12 = 8{,}1\\ \\text{kN}\\quad(\\text{magas oldal jobbra, } x_2 = 3{,}0\\ \\text{m})"}</MB>
          </Lepes>

          <Lepes cim="II. megoldás: ugyanaz az eredő">
            <MB>{"\\Fle 4{,}05 + 8{,}1 = R = 12{,}15\\ \\text{kN}"}</MB>
            <MB>{"\\Mj{O} 4{,}05\\cdot 1{,}5 + 8{,}1\\cdot 3{,}0 = R\\,k = 6{,}075 + 24{,}3 = 30{,}375\\ \\text{kNm}"}</MB>
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
          <Lepes cim="Egyenértékűségi kijelentés és a részeredők">
            <MB>{"(p_1, p_2, p_3) \\ekv (\\underline{R}_1, \\underline{R}_2, \\underline{R}_3) \\ekv \\underline{R}"}</MB>
            <MB>{"R_1 = R_2 = R_3 = 7\\cdot 1{,}2 = 8{,}4\\ \\text{kN}"}</MB>
            <p>Mindhárom a saját szakaszának a közepén működik: 0,6 m, 1,8 m és 3,0 m a bal végtől.</p>
          </Lepes>

          <Lepes cim="Vetületi egyenlet, előjelesen">
            <p>Lefelé pozitív: a középső rész felfelé mutat, ezért negatív előjellel kerül az összegbe.</p>
            <MB>{"\\Fle 8{,}4 - 8{,}4 + 8{,}4 = R = 8{,}4\\ \\text{kN}\\quad(\\downarrow)"}</MB>
          </Lepes>

          <Lepes cim="Nyomatéki egyenlet: az eredő helye">
            <p>A nyomatéki egyenletben az előjelek ugyanúgy szerepelnek:</p>
            <MB>{"\\Mj{O} 8{,}4\\cdot 0{,}6 - 8{,}4\\cdot 1{,}8 + 8{,}4\\cdot 3{,}0 = R\\,k = 15{,}12\\ \\text{kNm}"}</MB>
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
          <Lepes cim="Egyenértékűségi kijelentés és a két háromszög eredője">
            <MB>{"(p_1, p_2) \\ekv (\\underline{R}_1, \\underline{R}_2) \\ekv \\underline{R}"}</MB>
            <MB>{"R_1 = R_2 = 4\\cdot\\frac{6}{2} = 12\\ \\text{kN}"}</MB>
            <MB>{"\\Fle 12 + 12 = R = 24\\ \\text{kN}\\quad(\\downarrow)"}</MB>
          </Lepes>

          <Lepes cim="A részek helye">
            <p>Mindkét háromszögnek a bal oldala a magas, ezért a súlypont a saját bal végétől a hossz harmadára, 2 m-re van:</p>
            <MB>{"x_1 = \\frac{6}{3} = 2\\ \\text{m},\\qquad x_2 = 6 + \\frac{6}{3} = 8\\ \\text{m}"}</MB>
          </Lepes>

          <Lepes cim="Nyomatéki egyenlet: az eredő helye">
            <MB>{"\\Mj{O} 12\\cdot 2 + 12\\cdot 8 = R\\,k = 120\\ \\text{kNm}"}</MB>
            <MB>{"k = \\frac{120}{24} = 5\\ \\text{m}"}</MB>
          </Lepes>
        </KidolgozottFeladat>
        <div className="my-8">
          <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Ugyanez filmen – a fűrészfog eredője</p>
          <FilmGyf3 />
        </div>

        <KidolgozottFeladat
          jel="GYF‑A"
          ido="3 perc"
          forras="Tankönyv 3.22. ábra"
          cim="Félkörív mentén megoszló, az ívre merőleges teher"
          feladat={<p>Egy R = 3 m sugarú félkörív alakú boltívet az ívre mindenütt merőleges, p = 4 kN/m intenzitású egyenletes teher terhel. Határozd meg a teher eredőjét — nagyságát, irányát és hatásvonalát!</p>}
          abra={
            <AbraKeret cim="Az ívre merőleges nyomás — az elemi erők nem párhuzamosak.">
              <AbraFelkorivTeher />
            </AbraKeret>
          }
          tanulsag={
            <p>
              Az elemi erők nem párhuzamosak, ezért az ívhossz × p (π·3·4 = 37,7 kN) <em>nem</em> az eredő. A vetületi trükkel
              viszont integrálás nélkül, két sorban kijön: 2Rp = 24 kN, függőleges, a kör közepén át. Ez a tankönyv 3.4.3.
              alfejezetének a lényege.
            </p>
          }
        >
          <Lepes cim="Egyenértékűségi kijelentés és felbontás negyedkörökre">
            <p>
              A merőleges terhet egyetlen erővel helyettesítjük. Mivel az elemi erők iránya pontról pontra változik, nem
              adhatók össze egyszerűen — ezért a bal és a jobb negyedkörre külön-külön alkalmazzuk a ferde rúd vetületi
              trükkjét.
            </p>
            <MB>{"(p) \\ekv \\underline{R},\\qquad (p_{bal}, p_{jobb}) \\ekv (\\underline{R}_{x1}, \\underline{R}_{y1}, \\underline{R}_{x2}, \\underline{R}_{y2}) \\ekv \\underline{R}"}</MB>
          </Lepes>

          <Lepes cim="Vetületi terhek, azonos p intenzitással">
            <p>
              Mindkét negyedkör vízszintes vetülete R = 3 m, és a függőleges vetülete is R = 3 m. Ezekre p = 4 kN/m intenzitású
              függőleges, illetve vízszintes teher jut, mindegyik részeredője a vetület közepén:
            </p>
            <MB>{"R_{y1} = R_{y2} = R\\,p = 3\\cdot 4 = 12\\ \\text{kN}\\quad(\\downarrow,\\ x = \\mp 1{,}5\\ \\text{m O-tól})"}</MB>
            <MB>{"R_{x1} = R\\,p = 12\\ \\text{kN}\\ (\\rightarrow),\\qquad R_{x2} = R\\,p = 12\\ \\text{kN}\\ (\\leftarrow)\\quad(\\text{mindkettő } R/2 = 1{,}5\\ \\text{m magasan})"}</MB>
          </Lepes>

          <Lepes cim="Vetületi egyenletek">
            <p>A két vízszintes részeredő közös hatásvonalon, ellentétes irányban hat, ezért kiejtik egymást; a két függőleges összeadódik.</p>
            <MB>{"\\Fx +12 - 12 = R_x = 0"}</MB>
            <MB>{"\\Fle 12 + 12 = R = 2Rp = 24\\ \\text{kN}\\quad(\\downarrow)"}</MB>
          </Lepes>

          <Lepes cim="Az eredő helye: szimmetria (és a nyomatéki egyenlet)">
            <MB>{"\\Mj{O} 12\\cdot 1{,}5 - 12\\cdot 1{,}5 = R\\,x_R = 0\\quad\\Rightarrow\\quad x_R = 0"}</MB>
            <p>
              Az eredő tehát <strong>24 kN, függőleges, a kör O középpontján átmenő hatásvonalon</strong>. A két vízszintes
              részeredő nyomatéka O-ra szintén kiejti egymást (azonos magasság, ellentétes irány), így nyomaték sem marad.
            </p>
          </Lepes>
        </KidolgozottFeladat>
        <div className="my-8">
          <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Ugyanez filmen – a merőleges nyilak a vetületekhez csúsznak</p>
          <FilmIv />
        </div>

        <KidolgozottFeladat
          jel="GYF‑B"
          ido="4 perc"
          forras="Tankönyv 3.23. ábra nyomán"
          cim="Víznyomás ferde gátfalon"
          feladat={
            <p>
              Egy gát fala a függőlegessel 30°-ot zár be; a víz a ferde fal fölött 6 m mély, fajsúlya γ = 10 kN/m³. Határozd meg
              a víznyomás eredőjének vízszintes és függőleges komponensét (a fal 1 m széles sávján), a hatásvonalukat, és az
              eredőt!
            </p>
          }
          abra={
            <AbraKeret cim="A nyomás a falra merőleges, és a mélységgel nő.">
              <AbraFerdeGat />
            </AbraKeret>
          }
          tanulsag={
            <p>
              Két egyszerű teherábra — egy háromszög a függőleges vetületen és a fal fölötti vízoszlop — adja a két komponenst.
              Az ellenőrzés fizikai: az eredőnek merőlegesnek kell lennie a falra, és 180 / cos 30° = 207,8 kN/m pontosan
              egyezik a két komponensből számolt értékkel.
            </p>
          }
        >
          <Lepes cim="Egyenértékűségi kijelentés">
            <p>
              A nyomás intenzitása a mélységgel nő, <M>{"p_v = \\gamma z"}</M>, a fenéknél <M>{"10\\cdot 6 = 60\\ \\text{kN/m}^2"}</M>, és
              mindenütt merőleges a falra. A vízszintes és a függőleges komponenst külön-külön, egy-egy egyszerű teherábrából
              számoljuk:
            </p>
            <MB>{"(p_v) \\ekv (\\underline{R}_x, \\underline{R}_y) \\ekv \\underline{R}"}</MB>
          </Lepes>

          <Lepes cim="Vízszintes komponens: háromszög a függőleges vetületen">
            <p>Ugyanaz, mintha a fal függőleges volna: a háromszög területe, a magas oldaltól h/3-ra.</p>
            <MB>{"\\Fx R_x = \\tfrac12\\,\\gamma h^2 = \\tfrac12\\cdot 10\\cdot 6^2 = 180\\ \\text{kN/m}"}</MB>
            <MB>{"y_x = \\frac{h}{3} = 2\\ \\text{m a fenéktől}"}</MB>
          </Lepes>

          <Lepes cim="Függőleges komponens: a fal fölötti vízoszlop">
            <p>
              A fal vonala és a vízszint közötti síkidom itt egy derékszögű háromszög: magassága h = 6 m, alapja{" "}
              <M>{"h\\,\\mathrm{tg}\\,30^\\circ = 3{,}464\\ \\text{m}"}</M>. A függőleges erő ennek a területe szorozva γ-val, és a
              háromszög súlypontján — a talpponttól az alap harmadánál — megy át.
            </p>
            <MB>{"A = \\tfrac12\\cdot 3{,}464\\cdot 6 = 10{,}39\\ \\text{m}^2"}</MB>
            <MB>{"\\Fle R_y = \\gamma A = 10\\cdot 10{,}39 = 103{,}9\\ \\text{kN/m}\\quad(\\downarrow)"}</MB>
            <MB>{"x_S = \\frac{3{,}464}{3} = 1{,}155\\ \\text{m a talppont függőlegesétől}"}</MB>
          </Lepes>

          <Lepes cim="Az eredő">
            <p>
              A két komponens hatásvonala a falon metszi egymást: 2 m magasan a fal éppen <M>{"2\\,\\mathrm{tg}\\,30^\\circ = 1{,}155\\ \\text{m}"}</M>-re
              van a talppont függőlegesétől — ugyanott, ahol <M>{"R_y"}</M> hat. Ez a fal alsó harmadolópontja.
            </p>
            <MB>{"R = \\sqrt{R_x^2 + R_y^2} = \\sqrt{180^2 + 103{,}9^2} = 207{,}8\\ \\text{kN/m}"}</MB>
          </Lepes>

          <Lepes cim="Ellenőrzés: az eredő merőleges a falra">
            <p>
              A nyomás minden pontban merőleges a falra, ezért az eredőnek is annak kell lennie: iránya a vízszintessel{" "}
              <M>{"\\mathrm{tg}\\,\\varphi = 103{,}9/180 = 0{,}577\\ \\Rightarrow\\ \\varphi = 30^\\circ"}</M> — valóban a fal normálisa. A
              nagyság közvetlenül is: a falra merőleges nyomás eredője a ferde falhossz mentén vett háromszög,{" "}
              <M>{"\\tfrac12\\cdot 60\\cdot 6{,}928 = 207{,}8"}</M> kN/m, azaz <M>{"R = R_x/\\cos 30^\\circ = 180/0{,}866 = 207{,}8\\ \\checkmark"}</M>.
            </p>
          </Lepes>
        </KidolgozottFeladat>
        <div className="my-8">
          <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Ugyanez filmen – két komponens, egy eredő</p>
          <FilmGat />
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
        bevezeto="Előbb szemmérték, aztán fogalmak, aztán számolás: az alapesetektől a felületi teherig és a ferde gátig."
        className="bg-white"
      >
        <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Előbb játssz – hol az eredő?</p>
        <JatekEredo />
        <p className="mt-8 mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Aztán az ötlet – fogalmi kvíz</p>
        <Kviz cim="Érted, vagy csak számolod?" leiras="Tizenkét kérdés a modul tipikus félreértéseiről. Minden válasz után rövid magyarázat." kerdesek={KVIZ} />
        <p className="mt-8 mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Hibakereső – találd meg a hibát</p>
        <Hibakereso feladatok={HIBAK} />
        <p className="mt-8 mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Számolós gyakorlás</p>
        <GyakorloSzekcio />
        <Kiemelo tipus="kulcs" cim="Mikor mehetsz tovább">
          <p>
            Ha bármilyen megoszló terhet ránézésre két-három ismert darabra tudsz bontani, a
            háromszögnél már nem kell gondolkodnod azon, melyik végtől mérjük az L/3-at, és egy kN/m²-es födémteherből
            gondolkodás nélkül kN/m-es gerendateher lesz a kezedben, kész vagy. A
            következő modulban a súlypontszámítás jön — ugyanez a gondolat, csak nem teherábrákra,
            hanem keresztmetszetekre.
          </p>
        </Kiemelo>
      </Szakasz>
    </>
  );
}
