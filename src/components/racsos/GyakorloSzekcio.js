"use client";

import GyakorloDoboz from "@/components/GyakorloDoboz";
import GyakorloExtra, { FeladatRajz, ReakcioLevezetes, egesz, valaszt, veletlenTerhek, terhekSzoveg, jelleg } from "./GyakorloExtra";
import { M, MB } from "@/components/ui/Keplet";
import { sz, szK } from "@/lib/szamok";
import { racsosMegold, sablon, atmetszes, atvagottRudak, keresAtmetszes, rudTex } from "@/lib/racsos";

/* ============================================================
   Segéd: véletlen párhuzamos övű / Warren tartó terhekkel, megoldva
   ============================================================ */

function veletlenTarto(opciok = {}) {
  for (let proba = 0; proba < 60; proba++) {
    const tip = opciok.tipus ?? valaszt(["parhuzamos", "parhuzamos", "warren"]);
    const n = opciok.n ?? (tip === "warren" ? valaszt([3, 4]) : valaszt([3, 4, 5]));
    const a = opciok.a ?? valaszt([1.5, 2, 2, 3]);
    const h = opciok.h ?? valaszt([1.5, 2, 2, 2.5]);
    const racs = opciok.racs ?? valaszt(["V", "N", "Z"]);
    const m = sablon(tip, { n, a, h, racs });
    m.terhek = veletlenTerhek(m, opciok.db ?? valaszt([1, 2]), { ferde: opciok.ferde, ov: opciok.ov });
    const e = racsosMegold(m);
    if (!e.ok || e.hianyzo.length) continue;
    return { m, e, tip, n, a, h, racs };
  }
  return null;
}

const tipusNev = (tip, racs) => (tip === "warren" ? "Warren-tartó (háromszögrácsozás)" : `párhuzamos övű tartó (${racs === "N" ? "Pratt-, N-" : racs === "Z" ? "Z-" : "V-"}rácsozás)`);

function Geometria({ tip, n, a, h }) {
  return (
    <>
      <M>{`${n}`}</M> mező, mezőszélesség <M>{`a = ${szK(a, 1)}\\ \\text{m}`}</M>, magasság <M>{`h = ${szK(h, 1)}\\ \\text{m}`}</M>
      {tip === "warren" ? <> (a felső csomópontok a mezők felezőpontja fölött)</> : null}; a bal alsó csomópont csukló (<M>{"A"}</M>), a jobb alsó görgő (<M>{"B"}</M>)
    </>
  );
}

/* ============================================================
   1. Csomóponti módszer — az első két csomópont
   ============================================================ */

function csomopontiFeladat() {
  const v = veletlenTarto({ db: valaszt([1, 2]) });
  if (!v) return csomopontiFeladat();
  const { m, e, tip, n, a, h, racs } = v;
  const lepesek = e.csomopontiSorrend.slice(0, 2);
  const kerdezett = lepesek.flatMap((l) => l.ismeretlenek).slice(0, 4);
  return {
    szoveg: (
      <p>
        {tipusNev(tip, racs).charAt(0).toUpperCase() + tipusNev(tip, racs).slice(1)}: <Geometria tip={tip} n={n} a={a} h={h} />. Terhek: {terhekSzoveg(m.terhek)}. Számítsd ki a reakciókat, majd a csomóponti módszerrel
        az első két megoldható csomópont rúderőit: {kerdezett.map((id) => `S${id}`).join(", ")} (húzott = pozitív)!
      </p>
    ),
    abra: <FeladatRajz modell={m} kiemelt={kerdezett} />,
    sugo: (
      <p>
        Indulj a támasz melletti csomópontból (legfeljebb két ismeretlen rúd). Az első egyenletet a másik ismeretlen rúdra merőlegesen vetítve írd (vízszintes rúd mellett ez a függőleges vetület), a másodikba az imént
        kiszámolt rúderő vetületét is írd be. A rúderő mindig a csomópontból a rúd másik vége felé „húz”.
      </p>
    ),
    oszlopok: kerdezett.length,
    mezok: kerdezett.map((id) => ({ id, cimke: `S${id}`, egyseg: "kN", helyes: e.rudErok[id], tizedes: 2 })),
    megoldas: (
      <>
        <p>
          <strong>Reakciók</strong> (a rácsozat egyetlen merev test):
        </p>
        <ReakcioLevezetes e={e} />
        {lepesek.map((l, i) => (
          <div key={i} className="mt-2">
            <p>
              <strong>{l.csomopont}. csomópont</strong> — ismeretlen: {l.ismeretlenek.map((id) => `S${id}`).join(", ")}
              {l.mod === "harom" ? " (három ismeretlenből kettő egy egyenesbe esik: a rájuk merőleges vetület)" : ""}:
            </p>
            {l.egyenletek.map((q, j) => (
              <MB key={j}>{q.tex}</MB>
            ))}
          </div>
        ))}
        <p className="mt-2 text-[13px] text-petrol-600">{kerdezett.map((id) => `S${id}: ${jelleg(e.rudErok[id])}`).join("; ")}.</p>
      </>
    ),
  };
}

