"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import JatekKeret from "@/components/ui/JatekKeret";
import SulypontTablazat from "./SulypontTablazat";
import { sz } from "@/lib/szamok";

/*
 * „Súlypont-találó” – játék.
 * Körönként egy véletlen összetett síkidom (2–3 téglalap L/T/U/lépcső alakban,
 * néha kör alakú lyukkal vagy félkörrel) jelenik meg méretekkel. A hallgató
 * odakoppint, ahol a súlypontot sejti (célkereszt, húzással finomítható).
 * Ellenőrzéskor megjelenik a valódi S, a hiba mm-ben és a befoglaló átló
 * %-ában, és az idom „ráül egy tűre” a tippelt pontban: jó tippnél
 * egyensúlyban marad (kis lengés), rossznál a súlypont felé billen (csillapított
 * lengés, max 25°). Pont: 100·(1 − x)^0,8, x = hiba / az átló 15 %-a (2 % ≈ 89,
 * 15 % → 0); 5 kör átlaga. A végén táblázat: „Mutasd a számítást”.
 *
 * Koordináták: az origó a befoglaló téglalap jobb felső sarka, y balra, z lefelé.
 */

const OSSZ_KOR = 5;
const SZ = 640;
const MA = 400;
const PI = Math.PI;
const NAR = "#e2590a";
const LILA = "#7c3aed";
const BORDO = "#be123c";
const ZOLD = "#15803d";
const IDOM = "#bcdce2";
const IDOM_KERET = "#234957";

const velKoz = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
const tiz = (min, max) => 10 * velKoz(Math.ceil(min / 10), Math.max(Math.ceil(min / 10), Math.floor(max / 10)));
const valaszt = (t) => t[Math.floor(Math.random() * t.length)];
const simit = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u));

/* ---------- idom-generátor ---------- */
/* rész: { tipus: "tegl", y0, z0, b, h } | { tipus: "kor", yc, zc, r } (lyuk, −) | { tipus: "felkor", yc, zc, r } (lefelé domború, +) */

