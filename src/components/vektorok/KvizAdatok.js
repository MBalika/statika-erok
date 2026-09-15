import { M, MB } from "@/components/ui/Keplet";

export const KVIZ = [
  {
    k: <>Egy erő irányszöge az x tengelytől mérve 150°. Melyik állítás igaz a komponenseire?</>,
    v: [<>Fx &lt; 0 és Fy &gt; 0 — a II. síknegyedben van.</>, <>Fx &gt; 0 és Fy &gt; 0.</>, <>Fx &lt; 0 és Fy &lt; 0 — a III. síknegyedben van.</>, <>Fx &gt; 0 és Fy &lt; 0.</>],
    helyes: 0,
    magyarazat: <>90° és 180° között a koszinusz negatív, a szinusz pozitív: <M>{"F_x = F\\cos 150^\\circ < 0"}</M>, <M>{"F_y = F\\sin 150^\\circ > 0"}</M>. A síknegyedet mindig a szögből döntsd el, ne a képletből találgass.</>,
  },
  {
    k: <>Egy erő szögét a <em>függőlegestől</em> (az y tengelytől) adták meg, 25°-nak. Melyik adja a vízszintes komponens nagyságát?</>,
    v: [<><M>{"F\\sin 25^\\circ"}</M></>, <><M>{"F\\cos 25^\\circ"}</M></>, <><M>{"F\\operatorname{tg} 25^\\circ"}</M></>, <><M>{"F/\\cos 25^\\circ"}</M></>],
    helyes: 0,
    magyarazat: <>Ha a szög az y tengelytől indul, a szerepek felcserélődnek: a függőlegeshez tartozik a koszinusz, a vízszinteshez a szinusz. Mindig azt nézd, <em>melyik tengelytől</em> mérték a szöget.</>,
  },
  {
    k: <>Két erő összegének nagysága mikor egyezik meg a nagyságaik összegével?</>,
    v: [<>Csak ha azonos irányúak.</>, <>Mindig.</>, <>Ha merőlegesek egymásra.</>, <>Ha ellentétes irányúak.</>],
    helyes: 0,
    magyarazat: <>A vektorok összeadása nem a nagyságok összeadása. Csak azonos irány esetén adódnak össze „egy vonalban”; merőlegeseknél Pitagorasz, ellentéteseknél kivonás.</>,
  },
  {
    k: <>Három erő összege zérusvektor. Mit tudunk biztosan a láncszabállyal rajzolt vektorsokszögről?</>,
    v: [<>Bezárul: a harmadik vektor hegye az első vektor kezdőpontjába ér.</>, <>Szabályos háromszög.</>, <>Az egyik vektor merőleges a másik kettőre.</>, <>Nem rajzolható meg.</>],
    helyes: 0,
    magyarazat: <>ΣF = 0 pontosan azt jelenti, hogy tip-to-tail fűzve visszaérünk a kiindulópontba. Ez az egyensúly geometriai képe — semmi mást nem mond az alakról.</>,
  },
  {
    k: <>Egy erőt egy ferde t tengelyre vetítünk. Mikor negatív a vetület?</>,
    v: [<>Ha az erő és a t tengely által bezárt szög nagyobb 90°-nál.</>, <>Ha az erő a III. vagy IV. síknegyedben van.</>, <>Ha a t tengely szöge nagyobb 90°-nál.</>, <>Soha, a vetület mindig pozitív.</>],
    helyes: 0,
    magyarazat: <>A vetület <M>{"F\\cos\\varphi"}</M>, ahol φ az erő és a tengely bezárt szöge. Tompaszögnél a koszinusz negatív — a síknegyednek ehhez semmi köze.</>,
  },
  {
    k: <>Az <M>{"\\underline{F}_1 = (3;\\ 4)"}</M> és <M>{"\\underline{F}_2 = (4;\\ -3)"}</M> kN erők skaláris szorzata nulla. Mit jelent ez?</>,
    v: [<>A két erő merőleges egymásra.</>, <>A két erő egyforma nagyságú, ezért kiejtik egymást.</>, <>Az eredőjük nulla.</>, <>Párhuzamosak.</>],
    helyes: 0,
    magyarazat: <>A skaláris szorzat <M>{"|F_1||F_2|\\cos\\varphi"}</M>; ha nulla és egyik vektor sem nulla, akkor cos φ = 0, vagyis φ = 90°. Az eredőjük (7; 1) — messze nem nulla.</>,
  },
  {
    k: <>Mekkora a <M>{"(2;\\ -3;\\ 6)"}</M> kN térbeli vektor hossza?</>,
    v: [<>7 kN</>, <>5 kN</>, <>11 kN</>, <>49 kN</>],
    helyes: 0,
    magyarazat: <><M>{"\\sqrt{2^2 + 3^2 + 6^2} = \\sqrt{49} = 7"}</M>. A negatív komponens a négyzetre emelés miatt ugyanúgy számít; 11 a komponensek abszolút értékének összege volna — az nem hossz.</>,
  },
  {
    k: <>Mit ad meg egy erő <em>egységvektora</em>?</>,
    v: [<>Az erő irányát, nagyság nélkül — hossza 1.</>, <>Az erő nagyságát kN-ban.</>, <>Az erő támadáspontját.</>, <>Az erő nyomatékát az origóra.</>],
    helyes: 0,
    magyarazat: <>Az egységvektor a vektor osztva a hosszával: csak az irányt hordozza. Ezért kényelmes, ha a hatásvonalat két pont adja: <M>{"\\underline{F} = F\\,\\underline{e}"}</M>.</>,
  },
  {
    k: <>Mit jelent a tankönyv <M>{"(\\underline{F}_1, \\underline{F}_2, \\underline{F}_3) \\ekv \\underline{R}"}</M> egyenértékűségi kijelentése?</>,
    v: [<>A három erő együtt ugyanazt a hatást fejti ki a testre, mint az egyetlen R erő — R az erőrendszer eredője.</>, <>A három erővektor számtani közepe R.</>, <>A három erő és R együtt egyensúlyban van.</>, <>A három erő nagyságának összege egyenlő R nagyságával.</>],
    helyes: 0,
    magyarazat: <>A ≐ jel kötött vektorokból álló erőrendszerek <em>azonos hatását</em> jelenti, ezért kijelentésnek és nem egyenletnek hívjuk. Ez helyettesítési feladat: ismertek balra, az ismeretlen eredő jobbra. Az egyensúlyhoz a jobb oldalon O állna, és −R szerepelne a bal oldalon.</>,
  },
  {
    k: <>Egy lemezre három erő hat: az egyik függőleges, a másik kettő ferde, és a három hatásvonal páronként más-más pontban metszi egymást. Milyen az erőrendszer?</>,
    v: [<>Általános helyzetű (szétszórt) síkbeli erőrendszer.</>, <>Közös metszéspontú síkbeli erőrendszer.</>, <>Párhuzamos síkbeli erőrendszer.</>, <>Közös hatásvonalú erőrendszer.</>],
    helyes: 0,
    magyarazat: <>Közös metszéspontú csak akkor volna, ha <em>mind a három</em> hatásvonal ugyanazon a ponton menne át; párhuzamos, ha mind párhuzamos. Ha egyik feltétel sem teljesül — akár egyetlen erő miatt —, az erőrendszer szétszórt. Az eredőjét a 2. modulban, nyomatékkal számoljuk.</>,
  },
  {
    k: <>Mi a feltétele annak, hogy három erő egyensúlyban legyen?</>,
    v: [<>Közös metszéspontúak, egy síkban vannak, és zárt vektorháromszög szerkeszthető belőlük.</>, <>Egyforma nagyságúak és 120°-os szögeket zárnak be.</>, <>Párhuzamosak és a nagyságuk összege nulla.</>, <>Elég, ha a nagyságaik összege nulla.</>],
    helyes: 0,
    magyarazat: <>Tankönyv 3.3.1.1: közös metszéspont + zárt vektorháromszög, ami egyben közös síkot is jelent. A 120°-os eset csak egy speciális példa erre. A nagyságok összege nem lehet nulla (mind pozitív) — a vektorok összege nulla.</>,
  },
  {
    k: <>Két vektor 130°-os szöget zár be. Mit tudunk a szorzataikról?</>,
    v: [<>A skaláris szorzat negatív; a vektoriális szorzat merőleges mindkettőre, iránya a jobbkéz-szabály szerint.</>, <>A skaláris szorzat pozitív, mert a szög 90°-nál nagyobb.</>, <>A vektoriális szorzat nullvektor, mert a szög tompaszög.</>, <>Mindkét szorzat negatív.</>],
    helyes: 0,
    magyarazat: <><M>{"\\underline{a}\\cdot\\underline{b} = |a||b|\\cos 130^\\circ < 0"}</M>: tompaszögnél a skaláris szorzat negatív. A vektoriális szorzat vektor, „negatív” nem lehet; nagysága <M>{"|a||b|\\sin 130^\\circ > 0"}</M>, tehát nem nullvektor (az csak párhuzamosaknál), iránya a két vektor síkjára merőleges, a jobbkéz-szabály szerint.</>,
  },
];

