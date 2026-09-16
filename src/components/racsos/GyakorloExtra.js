"use client";

import GyakorloDoboz from "@/components/GyakorloDoboz";
import { M, MB } from "@/components/ui/Keplet";
import { sz, szK } from "@/lib/szamok";
import { racsosMegold, sablon, atmetszes, atvagottRudak, rudTex } from "@/lib/racsos";
import RacsosRajz from "./RacsosRajz";

/* ============================================================
   Közös segédek a 7. modul gyakorló generátoraihoz
   ============================================================ */

export const egesz = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
export const valaszt = (t) => t[Math.floor(Math.random() * t.length)];
export const fel = (min, max) => egesz(Math.round(min * 2), Math.round(max * 2)) / 2;

/** Rajz a feladathoz: a tartó a terhekkel, méretekkel, csomópont-sorszámokkal. */
export function FeladatRajz({ modell, kiemelt = [], magassag = 300, cimke, extra }) {
  return (
    <div className="racs-vilagos overflow-hidden rounded-xl border border-[color:var(--keret)] p-2">
      <RacsosRajz modell={modell} szinez={false} meretek kiemeltRudak={kiemelt} magassag={magassag} className="abra mx-auto h-auto w-full max-w-xl" cimke={cimke} atmenet={false} extra={extra} />
    </div>
  );
}

/** Egy rúd „jellege” szöveggel. */
export const jelleg = (S) => (Math.abs(S) < 1e-6 ? "vakrúd" : S > 0 ? "húzott" : "nyomott");

/** Véletlen függőleges csomóponti terhek a felső (vagy alsó) övön. */
export function veletlenTerhek(m, db, opciok = {}) {
  const jeloltek = (opciok.ov === "also" ? m.also : m.felso).filter((id) => !m.tamaszok.some((t) => t.csomopont === id));
  const hasznalt = new Set();
  const terhek = [];
  for (let i = 0; i < db; i++) {
    const szabad = jeloltek.filter((id) => !hasznalt.has(id));
    if (!szabad.length) break;
    const cs = valaszt(szabad);
    hasznalt.add(cs);
    const F = egesz(4, 20);
    const szog = opciok.ferde && Math.random() < 0.5 ? valaszt([-60, -120, -45, -135]) : -90;
    terhek.push({ csomopont: cs, Fx: Math.abs(Math.cos((szog * Math.PI) / 180)) < 1e-9 ? 0 : F * Math.cos((szog * Math.PI) / 180), Fy: F * Math.sin((szog * Math.PI) / 180), F, szog });
  }
  // a terhek sorszáma a csomópontok sorrendjében (így egyezik a megoldó F_1, F_2 jelölésével)
  terhek.sort((p, q) => m.csomopontok.findIndex((c) => c.id === p.csomopont) - m.csomopontok.findIndex((c) => c.id === q.csomopont));
  terhek.forEach((t, i) => {
    t.cimke = `F${terhek.length > 1 ? "₁₂₃"[i] : ""} = ${t.F} kN${t.szog !== -90 ? ` (${Math.abs(t.szog) <= 90 ? Math.abs(t.szog) : 180 - Math.abs(t.szog)}°)` : ""}`;
  });
  return terhek;
}

export const terhekSzoveg = (terhek) =>
  terhek.map((t, i) => (
    <span key={i}>
      {i > 0 ? ", " : ""}
      <M>{`F${terhek.length > 1 ? `_${i + 1}` : ""} = ${t.F}\\ \\text{kN}`}</M> a(z) {t.csomopont}. csomóponton{t.szog !== -90 ? ` (a vízszintessel ${Math.abs(t.szog) <= 90 ? Math.abs(t.szog) : 180 - Math.abs(t.szog)}°-ot bezárva, ${t.Fx > 0 ? "jobbra" : "balra"}-lefelé)` : " függőlegesen lefelé"}
    </span>
  ));

export function ReakcioLevezetes({ e }) {
  return (
    <div className="space-y-0.5">
      {e.reakcioLepesek.map((l, i) => (
        <MB key={i}>{l.tex}</MB>
      ))}
    </div>
  );
}

/* ============================================================
   7. Vizsga-típus: trapéz tartó, ferde felső öv, hármas átmetszés
   ============================================================ */

