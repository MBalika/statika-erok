import { AbraKeret } from "@/components/ui/Elemek";
import { M, MB } from "@/components/ui/Keplet";
import { KidolgozottFeladat, Lepes } from "@/components/KidolgozottFeladat";
import {
  AbraGyf1, AbraGyf1Eredmeny, AbraGyf2, AbraGyf2Eredmeny, AbraGyf3, AbraGyf3Csomopont, AbraGyf3Eredmeny, AbraGyf4, AbraGyf4Eredmeny, AbraGyf5, AbraGyf5Eredmeny, AbraGyf6, AbraGyf6Eredmeny, AbraGyf7, AbraGyf7Eredmeny,
} from "./FeladatAbrak";
import { TerbeliFilmKonzol3D, TerbeliFilmBakallvany3D } from "@/components/harom/Film3D";
import FilmGyf2 from "./FilmGyf2";

/**
 * A 10. modul kidolgozott feladatai (GYF‑1…GYF‑7): a H13 feladatsor, a vizsgaminta 5. feladata és a tankönyv
 * 9.2–9.3 példái számokkal. Minden feladat a tankönyv receptjét követi: elkülönítés → egyensúlyi kijelentés →
 * egyismeretlenes egyenletek (hat egyenlet térben, három a csomópontban) → ellenőrzés → eredményvázlat.
 * Minden szám a src/lib/terbeli.js számítómaggal ellenőrizve (visszahelyettesítés a hat egyenletbe).
 */

const FilmCim = ({ children }) => <h3 className="mt-4 mb-2 text-[13px] font-semibold text-petrol-500 uppercase tracking-wider">{children}</h3>;

