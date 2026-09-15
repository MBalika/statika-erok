/** Az 5. modul (egyszerű tartók reakciói) elméleti, statikus ábrái – a tankönyv 4.1–4.9. ábrája nyomán. */

import {
  TartoHegyek,
  Tarto,
  Gorgo,
  Csuklo,
  Befogas,
  Rud,
  TeherNyil,
  ReakcioNyil,
  KoncentraltNyomatek,
  TamaszCimke,
  SZIN,
} from "@/components/tartok/TartoElemek";

const SZURKE = "#64748b";
const LILA = "var(--color-jel-eredo)";

/** Betűjel alsó indexszel: <Jel x y alap="A" index="x" /> */
function Jel({ x, y, alap, index, szin = SZIN.tarto, meret = 13.5, horgony = "middle" }) {
  return (
    <text x={x} y={y} textAnchor={horgony} fontSize={meret} fontStyle="italic" fontWeight="650" style={{ fill: szin, paintOrder: "stroke", stroke: "white", strokeWidth: 3.5 }}>
      {alap}
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

/** Egyenlet-tipp: „ΣM_A → B” alakban. */
function EgyenletTipp({ x, y, fajta, pont, cel, celIndex }) {
  // fajta: "M" | "Fx" | "Fy" | "Ft"
  return (
    <text x={x} y={y} fontSize="12" style={{ fill: "#334155", paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
      <tspan fontSize="13">Σ</tspan>
      {fajta === "M" ? (
        <>
          <tspan fontStyle="italic">M</tspan>
          <tspan dy="3.5" fontSize="9">
            i{pont}
          </tspan>
        </>
      ) : (
        <>
          <tspan fontStyle="italic">F</tspan>
          <tspan dy="3.5" fontSize="9">
            i{fajta.slice(1)}
          </tspan>
        </>
      )}
      <tspan dy="-3.5"> → </tspan>
      <tspan fontStyle="italic" fontWeight="650" style={{ fill: "#6d28d9" }}>
        {cel}
      </tspan>
      {celIndex && (
        <tspan dy="3.5" fontSize="9" fontStyle="italic" fontWeight="650" style={{ fill: "#6d28d9" }}>
          {celIndex}
        </tspan>
      )}
    </text>
  );
}

function Szaggatott({ x1, y1, x2, y2, szin = "#94a3b8" }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={szin} strokeWidth="1.2" strokeDasharray="5 4" />;
}

function Pont({ x, y, cimke, dx = 8, dy = -6 }) {
  return (
    <g>
      <circle cx={x} cy={y} r="3.2" fill="#0f172a" />
      {cimke && <Jel x={x + dx} y={y + dy} alap={cimke} horgony="start" meret={12.5} />}
    </g>
  );
}

/** Kis ívnyíl az elfordulás jelzésére. */
function ForgasIv({ x, y, r = 22, szin = "#94a3b8" }) {
  return <path d={`M ${x + r} ${y} A ${r} ${r} 0 0 0 ${x} ${y - r}`} fill="none" stroke={szin} strokeWidth="1.4" strokeDasharray="3 3" markerEnd="url(#th-szurke)" />;
}

/* ============================================================
   1. A négy kényszer: jel, megengedett mozgás, elkülönítés
   ============================================================ */
export function AbraKenyszerek() {
  const panelek = [
    { cim: "Görgő", fok: 1, szabad: "↔ és ↻ szabad", gatolt: "↕ gátolt" },
    { cim: "Támasztórúd", fok: 1, szabad: "↔ és ↻ szabad", gatolt: "rúdirány gátolt" },
    { cim: "Csukló", fok: 2, szabad: "↻ szabad", gatolt: "↔ és ↕ gátolt" },
    { cim: "Merev befogás", fok: 3, szabad: "semmi sem szabad", gatolt: "↔, ↕ és ↻ gátolt" },
  ];
  const Y1 = 88; // a felső (támaszos) tartó tengelye
  const Y2 = 240; // az elkülönített tartó tengelye
  return (
    <svg viewBox="0 0 660 320" className="abra w-full h-auto">
      <TartoHegyek />
      {panelek.map((p, i) => {
        const x0 = 8 + i * 163;
        const xs = x0 + 52; // a támasz helye
        const xb = x0 + 26; // a tartó bal vége
        const xj = x0 + 140;
        return (
          <g key={i}>
            <rect x={x0} y={4} width={158} height={312} rx="10" fill="white" fillOpacity="0.55" stroke="#e2e8f0" />
            <Felirat x={x0 + 79} y={22} horgony="middle" meret={13} szin="#0f172a">
              {p.cim}
            </Felirat>
            <rect x={x0 + 44} y={29} width={70} height={16} rx="8" fill="#ede9fe" />
            <Felirat x={x0 + 79} y={41} horgony="middle" meret={10.5} szin="#6d28d9">
              fokszám: {p.fok}
            </Felirat>

            {/* --- felső: a támasz és a szaggatott lehetséges mozgás --- */}
            {i === 0 && (
              <>
                <Szaggatott x1={xb + 16} y1={Y1} x2={xj + 16} y2={Y1} />
                <line x1={xb + 16} y1={Y1 - 14} x2={xj + 16} y2={Y1 - 14} stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="3 3" transform={`rotate(-7 ${xs} ${Y1})`} />
                <Tarto x1={xb} y1={Y1} x2={xj} y2={Y1} />
                <Gorgo x={xs} y={Y1} />
                <line x1={xj - 30} y1={Y1 - 22} x2={xj + 10} y2={Y1 - 22} stroke="#94a3b8" strokeWidth="1.4" markerEnd="url(#th-szurke)" markerStart="url(#th-szurke)" />
              </>
            )}
            {i === 1 && (
              <>
                <line x1={xb + 14} y1={Y1 - 2} x2={xj + 14} y2={Y1 - 2} stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="5 4" />
                <Szaggatott x1={xs + 14} y1={Y1} x2={xs} y2={Y1 + 44} />
                <Tarto x1={xb} y1={Y1} x2={xj} y2={Y1} />
                <Rud x1={xs} y1={Y1} x2={xs} y2={Y1 + 44} />
                <Csuklo x={xs} y={Y1 + 44} meret={12} />
                <line x1={xj - 30} y1={Y1 - 22} x2={xj + 10} y2={Y1 - 22} stroke="#94a3b8" strokeWidth="1.4" markerEnd="url(#th-szurke)" markerStart="url(#th-szurke)" />
              </>
            )}
            {i === 2 && (
              <>
                <line x1={xb} y1={Y1} x2={xj} y2={Y1} stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="5 4" transform={`rotate(-9 ${xs} ${Y1})`} />
                <Tarto x1={xb} y1={Y1} x2={xj} y2={Y1} />
                <Csuklo x={xs} y={Y1} />
                <ForgasIv x={xs} y={Y1} r={26} />
              </>
            )}
            {i === 3 && (
              <>
                <Tarto x1={xb + 4} y1={Y1} x2={xj} y2={Y1} />
                <Befogas x={xb + 4} y={Y1} irany="bal" hossz={40} />
              </>
            )}
            <Felirat x={x0 + 79} y={Y1 + 62} horgony="middle" meret={10.5} szin="#059669" vastag={600}>
              {p.szabad}
            </Felirat>
            <Felirat x={x0 + 79} y={Y1 + 76} horgony="middle" meret={10.5} szin="#be123c" vastag={600}>
              {p.gatolt}
            </Felirat>

            {/* --- alsó: elkülönítés --- */}
            <Felirat x={x0 + 79} y={Y2 - 42} horgony="middle" meret={10} szin="#64748b" vastag={600}>
              ELKÜLÖNÍTVE
            </Felirat>
            {i === 3 ? <Tarto x1={xb + 4} y1={Y2} x2={xj} y2={Y2} /> : <Tarto x1={xb} y1={Y2} x2={xj} y2={Y2} />}
            {i === 0 && (
              <>
                <ReakcioNyil x={xs} y={Y2} hossz={44} szog={90} />
                <Jel x={xs + 8} y={Y2 + 44} alap="A" szin={LILA} horgony="start" />
              </>
            )}
            {i === 1 && (
              <>
                <ReakcioNyil x={xs} y={Y2 + 46} hossz={46} szog={-90} />
                <Jel x={xs + 8} y={Y2 + 44} alap="S" szin={LILA} horgony="start" />
              </>
            )}
            {i === 2 && (
              <>
                <ReakcioNyil x={xs} y={Y2} hossz={40} szog={0} />
                <ReakcioNyil x={xs} y={Y2} hossz={44} szog={90} />
                <Jel x={xs - 40} y={Y2 - 8} alap="A" index="x" szin={LILA} horgony="start" />
                <Jel x={xs + 8} y={Y2 + 44} alap="A" index="y" szin={LILA} horgony="start" />
              </>
            )}
            {i === 3 && (
              <>
                <ReakcioNyil x={xb + 4} y={Y2} hossz={40} szog={0} />
                <ReakcioNyil x={xb + 4} y={Y2} hossz={44} szog={90} />
                <KoncentraltNyomatek x={xb + 4} y={Y2} r={17} irany={1} />
                <Jel x={xb - 34} y={Y2 - 8} alap="A" index="x" szin={LILA} horgony="start" />
                <Jel x={xb + 12} y={Y2 + 44} alap="A" index="y" szin={LILA} horgony="start" />
                <Jel x={xb + 26} y={Y2 - 22} alap="M" index="A" szin={SZIN.nyomatek} horgony="start" />
              </>
            )}
            <Felirat x={x0 + 79} y={Y2 + 66} horgony="middle" meret={10.5} szin="#475569" vastag={500}>
              {["1 ismeretlen: A", "1 ismeretlen: S (húzott)", "2 ismeretlen: Ax, Ay", "3 ismeretlen: Ax, Ay, MA"][i]}
            </Felirat>
          </g>
        );
      })}
    </svg>
  );
}

/* ============================================================
   2. Kéttámaszú tartó (tankönyv 4.5. ábra)
   ============================================================ */
export function AbraKettamaszu() {
  // bal: ferde görgő (a, b) – jobb: vízszintes görgő (c, d)
  const Y1 = 86;
  const Y2 = 268;
  // bal panel
  const A = 70;
  const B = 260;
  // B reakció iránya: a sík hajlása 60°, az erő a függőlegessel 60°-ot zár be → 150°
  const bSzog = 150;
  const D = { x: A, y: Y2 - (B - A) * Math.tan((30 * Math.PI) / 180) };
  // jobb panel
  const A2 = 400;
  const B2 = 600;
  return (
    <svg viewBox="0 0 660 380" className="abra w-full h-auto">
      <TartoHegyek />
      {/* ---------- a) ---------- */}
      <Felirat x={22} y={20} meret={12} szin="#64748b">
        a) ferde görgővel
      </Felirat>
      <Tarto x1={A - 10} y1={Y1} x2={B + 10} y2={Y1} />
      <Csuklo x={A} y={Y1} />
      <Gorgo x={B} y={Y1} szog={60} />
      <TamaszCimke x={A - 20} y={Y1 + 6}>A</TamaszCimke>
      <TamaszCimke x={B + 18} y={Y1 - 8}>B</TamaszCimke>
      <TeherNyil x={125} y={Y1} hossz={46} szog={-60} cimke="F₁" cimkeEltolas={[-24, -4]} />
      <TeherNyil x={195} y={Y1} hossz={46} szog={-90} cimke="F₂" cimkeEltolas={[8, -4]} />

      {/* ---------- b) elkülönítés ---------- */}
      <Felirat x={120} y={Y2 - 96} meret={12} szin="#64748b">
        b) elkülönítés és az egyenletek
      </Felirat>
      <Szaggatott x1={B} y1={Y2} x2={D.x} y2={D.y} />
      <Szaggatott x1={A} y1={Y2 + 10} x2={D.x} y2={D.y - 10} />
      <Pont x={D.x} y={D.y} cimke="D" dx={-16} dy={-6} />
      <Tarto x1={A - 10} y1={Y2} x2={B + 10} y2={Y2} />
      <TeherNyil x={125} y={Y2} hossz={46} szog={-60} cimke="F₁" cimkeEltolas={[-24, -4]} />
      <TeherNyil x={195} y={Y2} hossz={46} szog={-90} cimke="F₂" cimkeEltolas={[8, -4]} />
      <ReakcioNyil x={A} y={Y2} hossz={40} szog={0} />
      <ReakcioNyil x={A} y={Y2} hossz={44} szog={90} />
      <ReakcioNyil x={B} y={Y2} hossz={48} szog={bSzog} />
      <Jel x={A - 42} y={Y2 - 8} alap="A" index="x" szin={LILA} horgony="start" />
      <Jel x={A + 8} y={Y2 + 42} alap="A" index="y" szin={LILA} horgony="start" />
      <Jel x={B + 30} y={Y2 + 36} alap="B" szin={LILA} horgony="start" />
      <Pont x={A} y={Y2} />
      <Pont x={B} y={Y2} />
      <EgyenletTipp x={150} y={Y2 + 40} fajta="M" pont="A" cel="B" />
      <EgyenletTipp x={150} y={Y2 + 58} fajta="M" pont="B" cel="A" celIndex="y" />
      <EgyenletTipp x={150} y={Y2 + 76} fajta="M" pont="D" cel="A" celIndex="x" />
      <Felirat x={150} y={Y2 + 96} meret={11} szin="#059669" vastag={600}>
        ellenőrzés: ΣFx vagy ΣFy
      </Felirat>

      {/* ---------- c) ---------- */}
      <Felirat x={A2 - 40} y={20} meret={12} szin="#64748b">
        c) vízszintes görgővel
      </Felirat>
      <Tarto x1={A2 - 10} y1={Y1} x2={B2 + 10} y2={Y1} />
      <Gorgo x={A2} y={Y1} />
      <Csuklo x={B2} y={Y1} />
      <TamaszCimke x={A2 - 20} y={Y1 + 6}>A</TamaszCimke>
      <TamaszCimke x={B2 + 18} y={Y1 - 8}>B</TamaszCimke>
      <TeherNyil x={455} y={Y1} hossz={46} szog={-60} cimke="F₁" cimkeEltolas={[-24, -4]} />
      <TeherNyil x={535} y={Y1} hossz={46} szog={-90} cimke="F₂" cimkeEltolas={[8, -4]} />

      {/* ---------- d) ---------- */}
      <Felirat x={A2 - 40} y={Y2 - 96} meret={12} szin="#64748b">
        d) elkülönítés és az egyenletek
      </Felirat>
      <Tarto x1={A2 - 10} y1={Y2} x2={B2 + 10} y2={Y2} />
      <TeherNyil x={455} y={Y2} hossz={46} szog={-60} cimke="F₁" cimkeEltolas={[-24, -4]} />
      <TeherNyil x={535} y={Y2} hossz={46} szog={-90} cimke="F₂" cimkeEltolas={[8, -4]} />
      <ReakcioNyil x={A2} y={Y2} hossz={44} szog={90} />
      <ReakcioNyil x={B2 + 42} y={Y2} hossz={42} szog={0} />
      <ReakcioNyil x={B2} y={Y2} hossz={44} szog={90} />
      <Jel x={A2 + 8} y={Y2 + 42} alap="A" szin={LILA} horgony="start" />
      <Jel x={B2 + 20} y={Y2 - 8} alap="B" index="x" szin={LILA} horgony="start" />
      <Jel x={B2 + 8} y={Y2 + 42} alap="B" index="y" szin={LILA} horgony="start" />
      <Pont x={A2} y={Y2} />
      <Pont x={B2} y={Y2} />
      <EgyenletTipp x={470} y={Y2 + 40} fajta="M" pont="B" cel="A" />
      <EgyenletTipp x={470} y={Y2 + 58} fajta="M" pont="A" cel="B" celIndex="y" />
      <EgyenletTipp x={470} y={Y2 + 76} fajta="Fx" cel="B" celIndex="x" />
      <Felirat x={470} y={Y2 + 96} meret={11} szin="#059669" vastag={600}>
        ellenőrzés: ΣFy
      </Felirat>
    </svg>
  );
}

