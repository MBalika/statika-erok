# Statika – Erők és erőrendszerek

Interaktív tananyag a BME Építőmérnöki Kar **Statika** tárgyának első heteihez.
Az anyag a gyakorlat felépítését követi: minden modulban elmélet mozgatható
ábrákkal, a gyakorlat feladatai lépésenként kidolgozva, kalkulátorok és
véletlenszerűen generált gyakorlófeladatok.

## Állapot

| Modul | Tartalom | Állapot |
| --- | --- | --- |
| Bevezetés | útmutató, jelölések, koordináta-rendszerek, mértékegységek | kész |
| 1. Vektorok, erők megadása | komponensek, összeadás, vetítés, egyensúly, térbeli vektorok | kész |
| 2. Nyomaték, eredő, redukálás | forgatónyomaték, erőpár, redukálás, az eredő három esete | váz |
| 3. Megoszló erők | eredő nagysága és helye, felbontási technikák | váz |
| 4. Súlypont | statikai nyomaték, összetett idomok, kivonásos módszer | váz |

## Futtatás helyben

```bash
npm install
npm run dev       # fejlesztői szerver: http://localhost:3000
npm run build     # éles build
npm run start     # az éles build kiszolgálása
```

Node 20 vagy újabb szükséges.

## Telepítés GitHubra és Vercelre

1. Hozz létre egy üres repót a GitHubon (például `statika-erok`).
2. Ebben a mappában:

   ```bash
   git init
   git add .
   git commit -m "Statika – Erők és erőrendszerek, 1. modul"
   git branch -M main
   git remote add origin https://github.com/<felhasznalonev>/statika-erok.git
   git push -u origin main
   ```

3. A [vercel.com](https://vercel.com) felületén: **Add New → Project → Import Git
   Repository**, és válaszd ki a repót. A Vercel felismeri a Next.js projektet,
   nem kell semmit beállítani (build parancs: `next build`, output: automatikus).
4. A `main` ágra való minden további push automatikusan új verziót telepít.

## A projekt felépítése

```
src/
  app/
    layout.js              közös fejléc, lábléc, metaadatok
    page.js                Bevezetés (kezdőlap)
    vektorok/page.js       1. modul – teljes tartalom
    nyomatek|megoszlo|sulypont/page.js   2–4. modul (egyelőre váz)
    globals.css            színrendszer és közös stílusok
  components/
    SiteHeader.js          felső navigáció, mobil menü
    SiteFooter.js          lábléc
    ModulKeret.js          modulfejléc és ragadós szakasznavigáció
    KidolgozottFeladat.js  lépésenként feltárható mintapélda
    GyakorloDoboz.js       általános gyakorlófeladat-motor
    Hamarosan.js           a még el nem készült modulok oldala
    ui/
      Elemek.js            szakasz, kártya, kiemelő doboz, ábrakeret
      Keplet.js            KaTeX képletek (M, MB, KepletDoboz)
    abrak/
      SvgElemek.js         közös SVG építőelemek (nyíl, tengely, szögív)
      StatikusAbrak.js     elméleti magyarázó ábrák
      FeladatAbrak.js      a kidolgozott feladatok ábrái
      ErovektorBonto.js    interaktív: erő komponensekre bontása
      VektorOsszegzo.js    interaktív: síkbeli eredő, láncszabály
      VetuletFelfedezo.js  interaktív: vetítés forgatható tengelyre
      TerbeliVektorKalk.js kalkulátor: térbeli vektorok összege
    vektorok/
      GyakorloSzekcio.js   az 1. modul feladatgenerátorai
  lib/
    oldalterkep.js         a modulok listája – innen épül a navigáció
    szamok.js              magyar számformázás, szögek, vektorműveletek
```

## Hogyan bővíthető

**Új modul felvétele:** írj be egy új elemet a `src/lib/oldalterkep.js`
`modulok` tömbjébe (`kesz: true`), és hozd létre a hozzá tartozó
`src/app/<slug>/page.js` fájlt. A navigáció, a lábléc és a kezdőlapi
modulkártyák automatikusan frissülnek.

**Új kidolgozott feladat:**

```jsx
<KidolgozottFeladat jel="GYF‑4" ido="6 perc" cim="..." feladat={<p>...</p>}
                    abra={<AbraKeret>...</AbraKeret>} tanulsag={<p>...</p>}>
  <Lepes cim="Első lépés">...</Lepes>
  <Lepes cim="Második lépés">...</Lepes>
</KidolgozottFeladat>
```

**Új gyakorlófeladat-típus:** írj egy generátorfüggvényt, amely minden hívásnál
új feladatot ad vissza, és add át a `GyakorloDoboz`-nak:

```js
function ujFeladat() {
  return {
    szoveg: <p>…</p>,          // a feladat kiírása
    sugo: <p>…</p>,            // opcionális segítség
    mezok: [{ id: "x", cimke: "Rx", egyseg: "kN", helyes: 12.34, tizedes: 2 }],
    megoldas: <>…</>,          // a teljes levezetés
  };
}
```

A `mezok` elemeinél a `tures` mezővel állítható az elfogadott eltérés
(alapértelmezés: a helyes érték 1,5 %-a, de legalább 0,01).

**Képletek:** a `M` komponens soron belüli, a `MB` önálló sorban álló KaTeX
képletet renderel. A magyar tizedesvesszőt automatikusan kezeli, elég
`3,830` alakban írni.

**Színek:** a paletta a `globals.css` `@theme` blokkjában van (`petrol-*`
alapszínek, `naracs-*` kiemelés, `jel-*` az ábrák jelölőszínei). Egy új
oldalhoz elég ezeket átírni.

## Háttéranyag

Hincz Krisztián – Németh Róbert K.: *Statika* (BME Tartószerkezetek Mechanikája
Tanszék, 2025), 2–3. fejezet. A kidolgozott feladatok az A1. gyakorlat hivatalos
megoldássorát követik.

## Technikai háttér

Next.js (App Router) · React · Tailwind CSS · KaTeX. Nincs adatbázis és nincs
szerveroldali logika: az egész oldal statikusan előrenderelhető, a
gyakorlófeladatok a böngészőben generálódnak.
