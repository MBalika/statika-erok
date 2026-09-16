/** A 6. modul (összetett tartók) elméleti, statikus ábrái – a tankönyv 5.1–5.18. ábrája nyomán. */

import {
  TartoHegyek,
  Tarto,
  Gorgo,
  Csuklo,
  Befogas,
  Rud,
  BelsoCsuklo,
  TeherNyil,
  ReakcioNyil,
  TamaszCimke,
  SZIN,
} from "@/components/tartok/TartoElemek";

const SZURKE = "#64748b";
const LILA = "var(--color-jel-eredo)";
const KEK = "#2563eb";

/** Betűjel alsó indexszel: <Jel x y alap="C" index="x" vesszo /> */
function Jel({ x, y, alap, index, vesszo = false, szin = SZIN.tarto, meret = 13, horgony = "middle" }) {
  return (
    <text x={x} y={y} textAnchor={horgony} fontSize={meret} fontStyle="italic" fontWeight="650" style={{ fill: szin, paintOrder: "stroke", stroke: "white", strokeWidth: 3.5 }}>
      {alap}
      {vesszo && <tspan fontSize={meret * 0.8}>′</tspan>}
      {index && (
        <tspan dy="4" fontSize={meret * 0.72}>
          {index}
        </tspan>
      )}
    </text>
  );
}

function Felirat({ x, y, children, szin = "#275767", meret = 12.5, horgony = "start", vastag = 650 }) {
  return (
    <text x={x} y={y} textAnchor={horgony} fontSize={meret} fontWeight={vastag} style={{ fill: szin, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
      {children}
    </text>
  );
}

/** Római számos test-címke dobozban. */
function TestCimke({ x, y, children, szin = "#334155" }) {
  return (
    <g>
      <rect x={x - 11} y={y - 10} width={22} height={15} rx="3" fill="white" stroke={szin} strokeWidth="1.2" />
      <text x={x} y={y + 1.5} textAnchor="middle" fontSize="10.5" fontWeight="700" style={{ fill: szin }}>
        {children}
      </text>
    </g>
  );
}

/** Egy erő-komponens nyíl felirattal; a nyíl a P pontból indul e irányba (fel: e=[0,1]). hegye = a nyíl vége. */
function ErokompNyil({ x, y, irany, hossz = 34, szin = LILA, hegy = "th-reakcio", alap, index, vesszo, eltol = [8, -4] }) {
  // irany: "fel" | "le" | "jobb" | "bal" — a nyíl a ponttól kifelé mutat
  const v = { fel: [0, -1], le: [0, 1], jobb: [1, 0], bal: [-1, 0] }[irany];
  const x2 = x + v[0] * hossz, y2 = y + v[1] * hossz;
  return (
    <g>
      <line x1={x} y1={y} x2={x2} y2={y2} stroke={szin} strokeWidth="2.6" strokeLinecap="round" markerEnd={`url(#${hegy})`} />
      {alap && <Jel x={x2 + eltol[0]} y={y2 + eltol[1]} alap={alap} index={index} vesszo={vesszo} szin={szin} meret={12} horgony="start" />}
    </g>
  );
}

/* ============================================================
   1. ábra: a belső csukló és az elkülönítésekor felvett erőpár (5.1.b, c)
   ============================================================ */
export function AbraBelsoCsuklo() {
  const Y = 90;
  return (
    <svg viewBox="0 0 600 190" className="abra w-full h-auto">
      <TartoHegyek />
      {/* bal: a szerkezet */}
      <Felirat x={16} y={22} szin={SZURKE} meret={11} vastag={700}>a) belső csukló a gerendán</Felirat>
      <Tarto x1={30} y1={Y} x2={230} y2={Y} />
      <BelsoCsuklo x={130} y={Y} />
      <Csuklo x={40} y={Y} />
      <Gorgo x={220} y={Y} />
      <TeherNyil x={90} y={Y - 3} hossz={44} szog={-90} cimke="F₁" cimkeEltolas={[6, -2]} />
      <TeherNyil x={180} y={Y - 3} hossz={44} szog={-90} cimke="F₂" cimkeEltolas={[6, -2]} />
      <TamaszCimke x={130} y={Y - 12}>C</TamaszCimke>
      <TestCimke x={70} y={Y + 32}>I</TestCimke>
      <TestCimke x={195} y={Y + 32}>II</TestCimke>

      {/* jobb: elkülönítés */}
      <Felirat x={290} y={22} szin={SZURKE} meret={11} vastag={700}>b) elkülönítés: a csuklóban ellentett erőpár</Felirat>
      {/* I. test */}
      <Tarto x1={290} y1={Y - 22} x2={400} y2={Y - 22} />
      <ReakcioNyil x={300} y={Y - 25} hossz={30} szog={90} />
      <ReakcioNyil x={300} y={Y - 22} hossz={30} szog={0} />
      <TeherNyil x={345} y={Y - 25} hossz={34} szog={-90} cimke="F₁" cimkeEltolas={[5, 0]} />
      <ErokompNyil x={400} y={Y - 22} irany="fel" alap="C" index="y" eltol={[6, 2]} />
      <ErokompNyil x={400} y={Y - 22} irany="jobb" alap="C" index="x" eltol={[4, 12]} />
      <TestCimke x={330} y={Y + 2}>I</TestCimke>
      {/* II. test */}
      <Tarto x1={445} y1={Y + 40} x2={575} y2={Y + 40} />
      <Gorgo x={565} y={Y + 40} />
      <TeherNyil x={520} y={Y + 37} hossz={34} szog={-90} cimke="F₂" cimkeEltolas={[5, 0]} />
      <ErokompNyil x={445} y={Y + 40} irany="le" alap="C" index="y" vesszo eltol={[6, 4]} />
      <ErokompNyil x={445} y={Y + 40} irany="bal" alap="C" index="x" vesszo eltol={[-30, -6]} />
      <TestCimke x={490} y={Y + 64}>II</TestCimke>
      {/* a hatás–ellenhatás jelölése */}
      <line x1={404} y1={Y - 8} x2={441} y2={Y + 26} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
      <Felirat x={425} y={Y + 8} szin="#7c3aed" meret={10.5} horgony="middle">C′ = −C</Felirat>
    </svg>
  );
}

