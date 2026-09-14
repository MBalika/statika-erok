/** A 3. modul kidolgozott feladatainak ábrái, a feladatlap rajzai nyomán. */

function Hegy({ id, szin }) {
  return (
    <marker id={id} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 1 L 9 5 L 0 9 z" fill={szin} />
    </marker>
  );
}

function Tengelyek({ x, y, id }) {
  return (
    <g>
      <line x1={x} y1={y} x2={x + 40} y2={y} stroke="#475569" strokeWidth="1.2" markerEnd={`url(#${id})`} />
      <line x1={x} y1={y} x2={x} y2={y + 40} stroke="#475569" strokeWidth="1.2" markerEnd={`url(#${id})`} />
      <text x={x + 44} y={y + 4} fontSize="12" fontStyle="italic" fill="#1d3c48">x</text>
      <text x={x - 10} y={y + 50} fontSize="12" fontStyle="italic" fill="#1d3c48">z</text>
    </g>
  );
}

function Meret({ x0, x1, y, szoveg, id }) {
  return (
    <g>
      <line x1={x0} y1={y} x2={x1} y2={y} stroke="#94a3b8" strokeWidth="1" markerStart={`url(#${id})`} markerEnd={`url(#${id})`} />
      <text x={(x0 + x1) / 2} y={y + 15} textAnchor="middle" fontSize="11.5" fill="#64748b">{szoveg}</text>
    </g>
  );
}

/* ---------------- GYF-1: trapéz teher ---------------- */

export function AbraTrapezTeher() {
  const T = 190;
  const x0 = 120;
  const x1 = 480;
  const h1 = 40; // 1,8 kN/m
  const h2 = 80; // 3,6 kN/m
  const db = 12;
  return (
    <svg viewBox="0 0 560 280" className="abra w-full">
      <defs>
        <Hegy id="tr-ero" szin="#e2590a" />
        <Hegy id="tr-t" szin="#475569" />
        <Hegy id="tr-m" szin="#94a3b8" />
      </defs>
      <path d={`M ${x0} ${T} L ${x0} ${T - h1} L ${x1} ${T - h2} L ${x1} ${T} Z`} fill="#e2590a" opacity="0.12" stroke="#e2590a" strokeWidth="2" />
      {Array.from({ length: db + 1 }, (_, i) => {
        const t = i / db;
        const x = x0 + (x1 - x0) * t;
        const y = T - (h1 + (h2 - h1) * t);
        return <line key={i} x1={x} y1={y} x2={x} y2={T - 5} stroke="#e2590a" strokeWidth="1.3" markerEnd="url(#tr-ero)" />;
      })}
      <line x1={x0 - 10} y1={T} x2={x1 + 10} y2={T} stroke="#1d3c48" strokeWidth="4" strokeLinecap="round" />
      <text x={x0 - 8} y={T - h1 - 8} fontSize="12.5" fontWeight="650" fill="#e2590a" textAnchor="end">1,8 kN/m</text>
      <text x={x1 + 8} y={T - h2 - 8} fontSize="12.5" fontWeight="650" fill="#e2590a">3,6 kN/m</text>
      <Meret x0={x0} x1={x1} y={T + 24} szoveg="4,5 m" id="tr-m" />
      <Tengelyek x={40} y={T + 20} id="tr-t" />
    </svg>
  );
}

/* ---------------- GYF-2: váltakozó irányú szakaszos teher ---------------- */

