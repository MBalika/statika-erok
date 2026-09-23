"use client";

import GyakorloDoboz from "@/components/GyakorloDoboz";
import GyakorloExtra, { egesz, valaszt, nemNulla, tagK } from "./GyakorloExtra";
import { M, MB } from "@/components/ui/Keplet";
import { f4, zarK, vekK, kereszt, sub, egyseg, hossz, skalar, bakallvany, befogottKonzol, igenybevetelek, csomopontHaromRud, nyomatekTengelyre, tamasztorudak } from "@/lib/terbeli";
import { sz } from "@/lib/szamok";
import { KonzolRajz, BakallvanyRajz, TartalyRajz } from "./TerbeliRajzok";
import { axono, TerHegyek, Felirat, Rud3, Seged3, Tengelyek3, Talp3, EroNyil3, VektorNyil3, SZ } from "./Axono";

/* ============================================================
   1. Háromlábú bakállvány rúderői
   ============================================================ */

const LABAK = [
  [[-4, 0, 0], [5, 0, -4], [5, 0, 4]],
  [[0, 0, 4], [0, 0, 0], [5, 0, -4]],
  [[-3, 0, 3], [-3, 0, -3], [4, 0, 0]],
  [[-4, 0, -2], [3, 0, -3], [1, 0, 4]],
  [[-3, 0, 0], [3, 0, -3], [2, 0, 3]],
];

function bakallvanyFeladat() {
  for (let proba = 0; proba < 100; proba++) {
    const labak = valaszt(LABAK);
    const h = valaszt([4, 5, 6]);
    const csucs = [0, h, 0];
    const F = [egesz(-8, 8), -egesz(4, 14), egesz(-6, 6)];
    if (Math.random() < 0.3) F[1] = egesz(-4, 6);
    const er = bakallvany({ csucs, labak, F });
    if (!er.ok || er.S.some((s) => Math.abs(s) > 60 || Math.abs(s) < 0.3)) continue;
    const { S, e, l } = er;
    const komp = ["x", "y", "z"];
    const makro = ["\\Fx", "\\Fy", "\\Fz"];
    const tag = (i, k) => `${e[i][k] < 0 ? "-" : "+"} ${f4(Math.abs(e[i][k]))}\\,S_${i + 1}`;
    return {
      szoveg: (
        <p>
          Egy háromlábú bakállvány csúcsa <M>{`C(0;\\ ${h};\\ 0)`}</M>, a rudak talppontjai <M>{`1:(${labak[0].join(";\\ ")})`}</M>, <M>{`2:(${labak[1].join(";\\ ")})`}</M>, <M>{`3:(${labak[2].join(";\\ ")})`}</M> m. A csúcson{" "}
          <M>{`\\underline F = ${vekK(F)}`}</M> kN hat. Számítsd ki a három rúderőt (húzott = pozitív)!
        </p>
      ),
      abra: <BakallvanyRajz csucs={csucs} labak={labak} F={F} Fcimke={`F = ${sz(hossz(F), 2)} kN`} magyarazat={[`A teher komponensei: (${F.join("; ")}) kN.`]} />,
      sugo: (
        <p>
          A csomópont közös metszéspontú térbeli erőrendszer: három vetületi egyenlet. Rúdvektor <M>{"\\underline l_i"}</M> a csúcsból a talppontba, <M>{"\\underline e_i = \\underline l_i/l_i"}</M>, a rúderő a csomópontra <M>{"S_i\\underline e_i"}</M>. Keress
          egyenletet, amelyben csak egy ismeretlen van (ha két talppont azonos <M>{"x"}</M>-ű vagy <M>{"z"}</M>-jű, gyakran adódik).
        </p>
      ),
      oszlopok: 3,
      mezok: [
        { id: "s1", cimke: "S_1", egyseg: "kN", helyes: S[0], tizedes: 2 },
        { id: "s2", cimke: "S_2", egyseg: "kN", helyes: S[1], tizedes: 2 },
        { id: "s3", cimke: "S_3", egyseg: "kN", helyes: S[2], tizedes: 2 },
      ],
      megoldas: (
        <>
          {labak.map((p, i) => (
            <MB key={i}>{`\\underline l_${i + 1} = ${vekK(sub(p, csucs))},\\quad l_${i + 1} = ${f4(l[i])}\\ \\text{m},\\quad \\underline e_${i + 1} = ${vekK(e[i])}`}</MB>
          ))}
          <MB>{"(\\underline F, \\underline S_1, \\underline S_2, \\underline S_3) \\ekv \\underline O"}</MB>
          {komp.map((k, i) => (
            <MB key={k}>{`${makro[i]} ${zarK(F[i])} ${tag(0, i)} ${tag(1, i)} ${tag(2, i)} = 0`}</MB>
          ))}
          <MB>{`S_1 = ${f4(S[0])},\\quad S_2 = ${f4(S[1])},\\quad S_3 = ${f4(S[2])}\\ \\text{kN}`}</MB>
          <p className="mt-2 text-[13px] text-petrol-600">
            {S.map((s, i) => `${i + 1}. rúd ${s < 0 ? "nyomott" : "húzott"}`).join(", ")}. Ellenőrzés: az erők összege <M>{vekK(er.ellenorzes.F)}</M> ✓.
          </p>
        </>
      ),
    };
  }
  return konzolReakcioFeladat();
}

