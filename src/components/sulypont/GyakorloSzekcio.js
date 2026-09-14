"use client";

import GyakorloDoboz from "@/components/GyakorloDoboz";
import { M, MB } from "@/components/ui/Keplet";
import { sz } from "@/lib/szamok";

const egesz = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
const lepes = (min, max, l) => min + l * egesz(0, Math.round((max - min) / l));
const PI = Math.PI;

const rendszer = (
  <span className="text-[13px] text-petrol-500">
    {" "}
    (Koordináta-rendszer: az origó az idom <strong>jobb felső sarka</strong>, y balra, z lefelé.)
  </span>
);

/* ---------- 1. T-szelvény ---------- */

function tSzelvenyFeladat() {
  const B = lepes(120, 400, 20);
  const tf = lepes(10, 40, 5);
  const H = lepes(150, 400, 10);
  const tw = lepes(8, 30, 2);
  const A1 = B * tf;
  const z1 = tf / 2;
  const A2 = tw * (H - tf);
  const z2 = tf + (H - tf) / 2;
  const A = A1 + A2;
  const Sy = A1 * z1 + A2 * z2;
  const zs = Sy / A;
  return {
    szoveg: (
      <p>
        Egy T-szelvény fejlemeze <M>{`${B}\\times${tf}`}</M> mm, gerince <M>{`${tw}\\times${H - tf}`}</M>{" "}
        mm (teljes magasság <M>{`${H}`}</M> mm). Mekkora a terület, és milyen mélyen van a súlypont a{" "}
        <strong>felső éltől</strong> mérve?
      </p>
    ),
    sugo: <p>Két téglalap. A fejlemez súlypontja a felső éltől {sz(z1, 1)} mm-re, a gerincé {sz(tf, 0)} + {sz((H - tf) / 2, 1)} mm-re van.</p>,
    mezok: [
      { id: "a", cimke: "A", egyseg: "mm²", helyes: A, tizedes: 0 },
      { id: "zs", cimke: "zₛ (a felső éltől)", egyseg: "mm", helyes: zs, tizedes: 2 },
    ],
    megoldas: (
      <>
        <MB>{`A_1 = ${B}\\cdot ${tf} = ${sz(A1, 0)}\\ \\text{mm}^2,\\quad z_1 = ${sz(z1, 1)}\\ \\text{mm}`}</MB>
        <MB>{`A_2 = ${tw}\\cdot ${H - tf} = ${sz(A2, 0)}\\ \\text{mm}^2,\\quad z_2 = ${tf} + \\tfrac{${H - tf}}{2} = ${sz(z2, 1)}\\ \\text{mm}`}</MB>
        <MB>{`A = ${sz(A, 0)}\\ \\text{mm}^2,\\qquad S_y = ${sz(A1, 0)}\\cdot ${sz(z1, 1)} + ${sz(A2, 0)}\\cdot ${sz(z2, 1)} = ${sz(Sy, 0)}\\ \\text{mm}^3`}</MB>
        <MB>{`z_S = \\frac{S_y}{A} = ${sz(zs, 2)}\\ \\text{mm}`}</MB>
        <p className="mt-2 text-[13px] text-petrol-600">A szimmetriatengely miatt yₛ a szelvény közepén van, azt nem kell számolni.</p>
      </>
    ),
  };
}

/* ---------- 2. L-szelvény ---------- */

