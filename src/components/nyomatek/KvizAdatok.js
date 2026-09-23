import { M } from "@/components/ui/Keplet";

export const KVIZ = [
  {
    k: <>Egy erőt a saját hatásvonala mentén eltolunk. Mi történik a nyomatékával egy adott pontra?</>,
    v: [<>Nem változik.</>, <>Az eltolás arányában nő.</>, <>Előjelet vált.</>, <>Nullává válik.</>],
    helyes: 0,
    magyarazat: <>A nyomaték az erőkartól függ, az erőkar pedig a pont és a <em>hatásvonal</em> távolsága. A hatásvonalon belüli eltolás ezen nem változtat — ezért lehet az erőt a hatásvonala mentén szabadon tolni.</>,
  },
  {
    k: <>Egy erőpár nyomatéka…</>,
    v: [<>minden pontra ugyanakkora — szabad vektor.</>, <>csak az erők felezőpontjára értelmezhető.</>, <>a vonatkoztatási pont távolságával arányosan nő.</>, <>nulla, mert az erők kiejtik egymást.</>],
    helyes: 0,
    magyarazat: <>Két egyenlő, ellentétes, párhuzamos erő eredője zérus erő, de a nyomatékuk <M>{"F\\cdot d"}</M> minden pontra ugyanaz. Ezért az erőpár „szabad vektor”: bárhová eltolható.</>,
  },
  {
    k: <>Egy erőrendszert az origóra redukáltunk: <M>{"\\underline{R} = 0"}</M>, <M>{"M^{(O)} = -40\\ \\text{kNm}"}</M>. Mi az eredő?</>,
    v: [<>Erőpár (tiszta forgatónyomaték).</>, <>Egyetlen erő az origótól 40 m-re.</>, <>Zérusrendszer, mert R = 0.</>, <>Nem eldönthető a megadott adatokból.</>],
    helyes: 0,
    magyarazat: <>R = 0 és M ≠ 0: az eredő erőpár. Zérusrendszer csak akkor, ha az erő <em>és</em> a nyomaték is nulla. Ez a GYF‑4 a) és b) esete.</>,
  },
  {
    k: <>Egy erőrendszert az A pontra redukáltunk. Ha egy másik, B pontra redukáljuk, mi változik?</>,
    v: [<>Csak a nyomaték; az eredő erő ugyanaz marad.</>, <>Csak az erő; a nyomaték ugyanaz marad.</>, <>Mindkettő.</>, <>Egyik sem.</>],
    helyes: 0,
    magyarazat: <>Az erők összege nem függ a ponttól. A nyomatékhoz viszont hozzájön az A-ban ülő R nyomatéka B-re: <M>{"M^{(B)} = M^{(A)} + \\ldots"}</M>. Ezért van, hogy egy megfelelő pontra redukálva a nyomaték el is tűnhet.</>,
  },
  {
    k: <>Melyik előjelszabály helyes a síkbeli nyomatékra egy ponton átmenő F = (Fx; Fy) erőnél, amely az (x; y) pontban támad?</>,
    v: [<><M>{"M = x F_y - y F_x"}</M></>, <><M>{"M = x F_x + y F_y"}</M></>, <><M>{"M = y F_x - x F_y"}</M></>, <><M>{"M = x F_x - y F_y"}</M></>],
    helyes: 0,
    magyarazat: <>A nyomaték a komponensek nyomatékainak összege (ezt hívják Varignon-tételnek, a tankönyv nem nevezi néven): a függőleges komponens karja x, a vízszintesé y, és a vízszintes tag negatív előjellel jön (pozitív Fx pozitív y-nál az óramutató irányába forgat). A második képlet a skaláris szorzat — az nem nyomaték.</>,
  },
  {
    k: <>Egy erőrendszer eredője egyetlen erő, <M>{"R_y = 10\\ \\text{kN}"}</M>, az origóra vett nyomaték <M>{"M^{(O)} = -210\\ \\text{kNm}"}</M>. Hol metszi a hatásvonal az x tengelyt?</>,
    v: [<><M>{"x_0 = -21\\ \\text{m}"}</M>, az origótól balra.</>, <><M>{"x_0 = 21\\ \\text{m}"}</M>, az origótól jobbra.</>, <><M>{"x_0 = 2{,}1\\ \\text{m}"}</M>.</>, <>Nem metszi, mert a nyomaték negatív.</>],
    helyes: 0,
    magyarazat: <><M>{"x_0 R_y = M \\Rightarrow x_0 = -210/10 = -21"}</M> m. A negatív előjel információ: balra van. Ha csak „21 m”-t írsz, a válasz fele hiányzik.</>,
  },
  {
    k: <>Térben egy erő a z tengellyel párhuzamos. Melyik tengely körül <em>nem</em> forgat biztosan?</>,
    v: [<>A z tengely körül.</>, <>Az x tengely körül.</>, <>Az y tengely körül.</>, <>Egyik körül sem forgat.</>],
    helyes: 0,
    magyarazat: <>Egy tengellyel párhuzamos erőnek arra a tengelyre nincs nyomatéka (a GYF‑1 tanulsága). Az x és y tengely körül viszont forgathat, ha nem metszi őket.</>,
  },
  {
    k: <>Mi a jobbkéz-szabály szerepe az <M>{"\\underline{M} = \\underline{r}\\times\\underline{F}"}</M> képletben?</>,
    v: [<>Megadja a nyomatékvektor irányát: r-től F felé forgatva a hüvelykujj mutatja M-et.</>, <>Megadja a nyomaték nagyságát.</>, <>Eldönti, hogy az erő pozitív vagy negatív.</>, <>Csak síkbeli feladatoknál használjuk.</>],
    helyes: 0,
    magyarazat: <>A vektoriális szorzat iránya merőleges r és F síkjára, és a jobbkéz-szabály mondja meg, a két lehetséges merőleges közül melyik. A nagyságot <M>{"|r||F|\\sin\\varphi"}</M> adja.</>,
  },
  {
    k: <>Térbeli erőrendszert redukáltunk egy pontra: a társerő <M>{"\\underline{R}_A \\neq 0"}</M>, és <M>{"\\underline{R}_A\\cdot\\underline{M}_A \\neq 0"}</M>. Mi az eredő?</>,
    v: [<>Erőcsavar: egy erő és egy vele párhuzamos tengely körül forgató nyomaték.</>, <>Egyetlen erő, mert R ≠ 0.</>, <>Tiszta nyomaték.</>, <>Egyensúly, ha a szorzat pozitív.</>],
    helyes: 0,
    magyarazat: <>Ha a társnyomatéknak van az erővel párhuzamos vetülete (a skaláris szorzat nem nulla), azt a részt nem lehet az erő eltolásával „elnyeletni” — megmarad az erő tengelye körüli forgatás. Ez az erőcsavar, mint a facsavar behajtásakor. Egyetlen erő csak akkor az eredő, ha <M>{"\\underline{R}\\cdot\\underline{M} = 0"}</M>.</>,
  },
  {
    k: <>Két párhuzamos, <em>ellentétes</em> irányú, különböző nagyságú erő eredője hol van?</>,
    v: [<>A két hatásvonalon kívül, a nagyobb erő oldalán.</>, <>A két hatásvonal között, a nagyobbhoz közelebb.</>, <>A két hatásvonal között, pontosan középen.</>, <>Nincs eredő ereje, csak nyomatéka.</>],
    helyes: 0,
    magyarazat: <>Azonos irányú erőknél az eredő közéjük esik (a nagyobbhoz közelebb); ellentétes irányúaknál kívülre, a nagyobb oldalára — a nyomatéki egyenletből így jön ki. Csak akkor nincs eredő erő, ha a két erő egyenlő nagyságú: az az erőpár.</>,
  },
  {
    k: <>Mikor nulla egy erő nyomatéka egy <M>{"t"}</M> tengelyre?</>,
    v: [<>Ha a hatásvonala metszi a tengelyt, vagy párhuzamos vele.</>, <>Csak akkor, ha az erő átmegy az origón.</>, <>Ha az erő merőleges a tengelyre.</>, <>Soha, ha az erő nem nulla.</>],
    helyes: 0,
    magyarazat: <>Metsző hatásvonalnál a kar nulla; párhuzamosnál az erő „a tengely irányában tol”, nem forgat körülötte. Egy erő tehát csak a hozzá képest <em>kitérő</em> tengelyek körül forgat. A merőlegesség önmagában nem elég — egy merőleges, de kitérő erő pont hogy forgat.</>,
  },
  {
    k: <>Egy erőrendszert az A pontra redukáltunk: társerő <M>{"\\underline{F}_A"}</M>, társnyomaték <M>{"M_A"}</M>. Ha a B pontra redukáljuk, melyik változik?</>,
    v: [<>Csak a társnyomaték; a társerő ugyanaz marad.</>, <>Csak a társerő; a társnyomaték ugyanaz.</>, <>Mindkettő megváltozik.</>, <>Egyik sem, a redukálás pontfüggetlen.</>],
    helyes: 0,
    magyarazat: <>A társerő az erők összege, ez nem függ a ponttól. A társnyomaték viszont az adott ponton átmenő társerőhöz tartozik: B-re redukálva hozzáadódik az A-ban ülő <M>{"\\underline{F}_A"}</M> nyomatéka B-re. Kivétel: ha <M>{"\\underline{F}_A = 0"}</M>, akkor a nyomaték is pontfüggetlen (tiszta nyomaték).</>,
  },
];

