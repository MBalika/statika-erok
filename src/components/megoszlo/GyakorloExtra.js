"use client";

import GyakorloDoboz from "@/components/GyakorloDoboz";
import { M, MB } from "@/components/ui/Keplet";
import { sz } from "@/lib/szamok";

const egesz = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
const feles = (min, max) => egesz(min * 2, max * 2) / 2;
const GAMMA = 10; // kN/m³, víz

/* ---------- 6. Víznyomás gáton ---------- */

function viznyomasFeladat() {
  const h = feles(2, 8);
  const pmax = GAMMA * h; // kN/m² → 1 m széles sávon kN/m
  const R = 0.5 * pmax * h;
  const k = h / 3;
  return {
    szoveg: (
      <p>
        Egy függőleges gátfalat <M>{`h = ${sz(h, 1)}\\ \\text{m}`}</M> mély víz terhel (γ = 10 kN/m³). A víznyomás a
        felszínen nulla, a fenéken <M>{"\\gamma h"}</M>. Mekkora a víznyomás eredője a fal 1 m széles sávján, és
        milyen magasan hat a <strong>fenéktől</strong> mérve?
      </p>
    ),
    sugo: (
      <p>
        A teherábra háromszög: a magas oldal a fenéknél van. Az eredő a terület, a helye a magas oldaltól h/3.
      </p>
    ),
    mezok: [
      { id: "r", cimke: "R", egyseg: "kN/m", helyes: R, tizedes: 2 },
      { id: "k", cimke: "a fenéktől", egyseg: "m", helyes: k, tizedes: 3 },
    ],
    megoldas: (
      <>
        <MB>{`p_{max} = \\gamma h = 10\\cdot ${sz(h, 1)} = ${sz(pmax, 1)}\\ \\text{kN/m}^2\\ (\\text{1 m széles sávon: kN/m})`}</MB>
        <MB>{`\\Fx \\tfrac12\\,p_{max}\\,h = \\tfrac12\\cdot ${sz(pmax, 1)}\\cdot ${sz(h, 1)} = R = ${sz(R, 2)}\\ \\text{kN/m}`}</MB>
        <MB>{`k = \\frac{h}{3} = ${sz(k, 3)}\\ \\text{m a fenéktől}`}</MB>
        <p className="mt-2 text-[13px] text-petrol-600">Ez a klasszikus „hidrosztatikus háromszög”: minden gát, medence és támfal méretezése ezzel kezdődik.</p>
      </>
    ),
  };
}

/* ---------- 7. Ferde rúd terhe: hosszra vagy vetületre ---------- */

function ferdeRudFeladat() {
  const L = feles(2, 8);
  const alfa = egesz(15, 60);
  const p = feles(1, 8);
  const vetulet = Math.random() < 0.5;
  const Lv = L * Math.cos((alfa * Math.PI) / 180);
  const R = vetulet ? p * Lv : p * L;
  return {
    szoveg: (
      <p>
        Egy <M>{`L = ${sz(L, 1)}\\ \\text{m}`}</M> hosszú, a vízszintessel <M>{`\\alpha = ${alfa}^\\circ`}</M>-ot bezáró
        ferde rudat függőleges, <M>{`p = ${sz(p, 1)}\\ \\text{kN/m}`}</M> intenzitású egyenletes teher ér, ahol a p{" "}
        {vetulet ? (
          <strong>a vízszintes vetület méterére</strong>
        ) : (
          <strong>a rúd ferde hosszának méterére</strong>
        )}{" "}
        vonatkozik (mint a {vetulet ? "hóteher" : "önsúly"}). Mekkora az eredő?
      </p>
    ),
    sugo: (
      <p>
        Nézd meg, mire vonatkozik a p: ha a vetületre, akkor <M>{"L\\cos\\alpha"}</M>-val kell szorozni; ha a ferde hosszra, akkor L-lel.
      </p>
    ),
    mezok: [{ id: "r", cimke: "R", egyseg: "kN", helyes: R, tizedes: 2 }],
    megoldas: vetulet ? (
      <>
        <MB>{`L_v = L\\cos\\alpha = ${sz(L, 1)}\\cdot\\cos ${alfa}^\\circ = ${sz(Lv, 3)}\\ \\text{m}`}</MB>
        <MB>{`R = p\\,L_v = ${sz(p, 1)}\\cdot ${sz(Lv, 3)} = ${sz(R, 2)}\\ \\text{kN}`}</MB>
        <p className="mt-2 text-[13px] text-petrol-600">Ha a rúd hosszával szoroztál volna: {sz(p * L, 2)} kN — ennyivel több, hibásan.</p>
      </>
    ) : (
      <>
        <MB>{`R = p\\,L = ${sz(p, 1)}\\cdot ${sz(L, 1)} = ${sz(R, 2)}\\ \\text{kN}`}</MB>
        <p className="mt-2 text-[13px] text-petrol-600">Ha a vetülettel szoroztál volna: {sz(p * Lv, 2)} kN — ennyivel kevesebb, hibásan.</p>
      </>
    ),
  };
}

