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

/* ---------------- Megoszló erők fajtái: térfogat, felület, vonal ---------------- */

export function AbraMegoszloFajtak() {
  const panel = (ox, cim, alcim, tartalom) => (
    <g>
      <text x={ox + 90} y="22" textAnchor="middle" fontSize="12.5" fontWeight="650" fill="#275767">{cim}</text>
      {tartalom}
      <text x={ox + 90} y="212" textAnchor="middle" fontSize="12" fontWeight="650" fill="#e2590a">{alcim[0]}</text>
      <text x={ox + 90} y="229" textAnchor="middle" fontSize="11.5" fill="#475569">{alcim[1]}</text>
    </g>
  );

  // térfogat: tömb, benne rácsban kis nyilak
  const terfogat = (() => {
    const x = 40;
    const y = 60;
    const w = 100;
    const h = 90;
    const d = 26; // mélység (ferde)
    const nyilak = [];
    for (let i = 0; i < 4; i++)
      for (let j = 0; j < 3; j++) nyilak.push({ x: x + 14 + i * 24, y: y + 16 + j * 26 });
    return (
      <g>
        <path d={`M ${x} ${y} L ${x + d} ${y - d * 0.6} L ${x + w + d} ${y - d * 0.6} L ${x + w} ${y} Z`} fill="#c7dde3" stroke="#475569" strokeWidth="1.2" />
        <path d={`M ${x + w} ${y} L ${x + w + d} ${y - d * 0.6} L ${x + w + d} ${y + h - d * 0.6} L ${x + w} ${y + h} Z`} fill="#a9c9d2" stroke="#475569" strokeWidth="1.2" />
        <rect x={x} y={y} width={w} height={h} fill="#dbeaee" stroke="#475569" strokeWidth="1.2" />
        {nyilak.map((n, i) => (
          <line key={i} x1={n.x} y1={n.y} x2={n.x} y2={n.y + 14} stroke="#e2590a" strokeWidth="1.3" markerEnd="url(#mfj-ero)" />
        ))}
        <line x1={x + w / 2} y1={y + h + 10} x2={x + w / 2} y2={y + h + 44} stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" markerEnd="url(#mfj-r)" />
        <text x={x + w / 2 + 8} y={y + h + 40} fontSize="12" fontWeight="700" fill="#7c3aed">G = Vγ</text>
      </g>
    );
  })();

  // felület: lemez ferdén, tetején nyílmező
  const felulet = (() => {
    const ox = 230;
    const x = ox + 10;
    const y = 120;
    const w = 110;
    const d = 60;
    const nyilak = [];
    for (let i = 0; i < 5; i++)
      for (let j = 0; j < 3; j++) {
        const t = i / 4;
        const s = (j + 0.5) / 3;
        nyilak.push({ x: x + w * t + d * s, y: y - d * 0.55 * s });
      }
    return (
      <g>
        <path d={`M ${x} ${y} L ${x + d} ${y - d * 0.55} L ${x + w + d} ${y - d * 0.55} L ${x + w} ${y} Z`} fill="#dbeaee" stroke="#475569" strokeWidth="1.2" />
        <path d={`M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + 8} L ${x} ${y + 8} Z`} fill="#a9c9d2" stroke="#475569" strokeWidth="1.2" />
        <path d={`M ${x + w} ${y} L ${x + w + d} ${y - d * 0.55} L ${x + w + d} ${y - d * 0.55 + 8} L ${x + w} ${y + 8} Z`} fill="#8fb8c3" stroke="#475569" strokeWidth="1.2" />
        {nyilak.map((n, i) => (
          <line key={i} x1={n.x} y1={n.y - 34} x2={n.x} y2={n.y - 4} stroke="#e2590a" strokeWidth="1.3" markerEnd="url(#mfj-ero)" />
        ))}
        <line x1={x + w / 2 + d / 2} y1={y + 24} x2={x + w / 2 + d / 2} y2={y + 58} stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" markerEnd="url(#mfj-r)" />
        <text x={x + w / 2 + d / 2 + 8} y={y + 54} fontSize="12" fontWeight="700" fill="#7c3aed">R = qA</text>
      </g>
    );
  })();

  // vonal: gerenda, nyílsor
  const vonal = (() => {
    const ox = 420;
    const x = ox + 12;
    const y = 128;
    const w = 150;
    const T = y;
    return (
      <g>
        <rect x={x} y={T - 60} width={w} height={60} fill="#e2590a" opacity="0.12" stroke="#e2590a" strokeWidth="1.6" />
        <Nyilsor x0={x + 6} x1={x + w - 6} tetoAt={() => T - 60} tartoY={T} db={8} hegy="mfj-ero" />
        <line x1={x - 8} y1={T} x2={x + w + 8} y2={T} stroke="#1d3c48" strokeWidth="4" strokeLinecap="round" />
        <rect x={x} y={T + 2} width={w} height={10} fill="#c7dde3" stroke="#475569" strokeWidth="1" />
        <line x1={x + w / 2} y1={T + 22} x2={x + w / 2} y2={T + 56} stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" markerEnd="url(#mfj-r)" />
        <text x={x + w / 2 + 8} y={T + 52} fontSize="12" fontWeight="700" fill="#7c3aed">R = pL</text>
      </g>
    );
  })();

  return (
    <svg viewBox="0 0 600 240" className="abra w-full">
      <defs>
        <Hegy id="mfj-ero" szin="#e2590a" />
        <Hegy id="mfj-r" szin="#7c3aed" />
      </defs>
      {panel(50, "Térfogat mentén", ["γ [kN/m³] — fajsúly", "önsúly: γ = ϱ·g, G = V·γ"], terfogat)}
      {panel(240, "Felület mentén", ["q [kN/m²]", "hó, hasznos teher, víznyomás"], felulet)}
      {panel(430, "Vonal mentén", ["p [kN/m]", "gerenda önsúlya: p = A·γ"], vonal)}
    </svg>
  );
}

/* ---------------- Felület menti teher síkba vetítése (3.24–3.25. ábra) ---------------- */

export function AbraFeluletVetites() {
  // ferde (axonometrikus) lemez: x jobbra, y „hátra” (ferdén fel-jobbra), z felfelé
  const lemez = (ox, oy, L, b, haromszog) => {
    const dx = 0.55; // a y irány vetülete
    const dy = -0.32;
    const P = (x, y, z) => [ox + x + y * dx * b, oy - z + y * dy * b];
    const sarok = haromszog
      ? [P(0, 0, 0), P(L, 0, 0), P(L, 1, 0)]
      : [P(0, 0, 0), P(L, 0, 0), P(L, 1, 0), P(0, 1, 0)];
    const H = 34; // a q intenzitás rajzmagassága
    const teto = sarok.map(([x, y]) => [x, y - H]);
    const ut = (pts) => `M ${pts.map((p) => p.join(" ")).join(" L ")} Z`;
    const nyilak = [];
    const nx = 7;
    const ny = 3;
    for (let i = 0; i <= nx; i++)
      for (let j = 0; j < ny; j++) {
        const x = (i / nx) * L;
        const y = (j + 0.5) / ny;
        if (haromszog && y > x / L) continue;
        const [px, py] = P(x, y, 0);
        nyilak.push({ x: px, y: py });
      }
    // egy szürke sáv x = 0,6 L-nél
    const xs = 0.6 * L;
    const savY1 = haromszog ? xs / L : 1;
    const sav = [P(xs - 5, 0, 0), P(xs + 5, 0, 0), P(xs + 5, savY1, 0), P(xs - 5, savY1, 0)];
    return (
      <g>
        <path d={ut(sarok)} fill="#dbeaee" stroke="#475569" strokeWidth="1.2" />
        <path d={ut(sav)} fill="#64748b" opacity="0.45" />
        {/* a terhelési test oldalai */}
        <path d={`M ${sarok[0].join(" ")} L ${teto[0].join(" ")} L ${teto[1].join(" ")} L ${sarok[1].join(" ")} Z`} fill="#e2590a" opacity="0.1" />
        <path d={ut(teto)} fill="#e2590a" opacity="0.14" stroke="#e2590a" strokeWidth="1.4" />
        {sarok.map((s, i) => (
          <line key={i} x1={s[0]} y1={s[1]} x2={teto[i][0]} y2={teto[i][1]} stroke="#e2590a" strokeWidth="1" opacity="0.7" />
        ))}
        {nyilak.map((n, i) => (
          <line key={i} x1={n.x} y1={n.y - H} x2={n.x} y2={n.y - 4} stroke="#e2590a" strokeWidth="1.2" markerEnd="url(#fvt-ero)" />
        ))}
        {/* méretek */}
        <line x1={sarok[0][0]} y1={sarok[0][1] + 18} x2={sarok[1][0]} y2={sarok[1][1] + 18} stroke="#94a3b8" strokeWidth="1" markerStart="url(#fvt-m)" markerEnd="url(#fvt-m)" />
        <text x={(sarok[0][0] + sarok[1][0]) / 2} y={sarok[0][1] + 32} textAnchor="middle" fontSize="11.5" fill="#64748b">L</text>
        <line x1={sarok[1][0] + 14} y1={sarok[1][1]} x2={sarok[2][0] + 14} y2={sarok[2][1]} stroke="#94a3b8" strokeWidth="1" markerStart="url(#fvt-m)" markerEnd="url(#fvt-m)" />
        <text x={(sarok[1][0] + sarok[2][0]) / 2 + 24} y={(sarok[1][1] + sarok[2][1]) / 2 + 4} fontSize="11.5" fill="#64748b">b</text>
        <text x={teto[3] ? (teto[3][0] + teto[2][0]) / 2 : (teto[0][0] + teto[2][0]) / 2} y={Math.min(...teto.map((t) => t[1])) - 8} fontSize="12" fontWeight="650" fill="#e2590a" textAnchor="middle">q [kN/m²]</text>
      </g>
    );
  };

  const gerenda = (ox, oy, L, haromszog) => {
    const H = 48;
    const teto = (t) => oy - (haromszog ? H * t : H);
    return (
      <g>
        <path d={haromszog ? `M ${ox} ${oy} L ${ox + L} ${oy - H} L ${ox + L} ${oy} Z` : `M ${ox} ${oy} L ${ox} ${oy - H} L ${ox + L} ${oy - H} L ${ox + L} ${oy} Z`} fill="#e2590a" opacity="0.12" stroke="#e2590a" strokeWidth="1.6" />
        <Nyilsor x0={ox} x1={ox + L} tetoAt={teto} tartoY={oy} db={9} hegy="fvt-ero" />
        <line x1={ox - 8} y1={oy} x2={ox + L + 8} y2={oy} stroke="#1d3c48" strokeWidth="3.5" strokeLinecap="round" />
        <line x1={ox} y1={oy + 18} x2={ox + L} y2={oy + 18} stroke="#94a3b8" strokeWidth="1" markerStart="url(#fvt-m)" markerEnd="url(#fvt-m)" />
        <text x={ox + L / 2} y={oy + 32} textAnchor="middle" fontSize="11.5" fill="#64748b">L</text>
        <text x={ox + L / 2} y={oy - H - 8} fontSize="12" fontWeight="650" fill="#e2590a" textAnchor="middle">{haromszog ? "p = q·b·x/L (lineárisan)" : "p = q·b [kN/m]"}</text>
      </g>
    );
  };

  return (
    <svg viewBox="0 0 620 370" className="abra w-full">
      <defs>
        <Hegy id="fvt-ero" szin="#e2590a" />
        <Hegy id="fvt-m" szin="#94a3b8" />
        <Hegy id="fvt-ny" szin="#475569" />
      </defs>
      <text x="150" y="20" textAnchor="middle" fontSize="12.5" fontWeight="650" fill="#275767">Felület mentén: a terhelési test</text>
      <text x="470" y="20" textAnchor="middle" fontSize="12.5" fontWeight="650" fill="#275767">Síkba vetítve: vonal menti teher</text>
      {lemez(40, 150, 170, 70, false)}
      <line x1="300" y1="118" x2="350" y2="118" stroke="#475569" strokeWidth="1.4" markerEnd="url(#fvt-ny)" />
      <text x="325" y="108" textAnchor="middle" fontSize="10.5" fill="#475569">vetítés</text>
      {gerenda(390, 150, 190, false)}
      {lemez(40, 315, 170, 70, true)}
      <line x1="300" y1="283" x2="350" y2="283" stroke="#475569" strokeWidth="1.4" markerEnd="url(#fvt-ny)" />
      {gerenda(390, 315, 190, true)}
      <text x="310" y="362" textAnchor="middle" fontSize="11" fill="#475569">a szürke sáv: egy adott x-nél a b irányban „összegyűjtött” teher — ez adja a p = q·b értéket</text>
    </svg>
  );
}

/* ---------------- Felületre merőleges teher ferde rúdon: a két vetület (3.21. ábra) ---------------- */

export function AbraKetVetulet() {
  const rud = (r) => <line x1={r.x0} y1={r.y0} x2={r.x1} y2={r.y1} stroke="#1d3c48" strokeWidth="4" strokeLinecap="round" />;
  // a rúd balról lentről jobbra fel emelkedik (szarufa); a teher felülről, a rúdra merőlegesen nyomja
  const A = { x0: 40, y0: 200, x1: 240, y1: 100 };
  const hossz = Math.hypot(A.x1 - A.x0, A.y1 - A.y0);
  const nx = (A.y1 - A.y0) / hossz; // a rúd „fölé” mutató normális (képernyő-koordináták)
  const ny = -(A.x1 - A.x0) / hossz;
  const db = 8;
  const nyilak = Array.from({ length: db + 1 }, (_, i) => {
    const t = i / db;
    return { x: A.x0 + (A.x1 - A.x0) * t, y: A.y0 + (A.y1 - A.y0) * t };
  });
  const H = 36;
  const B = { x0: 380, y0: 200, x1: 580, y1: 100 };
  const a = B.x1 - B.x0;
  const b = B.y0 - B.y1;
  return (
    <svg viewBox="0 0 620 280" className="abra w-full">
      <defs>
        <Hegy id="kv-ero" szin="#e2590a" />
        <Hegy id="kv-t" szin="#0f766e" />
        <Hegy id="kv-k" szin="#2563eb" />
        <Hegy id="kv-m" szin="#94a3b8" />
      </defs>
      <text x="150" y="18" textAnchor="middle" fontSize="12.5" fontWeight="650" fill="#275767">a) A felületre merőleges teher</text>
      <text x="470" y="18" textAnchor="middle" fontSize="12.5" fontWeight="650" fill="#275767">b) Ugyanez a két vetületre bontva</text>

      {/* a) */}
      <path d={`M ${A.x0 + nx * H} ${A.y0 + ny * H} L ${A.x1 + nx * H} ${A.y1 + ny * H} L ${A.x1} ${A.y1} L ${A.x0} ${A.y0} Z`} fill="#e2590a" opacity="0.1" />
      <line x1={A.x0 + nx * H} y1={A.y0 + ny * H} x2={A.x1 + nx * H} y2={A.y1 + ny * H} stroke="#e2590a" strokeWidth="1.8" />
      {nyilak.map((n, i) => (
        <line key={i} x1={n.x + nx * (H - 2)} y1={n.y + ny * (H - 2)} x2={n.x + nx * 5} y2={n.y + ny * 5} stroke="#e2590a" strokeWidth="1.3" markerEnd="url(#kv-ero)" />
      ))}
      {rud(A)}
      <text x={(A.x0 + A.x1) / 2 + nx * (H + 14)} y={(A.y0 + A.y1) / 2 + ny * (H + 14)} fontSize="12.5" fontWeight="650" fill="#e2590a" textAnchor="middle">p</text>
      <line x1={A.x0} y1={A.y0 + 26} x2={A.x1} y2={A.y0 + 26} stroke="#94a3b8" strokeWidth="1" markerStart="url(#kv-m)" markerEnd="url(#kv-m)" />
      <text x={(A.x0 + A.x1) / 2} y={A.y0 + 40} textAnchor="middle" fontSize="11.5" fill="#64748b">a = L cos α</text>
      <line x1={A.x1 + 26} y1={A.y1} x2={A.x1 + 26} y2={A.y0} stroke="#94a3b8" strokeWidth="1" markerStart="url(#kv-m)" markerEnd="url(#kv-m)" />
      <text x={A.x1 + 20} y={(A.y0 + A.y1) / 2 + 4} fontSize="11.5" fill="#64748b" textAnchor="end">b = L sin α</text>
      <text x={(A.x0 + A.x1) / 2} y={A.y0 + 64} textAnchor="middle" fontSize="11.5" fill="#1d3c48" fontWeight="600">R = p · L, merőleges a rúdra, a közepén</text>

      {/* b) */}
      {rud(B)}
      {/* függőleges teher a vízszintes vetületen */}
      <rect x={B.x0} y={B.y1 - 62} width={a} height={30} fill="#0f766e" opacity="0.14" stroke="#0f766e" strokeWidth="1.5" />
      {Array.from({ length: 9 }, (_, i) => {
        const s = i / 8;
        const x = B.x0 + a * s;
        const yr = B.y0 + (B.y1 - B.y0) * s;
        return <line key={i} x1={x} y1={B.y1 - 32} x2={x} y2={yr - 5} stroke="#0f766e" strokeWidth="1.2" markerEnd="url(#kv-t)" opacity="0.8" />;
      })}
      <text x={B.x0 + a / 2} y={B.y1 - 67} textAnchor="middle" fontSize="11.5" fontWeight="650" fill="#0f766e">p a vízszintes vetületen → Rᵧ = p·a</text>
      {/* vízszintes teher a függőleges vetületen (bal oldalon, jobbra mutat) */}
      <rect x={B.x0 - 62} y={B.y1} width={30} height={b} fill="#2563eb" opacity="0.14" stroke="#2563eb" strokeWidth="1.5" />
      {Array.from({ length: 5 }, (_, i) => {
        const s = 1 - i / 4;
        const y = B.y0 + (B.y1 - B.y0) * s;
        const xr = B.x0 + a * s;
        return <line key={i} x1={B.x0 - 32} y1={y} x2={xr - 5} y2={y} stroke="#2563eb" strokeWidth="1.2" markerEnd="url(#kv-k)" opacity="0.8" />;
      })}
      <text x={B.x0 - 47} y={B.y1 - 10} textAnchor="middle" fontSize="12" fontWeight="650" fill="#2563eb">p</text>
      <text x={B.x0 - 40} y={B.y0 + 22} textAnchor="middle" fontSize="11.5" fontWeight="650" fill="#2563eb">Rₓ = p·b</text>
      <line x1={B.x0} y1={B.y0 + 26} x2={B.x1} y2={B.y0 + 26} stroke="#94a3b8" strokeWidth="1" markerStart="url(#kv-m)" markerEnd="url(#kv-m)" />
      <text x={(B.x0 + B.x1) / 2} y={B.y0 + 40} textAnchor="middle" fontSize="11.5" fill="#64748b">a</text>
      <line x1={B.x1 + 26} y1={B.y1} x2={B.x1 + 26} y2={B.y0} stroke="#94a3b8" strokeWidth="1" markerStart="url(#kv-m)" markerEnd="url(#kv-m)" />
      <text x={B.x1 + 32} y={(B.y0 + B.y1) / 2 + 4} fontSize="11.5" fill="#64748b">b</text>
      <text x={(B.x0 + B.x1) / 2} y={B.y0 + 64} textAnchor="middle" fontSize="11.5" fill="#1d3c48" fontWeight="600">ugyanaz a p mindkét vetületen → az eredő R</text>
    </svg>
  );
}

/* ---------------- Ívmenti teher: félkörív (3.22. ábra) ---------------- */

export function AbraIvTeher() {
  const iv = (cx, cy, r, nyilak) => (
    <g>
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke="#1d3c48" strokeWidth="6" strokeLinecap="round" />
      <path d={`M ${cx - r - 8} ${cy} A ${r + 8} ${r + 8} 0 0 1 ${cx + r + 8} ${cy}`} fill="none" stroke="#1d3c48" strokeWidth="1" opacity="0.5" />
      {nyilak}
    </g>
  );
  const A = { cx: 150, cy: 200, r: 90 };
  const B = { cx: 440, cy: 200, r: 90 };
  const db = 14;
  const H = 30;
  const merNyilak = Array.from({ length: db + 1 }, (_, i) => {
    const th = (Math.PI * i) / db;
    const c = Math.cos(th);
    const s = Math.sin(th);
    return (
      <line
        key={i}
        x1={A.cx - (A.r + H + 6) * c}
        y1={A.cy - (A.r + H + 6) * s}
        x2={A.cx - (A.r + 9) * c}
        y2={A.cy - (A.r + 9) * s}
        stroke="#e2590a"
        strokeWidth="1.3"
        markerEnd="url(#it-ero)"
      />
    );
  });
  return (
    <svg viewBox="0 0 620 270" className="abra w-full">
      <defs>
        <Hegy id="it-ero" szin="#e2590a" />
        <Hegy id="it-m" szin="#94a3b8" />
        <Hegy id="it-r" szin="#7c3aed" />
        <Hegy id="it-t" szin="#0f766e" />
        <Hegy id="it-k" szin="#2563eb" />
      </defs>
      <text x={A.cx} y="18" textAnchor="middle" fontSize="12.5" fontWeight="650" fill="#275767">a) Az ívre merőleges p teher</text>
      <text x={B.cx} y="18" textAnchor="middle" fontSize="12.5" fontWeight="650" fill="#275767">b) Vetületi terhek és az eredő</text>
      {/* a) */}
      <path
        d={`M ${A.cx - A.r - H - 6} ${A.cy} A ${A.r + H + 6} ${A.r + H + 6} 0 0 1 ${A.cx + A.r + H + 6} ${A.cy} L ${A.cx + A.r + 8} ${A.cy} A ${A.r + 8} ${A.r + 8} 0 0 0 ${A.cx - A.r - 8} ${A.cy} Z`}
        fill="#e2590a"
        opacity="0.1"
        stroke="#e2590a"
        strokeWidth="1.5"
      />
      {iv(A.cx, A.cy, A.r, merNyilak)}
      <text x={A.cx} y={A.cy - A.r - H - 16} textAnchor="middle" fontSize="12.5" fontWeight="650" fill="#e2590a">p [kN/m]</text>
      <line x1={A.cx - A.r} y1={A.cy + 22} x2={A.cx} y2={A.cy + 22} stroke="#94a3b8" strokeWidth="1" markerStart="url(#it-m)" markerEnd="url(#it-m)" />
      <line x1={A.cx} y1={A.cy + 22} x2={A.cx + A.r} y2={A.cy + 22} stroke="#94a3b8" strokeWidth="1" markerStart="url(#it-m)" markerEnd="url(#it-m)" />
      <text x={A.cx - A.r / 2} y={A.cy + 36} textAnchor="middle" fontSize="11.5" fill="#64748b">R</text>
      <text x={A.cx + A.r / 2} y={A.cy + 36} textAnchor="middle" fontSize="11.5" fill="#64748b">R</text>
      <circle cx={A.cx} cy={A.cy} r="3" fill="#1d3c48" />
      <text x={A.cx + 6} y={A.cy - 6} fontSize="11" fill="#1d3c48">O</text>
      {/* b) */}
      {iv(B.cx, B.cy, B.r, null)}
      {/* függőleges teher a 2R vízszintes vetületen */}
      <rect x={B.cx - B.r} y={B.cy - B.r - 62} width={2 * B.r} height={26} fill="#0f766e" opacity="0.14" stroke="#0f766e" strokeWidth="1.4" />
      {Array.from({ length: 11 }, (_, i) => {
        const x = B.cx - B.r + ((2 * B.r) * i) / 10;
        const dx = x - B.cx;
        const yIv = B.cy - Math.sqrt(Math.max(0, B.r * B.r - dx * dx));
        return <line key={i} x1={x} y1={B.cy - B.r - 36} x2={x} y2={yIv - 6} stroke="#0f766e" strokeWidth="1.1" opacity="0.7" markerEnd="url(#it-ero)" />;
      })}
      <text x={B.cx} y={B.cy - B.r - 68} textAnchor="middle" fontSize="11.5" fontWeight="650" fill="#0f766e">p a 2R vetületen → 2Rp</text>
      {/* vízszintes terhek a két oldalon */}
      <rect x={B.cx - B.r - 50} y={B.cy - B.r} width={22} height={B.r} fill="#2563eb" opacity="0.14" stroke="#2563eb" strokeWidth="1.3" />
      <rect x={B.cx + B.r + 28} y={B.cy - B.r} width={22} height={B.r} fill="#2563eb" opacity="0.14" stroke="#2563eb" strokeWidth="1.3" />
      {Array.from({ length: 5 }, (_, i) => {
        const y = B.cy - B.r + (B.r * i) / 4;
        const dy = B.cy - y;
        const xIv = Math.sqrt(Math.max(0, B.r * B.r - dy * dy));
        return (
          <g key={i}>
            <line x1={B.cx - B.r - 28} y1={y} x2={B.cx - xIv - 6} y2={y} stroke="#2563eb" strokeWidth="1.1" opacity="0.7" markerEnd="url(#it-ero)" />
            <line x1={B.cx + B.r + 28} y1={y} x2={B.cx + xIv + 6} y2={y} stroke="#2563eb" strokeWidth="1.1" opacity="0.7" markerEnd="url(#it-ero)" />
          </g>
        );
      })}
      {/* részeredők */}
      <line x1={B.cx - B.r - 84} y1={B.cy - B.r / 2} x2={B.cx - B.r - 54} y2={B.cy - B.r / 2} stroke="#2563eb" strokeWidth="3" strokeLinecap="round" markerEnd="url(#it-k)" />
      <line x1={B.cx + B.r + 84} y1={B.cy - B.r / 2} x2={B.cx + B.r + 54} y2={B.cy - B.r / 2} stroke="#2563eb" strokeWidth="3" strokeLinecap="round" markerEnd="url(#it-k)" />
      <text x={B.cx - B.r - 69} y={B.cy - B.r / 2 - 8} textAnchor="middle" fontSize="11.5" fontWeight="650" fill="#2563eb">Rp</text>
      <text x={B.cx + B.r + 69} y={B.cy - B.r / 2 - 8} textAnchor="middle" fontSize="11.5" fontWeight="650" fill="#2563eb">Rp</text>
      <text x={B.cx} y={B.cy + 50} textAnchor="middle" fontSize="11.5" fill="#2563eb">a két vízszintes Rp kiejti egymást</text>
      {/* eredő */}
      <line x1={B.cx} y1={B.cy - 60} x2={B.cx} y2={B.cy - 8} stroke="#7c3aed" strokeWidth="3.6" strokeLinecap="round" markerEnd="url(#it-r)" />
      <text x={B.cx + 8} y={B.cy - 40} fontSize="12.5" fontWeight="700" fill="#7c3aed">2Rp</text>
      <circle cx={B.cx} cy={B.cy} r="3" fill="#7c3aed" />
      <text x={B.cx + 6} y={B.cy + 14} fontSize="11" fill="#7c3aed">O</text>
      <text x={B.cx} y={B.cy + 36} textAnchor="middle" fontSize="11.5" fill="#1d3c48" fontWeight="600">az eredő függőleges, a kör középpontján át</text>
    </svg>
  );
}

