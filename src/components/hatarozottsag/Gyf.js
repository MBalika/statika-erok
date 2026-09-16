import { AbraKeret } from "@/components/ui/Elemek";
import { M, MB } from "@/components/ui/Keplet";
import { KidolgozottFeladat, Lepes } from "@/components/KidolgozottFeladat";
import { AbraGyf1, AbraGyf2, AbraGyf3, AbraGyf4, AbraGyf6, AbraGyf7 } from "@/components/hatarozottsag/FeladatAbrak";
import { AbraRacsos } from "@/components/abrak/HatarozottsagAbrak";
import FilmGyf1 from "@/components/hatarozottsag/FilmGyf1";
import FilmGyf3 from "@/components/hatarozottsag/FilmGyf3";
import FilmGyf5 from "@/components/hatarozottsag/FilmGyf5";

/**
 * A 8. modul kidolgozott feladatai (GYF‑1…GYF‑7): a tankönyv 7.4–7.11. ábrái és a H04/5 feladat.
 * Minden feladat ugyanazt a receptet követi: testek → külső kényszerek → belső kényszerek → mérleg (e, i)
 * → geometriai ellenőrzés (egyismeretlenes menetrend / lefejtés / kritikus elrendezés) → ítélet.
 * A számokat a src/lib/tarto számítómag és a src/lib/hatarozottsag rangvizsgálata ellenőrizte.
 */

const FilmCim = ({ children }) => <h3 className="mt-4 mb-2 text-[13px] font-semibold text-petrol-500 uppercase tracking-wider">{children}</h3>;

