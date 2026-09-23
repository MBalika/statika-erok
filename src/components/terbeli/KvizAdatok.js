import { M } from "@/components/ui/Keplet";

/** A 10. modul (térbeli tartók) fogalmi kvíze és hibakeresője. */

export const KVIZ = [
  {
    k: <>Hány független egyensúlyi egyenlet írható fel egy merev testre térben, és milyenek?</>,
    v: [<>Hat: három vetületi (x, y, z) és három nyomatéki, egymásra merőleges tengelyekre.</>, <>Három: két vetületi és egy nyomatéki.</>, <>Kilenc: három-három minden síkra.</>, <>Hat: hat nyomatéki egyenlet tetszőleges tengelyekre.</>],
    helyes: 0,
    magyarazat: (
      <>
        A síkba vetítés három síkbeli feladatot ad, 3 × 3 = 9 egyenlettel, de a vetületi egyenletek kétszer szerepelnek — hat független marad (tankönyv 9.1.1). Hat nyomatéki egyenlet két ponton átmenő tengelyekre <em>nem</em> független: a két pontot
        összekötő tengelyre írt egyenlet kétszer szerepel.
      </>
    ),
  },
  {
    k: <>Mekkora a merev befogás, a gömbcsukló, a támasztórúd és a tengelycsukló fokszáma térben?</>,
    v: [<>6, 3, 1, 5</>, <>3, 2, 1, 2</>, <>6, 2, 1, 4</>, <>6, 3, 3, 5</>],
    helyes: 0,
    magyarazat: (
      <>
        A fokszám a megakadályozott elmozdulás-komponensek (és az ismeretlen reakció-adatok) száma: befogás 3 erő + 3 nyomaték = 6; gömbcsukló 3 erő; rúd 1 (rúdirányú erő); tengelycsukló 3 erő + 2 nyomaték = 5 (csak a tengely körül foroghat) — tankönyv 9.1. ábra.
      </>
    ),
  },
  {
    k: <>Miért oldható meg a háromlábú bakállvány három egyenletből, ha térben hat egyenlet van?</>,
    v: [<>Mert a csomópontra ható erők közös metszéspontúak: a csomópontra írt három nyomatéki egyenlet 0 = 0 azonosság.</>, <>Mert három rúd van, és minden rúd egy egyenletet ad.</>, <>Mert a bakállvány síkbeli feladat.</>, <>Mert a nyomatéki egyenleteket nem lehet térben felírni.</>],
    helyes: 0,
    magyarazat: (
      <>
        A rudak és a teher hatásvonala mind átmegy a csúcson, ezért a csúcsra nézve minden kar nulla: a nyomatéki egyenletek nem adnak információt. Marad a három vetületi egyenlet a három rúderőre (tankönyv 9.2.2, (9.3)–(9.5)).
      </>
    ),
  },
  {
    k: <>Mikor <em>nincs</em> egyértelmű megoldása a bakállvány egyenleteinek?</>,
    v: [<>Ha a három rúd egy közös síkban fekszik.</>, <>Ha a teher függőleges.</>, <>Ha a rudak nem egyforma hosszúak.</>, <>Ha a csúcs nem az y tengelyen van.</>],
    helyes: 0,
    magyarazat: (
      <>
        Ha a három rúd egy síkba esik, a síkra merőleges vetületi egyenletben egyik rúderő sem szerepel — a síkra merőleges teherkomponenst semmi nem egyensúlyozza (kritikus elrendezés). Egyébként a páronként két rúd síkjára merőleges vetületi egyenletben csak a
        harmadik rúderő marad, és az egyértelműen kijön.
      </>
    ),
  },
  {
    k: <>Egy rúderőre a számításból <M>{"S_2 = -8{,}2\\ \\text{kN}"}</M> adódott. Mit jelent?</>,
    v: [<>A rúd nyomott: a csomópontot a talppont felől tolja 8,2 kN-nal.</>, <>A rúd húzott, csak a talppont felől nézve.</>, <>Számolási hiba, a rúderő nem lehet negatív.</>, <>A rúd erőtlen, az előjel nem értelmezhető.</>],
    helyes: 0,
    magyarazat: <>A rúderőt mindig húzóerőként vesszük fel (a csomópontból a talppont felé mutató egységvektorral). A negatív érték azt jelenti, hogy a tényleges erő ellentétes: a rúd nyomott. A vizsgán a helyes előjel a pont fele!</>,
  },
  {
    k: <>Mereven befogott térbeli konzolnál miért egyismeretlenesek a nyomatéki egyenletek, ha a befogás ponton átmenő tengelyekre írjuk őket?</>,
    v: [<>Mert a három reakcióerő-komponens metszi ezeket a tengelyeket (karjuk nulla), és a merőleges nyomatékkomponensek vetülete nulla.</>, <>Mert a befogásnál nincs reakcióerő, csak nyomaték.</>, <>Mert a terhek nem forgatnak a befogás pontjára.</>, <>Mert térben minden nyomatéki egyenlet egyismeretlenes.</>],
    helyes: 0,
    magyarazat: <>Tankönyv 9.2.3: az A ponton átmenő tengelyek körül rendre csak egy ismeretlen nyomatékkomponens forgat — a reakcióerők hatásvonala átmegy a tengelyen, a másik két nyomatékkomponens merőleges rá. Ezért a konzol mindig „kényelmes” feladat.</>,
  },
  {
    k: <>Egy merev testet egy gömbcsuklóval és három rúddal támasztunk meg. Melyik elrendezés <em>nem</em> jó?</>,
    v: [<>Ha az egyik rúd hatásvonala átmegy a gömbcsuklón.</>, <>Ha a három rúd nem egyforma hosszú.</>, <>Ha két rúd párhuzamos, de nem esnek egy síkba a harmadikkal.</>, <>Ha a rudak nem függőlegesek.</>],
    helyes: 0,
    magyarazat: (
      <>
        A csuklón átmenő rúd nem tud a csukló körüli elfordulást gátolni: a csukló + ez a rúd együtt „csak” három fokszámot ér. Ugyancsak rossz, ha mindhárom rúd párhuzamos (tankönyv 9.2.3). Két párhuzamos rúd önmagában még nem baj — a tankönyv épp ezt
        használja tippként: a csuklón átmenő, a párhuzamosokkal párhuzamos tengelyre írt nyomatéki egyenletben csak a harmadik rúderő marad.
      </>
    ),
  },
  {
    k: <>Két gömbcsuklóval megtámasztott test — miért nem tartó?</>,
    v: [<>A két csuklót összekötő egyenes körüli forgatást semmi nem egyensúlyozza.</>, <>Mert 3 + 3 = 6 &lt; 6, kevés a kényszer.</>, <>Mert két csukló mindig fölös kényszert ad.</>, <>Tartó: hat a fokszám, hat az egyenlet.</>],
    helyes: 0,
    magyarazat: <>A számlálás (6 = 6) stimmel, mégis kritikus: a két csuklón átmenő tengelyre írt nyomatéki egyenletben egyetlen reakció sem szerepel, tehát létezik teher (egy ekörül forgató nyomaték), amire nincs egyensúly. Egyszerre határozatlan (a tengely menti erő megoszlása) és túlhatározott.</>,
  },
  {
    k: <>Térbeli rácsos tartón hány egyenlet és hány ismeretlen van (<M>{"c"}</M> csomópont, <M>{"r"}</M> rúd, <M>{"k"}</M> kényszerfok)?</>,
    v: [<><M>{"e = 3c"}</M>, <M>{"i = r + k"}</M></>, <><M>{"e = 2c"}</M>, <M>{"i = r + k"}</M></>, <><M>{"e = 6c"}</M>, <M>{"i = r + k"}</M></>, <><M>{"e = 3c"}</M>, <M>{"i = 3r + k"}</M></>],
    helyes: 0,
    magyarazat: <>Csomópontonként közös metszéspontú térbeli erőrendszer: három vetületi egyenlet. Az ismeretlenek a rúderők és a reakciókomponensek. Az átmetszéses módszer térben hatos átmetszést kíván (hat egyenlet a levágott részre).</>,
  },
  {
    k: <>Melyik igénybevétel a <em>csavarónyomaték</em>, és mikor pozitív?</>,
    v: [<>A nyomatékvektor tartótengely-irányú komponense; pozitív, ha a vektor a keresztmetszetből kifelé mutat.</>, <>A keresztmetszet síkjába eső nyomatékkomponens; pozitív, ha a húzott oldal alul van.</>, <>A tengelyirányú erőkomponens; pozitív, ha húz.</>, <>Bármelyik nyomatékkomponens, ha az óramutató szerint forgat.</>],
    helyes: 0,
    magyarazat: <>Tankönyv 9.3: a nyomatékvektort egy tengelyirányú (csavaró, T) és két keresztmetszet-síkbeli (hajlító) komponensre bontjuk. A T előjelét a normálerőhöz hasonlóan a kifelé mutató vektorhoz társítjuk: kívülről a keresztmetszetre nézve az óramutatóval ellentétesen forgató csavarás a pozitív.</>,
  },
  {
    k: <>Hogyan döntjük el a nyíróerők és a hajlítónyomatékok előjelét térben, ha a tartó szakaszai a globális tengelyekkel párhuzamosak?</>,
    v: [<>A követő tartórész felől a megelőző rész keresztmetszetére ható komponens pozitív, ha a globális tengely pozitív irányába mutat.</>, <>A pozitív normálerőt az óramutató szerint 90°-kal elforgatjuk, mint síkban.</>, <>Mindig a húzott oldalra rajzoljuk, előjel nincs.</>, <>A nagyságuk számít, az előjel nem értelmezhető térben.</>],
    helyes: 0,
    magyarazat: <>A síkbeli „forgasd el 90°-kal” szabály térben nem egyértelmű (melyik tengely körül?). A tankönyv ezért a keresztmetszet síkjába eső két globális tengelyt tekinti pozitívnak; a követő rész az, amelyik felé a tengelyirányú koordinátatengely mutat. A megelőző rész keresztmetszetén a nyilak a negatív irányba mutatnak ugyanazon előjel mellett (hatás–ellenhatás).</>,
  },
  {
    k: <>Egy egyenes rúd végén ható erő mekkora csavarónyomatékot ad a rúd egy keresztmetszetében?</>,
    v: [<>Nullát: az erő hatásvonala metszi a rúd tengelyét.</>, <>Az erő és a kar szorzatát.</>, <>Az erő tengelyirányú komponensének és a rúdhossznak a szorzatát.</>, <>Attól függ, milyen irányú az erő.</>],
    helyes: 0,
    magyarazat: <>A tengelyre vett nyomaték nulla, ha az erő hatásvonala metszi a tengelyt vagy párhuzamos vele (2. modul, 2.7). A csavarás csak kitérő hatásvonalú erőből származik — a H13/2 K1 keresztmetszetében a vízszintes szár végén ható erő csavarja a függőleges szárat, a K2-ben (a vízszintes száron) nem.</>,
  },
  {
    k: <>Egy erő nyomatékát egy ferde tengelyre kell felírni. Mi a recept?</>,
    v: [<>A tengely egy pontjára vett nyomatékvektort skalárisan szorozzuk a tengely egységvektorával.</>, <>Az erőt a tengelyre vetítjük, és a vetületet szorozzuk a távolsággal.</>, <>Az erőt a tengelyre merőleges síkra vetítjük, a nyomaték ennek a hossza.</>, <>Ferde tengelyre nem lehet nyomatékot felírni.</>],
    helyes: 0,
    magyarazat: <><M>{"M_t = \\underline M_Q\\cdot\\underline e_t"}</M>, <M>{"\\underline M_Q = (\\underline r_P - \\underline r_Q)\\times\\underline F"}</M>, Q a tengely bármely pontja. A tankönyv (9.1.1) szerint ez „sok munkával, de kivitelezhető” — a bakállványnál a két talppontot összekötő tengelyre írt egyenlet így ad egyismeretlenes egyenletet.</>,
  },
  {
    k: <>Egy tartályt folyadék tölt ki. Hol és mekkora a térfogat mentén megoszló teher eredője?</>,
    v: [<>A töltés térfogatának súlypontjában, nagysága <M>{"\\gamma V"}</M>.</>, <>A tartály alján, nagysága <M>{"\\gamma h A"}</M>, a felület közepén.</>, <>A tartály geometriai középpontjában, nagysága <M>{"\\gamma A"}</M>.</>, <>A töltés felszínén, nagysága <M>{"\\gamma V"}</M>.</>],
    helyes: 0,
    magyarazat: <>Tankönyv 9.1.3: az állandó intenzitású térfogati teher részeredői a részek térfogatának és az intenzitásnak a szorzatai, a részek súlypontjában. Egy téglatest töltésnél ez a téglatest középpontja. (A falakra ható folyadéknyomás a tartály belső erője — a támaszokat a töltés súlya terheli.)</>,
  },
  {
    k: <>Mikor <em>nem</em> alkalmas hat támasztórúd egy merev test megtámasztására?</>,
    v: [<>Ha négy rúd párhuzamos, vagy a hatásvonalaik egy pontban metszik egymást, vagy három rúd egy síkban fekszik és párhuzamos / egy ponton átmenő.</>, <>Ha a rudak különböző hosszúságúak.</>, <>Ha nem mindegyik rúd függőleges.</>, <>Hat rúd mindig megfelelő, mert 6 = 6.</>],
    helyes: 0,
    magyarazat: <>Tankönyv 9.2.3: a számlálás csak szükséges feltétel. A felsorolt elrendezések kritikusak — a fölös kényszer mellett szabad mozgás marad. Ellenőrzés: keress olyan tengelyt, amely körül egyetlen rúd sem forgat: ha van, a szerkezet elmozdulhat.</>,
  },
];

