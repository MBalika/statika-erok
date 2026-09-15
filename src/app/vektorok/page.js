import Link from "next/link";
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
import {
  KidolgozottFeladat,
  Lepes,
} from "@/components/KidolgozottFeladat";
import ErovektorBonto from "@/components/abrak/ErovektorBonto";
import VektorOsszegzo from "@/components/abrak/VektorOsszegzo";
import VetuletFelfedezo from "@/components/abrak/VetuletFelfedezo";
import TerbeliVektorKalk from "@/components/abrak/TerbeliVektorKalk";
import {
  AbraEroJellemzoi,
  AbraOsszeadas,
  AbraEgyensuly,
  AbraSzogCsapda,
  AbraTerbeliVektor,
  AbraErorendszerFajtai,
} from "@/components/abrak/StatikusAbrak";
import { AbraGyf2, AbraGyf3 } from "@/components/abrak/FeladatAbrak";
import GyakorloSzekcio from "@/components/vektorok/GyakorloSzekcio";
import Kviz from "@/components/Kviz";
import Hibakereso from "@/components/Hibakereso";
import { KVIZ, HIBAK } from "@/components/vektorok/KvizAdatok";
import FilmGyf2 from "@/components/vektorok/FilmGyf2";
import FilmGyf3 from "@/components/vektorok/FilmGyf3";
import VektorMuveletFelfedezo from "@/components/vektorok/VektorMuveletFelfedezo";
import SkalarisSzorzatFelfedezo from "@/components/vektorok/SkalarisSzorzatFelfedezo";
import DeterminansAnimacio from "@/components/vektorok/DeterminansAnimacio";
import VektorsokszogEpito from "@/components/vektorok/VektorsokszogEpito";
import JatekEgyensuly from "@/components/vektorok/JatekEgyensuly";
import { Film3DTerbeliOsszeg } from "@/components/harom/Film3D";
import { modulSlugAlapjan } from "@/lib/oldalterkep";

export const metadata = {
  title: "Vektorok, erők megadása",
  description:
    "Erő megadása komponensekkel, vektorműveletek, skaláris és vektoriális szorzat, erőrendszerek, egyenértékűségi kijelentés és egyensúly — interaktív ábrákkal, kidolgozott feladatokkal és gyakorlással.",
};

const modul = modulSlugAlapjan("/vektorok");

const Alcim = ({ children }) => (
  <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">{children}</p>
);

