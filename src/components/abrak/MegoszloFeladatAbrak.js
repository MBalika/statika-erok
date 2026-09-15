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

/* ---------------- GYF-A: félkörív mentén megoszló, az ívre merőleges teher ---------------- */

export function AbraFelkorivTeher() {
  const cx = 280;
  const cy = 210;
  const r = 130; // 3 m
  const H = 34; // 4 kN/m
  const db = 16;
  return (
    <svg viewBox="0 0 560 280" className="abra w-full">
      <defs>
        <Hegy id="fk-ero" szin="#e2590a" />
        <Hegy id="fk-m" szin="#94a3b8" />
        <Hegy id="fk-t" szin="#475569" />
      </defs>
      {/* teherábra: a körív külső oldalán H vastag sáv */}
      <path
        d={`M ${cx - r - 8 - H} ${cy} A ${r + 8 + H} ${r + 8 + H} 0 0 1 ${cx} ${cy - r - 8 - H} A ${r + 8 + H} ${r + 8 + H} 0 0 1 ${cx + r + 8 + H} ${cy} L ${cx + r + 8} ${cy} A ${r + 8} ${r + 8} 0 0 0 ${cx} ${cy - r - 8} A ${r + 8} ${r + 8} 0 0 0 ${cx - r - 8} ${cy} Z`}
        fill="#e2590a"
        opacity="0.1"
        stroke="#e2590a"
        strokeWidth="1.6"
      />
      {Array.from({ length: db + 1 }, (_, i) => {
        const th = (Math.PI * i) / db;
        const c = Math.cos(th);
        const s = Math.sin(th);
        return <line key={i} x1={cx - (r + 8 + H) * c} y1={cy - (r + 8 + H) * s} x2={cx - (r + 12) * c} y2={cy - (r + 12) * s} stroke="#e2590a" strokeWidth="1.3" markerEnd="url(#fk-ero)" />;
      })}
      {/* a boltív: két koncentrikus ív */}
      <path d={`M ${cx - r - 8} ${cy} A ${r + 8} ${r + 8} 0 0 1 ${cx + r + 8} ${cy} L ${cx + r - 8} ${cy} A ${r - 8} ${r - 8} 0 0 0 ${cx - r + 8} ${cy} Z`} fill="#c7dde3" stroke="#1d3c48" strokeWidth="2" />
      {Array.from({ length: 11 }, (_, i) => {
        const th = (Math.PI * (i + 0.5)) / 12;
        const c = Math.cos(th);
        const s = Math.sin(th);
        return <line key={i} x1={cx - (r + 8) * c} y1={cy - (r + 8) * s} x2={cx - (r - 8) * c} y2={cy - (r - 8) * s} stroke="#1d3c48" strokeWidth="1" opacity="0.5" />;
      })}
      <text x={cx} y={cy - r - 8 - H - 10} textAnchor="middle" fontSize="12.5" fontWeight="650" fill="#e2590a">p = 4 kN/m (az ívre merőlegesen)</text>
      {/* sugár és méretek */}
      <line x1={cx} y1={cy} x2={cx + r * Math.cos(Math.PI / 4)} y2={cy - r * Math.sin(Math.PI / 4)} stroke="#64748b" strokeWidth="1" strokeDasharray="4 3" />
      <text x={cx + 44} y={cy - 40} fontSize="11.5" fill="#64748b">R = 3 m</text>
      <circle cx={cx} cy={cy} r="3" fill="#1d3c48" />
      <text x={cx + 6} y={cy - 6} fontSize="11.5" fill="#1d3c48">O</text>
      <line x1={cx - r} y1={cy + 24} x2={cx} y2={cy + 24} stroke="#94a3b8" strokeWidth="1" markerStart="url(#fk-m)" markerEnd="url(#fk-m)" />
      <line x1={cx} y1={cy + 24} x2={cx + r} y2={cy + 24} stroke="#94a3b8" strokeWidth="1" markerStart="url(#fk-m)" markerEnd="url(#fk-m)" />
      <text x={cx - r / 2} y={cy + 39} textAnchor="middle" fontSize="11.5" fill="#64748b">3 m</text>
      <text x={cx + r / 2} y={cy + 39} textAnchor="middle" fontSize="11.5" fill="#64748b">3 m</text>
      <line x1={cx - r - 8} y1={cy} x2={cx + r + 8} y2={cy} stroke="#475569" strokeWidth="1.4" />
    </svg>
  );
}

