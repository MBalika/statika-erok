"use client";

import FeladatFilm from "@/components/anim/FeladatFilm";
import { arany, lerp, lukteto } from "@/components/anim/Idovonal";
import { FeliratA, VonalA, PontA } from "@/components/anim/FilmElemek";
import { TartoHegyek, Tarto, Gorgo, TeherNyil, ReakcioNyil, Meret, TamaszCimke } from "@/components/tartok/TartoElemek";

/*
 * GYF‑1 · Három görgő a gerendán — film.
 * A támaszok egymás után „bejönnek”, a számláló nő: 1, 2, 3 = 3. A hatásvonalak páronként metszik egymást:
 * határozott, a reakciók egyértelműek (A = 2,828, B = 1,000, C = 7,000 kN). Aztán az A görgőt vízszintes síkra
 * fordítjuk: a számláló továbbra is 3 = 3, de a három hatásvonal párhuzamos — a gerenda kicsúszik.
 */

export const SZ = { lila: "#7c3aed", nar: "#e2590a", bordo: "#be123c", zold: "#15803d", szurke: "#64748b", tarto: "#1d3c48", kek: "#0e7490" };

/** Számláló-doboz a film sarkában: e és i, a viszonyjel színezve. */
export function SzamlaloA({ x = 446, y = 18, e, i, opacitas = 1, allapot }) {
  if (opacitas <= 0.01) return null;
  const jel = e === i ? "=" : e > i ? ">" : "<";
  const szin = allapot === "jo" ? SZ.zold : allapot === "rossz" ? SZ.bordo : allapot === "lila" ? SZ.lila : e === i ? SZ.szurke : e > i ? SZ.bordo : SZ.lila;
  return (
    <g opacity={opacitas}>
      <rect x={x} y={y} width={140} height={42} rx="9" fill="white" stroke={szin} strokeWidth="1.4" />
      <text x={x + 10} y={y + 14} fontSize="8.5" fontWeight="700" style={{ fill: SZ.szurke }}>
        e · egyenlet
      </text>
      <text x={x + 130} y={y + 14} textAnchor="end" fontSize="8.5" fontWeight="700" style={{ fill: SZ.szurke }}>
        i · ismeretlen
      </text>
      <text x={x + 24} y={y + 35} textAnchor="middle" fontSize="17" fontWeight="800" style={{ fill: SZ.kek }}>
        {e}
      </text>
      <text x={x + 70} y={y + 35} textAnchor="middle" fontSize="18" fontWeight="900" style={{ fill: szin }}>
        {jel}
      </text>
      <text x={x + 116} y={y + 35} textAnchor="middle" fontSize="17" fontWeight="800" style={{ fill: SZ.lila }}>
        {i}
      </text>
    </g>
  );
}

/** Zöld/bordó ítélet-szalag a rajz alján. */
export function Itelet({ x = 300, y, szoveg, szin = SZ.zold, opacitas = 1, w }) {
  if (opacitas <= 0.01) return null;
  const sz = w ?? Math.max(160, 8.4 * szoveg.length);
  return (
    <g opacity={opacitas}>
      <rect x={x - sz / 2} y={y - 12} width={sz} height={24} rx="12" fill="white" stroke={szin} strokeWidth="1.4" />
      <text x={x} y={y + 4} textAnchor="middle" fontSize="12.5" fontWeight="700" style={{ fill: szin }}>
        {szoveg}
      </text>
    </g>
  );
}

const OX = 90;
const Y = 190;
const L = 70; // px / m
const XA = OX;
const XB = OX + 3 * L;
const XC = OX + 6 * L;
const XF = OX + 4.5 * L;

const T = { test: 0, a: 3, b: 5.5, c: 8, geo: 11, reak: 15.5, fordit: 20, csusz: 24 };

