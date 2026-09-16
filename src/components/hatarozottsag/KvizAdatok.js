import { M } from "@/components/ui/Keplet";

export const KVIZ = [
  {
    k: <>Mit jelent, hogy egy <em>feladat</em> statikailag határozott?</>,
    v: [<>Az adott egyensúlyi kijelentés egyenletrendszerének van megoldása, és az egyértelmű.</>, <>A szerkezetnek pontosan három támasza van.</>, <>A terhek csak függőlegesek.</>, <>A szerkezet bármilyen teherre egyensúlyban marad.</>],
    helyes: 0,
    magyarazat: (
      <>
        A tankönyv (7.2) a <em>feladat</em> határozottságát az adott egyenletrendszer megoldhatóságáról mondja: van megoldás és egyértelmű → határozott; nincs (ellentmondás) → túlhatározott; van, de nem egyértelmű → határozatlan. A „bármilyen teherre” kikötés már a <em>tartó</em> határozottságának
        definíciója (7.3).
      </>
    ),
  },
  {
    k: <>Egy két görgővel megtámasztott gerendát csak függőleges erők terhelnek. Milyen a feladat, és milyen a szerkezet?</>,
    v: [<>A feladat határozott, a szerkezet túlhatározott.</>, <>Mindkettő határozott.</>, <>Mindkettő túlhatározott.</>, <>A feladat határozatlan, a szerkezet határozott.</>],
    helyes: 0,
    magyarazat: (
      <>
        Függőleges teherre a két görgő egyértelmű reakciókat ad (7.1.b ábra): a feladat határozott. De létezik teher (vízszintes), amire nincs egyensúly, ezért a szerkezet túlhatározott (7.3.a ábra) — a tankönyv 7.4.1 táblázata szerint túlhatározott szerkezeten a feladat „lehet” határozott.
      </>
    ),
  },
  {
    k: <>Egy két csuklóval megtámasztott gerendán (7.2.a) mi a probléma?</>,
    v: [<>Négy ismeretlen, három egyenlet: a vízszintes reakciók külön-külön nem határozhatók meg — határozatlan.</>, <>A gerenda vízszintesen elmozdulhat.</>, <>Nincs egyensúly ferde teherre.</>, <>Semmi, a csukló a legjobb támasz.</>],
    helyes: 0,
    magyarazat: (
      <>
        <M>{"A_x + B_x"}</M> ismert a vízszintes vetületi egyenletből, de a kettő külön nem: egy szabad paraméter marad. Terheletlenül is lehet <M>{"A_x = -B_x \\ne 0"}</M> — sajátfeszültségi állapot. A hiba, amit a tankönyv külön kiemel: <M>{"A_x = B_x"}</M>-ből <M>{"A_x = B_x = 0"}</M>-t olvasni ki.
      </>
    ),
  },
  {
    k: <>Melyik állítás igaz az <M>{"e = i"}</M> feltételről (egyenletek száma = ismeretlenek száma)?</>,
    v: [<>A határozottság szükséges, de nem elégséges feltétele.</>, <>A határozottság szükséges és elégséges feltétele.</>, <>A határozatlanság elégséges feltétele.</>, <>Csak rácsos tartókra érvényes.</>],
    helyes: 0,
    magyarazat: (
      <>
        Ha <M>{"e \\ne i"}</M>, a szerkezet biztosan nem határozott; ha <M>{"e = i"}</M>, még lehet egyszerre határozatlan és túlhatározott (kritikus elrendezés: három párhuzamos görgő, egy ponton átmenő három rúd, egy egyenesbe eső három csukló). Ezért szükséges, de nem elégséges.
      </>
    ),
  },
  {
    k: <>Hogyan változik az egyenletek és az ismeretlenek száma, ha egy síkbeli szerkezetbe egy belső csuklót teszünk (két test között)?</>,
    v: [<>+3 egyenlet (új test), +2 ismeretlen (kapcsolati erő): a különbség eggyel javul a határozottság felé.</>, <>+2 egyenlet, +2 ismeretlen: nem változik semmi.</>, <>−2 ismeretlen, az egyenletek száma marad.</>, <>+3 egyenlet, +3 ismeretlen.</>],
    helyes: 0,
    magyarazat: (
      <>
        A csukló egy testet kettévág (+3 egyenlet), és két kapcsolati erő-komponenst hoz (+2 ismeretlen). Így egy egyszeresen határozatlan tartó (pl. háromtámaszú gerenda, kétcsuklós keret) egy belső csuklóval határozottá tehető — ha a csukló helye nem kritikus.
      </>
    ),
  },
  {
    k: <>Egy gerendát három, vízszintes síkon gördülő görgő támaszt. <M>{"e = i = 3"}</M>. Milyen a szerkezet?</>,
    v: [<>Határozatlan és túlhatározott: vízszintesen eltolódhat, a függőleges reakciók közül egy fölös.</>, <>Határozott, mert 3 = 3.</>, <>Egyszeresen határozatlan.</>, <>Túlhatározott, két szabad mozgással.</>],
    helyes: 0,
    magyarazat: (
      <>
        A tankönyv 7.7.a ábrája: a három párhuzamos hatásvonal a vízszintes eltolódást nem gátolja (1 szabad mozgás), a függőleges irányban viszont három kényszer dolgozik kettő helyett (1 fölös). <M>{"e - i = 0 = 1 - 1"}</M>: a számlálás csak a különbséget látja.
      </>
    ),
  },
  {
    k: <>Mikor határozott statikailag a háromcsuklós tartó?</>,
    v: [<>Ha a három csukló nem esik egy egyenesbe.</>, <>Mindig, mert 6 = 6.</>, <>Ha a két külső csukló azonos magasságban van.</>, <>Ha a belső csukló a gerinc közepén van.</>],
    helyes: 0,
    magyarazat: (
      <>
        A tankönyv 7.3.2.2: az egyértelmű megoldhatósághoz az kell, hogy a még ismeretlen külső reakció hatásvonala ne menjen át a belső csuklón — azaz a három csukló ne essen egy egyenesbe. Ellenkező esetben (7.8.a ábra) a szaggatott vonalra merőleges terhet a szerkezet nem tudja megtartani.
      </>
    ),
  },
  {
    k: <>Rácsos tartóra a határozottság szükséges feltétele:</>,
    v: [<><M>{"2c = r + k"}</M> (síkban), <M>{"3c = r + k"}</M> térben.</>, <><M>{"c = r + k"}</M>.</>, <><M>{"3c = r + k"}</M> síkban is.</>, <><M>{"2r = c + k"}</M>.</>],
    helyes: 0,
    magyarazat: (
      <>
        Minden csomópontban közös metszéspontú erőrendszer: két független egyenlet (térben három). Az ismeretlenek a rúderők (<M>{"r"}</M>) és a külső kényszerfokok (<M>{"k"}</M>). Az X-rácsozás <M>{"r + k > 2c"}</M>: határozatlan.
      </>
    ),
  },
  {
    k: <>Miért nem lehet a statikailag határozatlan tartó reakcióit csak az egyensúlyi egyenletekből kiszámítani?</>,
    v: [<>Mert az egyenletrendszernek végtelen sok megoldása van; az igazit a tartó alakváltozása (merevsége) választja ki.</>, <>Mert több egyenlet van, mint ismeretlen.</>, <>Mert a reakciók iránya ismeretlen.</>, <>Ki lehet: csak több nyomatéki egyenletet kell felírni.</>],
    helyes: 0,
    magyarazat: (
      <>
        Több nyomatéki egyenlet nem segít: azok nem függetlenek. A fölös kényszer reakciója szabad paraméter, amelyet az dönt el, hogy a tartó alakváltozása illeszkedjen minden támaszhoz (Szilárdságtan). Ezért függ az eredmény az <M>{"EI"}</M> arányoktól, és ezért ébred reakció hőmérsékletváltozásra vagy
        támaszsüllyedésre is.
      </>
    ),
  },
  {
    k: <>Egy háromtámaszú gerendát (csukló + két görgő) törzstartóvá alakítunk. Melyik <em>nem</em> jó lépés?</>,
    v: [<>A csuklót vízszintes síkon gördülő görgőre cseréljük.</>, <>Az egyik görgőt elvesszük.</>, <>A csuklót ferde síkú görgőre cseréljük.</>, <>A középső támasz fölé belső csuklót teszünk.</>],
    helyes: 0,
    magyarazat: (
      <>
        Vízszintes görgővel három párhuzamos görgő maradna: kritikus (7.7.a). A tankönyv 7.11.c ábrája ezért ferde görgőt tesz a csukló helyére, amely vízszintes komponensű reakciót is tud adni. A többi három lépés mind határozott törzstartót ad.
      </>
    ),
  },
  {
    k: <>Melyik módszer bizonyítja a tartó határozottságát a tankönyv szerint (az <M>{"e = i"}</M> feltétel mellett)?</>,
    v: [<>Egyismeretlenes egyenletek olyan menetrendje, amelyben minden ismeretlen sorra kerül nemzérus együtthatóval — vagy egyetlen teherre talált egyértelmű megoldás.</>, <>A támaszok betűrendbe rakása.</>, <>Az, hogy a reakciók pozitívak.</>, <>Az, hogy a terhek függőlegesek.</>],
    helyes: 0,
    magyarazat: (
      <>
        7.3.1: a matematikai út a mátrix rangvizsgálata lenne; kézzel elég egy teherre egyértelmű megoldást találni, vagy előre megtervezni az egyismeretlenes egyenletek sorrendjét (az ilyen menetrend létezése maga a bizonyíték). Az egyszerű tartóknál ezért tanultuk a főpont-keresést.
      </>
    ),
  },
  {
    k: <>A tankönyv 7.7.c ábrája: egy gerendát a két végén egy-egy görgő tart, mindkét reakció vízszintes, közös hatásvonalú. <M>{"e = 3, i = 2"}</M>. Hány szabad mozgás és hány fölös kényszer van?</>,
    v: [<>2 szabad mozgás (függőleges eltolódás, elfordulás) és 1 fölös kényszer.</>, <>1 szabad mozgás, 0 fölös.</>, <>3 szabad mozgás.</>, <>0 szabad mozgás, 1 fölös.</>],
    helyes: 0,
    magyarazat: (
      <>
        <M>{"e - i = 3 - 2 = 1 = 2 - 1"}</M>. A két azonos hatásvonalú erő csak a vízszintes eltolódást gátolja — azt kétszer. A tankönyv példája arra, hogy <M>{"e > i"}</M> (túlhatározottság elégséges feltétele) mellett a szerkezet még határozatlan is lehet.
      </>
    ),
  },
  {
    k: <>Hány független egyensúlyi egyenlet írható egy síkbeli, <em>közös metszéspontú</em> erőrendszer egyensúlyi kijelentése alapján?</>,
    v: [<>Kettő.</>, <>Három.</>, <>Egy.</>, <>Hat.</>],
    helyes: 0,
    magyarazat: (
      <>
        7.1: közös metszéspontú síkbeli erőrendszernél két vetületi egyenlet független; a metszésponton átmenő tengelyre írt nyomatéki egyenlet azonosság (0 = 0). Ezért jár csomópontonként két egyenlet a rácsos tartóban. Szétszórt síkbeli erőrendszerre három, térbelire hat.
      </>
    ),
  },
  {
    k: <>Miért <em>nem</em> vesszük ki a vakrudakat a rácsos tartóból?</>,
    v: [<>Mert más teherre szükség lehet rájuk: nélkülük a csomópontban egy egyenletben nem maradna ismeretlen, a tartó túlhatározottá válna.</>, <>Mert szépen néz ki.</>, <>Mert a vakrúd mindig húzott.</>, <>Kivehetők, semmi nem változik.</>],
    helyes: 0,
    magyarazat: (
      <>
        7.3.2.3: ha egy csomóponthoz csak két, egy egyenesbe eső rúd csatlakozik, a rájuk merőleges vetületi egyenletben nincs ismeretlen — a tehertől függ, van-e egyensúly. Határozott tartón ez nem fordulhat elő, ezért a vakrúd a szerkezet része marad.
      </>
    ),
  },
];