/* ============================================================
   2. Befogott térbeli konzol reakciói
   ============================================================ */

function konzolReakcioFeladat() {
  const a = valaszt([1, 1.5, 2, 2.5, 3]);
  const b = valaszt([2, 2.5, 3, 4]);
  const F = [egesz(-8, 8), egesz(-10, 6), nemNulla(-8, 8)];
  if (F[0] === 0 && F[1] === 0) F[0] = 3;
  const E = [-a, b, 0];
  const er = befogottKonzol({ A: [0, 0, 0], terhek: [{ pont: E, F }] });
  const { R, MA } = er;
  const rxF = kereszt(E, F);
  return {
    szoveg: (
      <p>
        A tört tengelyű konzol az <M>{"A"}</M> origóban van befogva, függőleges szára <M>{`b = ${sz(b, 1)}`}</M> m, vízszintes szára <M>{`a = ${sz(a, 1)}`}</M> m a <M>{"-x"}</M> irányba. A végén, az <M>{`E(${sz(-a, 1)};\\ ${sz(b, 1)};\\ 0)`}</M>{" "}
        pontban <M>{`\\underline F = ${vekK(F)}`}</M> kN hat. Számítsd ki a befogás hat reakciókomponensét (a pozitív tengelyirányokkal felvéve)!
      </p>
    ),
    abra: <KonzolRajz a={a} b={b} F={F} Fcimke={`F = (${F.join("; ")})`} magyarazat={[`|F| = ${sz(hossz(F), 2)} kN.`]} />,
    sugo: (
      <p>
        <M>{"\\underline A = -\\underline F"}</M>; az <M>{"A"}</M>-n átmenő tengelyekre a reakcióerők nem forgatnak: <M>{"\\underline M_A = -\\underline r_E\\times\\underline F"}</M>, komponensenként <M>{"M_x = y F_z - z F_y"}</M>,{" "}
        <M>{"M_y = z F_x - x F_z"}</M>, <M>{"M_z = x F_y - y F_x"}</M>.
      </p>
    ),
    oszlopok: 3,
    mezok: [
      { id: "ax", cimke: "A_x", egyseg: "kN", helyes: R[0], tizedes: 2 },
      { id: "ay", cimke: "A_y", egyseg: "kN", helyes: R[1], tizedes: 2 },
      { id: "az", cimke: "A_z", egyseg: "kN", helyes: R[2], tizedes: 2 },
      { id: "mx", cimke: "M_Ax", egyseg: "kNm", helyes: MA[0], tizedes: 2 },
      { id: "my", cimke: "M_Ay", egyseg: "kNm", helyes: MA[1], tizedes: 2 },
      { id: "mz", cimke: "M_Az", egyseg: "kNm", helyes: MA[2], tizedes: 2 },
    ],
    megoldas: (
      <>
        <MB>{"(\\underline F, \\underline A, \\underline M_A) \\ekv \\underline O"}</MB>
        <MB>{`\\Fx ${zarK(F[0])} + A_x = 0,\\quad \\Fy ${zarK(F[1])} + A_y = 0,\\quad \\Fz ${zarK(F[2])} + A_z = 0 \\Rightarrow \\underline A = ${vekK(R)}\\ \\text{kN}`}</MB>
        <MB>{`\\sum M_{ix}:\\ ${f4(E[1])}\\cdot${zarK(F[2])} - 0\\cdot${zarK(F[1])} + M_{Ax} = 0 \\Rightarrow M_{Ax} = ${f4(MA[0])}`}</MB>
        <MB>{`\\sum M_{iy}:\\ 0\\cdot${zarK(F[0])} - ${zarK(E[0])}\\cdot${zarK(F[2])} + M_{Ay} = 0 \\Rightarrow M_{Ay} = ${f4(MA[1])}`}</MB>
        <MB>{`\\sum M_{iz}:\\ ${zarK(E[0])}\\cdot${zarK(F[1])} - ${f4(E[1])}\\cdot${zarK(F[0])} + M_{Az} = 0 \\Rightarrow M_{Az} = ${f4(MA[2])}`}</MB>
        <p className="mt-2 text-[13px] text-petrol-600">
          Vektorosan <M>{`\\underline r_E\\times\\underline F = ${vekK(rxF)}`}</M>, <M>{"\\underline M_A"}</M> ennek ellentettje. Ellenőrzés az <M>{"E"}</M>-re: <M>{`(\\underline r_A - \\underline r_E)\\times\\underline A + \\underline M_A = ${vekK(kereszt(sub([0, 0, 0], E), R))} + ${vekK(MA)} = \\underline 0`}</M> ✓.
        </p>
      </>
    ),
  };
}

