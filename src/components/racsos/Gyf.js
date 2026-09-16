import { AbraKeret } from "@/components/ui/Elemek";
import { M, MB } from "@/components/ui/Keplet";
import { KidolgozottFeladat, Lepes } from "@/components/KidolgozottFeladat";
import { AbraGyf1, AbraGyf2, AbraGyf3, AbraGyf4, AbraGyf5, AbraGyf6, AbraGyf7 } from "@/components/racsos/FeladatAbrak";
import { M_GYF1, M_GYF3, M_GYF4, M_GYF5, M_GYF6, M_GYF7 } from "@/components/racsos/gyfModellek";
import { RudErokTabla } from "@/components/racsos/RacsosRajz";
import { racsosMegold } from "@/lib/racsos";
import FilmGyf1 from "@/components/racsos/FilmGyf1";
import FilmGyf2 from "@/components/racsos/FilmGyf2";
import FilmGyf4 from "@/components/racsos/FilmGyf4";

/*
 * A 7. modul kidolgozott feladatai (GYF‑1 … GYF‑7): a tankönyv 6.1/6.4, 6.6 példái,
 * a H07 és H08 feladatsor, a vizsgaminta 3. feladata és a rúdján terhelt rácsos tartó.
 * Minden számot a lib/racsos megoldó és a lib/tarto merevségi módszer is ellenőrzött.
 */

const FilmCim = ({ children }) => <h3 className="mt-4 mb-2 text-[13px] font-semibold text-petrol-500 uppercase tracking-wider">{children}</h3>;

const tabla = (m) => ({ rudTabla: racsosMegold(m).rudTabla });
const T1 = tabla(M_GYF1);
const T3 = tabla(M_GYF3);
const T4 = tabla(M_GYF4);
const T5 = tabla(M_GYF5);
const T6 = tabla(M_GYF6);
const T7 = tabla(M_GYF7);

