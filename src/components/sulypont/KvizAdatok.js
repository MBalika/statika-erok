import { M } from "@/components/ui/Keplet";

export const KVIZ = [
  {
    k: <>Melyik távolság tartozik az <M>{"S_y"}</M> statikai nyomatékhoz?</>,
    v: [<>A z koordináta — az y tengelytől mért távolság.</>, <>Az y koordináta.</>, <>Az origótól mért távolság.</>, <>A súlyponttól mért távolság.</>],
    helyes: 0,
    magyarazat: <>Az index azt a tengelyt mondja, <em>amelyre</em> a nyomatékot számoljuk; a távolságot attól mérjük. Az y tengelytől mért távolság a z koordináta: <M>{"S_y = \\sum A_i z_i"}</M>, <M>{"z_S = S_y/A"}</M>.</>,
  },
  {
    k: <>Egy L-szelvény súlypontja hol lehet?</>,
    v: [<>Az anyagon kívül is — a levegőben, a két szár között.</>, <>Csak az anyagon belül.</>, <>Mindig a szárak találkozásánál.</>, <>A hosszabb szár közepén.</>],
    helyes: 0,
    magyarazat: <>A súlypont geometriai pont; L-, U-szelvénynél és körgyűrűnél az anyagon kívül van. Attól még ez a súlypont — a szimmetriatengelyekre viszont mindig rajta van.</>,
  },
  {
    k: <>Egy összetett idomot kétféleképpen bontunk részekre. Mi a helyzet a súlyponttal?</>,
    v: [<>Ugyanaz, bármelyik felbontásból.</>, <>A kevesebb részre bontás pontosabb.</>, <>Csak az egyik felbontás helyes.</>, <>Az átlaguk a helyes.</>],
    helyes: 0,
    magyarazat: <>A statikai nyomaték additív: bármilyen felbontásban ugyanaz az összeg jön ki. A GYF‑4 két és három téglalappal is 71,25 mm-t ad.</>,
  },
  {
    k: <>Kivonásos módszernél a lyuk…</>,
    v: [<>területe és statikai nyomatéka is negatív előjellel kerül az összegbe.</>, <>területe negatív, de a statikai nyomatéka pozitív.</>, <>csak a területet csökkenti, a súlypontot nem befolyásolja.</>, <>csak akkor számít, ha a közepén van.</>],
    helyes: 0,
    magyarazat: <>Mindkettő negatív: <M>{"A = A_1 - A_2"}</M>, <M>{"S = A_1 z_1 - A_2 z_2"}</M>. A súlypont a lyuktól elfelé tolódik — a filmen ez jól látszik.</>,
  },
  {
    k: <>Hol van a derékszögű háromszög súlypontja?</>,
    v: [<>A derékszögű csúcstól mindkét befogó mentén a harmadára.</>, <>A derékszögű csúcstól mindkét befogó mentén a felére.</>, <>Az átfogó felezőpontjában.</>, <>A derékszögű csúcsban.</>],
    helyes: 0,
    magyarazat: <>Általánosan: minden oldaltól a hozzá tartozó magasság harmadára; derékszögű háromszögnél ez a befogók harmadolása a derékszögű csúcstól. Az átfogó felezőpontja a köré írt kör középpontja — az más.</>,
  },
  {
    k: <>Mekkora távolságra van a félkör súlypontja az átmérőjétől?</>,
    v: [<><M>{"4r/3\\pi \\approx 0{,}42\\,r"}</M></>, <><M>{"r/2"}</M></>, <><M>{"r/3"}</M></>, <><M>{"2r/\\pi \\approx 0{,}64\\,r"}</M></>],
    helyes: 0,
    magyarazat: <>Ez az egyetlen „megjegyzendő” szám a modulban: <M>{"4r/3\\pi"}</M>, félkörnél és negyedkörnél is (utóbbinál mindkét egyenes éltől).</>,
  },
  {
    k: <>Egy idomnak két szimmetriatengelye van. Hol a súlypontja?</>,
    v: [<>A két tengely metszéspontjában, számolás nélkül.</>, <>Valahol az egyik tengelyen, számolni kell.</>, <>Nem mondható meg szimmetriából.</>, <>A befoglaló téglalap sarkában.</>],
    helyes: 0,
    magyarazat: <>A súlypont minden szimmetriatengelyen rajta van; két tengely metszéspontja egyértelmű. Téglalap, kör, I-szelvény: nincs mit számolni.</>,
  },
  {
    k: <>Miért lesz fontos a súlypont a szilárdságtanban?</>,
    v: [<>Mert a súlyponti tengelyre a statikai nyomaték nulla — hajlításnál ez a semleges tengely.</>, <>Mert ott a legnagyobb a feszültség.</>, <>Mert csak ott lehet terhelni a keresztmetszetet.</>, <>Mert a súlypontban a terület nulla.</>],
    helyes: 0,
    magyarazat: <>A súlyponti tengelyre <M>{"S = 0"}</M>; hajlításnál a keresztmetszet e körül „forog”, ez a semleges tengely. A másodrendű nyomatékot is a súlyponti tengelyekre számoljuk.</>,
  },
];