/* ============================================================
   2. Hármas átmetszés egy mezőn át
   ============================================================ */

function atmetszesFeladat() {
  for (let proba = 0; proba < 60; proba++) {
    const v = veletlenTarto({ tipus: "parhuzamos", n: valaszt([4, 5, 6]), db: valaszt([1, 2, 2]) });
    if (!v) continue;
    const { m, e, n, a, h, racs } = v;
    const i = egesz(1, n - 2);
    const rudak = atvagottRudak(e, { x: (i + 0.5) * a, y: -1 }, { x: (i + 0.5) * a, y: h + 1 });
    if (rudak.length !== 3) continue;
    const oldal = valaszt(["bal", "jobb"]);
    const at = atmetszes(m, rudak, oldal, { eredmeny: e });
    if (!at.ok || !at.megoldhato) continue;
    return {
      szoveg: (
        <p>
          Párhuzamos övű tartó ({racs}-rácsozás): <Geometria tip="parhuzamos" n={n} a={a} h={h} />. Terhek: {terhekSzoveg(m.terhek)}. Hármas átmetszéssel számítsd ki a(z) {i + 1}. mező három rúdjának erejét ({rudak.map((id) => `S${id}`).join(", ")}; húzott = pozitív)!
        </p>
      ),
      abra: <FeladatRajz modell={m} kiemelt={rudak} />,
      sugo: (
        <p>
          Vágd át a három kiemelt rudat, és nézd azt a részt, amelyikre kevesebb külső erő hat. Az övrudakhoz a nyomatéki egyenletet a szemközti öv csomópontjára (a rácsrúd és a másik öv metszéspontjára) írd; a
          rácsrúdhoz a párhuzamos övek miatt a függőleges vetületi egyenlet marad.
        </p>
      ),
      oszlopok: 3,
      mezok: rudak.map((id) => ({ id, cimke: `S${id}`, egyseg: "kN", helyes: e.rudErok[id], tizedes: 2 })),
      megoldas: (
        <>
          <p>
            <strong>Reakciók</strong>:
          </p>
          <ReakcioLevezetes e={e} />
          <p className="mt-2">
            <strong>A {oldal} oldali rész</strong> ({at.resz.join(", ")}) egyensúlya; külső erők rajta: {at.kulsoErok.map((f) => f.nev.replace(/[_{}]/g, "") + (f.teher ? ` (${f.csomopont}. cs.)` : "")).join(", ")}; az átvágott rudak ereje húzottnak felvéve:
          </p>
          <MB>{`(${at.kulsoErok.map((f) => `\\underline{${f.nev}}`).join(", ")}, ${rudak.map((id) => `\\underline{${rudTex(id)}}`).join(", ")}) \\ekv \\underline{O}`}</MB>
          {at.egyenletek.map((q, j) => (
            <div key={j}>
              {q.fopont && <p className="text-[12.5px] text-violet-700">főpont: {q.fopont.nev.replace(/[{}]/g, "")} — a másik két rúd hatásvonala átmegy rajta:</p>}
              {q.parhuzamosak && <p className="text-[12.5px] text-violet-700">a két öv párhuzamos → függőleges vetületi egyenlet:</p>}
              <MB>{q.tex}</MB>
            </div>
          ))}
          {at.ellenorzes && <MB>{`\\text{ellenőrzés: }${at.ellenorzes.tex}`}</MB>}
          <p className="mt-2 text-[13px] text-petrol-600">{rudak.map((id) => `S${id}: ${jelleg(e.rudErok[id])}`).join("; ")}. A felső öv jellemzően nyomott, az alsó húzott — mint a nyomatéki ábra.</p>
        </>
      ),
    };
  }
  return atmetszesFeladat();
}

