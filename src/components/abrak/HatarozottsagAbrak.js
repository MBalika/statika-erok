"use client";

/**
 * A 8. modul (statikai határozottság) elméleti ábrái – a tankönyv 7.1–7.12. ábrája nyomán.
 * Minden ábra 600 széles viewBoxban; a szélső feliratok 60 ≤ x ≤ 540 között maradnak.
 */

import { TartoHegyek, Tarto, Gorgo, Csuklo, Befogas, Rud, BelsoCsuklo, TeherNyil, ReakcioNyil, TamaszCimke, SZIN } from "@/components/tartok/TartoElemek";
import RacsosRajz from "@/components/racsos/RacsosRajz";

const ZOLD = "#15803d";
const BORDO = "#be123c";
const LILA = "#7c3aed";
const SZURKE = "#64748b";
const KEK = "#2563eb";

function Felirat({ x, y, children, szin = "#1d3c48", meret = 12, horgony = "middle", vastag = 650, dolt = false }) {
  return (
    <text x={x} y={y} textAnchor={horgony} fontSize={meret} fontWeight={vastag} fontStyle={dolt ? "italic" : "normal"} style={{ fill: szin, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
      {children}
    </text>
  );
}

/** Kis címke-doboz (a), b), …) az ábrák sarkába. */
function Betu({ x, y, children }) {
  return (
    <text x={x} y={y} fontSize="12.5" fontWeight="700" style={{ fill: "#1d3c48" }}>
      {children}
    </text>
  );
}

/** Kerek jelvény a számláláshoz: „3 = 3”, „4 &gt; 3”. */
function Jelveny({ x, y, szoveg, szin = ZOLD, w = 52 }) {
  const W = Math.max(w, 7 * String(szoveg).length + 16);
  return (
    <g>
      <rect x={x - W / 2} y={y - 10} width={W} height={19} rx="9" fill="white" stroke={szin} strokeWidth="1.3" />
      <text x={x} y={y + 4} textAnchor="middle" fontSize="11.5" fontWeight="700" style={{ fill: szin }}>
        {szoveg}
      </text>
    </g>
  );
}

/** Szabad mozgás jele: szaggatott nyíl (eltolódás) vagy ív (elfordulás). */
function Mozgas({ x, y, tipus = "vizszintes", r = 22, szin = BORDO }) {
  if (tipus === "forgas") {
    return (
      <g>
        <path d={`M ${x + r} ${y} A ${r} ${r} 0 1 1 ${x - r} ${y}`} fill="none" stroke={szin} strokeWidth="1.8" strokeDasharray="4 3" markerEnd="url(#hh-bordo)" />
      </g>
    );
  }
  if (tipus === "fuggoleges") {
    return <line x1={x} y1={y + r} x2={x} y2={y - r} stroke={szin} strokeWidth="1.8" strokeDasharray="4 3" markerEnd="url(#hh-bordo)" markerStart="url(#hh-bordo)" />;
  }
  return <line x1={x - r} y1={y} x2={x + r} y2={y} stroke={szin} strokeWidth="1.8" strokeDasharray="4 3" markerEnd="url(#hh-bordo)" markerStart="url(#hh-bordo)" />;
}

export function HatarozottsagHegyek() {
  const lista = [
    ["hh-bordo", BORDO],
    ["hh-zold", ZOLD],
    ["hh-lila", LILA],
    ["hh-kek", KEK],
    ["hh-szurke", SZURKE],
  ];
  return (
    <defs>
      {lista.map(([id, szin]) => (
        <marker key={id} id={id} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 9 5 L 0 9 z" fill={szin} />
        </marker>
      ))}
    </defs>
  );
}

/* ============================================================
   1. ábra – a FELADAT határozottsága (7.1–7.3): ugyanaz a teher, más támaszok
   ============================================================ */
export function AbraFeladatok() {
  const Y = 96;
  const oszlop = (ox, cim, szin, tamaszok, terhek, felirat, jelveny) => (
    <g>
      <rect x={ox - 92} y={14} width={184} height={166} rx="12" fill="white" stroke={szin} strokeWidth="1.2" opacity="0.9" />
      <Felirat x={ox} y={34} szin={szin} meret={12}>
        {cim}
      </Felirat>
      <Tarto x1={ox - 70} y1={Y} x2={ox + 70} y2={Y} />
      {tamaszok}
      {terhek}
      <Felirat x={ox} y={146} szin="#475569" meret={10.5} vastag={500}>
        {felirat}
      </Felirat>
      <Jelveny x={ox} y={166} szoveg={jelveny} szin={szin} w={110} />
    </g>
  );
  return (
    <svg viewBox="0 0 600 190" className="abra w-full h-auto select-none">
      <TartoHegyek />
      <HatarozottsagHegyek />
      {oszlop(
        104,
        "határozott feladat",
        ZOLD,
        <>
          <Csuklo x={104 - 70} y={Y} meret={13} />
          <Gorgo x={104 + 70} y={Y} meret={13} />
        </>,
        <>
          <TeherNyil x={104 - 20} y={Y - 3} hossz={44} szog={-60} cimke="F₁" cimkeEltolas={[-14, -4]} />
          <TeherNyil x={104 + 40} y={Y - 3} hossz={44} szog={-90} cimke="F₂" cimkeEltolas={[6, -2]} />
        </>,
        "csukló + görgő: 3 egyenlet = 3 ismeretlen",
        "egyértelmű megoldás",
      )}
      {oszlop(
        300,
        "határozatlan feladat",
        LILA,
        <>
          <Csuklo x={300 - 70} y={Y} meret={13} />
          <Csuklo x={300 + 70} y={Y} meret={13} />
        </>,
        <>
          <TeherNyil x={300 - 20} y={Y - 3} hossz={44} szog={-60} cimke="F₁" cimkeEltolas={[-14, -4]} />
          <TeherNyil x={300 + 40} y={Y - 3} hossz={44} szog={-90} cimke="F₂" cimkeEltolas={[6, -2]} />
        </>,
        "két csukló: 4 ismeretlen, Aₓ+Bₓ csak együtt",
        "van megoldás, nem egyértelmű",
      )}
      {oszlop(
        496,
        "túlhatározott feladat",
        BORDO,
        <>
          <Gorgo x={496 - 70} y={Y} meret={13} />
          <Gorgo x={496 + 70} y={Y} meret={13} />
          <Mozgas x={496} y={Y + 44} tipus="vizszintes" r={26} />
        </>,
        <>
          <TeherNyil x={496 - 20} y={Y - 3} hossz={44} szog={-60} cimke="F₁" cimkeEltolas={[-14, -4]} />
          <TeherNyil x={496 + 40} y={Y - 3} hossz={44} szog={-90} cimke="F₂" cimkeEltolas={[6, -2]} />
        </>,
        "két görgő: ΣFₓ-ben nincs ismeretlen",
        "nincs megoldás",
      )}
    </svg>
  );
}

/* ============================================================
   2. ábra – határozott egyszerű tartók (7.4)
   ============================================================ */
export function AbraEgyszeru() {
  return (
    <svg viewBox="0 0 600 300" className="abra w-full h-auto select-none">
      <TartoHegyek />
      <HatarozottsagHegyek />
      {/* a) kéttámaszú */}
      <g>
        <Betu x={40} y={40}>a)</Betu>
        <Tarto x1={60} y1={70} x2={230} y2={70} />
        <Csuklo x={66} y={70} meret={13} />
        <Gorgo x={224} y={70} meret={13} />
        <TamaszCimke x={66} y={112}>A</TamaszCimke>
        <TamaszCimke x={224} y={112}>B</TamaszCimke>
        <Jelveny x={145} y={56} szoveg="2 + 1 = 3" />
      </g>
      {/* b) három görgő, egy ferde */}
      <g>
        <Betu x={40} y={150}>b)</Betu>
        <Tarto x1={60} y1={180} x2={230} y2={180} />
        <Gorgo x={66} y={180} szog={-40} meret={12} />
        <Gorgo x={145} y={180} meret={13} />
        <Gorgo x={224} y={180} meret={13} />
        <TamaszCimke x={90} y={222}>A</TamaszCimke>
        <TamaszCimke x={145} y={222}>B</TamaszCimke>
        <TamaszCimke x={224} y={222}>C</TamaszCimke>
        <Jelveny x={145} y={166} szoveg="1 + 1 + 1 = 3" w={78} />
      </g>
      {/* c) tört testen csukló + görgő */}
      <g>
        <Betu x={270} y={40}>c)</Betu>
        <Tarto x1={300} y1={60} x2={430} y2={60} />
        <Tarto x1={430} y1={60} x2={430} y2={110} />
        <Csuklo x={300} y={60} meret={13} />
        <Gorgo x={430} y={110} szog={90} meret={12} />
        <TamaszCimke x={300} y={102}>A</TamaszCimke>
        <TamaszCimke x={470} y={116}>B</TamaszCimke>
        <Jelveny x={370} y={46} szoveg="2 + 1 = 3" />
      </g>
      {/* d) befogott konzol */}
      <g>
        <Betu x={500} y={40}>d)</Betu>
        <Befogas x={512} y={70} irany="bal" hossz={44} />
        <Tarto x1={512} y1={70} x2={590} y2={70} />
        <TamaszCimke x={526} y={104}>A</TamaszCimke>
        <Jelveny x={556} y={52} szoveg="3 = 3" w={44} />
      </g>
      {/* e) három rúd */}
      <g>
        <Betu x={270} y={150}>e)</Betu>
        <Tarto x1={310} y1={180} x2={560} y2={180} />
        <Rud x1={330} y1={180} x2={330} y2={250} />
        <Rud x1={410} y1={180} x2={470} y2={250} />
        <Rud x1={540} y1={180} x2={540} y2={250} />
        <Csuklo x={330} y={250} meret={10} />
        <Csuklo x={470} y={250} meret={10} />
        <Csuklo x={540} y={250} meret={10} />
        <TamaszCimke x={330} y={286}>A</TamaszCimke>
        <TamaszCimke x={470} y={286}>B</TamaszCimke>
        <TamaszCimke x={540} y={286}>C</TamaszCimke>
        <Jelveny x={435} y={166} szoveg="1 + 1 + 1 = 3" w={78} />
      </g>
    </svg>
  );
}

