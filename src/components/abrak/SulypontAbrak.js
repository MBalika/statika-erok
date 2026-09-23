/** A 4. modul elméleti ábrái. Koordináta-rendszer: y balra, z lefelé (keresztmetszeti konvenció). */

const IDOM = "#bcdce2"; // idom kitöltése (petrol-200)
const IDOM_KERET = "#234957";
const NEGATIV = "#fee2e2";
const S_SZIN = "#e2590a";

function Hegy({ id, szin }) {
  return (
    <marker id={id} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 1 L 9 5 L 0 9 z" fill={szin} />
    </marker>
  );
}

/** y balra, z lefelé tengelykereszt. */
export function TengelyekYZ({ x, y, hossz = 44, zHossz, id = "hegy-t", cimkek = true }) {
  const zh = zHossz ?? hossz;
  return (
    <g>
      <line x1={x} y1={y} x2={x - hossz} y2={y} stroke="#475569" strokeWidth="1.2" markerEnd={`url(#${id})`} />
      <line x1={x} y1={y} x2={x} y2={y + zh} stroke="#475569" strokeWidth="1.2" markerEnd={`url(#${id})`} />
      {cimkek && (
        <>
          <text x={x - hossz - 4} y={y + 4} textAnchor="end" fontSize="12" fontStyle="italic" fill="#1d3c48">y</text>
          <text x={x + 6} y={y + zh + 4} fontSize="12" fontStyle="italic" fill="#1d3c48">z</text>
        </>
      )}
    </g>
  );
}

