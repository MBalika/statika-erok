"use client";

import GyakorloDoboz from "@/components/GyakorloDoboz";
import { M, MB } from "@/components/ui/Keplet";
import { derekszogu, polaris, sz, zarojel, siknegyed, osszegLanc } from "@/lib/szamok";

const egesz = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
const valaszt = (tomb) => tomb[Math.floor(Math.random() * tomb.length)];
/** A 90°, 180°, 270° körüli lebegőpontos „−0,00” helyett pontosan 0. */
const tiszta = (v) => (Math.abs(v) < 5e-7 ? 0 : v);
const tisztaK = (k) => ({ x: tiszta(k.x), y: tiszta(k.y) });
const nemNulla = (min, max) => {
  let v = 0;
  while (v === 0) v = egesz(min, max);
  return v;
};

/* ---------- 6. Erő két ponton átmenő hatásvonallal ---------- */

function hatasvonalFeladat() {
  const F = egesz(5, 40);
  const A = { x: nemNulla(-6, 6), y: nemNulla(-6, 6) };
  let B = { x: nemNulla(-6, 6), y: nemNulla(-6, 6) };
  while (B.x === A.x && B.y === A.y) B = { x: nemNulla(-6, 6), y: nemNulla(-6, 6) };
  const dx = B.x - A.x;
  const dy = B.y - A.y;
  const h = Math.hypot(dx, dy);
  const Fx = (F * dx) / h;
  const Fy = (F * dy) / h;
  return {
    szoveg: (
      <p>
        Egy <M>{`F = ${F}\\ \\text{kN}`}</M> nagyságú erő hatásvonala az{" "}
        <M>{`A(${A.x};\\ ${A.y})`}</M> ponton megy át, és az erő az{" "}
        <M>{`A`}</M> pontból a <M>{`B(${B.x};\\ ${B.y})`}</M> pont felé mutat (méterben). Add meg az
        erő komponenseit!
      </p>
    ),
    sugo: (
      <p>
        Az irányt az <M>{"\\overrightarrow{AB}"}</M> vektor adja: oszd el a hosszával (egységvektor), és
        szorozd meg az erő nagyságával. Nem kell szög!
      </p>
    ),
    mezok: [
      { id: "fx", cimke: "Fx", egyseg: "kN", helyes: Fx, tizedes: 2 },
      { id: "fy", cimke: "Fy", egyseg: "kN", helyes: Fy, tizedes: 2 },
    ],
    megoldas: (
      <>
        <MB>{`\\overrightarrow{AB} = (${B.x} - ${zarojel(A.x, 0)};\\ ${B.y} - ${zarojel(A.y, 0)}) = (${dx};\\ ${dy}),\\qquad |\\overrightarrow{AB}| = \\sqrt{${zarojel(dx, 0)}^2 + ${zarojel(dy, 0)}^2} = ${sz(h, 3)}`}</MB>
        <MB>{`\\underline{e} = \\frac{\\overrightarrow{AB}}{|\\overrightarrow{AB}|} = (${sz(dx / h, 4)};\\ ${sz(dy / h, 4)})`}</MB>
        <MB>{`\\underline{F} = F\\,\\underline{e} = ${F}\\cdot(${sz(dx / h, 4)};\\ ${sz(dy / h, 4)}) = (${sz(Fx, 2)};\\ ${sz(Fy, 2)})\\ \\text{kN}`}</MB>
        <p className="mt-2 text-[13px] text-petrol-600">
          Ellenőrzés: <M>{`\\sqrt{${zarojel(Fx, 2)}^2 + ${zarojel(Fy, 2)}^2} = ${sz(Math.hypot(Fx, Fy), 2)}`}</M> — vissza kell kapni az erő nagyságát.
        </p>
      </>
    ),
  };
}

/* ---------- 7. Két erő közti szög skaláris szorzattal ---------- */

