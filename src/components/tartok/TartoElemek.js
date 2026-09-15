"use client";

/**
 * Közös SVG rajzelemek a tartókhoz (5. modul és a későbbi tartós modulok).
 * Minden koordináta képernyő-koordináta (y lefelé nő), a tartó tengelye a
 * hívó által megadott ponton megy át. A támaszjelek a tankönyv 4.1–4.4. ábráját követik.
 *
 *   <Tarto x1 y1 x2 y2 />                 – a tartó rúdja (vastag vonal)
 *   <Gorgo x y szog />                    – görgős támasz; szog: a gördülési sík hajlása fokban (0 = vízszintes)
 *   <Csuklo x y />                        – csuklós támasz
 *   <Befogas x y irany />                 – merev befogás; irany: "bal" | "jobb" | "le" | "fel" (merre van a fal)
 *   <Rud x1 y1 x2 y2 />                   – támasztórúd (két végén csukló)
 *   <TeherNyil x y hossz szog cimke />    – koncentrált erő (a hegye az (x,y) pontban); szog: az erő iránya fokban, matematikai (0 = jobbra, 90 = felfelé)
 *   <ReakcioNyil … />                     – ugyanez lila színnel (reakció)
 *   <MegoszloTeher x1 x2 y p1 p2 lepték /> – vonal menti teher nyílsorral (p pozitív = lefelé mutató nyilak)
 *   <KoncentraltNyomatek x y r irany cimke /> – félköríves nyíl; irany: 1 = óramutatóval ellentétes, -1 = óramutató szerint
 *   <Meret x1 x2 y cimke />               – vízszintes méretvonal; <MeretFugg x y1 y2 cimke /> függőleges
 *   <TamaszCimke x y> A </TamaszCimke>    – betűjel
 *   <TartoHegyek />                       – a nyílhegy-definíciók (egyszer, a <svg> elején)
 */

export const SZIN = {
  tarto: "#1d3c48",
  tamasz: "#475569",
  teher: "var(--color-jel-ero)",
  reakcio: "var(--color-jel-eredo)",
  nyomatek: "#9f1239",
  meret: "#64748b",
  rud: "#2563eb",
};

export function TartoHegyek() {
  const lista = [
    ["th-teher", SZIN.teher],
    ["th-reakcio", SZIN.reakcio],
    ["th-nyomatek", SZIN.nyomatek],
    ["th-meret", SZIN.meret],
    ["th-szurke", "#94a3b8"],
  ];
  return (
    <defs>
      {lista.map(([id, szin]) => (
        <marker key={id} id={id} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
          <path d="M 0 1 L 9 5 L 0 9 z" fill={szin} />
        </marker>
      ))}
      <marker id="th-meretvonal" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M 2 8 L 8 2" stroke={SZIN.meret} strokeWidth="1.4" fill="none" />
      </marker>
    </defs>
  );
}

export function Tarto({ x1, y1, x2, y2, vastag = 6, szin = SZIN.tarto, opacitas = 1 }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={szin} strokeWidth={vastag} strokeLinecap="round" opacity={opacitas} />;
}

/** Sraffozott talajvonal (x középpont, w szélesség). */
function Talaj({ x, y, w = 34, forgatas = 0 }) {
  const vonalak = [];
  for (let i = -w / 2; i <= w / 2; i += 6) {
    vonalak.push(<line key={i} x1={x + i} y1={y} x2={x + i - 5} y2={y + 6} stroke={SZIN.tamasz} strokeWidth="1" />);
  }
  return (
    <g transform={`rotate(${forgatas} ${x} ${y})`}>
      <line x1={x - w / 2} y1={y} x2={x + w / 2} y2={y} stroke={SZIN.tamasz} strokeWidth="1.4" />
      {vonalak}
    </g>
  );
}

/** Görgős támasz: háromszög + két kis kör a gördülési síkon. A szog a gördülési sík hajlása (fok), a támasz a tartó alatt van. */
export function Gorgo({ x, y, szog = 0, meret = 16, opacitas = 1 }) {
  const h = meret;
  return (
    <g transform={`rotate(${-szog} ${x} ${y})`} opacity={opacitas}>
      <circle cx={x} cy={y} r="3" fill="white" stroke={SZIN.tamasz} strokeWidth="1.5" />
      <path d={`M ${x} ${y + 3} L ${x - h * 0.7} ${y + h} L ${x + h * 0.7} ${y + h} Z`} fill="white" stroke={SZIN.tamasz} strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx={x - h * 0.4} cy={y + h + 4} r="3" fill="white" stroke={SZIN.tamasz} strokeWidth="1.3" />
      <circle cx={x + h * 0.4} cy={y + h + 4} r="3" fill="white" stroke={SZIN.tamasz} strokeWidth="1.3" />
      <Talaj x={x} y={y + h + 7.5} />
    </g>
  );
}

