import { ModulFejlec, SzakaszSav } from "@/components/ModulKeret";
import { Szakasz, Kiemelo, AbraKeret, KetOszlop } from "@/components/ui/Elemek";
import { M, MB, KepletDoboz } from "@/components/ui/Keplet";
import { KidolgozottFeladat, Lepes } from "@/components/KidolgozottFeladat";
import SzelvenyFelfedezo from "@/components/abrak/SzelvenyFelfedezo";
import SulypontKalk from "@/components/abrak/SulypontKalk";
import { AbraSulypontFogalom, AbraAlapidomok, AbraFelbontasT, AbraKivonas } from "@/components/abrak/SulypontAbrak";
import { AbraTSzelveny, AbraLyukasIdom, AbraNegyedkorIdom } from "@/components/abrak/SulypontFeladatAbrak";
import GyakorloSzekcio from "@/components/sulypont/GyakorloSzekcio";
import Kviz from "@/components/Kviz";
import Hibakereso from "@/components/Hibakereso";
import { KVIZ, HIBAK } from "@/components/sulypont/KvizAdatok";
import FilmGyf4 from "@/components/sulypont/FilmGyf4";
import FilmGyf5 from "@/components/sulypont/FilmGyf5";
import FilmGyf6 from "@/components/sulypont/FilmGyf6";
import { Film3DKeresztmetszet } from "@/components/harom/Film3D";
import { modulSlugAlapjan } from "@/lib/oldalterkep";

export const metadata = {
  title: "Súlypont",
  description:
    "Statikai nyomaték, összetett síkidomok súlypontja részekre bontással és kivonással, köríves idomok — interaktív szelvény-felfedezővel, kidolgozott feladatokkal és gyakorlással.",
};

const modul = modulSlugAlapjan("/sulypont");

