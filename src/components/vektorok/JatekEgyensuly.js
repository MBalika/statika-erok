"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import JatekKeret from "@/components/ui/JatekKeret";
import { sz } from "@/lib/szamok";

/*
 * „Zárd be a sokszöget!”
 * Körönként 2–3 véletlen erő hat egy csomópontban. A vektorábrában a lánc
 * animálva felépül; a hallgató a csomópontból kihúzza az egyensúlyozó erőt.
 * Ellenőrzéskor a kihúzott vektor a lánc végére úszik, és kiderül, bezárul-e
 * a sokszög. Pont: 100 − 150·|hiba|/|R| (0-nál levágva), a végén átlag.
 */

const OSSZ_KOR = 5;
const SZ = 640;
const MA = 340;
const E = 14; // képpont / kN
const CS = { x: 160, y: 175 }; // csomópont a geometriai ábrán
const VP = { x: 480, y: 175 }; // a vektorábra közepe
const SZINEK = ["#e2590a", "#0f766e", "#2563eb"];
const LILA = "#7c3aed";
const ZOLD = "#15803d";
const PIROS = "#be123c";
const RAD = Math.PI / 180;

const velKoz = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

function ujKor() {
  for (let proba = 0; proba < 50; proba++) {
    const n = Math.random() < 0.5 ? 2 : 3;
    const erok = Array.from({ length: n }, (_, i) => {
      const F = velKoz(4, 16) / 2; // 2 … 8 kN, fél kN-onként
      const a = velKoz(0, 23) * 15;
      return { F, a, x: F * Math.cos(a * RAD), y: F * Math.sin(a * RAD), szin: SZINEK[i], nev: `F${"₁₂₃"[i]}` };
    });
    const Rx = erok.reduce((s, e) => s + e.x, 0);
    const Ry = erok.reduce((s, e) => s + e.y, 0);
    const R = Math.hypot(Rx, Ry);
    // a lánc kiterjedése
    const lanc = [{ x: 0, y: 0 }];
    erok.forEach((e) => lanc.push({ x: lanc[lanc.length - 1].x + e.x, y: lanc[lanc.length - 1].y + e.y }));
    const xs = lanc.map((p) => p.x);
    const ys = lanc.map((p) => p.y);
    const szel = Math.max(...xs) - Math.min(...xs);
    const mag = Math.max(...ys) - Math.min(...ys);
    if (R < 2 || R > 9.5 || szel > 19 || mag > 19) continue;
    // a vektorábra eltolása, hogy a lánc középen legyen
    const kozep = { x: (Math.max(...xs) + Math.min(...xs)) / 2, y: (Math.max(...ys) + Math.min(...ys)) / 2 };
    return { erok, Rx, Ry, R, lanc, kozep, helyes: { x: -Rx, y: -Ry } };
  }
  // vészmegoldás – ez gyakorlatilag sosem fut le
  const erok = [
    { F: 4, a: 0, x: 4, y: 0, szin: SZINEK[0], nev: "F₁" },
    { F: 3, a: 90, x: 0, y: 3, szin: SZINEK[1], nev: "F₂" },
  ];
  return { erok, Rx: 4, Ry: 3, R: 5, lanc: [{ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 4, y: 3 }], kozep: { x: 2, y: 1.5 }, helyes: { x: -4, y: -3 } };
}

/** 0→1 animáció, ami minden `kulcs` változásra újraindul (amíg nem indult el, 0-t ad). */
function useAnimacio(kulcs, ido, aktiv) {
  const [all, setAll] = useState({ kulcs: null, u: 0 });
  useEffect(() => {
    if (!aktiv) return;
    let keret;
    const t0 = performance.now();
    setAll({ kulcs, u: 0 });
    const lep = (most) => {
      const x = Math.min(1, (most - t0) / ido);
      setAll({ kulcs, u: x });
      if (x < 1) keret = requestAnimationFrame(lep);
    };
    keret = requestAnimationFrame(lep);
    return () => cancelAnimationFrame(keret);
  }, [kulcs, ido, aktiv]);
  return aktiv && all.kulcs === kulcs ? all.u : 0;
}

function Hegy({ id, szin }) {
  return (
    <marker id={id} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
      <path d="M 0 1 L 9 5 L 0 9 z" fill={szin} />
    </marker>
  );
}

function Nyil({ x1, y1, x2, y2, u = 1, szin, hegy, vastag = 3, opacitas = 1, szaggatott = false }) {
  if (u <= 0.02 || Math.hypot(x2 - x1, y2 - y1) < 2) return null;
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x1 + (x2 - x1) * u}
      y2={y1 + (y2 - y1) * u}
      stroke={szin}
      strokeWidth={vastag}
      strokeLinecap="round"
      strokeDasharray={szaggatott ? "6 4" : undefined}
      markerEnd={`url(#${hegy})`}
      opacity={opacitas}
    />
  );
}

