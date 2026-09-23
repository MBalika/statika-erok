import { axono, TerHegyek, Felirat, EroNyil3, VektorNyil3, Rud3, Seged3, Tengelyek3, Gomb3, Talp3, Befogas3, Doboz3, Metszet3, SZ } from "@/components/terbeli/Axono";
import { KonzolRajz, BakallvanyRajz, TartalyRajz, RacsosRajz } from "@/components/terbeli/TerbeliRajzok";

/**
 * A 10. modul (térbeli tartók) elméleti ábrái – tankönyv 9.1–9.3. ábra nyomán, SVG axonometriában.
 *   AbraKenyszerek        – 9.1. ábra: merev befogás, támasztórúd, gömbcsukló, tengelycsukló és a reakcióik
 *   AbraVetites           – a térbeli feladat három síkba vetítve (xy, yz, zx), a ferde erő komponenseivel
 *   AbraBakallvany        – 9.2.a ábra: háromlábú bakállvány a vetületekkel
 *   AbraBakallvanyCsomopont – 9.2.b ábra: a csomópont elkülönítése
 *   AbraKonzol, AbraKonzolElkulonites – 9.3. ábra: mereven befogott konzol és elkülönítése
 *   AbraIgenybevetelek    – a hat igénybevétel egy keresztmetszeten (előjelek a megelőző és a követő részen)
 *   AbraRacsosTer         – térbeli rácsos tartó
 *   AbraTartaly           – térfogat mentén megoszló teher: a folyadékkal töltött tartály (H13/4)
 */

const Cim = ({ x, y, children }) => (
  <Felirat x={x} y={y} meret={12.5}>
    {children}
  </Felirat>
);
const Magyarazat = ({ x, y, sorok }) => sorok.map((s, i) => (
  <Felirat key={i} x={x} y={y + i * 15} meret={11.5} vastag={false} szin="#475569">
    {s}
  </Felirat>
));

/* ------------------------------------------------------------------ */
/* 9.1. ábra – térbeli kényszerek                                       */
/* ------------------------------------------------------------------ */

function Test({ v, x, y, z }) {
  return <Doboz3 v={v} x={x} y={y} z={z} vastag={1.8} kitoltes="rgba(29,60,72,0.10)" />;
}