/* ---------- 8. Trapéz teher és koncentrált erő ---------- */

function trapezPluszFeladat() {
  const L = feles(3, 8);
  const p1 = feles(1, 6);
  const p2 = feles(1, 8);
  const F = egesz(5, 40);
  const a = feles(0.5, L - 0.5);
  const Rp = ((p1 + p2) / 2) * L;
  const kp = (L / 3) * ((p1 + 2 * p2) / (p1 + p2));
  const R = Rp + F;
  const k = (Rp * kp + F * a) / R;
  return {
    szoveg: (
      <p>
        Egy <M>{`L = ${sz(L, 1)}\\ \\text{m}`}</M> hosszú tartón trapéz alakú teher működik (bal végén{" "}
        <M>{`p_1 = ${sz(p1, 1)}`}</M>, jobb végén <M>{`p_2 = ${sz(p2, 1)}\\ \\text{kN/m}`}</M>), és a bal végtől{" "}
        <M>{`a = ${sz(a, 1)}\\ \\text{m}`}</M>-re egy <M>{`F = ${F}\\ \\text{kN}`}</M> koncentrált erő is, lefelé.
        Mekkora a teljes teher eredője, és hol működik?
      </p>
    ),
    sugo: (
      <p>
        Előbb a trapéz eredője és helye (a zárt képlettel vagy felbontással), aztán két párhuzamos erő összevonása.
      </p>
    ),
    mezok: [
      { id: "r", cimke: "R", egyseg: "kN", helyes: R, tizedes: 2 },
      { id: "k", cimke: "k (a bal végtől)", egyseg: "m", helyes: k, tizedes: 3 },
    ],
    megoldas: (
      <>
        <MB>{`R_p = \\frac{${sz(p1, 1)} + ${sz(p2, 1)}}{2}\\cdot ${sz(L, 1)} = ${sz(Rp, 2)}\\ \\text{kN},\\qquad k_p = \\frac{L}{3}\\cdot\\frac{p_1 + 2p_2}{p_1 + p_2} = ${sz(kp, 3)}\\ \\text{m}`}</MB>
        <MB>{`\\Fle R_p + F = ${sz(Rp, 2)} + ${F} = R = ${sz(R, 2)}\\ \\text{kN}`}</MB>
        <MB>{`\\Mj{O} R_p k_p + F a = R\\,k\\ \\Rightarrow\\ k = \\frac{${sz(Rp, 2)}\\cdot ${sz(kp, 3)} + ${F}\\cdot ${sz(a, 1)}}{${sz(R, 2)}} = ${sz(k, 3)}\\ \\text{m}`}</MB>
      </>
    ),
  };
}

/* ---------- 9. Fordított feladat: adott eredőből p₂ ---------- */

