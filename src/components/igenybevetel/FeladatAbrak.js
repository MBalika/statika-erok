import Diagram from "@/components/igenybevetel/Diagram";
import { eredmeny } from "@/components/igenybevetel/Modellek";
import { SZIN } from "@/components/tartok/szinek";

/**
 * A kidolgozott feladatok ábrái: a feladat rajza (terhek, támaszok, méretek,
 * reakciók nélkül) és a megoldás ábrái (reakciók + N, V, M egzaktan a számítómagból).
 * A `gyerekek` (a Diagram gyerekek-függvénye) kiegészítő jelölésekhez: szögjel a ferde
 * erőnél, a vetületre adott teher eredeti feliratai stb.
 */

const Felirat = ({ x, y, szoveg, szin = SZIN.teher, meret = 12, horgony = "middle", dolt = false }) => (
  <text x={x} y={y} textAnchor={horgony} fontSize={meret} fontWeight="650" fontStyle={dolt ? "italic" : "normal"}
    style={{ fill: szin, paintOrder: "stroke", stroke: "white", strokeWidth: 3.5 }}>
    {szoveg}
  </text>
);

/**
 * Szögjel egy ferde erő nyilánál: ív az (x, y) támadáspont körül a fok1 irányból a fok2 irányba
 * (matematikai szögek: 0° jobbra, 90° felfelé), „α = 30°” felirattal az ív közepén, kívül.
 */
export function SzogJel({ x, y, fok1, fok2, r = 30, cimke }) {
  const rad = (f) => (f * Math.PI) / 180;
  const p = (f, R) => [x + R * Math.cos(rad(f)), y - R * Math.sin(rad(f))];
  const [x1, y1] = p(fok1, r), [x2, y2] = p(fok2, r);
  const sweep = fok2 > fok1 ? 0 : 1; // növekvő szög = a képernyőn az óramutatóval ellentétes
  const kozep = (fok1 + fok2) / 2;
  const [kx, ky] = p(kozep, r + 8);
  const balra = Math.cos(rad(kozep)) < 0; // a felirat az ívtől kifelé, a nyíl szárától távolabb
  return (
    <g>
      <path d={`M ${x1} ${y1} A ${r} ${r} 0 0 ${sweep} ${x2} ${y2}`} fill="none" stroke={SZIN.teher} strokeWidth="1.3" />
      <Felirat x={kx} y={ky + 4} szoveg={cimke} meret={11.5} dolt horgony={balra ? "end" : "start"} />
    </g>
  );
}

export function FeladatAbra({ kulcs, amp, gyerekek, teherCimkek = true }) {
  return <Diagram eredmeny={eredmeny(kulcs)} abrak={[]} meretek reakciok={false} amp={amp} teherCimkek={teherCimkek} gyerekek={gyerekek} />;
}

export function MegoldasAbra({ kulcs, abrak = ["N", "V", "M"], amp = 40, kiemelSzelso = 0, gyerekek, teherCimkek = true }) {
  return <Diagram eredmeny={eredmeny(kulcs)} abrak={abrak} amp={amp} kiemelSzelso={kiemelSzelso} teherCimkek={teherCimkek} gyerekek={gyerekek} />;
}

/* ---- feladat-specifikus kiegészítések (a Gyf.js használja) ---- */

/** GYF‑1: az F₁ ferde erő (30°, jobbra-lefelé) szögjele az x = 2 m-nél. */
export const gyf1Jelek = ({ g, szerkFent }) => {
  // a nyíl balról-felülről érkezik: a hatásvonal a tengely bal ágával 30°-ot zár be (180° → 150°)
  return <SzogJel x={g.kx(2)} y={szerkFent} fok1={180} fok2={150} cimke="α = 30°" />;
};

/** GYF‑3: az F₁ ferde erő (30°, balra-lefelé) szögjele a C bal végen — a hatásvonal jobbra-fel. */
export const gyf3Jelek = ({ g, szerkFent }) => {
  // a nyíl jobbról-felülről érkezik: a hatásvonal a tengely jobb ágával 30°-ot zár be (0° → 30°)
  return <SzogJel x={g.kx(0)} y={szerkFent} fok1={0} fok2={30} cimke="α = 30°" />;
};

/** GYF‑8: a teher a vízszintes vetület méterére vonatkozik — az eredeti (vizsgaminta) intenzitások feliratai. */
export const gyf8Jelek = ({ g, szerkFent }) => {
  const y = (xm) => szerkFent + (2 - xm) * g.L; // a rúd magassága x-nél (0→2 m, ill. 2→0 m)
  return (
    <g>
      <Felirat x={g.kx(1.4)} y={y(1.4 * 0.4) - 72} szoveg="2 kN/m" />
      <Felirat x={g.kx(1.4)} y={y(1.4 * 0.4) - 59} szoveg="(a vízszintes vetületre)" meret={10.5} />
      <Felirat x={g.kx(8.6)} y={y((10 - 8.6) * 0.4) - 72} szoveg="4 kN/m" />
      <Felirat x={g.kx(8.6)} y={y((10 - 8.6) * 0.4) - 59} szoveg="(a vízszintes vetületre)" meret={10.5} />
    </g>
  );
};