export default function VektorokOldal() {
  return (
    <>
      <ModulFejlec
        szam={1}
        cim="Vektorok, erők megadása"
        leiras="Minden statikai számítás itt kezdődik: hogyan írunk le egy erőt számokkal, hogyan adunk össze erőket, és mit jelent az, hogy egy test egyensúlyban van."
        tartalom={[
          "Komponensekre bontás",
          "Vektorműveletek",
          "Erőrendszerek fajtái",
          "Egyenértékűségi kijelentés",
          "Egyensúly, zéruserő",
          "Skaláris és vektoriális szorzat",
          "Térbeli vektorok",
        ]}
      />
      <SzakaszSav szakaszok={modul.szakaszok} />

      {/* ==================== ELMÉLET ==================== */}
      <Szakasz
        id="elmelet"
        cimke="1. rész"
        cim="Elmélet"
        bevezeto="Tizenegy rövid alfejezet, a tankönyv 2.4. és 3.1–3.3. fejezetének gondolatmenetén. Az ábrákat próbáld ki: a mozgatható ábrák többet tanítanak, mint tíz sor magyarázat."
      >
        {/* --- 1.1 Az erő --- */}
        <h3 className="mt-2 text-xl font-semibold text-petrol-900">
          1.1 Mi az erő, és mivel adjuk meg?
        </h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Az erő a testek kölcsönhatásának mértéke: olyan hatás, amely a test
            mozgásállapotát vagy alakját megváltoztathatja. Vektormennyiség — nem
            elég megmondani, hogy mekkora, azt is tudni kell, merre hat és hol
            támad. Egy erőt négy adat jellemez: a <strong>támadáspont</strong>,
            a <strong>hatásvonal</strong> (a támadásponton át az erővektorral
            párhuzamosan húzott egyenes), a <strong>nagyság</strong> és az{" "}
            <strong>irány</strong> a hatásvonalon belül.
          </p>
          <p>
            Mivel egy erő hatása attól is függ, <em>hol</em> támad (egy seprűnyelet
            a végén vagy a közepén megfogva más erőt kell kifejtenünk ugyanahhoz
            a vödörhöz), az erő <strong>kötött vektor</strong>: a támadáspont
            hozzátartozik. A megadásához ezért a támadáspontba mutató{" "}
            <M>{"\\underline{r}"}</M> helyvektor és az <M>{"\\underline{F}"}</M>{" "}
            erővektor együtt kell — síkban ez 2 + 2 = 4 szám, térben 3 + 3 = 6
            szám. (A 2. modulban megjelenő nyomaték ezzel szemben szabad vektor
            lesz.)
          </p>
          <p>
            Az erő mindig kölcsönhatásból származik: ha az egyik test erőt fejt ki
            a másikra, a másik ugyanakkora és ellentett erővel hat vissza —
            ez a hatás–ellenhatás törvénye. Merev testek statikájában az erő a
            saját hatásvonala mentén szabadon eltolható anélkül, hogy a test
            egyensúlya megváltozna; ez teszi lehetővé, hogy erőrendszereket
            egyszerűbb, egyenértékű rendszerekkel helyettesítsünk.
          </p>
        </div>

        <KepletDoboz
          cimke="Az erő megadása helyvektorral és erővektorral (tankönyv 3.1–3.2)"
          keplet={
            "\\underline{r} = \\begin{bmatrix} r_x \\\\ r_y \\end{bmatrix},\\ \\underline{F} = \\begin{bmatrix} F_x \\\\ F_y \\end{bmatrix}\\ (\\text{síkban: 4 szám})\\qquad \\underline{r} = \\begin{bmatrix} r_x \\\\ r_y \\\\ r_z \\end{bmatrix},\\ \\underline{F} = \\begin{bmatrix} F_x \\\\ F_y \\\\ F_z \\end{bmatrix}\\ (\\text{térben: 6 szám})"
          }
        />

        <TankonyvJel fejezet="3.1.2">
          <p>
            A tankönyv háromféle jelet használ ugyanarra az erőre: <M>{"F"}</M>{" "}
            (dőlt, aláhúzás nélkül) az erő <strong>nagysága</strong>, egy szám;{" "}
            <M>{"\\underline{F}"}</M> (aláhúzva) az <strong>erővektor</strong>, a
            komponensek oszlopa; a kalligrafikus <M>{"\\mathcal{F}"}</M> pedig a{" "}
            <strong>teljes erő</strong> a támadáspontjával együtt — ez szerepel az
            erőrendszerekben és az egyenértékűségi kijelentésekben. Kézírásban az
            aláhúzás jelöli a vektort; ezen az oldalon is így írjuk.
          </p>
        </TankonyvJel>

        <AbraKeret
          szam={1}
          cim="Az erő négy jellemzője: támadáspont, hatásvonal, nagyság és irány."
        >
          <AbraEroJellemzoi />
        </AbraKeret>

        {/* --- 1.2 Komponensek --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">
          1.2 Komponensekre bontás
        </h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Egy síkbeli erőt kétféleképpen adhatunk meg: vagy a{" "}
            <strong>nagyságával és a hajlásszögével</strong>, vagy a{" "}
            <strong>két komponensével</strong> (a koordinátatengelyekre vett
            merőleges vetületekkel, oszlopvektorban egymás alá írva). A kettő
            ugyanazt az információt hordozza, csak más alakban — és a számoláshoz
            szinte mindig a komponenses alak a kényelmesebb, mert komponenseket
            egyszerűen össze lehet adni.
          </p>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Kartya cimke="Oda" cim="Nagyságból komponensek">
            <MB>{"F_x = F\\cos\\alpha"}</MB>
            <MB>{"F_y = F\\sin\\alpha"}</MB>
            <p className="mt-2 text-[13px] text-petrol-500">
              Feltéve, hogy az <M>{"\\alpha"}</M> szöget az <M>{"x"}</M>{" "}
              tengelytől mértük.
            </p>
          </Kartya>
          <Kartya cimke="Vissza" cim="Komponensekből nagyság és irány">
            <MB>{"F = \\sqrt{F_x^2 + F_y^2}"}</MB>
            <MB>{"\\alpha = \\operatorname{arctg}\\frac{F_y}{F_x}"}</MB>
            <p className="mt-2 text-[13px] text-petrol-500">
              Az <M>{"\\operatorname{arctg}"}</M> csak <M>{"-90^\\circ"}</M> és{" "}
              <M>{"+90^\\circ"}</M> közé ad eredményt, ezért az ábra alapján
              mindig ellenőrizd a síknegyedet.
            </p>
          </Kartya>
        </div>

        <div className="mt-6">
          <Alcim>Próbáld ki</Alcim>
          <ErovektorBonto />
        </div>

        <Kiemelo tipus="figyelem" cim="A leggyakoribb hiba: felcserélt szinusz és koszinusz">
          <p>
            A <M>{"\\cos"}</M> és a <M>{"\\sin"}</M> nem a komponenshez, hanem a{" "}
            <em>szöghöz</em> tartozik. Ha a szöget az <M>{"x"}</M> tengelytől
            méred, a vízszintes komponenshez koszinusz jár. Ha viszont a rajz az{" "}
            <M>{"y"}</M> tengelytől adja meg a szöget — és a feladatlapokon ez
            gyakran így van —, akkor felcserélődnek. Ne képletet magolj: rajzold
            be a derékszögű háromszöget, és nézd meg, melyik befogó van a szög
            mellett (szög melletti befogó / átfogó = koszinusz, szöggel szemközti
            befogó / átfogó = szinusz).
          </p>
        </Kiemelo>

        <AbraKeret
          szam={2}
          cim="Ugyanaz az erő, kétféleképpen megadott szöggel. A képlet nem ugyanaz."
        >
          <AbraSzogCsapda />
        </AbraKeret>

        {/* --- 1.3 Vektor-szótár --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">
          1.3 Vektor-szótár: egységvektor, ellentett, kivonás, skalárszoros
        </h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Néhány fogalom, amely a tankönyv 2.4. fejezetében szerepel, és amelyre
            a következő alfejezetek lépten-nyomon hivatkoznak.
          </p>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Kartya cimke="1 hosszúságú" cim="Egységvektor">
            <p className="text-[14px] text-petrol-700">
              Olyan vektor, amelynek hossza 1: <M>{"|\\underline{e}| = 1"}</M>. Csak
              irányt hordoz. Bármely vektorból készíthetünk egyet, ha elosztjuk a
              hosszával: <M>{"\\underline{e}_a = \\underline{a}/|\\underline{a}|"}</M>.
              A tengelyirányú egységvektorok:
            </p>
            <MB>
              {
                "\\underline{i} = \\begin{bmatrix} 1 \\\\ 0 \\\\ 0 \\end{bmatrix},\\quad \\underline{j} = \\begin{bmatrix} 0 \\\\ 1 \\\\ 0 \\end{bmatrix},\\quad \\underline{k} = \\begin{bmatrix} 0 \\\\ 0 \\\\ 1 \\end{bmatrix}"
              }
            </MB>
          </Kartya>
          <Kartya cimke="0 hosszúságú" cim="Nullvektor">
            <p className="text-[14px] text-petrol-700">
              Olyan vektor, amelynek hossza 0: <M>{"\\underline{0}"}</M>. Iránya nem
              meghatározott — ha kell, tetszőleges irányúnak gondolhatjuk. Az
              egyensúly nyelvén ez a <em>zéruserő</em>, jele az erőrendszereknél{" "}
              <M>{"\\underline{O}"}</M>. Ellentettje önmaga.
            </p>
          </Kartya>
          <Kartya cimke="Előjelváltás" cim="Ellentett vektor">
            <p className="text-[14px] text-petrol-700">
              Az <M>{"\\underline{a}"}</M> ellentettje az a vektor, amelyet hozzáadva
              nullvektort kapunk: <M>{"\\underline{a} + (-\\underline{a}) = \\underline{0}"}</M>.
              Komponensenként ellentett, ugyanolyan hosszú, rajzban csak a nyíl
              fordul meg.
            </p>
            <MB>
              {
                "\\underline{a} = \\begin{bmatrix} 7 \\\\ 10 \\end{bmatrix} \\ \\Rightarrow\\ -\\underline{a} = \\begin{bmatrix} -7 \\\\ -10 \\end{bmatrix}"
              }
            </MB>
          </Kartya>
          <Kartya cimke="Ellentett hozzáadása" cim="Kivonás">
            <p className="text-[14px] text-petrol-700">
              <M>{"\\underline{a} - \\underline{b} = \\underline{a} + (-\\underline{b})"}</M>,
              komponensenként. Rajzban: a két vektort közös kezdőpontból mérve az{" "}
              <M>{"\\underline{a} - \\underline{b}"}</M> a <M>{"\\underline{b}"}</M>{" "}
              végpontjából az <M>{"\\underline{a}"}</M> végpontjába mutat. A sorrend
              számít: <M>{"\\underline{a} - \\underline{b} = -(\\underline{b} - \\underline{a})"}</M>.
            </p>
            <MB>
              {
                "\\begin{bmatrix} 3 \\\\ 4 \\\\ 5 \\end{bmatrix} - \\begin{bmatrix} 4 \\\\ 6 \\\\ 9 \\end{bmatrix} = \\begin{bmatrix} -1 \\\\ -2 \\\\ -4 \\end{bmatrix}"
              }
            </MB>
          </Kartya>
          <Kartya cimke="Nyújtás, fordítás" cim="Szorzás skalárral">
            <p className="text-[14px] text-petrol-700">
              Minden komponenst ugyanazzal a számmal szorzunk. A vektor megnyúlik
              vagy összenyomódik, negatív skalárnál meg is fordul. A{" "}
              <M>{"(-1)\\cdot\\underline{a}"}</M> éppen az ellentett, az{" "}
              <M>{"\\underline{a} + \\underline{a} = 2\\underline{a}"}</M>.
            </p>
            <MB>
              {
                "1,5\\cdot\\begin{bmatrix} 4 \\\\ -8 \\\\ -3 \\end{bmatrix} = \\begin{bmatrix} 6 \\\\ -12 \\\\ -4,5 \\end{bmatrix}"
              }
            </MB>
          </Kartya>
          <Kartya cimke="Jelölés" cim="A mértékegység a vektor elé">
            <p className="text-[14px] text-petrol-700">
              Fizikai vektornál minden komponens és a nagyság is ugyanazt a
              mértékegységet viseli. A mértékegységet ezért skalárszorzóként
              egyszer, a vektor mögé írjuk — nem minden elemhez külön.
            </p>
            <MB>
              {
                "\\underline{F} = \\begin{bmatrix} 2\\ \\text{kN} \\\\ -1\\ \\text{kN} \\\\ 3,2\\ \\text{kN} \\end{bmatrix} = \\begin{bmatrix} 2 \\\\ -1 \\\\ 3,2 \\end{bmatrix}\\ \\text{kN}"
              }
            </MB>
          </Kartya>
        </div>

        <div className="mt-6">
          <Alcim>Próbáld ki – vektorműveletek rajzban és számmal</Alcim>
          <VektorMuveletFelfedezo />
        </div>

        {/* --- 1.4 Összeadás --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">
          1.4 Vektorok összeadása
        </h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Két erő összegét szerkesztéssel a{" "}
            <strong>paralelogramma-szabállyal</strong> vagy a vele egyenértékű{" "}
            <strong>láncszabállyal</strong> (nyílfolytonos összefűzés) kapjuk meg:
            a második vektort az első végéhez illesztjük, és az összeg az első
            kezdőpontjától a második végpontjáig mutat. Több vektornál ugyanez
            folytatódik, így alakul ki a <strong>nyílt vektorsokszög</strong>. A
            sorrend közömbös: <M>{"\\underline{a} + \\underline{b} = \\underline{b} + \\underline{a}"}</M>,
            és a háromszög-egyenlőtlenség miatt{" "}
            <M>{"|\\underline{a} + \\underline{b}| \\le |\\underline{a}| + |\\underline{b}|"}</M>.
          </p>
          <p>
            Számításban viszont sosem szerkesztünk: komponensenként adunk össze.
            Ez a modul legfontosabb gyakorlati szabálya.
          </p>
        </div>

        <KepletDoboz
          cimke="Az összeadás komponensenként"
          keplet={
            "\\underline{R} = \\sum \\underline{F}_i \\quad\\Longleftrightarrow\\quad R_x = \\sum F_{ix},\\qquad R_y = \\sum F_{iy}"
          }
        />

        <AbraKeret
          szam={3}
          cim="A két szerkesztési szabály ugyanarra az eredőre vezet."
        >
          <AbraOsszeadas />
        </AbraKeret>

        <Kiemelo tipus="kulcs">
          <p>
            Az eredő nagysága általában <strong>nem</strong> az egyes erők
            nagyságának összege. <M>{"|\\underline{F}_1 + \\underline{F}_2|"}</M>{" "}
            csak akkor egyenlő <M>{"F_1 + F_2"}</M>-vel, ha a két erő pontosan
            egy irányba mutat. Ha ellentétes irányúak, a különbségüket kapod.
          </p>
        </Kiemelo>

        {/* --- 1.5 Erőrendszerek fajtái --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">
          1.5 Erőrendszerek fajtái
        </h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Ritkán vizsgáljuk egyetlen erő hatását. Egy vagy több testre ható erők
            csoportját <strong>erőrendszernek</strong> nevezzük, és közös zárójelben
            soroljuk fel az erőit: <M>{"(\\underline{A}, \\underline{B}, \\underline{F}_1)"}</M>.
            A felsorolás az erők minden tulajdonságát tartalmazza (nagyság, irány,
            támadáspont), a sorrend közömbös, és az erőrendszernek nem kell egy
            testre ható összes erőt tartalmaznia.
          </p>
          <p>
            Az erők elhelyezkedése alapján az erőrendszer <strong>síkbeli</strong>{" "}
            (minden erő egy közös síkban hat) vagy <strong>térbeli</strong>; és
            ettől függetlenül
          </p>
          <ul className="mt-2 ml-5 list-disc space-y-1">
            <li>
              <strong>közös hatásvonalú</strong>, ha minden erő hatásvonala egybeesik;
            </li>
            <li>
              <strong>közös metszéspontú</strong>, ha minden hatásvonal ugyanazon a ponton megy át;
            </li>
            <li>
              <strong>párhuzamos</strong>, ha minden hatásvonal párhuzamos;
            </li>
            <li>
              <strong>általános helyzetű (szétszórt)</strong>, ha a fentiek egyike sem teljesül — akár egyetlen erő miatt sem.
            </li>
          </ul>
          <p>
            A kettő kombinálható: „közös metszéspontú síkbeli”, „párhuzamos
            térbeli” stb. Ebben a modulban a közös metszéspontú erőrendszerekkel
            dolgozunk; a párhuzamos és a szétszórt rendszer eredőjét a{" "}
            <Link href="/nyomatek" className="font-semibold text-naracs-700 underline decoration-naracs-300 underline-offset-2">
              2. modulban
            </Link>{" "}
            számoljuk, mert ahhoz már a forgatónyomaték is kell.
          </p>
        </div>

        <AbraKeret
          szam={4}
          cim="Négyféle erőrendszer ugyanazon a lemezen. A szaggatott vonalak a hatásvonalak."
        >
          <AbraErorendszerFajtai />
        </AbraKeret>

        {/* --- 1.6 Egyenértékűség --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">
          1.6 Egyenértékűség és az egyenértékűségi kijelentés
        </h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Két erőrendszert <strong>egyenértékűnek</strong> nevezünk, ha ugyanarra
            a testre működtetve ugyanolyan és ugyanakkora hatást (gyorsulást,
            szöggyorsulást) hoznának létre — vagyis helyettesíthetők egymással.
            Jele az egyenlőségjel fölé tett pont:
          </p>
        </div>

        <KepletDoboz
          cimke="Egyenértékűségi kijelentés (tankönyv 3.7)"
          keplet={"(\\underline{F}_1, \\underline{F}_2) \\ekv (\\underline{F}_4, \\underline{F}_5, \\underline{F}_6)"}
        />

        <div className="proza text-[15px] leading-relaxed text-petrol-700">
          <p>
            A <M>{"\\ekv"}</M> jel nem a vektorok azonosságát fejezi ki, hanem kötött
            vektorokból álló erőrendszerek <em>azonos hatását</em> — ezért ezt nem
            egyenletnek, hanem <strong>egyenértékűségi kijelentésnek</strong>{" "}
            hívjuk. Egyébként úgy viselkedik, mint egy közönséges egyenlőség:
          </p>
          <ul className="mt-2 ml-5 list-disc space-y-1">
            <li>
              <strong>tranzitív</strong>: ha <M>{"A \\ekv B"}</M> és <M>{"A \\ekv C"}</M>, akkor <M>{"B \\ekv C"}</M>;
            </li>
            <li>
              mindkét oldal <strong>bővíthető ugyanazzal az erővel</strong> (és ugyanaz el is vehető mindkettőből);
            </li>
            <li>
              egy erő <strong>átvihető a másik oldalra ellentett előjellel</strong>: mindkét oldalt kiegészítjük{" "}
              <M>{"-\\underline{B}_3"}</M>-mal, és a jobb oldalon a <M>{"(\\underline{B}_3, -\\underline{B}_3)"}</M> pár zéruserő;
            </li>
            <li>
              egy <strong>egyensúlyi erőrendszer hozzáadása vagy elvétele</strong> nem változtatja meg az eredőt.
            </li>
          </ul>
          <p>
            Azt az egyetlen hatást, amely egyenértékű az erőrendszerrel, az
            erőrendszer <strong>eredőjének</strong> nevezzük (<M>{"\\underline{R}"}</M>, az
            angol <em>resultant</em> után). Mivel egyetlen hatás, a zárójelet elhagyjuk.
            Ha az eredő zéruserő, az erőrendszer <strong>egyensúlyi</strong>:
          </p>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <KepletDoboz cimke="Eredő" keplet={"(\\underline{F}_1, \\underline{F}_2, \\underline{F}_3) \\ekv \\underline{R}"} />
          <KepletDoboz cimke="Egyensúlyi erőrendszer" keplet={"(\\underline{G}_1, \\underline{G}_2, \\underline{G}_3) \\ekv \\underline{O}"} />
        </div>

        <div className="proza text-[15px] leading-relaxed text-petrol-700">
          <p>
            A kijelentéseket elsősorban a <em>feladatok kijelölésére</em> használjuk:
            ha benne minden erőt hiánytalanul felsoroltunk, a belőle írt
            skaláregyenletekből sem marad ki semmi. A cél mindig olyan egyenlet,
            amelyben az ismeretlenek közül csak egy szerepel. Háromféle feladat van:
          </p>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Kartya cimke="1. típus" cim="Helyettesítés">
            <MB>{"(\\underline{F}_1, \\underline{F}_2, \\underline{F}_3) \\ekv \\underline{R}"}</MB>
            <p className="mt-2 text-[13.5px] text-petrol-700">
              Az erőrendszert egyetlen hatással — az eredővel — vagy speciális
              tulajdonságú erőkkel helyettesítjük. Az <strong>ismert</strong> és az{" "}
              <strong>ismeretlen</strong> mennyiségek a két oldalon szétválnak.
            </p>
          </Kartya>
          <Kartya cimke="2. típus" cim="Egyensúlyozás">
            <MB>{"(\\underline{F}_1, \\underline{F}_2, \\underline{C}, \\underline{D}) \\ekv \\underline{O}"}</MB>
            <p className="mt-2 text-[13.5px] text-petrol-700">
              Az ismert erőkhöz olyan erőket keresünk, amelyekkel együtt az eredő
              zéruserő. Ez <strong>egyensúlyi kijelentés</strong>: az ismert és az
              ismeretlen erők <strong>ugyanazon az oldalon</strong> állnak, a jobb
              oldalon <M>{"\\underline{O}"}</M>.
            </p>
          </Kartya>
          <Kartya cimke="3. típus" cim="Kiegészítés">
            <MB>{"(\\underline{A}, \\underline{B}, \\underline{P}) \\ekv \\underline{R}"}</MB>
            <p className="mt-2 text-[13.5px] text-petrol-700">
              A kettő keveréke: úgy adunk hozzá egy speciális <M>{"\\underline{P}"}</M>{" "}
              erőt, hogy az eredő is speciális (pl. vízszintes) legyen. Mindkét
              oldalon van ismeretlen.
            </p>
          </Kartya>
        </div>

        <Kiemelo tipus="definicio" cim="Minden erőrendszer egyensúlyozható (tankönyv 3.5)">
          <p>
            Ha ki tudjuk számítani egy erőrendszer eredőjét,{" "}
            <M>{"(\\underline{F}_1, \\underline{F}_2, \\underline{F}_3) \\ekv \\underline{R}"}</M>, akkor az eredő
            ellentettjének hozzáadásával{" "}
            <M>{"(\\underline{F}_1, \\underline{F}_2, \\underline{F}_3, -\\underline{R}) \\ekv \\underline{O}"}</M>{" "}
            egyensúlyi kijelentést kapunk: <strong>minden erőrendszer egyensúlyozható az eredőjének ellentettjével</strong>.
            A gyakorlatban az egyetlen erő helyett több ismeretlen erővel egyensúlyozunk — ezek is a bal oldalra kerülnek.
          </p>
        </Kiemelo>

        <Kiemelo tipus="kulcs">
          <p>
            <strong>A feladat első sora mindig a kijelentés.</strong> Előbb leírod,
            hogy mi mivel egyenértékű (vagy mi van egyensúlyban), és csak utána jönnek
            a vetületi (később nyomatéki) egyenletek — mindegyik ebből a sorból
            olvasható ki. A kidolgozott feladatokban ezért ez az 1. lépés.
          </p>
        </Kiemelo>

        <div className="mt-6">
          <Alcim>Próbáld ki – a tankönyv 3.2. ábrája lépésenként</Alcim>
          <VektorsokszogEpito />
        </div>

        {/* --- 1.7 Egyensúly --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">
          1.7 Egyensúly és a zéruserő
        </h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Ha egy közös metszéspontú erőrendszer eredője zéruserő, az erőrendszer
            egyensúlyi. Szerkesztésben ez azt jelenti, hogy a vektorsokszög{" "}
            <strong>bezárul</strong>: az utolsó vektor vége pontosan visszaér az
            első kezdőpontjába. Számításban két skalár egyenletet ad síkban, és
            ez a két egyenlet két ismeretlen meghatározására elég.
          </p>
        </div>

        <KepletDoboz
          cimke="Síkbeli egyensúly közös metszéspontú erőkre"
          keplet={"(\\underline{F}_1, \\dots, \\underline{F}_n) \\ekv \\underline{O}\\quad\\Longrightarrow\\quad \\Fx F_{1x} + \\dots + F_{nx} = 0,\\qquad \\Fy F_{1y} + \\dots + F_{ny} = 0"}
        />

        <Kiemelo tipus="definicio" cim="Két tétel, amit tudni kell (tankönyv 3.3.1.1)">
          <ul className="ml-5 list-disc space-y-1.5">
            <li>
              <strong>Két erő</strong> akkor van egyensúlyban, ha <strong>közös a hatásvonaluk</strong>,{" "}
              <strong>azonos a nagyságuk</strong> és <strong>ellentétes az irányuk</strong>.
            </li>
            <li>
              <strong>Három erő</strong> akkor van egyensúlyban, ha <strong>közös metszéspontúak</strong> és{" "}
              <strong>zárt vektorháromszög</strong> szerkeszthető belőlük — ez egyben azt is megköveteli, hogy{" "}
              <strong>egy közös síkban</strong> legyenek.
            </li>
          </ul>
        </Kiemelo>

        <AbraKeret
          szam={5}
          cim="Egyensúly esetén a vektorháromszög zárt: nincs „maradék” vektor."
        >
          <AbraEgyensuly />
        </AbraKeret>

        <div className="proza text-[15px] leading-relaxed text-petrol-700">
          <p>
            <strong>Három módszer.</strong> <em>Szerkesztéssel</em> két ábrát rajzolunk:
            a <em>geometriai ábrán</em> a test méretarányos rajza és a hatásvonalak,
            a <em>vektorábrán</em> az erők nagyságával arányos nyilak — a két ábra
            léptéke más (hossz, ill. erő), az utóbbié az <em>erőlépték</em>; a vektorokat
            a vektorábrában adjuk össze, mert ott szabadon eltolhatók.{" "}
            <em>Számítással</em> a kijelentésből vetületi (később nyomatéki) egyenleteket
            írunk, lehetőleg egy-egy ismeretlennel. A <em>grafoanalitikus</em> út a kettő
            keveréke: vázlat, és abban geometriai összefüggésekből egyenletek.
          </p>
          <p>
            <strong>Miért merőleges tengelyekre?</strong> Elvileg bármely két, nem
            párhuzamos irányba írhatnánk vetületi egyenletet, jobb oldalon{" "}
            <M>{"R\\cos\\alpha_R"}</M>-rel és <M>{"R\\sin\\alpha_R"}</M>-rel — de az
            kétismeretlenes, nemlineáris egyenletrendszer volna. Ha az eredőre a két
            merőleges komponensével gondolunk, és az egyenleteket ezekkel párhuzamosan
            írjuk, a másik komponens mindig kiesik: két egyismeretlenes egyenletet kapunk.
          </p>
        </div>

        <TankonyvJel fejezet="3.3.1.2">
          <p>
            A tankönyv minden vetületi egyenlet elején kiírja az egyenlet jellegét és a
            pozitív irányt: <M>{"\\Fx F_{1x} + F_{2x} + F_{3x} = R_x"}</M>,{" "}
            <M>{"\\Fy F_{1y} + F_{2y} + F_{3y} = R_y"}</M>. Így egy soron következő erő
            komponensénél elég az irányát a nyíllal összevetni az előjelhez — és bármilyen
            szünet után folytatható, mert a sor elején ott áll, mit csinálunk.
          </p>
        </TankonyvJel>

        {/* --- 1.8 Vetítés --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">
          1.8 Vetítés tetszőleges tengelyre
        </h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            A komponens tulajdonképpen vetület: az <M>{"F_x"}</M> nem más, mint
            az erő vetülete az <M>{"x"}</M> tengelyre. Semmi nem köti meg
            azonban, hogy csak a koordinátatengelyekre vetítsünk — bármilyen{" "}
            <M>{"t"}</M> irányra ugyanúgy megtehetjük, és a képlet is ugyanaz
            marad, csak a bezárt szöget kell jól meghatározni.
          </p>
        </div>

        <KepletDoboz
          cimke="Vetület egységvektorral"
          keplet={
            "F_t = F\\cos\\vartheta = \\underline{F}\\cdot\\underline{e}_t = F_x e_{tx} + F_y e_{ty}"
          }
        />

        <div className="proza text-[15px] leading-relaxed text-petrol-700">
          <p>
            Itt <M>{"\\vartheta"}</M> az erő és a tengely által bezárt szög,{" "}
            <M>{"\\underline{e}_t"}</M> pedig a tengely irányába mutató
            egységvektor. Ha a bezárt szög tompaszög, a vetület negatív: az erő
            „hátrafelé” mutat a tengely irányához képest. A vetítés lineáris
            művelet, ezért az egyes vetületek összege mindig megegyezik az eredő
            vetületével — ez kiváló ellenőrzési lehetőség.
          </p>
        </div>

        <div className="mt-6">
          <Alcim>Próbáld ki – forgasd a t tengelyt</Alcim>
          <VetuletFelfedezo />
        </div>

        {/* --- 1.9 Skaláris szorzat --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">
          1.9 Skaláris szorzat
        </h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Két vektor szorzásánál meg kell mondanunk, mi az eredmény jellege. A{" "}
            <strong>skaláris (pont-) szorzat</strong> eredménye egyetlen szám, amely
            a két vektor hosszával és a bezárt szög koszinuszával arányos — és
            ugyanez a komponensekből is kiszámítható:
          </p>
        </div>

        <KepletDoboz
          cimke="Skaláris szorzat kétféleképpen (tankönyv 2.16–2.17)"
          keplet={
            "\\underline{a}\\cdot\\underline{b} = |\\underline{a}|\\,|\\underline{b}|\\cos\\varphi = a_x b_x + a_y b_y\\ (+\\, a_z b_z)"
          }
        />

        <div className="proza text-[15px] leading-relaxed text-petrol-700">
          <p>
            A szorzat felcserélhető (<M>{"\\underline{a}\\cdot\\underline{b} = \\underline{b}\\cdot\\underline{a}"}</M>),
            és mivel a bezárt szög 0° és 180° között van, az előjel csak a szögtől függ.
            A tankönyv hat speciális esete:
          </p>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Egységvektorral", "\\underline{a}\\cdot\\underline{e} = |\\underline{a}|\\cos\\varphi", "a másik vektor egységvektor irányú vetülete"],
            ["Önmagával", "\\underline{a}\\cdot\\underline{a} = |\\underline{a}|^2", "a hossz négyzete"],
            ["Nullvektorral", "\\underline{a}\\cdot\\underline{0} = 0", "mindig nulla"],
            ["Merőlegesek", "\\underline{a}\\perp\\underline{b}\\ \\Rightarrow\\ \\underline{a}\\cdot\\underline{b} = 0", "cos 90° = 0"],
            ["Azonos irány", "\\underline{a}\\cdot\\underline{b} = +|\\underline{a}||\\underline{b}|", "φ = 0°, pozitív"],
            ["Ellentétes irány", "\\underline{a}\\cdot\\underline{b} = -|\\underline{a}||\\underline{b}|", "φ = 180°, negatív"],
          ].map(([cim, k, mag]) => (
            <div key={cim} className="rounded-xl border border-petrol-200 bg-white px-3.5 py-3">
              <p className="text-[10.5px] font-bold tracking-[0.14em] text-petrol-500 uppercase">{cim}</p>
              <div className="szamok mt-1 text-[13.5px]">
                <MB>{k}</MB>
              </div>
              <p className="text-[12.5px] text-petrol-500">{mag}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Kartya cimke="Alkalmazás" cim="Hossz">
            <MB>{"|\\underline{a}| = \\sqrt{\\underline{a}\\cdot\\underline{a}} = \\sqrt{a_x^2 + a_y^2 + a_z^2}"}</MB>
          </Kartya>
          <Kartya cimke="Alkalmazás" cim="Két vektor szöge">
            <MB>{"\\cos\\varphi = \\frac{\\underline{a}\\cdot\\underline{b}}{|\\underline{a}|\\,|\\underline{b}|} = \\frac{a_x b_x + a_y b_y + a_z b_z}{|\\underline{a}|\\,|\\underline{b}|}"}</MB>
          </Kartya>
        </div>

        <div className="mt-6">
          <Alcim>Próbáld ki – a szorzat előjele és a vetület</Alcim>
          <SkalarisSzorzatFelfedezo />
        </div>

        {/* --- 1.10 Térbeli --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">
          1.10 Térbeli vektorok
        </h3>
        <KetOszlop>
          <div>
            <div className="proza text-[15px] leading-relaxed text-petrol-700">
              <p>
                Térben semmi új nem történik, csak egy harmadik komponens is
                megjelenik. Az összeadás továbbra is komponensenként zajlik, a
                hosszt a térbeli Pitagorasz-tétel adja, az irányt pedig a
                tengelyekkel bezárt szögek — az úgynevezett iránykoszinuszok —
                írják le. A három szög nem független: a nagyság és a három szög
                négy adat volna, de köztük egy összefüggés van.
              </p>
            </div>
            <MB>{"|\\underline{F}| = \\sqrt{F_x^2 + F_y^2 + F_z^2}"}</MB>
            <MB>
              {"\\cos\\alpha_x = \\frac{F_x}{|\\underline{F}|},\\quad \\cos\\alpha_y = \\frac{F_y}{|\\underline{F}|},\\quad \\cos\\alpha_z = \\frac{F_z}{|\\underline{F}|}"}
            </MB>
            <MB>{"\\cos^2\\alpha_x + \\cos^2\\alpha_y + \\cos^2\\alpha_z = 1\\quad(\\text{ellenőrzés})"}</MB>
            <p className="mt-2 text-[13.5px] text-petrol-600">
              Térbeli közös metszéspontú erőrendszer eredőjét három vetületi
              egyenlettel számoljuk: <M>{"\\Fx \\dots = R_x"}</M>,{" "}
              <M>{"\\Fy \\dots = R_y"}</M>, <M>{"\\Fz \\dots = R_z"}</M>.
            </p>
          </div>
          <AbraKeret
            szam={6}
            cim="Térbeli erő és három komponense."
          >
            <AbraTerbeliVektor />
          </AbraKeret>
        </KetOszlop>

        {/* --- 1.11 Vektoriális szorzat --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">
          1.11 Vektoriális szorzat
        </h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            A <strong>vektoriális (kereszt-) szorzat</strong> eredménye vektor:{" "}
            <M>{"\\underline{a}\\times\\underline{b}"}</M> merőleges mindkét vektorra
            (a síkjukra), nagysága a két vektor által kifeszített paralelogramma
            területe, <M>{"|\\underline{a}||\\underline{b}|\\sin\\varphi"}</M>, irányítását
            a <strong>jobbkéz-szabály</strong> adja. A sorrend számít:{" "}
            <M>{"\\underline{a}\\times\\underline{b} = -\\underline{b}\\times\\underline{a}"}</M>.
            Párhuzamos vektorok szorzata nullvektor (a paralelogramma elfajul), és
            a nullvektorral vett szorzat is nullvektor. A 2. modulban ez adja a
            nyomatékot: <M>{"\\underline{M}_P = \\underline{r}\\times\\underline{F}"}</M>.
          </p>
        </div>

        <KepletDoboz
          cimke="Az egységvektorok szorzatai"
          keplet={
            "\\underline{i}\\times\\underline{j} = \\underline{k},\\quad \\underline{j}\\times\\underline{k} = \\underline{i},\\quad \\underline{k}\\times\\underline{i} = \\underline{j},\\qquad \\underline{i}\\times\\underline{i} = \\underline{j}\\times\\underline{j} = \\underline{k}\\times\\underline{k} = \\underline{0}"
          }
          behelyettesitve={"\\underline{j}\\times\\underline{i} = -\\underline{k},\\quad \\underline{k}\\times\\underline{j} = -\\underline{i},\\quad \\underline{i}\\times\\underline{k} = -\\underline{j}"}
        />

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <KepletDoboz
            cimke="Komponensekkel (tankönyv 2.20)"
            keplet={
              "\\underline{a}\\times\\underline{b} = \\begin{bmatrix} a_y b_z - a_z b_y \\\\ a_z b_x - a_x b_z \\\\ a_x b_y - a_y b_x \\end{bmatrix}"
            }
          />
          <KepletDoboz
            cimke="Determinánsos kifejtés (tankönyv 2.21)"
            keplet={
              "\\underline{a}\\times\\underline{b} = \\begin{vmatrix} \\underline{i} & \\underline{j} & \\underline{k} \\\\ a_x & a_y & a_z \\\\ b_x & b_y & b_z \\end{vmatrix}"
            }
          />
        </div>

        <div className="proza text-[15px] leading-relaxed text-petrol-700">
          <p>
            A determinánst úgy fejtjük ki, hogy az első sor elemeit pozitív előjellel
            szorozzuk a tőlük <strong>jobbra-lefelé</strong>, negatív előjellel a{" "}
            <strong>balra-lefelé</strong> lépve elérhető elemekkel — a szélén a másik
            oldalon folytatva. Nézd végig lépésenként:
          </p>
        </div>

        <div className="mt-4">
          <Alcim>Nézd végig – a determináns hat átlója</Alcim>
          <DeterminansAnimacio />
        </div>

        <Kiemelo tipus="tipp" cim="Térben is látható">
          <p>
            A 2. modulban a{" "}
            <Link href="/nyomatek#peldak" className="font-semibold text-naracs-700 underline decoration-naracs-300 underline-offset-2">
              Film3DVektorSzorzat
            </Link>{" "}
            forgatható jelenete mutatja, hogyan áll merőlegesen a szorzat a két vektor
            síkjára, és mekkora a paralelogramma. Ott a szorzat már a nyomaték lesz.
          </p>
        </Kiemelo>

        {/* --- Terminológia --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">
          Szótár: ahogy itt mondjuk, és ahogy a tankönyv
        </h3>
        <Szotar
          sorok={[
            { itt: <>irányszög (<M>{"\\alpha"}</M>)</>, konyv: <>hajlásszög</>, megjegyzes: "A tengellyel bezárt szög; a tankönyv térben α, β, γ-t ír." },
            { itt: <>zérusvektor, <M>{"\\underline{0}"}</M></>, konyv: <>nullvektor; erőrendszernél zéruserő, <M>{"\\underline{O}"}</M></>, megjegyzes: "Ugyanaz: 0 hosszúságú vektor." },
            { itt: <>lánc-szabály, „tip-to-tail”</>, konyv: <>nyílfolytonos összefűzés, nyílt vektorsokszög</>, megjegyzes: "Zárt vektorsokszög = egyensúly." },
            { itt: <>bezárt szög <M>{"\\vartheta"}</M> (vetítésnél)</>, konyv: <><M>{"\\varphi_{ab}"}</M> (skaláris szorzatnál)</>, megjegyzes: "Mindig 0° és 180° közötti." },
            { itt: <>a komponensek összege = eredő</>, konyv: <><M>{"(\\underline{F}_1, \\underline{F}_2) \\ekv \\underline{R}"}</M>, majd <M>{"\\Fx"}</M>, <M>{"\\Fy"}</M></>, megjegyzes: "Előbb a kijelentés, aztán a vetületi egyenletek." },
            { itt: <>egységvektor <M>{"\\underline{e}"}</M></>, konyv: <><M>{"\\underline{e}"}</M>; tengelyirányban <M>{"\\underline{i}, \\underline{j}, \\underline{k}"}</M></>, megjegyzes: "Hossza 1." },
          ]}
        />
      </Szakasz>

      {/* ==================== KIDOLGOZOTT FELADATOK ==================== */}
      <Szakasz
        id="peldak"
        cimke="2. rész"
        cim="Kidolgozott feladatok"
        bevezeto="A gyakorlat három feladata, lépésenként, a tankönyv írásmódjával: az első lépés mindig a kijelentés. Először mindig próbáld meg magad — a lépések csak akkor érnek valamit, ha van mihez hasonlítanod."
        className="bg-white"
      >
        {/* ---- GYF-1 ---- */}
        <KidolgozottFeladat
          jel="GYF‑1"
          ido="1 perc"
          forras="A1. gyakorlat"
          cim="Három térbeli vektor összege"
          feladat={
            <>
              <p>Határozd meg az alábbi három vektor összegét!</p>
              <MB>
                {
                  "\\underline{F}_1 = \\begin{bmatrix} 5 \\\\ 2 \\\\ 6 \\end{bmatrix}\\ \\text{kN},\\quad \\underline{F}_2 = \\begin{bmatrix} -3 \\\\ 4 \\\\ -9 \\end{bmatrix}\\ \\text{kN},\\quad \\underline{F}_3 = \\begin{bmatrix} 8 \\\\ 11 \\\\ -10 \\end{bmatrix}\\ \\text{kN}"
                }
              </MB>
            </>
          }
          tanulsag={
            <p>
              A vektorösszeadás komponensenként történik — se szög, se
              szögfüggvény nem kell hozzá. Amikor egy feladat komponensekkel adja
              meg az erőket, az mindig az egyszerűbb eset. A három vetületi egyenlet
              a kijelentés három „lenyomata”: sorra ugyanazok az erők állnak bennük,
              mint a zárójelben.
            </p>
          }
        >
          <Lepes cim="Egyenértékűségi kijelentés">
            <p>
              A három erőt egyetlen hatással, az eredővel helyettesítjük
              (helyettesítési feladat: az ismertek a bal, az ismeretlen a jobb oldalon):
            </p>
            <MB>{"(\\underline{F}_1, \\underline{F}_2, \\underline{F}_3) \\ekv \\underline{R}"}</MB>
          </Lepes>

          <Lepes cim="Vetületi egyenletek — komponensenként összeadunk">
            <p>
              A kijelentésből három vetületi egyenlet írható, az eredő megfelelő
              komponense mindig a jobb oldalon. Érdemes egymás alá írni őket, hogy ne
              csússzon el semmi.
            </p>
            <MB>{"\\Fx 5 - 3 + 8 = R_x \\;\\Rightarrow\\; R_x = 10\\ \\text{kN}"}</MB>
            <MB>{"\\Fy 2 + 4 + 11 = R_y \\;\\Rightarrow\\; R_y = 17\\ \\text{kN}"}</MB>
            <MB>{"\\Fz 6 - 9 - 10 = R_z \\;\\Rightarrow\\; R_z = -13\\ \\text{kN}"}</MB>
          </Lepes>

          <Lepes cim="Az eredmény">
            <MB>
              {
                "\\underline{R} = \\begin{bmatrix} 10 \\\\ 17 \\\\ -13 \\end{bmatrix}\\ \\text{kN}"
              }
            </MB>
            <p>
              A harmadik komponens negatív: az eredő a <M>{"z"}</M> tengely
              irányával ellentétesen mutat.
            </p>
          </Lepes>

          <Lepes cim="Kiegészítés: az eredő nagysága">
            <p>
              A feladat ezt nem kérdezi, de egy lépéssel megkapható, és a
              zárthelyin gyakran kérik:
            </p>
            <MB>
              {
                "|\\underline{R}| = \\sqrt{10^2 + 17^2 + (-13)^2} = \\sqrt{558} = 23,62\\ \\text{kN}"
              }
            </MB>
          </Lepes>
        </KidolgozottFeladat>

        {/* ---- GYF-2 ---- */}
        <div className="my-8">
          <Alcim>Ugyanez 3D-ben – forgatható jelenet</Alcim>
          <Film3DTerbeliOsszeg />
        </div>

        <KidolgozottFeladat
          jel="GYF‑2"
          ido="8 perc"
          forras="A1. gyakorlat"
          cim="Négy erő: komponensek, összeg és vetületek"
          feladat={
            <>
              <p>
                Az ábrán négy erő látható:{" "}
                <M>{"F_1 = 5\\ \\text{N}"}</M>, <M>{"F_2 = 6\\ \\text{N}"}</M>,{" "}
                <M>{"F_3 = 8\\ \\text{N}"}</M>, <M>{"F_4 = 4\\ \\text{N}"}</M>.
              </p>
              <p className="mt-2">
                <strong>a)</strong> Írd fel a négy vektor elemeit!{" "}
                <strong>b)</strong> Határozd meg a négy vektor összegét!{" "}
                <strong>c)</strong> Határozd meg a négy vektor vetületét a{" "}
                <M>{"t"}</M> tengelyre!
              </p>
            </>
          }
          abra={
            <AbraKeret cim="A feladat ábrája: négy erő és a ferde t tengely.">
              <AbraGyf2 />
            </AbraKeret>
          }
          tanulsag={
            <p>
              A vetületek összege <M>{"-14,16\\ \\text{N}"}</M>, és pontosan
              ennyi az eredő vetülete is:{" "}
              <M>
                {"R_t = 13,211\\cos 125^\\circ + (-8,036)\\sin 125^\\circ = -14,16\\ \\text{N}"}
              </M>
              . Ez nem véletlen, hanem a vetítés linearitásának következménye —
              és ingyenes ellenőrzés minden ilyen feladatban.
            </p>
          }
        >
          <Lepes cim="Egyenértékűségi kijelentés">
            <p>
              A négy erő közös metszéspontú; az eredő átmegy a közös ponton, csak a
              nagyságát és irányát keressük:
            </p>
            <MB>{"(\\underline{F}_1, \\underline{F}_2, \\underline{F}_3, \\underline{F}_4) \\ekv \\underline{R}"}</MB>
          </Lepes>

          <Lepes cim="a) Az F₁ komponensei — a szöget az x tengelytől mértük">
            <p>
              Itt a megszokott eset áll fenn, a <M>{"40^\\circ"}</M> az{" "}
              <M>{"x"}</M> tengelytől indul, tehát a vízszinteshez koszinusz
              tartozik.
            </p>
            <MB>
              {
                "\\underline{F}_1 = \\begin{bmatrix} F_1\\cos 40^\\circ \\\\ F_1\\sin 40^\\circ \\end{bmatrix} = \\begin{bmatrix} 3,830 \\\\ 3,214 \\end{bmatrix}\\ \\text{N}"
              }
            </MB>
          </Lepes>

          <Lepes cim="a) F₂ és F₄ — a tengelyek mentén">
            <p>
              Ez a két erő tengelyirányú, ezért nem kell szögfüggvény. Az{" "}
              <M>{"F_2"}</M> a pozitív <M>{"x"}</M> irányba, az{" "}
              <M>{"F_4"}</M> a negatív <M>{"y"}</M> irányba mutat.
            </p>
            <MB>
              {
                "\\underline{F}_2 = \\begin{bmatrix} 6 \\\\ 0 \\end{bmatrix}\\ \\text{N},\\qquad \\underline{F}_4 = \\begin{bmatrix} 0 \\\\ -4 \\end{bmatrix}\\ \\text{N}"
              }
            </MB>
          </Lepes>

          <Lepes cim="a) Az F₃ komponensei — itt cserélődik fel a szinusz és a koszinusz">
            <p>
              Az <M>{"F_3"}</M> szögét a rajz a függőlegestől méri
              (<M>{"25^\\circ"}</M> a negatív <M>{"y"}</M> tengelytől), ezért a
              vízszintes komponenshez szinusz, a függőlegeshez koszinusz jár. Az
              erő lefelé mutat, tehát a <M>{"y"}</M> komponens negatív.
            </p>
            <MB>
              {
                "\\underline{F}_3 = \\begin{bmatrix} F_3\\sin 25^\\circ \\\\ -F_3\\cos 25^\\circ \\end{bmatrix} = \\begin{bmatrix} 3,381 \\\\ -7,250 \\end{bmatrix}\\ \\text{N}"
              }
            </MB>
          </Lepes>

          <Lepes cim="b) Vetületi egyenletek a kijelentésből">
            <p>
              A kijelentés bal oldalának erői sorban, a jobb oldalon az eredő
              komponense. A sor elején a nyíl a pozitív irány — ehhez képest kapják
              az előjelüket a tagok:
            </p>
            <MB>{"\\Fx 3,830 + 6 + 3,381 + 0 = R_x \\;\\Rightarrow\\; R_x = 13,211\\ \\text{N}"}</MB>
            <MB>{"\\Fy 3,214 + 0 - 7,250 - 4 = R_y \\;\\Rightarrow\\; R_y = -8,036\\ \\text{N}"}</MB>
            <MB>
              {
                "\\underline{R} = \\begin{bmatrix} 13,211 \\\\ -8,036 \\end{bmatrix}\\ \\text{N},\\qquad |\\underline{R}| = \\sqrt{13,211^2 + 8,036^2} = 15,46\\ \\text{N}"
              }
            </MB>
          </Lepes>

          <Lepes cim="c) A t tengellyel bezárt szögek">
            <p>
              A <M>{"t"}</M> tengely az <M>{"x"}</M> tengellyel{" "}
              <M>{"55^\\circ"}</M>-ot zár be a második síknegyed felé, vagyis az
              iránya <M>{"125^\\circ"}</M>. Minden erőnél azt kell megnézni,
              mekkora szöget zár be ezzel az iránnyal:
            </p>
            <MB>
              {
                "\\vartheta_1 = 85^\\circ,\\quad \\vartheta_2 = 125^\\circ,\\quad \\vartheta_3 = 170^\\circ,\\quad \\vartheta_4 = 145^\\circ"
              }
            </MB>
          </Lepes>

          <Lepes cim="c) A vetületek">
            <p>
              A vetület mindegyik esetben <M>{"F_t = F\\cos\\vartheta"}</M>. A
              tompaszögekhez negatív vetület tartozik:
            </p>
            <MB>{"F_{1t} = 5\\cos 85^\\circ = 0,4358\\ \\text{N}"}</MB>
            <MB>{"F_{2t} = 6\\cos 125^\\circ = -3,441\\ \\text{N}"}</MB>
            <MB>{"F_{3t} = 8\\cos 170^\\circ = -7,878\\ \\text{N}"}</MB>
            <MB>{"F_{4t} = 4\\cos 145^\\circ = -3,277\\ \\text{N}"}</MB>
            <p>
              Csak az <M>{"F_1"}</M> vetülete pozitív, a többi erő a{" "}
              <M>{"t"}</M> tengely irányával ellentétes értelemben vetül.
            </p>
          </Lepes>
        </KidolgozottFeladat>

        {/* ---- GYF-3 ---- */}
        <div className="my-8">
          <Alcim>Ugyanez filmen – nézd végig, hogyan áll össze az eredő</Alcim>
          <FilmGyf2 />
        </div>

        <KidolgozottFeladat
          jel="GYF‑3"
          ido="5 perc"
          forras="A1. gyakorlat"
          cim="A hiányzó erő egyensúly esetén"
          feladat={
            <>
              <p>
                Az ábrán látható három vektor összege zérusvektor. Az{" "}
                <M>{"\\underline{F}_1"}</M> és <M>{"\\underline{F}_2"}</M>{" "}
                vektorok nagysága egyaránt <M>{"150\\ \\text{N}"}</M>.
              </p>
              <p className="mt-2">
                Számítsd ki az <M>{"\\underline{F}_3"}</M> vektor elemeit, a
                vektor nagyságát és irányát!
              </p>
            </>
          }
          abra={
            <AbraKeret cim="A feladat ábrája: két ismert és egy ismeretlen erő.">
              <AbraGyf3 />
            </AbraKeret>
          }
          tanulsag={
            <p>
              Ez <strong>egyensúlyozási feladat</strong>: az ismeretlen{" "}
              <M>{"\\underline{F}_3"}</M> ugyanazon az oldalon áll, mint az ismertek,
              a jobb oldalon a zéruserő. Ezért a vetületi egyenletekben az ismeretlen
              komponens a bal oldalon szerepel, pozitív előjellel — és az eredményt
              az ismertek összegének <em>ellentettjeként</em> kapjuk. A nagyság és az
              irány csak ezután jön; az irányszögnél mindig nézd meg az ábrán, melyik
              síknegyedbe esik az eredmény.
            </p>
          }
        >
          <Lepes cim="Egyensúlyi kijelentés">
            <p>
              A három erő egyensúlyi erőrendszert alkot, eredőjük zéruserő. Az
              ismeretlen erő is a bal oldalra kerül:
            </p>
            <MB>{"(\\underline{F}_1, \\underline{F}_2, \\underline{F}_3) \\ekv \\underline{O}"}</MB>
          </Lepes>

          <Lepes cim="Az F₁ komponensei">
            <p>
              Az <M>{"F_1"}</M> a második síknegyedbe mutat, a szögét a negatív{" "}
              <M>{"x"}</M> iránytól mértük <M>{"55^\\circ"}</M>-nak. A
              vízszintes komponens ezért negatív:
            </p>
            <MB>
              {
                "\\underline{F}_1 = \\begin{bmatrix} -F_1\\cos 55^\\circ \\\\ F_1\\sin 55^\\circ \\end{bmatrix} = \\begin{bmatrix} -86,04 \\\\ 122,87 \\end{bmatrix}\\ \\text{N}"
              }
            </MB>
          </Lepes>

          <Lepes cim="Az F₂ komponensei">
            <p>
              Az <M>{"F_2"}</M> a negyedik síknegyedbe mutat, a szögét a
              függőlegestől mértük, tehát itt is felcserélődik a két
              szögfüggvény:
            </p>
            <MB>
              {
                "\\underline{F}_2 = \\begin{bmatrix} F_2\\sin 25^\\circ \\\\ -F_2\\cos 25^\\circ \\end{bmatrix} = \\begin{bmatrix} 63,39 \\\\ -135,95 \\end{bmatrix}\\ \\text{N}"
              }
            </MB>
          </Lepes>

          <Lepes cim="Vetületi egyenletek az egyensúlyi kijelentésből">
            <p>
              Mindkét irányban a három erő komponensének összege nulla; az
              ismeretlen komponens a bal oldalon marad:
            </p>
            <MB>{"\\Fx -86,04 + 63,39 + F_{3x} = 0 \\;\\Rightarrow\\; F_{3x} = 22,65\\ \\text{N}"}</MB>
            <MB>{"\\Fy 122,87 - 135,95 + F_{3y} = 0 \\;\\Rightarrow\\; F_{3y} = 13,08\\ \\text{N}"}</MB>
            <p className="mt-1 text-[13px] text-petrol-500">
              A függőleges egyenletben két közel egyforma szám különbsége áll, ezért itt egy jeggyel többet vittünk tovább
              (122,87 és 135,95): négy értékes jeggyel 122,9 − 135,9 = 13,0 jönne ki, ami fél százalékkal pontatlan.
            </p>
          </Lepes>

          <Lepes cim="Az F₃ komponensei">
            <p>
              A harmadik erő komponensei éppen az első kettő összegének
              ellentettjei — az egyensúlyozó erő az eredő ellentettje:
            </p>
            <MB>
              {
                "\\underline{F}_3 = -(\\underline{F}_1 + \\underline{F}_2) = \\begin{bmatrix} 22,65 \\\\ 13,08 \\end{bmatrix}\\ \\text{N}"
              }
            </MB>
          </Lepes>

          <Lepes cim="Nagyság és irány">
            <p>
              Mindkét komponens pozitív, tehát az <M>{"F_3"}</M> az első
              síknegyedbe mutat, és az arctg értéke közvetlenül használható:
            </p>
            <MB>
              {
                "|\\underline{F}_3| = \\sqrt{22,65^2 + 13,08^2} = 26,16\\ \\text{N}"
              }
            </MB>
            <MB>
              {
                "\\alpha = \\operatorname{arctg}\\frac{13,08}{22,65} = 30,0^\\circ"
              }
            </MB>
          </Lepes>
        </KidolgozottFeladat>
        <div className="my-8">
          <Alcim>Ugyanez filmen – a vektorsokszög bezárul</Alcim>
          <FilmGyf3 />
        </div>

      </Szakasz>

      {/* ==================== KALKULÁTOROK ==================== */}
      <Szakasz
        id="kalkulator"
        cimke="3. rész"
        cim="Kalkulátorok"
        bevezeto="Ugyanazok a számítások tetszőleges adatokkal. Használd a házi feladat ellenőrzésére, vagy arra, hogy ráérezz, mi hogyan változik."
      >
        <div className="space-y-8">
          <div>
            <h3 className="mb-2 text-[16px] font-semibold text-petrol-900">
              Síkbeli erőrendszer eredője
            </h3>
            <p className="mb-3 text-[14px] text-petrol-600">
              Legfeljebb négy erő, nagysággal és irányszöggel megadva. A nyilak
              végét húzni is lehet, és a láncszabály kapcsolóval megnézheted a
              vektorsokszöget is.
            </p>
            <VektorOsszegzo />
          </div>

          <div>
            <h3 className="mb-2 text-[16px] font-semibold text-petrol-900">
              Térbeli vektorok összege
            </h3>
            <p className="mb-3 text-[14px] text-petrol-600">
              Komponensekkel megadott vektorok összege, az eredő hossza és a
              tengelyekkel bezárt szögei. Alaphelyzetben a GYF‑1 adatai vannak
              betöltve.
            </p>
            <TerbeliVektorKalk />
          </div>
        </div>

        <Kiemelo tipus="tipp" cim="Mire használd a kalkulátort">
          <p>
            Arra, hogy <em>ellenőrizz</em>, ne arra, hogy helyetted számoljon. A
            zárthelyin nem lesz nálad — a kalkulátor akkor ér valamit, ha előbb
            papíron megcsinálod a feladatot, és utána nézed meg, egyezik-e.
          </p>
        </Kiemelo>
      </Szakasz>

      {/* ==================== GYAKORLÁS ==================== */}
      <Szakasz
        id="gyakorlas"
        cimke="4. rész"
        cim="Gyakorlás"
        bevezeto="Minden feladat új számokkal generálódik, az „új feladat” gombbal pedig végtelen sokat kaphatsz. A megoldást csak akkor nézd meg, ha már próbálkoztál."
        className="bg-white"
      >
        <Alcim>Előbb játssz – a szemed is tanuljon</Alcim>
        <JatekEgyensuly />
        <p className="mt-8 mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Aztán az ötlet – fogalmi kvíz</p>
        <Kviz cim="Érted, vagy csak számolod?" leiras="Tizenkét kérdés a modul tipikus félreértéseiről. Minden válasz után rövid magyarázat." kerdesek={KVIZ} />
        <p className="mt-8 mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Hibakereső – találd meg a hibát</p>
        <Hibakereso feladatok={HIBAK} />
        <p className="mt-8 mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Számolós gyakorlás</p>
        <GyakorloSzekcio />

        <Kiemelo tipus="kulcs" cim="Mikor mehetsz tovább">
          <p>
            Akkor vagy készen ezzel a modullal, ha a komponensekre bontást és az
            eredő számítását öt feladatból ötször hibátlanul megcsinálod — és ami
            fontosabb: az előjelek is automatikusan jönnek, nem kell
            gondolkodnod rajtuk. És ha minden feladatot a kijelentéssel kezdesz.
            A következő modulban ugyanezeket a lépéseket fogod használni, csak már
            a nyomatékkal együtt.
          </p>
        </Kiemelo>
      </Szakasz>
    </>
  );
}