export default function JatekEgyensuly() {
  const [kor, setKor] = useState(1);
  const [adat, setAdat] = useState(null);
  const [fazis, setFazis] = useState("epul"); // epul | huz | ellenoriz | kesz
  const [sajat, setSajat] = useState(null); // a hallgató vektora kN-ban, a csomópontból
  const [pontok, setPontok] = useState([]);
  const [huzasban, setHuzasban] = useState(false);
  const [jatekSzam, setJatekSzam] = useState(0);
  const svgRef = useRef(null);

  // Az első kör csak a kliensen generálódik
  useEffect(() => {
    setAdat(ujKor());
  }, []);

  const n = adat ? adat.erok.length : 0;
  const epitU = useAnimacio(`${jatekSzam}-${kor}`, 550 * n, fazis === "epul" && !!adat);
  useEffect(() => {
    if (fazis === "epul" && epitU >= 1) setFazis("huz");
  }, [epitU, fazis]);
  const ellUNyers = useAnimacio(`${jatekSzam}-${kor}-e`, 900, fazis === "ellenoriz");
  const ellU = fazis === "kesz" ? 1 : ellUNyers;

  const gx = (x) => CS.x + x * E;
  const gy = (y) => CS.y - y * E;
  const vx = (x) => VP.x + (x - (adat ? adat.kozep.x : 0)) * E;
  const vy = (y) => VP.y - (y - (adat ? adat.kozep.y : 0)) * E;

  const huzas = (e) => {
    if (fazis !== "huz") return;
    e.preventDefault();
    const svg = svgRef.current;
    if (!svg) return;
    setHuzasban(true);
    const mozgat = (esem) => {
      const r = svg.getBoundingClientRect();
      const px = ((esem.clientX - r.left) / r.width) * SZ;
      const py = ((esem.clientY - r.top) / r.height) * MA;
      const x = Math.max(-10, Math.min(10, (px - CS.x) / E));
      const y = Math.max(-10, Math.min(10, (CS.y - py) / E));
      setSajat({ x, y });
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
    if (!adat || !sajat || fazis !== "huz") return;
    const hiba = Math.hypot(sajat.x - adat.helyes.x, sajat.y - adat.helyes.y);
    const arany = hiba / adat.R;
    const pont = Math.max(0, Math.round(100 - 150 * arany));
    setPontok((p) => [...p, pont]);
    setFazis("ellenoriz");
  };

  const kovetkezo = () => {
    if (kor >= OSSZ_KOR) {
      setFazis("kesz");
      return;
    }
    setKor((k) => k + 1);
    setAdat(ujKor());
    setSajat(null);
    setFazis("epul");
  };

  const ujJatek = useCallback(() => {
    setKor(1);
    setPontok([]);
    setSajat(null);
    setAdat(ujKor());
    setJatekSzam((j) => j + 1);
    setFazis("epul");
  }, []);

  const atlag = pontok.length ? pontok.reduce((s, p) => s + p, 0) / pontok.length : 0;
  const kesz = fazis === "kesz";
  const utolsoPont = pontok[pontok.length - 1];
  const ellenorizve = fazis === "ellenoriz" || kesz;

  // a hallgató vektorának „hibája” és a záródás
  let hibaArany = null;
  if (adat && sajat && ellenorizve) {
    hibaArany = Math.hypot(sajat.x - adat.helyes.x, sajat.y - adat.helyes.y) / adat.R;
  }
  const zar = hibaArany !== null && hibaArany < 0.1;
  const ellSzin = hibaArany === null ? LILA : zar ? ZOLD : PIROS;

  // a lánc vége (ide úszik a hallgató vektora ellenőrzéskor)
  const lancVeg = adat ? adat.lanc[adat.lanc.length - 1] : { x: 0, y: 0 };

  let uzenet = null;
  if (!adat) uzenet = null;
  else if (fazis === "epul") uzenet = <>Figyeld, hogyan fűződnek fel az erők a vektorábrában…</>;
  else if (fazis === "huz")
    uzenet = sajat ? (
      <>
        Az egyensúlyozó erőd: ({sz(sajat.x, 1)}; {sz(sajat.y, 1)}) kN. Ha jónak látod, ellenőrizd!
      </>
    ) : (
      <>Húzd ki a csomópontból azt az erőt, amelyik <strong>bezárja</strong> a vektorsokszöget — a lánc végétől vissza a kezdőpontba.</>
    );
  else if (ellenorizve && adat && hibaArany !== null)
    uzenet = (
      <>
        {zar ? "Bezárult! " : "Nyitva maradt. "}
        <span className="szamok">
          {utolsoPont} pont — a helyes: <strong>F<sub>e</sub> = −R = ({sz(adat.helyes.x, 2)}; {sz(adat.helyes.y, 2)}) kN</strong>, |F<sub>e</sub>| = {sz(adat.R, 2)} kN; a tiéd ({sz(sajat.x, 2)}; {sz(sajat.y, 2)}) kN, eltérés {sz(hibaArany * 100, 0)} % az eredőhöz képest.
        </span>
      </>
    );

  return (
    <JatekKeret
      cim="Zárd be a sokszöget!"
      leiras="Egy csomópontban 2–3 erő hat. A vektorábrában felépül a lánc — te pedig a csomópontból húzd ki azt az erőt, amelyik egyensúlyba hozza a rendszert. Ha jó, a sokszög bezárul."
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
        >
          <defs>
            {SZINEK.map((s, i) => (
              <Hegy key={i} id={`je-${i}`} szin={s} />
            ))}
            <Hegy id="je-lila" szin={LILA} />
            <Hegy id="je-zold" szin={ZOLD} />
            <Hegy id="je-piros" szin={PIROS} />
            <Hegy id="je-t" szin="#475569" />
          </defs>

          {/* ---- bal: csomópont ---- */}
          <rect x="0" y="0" width="320" height={MA} fill="transparent" onPointerDown={huzas} />
          <text x="14" y="22" fontWeight="700" style={{ fontSize: 11.5, fill: "#275767" }}>
            geometriai ábra — a csomópont
          </text>
          <line x1={CS.x - 130} y1={CS.y} x2={CS.x + 130} y2={CS.y} stroke="#94a3b8" strokeWidth="0.9" strokeDasharray="3 4" />
          <line x1={CS.x} y1={CS.y + 130} x2={CS.x} y2={CS.y - 130} stroke="#94a3b8" strokeWidth="0.9" strokeDasharray="3 4" />
          <line x1="320" y1="8" x2="320" y2={MA - 8} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />

          {adat &&
            adat.erok.map((e, i) => (
              <g key={i} style={{ pointerEvents: "none" }}>
                <line x1={CS.x} y1={CS.y} x2={gx(e.x)} y2={gy(e.y)} stroke={e.szin} strokeWidth="3" strokeLinecap="round" markerEnd={`url(#je-${i})`} />
                <text
                  x={Math.max(48, Math.min(272, gx(e.x) + (e.x >= 0 ? 6 : -6)))}
                  y={gy(e.y) + (e.y >= 0 ? -8 : 16)}
                  textAnchor="middle"
                  fontWeight="650"
                  style={{ fontSize: 11.5, fill: e.szin, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}
                >
                  {e.nev} = {sz(e.F, 1)} kN
                </text>
              </g>
            ))}
          <circle cx={CS.x} cy={CS.y} r="4" fill="#1d3c48" style={{ pointerEvents: "none" }} />

          {/* a hallgató vektora a csomópontból */}
          {sajat && (
            <g style={{ pointerEvents: "none" }}>
              <Nyil x1={CS.x} y1={CS.y} x2={gx(sajat.x)} y2={gy(sajat.y)} szin={ellenorizve ? ellSzin : LILA} hegy={ellenorizve ? (zar ? "je-zold" : "je-piros") : "je-lila"} vastag={3.4} opacitas={ellenorizve ? 0.55 : 1} />
              <text x={Math.max(48, Math.min(272, gx(sajat.x)))} y={gy(sajat.y) + (sajat.y >= 0 ? -12 : 20)} textAnchor="middle" fontWeight="700" style={{ fontSize: 12, fill: ellenorizve ? ellSzin : LILA, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
                Fe = {sz(Math.hypot(sajat.x, sajat.y), 1)} kN
              </text>
            </g>
          )}
          {/* ellenőrzéskor a helyes vektor a csomópontban is */}
          {ellenorizve && adat && (
            <g style={{ pointerEvents: "none" }}>
              <Nyil x1={CS.x} y1={CS.y} x2={gx(adat.helyes.x)} y2={gy(adat.helyes.y)} u={ellU} szin={ZOLD} hegy="je-zold" vastag={3} szaggatott />
            </g>
          )}
          {/* fogópont */}
          {sajat && fazis === "huz" && (
            <g onPointerDown={huzas} style={{ touchAction: "none", cursor: "grab" }}>
              <circle cx={gx(sajat.x)} cy={gy(sajat.y)} r="18" fill="transparent" />
              <circle cx={gx(sajat.x)} cy={gy(sajat.y)} r={huzasban ? 8 : 6.5} fill="white" stroke={LILA} strokeWidth="2.5" style={{ transition: "r 0.12s" }} />
            </g>
          )}
          {!sajat && fazis === "huz" && (
            <text x={CS.x} y={MA - 16} textAnchor="middle" style={{ fontSize: 11.5, fill: LILA }}>
              koppints vagy húzz a csomópont körül
            </text>
          )}

          {/* ---- jobb: vektorábra ---- */}
          <text x="334" y="22" fontWeight="700" style={{ fontSize: 11.5, fill: "#275767" }}>
            vektorábra — a lánc
          </text>
          {adat && (
            <g style={{ pointerEvents: "none" }}>
              <circle cx={vx(0)} cy={vy(0)} r="4.5" fill="none" stroke="#1d3c48" strokeWidth="1.6" />
              <text x={vx(0) < 400 ? vx(0) + 8 : vx(0) - 8} y={vy(0) + 14} textAnchor={vx(0) < 400 ? "start" : "end"} style={{ fontSize: 10, fill: "#475569" }}>
                kezdőpont
              </text>
              {adat.erok.map((e, i) => {
                const u = fazis === "epul" ? Math.max(0, Math.min(1, epitU * n - i)) : 1;
                return (
                  <g key={i}>
                    <Nyil x1={vx(adat.lanc[i].x)} y1={vy(adat.lanc[i].y)} x2={vx(adat.lanc[i + 1].x)} y2={vy(adat.lanc[i + 1].y)} u={u} szin={e.szin} hegy={`je-${i}`} />
                    {u >= 1 && (
                      <text
                        x={vx((adat.lanc[i].x + adat.lanc[i + 1].x) / 2) + (e.y >= 0 ? -10 : 10)}
                        y={vy((adat.lanc[i].y + adat.lanc[i + 1].y) / 2) + (e.x >= 0 ? -6 : 12)}
                        textAnchor="middle"
                        fontWeight="650"
                        style={{ fontSize: 11.5, fill: e.szin, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}
                      >
                        {e.nev}
                      </text>
                    )}
                  </g>
                );
              })}
              {/* a hiány a lánc vége és a kezdőpont között */}
              {fazis === "huz" && (
                <line x1={vx(lancVeg.x)} y1={vy(lancVeg.y)} x2={vx(0)} y2={vy(0)} stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 4" opacity="0.7" />
              )}
              {/* ellenőrzés: a hallgató vektora beúszik a lánc végére, majd a helyes is */}
              {ellenorizve && sajat && (
                <>
                  {(() => {
                    const s = Math.min(1, ellU * 1.6);
                    // a csomópontból a lánc végére úszik (képernyő-koordinátában interpolálunk)
                    const kx = gx(0) + (vx(lancVeg.x) - gx(0)) * s;
                    const ky = gy(0) + (vy(lancVeg.y) - gy(0)) * s;
                    return <Nyil x1={kx} y1={ky} x2={kx + sajat.x * E} y2={ky - sajat.y * E} szin={s >= 1 ? ellSzin : LILA} hegy={s >= 1 ? (zar ? "je-zold" : "je-piros") : "je-lila"} vastag={3.4} />;
                  })()}
                  {ellU > 0.65 && (
                    <>
                      <Nyil x1={vx(lancVeg.x)} y1={vy(lancVeg.y)} x2={vx(0)} y2={vy(0)} u={Math.min(1, (ellU - 0.65) / 0.35)} szin={ZOLD} hegy="je-zold" vastag={2.4} szaggatott />
                      {ellU >= 1 && (
                        <>
                          <circle cx={vx(0)} cy={vy(0)} r={zar ? 9 : 7} fill="none" stroke={ellSzin} strokeWidth="2.5" />
                          <text x={vx(0) < 520 ? vx(0) + 14 : vx(0) - 14} y={vy(0) + 24} textAnchor={vx(0) < 520 ? "start" : "end"} fontWeight="700" style={{ fontSize: 12, fill: ellSzin, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
                            {zar ? "bezárult ✓" : "nyitva maradt ✗"}
                          </text>
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </g>
          )}
        </svg>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {fazis === "huz" && (
          <button
            type="button"
            onClick={ellenoriz}
            disabled={!sajat}
            className="rounded-lg bg-naracs-500 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-naracs-600 disabled:opacity-40"
          >
            Ellenőrzés
          </button>
        )}
        {fazis === "ellenoriz" && ellU >= 1 && (
          <button type="button" onClick={kovetkezo} className="rounded-lg bg-petrol-800 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-petrol-900">
            {kor >= OSSZ_KOR ? "Eredmény" : "Következő kör →"}
          </button>
        )}
        {pontok.length > 0 && (
          <span className="szamok ml-auto text-[12px] text-petrol-500">
            körök: {pontok.join(" · ")}
          </span>
        )}
      </div>
    </JatekKeret>
  );
}
