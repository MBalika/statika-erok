import { M } from "@/components/ui/Keplet";

export const KVIZ = [
  {
    k: <>Mi az egyenletesen megoszló teher eredőjének nagysága egy L hosszú szakaszon, p intenzitással?</>,
    v: [<><M>{"R = p\\,L"}</M> — a teherábra területe.</>, <><M>{"R = p / L"}</M></>, <><M>{"R = p\\,L / 2"}</M></>, <><M>{"R = p\\,L^2 / 2"}</M></>],
    helyes: 0,
    magyarazat: <>Az eredő mindig a teherábra területe: téglalapnál <M>{"p\\cdot L"}</M>. A <M>{"pL/2"}</M> a háromszögé, a <M>{"pL^2/2"}</M> pedig egy nyomaték (kNm), nem erő.</>,
  },
  {
    k: <>Egy háromszög alakú teher a bal végén nulla, a jobb végén p. Hol az eredő a bal végtől mérve?</>,
    v: [<><M>{"2L/3"}</M>-nál — a magas oldalhoz közel.</>, <><M>{"L/3"}</M>-nál.</>, <><M>{"L/2"}</M>-nél.</>, <>A jobb végen.</>],
    helyes: 0,
    magyarazat: <>A háromszög súlypontja a <em>magas</em> oldaltól L/3-ra van. Itt a magas oldal jobbra van, tehát a bal végtől 2L/3. Ez a modul leggyakoribb hibája.</>,
  },
  {
    k: <>Mi a megoszló teher intenzitásának mértékegysége, és mi az eredőé?</>,
    v: [<>kN/m, illetve kN.</>, <>kN, illetve kN/m.</>, <>kN/m², illetve kN/m.</>, <>kNm, illetve kN.</>],
    helyes: 0,
    magyarazat: <>Az intenzitás egységnyi hosszra jutó erő (kN/m); méterrel szorozva erő lesz belőle (kN). A kN/m² a felületen megoszló teher (pl. hó), amit még a tartó tehermezőjének szélességével kell szorozni.</>,
  },
  {
    k: <>Egy trapéz alakú teher felbontható téglalap + háromszögre, vagy két háromszögre. Mit mondhatunk a két úton kapott eredőről?</>,
    v: [<>Ugyanaz a nagysága és a helye is.</>, <>A nagysága ugyanaz, a helye más.</>, <>A helye ugyanaz, a nagysága más.</>, <>Mindkettő más, csak a nyomatékuk egyezik.</>],
    helyes: 0,
    magyarazat: <>Az eredő az egész teherábra területe és súlypontja — nem függ attól, hogyan daraboljuk fel. A GYF‑1 pontosan ezt mutatja: két felbontás, egy eredmény.</>,
  },
  {
    k: <>Egy tartón három szakasz: +8 kN, −8 kN és +8 kN eredőjű. Mekkora a teljes eredő?</>,
    v: [<>+8 kN</>, <>+24 kN</>, <>0 kN</>, <>−8 kN</>],
    helyes: 0,
    magyarazat: <>Előjeles összeg: 8 − 8 + 8 = 8 kN. A 24 az abszolút értékek összege volna, ami nem veszi figyelembe, hogy a középső felfelé hat.</>,
  },
  {
    k: <>A hóteher intenzitását „kN/m² alaprajzi vetületre” adják meg. Egy ferde tetőszaru terhének eredőjét mivel kell szorozni?</>,
    v: [<>A szaru <em>vízszintes vetületének</em> hosszával.</>, <>A szaru ferde hosszával.</>, <>A szaru magasságával.</>, <>A tető hajlásszögének tangensével.</>],
    helyes: 0,
    magyarazat: <>Ha a p a vetületre vonatkozik, akkor a vetület hosszával szorzunk: <M>{"R = p\\,L\\cos\\alpha"}</M>. A ferde hosszal szorozva túlbecsülnénk a terhet.</>,
  },
  {
    k: <>Mire <em>nem</em> használható a megoszló teher eredője?</>,
    v: [<>A tartó belső erőinek (igénybevételeinek) számítására egy keresztmetszetben.</>, <>A támaszreakciók számítására.</>, <>A tartó egészének egyensúlyvizsgálatára.</>, <>Felborulás vizsgálatára.</>],
    helyes: 0,
    magyarazat: <>Az eredő az egész teherre nézve egyenértékű, a tartó egy darabjára nézve nem. Belső erőknél már nem mindegy, hogy a teher egy pontban vagy hosszan oszlik el.</>,
  },
  {
    k: <>Egy függőleges gátfalon a víznyomás teherábrája…</>,
    v: [<>háromszög, a fenéknél a legnagyobb, eredője a fenéktől h/3-ra.</>, <>téglalap, eredője a fal közepén.</>, <>háromszög, a felszínnél a legnagyobb.</>, <>parabola.</>],
    helyes: 0,
    magyarazat: <>A nyomás a mélységgel lineárisan nő (γ·z), ezért a teherábra háromszög, aminek a magas oldala a fenéknél van; a súlypontja onnan h/3-ra.</>,
  },
  {
    k: <>Egy lemezen felület mentén megoszló q [kN/m²] teher működik. Mi az eredője, és hol hat?</>,
    v: [
      <>A terhelési test térfogata (q × terhelt terület), a terhelési test súlypontján át.</>,
      <>q szorozva a lemez hosszával, a lemez közepén.</>,
      <>q szorozva a lemez kerületével, a súlypontban.</>,
      <>Nem lehet egyetlen erővel helyettesíteni.</>,
    ],
    helyes: 0,
    magyarazat: <>A felületre merőlegesen q-val arányosan felmért (fiktív) test a <em>terhelési test</em>; az eredő ennek a térfogata (egyenletes q-nál q·A), és a súlypontján megy át. Síkbeli feladatban a b szélességű tehermezőt „összegyűjtve” ebből lesz a p = q·b vonal menti teher.</>,
  },
  {
    k: <>Ferde rúdra a felületre merőleges, p intenzitású teher hat. Hogyan helyettesíthető két vetületi teherrel?</>,
    v: [
      <>Függőleges p a vízszintes vetületen és vízszintes p a függőleges vetületen — <em>azonos</em> p intenzitással.</>,
      <>Függőleges p·cos α és vízszintes p·sin α a ferde hossz mentén.</>,
      <>Csak függőleges teherrel, p·cos α intenzitással a ferde hosszon.</>,
      <>Sehogy — a merőleges terhet integrálni kell.</>,
    ],
    helyes: 0,
    magyarazat: <>A tankönyv 3.21. ábrája: a két vetületi teher intenzitása ugyanaz a p, csak a hosszuk más (L cos α és L sin α). Így R_y = pL cos α és R_x = pL sin α — pontosan a merőleges R = pL komponensei.</>,
  },
  {
    k: <>Egy R sugarú félkörívre mindenütt az ívre merőleges p teher hat. Mekkora és milyen irányú az eredő?</>,
    v: [<>2Rp, függőleges, a kör középpontján át.</>, <>πRp, függőleges, a kör középpontján át.</>, <>2Rp, az ív közepére merőlegesen, de nem O-n át.</>, <>Nulla — a merőleges terhek kioltják egymást.</>],
    helyes: 0,
    magyarazat: <>Negyedkörönként vetületi terhekkel: a két vízszintes Rp kiejti egymást (közös hatásvonal, ellentétes irány), a két függőleges Rp összeadódik: 2Rp. A πRp az ívhossz × p volna — az elemi erők nem párhuzamosak, ezért nem adhatók össze skalárisan.</>,
  },
  {
    k: <>Egy ferde vagy görbe gátfalra ható víznyomásról melyik állítás igaz?</>,
    v: [
      <>Mindenütt merőleges a falra; a függőleges komponense a fal vonala és a vízszint közötti síkidom területe × γ.</>,
      <>Mindig vízszintes, ezért csak a ½γh² háromszöggel kell számolni.</>,
      <>Mindig függőleges, mert a víz súlya lefelé hat.</>,
      <>Merőleges a falra, és a függőleges komponense mindig nulla.</>,
    ],
    helyes: 0,
    magyarazat: <>A víznyomás felületre merőleges, intenzitása γ·z. Vízszintes komponens: háromszög a függőleges vetületen (½γh², h/3-ra a fenéktől). Függőleges komponens: a fal fölötti „vízoszlop” súlya — a fal vonala és a vízszint közötti síkidom területe × γ, a síkidom súlypontján át. Függőleges falnál ez utóbbi valóban nulla, ferdénél nem.</>,
  },
];