/* ============================================================
   2. ábra: hová kapcsolódik a csukló? (5.2.a–d)
   ============================================================ */
export function AbraCsukloHelye() {
  const Panel = ({ x0, cim, gyerek }) => (
    <g transform={`translate(${x0} 0)`}>
      <Felirat x={0} y={16} szin={SZURKE} meret={10.5} vastag={700}>{cim}</Felirat>
      {gyerek}
    </g>
  );
  const Y = 60;
  return (
    <svg viewBox="0 0 600 150" className="abra w-full h-auto">
      <TartoHegyek />
      <Panel
        x0={12}
        cim="a) az oszlop csuklóval kapcsolódik"
        gyerek={
          <>
            <Tarto x1={0} y1={Y} x2={130} y2={Y} />
            <Tarto x1={65} y1={Y} x2={65} y2={Y + 60} />
            <BelsoCsuklo x={65} y={Y} />
            <TestCimke x={110} y={Y - 14}>I</TestCimke>
            <TestCimke x={84} y={Y + 46}>II</TestCimke>
            <Felirat x={0} y={Y + 80} szin="#475569" meret={10.5}>2 test: gerenda + oszlop</Felirat>
          </>
        }
      />
      <Panel
        x0={162}
        cim="b) a jobb gerenda csatlakozik"
        gyerek={
          <>
            <Tarto x1={0} y1={Y} x2={65} y2={Y} />
            <Tarto x1={65} y1={Y} x2={65} y2={Y + 60} />
            <Tarto x1={65} y1={Y} x2={130} y2={Y} />
            <BelsoCsuklo x={65} y={Y} />
            <TestCimke x={30} y={Y - 14}>I</TestCimke>
            <TestCimke x={110} y={Y - 14}>II</TestCimke>
            <Felirat x={0} y={Y + 80} szin="#475569" meret={10.5}>2 test: bal gerenda+oszlop, jobb gerenda</Felirat>
            {/* a sarok merev: kis ívvel jelöljük a merev kapcsolatot */}
            <path d={`M 52 ${Y + 12} Q 52 ${Y} 65 ${Y}`} fill="none" stroke="#94a3b8" strokeWidth="1" />
          </>
        }
      />
      <Panel
        x0={312}
        cim="c) mindhárom elem a csuklóhoz"
        gyerek={
          <>
            <Tarto x1={0} y1={Y} x2={65} y2={Y} />
            <Tarto x1={65} y1={Y} x2={130} y2={Y} />
            <Tarto x1={65} y1={Y} x2={65} y2={Y + 60} />
            <BelsoCsuklo x={65} y={Y} r={5.5} />
            <TestCimke x={30} y={Y - 14}>I</TestCimke>
            <TestCimke x={110} y={Y - 14}>III</TestCimke>
            <TestCimke x={84} y={Y + 46}>II</TestCimke>
            <Felirat x={0} y={Y + 80} szin="#475569" meret={10.5}>3 test — a csuklót külön kell elkülöníteni</Felirat>
          </>
        }
      />
      <Panel
        x0={462}
        cim="d) terhelt csukló"
        gyerek={
          <>
            <Tarto x1={0} y1={Y} x2={65} y2={Y} />
            <Tarto x1={65} y1={Y} x2={130} y2={Y} />
            <BelsoCsuklo x={65} y={Y} r={5.5} />
            <TeherNyil x={65} y={Y - 6} hossz={38} szog={-90} cimke="F" cimkeEltolas={[6, 0]} />
            <TestCimke x={30} y={Y + 18}>I</TestCimke>
            <TestCimke x={110} y={Y + 18}>II</TestCimke>
            <Felirat x={0} y={Y + 80} szin="#475569" meret={10.5}>a csuklóra 3 erő hat: F, −C_I, −C_II</Felirat>
          </>
        }
      />
    </svg>
  );
}

/* ============================================================
   3. ábra: Gerber-tartó – váz és elkülönítés (5.4)
   ============================================================ */
