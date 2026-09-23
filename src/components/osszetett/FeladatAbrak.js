/** A 6. modul kidolgozott feladatainak (GYF‑1…GYF‑6) ábrái – a feladatlapok rajzai számokkal. */

import { TartoHegyek, Tarto, Gorgo, Csuklo, Befogas, Rud, BelsoCsuklo, TeherNyil, Meret, MeretFugg, TamaszCimke } from "@/components/tartok/TartoElemek";
import { SZIN } from "@/components/tartok/szinek";

const KEK = "#2563eb";

function Keret({ children, magas = 230 }) {
  return (
    <svg viewBox={`0 0 600 ${magas}`} className="abra mx-auto h-auto w-full max-w-xl">
      <TartoHegyek />
      {children}
    </svg>
  );
}

function Rom({ x, y, children }) {
  return (
    <g>
      <rect x={x - 11} y={y - 10} width={22} height={15} rx="3" fill="white" stroke="#334155" strokeWidth="1.2" />
      <text x={x} y={y + 1.5} textAnchor="middle" fontSize="10.5" fontWeight="700" style={{ fill: "#334155" }}>
        {children}
      </text>
    </g>
  );
}

function RudJel({ x, y, alap, index }) {
  return (
    <text x={x} y={y} fontSize="12.5" fontStyle="italic" fontWeight="650" style={{ fill: KEK, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
      {alap}
      <tspan dy="3.5" fontSize="9">{index}</tspan>
    </text>
  );
}

/* GYF‑1: Gerber-tartó (tankönyv 5.4): A(0) csukló, B(4) görgő, C(6) csukló, D(9) görgő; F₁ = 12 kN (60°) x = 2, F₂ = 8 kN x = 8 */
export function AbraGyf1() {
  const OX = 60, Y = 120, L = 54;
  const kx = (x) => OX + x * L;
  return (
    <Keret magas={210}>
      <Tarto x1={kx(0)} y1={Y} x2={kx(9)} y2={Y} />
      <Csuklo x={kx(0)} y={Y} />
      <Gorgo x={kx(4)} y={Y} />
      <BelsoCsuklo x={kx(6)} y={Y} />
      <Gorgo x={kx(9)} y={Y} />
      <TeherNyil x={kx(2)} y={Y - 3} hossz={60} szog={-60} cimke="F₁ = 12 kN" cimkeEltolas={[-70, -6]} />
      <TeherNyil x={kx(8)} y={Y - 3} hossz={54} szog={-90} cimke="F₂ = 8 kN" cimkeEltolas={[6, -2]} />
      <text x={kx(2) - 34} y={Y - 12} fontSize="11.5" style={{ fill: SZIN.teher }}>60°</text>
      <TamaszCimke x={kx(0) - 16} y={Y + 28}>A</TamaszCimke>
      <TamaszCimke x={kx(4) + 16} y={Y + 28}>B</TamaszCimke>
      <TamaszCimke x={kx(6)} y={Y - 12}>C</TamaszCimke>
      <TamaszCimke x={kx(9) + 16} y={Y + 28}>D</TamaszCimke>
      <Rom x={kx(5)} y={Y + 42}>I</Rom>
      <Rom x={kx(7)} y={Y + 42}>II</Rom>
      <Meret x1={kx(0)} x2={kx(2)} y={Y + 70} cimke="2 m" />
      <Meret x1={kx(2)} x2={kx(4)} y={Y + 70} cimke="2 m" />
      <Meret x1={kx(4)} x2={kx(6)} y={Y + 70} cimke="2 m" />
      <Meret x1={kx(6)} x2={kx(8)} y={Y + 70} cimke="2 m" />
      <Meret x1={kx(8)} x2={kx(9)} y={Y + 70} cimke="1 m" />
    </Keret>
  );
}

/* GYF‑2: háromcsuklós keret (H05/2): A(0,0), E(0,6), C(6,6), G(12,4), B(12,0); p = 4 kN/m vízszintes az AE oszlopon, F = 12 kN a CG szakasz közepén */
export function AbraGyf2() {
  const OX = 130, OY = 236, L = 28;
  const kx = (x) => OX + x * L;
  const ky = (y) => OY - y * L;
  const nyilak = [];
  for (let i = 0; i <= 6; i += 1) nyilak.push(<line key={i} x1={kx(0) - 30} y1={ky(i)} x2={kx(0) - 4} y2={ky(i)} stroke={SZIN.teher} strokeWidth="1.6" markerEnd="url(#th-teher)" />);
  return (
    <Keret magas={290}>
      <Tarto x1={kx(0)} y1={ky(0)} x2={kx(0)} y2={ky(6)} />
      <Tarto x1={kx(0)} y1={ky(6)} x2={kx(6)} y2={ky(6)} />
      <Tarto x1={kx(6)} y1={ky(6)} x2={kx(12)} y2={ky(4)} />
      <Tarto x1={kx(12)} y1={ky(4)} x2={kx(12)} y2={ky(0)} />
      <Csuklo x={kx(0)} y={ky(0)} />
      <Csuklo x={kx(12)} y={ky(0)} />
      <BelsoCsuklo x={kx(6)} y={ky(6)} />
      <line x1={kx(0) - 30} y1={ky(0)} x2={kx(0) - 30} y2={ky(6)} stroke={SZIN.teher} strokeWidth="1.4" />
      {nyilak}
      <text x={kx(0) - 40} y={ky(3) + 4} textAnchor="end" fontSize="12.5" fontWeight="650" style={{ fill: SZIN.teher }}>p = 4 kN/m</text>
      <TeherNyil x={kx(9)} y={ky(5) - 3} hossz={50} szog={-90} cimke="F = 12 kN" cimkeEltolas={[8, 4]} />
      <TamaszCimke x={kx(0) - 18} y={ky(0) + 28}>A</TamaszCimke>
      <TamaszCimke x={kx(12) + 18} y={ky(0) + 28}>B</TamaszCimke>
      <TamaszCimke x={kx(6)} y={ky(6) - 12}>C</TamaszCimke>
      <TamaszCimke x={kx(0) - 12} y={ky(6) - 8}>E</TamaszCimke>
      <TamaszCimke x={kx(12) + 14} y={ky(4) - 4}>G</TamaszCimke>
      <Rom x={kx(1)} y={ky(3)}>I</Rom>
      <Rom x={kx(11)} y={ky(2)}>II</Rom>
      <Meret x1={kx(0)} x2={kx(6)} y={ky(0) + 42} cimke="3a = 6 m" />
      <Meret x1={kx(6)} x2={kx(9)} y={ky(0) + 42} cimke="3 m" />
      <Meret x1={kx(9)} x2={kx(12)} y={ky(0) + 42} cimke="3 m" />
      <MeretFugg x={kx(12) + 50} y1={ky(4)} y2={ky(6)} cimke="a = 2 m" />
      <MeretFugg x={kx(12) + 50} y1={ky(0)} y2={ky(4)} cimke="2a = 4 m" />
    </Keret>
  );
}

/* GYF‑3: Gerber befogással (H05/3): F = 12 kN a bal végen (balra-felfelé 30°), A görgő x = 2, C csukló x = 10, B befogás x = 14 */
export function AbraGyf3() {
  const OX = 110, Y = 110, L = 32;
  const kx = (x) => OX + x * L;
  return (
    <Keret magas={190}>
      <Tarto x1={kx(0)} y1={Y} x2={kx(14)} y2={Y} />
      <Gorgo x={kx(2)} y={Y} />
      <BelsoCsuklo x={kx(10)} y={Y} />
      <Befogas x={kx(14)} y={Y} irany="jobb" hossz={46} />
      {/* F a bal végen, balra-felfelé 30° — a nyíl a végpontból indul */}
      <line x1={kx(0)} y1={Y - 2} x2={kx(0) - 52 * Math.cos(Math.PI / 6)} y2={Y - 2 - 52 * Math.sin(Math.PI / 6)} stroke={SZIN.teher} strokeWidth="3" strokeLinecap="round" markerEnd="url(#th-teher)" />
      <text x={kx(0) - 34} y={Y - 40} textAnchor="middle" fontSize="12.5" fontWeight="650" style={{ fill: SZIN.teher }}>F = 12 kN</text>
      <text x={kx(0) - 24} y={Y - 8} textAnchor="end" fontSize="11" style={{ fill: SZIN.teher }}>α = 30°</text>
      <TamaszCimke x={kx(2)} y={Y + 44}>A</TamaszCimke>
      <TamaszCimke x={kx(10)} y={Y - 12}>C</TamaszCimke>
      <TamaszCimke x={kx(14) + 16} y={Y + 26}>B</TamaszCimke>
      <TamaszCimke x={kx(0)} y={Y + 20}>P</TamaszCimke>
      <Rom x={kx(6)} y={Y + 24}>I</Rom>
      <Rom x={kx(12)} y={Y + 24}>II</Rom>
      <Meret x1={kx(0)} x2={kx(2)} y={Y + 66} cimke="a = 2 m" />
      <Meret x1={kx(2)} x2={kx(10)} y={Y + 66} cimke="4a = 8 m" />
      <Meret x1={kx(10)} x2={kx(14)} y={Y + 66} cimke="2a = 4 m" />
    </Keret>
  );
}

/* GYF‑4: csuklóján terhelt Gerber-tartó (5.9): mint a GYF‑1, de a C csuklón F₂ = 10 kN, a II. testen F₃ = 6 kN */
export function AbraGyf4() {
  const OX = 60, Y = 120, L = 54;
  const kx = (x) => OX + x * L;
  return (
    <Keret magas={210}>
      <Tarto x1={kx(0)} y1={Y} x2={kx(9)} y2={Y} />
      <Csuklo x={kx(0)} y={Y} />
      <Gorgo x={kx(4)} y={Y} />
      <BelsoCsuklo x={kx(6)} y={Y} r={5.5} />
      <Gorgo x={kx(9)} y={Y} />
      <TeherNyil x={kx(2)} y={Y - 3} hossz={60} szog={-60} cimke="F₁ = 12 kN" cimkeEltolas={[-70, -6]} />
      <TeherNyil x={kx(6)} y={Y - 7} hossz={56} szog={-90} cimke="F₂ = 10 kN" cimkeEltolas={[6, -2]} />
      <TeherNyil x={kx(8)} y={Y - 3} hossz={44} szog={-90} cimke="F₃ = 6 kN" cimkeEltolas={[6, -2]} />
      <text x={kx(2) - 34} y={Y - 12} fontSize="11.5" style={{ fill: SZIN.teher }}>60°</text>
      <TamaszCimke x={kx(0) - 16} y={Y + 28}>A</TamaszCimke>
      <TamaszCimke x={kx(4) + 16} y={Y + 28}>B</TamaszCimke>
      <TamaszCimke x={kx(6)} y={Y + 20}>C</TamaszCimke>
      <TamaszCimke x={kx(9) + 16} y={Y + 28}>D</TamaszCimke>
      <Rom x={kx(5)} y={Y + 42}>I</Rom>
      <Rom x={kx(7.5)} y={Y + 42}>II</Rom>
      <Meret x1={kx(0)} x2={kx(2)} y={Y + 70} cimke="2 m" />
      <Meret x1={kx(2)} x2={kx(4)} y={Y + 70} cimke="2 m" />
      <Meret x1={kx(4)} x2={kx(6)} y={Y + 70} cimke="2 m" />
      <Meret x1={kx(6)} x2={kx(8)} y={Y + 70} cimke="2 m" />
      <Meret x1={kx(8)} x2={kx(9)} y={Y + 70} cimke="1 m" />
    </Keret>
  );
}

/* GYF‑5: rudakkal tartott terhelt csukló (H06/5–6): gerenda 0…14, A görgő 2, E 8, B csukló 14; oszlop E–C (8,6); D (0,6); rudak DC, DE; F = 12 kN D-n */
export function AbraGyf5() {
  const OX = 70, OY = 262, L = 30;
  const kx = (x) => OX + x * L;
  const ky = (y) => OY - y * L;
  return (
    <Keret magas={346}>
      <Tarto x1={kx(0)} y1={ky(0)} x2={kx(14)} y2={ky(0)} />
      <Tarto x1={kx(8)} y1={ky(0)} x2={kx(8)} y2={ky(6)} />
      <Gorgo x={kx(2)} y={ky(0)} />
      <Csuklo x={kx(14)} y={ky(0)} />
      <Rud x1={kx(0)} y1={ky(6)} x2={kx(8)} y2={ky(6)} />
      <Rud x1={kx(0)} y1={ky(6)} x2={kx(8)} y2={ky(0)} />
      {/* F: függőlegesen lefelé a D csuklóra (a hegye a D fölött) */}
      <TeherNyil x={kx(0)} y={ky(6) - 6} hossz={46} szog={-90} cimke="F = 12 kN" cimkeEltolas={[8, -4]} />
      <TamaszCimke x={kx(2)} y={ky(0) + 44}>A</TamaszCimke>
      <TamaszCimke x={kx(14)} y={ky(0) + 44}>B</TamaszCimke>
      <TamaszCimke x={kx(8) + 12} y={ky(0) + 20}>E</TamaszCimke>
      <TamaszCimke x={kx(8) + 12} y={ky(6) - 4}>C</TamaszCimke>
      <TamaszCimke x={kx(0) - 14} y={ky(6) + 4}>D</TamaszCimke>
      <RudJel x={kx(4) - 10} y={ky(6) - 8} alap="S" index="DC" />
      <RudJel x={kx(3.4)} y={ky(3) + 28} alap="S" index="DE" />
      <Rom x={kx(11)} y={ky(0) + 22}>I</Rom>
      <Meret x1={kx(0)} x2={kx(2)} y={ky(0) + 66} cimke="a = 2 m" />
      <Meret x1={kx(2)} x2={kx(8)} y={ky(0) + 66} cimke="3a = 6 m" />
      <Meret x1={kx(8)} x2={kx(14)} y={ky(0) + 66} cimke="3a = 6 m" />
      <MeretFugg x={kx(14) + 36} y1={ky(0)} y2={ky(6)} cimke="3a = 6 m" />
    </Keret>
  );
}

/* GYF‑6: függesztőműves tartó (5.13): A(0) csukló, C(4) csukló, B(8) görgő; D(2,2), E(6,2); F₁ = 12 kN x = 3, F₂ = 8 kN x = 5 */
export function AbraGyf6() {
  const OX = 80, OY = 150, L = 52;
  const kx = (x) => OX + x * L;
  const ky = (y) => OY - y * L;
  return (
    <Keret magas={240}>
      <Tarto x1={kx(0)} y1={ky(0)} x2={kx(8)} y2={ky(0)} />
      <Csuklo x={kx(0)} y={ky(0)} />
      <Gorgo x={kx(8)} y={ky(0)} />
      <BelsoCsuklo x={kx(4)} y={ky(0)} />
      <Rud x1={kx(0)} y1={ky(0)} x2={kx(2)} y2={ky(2)} />
      <Rud x1={kx(2)} y1={ky(2)} x2={kx(2)} y2={ky(0)} />
      <Rud x1={kx(2)} y1={ky(2)} x2={kx(6)} y2={ky(2)} />
      <Rud x1={kx(6)} y1={ky(2)} x2={kx(6)} y2={ky(0)} />
      <Rud x1={kx(6)} y1={ky(2)} x2={kx(8)} y2={ky(0)} />
      <TeherNyil x={kx(3)} y={ky(0) - 3} hossz={48} szog={-90} cimke="F₁ = 12 kN" cimkeEltolas={[6, -2]} />
      <TeherNyil x={kx(5)} y={ky(0) - 3} hossz={44} szog={-90} cimke="F₂ = 8 kN" cimkeEltolas={[6, -2]} />
      <TamaszCimke x={kx(0) - 16} y={ky(0) + 28}>A</TamaszCimke>
      <TamaszCimke x={kx(8) + 16} y={ky(0) + 28}>B</TamaszCimke>
      <TamaszCimke x={kx(4)} y={ky(0) + 20}>C</TamaszCimke>
      <TamaszCimke x={kx(2)} y={ky(2) - 10}>D</TamaszCimke>
      <TamaszCimke x={kx(6)} y={ky(2) - 10}>E</TamaszCimke>
      <TamaszCimke x={kx(2)} y={ky(0) + 20}>P</TamaszCimke>
      <TamaszCimke x={kx(6)} y={ky(0) + 20}>Q</TamaszCimke>
      <RudJel x={kx(0.7)} y={ky(1.3)} alap="S" index="1" />
      <RudJel x={kx(2) + 6} y={ky(0.55)} alap="S" index="2" />
      <RudJel x={kx(4) - 8} y={ky(2) - 8} alap="S" index="3" />
      <RudJel x={kx(6) + 6} y={ky(0.55)} alap="S" index="4" />
      <RudJel x={kx(7.1)} y={ky(1.3)} alap="S" index="5" />
      <Rom x={kx(1)} y={ky(0) + 40}>I</Rom>
      <Rom x={kx(7)} y={ky(0) + 40}>II</Rom>
      <Meret x1={kx(0)} x2={kx(2)} y={ky(0) + 62} cimke="2 m" />
      <Meret x1={kx(2)} x2={kx(3)} y={ky(0) + 62} cimke="1 m" />
      <Meret x1={kx(3)} x2={kx(4)} y={ky(0) + 62} cimke="1 m" />
      <Meret x1={kx(4)} x2={kx(5)} y={ky(0) + 62} cimke="1 m" />
      <Meret x1={kx(5)} x2={kx(6)} y={ky(0) + 62} cimke="1 m" />
      <Meret x1={kx(6)} x2={kx(8)} y={ky(0) + 62} cimke="2 m" />
      <MeretFugg x={kx(8) + 44} y1={ky(0)} y2={ky(2)} cimke="h = 2 m" />
    </Keret>
  );
}
