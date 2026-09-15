/** Statikus magyarázó ábrák. Minden ábra saját, egyedi azonosítójú nyílheggyel
 *  dolgozik, hogy egy oldalon több ábra is gond nélkül megférjen egymás mellett. */

function Hegy({ id, szin }) {
  return (
    <marker
      id={id}
      viewBox="0 0 10 10"
      refX="8.5"
      refY="5"
      markerWidth="7"
      markerHeight="7"
      orient="auto-start-reverse"
    >
      <path d="M 0 1 L 9 5 L 0 9 z" fill={szin} />
    </marker>
  );
}

/* ---------------- Az erő jellemzői ---------------- */

export function AbraEroJellemzoi() {
  // Támadáspont (150, 205), az erő iránya 35°, hossza 175 px
  const TX = 150;
  const TY = 205;
  const a = (35 * Math.PI) / 180;
  const H = 175;
  const vx = TX + H * Math.cos(a);
  const vy = TY - H * Math.sin(a);
  // A méretvonal merőleges eltolása
  const ex = -Math.sin(a) * 26;
  const ey = -Math.cos(a) * 26;

  return (
    <svg viewBox="0 0 560 300" className="abra w-full">
      <defs>
        <Hegy id="ej-ero" szin="#e2590a" />
        <Hegy id="ej-szurke" szin="#94a3b8" />
      </defs>

      {/* hatásvonal – a testen túl is folytatódik */}
      <line
        x1={TX - 105 * Math.cos(a)}
        y1={TY + 105 * Math.sin(a)}
        x2={TX + 250 * Math.cos(a)}
        y2={TY - 250 * Math.sin(a)}
        stroke="#94a3b8"
        strokeWidth="1.2"
        strokeDasharray="6 4"
      />
      <text x="415" y="62" fontSize="12" fill="#64748b">
        hatásvonal
      </text>

      {/* test */}
      <rect
        x="78"
        y="205"
        width="132"
        height="58"
        rx="6"
        fill="#dcedf0"
        stroke="#8ec3cd"
        strokeWidth="1.5"
      />
      <text x="112" y="240" fontSize="12.5" fill="#275767">
        test
      </text>

      {/* vízszintes viszonyítás a szöghöz */}
      <line
        x1={TX}
        y1={TY}
        x2={TX + 150}
        y2={TY}
        stroke="#475569"
        strokeWidth="1.2"
      />
      <text x={TX + 156} y={TY + 5} fontSize="12.5" fontStyle="italic" fill="#1d3c48">
        x
      </text>

      {/* szögív */}
      <path
        d={`M ${TX + 62} ${TY} A 62 62 0 0 0 ${TX + 62 * Math.cos(a)} ${
          TY - 62 * Math.sin(a)
        }`}
        fill="none"
        stroke="#64748b"
        strokeWidth="1.2"
      />
      <text x={TX + 72} y={TY - 16} fontSize="13" fill="#64748b">
        α
      </text>

      {/* erő */}
      <line
        x1={TX}
        y1={TY}
        x2={vx}
        y2={vy}
        stroke="#e2590a"
        strokeWidth="3.6"
        strokeLinecap="round"
        markerEnd="url(#ej-ero)"
      />
      <circle cx={TX} cy={TY} r="5" fill="#e2590a" />

      {/* méretvonal a nagysághoz */}
      <line
        x1={TX + ex}
        y1={TY + ey}
        x2={vx + ex}
        y2={vy + ey}
        stroke="#94a3b8"
        strokeWidth="1"
        markerStart="url(#ej-szurke)"
        markerEnd="url(#ej-szurke)"
      />
      <line x1={TX} y1={TY} x2={TX + ex} y2={TY + ey} stroke="#cbd5e1" strokeWidth="0.9" />
      <line x1={vx} y1={vy} x2={vx + ex} y2={vy + ey} stroke="#cbd5e1" strokeWidth="0.9" />
      <text
        x={(TX + vx) / 2 + ex}
        y={(TY + vy) / 2 + ey - 7}
        fontSize="11.5"
        fill="#64748b"
        textAnchor="middle"
        transform={`rotate(-35 ${(TX + vx) / 2 + ex} ${(TY + vy) / 2 + ey - 7})`}
      >
        nagyság: F
      </text>

      {/* feliratok */}
      <text
        x={(TX + vx) / 2 + 16}
        y={(TY + vy) / 2 + 22}
        fontSize="15"
        fontWeight="650"
        fill="#e2590a"
        fontStyle="italic"
      >
        F
      </text>

      <line x1={TX} y1={TY} x2="118" y2="170" stroke="#e2590a" strokeWidth="0.9" />
      <text x="36" y="164" fontSize="11.5" fill="#e2590a">
        támadáspont
      </text>

      <text x="300" y="240" fontSize="11.5" fill="#64748b">
        az irányt az α szög adja meg
      </text>
    </svg>
  );
}

