"use client";

/** Közös rajzelemek a filmekhez. Minden koordináta képernyő-koordináta. */

export function Hegy({ id, szin }) {
  return (
    <marker id={id} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
      <path d="M 0 1 L 9 5 L 0 9 z" fill={szin} />
    </marker>
  );
}

/** Kihúzódó nyíl: u = 0..1 a hossz aránya. */
export function NyilA({ x1, y1, x2, y2, u = 1, szin, hegy, vastag = 3, opacitas = 1, szaggatott = false }) {
  if (u <= 0.02 || opacitas <= 0.01) return null;
  const x = x1 + (x2 - x1) * u;
  const y = y1 + (y2 - y1) * u;
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x}
      y2={y}
      stroke={szin}
      strokeWidth={vastag}
      strokeLinecap="round"
      strokeDasharray={szaggatott ? "5 4" : undefined}
      markerEnd={`url(#${hegy})`}
      opacity={opacitas}
    />
  );
}

/** Kihúzódó vonal (nyílhegy nélkül). */
export function VonalA({ x1, y1, x2, y2, u = 1, szin = "#94a3b8", vastag = 1, opacitas = 1, szaggatott = true }) {
  if (u <= 0.01 || opacitas <= 0.01) return null;
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x1 + (x2 - x1) * u}
      y2={y1 + (y2 - y1) * u}
      stroke={szin}
      strokeWidth={vastag}
      strokeDasharray={szaggatott ? "4 3" : undefined}
      opacity={opacitas}
    />
  );
}

/** Felirat, ami beúszik (opacitás). */
export function FeliratA({ x, y, children, szin = "#1d3c48", meret = 12.5, vastag = true, opacitas = 1, horgony = "middle", dolt = false }) {
  if (opacitas <= 0.01) return null;
  return (
    <text
      x={x}
      y={y}
      textAnchor={horgony}
      fontSize={meret}
      fontWeight={vastag ? 650 : 400}
      fontStyle={dolt ? "italic" : "normal"}
      opacity={opacitas}
      style={{ fill: szin, paintOrder: "stroke", stroke: "white", strokeWidth: 3.5 }}
    >
      {children}
    </text>
  );
}

/** Körív, ami kirajzolódik (szögjelöléshez, forgásirányhoz). Szögek fokban, matematikai irány (óramutatóval ellentétes pozitív). */
export function IvA({ cx, cy, r, kezdoFok, vegFok, u = 1, szin = "#64748b", vastag = 1.3, opacitas = 1, hegy }) {
  if (u <= 0.01 || opacitas <= 0.01) return null;
  const veg = kezdoFok + (vegFok - kezdoFok) * u;
  const k = (-kezdoFok * Math.PI) / 180;
  const v = (-veg * Math.PI) / 180;
  const x1 = cx + r * Math.cos(k);
  const y1 = cy + r * Math.sin(k);
  const x2 = cx + r * Math.cos(v);
  const y2 = cy + r * Math.sin(v);
  const kul = Math.abs(veg - kezdoFok);
  const nagy = kul > 180 ? 1 : 0;
  const sweep = veg > kezdoFok ? 0 : 1; // pozitív (CCW) forgás a képernyőn sweep=0
  return (
    <path
      d={`M ${x1} ${y1} A ${r} ${r} 0 ${nagy} ${sweep} ${x2} ${y2}`}
      fill="none"
      stroke={szin}
      strokeWidth={vastag}
      opacity={opacitas}
      markerEnd={hegy ? `url(#${hegy})` : undefined}
    />
  );
}

/** Pont, ami „felpattan”. */
export function PontA({ x, y, r = 4, szin, u = 1, opacitas = 1 }) {
  if (u <= 0.01 || opacitas <= 0.01) return null;
  return <circle cx={x} cy={y} r={r * Math.min(1, u)} fill={szin} stroke="white" strokeWidth="1.5" opacity={opacitas} />;
}
