"use client";

import GyakorloDoboz from "@/components/GyakorloDoboz";
import { M, MB } from "@/components/ui/Keplet";
import { f4, zarK, vekK, kereszt, skalar, egyseg, hossz, terfogatiTeher, eredoJellege, tamasztorudak } from "@/lib/terbeli";
import { sz } from "@/lib/szamok";
import { TartalyRajz } from "./TerbeliRajzok";

/* ============================================================
   Közös segédek a 10. modul gyakorló generátoraihoz
   ============================================================ */

export const egesz = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
export const valaszt = (tomb) => tomb[Math.floor(Math.random() * tomb.length)];
/** Nem nulla egész min…max között. */
export const nemNulla = (min, max) => {
  let v = 0;
  while (v === 0) v = egesz(min, max);
  return v;
};
export const tagK = (v) => `${v < 0 ? "-" : "+"} ${f4(Math.abs(v))}`;

/* ============================================================
   7. Térbeli erő komponensei a (9.1) képlettel
   ============================================================ */

function eroKomponensekFeladat() {
  const F = valaszt([6, 8, 10, 12, 15, 20]);
  let lx = nemNulla(-5, 5);
  let ly = nemNulla(-5, 5);
  let lz = nemNulla(-5, 5);
  if (Math.random() < 0.3) lz = 0;
  const l = Math.hypot(lx, ly, lz);
  const Fx = (F * lx) / l;
  const Fy = (F * ly) / l;
  const Fz = (F * lz) / l;
  const alfa = Math.acos(lx / l) / (Math.PI / 180);
  const P = [egesz(0, 4), egesz(0, 4), egesz(0, 4)];
  const MO = kereszt(P, [Fx, Fy, Fz]);
  return {
    szoveg: (
      <p>
        Egy <M>{`F = ${F}\\ \\text{kN}`}</M> nagyságú erő hatásvonala a <M>{`P(${P.join(";\\ ")})`}</M> ponton megy át, és irányát a hatásvonal egy szakaszának vetületei adják: <M>{`l_x = ${lx},\\ l_y = ${ly},\\ l_z = ${lz}`}</M> m (az erő a
        vetületek előjelének irányába mutat). Számítsd ki az erő komponenseit, az <M>{"x"}</M> tengellyel bezárt szögét, és az origóra vett nyomatékvektorát!
      </p>
    ),
    sugo: (
      <p>
        Tankönyv (9.1): <M>{"F_x = F\\,l_x/l"}</M>, <M>{"l = \\sqrt{l_x^2 + l_y^2 + l_z^2}"}</M>; <M>{"\\cos\\alpha_x = l_x/l"}</M>; <M>{"\\underline M_O = \\underline r_P\\times\\underline F"}</M>.
      </p>
    ),
    oszlopok: 3,
    mezok: [
      { id: "fx", cimke: "F_x", egyseg: "kN", helyes: Fx, tizedes: 3 },
      { id: "fy", cimke: "F_y", egyseg: "kN", helyes: Fy, tizedes: 3 },
      { id: "fz", cimke: "F_z", egyseg: "kN", helyes: Fz, tizedes: 3 },
      { id: "al", cimke: "α_x (az x tengellyel)", egyseg: "°", helyes: alfa, tizedes: 1 },
      { id: "mx", cimke: "M_Ox", egyseg: "kNm", helyes: MO[0], tizedes: 2 },
      { id: "my", cimke: "M_Oy", egyseg: "kNm", helyes: MO[1], tizedes: 2 },
    ],
    megoldas: (
      <>
        <MB>{`l = \\sqrt{${zarK(lx)}^2 + ${zarK(ly)}^2 + ${zarK(lz)}^2} = ${f4(l)}\\ \\text{m}`}</MB>
        <MB>{`F_x = ${F}\\cdot\\tfrac{${lx}}{${f4(l)}} = ${f4(Fx)},\\quad F_y = ${F}\\cdot\\tfrac{${ly}}{${f4(l)}} = ${f4(Fy)},\\quad F_z = ${F}\\cdot\\tfrac{${lz}}{${f4(l)}} = ${f4(Fz)}\\ \\text{kN}`}</MB>
        <MB>{`\\cos\\alpha_x = \\tfrac{${lx}}{${f4(l)}} = ${f4(lx / l)} \\Rightarrow \\alpha_x = ${f4(alfa)}^\\circ;\\qquad \\text{ellenőrzés: } \\cos^2\\alpha_x + \\cos^2\\alpha_y + \\cos^2\\alpha_z = ${f4((lx * lx + ly * ly + lz * lz) / (l * l))}`}</MB>
        <MB>{`\\underline M_O = \\underline r_P\\times\\underline F = (${P.join(";\\ ")})\\times${vekK([Fx, Fy, Fz])} = ${vekK(MO)}\\ \\text{kNm}`}</MB>
        <p className="mt-2 text-[13px] text-petrol-600">
          A komponensek négyzetösszege <M>{`${f4(Fx * Fx + Fy * Fy + Fz * Fz)} = ${F}^2`}</M> ✓. A nyomatékvektor komponensei: <M>{"M_x = y F_z - z F_y"}</M>, <M>{"M_y = z F_x - x F_z"}</M>, <M>{"M_z = x F_y - y F_x"}</M>.
        </p>
      </>
    ),
  };
}

