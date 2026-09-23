"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import JatekKeret from "@/components/ui/JatekKeret";
import { Csuszka } from "@/components/abrak/ErovektorBonto";
import { MB } from "@/components/ui/Keplet";
import { sz, szK } from "@/lib/szamok";

/*
 * „Hol az eredő?” – játék.
 * Körönként egy véletlen teherábra (egyenletes / háromszög / trapéz / két szakasz /
 * előjelváltó lineáris). A hallgató a tartó alatt húzással vagy csúszkával beállítja
 * az eredő k helyét, csúszkával az R nagyságát. Ellenőrzéskor a teher elemi nyilai a
 * súlypont felé csúsznak és eltűnnek, közben nő a helyes eredő nyila (piros vonal a
 * helyes helyen). Pont: hely 60 %, nagyság 40 %; 5 kör, a végén átlag.
 */

const OSSZ_KOR = 5;
const SZ = 640;
const MA = 380;
const BAL = 90;
const JOBB = 560;
const TY = 232; // a tartó
const PS = 9; // px / (kN/m)
const NAR = "#e2590a";
const LILA = "#7c3aed";
const BORDO = "#be123c";
const ZOLD = "#15803d";

const velKoz = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
const valaszt = (t) => t[Math.floor(Math.random() * t.length)];
const lerp = (a, b, u) => a + (b - a) * u;
const simit = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u));

/** Egy lineáris szakasz eredője és nyomatéka az origóra (téglalap + háromszög). */
function szakaszEredo(s) {
  const l = s.x1 - s.x0;
  const Rt = s.p0 * l;
  const Rh = ((s.p1 - s.p0) * l) / 2;
  return { R: Rt + Rh, M: Rt * (s.x0 + l / 2) + Rh * (s.x0 + (2 * l) / 3) };
}

function ujKor() {
  const tipus = valaszt(["egyenletes", "haromszog", "trapez", "ketszakasz", "elojel", "haromszog", "trapez", "ketszakasz"]);
  const L = valaszt([4, 5, 6, 8]);
  let szakaszok;
  let nev;
  if (tipus === "egyenletes") {
    const p = velKoz(2, 10);
    szakaszok = [{ x0: 0, x1: L, p0: p, p1: p }];
    nev = "egyenletes teher";
  } else if (tipus === "haromszog") {
    const p = velKoz(3, 10);
    szakaszok = Math.random() < 0.5 ? [{ x0: 0, x1: L, p0: p, p1: 0 }] : [{ x0: 0, x1: L, p0: 0, p1: p }];
    nev = "háromszög alakú teher";
  } else if (tipus === "trapez") {
    const p0 = velKoz(1, 8);
    let p1 = velKoz(1, 10);
    while (p1 === p0) p1 = velKoz(1, 10);
    szakaszok = [{ x0: 0, x1: L, p0, p1 }];
    nev = "trapéz alakú teher";
  } else if (tipus === "ketszakasz") {
    const a = valaszt([0.4, 0.5, 0.6]) * L;
    const p0 = velKoz(2, 10);
    let p1 = velKoz(2, 10);
    while (p1 === p0) p1 = velKoz(2, 10);
    szakaszok = [
      { x0: 0, x1: a, p0, p1: p0 },
      { x0: a, x1: L, p0: p1, p1 },
    ];
    nev = "két egyenletes szakasz";
  } else {
    const p2 = velKoz(1, 2);
    const p1 = velKoz(3 * p2, 10);
    szakaszok = Math.random() < 0.5 ? [{ x0: 0, x1: L, p0: p1, p1: -p2 }] : [{ x0: 0, x1: L, p0: -p2, p1 }];
    nev = "előjelet váltó lineáris teher";
  }
  let R = 0;
  let M = 0;
  szakaszok.forEach((s) => {
    const e = szakaszEredo(s);
    R += e.R;
    M += e.M;
  });
  const k = M / R;
  const Rmax = Math.ceil((R * 1.6) / 5) * 5;
  return { tipus, nev, L, szakaszok, R, k, Rmax };
}

function Hegy({ id, szin }) {
  return (
    <marker id={id} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
      <path d="M 0 1 L 9 5 L 0 9 z" fill={szin} />
    </marker>
  );
}