/* ============================================================
   3. Hány vakrúd?
   ============================================================ */

function vakrudFeladat() {
  for (let proba = 0; proba < 80; proba++) {
    const v = veletlenTarto({ tipus: valaszt(["parhuzamos", "parhuzamos", "warren", "k", "haromszog"]), n: valaszt([3, 4, 5]), h: valaszt([1, 1.5, 2]), db: 1 });
    if (!v) continue;
    const { m, e, tip, n, a, h, racs } = v;
    const vak = e.rudTabla.filter((r) => Math.abs(r.S) < 1e-9).map((r) => r.id);
    if (vak.length === 0 || vak.length > 6) continue;
    const kerdezett = valaszt(e.rudTabla.map((r) => r.id));
    return {
      szoveg: (
        <p>
          {tip === "k" ? "K-rácsozású tartó" : tip === "haromszog" ? "Nyeregtető alakú rácsos tartó" : tipusNev(tip, racs).charAt(0).toUpperCase() + tipusNev(tip, racs).slice(1)}, <M>{`${n}`}</M> mező, <M>{`a = ${szK(a, 1)}`}</M> m,{" "}
          <M>{`h = ${szK(h, 1)}`}</M> m; bal alsó csomópont csukló, jobb alsó görgő. Teher: {terhekSzoveg(m.terhek)}. Hány vakrúd van a tartóban ennél a tehernél? Vakrúd-e a(z) S{kerdezett} rúd (1 = igen, 0 = nem)?
        </p>
      ),
      abra: <FeladatRajz modell={m} kiemelt={[kerdezett]} magassag={280} />,
      sugo: (
        <p>
          A három alapeset: terheletlen csomópont két, nem egy egyenesbe eső rúddal (mindkettő vakrúd); terheletlen csomópont három rúddal, kettő egy egyenesben (a harmadik vakrúd); két rúd és a rúd egyenesébe eső teher vagy
          reakció (a másik vakrúd). Ha találtál egyet, nézd meg újra a szomszédos csomópontokat — a vakrudak „továbbterjednek”.
        </p>
      ),
      mezok: [
        { id: "db", cimke: "vakrudak száma", egyseg: "", helyes: vak.length, tizedes: 0, tures: 0.1 },
        { id: "v", cimke: `S${kerdezett} vakrúd? (1/0)`, egyseg: "", helyes: vak.includes(kerdezett) ? 1 : 0, tizedes: 0, tures: 0.1 },
      ],
      megoldas: (
        <>
          <p>
            <strong>Reakciók</strong>: {e.reakciok.map((r) => (r.tipus === "csuklo" ? `${r.jel} = (${sz(r.Fx, 2)}; ${sz(r.Fy, 2)})` : `${r.jel} = ${sz(r.nagysag, 2)}`)).join(", ")} kN.
          </p>
          <p className="mt-1">
            <strong>Vakrudak</strong> ({vak.length} db): {vak.map((id) => `S${id}`).join(", ")}.
          </p>
          <ul className="mt-1 list-disc space-y-0.5 pl-5 text-[13px]">
            {e.vakrudIndokok.map((x, j) => (
              <li key={j}>{x.szoveg}</li>
            ))}
            {vak.length > e.vakrudIndokok.reduce((s, x) => s + (x.rudak?.length ?? 1), 0) && <li>A többi vakrúd nem az alapesetekből, hanem a csomóponti számításból (pl. szimmetriából) adódik.</li>}
          </ul>
          <p className="mt-1">
            S{kerdezett} = {sz(e.rudErok[kerdezett], 2)} kN → {vak.includes(kerdezett) ? "vakrúd (1)" : `nem vakrúd (0), ${jelleg(e.rudErok[kerdezett])}`}.
          </p>
        </>
      ),
    };
  }
  return vakrudFeladat();
}

