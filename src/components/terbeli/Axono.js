/**
 * Axonometrikus (kavalier) rajzelemek a térbeli tartók 2D SVG ábráihoz.
 * Statikai koordináták: x jobbra, y felfelé, z a néző felé (a rajzon balra-lefelé, rövidítve).
 *
 *   const v = axono({ ox, oy, s });      // v([x,y,z]) → [X,Y] képernyő-koordináta
 *   <TerHegyek />                        // nyílhegy-definíciók (egyszer, az <svg> elején)
 *   <Nyil3 v tol ig szin hegy vastag />  // nyíl két térbeli pont között
 *   <EroNyil3 v pont F leptek cimke />   // erő: a hegye a támadáspontban
 *   <KettosNyil3 v tol ig … />           // nyomatékvektor (kettős nyílhegy)
 *   <Rud3 v a b vastag szin />           // rúd / tartószár
 *   <Tengelyek3 v hossz origo />         // x, y, z tengelyek
 *   <Gomb3 v p />, <Talp3 v p />, <Befogas3 v p irany />, <Meret3 v a b eltolas cimke />
 *   <Felirat x y … />                    // képernyő-koordinátás felirat
 */

export const SZ = {
  tarto: "#1d3c48",
  rud: "#475569",
  teher: "#e2590a",
  reakcio: "#7c3aed",
  nyomatek: "#be123c",
  huzott: "#dc2626",
  nyomott: "#2563eb",
  meret: "#64748b",
  seged: "#94a3b8",
  kek: "#0369a1",
  zold: "#0f766e",
  sarga: "#b45309",
};

export function axono({ ox = 300, oy = 300, s = 40, kz = 0.55, szog = 40 } = {}) {
  const c = Math.cos((szog * Math.PI) / 180) * kz;
  const sn = Math.sin((szog * Math.PI) / 180) * kz;
  const v = (p) => [ox + s * (p[0] - c * p[2]), oy - s * (p[1] - sn * p[2])];
  v.s = s;
  return v;
}

export function TerHegyek() {
  const lista = [
    ["tr-teher", SZ.teher],
    ["tr-reakcio", SZ.reakcio],
    ["tr-nyomatek", SZ.nyomatek],
    ["tr-huzott", SZ.huzott],
    ["tr-nyomott", SZ.nyomott],
    ["tr-kek", SZ.kek],
    ["tr-zold", SZ.zold],
    ["tr-szurke", SZ.seged],
    ["tr-tengely", SZ.meret],
    ["tr-tarto", SZ.tarto],
  ];
  return (
    <defs>
      {lista.map(([id, szin]) => (
        <marker key={id} id={id} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
          <path d="M 0 1 L 9 5 L 0 9 z" fill={szin} />
        </marker>
      ))}
      <marker id="tr-meretvonal" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M 2 8 L 8 2" stroke={SZ.meret} strokeWidth="1.4" fill="none" />
      </marker>
    </defs>
  );
}

const hegyId = (szin) => {
  const t = { [SZ.teher]: "tr-teher", [SZ.reakcio]: "tr-reakcio", [SZ.nyomatek]: "tr-nyomatek", [SZ.huzott]: "tr-huzott", [SZ.nyomott]: "tr-nyomott", [SZ.kek]: "tr-kek", [SZ.zold]: "tr-zold", [SZ.seged]: "tr-szurke", [SZ.meret]: "tr-tengely", [SZ.tarto]: "tr-tarto" };
  return t[szin] ?? "tr-szurke";
};

/** Felirat képernyő-koordinátákkal. */
export function Felirat({ x, y, children, szin = SZ.tarto, meret = 12, vastag = true, horgony = "middle", dolt = false, hatter = true }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={horgony}
      fontSize={meret}
      fontWeight={vastag ? 650 : 450}
      fontStyle={dolt ? "italic" : "normal"}
      style={{ fill: szin, paintOrder: hatter ? "stroke" : undefined, stroke: hatter ? "white" : undefined, strokeWidth: hatter ? 3 : 0, strokeLinejoin: "round" }}
    >
      {children}
    </text>
  );
}

/** Nyíl két térbeli pont között. */
export function Nyil3({ v, tol, ig, szin = SZ.teher, vastag = 2.6, szaggatott = false, opacitas = 1 }) {
  const [x1, y1] = v(tol);
  const [x2, y2] = v(ig);
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={szin} strokeWidth={vastag} strokeLinecap="round" strokeDasharray={szaggatott ? "5 4" : undefined} markerEnd={`url(#${hegyId(szin)})`} opacity={opacitas} />;
}

