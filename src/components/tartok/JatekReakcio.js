"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import JatekKeret from "@/components/ui/JatekKeret";
import { Csuszka } from "@/components/abrak/ErovektorBonto";
import { MB } from "@/components/ui/Keplet";
import { sz, szK } from "@/lib/szamok";
import { TartoHegyek, Tarto, Gorgo, Csuklo, TeherNyil, MegoszloTeher, Meret, TamaszCimke, SZIN } from "@/components/tartok/TartoElemek";

/*
 * „Tippeld meg a reakciókat”
 * Körönként egy véletlen kéttámaszú (néha konzolos) tartó egy-két teherrel.
 * A hallgató csúszkával vagy a reakciónyilak húzásával beállítja A_y-t és B-t
 * (az 5., haladó körben ferde erő is van, és A_x-et is kéri). Ellenőrzéskor a
 * tartó rugósan „reagál”: ha az összeg hibás, lesüllyed/felemelkedik, ha az arány
 * hibás, a nagyobb hiba felé billen; jó tippnél vízszintes marad és zölden felvillan.
 * Pont körönként: 100 − 200·(a relatív hibák átlaga), 0-nál levágva; a végén átlag.
 */

const OSSZ_KOR = 5;
const SZ = 640;
const MA = 400;
const CY = 190; // a tartó tengelye
const E = 2.8; // képpont / kN a reakciónyilakon
const YA = CY + 46; // a függőleges reakciónyilak hegye (a támasz alatt)
const YX = CY - 16; // az A_x nyíl vonala (a tartó fölött, az A csuklótól balra)
const LILA = "#7c3aed";
const ZOLD = "#15803d";
const BORDO = "#be123c";
const FOK = Math.PI / 180;

const egesz = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
const valaszt = (t) => t[Math.floor(Math.random() * t.length)];
const fel = (min, max) => egesz(Math.round(min * 2), Math.round(max * 2)) / 2;
const felre = (v) => Math.round(v * 2) / 2;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

function ujKor(halado) {
  for (let proba = 0; proba < 200; proba++) {
    const L = fel(4, 8);
    const c = halado ? 0 : valaszt([0, 0, 0, 1, 1.5, 2]);
    const teljes = L + c;
    const terhek = [];
    const n = halado ? 2 : valaszt([1, 2, 2]);
    for (let i = 0; i < n; i++) {
      const megoszlo = !halado && i === n - 1 && Math.random() < 0.35;
      if (megoszlo) {
        const x1 = fel(0, L - 1.5);
        const x2 = fel(x1 + 1, L);
        const p = egesz(2, 4);
        terhek.push({ tipus: "p", x1, x2, p, Q: p * (x2 - x1), xQ: (x1 + x2) / 2 });
      } else {
        const konzolon = c > 0 && Math.random() < 0.45;
        const x = konzolon ? fel(L + 0.5, teljes) : fel(halado ? 1.5 : 0.5, L - 0.5);
        const F = egesz(4, 16);
        let szog = -90;
        if (halado && i === 0) {
          const alfa = valaszt([30, 45, 60]);
          szog = Math.random() < 0.5 ? -alfa : -180 + alfa;
        }
        terhek.push({ tipus: "ero", x, F, szog, Fx: F * Math.cos(szog * FOK), Fy: F * Math.sin(szog * FOK) });
      }
    }
    // egymásra eső erők kerülése
    const xek = terhek.filter((t) => t.tipus === "ero").map((t) => t.x);
    if (new Set(xek).size !== xek.length) continue;
    const sumFy = terhek.reduce((s, t) => s + (t.tipus === "ero" ? t.Fy : -t.Q), 0);
    const sumFx = terhek.reduce((s, t) => s + (t.tipus === "ero" ? t.Fx : 0), 0);
    const MA_ = terhek.reduce((s, t) => s + (t.tipus === "ero" ? t.x * t.Fy : -t.xQ * t.Q), 0); // a terhek nyomatéka A-ra (↶ +)
    const B = -MA_ / L;
    const Ay = -sumFy - B;
    const Ax = -sumFx;
    const osszes = Math.abs(sumFy);
    if (osszes > 36) continue;
    const max = Math.max(10, Math.ceil(osszes / 5) * 5);
    const min = c > 0 ? -Math.max(5, Math.ceil(osszes / 10) * 5) : 0;
    const maxX = Math.max(5, Math.ceil(Math.abs(Ax) / 5) * 5 + 5);
    if (B < min || B > max || Ay < min || Ay > max) continue;
    return { L, c, teljes, terhek, Ay, B, Ax, min, max, maxX, halado, MA_, sumFy, sumFx };
  }
  return { L: 6, c: 0, teljes: 6, terhek: [{ tipus: "ero", x: 2, F: 12, szog: -90, Fx: 0, Fy: -12 }], Ay: 8, B: 4, Ax: 0, min: 0, max: 15, maxX: 5, halado, MA_: -24, sumFy: -12, sumFx: 0 };
}