/* ============================================================
   4. Reakciók és egy adott rúd (ferde teher is)
   ============================================================ */

function reakcioRudFeladat() {
  for (let proba = 0; proba < 60; proba++) {
    const v = veletlenTarto({ db: 2, ferde: true });
    if (!v) continue;
    const { m, e, tip, n, a, h, racs } = v;
    if (!m.terhek.some((t) => Math.abs(t.Fx) > 1e-9)) continue;
    const jeloltek = e.rudTabla.filter((r) => Math.abs(r.S) > 0.5).map((r) => r.id);
    const rudId = valaszt(jeloltek);
    const at = keresAtmetszes(m, rudId, { eredmeny: e, maxRud: 3 });
    const A = e.reakciok.find((r) => r.tipus === "csuklo");
    const B = e.reakciok.find((r) => r.tipus === "gorgo");
    const lepesIdx = e.csomopontiSorrend.findIndex((l) => rudId in l.eredmenyek);
    return {
      szoveg: (
        <p>
          {tipusNev(tip, racs).charAt(0).toUpperCase() + tipusNev(tip, racs).slice(1)}: <Geometria tip={tip} n={n} a={a} h={h} />. Terhek: {terhekSzoveg(m.terhek)}. Számítsd ki a reakciókat (<M>{"A_x"}</M> jobbra,{" "}
          <M>{"A_y"}</M> és <M>{"B"}</M> felfelé pozitív) és a kiemelt S{rudId} rúderőt!
        </p>
      ),
      abra: <FeladatRajz modell={m} kiemelt={[rudId]} />,
      sugo: (
        <p>
          A ferde erőt bontsd komponensekre; a vízszintes komponens csak <M>{"A_x"}</M>-ben és a csuklóra írt nyomatéki egyenletben (ha nem a csukló magasságában hat) jelenik meg. A rúderőhöz keress egy átmetszést, amely
          a rudat tartalmazza — vagy menj végig a csomópontokon.
        </p>
      ),
      oszlopok: 4,
      mezok: [
        { id: "ax", cimke: "A_x", egyseg: "kN", helyes: A.Fx, tizedes: 2 },
        { id: "ay", cimke: "A_y", egyseg: "kN", helyes: A.Fy, tizedes: 2 },
        { id: "b", cimke: "B", egyseg: "kN", helyes: B.nagysag, tizedes: 2 },
        { id: "s", cimke: `S${rudId}`, egyseg: "kN", helyes: e.rudErok[rudId], tizedes: 2 },
      ],
      megoldas: (
        <>
          <p>
            <strong>Reakciók</strong> (komponensek: {m.terhek.map((t, k) => `F${k + 1}: (${sz(t.Fx, 2)}; ${sz(t.Fy, 2)})`).join(", ")} kN):
          </p>
          <ReakcioLevezetes e={e} />
          {at ? (
            <>
              <p className="mt-2">
                <strong>Átmetszés</strong> a(z) {at.rudak.map((id) => `S${id}`).join(", ")} rudakon át, a {at.oldal} oldali rész ({at.eredmeny.resz.join(", ")}) egyensúlyából:
              </p>
              {at.eredmeny.egyenletek
                .filter((q) => q.rud === rudId)
                .map((q, j) => (
                  <div key={j}>
                    {q.fopont && <p className="text-[12.5px] text-violet-700">főpont {q.fopont.nev.replace(/[{}]/g, "").replace("P_", "P")}{q.fopont.csomopont ? "" : ` = (${sz(q.fopont.x, 2)}; ${sz(q.fopont.y, 2)}) m`}:</p>}
                    <MB>{q.tex}</MB>
                  </div>
                ))}
            </>
          ) : (
            <>
              <p className="mt-2">
                <strong>Csomóponti módszer</strong> a keresett rúdig:
              </p>
              {e.csomopontiSorrend.slice(0, lepesIdx + 1).map((l, j) => (
                <div key={j}>
                  <p className="text-[12.5px] text-petrol-500">{l.csomopont}. csomópont:</p>
                  {l.egyenletek.map((q, k) => (
                    <MB key={k}>{q.tex}</MB>
                  ))}
                </div>
              ))}
            </>
          )}
          <p className="mt-2 text-[13px] text-petrol-600">
            S{rudId} = {sz(e.rudErok[rudId], 2)} kN: {jelleg(e.rudErok[rudId])}. {A.Fx < 0 ? "A_x negatív: a csukló balra tart — a ferde teher vízszintes komponensét ellensúlyozza." : A.Fx > 0 ? "A_x pozitív: jobbra mutat." : ""}
          </p>
        </>
      ),
    };
  }
  return reakcioRudFeladat();
}