const FEJEZETEK = [
  { t0: T.test, cim: "A test és a teher", szoveg: "Egyetlen merev test: síkban három független egyensúlyi egyenlet írható rá. A számláló bal oldala tehát e = 3. Próbateher: F = 10 kN lefelé (x = 4,5 m) és H = 2 kN balra a tengelyben.", kepletek: ["e = 3\\cdot 1 = 3"] },
  { t0: T.a, cim: "A: görgő 45°-os síkon", szoveg: "Az első kényszer egy ferde görgő: a gördülési síkra merőleges reakció, iránya ismert, nagysága nem. Egy ismeretlen.", kepletek: ["i = 1"] },
  { t0: T.b, cim: "B: görgő vízszintes síkon", szoveg: "Függőleges reakció, egy ismeretlen. Még mindig kevés: 3 > 2, a test mozogna.", kepletek: ["i = 2"] },
  { t0: T.c, cim: "C: még egy görgő", szoveg: "A harmadik egyfokú kényszerrel a számlálás rendben: e = i = 3. Ez a határozottság SZÜKSÉGES feltétele — de nem elégséges.", kepletek: ["e = i = 3\\quad\\text{(lehet határozott)}"] },
  { t0: T.geo, cim: "Geometriai ellenőrzés", szoveg: "A három reakció hatásvonala: A ferde, B és C függőleges. Páronként metszik egymást, nem párhuzamosak, nincs közös pontjuk. A B és C metszéspontjára írt nyomatéki egyenletben csak A marad — egyismeretlenes egyenletek sorozata létezik.", kepletek: ["\\Fx\\to A,\\quad \\Mp{B}\\to C,\\quad \\Fy\\to B"] },
  { t0: T.reak, cim: "Egy teherre egyértelmű megoldás", szoveg: "Ha egyetlen teherre egyértelmű megoldást találunk, az e = i egyenlőséggel együtt már bizonyítja a határozottságot (tankönyv 7.3.1).", kepletek: ["\\Fx A\\cos 45^\\circ - 2 = 0 \\Rightarrow A = 2{,}828", "\\Mp{B} -10\\cdot 1{,}5 - 2\\cdot 3 + 3\\,C = 0 \\Rightarrow C = 7{,}000", "\\Fy 2 + B + 7 - 10 = 0 \\Rightarrow B = 1{,}000\\ \\text{kN}"] },
  { t0: T.fordit, cim: "Az A görgőt vízszintes síkra fordítjuk", szoveg: "A számláló meg sem rezdül: továbbra is 3 = 3. De a három hatásvonal most párhuzamos — a vízszintes vetületi egyenletben egyetlen reakció sem szerepel.", kepletek: ["\\Fx -2 = 0\\quad ?!"] },
  { t0: T.csusz, cim: "Kritikus elrendezés: kicsúszik", szoveg: "Vízszintes teherre nincs egyensúly (túlhatározott), csak függőleges teherre pedig három ismeretlenre két egyenlet jut (határozatlan). Határozatlan és túlhatározott szerkezet — nem tartó, pedig e = i.", kepletek: ["e - i = 3 - 3 = 1 - 1\\ \\text{(szabad mozgás − fölös kényszer)}"] },
];

