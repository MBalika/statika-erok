"use client";

import RacsosRajz, { RACS_SZIN } from "@/components/racsos/RacsosRajz";
import { TartoHegyek, TeherNyil, Csuklo, Gorgo } from "@/components/tartok/TartoElemek";
import { racsosMegold, sablon, PELDAK, rudId } from "@/lib/racsos";

/*
 * A 7. modul elméleti ábrái a tankönyv 6.1–6.10. ábrája nyomán.
 * A rajzok a RacsosRajz komponensre és a lib/racsos sablonjaira épülnek.
 */

const LILA = "var(--color-jel-eredo)";
const NAR = "var(--color-jel-ero)";
const KEK = "#2563eb";

/** Elkülönített csomópont: a csomópontból kifelé mutató (húzottnak felvett) rúderők + külső erők. */
function CsomopontElkulonitve({ cx, cy, erok, cim, r = 44 }) {
  return (
    <g>
      {erok.map((e, i) => {
        const n = Math.hypot(e.ex, e.ey) || 1;
        const ux = e.ex / n;
        const uy = e.ey / n;
        const hossz = e.hossz ?? r;
        const szin = e.szin ?? KEK;
        // a nyíl a csomópontból kifelé (rúderő) vagy a csomópontba befelé (teher/reakció, ha befele: true)
        const x2 = cx + ux * hossz;
        const y2 = cy - uy * hossz;
        const hegy = e.szin === NAR ? "th-teher" : e.szin === LILA ? "th-reakcio" : "th-szurke";
        return (
          <g key={i}>
            {e.befele ? (
              <line x1={x2} y1={y2} x2={cx + ux * 6} y2={cy - uy * 6} stroke={szin} strokeWidth="2.4" strokeLinecap="round" markerEnd={`url(#${hegy})`} />
            ) : (
              <line x1={cx} y1={cy} x2={x2} y2={y2} stroke={szin} strokeWidth="2.4" strokeLinecap="round" markerEnd={`url(#${hegy})`} />
            )}
            <text x={(Math.abs(uy) < 0.3 ? x2 - ux * 16 : x2 + ux * 12) + (e.dx ?? 0)} y={(Math.abs(uy) < 0.3 ? y2 - 9 : y2 - uy * 12 + 4) + (e.dy ?? 0)} textAnchor="middle" fontSize="11" fontStyle="italic" fontWeight="650" style={{ fill: szin, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
              {e.cimke}
            </text>
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r="4.5" fill="white" stroke="#0f172a" strokeWidth="1.8" />
      {cim && (
        <text x={cx} y={cy - r - 14} textAnchor="middle" fontSize="12" fontWeight="700" style={{ fill: "#1d3c48" }}>
          {cim}
        </text>
      )}
    </g>
  );
}

/* ---------------- 6.1: statikai váz és a csuklók elkülönítése ---------------- */

const M61 = PELDAK.tk61(1.5, 2, 10, -60);
M61.terhek[0].cimke = "F";
const E61 = racsosMegold(M61);

export function AbraRacsosVaz() {
  // a rudak egységvektorai a csomópontból kifelé
  const cs = (id) => E61.csomopontok.find((c) => c.id === id);
  const e = (p, q) => {
    const a = cs(p);
    const b = cs(q);
    const n = Math.hypot(b.x - a.x, b.y - a.y);
    return { ex: (b.x - a.x) / n, ey: (b.y - a.y) / n };
  };
  const rud = (p, q) => ({ ...e(p, q), cimke: `S${rudId(p, q)}`, szin: KEK });
  return (
    <svg viewBox="0 0 600 420" className="abra w-full h-auto">
      <TartoHegyek />
      <text x={12} y={18} fontSize="11" fontWeight="700" letterSpacing="1.5" style={{ fill: "#64748b" }}>
        a) STATIKAI VÁZ
      </text>
      <g transform="translate(0 6)">
        <RacsosRajz modell={M61} szinez={false} meretek={false} szelesseg={600} magassag={210} margo={{ bal: 60, jobb: 60, fel: 40, le: 60 }} csoport />
      </g>
      <text x={12} y={240} fontSize="11" fontWeight="700" letterSpacing="1.5" style={{ fill: "#64748b" }}>
        b) A CSUKLÓK ELKÜLÖNÍTÉSE
      </text>
      <text x={12} y={256} fontSize="10.5" style={{ fill: "#64748b" }}>
        minden rúderő húzottnak felvéve: a nyíl a csomópontból kifelé mutat
      </text>
      <CsomopontElkulonitve cx={62} cy={350} cim="1" r={50} erok={[rud("1", "2"), rud("1", "3"), { ex: -1, ey: 0, cimke: "Aₓ", szin: LILA, hossz: 40 }, { ex: 0, ey: 1, cimke: "Aᵧ", szin: LILA, hossz: 40, dx: 14, dy: 24 }]} />
      <CsomopontElkulonitve cx={190} cy={338} cim="2" r={50} erok={[rud("2", "1"), rud("2", "3"), rud("2", "4")]} />
      <CsomopontElkulonitve cx={318} cy={350} cim="3" r={50} erok={[rud("3", "1"), rud("3", "2"), rud("3", "4"), rud("3", "5")]} />
      <CsomopontElkulonitve cx={448} cy={350} cim="5" r={50} erok={[rud("5", "3"), rud("5", "4"), rud("5", "6"), rud("5", "7"), { ex: 0.5, ey: -0.866, cimke: "F", szin: NAR, hossz: 46, befele: false }]} />
      <CsomopontElkulonitve cx={568} cy={350} cim="7" r={50} erok={[rud("7", "5"), rud("7", "6"), { ex: 0, ey: 1, cimke: "B", szin: LILA, hossz: 40, dx: 14, dy: 24 }]} />
    </svg>
  );
}

/* ---------------- 6.2: elnevezések ---------------- */

const M62 = sablon("parhuzamos", { n: 6, a: 2, h: 1.5, racs: "N" });
const M62b = sablon("parhuzamos", { n: 6, a: 2, h: 1.5, racs: "Z" });
// a második rajzon csak a belső oszlopok egy része marad (összekötő rudak példája)
M62b.rudak = M62b.rudak.filter((r) => !["1,8", "7,14"].includes(r.id));

export function AbraElnevezesek() {
  const Cimke = ({ x, y, children, horgony = "middle", szin = "#334155" }) => (
    <text x={x} y={y} textAnchor={horgony} fontSize="11.5" fontWeight="650" style={{ fill: szin, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
      {children}
    </text>
  );
  return (
    <svg viewBox="-75 0 750 428" className="abra w-full h-auto">
      <TartoHegyek />
      <g>
        <RacsosRajz modell={M62} szinez={false} csomopontCimkek={false} szelesseg={600} magassag={200} margo={{ bal: 90, jobb: 90, fel: 42, le: 60 }} csoport />
        <Cimke x={300} y={26}>övrudak (felső öv)</Cimke>
        <Cimke x={300} y={182}>övrudak (alsó öv)</Cimke>
        <Cimke x={40} y={76} horgony="end">oszlop</Cimke>
        <line x1={44} y1={72} x2={88} y2={58} stroke="#64748b" strokeWidth="1" />
        <Cimke x={40} y={120} horgony="end">rácsrudak</Cimke>
        <line x1={44} y1={116} x2={112} y2={96} stroke="#64748b" strokeWidth="1" />
        <Cimke x={560} y={76} horgony="start">oszlopok</Cimke>
        <line x1={556} y1={72} x2={478} y2={80} stroke="#64748b" strokeWidth="1" />
        <Cimke x={560} y={140} horgony="start">rácsrúd</Cimke>
        <line x1={556} y1={136} x2={500} y2={112} stroke="#64748b" strokeWidth="1" />
      </g>
      <g transform="translate(0 200)">
        <RacsosRajz modell={M62b} szinez={false} csomopontCimkek={false} szelesseg={600} magassag={200} margo={{ bal: 90, jobb: 90, fel: 42, le: 60 }} csoport />
        <Cimke x={560} y={76} horgony="start">összekötő rúd</Cimke>
        <line x1={556} y1={72} x2={480} y2={80} stroke="#64748b" strokeWidth="1" />
        <Cimke x={40} y={76} horgony="end">összekötő rúd</Cimke>
        <line x1={44} y1={72} x2={120} y2={80} stroke="#64748b" strokeWidth="1" />
        <Cimke x={300} y={182}>a csomópontokba a csuklókat általában nem rajzoljuk be</Cimke>
      </g>
      <text x={300} y={400} textAnchor="middle" fontSize="11" style={{ fill: "#64748b" }}>
        Függőleges rúd: ha az egyik végén csak két, egy egyenesbe eső övrúd csatlakozik → összekötő rúd;
      </text>
      <text x={300} y={416} textAnchor="middle" fontSize="11" style={{ fill: "#64748b" }}>
        különben oszlop.
      </text>
    </svg>
  );
}

/* ---------------- 6.3: tartótípusok ---------------- */

function xRacs(n, a, h) {
  const m = sablon("parhuzamos", { n, a, h, racs: "Z" });
  for (let i = 0; i < n; i++) m.rudak.push({ id: rudId(m.also[i], m.felso[i + 1]) + "x", a: m.also[i], b: m.felso[i + 1] });
  return m;
}
function mellekRacs() {
  // nyeregtető mellékrácsozással (6.3.g): a szélső mezőkbe egy-egy kis függőleges + ferde mellékrúd
  const m = sablon("haromszog", { n: 6, a: 2, h: 2.2 });
  const yT = (x) => (2.2 * (6 - Math.abs(x - 6))) / 6;
  m.csomopontok.push({ id: "13", x: 1, y: yT(1) }, { id: "14", x: 11, y: yT(11) }, { id: "15", x: 1, y: 0 }, { id: "16", x: 11, y: 0 });
  m.rudak = m.rudak.filter((r) => !["1,2", "6,7", "1,8", "7,12"].includes(r.id));
  for (const [p, q] of [[1, 15], [15, 2], [6, 16], [16, 7], [1, 13], [13, 8], [12, 14], [14, 7], [13, 15], [14, 16], [13, 2], [14, 6]]) m.rudak.push({ id: rudId(p, q), a: String(p), b: String(q) });
  return m;
}
const TIPUSOK = [
  { cim: "a) Warren (szimmetrikus rácsozás)", modell: sablon("warren", { n: 5, a: 2, h: 1.6 }) },
  { cim: "d) Pratt (oszlopos rácsozás)", modell: sablon("parhuzamos", { n: 6, a: 2, h: 1.6, racs: "N" }) },
  { cim: "f) K-rácsozás", modell: sablon("k", { n: 6, a: 2, h: 0.9 }) },
  { cim: "e) oszlopos, íves felső övvel (trapéz)", modell: (() => { const m = sablon("trapez", { n: 6, a: 2, h0: 1.2, h1: 1.2, racs: "V" }); m.csomopontok.forEach((c) => { if (c.y > 0) c.y = 1.2 + 0.9 * Math.sin((Math.PI * c.x) / 12); }); return m; })() },
  { cim: "g) mellékrácsozású (nyeregtető)", modell: mellekRacs() },
  { cim: "h) X-rácsozás — nem határozott!", modell: xRacs(6, 2, 1.6), figyelem: true },
];

export function AbraTipusok() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {TIPUSOK.map((t) => (
        <div key={t.cim} className={`rounded-xl border p-2 ${t.figyelem ? "border-rose-200 bg-rose-50/40" : "border-[color:var(--keret)] bg-white"}`}>
          <p className={`mb-1 text-[11.5px] font-semibold ${t.figyelem ? "text-rose-700" : "text-petrol-700"}`}>{t.cim}</p>
          <RacsosRajz modell={t.modell} szinez={false} csomopontCimkek={false} szelesseg={300} magassag={120} margo={{ bal: 18, jobb: 18, fel: 14, le: 36 }} atmenet={false} tamaszMeret={9} />
        </div>
      ))}
    </div>
  );
}

/* ---------------- 6.5: vakrudak alapesetei ---------------- */

export function AbraVakrudak() {
  const Eset = ({ ox, cim, rudak, teher, tIrany, vakok, szoveg }) => (
    <g transform={`translate(${ox} 0)`}>
      <text x={95} y={20} textAnchor="middle" fontSize="11" fontWeight="700" style={{ fill: "#1d3c48" }}>
        {cim}
      </text>
      {rudak.map(([dx, dy], i) => (
        <g key={i}>
          <line x1={95} y1={120} x2={95 + dx} y2={120 - dy} stroke={vakok.includes(i) ? RACS_SZIN.vak : RACS_SZIN.rud} strokeWidth={vakok.includes(i) ? 3.5 : 5} strokeLinecap="round" />
          {vakok.includes(i) && <circle cx={95 + dx / 2} cy={120 - dy / 2} r="5" fill="white" stroke={RACS_SZIN.vak} strokeWidth="1.8" />}
        </g>
      ))}
      <line x1={95 - tIrany[0] * 46} y1={120 + tIrany[1] * 46} x2={95 + tIrany[0] * 46} y2={120 - tIrany[1] * 46} stroke="#15803d" strokeWidth="1.6" strokeDasharray="5 4" markerEnd="url(#th-zold)" />
      <text x={95 + tIrany[0] * 56 + 4} y={120 - tIrany[1] * 56 + 4} fontSize="11.5" fontStyle="italic" fontWeight="700" style={{ fill: "#15803d" }}>
        t
      </text>
      {teher && <TeherNyil x={95} y={120} hossz={52} szog={teher} cimke="F" cimkeEltolas={[-16, -6]} />}
      <circle cx={95} cy={120} r="4.5" fill="white" stroke="#0f172a" strokeWidth="1.8" />
      {szoveg.map((sor, i) => (
        <text key={i} x={95} y={196 + 13 * i} textAnchor="middle" fontSize="10" style={{ fill: "#475569" }}>
          {sor}
        </text>
      ))}
    </g>
  );
  return (
    <svg viewBox="0 0 600 236" className="abra w-full h-auto">
      <TartoHegyek />
      <defs>
        <marker id="th-zold" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 9 5 L 0 9 z" fill="#15803d" />
        </marker>
      </defs>
      <Eset ox={10} cim="a) terheletlen, két rúd" rudak={[[-70, 0], [-50, -60]]} vakok={[0, 1]} tIrany={[0, 1]} szoveg={["ΣF_t = 0 (t ⊥ az 1. rúdra) → a 2. rúd 0,", "aztán fordítva → az 1. rúd is 0:", "mindkettő vakrúd"]} />
      <Eset ox={205} cim="b) terheletlen, két rúd egy egyenesben" rudak={[[-72, 0], [72, 0], [-45, -60]]} vakok={[2]} tIrany={[0, 1]} szoveg={["a közös egyenesre merőleges", "vetületben csak a 3. rúd szerepel", "→ a 3. rúd vakrúd"]} />
      <Eset ox={400} cim="c) a teher az egyik rúd egyenesében" rudak={[[-72, 0], [-45, -60]]} vakok={[1]} teher={-180} tIrany={[0, 1]} szoveg={["F és az 1. rúd közös hatásvonalú;", "a rá merőleges vetületből", "a 2. rúd vakrúd"]} />
    </svg>
  );
}

/* ---------------- 6.6: hármas átmetszés ---------------- */

const M66 = PELDAK.tk66(2, 1.5, 12);
M66.terhek[0].cimke = "F";
const E66 = racsosMegold(M66);

function reszModell(modell, ids) {
  const s = new Set(ids);
  return { csomopontok: modell.csomopontok.filter((c) => s.has(c.id)), rudak: modell.rudak.filter((r) => s.has(r.a) && s.has(r.b)), tamaszok: modell.tamaszok.filter((t) => s.has(t.csomopont)), terhek: (modell.terhek ?? []).filter((t) => s.has(String(t.csomopont))) };
}

/** Hullámos vágóvonal két pont között (a tankönyv görbe vonala). */
export function HullamVonal({ x1, y1, x2, y2, szin = "#0f172a", cimke }) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const L = Math.hypot(dx, dy);
  const nx = -dy / L;
  const ny = dx / L;
  const d = [`M ${x1} ${y1}`];
  const n = Math.max(3, Math.round(L / 22));
  for (let i = 1; i <= n; i++) {
    const t = i / n;
    const px = x1 + dx * t;
    const py = y1 + dy * t;
    const a = 6 * (i % 2 ? 1 : -1);
    d.push(`Q ${x1 + dx * (t - 0.5 / n) + nx * a} ${y1 + dy * (t - 0.5 / n) + ny * a} ${px} ${py}`);
  }
  return (
    <g>
      <path d={d.join(" ")} fill="none" stroke={szin} strokeWidth="1.6" />
      {cimke && (
        <g>
          <circle cx={x2 + nx * 0} cy={y2 + 12} r="8" fill="white" stroke={szin} strokeWidth="1.2" />
          <text x={x2} y={y2 + 16} textAnchor="middle" fontSize="10.5" fontWeight="700" style={{ fill: szin }}>
            {cimke}
          </text>
        </g>
      )}
    </g>
  );
}

/** Az átvágott rúd ereje a rész csomópontján, kifelé mutató (húzott) nyílként. */
function VagottEro({ kx, ky, cs, e, cimke, szin = KEK, hossz = 40, dx = 0, dy = 0 }) {
  const x1 = kx(cs.x);
  const y1 = ky(cs.y);
  const x2 = x1 + e.ex * hossz;
  const y2 = y1 - e.ey * hossz;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={szin} strokeWidth="2.4" strokeLinecap="round" markerEnd="url(#th-kek)" />
      <text x={x2 + e.ex * 10 + dx} y={y2 - e.ey * 10 + 4 + dy} textAnchor="middle" fontSize="11" fontStyle="italic" fontWeight="650" style={{ fill: szin, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
        {cimke}
      </text>
    </g>
  );
}

const KekHegy = () => (
  <defs>
    <marker id="th-kek" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 9 5 L 0 9 z" fill={KEK} />
    </marker>
  </defs>
);

export function AbraAtmetszes() {
  const bal = reszModell(M66, ["1", "2", "6", "7"]);
  const jobb = reszModell(M66, ["3", "4", "5", "8", "9", "10"]);
  const csB = (id) => M66.csomopontok.find((c) => c.id === id);
  const e = (p, q) => {
    const a = csB(p);
    const b = csB(q);
    const n = Math.hypot(b.x - a.x, b.y - a.y);
    return { ex: (b.x - a.x) / n, ey: (b.y - a.y) / n };
  };
  return (
    <svg viewBox="0 0 600 430" className="abra w-full h-auto">
      <TartoHegyek />
      <KekHegy />
      <text x={12} y={18} fontSize="11" fontWeight="700" letterSpacing="1.5" style={{ fill: "#64748b" }}>
        a) A TARTÓ ÉS AZ ÁTMETSZETT RUDAK
      </text>
      <RacsosRajz
        modell={M66}
        szinez={false}
        kiemeltRudak={["2,3", "2,8", "7,8"]}
        szelesseg={600}
        magassag={220}
        margo={{ bal: 70, jobb: 70, fel: 62, le: 60 }}
        csoport
        extra={(kx, ky) => <HullamVonal x1={kx(3.1) - 20} y1={ky(1.5) - 24} x2={kx(2.7)} y2={ky(0) + 22} />}
      />
      <text x={12} y={248} fontSize="11" fontWeight="700" letterSpacing="1.5" style={{ fill: "#64748b" }}>
        b) BAL OLDALI RÉSZ
      </text>
      <text x={330} y={248} fontSize="11" fontWeight="700" letterSpacing="1.5" style={{ fill: "#64748b" }}>
        c) JOBB OLDALI RÉSZ
      </text>
      <g transform="translate(0 240)">
        <RacsosRajz
          modell={bal}
          eredmeny={E66}
          szinez={false}
          reakciok
          tamaszok={false}
          szelesseg={300}
          magassag={190}
          margo={{ bal: 60, jobb: 90, fel: 36, le: 50 }}
          csoport
          extra={(kx, ky) => (
            <g>
              <VagottEro kx={kx} ky={ky} cs={csB("2")} e={e("2", "3")} cimke="S₂,₃" />
              <VagottEro kx={kx} ky={ky} cs={csB("2")} e={e("2", "8")} cimke="S₂,₈" dx={12} />
              <VagottEro kx={kx} ky={ky} cs={csB("7")} e={e("7", "8")} cimke="S₇,₈" />
            </g>
          )}
        />
      </g>
      <g transform="translate(300 240)">
        <RacsosRajz
          modell={jobb}
          eredmeny={E66}
          szinez={false}
          reakciok
          tamaszok={false}
          szelesseg={300}
          magassag={190}
          margo={{ bal: 70, jobb: 40, fel: 36, le: 50 }}
          csoport
          extra={(kx, ky) => (
            <g>
              <VagottEro kx={kx} ky={ky} cs={csB("3")} e={e("3", "2")} cimke="S₂,₃" />
              <VagottEro kx={kx} ky={ky} cs={csB("8")} e={e("8", "2")} cimke="S₂,₈" dx={-12} />
              <VagottEro kx={kx} ky={ky} cs={csB("8")} e={e("8", "7")} cimke="S₇,₈" />
            </g>
          )}
        />
      </g>
    </svg>
  );
}

/* ---------------- 6.7: négyes átmetszés, K-rács ---------------- */

const MK = sablon("k", { n: 8, a: 2, h: 1 });
MK.terhek = [];

/** Két K-mező (a tartó jobb oldali darabja) vázlata: bal szélén az elvágott elemek. */
function KResz({ ox, oy, mod }) {
  const R = RACS_SZIN.rud;
  return (
    <g transform={`translate(${ox} ${oy})`}>
      <line x1={0} y1={0} x2={150} y2={0} stroke={R} strokeWidth="4" strokeLinecap="round" />
      <line x1={0} y1={70} x2={150} y2={70} stroke={R} strokeWidth="4" strokeLinecap="round" />
      <line x1={75} y1={0} x2={75} y2={70} stroke={R} strokeWidth="4" />
      <line x1={150} y1={0} x2={150} y2={70} stroke={R} strokeWidth="4" />
      <line x1={75} y1={35} x2={0} y2={0} stroke={R} strokeWidth="4" />
      <line x1={75} y1={35} x2={0} y2={70} stroke={R} strokeWidth="4" />
      <line x1={150} y1={35} x2={75} y2={0} stroke={R} strokeWidth="4" />
      <line x1={150} y1={35} x2={75} y2={70} stroke={R} strokeWidth="4" />
      {/* az övek elvágva: húzó erők balra */}
      <line x1={0} y1={0} x2={-44} y2={0} stroke={KEK} strokeWidth="2.4" markerEnd="url(#th-kek)" />
      <line x1={0} y1={70} x2={-44} y2={70} stroke={KEK} strokeWidth="2.4" markerEnd="url(#th-kek)" />
      <text x={-30} y={-7} textAnchor="middle" fontSize="10.5" fontStyle="italic" style={{ fill: KEK }}>Sᶠ</text>
      <text x={-30} y={84} textAnchor="middle" fontSize="10.5" fontStyle="italic" style={{ fill: KEK }}>Sᵃ</text>
      {mod === "B" ? (
        <g>
          {/* az oszlop két fele elvágva a középső csomópont fölött és alatt: közös hatásvonalú, függőleges erők */}
          <line x1={0} y1={0} x2={0} y2={22} stroke={R} strokeWidth="4" strokeLinecap="round" />
          <line x1={0} y1={70} x2={0} y2={48} stroke={R} strokeWidth="4" strokeLinecap="round" />
          <line x1={0} y1={22} x2={0} y2={46} stroke={KEK} strokeWidth="2.4" markerEnd="url(#th-kek)" />
          <line x1={0} y1={48} x2={0} y2={24} stroke={KEK} strokeWidth="2.4" markerEnd="url(#th-kek)" />
          <text x={8} y={38} fontSize="10.5" fontStyle="italic" style={{ fill: KEK }}>S₁, S₂</text>
          <circle cx={0} cy={0} r="5" fill="none" stroke={RACS_SZIN.aktiv} strokeWidth="1.6" strokeDasharray="2 2" />
          <circle cx={0} cy={70} r="5" fill="none" stroke={RACS_SZIN.aktiv} strokeWidth="1.6" strokeDasharray="2 2" />
        </g>
      ) : (
        <g>
          {/* teljes oszlop, a két ferde rácsrúd csonkja a középső csomópontból */}
          <line x1={0} y1={0} x2={0} y2={70} stroke={R} strokeWidth="4" />
          <line x1={0} y1={35} x2={-22} y2={25} stroke={R} strokeWidth="4" strokeLinecap="round" />
          <line x1={0} y1={35} x2={-22} y2={45} stroke={R} strokeWidth="4" strokeLinecap="round" />
          <line x1={-22} y1={25} x2={-58} y2={8} stroke={KEK} strokeWidth="2.4" markerEnd="url(#th-kek)" />
          <line x1={-22} y1={45} x2={-58} y2={62} stroke={KEK} strokeWidth="2.4" markerEnd="url(#th-kek)" />
          <text x={-50} y={4} textAnchor="middle" fontSize="10.5" fontStyle="italic" style={{ fill: KEK }}>S₃</text>
          <text x={-50} y={76} textAnchor="middle" fontSize="10.5" fontStyle="italic" style={{ fill: KEK }}>S₄</text>
        </g>
      )}
    </g>
  );
}

export function AbraNegyes() {
  return (
    <svg viewBox="0 0 600 350" className="abra w-full h-auto">
      <TartoHegyek />
      <KekHegy />
      <text x={12} y={18} fontSize="11" fontWeight="700" letterSpacing="1.5" style={{ fill: "#64748b" }}>
        a) K-RÁCSOZÁSÚ TARTÓ — B: FERDE, C: EGYENES NÉGYES ÁTMETSZÉS
      </text>
      <RacsosRajz
        modell={MK}
        szinez={false}
        csomopontCimkek={false}
        szelesseg={600}
        magassag={170}
        margo={{ bal: 30, jobb: 30, fel: 36, le: 44 }}
        csoport
        extra={(kx, ky) => (
          <g>
            <path d={`M ${kx(11.3)} ${ky(2) - 14} C ${kx(11.3)} ${ky(1.5)}, ${kx(12.6)} ${ky(1.6)}, ${kx(12.35)} ${ky(1.05)} S ${kx(11.2)} ${ky(0.5)}, ${kx(11.35)} ${ky(0) + 14}`} fill="none" stroke="#0f172a" strokeWidth="1.6" />
            <circle cx={kx(11.35)} cy={ky(0) + 26} r="8" fill="white" stroke="#0f172a" strokeWidth="1.2" />
            <text x={kx(11.35)} y={ky(0) + 30} textAnchor="middle" fontSize="10.5" fontWeight="700" style={{ fill: "#0f172a" }}>B</text>
            <HullamVonal x1={kx(10.6)} y1={ky(2) - 14} x2={kx(10.7)} y2={ky(0) + 14} cimke="C" />
          </g>
        )}
      />
      <text x={12} y={200} fontSize="11" fontWeight="700" letterSpacing="1.5" style={{ fill: "#64748b" }}>
        b) B: 2 ÖVERŐ + 2 KÖZÖS HATÁSVONALÚ OSZLOPERŐ
      </text>
      <text x={330} y={200} fontSize="11" fontWeight="700" letterSpacing="1.5" style={{ fill: "#64748b" }}>
        c) C: 2 ÖVERŐ + 2 FERDE RÁCSRÚD
      </text>
      <KResz ox={90} oy={230} mod="B" />
      <KResz ox={400} oy={230} mod="C" />
      <text x={160} y={330} textAnchor="middle" fontSize="10" style={{ fill: "#475569" }}>
        nyomaték az oszlop végpontjaira → Sᵃ, Sᶠ külön-külön
      </text>
      <text x={455} y={330} textAnchor="middle" fontSize="10" style={{ fill: "#475569" }}>
        az övek már ismertek → S₃, S₄ vetületi egyenletekből
      </text>
    </svg>
  );
}

