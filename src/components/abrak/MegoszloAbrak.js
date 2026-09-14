/** A 3. modul elméleti ábrái: megoszló terhek. */

function Hegy({ id, szin }) {
  return (
    <marker id={id} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 1 L 9 5 L 0 9 z" fill={szin} />
    </marker>
  );
}

/** Tartó + teher-nyilak egy adott felső él mentén. */
function Nyilsor({ x0, x1, tetoAt, tartoY, db = 10, szin = "#e2590a", hegy }) {
  return Array.from({ length: db + 1 }, (_, i) => {
    const t = i / db;
    const x = x0 + (x1 - x0) * t;
    const y = tetoAt(t);
    if (tartoY - y < 4) return null;
    return <line key={i} x1={x} y1={y} x2={x} y2={tartoY - 5} stroke={szin} strokeWidth="1.3" markerEnd={`url(#${hegy})`} />;
  });
}

/* ---------------- A megoszló teher fogalma ---------------- */

export function AbraMegoszloFogalom() {
  const T = 150;
  const p = (t) => 62 + 30 * Math.sin(t * Math.PI * 0.9 + 0.3) - 20 * t;
  const pontok = Array.from({ length: 41 }, (_, i) => {
    const t = i / 40;
    return `${110 + 360 * t} ${T - p(t)}`;
  });
  const tS = 0.6;
  const xS = 110 + 360 * tS;

  return (
    <svg viewBox="0 0 560 240" className="abra w-full">
      <defs>
        <Hegy id="mf-ero" szin="#e2590a" />
        <Hegy id="mf-t" szin="#475569" />
        <Hegy id="mf-dr" szin="#7c3aed" />
      </defs>

      <path d={`M 110 ${T} L ${pontok.join(" L ")} L 470 ${T} Z`} fill="#e2590a" opacity="0.12" />
      <path d={`M ${pontok.join(" L ")}`} fill="none" stroke="#e2590a" strokeWidth="2.2" />
      <Nyilsor x0={110} x1={470} tetoAt={(t) => T - p(t)} tartoY={T} db={14} hegy="mf-ero" />

      {/* egy elemi sáv */}
      <rect x={xS - 7} y={T - p(tS)} width="14" height={p(tS)} fill="#7c3aed" opacity="0.25" />
      <line x1={xS} y1={T - p(tS) - 36} x2={xS} y2={T - p(tS) - 4} stroke="#7c3aed" strokeWidth="2.6" markerEnd="url(#mf-dr)" />
      <text x={xS + 10} y={T - p(tS) - 24} fontSize="12.5" fontWeight="650" fill="#7c3aed">dR = p(x)·dx</text>
      <text x={xS} y={T + 20} textAnchor="middle" fontSize="11.5" fill="#7c3aed">dx</text>

      {/* intenzitás felirat balra fent */}
      <text x="112" y={T - p(0) - 12} fontSize="13" fontWeight="650" fill="#e2590a">p(x) [kN/m]</text>

      {/* tartó és tengelyek */}
      <line x1="96" y1={T} x2="484" y2={T} stroke="#1d3c48" strokeWidth="4" strokeLinecap="round" />
      <line x1="60" y1={T + 34} x2="100" y2={T + 34} stroke="#475569" strokeWidth="1.2" markerEnd="url(#mf-t)" />
      <line x1="60" y1={T + 34} x2="60" y2={T + 74} stroke="#475569" strokeWidth="1.2" markerEnd="url(#mf-t)" />
      <text x="104" y={T + 38} fontSize="12.5" fontStyle="italic" fill="#1d3c48">x</text>
      <text x="50" y={T + 84} fontSize="12.5" fontStyle="italic" fill="#1d3c48">z</text>
    </svg>
  );
}

/* ---------------- Alapesetek ---------------- */

