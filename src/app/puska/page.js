import { M, MB } from "@/components/ui/Keplet";
import NyomtatasGomb from "@/components/NyomtatasGomb";
import PuskaOsszetett from "@/components/osszetett/Puska";
import PuskaRacsos from "@/components/racsos/Puska";
import PuskaHatarozottsag from "@/components/hatarozottsag/Puska";

export const metadata = {
  title: "Puska",
  description: "Nyomtatható egyoldalas összefoglaló minden modulhoz és a tankönyv nyelvéhez: képletek, szabályok, tipikus hibák.",
};

function Lap({ szam, cim, gyerekek }) {
  return (
    <section className="puska-lap mb-8 rounded-2xl border border-[color:var(--keret)] bg-white p-5 sm:p-7 print:mb-0 print:rounded-none print:border-0 print:p-0">
      <div className="flex items-center gap-3 border-b-2 border-naracs-500 pb-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-naracs-500 text-[15px] font-bold text-white print:bg-black">{szam}</span>
        <h2 className="text-xl font-bold text-petrol-900">{cim}</h2>
        <span className="ml-auto text-[11px] tracking-[0.16em] text-petrol-400 uppercase">Statika · puska</span>
      </div>
      <div className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2 [&>*]:min-w-0">{gyerekek}</div>
    </section>
  );
}

function Doboz({ cim, children, szeles = false }) {
  return (
    <div className={`min-w-0 overflow-hidden rounded-xl border border-petrol-100 bg-petrol-50/50 px-3.5 py-2.5 print:border-gray-300 print:bg-white ${szeles ? "sm:col-span-2" : ""}`}>
      <p className="text-[10.5px] font-bold tracking-[0.14em] text-naracs-700 uppercase">{cim}</p>
      <div className="proza szamok mt-1 text-[13px] leading-snug text-petrol-800 [&_.katex-display]:my-1">{children}</div>
    </div>
  );
}