/* ============================================================
   3. Egy keresztmetszet hat igénybevétele
   ============================================================ */

function keresztmetszetFeladat() {
  const a = valaszt([1, 1.5, 2, 2.5, 3]);
  const b = valaszt([2, 2.5, 3, 4]);
  const F = [nemNulla(-8, 8), nemNulla(-10, 6), nemNulla(-8, 8)];
  const E = [-a, b, 0];
  const fuggoleges = Math.random() < 0.5;
  const s = fuggoleges ? valaszt([0.5, 1, 1.5, 2]) : b + valaszt([0.5, 1]);
  if (!fuggoleges && s - b >= a) return keresztmetszetFeladat();
  if (fuggoleges && s >= b) return keresztmetszetFeladat();
  const K = fuggoleges ? [0, s, 0] : [-(s - b), b, 0];
  const t = fuggoleges ? [0, 1, 0] : [1, 0, 0];
  const oldal = fuggoleges ? "koveto" : "megelozo";
  const ig = igenybevetelek({ K, t, oldal, erok: [{ pont: E, F }] });
  const rK = sub(E, K);
  const jel = oldal === "koveto" ? "" : "-";
  return {
    szoveg: (
      <p>
        A tört tengelyű befogott konzol (<M>{`a = ${sz(a, 1)}`}</M>, <M>{`b = ${sz(b, 1)}`}</M> m, <M>{"A"}</M> az origó) végén, az <M>{`E(${sz(-a, 1)};\\ ${sz(b, 1)};\\ 0)`}</M> pontban <M>{`\\underline F = ${vekK(F)}`}</M> kN hat. Határozd meg a{" "}
        <M>{`K(${sz(K[0], 1)};\\ ${sz(K[1], 1)};\\ 0)`}</M> keresztmetszet igénybevételeit ({fuggoleges ? "a függőleges száron, tengelye az y" : "a vízszintes száron, tengelye az x"})! Előjelek a tankönyv 9.3 szerint (a megelőző rész keresztmetszetén a
        globális tengelyek pozitív iránya pozitív).
      </p>
    ),
    abra: <KonzolRajz a={a} b={b} F={F} Fcimke={`F = (${F.join("; ")})`} metszetek={[{ s, nev: "K" }]} magyarazat={[fuggoleges ? "K a függőleges száron: a követő rész a K feletti rész (F-fel)." : "K a vízszintes száron: a megelőző rész a szabad vég (F-fel)."]} />,
    sugo: (
      <p>
        A terhelt (szabad végi) részből számolj: {fuggoleges ? <>ez a <em>követő</em> rész, <M>{"\\underline R = +\\underline F"}</M>, <M>{"\\underline M_K = +(\\underline r_E - \\underline r_K)\\times\\underline F"}</M></> : <>ez a <em>megelőző</em> rész, <M>{"\\underline R = -\\underline F"}</M>, <M>{"\\underline M_K = -(\\underline r_E - \\underline r_K)\\times\\underline F"}</M></>}. A tengelyirányú komponens
        az <M>{"N"}</M> és a <M>{"T"}</M>, a másik kettő a nyíróerő és a hajlítónyomaték.
      </p>
    ),
    oszlopok: 3,
    mezok: ig.lista.map((el) => ({ id: el.nev, cimke: el.nev.replace("_", "") + (el.nev === "N" ? " (húzás +)" : ""), egyseg: el.fajta === "ero" ? "kN" : "kNm", helyes: el.ertek, tizedes: 2 })),
    megoldas: (
      <>
        <MB>{`\\underline R_K = ${jel}\\underline F = ${vekK(ig.R)}\\ \\text{kN}`}</MB>
        <MB>{`\\underline M_K = ${jel}(\\underline r_E - \\underline r_K)\\times\\underline F = ${jel}${vekK(rK)}\\times${vekK(F)} = ${vekK(ig.MK)}\\ \\text{kNm}`}</MB>
        <MB>{ig.lista.map((el) => `${el.tex} = ${f4(el.ertek)}`).join(",\\quad ")}</MB>
        <p className="mt-2 text-[13px] text-petrol-600">
          A tengely a(z) <M>{fuggoleges ? "y" : "x"}</M>: <M>{"N"}</M> és <M>{"T"}</M> ennek a komponense; a nyíróerők és hajlítónyomatékok a másik két tengely szerint. <M>{`N ${ig.N < 0 ? "< 0" : ig.N > 0 ? "> 0" : "= 0"}`}</M>:{" "}
          {ig.N < 0 ? "a szár nyomott." : ig.N > 0 ? "a szár húzott." : "nincs normálerő."} {fuggoleges ? "A csavarás az y tengely körül a kinyúlásból származik." : "A vízszintes száron T = 0: az erő hatásvonala metszi a szár tengelyét."}
        </p>
      </>
    ),
  };
}

