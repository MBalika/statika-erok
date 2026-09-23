/** A kidolgozott feladatok ábrái, a gyakorlati feladatlap rajzai nyomán. */

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

const OX = 250;
const OY = 155;
const L = 15; // képpont / N

const fok = (g) => (g * Math.PI) / 180;
const px = (F, a) => OX + F * L * Math.cos(fok(a));
const py = (F, a) => OY - F * L * Math.sin(fok(a));

/* ---------------- GYF-2: négy erő és a t tengely ---------------- */

export function AbraGyf2() {
  const erok = [
    { nev: "F₁", F: 5, a: 40, szin: "#e2590a", hegy: "g2-a" },
    { nev: "F₂", F: 6, a: 0, szin: "#0f766e", hegy: "g2-b" },
    { nev: "F₃", F: 8, a: -65, szin: "#2563eb", hegy: "g2-c" },
    { nev: "F₄", F: 4, a: -90, szin: "#be123c", hegy: "g2-d" },
  ];
  const tHossz = 145;
  const tx = OX + tHossz * Math.cos(fok(125));
  const ty = OY - tHossz * Math.sin(fok(125));

  const eltolas = {
    "F₁": [16, -10],
    "F₂": [18, -12],
    "F₃": [16, 20],
    "F₄": [-32, 16],
  };

  return (
    <svg viewBox="0 0 520 340" className="abra w-full">
      <defs>
        {erok.map((e) => (
          <Hegy key={e.hegy} id={e.hegy} szin={e.szin} />
        ))}
        <Hegy id="g2-t" szin="#475569" />
        <Hegy id="g2-v" szin="#7c3aed" />
      </defs>

      {/* tengelyek */}
      <line x1={OX - 150} y1={OY} x2={OX + 170} y2={OY} stroke="#475569" strokeWidth="1.3" markerEnd="url(#g2-t)" />
      <line x1={OX} y1={OY + 130} x2={OX} y2={OY - 135} stroke="#475569" strokeWidth="1.3" markerEnd="url(#g2-t)" />
      <text x={OX + 176} y={OY + 5} fontSize="13" fontStyle="italic" fill="#1d3c48">x</text>
      <text x={OX + 6} y={OY - 140} fontSize="13" fontStyle="italic" fill="#1d3c48">y</text>

      {/* t tengely */}
      <line x1={OX} y1={OY} x2={tx} y2={ty} stroke="#7c3aed" strokeWidth="2.2" markerEnd="url(#g2-v)" />
      <text x={tx - 16} y={ty - 6} fontSize="13.5" fontWeight="650" fill="#7c3aed" fontStyle="italic">t</text>

      {/* szögjelölések */}
      <path d="M 295 155 A 45 45 0 0 0 284 127" fill="none" stroke="#64748b" strokeWidth="1.1" />
      <text x="298" y="143" fontSize="11.5" fill="#64748b">40°</text>

      {/* 55°: a negatív x tengelytől a t tengelyig (125°) – óramutató járásával ellentétesen a t felé */}
      <path d={`M ${OX - 40} ${OY} A 40 40 0 0 1 ${OX + 40 * Math.cos(fok(125))} ${OY - 40 * Math.sin(fok(125))}`} fill="none" stroke="#7c3aed" strokeWidth="1.1" />
      <text x={OX - 78} y={OY - 14} fontSize="11.5" fill="#7c3aed">55°</text>

      <path d={`M ${OX} ${OY + 52} A 52 52 0 0 0 ${OX + 22} ${OY + 47}`} fill="none" stroke="#64748b" strokeWidth="1.1" />
      <text x={OX + 13} y={OY + 72} fontSize="11.5" fill="#64748b" textAnchor="middle">
        25°
      </text>

      {/* erők */}
      {erok.map((e) => (
        <g key={e.nev}>
          <line
            x1={OX}
            y1={OY}
            x2={px(e.F, e.a)}
            y2={py(e.F, e.a)}
            stroke={e.szin}
            strokeWidth="3"
            strokeLinecap="round"
            markerEnd={`url(#${e.hegy})`}
          />
          <text
            x={px(e.F, e.a) + eltolas[e.nev][0]}
            y={py(e.F, e.a) + eltolas[e.nev][1]}
            fontSize="13"
            fontWeight="650"
            fill={e.szin}
          >
            {e.nev}
          </text>
        </g>
      ))}

      <text x="16" y="308" fontSize="11.5" fill="#64748b">
        F₁ = 5 N, F₂ = 6 N, F₃ = 8 N, F₄ = 4 N
      </text>
      <text x="16" y="325" fontSize="11.5" fill="#64748b">
        a t tengely az x tengellyel 55°-ot zár be, a második síknegyed felé
      </text>
    </svg>
  );
}