function szogFeladat() {
  const a = { x: nemNulla(-9, 9), y: nemNulla(-9, 9) };
  let b = { x: nemNulla(-9, 9), y: nemNulla(-9, 9) };
  while (Math.abs(a.x * b.y - a.y * b.x) < 1e-9) b = { x: nemNulla(-9, 9), y: nemNulla(-9, 9) };
  const skal = a.x * b.x + a.y * b.y;
  const la = Math.hypot(a.x, a.y);
  const lb = Math.hypot(b.x, b.y);
  const cosf = skal / (la * lb);
  const fi = (Math.acos(Math.max(-1, Math.min(1, cosf))) * 180) / Math.PI;
  return {
    szoveg: (
      <p>
        Két erő: <M>{`\\underline{F}_1 = (${a.x};\\ ${a.y})`}</M> kN és{" "}
        <M>{`\\underline{F}_2 = (${b.x};\\ ${b.y})`}</M> kN. Mekkora a skaláris szorzatuk, és mekkora
        szöget zárnak be egymással?
      </p>
    ),
    sugo: (
      <p>
        <M>{"\\underline{F}_1\\cdot\\underline{F}_2 = F_{1x}F_{2x} + F_{1y}F_{2y} = |\\underline{F}_1||\\underline{F}_2|\\cos\\varphi"}</M>.
        Negatív skaláris szorzat: tompaszög.
      </p>
    ),
    mezok: [
      { id: "s", cimke: "F₁ · F₂", egyseg: "kN²", helyes: skal, tizedes: 0 },
      { id: "fi", cimke: "φ", egyseg: "°", helyes: fi, tizedes: 2 },
    ],
    megoldas: (
      <>
        <MB>{`\\underline{F}_1\\cdot\\underline{F}_2 = ${a.x}\\cdot${zarojel(b.x, 0)} + ${zarojel(a.y, 0)}\\cdot${zarojel(b.y, 0)} = ${skal}`}</MB>
        <MB>{`|\\underline{F}_1| = ${sz(la, 3)},\\qquad |\\underline{F}_2| = ${sz(lb, 3)}`}</MB>
        <MB>{`\\cos\\varphi = \\frac{${skal}}{${sz(la, 3)}\\cdot ${sz(lb, 3)}} = ${sz(cosf, 4)}\\ \\Rightarrow\\ \\varphi = ${sz(fi, 2)}^\\circ`}</MB>
      </>
    ),
  };
}

/* ---------- 8. Eredő poláris alakban ---------- */

function polarisFeladat() {
  const erok = [0, 1, 2].map(() => ({ F: egesz(4, 30), a: egesz(0, 35) * 10 }));
  const k = erok.map((e) => tisztaK(derekszogu(e.F, e.a)));
  const Rx = tiszta(k.reduce((s, v) => s + v.x, 0));
  const Ry = tiszta(k.reduce((s, v) => s + v.y, 0));
  const p = polaris(Rx, Ry);
  const neg = siknegyed(p.szog);
  return {
    szoveg: (
      <p>
        Három erő az origóból, nagyság és irányszög (az x tengelytől, az óramutatóval ellentétesen):{" "}
        {erok.map((e, i) => (
          <span key={i}>
            <M>{`F_${i + 1} = ${e.F}\\ \\text{kN},\\ \\alpha_${i + 1} = ${e.a}^\\circ`}</M>
            {i < 2 ? "; " : "."}
          </span>
        ))}{" "}
        Add meg az eredő nagyságát és irányszögét (0–360°)!
      </p>
    ),
    sugo: (
      <p>
        Bontsd fel mindhármat, add össze a komponenseket, majd nagyság és irány. Az arctg csak ±90°-ot ad —
        a síknegyedet a komponensek előjeléből döntsd el.
      </p>
    ),
    mezok: [
      { id: "r", cimke: "|R|", egyseg: "kN", helyes: p.nagysag, tizedes: 2 },
      { id: "a", cimke: "α_R (0–360°)", egyseg: "°", helyes: p.szog, tizedes: 1, tures: 0.3 },
    ],
    megoldas: (
      <>
        {erok.map((e, i) => (
          <MB key={i}>{`F_{${i + 1}x} = ${e.F}\\cos ${e.a}^\\circ = ${sz(k[i].x, 2)},\\quad F_{${i + 1}y} = ${e.F}\\sin ${e.a}^\\circ = ${sz(k[i].y, 2)}`}</MB>
        ))}
        <MB>{`R_x = ${sz(Rx, 2)},\\qquad R_y = ${sz(Ry, 2)}\\ \\text{kN}`}</MB>
        <MB>{`|\\underline{R}| = \\sqrt{${zarojel(Rx, 2)}^2 + ${zarojel(Ry, 2)}^2} = ${sz(p.nagysag, 2)}\\ \\text{kN}`}</MB>
        <MB>{`\\alpha_R = ${sz(p.szog, 1)}^\\circ\\quad(\\text{${neg.szam} síknegyed: } ${neg.jelek.replace(/F/g, "R")})`}</MB>
      </>
    ),
  };
}

