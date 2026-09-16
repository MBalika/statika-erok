import { M } from "@/components/ui/Keplet";

export const KVIZ = [
  {
    k: <>Mi teszi a rácsos tartó rúdjait „tiszta rúddá” (csak rúderő ébred bennük)?</>,
    v: [<>Csuklós csomópontok, egyenes rudak és csak a csomópontokon ható terhek.</>, <>Az, hogy a rudak acélból vannak.</>, <>Az, hogy a tartó párhuzamos övű.</>, <>Az, hogy a tartót görgő és csukló támasztja.</>],
    helyes: 0,
    magyarazat: <>A tankönyv 6.1 feltételei: a rudak a végeiken csuklókkal kapcsolódnak, egyenes tengelyűek, és a terhek a csomópontokon hatnak. Ekkor egy rúdra csak két erő hat (a két végén), amelyeknek közös hatásvonalúnak kell lenniük — ez a rúd tengelye. A valódi (pl. hegesztett) csomópont nem csuklós, de a csuklós modell jó közelítés.</>,
  },
  {
    k: <>Egy rácsos tartón <M>{"c = 9"}</M> csomópont, <M>{"r = 15"}</M> rúd van, csukló és görgő támasztja. Mi igaz?</>,
    v: [<><M>{"2c = 18 = r + k = 15 + 3"}</M>: az egyensúlyi egyenletekből minden rúderő egyértelműen számolható.</>, <>Egy rúd fölösleges: a tartó határozatlan.</>, <>Hiányzik egy rúd: a tartó labilis.</>, <>A számlálásból semmi sem következik.</>],
    helyes: 0,
    magyarazat: <>Csomópontonként két vetületi egyenlet (<M>{"e = 2c"}</M>), az ismeretlenek a rúderők és a reakciók (<M>{"i = r + k"}</M>). Egyenlőség (és nem degenerált elrendezés) esetén a rendszer egyértelműen megoldható.</>,
  },
  {
    k: <>Miért nem lehet az X-rácsozású tartó rúderőit egyedül az egyensúlyi egyenletekből meghatározni?</>,
    v: [<>Mert mezőnként eggyel több rúd van, mint amennyit az egyenletek megengednek: <M>{"r + k > 2c"}</M>.</>, <>Mert az X rudak nem egyenesek.</>, <>Mert az X-ek közepén nincs csukló.</>, <>Mert túl sok a csomópont.</>],
    helyes: 0,
    magyarazat: <>Az X-rácsozás statikailag határozatlan: az egyensúly létezik, de az egyik rúderőt csak a többi paramétereként lehet kifejezni. Ezen az sem változtat, ha az X közepén csomópont van (ott két új egyenlet, de két új rúd is jön).</>,
  },
  {
    k: <>Melyik csomópontban lehet a csomóponti módszerrel azonnal új rúderőt számolni?</>,
    v: [<>Ahol legfeljebb két ismeretlen rúderő van, vagy három közül kettő egy egyenesbe esik.</>, <>Csak a támaszoknál.</>, <>Bármelyikben, mert három egyensúlyi egyenlet írható.</>, <>Csak a terhelt csomópontokban.</>],
    helyes: 0,
    magyarazat: <>Egy csomópontra közös metszéspontú erők hatnak: két független skaláregyenlet. Két ismeretlen így számolható; ha három közül kettő közös hatásvonalú, a rájuk merőleges vetületből a harmadik külön is kijön. Nyomatéki egyenlet a csomópontra nem ad újat (minden erő átmegy rajta).</>,
  },
  {
    k: <>Mit jelent, hogy egy rúderőt „húzottnak veszünk fel”?</>,
    v: [<>A csomópontra rajzolt nyíl a csomópontból a rúd másik vége felé mutat; negatív eredmény = nyomott rúd.</>, <>Csak húzott rudakkal számolunk.</>, <>A nyíl mindig felfelé mutat.</>, <>A rúderő előjele mindig pozitív.</>],
    helyes: 0,
    magyarazat: <>A rúd húzza a csomópontot maga felé. Az előjel hordozza az információt: <M>{"S > 0"}</M> húzott, <M>{"S < 0"}</M> nyomott. A rúd két végén a csomópontokra ható erők egymás ellentettjei — a tankönyv a vesszőt is elhagyja a jelölésből.</>,
  },
  {
    k: <>Terheletlen csomópontban három rúd találkozik, kettő egy egyenesbe esik. Mi következik?</>,
    v: [<>A harmadik rúd vakrúd (az egyenesre merőleges vetületi egyenletből).</>, <>Mindhárom rúd vakrúd.</>, <>A két egy egyenesbe eső rúd vakrúd.</>, <>Semmi, ez három ismeretlen.</>],
    helyes: 0,
    magyarazat: <>A tankönyv 6.5.b esete: a közös egyenesre merőleges vetületben a két egy egyenesbe eső rúd nem szerepel, csak a harmadik — ezért az nulla. A két egy egyenesbe eső rúd ereje egyenlő (a tengelyirányú vetületből), de nem feltétlenül nulla.</>,
  },
  {
    k: <>Egy rúd vakrúd az adott teherből. Kihagyhatjuk a szerkezetből?</>,
    v: [<>Nem: más teher esetén erő ébredhet benne, a vakrúd-tulajdonság a teherállástól függ.</>, <>Igen, mert soha nem dolgozik.</>, <>Igen, ha nyomott lenne.</>, <>Csak akkor, ha rácsrúd.</>],
    helyes: 0,
    magyarazat: <>A vakrúd definíciója az adott terhelésre vonatkozik. A rudat a rúd tengelyére rajzolt kis körrel jelöljük, de a szerkezetben marad — például a szél vagy egy másik teherállás dolgoztatja.</>,
  },
  {
    k: <>Hármas átmetszésnél melyik pontra írjuk a nyomatéki egyenletet egy adott rúderőhöz?</>,
    v: [<>A másik két átvágott rúd hatásvonalának metszéspontjára (a főpontra).</>, <>A vizsgált rúd felezőpontjára.</>, <>Mindig a csuklós támaszra.</>, <>A tartó súlypontjára.</>],
    helyes: 0,
    magyarazat: <>Ugyanaz, mint a három rúddal megtámasztott merev testnél (4.8. ábra): a két másik rúderő karja a főpontban nulla, így egyismeretlenes egyenlet marad. Párhuzamos övű tartónál az övrudak főpontja a szemközti öv csomópontja.</>,
  },
  {
    k: <>Párhuzamos övű tartónál hogyan számoljuk a rácsrúd erejét hármas átmetszésből?</>,
    v: [<>Az övekre merőleges (függőleges) vetületi egyenletből, mert a két öv párhuzamos, nincs metszéspontjuk.</>, <>Nem lehet átmetszéssel, csak csomóponti módszerrel.</>, <>A csuklóra írt nyomatéki egyenletből.</>, <>A rácsrúd hatásvonalának egy pontjára írt nyomatéki egyenletből.</>],
    helyes: 0,
    magyarazat: <>Két párhuzamos ismeretlent a rájuk merőleges vetületi egyenlettel zárunk ki (5. modul). A rácsrúd függőleges vetülete így a részre ható erők függőleges összegével (a „nyíróerővel”) egyenlő.</>,
  },
  {
    k: <>Miért kell K-rácsozású tartónál négyes átmetszés?</>,
    v: [<>Mert három rúd átvágásával nem esik két részre a tartó; a négy erő közül kettő közös hatásvonalú, ezért az övek mégis egyismeretlenes egyenletekből jönnek.</>, <>Mert a K-rács határozatlan.</>, <>Mert négy egyensúlyi egyenlet írható.</>, <>Mert a K-rácsban nincsenek övrudak.</>],
    helyes: 0,
    magyarazat: <>A tankönyv 6.3.2: az oszlopon át vezetett ferde négyes átmetszésben a két oszlopfél ereje közös hatásvonalú; a hatásvonaluk és az övek metszéspontjaira (az oszlop végpontjaira) írt nyomatéki egyenletekből az övek kijönnek. A két oszlopfélnek csak az eredője; a K szárait az egyenes négyes átmetszés (ismert övekkel) adja.</>,
  },
  {
    k: <>Milyen rúdjai vannak egy mellékrácsozású tartónak, és hogyan számoljuk őket?</>,
    v: [<>A fő rácsozat mezőibe illesztett kisebb rudak; csomóponti módszerrel (az alsó csomópontból a függőleges, a felsőből a ferde), vagy hármas + négyes átmetszéssel.</>, <>Ferde övek; csak grafikusan számolhatók.</>, <>Kötelek; nem vesznek fel erőt.</>, <>Az X-rácsozás rúdjai.</>],
    helyes: 0,
    magyarazat: <>A tankönyv 6.3.3 (6.8. ábra): a mellékrudak a fő rácsrudak közé kerülnek. A módszereket kombináljuk: a függőleges mellékrúd az alsó csomópontból (a vízszintes övre merőleges vetület), a ferde a felső csomópontból (a fekete rácsrúdra merőleges vetület).</>,
  },
  {
    k: <>Egy Gerber-rendszerű rácsos tartónál mi az első lépés?</>,
    v: [<>A rácsozatokat merev testnek tekintve az összetett tartó külső és belső reakcióit számoljuk (6. modul), utána jönnek a rúderők.</>, <>Rögtön a csomóponti módszer a bal támasztól.</>, <>Csak hármas átmetszés használható.</>, <>Az ilyen tartó határozatlan.</>],
    helyes: 0,
    magyarazat: <>A 6.4. fejezet: a rácsos tartó lehet külsőleg összetett (Gerber, háromcsuklós). A trapézokat merev testnek tekintve előbb a reakciók, majd a rúderők — a csuklóerő ellentettje a másik rész csomóponti terhe.</>,
  },
  {
    k: <>Egy rácsrúdra a közepén hat egy erő. Mi ébred a rúdban?</>,
    v: [<>Rúderő (N) mellett nyíróerő és hajlítónyomaték is; a többi rúd tiszta rúd marad a helyettesítő csomóponti terhekkel.</>, <>Csak rúderő, mert a rácsos tartóban ez a szabály.</>, <>Csak hajlítás.</>, <>Semmi, a teher a csomópontokra megy át.</>],
    helyes: 0,
    magyarazat: <>A tankönyv 6.5: a terhelt rudat elkülönítjük, a végein a rúddal párhuzamos és merőleges belső erőket számoljuk (nyomatéki egyenlet a végpontokra), ezek ellentettjei csomóponti terhek. A terhelt rúd viszont hajlított is — a 8. fejezet tárgya.</>,
  },
  {
    k: <>A rúderőtáblázat oszlopai a tankönyv szerint:</>,
    v: [<>rúd jele | húzott rúdban működő erő | nyomott rúdban működő erő.</>, <>rúd jele | előjeles erő | hossz.</>, <>csomópont | vízszintes vetület | függőleges vetület.</>, <>rúd jele | erő | nyomaték.</>],
    helyes: 0,
    magyarazat: <>A húzott és a nyomott rudak tönkremenetele (folyás, illetve kihajlás) és méretezése eltér, ezért a táblázat külön oszlopba sorolja őket, pozitív számokkal. Az eredményvázlat helyett ez az áttekinthető forma szokásos.</>,
  },
  {
    k: <>Lefelé ható csomóponti terhek, kéttámaszú párhuzamos övű rácsos tartó. Melyik állítás igaz szemléletből?</>,
    v: [<>A felső öv nyomott, az alsó húzott, a legnagyobb överők a terhek környékén — mint a nyomatéki ábra.</>, <>Minden övrúd húzott.</>, <>A rácsrudak mind nyomottak.</>, <>Az övek erői a támaszoknál a legnagyobbak.</>],
    helyes: 0,
    magyarazat: <>Az átmetszésnél az övrúd ereje a főpontra írt nyomatékból = a rész külső erőinek nyomatéka / magasság: az överők a hajlítónyomaték-ábrát követik (felül nyomás, alul húzás), a rácsrudak pedig a nyíróerőt (a támasz felé nőnek, előjelet a teher alatt váltanak).</>,
  },
];

