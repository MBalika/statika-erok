"use client";

import { useEffect, useRef, useState } from "react";
import { M } from "@/components/ui/Keplet";
import {
  TartoHegyek,
  Tarto,
  Gorgo,
  Csuklo,
  Befogas,
  Rud,
  ReakcioNyil,
  KoncentraltNyomatek,
  TamaszCimke,
  SZIN,
} from "./TartoElemek";

const SZ = 480;
const MA = 250;
const Y = 108; // a tartó tengelye
const XB = 130; // a tartó bal vége
const XJ = 360; // a tartó jobb vége
const XS = 165; // a támasz helye (görgő, rúd, csukló)

const KENYSZEREK = {
  gorgo: {
    cim: "Görgő",
    fok: 1,
    pivot: XS,
    gatolt: { vizszintes: null, fuggoleges: "A", forgas: null },
    reakciok: [{ id: "A", tex: "A", leiras: "a gördülési síkra merőleges erő" }],
    magyarazat: "A görgő a síkja mentén elgurul és el is tud fordulni: csak a síkra merőleges eltolódást gátolja. Egyetlen reakció, ismert hatásvonallal.",
  },
  rud: {
    cim: "Támasztórúd",
    fok: 1,
    pivot: XS,
    gatolt: { vizszintes: null, fuggoleges: "S", forgas: null },
    reakciok: [{ id: "S", tex: "S", leiras: "rúdirányú erő, húzottnak feltételezve" }],
    magyarazat: "A rúd a saját tengelye irányában nem enged eltolódást; oldalra elleng, a végpont körül elfordulhat. A reakció rúdirányú, és mindig húzóerőként vesszük fel.",
  },
  csuklo: {
    cim: "Csukló",
    fok: 2,
    pivot: XS,
    gatolt: { vizszintes: "Ax", fuggoleges: "Ay", forgas: null },
    reakciok: [
      { id: "Ax", tex: "A_x", leiras: "vízszintes komponens" },
      { id: "Ay", tex: "A_y", leiras: "függőleges komponens" },
    ],
    magyarazat: "A csukló körül a tartó szabadon elfordul, de a pont sehová nem tud eltolódni. A reakcióerő iránya ismeretlen — ezért két komponenssel adjuk meg.",
  },
  befogas: {
    cim: "Merev befogás",
    fok: 3,
    pivot: XB,
    gatolt: { vizszintes: "Ax", fuggoleges: "Ay", forgas: "MA" },
    reakciok: [
      { id: "Ax", tex: "A_x", leiras: "vízszintes komponens" },
      { id: "Ay", tex: "A_y", leiras: "függőleges komponens" },
      { id: "MA", tex: "M_A", leiras: "befogási nyomaték" },
    ],
    magyarazat: "A befogás semmilyen mozgást nem enged: két erőkomponens és egy nyomaték ébred. Ez az egyetlen kényszer, amely önmagában is tartót ad.",
  },
};

const MOZGASOK = [
  { id: "vizszintes", cimke: "Told el vízszintesen", jel: "↔" },
  { id: "fuggoleges", cimke: "Told el függőlegesen", jel: "↕" },
  { id: "forgas", cimke: "Forgasd el", jel: "↻" },
];

const IDO = 1100; // ms