/* ============================================================
   3. ábra – túlhatározott egyszerű szerkezetek (7.5) a szabad mozgással
   ============================================================ */
export function AbraTulhatarozott() {
  return (
    <svg viewBox="0 0 600 300" className="abra w-full h-auto select-none">
      <TartoHegyek />
      <HatarozottsagHegyek />
      {/* a) egy csukló */}
      <g>
        <Betu x={40} y={40}>a)</Betu>
        <Tarto x1={60} y1={80} x2={230} y2={80} />
        <Csuklo x={66} y={80} meret={13} />
        <TamaszCimke x={66} y={122}>A</TamaszCimke>
        <Mozgas x={66} y={80} tipus="forgas" r={40} />
        <Jelveny x={160} y={54} szoveg="2 < 3 · elfordul" szin={BORDO} w={92} />
      </g>
      {/* b) két görgő */}
      <g>
        <Betu x={40} y={160}>b)</Betu>
        <Tarto x1={60} y1={200} x2={230} y2={200} />
        <Gorgo x={66} y={200} meret={13} />
        <Gorgo x={224} y={200} meret={13} />
        <TamaszCimke x={66} y={242}>A</TamaszCimke>
        <TamaszCimke x={224} y={242}>B</TamaszCimke>
        <Mozgas x={145} y={182} tipus="vizszintes" r={28} />
        <Jelveny x={145} y={160} szoveg="2 < 3 · eltolódik" szin={BORDO} w={96} />
      </g>
      {/* c) tört test két görgővel: hatásvonalak metszéspontja A */}
      <g>
        <Betu x={270} y={40}>c)</Betu>
        <Tarto x1={300} y1={70} x2={430} y2={70} />
        <Tarto x1={430} y1={70} x2={430} y2={120} />
        <Gorgo x={300} y={70} meret={13} />
        <Gorgo x={430} y={120} szog={90} meret={12} />
        <line x1={300} y1={30} x2={300} y2={70} stroke={SZURKE} strokeWidth="1" strokeDasharray="3 3" />
        <line x1={300} y1={120} x2={470} y2={120} stroke={SZURKE} strokeWidth="1" strokeDasharray="3 3" />
        <TamaszCimke x={300} y={112}>A</TamaszCimke>
        <TamaszCimke x={470} y={134}>B</TamaszCimke>
        <Mozgas x={300} y={120} tipus="forgas" r={22} />
        <Jelveny x={410} y={44} szoveg="2 < 3 · forog a metszéspont körül" szin={BORDO} w={170} />
      </g>
      {/* d) egy görgő */}
      <g>
        <Betu x={500} y={40}>d)</Betu>
        <Tarto x1={512} y1={80} x2={590} y2={80} />
        <Gorgo x={520} y={80} meret={12} />
        <Mozgas x={555} y={64} tipus="vizszintes" r={18} />
        <Mozgas x={520} y={80} tipus="forgas" r={30} />
        <Jelveny x={555} y={126} szoveg="1 < 3" szin={BORDO} w={44} />
      </g>
      {/* e) két rúd */}
      <g>
        <Betu x={270} y={160}>e)</Betu>
        <Tarto x1={310} y1={200} x2={560} y2={200} />
        <Rud x1={330} y1={200} x2={330} y2={262} />
        <Rud x1={540} y1={200} x2={470} y2={262} />
        <Csuklo x={330} y={262} meret={10} />
        <Csuklo x={470} y={262} meret={10} />
        <line x1={330} y1={200} x2={330} y2={112} stroke={SZURKE} strokeWidth="1" strokeDasharray="3 3" />
        <line x1={540} y1={200} x2={330} y2={112} stroke={SZURKE} strokeWidth="1" strokeDasharray="3 3" />
        <Mozgas x={330} y={112} tipus="forgas" r={16} />
        <TamaszCimke x={330} y={296}>A</TamaszCimke>
        <TamaszCimke x={470} y={296}>B</TamaszCimke>
        <Jelveny x={455} y={172} szoveg="2 < 3 · forog a metszéspont körül" szin={BORDO} w={170} />
      </g>
    </svg>
  );
}