export function AbraAlapesetek() {
  const T = 170;
  const panel = (ox, cim, alak, kepletek) => {
    const w = 140;
    let teto;
    let R;
    let xR;
    if (alak === "tegla") {
      teto = () => T - 70;
      R = "R = p · L";
      xR = 0.5;
    } else if (alak === "harom") {
      teto = (t) => T - 80 * (1 - t);
      R = "R = ½ · p · L";
      xR = 1 / 3;
    } else {
      teto = (t) => T - (40 + 45 * t);
      R = "R = ½ (p₁ + p₂) L";
      xR = (1 / 3) * ((40 + 2 * 85) / (40 + 85));
    }
    const ut =
      alak === "tegla"
        ? `M ${ox} ${T} L ${ox} ${T - 70} L ${ox + w} ${T - 70} L ${ox + w} ${T} Z`
        : alak === "harom"
          ? `M ${ox} ${T} L ${ox} ${T - 80} L ${ox + w} ${T} Z`
          : `M ${ox} ${T} L ${ox} ${T - 40} L ${ox + w} ${T - 85} L ${ox + w} ${T} Z`;

    return (
      <g>
        <text x={ox + w / 2} y="26" textAnchor="middle" fontSize="12.5" fontWeight="650" fill="#275767">{cim}</text>
        <path d={ut} fill="#e2590a" opacity="0.12" stroke="#e2590a" strokeWidth="1.8" />
        <Nyilsor x0={ox} x1={ox + w} tetoAt={teto} tartoY={T} db={7} hegy="ae-ero" />
        <line x1={ox - 8} y1={T} x2={ox + w + 8} y2={T} stroke="#1d3c48" strokeWidth="3.5" strokeLinecap="round" />
        {/* eredő */}
        <line x1={ox + w * xR} y1={44} x2={ox + w * xR} y2={78} stroke="#7c3aed" strokeWidth="3.2" strokeLinecap="round" markerEnd="url(#ae-r)" />
        <text x={ox + w * xR + 8} y="52" fontSize="12.5" fontWeight="700" fill="#7c3aed">R</text>
        {/* helyméret */}
        <line x1={ox} y1={T + 20} x2={ox + w * xR} y2={T + 20} stroke="#7c3aed" strokeWidth="1" markerEnd="url(#ae-m)" />
        {kepletek.map((k, i) => (
          <text key={i} x={ox + w / 2} y={T + 48 + i * 17} textAnchor="middle" fontSize="12" fill={i === 0 ? "#1d3c48" : "#7c3aed"} fontWeight={i === 0 ? 650 : 500}>
            {k}
          </text>
        ))}
        {alak === "harom" && (
          <text x={ox - 4} y={T - 86} fontSize="11.5" fill="#e2590a" textAnchor="end">p</text>
        )}
        {alak === "tegla" && (
          <text x={ox + w / 2} y={T - 78} fontSize="11.5" fill="#e2590a" textAnchor="middle">p</text>
        )}
        {alak === "trapez" && (
          <>
            <text x={ox - 4} y={T - 46} fontSize="11.5" fill="#e2590a" textAnchor="end">p₁</text>
            <text x={ox + w + 4} y={T - 90} fontSize="11.5" fill="#e2590a">p₂</text>
          </>
        )}
      </g>
    );
  };

  return (
    <svg viewBox="0 0 560 250" className="abra w-full">
      <defs>
        <Hegy id="ae-ero" szin="#e2590a" />
        <Hegy id="ae-r" szin="#7c3aed" />
        <Hegy id="ae-m" szin="#7c3aed" />
      </defs>
      {panel(30, "Egyenletes", "tegla", ["R = p · L", "k = L / 2"])}
      {panel(210, "Háromszög", "harom", ["R = ½ · p · L", "k = L / 3 a magas oldaltól"])}
      {panel(390, "Trapéz", "trapez", ["R = ½ (p₁ + p₂) L", "k: felbontásból"])}
    </svg>
  );
}

/* ---------------- Felbontás kétféleképpen ---------------- */

export function AbraFelbontas() {
  const T = 170;
  const w = 200;
  const pA = 40;
  const pB = 90;

  const panel = (ox, cim, reszek) => (
    <g>
      <text x={ox + w / 2} y="26" textAnchor="middle" fontSize="12.5" fontWeight="650" fill="#275767">{cim}</text>
      {reszek.map((r, i) => (
        <path key={i} d={r.ut} fill={r.szin} opacity="0.2" stroke={r.szin} strokeWidth="1.6" />
      ))}
      <path d={`M ${ox} ${T} L ${ox} ${T - pA} L ${ox + w} ${T - pB} L ${ox + w} ${T} Z`} fill="none" stroke="#e2590a" strokeWidth="2" />
      <line x1={ox - 8} y1={T} x2={ox + w + 8} y2={T} stroke="#1d3c48" strokeWidth="3.5" strokeLinecap="round" />
      {reszek.map((r, i) => (
        <g key={`r${i}`}>
          <line x1={ox + w * r.x} y1={46} x2={ox + w * r.x} y2={76} stroke={r.szin} strokeWidth="3" strokeLinecap="round" markerEnd={`url(#${r.hegy})`} />
          <text x={ox + w * r.x + 7} y="56" fontSize="12" fontWeight="700" fill={r.szin}>{r.nev}</text>
        </g>
      ))}
      {reszek.map((r, i) => (
        <text key={`t${i}`} x={ox + w / 2} y={T + 30 + i * 17} textAnchor="middle" fontSize="11.5" fill={r.szin}>{r.szoveg}</text>
      ))}
    </g>
  );

  const A = 40;
  const B = 300;
  return (
    <svg viewBox="0 0 560 250" className="abra w-full">
      <defs>
        <Hegy id="fb-a" szin="#0f766e" />
        <Hegy id="fb-b" szin="#2563eb" />
      </defs>
      {panel(A, "Téglalap + háromszög", [
        { ut: `M ${A} ${T} L ${A} ${T - pA} L ${A + w} ${T - pA} L ${A + w} ${T} Z`, szin: "#0f766e", hegy: "fb-a", x: 0.5, nev: "R₁", szoveg: "R₁ = p₁·L a felezőpontban" },
        { ut: `M ${A} ${T - pA} L ${A + w} ${T - pB} L ${A + w} ${T - pA} Z`, szin: "#2563eb", hegy: "fb-b", x: 2 / 3, nev: "R₂", szoveg: "R₂ = ½(p₂−p₁)·L a magas oldaltól L/3-ra" },
      ])}
      {panel(B, "Két háromszög", [
        { ut: `M ${B} ${T} L ${B} ${T - pA} L ${B + w} ${T} Z`, szin: "#0f766e", hegy: "fb-a", x: 1 / 3, nev: "R₁", szoveg: "R₁ = ½·p₁·L, balról L/3-ra" },
        { ut: `M ${B} ${T} L ${B + w} ${T - pB} L ${B + w} ${T} Z`, szin: "#2563eb", hegy: "fb-b", x: 2 / 3, nev: "R₂", szoveg: "R₂ = ½·p₂·L, balról 2L/3-ra" },
      ])}
    </svg>
  );
}

