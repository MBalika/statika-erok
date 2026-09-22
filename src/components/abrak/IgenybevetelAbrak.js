import { elemez } from "@/lib/tarto";
import { TartoHegyek, Tarto, Gorgo, Csuklo, Befogas, TeherNyil, ReakcioNyil, KoncentraltNyomatek, Meret, TamaszCimke, SZIN } from "@/components/tartok/TartoElemek";
import Diagram, { SZINEK, ert } from "@/components/igenybevetel/Diagram";
import { MODELLEK, eredmeny } from "@/components/igenybevetel/Modellek";

/**
 * A 9. modul elméleti ábrái (tankönyv 8.1–8.12. ábra nyomán). Statikus SVG-k;
 * ahol lehet, a számítómag egzakt eredményét rajzolja a Diagram.
 */

const T = ({ x, y, children, szin = "#1d3c48", meret = 12, horgony = "middle", dolt = false, vastag = false }) => (
  <text x={x} y={y} textAnchor={horgony} fontSize={meret} fontStyle={dolt ? "italic" : "normal"} fontWeight={vastag ? 700 : 500}
    style={{ fill: szin, paintOrder: "stroke", stroke: "white", strokeWidth: 3.5 }}>
    {children}
  </text>
);
const Cim = ({ x, y, children }) => <T x={x} y={y} meret={12.5} vastag horgony="start">{children}</T>;
const Magyarazat = ({ x = 300, y, sorok }) => sorok.map((s, i) => <T key={i} x={x} y={y + i * 15} meret={11.5} szin="#475569">{s}</T>);

const ZOLD = SZINEK.N, KEK = SZINEK.V, BORDO = SZINEK.M;

/** Nyíl két pont között, felirattal a hegynél (egyszerű, színezhető). */
function Nyil({ x1, y1, x2, y2, szin = SZIN.teher, hegy = "th-teher", vastag = 2.6, szaggatott = false }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={szin} strokeWidth={vastag} strokeLinecap="round" markerEnd={`url(#${hegy})`} strokeDasharray={szaggatott ? "5 4" : undefined} />;
}

function Hegyek() {
  return (
    <defs>
      {[["ih-zold", ZOLD], ["ih-kek", KEK], ["ih-bordo", BORDO], ["ih-sotet", "#1d3c48"]].map(([id, szin]) => (
        <marker key={id} id={id} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
          <path d="M 0 1 L 9 5 L 0 9 z" fill={szin} />
        </marker>
      ))}
    </defs>
  );
}

/** Belső erők egy keresztmetszeten (vízszintes rúdvégre): N (zöld), V (kék), M (bordó ív). oldal: "bal" rész jobb vége, vagy "jobb" rész bal vége. */
function BelsoErok({ x, y, oldal, N = 1, V = 1, M = 1, cimkek = true, hossz = 34, pozitivOldal = "alul", index = "" }) {
  const j = oldal === "bal" ? 1 : -1; // a pozitív N iránya (kifelé)
  const el = [];
  if (N) el.push(<Nyil key="n" x1={x} y1={y} x2={x + j * N * hossz} y2={y} szin={ZOLD} hegy="ih-zold" />);
  if (V) el.push(<Nyil key="v" x1={x} y1={y} x2={x} y2={y + j * V * hossz} szin={KEK} hegy="ih-kek" />);
  if (M) {
    // pozitív M: a nyíl a pozitív oldalról indul; alul pozitív + bal rész → ↶ (a bal rész jobb végén); jobb rész → ↷
    const ccw = (oldal === "bal") === (pozitivOldal === "alul") ? 1 : -1;
    const irany = ccw * M;
    const r = 15;
    // az ív a keresztmetszet külső oldalán (j = 1: jobbra néző félkör), a pozitív oldalról indítva
    const d = irany === 1
      ? (j === 1 ? `M ${x} ${y + r} A ${r} ${r} 0 0 0 ${x} ${y - r}` : `M ${x} ${y - r} A ${r} ${r} 0 0 0 ${x} ${y + r}`)
      : (j === 1 ? `M ${x} ${y - r} A ${r} ${r} 0 0 1 ${x} ${y + r}` : `M ${x} ${y + r} A ${r} ${r} 0 0 1 ${x} ${y - r}`);
    el.push(<path key="m" d={d} fill="none" stroke={BORDO} strokeWidth="2.4" markerEnd="url(#ih-bordo)" />);
  }
  if (cimkek) {
    if (N) el.push(<T key="tn" x={x + j * (N * hossz + 12)} y={y + 4} szin={ZOLD} vastag>N{index}</T>);
    if (V) el.push(<T key="tv" x={x + j * 12} y={y + j * (V * hossz + 12) + 4} szin={KEK} vastag>V{index}</T>);
    if (M) el.push(<T key="tm" x={x - j * 6} y={y - 22} szin={BORDO} vastag horgony={j === 1 ? "end" : "start"}>M{index}</T>);
  }
  return <g>{el}</g>;
}

/* ================================================================== */
/*  1. Belső erők definíciója (8.1. ábra)                              */
/* ================================================================== */