function trapezFeladat() {
  for (let proba = 0; proba < 60; proba++) {
    const n = valaszt([3, 4]);
    const a = valaszt([3, 4, 5]);
    const h0 = valaszt([3, 4, 5]);
    const h1 = h0 + valaszt([2, 3, 4]);
    const m = sablon("trapez", { n, a, h0, h1, racs: valaszt(["Z", "N"]) });
    m.terhek = veletlenTerhek(m, 1);
    const e = racsosMegold(m);
    if (!e.ok) continue;
    const i = egesz(1, n - 2);
    const rudak = atvagottRudak(e, { x: (i + 0.5) * a, y: -1 }, { x: (i + 0.5) * a, y: h1 + 1 });
    if (rudak.length !== 3) continue;
    const at = atmetszes(m, rudak, "bal", { eredmeny: e });
    if (!at.ok || !at.megoldhato) continue;
    const t = m.terhek[0];
    return {
      szoveg: (
        <p>
          Rácsos tartó <M>{`${n}`}</M> darab <M>{`${a}\\ \\text{m}`}</M> széles mezővel; az alsó öv vízszintes (bal végén csukló, jobb végén görgő), a felső öv egyenes, bal végén <M>{`${h0}`}</M> m, jobb végén{" "}
          <M>{`${h1}`}</M> m magasan. Teher: {terhekSzoveg([t])}. Határozd meg az ábrán kiemelt átmetszés rúdjaiban ({rudak.map((id) => `S${id}`).join(", ")}) működő erőket (húzott = pozitív)!
        </p>
      ),
      abra: <FeladatRajz modell={m} kiemelt={rudak} magassag={320} />,
      sugo: (
        <p>
          A bal oldali részre csak a reakció hat. Minden rúdhoz a másik kettő metszéspontja a főpont — a ferde öv és a vízszintes öv metszéspontja a tartón <em>kívül</em> van, de nyomatéki egyenletet oda is lehet írni. A
          ferde rúderőt bontsd komponensekre, és mindkettő karját vedd figyelembe: <M>{"M = x\\,S_y - y\\,S_x"}</M>.
        </p>
      ),
      oszlopok: 3,
      mezok: rudak.map((id) => ({ id, cimke: `S${id}`, egyseg: "kN", helyes: e.rudErok[id], tizedes: 2 })),
      megoldas: (
        <>
          <p>
            <strong>Reakciók</strong> az egész szerkezetből:
          </p>
          <ReakcioLevezetes e={e} />
          <p className="mt-2">
            <strong>A bal rész</strong> ({at.resz.join(", ")}) egyensúlya; az átvágott rudak ereje húzottnak felvéve:
          </p>
          <MB>{`(\\underline{A}, ${rudak.map((id) => `\\underline{${rudTex(id)}}`).join(", ")}) \\ekv \\underline{O}`}</MB>
          {at.egyenletek.map((q, j) => (
            <div key={j}>
              {q.fopont && (
                <p className="text-[12.5px] text-violet-700">
                  főpont {q.fopont.nev.replace(/[{}]/g, "").replace("P_", "P")}
                  {q.fopont.csomopont ? "" : ` = (${sz(q.fopont.x, 2)}; ${sz(q.fopont.y, 2)}) m — a két öv egyenesének metszéspontja`}:
                </p>
              )}
              {q.parhuzamosak && <p className="text-[12.5px] text-violet-700">a másik két rúd párhuzamos → a rájuk merőleges vetületi egyenlet:</p>}
              <MB>{q.tex}</MB>
            </div>
          ))}
          {at.ellenorzes && <MB>{`\\text{ellenőrzés: }${at.ellenorzes.tex}`}</MB>}
          <p className="mt-2 text-[13px] text-petrol-600">{rudak.map((id) => `S${id}: ${jelleg(e.rudErok[id])}`).join("; ")}.</p>
        </>
      ),
    };
  }
  return trapezFeladat();
}

/* ============================================================
   8. Rúdján terhelt rácsos tartó: helyettesítő csomóponti terhek, N és M_max a rúdban
   ============================================================ */