export default function GyfBlokkok() {
  return (
    <>
      {/* ==================== GYF‑1 ==================== */}
      <KidolgozottFeladat
        jel="GYF‑1"
        ido="12 perc"
        forras="Tankönyv 6.1. és 6.4. ábra"
        cim="Csomóponti módszer végig — Warren-tartó ferde erővel"
        feladat={
          <p>
            A tankönyv 6.1. ábrájának rácsos tartója: az alsó öv csomópontjai <M>{"1, 3, 5, 7"}</M> (<M>{"x = 0;\\ 3;\\ 6;\\ 9\\ \\text{m}"}</M>), a felső öv csomópontjai{" "}
            <M>{"2, 4, 6"}</M> (<M>{"x = 1{,}5;\\ 4{,}5;\\ 7{,}5\\ \\text{m}"}</M>, <M>{"h = 2\\ \\text{m}"}</M>). Az 1. csomópont csukló (<M>{"A"}</M>), a 7. görgő (<M>{"B"}</M>). Az 5. csomópontot a
            vízszintessel <M>{"60^\\circ"}</M>-ot bezáró, jobbra-lefelé mutató <M>{"F = 10\\ \\text{kN}"}</M> erő terheli. Határozd meg az összes rúderőt a csomóponti módszerrel!
          </p>
        }
        abra={
          <AbraKeret cim="A statikai váz. Minden rácsrúd 1,5 m vízszintes és 2 m függőleges vetületű, hossza 2,5 m: cos = 0,6, sin = 0,8.">
            <AbraGyf1 />
          </AbraKeret>
        }
        tanulsag={
          <p>
            A csomóponti módszer mindig egy olyan csomópontból indul, ahol legfeljebb két ismeretlen rúderő van — a támaszoknál ilyen mindig akad. Az első egyenletet úgy írjuk, hogy a <em>másik</em> ismeretlenre
            merőlegesen vetítünk (itt a vízszintes övrúd miatt ez a <M>{"\\Fy"}</M>), a másodikba a már kiszámolt rúderőt is beírjuk. A rúderőket <strong>mindig húzottnak</strong> vesszük fel: a negatív
            eredmény nyomott rudat jelent. A tankönyv megjegyzése: az utolsó két rudat (<M>{"S_{5,7}, S_{6,7}"}</M>) érdemesebb lett volna a 7. csomópontból számolni — így a kerekítési hibák nem görögnek
            végig a szerkezeten.
          </p>
        }
      >
        <Lepes cim="Statikai határozottság és a reakciók">
          <p>
            <M>{"r = 11"}</M> rúd, <M>{"k = 2 + 1 = 3"}</M> kényszer-fokszám, <M>{"c = 7"}</M> csomópont: <M>{"r + k = 14 = 2c"}</M> — a rúderők az egyensúlyi egyenletekből egyértelműen számolhatók. A rácsozat egyetlen merev test, a reakciókat az egész
            szerkezet egyensúlyából kapjuk. Az <M>{"F"}</M> komponensei: <M>{"F\\cos 60^\\circ = 5{,}000"}</M> kN jobbra, <M>{"F\\sin 60^\\circ = 8{,}660"}</M> kN lefelé.
          </p>
          <MB>{"(\\underline{F}, \\underline{A}, \\underline{B}) \\ekv \\underline{O}"}</MB>
          <MB>{"\\Mp{A} -6\\cdot 8{,}660 + 9\\,B = 0 \\;\\Rightarrow\\; B = 5{,}774\\ \\text{kN}"}</MB>
          <MB>{"\\Fx A_x + 5{,}000 = 0 \\;\\Rightarrow\\; A_x = -5{,}000\\ \\text{kN}\\ (\\leftarrow)"}</MB>
          <MB>{"\\Fy A_y - 8{,}660 + 5{,}774 = 0 \\;\\Rightarrow\\; A_y = 2{,}887\\ \\text{kN}"}</MB>
          <MB>{"\\text{ellenőrzés:}\\quad \\Mp{B} +3\\cdot 8{,}660 - 9\\cdot 2{,}887 = 25{,}98 - 25{,}98 = 0\\ \\checkmark"}</MB>
        </Lepes>
        <Lepes cim="1. csomópont → S₁,₂ és S₁,₃">
          <p>
            Két ismeretlen. Az 1. csomópontra hat <M>{"A_x = 5"}</M> kN balra, <M>{"A_y = 2{,}887"}</M> kN felfelé, a húzottnak felvett <M>{"S_{1,2}"}</M> (a 2. felé, 0,6; 0,8 irány) és <M>{"S_{1,3}"}</M> (jobbra). Az{" "}
            <M>{"S_{1,3}"}</M>-ra merőleges (függőleges) vetületben csak <M>{"S_{1,2}"}</M> marad:
          </p>
          <MB>{"\\Fy 2{,}887 + 0{,}8\\,S_{1,2} = 0 \\;\\Rightarrow\\; S_{1,2} = -3{,}608\\ \\text{kN (nyomott)}"}</MB>
          <MB>{"\\Fx -5 + 0{,}6\\cdot(-3{,}608) + S_{1,3} = 0 \\;\\Rightarrow\\; S_{1,3} = 7{,}165\\ \\text{kN (húzott)}"}</MB>
        </Lepes>
        <Lepes cim="2. csomópont → S₂,₃ és S₂,₄">
          <p>
            <M>{"S_{1,2}"}</M> már ismert (a rúd a 2. csomópontot az 1. felé húzza: irány −0,6; −0,8). <M>{"S_{2,4}"}</M> vízszintes, ezért a függőleges vetületben csak <M>{"S_{2,3}"}</M> (irány 0,6; −0,8) marad:
          </p>
          <MB>{"\\Fy -0{,}8\\cdot(-3{,}608) - 0{,}8\\,S_{2,3} = 0 \\;\\Rightarrow\\; S_{2,3} = 3{,}608\\ \\text{kN (húzott)}"}</MB>
          <MB>{"\\Fx -0{,}6\\cdot(-3{,}608) + 0{,}6\\cdot 3{,}608 + S_{2,4} = 0 \\;\\Rightarrow\\; S_{2,4} = -4{,}330\\ \\text{kN (nyomott)}"}</MB>
        </Lepes>
        <Lepes cim="3. csomópont → S₃,₄ és S₃,₅">
          <MB>{"\\Fy 0{,}8\\cdot 3{,}608 + 0{,}8\\,S_{3,4} = 0 \\;\\Rightarrow\\; S_{3,4} = -3{,}608\\ \\text{kN (nyomott)}"}</MB>
          <MB>{"\\Fx -7{,}165 - 0{,}6\\cdot 3{,}608 + 0{,}6\\cdot(-3{,}608) + S_{3,5} = 0 \\;\\Rightarrow\\; S_{3,5} = 11{,}50\\ \\text{kN (húzott)}"}</MB>
          <p>
            Figyeld meg: a vízszintes egyenletben az ismert <M>{"S_{1,3}"}</M> (balra húz), <M>{"S_{2,3}"}</M> és <M>{"S_{3,4}"}</M> vetülete is szerepel — a tankönyv figyelmeztetése: „ügyeljünk arra, hogy az előbb kiszámolt rúderő vetületét se hagyjuk ki”.
          </p>
        </Lepes>
        <Lepes cim="4., 5. és 6. csomópont">
          <MB>{"4:\\quad \\Fy -0{,}8\\cdot(-3{,}608) - 0{,}8\\,S_{4,5} = 0 \\;\\Rightarrow\\; S_{4,5} = 3{,}608;\\qquad \\Fx 4{,}330 - 0{,}6\\cdot(-3{,}608) + 0{,}6\\cdot 3{,}608 + S_{4,6} = 0 \\;\\Rightarrow\\; S_{4,6} = -8{,}660"}</MB>
          <MB>{"5:\\quad \\Fy -8{,}660 + 0{,}8\\cdot 3{,}608 + 0{,}8\\,S_{5,6} = 0 \\;\\Rightarrow\\; S_{5,6} = 7{,}217;\\qquad \\Fx 5 - 11{,}50 - 0{,}6\\cdot 3{,}608 + 0{,}6\\cdot 7{,}217 + S_{5,7} = 0 \\;\\Rightarrow\\; S_{5,7} = 4{,}330"}</MB>
          <MB>{"6:\\quad \\Fy -0{,}8\\cdot 7{,}217 - 0{,}8\\,S_{6,7} = 0 \\;\\Rightarrow\\; S_{6,7} = -7{,}217;\\qquad \\text{ellenőrzés: }\\Fx 8{,}660 - 0{,}6\\cdot 7{,}217 + 0{,}6\\cdot(-7{,}217) = 0\\ \\checkmark"}</MB>
          <p>
            A 6. csomópontban már csak egy ismeretlen volt, a másik egyenlete ellenőrzés. Az előjelekre figyelj: a 4. csomópont vízszintes egyenletében az <M>{"S_{2,4} = -4{,}330"}</M> a csomópontot a 2. felé (balra) „húzza”
            negatív értékkel, azaz jobbra tolja: <M>{"(-1)\\cdot(-4{,}330) = +4{,}330"}</M>.
          </p>
        </Lepes>
        <Lepes cim="Ellenőrzés a 7. csomóponton és rúderőtáblázat">
          <p>
            A 7. csomópont mindkét egyenlete szabad, mert a teljes szerkezet egyensúlyához már felhasználtunk három egyenletet (<M>{"2c = 14"}</M> egyenlet, <M>{"11 + 3 = 14"}</M> ismeretlen):
          </p>
          <MB>{"\\Fx -4{,}330 - 0{,}6\\cdot(-7{,}217) = 0\\ \\checkmark\\qquad \\Fy 5{,}774 + 0{,}8\\cdot(-7{,}217) = 0\\ \\checkmark"}</MB>
          <p>A rúderőket a tankönyv szerint eredményvázlat helyett rúderőtáblázatban adjuk meg — külön oszlopban a húzott és a nyomott rudak, mert a méretezésük eltér:</p>
          <div className="mt-2 max-w-sm">
            <RudErokTabla eredmeny={T1} kicsi />
          </div>
        </Lepes>
      </KidolgozottFeladat>
      <FilmCim>Ugyanez filmen – a csomópontok egymás után kigyulladnak</FilmCim>
      <FilmGyf1 />

      {/* ==================== GYF‑2 ==================== */}
      <KidolgozottFeladat
        jel="GYF‑2"
        ido="6 perc"
        forras="Tankönyv 6.6. ábra"
        cim="Hármas átmetszés — három rúderő három egyismeretlenes egyenletből"
        feladat={
          <p>
            Párhuzamos övű rácsos tartó, négy <M>{"a = 2\\ \\text{m}"}</M> széles mezővel, <M>{"b = 1{,}5\\ \\text{m}"}</M> magas. Felső csomópontok <M>{"1\\ldots 5"}</M>, alsók <M>{"6\\ldots 10"}</M>; a 6. csukló (<M>{"A"}</M>), a 10.
            görgő (<M>{"B"}</M>). A 4. csomóponton <M>{"F = 12\\ \\text{kN}"}</M> függőleges erő hat. Határozd meg a <M>{"S_{2,3}, S_{2,8}, S_{7,8}"}</M> rúderőket hármas átmetszéssel!
          </p>
        }
        abra={
          <AbraKeret cim="A tankönyv 6.6.a ábrája számokkal: a görbe vonal a kiemelt három rudat vágja át. A rácsrudak 2 m vízszintes, 1,5 m függőleges vetületűek (hossz 2,5 m): cos = 0,8, sin = 0,6.">
            <AbraGyf2 />
          </AbraKeret>
        }
        tanulsag={
          <p>
            Az átmetszés után a tartórész egy <strong>három rúddal megtámasztott merev test</strong> (5. modul 4.8. ábra): minden rúderőhöz a másik kettő metszéspontja — a <strong>főpont</strong> — a nyomatéki pont. Az
            övrudak főpontja a szemközti öv csomópontja (8, illetve 2), a rácsrúdé a két párhuzamos öv „metszéspontja” a végtelenben: helyette a rájuk merőleges, függőleges vetületi egyenlet. Egyik rúderő sem épül a
            másikra, és nem kellett végigmenni a csomópontokon. A rész kiválasztásánál azt az oldalt érdemes nézni, amelyikre kevesebb külső erő hat — itt a balt (csak <M>{"A"}</M>).
          </p>
        }
      >
        <Lepes cim="Reakciók az egész szerkezetből">
          <MB>{"\\Mp{A} -6\\cdot 12 + 8\\,B = 0 \\;\\Rightarrow\\; B = 9\\ \\text{kN};\\qquad \\Fy A_y - 12 + 9 = 0 \\;\\Rightarrow\\; A_y = 3\\ \\text{kN};\\qquad \\Fx A_x = 0"}</MB>
        </Lepes>
        <Lepes cim="Az átmetszés és a bal oldali rész elkülönítése">
          <p>
            Képzeletben eltávolítjuk a <M>{"2\\text{–}3"}</M>, <M>{"2\\text{–}8"}</M> és <M>{"7\\text{–}8"}</M> rudakat: a tartó két részre esik. A bal részre (1, 2, 6, 7 csomópontok) az <M>{"A_y = 3"}</M> kN reakció és a három átvágott rúd
            húzottnak felvett ereje hat: <M>{"S_{2,3}"}</M> a 2. pontban jobbra, <M>{"S_{7,8}"}</M> a 7. pontban jobbra, <M>{"S_{2,8}"}</M> a 2. pontban a 8. felé (0,8; −0,6).
          </p>
          <MB>{"(\\underline{A}, \\underline{S}_{2,3}, \\underline{S}_{2,8}, \\underline{S}_{7,8}) \\ekv \\underline{O}"}</MB>
        </Lepes>
        <Lepes cim="Nyomatéki egyenlet a 8. főpontra → S₂,₃">
          <p>
            A 8. csomóponton átmegy <M>{"S_{2,8}"}</M> és <M>{"S_{7,8}"}</M> hatásvonala. <M>{"A_y"}</M> karja 4 m (a ponttól balra felfelé: az óramutató szerint forgat), <M>{"S_{2,3}"}</M> karja 1,5 m (a pont fölött jobbra: szintén negatív):
          </p>
          <MB>{"\\Mp{8} -4\\cdot 3 - 1{,}5\\,S_{2,3} = 0 \\;\\Rightarrow\\; S_{2,3} = -8\\ \\text{kN (nyomott)}"}</MB>
        </Lepes>
        <Lepes cim="Függőleges vetületi egyenlet → S₂,₈">
          <p>A két övrúd vízszintes, a rájuk merőleges vetületben csak a rácsrúd marad:</p>
          <MB>{"\\Fy 3 - 0{,}6\\,S_{2,8} = 0 \\;\\Rightarrow\\; S_{2,8} = 5\\ \\text{kN (húzott)}"}</MB>
        </Lepes>
        <Lepes cim="Nyomatéki egyenlet a 2. főpontra → S₇,₈">
          <MB>{"\\Mp{2} -2\\cdot 3 + 1{,}5\\,S_{7,8} = 0 \\;\\Rightarrow\\; S_{7,8} = 4\\ \\text{kN (húzott)}"}</MB>
        </Lepes>
        <Lepes cim="Ellenőrzés és a jobb oldali rész">
          <MB>{"\\Fx -8 + 0{,}8\\cdot 5 + 4 = 0\\ \\checkmark"}</MB>
          <p>Ugyanezek a jobb oldali részből (3, 4, 5, 8, 9, 10; rá hat <M>{"F"}</M> és <M>{"B"}</M>) is kijönnek — több taggal, de azonos eredménnyel:</p>
          <MB>{"\\Mp{8} -2\\cdot 12 + 4\\cdot 9 + 1{,}5\\,S_{2,3} = 0 \\;\\Rightarrow\\; S_{2,3} = -8;\\quad \\Fy -12 + 9 + 0{,}6\\,S_{2,8} = 0 \\;\\Rightarrow\\; S_{2,8} = 5;\\quad \\Mp{2} -4\\cdot 12 + 6\\cdot 9 - 1{,}5\\,S_{7,8} = 0 \\;\\Rightarrow\\; S_{7,8} = 4\\ \\checkmark"}</MB>
        </Lepes>
      </KidolgozottFeladat>
      <FilmCim>Ugyanez filmen – a vágás, a főpontok és a három egyenlet</FilmCim>
      <FilmGyf2 />

      {/* ==================== GYF‑3 ==================== */}
      <KidolgozottFeladat
        jel="GYF‑3"
        ido="15 perc"
        forras="H07 szintemelő (magyar/angol)"
        cim="H07 — minden rúderő: vakrudak, csomóponti módszer és két hármas átmetszés"
        feladat={
          <p>
            Párhuzamos övű rácsos tartó négy <M>{"a = 2\\ \\text{m}"}</M> széles mezővel, <M>{"b = 1{,}5\\ \\text{m}"}</M> magassággal; a 6. csomópont csukló (<M>{"A"}</M>), a 10. görgő (<M>{"B"}</M>). Terhek: <M>{"F_1 = 10\\ \\text{kN}"}</M> a
            3., <M>{"F_2 = 6\\ \\text{kN}"}</M> a 4. csomóponton, függőlegesen lefelé. Határozd meg a rúderőket! Alkalmazd a csomóponti módszert és a hármas átmetszés módszerét is legalább kétszer! (<em>Determine the forces in
            the members of the truss. Apply the method of sections and the method of joints as well!</em>)
          </p>
        }
        abra={
          <AbraKeret cim="A feladatlap rajza számokkal. A rácsrudak a középső alsó csomópont (8) felé lejtenek; hosszuk 2,5 m, cos = 0,8, sin = 0,6.">
            <AbraGyf3 />
          </AbraKeret>
        }
        tanulsag={
          <p>
            A recept: reakciók → vakrudak ránézésre → a csomóponti módszer a támaszoktól befelé → a belső rudak átmetszéssel (ez egyben ellenőrzés is). A 3. csomópontban három ismeretlen van, de kettő (a két övrúd) egy
            egyenesbe esik, ezért az oszlop ereje a függőleges vetületből azonnal kijön: <M>{"S_{3,8} = -F_1"}</M>. Az övek ereje a nyomatéki ábrát követi (a felső nyomott, az alsó húzott, a legnagyobb a terhek alatt), a
            rácsrudaké a nyíróerőt.
          </p>
        }
      >
        <Lepes cim="Reakciók">
          <MB>{"(\\underline{F}_1, \\underline{F}_2, \\underline{A}, \\underline{B}) \\ekv \\underline{O}"}</MB>
          <MB>{"\\Mp{A} -4\\cdot 10 - 6\\cdot 6 + 8\\,B = 0 \\;\\Rightarrow\\; B = 9{,}5\\ \\text{kN};\\qquad \\Fx A_x = 0;\\qquad \\Fy A_y - 16 + 9{,}5 = 0 \\;\\Rightarrow\\; A_y = 6{,}5\\ \\text{kN}"}</MB>
          <MB>{"\\text{ellenőrzés:}\\quad \\Mp{B} 4\\cdot 10 + 2\\cdot 6 - 8\\cdot 6{,}5 = 0\\ \\checkmark"}</MB>
        </Lepes>
        <Lepes cim="Vakrudak ránézésre">
          <p>
            A 6. csomóponton két rúd (<M>{"1\\text{–}6"}</M> függőleges, <M>{"6\\text{–}7"}</M> vízszintes) és a függőleges <M>{"A"}</M> reakció hat (<M>{"A_x = 0"}</M>): a reakció az oszlop egyenesébe esik, a rá merőleges (vízszintes) vetületből{" "}
            <M>{"S_{6,7} = 0"}</M> (c eset), és <M>{"S_{1,6} = -A_y = -6{,}5"}</M> kN. Ugyanígy a 10. csomóponton <M>{"S_{9,10} = 0"}</M>, <M>{"S_{5,10} = -9{,}5"}</M> kN. A 3. csomóponton az övrudak egy egyenesbe esnek, ezért:
          </p>
          <MB>{"3:\\quad \\Fy -10 - S_{3,8} = 0 \\;\\Rightarrow\\; S_{3,8} = -10\\ \\text{kN (nyomott oszlop)}"}</MB>
        </Lepes>
        <Lepes cim="Csomóponti módszer: 1 → 7 → 2">
          <MB>{"1:\\quad \\Fy 6{,}5 - 0{,}6\\,S_{1,7} = 0 \\;\\Rightarrow\\; S_{1,7} = 10{,}83;\\qquad \\Fx 0{,}8\\cdot 10{,}83 + S_{1,2} = 0 \\;\\Rightarrow\\; S_{1,2} = -8{,}667"}</MB>
          <MB>{"7:\\quad \\Fx -0{,}8\\cdot 10{,}83 + S_{7,8} = 0 \\;\\Rightarrow\\; S_{7,8} = 8{,}667;\\qquad \\Fy 0{,}6\\cdot 10{,}83 + S_{2,7} = 0 \\;\\Rightarrow\\; S_{2,7} = -6{,}5"}</MB>
          <MB>{"2:\\quad \\Fy 6{,}5 - 0{,}6\\,S_{2,8} = 0 \\;\\Rightarrow\\; S_{2,8} = 10{,}83;\\qquad \\Fx 8{,}667 + 0{,}8\\cdot 10{,}83 + S_{2,3} = 0 \\;\\Rightarrow\\; S_{2,3} = -17{,}33"}</MB>
          <p>
            (Az 1. csomóponton a rúd <M>{"1\\text{–}6"}</M> az 1-est lefelé húzza <M>{"-6{,}5"}</M> kN-nal, azaz <M>{"+6{,}5"}</M> felfelé tol — ezért áll <M>{"+6{,}5"}</M> a függőleges egyenletben.)
          </p>
        </Lepes>
        <Lepes cim="1. hármas átmetszés: S₂,₃, S₂,₈, S₇,₈ — a bal részből (ellenőrzés is)">
          <MB>{"\\Mp{8} -4\\cdot 6{,}5 - 1{,}5\\,S_{2,3} = 0 \\;\\Rightarrow\\; S_{2,3} = -17{,}33\\ \\checkmark;\\quad \\Fy 6{,}5 - 0{,}6\\,S_{2,8} = 0 \\;\\Rightarrow\\; S_{2,8} = 10{,}83\\ \\checkmark;\\quad \\Mp{2} -2\\cdot 6{,}5 + 1{,}5\\,S_{7,8} = 0 \\;\\Rightarrow\\; S_{7,8} = 8{,}667\\ \\checkmark"}</MB>
        </Lepes>
        <Lepes cim="2. hármas átmetszés: S₃,₄, S₄,₈, S₈,₉ — a jobb részből (4, 5, 9, 10 + F₂, B)">
          <MB>{"\\Mp{8} -2\\cdot 6 + 4\\cdot 9{,}5 + 1{,}5\\,S_{3,4} = 0 \\;\\Rightarrow\\; S_{3,4} = -17{,}33"}</MB>
          <MB>{"\\Fy -6 + 9{,}5 - 0{,}6\\,S_{4,8} = 0 \\;\\Rightarrow\\; S_{4,8} = 5{,}833"}</MB>
          <MB>{"\\Mp{4} 2\\cdot 9{,}5 - 1{,}5\\,S_{8,9} = 0 \\;\\Rightarrow\\; S_{8,9} = 12{,}67;\\qquad \\text{ellenőrzés: }\\Fx 17{,}33 - 0{,}8\\cdot 5{,}833 - 12{,}67 = 0\\ \\checkmark"}</MB>
        </Lepes>
        <Lepes cim="A maradék a 9. és 5. csomópontból, majd a táblázat">
          <MB>{"5:\\quad \\Fx 12{,}67 - 0{,}8\\,S_{5,9} = 0 \\;\\Rightarrow\\; S_{5,9} = 15{,}83;\\qquad \\Fy -0{,}6\\cdot 15{,}83 - S_{5,10} = 0 \\;\\Rightarrow\\; S_{5,10} = -9{,}5\\ \\checkmark"}</MB>
          <MB>{"4:\\quad \\Fy -6 - 0{,}6\\cdot 5{,}833 - S_{4,9} = 0 \\;\\Rightarrow\\; S_{4,9} = -9{,}5;\\qquad \\Fx 17{,}33 - 0{,}8\\cdot 5{,}833 + S_{4,5} = 0 \\;\\Rightarrow\\; S_{4,5} = -12{,}67"}</MB>
          <MB>{"\\text{ellenőrzés (9):}\\quad \\Fx -12{,}67 + 0{,}8\\cdot 15{,}83 + 0 = 0\\ \\checkmark,\\qquad \\Fy -9{,}5 + 0{,}6\\cdot 15{,}83 = 0\\ \\checkmark"}</MB>
          <div className="mt-2 max-w-sm">
            <RudErokTabla eredmeny={T3} kicsi />
          </div>
        </Lepes>
      </KidolgozottFeladat>

      {/* ==================== GYF‑4 ==================== */}
      <KidolgozottFeladat
        jel="GYF‑4"
        ido="15 perc"
        forras="H08 szintemelő, 1. feladat"
        cim="K-rácsozás — reakciók, vakrudak indoklással, rúderők csomópontból és négyes átmetszéssel"
        feladat={
          <p>
            A tartó négy <M>{"b = 2\\ \\text{m}"}</M> széles mezőből áll, magassága <M>{"2a = 3\\ \\text{m}"}</M>; a 11–14. csomópontok az oszlopok felezőpontjában vannak. A 6. csomópont csukló (<M>{"A"}</M>), a 10. görgő (<M>{"B"}</M>).{" "}
            <M>{"F_1 = F_2 = 10\\ \\text{kN}"}</M> a 3. és 4. csomóponton. Határozd meg a reakciókat, add meg a vakrudakat indoklással, és számítsd ki rúderőtáblázatban az{" "}
            <M>{"S_{2,3}, S_{2,11}, S_{2,12}, S_{3,12}, S_{7,8}, S_{7,11}, S_{7,12}, S_{8,12}"}</M> rúderőket!
          </p>
        }
        abra={
          <AbraKeret cim="A feladatlap rajza számokkal: a szélső mezőkben K-rácsozás (a 11. és 14. csomópontból induló szárakkal), középen a 12–3–13–8 rombusz és a 3–8 oszlop. A ferde rudak 2 m × 1,5 m vetületűek: cos = 0,8, sin = 0,6.">
            <AbraGyf4 />
          </AbraKeret>
        }
        tanulsag={
          <p>
            K-rácsnál az oszlop két fele két különböző rúd: a 11. csomópont a szélső oszlopot felezi. A vakrudak megtalálása után a bal szélső rész a csomóponti módszerrel végigszámolható, de a K miatt egy csomópontban
            (11.) két <em>ferde</em> ismeretlen marad — ilyenkor az egyikre merőleges vetületi egyenlet (vagy egyszerűbben: <M>{"\\Fx"}</M>, amiből a két szár ereje ellentett) segít. A négyes átmetszés „trükkje”: a két
            oszlopfél ereje közös hatásvonalú, ezért a metszéspontjukra írt nyomatéki egyenletekben az övrudak külön-külön kijönnek; az egyenes átmetszésben az ismert övek mellett a két rácsrúd két vetületi egyenletből
            adódik — pontosan ahogy a tankönyv 6.3.2. leírja.
          </p>
        }
      >
        <Lepes cim="Reakciók">
          <MB>{"\\Mp{A} -4\\cdot 10 - 6\\cdot 10 + 8\\,B = 0 \\;\\Rightarrow\\; B = 12{,}5\\ \\text{kN};\\qquad \\Fx A_x = 0;\\qquad \\Fy A_y - 20 + 12{,}5 = 0 \\;\\Rightarrow\\; A_y = 7{,}5\\ \\text{kN}"}</MB>
        </Lepes>
        <Lepes cim="Vakrudak indoklással (a három alapeset)">
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>1. csomópont</strong> (terheletlen, két rúd nem egy egyenesben — <em>a eset</em>): a vízszintes vetületből <M>{"S_{1,2} = 0"}</M>, a függőlegesből <M>{"S_{1,11} = 0"}</M>. Ugyanígy az <strong>5. csomóponton</strong>:{" "}
              <M>{"S_{4,5} = S_{5,14} = 0"}</M>.
            </li>
            <li>
              <strong>6. csomópont</strong> (két rúd + a függőleges <M>{"A"}</M> reakció az oszlop egyenesében — <em>c eset</em>): <M>{"\\Fx S_{6,7} = 0"}</M>, és <M>{"\\Fy 7{,}5 + S_{6,11} = 0 \\Rightarrow S_{6,11} = -7{,}5"}</M> kN.
              A <strong>10. csomóponton</strong>: <M>{"S_{9,10} = 0"}</M>, <M>{"S_{10,14} = -12{,}5"}</M> kN.
            </li>
          </ul>
          <p>Hat vakrúd: <M>{"1\\text{–}2,\\ 1\\text{–}11,\\ 4\\text{–}5,\\ 5\\text{–}14,\\ 6\\text{–}7,\\ 9\\text{–}10"}</M>. (Más teher esetén ezekben is ébredne erő — a rudak nem hagyhatók el.)</p>
        </Lepes>
        <Lepes cim="11. csomópont → S₂,₁₁ és S₇,₁₁ (a K szárai)">
          <p>
            Ismert: <M>{"S_{6,11} = -7{,}5"}</M> (a rúd a 11-est a 6. felé, lefelé „húzza” −7,5-tel, azaz 7,5 kN-nal felfelé tolja), <M>{"S_{1,11} = 0"}</M>. Ismeretlen a két ferde szár: <M>{"S_{2,11}"}</M> (irány 0,8; 0,6) és{" "}
            <M>{"S_{7,11}"}</M> (0,8; −0,6). A vízszintes vetületben a két szár egyforma együtthatóval szerepel, a függőlegesben ellentett előjellel:
          </p>
          <MB>{"\\Fx 0{,}8\\,S_{2,11} + 0{,}8\\,S_{7,11} = 0 \\;\\Rightarrow\\; S_{7,11} = -S_{2,11}"}</MB>
          <MB>{"\\Fy 7{,}5 + 0{,}6\\,S_{2,11} - 0{,}6\\,S_{7,11} = 7{,}5 + 1{,}2\\,S_{2,11} = 0 \\;\\Rightarrow\\; S_{2,11} = -6{,}25\\ \\text{kN},\\quad S_{7,11} = 6{,}25\\ \\text{kN}"}</MB>
          <p>
            (Egyismeretlenes változat: a <M>{"7\\text{–}11"}</M> rúdra merőleges <M>{"t = (0{,}6;\\ 0{,}8)"}</M> irányú vetület: <M>{"0{,}8\\cdot 7{,}5 + 0{,}96\\,S_{2,11} = 0"}</M>, ugyanaz.)
          </p>
        </Lepes>
        <Lepes cim="2. és 7. csomópont → S₂,₃, S₂,₁₂, S₇,₈, S₇,₁₂">
          <MB>{"2:\\quad \\Fx 0 - 0{,}8\\cdot(-6{,}25) + S_{2,3} = 0 \\;\\Rightarrow\\; S_{2,3} = -5;\\qquad \\Fy -0{,}6\\cdot(-6{,}25) - S_{2,12} = 0 \\;\\Rightarrow\\; S_{2,12} = 3{,}75"}</MB>
          <MB>{"7:\\quad \\Fx 0 - 0{,}8\\cdot 6{,}25 + S_{7,8} = 0 \\;\\Rightarrow\\; S_{7,8} = 5;\\qquad \\Fy 0{,}6\\cdot 6{,}25 + S_{7,12} = 0 \\;\\Rightarrow\\; S_{7,12} = -3{,}75"}</MB>
        </Lepes>
        <Lepes cim="12. csomópont → S₃,₁₂ és S₈,₁₂ (rombusz)">
          <p>
            A 12. csomóponton a két oszlopfél ereje ismert: <M>{"S_{2,12} = 3{,}75"}</M> a 12-est a 2. felé (felfelé) húzza, <M>{"S_{7,12} = -3{,}75"}</M> a 7. felé (lefelé) negatív értékkel — azaz szintén felfelé tol. A két
            ferde rúd (irányuk 0,8; ±0,6) a vízszintes egyenletben azonos, a függőlegesben ellentett előjellel áll:
          </p>
          <MB>{"\\Fx 0{,}8\\,S_{3,12} + 0{,}8\\,S_{8,12} = 0 \\;\\Rightarrow\\; S_{8,12} = -S_{3,12};\\qquad \\Fy 3{,}75 + 3{,}75 + 0{,}6\\,S_{3,12} - 0{,}6\\,S_{8,12} = 7{,}5 + 1{,}2\\,S_{3,12} = 0"}</MB>
          <MB>{"S_{3,12} = -6{,}25\\ \\text{kN (nyomott)},\\qquad S_{8,12} = 6{,}25\\ \\text{kN (húzott)}"}</MB>
        </Lepes>
        <Lepes cim="Ugyanez négyes átmetszéssel (tankönyv 6.7)">
          <p>
            <strong>Ferde négyes átmetszés</strong> a 2–12–7 oszlopon és a 2–3, 7–8 öveken: a bal rész (1, 2, 6, 7, 11) egyensúlya. A két oszlopfél ereje közös (függőleges) hatásvonalú, ezért a 7. és 2. pontra írt nyomatéki
            egyenletben csak egy-egy övrúd marad:
          </p>
          <MB>{"\\Mp{7} -2\\cdot 7{,}5 - 3\\,S_{2,3} = 0 \\;\\Rightarrow\\; S_{2,3} = -5\\ \\checkmark;\\qquad \\Mp{2} -2\\cdot 7{,}5 + 3\\,S_{7,8} = 0 \\;\\Rightarrow\\; S_{7,8} = 5\\ \\checkmark"}</MB>
          <p>
            <strong>Egyenes négyes átmetszés</strong> a 2–3, 3–12, 8–12, 7–8 rudakon: az övek már ismertek, a két rácsrúd a két vetületi egyenletből:
          </p>
          <MB>{"\\Fx -5 + 5 + 0{,}8\\,S_{3,12} + 0{,}8\\,S_{8,12} = 0;\\qquad \\Fy 7{,}5 + 0{,}6\\,S_{3,12} - 0{,}6\\,S_{8,12} = 0 \\;\\Rightarrow\\; S_{3,12} = -6{,}25,\\ S_{8,12} = 6{,}25\\ \\checkmark"}</MB>
        </Lepes>
        <Lepes cim="Rúderőtáblázat (a kért rudak)">
          <div className="mt-1 max-w-sm">
            <RudErokTabla eredmeny={T4} rudak={["2,3", "2,11", "2,12", "3,12", "7,8", "7,11", "7,12", "8,12"]} kicsi />
          </div>
          <p className="mt-2">Ellenőrzés a 13. csomóponton (minden rúd ismert a teljes megoldásból): <M>{"\\Fy -3{,}75 + 6{,}25 - 0{,}6\\cdot 2{,}083 - 0{,}6\\cdot 2{,}083 = 0\\ \\checkmark"}</M>.</p>
        </Lepes>
      </KidolgozottFeladat>
      <FilmCim>Ugyanez filmen – vakrudak, aztán csomópontról csomópontra</FilmCim>
      <FilmGyf4 />

      {/* ==================== GYF‑5 ==================== */}
      <KidolgozottFeladat
        jel="GYF‑5"
        ido="15 perc"
        forras="H08 szintemelő, 2. feladat"
        cim="Külsőleg összetett rácsos tartó — háromcsuklós rendszer ferde felső övvel"
        feladat={
          <p>
            A tartó öt <M>{"b = 2\\ \\text{m}"}</M> széles mezőből áll; a felső öv egyenes, a bal végén <M>{"a = 2\\ \\text{m}"}</M>, a jobb végén <M>{"a + b = 4\\ \\text{m}"}</M> magasan. A bal (2.) és a jobb (12.) alsó
            csomópont is <strong>csukló</strong> (<M>{"A"}</M>, <M>{"B"}</M>). Terhek: <M>{"F_1 = 12\\ \\text{kN}"}</M> a 3., <M>{"F_2 = 8\\ \\text{kN}"}</M> a 9. csomóponton. Határozd meg a külső reakciók komponenseit, és rúderőtáblázatban a jelölt
            (1–7) csomópontok közötti rudak erejét!
          </p>
        }
        abra={
          <AbraKeret cim="A feladatlap rajza számokkal. A felső csomópontok magassága: 2; 2,4; 2,8; 3,2; 3,6; 4 m. A 6–7 mező alsó öve hiányzik: a két háromszög-csoport csak a 7. csomópontban kapcsolódik → háromcsuklós rendszer.">
            <AbraGyf5 />
          </AbraKeret>
        }
        tanulsag={
          <p>
            Négy reakció-ismeretlen, de nem határozatlan: a bal (1–6) és a jobb (7–12) rácsozat két merev test, amelyeket csak a 7. csomópont köt össze — a tankönyv 6.9.b ábrájának <strong>háromcsuklós rendszerű</strong> rácsos tartója.
            A 6. modul receptje adja a reakciókat (két nyomatéki egyenlet az egészre, egy a bal részre a 7. pontra, egy vetületi), és csak ezután jön a csomóponti módszer. A ferde felső öv miatt sok a vakrúd (b eset), és az
            irány-koszinuszokat rúdanként ki kell számolni.
          </p>
        }
      >
        <Lepes cim="Miért nem határozatlan? Reakciók háromcsuklós tartóként">
          <p>
            <M>{"r = 20"}</M>, <M>{"k = 4"}</M>, <M>{"c = 12"}</M>: <M>{"r + k = 24 = 2c"}</M> — határozott. A 7. csomópont eltávolításával a tartó szétesik, mindkét rész egy-egy csuklón áll: a 7. csomópont a háromcsuklós tartó
            közbenső csuklója. Az egész szerkezetre:
          </p>
          <MB>{"\\Mp{A} -2\\cdot 12 - 8\\cdot 8 + 10\\,B_y = 0 \\;\\Rightarrow\\; B_y = 8{,}8\\ \\text{kN};\\qquad \\Mp{B} 8\\cdot 12 + 2\\cdot 8 - 10\\,A_y = 0 \\;\\Rightarrow\\; A_y = 11{,}2\\ \\text{kN}"}</MB>
          <p>A bal részre (1–6) a 7. csomópontra írt nyomatéki egyenlet — a 7-esbe futó két rúd ereje átmegy a ponton, a 7. csomópont koordinátái (6; 3,2):</p>
          <MB>{"\\Mp{7} 4\\cdot 12 - 6\\cdot 11{,}2 + 3{,}2\\,A_x = 0 \\;\\Rightarrow\\; A_x = 6\\ \\text{kN};\\qquad \\Fx 6 + B_x = 0 \\;\\Rightarrow\\; B_x = -6\\ \\text{kN}\\ (\\leftarrow)"}</MB>
          <MB>{"\\text{ellenőrzés:}\\quad \\Fy 11{,}2 + 8{,}8 - 12 - 8 = 0\\ \\checkmark"}</MB>
        </Lepes>
        <Lepes cim="Vakrudak">
          <p>
            <strong>1. csomópont</strong>: terheletlen, két rúd (1–2 függőleges, 1–3 ferde) → <M>{"S_{1,2} = S_{1,3} = 0"}</M> (a eset). <strong>4. csomópont</strong>: 2–4 és 4–6 egy egyenesben → <M>{"S_{3,4} = 0"}</M> (b eset).{" "}
            <strong>5. csomópont</strong>: 3–5 és 5–7 a felső öv egyenesében → <M>{"S_{5,6} = 0"}</M>. (A jobb oldalon ugyanígy <M>{"S_{9,10} = S_{9,11} = S_{11,12} = 0"}</M>.)
          </p>
        </Lepes>
        <Lepes cim="2. csomópont (A) → S₂,₃ és S₂,₄">
          <p>
            A 2–3 rúd hossza <M>{"\\sqrt{2^2 + 2{,}4^2} = 3{,}124"}</M> m, iránya <M>{"(0{,}6402;\\ 0{,}7682)"}</M>. A csomóponton hat <M>{"A_x = 6"}</M> jobbra, <M>{"A_y = 11{,}2"}</M> felfelé, <M>{"S_{1,2} = 0"}</M>:
          </p>
          <MB>{"\\Fy 11{,}2 + 0{,}7682\\,S_{2,3} = 0 \\;\\Rightarrow\\; S_{2,3} = -14{,}58\\ \\text{kN (nyomott)}"}</MB>
          <MB>{"\\Fx 6 + 0{,}6402\\cdot(-14{,}58) + S_{2,4} = 0 \\;\\Rightarrow\\; S_{2,4} = 3{,}333\\ \\text{kN (húzott)};\\qquad 4:\\ \\Fx -3{,}333 + S_{4,6} = 0 \\;\\Rightarrow\\; S_{4,6} = 3{,}333"}</MB>
        </Lepes>
        <Lepes cim="3. csomópont → S₃,₅ és S₃,₆">
          <p>
            Irányok a 3. csomópontból: az 5. felé <M>{"(0{,}9806;\\ 0{,}1961)"}</M> (hossz 2,040 m), a 6. felé <M>{"(0{,}6402;\\ -0{,}7682)"}</M>, a 2. felé <M>{"(-0{,}6402;\\ -0{,}7682)"}</M>. A <M>{"3\\text{–}6"}</M> rúdra merőleges{" "}
            <M>{"t = (0{,}7682;\\ 0{,}6402)"}</M> irányú vetületben csak <M>{"S_{3,5}"}</M> marad ismeretlen:
          </p>
          <MB>{"\\textstyle\\sum F_{it}:\\ -12\\cdot 0{,}6402 - 0{,}9836\\cdot(-14{,}58) + 0{,}8789\\,S_{3,5} = 0 \\;\\Rightarrow\\; S_{3,5} = -7{,}576\\ \\text{kN (nyomott)}"}</MB>
          <MB>{"\\Fy -12 - 0{,}7682\\cdot(-14{,}58) + 0{,}1961\\cdot(-7{,}576) - 0{,}7682\\,S_{3,6} = 0 \\;\\Rightarrow\\; S_{3,6} = -2{,}975\\ \\text{kN (nyomott)}"}</MB>
        </Lepes>
        <Lepes cim="5., 6. csomópont → S₅,₇, S₆,₇ és ellenőrzés">
          <MB>{"5:\\quad \\Fx -0{,}9806\\cdot(-7{,}576) + 0{,}9806\\,S_{5,7} = 0 \\;\\Rightarrow\\; S_{5,7} = -7{,}576\\ \\text{kN}"}</MB>
          <p>A 6–7 rúd iránya a 6-osból <M>{"(0{,}53;\\ 0{,}848)"}</M> (hossz 3,774 m):</p>
          <MB>{"6:\\quad \\Fy 0{,}7682\\cdot(-2{,}975) + 0{,}848\\,S_{6,7} = 0 \\;\\Rightarrow\\; S_{6,7} = 2{,}695\\ \\text{kN (húzott)}"}</MB>
          <MB>{"\\text{ellenőrzés (6):}\\quad \\Fx -0{,}6402\\cdot(-2{,}975) - 3{,}333 + 0{,}53\\cdot 2{,}695 = 1{,}905 - 3{,}333 + 1{,}428 = 0\\ \\checkmark"}</MB>
        </Lepes>
        <Lepes cim="Rúderőtáblázat (1–7 csomópontok közötti rudak)">
          <div className="mt-1 max-w-sm">
            <RudErokTabla eredmeny={T5} rudak={["1,2", "1,3", "2,3", "2,4", "3,4", "3,5", "3,6", "4,6", "5,6", "5,7", "6,7"]} kicsi />
          </div>
          <p className="mt-2">
            A jobb oldali rész is végigszámolható a 12. (B) csomópontból indulva: <M>{"S_{9,12} = -10{,}07"}</M>, <M>{"S_{10,12} = S_{8,10} = -1{,}111"}</M>, <M>{"S_{8,9} = 2{,}288"}</M>, <M>{"S_{7,9} = -6{,}119"}</M>,{" "}
            <M>{"S_{7,8} = -2"}</M> kN. Ellenőrzés a 7. csomóponton: <M>{"\\Fx 7{,}429 - 1{,}428 - 6{,}000 = 0\\ \\checkmark"}</M>.
          </p>
        </Lepes>
      </KidolgozottFeladat>

      {/* ==================== GYF‑6 ==================== */}
      <KidolgozottFeladat
        jel="GYF‑6"
        ido="8 perc"
        forras="Vizsgaminta, 3. feladat"
        cim="Vizsga-típus: ferde felső öv, három rúd átmetszéssel — a főpont a tartón kívül"
        feladat={
          <p>
            Rácsos tartó négy <M>{"5\\ \\text{m}"}</M> széles mezővel; az alsó öv vízszintes (6–10, a 6. csukló, a 10. görgő), a felső öv (1–5) egyenes, bal végén 5 m, jobb végén 9 m magasan. A rácsrudak az 1–7, 2–8, 3–9, 4–10
            csomópontokat kötik össze. A 3. csomóponton <M>{"8\\ \\text{kN}"}</M> függőleges erő hat. Határozd meg az átmetszésben szereplő <M>{"2\\text{–}3,\\ 2\\text{–}8,\\ 7\\text{–}8"}</M> rudakban működő erőket! (A rúderők
            helyes előjellel érnek pontot.)
          </p>
        }
        abra={
          <AbraKeret cim="A vizsgaminta rajza. A felső öv meredeksége 4/20 = 0,2; a 2. csomópont (5; 6), a 3. (10; 7) m.">
            <AbraGyf6 />
          </AbraKeret>
        }
        tanulsag={
          <p>
            Ferde övnél a két öv nem párhuzamos: a rácsrúd főpontja a két öv egyenesének metszéspontja, ami itt a tartón kívül, 25 m-re balra van — semmi gond, a nyomatéki egyenletet oda írjuk. A karokat komponensenként
            számoljuk: a rúderőt felbontjuk vízszintes és függőleges vetületre, és mindkettőnek a karját nézzük (<M>{"M = x\\,F_y - y\\,F_x"}</M>). A bal rész választása itt is előny: egyetlen külső erő, az{" "}
            <M>{"A = 4"}</M> kN reakció.
          </p>
        }
      >
        <Lepes cim="Reakciók és geometria">
          <MB>{"\\Mp{A} -10\\cdot 8 + 20\\,B = 0 \\;\\Rightarrow\\; B = 4\\ \\text{kN};\\qquad \\Fy A_y = 4\\ \\text{kN};\\qquad \\Fx A_x = 0"}</MB>
          <p>
            Irányegységvektorok a 2. csomópontból: a 3. felé <M>{"(5;\\ 1)/\\sqrt{26} = (0{,}9806;\\ 0{,}1961)"}</M>, a 8. felé <M>{"(5;\\ -6)/\\sqrt{61} = (0{,}6402;\\ -0{,}7682)"}</M>; a 7–8 rúd vízszintes.
          </p>
        </Lepes>
        <Lepes cim="Elkülönítés: a bal rész (1, 2, 6, 7)">
          <MB>{"(\\underline{A}, \\underline{S}_{2,3}, \\underline{S}_{2,8}, \\underline{S}_{7,8}) \\ekv \\underline{O}"}</MB>
        </Lepes>
        <Lepes cim="Nyomatéki egyenlet a 8. főpontra → S₂,₃">
          <p>
            A 8. ponton (10; 0) átmegy <M>{"S_{2,8}"}</M> és <M>{"S_{7,8}"}</M>. <M>{"A_y"}</M> karja 10 m (negatív forgatás). <M>{"S_{2,3}"}</M> a (5; 6) pontban hat: függőleges komponense <M>{"0{,}1961\\,S"}</M>, karja <M>{"5 - 10 = -5"}</M>{" "}
            m; vízszintes komponense <M>{"0{,}9806\\,S"}</M>, karja 6 m a pont fölött (negatív): összesen <M>{"(-5)(0{,}1961) - 6(0{,}9806) = -6{,}864"}</M> m·S:
          </p>
          <MB>{"\\Mp{8} -10\\cdot 4 - 6{,}864\\,S_{2,3} = 0 \\;\\Rightarrow\\; S_{2,3} = -5{,}827\\ \\text{kN (nyomott)}"}</MB>
        </Lepes>
        <Lepes cim="Nyomatéki egyenlet a P főpontra → S₂,₈">
          <p>
            <M>{"S_{2,3}"}</M> és <M>{"S_{7,8}"}</M> hatásvonala (a két öv egyenese) a <M>{"P = (-25;\\ 0)"}</M> pontban metszi egymást (a felső öv <M>{"y = 5 + 0{,}2x"}</M> ott metszi az <M>{"y = 0"}</M> egyenest). <M>{"A_y"}</M> karja 25 m
            (pozitív), <M>{"S_{2,8}"}</M> komponenseinek karja: <M>{"(5 + 25)(-0{,}7682) - 6\\cdot 0{,}6402 = -26{,}89"}</M> m:
          </p>
          <MB>{"\\Mp{P} 25\\cdot 4 - 26{,}89\\,S_{2,8} = 0 \\;\\Rightarrow\\; S_{2,8} = 3{,}719\\ \\text{kN (húzott)}"}</MB>
        </Lepes>
        <Lepes cim="Nyomatéki egyenlet a 2. főpontra → S₇,₈ és ellenőrzés">
          <MB>{"\\Mp{2} -5\\cdot 4 + 6\\,S_{7,8} = 0 \\;\\Rightarrow\\; S_{7,8} = 3{,}333\\ \\text{kN (húzott)}"}</MB>
          <MB>{"\\text{ellenőrzés:}\\quad \\Fx 0{,}9806\\cdot(-5{,}827) + 0{,}6402\\cdot 3{,}719 + 3{,}333 = -5{,}714 + 2{,}381 + 3{,}333 = 0\\ \\checkmark"}</MB>
          <p>
            Ugyanez a jobb részből (3, 4, 5, 8, 9, 10; rá hat a 8 kN és <M>{"B = 4"}</M>): <M>{"\\Mp{8} 10\\cdot 4 + 6{,}864\\,S_{2,3} = 0"}</M> (a 8 kN a 8. pont fölött hat, karja nulla) — ugyanaz a −5,827 kN. A teljes
            táblázat a kalkulátorban megnézhető; a kért három rúd:
          </p>
          <div className="mt-2 max-w-sm">
            <RudErokTabla eredmeny={T6} rudak={["2,3", "2,8", "7,8"]} kicsi />
          </div>
        </Lepes>
      </KidolgozottFeladat>

      {/* ==================== GYF‑7 ==================== */}
      <KidolgozottFeladat
        jel="GYF‑7"
        ido="7 perc"
        forras="Tankönyv 6.5 (6.10. ábra)"
        cim="Rúdján terhelt rácsos tartó — helyettesítés csomóponti terhekkel"
        feladat={
          <p>
            A GYF‑1 tartóját (Warren, <M>{"a = 1{,}5"}</M>, <M>{"h = 2\\ \\text{m}"}</M>) most nem csomóponton, hanem a <M>{"3\\text{–}5"}</M> alsó övrúd <em>közepén</em> terheli a <M>{"P = 8\\ \\text{kN}"}</M> függőleges erő. Határozd meg a
            rúderőket, és mondd meg, mi ébred a 3–5 rúdban a rúderőn kívül!
          </p>
        }
        abra={
          <AbraKeret cim="A teher a 3–5 rúd felezőpontjában hat — ez a rúd nem viselkedik tiszta rúdként: hajlítás is ébred benne.">
            <AbraGyf7 />
          </AbraKeret>
        }
        tanulsag={
          <p>
            A terhelt rudat elkülönítjük: kéttámaszú tartóként a végein <M>{"P/2"}</M>–<M>{"P/2"}</M> merőleges rúdvégi erő ébred (a j, illetve k végpontra írt nyomatéki egyenletből), rúdirányú vetülete a függőleges tehernek nincs (<M>{"F^S = 0"}</M>). A rúdvégi erők
            ellentettjei csomóponti terhek: a rácsos tartót ezekkel a szokásos módon oldjuk meg. A 3–5 rúdban viszont a rúderő (<M>{"N = 6"}</M> kN húzás) <em>mellett</em> nyíróerő (<M>{"\\pm 4"}</M> kN) és hajlítónyomaték (
            <M>{"P\\ell/4 = 8\\cdot 3/4 = 6"}</M> kNm) is működik — ezt a 9. modul (igénybevételi ábrák) tárgyalja.
          </p>
        }
      >
        <Lepes cim="A terhelt rúd elkülönítése és helyettesítése">
          <p>
            A 3–5 rúd (hossza 3 m) végein a csuklókban belső erőket veszünk fel: rúdirányú <M>{"S^S"}</M> és merőleges <M>{"S^m"}</M> komponenst. A 3. végpontra írt nyomatéki egyenletből <M>{"S^m_5"}</M>, az 5.-re írtból{" "}
            <M>{"S^m_3"}</M>:
          </p>
          <MB>{"\\Mp{3} -1{,}5\\cdot 8 + 3\\,S^m_5 = 0 \\;\\Rightarrow\\; S^m_5 = 4\\ \\text{kN};\\qquad \\Mp{5} 1{,}5\\cdot 8 - 3\\,S^m_3 = 0 \\;\\Rightarrow\\; S^m_3 = 4\\ \\text{kN};\\qquad F^S = 0 \\Rightarrow S^S_5 = S^S_3"}</MB>
          <p>
            A rúdvégi erők ellentettjei a csomópontokra hatnak: a 3. és az 5. csomópontra <M>{"4\\text{–}4"}</M> kN lefelé. Innen a szerkezet egy csomóponton terhelt rácsos tartó (a 3–5 rúd rúdereje <M>{"S_{3,5} = S^S"}</M>).
          </p>
        </Lepes>
        <Lepes cim="Reakciók és csomóponti módszer">
          <MB>{"\\Mp{A} -3\\cdot 4 - 6\\cdot 4 + 9\\,B = 0 \\;\\Rightarrow\\; B = 4;\\qquad A_y = 4\\ \\text{kN},\\quad A_x = 0"}</MB>
          <MB>{"1:\\ \\Fy 4 + 0{,}8\\,S_{1,2} = 0 \\Rightarrow S_{1,2} = -5;\\quad \\Fx 0{,}6\\cdot(-5) + S_{1,3} = 0 \\Rightarrow S_{1,3} = 3"}</MB>
          <MB>{"2:\\ \\Fy 0{,}8\\cdot 5 - 0{,}8\\,S_{2,3} = 0 \\Rightarrow S_{2,3} = 5;\\quad \\Fx 0{,}6\\cdot 5 + 0{,}6\\cdot 5 + S_{2,4} = 0 \\Rightarrow S_{2,4} = -6"}</MB>
          <MB>{"3:\\ \\Fy -4 + 0{,}8\\cdot 5 + 0{,}8\\,S_{3,4} = 0 \\Rightarrow S_{3,4} = 0;\\quad \\Fx -3 - 0{,}6\\cdot 5 + S_{3,5} = 0 \\Rightarrow S_{3,5} = 6\\ \\text{kN (húzott)}"}</MB>
          <p>
            A szimmetria miatt <M>{"S_{4,5} = 0"}</M>, <M>{"S_{4,6} = -6"}</M>, <M>{"S_{5,6} = 5"}</M>, <M>{"S_{5,7} = 3"}</M>, <M>{"S_{6,7} = -5"}</M> kN. Két vakrúd (3–4, 4–5) — ezek nem az alapesetekből, hanem a számításból derülnek ki.
          </p>
        </Lepes>
        <Lepes cim="Mi működik a 3–5 rúdban?">
          <p>
            A rúd tengelyében <M>{"N = S_{3,5} = 6"}</M> kN húzás; emellett a rúd egy 3 m-es kéttámaszú gerenda a közepén 8 kN-nal: <M>{"V = \\pm 4"}</M> kN, <M>{"M_{\\max} = 8\\cdot 3/4 = 6"}</M> kNm a közepén (alul húzott). Ezt a
            merevségi módszerrel is ellenőriztük: a 3–5 rúdban <M>{"N = 6{,}000"}</M>, <M>{"M_{\\max} = 6{,}000"}</M> kNm, a többi rúdban <M>{"M = 0"}</M>.
          </p>
          <div className="mt-2 max-w-sm">
            <RudErokTabla eredmeny={T7} kicsi />
          </div>
        </Lepes>
      </KidolgozottFeladat>
    </>
  );
}