export default function SulypontOldal() {
  return (
    <>
      <ModulFejlec
        szam={4}
        cim="Súlypont"
        leiras="Minden keresztmetszet-számítás innen indul: hol van a súlypont? A gondolat ugyanaz, mint a megoszló erőknél — párhuzamos erők eredőjének helye —, csak most nem egy teherábra, hanem egy síkidom területe a „teher”."
        tartalom={["Statikai nyomaték", "Sy, Sz és a súlypont", "Alapidomok", "Részekre bontás", "Kivonásos módszer", "4r/3π"]}
      />
      <SzakaszSav szakaszok={modul.szakaszok} />

      {/* ==================== ELMÉLET ==================== */}
      <Szakasz
        id="elmelet"
        cimke="1. rész"
        cim="Elmélet"
        bevezeto="A súlypont a terület „súlyozott átlaga”: minden darab annyit nyom a latba, amekkora a területe. A számolás mindig ugyanaz a három lépés: felbontás, táblázat, osztás."
      >
        <h3 className="mt-2 text-xl font-semibold text-petrol-900">4.1 Mi a súlypont?</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Képzeld el, hogy egy vékony, egyenletes vastagságú lemezt a súlyereje terhel. Minden apró{" "}
            <M>{"dA"}</M> darabkára ugyanolyan irányú, a területével arányos <M>{"dG = \\gamma\\,dA"}</M>{" "}
            erő jut: ez egy <strong>párhuzamos erőrendszer</strong>, aminek az eredőjét a 2. modulban már
            meghatároztuk. Az eredő hatásvonala egy ponton megy át — és ha a lemezt elforgatjuk, az új
            hatásvonal is ugyanezen a ponton megy át. Ez a pont a <strong>súlypont</strong>, jele{" "}
            <M>{"S"}</M>. Mivel a helyét csak a geometria szabja meg, homogén lemeznél a{" "}
            <em>terület</em> súlypontjáról beszélünk.
          </p>
        </div>

        <AbraKeret szam={1} cim="A súlyerők eredője bármilyen helyzetben ugyanazon a ponton megy át — ez a súlypont.">
          <AbraSulypontFogalom />
        </AbraKeret>

        <h3 className="mt-10 text-xl font-semibold text-petrol-900">4.2 Statikai nyomaték és a súlypont képlete</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Keresztmetszeteknél az <M>{"y"}</M>–<M>{"z"}</M> síkban dolgozunk: az <M>{"x"}</M> tengely a
            rúd hossza mentén, kifelé mutat a rajzból, az <M>{"y"}</M> tengely <strong>balra</strong>, a{" "}
            <M>{"z"}</M> tengely <strong>lefelé</strong>. Az eredő helyét ugyanúgy nyomatéki egyenletből
            kapjuk, mint a megoszló erőknél. Az egyenlet bal oldalán álló összeget külön névvel illetjük:
            ez az idom <strong>statikai nyomatéka</strong> az adott tengelyre.
          </p>
        </div>
        <KepletDoboz
          cimke="Statikai nyomaték a két tengelyre"
          keplet={"S_y = \\int_A z\\,dA,\\qquad S_z = \\int_A y\\,dA\\qquad[\\text{mm}^3,\\ \\text{cm}^3]"}
        />
        <KepletDoboz
          cimke="A súlypont koordinátái"
          keplet={"z_S = \\frac{S_y}{A},\\qquad y_S = \\frac{S_z}{A}"}
        />
        <Kiemelo tipus="figyelem" cim="Sy-hoz a z távolság tartozik">
          <p>
            A statikai nyomaték indexe azt a tengelyt mondja, <em>amelyre</em> a nyomatékot számoljuk — a
            távolságot pedig <em>attól</em> a tengelytől mérjük. Az <M>{"y"}</M> tengelytől mért távolság a{" "}
            <M>{"z"}</M> koordináta, ezért <M>{"S_y = \\sum A_i z_i"}</M> és <M>{"z_S = S_y / A"}</M>. Ez
            az index-csere az egyik leggyakoribb hiba a zárthelyiken.
          </p>
        </Kiemelo>

        <h3 className="mt-10 text-xl font-semibold text-petrol-900">4.3 Alapidomok súlypontja</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Integrálni a gyakorlatban sosem kell: néhány alapidom súlypontját fejből tudjuk, minden
            mást ezekből rakunk össze. A téglalap súlypontja a közepe. A háromszögé minden oldaltól a
            magasság harmadára van — derékszögű háromszögnél ez azt jelenti, hogy a derékszögű csúcstól
            mindkét befogó mentén a harmadára. A félkör és a negyedkör súlypontja az egyenes éltől{" "}
            <M>{"4r/3\\pi \\approx 0{,}424\\,r"}</M> távolságra esik.
          </p>
        </div>

        <AbraKeret szam={2} cim="A négy alapidom, amiből minden más felépíthető. A 4r/3π-t érdemes megjegyezni.">
          <AbraAlapidomok />
        </AbraKeret>

        <h3 className="mt-10 text-xl font-semibold text-petrol-900">4.4 Összetett idom: részekre bontás</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Egy összetett idom statikai nyomatéka a részek statikai nyomatékainak összege — ahogy
            párhuzamos erők nyomatéka is összeadódik. Ezért a recept: bontsd fel az idomot
            alapidomokra, írd fel minden rész területét és a saját súlypontjának a{" "}
            <strong>közös origótól mért</strong> koordinátáit, szorozd össze, add össze, oszd el az
            összterülettel. A felbontás nem egyértelmű, és nem is kell annak lennie: bármelyik
            felbontás ugyanazt az eredményt adja.
          </p>
        </div>
        <KepletDoboz
          cimke="A súlypont mint súlyozott átlag"
          keplet={"y_S = \\frac{\\sum A_i\\,y_i}{\\sum A_i},\\qquad z_S = \\frac{\\sum A_i\\,z_i}{\\sum A_i}"}
        />

        <AbraKeret szam={3} cim="A GYF‑4 T-szelvénye kétféleképpen felbontva. A táblázat más, a súlypont ugyanaz: z = 71,25 mm.">
          <AbraFelbontasT />
        </AbraKeret>

        <Kiemelo tipus="figyelem" cim="A részek súlypontját a közös origótól mérd">
          <p>
            A gerinc súlypontja a gerinc közepén van — de a táblázatba nem a „gerinc felétől”, hanem az{" "}
            <em>origótól</em> mért koordináta kerül: az öv vastagsága <em>plusz</em> a gerinc fele. Ha
            csak a fél magasságot írod be, a súlypont felcsúszik. Rajzold be minden rész súlypontját, és
            írd mellé a koordinátáit, mielőtt szorozni kezdesz.
          </p>
        </Kiemelo>

        <div className="mt-6">
          <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Próbáld ki – állítsd a szelvény méreteit</p>
          <SzelvenyFelfedezo />
        </div>

        <h3 className="mt-10 text-xl font-semibold text-petrol-900">4.5 Kivonásos módszer: lyukak és kivágások</h3>
        <KetOszlop>
          <div className="proza text-[15px] leading-relaxed text-petrol-700">
            <p>
              Ha az idomban lyuk van, vagy egy sarkából hiányzik egy darab, gyakran egyszerűbb a{" "}
              <strong>teljes idomból kivonni</strong> a hiányzó részt, mint a maradékot sok darabra
              szabdalni. A kivont rész területe <em>negatív</em> előjellel kerül a táblázatba, és a
              statikai nyomatéka is negatív lesz. A képlet nem változik — csak az előjelekre kell
              ügyelni, és arra, hogy a kivont rész súlypontját is a közös origótól mérd.
            </p>
            <p>
              A GYF‑6 feladat még ennél is többet mutat: ott egy negyedkört kivonunk, egy másikat
              hozzáadunk — a kettő területe kiesik, a statikai nyomatékuk viszont nem.
            </p>
          </div>
          <AbraKeret szam={4} cim="Teljes idom mínusz a lyuk. A negatív rész „elfelé tolja” a súlypontot.">
            <AbraKivonas />
          </AbraKeret>
        </KetOszlop>

        <h3 className="mt-10 text-xl font-semibold text-petrol-900">4.6 Szimmetria és józan ész</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Ha az idomnak van szimmetriatengelye, a súlypont rajta van — az egyik koordinátát tehát
            nem kell számolni. A T-, I- és U-szelvénynél ez azonnal megadja <M>{"y_S"}</M>-t. Két
            szimmetriatengelynél (téglalap, kör, I-szelvény) a súlypont a metszéspontjuk, számolás
            nélkül.
          </p>
          <p>
            Az eredményt mindig nézd meg: a súlypont az idom befoglaló téglalapján belül van, és a
            nagyobb részek felé húz. Nem kell viszont az anyagon belül lennie: egy L-szelvény, egy
            U-szelvény vagy egy körgyűrű súlypontja a levegőben van — attól még ez a súlypont.
          </p>
        </div>

        <Kiemelo tipus="kulcs" cim="A három lépés">
          <p>
            <strong>1. Felbontás</strong> alapidomokra (hozzáadva vagy kivonva). <strong>2. Táblázat:</strong>{" "}
            <M>{"A_i"}</M>, <M>{"y_i"}</M>, <M>{"z_i"}</M>, <M>{"A_i y_i"}</M>, <M>{"A_i z_i"}</M>, és az
            oszlopok összege. <strong>3. Osztás:</strong> <M>{"y_S = \\sum A_i y_i / \\sum A_i"}</M>,{" "}
            <M>{"z_S = \\sum A_i z_i / \\sum A_i"}</M>. Aki táblázatban dolgozik, ritkán hibázik.
          </p>
        </Kiemelo>

        <h3 className="mt-10 text-xl font-semibold text-petrol-900">4.7 Miért fontos?</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            A 3. modulban a megoszló teher eredője a teherábra súlypontján ment át — ugyanez a képlet,
            csak ott „terület” helyett „kN” volt a mértékegység. A súlypont ennél is többször tér vissza:
            a keresztmetszet hajlításnál a súlyponton átmenő tengely körül „forog”, a másodrendű nyomatékot
            (a tehetetlenségi nyomatékot) a súlyponti tengelyekre számoljuk, és a súlyponti tengelyre a
            statikai nyomaték éppen nulla. Ezt a tulajdonságot a szilárdságtan egész félévében használni
            fogod.
          </p>
        </div>
        <div className="mt-6">
          <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">3D-ben – a keresztmetszet és a súlyponti tengely</p>
          <Film3DKeresztmetszet />
        </div>
      </Szakasz>

      {/* ==================== KIDOLGOZOTT FELADATOK ==================== */}
      <Szakasz
        id="peldak"
        cimke="2. rész"
        cim="Kidolgozott feladatok"
        bevezeto="A gyakorlat három súlypont-feladata. Az elsőt kétféle felbontással is megoldjuk, a másodikban kivonunk, a harmadikban negyedkörökkel dolgozunk."
        className="bg-white"
      >
        <KidolgozottFeladat
          jel="GYF‑4"
          ido="3 perc"
          forras="A1. gyakorlat"
          cim="T-szelvény súlypontja — kétféleképpen"
          feladat={<p>Határozd meg az ábrán látható T-szelvény súlypontját! A fejlemez 300×30 mm, a gerinc 20 mm vastag, a teljes magasság 300 mm. Az origó a felső él közepén van, y balra, z lefelé.</p>}
          abra={
            <AbraKeret cim="T-szelvény, méretek mm-ben.">
              <AbraTSzelveny mutatS />
            </AbraKeret>
          }
          tanulsag={
            <p>
              Kétféle felbontás, ugyanaz a 71,25 mm. A szimmetria miatt <M>{"y_S = 0"}</M>, ezt nem kell
              számolni. A gerinc súlypontja nem a gerinc fele (135), hanem az origótól mért 30 + 135 = 165 mm
              — ez a lépés, amit a legtöbben elrontanak.
            </p>
          }
        >
          <Lepes cim="I. megoldás: két téglalap">
            <p>Fejlemez <M>{"A_1"}</M> és gerinc <M>{"A_2"}</M>. Az idom szimmetrikus a z tengelyre, ezért <M>{"y_S = 0"}</M>.</p>
            <MB>{"A = A_1 + A_2 = 300\\cdot 30 + 270\\cdot 20 = 9\\,000 + 5\\,400 = 14\\,400\\ \\text{mm}^2"}</MB>
          </Lepes>
          <Lepes cim="I. megoldás: statikai nyomaték az y tengelyre">
            <p>A fejlemez súlypontja a felső éltől 15 mm-re, a gerincé 30 + 270/2 = 165 mm-re van:</p>
            <MB>{"S_y = A_1\\cdot 15 + A_2\\cdot\\left(30 + \\tfrac{270}{2}\\right) = 9\\,000\\cdot 15 + 5\\,400\\cdot 165 = 1\\,026\\,000\\ \\text{mm}^3"}</MB>
            <MB>{"z_S = \\frac{S_y}{A} = \\frac{1\\,026\\,000}{14\\,400} = 71{,}25\\ \\text{mm}"}</MB>
          </Lepes>
          <Lepes cim="II. megoldás: három téglalap">
            <p>
              A fejlemezt a gerinc két oldalán levő 140×30-as darabokra bontjuk (<M>{"A_1, A_3"}</M>), a
              gerincet pedig végigvezetjük a teljes 300 mm-es magasságon (<M>{"A_2 = 20\\times 300"}</M>).
            </p>
            <MB>{"A = 30\\cdot 140 + 20\\cdot 300 + 30\\cdot 140 = 4\\,200 + 6\\,000 + 4\\,200 = 14\\,400\\ \\text{mm}^2"}</MB>
          </Lepes>
          <Lepes cim="II. megoldás: ugyanaz az eredmény">
            <MB>{"S_y = A_1\\cdot 15 + A_2\\cdot 150 + A_3\\cdot 15 = 63\\,000 + 900\\,000 + 63\\,000 = 1\\,026\\,000\\ \\text{mm}^3"}</MB>
            <MB>{"z_S = \\frac{1\\,026\\,000}{14\\,400} = 71{,}25\\ \\text{mm}"}</MB>
            <p>A súlypont a fejlemez alatt 41 mm-rel, a gerincben van — az idom felső, „nehezebb” részéhez közel, ahogy várható.</p>
          </Lepes>
        </KidolgozottFeladat>

        <div className="my-8">
          <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Ugyanez filmen – a súlypont mint mérleg</p>
          <FilmGyf4 />
        </div>

        <KidolgozottFeladat
          jel="GYF‑5"
          ido="3 perc"
          forras="A1. gyakorlat"
          cim="Kivágott idom — kivonásos módszerrel"
          feladat={<p>Határozd meg az ábrán látható síkidom súlypontját! A befoglaló téglalap 300×200 mm; felülről két 150 mm mély kivágás van benne: egy 180 mm széles a jobb oldalon és egy 40 mm széles a bal fal mellett. Az origó a jobb felső sarok, y balra, z lefelé.</p>}
          abra={
            <AbraKeret cim="Méretek mm-ben. A jobb oldali kivágás a szélig ér.">
              <AbraLyukasIdom mutatS />
            </AbraKeret>
          }
          tanulsag={
            <p>
              Három részből (teljes téglalap mínusz két kivágás) egy lépésben kész — a maradékot
              hozzáadós módszerrel négy darabra kellett volna vágni. A súlypont z = 130,6 mm-nél,
              vagyis jóval a felezőmagasság (100) alatt van, mert az anyag zöme az alsó lemezben van.
            </p>
          }
        >
          <Lepes cim="Felbontás: teljes téglalap mínusz két kivágás">
            <p>
              <M>{"A_1 = 300\\times 200"}</M> a teljes téglalap, <M>{"A_2 = 40\\times 150"}</M> a bal oldali,{" "}
              <M>{"A_3 = 180\\times 150"}</M> a jobb oldali kivágás.
            </p>
            <MB>{"A = A_1 - A_2 - A_3 = 60\\,000 - 6\\,000 - 27\\,000 = 27\\,000\\ \\text{mm}^2"}</MB>
          </Lepes>
          <Lepes cim="A részek súlypontjai a közös origótól">
            <p>
              A teljes téglalapé a közepén: <M>{"(150;\\ 100)"}</M>. A bal kivágás 220 és 260 mm között
              van, a súlypontja <M>{"(240;\\ 75)"}</M>. A jobb kivágás 0 és 180 mm között: <M>{"(90;\\ 75)"}</M>.
            </p>
          </Lepes>
          <Lepes cim="Statikai nyomaték az y tengelyre, z_S">
            <MB>{"S_y = 60\\,000\\cdot 100 - 6\\,000\\cdot 75 - 27\\,000\\cdot 75 = 3\\,525\\,000\\ \\text{mm}^3"}</MB>
            <MB>{"z_S = \\frac{3\\,525\\,000}{27\\,000} = 130{,}6\\ \\text{mm}"}</MB>
          </Lepes>
          <Lepes cim="Statikai nyomaték a z tengelyre, y_S">
            <MB>{"S_z = 60\\,000\\cdot 150 - 6\\,000\\cdot 240 - 27\\,000\\cdot 90 = 5\\,130\\,000\\ \\text{mm}^3"}</MB>
            <MB>{"y_S = \\frac{5\\,130\\,000}{27\\,000} = 190\\ \\text{mm}"}</MB>
            <p>
              A súlypont tehát a jobb felső saroktól 190 mm-re balra és 130,6 mm-re lefelé van — a vastag bal
              oldali fal felé eltolva, az alsó lemezben.
            </p>
          </Lepes>
        </KidolgozottFeladat>

        <div className="my-8">
          <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Ugyanez filmen – a súlypont elvándorol a lyuktól</p>
          <FilmGyf5 />
        </div>

        <KidolgozottFeladat
          jel="GYF‑6"
          ido="6 perc"
          forras="A1. gyakorlat"
          cim="Negyedkörös idom"
          feladat={<p>Határozd meg az ábrán látható síkidom súlypontját! Az idom egy 50 cm oldalú négyzetből egy 50 cm sugarú negyedkör kivágásával, majd a z tengely másik oldalán egy ugyanekkora negyedkör hozzáadásával áll elő. Az origó a felső él és a z tengely metszéspontja, y balra, z lefelé.</p>}
          abra={
            <AbraKeret cim="Méretek cm-ben. A₁ a négyzet, A₂ a kivont, A₃ a hozzáadott negyedkör.">
              <AbraNegyedkorIdom mutatS reszek />
            </AbraKeret>
          }
          tanulsag={
            <p>
              A két negyedkör területe kiejti egymást, a statikai nyomatékuk viszont nem: a z tengelyre a
              kivont darab a bal, a hozzáadott a jobb oldalon van. Ezért lesz <M>{"y_S"}</M> negatív —
              a súlypont a z tengelytől jobbra esik, mert oda „költözött át” a negyedkör. A negatív
              koordináta nem hiba, csak azt mondja, hogy a súlypont az origó másik oldalán van.
            </p>
          }
        >
          <Lepes cim="Felbontás és terület">
            <p>
              <M>{"A_1"}</M> a négyzet (+), <M>{"A_2"}</M> a bal oldali negyedkör (−), <M>{"A_3"}</M> a jobb
              oldali negyedkör (+). A két negyedkör egyforma: <M>{"\\tfrac{50^2\\pi}{4} = 1\\,963{,}5\\ \\text{cm}^2"}</M>.
            </p>
            <MB>{"A = A_1 - A_2 + A_3 = 50\\cdot 50 - \\frac{50^2\\pi}{4} + \\frac{50^2\\pi}{4} = 2\\,500\\ \\text{cm}^2"}</MB>
          </Lepes>
          <Lepes cim="A negyedkörök súlypontja">
            <p>
              A negyedkör súlypontja a középpontjától mindkét egyenes él mentén{" "}
              <M>{"\\tfrac{4r}{3\\pi} = \\tfrac{4\\cdot 50}{3\\pi} = 21{,}22\\ \\text{cm}"}</M>-re van. <M>{"A_2"}</M>{" "}
              középpontja a négyzet bal alsó sarka <M>{"(50;\\ 50)"}</M>, a súlypontja tehát{" "}
              <M>{"(50 - 21{,}22;\\ 50 - 21{,}22)"}</M>. <M>{"A_3"}</M> középpontja <M>{"(0;\\ 50)"}</M>, a
              súlypontja <M>{"(-21{,}22;\\ 50 - 21{,}22)"}</M>.
            </p>
          </Lepes>
          <Lepes cim="z_S: a két negyedkör kiesik">
            <MB>{"S_y = A_1\\cdot 25 - A_2\\left(50 - \\tfrac{4\\cdot 50}{3\\pi}\\right) + A_3\\left(50 - \\tfrac{4\\cdot 50}{3\\pi}\\right) = 2\\,500\\cdot 25 = 62\\,500\\ \\text{cm}^3"}</MB>
            <MB>{"z_S = \\frac{62\\,500}{2\\,500} = 25\\ \\text{cm}"}</MB>
            <p>A kivont és a hozzáadott negyedkör ugyanolyan mélyen van, így az y tengelyre számolt nyomatékuk kiejti egymást.</p>
          </Lepes>
          <Lepes cim="y_S: itt nem esik ki">
            <MB>{"S_z = A_1\\cdot 25 - A_2\\left(50 - \\tfrac{4\\cdot 50}{3\\pi}\\right) + A_3\\left(-\\tfrac{4\\cdot 50}{3\\pi}\\right)"}</MB>
            <MB>{"S_z = 62\\,500 - 1\\,963{,}5\\cdot 28{,}78 - 1\\,963{,}5\\cdot 21{,}22 = -35\\,674{,}8\\ \\text{cm}^3"}</MB>
            <MB>{"y_S = \\frac{-35\\,674{,}8}{2\\,500} = -14{,}27\\ \\text{cm}"}</MB>
          </Lepes>
        </KidolgozottFeladat>
        <div className="my-8">
          <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Ugyanez filmen – negyedkör ki, negyedkör be</p>
          <FilmGyf6 />
        </div>

      </Szakasz>

      {/* ==================== KALKULÁTOR ==================== */}
      <Szakasz
        id="kalkulator"
        cimke="3. rész"
        cim="Kalkulátor"
        bevezeto="Tetszőleges számú rész: téglalap, háromszög, kör, félkör, negyedkör, hozzáadva vagy kivonva. A három gyakorlati feladat egy gombbal betölthető — de előbb számold ki magad."
      >
        <SulypontKalk />
        <Kiemelo tipus="tipp" cim="Hogyan használd tanulásra">
          <p>
            Ne a végeredményt nézd, hanem a táblázatot: a te részeid területe és koordinátái
            egyeznek-e a kalkulátoréval? Ha a súlypont nem stimmel, a hiba szinte mindig egy rész
            koordinátájában van, nem a képletben. Próbáld ki az origó áthelyezését is: más
            koordináták, ugyanaz a pont.
          </p>
        </Kiemelo>
      </Szakasz>

      {/* ==================== GYAKORLÁS ==================== */}
      <Szakasz
        id="gyakorlas"
        cimke="4. rész"
        cim="Gyakorlás"
        bevezeto="Öt feladattípus a szimmetrikus szelvénytől a köríves idomokig. Papíron, táblázatban dolgozz, és csak az eredményt írd be."
        className="bg-white"
      >
        <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Előbb az ötlet – fogalmi kvíz</p>
        <Kviz cim="Érted, vagy csak számolod?" leiras="Nyolc kérdés a modul tipikus félreértéseiről. Minden válasz után rövid magyarázat." kerdesek={KVIZ} />
        <p className="mt-8 mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Hibakereső – találd meg a hibát</p>
        <Hibakereso feladatok={HIBAK} />
        <p className="mt-8 mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Számolós gyakorlás</p>
        <GyakorloSzekcio />
        <Kiemelo tipus="kulcs" cim="Ezzel a négy modul végére értél">
          <p>
            Vektorok, nyomaték, megoszló erők, súlypont — ez az a négy eszköz, amivel a félév további
            része dolgozik: tartók reakciói, igénybevételi ábrák, majd keresztmetszeti jellemzők. Ha a
            gyakorló feladatokat folyamatosan jól oldod meg, a zárthelyi számolós része nem érhet
            meglepetéssel.
          </p>
        </Kiemelo>
      </Szakasz>
    </>
  );
}