/* ============================================================
   8. Térfogati teher eredője és a tartály rúderői
   ============================================================ */

function terfogatiTeherFeladat() {
  for (let proba = 0; proba < 50; proba++) {
    const Lx = valaszt([3, 4, 5, 6]);
    const Lz = valaszt([2, 3, 4]);
    const H = valaszt([1, 1.5, 2, 2.5]);
    const gamma = valaszt([10, 12, 15, 18, 20]);
    const F = valaszt([0, 20, 40, 60]);
    const tf = terfogatiTeher({ x: [0, Lx], y: [0, H], z: [0, Lz], gamma });
    const rudak = [
      { pont: [0, 0, Lz], masik: [0, -3, Lz] },
      { pont: [Lx, 0, 0], masik: [Lx + 2, 0, 0] },
      { pont: [Lx, 0, 0], masik: [Lx, -3, 0] },
    ];
    const terhek = [{ pont: tf.sulypont, F: tf.F }];
    if (F) terhek.push({ pont: [0, H, 0], F: [-F, 0, 0] });
    const er = tamasztorudak({ rudak, gombcsuklo: [Lx, 0, Lz], terhek });
    if (!er.ok) continue;
    const [S1, S2, S3] = er.S;
    const A = er.A;
    return {
      szoveg: (
        <p>
          Egy <M>{`${Lx}\\times${Lz}\\times${sz(H, 1)}`}</M> m-es tartályt (<M>{`x\\in[0;${Lx}],\\ z\\in[0;${Lz}],\\ y\\in[0;${sz(H, 1)}]`}</M>) <M>{`\\gamma = ${gamma}\\ \\text{kN/m}^3`}</M> fajsúlyú folyadék tölt ki. Megtámasztása mint a H13/4
          feladatban: gömbcsukló az <M>{`A(${Lx};\\ 0;\\ ${Lz})`}</M> pontban, 1-es rúd függőlegesen a <M>{`(0;\\ 0;\\ ${Lz})`}</M>, 3-as rúd függőlegesen a <M>{`(${Lx};\\ 0;\\ 0)`}</M> pontból lefelé, 2-es rúd a <M>{`(${Lx};\\ 0;\\ 0)`}</M> pontból a{" "}
          <M>{"+x"}</M> irányban.
          {F ? (
            <>
              {" "}
              A hátsó-felső <M>{`(0;\\ ${sz(H, 1)};\\ 0)`}</M> sarkon <M>{`F = ${F}`}</M> kN hat a <M>{"-x"}</M> irányban.
            </>
          ) : null}{" "}
          Számítsd ki a töltés súlyát és a rúderőket!
        </p>
      ),
      abra: <TartalyRajz Fcimke={F ? `F = ${F} kN` : ""} gamma={`γ = ${gamma} kN/m³`} magyarazat={[`A rajz a H13/4 elrendezését mutatja; itt a tartály ${Lx} × ${Lz} × ${sz(H, 1)} m.`]} />,
      sugo: (
        <p>
          <M>{"G = \\gamma V"}</M> a töltés súlypontjában (<M>{"L_x/2;\\ H/2;\\ L_z/2"}</M>). Nyomatéki egyenletek az <M>{"A"}</M> csuklón átmenő <M>{"x, y, z"}</M> tengelyekre: mindegyikben egyetlen rúderő marad.
        </p>
      ),
      oszlopok: 2,
      mezok: [
        { id: "g", cimke: "G", egyseg: "kN", helyes: tf.G, tizedes: 1 },
        { id: "s1", cimke: "S_1 (húzott +)", egyseg: "kN", helyes: S1, tizedes: 1 },
        { id: "s2", cimke: "S_2 (húzott +)", egyseg: "kN", helyes: S2, tizedes: 1 },
        { id: "s3", cimke: "S_3 (húzott +)", egyseg: "kN", helyes: S3, tizedes: 1 },
      ],
      megoldas: (
        <>
          <MB>{`G = \\gamma V = ${gamma}\\cdot(${Lx}\\cdot${sz(H, 1)}\\cdot${Lz}) = ${f4(tf.G)}\\ \\text{kN},\\qquad \\underline r_G = ${vekK(tf.sulypont)}\\ \\text{m}`}</MB>
          <MB>{`(\\underline G${F ? ", \\underline F" : ""}, \\underline A, \\underline S_1, \\underline S_2, \\underline S_3) \\ekv \\underline O`}</MB>
          <p>Az <M>{"A"}</M>-ból mért helyvektorok: <M>{`\\underline r_G = ${vekK([tf.sulypont[0] - Lx, tf.sulypont[1], tf.sulypont[2] - Lz])}`}</M>{F ? <>, <M>{`\\underline r_F = ${vekK([-Lx, H, -Lz])}`}</M></> : null}, <M>{`\\underline r_{S_1} = (${-Lx};\\ 0;\\ 0)`}</M>, <M>{`\\underline r_{S_2} = \\underline r_{S_3} = (0;\\ 0;\\ ${-Lz})`}</M>.</p>
          <MB>{`\\sum M_{ix}:\\ ${f4(-(Lz / 2) * tf.G)} - ${Lz}\\,S_3 = 0 \\Rightarrow S_3 = ${f4(S3)}\\ \\text{kN}`}</MB>
          <MB>{`\\sum M_{iy}:\\ ${F ? `${f4(Lz * F)} ` : "0 "}- ${Lz}\\,S_2 = 0 \\Rightarrow S_2 = ${f4(S2)}\\ \\text{kN}`}</MB>
          <MB>{`\\sum M_{iz}:\\ ${f4((Lx / 2) * tf.G)} ${F ? `+ ${f4(H * F)} ` : ""}+ ${Lx}\\,S_1 = 0 \\Rightarrow S_1 = ${f4(S1)}\\ \\text{kN}`}</MB>
          <MB>{`\\Fx ${F ? `-${F} ` : "0 "}+ S_2 + A_x = 0 \\Rightarrow A_x = ${f4(A[0])};\\quad \\Fy -${f4(tf.G)} - S_1 - S_3 + A_y = 0 \\Rightarrow A_y = ${f4(A[1])};\\quad A_z = 0`}</MB>
          <p className="mt-2 text-[13px] text-petrol-600">
            A két függőleges rúd nyomott (<M>{"S_1, S_3 < 0"}</M>); <M>{"A_y"}</M> {A[1] < 0 ? "negatív: a csukló lefelé húzza a tartály sarkát" : "pozitív: a csukló tart"}. A nyomatéki egyenletekben <M>{"M_x = r_y F_z - r_z F_y"}</M> stb.
          </p>
        </>
      ),
    };
  }
  return eroKomponensekFeladat();
}

