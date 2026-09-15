"use client";

import { useRef, useState } from "react";
import { M, MB } from "@/components/ui/Keplet";
import {
  TartoHegyek,
  Tarto,
  Gorgo,
  Csuklo,
  Befogas,
  Rud,
  TeherNyil,
  ReakcioNyil,
  KoncentraltNyomatek,
  TamaszCimke,
  SZIN,
} from "./TartoElemek";

const SZ = 640;
const MA = 430;
const Y = 150; // a tartó tengelye
const TALCA_Y = 375;
const SUGAR = 46; // ejtési sugár a támaszpont körül

const ESETEK = [
  {
    id: "kettamaszu",
    cim: "Kéttámaszú tartó",
    tarto: [100, 520],
    tamaszok: [
      { id: "A", x: 120, tipus: "csuklo" },
      { id: "B", x: 500, tipus: "gorgo" },
    ],
    terhek: [
      { x: 260, szog: -90, cimke: "F₁" },
      { x: 400, szog: -60, cimke: "F₂" },
    ],
    helyes: { A: ["Ax", "Ay"], B: ["By"] },
    kijelentes: "(\\underline{F}_1,\\ \\underline{F}_2,\\ \\underline{A}_x,\\ \\underline{A}_y,\\ \\underline{B}) \\ekv \\underline{O}",
  },
  {
    id: "konzol",
    cim: "Befogott konzol",
    tarto: [120, 480],
    tamaszok: [{ id: "A", x: 120, tipus: "befogas" }],
    terhek: [
      { x: 300, szog: -60, cimke: "F₁" },
      { x: 480, szog: -90, cimke: "F₂" },
    ],
    helyes: { A: ["Ax", "Ay", "MA"] },
    kijelentes: "(\\underline{F}_1,\\ \\underline{F}_2,\\ \\underline{A}_x,\\ \\underline{A}_y,\\ M_A) \\ekv \\underline{O}",
  },
  {
    id: "rud",
    cim: "Csukló + ferde rúd",
    tarto: [100, 520],
    tamaszok: [
      { id: "A", x: 120, tipus: "csuklo" },
      { id: "C", x: 330, tipus: "rud", W: { x: 120, y: 42 } },
    ],
    terhek: [
      { x: 430, szog: -90, cimke: "F₁" },
      { x: 510, szog: -60, cimke: "F₂" },
    ],
    helyes: { A: ["Ax", "Ay"], C: ["S"] },
    kijelentes: "(\\underline{F}_1,\\ \\underline{F}_2,\\ \\underline{A}_x,\\ \\underline{A}_y,\\ \\underline{S}) \\ekv \\underline{O}",
  },
];

const REAKCIOK = [
  { id: "Ax", tex: "A_x", betu: "A" },
  { id: "Ay", tex: "A_y", betu: "A" },
  { id: "Bx", tex: "B_x", betu: "B" },
  { id: "By", tex: "B_y", betu: "B" },
  { id: "MA", tex: "M_A", betu: "A", nyomatek: true },
  { id: "MB", tex: "M_B", betu: "B", nyomatek: true },
  { id: "S", tex: "S", betu: "S", rud: true },
];

const TIPUS_NEV = { csuklo: "csukló", gorgo: "görgő", befogas: "befogás", rud: "rúd" };

/** Miért rossz egy reakció az adott támasznál. */
function indok(reakcio, tamasz) {
  const r = REAKCIOK.find((q) => q.id === reakcio);
  if (r.rud && tamasz.tipus !== "rud") return "itt nincs rúd — az S rúderő csak rúdnál ébred.";
  if (tamasz.tipus === "rud" && !r.rud) return "a rúd csak rúdirányú erőt ad át: egyetlen ismeretlen, S.";
  if (r.nyomatek && tamasz.tipus !== "befogas") return `a ${TIPUS_NEV[tamasz.tipus]} körül a tartó elfordulhat — nyomaték nem ébred.`;
  if (r.betu !== tamasz.id) return `ez a(z) ${tamasz.id} támasz: a ${r.betu} betűs reakciók a másik támaszhoz tartoznak.`;
  if (tamasz.tipus === "gorgo" && r.id.endsWith("x")) return "a görgő a síkja mentén elgurul: vízszintes erőt nem ad át.";
  return "ez a reakció itt nem ébred.";
}