export const HIBAK = [
  {
    cim: "Háromszög — melyik végtől?",
    feladat: <>Egy 6 m-es szakaszon a teher a bal végén 9 kN/m, a jobb végén nulla. Add meg az eredőt és a helyét a bal végtől!</>,
    lepesek: [
      { szoveg: <><M>{"R = \\tfrac12\\cdot 9\\cdot 6 = 27\\ \\text{kN}"}</M></> },
      { szoveg: <>A háromszög súlypontja a hossz harmadánál van: <M>{"k = 6/3 = 2\\ \\text{m}"}</M> — a jobb végtől mérve.</>, hibas: true, javitas: <>Az L/3 a <em>magas</em> oldaltól mérendő, a magas oldal pedig itt a bal. Tehát a bal végtől k = 2 m (a jobb végtől 4 m). A számérték stimmelt, a vég nem.</> },
      { szoveg: <>Az eredő lefelé mutat, mert a teher lefelé hat.</> },
    ],
    tanulsag: <>Rajzold le, és nézd meg, melyik oldalon „nehéz” a háromszög — az eredő oda húz.</>,
  },
  {
    cim: "Trapéz felbontása",
    feladat: <>Trapéz teher 4 m-en: bal végen 2 kN/m, jobb végen 5 kN/m. Bontsd fel téglalapra és háromszögre!</>,
    lepesek: [
      { szoveg: <>Téglalap: 2 kN/m intenzitással, <M>{"R_1 = 2\\cdot 4 = 8\\ \\text{kN}"}</M>, <M>{"x_1 = 2\\ \\text{m}"}</M>.</> },
      { szoveg: <>Háromszög: 0-tól 5 kN/m-ig, <M>{"R_2 = \\tfrac12\\cdot 5\\cdot 4 = 10\\ \\text{kN}"}</M>, <M>{"x_2 = 2{,}667\\ \\text{m}"}</M>.</>, hibas: true, javitas: <>A háromszög magassága nem 5, hanem a különbség, <M>{"5 - 2 = 3"}</M> kN/m — a téglalap már „elvitte” a 2 kN/m-t. Helyesen <M>{"R_2 = \\tfrac12\\cdot 3\\cdot 4 = 6"}</M> kN, x₂ = 2,667 m. Így R = 14 kN, ami egyezik a <M>{"\\tfrac{2+5}{2}\\cdot 4 = 14"}</M> közvetlen képlettel.</> },
      { szoveg: <><M>{"R = R_1 + R_2"}</M>, <M>{"k = (R_1 x_1 + R_2 x_2)/R"}</M>.</> },
    ],
    tanulsag: <>Ellenőrzés a közvetlen képlettel: <M>{"R = \\tfrac{p_1 + p_2}{2} L"}</M>. Ha a felbontás mást ad, dupla számolás van benne.</>,
  },
  {
    cim: "Előjeles szakaszok",
    feladat: <>Két 2 m-es szakasz: az elsőn 5 kN/m lefelé, a másodikon 5 kN/m felfelé. Mi az eredő?</>,
    lepesek: [
      { szoveg: <><M>{"R_1 = 10\\ \\text{kN}"}</M> lefelé, 1 m-nél; <M>{"R_2 = 10\\ \\text{kN}"}</M> felfelé, 3 m-nél.</> },
      { szoveg: <><M>{"R = 10 - 10 = 0"}</M>, tehát a terhelésnek nincs hatása a tartóra.</>, hibas: true, javitas: <>R = 0, de a két erő nem egy hatásvonalon van: az eredő <em>erőpár</em>, <M>{"M = 10\\cdot 2 = 20\\ \\text{kNm}"}</M> (az óramutató járásával ellentétesen forgat, ha a bal oldali lefelé, a jobb oldali felfelé hat). Ez nagyon is hat a tartóra — forgat.</> },
      { szoveg: <>A két rész eredője egyforma nagyságú, mert a szakaszok és az intenzitások egyformák.</> },
    ],
    tanulsag: <>„Nulla eredő erő” nem jelenti, hogy „nincs teher”. Mindig nézd meg a nyomatékot is — ahogy a 2. modulban.</>,
  },
  {
    cim: "kN/m² × hossz?",
    feladat: <>Egy födémre q = 4 kN/m² teher jut. A födémet egymástól 2,5 m-re fekvő, 6 m hosszú gerendák tartják. Mekkora egy gerenda terhének eredője?</>,
    lepesek: [
      { szoveg: <>A gerenda 6 m hosszú, tehát az eredő <M>{"R = 4\\cdot 6 = 24\\ \\text{kN}"}</M>.</>, hibas: true, javitas: <>kN/m²-t hosszal szorozva kN/m-t kapunk, nem kN-t — kimaradt a <em>tehermező szélessége</em>. Előbb a vonal menti teher: <M>{"p = q\\,b = 4\\cdot 2{,}5 = 10\\ \\text{kN/m}"}</M>, aztán <M>{"R = p\\,L = 10\\cdot 6 = 60\\ \\text{kN}"}</M>. Ellenőrzés a terhelési testtel: 4 · (2,5 · 6) = 60 kN.</> },
      { szoveg: <>Az eredő a gerenda közepén, 3 m-nél hat.</> },
      { szoveg: <>A teher lefelé mutat, tehát R pozitív.</> },
    ],
    tanulsag: <>Nézd a mértékegységet: kN/m² · m = kN/m, ez még intenzitás. Erő csak területtel szorozva lesz belőle.</>,
  },
];