/* ---------------- 6.9: külsőleg összetett rácsos tartók ---------------- */

export function AbraOsszetett() {
  const gerber = sablon("warren", { n: 8, a: 1.5, h: 1.4 });
  gerber.tamaszok = [
    { csomopont: "1", tipus: "csuklo", jel: "A" },
    { csomopont: "9", tipus: "gorgo", szog: 90, jel: "B" },
    { csomopont: "17", tipus: "gorgo", szog: 90, jel: "C" },
  ];
  // Gerber: a 12-es felső csomópont kimarad a felső övből → csukló-szerű kapcsolat
  gerber.rudak = gerber.rudak.filter((r) => r.id !== "10,12" );
  const harom = PELDAK.h08b(2, 2, 2, 0, 0);
  harom.terhek = [];
  return (
    <svg viewBox="0 0 600 330" className="abra w-full h-auto">
      <TartoHegyek />
      <text x={12} y={18} fontSize="11" fontWeight="700" letterSpacing="1.5" style={{ fill: "#64748b" }}>
        a) GERBER-RENDSZERŰ RÁCSOS TARTÓ
      </text>
      <text x={318} y={18} fontSize="11" fontWeight="700" letterSpacing="1.5" style={{ fill: "#64748b" }}>
        b) HÁROMCSUKLÓS RENDSZERŰ
      </text>
      <g>
        <RacsosRajz modell={gerber} szinez={false} csomopontCimkek={false} szelesseg={300} magassag={150} margo={{ bal: 20, jobb: 20, fel: 30, le: 44 }} csoport extra={(kx, ky) => <circle cx={kx(15)} cy={ky(0)} r="6" fill="white" stroke={RACS_SZIN.aktiv} strokeWidth="2.4" />} />
        {/* a merev testek sémája */}
        <g transform="translate(0 165)">
          <polygon points="30,60 40,20 220,20 235,60" fill="#cbd5e1" stroke="#475569" strokeWidth="1.2" />
          <polygon points="235,60 250,20 285,20 290,60" fill="#cbd5e1" stroke="#475569" strokeWidth="1.2" />
          <circle cx={235} cy={60} r="5" fill="white" stroke={RACS_SZIN.aktiv} strokeWidth="2" />
          <Csuklo x={40} y={62} meret={11} />
          <Gorgo x={150} y={62} meret={11} />
          <Gorgo x={286} y={62} meret={11} />
          <text x={150} y={126} textAnchor="middle" fontSize="10.5" style={{ fill: "#475569" }}>
            fix rész + befüggesztett rész
          </text>
          <text x={150} y={140} textAnchor="middle" fontSize="10.5" style={{ fill: "#475569" }}>
            (a trapézok merev testek) → Gerber-tartó
          </text>
        </g>
      </g>
      <g transform="translate(300 0)">
        <RacsosRajz modell={harom} szinez={false} csomopontCimkek={false} szelesseg={300} magassag={150} margo={{ bal: 20, jobb: 20, fel: 30, le: 44 }} csoport extra={(kx, ky) => <circle cx={kx(6)} cy={ky(3.2)} r="6" fill="white" stroke={RACS_SZIN.aktiv} strokeWidth="2.4" />} />
        <g transform="translate(0 165)">
          <polygon points="30,60 30,30 150,10 160,60" fill="#cbd5e1" stroke="#475569" strokeWidth="1.2" />
          <polygon points="160,60 150,10 290,-5 290,60" fill="#cbd5e1" stroke="#475569" strokeWidth="1.2" />
          <circle cx={150} cy={10} r="5" fill="white" stroke={RACS_SZIN.aktiv} strokeWidth="2" />
          <Csuklo x={32} y={62} meret={11} />
          <Csuklo x={288} y={62} meret={11} />
          <text x={160} y={126} textAnchor="middle" fontSize="10.5" style={{ fill: "#475569" }}>
            két merev test, három csukló
          </text>
          <text x={160} y={140} textAnchor="middle" fontSize="10.5" style={{ fill: "#475569" }}>
            → háromcsuklós tartó (6. modul)
          </text>
        </g>
      </g>
    </svg>
  );
}