export const HIBAK = [
  {
    cim: "A gerinc súlypontja — honnan mérve?",
    feladat: <>T-szelvény: fejlemez 200×20 mm, gerinc 10×180 mm. Milyen mélyen van a súlypont a felső éltől?</>,
    lepesek: [
      { szoveg: <><M>{"A_1 = 200\\cdot 20 = 4\\,000,\\quad z_1 = 10\\ \\text{mm}"}</M></> },
      { szoveg: <><M>{"A_2 = 10\\cdot 180 = 1\\,800,\\quad z_2 = 180/2 = 90\\ \\text{mm}"}</M></>, hibas: true, javitas: <>A gerinc a fejlemez <em>alatt</em> kezdődik, ezért a közepe a felső éltől <M>{"20 + 90 = 110"}</M> mm-re van. Ezzel <M>{"S_y = 4000\\cdot 10 + 1800\\cdot 110 = 238\\,000"}</M>, <M>{"z_S = 238\\,000/5\\,800 = 41{,}0"}</M> mm (a hibás 90-nel 34,8 jönne ki).</> },
      { szoveg: <><M>{"A = 5\\,800\\ \\text{mm}^2"}</M></> },
      { szoveg: <><M>{"z_S = S_y / A"}</M></> },
    ],
    tanulsag: <>Minden rész súlypontját a <em>közös origótól</em> mérd, ne a rész saját szélétől. Rajzold be a pontokat, írd melléjük a koordinátákat.</>,
  },
  {
    cim: "Index-csere",
    feladat: <>Egy idom részei: A₁ = 6 000 mm² az (y; z) = (100; 30) pontban, A₂ = 4 000 mm² a (40; 120) pontban. Számítsd ki z_S-t!</>,
    lepesek: [
      { szoveg: <><M>{"A = 6\\,000 + 4\\,000 = 10\\,000\\ \\text{mm}^2"}</M></> },
      { szoveg: <><M>{"S_y = 6\\,000\\cdot 100 + 4\\,000\\cdot 40 = 760\\,000\\ \\text{mm}^3"}</M></>, hibas: true, javitas: <>Az <M>{"S_y"}</M>-hoz a <em>z</em> koordináták kellenek: <M>{"S_y = 6\\,000\\cdot 30 + 4\\,000\\cdot 120 = 660\\,000"}</M>, és így <M>{"z_S = 66"}</M> mm. Az y-okkal az <M>{"S_z"}</M>-t számoltad, ami <M>{"y_S = 76"}</M> mm-t ad.</> },
      { szoveg: <><M>{"z_S = S_y / A"}</M></> },
    ],
    tanulsag: <>Sy ↔ z, Sz ↔ y. Írd fel a táblázatot <em>fejléccel</em> (Aᵢ, yᵢ, zᵢ, Aᵢyᵢ, Aᵢzᵢ), és nem cserélődik fel.</>,
  },
  {
    cim: "A negyedkör előjele",
    feladat: <>Egy 40×40 mm-es négyzet jobb felső sarkából r = 20 mm sugarú negyedkört vágunk ki (a kör középpontja a sarok, ami az origó). Add meg y_S-t!</>,
    lepesek: [
      { szoveg: <><M>{"A_1 = 1\\,600,\\ y_1 = 20;\\qquad A_2 = 20^2\\pi/4 = 314{,}2,\\ y_2 = 4r/3\\pi = 8{,}49"}</M></> },
      { szoveg: <><M>{"A = 1\\,600 - 314{,}2 = 1\\,285{,}8\\ \\text{mm}^2"}</M></> },
      { szoveg: <><M>{"y_S = \\frac{1\\,600\\cdot 20 + 314{,}2\\cdot 8{,}49}{1\\,285{,}8} = 26{,}96\\ \\text{mm}"}</M></>, hibas: true, javitas: <>A kivont rész statikai nyomatéka is negatív: <M>{"y_S = \\frac{1\\,600\\cdot 20 - 314{,}2\\cdot 8{,}49}{1\\,285{,}8} = 22{,}81"}</M> mm. A területnél már levontuk — a nyomatéknál is le kell. (Józan ész: a sarok hiányzik az origónál, a súlypont onnan <em>elfelé</em>, balra tolódik: 20-nál nagyobb, de 27 túl sok.)</> },
    ],
    tanulsag: <>Az előjel a területnél és a statikai nyomatéknál <em>ugyanaz</em>. Ha a területet kivontad, a nyomatékot is vond ki.</>,
  },
];
