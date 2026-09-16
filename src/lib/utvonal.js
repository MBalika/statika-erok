// Hetekre bontott tanulási útvonal az egész félévre.
//
// MEGJEGYZÉS: a heti kiosztás JAVASLAT – a tankönyv fejezetrendjét és a
// szintemelő feladatsorok (H01–H13) témáit követi. A tanszéki ütemezés
// (előadás, gyakorlat, zh-időpontok) ettől eltérhet; a hallgató a „Hol
// tartasz?” választóval maga állítja be, melyik héten jár.
//
//   het       – a hét sorszáma (1–13)
//   cim       – a hét címe
//   temak     – rövid felsorolás, mi kerül elő
//   modulok   – az oldal moduljainak slug-jai (oldalterkep.js), amelyek a hét
//               anyagát dolgozzák fel; üres, ha még nincs hozzá modul
//   hFeladat  – a hozzá tartozó szintemelő feladatsor(ok) jele
//   hTemak    – a feladatsor témái egy sorban
//   tankonyv  – mit olvass a tankönyvben (fejezet, oldalak)
//   cel       – egy mondat: mit tudsz a hét végén
//   allapot   – "kesz" (a modul elérhető az oldalon) | "hamarosan"

export const HETEK = [
  {
    het: 1,
    cim: "Bevezetés, vektorok, erők megadása",
    temak: [
      "Jelölések, koordináta-rendszer, mértékegységek, pontosság",
      "Vektor megadása komponensekkel és polárisan, vektorműveletek",
      "Skaláris és vektoriális szorzat",
      "Erő fogalma, egyenértékűségi kijelentés, egyensúly",
    ],
    modulok: ["/", "/vektorok"],
    hFeladat: "H01",
    hTemak: "gerenda súlya · vektorok összege, skalárszorzat · egyensúly ferde síkon",
    tankonyv: "1., 2.1–2.4 (13–31. o.), 3.1–3.2 (33–39. o.)",
    cel: "Bármilyen módon megadott erőt komponensekre bontasz, összeadsz, és egy egyszerű egyensúlyt felírsz vetületi egyenletekkel.",
    allapot: "kesz",
  },
  {
    het: 2,
    cim: "Nyomaték, eredő, redukálás",
    temak: [
      "Forgatónyomaték pontra és tengelyre, az erő karja",
      "Erőpár, társerő és társnyomaték",
      "Közös metszéspontú, párhuzamos és szétszórt erőrendszer eredője",
      "Az eredő hatásvonala, redukálás pontra",
    ],
    modulok: ["/nyomatek"],
    hFeladat: "H02",
    hTemak: "erőpár nyomatéka · erőrendszer eredője · hatásvonal metszéspontja",
    tankonyv: "3.3 (39–60. o.)",
    cel: "Síkbeli erőrendszer eredőjét (nagyság, irány, hatásvonal) kiszámolod vetületi és nyomatéki egyenletekkel.",
    allapot: "kesz",
  },
  {
    het: 3,
    cim: "Megoszló erők és súlypont",
    temak: [
      "Vonal mentén megoszló erő eredője: egyenletes, lineáris, szakaszos",
      "Ferde és ívmenti teher, víznyomás",
      "Felület és térfogat mentén megoszló erők",
      "Statikai nyomaték, összetett síkidomok súlypontja",
    ],
    modulok: ["/megoszlo", "/sulypont"],
    hFeladat: "H03 (első fele)",
    hTemak: "megoszló erőrendszer eredője",
    tankonyv: "3.4–3.5 (60–68. o.), 9.4 (171–175. o.)",
    cel: "Bármilyen megoszló terhet eredővé alakítasz (nagyság + helye), és egy összetett síkidom súlypontját táblázattal számolod.",
    allapot: "kesz",
  },
  {
    het: 4,
    cim: "Egyszerű tartók reakciói",
    temak: [
      "Kényszerek: görgő, rúd, csukló, befogás – és fokszámuk",
      "Elkülönítés, egyensúlyi kijelentés, egyismeretlenes egyenletek",
      "Kéttámaszú tartó, konzol, rúddal megtámasztott gerenda",
      "Szerkesztéses megoldás, ellenőrző egyenlet, eredményvázlat",
    ],
    modulok: ["/tartok"],
    hFeladat: "H03 (második fele) · H04",
    hTemak: "tartók reakciói · szerkesztéses megoldás · víztömeget tartó gerenda · elkülönítés, egyenletszám",
    tankonyv: "4. (69–84. o.)",
    cel: "Egyszerű tartó reakcióit a tankönyv öt lépésével (elkülönítés → egyensúlyi kijelentés → egyenletek → ellenőrzés → eredményvázlat) hibátlanul kiszámolod.",
    allapot: "kesz",
  },
  {
    het: 5,
    cim: "Összetett tartók reakciói",
    temak: [
      "Belső csukló, kapcsolati erők, elkülönítés több testre",
      "Gerber-tartó, háromcsuklós tartó",
      "Terhelt csukló, függesztő- és feszítőmű",
      "Egyenletszám és ismeretlenek száma",
    ],
    modulok: ["/osszetett"],
    hFeladat: "H05 · H06",
    hTemak: "összetett tartók reakciói (csuklók) · megoszló teher eredője · külső és belső reakciók, elkülönítés",
    tankonyv: "5. (85–101. o.)",
    cel: "Két-három testből álló szerkezetet részekre bontasz, és a külső meg a belső reakciókat egyaránt kiszámolod.",
    allapot: "kesz",
  },
  {
    het: 6,
    cim: "Rácsos tartók I.",
    temak: [
      "Rácsos tartó felépítése, rúderők (húzott/nyomott), elnevezések",
      "Csomóponti módszer lépései",
      "Hármas átmetszés",
    ],
    modulok: ["/racsos"],
    hFeladat: "H07",
    hTemak: "rácsos tartó: csomóponti módszer + hármas átmetszés",
    tankonyv: "6.1–6.3.1 (103–110. o.)",
    cel: "Egy rácsos tartó bármely rúderejét meghatározod csomóponti egyensúlyból vagy hármas átmetszéssel.",
    allapot: "kesz",
  },
  {
    het: 7,
    cim: "Rácsos tartók II. és statikai határozottság",
    temak: [
      "Vakrudak felismerése, rúderőtáblázat",
      "Négyes átmetszés, mellékrácsozás, összetett rácsos tartók",
      "Statikai határozottság: feladaté és tartóé",
      "Határozatlan és túlhatározott szerkezetek felismerése",
    ],
    modulok: ["/racsos"],
    hFeladat: "H08",
    hTemak: "rácsos tartó: reakciók, vakrudak, rúderőtáblázat",
    tankonyv: "6.3–6.5, 7. (109–134. o.)",
    cel: "Rácsos tartó teljes rúderőtáblázatát kitöltöd, és bármely szerkezetről eldöntöd, statikailag határozott-e.",
    allapot: "reszben",
  },
  {
    het: 8,
    cim: "Igénybevételek: belső erők, számítás egy keresztmetszetben",
    temak: [
      "Belső erők, az igénybevételek definíciója (N, V, M)",
      "Előjelszabályok, a keresztmetszet két oldala",
      "Igénybevétel számítása egy adott keresztmetszetben",
      "Számítás egy másik keresztmetszetből, összetett tartó keresztmetszete",
    ],
    modulok: [],
    hFeladat: "H09",
    hTemak: "alakhelyes igénybevételi ábrák",
    tankonyv: "8.1–8.2 (135–146. o.)",
    cel: "Egy megadott keresztmetszet N, V, M értékét bármelyik oldalról kiszámolod, helyes előjellel.",
    allapot: "hamarosan",
  },
  {
    het: 9,
    cim: "Igénybevételi ábrák: kéttámaszú tartó, konzol, megoszló teher",
    temak: [
      "Igénybevételi függvények és ábrák",
      "Differenciális összefüggések: q → V → M",
      "Alakhelyes ábra: ugrások, törések, szélsőérték helye",
    ],
    modulok: [],
    hFeladat: "H10",
    hTemak: "igénybevételi ábrák (kéttámaszú, konzol, megoszló)",
    tankonyv: "8.3 (147–157. o.)",
    cel: "Kéttámaszú tartó és konzol N, V, M ábráját megrajzolod koncentrált és megoszló teherre, a jellemző értékekkel.",
    allapot: "hamarosan",
  },
  {
    het: 10,
    cim: "Ferde és tört tengelyű tartók",
    temak: [
      "Ferde tengelyű szakasz: erők felbontása tartóirányba és arra merőlegesen",
      "Tört tengelyű tartó, a sarok egyensúlya",
      "Elágazásos tartó",
    ],
    modulok: [],
    hFeladat: "H11",
    hTemak: "igénybevételi ábrák (ferde tengelyű)",
    tankonyv: "8.4.1–8.4.4 (157–159. o.)",
    cel: "Ferde vagy tört tengelyű tartó ábráit is megrajzolod, a sarkoknál helyesen viszed át a nyomatékot.",
    allapot: "hamarosan",
  },
  {
    het: 11,
    cim: "Összetett tartók ábrái, Gerber-tartó",
    temak: [
      "Összetett tartó igénybevételi ábrái részekre bontva",
      "Gerber-tartó: a csuklónál M = 0",
      "Háromcsuklós tartó, keretek",
    ],
    modulok: [],
    hFeladat: "H12",
    hTemak: "igénybevételi ábrák (összetett tartók)",
    tankonyv: "8.2.2, 8.4.5–8.4.6 (144–146., 159–160. o.)",
    cel: "Összetett tartó reakcióit és teljes N, V, M ábráját összefüggően, ellenőrizve elkészíted.",
    allapot: "hamarosan",
  },
  {
    het: 12,
    cim: "Térbeli tartók",
    temak: [
      "Erő és forgatónyomaték a térben, vektoriális szorzat",
      "Térbeli eredő, térbeli kényszerek",
      "Háromlábú bakállvány, térbeli konzol reakciói",
      "Térbeli igénybevételek",
    ],
    modulok: [],
    hFeladat: "H13",
    hTemak: "térbeli feladatok",
    tankonyv: "9.1–9.3 (161–171. o.)",
    cel: "Térbeli szerkezet reakcióit hat egyensúlyi egyenlettel kiszámolod, és a térbeli igénybevételeket is felírod.",
    allapot: "hamarosan",
  },
  {
    het: 13,
    cim: "Ismétlés, vizsgafelkészülés",
    temak: [
      "A vizsgaminta öt feladattípusa végig",
      "Zh-szimulátor órával, segítség nélkül",
      "Tipikus hibák és ellenőrző egyenletek",
    ],
    modulok: [],
    hFeladat: "H01–H13 (ismétlés)",
    hTemak: "vegyes feladatok minden témából",
    tankonyv: "8.4 Tippek, trükkök (157–160. o.), a saját hibalistád",
    cel: "Mind az öt vizsgatípust időre, hibátlanul megoldod.",
    allapot: "hamarosan",
  },
];

