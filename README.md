# Statika – Erők és erőrendszerek

Interaktív tananyag a BME Építőmérnöki Kar **Statika** tárgyának első heteihez.
Az anyag a gyakorlat felépítését követi: minden modulban elmélet mozgatható
ábrákkal, a gyakorlat feladatai lépésenként kidolgozva, kalkulátorok és
véletlenszerűen generált gyakorlófeladatok.

## Állapot

| Modul | Tartalom | Állapot |
| --- | --- | --- |
| Bevezetés | útmutató, jelölések (tankönyvi írásmód), jobbkezes koordináta-rendszer (3D), mértékegységek, kerekítő | kész |
| 1. Vektorok, erők megadása | komponensek, vektorműveletek, erőrendszerek fajtái, egyenértékűségi kijelentés, skaláris és vektoriális szorzat, egyensúly, térbeli vektorok | kész |
| 2. Nyomaték, eredő, redukálás | forgatónyomaték pontra és tengelyre, erőpár és erőpárrá alakítás, dinámrendszer redukálása, az eredő esetei síkban és térben (erőcsavar) | kész |
| 3. Megoszló erők | megoszló erők fajtái, vonal- és felületmenti teher, terhelési test, felbontás, ferde és ívmenti teher, víznyomás | kész |
| 4. Súlypont | statikai nyomaték és eltolása, alapidomok, részekre bontás, kivonásos módszer, köríves idomok | kész |
| 5. Egyszerű tartók reakciói | kényszerek és fokszámuk, elkülönítés, egyensúlyi kijelentés, egyismeretlenes egyenletek (főpont), kéttámaszú tartó, konzol, rúddal / három rúddal megtámasztott tartó, grafikus megoldás | kész |
| Útvonal (/utvonal) | 13 hétre bontott tanulási útvonal: tankönyv-fejezet, modul, H-feladatsor, haladás; a vizsgaminta öt típusa | kész |
| Zh-szimulátor (/zh) | 4 véletlen feladat órával, pontozás, mentett előzmények | kész |
| Puska (/puska) | nyomtatható összefoglaló modulonként (6 lap) + „a tankönyv nyelve” | kész |

Minden modulban: elmélet interaktív felfedezőkkel, kidolgozott feladatok filmmel (2D/3D), kalkulátorok,
**játék**, fogalmi kvíz, hibakereső és 12–14 gyakorló feladattípus. A haladás (feladatok, kvíz, játék)
a böngészőben tárolódik és a kezdőlapon látszik.

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
    zh/page.js             zh-szimulátor
    puska/page.js          nyomtatható puska (print-CSS a globals.css-ben)
    globals.css            színrendszer, sötét mód felülírások, nyomtatási stílus
  components/
    SiteHeader.js          felső navigáció, mobil menü
    SiteFooter.js          lábléc
    ModulKeret.js          modulfejléc és ragadós szakasznavigáció
    KidolgozottFeladat.js  lépésenként feltárható mintapélda
    GyakorloDoboz.js       általános gyakorlófeladat-motor (+ konfetti 5 egymás utáni jó megoldás után)
    Kviz.js                fogalmi kvíz (feleletválasztós, magyarázattal)
    Hibakereso.js          hibás megoldásban a hibás lépés megjelölése
    SotetKapcsolo.js       sötét mód kapcsoló (localStorage: statika-tema)
    NyomtatasGomb.js       window.print() gomb a puska oldalon
    ui/Konfetti.js         canvas-konfetti
    zh/ZhSzimulator.js     a zh-szimulátor (a modulok GENERATOROK / EXTRA_GENERATOROK exportjait használja)
    <modul>/KvizAdatok.js  a modul kvízkérdései (KVIZ) és hibakereső feladatai (HIBAK)
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
      FilmGyf3.js          film: a hiányzó erő, a vektorsokszög bezárul
      GyakorloExtra.js     további 4 feladattípus (hatásvonal, szög, poláris eredő, kötélerők)
    nyomatek/
      GyakorloSzekcio.js   a 2. modul feladatgenerátorai
      FilmGyf2.js          film: négy párhuzamos erő
      FilmGyf3.js          film: redukálás az origóra, az eredő hatásvonala
      FilmGyf4.js          film: a három eset (erőpár, erőpár, egyetlen erő)
      GyakorloExtra.js     további 4 feladattípus (ferde erő, átszámítás, tengelymetszet, erő+erőpár)
    megoszlo/
      GyakorloSzekcio.js   a 3. modul feladatgenerátorai
      FilmGyf1.js          film: a trapéz teher eredője
      FilmGyf2.js          film: váltakozó irányú szakaszok
      FilmGyf3.js          film: a fűrészfog eredője
      GyakorloExtra.js     további 4 feladattípus (víznyomás, ferde rúd, trapéz+erő, fordított)
    sulypont/
      GyakorloSzekcio.js   a 4. modul feladatgenerátorai
      FilmGyf4.js          film: a T-szelvény súlypontja mérleggel
      FilmGyf5.js          film: kivonás – S elvándorol a lyuktól
      FilmGyf6.js          film: negyedkör ki, negyedkör be
      GyakorloExtra.js     további 4 feladattípus (aszimm. I, U, kör-lyuk, háromszög csúcsokkal)
    harom/
      Jelenet3D.js         Three.js (react-three-fiber) építőelemek: Nyil3D, Vonal3D, Cimke3D, tengelyek, rács
      Film3D.js            a 3D filmek böngészőoldali (ssr: false) betöltője
      FilmTerbeliOsszeg.js 3D film: három térbeli vektor összege
      FilmVektorSzorzat.js 3D film: r × F, a sík és a merőleges nyomatékvektor
      FilmHasab.js         3D film: hat erő a hasáb élein
      FilmTeherLepel.js    3D film: a trapéz teher lepele egy erővé húzódik össze
      FilmKeresztmetszet.js 3D film: a T-szelvény kihúzva gerendává, súlyponti tengely
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

