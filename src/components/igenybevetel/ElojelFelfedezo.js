"use client";

import { useState } from "react";
import { Csuszka } from "@/components/abrak/ErovektorBonto";
import { SZINEK } from "@/components/igenybevetel/Diagram";
import { SZIN } from "@/components/tartok/TartoElemek";

/**
 * Előjel-felfedező: egy (akár ferde) rúdon a K keresztmetszet két oldalán a
 * pozitív N, V, M nyilak. A hallgató választja a haladási irányt és a pozitív
 * oldalt (a tankönyv: a haladási irány szerinti jobb oldal, vízszintes rúdnál
 * az alsó), és látja, mi fordul és mi nem: N mindig kifelé, V az N óramutató
 * szerinti 90°-os elforgatottja — ezek a választástól függetlenek; csak az M
 * nyíl indul a választott pozitív oldalról.
 */

const SZ = 600, MA = 330;
const C = [300, 150];

/** Félkör S-től E-ig a Q ponton át (képernyő-koordináták). */
function felkor(P, S, E, Q, r) {
  const z = (S[0] - P[0]) * (Q[1] - P[1]) - (S[1] - P[1]) * (Q[0] - P[0]);
  return `M ${S[0]} ${S[1]} A ${r} ${r} 0 0 ${z > 0 ? 1 : 0} ${E[0]} ${E[1]}`;
}

const Felirat = ({ x, y, szin, children, horgony = "middle" }) => (
  <text x={x} y={y} textAnchor={horgony} fontSize="12" fontWeight="700" style={{ fill: szin, paintOrder: "stroke", stroke: "white", strokeWidth: 3.5 }}>{children}</text>
);

