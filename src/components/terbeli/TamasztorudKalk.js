"use client";

import { useState } from "react";
import { M, MB } from "@/components/ui/Keplet";
import { tamasztorudak, f4, zarK, vekK } from "@/lib/terbeli";

/*
 * Támasztórudak kalkulátora: rudakkal (3–6) és esetleg egy gömbcsuklóval megtámasztott merev test térben.
 * Bemenet: a rudak két végpontja (a testhez csatlakozó pont és a rögzített túlsó vég), a gömbcsukló helye,
 * a terhek (támadáspont + erővektor) és egy koncentrált nyomatékvektor.
 * Kimenet: a hat egyensúlyi egyenlet kiírva (\Fx … \sum M_iz), a rúderők (húzás +) és a csukló reakciói,
 * majd visszahelyettesítés.
 */

const ELORE = [
  {
    nev: "H13/4 tartály (gömbcsukló + 3 rúd)",
    gomb: true,
    gombP: [4, 0, 4],
    rudak: [
      { pont: [0, 0, 4], masik: [0, -3, 4] },
      { pont: [4, 0, 0], masik: [6, 0, 0] },
      { pont: [4, 0, 0], masik: [4, -3, 0] },
    ],
    terhek: [
      { pont: [2, 1, 2], F: [0, -480, 0] },
      { pont: [0, 2, 4], F: [-60, 0, 0] },
    ],
    M: [0, 0, 0],
  },
  {
    nev: "lap hat rúdon",
    gomb: false,
    gombP: [0, 0, 0],
    rudak: [
      { pont: [0, 0, 0], masik: [0, -2, 0] },
      { pont: [4, 0, 0], masik: [4, -2, 0] },
      { pont: [4, 0, 2], masik: [4, -2, 2] },
      { pont: [0, 0, 0], masik: [-2, 0, 0] },
      { pont: [0, 0, 0], masik: [0, 0, -2] },
      { pont: [4, 0, 0], masik: [4, 0, -2] },
    ],
    terhek: [
      { pont: [2, 0, 1], F: [0, -10, 0] },
      { pont: [4, 0, 2], F: [5, 0, 3] },
    ],
    M: [0, 0, 0],
  },
  {
    nev: "gömbcsukló + 3 rúd, ferde teher",
    gomb: true,
    gombP: [0, 0, 0],
    rudak: [
      { pont: [4, 0, 0], masik: [4, -3, 0] },
      { pont: [0, 0, 3], masik: [0, -3, 3] },
      { pont: [4, 0, 3], masik: [4, 0, 6] },
    ],
    terhek: [{ pont: [3, 0, 2], F: [4, -12, -3] }],
    M: [0, 6, 0],
  },
];

function Mezo({ ertek, onChange, lepes = 0.5 }) {
  return <input type="number" step={lepes} value={ertek} onChange={(e) => onChange(Number(e.target.value))} className="szamok w-16 rounded-md border border-petrol-200 bg-white px-1.5 py-1 text-[12.5px] text-petrol-900 focus:border-naracs-400 focus:outline-none" />;
}

function Vektor({ ertek, onChange, lepes }) {
  return (
    <span className="inline-flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <Mezo key={i} ertek={ertek[i]} lepes={lepes} onChange={(v) => onChange(ertek.map((c, j) => (j === i ? v : c)))} />
      ))}
    </span>
  );
}

const Fej = ({ children }) => <p className="mt-3 mb-1 text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">{children}</p>;