**Új kvízkérdés / hibakereső:** a modul `KvizAdatok.js` fájljában a `KVIZ`
(`{ k, v: [4 válasz], helyes: index, magyarazat }`) és a `HIBAK`
(`{ cim, feladat, lepesek: [{ szoveg, hibas?, javitas? }], tanulsag }`) tömbbe
kell felvenni egy elemet. A zh-szimulátor automatikusan látja az új
gyakorlófeladat-generátorokat, ha a modul `GENERATOROK` / `EXTRA_GENERATOROK`
tömbjébe is bekerülnek.

**Sötét mód:** a `globals.css` végén réteg nélküli `.dark …` felülírások vannak
a leggyakoribb utility-osztályokra; az ábrapanelek (`racs-vilagos`) világosak
maradnak. Új színosztály használatakor érdemes ott is felvenni.

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

## 5. kör: a tankönyvhöz igazítás és a játékok

- **Tankönyvi írásmód**: minden kidolgozott feladat első lépése az egyenértékűségi / egyensúlyi kijelentés
  (`\ekv`), az egyenletek `ΣF_ix →:`, `ΣM_iO ↶:` alakban (KaTeX-makrók a `Keplet.js`-ben: `\Fx`, `\Fy`,
  `\Fz`, `\Fle`, `\Mp{O}`, `\Mj{O}`, `\ekv`).
- **`TankonyvJel`** (lila „A tankönyvben így” doboz) és **`Szotar`** (jelölés-szótár) az `ui/Elemek.js`-ben.
- **Játékok** (`ui/JatekKeret.js` keret, konfetti 80+ pontnál): `vektorok/JatekEgyensuly` (zárd be a
  sokszöget), `nyomatek/JatekMerleg` (hova tedd az erőt), `megoszlo/JatekEredo` (hol az eredő),
  `sulypont/JatekSulypont` (súlypont-találó, a tűre ültetett idom billen).
- **Haladás**: `lib/haladas.js` (localStorage `statika-haladas`), a `GyakorloDoboz`, a `Kviz` és a
  `JatekKeret` írja, a kezdőlap `HaladasKartyak` mutatja.
- **Új felfedezők**: `harom/JobbkezFelfedezo` (3D), `vektorok/VektorMuveletFelfedezo`,
  `SkalarisSzorzatFelfedezo`, `DeterminansAnimacio`, `VektorsokszogEpito`; `nyomatek/ErroparAlakito`,
  `harom/TengelyNyomatekFelfedezo` (3D), `abrak/TerbeliEredoOsztalyozo`; `megoszlo/OnsulySzamolo`,
  `FerdeTeherFelfedezo`, `GatFelfedezo`, `harom/TeherLepelFelfedezo` (3D); `sulypont/EltolasFelfedezo`,
  `SulypontTablazat`; `abrak/Kerekito`.