/* ============================================================
   3. Befogott konzol (tankönyv 4.6. ábra)
   ============================================================ */
export function AbraKonzol() {
  const Y1 = 86;
  const Y2 = 262;
  const A = 62;
  const V = 272;
  const X2 = 420; // az oszlop a c) panelen
  const X2d = 570; // az elkülönített oszlop
  return (
    <svg viewBox="0 0 660 380" className="abra w-full h-auto">
      <TartoHegyek />
      <Felirat x={22} y={20} meret={12} szin="#64748b">
        a) vízszintes befogott konzol
      </Felirat>
      <Tarto x1={A} y1={Y1} x2={V} y2={Y1} />
      <Befogas x={A} y={Y1} irany="bal" hossz={44} />
      <TamaszCimke x={A + 14} y={Y1 + 22}>A</TamaszCimke>
      <TeherNyil x={150} y={Y1} hossz={48} szog={-60} cimke="F₁" cimkeEltolas={[-24, -4]} />
      <TeherNyil x={V} y={Y1} hossz={48} szog={-90} cimke="F₂" cimkeEltolas={[8, -4]} />

      <Felirat x={22} y={Y2 - 84} meret={12} szin="#64748b">
        b) elkülönítés és az egyenletek
      </Felirat>
      <Tarto x1={A} y1={Y2} x2={V} y2={Y2} />
      <TeherNyil x={150} y={Y2} hossz={48} szog={-60} cimke="F₁" cimkeEltolas={[-24, -4]} />
      <TeherNyil x={V} y={Y2} hossz={48} szog={-90} cimke="F₂" cimkeEltolas={[8, -4]} />
      <ReakcioNyil x={A} y={Y2} hossz={40} szog={0} />
      <ReakcioNyil x={A} y={Y2} hossz={44} szog={90} />
      <KoncentraltNyomatek x={A} y={Y2} r={20} irany={1} />
      <Jel x={A - 42} y={Y2 - 8} alap="A" index="x" szin={LILA} horgony="start" />
      <Jel x={A + 8} y={Y2 + 42} alap="A" index="y" szin={LILA} horgony="start" />
      <Jel x={A + 24} y={Y2 - 24} alap="M" index="A" szin={SZIN.nyomatek} horgony="start" />
      <Pont x={A} y={Y2} />
      <EgyenletTipp x={150} y={Y2 + 40} fajta="Fx" cel="A" celIndex="x" />
      <EgyenletTipp x={150} y={Y2 + 58} fajta="Fy" cel="A" celIndex="y" />
      <EgyenletTipp x={150} y={Y2 + 76} fajta="M" pont="A" cel="M" celIndex="A" />
      <Felirat x={150} y={Y2 + 96} meret={11} szin="#059669" vastag={600}>
        ellenőrzés: ΣM más pontra
      </Felirat>

      {/* ---------- c) oszlop ---------- */}
      <Felirat x={360} y={20} meret={12} szin="#64748b">
        c) befogott oszlop
      </Felirat>
      <Tarto x1={X2} y1={44} x2={X2} y2={262} />
      <Befogas x={X2} y={262} irany="le" hossz={44} />
      <TamaszCimke x={X2 + 18} y={258}>B</TamaszCimke>
      <TeherNyil x={X2} y={56} hossz={50} szog={0} cimke="F₁" cimkeEltolas={[-2, -8]} />
      <TeherNyil x={X2} y={156} hossz={50} szog={0} cimke="F₂" cimkeEltolas={[-2, -8]} />

      <Felirat x={505} y={20} meret={12} szin="#64748b">
        d) elkülönítés
      </Felirat>
      <Tarto x1={X2d} y1={44} x2={X2d} y2={262} />
      <TeherNyil x={X2d} y={56} hossz={50} szog={0} cimke="F₁" cimkeEltolas={[-2, -8]} />
      <TeherNyil x={X2d} y={156} hossz={50} szog={0} cimke="F₂" cimkeEltolas={[-2, -8]} />
      <ReakcioNyil x={X2d + 42} y={262} hossz={42} szog={0} />
      <ReakcioNyil x={X2d} y={262} hossz={44} szog={90} />
      <KoncentraltNyomatek x={X2d} y={222} r={18} irany={1} />
      <Jel x={X2d + 22} y={252} alap="B" index="x" szin={LILA} horgony="start" />
      <Jel x={X2d + 8} y={308} alap="B" index="y" szin={LILA} horgony="start" />
      <Jel x={X2d - 48} y={214} alap="M" index="B" szin={SZIN.nyomatek} horgony="start" />
      <Pont x={X2d} y={262} />
      <EgyenletTipp x={486} y={310} fajta="M" pont="B" cel="M" celIndex="B" />
      <EgyenletTipp x={486} y={328} fajta="Fx" cel="B" celIndex="x" />
      <EgyenletTipp x={486} y={346} fajta="Fy" cel="B" celIndex="y" />
    </svg>
  );
}