function rudjanTerheltFeladat() {
  const n = valaszt([3, 4]);
  const a = valaszt([1.5, 2, 2.5]);
  const h = valaszt([1.5, 2, 3]);
  const m = sablon("warren", { n, a, h });
  const P = egesz(6, 20);
  const i = egesz(0, n - 1); // alsó övrúd: also[i]–also[i+1]
  const ell = 2 * a;
  const c1 = valaszt([0.25, 0.5, 0.5, 0.75]) * ell; // a tehertől a bal végig
  const c2 = ell - c1;
  const bal = m.also[i];
  const jobb = m.also[i + 1];
  const Pb = (P * c2) / ell;
  const Pj = (P * c1) / ell;
  m.terhek = [
    { csomopont: bal, Fx: 0, Fy: -Pb, cimke: `${sz(Pb, 1)} kN` },
    { csomopont: jobb, Fx: 0, Fy: -Pj, cimke: `${sz(Pj, 1)} kN` },
  ];
  const e = racsosMegold(m);
  const rudId = `${bal},${jobb}`;
  const N = e.rudErok[rudId];
  const Mmax = (P * c1 * c2) / ell;
  const rajzModell = { ...m, terhek: [] };
  const xP = m.csomopontok.find((c) => c.id === bal).x + c1;
  const rajzExtra = (kx, ky) => (
    <g>
      <line x1={kx(xP)} y1={ky(0) - 56} x2={kx(xP)} y2={ky(0) - 4} stroke="var(--color-jel-ero)" strokeWidth="3" strokeLinecap="round" markerEnd="url(#th-teher)" />
      <text x={kx(xP) + 7} y={ky(0) - 60} fontSize="12.5" fontWeight="650" style={{ fill: "var(--color-jel-ero)", paintOrder: "stroke", stroke: "white", strokeWidth: 3.5 }}>
        {`P = ${P} kN`}
      </text>
    </g>
  );
  return {
    szoveg: (
      <p>
        Warren-tartó (<M>{`${n}`}</M> háromszögpár, <M>{`a = ${szK(a, 1)}\\ \\text{m}`}</M>, <M>{`h = ${szK(h, 1)}\\ \\text{m}`}</M>; bal végén csukló, jobb végén görgő). A(z) <M>{`${bal}\\text{-}${jobb}`}</M> alsó övrúdon,
        a(z) {bal}. csomóponttól <M>{`c = ${szK(c1, 2)}\\ \\text{m}`}</M>-re <M>{`P = ${P}\\ \\text{kN}`}</M> függőleges erő hat (a rúd hossza <M>{`\\ell = ${szK(ell, 1)}`}</M> m). Add meg a helyettesítő csomóponti terheket, a rúd
        rúderejét (húzott +) és a benne ébredő legnagyobb hajlítónyomatékot!
      </p>
    ),
    abra: (
      <FeladatRajz modell={rajzModell} kiemelt={[rudId]} cimke={`P = ${P} kN A KIEMELT RÚDON, c = ${sz(c1, 2)} m A(Z) ${bal}. CSOMÓPONTTÓL`} extra={rajzExtra} />
    ),
    sugo: (
      <p>
        A terhelt rudat elkülönítve kéttámaszú tartóként a végein <M>{"P\\,c_2/\\ell"}</M> és <M>{"P\\,c_1/\\ell"}</M> merőleges rúdvégi erő ébred (nyomatéki egyenlet a másik végpontra); ezek ellentettjei a csomóponti terhek. A
        rúderőt ezután a szokásos módon számoljuk; a rúdban emellett <M>{"M_{\\max} = P\\,c_1 c_2/\\ell"}</M> hajlítás is működik.
      </p>
    ),
    oszlopok: 4,
    mezok: [
      { id: "pb", cimke: `teher a(z) ${bal}. csomóponton`, egyseg: "kN", helyes: Pb, tizedes: 2 },
      { id: "pj", cimke: `teher a(z) ${jobb}. csomóponton`, egyseg: "kN", helyes: Pj, tizedes: 2 },
      { id: "n", cimke: `S${rudId} (húzott +)`, egyseg: "kN", helyes: N, tizedes: 2 },
      { id: "m", cimke: "M_max a rúdban", egyseg: "kNm", helyes: Mmax, tizedes: 2 },
    ],
    megoldas: (
      <>
        <p>
          <strong>A terhelt rúd elkülönítése</strong>: a <M>{`${jobb}`}</M>. végpontra írt nyomatéki egyenletből a(z) {bal}. végen, a(z) {bal}. végpontra írtból a(z) {jobb}. végen ébredő merőleges erő:
        </p>
        <MB>{`\\Mp{${jobb}} ${szK(c2, 2)}\\cdot ${P} - ${szK(ell, 1)}\\,S^m_{${bal}} = 0 \\Rightarrow S^m_{${bal}} = ${szK(Pb, 2)};\\qquad \\Mp{${bal}} -${szK(c1, 2)}\\cdot ${P} + ${szK(ell, 1)}\\,S^m_{${jobb}} = 0 \\Rightarrow S^m_{${jobb}} = ${szK(Pj, 2)}\\ \\text{kN}`}</MB>
        <p>
          A rúdirányú vetület nulla (<M>{"F^S = 0"}</M>), ezért a rúderő a két végen azonos. A rúdvégi erők ellentettjei csomóponti terhek: <M>{`${szK(Pb, 2)}`}</M> kN a(z) {bal}., <M>{`${szK(Pj, 2)}`}</M> kN a(z) {jobb}. csomóponton, lefelé.
        </p>
        <p className="mt-2">
          <strong>Reakciók</strong>:
        </p>
        <ReakcioLevezetes e={e} />
        <p className="mt-2">
          <strong>Csomóponti módszer</strong> a(z) {rudId} rúdig:
        </p>
        {e.csomopontiSorrend
          .slice(0, e.csomopontiSorrend.findIndex((l) => rudId in l.eredmenyek) + 1)
          .map((l, j) => (
            <div key={j}>
              <p className="text-[12.5px] text-petrol-500">{l.csomopont}. csomópont:</p>
              {l.egyenletek.map((q, k) => (
                <MB key={k}>{q.tex}</MB>
              ))}
            </div>
          ))}
        <p className="mt-2">
          A rúdban a rúderőn kívül hajlítás is ébred: <M>{`M_{\\max} = \\frac{P\\,c_1 c_2}{\\ell} = \\frac{${P}\\cdot ${szK(c1, 2)}\\cdot ${szK(c2, 2)}}{${szK(ell, 1)}} = ${szK(Mmax, 2)}\\ \\text{kNm}`}</M> a teher alatt (alul húzott), és{" "}
          <M>{`V = \\pm${szK(Math.max(Pb, Pj), 2)}`}</M> kN nyíróerő. Ezt a 9. modul tárgyalja.
        </p>
      </>
    ),
  };
}