/* ---------------- Ferde vonal mentén megoszló erő ---------------- */

export function AbraFerdeVetulet() {
  const panel = (ox, cim, vetulet, sorok) => {
    const x0 = ox;
    const y0 = 180;
    const x1 = ox + 190;
    const y1 = 80;
    const db = 9;
    const hossz = Math.hypot(x1 - x0, y0 - y1);
    const nx = (y0 - y1) / hossz; // a rúdra merőleges egységvektor (felfelé)
    const ny = (x1 - x0) / hossz;
    const nyilak = Array.from({ length: db + 1 }, (_, i) => {
      const t = i / db;
      return { x: x0 + (x1 - x0) * t, y: y0 + (y1 - y0) * t };
    });
    return (
      <g>
        <text x={ox + 95} y="20" textAnchor="middle" fontSize="12.5" fontWeight="650" fill="#275767">{cim}</text>
        {vetulet ? (
          <>
            <line x1={x0} y1={40} x2={x1} y2={40} stroke="#e2590a" strokeWidth="2" />
            {nyilak.map((n, i) => (
              <line key={i} x1={n.x} y1={42} x2={n.x} y2={n.y - 5} stroke="#e2590a" strokeWidth="1.3" markerEnd="url(#fv-ero)" />
            ))}
            <line x1={x0} y1={204} x2={x1} y2={204} stroke="#94a3b8" strokeWidth="1" markerStart="url(#fv-m)" markerEnd="url(#fv-m)" />
          </>
        ) : (
          <>
            <line x1={x0 - nx * 44} y1={y0 - ny * 44} x2={x1 - nx * 44} y2={y1 - ny * 44} stroke="#e2590a" strokeWidth="2" />
            {nyilak.map((n, i) => (
              <line key={i} x1={n.x - nx * 42} y1={n.y - ny * 42} x2={n.x - nx * 6} y2={n.y - ny * 6} stroke="#e2590a" strokeWidth="1.3" markerEnd="url(#fv-ero)" />
            ))}
            <line x1={x0 + nx * 14} y1={y0 + ny * 14} x2={x1 + nx * 14} y2={y1 + ny * 14} stroke="#94a3b8" strokeWidth="1" markerStart="url(#fv-m)" markerEnd="url(#fv-m)" />
          </>
        )}
        <line x1={x0} y1={y0} x2={x1} y2={y1} stroke="#1d3c48" strokeWidth="4" strokeLinecap="round" />
        {sorok.map((s, i) => (
          <text key={i} x={ox + 95} y={226 + i * 17} textAnchor="middle" fontSize="11.5" fill={i === 0 ? "#e2590a" : i === 1 ? "#1d3c48" : "#94a3b8"} fontWeight={i === 1 ? 600 : 400}>
            {s}
          </text>
        ))}
      </g>
    );
  };

  return (
    <svg viewBox="0 0 620 280" className="abra w-full">
      <defs>
        <Hegy id="fv-ero" szin="#e2590a" />
        <Hegy id="fv-m" szin="#94a3b8" />
      </defs>
      {panel(60, "A rúd hossza mentén", false, ["p a ferde hossz méterére vonatkozik", "R = p · L_ferde", "pl. szélnyomás a felületre merőlegesen"])}
      {panel(370, "A vízszintes vetület mentén", true, ["p a vízszintes vetület méterére vonatkozik", "R = p · L_vízszintes", "pl. hóteher, alaprajzi négyzetméterre"])}
    </svg>
  );
}
