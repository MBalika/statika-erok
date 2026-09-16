import { M } from "@/components/ui/Keplet";

export const KVIZ = [
  {
    k: <>Mit ad át egy terheletlen belső csukló a két összekapcsolt test között?</>,
    v: [<>Erőt (két komponenssel), nyomatékot nem — a testek egymáshoz képest elfordulhatnak.</>, <>Csak nyomatékot.</>, <>Erőt és nyomatékot is.</>, <>Semmit, hiszen a csukló szabadon forog.</>],
    helyes: 0,
    magyarazat: (
      <>
        A belső csukló a két pont eltolódását teszi azonossá (fokszáma 2), az elfordulást nem: ezért belső reakció<em>erő</em> ébred benne (<M>{"C_x, C_y"}</M>), belső reakció<em>nyomaték</em> nem. A csuklóban a
        nyomaték nulla — ezt használjuk ki a rá írt nyomatéki egyenletben.
      </>
    ),
  },
  {
    k: <>Elkülönítéskor a belső csuklóban a két testre felvett erőkről mi igaz?</>,
    v: [<>Azonos nagyságúak és ellentétes irányúak (hatás–ellenhatás), ezért az egyik testen felvett irány rögzíti a másikét.</>, <>Mindkét testre azonos irányban vesszük fel őket.</>, <>Csak az egyik testre kell felvenni, a másikra nem hat.</>, <>Az irányukat a teherből kell kitalálni.</>],
    helyes: 0,
    magyarazat: (
      <>
        Newton harmadik törvénye: a belső reakciók párban lépnek fel és egymás ellentettei. A tankönyv (5.1.1) ezért <M>{"C_x, C_y"}</M> után a másik testre <M>{"C'_x, C'_y"}</M>-t rögzítetten ellentétes irányban veszi
        fel — az értékük számszerűen azonos.
      </>
    ),
  },
  {
    k: <>Mi a Gerber-tartó <strong>befüggesztett része</strong>?</>,
    v: [<>Az a test, amely a saját külső kényszereivel nem állna meg, csak a többi részre támaszkodva — elkülönítve az egyensúlyi kijelentésében pontosan három ismeretlen van.</>, <>Az a test, amelyre a legtöbb teher hat.</>, <>Az a test, amelyet befogás tart.</>, <>Mindig a bal oldali test.</>],
    helyes: 0,
    magyarazat: (
      <>
        A fix rész csupán a külső kényszereivel is tartó (pl. csukló + görgő); a befüggesztett résznek ehhez kevés a külső kényszere (pl. egy görgő), a belső csuklóval együtt viszont épp három ismeretlent hoz — ezért
        vele kezdünk, kéttámaszú tartóként.
      </>
    ),
  },
  {
    k: <>Gerber-tartónál miért a befüggesztett résszel kezdjük a számítást?</>,
    v: [<>Mert annak egyensúlyi kijelentésében három ismeretlen van, tehát egyismeretlenes egyenletekkel megoldható; az így kapott csuklóerő ellentettje aztán teherként hat a fix részre.</>, <>Mert a fix rész reakciói nem számíthatók.</>, <>Mert így elkerüljük a nyomatéki egyenleteket.</>, <>Csak megszokásból, a sorrend tetszőleges.</>],
    helyes: 0,
    magyarazat: (
      <>
        A fix rész kijelentésében öt ismeretlen van (saját reakciók + csuklóerő), abból nem lehet kezdeni. A befüggesztett rész megoldása után a csuklóerőt ismert teherként „adjuk át”, és a fix rész is egyszerű tartóvá
        válik. Ez egyben az építés fordított sorrendje.
      </>
    ),
  },
  {
    k: <>Háromcsuklós tartó, a két külső csukló azonos magasságban. Melyik egyenletből jön ki közvetlenül <M>{"B_y"}</M>?</>,
    v: [<>Az egész szerkezetre az <M>{"A"}</M> csuklóra írt nyomatéki egyenletből.</>, <>A II. testre a <M>{"C"}</M>-re írt nyomatéki egyenletből.</>, <>A függőleges vetületi egyenletből.</>, <>Sehonnan, csak kétismeretlenes egyenletrendszerből.</>],
    helyes: 0,
    magyarazat: (
      <>
        Az <M>{"A"}</M> ponton átmegy <M>{"A_x"}</M>, <M>{"A_y"}</M> és — azonos magasság miatt — <M>{"B_x"}</M> hatásvonala is, a csuklóerők pedig az egész szerkezetre kiesnek: csak <M>{"B_y"}</M> marad. Eltérő magasságú
        támaszoknál <M>{"B_x"}</M> is benne maradna, ekkor kell a tankönyv kétismeretlenes rendszere.
      </>
    ),
  },
  {
    k: <>Háromcsuklós keretet csak függőleges terhek érnek. Mi igaz a vízszintes reakciókra?</>,
    v: [<>Nem nullák: <M>{"A_x = -B_x"}</M>, ez a „tolóerő”, amely a csuklóban a nulla nyomatékot biztosítja.</>, <>Nullák, mert nincs vízszintes teher.</>, <>Csak akkor nem nullák, ha a keret aszimmetrikus.</>, <>Egyenlő irányúak és nagyságúak.</>],
    helyes: 0,
    magyarazat: (
      <>
        A <M>{"C"}</M>-re írt nyomatéki egyenletben a fél keretre <M>{"B_y"}</M> nyomatékát csak <M>{"B_x"}</M> tudja kiegyenlíteni (a csuklóban nincs nyomaték). A tankönyv lábjegyzete külön figyelmeztet: a külső
        csuklók vízszintes komponenseiről ne feledkezzünk meg. ΣF<sub>x</sub> miatt <M>{"A_x = -B_x"}</M>.
      </>
    ),
  },
  {
    k: <>Egy belső csuklót közvetlenül <M>{"F"}</M> erő terhel. Mi igaz a két testre ható csuklóerőkre?</>,
    v: [<>Nem egymás ellentettei: a csuklóra ható ellentettjeik <M>{"F"}</M>-fel tartanak egyensúlyt, <M>{"C_I = F - C_{II}"}</M>.</>, <>Továbbra is egymás ellentettei, a teher az egyik testre kerül.</>, <>Mindkettő nulla, mert a teher a csuklón van.</>, <>Egyenlők és azonos irányúak.</>],
    helyes: 0,
    magyarazat: (
      <>
        A terhelt csuklót külön kell elkülöníteni (5.2.d, 5.9. ábra): rá három erő hat — <M>{"F"}</M>, <M>{"C'_I"}</M>, <M>{"C'_{II}"}</M> —, közös metszéspontú erőrendszer, két vetületi egyenlet. A két testre ható
        csuklóerő különbsége éppen a csuklón ható teher.
      </>
    ),
  },
  {
    k: <>Hány független egyensúlyi egyenlet írható fel egy két merev testből álló összetett tartóra, ha van egy csukló, amelyre három erő hat?</>,
    v: [<>3 + 3 + 2 = 8: testenként három, a csuklóra (közös metszéspontú erőrendszer) kettő.</>, <>6, a csukló nem ad egyenletet.</>, <>9, a csukló is merev test.</>, <>3, mert a szerkezet egyben is merev.</>],
    helyes: 0,
    magyarazat: (
      <>
        Merev testre síkban három, közös metszéspontú erőrendszerre (csuklóra) kettő független egyenlet írható — a csuklóra írt nyomatéki egyenlet üres lenne. Ezért a függesztőmű <M>{"D"}</M>, <M>{"E"}</M> csuklói két-két
        egyenletet adnak a rúderőkre.
      </>
    ),
  },
  {
    k: <>Mikor <em>nem</em> kell egy szerkezeti elemet külön elkülöníteni?</>,
    v: [<>Ha csak két pontján kapcsolódik csuklósan és más erő nem hat rá: rúdként kezelhető, a két végén azonos nagyságú, közös hatásvonalú, ellentett erővel.</>, <>Ha egyenes.</>, <>Ha kettőnél több erő hat rá.</>, <>Soha, mindent el kell különíteni.</>],
    helyes: 0,
    magyarazat: (
      <>
        A tankönyv 5.1.2: két erő csak akkor tarthat egyensúlyt, ha közös hatásvonalúak és ellentettek. Ezért a rúd (akár töröttvonalú!) végein a rúderő a két csuklót összekötő egyenesen hat. Ha az elemre külső erő is hat,
        el kell különíteni.
      </>
    ),
  },
  {
    k: <>Miért jó ellenőrző egyenlet az <em>egész szerkezetre</em> írt függőleges vetületi egyenlet Gerber-tartónál?</>,
    v: [<>Mert a belső csuklóerők kiesnek belőle (hatás–ellenhatás), és minden reakció szerepel benne — egy csuklóerő-hiba nem tudja „elfedni” magát.</>, <>Mert csak egy tagja van.</>, <>Mert abból számoltuk a csuklóerőt.</>, <>Nem jó, mert a belső erők is benne vannak.</>],
    helyes: 0,
    magyarazat: (
      <>
        Az összegzett kijelentésben (<M>{"\\Sigma"}</M>) csak a terhek és a külső reakciók maradnak. Ha egy ilyen egyenletet nem használtunk fel, kiváló ellenőrzés — a terhelt csuklónál viszont a csuklón ható teher
        benne marad!
      </>
    ),
  },
  {
    k: <>Két testet egy csukló köt össze; az egyik csuklóval, a másik görgővel támaszkodik a földre. Tartó-e ez?</>,
    v: [<>Nem: a fix rész megtámasztása hiányos (2 + 1 + 2 = 5 ismeretlen a 6 egyenlethez), mechanizmus — függesztőművel vagy feszítőművel tehető tartóvá.</>, <>Igen, ez a klasszikus Gerber-tartó.</>, <>Igen, ez háromcsuklós tartó.</>, <>Csak akkor, ha a terhek szimmetrikusak.</>],
    helyes: 0,
    magyarazat: (
      <>
        A tankönyv 5.3.5 pont ezzel vezeti be a függesztőművet: a Gerber-tartóhoz képest a fix rész megtámasztása hiányos, a háromcsuklóshoz képest a görgő kevés. A rudak (a csuklókkal) hozzák be a hiányzó
        kényszereket.
      </>
    ),
  },
  {
    k: <>A tankönyv szerint mit kell feltüntetni minden egyenletnél összetett tartó számításakor?</>,
    v: [<>Hogy melyik egyensúlyi kijelentés (melyik test vagy az egész) alapján írtuk fel — mert pl. három különböző ΣF<sub>x</sub> egyenlet is létezik.</>, <>A mértékegységeket.</>, <>A számítás időpontját.</>, <>Semmit, az egyenlet önmagáért beszél.</>],
    helyes: 0,
    magyarazat: (
      <>
        A tankönyv lábjegyzete: egy két részre bontott tartón három különböző <M>{"\\sum F_{ix}"}</M> fejlécű egyenlet írható fel (I., II., egész). Ezért írjuk az egyenlet elé: „I:”, „II:”, „Σ:” — ahogy a
        kidolgozott feladatokban is.
      </>
    ),
  },
  {
    k: <>Mit jelent, hogy egy Gerber-tartónál a fix és a befüggesztett rész kapcsolata „alacsonyabb fokszámú” (5.6.c ábra)?</>,
    v: [<>A két testet csak egy rúd köti össze (1 fokú kapcsolat), ezért a befüggesztett rész külső kényszerét kell növelni — pl. görgő helyett csukló.</>, <>A csuklót befogással kell helyettesíteni.</>, <>A fix rész nem kap terhet.</>, <>A szerkezet határozatlanná válik.</>],
    helyes: 0,
    magyarazat: (
      <>
        A befüggesztett résznek összesen három fokszámú kényszer kell: belső csukló (2) + görgő (1), vagy rúd (1) + csukló (2). Egy rúddal kapcsolt résznél ezért a földhöz csuklóval kell kötni — a rúderő a rúdra
        merőleges főpontból egy egyenlettel jön ki.
      </>
    ),
  },
];