export default function GyfBlokkok() {
  return (
    <>
      {/* ==================== GYF‑1 ==================== */}
      <KidolgozottFeladat
        jel="GYF‑1"
        ido="5 perc"
        forras="Tankönyv 7.4.b és 7.7.a ábra"
        cim="Három görgő a gerendán — ugyanaz a számlálás, két különböző ítélet"
        feladat={
          <p>
            Egy <M>{"6\\ \\text{m}"}</M> hosszú gerendát három görgő támaszt: <M>{"A"}</M> a bal végen, <M>{"B"}</M> a közepén, <M>{"C"}</M> a jobb végen. a) Az <M>{"A"}</M> görgő <M>{"45^\\circ"}</M>-os ferde síkon gördül, <M>{"B"}</M> és <M>{"C"}</M> vízszintes síkon. b) Mindhárom görgő vízszintes síkon gördül. Döntsd el mindkét
            szerkezetről, tartó-e, és ha igen, milyen! Próbateher: <M>{"F = 10\\ \\text{kN}"}</M> lefelé <M>{"x = 4{,}5\\ \\text{m}"}</M>-nél és <M>{"H = 2\\ \\text{kN}"}</M> balra a gerenda tengelyében.
          </p>
        }
        abra={
          <AbraKeret cim="a) A ferde görgő reakciója 45°-os; b) mindhárom reakció függőleges. A számlálás mindkét esetben 3 = 3 — az ítélet mégis különbözik.">
            <AbraGyf1 />
          </AbraKeret>
        }
        tanulsag={
          <p>
            A számlálás <strong>szükséges, de nem elégséges</strong> feltétel. Ugyanaz a három szám, ugyanaz a <M>{"3 = 3"}</M> — az egyik tartó, a másik nem. A döntést a <strong>geometria</strong> adja: van-e olyan mozgás, amit egyik kényszer sem gátol. Három párhuzamos hatásvonal a rájuk merőleges eltolódást nem
            gátolja; a tankönyv ökölszabálya (7.4.2): három vagy több párhuzamos reakcióból legfeljebb kettőt tartsunk meg.
          </p>
        }
      >
        <Lepes cim="Testek és egyenletek">
          <p>
            Egyetlen merev test, síkbeli szétszórt erőrendszerrel: <M>{"e = 3\\cdot 1 = 3"}</M> független egyensúlyi egyenlet.
          </p>
        </Lepes>
        <Lepes cim="Külső kényszerek → ismeretlenek">
          <p>
            Három görgő, mindegyik fokszáma 1 (ismert hatásvonalú, ismeretlen nagyságú erő): <M>{"i = 1 + 1 + 1 = 3"}</M>. Belső kényszer nincs.
          </p>
          <MB>{"e = i = 3\\quad\\Rightarrow\\quad\\text{lehet határozott (szükséges feltétel teljesül)}"}</MB>
        </Lepes>
        <Lepes cim="a) Geometriai ellenőrzés: egyismeretlenes menetrend">
          <p>
            A hatásvonalak: <M>{"A"}</M> ferde (<M>{"45^\\circ"}</M>), <M>{"B"}</M> és <M>{"C"}</M> függőleges. Páronként metszik egymást, közös pontjuk nincs. Menetrend, amelyben minden egyenletben egy új ismeretlen szerepel nemzérus együtthatóval: a vízszintes vetületi egyenletben csak <M>{"A"}</M>; a{" "}
            <M>{"B"}</M>-re írt nyomatéki egyenletben (az <M>{"A"}</M> már ismert) csak <M>{"C"}</M>; a függőleges vetületiben csak <M>{"B"}</M>. Ha ilyen menetrend létezik, az <M>{"e = i"}</M> egyenlőséggel együtt <strong>bizonyítja</strong> a határozottságot.
          </p>
          <MB>{"(\\underline{F}, \\underline{H}, \\underline{A}, \\underline{B}, \\underline{C}) \\ekv \\underline{O}"}</MB>
          <MB>{"\\Fx A\\cos 45^\\circ - 2 = 0\\ \\Rightarrow\\ A = 2{,}828\\ \\text{kN}"}</MB>
          <MB>{"\\Mp{B} -10\\cdot 1{,}5 - A\\sin 45^\\circ\\cdot 3 + C\\cdot 3 = -15 - 6 + 3\\,C = 0\\ \\Rightarrow\\ C = 7{,}000\\ \\text{kN}"}</MB>
          <MB>{"\\Fy A\\sin 45^\\circ + B + C - 10 = 2 + B + 7 - 10 = 0\\ \\Rightarrow\\ B = 1{,}000\\ \\text{kN}"}</MB>
          <p>
            Ellenőrzés: <M>{"\\Mp{A} -10\\cdot 4{,}5 + 1\\cdot 3 + 7\\cdot 6 = 0{,}0\\ \\checkmark"}</M>. Egy teherre egyértelmű megoldás + <M>{"e = i"}</M> → <strong>statikailag határozott tartó</strong>.
          </p>
        </Lepes>
        <Lepes cim="b) Geometriai ellenőrzés: párhuzamos hatásvonalak">
          <p>
            Mindhárom reakció függőleges. Ha két reakciót ki akarunk zárni, a vízszintes vetületi egyenletet kell felírni — de abban a harmadik sem szerepel:
          </p>
          <MB>{"\\Fx -2 = 0\\quad\\text{ellentmondás: vízszintes teherre nincs egyensúly}"}</MB>
          <p>
            Ha csak függőleges teher hat, az egyensúly biztosítható, de a maradék két egyenletből három reakció közül csak kettő számítható a harmadik függvényében: az egyik reakció <strong>fölös</strong>. A szerkezet tehát <strong>határozatlan és túlhatározott</strong> — a számlálás szerint{" "}
            <M>{"e - i = 3 - 3 = 0 = 1 - 1"}</M>: egy szabad mozgás és egy fölös kényszer különbsége.
          </p>
        </Lepes>
        <Lepes cim="Ítélet">
          <p>
            a) statikailag határozott tartó; b) kritikus elrendezés — nem tartó. Ugyanaz a <M>{"3 = 3"}</M>, más a geometria.
          </p>
        </Lepes>
      </KidolgozottFeladat>
      <FilmCim>Ugyanez filmen – a támaszok bejönnek, a számláló nő, a végén kicsúszik</FilmCim>
      <FilmGyf1 />

      {/* ==================== GYF‑2 ==================== */}
      <KidolgozottFeladat
        jel="GYF‑2"
        ido="7 perc"
        forras="H04 szintemelő, 5. feladat"
        cim="Elkülönítés, egyensúlyi kijelentések, egyenlet- és ismeretlenszám — két rudas-csuklós szerkezet"
        feladat={
          <p>
            Készítsd el a szerkezetek elkülönítését, írd fel az egyensúlyi kijelentéseket, majd határozd meg a felírható egyenletek és az ismeretlenek számát! a) Alul befogott oszlop, tetején csuklóval kapcsolt ferde gerenda, amelyet egy támasztórúd köt az oszlop közepéhez; a gerenda végén <M>{"F"}</M>. b)
            Alul csuklós oszlop, tetején csuklóval kapcsolt gerenda, amelynek másik végét görgő tartja; a gerendát rúd köti az oszlophoz; a gerendán ferde <M>{"F"}</M>. Számokhoz: <M>{"a = 1{,}5\\ \\text{m}"}</M> (az oszlop <M>{"2a"}</M> magas), <M>{"F = 10\\ \\text{kN}"}</M>.
          </p>
        }
        abra={
          <AbraKeret cim="A H04/5 két szerkezete. A rúd két végén csuklós és terheletlen: egyetlen ismeretlent hoz (S). A csukló két kapcsolati erőt (Tₓ, Tᵧ), a befogás hármat, a görgő egyet.">
            <AbraGyf2 />
          </AbraKeret>
        }
        tanulsag={
          <p>
            A rúd <em>testként</em> is számolható (3 egyenlet, két csuklós vége 2 + 2 ismeretlen: nettó ugyanaz), de gyorsabb rúdként: egy ismeretlen, egyenlet nélkül. A számítómag (<code>elemez</code>) rúdként is testként is ugyanazt adja. A menetrend (melyik egyenletből melyik ismeretlen jön ki) nemcsak a
            számítást gyorsítja: a <strong>határozottság bizonyítéka</strong> is — ha egyismeretlenes egyenletek sorozata létezik, a szerkezet határozott (tankönyv 7.3.1, harmadik módszer).
          </p>
        }
      >
        <Lepes cim="a) Elkülönítés és egyensúlyi kijelentések">
          <p>
            Testek: az oszlop (I) és a gerenda (II); a rúd terheletlen, két végén csuklós, ezért rúd (ismeretlen: <M>{"S"}</M>, húzottnak felvéve). Az I. testre a befogás reakciói (<M>{"A_x, A_y, M_A"}</M>), a csukló ellentett kapcsolati erői (<M>{"T'_x, T'_y"}</M>) és a rúderő ellentettje (<M>{"S'"}</M>) hat;
            a II. testre <M>{"F"}</M>, <M>{"T_x, T_y"}</M> és <M>{"S"}</M>.
          </p>
          <MB>{"\\text{I: } (\\underline{A}_x, \\underline{A}_y, M_A, \\underline{T}'_x, \\underline{T}'_y, \\underline{S}') \\ekv \\underline{O},\\qquad \\text{II: } (\\underline{F}, \\underline{T}_x, \\underline{T}_y, \\underline{S}) \\ekv \\underline{O}"}</MB>
        </Lepes>
        <Lepes cim="a) Egyenletek és ismeretlenek">
          <MB>{"e = 3\\cdot 2 = 6,\\qquad i = \\underbrace{3}_{\\text{befogás}} + \\underbrace{2}_{\\text{csukló } T} + \\underbrace{1}_{\\text{rúd } S} = 6"}</MB>
          <p>
            <M>{"e = i"}</M>: lehet határozott. Geometria: a rúd hatásvonala nem megy át a <M>{"T"}</M> csuklón (különben a gerenda <M>{"T"}</M> körül elfordulhatna). Menetrend: II: <M>{"\\Mp{T}\\to S"}</M>, <M>{"\\Fx\\to T_x"}</M>, <M>{"\\Fy\\to T_y"}</M>; I: <M>{"\\Fx\\to A_x"}</M>, <M>{"\\Fy\\to A_y"}</M>,{" "}
            <M>{"\\Mp{A}\\to M_A"}</M>. Hat egyismeretlenes egyenlet → <strong>határozott</strong>. (Számokkal, <M>{"T = (0;\\,3)"}</M>, a rúd a <M>{"Q = (-1{,}5;\\,2{,}25)"}</M> és <M>{"R = (0;\\,1{,}5)"}</M> pontok közt:{" "}
            <M>{"\\Mp{T} 10\\cdot 3 + 1{,}342\\,S = 0 \\Rightarrow S = -22{,}36"}</M> kN nyomott; <M>{"T_x = 20{,}00"}</M>, <M>{"T_y = 0"}</M>; <M>{"A_x = 0"}</M>, <M>{"A_y = 10{,}00"}</M> kN, <M>{"M_A = -30{,}00"}</M> kNm.)
          </p>
        </Lepes>
        <Lepes cim="b) Elkülönítés és egyensúlyi kijelentések">
          <p>
            Testek: oszlop (I) az <M>{"A"}</M> csuklóval, gerenda (II) a <M>{"B"}</M> görgővel; közöttük a <M>{"T"}</M> csukló és az <M>{"S"}</M> rúd.
          </p>
          <MB>{"\\text{I: } (\\underline{A}_x, \\underline{A}_y, \\underline{T}'_x, \\underline{T}'_y, \\underline{S}') \\ekv \\underline{O},\\qquad \\text{II: } (\\underline{F}, \\underline{T}_x, \\underline{T}_y, \\underline{S}, \\underline{B}) \\ekv \\underline{O}"}</MB>
        </Lepes>
        <Lepes cim="b) Egyenletek és ismeretlenek">
          <MB>{"e = 3\\cdot 2 = 6,\\qquad i = \\underbrace{2}_{A} + \\underbrace{1}_{B} + \\underbrace{2}_{T} + \\underbrace{1}_{S} = 6"}</MB>
          <p>
            Menetrend: a két test együtt (Σ) egy merev testként viselkedik, mert a csukló + rúd (2 + 1 = 3) mereven köti őket — így Σ: <M>{"\\Mp{A}\\to B"}</M>; II: <M>{"\\Mp{T}\\to S"}</M>, <M>{"\\Fx\\to T_x"}</M>, <M>{"\\Fy\\to T_y"}</M>; I: <M>{"\\Fx\\to A_x"}</M>, <M>{"\\Fy\\to A_y"}</M>. A{" "}
            <M>{"B"}</M> görgő függőleges hatásvonala nem megy át <M>{"A"}</M>-n → <strong>határozott</strong>. (Számokkal: <M>{"B = 9{,}107"}</M>, <M>{"S = 11{,}18"}</M> kN húzott, <M>{"T_x = 5{,}000"}</M>, <M>{"T_y = 4{,}553"}</M>, <M>{"A_x = -5{,}000"}</M>, <M>{"A_y = -0{,}447"}</M> kN.)
          </p>
        </Lepes>
        <Lepes cim="Ítélet">
          <p>Mindkét szerkezet statikailag határozott tartó: 6 egyenlet, 6 ismeretlen, és mindkettőre létezik egyismeretlenes menetrend.</p>
        </Lepes>
      </KidolgozottFeladat>

      {/* ==================== GYF‑3 ==================== */}
      <KidolgozottFeladat
        jel="GYF‑3"
        ido="6 perc"
        forras="Tankönyv 7.3.2.2 (Gerber-tartó) nyomán"
        cim="Gerber-tartó — hol lehet a két csukló?"
        feladat={
          <p>
            Egy <M>{"12\\ \\text{m}"}</M> hosszú gerendát az <M>{"A"}</M> csukló (<M>{"x = 0"}</M>) és a <M>{"B, C, D"}</M> görgők (<M>{"x = 4, 8, 12\\ \\text{m}"}</M>) támasztanak. a) Két belső csukló van, <M>{"G_1"}</M> a 6 m, <M>{"G_2"}</M> a 10 m helyen. b) Mindkét csukló az első mezőben van:{" "}
            <M>{"G_1 = 1{,}5"}</M>, <M>{"G_2 = 3\\ \\text{m}"}</M>. Vizsgáld meg a határozottságot, és a) esetben számítsd ki a reakciókat <M>{"F_1 = 12\\ \\text{kN}"}</M> (<M>{"x = 2"}</M>) és <M>{"F_2 = 6\\ \\text{kN}"}</M> (<M>{"x = 11"}</M>) teherre!
          </p>
        }
        abra={
          <AbraKeret cim="a) A csuklók a 2. és 3. mezőben: minden rész lefejthető. b) A csuklók az 1. mezőben: A, G₁, G₂ egy egyenesbe esik.">
            <AbraGyf3 />
          </AbraKeret>
        }
        tanulsag={
          <p>
            Összetett tartónál a legjobb eszköz a <strong>lefejtés</strong>: egy csuklóval és egy görgővel (2 + 1) megtámasztott befüggesztett rész levehető, ha a görgő hatásvonala nem megy át a csuklón; ami marad, azt vizsgáljuk tovább. A b) eset ugyanazzal a számlálással (9 = 9) mechanizmus, mert három
            csukló — <M>{"A, G_1, G_2"}</M> — egy egyenesbe esik: az I. test <M>{"A"}</M> körül, a II. <M>{"G_2"}</M> körül elfordulhat.
          </p>
        }
      >
        <Lepes cim="Testek, külső és belső kényszerek">
          <MB>{"e = 3\\cdot 3 = 9,\\qquad i = \\underbrace{2 + 1 + 1 + 1}_{\\text{külső: } A, B, C, D} + \\underbrace{2 + 2}_{G_1, G_2} = 9"}</MB>
          <p>
            Mindkét változatban ugyanez: <M>{"e = i"}</M>, lehet határozott.
          </p>
        </Lepes>
        <Lepes cim="a) Lefejtés">
          <p>
            III (<M>{"G_2"}</M>–<M>{"D"}</M>): csukló + görgő, <M>{"D"}</M> függőleges hatásvonala nem megy át <M>{"G_2"}</M>-n → határozott, levehető; ami <M>{"G_2"}</M>-ben hat, teherként adódik át. II (<M>{"G_1"}</M>–<M>{"C"}</M>–<M>{"G_2"}</M>): csukló + görgő → ugyanígy. I (<M>{"A"}</M>–<M>{"B"}</M>–
            <M>{"G_1"}</M>): kéttámaszú tartó. <strong>Határozott.</strong>
          </p>
        </Lepes>
        <Lepes cim="a) Reakciók a lefejtés sorrendjében">
          <MB>{"\\text{III: } \\Mp{G_2} -6\\cdot 1 + 2\\,D = 0 \\Rightarrow D = 3{,}000;\\quad \\Fy G_{2} = 6 - 3 = 3{,}000\\ \\text{kN}"}</MB>
          <MB>{"\\text{II: } \\Mp{G_1} -3\\cdot 4 + 2\\,C = 0 \\Rightarrow C = 6{,}000;\\quad \\Fy G_{1} + 6 - 3 = 0 \\Rightarrow G_{1} = -3{,}000\\ \\text{kN}"}</MB>
          <p>
            <M>{"G_1 < 0"}</M>: a II. testet a csuklóban <em>lefelé</em> kell tartani, tehát az I. testre <M>{"G_1"}</M>-ben <strong>felfelé</strong> 3 kN hat.
          </p>
          <MB>{"\\text{I: } \\Mp{A} -12\\cdot 2 + 4\\,B + 3\\cdot 6 = 0 \\Rightarrow B = 1{,}500;\\quad \\Fy A_y + 1{,}5 + 3 - 12 = 0 \\Rightarrow A_y = 7{,}500\\ \\text{kN}"}</MB>
          <p>
            Ellenőrzés az egész tartóra: <M>{"\\Fy 7{,}5 + 1{,}5 + 6 + 3 - 12 - 6 = 0\\ \\checkmark"}</M>. Egy teherre egyértelmű megoldás + <M>{"e = i"}</M>: határozott.
          </p>
        </Lepes>
        <Lepes cim="b) Geometriai ellenőrzés">
          <p>
            Az I. test (<M>{"A"}</M>–<M>{"G_1"}</M>) csak az <M>{"A"}</M> csuklóval és a <M>{"G_1"}</M> csuklóval kapcsolódik; a II. test (<M>{"G_1"}</M>–<M>{"G_2"}</M>) két csuklóval. A három csukló egy egyenesen fekszik: az I. test <M>{"A"}</M> körül elfordulhat úgy, hogy a II. test <M>{"G_2"}</M> körül
            visszafordul — a <M>{"G_1"}</M> pont az egyenesre merőlegesen elmozdul, és ezt egyik kényszer sem gátolja. Szabad mozgás: 1. Ugyanakkor a III. test (<M>{"G_2"}</M>–<M>{"D"}</M>) három görgőn áll (<M>{"B, C, D"}</M>) + csukló: egy kényszer fölös. <strong>Határozatlan és túlhatározott</strong> — pedig{" "}
            <M>{"e = i = 9"}</M>.
          </p>
        </Lepes>
        <Lepes cim="Ítélet">
          <p>a) statikailag határozott Gerber-tartó; b) kritikus elrendezés (egy egyenesbe eső három csukló), nem tartó.</p>
        </Lepes>
      </KidolgozottFeladat>
      <FilmCim>Ugyanez filmen – támaszok, csuklók, lefejtés, aztán a csuklók rossz helyre kerülnek</FilmCim>
      <FilmGyf3 />

      {/* ==================== GYF‑4 ==================== */}
      <KidolgozottFeladat
        jel="GYF‑4"
        ido="6 perc"
        forras="Tankönyv 7.3.2.2 (háromcsuklós tartó) nyomán"
        cim="Keretek — háromcsuklós, kétcsuklós, befogott, négycsuklós"
        feladat={
          <p>
            Egy <M>{"6\\ \\text{m}"}</M> fesztávú, <M>{"4\\ \\text{m}"}</M> magas keret négy változata: a) <M>{"A, B"}</M> csukló, belső csukló a gerenda közepén (<M>{"C"}</M>); b) <M>{"A, B"}</M> csukló, belső csukló nélkül; c) <M>{"A, B"}</M> befogás; d) <M>{"A, B"}</M> csukló és belső csukló mindkét
            sarokban. Osztályozd mind a négyet! Az a) esetben számítsd ki a reakciókat <M>{"F = 10\\ \\text{kN}"}</M> (lefelé, <M>{"x = 1{,}5\\ \\text{m}"}</M>) és <M>{"H = 6\\ \\text{kN}"}</M> (jobbra, a bal saroknál) teherre!
          </p>
        }
        abra={
          <AbraKeret cim="Négy keret, négy ítélet. A belső csukló mindig +3 egyenletet és +2 ismeretlent hoz — az egyenleg 1-gyel csökken.">
            <AbraGyf4 />
          </AbraKeret>
        }
        tanulsag={
          <p>
            Minden belső csukló <strong>eggyel csökkenti</strong> a határozatlanság fokát (+3 egyenlet, +2 ismeretlen). A kétcsuklós keret (egyszeresen határozatlan) egyetlen csuklóval határozottá tehető, a befogott (háromszorosan) hárommal — de a csuklók helye nem mindegy: ha a három csukló egy egyenesbe
            esne (pl. <M>{"C"}</M> a talajszinten), a keret <M>{"A"}</M> és <M>{"B"}</M> körül összecsuklana (7.8.a ábra). Négy csukló egy zárt keretben mindig mechanizmus: a „paralelogramma” eldől.
          </p>
        }
      >
        <Lepes cim="Számlálás mind a négy változatra">
          <MB>{"\\text{a) } e = 3\\cdot 2 = 6,\\ i = 2 + 2 + 2 = 6\\qquad \\text{b) } e = 3,\\ i = 2 + 2 = 4\\qquad \\text{c) } e = 3,\\ i = 3 + 3 = 6\\qquad \\text{d) } e = 3\\cdot 3 = 9,\\ i = 2 + 2 + 2 + 2 = 8"}</MB>
          <p>
            b) legalább egyszeresen, c) legalább háromszorosan határozatlan; d) legalább egy szabad mozgás — biztosan nem tartó; a) lehet határozott.
          </p>
        </Lepes>
        <Lepes cim="a) Geometriai ellenőrzés és egyensúlyi kijelentések">
          <p>
            A három csukló <M>{"A = (0;\\,0)"}</M>, <M>{"C = (3;\\,4)"}</M>, <M>{"B = (6;\\,0)"}</M> nem esik egy egyenesbe → határozott. Menetrend: az egész szerkezetre (Σ) az <M>{"A"}</M>-ra és <M>{"B"}</M>-re írt nyomatéki egyenletekből a függőleges komponensek; a II. testre <M>{"C"}</M>-re írt
            nyomatékiból <M>{"B_x"}</M>; végül Σ vízszintes vetületből <M>{"A_x"}</M>.
          </p>
          <MB>{"\\Sigma: (\\underline{F}, \\underline{H}, \\underline{A}, \\underline{B}) \\ekv \\underline{O},\\qquad \\text{II: } (\\underline{C}', \\underline{B}) \\ekv \\underline{O}"}</MB>
        </Lepes>
        <Lepes cim="a) Reakciók">
          <MB>{"\\Sigma\\ \\Mp{A} -10\\cdot 1{,}5 - 6\\cdot 4 + 6\\,B_y = 0 \\Rightarrow B_y = 6{,}500\\ \\text{kN}"}</MB>
          <MB>{"\\Sigma\\ \\Fy A_y + 6{,}5 - 10 = 0 \\Rightarrow A_y = 3{,}500\\ \\text{kN}"}</MB>
          <p>
            A II. testre (<M>{"C"}</M>–jobb sarok–<M>{"B"}</M>) csak a csuklóerő és <M>{"B"}</M> hat. <M>{"C"}</M>-re nézve a felfelé mutató <M>{"B_y"}</M> a ponttól 3 m-re jobbra hat: az óramutatóval ellentétesen forgat; a jobbra felvett <M>{"B_x"}</M> a pont alatt 4 m-rel: szintén ellentétesen. A
            csuklóerő karja nulla:
          </p>
          <MB>{"\\text{II: } \\Mp{C} 3\\cdot 6{,}5 + 4\\,B_x = 0 \\Rightarrow B_x = -4{,}875\\ \\text{kN (valójában balra)}"}</MB>
          <MB>{"\\Sigma\\ \\Fx A_x + 6 + B_x = 0 \\Rightarrow A_x = -1{,}125\\ \\text{kN}"}</MB>
          <p>
            Eredmény: <M>{"A = (-1{,}125;\\ 3{,}500)"}</M>, <M>{"B = (-4{,}875;\\ 6{,}500)"}</M> kN — a számítómag ugyanezt adja. Függőleges teherre is ébred vízszintes reakció: ez a háromcsuklós tartó sajátja.
          </p>
        </Lepes>
        <Lepes cim="b), c): a határozatlanság foka és a törzstartó">
          <p>
            b) <M>{"i - e = 1"}</M>: egyszeresen határozatlan; törzstartó: az egyik csuklót görgővé lazítjuk (<M>{"B_x"}</M> paraméter) vagy belső csuklót teszünk be (a nyomaték a paraméter). c) <M>{"i - e = 3"}</M>: háromszorosan határozatlan; három kényszer felszabadítása kell — pl. mindkét befogás
            csuklóvá + egy belső csukló, ez éppen az a) keret. A reakciók csak a rudak <strong>merevségével</strong> számíthatók (Szilárdságtan).
          </p>
        </Lepes>
        <Lepes cim="d): mechanizmus">
          <p>
            <M>{"e - i = 9 - 8 = 1"}</M> szabad mozgás: a két oszlop <M>{"A"}</M> és <M>{"B"}</M> körül azonosan elfordul, a gerenda vízszintes marad — a keret paralelogrammaként eldől (ugyanez a tankönyv 7.8.b ábrájának mozgása). Nem tartó.
          </p>
        </Lepes>
      </KidolgozottFeladat>

      {/* ==================== GYF‑5 ==================== */}
      <KidolgozottFeladat
        jel="GYF‑5"
        ido="6 perc"
        forras="Tankönyv 7.9 és 7.10. ábra"
        cim="Rácsos tartók: 2c = r + k — és amikor ez sem elég"
        feladat={
          <p>
            A tankönyv 7.9. ábrájának kétmezős rácsos tartója (6 csomópont, 9 rúd, csukló + görgő) és a 7.10. ábra változatai: a) az egyik átló hiányzik; b) a csukló helyett görgő; c) az egyik mezőben két átló (X); e) X-rács két görgőn; f) a jobb mező átlója helyett a bal mezőben második átló. Számold
            meg mindegyiken <M>{"c, r, k"}</M>-t, és döntsd el, tartó-e!
          </p>
        }
        abra={
          <AbraKeret cim="A tankönyv 7.9 és 7.10. ábrájának rácsai a számlálással: zöld = határozott, lila = határozatlan, bordó = mozog.">
            <AbraRacsos />
          </AbraKeret>
        }
        tanulsag={
          <p>
            Rácsos tartón a számlálás topológiából olvasható: csomópontonként két egyenlet, rudanként és kényszerfokonként egy ismeretlen. A döntést itt is a geometria adja: <strong>háromszögekből felépíthető-e</strong> a rács (mindig egy új csuklót két új, nem egy egyenesbe eső rúddal kötünk be), és a
            kapott merev test(ek)et jól támasztják-e. A fordított lefejtés — egy két rúddal bekötött csomópont levétele — nem változtat a határozottságon, ha a két rúd nem esik egy egyenesbe.
          </p>
        }
      >
        <Lepes cim="7.9: az alapeset">
          <MB>{"e = 2c = 2\\cdot 6 = 12,\\qquad i = r + k = 9 + 3 = 12"}</MB>
          <p>
            Négy háromszög egymáshoz illesztve egyetlen merev test; ezt csukló + görgő támasztja kéttámaszú tartóként (a görgő hatásvonala nem megy át a csuklón). <strong>Határozott.</strong>
          </p>
        </Lepes>
        <Lepes cim="7.10.a és b: túlhatározott (e > i)">
          <MB>{"\\text{a) } r + k = 8 + 3 = 11 < 12,\\qquad \\text{b) } r + k = 9 + 2 = 11 < 12"}</MB>
          <p>
            a) Az átló nélküli mező négyszög, nem merev: a jobb felső sarok „háromcsuklós tartóját” levéve a maradék téglalap a csukló körül elfordul. b) A merev test két görgőn áll: vízszintesen elgördül. Mindkettő mechanizmus.
          </p>
        </Lepes>
        <Lepes cim="7.10.c és d: határozatlan (e < i)">
          <MB>{"\\text{c) } r + k = 10 + 3 = 13 > 12,\\qquad \\text{d) } r + k = 9 + 4 = 13 > 12"}</MB>
          <p>
            c) Az X-rács egyik átlója fölös: egy rúd elvételével visszakapjuk a határozott rácsot. d) A második csukló vízszintes reakciója fölös: görgővé alakítva határozott. Mindkettő egyszeresen határozatlan tartó.
          </p>
        </Lepes>
        <Lepes cim="7.10.e és f: e = i, mégsem tartó">
          <MB>{"\\text{e) } r + k = 10 + 2 = 12,\\qquad \\text{f) } r + k = 9 + 3 = 12"}</MB>
          <p>
            e) Két görgő: vízszintes teherre semmi nem gátolja az eltolódást (szabad mozgás), miközben az X-ben egy rúd fölös. f) A jobb felső csomópontot két rúdjával levéve a bal oldali (X-szel merevített) test egy csuklón és egy olyan rúdon áll, amelynek hatásvonala <em>átmegy a csuklón</em> — más
            szemmel: három csukló az alsó övön egy egyenesbe esik. Mindkettő <strong>határozatlan és túlhatározott</strong>.
          </p>
        </Lepes>
        <Lepes cim="Ítélet">
          <p>7.9: határozott; a, b: mechanizmus; c, d: egyszeresen határozatlan; e, f: kritikus elrendezés. A számlálás négyből kettőt eldönt, a maradékhoz a rács felépítését kell megnézni.</p>
        </Lepes>
      </KidolgozottFeladat>
      <FilmCim>Ugyanez filmen – a rudak egyenként bejönnek, egy rúd elvéve elferdül a mező</FilmCim>
      <FilmGyf5 />

      {/* ==================== GYF‑6 ==================== */}
      <KidolgozottFeladat
        jel="GYF‑6"
        ido="5 perc"
        forras="Tankönyv 7.7.d ábra"
        cim="Három rúd egy ponton át — az egyenlet, amiben nincs ismeretlen"
        feladat={
          <p>
            Egy <M>{"4\\ \\text{m}"}</M> hosszú gerendát (a talaj fölött 2 m-rel) három rúd tart: az 1. függőleges a bal végből, a 2. és a 3. ferde; mindhárom hatásvonala az <M>{"A = (0;\\,0)"}</M> talajponton megy át. Teher: <M>{"F = 10\\ \\text{kN}"}</M> lefelé <M>{"x = 3\\ \\text{m}"}</M>-nél. a) Írd fel a
            számlálást és próbáld meg kiszámítani a rúderőket! b) Mi változik, ha a 3. rúd alsó végét a <M>{"D = (1;\\,0)"}</M> pontba tesszük?
          </p>
        }
        abra={
          <AbraKeret cim="a) Mindhárom rúd hatásvonala az A ponton megy át; b) a 3. rúd a D pontba vezet — a hatásvonalak páronként máshol metszik egymást.">
            <AbraGyf6 />
          </AbraKeret>
        }
        tanulsag={
          <p>
            A kritikus elrendezés árulkodó jele: találunk olyan egyenletet, amelyben <strong>egyetlen ismeretlen sincs</strong> — itt az <M>{"A"}</M> pontra írt nyomatéki egyenlet. Ha a teher forgat <M>{"A"}</M> körül, ellentmondás (nincs egyensúly); ha nem, a maradék két egyenletből három ismeretlen közül
            egy szabad marad. A tankönyv ökölszabálya (7.4.2): három vagy több közös metszéspontú reakcióból legfeljebb kettőt tartsunk meg. A „majdnem” kritikus elrendezés is veszélyes: a reakciók irreálisan nagyok lesznek — ezt mutatja a Kritikus elrendezés felfedező mérője.
          </p>
        }
      >
        <Lepes cim="Számlálás">
          <MB>{"e = 3,\\qquad i = 1 + 1 + 1 = 3\\quad\\Rightarrow\\quad\\text{lehet határozott}"}</MB>
        </Lepes>
        <Lepes cim="a) Az egyenlet, amelyben nincs ismeretlen">
          <p>
            A három rúderő hatásvonala az <M>{"A"}</M> ponton megy át, tehát az <M>{"A"}</M>-ra írt nyomatéki egyenletben egyiknek sincs karja:
          </p>
          <MB>{"\\Mp{A} -10\\cdot 3 = 0\\quad\\text{ellentmondás}"}</MB>
          <p>
            Nincs egyensúly: a gerenda <M>{"A"}</M> körül elfordul. Ha a teher hatásvonala átmenne <M>{"A"}</M>-n, az egyensúly lehetséges lenne, de a két vetületi egyenletből három rúderő nem számítható egyértelműen. <strong>Határozatlan és túlhatározott</strong> szerkezet:{" "}
            <M>{"e - i = 0 = 1 - 1"}</M>.
          </p>
        </Lepes>
        <Lepes cim="b) A 3. rúd a D pontba: egyismeretlenes menetrend">
          <p>
            Most az 1. és 2. rúd hatásvonala <M>{"A"}</M>-ban metszi egymást, de a 3. rúdé nem megy át rajta: az <M>{"A"}</M>-ra írt nyomatéki egyenletben egyedül <M>{"S_3"}</M> marad. A 3. rúd iránya <M>{"(-3;\\,-2)/3{,}606"}</M>, a felső végpontja <M>{"(4;\\,2)"}</M>; karja <M>{"A"}</M>-ra{" "}
            <M>{"|4\\cdot(-0{,}5547) - 2\\cdot(-0{,}8321)| = 0{,}5547\\ \\text{m}"}</M>.
          </p>
          <MB>{"\\Mp{A} -10\\cdot 3 - 0{,}5547\\,S_3 = 0 \\Rightarrow S_3 = -54{,}08\\ \\text{kN (nyomott)}"}</MB>
          <MB>{"\\Fx -0{,}7071\\,S_2 - 0{,}8321\\,S_3 = 0 \\Rightarrow S_2 = 63{,}64\\ \\text{kN (húzott)}"}</MB>
          <MB>{"\\Fy -S_1 - 0{,}7071\\,S_2 - 0{,}5547\\,S_3 - 10 = 0 \\Rightarrow S_1 = -25{,}00\\ \\text{kN (nyomott)}"}</MB>
          <p>
            Egy teherre egyértelmű megoldás + <M>{"3 = 3"}</M>: <strong>határozott</strong>. A számok nagyok a teherhez képest — a 3. rúd hatásvonala még mindig közel megy <M>{"A"}</M>-hoz (a kar csak 0,55 m). Ez a „majdnem kritikus” elrendezés.
          </p>
        </Lepes>
        <Lepes cim="Ítélet">
          <p>a) kritikus elrendezés, nem tartó; b) határozott, de rossz hatásfokú tartó — a rudakat érdemes lenne „szétnyitni”.</p>
        </Lepes>
      </KidolgozottFeladat>

      {/* ==================== GYF‑7 ==================== */}
      <KidolgozottFeladat
        jel="GYF‑7"
        ido="6 perc"
        forras="Tankönyv 7.5 és 7.11. ábra"
        cim="Háromtámaszú tartó — a határozatlan feladat egy szabad paraméterrel"
        feladat={
          <p>
            Egy <M>{"8\\ \\text{m}"}</M> hosszú gerendát az <M>{"A"}</M> csukló (<M>{"x = 0"}</M>), a <M>{"B"}</M> görgő (<M>{"x = 4"}</M>) és a <M>{"C"}</M> görgő (<M>{"x = 8\\ \\text{m}"}</M>) támaszt; teher <M>{"F = 12\\ \\text{kN}"}</M> lefelé <M>{"x = 2\\ \\text{m}"}</M>-nél. Mutasd meg, hogy a
            reakciók az egyensúlyi egyenletekből nem egyértelműek, add meg őket <M>{"B"}</M> függvényében, sorold fel a lehetséges törzstartókat — és mondd meg, mi dönti el a tényleges értéket!
          </p>
        }
        abra={
          <AbraKeret cim="Egyszeresen határozatlan folytatólagos tartó. A lila nyilak az egységnyi merevséggel számolt reakciók: A_y = 4,875, B = 8,250, C = −1,125 kN (C lefelé!).">
            <AbraGyf7 reakciok={[{ Fx: 0, Fy: 4.875 }, { Fx: 0, Fy: 8.25, nagysag: 8.25 }, { Fx: 0, Fy: -1.125, nagysag: -1.125 }]} />
          </AbraKeret>
        }
        tanulsag={
          <p>
            A statikailag határozatlan tartón <strong>minden</strong> feladat határozatlan: az egyensúlyi egyenletek egy egyparaméteres megoldássereget adnak. A paraméter értékét az dönti el, hogy a tartó alakváltozása illeszkedjen a támaszokhoz — ez a Szilárdságtan (és a Tartók statikája) témája. Ezért nem
            mindegy a merevség: ha a jobb mező négyszer merevebb, <M>{"B = 9{,}60"}</M>, <M>{"A_y = 4{,}20"}</M>, <M>{"C = -1{,}80"}</M> kN. Kinematikai teherre (támaszsüllyedés, hőmérséklet) is ébrednek reakciók — a határozott tartón sosem.
          </p>
        }
      >
        <Lepes cim="Számlálás és elsődleges következtetés">
          <MB>{"e = 3,\\qquad i = 2 + 1 + 1 = 4\\quad\\Rightarrow\\quad i - e = 1:\\ \\text{legalább egyszeresen határozatlan}"}</MB>
          <p>Mozgás nincs (csukló + két görgő minden eltolódást és elfordulást gátol): pontosan egy kényszer fölös. Egyszeresen határozatlan tartó.</p>
        </Lepes>
        <Lepes cim="Egyensúlyi kijelentés és a paraméteres megoldás">
          <MB>{"(\\underline{F}, \\underline{A}, \\underline{B}, \\underline{C}) \\ekv \\underline{O}"}</MB>
          <MB>{"\\Fx A_x = 0"}</MB>
          <MB>{"\\Mp{A} -12\\cdot 2 + 4\\,B + 8\\,C = 0 \\Rightarrow C = 3 - \\tfrac{1}{2}B"}</MB>
          <MB>{"\\Fy A_y + B + C - 12 = 0 \\Rightarrow A_y = 9 - \\tfrac{1}{2}B"}</MB>
          <p>
            Bármilyen <M>{"B"}</M>-hez tartozik egyensúlyi megoldás: <M>{"B = 0"}</M> → kéttámaszú tartó (<M>{"A_y = 9, C = 3"}</M>); <M>{"B = 6"}</M> → <M>{"C = 0"}</M>; <M>{"B = 8{,}25"}</M> → <M>{"C = -1{,}125"}</M>. A szabad paraméter a fölös kényszerben ébredő erő.
          </p>
        </Lepes>
        <Lepes cim="Törzstartók (7.11. ábra)">
          <ul className="list-disc space-y-1 pl-5">
            <li>
              a <M>{"B"}</M> görgő elvéve: kéttámaszú tartó, <M>{"B"}</M> paraméteres teherként;
            </li>
            <li>
              a <M>{"C"}</M> görgő elvéve: konzolos kéttámaszú tartó, <M>{"C"}</M> a paraméter;
            </li>
            <li>
              az <M>{"A"}</M> csukló <em>ferde</em> görgővé alakítva (vízszintes komponense marad!), <M>{"A_x"}</M> a paraméter — vízszintes síkú görgővel három párhuzamos görgő maradna: kritikus (7.7.a);
            </li>
            <li>
              belső csukló <M>{"B"}</M> fölött: a hajlítónyomaték a paraméter, a csukló két oldalán ellentett nyomatékpár.
            </li>
          </ul>
        </Lepes>
        <Lepes cim="Mi dönt? A merevség">
          <p>
            A tartó alakváltozásának illeszkednie kell mindhárom támaszhoz. Egységnyi, állandó merevséggel a számítómag: <M>{"B = 8{,}250"}</M>, <M>{"A_y = 4{,}875"}</M>, <M>{"C = -1{,}125"}</M> kN — a <M>{"C"}</M> görgőnek <em>lefelé</em> kellene tartania, azaz egyoldali görgőnél a jobb vég
            felemelkedne. Ha a jobb mező merevsége négyszeres: <M>{"B = 9{,}600"}</M>, <M>{"A_y = 4{,}200"}</M>, <M>{"C = -1{,}800"}</M> kN. Ellenőrzés: mindkettő rajta van a <M>{"C = 3 - B/2"}</M> egyenesen ✓.
          </p>
        </Lepes>
        <Lepes cim="Ítélet">
          <p>Egyszeresen statikailag határozatlan tartó: bármilyen teherre van megoldás, de nem egyértelmű; a tényleges reakciók a merevségtől függenek.</p>
        </Lepes>
      </KidolgozottFeladat>
    </>
  );
}