export function AbraBelsoErok() {
  // egy tört tengelyű tartó négy nézete 2×2-ben
  const Keret = ({ ox, oy, cim, mod }) => {
    const A = [ox + 30, oy + 130], P = [ox + 100, oy + 50], Q = [ox + 190, oy + 50], B = [ox + 250, oy + 130];
    const K = [(A[0] + P[0]) / 2, (A[1] + P[1]) / 2];
    // K keresztmetszet iránya (a rúd normálisa)
    const dx = P[0] - A[0], dy = P[1] - A[1], h = Math.hypot(dx, dy);
    const ux = dx / h, uy = dy / h; // rúd irány
    const nx = -uy, ny = ux; // merőleges
    const F1 = [A[0] + ux * 22, A[1] + uy * 22];
    const vag = mod !== "a" && mod !== "b";
    const res = 8; // rés a vágásnál
    return (
      <g>
        <Cim x={ox + 8} y={oy}>{cim}</Cim>
        {/* rudak */}
        {vag ? (
          <>
            <Tarto x1={A[0]} y1={A[1]} x2={K[0] - ux * res} y2={K[1] - uy * res} vastag={5} />
            <Tarto x1={K[0] + ux * res} y1={K[1] + uy * res} x2={P[0]} y2={P[1]} vastag={5} />
          </>
        ) : (
          <Tarto x1={A[0]} y1={A[1]} x2={P[0]} y2={P[1]} vastag={5} />
        )}
        <Tarto x1={P[0]} y1={P[1]} x2={Q[0]} y2={Q[1]} vastag={5} />
        <Tarto x1={Q[0]} y1={Q[1]} x2={B[0]} y2={B[1]} vastag={5} />
        {/* K jel */}
        {!vag && <line x1={K[0] - nx * 9} y1={K[1] - ny * 9} x2={K[0] + nx * 9} y2={K[1] + ny * 9} stroke="#334155" strokeWidth="2" />}
        {mod !== "d" && <T x={K[0] + nx * 16 + 8} y={K[1] + ny * 16 + 4} dolt vastag>K</T>}
        {/* terhek */}
        <Nyil x1={F1[0] + nx * 44} y1={F1[1] + ny * 44} x2={F1[0]} y2={F1[1]} />
        <T x={F1[0] + nx * 50 - 4} y={F1[1] + ny * 50 - 4} szin={SZIN.teher} vastag horgony="end">F₁</T>
        <Nyil x1={Q[0]} y1={Q[1] - 38} x2={Q[0]} y2={Q[1]} />
        <T x={Q[0] + 12} y={Q[1] - 26} szin={SZIN.teher} vastag horgony="start">F₂</T>
        {/* támaszok vagy reakciók */}
        {mod === "a" ? (
          <>
            <Csuklo x={A[0]} y={A[1]} meret={13} />
            <Gorgo x={B[0]} y={B[1]} meret={13} />
          </>
        ) : (
          <>
            <Nyil x1={A[0] - 16} y1={A[1] + 40} x2={A[0]} y2={A[1]} szin={SZIN.reakcio} hegy="th-reakcio" />
            <Nyil x1={B[0]} y1={B[1] + 40} x2={B[0]} y2={B[1]} szin={SZIN.reakcio} hegy="th-reakcio" />
            <T x={A[0] - 20} y={A[1] + 52} szin={SZIN.reakcio} vastag>A</T>
            <T x={B[0] + 12} y={B[1] + 52} szin={SZIN.reakcio} vastag>B</T>
          </>
        )}
        <TamaszCimke x={A[0] - 16} y={A[1] + 6}>A</TamaszCimke>
        <TamaszCimke x={B[0] + 16} y={B[1] + 6}>B</TamaszCimke>
        {/* c) befogások a vágásnál */}
        {mod === "c" && (
          <>
            <g transform={`rotate(${(Math.atan2(uy, ux) * 180) / Math.PI} ${K[0] - ux * res} ${K[1] - uy * res})`}>
              <Befogas x={K[0] - ux * res} y={K[1] - uy * res} irany="jobb" hossz={26} />
            </g>
            <g transform={`rotate(${(Math.atan2(uy, ux) * 180) / Math.PI} ${K[0] + ux * res} ${K[1] + uy * res})`}>
              <Befogas x={K[0] + ux * res} y={K[1] + uy * res} irany="bal" hossz={26} />
            </g>
          </>
        )}
        {/* d) belső erők a két rúdvégen: erő + nyomaték mindkét oldalon, ellentett értelemben */}
        {mod === "d" && (
          <>
            {/* a bal rész végén: erő a rúdra kb. merőlegesen fel-balra, nyomaték ↶; a jobb rész elején az ellentettek */}
            <Nyil x1={K[0] - ux * res} y1={K[1] - uy * res} x2={K[0] - ux * res - nx * 34} y2={K[1] - uy * res - ny * 34} szin="#7c3aed" hegy="th-reakcio" />
            <Nyil x1={K[0] + ux * res} y1={K[1] + uy * res} x2={K[0] + ux * res + nx * 34} y2={K[1] + uy * res + ny * 34} szin="#7c3aed" hegy="th-reakcio" />
            <KoncentraltNyomatek x={K[0] - ux * (res + 16)} y={K[1] - uy * (res + 16)} r={11} irany={1} szin="#7c3aed" />
            <KoncentraltNyomatek x={K[0] + ux * (res + 16)} y={K[1] + uy * (res + 16)} r={11} irany={-1} szin="#7c3aed" />
            <T x={K[0] - nx * 46 - 10} y={K[1] - ny * 46 + 4} szin="#7c3aed" meret={11} vastag horgony="end">Kb</T>
            <T x={K[0] + nx * 46 + 10} y={K[1] + ny * 46 + 4} szin="#7c3aed" meret={11} vastag horgony="start">Kj</T>
          </>
        )}
      </g>
    );
  };
  return (
    <svg viewBox="0 0 600 452" className="abra w-full h-auto">
      <TartoHegyek />
      <Hegyek />
      <Keret ox={10} oy={20} cim="a) a szerkezet és a K keresztmetszet" mod="a" />
      <Keret ox={310} oy={20} cim="b) az összes külső erő egyensúlyban" mod="b" />
      <Keret ox={10} oy={222} cim="c) K-ban elvágva, befogásokkal pótolva" mod="c" />
      <Keret ox={310} oy={222} cim="d) a két rész a belső erőkkel" mod="d" />
      <Magyarazat y={426} sorok={[
        "A vágás két oldalán egy-egy erő és egy nyomaték ébred (Kb és Kj): egymás ellentettjei.",
        "Mindkét tartórész külön-külön egyensúlyban van a külső és a belső erőkkel együtt.",
      ]} />
    </svg>
  );
}

/* ================================================================== */
/*  2. Az igénybevételek előjele (8.2. ábra b–d)                       */
/* ================================================================== */

