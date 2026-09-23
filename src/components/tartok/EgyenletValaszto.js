"use client";

import { useRef, useState } from "react";
import { Csuszka } from "@/components/abrak/ErovektorBonto";
import { M } from "@/components/ui/Keplet";
import { sz, szK, zarojel } from "@/lib/szamok";
import {
  TartoHegyek,
  Tarto,
  Gorgo,
  Csuklo,
  Rud,
  Befogas,
  TeherNyil,
  ReakcioNyil,
  TamaszCimke,
  SZIN,
} from "./TartoElemek";

const SZ = 600;
const MA = 400;

const c = (fok) => Math.cos((fok * Math.PI) / 180);
const s = (fok) => Math.sin((fok * Math.PI) / 180);

/**
 * Szerkezetek: koordináták méterben, x jobbra, y felfelé, az origó az A támasz.
 * ismeretlenek: erő P ponton át, e irányegységvektorral (a feltételezett irány).
 * fopontok: nevezett pontok, amelyekre a kattintás rápattan.
 */
const SZERKEZETEK = [
  {
    id: "vizszintes",
    cim: "Kéttámaszú, vízszintes görgő",
    origo: [100, 280],
    leptek: 60,
    tarto: [0, 6],
    tamaszok: [
      { id: "A", x: 0, y: 0, tipus: "csuklo" },
      { id: "B", x: 6, y: 0, tipus: "gorgo", szog: 0 },
    ],
    terhek: [
      { x: 2, szog: -60, cimke: "F₁" },
      { x: 4, szog: -90, cimke: "F₂" },
    ],
    ismeretlenek: [
      { id: "Ax", tex: "A_x", P: [0, 0], e: [1, 0], pontban: true },
      { id: "Ay", tex: "A_y", P: [0, 0], e: [0, 1] },
      { id: "B", tex: "B", P: [6, 0], e: [0, 1] },
    ],
    fopontok: [],
    tipp: "A_y és B párhuzamos: nincs metszéspontjuk, ezért A_x-et vetületi egyenletből kapjuk.",
  },
  {
    id: "ferde",
    cim: "Kéttámaszú, ferde görgő",
    origo: [100, 280],
    leptek: 60,
    tarto: [0, 6],
    tamaszok: [
      { id: "A", x: 0, y: 0, tipus: "csuklo" },
      { id: "B", x: 6, y: 0, tipus: "gorgo", szog: 60 },
    ],
    terhek: [
      { x: 2, szog: -60, cimke: "F₁" },
      { x: 4, szog: -90, cimke: "F₂" },
    ],
    ismeretlenek: [
      { id: "Ax", tex: "A_x", P: [0, 0], e: [1, 0], pontban: true },
      { id: "Ay", tex: "A_y", P: [0, 0], e: [0, 1] },
      { id: "B", tex: "B", P: [6, 0], e: [c(150), s(150)] },
    ],
    // D: a B hatásvonala és az A_y függőlegese: B-ből 150° irányban x = 0-ig → y = 6·tan30°
    fopontok: [{ id: "D", x: 0, y: 6 * Math.tan(Math.PI / 6) }],
    tipp: "Három főpont: A (→ B), B (→ A_y), D (→ A_x). Mindhárom reakció egymástól függetlenül számolható.",
  },
  {
    id: "rud",
    cim: "Csukló + ferde rúd",
    origo: [100, 280],
    leptek: 60,
    tarto: [0, 6],
    tamaszok: [
      { id: "A", x: 0, y: 0, tipus: "csuklo" },
      { id: "C", x: 3, y: 0, tipus: "rud", W: [0, 3] },
    ],
    terhek: [
      { x: 4.5, szog: -90, cimke: "F₁" },
      { x: 6, szog: -60, cimke: "F₂" },
    ],
    ismeretlenek: [
      { id: "Ax", tex: "A_x", P: [0, 0], e: [1, 0], pontban: true },
      { id: "Ay", tex: "A_y", P: [0, 0], e: [0, 1] },
      { id: "S", tex: "S", P: [3, 0], e: [-Math.SQRT1_2, Math.SQRT1_2] },
    ],
    fopontok: [{ id: "D", x: 0, y: 3 }],
    tipp: "Ugyanaz, mint a kéttámaszú: a rúd hatásvonala ismert. C a főpontja A_y-nak, D az A_x-nek.",
  },
  {
    id: "haromrud",
    cim: "Három rúd",
    origo: [150, 120],
    leptek: 56,
    tarto: [0, 5],
    tamaszok: [
      { id: "L", x: 0, y: 0, tipus: "rudveg", cel: [1.2, -2] },
      { id: "C", x: 2, y: 0, tipus: "rudveg", cel: [1.2, -2], cel2: [2, -2] },
    ],
    csuklok: [
      { id: "A", x: 1.2, y: -2 },
      { id: "B", x: 2, y: -2 },
    ],
    terhek: [
      { x: 0.7, szog: -90, cimke: "F₁" },
      { x: 4.3, szog: -120, cimke: "F₂" },
    ],
    ismeretlenek: [
      { id: "S1", tex: "S_1", P: [0, 0], e: [1.2 / Math.hypot(1.2, 2), -2 / Math.hypot(1.2, 2)] },
      { id: "S2", tex: "S_2", P: [2, 0], e: [-0.8 / Math.hypot(0.8, 2), -2 / Math.hypot(0.8, 2)] },
      { id: "S3", tex: "S_3", P: [2, 0], e: [0, -1] },
    ],
    fopontok: [
      { id: "O₁", x: 2, y: 0 },
      { id: "O₂", x: 2, y: -2 / 0.6 },
      { id: "O₃", x: 1.2, y: -2 },
    ],
    tipp: "Három főpont: O₁ = C (S₂ és S₃ metszéspontja → S₁), O₂ (S₁ és S₃ → S₂), O₃ = A (S₁ és S₂ → S₃).",
  },
];

