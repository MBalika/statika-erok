"use client";

import { useState } from "react";
import { M, MB } from "@/components/ui/Keplet";
import { bakallvany, f4, zarK } from "@/lib/terbeli";
import { sz } from "@/lib/szamok";
import { TerHegyek, Felirat, SZ } from "./Axono";

/*
 * Bakállvány-kalkulátor: a csúcs magassága, a három talppont (x, z) és a teher (F_x, F_y, F_z)
 * → a három rúderő a tankönyv (9.3)–(9.5) egyenleteivel, levezetéssel és visszahelyettesítéssel.
 */

const ELORE = [
  { nev: "H13/3", h: 6, labak: [[-4, 0], [5, -4], [5, 4]], F: [-7.071, -7.071, 0] },
  { nev: "vizsgaminta", h: 6, labak: [[0, 4], [0, 0], [5, -4]], F: [6, 0, 0] },
  { nev: "szimmetrikus, függőleges teher", h: 5, labak: [[-3, 3], [-3, -3], [4, 0]], F: [0, -12, 0] },
];

function SzamMezo({ cimke, ertek, onChange, lepes = 0.5, szeles = false }) {
  return (
    <label className={`block ${szeles ? "sm:col-span-2" : ""}`}>
      <span className="mb-0.5 block text-[11.5px] font-medium text-petrol-500">{cimke}</span>
      <input type="number" step={lepes} value={ertek} onChange={(e) => onChange(Number(e.target.value))} className="szamok w-full rounded-lg border border-petrol-200 bg-white px-2 py-1.5 text-[13px] text-petrol-900 focus:border-naracs-400 focus:outline-none" />
    </label>
  );
}

function FelulNezet({ labak, csucs, F, S }) {
  // x jobbra, z lefelé a rajzon (felülnézet)
  const pontok = [...labak.map((p) => [p[0], p[2]]), [csucs[0], csucs[2]]];
  const xs = pontok.map((p) => p[0]);
  const zs = pontok.map((p) => p[1]);
  const minX = Math.min(...xs) - 1.5;
  const maxX = Math.max(...xs) + 1.5;
  const minZ = Math.min(...zs) - 1.5;
  const maxZ = Math.max(...zs) + 1.5;
  // bal és jobb oldalon hely a „i: S” feliratoknak (~70 px)
  const k = Math.min(200 / (maxX - minX), 220 / (maxZ - minZ));
  const X = (x) => 70 + (x - minX) * k;
  const Z = (z) => 30 + (z - minZ) * k;
  const Fh = Math.hypot(F[0], F[2]);
  return (
    <svg viewBox="0 0 340 290" className="w-full h-auto">
      <TerHegyek />
      <Felirat x={170} y={16} meret={12}>Felülnézet (x jobbra, z lefelé)</Felirat>
      <line x1={X(0)} y1={Z(minZ)} x2={X(0)} y2={Z(maxZ)} stroke="#cbd5e1" strokeWidth="1" />
      <line x1={X(minX)} y1={Z(0)} x2={X(maxX)} y2={Z(0)} stroke="#cbd5e1" strokeWidth="1" />
      {labak.map((p, i) => {
        const szin = !S ? SZ.tarto : Math.abs(S[i]) < 1e-6 ? SZ.seged : S[i] < 0 ? SZ.nyomott : SZ.huzott;
        return (
          <g key={i}>
            <line x1={X(csucs[0])} y1={Z(csucs[2])} x2={X(p[0])} y2={Z(p[2])} stroke={szin} strokeWidth={S ? 2 + 3 * Math.min(1, Math.abs(S[i]) / Math.max(1e-9, ...S.map(Math.abs))) : 3} strokeLinecap="round" />
            <circle cx={X(p[0])} cy={Z(p[2])} r="4" fill="white" stroke={szin} strokeWidth="2" />
            <Felirat x={X(p[0]) + (p[0] >= csucs[0] ? 10 : -10)} y={Z(p[2]) + 4} meret={11} szin={szin} horgony={p[0] >= csucs[0] ? "start" : "end"}>
              {i + 1}{S ? `: ${sz(S[i], 2)}` : ""}
            </Felirat>
          </g>
        );
      })}
      <circle cx={X(csucs[0])} cy={Z(csucs[2])} r="5" fill={SZ.tarto} />
      {Fh > 1e-6 && (
        <g>
          <line x1={X(csucs[0]) - (F[0] / Fh) * 40} y1={Z(csucs[2]) - (F[2] / Fh) * 40} x2={X(csucs[0])} y2={Z(csucs[2])} stroke={SZ.teher} strokeWidth="2.6" markerEnd="url(#tr-teher)" />
          <Felirat x={X(csucs[0]) - (F[0] / Fh) * 48} y={Z(csucs[2]) - (F[2] / Fh) * 48 - 6} meret={11} szin={SZ.teher}>F vízszintes vetülete</Felirat>
        </g>
      )}
      <Felirat x={170} y={278} meret={10.5} vastag={false} szin="#475569">piros: húzott, kék: nyomott; a vastagság ∝ |S|</Felirat>
    </svg>
  );
}

