"use client";

import { useState } from "react";
import { Jelenet3D } from "./Jelenet3D";
import { P, kam, SZIN, RudT, TengelyekT, PadloT, GombcsukloT, EroNyilT, VektorNyilT, CimkeT, PontT, rudStilus } from "./TerbeliAlap";
import { Csuszka } from "@/components/abrak/ErovektorBonto";
import { M, MB } from "@/components/ui/Keplet";
import { terbeliRacsos, f4, zarK, egyseg, sub } from "@/lib/terbeli";
import { sz } from "@/lib/szamok";

/*
 * Térbeli rácsos tartó – csomóponti módszer 3D-ben (tankönyv 9.2.4, GYF‑6).
 * Négy gömbcsuklós talppont (A, B, C, G), két szabad csomópont (D, E), hat rúd; a terhek a D és E csomópontban.
 * Kattints egy csomópontra: a három vetületi egyenlete jelenik meg a már ismert és az ismeretlen rúderőkkel.
 */

const CSOMOPONTOK = [
  { id: "D", p: [2, 3, 2] },
  { id: "E", p: [4, 3, 2] },
  { id: "A", p: [0, 0, 0] },
  { id: "B", p: [6, 0, 0] },
  { id: "C", p: [0, 0, 4] },
  { id: "G", p: [6, 0, 4] },
];
const RUDAK = [
  { id: "1", a: "D", b: "A" },
  { id: "2", a: "D", b: "C" },
  { id: "3", a: "D", b: "B" },
  { id: "4", a: "D", b: "E" },
  { id: "5", a: "E", b: "B" },
  { id: "6", a: "E", b: "G" },
];
const TAMASZOK = ["A", "B", "C", "G"].map((id) => ({ csomopont: id, tipus: "gomb" }));
const pont = (id) => CSOMOPONTOK.find((c) => c.id === id).p;

