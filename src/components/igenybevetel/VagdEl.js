"use client";

import { useMemo, useRef, useState } from "react";
import { TartoHegyek, Tarto, Gorgo, Csuklo, Befogas, TeherNyil, ReakcioNyil, MegoszloTeher, KoncentraltNyomatek, TamaszCimke, SZIN } from "@/components/tartok/TartoElemek";
import { Fogopont } from "@/components/abrak/SvgElemek";
import Diagram, { geometria, helyIvhosszon, osszHossz, SZINEK, ert } from "@/components/igenybevetel/Diagram";
import { eredmeny } from "@/components/igenybevetel/Modellek";
import { M as Keplet } from "@/components/ui/Keplet";
import { sz, szK } from "@/lib/szamok";
import { reszErok, tagok } from "@/components/igenybevetel/BalResz";

/**
 * „Vágd el a tartót” – felfedező. A hallgató egy húzható K keresztmetszetet
 * tol végig egy választható vízszintes tartón; a vágás két oldalán megjelenik a
 * két szabadtest-ábra (a keresztmetszeten N, V, M a pozitív értelemben), a
 * három érték élőben, és alul az N, V, M ábra a vágás helyéig „épül”.
 * Mindent a számítómag (elemez) számol; a bal részből felírt összegek a
 * tankönyv (←), (↑), (↷) írásmódját követik.
 */

const VALASZTEK = [
  { id: "gyf2", nev: "Kéttámaszú (F + p)" },
  { id: "gyf1", nev: "Konzol" },
  { id: "gyf3", nev: "Konzolos kéttámaszú" },
];

const SZ = 600, Y1 = 78, Y2 = 236, MA = 322;
const EPS = 1e-6;


