import { ertekek } from "@/lib/tarto";
import { TartoHegyek, Gorgo, Csuklo, Befogas, BelsoCsuklo, KoncentraltNyomatek, Meret, MeretFugg, TamaszCimke, SZIN } from "@/components/tartok/TartoElemek";
import { sz } from "@/lib/szamok";

/**
 * Közös rajzsegéd a 9. modulhoz: a tartó és az N / V / M igénybevételi ábrák
 * kirajzolása egy `elemez` eredményből, egzaktan (a szakaszonkénti polinomokból).
 *
 *   <Diagram eredmeny={e} />                       – szerkezet + N, V, M ábra egymás alatt
 *   <Diagram eredmeny={e} abrak={["V","M"]} />     – csak a kért ábrák
 *   <Diagram eredmeny={e} abrak={[]} meretek />    – csak a szerkezet, méretvonalakkal (feladat-ábra)
 *   hatar={s}     – az ábrák csak az s ívhosszig „épülnek” (film, Vágd el a tartót)
 *   metszet={s}   – szaggatott vágásvonal a szerkezeten és pont az ábrákon az s ívhossznál
 *   kiemelTorespontok / kiemelSzelso = 0…1 – gyűrűk a töréspontokon, ill. a V = 0 helyeken
 *
 * Előjelek (tankönyv 8.1.2.2): M a húzott oldalra (vízszintes rúdnál alulra), N és V a +ȳ oldalra.
 * Színek: N #059669, V #0369a1, M #be123c (mint az Ábrakalkulátorban).
 */

export const SZINEK = { N: "#059669", V: "#0369a1", M: "#be123c" };
export const NEVEK = { N: "N – normálerő [kN]", V: "V – nyíróerő [kN]", M: "M – hajlítónyomaték [kNm]" };
export const EGYSEG = { N: "kN", V: "kN", M: "kNm" };

const FOK = Math.PI / 180;

/** Szám az ábrafeliratokhoz: annyi tizedes, amennyi kell (max 2). */
export function ert(v) {
  const a = Math.abs(v);
  if (Math.abs(a - Math.round(a)) < 5e-4) return sz(v, 0);
  if (Math.abs(a * 10 - Math.round(a * 10)) < 5e-3) return sz(v, 1);
  return sz(v, 2);
}

/** A teljes ívhossz (a rudak hosszának összege, a rudak sorrendjében). */
export function osszHossz(e) {
  return e.igenybevetelek.reduce((s, ig) => s + ig.hossz, 0);
}

/** Egy ívhossz-pozíció felbontása rúdra és lokális x-re, a globális ponttal és az értékekkel. */
export function helyIvhosszon(e, s) {
  const igs = e.igenybevetelek;
  let m = Math.max(0, s);
  for (let i = 0; i < igs.length; i++) {
    const ig = igs[i];
    if (m <= ig.hossz + 1e-9 || i === igs.length - 1) {
      const x = Math.min(ig.hossz, m);
      const c = Math.cos(ig.szogFok * FOK), sn = Math.sin(ig.szogFok * FOK);
      return { rudIndex: i, ig, x, X: ig.kezdo[0] + x * c, Y: ig.kezdo[1] + x * sn, ertek: ertekek(ig, x) };
    }
    m -= ig.hossz;
  }
  return null;
}

/** Polinom tényleges fokszáma (a záró nullák nélkül). */
export function fokszam(p) {
  let n = p.length - 1;
  while (n > 0 && Math.abs(p[n]) < 1e-9) n--;
  return n;
}

/* ------------------------------------------------------------------ */
/*  geometria                                                          */
/* ------------------------------------------------------------------ */

