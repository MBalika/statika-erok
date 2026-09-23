// Az oldal szerkezete egy helyen. Új modul felvételéhez elég ide beírni
// egy új elemet, és létrehozni a hozzá tartozó src/app/<slug>/page.js fájlt.

export const kurzus = {
  cim: "Statika",
  alcim: "Lépésről lépésre, az egész félév",
  tanszek: "BME Építőmérnöki Kar · Tartószerkezetek Mechanikája Tanszék",
  targy: "Statika · a tárgy teljes anyaga",
  tankonyv:
    "Hincz Krisztián – Németh Róbert K.: Statika (BME TMT, 2025) — az oldal a könyv fejezeteit követi",
};

export const modulok = [
  {
    slug: "/",
    szam: null,
    cim: "Bevezetés",
    rovid: "Bevezetés",
    menu: "Bevezetés",
    leiras:
      "Mire jó ez az anyag, hogyan használd, és milyen jelöléseket használunk végig.",
    ikon: "iranytu",
    kesz: true,
    szakaszok: [
      { id: "utmutato", cim: "Útmutató ehhez az anyaghoz" },
      { id: "jelolesek", cim: "Jelölésrendszer" },
      { id: "koordinata", cim: "Koordináta-rendszer" },
      { id: "mertekegysegek", cim: "Mértékegységek, pontosság" },
      { id: "modulok", cim: "A modulok" },
    ],
  },
  {
    slug: "/vektorok",
    szam: 1,
    cim: "Vektorok, erők megadása",
    rovid: "Vektorok",
    menu: "Vektorok",
    leiras:
      "Erő megadása komponensekkel, vektorműveletek, egyenértékűségi kijelentés, skaláris és vektoriális szorzat, egyensúly.",
    ikon: "vektor",
    kesz: true,
    szakaszok: [
      { id: "elmelet", cim: "Elmélet" },
      { id: "peldak", cim: "Kidolgozott feladatok" },
      { id: "kalkulator", cim: "Kalkulátorok" },
      { id: "gyakorlas", cim: "Gyakorlás" },
    ],
  },
  {
    slug: "/nyomatek",
    szam: 2,
    cim: "Nyomaték, eredő, redukálás",
    rovid: "Nyomaték és eredő",
    menu: "Nyomaték",
    leiras:
      "Forgatónyomaték pontra és tengelyre, erőpár, dinámrendszer redukálása, az eredő esetei síkban és térben.",
    ikon: "nyomatek",
    kesz: true,
    szakaszok: [
      { id: "elmelet", cim: "Elmélet" },
      { id: "peldak", cim: "Kidolgozott feladatok" },
      { id: "kalkulator", cim: "Kalkulátorok" },
      { id: "gyakorlas", cim: "Gyakorlás" },
    ],
  },
  {
    slug: "/megoszlo",
    szam: 3,
    cim: "Megoszló erők",
    rovid: "Megoszló erők",
    menu: "Megoszló",
    leiras:
      "Vonal, felület és térfogat mentén megoszló erők eredője, felbontás, ferde és ívmenti teher, víznyomás.",
    ikon: "megoszlo",
    kesz: true,
    szakaszok: [
      { id: "elmelet", cim: "Elmélet" },
      { id: "peldak", cim: "Kidolgozott feladatok" },
      { id: "kalkulator", cim: "Kalkulátorok" },
      { id: "gyakorlas", cim: "Gyakorlás" },
    ],
  },
  {
    slug: "/sulypont",
    szam: 4,
    cim: "Súlypont",
    rovid: "Súlypont",
    menu: "Súlypont",
    leiras:
      "Statikai nyomaték és eltolása, összetett síkidomok súlypontja, kivonásos módszer, köríves alakzatok.",
    ikon: "sulypont",
    kesz: true,
    szakaszok: [
      { id: "elmelet", cim: "Elmélet" },
      { id: "peldak", cim: "Kidolgozott feladatok" },
      { id: "kalkulator", cim: "Kalkulátorok" },
      { id: "gyakorlas", cim: "Gyakorlás" },
    ],
  },
  {
    slug: "/tartok",
    szam: 5,
    cim: "Egyszerű tartók reakciói",
    rovid: "Tartók reakciói",
    menu: "Tartók",
    leiras:
      "Kényszerek, elkülönítés, egyensúlyi kijelentés, a reakciók számítása kéttámaszú tartón, konzolon, rúddal megtámasztott szerkezeten.",
    ikon: "tarto",
    kesz: true,
    szakaszok: [
      { id: "elmelet", cim: "Elmélet" },
      { id: "peldak", cim: "Kidolgozott feladatok" },
      { id: "kalkulator", cim: "Kalkulátorok" },
      { id: "gyakorlas", cim: "Gyakorlás" },
    ],
  },
  {
    slug: "/osszetett",
    szam: 6,
    cim: "Összetett tartók",
    rovid: "Összetett tartók",
    menu: "Összetett",
    leiras:
      "Belső csukló és elkülönítés, Gerber-tartó, háromcsuklós tartó, csuklón terhelt szerkezet, függesztőmű — a megoldás sorrendje.",
    ikon: "osszetett",
    kesz: true,
    szakaszok: [
      { id: "elmelet", cim: "Elmélet" },
      { id: "peldak", cim: "Kidolgozott feladatok" },
      { id: "kalkulator", cim: "Kalkulátorok" },
      { id: "gyakorlas", cim: "Gyakorlás" },
    ],
  },
  {
    slug: "/racsos",
    szam: 7,
    cim: "Rácsos tartók",
    rovid: "Rácsos tartók",
    menu: "Rácsos",
    leiras:
      "Csomóponti módszer, vakrudak, hármas átmetszés, mellékrácsozás — a rúderők számítása és az erőáramlás.",
    ikon: "racsos",
    kesz: true,
    szakaszok: [
      { id: "elmelet", cim: "Elmélet" },
      { id: "peldak", cim: "Kidolgozott feladatok" },
      { id: "kalkulator", cim: "Kalkulátorok" },
      { id: "gyakorlas", cim: "Gyakorlás" },
    ],
  },
  {
    slug: "/hatarozottsag",
    szam: 8,
    cim: "Statikai határozottság",
    rovid: "Határozottság",
    menu: "Határozottság",
    leiras:
      "Mikor oldható meg a feladat egyensúlyi egyenletekkel: ismeretlenek és egyenletek, kritikus elrendezés, mechanizmus és határozatlan tartó.",
    ikon: "hatarozottsag",
    kesz: true,
    szakaszok: [
      { id: "elmelet", cim: "Elmélet" },
      { id: "peldak", cim: "Kidolgozott feladatok" },
      { id: "kalkulator", cim: "Kalkulátorok" },
      { id: "gyakorlas", cim: "Gyakorlás" },
    ],
  },
  {
    slug: "/igenybevetel",
    szam: 9,
    cim: "Igénybevételi ábrák",
    rovid: "Igénybevételi ábrák",
    menu: "Igénybevétel",
    leiras:
      "Normálerő, nyíróerő, hajlítónyomaték: számítás egy keresztmetszetben, függvények és ábrák, differenciális összefüggések, ferde és tört tengelyű tartó, Gerber-tartó.",
    ikon: "igenybevetel",
    kesz: true,
    szakaszok: [
      { id: "elmelet", cim: "Elmélet" },
      { id: "peldak", cim: "Kidolgozott feladatok" },
      { id: "kalkulator", cim: "Kalkulátorok" },
      { id: "gyakorlas", cim: "Gyakorlás" },
    ],
  },
  {
    slug: "/terbeli",
    szam: 10,
    cim: "Térbeli tartók",
    rovid: "Térbeli tartók",
    menu: "Térbeli",
    leiras:
      "Térbeli kényszerek és hat egyensúlyi egyenlet, háromlábú bakállvány, befogott térbeli konzol, térbeli rácsos tartó, térbeli igénybevételek.",
    ikon: "terbeli",
    kesz: true,
    szakaszok: [
      { id: "elmelet", cim: "Elmélet" },
      { id: "peldak", cim: "Kidolgozott feladatok" },
      { id: "kalkulator", cim: "Kalkulátorok" },
      { id: "gyakorlas", cim: "Gyakorlás" },
    ],
  },
];