export const HIBAK = [
  {
    cim: "3 = 3, tehát határozott?",
    feladat: <>Egy gerendát három vízszintes síkon gördülő görgő támaszt; teher: ferde erő. Döntsd el, tartó-e!</>,
    lepesek: [
      { szoveg: <>Egy test: <M>{"e = 3"}</M>; három görgő: <M>{"i = 1 + 1 + 1 = 3"}</M>.</> },
      {
        szoveg: <><M>{"e = i"}</M>, tehát a szerkezet statikailag határozott, a reakciók a szokásos három egyenletből kijönnek.</>,
        hibas: true,
        javitas: (
          <>
            Az <M>{"e = i"}</M> csak szükséges feltétel. A három reakció hatásvonala párhuzamos: a vízszintes vetületi egyenletben egyik sem szerepel, ferde teherre <M>{"\\Fx F_x = 0"}</M> ellentmondás. A szerkezet határozatlan és túlhatározott — nem tartó (7.7.a ábra). Mindig nézd meg a geometriát is.
          </>
        ),
      },
      { szoveg: <>Ellenőrzés a függőleges vetületi egyenlettel.</> },
    ],
    tanulsag: <>A számlálás után jön a geometriai ellenőrzés: párhuzamos vagy egy ponton átmenő hatásvonalak, egy egyenesbe eső csuklók. E nélkül a 3 = 3 semmit sem bizonyít.</>,
  },
  {
    cim: "A belső csukló ismeretlenjei kétszer",
    feladat: <>Gerber-tartó: A csukló, B, C, D görgő, két belső csukló. Hány egyenlet és hány ismeretlen?</>,
    lepesek: [
      { szoveg: <>Három test: <M>{"e = 9"}</M>.</> },
      {
        szoveg: <>Külső: <M>{"2 + 1 + 1 + 1 = 5"}</M>; a belső csuklókban mindkét testre két-két erő hat, ez csuklónként 4: <M>{"i = 5 + 8 = 13"}</M>. Négyszeresen határozatlan.</>,
        hibas: true,
        javitas: (
          <>
            A belső csukló két testre ható erői egymás ellentettjei — ugyanaz az ismeretlen a hatás egyik és másik oldalán. A tankönyv (7.3.1) külön figyelmeztet: a belső reakcióerőket csak egyszer vegyük figyelembe. Helyesen csuklónként 2: <M>{"i = 5 + 4 = 9 = e"}</M>, a Gerber-tartó határozott.
          </>
        ),
      },
      { szoveg: <>Lefejtés: a befüggesztett részek csukló + görgő megtámasztásúak.</> },
    ],
    tanulsag: <>Belső csukló két test között: 2 ismeretlen. Ha három testet kapcsol: 4. Csak akkor 2·(testek száma), ha a csuklót külön elkülönítjük — de akkor a csuklóra 2 egyenlet is jár.</>,
  },
  {
    cim: "Rácsos tartó: a rudak duplán, a csuklók félig",
    feladat: <>A tankönyv 7.9. ábrájának rácsa: 6 csomópont, 9 rúd, csukló + görgő. Határozott-e?</>,
    lepesek: [
      {
        szoveg: <>Minden rúd két végén ismeretlen a rúderő: <M>{"i = 2\\cdot 9 + 3 = 21"}</M>; csomópontonként három egyenlet: <M>{"e = 18"}</M>. Határozatlan.</>,
        hibas: true,
        javitas: (
          <>
            Egy rúdban egyetlen rúderő van (a két vég erői egymás ellentettjei), és egy csomópontra közös metszéspontú erőrendszer hat: a nyomatéki egyenlet azonosság, csak két vetületi egyenlet független. Helyesen <M>{"e = 2c = 12"}</M>, <M>{"i = r + k = 9 + 3 = 12"}</M>: lehet határozott —
            és mivel háromszögekből épül, csukló + görgő tartja, az is.
          </>
        ),
      },
      { szoveg: <>Háromszögekből felépíthető → merev test.</> },
      { szoveg: <>A merev testet csukló és görgő támasztja, a görgő hatásvonala nem megy át a csuklón.</> },
    ],
    tanulsag: <>Rácsos tartón: rudanként egy ismeretlen, csomópontonként két egyenlet. Ez a 2c = r + k képlet tartalma.</>,
  },
  {
    cim: "Aₓ = Bₓ, tehát mindkettő nulla",
    feladat: <>Két csuklóval megtámasztott gerenda, csak függőleges teher. Mekkorák a vízszintes reakciók?</>,
    lepesek: [
      { szoveg: <>Vízszintes vetületi egyenlet: <M>{"\\Fx A_x + B_x = 0 \\Rightarrow A_x = -B_x"}</M>.</> },
      {
        szoveg: <>Mivel nincs vízszintes teher, <M>{"A_x = B_x = 0"}</M>. A feladat megoldva.</>,
        hibas: true,
        javitas: (
          <>
            Az egyenlet csak az összegüket adja meg: bármekkora <M>{"A_x"}</M> és a vele ellentétes <M>{"B_x"}</M> egyensúlyban van (sajátfeszültségi állapot, 7.2.c ábra). A feladat statikailag határozatlan: a vízszintes reakció szabad paraméter, amit a gerenda merevsége (és a támaszok
            elmozdulása, hőmérséklet) dönt el. A tankönyv lábjegyzete pontosan ezt a típushibát említi.
          </>
        ),
      },
      { szoveg: <>A függőleges reakciók a két nyomatéki egyenletből egyértelműek.</> },
    ],
    tanulsag: <>„Nincs vízszintes teher” nem jelenti, hogy nincs vízszintes reakció — a határozatlan tartón az egyensúly nem dönt, csak megenged.</>,
  },
  {
    cim: "Törzstartó vízszintes görgővel",
    feladat: <>Háromtámaszú gerenda (A csukló, B és C vízszintes görgő), egyszeresen határozatlan. Készíts törzstartót a csukló átalakításával!</>,
    lepesek: [
      { szoveg: <>Egy kényszert kell felszabadítani: <M>{"i - e = 4 - 3 = 1"}</M>.</> },
      {
        szoveg: <>Az A csuklót vízszintes síkon gördülő görgőre cseréljük, <M>{"A_x"}</M> lesz a szabad paraméter: kéttámaszú-szerű törzstartó.</>,
        hibas: true,
        javitas: (
          <>
            Így három párhuzamos (függőleges) görgő maradna — a 7.7.a ábra kritikus elrendezése, amely nem határozott, hanem határozatlan és túlhatározott. A tankönyv 7.11.c: a csukló helyére csak olyan görgő tehető, amelynek reakciója vízszintes komponenssel is rendelkezik (ferde sík).
            Egyszerűbb: az egyik görgőt elvenni, vagy belső csuklót beiktatni.
          </>
        ),
      },
      { szoveg: <>A paraméteres reakciót teherként működtetjük a törzstartón.</> },
    ],
    tanulsag: <>A törzstartónak határozottnak kell lennie: a felszabadítás után is ellenőrizd az elrendezést (párhuzamos reakciók, csuklón átmenő hatásvonal).</>,
  },
  {
    cim: "Négy csukló a keretben",
    feladat: <>Zárt keret: A és B talajcsukló, belső csukló mindkét sarokban. Osztályozd!</>,
    lepesek: [
      { szoveg: <>Testek: két oszlop és a gerenda, <M>{"e = 9"}</M>.</> },
      { szoveg: <>Ismeretlenek: <M>{"2 + 2 + 2 + 2 = 8"}</M>.</> },
      {
        szoveg: <><M>{"e > i"}</M>, egy fölös kényszer: egyszeresen határozatlan keret.</>,
        hibas: true,
        javitas: (
          <>
            Fordítva: <M>{"e > i"}</M> azt jelenti, hogy több az egyenlet, mint az ismeretlen — <M>{"e - i = 1"}</M> szabad mozgás, a szerkezet túlhatározott (mechanizmus): a két oszlop A és B körül azonosan elfordul, a gerenda vízszintes marad (mint a 7.8.b ábrán). Határozatlanhoz{" "}
            <M>{"i > e"}</M> kellene.
          </>
        ),
      },
    ],
    tanulsag: <>e &gt; i: kevés a kényszer, mozog (túlhatározott); i &gt; e: sok a kényszer, határozatlan. A szavak a „meghatározottságra” utalnak, nem a kényszerek számára — ezért könnyű összekeverni.</>,
  },
];
