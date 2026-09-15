"use client";

import { useRef, useState } from "react";
import { Cimke, Fogopont, NyilHegyek, Tengelyek } from "@/components/abrak/SvgElemek";
import { szK, sz } from "@/lib/szamok";
import { M, MB } from "@/components/ui/Keplet";

const SZ = 560;
const MA = 400;
const OX = 230;
const OY = 230;
const LEPTEK = 30;

const SZIN_A = "#e2590a";
const SZIN_B = "#0f766e";
const POZ = "#15803d";
const NEG = "#be123c";
const NULLA = "#64748b";

export default function SkalarisSzorzatFelfedezo() {
  const [a, setA] = useState({ x: 5, y: 1.5 });
  const [b, setB] = useState({ x: 2, y: 4 });
  const [kattant, setKattant] = useState(false);
  const svgRef = useRef(null);

  const kepX = (x) => OX + x * LEPTEK;
  const kepY = (y) => OY - y * LEPTEK;

  const huzas = (melyik) => (e) => {
    e.preventDefault();
    const svg = svgRef.current;
    if (!svg) return;
    const mozgat = (esem) => {
      const r = svg.getBoundingClientRect();
      const px = ((esem.clientX - r.left) / r.width) * SZ;
      const py = ((esem.clientY - r.top) / r.height) * MA;
      let uj = {
        x: Math.max(-7, Math.min(9, (px - OX) / LEPTEK)),
        y: Math.max(-6, Math.min(5.5, (OY - py) / LEPTEK)),
      };
      // „Kattanás” 90°-nál: ha a másik vektorral közel merőleges, pontosan merőlegesre igazítjuk
      const masik = melyik === "a" ? b : a;
      const h = Math.hypot(uj.x, uj.y);
      const hm = Math.hypot(masik.x, masik.y);
      let kattanas = false;
      if (h > 0.3 && hm > 0.3) {
        const cosf = (uj.x * masik.x + uj.y * masik.y) / (h * hm);
        if (Math.abs(cosf) < 0.045) {
          // merőleges egységvektor a másikra, az uj-hoz közelebbi értelemben
          const mx = -masik.y / hm;
          const my = masik.x / hm;
          const elojel = uj.x * mx + uj.y * my >= 0 ? 1 : -1;
          uj = { x: elojel * mx * h, y: elojel * my * h };
          kattanas = true;
        }
      }
      if (!kattanas) uj = { x: Math.round(uj.x * 20) / 20, y: Math.round(uj.y * 20) / 20 };
      setKattant(kattanas);
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

  const la = Math.hypot(a.x, a.y);
  const lb = Math.hypot(b.x, b.y);
  const skalar = a.x * b.x + a.y * b.y;
  const cosf = la > 0 && lb > 0 ? Math.max(-1, Math.min(1, skalar / (la * lb))) : 0;
  const fi = (Math.acos(cosf) * 180) / Math.PI;
  const geo = la * lb * cosf;

  // b vetülete az a irányára: |b| cos φ, az a egységvektora mentén
  const ea = la > 0 ? { x: a.x / la, y: a.y / la } : { x: 1, y: 0 };
  const vetulet = lb * cosf;
  const vp = { x: ea.x * vetulet, y: ea.y * vetulet };
  // a vetület feliratát az a egyenesének a b-vel ellentétes oldalára tesszük
  const nrm = { x: -ea.y, y: ea.x };
  const cnJel = b.x * nrm.x + b.y * nrm.y >= 0 ? -1 : 1;
  const cn = { x: nrm.x * cnJel, y: nrm.y * cnJel };

  const meroleges = Math.abs(skalar) < 1e-6 || Math.abs(fi - 90) < 0.05;
  const szin = meroleges ? NULLA : skalar > 0 ? POZ : NEG;
  const allapot = meroleges ? "nulla — merőleges" : skalar > 0 ? "pozitív — hegyesszög" : "negatív — tompaszög";

  // szögív az a és b között
  const szogA = Math.atan2(a.y, a.x);
  const szogB = Math.atan2(b.y, b.x);
  const rIv = 34;
  const nagyIv = 0; // φ ≤ 180°, mindig a kisebb ív
  // a körüljárás iránya: a-tól b felé a kisebb szögön át
  let d = szogB - szogA;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  const sweep = d > 0 ? 0 : 1; // SVG y lefelé nő → fordított
  const ivKezd = { x: OX + rIv * Math.cos(szogA), y: OY - rIv * Math.sin(szogA) };
  const ivVeg = { x: OX + rIv * Math.cos(szogB), y: OY - rIv * Math.sin(szogB) };
  const ivKozep = szogA + d / 2;

  // az a hatásvonala (a vetülethez), végig a rajzon
  const hvHossz = 12;

  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white">
      <div className="grid lg:grid-cols-[1.2fr_1fr]">
        <div className="racs-vilagos border-b border-[color:var(--keret)] p-3 lg:border-r lg:border-b-0">
          <svg ref={svgRef} viewBox={`0 0 ${SZ} ${MA}`} className="abra w-full touch-none select-none">
            <NyilHegyek />
            <defs>
              {[
                ["sk-a", SZIN_A],
                ["sk-b", SZIN_B],
              ].map(([id, sz2]) => (
                <marker key={id} id={id} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M 0 1 L 9 5 L 0 9 z" fill={sz2} />
                </marker>
              ))}
            </defs>
            <Tengelyek ox={OX} oy={OY} balra={210} jobbra={300} fel={205} le={150} />

            {/* az a hatásvonala */}
            <line
              x1={kepX(-ea.x * hvHossz)}
              y1={kepY(-ea.y * hvHossz)}
              x2={kepX(ea.x * hvHossz)}
              y2={kepY(ea.y * hvHossz)}
              stroke="#cbd5e1"
              strokeWidth="1"
              strokeDasharray="4 4"
            />

            {/* vetület-szakasz (b vetülete a irányára) */}
            {Math.abs(vetulet) > 0.05 && (
              <>
                <line x1={OX} y1={OY} x2={kepX(vp.x)} y2={kepY(vp.y)} stroke={szin} strokeWidth="7" strokeLinecap="butt" opacity="0.55" />
                <line x1={kepX(b.x)} y1={kepY(b.y)} x2={kepX(vp.x)} y2={kepY(vp.y)} stroke={szin} strokeWidth="1.2" strokeDasharray="4 3" />
                <Cimke x={kepX(vp.x / 2) + cn.x * 20} y={kepY(vp.y / 2) - cn.y * 20 + 4} szin={szin} meret={11.5}>
                  |b|·cos φ = {sz(vetulet, 2)}
                </Cimke>
              </>
            )}

            {/* szögív */}
            {la > 0.3 && lb > 0.3 && (
              <>
                <path d={`M ${ivKezd.x} ${ivKezd.y} A ${rIv} ${rIv} 0 ${nagyIv} ${sweep} ${ivVeg.x} ${ivVeg.y}`} fill="none" stroke={szin} strokeWidth="1.8" />
                {meroleges && (
                  <path
                    d={`M ${OX + 12 * Math.cos(szogA)} ${OY - 12 * Math.sin(szogA)} L ${OX + 12 * (Math.cos(szogA) + Math.cos(szogB))} ${OY - 12 * (Math.sin(szogA) + Math.sin(szogB))} L ${OX + 12 * Math.cos(szogB)} ${OY - 12 * Math.sin(szogB)}`}
                    fill="none"
                    stroke={szin}
                    strokeWidth="1.5"
                  />
                )}
                <Cimke x={OX + (rIv + 16) * Math.cos(ivKozep)} y={OY - (rIv + 16) * Math.sin(ivKozep) + 4} szin={szin} meret={12}>
                  φ = {sz(fi, 1)}°
                </Cimke>
              </>
            )}

            {/* a és b */}
            <line x1={OX} y1={OY} x2={kepX(a.x)} y2={kepY(a.y)} stroke={SZIN_A} strokeWidth="3.2" strokeLinecap="round" markerEnd="url(#sk-a)" />
            <line x1={OX} y1={OY} x2={kepX(b.x)} y2={kepY(b.y)} stroke={SZIN_B} strokeWidth="3.2" strokeLinecap="round" markerEnd="url(#sk-b)" />
            <Cimke x={kepX(a.x) + (a.x >= 0 ? 14 : -14)} y={kepY(a.y) + (a.y >= 0 ? -8 : 16)} szin={SZIN_A}>
              a
            </Cimke>
            <Cimke x={kepX(b.x) + (b.x >= 0 ? 14 : -14)} y={kepY(b.y) + (b.y >= 0 ? -8 : 16)} szin={SZIN_B}>
              b
            </Cimke>
            <Fogopont x={kepX(a.x)} y={kepY(a.y)} szin={SZIN_A} onPointerDown={huzas("a")} />
            <Fogopont x={kepX(b.x)} y={kepY(b.y)} szin={SZIN_B} onPointerDown={huzas("b")} />

            {/* előjel-jelző */}
            <g transform={`translate(${SZ - 150}, 26)`}>
              <rect x="0" y="-16" width="138" height="28" rx="8" fill={szin} opacity="0.12" />
              <circle cx="14" cy="-2" r="6" fill={szin} />
              <text x="28" y="2" fontWeight="650" style={{ fontSize: 12, fill: szin }}>
                a·b {meroleges ? "= 0" : skalar > 0 ? "> 0" : "< 0"}
              </text>
            </g>
            {kattant && (
              <text x={SZ - 150} y={56} style={{ fontSize: 10.5, fill: NULLA }}>
                ⌐ bekattant 90°-ra
              </text>
            )}
          </svg>
          <p className="mt-1 text-center text-[11.5px] text-petrol-400">
            Húzd a végpontokat. A vastag sáv a <em>b</em> vetülete az <em>a</em> irányára. 90° közelében az ábra „bekattan”.
          </p>
        </div>

        <div className="p-4 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-petrol-200 bg-petrol-50 p-3">
              <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">Geometriával</p>
              <div className="szamok mt-1 text-[13px]">
                <MB>{`|\\underline{a}||\\underline{b}|\\cos\\varphi`}</MB>
                <MB>{`= ${szK(la, 3)}\\cdot ${szK(lb, 3)}\\cdot\\cos ${szK(fi, 1)}^\\circ`}</MB>
                <MB className="font-semibold">{`= ${szK(geo, 3)}`}</MB>
              </div>
            </div>
            <div className="rounded-xl border border-petrol-200 bg-petrol-50 p-3">
              <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">Komponensekkel</p>
              <div className="szamok mt-1 text-[13px]">
                <MB>{`a_x b_x + a_y b_y`}</MB>
                <MB>{`= ${szK(a.x, 2)}\\cdot${zar(b.x)} + ${zar(a.y)}\\cdot${zar(b.y)}`}</MB>
                <MB className="font-semibold">{`= ${szK(skalar, 3)}`}</MB>
              </div>
            </div>
          </div>

          <div className="mt-3 rounded-xl border px-3.5 py-2.5 text-[13.5px] font-semibold" style={{ borderColor: szin, color: szin }}>
            a · b = {sz(skalar, 3)} — {allapot}
          </div>

          <div className="szamok mt-3 text-[13px] text-petrol-700">
            <MB>{`\\underline{a} = \\begin{bmatrix} ${szK(a.x, 2)} \\\\ ${szK(a.y, 2)} \\end{bmatrix},\\quad \\underline{b} = \\begin{bmatrix} ${szK(b.x, 2)} \\\\ ${szK(b.y, 2)} \\end{bmatrix},\\quad \\cos\\varphi = \\frac{${szK(skalar, 3)}}{${szK(la, 3)}\\cdot${szK(lb, 3)}} = ${szK(cosf, 4)}`}</MB>
          </div>

          <div className="mt-3 rounded-xl border border-naracs-200 bg-naracs-50 p-3.5 text-[13px] leading-relaxed text-petrol-800">
            <p>
              A két számítás <strong>mindig</strong> ugyanazt adja — a skaláris szorzat a két vektor közös jellemzője, nem a
              koordináta-rendszeré. A vetület: <M>{"\\underline{b}\\cdot\\underline{e}_a = |\\underline{b}|\\cos\\varphi"}</M>, itt{" "}
              <M>{`${szK(vetulet, 3)}`}</M>. Az előjel csak a szögtől függ: hegyesszög +, tompaszög −, derékszög 0.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function zar(v) {
  const s = szK(v, 2);
  return v < 0 ? `(${s})` : s;
}