export function AbraElojel() {
  const Y = 96;
  const Par = ({ ox, cim, pozitivOldal, N, V, M, sorok }) => (
    <g>
      <Cim x={ox} y={26}>{cim}</Cim>
      {/* bal rész */}
      <Tarto x1={ox + 6} y1={Y} x2={ox + 62} y2={Y} vastag={7} />
      <line x1={ox + 62} y1={Y - 12} x2={ox + 62} y2={Y + 12} stroke="#334155" strokeWidth="2" />
      <BelsoErok x={ox + 62} y={Y} oldal="bal" N={N} V={V} M={M} pozitivOldal={pozitivOldal} index="ₖ" hossz={30} />
      {/* jobb rész */}
      <Tarto x1={ox + 188} y1={Y} x2={ox + 244} y2={Y} vastag={7} />
      <line x1={ox + 188} y1={Y - 12} x2={ox + 188} y2={Y + 12} stroke="#334155" strokeWidth="2" />
      <BelsoErok x={ox + 188} y={Y} oldal="jobb" N={N} V={V} M={M} pozitivOldal={pozitivOldal} index="ₖ" hossz={30} />
      <T x={ox + 30} y={Y + 22} meret={11} szin="#475569">bal rész</T>
      <T x={ox + 220} y={Y + 22} meret={11} szin="#475569">jobb rész</T>
      {M ? (
        <>
          <T x={ox + 125} y={Y + (pozitivOldal === "alul" ? 34 : -34)} szin={BORDO} meret={13} vastag>+ (húzott)</T>
          <T x={ox + 125} y={Y + (pozitivOldal === "alul" ? -30 : 38)} szin="#64748b" meret={13} vastag>−</T>
        </>
      ) : null}
      {sorok.map((s, i) => <T key={i} x={ox + 125} y={160 + i * 14} meret={11} szin="#475569">{s}</T>)}
    </g>
  );
  return (
    <svg viewBox="0 0 600 370" className="abra w-full h-auto">
      <TartoHegyek />
      <Hegyek />
      <Par ox={20} cim="b) pozitív N és V a két tartórészen" pozitivOldal="alul" N={1} V={1} M={0}
        sorok={["N: a keresztmetszetből kifelé mutat (húz).", "V: az N iránya 90°-kal elforgatva", "az óramutató járása szerint.", "A két részen ellentett nyilak,", "de az előjel ugyanaz."]} />
      <Par ox={330} cim="c) pozitív M, ha az alsó oldal a pozitív" pozitivOldal="alul" N={0} V={0} M={1}
        sorok={["A félköríves nyilat a pozitív (húzott)", "oldalról indítjuk, kívülről rárajzolva.", "Bal részen ↶, jobb részen ↷.", "Ez a lelógó kötél alakja: alul húzott."]} />
      <g transform="translate(0 226)">
        <Cim x={330} y={26}>d) ha a felső oldal a pozitív</Cim>
        <Tarto x1={340} y1={Y} x2={396} y2={Y} vastag={7} />
        <line x1={396} y1={Y - 12} x2={396} y2={Y + 12} stroke="#334155" strokeWidth="2" />
        <BelsoErok x={396} y={Y} oldal="bal" N={0} V={0} M={1} pozitivOldal="felul" index="ₖ" />
        <Tarto x1={518} y1={Y} x2={574} y2={Y} vastag={7} />
        <line x1={518} y1={Y - 12} x2={518} y2={Y + 12} stroke="#334155" strokeWidth="2" />
        <BelsoErok x={518} y={Y} oldal="jobb" N={0} V={0} M={1} pozitivOldal="felul" index="ₖ" />
        <T x={457} y={Y - 30} szin={BORDO} meret={13} vastag>+ (húzott)</T>
        <T x={457} y={Y + 36} szin="#64748b" meret={13} vastag>−</T>
      </g>
      <g transform="translate(0 226)">
        <Cim x={20} y={26}>A szabály röviden</Cim>
        {["N: kifelé = húzás = pozitív.", "V: N-t 90°-kal az óramutató szerint forgatva.", "M: a nyilat a pozitív oldalról indítjuk;", "vízszintes rúdnál az alsó oldal a pozitív,", "így az M ábra a húzott oldalra kerül.", "A b és j indexet ezért elhagyhatjuk."].map((s, i) => (
          <T key={i} x={20} y={48 + i * 15} meret={11.5} szin="#334155" horgony="start">{s}</T>
        ))}
      </g>
    </svg>
  );
}

/* ================================================================== */
/*  3. A K keresztmetszet két oldala (8.3. ábra)                       */
/* ================================================================== */

export function AbraKetOldal() {
  const Y = 90, XA = 60, XB = 540, XK = 300, XF = 170;
  const res = 62;
  return (
    <svg viewBox="0 0 600 350" className="abra w-full h-auto">
      <TartoHegyek />
      <Hegyek />
      <Cim x={12} y={22}>a) az egész tartó: (Fb, Rb, Fj, Rj) ≐ O</Cim>
      <Tarto x1={XA} y1={Y} x2={XB} y2={Y} />
      <Csuklo x={XA} y={Y} />
      <Gorgo x={XB} y={Y} />
      <TeherNyil x={XF} y={Y} hossz={50} cimke="F" cimkeEltolas={[8, -4]} />
      <TeherNyil x={450} y={Y} hossz={50} cimke="F′" cimkeEltolas={[8, -4]} />
      <ReakcioNyil x={XA} y={Y} hossz={42} szog={90} cimke="A" cimkeEltolas={[8, 8]} />
      <ReakcioNyil x={XB} y={Y} hossz={42} szog={90} cimke="B" cimkeEltolas={[8, 8]} />
      <line x1={XK} y1={Y - 16} x2={XK} y2={Y + 16} stroke="#334155" strokeWidth="2" strokeDasharray="4 3" />
      <T x={XK} y={Y - 22} dolt vastag>K</T>
      <T x={170} y={Y + 46} meret={11.5} szin="#475569">(Fb, Rb): a K-tól balra ható erők</T>
      <T x={430} y={Y + 46} meret={11.5} szin="#475569">(Fj, Rj): a K-tól jobbra ható erők</T>

      {/* b) bal rész */}
      <g transform="translate(0 152)">
        <Cim x={12} y={22}>b) bal rész: (Fb, Rb, NKb, VKb, MKb) ≐ O</Cim>
        <Tarto x1={XA} y1={Y} x2={XK - res} y2={Y} />
        <line x1={XK - res} y1={Y - 12} x2={XK - res} y2={Y + 12} stroke="#334155" strokeWidth="2" />
        <TeherNyil x={XF} y={Y} hossz={44} cimke="F" cimkeEltolas={[8, -2]} />
        <ReakcioNyil x={XA} y={Y} hossz={40} szog={90} cimke="A" cimkeEltolas={[8, 8]} />
        <BelsoErok x={XK - res} y={Y} oldal="bal" index="ₖ" hossz={30} />
        {/* jobb rész */}
        <Tarto x1={XK + res} y1={Y} x2={XB} y2={Y} />
        <line x1={XK + res} y1={Y - 12} x2={XK + res} y2={Y + 12} stroke="#334155" strokeWidth="2" />
        <TeherNyil x={450} y={Y} hossz={44} cimke="F′" cimkeEltolas={[8, -2]} />
        <ReakcioNyil x={XB} y={Y} hossz={40} szog={90} cimke="B" cimkeEltolas={[8, 8]} />
        <BelsoErok x={XK + res} y={Y} oldal="jobb" index="ₖ" hossz={30} />
        <Cim x={318} y={22}>c) jobb rész: (Fj, Rj, NKj, VKj, MKj) ≐ O</Cim>
      </g>
      <Magyarazat y={312} sorok={[
        "A (8.5) átalakítás: (NKb, VKb, MKb) ≐ (Fj, Rj) — a bal rész igénybevételei egyenértékűek",
        "a JOBB oldal összes erejével, és fordítva. Elég az egyik oldal erőit a K pontba redukálni.",
      ]} />
    </svg>
  );
}