/* ============================================================
   4. ábra – határozatlan egyszerű tartók (7.6) a fölös kényszer jelölésével
   ============================================================ */
export function AbraHatarozatlan() {
  const Folos = ({ x, y }) => (
    <g>
      <circle cx={x} cy={y} r="9" fill="#ede9fe" stroke={LILA} strokeWidth="1.3" />
      <text x={x} y={y + 4} textAnchor="middle" fontSize="11" fontWeight="700" style={{ fill: LILA }}>
        +
      </text>
    </g>
  );
  return (
    <svg viewBox="0 0 600 300" className="abra w-full h-auto select-none">
      <TartoHegyek />
      <HatarozottsagHegyek />
      {/* a) háromtámaszú */}
      <g>
        <Betu x={40} y={40}>a)</Betu>
        <Tarto x1={60} y1={76} x2={250} y2={76} />
        <Csuklo x={66} y={76} meret={13} />
        <Gorgo x={158} y={76} meret={13} />
        <Gorgo x={244} y={76} meret={13} />
        <Folos x={158} y={52} />
        <TamaszCimke x={66} y={118}>A</TamaszCimke>
        <TamaszCimke x={158} y={118}>B</TamaszCimke>
        <TamaszCimke x={244} y={118}>C</TamaszCimke>
        <Jelveny x={214} y={52} szoveg="4 = 3 + 1" szin={LILA} />
      </g>
      {/* b) két csukló */}
      <g>
        <Betu x={40} y={160}>b)</Betu>
        <Tarto x1={60} y1={196} x2={250} y2={196} />
        <Csuklo x={66} y={196} meret={13} />
        <Csuklo x={244} y={196} meret={13} />
        <Folos x={244} y={172} />
        <TamaszCimke x={66} y={238}>A</TamaszCimke>
        <TamaszCimke x={244} y={238}>B</TamaszCimke>
        <Jelveny x={155} y={172} szoveg="4 = 3 + 1" szin={LILA} />
      </g>
      {/* c) négy görgő, egy ferde */}
      <g>
        <Betu x={280} y={40}>c)</Betu>
        <Tarto x1={310} y1={76} x2={560} y2={76} />
        <Gorgo x={316} y={76} szog={-40} meret={11} />
        <Gorgo x={395} y={76} meret={12} />
        <Gorgo x={475} y={76} meret={12} />
        <Gorgo x={554} y={76} meret={12} />
        <Folos x={475} y={52} />
        <TamaszCimke x={340} y={118}>A</TamaszCimke>
        <TamaszCimke x={395} y={118}>B</TamaszCimke>
        <TamaszCimke x={475} y={118}>C</TamaszCimke>
        <TamaszCimke x={554} y={118}>D</TamaszCimke>
        <Jelveny x={410} y={52} szoveg="4 = 3 + 1" szin={LILA} />
      </g>
      {/* d) befogás + két görgő */}
      <g>
        <Betu x={280} y={160}>d)</Betu>
        <Befogas x={312} y={196} irany="bal" hossz={44} />
        <Tarto x1={312} y1={196} x2={560} y2={196} />
        <Gorgo x={436} y={196} meret={12} />
        <Gorgo x={554} y={196} meret={12} />
        <Folos x={436} y={172} />
        <Folos x={554} y={172} />
        <TamaszCimke x={326} y={230}>A</TamaszCimke>
        <TamaszCimke x={436} y={238}>B</TamaszCimke>
        <TamaszCimke x={554} y={238}>C</TamaszCimke>
        <Jelveny x={380} y={172} szoveg="5 = 3 + 2" szin={LILA} />
      </g>
      {/* e) négy rúd – középen, alul kis méretben */}
      <g>
        <Betu x={150} y={262}>e)</Betu>
        <Tarto x1={180} y1={270} x2={420} y2={270} />
        <Rud x1={200} y1={270} x2={200} y2={296} />
        <Rud x1={270} y1={270} x2={300} y2={296} />
        <Rud x1={330} y1={270} x2={300} y2={296} />
        <Rud x1={400} y1={270} x2={400} y2={296} />
        <Folos x={340} y={254} />
        <Jelveny x={460} y={274} szoveg="4 = 3 + 1" szin={LILA} />
      </g>
    </svg>
  );
}