/** Egy reakció nyila az adott (px, py) pontban. */
function ReakcioRajz({ id, px, py, tamasz, kicsi = false, szin }) {
  const h = kicsi ? 26 : 42;
  const r = REAKCIOK.find((q) => q.id === id);
  const cimkeSzin = szin ?? (r.nyomatek ? SZIN.nyomatek : SZIN.reakcio);
  // ha van egyedi szín (hibás elhelyezés), a nyílhegy is azt kapja
  const extra = szin ? { szin, hegy: "th-nyomatek" } : {};
  let rajz;
  if (r.nyomatek) {
    rajz = <KoncentraltNyomatek x={px} y={py} r={kicsi ? 13 : 20} irany={1} {...(szin ? { szin } : {})} />;
  } else if (r.rud) {
    let dx = -0.707;
    let dy = -0.707;
    if (tamasz?.W) {
      const vx = tamasz.W.x - tamasz.x;
      const vy = tamasz.W.y - Y;
      const hh = Math.hypot(vx, vy);
      dx = vx / hh;
      dy = vy / hh;
    }
    const szog = (Math.atan2(-dy, dx) * 180) / Math.PI;
    rajz = <ReakcioNyil x={px + dx * h} y={py + dy * h} hossz={h} szog={szog} {...extra} />;
  } else if (id.endsWith("x")) {
    // A_x: a pont felé mutat balról; B_x: a pontból kifelé, jobbra
    rajz = r.betu === "A" ? <ReakcioNyil x={px} y={py} hossz={h} szog={0} {...extra} /> : <ReakcioNyil x={px + h} y={py} hossz={h} szog={0} {...extra} />;
  } else {
    rajz = <ReakcioNyil x={px} y={py} hossz={h} szog={90} {...extra} />;
  }
  const cimkeX = r.nyomatek ? px + (kicsi ? 14 : 22) : id.endsWith("x") ? (r.betu === "A" ? px - h - 4 : px + h + 4) : px + 10;
  const cimkeY = r.nyomatek ? py - (kicsi ? 14 : 22) : id.endsWith("x") ? py - 8 : py + (kicsi ? 26 : 40);
  return (
    <g>
      {rajz}
      <text x={cimkeX} y={cimkeY} textAnchor={id.endsWith("x") && r.betu === "A" ? "end" : "start"} fontSize={kicsi ? 12 : 13.5} fontStyle="italic" fontWeight="650" style={{ fill: cimkeSzin, paintOrder: "stroke", stroke: "white", strokeWidth: 3.5 }}>
        {r.tex.replace(/_(.)/, "")}
        {r.tex.includes("_") && (
          <tspan dy="3.5" fontSize={kicsi ? 9 : 10}>
            {r.tex.split("_")[1]}
          </tspan>
        )}
      </text>
    </g>
  );
}

function TamaszRajz({ t, opacitas = 1 }) {
  if (t.tipus === "csuklo") return <Csuklo x={t.x} y={Y} opacitas={opacitas} />;
  if (t.tipus === "gorgo") return <Gorgo x={t.x} y={Y} opacitas={opacitas} />;
  if (t.tipus === "befogas") return <Befogas x={t.x} y={Y} irany="bal" hossz={46} opacitas={opacitas} />;
  return (
    <g opacity={opacitas}>
      <Befogas x={t.W.x - 4} y={t.W.y} irany="bal" hossz={26} />
      <Rud x1={t.W.x} y1={t.W.y} x2={t.x} y2={Y} />
    </g>
  );
}