export function geometria(e, { szel = 600, margo = 74, maxMag = 190 } = {}) {
  const m = e.modell;
  const xs = m.csomopontok.map((c) => c.x), ys = m.csomopontok.map((c) => c.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const szelX = Math.max(maxX - minX, 0.5), magY = Math.max(maxY - minY, 0);
  const L = Math.min((szel - 2 * margo) / szelX, magY > 0 ? maxMag / magY : Infinity);
  const OX = (szel - szelX * L) / 2 - minX * L;
  const kx = (x) => OX + x * L;
  return { L, kx, minX, maxX, minY, maxY, szelX, magY, magPx: magY * L, szel };
}

/* ------------------------------------------------------------------ */
/*  terhek a normalizált modellből                                     */
/* ------------------------------------------------------------------ */

export function Terhek({ m, kx, ky, cimkek = true, H = 52, qMax = 34 }) {
  const elemek = [];
  let maxQ = 0;
  for (const rud of m.rudak) for (const q of rud.megoszlok) maxQ = Math.max(maxQ, Math.hypot(q.qx1, q.qy1), Math.hypot(q.qx2, q.qy2));
  const qLeptek = maxQ > 1e-9 ? qMax / maxQ : 0;
  const felirat = (x, y, szoveg, horgony = "start") => (
    <text x={x} y={y} textAnchor={horgony} fontSize="12.5" fontWeight="650" style={{ fill: SZIN.teher, paintOrder: "stroke", stroke: "white", strokeWidth: 3.5 }}>
      {szoveg}
    </text>
  );
  const ero = (kulcs, X, Y, Fx, Fy) => {
    const n = Math.hypot(Fx, Fy);
    if (n < 1e-9) return;
    const ex = Fx / n, ey = Fy / n;
    const x1 = X - ex * H, y1 = Y + ey * H; // a farok
    elemek.push(
      <g key={kulcs}>
        <line x1={x1} y1={y1} x2={X} y2={Y} stroke={SZIN.teher} strokeWidth="3" strokeLinecap="round" markerEnd="url(#th-teher)" />
        {cimkek && felirat(x1 + (Math.abs(ex) < 0.3 ? 7 : ex > 0 ? -7 : 7), y1 + (Math.abs(ey) < 0.3 ? -7 : ey > 0 ? 15 : -6), `${ert(n)} kN`, Math.abs(ex) < 0.3 ? "start" : ex > 0 ? "end" : "start")}
      </g>,
    );
  };

  m.csomopontiTerhek.forEach((t, i) => {
    const cs = m.csomopontok[i];
    ero(`cs${i}`, kx(cs.x), ky(cs.y), t.Fx, t.Fy);
    if (Math.abs(t.M) > 1e-9) elemek.push(<KoncentraltNyomatek key={`csm${i}`} x={kx(cs.x)} y={ky(cs.y)} irany={t.M > 0 ? 1 : -1} cimke={cimkek ? `${ert(Math.abs(t.M))} kNm` : undefined} />);
  });

  m.rudak.forEach((rud, j) => {
    const { cos: c, sin: s } = rud;
    const elozoRud = j > 0 ? m.rudak[j - 1] : null;
    rud.pontTerhek.forEach((p, i) => {
      const X = kx(rud.x1 + p.a * c), Y = ky(rud.y1 + p.a * s);
      ero(`p${rud.id}-${i}`, X, Y, p.Px * c - p.Py * s, p.Px * s + p.Py * c);
      if (Math.abs(p.Mz) > 1e-9) elemek.push(<KoncentraltNyomatek key={`pm${rud.id}-${i}`} x={X} y={Y} irany={p.Mz > 0 ? 1 : -1} cimke={cimkek ? `${ert(Math.abs(p.Mz))} kNm` : undefined} />);
    });
    rud.megoszlok.forEach((q, i) => {
      const dL = q.a2 - q.a1;
      if (dL < 1e-9 || qLeptek === 0) return;
      const pxHossz = dL * Math.abs(kx(1) - kx(0));
      const n = Math.max(2, Math.round(pxHossz / 20));
      const nyilak = [], farkak = [];
      let Fy0 = 0;
      for (let k = 0; k <= n; k++) {
        const u = k / n;
        const a = q.a1 + dL * u;
        const qx = q.qx1 + (q.qx2 - q.qx1) * u, qy = q.qy1 + (q.qy2 - q.qy1) * u;
        const Fx = qx * c - qy * s, Fy = qx * s + qy * c;
        Fy0 += Fy;
        const nagy = Math.hypot(Fx, Fy);
        const X = kx(rud.x1 + a * c), Y = ky(rud.y1 + a * s);
        if (nagy < 1e-9) { farkak.push([X, Y]); continue; }
        const h = nagy * qLeptek;
        const tx = X - (Fx / nagy) * h, ty = Y + (Fy / nagy) * h;
        farkak.push([tx, ty]);
        nyilak.push(<line key={k} x1={tx} y1={ty} x2={X} y2={Y} stroke={SZIN.teher} strokeWidth="1.5" markerEnd="url(#th-teher)" />);
      }
      const q1 = Math.hypot(q.qx1, q.qy1), q2 = Math.hypot(q.qx2, q.qy2);
      const cimke = Math.abs(q1 - q2) < 1e-9 ? `${ert(q1)} kN/m` : `${ert(q1)} … ${ert(q2)} kN/m`;
      const kozep = farkak[Math.floor(farkak.length / 2)];
      // ha az előző rúdon ugyanez a teher folytatódik idáig, a feliratot nem ismételjük
      const folytatas = elozoRud && q.a1 < 1e-9 && elozoRud.ib === rud.ia && elozoRud.megoszlok.some((q0) =>
        Math.abs(q0.a2 - elozoRud.hossz) < 1e-9 && Math.abs(q0.qy2 - q.qy1) < 1e-9 && Math.abs(q0.qx2 - q.qx1) < 1e-9 && Math.abs(elozoRud.szogFok - rud.szogFok) < 1e-6);
      elemek.push(
        <g key={`q${rud.id}-${i}`}>
          <polyline points={farkak.map((f) => f.join(",")).join(" ")} fill="none" stroke={SZIN.teher} strokeWidth="1.6" />
          {nyilak}
          {cimkek && !folytatas && felirat(kozep[0], kozep[1] + (Fy0 <= 0 ? -7 : 15), cimke, "middle")}
        </g>,
      );
    });
  });
  return <g>{elemek}</g>;
}

/* ------------------------------------------------------------------ */
/*  a szerkezet                                                        */
/* ------------------------------------------------------------------ */

function befogasIrany(m, ics) {
  const rud = m.rudak.find((r) => r.ia === ics || r.ib === ics);
  if (!rud) return "bal";
  const kifele = rud.ia === ics ? [rud.cos, rud.sin] : [-rud.cos, -rud.sin]; // a rúd iránya a csomópontból
  if (Math.abs(kifele[0]) >= Math.abs(kifele[1])) return kifele[0] > 0 ? "bal" : "jobb";
  return kifele[1] > 0 ? "le" : "fel";
}

export function Szerkezet({ e, g, ky, reakciok = true, reakcioOpacitas = 1, terhek = true, teherCimkek = true, csomopontCimkek = true, meretek = false, meretY, vastag = 5 }) {
  const m = e.modell;
  const { kx } = g;
  const tamaszNal = new Set(m.tamaszok.map((t) => t.ics));

  // belső csuklók
  const csuklok = new Set();
  for (const r of m.rudak) { if (r.csukloA) csuklok.add(r.ia); if (r.csukloB) csuklok.add(r.ib); }

  // méretvonalak: a jellemző x-ek és y-ok
  let meretElemek = null;
  if (meretek) {
    const xsSet = new Set(m.csomopontok.map((c) => +c.x.toFixed(6)));
    const ysSet = new Set(m.csomopontok.map((c) => +c.y.toFixed(6)));
    for (const r of m.rudak) {
      for (const p of r.pontTerhek) { xsSet.add(+(r.x1 + p.a * r.cos).toFixed(6)); ysSet.add(+(r.y1 + p.a * r.sin).toFixed(6)); }
      for (const q of r.megoszlok) {
        xsSet.add(+(r.x1 + q.a1 * r.cos).toFixed(6)); xsSet.add(+(r.x1 + q.a2 * r.cos).toFixed(6));
        ysSet.add(+(r.y1 + q.a1 * r.sin).toFixed(6)); ysSet.add(+(r.y1 + q.a2 * r.sin).toFixed(6));
      }
    }
    const xs = [...xsSet].sort((a, b) => a - b), ys = [...ysSet].sort((a, b) => a - b);
    const yM = meretY ?? ky(g.minY) + (tamaszNal.size ? (reakciok ? 74 : 58) : 34);
    meretElemek = (
      <g>
        {xs.slice(1).map((x, i) => (x - xs[i] > 1e-6 ? <Meret key={`mx${i}`} x1={kx(xs[i])} x2={kx(x)} y={yM} cimke={`${ert(x - xs[i])} m`} /> : null))}
        {g.magY > 0 && ys.slice(1).map((y, i) => (y - ys[i] > 1e-6 ? <MeretFugg key={`my${i}`} x={kx(g.maxX) + 40} y1={ky(y)} y2={ky(ys[i])} cimke={`${ert(y - ys[i])} m`} /> : null))}
      </g>
    );
  }

  return (
    <g>
      {/* támaszok */}
      {m.tamaszok.map((t, i) => {
        const cs = m.csomopontok[t.ics];
        const x = kx(cs.x), y = ky(cs.y);
        if (t.tipus === "csuklo") return <Csuklo key={i} x={x} y={y} />;
        if (t.tipus === "befogas") return <Befogas key={i} x={x} y={y} irany={befogasIrany(m, t.ics)} hossz={44} />;
        if (t.tipus === "gorgo") return <Gorgo key={i} x={x} y={y} szog={t.szog - 90} />;
        return (
          <g key={i}>
            <line x1={x} y1={y} x2={x + t.irany[0] * 34} y2={y - t.irany[1] * 34} stroke={SZIN.rud} strokeWidth="3.5" />
            <circle cx={x} cy={y} r="3.5" fill="white" stroke={SZIN.tamasz} strokeWidth="1.5" />
            <circle cx={x + t.irany[0] * 34} cy={y - t.irany[1] * 34} r="3.5" fill="white" stroke={SZIN.tamasz} strokeWidth="1.5" />
          </g>
        );
      })}
      {/* rudak */}
      {m.rudak.map((r) => (
        <line key={r.id} x1={kx(r.x1)} y1={ky(r.y1)} x2={kx(r.x2)} y2={ky(r.y2)} stroke={SZIN.tarto} strokeWidth={vastag} strokeLinecap="round" />
      ))}
      {[...csuklok].map((ics) => {
        const cs = m.csomopontok[ics];
        return <BelsoCsuklo key={`bcs${ics}`} x={kx(cs.x)} y={ky(cs.y)} />;
      })}
      {/* terhek */}
      {terhek && <Terhek m={m} kx={kx} ky={ky} cimkek={teherCimkek} />}
      {/* reakciók */}
      {reakciok && reakcioOpacitas > 0.01 && <g opacity={reakcioOpacitas}>{e.reakciok.map((re, i) => {
        const cs = m.csomopontok.find((c) => c.id === re.csomopont);
        const x = kx(cs.x), y = ky(cs.y);
        const fx = re.Fx ?? 0, fy = re.Fy ?? 0;
        const elemek = [];
        // a reakcióerőt komponensenként rajzoljuk (A_x, A_y), ahogy a tankönyv is felveszi
        const nyil = (kulcs, cx, cy) => {
          const n = Math.hypot(cx, cy);
          if (n < 1e-6) return;
          const h = 44;
          const ex = (cx / n) * h, ey = (cy / n) * h;
          const tx = x - ex, ty = y + ey;
          elemek.push(
            <g key={kulcs}>
              <line x1={tx} y1={ty} x2={x} y2={y} stroke={SZIN.reakcio} strokeWidth="2.6" markerEnd="url(#th-reakcio)" />
              <text x={Math.abs(ey) < 8 ? tx + ex / 2 : tx + 8} y={ty + (Math.abs(ey) < 8 ? -7 : ey > 0 ? 14 : -5)} textAnchor={Math.abs(ey) < 8 ? "middle" : "start"} fontSize="11.5" fontWeight="650"
                style={{ fill: SZIN.reakcio, paintOrder: "stroke", stroke: "white", strokeWidth: 3.5 }}>
                {ert(n)} kN
              </text>
            </g>,
          );
        };
        if (re.tipus === "rud" || re.tipus === "gorgo") nyil("e", fx, fy);
        else { nyil("ex", fx, 0); nyil("ey", 0, fy); }
        if (Math.abs(re.M ?? 0) > 1e-6) {
          const felulrol = fy < -1e-6 && Math.abs(fy) > Math.abs(fx);
          elemek.push(<KoncentraltNyomatek key="m" x={x} y={y} r={20} irany={re.M > 0 ? 1 : -1} szin={SZIN.reakcio} cimke={felulrol ? undefined : `${ert(Math.abs(re.M))} kNm`} />);
          if (felulrol) elemek.push(
            <text key="mc" x={x - 26} y={y - 2} textAnchor="end" fontSize="12.5" fontWeight="650" style={{ fill: SZIN.reakcio, paintOrder: "stroke", stroke: "white", strokeWidth: 3.5 }}>{ert(Math.abs(re.M))} kNm</text>,
          );
        }
        return <g key={`re${i}`}>{elemek}</g>;
      })}</g>}
      {/* csomópont-betűk */}
      {csomopontCimkek && m.csomopontok.map((cs, i) => {
        const x = kx(cs.x), y = ky(cs.y);
        const tam = m.tamaszok.find((t) => t.ics === i);
        if (tam && tam.tipus === "befogas") {
          const ir = befogasIrany(m, i);
          const d = { bal: [-14, 22], jobb: [14, 22], le: [-18, 16], fel: [-18, -8] }[ir];
          return <TamaszCimke key={i} x={x + d[0]} y={y + d[1]}>{cs.id}</TamaszCimke>;
        }
        if (tam) return <TamaszCimke key={i} x={x - 18} y={y + 22}>{cs.id}</TamaszCimke>;
        // szabad vég, sarok, belső csukló: oda, ahol nincs teher-nyíl
        const ct = m.csomopontiTerhek[i];
        const fentFoglalt = ct.Fy < -1e-9;
        const lentFoglalt = ct.Fy > 1e-9 || m.rudak.some((r) => (r.ia === i || r.ib === i) && r.megoszlok.some((q) => (q.qx1 * r.sin + q.qy1 * r.cos) > 1e-9));
        const fel = lentFoglalt && !fentFoglalt;
        return <TamaszCimke key={i} x={x} y={fel ? y - 10 : y + 22}>{cs.id}</TamaszCimke>;
      })}
      {meretElemek}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/*  egy igénybevételi ábra                                             */
/* ------------------------------------------------------------------ */

function mintavetel(ig, lim) {
  const pontok = [];
  for (const szk of ig.szakaszok) {
    if (szk.x1 >= lim - 1e-9) break;
    const x2 = Math.min(szk.x2, lim);
    const fok = Math.max(fokszam(szk.N), fokszam(szk.V), fokszam(szk.M));
    const db = fok <= 1 ? 1 : 24;
    for (let i = 0; i <= db; i++) {
      const x = szk.x1 + ((x2 - szk.x1) * i) / db;
      const v = ertekek({ szakaszok: [szk] }, x);
      pontok.push({ x, N: v.N, V: v.V, M: v.M });
    }
  }
  return pontok;
}

export function AbraSav({ e, g, ky, jel, hatar, leptek, cimkek = true, kiemelTorespontok = 0, kiemelSzelso = 0, metszet, halvany = false }) {
  const { kx } = g;
  const szin = SZINEK[jel];
  const igs = e.igenybevetelek;
  const teljes = osszHossz(e);
  const lim = hatar === undefined ? teljes : Math.max(0, Math.min(teljes, hatar));
  const elemek = [];
  const feliratok = [];
  const feliratHelyek = []; // { X, Y, v } – ugyanott ugyanaz az érték csak egyszer
  let elozo = 0;

  igs.forEach((ig, i) => {
    const c = Math.cos(ig.szogFok * FOK), s = Math.sin(ig.szogFok * FOK);
    const ir = jel === "M" ? [s, c] : [-s, -c];
    const pont = (x, v) => [kx(ig.kezdo[0] + x * c) + ir[0] * v * leptek, ky(ig.kezdo[1] + x * s) + ir[1] * v * leptek];
    const tengely = (x) => [kx(ig.kezdo[0] + x * c), ky(ig.kezdo[1] + x * s)];
    const rudLim = Math.max(0, Math.min(ig.hossz, lim - elozo));
    const kezd = elozo;
    elozo += ig.hossz;

    if (rudLim > 1e-9 && leptek > 0) {
      const pontok = mintavetel(ig, rudLim);
      const gorbe = pontok.map((p) => pont(p.x, p[jel]));
      const a0 = tengely(0), a1 = tengely(rudLim);
      const d = `M ${a0[0]} ${a0[1]} ` + gorbe.map((p) => `L ${p[0]} ${p[1]}`).join(" ") + ` L ${a1[0]} ${a1[1]} Z`;
      // sraffozás: a tengelyre merőleges vonalkák
      const lepes = 7 / g.L;
      const vonalak = [];
      for (let x = lepes / 2; x < rudLim; x += lepes) {
        const v = ertekek(ig, x)[jel];
        if (Math.abs(v) * leptek < 1.5) continue;
        const a = tengely(x), b = pont(x, v);
        vonalak.push(<line key={x} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={szin} strokeWidth="0.8" opacity="0.55" />);
      }
      elemek.push(
        <g key={`d${i}`} opacity={halvany ? 0.35 : 1}>
          <path d={d} fill={szin} fillOpacity="0.1" stroke="none" />
          {vonalak}
          <path d={"M " + gorbe.map((p) => `${p[0]} ${p[1]}`).join(" L ")} fill="none" stroke={szin} strokeWidth="2.2" strokeLinejoin="round" />
        </g>,
      );
    }

    // feliratok a szakaszhatárokon (bal és jobb oldali érték), a V = 0 helyeken az M-nél
    if (cimkek) {
      const helyek = [];
      ig.szakaszok.forEach((szk, k) => {
        if (k === 0) helyek.push({ x: szk.x1, bal: null, jobb: ertekek({ szakaszok: [szk] }, szk.x1)[jel] });
        const jobbSzk = ig.szakaszok[k + 1];
        helyek.push({
          x: szk.x2,
          bal: ertekek({ szakaszok: [szk] }, szk.x2)[jel],
          jobb: jobbSzk ? ertekek({ szakaszok: [jobbSzk] }, szk.x2)[jel] : null,
        });
      });
      if (jel === "M") {
        for (const h of ig.MszelsoHelyek) {
          if (helyek.some((q) => Math.abs(q.x - h.x) < 1e-6)) continue;
          helyek.push({ x: h.x, bal: h.M, jobb: h.M, szelso: true });
        }
      }
      for (const h of helyek) {
        if (h.x > rudLim + 1e-9 || (hatar !== undefined && rudLim < 1e-9)) continue;
        // ugrásnál két felirat (bal/jobb oldali érték), a rúdvégeken a felirat kicsit beljebb a rúd mentén
        const ertekekItt = h.bal !== null && h.jobb !== null && Math.abs(h.bal - h.jobb) > 1e-6
          ? [{ v: h.bal, oldal: -1, be: 5 }, { v: h.jobb, oldal: 1, be: 5 }]
          : [{ v: h.bal ?? h.jobb, oldal: h.bal === null ? 1 : h.jobb === null ? -1 : 0, be: 12 }];
        for (const { v, oldal, be } of ertekekItt) {
          if (Math.abs(v) < 1e-6) continue;
          const p = pont(h.x, v);
          if (feliratHelyek.some((f) => Math.abs(f.X - p[0]) < 1 && Math.abs(f.Y - p[1]) < 1 && Math.abs(f.v - v) < 1e-6)) continue;
          feliratHelyek.push({ X: p[0], Y: p[1], v });
          const o = [ir[0] * Math.sign(v), ir[1] * Math.sign(v)];
          const menti = [c * oldal * be, -s * oldal * be];
          let horgony = Math.abs(o[0]) < 0.35 ? (be > 6 || oldal === 0 ? "middle" : oldal < 0 ? "end" : "start") : o[0] > 0 ? "start" : "end";
          const dx = o[0] * 8;
          const dy = o[1] * 8 + (o[1] > 0.35 ? 8 : o[1] < -0.35 ? -1 : 4);
          feliratok.push(
            <text key={`f${i}-${h.x}-${oldal}`} x={p[0] + dx + menti[0]} y={p[1] + dy + menti[1]} textAnchor={horgony} fontSize="11.5" fontWeight="700"
              style={{ fill: szin, paintOrder: "stroke", stroke: "white", strokeWidth: 3.5 }}>
              {ert(v)}
            </text>,
          );
        }
      }
    }

    // kiemelések
    if (kiemelTorespontok > 0.01) {
      ig.szakaszok.forEach((szk, k) => {
        const xs = k === 0 ? [szk.x1, szk.x2] : [szk.x2];
        xs.forEach((x) => {
          if (x > rudLim + 1e-9) return;
          const v = ertekek(ig, x)[jel];
          const p = pont(x, v);
          elemek.push(<circle key={`t${i}-${k}-${x}`} cx={p[0]} cy={p[1]} r="7" fill="none" stroke={szin} strokeWidth="2" strokeDasharray="3 2" opacity={kiemelTorespontok} />);
        });
      });
    }
    if (kiemelSzelso > 0.01 && jel === "M") {
      for (const h of ig.MszelsoHelyek) {
        if (h.x > rudLim + 1e-9 || Math.abs(h.M) < 1e-6) continue;
        const p = pont(h.x, h.M), a = tengely(h.x);
        elemek.push(
          <g key={`sz${i}-${h.x}`} opacity={kiemelSzelso}>
            <line x1={a[0]} y1={a[1]} x2={p[0]} y2={p[1]} stroke={szin} strokeWidth="1.2" strokeDasharray="3 2" />
            <circle cx={p[0]} cy={p[1]} r="9" fill="none" stroke={szin} strokeWidth="2.2" />
          </g>,
        );
      }
    }
    if (kiemelSzelso > 0.01 && jel === "V") {
      for (const h of ig.MszelsoHelyek) {
        if (h.x > rudLim + 1e-9) continue;
        const a = tengely(h.x);
        elemek.push(<circle key={`v0-${i}-${h.x}`} cx={a[0]} cy={a[1]} r="6" fill="white" stroke={szin} strokeWidth="2.2" opacity={kiemelSzelso} />);
      }
    }

    // metszet-pont
    if (metszet !== undefined && metszet >= kezd - 1e-9 && metszet <= kezd + ig.hossz + 1e-9 && leptek > 0) {
      const x = metszet - kezd;
      const v = ertekek(ig, x)[jel];
      const p = pont(x, v), a = tengely(x);
      elemek.push(
        <g key={`m${i}`}>
          <line x1={a[0]} y1={a[1]} x2={p[0]} y2={p[1]} stroke="#334155" strokeWidth="1.2" strokeDasharray="3 2" />
          <circle cx={p[0]} cy={p[1]} r="4.5" fill={szin} stroke="white" strokeWidth="1.5" />
        </g>,
      );
    }
  });

  return (
    <g>
      {/* a tartó tengelye vékonyan */}
      {e.modell.rudak.map((r) => (
        <line key={r.id} x1={kx(r.x1)} y1={ky(r.y1)} x2={kx(r.x2)} y2={ky(r.y2)} stroke={SZIN.tarto} strokeWidth="1.6" opacity="0.7" />
      ))}
      {elemek}
      {feliratok}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/*  a teljes összeállítás                                              */
/* ------------------------------------------------------------------ */

export function leptekek(e, amp = 44) {
  const maxE = { N: 0, V: 0, M: 0 };
  for (const ig of e.igenybevetelek) for (const jel of ["N", "V", "M"]) maxE[jel] = Math.max(maxE[jel], Math.abs(ig.szelso[jel].min), Math.abs(ig.szelso[jel].max));
  const ki = {};
  for (const jel of ["N", "V", "M"]) ki[jel] = maxE[jel] > 1e-9 ? amp / maxE[jel] : 0;
  return { maxE, leptek: ki };
}

export default function Diagram({
  eredmeny: e,
  abrak = ["N", "V", "M"],
  szerkezet = true,
  szel = 600,
  hatar,
  metszet,
  meretek = false,
  reakciok = true,
  reakcioOpacitas = 1,
  szakaszJelek = 0,
  terhek = true,
  teherCimkek = true,
  csomopontCimkek = true,
  cimkek = true,
  nevek = true,
  amp = 44,
  kiemelTorespontok = 0,
  kiemelSzelso = 0,
  halvany = false,
  className = "abra w-full h-auto",
  gyerekek,
}) {
  if (!e || !e.ok) {
    return (
      <svg viewBox={`0 0 ${szel} 60`} className={className}>
        <text x={szel / 2} y="34" textAnchor="middle" fontSize="13" style={{ fill: "#be123c" }}>A szerkezet nem oldható meg.</text>
      </svg>
    );
  }
  const m = e.modell;
  const g = geometria(e, { szel });
  const { leptek } = leptekek(e, amp);
  const vanTamasz = m.tamaszok.length > 0;

  // panelmagasságok
  const szerkFent = 72, szerkLent = (vanTamasz ? (reakciok ? 66 : 50) : 26) + (meretek ? 30 : 0);
  const szerkMag = szerkezet ? szerkFent + g.magPx + szerkLent : 0;
  const abraFent = nevek ? amp + 40 : amp + 14;
  const abraMag = abraFent + g.magPx + amp + 26;
  const H = szerkMag + abrak.length * abraMag;

  const panelek = [];
  let y0 = 0;
  if (szerkezet) {
    const top = y0;
    const ky = (y) => top + szerkFent + (g.maxY - y) * g.L;
    panelek.push(
      <Szerkezet key="sz" e={e} g={g} ky={ky} reakciok={reakciok} reakcioOpacitas={reakcioOpacitas} terhek={terhek} teherCimkek={teherCimkek} csomopontCimkek={csomopontCimkek} meretek={meretek} />,
    );
    if (szakaszJelek > 0.01) {
      // szakaszhatárok: minden rúd szakaszainak végpontjai, a rúdra merőleges szaggatott vonallal
      const jelek = [];
      e.igenybevetelek.forEach((ig, i) => {
        const c = Math.cos(ig.szogFok * FOK), s = Math.sin(ig.szogFok * FOK);
        const xs = [ig.szakaszok[0].x1, ...ig.szakaszok.map((sz) => sz.x2)];
        xs.forEach((x, k) => {
          const X = g.kx(ig.kezdo[0] + x * c), Y = ky(ig.kezdo[1] + x * s);
          jelek.push(<line key={`${i}-${k}`} x1={X - s * 26} y1={Y - c * 26} x2={X + s * 26} y2={Y + c * 26} stroke="#0e7490" strokeWidth="1.6" strokeDasharray="4 3" />);
        });
      });
      panelek.push(<g key="szj" opacity={szakaszJelek}>{jelek}</g>);
    }
    if (metszet !== undefined) {
      const h = helyIvhosszon(e, metszet);
      if (h) {
        const c = Math.cos(h.ig.szogFok * FOK), s = Math.sin(h.ig.szogFok * FOK);
        const X = g.kx(h.X), Y = ky(h.Y);
        panelek.push(
          <g key="szm">
            <line x1={X - s * 22} y1={Y - c * 22} x2={X + s * 22} y2={Y + c * 22} stroke="#334155" strokeWidth="1.8" strokeDasharray="4 3" />
            <circle cx={X} cy={Y} r="4" fill="#334155" stroke="white" strokeWidth="1.5" />
            <text x={X + s * 26 + 4} y={Y - c * 26 - 4} fontSize="12" fontWeight="700" fontStyle="italic" style={{ fill: "#334155", paintOrder: "stroke", stroke: "white", strokeWidth: 3.5 }}>K</text>
          </g>,
        );
      }
    }
    y0 += szerkMag;
  }
  abrak.forEach((jel) => {
    const top = y0;
    const ky = (y) => top + abraFent + (g.maxY - y) * g.L;
    panelek.push(
      <g key={`p${jel}`}>
        {nevek && (
          <text x={10} y={top + 15} fontSize="12" fontWeight="700" style={{ fill: SZINEK[jel] }}>
            {NEVEK[jel]}
          </text>
        )}
        {panelek.length > 0 && <line x1={12} y1={top + 2} x2={szel - 12} y2={top + 2} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 4" />}
        <AbraSav e={e} g={g} ky={ky} jel={jel} hatar={hatar} leptek={leptek[jel]} cimkek={cimkek} kiemelTorespontok={kiemelTorespontok} kiemelSzelso={kiemelSzelso} metszet={metszet} halvany={halvany} />
      </g>,
    );
    y0 += abraMag;
  });

  return (
    <svg viewBox={`0 0 ${szel} ${H}`} className={className}>
      <TartoHegyek />
      {panelek}
      {typeof gyerekek === "function" ? gyerekek({ g, szerkFent, abraFent, abraMag, szerkMag, leptek }) : gyerekek}
    </svg>
  );
}