function ujIdom() {
  const tipus = valaszt(["L", "L", "T", "T", "U", "lepcso", "lepcso", "lyuk", "lyuk", "felkor"]);
  const W = tiz(100, 200);
  const H = tiz(80, 180);
  const reszek = [];
  let nev;
  if (tipus === "L") {
    const t1 = tiz(20, Math.min(60, W / 2));
    const t2 = tiz(20, Math.min(60, H / 2));
    const jobb = Math.random() < 0.5;
    const lent = Math.random() < 0.5;
    reszek.push({ tipus: "tegl", y0: jobb ? 0 : W - t1, z0: 0, b: t1, h: H, nev: "álló szár" });
    reszek.push({ tipus: "tegl", y0: jobb ? t1 : 0, z0: lent ? H - t2 : 0, b: W - t1, h: t2, nev: "fekvő szár" });
    nev = "L-idom";
  } else if (tipus === "T") {
    const tf = tiz(20, Math.min(50, H / 3));
    const tw = tiz(20, Math.min(60, W / 3));
    const fent = Math.random() < 0.6;
    reszek.push({ tipus: "tegl", y0: 0, z0: fent ? 0 : H - tf, b: W, h: tf, nev: "öv" });
    reszek.push({ tipus: "tegl", y0: (W - tw) / 2, z0: fent ? tf : 0, b: tw, h: H - tf, nev: "gerinc" });
    nev = fent ? "T-idom" : "fordított T";
  } else if (tipus === "U") {
    const t = tiz(20, Math.min(40, W / 4, H / 3));
    const lent = Math.random() < 0.5;
    reszek.push({ tipus: "tegl", y0: 0, z0: lent ? H - t : 0, b: W, h: t, nev: "talp" });
    reszek.push({ tipus: "tegl", y0: 0, z0: lent ? 0 : t, b: t, h: H - t, nev: "jobb szár" });
    reszek.push({ tipus: "tegl", y0: W - t, z0: lent ? 0 : t, b: t, h: H - t, nev: "bal szár" });
    nev = "U-idom";
  } else if (tipus === "lepcso") {
    const db = valaszt([2, 3]);
    const jobb = Math.random() < 0.5;
    let z = 0;
    const hs = [];
    for (let i = 0; i < db; i++) hs.push(tiz(20, 60));
    const Hs = hs.reduce((s, v) => s + v, 0);
    const szel = [W];
    for (let i = 1; i < db; i++) szel.push(tiz(30, Math.max(30, szel[i - 1] - 20)));
    for (let i = 0; i < db; i++) {
      reszek.push({ tipus: "tegl", y0: jobb ? 0 : W - szel[i], z0: z, b: szel[i], h: hs[i], nev: `${i + 1}. fok` });
      z += hs[i];
    }
    nev = "lépcsős idom";
    return befejez(reszek, W, Hs, nev);
  } else if (tipus === "lyuk") {
    const r = tiz(10, Math.min(40, W / 5, H / 5));
    const yc = tiz(r + 10, W - r - 10);
    const zc = tiz(r + 10, H - r - 10);
    reszek.push({ tipus: "tegl", y0: 0, z0: 0, b: W, h: H, nev: "lemez" });
    reszek.push({ tipus: "kor", yc, zc, r, nev: "lyuk" });
    nev = "lemez kör alakú lyukkal";
  } else {
    const Wf = tiz(80, 140);
    const Hf = tiz(40, 100);
    reszek.push({ tipus: "tegl", y0: 0, z0: 0, b: Wf, h: Hf, nev: "téglalap" });
    reszek.push({ tipus: "felkor", yc: Wf / 2, zc: Hf, r: Wf / 2, nev: "félkör" });
    nev = "téglalap félkörrel";
    return befejez(reszek, Wf, Hf + Wf / 2, nev);
  }
  return befejez(reszek, W, H, nev);
}

/** Részenkénti terület és súlypont, összegzés, befoglaló méret. */
function befejez(reszek, W, H, nev) {
  const sorok = reszek.map((r) => {
    if (r.tipus === "tegl") return { nev: r.nev, A: r.b * r.h, y: r.y0 + r.b / 2, z: r.z0 + r.h / 2 };
    if (r.tipus === "kor") return { nev: r.nev, A: -(r.r * r.r * PI), y: r.yc, z: r.zc };
    return { nev: r.nev, A: (r.r * r.r * PI) / 2, y: r.yc, z: r.zc + (4 * r.r) / (3 * PI) };
  });
  const A = sorok.reduce((s, r) => s + r.A, 0);
  const ys = sorok.reduce((s, r) => s + r.A * r.y, 0) / A;
  const zs = sorok.reduce((s, r) => s + r.A * r.z, 0) / A;
  return { reszek, sorok, W, H, nev, A, ys, zs, atlo: Math.hypot(W, H) };
}

/** Egyedi töréspontok a láncméretekhez. */
function torespontok(reszek, irany) {
  const s = new Set();
  reszek.forEach((r) => {
    if (r.tipus === "tegl") {
      if (irany === "y") s.add(r.y0).add(r.y0 + r.b);
      else s.add(r.z0).add(r.z0 + r.h);
    } else if (r.tipus === "kor") {
      s.add(irany === "y" ? r.yc : r.zc);
    } else {
      s.add(irany === "y" ? r.yc : r.zc + r.r);
    }
  });
  return [...s].sort((a, b) => a - b);
}

function Hegy({ id, szin }) {
  return (
    <marker id={id} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 9 5 L 0 9 z" fill={szin} />
    </marker>
  );
}

