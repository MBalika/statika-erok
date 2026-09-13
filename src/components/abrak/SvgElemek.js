"use client";

/** Közös SVG építőelemek az ábrákhoz. Minden koordináta már képernyő-koordináta. */

export function NyilHegyek() {
  const szinek = [
    ["ero", "var(--color-jel-ero)"],
    ["komp", "var(--color-jel-komp)"],
    ["eredo", "var(--color-jel-eredo)"],
    ["tengely", "var(--color-jel-tengely)"],
    ["kek", "#2563eb"],
    ["szurke", "#94a3b8"],
  ];
  return (
    <defs>
      {szinek.map(([nev, szin]) => (
        <marker
          key={nev}
          id={`hegy-${nev}`}
          viewBox="0 0 10 10"
          refX="8.5"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 9 5 L 0 9 z" fill={szin} />
        </marker>
      ))}
    </defs>
  );
}

/** Nyíl két pont között, hegy a második ponton. */
export function Nyil({
  x1,
  y1,
  x2,
  y2,
  szin = "ero",
  vastagsag = 2.6,
  szaggatott = false,
  opacitas = 1,
}) {
  const szinek = {
    ero: "var(--color-jel-ero)",
    komp: "var(--color-jel-komp)",
    eredo: "var(--color-jel-eredo)",
    tengely: "var(--color-jel-tengely)",
    kek: "#2563eb",
    szurke: "#94a3b8",
  };
  if (Math.hypot(x2 - x1, y2 - y1) < 1.5) return null;
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={szinek[szin]}
      strokeWidth={vastagsag}
      strokeLinecap="round"
      strokeDasharray={szaggatott ? "5 4" : undefined}
      markerEnd={`url(#hegy-${szin})`}
      opacity={opacitas}
    />
  );
}

/** Koordinátatengelyek origóval. */
export function Tengelyek({
  ox,
  oy,
  balra,
  jobbra,
  fel,
  le,
  xCimke = "x",
  yCimke = "y",
}) {
  return (
    <g>
      <line
        x1={ox - balra}
        y1={oy}
        x2={ox + jobbra}
        y2={oy}
        className="tengely"
        markerEnd="url(#hegy-tengely)"
      />
      <line
        x1={ox}
        y1={oy + le}
        x2={ox}
        y2={oy - fel}
        className="tengely"
        markerEnd="url(#hegy-tengely)"
      />
      <text x={ox + jobbra + 4} y={oy + 5} className="cimke-kicsi" fontStyle="italic">
        {xCimke}
      </text>
      <text x={ox + 6} y={oy - fel - 3} className="cimke-kicsi" fontStyle="italic">
        {yCimke}
      </text>
    </g>
  );
}

/** Szögív jelölés az origó körül, a vízszintestől mérve. */
export function SzogIv({
  ox,
  oy,
  sugar = 34,
  kezdoFok = 0,
  vegFok,
  szin = "#64748b",
  cimke,
}) {
  const k = (-kezdoFok * Math.PI) / 180;
  const v = (-vegFok * Math.PI) / 180;
  const x1 = ox + sugar * Math.cos(k);
  const y1 = oy + sugar * Math.sin(k);
  const x2 = ox + sugar * Math.cos(v);
  const y2 = oy + sugar * Math.sin(v);
  const kulonbseg = ((vegFok - kezdoFok) % 360 + 360) % 360;
  const nagyIv = kulonbseg > 180 ? 1 : 0;
  const forgas = 0; // SVG-ben az y lefelé nő, ezért fordított a körüljárás
  const kozep = kezdoFok + kulonbseg / 2;
  const kr = (-kozep * Math.PI) / 180;

  return (
    <g>
      <path
        d={`M ${x1} ${y1} A ${sugar} ${sugar} 0 ${nagyIv} ${forgas} ${x2} ${y2}`}
        fill="none"
        stroke={szin}
        strokeWidth="1.3"
      />
      {cimke && (
        <text
          x={ox + (sugar + 14) * Math.cos(kr)}
          y={oy + (sugar + 14) * Math.sin(kr) + 4}
          textAnchor="middle"
          className="cimke-kicsi"
          fill={szin}
        >
          {cimke}
        </text>
      )}
    </g>
  );
}

/** Szövegcímke háttérrel, hogy a vonalak fölött is olvasható maradjon. */
export function Cimke({
  x,
  y,
  children,
  szin = "var(--color-petrol-900)",
  meret = 13,
  vastag = true,
  horgony = "middle",
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={horgony}
      fontSize={meret}
      fontWeight={vastag ? 650 : 400}
      style={{
        fill: szin,
        paintOrder: "stroke",
        stroke: "white",
        strokeWidth: 3.5,
      }}
    >
      {children}
    </text>
  );
}

/** Húzható fogópont. */
export function Fogopont({ x, y, szin = "var(--color-jel-ero)", onPointerDown }) {
  return (
    <g onPointerDown={onPointerDown} style={{ touchAction: "none" }}>
      <circle cx={x} cy={y} r="16" fill="transparent" className="fogopont" />
      <circle
        cx={x}
        cy={y}
        r="6.5"
        fill="white"
        stroke={szin}
        strokeWidth="2.5"
        className="fogopont"
      />
    </g>
  );
}

/** Derékszög-jel két irány között. */
export function DerekszogJel({ x, y, meret = 9, forgatas = 0 }) {
  return (
    <path
      d={`M ${x + meret} ${y} L ${x + meret} ${y - meret} L ${x} ${y - meret}`}
      transform={`rotate(${forgatas} ${x} ${y})`}
      fill="none"
      stroke="#94a3b8"
      strokeWidth="1.2"
    />
  );
}