export const HIBAK = [
  {
    cim: "A rúderő „lefelé”, nem a rúd mentén",
    feladat: <>Bakállvány: a csúcson F = 10 kN függőleges teher; a rudak ferdék. Számítsd ki a rúderőket!</>,
    lepesek: [
      { szoveg: <>Elkülönítés: a csúcsra F és a három rúderő hat.</> },
      {
        szoveg: <><M>{"\\Fy -10 + S_1 + S_2 + S_3 = 0"}</M>, és a szimmetria miatt <M>{"S_1 = S_2 = S_3 = 3{,}33"}</M> kN.</>,
        hibas: true,
        javitas: (
          <>
            A rúderő a rúd irányában hat, nem függőlegesen: az <M>{"y"}</M> vetületben <M>{"S_i\\,l_{iy}/l_i"}</M> szerepel (tankönyv (9.4)). Ferde rudaknál <M>{"|S_i| > F/3"}</M>; a helyes egyenlet <M>{"-10 + \\sum S_i\\,l_{iy}/l_i = 0"}</M>, és az <M>{"x, z"}</M>{" "}
            vetületi egyenleteket is fel kell írni (ha nincs szimmetria, azokból jön ki, hogy nem egyenlők).
          </>
        ),
      },
      { szoveg: <>Ellenőrzés az <M>{"x"}</M> és <M>{"z"}</M> vetületi egyenlettel.</> },
    ],
    tanulsag: <>Minden rúderőt bontsunk komponensekre az egységvektorával — a rúd nem tud „lefelé” tartani, csak a saját tengelye mentén.</>,
  },
  {
    cim: "Nyomaték a rossz tengely körül",
    feladat: <>H13/1: a konzol végén F = 10 kN a −z irányban, a kinyúlás a = 2 m, a magasság b = 3 m. Írd fel a nyomatéki egyenleteket az A-ra!</>,
    lepesek: [
      { szoveg: <>A vetületi egyenletekből <M>{"A_z = 10"}</M> kN, <M>{"A_x = A_y = 0"}</M>.</> },
      {
        szoveg: <><M>{"\\sum M_{iz}:\\ 10\\cdot 2 + M_{Az} = 0 \\Rightarrow M_{Az} = -20"}</M> kNm, mert az erő 2 m-re hat a függőleges szártól.</>,
        hibas: true,
        javitas: (
          <>
            A <M>{"z"}</M> tengellyel az erő <em>párhuzamos</em>, arra nem forgat: <M>{"M_{Az} = 0"}</M>. A 2 m-es kar az <M>{"y"}</M> tengely körüli forgatáshoz tartozik (<M>{"\\sum M_{iy}:\\ -(-2)(-10) + M_{Ay} = 0 \\Rightarrow M_{Ay} = 20"}</M>), a 3 m-es
            kar az <M>{"x"}</M> tengely körülihez (<M>{"M_{Ax} = 30"}</M>). Használd a komponensképletet: <M>{"M_z = xF_y - yF_x = 0"}</M>.
          </>
        ),
      },
      { szoveg: <>Ellenőrzés az E ponton átmenő tengelyekre.</> },
    ],
    tanulsag: <>A kar mindig a tengelytől mért, a tengelyre és az erőre is merőleges távolság; az erővel párhuzamos tengelyre a nyomaték nulla. Ha bizonytalan vagy, <M>{"\\underline r\\times\\underline F"}</M> komponensei döntenek.</>,
  },
  {
    cim: "A követő és a megelőző rész előjele",
    feladat: <>H13/2: a K2 keresztmetszet (a vízszintes száron, tengely: x) igénybevételei a szabad végi részből, F = (0; 0; −10) kN, kar 1 m.</>,
    lepesek: [
      { szoveg: <>A szabad végi rész a K2 <em>megelőző</em> része (a −x oldalon).</> },
      {
        szoveg: <>A belső erő a rá ható erők összege: <M>{"\\underline R_{K2} = \\underline F = (0;\\ 0;\\ -10)"}</M>, tehát <M>{"V_z = -10"}</M> kN.</>,
        hibas: true,
        javitas: (
          <>
            A megelőző rész keresztmetszetére ható belső erő a rész <em>egyensúlyából</em> jön: <M>{"\\underline R_{K2} = -\\sum\\underline F = (0;\\ 0;\\ 10)"}</M>, azaz <M>{"V_z = +10"}</M> kN. A „plusz összeg” szabály a <em>követő</em> részre igaz (<M>{"\\underline R = +\\sum\\underline F"}</M>). Ugyanígy a
            nyomaték: <M>{"\\underline M_{K2} = -(\\underline r_E - \\underline r_K)\\times\\underline F = (0;\\ 10;\\ 0)"}</M>.
          </>
        ),
      },
      { szoveg: <>Ellenőrzés a másik részből a reakciókkal.</> },
    ],
    tanulsag: <>Jegyezd meg a párt: követő rész → +Σ; megelőző rész → −Σ. Mindkettő ugyanazt az előjeles értéket adja — ez az ellenőrzés.</>,
  },
  {
    cim: "Csuklóreakció a nyomatéki egyenletben",
    feladat: <>H13/4: tartály gömbcsuklóval az A pontban és három rúddal. Számítsd ki a rúderőket!</>,
    lepesek: [
      { szoveg: <>Elkülönítés: <M>{"A_x, A_y, A_z"}</M>, <M>{"S_1, S_2, S_3"}</M>; a teher <M>{"G = 480"}</M> kN a súlypontban.</> },
      {
        szoveg: <>Nyomatéki egyenlet az origón átmenő <M>{"x"}</M> tengelyre: <M>{"960 - 4S_1 - 4A_y = 0"}</M> — két ismeretlen, ezért felírjuk a többi egyenletet is, és 6 × 6-os rendszert oldunk meg.</>,
        hibas: true,
        javitas: (
          <>
            Nem hibás, de fölösleges munka — és a tankönyv (9.2.3) kifejezetten kerülendőnek mondja. A nyomatéki egyenleteket az <M>{"A"}</M> csuklón átmenő tengelyekre írjuk: a csukló mindhárom komponense kiesik, minden egyenletben egyetlen rúderő marad
            (<M>{"S_3 = -240"}</M>, <M>{"S_2 = 0"}</M>, <M>{"S_1 = -270"}</M>), utána a vetületi egyenletek adják <M>{"A"}</M>-t. Az origóra írt egyenlet jó lesz ellenőrzésnek.
          </>
        ),
      },
      { szoveg: <>Vetületi egyenletek → <M>{"A_x = 60"}</M>, <M>{"A_y = -30"}</M>, <M>{"A_z = 0"}</M>.</> },
    ],
    tanulsag: <>Térben a legfontosabb fogás az egyismeretlenes egyenlet keresése: nyomaték a csuklón átmenő tengelyre, vetület a többi rúd síkjára merőlegesen.</>,
  },
  {
    cim: "A rúd „térbelisége” elfelejtve",
    feladat: <>Bakállvány: a 2-es rúd talppontja (5; 0; −4), a csúcs (0; 6; 0). Írd fel a rúderő komponenseit!</>,
    lepesek: [
      { szoveg: <>A rúd vetületei: <M>{"l_{2x} = 5,\\ l_{2y} = 6,\\ l_{2z} = 4"}</M>.</> },
      {
        szoveg: <>A rúd hossza az elölnézetből <M>{"l_2 = \\sqrt{5^2 + 6^2} = 7{,}81"}</M> m, így <M>{"S_{2x} = S_2\\cdot 5/7{,}81"}</M>, <M>{"S_{2y} = -S_2\\cdot 6/7{,}81"}</M>.</>,
        hibas: true,
        javitas: (
          <>
            A síkba vetítésnél a tankönyv külön figyelmeztet (9.1.1): a ferde erők komponenseinek számításakor a <em>harmadik</em> irányról sem szabad megfeledkezni. A rúd valódi hossza <M>{"l_2 = \\sqrt{25 + 36 + 16} = 8{,}775"}</M> m, a komponensek{" "}
            <M>{"S_2\\cdot 5/8{,}775"}</M> stb. — a 7,81-gyel számolva minden rúderő hibás lenne.
          </>
        ),
      },
      { szoveg: <>Három vetületi egyenlet a csomópontra.</> },
    ],
    tanulsag: <>A vetületi rajzon a rúd rövidebbnek látszik, mint amilyen. A (9.1) képletben <M>{"l = \\sqrt{l_x^2 + l_y^2 + l_z^2}"}</M> — mindig a térbeli hosszal osztunk.</>,
  },
  {
    cim: "Nyomott rúd húzott előjellel",
    feladat: <>Vizsgaminta 5.: a csúcson 6 kN a +x irányban, a 3-as rúd talppontja (5; 0; −4). Mekkora S₃?</>,
    lepesek: [
      { szoveg: <><M>{"\\underline e_3 = (0{,}5698;\\ -0{,}6838;\\ -0{,}4558)"}</M>; az <M>{"x"}</M> vetületben csak <M>{"S_3"}</M> szerepel.</> },
      {
        szoveg: <><M>{"\\Fx 6 + 0{,}5698\\,S_3 = 0 \\Rightarrow S_3 = 10{,}53"}</M> kN, a rúd húzott.</>,
        hibas: true,
        javitas: (
          <>
            Az egyenletből <M>{"S_3 = -6/0{,}5698 = -10{,}53"}</M> kN: <strong>nyomott</strong>. Szemléletből is: a +x irányú erő a +x felé lévő 3-as rúdnak „dől neki”, az tolja vissza a csúcsot. Az előjel elhagyása a vizsgán a feladat pontjának
            elvesztését jelenti.
          </>
        ),
      },
      { szoveg: <><M>{"\\Fz"}</M> → <M>{"S_1 = -8{,}653"}</M>, <M>{"\\Fy"}</M> → <M>{"S_2 = 14{,}40"}</M> kN.</> },
    ],
    tanulsag: <>Az egyenlet megoldása után mindig nézd meg szemléletből az előjelet: merre tol a teher, melyik rúd „tart ellen” húzva, melyik nyomva.</>,
  },
];
