"use client";

import FeladatFilm from "@/components/anim/FeladatFilm";
import { arany, lukteto } from "@/components/anim/Idovonal";
import { Hegy, NyilA, VonalA, FeliratA, PontA } from "@/components/anim/FilmElemek";

/*
 * GYF‑2 · A K1 és K2 keresztmetszet térbeli igénybevételei (H13/2) — 2D film, síkba vetítve.
 * A tört tengelyű konzol (a = 2, b = 3 m), F = 10 kN a −z irányban az E(−2; 3; 0) végponton.
 * Bal panel: elölnézet (xy sík) — az F ⊗ (befelé). Jobb panel: felülnézet (zx sík) — az F nyíl.
 * Eredmény: K1: V_z = −10, M_x = −20, T = M_y = −20;  K2: V_z = 10, M_y = 10.
 */

const SZ = { tarto: "#1d3c48", nar: "#e2590a", kek: "#0369a1", bordo: "#be123c", szurke: "#64748b", sarga: "#b45309", zold: "#0f766e" };

// elölnézet (xy): x jobbra, y felfelé; 1 m = 40 px; A az (250, 300) pontban
const S = 40;
const XA = 270;
const YA = 300;
const ex = (x, y) => [XA + x * S, YA - y * S];
// felülnézet (zx): x jobbra, z lefelé a rajzon; A a (470, 250) pontban
const XT = 450;
const YT = 250;
const fel = (x, z) => [XT + x * S, YT + z * S];

const FEJEZETEK = [
  {
    t0: 0,
    cim: "Két nézet a térbeli feladatról",
    szoveg: "Bal oldalt az elölnézet (xy sík): itt az F erő a −z irányba, a rajz síkjába befelé mutat, ezért ⊗ jellel rajzoljuk. Jobb oldalt a felülnézet (zx sík): a függőleges szár pontként látszik, F pedig nyílként.",
    kepletek: ["\\underline F = (0;\\ 0;\\ -10)\\ \\text{kN},\\qquad K_1(0;\\ 1;\\ 0),\\quad K_2(-1;\\ 3;\\ 0)"],
  },
  {
    t0: 5,
    cim: "K2: elvágjuk a vízszintes szárat",
    szoveg: "A K2-től balra a szabad vég marad (megelőző rész, a tengely az x). Rá csak F hat. A belső erő a rész egyensúlyából: R = −F, azaz a keresztmetszeten +z irányú, 10 kN nyíróerő.",
    kepletek: ["\\underline R_{K2} = -\\underline F = (0;\\ 0;\\ 10) \\;\\Rightarrow\\; V_z = 10\\ \\text{kN},\\quad N = V_y = 0"],
  },
  {
    t0: 10,
    cim: "K2: a nyomaték — kar a felülnézetben",
    szoveg: "F az y tengellyel párhuzamos tengely körül forgat: a felülnézetben látszik az 1 m-es kar (E és K2 távolsága). A tengelyirányú (x) komponens nulla: az erő hatásvonala metszi a szár tengelyét, nem csavar.",
    kepletek: ["\\underline M_{K2} = -(\\underline r_E - \\underline r_{K2})\\times\\underline F = -(-1;0;0)\\times(0;0;-10) = (0;\\ 10;\\ 0)", "T = M_x = 0,\\quad M_y = 10\\ \\text{kNm},\\quad M_z = 0"],
  },
  {
    t0: 15.5,
    cim: "K1: elvágjuk a függőleges szárat",
    szoveg: "A K1 fölötti rész a követő rész (a tengely az y felfelé mutat). Rá szintén csak F hat: R = +F, a keresztmetszeten −z irányú 10 kN nyíróerő. A normálerő nulla: F merőleges az y tengelyre.",
    kepletek: ["\\underline R_{K1} = \\underline F = (0;\\ 0;\\ -10) \\;\\Rightarrow\\; V_z = -10\\ \\text{kN},\\quad N = V_x = 0"],
  },
  {
    t0: 20.5,
    cim: "K1: hajlítás és csavarás — két kar",
    szoveg: "Az elölnézetben látszik az x tengely körüli kar: F 2 m-rel magasabban hat, mint K1 → M_x = 2·10 = 20 kNm hajlítás. A felülnézetben látszik az y (tengely) körüli kar: a 2 m-es kinyúlás → T = 20 kNm csavarás. Az előjelek a jobbkéz-szabályból negatívak.",
    kepletek: ["\\underline M_{K1} = (\\underline r_E - \\underline r_{K1})\\times\\underline F = (-2;\\ 2;\\ 0)\\times(0;\\ 0;\\ -10) = (-20;\\ -20;\\ 0)", "M_x = -20,\\quad T = M_y = -20\\ \\text{kNm},\\quad M_z = 0"],
  },
  {
    t0: 26,
    cim: "Összefoglalás",
    szoveg: "K1: V_z = −10 kN, M_x = −20 kNm, T = −20 kNm (N = V_x = M_z = 0). K2: V_z = 10 kN, M_y = 10 kNm (N = V_y = T = M_z = 0). A csavarás csak ott jelenik meg, ahol az erő hatásvonala kitérő a szár tengelyéhez képest.",
    kepletek: ["K_1:\\ (0;\\ 0;\\ -10)\\ \\text{kN},\\ (-20;\\ -20;\\ 0)\\ \\text{kNm};\\qquad K_2:\\ (0;\\ 0;\\ 10)\\ \\text{kN},\\ (0;\\ 10;\\ 0)\\ \\text{kNm}"],
  },
];

