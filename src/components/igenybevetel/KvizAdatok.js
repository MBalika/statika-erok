import { M } from "@/components/ui/Keplet";

/*
 * Fogalmi kvíz és hibakereső a 9. modulhoz (tankönyv 8. fejezet).
 * A számpéldák értékeit a számítómaggal ellenőriztük (lásd a modul tesztjeit).
 */

export const KVIZ = [
  {
    k: <>Mikor pozitív a normálerő egy keresztmetszetben?</>,
    v: [<>Ha a keresztmetszetből kifelé mutat, azaz húzza azt.</>, <>Ha befelé mutat, azaz nyomja a keresztmetszetet.</>, <>Ha jobbra mutat, a koordináta-rendszer x tengelye szerint.</>, <>Ha a bal oldali tartórészre hat.</>],
    helyes: 0,
    magyarazat: (
      <>
        A tankönyv 8.1.2.2 szerint a normálerő akkor pozitív, ha a keresztmetszetből kifelé mutat — húzza. Ez ugyanaz a szabály, mint a rúderőknél: a bal és a jobb oldali részre ható <M>{"N"}</M> ugyanazt az előjelet
        kapja, ezért nem kell külön b és j index.
      </>
    ),
  },
  {
    k: <>Hogyan kapjuk a pozitív nyíróerő irányát egy keresztmetszetben?</>,
    v: [<>A pozitív normálerő irányát az óramutató járásával egyezően 90°-kal elforgatva.</>, <>Mindig felfelé.</>, <>A pozitív normálerő irányát az óramutatóval ellentétesen 90°-kal elforgatva.</>, <>A teher irányával ellentétesen.</>],
    helyes: 0,
    magyarazat: (
      <>
        A definíció (8.1.2.2): a pozitív <M>{"V"}</M> = a pozitív <M>{"N"}</M> óramutató szerinti 90°-os elforgatottja. Vízszintes tartónál a bal oldali részre ez lefelé, a jobb oldali részre felfelé mutat — és így a
        bal részen a felfelé mutató erők (pl. a reakció) adnak pozitív nyíróerőt. Ez nem „felfelé pozitív”: ferde vagy függőleges rúdon a szabály forog a rúddal.
      </>
    ),
  },
  {
    k: <>Vízszintes tartón melyik oldalra rajzoljuk a nyomatéki ábrát, és mit jelent egy pozitív érték?</>,
    v: [<>A húzott oldalra; pozitív = az alsó szál húzott, az ábra a tengely alatt.</>, <>A nyomott oldalra; pozitív = a felső szál nyomott.</>, <>A V-vel ellentétes oldalra: a pozitív M alul, a pozitív V fölül.</>, <>Mindegy, csak az előjelet kell kiírni.</>],
    helyes: 0,
    magyarazat: (
      <>
        A tankönyv (és a gyakorlat) a húzott oldalra rajzolja az <M>{"M"}</M> ábrát: vízszintes szakaszon az alsó oldalt választjuk pozitívnak, így a lefelé mutató teher alatt „lógó” ábra alul húzott szálat jelent.
        A rajz iránya tehát információ: a szerkezet alsó vagy felső szála húzott-e. És nem csak az <M>{"M"}</M>-re igaz: a 8.3.2 szerint az <M>{"N"}</M> és a <M>{"V"}</M> ábrát is ugyanerre a pozitív oldalra mérjük fel — vízszintes tartón
        a pozitív <M>{"N"}</M>, <M>{"V"}</M>, <M>{"M"}</M> mind a tartó alatt, a negatív fölötte van.
      </>
    ),
  },
  {
    k: <>Vízszintes, balról jobbra haladó tartón hová kerül a nyíróerő-ábra pozitív része?</>,
    v: [<>A tartó alá — ugyanarra a pozitív oldalra, ahová a pozitív nyomaték (tankönyv 8.3.2).</>, <>A tartó fölé, hogy ne keveredjen a nyomatéki ábrával.</>, <>Mindig arra az oldalra, amerre a teher mutat.</>, <>Bal oldali részen alá, jobb oldali részen fölé.</>],
    helyes: 0,
    magyarazat: (
      <>
        A tankönyv 8.3.2 szerint az ábrákon az értéket a tartó tengelyére merőlegesen mérjük, és a tengely pozitív oldalának azt tekintjük, amelyiket a hajlítónyomaték pozitív definíciójához is használtuk. A 8.9. ábrán (konzol, ferde erő a
        szabad végen) az <M>{"N"}</M>, a <M>{"V"}</M> és az <M>{"M"}</M> pozitív értéke egyaránt a tartó alatt van, a „+” jel a tengely alatt. Az előjel a definícióból jön (a bal részen a felfelé mutató erők adnak pozitív <M>{"V"}</M>-t), a rajz
        oldala pedig ugyanaz mindhárom ábrán.
      </>
    ),
  },
  {
    k: <>Melyik differenciális összefüggés köti össze a nyíróerőt és a hajlítónyomatékot?</>,
    v: [<><M>{"\\mathrm{d}M/\\mathrm{d}x = V"}</M>: a nyomaték meredeksége a nyíróerő.</>, <><M>{"\\mathrm{d}V/\\mathrm{d}x = M"}</M>.</>, <><M>{"M = V\\cdot x"}</M> mindig.</>, <><M>{"\\mathrm{d}M/\\mathrm{d}x = -q"}</M>.</>],
    helyes: 0,
    magyarazat: (
      <>
        Az elemi rúddarab egyensúlyából (8.3.3): <M>{"\\mathrm{d}N/\\mathrm{d}x = -p"}</M>, <M>{"\\mathrm{d}V/\\mathrm{d}x = -q"}</M>, <M>{"\\mathrm{d}M/\\mathrm{d}x = V"}</M>, és így <M>{"\\mathrm{d}^2M/\\mathrm{d}x^2 = -q"}</M>. Ezért van
        az <M>{"M"}</M>-nek szélsőértéke ott, ahol <M>{"V = 0"}</M>, és ezért lesz az <M>{"M"}</M> egy fokkal magasabb fokú, mint a <M>{"V"}</M>.
      </>
    ),
  },
  {
    k: <>Hol van a hajlítónyomaték szélsőértéke egy megoszló teherrel terhelt szakaszon?</>,
    v: [<>Ahol a nyíróerő nulla.</>, <>A szakasz közepén, mindig.</>, <>Ahol a nyíróerő a legnagyobb.</>, <>A támasznál.</>],
    helyes: 0,
    magyarazat: (
      <>
        <M>{"\\mathrm{d}M/\\mathrm{d}x = V"}</M>: ahol <M>{"V"}</M> előjelet vált, ott az <M>{"M"}</M>-nek szélsőértéke van. Szimmetrikus teher szimmetrikus tartón ez a közép, de egy konzolos vagy részlegesen terhelt
        tartón nem — ezért kell mindig kiszámolni az <M>{"x_0 = A_y/p"}</M> (vagy hasonló) helyet.
      </>
    ),
  },
  {
    k: <>Terheletlen tartószakaszon milyen alakúak az igénybevételi ábrák?</>,
    v: [<><M>{"N"}</M> és <M>{"V"}</M> állandó, <M>{"M"}</M> lineáris (speciálisan állandó).</>, <><M>{"V"}</M> lineáris, <M>{"M"}</M> parabola.</>, <>Mindhárom nulla.</>, <><M>{"M"}</M> állandó, <M>{"V"}</M> lineáris.</>],
    helyes: 0,
    magyarazat: (
      <>
        Ha nincs teher, a vetületi egyenletekbe ugyanazok az erők kerülnek minden keresztmetszetnél: <M>{"N"}</M> és <M>{"V"}</M> állandó. A nyomatékban az erők karja lineárisan nő, ezért <M>{"M"}</M> egyenes; ha{" "}
        <M>{"V = 0"}</M> (pl. két szimmetrikus erő között), az <M>{"M"}</M> állandó — „tiszta hajlítás”.
      </>
    ),
  },
  {
    k: <>Tengelyre merőleges, egyenletesen megoszló teher alatt (vízszintes gerenda önsúlya) milyen az ábrák alakja?</>,
    v: [<><M>{"N"}</M> állandó, <M>{"V"}</M> lineáris, <M>{"M"}</M> másodfokú parabola.</>, <><M>{"V"}</M> állandó, <M>{"M"}</M> lineáris.</>, <><M>{"V"}</M> parabola, <M>{"M"}</M> harmadfokú.</>, <><M>{"N"}</M> lineáris, <M>{"V"}</M> állandó.</>],
    helyes: 0,
    magyarazat: (
      <>
        A 8.3.3 táblázat harmadik sora: a figyelembe veendő teherhossz lineárisan nő → <M>{"V"}</M> lineáris; az eredő és a karja is lineárisan változik, a szorzatuk másodfokú → <M>{"M"}</M> parabola. Lineárisan változó
        (háromszög) teher alatt egy-egy fokkal feljebb: <M>{"V"}</M> parabola, <M>{"M"}</M> harmadfokú.
      </>
    ),
  },
  {
    k: <>Mit okoz egy tengelyre merőleges koncentrált erő a támadáspontjában?</>,
    v: [<>A <M>{"V"}</M> ábrában ugrást az erő nagyságával, az <M>{"M"}</M> ábrában törést.</>, <>Az <M>{"M"}</M> ábrában ugrást.</>, <>A <M>{"V"}</M> ábrában törést, az <M>{"M"}</M>-ben ugrást.</>, <>Az <M>{"N"}</M> ábrában ugrást.</>],
    helyes: 0,
    magyarazat: (
      <>
        A merőleges vetületi egyenletbe az erő „bekerül vagy kimarad” → a <M>{"V"}</M> ugrik. A nyomatéki egyenletben az erő karja a saját támadáspontjára nulla → az <M>{"M"}</M> folytonos, de a meredeksége (a{" "}
        <M>{"V"}</M>) ugrik → törés. A törés konvex oldala az erő nyilának konvex oldalára esik.
      </>
    ),
  },
  {
    k: <>Mit okoz egy koncentrált nyomaték a támadáspontjában?</>,
    v: [<>Az <M>{"M"}</M> ábrában ugrást a nyomaték nagyságával; a <M>{"V"}</M> nem változik, az érintők párhuzamosak.</>, <>A <M>{"V"}</M> ábrában ugrást.</>, <>Az <M>{"M"}</M> ábrában törést.</>, <>Semmit, mert nem erő.</>],
    helyes: 0,
    magyarazat: (
      <>
        A vetületi egyenletek a támadáspont két oldalán azonosak (<M>{"N"}</M>, <M>{"V"}</M> változatlan), a nyomatéki egyenletbe viszont az egyik oldalon bekerül a nyomaték → ugrás az <M>{"M"}</M>-ben. Mivel a{" "}
        <M>{"V"}</M> ugyanaz, az ugrás két oldalán az érintő párhuzamos. Az ugrás iránya a nyomaték forgásirányából következik: balról jobbra haladva az óramutatóval ellentétes nyomaték csökkenti az <M>{"M"}</M>-et.
      </>
    ),
  },
  {
    k: <>Egy tengellyel párhuzamos (vízszintes) koncentrált erő a vízszintes tartón melyik ábrában okoz ugrást?</>,
    v: [<>Csak az <M>{"N"}</M> ábrában.</>, <>Csak a <M>{"V"}</M> ábrában.</>, <>Az <M>{"M"}</M> ábrában.</>, <>Mindháromban.</>],
    helyes: 0,
    magyarazat: (
      <>
        A tengelyirányú erő a tengelyirányú vetületi egyenletbe kerül: az <M>{"N"}</M> ugrik. A <M>{"V"}</M>-t nem érinti, és mivel a hatásvonala a tengely, a nyomatékokban sincs karja (az <M>{"M"}</M> folytonos, nem is törik). Ferde
        erőnél a két hatás kombinálódik: <M>{"N"}</M> és <M>{"V"}</M> is ugrik, <M>{"M"}</M> törik.
      </>
    ),
  },
  {
    k: <>Kéttámaszú tartó görgős végén (koncentrált nyomaték nélkül) mekkora a hajlítónyomaték és a nyíróerő?</>,
    v: [<><M>{"M = 0"}</M>, a <M>{"V"}</M> viszont a reakcióval egyenlő nagyságú (nem nulla).</>, <>Mindkettő nulla.</>, <><M>{"M"}</M> a legnagyobb, <M>{"V = 0"}</M>.</>, <><M>{"V = 0"}</M>, <M>{"M"}</M> a reakció nagysága.</>],
    helyes: 0,
    magyarazat: (
      <>
        A tartó végén az igénybevétel az ottani koncentrált hatásokból jön (8.4.2): erő nincs a végen? — de igen, a reakció, tehát a <M>{"V"}</M> ábra a reakció értékével ugrik; nyomaték nem hat, ezért <M>{"M = 0"}</M>. Befogásnál
        viszont a befogási nyomaték miatt <M>{"M \\ne 0"}</M>.
      </>
    ),
  },
  {
    k: <>Miért érdemes a konzol igénybevételeit a szabad vég felől számolni?</>,
    v: [<>Mert így nem kell reakció: minden keresztmetszetnél csak a szabad vég felőli terhek szerepelnek, és a végén a befogásnál kiolvasható a reakció.</>, <>Mert a befogás felől nem lehet számolni.</>, <>Mert a szabad végen a nyomaték a legnagyobb.</>, <>Mert így az előjelek mindig pozitívak.</>],
    helyes: 0,
    magyarazat: (
      <>
        Tankönyv 8.4.1: a konzolon bármely igénybevétel kívülről, a reakcióktól függetlenül számolható — ez alakhelyes, számoktól független ábrát is ad, és a számítás végén a befogásnál lévő értékek megadják a reakciókat
        (ellenőrzés). Egy alul befogott oszlopon ugyanígy: felülről.
      </>
    ),
  },
  {
    k: <>Mekkora a hajlítónyomaték a Gerber-tartó belső csuklójában?</>,
    v: [<>Nulla — kivéve, ha közvetlenül a csukló melletti keresztmetszetben koncentrált nyomaték hat.</>, <>A két szomszédos támasz nyomatékának átlaga.</>, <>Mindig a legnagyobb.</>, <>Nulla, és a nyíróerő is nulla.</>],
    helyes: 0,
    magyarazat: (
      <>
        A csukló nem ad át nyomatékot, ezért a nyomatéki ábra a csuklón átmegy a tengelyen (8.4.6). A nyíróerő viszont nem nulla: a csuklóerő éppen a <M>{"V"}</M> ott. Egyetlen kivétel, ha a csukló mellett közvetlenül
        koncentrált nyomaték hat — akkor az ábra a csuklóban ugrik, a nulla a csukló „másik oldalán” van.
      </>
    ),
  },
  {
    k: <>Tört tengelyű tartó sarkában (ahol nem hat koncentrált nyomaték) hogyan viszonyul egymáshoz a két csonk hajlítónyomatéka?</>,
    v: [<>Egyenlő nagyságúak, és az ábra „befordul” a sarkon: a két oldalon ugyanazon (külső vagy belső) oldalon van.</>, <>Az egyik nulla.</>, <>Az oszlopé mindig kisebb.</>, <>Ellentétes előjelűek, az ábra átmegy a tengelyen.</>],
    helyes: 0,
    magyarazat: (
      <>
        A sarok elemi darabjának nyomatéki egyensúlya (8.4.3, 8.11. ábra): a két csonkra ható nyomatékok egyenlő nagyságúak és ellentétesen forgatnak. Mivel az ábrát a húzott oldalra rajzoljuk, ez úgy jelenik meg,
        hogy az ábra a sarkon ugyanazon az oldalon marad — befordul. Az <M>{"N"}</M> és <M>{"V"}</M> ábrán a sarok viszont mindig szakaszhatár, mert ott a tengely iránya változik.
      </>
    ),
  },
  {
    k: <>Ferde tengelyű tartón hogyan számoljuk az <M>{"N"}</M>-t, a <M>{"V"}</M>-t és az <M>{"M"}</M>-et?</>,
    v: [<><M>{"N"}</M>, <M>{"V"}</M>: a tengelyirányú és a rá merőleges vetületi egyenletekből; <M>{"M"}</M>: kényelmesen a vízszintes és függőleges komponensekkel és karokkal.</>, <>Mindhármat a vízszintes és függőleges vetületből.</>, <>Az <M>{"N"}</M> ferde tartón mindig nulla.</>, <>A <M>{"V"}</M> ferde tartón megegyezik a függőleges erők összegével.</>],
    helyes: 0,
    magyarazat: (
      <>
        Tankönyv 8.4.3: a függőleges erő ferde tartón <M>{"N"}</M>-t is ad (<M>{"F\\sin\\alpha"}</M>), a <M>{"V"}</M>-hez a merőleges komponens (<M>{"F\\cos\\alpha"}</M>) kell. A nyomaték viszont pontszerű mennyiség: a vízszintes
        erők függőleges, a függőlegesek vízszintes karral — ugyanaz, mint a vízszintes tartónál. A parabola belógása <M>{"q\\ell^2/8"}</M>: a ferde hosszal és a merőleges teherkomponenssel.
      </>
    ),
  },
  {
    k: <>Kéttámaszú tartón (<M>{"L = 6\\ \\text{m}"}</M>) egyenletesen megoszló <M>{"p = 4\\ \\text{kN/m}"}</M> teher hat. Mekkora a legnagyobb hajlítónyomaték?</>,
    v: [<><M>{"pL^2/8 = 18\\ \\text{kNm}"}</M> a közepén.</>, <><M>{"pL^2/2 = 72\\ \\text{kNm}"}</M> a közepén.</>, <><M>{"pL/4 = 6\\ \\text{kNm}"}</M>.</>, <><M>{"pL^2/12 = 12\\ \\text{kNm}"}</M>.</>],
    helyes: 0,
    magyarazat: (
      <>
        <M>{"A = B = pL/2 = 12"}</M> kN, a közepén <M>{"V = 0"}</M>, és <M>{"M = 12\\cdot 3 - 4\\cdot 3\\cdot 1{,}5 = 18"}</M> kNm <M>{"= pL^2/8"}</M>. A <M>{"pL^2/2"}</M> a konzol befogási nyomatéka, a <M>{"FL/4"}</M> a középen álló
        erőé — ezt a négy alapképletet (<M>{"pL^2/8,\\ FL/4,\\ FL,\\ pL^2/2"}</M>) tudni kell fejből, a puskán is rajta van.
      </>
    ),
  },
  {
    k: <>A bal oldali és a jobb oldali tartórészből számolva ugyanannak a keresztmetszetnek az igénybevételei…</>,
    v: [<>…azonos előjelűek és nagyságúak (hatás–ellenhatás + az előjelszabály), ezért elég egyszer számolni, de a másik oldal jó ellenőrzés.</>, <>…ellentétes előjelűek.</>, <>…csak konzolnál egyeznek meg.</>, <>…különbözhetnek, ha a tartó nem szimmetrikus.</>],
    helyes: 0,
    magyarazat: (
      <>
        A belső erők a két részen egymás ellentettjei (hatás–ellenhatás), de az előjelszabály is „megfordul” a két oldalon, így a számérték és az előjel azonos (8.1.2.2). Ezért hagyhatjuk el a b és j indexet — és ezért jó
        ellenőrzés, ha egy keresztmetszetet mindkét oldalról kiszámolunk.
      </>
    ),
  },
];