- **Új kidolgozott feladatok a tankönyv példáiból**: GYF‑A/B a 2. modulban (3.7. ábra: M = −24 kNm
  négyféleképpen; 3.10. ábra: dinámrendszer négy esete) és a 3. modulban (3.22: félkörív; 3.23: ferde
  gát), mindegyik filmmel.

## 6. kör: 5. modul és az útvonal

- `src/components/tartok/TartoElemek.js` – közös SVG rajzelemek a tartókhoz (támaszjelek a tankönyv szerint, terhek,
  reakciók, méretvonalak); `TartoRajz` (`tartok/GyakorloExtra.js`) méterben megadott geometriából rajzol.
- Felfedezők: `KenyszerSzotar` (told el / forgasd: szabad vagy gátolt), `SzabadtestEpito` (támaszok leemelése,
  reakciónyilak felrakása), `EgyenletValaszto` (pontra kattintva hány ismeretlen marad; főpontok), `ReakcioFelfedezo`,
  `ReakcioKalk` (általános 3×3 megoldó, tankönyvi kiírással).
- GYF‑1…6 a H03/H04 szintemelő feladatokból számokkal (`tartok/Gyf.js`), mindegyik filmmel (`FilmGyf1…6`).
- Játék: `JatekReakcio` (tippeld meg a reakciókat, a tartó billen/süllyed). 9 generátor, 12 kvíz, 5 hibakereső.
- `/utvonal`: `lib/utvonal.js` (HETEK, VIZSGA_TIPUSOK), `components/Utvonal.js` (hét-választó, idővonal, haladás).
- A zh-szimulátor öt feladatot ad (a tartók modulból is), és kirajzolja a feladat ábráját.

## 9. kör: 6–7. modul, hibanapló

- **6. modul – Összetett tartók** (`/osszetett`, `src/components/osszetett/`): belső csukló, elkülönítés, Gerber, háromcsuklós,
  terhelt csukló, függesztőmű; szétszedő animáció, sorrend-választó, háromcsuklós teher-vándoroltató, Gerber csuklóhely-csúszka;
  6 GYF (3 filmmel), kalkulátor levezetéssel (a `lib/tarto/levezetes` lépéseivel), 9 generátor, „Szedd szét és számold” játék, 13 kvíz, 6 hibakereső.
- **7. modul – Rácsos tartók** (`/racsos`, `src/components/racsos/`, saját megoldó `src/lib/racsos.js`: csomóponti módszer,
  vakrudak, hármas/négyes átmetszés, 593 ellenőrzés a merevségi motorral): erőáramlás, csomóponti hullám, átmetsző vonal húzása;
  7 GYF (3 filmmel), kalkulátor 7 tartótípussal, 9 generátor, vakrúd-vadász játék, 15 kvíz, 6 hibakereső.
- **Hibanapló** (`/hibanaplo`, `src/lib/hibanaplo.js`, `components/Hibanaplo.js`): a gyakorló dobozok, kvízek, hibakeresők és a
  játékok rögzítik a rontásokat (localStorage `statika-hibanaplo`), az oldal modulonként listázza és „Ismételd a hibáidat” módban
  újra felteszi őket (két sikeres ismétlés után javítva); `src/lib/generatorok.js` a közös generátor/kvíz/hibakereső-jegyzék.
- Bekötések: útvonal (5–7. hét, vizsgatípusok), zh-szimulátor 7 feladattal (30/45/60 perc), puska 7–8. lap, a 8–10. modul
  „hamarosan” oldalai, fejléc: a modulok számozott gombokkal (csak az aktív felirata látszik), `fokszamMerleg` testszámlálás javítva.

## 15. kör: ellenőrző kör, 2. ütem — 1–4. modul tételes átnézése