/* ---------- 9. Kötélerők egyensúlya ---------- */

function kotelFeladat() {
  const G = egesz(2, 30);
  const alfa = egesz(100, 165); // bal kötél irányszöge (a csomópontból kifelé)
  const beta = egesz(15, 80); // jobb kötél
  const ra = (alfa * Math.PI) / 180;
  const rb = (beta * Math.PI) / 180;
  // S1 cos α + S2 cos β = 0 ; S1 sin α + S2 sin β = G
  const det = Math.cos(ra) * Math.sin(rb) - Math.sin(ra) * Math.cos(rb);
  const S1 = (-G * Math.cos(rb)) / det;
  const S2 = (G * Math.cos(ra)) / det;
  return {
    szoveg: (
      <p>
        Egy <M>{`G = ${G}\\ \\text{kN}`}</M> súlyú teher egy csomópontban két kötélen függ. A bal kötél
        iránya a csomópontból nézve <M>{`\\alpha = ${alfa}^\\circ`}</M>, a jobbé{" "}
        <M>{`\\beta = ${beta}^\\circ`}</M> (mindkettő az x tengelytől, az óramutatóval ellentétesen). Mekkora
        erő ébred a két kötélben?
      </p>
    ),
    sugo: (
      <p>
        Három erő egyensúlya a csomóponton: <M>{"(\\underline{G}, \\underline{S}_1, \\underline{S}_2) \\ekv \\underline{O}"}</M>;{" "}
        <M>{"S_1"}</M> az α, <M>{"S_2"}</M> a β irányban húz, G lefelé. Két vetületi egyenlet, két ismeretlen.
      </p>
    ),
    mezok: [
      { id: "s1", cimke: "S₁ (bal kötél)", egyseg: "kN", helyes: S1, tizedes: 2 },
      { id: "s2", cimke: "S₂ (jobb kötél)", egyseg: "kN", helyes: S2, tizedes: 2 },
    ],
    megoldas: (
      <>
        <MB>{"(\\underline{G}, \\underline{S}_1, \\underline{S}_2) \\ekv \\underline{O}"}</MB>
        <MB>{`\\Fx S_1\\cos ${alfa}^\\circ + S_2\\cos ${beta}^\\circ = 0`}</MB>
        <MB>{`\\Fy -${G} + S_1\\sin ${alfa}^\\circ + S_2\\sin ${beta}^\\circ = 0`}</MB>
        <MB>{`S_1 = ${sz(S1, 2)}\\ \\text{kN},\\qquad S_2 = ${sz(S2, 2)}\\ \\text{kN}`}</MB>
        <p className="mt-2 text-[13px] text-petrol-600">
          Ellenőrzés: a két kötélerő és G zárt vektorháromszöget alkot. Minél laposabb a kötél, annál nagyobb az erő benne.
        </p>
      </>
    ),
  };
}

/* ---------- 10. Vektoriális szorzat ---------- */