export function AbraGerber() {
  const Y = 60;
  const OX = 30, L = 60; // px / m; A=0, B=4, C=6, D=9
  const kx = (x) => OX + x * L;
  const Y2 = 160;
  return (
    <svg viewBox="0 0 600 235" className="abra w-full h-auto">
      <TartoHegyek />
      <Felirat x={16} y={18} szin={SZURKE} meret={11} vastag={700}>a) Gerber-tartó: fix rész (I) + befüggesztett rész (II)</Felirat>
      <Tarto x1={kx(0)} y1={Y} x2={kx(9)} y2={Y} />
      <Csuklo x={kx(0)} y={Y} />
      <Gorgo x={kx(4)} y={Y} />
      <BelsoCsuklo x={kx(6)} y={Y} />
      <Gorgo x={kx(9)} y={Y} />
      <TeherNyil x={kx(2)} y={Y - 3} hossz={44} szog={-60} cimke="F₁" cimkeEltolas={[-18, -4]} />
      <TeherNyil x={kx(7.8)} y={Y - 3} hossz={44} szog={-90} cimke="F₂" cimkeEltolas={[6, -2]} />
      <TamaszCimke x={kx(0) - 16} y={Y + 26}>A</TamaszCimke>
      <TamaszCimke x={kx(4) + 16} y={Y + 26}>B</TamaszCimke>
      <TamaszCimke x={kx(6)} y={Y - 12}>C</TamaszCimke>
      <TamaszCimke x={kx(9) + 16} y={Y + 26}>D</TamaszCimke>
      <TestCimke x={kx(5)} y={Y + 34}>I</TestCimke>
      <TestCimke x={kx(7.4)} y={Y + 34}>II</TestCimke>
      <Felirat x={kx(4.2)} y={Y - 34} szin="#475569" meret={10.5} horgony="middle">I: csukló + görgő = 3 → önmagában tartó</Felirat>
      <Felirat x={kx(7.5)} y={Y + 58} szin="#475569" meret={10.5} horgony="middle">II: egy görgő = 1 → befüggesztve C-ben</Felirat>

      {/* elkülönítés */}
      <Felirat x={16} y={Y2 - 52} szin={SZURKE} meret={11} vastag={700}>b) elkülönítés — a II. test olyan, mint egy kéttámaszú tartó</Felirat>
      <Tarto x1={kx(0)} y1={Y2 + 20} x2={kx(6)} y2={Y2 + 20} />
      <ReakcioNyil x={kx(0)} y={Y2 + 20} hossz={30} szog={0} cimke="Aₓ" cimkeEltolas={[-6, -6]} />
      <ReakcioNyil x={kx(0)} y={Y2 + 23} hossz={30} szog={90} cimke="Aᵧ" cimkeEltolas={[6, 6]} />
      <ReakcioNyil x={kx(4)} y={Y2 + 23} hossz={30} szog={90} cimke="B" cimkeEltolas={[6, 6]} />
      <TeherNyil x={kx(2)} y={Y2 + 17} hossz={40} szog={-60} cimke="F₁" cimkeEltolas={[-18, -2]} />
      <ErokompNyil x={kx(6)} y={Y2 + 20} irany="le" hossz={28} alap="C" index="y" vesszo eltol={[6, 4]} />
      <ErokompNyil x={kx(6)} y={Y2 + 20} irany="bal" hossz={28} alap="C" index="x" vesszo eltol={[-2, -8]} />
      <TestCimke x={kx(1.2)} y={Y2 + 44}>I</TestCimke>
      <Tarto x1={kx(6.4)} y1={Y2 - 22} x2={kx(9.4)} y2={Y2 - 22} />
      <ReakcioNyil x={kx(9.4)} y={Y2 - 19} hossz={30} szog={90} cimke="D" cimkeEltolas={[6, 6]} />
      <TeherNyil x={kx(8.2)} y={Y2 - 25} hossz={36} szog={-90} cimke="F₂" cimkeEltolas={[6, 0]} />
      <ErokompNyil x={kx(6.4)} y={Y2 - 22} irany="fel" hossz={28} alap="C" index="y" eltol={[6, 2]} />
      <ErokompNyil x={kx(6.4)} y={Y2 - 22} irany="jobb" hossz={28} alap="C" index="x" eltol={[2, 14]} />
      <TestCimke x={kx(7.4)} y={Y2 - 32}>II</TestCimke>
      <Felirat x={kx(6.4) + 6} y={Y2 + 72} szin="#7c3aed" meret={10.5}>sorrend: II (ΣM_C→D, ΣM_D→C_y, ΣF_x→C_x), majd I (ΣM_A→B, ΣM_B→A_y, ΣF_x→A_x)</Felirat>
    </svg>
  );
}

/* ============================================================
   4. ábra: Gerber-változatok (5.5 befogással, 5.6 lánc és rúd)
   ============================================================ */