export default function JatekSulypont() {
  const [kor, setKor] = useState(1);
  const [adat, setAdat] = useState(null);
  const [fazis, setFazis] = useState("tipp"); // tipp | ellenoriz | kesz
  const [tipp, setTipp] = useState(null); // {y, z} mm
  const [pontok, setPontok] = useState([]);
  const [anim, setAnim] = useState({ u: 0, szog: 0 });
  const [huzasban, setHuzasban] = useState(false);
  const [mutatSzamitas, setMutatSzamitas] = useState(false);
  const svgRef = useRef(null);
  const rafRef = useRef(null);

  const inditKor = useCallback((a) => {
    setAdat(a);
    setTipp(null);
    setAnim({ u: 0, szog: 0 });
    setMutatSzamitas(false);
    setFazis("tipp");
  }, []);

  useEffect(() => {
    inditKor(ujIdom());
  }, [inditKor]);

  // a „tűre ülés” animációja (csillapított lengés)
  useEffect(() => {
    if (fazis !== "ellenoriz" || !adat || !tipp) return undefined;
    const d = Math.hypot(tipp.y - adat.ys, tipp.z - adat.zs);
    const dx = tipp.y - adat.ys; // > 0: S a képen jobbra van a tipptől → az óramutató szerint billen
    const nagysag = 25 * Math.min(1, d / (0.15 * adat.atlo));
    const vizszintes = Math.min(1, Math.abs(dx) / (0.03 * adat.atlo));
    const celSzog = Math.sign(dx || 1) * nagysag * vizszintes;
    const kisLenges = 3.5 * Math.sign(dx || 1) * (1 - Math.min(1, d / (0.05 * adat.atlo)));
    const lambda = 2.4;
    const omega = 6.5;
    let kezdet = null;
    const lep = (most) => {
      if (kezdet == null) kezdet = most;
      const t = (most - kezdet) / 1000;
      const e = Math.exp(-lambda * t);
      const lepcso = 1 - e * (Math.cos(omega * t) + (lambda / omega) * Math.sin(omega * t));
      const szog = celSzog * lepcso + kisLenges * e * Math.sin(omega * t);
      setAnim({ u: simit(Math.min(1, t / 0.9)), szog });
      if (t < 3) rafRef.current = requestAnimationFrame(lep);
      else setAnim({ u: 1, szog: celSzog });
    };
    rafRef.current = requestAnimationFrame(lep);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [fazis, adat, tipp]);

  if (!adat) return null;

  // lépték és elhelyezés
  const m = Math.min(440 / adat.W, 262 / adat.H);
  const bal = 46;
  const teto = 40;
  const ox = bal + adat.W * m; // az origó (jobb felső sarok) képpont-x
  const oy = teto;
  const X = (y) => ox - y * m;
  const Y = (z) => oy + z * m;
  const also = Y(adat.H);

  const huzas = (e) => {
    if (fazis !== "tipp") return;
    e.preventDefault();
    const svg = svgRef.current;
    if (!svg) return;
    setHuzasban(true);
    const mozgat = (esem) => {
      // képernyő → viewBox: a CTM inverze pontos akkor is, ha az SVG doboza nem a viewBox arányú
      const ctm = svg.getScreenCTM();
      let px, py;
      if (ctm) {
        const pt = new DOMPoint(esem.clientX, esem.clientY).matrixTransform(ctm.inverse());
        px = pt.x;
        py = pt.y;
      } else {
        const r = svg.getBoundingClientRect();
        px = ((esem.clientX - r.left) / r.width) * SZ;
        py = ((esem.clientY - r.top) / r.height) * MA;
      }
      const y = Math.max(-20, Math.min(adat.W + 20, (ox - px) / m));
      const z = Math.max(-20, Math.min(adat.H + 20, (py - oy) / m));
      setTipp({ y: Math.round(y * 2) / 2, z: Math.round(z * 2) / 2 });
    };
    mozgat(e);
    const vege = () => {
      setHuzasban(false);
      window.removeEventListener("pointermove", mozgat);
      window.removeEventListener("pointerup", vege);
    };
    window.addEventListener("pointermove", mozgat);
    window.addEventListener("pointerup", vege);
  };

  const hiba = tipp ? Math.hypot(tipp.y - adat.ys, tipp.z - adat.zs) : 0;
  const hibaSzazalek = (hiba / adat.atlo) * 100;

  const ellenoriz = () => {
    if (fazis !== "tipp" || !tipp) return;
    // 100·(1 − x)^0,8, ahol x = hiba / (az átló 15 %-a): 2 % hiba ≈ 89 pont, 5 % ≈ 72, 10 % ≈ 42, 15 % → 0
    const x = Math.min(1, hiba / (0.15 * adat.atlo));
    const p = 100 * Math.pow(1 - x, 0.8);
    setPontok((ps) => [...ps, Math.round(p)]);
    setFazis("ellenoriz");
  };

  const kovetkezo = () => {
    if (kor >= OSSZ_KOR) {
      setFazis("kesz");
      return;
    }
    setKor((c) => c + 1);
    inditKor(ujIdom());
  };

  const ujJatek = () => {
    setKor(1);
    setPontok([]);
    inditKor(ujIdom());
  };

  const atlag = pontok.length ? pontok.reduce((s, p) => s + p, 0) / pontok.length : 0;
  const kesz = fazis === "kesz";
  const ellenorizve = fazis === "ellenoriz" || kesz;
  const utolsoPont = pontok[pontok.length - 1];

  const tx = tipp ? X(tipp.y) : 0;
  const ty = tipp ? Y(tipp.z) : 0;
  const forgatas = ellenorizve && tipp ? `rotate(${anim.szog} ${tx} ${ty})` : undefined;

  // láncméretek
  const yPontok = torespontok(adat.reszek, "y");
  const zPontok = torespontok(adat.reszek, "z");
  const lancY = also + 24;
  const lancX = X(0) + 26;

  let uzenet = null;
  if (fazis === "tipp") {
    uzenet = (
      <>
        <strong>{adat.nev}</strong>, méretek mm-ben. Koppints oda, ahol a súlypontot sejted — a célkereszt húzással finomítható. Gondolj a „nehezebb” részekre: arra húz a súlypont.
      </>
    );
  } else if (ellenorizve && tipp) {
    uzenet = (
      <div>
        <p className="szamok">
          <strong>{utolsoPont} pont.</strong> {sz(hiba, 1)} mm-t tévedtél — ez a befoglaló átló {sz(hibaSzazalek, 1)} %-a.
          {" "}Helyes: <strong>yₛ = {sz(adat.ys, 2)} mm</strong>, <strong>zₛ = {sz(adat.zs, 2)} mm</strong> (a jobb felső saroktól balra, ill. lefelé); a tipped ({sz(tipp.y, 1)}; {sz(tipp.z, 1)}).
          {" "}{utolsoPont >= 85 ? "A tűn egyensúlyban marad — ez már mérnöki szem." : utolsoPont >= 50 ? "Közel — nézd, merre billen: arra van a súlypont." : "A tű körül elbillen a súlypont felé — számold ki, hol kellett volna."}
        </p>
        <button type="button" onClick={() => setMutatSzamitas((v) => !v)} className="mt-2 rounded-lg bg-white px-3 py-1.5 text-[12.5px] font-medium text-petrol-700 ring-1 ring-petrol-200 transition hover:bg-petrol-50">
          {mutatSzamitas ? "Számítás elrejtése" : "Mutasd a számítást"}
        </button>
        {mutatSzamitas && (
          <div className="mt-2">
            <SulypontTablazat sorok={adat.sorok} egyseg="mm" tizedes={{ A: 1, k: 2, S: 0 }} kicsi />
            <p className="text-[12px] text-petrol-500">
              A tankönyv 9.5. táblázata: részenként Aᵢ, yᵢ, zᵢ, a szorzatok, az összegek, majd az osztás. A kivont rész (lyuk) területe és nyomatéka negatív.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <JatekKeret
      cim="Súlypont-találó"
      leiras="Egy összetett síkidom, egy kérdés: hol a súlypontja? Koppints oda szemre, aztán nézd meg, egyensúlyban marad-e a tűn. Tökéletes tipp 100 pont; az átló 15 %-ánál nagyobb hiba 0. Öt kör átlaga számít."
      pont={atlag}
      kor={kor}
      osszKor={OSSZ_KOR}
      kesz={kesz}
      onUj={ujJatek}
      uzenet={uzenet}
    >
      <div className="racs-vilagos overflow-hidden rounded-xl border border-[color:var(--keret)]">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SZ} ${MA}`}
          className="abra w-full touch-none select-none"
          style={{ cursor: fazis === "tipp" ? "crosshair" : "default" }}
          onPointerDown={huzas}
        >
          <defs>
            <Hegy id="js-sz" szin="#94a3b8" />
            <Hegy id="js-t" szin="#475569" />
            <pattern id="js-vonalka" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="6" stroke={BORDO} strokeWidth="1" opacity="0.5" />
            </pattern>
          </defs>

          {/* méretek – ellenőrzéskor elhalványulnak */}
          <g opacity={1 - 0.75 * anim.u} style={{ pointerEvents: "none" }}>
            {yPontok.slice(0, -1).map((y, i) => {
              const y2 = yPontok[i + 1];
              return (
                <g key={`y${i}`}>
                  <line x1={X(y)} y1={lancY} x2={X(y2)} y2={lancY} stroke="#94a3b8" strokeWidth="1" markerStart="url(#js-sz)" markerEnd="url(#js-sz)" />
                  <line x1={X(y)} y1={lancY - 5} x2={X(y)} y2={lancY + 5} stroke="#94a3b8" strokeWidth="1" />
                  <line x1={X(y2)} y1={lancY - 5} x2={X(y2)} y2={lancY + 5} stroke="#94a3b8" strokeWidth="1" />
                  <text x={X((y + y2) / 2)} y={lancY + 15} textAnchor="middle" fontSize="11" style={{ fill: "#475569", paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
                    {sz(y2 - y, 0)}
                  </text>
                </g>
              );
            })}
            {zPontok.slice(0, -1).map((z, i) => {
              const z2 = zPontok[i + 1];
              return (
                <g key={`z${i}`}>
                  <line x1={lancX} y1={Y(z)} x2={lancX} y2={Y(z2)} stroke="#94a3b8" strokeWidth="1" markerStart="url(#js-sz)" markerEnd="url(#js-sz)" />
                  <line x1={lancX - 5} y1={Y(z)} x2={lancX + 5} y2={Y(z)} stroke="#94a3b8" strokeWidth="1" />
                  <line x1={lancX - 5} y1={Y(z2)} x2={lancX + 5} y2={Y(z2)} stroke="#94a3b8" strokeWidth="1" />
                  <text x={lancX + 8} y={Y((z + z2) / 2) + 4} fontSize="11" style={{ fill: "#475569", paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
                    {sz(z2 - z, 0)}
                  </text>
                </g>
              );
            })}
            <text x={lancX + 8} y={lancY + 15} fontSize="10" style={{ fill: "#94a3b8" }}>mm</text>
          </g>

          {/* az idom – ellenőrzéskor a tipp pontja körül elfordul */}
          <g transform={forgatas} style={{ transition: "none", pointerEvents: "none" }}>
            {adat.reszek.map((r, i) => {
              if (r.tipus === "tegl") {
                return <rect key={i} x={X(r.y0 + r.b)} y={Y(r.z0)} width={r.b * m} height={r.h * m} fill={IDOM} stroke={IDOM_KERET} strokeWidth="1.4" />;
              }
              if (r.tipus === "felkor") {
                const R = r.r * m;
                return <path key={i} d={`M ${X(r.yc) + R} ${Y(r.zc)} A ${R} ${R} 0 0 1 ${X(r.yc) - R} ${Y(r.zc)} Z`} fill={IDOM} stroke={IDOM_KERET} strokeWidth="1.4" />;
              }
              return null;
            })}
            {adat.reszek.map((r, i) =>
              r.tipus === "kor" ? (
                <g key={`l${i}`}>
                  <circle cx={X(r.yc)} cy={Y(r.zc)} r={r.r * m} fill="white" />
                  <circle cx={X(r.yc)} cy={Y(r.zc)} r={r.r * m} fill="url(#js-vonalka)" stroke={BORDO} strokeWidth="1.2" strokeDasharray="4 3" />
                  <text x={X(r.yc)} y={Y(r.zc) + 4} textAnchor="middle" fontSize="11" fontWeight="650" style={{ fill: BORDO, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
                    Ø{sz(2 * r.r, 0)}
                  </text>
                </g>
              ) : r.tipus === "felkor" ? (
                <text key={`f${i}`} x={X(r.yc)} y={Y(r.zc) + r.r * m * 0.45} textAnchor="middle" fontSize="11" fontWeight="650" style={{ fill: "#1d3c48", paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
                  R = {sz(r.r, 0)}
                </text>
              ) : null,
            )}
            {/* a valódi súlypont – az idommal együtt fordul */}
            {ellenorizve && anim.u > 0.05 && (
              <g opacity={anim.u}>
                <line x1={X(adat.ys) - 10} y1={Y(adat.zs)} x2={X(adat.ys) + 10} y2={Y(adat.zs)} stroke={NAR} strokeWidth="1" />
                <line x1={X(adat.ys)} y1={Y(adat.zs) - 10} x2={X(adat.ys)} y2={Y(adat.zs) + 10} stroke={NAR} strokeWidth="1" />
                <circle cx={X(adat.ys)} cy={Y(adat.zs)} r="5.5" fill={NAR} stroke="white" strokeWidth="1.6" />
                <text x={X(adat.ys) + 10} y={Y(adat.zs) - 8} fontSize="12.5" fontWeight="700" style={{ fill: NAR, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
                  S
                </text>
              </g>
            )}
          </g>

          {/* tengelyek az origónál (jobb felső sarok) — az idom fölé rajzolva, hogy ne takarja el */}
          <g opacity={ellenorizve ? 0.35 : 0.85} style={{ pointerEvents: "none" }}>
            <line x1={ox} y1={oy} x2={ox - 40} y2={oy} stroke="#475569" strokeWidth="1.1" markerEnd="url(#js-t)" />
            <line x1={ox} y1={oy} x2={ox} y2={oy + 40} stroke="#475569" strokeWidth="1.1" markerEnd="url(#js-t)" />
            <text x={ox - 46} y={oy - 4} textAnchor="end" fontSize="11.5" fontStyle="italic" style={{ fill: "#1d3c48", paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>y</text>
            <text x={ox + 5} y={oy + 46} fontSize="11.5" fontStyle="italic" style={{ fill: "#1d3c48", paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>z</text>
            <circle cx={ox} cy={oy} r="2.2" fill="#475569" />
          </g>

          {/* a tű */}
          {ellenorizve && tipp && (
            <g style={{ pointerEvents: "none" }} opacity={Math.min(1, anim.u * 2)}>
              <line x1={tx} y1={ty} x2={tx} y2={MA - 34} stroke="#334155" strokeWidth="2.4" strokeLinecap="round" />
              <path d={`M ${tx - 22} ${MA - 34} L ${tx + 22} ${MA - 34} L ${tx + 16} ${MA - 26} L ${tx - 16} ${MA - 26} Z`} fill="#334155" />
              <circle cx={tx} cy={ty} r="4" fill="#334155" stroke="white" strokeWidth="1.4" />
              {anim.u > 0.9 && (
                <text x={SZ / 2} y={MA - 8} textAnchor="middle" fontSize="12.5" fontWeight="700" style={{ fill: utolsoPont >= 85 ? ZOLD : BORDO, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
                  {utolsoPont >= 85 ? "Egyensúlyban — a tű a súlypont alatt van." : `Billen a súlypont felé: ${sz(hiba, 1)} mm-re tetted mellé.`}
                </text>
              )}
            </g>
          )}

          {/* „csillanás” – ha a tű a súlypontban van, kifutó gyűrű + sugarak */}
          {ellenorizve && tipp && utolsoPont >= 85 && anim.u > 0.05 && anim.u < 1 && (
            <g style={{ pointerEvents: "none" }} opacity={1 - anim.u}>
              <circle cx={X(adat.ys)} cy={Y(adat.zs)} r={6 + 46 * anim.u} fill="none" stroke={ZOLD} strokeWidth={3 - 2 * anim.u} />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
                const r1 = 12 + 30 * anim.u;
                const r2 = r1 + 8 + 10 * (1 - anim.u);
                const c = Math.cos((a * PI) / 180);
                const s = Math.sin((a * PI) / 180);
                return <line key={a} x1={X(adat.ys) + r1 * c} y1={Y(adat.zs) + r1 * s} x2={X(adat.ys) + r2 * c} y2={Y(adat.zs) + r2 * s} stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />;
              })}
            </g>
          )}

          {/* a tipp célkeresztje */}
          {tipp && (
            <g style={{ pointerEvents: "none" }} opacity={ellenorizve ? 0.7 : 1}>
              <line x1={tx - 16} y1={ty} x2={tx + 16} y2={ty} stroke={LILA} strokeWidth="1.4" />
              <line x1={tx} y1={ty - 16} x2={tx} y2={ty + 16} stroke={LILA} strokeWidth="1.4" />
              <circle cx={tx} cy={ty} r="9" fill="none" stroke={LILA} strokeWidth="1.8" />
              <circle cx={tx} cy={ty} r="2.2" fill={LILA} />
              <text x={tx + 12} y={ty + 16} fontSize="11" fontWeight="650" style={{ fill: LILA, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
                {ellenorizve ? "tipp" : `(${sz(tipp.y, 1)}; ${sz(tipp.z, 1)})`}
              </text>
              {ellenorizve && anim.u > 0.5 && (
                <line x1={tx} y1={ty} x2={X(adat.ys)} y2={Y(adat.zs)} stroke={BORDO} strokeWidth="1" strokeDasharray="3 3" opacity={0.7} />
              )}
            </g>
          )}
          {fazis === "tipp" && !tipp && (
            <text x={SZ / 2} y={MA - 10} textAnchor="middle" fontSize="11.5" style={{ fill: LILA }}>
              koppints az idomra ott, ahol a súlypontot sejted
            </text>
          )}
          {fazis === "tipp" && tipp && !huzasban && (
            <text x={SZ / 2} y={MA - 10} textAnchor="middle" fontSize="11.5" style={{ fill: LILA }}>
              húzással finomíthatod, aztán „Ellenőrzés”
            </text>
          )}
        </svg>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {fazis === "tipp" && (
          <button type="button" onClick={ellenoriz} disabled={!tipp} className="rounded-lg bg-naracs-500 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-naracs-600 disabled:cursor-not-allowed disabled:opacity-40">
            Ellenőrzés
          </button>
        )}
        {fazis === "ellenoriz" && (
          <button type="button" onClick={kovetkezo} className="rounded-lg bg-petrol-800 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-petrol-900">
            {kor >= OSSZ_KOR ? "Eredmény" : "Következő kör →"}
          </button>
        )}
        {pontok.length > 0 && <span className="szamok ml-auto text-[12px] text-petrol-500">körök: {pontok.join(" · ")}</span>}
      </div>
    </JatekKeret>
  );
}