export default function VagdEl() {
  const [id, setId] = useState("gyf2");
  const [s, setS] = useState(2.5);
  const svgRef = useRef(null);
  const e = eredmeny(id);
  const teljes = osszHossz(e);
  const g = useMemo(() => geometria(e, { szel: SZ }), [e]);
  const hely = helyIvhosszon(e, Math.min(s, teljes));
  const { N, V, M } = hely.ertek;
  const xs = e.modell.csomopontok[0].x + Math.min(s, teljes); // globális x (vízszintes tartó, a bal végtől)
  const minX = g.minX, maxX = g.maxX;

  const valt = (uj) => { setId(uj); setS(osszHossz(eredmeny(uj)) * 0.4); };

  const huzas = (ev) => {
    ev.preventDefault();
    const svg = svgRef.current;
    if (!svg) return;
    const mozgat = (esem) => {
      const r = svg.getBoundingClientRect();
      const px = ((esem.clientX - r.left) / r.width) * SZ;
      const x = (px - g.kx(minX)) / g.L;
      setS(Math.max(0, Math.min(teljes, Math.round(x * 20) / 20)));
    };
    mozgat(ev);
    const vege = () => { window.removeEventListener("pointermove", mozgat); window.removeEventListener("pointerup", vege); };
    window.addEventListener("pointermove", mozgat);
    window.addEventListener("pointerup", vege);
  };

  const bal = reszErok(e, minX, xs);
  const jobb = reszErok(e, xs, maxX + 1);
  const balEsAVagas = xs > minX + EPS;
  const jobbEsAVagas = xs < maxX - EPS;

  // a bal részből felírt összegek (tankönyvi írásmód)
  const oN = tagok(bal, (f) => (f.Fx ? [{ ertek: -f.Fx, kif: `${sz(Math.abs(f.Fx), 2)}` }] : []));
  const oV = tagok(bal, (f) => (f.Fy ? [{ ertek: f.Fy, kif: f.fajta === "megoszlo" ? `${sz(Math.abs(f.qy), 1)}\\cdot ${sz(f.hossz, 2)}` : `${sz(Math.abs(f.Fy), 2)}` }] : []));
  const oM = tagok(bal, (f) => {
    const t = [];
    if (f.Fy) {
      const kar = xs - f.x;
      t.push({ ertek: f.Fy * kar, kif: `${f.fajta === "megoszlo" ? `${sz(Math.abs(f.qy), 1)}\\cdot ${sz(f.hossz, 2)}` : sz(Math.abs(f.Fy), 2)}\\cdot ${sz(kar, 2)}` });
    }
    if (f.M) t.push({ ertek: -f.M, kif: `${sz(Math.abs(f.M), 2)}` });
    return t;
  });

  /* ---------- rajz ---------- */
  const kx = g.kx;
  const XK = kx(xs);
  const m = e.modell;

  const Reszlet = ({ erok, xa, xb, y, eltol, vagasBal, vagasJobb }) => {
    const x1 = kx(xa) + eltol, x2 = kx(xb) + eltol;
    const elemek = [];
    for (const [i, f] of erok.entries()) {
      const X = kx(f.x) + eltol;
      if (f.fajta === "megoszlo") {
        elemek.push(<MegoszloTeher key={i} x1={kx(f.a) + eltol} x2={kx(f.b) + eltol} y={y} p1={-f.qy} leptek={7} />);
      } else if (f.fajta === "ero") {
        elemek.push(<TeherNyil key={i} x={X} y={y} hossz={44} szog={(Math.atan2(f.Fy, f.Fx) * 180) / Math.PI} cimke={`${ert(Math.hypot(f.Fx, f.Fy))}`} cimkeEltolas={[6, -4]} />);
      } else if (f.fajta === "nyomatek") {
        elemek.push(<KoncentraltNyomatek key={i} x={X} y={y} irany={f.M > 0 ? 1 : -1} r={14} cimke={`${ert(Math.abs(f.M))}`} />);
      } else if (f.fajta === "reakcio") {
        elemek.push(<ReakcioNyil key={i} x={X} y={y} hossz={40} szog={(Math.atan2(f.Fy, f.Fx) * 180) / Math.PI} cimke={`${ert(Math.hypot(f.Fx, f.Fy))}`} cimkeEltolas={f.Fy ? [6, 10] : [-4, -6]} />);
      } else if (f.fajta === "reakcioNyomatek") {
        elemek.push(<KoncentraltNyomatek key={i} x={X} y={y} irany={f.M > 0 ? 1 : -1} r={16} szin={SZIN.reakcio} cimke={`${ert(Math.abs(f.M))}`} />);
      }
    }
    // a vágás felőli végen a pozitív értelmű N, V, M
    const Vagas = ({ X, j }) => (
      <g>
        <line x1={X} y1={y - 12} x2={X} y2={y + 12} stroke="#334155" strokeWidth="2" />
        <line x1={X} y1={y} x2={X + j * 24} y2={y} stroke={SZINEK.N} strokeWidth="2.6" markerEnd="url(#ve-N)" />
        <text x={X + j * 28} y={y + 4} textAnchor={j > 0 ? "start" : "end"} fontSize="11.5" fontWeight="700" style={{ fill: SZINEK.N, paintOrder: "stroke", stroke: "white", strokeWidth: 3.5 }}>N</text>
        <line x1={X} y1={y} x2={X} y2={y + j * 26} stroke={SZINEK.V} strokeWidth="2.6" markerEnd="url(#ve-V)" />
        <text x={X + j * 6} y={y + j * 32 + (j > 0 ? 8 : -2)} textAnchor={j > 0 ? "start" : "end"} fontSize="11.5" fontWeight="700" style={{ fill: SZINEK.V, paintOrder: "stroke", stroke: "white", strokeWidth: 3.5 }}>V</text>
        <path d={j > 0 ? `M ${X} ${y + 14} A 14 14 0 0 0 ${X} ${y - 14}` : `M ${X} ${y + 14} A 14 14 0 0 1 ${X} ${y - 14}`} fill="none" stroke={SZINEK.M} strokeWidth="2.4" markerEnd="url(#ve-M)" />
        <text x={X - j * 4} y={y - 20} textAnchor={j > 0 ? "end" : "start"} fontSize="11.5" fontWeight="700" style={{ fill: SZINEK.M, paintOrder: "stroke", stroke: "white", strokeWidth: 3.5 }}>M</text>
      </g>
    );
    return (
      <g>
        <Tarto x1={x1} y1={y} x2={x2} y2={y} />
        {elemek}
        {vagasJobb && <Vagas X={x2} j={1} />}
        {vagasBal && <Vagas X={x1} j={-1} />}
      </g>
    );
  };

  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white shadow-sm shadow-petrol-900/[0.04]">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-b border-[color:var(--keret)] bg-linear-to-r from-petrol-800 to-petrol-700 px-5 py-3.5">
        <span className="rounded-md bg-naracs-500 px-2 py-0.5 text-[10.5px] font-bold tracking-[0.14em] text-white uppercase">Felfedező</span>
        <h3 className="text-[15px] font-semibold text-white">Vágd el a tartót</h3>
        <span className="ml-auto text-[11.5px] text-petrol-200">húzd a K keresztmetszetet</span>
      </div>
      <div className="flex flex-wrap gap-1.5 border-b border-[color:var(--keret)] bg-petrol-50/60 px-4 py-2.5">
        {VALASZTEK.map((v) => (
          <button key={v.id} type="button" onClick={() => valt(v.id)}
            className={`rounded-lg px-3 py-1.5 text-[12.5px] font-semibold transition ${v.id === id ? "bg-petrol-800 text-white" : "bg-white text-petrol-700 ring-1 ring-petrol-200 hover:bg-petrol-50"}`}>
            {v.nev}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1.5fr_1fr] [&>*]:min-w-0">
        <div className="racs-vilagos border-b border-[color:var(--keret)] p-3 lg:border-r lg:border-b-0">
          <svg ref={svgRef} viewBox={`0 0 ${SZ} ${MA}`} className="abra h-auto w-full select-none">
            <TartoHegyek />
            <defs>
              {[["ve-N", SZINEK.N], ["ve-V", SZINEK.V], ["ve-M", SZINEK.M]].map(([hid, szin]) => (
                <marker key={hid} id={hid} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
                  <path d="M 0 1 L 9 5 L 0 9 z" fill={szin} />
                </marker>
              ))}
            </defs>
            <text x={10} y={16} fontSize="11.5" fontWeight="700" style={{ fill: "#475569" }}>A tartó és a K keresztmetszet</text>
            {/* a teljes tartó */}
            {m.rudak.map((r) => <Tarto key={r.id} x1={kx(r.x1)} y1={Y1} x2={kx(r.x2)} y2={Y1} />)}
            {m.tamaszok.map((t, i) => {
              const cs = m.csomopontok[t.ics];
              const x = kx(cs.x);
              if (t.tipus === "csuklo") return <Csuklo key={i} x={x} y={Y1} />;
              if (t.tipus === "gorgo") return <Gorgo key={i} x={x} y={Y1} />;
              return <Befogas key={i} x={x} y={Y1} irany="bal" hossz={44} />;
            })}
            {m.csomopontok.map((cs, i) => (m.tamaszok.some((t) => t.ics === i) ? <TamaszCimke key={i} x={kx(cs.x) - 18} y={Y1 + 22}>{cs.id}</TamaszCimke> : null))}
            <Reszlet erok={reszErok(e, minX, maxX + 1)} xa={minX} xb={maxX} y={Y1} eltol={0} />
            {/* a vágás */}
            <line x1={XK} y1={Y1 - 24} x2={XK} y2={Y1 + 24} stroke="#334155" strokeWidth="2" strokeDasharray="4 3" />
            <text x={XK + 8} y={Y1 - 26} fontSize="12" fontWeight="700" fontStyle="italic" style={{ fill: "#334155", paintOrder: "stroke", stroke: "white", strokeWidth: 3.5 }}>K</text>
            <Fogopont x={XK} y={Y1} szin="#334155" onPointerDown={huzas} />

            {/* a két rész */}
            <text x={10} y={Y2 - 62} fontSize="11.5" fontWeight="700" style={{ fill: "#475569" }}>A két elkülönített rész — a keresztmetszeten a pozitív értelmű N, V, M</text>
            {balEsAVagas && <Reszlet erok={bal} xa={minX} xb={xs} y={Y2} eltol={-44} vagasJobb />}
            {jobbEsAVagas && <Reszlet erok={jobb} xa={xs} xb={maxX} y={Y2} eltol={44} vagasBal />}
          </svg>
          <Diagram eredmeny={e} szerkezet={false} hatar={s} metszet={s} amp={30} />
          <p className="mt-1 text-center text-[11.5px] text-petrol-500">Az ábrák a vágás helyéig épülnek; a pont az aktuális K értéke.</p>
        </div>

        <div className="p-4 sm:p-5">
          <label className="block">
            <span className="mb-1 flex items-baseline justify-between">
              <span className="text-[12.5px] font-medium text-petrol-600">A K keresztmetszet helye</span>
              <span className="szamok rounded-md bg-petrol-100 px-2 py-0.5 text-[12.5px] font-semibold text-petrol-800">x = {sz(xs - minX, 2)} m</span>
            </span>
            <input type="range" min={0} max={teljes} step={0.05} value={Math.min(s, teljes)} onChange={(ev) => setS(Number(ev.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-petrol-100 accent-[color:var(--color-naracs-500)]" aria-label="A keresztmetszet helye" />
          </label>

          <div className="szamok mt-4 grid grid-cols-3 gap-2 text-center">
            {[["N", N, N > 1e-6 ? "húzás" : N < -1e-6 ? "nyomás" : "nincs"], ["V", V, ""], ["M", M, M > 1e-6 ? "alul húzott" : M < -1e-6 ? "felül húzott" : "nincs"]].map(([jel, v, mag]) => (
              <div key={jel} className="rounded-lg bg-petrol-50 px-2 py-2 ring-1 ring-petrol-200">
                <div className="text-[11px] font-semibold" style={{ color: SZINEK[jel] }}>{jel}</div>
                <div className="text-[15px] font-semibold text-petrol-900">{sz(v, 2)}</div>
                <div className="text-[10.5px] text-petrol-400">{jel === "M" ? "kNm" : "kN"}{mag ? ` · ${mag}` : ""}</div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">A bal részből, a tankönyv írásmódjával</p>
          <div className="mt-1.5 space-y-1.5 text-[13px] text-petrol-800">
            <div><Keplet>{`(\\leftarrow):\\ N_K = ${oN.szoveg.replaceAll(",", "{,}")} = ${szK(oN.osszeg, 2)}\\ \\text{kN}`}</Keplet></div>
            <div><Keplet>{`(\\uparrow):\\ V_K = ${oV.szoveg.replaceAll(",", "{,}")} = ${szK(oV.osszeg, 2)}\\ \\text{kN}`}</Keplet></div>
            <div><Keplet>{`(\\curvearrowright):\\ M_K = ${oM.szoveg.replaceAll(",", "{,}")} = ${szK(oM.osszeg, 2)}\\ \\text{kNm}`}</Keplet></div>
          </div>
          <p className="mt-3 text-[12px] leading-relaxed text-petrol-500">
            A bal részre ható összes erő (terhek és reakciók) vetülete a ← irányra adja N-t, a ↑ irányra V-t, a K pontra írt ↷ nyomatéka M-et — a (8.5) egyenértékűség szerint. A megoszló teher K-tól balra eső részének eredője p·hossz, karja a hossz fele.
            Ha a K-t egy koncentrált erőre tolod, az erő a jobb részhez tartozik: a bal oldali határértéket látod.
          </p>
        </div>
      </div>
    </div>
  );
}