/* ============================================================
   4. Csuklóval és rúddal megtámasztott tartó (tankönyv 4.7. ábra)
   ============================================================ */
export function AbraRuddal() {
  const Y1 = 92;
  const Y2 = 272;
  const A = 72;
  const C = 172;
  const W = { x: 66, y: 38 }; // a rúd faltámasza
  const dx = W.x - C;
  const dy = W.y - Y1; // képernyő: negatív = felfelé
  const h = Math.hypot(dx, dy);
  const szog = (Math.atan2(-dy, dx) * 180) / Math.PI; // matematikai szög (149°)
  const Wd = { x: W.x, y: W.y + (Y2 - Y1) };
  const D = { x: A, y: Y2 + ((A - C) * dy) / dx };
  const Stip = { x: C + (40 * dx) / h, y: Y2 + (40 * dy) / h };
  // jobb panel
  const A2 = 396;
  const B2 = 606;
  return (
    <svg viewBox="0 0 660 380" className="abra w-full h-auto">
      <TartoHegyek />
      <Felirat x={22} y={16} meret={12} szin="#64748b">
        a) ferde rúddal felfüggesztett előtető
      </Felirat>
      <Befogas x={W.x - 4} y={W.y} irany="bal" hossz={26} />
      <Rud x1={W.x} y1={W.y} x2={C} y2={Y1} />
      <Tarto x1={A - 10} y1={Y1} x2={296} y2={Y1} />
      <Csuklo x={A} y={Y1} />
      <TamaszCimke x={A - 20} y={Y1 + 6}>A</TamaszCimke>
      <TamaszCimke x={C + 4} y={Y1 + 18}>C</TamaszCimke>
      <TeherNyil x={218} y={Y1} hossz={46} szog={-90} cimke="F₁" cimkeEltolas={[-18, -4]} />
      <TeherNyil x={290} y={Y1} hossz={46} szog={-60} cimke="F₂" cimkeEltolas={[6, -4]} />

      <Felirat x={22} y={Y2 - 96} meret={12} szin="#64748b">
        b) elkülönítés és az egyenletek
      </Felirat>
      <Szaggatott x1={C} y1={Y2} x2={Wd.x} y2={Wd.y} />
      <Szaggatott x1={A} y1={Y2 + 8} x2={A} y2={D.y - 10} />
      <Pont x={D.x} y={D.y} cimke="D" dx={-16} dy={-4} />
      <Tarto x1={A - 10} y1={Y2} x2={296} y2={Y2} />
      <TeherNyil x={218} y={Y2} hossz={46} szog={-90} cimke="F₁" cimkeEltolas={[-18, -4]} />
      <TeherNyil x={290} y={Y2} hossz={46} szog={-60} cimke="F₂" cimkeEltolas={[6, -4]} />
      <ReakcioNyil x={A} y={Y2} hossz={40} szog={0} />
      <ReakcioNyil x={A} y={Y2} hossz={44} szog={90} />
      <ReakcioNyil x={Stip.x} y={Stip.y} hossz={40} szog={szog} />
      <Jel x={A - 42} y={Y2 - 8} alap="A" index="x" szin={LILA} horgony="start" />
      <Jel x={A + 8} y={Y2 + 42} alap="A" index="y" szin={LILA} horgony="start" />
      <Jel x={Stip.x - 4} y={Stip.y - 8} alap="S" szin={LILA} horgony="end" />
      <Pont x={A} y={Y2} />
      <Pont x={C} y={Y2} cimke="C" dx={4} dy={18} />
      <EgyenletTipp x={150} y={Y2 + 40} fajta="M" pont="A" cel="S" />
      <EgyenletTipp x={150} y={Y2 + 58} fajta="M" pont="C" cel="A" celIndex="y" />
      <EgyenletTipp x={150} y={Y2 + 76} fajta="M" pont="D" cel="A" celIndex="x" />
      <Felirat x={150} y={Y2 + 96} meret={11} szin="#059669" vastag={600}>
        ellenőrzés: ΣFx vagy ΣFy
      </Felirat>

      {/* ---------- c) függőleges rúd ---------- */}
      <Felirat x={A2 - 36} y={16} meret={12} szin="#64748b">
        c) függőleges rúddal megtámasztva
      </Felirat>
      <Tarto x1={A2 - 10} y1={Y1} x2={B2} y2={Y1} />
      <Rud x1={A2} y1={Y1} x2={A2} y2={Y1 + 52} />
      <Csuklo x={A2} y={Y1 + 52} meret={12} />
      <Csuklo x={B2} y={Y1} forgatas={-90} />
      <TamaszCimke x={A2 + 14} y={Y1 - 8}>A</TamaszCimke>
      <TamaszCimke x={B2 - 4} y={Y1 - 12}>B</TamaszCimke>
      <TeherNyil x={450} y={Y1} hossz={46} szog={-60} cimke="F₁" cimkeEltolas={[-24, -4]} />
      <TeherNyil x={530} y={Y1} hossz={46} szog={-90} cimke="F₂" cimkeEltolas={[8, -4]} />

      <Felirat x={A2 - 36} y={Y2 - 96} meret={12} szin="#64748b">
        d) elkülönítés és az egyenletek
      </Felirat>
      <Tarto x1={A2 - 10} y1={Y2} x2={B2} y2={Y2} />
      <TeherNyil x={450} y={Y2} hossz={46} szog={-60} cimke="F₁" cimkeEltolas={[-24, -4]} />
      <TeherNyil x={530} y={Y2} hossz={46} szog={-90} cimke="F₂" cimkeEltolas={[8, -4]} />
      <ReakcioNyil x={A2} y={Y2 + 46} hossz={46} szog={-90} />
      <ReakcioNyil x={B2 + 42} y={Y2} hossz={42} szog={0} />
      <ReakcioNyil x={B2} y={Y2} hossz={44} szog={90} />
      <Jel x={A2 + 8} y={Y2 + 44} alap="S" szin={LILA} horgony="start" />
      <Jel x={B2 + 20} y={Y2 - 8} alap="B" index="x" szin={LILA} horgony="start" />
      <Jel x={B2 + 8} y={Y2 + 42} alap="B" index="y" szin={LILA} horgony="start" />
      <Pont x={A2} y={Y2} />
      <Pont x={B2} y={Y2} />
      <EgyenletTipp x={470} y={Y2 + 40} fajta="M" pont="B" cel="S" />
      <EgyenletTipp x={470} y={Y2 + 58} fajta="M" pont="A" cel="B" celIndex="y" />
      <EgyenletTipp x={470} y={Y2 + 76} fajta="Fx" cel="B" celIndex="x" />
      <Felirat x={470} y={Y2 + 96} meret={11} szin="#059669" vastag={600}>
        ellenőrzés: ΣFy
      </Felirat>
    </svg>
  );
}