/* ================================================================== */
/*  4. Igénybevétel számítása egy keresztmetszetben (8.4.a ábra)       */
/* ================================================================== */

export function AbraSzamitas() {
  const e = eredmeny("tk84a");
  return (
    <Diagram eredmeny={e} abrak={[]} meretek gyerekek={({ g, szerkFent }) => {
      const Y = szerkFent, k1 = g.kx(1.5), k2 = g.kx(3);
      return (
        <g>
          {[[k1, "K₁"], [k2, "K₂"]].map(([x, n]) => (
            <g key={n}>
              <line x1={x} y1={Y - 16} x2={x} y2={Y + 16} stroke="#334155" strokeWidth="2" strokeDasharray="4 3" />
              <T x={x} y={Y - 22} dolt vastag>{n}</T>
            </g>
          ))}
          <T x={g.kx(3.7)} y={Y + 18} szin={BORDO} meret={14} vastag>+</T>
          <T x={g.kx(3.7)} y={Y - 12} szin="#64748b" meret={14} vastag>−</T>
        </g>
      );
    }} />
  );
}

/* ================================================================== */
/*  5. A ferde keresztmetszet „virága” (8.5.b ábra)                    */
/* ================================================================== */

export function AbraVirag() {
  const cx = 300, cy = 150, r = 110;
  const a = Math.atan2(3, 4); // tg α = 3/4
  const c = Math.cos(a), s = Math.sin(a);
  const rad = (f) => (f * Math.PI) / 180;
  const iv = (fok1, fok2, R, szin) => {
    const x1 = cx + R * Math.cos(rad(fok1)), y1 = cy - R * Math.sin(rad(fok1));
    const x2 = cx + R * Math.cos(rad(fok2)), y2 = cy - R * Math.sin(rad(fok2));
    return <path d={`M ${x1} ${y1} A ${R} ${R} 0 0 0 ${x2} ${y2}`} fill="none" stroke={szin} strokeWidth="1.4" />;
  };
  const alfa = (a * 180) / Math.PI;
  return (
    <svg viewBox="0 0 600 330" className="abra w-full h-auto">
      <TartoHegyek />
      <Hegyek />
      {/* koordinátatengelyek */}
      <line x1={cx - r - 30} y1={cy} x2={cx + r + 30} y2={cy} stroke="#94a3b8" strokeWidth="1.2" />
      <line x1={cx} y1={cy + r + 20} x2={cx} y2={cy - r - 20} stroke="#94a3b8" strokeWidth="1.2" />
      <T x={cx + r + 36} y={cy + 4} szin="#64748b" dolt>x</T>
      <T x={cx + 10} y={cy - r - 22} szin="#64748b" dolt>y</T>
      {/* tartó tengelye */}
      <line x1={cx - r * c} y1={cy + r * s} x2={cx + r * c} y2={cy - r * s} stroke={SZIN.tarto} strokeWidth="5" strokeLinecap="round" />
      <T x={cx + (r + 16) * c} y={cy - (r + 16) * s + 4} vastag>tengely</T>
      {/* N (a tengely mentén) és V (rá merőlegesen) irányok */}
      <Nyil x1={cx} y1={cy} x2={cx + 60 * c} y2={cy - 60 * s} szin={ZOLD} hegy="ih-zold" />
      <T x={cx + 74 * c + 8} y={cy - 74 * s + 12} szin={ZOLD} vastag>+N</T>
      <Nyil x1={cx} y1={cy} x2={cx + 60 * s} y2={cy + 60 * c} szin={KEK} hegy="ih-kek" />
      <T x={cx + 76 * s + 10} y={cy + 76 * c + 4} szin={KEK} vastag>+V</T>
      {/* szögek */}
      {iv(0, alfa, 40, ZOLD)}
      <T x={cx + 52 * Math.cos(rad(alfa / 2))} y={cy - 52 * Math.sin(rad(alfa / 2)) + 4} szin={ZOLD} dolt>α</T>
      {iv(-90, -90 + alfa, 40, KEK)}
      <T x={cx + 52 * Math.cos(rad(-90 + alfa / 2))} y={cy - 52 * Math.sin(rad(-90 + alfa / 2)) + 4} szin={KEK} dolt>α</T>
      {iv(alfa, 90, 62, "#94a3b8")}
      <T x={cx + 74 * Math.cos(rad((alfa + 90) / 2))} y={cy - 74 * Math.sin(rad((alfa + 90) / 2)) + 4} szin="#64748b" dolt>90°−α</T>
      {/* a vetületek: egy függőleges F felbontása */}
      <Nyil x1={cx - 70 * c} y1={cy + 70 * s - 80} x2={cx - 70 * c} y2={cy + 70 * s} szin={SZIN.teher} />
      <T x={cx - 70 * c - 12} y={cy + 70 * s - 60} szin={SZIN.teher} vastag horgony="end">F</T>
      <Nyil x1={cx - 70 * c} y1={cy + 70 * s} x2={cx - 70 * c + 48 * s} y2={cy + 70 * s + 48 * c} szin={KEK} hegy="ih-kek" vastag={2} />
      <Nyil x1={cx - 70 * c} y1={cy + 70 * s} x2={cx - 70 * c - 36 * c} y2={cy + 70 * s + 36 * s} szin={ZOLD} hegy="ih-zold" vastag={2} />
      <T x={cx - 70 * c + 48 * s + 14} y={cy + 70 * s + 48 * c + 12} szin={KEK} meret={11} vastag>F·cos α</T>
      <T x={cx - 70 * c - 36 * c - 12} y={cy + 70 * s + 36 * s + 14} szin={ZOLD} meret={11} vastag>F·sin α</T>
      <Magyarazat y={290} sorok={[
        "tg α = 3/4 → sin α = 0,6, cos α = 0,8. Függőleges erő: merőleges komponense F·cos α,",
        "tengelyirányú F·sin α; vízszintes erőnél fordítva. A „virág” a merőleges szárú szögek miatt működik.",
      ]} />
    </svg>
  );
}