/* ---------------- Láncszabály és paralelogramma ---------------- */

export function AbraOsszeadas() {
  return (
    <svg viewBox="0 0 560 250" className="abra w-full">
      <defs>
        <Hegy id="oa-1" szin="#e2590a" />
        <Hegy id="oa-2" szin="#0f766e" />
        <Hegy id="oa-r" szin="#7c3aed" />
      </defs>

      {/* --- bal: láncszabály --- */}
      <text x="30" y="28" fontSize="12.5" fontWeight="650" fill="#275767">
        Láncszabály
      </text>
      <line
        x1="40"
        y1="200"
        x2="150"
        y2="130"
        stroke="#e2590a"
        strokeWidth="3.2"
        strokeLinecap="round"
        markerEnd="url(#oa-1)"
      />
      <line
        x1="150"
        y1="130"
        x2="230"
        y2="150"
        stroke="#0f766e"
        strokeWidth="3.2"
        strokeLinecap="round"
        markerEnd="url(#oa-2)"
      />
      <line
        x1="40"
        y1="200"
        x2="230"
        y2="150"
        stroke="#7c3aed"
        strokeWidth="3.6"
        strokeLinecap="round"
        markerEnd="url(#oa-r)"
      />
      <text x="78" y="158" fontSize="13" fontWeight="650" fill="#e2590a">
        F₁
      </text>
      <text x="192" y="128" fontSize="13" fontWeight="650" fill="#0f766e">
        F₂
      </text>
      <text x="128" y="192" fontSize="14" fontWeight="700" fill="#7c3aed">
        R
      </text>
      <text x="30" y="232" fontSize="11.5" fill="#64748b">
        a másodikat az első végéhez fűzzük
      </text>

      {/* --- jobb: paralelogramma --- */}
      <text x="320" y="28" fontSize="12.5" fontWeight="650" fill="#275767">
        Paralelogramma-szabály
      </text>
      <line
        x1="330"
        y1="200"
        x2="440"
        y2="130"
        stroke="#e2590a"
        strokeWidth="3.2"
        strokeLinecap="round"
        markerEnd="url(#oa-1)"
      />
      <line
        x1="330"
        y1="200"
        x2="410"
        y2="220"
        stroke="#0f766e"
        strokeWidth="3.2"
        strokeLinecap="round"
        markerEnd="url(#oa-2)"
      />
      <line
        x1="440"
        y1="130"
        x2="520"
        y2="150"
        stroke="#94a3b8"
        strokeWidth="1.2"
        strokeDasharray="5 4"
      />
      <line
        x1="410"
        y1="220"
        x2="520"
        y2="150"
        stroke="#94a3b8"
        strokeWidth="1.2"
        strokeDasharray="5 4"
      />
      <line
        x1="330"
        y1="200"
        x2="520"
        y2="150"
        stroke="#7c3aed"
        strokeWidth="3.6"
        strokeLinecap="round"
        markerEnd="url(#oa-r)"
      />
      <text x="368" y="158" fontSize="13" fontWeight="650" fill="#e2590a">
        F₁
      </text>
      <text x="360" y="228" fontSize="13" fontWeight="650" fill="#0f766e">
        F₂
      </text>
      <text x="440" y="192" fontSize="14" fontWeight="700" fill="#7c3aed">
        R
      </text>
      <text x="320" y="243" fontSize="11.5" fill="#64748b">
        közös kezdőpontból, az átló az eredő
      </text>
    </svg>
  );
}

/* ---------------- Zárt vektorsokszög = egyensúly ---------------- */