/* ============================================================
   5. Három rúddal megtámasztott gerenda (tankönyv 4.8. ábra)
   ============================================================ */
export function AbraHaromRud() {
  const L = 36; // px / m
  const Y1 = 76;
  const Y2 = 254;
  const kx = (X, x0) => x0 + X * L;
  const ky = (Y, y0) => y0 - Y * L;

  // bal: L=(0,0), C=(2,0), A=(1.2,-2), B=(2,-2); gerenda 0..5
  const bx0 = 40;
  const bal = {
    L: [0, 0],
    C: [2, 0],
    A: [1.2, -2],
    B: [2, -2],
    O2: [2, -2 / 0.6], // S1 (L→A) egyenese x = 2-nél: y = -2·(2/1.2)
  };
  // jobb: L=(0,0), A=(1.2,-2), C=(2.5,0), B=(3.7,-2) → S1 ∥ S3
  const jx0 = 370;
  const jobb = { L: [0, 0], C: [2.5, 0], A: [1.2, -2], B: [3.7, -2] };

  const rudNyil = (P, Q, x0, y0, hossz = 38) => {
    // P-ből Q felé mutató (húzó) rúderő nyila
    const dx = Q[0] - P[0];
    const dy = Q[1] - P[1];
    const h = Math.hypot(dx, dy);
    const szog = (Math.atan2(dy, dx) * 180) / Math.PI;
    return { x: kx(P[0], x0) + (hossz * dx) / h, y: ky(P[1], y0) - (hossz * dy) / h, szog };
  };

  const s1b = rudNyil(bal.L, bal.A, bx0, Y2);
  const s2b = rudNyil(bal.C, bal.A, bx0, Y2);
  const s3b = rudNyil(bal.C, bal.B, bx0, Y2);
  const s1j = rudNyil(jobb.L, jobb.A, jx0, Y2);
  const s2j = rudNyil(jobb.C, jobb.A, jx0, Y2);
  const s3j = rudNyil(jobb.C, jobb.B, jx0, Y2);
  // t irány: merőleges S1-re (jobb panel)
  const t = { x: 2, y: 1.2 };
  const th = Math.hypot(t.x, t.y);
  const tA = { x: kx(3.0, jx0), y: ky(-2.6, Y2) };

  return (
    <svg viewBox="0 0 660 410" className="abra w-full h-auto">
      <TartoHegyek />
      <Felirat x={22} y={20} meret={12} szin="#64748b">
        a) három rúd, páronként metsző hatásvonalak
      </Felirat>
      <Tarto x1={kx(0, bx0)} y1={Y1} x2={kx(5, bx0)} y2={Y1} />
      <Rud x1={kx(0, bx0)} y1={Y1} x2={kx(1.2, bx0)} y2={ky(-2, Y1)} />
      <Rud x1={kx(2, bx0)} y1={Y1} x2={kx(1.2, bx0)} y2={ky(-2, Y1)} />
      <Rud x1={kx(2, bx0)} y1={Y1} x2={kx(2, bx0)} y2={ky(-2, Y1)} />
      <Csuklo x={kx(1.2, bx0)} y={ky(-2, Y1)} meret={12} />
      <Csuklo x={kx(2, bx0)} y={ky(-2, Y1)} meret={12} />
      <TamaszCimke x={kx(1.2, bx0) - 16} y={ky(-2, Y1) + 4}>A</TamaszCimke>
      <TamaszCimke x={kx(2, bx0) + 16} y={ky(-2, Y1) + 4}>B</TamaszCimke>
      <TamaszCimke x={kx(2, bx0) + 12} y={Y1 - 8}>C</TamaszCimke>
      <TeherNyil x={kx(0.7, bx0)} y={Y1} hossz={40} szog={-90} cimke="F₁" cimkeEltolas={[6, -4]} />
      <TeherNyil x={kx(4.3, bx0)} y={Y1} hossz={42} szog={-120} cimke="F₂" cimkeEltolas={[6, -4]} />

      <Felirat x={22} y={Y2 - 60} meret={12} szin="#64748b">
        b) elkülönítés: a főpontok O₁, O₂, O₃
      </Felirat>
      <Szaggatott x1={kx(0, bx0)} y1={Y2} x2={kx(bal.O2[0], bx0)} y2={ky(bal.O2[1], Y2)} />
      <Szaggatott x1={kx(2, bx0)} y1={Y2} x2={kx(2, bx0)} y2={ky(bal.O2[1], Y2) + 6} />
      <Szaggatott x1={kx(2, bx0)} y1={Y2} x2={kx(0.6, bx0)} y2={ky(-3.5, Y2)} />
      <Tarto x1={kx(0, bx0)} y1={Y2} x2={kx(5, bx0)} y2={Y2} />
      <TeherNyil x={kx(0.7, bx0)} y={Y2} hossz={40} szog={-90} cimke="F₁" cimkeEltolas={[6, -4]} />
      <TeherNyil x={kx(4.3, bx0)} y={Y2} hossz={42} szog={-120} cimke="F₂" cimkeEltolas={[6, -4]} />
      <ReakcioNyil x={s1b.x} y={s1b.y} hossz={38} szog={s1b.szog} />
      <ReakcioNyil x={s2b.x} y={s2b.y} hossz={38} szog={s2b.szog} />
      <ReakcioNyil x={s3b.x} y={s3b.y} hossz={38} szog={s3b.szog} />
      <Jel x={s1b.x - 8} y={s1b.y + 6} alap="S" index="1" szin={LILA} horgony="end" />
      <Jel x={s2b.x - 6} y={s2b.y + 12} alap="S" index="2" szin={LILA} horgony="end" />
      <Jel x={s3b.x + 8} y={s3b.y + 4} alap="S" index="3" szin={LILA} horgony="start" />
      <Pont x={kx(2, bx0)} y={Y2} cimke="O₁ = C" dx={8} dy={-8} />
      <Pont x={kx(bal.O2[0], bx0)} y={ky(bal.O2[1], Y2)} cimke="O₂" dx={8} dy={4} />
      <Pont x={kx(1.2, bx0)} y={ky(-2, Y2)} cimke="O₃ = A" dx={-8} dy={12} />
      <EgyenletTipp x={200} y={Y2 + 60} fajta="M" pont="O₁" cel="S" celIndex="1" />
      <EgyenletTipp x={200} y={Y2 + 80} fajta="M" pont="O₂" cel="S" celIndex="2" />
      <EgyenletTipp x={200} y={Y2 + 100} fajta="M" pont="O₃" cel="S" celIndex="3" />
      <Felirat x={200} y={Y2 + 124} meret={11} szin="#059669" vastag={600}>
        ellenőrzés: ΣFx vagy ΣFy
      </Felirat>

      {/* ---------- c) két párhuzamos rúd ---------- */}
      <Felirat x={jx0 - 18} y={20} meret={12} szin="#64748b">
        c) három rúd, kettő párhuzamos
      </Felirat>
      <Tarto x1={kx(0, jx0)} y1={Y1} x2={kx(5, jx0)} y2={Y1} />
      <Rud x1={kx(0, jx0)} y1={Y1} x2={kx(1.2, jx0)} y2={ky(-2, Y1)} />
      <Rud x1={kx(2.5, jx0)} y1={Y1} x2={kx(1.2, jx0)} y2={ky(-2, Y1)} />
      <Rud x1={kx(2.5, jx0)} y1={Y1} x2={kx(3.7, jx0)} y2={ky(-2, Y1)} />
      <Csuklo x={kx(1.2, jx0)} y={ky(-2, Y1)} meret={12} />
      <Csuklo x={kx(3.7, jx0)} y={ky(-2, Y1)} meret={12} />
      <TamaszCimke x={kx(1.2, jx0) - 16} y={ky(-2, Y1) + 4}>A</TamaszCimke>
      <TamaszCimke x={kx(3.7, jx0) + 16} y={ky(-2, Y1) + 4}>B</TamaszCimke>
      <TamaszCimke x={kx(2.5, jx0) + 12} y={Y1 - 8}>C</TamaszCimke>
      <TeherNyil x={kx(0.7, jx0)} y={Y1} hossz={40} szog={-90} cimke="F₁" cimkeEltolas={[6, -4]} />
      <TeherNyil x={kx(4.3, jx0)} y={Y1} hossz={42} szog={-120} cimke="F₂" cimkeEltolas={[6, -4]} />

      <Felirat x={jx0 - 18} y={Y2 - 60} meret={12} szin="#64748b">
        d) elkülönítés: S₂ a t irányú vetületből
      </Felirat>
      <Szaggatott x1={kx(0, jx0)} y1={Y2} x2={kx(1.8, jx0)} y2={ky(-3, Y2)} />
      <Szaggatott x1={kx(2.5, jx0)} y1={Y2} x2={kx(4.3, jx0)} y2={ky(-3, Y2)} />
      <Szaggatott x1={kx(2.5, jx0)} y1={Y2} x2={kx(0.55, jx0)} y2={ky(-3, Y2)} />
      <Tarto x1={kx(0, jx0)} y1={Y2} x2={kx(5, jx0)} y2={Y2} />
      <TeherNyil x={kx(0.7, jx0)} y={Y2} hossz={40} szog={-90} cimke="F₁" cimkeEltolas={[6, -4]} />
      <TeherNyil x={kx(4.3, jx0)} y={Y2} hossz={42} szog={-120} cimke="F₂" cimkeEltolas={[6, -4]} />
      <ReakcioNyil x={s1j.x} y={s1j.y} hossz={38} szog={s1j.szog} />
      <ReakcioNyil x={s2j.x} y={s2j.y} hossz={38} szog={s2j.szog} />
      <ReakcioNyil x={s3j.x} y={s3j.y} hossz={38} szog={s3j.szog} />
      <Jel x={s1j.x - 8} y={s1j.y + 6} alap="S" index="1" szin={LILA} horgony="end" />
      <Jel x={s2j.x + 6} y={s2j.y + 12} alap="S" index="2" szin={LILA} horgony="start" />
      <Jel x={s3j.x + 8} y={s3j.y + 4} alap="S" index="3" szin={LILA} horgony="start" />
      <Pont x={kx(2.5, jx0)} y={Y2} cimke="C" dx={8} dy={-8} />
      <Pont x={kx(1.2, jx0)} y={ky(-2, Y2)} cimke="A" dx={-8} dy={12} />
      {/* t irány: merőleges a párhuzamos rudakra */}
      <line x1={tA.x} y1={tA.y} x2={tA.x + (36 * t.x) / th} y2={tA.y - (36 * t.y) / th} stroke="#0f766e" strokeWidth="1.8" markerEnd="url(#th-szurke)" />
      <Felirat x={tA.x + 30} y={tA.y - 22} meret={12} szin="#0f766e">
        t
      </Felirat>
      <EgyenletTipp x={520} y={Y2 + 60} fajta="Ft" cel="S" celIndex="2" />
      <EgyenletTipp x={520} y={Y2 + 80} fajta="M" pont="C" cel="S" celIndex="1" />
      <EgyenletTipp x={520} y={Y2 + 100} fajta="M" pont="A" cel="S" celIndex="3" />
      <Felirat x={520} y={Y2 + 124} meret={11} szin="#059669" vastag={600}>
        ellenőrzés: ΣFy
      </Felirat>
    </svg>
  );
}