- Két ügynök (1–2. és 3–4. modul): minden statikus ábra, film-képkocka, felfedező (szélső beállításokkal is), generátor (300–500 futás)
  és kvíz újraszámolva és képen ellenőrizve. Tartalmi javítások: az „egyensúly három erővel” ábra erői nem voltak egyensúlyban;
  a térbeli nyomaték-ábrán az M nem volt merőleges r és F síkjára; a megoszló GYF‑1 szövege és filmje fordítva nevezte a részeredőket;
  a kivonásos súlypont-ábrán S a lyuk belsejébe esett; a súlypont GYF‑6 statikai nyomatéka kerekítési eltéréssel; egy hibakereső
  fordított forgásiránya; a szakaszos teher-kalkulátor és több felfedező a viewBoxon kívülre rajzolt szélső értékeknél; tucatnyi
  levágott/egymásra írt felirat a filmekben; generátorok elfajult esetei (0 erő, −0, egy egyenesbe eső csúcsok, Ry = 0).

## 14. kör: ellenőrző kör — N/V ábrák a nyomaték oldalára, eltűnt vonalak, 5–6–9. modul tételes átnézése

- **Rajzszabály (tankönyv 8.3.2., 8.9. ábra):** mindhárom igénybevételi ábra a rúd ugyanazon pozitív oldalára kerül — arra,
  amelyiket a nyomaték pozitív definíciójához választottunk (vízszintes tartónál alulra). Eddig az N és a V a másik oldalra
  került. Közös helyen javítva (`Diagram.js` `pozitivIrany`, `TartoKalkulator`, `FeladatRajz`, ábrarajzoló játék, alakkvíz,
  tartóépítő), „+ / −” oldaljel minden diagramon, a szövegek/kvíz/puska/hibakereső ehhez igazítva.
- **Eltűnő rúd- és nyílvonalak:** a `"use client"` `TartoElemek.js`-ből szerver-komponensbe importált `SZIN` objektum a szerveren
  csak kliens-hivatkozás volt (`SZIN.tarto` undefined → stroke nélküli vonalak); ezért látszottak félkésznek a statikus ábrák.
  A színek a `tartok/szinek.js` sima modulba kerültek; szerver-komponensben csak onnan importálandók.
- 5–6. modul: minden film képkockánként, minden ábra/felfedező/generátor a motorral újraszámolva; javítva többek közt a terhelt
  csukló ereje a `Szetszedo`/`JatekSzetszed` rajzán, fordított F-nyilak (GYF‑5, rudas csukló ábra), a kalkulátor rúdvonalba eső
  reakciónyilai, kilógó keretek a filmekben, méretlánc-hibák a generátorokban. 9. modul: 7 elméleti ábra kiegészítve/újrarajzolva
  (ferde konzol K₇, parabola-recept, konzol kívülről, sarok-példák, elágazás nyilai), GYF-ábrák szögjelekkel és szélsőérték-gyűrűkkel,
  a filmek fejezetei a K helyéhez időzítve, globális x a K-kiírásban.

## 13. kör: Tartóépítő és ábrarajzoló (`/epito`)

- Önálló gyakorló eszköz: a hallgató **maga épít** tetszőleges síkbeli tartót (rácsos vászon: csomópontok, rudak – ferde is –,
  belső csuklók, görgő/csukló/befogás, erők, nyomatékok, megoszló terhek; visszavonás, sablonok, véletlen tartó három nehézségen,
  mentés a „Saját tartóim” közé, megosztás `#m=<base64url>` linkkel), majd **ő rajzolja meg** rá a V, M (és N) ábrát fogópontokkal,
  a rúdra merőlegesen (keretnél is), alakválasztóval és szélsőérték-fogóponttal; opcionálisan a reakciókat is tippeli.
- Ellenőrzés a motorral (`src/lib/epito/ellenorzes.js`): 13 hibakód konkrét, tanító üzenettel (érték, előjel, hiányzó/rossz/
  fölösleges ugrás, M ≠ 0 csuklóban, szabad vég, szélső támasz, alak, meredekség dM/dx = V, szélsőérték V = 0-nál, keret-sarok,
  reakció), pontozás súlyokkal és felső korláttal (a jó fogópontok aránya), három fokozatú segítség (hol → szabály → a pontos
  ábra ráúszik), korlátlan „Javítom”, „Megoldás és levezetés”. Kihívás mód `JatekKeret`-ben (5 kör, hibanapló).
- Tiszta logika `src/lib/epito/` (`modell.js` szerkesztő-állapot ⇄ motor-modell, `sablonok.js`, `veletlen.js`, `rajz.js`),
  teszt `node src/lib/epito/teszt-epito.mjs` (100 ellenőrzés). Komponensek `src/components/epito/`.

