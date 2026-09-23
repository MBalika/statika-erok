"use client";

import { useRef, useState } from "react";
import { Cimke, Fogopont, NyilHegyek, Tengelyek } from "@/components/abrak/SvgElemek";
import { Csuszka } from "@/components/abrak/ErovektorBonto";
import { sz, szK } from "@/lib/szamok";
import { M, MB } from "@/components/ui/Keplet";
import useUszo from "./useUszo";

const SZ = 560;
const MA = 400;
const OX = 250;
const OY = 220;
const LEPTEK = 30; // képpont / egység

const SZIN_A = "#e2590a";
const SZIN_B = "#0f766e";
const SZIN_E = "#7c3aed";
const SZIN_SEGED = "#94a3b8";

const MUVELETEK = [
  { id: "osszeg", cimke: "a + b" },
  { id: "kulonbseg", cimke: "a − b" },
  { id: "ellentett", cimke: "−a" },
  { id: "skalar", cimke: "λ · a" },
];

/** Vektornyíl heggyel. Az animált végpontot a useUszo hook adja. */
function Vektor({ x1, y1, x2, y2, szin, hegy, vastag = 3, szaggatott = false, opacitas = 1 }) {
  if (Math.hypot(x2 - x1, y2 - y1) < 1) return null;
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={szin}
      strokeWidth={vastag}
      strokeLinecap="round"
      strokeDasharray={szaggatott ? "6 4" : undefined}
      markerEnd={`url(#${hegy})`}
      opacity={opacitas}
    />
  );
}