function forditottFeladat() {
  const L = feles(2, 8);
  const p1 = feles(1, 6);
  const p2 = feles(1, 9);
  const R = ((p1 + p2) / 2) * L; // ezt adjuk meg
  const k = (L / 3) * ((p1 + 2 * p2) / (p1 + p2));
  return {
    szoveg: (
      <p>
        Egy <M>{`L = ${sz(L, 1)}\\ \\text{m}`}</M> hosszú szakaszon lineárisan változó teher működik, a bal végén{" "}
        <M>{`p_1 = ${sz(p1, 1)}\\ \\text{kN/m}`}</M>. Tudjuk, hogy az eredője <M>{`R = ${sz(R, 2)}\\ \\text{kN}`}</M>.
        Mekkora a jobb végi intenzitás, és hol működik az eredő?
      </p>
    ),
    sugo: (
      <p>
        A trapéz területéből p₂ visszafejthető: <M>{"R = \\tfrac{p_1 + p_2}{2}L"}</M>. Utána a hely a szokásos módon.
      </p>
    ),
    mezok: [
      { id: "p2", cimke: "p₂", egyseg: "kN/m", helyes: p2, tizedes: 2 },
      { id: "k", cimke: "k (a bal végtől)", egyseg: "m", helyes: k, tizedes: 3 },
    ],
    megoldas: (
      <>
        <MB>{`p_2 = \\frac{2R}{L} - p_1 = \\frac{2\\cdot ${sz(R, 2)}}{${sz(L, 1)}} - ${sz(p1, 1)} = ${sz(p2, 2)}\\ \\text{kN/m}`}</MB>
        <MB>{`k = \\frac{L}{3}\\cdot\\frac{p_1 + 2p_2}{p_1 + p_2} = \\frac{${sz(L, 1)}}{3}\\cdot\\frac{${sz(p1, 1)} + 2\\cdot ${sz(p2, 2)}}{${sz(p1, 1)} + ${sz(p2, 2)}} = ${sz(k, 3)}\\ \\text{m}`}</MB>
      </>
    ),
  };
}


/* ---------- 10. Födémteherből gerendateher ---------- */

function fodemTeherFeladat() {
  const q = feles(1.5, 8);
  const b = feles(1.5, 4);
  const L = feles(3, 8);
  const pv = q * b;
  const R = pv * L;
  return {
    szoveg: (
      <p>
        Egy födémet <M>{`q = ${sz(q, 1)}\\ \\text{kN/m}^2`}</M> felületen megoszló teher terhel. A födémet{" "}
        <M>{`L = ${sz(L, 1)}\\ \\text{m}`}</M> hosszú, egymástól <M>{`b = ${sz(b, 1)}\\ \\text{m}`}</M> távolságra fekvő
        gerendák tartják, tehát egy gerendára egy b széles sáv (tehermező) terhe jut. Mekkora a gerendára jutó vonal
        menti teher intenzitása, és mekkora az eredője?
      </p>
    ),
    sugo: (
      <p>
        A tehermező b széles: egy méter gerendára <M>{"q\\cdot b\\cdot 1"}</M> erő jut, azaz <M>{"p = q\\,b"}</M> kN/m. Az eredő
        a terhelési test térfogata: <M>{"R = q\\,b\\,L = p\\,L"}</M>.
      </p>
    ),
    mezok: [
      { id: "p", cimke: "p", egyseg: "kN/m", helyes: pv, tizedes: 2 },
      { id: "r", cimke: "R", egyseg: "kN", helyes: R, tizedes: 2 },
    ],
    megoldas: (
      <>
        <MB>{`p = q\\,b = ${sz(q, 1)}\\cdot ${sz(b, 1)} = ${sz(pv, 2)}\\ \\text{kN/m}`}</MB>
        <MB>{`\\Fle p\\,L = ${sz(pv, 2)}\\cdot ${sz(L, 1)} = R = ${sz(R, 2)}\\ \\text{kN}\\quad(\\text{a gerenda közepén})`}</MB>
        <p className="mt-2 text-[13px] text-petrol-600">
          Ellenőrzés a terhelési testtel: <M>{`q\\cdot(b\\,L) = ${sz(q, 1)}\\cdot ${sz(b * L, 2)} = ${sz(R, 2)}`}</M> kN — a kN/m²-t{" "}
          <em>területtel</em> kell szorozni, nem csak hosszal.
        </p>
      </>
    ),
  };
}