export default function EgyenletValaszto({ kezdoSzerkezet = 1, kezdoMod, kezdoFi = 0 }) {
  const [szIdx, setSzIdx] = useState(kezdoSzerkezet);
  const [mod, setMod] = useState(kezdoMod ?? { tipus: "nyomatek", P: { x: 0, y: 0 }, nev: "A" });
  const [fi, setFi] = useState(kezdoFi);
  const [hatasvonalak, setHatasvonalak] = useState(true);
  const svgRef = useRef(null);

  const szk = SZERKEZETEK[szIdx];
  const [OX, OY] = szk.origo;
  const L = szk.leptek;
  const kx = (x) => OX + x * L;
  const ky = (y) => OY - y * L;

  const nevezettek = [...szk.tamaszok.map((t) => ({ id: t.id, x: t.x, y: t.y })), ...(szk.csuklok ?? []).map((cs) => ({ ...cs }))];
  for (const f of szk.fopontok) {
    const meglevo = nevezettek.find((n) => Math.hypot(n.x - f.x, n.y - f.y) < 1e-6);
    if (meglevo) {
      meglevo.cimke = `${f.id} = ${meglevo.id}`;
      meglevo.id = f.id;
      meglevo.fopont = true;
    } else {
      nevezettek.push({ ...f, fopont: true });
    }
  }

  const valtSzerkezet = (i) => {
    setSzIdx(i);
    setMod({ tipus: "nyomatek", P: { x: 0, y: 0 }, nev: SZERKEZETEK[i].tamaszok[0].id });
  };

  const kattint = (e) => {
    const svg = svgRef.current;
    if (!svg) return;
    const r = svg.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * SZ;
    const py = ((e.clientY - r.top) / r.height) * MA;
    // rápattanás nevezett pontra
    let nev = null;
    let P = { x: Math.round(((px - OX) / L) * 2) / 2, y: Math.round(((OY - py) / L) * 2) / 2 };
    for (const n of nevezettek) {
      if (Math.hypot(kx(n.x) - px, ky(n.y) - py) < 16) {
        P = { x: n.x, y: n.y };
        nev = n.id;
        break;
      }
    }
    setMod({ tipus: "nyomatek", P, nev });
  };

  // ---- együtthatók ----
  const d = { x: c(fi), y: s(fi) };
  const eredmeny = szk.ismeretlenek.map((u) => {
    let k;
    let indok;
    if (mod.tipus === "nyomatek") {
      k = (u.P[0] - mod.P.x) * u.e[1] - (u.P[1] - mod.P.y) * u.e[0];
      indok = "a pont a hatásvonalán van (karja nulla)";
    } else {
      k = u.e[0] * d.x + u.e[1] * d.y;
      indok = "merőleges a vetítés irányára";
    }
    const benne = Math.abs(k) > 1e-4;
    return { ...u, k, benne, indok };
  });
  const bentLevok = eredmeny.filter((r) => r.benne);
  const db = bentLevok.length;

  const jelleg = mod.tipus === "nyomatek" ? (mod.nev ? `\\Mp{${mod.nev.replace(/[₁₂₃]/, (m) => ({ "₁": "_1", "₂": "_2", "₃": "_3" })[m])}}` : "\\Mp{P}") : fi === 0 ? "\\Fx" : fi === 90 ? "\\Fy" : `\\textstyle\\sum F_{i\\varphi}\\ (\\varphi=${fi}^\\circ):\\ `;
  const egyenletTex = `${jelleg}\\ \\text{terhek}${bentLevok.map((r) => ` ${r.k < 0 ? "-" : "+"} ${szK(Math.abs(r.k), 2)}\\,${r.tex}`).join("")} = 0`;

  const statusz =
    db === 1
      ? { szin: "emerald", cim: "Egyismeretlenes egyenlet", szoveg: <>Ebből <M>{bentLevok[0].tex}</M> közvetlenül kiszámolható. Pont ilyet keresünk.</> }
      : db === 2
        ? { szin: "naracs", cim: "Két ismeretlen maradt", szoveg: "Csak egy másik egyenlettel együtt oldható meg — vagy ha az egyiket már kiszámoltad." }
        : db === 3
          ? { szin: "rose", cim: "Mindhárom ismeretlen benne van", szoveg: "Ez az egyenlet önmagában semmit nem ad. Keress olyan pontot vagy irányt, ahol kettő kiesik." }
          : { szin: "petrol", cim: "Nincs benne ismeretlen", szoveg: "Csak a terhek maradtak — ez az egyenlet nem ad új információt, legfeljebb a terhek ellenőrzésére jó." };
  const statuszOsztaly = {
    emerald: "border-emerald-300 bg-emerald-50 text-emerald-900",
    naracs: "border-naracs-300 bg-naracs-50 text-naracs-900",
    rose: "border-rose-300 bg-rose-50 text-rose-900",
    petrol: "border-petrol-200 bg-petrol-50 text-petrol-800",
  }[statusz.szin];

  // ---- rajz-segédek ----
  const hatasvonal = (u) => {
    const t = 12;
    return { x1: kx(u.P[0] - u.e[0] * t), y1: ky(u.P[1] - u.e[1] * t), x2: kx(u.P[0] + u.e[0] * t), y2: ky(u.P[1] + u.e[1] * t) };
  };
  const reakcioNyil = (u) => {
    // a nyíl a P pontból indul, az e irányba mutat (húzott rúdnál kifelé);
    // „pontban”: a hegye a P pontban van (A_x balról érkezik, hogy ne fedje a tartót)
    const h = 44;
    const szog = (Math.atan2(u.e[1], u.e[0]) * 180) / Math.PI;
    if (u.pontban) return { x: kx(u.P[0]), y: ky(u.P[1]), szog, cx: kx(u.P[0]) - h - 4, cy: ky(u.P[1]) - 8 };
    const x = kx(u.P[0]) + h * u.e[0];
    const y = ky(u.P[1]) - h * u.e[1];
    return { x, y, szog, cx: x + u.e[0] * 12 + (Math.abs(u.e[0]) < 0.01 ? 10 : 0), cy: y - u.e[1] * 12 + 5 };
  };
  // a kiválasztott pont koordináta-felirata: ne fedje a pont nevét (a név jobbra-lent áll a tengely alatti pontoknál)
  const kivalasztott = mod.tipus === "nyomatek" && mod.nev ? nevezettek.find((n) => n.id === mod.nev) : null;
  const nevBalra = kivalasztott ? kivalasztott.x <= 0 || (kivalasztott.cimke && kivalasztott.y < 0) : false;
  const nevLent = kivalasztott ? !(kivalasztott.y >= 0 && kivalasztott.id !== "A" && kivalasztott.id !== "L") : false;
  const koordDy = mod.tipus === "nyomatek" ? (mod.P.y > 0.01 ? -10 : nevLent && !nevBalra ? 42 : 26) : 0;
  const talp = (u) => {
    const vx = mod.P.x - u.P[0];
    const vy = mod.P.y - u.P[1];
    const t = vx * u.e[0] + vy * u.e[1];
    return { x: u.P[0] + t * u.e[0], y: u.P[1] + t * u.e[1] };
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white">
      <div className="flex flex-wrap items-center gap-2 border-b border-[color:var(--keret)] bg-petrol-50/70 px-3 py-2">
        <div className="flex flex-wrap gap-1 rounded-lg bg-white p-0.5 ring-1 ring-petrol-200">
          {SZERKEZETEK.map((sz_, i) => (
            <button key={sz_.id} type="button" onClick={() => valtSzerkezet(i)} className={`rounded-md px-2.5 py-1 text-[12px] font-medium transition ${szIdx === i ? "bg-petrol-700 text-white" : "text-petrol-600 hover:bg-petrol-50"}`}>
              {sz_.cim}
            </button>
          ))}
        </div>
        <label className="ml-auto flex cursor-pointer items-center gap-2 text-[12px] font-medium text-petrol-600">
          <input type="checkbox" checked={hatasvonalak} onChange={(e) => setHatasvonalak(e.target.checked)} className="accent-[color:var(--color-naracs-500)]" />
          Hatásvonalak és főpontok
        </label>
      </div>

      <div className="grid lg:grid-cols-[1.35fr_1fr] [&>*]:min-w-0">
        <div className="racs-vilagos border-b border-[color:var(--keret)] p-3 lg:border-r lg:border-b-0">
          <svg ref={svgRef} viewBox={`0 0 ${SZ} ${MA}`} className="abra w-full h-auto select-none" onClick={kattint} style={{ cursor: "crosshair" }}>
            <TartoHegyek />
            <rect x={0} y={0} width={SZ} height={MA} fill="transparent" />
            <text x={12} y={20} fontSize="11" fontWeight="700" letterSpacing="1.5" style={{ fill: "#64748b" }}>
              KATTINTS EGY PONTRA → NYOMATÉKI EGYENLET ARRA A PONTRA
            </text>

            {/* hatásvonalak */}
            {hatasvonalak &&
              eredmeny.map((u) => {
                const hv = hatasvonal(u);
                return <line key={u.id} {...hv} stroke={u.benne ? "#7c3aed" : "#94a3b8"} strokeWidth={u.benne ? 1.4 : 1} strokeDasharray="6 4" opacity={u.benne ? 0.8 : 0.5} />;
              })}

            {/* támaszok halványan (elkülönítve) */}
            {szk.tamaszok.map((t) => {
              if (t.tipus === "csuklo") return <Csuklo key={t.id} x={kx(t.x)} y={ky(t.y)} opacitas={0.3} />;
              if (t.tipus === "gorgo") return <Gorgo key={t.id} x={kx(t.x)} y={ky(t.y)} szog={t.szog} opacitas={0.3} />;
              if (t.tipus === "rud")
                return (
                  <g key={t.id} opacity="0.3">
                    <Befogas x={kx(t.W[0]) - 4} y={ky(t.W[1])} irany="bal" hossz={26} />
                    <Rud x1={kx(t.W[0])} y1={ky(t.W[1])} x2={kx(t.x)} y2={ky(t.y)} />
                  </g>
                );
              return (
                <g key={t.id} opacity="0.3">
                  <Rud x1={kx(t.x)} y1={ky(t.y)} x2={kx(t.cel[0])} y2={ky(t.cel[1])} />
                  {t.cel2 && <Rud x1={kx(t.x)} y1={ky(t.y)} x2={kx(t.cel2[0])} y2={ky(t.cel2[1])} />}
                </g>
              );
            })}
            {szk.csuklok?.map((cs) => (
              <g key={cs.id} opacity="0.3">
                <Csuklo x={kx(cs.x)} y={ky(cs.y)} meret={12} />
              </g>
            ))}

            {/* terhek */}
            {szk.terhek.map((f, i) => (
              <TeherNyil key={i} x={kx(f.x)} y={ky(0)} hossz={46} szog={f.szog} cimke={f.cimke} cimkeEltolas={f.szog === -90 ? [8, -4] : f.szog < -90 ? [6, -4] : [-24, -4]} />
            ))}

            {/* a tartó */}
            <Tarto x1={kx(szk.tarto[0])} y1={ky(0)} x2={kx(szk.tarto[1])} y2={ky(0)} />

            {/* reakciók */}
            {eredmeny.map((u) => {
              const ny = reakcioNyil(u);
              return (
                <g key={u.id} opacity={u.benne ? 1 : 0.35}>
                  <ReakcioNyil x={ny.x} y={ny.y} hossz={44} szog={ny.szog} />
                  <text x={ny.cx} y={ny.cy} textAnchor={u.pontban ? "end" : "start"} fontSize="13.5" fontStyle="italic" fontWeight="650" style={{ fill: SZIN.reakcio, paintOrder: "stroke", stroke: "white", strokeWidth: 3.5 }}>
                    {u.tex.replace(/_(.+)/, "")}
                    {u.tex.includes("_") && (
                      <tspan dy="3.5" fontSize="10">
                        {u.tex.split("_")[1]}
                      </tspan>
                    )}
                  </text>
                </g>
              );
            })}

            {/* nevezett pontok */}
            {nevezettek.map((n) => {
              const fopont = Boolean(n.fopont);
              if (fopont && !hatasvonalak && !n.cimke) return null;
              return (
                <g key={n.id}>
                  <circle cx={kx(n.x)} cy={ky(n.y)} r={fopont ? 4 : 3.4} fill={fopont ? "#7c3aed" : "#0f172a"} stroke="white" strokeWidth="1.2" />
                  <TamaszCimke x={kx(n.x) + (n.x <= 0 ? -14 : 14) + (n.cimke ? (n.y < 0 ? -50 : 12) : 0)} y={ky(n.y) + (n.y >= 0 && n.id !== "A" && n.id !== "L" ? -8 : 20)} szin={fopont ? "#6d28d9" : SZIN.tarto}>
                    {n.cimke ?? n.id}
                  </TamaszCimke>
                </g>
              );
            })}

            {/* a választott pont és a karok */}
            {mod.tipus === "nyomatek" && (
              <g>
                {bentLevok.map((u) => {
                  const tp = talp(u);
                  return <line key={u.id} x1={kx(mod.P.x)} y1={ky(mod.P.y)} x2={kx(tp.x)} y2={ky(tp.y)} stroke="#7c3aed" strokeWidth="1.6" strokeDasharray="3 3" />;
                })}
                <circle cx={kx(mod.P.x)} cy={ky(mod.P.y)} r="9" fill="none" stroke="#e2590a" strokeWidth="2.2" />
                <circle cx={kx(mod.P.x)} cy={ky(mod.P.y)} r="2.5" fill="#e2590a" />
                <text x={kx(mod.P.x) + 12} y={ky(mod.P.y) + koordDy} fontSize="12.5" fontWeight="700" style={{ fill: "#e2590a", paintOrder: "stroke", stroke: "white", strokeWidth: 3.5 }}>
                  {mod.nev ? `(${sz(mod.P.x, 1)}; ${sz(mod.P.y, 1)})` : `P (${sz(mod.P.x, 1)}; ${sz(mod.P.y, 1)})`}
                </text>
              </g>
            )}
            {mod.tipus === "vetulet" && (
              <g>
                <circle cx={SZ - 60} cy={MA - 50} r="30" fill="white" fillOpacity="0.8" stroke="#e2e8f0" />
                <line x1={SZ - 60 - 24 * d.x} y1={MA - 50 + 24 * d.y} x2={SZ - 60 + 24 * d.x} y2={MA - 50 - 24 * d.y} stroke="#e2590a" strokeWidth="2.4" markerEnd="url(#th-teher)" />
                <text x={SZ - 60} y={MA - 8} textAnchor="middle" fontSize="12" fontWeight="700" style={{ fill: "#e2590a" }}>
                  vetítés: φ = {fi}°
                </text>
              </g>
            )}
          </svg>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
            <span className="text-[11.5px] text-petrol-500">Vetületi egyenlet:</span>
            {[
              [0, "x irány"],
              [90, "y irány"],
            ].map(([f, cimke]) => (
              <button key={f} type="button" onClick={() => { setFi(f); setMod({ tipus: "vetulet" }); }} className={`rounded-lg px-2.5 py-1.5 text-[12px] font-medium ring-1 transition ${mod.tipus === "vetulet" && fi === f ? "bg-petrol-700 text-white ring-petrol-700" : "bg-white text-petrol-700 ring-petrol-200 hover:bg-petrol-50"}`}>
                {cimke}
              </button>
            ))}
            <div className="w-44">
              <Csuszka cimke="tetszőleges φ" ertek={fi} egyseg="°" min={0} max={180} lepes={5} tizedes={0} onChange={(v) => { setFi(v); setMod({ tipus: "vetulet" }); }} />
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">
            {mod.tipus === "nyomatek" ? `Nyomatéki egyenlet a(z) ${mod.nev ?? "P"} pontra` : `Vetületi egyenlet, φ = ${fi}°`}
          </p>
          <div className={`mt-2 rounded-xl border p-3 ${statuszOsztaly}`}>
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-white text-lg font-bold ring-1 ring-black/5">{db}</span>
              <span className="text-[13.5px] font-semibold">{statusz.cim}</span>
            </div>
            <p className="mt-1.5 text-[12.5px] leading-relaxed">{statusz.szoveg}</p>
          </div>

          <ul className="mt-3 space-y-1.5">
            {eredmeny.map((u) => (
              <li key={u.id} className={`flex items-baseline gap-2 rounded-lg px-2.5 py-1.5 text-[12.5px] ${u.benne ? "bg-violet-50 text-violet-900" : "bg-petrol-50 text-petrol-400 line-through decoration-petrol-300"}`}>
                <span className="szamok w-8 shrink-0 font-semibold">
                  <M>{u.tex}</M>
                </span>
                {u.benne ? (
                  <span>
                    benne van, együttható {mod.tipus === "nyomatek" ? "(kar)" : "(irány-koszinusz)"}: <span className="szamok font-semibold">{zarojel(u.k, 2)}</span>
                    {mod.tipus === "nyomatek" ? " m" : ""}
                  </span>
                ) : (
                  <span>kiesik: {u.indok}</span>
                )}
              </li>
            ))}
          </ul>

          <div className="szamok mt-3 overflow-x-auto rounded-xl bg-petrol-50 px-3 py-2 text-[13px] text-petrol-800">
            <M>{egyenletTex}</M>
          </div>
          <p className="mt-3 text-[12px] leading-relaxed text-petrol-500">
            <span className="font-semibold text-petrol-700">Tipp ehhez a tartóhoz:</span> {szk.tipp}
          </p>
        </div>
      </div>
    </div>
  );
}