export function AbraGerberValtozatok() {
  const Y = 52;
  return (
    <svg viewBox="0 0 600 215" className="abra w-full h-auto">
      <TartoHegyek />
      {/* a) befogással */}
      <Felirat x={14} y={16} szin={SZURKE} meret={10.5} vastag={700}>a) befogott fix rész (5.5): I befüggesztett, II fix</Felirat>
      <Tarto x1={20} y1={Y} x2={270} y2={Y} />
      <Gorgo x={60} y={Y} />
      <BelsoCsuklo x={190} y={Y} />
      <Befogas x={270} y={Y} irany="jobb" hossz={40} />
      <TeherNyil x={120} y={Y - 3} hossz={36} szog={-60} cimke="F₁" cimkeEltolas={[-16, -2]} />
      <TeherNyil x={235} y={Y - 3} hossz={36} szog={-90} cimke="F₂" cimkeEltolas={[6, 0]} />
      <TamaszCimke x={60} y={Y + 42}>A</TamaszCimke>
      <TamaszCimke x={190} y={Y - 12}>C</TamaszCimke>
      <TamaszCimke x={282} y={Y + 24}>B</TamaszCimke>
      <TestCimke x={110} y={Y + 24}>I</TestCimke>
      <TestCimke x={230} y={Y + 24}>II</TestCimke>
      {/* b) lánc: befüggesztett a befüggesztettre */}
      <Felirat x={300} y={16} szin={SZURKE} meret={10.5} vastag={700}>b) lánc (5.6.b): befüggesztett rész egy másikra támaszkodik</Felirat>
      <Tarto x1={310} y1={Y} x2={585} y2={Y} />
      <Csuklo x={318} y={Y} />
      <BelsoCsuklo x={380} y={Y} />
      <Gorgo x={430} y={Y} />
      <BelsoCsuklo x={480} y={Y} />
      <Gorgo x={520} y={Y} />
      <Gorgo x={578} y={Y} />
      <TeherNyil x={350} y={Y - 3} hossz={30} szog={-90} />
      <TeherNyil x={455} y={Y - 3} hossz={30} szog={-90} />
      <TeherNyil x={550} y={Y - 3} hossz={30} szog={-90} />
      <TestCimke x={345} y={Y + 24}>I</TestCimke>
      <TestCimke x={430} y={Y + 44}>II</TestCimke>
      <TestCimke x={530} y={Y + 44}>III</TestCimke>
      <Felirat x={312} y={Y + 70} szin="#475569" meret={10.5}>I: 2 (csukló) + 2 (csukló) — csak II-re támaszkodva áll; II: 1+2+2; III: 1+1+2 → III-mal kezdünk</Felirat>
      {/* c) rúddal kapcsolt */}
      <Felirat x={14} y={128} szin={SZURKE} meret={10.5} vastag={700}>c) egyetlen rúddal befüggesztett rész (5.6.c): a kapcsolat 1 fokú, ezért a II. test csuklót kap</Felirat>
      <Tarto x1={30} y1={190} x2={190} y2={190} />
      <Gorgo x={40} y={190} />
      <Csuklo x={130} y={190} />
      <Rud x1={190} y1={190} x2={250} y2={150} />
      <Tarto x1={250} y1={150} x2={400} y2={150} />
      <Csuklo x={392} y={150} />
      <TeherNyil x={90} y={187} hossz={30} szog={-60} cimke="F₁" cimkeEltolas={[-16, -2]} />
      <TeherNyil x={330} y={147} hossz={30} szog={-90} cimke="F₂" cimkeEltolas={[6, 0]} />
      <TamaszCimke x={40} y={230}>A</TamaszCimke>
      <TamaszCimke x={130} y={230}>B</TamaszCimke>
      <TamaszCimke x={225} y={166}>S</TamaszCimke>
      <TamaszCimke x={392} y={190}>D</TamaszCimke>
      <TestCimke x={170} y={210}>I</TestCimke>
      <TestCimke x={300} y={170}>II</TestCimke>
      <Felirat x={420} y={160} szin="#475569" meret={10.5}>II: rúd (1) + csukló (2) = 3 → II-vel kezdünk,</Felirat>
      <Felirat x={420} y={176} szin="#475569" meret={10.5}>ΣM_D → S; utána a rúderő ellentettje terheli I-et.</Felirat>
    </svg>
  );
}

/* ============================================================
   5. ábra: háromcsuklós tartó – váz és elkülönítés (5.7, 5.8)
   ============================================================ */
export function AbraHaromcsuklos() {
  // keret: A(30,150) – (30,50) – C(150,50) – (270,50) – B(270,150)
  const A = [40, 150], C = [160, 50], B = [280, 150];
  return (
    <svg viewBox="0 0 600 215" className="abra w-full h-auto">
      <TartoHegyek />
      <Felirat x={14} y={16} szin={SZURKE} meret={11} vastag={700}>a) háromcsuklós keret — mindkét test 2 + 2 fokszámú</Felirat>
      <Tarto x1={A[0]} y1={A[1]} x2={A[0]} y2={C[1]} />
      <Tarto x1={A[0]} y1={C[1]} x2={B[0]} y2={C[1]} />
      <Tarto x1={B[0]} y1={C[1]} x2={B[0]} y2={B[1]} />
      <Csuklo x={A[0]} y={A[1]} />
      <Csuklo x={B[0]} y={B[1]} />
      <BelsoCsuklo x={C[0]} y={C[1]} />
      <TeherNyil x={100} y={C[1] - 3} hossz={38} szog={-90} cimke="F₁" cimkeEltolas={[6, 0]} />
      <TeherNyil x={230} y={C[1] - 3} hossz={38} szog={-60} cimke="F₂" cimkeEltolas={[-18, -2]} />
      <TamaszCimke x={A[0] - 16} y={A[1] + 26}>A</TamaszCimke>
      <TamaszCimke x={B[0] + 16} y={B[1] + 26}>B</TamaszCimke>
      <TamaszCimke x={C[0]} y={C[1] - 12}>C</TamaszCimke>
      <TestCimke x={70} y={100}>I</TestCimke>
      <TestCimke x={250} y={100}>II</TestCimke>
      <Felirat x={14} y={200} szin="#475569" meret={10.5}>4 ismeretlen testenként, 3 egyenlet: az egész szerkezetre írt ΣM_A és ΣM_B segít ki (azonos magasságú támaszoknál közvetlenül).</Felirat>

      {/* elkülönítés */}
      <Felirat x={330} y={16} szin={SZURKE} meret={11} vastag={700}>b) elkülönítés</Felirat>
      {(() => {
        const a = [350, 150], c1 = [430, 60], c2 = [470, 60], b = [560, 150];
        return (
          <>
            <Tarto x1={a[0]} y1={a[1]} x2={a[0]} y2={c1[1]} />
            <Tarto x1={a[0]} y1={c1[1]} x2={c1[0]} y2={c1[1]} />
            <ReakcioNyil x={a[0]} y={a[1]} hossz={28} szog={0} cimke="Aₓ" cimkeEltolas={[-8, -6]} />
            <ReakcioNyil x={a[0]} y={a[1] + 3} hossz={28} szog={90} cimke="Aᵧ" cimkeEltolas={[6, 6]} />
            <TeherNyil x={395} y={c1[1] - 3} hossz={34} szog={-90} cimke="F₁" cimkeEltolas={[6, 0]} />
            <ErokompNyil x={c1[0]} y={c1[1]} irany="jobb" hossz={26} alap="C" index="x" eltol={[2, -6]} />
            <ErokompNyil x={c1[0]} y={c1[1]} irany="le" hossz={26} alap="C" index="y" eltol={[4, 6]} />
            <TestCimke x={375} y={110}>I</TestCimke>
            <Tarto x1={c2[0]} y1={c2[1]} x2={b[0]} y2={c2[1]} />
            <Tarto x1={b[0]} y1={c2[1]} x2={b[0]} y2={b[1]} />
            <ReakcioNyil x={b[0]} y={b[1]} hossz={28} szog={180} cimke="Bₓ" cimkeEltolas={[2, -6]} />
            <ReakcioNyil x={b[0]} y={b[1] + 3} hossz={28} szog={90} cimke="Bᵧ" cimkeEltolas={[6, 6]} />
            <TeherNyil x={530} y={c2[1] - 3} hossz={34} szog={-60} cimke="F₂" cimkeEltolas={[-18, -2]} />
            <ErokompNyil x={c2[0]} y={c2[1]} irany="bal" hossz={26} alap="C" index="x" vesszo eltol={[-30, -6]} />
            <ErokompNyil x={c2[0]} y={c2[1]} irany="fel" hossz={26} alap="C" index="y" vesszo eltol={[4, 0]} />
            <TestCimke x={535} y={110}>II</TestCimke>
            <Felirat x={330} y={200} szin="#7c3aed" meret={10.5}>I: (F₁, A, C) ≐ O · II: (F₂, C′, B) ≐ O · Σ: (F₁, F₂, A, B) ≐ O</Felirat>
          </>
        );
      })()}
    </svg>
  );
}