## 12. kör: 10. modul – Térbeli tartók

- `/terbeli`, `src/components/terbeli/` (axonometrikus SVG rajzok `Axono.js`/`TerbeliRajzok.js`, GYF, kalkulátorok, gyakorlás),
  3D jelenetek `src/components/harom/Terbeli*.js` (`TerbeliAlap.js` közös elemek statikai x-y-z koordinátákkal), számítómag
  `src/lib/terbeli.js` (6×6 megoldó, bakállvány, támasztórudak, befogott konzol, térbeli rácsos, N/V_y/V_z/T/M_y/M_z, visszahelyettesítés).
- 3D felfedezők: forgatható szabadtest-ábra (a befogás helyett a hat reakció animálva nő ki), bakállvány (piros/kék rudak ∝ |S|),
  térbeli konzol elvágása (hat komponens nyilakkal), térbeli rácsos csomópont; 7 GYF (H13/1–4, vizsgaminta 5.) 3 filmmel (2 db 3D);
  támasztórúd- és bakállvány-kalkulátor; „Melyik rúd húzott?” játék, 10 generátor, 15 kvíz, 6 hibakereső, puska-lap. Zh: 10 feladat.
- Ezzel a tankönyv mind a 9 fejezete és a vizsga mind az 5 feladattípusa fent van.

## 11. kör: 9. modul – Igénybevételi ábrák

- `/igenybevetel`, `src/components/igenybevetel/`, ábrák `src/components/abrak/IgenybevetelAbrak.js`; a diagramokat a motor
  (`src/lib/tarto`) számolja, a közös rajzoló a `Diagram.js` (M a húzott oldalra, töréspont-értékek, épülő ábra).
- Elmélet a tankönyv 8. fejezetére; felfedezők: `VagdEl` (húzható keresztmetszet, két szabadtest-ábra, a vágásig épülő ábrák),
  `QVMFelfedezo`, `ElojelFelfedezo`, `FerdeTarto`, `Szakaszolo`; 8 GYF (H09, vizsgaminta 2. és 4., tankönyv 8.7 Gerber) 4 filmmel
  (`FilmIgenybevetel` közös film-motor); beágyazott ábrakalkulátor + `MetszetKalk`.
- Gyakorlás: **ábrarajzoló játék** (`JatekAbrarajzolo`: fogópontokkal rajzolt V és M ábra, a pontos ráúszik és pontoz),
  alakhelyesség-kvíz (`AlakKviz`, H09-mintára, programozottan torzított hibás ábrák), 9 generátor, 17 kvíz, 7 hibakereső, puska-lap.
- `AbraIllesztes` és az ellenőrző szkriptek javítva: az elemek koordinátáit a viewBox rendszerébe kell vinni
  (`svg.getScreenCTM().inverse() × el.getScreenCTM()`), nem a viewportéba. Zh: 9 feladat.

## 10. kör: 8. modul – Statikai határozottság

- `/hatarozottsag`, `src/components/hatarozottsag/`, számítómag `src/lib/hatarozottsag.js` (e/i számlálás, r + k = 2c, kinematikai
  rangvizsgálat → szabad mozgások, fölös kényszerek, kritikus elrendezés, a nulltér = a mechanizmus mozgása az animációkhoz).
- Szerkezet-építő (támaszok/csuklók ki-be, élő mérleg, összecsuklás- vagy „megfeszülés”-animáció), kritikus elrendezés felfedező,
  rácsos ellenőrző, „Stabil vagy mozog?” játék; 7 GYF (3 filmmel, köztük a H04/5), határozottság-számláló kalkulátor, 9 generátor,
  14 kvíz, 6 hibakereső, puska-lap. Zh: 8 feladat.

## 7–8. kör: igénybevétel-számító motor és levezetés

- 7. kör: `src/lib/tarto/` (lásd lent), `/tartokalkulator` oldal a paraméteres sablonokkal, metszet-csúszkával.
- 8. kör: `levezetes.js` + `TartoLevezetes.js` — a kalkulátor lépésről lépésre le is vezeti a reakciókat
  a tankönyv nyelvén (a gyakorlaton elvárt formában), és kiírja a szakaszonkénti igénybevételi függvényeket.

