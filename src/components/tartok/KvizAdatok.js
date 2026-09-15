import { M } from "@/components/ui/Keplet";

export const KVIZ = [
  {
    k: <>Melyik felsorolás adja meg helyesen a négy síkbeli kényszer fokszámát (görgő, támasztórúd, csukló, befogás)?</>,
    v: [<>1, 1, 2, 3</>, <>1, 2, 2, 3</>, <>2, 1, 1, 3</>, <>1, 1, 3, 3</>],
    helyes: 0,
    magyarazat: (
      <>
        A fokszám a megakadályozott elmozdulás-komponensek száma, és egyben az ismeretlen reakció-adatok száma. A görgő és a rúd egy-egy irányú eltolódást gátol (1), a csukló mindkét eltolódást (2), a befogás
        az eltolódásokat és az elfordulást is (3). Így 2 + 1 vagy 1 + 1 + 1 vagy 3 adja ki a síkbeli tartóhoz szükséges hármat.
      </>
    ),
  },
  {
    k: <>Egy görgő gördülési síkja a vízszintessel 30°-ot zár be. Merre mutat a görgő reakciója?</>,
    v: [<>A gördülési síkra merőlegesen, azaz a függőlegessel 30°-ot bezárva.</>, <>Függőlegesen, mert a teher is függőleges.</>, <>A gördülési síkkal párhuzamosan.</>, <>Az iránya ismeretlen, ezért két komponenssel vesszük fel.</>],
    helyes: 0,
    magyarazat: (
      <>
        A görgő csak a síkra merőleges eltolódást gátolja, tehát csak ilyen irányú erőt tud átadni. Merőleges szárú szögek miatt a reakció függőlegessel bezárt szöge megegyezik a sík vízszintessel bezárt hajlásával
        (tankönyv 4.1.c ábra). Az iránya ismert — csak a nagysága ismeretlen, ezért fokszáma 1.
      </>
    ),
  },
  {
    k: <>Egy rúderőre <M>{"S = -12\\ \\text{kN}"}</M> adódott. Mit jelent ez?</>,
    v: [<>A rúd nyomott: a tényleges erő a felvett (húzó) iránnyal ellentétes, 12 kN.</>, <>A rúd húzott, csak a másik oldalról nézve.</>, <>Hibát vétettünk, rúderő nem lehet negatív.</>, <>A rúd terheletlen, mert az előjel nem értelmezhető.</>],
    helyes: 0,
    magyarazat: (
      <>
        A rúderőt <em>mindig</em> húzóerőként vesszük fel (a támadáspontból a rúd másik vége felé). A negatív előjel azt mondja, hogy a valóságban a rúd nyomja a testet: nyomott rúd. Ez az egyetlen kényszer,
        amelynél az irányítottság felvétele nem szabad — épp azért, hogy az előjel ezt az információt hordozza.
      </>
    ),
  },
  {
    k: <>Kéttámaszú tartónál miért célszerű az első egyenletet a csuklóra írt nyomatéki egyenletnek választani?</>,
    v: [<>Mert a csuklóerő két komponensének karja ott nulla, így csak a görgő reakciója marad ismeretlenként.</>, <>Mert a csuklóban ébred a legnagyobb erő.</>, <>Mert a görgőre nem lehet nyomatéki egyenletet írni.</>, <>Mert a nyomatéki egyenlet mindig pontosabb a vetületinél.</>],
    helyes: 0,
    magyarazat: (
      <>
        Egyismeretlenes egyenletet keresünk. A csuklón átmegy <M>{"A_x"}</M> és <M>{"A_y"}</M> hatásvonala, tehát mindkettő kiesik a csuklóra írt nyomatéki egyenletből — ez a tankönyv ökölszabálya (4.3.1). Utána a
        görgőre írt nyomatéki egyenletből <M>{"A_y"}</M>, a vízszintes vetületiből <M>{"A_x"}</M> jön ki, egymástól függetlenül.
      </>
    ),
  },
  {
    k: <>Hány független egyensúlyi egyenlet írható fel egy síkbeli erőrendszerre, és mit jelent ez a tartókra?</>,
    v: [<>Három; ezért a támaszok fokszámainak összege legalább három kell legyen.</>, <>Kettő; ezért elég egy csukló.</>, <>Annyi, ahány támasz van.</>, <>Hat, mint térben.</>],
    helyes: 0,
    magyarazat: (
      <>
        Síkban két vetületi és egy nyomatéki egyenlet független (a többi ezek kombinációja). Egy merev test síkban háromféleképpen mozoghat, ezért legalább három összfokszámú kényszer kell — és pontosan háromnál
        egyértelmű a megoldás. Térben lenne hat.
      </>
    ),
  },
  {
    k: <>Melyik ismeretlen <em>nem</em> szerepel egy vízszintes vetületi egyenletben?</>,
    v: [<>A függőleges erők és minden koncentrált nyomaték.</>, <>Csak a nyomatékok.</>, <>Csak a függőleges erők.</>, <>Azok az erők, amelyek hatásvonala átmegy a vonatkoztatási ponton.</>],
    helyes: 0,
    magyarazat: (
      <>
        Egy erő nem szerepel az irányára merőleges vetületi egyenletben, a nyomaték pedig egyetlen vetületi egyenletben sem. (A „hatásvonala átmegy a ponton” feltétel a <em>nyomatéki</em> egyenletre vonatkozik.)
        Ezért a befogott konzolnál a két vetületi egyenlet adja <M>{"A_x"}</M>-et és <M>{"A_y"}</M>-t, <M>{"M_A"}</M> csak a nyomatéki egyenletben jelenik meg.
      </>
    ),
  },
  {
    k: <>Mit nevez a tankönyv egy ismeretlen reakció <strong>főpontjának</strong>?</>,
    v: [<>A másik két ismeretlen hatásvonalának metszéspontját — az erre írt nyomatéki egyenletben csak ez az egy ismeretlen marad.</>, <>A reakció támadáspontját.</>, <>A tartó súlypontját.</>, <>Azt a pontot, ahol a reakció hatásvonala a tartót metszi.</>],
    helyes: 0,
    magyarazat: (
      <>
        Ha két nem párhuzamos ismeretlent kell kizárni, a hatásvonalaik metszéspontjára írunk nyomatéki egyenletet: mindkettő karja ott nulla. Ez a metszéspont a harmadik ismeretlen főpontja (tankönyv 4.3.4,{" "}
        <M>{"O_1, O_2, O_3"}</M>). Ha a két kizárandó erő párhuzamos, nincs főpont — akkor a rájuk merőleges vetületi egyenlet a megoldás.
      </>
    ),
  },
  {
    k: <>Mi a különbség az aktív és a passzív erők között?</>,
    v: [<>Az aktív erők a terhek, a passzív erők a reakciók — utóbbiak csak a terhek hatására ébrednek.</>, <>Az aktív erők a vízszintesek, a passzívak a függőlegesek.</>, <>Az aktív erők koncentráltak, a passzívak megoszlók.</>, <>Az aktív erők pozitívak, a passzívak negatívak.</>],
    helyes: 0,
    magyarazat: (
      <>
        A terheletlen tartó zérus reakciókkal van egyensúlyban: a nem nulla reakció mindig a terhekből ered. Ezért a terhek az „aktív”, a reakciók a „passzív” erők (tankönyv 4.1.1). Az elkülönítésnél az aktívakat
        ismerjük, a passzívak az ismeretlenek.
      </>
    ),
  },
  {
    k: <>Mire való az ellenőrző egyenlet a reakciószámítás végén?</>,
    v: [<>Egy eddig nem használt egyensúlyi egyenlet, amelyben már minden erő ismert: nem megoldani kell, hanem megnézni, hogy ≈ 0-t ad-e.</>, <>Belőle számoljuk ki a negyedik reakciót.</>, <>Ugyanazt az egyenletet írjuk fel még egyszer, hogy a számolást ellenőrizzük.</>, <>Az eredményvázlat mértékegységeit ellenőrzi.</>],
    helyes: 0,
    magyarazat: (
      <>
        A három független egyenlet elfogyott az ismeretlenekre; a negyedik (lineárisan nem független) egyenletbe behelyettesítve a kapott értékeket, az eredménynek a kerekítés nagyságrendjén belül nullának kell
        lennie. Ha nem, valahol hiba van — és a hiba nagysága gyakran meg is mondja, hol (pl. ha épp egy tag kétszerese: előjelhiba).
      </>
    ),
  },
  {
    k: <>Mi kerül az eredményvázlatra?</>,
    v: [<>Az elkülönített szerkezet az összes rá ható erővel és nyomatékkal; a reakciók a tényleges irányukkal és pozitív nagysággal — pontosan három új szám.</>, <>Csak a támaszok és a reakciók betűjelei.</>, <>A három egyensúlyi egyenlet behelyettesítve.</>, <>A tartó és a terhek, a reakciók nélkül.</>],
    helyes: 0,
    magyarazat: (
      <>
        Az eredményvázlat a támaszaitól elkülönített szerkezetet mutatja minden erővel. Negatívra jött reakciónál a nyilat megfordítjuk és a pozitív nagyságot írjuk mellé. Ránézésre ellenőrizhető: jobbra mutató
        komponens mellé kell balra mutató, pozitív forgatás mellé negatív — és pontosan annyi új számnak kell szerepelnie, ahány egyenletet megoldottunk.
      </>
    ),
  },
  {
    k: <>Egy merev testet három görgő támaszt meg úgy, hogy a három reakció hatásvonala egy közös ponton megy át. Tartó-e ez?</>,
    v: [<>Nem: a test e pont körül el tud fordulni, az egyenletrendszernek nincs egyértelmű megoldása.</>, <>Igen, mert a fokszámok összege 3.</>, <>Igen, ha a terhek függőlegesek.</>, <>Csak akkor, ha a görgők egyenlő távolságra vannak.</>],
    helyes: 0,
    magyarazat: (
      <>
        A „fokszámok összege három” csak <em>szükséges</em> feltétel. Ha a három hatásvonal egy ponton metszi egymást, egyik reakció sem tud a pont körüli elfordulás ellen dolgozni — a test mechanizmus. Ugyanez
        a degenerált eset, ha kéttámaszú tartónál a görgő reakciójának hatásvonala átmegy a csuklón (tankönyv 4.3.1 lábjegyzete; részletesen a 7. fejezet).
      </>
    ),
  },
  {
    k: <>Egy előtetőt kötéllel függesztettek fel, és a kötélerőre <M>{"S = -5\\ \\text{kN}"}</M> adódott. Mi a helyes következtetés?</>,
    v: [<>A kötél nyomott lenne, amire nem képes: az elrendezés ezzel a teherrel nem működik, a kötél meglazul.</>, <>A kötél 5 kN-nal húzott, csak a másik irányból számoltuk.</>, <>Semmi különös, a kötél ugyanúgy visel nyomást, mint a rúd.</>, <>Az előjelet el kell hagyni, mert a kötélerő definíció szerint pozitív.</>],
    helyes: 0,
    magyarazat: (
      <>
        A kötél olyan rúd, amely csak húzni tud. A tankönyv receptje: rúdként számoljuk, és a végén ellenőrizzük, hogy <M>{"S > 0"}</M> lett-e. Negatív kötélerő azt jelenti, hogy a szerkezet ezzel a teherrel nem
        marad egyensúlyban a feltételezett módon — a kötél nem tud „tolni”.
      </>
    ),
  },
];