/** Súlypont-jel: pont és S felirat. */
export function SJel({ x, y, cimke = "S", dx = 9, dy = -8, szin = S_SZIN, meret = 5 }) {
  return (
    <g>
      <line x1={x - meret - 4} y1={y} x2={x + meret + 4} y2={y} stroke={szin} strokeWidth="1" />
      <line x1={x} y1={y - meret - 4} x2={x} y2={y + meret + 4} stroke={szin} strokeWidth="1" />
      <circle cx={x} cy={y} r={meret} fill={szin} stroke="white" strokeWidth="1.6" />
      {cimke && (
        <text x={x + dx} y={y + dy} fontSize="12.5" fontWeight="650" style={{ fill: szin, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
          {cimke}
        </text>
      )}
    </g>
  );
}

function Meret({ x0, y0, x1, y1, szoveg, id = "hegy-m", tav = 14, szin = "#64748b" }) {
  // méretvonal két pont között, felirat a vonal mellett (tav: eltolás merőlegesen)
  const dx = x1 - x0;
  const dy = y1 - y0;
  const h = Math.hypot(dx, dy) || 1;
  const nx = -dy / h;
  const ny = dx / h;
  return (
    <g>
      <line x1={x0} y1={y0} x2={x1} y2={y1} stroke="#94a3b8" strokeWidth="1" markerStart={`url(#${id})`} markerEnd={`url(#${id})`} />
      <text
        x={(x0 + x1) / 2 + nx * tav}
        y={(y0 + y1) / 2 + ny * tav + 4}
        textAnchor="middle"
        fontSize="11.5"
        style={{ fill: szin, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}
      >
        {szoveg}
      </text>
    </g>
  );
}

function poligonSulypont(pontok) {
  let A = 0;
  let cx = 0;
  let cy = 0;
  for (let i = 0; i < pontok.length; i++) {
    const [x0, y0] = pontok[i];
    const [x1, y1] = pontok[(i + 1) % pontok.length];
    const k = x0 * y1 - x1 * y0;
    A += k;
    cx += (x0 + x1) * k;
    cy += (y0 + y1) * k;
  }
  A /= 2;
  return { A, x: cx / (6 * A), y: cy / (6 * A) };
}

/* ---------------- 1. ábra: mi a súlypont ---------------- */

export function AbraSulypontFogalom() {
  const alak = [
    [0, 0],
    [120, 0],
    [120, 50],
    [60, 50],
    [60, 120],
    [0, 120],
  ];
  const s = poligonSulypont(alak);
  const dApontok = [
    [20, 20],
    [60, 20],
    [100, 20],
    [20, 60],
    [20, 100],
    [30, 75],
  ];

  const Panel = ({ ox, oy, fok, cim }) => {
    const forg = (p) => {
      const r = (fok * Math.PI) / 180;
      const dx = p[0] - s.x;
      const dy = p[1] - s.y;
      return [ox + s.x + dx * Math.cos(r) - dy * Math.sin(r), oy + s.y + dx * Math.sin(r) + dy * Math.cos(r)];
    };
    const ut = alak.map(forg);
    const S = [ox + s.x, oy + s.y];
    return (
      <g>
        <text x={ox + 60} y={oy - 26} textAnchor="middle" fontSize="12.5" fontWeight="600" fill="#1d3c48">
          {cim}
        </text>
        <path d={`M ${ut.map((p) => p.join(" ")).join(" L ")} Z`} fill={IDOM} stroke={IDOM_KERET} strokeWidth="1.6" strokeLinejoin="round" />
        {dApontok.map((p, i) => {
          const q = forg(p);
          return (
            <g key={i}>
              <rect x={q[0] - 5} y={q[1] - 5} width="10" height="10" fill="#f1f8f9" stroke="#59a3b2" strokeWidth="1" transform={`rotate(${fok} ${q[0]} ${q[1]})`} />
              <line x1={q[0]} y1={q[1]} x2={q[0]} y2={q[1] + 24} stroke="#3a8798" strokeWidth="1.4" markerEnd="url(#hegy-sf-k)" />
            </g>
          );
        })}
        <line x1={S[0]} y1={oy - 12} x2={S[0]} y2={oy + 150} stroke={S_SZIN} strokeWidth="1" strokeDasharray="4 3" opacity="0.75" />
        <line x1={S[0]} y1={S[1]} x2={S[0]} y2={S[1] + 62} stroke={S_SZIN} strokeWidth="3.2" strokeLinecap="round" markerEnd="url(#hegy-sf-g)" />
        <text x={S[0] + 8} y={S[1] + 58} fontSize="13" fontWeight="650" style={{ fill: S_SZIN, paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
          G
        </text>
        <SJel x={S[0]} y={S[1]} dx={-20} dy={-8} />
      </g>
    );
  };

  return (
    <svg viewBox="0 0 640 260" className="abra w-full" role="img" aria-label="A súlypont mint a párhuzamos súlyerők eredőjének támadáspontja">
      <defs>
        <Hegy id="hegy-sf-k" szin="#3a8798" />
        <Hegy id="hegy-sf-g" szin={S_SZIN} />
      </defs>
      <Panel ox={80} oy={60} fok={0} cim="Az idom így…" />
      <Panel ox={400} oy={60} fok={35} cim="…és elforgatva" />
      <text x={320} y={232} textAnchor="middle" fontSize="11.5" fill="#475569">
        A kis nyilak a dG = γ·dA elemi súlyerők, G az eredőjük.
      </text>
      <text x={320} y={250} textAnchor="middle" fontSize="11.5" fill="#475569">
        Az eredő hatásvonala minden helyzetben átmegy S-en — S az idom saját tulajdonsága.
      </text>
    </svg>
  );
}

/* ---------------- 2. ábra: alapidomok ---------------- */

export function AbraAlapidomok() {
  const PI = Math.PI;
  const e60 = (4 * 60) / (3 * PI); // 25,46 – félkör (r = 60 px)
  const e90 = (4 * 90) / (3 * PI); // 38,20 – negyedkör (r = 90 px)
  const Cim = ({ x, y, betu, szoveg }) => (
    <text x={x} y={y} textAnchor="middle" fontSize="12.5" fontWeight="600" fill="#1d3c48">
      {`${betu}) ${szoveg}`}
    </text>
  );
  const Keplet = ({ x, y, fo, masodik, harmadik }) => (
    <g>
      <text x={x} y={y} textAnchor="middle" fontSize="11.5" fontWeight="600" fill="#334155">{fo}</text>
      {masodik && <text x={x} y={y + 15} textAnchor="middle" fontSize="11" fill="#475569">{masodik}</text>}
      {harmadik && <text x={x} y={y + 30} textAnchor="middle" fontSize="11" fill="#475569">{harmadik}</text>}
    </g>
  );
  return (
    <svg viewBox="0 0 660 500" className="abra w-full" role="img" aria-label="Alapidomok területe és súlypontja: téglalap, derékszögű háromszög, kör, félkör, negyedkör">
      <defs>
        <Hegy id="hegy-al-m" szin="#94a3b8" />
      </defs>

      {/* a) téglalap */}
      <g>
        <Cim x={110} y={22} betu="a" szoveg="Téglalap" />
        <rect x={50} y={46} width="120" height="90" fill={IDOM} stroke={IDOM_KERET} strokeWidth="1.6" />
        <line x1={110} y1={46} x2={110} y2={136} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
        <line x1={50} y1={91} x2={170} y2={91} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
        <SJel x={110} y={91} />
        <Meret x0={50} y0={156} x1={110} y1={156} szoveg="a/2" tav={12} id="hegy-al-m" />
        <Meret x0={110} y0={156} x1={170} y1={156} szoveg="a/2" tav={12} id="hegy-al-m" />
        <Meret x0={34} y0={46} x1={34} y1={91} szoveg="b/2" tav={14} id="hegy-al-m" />
        <Meret x0={34} y0={91} x1={34} y1={136} szoveg="b/2" tav={14} id="hegy-al-m" />
        <Keplet x={110} y={200} fo="A = a·b" masodik="S a középpont: a/2, b/2" />
      </g>

      {/* b) derékszögű háromszög */}
      <g>
        <Cim x={330} y={22} betu="b" szoveg="Derékszögű háromszög" />
        <path d="M 270 136 L 390 136 L 270 46 Z" fill={IDOM} stroke={IDOM_KERET} strokeWidth="1.6" strokeLinejoin="round" />
        <line x1={310} y1={76} x2={310} y2={136} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
        <line x1={270} y1={106} x2={350} y2={106} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
        <SJel x={310} y={106} dx={9} dy={-8} />
        <Meret x0={270} y0={156} x1={310} y1={156} szoveg="a/3" tav={12} id="hegy-al-m" />
        <Meret x0={310} y0={156} x1={390} y1={156} szoveg="2a/3" tav={12} id="hegy-al-m" />
        <Meret x0={254} y0={106} x1={254} y1={136} szoveg="b/3" tav={14} id="hegy-al-m" />
        <Meret x0={254} y0={46} x1={254} y1={106} szoveg="2b/3" tav={14} id="hegy-al-m" />
        <Keplet x={335} y={200} fo="A = a·b/2" masodik="S a derékszögű csúcstól a/3, b/3" harmadik="(a befogók harmadánál)" />
      </g>

      {/* c) kör */}
      <g>
        <Cim x={550} y={22} betu="c" szoveg="Kör" />
        <circle cx={550} cy={100} r="45" fill={IDOM} stroke={IDOM_KERET} strokeWidth="1.6" />
        <line x1={550} y1={55} x2={550} y2={145} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
        <line x1={505} y1={100} x2={595} y2={100} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
        <SJel x={550} y={100} />
        <Meret x0={505} y0={162} x1={550} y1={162} szoveg="R" tav={12} id="hegy-al-m" />
        <Meret x0={550} y0={162} x1={595} y1={162} szoveg="R" tav={12} id="hegy-al-m" />
        <Meret x0={505} y0={44} x1={595} y1={44} szoveg="D" tav={-9} id="hegy-al-m" />
        <Keplet x={550} y={200} fo="A = R²π = D²π/4" masodik="S a középpont" />
      </g>

      {/* d) félkör */}
      <g>
        <Cim x={200} y={272} betu="d" szoveg="Félkör" />
        <path d="M 140 366 A 60 60 0 0 1 260 366 Z" fill={IDOM} stroke={IDOM_KERET} strokeWidth="1.6" />
        <line x1={200} y1={366} x2={200} y2={306} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
        <SJel x={200} y={366 - e60} dx={10} dy={4} />
        <Meret x0={124} y0={366 - e60} x1={124} y1={366} szoveg="4R/3π" tav={28} id="hegy-al-m" />
        <Meret x0={140} y0={386} x1={200} y1={386} szoveg="R" tav={12} id="hegy-al-m" />
        <Meret x0={200} y0={386} x1={260} y1={386} szoveg="R" tav={12} id="hegy-al-m" />
        <Meret x0={140} y0={292} x1={260} y1={292} szoveg="D" tav={-10} id="hegy-al-m" />
        <Keplet x={200} y={430} fo="A = R²π/2 = D²π/8" masodik="S az átmérőtől 4R/3π ≈ 0,4244 R" harmadik="a szimmetriatengelyen" />
      </g>

      {/* e) negyedkör */}
      <g>
        <Cim x={460} y={272} betu="e" szoveg="Negyedkör" />
        <path d="M 410 366 L 410 276 A 90 90 0 0 1 500 366 Z" fill={IDOM} stroke={IDOM_KERET} strokeWidth="1.6" />
        <line x1={410 + e90} y1={276} x2={410 + e90} y2={366} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
        <line x1={410} y1={366 - e90} x2={500} y2={366 - e90} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
        <SJel x={410 + e90} y={366 - e90} dx={9} dy={-8} />
        <Meret x0={410} y0={386} x1={410 + e90} y1={386} szoveg="4R/3π" tav={12} id="hegy-al-m" />
        <Meret x0={410 + e90} y0={386} x1={500} y1={386} szoveg="" tav={12} id="hegy-al-m" />
        <Meret x0={394} y0={366 - e90} x1={394} y1={366} szoveg="4R/3π" tav={28} id="hegy-al-m" />
        <Meret x0={394} y0={276} x1={394} y1={366 - e90} szoveg="" tav={28} id="hegy-al-m" />
        <Meret x0={520} y0={276} x1={520} y1={366} szoveg="R" tav={-12} id="hegy-al-m" />
        <Keplet x={460} y={430} fo="A = R²π/4 = D²π/16" masodik="S mindkét egyenes éltől 4R/3π" harmadik="(a középponttól mérve)" />
      </g>

      <text x={330} y={488} textAnchor="middle" fontSize="11.5" fill="#475569">
        A tankönyv 9.4. ábrája. R a sugár, D = 2R az átmérő — a feladatokban gyakran D-t adnak meg!
      </text>
    </svg>
  );
}

/* ---------------- 3. ábra: T-szelvény kétféle felbontása ---------------- */

export function AbraFelbontasT() {
  const m = 0.55; // képpont / mm
  const Panel = ({ ox, oy, cim, reszek }) => {
    // reszek: {y0 (jobb szél, mm balra az origótól), z0, b, h, cimke, szin}
    const X = (y) => ox - y * m; // y balra
    const Y = (z) => oy + z * m;
    return (
      <g>
        <text x={ox - 150 * m} y={oy - 22} textAnchor="middle" fontSize="12.5" fontWeight="600" fill="#1d3c48">
          {cim}
        </text>
        {reszek.map((r, i) => (
          <g key={i}>
            <rect x={X(r.y0 + r.b)} y={Y(r.z0)} width={r.b * m} height={r.h * m} fill={r.szin} stroke={IDOM_KERET} strokeWidth="1.4" opacity="0.9" />
            <circle cx={X(r.y0 + r.b / 2)} cy={Y(r.z0 + r.h / 2)} r="3.5" fill="#1d3c48" stroke="white" strokeWidth="1.2" />
            <text x={X(r.y0 + r.b / 2) + (r.cx ?? 0)} y={Y(r.z0 + r.h / 2) + (r.cy ?? -8)} textAnchor="middle" fontSize="12" fontWeight="650" style={{ fill: "#1d3c48", paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}>
              {r.cimke}
            </text>
          </g>
        ))}
        <SJel x={X(150)} y={Y(71.25)} dx={12} dy={4} />
        <TengelyekYZ x={X(150)} y={oy} hossz={110} zHossz={300 * m + 28} id="hegy-ft" />
      </g>
    );
  };
  return (
    <svg viewBox="0 0 620 262" className="abra w-full" role="img" aria-label="T-szelvény kétféle felbontása téglalapokra">
      <defs>
        <Hegy id="hegy-ft" szin="#475569" />
      </defs>
      <Panel
        ox={250}
        oy={40}
        cim="I. mód: két téglalap"
        reszek={[
          { y0: 0, z0: 0, b: 300, h: 30, cimke: "A₁", szin: "#bcdce2", cx: 50, cy: 4 },
          { y0: 140, z0: 30, b: 20, h: 270, cimke: "A₂", szin: "#fed7aa", cx: 22, cy: 40 },
        ]}
      />
      <Panel
        ox={560}
        oy={40}
        cim="II. mód: három téglalap"
        reszek={[
          { y0: 0, z0: 0, b: 140, h: 30, cimke: "A₃", szin: "#bcdce2", cx: 14, cy: 4 },
          { y0: 160, z0: 0, b: 140, h: 30, cimke: "A₁", szin: "#bcdce2", cx: -14, cy: 4 },
          { y0: 140, z0: 0, b: 20, h: 300, cimke: "A₂", szin: "#fed7aa", cx: 22, cy: 50 },
        ]}
      />
      <text x={310} y={250} textAnchor="middle" fontSize="11.5" fill="#475569">
        A részek mások, az összterület és a statikai nyomaték — így a súlypont is — ugyanaz.
      </text>
    </svg>
  );
}

/* ---------------- 4. ábra: kivonásos módszer ---------------- */

export function AbraKivonas() {
  const m = 0.9;
  const Teglalap = ({ ox, oy, b, h, fill, stroke = IDOM_KERET, dash }) => (
    <rect x={ox - b * m} y={oy} width={b * m} height={h * m} fill={fill} stroke={stroke} strokeWidth="1.5" strokeDasharray={dash} />
  );
  // teljes idom 200×140, lyuk 70×50 a jobb felső sarok közelében: y0 = 20, z0 = 15
  // (így a súlypont láthatóan a lyukon kívül, tőle elfelé kerül: y_S ≈ 106, z_S ≈ 74)
  const B = 200;
  const H = 140;
  const lb = 70;
  const lh = 50;
  const ly = 20;
  const lz = 15;
  const A1 = B * H;
  const A2 = lb * lh;
  const ys = (A1 * (B / 2) - A2 * (ly + lb / 2)) / (A1 - A2);
  const zs = (A1 * (H / 2) - A2 * (lz + lh / 2)) / (A1 - A2);
  const P = ({ ox, oy, cim, children }) => (
    <g>
      <text x={ox - (B * m) / 2} y={oy - 20} textAnchor="middle" fontSize="12.5" fontWeight="600" fill="#1d3c48">{cim}</text>
      {children}
    </g>
  );
  return (
    <svg viewBox="0 0 640 222" className="abra w-full" role="img" aria-label="Kivonásos módszer: teljes idom mínusz a lyuk">
      <P ox={200} oy={44} cim="A₁ : teljes téglalap (+)">
        <Teglalap ox={200} oy={44} b={B} h={H} fill={IDOM} />
        <Teglalap ox={200 - ly * m} oy={44 + lz * m} b={lb} h={lh} fill="none" stroke="#94a3b8" dash="4 3" />
        <SJel x={200 - (B * m) / 2} y={44 + (H * m) / 2} cimke="S₁" />
      </P>
      <text x={215} y={115} textAnchor="middle" fontSize="22" fontWeight="600" fill="#64748b">−</text>
      <P ox={410} oy={44} cim="A₂ : a lyuk (−)">
        <Teglalap ox={410} oy={44} b={B} h={H} fill="none" stroke="#94a3b8" dash="4 3" />
        <Teglalap ox={410 - ly * m} oy={44 + lz * m} b={lb} h={lh} fill={NEGATIV} stroke="#be123c" />
        <SJel x={410 - (ly + lb / 2) * m} y={44 + (lz + lh / 2) * m} cimke="S₂" szin="#be123c" />
      </P>
      <text x={425} y={115} textAnchor="middle" fontSize="22" fontWeight="600" fill="#64748b">=</text>
      <P ox={620} oy={44} cim="A = A₁ − A₂">
        <path
          d={`M ${620 - B * m} 44 H 620 V ${44 + H * m} H ${620 - B * m} Z M ${620 - ly * m} ${44 + lz * m} H ${620 - (ly + lb) * m} V ${44 + (lz + lh) * m} H ${620 - ly * m} Z`}
          fill={IDOM}
          fillRule="evenodd"
          stroke={IDOM_KERET}
          strokeWidth="1.5"
        />
        <SJel x={620 - ys * m} y={44 + zs * m} />
      </P>
      <text x={320} y={200} textAnchor="middle" fontSize="11.5" fill="#475569">
        A lyuk területe és statikai nyomatéka negatív előjellel számít.
      </text>
      <text x={320} y={216} textAnchor="middle" fontSize="11.5" fill="#475569">
        A súlypont a lyuktól elfelé tolódik.
      </text>
    </svg>
  );
}