export function AbraKenyszerek() {
  const s = 30;
  const va = axono({ ox: 110, oy: 160, s });
  const vb = axono({ ox: 380, oy: 165, s });
  const vc = axono({ ox: 110, oy: 440, s });
  const vd = axono({ ox: 380, oy: 440, s });
  const nev = ["x", "y", "z"];
  const egys = (i) => {
    const d = [0, 0, 0];
    d[i] = 1;
    return d;
  };
  return (
    <svg viewBox="0 0 600 560" className="w-full h-auto" role="img">
      <TerHegyek />
      {/* a) merev befogás */}
      <Cim x={150} y={22}>a) merev befogás – fokszám 6</Cim>
      <Befogas3 v={va} p={[0, 0, 0]} irany="bal" szel={70} />
      <Test v={va} x={[0, 3.6]} y={[-0.35, 0.35]} z={[-0.5, 0.5]} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <VektorNyil3 v={va} pont={[0, 0, 0]} F={egys(i)} leptek={30} minHossz={30} hegyPontban={i === 0} szin={SZ.reakcio} cimke={`A${nev[i]}`} cimkeEltolas={[i === 0 ? 0 : i === 1 ? 10 : -8, i === 1 ? -2 : i === 0 ? -8 : 0]} horgony={i === 2 ? "end" : i === 0 ? "middle" : "start"} cimkeKozepen={i === 0} />
          <VektorNyil3 v={va} pont={[0, 0, 0]} F={egys(i)} leptek={30} minHossz={30} hegyPontban={i === 0} kezdoEltolas={36} szin={SZ.nyomatek} kettos cimke={`MA${nev[i]}`} cimkeEltolas={[i === 0 ? 0 : i === 1 ? 10 : -8, i === 1 ? -2 : i === 0 ? -8 : 12]} horgony={i === 2 ? "end" : i === 0 ? "middle" : "start"} cimkeKozepen={i === 0} />
        </g>
      ))}
      <Magyarazat x={150} y={250} sorok={["3 erő + 3 nyomaték: sem eltolódás,", "sem elfordulás nem lehetséges."]} />

      {/* b) támasztórúd */}
      <Cim x={440} y={22}>b) támasztórúd – fokszám 1</Cim>
      <Test v={vb} x={[-1.4, 1.4]} y={[1.4, 2.1]} z={[-0.6, 0.6]} />
      <Rud3 v={vb} a={[0.6, 1.4, 0]} b={[2.4, -0.6, -0.8]} vastag={3} szin={SZ.rud} />
      <Talp3 v={vb} p={[2.4, -0.6, -0.8]} />
      <circle cx={vb([0.6, 1.4, 0])[0]} cy={vb([0.6, 1.4, 0])[1]} r="3" fill="white" stroke={SZ.rud} strokeWidth="1.4" />
      <VektorNyil3 v={vb} pont={[0.6, 1.4, 0]} F={[1.8, -2, -0.8]} leptek={44} minHossz={44} szin={SZ.huzott} cimke="S" cimkeEltolas={[10, 4]} horgony="start" />
      <Magyarazat x={440} y={250} sorok={["Csak rúdirányú erő; húzottnak", "vesszük fel, a rúd tengelye mentén."]} />

      {/* c) gömbcsukló */}
      <Cim x={150} y={292}>c) gömbcsukló – fokszám 3</Cim>
      <Test v={vc} x={[-1.4, 1.4]} y={[0.5, 1.2]} z={[-0.6, 0.6]} />
      <Gomb3 v={vc} p={[0, 0.5, 0]} r={7} />
      {[0, 1, 2].map((i) => (
        <VektorNyil3 key={i} v={vc} pont={[0, 0.5, 0]} F={egys(i)} leptek={38} minHossz={38} szin={SZ.reakcio} cimke={`A${nev[i]}`} cimkeEltolas={[i === 0 ? 8 : i === 1 ? 10 : -8, i === 1 ? -4 : i === 0 ? 4 : 12]} horgony={i === 2 ? "end" : "start"} />
      ))}
      <Magyarazat x={150} y={520} sorok={["Három erőkomponens; a ponton átmenő", "bármely tengely körül szabad az elfordulás."]} />

      {/* d) tengelycsukló */}
      <Cim x={440} y={292}>d) tengelycsukló – fokszám 5</Cim>
      <Test v={vd} x={[-1.4, 1.4]} y={[0.5, 1.2]} z={[-0.6, 0.6]} />
      <Rud3 v={vd} a={[0, 0.5, -1.6]} b={[0, 0.5, 1.6]} vastag={4} szin={SZ.rud} />
      <Talp3 v={vd} p={[0, 0.5, -1.4]} />
      <Talp3 v={vd} p={[0, 0.5, 1.4]} />
      {[0, 1, 2].map((i) => (
        <VektorNyil3 key={i} v={vd} pont={[0, 0.5, 0]} F={egys(i)} leptek={36} minHossz={36} szin={SZ.reakcio} cimke={`A${nev[i]}`} cimkeEltolas={[i === 0 ? 8 : i === 1 ? 10 : -8, i === 1 ? -4 : i === 0 ? 4 : 12]} horgony={i === 2 ? "end" : "start"} />
      ))}
      <VektorNyil3 v={vd} pont={[0, 0.5, 0]} F={[1, 0, 0]} leptek={30} minHossz={30} kezdoEltolas={42} szin={SZ.nyomatek} kettos cimke="MAx" cimkeEltolas={[8, 4]} horgony="start" />
      <VektorNyil3 v={vd} pont={[0, 0.5, 0]} F={[0, 1, 0]} leptek={30} minHossz={30} kezdoEltolas={42} szin={SZ.nyomatek} kettos cimke="MAy" cimkeEltolas={[8, -2]} horgony="start" />
      <Magyarazat x={440} y={520} sorok={["A z tengely körül foroghat; a másik két", "elfordulást nyomaték, az eltolódásokat erő gátolja."]} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Síkba vetítés                                                        */