export default function PuskaOldal() {
  return (
    <>
      <div className="racs-hatter nyomtatasban-rejtve border-b border-petrol-800 bg-linear-to-br from-petrol-900 via-petrol-800 to-petrol-700">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-naracs-500 text-[15px] font-bold text-white">✎</span>
            <span className="text-[11px] font-semibold tracking-[0.2em] text-petrol-300 uppercase">Összefoglaló</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">Puska — kilenc lap</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-petrol-200">
            A legfontosabb képletek, szabályok és a tipikus hibák, modulonként egy oldalon (az összetett és a rácsos tartókkal együtt), plusz egy lap a tankönyv nyelvéről (kijelentések, egyenletek írásmódja, szótár). Nyomtasd ki, vagy mentsd PDF-be — de előbb próbáld
            meg fejből leírni, aztán hasonlítsd össze.
          </p>
          <div className="mt-5">
            <NyomtatasGomb />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 print:max-w-none print:p-0">
        <Lap
          szam={1}
          cim="Vektorok, erők megadása"
          gyerekek={
            <>
              <Doboz cim="Komponensek irányszögből">
                <MB>{"F_x = F\\cos\\alpha,\\qquad F_y = F\\sin\\alpha"}</MB>
                <p>α az x tengelytől, az óramutatóval ellentétesen. Ha a szöget a függőlegestől adták meg, sin és cos szerepet cserél.</p>
              </Doboz>
              <Doboz cim="Nagyság és irány komponensekből">
                <MB>{"|\\underline{F}| = \\sqrt{F_x^2 + F_y^2},\\qquad \\alpha = \\operatorname{arctg}\\frac{F_y}{F_x}"}</MB>
                <p>A II. és III. síknegyedben +180°.</p>
              </Doboz>
              <Doboz cim="Síknegyedek">
                <p>I: +,+ · II: −,+ · III: −,− · IV: +,−. Az arctg csak ±90°-ot ad — a síknegyedet a komponensek előjeléből döntsd el.</p>
              </Doboz>
              <Doboz cim="Összeadás">
                <MB>{"R_x = \\sum F_{ix},\\qquad R_y = \\sum F_{iy}"}</MB>
                <p>Rajzban: láncszabály (tip-to-tail) — a lánc vége az eredő hegye.</p>
              </Doboz>
              <Doboz cim="Egyensúly">
                <MB>{"\\sum F_{ix} = 0,\\qquad \\sum F_{iy} = 0"}</MB>
                <p>A vektorsokszög bezárul. A hiányzó erő a többi összegének ellentettje.</p>
              </Doboz>
              <Doboz cim="Vetület, skaláris szorzat">
                <MB>{"F_t = F\\cos\\varphi = F_x\\cos\\alpha_t + F_y\\sin\\alpha_t"}</MB>
                <MB>{"\\underline{a}\\cdot\\underline{b} = a_x b_x + a_y b_y = |a||b|\\cos\\varphi"}</MB>
                <p>φ &gt; 90° → a vetület negatív.</p>
              </Doboz>
              <Doboz cim="Hatásvonal két ponton át">
                <MB>{"\\underline{e} = \\frac{\\overrightarrow{AB}}{|\\overrightarrow{AB}|},\\qquad \\underline{F} = F\\,\\underline{e}"}</MB>
              </Doboz>
              <Doboz cim="Térben">
                <MB>{"|\\underline{F}| = \\sqrt{F_x^2 + F_y^2 + F_z^2}"}</MB>
                <p>Összeadás komponensenként, ugyanúgy, mint síkban.</p>
              </Doboz>
              <Doboz cim="Tipikus hibák" szeles>
                <p>Felcserélt sin/cos (melyik tengelytől mérték a szöget?) · hiányzó előjel a II–IV. síknegyedben · az arctg eredményét síknegyed nélkül elfogadni · nagyságokat összeadni vektorok helyett.</p>
              </Doboz>
            </>
          }
        />

        <Lap
          szam={2}
          cim="Nyomaték, eredő, redukálás"
          gyerekek={
            <>
              <Doboz cim="Nyomaték egy pontra (sík)">
                <MB>{"M^{(O)} = x F_y - y F_x = \\pm F\\,k"}</MB>
                <p>Pozitív: az óramutatóval ellentétes forgatás. k az erő karja: a pont távolsága a hatásvonaltól.</p>
              </Doboz>
              <Doboz cim="Erőpár">
                <p>Két egyenlő, ellentétes, párhuzamos erő: R = 0, M = F·k minden pontra ugyanaz. Szabad vektor — bárhová eltolható.</p>
              </Doboz>
              <Doboz cim="Redukálás egy pontra">
                <MB>{"\\underline{R} = \\sum \\underline{F}_i"}</MB>
                <MB>{"M^{(O)} = \\sum \\left(x_i F_{iy} - y_i F_{ix}\\right) + \\sum M_j"}</MB>
              </Doboz>
              <Doboz cim="Az eredő három esete">
                <p>R ≠ 0 → <strong>egyetlen erő</strong>, hatásvonala: <M>{"x_0 = M/R_y"}</M>, <M>{"y_0 = -M/R_x"}</M>. R = 0, M ≠ 0 → <strong>erőpár</strong>. R = 0, M = 0 → <strong>zérusrendszer</strong> (egyensúly).</p>
              </Doboz>
              <Doboz cim="Átszámítás másik pontra">
                <MB>{"M^{(B)} = M^{(A)} + (x_A - x_B)R_y - (y_A - y_B)R_x"}</MB>
                <p>Az erő nem változik, csak a nyomaték.</p>
              </Doboz>
              <Doboz cim="Párhuzamos erők">
                <MB>{"R = \\sum F_i,\\qquad x_R = \\frac{\\sum x_i F_i}{\\sum F_i}"}</MB>
              </Doboz>
              <Doboz cim="Térben: r × F">
                <MB>{"M_x = yF_z - zF_y,\\quad M_y = zF_x - xF_z"}</MB>
                <MB>{"M_z = xF_y - yF_x"}</MB>
                <p>Merőleges r és F síkjára, jobbkéz-szabály. Tengellyel párhuzamos erő arra a tengelyre nem forgat.</p>
              </Doboz>
              <Doboz cim="Tipikus hibák">
                <p>−y·Fx előjele · „ΣF = 0, tehát egyensúly” (a nyomaték is kell!) · a redukálásnál az erőt is „átszámolni” · x₀ előjelét elhagyni.</p>
              </Doboz>
            </>
          }
        />

        <Lap
          szam={3}
          cim="Megoszló erők"
          gyerekek={
            <>
              <Doboz cim="Két szabály">
                <MB>{"R = \\int p\\,dx = \\text{a teherábra területe}"}</MB>
                <p>Az eredő helye: a teherábra súlypontja.</p>
                <p>Koordináták: x a tartó mentén, z lefelé; a lefelé ható teher pozitív.</p>
              </Doboz>
              <Doboz cim="Alapesetek">
                <p>Téglalap: <M>{"R = pL"}</M>, a közepén. Háromszög: <M>{"R = \\tfrac12 pL"}</M>, a <strong>magas oldaltól</strong> L/3-ra. Trapéz: <M>{"R = \\tfrac{p_1+p_2}{2}L"}</M>, <M>{"k = \\tfrac{L}{3}\\cdot\\tfrac{p_1 + 2p_2}{p_1 + p_2}"}</M> a p₁ oldaltól.</p>
              </Doboz>
              <Doboz cim="Felbontás, több szakasz">
                <MB>{"R = \\sum R_i,\\qquad k = \\frac{\\sum R_i x_i}{R}\\quad(R_i \\text{ előjeles})"}</MB>
                <p>Bármilyen felbontás ugyanazt az eredőt adja. R = 0 esetén az eredő erőpár.</p>
              </Doboz>
              <Doboz cim="Ferde rúd">
                <p>p a ferde hosszra (önsúly): <M>{"R = pL"}</M>. p a vízszintes vetületre (hó): <M>{"R = pL\\cos\\alpha"}</M>. Mindig nézd meg, mire vonatkozik.</p>
              </Doboz>
              <Doboz cim="Víznyomás">
                <MB>{"p_{max} = \\gamma h,\\qquad R = \\tfrac12\\gamma h^2\\ (\\text{1 m sávra})"}</MB>
                <p>Az eredő a fenéktől h/3-ra.</p>
              </Doboz>
              <Doboz cim="Mire nem jó az eredő">
                <p>Belső erőkre (igénybevételekre) nem — csak a tartó egészének egyensúlyára, reakciókra, felborulásra.</p>
              </Doboz>
              <Doboz cim="Tipikus hibák" szeles>
                <p>L/3 a rossz végtől · trapéz felbontásánál a háromszög magassága p₂ helyett p₂ − p₁ · felfelé ható szakasz előjele · hossz és vetület összekeverése · kN/m és kN/m² keverése.</p>
              </Doboz>
            </>
          }
        />

        <Lap
          szam={4}
          cim="Súlypont"
          gyerekek={
            <>
              <Doboz cim="Statikai nyomaték, súlypont">
                <MB>{"S_y = \\sum A_i z_i,\\qquad S_z = \\sum A_i y_i"}</MB>
                <MB>{"z_S = \\frac{S_y}{A},\\qquad y_S = \\frac{S_z}{A}"}</MB>
                <p>Keresztmetszetnél: y balra, z lefelé. S<sub>y</sub>-hoz a z távolság tartozik!</p>
              </Doboz>
              <Doboz cim="Alapidomok">
                <p>Téglalap: a közepe. Derékszögű háromszög: a derékszögű csúcstól a befogók harmadára (A = ah/2). Félkör és negyedkör: az egyenes él(ek)től <M>{"4r/3\\pi \\approx 0{,}424r"}</M>. Általános háromszög: a csúcsok átlaga.</p>
              </Doboz>
              <Doboz cim="A három lépés">
                <p>1. Felbontás alapidomokra (hozzáadva / kivonva). 2. Táblázat: Aᵢ, yᵢ, zᵢ, Aᵢyᵢ, Aᵢzᵢ, összegek. 3. Osztás az összterülettel.</p>
              </Doboz>
              <Doboz cim="Kivonásos módszer">
                <p>A lyuk területe <em>és</em> statikai nyomatéka is negatív. A súlypont a kivont résztől elfelé, a hozzáadott felé tolódik.</p>
              </Doboz>
              <Doboz cim="Szimmetria">
                <p>A súlypont minden szimmetriatengelyen rajta van; két tengelynél a metszéspont. Az anyagon kívül is lehet (L, U, körgyűrű).</p>
              </Doboz>
              <Doboz cim="Kapcsolat">
                <p>A megoszló teher eredője a teherábra súlypontján megy át. A súlyponti tengelyre S = 0 — hajlításnál ez a semleges tengely.</p>
              </Doboz>
              <Doboz cim="Tipikus hibák" szeles>
                <p>A rész súlypontját a saját szélétől mérni a közös origó helyett · Sy és Sz felcserélése · a kivont rész nyomatékát pozitívan venni · negatív koordinátát „hibának” hinni.</p>
              </Doboz>
            </>
          }
        />

        <Lap
          szam={5}
          cim="A tankönyv nyelve"
          gyerekek={
            <>
              <Doboz cim="Egyenértékűségi kijelentés">
                <MB>{"(\\underline{F}_1, \\underline{F}_2, \\underline{F}_3) \\ekv \\underline{R}"}</MB>
                <p>Két erőrendszer egyenértékű, ha ugyanaz a hatásuk — a ≐ kijelentés, nem egyenlet. Tulajdonságai: <strong>tranzitív</strong> (𝓐 ≐ 𝓑 és 𝓐 ≐ 𝓒 ⇒ 𝓒 ≐ 𝓑) · mindkét oldalt <strong>ugyanazzal az erővel</strong> kiegészíthetjük vagy csökkenthetjük · egy erő <strong>átvihető</strong> a másik oldalra, ha az előjelét megfordítjuk. Egyensúlyi rendszer hozzáadása az eredőt nem változtatja.</p>
              </Doboz>
              <Doboz cim="Egyensúlyi kijelentés">
                <MB>{"(\\underline{F}_1, \\ldots, \\underline{F}_n) \\ekv \\underline{O}"}</MB>
                <p>Olyan egyenértékűségi kijelentés, amelynek egyik oldalán zéruserő áll. Ismert és ismeretlen erők <em>ugyanazon</em> az oldalon. Síkban 3, térben 6 skalár egyenlet következik belőle — nem több.</p>
              </Doboz>
              <Doboz cim="Három feladattípus">
                <p><strong>Helyettesítés</strong>: az ismert erőrendszer egyik oldalon, a keresett eredő (egyetlen hatás) a másikon: (F₁, F₂, F₃) ≐ R. <strong>Egyensúlyozás</strong>: az ismert erőket ismeretlenekkel egészítjük ki zéruserőre: (F₁, F₂, F₃, C, D) ≐ O. <strong>Kiegészítés</strong>: a kettő keveréke, mindkét oldalon van ismeretlen: (A, B, P) ≐ R, ahol R pl. vízszintes.</p>
              </Doboz>
              <Doboz cim="Az egyenletek írásmódja">
                <p>A sor elején az egyenlet jellege és a pozitív irány:</p>
                <MB>{"\\Fx F_1\\cos\\alpha_1 + F_2 = R_x"}</MB>
                <MB>{"\\Fy F_1\\sin\\alpha_1 - F_3 = R_y"}</MB>
                <MB>{"\\Mp{A} F_2\\,k_2 - F_3\\,k_3 = M_A"}</MB>
                <MB>{"\\Fle q\\,L - A_z - B_z = 0"}</MB>
                <MB>{"\\Mj{O} q\\,L\\,\\tfrac{L}{2} - B_z\\,L = 0"}</MB>
                <p>Tartóknál ↓ és ↷ a pozitív (z lefelé); egyensúlynál a jobb oldal 0.</p>
              </Doboz>
              <Doboz cim="Erőrendszerek fajtái (2 × 4)">
                <p><strong>Síkbeli</strong> vagy <strong>térbeli</strong>, és ezen belül: <strong>közös hatásvonalú</strong> · <strong>közös metszéspontú</strong> · <strong>párhuzamos</strong> · <strong>általános helyzetű</strong> (szétszórt). A fajta dönti el, hány egyenletet írhatsz: közös metszéspontú síkban 2, általános síkban 3, térben 6.</p>
              </Doboz>
              <Doboz cim="Az eredő esetei">
                <p><strong>Síkban (3)</strong>: egyetlen erő (R ≠ 0) · erőpár (R = 0, M ≠ 0) · egyensúly (R = 0, M = 0).</p>
                <p><strong>Térben (4)</strong>, a társerő R és a társnyomaték M alapján: egyensúly (R = 0, M = 0) · nyomaték (R = 0, M ≠ 0) · egyetlen erő (R ≠ 0, <M>{"\\underline{R}\\cdot\\underline{M} = 0"}</M>: M merőleges R-re, eltolással eltüntethető) · <strong>erőcsavar</strong> (R ≠ 0, <M>{"\\underline{R}\\cdot\\underline{M} \\ne 0"}</M>: erő + a hatásvonalával párhuzamos nyomaték).</p>
              </Doboz>
              <Doboz cim="Szótár: itt ↔ a tankönyvben" szeles>
                <p>zérusrendszer ↔ egyensúlyi erőrendszer (zéruserő) · <M>{"M^{(O)}"}</M> ↔ <M>{"M_O"}</M> · <M>{"k"}</M> (az erő karja) ↔ <M>{"k"}</M> · <M>{"k"}</M> (az eredő helye, 3. modul) ↔ <M>{"x_R"}</M> · <M>{"p"}</M> ↔ <M>{"q"}</M> · <M>{"S_y"}</M> (4. modul, z lefelé) ↔ <M>{"S_{x'}"}</M> · vastag dőlt <strong><em>F</em></strong> ↔ aláhúzott <M>{"\\underline{F}"}</M> · erőrendszer ↔ 𝓕 = (F₁, F₂, …).</p>
              </Doboz>
              <Doboz cim="Tipikus hibák" szeles>
                <p>Kijelentés nélkül nekiállni az egyenleteknek (mit mivel helyettesítesz?) · a nyomatéki egyenletbe erőt, a vetületibe nyomatékot írni · az előjel-nyíl (→ ↑ ↶) hiánya a sor elejéről, majd elrontott előjel · „≐” helyett „=” — az erőrendszer nem szám · kevesebb vagy több egyenlet, mint amennyit a rendszer fajtája megenged.</p>
              </Doboz>
            </>
          }
        />

        <Lap
          szam={6}
          cim="Egyszerű tartók reakciói"
          gyerekek={
            <>
              <Doboz cim="Kényszerek és fokszámuk">
                <p>Görgő: 1 (a gördülési síkra merőleges erő). Rúd, kötél: 1 (rúdirányú, <strong>húzottnak</strong> felvéve). Csukló: 2 (A_x, A_y). Befogás: 3 (A_x, A_y, M_A).</p>
                <p>Síkban 3 független egyenlet → a fokszámok összege legalább 3 (de ez nem elég: három közös metszéspontú hatásvonal nem tartó).</p>
              </Doboz>
              <Doboz cim="A recept">
                <p>1. elkülönítés (támaszok helyett reakciók) · 2. egyensúlyi kijelentés <M>{"(\\underline F, \\underline p, \\underline A, \\underline B) \\ekv \\underline O"}</M> · 3. egyismeretlenes egyenletek · 4. ellenőrző egyenlet ≈ 0 · 5. eredményvázlat (tényleges irány, pozitív nagyság).</p>
              </Doboz>
              <Doboz cim="Egyismeretlenes egyenlet — mit zár ki?">
                <p>Egy erő nem szerepel a rá merőleges vetületi egyenletben és a hatásvonalára írt nyomatéki egyenletben; egy nyomaték nem szerepel a vetületi egyenletekben.</p>
                <p>Két nem párhuzamos ismeretlen → nyomatéki egyenlet a metszéspontjukra (<strong>főpont</strong>); két párhuzamos → rájuk merőleges vetületi egyenlet.</p>
              </Doboz>
              <Doboz cim="Kéttámaszú tartó">
                <MB>{"\\Mp{A}\\ \\ldots = 0 \\ \\Rightarrow\\ B"}</MB>
                <MB>{"\\Mp{B}\\ \\ldots = 0 \\ \\Rightarrow\\ A_y,\\qquad \\Fx \\Rightarrow A_x"}</MB>
                <p>Ellenőrzés: <M>{"\\Fy"}</M>. Ferde görgőnél B a síkra merőleges: a függőlegessel a sík hajlásszögét zárja be.</p>
              </Doboz>
              <Doboz cim="Befogott konzol">
                <MB>{"\\Fx \\Rightarrow A_x,\\qquad \\Fy \\Rightarrow A_y"}</MB>
                <MB>{"\\Mp{A} \\Rightarrow M_A"}</MB>
                <p>Ellenőrzés: nyomatéki egyenlet egy másik pontra (pl. a szabad végre).</p>
              </Doboz>
              <Doboz cim="Rúddal megtámasztott tartó">
                <p>Ugyanaz, mint a görgő: ismert hatásvonal, ismeretlen nagyság. Pozitív S = húzott, negatív S = nyomott rúd. Kötélnél S &lt; 0 nem lehet.</p>
                <p>Három rúd: főpontok O₁, O₂, O₃; két párhuzamos rúdnál a rájuk merőleges vetületi egyenlet.</p>
              </Doboz>
              <Doboz cim="Megoszló teher a tartón">
                <p>Az eredővel számolunk: nagysága a teherábra területe, helye a súlypont (téglalap: L/2, háromszög: L/3 a magas oldaltól) — <strong>csak a reakciókhoz</strong>, a belső erőkhöz nem.</p>
              </Doboz>
              <Doboz cim="Tipikus hibák" szeles>
                <p>A nyomatéki egyenletbe elfelejtett koncentrált nyomaték · a megoszló eredő rossz helyen · a ferde görgő reakciója „függőleges” · a rúderő nyomottnak felvéve és rosszul olvasva · előjelhiba, amit az ellenőrző egyenlet mutatna, de „úgyis kijött” · negatív B-t nem észrevenni: a görgő nem tud húzni, a tartó felbillen.</p>
              </Doboz>
            </>
          }
        />

        <Lap szam={7} cim="Összetett tartók" gyerekek={<PuskaOsszetett Doboz={Doboz} />} />
        <Lap szam={8} cim="Rácsos tartók" gyerekek={<PuskaRacsos Doboz={Doboz} />} />
        <Lap szam={9} cim="Statikai határozottság" gyerekek={<PuskaHatarozottsag Doboz={Doboz} />} />
      </div>
    </>
  );
}