/* ============================================================
   4. Támasztórudak: gömbcsukló + három rúd egy lapon
   ============================================================ */

function tamasztorudFeladat() {
  for (let proba = 0; proba < 60; proba++) {
    const Lx = valaszt([3, 4, 5, 6]);
    const Lz = valaszt([2, 3, 4]);
    const H = valaszt([1, 2, 3]);
    const G = valaszt([20, 40, 60, 80, 100]);
    const F = valaszt([0, 10, 20, 30]);
    const rudak = [
      { pont: [0, 0, Lz], masik: [0, -3, Lz] },
      { pont: [Lx, 0, 0], masik: [Lx + 2, 0, 0] },
      { pont: [Lx, 0, 0], masik: [Lx, -3, 0] },
    ];
    const terhek = [{ pont: [Lx / 2, 0, Lz / 2], F: [0, -G, 0] }];
    if (F) terhek.push({ pont: [0, H, 0], F: [-F, 0, 0] });
    const er = tamasztorudak({ rudak, gombcsuklo: [Lx, 0, Lz], terhek });
    if (!er.ok) continue;
    const [S1, S2, S3] = er.S;
    const A = er.A;
    return {
      szoveg: (
        <p>
          Egy <M>{`${Lx}\\times${Lz}`}</M> m-es vízszintes lapot (<M>{`x\\in[0;${Lx}],\\ z\\in[0;${Lz}]`}</M>, <M>{"y = 0"}</M>) gömbcsukló támaszt az <M>{`A(${Lx};\\ 0;\\ ${Lz})`}</M> sarkán, függőleges 1-es rúd a <M>{`(0;\\ 0;\\ ${Lz})`}</M> és
          függőleges 3-as rúd a <M>{`(${Lx};\\ 0;\\ 0)`}</M> sarkán, valamint a <M>{`(${Lx};\\ 0;\\ 0)`}</M> sarokból <M>{"+x"}</M> irányban induló 2-es rúd. A lap közepén <M>{`G = ${G}`}</M> kN függőleges teher hat
          {F ? <>, és a <M>{`(0;\\ ${H};\\ 0)`}</M> pontban (egy <M>{`${H}`}</M> m magas oszlop tetején) <M>{`F = ${F}`}</M> kN a <M>{"-x"}</M> irányban</> : null}. Számítsd ki a rúderőket és a csukló függőleges reakcióját!
        </p>
      ),
      abra: <TartalyRajz Fcimke={F ? `F = ${F} kN` : ""} gamma={`G = ${G} kN a lap közepén`} magyarazat={["A rajz a H13/4 elrendezését mutatja (a tartály helyett itt lap + oszlop);", "a méretek a feladatszövegben."]} />,
      sugo: (
        <p>
          Nyomatéki egyenletek az <M>{"A"}</M>-n átmenő tengelyekre: az <M>{"x"}</M> tengelyre csak <M>{"S_3"}</M> és <M>{"G"}</M> forgat, az <M>{"y"}</M>-ra csak <M>{"S_2"}</M> és <M>{"F"}</M>, a <M>{"z"}</M>-re <M>{"S_1"}</M>, <M>{"G"}</M> és{" "}
          <M>{"F"}</M>. Utána <M>{"\\Fy"}</M> adja <M>{"A_y"}</M>-t.
        </p>
      ),
      oszlopok: 2,
      mezok: [
        { id: "s1", cimke: "S_1 (húzott +)", egyseg: "kN", helyes: S1, tizedes: 2 },
        { id: "s2", cimke: "S_2 (húzott +)", egyseg: "kN", helyes: S2, tizedes: 2 },
        { id: "s3", cimke: "S_3 (húzott +)", egyseg: "kN", helyes: S3, tizedes: 2 },
        { id: "ay", cimke: "A_y (felfelé +)", egyseg: "kN", helyes: A[1], tizedes: 2 },
      ],
      megoldas: (
        <>
          <MB>{`(\\underline G${F ? ", \\underline F" : ""}, \\underline A, \\underline S_1, \\underline S_2, \\underline S_3) \\ekv \\underline O`}</MB>
          <MB>{`\\sum M_{ix}:\\ -${f4(Lz / 2)}\\cdot${G} - ${Lz}\\,S_3 = 0 \\Rightarrow S_3 = ${f4(S3)}\\ \\text{kN}`}</MB>
          <MB>{`\\sum M_{iy}:\\ ${F ? `${f4(Lz * F)} ` : "0 "}- ${Lz}\\,S_2 = 0 \\Rightarrow S_2 = ${f4(S2)}\\ \\text{kN}`}</MB>
          <MB>{`\\sum M_{iz}:\\ ${f4(Lx / 2)}\\cdot${G} ${F ? `+ ${H}\\cdot${F} ` : ""}+ ${Lx}\\,S_1 = 0 \\Rightarrow S_1 = ${f4(S1)}\\ \\text{kN}`}</MB>
          <MB>{`\\Fy -${G} - S_1 - S_3 + A_y = 0 \\Rightarrow A_y = ${f4(A[1])}\\ \\text{kN};\\qquad \\Fx ${F ? `-${F} ` : "0 "}+ S_2 + A_x = 0 \\Rightarrow A_x = ${f4(A[0])}`}</MB>
          <p className="mt-2 text-[13px] text-petrol-600">
            Ellenőrzés az origóra: <M>{`\\sum\\underline M_{iO} = ${vekK(er.ellenorzes.M)}`}</M> ✓. A helyvektorok az <M>{"A"}</M>-ból: <M>{"G"}</M>: <M>{`(${f4(-Lx / 2)};\\ 0;\\ ${f4(-Lz / 2)})`}</M>, <M>{"S_1"}</M>: <M>{`(${-Lx};\\ 0;\\ 0)`}</M>, <M>{"S_2, S_3"}</M>:{" "}
            <M>{`(0;\\ 0;\\ ${-Lz})`}</M>.
          </p>
        </>
      ),
    };
  }
  return konzolReakcioFeladat();
}