/* ============================================================
   9. Kényszerek fokszáma térben
   ============================================================ */

const KENYSZEREK = [
  { nev: "gömbcsukló", fok: 3 },
  { nev: "támasztórúd", fok: 1 },
  { nev: "merev befogás", fok: 6 },
  { nev: "tengelycsukló", fok: 5 },
  { nev: "síkra támaszkodó görgő (egy irányban gátol)", fok: 1 },
];

function kenyszerSzamlalasFeladat() {
  const testek = valaszt([1, 1, 2]);
  const db = valaszt([2, 3, 4]);
  const lista = [];
  for (let i = 0; i < db; i++) lista.push(valaszt(KENYSZEREK.filter((k) => k.fok <= (testek === 1 ? 5 : 6))));
  const belso = testek === 2 ? valaszt([{ nev: "gömbcsukló a két test között", fok: 3 }, { nev: "merev kapcsolat a két test között", fok: 6 }, { nev: "tengelycsukló a két test között", fok: 5 }]) : null;
  const e = 6 * testek;
  const i = lista.reduce((s, k) => s + k.fok, 0) + (belso ? belso.fok : 0);
  const osszefoglal = lista.map((k) => k.nev).join(", ");
  return {
    szoveg: (
      <p>
        Egy térbeli szerkezet <M>{`${testek}`}</M> merev testből áll. Külső kényszerei: {osszefoglal}
        {belso ? <>; belső kapcsolat: {belso.nev}</> : null}. Hány független egyensúlyi egyenlet írható fel (<M>{"e"}</M>), hány ismeretlen reakciókomponens van (<M>{"i"}</M>), és mekkora az <M>{"i - e"}</M> különbség (pozitív: legalább ennyi fölös
        kényszer; negatív: legalább ennyi szabad mozgás)?
      </p>
    ),
    sugo: <p>Térben testenként 6 egyenlet. Fokszámok: rúd 1, gömbcsukló 3, tengelycsukló 5, befogás 6 (tankönyv 9.2.1). A belső kapcsolat ismeretlenjeit egyszer számoljuk.</p>,
    oszlopok: 3,
    mezok: [
      { id: "e", cimke: "e (egyenletek)", egyseg: "", helyes: e, tizedes: 0, tures: 0.01 },
      { id: "i", cimke: "i (ismeretlenek)", egyseg: "", helyes: i, tizedes: 0, tures: 0.01 },
      { id: "d", cimke: "i − e", egyseg: "", helyes: i - e, tizedes: 0, tures: 0.01 },
    ],
    megoldas: (
      <>
        <MB>{`e = 6\\cdot ${testek} = ${e},\\qquad i = ${lista.map((k) => k.fok).join(" + ")}${belso ? ` + ${belso.fok}` : ""} = ${i},\\qquad i - e = ${i - e}`}</MB>
        <p className="mt-2 text-[13px] text-petrol-600">
          {i === e ? "i = e: lehet határozott — de csak akkor az, ha az elrendezés nem kritikus (pl. nem megy át rúd a gömbcsuklón, nem párhuzamos négy rúd)." : i > e ? `${i - e} fölös kényszer legalább: statikailag határozatlan (vagy kritikus).` : `${e - i} szabad mozgás legalább: a szerkezet nem tartó (túlhatározott).`}
        </p>
      </>
    ),
  };
}