/* ================================================================== */
/*  6. Igénybevételi függvények → ábrák (8.8–8.9. ábra)                */
/* ================================================================== */

export function AbraFuggvenyek() {
  const e = eredmeny("tk88");
  return <Diagram eredmeny={e} meretek reakciok={false} amp={36} />;
}

/* ================================================================== */
/*  7. Elemi rúdszakasz (8.10. ábra)                                   */
/* ================================================================== */

export function AbraElemiDarab() {
  const x1 = 200, x2 = 400, yt = 90, yb = 180, ym = (yt + yb) / 2;
  return (
    <svg viewBox="0 0 600 330" className="abra w-full h-auto">
      <TartoHegyek />
      <Hegyek />
      <rect x={x1} y={yt} width={x2 - x1} height={yb - yt} fill="#f8fafc" stroke="#1d3c48" strokeWidth="2" />
      <line x1={x1} y1={ym} x2={x2} y2={ym} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 3" />
      {/* megoszló terhek */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
        const x = x1 + 12 + i * 22;
        return <line key={i} x1={x} y1={yt - 34} x2={x} y2={yt - 2} stroke={SZIN.teher} strokeWidth="1.5" markerEnd="url(#th-teher)" />;
      })}
      <line x1={x1 + 8} y1={yt - 34} x2={x2 - 8} y2={yt - 34} stroke={SZIN.teher} strokeWidth="1.4" />
      <T x={300} y={yt - 40} szin={SZIN.teher} vastag dolt>q(x)</T>
      <Nyil x1={x1 + 30} y1={ym + 22} x2={x1 + 70} y2={ym + 22} vastag={2} />
      <Nyil x1={x1 + 110} y1={ym + 22} x2={x1 + 150} y2={ym + 22} vastag={2} />
      <T x={300} y={ym + 40} szin={SZIN.teher} vastag dolt>p(x)</T>
      {/* bal oldal: N, V, M */}
      <Nyil x1={x1} y1={ym} x2={x1 - 50} y2={ym} szin={ZOLD} hegy="ih-zold" />
      <T x={x1 - 58} y={ym + 4} szin={ZOLD} vastag horgony="end">N(x)</T>
      <Nyil x1={x1 - 14} y1={ym} x2={x1 - 14} y2={ym - 58} szin={KEK} hegy="ih-kek" />
      <T x={x1 - 22} y={ym - 62} szin={KEK} vastag horgony="end">V(x)</T>
      <path d={`M ${x1 - 26} ${ym + 30} A 30 30 0 0 1 ${x1 - 26} ${ym - 30}`} fill="none" stroke={BORDO} strokeWidth="2.4" markerEnd="url(#ih-bordo)" />
      <T x={x1 - 60} y={ym + 50} szin={BORDO} vastag horgony="end">M(x)</T>
      {/* jobb oldal: N+dN, V+dV, M+dM */}
      <Nyil x1={x2} y1={ym} x2={x2 + 50} y2={ym} szin={ZOLD} hegy="ih-zold" />
      <T x={x2 + 58} y={ym + 4} szin={ZOLD} vastag horgony="start">N(x) + dN</T>
      <Nyil x1={x2 + 14} y1={ym} x2={x2 + 14} y2={ym + 58} szin={KEK} hegy="ih-kek" />
      <T x={x2 + 22} y={ym + 70} szin={KEK} vastag horgony="start">V(x) + dV</T>
      <path d={`M ${x2 + 26} ${ym + 30} A 30 30 0 0 0 ${x2 + 26} ${ym - 30}`} fill="none" stroke={BORDO} strokeWidth="2.4" markerEnd="url(#ih-bordo)" />
      <T x={x2 + 60} y={ym - 40} szin={BORDO} vastag horgony="start">M(x) + dM</T>
      {/* dx méret */}
      <Meret x1={x1} x2={x2} y={yb + 30} cimke="dx" />
      <T x={x1} y={yb + 52} szin="#64748b" meret={11}>x</T>
      <T x={x2} y={yb + 52} szin="#64748b" meret={11}>x + dx</T>
      <Magyarazat y={288} sorok={[
        "A dx hosszú darab egyensúlyban van. Bal oldalon a pozitív igénybevételek (a jobb részre ható",
        "értelemben), jobb oldalon ugyanezek elemi növekménnyel; a teher dx-en egyenletesnek vehető.",
      ]} />
    </svg>
  );
}

/* ================================================================== */
/*  8. A teher és az ábrák jellege — három mintapélda                  */
/* ================================================================== */

