import { ModulFejlec, SzakaszSav } from "@/components/ModulKeret";
import {
  Szakasz,
  Kartya,
  Kiemelo,
  AbraKeret,
  KetOszlop,
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
} from "@/components/abrak/StatikusAbrak";
import { AbraGyf2, AbraGyf3 } from "@/components/abrak/FeladatAbrak";
import GyakorloSzekcio from "@/components/vektorok/GyakorloSzekcio";
import FilmGyf2 from "@/components/vektorok/FilmGyf2";
import { modulSlugAlapjan } from "@/lib/oldalterkep";

export const metadata = {
  title: "Vektorok, erők megadása",
  description:
    "Erő megadása komponensekkel, vektorok összeadása, vetítés ferde tengelyre és egyensúly — interaktív ábrákkal, kidolgozott feladatokkal és gyakorlással.",
};

const modul = modulSlugAlapjan("/vektorok");

export default function VektorokOldal() {
  return (
    <>
      <ModulFejlec
        szam={1}
        cim="Vektorok, erők megadása"
        leiras="Minden statikai számítás itt kezdődik: hogyan írunk le egy erőt számokkal, hogyan adunk össze erőket, és mit jelent az, hogy egy test egyensúlyban van."
        tartalom={[
          "Komponensekre bontás",
          "Vektorok összeadása",
          "Vetítés ferde tengelyre",
          "Egyensúly, zérusvektor",
          "Térbeli vektorok",
        ]}
      />
      <SzakaszSav szakaszok={modul.szakaszok} />

      {/* ==================== ELMÉLET ==================== */}
      <Szakasz
        id="elmelet"
        cimke="1. rész"
        cim="Elmélet"
        bevezeto="Öt gondolat, amiből az egész modul áll. Az ábrákat próbáld ki: a mozgatható ábrák többet tanítanak, mint tíz sor magyarázat."
      >
        {/* --- 1.1 Az erő --- */}
        <h3 className="mt-2 text-xl font-semibold text-petrol-900">
          1.1 Mi az erő, és mivel adjuk meg?
        </h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Az erő a testek kölcsönhatásának mértéke, és vektormennyiség: nem
            elég megmondani, hogy mekkora, azt is tudni kell, merre hat és hol
            támad. Egy erőt négy adat jellemez: a <strong>támadáspont</strong>,
            a <strong>hatásvonal</strong> (az az egyenes, amelyen az erő
            működik), a <strong>nagyság</strong> és az{" "}
            <strong>irány</strong> a hatásvonalon belül.
          </p>
          <p>
            Merev testek statikájában az erő a saját hatásvonala mentén szabadon
            eltolható anélkül, hogy a test egyensúlya megváltozna. Ez a
            látszólag apró megállapítás teszi lehetővé, hogy erőrendszereket
            egyszerűbb, egyenértékű rendszerekkel helyettesítsünk — erre épül az
            egész következő modul.
          </p>
        </div>

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
            <strong>nagyságával és az irányszögével</strong>, vagy a{" "}
            <strong>két komponensével</strong>. A kettő ugyanazt az információt
            hordozza, csak más alakban — és a számoláshoz szinte mindig a
            komponenses alak a kényelmesebb, mert komponenseket egyszerűen össze
            lehet adni.
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
          <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">
            Próbáld ki
          </p>
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
            mellett.
          </p>
        </Kiemelo>

        <AbraKeret
          szam={2}
          cim="Ugyanaz az erő, kétféleképpen megadott szöggel. A képlet nem ugyanaz."
        >
          <AbraSzogCsapda />
        </AbraKeret>

        {/* --- 1.3 Összeadás --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">
          1.3 Vektorok összeadása
        </h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Két erő összegét szerkesztéssel a{" "}
            <strong>paralelogramma-szabállyal</strong> vagy a vele egyenértékű{" "}
            <strong>láncszabállyal</strong> kapjuk meg: a második vektort az
            első végéhez illesztjük, és az összeg az első kezdőpontjától a
            második végpontjáig mutat. Több vektornál ugyanez folytatódik, így
            alakul ki a vektorsokszög.
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

        {/* --- 1.4 Egyensúly --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">
          1.4 Egyensúly és a zérusvektor
        </h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Ha egy közös metszéspontú erőrendszer eredője zérus, az erőrendszer
            egyensúlyi. Szerkesztésben ez azt jelenti, hogy a vektorsokszög{" "}
            <strong>bezárul</strong>: az utolsó vektor vége pontosan visszaér az
            első kezdőpontjába. Számításban két skalár egyenletet ad síkban, és
            ez a két egyenlet két ismeretlen meghatározására elég.
          </p>
        </div>

        <KepletDoboz
          cimke="Síkbeli egyensúly közös metszéspontú erőkre"
          keplet={"\\sum F_{ix} = 0 \\qquad\\text{és}\\qquad \\sum F_{iy} = 0"}
        />

        <AbraKeret
          szam={4}
          cim="Egyensúly esetén a vektorháromszög zárt: nincs „maradék” vektor."
        >
          <AbraEgyensuly />
        </AbraKeret>

        {/* --- 1.5 Vetítés --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">
          1.5 Vetítés tetszőleges tengelyre
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
          cimke="Vetület és skaláris szorzat"
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
          <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">
            Próbáld ki – forgasd a t tengelyt
          </p>
          <VetuletFelfedezo />
        </div>

        {/* --- 1.6 Térbeli --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">
          1.6 Térbeli vektorok
        </h3>
        <KetOszlop>
          <div>
            <div className="proza text-[15px] leading-relaxed text-petrol-700">
              <p>
                Térben semmi új nem történik, csak egy harmadik komponens is
                megjelenik. Az összeadás továbbra is komponensenként zajlik, a
                hosszt a térbeli Pitagorasz-tétel adja, az irányt pedig a
                tengelyekkel bezárt szögek — az úgynevezett iránykoszinuszok —
                írják le.
              </p>
            </div>
            <MB>{"|\\underline{F}| = \\sqrt{F_x^2 + F_y^2 + F_z^2}"}</MB>
            <MB>
              {"\\cos\\alpha_x = \\frac{F_x}{|\\underline{F}|},\\quad \\cos\\alpha_y = \\frac{F_y}{|\\underline{F}|},\\quad \\cos\\alpha_z = \\frac{F_z}{|\\underline{F}|}"}
            </MB>
          </div>
          <AbraKeret
            szam={5}
            cim="Térbeli erő és három komponense."
          >
            <AbraTerbeliVektor />
          </AbraKeret>
        </KetOszlop>
      </Szakasz>

      {/* ==================== KIDOLGOZOTT FELADATOK ==================== */}
      <Szakasz
        id="peldak"
        cimke="2. rész"
        cim="Kidolgozott feladatok"
        bevezeto="A gyakorlat három feladata, lépésenként. Először mindig próbáld meg magad — a lépések csak akkor érnek valamit, ha van mihez hasonlítanod."
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
              meg az erőket, az mindig az egyszerűbb eset.
            </p>
          }
        >
          <Lepes cim="Komponensenként összeadunk">
            <p>
              A három vektor összegének minden komponense a megfelelő
              komponensek összege. Érdemes egymás alá írni őket, hogy ne
              csússzon el semmi.
            </p>
            <MB>
              {
                "\\underline{F}_1 + \\underline{F}_2 + \\underline{F}_3 = \\begin{bmatrix} 5 + (-3) + 8 \\\\ 2 + 4 + 11 \\\\ 6 + (-9) + (-10) \\end{bmatrix}"
              }
            </MB>
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
                "|\\underline{R}| = \\sqrt{10^2 + 17^2 + (-13)^2} = \\sqrt{558} = 23{,}62\\ \\text{kN}"
              }
            </MB>
          </Lepes>
        </KidolgozottFeladat>

        {/* ---- GYF-2 ---- */}
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
              A vetületek összege <M>{"-14{,}16\\ \\text{N}"}</M>, és pontosan
              ennyi az eredő vetülete is:{" "}
              <M>
                {"R_t = 13{,}211\\cos 125^\\circ + (-8{,}036)\\sin 125^\\circ = -14{,}16\\ \\text{N}"}
              </M>
              . Ez nem véletlen, hanem a vetítés linearitásának következménye —
              és ingyenes ellenőrzés minden ilyen feladatban.
            </p>
          }
        >
          <Lepes cim="a) Az F₁ komponensei — a szöget az x tengelytől mértük">
            <p>
              Itt a megszokott eset áll fenn, a <M>{"40^\\circ"}</M> az{" "}
              <M>{"x"}</M> tengelytől indul, tehát a vízszinteshez koszinusz
              tartozik.
            </p>
            <MB>
              {
                "\\underline{F}_1 = \\begin{bmatrix} F_1\\cos 40^\\circ \\\\ F_1\\sin 40^\\circ \\end{bmatrix} = \\begin{bmatrix} 3{,}830 \\\\ 3{,}214 \\end{bmatrix}\\ \\text{N}"
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
                "\\underline{F}_3 = \\begin{bmatrix} F_3\\sin 25^\\circ \\\\ -F_3\\cos 25^\\circ \\end{bmatrix} = \\begin{bmatrix} 3{,}381 \\\\ -7{,}250 \\end{bmatrix}\\ \\text{N}"
              }
            </MB>
          </Lepes>

          <Lepes cim="b) A négy vektor összege">
            <p>Komponensenként összegzünk:</p>
            <MB>
              {
                "\\underline{R} = \\begin{bmatrix} 3{,}830 + 6 + 3{,}381 + 0 \\\\ 3{,}214 + 0 - 7{,}250 - 4 \\end{bmatrix} = \\begin{bmatrix} 13{,}211 \\\\ -8{,}036 \\end{bmatrix}\\ \\text{N}"
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
            <MB>{"F_{1t} = 5\\cos 85^\\circ = 0{,}4358\\ \\text{N}"}</MB>
            <MB>{"F_{2t} = 6\\cos 125^\\circ = -3{,}441\\ \\text{N}"}</MB>
            <MB>{"F_{3t} = 8\\cos 170^\\circ = -7{,}878\\ \\text{N}"}</MB>
            <MB>{"F_{4t} = 4\\cos 145^\\circ = -3{,}277\\ \\text{N}"}</MB>
            <p>
              Csak az <M>{"F_1"}</M> vetülete pozitív, a többi erő a{" "}
              <M>{"t"}</M> tengely irányával ellentétes értelemben vetül.
            </p>
          </Lepes>
        </KidolgozottFeladat>

        {/* ---- GYF-3 ---- */}
        <div className="my-8">
          <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Ugyanez filmen – nézd végig, hogyan áll össze az eredő</p>
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
              Az egyensúly mindig ugyanígy működik: felírod, hogy a komponensek
              összege nulla, és abból a hiányzó erő komponensei már egy
              kivonással megvannak. A nagyság és az irány csak ezután jön — és
              az irányszögnél mindig nézd meg az ábrán, melyik síknegyedbe esik
              az eredmény.
            </p>
          }
        >
          <Lepes cim="Az F₁ komponensei">
            <p>
              Az <M>{"F_1"}</M> a második síknegyedbe mutat, a szögét a negatív{" "}
              <M>{"x"}</M> iránytól mértük <M>{"55^\\circ"}</M>-nak. A
              vízszintes komponens ezért negatív:
            </p>
            <MB>
              {
                "\\underline{F}_1 = \\begin{bmatrix} -F_1\\cos 55^\\circ \\\\ F_1\\sin 55^\\circ \\end{bmatrix} = \\begin{bmatrix} -86{,}04 \\\\ 122{,}9 \\end{bmatrix}\\ \\text{N}"
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
                "\\underline{F}_2 = \\begin{bmatrix} F_2\\sin 25^\\circ \\\\ -F_2\\cos 25^\\circ \\end{bmatrix} = \\begin{bmatrix} 63{,}39 \\\\ -135{,}9 \\end{bmatrix}\\ \\text{N}"
              }
            </MB>
          </Lepes>

          <Lepes cim="Az egyensúlyi feltétel felírása">
            <p>
              Mivel a három vektor összege zérusvektor, mindkét komponensre
              külön felírhatjuk az egyenletet:
            </p>
            <MB>
              {
                "\\begin{bmatrix} -86{,}04 + 63{,}39 + F_{3x} \\\\ 122{,}9 - 135{,}9 + F_{3y} \\end{bmatrix} = \\begin{bmatrix} -22{,}65 + F_{3x} \\\\ -13{,}0 + F_{3y} \\end{bmatrix} = \\begin{bmatrix} 0 \\\\ 0 \\end{bmatrix}"
              }
            </MB>
          </Lepes>

          <Lepes cim="Az F₃ komponensei">
            <p>
              Az egyenletekből a harmadik erő komponensei közvetlenül adódnak —
              éppen az első kettő összegének ellentettjei:
            </p>
            <MB>
              {
                "\\underline{F}_3 = \\begin{bmatrix} 22{,}65 \\\\ 13{,}0 \\end{bmatrix}\\ \\text{N}"
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
                "|\\underline{F}_3| = \\sqrt{22{,}65^2 + 13{,}0^2} = 26{,}12\\ \\text{N}"
              }
            </MB>
            <MB>
              {
                "\\alpha = \\operatorname{arctg}\\frac{13{,}0}{22{,}65} = 29{,}85^\\circ"
              }
            </MB>
          </Lepes>
        </KidolgozottFeladat>
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
        <GyakorloSzekcio />

        <Kiemelo tipus="kulcs" cim="Mikor mehetsz tovább">
          <p>
            Akkor vagy készen ezzel a modullal, ha a komponensekre bontást és az
            eredő számítását öt feladatból ötször hibátlanul megcsinálod — és ami
            fontosabb: az előjelek is automatikusan jönnek, nem kell
            gondolkodnod rajtuk. A következő modulban ugyanezeket a lépéseket
            fogod használni, csak már a nyomatékkal együtt.
          </p>
        </Kiemelo>
      </Szakasz>
    </>
  );
}