/* ============================================================
   5. Térbeli rácsos tartó csomópontja (három ismeretlen rúd + egy ismert)
   ============================================================ */

function CsomopontRajz({ P, vegek, ismert, F }) {
  const v = axono({ ox: 300, oy: 250, s: 26 });
  return (
    <svg viewBox="0 0 600 340" className="w-full h-auto" role="img">
      <TerHegyek />
      <Felirat x={300} y={20} meret={12.5}>A csomópont és a hozzá futó rudak</Felirat>
      <Tengelyek3 v={v} hossz={[3, 3, 3]} />
      {vegek.map((q, i) => (
        <g key={i}>
          <Rud3 v={v} a={P} b={q} vastag={4} szin={SZ.tarto} />
          <Talp3 v={v} p={q} />
          <Felirat x={v([(P[0] + q[0]) / 2, (P[1] + q[1]) / 2, (P[2] + q[2]) / 2])[0] + 10} y={v([(P[0] + q[0]) / 2, (P[1] + q[1]) / 2, (P[2] + q[2]) / 2])[1] - 6} meret={11.5} szin={SZ.tarto} horgony="start">
            {i + 1}
          </Felirat>
          <Seged3 v={v} a={q} b={[q[0], 0, q[2]]} />
        </g>
      ))}
      <Rud3 v={v} a={P} b={ismert.veg} vastag={4} szin={ismert.S < 0 ? SZ.nyomott : SZ.huzott} />
      <Talp3 v={v} p={ismert.veg} />
      <Felirat x={v([(P[0] + ismert.veg[0]) / 2, (P[1] + ismert.veg[1]) / 2, (P[2] + ismert.veg[2]) / 2])[0] + 10} y={v([(P[0] + ismert.veg[0]) / 2, (P[1] + ismert.veg[1]) / 2, (P[2] + ismert.veg[2]) / 2])[1] - 6} meret={11.5} szin={ismert.S < 0 ? SZ.nyomott : SZ.huzott} horgony="start">
        4: S₄ = {sz(ismert.S, 1)} kN
      </Felirat>
      <circle cx={v(P)[0]} cy={v(P)[1]} r="4.5" fill="white" stroke={SZ.tarto} strokeWidth="2" />
      <Felirat x={v(P)[0] - 10} y={v(P)[1] - 8} meret={12} dolt horgony="end">P</Felirat>
      <EroNyil3 v={v} pont={P} F={F} leptek={4} cimke="F" cimkeEltolas={[0, -6]} />
      <Felirat x={300} y={330} meret={11} vastag={false} szin="#475569">A talppontok gömbcsuklók; a 4-es rúd ereje már ismert (piros: húzott, kék: nyomott).</Felirat>
    </svg>
  );
}

