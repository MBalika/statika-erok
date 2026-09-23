"use client";

import { useMemo, useState } from "react";
import { elemez } from "@/lib/tarto";
import { levezetes } from "@/lib/tarto/levezetes";
import { Csuszka } from "@/components/abrak/ErovektorBonto";
import { M as Keplet, MB } from "@/components/ui/Keplet";
import { sz } from "@/lib/szamok";
import { TartoHegyek, Gorgo, Csuklo, Befogas, TeherNyil, KoncentraltNyomatek, SZIN } from "@/components/tartok/TartoElemek";
import { gerberModell, gerberBefogasModell, haromcsuklosModell, ismeretlenTerkep } from "./szamitas";
import { OsszetettHegyek, EroNyil } from "./Rajz";

/*
 * Összetett tartó kalkulátor: paraméteres Gerber-tartó / Gerber befogással / háromcsuklós keret
 * (mindegyiknél a belső csukló terhelhető). A számítómag (`elemez`) adja a reakciókat, a
 * `levezetes` a tankönyv receptje szerinti lépéseket — ezeket írjuk ki MB-vel.
 */

const SZ = 680;
const MA = 420;

const SABLONOK = [
  {
    id: "gerber",
    nev: "Gerber-tartó",
    leiras: "A csukló – B görgő – C belső csukló – D görgő (tankönyv 5.4). Az I. test A–C a fix rész, a II. test C–D a befüggesztett rész. F₁ az I. testen, F₂ és p a II. testen, F_C a csuklón.",
    parameterek: [
      { id: "L1", nev: "A–B távolság", egyseg: "m", min: 2, max: 8, lepes: 0.5, ertek: 4 },
      { id: "L2", nev: "B–C távolság (konzol a csuklóig)", egyseg: "m", min: 0.5, max: 5, lepes: 0.5, ertek: 2 },
      { id: "L3", nev: "C–D távolság (befüggesztett rész)", egyseg: "m", min: 1, max: 8, lepes: 0.5, ertek: 3 },
      { id: "F1", nev: "F₁ az I. testen", egyseg: "kN", min: 0, max: 40, lepes: 1, ertek: 12 },
      { id: "x1", nev: "F₁ helye A-tól", egyseg: "m", min: 0, max: 13, lepes: 0.25, ertek: 2 },
      { id: "szog1", nev: "F₁ iránya (−90 = lefelé)", egyseg: "°", min: -180, max: 0, lepes: 5, ertek: -60 },
      { id: "F2", nev: "F₂ a II. testen (lefelé)", egyseg: "kN", min: 0, max: 40, lepes: 1, ertek: 8 },
      { id: "x2", nev: "F₂ helye C-től", egyseg: "m", min: 0, max: 8, lepes: 0.25, ertek: 2 },
      { id: "p", nev: "p a II. testen (lefelé)", egyseg: "kN/m", min: 0, max: 20, lepes: 0.5, ertek: 0 },
      { id: "FC", nev: "F_C a csuklón (lefelé)", egyseg: "kN", min: 0, max: 40, lepes: 1, ertek: 0 },
    ],
    keszit: (p) => gerberModell({ xB: p.L1, xC: p.L1 + p.L2, xD: p.L1 + p.L2 + p.L3, F1: p.F1, x1: Math.min(p.x1, p.L1 + p.L2), szog1: p.szog1, F2: p.F2, x2: p.L1 + p.L2 + Math.min(p.x2, p.L3), p: p.p, FC: p.FC }),
  },
  {
    id: "befogas",
    nev: "Gerber befogással",
    leiras: "P bal vég – A görgő – C belső csukló – B befogás (tankönyv 5.5, H05/3). Most az I. test (P–C) a befüggesztett rész, a II. test (C–B) a befogással a fix rész. F₁ a bal végen, p az A–C szakaszon, F₂ a II. testen.",
    parameterek: [
      { id: "xA", nev: "P–A (bal konzol)", egyseg: "m", min: 0.5, max: 4, lepes: 0.5, ertek: 2 },
      { id: "LAC", nev: "A–C távolság", egyseg: "m", min: 2, max: 10, lepes: 0.5, ertek: 8 },
      { id: "LCB", nev: "C–B távolság", egyseg: "m", min: 1, max: 8, lepes: 0.5, ertek: 4 },
      { id: "F1", nev: "F₁ a bal végen", egyseg: "kN", min: 0, max: 40, lepes: 1, ertek: 12 },
      { id: "szog1", nev: "F₁ iránya (150 = balra-fel 30°)", egyseg: "°", min: 0, max: 360, lepes: 5, ertek: 150 },
      { id: "p", nev: "p az A–C szakaszon (lefelé)", egyseg: "kN/m", min: 0, max: 20, lepes: 0.5, ertek: 0 },
      { id: "F2", nev: "F₂ a II. testen (lefelé)", egyseg: "kN", min: 0, max: 40, lepes: 1, ertek: 0 },
      { id: "x2", nev: "F₂ helye C-től", egyseg: "m", min: 0, max: 8, lepes: 0.25, ertek: 2 },
    ],
    keszit: (p) => gerberBefogasModell({ xA: p.xA, xC: p.xA + p.LAC, xB: p.xA + p.LAC + p.LCB, F1: p.F1, szog1: p.szog1, F2: p.F2, x2: p.xA + p.LAC + Math.min(p.x2, p.LCB), p: p.p }),
  },
  {
    id: "harom",
    nev: "Háromcsuklós keret",
    leiras: "A és B külső csukló azonos magasságban, C belső csukló a gerendán (tankönyv 5.8, H05/2). F függőleges a gerendán, p vízszintes a bal oszlopon, F_C a csuklón. A csuklót emelve törtvonalú (ívszerű) gerendát kapsz.",
    parameterek: [
      { id: "L", nev: "Fesztáv, L", egyseg: "m", min: 4, max: 14, lepes: 0.5, ertek: 8 },
      { id: "h", nev: "Oszlopmagasság, h", egyseg: "m", min: 2, max: 7, lepes: 0.5, ertek: 4 },
      { id: "xC", nev: "A csukló helye A-tól", egyseg: "m", min: 1, max: 13, lepes: 0.5, ertek: 4 },
      { id: "dC", nev: "A csukló emelése az oszlopok fölé", egyseg: "m", min: 0, max: 3, lepes: 0.5, ertek: 0 },
      { id: "F", nev: "F a gerendán (lefelé)", egyseg: "kN", min: 0, max: 40, lepes: 1, ertek: 12 },
      { id: "xF", nev: "F helye A-tól", egyseg: "m", min: 0, max: 14, lepes: 0.25, ertek: 2.5 },
      { id: "p", nev: "p a bal oszlopon (jobbra)", egyseg: "kN/m", min: 0, max: 15, lepes: 0.5, ertek: 4 },
      { id: "FC", nev: "F_C a csuklón (lefelé)", egyseg: "kN", min: 0, max: 40, lepes: 1, ertek: 0 },
    ],
    keszit: (p) => {
      const xC = Math.min(p.xC, p.L - 1);
      return haromcsuklosModell({ L: p.L, hA: p.h, hB: p.h, xC, hC: p.h + p.dC, F: p.F, xF: Math.min(p.xF, p.L), p: p.p, FC: p.FC });
    },
  },
];