/* ============================================================
   9. Statikai határozottság: r, k, c
   ============================================================ */

function hatarozottsagFeladat() {
  const tip = valaszt(["parhuzamos", "warren", "k", "haromszog"]);
  const n = tip === "k" ? valaszt([3, 4]) : valaszt([3, 4, 5, 6]);
  const m = sablon(tip, { n, a: 2, h: tip === "k" ? 1 : 1.5, racs: valaszt(["V", "N", "Z"]) });
  const modosit = valaszt(["semmi", "semmi", "plusz", "minusz", "tamasz", "x"]);
  let magyarazat = "";
  if (modosit === "plusz") {
    // egy plusz rácsrúd egy mezőbe (X-rácsozás egy mezőben)
    const i = egesz(0, n - 1);
    const p = m.felso[i];
    const q = m.also[i + 1];
    const p2 = m.also[i];
    const q2 = m.felso[i + 1];
    const van = (x, y) => m.rudak.some((r) => (r.a === x && r.b === y) || (r.a === y && r.b === x));
    if (!van(p, q)) m.rudak.push({ id: `${p},${q}`, a: p, b: q });
    else if (!van(p2, q2)) m.rudak.push({ id: `${p2},${q2}`, a: p2, b: q2 });
    magyarazat = "Egy mezőbe egy második átlós rúd került (X-rácsozás): eggyel több az ismeretlen, mint az egyenlet.";
  } else if (modosit === "minusz") {
    // egy rácsrúd elhagyása
    const ferde = m.rudak.filter((r) => {
      const a = m.csomopontok.find((c) => c.id === r.a);
      const b = m.csomopontok.find((c) => c.id === r.b);
      return Math.abs(a.x - b.x) > 1e-9 && Math.abs(a.y - b.y) > 1e-9;
    });
    const el = valaszt(ferde);
    m.rudak = m.rudak.filter((r) => r !== el);
    magyarazat = `A(z) ${el.id} rácsrúd hiányzik: egy mező négyszög maradt, amely csuklós sarkaival elmozdulhat — mechanizmus.`;
  } else if (modosit === "tamasz") {
    // a görgő helyett csukló
    m.tamaszok = m.tamaszok.map((t) => ({ ...t, tipus: "csuklo" }));
    magyarazat = "Mindkét támasz csukló: a külső kényszerek fokszáma 4, eggyel több a kelleténél — külsőleg határozatlan.";
  } else if (modosit === "x") {
    // egy plusz görgő az alsó öv egy belső csomópontján
    const cs = valaszt(m.also.slice(1, -1));
    m.tamaszok.push({ csomopont: cs, tipus: "gorgo", szog: 90 });
    magyarazat = `Egy harmadik támasz (görgő a(z) ${cs}. csomóponton): külsőleg egyszeresen határozatlan.`;
  }
  const e = racsosMegold(m);
  const { r, k, c } = e.hatarozottsag;
  const kul = 2 * c - r - k;
  const tipusKod = kul === 0 ? (e.ok ? 1 : 3) : kul < 0 ? 2 : 3;
  const tipusNev = tipusKod === 1 ? "statikailag határozott" : tipusKod === 2 ? "statikailag határozatlan" : "labilis (mechanizmus)";
  return {
    szoveg: (
      <p>
        Az ábrán látható rácsos tartóra írd fel a rudak számát (<M>{"r"}</M>), a külső kényszerek fokszámának összegét (<M>{"k"}</M>) és a csomópontok számát (<M>{"c"}</M>)! Számítsd ki a <M>{"2c - (r + k)"}</M> különbséget, és
        döntsd el, milyen a szerkezet: <strong>1</strong> = statikailag határozott, <strong>2</strong> = határozatlan, <strong>3</strong> = labilis (mechanizmus).
      </p>
    ),
    abra: <FeladatRajz modell={{ ...m, terhek: [] }} magassag={280} />,
    sugo: (
      <p>
        Minden csomópontra két egyensúlyi egyenlet írható (<M>{"e = 2c"}</M>), az ismeretlenek a rúderők és a reakciók (<M>{"i = r + k"}</M>). Csukló: 2, görgő: 1. Ha <M>{"r + k > 2c"}</M>: határozatlan (pl. X-rácsozás); ha{" "}
        <M>{"r + k < 2c"}</M>: labilis; egyenlőségnél határozott — feltéve, hogy a rudak elrendezése merev (nem degenerált).
      </p>
    ),
    oszlopok: 4,
    mezok: [
      { id: "r", cimke: "r (rudak)", egyseg: "", helyes: r, tizedes: 0 },
      { id: "k", cimke: "k (kényszerfokszám)", egyseg: "", helyes: k, tizedes: 0 },
      { id: "c", cimke: "c (csomópontok)", egyseg: "", helyes: c, tizedes: 0 },
      { id: "t", cimke: "2c − (r+k) → típus (1/2/3)", egyseg: "", helyes: tipusKod, tizedes: 0, tures: 0.1 },
    ],
    megoldas: (
      <>
        <MB>{`r = ${r},\\quad k = ${m.tamaszok.map((t) => (t.tipus === "csuklo" ? "2" : "1")).join(" + ")} = ${k},\\quad c = ${c},\\qquad 2c - (r + k) = ${2 * c} - ${r + k} = ${kul}`}</MB>
        <p>
          A szerkezet <strong>{tipusNev}</strong>. {magyarazat || "A rudak száma pontosan annyi, amennyi a csomópontok merev összekapcsolásához kell: háromszögekből építkezik, és egy csukló + egy görgő tartja."}
          {kul === 0 && !e.ok ? " Bár a számlálás egyenlőséget ad, az elrendezés degenerált (az egyenletrendszer szinguláris)." : ""}
        </p>
      </>
    ),
  };
}