/* ============================================================
   5. Húzott vagy nyomott?
   ============================================================ */

function huzottNyomottFeladat() {
  for (let proba = 0; proba < 60; proba++) {
    const v = veletlenTarto({ db: valaszt([1, 2]) });
    if (!v) continue;
    const { m, e, tip, n, a, h, racs } = v;
    const ids = e.rudTabla.map((r) => r.id);
    // három különböző rúd: egy felső öv, egy alsó öv, egy rácsrúd/oszlop
    const felso = ids.filter((id) => m.felso.includes(id.split(",")[0]) && m.felso.includes(id.split(",")[1]));
    const also = ids.filter((id) => m.also.includes(id.split(",")[0]) && m.also.includes(id.split(",")[1]));
    const racsR = ids.filter((id) => !felso.includes(id) && !also.includes(id));
    if (!felso.length || !also.length || !racsR.length) continue;
    const kerdezett = [valaszt(felso), valaszt(also), valaszt(racsR)];
    const kod = (S) => (Math.abs(S) < 1e-6 ? 0 : S > 0 ? 1 : -1);
    return {
      szoveg: (
        <p>
          {tipusNev(tip, racs).charAt(0).toUpperCase() + tipusNev(tip, racs).slice(1)}: <Geometria tip={tip} n={n} a={a} h={h} />. Terhek: {terhekSzoveg(m.terhek)}. Döntsd el <em>számolás nélkül</em> (a nyomatéki és nyíróerő-ábra
          szemléletével), hogy a kiemelt rudak húzottak, nyomottak vagy vakrudak: <strong>1</strong> = húzott, <strong>−1</strong> = nyomott, <strong>0</strong> = vakrúd.
        </p>
      ),
      abra: <FeladatRajz modell={m} kiemelt={kerdezett} />,
      sugo: (
        <p>
          Lefelé ható terhek alatt a tartó „lehajlik”: a felső öv rövidül (nyomott), az alsó nyúlik (húzott) — a nyomatéki ábra pozitív. A rácsrudak a nyíróerőt viszik: a támasz felé eső, lefelé lejtő rácsrúd… gondold
          végig a szomszédos csomópont egyensúlyát, vagy vágd át a mezőt és nézd a függőleges vetületet.
        </p>
      ),
      oszlopok: 3,
      mezok: kerdezett.map((id) => ({ id, cimke: `S${id} (1 / −1 / 0)`, egyseg: "", helyes: kod(e.rudErok[id]), tizedes: 0, tures: 0.1 })),
      megoldas: (
        <>
          <p>
            <strong>Reakciók</strong>: {e.reakciok.map((r) => (r.tipus === "csuklo" ? `${r.jel} = (${sz(r.Fx, 2)}; ${sz(r.Fy, 2)})` : `${r.jel} = ${sz(r.nagysag, 2)}`)).join(", ")} kN. A rúderők a teljes megoldásból:
          </p>
          <ul className="mt-1 list-disc space-y-0.5 pl-5 text-[13px]">
            {kerdezett.map((id) => (
              <li key={id}>
                S{id} = {sz(e.rudErok[id], 2)} kN → <strong>{jelleg(e.rudErok[id])}</strong> ({kod(e.rudErok[id])}).{" "}
                {felso.includes(id) ? "Felső övrúd: a szemközti alsó csomópontra írt nyomatéki egyenletben a terhek és a reakció nyomatéka ellen dolgozik — lefelé ható terheknél nyomott." : also.includes(id) ? "Alsó övrúd: a szemközti felső csomópontra írt nyomaték → húzott." : "Rácsrúd/oszlop: a mező függőleges vetületi egyenletéből (nyíróerő) adódik az előjele."}
              </li>
            ))}
          </ul>
        </>
      ),
    };
  }
  return huzottNyomottFeladat();
}