export default function GyfBlokkok() {
  return (
    <>
      {/* ==================== GYF‑1 ==================== */}
      <KidolgozottFeladat
        jel="GYF‑1"
        ido="6 perc"
        forras="H13 szintemelő, 1. feladat; tankönyv 9.3. ábra"
        cim="Mereven befogott tört tengelyű konzol — a hat reakció"
        feladat={
          <p>
            Az <M>{"A"}</M> pontban (origó) mereven befogott konzol függőleges szára <M>{"b = 3"}</M> m, vízszintes szára <M>{"a = 2"}</M> m hosszú, a <M>{"-x"}</M> irányba nyúlik. A szabad <M>{"E(-2;\\ 3;\\ 0)"}</M> végén{" "}
            <M>{"F = 10\\ \\text{kN}"}</M> hat, a <M>{"z"}</M> tengellyel párhuzamosan, a <M>{"-z"}</M> irányba (a nézőtől befelé). Határozd meg a befogás reakcióit!
          </p>
        }
        abra={
          <AbraKeret cim="A feladatlap rajza számokkal: x jobbra, y felfelé, z a néző felé. Az F erő nyila a −z irányba mutat.">
            <AbraGyf1 />
          </AbraKeret>
        }
        tanulsag={
          <p>
            Befogott konzolnál a térbeli feladat sem nehezebb a síkbelinél: a három vetületi egyenletben csak egy-egy erőkomponens, az <M>{"A"}</M>-n átmenő tengelyekre írt nyomatéki egyenletekben csak egy-egy nyomatékkomponens
            ismeretlen, mert a reakcióerők <strong>metszik</strong> a tengelyeket. A karokat vetületből olvassuk le: az <M>{"x"}</M> tengelyre a magasság (<M>{"b"}</M>), az <M>{"y"}</M> tengelyre a kinyúlás (<M>{"a"}</M>) a kar; a <M>{"z"}</M> tengellyel az erő
            párhuzamos, arra nem forgat. Az előjelet a jobbkéz-szabály adja: <M>{"(\\underline r\\times\\underline F)_x = y F_z - z F_y"}</M>.
          </p>
        }
      >
        <Lepes cim="Elkülönítés — a szabadtest-ábra">
          <p>
            A befogás fokszáma hat. Eltávolítjuk, és a helyére három reakcióerő-komponenst (<M>{"A_x, A_y, A_z"}</M>) és három befogási nyomaték-komponenst (<M>{"M_{Ax}, M_{Ay}, M_{Az}"}</M>) veszünk fel, mindet a pozitív tengelyirányban. Az aktív teher
            egyetlen erő: <M>{"\\underline F = (0;\\ 0;\\ -10)"}</M> kN, támadáspontja <M>{"\\underline r_E = (-2;\\ 3;\\ 0)"}</M> m. Hat ismeretlen — hat egyenlet.
          </p>
        </Lepes>
        <Lepes cim="Egyensúlyi kijelentés">
          <MB>{"(\\underline F, \\underline A, \\underline M_A) \\ekv \\underline O"}</MB>
        </Lepes>
        <Lepes cim="Három vetületi egyenlet → a reakcióerő">
          <p>A nyomatékok a vetületi egyenletekben nem szerepelnek; az erőnek csak <M>{"z"}</M> komponense van:</p>
          <MB>{"\\Fx A_x = 0,\\qquad \\Fy A_y = 0,\\qquad \\Fz -10 + A_z = 0 \\;\\Rightarrow\\; A_z = 10\\ \\text{kN}"}</MB>
        </Lepes>
        <Lepes cim="Három nyomatéki egyenlet az A ponton átmenő tengelyekre → a befogási nyomaték">
          <p>
            Az <M>{"A_x, A_y, A_z"}</M> hatásvonala átmegy a tengelyeken (karjuk nulla). Az erő nyomatéka vektorosan <M>{"\\underline r_E\\times\\underline F = (3\\cdot(-10) - 0;\\ 0 - (-2)(-10);\\ 0) = (-30;\\ -20;\\ 0)"}</M> kNm — ugyanez szemléletből: az{" "}
            <M>{"x"}</M> tengelyre a kar a 3 m magasság, az <M>{"y"}</M> tengelyre a 2 m kinyúlás, a <M>{"z"}</M> tengellyel az erő párhuzamos.
          </p>
          <MB>{"\\sum M_{ix}:\\ 3\\cdot(-10) + M_{Ax} = 0 \\;\\Rightarrow\\; M_{Ax} = 30\\ \\text{kNm}"}</MB>
          <MB>{"\\sum M_{iy}:\\ -(-2)\\cdot(-10) + M_{Ay} = 0 \\;\\Rightarrow\\; M_{Ay} = 20\\ \\text{kNm}"}</MB>
          <MB>{"\\sum M_{iz}:\\ 0 + M_{Az} = 0 \\;\\Rightarrow\\; M_{Az} = 0"}</MB>
        </Lepes>
        <Lepes cim="Ellenőrzés — nyomatéki egyenlet az E ponton átmenő tengelyekre">
          <p>
            Nem használt egyenletek, minden tag ismert. Az <M>{"E"}</M>-re nézve a teher karja nulla, a reakcióerő karja <M>{"\\underline r_A - \\underline r_E = (2;\\ -3;\\ 0)"}</M>:{" "}
            <M>{"(2;\\ -3;\\ 0)\\times(0;\\ 0;\\ 10) = (-30;\\ -20;\\ 0)"}</M>, a befogási nyomaték pontra nem érzékeny:
          </p>
          <MB>{"\\sum M_{iE}:\\ (-30;\\ -20;\\ 0) + (30;\\ 20;\\ 0) = (0;\\ 0;\\ 0)\\ \\checkmark"}</MB>
        </Lepes>
        <Lepes cim="Eredményvázlat">
          <p>
            <M>{"\\underline A = (0;\\ 0;\\ 10)"}</M> kN — a reakcióerő a teherrel ellentétes, a <M>{"+z"}</M> irányba mutat; <M>{"\\underline M_A = (30;\\ 20;\\ 0)"}</M> kNm — a befogás az <M>{"x"}</M> tengely körül 30, az <M>{"y"}</M> körül 20 kNm-rel tart ellen. Három
            reakció nulla: <M>{"A_x = A_y = 0"}</M> (nincs <M>{"x, y"}</M> irányú teher) és <M>{"M_{Az} = 0"}</M> (az erő párhuzamos a <M>{"z"}</M> tengellyel).
          </p>
          <AbraKeret cim="Eredményvázlat: a nem nulla reakciók a tényleges irányukkal.">
            <AbraGyf1Eredmeny />
          </AbraKeret>
        </Lepes>
      </KidolgozottFeladat>
      <FilmCim>Ugyanez filmen, 3D-ben – a befogás reakciókra cserélése és a hat egyenlet</FilmCim>
      <TerbeliFilmKonzol3D />

      {/* ==================== GYF‑2 ==================== */}
      <KidolgozottFeladat
        jel="GYF‑2"
        ido="8 perc"
        forras="H13 szintemelő, 2. feladat"
        cim="A K1 és K2 keresztmetszet térbeli igénybevételei"
        feladat={
          <p>
            A GYF‑1 konzolján határozd meg a <M>{"K_1"}</M> (a függőleges száron, <M>{"y = 1"}</M> m-re <M>{"A"}</M>-tól) és a <M>{"K_2"}</M> (a vízszintes szár közepén, <M>{"x = -1"}</M> m) keresztmetszet igénybevételeit! Sorold fel a zérus
            értékűeket is, és rajzold be az igénybevételeket a keresztmetszetekbe!
          </p>
        }
        abra={
          <AbraKeret cim="A két keresztmetszet helye. K1 tengelye az y (a keresztmetszet síkja ∥ xz), K2 tengelye az x (síkja ∥ yz).">
            <AbraGyf2 />
          </AbraKeret>
        }
        tanulsag={
          <p>
            Térben is <strong>pontra redukálás</strong>: a keresztmetszet egyik oldalán lévő rész összes erejét a <M>{"K"}</M> pontba redukáljuk, és a kapott erő- és nyomatékvektort a tengelyekre bontjuk. A <em>követő</em> rész (a lokális tengely pozitív
            irányában lévő) erőiből <M>{"\\underline R_K = \\sum\\underline F"}</M>, <M>{"\\underline M_K = \\sum(\\underline r_i - \\underline r_K)\\times\\underline F_i"}</M>; a <em>megelőző</em> részből ugyanez <strong>mínusz</strong> előjellel. A
            csavarónyomaték a tengelyirányú, a hajlítónyomatékok a keresztmetszet síkjába eső komponensek — a függőleges száron a <M>{"T = M_y"}</M>, a vízszintesen a <M>{"T = M_x"}</M>.
          </p>
        }
      >
        <Lepes cim="K1 — melyik részből számolunk, és mi a tengely?">
          <p>
            A függőleges szár tengelye az <M>{"y"}</M>: a <M>{"K_1(0;\\ 1;\\ 0)"}</M> keresztmetszet <strong>követő</strong> része a fölötte lévő rész (a sarok, a vízszintes szár és <M>{"F"}</M>). Ezt választjuk, mert csak egy erő hat rá — nem kellenek a
            reakciók. A belső erőt a követő rész erőiből a keresztmetszetre redukáljuk:
          </p>
          <MB>{"\\underline R_{K1} = \\underline F = (0;\\ 0;\\ -10)\\ \\text{kN},\\qquad \\underline M_{K1} = (\\underline r_E - \\underline r_{K1})\\times\\underline F = (-2;\\ 2;\\ 0)\\times(0;\\ 0;\\ -10) = (-20;\\ -20;\\ 0)\\ \\text{kNm}"}</MB>
        </Lepes>
        <Lepes cim="K1 — a hat igénybevétel">
          <p>
            A tengely az <M>{"y"}</M>: a normálerő az <M>{"y"}</M>, a csavarónyomaték az <M>{"y"}</M> komponens; a nyíróerők és a hajlítónyomatékok az <M>{"x"}</M> és <M>{"z"}</M> komponensek.
          </p>
          <MB>{"N = R_y = 0,\\quad V_x = R_x = 0,\\quad V_z = R_z = -10\\ \\text{kN}"}</MB>
          <MB>{"T = M_y = -20\\ \\text{kNm},\\quad M_x = -20\\ \\text{kNm},\\quad M_z = 0"}</MB>
          <p>
            Szemléletből: <M>{"F"}</M> a <M>{"z"}</M> irányban nyír; az <M>{"x"}</M> tengely körül 2 m karral hajlít (<M>{"F"}</M> 2 m-rel magasabban hat, mint <M>{"K_1"}</M>); az <M>{"y"}</M> tengely körül a 2 m-es kinyúlással <strong>csavar</strong>. Zérus:{" "}
            <M>{"N, V_x, M_z"}</M>.
          </p>
        </Lepes>
        <Lepes cim="K2 — a megelőző (szabad végi) részből">
          <p>
            A vízszintes szár tengelye az <M>{"x"}</M>; a <M>{"K_2(-1;\\ 3;\\ 0)"}</M> követő része a sarok felőli (a <M>{"+x"}</M> irányban lévő), a <strong>megelőző</strong> része a szabad vég az <M>{"F"}</M> erővel. Az egyszerűbb, a megelőző részből számolunk,
            ezért a redukált vektorok előjelét megfordítjuk:
          </p>
          <MB>{"\\underline R_{K2} = -\\underline F = (0;\\ 0;\\ 10)\\ \\text{kN},\\qquad \\underline M_{K2} = -(\\underline r_E - \\underline r_{K2})\\times\\underline F = -(-1;\\ 0;\\ 0)\\times(0;\\ 0;\\ -10) = -(0;\\ -10;\\ 0) = (0;\\ 10;\\ 0)\\ \\text{kNm}"}</MB>
          <MB>{"N = R_x = 0,\\quad V_y = 0,\\quad V_z = 10\\ \\text{kN};\\qquad T = M_x = 0,\\quad M_y = 10\\ \\text{kNm},\\quad M_z = 0"}</MB>
          <p>
            Zérus: <M>{"N, V_y, T, M_z"}</M>. A csavarónyomaték nulla, mert <M>{"F"}</M> hatásvonala metszi a szár tengelyét (egy egyenes rúd végén ható erő nem csavar).
          </p>
        </Lepes>
        <Lepes cim="Ellenőrzés — K2 a másik (követő) részből, a reakciókkal">
          <p>
            A követő részre az <M>{"A"}</M> pontban <M>{"\\underline A = (0;\\ 0;\\ 10)"}</M> és <M>{"\\underline M_A = (30;\\ 20;\\ 0)"}</M> hat; <M>{"\\underline r_A - \\underline r_{K2} = (1;\\ -3;\\ 0)"}</M>:
          </p>
          <MB>{"\\underline R_{K2} = \\underline A = (0;\\ 0;\\ 10)\\ \\checkmark,\\qquad \\underline M_{K2} = (1;\\ -3;\\ 0)\\times(0;\\ 0;\\ 10) + \\underline M_A = (-30;\\ -10;\\ 0) + (30;\\ 20;\\ 0) = (0;\\ 10;\\ 0)\\ \\checkmark"}</MB>
        </Lepes>
        <Lepes cim="Az igénybevételek berajzolása a keresztmetszetekbe">
          <p>
            A <em>megelőző</em> rész keresztmetszetén a pozitív komponens a globális tengely pozitív irányába mutat. <M>{"K_1"}</M>-ben (felülről, az <M>{"y"}</M> felől nézve) <M>{"V_z = -10"}</M> a <M>{"-z"}</M> irányba, <M>{"M_x = -20"}</M> és{" "}
            <M>{"T = -20"}</M> a negatív irányokba mutat; <M>{"K_2"}</M>-ben <M>{"V_z = 10"}</M> a <M>{"+z"}</M>, <M>{"M_y = 10"}</M> a <M>{"+y"}</M> irányba.
          </p>
          <AbraKeret cim="A két keresztmetszet a feladatlap nézeteiben; ⊙ a néző felé, ⊗ befelé mutató vektor. A szürke szimbólum zérus komponenst jelöl.">
            <AbraGyf2Eredmeny />
          </AbraKeret>
        </Lepes>
      </KidolgozottFeladat>
      <FilmCim>Ugyanez filmen – síkba vetítve: nézetek, karok, előjelek</FilmCim>
      <FilmGyf2 />

      {/* ==================== GYF‑3 ==================== */}
      <KidolgozottFeladat
        jel="GYF‑3"
        ido="8 perc"
        forras="H13 szintemelő, 3. feladat; tankönyv 9.2.2"
        cim="Háromlábú bakállvány — a három rúderő a csomópont egyensúlyából"
        feladat={
          <p>
            A bakállvány csúcsa <M>{"C(0;\\ 6;\\ 0)"}</M>, a rudak talppontjai <M>{"1:(-4;\\ 0;\\ 0)"}</M>, <M>{"2:(5;\\ 0;\\ -4)"}</M>, <M>{"3:(5;\\ 0;\\ 4)"}</M> m. A csúcson <M>{"F = 10"}</M> kN hat az <M>{"xy"}</M> síkban, a <M>{"+x"}</M> tengellyel{" "}
            <M>{"\\alpha = 45^\\circ"}</M>-ot bezáró egyenes mentén, balra-lefelé. Határozd meg a támasztórudakban ébredő erőket!
          </p>
        }
        abra={
          <AbraKeret cim="A feladatlap rajza számokkal. A szaggatott vonalak a talppontok x és z koordinátái (a rudak vetületei).">
            <AbraGyf3 />
          </AbraKeret>
        }
        tanulsag={
          <p>
            A bakállvány a térbeli „csomóponti módszer”: közös metszéspontú erőrendszer, három vetületi egyenlet. A rúderőket <strong>húzóerőként</strong> vesszük fel a talppont felé mutató egységvektorral; a tankönyv (9.3)–(9.5) egyenleteinek ± előjelei
            nálunk az <M>{"l_{ix}/l_i"}</M> hányadosok előjelei. A szimmetria (a 2-es és 3-as rúd a <M>{"z"}</M>-ben tükrös) azonnal egy egyenletet megold. Az ellenőrzés a tankönyv tippje: nyomatéki egyenlet a két talppontot összekötő egyenesre — abban csak a
            harmadik rúderő szerepel.
          </p>
        }
      >
        <Lepes cim="Elkülönítés — a csomópont">
          <p>
            A csúcsra a teher és a három rúderő hat. A teher komponensei: <M>{"\\underline F = (-10\\cos 45^\\circ;\\ -10\\sin 45^\\circ;\\ 0) = (-7{,}071;\\ -7{,}071;\\ 0)"}</M> kN. A rúdvektorok a csúcsból a talppontba:{" "}
            <M>{"\\underline l_1 = (-4;\\ -6;\\ 0)"}</M>, <M>{"\\underline l_2 = (5;\\ -6;\\ -4)"}</M>, <M>{"\\underline l_3 = (5;\\ -6;\\ 4)"}</M> m; hosszuk <M>{"l_1 = \\sqrt{16 + 36} = 7{,}211"}</M>, <M>{"l_2 = l_3 = \\sqrt{25 + 36 + 16} = 8{,}775"}</M> m.
          </p>
          <AbraKeret cim="A csomópont elkülönítése: a rúderők a talppontok felé, húzóerőként felvéve.">
            <AbraGyf3Csomopont />
          </AbraKeret>
        </Lepes>
        <Lepes cim="Egyensúlyi kijelentés">
          <MB>{"(\\underline F, \\underline S_1, \\underline S_2, \\underline S_3) \\ekv \\underline O"}</MB>
          <p>
            Az egységvektorok: <M>{"\\underline e_1 = (-0{,}5547;\\ -0{,}8321;\\ 0)"}</M>, <M>{"\\underline e_2 = (0{,}5698;\\ -0{,}6838;\\ -0{,}4558)"}</M>, <M>{"\\underline e_3 = (0{,}5698;\\ -0{,}6838;\\ 0{,}4558)"}</M>.
          </p>
        </Lepes>
        <Lepes cim="z irányú vetületi egyenlet → S₂ = S₃">
          <p>
            A teher és az 1-es rúd az <M>{"xy"}</M> síkban fekszik, <M>{"z"}</M> vetületük nulla:
          </p>
          <MB>{"\\Fz 0 - 0{,}4558\\,S_2 + 0{,}4558\\,S_3 = 0 \\;\\Rightarrow\\; S_3 = S_2"}</MB>
        </Lepes>
        <Lepes cim="x és y irányú vetületi egyenlet → S₁, S₂">
          <MB>{"\\Fx -7{,}071 - 0{,}5547\\,S_1 + 0{,}5698\\,S_2 + 0{,}5698\\,S_3 = 0"}</MB>
          <MB>{"\\Fy -7{,}071 - 0{,}8321\\,S_1 - 0{,}6838\\,S_2 - 0{,}6838\\,S_3 = 0"}</MB>
          <p>
            <M>{"S_3 = S_2"}</M>-vel két egyenlet két ismeretlennel. Az elsőből <M>{"S_1 = (1{,}1396\\,S_2 - 7{,}071)/0{,}5547 = 2{,}054\\,S_2 - 12{,}75"}</M>; a másodikba helyettesítve:
          </p>
          <MB>{"-7{,}071 - 0{,}8321\\,(2{,}054\\,S_2 - 12{,}75) - 1{,}3676\\,S_2 = 0 \\;\\Rightarrow\\; -3{,}077\\,S_2 + 3{,}536 = 0 \\;\\Rightarrow\\; S_2 = S_3 = 1{,}149\\ \\text{kN}"}</MB>
          <MB>{"S_1 = 2{,}054\\cdot 1{,}149 - 12{,}75 = -10{,}39\\ \\text{kN}"}</MB>
        </Lepes>
        <Lepes cim="Ellenőrzés — nyomatéki egyenlet a 2–3 talppontokat összekötő tengelyre">
          <p>
            A tankönyv tippje (9.2.2): a 2-es és 3-as talppontot összekötő egyenes (<M>{"x = 5, y = 0"}</M>, <M>{"z"}</M> irányú tengely) körül csak a teher és <M>{"S_1"}</M> forgat. A <M>{"C"}</M> csúcs helyvektora a tengely <M>{"(5;\\ 0;\\ 0)"}</M> pontjából{" "}
            <M>{"(-5;\\ 6;\\ 0)"}</M>; a <M>{"z"}</M> komponens <M>{"r_x F_y - r_y F_x"}</M>:
          </p>
          <MB>{"\\sum M_{it}:\\ (-5)(-7{,}071) - 6\\,(-7{,}071) + \\big[(-5)(-0{,}8321) - 6\\,(-0{,}5547)\\big]S_1 = 77{,}78 + 7{,}489\\,S_1 = 0 \\;\\Rightarrow\\; S_1 = -10{,}39\\ \\checkmark"}</MB>
          <p>Vetületi ellenőrzés is: <M>{"-7{,}071 - 0{,}8321\\cdot(-10{,}39) - 2\\cdot 0{,}6838\\cdot 1{,}149 = -7{,}071 + 8{,}643 - 1{,}571 = 0{,}00\\ \\checkmark"}</M>.</p>
        </Lepes>
        <Lepes cim="Eredményvázlat">
          <p>
            <M>{"S_1 = -10{,}39"}</M> kN: az 1-es rúd <strong>nyomott</strong> (a teher rádől); <M>{"S_2 = S_3 = 1{,}149"}</M> kN: a 2-es és 3-as rúd enyhén <strong>húzott</strong> — visszatartják a csúcsot. Az abszolút értékek: a teher 10 kN-jának
            nagy részét az 1-es rúd viszi, mert az esik a legközelebb a teher irányához.
          </p>
          <AbraKeret cim="Eredményvázlat: piros = húzott, kék = nyomott rúd.">
            <AbraGyf3Eredmeny />
          </AbraKeret>
        </Lepes>
      </KidolgozottFeladat>
      <FilmCim>Ugyanez filmen, 3D-ben – a csomópont elkülönítése és a három egyenlet</FilmCim>
      <TerbeliFilmBakallvany3D />

      {/* ==================== GYF‑4 ==================== */}
      <KidolgozottFeladat
        jel="GYF‑4"
        ido="6 perc"
        forras="Vizsgaminta, 5. feladat"
        cim="Bakállvány függőleges rúddal, vízszintes teherrel — vizsgafeladat"
        feladat={
          <p>
            A csúcs <M>{"C(0;\\ 6;\\ 0)"}</M>; talppontok <M>{"1:(0;\\ 0;\\ 4)"}</M>, <M>{"2:(0;\\ 0;\\ 0)"}</M> (a 2-es rúd függőleges), <M>{"3:(5;\\ 0;\\ -4)"}</M> m. A csúcson <M>{"6"}</M> kN vízszintes erő hat a <M>{"+x"}</M> irányban. Határozd meg a
            támasztórudakban ébredő erőket!
          </p>
        }
        abra={
          <AbraKeret cim="A vizsgaminta 5. feladata számokkal.">
            <AbraGyf4 />
          </AbraKeret>
        }
        tanulsag={
          <p>
            Itt jól látszik a tankönyv 9.2.2 gondolata: keressük azt a vetületi (vagy nyomatéki) egyenletet, amelyben csak egy ismeretlen van. Az <M>{"x"}</M> vetületben csak a 3-as rúdnak van komponense (az 1-es és a 2-es az <M>{"yz"}</M> síkban fekszik) — ezért{" "}
            <M>{"S_3"}</M> egy lépésben kijön. A sorrend: <M>{"x \\to z \\to y"}</M>, mindig egyismeretlenes egyenlettel; az ellenőrzés a másik módszerrel (nyomaték a <M>{"z"}</M> tengelyre).
          </p>
        }
      >
        <Lepes cim="Elkülönítés és egyensúlyi kijelentés">
          <p>
            Rúdvektorok a csúcsból: <M>{"\\underline l_1 = (0;\\ -6;\\ 4)"}</M>, <M>{"l_1 = 7{,}211"}</M>; <M>{"\\underline l_2 = (0;\\ -6;\\ 0)"}</M>, <M>{"l_2 = 6"}</M>; <M>{"\\underline l_3 = (5;\\ -6;\\ -4)"}</M>, <M>{"l_3 = 8{,}775"}</M> m. Egységvektorok:{" "}
            <M>{"\\underline e_1 = (0;\\ -0{,}8321;\\ 0{,}5547)"}</M>, <M>{"\\underline e_2 = (0;\\ -1;\\ 0)"}</M>, <M>{"\\underline e_3 = (0{,}5698;\\ -0{,}6838;\\ -0{,}4558)"}</M>; teher <M>{"\\underline F = (6;\\ 0;\\ 0)"}</M> kN.
          </p>
          <MB>{"(\\underline F, \\underline S_1, \\underline S_2, \\underline S_3) \\ekv \\underline O"}</MB>
        </Lepes>
        <Lepes cim="x irányú vetület → S₃ (egyismeretlenes!)">
          <MB>{"\\Fx 6 + 0\\cdot S_1 + 0\\cdot S_2 + 0{,}5698\\,S_3 = 0 \\;\\Rightarrow\\; S_3 = -10{,}53\\ \\text{kN}"}</MB>
        </Lepes>
        <Lepes cim="z irányú vetület → S₁">
          <MB>{"\\Fz 0 + 0{,}5547\\,S_1 + 0\\cdot S_2 - 0{,}4558\\,S_3 = 0 \\;\\Rightarrow\\; S_1 = \\frac{0{,}4558}{0{,}5547}\\,S_3 = 0{,}8217\\cdot(-10{,}53) = -8{,}653\\ \\text{kN}"}</MB>
        </Lepes>
        <Lepes cim="y irányú vetület → S₂">
          <MB>{"\\Fy 0 - 0{,}8321\\,S_1 - 1\\cdot S_2 - 0{,}6838\\,S_3 = 0 \\;\\Rightarrow\\; S_2 = -0{,}8321\\,(-8{,}653) - 0{,}6838\\,(-10{,}53) = 7{,}200 + 7{,}200 = 14{,}40\\ \\text{kN}"}</MB>
        </Lepes>
        <Lepes cim="Ellenőrzés — nyomatéki egyenlet a z tengelyre">
          <p>
            A <M>{"z"}</M> tengely átmegy az 1-es és a 2-es rúd talppontján (<M>{"x = 0"}</M>): a két rúderő hatásvonala metszi a tengelyt, csak a teher és <M>{"S_3"}</M> forgat. A <M>{"C"}</M> pont helyvektora <M>{"(0;\\ 6;\\ 0)"}</M>, a <M>{"z"}</M> komponens{" "}
            <M>{"r_x F_y - r_y F_x"}</M>:
          </p>
          <MB>{"\\sum M_{iz}:\\ 0\\cdot 0 - 6\\cdot 6 + \\big[0\\cdot(-0{,}6838) - 6\\cdot 0{,}5698\\big]S_3 = -36 - 3{,}419\\,S_3 = 0 \\;\\Rightarrow\\; S_3 = -10{,}53\\ \\checkmark"}</MB>
        </Lepes>
        <Lepes cim="Eredményvázlat">
          <p>
            <M>{"S_1 = -8{,}653"}</M> kN (nyomott), <M>{"S_2 = 14{,}40"}</M> kN (húzott), <M>{"S_3 = -10{,}53"}</M> kN (nyomott). A vízszintes teher a 3-as rúdba tolja a csúcsot; a 3-as rúd ferde nyomása lefelé és <M>{"-z"}</M> felé is hat, ezt az 1-es rúd
            (nyomott) és a függőleges 2-es rúd (húzott) egyensúlyozza. A vizsgán a <strong>helyes előjel</strong> a pont fele!
          </p>
          <AbraKeret cim="Eredményvázlat a rúderők előjelével.">
            <AbraGyf4Eredmeny />
          </AbraKeret>
        </Lepes>
      </KidolgozottFeladat>

      {/* ==================== GYF‑5 ==================== */}
      <KidolgozottFeladat
        jel="GYF‑5"
        ido="10 perc"
        forras="H13 szintemelő, 4. feladat; tankönyv 9.1.3 és 9.2.3"
        cim="Folyadékkal töltött tartály gömbcsuklón és három rúdon — térfogati teher és hat egyenlet"
        feladat={
          <p>
            A <M>{"4\\times 4\\times 2"}</M> m-es (<M>{"x\\in[0;4],\\ y\\in[0;2],\\ z\\in[0;4]"}</M>) tartályt <M>{"\\gamma = 15\\ \\text{kN/m}^3"}</M> fajsúlyú folyadék tölti ki. Támaszai: gömbcsukló az <M>{"A(4;\\ 0;\\ 4)"}</M> pontban; 1-es rúd függőlegesen a{" "}
            <M>{"(0;\\ 0;\\ 4)"}</M> pontból lefelé; 2-es rúd a <M>{"(4;\\ 0;\\ 0)"}</M> pontból a <M>{"+x"}</M> irányban a falhoz; 3-as rúd függőlegesen a <M>{"(4;\\ 0;\\ 0)"}</M> pontból lefelé. A felső-elülső <M>{"(0;\\ 2;\\ 4)"}</M> sarkon{" "}
            <M>{"F = 60"}</M> kN hat a <M>{"-x"}</M> irányban. Határozd meg a reakciókat!
          </p>
        }
        abra={
          <AbraKeret cim="A H13/4 feladat rajza számokkal: a tartály a folyadékkal (γ = 15 kN/m³), a gömbcsukló A és a három támasztórúd.">
            <AbraGyf5 />
          </AbraKeret>
        }
        tanulsag={
          <p>
            A térfogat mentén megoszló teher eredője a térfogat és az intenzitás szorzata, a térfogat <strong>súlypontjában</strong> (9.1.3). Az igazi trükk a tankönyv 9.2.3 receptje: gömbcsukló + három rúd esetén a csuklón átmenő tengelyekre írt nyomatéki
            egyenletekből a három rúderő <strong>egyenként</strong> kijön (a csukló három komponense kiesik), utána a vetületi egyenletek a csukló komponenseit adják. <M>{"S_2 = 0"}</M>, mert minden más erő metszi vagy párhuzamos az <M>{"A"}</M>-n átmenő{" "}
            <M>{"y"}</M> tengellyel; <M>{"A_y < 0"}</M>: a csukló <em>lefelé húzza</em> a tartályt, mert a két függőleges rúd „túl sokat” vinne.
          </p>
        }
      >
        <Lepes cim="A térfogati teher eredője">
          <MB>{"V = 4\\cdot 2\\cdot 4 = 32\\ \\text{m}^3,\\qquad G = \\gamma V = 15\\cdot 32 = 480\\ \\text{kN},\\qquad \\underline r_G = (2;\\ 1;\\ 2)\\ \\text{m},\\quad \\underline G = (0;\\ -480;\\ 0)"}</MB>
        </Lepes>
        <Lepes cim="Elkülönítés és egyensúlyi kijelentés">
          <p>
            A gömbcsukló helyett <M>{"A_x, A_y, A_z"}</M> az <M>{"A(4;\\ 0;\\ 4)"}</M> pontban; a rudak helyett húzóerők a rúd túlsó vége felé: <M>{"\\underline S_1 = S_1(0;\\ -1;\\ 0)"}</M> a <M>{"(0;\\ 0;\\ 4)"}</M>,{" "}
            <M>{"\\underline S_2 = S_2(1;\\ 0;\\ 0)"}</M> és <M>{"\\underline S_3 = S_3(0;\\ -1;\\ 0)"}</M> a <M>{"(4;\\ 0;\\ 0)"}</M> pontban. Aktív: <M>{"\\underline G"}</M> és <M>{"\\underline F = (-60;\\ 0;\\ 0)"}</M> a <M>{"(0;\\ 2;\\ 4)"}</M> pontban. Hat
            ismeretlen, hat egyenlet.
          </p>
          <MB>{"(\\underline G, \\underline F, \\underline A, \\underline S_1, \\underline S_2, \\underline S_3) \\ekv \\underline O"}</MB>
          <AbraKeret cim="Elkülönítés: a csukló és a rudak reakcióra cserélve (a rudak színe már az eredményt mutatja).">
            <AbraGyf5Eredmeny />
          </AbraKeret>
        </Lepes>
        <Lepes cim="Nyomatéki egyenletek az A-n átmenő tengelyekre → S₃, S₂, S₁">
          <p>
            Az <M>{"A"}</M>-ból mért helyvektorok: <M>{"G"}</M>: <M>{"(-2;\\ 1;\\ -2)"}</M>; <M>{"F"}</M>: <M>{"(-4;\\ 2;\\ 0)"}</M>; <M>{"S_1"}</M>: <M>{"(-4;\\ 0;\\ 0)"}</M>; <M>{"S_2, S_3"}</M>: <M>{"(0;\\ 0;\\ -4)"}</M>. A nyomaték komponensei:{" "}
            <M>{"M_x = r_y F_z - r_z F_y"}</M>, <M>{"M_y = r_z F_x - r_x F_z"}</M>, <M>{"M_z = r_x F_y - r_y F_x"}</M>.
          </p>
          <MB>{"\\sum M_{ix}:\\ \\underbrace{1\\cdot 0 - (-2)(-480)}_{G} + \\underbrace{0}_{F} + \\underbrace{0}_{S_1} + \\underbrace{0}_{S_2} \\underbrace{- (-4)(-S_3)}_{S_3} = -960 - 4S_3 = 0 \\;\\Rightarrow\\; S_3 = -240\\ \\text{kN}"}</MB>
          <MB>{"\\sum M_{iy}:\\ 0 + 0 + 0 + \\underbrace{(-4)\\,S_2}_{S_2} + 0 = 0 \\;\\Rightarrow\\; S_2 = 0"}</MB>
          <MB>{"\\sum M_{iz}:\\ \\underbrace{(-2)(-480)}_{G} + \\underbrace{-2\\cdot(-60)}_{F} + \\underbrace{(-4)(-S_1)}_{S_1} = 960 + 120 + 4S_1 = 0 \\;\\Rightarrow\\; S_1 = -270\\ \\text{kN}"}</MB>
        </Lepes>
        <Lepes cim="Vetületi egyenletek → a gömbcsukló reakciói">
          <MB>{"\\Fx -60 + S_2 + A_x = 0 \\;\\Rightarrow\\; A_x = 60\\ \\text{kN}"}</MB>
          <MB>{"\\Fy -480 - S_1 - S_3 + A_y = 0 \\;\\Rightarrow\\; A_y = 480 - 270 - 240 = -30\\ \\text{kN}"}</MB>
          <MB>{"\\Fz A_z = 0"}</MB>
        </Lepes>
        <Lepes cim="Ellenőrzés — nyomatéki egyenlet az origón átmenő x tengelyre">
          <p>
            Minden erő ismert; a tényleges erők: <M>{"S_1"}</M> a testre <M>{"(0;\\ 270;\\ 0)"}</M> a <M>{"(0;0;4)"}</M>-ben, <M>{"S_3"}</M> a testre <M>{"(0;\\ 240;\\ 0)"}</M> a <M>{"(4;0;0)"}</M>-ban, <M>{"\\underline A = (60;\\ -30;\\ 0)"}</M> a <M>{"(4;0;4)"}</M>-ben:
          </p>
          <MB>{"\\sum M_{ix}:\\ \\underbrace{-2\\cdot(-480)}_{G} + \\underbrace{-4\\cdot 270}_{S_1} + \\underbrace{0}_{S_3} + \\underbrace{-4\\cdot(-30)}_{A} + \\underbrace{0}_{F} = 960 - 1080 + 120 = 0\\ \\checkmark"}</MB>
        </Lepes>
        <Lepes cim="Eredményvázlat">
          <p>
            <M>{"S_1 = -270"}</M> kN és <M>{"S_3 = -240"}</M> kN: mindkét függőleges rúd <strong>nyomott</strong> (tartja a 480 kN-t), <M>{"S_2 = 0"}</M>; <M>{"\\underline A = (60;\\ -30;\\ 0)"}</M> kN: a csukló ellensúlyozza a 60 kN vízszintes erőt, és{" "}
            <strong>lefelé</strong> húzza a tartály sarkát 30 kN-nal — mert a súly a két rúd talppontja közötti átlótól a rudak felé esik. Összeg: <M>{"270 + 240 - 30 = 480"}</M> ✓.
          </p>
        </Lepes>
      </KidolgozottFeladat>

      {/* ==================== GYF‑6 ==================== */}
      <KidolgozottFeladat
        jel="GYF‑6"
        ido="10 perc"
        forras="Tankönyv 9.2.4 — térbeli rácsos tartó"
        cim="Térbeli rácsos tartó — csomóponti módszer három egyenlettel"
        feladat={
          <p>
            A rácsos tartó szabad csomópontjai <M>{"D(2;\\ 3;\\ 2)"}</M> és <M>{"E(4;\\ 3;\\ 2)"}</M>, gömbcsuklós talppontjai <M>{"A(0;0;0)"}</M>, <M>{"B(6;0;0)"}</M>, <M>{"C(0;0;4)"}</M>, <M>{"G(6;0;4)"}</M>. Rudak: 1: <M>{"D\\!-\\!A"}</M>, 2:{" "}
            <M>{"D\\!-\\!C"}</M>, 3: <M>{"D\\!-\\!B"}</M>, 4: <M>{"D\\!-\\!E"}</M>, 5: <M>{"E\\!-\\!B"}</M>, 6: <M>{"E\\!-\\!G"}</M>. Terhek: <M>{"E"}</M>-ben 12 kN, <M>{"D"}</M>-ben 8 kN függőlegesen lefelé. Határozd meg a rúderőket!
          </p>
        }
        abra={
          <AbraKeret cim="A térbeli rácsos tartó: hat rúd, két szabad csomópont, négy gömbcsuklós talppont.">
            <AbraGyf6 />
          </AbraKeret>
        }
        tanulsag={
          <p>
            Térben csomópontonként <strong>három</strong> egyenlet jár, tehát ott kezdünk, ahol legfeljebb három ismeretlen rúd fut össze (<M>{"E"}</M>), és a kiszámolt rúderőt a következő csomópontban már ismert erőként visszük tovább. Egy rúderő önmagában
            akkor számolható, ha a többi ismeretlen rúd egy síkban fekszik — az arra merőleges vetületi egyenletben csak ő szerepel. Az <M>{"E"}</M>-ben az 5-ös és 6-os rúd síkja tartalmazza a 4-es rúd irányát, ezért itt nem ez, hanem a szimmetria
            segített: a <M>{"z"}</M> egyenlet <M>{"S_5 = S_6"}</M>-ot, az <M>{"y"}</M> a nagyságukat, az <M>{"x"}</M> pedig <M>{"S_4"}</M>-et adta. A számlálás: <M>{"e = 3c = 18 = r + k = 6 + 12"}</M>.
          </p>
        }
      >
        <Lepes cim="Számlálás és sorrend">
          <p>
            <M>{"c = 6"}</M> csomópont → <M>{"e = 18"}</M> egyenlet; <M>{"r = 6"}</M> rúd + <M>{"k = 4\\cdot 3 = 12"}</M> reakciókomponens → <M>{"i = 18"}</M>. Az <M>{"E"}</M> csomópontban három ismeretlen rúd (4, 5, 6) fut össze: itt kezdünk; utána{" "}
            <M>{"D"}</M>-ben az 1, 2, 3 rúd, a már ismert <M>{"S_4"}</M>-gyel.
          </p>
        </Lepes>
        <Lepes cim="E csomópont — elkülönítés, egységvektorok, kijelentés">
          <p>
            <M>{"\\underline e_{E\\to D} = (-1;\\ 0;\\ 0)"}</M>; <M>{"\\underline e_{E\\to B} = (2;\\ -3;\\ -2)/\\sqrt{17} = (0{,}4851;\\ -0{,}7276;\\ -0{,}4851)"}</M>;{" "}
            <M>{"\\underline e_{E\\to G} = (2;\\ -3;\\ 2)/\\sqrt{17} = (0{,}4851;\\ -0{,}7276;\\ 0{,}4851)"}</M>.
          </p>
          <MB>{"(\\underline F_E, \\underline S_4, \\underline S_5, \\underline S_6) \\ekv \\underline O"}</MB>
          <MB>{"\\Fz 0 - 0{,}4851\\,S_5 + 0{,}4851\\,S_6 = 0 \\;\\Rightarrow\\; S_6 = S_5"}</MB>
          <MB>{"\\Fy -12 - 0{,}7276\\,S_5 - 0{,}7276\\,S_6 = 0 \\;\\Rightarrow\\; S_5 = S_6 = \\frac{-12}{1{,}4552} = -8{,}246\\ \\text{kN}"}</MB>
          <MB>{"\\Fx -S_4 + 0{,}4851\\,S_5 + 0{,}4851\\,S_6 = 0 \\;\\Rightarrow\\; S_4 = 0{,}4851\\cdot(-16{,}49) = -8{,}000\\ \\text{kN}"}</MB>
        </Lepes>
        <Lepes cim="D csomópont — három egyenlet, három ismeretlen">
          <p>
            <M>{"\\underline e_{D\\to A} = (-2;\\ -3;\\ -2)/\\sqrt{17} = (-0{,}4851;\\ -0{,}7276;\\ -0{,}4851)"}</M>, <M>{"\\underline e_{D\\to C} = (-0{,}4851;\\ -0{,}7276;\\ 0{,}4851)"}</M>,{" "}
            <M>{"\\underline e_{D\\to B} = (4;\\ -3;\\ -2)/\\sqrt{29} = (0{,}7428;\\ -0{,}5571;\\ -0{,}3714)"}</M>, <M>{"\\underline e_{D\\to E} = (1;\\ 0;\\ 0)"}</M>, és <M>{"S_4 = -8"}</M> már ismert (a 4-es rúd a <M>{"D"}</M>-t <M>{"-x"}</M> felé tolja).
          </p>
          <MB>{"\\Fx -0{,}4851\\,S_1 - 0{,}4851\\,S_2 + 0{,}7428\\,S_3 + 1\\cdot(-8) = 0"}</MB>
          <MB>{"\\Fy -8 - 0{,}7276\\,S_1 - 0{,}7276\\,S_2 - 0{,}5571\\,S_3 = 0"}</MB>
          <MB>{"\\Fz -0{,}4851\\,S_1 + 0{,}4851\\,S_2 - 0{,}3714\\,S_3 = 0"}</MB>
          <p>
            Az összeg <M>{"P = S_1 + S_2"}</M> és a különbség <M>{"Q = S_1 - S_2"}</M> bevezetésével az <M>{"x"}</M> és <M>{"y"}</M> egyenlet csak <M>{"P"}</M>-t és <M>{"S_3"}</M>-at tartalmazza: <M>{"P = 1{,}531\\,S_3 - 16{,}49"}</M>, majd{" "}
            <M>{"-0{,}7276\\,(1{,}531\\,S_3 - 16{,}49) - 0{,}5571\\,S_3 = 8 \\Rightarrow S_3 = 2{,}393"}</M> kN; <M>{"P = -12{,}83"}</M>; a <M>{"z"}</M> egyenletből <M>{"Q = -0{,}3714\\cdot 2{,}393/0{,}4851 = -1{,}832"}</M>.
          </p>
          <MB>{"S_1 = \\tfrac{P + Q}{2} = -7{,}330\\ \\text{kN},\\qquad S_2 = \\tfrac{P - Q}{2} = -5{,}498\\ \\text{kN},\\qquad S_3 = 2{,}393\\ \\text{kN}"}</MB>
        </Lepes>
        <Lepes cim="Ellenőrzés — a teljes tartó függőleges vetületi egyenlete">
          <p>
            A talppontok reakciói a rúderőkből: <M>{"A_y = -S_1 e_{A\\to D,y} = 7{,}330\\cdot 0{,}7276 = 5{,}333"}</M>; <M>{"C_y = 5{,}498\\cdot 0{,}7276 = 4{,}000"}</M>;{" "}
            <M>{"B_y = -2{,}393\\cdot 0{,}5571 + 8{,}246\\cdot 0{,}7276 = 4{,}667"}</M>; <M>{"G_y = 8{,}246\\cdot 0{,}7276 = 6{,}000"}</M> kN.
          </p>
          <MB>{"\\Fy 5{,}333 + 4{,}667 + 4{,}000 + 6{,}000 - 12 - 8 = 0{,}00\\ \\checkmark"}</MB>
        </Lepes>
        <Lepes cim="Eredményvázlat">
          <p>
            Nyomott: 1, 2, 4, 5, 6 (a terhek „lenyomják” a tetőt a talppontokra); húzott: 3 (<M>{"S_3 = 2{,}393"}</M> kN) — a 4-es rúd <M>{"-x"}</M> felé tolja a <M>{"D"}</M>-t, ezt a <M>{"B"}</M> felé futó 3-as rúd húzása tartja vissza.
          </p>
          <AbraKeret cim="Eredményvázlat: piros = húzott, kék = nyomott.">
            <AbraGyf6Eredmeny />
          </AbraKeret>
        </Lepes>
      </KidolgozottFeladat>

      {/* ==================== GYF‑7 ==================== */}
      <KidolgozottFeladat
        jel="GYF‑7"
        ido="10 perc"
        forras="Tankönyv 9.3. ábra és 9.3 (térbeli igénybevételek) — általános eset"
        cim="Konzol általános térbeli erővel — hat reakció és hat igénybevétel, mind nullától különböző"
        feladat={
          <p>
            A GYF‑1 konzolját (<M>{"a = 2"}</M>, <M>{"b = 3"}</M> m) az <M>{"E(-2;\\ 3;\\ 0)"}</M> pontban <M>{"\\underline F = (4;\\ -5;\\ 3)"}</M> kN terheli. Határozd meg a befogás reakcióit, majd a <M>{"K_1(0;\\ 1{,}5;\\ 0)"}</M> és{" "}
            <M>{"K_2(-1;\\ 3;\\ 0)"}</M> keresztmetszet igénybevételeit!
          </p>
        }
        abra={
          <AbraKeret cim="Általános térbeli erő a konzol végén: |F| = √(16 + 25 + 9) = 7,071 kN.">
            <AbraGyf7 />
          </AbraKeret>
        }
        tanulsag={
          <p>
            Ugyanaz a recept, mint a GYF‑1–2-ben, csak most minden komponens „él”. A vektoriális szorzat komponensképlete (<M>{"M_x = y F_z - z F_y"}</M> stb.) itt gyorsabb, mint a karok keresgélése — de a végén mindig ellenőrizd szemléletből legalább egy
            komponens előjelét. A függőleges száron a <M>{"T = M_y"}</M> csavarónyomatékot a <M>{"F_x"}</M> és <M>{"F_z"}</M> komponens adja a 2 m kinyúlással; a vízszintes száron <M>{"T = M_x = 0"}</M>, mert az erő hatásvonala metszi a szár tengelyét.
          </p>
        }
      >
        <Lepes cim="Reakciók — vetületi és nyomatéki egyenletek az A-ra">
          <MB>{"(\\underline F, \\underline A, \\underline M_A) \\ekv \\underline O"}</MB>
          <MB>{"\\Fx 4 + A_x = 0,\\quad \\Fy -5 + A_y = 0,\\quad \\Fz 3 + A_z = 0 \\;\\Rightarrow\\; \\underline A = (-4;\\ 5;\\ -3)\\ \\text{kN}"}</MB>
          <MB>{"\\underline r_E\\times\\underline F = (3\\cdot 3 - 0;\\ 0 - (-2)\\cdot 3;\\ (-2)(-5) - 3\\cdot 4) = (9;\\ 6;\\ -2)\\ \\text{kNm}"}</MB>
          <MB>{"\\sum M_{ix}:\\ 9 + M_{Ax} = 0,\\quad \\sum M_{iy}:\\ 6 + M_{Ay} = 0,\\quad \\sum M_{iz}:\\ -2 + M_{Az} = 0 \\;\\Rightarrow\\; \\underline M_A = (-9;\\ -6;\\ 2)\\ \\text{kNm}"}</MB>
        </Lepes>
        <Lepes cim="K1 (tengely: y) — a követő rész az F-fel">
          <MB>{"\\underline R_{K1} = \\underline F = (4;\\ -5;\\ 3):\\quad N = R_y = -5\\ \\text{kN (nyomott)},\\quad V_x = 4,\\quad V_z = 3\\ \\text{kN}"}</MB>
          <MB>{"\\underline M_{K1} = (\\underline r_E - \\underline r_{K1})\\times\\underline F = (-2;\\ 1{,}5;\\ 0)\\times(4;\\ -5;\\ 3) = (4{,}5;\\ 6;\\ 4):\\quad M_x = 4{,}5,\\quad T = M_y = 6,\\quad M_z = 4\\ \\text{kNm}"}</MB>
        </Lepes>
        <Lepes cim="K2 (tengely: x) — a megelőző rész az F-fel">
          <MB>{"\\underline R_{K2} = -\\underline F = (-4;\\ 5;\\ -3):\\quad N = R_x = -4\\ \\text{kN (nyomott)},\\quad V_y = 5,\\quad V_z = -3\\ \\text{kN}"}</MB>
          <MB>{"\\underline M_{K2} = -(-1;\\ 0;\\ 0)\\times(4;\\ -5;\\ 3) = -(0;\\ 3;\\ 5) = (0;\\ -3;\\ -5):\\quad T = M_x = 0,\\quad M_y = -3,\\quad M_z = -5\\ \\text{kNm}"}</MB>
        </Lepes>
        <Lepes cim="Ellenőrzés — K1 a befogás felőli (megelőző) részből">
          <p>
            Most a redukált vektorok előjelét fordítjuk; <M>{"\\underline r_A - \\underline r_{K1} = (0;\\ -1{,}5;\\ 0)"}</M>:
          </p>
          <MB>{"\\underline R_{K1} = -\\underline A = (4;\\ -5;\\ 3)\\ \\checkmark,\\qquad \\underline M_{K1} = -\\big[(0;\\ -1{,}5;\\ 0)\\times(-4;\\ 5;\\ -3) + (-9;\\ -6;\\ 2)\\big] = -\\big[(4{,}5;\\ 0;\\ -6) + (-9;\\ -6;\\ 2)\\big] = (4{,}5;\\ 6;\\ 4)\\ \\checkmark"}</MB>
        </Lepes>
        <Lepes cim="Eredményvázlat — a keresztmetszetek képe">
          <AbraKeret cim="K1 és K2 a hat-hat igénybevétellel (a megelőző rész keresztmetszetén, a globális tengelyek szerint).">
            <AbraGyf7Eredmeny />
          </AbraKeret>
        </Lepes>
      </KidolgozottFeladat>
    </>
  );
}