export const HIBAK = [
  {
    cim: "A nyíróerő előjele a bal támasznál",
    feladat: (
      <>
        Kéttámaszú tartó, <M>{"L = 6\\ \\text{m}"}</M>, az <M>{"x = 2"}</M> m helyen <M>{"F = 12\\ \\text{kN}"}</M> lefelé. Rajzoljuk meg a <M>{"V"}</M> ábrát.
      </>
    ),
    lepesek: [
      { szoveg: <>Reakciók: <M>{"\\Mp{A} -2\\cdot 12 + 6\\,B = 0 \\;\\Rightarrow\\; B = 4"}</M> kN, <M>{"A_y = 12 - 4 = 8"}</M> kN, mindkettő felfelé.</> },
      {
        szoveg: <>A bal támasz mellett a bal oldali részre csak <M>{"A_y"}</M> hat felfelé, ezért <M>{"V = -8"}</M> kN (az ábra a tengely fölött indul).</>,
        hibas: true,
        javitas: (
          <>
            A bal oldali részen a pozitív <M>{"V"}</M> <em>lefelé</em> hat a keresztmetszetre (a pozitív <M>{"N"}</M> óramutató szerinti elforgatottja), így <M>{"\\Fy 8 - V = 0 \\;\\Rightarrow\\; V = +8"}</M> kN: a felfelé mutató reakció
            pozitív nyíróerőt ad. A pozitív értéket a tartó pozitív (alsó) oldalára mérjük fel — ugyanoda, ahová a pozitív <M>{"M"}</M>-et —, tehát az ábra a tengely <em>alatt</em> indul. Az erő alatt 12-vel <M>{"-4"}</M>-re ugrik
            (átmegy a tengely fölé), és a <M>{"B"}</M> reakció zárja vissza nullára.
          </>
        ),
      },
      { szoveg: <>Az erő alatt a <M>{"V"}</M> 12 kN-nal ugrik, a jobb támaszig állandó.</> },
      { szoveg: <>Ellenőrzés a jobb végen: a <M>{"B"}</M> reakció az ugrással visszazárja az ábrát nullára.</> },
    ],
    tanulsag: <>A nyíróerő előjele nem „felfelé pozitív”, hanem a keresztmetszet oldalától függ: a bal részen a felfelé mutató erők adnak pozitív <M>{"V"}</M>-t. Legegyszerűbb a bal végről indulni és végig ugyanarról az oldalról számolni. Az ábrán pedig a pozitív <M>{"V"}</M> is a tartó alá kerül, mint a pozitív <M>{"M"}</M> (8.3.2).</>,
  },
  {
    cim: "Elfelejtett reakció a bal oldali részen",
    feladat: (
      <>
        Ugyanaz a tartó: <M>{"L = 6\\ \\text{m}"}</M>, <M>{"F = 12\\ \\text{kN}"}</M> az <M>{"x = 2"}</M> m helyen (<M>{"A_y = 8"}</M>, <M>{"B = 4"}</M> kN). Mekkora a nyomaték az <M>{"x = 4"}</M> m helyen?
      </>
    ),
    lepesek: [
      { szoveg: <>Elvágjuk a tartót az <M>{"x = 4"}</M> m-nél, a bal oldali részt nézzük.</> },
      { szoveg: <>A bal részen az <M>{"F"}</M> erő hat, karja <M>{"4 - 2 = 2"}</M> m.</> },
      {
        szoveg: <><M>{"\\Mj{K} -2\\cdot 12 - M_K = 0 \\;\\Rightarrow\\; M_K = -24"}</M> kNm (felül húzott).</>,
        hibas: true,
        javitas: (
          <>
            A bal oldali részen a <em>reakció</em> is ott van: <M>{"A_y = 8"}</M> kN felfelé, karja 4 m. Helyesen <M>{"\\Mj{K} +4\\cdot 8 - 2\\cdot 12 - M_K = 0 \\;\\Rightarrow\\; M_K = 8"}</M> kNm, alul húzott. Ellenőrzés a jobb
            oldali részből: csak <M>{"B = 4"}</M> kN 2 m karral: <M>{"M_K = 4\\cdot 2 = 8"}</M> kNm ✓. Egy kéttámaszú tartón lefelé ható teher alatt az alsó szál húzott — a <M>{"-24"}</M> már ránézésre gyanús.
          </>
        ),
      },
      { szoveg: <>Ellenőrzés a jobb oldali részből.</> },
    ],
    tanulsag: <>Az elvágott rész <em>minden</em> erejét fel kell írni — a reakciókat is. Ha az ábra alakja nem stimmel a teherrel (lefelé ható teher, mégis felül húzott szál), valami kimaradt.</>,
  },
  {
    cim: "Parabola helyett egyenes",
    feladat: (
      <>
        Kéttámaszú tartó, <M>{"L = 6\\ \\text{m}"}</M>, a teljes hosszon <M>{"p = 4\\ \\text{kN/m}"}</M>. Rajzoljuk meg az <M>{"M"}</M> ábrát.
      </>
    ),
    lepesek: [
      { szoveg: <>Reakciók: <M>{"Q = 24"}</M> kN a közepén, <M>{"A_y = B = 12"}</M> kN.</> },
      { szoveg: <>A támaszoknál <M>{"M = 0"}</M>.</> },
      {
        szoveg: <>A közepén <M>{"M = 12\\cdot 3 = 36"}</M> kNm; az ábra két egyenes szakasz, csúcsa a közepén 36 kNm-nél.</>,
        hibas: true,
        javitas: (
          <>
            Az <M>{"x = 3"}</M> m-es keresztmetszettől balra nemcsak <M>{"A_y"}</M> hat, hanem a teher balra eső fele is: <M>{"4\\cdot 3 = 12"}</M> kN, karja 1,5 m. <M>{"\\Mj{K} +3\\cdot 12 - 1{,}5\\cdot 12 - M = 0 \\;\\Rightarrow\\; M = 18"}</M> kNm
            <M>{"= pL^2/8"}</M>. És az ábra nem törik meg: megoszló teher alatt a <M>{"V"}</M> lineáris (12-ről −12-re), az <M>{"M"}</M> másodfokú parabola, a közepén vízszintes érintővel (<M>{"V = 0"}</M>).
          </>
        ),
      },
      { szoveg: <>Az ábrát a húzott (alsó) oldalra rajzoljuk.</> },
    ],
    tanulsag: <>A megoszló terhet nem szabad az ábra rajzolásakor egyetlen koncentrált erővel helyettesíteni — csak a reakciók számításakor. A szakaszon belül a teher darabja is nyomatékot ad, és ettől lesz parabola az ábra.</>,
  },
  {
    cim: "Az ugrás iránya a koncentrált nyomatéknál",
    feladat: (
      <>
        Kéttámaszú tartó, <M>{"L = 4\\ \\text{m}"}</M>, a közepén <M>{"M_0 = 10\\ \\text{kNm}"}</M> koncentrált nyomaték, az óramutatóval ellentétesen forgat. Mekkora az <M>{"M"}</M> a támadásponttól közvetlenül jobbra?
      </>
    ),
    lepesek: [
      { szoveg: <>Reakciók: <M>{"\\Mp{A} +10 + 4\\,B = 0 \\;\\Rightarrow\\; B = -2{,}5"}</M> kN (lefelé), <M>{"\\Fy A_y + B = 0 \\;\\Rightarrow\\; A_y = 2{,}5"}</M> kN felfelé.</> },
      { szoveg: <>A támadásponttól balra: <M>{"\\Mj{K} +2\\cdot 2{,}5 - M^- = 0 \\;\\Rightarrow\\; M^- = 5"}</M> kNm.</> },
      {
        szoveg: <>Jobbra a nyomaték hozzáadódik: <M>{"M^+ = 5 + 10 = 15"}</M> kNm.</>,
        hibas: true,
        javitas: (
          <>
            Az ugrás iránya a forgásirányból következik. A bal oldali részre az óramutatóval ellentétes <M>{"M_0"}</M> az óramutató szerint pozitív egyenletben <em>negatív</em>:{" "}
            <M>{"\\Mj{K} +2\\cdot 2{,}5 - 10 - M^+ = 0 \\;\\Rightarrow\\; M^+ = -5"}</M> kNm. Ellenőrzés a jobb részből: csak <M>{"B = 2{,}5"}</M> kN lefelé, 2 m karral: <M>{"M^+ = -2{,}5\\cdot 2 = -5"}</M> kNm ✓. Az ugrás nagysága 10 kNm, de
            a negatív irányba (5-ről −5-re): az alul húzott szál felül húzottba vált, az ábra a tengely alól a tengely fölé ugrik.
          </>
        ),
      },
      { szoveg: <>A <M>{"V"}</M> ábra a támadáspontban nem változik (<M>{"V = 2{,}5"}</M> kN végig), ezért az érintők az ugrás két oldalán párhuzamosak.</> },
    ],
    tanulsag: <>Koncentrált nyomatéknál mindig a másik oldalról is számold ki az ugrás utáni értéket — így nem lehet eltéveszteni az irányt. Szabály: balról jobbra haladva az óramutatóval ellentétes nyomaték csökkenti az <M>{"M"}</M>-et.</>,
  },
  {
    cim: "M a csuklóban nem nulla",
    feladat: (
      <>
        Gerber-tartó: <M>{"A"}</M> csukló (<M>{"x = 0"}</M>), <M>{"B"}</M> görgő (<M>{"x = 4"}</M> m), <M>{"G"}</M> belső csukló (<M>{"x = 6"}</M> m), <M>{"D"}</M> görgő (<M>{"x = 9"}</M> m). Az <M>{"AB"}</M> szakaszon{" "}
        <M>{"p = 3\\ \\text{kN/m}"}</M>, az <M>{"x = 7{,}5"}</M> m helyen <M>{"F = 12\\ \\text{kN}"}</M>. Rajzoljuk meg az <M>{"M"}</M> ábrát.
      </>
    ),
    lepesek: [
      { szoveg: <>A befüggesztett <M>{"GD"}</M> rész: az <M>{"F"}</M> a 3 m-es szakasz közepén, <M>{"D = 6"}</M> kN, a csuklóerő <M>{"G = 6"}</M> kN.</> },
      {
        szoveg: <>A <M>{"G"}</M> csuklónál a nyomaték: <M>{"M_G = -12\\cdot 1{,}5 = -18"}</M> kNm, mert a <M>{"GD"}</M> rész a <M>{"G"}</M>-ből kinyúló konzol.</>,
        hibas: true,
        javitas: (
          <>
            A <M>{"GD"}</M> rész nem konzol, hanem a <M>{"G"}</M> csuklóra és a <M>{"D"}</M> görgőre támaszkodó kéttámaszú tartó: a csukló nem ad át nyomatékot, tehát <M>{"M_G = 0"}</M>, az <M>{"F"}</M> alatt{" "}
            <M>{"M = D\\cdot 1{,}5 = 9"}</M> kNm (alul húzott). A csuklóerő csak <em>erő</em>: 6 kN, amely a fix rész konzolvégét terheli.
          </>
        ),
      },
      { szoveg: <>A fix <M>{"ABG"}</M> részre a <M>{"G"}</M>-ben 6 kN lefelé és a megoszló teher (<M>{"Q = 12"}</M> kN az <M>{"x = 2"}</M> m-nél): <M>{"\\Mp{A} -2\\cdot 12 - 6\\cdot 6 + 4\\,B = 0 \\;\\Rightarrow\\; B = 15"}</M> kN, <M>{"A_y = 3"}</M> kN.</> },
      { szoveg: <>Ellenőrzés a csuklóban balról: <M>{"\\Mj{G} +6\\cdot 3 - 4\\cdot 12 + 2\\cdot 15 - M_G = 0 \\;\\Rightarrow\\; M_G = 0"}</M> ✓; a <M>{"B"}</M> fölött <M>{"M_B = -6\\cdot 2 = -12"}</M> kNm.</> },
    ],
    tanulsag: <>A Gerber-tartón a belső csuklóban <M>{"M = 0"}</M>: az ábra ott metszi a tengelyt. Előbb a befüggesztett rész (kéttámaszú tartóként), aztán a fix rész, és a végén a csuklóban a nyomaték nulla legyen — ez az ellenőrzés.</>,
  },
  {
    cim: "Ferde tartón elfelejtett normálerő",
    feladat: (
      <>
        Ferde tartó: <M>{"A"}</M> csukló az origóban, <M>{"B"}</M> görgő a <M>{"(4;\\ 3)"}</M> m pontban (<M>{"\\ell = 5"}</M> m, <M>{"\\sin\\alpha = 0{,}6"}</M>, <M>{"\\cos\\alpha = 0{,}8"}</M>), a tengely közepén{" "}
        <M>{"F = 10\\ \\text{kN}"}</M> függőleges erő. Mekkorák az igénybevételek a tengely mentén <M>{"s = 1{,}25"}</M> m-re (<M>{"x = 1"}</M> m)?
      </>
    ),
    lepesek: [
      { szoveg: <>Reakciók (vízszintes karokkal): <M>{"\\Mp{A} -2\\cdot 10 + 4\\,B = 0 \\;\\Rightarrow\\; B = 5"}</M> kN, <M>{"A_y = 5"}</M> kN, <M>{"A_x = 0"}</M>.</> },
      {
        szoveg: <>Csak függőleges erők hatnak, ezért <M>{"N = 0"}</M>; a nyíróerő <M>{"V = A_y = 5"}</M> kN.</>,
        hibas: true,
        javitas: (
          <>
            Ferde tartón a függőleges erőnek is van tengelyirányú komponense: <M>{"\\Fz 5\\cdot 0{,}6 + N = 0 \\;\\Rightarrow\\; N = -3"}</M> kN (nyomott), és a merőleges vetületből{" "}
            <M>{"V = 5\\cdot 0{,}8 = 4"}</M> kN. A nyomaték a vízszintes karral: <M>{"M = 5\\cdot 1 = 5"}</M> kNm. Az <M>{"N"}</M> és a <M>{"V"}</M> „ferde” vetületekből jön, csak az <M>{"M"}</M> ugyanaz, mint a vízszintes tartón.
          </>
        ),
      },
      { szoveg: <>A nyomaték: <M>{"M = A_y\\cdot x = 5\\cdot 1 = 5"}</M> kNm.</> },
    ],
    tanulsag: <>Ferde tartón mindig bontsd fel a bal (vagy jobb) rész eredőjét a tengely irányába és arra merőlegesen — a függőleges teher normálerőt is ad. Az <M>{"N"}</M> ábra ferde tartón általában nem nulla.</>,
  },
  {
    cim: "A konzol ábrája a rossz végről indul",
    feladat: (
      <>
        Bal végén befogott konzol, <M>{"L = 3\\ \\text{m}"}</M>, teljes hosszán <M>{"p = 4\\ \\text{kN/m}"}</M>. Rajzoljuk meg a <M>{"V"}</M> és az <M>{"M"}</M> ábrát.
      </>
    ),
    lepesek: [
      { szoveg: <>A teljes teher <M>{"Q = 12"}</M> kN.</> },
      {
        szoveg: <>A szabad végen <M>{"V = 12"}</M> kN, innen lineárisan csökken a befogásig nullára; az <M>{"M"}</M> a szabad végen <M>{"12\\cdot 1{,}5 = 18"}</M> kNm.</>,
        hibas: true,
        javitas: (
          <>
            Fordítva: a szabad végen nincs koncentrált hatás, ezért ott <M>{"V = 0"}</M> és <M>{"M = 0"}</M>. Kívülről befelé haladva <M>{"V(s) = p\\,s"}</M> lineárisan nő a befogásnál 12 kN-ig, az{" "}
            <M>{"M(s) = -p\\,s^2/2"}</M> parabola a befogásnál <M>{"-18"}</M> kNm (felül húzott) — a szabad végen az érintője vízszintes (<M>{"V = 0"}</M>). A befogásnál lévő értékek éppen a reakciók: <M>{"A_y = 12"}</M> kN,{" "}
            <M>{"M_A = 18"}</M> kNm.
          </>
        ),
      },
      { szoveg: <>Az ábrát a húzott oldalra rajzoljuk: a konzolon a felső szál húzott.</> },
    ],
    tanulsag: <>Konzolnál a szabad vég felől indulj: ott az igénybevételek nullák (hacsak nem hat ott koncentrált erő vagy nyomaték), és a befogás felé nőnek. A legnagyobb <M>{"V"}</M> és <M>{"M"}</M> a befogásnál van.</>,
  },
];
