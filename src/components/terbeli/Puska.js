import { M, MB } from "@/components/ui/Keplet";

/** A 10. modul (térbeli tartók) puska-lapja: a Doboz komponenst a puska-oldal adja. */
export default function Puska({ Doboz }) {
  return (
    <>
      <Doboz cim="Hat egyensúlyi egyenlet térben">
        <MB>{"\\Fx,\\ \\Fy,\\ \\Fz\\qquad \\textstyle\\sum M_{ix},\\ \\sum M_{iy},\\ \\sum M_{iz}"}</MB>
        <p>
          Egyensúlyi kijelentés: <M>{"(\\underline F_i, \\underline A, \\ldots) \\ekv \\underline O"}</M>. Nyomatékvektor: <M>{"\\underline M = \\underline r\\times\\underline F"}</M>, <M>{"M_x = yF_z - zF_y"}</M>, <M>{"M_y = zF_x - xF_z"}</M>,{" "}
          <M>{"M_z = xF_y - yF_x"}</M>. Tengelyre: <M>{"M_t = \\underline M_Q\\cdot\\underline e_t"}</M>. Ferde erő: <M>{"F_x = F\\,l_x/l"}</M>, <M>{"l = \\sqrt{l_x^2 + l_y^2 + l_z^2}"}</M> — a harmadik vetületet ne hagyd ki!
        </p>
      </Doboz>
      <Doboz cim="Kényszerek fokszáma térben">
        <p>
          gömbcsukló 3 (<M>{"A_x, A_y, A_z"}</M>); támasztórúd 1 (rúdirányú <M>{"S"}</M>, húzottnak felvéve); merev befogás 6 (3 erő + 3 nyomaték); tengelycsukló 5 (3 erő + 2 nyomaték). Egy test: 6 egyenlet → összfokszám 6 kell (szükséges, nem elégséges).
          Rossz: két gömbcsukló; rúd a csuklón át; 3 párhuzamos rúd; 4 párhuzamos rúd; 3 egy síkú, párhuzamos/egy ponton átmenő rúd.
        </p>
      </Doboz>
      <Doboz cim="Háromlábú bakállvány (9.2.2)">
        <MB>{"\\Fx F_x + S_1\\tfrac{l_{1x}}{l_1} + S_2\\tfrac{l_{2x}}{l_2} + S_3\\tfrac{l_{3x}}{l_3} = 0\\quad(\\text{és } y, z)"}</MB>
        <p>
          <M>{"\\underline l_i"}</M> a csúcsból a talppontba, <M>{"\\underline e_i = \\underline l_i/l_i"}</M>; a csomópontra <M>{"S_i\\underline e_i"}</M> hat. <M>{"S < 0"}</M>: nyomott. Trükk: nyomaték két talppontot összekötő tengelyre → csak a harmadik rúd; vetület két rúd síkjára merőlegesen → csak a
          harmadik rúd. Kritikus, ha a három rúd egy síkban van.
        </p>
      </Doboz>
      <Doboz cim="Befogott térbeli konzol (9.2.3)">
        <MB>{"\\underline A = -\\sum\\underline F_i,\\qquad \\underline M_A = -\\sum(\\underline r_i - \\underline r_A)\\times\\underline F_i - \\sum\\underline M_j"}</MB>
        <p>Az A-n átmenő tengelyekre a reakcióerők nem forgatnak → mind a hat egyenlet egyismeretlenes. Ellenőrzés: nyomaték a szabad végre (E) — minden tag ismert.</p>
      </Doboz>
      <Doboz cim="Gömbcsukló + 3 rúd, 6 rúd">
        <p>
          Nyomatéki egyenletek a <strong>csuklón átmenő</strong> tengelyekre: a csukló kiesik, egy-egy rúderő marad; utána vetületek → <M>{"A_x, A_y, A_z"}</M>. Hat rúdnál: tengely, amely párhuzamos három rúddal és metszi két másik hatásvonalát → csak a hatodik
          marad. Térfogati teher: <M>{"G = \\gamma V"}</M> a töltés súlypontjában.
        </p>
      </Doboz>
      <Doboz cim="Térbeli rácsos tartó (9.2.4)">
        <p>
          <M>{"e = 3c"}</M>, <M>{"i = r + k"}</M>. Csomóponti módszer: 3 egyenlet / csomópont → 3 rúderő; ott kezdj, ahol ≤ 3 ismeretlen rúd fut össze. Egy rúd önmagában számolható, ha a többi ismeretlen egy síkban van (a síkra merőleges vetület). Átmetszés: hatos
          átmetszés (6 egyenlet).
        </p>
      </Doboz>
      <Doboz cim="Térbeli igénybevételek (9.3)">
        <MB>{"\\text{követő részből: } \\underline R_K = \\sum\\underline F,\\ \\underline M_K = \\sum(\\underline r_i - \\underline r_K)\\times\\underline F_i;\\quad \\text{megelőzőből: } -\\sum"}</MB>
        <p>
          Tengely (lokális x) → <M>{"N = R_t"}</M> (húzás +), <M>{"T = M_t"}</M> (kifelé mutató +); a másik két globális tengely → <M>{"V, V"}</M> és <M>{"M, M"}</M> (hajlító). A megelőző rész keresztmetszetén a pozitív komponens a +tengely felé mutat, a
          követőén a −tengely felé. Egyenes rúd végén ható erő nem csavar (metszi a tengelyt).
        </p>
      </Doboz>
      <Doboz cim="Tipikus hibák" szeles>
        <ul className="list-disc space-y-0.5 pl-4">
          <li>A rúderőt függőlegesnek venni: a rúd csak a tengelye mentén hat — bontsd <M>{"S_i\\underline e_i"}</M>-re.</li>
          <li>A vetületi rajzról leolvasott rúdhossz rövidebb a valódinál: <M>{"l = \\sqrt{l_x^2+l_y^2+l_z^2}"}</M>.</li>
          <li>Kar a rossz tengelyhez: az erővel párhuzamos tengelyre a nyomaték nulla; használd <M>{"\\underline r\\times\\underline F"}</M> komponenseit.</li>
          <li>Megelőző rész +Σ-val: a megelőző részből −Σ, a követőből +Σ.</li>
          <li>6 × 6-os egyenletrendszer: keress egyismeretlenes egyenleteket (csuklón átmenő tengelyek, rudak síkjára merőleges vetület).</li>
          <li>Előjel nélküli rúderő: nyomott = negatív; a vizsgán az előjel ér pontot.</li>
        </ul>
      </Doboz>
    </>
  );
}
