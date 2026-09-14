// Az oldal szerkezete egy helyen. Új modul felvételéhez elég ide beírni
// egy új elemet, és létrehozni a hozzá tartozó src/app/<slug>/page.js fájlt.

export const kurzus = {
  cim: "Statika",
  alcim: "Erők és erőrendszerek",
  tanszek: "BME Építőmérnöki Kar · Tartószerkezetek Mechanikája Tanszék",
  targy: "Statika · A1. gyakorlat anyaga",
  tankonyv:
    "Hincz Krisztián – Németh Róbert K.: Statika (BME TMT, 2025) 2–3. fejezet",
};

export const modulok = [
  {
    slug: "/",
    szam: null,
    cim: "Bevezetés",
    rovid: "Bevezetés",
    leiras:
      "Mire jó ez az anyag, hogyan használd, és milyen jelöléseket használunk végig.",
    ikon: "iranytu",
    kesz: true,
    szakaszok: [
      { id: "utmutato", cim: "Útmutató ehhez az anyaghoz" },
      { id: "jelolesek", cim: "Jelölésrendszer" },
      { id: "koordinata", cim: "Koordináta-rendszer" },
      { id: "mertekegysegek", cim: "Mértékegységek, pontosság" },
      { id: "modulok", cim: "A négy modul" },
    ],
  },
  {
    slug: "/vektorok",
    szam: 1,
    cim: "Vektorok, erők megadása",
    rovid: "Vektorok",
    leiras:
      "Erő megadása komponensekkel, vektorok összeadása, vetítés ferde tengelyre, egyensúly.",
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
    leiras:
      "Forgatónyomaték, erőpár, erőrendszer redukálása egy pontra, az eredő három esete.",
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
    leiras:
      "Vonal mentén megoszló teher eredőjének nagysága és helye, felbontási technikák.",
    ikon: "megoszlo",
    kesz: false,
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
    leiras:
      "Statikai nyomaték, összetett síkidomok súlypontja, kivonásos módszer, köríves alakzatok.",
    ikon: "sulypont",
    kesz: false,
    szakaszok: [
      { id: "elmelet", cim: "Elmélet" },
      { id: "peldak", cim: "Kidolgozott feladatok" },
      { id: "kalkulator", cim: "Kalkulátorok" },
      { id: "gyakorlas", cim: "Gyakorlás" },
    ],
  },
];

export function modulSlugAlapjan(slug) {
  return modulok.find((m) => m.slug === slug);
}
