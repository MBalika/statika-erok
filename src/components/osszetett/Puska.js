import { M, MB } from "@/components/ui/Keplet";

/** A 6. modul (összetett tartók) puska-lapja: a Doboz komponenst a puska-oldal adja. */
export default function Puska({ Doboz }) {
  return (
    <>
      <Doboz cim="Belső kényszerek">
        <p>
          <strong>Belső csukló</strong> (fokszám 2): az összekapcsolt pontok eltolódása azonos, elfordulásuk eltérhet → két belső reakcióerő-komponens (<M>{"C_x, C_y"}</M>), nyomaték <strong>nincs</strong>.{" "}
          <strong>Belső rúd</strong> (1): a két csuklót összekötő hatásvonalú <M>{"S"}</M>, húzottnak felvéve — töröttvonalú elem is rúd, ha csak két pontján kapcsolódik és más erő nem hat rá.
        </p>
        <p>A belső reakciók párban, egymás ellentettjeként lépnek fel: <M>{"C' = -C"}</M> (hatás–ellenhatás).</p>
      </Doboz>
      <Doboz cim="A recept összetett tartóra">
        <ol className="list-decimal space-y-0.5 pl-4">
          <li>Elkülönítés: a testeket a földtől <em>és egymástól</em> is; a csuklót külön, ha kettőnél több erő hat rá.</li>
          <li>Egyensúlyi kijelentés minden testre (+ az egészre, ahol a belső erők kiesnek).</li>
          <li>Egyismeretlenes egyenletek — az egyenlet elé írd: I:, II:, Σ:.</li>
          <li>Ellenőrzés egy nem használt (lehetőleg Σ) egyenlettel.</li>
          <li>Eredményvázlat testenként.</li>
        </ol>
      </Doboz>
      <Doboz cim="Fokszám-számlálás (doboz)">
        <MB>{"\\text{ismeretlen} = \\textstyle\\sum \\text{külső fokszám} + \\sum \\text{belső fokszám},\\qquad \\text{egyenlet} = 3\\cdot\\text{testek} + 2\\cdot\\text{terhelt csuklók}"}</MB>
        <p>Gerber: (2+1+1) + 2 = 6 = 3·2. Háromcsuklós: (2+2) + 2 = 6. Függesztőmű (5.13): (2+1) + 2 + 5 = 10 = 3·2 + 2·2. Egyenlő → határozott (ha nem degenerált).</p>
      </Doboz>
      <Doboz cim="Gerber-tartó">
        <p>
          <strong>Befüggesztett rész</strong>: külső kényszereivel nem áll meg, elkülönítve <strong>pontosan 3 ismeretlen</strong> (pl. <M>{"C_x, C_y, D"}</M>) → kéttámaszú tartóként: <M>{"\\Mp{C} \\to D,\\ \\Mp{D} \\to C_y,\\ \\Fx \\to C_x"}</M>.
          A csuklóerő <strong>ellentettje teherként</strong> a fix részre → megint egyszerű tartó. Befogott fix résznél a <em>másik</em> oldal a befüggesztett.
        </p>
      </Doboz>
      <Doboz cim="Háromcsuklós tartó">
        <p>
          Testenként 4 ismeretlen, 3 egyenlet → az egész segít: azonos magasságú támaszoknál <M>{"\\Sigma\\!:\\ \\Mp{A} \\to B_y,\\ \\Mp{B} \\to A_y"}</M>; aztán <M>{"\\text{II}\\!:\\ \\Mp{C} \\to B_x"}</M> (a csuklóban{" "}
          <M>{"M = 0"}</M>), <M>{"\\Fx \\to A_x"}</M>, végül egy test vetületeiből <M>{"C"}</M>. Eltérő magasság: kétismeretlenes rendszer (<M>{"\\Sigma\\ \\Mp{B}"}</M> + <M>{"\\text{I}\\ \\Mp{C}"}</M>).{" "}
          <strong>A vízszintes reakció függőleges tehernél sem nulla!</strong>
        </p>
      </Doboz>
      <Doboz cim="Terhelt csukló">
        <p>
          A csukló külön „test”: rá <M>{"F"}</M> és a két csuklóerő ellentettje hat → két vetületi egyenlet. <M>{"C_I = F - C_{II}"}</M>: a két testre ható csuklóerő <strong>nem</strong> egymás ellentettje, a különbségük a teher.
          Sorrend: befüggesztett rész → csukló → fix rész. Az összegzett ellenőrzésben a csuklón ható <M>{"F"}</M> benne marad.
        </p>
      </Doboz>
      <Doboz cim="Függesztőmű, feszítőmű, rúddal kapcsolt testek">
        <p>
          Egész szerkezet → <M>{"A, B"}</M>; test + csukló <strong>összevonva</strong> (I+D) → <M>{"\\Mp{C} \\to S_3"}</M>, vetületek → <M>{"C"}</M>; a rúdcsuklók (D, E) vetületeiből a többi rúderő. Függesztőmű: felső öv és
          ferde rudak nyomottak, függőlegesek húzottak; feszítőmű = tükörkép. Egy rúddal kapcsolt befüggesztett résznek csukló kell a földhöz (1 + 2 = 3).
        </p>
      </Doboz>
      <Doboz cim="Tipikus hibák" szeles>
        <ul className="list-disc space-y-0.5 pl-4">
          <li>A csuklóerő ellentettje lemarad a fix részről („nincs rajta teher”).</li>
          <li>Háromcsuklósnál <M>{"A_x = B_x = 0"}</M>, mert a teher függőleges — nem: <M>{"A_x = -B_x \\ne 0"}</M>.</li>
          <li>Terhelt csuklón a terhet „odaadjuk” egy testnek, és a két csuklóerőt ellentettnek vesszük.</li>
          <li>Egy testre négy egyenlet — a negyedik nem független, csak ellenőrzésre jó.</li>
          <li>A megoszló teher teljes eredője egy testre írt egyenletben: csak a testre eső rész eredője jár!</li>
          <li>A rúdra nyomaték felvétele: a csuklós rúd egyetlen ismeretlent (S) hoz, a két csuklót összekötő hatásvonalon.</li>
        </ul>
      </Doboz>
    </>
  );
}