export function AbraEgyensuly() {
  return (
    <svg viewBox="0 0 520 240" className="abra w-full">
      <defs>
        <Hegy id="eg-1" szin="#e2590a" />
        <Hegy id="eg-2" szin="#0f766e" />
        <Hegy id="eg-3" szin="#2563eb" />
      </defs>

      {/* bal: közös metszéspontú erők */}
      <text x="20" y="26" fontSize="12.5" fontWeight="650" fill="#275767">
        Három erő egy ponton
      </text>
      <circle cx="130" cy="135" r="4" fill="#1d3c48" />
      <line x1="130" y1="135" x2="60" y2="70" stroke="#e2590a" strokeWidth="3" strokeLinecap="round" markerEnd="url(#eg-1)" />
      <line x1="130" y1="135" x2="225" y2="105" stroke="#0f766e" strokeWidth="3" strokeLinecap="round" markerEnd="url(#eg-2)" />
      <line x1="130" y1="135" x2="150" y2="215" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" markerEnd="url(#eg-3)" />
      <text x="68" y="62" fontSize="13" fontWeight="650" fill="#e2590a">F₁</text>
      <text x="228" y="98" fontSize="13" fontWeight="650" fill="#0f766e">F₂</text>
      <text x="156" y="212" fontSize="13" fontWeight="650" fill="#2563eb">F₃</text>

      {/* jobb: zárt háromszög – a lánc pontosan visszaér a kiindulópontba */}
      <text x="300" y="26" fontSize="12.5" fontWeight="650" fill="#275767">
        A vektorháromszög bezárul
      </text>
      <line x1="325" y1="205" x2="258" y2="140" stroke="#e2590a" strokeWidth="3.2" strokeLinecap="round" markerEnd="url(#eg-1)" />
      <line x1="258" y1="140" x2="360" y2="112" stroke="#0f766e" strokeWidth="3.2" strokeLinecap="round" markerEnd="url(#eg-2)" />
      <line x1="360" y1="112" x2="325" y2="205" stroke="#2563eb" strokeWidth="3.2" strokeLinecap="round" markerEnd="url(#eg-3)" />
      <circle cx="325" cy="205" r="6" fill="none" stroke="#15803d" strokeWidth="2.2" />
      <text x="266" y="186" fontSize="13" fontWeight="650" fill="#e2590a">F₁</text>
      <text x="292" y="118" fontSize="13" fontWeight="650" fill="#0f766e">F₂</text>
      <text x="368" y="165" fontSize="13" fontWeight="650" fill="#2563eb">F₃</text>
      <line x1="325" y1="205" x2="392" y2="216" stroke="#15803d" strokeWidth="0.9" />
      <text x="396" y="213" fontSize="11.5" fill="#15803d" fontWeight="600">
        az utolsó vektor vége
      </text>
      <text x="396" y="228" fontSize="11.5" fill="#15803d" fontWeight="600">
        a kiindulópontba ér
      </text>
    </svg>
  );
}

/* ---------------- A szög felcserélődése ---------------- */

export function AbraSzogCsapda() {
  return (
    <svg viewBox="0 0 520 220" className="abra w-full">
      <defs>
        <Hegy id="sz-ero" szin="#e2590a" />
        <Hegy id="sz-t" szin="#475569" />
      </defs>

      {/* bal eset: szög az x tengelytől */}
      <line x1="40" y1="170" x2="200" y2="170" stroke="#475569" strokeWidth="1.3" markerEnd="url(#sz-t)" />
      <line x1="40" y1="170" x2="40" y2="40" stroke="#475569" strokeWidth="1.3" markerEnd="url(#sz-t)" />
      <line x1="40" y1="170" x2="155" y2="80" stroke="#e2590a" strokeWidth="3.2" strokeLinecap="round" markerEnd="url(#sz-ero)" />
      <path d="M 90 170 A 50 50 0 0 0 79 139" fill="none" stroke="#64748b" strokeWidth="1.2" />
      <text x="95" y="160" fontSize="12" fill="#64748b">α</text>
      <text x="205" y="175" fontSize="12" fontStyle="italic" fill="#1d3c48">x</text>
      <text x="30" y="35" fontSize="12" fontStyle="italic" fill="#1d3c48">y</text>
      <text x="20" y="200" fontSize="12.5" fill="#0f766e" fontWeight="600">
        Fx = F·cos α, Fy = F·sin α
      </text>

      {/* jobb eset: szög az y tengelytől */}
      <line x1="320" y1="170" x2="480" y2="170" stroke="#475569" strokeWidth="1.3" markerEnd="url(#sz-t)" />
      <line x1="320" y1="170" x2="320" y2="40" stroke="#475569" strokeWidth="1.3" markerEnd="url(#sz-t)" />
      <line x1="320" y1="170" x2="435" y2="80" stroke="#e2590a" strokeWidth="3.2" strokeLinecap="round" markerEnd="url(#sz-ero)" />
      <path d="M 320 120 A 50 50 0 0 0 355 135" fill="none" stroke="#64748b" strokeWidth="1.2" />
      <text x="333" y="122" fontSize="12" fill="#64748b">β</text>
      <text x="485" y="175" fontSize="12" fontStyle="italic" fill="#1d3c48">x</text>
      <text x="310" y="35" fontSize="12" fontStyle="italic" fill="#1d3c48">y</text>
      <text x="300" y="200" fontSize="12.5" fill="#be123c" fontWeight="600">
        Fx = F·sin β, Fy = F·cos β
      </text>
    </svg>
  );
}

/* ---------------- Térbeli vektor ---------------- */

export function AbraTerbeliVektor() {
  return (
    <svg viewBox="0 0 480 300" className="abra w-full">
      <defs>
        <Hegy id="tv-t" szin="#475569" />
        <Hegy id="tv-ero" szin="#e2590a" />
        <Hegy id="tv-k" szin="#0f766e" />
      </defs>

      {/* tengelyek */}
      <line x1="120" y1="220" x2="400" y2="220" stroke="#475569" strokeWidth="1.4" markerEnd="url(#tv-t)" />
      <line x1="120" y1="220" x2="120" y2="40" stroke="#475569" strokeWidth="1.4" markerEnd="url(#tv-t)" />
      <line x1="120" y1="220" x2="40" y2="280" stroke="#475569" strokeWidth="1.4" markerEnd="url(#tv-t)" />
      <text x="405" y="225" fontSize="13" fontStyle="italic" fill="#1d3c48">x</text>
      <text x="110" y="36" fontSize="13" fontStyle="italic" fill="#1d3c48">y</text>
      <text x="32" y="292" fontSize="13" fontStyle="italic" fill="#1d3c48">z</text>

      {/* téglatest élei */}
      <g stroke="#bcdce2" strokeWidth="1.3" fill="none" strokeDasharray="4 3">
        <path d="M 300 220 L 300 110 L 120 110" />
        <path d="M 300 220 L 250 257 M 120 110 L 70 147 L 250 147 L 300 110" />
        <path d="M 250 257 L 250 147" />
        <path d="M 120 220 L 70 257 L 250 257" />
        <path d="M 70 257 L 70 147" />
      </g>

      {/* komponensek */}
      <line x1="120" y1="220" x2="300" y2="220" stroke="#0f766e" strokeWidth="2.6" markerEnd="url(#tv-k)" />
      <line x1="120" y1="220" x2="120" y2="110" stroke="#0f766e" strokeWidth="2.6" markerEnd="url(#tv-k)" />
      <line x1="120" y1="220" x2="70" y2="257" stroke="#0f766e" strokeWidth="2.6" markerEnd="url(#tv-k)" />

      {/* eredő vektor */}
      <line x1="120" y1="220" x2="250" y2="147" stroke="#e2590a" strokeWidth="3.4" strokeLinecap="round" markerEnd="url(#tv-ero)" />

      <text x="205" y="240" fontSize="12.5" fontWeight="650" fill="#0f766e">Fx</text>
      <text x="96" y="165" fontSize="12.5" fontWeight="650" fill="#0f766e">Fy</text>
      <text x="88" y="274" fontSize="12.5" fontWeight="650" fill="#0f766e">Fz</text>
      <text x="196" y="172" fontSize="14" fontWeight="700" fill="#e2590a" fontStyle="italic">F</text>
    </svg>
  );
}

/* ---------------- Erőrendszerek fajtái (2×2 rács) ---------------- */

export function AbraErorendszerFajtai() {
  // Négy kis rajz ugyanarra a lemezre: a hatásvonalak elhelyezkedése különbözik.
  const NAR = "#e2590a";
  const TEAL = "#0f766e";
  const KEK = "#2563eb";
  const cellak = [
    { cim: "Közös hatásvonalú", x: 0, y: 0 },
    { cim: "Közös metszéspontú", x: 280, y: 0 },
    { cim: "Párhuzamos", x: 0, y: 200 },
    { cim: "Általános helyzetű (szétszórt)", x: 280, y: 200 },
  ];
  const Lemez = ({ x, y }) => (
    <rect x={x + 40} y={y + 60} width="200" height="100" rx="6" fill="#e8f1f3" stroke="#bcdce2" strokeWidth="1.2" />
  );
  const Ero = ({ x1, y1, x2, y2, szin, hegy, nev, dx = 0, dy = -6 }) => (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={szin} strokeWidth="2.8" strokeLinecap="round" markerEnd={`url(#${hegy})`} />
      <text x={x2 + dx} y={y2 + dy} fontSize="11.5" fontWeight="650" fill={szin} textAnchor="middle">
        {nev}
      </text>
    </g>
  );
  const Hv = ({ x1, y1, x2, y2 }) => <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#94a3b8" strokeWidth="0.9" strokeDasharray="4 3" />;

  return (
    <svg viewBox="0 0 560 400" className="abra w-full">
      <defs>
        <Hegy id="ef-1" szin={NAR} />
        <Hegy id="ef-2" szin={TEAL} />
        <Hegy id="ef-3" szin={KEK} />
      </defs>
      {cellak.map((c) => (
        <g key={c.cim}>
          <text x={c.x + 40} y={c.y + 30} fontSize="12.5" fontWeight="700" fill="#275767">
            {c.cim}
          </text>
          <Lemez x={c.x} y={c.y} />
        </g>
      ))}

      {/* 1. közös hatásvonalú: minden erő ugyanazon az egyenesen */}
      <Hv x1={20} y1={125} x2={270} y2={95} />
      <Ero x1={60} y1={120} x2={120} y2={113} szin={NAR} hegy="ef-1" nev="F₁" dy={-8} />
      <Ero x1={140} y1={111} x2={190} y2={105} szin={TEAL} hegy="ef-2" nev="F₂" dy={-8} />
      <Ero x1={255} y1={97} x2={215} y2={102} szin={KEK} hegy="ef-3" nev="F₃" dx={-4} dy={18} />

      {/* 2. közös metszéspontú: a hatásvonalak egy pontban metszik egymást */}
      {(() => {
        const M = { x: 420, y: 110 };
        const irany = [
          [-1, -0.45],
          [0.9, -0.7],
          [0.3, 1],
        ];
        const szinek = [NAR, TEAL, KEK];
        return (
          <g>
            {irany.map(([dx, dy], i) => {
              const h = Math.hypot(dx, dy);
              const ex = dx / h;
              const ey = dy / h;
              return (
                <g key={i}>
                  <Hv x1={M.x - ex * 90} y1={M.y - ey * 90} x2={M.x + ex * 90} y2={M.y + ey * 90} />
                  <Ero x1={M.x + ex * 20} y1={M.y + ey * 20} x2={M.x + ex * 70} y2={M.y + ey * 70} szin={szinek[i]} hegy={`ef-${i + 1}`} nev={`F${"₁₂₃"[i]}`} dx={ex * 14} dy={ey * 14 + 4} />
                </g>
              );
            })}
            <circle cx={M.x} cy={M.y} r="3.5" fill="#1d3c48" />
          </g>
        );
      })()}

      {/* 3. párhuzamos */}
      <Hv x1={90} y1={245} x2={90} y2={380} />
      <Hv x1={150} y1={245} x2={150} y2={380} />
      <Hv x1={215} y1={245} x2={215} y2={380} />
      <Ero x1={90} y1={250} x2={90} y2={300} szin={NAR} hegy="ef-1" nev="F₁" dx={12} dy={4} />
      <Ero x1={150} y1={250} x2={150} y2={310} szin={TEAL} hegy="ef-2" nev="F₂" dx={12} dy={4} />
      <Ero x1={215} y1={375} x2={215} y2={330} szin={KEK} hegy="ef-3" nev="F₃" dx={12} dy={4} />

      {/* 4. általános helyzetű: se nem metsződnek egy pontban, se nem párhuzamosak */}
      <Hv x1={300} y1={330} x2={420} y2={240} />
      <Hv x1={395} y1={250} x2={470} y2={380} />
      <Hv x1={330} y1={360} x2={540} y2={340} />
      <Ero x1={330} y1={307} x2={385} y2={266} szin={NAR} hegy="ef-1" nev="F₁" dx={10} dy={-4} />
      <Ero x1={404} y1={265.6} x2={430} y2={310.7} szin={TEAL} hegy="ef-2" nev="F₂" dx={14} dy={4} />
      <Ero x1={345} y1={358.6} x2={405} y2={352.9} szin={KEK} hegy="ef-3" nev="F₃" dx={-6} dy={18} />
    </svg>
  );
}