/* ---------------- 6.10: rúdján terhelt rácsrúd ---------------- */

export function AbraRudjanTerhelt() {
  const W = 140;
  const H = 50;
  const n = Math.hypot(W, H);
  const ux = W / n;
  const uy = H / n;
  const szogRud = (Math.atan2(H, W) * 180) / Math.PI; // a rúd hajlása (fok)
  const Cimke = ({ x, y, szin, children, h = "middle" }) => (
    <text x={x} y={y} textAnchor={h} fontSize="10.5" fontStyle="italic" fontWeight="650" style={{ fill: szin, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
      {children}
    </text>
  );
  const Rud = ({ ox, oy, cim, mod }) => {
    const x1 = ox;
    const y1 = oy;
    const x2 = ox + W;
    const y2 = oy - H;
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const gap = mod === "b" ? 16 : 0;
    // merőleges egységvektor (fölfelé mutató): (-uy, ux) képernyőn: (-uy, -ux)
    const px = -uy;
    const py = -ux;
    return (
      <g>
        <text x={ox + W / 2} y={oy - H - 62} textAnchor="middle" fontSize="12" fontWeight="700" style={{ fill: "#1d3c48" }}>
          {cim}
        </text>
        <line x1={x1 + ux * gap} y1={y1 - uy * gap} x2={x2 - ux * gap} y2={y2 + uy * gap} stroke={RACS_SZIN.rud} strokeWidth="5" strokeLinecap="round" />
        <circle cx={x1} cy={y1} r="4.5" fill="white" stroke="#0f172a" strokeWidth="1.8" />
        <circle cx={x2} cy={y2} r="4.5" fill="white" stroke="#0f172a" strokeWidth="1.8" />
        <Cimke x={x1 - 9} y={y1 + 14} szin="#0f172a">j</Cimke>
        <Cimke x={x2 + 10} y={y2 - 6} szin="#0f172a">k</Cimke>
        {/* a szomszédos rudak erői */}
        {[[x1, y1, -1, 0.35, "S₁"], [x1, y1, -0.3, -1, "S₂"], [x2, y2, 1, 0.3, "S₃"], [x2, y2, 0.25, 1, "S₄"]].map(([qx, qy, dx, dy, c], i) => {
          const m = Math.hypot(dx, dy);
          return (
            <g key={i} opacity={mod === "c" ? 0.45 : 1}>
              <line x1={qx} y1={qy} x2={qx + (dx / m) * 30} y2={qy - (dy / m) * 30} stroke={KEK} strokeWidth="2" markerEnd="url(#th-kek)" />
              <Cimke x={qx + (dx / m) * 42} y={qy - (dy / m) * 42 + 4} szin={KEK}>{c}</Cimke>
            </g>
          );
        })}
        {mod !== "c" && <TeherNyil x={mx} y={my} hossz={40} szog={-90} cimke="F" cimkeEltolas={[6, -2]} />}
        {mod === "b" && (
          <g>
            {[[x1 + ux * gap, y1 - uy * gap, 1, "Sⱼˢ", "Sⱼᵐ"], [x2 - ux * gap, y2 + uy * gap, -1, "Sₖˢ", "Sₖᵐ"]].map(([qx, qy, sgn, c1, c2], i) => (
              <g key={i}>
                <line x1={qx} y1={qy} x2={qx - sgn * ux * 24} y2={qy + sgn * uy * 24} stroke={LILA} strokeWidth="2.2" markerEnd="url(#th-reakcio)" />
                <line x1={qx} y1={qy} x2={qx + px * 24} y2={qy + py * 24} stroke={LILA} strokeWidth="2.2" markerEnd="url(#th-reakcio)" />
                <Cimke x={qx - sgn * ux * 34} y={qy + sgn * uy * 34 + 12} szin={LILA}>{c1}</Cimke>
                <Cimke x={qx + px * 36} y={qy + py * 36 - 2} szin={LILA}>{c2}</Cimke>
              </g>
            ))}
          </g>
        )}
        {mod === "c" && (
          <g>
            {/* a rúdvégi erők ellentettjei: csomóponti terhek a j és k csomóponton */}
            <TeherNyil x={x1} y={y1} hossz={34} szog={-90 + szogRud} cimke="Sⱼᵐ" cimkeEltolas={[-4, 14]} />
            <TeherNyil x={x2} y={y2} hossz={34} szog={-90 + szogRud} cimke="Sₖᵐ" cimkeEltolas={[-30, 14]} />
            <TeherNyil x={x2} y={y2} hossz={34} szog={180 + szogRud} cimke="Fˢ" cimkeEltolas={[-22, -6]} />
          </g>
        )}
      </g>
    );
  };
  return (
    <svg viewBox="0 0 600 236" className="abra w-full h-auto">
      <TartoHegyek />
      <KekHegy />
      <Rud ox={50} oy={150} cim="a) terhelt rácsrúd" mod="a" />
      <Rud ox={240} oy={150} cim="b) elkülönítés" mod="b" />
      <Rud ox={425} oy={150} cim="c) helyettesítés" mod="c" />
      <text x={300} y={206} textAnchor="middle" fontSize="10" style={{ fill: "#475569" }}>
        b) a j, k végpontokra írt nyomatéki egyenletekből Sₖᵐ és Sⱼᵐ; a rúdirányú vetületből Sₖˢ = Sⱼˢ − Fˢ
      </text>
      <text x={300} y={220} textAnchor="middle" fontSize="10" style={{ fill: "#475569" }}>
        c) a rúdvégi erők ellentettjei csomóponti terhek; a j,k rúdban a rúderőn kívül hajlítás is ébred
      </text>
    </svg>
  );
}