/* ============================================================
   6. ábra: terhelt csukló elkülönítése (5.9 / 5.10)
   ============================================================ */
export function AbraTerheltCsuklo() {
  const Y = 130;
  return (
    <svg viewBox="0 0 600 210" className="abra w-full h-auto">
      <TartoHegyek />
      <Felirat x={14} y={16} szin={SZURKE} meret={11} vastag={700}>Csuklóján terhelt Gerber-tartó (5.9): a csuklót külön különítjük el — rá három erő hat</Felirat>
      {/* I. test */}
      <Tarto x1={30} y1={Y} x2={230} y2={Y} />
      <ReakcioNyil x={40} y={Y} hossz={28} szog={0} cimke="Aₓ" cimkeEltolas={[-8, -6]} />
      <ReakcioNyil x={40} y={Y + 3} hossz={28} szog={90} cimke="Aᵧ" cimkeEltolas={[6, 6]} />
      <ReakcioNyil x={170} y={Y + 3} hossz={28} szog={90} cimke="B" cimkeEltolas={[6, 6]} />
      <TeherNyil x={100} y={Y - 3} hossz={36} szog={-60} cimke="F₁" cimkeEltolas={[-18, -2]} />
      <ErokompNyil x={230} y={Y} irany="le" hossz={26} alap="C" index="Iy" eltol={[6, 4]} />
      <ErokompNyil x={230} y={Y} irany="jobb" hossz={26} alap="C" index="Ix" eltol={[2, -6]} />
      <TestCimke x={130} y={Y + 30}>I</TestCimke>
      {/* a csukló */}
      <circle cx={300} cy={Y - 50} r={9} fill="white" stroke={SZIN.tarto} strokeWidth="2.2" />
      <TamaszCimke x={300} y={Y - 46}>C</TamaszCimke>
      <TeherNyil x={300} y={Y - 60} hossz={36} szog={-90} cimke="F₂" cimkeEltolas={[6, 0]} />
      <ErokompNyil x={293} y={Y - 44} irany="fel" hossz={30} alap="C" index="Iy" vesszo eltol={[-34, 0]} />
      <ErokompNyil x={291} y={Y - 50} irany="bal" hossz={30} alap="C" index="Ix" vesszo eltol={[-34, -6]} />
      <ErokompNyil x={307} y={Y - 44} irany="le" hossz={30} alap="C" index="IIy" vesszo eltol={[4, 6]} />
      <ErokompNyil x={309} y={Y - 50} irany="jobb" hossz={30} alap="C" index="IIx" vesszo eltol={[2, -6]} />
      <Felirat x={300} y={Y + 30} szin="#7c3aed" meret={10.5} horgony="middle">C: (F₂, C′_I, C′_II) ≐ O — két vetületi egyenlet</Felirat>
      {/* II. test */}
      <Tarto x1={370} y1={Y} x2={570} y2={Y} />
      <ReakcioNyil x={560} y={Y + 3} hossz={28} szog={90} cimke="D" cimkeEltolas={[6, 6]} />
      <TeherNyil x={480} y={Y - 3} hossz={36} szog={-90} cimke="F₃" cimkeEltolas={[6, 0]} />
      <ErokompNyil x={370} y={Y} irany="fel" hossz={26} alap="C" index="IIy" eltol={[6, 0]} />
      <ErokompNyil x={370} y={Y} irany="bal" hossz={26} alap="C" index="IIx" eltol={[-34, -6]} />
      <TestCimke x={470} y={Y + 30}>II</TestCimke>
      <Felirat x={14} y={Y + 66} szin="#475569" meret={10.5}>Sorrend: II (befüggesztett) → a C csukló (F₂ + C′_II-ből C′_I) → I (fix rész), amelyre −C′_I = C_I hat.</Felirat>
    </svg>
  );
}

/* ============================================================
   7. ábra: egyszerű tartóra visszavezethető kialakítások (5.11, 5.12)
   ============================================================ */