function Rajz(t) {
  const tartoU = arany(t, 0.2, 1.2);
  const teherU = arany(t, 1.0, 2.2);
  const aU = arany(t, T.a + 0.2, T.a + 1.2);
  const bU = arany(t, T.b + 0.2, T.b + 1.2);
  const cU = arany(t, T.c + 0.2, T.c + 1.2);
  const geoU = arany(t, T.geo + 0.2, T.geo + 1.6);
  const metszU = arany(t, T.geo + 1.4, T.geo + 2.6);
  const reakU = arany(t, T.reak + 0.2, T.reak + 1.4);
  const forditU = arany(t, T.fordit + 0.3, T.fordit + 2.0);
  const csuszU = arany(t, T.csusz + 0.2, T.csusz + 1.6);
  const leng = t > T.csusz + 1.6 ? 0.12 * Math.sin(2 * Math.PI * (t - T.csusz - 1.6) / 2.4) : 0;
  const i = Math.round(aU) + Math.round(bU) + Math.round(cU);
  const szogA = lerp(45, 90, forditU); // az A reakció iránya (fok)
  const dx = (csuszU + leng) * 42; // eltolódás px
  const kritikus = forditU > 0.99;
  const allapot = t < T.c + 1 ? undefined : kritikus ? "rossz" : t >= T.geo + 2.6 ? "jo" : undefined;

  const rad = (szogA * Math.PI) / 180;
  const hv = (x, szog, hossz) => {
    const r = (szog * Math.PI) / 180;
    return { x1: x - hossz * Math.cos(r), y1: Y + hossz * Math.sin(r), x2: x + hossz * Math.cos(r), y2: Y - hossz * Math.sin(r) };
  };
  const vA = hv(XA, szogA, 120);
  const vB = hv(XB, 90, 120);
  const vC = hv(XC, 90, 120);
  // A és B metszéspontja (csak ha nem párhuzamos)
  const metszAB = Math.abs(Math.cos(rad)) > 0.02 ? { x: XB, y: Y - (XB - XA) * Math.tan(rad) } : null;

  return (
    <svg viewBox="0 0 600 330" className="abra w-full select-none">
      <TartoHegyek />
      <SzamlaloA e={3} i={i} opacitas={tartoU} allapot={allapot} />

      {/* hatásvonalak */}
      <g opacity={geoU * (kritikus ? 1 : 0.9)}>
        <VonalA {...vA} u={geoU} szin={kritikus ? SZ.bordo : SZ.szurke} vastag={1.2} />
        <VonalA {...vB} u={geoU} szin={kritikus ? SZ.bordo : SZ.szurke} vastag={1.2} />
        <VonalA {...vC} u={geoU} szin={kritikus ? SZ.bordo : SZ.szurke} vastag={1.2} />
        {metszAB && metszAB.y > 20 && metszAB.y < 320 && <PontA x={metszAB.x} y={metszAB.y} r={5} szin={SZ.zold} u={metszU * (1 - forditU)} />}
        {!kritikus && <FeliratA x={XB + 12} y={(metszAB?.y ?? 60) - 6} szin={SZ.zold} meret={11} opacitas={metszU * (1 - forditU)} horgony="start">A∩B: ide nyomatékot → C</FeliratA>}
      </g>

      {/* támaszok (a helyükön maradnak) */}
      <g opacity={aU} transform={`translate(0 ${(1 - aU) * 30})`}>
        <Gorgo x={XA} y={Y} szog={szogA - 90} meret={15} />
      </g>
      <g opacity={bU} transform={`translate(0 ${(1 - bU) * 30})`}>
        <Gorgo x={XB} y={Y} meret={15} />
      </g>
      <g opacity={cU} transform={`translate(0 ${(1 - cU) * 30})`}>
        <Gorgo x={XC} y={Y} meret={15} />
      </g>
      <TamaszCimke x={XA - 26} y={Y + 44}>A</TamaszCimke>
      <TamaszCimke x={XB} y={Y + 50}>B</TamaszCimke>
      <TamaszCimke x={XC} y={Y + 50}>C</TamaszCimke>
      <Meret x1={XA} x2={XB} y={Y + 70} cimke="3 m" opacitas={0.8} />
      <Meret x1={XB} x2={XC} y={Y + 70} cimke="3 m" opacitas={0.8} />

      {/* a tartó a terhekkel — ez csúszik el */}
      <g transform={`translate(${dx} 0)`} opacity={tartoU}>
        <Tarto x1={XA - 6} y1={Y} x2={XC + 6} y2={Y} szin={kritikus ? "#9f1239" : allapot === "jo" ? "#166534" : SZ.tarto} />
        <TeherNyil x={XF} y={Y - 3} hossz={62} szog={-90} cimke="F = 10 kN" cimkeEltolas={[8, -2]} opacitas={teherU} />
        <TeherNyil x={XB} y={Y} hossz={44} szog={180} cimke="H = 2 kN" cimkeEltolas={[6, -8]} opacitas={teherU} />
      </g>

      {/* reakciók */}
      <g opacity={reakU * (1 - forditU)}>
        <ReakcioNyil x={XA} y={Y + 4} hossz={44} szog={45} cimke="A = 2,828" cimkeEltolas={[-70, 10]} />
        <ReakcioNyil x={XB} y={Y + 4} hossz={30} szog={90} cimke="B = 1,000" cimkeEltolas={[8, 4]} />
        <ReakcioNyil x={XC} y={Y + 4} hossz={66} szog={90} cimke="C = 7,000" cimkeEltolas={[8, 4]} />
      </g>

      {/* ítélet */}
      <Itelet y={300} szoveg="3 = 3, és a hatásvonalak páronként metszik egymást → határozott ✓" opacitas={metszU * (1 - forditU)} />
      <Itelet y={300} szoveg="3 = 3, de párhuzamos hatásvonalak → kritikus, kicsúszik" szin={SZ.bordo} opacitas={csuszU} />
      {kritikus && csuszU > 0.5 && (
        <FeliratA x={300} y={Y - 92} szin={SZ.bordo} meret={12} opacitas={csuszU * (0.6 + 0.4 * lukteto(t, 1))}>
          ΣFₓ: −2 = 0 — ellentmondás, nincs egyensúly
        </FeliratA>
      )}
    </svg>
  );
}

export default function FilmGyf1() {
  return (
    <FeladatFilm
      cim="GYF‑1 · Három görgő — a számlálás és a geometria"
      hossz={29}
      fejezetek={FEJEZETEK}
      rajz={Rajz}
      megjegyzes="A támaszok a helyükön maradnak, a test mozog. A számláló-doboz jobbra fent: a szín az ítéletet mutatja, nem csak a számokat — a végén 3 = 3 mellett is piros."
    />
  );
}