/** Kettős nyíl (nyomatékvektor): a hegye elé egy második hegyet rajzolunk. */
export function KettosNyil3({ v, tol, ig, szin = SZ.nyomatek, vastag = 2.6, opacitas = 1 }) {
  const [x1, y1] = v(tol);
  const [x2, y2] = v(ig);
  const dx = x2 - x1;
  const dy = y2 - y1;
  const h = Math.hypot(dx, dy) || 1;
  const bx = x2 - (dx / h) * 7;
  const by = y2 - (dy / h) * 7;
  return (
    <g opacity={opacitas}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={szin} strokeWidth={vastag} strokeLinecap="round" markerEnd={`url(#${hegyId(szin)})`} />
      <line x1={x1} y1={y1} x2={bx} y2={by} stroke={szin} strokeWidth={vastag} strokeLinecap="round" markerEnd={`url(#${hegyId(szin)})`} />
    </g>
  );
}

/** Erő: a nyíl hegye a támadáspontban, a farka a −F irányban (hossz: leptek px/kN, legalább 26 px). */
export function EroNyil3({ v, pont, F, leptek = 4, szin = SZ.teher, vastag = 2.8, cimke, cimkeEltolas = [0, -8], meret = 12, horgony = "middle" }) {
  const h = Math.hypot(...F) || 1;
  const [x2, y2] = v(pont);
  const veg = v([pont[0] + F[0] / h, pont[1] + F[1] / h, pont[2] + F[2] / h]);
  const dX = veg[0] - x2;
  const dY = veg[1] - y2;
  const dh = Math.hypot(dX, dY) || 1;
  const L = Math.max(26, h * leptek);
  const x1 = x2 - (dX / dh) * L;
  const y1 = y2 - (dY / dh) * L;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={szin} strokeWidth={vastag} strokeLinecap="round" markerEnd={`url(#${hegyId(szin)})`} />
      {cimke && (
        /* a felirat a nyíl farkától a nyíllal ellentétes irányban, kifelé (a szerkezettől el) */
        <Felirat x={x1 - (dX / dh) * 12 + cimkeEltolas[0]} y={y1 - (dY / dh) * 12 + (dY > 0 ? -4 : 6) + cimkeEltolas[1]} szin={szin} meret={meret} horgony={horgony}>
          {cimke}
        </Felirat>
      )}
    </g>
  );
}

/** Vektor a pontból kifelé (reakció, rúderő, nyomaték): a farka a pontban. */
export function VektorNyil3({ v, pont, F, leptek = 4, szin = SZ.reakcio, vastag = 2.6, kettos = false, cimke, cimkeEltolas = [0, -8], meret = 12, minHossz = 26, hegyPontban = false, kezdoEltolas = 0, horgony = "middle", eltolasPx = [0, 0], cimkeKozepen = false }) {
  const h = Math.hypot(...F) || 1;
  const [X0, Y0] = [v(pont)[0] + eltolasPx[0], v(pont)[1] + eltolasPx[1]];
  const veg = v([pont[0] + F[0] / h, pont[1] + F[1] / h, pont[2] + F[2] / h]);
  const dX0 = veg[0] - X0;
  const dY0 = veg[1] - Y0;
  const dh = Math.hypot(dX0, dY0) || 1;
  const L = Math.max(minHossz, h * leptek);
  // hegyPontban: a nyíl hegye a pontban (a tankönyv rajzai szerint), a farka visszafelé; kezdoEltolas: a hegy visszatolása px-ben
  const ex = dX0 / dh;
  const ey = dY0 / dh;
  const x2 = hegyPontban ? X0 - ex * kezdoEltolas : X0 + ex * (kezdoEltolas + L);
  const y2 = hegyPontban ? Y0 - ey * kezdoEltolas : Y0 + ey * (kezdoEltolas + L);
  const x1 = x2 - ex * L;
  const y1 = y2 - ey * L;
  const dX = dX0;
  const dY = dY0;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={szin} strokeWidth={vastag} strokeLinecap="round" markerEnd={`url(#${hegyId(szin)})`} />
      {kettos && <line x1={x1} y1={y1} x2={x2 - (dX / dh) * 7} y2={y2 - (dY / dh) * 7} stroke={szin} strokeWidth={vastag} strokeLinecap="round" markerEnd={`url(#${hegyId(szin)})`} />}
      {cimke && (
        <Felirat x={(cimkeKozepen ? (x1 + x2) / 2 : hegyPontban ? x1 : x2) + cimkeEltolas[0]} y={(cimkeKozepen ? (y1 + y2) / 2 : hegyPontban ? y1 : y2) + cimkeEltolas[1]} szin={szin} meret={meret} horgony={horgony}>
          {cimke}
        </Felirat>
      )}
    </g>
  );
}

