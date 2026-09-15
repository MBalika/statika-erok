/** A 2. modul kidolgozott feladatainak ábrái. */

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

/* ---------------- Négy párhuzamos erő ---------------- */

export function AbraParhuzamos() {
  const OX = 90;
  const OY = 150;
  const L = 52; // képpont / méter
  const helyek = [2, 3, 4, 5];

  return (
    <svg viewBox="0 0 500 240" className="abra w-full">
      <defs>
        <Hegy id="pa-ero" szin="#e2590a" />
        <Hegy id="pa-t" szin="#475569" />
        <Hegy id="pa-m" szin="#94a3b8" />
      </defs>

      <line x1={OX - 40} y1={OY} x2={OX + 330} y2={OY} stroke="#475569" strokeWidth="1.3" markerEnd="url(#pa-t)" />
      <line x1={OX} y1={OY + 40} x2={OX} y2={OY - 110} stroke="#475569" strokeWidth="1.3" markerEnd="url(#pa-t)" />
      <text x={OX + 336} y={OY + 5} fontSize="13" fontStyle="italic" fill="#1d3c48">x</text>
      <text x={OX - 12} y={OY - 114} fontSize="13" fontStyle="italic" fill="#1d3c48">y</text>

      {helyek.map((h, i) => (
        <g key={h}>
          <line
            x1={OX + h * L}
            y1={OY - 78}
            x2={OX + h * L}
            y2={OY - 6}
            stroke="#e2590a"
            strokeWidth="3"
            strokeLinecap="round"
            markerEnd="url(#pa-ero)"
          />
          <text
            x={OX + h * L}
            y={OY - 86}
            textAnchor="middle"
            fontSize="12"
            fill="#e2590a"
            fontWeight="600"
          >
            11 kN
          </text>
          <text
            x={OX + h * L}
            y={OY + 22}
            textAnchor="middle"
            fontSize="12.5"
            fontWeight="650"
            fill="#e2590a"
          >
            F{i + 1}
          </text>
          <line
            x1={OX}
            y1={OY + 34 + i * 15}
            x2={OX + h * L}
            y2={OY + 34 + i * 15}
            stroke="#94a3b8"
            strokeWidth="0.9"
            markerEnd="url(#pa-m)"
          />
          <text
            x={OX + h * L + 6}
            y={OY + 38 + i * 15}
            fontSize="11"
            fill="#64748b"
          >
            {h} m
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ---------------- Szétszórt síkbeli erőrendszer ---------------- */

export function AbraSzetszort() {
  const OX = 185;
  const OY = 200;
  const L = 18; // képpont / méter
  const E = 3.2; // képpont / kN

  const px = (x) => OX + x * L;
  const py = (y) => OY - y * L;

  return (
    <svg viewBox="0 0 520 340" className="abra w-full">
      <defs>
        <Hegy id="sz-a" szin="#e2590a" />
        <Hegy id="sz-b" szin="#0f766e" />
        <Hegy id="sz-c" szin="#2563eb" />
        <Hegy id="sz-d" szin="#be123c" />
        <Hegy id="sz-t" szin="#475569" />
      </defs>

      <line x1={OX - 110} y1={OY} x2={OX + 240} y2={OY} stroke="#475569" strokeWidth="1.3" markerEnd="url(#sz-t)" />
      <line x1={OX} y1={OY + 110} x2={OX} y2={OY - 160} stroke="#475569" strokeWidth="1.3" markerEnd="url(#sz-t)" />
      <text x={OX + 246} y={OY + 5} fontSize="13" fontStyle="italic" fill="#1d3c48">x</text>
      <text x={OX + 8} y={OY - 164} fontSize="13" fontStyle="italic" fill="#1d3c48">y</text>

      {/* F1 = 23 kN, +x irány, y = 7 m */}
      <line x1={px(0)} y1={py(7)} x2={px(0) + 23 * E} y2={py(7)} stroke="#e2590a" strokeWidth="3" strokeLinecap="round" markerEnd="url(#sz-a)" />
      <text x={px(0) + 23 * E + 12} y={py(7) - 8} fontSize="12.5" fontWeight="650" fill="#e2590a">F₁</text>
      <text x={px(0) + 14} y={py(7) + 18} fontSize="11.5" fill="#e2590a">23 kN</text>
      <text x={px(0) - 44} y={py(7) + 4} fontSize="11.5" fill="#64748b">7 m</text>

      {/* F2 = 9 kN, −y irány, x = 8 m */}
      <line x1={px(8)} y1={py(0)} x2={px(8)} y2={py(0) + 9 * E} stroke="#0f766e" strokeWidth="3" strokeLinecap="round" markerEnd="url(#sz-b)" />
      <text x={px(8) + 10} y={py(0) + 9 * E + 12} fontSize="12.5" fontWeight="650" fill="#0f766e">F₂</text>
      <text x={px(8) + 10} y={py(0) + 20} fontSize="11.5" fill="#0f766e">9 kN</text>
      <text x={px(8) - 16} y={py(0) - 8} fontSize="11.5" fill="#64748b">8 m</text>

      {/* F3 = 20 kN, +x irány, y = −4 m */}
      <line x1={px(0)} y1={py(-4)} x2={px(0) + 20 * E} y2={py(-4)} stroke="#2563eb" strokeWidth="3" strokeLinecap="round" markerEnd="url(#sz-c)" />
      <text x={px(0) + 20 * E + 12} y={py(-4) + 14} fontSize="12.5" fontWeight="650" fill="#2563eb">F₃</text>
      <text x={px(0) + 14} y={py(-4) - 8} fontSize="11.5" fill="#2563eb">20 kN</text>
      <text x={px(0) - 46} y={py(-4) + 4} fontSize="11.5" fill="#64748b">−4 m</text>

      {/* F4 = 19 kN, +y irány, x = −3 m */}
      <line x1={px(-3)} y1={py(0)} x2={px(-3)} y2={py(0) - 19 * E} stroke="#be123c" strokeWidth="3" strokeLinecap="round" markerEnd="url(#sz-d)" />
      <text x={px(-3) - 26} y={py(0) - 19 * E - 6} fontSize="12.5" fontWeight="650" fill="#be123c">F₄</text>
      <text x={px(-3) - 52} y={py(0) - 26} fontSize="11.5" fill="#be123c">19 kN</text>
      <text x={px(-3) - 30} y={py(0) + 18} fontSize="11.5" fill="#64748b">−3 m</text>
    </svg>
  );
}

/* ---------------- A háromszög: három erő és egy nyomaték ---------------- */

export function AbraHaromszog() {
  const OX = 210;
  const OY = 205;
  const L = 21;
  const px = (x) => OX + x * L;
  const py = (y) => OY - y * L;

  // a háromszög csúcsai
  const A = { x: -3, y: 8 };
  const B = { x: 2, y: 0 };
  const C = { x: -3, y: -4 };

  // az erőnyilak a szakaszok belsejében, hogy a csúcsok szabadon maradjanak
  const kozott = (P, Q, t1, t2) => ({
    x1: px(P.x + (Q.x - P.x) * t1),
    y1: py(P.y + (Q.y - P.y) * t1),
    x2: px(P.x + (Q.x - P.x) * t2),
    y2: py(P.y + (Q.y - P.y) * t2),
  });

  const f2 = kozott(A, B, 0.15, 0.8);
  const f1 = kozott(B, C, 0.15, 0.8);
  const f3 = kozott(C, A, 0.15, 0.8);

  return (
    <svg viewBox="0 0 520 330" className="abra w-full">
      <defs>
        <Hegy id="ht-a" szin="#e2590a" />
        <Hegy id="ht-b" szin="#0f766e" />
        <Hegy id="ht-c" szin="#2563eb" />
        <Hegy id="ht-m" szin="#be123c" />
        <Hegy id="ht-t" szin="#475569" />
      </defs>

      <line x1={OX - 110} y1={OY} x2={OX + 190} y2={OY} stroke="#475569" strokeWidth="1.3" markerEnd="url(#ht-t)" />
      <line x1={OX} y1={OY + 110} x2={OX} y2={OY - 190} stroke="#475569" strokeWidth="1.3" markerEnd="url(#ht-t)" />
      <text x={OX + 196} y={OY + 5} fontSize="13" fontStyle="italic" fill="#1d3c48">x</text>
      <text x={OX + 8} y={OY - 194} fontSize="13" fontStyle="italic" fill="#1d3c48">y</text>

      {/* a szerkesztő háromszög */}
      <path
        d={`M ${px(A.x)} ${py(A.y)} L ${px(B.x)} ${py(B.y)} L ${px(C.x)} ${py(C.y)} Z`}
        fill="none"
        stroke="#bcdce2"
        strokeWidth="1.2"
        strokeDasharray="5 4"
      />

      {/* F2: A → B */}
      <line x1={f2.x1} y1={f2.y1} x2={f2.x2} y2={f2.y2} stroke="#0f766e" strokeWidth="3.2" strokeLinecap="round" markerEnd="url(#ht-b)" />
      <text x={f2.x2 + 12} y={f2.y2 - 6} fontSize="13" fontWeight="650" fill="#0f766e">F₂</text>

      {/* F1: B → C */}
      <line x1={f1.x1} y1={f1.y1} x2={f1.x2} y2={f1.y2} stroke="#e2590a" strokeWidth="3.2" strokeLinecap="round" markerEnd="url(#ht-a)" />
      <text x={f1.x2 + 16} y={f1.y2 + 16} fontSize="13" fontWeight="650" fill="#e2590a">F₁</text>

      {/* F3: C → A, függőleges */}
      <line x1={f3.x1} y1={f3.y1} x2={f3.x2} y2={f3.y2} stroke="#2563eb" strokeWidth="3.2" strokeLinecap="round" markerEnd="url(#ht-c)" />
      <text x={f3.x1 - 30} y={(f3.y1 + f3.y2) / 2} fontSize="13" fontWeight="650" fill="#2563eb">F₃</text>

      {/* M forgatónyomaték */}
      <path d="M 388 63 A 34 34 0 1 0 328 63" fill="none" stroke="#be123c" strokeWidth="2.8" markerEnd="url(#ht-m)" />
      <text x="348" y="84" fontSize="15" fontWeight="700" fill="#be123c" fontStyle="italic">M</text>

      {/* méretek */}
      <text x={px(A.x) - 40} y={py(A.y) + 5} fontSize="11.5" fill="#64748b">8 m</text>
      <text x={px(C.x) - 44} y={py(C.y) + 5} fontSize="11.5" fill="#64748b">−4 m</text>
      <text x={px(B.x) + 6} y={py(B.y) - 8} fontSize="11.5" fill="#64748b">2 m</text>
      <text x={px(A.x) - 26} y={OY + 20} fontSize="11.5" fill="#64748b" textAnchor="middle">−3 m</text>

      <text x="16" y="316" fontSize="11.5" fill="#94a3b8">
        a három hatásvonal a szaggatott háromszög három oldala
      </text>
    </svg>
  );
}

/* ---------------- Térbeli erőrendszer a hasáb élein ---------------- */

export function AbraTerbeliErorendszer() {
  const ox = 205;
  const oy = 235;
  const sx = 42; // képpont / méter, x irány
  const sy = 46; // képpont / méter, y irány
  const zx = -16.5; // a z tengely vetülete
  const zy = 13.5;

  const p = (x, y, z) => [ox + x * sx + z * zx, oy - y * sy + z * zy];
  const A = 3.5;
  const B = 3;
  const C = 4;

  const [o] = [p(0, 0, 0)];
  const P = {
    x00: p(A, 0, 0),
    y00: p(0, B, 0),
    z00: p(0, 0, C),
    xy0: p(A, B, 0),
    x0z: p(A, 0, C),
    yz: p(0, B, C),
    xyz: p(A, B, C),
  };

  // nyíl a P1 és P2 pont között, a szakasz belsejében
  const nyil = (P1, P2, t1, t2) => ({
    x1: P1[0] + (P2[0] - P1[0]) * t1,
    y1: P1[1] + (P2[1] - P1[1]) * t1,
    x2: P1[0] + (P2[0] - P1[0]) * t2,
    y2: P1[1] + (P2[1] - P1[1]) * t2,
  });

  const erok = [
    { nev: "F₁ = 7 N", n: nyil(P.y00, P.xy0, 0.2, 0.85), szin: "#e2590a", h: "te-a", dx: 10, dy: -12 },
    { nev: "F₂ = 6 N", n: nyil(P.xy0, P.x00, 0.15, 0.85), szin: "#0f766e", h: "te-b", dx: 14, dy: 4 },
    { nev: "F₃ = 8 N", n: nyil(P.x00, P.x0z, 0.15, 0.85), szin: "#2563eb", h: "te-c", dx: 12, dy: 16 },
    { nev: "F₄ = 7 N", n: nyil(P.x0z, P.z00, 0.15, 0.85), szin: "#be123c", h: "te-d", dx: -20, dy: 22 },
    { nev: "F₅ = 6 N", n: nyil(P.z00, P.yz, 0.15, 0.85), szin: "#7c3aed", h: "te-e", dx: -62, dy: 4 },
    { nev: "F₆ = 8 N", n: nyil(P.yz, P.y00, 0.15, 0.85), szin: "#b45309", h: "te-f", dx: -66, dy: -8 },
  ];

  return (
    <svg viewBox="0 0 520 360" className="abra w-full">
      <defs>
        <Hegy id="te-t" szin="#475569" />
        {erok.map((e) => (
          <Hegy key={e.h} id={e.h} szin={e.szin} />
        ))}
      </defs>

      {/* tengelyek */}
      <line x1={o[0]} y1={o[1]} x2={o[0] + 250} y2={o[1]} stroke="#475569" strokeWidth="1.3" markerEnd="url(#te-t)" />
      <line x1={o[0]} y1={o[1]} x2={o[0]} y2={o[1] - 190} stroke="#475569" strokeWidth="1.3" markerEnd="url(#te-t)" />
      <line x1={o[0]} y1={o[1]} x2={o[0] + zx * 5.6} y2={o[1] + zy * 5.6} stroke="#475569" strokeWidth="1.3" markerEnd="url(#te-t)" />
      <text x={o[0] + 256} y={o[1] + 5} fontSize="13" fontStyle="italic" fill="#1d3c48">x</text>
      <text x={o[0] - 14} y={o[1] - 194} fontSize="13" fontStyle="italic" fill="#1d3c48">y</text>
      <text x={o[0] + zx * 5.6 - 16} y={o[1] + zy * 5.6 + 14} fontSize="13" fontStyle="italic" fill="#1d3c48">z</text>

      {/* a hasáb élei */}
      <g stroke="#bcdce2" strokeWidth="1.2" fill="none" strokeDasharray="4 3">
        <path d={`M ${P.y00} L ${P.xy0} L ${P.x00}`} />
        <path d={`M ${P.y00} L ${P.yz} L ${P.xyz} L ${P.xy0}`} />
        <path d={`M ${P.yz} L ${P.z00} L ${P.x0z} L ${P.xyz}`} />
        <path d={`M ${P.x00} L ${P.x0z}`} />
        <path d={`M ${o} L ${P.z00}`} />
        <path d={`M ${o} L ${P.x00}`} />
        <path d={`M ${o} L ${P.y00}`} />
      </g>

      {/* erők */}
      {erok.map((e) => (
        <g key={e.nev}>
          <line
            x1={e.n.x1}
            y1={e.n.y1}
            x2={e.n.x2}
            y2={e.n.y2}
            stroke={e.szin}
            strokeWidth="3"
            strokeLinecap="round"
            markerEnd={`url(#${e.h})`}
          />
          <text
            x={(e.n.x1 + e.n.x2) / 2 + e.dx}
            y={(e.n.y1 + e.n.y2) / 2 + e.dy}
            fontSize="12.5"
            fontWeight="650"
            fill={e.szin}
          >
            {e.nev}
          </text>
        </g>
      ))}

      <text x="16" y="338" fontSize="11.5" fill="#64748b">
        a hasáb élhosszai: x irányban 3,5 m · y irányban 3 m · z irányban 4 m
      </text>
    </svg>
  );
}

/* ---------------- GYF‑A: a tankönyv 3.7. ábrája ---------------- */

export function AbraNegyfele() {
  const OX = 70;
  const OY = 236;
  const L = 46; // képpont / méter
  const px = (x) => OX + x * L;
  const py = (y) => OY - y * L;
  const P = { x: 2, y: 3 };
  const talp = { x: 1.6, y: 3.2 }; // az origó merőleges vetülete a hatásvonalra
  const k = 0.32; // az erőnyíl léptéke (m / kN)

  return (
    <svg viewBox="0 0 520 300" className="abra w-full">
      <defs>
        <Hegy id="nf-ero" szin="#e2590a" />
        <Hegy id="nf-r" szin="#0f766e" />
        <Hegy id="nf-t" szin="#475569" />
      </defs>

      <line x1={OX - 30} y1={OY} x2={OX + 420} y2={OY} stroke="#475569" strokeWidth="1.3" markerEnd="url(#nf-t)" />
      <line x1={OX} y1={OY + 30} x2={OX} y2={OY - 220} stroke="#475569" strokeWidth="1.3" markerEnd="url(#nf-t)" />
      <text x={OX + 426} y={OY + 5} fontSize="13" fontStyle="italic" fill="#1d3c48">x</text>
      <text x={OX + 8} y={OY - 222} fontSize="13" fontStyle="italic" fill="#1d3c48">y</text>
      <text x={OX - 14} y={OY + 16} fontSize="12" fontWeight="600" fill="#475569">O</text>

      {/* hatásvonal a két tengelymetszet között */}
      <line x1={px(0)} y1={py(4)} x2={px(8)} y2={py(0)} stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="6 4" />
      <circle cx={px(8)} cy={py(0)} r="3.5" fill="#94a3b8" />
      <circle cx={px(0)} cy={py(4)} r="3.5" fill="#94a3b8" />
      <text x={px(8)} y={OY + 18} textAnchor="middle" fontSize="11.5" fill="#64748b">8 m</text>
      <text x={OX - 10} y={py(4) + 4} textAnchor="end" fontSize="11.5" fill="#64748b">4 m</text>

      {/* méretvonalak a P ponthoz */}
      <line x1={px(P.x)} y1={py(P.y)} x2={px(P.x)} y2={OY} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
      <line x1={px(P.x)} y1={py(P.y)} x2={OX} y2={py(P.y)} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
      <text x={px(P.x)} y={OY + 18} textAnchor="middle" fontSize="11.5" fill="#64748b">2 m</text>
      <text x={OX - 10} y={py(P.y) + 4} textAnchor="end" fontSize="11.5" fill="#64748b">3 m</text>

      {/* helyvektor */}
      <line x1={OX} y1={OY} x2={px(P.x)} y2={py(P.y)} stroke="#0f766e" strokeWidth="2.8" strokeLinecap="round" markerEnd="url(#nf-r)" />
      <text x={px(P.x) - 18} y={py(P.y) + 30} fontSize="13" fontWeight="650" fill="#0f766e" fontStyle="italic">r</text>

      {/* az erő karja */}
      <line x1={OX} y1={OY} x2={px(talp.x)} y2={py(talp.y)} stroke="#7c3aed" strokeWidth="2" strokeDasharray="5 3" />
      <text x={px(talp.x / 2) - 16} y={py(talp.y / 2) - 4} fontSize="13" fontWeight="650" fill="#7c3aed" fontStyle="italic">d</text>
      <path d={`M ${px(talp.x) - 6} ${py(talp.y) + 4} l 4 8 l 8 -4`} fill="none" stroke="#94a3b8" strokeWidth="1.1" />

      {/* az erő */}
      <line x1={px(P.x)} y1={py(P.y)} x2={px(P.x + 6 * k)} y2={py(P.y - 3 * k)} stroke="#e2590a" strokeWidth="3.4" strokeLinecap="round" markerEnd="url(#nf-ero)" />
      <circle cx={px(P.x)} cy={py(P.y)} r="4" fill="#1d3c48" />
      <text x={px(P.x + 6 * k) + 4} y={py(P.y - 3 * k) - 8} fontSize="14" fontWeight="650" fill="#e2590a" fontStyle="italic">F</text>
      <text x={px(P.x + 6 * k) + 4} y={py(P.y - 3 * k) + 10} fontSize="11.5" fill="#e2590a">(6; −3) kN</text>
      <text x={px(P.x) + 8} y={py(P.y) - 8} fontSize="11.5" fill="#475569">P (2; 3)</text>

      <text x="16" y="292" fontSize="11.5" fill="#94a3b8">
        a hatásvonal az x tengelyt 8 m-nél, az y tengelyt 4 m-nél metszi
      </text>
    </svg>
  );
}

/* ---------------- GYF‑B: a tankönyv 3.10. ábrája (dinámrendszer) ---------------- */

export function AbraDinam({ kiemelt = null }) {
  const OX = 70;
  const OY = 150;
  const L = 46; // képpont / méter
  const E = 9; // képpont / kN
  const px = (x) => OX + x * L;
  const halvany = (nev) => (kiemelt && !kiemelt.includes(nev) ? 0.22 : 1);

  const pont = (x, nev) => (
    <g key={nev}>
      <line x1={px(x) - 5} y1={OY - 5} x2={px(x) + 5} y2={OY + 5} stroke="#1d3c48" strokeWidth="1.4" />
      <line x1={px(x) - 5} y1={OY + 5} x2={px(x) + 5} y2={OY - 5} stroke="#1d3c48" strokeWidth="1.4" />
      <text x={px(x) - 9} y={OY - 10} textAnchor="end" fontSize="12.5" fontWeight="650" fill="#1d3c48">{nev}</text>
    </g>
  );

  return (
    <svg viewBox="0 0 520 250" className="abra w-full">
      <defs>
        <Hegy id="dn-ero" szin="#e2590a" />
        <Hegy id="dn-m" szin="#be123c" />
        <Hegy id="dn-mer" szin="#94a3b8" />
      </defs>

      {/* a közös egyenes */}
      <line x1={px(0) - 30} y1={OY} x2={px(8) + 30} y2={OY} stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="6 4" />
      {pont(0, "A")}
      {pont(3, "B")}
      {pont(8, "C")}

      {/* F1 = 2 kN lefelé A-ban */}
      <g opacity={halvany("F1")}>
        <line x1={px(0)} y1={OY + 6} x2={px(0)} y2={OY + 6 + 2 * E} stroke="#e2590a" strokeWidth="3" strokeLinecap="round" markerEnd="url(#dn-ero)" />
        <text x={px(0) + 8} y={OY + 6 + 2 * E + 4} fontSize="12" fontWeight="650" fill="#e2590a">F₁ = 2 kN</text>
      </g>
      {/* F2 = 5 kN felfelé B-ben */}
      <g opacity={halvany("F2")}>
        <line x1={px(3)} y1={OY - 6} x2={px(3)} y2={OY - 6 - 5 * E} stroke="#e2590a" strokeWidth="3" strokeLinecap="round" markerEnd="url(#dn-ero)" />
        <text x={px(3) + 8} y={OY - 6 - 5 * E + 4} fontSize="12" fontWeight="650" fill="#e2590a">F₂ = 5 kN</text>
      </g>
      {/* F3 = 3 kN lefelé C-ben */}
      <g opacity={halvany("F3")}>
        <line x1={px(8)} y1={OY + 6} x2={px(8)} y2={OY + 6 + 3 * E} stroke="#e2590a" strokeWidth="3" strokeLinecap="round" markerEnd="url(#dn-ero)" />
        <text x={px(8) + 8} y={OY + 6 + 3 * E + 4} fontSize="12" fontWeight="650" fill="#e2590a">F₃ = 3 kN</text>
      </g>

      {/* M1 = 3 kNm ↷ (A és B között) */}
      <g opacity={halvany("M1")}>
        <path d={`M ${px(1.5) - 20} ${OY - 40} A 20 20 0 1 1 ${px(1.5) + 20} ${OY - 40}`} fill="none" stroke="#be123c" strokeWidth="2.6" markerEnd="url(#dn-m)" />
        <text x={px(1.5)} y={OY - 72} textAnchor="middle" fontSize="12" fontWeight="650" fill="#be123c">M₁ = 3 kNm</text>
      </g>
      {/* M2 = 12 kNm ↶ (B és C között) */}
      <g opacity={halvany("M2")}>
        <path d={`M ${px(5.5) + 20} ${OY - 40} A 20 20 0 1 0 ${px(5.5) - 20} ${OY - 40}`} fill="none" stroke="#be123c" strokeWidth="2.6" markerEnd="url(#dn-m)" />
        <text x={px(5.5)} y={OY - 72} textAnchor="middle" fontSize="12" fontWeight="650" fill="#be123c">M₂ = 12 kNm</text>
      </g>

      {/* méretek */}
      <line x1={px(0)} y1={OY + 56} x2={px(3)} y2={OY + 56} stroke="#94a3b8" strokeWidth="1" markerStart="url(#dn-mer)" markerEnd="url(#dn-mer)" />
      <line x1={px(3)} y1={OY + 56} x2={px(8)} y2={OY + 56} stroke="#94a3b8" strokeWidth="1" markerStart="url(#dn-mer)" markerEnd="url(#dn-mer)" />
      <text x={px(1.5)} y={OY + 71} textAnchor="middle" fontSize="11.5" fill="#64748b">3 m</text>
      <text x={px(5.5)} y={OY + 71} textAnchor="middle" fontSize="11.5" fill="#64748b">5 m</text>
      <text x="16" y="244" fontSize="11.5" fill="#94a3b8">
        M₁ az óramutató járásával egyezően, M₂ azzal ellentétesen forgat
      </text>
    </svg>
  );
}