/** Csuklós támasz: háromszög sraffozott talpon. */
export function Csuklo({ x, y, meret = 16, opacitas = 1, forgatas = 0 }) {
  const h = meret;
  return (
    <g transform={`rotate(${forgatas} ${x} ${y})`} opacity={opacitas}>
      <path d={`M ${x} ${y + 3} L ${x - h * 0.7} ${y + h} L ${x + h * 0.7} ${y + h} Z`} fill="white" stroke={SZIN.tamasz} strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx={x} cy={y} r="3.2" fill="white" stroke={SZIN.tamasz} strokeWidth="1.5" />
      <Talaj x={x} y={y + h} />
    </g>
  );
}

/** Merev befogás: sraffozott fal a tartó végén. irany = merre van a fal a tartóhoz képest. */
export function Befogas({ x, y, irany = "bal", hossz = 34, opacitas = 1}) {
  const forg = { bal: 90, jobb: -90, le: 0, fel: 180 }[irany] ?? 90;
  // a Talaj alapból vízszintes vonal, alatta sraffozással ("le" = a fal a tartó alatt)
  return (
    <g opacity={opacitas}>
      <Talaj x={x} y={y} w={hossz} forgatas={forg} />
    </g>
  );
}

/** Támasztórúd: vékonyabb rúd, mindkét végén csuklóval. */
export function Rud({ x1, y1, x2, y2, szin = SZIN.rud, vastag = 3.5, opacitas = 1 }) {
  return (
    <g opacity={opacitas}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={szin} strokeWidth={vastag} strokeLinecap="round" />
      <circle cx={x1} cy={y1} r="3.2" fill="white" stroke={SZIN.tamasz} strokeWidth="1.5" />
      <circle cx={x2} cy={y2} r="3.2" fill="white" stroke={SZIN.tamasz} strokeWidth="1.5" />
    </g>
  );
}

/** Belső csukló egy tartón (kis üres kör). */
export function BelsoCsuklo({ x, y, r = 4.5 }) {
  return <circle cx={x} cy={y} r={r} fill="white" stroke={SZIN.tarto} strokeWidth="2" />;
}

/** Erő-nyíl, amelynek a hegye az (x, y) pontban van; szog: az erő iránya (fok, 0 = jobbra, 90 = felfelé). */
export function TeherNyil({ x, y, hossz = 60, szog = -90, szin = SZIN.teher, hegy = "th-teher", vastag = 3, cimke, cimkeEltolas = [10, -6], opacitas = 1, szaggatott = false }) {
  if (opacitas <= 0.01 || hossz < 1) return null;
  const r = (szog * Math.PI) / 180;
  const x1 = x - hossz * Math.cos(r);
  const y1 = y + hossz * Math.sin(r);
  return (
    <g opacity={opacitas}>
      <line x1={x1} y1={y1} x2={x} y2={y} stroke={szin} strokeWidth={vastag} strokeLinecap="round" markerEnd={`url(#${hegy})`} strokeDasharray={szaggatott ? "6 4" : undefined} />
      {cimke && (
        <text x={x1 + cimkeEltolas[0]} y={y1 + cimkeEltolas[1]} fontSize="13" fontWeight="650" style={{ fill: szin, paintOrder: "stroke", stroke: "white", strokeWidth: 3.5 }}>
          {cimke}
        </text>
      )}
    </g>
  );
}

export function ReakcioNyil(props) {
  return <TeherNyil szin={SZIN.reakcio} hegy="th-reakcio" {...props} />;
}