/* ------------------------------------------------------------------ */

export function AbraVetites() {
  const a = 2;
  const b = 3;
  const F = [4, -5, 3];
  const E = [-a, b, 0];
  const v = axono({ ox: 180, oy: 230, s: 34 });
  // síkbeli nézetek: (vízszintes tengely, függőleges tengely) → képernyő
  const nezet = (ox, oy, ih, iv, s2 = 26) => (p) => [ox + p[ih] * s2, oy - p[iv] * s2];
  const vxy = nezet(410, 190, 0, 1); // x jobbra, y fel
  const vyz = nezet(410, 400, 2, 1); // z jobbra, y fel  (nézet −x felől: z jobbra)
  const vzx2 = (p) => [160 + p[0] * 26, 440 + p[2] * 26]; // felülnézet: x jobbra, z lefelé a rajzon
  const Nezet = ({ vv, cimx, cimy, cim, komp, cimke, x0, y0 }) => (
    <g>
      <Cim x={x0} y={y0}>{cim}</Cim>
      <Rud3 v={vv} a={[0, 0, 0]} b={[0, b, 0]} vastag={4} />
      <Rud3 v={vv} a={[0, b, 0]} b={E} vastag={4} />
      <Befogas3 v={vv} p={[0, 0, 0]} irany="le" szel={24} />
      <EroNyil3 v={vv} pont={E} F={komp} leptek={4} cimke={cimke} cimkeEltolas={[0, -6]} />
      <line x1={vv([0, 0, 0])[0]} y1={vv([0, 0, 0])[1]} x2={vv([0, 0, 0])[0] + 60} y2={vv([0, 0, 0])[1]} stroke={SZ.meret} strokeWidth="1" markerEnd="url(#tr-tengely)" />
      <line x1={vv([0, 0, 0])[0]} y1={vv([0, 0, 0])[1]} x2={vv([0, 0, 0])[0]} y2={vv([0, 0, 0])[1] - 60} stroke={SZ.meret} strokeWidth="1" markerEnd="url(#tr-tengely)" />
      <Felirat x={vv([0, 0, 0])[0] + 68} y={vv([0, 0, 0])[1] + 4} meret={11.5} szin={SZ.meret} dolt>{cimx}</Felirat>
      <Felirat x={vv([0, 0, 0])[0] + 8} y={vv([0, 0, 0])[1] - 62} meret={11.5} szin={SZ.meret} dolt>{cimy}</Felirat>
    </g>
  );
  return (
    <svg viewBox="0 0 600 540" className="w-full h-auto" role="img">
      <TerHegyek />
      <Cim x={180} y={22}>Térben: F = (4; −5; 3) kN az E pontban</Cim>
      <Tengelyek3 v={v} hossz={[3, 4.3, 2.6]} />
      <Befogas3 v={v} p={[0, 0, 0]} irany="le" />
      <Rud3 v={v} a={[0, 0, 0]} b={[0, b, 0]} vastag={6} />
      <Rud3 v={v} a={[0, b, 0]} b={E} vastag={6} />
      <Felirat x={v(E)[0] - 4} y={v(E)[1] + 17} meret={12} dolt>E</Felirat>
      <Felirat x={v([0, 0, 0])[0] + 12} y={v([0, 0, 0])[1] + 16} meret={12} dolt>A</Felirat>
      <EroNyil3 v={v} pont={E} F={F} leptek={5} cimke="F" cimkeEltolas={[0, -6]} />
      {/* komponens-lépcső */}
      <Seged3 v={v} a={E} b={[E[0] - 1.2, E[1], E[2]]} szin={SZ.teher} />
      <Seged3 v={v} a={[E[0] - 1.2, E[1], E[2]]} b={[E[0] - 1.2, E[1] + 1.5, E[2]]} szin={SZ.teher} />
      <Seged3 v={v} a={[E[0] - 1.2, E[1] + 1.5, E[2]]} b={[E[0] - 1.2, E[1] + 1.5, E[2] - 0.9]} szin={SZ.teher} />
      <Magyarazat x={180} y={318} sorok={["A ferde erő komponensei a (9.1) képlettel:", "Fx = F·lx/l, Fy = F·ly/l, Fz = F·lz/l."]} />

      <Nezet vv={vxy} cimx="x" cimy="y" cim="xy-sík (elölnézet): Fx, Fy, ΣMz" komp={[4, -5, 0]} cimke="Fx, Fy" x0={440} y0={52} />
      <Nezet vv={vyz} cimx="z" cimy="y" cim="yz-sík (oldalnézet): Fy, Fz, ΣMx" komp={[0, -5, 3]} cimke="Fy, Fz" x0={440} y0={262} />
      <g>
        <Cim x={160} y={382}>zx-sík (felülnézet): Fz, Fx, ΣMy</Cim>
        <Rud3 v={vzx2} a={[0, b, 0]} b={E} vastag={4} />
        <circle cx={vzx2([0, 0, 0])[0]} cy={vzx2([0, 0, 0])[1]} r="5" fill="white" stroke={SZ.tarto} strokeWidth="2.5" />
        <EroNyil3 v={vzx2} pont={E} F={[4, 0, 3]} leptek={4} cimke="Fx, Fz" cimkeEltolas={[-14, -6]} />
        <line x1={160} y1={440} x2={220} y2={440} stroke={SZ.meret} strokeWidth="1" markerEnd="url(#tr-tengely)" />
        <line x1={160} y1={440} x2={160} y2={500} stroke={SZ.meret} strokeWidth="1" markerEnd="url(#tr-tengely)" />
        <Felirat x={228} y={444} meret={11.5} szin={SZ.meret} dolt>x</Felirat>
        <Felirat x={168} y={506} meret={11.5} szin={SZ.meret} dolt>z</Felirat>
        <Felirat x={168} y={456} meret={10.5} vastag={false} szin={SZ.meret} horgony="start">A (az oszlop pontként látszik)</Felirat>
      </g>
      <Magyarazat x={420} y={500} sorok={["Három síkbeli rajz, 3 × 3 = 9 egyenlet, de a", "vetületiek kétszer szerepelnek: 6 független marad."]} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 9.2. ábra – bakállvány; 9.3. ábra – konzol                           */
/* ------------------------------------------------------------------ */

export function AbraBakallvany() {
  return <BakallvanyRajz cim="Háromlábú bakállvány (9.2.a ábra): három rúd, egy csomópont, egy erő" Fcimke="F" Fszog="α" magyarazat={["A rudak vetületei (l_ix, l_iy, l_iz) a talppontok koordinátáiból;", "a rúdhossz l_i = √(l_ix² + l_iy² + l_iz²)."]} />;
}

export function AbraBakallvanyCsomopont() {
  return <BakallvanyRajz elkulonites cim="A csomópont elkülönítése (9.2.b ábra): (F, S₁, S₂, S₃) ≐ O" h={300} magyarazat={["Három vetületi egyenlet, három rúderő;", "a nyomatéki egyenletek a csomópontra 0 = 0 azonosságok."]} />;
}

export function AbraKonzol() {
  return <KonzolRajz cim="Mereven befogott konzol (tankönyv 9.3.a ábra)" F={[4, -5, 3]} Fcimke="F" magyarazat={["A befogás fokszáma hat: pontosan annyi, ahány egyensúlyi egyenlet van —", "a konzol statikailag határozott."]} />;
}

export function AbraKonzolElkulonites() {
  return <KonzolRajz cim="A konzol elkülönítése (9.3.b ábra): 3 erő- és 3 nyomatékkomponens" F={[4, -5, 3]} Fcimke="F" reakciok h={420} magyarazat={["Az A ponton átmenő tengelyekre a reakcióerők nem forgatnak:", "mind a hat egyenlet egyismeretlenes."]} />;
}

/* ------------------------------------------------------------------ */
/* A hat igénybevétel egy keresztmetszeten                              */
/* ------------------------------------------------------------------ */

export function AbraIgenybevetelek() {
  const v = axono({ ox: 70, oy: 190, s: 40 });
  const K = [3, 0, 0];
  const t = [1, 0, 0];
  const egys = (i) => {
    const d = [0, 0, 0];
    d[i] = 1;
    return d;
  };
  const nev = ["x", "y", "z"];
  const nyilak = (pont, jel, cimkek, kettos) =>
    [0, 1, 2].map((i) => {
      const d = egys(i).map((c) => c * jel);
      return (
        <VektorNyil3
          key={`${jel}${kettos}${i}`}
          v={v}
          pont={pont}
          F={d}
          leptek={kettos ? 30 : 34}
          minHossz={kettos ? 30 : 34}
          kezdoEltolas={kettos ? 40 : 0}
          szin={kettos ? SZ.nyomatek : SZ.kek}
          kettos={kettos}
          cimke={cimkek[i]}
          cimkeKozepen={i === 0}
          cimkeEltolas={[i === 0 ? 0 : i === 1 ? 10 : kettos ? -6 * jel : 8, i === 1 ? (jel > 0 ? -2 : 12) : i === 0 ? (kettos ? 14 : -8) : kettos ? 12 * jel : 10 * jel]}
          horgony={i === 0 ? "middle" : i === 1 ? "start" : kettos ? (jel > 0 ? "end" : "start") : "start"}
        />
      );
    });
  return (
    <svg viewBox="0 0 600 400" className="w-full h-auto" role="img">
      <TerHegyek />
      <Cim x={300} y={22}>A hat igénybevétel a K keresztmetszeten (a tartótengely az x)</Cim>
      <Tengelyek3 v={v} origo={[0, 0, 0]} hossz={[1.3, 1.6, 1.4]} />
      {/* megelőző rész (bal) */}
      <Rud3 v={v} a={[0.6, 0, 0]} b={K} vastag={14} szin="#8ec3cd" />
      <Metszet3 v={v} p={K} t={t} r={14} cimke="K" cimkeEltolas={[-4, -22]} />
      <Felirat x={v([1.6, 0, 0])[0]} y={v([1.6, 0, 0])[1] + 72} meret={11.5} szin={SZ.tarto}>megelőző rész</Felirat>
      {nyilak(K, 1, ["N", "Vy", "Vz"], false)}
      {nyilak(K, 1, ["T", "My", "Mz"], true)}
      {/* követő rész (jobb), a nyilak ellentettek */}
      <Rud3 v={v} a={[7.8, 0, 0]} b={[10.4, 0, 0]} vastag={14} szin="#8ec3cd" opacitas={0.55} />
      <Metszet3 v={v} p={[7.8, 0, 0]} t={t} r={14} cimke="K" cimkeEltolas={[-4, -22]} />
      <Felirat x={v([9.4, 0, 0])[0]} y={v([9.4, 0, 0])[1] + 72} meret={11.5} szin={SZ.tarto}>követő rész</Felirat>
      {nyilak([7.8, 0, 0], -1, ["N", "Vy", "Vz"], false)}
      {nyilak([7.8, 0, 0], -1, ["T", "My", "Mz"], true)}
      <Magyarazat
        x={300}
        y={318}
        sorok={[
          "A megelőző rész keresztmetszetén a pozitív igénybevétel",
          "a globális tengelyek pozitív irányába mutat; a követő rész keresztmetszetén",
          "(hatás–ellenhatás) ugyanaz az igénybevétel a negatív irányba.",
          "N: kifelé mutató = húzás (+); T: a nyomatékvektor kifelé mutat (+);",
          "Vy, Vz, My, Mz: a tengelyek szerint. A számérték mindkét oldalon ugyanaz.",
        ]}
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Rácsos tartó, tartály                                                */
/* ------------------------------------------------------------------ */

export function AbraRacsosTer() {
  return <RacsosRajz cim="Térbeli rácsos tartó: csuklós csomópontok, csomóponti terhek" magyarazat={["e = 3c egyenlet, i = r + k ismeretlen;", "a csomóponti módszer csomópontonként három rúderőt ad."]} />;
}

export function AbraTartaly() {
  return <TartalyRajz cim="Térfogat mentén megoszló teher: folyadékkal töltött tartály (H13/4)" Fcimke="F" magyarazat={["A töltés súlya G = γ·V a töltés súlypontjában hat:", "ez a térfogati teher eredője."]} />;
}
