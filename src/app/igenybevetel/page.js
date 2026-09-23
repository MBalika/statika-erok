import Link from "next/link";
import { ModulFejlec, SzakaszSav } from "@/components/ModulKeret";
import { Szakasz, Kartya, Kiemelo, AbraKeret, TankonyvJel, Szotar } from "@/components/ui/Elemek";
import { M, MB, KepletDoboz } from "@/components/ui/Keplet";
import {
  AbraBelsoErok, AbraElojel, AbraKetOldal, AbraSzamitas, AbraVirag, AbraFerdeK7, AbraFuggvenyek, AbraElemiDarab, AbraJellegek,
  AbraParabola, AbraSarok, AbraSarokCsonk, AbraElagazas, AbraGerberElv, AbraKonzolIrany,
} from "@/components/abrak/IgenybevetelAbrak";
import VagdEl from "@/components/igenybevetel/VagdEl";
import QVMFelfedezo from "@/components/igenybevetel/QVMFelfedezo";
import ElojelFelfedezo from "@/components/igenybevetel/ElojelFelfedezo";
import FerdeTarto from "@/components/igenybevetel/FerdeTarto";
import Szakaszolo from "@/components/igenybevetel/Szakaszolo";
import MetszetKalk from "@/components/igenybevetel/MetszetKalk";
import GyfBlokkok from "@/components/igenybevetel/Gyf";
import TartoKalkulator from "@/components/tarto/TartoKalkulator";
import Gyakorlas from "@/components/igenybevetel/Gyakorlas";
import { modulSlugAlapjan } from "@/lib/oldalterkep";

export const metadata = {
  title: "Igénybevételi ábrák",
  description:
    "Belső erők, N, V, M definíciója és előjelszabálya, igénybevétel számítása egy keresztmetszetben, igénybevételi függvények és ábrák, a dV/dx = −q és dM/dx = V összefüggések, ferde és tört tengelyű tartó, elágazás, Gerber-tartó — interaktív felfedezőkkel, filmekkel, kidolgozott feladatokkal és kalkulátorral.",
};

const modul = modulSlugAlapjan("/igenybevetel");

const Proba = ({ children }) => (
  <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">{children}</p>
);

const Th = ({ children }) => <th className="px-3 py-2 text-left text-[10.5px] font-bold tracking-wider text-petrol-500 uppercase">{children}</th>;
const Td = ({ children, kiemelt }) => <td className={`px-3 py-2 text-[13px] ${kiemelt ? "font-semibold text-petrol-900" : "text-petrol-700"}`}>{children}</td>;

