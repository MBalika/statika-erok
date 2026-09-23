"use client";

/**
 * Közös rajzsegéd a 9. modul gyakorló feladataihoz és a játékhoz.
 * A rajz forrása a számítómag NYERS modellje (csomópontok, rudak, támaszok, terhek —
 * a terhek opcionális `cimke` mezővel) és az `elemez` eredménye. Így minden ábra ugyanabból
 * a modellből készül, amelyből a számok is jönnek.
 *
 *   geometria(modell, opciok)           → { kx, ky, PX, minX, maxX, minY, maxY }
 *   <SzerkezetRajz m kx ky cimkek />     – rudak, belső csuklók, támaszok, csomópont-betűjelek
 *   <TerhekRajz modell m kx ky />        – terhek a nyers modellből, ütközéskerülő feliratokkal
 *   <ReakciokRajz eredmeny kx ky />      – lila reakciónyilak a számított értékkel
 *   <Meretlanc xs y kx /> <MeretlancFugg ys x ky />
 *   diagramUt(ig, jel, kx, ky, leptek)   → { d, vonal } – az igénybevételi ábra útvonala a rúdon (N, V, M egyaránt a rúd
 *                                          pozitív, az M-hez választott oldalára: vízszintes tartónál a pozitív érték alul)
 *   <FeladatRajz modell eredmeny cimkek metszetek diagram reakciok />  – kész ábra keretben
 *
 * Színek: teher narancs, reakció lila, N zöld, V kék, M bordó (a kalkulátorral egyezően).
 */

import { elemez, mintak } from "@/lib/tarto";
import { TartoHegyek, Gorgo, Csuklo, Befogas, TeherNyil, KoncentraltNyomatek, Meret, MeretFugg, TamaszCimke, SZIN } from "@/components/tartok/TartoElemek";
import { sz } from "@/lib/szamok";

const kerekFel = (v) => Math.round(v / 0.5) * 0.5;
const poli = (a, x) => { let s = 0; for (let i = a.length - 1; i >= 0; i--) s = s * x + a[i]; return s; };

export const DSZIN = { N: "#059669", V: "#0369a1", M: "#be123c" };
export const DNEV = { N: "N", V: "V", M: "M" };
export const DEGYSEG = { N: "kN", V: "kN", M: "kNm" };
const FOK = Math.PI / 180;