/* ---------- export ---------- */

export const EXTRA_GENERATOROK = [
  { cim: "Vizsga-típus: ferde felső öv, hármas átmetszés", fn: trapezFeladat },
  { cim: "Rúdján terhelt rácsos tartó — helyettesítés, N és M_max", fn: rudjanTerheltFeladat },
  { cim: "Statikai határozottság: r, k, c", fn: hatarozottsagFeladat },
];

export default function GyakorloExtra() {
  return (
    <>
      <GyakorloDoboz cim="Vizsga-típus: ferde felső öv, hármas átmetszés" leiras="A vizsgaminta 3. feladata véletlen számokkal: a főpont a tartón kívül is lehet." generator={trapezFeladat} oszlopok={3} />
      <GyakorloDoboz cim="Rúdján terhelt rácsos tartó" leiras="A tankönyv 6.5. fejezete: a terhelt rúd elkülönítése, helyettesítő csomóponti terhek, aztán a szokásos rúderő — plusz a hajlítás a rúdban." generator={rudjanTerheltFeladat} oszlopok={4} />
      <GyakorloDoboz cim="Statikai határozottság: r, k, c" leiras="Számláld meg a rudakat, a kényszerek fokszámát és a csomópontokat; néha egy rúd hiányzik vagy fölös." generator={hatarozottsagFeladat} oszlopok={4} />
    </>
  );
}
