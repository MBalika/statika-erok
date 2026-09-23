import { KonzolRajz, BakallvanyRajz, TartalyRajz, RacsosRajz, KeresztmetszetKep } from "./TerbeliRajzok";
import { TerHegyek } from "./Axono";

/**
 * A 10. modul kidolgozott feladatainak ábrái (GYF‑1…GYF‑7) – a H13 feladatsor és a vizsgaminta rajzai számokkal.
 */

/** GYF‑1: H13/1 – befogott tört tengelyű konzol, F ∥ z. */
export function AbraGyf1() {
  return <KonzolRajz cim="H13/1: a = 2 m, b = 3 m, F = 10 kN a z tengellyel párhuzamosan (−z)" Fcimke="F = 10 kN" magyarazat={["A befogás az A pontban (origó); az E végpont koordinátái (−2; 3; 0) m."]} />;
}

/** GYF‑1 eredményvázlat. */
export function AbraGyf1Eredmeny() {
  return <KonzolRajz cim="Eredményvázlat: A = (0; 0; 10) kN, M_A = (30; 20; 0) kNm" Fcimke="F = 10 kN" reakcioErtekek={{ R: [0, 0, 10], MA: [30, 20, 0] }} befogas={false} magyarazat={["Csak a nem nulla komponenseket rajzoljuk:", "Az a +z irányba, MAx és MAy a tengelyek pozitív irányába."]} />;
}

/** GYF‑2: H13/2 – ugyanaz a konzol a K1, K2 keresztmetszetekkel. */
export function AbraGyf2() {
  return <KonzolRajz cim="H13/2: K1 a függőleges száron (1 m-re A-tól), K2 a vízszintes szár közepén" Fcimke="F = 10 kN" metszetek={[{ s: 1, nev: "K1" }, { s: 4, nev: "K2" }]} magyarazat={["K1 tengelye az y, K2 tengelye az x;", "a keresztmetszet síkja rendre az xz-, illetve az yz-síkkal párhuzamos."]} />;
}

/** GYF‑2 eredmény: a két keresztmetszet képe a hat igénybevétellel. */
export function AbraGyf2Eredmeny() {
  return (
    <svg viewBox="0 0 600 300" className="w-full h-auto" role="img">
      <TerHegyek />
      <KeresztmetszetKep csoport cim="K1 (tengely: y; nézet felülről)" cx={150} cy={148} nezet={{ vizsz: "x", fugg: "z", normal: "y", normalBefele: false }} ertekek={{ N: 0, T: -20, V_x: 0, V_z: -10, M_x: -20, M_z: 0 }} />
      <KeresztmetszetKep csoport cim="K2 (tengely: x; nézet −x felől)" cx={450} cy={148} nezet={{ vizsz: "z", fugg: "y", normal: "x", normalBefele: true }} ertekek={{ N: 0, T: 0, V_z: 10, V_y: 0, M_z: 0, M_y: 10 }} />
    </svg>
  );
}

/** GYF‑3: H13/3 – háromlábú bakállvány. */
export function AbraGyf3() {
  return <BakallvanyRajz cim="H13/3: F = 10 kN az xy síkban, α = 45°; C(0; 6; 0)" Fcimke="F = 10 kN" Fszog="α = 45°" magyarazat={["Talppontok: 1 (−4; 0; 0), 2 (5; 0; −4), 3 (5; 0; 4) m.", "Az F a +x tengellyel α szöget bezáró egyenes mentén balra-lefelé mutat."]} />;
}

export function AbraGyf3Csomopont() {
  return <BakallvanyRajz elkulonites cim="A csomópont elkülönítése: (F, S₁, S₂, S₃) ≐ O" h={300} magyarazat={["A rúderők húzóerőként, a talppontok felé mutatva; kék = a végén nyomottnak adódó rúd."]} rudErok={[-10.39, 1.149, 1.149]} />;
}

export function AbraGyf3Eredmeny() {
  return <BakallvanyRajz cim="Eredmény: S₁ = −10,39 kN (nyomott), S₂ = S₃ = 1,149 kN (húzott)" Fcimke="F = 10 kN" Fszog="α = 45°" rudErok={[-10.387, 1.149, 1.149]} meretek={false} magyarazat={["A teher az 1-es rúdra „dől rá”: az nyomott;", "a 2-es és 3-as rúd szimmetrikus helyzete miatt egyenlő, kissé húzott."]} />;
}

