/**
 * Az 5. modul kidolgozott feladatainak (GYF‑1…GYF‑6) statikus ábrái – a H03 és H04
 * szintemelő feladatlapok rajzai nyomán, a TartoElemek közös rajzelemeivel.
 * Koordináták: képernyő (y lefelé nő); a tartó vastag vonal, a terhek narancs,
 * a méretek a tartó alatt.
 */

import {
  TartoHegyek,
  Tarto,
  Gorgo,
  Csuklo,
  Befogas,
  Rud,
  TeherNyil,
  MegoszloTeher,
  KoncentraltNyomatek,
  Meret,
  MeretFugg,
  TamaszCimke,
} from "@/components/tartok/TartoElemek";

const SZURKE = "#64748b";
const FOK = Math.PI / 180;

/** Szögjelölő ív (x, y) körül, r sugárral, kezdo…veg fok között (matematikai irány, 0 = jobbra, 90 = fel). */
function SzogIv({ x, y, r = 30, kezdo, veg, cimke, cimkeR, szin = SZURKE }) {
  const k = -kezdo * FOK;
  const v = -veg * FOK;
  const x1 = x + r * Math.cos(k);
  const y1 = y + r * Math.sin(k);
  const x2 = x + r * Math.cos(v);
  const y2 = y + r * Math.sin(v);
  const sweep = veg > kezdo ? 0 : 1;
  const kozep = (-(kezdo + veg) / 2) * FOK;
  const rc = cimkeR ?? r + 12;
  return (
    <g>
      <path d={`M ${x1} ${y1} A ${r} ${r} 0 0 ${sweep} ${x2} ${y2}`} fill="none" stroke={szin} strokeWidth="1.2" />
      {cimke && (
        <text x={x + rc * Math.cos(kozep)} y={y + rc * Math.sin(kozep) + 4} textAnchor="middle" fontSize="12.5" fontStyle="italic" style={{ fill: szin, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
          {cimke}
        </text>
      )}
    </g>
  );
}

/** Kis pont a tartón (csatlakozás, vonatkoztatási pont). */
function Pont({ x, y, r = 3.2 }) {
  return <circle cx={x} cy={y} r={r} fill="#0f172a" />;
}

/* ============================================================
   GYF‑1 · Befogott konzol (H03/3)
   ============================================================ */
export function AbraGyf1() {
  const OX = 80;
  const Y = 118;
  const L = 140; // px / a
  const xA = OX;
  const x1 = OX + L;
  const x2 = OX + 2 * L;
  const xB = OX + 3 * L;
  return (
    <svg viewBox="0 0 600 210" className="abra w-full h-auto">
      <TartoHegyek />
      <Befogas x={xA} y={Y} irany="bal" hossz={56} />
      <Tarto x1={xA} y1={Y} x2={xB} y2={Y} />
      <TamaszCimke x={xA + 14} y={Y + 20}>A</TamaszCimke>
      <TamaszCimke x={xB} y={Y + 22}>B</TamaszCimke>
      {/* F₁: jobbra-lefelé, a vízszintessel α₁ szöget zár be */}
      <TeherNyil x={x1} y={Y} hossz={64} szog={-60} cimke="F₁" cimkeEltolas={[6, -6]} />
      <SzogIv x={x1} y={Y} r={30} kezdo={120} veg={180} cimke="α₁" cimkeR={44} />
      {/* M: az óramutató járásával megegyező */}
      <KoncentraltNyomatek x={x2} y={Y} r={18} irany={-1} cimke="M" />
      <TeherNyil x={xB} y={Y} hossz={60} szog={-90} cimke="F₂" cimkeEltolas={[8, -4]} />
      <Meret x1={xA} x2={x1} y={Y + 52} cimke="a" />
      <Meret x1={x1} x2={x2} y={Y + 52} cimke="a" />
      <Meret x1={x2} x2={xB} y={Y + 52} cimke="a" />
    </svg>
  );
}

/* ============================================================
   GYF‑2 · Konzolos kéttámaszú tartó (H03/4)
   ============================================================ */
export function AbraGyf2() {
  const OX = 70;
  const Y = 112;
  const L = 115;
  const x0 = OX;
  const xA = OX + L;
  const xB = OX + 3 * L;
  const x4 = OX + 4 * L;
  return (
    <svg viewBox="0 0 600 210" className="abra w-full h-auto">
      <TartoHegyek />
      <Tarto x1={x0} y1={Y} x2={x4} y2={Y} />
      <Csuklo x={xA} y={Y} />
      <Gorgo x={xB} y={Y} />
      <TamaszCimke x={xA} y={Y + 46}>A</TamaszCimke>
      <TamaszCimke x={xB} y={Y + 52}>B</TamaszCimke>
      {/* F₁: balra-lefelé, a vízszintessel α₁ szöget zár be (a rajz szerint) */}
      <TeherNyil x={x0} y={Y} hossz={64} szog={-150} cimke="F₁" cimkeEltolas={[-22, -4]} />
      <SzogIv x={x0} y={Y} r={34} kezdo={0} veg={30} cimke="α₁" cimkeR={48} />
      <TeherNyil x={x4} y={Y} hossz={60} szog={-90} cimke="F₂" cimkeEltolas={[8, -4]} />
      <Meret x1={x0} x2={xA} y={Y + 74} cimke="a" />
      <Meret x1={xA} x2={xB} y={Y + 74} cimke="2a" />
      <Meret x1={xB} x2={x4} y={Y + 74} cimke="a" />
    </svg>
  );
}

/* ============================================================
   GYF‑3 · Rúddal és csuklóval megtámasztott gerenda (H03/5)
   ============================================================ */
export function AbraGyf3() {
  const OX = 90;
  const Y = 84;
  const L = 100;
  const x0 = OX;
  const xC = OX + 2 * L;
  const xB = OX + 4 * L;
  const yA = Y + L; // az A talajcsukló a gerenda alatt a-val
  return (
    <svg viewBox="0 0 600 250" className="abra w-full h-auto">
      <TartoHegyek />
      <MegoszloTeher x1={x0} x2={xC} y={Y} p1={5} leptek={6} cimke1="p₁" />
      <Rud x1={x0} y1={yA} x2={xC} y2={Y} />
      <Tarto x1={x0} y1={Y} x2={xB} y2={Y} />
      <Csuklo x={x0} y={yA} />
      <Csuklo x={xB} y={Y} />
      <Pont x={xC} y={Y} />
      <TamaszCimke x={x0 - 18} y={yA - 6}>A</TamaszCimke>
      <TamaszCimke x={xB} y={Y + 46}>B</TamaszCimke>
      <TamaszCimke x={xC + 12} y={Y + 18}>C</TamaszCimke>
      <MeretFugg x={x0 - 44} y1={Y} y2={yA} cimke="a" />
      <Meret x1={x0} x2={xC} y={yA + 44} cimke="2a" />
      <Meret x1={xC} x2={xB} y={yA + 44} cimke="2a" />
    </svg>
  );
}

/* ============================================================
   GYF‑4 · Tört tengelyű befogott tartó (H04/2)
   ============================================================ */
export function AbraGyf4() {
  const OX = 150;
  const Y0 = 80; // a vízszintes szár
  const L = 150;
  const xA = OX + L;
  const xB = OX + 2 * L;
  const yF = Y0 + L; // a függőleges szár alsó vége
  return (
    <svg viewBox="0 0 600 290" className="abra w-full h-auto">
      <TartoHegyek />
      <Befogas x={xB} y={Y0} irany="jobb" hossz={56} />
      {/* felfelé mutató háromszögteher: 0 az x = 0-nál, p az x = a-nál (negatív p = felfelé) */}
      <MegoszloTeher x1={OX} x2={xA} y={Y0} p1={0} p2={-4} leptek={9} cimke2="p" />
      <Tarto x1={OX} y1={yF} x2={OX} y2={Y0} />
      <Tarto x1={OX} y1={Y0} x2={xB} y2={Y0} />
      <TeherNyil x={OX} y={yF} hossz={64} szog={0} cimke="F" cimkeEltolas={[6, -8]} />
      <TamaszCimke x={xB + 14} y={Y0 - 14}>B</TamaszCimke>
      <Meret x1={OX} x2={xA} y={yF + 34} cimke="a" />
      <Meret x1={xA} x2={xB} y={yF + 34} cimke="a" />
      <MeretFugg x={xB + 60} y1={Y0} y2={yF} cimke="a" />
    </svg>
  );
}

/* ============================================================
   GYF‑5 · Keret csuklóval és ferde görgővel (H04/3)
   ============================================================ */
export function AbraGyf5() {
  const OX = 110;
  const yA = 250;
  const L = 90;
  const yT = yA - 2 * L; // a gerenda
  const xJ = OX + 3 * L; // a jobb oszlop
  const yB = yA - L;
  const xM = OX + L;
  return (
    <svg viewBox="0 0 600 300" className="abra w-full h-auto">
      <TartoHegyek />
      <Tarto x1={OX} y1={yA} x2={OX} y2={yT} />
      <Tarto x1={OX} y1={yT} x2={xJ} y2={yT} />
      <Tarto x1={xJ} y1={yT} x2={xJ} y2={yB} />
      <Csuklo x={OX} y={yA} />
      <Gorgo x={xJ} y={yB} szog={30} />
      {/* a gördülési sík hajlásszöge */}
      <line x1={xJ - 70} y1={yB + 67} x2={xJ + 30} y2={yB + 67} stroke={SZURKE} strokeWidth="1" />
      <line x1={xJ - 70} y1={yB + 67} x2={xJ + 30} y2={yB + 67 - 100 * Math.tan(30 * FOK)} stroke={SZURKE} strokeWidth="1" />
      <SzogIv x={xJ - 70} y={yB + 67} r={36} kezdo={0} veg={30} cimke="α" cimkeR={50} />
      <TamaszCimke x={OX - 24} y={yA - 4}>A</TamaszCimke>
      <TamaszCimke x={xJ - 16} y={yB + 12}>B</TamaszCimke>
      {/* M: az óramutató járásával megegyező */}
      <KoncentraltNyomatek x={xM} y={yT} r={18} irany={-1} cimke="M" />
      <Meret x1={OX} x2={xM} y={yA + 34} cimke="a" />
      <Meret x1={xM} x2={xJ} y={yA + 34} cimke="2a" />
      <MeretFugg x={xJ + 80} y1={yT} y2={yB} cimke="a" />
      <MeretFugg x={xJ + 80} y1={yB} y2={yA} cimke="a" />
    </svg>
  );
}

/* ============================================================
   GYF‑6 · Vízzel terhelt ferde gerenda (H04/4)
   ============================================================ */
export function AbraGyf6() {
  const xA = 110;
  const yA = 250;
  const L = 70; // px / a
  const AL = 30;
  const tg = Math.tan(AL * FOK);
  const xB = xA + (2 * L) / tg; // 2a magasan
  const yB = yA - 2 * L;
  const yV = yA - L; // vízszint
  const xV = xA + L / tg; // ahol a vízszint metszi a gerendát
  // nyomásnyilak a gerendára merőlegesen (jobbra-lefelé), a merült szakaszon
  const n = 6;
  const nyilak = [];
  for (let i = 0; i < n; i++) {
    const s = i / n; // 0 = A-nál (legnagyobb nyomás)
    const px = xA + (xV - xA) * s;
    const py = yA + (yV - yA) * s;
    const h = 34 * (1 - s);
    if (h < 3) continue;
    nyilak.push(<TeherNyil key={i} x={px} y={py} hossz={h} szog={-60} vastag={1.6} />);
  }
  return (
    <svg viewBox="0 0 600 300" className="abra w-full h-auto">
      <TartoHegyek />
      {/* a víztömeg */}
      <path d={`M ${xA - 60} ${yA} L ${xA} ${yA} L ${xV} ${yV} L ${xA - 60} ${yV} Z`} fill="#7dd3fc" opacity="0.32" />
      <line x1={xA - 60} y1={yV} x2={xV} y2={yV} stroke="#0284c7" strokeWidth="1.2" />
      {/* ∇ vízszint-jel */}
      <path d={`M ${xA - 38} ${yV - 12} L ${xA - 22} ${yV - 12} L ${xA - 30} ${yV} Z`} fill="none" stroke="#0284c7" strokeWidth="1.2" />
      <line x1={xA - 36} y1={yV + 4} x2={xA - 24} y2={yV + 4} stroke="#0284c7" strokeWidth="1" />
      <line x1={xA - 34} y1={yV + 8} x2={xA - 26} y2={yV + 8} stroke="#0284c7" strokeWidth="1" />
      {/* fenék, talaj */}
      <line x1={xA - 70} y1={yA} x2={xA + 120} y2={yA} stroke={SZURKE} strokeWidth="1.2" />
      {nyilak}
      <Tarto x1={xA} y1={yA} x2={xB} y2={yB} />
      <Csuklo x={xA} y={yA} />
      <Gorgo x={xB} y={yB} />
      <SzogIv x={xA} y={yA} r={44} kezdo={0} veg={30} cimke="α" cimkeR={58} />
      <TamaszCimke x={xA - 26} y={yA + 18}>A</TamaszCimke>
      <TamaszCimke x={xB + 26} y={yB + 4}>B</TamaszCimke>
      <text x={xA - 66} y={yA + 44} fontSize="11.5" style={{ fill: "#0369a1" }}>
        víz: γ; a rajzra merőleges szélesség a/10
      </text>
      <MeretFugg x={xB + 70} y1={yB} y2={yV} cimke="a" />
      <MeretFugg x={xB + 70} y1={yV} y2={yA} cimke="a" />
    </svg>
  );
}