/* ---------------- Víznyomás gáton (3.23. ábra) ---------------- */

export function AbraViznyomas() {
  // a gát vonala: a fenéktől (talppont) ívesen fel-balra; a víz jobbra és a fal fölött
  const H = 130; // vízmélység a rajzon
  const gat = (ox, oy) => {
    const pts = Array.from({ length: 13 }, (_, i) => {
      const t = i / 12;
      return [ox - 70 * t * t, oy - H * t];
    });
    return { pts, ut: `M ${pts.map((p) => p.join(" ")).join(" L ")}` };
  };
  const panel = (ox, oy, cim, mod) => {
    const g = gat(ox, oy);
    const vizUt = `${g.ut} L ${ox + 100} ${oy - H} L ${ox + 100} ${oy} Z`;
    return (
      <g>
        <text x={ox + 10} y="22" textAnchor="middle" fontSize="12.5" fontWeight="650" fill="#275767">{cim}</text>
        {/* víz */}
        <path d={vizUt} fill="#7dd3fc" opacity="0.35" />
        <line x1={ox - 60} y1={oy - H} x2={ox + 100} y2={oy - H} stroke="#0284c7" strokeWidth="1.2" strokeDasharray="6 3" />
        {/* fenék */}
        <line x1={ox - 80} y1={oy} x2={ox + 100} y2={oy} stroke="#475569" strokeWidth="1.6" />
        {/* a gát teste */}
        <path d={`${g.ut} L ${ox - 80} ${oy - H} L ${ox - 80} ${oy} Z`} fill="#cbd5e1" />
        <path d={g.ut} fill="none" stroke="#1d3c48" strokeWidth="3.5" strokeLinecap="round" />
        {mod === "nyomas" && (
          <>
            {g.pts.slice(1).map(([x, y], i) => {
              const j = i + 1;
              const [xa, ya] = g.pts[j - 1];
              const [xb, yb] = g.pts[Math.min(12, j + 1)];
              const tx = xb - xa;
              const ty = yb - ya;
              const L = Math.hypot(tx, ty);
              const nx = -ty / L; // a vízoldal felé (jobbra-fel) mutató normális
              const ny = tx / L;
              const magas = (oy - y) / H;
              const len = 8 + 40 * (1 - magas);
              if (len < 10) return null;
              return <line key={i} x1={x + nx * len} y1={y + ny * len} x2={x + nx * 5} y2={y + ny * 5} stroke="#e2590a" strokeWidth="1.3" markerEnd="url(#vn-ero)" />;
            })}
            <line x1={ox + 78} y1={oy} x2={ox + 78} y2={oy - H} stroke="#94a3b8" strokeWidth="1" markerStart="url(#vn-m)" markerEnd="url(#vn-m)" />
            <text x={ox + 84} y={oy - H / 2 + 4} fontSize="11.5" fill="#64748b">h</text>
            <text x={ox + 30} y={oy - H - 8} fontSize="11" fill="#e2590a" textAnchor="middle">p = γ·z, ⊥ a falra</text>
          </>
        )}
        {mod === "vizszintes" && (
          <g>
            {/* háromszög a függőleges vetületen (a talppont függőlegesén) */}
            <line x1={ox} y1={oy} x2={ox} y2={oy - H - 6} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 3" />
            <path d={`M ${ox} ${oy - H} L ${ox} ${oy} L ${ox + 46} ${oy} Z`} fill="#2563eb" opacity="0.16" stroke="#2563eb" strokeWidth="1.4" />
            {Array.from({ length: 6 }, (_, i) => {
              const y = oy - H + (H * (i + 1)) / 6;
              const len = (46 * (i + 1)) / 6;
              return <line key={i} x1={ox + len} y1={y} x2={ox + 4} y2={y} stroke="#2563eb" strokeWidth="1.1" markerEnd="url(#vn-ero)" opacity="0.8" />;
            })}
            <line x1={ox + 96} y1={oy - H / 3} x2={ox + 22} y2={oy - H / 3} stroke="#2563eb" strokeWidth="3.4" strokeLinecap="round" markerEnd="url(#vn-k)" />
            <text x={ox + 60} y={oy - H / 3 - 10} textAnchor="middle" fontSize="12" fontWeight="700" fill="#2563eb">Rₓ = ½γh²</text>
            <line x1={ox + 88} y1={oy} x2={ox + 88} y2={oy - H / 3} stroke="#94a3b8" strokeWidth="1" markerStart="url(#vn-m)" markerEnd="url(#vn-m)" />
            <text x={ox + 92} y={oy - 6} fontSize="10.5" fill="#64748b">h/3</text>
            <text x={ox + 10} y={oy - H - 8} fontSize="11" fill="#2563eb" textAnchor="middle">háromszög a függőleges vetületen</text>
          </g>
        )}
        {mod === "fuggoleges" && (
          <g>
            {/* a gát vonala és a vízszint közötti síkidom */}
            <path d={`${g.ut} L ${ox} ${oy - H} Z`} fill="#0f766e" opacity="0.2" stroke="#0f766e" strokeWidth="1.4" />
            {Array.from({ length: 5 }, (_, i) => {
              const t = (i + 1) / 6;
              const x = ox - 70 * t;
              const s = Math.sqrt((ox - x) / 70);
              const yG = oy - H * s;
              return <line key={i} x1={x} y1={oy - H + 2} x2={x} y2={yG - 5} stroke="#0f766e" strokeWidth="1.1" markerEnd="url(#vn-ero)" opacity="0.8" />;
            })}
            <line x1={ox - 28} y1={oy - H - 44} x2={ox - 28} y2={oy - H + 44} stroke="#0f766e" strokeWidth="3.4" strokeLinecap="round" markerEnd="url(#vn-t)" />
            <text x={ox - 20} y={oy - H - 30} fontSize="12" fontWeight="700" fill="#0f766e">Rᵧ = γ·A</text>
            <text x={ox + 10} y={oy - H - 8} fontSize="11" fill="#0f766e" textAnchor="middle">a fal fölötti síkidom × γ</text>
          </g>
        )}
      </g>
    );
  };
  return (
    <svg viewBox="0 0 655 250" className="abra w-full">
      <defs>
        <Hegy id="vn-ero" szin="#e2590a" />
        <Hegy id="vn-m" szin="#94a3b8" />
        <Hegy id="vn-k" szin="#2563eb" />
        <Hegy id="vn-t" szin="#0f766e" />
      </defs>
      {panel(100, 225, "a) A nyomás merőleges, γ·z", "nyomas")}
      {panel(320, 225, "b) Vízszintes komponens", "vizszintes")}
      {panel(545, 225, "c) Függőleges komponens", "fuggoleges")}
    </svg>
  );
}