export function AbraEgyszeruVissza() {
  return (
    <svg viewBox="0 0 600 190" className="abra w-full h-auto">
      <TartoHegyek />
      <Felirat x={14} y={16} szin={SZURKE} meret={10.5} vastag={700}>a) csukló + rúd köti a két testet (5.11): a belső kényszerek fokszáma 2 + 1 = 3</Felirat>
      <Tarto x1={30} y1={120} x2={250} y2={120} />
      <Csuklo x={40} y={120} />
      <Tarto x1={130} y1={120} x2={130} y2={60} />
      <Tarto x1={130} y1={60} x2={250} y2={60} />
      <BelsoCsuklo x={130} y={120} />
      <Rud x1={210} y1={60} x2={210} y2={120} />
      <Gorgo x={245} y={60} />
      <TeherNyil x={80} y={117} hossz={34} szog={-60} cimke="F₁" cimkeEltolas={[-16, -2]} />
      <TeherNyil x={170} y={57} hossz={34} szog={-90} cimke="F₂" cimkeEltolas={[6, 0]} />
      <TamaszCimke x={40} y={160}>A</TamaszCimke>
      <TamaszCimke x={118} y={136}>C</TamaszCimke>
      <TamaszCimke x={222} y={96}>S</TamaszCimke>
      <TamaszCimke x={262} y={56}>B</TamaszCimke>
      <TestCimke x={90} y={142}>I</TestCimke>
      <TestCimke x={150} y={80}>II</TestCimke>
      <Felirat x={14} y={178} szin="#475569" meret={10.5}>Külső: csukló (2) + görgő (1) = 3 → az egész szerkezet egyszerű tartóként kezdhető: ΣM_A → B.</Felirat>

      <Felirat x={320} y={16} szin={SZURKE} meret={10.5} vastag={700}>b) a II. test csak az I.-hez kapcsolódik (5.12)</Felirat>
      <Tarto x1={330} y1={120} x2={580} y2={120} />
      <Csuklo x={340} y={120} />
      <Gorgo x={570} y={120} />
      <Tarto x1={430} y1={120} x2={430} y2={60} />
      <Tarto x1={430} y1={60} x2={540} y2={60} />
      <BelsoCsuklo x={430} y={120} />
      <Rud x1={510} y1={60} x2={510} y2={120} />
      <TeherNyil x={385} y={117} hossz={34} szog={-60} cimke="F₁" cimkeEltolas={[-16, -2]} />
      <TeherNyil x={470} y={57} hossz={34} szog={-90} cimke="F₂" cimkeEltolas={[6, 0]} />
      <TamaszCimke x={340} y={160}>A</TamaszCimke>
      <TamaszCimke x={570} y={160}>B</TamaszCimke>
      <TestCimke x={390} y={142}>I</TestCimke>
      <TestCimke x={450} y={80}>II</TestCimke>
      <Felirat x={320} y={178} szin="#475569" meret={10.5}>A II. test önmagában egyszerű tartó (csukló + rúd) → vele is kezdhetünk.</Felirat>
    </svg>
  );
}

/* ============================================================
   8. ábra: függesztőmű és feszítőmű (5.13, 5.14)
   ============================================================ */
export function AbraFuggesztomu() {
  const Y = 120, OX = 30, L = 30; // px / m, L = 8 m
  const kx = (x) => OX + x * L;
  return (
    <svg viewBox="0 0 600 200" className="abra w-full h-auto">
      <TartoHegyek />
      <Felirat x={14} y={16} szin={SZURKE} meret={10.5} vastag={700}>a) függesztőmű (5.13): a gerenda C-ben csuklós, a rudak felülről tartják</Felirat>
      <Tarto x1={kx(0)} y1={Y} x2={kx(8)} y2={Y} />
      <Csuklo x={kx(0)} y={Y} />
      <Gorgo x={kx(8)} y={Y} />
      <BelsoCsuklo x={kx(4)} y={Y} />
      <Rud x1={kx(0)} y1={Y} x2={kx(2)} y2={Y - 60} />
      <Rud x1={kx(2)} y1={Y - 60} x2={kx(2)} y2={Y} />
      <Rud x1={kx(2)} y1={Y - 60} x2={kx(6)} y2={Y - 60} />
      <Rud x1={kx(6)} y1={Y - 60} x2={kx(6)} y2={Y} />
      <Rud x1={kx(6)} y1={Y - 60} x2={kx(8)} y2={Y} />
      <TeherNyil x={kx(3)} y={Y - 3} hossz={34} szog={-90} cimke="F₁" cimkeEltolas={[5, 0]} />
      <TeherNyil x={kx(5)} y={Y - 3} hossz={34} szog={-90} cimke="F₂" cimkeEltolas={[5, 0]} />
      <TamaszCimke x={kx(0) - 14} y={Y + 26}>A</TamaszCimke>
      <TamaszCimke x={kx(8) + 14} y={Y + 26}>B</TamaszCimke>
      <TamaszCimke x={kx(4)} y={Y + 18}>C</TamaszCimke>
      <TamaszCimke x={kx(2)} y={Y - 68}>D</TamaszCimke>
      <TamaszCimke x={kx(6)} y={Y - 68}>E</TamaszCimke>
      <Jel x={kx(0.8)} y={Y - 36} alap="S" index="1" szin={KEK} meret={11} />
      <Jel x={kx(2) + 12} y={Y - 26} alap="S" index="2" szin={KEK} meret={11} />
      <Jel x={kx(4)} y={Y - 66} alap="S" index="3" szin={KEK} meret={11} />
      <Jel x={kx(6) + 12} y={Y - 26} alap="S" index="4" szin={KEK} meret={11} />
      <Jel x={kx(7.3)} y={Y - 36} alap="S" index="5" szin={KEK} meret={11} />
      <Felirat x={14} y={Y + 56} szin="#475569" meret={10.5}>10 ismeretlen (A_x, A_y, B, C_x, C_y, S₁…S₅), egyenletek: I (3) + II (3) + D (2) + E (2) = 10.</Felirat>

      <Felirat x={320} y={16} szin={SZURKE} meret={10.5} vastag={700}>b) feszítőmű (5.14): ugyanez az x tengelyre tükrözve</Felirat>
      {(() => {
        const ox = 330, k = (x) => ox + x * L, Yb = 70;
        return (
          <>
            <Tarto x1={k(0)} y1={Yb} x2={k(8)} y2={Yb} />
            <Csuklo x={k(0)} y={Yb} />
            <Gorgo x={k(8)} y={Yb} />
            <BelsoCsuklo x={k(4)} y={Yb} />
            <Rud x1={k(0)} y1={Yb} x2={k(2)} y2={Yb + 55} />
            <Rud x1={k(2)} y1={Yb + 55} x2={k(2)} y2={Yb} />
            <Rud x1={k(2)} y1={Yb + 55} x2={k(6)} y2={Yb + 55} />
            <Rud x1={k(6)} y1={Yb + 55} x2={k(6)} y2={Yb} />
            <Rud x1={k(6)} y1={Yb + 55} x2={k(8)} y2={Yb} />
            <TeherNyil x={k(3)} y={Yb - 3} hossz={30} szog={-90} cimke="F₁" cimkeEltolas={[5, 0]} />
            <TeherNyil x={k(5)} y={Yb - 3} hossz={30} szog={-90} cimke="F₂" cimkeEltolas={[5, 0]} />
            <TamaszCimke x={k(0) - 14} y={Yb + 26}>A</TamaszCimke>
            <TamaszCimke x={k(8) + 14} y={Yb + 26}>B</TamaszCimke>
            <TamaszCimke x={k(4)} y={Yb - 10}>C</TamaszCimke>
            <TamaszCimke x={k(2) - 12} y={Yb + 66}>D</TamaszCimke>
            <TamaszCimke x={k(6) + 12} y={Yb + 66}>E</TamaszCimke>
            <Felirat x={320} y={Yb + 100} szin="#475569" meret={10.5}>A rudak most alulról támasztanak: az alsó öv húzott, a függőlegesek nyomottak.</Felirat>
          </>
        );
      })()}
    </svg>
  );
}