function lSzelvenyFeladat() {
  const B = lepes(80, 300, 10);
  const H = lepes(80, 300, 10);
  const t = lepes(10, 40, 5);
  // függőleges szár a jobb szélen (y: 0..t, z: 0..H−t), vízszintes szár alul (y: 0..B, z: H−t..H)
  const A1 = t * (H - t);
  const y1 = t / 2;
  const z1 = (H - t) / 2;
  const A2 = B * t;
  const y2 = B / 2;
  const z2 = H - t / 2;
  const A = A1 + A2;
  const Sz = A1 * y1 + A2 * y2;
  const Sy = A1 * z1 + A2 * z2;
  const ys = Sz / A;
  const zs = Sy / A;
  return {
    szoveg: (
      <p>
        Egy L alakú szögvas <M>{`${B}`}</M> mm széles és <M>{`${H}`}</M> mm magas, mindkét szára{" "}
        <M>{`t = ${t}`}</M> mm vastag. A függőleges szár a jobb oldalon, a vízszintes szár alul van.
        Hol a súlypont?{rendszer}
      </p>
    ),
    sugo: (
      <p>
        Bontsd két téglalapra úgy, hogy ne fedjék egymást: egy <M>{`${t}\\times${H - t}`}</M>-es álló és egy{" "}
        <M>{`${B}\\times${t}`}</M>-es fekvő darabra. Mindkét koordinátát a közös origótól mérd.
      </p>
    ),
    mezok: [
      { id: "ys", cimke: "yₛ", egyseg: "mm", helyes: ys, tizedes: 2 },
      { id: "zs", cimke: "zₛ", egyseg: "mm", helyes: zs, tizedes: 2 },
    ],
    megoldas: (
      <>
        <MB>{`A_1 = ${t}\\cdot ${H - t} = ${sz(A1, 0)},\\quad y_1 = ${sz(y1, 1)},\\quad z_1 = ${sz(z1, 1)}`}</MB>
        <MB>{`A_2 = ${B}\\cdot ${t} = ${sz(A2, 0)},\\quad y_2 = ${sz(y2, 1)},\\quad z_2 = ${sz(z2, 1)}`}</MB>
        <MB>{`y_S = \\frac{${sz(A1, 0)}\\cdot ${sz(y1, 1)} + ${sz(A2, 0)}\\cdot ${sz(y2, 1)}}{${sz(A, 0)}} = ${sz(ys, 2)}\\ \\text{mm}`}</MB>
        <MB>{`z_S = \\frac{${sz(A1, 0)}\\cdot ${sz(z1, 1)} + ${sz(A2, 0)}\\cdot ${sz(z2, 1)}}{${sz(A, 0)}} = ${sz(zs, 2)}\\ \\text{mm}`}</MB>
        <p className="mt-2 text-[13px] text-petrol-600">Ellenőrzés: a súlypont a két szár súlypontját összekötő szakaszon van, a nagyobb területű szárhoz közelebb.</p>
      </>
    ),
  };
}

/* ---------- 3. Kivonásos ---------- */

function kivonasosFeladat() {
  const B = lepes(160, 400, 20);
  const H = lepes(120, 300, 20);
  const b = lepes(40, Math.min(160, B - 60), 20);
  const h = lepes(40, Math.min(120, H - 40), 20);
  const y0 = lepes(20, B - b - 20, 10);
  const z0 = lepes(20, H - h - 20, 10);
  const A1 = B * H;
  const A2 = b * h;
  const A = A1 - A2;
  const y2 = y0 + b / 2;
  const z2 = z0 + h / 2;
  const Sz = A1 * (B / 2) - A2 * y2;
  const Sy = A1 * (H / 2) - A2 * z2;
  const ys = Sz / A;
  const zs = Sy / A;
  return {
    szoveg: (
      <p>
        Egy <M>{`${B}\\times${H}`}</M> mm-es téglalapból kivágunk egy <M>{`${b}\\times${h}`}</M> mm-es
        téglalapot. A kivágás jobb felső sarka az origótól <M>{`y_0 = ${y0}`}</M> mm-re balra és{" "}
        <M>{`z_0 = ${z0}`}</M> mm-re lefelé van. Hol a lyukas lemez súlypontja?{rendszer}
      </p>
    ),
    sugo: <p>Teljes téglalap mínusz a lyuk. A lyuk területe és statikai nyomatéka negatív előjellel kerül az összegbe.</p>,
    mezok: [
      { id: "ys", cimke: "yₛ", egyseg: "mm", helyes: ys, tizedes: 2 },
      { id: "zs", cimke: "zₛ", egyseg: "mm", helyes: zs, tizedes: 2 },
    ],
    megoldas: (
      <>
        <MB>{`A = ${sz(A1, 0)} - ${sz(A2, 0)} = ${sz(A, 0)}\\ \\text{mm}^2`}</MB>
        <MB>{`S_z = ${sz(A1, 0)}\\cdot ${sz(B / 2, 0)} - ${sz(A2, 0)}\\cdot ${sz(y2, 0)} = ${sz(Sz, 0)}\\ \\text{mm}^3\\ \\Rightarrow\\ y_S = ${sz(ys, 2)}\\ \\text{mm}`}</MB>
        <MB>{`S_y = ${sz(A1, 0)}\\cdot ${sz(H / 2, 0)} - ${sz(A2, 0)}\\cdot ${sz(z2, 0)} = ${sz(Sy, 0)}\\ \\text{mm}^3\\ \\Rightarrow\\ z_S = ${sz(zs, 2)}\\ \\text{mm}`}</MB>
        <p className="mt-2 text-[13px] text-petrol-600">
          Józan ész: a lyuk a{" "}
          {y2 > B / 2 ? "bal" : "jobb"} {z2 > H / 2 ? "alsó" : "felső"} részen van, ezért a súlypont a téglalap közepétől{" "}
          {y2 > B / 2 ? "jobbra" : "balra"} és {z2 > H / 2 ? "felfelé" : "lefelé"} tolódik.
        </p>
      </>
    ),
  };
}

/* ---------- 4. Téglalap + háromszög (derékszögű trapéz) ---------- */