export default function JatekEredo() {
  const [kor, setKor] = useState(1);
  const [adat, setAdat] = useState(null);
  const [fazis, setFazis] = useState("beallit"); // beallit | ellenoriz | kesz
  const [k, setK] = useState(0);
  const [R, setR] = useState(0);
  const [kBeallitva, setKBeallitva] = useState(false);
  const [pontok, setPontok] = useState([]);
  const [anim, setAnim] = useState(0);
  const [huzasban, setHuzasban] = useState(false);
  const svgRef = useRef(null);
  const rafRef = useRef(null);

  const inditKor = useCallback((a) => {
    setAdat(a);
    setK(a.L / 2);
    setR(Math.round(a.Rmax / 2));
    setKBeallitva(false);
    setAnim(0);
    setFazis("beallit");
  }, []);

  useEffect(() => {
    inditKor(ujKor());
  }, [inditKor]);

  // az „összeolvadás” animációja
  useEffect(() => {
    if (fazis !== "ellenoriz") return undefined;
    let kezdet = null;
    const lep = (most) => {
      if (kezdet == null) kezdet = most;
      const u = Math.min(1, (most - kezdet) / 1400);
      setAnim(simit(u));
      if (u < 1) rafRef.current = requestAnimationFrame(lep);
    };
    rafRef.current = requestAnimationFrame(lep);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [fazis]);

  if (!adat) return null;

  const XL = (JOBB - BAL) / adat.L;
  const X = (x) => BAL + x * XL;
  const RS = Math.min(2.2, 100 / Math.max(adat.Rmax, 1)); // px / kN
  const pMax = Math.max(...adat.szakaszok.flatMap((s) => [Math.abs(s.p0), Math.abs(s.p1)]));
  const csucsY = TY - pMax * PS; // a teherábra teteje

  const huzas = (e) => {
    if (fazis !== "beallit") return;
    e.preventDefault();
    const svg = svgRef.current;
    if (!svg) return;
    setHuzasban(true);
    const mozgat = (esem) => {
      const r = svg.getBoundingClientRect();
      const px = ((esem.clientX - r.left) / r.width) * SZ;
      const x = Math.max(0, Math.min(adat.L, Math.round(((px - BAL) / XL) * 20) / 20));
      setK(x);
      setKBeallitva(true);
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
    if (fazis !== "beallit") return;
    const dk = Math.abs(k - adat.k);
    const dR = Math.abs(R - adat.R);
    const helyPont = 60 * Math.max(0, 1 - dk / (adat.L / 5));
    const nagyPont = 40 * Math.max(0, 1 - dR / (0.5 * adat.R));
    setPontok((p) => [...p, Math.round(helyPont + nagyPont)]);
    setFazis("ellenoriz");
  };

  const kovetkezo = () => {
    if (kor >= OSSZ_KOR) {
      setFazis("kesz");
      return;
    }
    setKor((c) => c + 1);
    inditKor(ujKor());
  };

  const ujJatek = () => {
    setKor(1);
    setPontok([]);
    inditKor(ujKor());
  };

  const atlag = pontok.length ? pontok.reduce((s, p) => s + p, 0) / pontok.length : 0;
  const kesz = fazis === "kesz";
  const ellenorizve = fazis === "ellenoriz" || kesz;
  const utolsoPont = pontok[pontok.length - 1];
  const dk = Math.abs(k - adat.k);
  const dR = Math.abs(R - adat.R);

  // elemi nyilak (szakaszonként), az animációban a helyes k felé csúsznak és zsugorodnak
  const nyilak = [];
  adat.szakaszok.forEach((s, si) => {
    const l = s.x1 - s.x0;
    const db = Math.max(4, Math.round(l * 2));
    for (let i = 0; i <= db; i++) {
      const u = i / db;
      const x = s.x0 + l * u;
      const p = s.p0 + (s.p1 - s.p0) * u;
      nyilak.push({ x: lerp(x, adat.k, anim), h: p * PS * (1 - anim), kulcs: `${si}-${i}` });
    }
  });

  // a teherábra sokszögei (előjelváltásnál a zérushelynél kettéosztva)
  const sokszogek = [];
  adat.szakaszok.forEach((s, si) => {
    const l = s.x1 - s.x0;
    if (s.p0 * s.p1 < 0) {
      const xz = s.x0 + (s.p0 / (s.p0 - s.p1)) * l;
      sokszogek.push({ d: `M ${X(s.x0)} ${TY} L ${X(s.x0)} ${TY - s.p0 * PS} L ${X(xz)} ${TY} Z`, kulcs: `${si}a` });
      sokszogek.push({ d: `M ${X(xz)} ${TY} L ${X(s.x1)} ${TY - s.p1 * PS} L ${X(s.x1)} ${TY} Z`, kulcs: `${si}b` });
    } else {
      sokszogek.push({ d: `M ${X(s.x0)} ${TY} L ${X(s.x0)} ${TY - s.p0 * PS} L ${X(s.x1)} ${TY - s.p1 * PS} L ${X(s.x1)} ${TY} Z`, kulcs: `${si}` });
    }
  });

  const sajatCsucs = lerp(csucsY - 14, TY - 8, anim); // ellenőrzéskor a tartóra ereszkedik, hogy összevethető legyen
  const sajatH = R * RS;

  let uzenet = null;
  if (fazis === "beallit") {
    uzenet = (
      <>
        <strong>{adat.nev}</strong>, L = {adat.L} m. Húzd a lila jelet a tartó alatt oda, ahol az eredő működik, és állítsd be a nagyságát a csúszkával.
        {adat.tipus === "elojel" && " Tipp: ne a zérushelyet számold — két háromszög, előjelesen."}
      </>
    );
  } else if (ellenorizve) {
    uzenet = (
      <div>
        <p className="szamok">
          <strong>{utolsoPont} pont.</strong> Hely: {sz(dk, 2)} m-t ({sz(dk * 100, 0)} cm) tévedtél — helyes <strong>k = {sz(adat.k, 2)} m</strong>, a tiéd {sz(k, 2)} m.
          Nagyság: {sz(dR, 1)} kN eltérés — helyes <strong>R = {sz(adat.R, 1)} kN</strong>, a tiéd {sz(R, 1)} kN.
        </p>
        <div className="szamok mt-1 text-[13px]">
          <MB>
            {`\\Fle ${adat.szakaszok.map((s) => `\\tfrac{${szK(s.p0, 0)} ${s.p1 < 0 ? "-" : "+"} ${szK(Math.abs(s.p1), 0)}}{2}\\cdot ${szK(s.x1 - s.x0, 1)}`).join(" + ")} = R = ${szK(adat.R, 1)}\\ \\text{kN}`}
          </MB>
          <MB>{`\\Mj{O} \\sum R_i x_i = R\\,k\\ \\Rightarrow\\ k = ${szK(adat.k, 2)}\\ \\text{m}`}</MB>
        </div>
      </div>
    );
  }

  return (
    <JatekKeret
      cim="Hol az eredő?"
      leiras="Egy teherábra, két kérdés: hol és mekkora az eredő? Állítsd be szemre (vagy fejszámolással), aztán nézd meg, hogyan olvad össze a teher egyetlen erővé. A hely 60, a nagyság 40 pontot ér."
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
          style={{ cursor: fazis === "beallit" ? "crosshair" : "default" }}
          onPointerDown={huzas}
        >
          <defs>
            <Hegy id="je-n" szin={NAR} />
            <Hegy id="je-l" szin={LILA} />
            <Hegy id="je-p" szin={BORDO} />
            <Hegy id="je-sz" szin="#94a3b8" />
          </defs>

          {/* intenzitás-mérce balra */}
          <g>
            {/* a mérce elég messze balra, hogy az első szakasz (balra írt) intenzitás-felirata ne érje el */}
            <line x1={BAL - 68} y1={TY} x2={BAL - 68} y2={TY - 10 * PS} stroke="#94a3b8" strokeWidth="1" />
            {[0, 5, 10].map((v) => (
              <g key={v}>
                <line x1={BAL - 72} y1={TY - v * PS} x2={BAL - 64} y2={TY - v * PS} stroke="#94a3b8" strokeWidth="1" />
                <text x={BAL - 75} y={TY - v * PS + 4} textAnchor="end" style={{ fontSize: 10, fill: "#64748b" }}>
                  {v}
                </text>
              </g>
            ))}
            <text x={BAL - 64} y={TY - 10 * PS - 24} textAnchor="middle" style={{ fontSize: 10, fill: "#64748b" }}>
              kN/m
            </text>
          </g>

          {/* teherábra */}
          {/* a teherábra körvonala az összeolvadás után is halványan megmarad */}
          {sokszogek.map((s) => (
            <path key={s.kulcs} d={s.d} fill={NAR} opacity={0.14 * (1 - 0.6 * anim)} stroke={NAR} strokeWidth="1.6" strokeOpacity={1 - 0.65 * anim} />
          ))}
          {nyilak.map((n) =>
            Math.abs(n.h) > 3 ? (
              <line
                key={n.kulcs}
                x1={X(n.x)}
                y1={TY - n.h}
                x2={X(n.x)}
                y2={n.h > 0 ? TY - 5 : TY + 5}
                stroke={NAR}
                strokeWidth="1.3"
                markerEnd="url(#je-n)"
              />
            ) : null,
          )}
          {/* intenzitás-feliratok */}
          {/* negatív (felfelé mutató) intenzitás felirata a tartó alatti méretskála alá kerül */}
          {adat.szakaszok.map((s, i) => (
            <g key={i} opacity={1 - 0.65 * anim}>
              <text x={X(s.x0) + (i === 0 ? -6 : 6)} y={s.p0 < 0 ? TY - s.p0 * PS + 30 : TY - s.p0 * PS - 8} textAnchor={i === 0 ? "end" : "start"} style={{ fontSize: 11.5, fontWeight: 650, fill: NAR, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
                {s.p0 < 0 ? `−${-s.p0}` : s.p0} kN/m
              </text>
              {s.p1 !== s.p0 && (
                <text x={X(s.x1) + 6} y={s.p1 < 0 ? TY - s.p1 * PS + 30 : TY - s.p1 * PS - 8} textAnchor="start" style={{ fontSize: 11.5, fontWeight: 650, fill: NAR, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
                  {s.p1 < 0 ? `−${-s.p1}` : s.p1} kN/m
                </text>
              )}
            </g>
          ))}

          {/* tartó és méretskála */}
          <line x1={BAL - 12} y1={TY} x2={JOBB + 12} y2={TY} stroke="#1d3c48" strokeWidth="4" strokeLinecap="round" />
          {Array.from({ length: adat.L + 1 }, (_, m) => (
            <g key={m}>
              <line x1={X(m)} y1={TY + 6} x2={X(m)} y2={TY + 14} stroke="#64748b" strokeWidth="1" />
              <text x={X(m)} y={TY + 26} textAnchor="middle" style={{ fontSize: 10.5, fill: "#64748b" }}>
                {m}
              </text>
            </g>
          ))}
          <text x={JOBB + 22} y={TY + 26} style={{ fontSize: 10, fill: "#94a3b8" }}>m</text>
          {adat.szakaszok.length > 1 &&
            adat.szakaszok.map((s, i) => (
              <g key={`d${i}`}>
                <line x1={X(s.x0)} y1={TY + 44} x2={X(s.x1)} y2={TY + 44} stroke="#94a3b8" strokeWidth="1" markerStart="url(#je-sz)" markerEnd="url(#je-sz)" />
                <text x={X((s.x0 + s.x1) / 2)} y={TY + 58} textAnchor="middle" style={{ fontSize: 10.5, fill: "#64748b" }}>
                  {sz(s.x1 - s.x0, 1)} m
                </text>
              </g>
            ))}

          {/* a hallgató eredője */}
          <g style={{ pointerEvents: "none" }}>
            <line x1={X(k)} y1={TY + 4} x2={X(k)} y2={TY + 72} stroke={LILA} strokeWidth="1.2" strokeDasharray="4 3" opacity="0.8" />
            <line x1={X(k)} y1={sajatCsucs - sajatH} x2={X(k)} y2={sajatCsucs} stroke={LILA} strokeWidth="3.8" strokeLinecap="round" markerEnd="url(#je-l)" opacity={ellenorizve ? 0.55 : 1} />
            {!ellenorizve && (
              <text x={X(k)} y={sajatCsucs - sajatH - 8} textAnchor="middle" style={{ fontSize: 12, fontWeight: 650, fill: LILA, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
                R = {sz(R, 1)} kN
              </text>
            )}
            {/* ellenőrzéskor a tipp és a helyes érték két külön sorban, a tartó alatt — nem írják egymást felül */}
            <text x={Math.max(110, Math.min(SZ - 110, X(k)))} y={TY + 86} textAnchor="middle" style={{ fontSize: 11, fontWeight: ellenorizve ? 650 : 400, fill: LILA, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
              {ellenorizve ? `tiéd: R = ${sz(R, 1)} kN, k = ${sz(k, 2)} m` : `k = ${sz(k, 2)} m`}
            </text>
          </g>
          {/* fogópont a tartó alatt */}
          {fazis === "beallit" && (
            <g style={{ cursor: "grab" }}>
              <circle cx={X(k)} cy={TY + 72} r="18" fill="transparent" />
              <path d={`M ${X(k)} ${TY + 60} L ${X(k) - 8} ${TY + 74} L ${X(k) + 8} ${TY + 74} Z`} fill={huzasban ? LILA : "white"} stroke={LILA} strokeWidth="2.2" />
            </g>
          )}

          {/* a helyes eredő, ellenőrzéskor nő */}
          {ellenorizve && anim > 0.05 && (
            <g style={{ pointerEvents: "none" }}>
              <line x1={X(adat.k)} y1={TY - pMax * PS - 20} x2={X(adat.k)} y2={TY + 100} stroke={BORDO} strokeWidth="1.4" opacity={anim} />
              <line x1={X(adat.k)} y1={TY - 12 - adat.R * RS * anim} x2={X(adat.k)} y2={TY - 8} stroke={BORDO} strokeWidth="4.2" strokeLinecap="round" markerEnd="url(#je-p)" />
              <text x={X(adat.k) + 10} y={TY - 12 - adat.R * RS * anim} style={{ fontSize: 12.5, fontWeight: 700, fill: BORDO, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }} opacity={anim}>
                R = {sz(adat.R, 1)} kN
              </text>
              <text x={Math.max(110, Math.min(SZ - 110, X(adat.k)))} y={TY + 112} textAnchor="middle" style={{ fontSize: 11.5, fontWeight: 650, fill: BORDO, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }} opacity={anim}>
                helyes: R = {sz(adat.R, 1)} kN, k = {sz(adat.k, 2)} m
              </text>
              {anim > 0.9 && (
                <text x={SZ / 2} y={MA - 10} textAnchor="middle" style={{ fontSize: 12.5, fontWeight: 700, fill: utolsoPont >= 80 ? ZOLD : BORDO, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
                  {utolsoPont >= 80 ? "Mérnöki szem!" : utolsoPont >= 50 ? "Közel — nézd meg, merre húz a nehezebb rész." : "Számold ki: terület és súlypont."}
                </text>
              )}
            </g>
          )}
          {fazis === "beallit" && !kBeallitva && (
            <text x={SZ / 2} y={MA - 10} textAnchor="middle" style={{ fontSize: 11.5, fill: LILA }}>
              koppints vagy húzd a tartó alatti jelet — vagy használd a csúszkákat
            </text>
          )}
        </svg>
      </div>

      <div className="mt-3 grid gap-x-4 gap-y-2 sm:grid-cols-2">
        <Csuszka
          cimke="az eredő helye, k (a bal végtől)"
          ertek={k}
          egyseg="m"
          min={0}
          max={adat.L}
          lepes={0.05}
          tizedes={2}
          onChange={(v) => {
            if (fazis !== "beallit") return;
            setK(v);
            setKBeallitva(true);
          }}
        />
        <Csuszka
          cimke="az eredő nagysága, R"
          ertek={R}
          egyseg="kN"
          min={0}
          max={adat.Rmax}
          lepes={0.5}
          tizedes={1}
          onChange={(v) => {
            if (fazis === "beallit") setR(v);
          }}
        />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {fazis === "beallit" && (
          <button type="button" onClick={ellenoriz} className="rounded-lg bg-naracs-500 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-naracs-600">
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