export function AbraValtakozoTeher() {
  const T = 160;
  const x0 = 110;
  const w = 120; // 1,2 m
  const h = 50; // 7 kN/m
  const szakasz = (k, fel) => {
    const xa = x0 + k * w;
    const xb = xa + w;
    const y = fel ? T + h : T - h;
    return (
      <g key={k}>
        <rect x={xa} y={fel ? T : T - h} width={w} height={h} fill="#e2590a" opacity="0.12" stroke="#e2590a" strokeWidth="1.8" />
        {[0.15, 0.5, 0.85].map((t) => (
          <line key={t} x1={xa + w * t} y1={y} x2={xa + w * t} y2={fel ? T + 5 : T - 5} stroke="#e2590a" strokeWidth="1.4" markerEnd="url(#va-ero)" />
        ))}
      </g>
    );
  };
  return (
    <svg viewBox="0 0 560 290" className="abra w-full">
      <defs>
        <Hegy id="va-ero" szin="#e2590a" />
        <Hegy id="va-t" szin="#475569" />
        <Hegy id="va-m" szin="#94a3b8" />
      </defs>
      {szakasz(0, false)}
      {szakasz(1, true)}
      {szakasz(2, false)}
      <line x1={x0 - 10} y1={T} x2={x0 + 3 * w + 10} y2={T} stroke="#1d3c48" strokeWidth="4" strokeLinecap="round" />
      <text x={x0 + 1.5 * w} y={T - h - 10} textAnchor="middle" fontSize="12.5" fontWeight="650" fill="#e2590a">7 kN/m</text>
      <text x={x0 + 1.5 * w} y={T + h + 22} textAnchor="middle" fontSize="11.5" fill="#e2590a">a középső szakaszon felfelé</text>
      <Meret x0={x0} x1={x0 + w} y={T + 92} szoveg="1,2 m" id="va-m" />
      <Meret x0={x0 + w} x1={x0 + 2 * w} y={T + 92} szoveg="1,2 m" id="va-m" />
      <Meret x0={x0 + 2 * w} x1={x0 + 3 * w} y={T + 92} szoveg="1,2 m" id="va-m" />
      <Tengelyek x={40} y={T + 60} id="va-t" />
    </svg>
  );
}

/* ---------------- GYF-3: fűrészfog teher ---------------- */

export function AbraFureszfogTeher() {
  const T = 180;
  const x0 = 110;
  const w = 190; // 6 m
  const h = 75; // 4 kN/m
  const harom = (k) => {
    const xa = x0 + k * w;
    const xb = xa + w;
    return (
      <g key={k}>
        <path d={`M ${xa} ${T} L ${xa} ${T - h} L ${xb} ${T} Z`} fill="#e2590a" opacity="0.12" stroke="#e2590a" strokeWidth="1.8" />
        {[0.08, 0.28, 0.48, 0.68, 0.85].map((t) => (
          <line key={t} x1={xa + w * t} y1={T - h * (1 - t)} x2={xa + w * t} y2={T - 5} stroke="#e2590a" strokeWidth="1.3" markerEnd="url(#ff-ero)" />
        ))}
      </g>
    );
  };
  return (
    <svg viewBox="0 0 560 270" className="abra w-full">
      <defs>
        <Hegy id="ff-ero" szin="#e2590a" />
        <Hegy id="ff-t" szin="#475569" />
        <Hegy id="ff-m" szin="#94a3b8" />
      </defs>
      {harom(0)}
      {harom(1)}
      <line x1={x0 - 10} y1={T} x2={x0 + 2 * w + 10} y2={T} stroke="#1d3c48" strokeWidth="4" strokeLinecap="round" />
      <text x={x0 - 6} y={T - h - 8} fontSize="12.5" fontWeight="650" fill="#e2590a" textAnchor="end">4 kN/m</text>
      <text x={x0 + w - 6} y={T - h - 8} fontSize="12.5" fontWeight="650" fill="#e2590a" textAnchor="end">4 kN/m</text>
      <Meret x0={x0} x1={x0 + w} y={T + 24} szoveg="6 m" id="ff-m" />
      <Meret x0={x0 + w} x1={x0 + 2 * w} y={T + 24} szoveg="6 m" id="ff-m" />
      <Tengelyek x={40} y={T + 20} id="ff-t" />
    </svg>
  );
}