function vektorialisFeladat() {
  const a = { x: nemNulla(-6, 6), y: nemNulla(-6, 6), z: nemNulla(-6, 6) };
  let b = { x: nemNulla(-6, 6), y: nemNulla(-6, 6), z: nemNulla(-6, 6) };
  const kereszt = (p, q) => ({ x: p.y * q.z - p.z * q.y, y: p.z * q.x - p.x * q.z, z: p.x * q.y - p.y * q.x });
  let c = kereszt(a, b);
  while (c.x === 0 && c.y === 0 && c.z === 0) {
    b = { x: nemNulla(-6, 6), y: nemNulla(-6, 6), z: nemNulla(-6, 6) };
    c = kereszt(a, b);
  }
  const z = (v) => (v < 0 ? `(${v})` : `${v}`);
  return {
    szoveg: (
      <p>
        Számítsd ki az <M>{`\\underline{a} = (${a.x};\\ ${a.y};\\ ${a.z})`}</M> és{" "}
        <M>{`\\underline{b} = (${b.x};\\ ${b.y};\\ ${b.z})`}</M> vektorok{" "}
        <M>{"\\underline{a}\\times\\underline{b}"}</M> vektoriális szorzatának három komponensét!
      </p>
    ),
    sugo: (
      <p>
        Írd fel a determinánst (első sor <M>{"\\underline{i}, \\underline{j}, \\underline{k}"}</M>, alatta a, alatta b), és fejtsd
        ki: jobbra-lefelé átlók +, balra-lefelé átlók −. Vagy a képlet:{" "}
        <M>{"(a_y b_z - a_z b_y;\\ a_z b_x - a_x b_z;\\ a_x b_y - a_y b_x)"}</M>.
      </p>
    ),
    mezok: [
      { id: "x", cimke: "(a×b)x", egyseg: "", helyes: c.x, tizedes: 0, tures: 0.001 },
      { id: "y", cimke: "(a×b)y", egyseg: "", helyes: c.y, tizedes: 0, tures: 0.001 },
      { id: "z", cimke: "(a×b)z", egyseg: "", helyes: c.z, tizedes: 0, tures: 0.001 },
    ],
    megoldas: (
      <>
        <MB>{`\\underline{a}\\times\\underline{b} = \\begin{vmatrix} \\underline{i} & \\underline{j} & \\underline{k} \\\\ ${a.x} & ${a.y} & ${a.z} \\\\ ${b.x} & ${b.y} & ${b.z} \\end{vmatrix}`}</MB>
        <MB>{`= \\big(${a.y}\\cdot${z(b.z)} - ${z(a.z)}\\cdot${z(b.y)}\\big)\\underline{i} + \\big(${a.z}\\cdot${z(b.x)} - ${z(a.x)}\\cdot${z(b.z)}\\big)\\underline{j} + \\big(${a.x}\\cdot${z(b.y)} - ${z(a.y)}\\cdot${z(b.x)}\\big)\\underline{k}`}</MB>
        <MB>{`\\underline{a}\\times\\underline{b} = \\begin{bmatrix} ${c.x} \\\\ ${c.y} \\\\ ${c.z} \\end{bmatrix}`}</MB>
        <p className="mt-2 text-[13px] text-petrol-600">
          Ellenőrzés: merőleges mindkettőre —{" "}
          <M>{`\\underline{a}\\cdot(\\underline{a}\\times\\underline{b}) = ${a.x * c.x + a.y * c.y + a.z * c.z}`}</M>,{" "}
          <M>{`\\underline{b}\\cdot(\\underline{a}\\times\\underline{b}) = ${b.x * c.x + b.y * c.y + b.z * c.z}`}</M>.
        </p>
      </>
    ),
  };
}

/* ---------- 11. Egyensúlyozás: az eredő ellentettje ---------- */