const alapParameterek = (s) => Object.fromEntries(s.parameterek.map((p) => [p.id, p.ertek]));

/** A terhek rajza a normalizált modellből (csomóponti erők, rúdon ható erők, megoszló terhek). */
function Terhek({ m, kx, ky }) {
  const elemek = [];
  let maxQ = 0;
  for (const rud of m.rudak) for (const q of rud.megoszlok) maxQ = Math.max(maxQ, Math.hypot(q.qx1, q.qy1), Math.hypot(q.qx2, q.qy2));
  const qLeptek = maxQ > 1e-9 ? 30 / maxQ : 0;
  const ero = (kulcs, X, Y, Fx, Fy) => {
    const n = Math.hypot(Fx, Fy);
    if (n < 1e-9) return;
    const szog = (Math.atan2(Fy, Fx) * 180) / Math.PI;
    const ex = Fx / n, ey = Fy / n;
    const h = Math.min(80, 30 + 2 * n);
    const cimke = `${sz(n, n % 1 ? 1 : 0)} kN`;
    // a felirat a nyíl farkánál; ha a rajz szélén kilógna, a farok alá (felfelé mutató nyílnál) vagy fölé (lefelé mutatónál) kerül
    const tx = X - ex * 4 - h * ex, szeles = 7.5 * cimke.length;
    let dx = -ex * 4 + (Math.abs(ex) < 0.3 ? 8 : -ex * 26 - 14), dy = ey * 4 + (Math.abs(ey) < 0.3 ? -8 : ey * 10 + 4);
    if (tx + dx < 4) { dx = 4 - tx; dy = ey >= 0 ? 18 : -10; }
    else if (tx + dx + szeles > SZ - 4) { dx = SZ - 4 - szeles - tx; dy = ey >= 0 ? 18 : -10; }
    elemek.push(<TeherNyil key={kulcs} x={X - ex * 4} y={Y + ey * 4} hossz={h} szog={szog} cimke={cimke} cimkeEltolas={[dx, dy]} />);
  };
  m.csomopontiTerhek.forEach((t, i) => {
    const cs = m.csomopontok[i];
    ero(`cs${i}`, kx(cs.x), ky(cs.y), t.Fx, t.Fy);
    if (Math.abs(t.M) > 1e-9) elemek.push(<KoncentraltNyomatek key={`csm${i}`} x={kx(cs.x)} y={ky(cs.y)} irany={t.M > 0 ? 1 : -1} cimke={`${sz(Math.abs(t.M), 0)} kNm`} />);
  });
  for (const rud of m.rudak) {
    const { cos: c, sin: s } = rud;
    rud.pontTerhek.forEach((p, i) => ero(`p${rud.id}-${i}`, kx(rud.x1 + p.a * c), ky(rud.y1 + p.a * s), p.Px * c - p.Py * s, p.Px * s + p.Py * c));
    rud.megoszlok.forEach((q, i) => {
      const dL = q.a2 - q.a1;
      if (dL < 1e-9 || qLeptek === 0) return;
      const pxHossz = dL * Math.abs(kx(1) - kx(0));
      const n = Math.max(2, Math.round(pxHossz / 20));
      const nyilak = [], farkak = [];
      for (let k = 0; k <= n; k++) {
        const u = k / n;
        const a = q.a1 + dL * u;
        const qx = q.qx1 + (q.qx2 - q.qx1) * u, qy = q.qy1 + (q.qy2 - q.qy1) * u;
        const Fx = qx * c - qy * s, Fy = qx * s + qy * c;
        const nagy = Math.hypot(Fx, Fy);
        const X = kx(rud.x1 + a * c), Y = ky(rud.y1 + a * s);
        if (nagy < 1e-9) { farkak.push([X, Y]); continue; }
        const h = nagy * qLeptek;
        const tx = X - (Fx / nagy) * h, ty = Y + (Fy / nagy) * h;
        farkak.push([tx, ty]);
        nyilak.push(<line key={k} x1={tx} y1={ty} x2={X} y2={Y} stroke={SZIN.teher} strokeWidth="1.5" markerEnd="url(#th-teher)" />);
      }
      const kozep = farkak[Math.floor(farkak.length / 2)];
      const q1 = Math.hypot(q.qx1, q.qy1);
      elemek.push(
        <g key={`q${rud.id}-${i}`}>
          <polyline points={farkak.map((f) => f.join(",")).join(" ")} fill="none" stroke={SZIN.teher} strokeWidth="1.6" />
          {nyilak}
          <text x={kozep[0] + (Math.abs(c) > 0.7 ? 0 : -8)} y={kozep[1] + (Math.abs(c) > 0.7 ? -7 : 4)} textAnchor={Math.abs(c) > 0.7 ? "middle" : "end"} fontSize="12" fontWeight="650" style={{ fill: SZIN.teher, paintOrder: "stroke", stroke: "white", strokeWidth: 3.5 }}>
            {sz(q1, q1 % 1 ? 1 : 0)} kN/m
          </text>
        </g>,
      );
    });
  }
  return <g>{elemek}</g>;
}

