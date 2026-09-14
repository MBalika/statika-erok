/** A 2. modul elméleti magyarázó ábrái. */

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

/* ---------------- Erőkar és előjel ---------------- */

export function AbraErokar() {
  return (
    <svg viewBox="0 0 620 280" className="abra w-full">
      <defs>
        <Hegy id="ek-ero" szin="#e2590a" />
        <Hegy id="ek-forg" szin="#7c3aed" />
      </defs>

      {/* ---- bal: pozitív (balra forgat) ---- */}
      <text x="30" y="26" fontSize="12.5" fontWeight="650" fill="#275767">
        Balra forgat → pozitív
      </text>

      <line x1="140" y1="240" x2="300" y2="80" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="6 4" />
      <line x1="180" y1="200" x2="250" y2="130" stroke="#e2590a" strokeWidth="3.4" strokeLinecap="round" markerEnd="url(#ek-ero)" />
      <text x="252" y="126" fontSize="14" fontWeight="650" fill="#e2590a" fontStyle="italic">F</text>

      <line x1="110" y1="170" x2="160" y2="220" stroke="#7c3aed" strokeWidth="2" strokeDasharray="5 3" />
      <text x="112" y="212" fontSize="13" fontWeight="650" fill="#7c3aed">k</text>
      <path d="M 150 210 l 10 -10 l 10 10" fill="none" stroke="#94a3b8" strokeWidth="1.2" />

      <circle cx="110" cy="170" r="5" fill="#1d3c48" />
      <text x="92" y="192" fontSize="13" fill="#1d3c48" fontWeight="600">O</text>
      <path d="M 150 147 A 46 46 0 0 0 70 147" fill="none" stroke="#7c3aed" strokeWidth="2.4" markerEnd="url(#ek-forg)" />

      <text x="30" y="266" fontSize="12.5" fill="#1d3c48">M = + F · k</text>

      {/* ---- jobb: negatív (jobbra forgat) ---- */}
      <text x="350" y="26" fontSize="12.5" fontWeight="650" fill="#275767">
        Jobbra forgat → negatív
      </text>

      <line x1="420" y1="100" x2="580" y2="260" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="6 4" />
      <line x1="460" y1="140" x2="530" y2="210" stroke="#e2590a" strokeWidth="3.4" strokeLinecap="round" markerEnd="url(#ek-ero)" />
      <text x="534" y="224" fontSize="14" fontWeight="650" fill="#e2590a" fontStyle="italic">F</text>

      <line x1="390" y1="170" x2="440" y2="120" stroke="#7c3aed" strokeWidth="2" strokeDasharray="5 3" />
      <text x="392" y="136" fontSize="13" fontWeight="650" fill="#7c3aed">k</text>
      <path d="M 430 110 l 10 10 l -10 10" fill="none" stroke="#94a3b8" strokeWidth="1.2" />

      <circle cx="390" cy="170" r="5" fill="#1d3c48" />
      <text x="372" y="192" fontSize="13" fill="#1d3c48" fontWeight="600">O</text>
      <path d="M 430 193 A 46 46 0 0 1 350 193" fill="none" stroke="#7c3aed" strokeWidth="2.4" markerEnd="url(#ek-forg)" />

      <text x="350" y="266" fontSize="12.5" fill="#1d3c48">M = − F · k</text>

      <text x="30" y="246" fontSize="11.5" fill="#94a3b8">
        k az O pont merőleges távolsága a hatásvonaltól
      </text>
    </svg>
  );
}

/* ---------------- Erőpár ---------------- */

export function AbraEropar() {
  return (
    <svg viewBox="0 0 560 250" className="abra w-full">
      <defs>
        <Hegy id="ep-ero" szin="#e2590a" />
        <Hegy id="ep-forg" szin="#be123c" />
        <Hegy id="ep-meret" szin="#94a3b8" />
      </defs>

      <text x="20" y="24" fontSize="12.5" fontWeight="650" fill="#275767">
        Két egyenlő, ellentétes erő
      </text>

      <rect x="60" y="80" width="190" height="90" rx="6" fill="#dcedf0" stroke="#8ec3cd" strokeWidth="1.4" />
      <line x1="80" y1="95" x2="215" y2="95" stroke="#e2590a" strokeWidth="3.2" strokeLinecap="round" markerEnd="url(#ep-ero)" />
      <line x1="230" y1="155" x2="95" y2="155" stroke="#e2590a" strokeWidth="3.2" strokeLinecap="round" markerEnd="url(#ep-ero)" />
      <text x="150" y="86" fontSize="13" fontWeight="650" fill="#e2590a">F</text>
      <text x="150" y="176" fontSize="13" fontWeight="650" fill="#e2590a">F</text>

      <line x1="270" y1="95" x2="270" y2="155" stroke="#94a3b8" strokeWidth="1" markerStart="url(#ep-meret)" markerEnd="url(#ep-meret)" />
      <text x="278" y="129" fontSize="12.5" fontWeight="650" fill="#64748b">d</text>

      <text x="20" y="212" fontSize="12.5" fill="#1d3c48">
        M = F · d, és ez minden pontra ugyanennyi
      </text>
      <text x="20" y="232" fontSize="11.5" fill="#94a3b8">
        eredő erő nincs, mert a két erő kioltja egymást
      </text>

      {/* jobb oldal: az erőpár mint szabad vektor */}
      <text x="360" y="24" fontSize="12.5" fontWeight="650" fill="#275767">
        Helyettesítve
      </text>
      <path d="M 385 150 A 48 48 0 1 1 470 140" fill="none" stroke="#be123c" strokeWidth="3" markerEnd="url(#ep-forg)" />
      <text x="415" y="130" fontSize="15" fontWeight="700" fill="#be123c" fontStyle="italic">M</text>
      <text x="352" y="212" fontSize="12.5" fill="#1d3c48">
        szabadon eltolható a síkban
      </text>
    </svg>
  );
}