export default function KenyszerSzotar({ kezdoFul = "gorgo", kezdoElkulonit = false }) {
  const [ful, setFul] = useState(kezdoFul);
  const [elkulonit, setElkulonit] = useState(kezdoElkulonit);
  const [anim, setAnim] = useState(null); // { mozgas, gatolt, kezdet }
  const [u, setU] = useState(0);
  const [utolso, setUtolso] = useState(null); // { mozgas, gatolt }
  const rafRef = useRef(null);

  const k = KENYSZEREK[ful];

  useEffect(() => {
    if (!anim) return undefined;
    const lep = (most) => {
      const t = Math.min(1, (most - anim.kezdet) / IDO);
      setU(t);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(lep);
      } else {
        setAnim(null);
      }
    };
    rafRef.current = requestAnimationFrame(lep);
    return () => cancelAnimationFrame(rafRef.current);
  }, [anim]);

  const indit = (mozgas) => {
    const gatolt = k.gatolt[mozgas];
    setUtolso({ mozgas, gatolt });
    setAnim({ mozgas, gatolt: Boolean(gatolt), kezdet: performance.now() });
    setU(0);
  };

  const valtFul = (uj) => {
    setFul(uj);
    setUtolso(null);
    setAnim(null);
  };

  // --- a tartó elmozdulása az animáció alatt ---
  let dx = 0;
  let dy = 0;
  let rot = 0;
  let lukt = 0; // a reakció lüktetése 0–1
  if (anim) {
    const lecs = 1 - u;
    if (anim.gatolt) {
      const remeg = Math.sin(u * Math.PI * 9) * lecs * 2.4;
      if (anim.mozgas === "vizszintes") dx = remeg;
      if (anim.mozgas === "fuggoleges") dy = remeg;
      if (anim.mozgas === "forgas") rot = remeg * 0.45;
      lukt = 0.55 + 0.45 * Math.sin(u * Math.PI * 6);
    } else {
      const s = Math.sin(u * Math.PI);
      if (anim.mozgas === "vizszintes") dx = 26 * s;
      if (anim.mozgas === "fuggoleges") dy = -20 * s;
      if (anim.mozgas === "forgas") rot = -9 * s;
    }
  }

  const aktivReakcio = anim?.gatolt ? utolso?.gatolt : null;
  const mutatReakciot = (id) => elkulonit || aktivReakcio === id;
  const opac = (id) => (aktivReakcio === id ? 0.45 + 0.55 * lukt : elkulonit ? 1 : 0);

  const tartoBal = XB;
  const transform = `translate(${dx} ${dy}) rotate(${rot} ${k.pivot} ${Y})`;

  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white">
      {/* fülek */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[color:var(--keret)] bg-petrol-50/70 px-3 py-2">
        <div className="flex flex-wrap gap-1 rounded-lg bg-white p-0.5 ring-1 ring-petrol-200">
          {Object.entries(KENYSZEREK).map(([id, kk]) => (
            <button
              key={id}
              type="button"
              onClick={() => valtFul(id)}
              className={`rounded-md px-2.5 py-1 text-[12px] font-medium transition ${ful === id ? "bg-petrol-700 text-white" : "text-petrol-600 hover:bg-petrol-50"}`}
            >
              {kk.cim}
            </button>
          ))}
        </div>
        <label className="ml-auto flex cursor-pointer items-center gap-2 text-[12px] font-medium text-petrol-600">
          <input type="checkbox" checked={elkulonit} onChange={(e) => setElkulonit(e.target.checked)} className="accent-[color:var(--color-naracs-500)]" />
          Elkülönítés (támasz helyett reakció)
        </label>
      </div>

      <div className="grid lg:grid-cols-[1.25fr_1fr] [&>*]:min-w-0">
        <div className="racs-vilagos border-b border-[color:var(--keret)] p-3 lg:border-r lg:border-b-0">
          <svg viewBox={`0 0 ${SZ} ${MA}`} className="abra w-full h-auto select-none">
            <TartoHegyek />
            {/* a talaj / támasz – nem mozog */}
            {!elkulonit && ful === "gorgo" && <Gorgo x={XS} y={Y} />}
            {!elkulonit && ful === "csuklo" && <Csuklo x={XS} y={Y} />}
            {!elkulonit && ful === "rud" && (
              <>
                <Rud x1={XS + dx} y1={Y + dy} x2={XS} y2={Y + 60} />
                <Csuklo x={XS} y={Y + 60} meret={13} />
              </>
            )}
            {!elkulonit && ful === "befogas" && <Befogas x={XB} y={Y} irany="bal" hossz={48} />}

            {/* a tartó szellemképe (eredeti helyzet) */}
            {(dx !== 0 || dy !== 0 || rot !== 0) && <line x1={tartoBal} y1={Y} x2={XJ} y2={Y} stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 4" />}

            {/* a tartó */}
            <g transform={transform}>
              <Tarto x1={tartoBal} y1={Y} x2={XJ} y2={Y} />
              {ful !== "befogas" && <circle cx={XS} cy={Y} r="3.2" fill="white" stroke={SZIN.tamasz} strokeWidth="1.5" />}
            </g>

            {/* reakciók */}
            {ful === "gorgo" && mutatReakciot("A") && (
              <g opacity={opac("A")}>
                <ReakcioNyil x={XS} y={Y} hossz={46} szog={90} />
                <TamaszCimke x={XS + 14} y={Y + 46} szin={SZIN.reakcio}>A</TamaszCimke>
              </g>
            )}
            {ful === "rud" && mutatReakciot("S") && (
              <g opacity={opac("S")}>
                <ReakcioNyil x={XS} y={Y + 48} hossz={48} szog={-90} />
                <TamaszCimke x={XS + 14} y={Y + 46} szin={SZIN.reakcio}>S</TamaszCimke>
              </g>
            )}
            {(ful === "csuklo" || ful === "befogas") && (
              <>
                {mutatReakciot("Ax") && (
                  <g opacity={opac("Ax")}>
                    <ReakcioNyil x={k.pivot} y={Y} hossz={44} szog={0} />
                    <TamaszCimke x={k.pivot - 40} y={Y - 10} szin={SZIN.reakcio}>Aₓ</TamaszCimke>
                  </g>
                )}
                {mutatReakciot("Ay") && (
                  <g opacity={opac("Ay")}>
                    <ReakcioNyil x={k.pivot} y={Y} hossz={46} szog={90} />
                    <TamaszCimke x={k.pivot + 14} y={Y + 46} szin={SZIN.reakcio}>A<tspan dy="3" fontSize="10">y</tspan></TamaszCimke>
                  </g>
                )}
                {ful === "befogas" && mutatReakciot("MA") && (
                  <g opacity={opac("MA")}>
                    <KoncentraltNyomatek x={k.pivot} y={Y} r={22} irany={1} />
                    <TamaszCimke x={k.pivot + 30} y={Y - 26} szin={SZIN.nyomatek}>M<tspan dy="3" fontSize="10">A</tspan></TamaszCimke>
                  </g>
                )}
              </>
            )}

            {/* a mozgás jele a tartó jobb végén */}
            {anim && (
              <text x={XJ + 14} y={Y + 5} fontSize="20" fontWeight="700" style={{ fill: anim.gatolt ? "#be123c" : "#059669" }}>
                {MOZGASOK.find((m) => m.id === anim.mozgas)?.jel}
              </text>
            )}

            {/* felirat */}
            {utolso && (
              <text x={SZ / 2} y={MA - 18} textAnchor="middle" fontSize="14" fontWeight="700" style={{ fill: utolso.gatolt ? "#be123c" : "#059669", paintOrder: "stroke", stroke: "white", strokeWidth: 4 }}>
                {utolso.gatolt ? "gátolt → reakció ébred" : "szabad — nem ébred reakció"}
              </text>
            )}
          </svg>
          <div className="mt-2 flex flex-wrap justify-center gap-1.5">
            {MOZGASOK.map((m) => (
              <button
                key={m.id}
                type="button"
                disabled={Boolean(anim)}
                onClick={() => indit(m.id)}
                className="rounded-lg bg-white px-2.5 py-1.5 text-[12px] font-medium text-petrol-700 ring-1 ring-petrol-200 transition hover:bg-petrol-50 disabled:opacity-50"
              >
                {m.jel} {m.cimke}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">{k.cim}</p>
          <div className="mt-2 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-violet-100 text-2xl font-bold text-violet-800">{k.fok}</div>
            <div className="text-[13px] leading-snug text-petrol-700">
              <span className="font-semibold text-petrol-900">fokszám</span>
              <br />
              megakadályozott elmozdulás-komponens = ismeretlen reakcióadat
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-1.5">
            {MOZGASOK.map((m) => {
              const g = k.gatolt[m.id];
              return (
                <div key={m.id} className={`rounded-lg px-2 py-1.5 text-center text-[11.5px] font-semibold ${g ? "bg-rose-50 text-rose-700 ring-1 ring-rose-200" : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"}`}>
                  <span className="text-[15px]">{m.jel}</span>
                  <br />
                  {g ? "gátolt" : "szabad"}
                </div>
              );
            })}
          </div>

          <div className="mt-4 rounded-xl bg-petrol-50 p-3">
            <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">Reakciók az elkülönítésnél</p>
            <ul className="mt-1.5 space-y-1 text-[13px] text-petrol-800">
              {k.reakciok.map((r) => (
                <li key={r.id} className={`flex items-baseline gap-2 rounded-md px-1.5 py-0.5 transition ${aktivReakcio === r.id ? "bg-violet-100" : ""}`}>
                  <span className="szamok font-semibold text-violet-800">
                    <M>{r.tex}</M>
                  </span>
                  <span className="text-[12.5px] text-petrol-600">{r.leiras}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-3 text-[12.5px] leading-relaxed text-petrol-600">{k.magyarazat}</p>
        </div>
      </div>
    </div>
  );
}