export default function SzabadtestEpito({ kezdoEset = 0, kezdoLevett = [], kezdoElhelyezett = [] }) {
  const [esetIdx, setEsetIdx] = useState(kezdoEset);
  const [levett, setLevett] = useState(kezdoLevett); // támasz-id-k
  const [elhelyezett, setElhelyezett] = useState(kezdoElhelyezett); // { id, tamasz }
  const [huz, setHuz] = useState(null); // { fajta: "tamasz"|"reakcio"|"elhelyezett", id, x, y, tamasz? }
  const [uzenet, setUzenet] = useState(null);
  const svgRef = useRef(null);

  const eset = ESETEK[esetIdx];

  const ujra = (idx = esetIdx) => {
    setEsetIdx(idx);
    setLevett([]);
    setElhelyezett([]);
    setHuz(null);
    setUzenet(null);
  };

  const svgPont = (e) => {
    const r = svgRef.current.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * SZ, y: ((e.clientY - r.top) / r.height) * MA };
  };

  const huzasKezd = (adat) => (e) => {
    e.preventDefault();
    if (!svgRef.current) return;
    const p = svgPont(e);
    const kezdo = { ...adat, x: p.x, y: p.y, x0: p.x, y0: p.y };
    setHuz(kezdo);
    let utolso = kezdo;
    const mozgat = (esem) => {
      const q = svgPont(esem);
      utolso = { ...kezdo, x: q.x, y: q.y };
      setHuz(utolso);
    };
    const vege = () => {
      window.removeEventListener("pointermove", mozgat);
      window.removeEventListener("pointerup", vege);
      ejt(utolso);
      setHuz(null);
    };
    window.addEventListener("pointermove", mozgat);
    window.addEventListener("pointerup", vege);
  };

  const legkozelebbiTamasz = (x, y) => {
    let best = null;
    for (const t of eset.tamaszok) {
      const d = Math.hypot(x - t.x, y - Y);
      if (d < SUGAR && (!best || d < best.d)) best = { t, d };
    }
    return best?.t ?? null;
  };

  const ejt = (h) => {
    if (h.fajta === "tamasz") {
      const elmozdult = Math.hypot(h.x - h.x0, h.y - h.y0) > 40;
      if (elmozdult) {
        setLevett((e) => (e.includes(h.id) ? e : [...e, h.id]));
        setUzenet({ tipus: "ok", szoveg: `A(z) ${h.id} támasz leemelve — most vedd fel helyette a reakciókat.` });
      }
      return;
    }
    const cel = legkozelebbiTamasz(h.x, h.y);
    if (h.fajta === "elhelyezett") {
      setElhelyezett((lista) => {
        const nelkul = lista.filter((r) => !(r.id === h.id && r.tamasz === h.tamasz));
        if (cel && levett.includes(cel.id)) return [...nelkul, { id: h.id, tamasz: cel.id }];
        return nelkul;
      });
      return;
    }
    // tálcáról
    if (!cel) {
      setUzenet({ tipus: "info", szoveg: "Ejtsd a nyilat egy támasz helyére." });
      return;
    }
    if (!levett.includes(cel.id)) {
      setUzenet({ tipus: "hiba", szoveg: `Előbb emeld le a(z) ${cel.id} támaszt (húzd el a tartóról), csak utána jöhet a helyére a reakció.` });
      return;
    }
    setElhelyezett((lista) => {
      if (lista.some((r) => r.id === h.id && r.tamasz === cel.id)) return lista;
      return [...lista, { id: h.id, tamasz: cel.id }];
    });
    setUzenet(null);
  };

  // ---- értékelés ----
  const ertekeles = eset.tamaszok.map((t) => {
    const varando = eset.helyes[t.id] ?? [];
    const itt = elhelyezett.filter((r) => r.tamasz === t.id);
    const jo = itt.filter((r) => varando.includes(r.id));
    const rossz = itt.filter((r) => !varando.includes(r.id));
    const hianyzo = varando.filter((v) => !itt.some((r) => r.id === v));
    const allapot = !levett.includes(t.id) ? "rajta" : rossz.length ? "rossz" : hianyzo.length ? "hianyos" : "kesz";
    return { t, varando, jo, rossz, hianyzo, allapot };
  });
  const kesz = ertekeles.every((e) => e.allapot === "kesz");
  const osszFok = ertekeles.reduce((s, e) => s + e.varando.length, 0);

  const talcaElemek = REAKCIOK.map((r, i) => ({ ...r, x: 66 + i * 74, y: TALCA_Y }));

  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white">
      <div className="flex flex-wrap items-center gap-2 border-b border-[color:var(--keret)] bg-petrol-50/70 px-3 py-2">
        <div className="flex flex-wrap gap-1 rounded-lg bg-white p-0.5 ring-1 ring-petrol-200">
          {ESETEK.map((e, i) => (
            <button key={e.id} type="button" onClick={() => ujra(i)} className={`rounded-md px-2.5 py-1 text-[12px] font-medium transition ${esetIdx === i ? "bg-petrol-700 text-white" : "text-petrol-600 hover:bg-petrol-50"}`}>
              {e.cim}
            </button>
          ))}
        </div>
        <button type="button" onClick={() => ujra()} className="ml-auto rounded-lg px-2.5 py-1 text-[12px] font-medium text-petrol-500 transition hover:text-petrol-800">
          Újra
        </button>
      </div>

      <div className="grid lg:grid-cols-[1.45fr_1fr] [&>*]:min-w-0">
        <div className="racs-vilagos border-b border-[color:var(--keret)] p-3 lg:border-r lg:border-b-0">
          <svg ref={svgRef} viewBox={`0 0 ${SZ} ${MA}`} className="abra w-full h-auto touch-none select-none">
            <TartoHegyek />
            <text x={14} y={22} fontSize="11" fontWeight="700" letterSpacing="1.5" style={{ fill: "#64748b" }}>
              1. HÚZD LE A TÁMASZOKAT · 2. HÚZD A HELYÜKRE A REAKCIÓKAT
            </text>

            {/* tálca */}
            <rect x={10} y={TALCA_Y - 45} width={SZ - 20} height={92} rx="12" fill="white" fillOpacity="0.7" stroke="#e2e8f0" strokeDasharray="4 3" />
            <text x={20} y={TALCA_Y - 30} fontSize="10.5" fontWeight="700" letterSpacing="1.2" style={{ fill: "#94a3b8" }}>
              TÁLCA — REAKCIÓK
            </text>
            {talcaElemek.map((r) => (
              <g key={r.id} onPointerDown={huzasKezd({ fajta: "reakcio", id: r.id })} style={{ cursor: "grab", touchAction: "none" }}>
                <circle cx={r.x} cy={r.y + 4} r="30" fill="white" fillOpacity="0.01" />
                <ReakcioRajz id={r.id} px={r.x} py={r.y + (r.nyomatek ? 8 : r.id.endsWith("x") ? 4 : -12)} kicsi />
              </g>
            ))}
            {/* leemelt támaszok a tálca jobb szélén */}
            {levett.map((id, i) => {
              const t = eset.tamaszok.find((q) => q.id === id);
              return (
                <g key={id} transform={`translate(${SZ - 60 - i * 40 - t.x} ${TALCA_Y - 8 - Y})`} opacity="0.35">
                  {t.tipus === "rud" ? <Rud x1={t.x - 14} y1={Y - 24} x2={t.x} y2={Y} /> : <TamaszRajz t={t} />}
                </g>
              );
            })}

            {/* terhek */}
            {eset.terhek.map((f, i) => (
              <TeherNyil key={i} x={f.x} y={Y} hossz={48} szog={f.szog} cimke={f.cimke} cimkeEltolas={f.szog === -90 ? [8, -4] : [-24, -4]} />
            ))}

            {/* a tartó */}
            <Tarto x1={eset.tarto[0]} y1={Y} x2={eset.tarto[1]} y2={Y} />

            {/* támaszok, ejtőhelyek */}
            {ertekeles.map(({ t, allapot }) => {
              const rajta = allapot === "rajta";
              const keret = allapot === "kesz" ? "#059669" : allapot === "rossz" ? "#e11d48" : "#d97706";
              return (
                <g key={t.id}>
                  {!rajta && (
                    <circle cx={t.x} cy={Y} r={SUGAR - 10} fill={keret} fillOpacity="0.06" stroke={keret} strokeWidth="1.6" strokeDasharray={allapot === "kesz" ? undefined : "6 4"} />
                  )}
                  {rajta && (
                    <g onPointerDown={huzasKezd({ fajta: "tamasz", id: t.id })} style={{ cursor: "grab", touchAction: "none" }}>
                      <TamaszRajz t={t} opacitas={huz?.fajta === "tamasz" && huz.id === t.id ? 0.25 : 1} />
                      <circle cx={t.x} cy={Y + 12} r="30" fill="white" fillOpacity="0.01" />
                    </g>
                  )}
                  <TamaszCimke x={t.x + (t.tipus === "befogas" ? 14 : t.id === "C" ? 4 : -16)} y={Y + (t.tipus === "gorgo" || t.tipus === "csuklo" ? 34 : 22) + (rajta ? 0 : -8)}>{t.id}</TamaszCimke>
                </g>
              );
            })}

            {/* elhelyezett reakciók */}
            {elhelyezett.map((r) => {
              const t = eset.tamaszok.find((q) => q.id === r.tamasz);
              const jo = (eset.helyes[t.id] ?? []).includes(r.id);
              const huzva = huz?.fajta === "elhelyezett" && huz.id === r.id && huz.tamasz === r.tamasz;
              return (
                <g key={`${r.id}-${r.tamasz}`} opacity={huzva ? 0.3 : 1} onPointerDown={huzasKezd({ fajta: "elhelyezett", id: r.id, tamasz: r.tamasz })} style={{ cursor: "grab", touchAction: "none" }}>
                  <ReakcioRajz id={r.id} px={t.x} py={Y} tamasz={t} szin={jo ? undefined : "#be123c"} />
                </g>
              );
            })}

            {/* húzott elem */}
            {huz && huz.fajta !== "tamasz" && (
              <g opacity="0.85" style={{ pointerEvents: "none" }}>
                <ReakcioRajz id={huz.id} px={huz.x} py={huz.y} tamasz={legkozelebbiTamasz(huz.x, huz.y) ?? undefined} kicsi />
              </g>
            )}
            {huz && huz.fajta === "tamasz" && (
              <g opacity="0.7" style={{ pointerEvents: "none" }} transform={`translate(${huz.x - huz.x0} ${huz.y - huz.y0})`}>
                <TamaszRajz t={eset.tamaszok.find((q) => q.id === huz.id)} />
              </g>
            )}
          </svg>
        </div>

        <div className="p-4 sm:p-5">
          <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">Szabadtest-ábra</p>
          <ul className="mt-2 space-y-2">
            {ertekeles.map((e) => (
              <li key={e.t.id} className={`rounded-lg px-3 py-2 text-[12.5px] ring-1 ${e.allapot === "kesz" ? "bg-emerald-50 text-emerald-800 ring-emerald-200" : e.allapot === "rossz" ? "bg-rose-50 text-rose-800 ring-rose-200" : e.allapot === "hianyos" ? "bg-naracs-50 text-naracs-800 ring-naracs-200" : "bg-petrol-50 text-petrol-600 ring-petrol-100"}`}>
                <span className="font-semibold">
                  {e.t.id} — {TIPUS_NEV[e.t.tipus]} (fokszám {e.varando.length})
                </span>
                <br />
                {e.allapot === "rajta" && "még a tartón van: húzd le."}
                {e.allapot === "hianyos" && (
                  <>
                    hiányzik még:{" "}
                    {e.hianyzo.map((h, i) => (
                      <span key={h}>
                        {i > 0 && ", "}
                        <M>{REAKCIOK.find((q) => q.id === h).tex}</M>
                      </span>
                    ))}
                  </>
                )}
                {e.allapot === "rossz" &&
                  e.rossz.map((r) => (
                    <span key={r.id} className="block">
                      <M>{REAKCIOK.find((q) => q.id === r.id).tex}</M> felesleges: {indok(r.id, e.t)}
                    </span>
                  ))}
                {e.allapot === "kesz" && "kész ✓"}
              </li>
            ))}
          </ul>

          {uzenet && (
            <p className={`mt-3 rounded-lg px-3 py-2 text-[12.5px] ${uzenet.tipus === "hiba" ? "bg-rose-50 text-rose-800" : uzenet.tipus === "ok" ? "bg-emerald-50 text-emerald-800" : "bg-petrol-50 text-petrol-700"}`}>{uzenet.szoveg}</p>
          )}

          {kesz ? (
            <div className="mt-4 rounded-xl border border-emerald-300 bg-emerald-50 p-3">
              <p className="text-[10.5px] font-bold tracking-[0.16em] text-emerald-800 uppercase">Egyensúlyi kijelentés</p>
              <MB>{eset.kijelentes}</MB>
              <p className="text-[12.5px] text-emerald-900">
                {osszFok} ismeretlen, három egyensúlyi egyenlet — a feladat megoldható. Ez a szabadtest-ábra a recept első lépése.
              </p>
            </div>
          ) : (
            <p className="mt-4 text-[12.5px] leading-relaxed text-petrol-500">
              Ha minden támasz helyén a megfelelő reakciók állnak, megjelenik az egyensúlyi kijelentés. A felesleges nyilat húzd vissza a tálcára.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