export const HIBAK = [
  {
    cim: "Előjel a nyomatéknál",
    feladat: <>Egy F = 12 kN, +x irányú erő az y = 3 m magasságban hat (x tetszőleges). Mekkora a nyomatéka az origóra?</>,
    lepesek: [
      { szoveg: <>Az erő vízszintes, ezért csak a hatásvonal magassága számít: az erőkar 3 m.</> },
      { szoveg: <><M>{"M^{(O)} = y F_x = 3\\cdot 12 = +36\\ \\text{kNm}"}</M></>, hibas: true, javitas: <>A képlet <M>{"M = x F_y - y F_x"}</M>: a vízszintes tag <em>negatív</em> előjelű. <M>{"M = -3\\cdot 12 = -36"}</M> kNm — és ez stimmel a szemlélettel is: az origó felett jobbra mutató erő az óramutató irányába forgat.</> },
      { szoveg: <>Az eredmény független x-től, mert az erő a saját hatásvonalán bárhol lehet.</> },
    ],
    tanulsag: <>Két ellenőrzés: a képlet előjele, és a „merre forgat” szemlélet. Ha a kettő nem egyezik, az egyik biztosan rossz.</>,
  },
  {
    cim: "Redukálás: az erő nem változik",
    feladat: <>Egy rendszer eredője az origóra redukálva R = (4; 3) kN, M = 12 kNm. Redukáld a B(2; 0) pontra!</>,
    lepesek: [
      { szoveg: <><M>{"M^{(B)} = M^{(O)} + (x_O - x_B)R_y - (y_O - y_B)R_x = 12 + (0 - 2)\\cdot 3 - 0 = 6\\ \\text{kNm}"}</M></> },
      { szoveg: <>Az erő B-ben: <M>{"R_B = R\\cdot\\frac{|OB|}{1} = (8;\\ 6)\\ \\text{kN}"}</M>, mert 2 m-rel távolabb van.</>, hibas: true, javitas: <>Az eredő erő <em>nem függ</em> attól, melyik pontra redukálunk: B-ben is R = (4; 3) kN. Csak a nyomaték változik. A „távolsággal arányos” gondolat a nyomatékra igaz, az erőre nem.</> },
      { szoveg: <>Az eredő egyetlen erő, mert R ≠ 0.</> },
    ],
    tanulsag: <>A redukálás pontja csak a társnyomatékot változtatja; a társerő (az erők összege) minden pontra ugyanaz.</>,
  },
  {
    cim: "Erőpár vagy zérusrendszer?",
    feladat: <>Három erő összege pontosan nulla: ΣFx = 0, ΣFy = 0. A hatásvonalaik egy háromszög három oldala. Mi az eredő?</>,
    lepesek: [
      { szoveg: <>ΣF = 0, tehát az erők kiegyenlítik egymást.</> },
      { szoveg: <>Mivel az erők kiegyenlítik egymást, a rendszer zérusrendszer — egyensúlyban van.</>, hibas: true, javitas: <>Az egyensúlyhoz ΣM = 0 is kell. Ha a hatásvonalak nem egy ponton mennek át (itt: egy háromszög oldalai), a nyomatékuk nem nulla, az eredő <em>erőpár</em>. Ez épp a GYF‑4 a) és b) tanulsága.</> },
      { szoveg: <>A háromszög területe a számoláshoz nem kell.</> },
    ],
    tanulsag: <>„Nem mozdul el” ≠ „egyensúlyban van”: a forgás is mozgás. Mindig három egyenlet: ΣFx, ΣFy, ΣM.</>,
  },
  {
    cim: "Dinámrendszer: a nyomaték nem erő",
    feladat: <>Egy vízszintes egyenesen F₁ = 4 kN felfelé (x = 1 m), F₂ = 6 kN lefelé (x = 5 m) és egy M = 10 kNm, óramutatóval ellentétes nyomaték hat. Mi az eredő, és hol van?</>,
    lepesek: [
      { szoveg: <><M>{"(\\underline{F}_1, \\underline{F}_2, M) \\ekv \\mathcal{D}"}</M> — először a típus: vetületi egyenlet.</> },
      { szoveg: <><M>{"\\Fy +4 - 6 + 10 = 8\\ \\text{kN}"}</M>, tehát az eredő egy 8 kN-os, felfelé mutató erő.</>, hibas: true, javitas: <>A koncentrált nyomaték <em>nem</em> erő: a vetületi egyenletbe nem kerül bele (erőpárrá alakítva két egyenlő, ellentétes erő lenne, amelyek kiejtik egymást). Helyesen: <M>{"\\Fy +4 - 6 = -2\\ \\text{kN}"}</M>, az eredő 2 kN lefelé. A nyomaték csak a nyomatéki egyenletben jelenik meg: <M>{"\\Mp{O} 1\\cdot 4 + 5\\cdot(-6) + 10 = x_R\\cdot(-2)"}</M>, azaz <M>{"-16 = -2x_R"}</M>, <M>{"x_R = 8\\ \\text{m}"}</M>.</> },
      { szoveg: <>Az eredő helye a nyomatéki egyenletből jön, a nyomaték előjelesen kerül bele.</> },
    ],
    tanulsag: <>Dinámrendszerben az erők a vetületi <em>és</em> a nyomatéki egyenletben szerepelnek, a nyomatékok csak a nyomatékiban. A mértékegység is elárulja: kNm-t nem lehet kN-hoz adni.</>,
  },
];