const JELLEG_MODELLEK = [
  {
    cim: "Koncentrált erő: V ugrik, M törik",
    modell: {
      csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "B", x: 6, y: 0 }],
      rudak: [{ id: "1", a: "A", b: "B" }],
      tamaszok: [{ csomopont: "A", tipus: "csuklo" }, { csomopont: "B", tipus: "gorgo", szog: 90 }],
      terhek: [{ fajta: "pontTeher", rud: "1", a: 2, F: -12, irany: "y" }],
    },
  },
  {
    cim: "Egyenletes teher: V lineáris, M parabola",
    modell: {
      csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "B", x: 6, y: 0 }],
      rudak: [{ id: "1", a: "A", b: "B" }],
      tamaszok: [{ csomopont: "A", tipus: "csuklo" }, { csomopont: "B", tipus: "gorgo", szog: 90 }],
      terhek: [{ fajta: "megoszlo", rud: "1", p1: -4, irany: "y" }],
    },
  },
  {
    cim: "Koncentrált nyomaték: V folytonos, M ugrik",
    modell: {
      csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "B", x: 6, y: 0 }],
      rudak: [{ id: "1", a: "A", b: "B" }],
      tamaszok: [{ csomopont: "A", tipus: "csuklo" }, { csomopont: "B", tipus: "gorgo", szog: 90 }],
      terhek: [{ fajta: "pontNyomatek", rud: "1", a: 2, M: -18 }],
    },
  },
];

export function AbraJellegek() {
  return (
    <div className="grid gap-3 sm:grid-cols-3 [&>*]:min-w-0">
      {JELLEG_MODELLEK.map(({ cim, modell }) => {
        const e = elemez(modell);
        return (
          <div key={cim} className="rounded-xl bg-white/70 p-2 ring-1 ring-petrol-100">
            <p className="mb-1 text-center text-[11.5px] font-semibold text-petrol-700">{cim}</p>
            <Diagram eredmeny={e} abrak={["V", "M"]} szel={300} amp={30} nevek={false} reakciok={false} csomopontCimkek={false} />
          </div>
        );
      })}
    </div>
  );
}

/* ================================================================== */
/*  9. A parabola belógása: ql²/8                                      */
/* ================================================================== */

export function AbraParabola() {
  // szakasz: l = 4 m, q = 4 kN/m, végponti nyomatékok M1 = −8, M2 = −4 (felül húzott végek), alul pozitív
  const l = 4, q = 4, M1 = -8, M2 = -4;
  const X1 = 90, X2 = 470, Y = 100, L = (X2 - X1) / l, lep = 7; // px / kNm
  const kx = (x) => X1 + x * L;
  const ky = (Mv) => Y + Mv * lep; // pozitív lefelé
  const Mf = (x) => M1 + ((M2 - M1) * x) / l + (q * x * (l - x)) / 2;
  const pts = [];
  for (let i = 0; i <= 40; i++) { const x = (l * i) / 40; pts.push(`${kx(x)},${ky(Mf(x))}`); }
  const hurKozep = (M1 + M2) / 2;
  const belog = (q * l * l) / 8;
  const xm = kx(l / 2);
  return (
    <svg viewBox="0 0 600 340" className="abra w-full h-auto">
      <TartoHegyek />
      <Hegyek />
      <Cim x={12} y={22}>Egyenletes teher alatt: M parabola, belógása ql²/8 = {ert(belog)} kNm (q = 4 kN/m, l = 4 m)</Cim>
      {/* tengely és teher */}
      <line x1={X1} y1={Y} x2={X2} y2={Y} stroke={SZIN.tarto} strokeWidth="3" />

      {/* parabola és sraffozás */}
      <polygon points={`${X1},${Y} ${pts.join(" ")} ${X2},${Y}`} fill={BORDO} fillOpacity="0.1" />
      <polyline points={pts.join(" ")} fill="none" stroke={BORDO} strokeWidth="2.4" />
      <T x={X1 - 8} y={ky(M1) + 4} szin={BORDO} vastag horgony="end">M₁ = −8</T>
      <T x={X2 + 8} y={ky(M2) + 4} szin={BORDO} vastag horgony="start">M₂ = −4</T>
      {/* húr */}
      <line x1={X1} y1={ky(M1)} x2={X2} y2={ky(M2)} stroke="#64748b" strokeWidth="1.3" strokeDasharray="5 4" />
      <T x={xm + 60} y={ky(hurKozep) - 8} szin="#64748b" meret={11}>szerkesztővonal (húr)</T>
      {/* belógás */}
      <Nyil x1={xm} y1={ky(hurKozep)} x2={xm} y2={ky(hurKozep + belog)} szin="#1d3c48" hegy="ih-sotet" vastag={2} />
      <T x={xm + 8} y={ky(hurKozep + belog / 2) + 4} vastag horgony="start">ql²/8</T>
      <circle cx={xm} cy={ky(hurKozep + belog)} r="4" fill={BORDO} stroke="white" strokeWidth="1.5" />
      <T x={xm - 8} y={ky(hurKozep + belog) + 14} szin={BORDO} vastag horgony="end">M(l/2) = {ert(hurKozep + belog)}</T>
      {/* érintők metszéspontja: még egyszer ql²/8 lejjebb */}
      <line x1={xm} y1={ky(hurKozep + belog)} x2={xm} y2={ky(hurKozep + 2 * belog)} stroke="#1d3c48" strokeWidth="1.2" strokeDasharray="3 3" />
      <line x1={X1} y1={ky(M1)} x2={xm} y2={ky(hurKozep + 2 * belog)} stroke="#0e7490" strokeWidth="1.2" strokeDasharray="6 3" />
      <line x1={X2} y1={ky(M2)} x2={xm} y2={ky(hurKozep + 2 * belog)} stroke="#0e7490" strokeWidth="1.2" strokeDasharray="6 3" />
      <circle cx={xm} cy={ky(hurKozep + 2 * belog)} r="3.5" fill="#0e7490" />
      <T x={xm + 8} y={ky(hurKozep + 2 * belog) + 4} szin="#0e7490" meret={11.5} vastag horgony="start">végponti érintők metszéspontja: még egy ql²/8</T>
      {/* középső érintő */}
      <line x1={xm - 70} y1={ky(hurKozep + belog) - 70 * ((M2 - M1) / l) * (lep / L)} x2={xm + 70} y2={ky(hurKozep + belog) + 70 * ((M2 - M1) / l) * (lep / L)} stroke="#0e7490" strokeWidth="1.2" strokeDasharray="6 3" />
      <Magyarazat y={286} sorok={[
        "Recept: a két végponti nyomatékot összekötjük; a húr felezőpontjából a teher irányába felmérjük",
        "a ql²/8 belógást — ez a parabola középső pontja, érintője párhuzamos a húrral. Még egyszer ql²/8-at",
        "felmérve a végponti érintők metszéspontját kapjuk. Ferde rúdnál l a ferde hossz, q a merőleges komponens.",
      ]} />
    </svg>
  );
}