function racsosCsomopontFeladat() {
  for (let proba = 0; proba < 100; proba++) {
    const P = [egesz(0, 2), valaszt([3, 4, 5]), egesz(0, 2)];
    const vegek = [
      [P[0] - egesz(2, 4), 0, P[2] + egesz(-1, 2)],
      [P[0] + egesz(2, 4), 0, P[2] - egesz(1, 3)],
      [P[0] + egesz(-1, 2), 0, P[2] + egesz(2, 4)],
    ];
    const ismertVeg = [P[0] + egesz(3, 5), P[1] + egesz(-1, 1), P[2] + egesz(-2, 2)];
    const S4 = valaszt([-12, -8, -6, 5, 8, 10]);
    const F = [egesz(-4, 4), -egesz(6, 16), egesz(-4, 4)];
    const e4 = egyseg(sub(ismertVeg, P));
    const ismertEro = [e4[0] * S4, e4[1] * S4, e4[2] * S4];
    const er = csomopontHaromRud({ ismertErok: [F, ismertEro], rudIranyok: vegek.map((q) => sub(q, P)) });
    if (!er.ok || er.S.some((s) => Math.abs(s) > 80 || Math.abs(s) < 0.3)) continue;
    const komp = ["x", "y", "z"];
    const makro = ["\\Fx", "\\Fy", "\\Fz"];
    const tag = (i, k) => `${er.e[i][k] < 0 ? "-" : "+"} ${f4(Math.abs(er.e[i][k]))}\\,S_${i + 1}`;
    return {
      szoveg: (
        <p>
          Egy térbeli rácsos tartó <M>{`P(${P.join(";\\ ")})`}</M> csomópontjába négy rúd fut: az 1-es a <M>{`(${vegek[0].join(";\\ ")})`}</M>, a 2-es a <M>{`(${vegek[1].join(";\\ ")})`}</M>, a 3-as a <M>{`(${vegek[2].join(";\\ ")})`}</M> pontba,
          a 4-es a <M>{`(${ismertVeg.join(";\\ ")})`}</M> pontba, és ennek ereje az előző csomópontból már ismert: <M>{`S_4 = ${S4}`}</M> kN. A csomóponton <M>{`\\underline F = ${vekK(F)}`}</M> kN teher hat. Számítsd ki <M>{"S_1, S_2, S_3"}</M>-at!
        </p>
      ),
      abra: <CsomopontRajz P={P} vegek={vegek} ismert={{ veg: ismertVeg, S: S4 }} F={F} />,
      sugo: (
        <p>
          A csomópontra a teher, az ismert <M>{"S_4\\underline e_4"}</M> és a három ismeretlen <M>{"S_i\\underline e_i"}</M> hat (<M>{"\\underline e_i"}</M> a csomópontból a rúd túlsó vége felé). Három vetületi egyenlet — a tankönyv 9.2.4 szerint csomópontonként
          három rúderő számítható.
        </p>
      ),
      oszlopok: 3,
      mezok: [
        { id: "s1", cimke: "S_1", egyseg: "kN", helyes: er.S[0], tizedes: 2 },
        { id: "s2", cimke: "S_2", egyseg: "kN", helyes: er.S[1], tizedes: 2 },
        { id: "s3", cimke: "S_3", egyseg: "kN", helyes: er.S[2], tizedes: 2 },
      ],
      megoldas: (
        <>
          <MB>{`\\underline e_4 = ${vekK(e4)},\\quad S_4\\underline e_4 = ${vekK(ismertEro)}\\ \\text{kN};\\qquad \\underline e_1 = ${vekK(er.e[0])},\\ \\underline e_2 = ${vekK(er.e[1])},\\ \\underline e_3 = ${vekK(er.e[2])}`}</MB>
          <MB>{"(\\underline F, \\underline S_4, \\underline S_1, \\underline S_2, \\underline S_3) \\ekv \\underline O"}</MB>
          {komp.map((k, i) => (
            <MB key={k}>{`${makro[i]} ${zarK(F[i])} ${tagK(ismertEro[i])} ${tag(0, i)} ${tag(1, i)} ${tag(2, i)} = 0`}</MB>
          ))}
          <MB>{`S_1 = ${f4(er.S[0])},\\quad S_2 = ${f4(er.S[1])},\\quad S_3 = ${f4(er.S[2])}\\ \\text{kN}`}</MB>
          <p className="mt-2 text-[13px] text-petrol-600">Ellenőrzés: visszahelyettesítve az erők összege <M>{vekK(er.ellenorzes)}</M> ✓. {er.S.map((s, i) => `${i + 1}: ${s < 0 ? "nyomott" : "húzott"}`).join(", ")}.</p>
        </>
      ),
    };
  }
  return bakallvanyFeladat();
}