/* ============================================================
   10. Az eredő jellege térben (9.1.2)
   ============================================================ */

function eredoJellegeFeladat() {
  const eset = valaszt(["ero", "erocsavar", "erocsavar", "nyomatek"]);
  let FA = [nemNulla(-6, 6), nemNulla(-6, 6), egesz(-6, 6)];
  let MA;
  if (eset === "nyomatek") {
    FA = [0, 0, 0];
    MA = [nemNulla(-8, 8), egesz(-8, 8), egesz(-8, 8)];
  } else if (eset === "ero") {
    // M merőleges F-re: M = r × F egy véletlen r-rel
    const r = [egesz(-3, 3), egesz(-3, 3), egesz(-3, 3)];
    MA = kereszt(r, FA);
    if (hossz(MA) < 1e-9) MA = kereszt([1, 2, 0], FA);
  } else {
    MA = [egesz(-8, 8), egesz(-8, 8), egesz(-8, 8)];
    if (Math.abs(skalar(FA, MA)) < 1e-9) MA = [MA[0] + 1, MA[1], MA[2]];
  }
  const sk = skalar(FA, MA);
  const j = eredoJellege(FA, MA);
  const Fh = hossz(FA);
  const Mpar = Fh > 1e-9 ? sk / Fh : 0;
  return {
    szoveg: (
      <p>
        Egy térbeli erőrendszert az <M>{"A"}</M> pontra redukáltunk: a társerő <M>{`\\underline F_A = ${vekK(FA)}`}</M> kN, a társnyomaték <M>{`\\underline M_A = ${vekK(MA)}`}</M> kNm. Számítsd ki a két vektor skaláris szorzatát, a társerő nagyságát és a
        társnyomaték erővel párhuzamos vetületét (<M>{"M_\\parallel = \\underline F_A\\cdot\\underline M_A/|\\underline F_A|"}</M>; ha nincs erő, írj 0-t)! Ezek alapján döntsd el, milyen az eredő (a megoldásban).
      </p>
    ),
    sugo: <p>Tankönyv 9.1.2: ha a társerő zérus → az eredő nyomaték (vagy egyensúly); ha a skaláris szorzat nulla → az eredő egyetlen erő eltolt hatásvonalon; egyébként erőcsavar.</p>,
    oszlopok: 3,
    mezok: [
      { id: "sk", cimke: "F_A · M_A", egyseg: "kN·kNm", helyes: sk, tizedes: 1 },
      { id: "f", cimke: "|F_A|", egyseg: "kN", helyes: Fh, tizedes: 3 },
      { id: "mp", cimke: "M_∥", egyseg: "kNm", helyes: Mpar, tizedes: 3 },
    ],
    megoldas: (
      <>
        <MB>{`\\underline F_A\\cdot\\underline M_A = ${zarK(FA[0])}\\cdot${zarK(MA[0])} + ${zarK(FA[1])}\\cdot${zarK(MA[1])} + ${zarK(FA[2])}\\cdot${zarK(MA[2])} = ${f4(sk)}`}</MB>
        <MB>{`|\\underline F_A| = ${f4(Fh)}\\ \\text{kN},\\qquad M_\\parallel = ${Fh > 1e-9 ? `${f4(sk)}/${f4(Fh)} = ${f4(Mpar)}` : "0"}\\ \\text{kNm}`}</MB>
        <p className="mt-2 text-[13px] text-petrol-600">
          <strong>Az eredő:</strong> {j.nev}.{" "}
          {j.eset === "ero" ? "A társnyomaték merőleges a társerőre, ezért az erő megfelelő eltolásával a nyomaték eltüntethető: az eredő egyetlen erő." : j.eset === "erocsavar" ? `A nyomaték erővel párhuzamos része (${sz(Mpar, 3)} kNm) semmilyen eltolással nem tüntethető el — erőcsavar.` : j.eset === "nyomatek" ? "Nincs társerő, a nyomaték bármely pontra ugyanaz." : "Minden komponens nulla."}
        </p>
      </>
    ),
  };
}