/* ============================================================
   5. ábra – kritikus elrendezések (7.7): a számlálás jó, a tartó mégis mozog
   ============================================================ */
export function AbraKritikus() {
  return (
    <svg viewBox="0 0 600 310" className="abra w-full h-auto select-none">
      <TartoHegyek />
      <HatarozottsagHegyek />
      {/* a) három párhuzamos görgő */}
      <g>
        <Betu x={40} y={40}>a)</Betu>
        <Tarto x1={60} y1={86} x2={270} y2={86} />
        <Gorgo x={66} y={86} meret={13} />
        <Gorgo x={165} y={86} meret={13} />
        <Gorgo x={264} y={86} meret={13} />
        {[66, 165, 264].map((x) => (
          <line key={x} x1={x} y1={40} x2={x} y2={86} stroke={SZURKE} strokeWidth="1" strokeDasharray="3 3" />
        ))}
        <Mozgas x={165} y={64} tipus="vizszintes" r={30} />
        <TamaszCimke x={66} y={128}>A</TamaszCimke>
        <TamaszCimke x={165} y={128}>B</TamaszCimke>
        <TamaszCimke x={264} y={128}>C</TamaszCimke>
        <Jelveny x={165} y={40} szoveg="3 = 3, mégis eltolódik" szin={BORDO} w={128} />
      </g>
      {/* b) négy párhuzamos görgő: 4 > 3, mégis eltolódik */}
      <g>
        <Betu x={40} y={170}>b)</Betu>
        <Tarto x1={60} y1={216} x2={270} y2={216} />
        <Gorgo x={66} y={216} meret={12} />
        <Gorgo x={132} y={216} meret={12} />
        <Gorgo x={198} y={216} meret={12} />
        <Gorgo x={264} y={216} meret={12} />
        <Mozgas x={165} y={196} tipus="vizszintes" r={30} />
        <Jelveny x={165} y={170} szoveg="4 > 3, mégis eltolódik" szin={BORDO} w={128} />
      </g>
      {/* c) két vízszintes görgő a két végen: 2 < 3, mégis 1 fölös */}
      <g>
        <Betu x={310} y={40}>c)</Betu>
        <Tarto x1={330} y1={90} x2={560} y2={90} />
        <Gorgo x={330} y={90} szog={90} meret={12} />
        <Gorgo x={560} y={90} szog={-90} meret={12} />
        <line x1={300} y1={90} x2={590} y2={90} stroke={SZURKE} strokeWidth="1" strokeDasharray="3 3" />
        <Mozgas x={445} y={68} tipus="fuggoleges" r={18} />
        <Mozgas x={505} y={90} tipus="forgas" r={18} />
        <TamaszCimke x={360} y={122}>A</TamaszCimke>
        <TamaszCimke x={530} y={122}>B</TamaszCimke>
        <Jelveny x={445} y={40} szoveg="2 < 3: 2 mozgás, 1 fölös" szin={BORDO} w={150} />
      </g>
      {/* d) három rúd egy ponton át */}
      <g>
        <Betu x={310} y={170}>d)</Betu>
        <Tarto x1={330} y1={196} x2={560} y2={196} />
        <Rud x1={380} y1={196} x2={380} y2={266} />
        <Rud x1={450} y1={196} x2={380} y2={266} />
        <Rud x1={520} y1={196} x2={380} y2={266} />
        <Csuklo x={380} y={266} meret={10} />
        <Mozgas x={380} y={266} tipus="forgas" r={22} />
        <TamaszCimke x={380} y={300}>A</TamaszCimke>
        <Felirat x={478} y={250} szin={SZURKE} meret={11} vastag={500}>
          mindhárom hatásvonal az A ponton át
        </Felirat>
        <Jelveny x={470} y={170} szoveg="3 = 3, mégis elfordul" szin={BORDO} w={130} />
      </g>
    </svg>
  );
}