/** Kiegészítő oldalak – a modulok mellett, a navigáció jobb szélén. */
export const extraOldalak = [
  {
    slug: "/utvonal",
    rovid: "Útvonal",
    menu: "Útvonal",
    leiras: "Hetekre bontott tanulási útvonal: mit olvass, mit nézz meg, mit gyakorolj.",
  },
  {
    slug: "/tartokalkulator",
    rovid: "Ábrakalkulátor",
    menu: "Ábrák",
    leiras: "Igénybevételi ábrák tetszőleges tartóra: N, V, M, reakciók, metszetértékek.",
  },
  {
    slug: "/hibanaplo",
    rovid: "Hibanapló",
    menu: "Hibák",
    leiras: "Amit elrontottál, itt gyűlik — ismételd, amíg megy.",
  },
  {
    slug: "/zh",
    rovid: "Zh-szimulátor",
    menu: "Zh",
    leiras: "Tíz véletlen feladat órával, segítség nélkül – mint a zárthelyin.",
  },
  {
    slug: "/puska",
    rovid: "Puska",
    menu: "Puska",
    leiras: "Nyomtatható összefoglaló modulonként, plusz a tankönyv nyelve.",
  },
];

export function modulSlugAlapjan(slug) {
  return modulok.find((m) => m.slug === slug);
}