/** Rúd vagy tartószár két térbeli pont között. */
export function Rud3({ v, a, b, vastag = 5, szin = SZ.tarto, szaggatott = false, opacitas = 1 }) {
  const [x1, y1] = v(a);
  const [x2, y2] = v(b);
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={szin} strokeWidth={vastag} strokeLinecap="round" strokeDasharray={szaggatott ? "4 4" : undefined} opacity={opacitas} />;
}

/** Vékony segédvonal két térbeli pont között (szaggatott). */
export function Seged3({ v, a, b, szin = SZ.seged, vastag = 1, szaggatott = true }) {
  return <Rud3 v={v} a={a} b={b} vastag={vastag} szin={szin} szaggatott={szaggatott} />;
}

/** Koordinátatengelyek. */
export function Tengelyek3({ v, origo = [0, 0, 0], hossz = [3, 3, 3], cimkek = ["x", "y", "z"], szin = SZ.meret }) {
  const iranyok = [
    [hossz[0], 0, 0],
    [0, hossz[1], 0],
    [0, 0, hossz[2]],
  ];
  return (
    <g>
      {iranyok.map((d, i) => {
        const veg = [origo[0] + d[0], origo[1] + d[1], origo[2] + d[2]];
        const [X, Y] = v(veg);
        const [X0, Y0] = v(origo);
        const ux = (X - X0) / (Math.hypot(X - X0, Y - Y0) || 1);
        const uy = (Y - Y0) / (Math.hypot(X - X0, Y - Y0) || 1);
        return (
          <g key={i}>
            <line x1={X0} y1={Y0} x2={X} y2={Y} stroke={szin} strokeWidth="1.4" markerEnd="url(#tr-tengely)" />
            <Felirat x={X + ux * 12} y={Y + uy * 12 + 4} szin={szin} meret={12.5} dolt>
              {cimkek[i]}
            </Felirat>
          </g>
        );
      })}
    </g>
  );
}

/** Gömbcsukló: kör + kis talp. */
export function Gomb3({ v, p, r = 6, cimke, cimkeEltolas = [12, 4] }) {
  const [X, Y] = v(p);
  return (
    <g>
      <line x1={X - 9} y1={Y + r + 6} x2={X + 9} y2={Y + r + 6} stroke={SZ.rud} strokeWidth="1.6" />
      {[-7, -3, 1, 5].map((d) => (
        <line key={d} x1={X + d} y1={Y + r + 6} x2={X + d - 4} y2={Y + r + 11} stroke={SZ.rud} strokeWidth="1" />
      ))}
      <path d={`M ${X - 5} ${Y + r + 6} L ${X} ${Y + r - 1} L ${X + 5} ${Y + r + 6}`} fill="none" stroke={SZ.rud} strokeWidth="1.4" />
      <circle cx={X} cy={Y} r={r} fill="white" stroke={SZ.rud} strokeWidth="1.8" />
      {cimke && (
        <Felirat x={X + cimkeEltolas[0]} y={Y + cimkeEltolas[1]} meret={12.5} dolt>
          {cimke}
        </Felirat>
      )}
    </g>
  );
}

/** Támasztórúd talppontja (csuklós rögzítés a földhöz). */
export function Talp3({ v, p, forgatas = 0 }) {
  const [X, Y] = v(p);
  return (
    <g transform={`rotate(${forgatas} ${X} ${Y})`}>
      <circle cx={X} cy={Y} r="2.6" fill="white" stroke={SZ.rud} strokeWidth="1.4" />
      <path d={`M ${X} ${Y + 2.6} L ${X - 7} ${Y + 11} L ${X + 7} ${Y + 11} Z`} fill="white" stroke={SZ.rud} strokeWidth="1.3" strokeLinejoin="round" />
      <line x1={X - 10} y1={Y + 12.5} x2={X + 10} y2={Y + 12.5} stroke={SZ.rud} strokeWidth="1.2" />
    </g>
  );
}

/** Merev befogás: sraffozott vonal a ponton át; irany: "le" (talaj alul), "bal", "jobb", "fel". */
export function Befogas3({ v, p, irany = "le", szel = 36 }) {
  const [X, Y] = v(p);
  const forg = { le: 0, bal: 90, fel: 180, jobb: -90 }[irany] ?? 0;
  const vonalak = [];
  for (let i = -szel / 2; i <= szel / 2; i += 6) vonalak.push(<line key={i} x1={X + i} y1={Y} x2={X + i - 5} y2={Y + 6} stroke={SZ.rud} strokeWidth="1" />);
  return (
    <g transform={`rotate(${forg} ${X} ${Y})`}>
      <line x1={X - szel / 2} y1={Y} x2={X + szel / 2} y2={Y} stroke={SZ.rud} strokeWidth="1.6" />
      {vonalak}
    </g>
  );
}