/* ---------------- GYF-3: zárt vektorháromszög ---------------- */

export function AbraGyf3() {
  const F = 150;
  const l = 0.62;
  const p = (a, hossz = F * l) => [
    OX + hossz * Math.cos(fok(a)),
    OY - hossz * Math.sin(fok(a)),
  ];
  const [x1, y1] = p(125);
  const [x2, y2] = p(-65);
  const [x3, y3] = p(30, 62);

  return (
    <svg viewBox="0 0 520 300" className="abra w-full">
      <defs>
        <Hegy id="g3-a" szin="#e2590a" />
        <Hegy id="g3-b" szin="#0f766e" />
        <Hegy id="g3-c" szin="#7c3aed" />
        <Hegy id="g3-t" szin="#475569" />
      </defs>

      <line x1={OX - 150} y1={OY} x2={OX + 160} y2={OY} stroke="#475569" strokeWidth="1.3" markerEnd="url(#g3-t)" />
      <line x1={OX} y1={OY + 120} x2={OX} y2={OY - 130} stroke="#475569" strokeWidth="1.3" markerEnd="url(#g3-t)" />
      <text x={OX + 166} y={OY + 5} fontSize="13" fontStyle="italic" fill="#1d3c48">x</text>
      <text x={OX + 6} y={OY - 135} fontSize="13" fontStyle="italic" fill="#1d3c48">y</text>

      <line x1={OX} y1={OY} x2={x1} y2={y1} stroke="#e2590a" strokeWidth="3.2" strokeLinecap="round" markerEnd="url(#g3-a)" />
      <line x1={OX} y1={OY} x2={x2} y2={y2} stroke="#0f766e" strokeWidth="3.2" strokeLinecap="round" markerEnd="url(#g3-b)" />
      <line x1={OX} y1={OY} x2={x3} y2={y3} stroke="#7c3aed" strokeWidth="3.2" strokeLinecap="round" strokeDasharray="7 4" markerEnd="url(#g3-c)" />

      <text x={x1 - 26} y={y1 - 8} fontSize="13" fontWeight="650" fill="#e2590a">F₁</text>
      <text x={x2 + 10} y={y2 + 16} fontSize="13" fontWeight="650" fill="#0f766e">F₂</text>
      <text x={x3 + 12} y={y3 - 6} fontSize="13" fontWeight="650" fill="#7c3aed">F₃ = ?</text>

      {/* 55°: a negatív x tengelytől az F₁-ig (125°) */}
      <path d={`M ${OX - 45} ${OY} A 45 45 0 0 1 ${OX + 45 * Math.cos(fok(125))} ${OY - 45 * Math.sin(fok(125))}`} fill="none" stroke="#64748b" strokeWidth="1.1" />
      <text x={OX - 84} y={OY - 16} fontSize="11.5" fill="#64748b">55°</text>

      <path d={`M ${OX} ${OY + 52} A 52 52 0 0 0 ${OX + 22} ${OY + 47}`} fill="none" stroke="#64748b" strokeWidth="1.1" />
      <text x={OX + 13} y={OY + 72} fontSize="11.5" fill="#64748b" textAnchor="middle">
        25°
      </text>

      <text x="16" y="285" fontSize="11.5" fill="#64748b">
        F₁ = F₂ = 150 N · a három vektor összege zérusvektor · F₃ nem méretarányos
      </text>
    </svg>
  );
}