## Igénybevétel-számító motor (`src/lib/tarto/`)

Önálló, a webhely komponenseitől független számítómag — ha később külön alkalmazás lesz belőle,
lényegében másolás. Síkbeli rúdszerkezetek megoldása elmozdulásmódszerrel (merevségi mátrix),
a kényszerek Lagrange-multiplikátorral, így a ferde görgő és a támasztórúd is egzakt.
Statikailag határozott szerkezetnél az eredmény nem függ az EI/EA értékétől; határozatlanra
ugyanez a kód működik.

| Fájl | Mit csinál |
| --- | --- |
| `matrix.js` | lineáris megoldó sorskálázott főelem-kiválasztással, inverz, rang |
| `polinom.js` | szakaszonkénti polinomok: érték, derivált, gyökök, szélsőértékek |
| `modell.js` | modell normalizálása, terhek lokálissá alakítása, fokszám-mérleg |
| `megold.js` | merevségi mátrix, konzisztens tehervektor, csuklós végek kondenzálása, megoldás |
| `igenybevetel.js` | N, V, M szakaszonként **egzakt** polinomként (nem mintavételezés) |
| `sablonok.js` | paraméteres szerkezet-sablonok a kalkulátorhoz |
| `levezetes.js` | **levezetés-réteg**: a tankönyv receptje szerinti, emberi nyelvű levezetés (elkülönítés → egyensúlyi kijelentés → egyismeretlenes egyenletek főpontokkal, több merev testnél az egész szerkezetre és testenként → ellenőrző egyenlet → eredményvázlat), valamint szakaszonként az N(x), V(x), M(x) függvények KaTeX-ben |
| `index.js` | `elemez(modell)` — reakciók, igénybevételek, egyensúly-ellenőrzés |

Előjelek a tankönyv 8.1.2.2. pontja szerint: N pozitív, ha húz; a pozitív V a pozitív N irányának
óramutató szerinti 90°-os elforgatása; a nyomatéki ábra a **húzott oldalra** kerül.

**Tesztek** (zárt képlettel ismert eredmények + az 5. modul kidolgozott feladatai):

```bash
cd src/lib/tarto && node teszt-alap.mjs && node teszt-szerkezetek.mjs && node teszt-levezetes.mjs
```

84 ellenőrzés: kéttámaszú/konzol/konzolos tartó, háromszög- és trapézteher, koncentrált nyomaték,
Gerber-tartó, háromcsuklós tartó, keret, ferde rúd, vetületre megadott teher, támasztórúd,
kétoldalt befogott és bebetonozott-görgős tartó (statikailag határozatlan: qL²/12, qL²/24,
3qL/8, 9qL²/128), a `dM/dx = V` összefüggés, valamint a hibás szerkezetek felismerése
(három párhuzamos görgő, egy ponton átmenő hatásvonalú három rúd).

A levezetés-réteg a reakciókat **az egyensúlyi egyenletekből** számolja, a motor pedig a merevségi
módszerrel — két független út, amelynek egyeznie kell. `teszt-levezetes.mjs` ezt ellenőrzi minden
sablonra (alapértékek + véletlen paraméterek), a modul‑5 feladataira, és minden kiírt képletet
lefordít KaTeX-szel (~1200 ellenőrzés). Statikailag határozatlan szerkezetnél a levezetés
kimondja, hogy az egyensúlyi egyenletek elfogytak, és a hiányzó értékeket a motortól veszi át.

A felület: `/tartokalkulator` (`src/components/tarto/TartoKalkulator.js`, a levezetés-panel
`TartoLevezetes.js`: lépésenként felfedhető, az aktuális lépés főpontját a rajzon is kiemeli).

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

Next.js (App Router) · React · Tailwind CSS · KaTeX · Three.js
(react-three-fiber + drei, csak a 3D jeleneteknél, böngészőoldalon betöltve).
Nincs adatbázis és nincs szerveroldali logika: az egész oldal statikusan
előrenderelhető, a gyakorlófeladatok a böngészőben generálódnak.

A filmek (2D és 3D) ugyanazt a `FeladatFilm` keretet használják: a `rajz(t)`
függvény a t másodperchez tartozó képet adja vissza — SVG-t vagy Three.js
jelenetet.