function trapezFeladat() {
  const b = lepes(40, 200, 10);
  const B = b + lepes(40, 200, 10);
  const h = lepes(60, 240, 10);
  // téglalap b×h a jobb szélen; háromszög: csúcsai (b,0), (b,h), (B,h)
  const A1 = b * h;
  const y1 = b / 2;
  const z1 = h / 2;
  const A2 = ((B - b) * h) / 2;
  const y2 = b + (B - b) / 3;
  const z2 = (2 * h) / 3;
  const A = A1 + A2;
  const ys = (A1 * y1 + A2 * y2) / A;
  const zs = (A1 * z1 + A2 * z2) / A;
  return {
    szoveg: (
      <p>
        Egy derékszögű trapéz alsó alapja <M>{`${B}`}</M> mm, felső alapja <M>{`${b}`}</M> mm, magassága{" "}
        <M>{`${h}`}</M> mm. A jobb oldala függőleges, a bal oldala ferde. Hol a súlypont?{rendszer}
      </p>
    ),
    sugo: (
      <p>
        Egy <M>{`${b}\\times${h}`}</M>-es téglalap és egy derékszögű háromszög, amelynek befogói{" "}
        <M>{`${B - b}`}</M> és <M>{`${h}`}</M>. A háromszög súlypontja a derékszögű csúcstól a befogók harmadára van.
      </p>
    ),
    mezok: [
      { id: "ys", cimke: "yₛ", egyseg: "mm", helyes: ys, tizedes: 2 },
      { id: "zs", cimke: "zₛ", egyseg: "mm", helyes: zs, tizedes: 2 },
    ],
    megoldas: (
      <>
        <MB>{`A_1 = ${b}\\cdot ${h} = ${sz(A1, 0)},\\quad y_1 = ${sz(y1, 1)},\\quad z_1 = ${sz(z1, 1)}`}</MB>
        <MB>{`A_2 = \\tfrac12\\cdot ${B - b}\\cdot ${h} = ${sz(A2, 0)},\\quad y_2 = ${b} + \\tfrac{${B - b}}{3} = ${sz(y2, 2)},\\quad z_2 = \\tfrac{2}{3}\\cdot ${h} = ${sz(z2, 2)}`}</MB>
        <MB>{`y_S = \\frac{${sz(A1, 0)}\\cdot ${sz(y1, 1)} + ${sz(A2, 0)}\\cdot ${sz(y2, 2)}}{${sz(A, 0)}} = ${sz(ys, 2)}\\ \\text{mm}`}</MB>
        <MB>{`z_S = \\frac{${sz(A1, 0)}\\cdot ${sz(z1, 1)} + ${sz(A2, 0)}\\cdot ${sz(z2, 2)}}{${sz(A, 0)}} = ${sz(zs, 2)}\\ \\text{mm}`}</MB>
        <p className="mt-2 text-[13px] text-petrol-600">
          A háromszög derékszögű csúcsa a bal alsó sarokban (y = {b}, z = {h}) van: onnan mérve a súlypont a
          vízszintes befogó harmadára balra és a függőleges befogó harmadára felfelé esik.
        </p>
      </>
    ),
  };
}

/* ---------- 5. Köríves idomok ---------- */