/* ============================================================
   9. ábra: rudakkal felfüggesztett terhelt csukló (H06/5–6) – a GYF-5 szerkezete
   ============================================================ */
export function AbraRudasCsuklo() {
  const OX = 60, Y = 150, L = 34; // px / m, a = 2 → 7a = 14 m … túl hosszú: itt a-ban rajzolunk (L px / a)
  const kx = (x) => OX + x * L;
  return (
    <svg viewBox="0 0 600 205" className="abra w-full h-auto">
      <TartoHegyek />
      <Felirat x={14} y={16} szin={SZURKE} meret={10.5} vastag={700}>Két rúddal tartott, terhelt csukló (H06/5–6): a D csuklóra F, S_DC és S_DE hat</Felirat>
      <Tarto x1={kx(0)} y1={Y} x2={kx(7)} y2={Y} />
      <Tarto x1={kx(4)} y1={Y} x2={kx(4)} y2={Y - 3 * L} />
      <Gorgo x={kx(1)} y={Y} />
      <Csuklo x={kx(7)} y={Y} />
      <Rud x1={kx(0)} y1={Y - 3 * L} x2={kx(4)} y2={Y - 3 * L} />
      <Rud x1={kx(0)} y1={Y - 3 * L} x2={kx(4)} y2={Y} />
      <TeherNyil x={kx(0)} y={Y - 3 * L + 6} hossz={40} szog={90} cimke="F" cimkeEltolas={[-14, -4]} />
      <TamaszCimke x={kx(1)} y={Y + 40}>A</TamaszCimke>
      <TamaszCimke x={kx(7)} y={Y + 40}>B</TamaszCimke>
      <TamaszCimke x={kx(4) + 12} y={Y + 18}>E</TamaszCimke>
      <TamaszCimke x={kx(4) + 12} y={Y - 3 * L - 4}>C</TamaszCimke>
      <TamaszCimke x={kx(0) - 12} y={Y - 3 * L - 4}>D</TamaszCimke>
      <Jel x={kx(2)} y={Y - 3 * L - 8} alap="S" index="DC" szin={KEK} meret={11} />
      <Jel x={kx(1.4)} y={Y - 1.3 * L} alap="S" index="DE" szin={KEK} meret={11} />
      <TestCimke x={kx(5.5)} y={Y + 24}>I</TestCimke>
      <Felirat x={kx(4.6)} y={Y - 2.2 * L} szin="#475569" meret={10.5}>I: gerenda + oszlop (merev)</Felirat>
      <Felirat x={kx(4.6)} y={Y - 1.7 * L} szin="#475569" meret={10.5}>DC, DE: rudak (2 erő hat rájuk)</Felirat>
      <Felirat x={kx(4.6)} y={Y - 1.2 * L} szin="#475569" meret={10.5}>D: terhelt csukló → 2 vetületi egyenlet</Felirat>
      <Felirat x={kx(4.6)} y={Y - 0.7 * L} szin="#7c3aed" meret={10.5}>5 ismeretlen: A, B_x, B_y, S_DC, S_DE</Felirat>
    </svg>
  );
}

/* ============================================================
   10. ábra: a fokszám-számlálás „dobozai”
   ============================================================ */