/* ============================================================
   6. Erő nyomatéka tengelyre
   ============================================================ */

function NyomatekRajz({ P, F, Q, e }) {
  const v = axono({ ox: 280, oy: 230, s: 30 });
  const veg1 = [Q[0] - e[0] * 4, Q[1] - e[1] * 4, Q[2] - e[2] * 4];
  const veg2 = [Q[0] + e[0] * 4, Q[1] + e[1] * 4, Q[2] + e[2] * 4];
  return (
    <svg viewBox="0 0 600 330" className="w-full h-auto" role="img">
      <TerHegyek />
      <Felirat x={300} y={20} meret={12.5}>Az erő és a t tengely</Felirat>
      <Tengelyek3 v={v} hossz={[3.5, 3.5, 3]} />
      <Rud3 v={v} a={veg1} b={veg2} vastag={2} szin={SZ.zold} />
      <VektorNyil3 v={v} pont={Q} F={e} leptek={40} minHossz={40} szin={SZ.zold} cimke="e_t" cimkeEltolas={[10, 4]} horgony="start" />
      <circle cx={v(Q)[0]} cy={v(Q)[1]} r="3.5" fill={SZ.zold} />
      <Felirat x={v(Q)[0] - 8} y={v(Q)[1] + 14} meret={11.5} szin={SZ.zold} dolt horgony="end">Q</Felirat>
      <Seged3 v={v} a={[0, 0, 0]} b={P} szin={SZ.kek} />
      <circle cx={v(P)[0]} cy={v(P)[1]} r="4" fill="white" stroke={SZ.tarto} strokeWidth="2" />
      <Felirat x={v(P)[0] + 8} y={v(P)[1] + 14} meret={11.5} dolt horgony="start">P</Felirat>
      <EroNyil3 v={v} pont={P} F={F} leptek={4} cimke="F" cimkeEltolas={[0, -6]} />
      <Felirat x={300} y={318} meret={11} vastag={false} szin="#475569">Zöld: a t tengely a Q ponton át; kék szaggatott: a P helyvektora az origóból.</Felirat>
    </svg>
  );
}

function nyomatekTengelyreFeladat() {
  for (let proba = 0; proba < 50; proba++) {
    const P = [egesz(-3, 4), egesz(0, 4), egesz(-3, 3)];
    const F = [nemNulla(-6, 6), egesz(-8, 8), nemNulla(-6, 6)];
    const Q = valaszt([[0, 0, 0], [0, 0, 0], [egesz(-2, 2), egesz(0, 3), egesz(-2, 2)]]);
    const e = valaszt([[1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 1, 0], [1, 0, 1], [0, 1, 1], [1, 1, 1], [2, -1, 2]]);
    const er = nyomatekTengelyre({ pont: P, F, Q, e });
    if (hossz(er.MQ) < 1e-9) continue;
    return {
      szoveg: (
        <p>
          A <M>{`P(${P.join(";\\ ")})`}</M> pontban <M>{`\\underline F = ${vekK(F)}`}</M> kN hat. Számítsd ki az erő nyomatékvektorát a <M>{`Q(${Q.join(";\\ ")})`}</M> pontra, majd a nyomatékát a <M>{"Q"}</M>-n átmenő,{" "}
          <M>{`(${e.join(";\\ ")})`}</M> irányvektorú <M>{"t"}</M> tengelyre (<M>{"M_t = \\underline M_Q\\cdot\\underline e_t"}</M>, <M>{"\\underline e_t"}</M> egységvektor)!
        </p>
      ),
      abra: <NyomatekRajz P={P} F={F} Q={Q} e={er.et} />,
      sugo: (
        <p>
          <M>{"\\underline M_Q = (\\underline r_P - \\underline r_Q)\\times\\underline F"}</M>; a tengelyre vett nyomaték a nyomatékvektor vetülete a tengely egységvektorára (2. modul, 2.7). Ha <M>{"M_t = 0"}</M>: az erő metszi vagy párhuzamos a
          tengellyel.
        </p>
      ),
      oszlopok: 2,
      mezok: [
        { id: "mx", cimke: "M_Qx", egyseg: "kNm", helyes: er.MQ[0], tizedes: 2 },
        { id: "my", cimke: "M_Qy", egyseg: "kNm", helyes: er.MQ[1], tizedes: 2 },
        { id: "mz", cimke: "M_Qz", egyseg: "kNm", helyes: er.MQ[2], tizedes: 2 },
        { id: "mt", cimke: "M_t", egyseg: "kNm", helyes: er.Mt, tizedes: 3 },
      ],
      megoldas: (
        <>
          <MB>{`\\underline r = \\underline r_P - \\underline r_Q = ${vekK(sub(P, Q))}\\ \\text{m}`}</MB>
          <MB>{`\\underline M_Q = \\underline r\\times\\underline F = (r_y F_z - r_z F_y;\\ r_z F_x - r_x F_z;\\ r_x F_y - r_y F_x) = ${vekK(er.MQ)}\\ \\text{kNm}`}</MB>
          <MB>{`\\underline e_t = ${vekK(er.et)},\\qquad M_t = \\underline M_Q\\cdot\\underline e_t = ${f4(er.Mt)}\\ \\text{kNm}`}</MB>
          <p className="mt-2 text-[13px] text-petrol-600">
            {Math.abs(er.Mt) < 1e-6 ? "M_t = 0: az erő hatásvonala metszi a tengelyt vagy párhuzamos vele." : `A tengely pozitív vége felől nézve az erő ${er.Mt > 0 ? "az óramutatóval ellentétesen" : "az óramutató járásával egyezően"} forgat.`} A nyomatékvektor a
            <M>{"Q"}</M> pont tengely menti eltolására nem változik.
          </p>
        </>
      ),
    };
  }
  return konzolReakcioFeladat();
}