/* ================================================================== */
/*  10. Nyomatéki ábra a sarokban (8.11. ábra)                         */
/* ================================================================== */

const SAROK_MODELLEK = [
  {
    cim: "L konzol, vízszintes erő",
    modell: {
      csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "C", x: 0, y: 3 }, { id: "D", x: 3, y: 3 }],
      rudak: [{ id: "1", a: "A", b: "C" }, { id: "2", a: "C", b: "D" }],
      tamaszok: [{ csomopont: "A", tipus: "befogas" }],
      terhek: [{ fajta: "csomopontiEro", csomopont: "D", Fy: -6 }, { fajta: "csomopontiEro", csomopont: "C", Fx: 4 }],
    },
  },
  {
    cim: "Keret (H10/3), teher a gerendán",
    modell: {
      csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "C", x: 0, y: 3 }, { id: "D", x: 3, y: 3 }, { id: "E", x: 6, y: 3 }, { id: "B", x: 6, y: 0 }],
      rudak: [{ id: "1", a: "A", b: "C" }, { id: "2", a: "C", b: "D" }, { id: "3", a: "D", b: "E" }, { id: "4", a: "E", b: "B" }],
      tamaszok: [{ csomopont: "A", tipus: "csuklo" }, { csomopont: "B", tipus: "gorgo", szog: 90 }],
      terhek: [{ fajta: "megoszlo", rud: "3", p1: -4, irany: "y" }],
    },
  },
  {
    cim: "Ferde + vízszintes szakasz (H10/1)",
    modell: {
      csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "C", x: 3, y: 2 }, { id: "B", x: 6, y: 2 }],
      rudak: [{ id: "1", a: "A", b: "C" }, { id: "2", a: "C", b: "B" }],
      tamaszok: [{ csomopont: "A", tipus: "csuklo" }, { csomopont: "B", tipus: "gorgo", szog: 90 }],
      terhek: [{ fajta: "megoszlo", rud: "2", p1: -4, irany: "y" }],
    },
  },
];

export function AbraSarok() {
  return (
    <div className="grid gap-3 sm:grid-cols-3 [&>*]:min-w-0">
      {SAROK_MODELLEK.map(({ cim, modell }) => {
        const e = elemez(modell);
        return (
          <div key={cim} className="rounded-xl bg-white/70 p-2 ring-1 ring-petrol-100">
            <p className="mb-1 text-center text-[11.5px] font-semibold text-petrol-700">{cim}</p>
            <Diagram eredmeny={e} abrak={["M"]} szel={300} amp={26} nevek={false} reakciok={false} csomopontCimkek={false} teherCimkek={false} cimkek={false} />
          </div>
        );
      })}
    </div>
  );
}

/** A sarok két csonkjára ható nyomatékok: egyenlő nagyság, mindkettő a sarok azonos (külső vagy belső) oldaláról indul. */
export function AbraSarokCsonk() {
  const Sarok = ({ ox, oy, kivul, cim }) => {
    // csonkok: függőleges (lentről) és vízszintes (jobbra), a sarok az (ox, oy)
    const r = 16;
    return (
      <g>
        <Cim x={ox - 60} y={oy - 70}>{cim}</Cim>
        <Tarto x1={ox} y1={oy + 96} x2={ox} y2={oy + 40} vastag={7} />
        <Tarto x1={ox + 40} y1={oy} x2={ox + 96} y2={oy} vastag={7} />
        <line x1={ox} y1={oy + 40} x2={ox} y2={oy} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
        <line x1={ox} y1={oy} x2={ox + 40} y2={oy} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
        {/* a nyomatéki ábra (bordó sáv) a húzott oldalon */}
        <rect x={kivul ? ox - 18 : ox + 4} y={oy + 40} width={14} height={56} fill={BORDO} fillOpacity="0.18" stroke={BORDO} strokeWidth="1" />
        <rect x={ox + 40} y={kivul ? oy - 18 : oy + 4} width={56} height={14} fill={BORDO} fillOpacity="0.18" stroke={BORDO} strokeWidth="1" />
        {/* a csonkokra ható nyomatékok a csonkok sarok felőli végén: a nyíl a húzott oldalról indul */}
        {kivul ? (
          <>
            <path d={`M ${ox - r} ${oy + 40} A ${r} ${r} 0 0 1 ${ox + r} ${oy + 40}`} fill="none" stroke={BORDO} strokeWidth="2.4" markerEnd="url(#ih-bordo)" />
            <path d={`M ${ox + 40} ${oy - r} A ${r} ${r} 0 0 0 ${ox + 40} ${oy + r}`} fill="none" stroke={BORDO} strokeWidth="2.4" markerEnd="url(#ih-bordo)" />
          </>
        ) : (
          <>
            <path d={`M ${ox + r} ${oy + 40} A ${r} ${r} 0 0 0 ${ox - r} ${oy + 40}`} fill="none" stroke={BORDO} strokeWidth="2.4" markerEnd="url(#ih-bordo)" />
            <path d={`M ${ox + 40} ${oy + r} A ${r} ${r} 0 0 1 ${ox + 40} ${oy - r}`} fill="none" stroke={BORDO} strokeWidth="2.4" markerEnd="url(#ih-bordo)" />
          </>
        )}
        <T x={ox - 30} y={oy + 76} szin={BORDO} vastag horgony="end">M</T>
        <T x={ox + 76} y={oy - 26} szin={BORDO} vastag>M</T>
      </g>
    );
  };
  return (
    <svg viewBox="0 0 600 275" className="abra w-full h-auto">
      <TartoHegyek />
      <Hegyek />
      <Sarok ox={150} oy={100} kivul cim="a) az ábra a sarok külső oldalán" />
      <Sarok ox={420} oy={100} kivul={false} cim="b) az ábra a sarok belső oldalán" />
      <Magyarazat y={226} sorok={[
        "A sarok két csonkjára ható nyomaték egyenlő nagyságú, és ellentétesen forgat (egyensúly).",
        "A nyilat a húzott oldalról indítjuk: vagy mindkettő a konvex, vagy mindkettő a konkáv oldalról indul,",
        "ezért az ábra „befordul” a sarkon — a törés két oldalán ugyanazon az oldalon marad.",
      ]} />
    </svg>
  );
}