/* ---------------- GYF-B: ferde gátfal víznyomással ---------------- */

export function AbraFerdeGat() {
  const ox = 300; // a fal talppontja
  const oy = 230;
  const h = 150; // 6 m
  const a = h * Math.tan(Math.PI / 6); // 3,464 m
  const tx = ox - a; // a fal teteje (balra dől, a víz a fal fölött)
  const ty = oy - h;
  const nx = Math.cos(Math.PI / 6); // a falra merőleges, a víz felől (jobbra-fel)
  const ny = -Math.sin(Math.PI / 6);
  return (
    <svg viewBox="0 0 560 280" className="abra w-full">
      <defs>
        <Hegy id="fg-ero" szin="#e2590a" />
        <Hegy id="fg-m" szin="#94a3b8" />
      </defs>
      {/* víz: a fal fölött és tőle jobbra */}
      <path d={`M ${ox} ${oy} L ${tx} ${ty} L ${ox + 190} ${ty} L ${ox + 190} ${oy} Z`} fill="#7dd3fc" opacity="0.35" />
      <line x1={tx - 40} y1={ty} x2={ox + 190} y2={ty} stroke="#0284c7" strokeWidth="1.2" strokeDasharray="6 3" />
      <text x={ox + 186} y={ty - 8} fontSize="11.5" fill="#0284c7" textAnchor="end">vízszint · γ = 10 kN/m³</text>
      {/* a gát teste */}
      <path d={`M ${ox} ${oy} L ${tx} ${ty} L ${tx - 70} ${ty} L ${tx - 70} ${oy} Z`} fill="#cbd5e1" />
      {/* a dőlésszög a fal tetejénél, a függőlegeshez képest (a gát testében) */}
      <line x1={tx} y1={ty} x2={tx} y2={ty + 80} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 3" />
      <path d={`M ${tx} ${ty + 56} A 56 56 0 0 0 ${tx + 56 * Math.sin(Math.PI / 6)} ${ty + 56 * Math.cos(Math.PI / 6)}`} fill="none" stroke="#64748b" strokeWidth="1.2" />
      <text x={tx + 6} y={ty + 76} fontSize="11.5" fill="#64748b">30°</text>
      <line x1={ox} y1={oy} x2={tx} y2={ty} stroke="#1d3c48" strokeWidth="4" strokeLinecap="round" />
      {/* fenék */}
      <line x1={tx - 100} y1={oy} x2={ox + 190} y2={oy} stroke="#475569" strokeWidth="1.6" />
      {/* a felületre merőleges nyomás nyilai, a mélységgel nőnek */}
      {Array.from({ length: 7 }, (_, i) => {
        const s = (i + 1) / 7; // 0 fent … 1 lent
        const x = tx + (ox - tx) * s;
        const y = ty + (oy - ty) * s;
        const len = 4 + 40 * s;
        return <line key={i} x1={x + nx * len} y1={y + ny * len} x2={x + nx * 6} y2={y + ny * 6} stroke="#e2590a" strokeWidth="1.3" markerEnd="url(#fg-ero)" />;
      })}
      <text x={ox + 14} y={ty + 40} fontSize="12" fontWeight="650" fill="#e2590a">γ·z, a falra merőlegesen</text>
      {/* méretek */}
      <line x1={ox + 168} y1={oy} x2={ox + 168} y2={ty} stroke="#94a3b8" strokeWidth="1" markerStart="url(#fg-m)" markerEnd="url(#fg-m)" />
      <text x={ox + 174} y={oy - h / 2 + 4} fontSize="11.5" fill="#64748b">h = 6 m</text>
      <line x1={ox} y1={oy} x2={ox} y2={ty - 22} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 3" />
      <line x1={tx} y1={ty - 22} x2={ox} y2={ty - 22} stroke="#94a3b8" strokeWidth="1" markerStart="url(#fg-m)" markerEnd="url(#fg-m)" />
      <text x={(tx + ox) / 2} y={ty - 28} textAnchor="middle" fontSize="11" fill="#64748b">h·tg 30° = 3,464 m</text>
    </svg>
  );
}