export const EXTRA_GENERATOROK = [
  { cim: "Térbeli erő komponensei és nyomatéka (9.1)", fn: eroKomponensekFeladat },
  { cim: "Tartály térfogati teherrel — súly és rúderők", fn: terfogatiTeherFeladat },
  { cim: "Kényszerek fokszáma térben: e és i", fn: kenyszerSzamlalasFeladat },
  { cim: "Az eredő jellege térben: erő vagy erőcsavar?", fn: eredoJellegeFeladat },
];

export default function GyakorloExtra() {
  return (
    <>
      <GyakorloDoboz cim="Térbeli erő komponensei és nyomatéka (9.1)" leiras="A tankönyv (9.1) képlete: az erő komponensei a hatásvonal vetületeiből; iránykoszinuszok; nyomatékvektor az origóra." generator={eroKomponensekFeladat} oszlopok={3} />
      <GyakorloDoboz cim="Tartály térfogati teherrel — súly és rúderők" leiras="A H13/4 feladat véletlen méretekkel: G = γV a súlypontban, majd három nyomatéki egyenlet a csuklóra." generator={terfogatiTeherFeladat} oszlopok={2} />
      <GyakorloDoboz cim="Kényszerek fokszáma térben: e és i" leiras="Testenként hat egyenlet; gömbcsukló 3, rúd 1, tengelycsukló 5, befogás 6." generator={kenyszerSzamlalasFeladat} oszlopok={3} />
      <GyakorloDoboz cim="Az eredő jellege térben: erő vagy erőcsavar?" leiras="A tankönyv 9.1.2: a társerő és a társnyomaték skaláris szorzata dönt." generator={eredoJellegeFeladat} oszlopok={3} />
    </>
  );
}