export default function TamasztorudKalk() {
  const [gomb, setGomb] = useState(true);
  const [gombP, setGombP] = useState([4, 0, 4]);
  const [rudak, setRudak] = useState(ELORE[0].rudak);
  const [terhek, setTerhek] = useState(ELORE[0].terhek);
  const [Mk, setMk] = useState([0, 0, 0]);
  const beallit = (el) => {
    setGomb(el.gomb);
    setGombP(el.gombP);
    setRudak(el.rudak);
    setTerhek(el.terhek);
    setMk(el.M);
  };
  const setRud = (i, mezo, v) => setRudak(rudak.map((r, j) => (j === i ? { ...r, [mezo]: v } : r)));
  const setTeher = (i, mezo, v) => setTerhek(terhek.map((t, j) => (j === i ? { ...t, [mezo]: v } : t)));
  const kell = gomb ? 3 : 6;
  const nyomatekok = Math.hypot(...Mk) > 1e-9 ? [Mk] : [];
  const er = tamasztorudak({ rudak, gombcsuklo: gomb ? gombP : null, terhek, nyomatekok });
  const nevek = er.ismeretlenek;
  const sorTex = (sor) => {
    const tagok = sor.egyutthatok.map((c, j) => (Math.abs(c) < 1e-9 ? null : `${c < 0 ? "-" : "+"} ${f4(Math.abs(c))}\\,${nevek[j]}`)).filter(Boolean);
    return `${sor.cimke} ${f4(sor.teher)} ${tagok.join(" ")} = 0`;
  };
  const pontO = er.pontO;

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
      <div className="grid gap-5 p-4 lg:grid-cols-[1fr_1.15fr] [&>*]:min-w-0 sm:p-5">
        <div className="text-[13px] text-petrol-800">
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-[13px]">
              <input type="checkbox" checked={gomb} onChange={(e) => setGomb(e.target.checked)} className="accent-[color:var(--color-naracs-500)]" />
              gömbcsukló is van (A)
            </label>
            {gomb && (
              <span className="flex items-center gap-2">
                <span className="text-[12px] text-petrol-500">A (x; y; z) =</span>
                <Vektor ertek={gombP} onChange={setGombP} />
              </span>
            )}
          </div>
          <Fej>Támasztórudak — a test pontja → a rögzített vég [m] ({rudak.length} db, {kell} kell)</Fej>
          <div className="space-y-1.5">
            {rudak.map((r, i) => (
              <div key={i} className="flex flex-wrap items-center gap-2">
                <span className="w-8 text-[12px] font-semibold text-petrol-600">S{i + 1}</span>
                <Vektor ertek={r.pont} onChange={(v) => setRud(i, "pont", v)} />
                <span className="text-petrol-400">→</span>
                <Vektor ertek={r.masik} onChange={(v) => setRud(i, "masik", v)} />
                <button type="button" onClick={() => setRudak(rudak.filter((_, j) => j !== i))} className="rounded-md px-1.5 text-[12px] text-rose-600 hover:bg-rose-50" aria-label="rúd törlése">
                  ✕
                </button>
              </div>
            ))}
            {rudak.length < 6 && (
              <button type="button" onClick={() => setRudak([...rudak, { pont: [0, 0, 0], masik: [0, -1, 0] }])} className="rounded-lg bg-white px-2.5 py-1 text-[12px] font-medium text-petrol-600 ring-1 ring-petrol-200 hover:bg-petrol-50">
                + rúd
              </button>
            )}
          </div>
          <Fej>Terhek — támadáspont [m] és erő (Fx; Fy; Fz) [kN]</Fej>
          <div className="space-y-1.5">
            {terhek.map((t, i) => (
              <div key={i} className="flex flex-wrap items-center gap-2">
                <span className="w-8 text-[12px] font-semibold text-petrol-600">F{i + 1}</span>
                <Vektor ertek={t.pont} onChange={(v) => setTeher(i, "pont", v)} />
                <span className="text-petrol-400">·</span>
                <Vektor ertek={t.F} onChange={(v) => setTeher(i, "F", v)} lepes={1} />
                <button type="button" onClick={() => setTerhek(terhek.filter((_, j) => j !== i))} className="rounded-md px-1.5 text-[12px] text-rose-600 hover:bg-rose-50" aria-label="teher törlése">
                  ✕
                </button>
              </div>
            ))}
            <button type="button" onClick={() => setTerhek([...terhek, { pont: [0, 0, 0], F: [0, -10, 0] }])} className="rounded-lg bg-white px-2.5 py-1 text-[12px] font-medium text-petrol-600 ring-1 ring-petrol-200 hover:bg-petrol-50">
              + teher
            </button>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[12px] font-semibold text-petrol-600">M (Mx; My; Mz) [kNm]</span>
              <Vektor ertek={Mk} onChange={setMk} lepes={1} />
            </div>
          </div>
        </div>

        <div className="szamok space-y-1 text-[12.5px] text-petrol-800">
          <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">Levezetés — a hat egyensúlyi egyenlet</p>
          <p className="text-[13px] text-petrol-600">
            Ismeretlenek: <M>{nevek.join(",\\ ")}</M> — a rúderők húzóerőként a test pontjából a rögzített vég felé (<M>{"\\underline e_i"}</M>), a csukló reakciói a tengelyek irányában. A nyomatéki egyenleteket a{" "}
            <M>{`(${f4(pontO[0])};\\ ${f4(pontO[1])};\\ ${f4(pontO[2])})`}</M> pontra írjuk{gomb ? " (a gömbcsuklóra: így a három csuklóreakció kiesik belőlük)" : ""}.
          </p>
          {rudak.map((r, i) => (
            <MB key={i}>{`\\underline e_{${i + 1}} = ${vekK(er.e[i])}`}</MB>
          ))}
          <MB>{`(\\underline F_i, ${nevek.map((n) => `\\underline{${n.replace(/_.*/, "")}}_{${n.replace(/^[^_]*_?/, "")}}`).join(", ")}) \\ekv \\underline O`}</MB>
          {er.sorok.map((sor, i) => (
            <MB key={i}>{sorTex(sor)}</MB>
          ))}
          {er.ok ? (
            <>
              <p className="text-[13px] text-petrol-600">Megoldás (Gauss-elimináció részleges pivotálással; kézzel: keresd az egyismeretlenes egyenleteket — a nyomatékiakban itt csak a rúderők szerepelnek):</p>
              <MB>{er.x.map((v, j) => `${nevek[j]} = ${f4(v)}`).join(",\\quad ") + "\\ \\text{kN}"}</MB>
              <p className="text-[13px] text-petrol-600">
                Rudak: {er.S.map((s, i) => `S${i + 1} ${Math.abs(s) < 1e-6 ? "= 0 (erőtlen)" : s < 0 ? "nyomott" : "húzott"}`).join(", ")}.
              </p>
              <p className="text-[13px] text-petrol-600">Ellenőrzés: minden erő visszahelyettesítve az origóra írt hat egyenletbe:</p>
              <MB>{`\\sum\\underline F_i = ${vekK(er.ellenorzes.F)},\\qquad \\sum\\underline M_{iO} = ${vekK(er.ellenorzes.M)}\\ ${er.ellenorzes.rendben ? "\\checkmark" : "\\text{?!}"}`}</MB>
            </>
          ) : (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-[13px] text-rose-700">{er.hiba}</p>
          )}
        </div>
      </div>
    </div>
  );
}