export const HIBAK = [
  {
    cim: "A megoszló teher eredője rossz helyen",
    feladat: (
      <>
        Kéttámaszú tartó, <M>{"L = 6\\ \\text{m}"}</M> (A csukló balra, B görgő jobbra). A bal oldali 2 m-en <M>{"p = 6\\ \\text{kN/m}"}</M> egyenletesen megoszló teher hat. Mekkora <M>{"B"}</M>?
      </>
    ),
    lepesek: [
      { szoveg: <>Elkülönítés: <M>{"A_x"}</M>, <M>{"A_y"}</M>, <M>{"B"}</M> felfelé; <M>{"(\\underline{p}, \\underline{A}, \\underline{B}) \\ekv \\underline{O}"}</M>.</> },
      { szoveg: <>A megoszló teher eredője <M>{"Q = 6\\cdot 2 = 12\\ \\text{kN}"}</M>.</> },
      {
        szoveg: <><M>{"\\Mp{A} -3\\cdot 12 + 6\\,B = 0 \\;\\Rightarrow\\; B = 6\\ \\text{kN}"}</M></>,
        hibas: true,
        javitas: (
          <>
            Az eredő a <em>terhelt szakasz</em> súlypontjában hat, nem a tartó közepén: a 0–2 m szakasz felezőpontja <M>{"x_Q = 1\\ \\text{m}"}</M>. Helyesen: <M>{"\\Mp{A} -1\\cdot 12 + 6\\,B = 0 \\;\\Rightarrow\\; B = 2\\ \\text{kN}"}</M>. A
            hibás 6 kN a valóság háromszorosa — az ellenőrző egyenlet (<M>{"\\Fy"}</M>) ezt rögtön jelezte volna, ha <M>{"A_y"}</M>-t is a görgőre írt nyomatékiból számoljuk: <M>{"A_y = 10"}</M>, és <M>{"10 + 6 - 12 = 4 \\neq 0"}</M>.
          </>
        ),
      },
      { szoveg: <>Ellenőrzés a függőleges vetületi egyenlettel.</> },
    ],
    tanulsag: <>Az egyenletesen megoszló teher eredője a szakasz felezőpontjában hat; háromszögnél a nagyobb intenzitástól a hossz harmadára. Először rajzold be az eredőt a helyére, csak aztán írd a nyomatékot.</>,
  },
  {
    cim: "A ferde görgő reakciója nem függőleges",
    feladat: (
      <>
        Kéttámaszú tartó, <M>{"L = 4\\ \\text{m}"}</M>, A csukló, B görgő 30°-os, jobbra emelkedő gördülési síkon. A tartó közepén <M>{"F = 10\\ \\text{kN}"}</M> függőleges erő. Mekkora <M>{"A_x"}</M>?
      </>
    ),
    lepesek: [
      { szoveg: <>Elkülönítés: <M>{"A_x"}</M> jobbra, <M>{"A_y"}</M> felfelé, <M>{"B"}</M> a görgőnél.</> },
      {
        szoveg: <>A teher függőleges, ezért <M>{"B"}</M> is függőleges: <M>{"\\Mp{A} -2\\cdot 10 + 4\\,B = 0 \\;\\Rightarrow\\; B = 5\\ \\text{kN}"}</M>, és <M>{"\\Fx A_x = 0"}</M>.</>,
        hibas: true,
        javitas: (
          <>
            A görgő reakciója mindig a <em>gördülési síkra merőleges</em>, függetlenül a teher irányától: a függőlegessel 30°-ot zár be, balra-felfelé mutat. Helyesen:{" "}
            <M>{"\\Mp{A} -2\\cdot 10 + 4\\,B\\cos 30^\\circ = 0 \\;\\Rightarrow\\; B = 5{,}77\\ \\text{kN}"}</M>, majd <M>{"\\Fx A_x - 5{,}77\\sin 30^\\circ = 0 \\;\\Rightarrow\\; A_x = 2{,}89\\ \\text{kN}"}</M>. A csuklóban tehát
            vízszintes erő is ébred, pedig a teher függőleges.
          </>
        ),
      },
      { szoveg: <><M>{"\\Mp{B}"}</M>-ből <M>{"A_y = 5\\ \\text{kN}"}</M>.</> },
    ],
    tanulsag: <>A kényszer iránya a kényszerből következik, nem a teherből. Ferde görgőnél a reakció függőlegessel bezárt szöge = a sík hajlásszöge.</>,
  },
  {
    cim: "Nyomottnak felvett rúderő, rosszul értelmezett előjel",
    feladat: (
      <>
        Előtető: A csukló, a tető végét (<M>{"x = 3\\ \\text{m}"}</M>) ferde rúd tartja, a rúd a falhoz a <M>{"D(0;\\ 2)"}</M> pontban csatlakozik. Teher: <M>{"F = 9\\ \\text{kN}"}</M> lefelé <M>{"x = 2\\ \\text{m}"}</M>-nél. Húzott vagy nyomott a rúd?
      </>
    ),
    lepesek: [
      {
        szoveg: <>Elkülönítés: a rúd nyilván tartja a tetőt, ezért a rúderőt a rúdból a tető felé mutatva (nyomóerőként) veszem fel, <M>{"D \\to C"}</M> irányban.</>,
        hibas: true,
        javitas: (
          <>
            A rúderőt <em>mindig húzóerőként</em> vesszük fel, a támadáspontból a rúd másik vége felé (<M>{"C \\to D"}</M>). A rúd hossza <M>{"\\sqrt{3^2 + 2^2} = 3{,}606"}</M> m, <M>{"S_y = S\\cdot 2/3{,}606 = 0{,}5547\\,S"}</M>.{" "}
            <M>{"\\Mp{A} -2\\cdot 9 + 3\\cdot 0{,}5547\\,S = 0 \\;\\Rightarrow\\; S = 10{,}82\\ \\text{kN}"}</M>, pozitív: a rúd <strong>húzott</strong> (függesztőrúd). Nyomóerőként felvéve ugyanez <M>{"S = -10{,}82"}</M> lenne, és
            a következő lépésben ezt könnyű „nyomott”-nak olvasni — pedig a felvett irányhoz képest negatív, azaz a valóságban húzott.
          </>
        ),
      },
      { szoveg: <><M>{"\\Mp{A}"}</M>-ból a rúderő, <M>{"\\Mp{C}"}</M>-ből <M>{"A_y"}</M>, <M>{"\\Fx"}</M>-ből <M>{"A_x"}</M>.</> },
      { szoveg: <>A negatív eredmény azt jelenti, hogy a rúd nyomott.</> },
    ],
    tanulsag: <>A „húzottnak felvesszük” megállapodás nem kukacoskodás: ez teszi az előjelet olvashatóvá (S &gt; 0 húzott, S &lt; 0 nyomott), és a szilárdságtanban is ezt fogjuk használni.</>,
  },
  {
    cim: "A koncentrált nyomaték kimaradt a nyomatéki egyenletből",
    feladat: (
      <>
        Befogott konzol, <M>{"L = 3\\ \\text{m}"}</M>, a szabad végen <M>{"F = 4\\ \\text{kN}"}</M> lefelé, a közepén <M>{"M = 6\\ \\text{kNm}"}</M> koncentrált nyomaték az óramutatóval ellentétesen. Mekkora <M>{"M_A"}</M>?
      </>
    ),
    lepesek: [
      { szoveg: <><M>{"\\Fx A_x = 0"}</M>, <M>{"\\Fy A_y - 4 = 0 \\;\\Rightarrow\\; A_y = 4\\ \\text{kN}"}</M> — a koncentrált nyomaték a vetületi egyenletekben nem szerepel.</> },
      {
        szoveg: <><M>{"\\Mp{A} M_A - 3\\cdot 4 = 0 \\;\\Rightarrow\\; M_A = 12\\ \\text{kNm}"}</M></>,
        hibas: true,
        javitas: (
          <>
            A vetületi egyenletekből a nyomaték helyesen maradt ki — a <em>nyomatéki</em> egyenletből viszont nem maradhat ki! Helyesen: <M>{"\\Mp{A} M_A - 3\\cdot 4 + 6 = 0 \\;\\Rightarrow\\; M_A = 6\\ \\text{kNm}"}</M>. A
            koncentrált nyomaték helye nem számít (bárhol ugyanennyi), az előjele igen. Az ellenőrző egyenlet a szabad végre: <M>{"\\Mp{B} 6 - 3\\cdot 4 + 6 = 0\\ \\checkmark"}</M> — a hibás 12-vel <M>{"12 - 12 + 6 = 6 \\neq 0"}</M> jött volna ki.
          </>
        ),
      },
      { szoveg: <>Ellenőrzés a szabad végre írt nyomatéki egyenlettel.</> },
    ],
    tanulsag: <>A koncentrált nyomaték a vetületi egyenletekből hiányzik, a nyomatéki egyenletekben viszont minden pontra ugyanazzal az értékkel szerepel — a helyétől függetlenül.</>,
  },
  {
    cim: "„Nem jött ki” az ellenőrzés — és mégis elfogadták",
    feladat: (
      <>
        Kéttámaszú tartó, <M>{"L = 5\\ \\text{m}"}</M> (A csukló balra, B görgő jobbra), <M>{"F_1 = 8\\ \\text{kN}"}</M> az <M>{"x = 1"}</M> m, <M>{"F_2 = 6\\ \\text{kN}"}</M> az <M>{"x = 4"}</M> m helyen, mindkettő
        lefelé. Számítsd ki a reakciókat és ellenőrizd!
      </>
    ),
    lepesek: [
      { szoveg: <><M>{"\\Mp{A} -1\\cdot 8 - 4\\cdot 6 + 5\\,B = 0 \\;\\Rightarrow\\; B = 6{,}4\\ \\text{kN}"}</M></> },
      { szoveg: <><M>{"\\Fy A_y + 6{,}4 - 8 - 6 = 0 \\;\\Rightarrow\\; A_y = 7{,}6\\ \\text{kN}"}</M></> },
      {
        szoveg: <>Ellenőrzés a görgőre írt nyomatéki egyenlettel: <M>{"\\Mp{B} +4\\cdot 8 - 1\\cdot 6 - 5\\cdot 7{,}6 = -12"}</M>. Nyomatéki egyenletben a karral szorzódik a hiba, ezért ez még elfogadható — az eredmény jó.</>,
        hibas: true,
        javitas: (
          <>
            Egy 12 kNm-es maradék tizedesre kerekített, 10 kN nagyságrendű erőknél <em>nem</em> kerekítési hiba. A tankönyv szerint „olyan nincs, hogy az ellenőrző egyenlet nem jön ki, csak olyan, hogy a hiba
            3,24” — és a hibát meg kell találni, akár magában az ellenőrző egyenletben. Itt a hiba épp <M>{"2\\cdot 6"}</M>: előjelhiba a 6 kN-os tagnál. <M>{"F_2"}</M> a B ponttól <em>balra</em> van és lefelé mutat, tehát
            B körül az óramutatóval ellentétesen forgat: <M>{"+1\\cdot 6"}</M>. Helyesen <M>{"\\Mp{B} +4\\cdot 8 + 1\\cdot 6 - 5\\cdot 7{,}6 = 32 + 6 - 38 = 0\\ \\checkmark"}</M> — a reakciók jók voltak, az ellenőrzés
            volt rossz.
          </>
        ),
      },
    ],
    tanulsag: <>Az ellenőrző egyenlet akkor ér valamit, ha komolyan vesszük: a hiba csak a kerekítés nagyságrendjében lehet. Ha nagyobb, a hiba nagysága gyakran elárulja, melyik tag rossz (kétszeres tag = előjelhiba) — és a hibás egyenlet lehet maga az ellenőrző egyenlet is.</>,
  },
];
