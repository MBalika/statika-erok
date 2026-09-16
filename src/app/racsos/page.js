import { ModulFejlec, SzakaszSav } from "@/components/ModulKeret";
import { Szakasz, Kartya, Kiemelo, AbraKeret, TankonyvJel, Szotar } from "@/components/ui/Elemek";
import { M, KepletDoboz } from "@/components/ui/Keplet";
import { AbraRacsosVaz, AbraElnevezesek, AbraTipusok, AbraVakrudak, AbraAtmetszes, AbraNegyes, AbraOsszetett, AbraRudjanTerhelt } from "@/components/abrak/RacsosAbrak";
import CsomopontiHullam from "@/components/racsos/CsomopontiHullam";
import AtmetszoVonal from "@/components/racsos/AtmetszoVonal";
import EroAramlas from "@/components/racsos/EroAramlas";
import JatekVakrud from "@/components/racsos/JatekVakrud";
import RacsosKalk from "@/components/racsos/RacsosKalk";
import GyfBlokkok from "@/components/racsos/Gyf";
import GyakorloSzekcio from "@/components/racsos/GyakorloSzekcio";
import Kviz from "@/components/Kviz";
import Hibakereso from "@/components/Hibakereso";
import { KVIZ, HIBAK } from "@/components/racsos/KvizAdatok";
import { modulSlugAlapjan } from "@/lib/oldalterkep";

export const metadata = {
  title: "Rácsos tartók",
  description:
    "Rácsos tartók rúderői: csomóponti módszer, vakrudak három alapesete, hármas és négyes átmetszés (Ritter), K-rácsozás, mellékrácsozás, külsőleg összetett és rúdján terhelt rácsos tartók — interaktív eszközökkel, kidolgozott feladatokkal és gyakorlással.",
};

const modul = modulSlugAlapjan("/racsos");

const Proba = ({ children }) => <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">{children}</p>;