/* ============================================================
   6. ábra – összetett szerkezetek kritikus elrendezései (7.8)
   ============================================================ */
export function AbraOsszetettKritikus() {
  return (
    <svg viewBox="0 0 600 250" className="abra w-full h-auto select-none">
      <TartoHegyek />
      <HatarozottsagHegyek />
      {/* a) egy egyenesbe eső három csukló */}
      <g>
        <Betu x={30} y={40}>a)</Betu>
        <Tarto x1={60} y1={200} x2={60} y2={150} />
        <Tarto x1={60} y1={150} x2={120} y2={150} />
        <Tarto x1={120} y1={150} x2={120} y2={110} />
        <Tarto x1={120} y1={110} x2={180} y2={110} />
        <Tarto x1={180} y1={110} x2={180} y2={70} />
        <Tarto x1={180} y1={70} x2={250} y2={70} />
        <Tarto x1={250} y1={70} x2={250} y2={40} />
        <Csuklo x={60} y={200} meret={12} />
        <Gorgo x={250} y={40} szog={0} meret={11} />
        <BelsoCsuklo x={150} y={110} />
        <line x1={40} y1={218} x2={270} y2={22} stroke={BORDO} strokeWidth="1.2" strokeDasharray="5 4" />
        <TamaszCimke x={40} y={206}>A</TamaszCimke>
        <TamaszCimke x={272} y={46}>B</TamaszCimke>
        <TamaszCimke x={166} y={132}>C</TamaszCimke>
        <TeherNyil x={150} y={110} hossz={40} szog={-135} cimke="F" cimkeEltolas={[-12, -4]} />
        <Felirat x={150} y={240} szin={BORDO} meret={11}>
          A, C, B egy egyenesen: 6 = 6, mégis mozog
        </Felirat>
      </g>
      {/* b) két oszlop, két párhuzamos rúd */}
      <g>
        <Betu x={330} y={40}>b)</Betu>
        <Tarto x1={380} y1={210} x2={380} y2={60} />
        <Tarto x1={540} y1={210} x2={540} y2={60} />
        <Rud x1={380} y1={80} x2={540} y2={80} />
        <Rud x1={380} y1={150} x2={540} y2={150} />
        <Csuklo x={380} y={210} meret={12} />
        <Csuklo x={540} y={210} meret={12} />
        <line x1={350} y1={210} x2={570} y2={210} stroke={BORDO} strokeWidth="1.2" strokeDasharray="5 4" />
        <TamaszCimke x={380} y={250}>A</TamaszCimke>
        <TamaszCimke x={540} y={250}>B</TamaszCimke>
        <TeherNyil x={380} y={66} hossz={40} szog={0} cimke="F" cimkeEltolas={[6, -8]} />
        <Mozgas x={460} y={44} tipus="vizszintes" r={26} />
        <Felirat x={460} y={236} szin={BORDO} meret={11}>
          a rudak párhuzamosak AB-vel: az oszlopok elborulnak
        </Felirat>
      </g>
    </svg>
  );
}