/* ============================================================
   6. Grafikus megoldás (tankönyv 4.9. ábra)
   ============================================================ */
export function AbraSzerkesztes() {
  const Y = 160;
  const A = { x: 70, y: Y };
  const C = { x: 160, y: Y };
  const W = { x: 70, y: 40 };
  const xF = 200;
  // a rúd egyenese (s) C-n át, meghosszabbítva F hatásvonaláig (f)
  const sd = { x: C.x - W.x, y: C.y - W.y }; // (90, 120)
  const sh = Math.hypot(sd.x, sd.y);
  const tM = (xF - C.x) / sd.x;
  const Mp = { x: xF, y: C.y + tM * sd.y }; // metszéspont
  const ad = { x: Mp.x - A.x, y: Mp.y - A.y };
  const ah = Math.hypot(ad.x, ad.y);
  // vektorháromszög: F + S + A = 0 (F = 60 egység lefelé)
  const es = { x: sd.x / sh, y: sd.y / sh };
  const ea = { x: ad.x / ah, y: ad.y / ah };
  // 60 + es.y·s + ea.y·a = 0, es.x·s + ea.x·a = 0
  const a = (60 * es.x) / (es.y * ea.x - es.x * ea.y);
  const s = (-ea.x * a) / es.x;
  const P0 = { x: 470, y: 60 };
  const P1 = { x: P0.x, y: P0.y + 60 };
  const P2 = { x: P1.x + es.x * s, y: P1.y + es.y * s };
  return (
    <svg viewBox="0 0 660 260" className="abra w-full h-auto">
      <TartoHegyek />
      <Felirat x={22} y={20} meret={12} szin="#64748b">
        Geometriai ábra
      </Felirat>
      {/* hatásvonalak */}
      <Szaggatott x1={xF} y1={Y - 80} x2={xF} y2={Mp.y + 30} szin="#94a3b8" />
      <Szaggatott x1={W.x - 10} y1={W.y - 13} x2={Mp.x + 24} y2={Mp.y + 32} szin="#2563eb" />
      <Szaggatott x1={A.x - 30} y1={A.y - ea.y * 30} x2={Mp.x + 30} y2={Mp.y + ea.y * 30} szin="#7c3aed" />
      <Felirat x={xF + 6} y={Y - 66} meret={12} szin="#64748b">
        f
      </Felirat>
      <Felirat x={W.x + 40} y={W.y + 40} meret={12} szin="#2563eb">
        s
      </Felirat>
      <Felirat x={A.x + 60} y={A.y + 18} meret={12} szin="#7c3aed">
        a
      </Felirat>
      <Befogas x={W.x - 4} y={W.y} irany="bal" hossz={26} />
      <Rud x1={W.x} y1={W.y} x2={C.x} y2={C.y} />
      <Tarto x1={A.x - 10} y1={Y} x2={300} y2={Y} />
      {/* A csukló helye X-szel (a könyv 4.3.d ábrája szerint) */}
      <line x1={A.x - 8} y1={A.y - 8} x2={A.x + 8} y2={A.y + 8} stroke="#0f172a" strokeWidth="2" />
      <line x1={A.x - 8} y1={A.y + 8} x2={A.x + 8} y2={A.y - 8} stroke="#0f172a" strokeWidth="2" />
      <TamaszCimke x={A.x - 20} y={A.y - 10}>A</TamaszCimke>
      <TeherNyil x={xF} y={Y} hossz={48} szog={-90} cimke="F" cimkeEltolas={[8, -4]} />
      <Pont x={Mp.x} y={Mp.y} cimke="M" dx={10} dy={-6} />
      <Felirat x={22} y={Y + 90} meret={11} szin="#475569" vastag={500}>
        három erő egyensúlya: közös metszéspont (M)
      </Felirat>

      {/* vektorábra */}
      <Felirat x={400} y={20} meret={12} szin="#64748b">
        Vektorábra
      </Felirat>
      <line x1={P0.x} y1={P0.y} x2={P1.x} y2={P1.y} stroke={SZIN.teher} strokeWidth="3" strokeLinecap="round" markerEnd="url(#th-teher)" />
      <line x1={P1.x} y1={P1.y} x2={P2.x} y2={P2.y} stroke="#2563eb" strokeWidth="3" strokeLinecap="round" markerEnd="url(#th-reakcio)" />
      <line x1={P2.x} y1={P2.y} x2={P0.x} y2={P0.y} stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" markerEnd="url(#th-reakcio)" />
      <Felirat x={P0.x + 10} y={(P0.y + P1.y) / 2 + 4} meret={13} szin={SZIN.teher}>
        F
      </Felirat>
      <Felirat x={(P1.x + P2.x) / 2 - 8} y={(P1.y + P2.y) / 2 + 16} meret={13} szin="#2563eb">
        S
      </Felirat>
      <Felirat x={(P2.x + P0.x) / 2 - 4} y={(P2.y + P0.y) / 2 - 8} meret={13} szin="#7c3aed">
        A
      </Felirat>
      <Felirat x={400} y={Y + 90} meret={11} szin="#475569" vastag={500}>
        zárt vektorháromszög — hossz az erőlépték szerint
      </Felirat>
    </svg>
  );
}