/* ---------- a szekció ---------- */

export const GENERATOROK = [
  { cim: "Háromlábú bakállvány rúderői", fn: bakallvanyFeladat },
  { cim: "Befogott térbeli konzol reakciói", fn: konzolReakcioFeladat },
  { cim: "Egy keresztmetszet hat igénybevétele", fn: keresztmetszetFeladat },
  { cim: "Gömbcsukló és három támasztórúd", fn: tamasztorudFeladat },
  { cim: "Térbeli rácsos tartó csomópontja", fn: racsosCsomopontFeladat },
  { cim: "Erő nyomatéka tengelyre", fn: nyomatekTengelyreFeladat },
];

export default function GyakorloSzekcio() {
  return (
    <>
      <GyakorloDoboz cim="Háromlábú bakállvány rúderői" leiras="A tankönyv 9.2.2 (és a vizsga 5. feladata): három vetületi egyenlet a csomópontra, a rúderők húzóerőként felvéve." generator={bakallvanyFeladat} oszlopok={3} />
      <GyakorloDoboz cim="Befogott térbeli konzol reakciói" leiras="A H13/1 feladat általános erővel: három vetületi és három nyomatéki egyenlet az A-n átmenő tengelyekre." generator={konzolReakcioFeladat} oszlopok={3} />
      <GyakorloDoboz cim="Egy keresztmetszet hat igénybevétele" leiras="A H13/2 feladat: pontra redukálás a terhelt részből, N, két nyíróerő, T és két hajlítónyomaték a tankönyv 9.3 előjeleivel." generator={keresztmetszetFeladat} oszlopok={3} />
      <GyakorloDoboz cim="Gömbcsukló és három támasztórúd" leiras="A H13/4 elrendezése: nyomatéki egyenletek a csuklón átmenő tengelyekre — egyismeretlenes egyenletek." generator={tamasztorudFeladat} oszlopok={2} />
      <GyakorloDoboz cim="Térbeli rácsos tartó csomópontja" leiras="Csomóponti módszer térben (9.2.4): három ismeretlen rúd, egy ismert rúderő és a teher." generator={racsosCsomopontFeladat} oszlopok={3} />
      <GyakorloDoboz cim="Erő nyomatéka tengelyre" leiras="M_Q = r × F és M_t = M_Q · e_t — ez kell a ferde tengelyre írt nyomatéki egyenlethez." generator={nyomatekTengelyreFeladat} oszlopok={2} />
      <div className="mt-10 mb-4 flex items-center gap-3">
        <span className="h-px flex-1 bg-petrol-200" />
        <span className="text-[11px] font-bold tracking-[0.16em] text-naracs-600 uppercase">További feladattípusok</span>
        <span className="h-px flex-1 bg-petrol-200" />
      </div>
      <GyakorloExtra />
    </>
  );
}