/* ---------------- Az eredő három esete ---------------- */

export function AbraHaromEset() {
  const panel = (eltolas, cim, felt, rajz, szin) => (
    <g transform={`translate(${eltolas} 0)`}>
      <rect x="0" y="34" width="170" height="150" rx="12" fill="#ffffff" stroke="#dce9ed" strokeWidth="1.4" />
      <text x="85" y="24" textAnchor="middle" fontSize="12.5" fontWeight="650" fill={szin}>
        {cim}
      </text>
      {rajz}
      <text x="85" y="204" textAnchor="middle" fontSize="11.5" fill="#64748b">
        {felt}
      </text>
    </g>
  );

  return (
    <svg viewBox="0 0 560 220" className="abra w-full">
      <defs>
        <Hegy id="he-ero" szin="#7c3aed" />
        <Hegy id="he-forg" szin="#be123c" />
      </defs>

      {panel(
        10,
        "Egyetlen erő",
        "R ≠ 0",
        <g>
          <line x1="35" y1="140" x2="135" y2="80" stroke="#7c3aed" strokeWidth="3.4" strokeLinecap="round" markerEnd="url(#he-ero)" />
          <line x1="20" y1="149" x2="150" y2="71" stroke="#94a3b8" strokeWidth="1" strokeDasharray="5 4" />
          <text x="70" y="128" fontSize="13" fontWeight="700" fill="#7c3aed">R</text>
        </g>,
        "#7c3aed",
      )}

      {panel(
        195,
        "Erőpár",
        "R = 0, M ≠ 0",
        <g>
          <path d="M 55 140 A 40 40 0 1 1 120 128" fill="none" stroke="#be123c" strokeWidth="3" markerEnd="url(#he-forg)" />
          <text x="78" y="120" fontSize="14" fontWeight="700" fill="#be123c">M</text>
        </g>,
        "#be123c",
      )}

      {panel(
        380,
        "Zérusrendszer",
        "R = 0, M = 0",
        <g>
          <circle cx="85" cy="110" r="26" fill="none" stroke="#15803d" strokeWidth="2.4" />
          <text x="85" y="118" textAnchor="middle" fontSize="22" fontWeight="700" fill="#15803d">
            0
          </text>
        </g>,
        "#15803d",
      )}
    </svg>
  );
}

/* ---------------- Térbeli nyomaték ---------------- */

export function AbraTerbeliNyomatekElv() {
  return (
    <svg viewBox="0 0 500 320" className="abra w-full">
      <defs>
        <Hegy id="tn-t" szin="#475569" />
        <Hegy id="tn-ero" szin="#e2590a" />
        <Hegy id="tn-r" szin="#0f766e" />
        <Hegy id="tn-m" szin="#7c3aed" />
      </defs>

      <line x1="140" y1="220" x2="420" y2="220" stroke="#475569" strokeWidth="1.4" markerEnd="url(#tn-t)" />
      <line x1="140" y1="220" x2="140" y2="40" stroke="#475569" strokeWidth="1.4" markerEnd="url(#tn-t)" />
      <line x1="140" y1="220" x2="55" y2="285" stroke="#475569" strokeWidth="1.4" markerEnd="url(#tn-t)" />
      <text x="426" y="225" fontSize="13" fontStyle="italic" fill="#1d3c48">x</text>
      <text x="130" y="36" fontSize="13" fontStyle="italic" fill="#1d3c48">y</text>
      <text x="46" y="298" fontSize="13" fontStyle="italic" fill="#1d3c48">z</text>

      {/* helyvektor */}
      <line x1="140" y1="220" x2="290" y2="140" stroke="#0f766e" strokeWidth="2.8" strokeLinecap="round" markerEnd="url(#tn-r)" />
      <text x="200" y="170" fontSize="14" fontWeight="650" fill="#0f766e" fontStyle="italic">r</text>
      <circle cx="290" cy="140" r="4.5" fill="#1d3c48" />
      <text x="296" y="134" fontSize="12" fill="#64748b">P</text>

      {/* erő */}
      <line x1="290" y1="140" x2="370" y2="82" stroke="#e2590a" strokeWidth="3.2" strokeLinecap="round" markerEnd="url(#tn-ero)" />
      <text x="345" y="118" fontSize="14" fontWeight="650" fill="#e2590a" fontStyle="italic">F</text>

      {/* nyomatékvektor */}
      <line x1="140" y1="220" x2="205" y2="288" stroke="#7c3aed" strokeWidth="3.2" strokeLinecap="round" markerEnd="url(#tn-m)" />
      <text x="200" y="268" fontSize="14" fontWeight="700" fill="#7c3aed" fontStyle="italic">M</text>

      <text x="20" y="26" fontSize="12.5" fill="#1d3c48">
        M = r × F — a nyomatékvektor merőleges az r és az F síkjára
      </text>
      <text x="20" y="46" fontSize="11.5" fill="#94a3b8">
        irányát a jobbkéz-szabály adja meg
      </text>
    </svg>
  );
}