/* ============================================================
   6. K-rács — négyes átmetszés
   ============================================================ */

function kRacsFeladat() {
  for (let proba = 0; proba < 80; proba++) {
    const n = 4;
    const a = valaszt([2, 3]);
    const h = valaszt([1, 1.5]);
    const m = sablon("k", { n, a, h });
    m.terhek = veletlenTerhek(m, valaszt([1, 2]));
    const e = racsosMegold(m);
    if (!e.ok || e.hianyzo.length) continue;
    // a 2. mező (x = a … 2a): a bal oszlop (x = a) középső csomópontja a K szára
    const felso = `${m.felso[1]},${m.felso[2]}`;
    const also = `${m.also[1]},${m.also[2]}`;
    const kozep = m.csomopontok.find((c) => Math.abs(c.x - a) < 1e-9 && Math.abs(c.y - h) < 1e-9);
    if (!kozep) continue;
    const post1 = m.rudak.find((r) => (r.a === m.felso[1] && r.b === kozep.id) || (r.b === m.felso[1] && r.a === kozep.id))?.id;
    const post2 = m.rudak.find((r) => (r.a === m.also[1] && r.b === kozep.id) || (r.b === m.also[1] && r.a === kozep.id))?.id;
    const szar1 = m.rudak.find((r) => (r.a === kozep.id && r.b === m.felso[2]) || (r.b === kozep.id && r.a === m.felso[2]))?.id;
    const szar2 = m.rudak.find((r) => (r.a === kozep.id && r.b === m.also[2]) || (r.b === kozep.id && r.a === m.also[2]))?.id;
    if (!post1 || !post2 || !szar1 || !szar2) continue;
    const atB = atmetszes(m, [felso, also, post1, post2], "bal", { eredmeny: e });
    const atC = atmetszes(m, [felso, also, szar1, szar2], "bal", { eredmeny: e, ismert: [felso, also] });
    if (!atB.ok || !atC.ok) continue;
    const eF = atB.egyenletek.find((q) => q.rud === felso);
    const eA = atB.egyenletek.find((q) => q.rud === also);
    if (!eF || eF.nincsEgyismeretlenes || !eA || eA.nincsEgyismeretlenes || !atC.megoldhato) continue;
    return {
      szoveg: (
        <p>
          K-rácsozású tartó: 4 mező, <M>{`a = ${szK(a, 1)}\\ \\text{m}`}</M>, magasság <M>{`2h = ${szK(2 * h, 1)}\\ \\text{m}`}</M> (a K-k szára az oszlopok felezőpontjából indul); bal alsó csomópont csukló, jobb alsó görgő. Terhek:{" "}
          {terhekSzoveg(m.terhek)}. Négyes átmetszéssel számítsd ki a 2. mező felső és alsó övrúdjának erejét (S{felso}, S{also}), majd a K két szárát (S{szar1}, S{szar2})!
        </p>
      ),
      abra: <FeladatRajz modell={m} kiemelt={[felso, also, szar1, szar2]} magassag={300} />,
      sugo: (
        <p>
          Ferde négyes átmetszés a(z) {kozep.id}. csomópont oszlopán át (a két oszlopfél + a két öv): a két oszlopfél ereje közös hatásvonalú, ezért az oszlop alsó és felső végpontjára írt nyomatéki egyenletben egy-egy överő
          marad. Aztán egyenes négyes átmetszés a mezőn át (két öv + a K két szára): az övek már ismertek, a két szár a két vetületi egyenletből.
        </p>
      ),
      oszlopok: 4,
      mezok: [
        { id: "f", cimke: `S${felso} (felső öv)`, egyseg: "kN", helyes: e.rudErok[felso], tizedes: 2 },
        { id: "a", cimke: `S${also} (alsó öv)`, egyseg: "kN", helyes: e.rudErok[also], tizedes: 2 },
        { id: "s1", cimke: `S${szar1}`, egyseg: "kN", helyes: e.rudErok[szar1], tizedes: 2 },
        { id: "s2", cimke: `S${szar2}`, egyseg: "kN", helyes: e.rudErok[szar2], tizedes: 2 },
      ],
      megoldas: (
        <>
          <p>
            <strong>Reakciók</strong>:
          </p>
          <ReakcioLevezetes e={e} />
          <p className="mt-2">
            <strong>Ferde négyes átmetszés</strong> (S{felso}, S{also}, S{post1}, S{post2}), a bal rész ({atB.resz.join(", ")}) egyensúlya — a két oszlopfél közös hatásvonalú:
          </p>
          <MB>{eF.tex}</MB>
          <MB>{eA.tex}</MB>
          <p className="mt-2">
            <strong>Egyenes négyes átmetszés</strong> (S{felso}, S{also}, S{szar1}, S{szar2}) az ismert övekkel; a két szárra a másikra merőleges vetületi egyenlet (vagy egyszerűen <M>{"\\Fx"}</M> és <M>{"\\Fy"}</M>):
          </p>
          {atC.egyenletek.map((q, j) => (
            <MB key={j}>{q.tex}</MB>
          ))}
          {atC.ellenorzes && <MB>{`\\text{ellenőrzés: }${atC.ellenorzes.tex}`}</MB>}
          <p className="mt-2 text-[13px] text-petrol-600">A K két szára mindig ellentett előjelű (az egyik húzott, a másik nyomott), mert a vízszintes vetületük az övek különbségét egyenlíti ki.</p>
        </>
      ),
    };
  }
  return kRacsFeladat();
}

