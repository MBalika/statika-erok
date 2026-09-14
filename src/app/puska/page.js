import { M, MB } from "@/components/ui/Keplet";
import NyomtatasGomb from "@/components/NyomtatasGomb";

export const metadata = {
  title: "Puska",
  description: "Nyomtatható egyoldalas összefoglaló mind a négy modulhoz: képletek, szabályok, tipikus hibák.",
};

function Lap({ szam, cim, gyerekek }) {
  return (
    <section className="puska-lap mb-8 rounded-2xl border border-[color:var(--keret)] bg-white p-5 sm:p-7 print:mb-0 print:rounded-none print:border-0 print:p-0">
      <div className="flex items-center gap-3 border-b-2 border-naracs-500 pb-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-naracs-500 text-[15px] font-bold text-white print:bg-black">{szam}</span>
        <h2 className="text-xl font-bold text-petrol-900">{cim}</h2>
        <span className="ml-auto text-[11px] tracking-[0.16em] text-petrol-400 uppercase">Statika · puska</span>
      </div>
      <div className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">{gyerekek}</div>
    </section>
  );
}

function Doboz({ cim, children, szeles = false }) {
  return (
    <div className={`rounded-xl border border-petrol-100 bg-petrol-50/50 px-3.5 py-2.5 print:border-gray-300 print:bg-white ${szeles ? "sm:col-span-2" : ""}`}>
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
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">Puska — négy modul, négy oldal</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-petrol-200">
            A legfontosabb képletek, szabályok és a tipikus hibák, modulonként egy oldalon. Nyomtasd ki, vagy mentsd
            PDF-be — de előbb próbáld meg fejből leírni, aztán hasonlítsd össze.
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
                <MB>{"M^{(O)} = x F_y - y F_x = \\pm F\\,d"}</MB>
                <p>Pozitív: az óramutatóval ellentétes forgatás. d az erőkar: a pont távolsága a hatásvonaltól.</p>
              </Doboz>
              <Doboz cim="Erőpár">
                <p>Két egyenlő, ellentétes, párhuzamos erő: R = 0, M = F·d minden pontra ugyanaz. Szabad vektor — bárhová eltolható.</p>
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
      </div>
    </>
  );
}