const relHiba = (tipp, helyes) => Math.abs(tipp - helyes) / Math.max(Math.abs(helyes), 1);

/** Reakciónyíl: a hegye mindig a horgonyponton, a farka (fogópont) a nagyságtól függő helyen. Függőleges: pozitív = felfelé mutat, a farka lent. */
function ReakcioFugg({ x, v, szin, hegy, cimke, opacitas = 1, fogo, onPointerDown, bal = false }) {
  const farok = YA + v * E;
  const h = Math.abs(v) * E;
  return (
    <g opacity={opacitas}>
      {h > 2 && <line x1={x} y1={farok} x2={x} y2={YA + (v >= 0 ? 2 : -2)} stroke={szin} strokeWidth="3.6" strokeLinecap="round" markerEnd={`url(#${hegy})`} />}
      {cimke && (
        <text x={bal ? x - 10 : x + 10} y={v >= 0 ? farok + 4 : farok - 4} textAnchor={bal ? "end" : "start"} fontWeight="650" style={{ fontSize: 11.5, fill: szin, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
          {cimke}
        </text>
      )}
      {fogo && (
        <g style={{ cursor: "ns-resize", touchAction: "none" }} onPointerDown={onPointerDown}>
          <circle cx={x} cy={farok} r="18" fill="transparent" />
          <circle cx={x} cy={farok} r="7.5" fill="white" stroke={szin} strokeWidth="2.5" />
          <path d={`M ${x - 3} ${farok - 11} l 3 -4 l 3 4 M ${x - 3} ${farok + 11} l 3 4 l 3 -4`} fill="none" stroke={szin} strokeWidth="1.5" />
        </g>
      )}
    </g>
  );
}

/** Vízszintes reakciónyíl (A_x): a hegye a horgonyponton, pozitív = jobbra mutat, a farka balra. */
function ReakcioVizsz({ x, y = YX, v, szin, hegy, cimke, opacitas = 1, fogo, onPointerDown }) {
  const farok = x - v * E;
  const h = Math.abs(v) * E;
  return (
    <g opacity={opacitas}>
      {h > 2 && <line x1={farok} y1={y} x2={x + (v >= 0 ? -2 : 2)} y2={y} stroke={szin} strokeWidth="3.6" strokeLinecap="round" markerEnd={`url(#${hegy})`} />}
      {cimke && (
        <text x={Math.min(farok, x) - 4} y={y - 9} textAnchor="start" fontWeight="650" style={{ fontSize: 11.5, fill: szin, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
          {cimke}
        </text>
      )}
      {fogo && (
        <g style={{ cursor: "ew-resize", touchAction: "none" }} onPointerDown={onPointerDown}>
          <circle cx={farok} cy={y} r="18" fill="transparent" />
          <circle cx={farok} cy={y} r="7.5" fill="white" stroke={szin} strokeWidth="2.5" />
          <path d={`M ${farok - 11} ${y - 3} l -4 3 l 4 3 M ${farok + 11} ${y - 3} l 4 3 l -4 3`} fill="none" stroke={szin} strokeWidth="1.5" />
        </g>
      )}
    </g>
  );
}

export default function JatekReakcio() {
  const [kor, setKor] = useState(1);
  const [adat, setAdat] = useState(null);
  const [fazis, setFazis] = useState("allit"); // allit | ellenoriz | kesz
  const [tipp, setTipp] = useState({ ay: 0, b: 0, ax: 0 });
  const [pontok, setPontok] = useState([]);
  const [anim, setAnim] = useState({ dy: 0, th: 0, dx: 0, villan: 0 });
  const svgRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    setAdat(ujKor(false));
  }, []);

  // rugós „reagálás” ellenőrzéskor
  useEffect(() => {
    if (fazis !== "ellenoriz" || !adat) return undefined;
    const eA = tipp.ay - adat.Ay;
    const eB = tipp.b - adat.B;
    const eX = adat.halado ? tipp.ax - adat.Ax : 0;
    const hibak = [relHiba(tipp.ay, adat.Ay), relHiba(tipp.b, adat.B), ...(adat.halado ? [relHiba(tipp.ax, adat.Ax)] : [])];
    const jo = hibak.every((h) => h <= 0.05);
    const cel = jo
      ? { dy: 0, th: 0, dx: 0 }
      : { dy: -clamp((eA + eB) * 2.6, -44, 44), th: clamp((eB - eA) * 1.1, -13, 13), dx: clamp(eX * 3, -46, 46) };
    let s = { dy: 0, th: 0, dx: 0 };
    let v = { dy: 0, th: 0, dx: 0 };
    let utolso = null;
    let kezdet = null;
    const lep = (most) => {
      if (utolso == null) {
        utolso = most;
        kezdet = most;
      }
      const dt = Math.min(0.04, (most - utolso) / 1000);
      utolso = most;
      const k = 55;
      const cs = 4.2;
      for (const kulcs of ["dy", "th", "dx"]) {
        v[kulcs] += (-k * (s[kulcs] - cel[kulcs]) - cs * v[kulcs]) * dt;
        s[kulcs] += v[kulcs] * dt;
      }
      const t = (most - kezdet) / 1000;
      const villan = jo ? Math.max(0, 1 - t / 1.1) : 0;
      setAnim({ dy: s.dy, th: s.th, dx: s.dx, villan });
      const mozog = ["dy", "th", "dx"].some((kk) => Math.abs(s[kk] - cel[kk]) > 0.05 || Math.abs(v[kk]) > 0.05);
      if (mozog || (jo && t < 1.1)) rafRef.current = requestAnimationFrame(lep);
      else setAnim({ ...cel, villan: 0 });
    };
    rafRef.current = requestAnimationFrame(lep);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fazis]);

  const PXM = adat ? Math.min(58, 400 / adat.teljes) : 56;
  const OX = adat ? Math.max(110, (SZ - PXM * adat.teljes) / 2) : 110;
  const kx = (x) => OX + x * PXM;

  /** Fogópont húzása: id = "ay" | "b" | "ax". */
  const huzas = (id) => (e) => {
    if (fazis !== "allit" || !adat) return;
    e.preventDefault();
    e.stopPropagation();
    const svg = svgRef.current;
    if (!svg) return;
    const mozgat = (esem) => {
      const r = svg.getBoundingClientRect();
      const px = ((esem.clientX - r.left) / r.width) * SZ;
      const py = ((esem.clientY - r.top) / r.height) * MA;
      // a tartó eltolását/forgását itt nem kell figyelembe venni: a beállítás közben a tartó nyugalomban van
      if (id === "ax") {
        const v = clamp(felre((kx(0) - 10 - px) / E), -adat.maxX, adat.maxX);
        setTipp((t) => ({ ...t, ax: v }));
      } else {
        const v = clamp(felre((py - YA) / E), adat.min, adat.max);
        setTipp((t) => ({ ...t, [id]: v }));
      }
    };
    mozgat(e);
    const vege = () => {
      window.removeEventListener("pointermove", mozgat);
      window.removeEventListener("pointerup", vege);
      window.removeEventListener("pointercancel", vege);
    };
    window.addEventListener("pointermove", mozgat);
    window.addEventListener("pointerup", vege);
    window.addEventListener("pointercancel", vege);
  };

  const ellenoriz = () => {
    if (!adat || fazis !== "allit") return;
    const hibak = [relHiba(tipp.ay, adat.Ay), relHiba(tipp.b, adat.B), ...(adat.halado ? [relHiba(tipp.ax, adat.Ax)] : [])];
    const atlag = hibak.reduce((s, h) => s + h, 0) / hibak.length;
    const pont = Math.max(0, Math.round(100 - 200 * atlag));
    setPontok((p) => [...p, pont]);
    setAnim({ dy: 0, th: 0, dx: 0, villan: 0 });
    setFazis("ellenoriz");
  };

  const kovetkezo = () => {
    if (kor >= OSSZ_KOR) {
      setFazis("kesz");
      return;
    }
    const uj = kor + 1;
    setKor(uj);
    setAdat(ujKor(uj === OSSZ_KOR));
    setTipp({ ay: 0, b: 0, ax: 0 });
    setAnim({ dy: 0, th: 0, dx: 0, villan: 0 });
    setFazis("allit");
  };

  const ujJatek = useCallback(() => {
    setKor(1);
    setPontok([]);
    setTipp({ ay: 0, b: 0, ax: 0 });
    setAnim({ dy: 0, th: 0, dx: 0, villan: 0 });
    setAdat(ujKor(false));
    setFazis("allit");
  }, []);

  const atlag = pontok.length ? pontok.reduce((s, p) => s + p, 0) / pontok.length : 0;
  const kesz = fazis === "kesz";
  const ellenorizve = fazis === "ellenoriz" || kesz;
  const utolsoPont = pontok[pontok.length - 1];
  const hibak = adat ? [relHiba(tipp.ay, adat.Ay), relHiba(tipp.b, adat.B), ...(adat.halado ? [relHiba(tipp.ax, adat.Ax)] : [])] : [];
  const jo = ellenorizve && hibak.every((h) => h <= 0.05);
  const osszegHiba = adat ? tipp.ay + tipp.b - adat.Ay - adat.B : 0;

  let uzenet = null;
  if (adat && fazis === "allit") {
    uzenet = adat.halado ? (
      <>
        <strong>Haladó kör:</strong> ferde erő is van. Állítsd be <strong>A_x</strong>-et, <strong>A_y</strong>-t és <strong>B</strong>-t (a csúszkákkal vagy a lila nyilak fogópontját húzva), aztán ellenőrizd — a tartó
        elárulja, mennyire találtad el.
      </>
    ) : (
      <>
        Állítsd be a két függőleges reakciót, <strong>A_y</strong>-t és <strong>B</strong>-t (csúszkával, vagy a lila nyilak fogópontját húzva; a nyíl hossza a skála szerint követi az értéket), aztán ellenőrizd.{" "}
        {adat.c > 0 ? "Vigyázz, konzol is van — B akár negatív is lehet." : "Tipp: a teherhez közelebbi támasz kap többet."}
      </>
    );
  } else if (adat && ellenorizve) {
    const tagok = adat.terhek.map((t) => {
      const kar = t.tipus === "ero" ? t.x : t.xQ;
      const Fy = t.tipus === "ero" ? t.Fy : -t.Q;
      const v = kar * Fy;
      return `${v < 0 ? "-" : "+"} ${szK(kar, 1)}\\cdot ${szK(Math.abs(Fy), 2)}`;
    });
    uzenet = (
      <div>
        <p>
          {jo ? "Egyensúly — a tartó vízszintes marad. " : Math.abs(osszegHiba) > 0.05 * Math.max(1, Math.abs(adat.Ay + adat.B)) ? (osszegHiba > 0 ? "Túl sok reakció: a tartó felemelkedik. " : "Túl kevés reakció: a tartó lesüllyed. ") : "Az összeg jó, de az arány nem: a tartó a nagyobb hiba felé billen. "}
          <span className="szamok">
            {utolsoPont} pont — helyesen <strong>A_y = {sz(adat.Ay, 2)}</strong>, <strong>B = {sz(adat.B, 2)}</strong>
            {adat.halado ? (
              <>
                , <strong>A_x = {sz(adat.Ax, 2)}</strong>
              </>
            ) : null}{" "}
            kN; a tipped {sz(tipp.ay, 1)}, {sz(tipp.b, 1)}
            {adat.halado ? `, ${sz(tipp.ax, 1)}` : ""} kN.
          </span>
        </p>
        <div className="szamok mt-1 text-[13px]">
          <MB>{`\\Mp{A} ${tagok.join(" ")} + ${szK(adat.L, 1)}\\cdot B = 0 \\;\\Rightarrow\\; B = ${szK(adat.B, 2)}\\ \\text{kN}`}</MB>
          <MB>{`\\Fy A_y + ${szK(adat.B, 2)} ${adat.sumFy < 0 ? "-" : "+"} ${szK(Math.abs(adat.sumFy), 2)} = 0 \\;\\Rightarrow\\; A_y = ${szK(adat.Ay, 2)}\\ \\text{kN}`}</MB>
          {adat.halado && <MB>{`\\Fx A_x ${adat.sumFx < 0 ? "-" : "+"} ${szK(Math.abs(adat.sumFx), 2)} = 0 \\;\\Rightarrow\\; A_x = ${szK(adat.Ax, 2)}\\ \\text{kN}`}</MB>}
        </div>
      </div>
    );
  }

  const tartoSzin = ellenorizve ? (jo ? ZOLD : BORDO) : LILA;
  const tartoHegy = ellenorizve ? (jo ? "jr-zold" : "jr-piros") : "jr-lila";
  const forgasKozep = adat ? kx(adat.L / 2) : SZ / 2;

  return (
    <JatekKeret
      cim="Tippeld meg a reakciókat"
      leiras="Kéttámaszú tartó, egy-két teher. Becsüld meg a támaszerőket, aztán nézd, mit csinál a tartó: ha az összeg rossz, süllyed vagy emelkedik; ha az arány rossz, billen. Az 5. kör haladó: ferde erő és A_x is."
      pont={atlag}
      kor={kor}
      osszKor={OSSZ_KOR}
      kesz={kesz}
      onUj={ujJatek}
      uzenet={uzenet}
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_230px]">
        <div className="racs-vilagos min-w-0 overflow-hidden rounded-xl border border-[color:var(--keret)]">
          <svg ref={svgRef} viewBox={`0 0 ${SZ} ${MA}`} className="abra h-auto w-full touch-none select-none">
            <TartoHegyek />
            <defs>
              {[
                ["jr-lila", LILA],
                ["jr-zold", ZOLD],
                ["jr-piros", BORDO],
              ].map(([id, szin]) => (
                <marker key={id} id={id} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
                  <path d="M 0 1 L 9 5 L 0 9 z" fill={szin} />
                </marker>
              ))}
            </defs>

            {/* zöld felvillanás */}
            {anim.villan > 0 && <rect x="0" y="0" width={SZ} height={MA} fill="#86efac" opacity={anim.villan * 0.35} />}

            {/* skála */}
            <g>
              <line x1="24" y1={MA - 22} x2={24 + 10 * E} y2={MA - 22} stroke={LILA} strokeWidth="3" strokeLinecap="round" />
              <line x1="24" y1={MA - 28} x2="24" y2={MA - 16} stroke={LILA} strokeWidth="1.2" />
              <line x1={24 + 10 * E} y1={MA - 28} x2={24 + 10 * E} y2={MA - 16} stroke={LILA} strokeWidth="1.2" />
              <text x={24 + 10 * E + 8} y={MA - 18} style={{ fontSize: 11, fill: LILA }}>
                10 kN (reakciólépték)
              </text>
            </g>

            {adat && (
              <>
                {/* támaszok — nem mozognak */}
                <Csuklo x={kx(0)} y={CY} />
                <Gorgo x={kx(adat.L)} y={CY} />
                <TamaszCimke x={kx(0) - 28} y={CY + 36}>
                  A
                </TamaszCimke>
                <TamaszCimke x={kx(adat.L) + 28} y={CY + 36}>
                  B
                </TamaszCimke>
                {/* méretlánc a jellegzetes pontok között, a rajz alján */}
                {(() => {
                  const xs = [...new Set([0, adat.L, adat.teljes, ...adat.terhek.flatMap((t) => (t.tipus === "ero" ? [t.x] : [t.x1, t.x2]))])].sort((a, b) => a - b);
                  return xs.slice(0, -1).map((x, i) => <Meret key={i} x1={kx(x)} x2={kx(xs[i + 1])} y={MA - 46} cimke={sz(xs[i + 1] - x, 1)} opacitas={0.9} />);
                })()}
                <text x={kx(adat.teljes) + 10} y={MA - 42} style={{ fontSize: 11, fill: SZIN.meret }}>
                  m
                </text>

                {/* a tartó a terhekkel és a reakciókkal — ez mozog */}
                <g transform={`translate(${anim.dx} ${anim.dy}) rotate(${-anim.th} ${forgasKozep} ${CY})`}>
                  <Tarto x1={kx(0) - 6} y1={CY} x2={kx(adat.teljes) + 6} y2={CY} szin={ellenorizve && jo ? ZOLD : SZIN.tarto} />
                  {adat.terhek.map((t, i) =>
                    t.tipus === "ero" ? (
                      <TeherNyil
                        key={i}
                        x={kx(t.x)}
                        y={CY - 3}
                        hossz={t.szog === -90 ? 52 + 2.4 * t.F + (adat.halado ? 24 : 0) + (i % 2) * 26 : 40 + 2.4 * t.F}
                        szog={t.szog}
                        cimke={`F${adat.terhek.length > 1 ? "₁₂"[i] : ""} = ${t.F} kN${t.szog !== -90 ? ` (${Math.abs(t.szog) <= 90 ? Math.abs(t.szog) : 180 - Math.abs(t.szog)}°)` : ""}`}
                        cimkeEltolas={t.szog === -90 ? [6, -4] : [8, -8]}
                      />
                    ) : (
                      <g key={i}>
                        <MegoszloTeher x1={kx(t.x1)} x2={kx(t.x2)} y={CY - 3} p1={t.p} leptek={6} />
                        <text x={(kx(t.x1) + kx(t.x2)) / 2} y={CY - 3 - t.p * 6 - 8} textAnchor="middle" fontWeight="650" style={{ fontSize: 12, fill: SZIN.teher, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
                          p = {t.p} kN/m
                        </text>
                      </g>
                    ),
                  )}

                  {/* a helyes reakciók halványan, ellenőrzés után */}
                  {ellenorizve && !jo && (
                    <>
                      <ReakcioFugg x={kx(0) - 16} v={adat.Ay} szin={ZOLD} hegy="jr-zold" cimke={`helyes: ${sz(adat.Ay, 1)}`} opacitas={0.6} bal />
                      <ReakcioFugg x={kx(adat.L) - 16} v={adat.B} szin={ZOLD} hegy="jr-zold" cimke={`helyes: ${sz(adat.B, 1)}`} opacitas={0.6} bal />
                      {adat.halado && <ReakcioVizsz x={kx(0) - 10} y={CY - 44} v={adat.Ax} szin={ZOLD} hegy="jr-zold" cimke={`helyes: ${sz(adat.Ax, 1)}`} opacitas={0.6} />}
                    </>
                  )}

                  {/* a hallgató reakciói */}
                  <ReakcioFugg x={kx(0)} v={tipp.ay} szin={tartoSzin} hegy={tartoHegy} cimke={`A_y = ${sz(tipp.ay, 1)} kN`} fogo={fazis === "allit"} onPointerDown={huzas("ay")} />
                  <ReakcioFugg x={kx(adat.L)} v={tipp.b} szin={tartoSzin} hegy={tartoHegy} cimke={`B = ${sz(tipp.b, 1)} kN`} fogo={fazis === "allit"} onPointerDown={huzas("b")} />
                  {adat.halado && <ReakcioVizsz x={kx(0) - 10} v={tipp.ax} szin={tartoSzin} hegy={tartoHegy} cimke={`A_x = ${sz(tipp.ax, 1)} kN`} fogo={fazis === "allit"} onPointerDown={huzas("ax")} />}
                </g>
              </>
            )}

            {ellenorizve && adat && (
              <text x={SZ / 2} y={28} textAnchor="middle" fontWeight="700" style={{ fontSize: 13, fill: jo ? ZOLD : BORDO, paintOrder: "stroke", stroke: "white", strokeWidth: 3.5 }}>
                {jo ? "Egyensúly ✓" : `ΣF_y hiba: ${sz(osszegHiba, 1)} kN · billenés: ${sz(tipp.b - adat.B - (tipp.ay - adat.Ay), 1)} kN ✗`}
              </text>
            )}
          </svg>
        </div>

        <div className="min-w-0 space-y-3">
          {adat && (
            <>
              {adat.halado && (
                <Csuszka cimke="A_x (jobbra +)" ertek={tipp.ax} egyseg="kN" min={-adat.maxX} max={adat.maxX} lepes={0.5} tizedes={1} onChange={(v) => fazis === "allit" && setTipp((t) => ({ ...t, ax: v }))} />
              )}
              <Csuszka cimke="A_y (felfelé +)" ertek={tipp.ay} egyseg="kN" min={adat.min} max={adat.max} lepes={0.5} tizedes={1} onChange={(v) => fazis === "allit" && setTipp((t) => ({ ...t, ay: v }))} />
              <Csuszka cimke="B (felfelé +)" ertek={tipp.b} egyseg="kN" min={adat.min} max={adat.max} lepes={0.5} tizedes={1} onChange={(v) => fazis === "allit" && setTipp((t) => ({ ...t, b: v }))} />
              <p className="szamok text-[12px] text-petrol-500">
                A terhek összege: {sz(Math.abs(adat.sumFy), 1)} kN lefelé{adat.halado ? `, ${sz(Math.abs(adat.sumFx), 1)} kN vízszintesen` : ""}.
              </p>
            </>
          )}
          <div className="flex flex-wrap items-center gap-2">
            {fazis === "allit" && (
              <button type="button" onClick={ellenoriz} className="rounded-lg bg-naracs-500 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-naracs-600">
                Ellenőrzés
              </button>
            )}
            {fazis === "ellenoriz" && (
              <button type="button" onClick={kovetkezo} className="rounded-lg bg-petrol-800 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-petrol-900">
                {kor >= OSSZ_KOR ? "Eredmény" : "Következő kör →"}
              </button>
            )}
          </div>
          {pontok.length > 0 && <p className="szamok text-[12px] text-petrol-500">eddigi körök pontjai: {pontok.join(" · ")}</p>}
        </div>
      </div>
    </JatekKeret>
  );
}
