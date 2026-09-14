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
| 2. Nyomaték, eredő, redukálás | forgatónyomaték, erőpár, redukálás, az eredő három esete | kész |
| 3. Megoszló erők | eredő nagysága és helye, felbontási technikák, szakaszos teher | kész |
| 4. Súlypont | statikai nyomaték, alapidomok, részekre bontás, kivonásos módszer, köríves idomok | kész |

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
   git commit -m "Statika – Erők és erőrendszerek"
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
    nyomatek/page.js       2. modul – teljes tartalom
    megoszlo/page.js       3. modul – teljes tartalom
    sulypont/page.js       4. modul – teljes tartalom
    globals.css            színrendszer és közös stílusok
  components/
    SiteHeader.js          felső navigáció, mobil menü
    SiteFooter.js          lábléc
    ModulKeret.js          modulfejléc és ragadós szakasznavigáció
    KidolgozottFeladat.js  lépésenként feltárható mintapélda
    GyakorloDoboz.js       általános gyakorlófeladat-motor
    anim/
      Idovonal.js          idővonal-hook (lejátszás, ugrás, sebesség) és simító függvények
      FeladatFilm.js       a „film” keret: rajz + fejezetek + vezérlők
      FilmElemek.js        animálható SVG-elemek (kihúzódó nyíl, ív, felirat, pont)
    Hamarosan.js           „hamarosan” oldal (jelenleg nem használt, új modulhoz jól jön)
    ui/
      Elemek.js            szakasz, kártya, kiemelő doboz, ábrakeret
      Keplet.js            KaTeX képletek (M, MB, KepletDoboz)
    abrak/
      SvgElemek.js         közös SVG építőelemek (nyíl, tengely, szögív)
      StatikusAbrak.js     elméleti magyarázó ábrák
      FeladatAbrak.js      a kidolgozott feladatok ábrái
      NyomatekAbrak.js     a 2. modul elméleti ábrái
      NyomatekFeladatAbrak.js  a 2. modul feladatábrái
      ErovektorBonto.js    interaktív: erő komponensekre bontása
      VektorOsszegzo.js    interaktív: síkbeli eredő, láncszabály
      VetuletFelfedezo.js  interaktív: vetítés forgatható tengelyre
      TerbeliVektorKalk.js kalkulátor: térbeli vektorok összege
      NyomatekFelfedezo.js interaktív: nyomaték, erőkar, forgásirány
      ErorendszerRedukalo.js interaktív: redukálás, három nézet
      TerbeliNyomatekKalk.js kalkulátor: r × F
      MegoszloAbrak.js     a 3. modul elméleti ábrái
      MegoszloFeladatAbrak.js  a 3. modul feladatábrái
      TrapezTeherFelfedezo.js interaktív: trapézteher eredője, felbontások
      SzakaszosTeherKalk.js kalkulátor: szakaszos megoszló teher eredője
      SulypontAbrak.js     a 4. modul elméleti ábrái (+ TengelyekYZ, SJel közös elemek)
      SulypontFeladatAbrak.js  a 4. modul feladatábrái
      SzelvenyFelfedezo.js interaktív: T/L/U/I szelvény súlypontja csúszkákkal
      SulypontKalk.js      kalkulátor: összetett síkidom súlypontja, kivont részekkel
    vektorok/
      GyakorloSzekcio.js   az 1. modul feladatgenerátorai
      FilmGyf2.js          film: négy erő eredője lépésről lépésre
    nyomatek/
      GyakorloSzekcio.js   a 2. modul feladatgenerátorai
      FilmGyf3.js          film: redukálás az origóra, az eredő hatásvonala
    megoszlo/
      GyakorloSzekcio.js   a 3. modul feladatgenerátorai
      FilmGyf1.js          film: a trapéz teher eredője
    sulypont/
      GyakorloSzekcio.js   a 4. modul feladatgenerátorai
      FilmGyf4.js          film: a T-szelvény súlypontja mérleggel
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

**Új film (animált megoldás):** a `FeladatFilm` komponensnek egy `rajz(t)`
függvényt adsz (a teljes SVG a t másodperchez), és a fejezetek listáját
(`{ t0, cim, szoveg, kepletek }`). Az `anim/Idovonal.js` `arany(t, t0, t1)`
függvénye 0→1 arányt ad a két időpont között, ebből számolható minden
nyílhossz, eltolás és opacitás. Minta: `src/components/megoszlo/FilmGyf1.js`.

**Képletek:** a `M` komponens soron belüli, a `MB` önálló sorban álló KaTeX
képletet renderel. A magyar tizedesvesszőt automatikusan kezeli, elég
`3,830` alakban írni.

**Színek:** a paletta a `globals.css` `@theme` blokkjában van (`petrol-*`
alapszínek, `naracs-*` kiemelés, `jel-*` az ábrák jelölőszínei). Egy új
oldalhoz elég ezeket átírni.

## Háttéranyag

Hincz Krisztián – Németh Róbert K.: *Statika* (BME Tartószerkezetek Mechanikája
Tanszék, 2025), 2–3. fejezet. A kidolgozott feladatok az A1. gyakorlat
feladatsorát követik. Keresztmetszeteknél a gyakorlat jelölését használjuk:
y balra, z lefelé, S_y = ∫z dA, S_z = ∫y dA.

Egy eltérés: a GYF‑4 feladatban a három erő hatásvonala a rajz szerint egy
háromszög három oldala, nem egy közös ponton átmenő sugársor. Emiatt az a) és a
b) adatsornál az erők ugyan kiegyenlítik egymást, de a nyomatékuk nem tűnik el,
így az eredő mindkét esetben erőpár (−103, illetve −60 kNm). Az oldalon ez a
levezetés szerepel, és a feladat tanulsága éppen erre a különbségre épül.

## Technikai háttér

Next.js (App Router) · React · Tailwind CSS · KaTeX. Nincs adatbázis és nincs
szerveroldali logika: az egész oldal statikusan előrenderelhető, a
gyakorlófeladatok a böngészőben generálódnak.