/* ================================================================== */
/*  11. Nyomatéki ábra egyensúlya az elágazásban (8.12. ábra)          */
/* ================================================================== */

export function AbraElagazas() {
  const cx = 300, cy = 118;
  const r = 15;
  return (
    <svg viewBox="0 0 600 270" className="abra w-full h-auto">
      <TartoHegyek />
      <Hegyek />
      <Cim x={12} y={22}>Elágazás: a csomópontba befutó ágakra leolvasott nyomatékok egyensúlya</Cim>
      {/* három ág: balra, jobbra, lefelé */}
      <Tarto x1={cx - 22} y1={cy} x2={cx - 120} y2={cy} vastag={7} />
      <Tarto x1={cx + 22} y1={cy} x2={cx + 120} y2={cy} vastag={7} />
      <Tarto x1={cx} y1={cy + 22} x2={cx} y2={cy + 90} vastag={7} />
      <circle cx={cx} cy={cy} r="5" fill={SZIN.tarto} />
      {/* nyomatéki ábrák: bal ág alul (pozitív), jobb ág alul, függőleges ág jobb oldalán */}
      <rect x={cx - 120} y={cy + 4} width={98} height={16} fill={BORDO} fillOpacity="0.18" stroke={BORDO} strokeWidth="1" />
      <rect x={cx + 22} y={cy + 4} width={98} height={10} fill={BORDO} fillOpacity="0.18" stroke={BORDO} strokeWidth="1" />
      <rect x={cx + 4} y={cy + 22} width={8} height={68} fill={BORDO} fillOpacity="0.18" stroke={BORDO} strokeWidth="1" />
      {/* nyilak a csonkokon: alulról indítva, kívülről */}
      <path d={`M ${cx - 26} ${cy + r} A ${r} ${r} 0 0 1 ${cx - 26} ${cy - r}`} fill="none" stroke={BORDO} strokeWidth="2.4" markerEnd="url(#ih-bordo)" />
      <T x={cx - 80} y={cy - 24} szin={BORDO} vastag>M₁ = 16</T>
      <path d={`M ${cx + 26} ${cy + r} A ${r} ${r} 0 0 0 ${cx + 26} ${cy - r}`} fill="none" stroke={BORDO} strokeWidth="2.4" markerEnd="url(#ih-bordo)" />
      <T x={cx + 80} y={cy - 24} szin={BORDO} vastag>M₂ = 10</T>
      <path d={`M ${cx + r} ${cy + 26} A ${r} ${r} 0 0 1 ${cx - r} ${cy + 26}`} fill="none" stroke={BORDO} strokeWidth="2.4" markerEnd="url(#ih-bordo)" />
      <T x={cx - 24} y={cy + 60} szin={BORDO} vastag horgony="end">M₃ = 6</T>
      <T x={cx + 130} y={cy + 50} meret={12.5} vastag horgony="start">|M₁| − |M₂| − |M₃| = 0</T>
      <T x={cx + 130} y={cy + 70} meret={11.5} szin="#475569" horgony="start">16 − 10 − 6 = 0 ✓</T>
      <Magyarazat y={236} sorok={[
        "A csomópontot kinagyítva minden ágra felrajzoljuk a leolvasott nyomatékot: a nyíl arról az",
        "oldalról indul, ahol az ábra van, a csomóponthoz képest kívülről; az egyensúly szemléletből adódik.",
      ]} />
    </svg>
  );
}

/* ================================================================== */
/*  12. Gerber-tartó ábrái (8.7. ábra) és a ferde tartó K7 (8.5.a)     */
/* ================================================================== */

export function AbraGerberElv() {
  const e = eredmeny("gyf7");
  return <Diagram eredmeny={e} abrak={["V", "M"]} amp={40} />;
}

export function AbraFerdeK7() {
  const e = eredmeny("tk85a");
  return (
    <Diagram eredmeny={e} abrak={["N", "V", "M"]} amp={30} meretek gyerekek={({ g, szerkFent }) => {
      const X = g.kx(4), Y = szerkFent + (4.5 - 3) * g.L;
      const c = 0.8, s = 0.6;
      return (
        <g>
          <line x1={X - s * 16} y1={Y - c * 16} x2={X + s * 16} y2={Y + c * 16} stroke="#334155" strokeWidth="2" strokeDasharray="4 3" />
          <T x={X + 16} y={Y + 26} dolt vastag>K₇</T>
        </g>
      );
    }} />
  );
}

/* ================================================================== */
/*  13. Konzol: kívülről számolunk (8.4.1)                             */
/* ================================================================== */

export function AbraKonzolIrany() {
  const Y = 96;
  return (
    <svg viewBox="0 0 600 216" className="abra w-full h-auto">
      <TartoHegyek />
      <Hegyek />
      <Cim x={12} y={22}>Konzolon a szabad vég felől haladunk — a reakciók nélkül is megy</Cim>
      <Befogas x={80} y={Y} irany="bal" hossz={50} />
      <Tarto x1={80} y1={Y} x2={520} y2={Y} />
      <TeherNyil x={300} y={Y} hossz={46} cimke="F" cimkeEltolas={[8, -2]} />
      <TeherNyil x={520} y={Y} hossz={46} cimke="F" cimkeEltolas={[8, -2]} />
      <Nyil x1={540} y1={Y + 40} x2={200} y2={Y + 40} szin="#0e7490" hegy="ih-kek" vastag={2.2} />
      <T x={370} y={Y + 58} szin="#0e7490" vastag>innen indulunk: a szabad végen N = V = M = 0,</T>
      <T x={370} y={Y + 73} szin="#0e7490" vastag>ha ott nincs koncentrált hatás</T>
      <T x={40} y={Y + 44} szin="#475569" meret={11} horgony="start">a befogásnál</T>
      <T x={40} y={Y + 58} szin="#475569" meret={11} horgony="start">az ábrák végértékei</T>
      <T x={40} y={Y + 72} szin="#475569" meret={11} horgony="start">= a reakciók</T>
      <Magyarazat y={196} sorok={["Balról befogott konzolon jobbról, jobbról befogotton balról, alul befogott oszlopon felülről számolunk."]} />
    </svg>
  );
}