export default function ElojelFelfedezo() {
  const [beta, setBeta] = useState(0);
  const [irany, setIrany] = useState("AB"); // haladási irány
  const [oldal, setOldal] = useState("jobb"); // pozitív oldal a haladási irányhoz képest

  const b = (beta * Math.PI) / 180;
  const u = [Math.cos(b), -Math.sin(b)]; // a rúd iránya A → B a képernyőn (y lefelé)
  const h = irany === "AB" ? u : [-u[0], -u[1]]; // haladási irány
  // a haladási irány szerinti jobb oldal a képernyőn: h 90°-kal az óramutató szerint elforgatva
  const jobbOldal = [-h[1], h[0]];
  const poz = oldal === "jobb" ? jobbOldal : [-jobbOldal[0], -jobbOldal[1]];
  const A = [C[0] - u[0] * 190, C[1] - u[1] * 190], B = [C[0] + u[0] * 190, C[1] + u[1] * 190];
  const res = 28;
  const PA = [C[0] - u[0] * res, C[1] - u[1] * res]; // az A felőli rész vége
  const PB = [C[0] + u[0] * res, C[1] + u[1] * res]; // a B felőli rész eleje
  const cw = (v) => [-v[1], v[0]]; // 90° az óramutató szerint (képernyőn)

  const Vagas = ({ P, ki, nev }) => {
    const n = ki; // pozitív N: kifelé
    const v = cw(ki); // pozitív V
    const r = 17;
    const S = [P[0] + poz[0] * r, P[1] + poz[1] * r], E = [P[0] - poz[0] * r, P[1] - poz[1] * r];
    const Q = [P[0] + ki[0] * r, P[1] + ki[1] * r];
    return (
      <g>
        <line x1={P[0] - jobbOldal[0] * 12} y1={P[1] - jobbOldal[1] * 12} x2={P[0] + jobbOldal[0] * 12} y2={P[1] + jobbOldal[1] * 12} stroke="#334155" strokeWidth="2" />
        <line x1={P[0]} y1={P[1]} x2={P[0] + n[0] * 46} y2={P[1] + n[1] * 46} stroke={SZINEK.N} strokeWidth="2.8" markerEnd="url(#ef-N)" />
        <Felirat x={P[0] + n[0] * 60} y={P[1] + n[1] * 60 + 4} szin={SZINEK.N}>N{nev}</Felirat>
        <line x1={P[0]} y1={P[1]} x2={P[0] + v[0] * 46} y2={P[1] + v[1] * 46} stroke={SZINEK.V} strokeWidth="2.8" markerEnd="url(#ef-V)" />
        <Felirat x={P[0] + v[0] * 60} y={P[1] + v[1] * 60 + 4} szin={SZINEK.V}>V{nev}</Felirat>
        <path d={felkor(P, S, E, Q, r)} fill="none" stroke={SZINEK.M} strokeWidth="2.6" markerEnd="url(#ef-M)" />
        <circle cx={S[0]} cy={S[1]} r="3" fill={SZINEK.M} />
        <Felirat x={P[0] - ki[0] * 8 + poz[0] * 34} y={P[1] - ki[1] * 8 + poz[1] * 34 + 4} szin={SZINEK.M}>M{nev}</Felirat>
      </g>
    );
  };

  const pozNev = (() => {
    const fuggo = poz[1] < -0.5 ? "felső" : poz[1] > 0.5 ? "alsó" : poz[0] > 0 ? "jobb" : "bal";
    return fuggo;
  })();

  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white shadow-sm shadow-petrol-900/[0.04]">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-b border-[color:var(--keret)] bg-linear-to-r from-petrol-800 to-petrol-700 px-5 py-3.5">
        <span className="rounded-md bg-naracs-500 px-2 py-0.5 text-[10.5px] font-bold tracking-[0.14em] text-white uppercase">Felfedező</span>
        <h3 className="text-[15px] font-semibold text-white">Az előjelszabály — mi fordul, mi nem?</h3>
      </div>
      <div className="grid lg:grid-cols-[1.4fr_1fr] [&>*]:min-w-0">
        <div className="racs-vilagos border-b border-[color:var(--keret)] p-3 lg:border-r lg:border-b-0">
          <svg viewBox={`0 0 ${SZ} ${MA}`} className="abra h-auto w-full select-none">
            <defs>
              {[["ef-N", SZINEK.N], ["ef-V", SZINEK.V], ["ef-M", SZINEK.M], ["ef-h", "#0e7490"]].map(([id, szin]) => (
                <marker key={id} id={id} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
                  <path d="M 0 1 L 9 5 L 0 9 z" fill={szin} />
                </marker>
              ))}
            </defs>
            {/* a két rész */}
            <line x1={A[0]} y1={A[1]} x2={PA[0]} y2={PA[1]} stroke={SZIN.tarto} strokeWidth="7" strokeLinecap="round" />
            <line x1={PB[0]} y1={PB[1]} x2={B[0]} y2={B[1]} stroke={SZIN.tarto} strokeWidth="7" strokeLinecap="round" />
            <Felirat x={A[0] - u[0] * 16} y={A[1] - u[1] * 16 + 4} szin={SZIN.tarto}>A</Felirat>
            <Felirat x={B[0] + u[0] * 16} y={B[1] + u[1] * 16 + 4} szin={SZIN.tarto}>B</Felirat>
            {/* haladási irány nyíl a rúd mellett */}
            <line x1={C[0] - h[0] * 120 - poz[0] * 0 + jobbOldal[0] * -60} y1={C[1] - h[1] * 120 + jobbOldal[1] * -60}
              x2={C[0] + h[0] * 120 + jobbOldal[0] * -60} y2={C[1] + h[1] * 120 + jobbOldal[1] * -60}
              stroke="#0e7490" strokeWidth="1.6" strokeDasharray="5 4" markerEnd="url(#ef-h)" />
            <Felirat x={C[0] + jobbOldal[0] * -74} y={C[1] + jobbOldal[1] * -74 + 4} szin="#0e7490">haladási irány {irany === "AB" ? "A → B" : "B → A"}</Felirat>
            {/* pozitív és negatív oldal jelölése */}
            <Felirat x={C[0] - u[0] * 120 + poz[0] * 22} y={C[1] - u[1] * 120 + poz[1] * 22 + 4} szin={SZINEK.M}>+</Felirat>
            <Felirat x={C[0] - u[0] * 120 - poz[0] * 22} y={C[1] - u[1] * 120 - poz[1] * 22 + 4} szin="#64748b">−</Felirat>
            <Felirat x={C[0] + u[0] * 120 + poz[0] * 22} y={C[1] + u[1] * 120 + poz[1] * 22 + 4} szin={SZINEK.M}>+</Felirat>
            <Felirat x={C[0] + u[0] * 120 - poz[0] * 22} y={C[1] + u[1] * 120 - poz[1] * 22 + 4} szin="#64748b">−</Felirat>
            {/* a keresztmetszet két oldala */}
            <Vagas P={PA} ki={u} nev="ₖ" />
            <Vagas P={PB} ki={[-u[0], -u[1]]} nev="ₖ" />
            <text x={10} y={MA - 10} fontSize="11" style={{ fill: "#64748b" }}>A pont a nyomatéknyíl kezdete: a pozitív ({pozNev}) oldalról indul, kívülről rárajzolva.</text>
          </svg>
        </div>
        <div className="p-4 sm:p-5">
          <Csuszka cimke="A rúd dőlésszöge" ertek={beta} egyseg="°" min={0} max={90} lepes={5} tizedes={0} onChange={setBeta} />
          <p className="mt-3 text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">Haladási irány</p>
          <div className="mt-1 flex gap-1.5">
            {[["AB", "A → B"], ["BA", "B → A"]].map(([id, nev]) => (
              <button key={id} type="button" onClick={() => setIrany(id)} className={`rounded-lg px-3 py-1.5 text-[12.5px] font-semibold transition ${irany === id ? "bg-petrol-800 text-white" : "bg-white text-petrol-700 ring-1 ring-petrol-200 hover:bg-petrol-50"}`}>{nev}</button>
            ))}
          </div>
          <p className="mt-3 text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">Pozitív oldal (a haladási irányhoz képest)</p>
          <div className="mt-1 flex gap-1.5">
            {[["jobb", "jobb oldal (tankönyvi alap)"], ["bal", "bal oldal"]].map(([id, nev]) => (
              <button key={id} type="button" onClick={() => setOldal(id)} className={`rounded-lg px-3 py-1.5 text-[12.5px] font-semibold transition ${oldal === id ? "bg-petrol-800 text-white" : "bg-white text-petrol-700 ring-1 ring-petrol-200 hover:bg-petrol-50"}`}>{nev}</button>
            ))}
          </div>
          <ul className="mt-4 space-y-2 text-[13px] leading-relaxed text-petrol-800">
            <li><span className="font-bold" style={{ color: SZINEK.N }}>N</span> mindig a keresztmetszetből <strong>kifelé</strong> mutat (húz) — nem függ sem a haladási iránytól, sem a pozitív oldaltól.</li>
            <li><span className="font-bold" style={{ color: SZINEK.V }}>V</span> az N nyíl <strong>90°-os, óramutató szerinti</strong> elforgatottja — ez sem függ a választástól. A két oldalon ellentett nyilak, azonos előjel.</li>
            <li><span className="font-bold" style={{ color: SZINEK.M }}>M</span> nyilát a <strong>pozitív oldalról</strong> indítjuk: most ez a(z) <strong>{pozNev}</strong> oldal. Ha átváltod az oldalt, csak az M nyilak fordulnak meg.</li>
          </ul>
          <p className="mt-3 rounded-lg bg-petrol-50 px-3 py-2 text-[12px] leading-relaxed text-petrol-600 ring-1 ring-petrol-200">
            A gyakorlatban vízszintes vagy közel vízszintes rúdon az alsó oldalt választjuk pozitívnak, így az M ábra mindig a húzott oldalra kerül. Ferde vagy függőleges rúdon dönteni kell — és a döntést az ábrán a + jellel jelöljük.
            Ugyanerre a pozitív oldalra mérjük fel az N és a V ábrát is (tankönyv 8.3.2): vízszintes tartón a pozitív N, V és M mind a tartó alatt, a negatív fölötte van.
          </p>
        </div>
      </div>
    </div>
  );
}