export default function BakallvanyKalk() {
  const [h, setH] = useState(6);
  const [labak, setLabak] = useState([[-4, 0], [5, -4], [5, 4]]);
  const [F, setF] = useState([-7.071, -7.071, 0]);
  const csucs = [0, h, 0];
  const labak3 = labak.map((p) => [p[0], 0, p[1]]);
  const er = bakallvany({ csucs, labak: labak3, F });
  const { S, e, l, ok, ellenorzes } = er;
  const komp = ["x", "y", "z"];
  const makro = ["\\Fx", "\\Fy", "\\Fz"];
  const setLab = (i, k, v) => setLabak(labak.map((p, j) => (j === i ? p.map((c, m) => (m === k ? v : c)) : p)));
  const beallit = (el) => {
    setH(el.h);
    setLabak(el.labak);
    setF(el.F);
  };
  const tag = (i, k) => `${e[i][k] < 0 ? "-" : "+"} S_${i + 1}\\,\\tfrac{${f4(Math.abs(labak3[i][k] - csucs[k]))}}{${f4(l[i])}}`;
  const tagSzam = (i, k) => `${e[i][k] < 0 ? "-" : "+"} ${f4(Math.abs(e[i][k]))}\\,S_${i + 1}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white">
      <div className="flex flex-wrap items-center gap-2 border-b border-[color:var(--keret)] bg-petrol-50/70 px-4 py-2.5">
        <span className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">Előre beállított</span>
        {ELORE.map((el) => (
          <button key={el.nev} type="button" onClick={() => beallit(el)} className="rounded-lg bg-white px-2.5 py-1.5 text-[12px] font-medium text-petrol-600 ring-1 ring-petrol-200 transition hover:bg-petrol-50">
            {el.nev}
          </button>
        ))}
      </div>
      <div className="grid gap-5 p-4 lg:grid-cols-[1fr_1.2fr] [&>*]:min-w-0 sm:p-5">
        <div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-3">
            <SzamMezo cimke="csúcs magassága h [m]" ertek={h} onChange={setH} />
            {komp.map((k, i) => (
              <SzamMezo key={k} cimke={`F${k} [kN]`} ertek={F[i]} onChange={(v) => setF(F.map((c, j) => (j === i ? v : c)))} lepes={0.1} />
            ))}
            {labak.map((p, i) => (
              <div key={i} className="contents">
                <SzamMezo cimke={`${i + 1}. talppont x [m]`} ertek={p[0]} onChange={(v) => setLab(i, 0, v)} />
                <SzamMezo cimke={`${i + 1}. talppont z [m]`} ertek={p[1]} onChange={(v) => setLab(i, 1, v)} />
              </div>
            ))}
          </div>
          <div className="mt-3">
            <FelulNezet labak={labak3} csucs={csucs} F={F} S={ok ? S : null} />
          </div>
        </div>
        <div className="szamok space-y-1 text-[13px] text-petrol-800">
          <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">Levezetés (tankönyv 9.2.2)</p>
          <p className="text-[13px] text-petrol-600">
            A rúdvektorok a <M>{"C"}</M> csúcsból a talppontokba, a rúderők húzóerőként, a csomópontra a talppont felé mutatnak: <M>{"\\underline S_i = S_i\\,\\underline l_i / l_i"}</M>.
          </p>
          {labak3.map((p, i) => (
            <MB key={i}>{`\\underline l_${i + 1} = (${f4(p[0] - csucs[0])};\\ ${f4(p[1] - csucs[1])};\\ ${f4(p[2] - csucs[2])}),\\quad l_${i + 1} = ${f4(l[i])}\\ \\text{m},\\quad \\underline e_${i + 1} = (${f4(e[i][0])};\\ ${f4(e[i][1])};\\ ${f4(e[i][2])})`}</MB>
          ))}
          <MB>{"(\\underline F, \\underline S_1, \\underline S_2, \\underline S_3) \\ekv \\underline O"}</MB>
          {komp.map((k, i) => (
            <MB key={k}>{`${makro[i]} ${zarK(F[i])} ${tag(0, i)} ${tag(1, i)} ${tag(2, i)} = 0 \\;\\Rightarrow\\; ${zarK(F[i])} ${tagSzam(0, i)} ${tagSzam(1, i)} ${tagSzam(2, i)} = 0`}</MB>
          ))}
          {ok ? (
            <>
              <p className="text-[13px] text-petrol-600">A három egyenlet megoldása (a számítómag Gauss-eliminációval; kézzel: fejezd ki az egyik ismeretlent, és helyettesíts):</p>
              <MB>{`S_1 = ${f4(S[0])}\\ \\text{kN}\\ (${S[0] < 0 ? "\\text{nyomott}" : "\\text{húzott}"}),\\quad S_2 = ${f4(S[1])}\\ \\text{kN}\\ (${S[1] < 0 ? "\\text{nyomott}" : "\\text{húzott}"}),\\quad S_3 = ${f4(S[2])}\\ \\text{kN}\\ (${S[2] < 0 ? "\\text{nyomott}" : "\\text{húzott}"})`}</MB>
              <p className="text-[13px] text-petrol-600">Ellenőrzés visszahelyettesítéssel (a csomópontra ható erők összege):</p>
              <MB>{`\\sum\\underline F_i = (${f4(ellenorzes.F[0])};\\ ${f4(ellenorzes.F[1])};\\ ${f4(ellenorzes.F[2])}) \\approx \\underline 0\\ \\checkmark`}</MB>
            </>
          ) : (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-[13px] text-rose-700">A három rúd egy síkba esik (vagy egy egyenesbe) — az egyenletrendszer szinguláris, a bakállvány kritikus elrendezésű. Mozdítsd el az egyik talppontot!</p>
          )}
        </div>
      </div>
    </div>
  );
}
