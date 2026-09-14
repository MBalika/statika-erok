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
];