function egyensulyozasFeladat() {
  const erok = [0, 1, 2].map(() => ({ F: egesz(3, 20), a: egesz(0, 35) * 10 }));
  const k = erok.map((e) => tisztaK(derekszogu(e.F, e.a)));
  const Rx = tiszta(k.reduce((s, v) => s + v.x, 0));
  const Ry = tiszta(k.reduce((s, v) => s + v.y, 0));
  const Ex = tiszta(-Rx);
  const Ey = tiszta(-Ry);
  const E = polaris(Ex, Ey);
  return {
    szoveg: (
      <p>
        Egy csomópontban három ismert erő hat:{" "}
        {erok.map((e, i) => (
          <span key={i}>
            <M>{`F_${i + 1} = ${e.F}\\ \\text{kN},\\ \\alpha_${i + 1} = ${e.a}^\\circ`}</M>
            {i < 2 ? "; " : "."}
          </span>
        ))}{" "}
        Egyensúlyozd az erőrendszert egyetlen <M>{"\\underline{E}"}</M> erővel: add meg az egyensúlyozó erő komponenseit és
        nagyságát!
      </p>
    ),
    sugo: (
      <p>
        Egyensúlyi kijelentés: <M>{"(\\underline{F}_1, \\underline{F}_2, \\underline{F}_3, \\underline{E}) \\ekv \\underline{O}"}</M>. A
        vetületi egyenletekben az ismeretlen <M>{"E_x, E_y"}</M> a bal oldalon áll — az egyensúlyozó erő az eredő ellentettje
        (tankönyv 3.5).
      </p>
    ),
    mezok: [
      { id: "ex", cimke: "Ex", egyseg: "kN", helyes: Ex, tizedes: 2 },
      { id: "ey", cimke: "Ey", egyseg: "kN", helyes: Ey, tizedes: 2 },
      { id: "e", cimke: "|E|", egyseg: "kN", helyes: E.nagysag, tizedes: 2 },
    ],
    megoldas: (
      <>
        <MB>{"(\\underline{F}_1, \\underline{F}_2, \\underline{F}_3, \\underline{E}) \\ekv \\underline{O}"}</MB>
        {erok.map((e, i) => (
          <MB key={i}>{`F_{${i + 1}x} = ${e.F}\\cos ${e.a}^\\circ = ${sz(k[i].x, 2)},\\quad F_{${i + 1}y} = ${e.F}\\sin ${e.a}^\\circ = ${sz(k[i].y, 2)}`}</MB>
        ))}
        <MB>{`\\Fx ${osszegLanc(k.map((v) => v.x), 2)} + E_x = 0 \\;\\Rightarrow\\; E_x = ${sz(Ex, 2)}\\ \\text{kN}`}</MB>
        <MB>{`\\Fy ${osszegLanc(k.map((v) => v.y), 2)} + E_y = 0 \\;\\Rightarrow\\; E_y = ${sz(Ey, 2)}\\ \\text{kN}`}</MB>
        <MB>{`|\\underline{E}| = \\sqrt{${zarojel(Ex, 2)}^2 + ${zarojel(Ey, 2)}^2} = ${sz(E.nagysag, 2)}\\ \\text{kN}`}</MB>
        <p className="mt-2 text-[13px] text-petrol-600">
          Ugyanez másképp: az eredő <M>{`\\underline{R} = (${sz(Rx, 2)};\\ ${sz(Ry, 2)})`}</M> kN, és{" "}
          <M>{"\\underline{E} = -\\underline{R}"}</M> — a vektorsokszöget az eredő ellentettje zárja be.
        </p>
      </>
    ),
  };
}

export const EXTRA_GENERATOROK = [
  { cim: "Erő két ponton átmenő hatásvonallal", fn: hatasvonalFeladat },
  { cim: "Két erő közti szög", fn: szogFeladat },
  { cim: "Eredő poláris alakban", fn: polarisFeladat },
  { cim: "Kötélerők egyensúlya", fn: kotelFeladat },
  { cim: "Vektoriális szorzat", fn: vektorialisFeladat },
  { cim: "Egyensúlyozás: az eredő ellentettje", fn: egyensulyozasFeladat },
];

export default function GyakorloExtra() {
  return (
    <>
      <GyakorloDoboz cim="Erő két ponton átmenő hatásvonallal" leiras="Szög nélkül: az irányt két pont adja, az egységvektorral dolgozunk." generator={hatasvonalFeladat} />
      <GyakorloDoboz cim="Két erő közti szög" leiras="Skaláris szorzat — így nem kell irányszögeket kivonni." generator={szogFeladat} />
      <GyakorloDoboz cim="Eredő poláris alakban" leiras="Három erő nagysággal és irányszöggel: eredő nagysága és iránya, síknegyeddel." generator={polarisFeladat} />
      <GyakorloDoboz cim="Kötélerők egyensúlya" leiras="Két ismeretlen nagyságú erő adott irányban — a csomóponti egyensúly klasszikusa." generator={kotelFeladat} />
      <GyakorloDoboz cim="Vektoriális szorzat" leiras="Két térbeli vektor keresztszorzata determinánssal — a 2. modul nyomatékának előszobája." generator={vektorialisFeladat} oszlopok={3} />
      <GyakorloDoboz cim="Egyensúlyozás: az eredő ellentettje" leiras="Három ismert erő és egy ismeretlen egyensúlyozó erő — egyensúlyi kijelentéssel, az ismeretlen a bal oldalon." generator={egyensulyozasFeladat} oszlopok={3} />
    </>
  );
}