export const HIBAK = [
  {
    cim: "A csuklóerő ellentettje kimaradt a fix részről",
    feladat: (
      <>
        Gerber-tartó: A csukló (0), B görgő (4 m), C belső csukló (6 m), D görgő (9 m). Egyetlen teher: <M>{"F = 12\\ \\text{kN}"}</M> lefelé az <M>{"x = 8"}</M> m helyen. Mekkora <M>{"B"}</M>?
      </>
    ),
    lepesek: [
      { szoveg: <>II. test: <M>{"\\Mp{C}\\ -12\\cdot 2 + 3D = 0 \\Rightarrow D = 8\\ \\text{kN}"}</M>, <M>{"\\Mp{D}\\ 12\\cdot 1 - 3C_y = 0 \\Rightarrow C_y = 4\\ \\text{kN}"}</M> (a II. testre felfelé).</> },
      {
        szoveg: <>I. test: nincs rajta teher, ezért <M>{"\\Mp{A}\\ 4B = 0 \\Rightarrow B = 0"}</M>.</>,
        hibas: true,
        javitas: (
          <>
            Az I. testre a <M>{"C"}</M> pontban a csuklóerő <em>ellentettje</em> hat: 4 kN <strong>lefelé</strong>. Helyesen <M>{"\\Mp{A}\\ -4\\cdot 6 + 4B = 0 \\Rightarrow B = 6\\ \\text{kN}"}</M>, és <M>{"\\Mp{B}\\ -4\\cdot 2 - 4A_y = 0 \\Rightarrow A_y = -2"}</M> kN.
            Ellenőrzés az egészre: <M>{"-2 + 6 + 8 - 12 = 0\\ \\checkmark"}</M> — a hibás megoldással <M>{"0 + 0 + 8 - 12 \\neq 0"}</M> lett volna.
          </>
        ),
      },
      { szoveg: <>Ellenőrzés az egész szerkezetre írt függőleges vetületi egyenlettel.</> },
    ],
    tanulsag: <>A befüggesztett rész „ráakaszkodik” a fix részre: a csuklóerő ellentettje ugyanolyan teher, mint bármelyik erő. Ha egy testen „nincs teher”, gyanakodj — a csuklóerő ott van.</>,
  },
  {
    cim: "A háromcsuklós keret vízszintes reakciója „nulla, mert a teher függőleges”",
    feladat: (
      <>
        Háromcsuklós keret: A(0; 0), B(8; 0) csuklók, C(4; 4) belső csukló, a gerenda 4 m magasan. <M>{"F = 16\\ \\text{kN}"}</M> lefelé az <M>{"x = 2"}</M> m helyen. Mekkorák a reakciók?
      </>
    ),
    lepesek: [
      { szoveg: <><M>{"\\Sigma:\\ \\Mp{A}\\ -16\\cdot 2 + 8B_y = 0 \\Rightarrow B_y = 4"}</M>, <M>{"\\Mp{B}\\ 16\\cdot 6 - 8A_y = 0 \\Rightarrow A_y = 12\\ \\text{kN}"}</M>.</> },
      {
        szoveg: <>Vízszintes teher nincs, ezért <M>{"A_x = B_x = 0"}</M>; kész.</>,
        hibas: true,
        javitas: (
          <>
            A ΣF<sub>x</sub> csak azt mondja, hogy <M>{"A_x = -B_x"}</M> — nem azt, hogy nullák. A II. testre a <M>{"C"}</M>-re írt nyomatéki egyenlet: <M>{"\\text{II:}\\ \\Mp{C}\\ 4\\cdot 4 + 4B_x = 0 \\Rightarrow B_x = -4\\ \\text{kN}"}</M>{" "}
            (balra), és <M>{"A_x = 4"}</M> kN (jobbra). A csuklóban nulla a nyomaték: a fél keretre <M>{"B_y"}</M> forgatását csak <M>{"B_x"}</M> tudja kiegyenlíteni.
          </>
        ),
      },
      { szoveg: <>Csuklóerő a II. testből: <M>{"C_x = -B_x"}</M>, <M>{"C_y = -B_y"}</M>.</> },
    ],
    tanulsag: <>Háromcsuklós tartónál a vízszintes reakció mindig megjelenik — ez a tolóerő, a tartó „lelke”. A tankönyv lábjegyzete külön figyelmeztet rá.</>,
  },
  {
    cim: "Terhelt csukló: a teher „odaadva” az egyik testnek",
    feladat: (
      <>
        Gerber-tartó (A csukló 0, B görgő 4 m, C csukló 6 m, D görgő 9 m). A C csuklón <M>{"F = 10\\ \\text{kN}"}</M> lefelé, más teher nincs. Mekkora <M>{"D"}</M> és <M>{"B"}</M>?
      </>
    ),
    lepesek: [
      {
        szoveg: <>A 10 kN-t a II. testre teszem a C pontba: <M>{"\\text{II:}\\ \\Mp{C}\\ 3D = 0 \\Rightarrow D = 0"}</M>, <M>{"\\Mp{D}\\ 10\\cdot 3 - 3C_y = 0 \\Rightarrow C_y = 10"}</M>; az I. testre így 10 kN lefelé hat C-ben.</>,
        hibas: true,
        javitas: (
          <>
            Az eredmény itt véletlenül jó (<M>{"D = 0"}</M>, az I. testre 10 kN), de a gondolatmenet nem: a csuklón ható erőt a <em>csukló egyensúlya</em> osztja szét, nem mi döntjük el, kié. Helyesen: II: <M>{"C_{II} = 0"}</M>{" "}
            (a II. testen nincs teher, <M>{"D = 0"}</M>); csukló: <M>{"-10 - C_{Iy} - 0 = 0 \\Rightarrow C_{Iy} = -10"}</M>; I: <M>{"\\Mp{A}\\ -10\\cdot 6 + 4B = 0 \\Rightarrow B = 15"}</M>. Ha a II. testen is lenne teher, a „ráadás”
            hibás eredményt adna, mert a csuklóerő a II. testre már nem <M>{"C_y"}</M>, hanem <M>{"C_y - 10"}</M> lenne.
          </>
        ),
      },
      { szoveg: <>I. test: <M>{"\\Mp{A}\\ -10\\cdot 6 + 4B = 0 \\Rightarrow B = 15\\ \\text{kN}"}</M>.</> },
    ],
    tanulsag: <>Terhelt csuklónál mindig három részt különíts el: I, II és a csukló. A csuklóra a teher és a két csuklóerő ellentettje hat — két vetületi egyenlet dönti el, mennyi jut az egyes testekre.</>,
  },
  {
    cim: "A rúd elkülönítése nyomatékkal",
    feladat: (
      <>
        Egy gerendához a P pontban ferde rúd csatlakozik, amelynek másik vége a talaj Q csuklójához kapcsolódik. Hogyan vesszük fel a rúd hatását a gerendára az elkülönítéskor?
      </>
    ),
    lepesek: [
      { szoveg: <>A rudat elvágjuk, a gerendára a P pontban vesszük fel a rúd hatását.</> },
      {
        szoveg: <>Mivel a rúd a P csuklóhoz kapcsolódik, ott <M>{"S_x, S_y"}</M> erőkomponenseket és a rúd elfordulását gátló <M>{"M_S"}</M> nyomatékot veszek fel — három ismeretlent.</>,
        hibas: true,
        javitas: (
          <>
            A rúdra csak két erő hat (a két csuklóban), és két erő csak akkor lehet egyensúlyban, ha közös hatásvonalúak és ellentettek: a rúderő hatásvonala a P–Q egyenes. Egyetlen ismeretlen, <M>{"S"}</M>, húzóerőnek
            felvéve, P-ből Q felé. Nyomatékot a csuklós rúd nem ad át — három ismeretlen helyett egy.
          </>
        ),
      },
      { szoveg: <>Az egyenletekben az <M>{"S"}</M> komponenseit a rúd irányának egységvektorával írjuk.</> },
    ],
    tanulsag: <>„Két erő hat rá” = rúd, egyetlen ismeretlennel, a két csuklót összekötő hatásvonalon. Ez igaz töröttvonalú elemre is, amíg más erő nem hat rá (tankönyv 5.3. ábra).</>,
  },
  {
    cim: "Négy egyenlet ugyanarra a testre",
    feladat: (
      <>
        Gerber-tartó fix részére (A csukló, B görgő, C-ben ismert csuklóerő) a hallgató felírja: <M>{"\\Mp{A}"}</M>, <M>{"\\Mp{B}"}</M>, <M>{"\\Fx"}</M>, majd <M>{"\\Fy"}</M>-ból egy „negyedik” reakciót akar számolni.
      </>
    ),
    lepesek: [
      { szoveg: <>I: <M>{"\\Mp{A}"}</M> → <M>{"B"}</M>; <M>{"\\Mp{B}"}</M> → <M>{"A_y"}</M>; <M>{"\\Fx"}</M> → <M>{"A_x"}</M>.</> },
      {
        szoveg: <>I: <M>{"\\Fy"}</M> → ebből még kiszámolom a <M>{"C_y"}</M> csuklóerőt is, mert az is ismeretlen volt.</>,
        hibas: true,
        javitas: (
          <>
            Egy merev testre síkban csak <strong>három</strong> független egyensúlyi egyenlet írható; a negyedik (<M>{"\\Fy"}</M>) a másik három következménye, új információt nem ad. A <M>{"C_y"}</M>-t a II. testből kellett volna
            kiszámolni <em>előbb</em>, és a fix rész egyenleteibe már ismert értékként beírni. A negyedik egyenlet szerepe: <strong>ellenőrzés</strong>.
          </>
        ),
      },
      { szoveg: <>Ellenőrzés: I: <M>{"\\Fy"}</M> ≈ 0.</> },
    ],
    tanulsag: <>Számold a fokszámot dobozként: testenként 3 egyenlet (terhelt csuklóra 2). Ha egy testen több ismeretlen van, mint 3, a többit egy másik testből kell hozni — nem lehet egy testből többet kisajtolni.</>,
  },
  {
    cim: "A megoszló teher eredője a csuklón át „átfolyik”",
    feladat: (
      <>
        Gerber-tartó (A csukló 0, B görgő 4 m, C csukló 6 m, D görgő 9 m), a teljes 9 m-en <M>{"p = 4\\ \\text{kN/m}"}</M>. Mekkora <M>{"D"}</M>?
      </>
    ),
    lepesek: [
      { szoveg: <>A teljes teher eredője <M>{"Q = 4\\cdot 9 = 36\\ \\text{kN}"}</M> a tartó közepén, <M>{"x = 4{,}5"}</M> m-nél.</> },
      {
        szoveg: <>II. test: <M>{"\\Mp{C}\\ -36\\cdot(4{,}5 - 6) + 3D = 0 \\Rightarrow D = -18\\ \\text{kN}"}</M>.</>,
        hibas: true,
        javitas: (
          <>
            A teljes eredőt csak az <em>egész szerkezetre</em> írt egyenletben szabad használni. Egy test egyensúlyához <strong>csak a rá eső teher</strong> eredője tartozik: a II. testen <M>{"Q_{II} = 4\\cdot 3 = 12\\ \\text{kN}"}</M> a C–D szakasz
            közepén (1,5 m-re C-től). Helyesen <M>{"\\Mp{C}\\ -12\\cdot 1{,}5 + 3D = 0 \\Rightarrow D = 6\\ \\text{kN}"}</M>, <M>{"C_y = 6"}</M> kN. A negatív <M>{"D"}</M> már gyanús lett volna: egy lefelé terhelt kéttámaszú tartó görgője nem húz lefelé.
          </>
        ),
      },
      { szoveg: <>I. test: a saját 24 kN-ja (3 m-nél) + a C-ben lefelé ható 6 kN.</> },
    ],
    tanulsag: <>Elkülönítés után a terheket is szét kell osztani a testek között: minden testre csak a rá ható erők (és a csuklóerő). A teljes eredő csak az összegzett (Σ) kijelentésbe való.</>,
  },
];