export default function RacsosOldal() {
  return (
    <>
      <ModulFejlec
        szam={7}
        cim="Rácsos tartók"
        leiras="Csuklókkal összekapcsolt rudak, csak a csomópontokon ható terhek: a rudakban egyetlen erő ébred, a rúderő. Ebben a modulban megtanulod, hogyan gyullad ki csomópontról csomópontra a megoldás, hogyan találod meg ránézésre a vakrudakat, és hogyan vágsz át egyetlen görbe vonallal három rudat, hogy a belsejükbe láss."
        tartalom={["Rúd, csomópont, öv, oszlop, rácsrúd", "2c = r + k — a számlálás", "Csomóponti módszer", "Vakrudak három alapesete", "Hármas és négyes átmetszés", "K-rács, mellékrácsozás, összetett és rúdján terhelt tartó"]}
      />
      <SzakaszSav szakaszok={modul.szakaszok} />

      {/* ==================== ELMÉLET ==================== */}
      <Szakasz
        id="elmelet"
        cimke="1. rész"
        cim="Elmélet"
        bevezeto="A rácsos tartó összetett tartó, de nem kell a rudakat elkülöníteni: minden rúdra csak két erő hat, ezért a rúderő a tengelyében működik. Amit el kell különíteni, azok a csomópontok — rájuk közös metszéspontú erőrendszer hat, csomópontonként két egyenlettel."
      >
        {/* --- 7.1 --- */}
        <h3 className="mt-2 text-xl font-semibold text-petrol-900">7.1 Mi a rácsos tartó?</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            <strong>Rácsos tartónak</strong> nevezzük az olyan összetett tartót, amely egymáshoz a <strong>végeiken csuklókkal</strong> kapcsolódó, általában egyenes tengelyű <strong>rudakból</strong> áll. Külső támaszai görgők, támasztórudak és csuklók
            lehetnek — befogás nem. A terhek jellemzően a <strong>csomópontokon</strong> működő koncentrált erők. Ez a három feltétel biztosítja, hogy a rudak valóban rúdként viselkednek: egy rúdra csak a két végén hat erő, a két erő
            közös hatásvonalú, és a hatásvonal átmegy a rúd két végén lévő csuklón. A rudakat tehát nem kell elkülöníteni, a csuklókra pedig <strong>közös metszéspontú</strong> erőrendszerek hatnak.
          </p>
          <p>
            A valódi szerkezetek csomópontjai gyakran nem csuklósak (hegesztett, csavarozott), a csuklós modell mégis jó közelítést ad, és lényegesen egyszerűsíti a számítást. A rácsos tartót külön tárgyaljuk, mert nagyon gyakori
            szerkezet, és mert a rúderők számítására speciális eljárások terjedtek el.
          </p>
        </div>

        <AbraKeret szam={1} cim="A tankönyv 6.1. ábrája nyomán: a) statikai váz, b) a csuklók elkülönítése. Minden rúderőt húzottnak veszünk fel, a nyíl a csomópontból a rúd másik vége felé mutat; egy rúd két végén a csomópontokra ható erők egymás ellentettjei.">
          <AbraRacsosVaz />
        </AbraKeret>

        <TankonyvJel fejezet="6.1" cim="Jelölés: S₍ᵢ,ⱼ₎ és a vessző nélküli ellentett">
          <p>
            A csuklókat sorszámozzuk; az <M>{"i"}</M> és <M>{"j"}</M> (<M>{"i < j"}</M>) csomópontokat összekötő rúd rúderejének nagysága <M>{"S_{i,j}"}</M> — az első index mindig a kisebb sorszámú végpont. Az elkülönítésnél a
            csomópontokra rajzolt nyilak a rudakról a csomópontokra ható erők irányát mutatják; mindegyiket <strong>húzottnak</strong> vesszük fel (emlékeztetőül: ezek rúderők). A rúd két végén az erők egymás ellentettjei — ezt a nyilak
            egyértelműen mutatják, ezért az ellentett erő jelöléséből a megszokott vesszőt is elhagyjuk.
          </p>
        </TankonyvJel>

        <Kiemelo tipus="definicio" cim="A számlálás: e = 2c, i = r + k">
          <p>
            Csomópontonként két független skaláregyenlet írható (közös metszéspontú erők): <M>{"e = 2c"}</M>, ahol <M>{"c"}</M> a csuklók száma. Az ismeretlenek a rúderők és a külső reakciók: <M>{"i = r + k"}</M>, ahol <M>{"r"}</M> a rudak száma,{" "}
            <M>{"k"}</M> a kényszerek fokszámának összege. Azokon a rácsos tartókon, ahol az egyenletrendszernek <em>bármilyen</em> teher esetén egyértelmű megoldása van — a példáink mind ilyenek —, teljesül a <M>{"2c = r + k"}</M> egyenlőség.
          </p>
        </Kiemelo>

        <h4 className="mt-8 text-[16px] font-semibold text-petrol-900">A rudak elnevezései és a tartótípusok</h4>
        <AbraKeret szam={2} cim="A tankönyv 6.2. ábrája nyomán: övrudak (felső és alsó öv), rácsrudak, oszlopok és összekötő rudak. A csomópontokba a csuklókat általában nem rajzoljuk be, de a számítást a csuklók figyelembevételével végezzük.">
          <AbraElnevezesek />
        </AbraKeret>
        <div className="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Kartya cimke="öv" cim="Övrudak">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">A rácsozaton keresztül húzott függőleges vonal által elmetszett legalsó és legfelső rudak; együtt az alsó és a felső öv. Ha mind párhuzamosak: <strong>párhuzamos övű</strong> tartó.</p>
          </Kartya>
          <Kartya cimke="rács" cim="Rácsrudak">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">Az alsó és a felső öv közötti <strong>ferde</strong> rudak.</p>
          </Kartya>
          <Kartya cimke="oszlop" cim="Oszlop">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">Függőleges rúd, amelynek végeihez rácsrúd is csatlakozik.</p>
          </Kartya>
          <Kartya cimke="összekötő" cim="Összekötő rúd">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">Függőleges rúd, amelynek egyik végéhez csak két, egy egyenesbe eső övrúd kapcsolódik — terheletlen csomópontnál ez vakrúd lesz.</p>
          </Kartya>
        </div>

        <AbraKeret szam={3} cim="Rácsos tartó típusok a tankönyv 6.3. ábrája nyomán: Warren (szimmetrikus), Pratt (oszlopos), K-rácsozás, íves felső öv, mellékrácsozás — és az X-rácsozás, amelynek rúderői az egyensúlyi egyenletekből nem határozhatók meg egyértelműen.">
          <AbraTipusok />
        </AbraKeret>
        <div className="proza text-[15px] leading-relaxed text-petrol-700">
          <p>
            Az X-rácsozású tartók kivételek: mezőnként eggyel több rúd van, mint amennyit az egyenletek megengednek (<M>{"r + k > 2c"}</M>), ezért az egyensúly ugyan létezik, de az egyik rúderő csak a többi paramétereként fejezhető ki. Ezen az
            sem változtat, ha az X közepén csomópont van: két új egyenlet, de két új ismeretlen is. A többi típusra viszont igaz, hogy <strong>háromszögekből felépíthető</strong>: egy három rúdból és három csuklóból álló háromszöghöz egy új csuklót
            két új rúddal kapcsolunk, és ezt ismételjük — az így kapott síkidomot egy csuklóval és egy görgővel támasztjuk meg, mintha egyetlen merev test lenne.
          </p>
          <p>
            A számítást általában a <strong>reakciók</strong> meghatározásával kezdjük, a rácsozatot egyetlen merev testnek tekintve. A csuklók teljes elkülönítését nem végezzük el, csak a módszerek használatához szükséges részeket rajzoljuk fel. A
            kiszámított rúderőket eredményvázlat helyett <strong>rúderőtáblázatban</strong> adjuk meg: első oszlop a rúd jele, második a húzott, harmadik a nyomott rudakban működő erő nagysága — mert a húzott és a nyomott rudak tönkremenetele és
            méretezése eltér.
          </p>
        </div>

        <div className="mt-6">
          <Proba>Próbáld ki – erőáramlás: told a terhet, nézd a rudakat</Proba>
          <EroAramlas />
        </div>

        {/* --- 7.2 --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">7.2 Csomóponti módszer</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            A csomóponti módszernél egy <strong>elkülönített csomópont</strong> egyensúlyi egyenleteiből határozzuk meg a rá ható, még ismeretlen rúderőket. Kétféle csomópontnál hatékony:
          </p>
        </div>
        <div className="mt-2 grid gap-4 sm:grid-cols-2">
          <Kartya cimke="≤ 2 ismeretlen" cim="Két egyenlet, két rúderő">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">Ha a csomópontra (a számítás adott fázisában) legfeljebb két ismeretlen rúderő hat, azokat két egyensúlyi (vetületi vagy nyomatéki) egyenletből meg lehet határozni.</p>
          </Kartya>
          <Kartya cimke="3 ismeretlen, 2 közös hatásvonalú" cim="A harmadik külön kijön">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">Ha három ismeretlen közül kettő közös hatásvonalú, a harmadikat a közös hatásvonalra <strong>merőleges</strong> vetületi egyenletből ki lehet számolni.</p>
          </Kartya>
        </div>
        <div className="proza mt-4 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Végig kell menni az összes csomóponton, és megnézni, hol lehet új rúderőt számolni. Egy rúderőt az egyik csomópontban kiszámolva ugyanaz a rúderő a rúd másik végén már <strong>ismert</strong> erő — így „gyullad ki” a megoldás csomópontról
            csomópontra. A tankönyv 6.4. ábrájának tartóján a reakciók után: az 1. csomópontból <M>{"S_{1,2}, S_{1,3}"}</M>; a 2.-ból <M>{"S_{2,3}, S_{2,4}"}</M>; a 3.-ból <M>{"S_{3,4}, S_{3,5}"}</M>; a 4.-ből <M>{"S_{4,5}, S_{4,6}"}</M>; az 5.-ből{" "}
            <M>{"S_{5,6}, S_{5,7}"}</M>; a 6. egyik egyenletéből <M>{"S_{6,7}"}</M>. A 6. másik egyenletét és a 7. csomópontot nem használtuk: a teljes szerkezet egyensúlyához már felhasználtunk három egyenletet — ezek <strong>ellenőrzésre</strong> valók.
          </p>
        </div>
        <Kiemelo tipus="tipp" cim="Egyismeretlenes egyenletek a csomópontban is">
          <ul className="list-disc space-y-1 pl-5">
            <li>A sorrend nem kötött: <M>{"S_{5,7}"}</M>-et és <M>{"S_{6,7}"}</M>-et könnyebb a 7. csomópontból számolni, és így a kerekítési hibák sem görögnek végig a szerkezeten.</li>
            <li>Kerüld a kétismeretlenes egyenletet: a vetületi egyenletet a <strong>kihagyni szándékozott rúdra merőlegesen</strong> írd fel, így csak a számítani kívánt rúderő vetülete szerepel benne.</li>
            <li>Ha az első rúderő ismeretében a másodikhoz egy kényelmes (vízszintes vagy függőleges) vetületi egyenletet írsz, <strong>az előbb kiszámolt rúderő vetületét se hagyd ki</strong>.</li>
          </ul>
        </Kiemelo>
        <KepletDoboz
          cimke="Egy csomópont két egyenlete (S mindig húzott, a csomópontból a rúd másik vége felé)"
          keplet={"\\Fx \\sum S_{i}\\,e_{x,i} + F_x + R_x = 0,\\qquad \\Fy \\sum S_{i}\\,e_{y,i} + F_y + R_y = 0"}
          behelyettesitve={"\\text{ismert rúderő: } S\\,(e_x, e_y)\\ \\text{a saját előjelével; a merőleges vetület: } \\textstyle\\sum F_{it} = 0,\\ t \\perp \\text{a kihagyott rúd}"}
        />

        <div className="mt-6">
          <Proba>Próbáld ki – csomóponti hullám: a csomópontok egymás után kigyulladnak</Proba>
          <CsomopontiHullam />
        </div>

        {/* --- 7.3 --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">7.3 Vakrudak</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Azokat a rudakat, amelyekben az adott teherből <strong>nem keletkezik erő</strong>, <strong>vakrudaknak</strong> nevezzük. Az, hogy egy rúd vakrúd-e, mindig az adott terheléstől függ: más teher esetén változhat a rúderő, ezért ezeket a
            rudakat sem hagyjuk ki a szerkezetből. A vakrudat a rúd tengelyére rajzolt <strong>kis körrel</strong> jelöljük. Három speciális esetben a vakrudak könnyen felismerhetők — mindegyik a csomóponti módszeren alapul.
          </p>
        </div>
        <AbraKeret szam={4} cim="A vakrudak alapesetei a tankönyv 6.5. ábrája nyomán, a zérus rúderőt adó vetületi egyenlet t irányával: a) terheletlen csomópont két rúddal, b) terheletlen csomópont két párhuzamos rúddal, c) rúddal párhuzamosan terhelt csomópont két rúddal.">
          <AbraVakrudak />
        </AbraKeret>
        <div className="mt-2 grid gap-4 sm:grid-cols-3">
          <Kartya cimke="a eset" cim="Terheletlen, két rúd">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">Ha egy terheletlen csomóponthoz csak két rúd csatlakozik, és nem esnek egy egyenesbe, <strong>mindkettő vakrúd</strong> — a rudak tengelyére merőleges vetületi egyenletekből közvetlenül adódik.</p>
          </Kartya>
          <Kartya cimke="b eset" cim="Terheletlen, három rúd, kettő egy egyenesben">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">Az egyenesre merőleges vetületi egyenletből következik, hogy a <strong>harmadik</strong> rúd vakrúd. (A két egy egyenesbe eső rúd ereje egyenlő.)</p>
          </Kartya>
          <Kartya cimke="c eset" cim="Két rúd, a teher az egyik egyenesében">
            <p className="text-[13.5px] leading-relaxed text-petrol-600">Ha a csomópontra ható teher (vagy ismert irányú reakció) hatásvonala egybeesik az egyik rúddal, a közös hatásvonalra merőleges vetületből a <strong>másik</strong> rúd vakrúd.</p>
          </Kartya>
        </div>
        <TankonyvJel fejezet="6.2.2" cim="A vakrudak továbbterjednek">
          <p>
            Amikor találtunk egy vakrudat, a rúd másik végén lévő csomópontot (ismét) meg kell vizsgálni, nem alakult-e ki ott is valamelyik alapeset. A gyakorlatban: végigmegyünk az összes csomóponton, és ha találtunk valahol vakrudat, akkor ismét
            végigmegyünk, az addig talált vakrudakat figyelembe véve.
          </p>
        </TankonyvJel>
        <Kiemelo tipus="figyelem" cim="Ami nem vakrúd-szabály">
          <ul className="list-disc space-y-1 pl-5">
            <li>Terhelt csomópont, két egy egyenesbe eső övrúd és egy oszlop, a teher az oszlop egyenesében: az oszlop <em>nem</em> vakrúd, hanem <M>{"S = -F"}</M> (a merőleges vetületből).</li>
            <li>Csuklós támasz csomópontja: a reakció iránya ismeretlen — ott csak a reakciók kiszámítása után lehet vakrudat felismerni.</li>
            <li>Szimmetria vagy a teljes számítás is adhat zérus rúderőt, amit a három alapeset nem mutat meg.</li>
          </ul>
        </Kiemelo>

        {/* --- 7.4 --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">7.4 Átmetszéses módszerek — hármas átmetszés</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Az összetett tartóknál láttuk: ha egy tartó egyensúlyban van, akkor minden darabja és azok csoportja is egyensúlyban van. A <strong>hármas átmetszés</strong> lényege, hogy képzeletben úgy vágjuk át (távolítjuk el) a rácsos tartó <strong>három
            rúdját</strong>, hogy a szerkezet két részre essen szét, és az átvágott rudakban működő erőket a két tartórész megfelelő csomópontjaira működtetjük — mindkét rész továbbra is egyensúlyban marad. Az egyik részre felírt egyensúlyi kijelentésből három
            független egyenlet, amiből a három ismeretlen rúderő meghatározható (ha a részre ható reakciókat már ismerjük). Nem kell végigmenni az odavezető csomópontokon, és a csomópontonkénti számítás hibája sem görög tovább.
          </p>
        </div>
        <AbraKeret szam={5} cim="Hármas átmetszés a tankönyv 6.6. ábrája nyomán: a) a tartó és az átmetszett rudak (a görbe vonalat azért rajzoljuk, hogy ne keverjük össze a tartó egyenes vonalaival), b) a bal, c) a jobb oldali részre ható erők.">
          <AbraAtmetszes />
        </AbraKeret>
        <div className="proza text-[15px] leading-relaxed text-petrol-700">
          <p>
            A bal vagy a jobb rész egyensúlyát is vizsgálhatjuk — célszerű azt az oldalt választani, amelyikre <strong>kevesebb külső erő</strong> hat. A három rúddal „megtámasztott” merev test rúderőinek számításakor mindig olyan egyenletet keresünk, ahol
            csak egy ismeretlen szerepel: ez ugyanaz a feladat, mint a három rúddal megtámasztott egyszerű tartó reakciószámítása (5. modul, 4.8. ábra). Minden rúderőhöz a <strong>másik kettő hatásvonalának metszéspontja</strong> — a <strong>főpont</strong> —
            a nyomatéki pont; ha a másik kettő párhuzamos (párhuzamos övek), a rájuk merőleges vetületi egyenlet marad.
          </p>
        </div>
        <KepletDoboz
          cimke="Párhuzamos övű tartó egy mezőjén át (h a tartó magassága, α a rácsrúd hajlása)"
          keplet={"\\Mp{\\text{alsó cs.}} \\ldots + h\\,S_{\\text{felső öv}} = 0,\\qquad \\Mp{\\text{felső cs.}} \\ldots - h\\,S_{\\text{alsó öv}} = 0,\\qquad \\Fy \\ldots \\pm \\sin\\alpha\\,S_{\\text{rács}} = 0"}
          behelyettesitve={"\\text{az övek a nyomatéki ábrát, a rácsrudak a nyíróerőt követik}"}
        />

        <div className="mt-6">
          <Proba>Próbáld ki – húzz egy átmetsző vonalat a tartón</Proba>
          <AtmetszoVonal />
        </div>

        {/* --- 7.5 --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">7.5 Négyes átmetszés — K-rácsozás és mellékrácsozás</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            A <strong>K-rácsozású</strong> tartónál nem tudjuk három rúd átvágásával elérni, hogy a tartó két részre essen. Ilyenkor <strong>négyes átmetszést</strong> használunk. A ferde (B) átmetszés az oszlopon át vezet: négy erő szerepel, de a két
            oszlopfél erejének <strong>közös hatásvonala</strong> miatt a hatásvonaluknak az övek hatásvonalával vett metszéspontjaira — az oszlop alsó és felső végpontjára — írt nyomatéki egyenletekből az <strong>övrudak</strong> ereje egyismeretlenes
            egyenletből számolható. A két függőleges erőnek csak az eredőjét tudjuk számolni. Ugyanezt a függőleges erőt kapjuk az egyenes (C) átmetszésben a két ferde rácsrúd erejének eredőjeként — ezt viszont a két adott irányú komponensre már
            egyértelműen fel lehet bontani. A ferde rácsrudak ismeretében az öveken lévő csomópontok függőleges vetületi egyenletéből a függőleges rudak (oszlopfelek) ereje is kijön.
          </p>
        </div>
        <AbraKeret szam={6} cim="Négyes átmetszés a tankönyv 6.7. ábrája nyomán: a) K-rácsozású tartó a B (ferde) és a C (egyenes) átmetszéssel, b) a ferde átmetszéssel felszabadított rész (két överő + két közös hatásvonalú oszloperő), c) az egyenes átmetszés (két ismert öv + a K két szára).">
          <AbraNegyes />
        </AbraKeret>
        <div className="proza text-[15px] leading-relaxed text-petrol-700">
          <p>
            <strong>Mellékrácsozású</strong> tartónál (6.3.g ábra) a módszereket kombináljuk. A mellékrácsozás rúdjait csomóponti módszerrel tudjuk kiszámolni: a függőleges rudakat az alsó csomópontjuk alapján egy függőleges (a vízszintes övre
            merőleges) vetületi egyenletből, majd ezeket is felhasználva a ferde rudakat a felső csomópontjuk alapján egy ferde (a fő rácsrúdra merőleges) vetületi egyenletből. Alternatíva: először egy hármas átmetszésből a felső övrúd ereje, majd az azt
            tartalmazó négyes átmetszésből a maradék három rúderő.
          </p>
        </div>

        <Kiemelo tipus="tipp" cim="Játék a végén">
          <p>A vakrudak felismerését a Gyakorlás részben a <strong>vakrúd-vadász</strong> játékkal edzheted: öt véletlen tartó, időre, kattintással.</p>
        </Kiemelo>

        {/* --- 7.6 --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">7.6 Külsőleg összetett rácsos tartók</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            A rácsozat háromszögekből való felépítésével nem csak egyetlen merev testnek megfelelő tartó építhető, hanem <strong>összetett tartó</strong> is. Ilyenkor a merev testeknek tekintett rácsozatokból álló összetett tartó külső és belső reakcióinak
            meghatározása után (6. modul) a rúderők már az eddig megismert módszerekkel számolhatók. A 6.9.a ábrán a bal oldali tíz háromszöget egy csukló és egy görgő tartja, ehhez kapcsolódik egy csuklóval a jobb oldali hat háromszögből álló
            befüggesztett rész, amelyet egy külső görgő is támaszt: <strong>Gerber-rendszerű</strong> rácsos tartó. A 6.9.b ábrán a két rácsozat egy-egy csuklóval kapcsolódik egymáshoz és a földhöz: a reakciókat a <strong>háromcsuklós tartó</strong> számításából
            kapjuk. A rácsos tartók alatt felrajzolt trapézok merev testeknek tekintendők.
          </p>
        </div>
        <AbraKeret szam={7} cim="Külsőleg összetett rácsos tartók a tankönyv 6.9. ábrája nyomán: a) Gerber-rendszerű, b) háromcsuklós rendszerű rácsos tartó — alattuk a merev testekből álló összetett tartó, amelyen a reakciók számíthatók.">
          <AbraOsszetett />
        </AbraKeret>

        {/* --- 7.7 --- */}
        <h3 className="mt-10 text-xl font-semibold text-petrol-900">7.7 Rúdján terhelt rácsos tartó</h3>
        <div className="proza mt-3 text-[15px] leading-relaxed text-petrol-700">
          <p>
            Az eddigi módszerek arra a feltételezésre épültek, hogy a rácsos tartóra csak a csomópontokban hatnak erők. A rúdján is terhelt rácsos tartónál is használhatók ezek a lépések — néhány előkészítő művelet után. Az egyik lehetőség: a külső
            reakciók ismeretében a többi rúderőt a tanult módszerekkel meghatározzuk, majd a terhelt rúd két végén a csuklókat egyensúlyozó erőket a csuklók egyensúlyából számítjuk; a terhelt rúdra ezek ellentettjei hatnak, és a rúd egyensúlyát
            ellenőrizhetjük.
          </p>
          <p>
            A másik lehetőség szerint a terhelt <M>{"j\\text{–}k"}</M> rudat a szomszédos csuklókkal együtt kiemeljük a szerkezetből, és a rúdvégi csuklókban belső erőket veszünk fel: az egyik komponens legyen párhuzamos a rúddal (<M>{"S^S"}</M>), a másik
            merőleges rá (<M>{"S^m"}</M>). A <M>{"j"}</M>, illetve <M>{"k"}</M> végpontokra írt nyomatéki egyenletekben rendre csak az <M>{"S^m_k"}</M>, illetve <M>{"S^m_j"}</M> merőleges erő szerepel — egyismeretlenes egyenletek. A rúd tengelyével
            párhuzamos vetületből:
          </p>
        </div>
        <KepletDoboz cimke="A tankönyv (6.1) egyenlete" keplet={"\\textstyle\\sum F_i\\!\\nearrow:\\ -S^S_j + F^S + S^S_k = 0 \\;\\Rightarrow\\; S^S_k = S^S_j - F^S"} behelyettesitve={"F^S \\text{ a teher rúdirányú vetülete}"} />
        <AbraKeret szam={8} cim="Terhelt rácsrúd a tankönyv 6.10. ábrája nyomán: a) a terhelt rúd a csomóponti rúderőkkel, b) a rúd és a rúdvégi csuklók elkülönítése, c) a terhelt rúd helyettesítése: a rúdvégi erők ellentettjei csomóponti terhekként.">
          <AbraRudjanTerhelt />
        </AbraKeret>
        <div className="proza text-[15px] leading-relaxed text-petrol-700">
          <p>
            A rúdvégi reakciók ellentettjei közvetlen csomóponti terhekként ugyanakkora erőket adnak a csomópontokra, mint az eredeti teher: ez az erőrendszer és a most már terheletlen <M>{"j\\text{–}k"}</M> rúd <strong>helyettesíti</strong> a terhelt
            rudat. A további számítás egy szokásos rácsos tartón folyik — kivéve a <M>{"j\\text{–}k"}</M> rudat, amelyben nem csak rúderő keletkezik: ezt a 9. modul (igénybevételi ábrák, tankönyv 8.1) tárgyalja.
          </p>
        </div>

        <Szotar
          sorok={[
            { itt: <>rúderő, S</>, konyv: <><M>{"S_{i,j}"}</M>, húzottnak felvéve</>, megjegyzes: "A kisebb sorszám elöl; negatív = nyomott." },
            { itt: <>vakrúd</>, konyv: <>vakrúd (zérus rúderő az adott teherből)</>, megjegyzes: "Kis kör a rúd tengelyén; a szerkezetben marad." },
            { itt: <>Ritter-féle metszés</>, konyv: <>hármas átmetszés</>, megjegyzes: "Három rúd, két rész, három egyenlet; K-rácsnál négyes átmetszés." },
            { itt: <>nyomatéki pont</>, konyv: <>főpont</>, megjegyzes: "A másik két átvágott rúd hatásvonalának metszéspontja." },
            { itt: <>eredményvázlat</>, konyv: <>rúderőtáblázat</>, megjegyzes: "rúd | húzott [kN] | nyomott [kN]." },
            { itt: <>Warren / Pratt</>, konyv: <>szimmetrikus / oszlopos rácsozás</>, megjegyzes: "6.3. ábra; K-rácsozás, mellékrácsozás, X-rácsozás." },
            { itt: <>diagonális</>, konyv: <>rácsrúd</>, megjegyzes: "A ferde rudak; a függőleges: oszlop vagy összekötő rúd." },
          ]}
        />

        <Kiemelo tipus="tipp" cim="A leggyakoribb hibák — és hogyan kerüld el őket">
          <ul className="list-disc space-y-1 pl-5">
            <li><strong>Nyomottnak felvett rúderő.</strong> Mindig húzott; a következő csomópontban a saját előjelével írd be, a rúd másik vége felé mutató egységvektorral.</li>
            <li><strong>Kihagyott vetület.</strong> A második (kényelmes) egyenletbe az imént kiszámolt rúderő vetülete is kell.</li>
            <li><strong>Rossz főpont.</strong> A főpont a két kizárandó rúd metszéspontja; ha a keresett rúd átmegy rajta, más rúderőt kapsz.</li>
            <li><strong>Négy rúd átvágva.</strong> Három egyenlet — csak K-rácsnál (közös hatásvonalú oszlopfelek) van megoldás, és akkor is csak az övekre.</li>
            <li><strong>Vakrúd-szabály terhelt csomóponton.</strong> Az a és b eset terheletlen csomópontra vonatkozik; csuklós támasznál előbb a reakció.</li>
          </ul>
        </Kiemelo>
      </Szakasz>

      {/* ==================== KIDOLGOZOTT FELADATOK ==================== */}
      <Szakasz
        id="peldak"
        cimke="2. rész"
        cim="Kidolgozott feladatok"
        bevezeto="A tankönyv példái, a H07 és H08 feladatsor és a vizsgaminta számokkal: reakciók → vakrudak → csomóponti módszer → átmetszés → rúderőtáblázat. Minden számot két független megoldó ellenőrzött."
        className="bg-white"
      >
        <GyfBlokkok />
      </Szakasz>

      {/* ==================== KALKULÁTOR ==================== */}
      <Szakasz
        id="kalkulator"
        cimke="3. rész"
        cim="Kalkulátor"
        bevezeto="Paraméteres rácsos tartó — hét tartótípus, mezőszám, méretek, legfeljebb három csomóponti teher. A program kiírja a reakciók levezetését, a vakrudakat indoklással, a csomóponti módszer lépéseit, a rúderőtáblázatot és egy választott rúdra az átmetszés egyenleteit főpontokkal."
      >
        <div className="space-y-8">
          <div>
            <h3 className="mb-2 text-[16px] font-semibold text-petrol-900">Rácsos tartó megoldó — csomóponti módszer és átmetszés levezetéssel</h3>
            <p className="mb-3 text-[14px] text-petrol-600">
              Alaphelyzetben a H07 tartója (<M>{"a = 2\\ \\text{m}"}</M>, <M>{"h = 1{,}5\\ \\text{m}"}</M>, <M>{"F_1 = 10"}</M>, <M>{"F_2 = 6\\ \\text{kN}"}</M>): <M>{"A_y = 6{,}5"}</M>, <M>{"B = 9{,}5\\ \\text{kN}"}</M>. Kattints egy rúdra, hogy arra kapd az átmetszést; K-rácsnál pipáld be az ismert öveket a
              négyes átmetszés második lépéséhez.
            </p>
            <RacsosKalk />
          </div>
          <div>
            <h3 className="mb-2 text-[16px] font-semibold text-petrol-900">Erőáramlás még egyszer</h3>
            <p className="mb-3 text-[14px] text-petrol-600">Vándorló teher, tartótípus-váltás, magasság: a rúderők élőben. Figyeld, hogyan nő a rácsrudak ereje a támaszok felé, és hol váltanak előjelet.</p>
            <EroAramlas />
          </div>
        </div>
      </Szakasz>

      {/* ==================== GYAKORLÁS ==================== */}
      <Szakasz id="gyakorlas" cimke="4. rész" cim="Gyakorlás" bevezeto="Előbb a játék, aztán a fogalmi kvíz, a hibakereső és a számolós generátorok — mindegyik új tartóval és új számokkal minden indításkor." className="bg-white">
        <h3 className="mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Előbb játssz – vakrúd-vadász</h3>
        <JatekVakrud />
        <h3 className="mt-8 mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Az ötlet – fogalmi kvíz</h3>
        <Kviz cim="Érted, vagy csak számolod?" leiras="Tizenöt kérdés a rácsos tartó feltételeiről, a csomóponti módszerről, a vakrudakról és az átmetszésekről." kerdesek={KVIZ} />
        <h3 className="mt-8 mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Hibakereső – találd meg a hibát</h3>
        <Hibakereso feladatok={HIBAK} />
        <h3 className="mt-8 mb-2 text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">Számolós gyakorlás</h3>
        <GyakorloSzekcio />

        <Kiemelo tipus="kulcs" cim="Mikor mehetsz tovább">
          <p>
            Akkor vagy kész ezzel a modullal, ha egy párhuzamos övű tartón segítség nélkül végig tudsz menni a csomópontokon (a helyes előjelekkel), egy tetszőleges rúdhoz meg tudod rajzolni a hármas átmetszést és meg tudod nevezni a főpontját, és a
            vakrudakat ránézésre bekarikázod. A következő modul (statikai határozottság) pontosan azt vizsgálja, amit itt a <M>{"2c = r + k"}</M> számlálással csak megelőlegeztünk: mikor elég, mikor kevés és mikor sok a rúd és a támasz — és mi történik, ha
            a számlálás jó, de az elrendezés rossz.
          </p>
        </Kiemelo>
      </Szakasz>
    </>
  );
}
