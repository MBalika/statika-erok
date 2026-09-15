"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import JatekKeret from "@/components/ui/JatekKeret";
import { MB } from "@/components/ui/Keplet";
import { sz, zarojel } from "@/lib/szamok";

/*
 * „Mérleg-játék”
 * Egy rúd a közepén csuklón. Rajta 2–3 véletlen függőleges erő és néha egy
 * koncentrált nyomaték. A hallgató egy adott nagyságú kiegyensúlyozó erőt
 * húz a rúd mentén oda, ahol ΣM_O = 0 lesz. Ellenőrzéskor a rúd rugósan
 * a maradó nyomaték irányába billen — vagy vízszintes marad.
 * Pont körönként: 100 − 400·|hiba|/L (0-nál levágva), a végén átlag.
 */

const OSSZ_KOR = 5;
const SZ = 640;
const MA = 340;
const CX = 320;
const CY = 200;
const L = 8; // a rúd hossza, m (−4 … +4)
const PXM = 62; // képpont / m
const E = 7; // képpont / kN
const SZINEK = ["#e2590a", "#0f766e", "#2563eb"];
const LILA = "#7c3aed";
const BORDO = "#be123c";
const ZOLD = "#15803d";

const velKoz = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
const fel = (v) => Math.round(v * 2) / 2;

function ujKor() {
  for (let proba = 0; proba < 200; proba++) {
    const n = Math.random() < 0.5 ? 2 : 3;
    const helyek = new Set();
    const erok = [];
    for (let i = 0; i < n; i++) {
      let x;
      do x = velKoz(-7, 7) / 2;
      while (helyek.has(x) || x === 0);
      helyek.add(x);
      const F = velKoz(2, 10) * (Math.random() < 0.6 ? -1 : 1); // felfelé pozitív; többnyire lefelé (teher)
      erok.push({ x, F, szin: SZINEK[i], nev: `F${"₁₂₃"[i]}` });
    }
    const Mk = Math.random() < 0.5 ? velKoz(2, 12) * (Math.random() < 0.5 ? -1 : 1) : 0;
    const Fb = velKoz(3, 12) * (Math.random() < 0.5 ? -1 : 1);
    const Mrend = erok.reduce((s, e) => s + e.x * e.F, 0) + Mk;
    const xb = -Mrend / Fb;
    if (Math.abs(xb) > 3.8 || Math.abs(xb) < 0.3) continue;
    if (helyek.has(fel(xb))) continue;
    return { erok, Mk, Fb, Mrend, xb };
  }
  return {
    erok: [
      { x: -2, F: -6, szin: SZINEK[0], nev: "F₁" },
      { x: 3, F: -4, szin: SZINEK[1], nev: "F₂" },
    ],
    Mk: 0,
    Fb: 8,
    Mrend: 0,
    xb: 0,
  };
}

function Hegy({ id, szin }) {
  return (
    <marker id={id} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
      <path d="M 0 1 L 9 5 L 0 9 z" fill={szin} />
    </marker>
  );
}

