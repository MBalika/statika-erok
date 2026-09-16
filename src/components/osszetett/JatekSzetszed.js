"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import JatekKeret from "@/components/ui/JatekKeret";
import { Csuszka } from "@/components/abrak/ErovektorBonto";
import { MB } from "@/components/ui/Keplet";
import { sz, szK } from "@/lib/szamok";
import { TartoHegyek, TamaszCimke, Meret } from "@/components/tartok/TartoElemek";
import { egesz, valaszt, fel, tag } from "./GyakorloExtra";
import { gerberSzamit, gerberBefogasSzamit, haromcsuklosSzamit } from "./szamitas";
import { OsszetettHegyek, EroNyil, TestRajz, TestCimke } from "./Rajz";

/*
 * „Szedd szét és számold”
 * Körönként egy véletlen összetett tartó (Gerber, Gerber befogással, háromcsuklós keret, terhelt csukló).
 * 1. lépés: melyik testtel kezdenél? (20 pont) — 2. lépés: a szerkezet szétszedve; a hallgató beállítja
 * a belső csuklóerőt (a nyíl fogópontját húzva vagy csúszkával) és egy reakciót (80 pont, a relatív hiba
 * szerint). Ellenőrzéskor a két test „összeugrik”, ha stimmel, és megrázkódik, ha nem.
 */

const OSSZ_KOR = 5;
const SZ = 640;
const MA = 380;
const LILA = "#7c3aed";
const ZOLD = "#15803d";
const BORDO = "#be123c";
const KEK = "#0369a1";
const felre = (v) => Math.round(v * 2) / 2;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const relHiba = (tipp, helyes) => Math.abs(tipp - helyes) / Math.max(Math.abs(helyes), 2);