/** GYF‑4: vizsgaminta 5. feladat. */
export function AbraGyf4() {
  return <BakallvanyRajz cim="Vizsgaminta 5.: F = 6 kN a +x irányban a C(0; 6; 0) csúcson" csucs={[0, 6, 0]} labak={[[0, 0, 4], [0, 0, 0], [5, 0, -4]]} F={[6, 0, 0]} Fcimke="6 kN" FcimkeEltolas={[-4, -8]} Fhorgony="end" magyarazat={["Talppontok: 1 (0; 0; 4), 2 (0; 0; 0) — a 2-es rúd függőleges —, 3 (5; 0; −4) m."]} />;
}

export function AbraGyf4Eredmeny() {
  return <BakallvanyRajz cim="Eredmény: S₁ = −8,653, S₂ = 14,40, S₃ = −10,53 kN" csucs={[0, 6, 0]} labak={[[0, 0, 4], [0, 0, 0], [5, 0, -4]]} F={[6, 0, 0]} Fcimke="6 kN" FcimkeEltolas={[-4, -8]} Fhorgony="end" rudErok={[-8.653, 14.4, -10.53]} meretek={false} magyarazat={["Az 1-es és a 3-as rúd nyomott, a függőleges 2-es rúd húzott:", "a vízszintes teher „billenti” a csúcsot."]} />;
}

/** GYF‑5: H13/4 – tartály gömbcsuklóval és három rúddal. */
export function AbraGyf5() {
  return <TartalyRajz cim="H13/4: tartály 4 × 4 × 2 m, γ = 15 kN/m³, F = 60 kN (−x irány)" Fcimke="F = 60 kN" magyarazat={["A gömbcsukló A(4; 0; 4); az 1-es és 3-as rúd függőleges (3 m),", "a 2-es rúd az x tengely mentén (2 m)."]} />;
}

export function AbraGyf5Eredmeny() {
  return <TartalyRajz cim="Eredmény: S₁ = −270, S₂ = 0, S₃ = −240 kN; A = (60; −30; 0) kN" Fcimke="F" reakciok rudErok={[-270, 0, -240]} magyarazat={["Mindkét függőleges rúd nyomott (tartja a súlyt); a 2-es rúd erőtlen;", "az A csukló lefelé húzza a tartály sarkát (Ay < 0)."]} />;
}

/** GYF‑6: térbeli rácsos tartó. */
export function AbraGyf6() {
  return <RacsosRajz cim="GYF‑6: térbeli rácsos tartó, terhek E-ben 12 kN, D-ben 8 kN (lefelé)" magyarazat={["D(2; 3; 2), E(4; 3; 2);", "gömbcsuklós talppontok: A(0; 0; 0), B(6; 0; 0), C(0; 0; 4), G(6; 0; 4)."]} />;
}

export function AbraGyf6Eredmeny() {
  return <RacsosRajz cim="Eredmény: rúderők kN-ban (piros: húzott, kék: nyomott)" rudErok={{ 1: -7.33, 2: -5.498, 3: 2.393, 4: -8, 5: -8.246, 6: -8.246 }} magyarazat={["Előbb az E csomópont (4, 5, 6 rúd), majd a D csomópont (1, 2, 3 rúd) —", "mindig három egyenlet, három ismeretlen."]} />;
}

/** GYF‑7: általános térbeli erő a konzolon + K keresztmetszetek. */
export function AbraGyf7() {
  return <KonzolRajz cim="GYF‑7: F = (4; −5; 3) kN az E pontban; K1 (y = 1,5 m), K2 (x = −1 m)" F={[4, -5, 3]} Fcimke="F" metszetek={[{ s: 1.5, nev: "K1" }, { s: 4, nev: "K2" }]} magyarazat={["Most mind a hat reakció és a K1 keresztmetszet", "mind a hat igénybevétele nullától különböző."]} />;
}

export function AbraGyf7Eredmeny() {
  return (
    <svg viewBox="0 0 600 300" className="w-full h-auto" role="img">
      <TerHegyek />
      <KeresztmetszetKep csoport cim="K1 (tengely: y)" cx={150} cy={148} nezet={{ vizsz: "x", fugg: "z", normal: "y", normalBefele: false }} ertekek={{ N: -5, T: 6, V_x: 4, V_z: 3, M_x: 4.5, M_z: 4 }} />
      <KeresztmetszetKep csoport cim="K2 (tengely: x)" cx={450} cy={148} nezet={{ vizsz: "z", fugg: "y", normal: "x", normalBefele: true }} ertekek={{ N: -4, T: 0, V_z: -3, V_y: 5, M_z: -5, M_y: -3 }} />
    </svg>
  );
}