/* ============================================================
   7. ábra – rácsos tartók: 7.9 (határozott) és 7.10 (a, c, e, f)
   ============================================================ */
const RACS_CS = [
  { id: "1", x: 0, y: 2 },
  { id: "2", x: 2, y: 2 },
  { id: "3", x: 4, y: 2 },
  { id: "4", x: 0, y: 0 },
  { id: "5", x: 2, y: 0 },
  { id: "6", x: 4, y: 0 },
];
const rud = (a, b) => ({ id: `${a},${b}`, a, b });
const RACS_ALAP = [rud("1", "2"), rud("2", "3"), rud("4", "5"), rud("5", "6"), rud("1", "4"), rud("2", "5"), rud("3", "6"), rud("1", "5"), rud("2", "6")];
const TAM = [
  { csomopont: "4", tipus: "csuklo", jel: "A" },
  { csomopont: "6", tipus: "gorgo", szog: 90, jel: "B" },
];

/** A tankönyv 7.9 és 7.10 ábrájának kis rácsos tartói. */
export const RACS_PELDAK = {
  tk79: { cim: "7.9 · határozott", csomopontok: RACS_CS, rudak: RACS_ALAP, tamaszok: TAM, e: 12, i: 12 },
  tk710a: { cim: "7.10.a · túlhatározott", csomopontok: RACS_CS, rudak: RACS_ALAP.filter((r) => r.id !== "1,5"), tamaszok: TAM, e: 12, i: 11 },
  tk710b: { cim: "7.10.b · túlhatározott", csomopontok: RACS_CS, rudak: RACS_ALAP, tamaszok: [{ csomopont: "4", tipus: "gorgo", szog: 90, jel: "A" }, { csomopont: "6", tipus: "gorgo", szog: 90, jel: "B" }], e: 12, i: 11 },
  tk710c: { cim: "7.10.c · határozatlan", csomopontok: RACS_CS, rudak: [...RACS_ALAP, rud("2", "4")], tamaszok: TAM, e: 12, i: 13 },
  tk710d: { cim: "7.10.d · határozatlan", csomopontok: RACS_CS, rudak: RACS_ALAP, tamaszok: [{ csomopont: "4", tipus: "csuklo", jel: "A" }, { csomopont: "6", tipus: "csuklo", jel: "B" }], e: 12, i: 13 },
  tk710e: { cim: "7.10.e · határozatlan és túlhatározott", csomopontok: RACS_CS, rudak: [...RACS_ALAP, rud("2", "4")], tamaszok: [{ csomopont: "4", tipus: "gorgo", szog: 90, jel: "A" }, { csomopont: "6", tipus: "gorgo", szog: 90, jel: "B" }], e: 12, i: 12 },
  tk710f: { cim: "7.10.f · határozatlan és túlhatározott", csomopontok: RACS_CS, rudak: [...RACS_ALAP.filter((r) => r.id !== "2,6"), rud("2", "4")], tamaszok: TAM, e: 12, i: 12 },
};