function ujKor(kor) {
  const tipus = kor === 1 ? "gerber" : valaszt(["gerber", "befogas", "harom", "terhelt"]);
  if (tipus === "gerber" || tipus === "terhelt") {
    const L1 = fel(3, 5), L2 = fel(1, 2.5), L3 = fel(2, 4);
    const xB = L1, xC = L1 + L2, xD = xC + L3;
    const x1 = fel(0.5, xC - 0.5), F1 = egesz(6, 20);
    const x2 = fel(xC + 0.5, xD - 0.5), F2 = egesz(4, 16);
    const FC = tipus === "terhelt" ? egesz(4, 14) : 0;
    const r = gerberSzamit({ xB, xC, xD, terhekI: [{ x: x1, y: 0, Fx: 0, Fy: -F1 }], terhekII: [{ x: x2, y: 0, Fx: 0, Fy: -F2 }], FC: { Fx: 0, Fy: -FC } });
    return {
      tipus,
      cim: tipus === "terhelt" ? "Csuklóján terhelt Gerber-tartó" : "Gerber-tartó",
      helyesTest: 1,
      testek: [
        { nev: "I", rudak: [[0, 0, xC, 0]], tamaszok: [{ x: 0, y: 0, tipus: "csuklo", cimke: "A" }, { x: xB, y: 0, tipus: "gorgo", cimke: "B" }], terhek: [{ x: x1, y: 0, Fx: 0, Fy: -F1, cimke: `F₁ = ${F1}` }], eltolas: [-26, 30], cimkeHely: [xC / 2, -0.9] },
        { nev: "II", rudak: [[xC, 0, xD, 0]], tamaszok: [{ x: xD, y: 0, tipus: "gorgo", cimke: "D" }], terhek: [{ x: x2, y: 0, Fx: 0, Fy: -F2, cimke: `F₂ = ${F2}` }], eltolas: [26, -30], cimkeHely: [xC + L3 / 2, -0.9] },
      ],
      csuklo: [xC, 0],
      FC,
      hossz: xD,
      magas: 0,
      meretek: [[0, xB], [xB, xC], [xC, xD]],
      kerdes1: { id: "cy", cimke: "C_y a II. testre (↑ +)", helyes: r.Cy, egyseg: "kN", min: -20, max: 25 },
      kerdes2: { id: "d", cimke: "D reakció (↑ +)", helyes: r.D, egyseg: "kN", min: -10, max: 25 },
      magyarazat: [`\\text{II: } \\Mp{C}\\ ${tag(x2 - xC, -F2)} + ${szK(L3, 1)}\\cdot D = 0 \\Rightarrow D = ${szK(r.D, 2)}`, `\\text{II: } \\Mp{D}\\ ${tag(xD - x2, F2)} - ${szK(L3, 1)}\\cdot C_y = 0 \\Rightarrow C_y = ${szK(r.Cy, 2)}`],
      miert: tipus === "terhelt" ? "A II. test (C–D) csak egy görgővel áll: befüggesztett rész, három ismeretlennel — a csuklón lévő teher nem rá hat, azt a csukló egyensúlya osztja szét." : "A II. test (C–D) csak egy görgővel áll a földön: befüggesztett rész, pontosan három ismeretlennel (C_x, C_y, D).",
    };
  }
  if (tipus === "befogas") {
    const xA = fel(1, 2.5), LAC = fel(3, 6), LCB = fel(2, 4);
    const xC = xA + LAC, xB = xC + LCB;
    const x1 = fel(0, xC - 0.5), F1 = egesz(6, 20);
    const x2 = fel(xC + 0.5, xB - 0.5), F2 = egesz(4, 14);
    const r = gerberBefogasSzamit({ xA, xC, xB, terhekI: [{ x: x1, y: 0, Fx: 0, Fy: -F1 }], terhekII: [{ x: x2, y: 0, Fx: 0, Fy: -F2 }] });
    return {
      tipus,
      cim: "Gerber-tartó befogással",
      helyesTest: 0,
      testek: [
        { nev: "I", rudak: [[0, 0, xC, 0]], tamaszok: [{ x: xA, y: 0, tipus: "gorgo", cimke: "A" }], terhek: [{ x: x1, y: 0, Fx: 0, Fy: -F1, cimke: `F₁ = ${F1}` }], eltolas: [-26, 30], cimkeHely: [xC / 2, -0.9] },
        { nev: "II", rudak: [[xC, 0, xB, 0]], tamaszok: [{ x: xB, y: 0, tipus: "befogas", irany: "jobb", cimke: "B", cimkeDx: 14, cimkeDy: 28 }], terhek: [{ x: x2, y: 0, Fx: 0, Fy: -F2, cimke: `F₂ = ${F2}` }], eltolas: [26, -30], cimkeHely: [xC + LCB / 2, -0.9] },
      ],
      csuklo: [xC, 0],
      FC: 0,
      hossz: xB,
      magas: 0,
      meretek: [[0, xA], [xA, xC], [xC, xB]],
      // itt a csuklóerőt az I. testre kérdezzük (a befüggesztett részre), és a görgő reakcióját
      kerdes1: { id: "cy", cimke: "C_y az I. testre (↑ +)", helyes: r.Cy, egyseg: "kN", min: -20, max: 25, elsoTestre: true },
      kerdes2: { id: "a", cimke: "A reakció (↑ +)", helyes: r.A, egyseg: "kN", min: -20, max: 30 },
      magyarazat: [`\\text{I: } \\Mp{C}\\ ${tag(x1 - xC, -F1)} - ${szK(xC - xA, 1)}\\cdot A = 0 \\Rightarrow A = ${szK(r.A, 2)}`, `\\text{I: } \\Mp{A}\\ ${tag(x1 - xA, -F1)} + ${szK(LAC, 1)}\\cdot C_y = 0 \\Rightarrow C_y = ${szK(r.Cy, 2)}`],
      miert: "A befogás egyedül három ismeretlent hoz, ezért a II. test a fix rész; az I. test (görgő + belső csukló = 3) a befüggesztett rész, vele kell kezdeni.",
    };
  }
  // háromcsuklós keret, azonos magasságú támaszok
  const L = fel(6, 10), h = fel(3, 5);
  const xC = L / 2;
  const xF1 = fel(0.5, xC - 0.5), F1 = egesz(6, 20);
  const xF2 = fel(xC + 0.5, L - 0.5), F2 = egesz(4, 14);
  const r = haromcsuklosSzamit({ xB: L, yB: 0, xC, yC: h, terhekI: [{ x: xF1, y: h, Fx: 0, Fy: -F1 }], terhekII: [{ x: xF2, y: h, Fx: 0, Fy: -F2 }] });
  return {
    tipus,
    cim: "Háromcsuklós keret",
    helyesTest: "mind",
    testek: [
      { nev: "I", rudak: [[0, 0, 0, h], [0, h, xC, h]], tamaszok: [{ x: 0, y: 0, tipus: "csuklo", cimke: "A", cimkeDx: -18, cimkeDy: 26 }], terhek: [{ x: xF1, y: h, Fx: 0, Fy: -F1, cimke: `F₁ = ${F1}` }], eltolas: [-34, 0], cimkeHely: [0.7, h / 2] },
      { nev: "II", rudak: [[xC, h, L, h], [L, h, L, 0]], tamaszok: [{ x: L, y: 0, tipus: "csuklo", cimke: "B", cimkeDx: 18, cimkeDy: 26 }], terhek: [{ x: xF2, y: h, Fx: 0, Fy: -F2, cimke: `F₂ = ${F2}` }], eltolas: [34, 0], cimkeHely: [L - 0.7, h / 2] },
    ],
    csuklo: [xC, h],
    FC: 0,
    hossz: L,
    magas: h,
    meretek: [[0, xC], [xC, L]],
    kerdes1: { id: "cy", cimke: "C_y a II. testre (↑ +)", helyes: r.Cy, egyseg: "kN", min: -20, max: 20 },
    kerdes2: { id: "cx", cimke: "C_x a II. testre (→ +)", helyes: r.Cx, egyseg: "kN", min: -30, max: 30, vizszintes: true },
    magyarazat: [`\\Sigma: \\Mp{A}\\ ${tag(xF1, -F1)} ${tag(xF2, -F2)} + ${szK(L, 1)}\\cdot B_y = 0 \\Rightarrow B_y = ${szK(r.By, 2)}`, `\\text{II: } \\Mp{C}\\ ${tag(L - xC, r.By, 1, 2)} ${tag(xF2 - xC, -F2)} + ${szK(h, 1)}\\cdot B_x = 0 \\Rightarrow B_x = ${szK(r.Bx, 2)}`, `\\text{II: } \\Fx\\ C_x = -B_x = ${szK(r.Cx, 2)},\\quad \\Fy\\ C_y = ${F2} - B_y = ${szK(r.Cy, 2)}`],
    miert: "Mindkét testen négy ismeretlen van három egyenlethez — egyik testtel sem lehet kezdeni. Az egész szerkezetre írt ΣM_A és ΣM_B viszont egyismeretlenes (azonos magasságú támaszok).",
  };
}

