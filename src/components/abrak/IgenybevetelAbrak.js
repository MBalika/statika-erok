import { elemez, ertekek } from "@/lib/tarto";
import { TartoHegyek, Tarto, Gorgo, Csuklo, Befogas, TeherNyil, ReakcioNyil, Meret, MeretFugg, TamaszCimke } from "@/components/tartok/TartoElemek";
import { SZIN } from "@/components/tartok/szinek";
import Diagram, { SZINEK, ert } from "@/components/igenybevetel/Diagram";
import { eredmeny } from "@/components/igenybevetel/Modellek";

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
            {/* a nyomaték-párt saját ívvel rajzoljuk (a KoncentraltNyomatek hegye bordó lenne): a bal részen ↶, a jobbon ↷ */}
            {(() => {
              const r = 12;
              const cb = [K[0] - ux * (res + 16), K[1] - uy * (res + 16)];
              const cj = [K[0] + ux * (res + 16), K[1] + uy * (res + 16)];
              return (
                <>
                  {/* ↶: 3 órától a tetőn át 6 óráig (270°); ↷: 9 órától a tetőn át 6 óráig */}
                  <path d={`M ${cb[0] + r} ${cb[1]} A ${r} ${r} 0 1 0 ${cb[0]} ${cb[1] + r}`} fill="none" stroke="#7c3aed" strokeWidth="2.2" markerEnd="url(#th-reakcio)" />
                  <path d={`M ${cj[0] - r} ${cj[1]} A ${r} ${r} 0 1 1 ${cj[0]} ${cj[1] + r}`} fill="none" stroke="#7c3aed" strokeWidth="2.2" markerEnd="url(#th-reakcio)" />
                </>
              );
            })()}
            <T x={K[0] - nx * 46 - 10} y={K[1] - ny * 46 + 4} szin="#7c3aed" meret={11} vastag horgony="end">Kb</T>
            <T x={K[0] + nx * 46 + 10} y={K[1] + ny * 46 + 4} szin="#7c3aed" meret={11} vastag horgony="start">Kj</T>
            <T x={K[0] - nx * 46 - 10} y={K[1] - ny * 46 + 18} szin="#7c3aed" meret={10.5} horgony="end">erő + nyomaték</T>
            <T x={K[0] + nx * 46 + 10} y={K[1] + ny * 46 + 18} szin="#7c3aed" meret={10.5} horgony="start">az ellentettjei</T>
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
    <svg viewBox="0 0 600 384" className="abra w-full h-auto">
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
        {["N: kifelé = húzás = pozitív.", "V: N-t 90°-kal az óramutató szerint forgatva.", "M: a nyilat a pozitív oldalról indítjuk;", "vízszintes rúdnál az alsó oldal a pozitív,", "így az M ábra a húzott oldalra kerül.", "A b és j indexet ezért elhagyhatjuk.", "Az N és a V ábra pozitív értékeit is a pozitív", "(alsó) oldalra mérjük fel, mint az M-et."].map((s, i) => (
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
          {[[k1, "K₁", "x = 1,5 m"], [k2, "K₂", "x = 3,0 m"]].map(([x, n, h]) => (
            <g key={n}>
              <line x1={x} y1={Y - 16} x2={x} y2={Y + 16} stroke="#334155" strokeWidth="2" strokeDasharray="4 3" />
              <T x={x} y={Y - 22} dolt vastag>{n}</T>
              <T x={x} y={Y + 30} meret={10.5} szin="#475569">{h}</T>
            </g>
          ))}
          <T x={g.kx(3.7)} y={Y + 18} szin={BORDO} meret={14} vastag>+</T>
          <T x={g.kx(3.7)} y={Y - 12} szin="#64748b" meret={14} vastag>−</T>
          <T x={g.kx(3.7) + 14} y={Y + 18} meret={10.5} szin="#475569" horgony="start">pozitív oldal (alul)</T>
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
    <svg viewBox="0 0 600 350" className="abra w-full h-auto">
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
      <Magyarazat y={296} sorok={[
        "tg α = 3/4 → sin α = 0,6, cos α = 0,8. Függőleges erő: merőleges komponense F·cos α,",
        "tengelyirányú komponense F·sin α; vízszintes erőnél fordítva (F·sin α merőleges, F·cos α tengelyirányú).",
        "A „virág” a merőleges szárú szögek miatt működik: minden szög α vagy 90° − α.",
      ]} />
    </svg>
  );
}

/* ================================================================== */
/*  6. Igénybevételi függvények → ábrák (8.8–8.9. ábra)                */
/* ================================================================== */

export function AbraFuggvenyek() {
  const e = eredmeny("tk88");
  // a képletcímkék a tankönyv 8.9. ábrája szerint a tartó végénél; a rajz oldala: a pozitív érték a tartó alatt
  return (
    <Diagram eredmeny={e} meretek reakciok={false} amp={36} gyerekek={({ g, szerkMag, abraFent, abraMag, leptek }) => {
      const xK = g.kx(2), xB = g.kx(0) + 44;
      const tengely = (i) => szerkMag + i * abraMag + abraFent;
      return (
        <g>
          <T x={xK} y={tengely(0) + (8.66 * leptek.N) / 2 + 4} szin={ZOLD} meret={11.5} vastag>N(x) = +F·cos α = 8,66 kN (konstans, húzás)</T>
          <T x={xK} y={tengely(1) + (5 * leptek.V) / 2 + 4} szin={KEK} meret={11.5} vastag>V(x) = +F·sin α = 5 kN (konstans)</T>
          <T x={xB} y={tengely(2) - 20 * leptek.M - 6} szin={BORDO} meret={11.5} vastag horgony="start">= −F·l·sin α (felül húzott)</T>
          <T x={xK} y={tengely(2) - 4} szin={BORDO} meret={10.5} horgony="middle">M(x) = −F·sin α·(l − x): lineáris</T>
        </g>
      );
    }} />
  );
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
            <Diagram eredmeny={e} abrak={["V", "M"]} szel={300} amp={30} nevek={false} reakciok={false} csomopontCimkek={false}
              gyerekek={({ szerkMag, abraMag }) => (
                <g>
                  <T x={12} y={szerkMag + 15} szin={KEK} meret={11} vastag horgony="start">V [kN]</T>
                  <T x={12} y={szerkMag + abraMag + 15} szin={BORDO} meret={11} vastag horgony="start">M [kNm]</T>
                </g>
              )} />
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
  // szakasz: l = 4 m, q = 4 kN/m lefelé, végponti nyomatékok M1 = −8, M2 = −4 (felül húzott végek), alul pozitív
  const l = 4, q = 4, M1 = -8, M2 = -4;
  const X1 = 90, X2 = 470, YT = 78, Y = 186, L = (X2 - X1) / l, lep = 6.5; // px / kNm
  const kx = (x) => X1 + x * L;
  const ky = (Mv) => Y + Mv * lep; // pozitív (alul) lefelé
  const Mf = (x) => M1 + ((M2 - M1) * x) / l + (q * x * (l - x)) / 2;
  const pts = [];
  for (let i = 0; i <= 40; i++) { const x = (l * i) / 40; pts.push(`${kx(x)},${ky(Mf(x))}`); }
  const hurKozep = (M1 + M2) / 2;
  const belog = (q * l * l) / 8;
  const xm = kx(l / 2);
  const nyilak = [];
  for (let i = 0; i <= 12; i++) { const x = X1 + ((X2 - X1) * i) / 12; nyilak.push(<line key={i} x1={x} y1={YT - 30} x2={x} y2={YT - 2} stroke={SZIN.teher} strokeWidth="1.5" markerEnd="url(#th-teher)" />); }
  return (
    <svg viewBox="0 0 600 352" className="abra w-full h-auto">
      <TartoHegyek />
      <Hegyek />
      <Cim x={12} y={20}>Egyenletes teher alatt: M parabola, belógása ql²/8 = {ert(belog)} kNm (q = 4 kN/m, l = 4 m)</Cim>
      {/* a tartószakasz a teherrel */}
      <line x1={X1 - 30} y1={YT} x2={X2 + 30} y2={YT} stroke={SZIN.tarto} strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />
      <Tarto x1={X1} y1={YT} x2={X2} y2={YT} vastag={5} />
      <line x1={X1} y1={YT - 30} x2={X2} y2={YT - 30} stroke={SZIN.teher} strokeWidth="1.4" />
      {nyilak}
      <T x={300} y={YT - 36} szin={SZIN.teher} vastag>q = 4 kN/m</T>
      <line x1={X1} y1={YT - 8} x2={X1} y2={YT + 8} stroke="#334155" strokeWidth="1.6" />
      <line x1={X2} y1={YT - 8} x2={X2} y2={YT + 8} stroke="#334155" strokeWidth="1.6" />
      <T x={X1 - 8} y={YT + 20} meret={11} szin="#475569">1</T>
      <T x={X2 + 8} y={YT + 20} meret={11} szin="#475569">2</T>
      <Meret x1={X1} x2={X2} y={YT + 30} cimke="l = 4 m" />
      <T x={X2 + 46} y={YT + 4} meret={10.5} szin="#475569" horgony="start">a tartó</T>
      <T x={X2 + 46} y={YT + 17} meret={10.5} szin="#475569" horgony="start">folytatódik</T>
      {/* a nyomatéki ábra a szakasz tengelyén */}
      <line x1={X1} y1={Y} x2={X2} y2={Y} stroke={SZIN.tarto} strokeWidth="1.6" opacity="0.7" />
      <T x={X1 - 14} y={Y - 6} szin="#64748b" meret={13} vastag>−</T>
      <T x={X1 - 14} y={Y + 16} szin={BORDO} meret={13} vastag>+</T>
      <polygon points={`${X1},${Y} ${pts.join(" ")} ${X2},${Y}`} fill={BORDO} fillOpacity="0.1" />
      <polyline points={pts.join(" ")} fill="none" stroke={BORDO} strokeWidth="2.4" />
      <T x={X1 + 4} y={ky(M1) - 8} szin={BORDO} vastag horgony="start">M₁ = −8</T>
      <T x={X2 - 4} y={ky(M2) - 8} szin={BORDO} vastag horgony="end">M₂ = −4</T>
      {/* húr */}
      <line x1={X1} y1={ky(M1)} x2={X2} y2={ky(M2)} stroke="#64748b" strokeWidth="1.3" strokeDasharray="5 4" />
      <T x={xm + 90} y={ky(hurKozep) - 16} szin="#64748b" meret={11}>szerkesztővonal (húr)</T>
      {/* belógás */}
      <Nyil x1={xm} y1={ky(hurKozep)} x2={xm} y2={ky(hurKozep + belog)} szin="#1d3c48" hegy="ih-sotet" vastag={2} />
      <T x={xm + 8} y={ky(hurKozep + belog / 2) + 4} vastag horgony="start">ql²/8 = 8</T>
      <circle cx={xm} cy={ky(hurKozep + belog)} r="4" fill={BORDO} stroke="white" strokeWidth="1.5" />
      <T x={xm - 8} y={ky(hurKozep + belog) + 14} szin={BORDO} vastag horgony="end">M(l/2) = −6 + 8 = {ert(hurKozep + belog)}</T>
      {/* érintők metszéspontja: még egyszer ql²/8 lejjebb */}
      <line x1={xm} y1={ky(hurKozep + belog)} x2={xm} y2={ky(hurKozep + 2 * belog)} stroke="#1d3c48" strokeWidth="1.2" strokeDasharray="3 3" />
      <line x1={X1} y1={ky(M1)} x2={xm} y2={ky(hurKozep + 2 * belog)} stroke="#0e7490" strokeWidth="1.2" strokeDasharray="6 3" />
      <line x1={X2} y1={ky(M2)} x2={xm} y2={ky(hurKozep + 2 * belog)} stroke="#0e7490" strokeWidth="1.2" strokeDasharray="6 3" />
      <circle cx={xm} cy={ky(hurKozep + 2 * belog)} r="3.5" fill="#0e7490" />
      <T x={xm + 8} y={ky(hurKozep + 2 * belog) + 1} szin="#0e7490" meret={11.5} vastag horgony="start">a végponti érintők metszéspontja:</T>
      <T x={xm + 8} y={ky(hurKozep + 2 * belog) + 15} szin="#0e7490" meret={11.5} vastag horgony="start">még egy ql²/8-dal lejjebb</T>
      {/* középső érintő */}
      <line x1={xm - 70} y1={ky(hurKozep + belog) - 70 * ((M2 - M1) / l) * (lep / L)} x2={xm + 70} y2={ky(hurKozep + belog) + 70 * ((M2 - M1) / l) * (lep / L)} stroke="#0e7490" strokeWidth="1.2" strokeDasharray="6 3" />
      <T x={xm - 78} y={ky(hurKozep + belog) - 70 * ((M2 - M1) / l) * (lep / L) + 4} szin="#0e7490" meret={10.5} horgony="end">érintő ∥ húr</T>
      <Magyarazat y={290} sorok={[
        "Recept: a két végponti nyomatékot (M₁, M₂) egyenessel összekötjük (ez a húr); a húr",
        "felezőpontjából a teher irányába felmérjük a ql²/8 belógást — ez a parabola középső pontja,",
        "érintője a húrral párhuzamos. Még egyszer ql²/8-at felmérve a végponti érintők metszéspontját",
        "kapjuk (a teher eredőjének vonalán). Ferde rúdnál l a ferde hossz, q a merőleges komponens.",
      ]} />
    </svg>
  );
}

/* ================================================================== */
/*  10. Nyomatéki ábra a sarokban (8.11. ábra)                         */
/* ================================================================== */

/**
 * A három sarok-példa. A csomópont-betűket és a teherfeliratokat magunk tesszük ki (a Diagram automatikus
 * elhelyezése a 300 px-es panelen a sarkoknál a rúdra, a bal szélen a képen kívülre tenné őket):
 * feliratok: [x, y] modell-koordináta, [dx, dy] px eltolás, szöveg, szín.
 */
const SAROK_MODELLEK = [
  {
    cim: "L konzol: vízszintes + függőleges erő",
    modell: {
      csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "C", x: 0, y: 3 }, { id: "D", x: 3, y: 3 }],
      rudak: [{ id: "1", a: "A", b: "C" }, { id: "2", a: "C", b: "D" }],
      tamaszok: [{ csomopont: "A", tipus: "befogas" }],
      terhek: [{ fajta: "csomopontiEro", csomopont: "D", Fy: -6 }, { fajta: "csomopontiEro", csomopont: "C", Fx: 4 }],
    },
    feliratok: [
      [[0, 0], [-16, 22], "A"], [[0, 3], [-12, -10], "C"], [[3, 3], [14, 20], "D"],
      [[0, 3], [-30, -30], "4 kN", "teher"], [[3, 3], [16, -40], "6 kN", "teher"],
    ],
  },
  {
    // H10/3-nál (függőleges teher a gerendán) a sarkokban M = 0 lenne — itt vízszintes erő a sarkon, hogy a sarok „befordulása” látsszon
    cim: "Keret: vízszintes erő a sarkon",
    modell: {
      csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "C", x: 0, y: 3 }, { id: "D", x: 6, y: 3 }, { id: "B", x: 6, y: 0 }],
      rudak: [{ id: "1", a: "A", b: "C" }, { id: "2", a: "C", b: "D" }, { id: "3", a: "D", b: "B" }],
      tamaszok: [{ csomopont: "A", tipus: "csuklo" }, { csomopont: "B", tipus: "gorgo", szog: 90 }],
      terhek: [{ fajta: "csomopontiEro", csomopont: "C", Fx: 4 }],
    },
    feliratok: [
      [[0, 0], [-18, 22], "A"], [[6, 0], [18, 22], "B"], [[0, 3], [-12, -10], "C"], [[6, 3], [14, -8], "D"],
      [[0, 3], [-30, -30], "4 kN", "teher"],
    ],
  },
  {
    // H10/1 jellegű (ferde + vízszintes szakasz), koncentrált erővel, hogy a sarok értéke (6) és a csúcs (9) külön olvasható legyen
    cim: "Ferde + vízszintes szakasz, erő a gerendán",
    modell: {
      csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "C", x: 3, y: 2 }, { id: "B", x: 6, y: 2 }],
      rudak: [{ id: "1", a: "A", b: "C" }, { id: "2", a: "C", b: "B" }],
      tamaszok: [{ csomopont: "A", tipus: "csuklo" }, { csomopont: "B", tipus: "gorgo", szog: 90 }],
      terhek: [{ fajta: "pontTeher", rud: "2", a: 1.5, F: -8, irany: "y" }],
    },
    // a sarokban a két rúd ugyanazt a 6-ot adná két helyre írva → az értékeket magunk írjuk ki
    cimkek: false,
    feliratok: [
      [[0, 0], [-18, 22], "A"], [[6, 2], [18, 22], "B"], [[3, 2], [-2, 22], "C"],
      [[4.5, 2], [26, -44], "8 kN", "teher"],
      [[3, 2], [4, 44], "6", "ertek"], [[4.5, 2], [0, 60], "9", "ertek"],
    ],
  },
];