export function AbraRacsos() {
  const kulcsok = ["tk79", "tk710a", "tk710c", "tk710e", "tk710b", "tk710f"];
  const W = 190;
  const Hh = 150;
  return (
    <svg viewBox="0 0 600 330" className="abra w-full h-auto select-none">
      <TartoHegyek />
      <HatarozottsagHegyek />
      {kulcsok.map((k, idx) => {
        const p = RACS_PELDAK[k];
        const ox = 10 + (idx % 3) * 195;
        const oy = 6 + Math.floor(idx / 3) * 165;
        const szin = p.i === p.e ? (k === "tk79" ? ZOLD : BORDO) : p.i < p.e ? BORDO : LILA;
        return (
          <g key={k}>
            <RacsosRajz modell={{ csomopontok: p.csomopontok, rudak: p.rudak, tamaszok: p.tamaszok, terhek: [] }} csoport eltolas={[ox, oy]} szelesseg={W} magassag={Hh} margo={{ bal: 30, jobb: 30, fel: 34, le: 44 }} szinez={false} csomopontCimkek={false} tamaszMeret={10} />
            <text x={ox + W / 2} y={oy + 16} textAnchor="middle" fontSize="11" fontWeight="700" style={{ fill: szin }}>
              {p.cim}
            </text>
            <Jelveny x={ox + W / 2} y={oy + Hh - 2} szoveg={`2c = ${p.e}  ·  r + k = ${p.i}`} szin={szin} w={130} />
          </g>
        );
      })}
    </svg>
  );
}

/* ============================================================
   8. ábra – határozatlan tartó határozottá tétele (7.11, 7.12)
   ============================================================ */
export function AbraTorzstarto() {
  const Sor = ({ y, cim, tamaszok, extra, cimke }) => (
    <g>
      <Betu x={20} y={y - 24}>{cim}</Betu>
      <Tarto x1={60} y1={y} x2={280} y2={y} />
      {tamaszok}
      {extra}
      {(Array.isArray(cimke) ? cimke : [cimke]).map((sor, i) => (
        <Felirat key={i} x={300} y={y - 4 + 15 * i} szin="#475569" meret={11} horgony="start" vastag={500}>
          {sor}
        </Felirat>
      ))}
    </g>
  );
  return (
    <svg viewBox="0 0 600 450" className="abra w-full h-auto select-none">
      <TartoHegyek />
      <HatarozottsagHegyek />
      <Sor
        y={64}
        cim="a)"
        tamaszok={
          <>
            <Csuklo x={66} y={64} meret={12} />
            <Gorgo x={170} y={64} meret={12} />
            <Gorgo x={274} y={64} meret={12} />
            <TeherNyil x={120} y={61} hossz={40} szog={-60} cimke="F₁" cimkeEltolas={[-14, -2]} />
            <TeherNyil x={225} y={61} hossz={40} szog={-90} cimke="F₂" cimkeEltolas={[6, 4]} />
          </>
        }
        cimke={["háromtámaszú tartó: 4 ismeretlen, 3 egyenlet", "— egyszeresen határozatlan"]}
      />
      <Sor
        y={154}
        cim="b)"
        tamaszok={
          <>
            <Csuklo x={66} y={154} meret={12} />
            <Gorgo x={274} y={154} meret={12} />
            <ReakcioNyil x={170} y={157} hossz={40} szog={90} cimke="B" cimkeEltolas={[6, 4]} />
            <TeherNyil x={120} y={151} hossz={36} szog={-60} />
            <TeherNyil x={225} y={151} hossz={36} szog={-90} />
          </>
        }
        cimke={["a B görgő elvéve: kéttámaszú törzstartó,", "B a szabad paraméter (teherként működtetve)"]}
      />
      <Sor
        y={244}
        cim="c)"
        tamaszok={
          <>
            <Gorgo x={66} y={244} szog={-35} meret={11} />
            <Gorgo x={170} y={244} meret={12} />
            <Gorgo x={274} y={244} meret={12} />
            <ReakcioNyil x={66} y={244} hossz={40} szog={180} cimke="Aₓ" cimkeEltolas={[-4, -6]} />
            <TeherNyil x={120} y={241} hossz={36} szog={-60} />
            <TeherNyil x={225} y={241} hossz={36} szog={-90} />
          </>
        }
        cimke={["a csukló ferde görgővé alakítva", "(vízszintes komponense marad!): Aₓ a paraméter"]}
      />
      <Sor
        y={334}
        cim="d)"
        tamaszok={
          <>
            <Csuklo x={66} y={334} meret={12} />
            <Gorgo x={170} y={334} meret={12} />
            <Gorgo x={274} y={334} meret={12} />
            <BelsoCsuklo x={170} y={334} />
            <path d="M 148 314 A 14 14 0 0 1 166 306" fill="none" stroke={LILA} strokeWidth="2" markerEnd="url(#hh-lila)" />
            <path d="M 192 314 A 14 14 0 0 0 174 306" fill="none" stroke={LILA} strokeWidth="2" markerEnd="url(#hh-lila)" />
            <Felirat x={140} y={304} szin={LILA} meret={11}>
              M
            </Felirat>
            <Felirat x={200} y={304} szin={LILA} meret={11}>
              M
            </Felirat>
            <TeherNyil x={120} y={331} hossz={36} szog={-60} />
            <TeherNyil x={225} y={331} hossz={36} szog={-90} />
          </>
        }
        cimke={["belső csukló B fölött: a hajlítónyomaték", "a paraméter (két ellentett nyomaték)"]}
      />
      <g>
        <Betu x={20} y={400}>e)</Betu>
        <Befogas x={66} y={414} irany="bal" hossz={40} />
        <Tarto x1={66} y1={414} x2={200} y2={414} />
        <Gorgo x={194} y={414} meret={11} />
        <Felirat x={230} y={408} szin="#475569" meret={11} horgony="start" vastag={500}>
          befogás + görgő (7.12): 4 = 3 + 1 → a görgő elvéve konzol,
        </Felirat>
        <Felirat x={230} y={423} szin="#475569" meret={11} horgony="start" vastag={500}>
          vagy a befogás csuklóvá lazítva kéttámaszú tartó
        </Felirat>
      </g>
    </svg>
  );
}