/**
 * A vizsgaminta öt feladattípusa – melyik hét / modul készít fel rá.
 *   allapot: "kesz" – a felkészítő modul elérhető az oldalon; "reszben" – csak
 *   egy része; "hamarosan" – még nincs hozzá modul.
 */
export const VIZSGA_TIPUSOK = [
  {
    szam: 1,
    tipus: "Erőrendszer eredője",
    leiras: "Koncentrált és megoszló erők, nyomatékok eredője: nagyság, irány, hatásvonal.",
    hetek: [1, 2, 3],
    modulok: ["/vektorok", "/nyomatek", "/megoszlo"],
    allapot: "kesz",
  },
  {
    szam: 2,
    tipus: "Egyszerű tartó N, V, M ábrái",
    leiras: "Reakciók, majd normálerő-, nyíróerő- és nyomatéki ábra kéttámaszú tartón vagy konzolon.",
    hetek: [4, 8, 9, 10],
    modulok: ["/tartok"],
    allapot: "reszben",
  },
  {
    szam: 3,
    tipus: "Rácsos tartó rúderői átmetszéssel",
    leiras: "Reakciók, vakrudak, majd a kijelölt rudak ereje hármas átmetszéssel.",
    hetek: [6, 7],
    modulok: ["/racsos"],
    allapot: "kesz",
  },
  {
    szam: 4,
    tipus: "Összetett tartó reakciói és igénybevételi ábrái",
    leiras: "Gerber- vagy háromcsuklós tartó: külső és belső reakciók, teljes ábrasor.",
    hetek: [5, 11],
    modulok: ["/osszetett"],
    allapot: "reszben",
  },
  {
    szam: 5,
    tipus: "Térbeli feladat",
    leiras: "Térbeli erőrendszer eredője vagy térbeli tartó reakciói hat egyenlettel.",
    hetek: [12],
    modulok: [],
    allapot: "hamarosan",
  },
];

/** Hány hét anyaga érhető el az oldalon. */
export function elerhetoHetek() {
  return HETEK.filter((h) => h.allapot === "kesz").length;
}

/** A kész modulok slug-jai (egyedi, a Bevezetés nélkül). */
export function keszModulSlugok() {
  const lista = [];
  for (const h of HETEK) {
    for (const s of h.modulok) {
      if (s !== "/" && !lista.includes(s)) lista.push(s);
    }
  }
  return lista;
}