export default function VektorMuveletFelfedezo() {
  const [a, setA] = useState({ x: 4, y: 2 });
  const [b, setB] = useState({ x: 1.5, y: 3 });
  const [muvelet, setMuvelet] = useState("osszeg");
  const [lambda, setLambda] = useState(1.5);
  const svgRef = useRef(null);

  const kepX = (x) => OX + x * LEPTEK;
  const kepY = (y) => OY - y * LEPTEK;
  // a feliratok a rajz szélén se lógjanak ki
  const cx = (x) => Math.max(30, Math.min(SZ - 30, x));
  const cy = (y) => Math.max(14, Math.min(MA - 4, y));

  const huzas = (melyik) => (e) => {
    e.preventDefault();
    const svg = svgRef.current;
    if (!svg) return;
    const mozgat = (esem) => {
      const r = svg.getBoundingClientRect();
      const px = ((esem.clientX - r.left) / r.width) * SZ;
      const py = ((esem.clientY - r.top) / r.height) * MA;
      // A tartomány úgy van megszabva, hogy az összeg / különbség / 2·a is a rajzon maradjon
      const uj = {
        x: Math.max(-3.5, Math.min(4, Math.round(((px - OX) / LEPTEK) * 2) / 2)),
        y: Math.max(-2, Math.min(3, Math.round(((OY - py) / LEPTEK) * 2) / 2)),
      };
      if (melyik === "a") setA(uj);
      else setB(uj);
    };
    mozgat(e);
    const vege = () => {
      window.removeEventListener("pointermove", mozgat);
      window.removeEventListener("pointerup", vege);
    };
    window.addEventListener("pointermove", mozgat);
    window.addEventListener("pointerup", vege);
  };

  // Az eredmény vektora és a szerkesztés (honnan hova rajzoljuk a segédnyilat)
  let eredmeny;
  let seged = null; // { x1,y1,x2,y2, szin, hegy } – a „láncolt” második vektor
  let cimke = "";
  switch (muvelet) {
    case "osszeg":
      eredmeny = { x: a.x + b.x, y: a.y + b.y };
      seged = { x1: a.x, y1: a.y, x2: a.x + b.x, y2: a.y + b.y, szin: SZIN_B, hegy: "vm-b", nev: "b" };
      cimke = "a + b";
      break;
    case "kulonbseg":
      eredmeny = { x: a.x - b.x, y: a.y - b.y };
      seged = { x1: a.x, y1: a.y, x2: a.x - b.x, y2: a.y - b.y, szin: SZIN_B, hegy: "vm-b", nev: "−b" };
      cimke = "a − b";
      break;
    case "ellentett":
      eredmeny = { x: -a.x, y: -a.y };
      cimke = "−a";
      break;
    default:
      eredmeny = { x: lambda * a.x, y: lambda * a.y };
      cimke = `${sz(lambda, 1)}·a`;
  }

  // Az eredmény és a láncolt segédnyíl végpontja simán úszik az új helyére
  const er = useUszo(eredmeny, 380);
  const segedVeg = useUszo(seged ? { x: seged.x2, y: seged.y2 } : { x: a.x, y: a.y }, 380);

  const bLathato = muvelet === "osszeg" || muvelet === "kulonbseg";
  const hossz = (v) => Math.hypot(v.x, v.y);

  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white">
      <div className="grid lg:grid-cols-[1.25fr_1fr] [&>*]:min-w-0">
        <div className="racs-vilagos border-b border-[color:var(--keret)] p-3 lg:border-r lg:border-b-0">
          <svg ref={svgRef} viewBox={`0 0 ${SZ} ${MA}`} className="abra w-full touch-none select-none">
            <NyilHegyek />
            <defs>
              {[
                ["vm-a", SZIN_A],
                ["vm-b", SZIN_B],
                ["vm-e", SZIN_E],
              ].map(([id, szin]) => (
                <marker key={id} id={id} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M 0 1 L 9 5 L 0 9 z" fill={szin} />
                </marker>
              ))}
            </defs>
            <Tengelyek ox={OX} oy={OY} balra={230} jobbra={250} fel={200} le={165} />

            {/* eredmény: paralelogramma-oldal, ha összeg (halvány) */}
            {muvelet === "osszeg" && (
              <Vektor x1={kepX(b.x)} y1={kepY(b.y)} x2={kepX(a.x + b.x)} y2={kepY(a.y + b.y)} szin={SZIN_SEGED} hegy="hegy-szurke" vastag={1.4} szaggatott opacitas={0.8} />
            )}
            {/* kivonásnál: b végpontjából a végpontjába mutat a − b (a tankönyv szerkesztése) */}
            {muvelet === "kulonbseg" && (
              <Vektor x1={kepX(b.x)} y1={kepY(b.y)} x2={kepX(a.x)} y2={kepY(a.y)} szin={SZIN_E} hegy="vm-e" vastag={2} szaggatott opacitas={0.6} />
            )}

            {/* a második vektor láncolva a végére (vagy megfordítva) */}
            {seged && (
              <>
                <Vektor x1={kepX(seged.x1)} y1={kepY(seged.y1)} x2={kepX(segedVeg.x)} y2={kepY(segedVeg.y)} szin={seged.szin} hegy={seged.hegy} vastag={2.4} szaggatott opacitas={0.85} />
                <Cimke x={kepX((seged.x1 + segedVeg.x) / 2) + 12} y={kepY((seged.y1 + segedVeg.y) / 2) - 6} szin={seged.szin} meret={12}>
                  {seged.nev}
                </Cimke>
              </>
            )}

            {/* eredmény */}
            <Vektor x1={OX} y1={OY} x2={kepX(er.x)} y2={kepY(er.y)} szin={SZIN_E} hegy="vm-e" vastag={4} />
            {hossz(er) > 0.2 && (
              <Cimke x={cx(kepX(er.x) + (er.x >= 0 ? 18 : -18))} y={cy(kepY(er.y) + (er.y >= 0 ? -10 : 18))} szin={SZIN_E} meret={13.5}>
                {cimke}
              </Cimke>
            )}

            {/* a és b */}
            <Vektor x1={OX} y1={OY} x2={kepX(a.x)} y2={kepY(a.y)} szin={SZIN_A} hegy="vm-a" />
            <Cimke x={cx(kepX(a.x) + (a.x >= 0 ? 14 : -14))} y={cy(kepY(a.y) + (a.y >= 0 ? 16 : -8))} szin={SZIN_A}>
              a
            </Cimke>
            {bLathato && (
              <>
                <Vektor x1={OX} y1={OY} x2={kepX(b.x)} y2={kepY(b.y)} szin={SZIN_B} hegy="vm-b" />
                <Cimke x={cx(kepX(b.x) + (b.x >= 0 ? 14 : -14))} y={cy(kepY(b.y) + (b.y >= 0 ? -8 : 16))} szin={SZIN_B}>
                  b
                </Cimke>
              </>
            )}

            <Fogopont x={kepX(a.x)} y={kepY(a.y)} szin={SZIN_A} onPointerDown={huzas("a")} />
            {bLathato && <Fogopont x={kepX(b.x)} y={kepY(b.y)} szin={SZIN_B} onPointerDown={huzas("b")} />}
          </svg>
          <p className="mt-1 text-center text-[11.5px] text-petrol-400">
            Húzd a nyilak végpontját. A lila nyíl az eredmény, a szaggatott a szerkesztés.
          </p>
        </div>

        <div className="p-4 sm:p-5">
          <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">Művelet</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {MUVELETEK.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMuvelet(m.id)}
                className={`szamok rounded-lg px-3 py-1.5 text-[13px] font-semibold transition ${
                  muvelet === m.id ? "bg-petrol-800 text-white" : "bg-petrol-100 text-petrol-700 hover:bg-petrol-200"
                }`}
              >
                {m.cimke}
              </button>
            ))}
          </div>

          {muvelet === "skalar" && (
            <div className="mt-4">
              <Csuszka cimke="λ (skalár szorzó)" ertek={lambda} min={-2} max={2} lepes={0.1} tizedes={1} onChange={setLambda} />
            </div>
          )}

          <div className="szamok mt-4 space-y-1 text-[14px]">
            <MB>{`\\underline{a} = \\begin{bmatrix} ${szK(a.x, 1)} \\\\ ${szK(a.y, 1)} \\end{bmatrix}${bLathato ? `,\\qquad \\underline{b} = \\begin{bmatrix} ${szK(b.x, 1)} \\\\ ${szK(b.y, 1)} \\end{bmatrix}` : ""}`}</MB>
            {muvelet === "osszeg" && (
              <MB>{`\\underline{a} + \\underline{b} = \\begin{bmatrix} ${szK(a.x, 1)} + ${zar(b.x)} \\\\ ${szK(a.y, 1)} + ${zar(b.y)} \\end{bmatrix} = \\begin{bmatrix} ${szK(eredmeny.x, 1)} \\\\ ${szK(eredmeny.y, 1)} \\end{bmatrix}`}</MB>
            )}
            {muvelet === "kulonbseg" && (
              <MB>{`\\underline{a} - \\underline{b} = \\begin{bmatrix} ${szK(a.x, 1)} - ${zar(b.x)} \\\\ ${szK(a.y, 1)} - ${zar(b.y)} \\end{bmatrix} = \\begin{bmatrix} ${szK(eredmeny.x, 1)} \\\\ ${szK(eredmeny.y, 1)} \\end{bmatrix}`}</MB>
            )}
            {muvelet === "ellentett" && (
              <MB>{`-\\underline{a} = \\begin{bmatrix} ${szK(eredmeny.x, 1)} \\\\ ${szK(eredmeny.y, 1)} \\end{bmatrix},\\qquad \\underline{a} + (-\\underline{a}) = \\underline{0}`}</MB>
            )}
            {muvelet === "skalar" && (
              <MB>{`${szK(lambda, 1)}\\cdot\\underline{a} = \\begin{bmatrix} ${szK(lambda, 1)}\\cdot${zar(a.x)} \\\\ ${szK(lambda, 1)}\\cdot${zar(a.y)} \\end{bmatrix} = \\begin{bmatrix} ${szK(eredmeny.x, 2)} \\\\ ${szK(eredmeny.y, 2)} \\end{bmatrix}`}</MB>
            )}
            <MB>{`|\\underline{a}| = ${szK(hossz(a), 3)},\\quad |${muvelet === "osszeg" ? "\\underline{a}+\\underline{b}" : muvelet === "kulonbseg" ? "\\underline{a}-\\underline{b}" : muvelet === "ellentett" ? "-\\underline{a}" : "\\lambda\\underline{a}"}| = ${szK(hossz(eredmeny), 3)}`}</MB>
          </div>

          <div className="mt-3 rounded-xl border border-naracs-200 bg-naracs-50 p-3.5 text-[13px] leading-relaxed text-petrol-800">
            {muvelet === "osszeg" && (
              <p>
                <strong>Láncolás:</strong> a <M>{"\\underline{b}"}</M> kezdőpontját az <M>{"\\underline{a}"}</M> végpontjához toljuk, az összeg
                az <M>{"\\underline{a}"}</M> kezdőpontjából a lánc végébe mutat. A szürke szaggatott a paralelogramma másik oldala — ugyanoda vezet.
              </p>
            )}
            {muvelet === "kulonbseg" && (
              <p>
                <strong>Kivonás = ellentett hozzáadása:</strong> <M>{"\\underline{a} - \\underline{b} = \\underline{a} + (-\\underline{b})"}</M>. A szaggatott
                zöld a megfordított <M>{"\\underline{b}"}</M>. A tankönyv szerkesztése: a <M>{"\\underline{b}"}</M> végpontjából az{" "}
                <M>{"\\underline{a}"}</M> végpontjába mutató vektor (halvány lila) ugyanaz a vektor, csak eltolva.
              </p>
            )}
            {muvelet === "ellentett" && (
              <p>
                <strong>Ellentett vektor:</strong> ugyanaz a hossz, ellentétes irány, minden komponens előjelet vált. Az{" "}
                <M>{"\\underline{a}"}</M> és a <M>{"-\\underline{a}"}</M> összege a nullvektor.
              </p>
            )}
            {muvelet === "skalar" && (
              <p>
                <strong>Skalárral szorzás:</strong> minden komponenst ugyanazzal a számmal szorzunk. <M>{"\\lambda > 1"}</M> nyújt,{" "}
                <M>{"0 < \\lambda < 1"}</M> zsugorít, <M>{"\\lambda < 0"}</M> meg is fordítja az irányt. A <M>{"\\lambda = -1"}</M> éppen az ellentett.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function zar(v) {
  const s = szK(v, 1);
  return v < 0 ? `(${s})` : s;
}