export const HIBAK = [
  {
    cim: "Komponensek — melyik szögfüggvény?",
    feladat: <>F = 20 kN, az erő a függőlegestől (az y tengelytől) 30°-kal jobbra dől felfelé. Add meg a komponenseket!</>,
    lepesek: [
      { szoveg: <>Az erő az I. síknegyedbe mutat, mindkét komponens pozitív.</> },
      { szoveg: <><M>{"F_x = 20\\cos 30^\\circ = 17{,}32\\ \\text{kN}"}</M></>, hibas: true, javitas: <>A szöget a <em>függőlegestől</em> mérték, ezért a vízszintes komponenshez a szinusz tartozik: <M>{"F_x = 20\\sin 30^\\circ = 10\\ \\text{kN}"}</M>, és <M>{"F_y = 20\\cos 30^\\circ = 17{,}32\\ \\text{kN}"}</M>. A két érték fel volt cserélve.</> },
      { szoveg: <><M>{"F_y = 20\\sin 30^\\circ = 10\\ \\text{kN}"}</M></> },
      { szoveg: <>Ellenőrzés: <M>{"\\sqrt{17{,}32^2 + 10^2} = 20"}</M> ✓</> },
    ],
    tanulsag: <>Az ellenőrzés (a nagyság visszaszámolása) nem veszi észre a felcserélt komponenseket — csak az ábra. Mindig rajzold le, és nézd meg, melyik komponens a nagyobb.</>,
  },
  {
    cim: "Eredő iránya — az arctg csapdája",
    feladat: <>Egy erőrendszer eredőjének komponensei: <M>{"R_x = -6\\ \\text{kN},\\ R_y = -8\\ \\text{kN}"}</M>. Add meg az eredő nagyságát és irányszögét!</>,
    lepesek: [
      { szoveg: <><M>{"|\\underline{R}| = \\sqrt{6^2 + 8^2} = 10\\ \\text{kN}"}</M></> },
      { szoveg: <><M>{"\\operatorname{tg}\\alpha = \\frac{R_y}{R_x} = \\frac{-8}{-6} = 1{,}333"}</M></> },
      { szoveg: <><M>{"\\alpha = \\operatorname{arctg} 1{,}333 = 53{,}13^\\circ"}</M></>, hibas: true, javitas: <>Mindkét komponens negatív, az eredő a III. síknegyedben van. Az arctg 53,13°-ot ad, de a valódi irányszög <M>{"53{,}13^\\circ + 180^\\circ = 233{,}13^\\circ"}</M>. A számológép nem tudja, melyik síknegyedben vagy — neked kell tudnod.</> },
      { szoveg: <>Az eredő tehát 10 kN nagyságú.</> },
    ],
    tanulsag: <>Az arctg mindig −90° és +90° közé eső szöget ad. A II. és III. síknegyedben 180°-ot kell hozzáadni.</>,
  },
  {
    cim: "Vetület ferde tengelyre",
    feladat: <>Egy F = 10 kN erő irányszöge 40°, a t tengelyé 160°. Mekkora az erő vetülete a t tengelyre?</>,
    lepesek: [
      { szoveg: <>A bezárt szög: <M>{"160^\\circ - 40^\\circ = 120^\\circ"}</M>.</> },
      { szoveg: <>A vetület: <M>{"F_t = F\\cos 120^\\circ"}</M>.</> },
      { szoveg: <><M>{"\\cos 120^\\circ = 0{,}5"}</M>, ezért <M>{"F_t = 5\\ \\text{kN}"}</M>.</>, hibas: true, javitas: <><M>{"\\cos 120^\\circ = -0{,}5"}</M>, tehát <M>{"F_t = -5\\ \\text{kN}"}</M>: az erő a t tengellyel <em>ellentétes</em> irányba mutat. Tompaszögnél a vetület negatív — az előjel a lényeg, nem csak a szám.</> },
    ],
    tanulsag: <>Ha a bezárt szög 90°-nál nagyobb, a vetület negatív. Rajzold be a t tengelyt és az erőt: azonnal látszik, „vele” vagy „ellene” mutat.</>,
  },
  {
    cim: "Egyensúlyozás — melyik oldalra kerül az ismeretlen?",
    feladat: <>Egy csomópontban <M>{"\\underline{F}_1 = (4;\\ 3)"}</M> kN és <M>{"\\underline{F}_2 = (-1;\\ 5)"}</M> kN hat. Egyensúlyozd az erőrendszert egyetlen <M>{"\\underline{E}"}</M> erővel!</>,
    lepesek: [
      { szoveg: <>Egyensúlyi kijelentés: <M>{"(\\underline{F}_1, \\underline{F}_2, \\underline{E}) \\ekv \\underline{O}"}</M>.</> },
      { szoveg: <><M>{"\\Fx 4 - 1 = E_x \\;\\Rightarrow\\; E_x = 3\\ \\text{kN}"}</M></>, hibas: true, javitas: <>Egyensúlyozásnál az ismeretlen erő <em>ugyanazon az oldalon</em> áll, mint az ismertek, a jobb oldalon a zéruserő: <M>{"\\Fx 4 - 1 + E_x = 0 \\;\\Rightarrow\\; E_x = -3\\ \\text{kN}"}</M>. Aki az ismeretlent a jobb oldalra írja, az eredőt számolja ki, nem az egyensúlyozó erőt — az előjel fordul meg.</> },
      { szoveg: <><M>{"\\Fy 3 + 5 + E_y = 0 \\;\\Rightarrow\\; E_y = -8\\ \\text{kN}"}</M></> },
      { szoveg: <><M>{"|\\underline{E}| = \\sqrt{3^2 + 8^2} = 8{,}544\\ \\text{kN}"}</M></> },
    ],
    tanulsag: <>A kijelentés dönti el az egyenlet alakját. <M>{"(\\dots) \\ekv \\underline{R}"}</M>: az ismeretlen jobbra, ez az eredő. <M>{"(\\dots, \\underline{E}) \\ekv \\underline{O}"}</M>: az ismeretlen balra, ez az egyensúlyozó erő, ami éppen <M>{"-\\underline{R}"}</M>. Ha a két sor összekeveredik, minden előjel megfordul.</>,
  },
];