/** Méretvonal két térbeli pont között, a képernyőn `eltolas` px-szel eltolva (merőlegesen). */
export function Meret3({ v, a, b, eltolas = [0, 18], cimke, meret = 11.5, szin = SZ.meret }) {
  const [x1, y1] = v(a);
  const [x2, y2] = v(b);
  const X1 = x1 + eltolas[0];
  const Y1 = y1 + eltolas[1];
  const X2 = x2 + eltolas[0];
  const Y2 = y2 + eltolas[1];
  return (
    <g>
      <line x1={x1} y1={y1} x2={X1} y2={Y1} stroke={szin} strokeWidth="0.8" />
      <line x1={x2} y1={y2} x2={X2} y2={Y2} stroke={szin} strokeWidth="0.8" />
      <line x1={X1} y1={Y1} x2={X2} y2={Y2} stroke={szin} strokeWidth="1" markerStart="url(#tr-meretvonal)" markerEnd="url(#tr-meretvonal)" />
      {cimke && (
        <Felirat x={(X1 + X2) / 2 + (eltolas[1] === 0 ? 14 : 0)} y={(Y1 + Y2) / 2 + (eltolas[1] === 0 ? 4 : -4)} szin={szin} meret={meret} vastag={false} horgony={eltolas[1] === 0 ? "start" : "middle"}>
          {cimke}
        </Felirat>
      )}
    </g>
  );
}

/** Téglatest élei: [x0,x1]×[y0,y1]×[z0,z1]; a takart élek szaggatottak. */
export function Doboz3({ v, x, y, z, szin = SZ.tarto, vastag = 2.2, kitoltes = "rgba(142,195,205,0.18)" }) {
  const P = (i, j, k) => [x[i], y[j], z[k]];
  // látható lapok: elöl (z1), fent (y1), jobb (x1)
  const elol = [P(0, 0, 1), P(1, 0, 1), P(1, 1, 1), P(0, 1, 1)].map(v);
  const fent = [P(0, 1, 1), P(1, 1, 1), P(1, 1, 0), P(0, 1, 0)].map(v);
  const jobb = [P(1, 0, 1), P(1, 0, 0), P(1, 1, 0), P(1, 1, 1)].map(v);
  const poly = (pts) => pts.map((q) => q.join(",")).join(" ");
  const el = (a, b, rejtett) => {
    const [x1, y1] = v(a);
    const [x2, y2] = v(b);
    return <line key={`${a}-${b}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={szin} strokeWidth={rejtett ? 1 : vastag} strokeDasharray={rejtett ? "4 3" : undefined} />;
  };
  return (
    <g>
      <polygon points={poly(elol)} fill={kitoltes} />
      <polygon points={poly(fent)} fill={kitoltes} />
      <polygon points={poly(jobb)} fill={kitoltes} />
      {/* rejtett élek: a bal-hátsó függőleges, a hátsó-alsó és a bal-alsó-hátsó él */}
      {el(P(0, 0, 0), P(0, 1, 0), true)}
      {el(P(0, 0, 0), P(1, 0, 0), true)}
      {el(P(0, 0, 0), P(0, 0, 1), true)}
      {/* látható élek */}
      {el(P(0, 0, 1), P(1, 0, 1))}
      {el(P(1, 0, 1), P(1, 0, 0))}
      {el(P(0, 0, 1), P(0, 1, 1))}
      {el(P(1, 0, 1), P(1, 1, 1))}
      {el(P(1, 0, 0), P(1, 1, 0))}
      {el(P(0, 1, 1), P(1, 1, 1))}
      {el(P(1, 1, 1), P(1, 1, 0))}
      {el(P(1, 1, 0), P(0, 1, 0))}
      {el(P(0, 1, 0), P(0, 1, 1))}
    </g>
  );
}

/** Keresztmetszet-jel: kis ellipszis a tengelyre merőlegesen (a rajzon ferde ellipszis). */
export function Metszet3({ v, p, t, r = 9, szin = SZ.sarga, cimke, cimkeEltolas = [12, -8] }) {
  const [X, Y] = v(p);
  const fugg = Math.abs(t[1]) > 0.5;
  return (
    <g>
      <ellipse cx={X} cy={Y} rx={fugg ? r : r * 0.45} ry={fugg ? r * 0.45 : r} fill="rgba(245,158,11,0.35)" stroke={szin} strokeWidth="1.6" />
      {cimke && (
        <Felirat x={X + cimkeEltolas[0]} y={Y + cimkeEltolas[1]} szin={szin} meret={12} dolt>
          {cimke}
        </Felirat>
      )}
    </g>
  );
}