/** Képernyő-lépték a normalizált modellhez. A rajz vízszintesen középre kerül. */
export function geometria(m, { SZ = 600, bal = 60, jobb = 60, fel = 90, le = 90, MA = null, maxPX = 90, minPX = 20 } = {}) {
  const xs = m.csomopontok.map((c) => c.x);
  const ys = m.csomopontok.map((c) => c.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const szel = Math.max(maxX - minX, 0.5);
  const mag = maxY - minY;
  let PX = Math.min(maxPX, (SZ - bal - jobb) / szel);
  if (MA && mag > 0) PX = Math.min(PX, (MA - fel - le) / mag);
  PX = Math.max(minPX, PX);
  const OX = (SZ - szel * PX) / 2 - minX * PX;
  const magas = MA ?? fel + mag * PX + le;
  const OY = fel + maxY * PX; // a legfelső csomópont a `fel` magasságban
  const kx = (x) => OX + x * PX;
  const ky = (y) => OY - y * PX;
  return { kx, ky, PX, minX, maxX, minY, maxY, magas, SZ };
}

/** A szerkezet: rudak, belső csuklók, támaszok, csomópont-betűjelek. */
export function SzerkezetRajz({ m, kx, ky, cimkek = {}, vastag = 5.5 }) {
  const elemek = [];
  m.rudak.forEach((rud) => {
    elemek.push(<line key={`r${rud.id}`} x1={kx(rud.x1)} y1={ky(rud.y1)} x2={kx(rud.x2)} y2={ky(rud.y2)} stroke={SZIN.tarto} strokeWidth={vastag} strokeLinecap="round" />);
  });
  m.rudak.forEach((rud) => {
    if (rud.csukloA) elemek.push(<circle key={`ca${rud.id}`} cx={kx(rud.x1)} cy={ky(rud.y1)} r="4.8" fill="white" stroke={SZIN.tarto} strokeWidth="2.2" />);
    if (rud.csukloB) elemek.push(<circle key={`cb${rud.id}`} cx={kx(rud.x2)} cy={ky(rud.y2)} r="4.8" fill="white" stroke={SZIN.tarto} strokeWidth="2.2" />);
  });
  m.tamaszok.forEach((t, i) => {
    const cs = m.csomopontok[t.ics];
    const x = kx(cs.x), y = ky(cs.y);
    if (t.tipus === "csuklo") elemek.push(<Csuklo key={`t${i}`} x={x} y={y} />);
    else if (t.tipus === "gorgo") elemek.push(<Gorgo key={`t${i}`} x={x} y={y} szog={t.szog - 90} />);
    else if (t.tipus === "befogas") {
      const rud = m.rudak.find((r) => r.ia === t.ics || r.ib === t.ics);
      let irany = "bal";
      if (rud) {
        const masikX = rud.ia === t.ics ? rud.x2 : rud.x1;
        const masikY = rud.ia === t.ics ? rud.y2 : rud.y1;
        if (Math.abs(rud.sin) > 0.7) irany = masikY > cs.y ? "le" : "fel";
        else irany = masikX > cs.x ? "bal" : "jobb";
      }
      elemek.push(<Befogas key={`t${i}`} x={x} y={y} irany={irany} hossz={52} />);
    } else if (t.tipus === "rud") {
      const h = 34;
      elemek.push(
        <g key={`t${i}`}>
          <line x1={x} y1={y} x2={x + t.irany[0] * h} y2={y - t.irany[1] * h} stroke={SZIN.rud} strokeWidth="3.5" />
          <circle cx={x} cy={y} r="3.5" fill="white" stroke={SZIN.tamasz} strokeWidth="1.5" />
          <circle cx={x + t.irany[0] * h} cy={y - t.irany[1] * h} r="3.5" fill="white" stroke={SZIN.tamasz} strokeWidth="1.5" />
        </g>,
      );
    }
  });
  // betűjelek: támasz alá (vízszintes tartó), egyébként a rúdtól kifelé
  m.csomopontok.forEach((cs) => {
    const nev = cimkek[cs.id];
    if (!nev) return;
    const tam = m.tamaszok.find((t) => t.ics === cs.index);
    const x = kx(cs.x), y = ky(cs.y);
    let dx = 0, dy = 0;
    const csatl = m.rudak.filter((r) => r.ia === cs.index || r.ib === cs.index);
    const fuggoleges = csatl.length > 0 && csatl.every((r) => Math.abs(r.sin) > 0.7);
    const vanFelette = csatl.some((r) => (r.ia === cs.index ? r.y2 : r.y1) > cs.y + 1e-9);
    const vanAlatta = csatl.some((r) => (r.ia === cs.index ? r.y2 : r.y1) < cs.y - 1e-9);
    if (tam && tam.tipus === "befogas") {
      dx = fuggoleges ? 16 : 0;
      dy = fuggoleges ? -8 : 30;
    } else if (tam) {
      dy = 44;
      if (tam.tipus === "gorgo") dy = 48;
    } else if (csatl.length > 1 && csatl.some((r) => Math.abs(r.sin) > 0.7) && csatl.some((r) => Math.abs(r.sin) <= 0.7)) {
      // sarok: a címke a sarok külső oldalára
      const vanJobbra = csatl.some((r) => (r.ia === cs.index ? r.x2 : r.x1) > cs.x + 1e-9);
      dx = vanJobbra ? -13 : 13;
      dy = vanAlatta ? -8 : 18;
    } else if (fuggoleges) {
      dx = -13;
      dy = vanFelette && !vanAlatta ? 18 : -8;
    } else {
      dy = vanAlatta ? -10 : 22;
    }
    elemek.push(<TamaszCimke key={`c${cs.id}`} x={x + dx} y={y + dy}>{nev}</TamaszCimke>);
  });
  return <g>{elemek}</g>;
}

/** A terhek a nyers modellből: koncentrált erők és nyomatékok (csomóponton és rúdon), megoszló terhek. */
export function TerhekRajz({ modell, m, kx, ky, dobozok, kerulendok = [] }) {
  const elemek = [];
  const feliratDobozok = dobozok ?? [];
  const metszi = (a, b) => a.x1 < b.x2 && b.x1 < a.x2 && a.y1 < b.y2 && b.y1 < a.y2;
  const rudById = (id) => m.rudak.find((r) => r.id === String(id));
  const csById = (id) => m.csomopontok.find((c) => c.id === String(id));

  // megoszló terhek léptéke
  let maxP = 0;
  const megoszlok = (modell.terhek ?? []).filter((t) => t.fajta === "megoszlo");
  for (const t of megoszlok) maxP = Math.max(maxP, Math.abs(t.p1 ?? 0), Math.abs(t.p2 ?? t.p1 ?? 0));
  const pLeptek = maxP > 0 ? Math.min(6.5, 34 / maxP) : 0;

  /** a teher iránya globális egységvektorban */
  const iranyV = (rud, irany, szog) => {
    switch (irany) {
      case "x": return [1, 0];
      case "y": return [0, 1];
      case "tengely": return [rud.cos, rud.sin];
      case "meroleges": return [-rud.sin, rud.cos];
      case "szog": return [Math.cos((szog ?? 0) * FOK), Math.sin((szog ?? 0) * FOK)];
      default: return [0, 1];
    }
  };
  /** a megoszló terhek magassága egy rúdpontban (hogy a koncentrált erő nyila fölülről induljon) */
  const megoszloMagas = (rud, a, ex, ey) => {
    let h = 0;
    for (const t of megoszlok) {
      if (String(t.rud) !== rud.id) continue;
      const a1 = t.a1 ?? 0, a2 = t.a2 ?? rud.hossz;
      if (a < a1 - 1e-9 || a > a2 + 1e-9) continue;
      const e = iranyV(rud, t.irany ?? "y", t.szog);
      const u = a2 > a1 ? (a - a1) / (a2 - a1) : 0;
      const p = (t.p1 ?? 0) + ((t.p2 ?? t.p1 ?? 0) - (t.p1 ?? 0)) * u;
      // csak ha a teher ugyanabból az irányból jön, mint az erő
      if (e[0] * ex * Math.sign(p) + e[1] * ey * Math.sign(p) > 0.5) h = Math.max(h, Math.abs(p) * pLeptek);
    }
    return h;
  };

  // --- megoszló terhek ---
  megoszlok.forEach((t, i) => {
    const rud = rudById(t.rud);
    if (!rud || pLeptek === 0) return;
    const a1 = Math.max(0, t.a1 ?? 0), a2 = Math.min(rud.hossz, t.a2 ?? rud.hossz);
    const e = iranyV(rud, t.irany ?? "y", t.szog);
    const p1 = t.p1 ?? 0, p2 = t.p2 ?? p1;
    const hossz = (a2 - a1) * Math.hypot(kx(rud.cos) - kx(0), ky(rud.sin) - ky(0));
    const n = Math.max(2, Math.round(hossz / 20));
    const nyilak = [], farkak = [];
    for (let k = 0; k <= n; k++) {
      const u = k / n;
      const a = a1 + (a2 - a1) * u;
      const p = p1 + (p2 - p1) * u;
      const X = kx(rud.x1 + a * rud.cos), Y = ky(rud.y1 + a * rud.sin);
      const h = Math.abs(p) * pLeptek;
      // a nyíl az erő irányába mutat: (e·p) globális irány; képernyőn y lefelé
      const dx = e[0] * Math.sign(p), dy = -e[1] * Math.sign(p);
      const tx = X - dx * h, ty = Y - dy * h;
      farkak.push([tx, ty]);
      if (h > 2) nyilak.push(<line key={k} x1={tx} y1={ty} x2={X - dx * 1.5} y2={Y - dy * 1.5} stroke={SZIN.teher} strokeWidth="1.6" markerEnd="url(#th-teher)" />);
    }
    const eleje = [kx(rud.x1 + a1 * rud.cos), ky(rud.y1 + a1 * rud.sin)];
    const vege = [kx(rud.x1 + a2 * rud.cos), ky(rud.y1 + a2 * rud.sin)];
    const ut = `M ${eleje[0]} ${eleje[1]} ` + farkak.map((f) => `L ${f[0]} ${f[1]}`).join(" ") + ` L ${vege[0]} ${vege[1]} Z`;
    // felirat: három jelölt hely közül a koncentrált erőktől legtávolabbi
    const pontErok = (modell.terhek ?? []).filter((q) => (q.fajta === "pontTeher" || q.fajta === "pontNyomatek") && String(q.rud) === rud.id).map((q) => q.a);
    for (const k of kerulendok) if (String(k.rud) === rud.id) pontErok.push(k.a);
    for (const cs of m.csomopontok) {
      const ct = m.csomopontiTerhek[cs.index];
      if (Math.abs(ct.Fx) + Math.abs(ct.Fy) + Math.abs(ct.M) > 1e-9) {
        const a = (cs.x - rud.x1) * rud.cos + (cs.y - rud.y1) * rud.sin;
        if (a >= -1e-9 && a <= rud.hossz + 1e-9) pontErok.push(a);
      }
    }
    const jeloltek = [a1 + 0.5 * (a2 - a1), a1 + 0.22 * (a2 - a1), a2 - 0.22 * (a2 - a1)];
    const tav = (a) => Math.min(Infinity, ...pontErok.map((q) => Math.abs(q - a)));
    const aC = jeloltek.reduce((legjobb, a) => (tav(a) > tav(legjobb) + 1e-9 ? a : legjobb), jeloltek[0]);
    const uC = (aC - a1) / Math.max(1e-9, a2 - a1);
    const pC = p1 + (p2 - p1) * uC;
    const dxC = e[0] * Math.sign(pC || p1), dyC = -e[1] * Math.sign(pC || p1);
    const cimke = t.cimke ?? (Math.abs(p1 - p2) < 1e-9 ? `${sz(Math.abs(p1), Math.abs(p1) % 1 ? 1 : 0)} kN/m` : `${sz(Math.abs(p1), 1)} … ${sz(Math.abs(p2), 1)} kN/m`);
    // ferde rúdon a farkak vonala is ferde: a feliratot a szöveg félszélessége × meredekség értékkel tovább toljuk, hogy ne feküdjön rá
    const ferde = Math.abs(rud.sin) > 0.2 && Math.abs(rud.cos) > 0.2 ? Math.min(40, 3.3 * cimke.length * Math.abs(rud.sin / rud.cos)) : 0;
    const Xc = kx(rud.x1 + aC * rud.cos) - dxC * (Math.abs(pC) * pLeptek + 9 + ferde);
    const Yc = ky(rud.y1 + aC * rud.sin) - dyC * (Math.abs(pC) * pLeptek + 9 + ferde);
    const vizszintesNyil = Math.abs(dyC) < 0.5; // vízszintes teher: a felirat a farkak mellett oldalt
    const anchor = vizszintesNyil ? (dxC > 0 ? "end" : "start") : "middle";
    const Yt = vizszintesNyil ? Yc + 4 : dyC > 0 ? Yc - 2 : Yc + 12;
    const Xt = vizszintesNyil ? Xc - dxC * 2 : Xc;
    const szeles = 6.6 * cimke.length;
    feliratDobozok.push({ x1: anchor === "middle" ? Xt - szeles / 2 : anchor === "end" ? Xt - szeles : Xt, x2: anchor === "middle" ? Xt + szeles / 2 : anchor === "end" ? Xt : Xt + szeles, y1: Yt - 12, y2: Yt + 3 });
    elemek.push(
      <g key={`q${i}`}>
        <path d={ut} fill={SZIN.teher} fillOpacity="0.12" stroke={SZIN.teher} strokeWidth="1.4" />
        {nyilak}
        <text x={Xt} y={Yt} textAnchor={anchor} fontSize="12.5" fontWeight="650" style={{ fill: SZIN.teher, paintOrder: "stroke", stroke: "white", strokeWidth: 3.5 }}>
          {cimke}
        </text>
      </g>,
    );
  });

  // --- koncentrált erők ---
  const ero = (kulcs, X, Y, Fx, Fy, cimke, rud, a) => {
    const n = Math.hypot(Fx, Fy);
    if (n < 1e-9) return;
    const szog = (Math.atan2(Fy, Fx) * 180) / Math.PI;
    const ex = Fx / n, ey = Fy / n; // globális irány (y felfelé)
    const fuggoleges = Math.abs(ex) < 1e-6;
    let h = (fuggoleges ? 50 : 58) + (rud ? megoszloMagas(rud, a, ex, ey) : 0);
    const szoveg = cimke ?? `${sz(n, n % 1 ? 1 : 0)} kN`;
    const szeles = 6.6 * szoveg.length;
    let x1, y1, eltolas, doboz;
    const szamol = () => {
      x1 = X - ex * h; // a nyíl farka
      y1 = Y + ey * h;
      if (fuggoleges) eltolas = [7, ey < 0 ? -5 : 14];
      else if (Math.abs(ey) < 0.3) eltolas = [ex > 0 ? -szeles - 6 : 8, -8];
      else eltolas = ex > 0 || x1 + 8 + szeles > 596 ? [-6 - szeles, ey < 0 ? -4 : 12] : [8, ey < 0 ? -4 : 12];
      doboz = { x1: x1 + eltolas[0], x2: x1 + eltolas[0] + szeles, y1: y1 + eltolas[1] - 12, y2: y1 + eltolas[1] + 3 };
    };
    szamol();
    for (let k = 0; k < 3 && feliratDobozok.some((d) => metszi(d, doboz)); k++) {
      if (fuggoleges) h += 26;
      else {
        const masik = eltolas[0] < 0 ? [8, eltolas[1]] : [-6 - szeles, eltolas[1]];
        if (x1 + masik[0] > 4 && x1 + masik[0] + szeles < 596) eltolas = masik;
        else h += 20;
      }
      szamol();
    }
    feliratDobozok.push(doboz);
    feliratDobozok.push({ x1: Math.min(X, x1) - 4, x2: Math.max(X, x1) + 4, y1: Math.min(Y, y1) - 2, y2: Math.max(Y, y1) + 2 });
    elemek.push(<TeherNyil key={kulcs} x={X - ex * 2} y={Y + ey * 2} hossz={h} szog={szog} cimke={szoveg} cimkeEltolas={eltolas} />);
  };
  const nyomatek = (kulcs, X, Y, Mz, cimke) => {
    const szoveg = cimke ?? `${sz(Math.abs(Mz), Math.abs(Mz) % 1 ? 1 : 0)} kNm`;
    const szeles = 6.6 * szoveg.length;
    let doboz = { x1: X + 22, x2: X + 22 + szeles, y1: Y - 26, y2: Y - 11 };
    let Xt = X + 22, Yt = Y - 14, anchor = "start";
    if (feliratDobozok.some((d) => metszi(d, doboz)) || Xt + szeles > 596) {
      Xt = X - 22;
      anchor = "end";
      doboz = { x1: Xt - szeles, x2: Xt, y1: Y - 26, y2: Y - 11 };
      if (feliratDobozok.some((d) => metszi(d, doboz))) {
        Yt = Y + 34;
        doboz = { x1: Xt - szeles, x2: Xt, y1: Yt - 12, y2: Yt + 3 };
      }
    }
    feliratDobozok.push(doboz);
    elemek.push(
      <g key={kulcs}>
        <KoncentraltNyomatek x={X} y={Y} r={17} irany={Mz > 0 ? 1 : -1} />
        <text x={Xt} y={Yt} textAnchor={anchor} fontSize="12.5" fontWeight="650" style={{ fill: SZIN.nyomatek, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
          {szoveg}
        </text>
      </g>,
    );
  };

  const sorrend = (t) => (t.fajta === "csomopontiEro" || t.fajta === "pontTeher" ? 0 : 1);
  [...(modell.terhek ?? [])].map((t, i) => [t, i]).sort((a, b) => sorrend(a[0]) - sorrend(b[0])).forEach(([t, i]) => {
    if (t.fajta === "csomopontiEro") {
      const cs = csById(t.csomopont);
      if (!cs) return;
      const rud = m.rudak.find((r) => r.ia === cs.index || r.ib === cs.index);
      const a = rud ? (cs.x - rud.x1) * rud.cos + (cs.y - rud.y1) * rud.sin : 0;
      ero(`e${i}`, kx(cs.x), ky(cs.y), t.Fx ?? 0, t.Fy ?? 0, t.cimke, rud, a);
    } else if (t.fajta === "csomopontiNyomatek") {
      const cs = csById(t.csomopont);
      if (!cs) return;
      nyomatek(`n${i}`, kx(cs.x), ky(cs.y), t.M ?? 0, t.cimke);
    } else if (t.fajta === "pontTeher") {
      const rud = rudById(t.rud);
      if (!rud) return;
      const a = Math.min(rud.hossz, Math.max(0, t.a ?? 0));
      const e = iranyV(rud, t.irany ?? "y", t.szog);
      const F = t.F ?? 0;
      ero(`e${i}`, kx(rud.x1 + a * rud.cos), ky(rud.y1 + a * rud.sin), e[0] * F, e[1] * F, t.cimke, rud, a);
    } else if (t.fajta === "pontNyomatek") {
      const rud = rudById(t.rud);
      if (!rud) return;
      const a = Math.min(rud.hossz, Math.max(0, t.a ?? 0));
      nyomatek(`n${i}`, kx(rud.x1 + a * rud.cos), ky(rud.y1 + a * rud.sin), t.M ?? 0, t.cimke);
    }
  });
  return <g>{elemek}</g>;
}

/** Reakciónyilak (lila) a számított értékekkel; a befogási nyomaték félköríves nyíl. */
export function ReakciokRajz({ eredmeny, kx, ky, tizedes = 2, opacitas = 1 }) {
  const m = eredmeny.modell;
  return (
    <g opacity={opacitas}>
      {eredmeny.reakciok.map((re, i) => {
        const cs = m.csomopontok.find((c) => c.id === re.csomopont);
        const x = kx(cs.x), y = ky(cs.y);
        const fx = re.Fx ?? 0, fy = re.Fy ?? 0;
        const n = Math.hypot(fx, fy);
        const elemek = [];
        if (n > 1e-6) {
          const h = 40;
          const ex = (fx / n) * h, ey = (fy / n) * h;
          const fuggoleges = Math.abs(fx) < 1e-6;
          elemek.push(
            <g key="e">
              <line x1={x - ex} y1={y + ey} x2={x - ex * 0.06} y2={y + ey * 0.06} stroke={SZIN.reakcio} strokeWidth="2.6" markerEnd="url(#th-reakcio)" />
              <text x={fuggoleges ? x - 12 : x - ex * 1.2} y={fuggoleges ? y + ey * 0.62 + 4 : y + ey * 1.2 + 4} textAnchor={fuggoleges ? "end" : "middle"} fontSize="11.5" fontWeight="650"
                style={{ fill: SZIN.reakcio, paintOrder: "stroke", stroke: "white", strokeWidth: 3.5 }}>
                {sz(n, tizedes)}
              </text>
            </g>,
          );
        }
        if (re.M !== undefined && Math.abs(re.M) > 1e-6) {
          elemek.push(
            <g key="m">
              <KoncentraltNyomatek x={x} y={y} r={22} irany={re.M > 0 ? 1 : -1} szin={SZIN.reakcio} />
              <text x={x} y={y - 30} textAnchor="middle" fontSize="11.5" fontWeight="650" style={{ fill: SZIN.reakcio, paintOrder: "stroke", stroke: "white", strokeWidth: 3.5 }}>
                {sz(Math.abs(re.M), tizedes)} kNm
              </text>
            </g>,
          );
        }
        return <g key={i}>{elemek}</g>;
      })}
    </g>
  );
}

/** Vízszintes méretlánc a megadott x-ek (m) között. */
export function Meretlanc({ xs, y, kx, tizedes = 1 }) {
  const lista = [...new Set(xs.map((v) => Math.round(v * 1000) / 1000))].sort((a, b) => a - b);
  return (
    <g>
      {lista.slice(0, -1).map((x, i) => {
        const d = lista[i + 1] - x;
        if (d < 1e-6) return null;
        return <Meret key={i} x1={kx(x)} x2={kx(lista[i + 1])} y={y} cimke={sz(d, d % 1 ? tizedes : 0)} />;
      })}
      <text x={kx(lista[lista.length - 1]) + 9} y={y + 4} fontSize="11" style={{ fill: SZIN.meret }}>m</text>
    </g>
  );
}

export function MeretlancFugg({ ys, x, ky, tizedes = 1 }) {
  const lista = [...new Set(ys.map((v) => Math.round(v * 1000) / 1000))].sort((a, b) => a - b);
  return (
    <g>
      {lista.slice(0, -1).map((y, i) => {
        const d = lista[i + 1] - y;
        if (d < 1e-6) return null;
        return <MeretFugg key={i} x={x} y1={ky(lista[i + 1])} y2={ky(y)} cimke={`${sz(d, d % 1 ? tizedes : 0)} m`} />;
      })}
    </g>
  );
}

/**
 * A rúd pozitív oldala képernyő-egységvektorként (y lefelé): a kezdőponttól a végpont felé haladva a jobb oldal,
 * vízszintes rúdnál lefelé. Mindhárom ábra (N, V, M) pozitív értéke erre az oldalra kerül (tankönyv 8.3.2, 8.9. ábra).
 */
export function pozitivIrany(ig) {
  const c = Math.cos(ig.szogFok * FOK), s = Math.sin(ig.szogFok * FOK);
  const po = ig.pozitivOldal === 1 ? -1 : 1;
  return [po * s, po * c];
}

/** Egy rúd igénybevételi ábrájának útvonala a rúdra rajzolva (N, V, M egyaránt a rúd pozitív — az M-hez választott — oldalára). */
export function diagramUt(ig, jel, kx, ky, leptek, db = 28) {
  const c = Math.cos(ig.szogFok * FOK), s = Math.sin(ig.szogFok * FOK);
  const ir = pozitivIrany(ig);
  const pontok = mintak(ig, db).map((p) => {
    const mx = ig.kezdo[0] + p.x * c, my = ig.kezdo[1] + p.x * s;
    const e = p[jel] * leptek;
    return { x: kx(mx) + ir[0] * e, y: ky(my) + ir[1] * e, ax: kx(mx), ay: ky(my), ertek: p[jel], hatar: p.szakaszHatar };
  });
  const d = `M ${pontok[0].ax} ${pontok[0].ay} ` + pontok.map((p) => `L ${p.x} ${p.y}`).join(" ") + ` L ${pontok[pontok.length - 1].ax} ${pontok[pontok.length - 1].ay} Z`;
  const vonal = "M " + pontok.map((p) => `${p.x} ${p.y}`).join(" L ");
  return { d, vonal, pontok, ir };
}

/** Az ábra léptéke: a legnagyobb érték `px` képpont legyen. */
export function diagramLeptek(eredmeny, jel, px = 60) {
  let maxE = 0;
  for (const ig of eredmeny.igenybevetelek) maxE = Math.max(maxE, Math.abs(ig.szelso[jel].min), Math.abs(ig.szelso[jel].max));
  return maxE > 1e-9 ? px / maxE : 0;
}

/** Igénybevételi ábra a szerkezetre rajzolva, a szélsőértékek és a szakaszhatár-értékek feliratával. */
export function DiagramRajz({ eredmeny, jel, kx, ky, px = 60, feliratok = true, opacitas = 1, oldalJelek = true }) {
  const leptek = diagramLeptek(eredmeny, jel, px);
  if (leptek === 0) return null;
  const szin = DSZIN[jel];
  const volt = [];
  const igs = eredmeny.igenybevetelek;
  return (
    <g opacity={opacitas}>
      {/* a „+” és „−” oldal jele a rúd elejénél (tankönyv 8.9. ábra): az első rúdon és a szabad kezdetű rudakon (az előző rúd végéhez csatlakozó saroknál nem) */}
      {oldalJelek && igs.map((ig, i) => {
        const elozo = i > 0 ? igs[i - 1] : null;
        if (elozo && Math.hypot(elozo.veg[0] - ig.kezdo[0], elozo.veg[1] - ig.kezdo[1]) < 1e-6) return null;
        const c = Math.cos(ig.szogFok * FOK), s = Math.sin(ig.szogFok * FOK);
        const ir = pozitivIrany(ig);
        const hx = kx(ig.kezdo[0]) - c * 24, hy = ky(ig.kezdo[1]) + s * 24; // a támaszjel elé, a rúd kezdete előtt
        return (
          <g key={`oj${i}`} opacity="0.85">
            <text x={hx + ir[0] * 15} y={hy + ir[1] * 15 + 3.5} textAnchor="middle" fontSize="11" fontWeight="700" style={{ fill: szin, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>+</text>
            <text x={hx - ir[0] * 15} y={hy - ir[1] * 15 + 3.5} textAnchor="middle" fontSize="11" fontWeight="700" style={{ fill: "#64748b", paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>−</text>
          </g>
        );
      })}
      {igs.map((ig, i) => {
        const u = diagramUt(ig, jel, kx, ky, leptek);
        // feliratok: szakaszhatárok + belső szélsőérték
        const cimkek = [];
        if (feliratok) {
          const jelolt = [];
          for (const sz_ of ig.szakaszok) {
            jelolt.push({ x: sz_.x1, oldal: 1 });
            jelolt.push({ x: sz_.x2, oldal: -1 });
          }
          for (const h of ig.MszelsoHelyek ?? []) if (jel === "M" && h.x > 1e-6 && h.x < ig.hossz - 1e-6) jelolt.push({ x: h.x, oldal: 0 });
          const c = Math.cos(ig.szogFok * FOK), s = Math.sin(ig.szogFok * FOK);
          for (const j of jelolt) {
            const sz_ = ig.szakaszok.find((q) => (j.oldal >= 0 ? q.x1 <= j.x + 1e-9 && j.x < q.x2 - 1e-9 : q.x1 < j.x - 1e-9 && j.x <= q.x2 + 1e-9)) ?? ig.szakaszok[0];
            const ert = poli(sz_[jel], j.x);
            if (Math.abs(ert) < 1e-6) continue;
            const gx = ig.kezdo[0] + j.x * c, gy = ig.kezdo[1] + j.x * s;
            const kulcs = `${Math.round(gx * 100)}:${Math.round(gy * 100)}:${Math.round(ert * 100)}`;
            if (volt.includes(kulcs)) continue;
            volt.push(kulcs);
            const X = kx(ig.kezdo[0] + j.x * c) + u.ir[0] * ert * leptek;
            const Y = ky(ig.kezdo[1] + j.x * s) + u.ir[1] * ert * leptek;
            const kifele = u.ir[1] * ert; // pozitív: a felirat lefelé
            cimkek.push(
              <text key={kulcs} x={X + (Math.abs(u.ir[0]) > 0.5 ? u.ir[0] * ert * 0 + (u.ir[0] * ert > 0 ? 8 : -8) : 0)} y={Y + (Math.abs(u.ir[0]) > 0.5 ? 4 : kifele > 0 ? 14 : -7)}
                textAnchor={Math.abs(u.ir[0]) > 0.5 ? (u.ir[0] * ert > 0 ? "start" : "end") : "middle"} fontSize="11.5" fontWeight="700"
                style={{ fill: szin, paintOrder: "stroke", stroke: "white", strokeWidth: 3.5 }}>
                {sz(ert, Math.abs(ert * 100 - Math.round(ert * 100)) < 1e-6 && ert % 1 === 0 ? 0 : 2)}
              </text>,
            );
          }
        }
        return (
          <g key={i}>
            <path d={u.d} fill={szin} fillOpacity="0.16" stroke="none" />
            <path d={u.vonal} fill="none" stroke={szin} strokeWidth="2.2" strokeLinejoin="round" />
            {cimkek}
          </g>
        );
      })}
    </g>
  );
}


/** Keresztmetszet-jelölés: szaggatott vonal a rúdon át, betűjellel. */
export function MetszetJel({ ig, a, kx, ky, cimke, szin = "#334155" }) {
  const c = Math.cos(ig.szogFok * FOK), s = Math.sin(ig.szogFok * FOK);
  const X = kx(ig.kezdo[0] + a * c), Y = ky(ig.kezdo[1] + a * s);
  return (
    <g>
      <line x1={X - s * 20} y1={Y - c * 20} x2={X + s * 20} y2={Y + c * 20} stroke={szin} strokeWidth="1.6" strokeDasharray="4 3" />
      <circle cx={X} cy={Y} r="3.5" fill={szin} stroke="white" strokeWidth="1.5" />
      {cimke && (
        <text x={X - s * 20 + (Math.abs(s) < 0.5 ? 0 : s > 0 ? -6 : 6)} y={Y - c * 20 + (Math.abs(c) < 0.5 ? 4 : -6)} textAnchor={Math.abs(s) < 0.5 ? "middle" : s > 0 ? "end" : "start"} fontSize="12.5" fontWeight="700" fontStyle="italic"
          style={{ fill: szin, paintOrder: "stroke", stroke: "white", strokeWidth: 3.5 }}>
          {cimke}
        </text>
      )}
    </g>
  );
}

/**
 * Kész feladat-ábra keretben.
 *   modell     – a nyers modell (a terhek `cimke`-vel)
 *   eredmeny   – elemez(modell) eredménye
 *   cimkek     – { csomopontId: "A", … } betűjelek
 *   metszetek  – [{ rud, a, cimke }] keresztmetszet-jelek
 *   diagram    – "N" | "V" | "M" | null: az ábra a szerkezetre rajzolva
 *   reakciok   – true: a reakciónyilak is
 *   meretek    – true: méretlánc
 */
export default function FeladatRajz({ modell, eredmeny, cimkek = {}, metszetek = [], diagram = null, reakciok = false, meretek = true, cim, maxPX = 90, feliratok = true }) {
  if (!eredmeny?.ok) return null;
  const m = eredmeny.modell;
  const tobbSzint = m.csomopontok.some((c) => Math.abs(c.y - m.csomopontok[0].y) > 1e-9);
  const g = geometria(m, { SZ: 600, bal: 70, jobb: tobbSzint ? 90 : 60, fel: diagram ? 118 : 96, le: (meretek ? 96 : 60) + (diagram ? 40 : 0) + (reakciok ? 26 : 0), maxPX, MA: tobbSzint ? 420 : null });
  const { kx, ky } = g;
  const xs = m.csomopontok.map((c) => c.x);
  const ys = m.csomopontok.map((c) => c.y);
  for (const t of modell.terhek ?? []) {
    const rud = m.rudak.find((r) => r.id === String(t.rud));
    if (!rud) continue;
    if (t.fajta === "pontTeher" || t.fajta === "pontNyomatek") { xs.push(rud.x1 + (t.a ?? 0) * rud.cos); ys.push(rud.y1 + (t.a ?? 0) * rud.sin); }
    if (t.fajta === "megoszlo") {
      const a1 = t.a1 ?? 0, a2 = t.a2 ?? rud.hossz;
      xs.push(rud.x1 + a1 * rud.cos, rud.x1 + a2 * rud.cos);
      ys.push(rud.y1 + a1 * rud.sin, rud.y1 + a2 * rud.sin);
    }
  }
  for (const me of metszetek) {
    const ig = eredmeny.igenybevetelek.find((i) => i.rud === String(me.rud));
    if (!ig) continue;
    const c = Math.cos(ig.szogFok * FOK), s = Math.sin(ig.szogFok * FOK);
    xs.push(ig.kezdo[0] + me.a * c);
    ys.push(ig.kezdo[1] + me.a * s);
  }
  const alsoY = ky(Math.min(...ys)) + (m.tamaszok.length ? 62 : 24) + (diagram ? 36 : 0) + (reakciok ? 26 : 0);
  const magas = alsoY + (meretek ? 30 : 10);
  const jobbX = kx(Math.max(...xs)) + 46;
  return (
    <div className="racs-vilagos overflow-hidden rounded-xl border border-[color:var(--keret)] p-2">
      <svg viewBox={`0 0 600 ${Math.round(magas)}`} className="abra mx-auto h-auto w-full max-w-xl">
        <TartoHegyek />
        {diagram && <DiagramRajz eredmeny={eredmeny} jel={diagram} kx={kx} ky={ky} px={52} feliratok={feliratok} />}
        <SzerkezetRajz m={m} kx={kx} ky={ky} cimkek={cimkek} />
        <TerhekRajz modell={modell} m={m} kx={kx} ky={ky} kerulendok={metszetek} />
        {reakciok && <ReakciokRajz eredmeny={eredmeny} kx={kx} ky={ky} />}
        {metszetek.map((me, i) => {
          const ig = eredmeny.igenybevetelek.find((q) => q.rud === String(me.rud));
          return ig ? <MetszetJel key={i} ig={ig} a={me.a} kx={kx} ky={ky} cimke={me.cimke} /> : null;
        })}
        {meretek && <Meretlanc xs={xs} y={alsoY} kx={kx} />}
        {meretek && tobbSzint && <MeretlancFugg ys={ys} x={jobbX} ky={ky} />}
        {cim && (
          <text x={300} y={18} textAnchor="middle" fontSize="12" fontWeight="600" style={{ fill: "#475569" }}>{cim}</text>
        )}
      </svg>
    </div>
  );
}

/* ============================================================
   Vízszintes tartók: modell és szakaszolás (játék, alak-kvíz)
   ============================================================ */

/** Vízszintes tartó modellje: támaszok, hossz, belső csuklók és egyszerű terhek ({fajta:"F"|"p"|"M"}) → a számítómag modellje. */
export function vizszintesModell({ tamaszok, hossz, csuklok = [], terhek }) {
  // csomópontok a támaszoknál, csuklóknál és a végeken; a rudak a szomszédos csomópontok között
  const xs = [...new Set([0, hossz, ...tamaszok.map((t) => t.x), ...csuklok])].sort((a, b) => a - b);
  const csomopontok = xs.map((x, i) => ({ id: `n${i}`, x, y: 0 }));
  const rudak = [];
  for (let i = 0; i < xs.length - 1; i++) rudak.push({ id: `${i + 1}`, a: `n${i}`, b: `n${i + 1}`, csukloA: csuklok.includes(xs[i]) && i > 0 ? true : undefined });
  const csId = (x) => `n${xs.indexOf(x)}`;
  const tam = tamaszok.map((t) => (t.tipus === "gorgo" ? { csomopont: csId(t.x), tipus: "gorgo", szog: 90 } : { csomopont: csId(t.x), tipus: t.tipus }));
  const th = [];
  for (const t of terhek) {
    if (t.fajta === "F") {
      const i = rudak.findIndex((r, k) => t.x >= xs[k] - 1e-9 && t.x <= xs[k + 1] + 1e-9);
      th.push({ fajta: "pontTeher", rud: rudak[i].id, a: t.x - xs[i], F: -t.F, irany: "y", cimke: `${t.F} kN` });
    } else if (t.fajta === "M") {
      const i = rudak.findIndex((r, k) => t.x > xs[k] + 1e-9 && t.x < xs[k + 1] - 1e-9);
      if (i < 0) continue;
      th.push({ fajta: "pontNyomatek", rud: rudak[i].id, a: t.x - xs[i], M: t.M, cimke: `${Math.abs(t.M)} kNm` });
    } else if (t.fajta === "p") {
      // a megoszló teher rudanként
      rudak.forEach((r, k) => {
        const a1 = Math.max(t.x1, xs[k]), a2 = Math.min(t.x2, xs[k + 1]);
        if (a2 - a1 > 1e-9) th.push({ fajta: "megoszlo", rud: r.id, a1: a1 - xs[k], a2: a2 - xs[k], p1: -t.p, irany: "y", cimke: `${t.p} kN/m` });
      });
    }
  }
  return { csomopontok, rudak, tamaszok: tam, terhek: th, csuklok };
}

/**
 * Vízszintes tartó elemzése a játékhoz és az alak-kvízhez: a számítómag eredményéből a szakaszok
 * (globális x, polinomok, a megoszló teher q-ja, az M alakja) és a töréspontok (V és M bal/jobb érték,
 * ugrás, fogópontok), plusz a parabola-szakaszok belső szélsőértéke (V = 0) külön pontként.
 */
export function vizszintesElemzes(modell) {
  const e = elemez(modell);
  if (!e.ok) return null;
  const m = e.modell;
  const hossz = Math.max(...m.csomopontok.map((c) => c.x));
  // szakaszok globális x-szel
  const szakaszok = [];
  for (const ig of e.igenybevetelek) {
    const rud = m.rudak.find((r) => r.id === ig.rud);
    for (const s of ig.szakaszok) {
      // a megoszló teher intenzitása a szakaszon (lokális y, negatív = lefelé)
      let q = 0;
      for (const mg of rud.megoszlok) if (mg.a1 <= s.x1 + 1e-9 && mg.a2 >= s.x2 - 1e-9) q += mg.qy1;
      szakaszok.push({ x1: rud.x1 + s.x1, x2: rud.x1 + s.x2, V: s.V, M: s.M, N: s.N, lok: rud.x1, q, fokM: s.M.length - 1 });
    }
  }
  szakaszok.sort((a, b) => a.x1 - b.x1);
  const ert = (s, jel, x) => poli(s[jel], x - s.lok);
  const xs = [...new Set(szakaszok.flatMap((s) => [Math.round(s.x1 * 1000) / 1000, Math.round(s.x2 * 1000) / 1000]))].sort((a, b) => a - b);
  const torespontok = xs.map((x, i) => {
    const bal = szakaszok.find((s) => Math.abs(s.x2 - x) < 1e-6);
    const jobb = szakaszok.find((s) => Math.abs(s.x1 - x) < 1e-6);
    const p = { x };
    for (const jel of ["V", "M"]) {
      const b = bal ? ert(bal, jel, x) : null;
      const j = jobb ? ert(jobb, jel, x) : null;
      const ugras = b !== null && j !== null && Math.abs(b - j) > 1e-6;
      p[jel] = { bal: b, jobb: j, ugras, fogok: b === null ? ["jobb"] : j === null ? ["bal"] : ugras ? ["bal", "jobb"] : ["jobb"] };
    }
    return p;
  });
  // a helyes alak az M szakaszain; parabolánál a belső szélsőérték (V = 0) helyére külön M-fogópont
  szakaszok.forEach((s) => {
    const c2 = s.M[2] ?? 0;
    s.alakM = Math.abs(c2) < 1e-9 ? "egyenes" : c2 < 0 ? "U" : "A";
    s.hosszM = s.x2 - s.x1;
    s.szelsoX = null;
    if (s.alakM !== "egyenes" && Math.abs(s.V[1] ?? 0) > 1e-9) {
      const xv = -s.V[0] / s.V[1] + s.lok; // V(x) = 0 globális x-ben
      if (xv > s.x1 + 0.05 && xv < s.x2 - 0.05) s.szelsoX = Math.round(xv * 1000) / 1000;
    }
  });
  for (const s of szakaszok) {
    if (s.szelsoX === null) continue;
    const Mx = ert(s, "M", s.szelsoX);
    torespontok.push({ x: s.szelsoX, szelso: true, V: { bal: 0, jobb: 0, ugras: false, fogok: [] }, M: { bal: Mx, jobb: Mx, ugras: false, fogok: ["jobb"] } });
  }
  torespontok.sort((a, b) => a.x - b.x);
  szakaszok.forEach((s) => {
    s.iKezd = torespontok.findIndex((p) => !p.szelso && Math.abs(p.x - s.x1) < 1e-6);
    s.iVeg = torespontok.findIndex((p) => !p.szelso && Math.abs(p.x - s.x2) < 1e-6);
    s.iSzelso = s.szelsoX === null ? null : torespontok.findIndex((p) => p.szelso && Math.abs(p.x - s.szelsoX) < 1e-6);
  });
  let maxV = 0, maxM = 0;
  for (const ig of e.igenybevetelek) {
    maxV = Math.max(maxV, Math.abs(ig.szelso.V.min), Math.abs(ig.szelso.V.max));
    maxM = Math.max(maxM, Math.abs(ig.szelso.M.min), Math.abs(ig.szelso.M.max));
  }
  // minden fogópont-érték kerek (0,5-ös) legyen – a generálás ezt megpróbálja elérni
  const kerekE = torespontok.every((p) => ["V", "M"].every((jel) => p[jel].fogok.every((f) => Math.abs(p[jel][f] - kerekFel(p[jel][f])) < 1e-6)));
  const cimkek = {};
  [...m.tamaszok].sort((a, b) => m.csomopontok[a.ics].x - m.csomopontok[b.ics].x).forEach((t, i) => { cimkek[m.csomopontok[t.ics].id] = "ABC"[i]; });
  return { e, m, hossz, szakaszok, torespontok, cimkek, maxV: Math.max(maxV, 1), maxM: Math.max(maxM, 1), kerekE };
}