export function AbraSarok() {
  return (
    <div className="grid gap-3 sm:grid-cols-3 [&>*]:min-w-0">
      {SAROK_MODELLEK.map(({ cim, modell, feliratok, cimkek = true }) => {
        const e = elemez(modell);
        return (
          <div key={cim} className="rounded-xl bg-white/70 p-2 ring-1 ring-petrol-100">
            <p className="mb-1 text-center text-[11.5px] font-semibold text-petrol-700">{cim}</p>
            <Diagram eredmeny={e} abrak={["M"]} szel={300} amp={26} nevek={false} reakciok={false} teherCimkek={false} csomopontCimkek={false} cimkek={cimkek}
              gyerekek={({ g, szerkFent, szerkMag, abraFent }) => {
                const ky = (y) => szerkFent + (g.maxY - y) * g.L;
                const kyM = (y) => szerkMag + abraFent + (g.maxY - y) * g.L; // az M-panelben
                return (
                  <g>
                    {feliratok.map(([[x, y], [dx, dy], szoveg, fajta], i) => fajta === "teher"
                      ? <T key={i} x={g.kx(x) + dx} y={ky(y) + dy} szin={SZIN.teher} meret={11.5} vastag>{szoveg}</T>
                      : fajta === "ertek"
                        ? <T key={i} x={g.kx(x) + dx} y={kyM(y) + dy} szin={BORDO} meret={11.5} vastag>{szoveg}</T>
                        : <TamaszCimke key={i} x={g.kx(x) + dx} y={ky(y) + dy}>{szoveg}</TamaszCimke>)}
                    <T x={12} y={szerkMag + 15} szin={BORDO} meret={11} vastag horgony="start">M [kNm]</T>
                  </g>
                );
              }} />
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
      {/* nyomatéki ábrák: bal ág alul, jobb ág alul, függőleges ág BAL oldalán (a nyilak iránya ebből adódik) */}
      <rect x={cx - 120} y={cy + 4} width={98} height={16} fill={BORDO} fillOpacity="0.18" stroke={BORDO} strokeWidth="1" />
      <rect x={cx + 22} y={cy + 4} width={98} height={10} fill={BORDO} fillOpacity="0.18" stroke={BORDO} strokeWidth="1" />
      <rect x={cx - 12} y={cy + 22} width={8} height={68} fill={BORDO} fillOpacity="0.18" stroke={BORDO} strokeWidth="1" />
      {/* nyilak a csonkokon: arról az oldalról indítva, ahol az ábra van, a csomóponthoz képest kívülről */}
      <path d={`M ${cx - 26} ${cy + r} A ${r} ${r} 0 0 1 ${cx - 26} ${cy - r}`} fill="none" stroke={BORDO} strokeWidth="2" markerEnd="url(#ih-bordo)" />
      <T x={cx - 80} y={cy - 24} szin={BORDO} vastag>M₁ = 16 ↷</T>
      <path d={`M ${cx + 26} ${cy + r} A ${r} ${r} 0 0 0 ${cx + 26} ${cy - r}`} fill="none" stroke={BORDO} strokeWidth="2" markerEnd="url(#ih-bordo)" />
      <T x={cx + 80} y={cy - 24} szin={BORDO} vastag>M₂ = 10 ↶</T>
      <path d={`M ${cx - r} ${cy + 26} A ${r} ${r} 0 0 0 ${cx + r} ${cy + 26}`} fill="none" stroke={BORDO} strokeWidth="2" markerEnd="url(#ih-bordo)" />
      <T x={cx - 24} y={cy + 66} szin={BORDO} vastag horgony="end">M₃ = 6 ↶</T>
      <T x={cx + 130} y={cy + 50} meret={12.5} vastag horgony="start">↷: |M₁| − |M₂| − |M₃| = 0</T>
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
  // méretvonalak nélkül: a reakciófeliratok és a méretek egy sorba esnének (a GYF‑7 feladatábráján ott vannak a méretek)
  return <Diagram eredmeny={e} abrak={["V", "M"]} amp={40} />;
}

/**
 * A tankönyv 8.5.a ábrája kézzel, tömören: balra a ferde konzol eredményvázlata (a befogás reakciói: 2 kN ←,
 * 5 kN ↓, 21 kNm ↷; a szabad végen 2 kN → és 5 kN ↑) a K₇ keresztmetszettel, jobbra a három ábra a ferde
 * tengelyre merőlegesen felmérve (a számítómag értékeivel: N = +4,6, V = −2,8 konstans, M = 21 → 0, K₇-ben 7).
 * A pozitív oldal a rúd A→T irányában a jobb oldal (lent-jobbra): N, V, M pozitív értékei mind oda kerülnek.
 */
export function AbraFerdeK7() {
  const e = eredmeny("tk85a");
  const ig = e.igenybevetelek[0];
  const c = 0.8, s = 0.6; // cos α, sin α (tg α = 3/4)
  const u = [c, -s]; // a rúd iránya a képernyőn (jobbra-fel)
  const n = [s, c]; // a pozitív oldal (a haladási irány jobb oldala: lent-jobbra)
  // --- bal: szerkezet ---
  const L = 40, A = [70, 300];
  const P = (xm, ym) => [A[0] + xm * L, A[1] - ym * L];
  const Tp = P(6, 4.5), K = P(4, 3);
  const kat = (v) => Math.round(v * 10) / 10;
  // --- jobb: három mini ábra ---
  const X0 = 412, HOSSZ = 144, MAG = 108; // a mini tengely (A→T) képernyőn
  const panelek = [
    { jel: "N", cim: "N – normálerő [kN]", top: 24, lep: 4, ertek: (x) => ertekek(ig, x).N },
    { jel: "V", cim: "V – nyíróerő [kN]", top: 160, lep: 5, ertek: (x) => ertekek(ig, x).V },
    { jel: "M", cim: "M – hajlítónyomaték [kNm]", top: 296, lep: 1.3, ertek: (x) => ertekek(ig, x).M },
  ];
  return (
    <svg viewBox="0 0 600 462" className="abra w-full h-auto">
      <TartoHegyek />
      <Hegyek />
      <Cim x={12} y={22}>a) eredményvázlat és a K₇ keresztmetszet</Cim>
      {/* befogás jele a rúdra merőlegesen, A mögött */}
      <g transform={`rotate(${(Math.atan2(u[1], u[0]) * 180) / Math.PI} ${A[0]} ${A[1]})`}>
        <Befogas x={A[0]} y={A[1]} irany="bal" hossz={30} />
      </g>
      <Tarto x1={A[0]} y1={A[1]} x2={Tp[0]} y2={Tp[1]} vastag={5} />
      <TamaszCimke x={A[0] + 17} y={A[1] + 11}>A</TamaszCimke>
      <TamaszCimke x={Tp[0] + 12} y={Tp[1] - 8}>T</TamaszCimke>
      {/* terhek a szabad végen (a hegy a T pontban) */}
      <Nyil x1={Tp[0] - 42} y1={Tp[1]} x2={Tp[0]} y2={Tp[1]} />
      <T x={Tp[0] - 24} y={Tp[1] - 8} szin={SZIN.teher} meret={11.5} vastag>2 kN</T>
      <Nyil x1={Tp[0]} y1={Tp[1] + 44} x2={Tp[0]} y2={Tp[1]} />
      <T x={Tp[0] + 22} y={Tp[1] + 34} szin={SZIN.teher} meret={11.5} vastag>5 kN</T>
      {/* reakciók A-ban, a tankönyv eredményvázlata szerint (a nyíl A-ból indul) */}
      <Nyil x1={A[0]} y1={A[1]} x2={A[0] - 44} y2={A[1]} szin={SZIN.reakcio} hegy="th-reakcio" />
      <T x={A[0] - 40} y={A[1] + 17} szin={SZIN.reakcio} meret={11.5} vastag>2 kN</T>
      <Nyil x1={A[0]} y1={A[1]} x2={A[0]} y2={A[1] + 44} szin={SZIN.reakcio} hegy="th-reakcio" />
      <T x={A[0] + 22} y={A[1] + 42} szin={SZIN.reakcio} meret={11.5} vastag>5 kN</T>
      <path d={`M ${A[0] - 18} ${A[1] - 4} A 18 18 0 1 1 ${A[0] + 18} ${A[1] - 4}`} fill="none" stroke={SZIN.reakcio} strokeWidth="2.2" markerEnd="url(#th-reakcio)" />
      <T x={A[0] - 4} y={A[1] - 30} szin={SZIN.reakcio} meret={11.5} vastag>21 kNm ↷</T>
      {/* K₇ és a pozitív oldal */}
      <line x1={K[0] - n[0] * 14} y1={K[1] - n[1] * 14} x2={K[0] + n[0] * 14} y2={K[1] + n[1] * 14} stroke="#334155" strokeWidth="2" strokeDasharray="4 3" />
      <T x={K[0] - n[0] * 24 - 4} y={K[1] - n[1] * 24 + 2} dolt vastag horgony="end">K₇</T>
      <T x={K[0] + u[0] * 14 + n[0] * 20} y={K[1] + u[1] * 14 + n[1] * 20 + 5} szin={BORDO} meret={14} vastag>+</T>
      <T x={K[0] + u[0] * 14 - n[0] * 20} y={K[1] + u[1] * 14 - n[1] * 20 + 5} szin="#64748b" meret={14} vastag>−</T>
      {/* méretek */}
      <Meret x1={A[0]} x2={K[0]} y={A[1] + 62} cimke="4,0 m" />
      <Meret x1={K[0]} x2={Tp[0]} y={A[1] + 62} cimke="2,0 m" />
      <MeretFugg x={Tp[0] + 42} y1={Tp[1]} y2={K[1]} cimke="1,5 m" />
      <MeretFugg x={Tp[0] + 42} y1={K[1]} y2={A[1]} cimke="3,0 m" />
      <T x={200} y={392} meret={11} szin="#475569">tg α = 3/4: sin α = 0,6, cos α = 0,8</T>
      <T x={200} y={407} meret={11} szin="#475569">K₇ balról: N₇ = +2·0,8 + 5·0,6 = +4,6 kN</T>
      <T x={200} y={422} meret={11} szin="#475569">V₇ = +2·0,6 − 5·0,8 = −2,8 kN</T>
      <T x={200} y={437} meret={11} szin="#475569">M₇ = +2·3,0 − 5·4,0 + 21 = +7,0 kNm</T>

      {/* b) a három ábra a ferde tengelyen */}
      <Cim x={X0 - 32} y={22}>b) N, V, M a ferde tengelyen</Cim>
      {panelek.map(({ jel, cim, top, lep, ertek }) => {
        const szin = SZINEK[jel];
        const a0 = [X0, top + 120], a1 = [X0 + HOSSZ, top + 12];
        const tengely = (x) => [a0[0] + (x / ig.hossz) * HOSSZ, a0[1] - (x / ig.hossz) * MAG];
        const pont = (x) => { const v = ertek(x); const t = tengely(x); return [t[0] + n[0] * v * lep, t[1] + n[1] * v * lep]; };
        const xs = [];
        for (let i = 0; i <= 12; i++) xs.push((ig.hossz * i) / 12);
        const gorbe = xs.map(pont);
        const vonalak = xs.slice(1, -1).map((x) => [tengely(x), pont(x)]);
        const vA = ertek(0), vT = ertek(ig.hossz), vK = ertek(5); // K₇: ferde ívhossz 5 m
        const pT = pont(ig.hossz), pK = pont(5), tK = tengely(5);
        return (
          <g key={jel}>
            <T x={X0 - 8} y={top + 14} szin={szin} meret={11} vastag horgony="start">{cim}</T>
            <polygon points={`${a0.join(",")} ${gorbe.map((p) => p.join(",")).join(" ")} ${a1.join(",")}`} fill={szin} fillOpacity="0.1" />
            {vonalak.map(([a, b], i) => <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={szin} strokeWidth="0.8" opacity="0.55" />)}
            <line x1={a0[0]} y1={a0[1]} x2={a1[0]} y2={a1[1]} stroke={SZIN.tarto} strokeWidth="1.6" opacity="0.7" />
            <polyline points={gorbe.map((p) => p.join(",")).join(" ")} fill="none" stroke={szin} strokeWidth="2.2" />
            {/* + és − oldal az A végnél */}
            <T x={a0[0] - 8 + n[0] * 12} y={a0[1] + n[1] * 12 + 4} szin={szin} meret={11} vastag>+</T>
            <T x={a0[0] - 8 - n[0] * 12} y={a0[1] - n[1] * 12 + 4} szin="#64748b" meret={11} vastag>−</T>
            {/* értékek: az A végnél és a T végnél (ha nem nulla), és K₇-nél */}
            {Math.abs(vA) > 1e-6 && Math.abs(vA - vT) > 1e-6 && <T x={pont(0)[0] + (vA > 0 ? 10 : -6)} y={pont(0)[1] + (vA > 0 ? 12 : -4)} szin={szin} meret={11} vastag horgony={vA > 0 ? "start" : "end"}>{ert(vA)}</T>}
            {Math.abs(vT) > 1e-6 && <T x={pT[0] + 6} y={pT[1] + (vT > 0 ? 12 : -2)} szin={szin} meret={11} vastag horgony="start">{ert(vT)}</T>}
            <line x1={tK[0]} y1={tK[1]} x2={pK[0]} y2={pK[1]} stroke="#334155" strokeWidth="1.2" strokeDasharray="3 2" />
            <circle cx={pK[0]} cy={pK[1]} r="3.5" fill={szin} stroke="white" strokeWidth="1.2" />
            <T x={pK[0] + (vK >= 0 ? 8 : -8)} y={pK[1] + (vK >= 0 ? 14 : -6)} szin={szin} meret={11} vastag horgony={vK >= 0 ? "start" : "end"}>K₇: {ert(kat(vK))}</T>
          </g>
        );
      })}
    </svg>
  );
}

/* ================================================================== */
/*  13. Konzol: kívülről számolunk (8.4.1)                             */
/* ================================================================== */

export function AbraKonzolIrany() {
  const Y = 96, XA = 80, XB = 520, XF = 300;
  return (
    <svg viewBox="0 0 600 262" className="abra w-full h-auto">
      <TartoHegyek />
      <Hegyek />
      <Cim x={12} y={22}>Konzolon a szabad vég felől haladunk — a reakciók nélkül is megy</Cim>
      <Befogas x={XA} y={Y} irany="bal" hossz={50} />
      <Tarto x1={XA} y1={Y} x2={XB} y2={Y} />
      <TamaszCimke x={XA - 14} y={Y + 24}>A</TamaszCimke>
      <TamaszCimke x={XB + 14} y={Y + 24}>B</TamaszCimke>
      <TeherNyil x={XF} y={Y} hossz={46} cimke="F₁" cimkeEltolas={[8, -2]} />
      <TeherNyil x={XB} y={Y} hossz={46} cimke="F₂" cimkeEltolas={[8, -2]} />
      {/* a reakciók halványan: az ábrák végértékei */}
      <g opacity="0.75">
        <ReakcioNyil x={XA} y={Y} hossz={40} szog={90} cimke="A = F₁ + F₂" cimkeEltolas={[-62, 14]} />
        {/* M_A ↶ (lefelé ható terheknél): az ív a tetőn át, 3 órától 9 óráig */}
        <path d={`M ${XA + 18} ${Y - 2} A 18 18 0 0 0 ${XA - 18} ${Y - 2}`} fill="none" stroke={SZIN.reakcio} strokeWidth="2.2" markerEnd="url(#th-reakcio)" />
        <T x={XA} y={Y - 28} szin={SZIN.reakcio} meret={11.5} vastag>M<tspan fontSize="9" dy="3">A</tspan></T>
      </g>
      <Nyil x1={XB - 6} y1={Y + 40} x2={XA + 96} y2={Y + 40} szin="#0e7490" hegy="ih-kek" vastag={2.2} />
      <T x={XB - 8} y={Y + 66} szin="#0e7490" vastag horgony="end">innen indulunk: a szabad végen csak az ottani</T>
      <T x={XB - 8} y={Y + 81} szin="#0e7490" vastag horgony="end">koncentrált hatás számít: N = 0, V = F₂, M = 0</T>
      <T x={XB - 8} y={Y + 96} szin="#0e7490" meret={11} horgony="end">(ha a végen nincs koncentrált hatás: N = V = M = 0)</T>
      <T x={20} y={Y + 74} szin="#475569" meret={11} horgony="start">a befogásnál az ábrák</T>
      <T x={20} y={Y + 88} szin="#475569" meret={11} horgony="start">végértékei = a reakciók:</T>
      <T x={20} y={Y + 102} szin="#475569" meret={11} horgony="start">V = A, |M| = M<tspan fontSize="8.5" dy="3">A</tspan></T>
      <Magyarazat y={228} sorok={[
        "Az F₁ alatt V ugrik (F₁-gyel), M törik; a befogás felé haladva egyre több erőt kell figyelembe venni.",
        "Balról befogott konzolon jobbról, jobbról befogotton balról, alul befogott oszlopon felülről számolunk.",
      ]} />
    </svg>
  );
}
