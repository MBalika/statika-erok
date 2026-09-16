import { M, MB } from "@/components/ui/Keplet";

/** A 7. modul (rácsos tartók) puska-lapja: a Doboz komponenst a puska-oldal adja. */
export default function Puska({ Doboz }) {
  return (
    <>
      <Doboz cim="Rácsos tartó — feltételek és számlálás">
        <p>
          Csuklós csomópontok, egyenes rudak, <strong>csak csomóponti teher</strong> → a rudakban csak rúderő (<M>{"S"}</M>) ébred, <strong>mindig húzottnak</strong> felvéve (<M>{"S < 0"}</M> = nyomott). Jelölés: <M>{"S_{i,j}"}</M>, a kisebb sorszám elöl.
        </p>
        <MB>{"e = 2c,\\qquad i = r + k,\\qquad 2c = r + k \\Rightarrow \\text{határozott}"}</MB>
        <p>
          <M>{"r"}</M> rudak, <M>{"k"}</M> kényszerfokszám (csukló 2, görgő 1), <M>{"c"}</M> csomópontok. X-rácsozás: <M>{"r + k > 2c"}</M> — határozatlan. Elnevezések: övrúd (felső/alsó öv), oszlop, rácsrúd, összekötő rúd.
        </p>
      </Doboz>
      <Doboz cim="A recept">
        <ol className="list-decimal space-y-0.5 pl-4">
          <li>Reakciók az egész rácsozatból (egy merev test: <M>{"\\Mp{A} \\to B,\\ \\Fx \\to A_x,\\ \\Fy \\to A_y"}</M>).</li>
          <li>Vakrudak ránézésre (három alapeset), a rúd tengelyére rajzolt kis kör.</li>
          <li>Csomóponti módszer a támaszoktól befelé, vagy átmetszés a belső rudakhoz.</li>
          <li>Ellenőrzés a nem használt csomóponti / vetületi egyenlettel.</li>
          <li>Eredmény: <strong>rúderőtáblázat</strong> (rúd | húzott [kN] | nyomott [kN]).</li>
        </ol>
      </Doboz>
      <Doboz cim="Csomóponti módszer">
        <p>
          Olyan csomópont, ahol <strong>≤ 2 ismeretlen</strong> rúderő van (vagy 3, de kettő egy egyenesben). Két vetületi egyenlet; az elsőt a <em>másik</em> ismeretlen rúdra <strong>merőlegesen</strong> vetítve írd (így egyismeretlenes), a
          másodikba az előbb kiszámolt rúderő vetületét <strong>ne hagyd ki</strong>.
        </p>
        <MB>{"\\Fy A_y + \\sin\\alpha\\,S_{1,2} = 0 \\;\\Rightarrow\\; S_{1,2};\\qquad \\Fx A_x + \\cos\\alpha\\,S_{1,2} + S_{1,3} = 0 \\;\\Rightarrow\\; S_{1,3}"}</MB>
        <p>A rúd a csomópontot mindig a rúd <em>másik vége felé</em> húzja: ismert rúderő = <M>{"S\\,(e_x, e_y)"}</M> a saját előjelével. A kerekítési hiba továbbgörög — a végénél érdemes a másik támasztól is indulni.</p>
      </Doboz>
      <Doboz cim="Vakrudak — három alapeset (6.5. ábra)">
        <ul className="list-disc space-y-0.5 pl-4">
          <li><strong>a)</strong> terheletlen csomópont, két nem egy egyenesbe eső rúd → <strong>mindkettő</strong> vakrúd;</li>
          <li><strong>b)</strong> terheletlen csomópont, három rúd, kettő egy egyenesben → a <strong>harmadik</strong> vakrúd (a két egy egyenesbe eső rúd ereje egyenlő);</li>
          <li><strong>c)</strong> két rúd + a csomópont terhe (vagy ismert irányú reakciója) az egyik rúd egyenesében → a <strong>másik</strong> vakrúd.</li>
        </ul>
        <p>Mindig a közös egyenesre merőleges vetületi egyenletből. Ha találtál egyet, nézd újra a szomszédos csomópontokat (továbbterjed). Csuklós támasznál előbb a reakció kell (irány!). A vakrúd a teherállástól függ — nem hagyjuk el.</p>
      </Doboz>
      <Doboz cim="Hármas átmetszés (Ritter)">
        <p>
          Három rúd átvágásával a tartó <strong>két részre</strong> esik; az egyik részre (amelyikre kevesebb külső erő hat) három egyensúlyi egyenlet. Minden rúderőhöz a másik kettő metszéspontja a <strong>főpont</strong>:
        </p>
        <MB>{"\\Mp{\\text{főpont}} \\sum(\\text{külső erők nyomatéka}) + k\\,S = 0 \\;\\Rightarrow\\; S;\\qquad \\text{párhuzamos övek: rácsrúd a } \\Fy\\text{-ból}"}</MB>
        <p>
          Párhuzamos övű tartó: felső öv → nyomaték az alsó öv csomópontjára (<M>{"S = -M/h"}</M>), alsó öv → nyomaték a felső csomópontra, rácsrúd → függőleges vetület (<M>{"S\\sin\\alpha = -V"}</M>). Ferde öv: a főpont a tartón kívül is lehet; a rúderő komponenseit külön karral: <M>{"M = x\\,S_y - y\\,S_x"}</M>.
        </p>
      </Doboz>
      <Doboz cim="Négyes átmetszés (K-rács), mellékrácsozás">
        <p>
          <strong>K-rács</strong>: ferde átmetszés az oszlopon (két öv + a két oszlopfél): a két oszlopfél ereje közös hatásvonalú → az oszlop alsó/felső végpontjára írt nyomatékból az övek egyenként; a két oszlopfélnek csak az eredője. Egyenes átmetszés a mezőn (két ismert öv + a K két szára) → a szárak két vetületi egyenletből (ellentett előjelűek).
        </p>
        <p><strong>Mellékrácsozás</strong>: a mellékrudak csomóponti módszerrel (függőleges az alsó csomópontból, ferde a felsőből, a fő rácsrúdra merőleges vetület), vagy hármas + négyes átmetszés.</p>
      </Doboz>
      <Doboz cim="Külsőleg összetett és rúdján terhelt tartó">
        <p>
          <strong>Gerber / háromcsuklós rácsos tartó</strong>: a rácsozatok merev testek → előbb az összetett tartó reakciói (6. modul), utána rúderők. Két csukló + egy összekötő csomópont: <M>{"\\Mp{A}, \\Mp{B}"}</M> az egészre, <M>{"\\Mp{C}"}</M> az egyik részre → <M>{"A_x"}</M>, <M>{"\\Fx"}</M> → <M>{"B_x"}</M>.
        </p>
        <p>
          <strong>Rúdján terhelt rúd</strong>: elkülönítve kéttámaszú tartó; a végeken <M>{"S^m_j, S^m_k"}</M> (nyomaték a másik végpontra), <M>{"S^S_k = S^S_j - F^S"}</M>; ezek ellentettjei csomóponti terhek. A terhelt rúdban <M>{"N"}</M> mellett <M>{"V"}</M> és <M>{"M"}</M> is ébred (<M>{"M_{\\max} = P\\,c_1 c_2/\\ell"}</M>).
        </p>
      </Doboz>
      <Doboz cim="Szemlélet és tipikus hibák" szeles>
        <ul className="list-disc space-y-0.5 pl-4">
          <li>Övek ↔ nyomatéki ábra (lefelé ható teher: felső öv nyomott, alsó húzott, maximum a terhek alatt); rácsrudak ↔ nyíróerő (a támasz felé nőnek, a teher alatt előjelet váltanak).</li>
          <li>Nyomottnak felvett rúderő → előjel-káosz a következő csomópontban. Mindig húzott!</li>
          <li>A főpont a két <em>kizárandó</em> rúd metszéspontja — nem a keresett rúd egy pontja.</li>
          <li>Négy rúd átvágva = négy ismeretlen, három egyenlet (kivéve K-rács). Számold meg a vágást.</li>
          <li>Vakrúd-szabály csak <em>terheletlen</em> csomópontra (a, b) — a terhelt oszlop nem vakrúd, hanem <M>{"S = -F"}</M>.</li>
          <li>Rúderőtáblázat: pozitív számok, külön oszlop húzott / nyomott; a vakrúd: 0.</li>
        </ul>
      </Doboz>
    </>
  );
}
