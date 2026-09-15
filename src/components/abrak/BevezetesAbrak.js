/* Statikus ábrák a Bevezetés-oldalhoz (szerver-oldalon is rendelhetők). */

/** Tömeg és súly: ugyanaz az 1 t tömeg a Földön és a Holdon. */
export function TomegSulyAbra() {
  const oszlop = (x, cim, g, G, szin) => (
    // g: felirat, G: a nyíl hossza kN-ban (a felirat is ebből)
    <g>
      <text x={x} y="26" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1d3c48">
        {cim}
      </text>
      <text x={x} y="44" textAnchor="middle" fontSize="11.5" fill="#64748b">
        g ≈ {g} m/s²
      </text>
      {/* talaj */}
      <line x1={x - 70} y1="150" x2={x + 70} y2="150" stroke="#475569" strokeWidth="2" />
      {[-60, -40, -20, 0, 20, 40].map((d) => (
        <line key={d} x1={x + d} y1="150" x2={x + d + 8} y2="160" stroke="#94a3b8" strokeWidth="1.2" />
      ))}
      {/* a tömeg: doboz */}
      <rect x={x - 32} y="86" width="64" height="64" rx="6" fill="#e2e8f0" stroke="#475569" strokeWidth="1.6" />
      <text x={x} y="124" textAnchor="middle" fontSize="15" fontWeight="700" fill="#1d3c48">
        m = 1 t
      </text>
      {/* súlyerő nyíl a talpon át */}
      <line x1={x + 48} y1="70" x2={x + 48} y2={70 + G * 8} stroke={szin} strokeWidth="3" strokeLinecap="round" markerEnd="url(#ts-hegy)" />
      <text x={x + 56} y={78 + G * 4} fontSize="12.5" fontWeight="600" fill={szin}>
        G = {g} kN
      </text>
    </g>
  );
  return (
    <svg viewBox="0 0 460 180" className="abra w-full max-w-[460px]" role="img" aria-label="Ugyanaz a tömeg a Földön és a Holdon: a súly különbözik">
      <defs>
        <marker id="ts-hegy" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 9 5 L 0 9 z" fill="#e2590a" />
        </marker>
      </defs>
      {oszlop(115, "Föld", "9,81", 9.81, "#e2590a")}
      {oszlop(345, "Hold", "1,62", 1.62, "#e2590a")}
      <text x="230" y="172" textAnchor="middle" fontSize="11.5" fill="#64748b">
        a tömeg ugyanannyi, a súly (erő) hatoda
      </text>
    </svg>
  );
}

/** Fok és radián: az 1 rad szög ívhossza a sugárral egyenlő. */
export function RadianAbra() {
  const cx = 90;
  const cy = 95;
  const r = 70;
  const a = 1; // 1 rad
  const px = cx + r * Math.cos(a);
  const py = cy - r * Math.sin(a);
  return (
    <svg viewBox="0 0 200 170" className="abra w-full max-w-[200px]" role="img" aria-label="1 radián: az ívhossz egyenlő a sugárral">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#cbd5e1" strokeWidth="1.2" />
      <line x1={cx} y1={cy} x2={cx + r} y2={cy} stroke="#475569" strokeWidth="1.6" />
      <line x1={cx} y1={cy} x2={px} y2={py} stroke="#475569" strokeWidth="1.6" />
      <path d={`M ${cx + r} ${cy} A ${r} ${r} 0 0 0 ${px} ${py}`} fill="none" stroke="#e2590a" strokeWidth="3.2" strokeLinecap="round" />
      <path d={`M ${cx + 22} ${cy} A 22 22 0 0 0 ${cx + 22 * Math.cos(a)} ${cy - 22 * Math.sin(a)}`} fill="none" stroke="#64748b" strokeWidth="1.1" />
      <text x={cx + 28} y={cy - 8} fontSize="11" fill="#64748b">
        1 rad
      </text>
      <text x={cx + r / 2 - 4} y={cy + 14} fontSize="11.5" fontStyle="italic" fill="#475569">
        r
      </text>
      <text x={cx + r * 0.78 + 8} y={cy - r * 0.55} fontSize="11.5" fontWeight="600" fill="#e2590a">
        ív = r
      </text>
      <text x={cx} y={cy + r + 22} textAnchor="middle" fontSize="11" fill="#64748b">
        1 rad ≈ 57,30°, 360° = 2π rad
      </text>
    </svg>
  );
}