export default function TerbeliRacsos() {
  const [FE, setFE] = useState(12);
  const [FD, setFD] = useState(8);
  const [FDx, setFDx] = useState(0);
  const [valasztott, setValasztott] = useState("E");
  const terhek = [
    { csomopont: "E", F: [0, -FE, 0] },
    { csomopont: "D", F: [FDx, -FD, 0] },
  ];
  const er = terbeliRacsos({ csomopontok: CSOMOPONTOK, rudak: RUDAK, tamaszok: TAMASZOK, terhek });
  const Smax = er.ok ? Math.max(1, ...Object.values(er.rudErok).map((v) => Math.abs(v))) : 1;
  const csRudjai = RUDAK.filter((r) => r.a === valasztott || r.b === valasztott);
  const csTeher = terhek.find((t) => t.csomopont === valasztott)?.F ?? [0, 0, 0];
  const kiirt = ["x", "y", "z"].map((k, i) => {
    const tagok = csRudjai.map((r) => {
      const masik = r.a === valasztott ? r.b : r.a;
      const e = egyseg(sub(pont(masik), pont(valasztott)));
      return `${e[i] < 0 ? "-" : "+"} ${f4(Math.abs(e[i]))}\\,S_${r.id}`;
    });
    return `${["\\Fx", "\\Fy", "\\Fz"][i]} ${zarK(csTeher[i])} ${tagok.join(" ")} = 0`;
  });

  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white">
      <div className="grid lg:grid-cols-[1.3fr_1fr] [&>*]:min-w-0">
        <div className="border-b border-[color:var(--keret)] p-2 lg:border-r lg:border-b-0">
          <Jelenet3D kamera={kam([11, 7, 12])} cel={P([3, 1.5, 2])} magassag={420} tavolsagMin={4} tavolsagMax={40}>
            <PadloT meret={20} osztas={20} magassag={-0.01} kozep={[3, 2]} />
            <TengelyekT hossz={3} origo={[-0.5, 0, -0.5]} />
            {RUDAK.map((r) => {
              const S = er.ok ? er.rudErok[r.id] : 0;
              const st = rudStilus(S, Smax);
              const a = pont(r.a);
              const b = pont(r.b);
              const kiemelt = r.a === valasztott || r.b === valasztott;
              return (
                <group key={r.id}>
                  <RudT tol={a} ig={b} sugar={st.sugar} szin={st.szin} opacitas={kiemelt ? 1 : 0.45} />
                  <CimkeT pozicio={[(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 0.3, (a[2] + b[2]) / 2]} szin={st.szin} meret={11.5} opacitas={kiemelt ? 1 : 0.6}>
                    {r.id}: {er.ok ? sz(S, 2) : "–"}
                  </CimkeT>
                </group>
              );
            })}
            {CSOMOPONTOK.map((c) => (
              <group key={c.id}>
                {TAMASZOK.some((t) => t.csomopont === c.id) ? <GombcsukloT pozicio={c.p} r={0.2} /> : <PontT pozicio={c.p} r={c.id === valasztott ? 0.24 : 0.17} szin={c.id === valasztott ? "#f59e0b" : SZIN.tarto} />}
                <CimkeT pozicio={[c.p[0] + 0.35, c.p[1] + 0.35, c.p[2]]} szin={c.id === valasztott ? "#b45309" : SZIN.tarto} meret={12.5}>{c.id}</CimkeT>
              </group>
            ))}
            {terhek.map((t) => (Math.hypot(...t.F) > 0.01 ? <EroNyilT key={t.csomopont} pont={pont(t.csomopont)} F={t.F} leptek={0.14} szin={SZIN.teher} cimke={`${sz(Math.hypot(...t.F), 1)} kN`} cimkeEltolas={[0, 0.4, 0]} /> : null))}
            {er.ok && er.reakciok.map((r) => (Math.abs(r.S) > 0.01 ? <VektorNyilT key={r.id} pont={pont(r.csomopont)} F={r.F} leptek={0.1} szin={SZIN.reakcio} vastag={0.06} minHossz={0.6} /> : null))}
          </Jelenet3D>
          <p className="mt-1 text-center text-[11.5px] text-petrol-400">Piros rúd: húzott, kék: nyomott, szürke: vakrúd; vastagság ∝ |S|. Lila nyilak: a gömbcsuklók reakciói. A kiválasztott csomópont rúdjai élénkek.</p>
        </div>
        <div className="p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-[12px] text-petrol-500">Csomópont:</span>
            {CSOMOPONTOK.map((c) => (
              <button key={c.id} type="button" onClick={() => setValasztott(c.id)} className={`rounded-lg px-2.5 py-1.5 text-[12px] font-semibold ring-1 transition ${c.id === valasztott ? "bg-petrol-800 text-white ring-petrol-800" : "bg-white text-petrol-600 ring-petrol-200 hover:bg-petrol-50"}`}>
                {c.id}
              </button>
            ))}
          </div>
          <div className="grid gap-x-4 gap-y-3 sm:grid-cols-3">
            <Csuszka cimke="teher E-ben (lefelé)" ertek={FE} egyseg="kN" min={0} max={20} lepes={1} tizedes={0} onChange={setFE} />
            <Csuszka cimke="teher D-ben (lefelé)" ertek={FD} egyseg="kN" min={0} max={20} lepes={1} tizedes={0} onChange={setFD} />
            <Csuszka cimke="teher D-ben (x irány)" ertek={FDx} egyseg="kN" min={-10} max={10} lepes={1} tizedes={0} onChange={setFDx} />
          </div>
          <div className="mt-4 rounded-xl bg-petrol-50 p-3">
            <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">A(z) {valasztott} csomópont három egyenlete</p>
            <div className="szamok mt-1 space-y-0.5 text-[12.5px] text-petrol-800">
              {kiirt.map((k) => (
                <MB key={k}>{k}</MB>
              ))}
              {er.ok && (
                <MB>{csRudjai.map((r) => `S_${r.id} = ${f4(er.rudErok[r.id])}`).join(",\\quad ") + "\\ \\text{kN}"}</MB>
              )}
            </div>
          </div>
          <div className="mt-3 rounded-xl border border-naracs-200 bg-naracs-50 px-4 py-3 text-[13px] leading-relaxed text-petrol-800">
            <p>
              Számlálás (tankönyv 9.2.4): <M>{"e = 3c = 3\\cdot 6 = 18"}</M>, <M>{"i = r + k = 6 + 4\\cdot 3 = 18"}</M> — lehet határozott, és az is. A csomóponti módszer sorrendje:
              <strong> E</strong>-ben csak három ismeretlen rúd (4, 5, 6) → három egyenletből kijönnek; utána <strong>D</strong>-ben az 1, 2, 3 rúd, a már ismert <M>{"S_4"}</M>-gyel. Rúderőt akkor lehet egyedül kiszámolni, ha a többi ismeretlen rúd egy síkban fekszik: az erre merőleges vetületi egyenletben csak ő szerepel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