function Kereszt({ x, y, r = 7, szin, opacitas = 1 }) {
  if (opacitas <= 0.01) return null;
  return (
    <g opacity={opacitas}>
      <circle cx={x} cy={y} r={r} fill="white" stroke={szin} strokeWidth="2" />
      <line x1={x - r * 0.65} y1={y - r * 0.65} x2={x + r * 0.65} y2={y + r * 0.65} stroke={szin} strokeWidth="2" />
      <line x1={x - r * 0.65} y1={y + r * 0.65} x2={x + r * 0.65} y2={y - r * 0.65} stroke={szin} strokeWidth="2" />
    </g>
  );
}
function Pont({ x, y, r = 7, szin, opacitas = 1 }) {
  if (opacitas <= 0.01) return null;
  return (
    <g opacity={opacitas}>
      <circle cx={x} cy={y} r={r} fill="white" stroke={szin} strokeWidth="2" />
      <circle cx={x} cy={y} r={r * 0.32} fill={szin} />
    </g>
  );
}

export function Rajz(t) {
  const be = arany(t, 0.2, 1.4);
  const k2 = arany(t, 5.3, 6.5);
  const k2ero = arany(t, 6.6, 8);
  const k2kar = arany(t, 10.3, 11.8);
  const k2M = arany(t, 11.8, 13.2);
  const k1 = arany(t, 15.8, 17);
  const k1ero = arany(t, 17.1, 18.5);
  const k1kar = arany(t, 20.8, 22.2);
  const k1M = arany(t, 22.2, 24);
  const vege = t >= 26;
  const luk = 0.6 + 0.4 * lukteto(t, 1.2);

  // elölnézet pontjai
  const [xA, yA] = ex(0, 0);
  const [xC, yC] = ex(0, 3);
  const [xE, yE] = ex(-2, 3);
  const [xK1, yK1] = ex(0, 1);
  const [xK2, yK2] = ex(-1, 3);
  // felülnézet pontjai
  const [fxA, fyA] = fel(0, 0);
  const [fxE, fyE] = fel(-2, 0);
  const [fxK2, fyK2] = fel(-1, 0);
  const k2Aktiv = k2 > 0.05 && k1 < 0.05 && !vege;
  const k1Aktiv = k1 > 0.05 && !vege;
  const halvanyA = k2Aktiv ? 1 - 0.75 * k2 : k1Aktiv ? 1 - 0.75 * k1 : 1; // a befogás felőli rész halványul, ha a másik részből számolunk

  return (
    <svg viewBox="0 0 600 440" className="w-full h-auto">
      <defs>
        <Hegy id="f2-nar" szin={SZ.nar} />
        <Hegy id="f2-kek" szin={SZ.kek} />
        <Hegy id="f2-bordo" szin={SZ.bordo} />
        <Hegy id="f2-szurke" szin={SZ.szurke} />
        <Hegy id="f2-zold" szin={SZ.zold} />
      </defs>
      {/* ---------------- elölnézet ---------------- */}
      <FeliratA x={150} y={22} meret={12.5} opacitas={be}>Elölnézet (xy sík)</FeliratA>
      <VonalA x1={xA} y1={yA} x2={xA + 90} y2={yA} szin={SZ.szurke} szaggatott={false} opacitas={be} />
      <FeliratA x={xA + 98} y={yA + 4} meret={11.5} szin={SZ.szurke} dolt opacitas={be}>x</FeliratA>
      <VonalA x1={xA} y1={yA} x2={xA} y2={yA - 170} szin={SZ.szurke} szaggatott={false} opacitas={be} />
      <FeliratA x={xA + 10} y={yA - 172} meret={11.5} szin={SZ.szurke} dolt opacitas={be}>y</FeliratA>
      {/* befogás */}
      {[-16, -10, -4, 2, 8].map((d) => (
        <line key={d} x1={xA + d} y1={yA} x2={xA + d - 5} y2={yA + 7} stroke={SZ.szurke} strokeWidth="1" opacity={be * halvanyA} />
      ))}
      <line x1={xA - 18} y1={yA} x2={xA + 12} y2={yA} stroke={SZ.szurke} strokeWidth="1.4" opacity={be * halvanyA} />
      {/* szárak: a K-nál kettéválasztva */}
      <line x1={xA} y1={yA} x2={xK1} y2={yK1} stroke={SZ.tarto} strokeWidth="6" strokeLinecap="round" opacity={be * halvanyA} />
      <line x1={xK1} y1={yK1} x2={xC} y2={yC} stroke={SZ.tarto} strokeWidth="6" strokeLinecap="round" opacity={be * (k2Aktiv ? halvanyA : 1)} />
      <line x1={xC} y1={yC} x2={xK2} y2={yK2} stroke={SZ.tarto} strokeWidth="6" strokeLinecap="round" opacity={be * (k2Aktiv ? halvanyA : 1)} />
      <line x1={xK2} y1={yK2} x2={xE} y2={yE} stroke={SZ.tarto} strokeWidth="6" strokeLinecap="round" opacity={be} />
      <FeliratA x={xA + 12} y={yA + 18} meret={12} dolt opacitas={be}>A</FeliratA>
      <FeliratA x={xE - 12} y={yE + 4} meret={12} dolt opacitas={be} horgony="end">E</FeliratA>
      {/* F ⊗ az E-ben */}
      <Kereszt x={xE} y={yE} r={8} szin={SZ.nar} opacitas={be} />
      <FeliratA x={xE} y={yE - 18} meret={12} szin={SZ.nar} opacitas={be}>F = 10 kN (⊗, −z)</FeliratA>
      {/* méretek */}
      <VonalA x1={xE} y1={yC - 30} x2={xC} y2={yC - 30} szin={SZ.szurke} opacitas={be} />
      <FeliratA x={(xE + xC) / 2} y={yC - 36} meret={11} vastag={false} szin={SZ.szurke} opacitas={be}>a = 2 m</FeliratA>
      <VonalA x1={xC + 40} y1={yC} x2={xA + 40} y2={yA} szin={SZ.szurke} opacitas={be} />
      <FeliratA x={xC + 48} y={(yC + yA) / 2 + 4} meret={11} vastag={false} szin={SZ.szurke} opacitas={be} horgony="start">b = 3 m</FeliratA>
      {/* K jelek */}
      <g opacity={be}>
        <ellipse cx={xK1} cy={yK1} rx={k1Aktiv ? 10 * luk : 10} ry={k1Aktiv ? 4 * luk : 4} fill="rgba(245,158,11,0.35)" stroke={SZ.sarga} strokeWidth="1.6" />
        <ellipse cx={xK2} cy={yK2} rx={k2Aktiv ? 4 * luk : 4} ry={k2Aktiv ? 10 * luk : 10} fill="none" stroke={SZ.sarga} strokeWidth="1.6" opacity={k2Aktiv ? 0.6 : 0} />
        <FeliratA x={xK1 + 14} y={yK1 + 4} meret={12} szin={SZ.sarga} dolt horgony="start">K1</FeliratA>
        <ellipse cx={xK2} cy={yK2} rx="4" ry="10" fill="rgba(245,158,11,0.35)" stroke={SZ.sarga} strokeWidth="1.6" />
        <FeliratA x={xK2} y={yK2 + 24} meret={12} szin={SZ.sarga} dolt>K2</FeliratA>
      </g>
      {/* K2: nyíróerő ⊙ (+z, a néző felé) a keresztmetszeten */}
      <Pont x={xK2 - 16} y={yK2} szin={SZ.kek} opacitas={k2ero * (k2Aktiv ? 1 : 0.5)} />
      <FeliratA x={xK2 - 16} y={yK2 + 42} meret={11.5} szin={SZ.kek} opacitas={k2ero * (k2Aktiv ? 1 : 0.5)}>Vz = +10 (⊙)</FeliratA>
      {/* K1: nyíróerő ⊗ (−z) */}
      <Kereszt x={xK1 - 22} y={yK1 - 18} szin={SZ.kek} opacitas={k1ero} />
      <FeliratA x={xK1 - 34} y={yK1 - 14} meret={11.5} szin={SZ.kek} opacitas={k1ero} horgony="end">Vz = −10 (⊗)</FeliratA>
      {/* K1: kar az x tengely körül (2 m magasságkülönbség) */}
      <VonalA x1={xE - 40} y1={yE} x2={xE - 40} y2={yK1} szin={SZ.bordo} vastag={1.6} opacitas={k1kar} />
      <VonalA x1={xE - 46} y1={yK1} x2={xK1} y2={yK1} szin={SZ.bordo} opacitas={k1kar} />
      <FeliratA x={xE - 48} y={(yE + yK1) / 2 + 4} meret={11} szin={SZ.bordo} opacitas={k1kar} horgony="end">kar 2 m</FeliratA>
      <FeliratA x={xE - 48} y={(yE + yK1) / 2 + 18} meret={11} vastag={false} szin={SZ.bordo} opacitas={k1M} horgony="end">Mx = −2·10 = −20</FeliratA>
      {/* Mx kettős nyíl a K1-ben (x irány, negatív → balra) */}
      <NyilA x1={xK1 - 4} y1={yK1 + 16} x2={xK1 - 50} y2={yK1 + 16} u={k1M} szin={SZ.bordo} hegy="f2-bordo" vastag={2.6} />
      <NyilA x1={xK1 - 4} y1={yK1 + 16} x2={xK1 - 43} y2={yK1 + 16} u={k1M} szin={SZ.bordo} hegy="f2-bordo" vastag={2.6} />
      <FeliratA x={xK1 - 54} y={yK1 + 20} meret={11.5} szin={SZ.bordo} opacitas={k1M} horgony="end">Mx</FeliratA>

      {/* ---------------- felülnézet ---------------- */}
      <FeliratA x={470} y={22} meret={12.5} opacitas={be}>Felülnézet (zx sík)</FeliratA>
      <VonalA x1={fxA} y1={fyA} x2={fxA + 80} y2={fyA} szin={SZ.szurke} szaggatott={false} opacitas={be} />
      <FeliratA x={fxA + 88} y={fyA + 4} meret={11.5} szin={SZ.szurke} dolt opacitas={be}>x</FeliratA>
      <VonalA x1={fxA} y1={fyA} x2={fxA} y2={fyA + 90} szin={SZ.szurke} szaggatott={false} opacitas={be} />
      <FeliratA x={fxA + 10} y={fyA + 96} meret={11.5} szin={SZ.szurke} dolt opacitas={be}>z</FeliratA>
      <line x1={fxE} y1={fyE} x2={fxK2} y2={fyK2} stroke={SZ.tarto} strokeWidth="6" strokeLinecap="round" opacity={be} />
      <line x1={fxK2} y1={fyK2} x2={fxA} y2={fyA} stroke={SZ.tarto} strokeWidth="6" strokeLinecap="round" opacity={be * (k2Aktiv ? halvanyA : 1)} />
      <circle cx={fxA} cy={fyA} r="6" fill="white" stroke={SZ.tarto} strokeWidth="2.5" opacity={be} />
      <FeliratA x={fxA + 12} y={fyA + 18} meret={11} vastag={false} opacitas={be} horgony="start">A, C, K1 (pontként)</FeliratA>
      <FeliratA x={fxE - 10} y={fyE + 4} meret={12} dolt opacitas={be} horgony="end">E</FeliratA>
      {/* F nyíl a felülnézetben: −z irány = felfelé a rajzon; a hegye E-ben */}
      <NyilA x1={fxE} y1={fyE + 60} x2={fxE} y2={fyE + 4} u={be} szin={SZ.nar} hegy="f2-nar" vastag={3.2} />
      <FeliratA x={fxE + 6} y={fyE + 62} meret={11.5} szin={SZ.nar} opacitas={be} horgony="start">F = 10 kN</FeliratA>
      <ellipse cx={fxK2} cy={fyK2} rx="4" ry="10" fill="rgba(245,158,11,0.35)" stroke={SZ.sarga} strokeWidth="1.6" opacity={be} />
      <FeliratA x={fxK2} y={fyK2 - 16} meret={12} szin={SZ.sarga} dolt opacitas={be}>K2</FeliratA>
      {/* K2 kar: E–K2 = 1 m az y tengely körül */}
      <VonalA x1={fxE} y1={fyE + 28} x2={fxK2} y2={fyK2 + 28} szin={SZ.bordo} vastag={1.6} opacitas={k2kar} />
      <FeliratA x={fxK2 + 6} y={fyE + 42} meret={11} szin={SZ.bordo} opacitas={k2kar} horgony="start">kar 1 m</FeliratA>
      <FeliratA x={fxK2 + 40} y={fyE + 84} meret={11} vastag={false} szin={SZ.bordo} opacitas={k2M}>My = 1·10 = 10 kNm (+y, ⊙)</FeliratA>
      <Pont x={fxK2 + 24} y={fyK2 - 20} szin={SZ.bordo} opacitas={k2M} />
      <FeliratA x={fxK2 + 36} y={fyK2 - 16} meret={11.5} szin={SZ.bordo} opacitas={k2M} horgony="start">My</FeliratA>
      {/* K1 csavaró kar: a 2 m kinyúlás az y tengely körül */}
      <VonalA x1={fxE} y1={fyE - 40} x2={fxA} y2={fyA - 40} szin={SZ.bordo} vastag={1.6} opacitas={k1kar} />
      <FeliratA x={(fxE + fxA) / 2} y={fyE - 46} meret={11} szin={SZ.bordo} opacitas={k1kar}>kar 2 m (y körül)</FeliratA>
      <FeliratA x={fxA + 20} y={fyA + 106} meret={11} vastag={false} szin={SZ.bordo} opacitas={k1M}>T = My = −2·10 = −20 kNm (⊗, csavar)</FeliratA>
      <Kereszt x={fxA + 40} y={fyA + 40} szin={SZ.bordo} opacitas={k1M} />
      <FeliratA x={fxA + 52} y={fyA + 44} meret={11.5} szin={SZ.bordo} opacitas={k1M} horgony="start">T</FeliratA>

      {/* összefoglaló sáv a végén */}
      {vege && (
        <g>
          <rect x="30" y="374" width="540" height="56" rx="10" fill="rgba(240,253,244,0.95)" stroke="#86efac" />
          <FeliratA x={300} y={396} meret={12} szin={SZ.zold}>K1: Vz = −10 kN, Mx = −20 kNm, T = −20 kNm  (N = Vx = Mz = 0)</FeliratA>
          <FeliratA x={300} y={418} meret={12} szin={SZ.zold}>K2: Vz = 10 kN, My = 10 kNm  (N = Vy = T = Mz = 0)</FeliratA>
        </g>
      )}
      {!vege && (
        <g>
          <FeliratA x={300} y={388} meret={11} vastag={false} szin={SZ.szurke} opacitas={be}>⊙: a néző felé (+z), ⊗: befelé (−z). A halvány rész az, amelyiket „eldobjuk”.</FeliratA>
          <FeliratA x={300} y={404} meret={11} vastag={false} szin={SZ.szurke} opacitas={k2ero}>Megelőző rész (K2): R = −ΣF, M = −Σ(r − r_K)×F;</FeliratA>
          <FeliratA x={300} y={420} meret={11} vastag={false} szin={SZ.szurke} opacitas={k2ero}>követő rész (K1): R = +ΣF, M = +Σ(r − r_K)×F.</FeliratA>
        </g>
      )}
    </svg>
  );
}

export default function FilmGyf2() {
  return <FeladatFilm cim="GYF‑2 · K1 és K2 igénybevételei — síkba vetítve" hossz={30} fejezetek={FEJEZETEK} rajz={Rajz} megjegyzes="A bal panel az elölnézet (xy), a jobb a felülnézet (zx). A karok mindig abban a nézetben látszanak, amelynek síkjára a forgástengely merőleges." />;
}