function korivesFeladat() {
  const felkor = Math.random() < 0.5;
  if (felkor) {
    // téglalap b×2r a jobb oldalon, félkör balra domborodva (a bal oldalhoz illesztve)
    const r = lepes(20, 100, 10);
    const b = lepes(40, 240, 10);
    const A1 = b * 2 * r;
    const y1 = b / 2;
    const A2 = (r * r * PI) / 2;
    const y2 = b + (4 * r) / (3 * PI);
    const A = A1 + A2;
    const ys = (A1 * y1 + A2 * y2) / A;
    return {
      szoveg: (
        <p>
          Egy <M>{`${b}\\times${2 * r}`}</M> mm-es téglalap bal oldalához egy <M>{`r = ${r}`}</M> mm sugarú
          félkört illesztünk (az idom „D" alakú, a domború oldala balra néz). Mekkora a terület, és hol a
          súlypont a jobb éltől mérve?{rendszer}
        </p>
      ),
      sugo: (
        <p>
          A félkör súlypontja az átmérőjétől <M>{"4r/3\\pi"}</M>-re van, a domború oldal felé. A vízszintes
          szimmetria miatt <M>{"z_S = r"}</M>.
        </p>
      ),
      mezok: [
        { id: "a", cimke: "A", egyseg: "mm²", helyes: A, tizedes: 0 },
        { id: "ys", cimke: "yₛ (a jobb éltől)", egyseg: "mm", helyes: ys, tizedes: 2 },
      ],
      megoldas: (
        <>
          <MB>{`A_1 = ${b}\\cdot ${2 * r} = ${sz(A1, 0)},\\quad y_1 = ${sz(y1, 1)}`}</MB>
          <MB>{`A_2 = \\frac{${r}^2\\pi}{2} = ${sz(A2, 1)},\\quad y_2 = ${b} + \\frac{4\\cdot ${r}}{3\\pi} = ${b} + ${sz((4 * r) / (3 * PI), 2)} = ${sz(y2, 2)}`}</MB>
          <MB>{`A = ${sz(A, 1)}\\ \\text{mm}^2,\\qquad y_S = \\frac{${sz(A1, 0)}\\cdot ${sz(y1, 1)} + ${sz(A2, 1)}\\cdot ${sz(y2, 2)}}{${sz(A, 1)}} = ${sz(ys, 2)}\\ \\text{mm}`}</MB>
        </>
      ),
    };
  }
  // téglalap B×H, a jobb felső sarkából negyedkör (r) kivágva, a kör középpontja az origó
  const B = lepes(120, 300, 20);
  const H = lepes(100, 300, 20);
  const r = lepes(20, Math.min(B, H) / 2, 10);
  const A1 = B * H;
  const A2 = (r * r * PI) / 4;
  const e = (4 * r) / (3 * PI);
  const A = A1 - A2;
  const ys = (A1 * (B / 2) - A2 * e) / A;
  const zs = (A1 * (H / 2) - A2 * e) / A;
  return {
    szoveg: (
      <p>
        Egy <M>{`${B}\\times${H}`}</M> mm-es téglalap jobb felső sarkát egy <M>{`r = ${r}`}</M> mm sugarú
        negyedkörrel levágjuk (a negyedkör középpontja a sarok, vagyis az origó). Hol a súlypont?{rendszer}
      </p>
    ),
    sugo: (
      <p>
        Teljes téglalap mínusz negyedkör. A negyedkör súlypontja a középponttól mindkét irányban{" "}
        <M>{"4r/3\\pi"}</M>-re van — itt az origótól balra és lefelé.
      </p>
    ),
    mezok: [
      { id: "ys", cimke: "yₛ", egyseg: "mm", helyes: ys, tizedes: 2 },
      { id: "zs", cimke: "zₛ", egyseg: "mm", helyes: zs, tizedes: 2 },
    ],
    megoldas: (
      <>
        <MB>{`A_2 = \\frac{${r}^2\\pi}{4} = ${sz(A2, 1)},\\qquad y_2 = z_2 = \\frac{4\\cdot ${r}}{3\\pi} = ${sz(e, 2)}`}</MB>
        <MB>{`A = ${sz(A1, 0)} - ${sz(A2, 1)} = ${sz(A, 1)}\\ \\text{mm}^2`}</MB>
        <MB>{`y_S = \\frac{${sz(A1, 0)}\\cdot ${sz(B / 2, 0)} - ${sz(A2, 1)}\\cdot ${sz(e, 2)}}{${sz(A, 1)}} = ${sz(ys, 2)}\\ \\text{mm}`}</MB>
        <MB>{`z_S = \\frac{${sz(A1, 0)}\\cdot ${sz(H / 2, 0)} - ${sz(A2, 1)}\\cdot ${sz(e, 2)}}{${sz(A, 1)}} = ${sz(zs, 2)}\\ \\text{mm}`}</MB>
        <p className="mt-2 text-[13px] text-petrol-600">A kivágás az origó közelében van, ezért a súlypont a téglalap közepétől az origótól elfelé, balra-lefelé tolódik.</p>
      </>
    ),
  };
}

/* ---------- a szekció ---------- */

export default function GyakorloSzekcio() {
  return (
    <>
      <GyakorloDoboz cim="T-szelvény" leiras="Két téglalap, egy szimmetriatengely — a GYF‑4 mintájára." generator={tSzelvenyFeladat} />
      <GyakorloDoboz cim="L-szelvény: mindkét koordináta" leiras="Nincs szimmetria, yₛ és zₛ is kell. A súlypont az anyagon kívülre eshet." generator={lSzelvenyFeladat} />
      <GyakorloDoboz cim="Kivonásos módszer" leiras="Téglalap lyukkal — a GYF‑5 mintájára, negatív előjelű résszel." generator={kivonasosFeladat} />
      <GyakorloDoboz cim="Téglalap és háromszög" leiras="Derékszögű trapéz: itt dől el, hogy a háromszög súlypontját jó helyről méred-e." generator={trapezFeladat} />
      <GyakorloDoboz cim="Köríves idomok" leiras="Félkör hozzáadva vagy negyedkör kivágva — a 4r/3π használata, a GYF‑6 mintájára." generator={korivesFeladat} />
    </>
  );
}