export const HIBAK = [
  {
    cim: "A rúderőt nyomottnak vették fel",
    feladat: (
      <>
        Csomóponti módszer az 1. csomóponton (csukló, <M>{"A_y = 6"}</M> kN felfelé): a 3–4–5-ös rácsrúd (irány 0,6; 0,8 a 2. csomópont felé) és a vízszintes övrúd. Mekkora <M>{"S_{1,2}"}</M>?
      </>
    ),
    lepesek: [
      { szoveg: <>A csomópontra hat <M>{"A_y = 6"}</M> felfelé, <M>{"S_{1,2}"}</M> és <M>{"S_{1,3}"}</M>.</> },
      {
        szoveg: <>„A rácsrúd nyilván nyomott, ezért befelé rajzolom”: <M>{"\\Fy 6 - 0{,}8\\,S_{1,2} = 0 \\Rightarrow S_{1,2} = 7{,}5\\ \\text{kN, nyomott}"}</M>.</>,
        hibas: true,
        javitas: (
          <>
            A rúderőt <strong>mindig húzottnak</strong> vesszük fel — a csomópontból kifelé —, és az előjel dönt: <M>{"\\Fy 6 + 0{,}8\\,S_{1,2} = 0 \\Rightarrow S_{1,2} = -7{,}5"}</M> kN, azaz nyomott. A számérték ugyanaz, de a
            táblázatba, az ellenőrzésbe és a következő csomópontba a −7,5 kerül; a „saját” előjelrendszerrel a következő egyenletben biztosan összekeveredik.
          </>
        ),
      },
      { szoveg: <>Vízszintes vetület: <M>{"\\Fx 0{,}6\\cdot(-7{,}5) + S_{1,3} = 0 \\Rightarrow S_{1,3} = 4{,}5"}</M> kN (húzott).</> },
    ],
    tanulsag: <>Egyetlen előjel-megállapodás van: húzott = pozitív, a nyíl a csomópontból a rúd másik vége felé. Így a rúd két végén automatikusan ellentett erők adódnak.</>,
  },
  {
    cim: "Kihagyott vetület a második egyenletben",
    feladat: (
      <>
        A GYF‑1 3. csomópontja: ismert <M>{"S_{1,3} = 7{,}165"}</M>, <M>{"S_{2,3} = 3{,}608"}</M>, ismeretlen <M>{"S_{3,4}"}</M> (irány 0,6; 0,8) és <M>{"S_{3,5}"}</M> (vízszintes).
      </>
    ),
    lepesek: [
      { szoveg: <><M>{"\\Fy 0{,}8\\cdot 3{,}608 + 0{,}8\\,S_{3,4} = 0 \\Rightarrow S_{3,4} = -3{,}608"}</M> kN.</> },
      {
        szoveg: <><M>{"\\Fx -7{,}165 - 0{,}6\\cdot 3{,}608 + S_{3,5} = 0 \\Rightarrow S_{3,5} = 9{,}33"}</M> kN.</>,
        hibas: true,
        javitas: (
          <>
            Az imént kiszámolt <M>{"S_{3,4}"}</M> vízszintes vetülete kimaradt! Helyesen: <M>{"\\Fx -7{,}165 - 0{,}6\\cdot 3{,}608 + 0{,}6\\cdot(-3{,}608) + S_{3,5} = 0 \\Rightarrow S_{3,5} = 11{,}50"}</M> kN. A tankönyv külön
            figyelmeztet: ha a második egyenlet kényelmes (vízszintes) vetület, az előbb kiszámolt rúderő vetületét se hagyjuk ki.
          </>
        ),
      },
      { szoveg: <>Tovább a 4. csomópontra.</> },
    ],
    tanulsag: <>Írd fel a csomópontra ható <em>összes</em> erő listáját, mielőtt vetítesz — a frissen kiszámolt rúderő is közéjük tartozik.</>,
  },
  {
    cim: "Rossz főpont a hármas átmetszésnél",
    feladat: (
      <>
        GYF‑2: párhuzamos övű tartó, <M>{"b = 1{,}5"}</M> m, bal rész az <M>{"A_y = 3"}</M> kN reakcióval; átvágva <M>{"S_{2,3}"}</M> (felső öv, a 2. pontban), <M>{"S_{2,8}"}</M> (rácsrúd), <M>{"S_{7,8}"}</M> (alsó öv). Mekkora <M>{"S_{2,3}"}</M>?
      </>
    ),
    lepesek: [
      { szoveg: <>Elkülönítés: a bal részre <M>{"A_y"}</M> és a három rúderő hat.</> },
      {
        szoveg: <>Nyomaték a 2. pontra: <M>{"\\Mp{2} -2\\cdot 3 - 1{,}5\\,S_{2,3} = 0 \\Rightarrow S_{2,3} = -4"}</M> kN.</>,
        hibas: true,
        javitas: (
          <>
            A 2. pont a keresett rúd <em>saját</em> hatásvonalán van: karja nulla, az egyenletből <M>{"S_{2,3}"}</M> kiesik (a 2. pont a <M>{"S_{7,8}"}</M> főpontja). <M>{"S_{2,3}"}</M> főpontja az a pont, ahol a <em>másik két</em> rúd
            hatásvonala metszi egymást: a 8. csomópont. <M>{"\\Mp{8} -4\\cdot 3 - 1{,}5\\,S_{2,3} = 0 \\Rightarrow S_{2,3} = -8"}</M> kN.
          </>
        ),
      },
      { szoveg: <>Függőleges vetület → <M>{"S_{2,8} = 5"}</M>; nyomaték a 2. pontra → <M>{"S_{7,8} = 4"}</M> kN.</> },
    ],
    tanulsag: <>A főpont mindig a két <em>kizárandó</em> ismeretlen metszéspontja. Ha a saját rudad átmegy a ponton, az egyenlet másik rúderőt ad.</>,
  },
  {
    cim: "Vakrúd egy terhelt csomópontban",
    feladat: (
      <>
        H07, 3. csomópont: a felső öv két rúdja (2–3, 3–4) egy egyenesben, az oszlop 3–8 függőleges, és <M>{"F_1 = 10"}</M> kN lefelé hat. Vakrúd-e a 3–8 oszlop?
      </>
    ),
    lepesek: [
      {
        szoveg: <>„Három rúd, kettő egy egyenesben → a harmadik vakrúd (b eset): <M>{"S_{3,8} = 0"}</M>.”</>,
        hibas: true,
        javitas: (
          <>
            A b eset <strong>terheletlen</strong> csomópontra vonatkozik. Itt a csomóponton teher hat, méghozzá az oszlop egyenesében: a közös egyenesre merőleges vetületben a teher és az oszlop szerepel:{" "}
            <M>{"\\Fy -10 - S_{3,8} = 0 \\Rightarrow S_{3,8} = -10"}</M> kN, az oszlop <strong>nyomott</strong>. (A c eset — két rúd + a rúd egyenesébe eső teher — sem alkalmazható: itt három rúd van.)
          </>
        ),
      },
      { szoveg: <>Az övek ereje a szomszédos csomópontokból vagy átmetszésből.</> },
    ],
    tanulsag: <>A vakrúd-szabályok feltételeit szó szerint vedd: „terheletlen csomópont”, „két rúd”, „a teher a rúd egyenesében”. Egy szabály félreolvasása egy egész oszlopot tüntethet el.</>,
  },
  {
    cim: "Csuklós támasz mint vakrúd-csomópont",
    feladat: (
      <>
        Warren-tartó bal alsó csomópontja: csukló (<M>{"A_x, A_y"}</M>), két rúd (vízszintes öv és ferde rácsrúd), a tartót ferde erő terheli valahol. Vakrúd-e a vízszintes övrúd?
      </>
    ),
    lepesek: [
      {
        szoveg: <>„Terheletlen csomópont két rúddal → mindkettő vakrúd (a eset).”</>,
        hibas: true,
        javitas: (
          <>
            A csomópont nem terheletlen: a csukló reakciója hat rá, amelynek iránya ismeretlen (két komponens). A vakrúd-szabályok csak akkor alkalmazhatók, ha a csomópontra ható erő iránya ismert. Előbb a reakciókat kell
            kiszámolni; ha kiderül, hogy <M>{"A_x = 0"}</M>, akkor a függőleges reakció a c eset szerint az oszlop (ha van) egyenesébe esik — Warren-tartónál a ferde rácsrúd és az öv is dolgozik.
          </>
        ),
      },
      { szoveg: <>Reakciók → csomóponti módszer az A csomópontból: két egyenlet, két ismeretlen.</> },
    ],
    tanulsag: <>A támasz-csomópontokon a reakció is „teher”. Csuklónál a reakció iránya ismeretlen — vakrudat csak a reakciók kiszámítása után lehet ott felismerni.</>,
  },
  {
    cim: "Négy rúd átvágva — három egyenlet",
    feladat: (
      <>
        Párhuzamos övű N-rácsozású tartón egy oszlopon és a két szomszédos mező rácsrúdján át vezetett vonal négy rudat vág. „Írjuk fel a három egyensúlyi egyenletet a bal részre.”
      </>
    ),
    lepesek: [
      { szoveg: <>Elkülönítés: a bal részre a reakció és négy ismeretlen rúderő hat.</> },
      {
        szoveg: <>„Nyomaték a felső csomópontra, nyomaték az alsóra, függőleges vetület → mind a négy rúderő.”</>,
        hibas: true,
        javitas: (
          <>
            Három független egyenletből négy ismeretlent nem lehet meghatározni — ez nem a K-rács esete, ahol két erő közös hatásvonalú. Olyan vágást kell keresni, amely <strong>három</strong> rudat vág és két részre bontja a tartót
            (egy mezőn át: két öv + egy rácsrúd), vagy csomóponti módszerrel kell haladni. A négyes átmetszés csak akkor működik, ha a négy erő közül kettő közös hatásvonalú (K-rács oszlopa), és akkor is csak két rúderőt ad.
          </>
        ),
      },
      { szoveg: <>Új vágás egy mezőn át: három rúd, három egyenlet.</> },
    ],
    tanulsag: <>Számold meg, hány rudat vágsz: legfeljebb hármat, különben csak speciális elrendezésben (K-rács) van megoldás. Az átmetsző-vonal felfedezőben ezt ki is próbálhatod.</>,
  },
];