/* ---------- 11. Önsúly intenzitása ---------- */

const ANYAGOK = [
  { nev: "vasbeton", gamma: 25 },
  { nev: "acél", gamma: 78.5 },
  { nev: "fenyő", gamma: 5 },
  { nev: "tégla", gamma: 18 },
];

function onsulyFeladat() {
  const anyag = ANYAGOK[egesz(0, ANYAGOK.length - 1)];
  const b = egesz(2, 12) * 5; // cm
  const h = egesz(3, 16) * 5; // cm
  const L = feles(2, 9);
  const A = (b / 100) * (h / 100);
  const q = A * anyag.gamma;
  const G = q * L;
  return {
    szoveg: (
      <p>
        Egy <M>{`${b}\\times ${h}\\ \\text{cm}`}</M> keresztmetszetű, <M>{`L = ${sz(L, 1)}\\ \\text{m}`}</M> hosszú {anyag.nev} gerenda
        fajsúlya <M>{`\\gamma = ${sz(anyag.gamma, 1)}\\ \\text{kN/m}^3`}</M>. Mekkora az önsúlyának vonal menti intenzitása, és
        mekkora a gerenda teljes súlya?
      </p>
    ),
    sugo: (
      <p>
        A térfogat mentén megoszló súlyt keresztmetszetenként gyűjtjük össze: <M>{"q = A\\,\\gamma"}</M> (A m²-ben!). Az egész gerenda:{" "}
        <M>{"G = q\\,L = V\\gamma"}</M>.
      </p>
    ),
    mezok: [
      { id: "q", cimke: "q", egyseg: "kN/m", helyes: q, tizedes: 3 },
      { id: "g", cimke: "G", egyseg: "kN", helyes: G, tizedes: 2 },
    ],
    megoldas: (
      <>
        <MB>{`A = ${sz(b / 100, 2)}\\cdot ${sz(h / 100, 2)} = ${sz(A, 4)}\\ \\text{m}^2`}</MB>
        <MB>{`q = A\\,\\gamma = ${sz(A, 4)}\\cdot ${sz(anyag.gamma, 1)} = ${sz(q, 3)}\\ \\text{kN/m}`}</MB>
        <MB>{`G = q\\,L = ${sz(q, 3)}\\cdot ${sz(L, 1)} = ${sz(G, 2)}\\ \\text{kN}\\quad(= V\\gamma,\\ \\text{a gerenda súlypontjában})`}</MB>
      </>
    ),
  };
}

/* ---------- 12. Víznyomás ferde gáton ---------- */