/** Függőleges erő a rúdon: a nyíl hegye a rúdon (teher), felfelé mutató erőnél a rúdból indul. */
function EroNyil({ x, F, szin, hegy, nev, opacitas = 1, vastag = 3.2 }) {
  const px = CX + x * PXM;
  const h = Math.abs(F) * E + 10;
  const y1 = F < 0 ? CY - 8 - h : CY + 8 + h;
  const y2 = F < 0 ? CY - 8 : CY + 8;
  return (
    <g opacity={opacitas} style={{ pointerEvents: "none" }}>
      <line x1={px} y1={y1} x2={px} y2={y2} stroke={szin} strokeWidth={vastag} strokeLinecap="round" markerEnd={`url(#${hegy})`} />
      <text
        x={px}
        y={F < 0 ? y1 - 8 : y1 + 16}
        textAnchor="middle"
        fontWeight="650"
        style={{ fontSize: 11.5, fill: szin, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}
      >
        {nev} = {Math.abs(F)} kN
      </text>
    </g>
  );
}

export default function JatekMerleg() {
  const [kor, setKor] = useState(1);
  const [adat, setAdat] = useState(null);
  const [fazis, setFazis] = useState("huz"); // huz | ellenoriz | kesz
  const [sajatX, setSajatX] = useState(null);
  const [pontok, setPontok] = useState([]);
  const [huzasban, setHuzasban] = useState(false);
  const [szog, setSzog] = useState(0); // a rúd dőlése, fok (pozitív: óramutatóval ellentétes)
  const svgRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    setAdat(ujKor());
  }, []);

  // rugós billenés ellenőrzéskor
  useEffect(() => {
    if (fazis !== "ellenoriz" || !adat || sajatX === null) return undefined;
    const marad = adat.Mrend + sajatX * adat.Fb; // a maradó nyomaték, kNm (↶ pozitív)
    const cel = Math.max(-14, Math.min(14, marad * 0.8));
    let th = 0;
    let om = 0;
    let utolso = null;
    const lep = (most) => {
      if (utolso == null) utolso = most;
      const dt = Math.min(0.04, (most - utolso) / 1000);
      utolso = most;
      const k = 60;
      const c = 4.5;
      om += (-k * (th - cel) - c * om) * dt;
      th += om * dt;
      setSzog(th);
      if (Math.abs(th - cel) > 0.05 || Math.abs(om) > 0.05) rafRef.current = requestAnimationFrame(lep);
      else setSzog(cel);
    };
    rafRef.current = requestAnimationFrame(lep);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [fazis, adat, sajatX]);

  const huzas = (e) => {
    if (fazis !== "huz") return;
    e.preventDefault();
    const svg = svgRef.current;
    if (!svg) return;
    setHuzasban(true);
    const mozgat = (esem) => {
      const r = svg.getBoundingClientRect();
      const px = ((esem.clientX - r.left) / r.width) * SZ;
      const x = Math.max(-4, Math.min(4, Math.round(((px - CX) / PXM) * 10) / 10));
      setSajatX(x);
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

  const ellenoriz = () => {
    if (!adat || sajatX === null || fazis !== "huz") return;
    const hiba = Math.abs(sajatX - adat.xb);
    const pont = Math.max(0, Math.round(100 - (400 * hiba) / L));
    setPontok((p) => [...p, pont]);
    setSzog(0);
    setFazis("ellenoriz");
  };

  const kovetkezo = () => {
    if (kor >= OSSZ_KOR) {
      setFazis("kesz");
      return;
    }
    setKor((k) => k + 1);
    setAdat(ujKor());
    setSajatX(null);
    setSzog(0);
    setFazis("huz");
  };

  const ujJatek = useCallback(() => {
    setKor(1);
    setPontok([]);
    setSajatX(null);
    setSzog(0);
    setAdat(ujKor());
    setFazis("huz");
  }, []);

  const atlag = pontok.length ? pontok.reduce((s, p) => s + p, 0) / pontok.length : 0;
  const kesz = fazis === "kesz";
  const ellenorizve = fazis === "ellenoriz" || kesz;
  const utolsoPont = pontok[pontok.length - 1];
  const marad = adat && sajatX !== null ? adat.Mrend + sajatX * adat.Fb : 0;
  const jo = ellenorizve && Math.abs(marad) < 0.5;

  let uzenet = null;
  if (adat && fazis === "huz") {
    uzenet =
      sajatX === null ? (
        <>
          Húzd a lila <strong>{Math.abs(adat.Fb)} kN</strong>-os erőt a rúd mentén oda, ahol az egész rendszer nyomatéka a csuklóra nulla lesz. Az erő{" "}
          {adat.Fb > 0 ? "felfelé" : "lefelé"} mutat.
        </>
      ) : (
        <>
          Az erőd most <span className="szamok">x = {sz(sajatX, 1)} m</span>-nél áll. Ha jónak látod, ellenőrizd!
        </>
      );
  } else if (adat && ellenorizve) {
    uzenet = (
      <div>
        <p>
          {jo ? "Egyensúly — a rúd vízszintes marad. " : marad > 0 ? "Billen: az óramutatóval ellentétesen forog. " : "Billen: az óramutató irányába forog. "}
          <span className="szamok">
            {utolsoPont} pont — a helyes hely <strong>x = {sz(adat.xb, 2)} m</strong>, a tiéd {sz(sajatX, 1)} m.
          </span>
        </p>
        <div className="szamok mt-1 text-[13px]">
          <MB>
            {`\\Mp{O} ${adat.erok.map((e) => `${zarojel(e.x, 1)}\\cdot${zarojel(e.F, 0)}`).join(" + ")}${adat.Mk !== 0 ? ` ${adat.Mk > 0 ? "+" : "-"} ${Math.abs(adat.Mk)}` : ""} + x_b\\cdot${zarojel(adat.Fb, 0)} = 0\\ \\Rightarrow\\ x_b = \\frac{${sz(-adat.Mrend, 1)}}{${zarojel(adat.Fb, 0)}} = ${sz(adat.xb, 2)}\\ \\text{m}`}
          </MB>
        </div>
      </div>
    );
  }

  const sajatPx = sajatX !== null ? CX + sajatX * PXM : null;

  return (
    <JatekKeret
      cim="Mérleg-játék: hova tedd az erőt?"
      leiras="A rúd a közepén csuklón áll. Erők és néha egy nyomaték terhelik. Húzd a kiegyensúlyozó erőt a rúd mentén oda, ahol ΣM = 0 — ellenőrzéskor a rúd megmutatja, merre billen."
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
          style={{ cursor: fazis === "huz" ? "crosshair" : "default" }}
          onPointerDown={huzas}
        >
          <defs>
            {SZINEK.map((s, i) => (
              <Hegy key={i} id={`jm-${i}`} szin={s} />
            ))}
            <Hegy id="jm-lila" szin={LILA} />
            <Hegy id="jm-zold" szin={ZOLD} />
            <Hegy id="jm-piros" szin={BORDO} />
            <Hegy id="jm-m" szin={BORDO} />
          </defs>

          {/* talaj és csukló */}
          <path d={`M ${CX - 22} ${CY + 46} L ${CX} ${CY + 10} L ${CX + 22} ${CY + 46} Z`} fill="#cbd5e1" stroke="#64748b" strokeWidth="1.2" />
          <line x1={CX - 60} y1={CY + 46} x2={CX + 60} y2={CY + 46} stroke="#64748b" strokeWidth="1.6" />
          {[-50, -35, -20, -5, 10, 25, 40].map((d) => (
            <line key={d} x1={CX + d} y1={CY + 46} x2={CX + d - 8} y2={CY + 56} stroke="#94a3b8" strokeWidth="1" />
          ))}

          {/* a rúd és minden, ami rajta van, együtt billen */}
          <g transform={`rotate(${-szog} ${CX} ${CY})`} style={{ transition: fazis === "huz" ? "transform 0.3s" : "none" }}>
            <rect x={CX - 4 * PXM - 10} y={CY - 8} width={8 * PXM + 20} height={16} rx="4" fill="#e2e8f0" stroke="#475569" strokeWidth="1.4" />
            {/* méretskála a rúdon */}
            {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((m) => (
              <g key={m}>
                <line x1={CX + m * PXM} y1={CY - 8} x2={CX + m * PXM} y2={CY + 8} stroke="#94a3b8" strokeWidth={m === 0 ? 1.6 : 0.8} />
                <text x={CX + m * PXM} y={CY + 30} textAnchor="middle" style={{ fontSize: 10.5, fill: "#64748b" }}>
                  {m === 0 ? "O" : `${m > 0 ? "+" : "−"}${Math.abs(m)}`}
                </text>
              </g>
            ))}
            <text x={CX + 4 * PXM + 14} y={CY + 30} style={{ fontSize: 10, fill: "#94a3b8" }}>m</text>

            {adat && adat.erok.map((e, i) => <EroNyil key={i} x={e.x} F={e.F} szin={e.szin} hegy={`jm-${i}`} nev={e.nev} />)}

            {/* koncentrált nyomaték */}
            {adat && adat.Mk !== 0 && (
              <g style={{ pointerEvents: "none" }}>
                <path
                  d={
                    adat.Mk > 0
                      ? `M ${CX + 18} ${CY - 48} A 18 18 0 1 0 ${CX - 18} ${CY - 48}`
                      : `M ${CX - 18} ${CY - 48} A 18 18 0 1 1 ${CX + 18} ${CY - 48}`
                  }
                  fill="none"
                  stroke={BORDO}
                  strokeWidth="2.6"
                  markerEnd="url(#jm-m)"
                />
                <text x={CX} y={CY - 74} textAnchor="middle" fontWeight="650" style={{ fontSize: 11.5, fill: BORDO, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
                  M = {Math.abs(adat.Mk)} kNm {adat.Mk > 0 ? "↶" : "↷"}
                </text>
              </g>
            )}

            {/* a hallgató erője */}
            {adat && sajatX !== null && (
              <EroNyil x={sajatX} F={adat.Fb} szin={ellenorizve ? (jo ? ZOLD : BORDO) : LILA} hegy={ellenorizve ? (jo ? "jm-zold" : "jm-piros") : "jm-lila"} nev="Fb" vastag={3.8} />
            )}
            {/* a helyes hely ellenőrzéskor */}
            {adat && ellenorizve && !jo && (
              <EroNyil x={adat.xb} F={adat.Fb} szin={ZOLD} hegy="jm-zold" nev="helyes" opacitas={0.6} />
            )}
            {/* fogópont */}
            {adat && sajatX !== null && fazis === "huz" && (
              <g style={{ cursor: "grab" }}>
                <circle cx={sajatPx} cy={CY} r="18" fill="transparent" />
                <circle cx={sajatPx} cy={CY} r={huzasban ? 9 : 7} fill="white" stroke={LILA} strokeWidth="2.5" style={{ transition: "r 0.12s" }} />
              </g>
            )}
          </g>

          {/* várakozó erő a sarokban, amíg nem tették a rúdra */}
          {adat && sajatX === null && fazis === "huz" && (
            <g style={{ pointerEvents: "none" }}>
              <rect x="14" y="14" width="150" height="66" rx="10" fill="white" stroke={LILA} strokeWidth="1.2" opacity="0.95" />
              <text x="26" y="34" fontWeight="650" style={{ fontSize: 11.5, fill: LILA }}>a kiegyensúlyozó erő:</text>
              <line x1="40" y1={adat.Fb < 0 ? 44 : 72} x2="40" y2={adat.Fb < 0 ? 72 : 44} stroke={LILA} strokeWidth="3.4" strokeLinecap="round" markerEnd="url(#jm-lila)" />
              <text x="54" y="62" fontWeight="700" style={{ fontSize: 13, fill: LILA }}>
                Fb = {Math.abs(adat.Fb)} kN {adat.Fb < 0 ? "↓" : "↑"}
              </text>
              <text x={CX} y={MA - 14} textAnchor="middle" style={{ fontSize: 11.5, fill: LILA }}>
                koppints a rúdra, vagy húzd végig rajta az erőt
              </text>
            </g>
          )}
          {ellenorizve && (
            <text x={CX} y={MA - 14} textAnchor="middle" fontWeight="700" style={{ fontSize: 12.5, fill: jo ? ZOLD : BORDO, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
              {jo ? "ΣM = 0 — egyensúly ✓" : `ΣM = ${sz(marad, 1)} kNm — billen ✗`}
            </text>
          )}
        </svg>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {fazis === "huz" && (
          <button
            type="button"
            onClick={ellenoriz}
            disabled={sajatX === null}
            className="rounded-lg bg-naracs-500 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-naracs-600 disabled:opacity-40"
          >
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