export function AbraFokszamDoboz() {
  const Doboz = ({ x, cim, testek, kulso, belso, szin = "#7c3aed" }) => {
    const ism = kulso.reduce((s, k) => s + k, 0) + belso.reduce((s, k) => s + k, 0);
    return (
      <g transform={`translate(${x} 0)`}>
        <rect x={0} y={10} width={180} height={150} rx="10" fill="white" stroke="#cbd5e1" strokeWidth="1.2" />
        <Felirat x={90} y={30} horgony="middle" meret={11.5} szin="#1d3c48">{cim}</Felirat>
        <Felirat x={12} y={54} meret={11} szin="#475569" vastag={500}>testek: {testek} → {3 * testek} egyenlet</Felirat>
        <Felirat x={12} y={76} meret={11} szin="#475569" vastag={500}>külső: {kulso.join(" + ")}</Felirat>
        <Felirat x={12} y={98} meret={11} szin="#475569" vastag={500}>belső: {belso.length ? belso.join(" + ") : "—"}</Felirat>
        <line x1={12} y1={108} x2={168} y2={108} stroke="#e2e8f0" />
        <Felirat x={12} y={128} meret={12} szin={szin}>ismeretlen: {ism} = {3 * testek} ✓</Felirat>
        <Felirat x={12} y={148} meret={10.5} szin="#64748b" vastag={500}>statikailag határozott</Felirat>
      </g>
    );
  };
  return (
    <svg viewBox="0 0 600 170" className="abra w-full h-auto">
      <Doboz x={10} cim="Gerber-tartó (5.4)" testek={2} kulso={[2, 1, 1]} belso={[2]} />
      <Doboz x={210} cim="Háromcsuklós tartó (5.8)" testek={2} kulso={[2, 2]} belso={[2]} />
      <Doboz x={410} cim="Függesztőmű (5.13)" testek={2} kulso={[2, 1]} belso={[2, 1, 1, 1, 1, 1]} szin="#0369a1" />
    </svg>
  );
}

/* ============================================================
   11. ábra: ál-háromcsuklós tartók és zárt keret (5.15, 5.16, 5.18)
   ============================================================ */
export function AbraEgyebOsszetett() {
  return (
    <svg viewBox="0 0 600 175" className="abra w-full h-auto">
      <TartoHegyek />
      <Felirat x={14} y={16} szin={SZURKE} meret={10.5} vastag={700}>a) két rúddal összekötött testek (5.15)</Felirat>
      <Tarto x1={40} y1={140} x2={40} y2={40} />
      <Tarto x1={40} y1={40} x2={110} y2={40} />
      <Tarto x1={170} y1={140} x2={170} y2={60} />
      <Rud x1={110} y1={40} x2={170} y2={60} />
      <Rud x1={80} y1={90} x2={170} y2={110} />
      <Tarto x1={40} y1={90} x2={80} y2={90} />
      <Csuklo x={40} y={140} />
      <Csuklo x={170} y={140} />
      <TeherNyil x={40} y={65} hossz={30} szog={0} cimke="F₁" cimkeEltolas={[-18, -4]} />
      <TeherNyil x={170} y={80} hossz={30} szog={180} cimke="F₂" cimkeEltolas={[4, -4]} />
      <TamaszCimke x={40} y={172}>A</TamaszCimke>
      <TamaszCimke x={170} y={172}>B</TamaszCimke>
      <Jel x={140} y={42} alap="S" index="1" szin={KEK} meret={11} />
      <Jel x={125} y={112} alap="S" index="2" szin={KEK} meret={11} />
      <Felirat x={200} y={60} szin="#475569" meret={10.5}>2 + 2 külső, 1 + 1 belső:</Felirat>
      <Felirat x={200} y={76} szin="#475569" meret={10.5}>ΣM_B (egész) + ΣM_O (I, O = a</Felirat>
      <Felirat x={200} y={92} szin="#475569" meret={10.5}>rudak metszéspontja) → A_x, A_y</Felirat>

      <Felirat x={330} y={16} szin={SZURKE} meret={10.5} vastag={700}>b) zárt keret (5.18)</Felirat>
      <Tarto x1={350} y1={140} x2={350} y2={50} />
      <Tarto x1={350} y1={50} x2={480} y2={50} />
      <Tarto x1={480} y1={50} x2={480} y2={140} />
      <Tarto x1={350} y1={140} x2={480} y2={140} />
      <BelsoCsuklo x={350} y={80} />
      <BelsoCsuklo x={415} y={50} />
      <BelsoCsuklo x={480} y={80} />
      <Csuklo x={360} y={140} />
      <Gorgo x={470} y={140} />
      <TamaszCimke x={338} y={80}>C</TamaszCimke>
      <TamaszCimke x={415} y={40}>D</TamaszCimke>
      <TamaszCimke x={492} y={80}>E</TamaszCimke>
      <TamaszCimke x={360} y={172}>A</TamaszCimke>
      <TamaszCimke x={470} y={172}>B</TamaszCimke>
      <TeherNyil x={440} y={47} hossz={30} szog={-90} cimke="F" cimkeEltolas={[5, 0]} />
      <TestCimke x={415} y={125}>I</TestCimke>
      <TestCimke x={380} y={70}>II</TestCimke>
      <TestCimke x={455} y={70}>III</TestCimke>
      <Felirat x={505} y={70} szin="#475569" meret={10.5}>kívülről egy test:</Felirat>
      <Felirat x={505} y={86} szin="#475569" meret={10.5}>A, B az egészből;</Felirat>
      <Felirat x={505} y={102} szin="#475569" meret={10.5}>CDE = háromcsuklós</Felirat>
      <Felirat x={505} y={118} szin="#475569" meret={10.5}>tartó C, E „támasszal”</Felirat>
    </svg>
  );
}