export default function IgenybevetelOldal() {
  return (
    <>
      <ModulFejlec
        szam={9}
        cim="Igénybevételi ábrák"
        leiras="Eddig a tartóra ható külső erőket kerestük. Most belenézünk a tartóba: mekkora erő és nyomaték adódik át egy keresztmetszeten? Ez a normálerő, a nyíróerő és a hajlítónyomaték — és a rajzuk, az igénybevételi ábra, a félév gerince: a vizsgán két feladat is erről szól."
        tartalom={[
          "Belső erők, a keresztmetszet és a két tartórész",
          "N, V, M definíciója és előjelszabálya",
          "Igénybevétel számítása egy keresztmetszetben",
          "Igénybevételi függvények és ábrák; dV/dx = −q, dM/dx = V",
          "Ferde és tört tengelyű tartó, elágazás, Gerber-tartó",
          "A tankönyv tippjei és trükkjei filmen és kalkulátorral",
        ]}
      />
      <SzakaszSav szakaszok={modul.szakaszok} />

      {/* ==================== ELMÉLET ==================== */}
      <Szakasz
        id="elmelet"
        cimke="1. rész"
        cim="Elmélet"
        bevezeto="Vágd el gondolatban a tartót egy keresztmetszetben: a két darabnak külön-külön is egyensúlyban kell lennie, ehhez a vágás helyén erő és nyomaték kell. Ezek a belső erők — és ha minden keresztmetszetre kiszámoljuk őket, megkapjuk az igénybevételi ábrákat."
      >
        {/* --- 9.1 --- */}
        <h3 className="mt-2 text-xl font-semibold text-petrol-900">9.1 Belső erők: vágjuk el a tartót</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Rúdnak azt a karcsú szerkezeti részt nevezzük, amelynek egyik irányú kiterjedése lényegesen nagyobb a többinél — ez a hosszirány. A hosszirányra merőleges síkkal kimetszett síkidom a rúd{" "}
            <strong>keresztmetszete</strong>, a keresztmetszetek súlypontján átmenő vonal a rúd <strong>tengelye</strong>. A keresztmetszetre a tengelyen lévő pontjával hivatkozunk. Ez a rúdfogalom
            általánosabb a rácsos tartóénál: a kapcsolat nem csak csuklós lehet, a teher tetszőleges.
          </p>
          <p>
            A szerkezet egyensúlyban van, tehát <strong>bármely része is egyensúlyban van</strong>. Vágjuk el a tartót egy <M>{"K"}</M> keresztmetszetben! A két rész csak úgy lehet külön-külön
            egyensúlyban, ha a vágás helyén — egy merev befogásnak megfelelően — egy tetszőleges nagyságú és irányú erő (a keresztmetszet súlypontján át) és egy nyomaték ébred. Ezek a{" "}
            <strong>belső erők</strong>; a hatás–ellenhatás miatt a két oldalon egymás ellentettjei.
          </p>
        </div>
        <AbraKeret szam={1} cim="A belső erők definíciója a tankönyv 8.1. ábrája nyomán: a szerkezet, az összes külső erő, a K-ban elvágott szerkezet befogásokkal, majd a két rész az egyensúlyozó belső erőkkel.">
          <AbraBelsoErok />
        </AbraKeret>
        <TankonyvJel fejezet="8.1.1" cim="A keresztmetszet mint kényszer">
          <p>
            A tankönyv lábjegyzete szerint a keresztmetszet ebben a megközelítésben egy olyan kényszer, amely a tőle „jobbra” és „balra” levő tartórészt kapcsolja össze, és a tetszőleges irányú relatív
            eltolódást meg a relatív elfordulást is megakadályozza — ezért felel meg egy befogásnak, és ezért három belső erő adja: két erőkomponens és egy nyomaték. Az sem számít, hogy egy erő teherként
            volt megadva vagy reakcióként számítottuk ki: a belső erőket „nem érdekli”.
          </p>
        </TankonyvJel>

        {/* --- 9.2 --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">9.2 Igénybevételek: N, V, M és az előjelszabály</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            A belső erőt nem az <M>{"xyz"}</M> koordináta-rendszerben bontjuk fel, hanem a hatása szerint. A tartó tengelyével párhuzamos komponens a <strong>normálerő</strong>, <M>{"N"}</M>{" "}
            (a keresztmetszet síkjára merőleges — a sík normálisával párhuzamos). A keresztmetszet síkjába eső komponens a <strong>nyíróerő</strong>, <M>{"V"}</M> (az irodalomban <M>{"T"}</M> és{" "}
            <M>{"Q"}</M> is). A nyomaték hatására az egyenes tengely meggörbül: ez a <strong>hajlítónyomaték</strong>, <M>{"M"}</M>.
          </p>
        </div>
        <Kiemelo tipus="definicio" cim="Az igénybevételek előjele (tankönyv 8.1.2.2)">
          <ul className="list-disc space-y-1 pl-5">
            <li>A <strong>normálerő</strong> akkor pozitív, ha a keresztmetszetből <strong>kifelé</strong> mutat, azaz húzza azt; a nyomó normálerő negatív.</li>
            <li>A pozitív <strong>nyíróerő</strong> irányát úgy kapjuk, hogy a pozitív normálerő irányát az adott keresztmetszetben az <strong>óramutató járásával megegyezően 90°-kal elforgatjuk</strong>.</li>
            <li>A <strong>hajlítónyomaték</strong> előjeléhez a tengely egyik oldalát pozitívnak jelöljük ki. Pozitív az a nyomaték, amelynek kívülről rárajzolt félköríves nyilát a <strong>pozitív oldalról indítjuk</strong>. Vízszintes vagy közel vízszintes szakaszon az <strong>alsó</strong> oldalt választjuk pozitívnak.</li>
          </ul>
          <p className="mt-2">
            A bal és a jobb oldali tartórészre ható igénybevétel előjele (és nagysága) így azonos — ezért a számértékek önmagukban elegendők, a <M>{"b"}</M> és <M>{"j"}</M> indexek elhagyhatók.
          </p>
        </Kiemelo>
        <AbraKeret szam={2} cim="A pozitív N, V és M a keresztmetszet két oldalán (tankönyv 8.2. ábra b–d): a nyilak a két részen ellentettek, az előjel ugyanaz; az M nyila a választott pozitív oldalról indul.">
          <AbraElojel />
        </AbraKeret>
        <div className="mt-2 grid gap-4 sm:grid-cols-3">
          <Kartya cimke="N" cim="Normálerő">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">Húz vagy nyom. Pozitív = húzás, mint a rúderőnél. Vízszintes tartón csak vízszintes erőkből keletkezik; ferde rúdon a függőleges teher is ad.</p>
          </Kartya>
          <Kartya cimke="V" cim="Nyíróerő">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">A keresztmetszet síkjában „elcsúsztatja” a két részt. A V betű a vertikálisra utal: gerendákon függőleges. Előjele: N 90°-kal az óramutató szerint forgatva.</p>
          </Kartya>
          <Kartya cimke="M" cim="Hajlítónyomaték">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">Meggörbíti a tengelyt. Erőpárra bontva az egyik oldalon húzó-, a másikon nyomóerő: az ábrát mindig a <strong>húzott oldalra</strong> rajzoljuk.</p>
          </Kartya>
        </div>
        <div className="mt-6">
          <Proba>Próbáld ki – forgasd a rudat, váltsd a pozitív oldalt</Proba>
          <ElojelFelfedezo />
        </div>

        {/* --- 9.3 --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">9.3 Igénybevétel számítása egy keresztmetszetben</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Jelölje <M>{"(\\underline F_b, \\underline R_b)"}</M> a K bal oldalán, <M>{"(\\underline F_j, \\underline R_j)"}</M> a jobb oldalán levő tartórészre ható erőket (terheket és reakciókat).
            Az egész szerkezet egyensúlyban van, és az elvágás után mindkét rész is:
          </p>
        </div>
        <KepletDoboz
          cimke="A tankönyv (8.1)–(8.3) kijelentései"
          keplet={"(\\underline F_b, \\underline R_b, \\underline F_j, \\underline R_j) \\ekv \\underline O\\qquad (\\underline F_b, \\underline R_b, \\underline N_{Kb}, \\underline V_{Kb}, M_{Kb}) \\ekv \\underline O\\qquad (\\underline F_j, \\underline R_j, \\underline N_{Kj}, \\underline V_{Kj}, M_{Kj}) \\ekv \\underline O"}
        />
        <div className="proza text-[15px] leading-relaxed text-petrol-700">
          <p>
            Ebből következik a módszer lényege: ha a bal rész kijelentésének mindkét oldalához hozzáadjuk a jobb oldali erőket, a bal oldalon az egész szerkezet egyensúlyi erőrendszere jelenik meg, amit
            elhagyhatunk. Marad:
          </p>
        </div>
        <KepletDoboz
          cimke="A tankönyv (8.5) és (8.7) egyenértékűsége — ezt használjuk"
          keplet={"(\\underline N_{Kb}, \\underline V_{Kb}, M_{Kb}) \\ekv (\\underline F_j, \\underline R_j)\\qquad\\qquad (\\underline N_{Kj}, \\underline V_{Kj}, M_{Kj}) \\ekv (\\underline F_b, \\underline R_b)"}
          behelyettesitve={"\\text{az egyik oldal igénybevételei} = \\text{a MÁSIK oldal összes erejének redukáltja a K pontra}"}
        />
        <AbraKeret szam={3} cim="A K keresztmetszet két oldala (tankönyv 8.3. ábra): az egész tartó, a bal rész és a jobb rész a saját belső erőivel.">
          <AbraKetOldal />
        </AbraKeret>
        <Kiemelo tipus="kulcs" cim="A recept egy keresztmetszetre">
          <ol className="list-decimal space-y-1 pl-5">
            <li>Válaszd ki az egyik oldalt (amelyiken kevesebb erő van — konzolon a szabad vég felőli).</li>
            <li>Írd fel az erre az oldalra ható <strong>összes</strong> külső erőt (terhek és reakciók).</li>
            <li>Vetítsd őket a pozitív N irányra → <M>{"N_K"}</M>; a pozitív V irányra → <M>{"V_K"}</M>; írd fel a K pontra a nyomatékukat a pozitív M forgásirányával → <M>{"M_K"}</M>.</li>
          </ol>
          <p className="mt-2">
            Így a három egyenletben mindig csak egy-egy igénybevétel az ismeretlen, és az egyenlet másik oldalát elég kiszámolni — nincs átrendezés, nincs előjelhiba. A tankönyv a pozitív irányt zárójelben
            jelzi az egyenlet előtt: <M>{"(\\leftarrow):\\ N_1 = \\ldots"}</M>, <M>{"(\\uparrow):\\ V_1 = \\ldots"}</M>, <M>{"(\\curvearrowright):\\ M_1 = \\ldots"}</M> balról; jobbról{" "}
            <M>{"(\\rightarrow), (\\downarrow), (\\curvearrowleft)"}</M>.
          </p>
        </Kiemelo>
        <AbraKeret szam={4} cim="A tankönyv 8.4.a ábrája: kéttámaszú tartó eredményvázlata (6 kN, 24 kN, 18 kN), a K₁ és K₂ keresztmetszet; a + jel az alsó (pozitív) oldalt jelöli.">
          <AbraSzamitas />
        </AbraKeret>
        <div className="grid gap-4 lg:grid-cols-2 [&>*]:min-w-0">
          <Kartya cimke="K₁ (x = 1,5 m) balról" cim="A bal oldali erő: a 6 kN reakció">
            <MB>{"(\\leftarrow):\\ N_1 = 0\\qquad (\\uparrow):\\ V_1 = +6\\ \\text{kN}\\qquad (\\curvearrowright):\\ M_1 = +6\\cdot 1{,}5 = +9\\ \\text{kNm}"}</MB>
          </Kartya>
          <Kartya cimke="K₁ jobbról — ugyanaz" cim="A jobb oldali erők: 24 kN és 18 kN">
            <MB>{"(\\rightarrow):\\ N_1 = 0\\qquad (\\downarrow):\\ V_1 = +24 - 18 = +6\\ \\text{kN}\\qquad (\\curvearrowleft):\\ M_1 = -24\\cdot 3{,}0 + 18\\cdot 4{,}5 = +9\\ \\text{kNm}"}</MB>
          </Kartya>
          <Kartya cimke="K₂ (x = 3 m) balról" cim="Csak a kar nő">
            <MB>{"(\\uparrow):\\ V_2 = +6\\ \\text{kN}\\qquad (\\curvearrowright):\\ M_2 = +6\\cdot 3{,}0 = +18\\ \\text{kNm}"}</MB>
          </Kartya>
          <Kartya cimke="K₂ jobbról" cim="Ellenőrzés">
            <MB>{"(\\downarrow):\\ V_2 = +24 - 18 = +6\\ \\text{kN}\\qquad (\\curvearrowleft):\\ M_2 = -24\\cdot 1{,}5 + 18\\cdot 3{,}0 = +18\\ \\text{kNm}"}</MB>
          </Kartya>
        </div>
        <TankonyvJel fejezet="8.2.1–8.2.2" cim="Egyik keresztmetszetből a másikba; összetett tartón négyféleképpen">
          <p>
            Ha a K keresztmetszet igénybevételeit már ismerjük, egy L keresztmetszetét a K-beliekből és a K–L közötti külső erőkből is számíthatjuk: <M>{"(N_{Lj}, V_{Lj}, M_{Lj}) \\ekv (R_{KL}, N_{Kj}, V_{Kj}, M_{Kj})"}</M>.
            Ebből következik: koncentrált erő két oldalán az erő vetületének megfelelő <strong>ugrás</strong> van N-ben, ill. V-ben, M azonos; koncentrált nyomaték két oldalán M ugrik, N és V azonos.
            Összetett tartón az egész szerkezetből vagy egyetlen testből, jobbról vagy balról — legalább négyféleképpen — számolhatunk; a gyakorlatban a legegyszerűbbet választjuk. Ökölszabályok:
            <strong> konzolon mindig kívülről</strong> (a reakciók nélkül); a tartóvégen a végre ható koncentrált hatásokból közvetlenül adódik az igénybevétel (gyakran nulla).
          </p>
        </TankonyvJel>
        <div className="mt-6">
          <Proba>Próbáld ki – vágd el a tartót, és nézd a két részt</Proba>
          <VagdEl />
        </div>

        {/* --- 9.4 --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">9.4 Ferde keresztmetszet: a „virág”</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Ferde tengelyű tartón a normálerőt és a nyíróerőt <strong>ferde vetületi egyenletekből</strong> számoljuk: az erőket a tengellyel párhuzamos és arra merőleges irányra vetítjük. A tankönyv
            8.5.a ábrájának ferde konzolján (<M>{"\\operatorname{tg}\\alpha = 3/4"}</M>) a K₇ keresztmetszet balról, az A befogás reakcióiból (2 kN ←, 5 kN ↓, 21 kNm ↷):
          </p>
        </div>
        <KepletDoboz
          cimke="Tankönyv (8.44)–(8.46): K₇ balról — ferde vetületek, a nyomaték vízszintes és függőleges karokkal"
          keplet={"(\\swarrow):\\ N_7 = +2\\cos\\alpha + 5\\sin\\alpha = +4{,}6\\ \\text{kN}\\qquad (\\nwarrow):\\ V_7 = +2\\sin\\alpha - 5\\cos\\alpha = -2{,}8\\ \\text{kN}"}
          behelyettesitve={"(\\curvearrowright):\\ M_7 = +2\\cdot 3{,}0 - 5\\cdot 4{,}0 + 21 = +7{,}0\\ \\text{kNm}"}
        />
        <div className="grid gap-4 lg:grid-cols-2 [&>*]:min-w-0">
          <AbraKeret szam={5} cim="A tankönyv 8.5.a ábrájának ferde konzolja: eredményvázlat a K₇ keresztmetszettel, és a három ábra a ferde tengelyre merőlegesen felmérve — N = +4,6 kN (húzás) és M (21-től 0-ig, K₇-ben 7) a pozitív (alsó-jobb) oldalon, V = −2,8 kN a másikon.">
            <AbraFerdeK7 />
          </AbraKeret>
          <AbraKeret szam={6} cim="A ferde keresztmetszet szögei — a „virág” (8.5.b ábra): a tengely, az N és V iránya, és egy függőleges erő felbontása.">
            <AbraVirag />
          </AbraKeret>
        </div>
        <Kiemelo tipus="tipp" cim="Ferde tartón a nyomatékot ne ferde karokkal számold">
          <p>
            A nyomatéki ábrához a vízszintes és függőleges erőkomponensekből, vízszintes és függőleges karokkal könnyebb számolni (a K₇-nél: 2 kN karja 3 m, 5 kN karja 4 m). A ferde vetületek csak N-hez és
            V-hez kellenek. A parabola belógásának képletében az <M>{"l"}</M> hossz a szakasz <em>ferde</em> hossza, a <M>{"q"}</M> intenzitás a hossz mentén megoszló erő tengelyre <em>merőleges</em> komponense.
          </p>
        </Kiemelo>

        {/* --- 9.5 --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">9.5 Igénybevételi függvények és ábrák</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Egymástól kis távolságra levő keresztmetszetek igénybevételeiből képet kapunk az igénybevételek alakulásáról, de jobb, ha <em>minden</em> keresztmetszetét felírjuk: ez a tengely mentén mért{" "}
            <M>{"x"}</M> koordináta függvényében az <strong>igénybevételi függvény</strong>. A tankönyv 8.8. ábrájának konzolján (jobbról, a szabad vég felől, <M>{"F"}</M> ferde erő a végen):
          </p>
        </div>
        <KepletDoboz
          cimke="Tankönyv (8.71)–(8.73): a konzol igénybevételi függvényei"
          keplet={"(\\rightarrow):\\ N(x) = +F\\cos\\alpha\\qquad (\\downarrow):\\ V(x) = +F\\sin\\alpha\\qquad (\\curvearrowleft):\\ M(x) = -F\\sin\\alpha\\,(l - x)"}
        />
        <AbraKeret szam={7} cim="Az igénybevételi függvények a tartó tengelyére rajzolva (tankönyv 8.9. ábra): l = 4 m, F = 10 kN, α = 30°. N és V konstans és pozitív — a tartó alatt; M lineáris és negatív — a felső (húzott) oldalon. A + és − jel minden ábrán ugyanott van.">
          <AbraFuggvenyek />
        </AbraKeret>
        <Kiemelo tipus="definicio" cim="Igénybevételi ábra">
          <p>
            Az igénybevételi függvényt a tartó tengelyével azonos tengelyen ábrázolva kapjuk az <strong>igénybevételi ábrát</strong> (normálerő-, nyíróerő- és hajlítónyomatéki ábra). Az értéket a tartó{" "}
            <strong>tengelyére merőlegesen</strong> mérjük fel; a tengely pozitív oldala az, amelyet az M pozitív definíciójához választottunk — ezért a nyomatéki ábra mindig a{" "}
            <strong>húzott oldalra</strong> kerül. Az ábrát a tengelyre merőleges sűrű, vékony <strong>sraffozás</strong> teszi teljessé: jelzi a végeredményt és a leolvasás irányát.
          </p>
          <p className="mt-2">
            <strong>Mindhárom ábrát a tartó ugyanazon pozitív oldalára rajzoljuk</strong> — arra, amelyiket a nyomaték pozitív definíciójához választottunk (vízszintes tartónál alulra). Így a pozitív
            N, V és M mindig a tartó alatt, a negatív fölötte van (tankönyv 8.3.2., 8.9. ábra). A számításnál használt (↑) vagy (↓) irány csak az előjelet adja — a rajz oldalát a pozitív oldal.
          </p>
        </Kiemelo>
        <div className="proza text-[15px] leading-relaxed text-petrol-700">
          <p>
            A függvények „szépek”, de nem célszerűek: nem látszik rajtuk a szélsőérték, és több teher esetén szakaszonként kellene felírni őket. A gyakorlatban ehelyett a teher alapján{" "}
            <strong>azonosítjuk az ábra jellegét</strong> szakaszonként (konstans, lineáris, parabola), és annyi értéket számolunk, amennyi a jelleghez kell: konstanshoz egyet, lineárishoz a két végpontot,
            parabolához a két végpontot és még egy adatot. Ehhez kellenek a differenciális összefüggések.
          </p>
        </div>

        {/* --- 9.6 --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">9.6 Differenciális összefüggések: dV/dx = −q, dM/dx = V</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Tekintsünk egy <M>{"dx"}</M> hosszú, elemien kicsiny rúddarabot. A tengelyre merőleges megoszló teher intenzitása <M>{"q(x)"}</M>, a párhuzamosé <M>{"p(x)"}</M>; a bal oldali
            keresztmetszetben <M>{"N, V, M"}</M>, a jobb oldaliban ezek egy-egy elemi növekménnyel. A darab egyensúlyban van:
          </p>
        </div>
        <AbraKeret szam={8} cim="Elemi rúdszakaszra ható erők (tankönyv 8.10. ábra). A dx-en a megoszló teher egyenletesnek tekinthető.">
          <AbraElemiDarab />
        </AbraKeret>
        <KepletDoboz
          cimke="Tankönyv (8.74)–(8.82): a három egyensúlyi egyenletből"
          keplet={"(\\rightarrow):\\ -N + p\\,dx + N + dN = 0 \\ \\Rightarrow\\ -\\frac{dN}{dx} = p(x)\\qquad (\\uparrow):\\ V - q\\,dx - (V + dV) = 0 \\ \\Rightarrow\\ \\frac{dV}{dx} = -q(x)"}
          behelyettesitve={"(\\curvearrowleft):\\ -M - V\\,dx + q\\,dx\\,\\tfrac{dx}{2} + (M + dM) = 0 \\ \\Rightarrow\\ \\frac{dM}{dx} = V(x)\\qquad\\Rightarrow\\qquad \\frac{d^2M}{dx^2} = -q(x)"}
        />
        <div className="proza text-[15px] leading-relaxed text-petrol-700">
          <p>
            A nyomatéki egyenletet a darab <em>vég</em>keresztmetszetére írjuk (így <M>{"V + dV"}</M> karja nulla), és a teherből származó <M>{"q\\,dx\\cdot dx/2"}</M> tag másodrendűen kicsiny: elhagyjuk. A
            tanulság: a teherfüggvény a nyíróerő deriváltja, a nyíróerő a nyomaték deriváltja. (Más koordináta-elrendezésnél az előjelek máshova kerülhetnek — az arányosság a lényeg.) A kapcsolatok elsősorban
            a kész ábrák <strong>ellenőrzésére</strong> valók.
          </p>
        </div>
        <Kiemelo tipus="kulcs" cim="Következmények — ezt kell tudni fejből">
          <ul className="list-disc space-y-1 pl-5">
            <li><strong>Ahol V = 0, ott M-nek szélsőértéke van</strong> (a derivált nulla). A maximális nyomaték helyét a V függvényből számoljuk.</li>
            <li>A zérus függvény a konstansnak, a konstans a lineárisnak, a lineáris a másodfokúnak a deriváltja: terheletlen szakaszon V konstans és M lineáris; egyenletes teher alatt V lineáris és M parabola.</li>
            <li>Az M ábra meredeksége minden pontban a V értéke: ahol V pozitív, M nő; ahol V ugrik, M törik.</li>
            <li>Egy szakasz nyomatéki ábráján a <strong>végponti érintők metszéspontja</strong> a szakaszra ható erők eredőjének hatásvonalára esik.</li>
          </ul>
        </Kiemelo>

        <h4 className="mt-8 text-[16px] font-semibold text-petrol-900">A teher és az ábrák jellege szakaszon belül (tankönyv táblázata)</h4>
        <div className="mt-2 overflow-hidden rounded-xl border border-[color:var(--keret)]">
          <table className="w-full">
            <thead className="bg-petrol-50"><tr><Th>teher a szakaszon</Th><Th>N ábra</Th><Th>V ábra</Th><Th>M ábra</Th></tr></thead>
            <tbody>
              <tr className="border-t border-petrol-100"><Td kiemelt>terheletlen szakasz</Td><Td>konstans</Td><Td>konstans</Td><Td>lineáris (speciálisan konstans, ha V = 0)</Td></tr>
              <tr className="border-t border-petrol-100"><Td kiemelt>tengelyirányú, egyenletesen megoszló erő</Td><Td>lineáris</Td><Td>konstans</Td><Td>lineáris (spec. konstans)</Td></tr>
              <tr className="border-t border-petrol-100"><Td kiemelt>tengelyre merőleges, egyenletesen megoszló erő</Td><Td>konstans</Td><Td>lineáris</Td><Td>másodfokú parabola</Td></tr>
              <tr className="border-t border-petrol-100"><Td kiemelt>ferde, egyenletesen megoszló erő</Td><Td>lineáris</Td><Td>lineáris</Td><Td>másodfokú parabola</Td></tr>
              <tr className="border-t border-petrol-100"><Td kiemelt>merőleges, lineárisan változó megoszló erő</Td><Td>konstans</Td><Td>másodfokú parabola</Td><Td>harmadfokú parabola</Td></tr>
            </tbody>
          </table>
        </div>
        <h4 className="mt-8 text-[16px] font-semibold text-petrol-900">Szinguláris (koncentrált) hatások alatt</h4>
        <div className="mt-2 overflow-hidden rounded-xl border border-[color:var(--keret)]">
          <table className="w-full">
            <thead className="bg-petrol-50"><tr><Th>koncentrált hatás</Th><Th>N ábra</Th><Th>V ábra</Th><Th>M ábra</Th></tr></thead>
            <tbody>
              <tr className="border-t border-petrol-100"><Td kiemelt>tengellyel párhuzamos erő</Td><Td>ugrás</Td><Td>folytonos</Td><Td>folytonos</Td></tr>
              <tr className="border-t border-petrol-100"><Td kiemelt>tengelyre merőleges erő</Td><Td>folytonos</Td><Td>ugrás (az erő értékével)</Td><Td>törés (a konvex oldal az erő nyila felé)</Td></tr>
              <tr className="border-t border-petrol-100"><Td kiemelt>ferde erő</Td><Td>ugrás</Td><Td>ugrás</Td><Td>törés</Td></tr>
              <tr className="border-t border-petrol-100"><Td kiemelt>koncentrált nyomaték</Td><Td>folytonos</Td><Td>folytonos</Td><Td>ugrás (a nyomaték értékével), az érintő azonos</Td></tr>
            </tbody>
          </table>
        </div>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            <strong>Szakaszhatár</strong> tehát: a megoszló teher kezdete, vége és intenzitás-változása, a tartótengely vége, töréspontja, elágazási pontja, és minden keresztmetszet, ahol szinguláris teher
            (koncentrált erő vagy nyomaték — a támaszok reakciója is!) hat. A támaszoknál a reakció úgy viselkedik, mint egy koncentrált erő.
          </p>
        </div>
        <AbraKeret szam={9} cim="Három mintapélda a számítómagból: koncentrált erő (V ugrik, M törik), egyenletes teher (V lineáris, M parabola), koncentrált nyomaték (V folytonos, M ugrik).">
          <AbraJellegek />
        </AbraKeret>
        <div className="mt-6">
          <Proba>Próbáld ki – állítsd a terhet, figyeld a V és M alakját</Proba>
          <QVMFelfedezo />
        </div>

        <h4 className="mt-8 text-[16px] font-semibold text-petrol-900">A parabola megrajzolása: ql²/8</h4>
        <div className="proza mt-2 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Egyenletesen megoszló teher alatt a nyomatéki ábra parabola. Két végpontját kiszámoljuk, és a végpontokat összekötő egyeneshez képest térítjük el a görbét — a másodfokú parabola{" "}
            <strong>belógása</strong> (a tankönyv a fontossága miatt nagy betűvel írja):
          </p>
        </div>
        <KepletDoboz cimke="A parabola belógása a húrhoz képest — nyomaték mértékegységű" keplet={"\\frac{q\\,l^2}{8}"} behelyettesitve={"q:\\ \\text{a teher tengelyre merőleges komponense},\\quad l:\\ \\text{a szakasz (ferde) hossza}"} />
        <AbraKeret szam={10} cim="A parabola szerkesztése: húr a két végponti nyomaték között, a felezőpontból a teher irányába ql²/8 → a parabola középső pontja (érintője a húrral párhuzamos); még egy ql²/8 lejjebb a végponti érintők metszéspontja.">
          <AbraParabola />
        </AbraKeret>
        <TankonyvJel fejezet="8.3.3" cim="A kifeszített gumikötél és a pontok sűrítése">
          <p>
            A teher és a nyomatéki ábra kapcsolatát úgy is ellenőrizheted, hogy képzeletben egy kifeszített gumikötélre működteted a tartó terheit: a kötél alakja a nyomatéki ábráé — terheletlen szakaszon
            egyenes, koncentrált erő alatt törés, megoszló erő alatt görbül. Ha több pont kell a parabolához: felezd meg az érintők metszéspontja és a parabolapontok közötti szakaszokat, az így kapott két
            pontot összekötő szakasz felezőpontja újabb parabolapont, a szakasz pedig ottani érintő. A kiszámított értékeket az ábra mellé írjuk és sorszámozzuk (<M>{"M_2"}</M>: balról a második).
          </p>
        </TankonyvJel>
        <div className="mt-6">
          <Proba>Próbáld ki – hol kezdődik új szakasz?</Proba>
          <Szakaszolo />
        </div>

        {/* --- 9.7 --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">9.7 Tippek, trükkök, technikák tartótípusonként</h3>
        <h4 className="mt-6 text-[16px] font-semibold text-petrol-900">Konzoltartó (8.4.1)</h4>
        <div className="proza mt-2 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Bármely igénybevétel <strong>kívülről</strong>, a nem megtámasztott vég felől, a reakcióktól függetlenül számolható. Az ábrát is kívülről kezdve rajzoljuk, pontonként és szakaszonként —
            így akár a terhek nagyságától független, <strong>alakhelyes</strong> ábrák is rajzolhatók. Bal oldalán befogott konzolon jobbról, jobb oldalán befogotton balról, alul befogott oszlopon felülről
            számolunk; a végén a befogásnál levő igénybevételekből a reakciók kiolvashatók.
          </p>
        </div>
        <AbraKeret szam={11} cim="Konzolon a szabad vég felől haladunk; a befogásnál az ábrák végértékei a reakciók.">
          <AbraKonzolIrany />
        </AbraKeret>

        <h4 className="mt-6 text-[16px] font-semibold text-petrol-900">Kéttámaszú tartó (8.4.2)</h4>
        <div className="grid gap-4 lg:grid-cols-2 [&>*]:min-w-0">
          <Kartya cimke="tartóvégek" cim="Mi van a végkeresztmetszetben?">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">A tartóvégen az igénybevételt az ottani koncentrált hatásokból számoljuk: ha nem hat koncentrált erő, N és V nulla; ha nem hat koncentrált nyomaték, M nulla. Ha hat (akár egy támasz reakciója), a megfelelő ábra végértéke nem nulla.</p>
          </Kartya>
          <Kartya cimke="haladás" cim="Egy irányból, ugyanarról az oldalról">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">A reakciók után az egyik végről indulunk, és a másik felé haladva mindig ugyanarról az oldalról számolunk: mindig csak egy hatással kell többet figyelembe venni, a karokat módosítani. A másik végen a túloldalról ellenőrzünk.</p>
          </Kartya>
          <Kartya cimke="konzolos" cim="Konzolosan túlnyúló tartó">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">A konzolon kívülről számolunk, az „egy irányból végig” elvet csak a két támasz között követjük, és a támasznál ellenőrizzük a találkozást. Ha a támaszköz egyetlen terheletlen szakasz, a lineáris M két végpontja már ismert a konzolokból.</p>
          </Kartya>
          <Kartya cimke="ellenőrzés" cim="Amit ránézésre látni kell">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">Támasznál V ugrik a reakcióval, M törik; belső csuklónál M = 0; szabad végen minden nulla; V = 0 alatt M-csúcs; koncentrált nyomatéknál M ugrik pontosan a nyomaték értékével.</p>
          </Kartya>
        </div>

        <h4 className="mt-6 text-[16px] font-semibold text-petrol-900">Ferde tengelyű tartószakasz (8.4.3)</h4>
        <div className="proza mt-2 text-[15px] leading-relaxed text-petrol-700">
          <p>
            A tengelyhez képest a függőleges erők is ferdék, és a megoszló teher megoszlási módja (hossz vagy vetület mentén) pontosan kezelendő. N és V a ferde vetületi egyenletekből, M inkább a vízszintes és
            függőleges komponensekből. A parabola belógásában <M>{"l"}</M> a ferde hossz, <M>{"q"}</M> a merőleges komponens — esetleg szögfüggvénnyel átváltva.
          </p>
        </div>
        <div className="mt-4">
          <Proba>Próbáld ki – döntsd meg a tartót</Proba>
          <FerdeTarto />
        </div>

        <h4 className="mt-6 text-[16px] font-semibold text-petrol-900">Tört tengelyű tartó sarka (8.4.3)</h4>
        <div className="proza mt-2 text-[15px] leading-relaxed text-petrol-700">
          <p>
            A törésnél megváltozik a normálerő és a nyíróerő iránya, ezért a törés mindig szakaszhatár. A törésből két irányba kiinduló <strong>tartócsonkoknak egyensúlyban kell lenniük</strong>: a két csonk
            N-jei és V-i (meg a sarokra ható esetleges koncentrált erő) teljesítik a vetületi egyenleteket — derékszögű saroknál az egyik csonk N-je a másik V-je. A nyomatékok egyensúlyából (ha a sarkon nem hat
            koncentrált nyomaték) a két csonk hajlítónyomatéka <strong>azonos nagyságú</strong>, és egymással ellentétesen forgat. A nyomatéki ábra a húzott oldalra kerül, ezért a sarok két oldalán ugyanazon
            az oldalon van: <strong>befordul a sarkon</strong>.
          </p>
        </div>
        <AbraKeret szam={12} cim="Nyomatéki ábra a sarokban (tankönyv 8.11. ábra nyomán), három szerkezeten a számítómagból (L konzol; keret vízszintes erővel a sarkon; ferde + vízszintes szakasz): a sarok két oldalán az ábra ugyanazon az oldalon marad, és az érték átmegy (18, 12, 6 kNm).">
          <AbraSarok />
        </AbraKeret>
        <AbraKeret szam={13} cim="A sarok két csonkjára ható nyomatékok: egyenlő nagyság, ellentétes forgatás; a nyilat mindkettőnél a húzott (konvex vagy konkáv) oldalról indítjuk.">
          <AbraSarokCsonk />
        </AbraKeret>

        <h4 className="mt-6 text-[16px] font-semibold text-petrol-900">Elágazásos tartó (8.4.4)</h4>
        <div className="proza mt-2 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Az elágazás minden kapcsolódó szakasznak határa. Ahol lehet, a távolabbi vég felől számolunk; a csomópontot az értékek ellenőrzésére vagy az utolsó érték kiszámítására használjuk. A csonkot
            kinagyítva minden ágra felrajzoljuk a leolvasott nyomatékot — a nyilat arról az oldalról indítjuk, ahol az ábra van, a csomóponthoz képest kívülről —, és felírjuk a nyomatékok egyensúlyi egyenletét
            az előjeleket szemléletből (a nyilak irányából) véve.
          </p>
        </div>
        <AbraKeret szam={14} cim="Nyomatéki ábra egyensúlya az elágazásban (tankönyv 8.12. ábra nyomán): a nyilak irányából, ↷ pozitívnak véve +|M₁| − |M₂| − |M₃| = 0, azaz 16 − 10 − 6 = 0.">
          <AbraElagazas />
        </AbraKeret>

        <h4 className="mt-6 text-[16px] font-semibold text-petrol-900">Összetett tartó és Gerber-tartó (8.4.5–8.4.6)</h4>
        <div className="proza mt-2 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Összetett szerkezeten bármely, a keresztmetszetet tartalmazó szerkezeti résszel számolhatunk, ha a rá ható belső reakciókat is figyelembe vesszük. A belső csuklós kapcsolatnál a reakciókból közvetlenül
            adódik N és V, a hajlítónyomaték pedig <strong>a belső csuklónál nulla</strong> (kivéve, ha közvetlenül a csukló melletti keresztmetszetben koncentrált nyomaték hat). Gerber-tartón előbb a
            befüggesztett részt, majd a fix rész szakaszait számoljuk, de az ábrákat <strong>közös rajzba</strong> tesszük: azonos lépték mellett a csuklónál az ábrák folytonosan csatlakoznak, és az M ábra éppen a
            csuklón megy át.
          </p>
        </div>
        <AbraKeret szam={15} cim="A tankönyv 8.7. ábrájának Gerber-tartója (p = 6 kN/m; reakciók 36,75, 58,05 és 1,2 kN): a V ábra a csuklónál folytonos, az M ábra a G csuklón átmegy — részletesen a GYF‑7-ben.">
          <AbraGerberElv />
        </AbraKeret>

        <Szotar
          sorok={[
            { itt: <>belső erők, igénybevételek</>, konyv: <>igénybevétel: N, V, M</>, megjegyzes: "A keresztmetszet síkjára merőleges (N), síkjába eső (V) erő és a hajlítónyomaték (M)." },
            { itt: <>nyíróerő <M>{"V"}</M></>, konyv: <>V (az irodalomban T, Q)</>, megjegyzes: "Vertikális; Querkraft = tengelyre merőleges erő." },
            { itt: <>pozitív oldal, húzott oldal</>, konyv: <>a tengely pozitív oldala; az M ábra a húzott oldalra kerül</>, megjegyzes: "Vízszintes rúdnál alul; a + jelet az ábrán feltüntetjük. Az N és a V ábra pozitív értékei is erre az oldalra kerülnek." },
            { itt: <>a másik oldal erőinek redukálása</>, konyv: <M>{"(N_{Kb}, V_{Kb}, M_{Kb}) \\ekv (F_j, R_j)"}</M>, megjegyzes: "Az egyik oldal igénybevételei egyenértékűek a másik oldal összes erejével." },
            { itt: <>(←), (↑), (↷) írásmód</>, konyv: <>a pozitív irány zárójelben az egyenlet előtt</>, megjegyzes: "Nincs átrendezés: az egyenlet egyik oldalán csak az igénybevétel." },
            { itt: <>szakaszhatár, töréspont</>, konyv: <>szinguláris teher, szakaszok jellege (fokszáma)</>, megjegyzes: "Koncentrált erő/nyomaték, megoszló teher határa, támasz, csukló, sarok." },
            { itt: <>belógás</>, konyv: <M>{"ql^2/8"}</M>, megjegyzes: "A parabola eltérése a húrtól a szakasz közepén; nyomaték mértékegységű." },
            { itt: <>alakhelyes ábra</>, konyv: <>alakhelyes igénybevételi ábra</>, megjegyzes: "A terhek nagyságától függetlenül helyes jelleg (fokszám, törés, ugrás, érintő) — a H09–H12 feladatok ezt kérik." },
          ]}
        />
        <Kiemelo tipus="figyelem" cim="A leggyakoribb hibák az igénybevételi ábrákban">
          <ul className="list-disc space-y-1 pl-5">
            <li><strong>Az M ábra a rossz oldalon.</strong> A nyomatéki ábra a húzott oldalra kerül: kéttámaszú tartó lefelé ható teherrel → alul; konzol lefelé ható teherrel → felül (a befogásnál).</li>
            <li><strong>Az N és a V ábra a másik oldalon.</strong> Mindhárom ábra ugyanarra a pozitív oldalra kerül: vízszintes tartónál a pozitív N és V is alulra (mint a pozitív M), a negatív felülre — a „(↑) pozitív” csak a számítás előjelszabálya, nem a rajz oldala.</li>
            <li><strong>A maximum az erő alatt.</strong> Egyenletes teherrel a nyomaték maximuma ott van, ahol V = 0 — ezt ki kell számolni, nem az F alá vagy a tartó közepére tenni.</li>
            <li><strong>Ugrás az M-ben koncentrált erőnél.</strong> Koncentrált erő az M ábrában csak törést ad; ugrást csak koncentrált nyomaték.</li>
            <li><strong>Kihagyott támasz.</strong> A reakció koncentrált erő: V ugrik, M törik, a támasz szakaszhatár.</li>
            <li><strong>Csuklóban nem nulla M.</strong> Belső csuklónál M = 0 (kivéve koncentrált nyomaték közvetlenül mellette); ha az ábra nem megy át a csuklón, a reakciók rosszak.</li>
            <li><strong>Sarok.</strong> A nyomaték átmegy a sarkon (azonos érték, ugyanazon az oldalon), N és V szerepet cserél.</li>
          </ul>
        </Kiemelo>
      </Szakasz>

      {/* ==================== KIDOLGOZOTT FELADATOK ==================== */}
      <Szakasz
        id="peldak"
        cimke="2. rész"
        cim="Kidolgozott feladatok"
        bevezeto="Nyolc feladat a tankönyv példáiból, a H09–H12 feladatsorokból és a vizsgamintából. A recept mindig ugyanaz: reakciók (röviden) → szakaszok → szakaszonként N, V, M → töréspontok és szélsőértékek → ábrák → ellenőrzés. Az ábrákat a számítómag egzaktan rajzolja — a feladatod, hogy fejben is ugyanoda juss."
        className="bg-white"
      >
        <GyfBlokkok />
      </Szakasz>

      {/* ==================== KALKULÁTOROK ==================== */}
      <Szakasz
        id="kalkulator"
        cimke="3. rész"
        cim="Kalkulátorok"
        bevezeto="Az Ábrakalkulátor tetszőleges egyszerű és összetett tartó N, V, M ábráját rajzolja a reakciók levezetésével; a keresztmetszet-kalkulátor egyetlen K keresztmetszet igénybevételeit vezeti le a bal részből, a tankönyv írásmódjával."
      >
        <div className="space-y-8">
          <div>
            <h3 className="mb-2 text-[16px] font-semibold text-petrol-900">Ábrakalkulátor — reakciók, N, V, M ábrák, metszet-csúszka</h3>
            <p className="mb-3 text-[14px] text-petrol-600">
              Válassz sablont (kéttámaszú, konzol, konzolos, Gerber, keret, …), állítsd a paramétereket, és nézd az ábrákat élőben; a metszet-csúszkával bármely keresztmetszet értékei leolvashatók, a levezetés
              a tankönyv receptje szerint épül fel. Teljes képernyőn, több sablonnal:{" "}
              <Link href="/tartokalkulator" className="font-semibold text-petrol-800 underline decoration-naracs-400 underline-offset-2 hover:text-naracs-600">Ábrakalkulátor →</Link>
            </p>
            <TartoKalkulator />
          </div>
          <div>
            <h3 className="mb-2 text-[16px] font-semibold text-petrol-900">Igénybevétel egy adott keresztmetszetben</h3>
            <p className="mb-3 text-[14px] text-petrol-600">
              Add meg a tartót és az <M>{"x"}</M> helyet: a program a K-tól balra eső rész egyensúlyából írja fel az <M>{"N_K, V_K, M_K"}</M> egyenleteket (<M>{"\\Fx"}</M>, <M>{"\\Fy"}</M>,{" "}
              <M>{"\\Mp{K}"}</M>), majd ugyanezt a tankönyv rövid <M>{"(\\leftarrow), (\\uparrow), (\\curvearrowright)"}</M> írásmódjával — pont úgy, ahogy a gyakorlaton kérik.
            </p>
            <MetszetKalk />
          </div>
        </div>
      </Szakasz>

      {/* ==================== GYAKORLÁS ==================== */}
      <Szakasz
        id="gyakorlas"
        cimke="4. rész"
        cim="Gyakorlás"
        bevezeto="Ábrarajzoló játék, alakhelyesség-kvíz, számolós generátorok, fogalmi kvíz és hibakereső — a vizsga 2. és 4. feladatára készülve, minden indításkor új számokkal."
        className="bg-white"
      >
        <Gyakorlas />

        <Kiemelo tipus="kulcs" cim="Mikor mehetsz tovább — és mi jön ezután">
          <p>
            Akkor vagy kész ezzel a modullal, ha egy konzol és egy kéttámaszú tartó (megoszló teherrel, koncentrált erővel és nyomatékkal) N, V, M ábráját segítség nélkül, alakhelyesen és a jellemző
            értékekkel meg tudod rajzolni, tudod, hol van a nyomaték maximuma, és egy tört tengelyű vagy Gerber-tartón is átviszed a nyomatékot a sarkon, illetve nullázod a csuklóban. A{" "}
            <strong>10. modulban</strong> ugyanezek a belső erők térben jelennek meg: egy térbeli tartó keresztmetszetén már hat igénybevétel van (normálerő, két nyíróerő, csavarónyomaték és két
            hajlítónyomaték) — és a reakciókat is hat egyenletből számoljuk.
          </p>
        </Kiemelo>
      </Szakasz>
    </>
  );
}