/* ============================================================
   9. ábra – a négy kategória egy képen (7.4-es táblázat vizuálisan)
   ============================================================ */
export function AbraNegyKategoria() {
  const doboz = (x, y, cim, szin, gyerek, also) => (
    <g>
      <rect x={x} y={y} width={280} height={150} rx="12" fill="white" stroke={szin} strokeWidth="1.4" />
      <Felirat x={x + 140} y={y + 22} szin={szin} meret={12.5}>
        {cim}
      </Felirat>
      {gyerek}
      <Felirat x={x + 140} y={y + 138} szin="#475569" meret={10.5} vastag={500}>
        {also}
      </Felirat>
    </g>
  );
  return (
    <svg viewBox="0 0 600 330" className="abra w-full h-auto select-none">
      <TartoHegyek />
      <HatarozottsagHegyek />
      {doboz(
        10,
        10,
        "határozott tartó",
        ZOLD,
        <>
          <Tarto x1={60} y1={90} x2={240} y2={90} />
          <Csuklo x={66} y={90} meret={12} />
          <Gorgo x={234} y={90} meret={12} />
          <Felirat x={150} y={66} szin={ZOLD} meret={11}>
            mozgás: 0 · fölös kényszer: 0
          </Felirat>
        </>,
        "bármilyen teherre egyértelmű megoldás",
      )}
      {doboz(
        310,
        10,
        "határozatlan tartó",
        LILA,
        <>
          <Tarto x1={360} y1={90} x2={540} y2={90} />
          <Csuklo x={366} y={90} meret={12} />
          <Gorgo x={450} y={90} meret={12} />
          <Gorgo x={534} y={90} meret={12} />
          <Felirat x={450} y={66} szin={LILA} meret={11}>
            mozgás: 0 · fölös kényszer: 1
          </Felirat>
        </>,
        "mindig van megoldás, sosem egyértelmű",
      )}
      {doboz(
        10,
        170,
        "túlhatározott szerkezet",
        BORDO,
        <>
          <Tarto x1={60} y1={250} x2={240} y2={250} />
          <Gorgo x={66} y={250} meret={12} />
          <Gorgo x={234} y={250} meret={12} />
          <Mozgas x={150} y={232} tipus="vizszintes" r={26} />
          <Felirat x={150} y={210} szin={BORDO} meret={11}>
            mozgás: 1 · fölös kényszer: 0
          </Felirat>
        </>,
        "van teher, amire nincs egyensúly — nem tartó",
      )}
      {doboz(
        310,
        170,
        "határozatlan és túlhatározott",
        BORDO,
        <>
          <Tarto x1={360} y1={250} x2={540} y2={250} />
          <Gorgo x={366} y={250} meret={12} />
          <Gorgo x={450} y={250} meret={12} />
          <Gorgo x={534} y={250} meret={12} />
          <Mozgas x={450} y={232} tipus="vizszintes" r={26} />
          <Felirat x={450} y={210} szin={BORDO} meret={11}>
            mozgás: 1 · fölös kényszer: 1 (3 = 3!)
          </Felirat>
        </>,
        "kritikus elrendezés — a számlálás nem látja",
      )}
    </svg>
  );
}