/** A prózában előforduló jelöléseket (A_x, C_y, O_1) képletként szedjük. */
function Szoveg({ children }) {
  const darabok = String(children).split(/(\b[A-Z][a-z]?_[A-Za-z0-9]+\b)/g);
  return darabok.map((d, i) => (/^[A-Z][a-z]?_[A-Za-z0-9]+$/.test(d) ? <Keplet key={i}>{d.replace(/_(\w+)/, "_{$1}")}</Keplet> : <span key={i}>{d}</span>));
}

export default function OsszetettKalk() {
  const [sablonId, setSablonId] = useState(SABLONOK[0].id);
  const sablon = SABLONOK.find((s) => s.id === sablonId) ?? SABLONOK[0];
  const [parak, setParak] = useState(() => alapParameterek(SABLONOK[0]));
  const [mutatott, setMutatott] = useState(2);
  const [kiemeltFopont, setKiemeltFopont] = useState(null);

  const valt = (id) => {
    const uj = SABLONOK.find((s) => s.id === id);
    setSablonId(id);
    setParak(alapParameterek(uj));
    setMutatott(2);
  };

  const bemenet = useMemo(() => sablon.keszit(parak), [sablon, parak]);
  const eredmeny = useMemo(() => {
    try {
      return elemez(bemenet);
    } catch (e) {
      return { ok: false, hibak: ["Számítási hiba: " + e.message] };
    }
  }, [bemenet]);
  const lv = useMemo(() => {
    if (!eredmeny.ok) return null;
    try {
      return levezetes(bemenet, eredmeny);
    } catch (e) {
      return null;
    }
  }, [bemenet, eredmeny]);
  const ertek = useMemo(() => (lv ? ismeretlenTerkep(lv) : {}), [lv]);

  const rajz = useMemo(() => {
    if (!eredmeny.ok) return null;
    const m = eredmeny.modell;
    const xs = m.csomopontok.map((c) => c.x), ys = m.csomopontok.map((c) => c.y);
    const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
    const szel = Math.max(maxX - minX, 1), mag = Math.max(maxY - minY, 0.5);
    const L = Math.min((SZ - 160) / szel, (MA - 200) / Math.max(mag, 1.5));
    const OX = (SZ - szel * L) / 2 - minX * L;
    const OY = MA * 0.55 + ((maxY + minY) / 2) * L;
    return { kx: (x) => OX + x * L, ky: (y) => OY - y * L, L, m };
  }, [eredmeny]);

  if (!eredmeny.ok) {
    return (
      <div className="my-6 rounded-2xl border border-rose-300 bg-rose-50 p-5">
        <p className="text-[13px] font-bold tracking-[0.16em] text-rose-700 uppercase">Nem megoldható</p>
        <ul className="mt-2 list-disc pl-5 text-[14px] text-petrol-800">{(eredmeny.hibak ?? []).map((h, i) => <li key={i}>{h}</li>)}</ul>
        <button type="button" onClick={() => valt(sablonId)} className="mt-4 rounded-lg bg-petrol-700 px-4 py-2 text-[13px] font-semibold text-white">Alaphelyzet</button>
      </div>
    );
  }

  const r = rajz;
  const m = r.m;
  const hingeCsomopont = m.rudak.find((rud) => rud.csukloA || rud.csukloB);
  const hingeP = hingeCsomopont ? (hingeCsomopont.csukloA ? [hingeCsomopont.x1, hingeCsomopont.y1] : [hingeCsomopont.x2, hingeCsomopont.y2]) : null;
  const Cx = ertek.C_x ?? 0, Cy = ertek.C_y ?? 0;
  const csX = m.csomopontok.map((c) => r.kx(c.x));
  const kozepX = (Math.min(...csX) + Math.max(...csX)) / 2;
  // igaz, ha a csomópontból indul rúd a (ex, ey) képernyő-irányban — ilyenkor a reakció nyila a rúd vonalára esne, ezért mellé toljuk
  const rudIranyban = (cs, ex, ey) =>
    m.rudak.some((rud) => {
      const aVeg = Math.abs(rud.x1 - cs.x) < 1e-9 && Math.abs(rud.y1 - cs.y) < 1e-9;
      const bVeg = Math.abs(rud.x2 - cs.x) < 1e-9 && Math.abs(rud.y2 - cs.y) < 1e-9;
      if (!aVeg && !bVeg) return false;
      const dx = aVeg ? rud.x2 - rud.x1 : rud.x1 - rud.x2, dy = aVeg ? rud.y2 - rud.y1 : rud.y1 - rud.y2;
      const n = Math.hypot(dx, dy);
      return n > 1e-9 && (dx / n) * ex - (dy / n) * ey > 0.95;
    });
  const lepesek = lv?.lepesek ?? [];
  const osszes = lepesek.length;
  const lathato = lepesek.slice(0, Math.min(mutatott, osszes));
  const ismeretlenSzam = lv ? lv.ismeretlenek.length : 0;
  const egyenletSzam = lv ? 3 * lv.testekSzama : 0;

  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white shadow-sm shadow-petrol-900/[0.04]">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-b border-[color:var(--keret)] bg-linear-to-r from-petrol-800 to-petrol-700 px-5 py-3.5">
        <span className="rounded-md bg-naracs-500 px-2 py-0.5 text-[10.5px] font-bold tracking-[0.14em] text-white uppercase">Kalkulátor</span>
        <h3 className="text-[15px] font-semibold text-white">Összetett tartó kalkulátor</h3>
        <span className="szamok ml-auto text-[11.5px] text-petrol-200">
          {lv ? `${lv.testekSzama} test · ${ismeretlenSzam} ismeretlen · ${egyenletSzam} egyenlet` : ""}
          {eredmeny.ellenorzes.rendben ? " · egyensúly ✓" : " · egyensúly ✗"}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5 border-b border-[color:var(--keret)] bg-petrol-50/60 px-4 py-2.5">
        {SABLONOK.map((s) => (
          <button key={s.id} type="button" onClick={() => valt(s.id)} className={`rounded-lg px-3 py-1.5 text-[12.5px] font-semibold transition ${s.id === sablonId ? "bg-petrol-800 text-white" : "bg-white text-petrol-700 ring-1 ring-petrol-200 hover:bg-petrol-50"}`}>
            {s.nev}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1.45fr_1fr] [&>*]:min-w-0">
        <div className="racs-vilagos border-b border-[color:var(--keret)] p-3 lg:border-r lg:border-b-0">
          <svg viewBox={`0 0 ${SZ} ${MA}`} className="abra h-auto w-full">
            <TartoHegyek />
            <OsszetettHegyek />
            {m.rudak.map((rud) => (
              <line key={rud.id} x1={r.kx(rud.x1)} y1={r.ky(rud.y1)} x2={r.kx(rud.x2)} y2={r.ky(rud.y2)} stroke={SZIN.tarto} strokeWidth="5" strokeLinecap="round" />
            ))}
            {m.tamaszok.map((t, i) => {
              const cs = m.csomopontok[t.ics];
              const x = r.kx(cs.x), y = r.ky(cs.y);
              if (t.tipus === "csuklo") return <Csuklo key={i} x={x} y={y} />;
              if (t.tipus === "befogas") return <Befogas key={i} x={x} y={y} irany="jobb" hossz={44} />;
              return <Gorgo key={i} x={x} y={y} szog={t.szog - 90} />;
            })}
            {m.csomopontok.map((cs) => {
              const tamasz = m.tamaszok.find((t) => t.ics === cs.index);
              const csuklos = hingeP && Math.abs(cs.x - hingeP[0]) < 1e-9 && Math.abs(cs.y - hingeP[1]) < 1e-9;
              // a belső csukló betűje a tartó alá kerül (fölötte a csuklóerő nyila és felirata), a befogásé a fal alá
              const dy = tamasz ? (tamasz.tipus === "befogas" ? 44 : 28) : csuklos ? 22 : -12;
              return (
                <text key={cs.id} x={r.kx(cs.x) + (tamasz ? (cs.x <= 0.01 ? -16 : 16) : 0)} y={r.ky(cs.y) + dy} textAnchor="middle" fontSize="13" fontStyle="italic" fontWeight="650" style={{ fill: SZIN.tarto, paintOrder: "stroke", stroke: "white", strokeWidth: 3.5 }}>
                  {cs.id}
                </text>
              );
            })}
            {hingeP && <circle cx={r.kx(hingeP[0])} cy={r.ky(hingeP[1])} r="5" fill="white" stroke={SZIN.tarto} strokeWidth="2.2" />}
            <Terhek m={m} kx={r.kx} ky={r.ky} />
            {/* reakciók: a támadáspontból kifelé, a tényleges irányba; ha a nyíl egy rúd vonalára esne, mellé toljuk, hogy látsszon */}
            {eredmeny.reakciok.map((re, i) => {
              const cs = m.csomopontok.find((c) => c.id === re.csomopont);
              const X = r.kx(cs.x), Y = r.ky(cs.y);
              const nyilak = [];
              const fx = re.Fx ?? 0, fy = re.Fy ?? 0;
              const nev = re.csomopont;
              const hossz = (n) => Math.max(18, Math.min(90, n * 2));
              const vizszintes = () => {
                const ex = Math.sign(fx), h = hossz(Math.abs(fx));
                const rudon = rudIranyban(cs, ex, 0);
                // rúd vonalába eső nyíl: befogásnál a rúd alá, csuklós/görgős támasznál (a támaszjel miatt) a rúd fölé tolva, felirat a nyíl alatt/mellett középen;
                // kifelé mutató nyíl: felirat a támaszjel alatt (ha a függőleges reakció lefelé mutat, és így a felirata a támasz alá kerül, akkor a nyíl fölé)
                const fel = rudon && re.tipus !== "befogas";
                const YY = rudon ? (fel ? Y - 9 : Y + 9) : Y;
                let elt, horg;
                if (rudon) { elt = fel ? [ex * 4, 4] : [-ex * h / 2, 22]; horg = fel ? (ex > 0 ? "start" : "end") : "middle"; }
                else if (fy < -1e-6) { elt = [0, -8]; horg = ex > 0 ? "end" : "start"; }
                else { elt = re.tipus === "befogas" ? [-ex * 8, 40] : [0, 40]; horg = ex > 0 ? "end" : "start"; }
                nyilak.push(<EroNyil key="x" X={X} Y={YY} Fx={fx} Fy={0} leptek={2} cimke={`${nev}ₓ = ${sz(Math.abs(fx), 2)}`} cimkeEltolas={elt} horgony={horg} />);
              };
              const fuggoleges = (kulcs, cimke, Fx_, Fy_) => {
                const n = Math.hypot(Fx_, Fy_);
                const ex = Fx_ / n, ey = -Fy_ / n;
                const rudon = Math.abs(ex) < 0.05 && rudIranyban(cs, 0, ey);
                const oldal = X < kozepX - 1 ? -1 : 1;
                const XX = rudon ? X + oldal * 9 : X;
                let elt, horg;
                if (rudon) { elt = [oldal * 6, 4]; horg = oldal < 0 ? "end" : "start"; }
                else if (Fy_ > 0 && re.tipus === "befogas") { elt = [8, 6]; horg = "start"; }
                else if (Fy_ > 0) { elt = [0, -8]; horg = "middle"; }
                else if (cs.x <= 0.01) { elt = [8, 14]; horg = "start"; } // lefelé (a támaszjelen át): a csomópont betűjével ellentétes oldalra, a hegy alá
                else { elt = [-8, 14]; horg = "end"; }
                nyilak.push(<EroNyil key={kulcs} X={XX} Y={Y} Fx={Fx_} Fy={Fy_} leptek={2} cimke={cimke} cimkeEltolas={elt} horgony={horg} />);
              };
              if (re.tipus === "csuklo" || re.tipus === "befogas") {
                if (Math.abs(fx) > 1e-6) vizszintes();
                if (Math.abs(fy) > 1e-6) fuggoleges("y", `${nev}ᵧ = ${sz(Math.abs(fy), 2)}`, 0, fy);
                if (re.tipus === "befogas" && Math.abs(re.M ?? 0) > 1e-6) {
                  // a befogási nyomaték íve; a felirata az ív és a függőleges reakció nyila fölé, középre
                  nyilak.push(<KoncentraltNyomatek key="m" x={X} y={Y} r={26} irany={re.M > 0 ? 1 : -1} szin="#7c3aed" />);
                  nyilak.push(
                    <text key="mc" x={X} y={Y - Math.max(38, (fy > 1e-6 ? hossz(fy) : 0) + 12)} textAnchor="middle" fontSize="12" fontWeight="650" fontStyle="italic" style={{ fill: "#7c3aed", paintOrder: "stroke", stroke: "white", strokeWidth: 3.5 }}>
                      M = {sz(Math.abs(re.M), 2)}
                    </text>,
                  );
                }
              } else if (Math.hypot(fx, fy) > 1e-6) {
                fuggoleges("n", `${nev} = ${sz(Math.hypot(fx, fy), 2)}`, fx, fy);
              }
              return <g key={i}>{nyilak}</g>;
            })}
            {/* belső csuklóerő a csuklós rúdvégű testre (kék); Cᵧ lefelé mutató nyílnál a Cₓ felirata a nyíl fölé kerül, hogy ne fedjék egymást */}
            {hingeP && lv && (() => {
              const HX = r.kx(hingeP[0]), HY = r.ky(hingeP[1]);
              // felfelé mutató Cᵧ felirata balra; ha közvetlenül balra támasz van (a felirata ütközne), jobbra
              const tamaszBalra = m.tamaszok.some((t) => { const c = m.csomopontok[t.ics]; return HX - r.kx(c.x) > 0 && HX - r.kx(c.x) < 90 && Math.abs(r.ky(c.y) - HY) < 30; });
              const cyJobbra = Cy < 0 || tamaszBalra;
              // a Cₓ felirata a nyíl alá kerül; ha ott rúd fut (a csuklóból lefelé induló rúd, pl. keret gerince), a nyíl fölé
              const lefeleRud = (oldal) =>
                m.rudak.some((rud) => {
                  const aVeg = Math.abs(rud.x1 - hingeP[0]) < 1e-9 && Math.abs(rud.y1 - hingeP[1]) < 1e-9;
                  const bVeg = Math.abs(rud.x2 - hingeP[0]) < 1e-9 && Math.abs(rud.y2 - hingeP[1]) < 1e-9;
                  const my = aVeg ? rud.y2 : bVeg ? rud.y1 : null, mx = aVeg ? rud.x2 : bVeg ? rud.x1 : null;
                  return my !== null && my < hingeP[1] - 1e-9 && (oldal === 0 || Math.sign(mx - hingeP[0]) === oldal);
                });
              const rudAlatta = lefeleRud(Math.sign(Cx || 1));
              // lefelé mutató Cᵧ: felirat jobbra a hegy alá; ha a csuklóból lefelé fut rúd (keret gerince), a hegy alá középre
              const cyLentElt = lefeleRud(0) ? [0, 22] : [8, 14];
              return (
                <g>
                  {Math.abs(Cx) > 1e-6 && <EroNyil X={HX + 6} Y={HY} Fx={Cx} Fy={0} leptek={1.6} szin="#0369a1" hegy="oh-kek" vastag={2.2} cimke={`Cₓ = ${sz(Math.abs(Cx), 2)}`} cimkeEltolas={rudAlatta ? [Cx < 0 ? -2 : 2, -6] : [0, 18]} horgony={Cx < 0 ? "end" : "start"} />}
                  {Math.abs(Cy) > 1e-6 && <EroNyil X={HX + 6} Y={HY} Fx={0} Fy={Cy} leptek={1.6} szin="#0369a1" hegy="oh-kek" vastag={2.2} cimke={`Cᵧ = ${sz(Math.abs(Cy), 2)}`} cimkeEltolas={Cy > 0 ? [cyJobbra ? 8 : -8, -4] : cyLentElt} horgony={Cy > 0 ? (cyJobbra ? "start" : "end") : cyLentElt[0] === 0 ? "middle" : "start"} />}
                </g>
              );
            })()}
            {kiemeltFopont && (
              <g>
                <circle cx={r.kx(kiemeltFopont.P[0])} cy={r.ky(kiemeltFopont.P[1])} r="9" fill="none" stroke="#6d28d9" strokeWidth="2" strokeDasharray="3 2.5" />
                <circle cx={r.kx(kiemeltFopont.P[0])} cy={r.ky(kiemeltFopont.P[1])} r="3" fill="#6d28d9" />
              </g>
            )}
          </svg>
          <p className="mt-1 text-center text-[11.5px] text-petrol-500">
            Lila: külső reakciók a tényleges irányukkal; kék: a belső csuklóerő a csuklós rúdvégű (II.) testre — az I. testre az ellentettje hat
            {(parak.FC ?? 0) > 0 ? ", a csuklón ható F_C-vel együtt (a levezetés a csuklón ható terhet az I. testhez sorolja)." : "."}
          </p>
        </div>

        <div className="finom-gorgeto max-h-[640px] overflow-y-auto p-4 sm:p-5">
          <p className="text-[13px] text-petrol-500">{sablon.leiras}</p>
          <div className="mt-3 space-y-2.5">
            {sablon.parameterek.map((par) => (
              <Csuszka key={par.id} cimke={par.nev} ertek={parak[par.id]} egyseg={par.egyseg} min={par.min} max={par.max} lepes={par.lepes} tizedes={par.lepes < 1 ? (par.lepes < 0.5 ? 2 : 1) : 0} onChange={(v) => setParak((p) => ({ ...p, [par.id]: v }))} />
            ))}
          </div>
          <p className="mt-4 text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">Reakciók és csuklóerő</p>
          <div className="mt-1.5 overflow-hidden rounded-xl border border-[color:var(--keret)]">
            <table className="w-full text-[12.5px]">
              <thead className="bg-petrol-50 text-[10.5px] tracking-wider text-petrol-500 uppercase">
                <tr><th className="px-2.5 py-1.5 text-left">Hely</th><th className="px-2.5 py-1.5 text-right">Vízsz.</th><th className="px-2.5 py-1.5 text-right">Függ.</th><th className="px-2.5 py-1.5 text-right">Nyomaték</th></tr>
              </thead>
              <tbody className="szamok">
                {eredmeny.reakciok.map((re, i) => (
                  <tr key={i} className="border-t border-petrol-100">
                    <td className="px-2.5 py-1.5 text-petrol-800">{re.csomopont} <span className="ml-1 text-[10.5px] text-petrol-400">{{ csuklo: "csukló", gorgo: "görgő", befogas: "befogás", rud: "rúd" }[re.tipus]}</span></td>
                    <td className="px-2.5 py-1.5 text-right text-petrol-900">{re.Fx === undefined ? "–" : sz(re.Fx, 2)}</td>
                    <td className="px-2.5 py-1.5 text-right text-petrol-900">{re.Fy === undefined ? "–" : sz(re.Fy, 2)}</td>
                    <td className="px-2.5 py-1.5 text-right text-petrol-900">{re.M === undefined ? "–" : sz(re.M, 2)}</td>
                  </tr>
                ))}
                {lv && (
                  <tr className="border-t border-petrol-100 bg-sky-50/60">
                    <td className="px-2.5 py-1.5 text-sky-900">C <span className="ml-1 text-[10.5px] text-sky-600">belső csukló, a II. testre</span></td>
                    <td className="px-2.5 py-1.5 text-right text-sky-900">{sz(Cx, 2)}</td>
                    <td className="px-2.5 py-1.5 text-right text-sky-900">{sz(Cy, 2)}</td>
                    <td className="px-2.5 py-1.5 text-right text-sky-900">0</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[11.5px] text-petrol-500">
            Fokszám-mérleg: {lv ? `${lv.testekSzama} test × 3 = ${egyenletSzam} egyenlet, ${ismeretlenSzam} ismeretlen` : ""} → statikailag határozott. Ellenőrzés az egészre: ΣF<sub>x</sub> = {sz(eredmeny.ellenorzes.SzFx, 4)}, ΣF<sub>y</sub> = {sz(eredmeny.ellenorzes.SzFy, 4)}, ΣM = {sz(eredmeny.ellenorzes.SzM, 4)}.
          </p>
        </div>
      </div>

      {/* levezetés */}
      {lv && (
        <div className="border-t border-[color:var(--keret)] bg-white px-4 py-4 sm:px-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-violet-600 px-2 py-0.5 text-[10.5px] font-bold tracking-[0.14em] text-white uppercase">Levezetés</span>
            <span className="text-[14px] font-semibold text-petrol-900">Így írnád le a gyakorlaton — testenként, egyismeretlenes egyenletekkel</span>
            <span className="ml-auto text-[12px] text-petrol-400">{Math.min(mutatott, osszes)} / {osszes}</span>
          </div>
          <ol className="mt-3 space-y-2.5">
            {lathato.map((l, i) => {
              const ellenorzo = l.cim.startsWith("Ellenőrzés");
              const eredm = l.cim.startsWith("Eredmény");
              const aktiv = i === lathato.length - 1;
              const szin = ellenorzo ? "border-emerald-200 bg-emerald-50/50" : eredm ? "border-naracs-200 bg-naracs-50/50" : aktiv ? "border-violet-300 bg-violet-50/40" : "border-[color:var(--keret)] bg-white";
              return (
                <li key={i} className={`rounded-xl border p-3 ${szin}`} onMouseEnter={() => setKiemeltFopont(l.fopont ?? null)} onMouseLeave={() => setKiemeltFopont(null)}>
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-petrol-800 text-[11.5px] font-bold text-white">{i + 1}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13.5px] font-semibold text-petrol-900"><Szoveg>{l.cim}</Szoveg></p>
                      {l.szoveg && <p className="mt-1 text-[12.5px] leading-relaxed text-petrol-600"><Szoveg>{l.szoveg}</Szoveg></p>}
                      {l.felsorolas && (
                        <ul className="mt-2 grid gap-1 sm:grid-cols-2">
                          {l.felsorolas.map((f, k) => (
                            <li key={k} className="flex items-baseline gap-2 rounded-lg bg-white/80 px-2.5 py-1.5 text-[12.5px] ring-1 ring-petrol-100">
                              <span className="shrink-0 font-semibold text-violet-700"><Keplet>{f.jel}</Keplet></span>
                              <span className="text-petrol-600">{f.leiras}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {l.terhek && (
                        <ul className="mt-2 grid gap-1 sm:grid-cols-2">
                          {l.terhek.map((tt, k) => (
                            <li key={k} className="flex items-baseline gap-2 rounded-lg bg-white/80 px-2.5 py-1.5 text-[12.5px] ring-1 ring-petrol-100">
                              <span className="shrink-0 font-semibold text-naracs-600"><Keplet>{tt.nev}</Keplet></span>
                              <span className="text-petrol-600">{tt.leiras}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {l.kepletek?.map((k, j) => (
                        <MB key={j} className="mt-1 text-[15px] [&_.katex-display]:my-1.5">{k}</MB>
                      ))}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {mutatott < osszes ? (
              <>
                <button type="button" onClick={() => setMutatott((n) => Math.min(osszes, n + 1))} className="rounded-lg bg-petrol-800 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-petrol-700">Következő lépés →</button>
                <button type="button" onClick={() => setMutatott(osszes)} className="rounded-lg bg-white px-4 py-2 text-[13px] font-semibold text-petrol-700 ring-1 ring-petrol-200 transition hover:bg-petrol-50">Mutasd az egészet</button>
              </>
            ) : (
              <button type="button" onClick={() => setMutatott(2)} className="rounded-lg bg-white px-4 py-2 text-[13px] font-semibold text-petrol-700 ring-1 ring-petrol-200 transition hover:bg-petrol-50">↺ Elölről, lépésenként</button>
            )}
            <span className="text-[12px] text-petrol-400">A program itt nem a merevségi módszerrel számol, hanem egyensúlyi egyenletekből — a két út végeredménye egyezik.</span>
          </div>
        </div>
      )}
    </div>
  );
}