/* ---------- a szekció ---------- */

export const GENERATOROK = [
  { cim: "Csomóponti módszer — az első két csomópont", fn: csomopontiFeladat },
  { cim: "Hármas átmetszés egy mezőn át", fn: atmetszesFeladat },
  { cim: "Hány vakrúd?", fn: vakrudFeladat },
  { cim: "Reakciók és egy adott rúd", fn: reakcioRudFeladat },
  { cim: "Húzott vagy nyomott?", fn: huzottNyomottFeladat },
  { cim: "K-rács — négyes átmetszés", fn: kRacsFeladat },
];

export default function GyakorloSzekcio() {
  return (
    <>
      <GyakorloDoboz cim="Csomóponti módszer — az első két csomópont" leiras="Reakciók, majd a támasz melletti csomópontból indulva két csomópont négy egyenlete." generator={csomopontiFeladat} oszlopok={4} />
      <GyakorloDoboz cim="Hármas átmetszés egy mezőn át" leiras="Két övrúd + egy rácsrúd: két nyomatéki egyenlet a főpontokra és egy függőleges vetület." generator={atmetszesFeladat} oszlopok={3} />
      <GyakorloDoboz cim="Hány vakrúd?" leiras="A három alapeset felismerése — és hogy a vakrudak továbbterjednek." generator={vakrudFeladat} />
      <GyakorloDoboz cim="Reakciók és egy adott rúd" leiras="Ferde teher: A_x sem nulla. A kiemelt rúdhoz átmetszést vagy csomóponti lépéseket kell választani." generator={reakcioRudFeladat} oszlopok={4} />
      <GyakorloDoboz cim="Húzott vagy nyomott?" leiras="Számolás nélkül, szemléletből: övek ↔ nyomatéki ábra, rácsrudak ↔ nyíróerő." generator={huzottNyomottFeladat} oszlopok={3} />
      <GyakorloDoboz cim="K-rács — négyes átmetszés" leiras="A tankönyv 6.3.2: ferde négyes átmetszés az övekhez, egyenes a K száraihoz." generator={kRacsFeladat} oszlopok={4} />
      <div className="mt-10 mb-4 flex items-center gap-3">
        <span className="h-px flex-1 bg-petrol-200" />
        <span className="text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">További feladattípusok</span>
        <span className="h-px flex-1 bg-petrol-200" />
      </div>
      <GyakorloExtra />
    </>
  );
}