export default function JatekSzetszed() {
  const [kor, setKor] = useState(1);
  const [adat, setAdat] = useState(null);
  const [fazis, setFazis] = useState("test"); // test | allit | ellenoriz | kesz
  const [valasztottTest, setValasztottTest] = useState(null);
  const [tipp, setTipp] = useState({ k1: 0, k2: 0 });
  const [pontok, setPontok] = useState([]);
  const [reszPont, setReszPont] = useState(0);
  const [anim, setAnim] = useState({ u: 1, raz: 0, villan: 0 });
  const svgRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    setAdat(ujKor(1));
  }, []);

  // ellenőrzéskor: összeugrás vagy rázkódás
  useEffect(() => {
    if (fazis !== "ellenoriz" || !adat) return undefined;
    const jo = relHiba(tipp.k1, adat.kerdes1.helyes) <= 0.06 && relHiba(tipp.k2, adat.kerdes2.helyes) <= 0.06;
    let kezdet = null;
    const lep = (most) => {
      if (kezdet == null) kezdet = most;
      const t = (most - kezdet) / 1000;
      if (jo) {
        const s = Math.min(1, t / 0.9);
        const e = 1 - Math.pow(1 - s, 3);
        setAnim({ u: 1 - e, raz: 0, villan: Math.max(0, 1 - t / 1.2) });
        if (t < 1.3) rafRef.current = requestAnimationFrame(lep);
      } else {
        const raz = t < 0.7 ? Math.sin(t * 40) * 8 * (1 - t / 0.7) : 0;
        setAnim({ u: 1, raz, villan: 0 });
        if (t < 0.75) rafRef.current = requestAnimationFrame(lep);
      }
    };
    rafRef.current = requestAnimationFrame(lep);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fazis]);

  const PX = adat ? Math.min(52, 440 / adat.hossz, adat.magas ? 170 / adat.magas : 52) : 50;
  const OX = adat ? (SZ - PX * adat.hossz) / 2 : 100;
  const OY = adat ? (adat.magas ? 300 : 200) : 200;
  const kx = (x) => OX + x * PX;
  const ky = (y) => OY - y * PX;
  const LEPTEK = 2.6;

  const valasztTest = (t) => {
    if (fazis !== "test" || !adat) return;
    setValasztottTest(t);
    const jo = t === adat.helyesTest;
    setReszPont(jo ? 20 : 0);
    setFazis("allit");
  };

  const huzas = (e) => {
    if (fazis !== "allit" || !adat) return;
    e.preventDefault();
    e.stopPropagation();
    const svg = svgRef.current;
    if (!svg) return;
    const [cx, cy] = adat.csuklo;
    const testIdx = adat.kerdes1.elsoTestre ? 0 : 1;
    const elt = adat.testek[testIdx].eltolas;
    const Y0 = ky(cy) + elt[1];
    const mozgat = (esem) => {
      const r = svg.getBoundingClientRect();
      const py = ((esem.clientY - r.top) / r.height) * MA;
      const v = clamp(felre((Y0 - py) / LEPTEK), adat.kerdes1.min, adat.kerdes1.max);
      setTipp((t) => ({ ...t, k1: v }));
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
    const h1 = relHiba(tipp.k1, adat.kerdes1.helyes), h2 = relHiba(tipp.k2, adat.kerdes2.helyes);
    const ertekPont = Math.max(0, Math.round(80 * (1 - ((h1 + h2) / 2) * 2.5)));
    setPontok((p) => [...p, Math.min(100, reszPont + ertekPont)]);
    setFazis("ellenoriz");
  };
  const kovetkezo = () => {
    if (kor >= OSSZ_KOR) {
      setFazis("kesz");
      return;
    }
    const uj = kor + 1;
    setKor(uj);
    setAdat(ujKor(uj));
    setTipp({ k1: 0, k2: 0 });
    setValasztottTest(null);
    setReszPont(0);
    setAnim({ u: 1, raz: 0, villan: 0 });
    setFazis("test");
  };
  const ujJatek = useCallback(() => {
    setKor(1);
    setPontok([]);
    setTipp({ k1: 0, k2: 0 });
    setValasztottTest(null);
    setReszPont(0);
    setAnim({ u: 1, raz: 0, villan: 0 });
    setAdat(ujKor(1));
    setFazis("test");
  }, []);

  const atlag = pontok.length ? pontok.reduce((s, p) => s + p, 0) / pontok.length : 0;
  const kesz = fazis === "kesz";
  const ellenorizve = fazis === "ellenoriz" || kesz;
  const jo = adat && ellenorizve && relHiba(tipp.k1, adat.kerdes1.helyes) <= 0.06 && relHiba(tipp.k2, adat.kerdes2.helyes) <= 0.06;
  const utolsoPont = pontok[pontok.length - 1];

  let uzenet = null;
  if (adat && fazis === "test") {
    uzenet = (
      <>
        <strong>{adat.cim}.</strong> Melyik résszel kezdenéd a számítást? Azt keresd, amelyiknek az egyensúlyi kijelentésében <strong>legfeljebb három</strong> ismeretlen van — vagy ahol az egészre írt egyenlet
        egyismeretlenes.
      </>
    );
  } else if (adat && fazis === "allit") {
    uzenet = (
      <>
        {valasztottTest === adat.helyesTest ? <strong className="text-emerald-700">Jó kezdés (+20). </strong> : <strong className="text-rose-700">Nem ezzel érdemes kezdeni (0). </strong>}
        {adat.miert} Most a szétszedett szerkezeten állítsd be a kék csuklóerőt (húzd a fogópontját vagy csúszkázz) és a kért reakciót, aztán ellenőrizz.
      </>
    );
  } else if (adat && ellenorizve) {
    uzenet = (
      <div>
        <p>
          {jo ? "A két test összeugrik — a csuklóerő stimmel. " : "A szerkezet megrázkódik: a csuklóban nem egyezik az erő. "}
          <span className="szamok">
            {utolsoPont} pont — helyesen <strong>{adat.kerdes1.cimke.split(" ")[0]} = {sz(adat.kerdes1.helyes, 2)}</strong>, <strong>{adat.kerdes2.cimke.split(" ")[0]} = {sz(adat.kerdes2.helyes, 2)}</strong> kN; a tipped {sz(tipp.k1, 1)}, {sz(tipp.k2, 1)} kN.
          </span>
        </p>
        <div className="szamok mt-1 text-[13px]">
          {adat.magyarazat.map((k, i) => (
            <MB key={i}>{k}</MB>
          ))}
        </div>
      </div>
    );
  }

  const szinC = ellenorizve ? (jo ? ZOLD : BORDO) : KEK;
  const hegyC = ellenorizve ? (jo ? "oh-zold" : "oh-bordo") : "oh-kek";

  return (
    <JatekKeret
      cim="Szedd szét és számold"
      leiras="Körönként egy összetett tartó. Először döntsd el, melyik testtel kezdenél (20 pont), aztán a szétszedett szerkezeten állítsd be a belső csuklóerőt és egy reakciót (80 pont). Ha stimmel, a két test összeugrik."
      pont={atlag}
      kor={kor}
      osszKor={OSSZ_KOR}
      kesz={kesz}
      onUj={ujJatek}
      uzenet={uzenet}
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
        <div className="racs-vilagos min-w-0 overflow-hidden rounded-xl border border-[color:var(--keret)]">
          <svg ref={svgRef} viewBox={`0 0 ${SZ} ${MA}`} className="abra h-auto w-full touch-none select-none">
            <TartoHegyek />
            <OsszetettHegyek />
            {anim.villan > 0 && <rect x="0" y="0" width={SZ} height={MA} fill="#86efac" opacity={anim.villan * 0.35} />}
            {adat && (
              <>
                {adat.testek.map((test, ti) => {
                  const szet = fazis === "test" ? 0 : anim.u;
                  const dx = test.eltolas[0] * szet + (ti === 0 ? -anim.raz : anim.raz);
                  const dy = test.eltolas[1] * szet;
                  const aktiv = fazis !== "test" || valasztottTest === ti || valasztottTest === "mind";
                  const kerdesItt = adat.kerdes1.elsoTestre ? ti === 0 : ti === 1;
                  return (
                    <g key={ti} transform={`translate(${dx} ${dy})`} opacity={fazis === "test" && valasztottTest !== null && !aktiv ? 0.4 : 1}>
                      <TestRajz {...test} kx={kx} ky={ky} tamaszOpacitas={1 - 0.7 * szet} csuklok={ti === 1 || szet < 0.05 ? [adat.csuklo] : []} />
                      <TestCimke x={kx(test.cimkeHely[0])} y={ky(test.cimkeHely[1])} aktiv={fazis === "test" && valasztottTest === ti} szin={ti === 0 ? "#0f766e" : "#0369a1"}>
                        {test.nev}
                      </TestCimke>
                      {/* a kérdezett csuklóerő nyila: a farka a csuklóban, a hegye a tipp szerint */}
                      {kerdesItt && fazis !== "test" && (
                        <g>
                          <EroNyil X={kx(adat.csuklo[0])} Y={ky(adat.csuklo[1])} Fx={0} Fy={tipp.k1} leptek={LEPTEK} minHossz={0} maxHossz={120} szin={szinC} hegy={hegyC} vastag={3.2} />
                          {adat.kerdes2.vizszintes && <EroNyil X={kx(adat.csuklo[0])} Y={ky(adat.csuklo[1])} Fx={tipp.k2} Fy={0} leptek={LEPTEK} minHossz={0} maxHossz={120} szin={szinC} hegy={hegyC} vastag={3.2} />}
                          {(() => {
                            const yv = ky(adat.csuklo[1]) - tipp.k1 * LEPTEK;
                            const xv = kx(adat.csuklo[0]);
                            return (
                              <g>
                                <text x={xv + 12} y={yv + 4} fontSize="12" fontWeight="650" style={{ fill: szinC, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
                                  C{adat.kerdes1.elsoTestre ? "′" : ""}ᵧ = {sz(tipp.k1, 1)}
                                </text>
                                {fazis === "allit" && (
                                  <g style={{ cursor: "ns-resize", touchAction: "none" }} onPointerDown={huzas}>
                                    <circle cx={xv} cy={yv} r="18" fill="transparent" />
                                    <circle cx={xv} cy={yv} r="7.5" fill="white" stroke={szinC} strokeWidth="2.5" />
                                    <path d={`M ${xv - 3} ${yv - 11} l 3 -4 l 3 4 M ${xv - 3} ${yv + 11} l 3 4 l 3 -4`} fill="none" stroke={szinC} strokeWidth="1.5" />
                                  </g>
                                )}
                              </g>
                            );
                          })()}
                        </g>
                      )}
                      {/* a másik testen a helyes ellentett erő (ellenőrzés után, halványan) */}
                      {!kerdesItt && ellenorizve && (
                        <EroNyil X={kx(adat.csuklo[0])} Y={ky(adat.csuklo[1])} Fx={adat.kerdes2.vizszintes ? -adat.kerdes2.helyes : 0} Fy={-(adat.FC ? adat.kerdes1.helyes + adat.FC : adat.kerdes1.helyes)} leptek={LEPTEK} minHossz={0} maxHossz={120} szin={ZOLD} hegy="oh-zold" vastag={2.2} opacitas={0.6} cimke="ellentett" />
                      )}
                      {/* a kérdezett reakció (nem vízszintes csuklóerő esetén) a saját testén */}
                      {!adat.kerdes2.vizszintes && fazis !== "test" && ((adat.kerdes2.id === "d" && ti === 1) || (adat.kerdes2.id === "a" && ti === 0)) && (
                        <EroNyil X={kx(adat.kerdes2.id === "d" ? adat.hossz : test.tamaszok[0].x)} Y={ky(0)} Fx={0} Fy={tipp.k2} leptek={LEPTEK} minHossz={0} maxHossz={120} szin={ellenorizve ? (relHiba(tipp.k2, adat.kerdes2.helyes) <= 0.06 ? ZOLD : BORDO) : LILA} hegy={ellenorizve ? (relHiba(tipp.k2, adat.kerdes2.helyes) <= 0.06 ? "oh-zold" : "oh-bordo") : "oh-lila"} vastag={3} cimke={`${adat.kerdes2.id.toUpperCase()} = ${sz(tipp.k2, 1)}`} />
                      )}
                    </g>
                  );
                })}
                {/* terhelt csukló: a teher a csuklón középen */}
                {adat.FC > 0 && (
                  <g>
                    <line x1={kx(adat.csuklo[0])} y1={ky(0) - 56} x2={kx(adat.csuklo[0])} y2={ky(0) - 8} stroke="#e2590a" strokeWidth="3" strokeLinecap="round" markerEnd="url(#oh-nar)" />
                    <text x={kx(adat.csuklo[0]) + 8} y={ky(0) - 40} fontSize="12" fontWeight="650" style={{ fill: "#e2590a", paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>F_C = {adat.FC} kN</text>
                    {fazis !== "test" && <circle cx={kx(adat.csuklo[0])} cy={ky(0)} r="7" fill="white" stroke="#1d3c48" strokeWidth="2" />}
                  </g>
                )}
                {fazis === "test" && <TamaszCimke x={kx(adat.csuklo[0])} y={ky(adat.csuklo[1]) - 12}>C</TamaszCimke>}
                {adat.meretek.map(([a, b], i) => (
                  <Meret key={i} x1={kx(a)} x2={kx(b)} y={MA - 30} cimke={`${sz(b - a, 1)} m`} opacitas={0.85} />
                ))}
              </>
            )}
            {ellenorizve && adat && (
              <text x={SZ / 2} y={26} textAnchor="middle" fontWeight="700" style={{ fontSize: 13, fill: jo ? ZOLD : BORDO, paintOrder: "stroke", stroke: "white", strokeWidth: 3.5 }}>
                {jo ? "Összeillik ✓" : "Nem illik össze ✗"}
              </text>
            )}
          </svg>
        </div>

        <div className="min-w-0 space-y-3">
          {adat && fazis === "test" && (
            <div className="space-y-1.5">
              <p className="text-[11px] font-bold tracking-[0.14em] text-petrol-500 uppercase">Mivel kezdenél?</p>
              {[
                [0, "I. testtel"],
                [1, "II. testtel"],
                ["mind", "Az egész szerkezettel"],
              ].map(([id, cimke]) => (
                <button key={String(id)} type="button" onClick={() => valasztTest(id)} className="w-full rounded-lg bg-white px-3 py-2 text-left text-[13px] font-semibold text-petrol-800 ring-1 ring-petrol-200 transition hover:bg-petrol-50">
                  {cimke}
                </button>
              ))}
            </div>
          )}
          {adat && fazis !== "test" && (
            <>
              <Csuszka cimke={adat.kerdes1.cimke} ertek={tipp.k1} egyseg="kN" min={adat.kerdes1.min} max={adat.kerdes1.max} lepes={0.5} tizedes={1} onChange={(v) => fazis === "allit" && setTipp((t) => ({ ...t, k1: v }))} />
              <Csuszka cimke={adat.kerdes2.cimke} ertek={tipp.k2} egyseg="kN" min={adat.kerdes2.min} max={adat.kerdes2.max} lepes={0.5} tizedes={1} onChange={(v) => fazis === "allit" && setTipp((t) => ({ ...t, k2: v }))} />
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
