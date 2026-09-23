import { ModulFejlec, SzakaszSav } from "@/components/ModulKeret";
import { Szakasz, Kiemelo, AbraKeret, KetOszlop, TankonyvJel, Szotar } from "@/components/ui/Elemek";
import { M, MB, KepletDoboz } from "@/components/ui/Keplet";
import { KidolgozottFeladat, Lepes } from "@/components/KidolgozottFeladat";
import SzelvenyFelfedezo from "@/components/abrak/SzelvenyFelfedezo";
import SulypontKalk from "@/components/abrak/SulypontKalk";
import { AbraSulypontFogalom, AbraAlapidomok, AbraFelbontasT, AbraKivonas } from "@/components/abrak/SulypontAbrak";
import { AbraTSzelveny, AbraLyukasIdom, AbraNegyedkorIdom } from "@/components/abrak/SulypontFeladatAbrak";
import EltolasFelfedezo from "@/components/sulypont/EltolasFelfedezo";
import SulypontTablazat from "@/components/sulypont/SulypontTablazat";
import JatekSulypont from "@/components/sulypont/JatekSulypont";
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
        tartalom={["Statikai (elsőrendű) nyomaték", "A súlypont definíciója", "A statikai nyomaték eltolása", "Alapidomok", "Részekre bontás", "Kivonásos módszer", "4R/3π", "Súlypont-találó játék"]}
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

        <h3 className="mt-10 text-xl font-semibold text-petrol-900">4.2 Statikai nyomaték és a súlypont definíciója</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Keresztmetszeteknél az <M>{"y"}</M>–<M>{"z"}</M> síkban dolgozunk: az <M>{"x"}</M> tengely a
            rúd hossza mentén, kifelé mutat a rajzból, az <M>{"y"}</M> tengely <strong>balra</strong>, a{" "}
            <M>{"z"}</M> tengely <strong>lefelé</strong>. A teljes területet gondolatban elemien kicsiny{" "}
            <M>{"dA"}</M> darabokra bontjuk (<M>{"A = \\int_A dA"}</M>), és minden darabot megszorzunk a
            tengelytől mért <em>előjeles</em> távolságával. Az így kapott összeg — a megoszló erőknél
            felírt nyomatéki egyenlet bal oldalának pontos mása — az idom{" "}
            <strong>statikai nyomatéka</strong> az adott tengelyre; a tankönyv a másik nevét is
            megadja: <strong>elsőrendű nyomaték</strong>, mert a távolság az első hatványon szerepel benne.
          </p>
        </div>
        <KepletDoboz
          cimke="Statikai (elsőrendű) nyomaték a két tengelyre"
          keplet={"S_y = \\int_A z\\,dA,\\qquad S_z = \\int_A y\\,dA\\qquad[\\text{mm}^3,\\ \\text{cm}^3]"}
        />
        <Kiemelo tipus="definicio" cim="A súlypont definíciója (tankönyv 9.14)">
          <p>
            A síkidom <strong>súlypontja</strong> az a pont, amelyen átmenő tengelyekre a statikai nyomaték{" "}
            <strong>nulla</strong>. Nem a „súlyozott átlag” a definíció — az már következmény. Ha a súlypont az
            origótól <M>{"z_S"}</M> mélyen van, akkor a rajta átmenő vízszintes tengelyre a nyomaték a 4.3-ban
            levezetett eltolási szabály szerint <M>{"S_y - z_S A"}</M>, és ennek kell nullának lennie:
          </p>
          <MB>{"0 = S_y - z_S\\,A\\quad\\Rightarrow\\quad z_S = \\frac{S_y}{A},\\qquad\\qquad 0 = S_z - y_S\\,A\\quad\\Rightarrow\\quad y_S = \\frac{S_z}{A}"}</MB>
        </Kiemelo>
        <KepletDoboz
          cimke="A súlypont koordinátái"
          keplet={"z_S = \\frac{S_y}{A},\\qquad y_S = \\frac{S_z}{A}"}
        />
        <KepletDoboz
          cimke="Ugyanez visszafelé — ha a súlypont ismert, a statikai nyomaték egy szorzat (tankönyv 9.16)"
          keplet={"S_y = z_S\\,A,\\qquad S_z = y_S\\,A"}
        />
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Ez a visszafelé olvasott képlet a gyakorlati munka kulcsa: egy téglalap, egy kör, egy
            negyedkör súlypontját fejből tudjuk, tehát a statikai nyomatékukat sosem integráljuk, hanem{" "}
            <em>terület × a súlypont távolsága</em> szorzatként írjuk fel — részenként, aztán összeadjuk
            (4.5). Ezért van a táblázatban <M>{"A_i z_i"}</M> oszlop.
          </p>
        </div>
        <Kiemelo tipus="figyelem" cim="Sy-hoz a z távolság tartozik">
          <p>
            A statikai nyomaték indexe azt a tengelyt mondja, <em>amelyre</em> a nyomatékot számoljuk — a
            távolságot pedig <em>attól</em> a tengelytől mérjük. Az <M>{"y"}</M> tengelytől mért távolság a{" "}
            <M>{"z"}</M> koordináta, ezért <M>{"S_y = \\sum A_i z_i"}</M> és <M>{"z_S = S_y / A"}</M>. Ez
            az index-csere az egyik leggyakoribb hiba a zárthelyiken.
          </p>
        </Kiemelo>

        <TankonyvJel fejezet="9.4">
          <p>
            A könyv a síkidomot az <M>{"x'y'"}</M>-síkban tárgyalja, és a statikai nyomatékot így írja:{" "}
            <M>{"S_{x'} = \\int_A y'\\,dA"}</M>, <M>{"S_{y'} = \\int_A x'\\,dA"}</M> (9.9–9.10). A{" "}
            <strong>vessző</strong> nem elhanyagolható díszítés: a vesszős tengelyek a <em>külső</em>,
            tetszőlegesen felvett tengelyek, a vesszőtlen <M>{"xy"}</M>-t a könyv a{" "}
            <em>súlyponti</em> koordináta-rendszernek tartja fenn, és a kettő között{" "}
            <M>{"x = x' - x'_S"}</M>, <M>{"y = y' - y'_S"}</M> az átváltás. A gyakorlaton és ezen az
            oldalon a keresztmetszet síkja az <M>{"y"}</M>–<M>{"z"}</M>, és a vesszőt csak ott írjuk
            ki, ahol két rendszer szerepel egyszerre (4.3). A szabály a betűktől függetlenül ugyanaz:{" "}
            <strong>az index a tengely, a szorzó a másik koordináta</strong> — a tengelytől mért előjeles
            távolság.
          </p>
          <Szotar
            sorok={[
              { itt: <M>{"S_y = \\int z\\,dA"}</M>, konyv: <M>{"S_{x'} = \\int y'\\,dA"}</M>, megjegyzes: "a vízszintes tengelyre vett statikai nyomaték; a szorzó a függőleges koordináta" },
              { itt: <M>{"S_z = \\int y\\,dA"}</M>, konyv: <M>{"S_{y'} = \\int x'\\,dA"}</M>, megjegyzes: "a függőleges tengelyre; a szorzó a vízszintes koordináta" },
              { itt: <M>{"z_S = S_y/A,\\ y_S = S_z/A"}</M>, konyv: <M>{"y'_S = S_{x'}/A,\\ x'_S = S_{y'}/A"}</M>, megjegyzes: "9.15 — a definícióból (9.14) két sorban" },
              { itt: <M>{"S_y = z_S A"}</M>, konyv: <M>{"S_{x'} = y'_S A"}</M>, megjegyzes: "9.16 — ha a súlypont ismert; ezt írjuk a részekre" },
              { itt: <><M>{"y,\\ z"}</M> (külső tengelyek, az idom sarkában)</>, konyv: <><M>{"x',\\ y'"}</M> (a vessző = külső tengely)</>, megjegyzes: "a könyv a vesszőtlen xy-t a súlyponti rendszernek tartja fenn" },
              { itt: "statikai nyomaték", konyv: "statikai nyomaték = elsőrendű nyomaték", megjegyzes: "a szilárdságtanban jön a másodrendű (tehetetlenségi) nyomaték" },
            ]}
          />
        </TankonyvJel>

        <h3 className="mt-10 text-xl font-semibold text-petrol-900">4.3 A statikai nyomaték eltolása</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            A statikai nyomaték nem az idom sajátja, hanem az idomé <em>és</em> a tengelyé: ha máshova
            tesszük az origót, más szám jön ki. Szerencsére a változás nagyon egyszerű. Legyen az{" "}
            <M>{"O'"}</M> rendszerben ismert <M>{"S_{y'}"}</M> és <M>{"S_{z'}"}</M>, és toljuk el az origót
            az <M>{"O''"}</M> pontba, amelynek koordinátái <M>{"O'"}</M>-ben <M>{"(y_0;\\ z_0)"}</M>. Minden{" "}
            <M>{"dA"}</M> darab új koordinátája a régiből az eltolás levonásával adódik (tankönyv 9.11):{" "}
            <M>{"y'' = y' - y_0"}</M>, <M>{"z'' = z' - z_0"}</M>. Ezt beírjuk a definícióba:
          </p>
        </div>
        <KepletDoboz
          cimke="Levezetés: a különbség integrálja az integrálok különbsége, az állandó integrálja állandó × terület (tankönyv 9.12–9.13)"
          keplet={"S_{y''} = \\int_A z''\\,dA = \\int_A (z' - z_0)\\,dA = \\int_A z'\\,dA - z_0\\int_A dA = S_{y'} - z_0\\,A"}
        />
        <KepletDoboz
          cimke="Az eltolási szabály"
          keplet={"S_{y''} = S_{y'} - z_0\\,A,\\qquad S_{z''} = S_{z'} - y_0\\,A"}
        />
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Szavakkal: a statikai nyomaték az <strong>eltolás × terület</strong> szorzatával változik,
            előjelesen — és vele lineárisan. Két következménye van, és mindkettőt a modul további részében
            használjuk:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>A súlyponti tengelyre nulla.</strong> Ha az origót éppen a súlypontba toljuk (
              <M>{"z_0 = z_S = S_{y'}/A"}</M>), akkor <M>{"S_{y''} = S_{y'} - z_S A = 0"}</M>. Ez a 4.2-beli
              definíció másik oldala.
            </li>
            <li>
              <strong>Átváltás a súlyponti rendszerbe.</strong> A súlyponti tengelyekre vonatkozó koordináta
              a külsőből az eltolás levonásával kapható: <M>{"y = y' - y_S"}</M>, <M>{"z = z' - z_S"}</M>{" "}
              — a szilárdságtanban a másodrendű nyomatékhoz ezt a rendszert fogod használni.
            </li>
          </ul>
        </div>

        <div className="mt-6">
          <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Próbáld ki – told el az origót, a súlypont marad</p>
          <EltolasFelfedezo />
        </div>

        <Kiemelo tipus="kulcs" cim="Mi mozdul és mi nem">
          <p>
            Az eltolásnál a <em>szám</em> (<M>{"S_y"}</M>) változik, a <em>pont</em> (a súlypont) nem: csak a
            koordinátái mások az új rendszerben, <M>{"z_S'' = z_S' - z_0"}</M>. Ha egy feladatban más origót
            választasz, mint a megoldókulcs, a súlypont koordinátái eltérnek — de az idomon ugyanoda kell
            mutatniuk. Ezt a kalkulátor „origó eltolása” gombjával is ellenőrizheted.
          </p>
        </Kiemelo>

        <h3 className="mt-10 text-xl font-semibold text-petrol-900">4.4 Alapidomok területe és súlypontja</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Integrálni a gyakorlatban sosem kell: néhány alapidom súlypontját fejből tudjuk, minden
            mást ezekből rakunk össze. A téglalap súlypontja a közepe. A háromszögé minden oldaltól a
            magasság harmadára van — derékszögű háromszögnél ez azt jelenti, hogy a derékszögű csúcstól
            mindkét befogó mentén a harmadára. A kör súlypontja a középpontja. A félkör és a negyedkör
            súlypontja az egyenes éltől (a kör középpontjától) <M>{"4R/3\\pi \\approx 0{,}4244\\,R"}</M>{" "}
            távolságra esik — a negyedkörnél mindkét egyenes éltől.
          </p>
          <p>
            A tankönyv 9.4. ábrája a kör alakú idomokat <strong>átmérővel</strong> is megadja, mert a
            feladatok gyakran <M>{"D"}</M>-t adnak meg: kör <M>{"A = R^2\\pi = D^2\\pi/4"}</M>, félkör{" "}
            <M>{"A = R^2\\pi/2 = D^2\\pi/8"}</M>, negyedkör <M>{"A = R^2\\pi/4 = D^2\\pi/16"}</M>. A súlypont
            távolsága átmérővel <M>{"4R/3\\pi = 2D/3\\pi"}</M>. Első lépésként mindig írd fel{" "}
            <M>{"R = D/2"}</M>-t — aki az átmérőt sugárnak nézi, négyszeres területet kap.
          </p>
        </div>

        <AbraKeret szam={2} cim="Az öt alapidom a tankönyv 9.4. ábrája szerint — sugárral és átmérővel. A 4R/3π-t érdemes megjegyezni.">
          <AbraAlapidomok />
        </AbraKeret>

        <Kiemelo tipus="tipp" cim="Hogy jegyezd meg a 4R/3π-t? A 424-es gőzmozdony (tankönyv, 5. lábjegyzet)">
          <p>
            A félkör és a negyedkör súlypont-távolságában a sugár biztosan a számlálóban van (az érték a sugárral
            arányosan nő). A maradék három számból — <M>{"3,\\ 4,\\ \\pi"}</M> — úgy kell törtet rakni, hogy{" "}
            <M>{"\\tfrac{4}{3\\pi} \\approx 0{,}4244"}</M> jöjjön ki. Ha a tizedesvessző utáni első három
            számjegy a legendás <strong>424-es gőzmozdony</strong> száma, jó helyre írtad a számokat. (A
            másik kombináció, <M>{"3/(4\\pi) = 0{,}239"}</M>, azonnal elárulja magát.)
          </p>
        </Kiemelo>

        <h3 className="mt-10 text-xl font-semibold text-petrol-900">4.5 Összetett idom: részekre bontás</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Egy összetett idom statikai nyomatéka a részek statikai nyomatékainak összege — az integrál
            részterületenként végezhető, ahogy párhuzamos erők nyomatéka is összeadódik (tankönyv
            9.17–9.19). Minden rész statikai nyomatéka a 4.2-beli szorzat: <M>{"S_{iy} = A_i z_i"}</M>. Ezért
            a recept: bontsd fel az idomot alapidomokra, írd fel minden rész területét és a saját
            súlypontjának a <strong>közös origótól mért</strong> koordinátáit, szorozd össze, add össze,
            oszd el az összterülettel. A felbontás nem egyértelmű, és nem is kell annak lennie: bármelyik
            felbontás ugyanazt az eredményt adja.
          </p>
        </div>
        <KepletDoboz
          cimke="A súlypont mint súlyozott átlag (tankönyv 9.20 és 9.24)"
          keplet={"y_S = \\frac{S_z}{A} = \\frac{\\sum A_i\\,y_i}{\\sum A_i},\\qquad z_S = \\frac{S_y}{A} = \\frac{\\sum A_i\\,z_i}{\\sum A_i}"}
        />

        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            A tankönyv 9.5. ábrája ezt a számítást egy táblázatba rendezi: soronként egy rész (<M>{"i"}</M>,{" "}
            <M>{"A_i"}</M>, a súlypont két koordinátája, a két szorzat), alul az oszlopok összege, legalul
            az osztás. <strong>Pontosan ezt a táblázatot kéri a gyakorlaton</strong> — szokj rá, hogy ebben
            dolgozol, mert egy elrontott koordináta így azonnal látszik. Íme a GYF‑4 T-szelvénye ebben a formában:
          </p>
        </div>
        <SulypontTablazat
          sorok={[
            { nev: "fejlemez 300×30", A: 9000, y: 0, z: 15 },
            { nev: "gerinc 20×270", A: 5400, y: 0, z: 30 + 135 },
          ]}
          egyseg="mm"
          tizedes={{ A: 0, k: 2, S: 0 }}
          csakZ
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

        <h3 className="mt-10 text-xl font-semibold text-petrol-900">4.6 Kivonásos módszer: lyukak és kivágások</h3>
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

        <h3 className="mt-10 text-xl font-semibold text-petrol-900">4.7 Szimmetria és józan ész</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Ha az idomnak van szimmetriatengelye, a súlypont rajta van — az egyik koordinátát tehát
            nem kell számolni. Az indoklás a definícióból jön: a tengely két oldalán fekvő tükörképi
            részek statikai nyomatéka a tengelyre egymás mínusz egyszerese, az összeg tehát nulla — és
            ahol a statikai nyomaték nulla, ott a súlypont tengelye van. A T-, I- és U-szelvénynél ez
            azonnal megadja <M>{"y_S"}</M>-t. Két szimmetriatengelynél (téglalap, kör, I-szelvény) a
            súlypont a metszéspontjuk, számolás nélkül.
          </p>
          <p>
            Az eredményt mindig nézd meg: a súlypont az idom befoglaló téglalapján belül van, és a
            nagyobb részek felé húz. Nem kell viszont az anyagon belül lennie: egy L-szelvény, egy
            U-szelvény vagy egy körgyűrű súlypontja a levegőben van — attól még ez a súlypont.
          </p>
        </div>

        <Kiemelo tipus="kulcs" cim="A három lépés">
          <p>
            <strong>1. Felbontás</strong> alapidomokra (hozzáadva vagy kivonva). <strong>2. Táblázat</strong>{" "}
            (a tankönyv 9.5. ábrája): <M>{"A_i"}</M>, <M>{"y_i"}</M>, <M>{"z_i"}</M>, <M>{"A_i y_i"}</M>,{" "}
            <M>{"A_i z_i"}</M>, és az oszlopok összege: <M>{"A"}</M>, <M>{"S_z"}</M>, <M>{"S_y"}</M>.{" "}
            <strong>3. Osztás:</strong> <M>{"y_S = S_z/A = \\sum A_i y_i / \\sum A_i"}</M>,{" "}
            <M>{"z_S = S_y/A = \\sum A_i z_i / \\sum A_i"}</M>. Aki táblázatban dolgozik, ritkán hibázik.
          </p>
        </Kiemelo>

        <h3 className="mt-10 text-xl font-semibold text-petrol-900">4.8 Miért fontos?</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            A 3. modulban a megoszló teher eredője a teherábra súlypontján ment át — ugyanez a képlet,
            csak ott „terület” helyett „kN” volt a mértékegység. A súlypont ennél is többször tér vissza:
            a keresztmetszet hajlításnál a súlyponton átmenő tengely körül „forog”, és a súlyponti
            tengelyre a statikai nyomaték éppen nulla (4.2–4.3). A tankönyv ezért a vesszőtlen{" "}
            <M>{"xy"}</M> (nálunk <M>{"yz"}</M>) koordináta-rendszert a <strong>súlyponti rendszernek tartja
            fenn</strong>: a szilárdságtanban a másodrendű (tehetetlenségi) nyomatékot ezekre a
            tengelyekre számolod, a külső tengelyekről az <M>{"y = y' - y_S"}</M>, <M>{"z = z' - z_S"}</M>{" "}
            átváltással jutsz oda. Ezt a tulajdonságot a szilárdságtan egész félévében használni fogod.
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
            <MB>{"S_z = 62\\,500 - 1\\,963{,}5\\cdot 28{,}78 - 1\\,963{,}5\\cdot 21{,}22 = 62\\,500 - 56\\,509{,}5 - 41\\,665{,}5 = -35\\,675\\ \\text{cm}^3"}</MB>
            <MB>{"y_S = \\frac{-35\\,675}{2\\,500} = -14{,}27\\ \\text{cm}"}</MB>
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
            koordinátájában van, nem a képletben. Nyisd meg az „origó eltolása” dobozt is: a kalkulátor
            a 4.3 képletével (<M>{"S_{y''} = S_{y'} - z_0 A"}</M>) számolja át a statikai nyomatékot — más
            koordináták, ugyanaz a pont; az „a súlypontba” gombbal pedig látod, hogy ott mindkettő nulla.
          </p>
        </Kiemelo>
      </Szakasz>

      {/* ==================== GYAKORLÁS ==================== */}
      <Szakasz
        id="gyakorlas"
        cimke="4. rész"
        cim="Gyakorlás"
        bevezeto="Előbb szemmérték, aztán fogalmak, aztán számolás: tizenkét feladattípus a szimmetrikus szelvénytől a köríves idomokig és az eltolt tengelyekig. Papíron, táblázatban dolgozz, és csak az eredményt írd be."
        className="bg-white"
      >
        <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Előbb játssz – hol a súlypont?</p>
        <JatekSulypont />
        <p className="mt-8 mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Aztán az ötlet – fogalmi kvíz</p>
        <Kviz cim="Érted, vagy csak számolod?" leiras="Tizenkét kérdés a modul tipikus félreértéseiről — a definíciótól az eltolási képletig. Minden válasz után rövid magyarázat." kerdesek={KVIZ} />
        <p className="mt-8 mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Hibakereső – találd meg a hibát</p>
        <Hibakereso feladatok={HIBAK} />
        <p className="mt-8 mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Számolós gyakorlás</p>
        <GyakorloSzekcio />
        <Kiemelo tipus="kulcs" cim="Ezzel az erőrendszerek négy moduljának végére értél">
          <p>
            Vektorok, nyomaték, megoszló erők, súlypont — ez az a négy eszköz, amivel a félév további
            része dolgozik: tartók reakciói, igénybevételi ábrák, majd keresztmetszeti jellemzők. A
            következő lépés az 5. modul, az egyszerű tartók reakciói — ott ez a négy eszköz egyszerre
            kerül elő. Ha a gyakorló feladatokat folyamatosan jól oldod meg, a zárthelyi számolós része
            nem érhet meglepetéssel.
          </p>
        </Kiemelo>
      </Szakasz>
    </>
  );
}