function ferdeGatFeladat() {
  const h = feles(3, 9);
  const beta = egesz(3, 9) * 5; // 15…45°
  const gamma = Math.random() < 0.5 ? 10 : 15;
  const tg = Math.tan((beta * Math.PI) / 180);
  const alap = h * tg;
  const Rx = 0.5 * gamma * h * h;
  const A = 0.5 * alap * h;
  const Ry = gamma * A;
  const R = Math.hypot(Rx, Ry);
  return {
    szoveg: (
      <p>
        Egy gát fala a függőlegessel <M>{`\\beta = ${beta}^\\circ`}</M>-ot zár be, a víz a ferde fal fölött{" "}
        <M>{`h = ${sz(h, 1)}\\ \\text{m}`}</M> mély (<M>{`\\gamma = ${gamma}\\ \\text{kN/m}^3`}</M>). Mekkora a víznyomás eredőjének
        vízszintes és függőleges komponense a fal 1 m széles sávján?
      </p>
    ),
    sugo: (
      <p>
        Vízszintes: háromszög a függőleges vetületen, <M>{"\\tfrac12\\gamma h^2"}</M>. Függőleges: a fal fölötti vízoszlop — a fal
        vonala és a vízszint közötti háromszög területe (alapja <M>{"h\\,\\mathrm{tg}\\,\\beta"}</M>) szorozva γ-val.
      </p>
    ),
    mezok: [
      { id: "rx", cimke: "Rₓ (vízszintes)", egyseg: "kN/m", helyes: Rx, tizedes: 1 },
      { id: "ry", cimke: "Rᵧ (függőleges)", egyseg: "kN/m", helyes: Ry, tizedes: 1 },
    ],
    megoldas: (
      <>
        <MB>{`\\Fx R_x = \\tfrac12\\,\\gamma h^2 = \\tfrac12\\cdot ${gamma}\\cdot ${sz(h, 1)}^2 = ${sz(Rx, 1)}\\ \\text{kN/m}\\quad(h/3 = ${sz(h / 3, 2)}\\ \\text{m-re a fenéktől})`}</MB>
        <MB>{`A = \\tfrac12\\,(h\\,\\mathrm{tg}\\,\\beta)\\,h = \\tfrac12\\cdot ${sz(alap, 3)}\\cdot ${sz(h, 1)} = ${sz(A, 3)}\\ \\text{m}^2`}</MB>
        <MB>{`\\Fle R_y = \\gamma A = ${gamma}\\cdot ${sz(A, 3)} = ${sz(Ry, 1)}\\ \\text{kN/m}\\quad(x_S = ${sz(alap / 3, 3)}\\ \\text{m-re a talpponttól})`}</MB>
        <p className="mt-2 text-[13px] text-petrol-600">
          Ellenőrzés: az eredő merőleges a falra, <M>{`R = R_x/\\cos\\beta = ${sz(Rx / Math.cos((beta * Math.PI) / 180), 1)} = \\sqrt{R_x^2 + R_y^2} = ${sz(R, 1)}`}</M> kN/m ✓
        </p>
      </>
    ),
  };
}

export const EXTRA_GENERATOROK = [
  { cim: "Víznyomás gátfalon", fn: viznyomasFeladat },
  { cim: "Ferde rúd terhe", fn: ferdeRudFeladat },
  { cim: "Trapéz teher és koncentrált erő", fn: trapezPluszFeladat },
  { cim: "Fordított feladat: adott az eredő", fn: forditottFeladat },
  { cim: "Födémteherből gerendateher", fn: fodemTeherFeladat },
  { cim: "Önsúly intenzitása", fn: onsulyFeladat },
  { cim: "Víznyomás ferde gáton", fn: ferdeGatFeladat },
];

export default function GyakorloExtra() {
  return (
    <>
      <GyakorloDoboz cim="Víznyomás gátfalon" leiras="A hidrosztatikus háromszög: a legfontosabb háromszög alakú teher a gyakorlatban." generator={viznyomasFeladat} />
      <GyakorloDoboz cim="Ferde rúd terhe" leiras="Mire vonatkozik a p: a rúd hosszára vagy a vetületre? Itt dől el." generator={ferdeRudFeladat} oszlopok={1} />
      <GyakorloDoboz cim="Trapéz teher és koncentrált erő" leiras="Két lépés: a megoszló teher eredője, majd két párhuzamos erő összevonása." generator={trapezPluszFeladat} />
      <GyakorloDoboz cim="Fordított feladat: adott az eredő" leiras="Visszafelé gondolkodás — a képletet nem csak előre kell tudni használni." generator={forditottFeladat} />
      <GyakorloDoboz cim="Födémteherből gerendateher" leiras="kN/m²-ből kN/m: a tehermező szélességével szorzunk — ez az, ami a leggyakrabban kimarad." generator={fodemTeherFeladat} />
      <GyakorloDoboz cim="Önsúly intenzitása" leiras="Térfogatból vonal: q = A·γ, majd G = q·L." generator={onsulyFeladat} />
      <GyakorloDoboz cim="Víznyomás ferde gáton" leiras="A tankönyv 3.23. ábrája: vízszintes háromszög + a fal fölötti vízoszlop." generator={ferdeGatFeladat} />
    </>
  );
}