/** Vonal menti teher x1..x2 között, a tartó y magasságában; p1, p2 az intenzitás a két végén (kN/m), leptek = px / (kN/m). Pozitív p: lefelé mutató nyilak. */
export function MegoszloTeher({ x1, x2, y, p1, p2 = p1, leptek = 6, szin = SZIN.teher, db, cimke1, cimke2, opacitas = 1 }) {
  if (opacitas <= 0.01) return null;
  const n = db ?? Math.max(3, Math.round((x2 - x1) / 22));
  const nyilak = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const x = x1 + (x2 - x1) * u;
    const p = p1 + (p2 - p1) * u;
    const h = Math.abs(p) * leptek;
    if (h < 2) continue;
    const felfele = p < 0;
    nyilak.push(
      <line key={i} x1={x} y1={felfele ? y + h : y - h} x2={x} y2={felfele ? y + 1 : y - 1} stroke={szin} strokeWidth="1.6" markerEnd="url(#th-teher)" />,
    );
  }
  const yA = y - p1 * leptek;
  const yB = y - p2 * leptek;
  return (
    <g opacity={opacitas}>
      <path d={`M ${x1} ${y} L ${x1} ${yA} L ${x2} ${yB} L ${x2} ${y} Z`} fill={szin} fillOpacity="0.12" stroke={szin} strokeWidth="1.4" />
      {nyilak}
      {cimke1 && (
        <text x={x1 - 6} y={yA - 6} textAnchor="end" fontSize="12.5" fontWeight="650" style={{ fill: szin, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
          {cimke1}
        </text>
      )}
      {cimke2 && (
        <text x={x2 + 6} y={yB - 6} fontSize="12.5" fontWeight="650" style={{ fill: szin, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
          {cimke2}
        </text>
      )}
    </g>
  );
}

/** Koncentrált nyomaték: félköríves nyíl. irany = 1: óramutatóval ellentétes (pozitív), -1: óramutató szerint. */
export function KoncentraltNyomatek({ x, y, r = 18, irany = 1, szin = SZIN.nyomatek, cimke, opacitas = 1 }) {
  if (opacitas <= 0.01) return null;
  // az ív a jobb oldalról indul, felül halad át, a bal oldalon végződik (a képernyőn ez CCW = irany 1)
  const sweep = irany === 1 ? 0 : 1;
  const d = irany === 1 ? `M ${x + r} ${y} A ${r} ${r} 0 1 ${sweep} ${x - r} ${y}` : `M ${x - r} ${y} A ${r} ${r} 0 1 ${sweep} ${x + r} ${y}`;
  return (
    <g opacity={opacitas}>
      <path d={d} fill="none" stroke={szin} strokeWidth="2.6" markerEnd="url(#th-nyomatek)" />
      {cimke && (
        <text x={x} y={y - r - 7} textAnchor="middle" fontSize="13" fontWeight="650" style={{ fill: szin, paintOrder: "stroke", stroke: "white", strokeWidth: 3.5 }}>
          {cimke}
        </text>
      )}
    </g>
  );
}

/** Vízszintes méretvonal ferde végjelekkel (a tankönyv rajzai szerint). */
export function Meret({ x1, x2, y, cimke, opacitas = 1 }) {
  return (
    <g opacity={opacitas}>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke={SZIN.meret} strokeWidth="1" markerStart="url(#th-meretvonal)" markerEnd="url(#th-meretvonal)" />
      <line x1={x1} y1={y - 5} x2={x1} y2={y + 5} stroke={SZIN.meret} strokeWidth="1" />
      <line x1={x2} y1={y - 5} x2={x2} y2={y + 5} stroke={SZIN.meret} strokeWidth="1" />
      {cimke && (
        <text x={(x1 + x2) / 2} y={y - 5} textAnchor="middle" fontSize="12" fontStyle="italic" style={{ fill: SZIN.meret, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
          {cimke}
        </text>
      )}
    </g>
  );
}

export function MeretFugg({ x, y1, y2, cimke, opacitas = 1 }) {
  return (
    <g opacity={opacitas}>
      <line x1={x} y1={y1} x2={x} y2={y2} stroke={SZIN.meret} strokeWidth="1" markerStart="url(#th-meretvonal)" markerEnd="url(#th-meretvonal)" />
      <line x1={x - 5} y1={y1} x2={x + 5} y2={y1} stroke={SZIN.meret} strokeWidth="1" />
      <line x1={x - 5} y1={y2} x2={x + 5} y2={y2} stroke={SZIN.meret} strokeWidth="1" />
      {cimke && (
        <text x={x + 7} y={(y1 + y2) / 2 + 4} fontSize="12" fontStyle="italic" style={{ fill: SZIN.meret, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
          {cimke}
        </text>
      )}
    </g>
  );
}

export function TamaszCimke({ x, y, children, szin = SZIN.tarto, meret = 13.5 }) {
  return (
    <text x={x} y={y} textAnchor="middle" fontSize={meret} fontStyle="italic" fontWeight="650" style={{ fill: szin, paintOrder: "stroke", stroke: "white", strokeWidth: 3.5 }}>
      {children}
    </text>
  );
}
