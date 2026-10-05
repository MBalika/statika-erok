import { axono, TerHegyek, Felirat, Nyil3, EroNyil3, VektorNyil3, KettosNyil3, Rud3, Seged3, Tengelyek3, Gomb3, Talp3, Befogas3, Meret3, Doboz3, Metszet3, SZ, cimkeHely } from "./Axono";
import { sz } from "@/lib/szamok";

/**
 * Paraméteres térbeli rajzok (SVG, axonometria) a 10. modul elméleti és feladat-ábráihoz.
 *   <KonzolRajz />        – tört tengelyű befogott konzol (H13/1–2, tankönyv 9.3. ábra)
 *   <BakallvanyRajz />    – háromlábú bakállvány (H13/3, vizsgaminta, tankönyv 9.2. ábra)
 *   <TartalyRajz />       – gömbcsuklóval és három rúddal megtámasztott tartály (H13/4)
 *   <RacsosRajz />        – térbeli rácsos tartó (GYF‑6)
 *   <KeresztmetszetKep /> – egy keresztmetszet rajza a hat igénybevétellel (H13/2 stílus)
 * Mindegyik teljes <svg>-t ad vissza (viewBox 600 széles), vagy `csoport` proppal csak <g>-t.
 */

const Svg = ({ w = 600, h = 360, children }) => (
  <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" role="img">
    <TerHegyek />
    {children}
  </svg>
);

/* ------------------------------------------------------------------ */
/* Tört tengelyű befogott konzol                                        */
/* ------------------------------------------------------------------ */

export function KonzolRajz({
  a = 2,
  b = 3,
  F = [0, 0, -10],
  Fcimke = "F",
  metszetek = [], // [{ s, nev }] – s: távolság A-tól a tengely mentén
  reakciok = false, // ismeretlen reakciók rajza (elkülönítés)
  reakcioErtekek = null, // { R:[…], MA:[…] } – kiszámolt reakciók (csak a nem nulla komponensek)
  meretek = true,
  befogas = true,
  cim,
  magyarazat = [],
  w = 600,
  h = 360,
  ox = 330,
  oy = 250,
  s = 44,
}) {
  // magas (b = 4) szárnál kisebb lépték, hogy a felső teher nyila és felirata is a rajzban maradjon
  const sk = Math.min(s, 132 / Math.max(b, 1e-6));
  const v = axono({ ox, oy, s: sk });
  const A = [0, 0, 0];
  const C = [0, b, 0];
  const E = [-a, b, 0];
  const nev = ["x", "y", "z"];
  // az E felirat a teher nyilának farkával ellentétes oldalra kerül (balra-le, balra-fel vagy balra)
  const hF = Math.hypot(...F) || 1;
  const vegF = v([E[0] + F[0] / hF, E[1] + F[1] / hF, E[2] + F[2] / hF]);
  const farokX = v(E)[0] - vegF[0];
  const farokY = v(E)[1] - vegF[1];
  const farokH = Math.hypot(farokX, farokY) || 1;
  const eHely = [
    [-12, 18],
    [-13, -8],
    [-20, 6],
  ].reduce((legjobb, j) => {
    const d = (j[0] * farokX + j[1] * farokY) / (Math.hypot(j[0], j[1]) * farokH);
    return !legjobb || d < legjobb.d ? { j, d } : legjobb;
  }, null).j;
  return (
    <Svg w={w} h={h}>
      {cim && (
        <Felirat x={w / 2} y={22} meret={13}>
          {cim}
        </Felirat>
      )}
      <Tengelyek3 v={v} hossz={[3.2, Math.min(b + 1.4, (oy - 34) / sk), 2.6]} />
      {befogas && !reakciok && <Befogas3 v={v} p={A} irany="le" />}
      <Rud3 v={v} a={A} b={C} vastag={6} />
      <Rud3 v={v} a={C} b={E} vastag={6} />
      <Felirat x={v(A)[0] + 12} y={v(A)[1] + 16} meret={12.5} dolt>
        A
      </Felirat>
      <Felirat x={v(E)[0] + eHely[0]} y={v(E)[1] + eHely[1]} meret={12} dolt>
        E
      </Felirat>
      {meretek && (
        <>
          <Meret3 v={v} a={E} b={C} eltolas={[0, a < 1.5 ? 34 : 24]} cimke={`a = ${sz(a, 0)} m`} />
          <Meret3 v={v} a={[2.4, 0, 0]} b={[2.4, b, 0]} eltolas={[0, 0]} cimke={`b = ${sz(b, 0)} m`} />
        </>
      )}
      {metszetek.map((m) => {
        const p = m.s < b ? [0, m.s, 0] : [-(m.s - b), b, 0];
        const t = m.s < b ? [0, 1, 0] : [1, 0, 0];
        return <Metszet3 key={m.nev} v={v} p={p} t={t} cimke={m.nev} cimkeEltolas={m.s < b ? [12, -6] : [-6, -12]} />;
      })}
      <EroNyil3 v={v} pont={E} F={F} leptek={4.5} cimke={Fcimke} cimkeEltolas={[-8, farokY > 0.3 * farokH ? 20 : 2]} horgony="end" />
      {reakciok &&
        !reakcioErtekek &&
        [0, 1, 2].map((i) => {
          const d = [0, 0, 0];
          d[i] = 1;
          // x: balról érkező nyilak, felirat fölé; y: alulról, felirat jobbra; z: hátulról (jobb-fentről), felirat jobbra
          const cA = [[-17, -8, "middle"], [8, 6, "start"], [8, 2, "start"]][i];
          const cM = [[-23, -8, "middle"], [8, 6, "start"], [8, 2, "start"]][i];
          return (
            <g key={i}>
              <VektorNyil3 v={v} pont={A} F={d} leptek={34} szin={SZ.reakcio} hegyPontban cimke={`A${nev[i]}`} cimkeEltolas={[cA[0], cA[1]]} horgony={cA[2]} minHossz={34} />
              <VektorNyil3 v={v} pont={A} F={d} leptek={46} szin={SZ.nyomatek} kettos hegyPontban kezdoEltolas={42} cimke={`MA${nev[i]}`} cimkeEltolas={[cM[0], cM[1]]} horgony={cM[2]} minHossz={46} />
            </g>
          );
        })}
      {reakcioErtekek &&
        [0, 1, 2].map((i) => {
          const R = reakcioErtekek.R[i];
          const MA = reakcioErtekek.MA[i];
          const d = [0, 0, 0];
          d[i] = Math.sign(R) || 0;
          const m = [0, 0, 0];
          m[i] = Math.sign(MA) || 0;
          // a tényleges irányban, a farok A-ban; az y-komponensek az oszlop mellett (balra tolva); rövid feliratok, az értékek a táblázatban
          const elt = i === 1 ? [-16, 0] : [0, 0];
          const cimkeR = i === 0 ? [0, -9, "middle"] : i === 1 ? [-6, R > 0 ? -4 : 12, "end"] : [8, R > 0 ? 12 : -4, "start"];
          const cimkeM = i === 0 ? [0, -9, "middle"] : i === 1 ? [-6, MA > 0 ? -4 : 12, "end"] : [8, MA > 0 ? 12 : -4, "start"];
          const egyIrany = Math.abs(R) > 1e-6 && Math.sign(R) === Math.sign(MA);
          return (
            <g key={i}>
              {Math.abs(R) > 1e-6 && <VektorNyil3 v={v} pont={A} F={d} leptek={40} szin={SZ.reakcio} eltolasPx={elt} cimkeKozepen={i === 0} cimke={`A${nev[i]}`} cimkeEltolas={[cimkeR[0], cimkeR[1]]} horgony={cimkeR[2]} minHossz={40} />}
              {Math.abs(MA) > 1e-6 && (
                <VektorNyil3 v={v} pont={A} F={m} leptek={52} szin={SZ.nyomatek} kettos eltolasPx={elt} kezdoEltolas={egyIrany ? 48 : 0} cimkeKozepen={i === 0} cimke={`MA${nev[i]}`} cimkeEltolas={[cimkeM[0], cimkeM[1]]} horgony={cimkeM[2]} minHossz={52} />
              )}
            </g>
          );
        })}
      {reakcioErtekek && (
        <g>
          <Felirat x={40} y={60} meret={11.5} horgony="start" szin={SZ.reakcio}>
            reakcióerő [kN]
          </Felirat>
          {[0, 1, 2].map((i) => (
            <Felirat key={`r${i}`} x={40} y={78 + i * 16} meret={11.5} vastag={false} horgony="start" szin={SZ.reakcio}>
              A{nev[i]} = {sz(reakcioErtekek.R[i], 2)}
            </Felirat>
          ))}
          <Felirat x={40} y={140} meret={11.5} horgony="start" szin={SZ.nyomatek}>
            befogási nyomaték [kNm]
          </Felirat>
          {[0, 1, 2].map((i) => (
            <Felirat key={`m${i}`} x={40} y={158 + i * 16} meret={11.5} vastag={false} horgony="start" szin={SZ.nyomatek}>
              MA{nev[i]} = {sz(reakcioErtekek.MA[i], 2)}
            </Felirat>
          ))}
        </g>
      )}
      {magyarazat.map((sor, i) => (
        <Felirat key={i} x={w / 2} y={h - 8 - (magyarazat.length - 1 - i) * 15} meret={11.5} vastag={false} szin="#475569">
          {sor}
        </Felirat>
      ))}
    </Svg>
  );
}

/* ------------------------------------------------------------------ */
/* Háromlábú bakállvány                                                 */
/* ------------------------------------------------------------------ */

export function BakallvanyRajz({
  csucs = [0, 6, 0],
  labak = [
    [-4, 0, 0],
    [5, 0, -4],
    [5, 0, 4],
  ],
  F = [-7.071, -7.071, 0],
  Fcimke = "F",
  Fszog, // pl. "α" – az F és a +x tengely közötti szög felirata
  FcimkeEltolas = null, // null: a nyíl iránya szerint automatikusan
  Fhorgony = null,
  rudErok = null, // [S1,S2,S3] – ha adott, a rudak színe és felirata az előjel szerint
  elkulonites = false, // csak a csomópont: F és a három rúderő nyíl
  meretek = true,
  talpKoordinatak = false, // a talppontok (x; 0; z) koordinátái a talp alatt az x/z méretfeliratok helyett
  cim,
  magyarazat = [],
  w = 600,
  h = 430,
  ox = 250,
  oy = 300,
  s = 30,
}) {
  const v = axono({ ox, oy, s });
  const e = labak.map((p) => {
    const d = [p[0] - csucs[0], p[1] - csucs[1], p[2] - csucs[2]];
    const l = Math.hypot(...d);
    return d.map((c) => c / l);
  });
  // a teher nyilának farka a képernyőn (a C-ből kifelé): ha alulról jön (felfelé mutató F), a feliratot a farok mellé tesszük
  const hF0 = Math.hypot(...F) || 1;
  const vegF0 = v([csucs[0] + F[0] / hF0, csucs[1] + F[1] / hF0, csucs[2] + F[2] / hF0]);
  const farok = [v(csucs)[0] - vegF0[0], v(csucs)[1] - vegF0[1]];
  const farokLent = hF0 > 1e-9 && farok[1] > 0.3 * (Math.hypot(...farok) || 1);
  const FcimkeElt = FcimkeEltolas ?? (farokLent ? [farok[0] >= 0 ? 8 : -8, 4] : [6, -2]);
  const FhorgonyAuto = Fhorgony ?? (farokLent ? (farok[0] >= 0 ? "start" : "end") : "start");
  // a csúcs alatti függőleges segédvonal elmaradna, ha egy rúd maga is függőleges (a vonal a rúdra esne)
  const vanFuggolegesRud = labak.some((p) => Math.abs(p[0] - csucs[0]) < 1e-9 && Math.abs(p[2] - csucs[2]) < 1e-9);
  const rudSzakaszok = labak.map((p) => [v(csucs), v(p)]);
  // a teher feliratának helye (közelítőleg) mint kerülendő szakasz a rúdfeliratok elhelyezéséhez
  const farokPx = Math.max(26, hF0 * 5);
  const fh0 = Math.hypot(...farok) || 1;
  const farokPont = [v(csucs)[0] + (farok[0] / fh0) * (farokPx + 12), v(csucs)[1] + (farok[1] / fh0) * (farokPx + 12)];
  const cimkeIrany = FhorgonyAuto === "end" ? -1 : FhorgonyAuto === "start" ? 1 : 0;
  const teherCimkeSzakasz = [[farokPont[0] + (cimkeIrany === 0 ? -35 : cimkeIrany * 4), farokPont[1] - 6], [farokPont[0] + (cimkeIrany === 0 ? 35 : cimkeIrany * 70), farokPont[1] - 6]];
  // a magasság méretvonala: a legnagyobb x-ű talptól jobbra; koordináta-feliratos rajzon a talpak képernyő-helyétől jobbra
  const xMeret = talpKoordinatak ? (Math.max(...labak.map((p) => v(p)[0])) + 44 - ox) / s : Math.max(...labak.map((p) => p[0])) + 1.2;
  if (elkulonites) {
    const vv0 = axono({ ox: 0, oy: 0, s: 30 });
    const [cx0, cy0] = vv0(csucs);
    const vv = axono({ ox: w / 2 - cx0, oy: 150 - cy0, s: 30 });
    return (
      <Svg w={w} h={h}>
        {cim && (
          <Felirat x={w / 2} y={22} meret={13}>
            {cim}
          </Felirat>
        )}
        <circle cx={vv(csucs)[0]} cy={vv(csucs)[1]} r="5" fill={SZ.tarto} />
        <EroNyil3 v={vv} pont={csucs} F={F} leptek={5} cimke={Fcimke} cimkeEltolas={[-10, -8]} />
        {e.map((ei, i) => (
          <VektorNyil3 key={i} v={vv} pont={csucs} F={ei} leptek={90} minHossz={90} szin={rudErok ? (rudErok[i] < 0 ? SZ.nyomott : SZ.huzott) : SZ.reakcio} cimke={`S${i + 1}`} cimkeEltolas={[ei[0] * 14, ei[1] * -6 + 14]} />
        ))}
        {magyarazat.map((sor, i) => (
          <Felirat key={i} x={w / 2} y={h - 8 - (magyarazat.length - 1 - i) * 15} meret={11.5} vastag={false} szin="#475569">
            {sor}
          </Felirat>
        ))}
      </Svg>
    );
  }
  return (
    <Svg w={w} h={h}>
      {cim && (
        <Felirat x={w / 2} y={22} meret={13}>
          {cim}
        </Felirat>
      )}
      <Tengelyek3 v={v} hossz={[7.5, csucs[1] + 1.5, talpKoordinatak ? Math.max(5, ...labak.map((p) => p[2] + 2)) : 5]} />
      {labak.map((p, i) => {
        const szin = rudErok ? (Math.abs(rudErok[i]) < 1e-6 ? SZ.seged : rudErok[i] < 0 ? SZ.nyomott : SZ.huzott) : SZ.tarto;
        // a rúd száma és a rúderő felirata a rúd mellett, lehetőleg a csúcs talppontjától elfelé és a többi rúdtól távol
        const [Xo, Yo] = v([csucs[0], 0, csucs[2]]);
        const [Xk, Yk] = v([(csucs[0] + p[0]) / 2, (csucs[1] + p[1]) / 2, (csucs[2] + p[2]) / 2]);
        const elonyH = Math.hypot(Xk - Xo, Yk - Yo) || 1;
        const probak = rudErok ? (nx, ny) => [[nx * 18 + (nx > 0.2 ? 40 : nx < -0.2 ? -40 : 0), ny * 18], [nx * 18 + (nx > 0.2 ? 80 : nx < -0.2 ? -80 : 0), ny * 18]] : null;
        const hely = cimkeHely(v(csucs), v(p), [...rudSzakaszok.filter((_, j) => j !== i), ...(Fcimke ? [teherCimkeSzakasz] : [])], 16, [(Xk - Xo) / elonyH, (Yk - Yo) / elonyH], undefined, probak);
        const { nx, ny } = hely;
        const X = hely.x - nx * 16;
        const Y = hely.y - ny * 16;
        const [Xp, Yp] = v(p);
        return (
          <g key={i}>
            <Rud3 v={v} a={csucs} b={p} vastag={4.5} szin={szin} />
            <Talp3 v={v} p={p} />
            <circle cx={X + nx * 16} cy={Y + ny * 16} r="9" fill="white" stroke={szin} strokeWidth="1.3" />
            <Felirat x={X + nx * 16} y={Y + ny * 16 + 4} meret={11} szin={szin}>
              {i + 1}
            </Felirat>
            {rudErok && (
              <Felirat x={X + nx * 34} y={Y + ny * 34 + 4} meret={11} szin={szin} horgony={nx > 0.2 ? "start" : nx < -0.2 ? "end" : "middle"}>
                S{i + 1} = {sz(rudErok[i], 2)} kN
              </Felirat>
            )}
            {meretek && (
              <>
                <Seged3 v={v} a={p} b={[p[0], 0, 0]} />
                <Seged3 v={v} a={p} b={[0, 0, p[2]]} />
              </>
            )}
            {talpKoordinatak && (
              <Felirat x={Xp} y={Yp + 26} meret={10.5} vastag={false} szin={SZ.meret}>
                ({sz(p[0], 0)}; 0; {sz(p[2], 0)})
              </Felirat>
            )}
          </g>
        );
      })}
      {!vanFuggolegesRud && <Seged3 v={v} a={[csucs[0], 0, csucs[2]]} b={csucs} />}
      <circle cx={v(csucs)[0]} cy={v(csucs)[1]} r="4.5" fill="white" stroke={SZ.tarto} strokeWidth="2" />
      {(() => {
        // a C felirat a teher-nyíl farkával ellentétes oldalra kerül, hogy ne fedje az F feliratot
        const hF = Math.hypot(...F) || 1;
        const veg = v([csucs[0] + F[0] / hF, csucs[1] + F[1] / hF, csucs[2] + F[2] / hF]);
        const dX = veg[0] - v(csucs)[0], dY = veg[1] - v(csucs)[1];
        const jobbra = hF < 1e-9 ? true : dX >= 0;
        return (
          <Felirat x={v(csucs)[0] + (jobbra ? 12 : -12)} y={v(csucs)[1] + (dY > 0 ? 16 : -6)} meret={12} dolt horgony={jobbra ? "start" : "end"}>
            C
          </Felirat>
        );
      })()}
      <EroNyil3 v={v} pont={csucs} F={F} leptek={5} cimke={Fcimke} cimkeEltolas={FcimkeElt} horgony={FhorgonyAuto} />
      {Fszog && (
        <>
          <Seged3 v={v} a={csucs} b={[csucs[0] + 2.6, csucs[1], csucs[2]]} szin={SZ.teher} />
          <Felirat x={v([csucs[0] + 2.6, csucs[1], csucs[2]])[0] + 6} y={v([csucs[0] + 2.6, csucs[1], csucs[2]])[1] + 4} meret={12} szin={SZ.teher} dolt horgony="start">
            {Fszog}
          </Felirat>
        </>
      )}
      {meretek && (
        <>
          <Meret3 v={v} a={[xMeret, 0, 0]} b={[xMeret, csucs[1], 0]} eltolas={[0, 0]} cimke={`${sz(csucs[1], 0)} m`} />
          {!talpKoordinatak &&
            labak.map((p, i) => (
            <g key={i}>
              {p[0] !== 0 && (
                <Felirat x={v([p[0] / 2, 0, p[2]])[0]} y={v([p[0] / 2, 0, p[2]])[1] + (p[2] >= 0 ? 14 : -6)} meret={11} vastag={false} szin={SZ.meret}>
                  x = {sz(p[0], 0)} m
                </Felirat>
              )}
              {p[2] !== 0 && (
                <Felirat x={v([p[0], 0, p[2] / 2])[0] + (p[0] >= 0 ? 8 : -8)} y={v([p[0], 0, p[2] / 2])[1] + 4} meret={11} vastag={false} szin={SZ.meret} horgony={p[0] >= 0 ? "start" : "end"}>
                  z = {sz(p[2], 0)} m
                </Felirat>
              )}
            </g>
            ))}
        </>
      )}
      {magyarazat.map((sor, i) => (
        <Felirat key={i} x={w / 2} y={h - 8 - (magyarazat.length - 1 - i) * 15} meret={11.5} vastag={false} szin="#475569">
          {sor}
        </Felirat>
      ))}
    </Svg>
  );
}

/* ------------------------------------------------------------------ */
/* Tartály gömbcsuklóval és három rúddal (H13/4)                        */
/* ------------------------------------------------------------------ */

export function TartalyRajz({
  Lx = 4, // a tartály (lap) mérete x irányban
  H = 2, // a tartály magassága (lapnál: az oszlop magassága, ha van F)
  Lz = 4, // méret z irányban
  Fpont = [0, H, Lz], // a vízszintes F támadáspontja; null: nincs F
  Fcimke = "F",
  gamma = "γ = 15 kN/m³", // a töltés felirata (üres/null: nincs)
  Gcimke = null, // ha adott: koncentrált G erő nyila a lap/tartály közepén (a generátor „lap” feladatához)
  lap = false, // tartály helyett vízszintes lap (y = 0) és egy oszlop a (0; 0; 0) sarkon F-ig
  rudErok = null,
  reakciok = false,
  cim,
  magyarazat = [],
  w = 600,
  h = 430,
  ox = 200,
  oy = 210,
  s = 32,
}) {
  const v = axono({ ox, oy, s });
  const A = [Lx, 0, Lz];
  const r1 = [[0, 0, Lz], [0, -3, Lz]];
  const r2 = [[Lx, 0, 0], [Lx + 2, 0, 0]];
  const r3 = [[Lx, 0, 0], [Lx, -3, 0]];
  const rudak = [r1, r2, r3];
  const szinRud = (i) => (rudErok ? (Math.abs(rudErok[i]) < 1e-6 ? SZ.seged : rudErok[i] < 0 ? SZ.nyomott : SZ.huzott) : SZ.rud);
  const lapSarkok = [[0, 0, Lz], [Lx, 0, Lz], [Lx, 0, 0], [0, 0, 0]].map(v);
  const gammaPont = v([Lx / 2 + 0.2, H - 0.1, 0]);
  return (
    <Svg w={w} h={h}>
      {cim && (
        <Felirat x={w / 2} y={22} meret={13}>
          {cim}
        </Felirat>
      )}
      <Tengelyek3 v={v} hossz={[Lx + 3.6, Math.max(H, 1) + 1.4, Lz + 2]} />
      {lap ? (
        <g>
          <polygon points={lapSarkok.map((q) => q.join(",")).join(" ")} fill="rgba(142,195,205,0.22)" stroke={SZ.tarto} strokeWidth="2.2" strokeLinejoin="round" />
          {Fpont && <Rud3 v={v} a={[0, 0, 0]} b={[0, Fpont[1], 0]} vastag={5} />}
        </g>
      ) : (
        <Doboz3 v={v} x={[0, Lx]} y={[0, H]} z={[0, Lz]} />
      )}
      {gamma && !lap && (
        <>
          <Felirat x={gammaPont[0] + 60} y={gammaPont[1] - 22} meret={11.5} vastag={false} horgony="start">
            {gamma}
          </Felirat>
          <line x1={v([Lx - 0.8, H - 0.4, 0])[0]} y1={v([Lx - 0.8, H - 0.4, 0])[1]} x2={gammaPont[0] + 58} y2={gammaPont[1] - 18} stroke={SZ.seged} strokeWidth="1" />
        </>
      )}
      {rudak.map(([p, q], i) => {
        const kozep = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2, (p[2] + q[2]) / 2];
        const [X, Y] = v(kozep);
        return (
          <g key={i}>
            <Rud3 v={v} a={p} b={q} vastag={3.5} szin={szinRud(i)} />
            {i === 1 ? <Talp3 v={v} p={q} forgatas={-90} /> : <Talp3 v={v} p={q} />}
            <circle cx={X + (i === 1 ? 0 : i === 2 ? 16 : -16)} cy={Y + (i === 1 ? -16 : 0)} r="9" fill="white" stroke={szinRud(i)} strokeWidth="1.3" />
            <Felirat x={X + (i === 1 ? 0 : i === 2 ? 16 : -16)} y={Y + (i === 1 ? -12 : 4)} meret={11} szin={szinRud(i)}>
              {i + 1}
            </Felirat>
            {rudErok && (
              /* az 1-es rúd felirata balra (a talaj szaggatott vonala jobbra keresztezné), a 3-asé jobbra, a 2-esé fölé */
              <Felirat x={X + (i === 1 ? 0 : i === 2 ? 28 : -30)} y={Y + (i === 1 ? -30 : i === 2 ? 18 : 4)} meret={11} szin={szinRud(i)} horgony={i === 1 ? "middle" : i === 2 ? "start" : "end"}>
                S{i + 1} = {sz(rudErok[i], 1)} kN
              </Felirat>
            )}
          </g>
        );
      })}
      <Gomb3 v={v} p={A} cimke="A" />
      {reakciok &&
        [0, 1, 2].map((i) => {
          const d = [0, 0, 0];
          d[i] = 1;
          return <VektorNyil3 key={i} v={v} pont={A} F={d} leptek={36} minHossz={36} szin={SZ.reakcio} cimke={`A${["x", "y", "z"][i]}`} cimkeEltolas={[i === 0 ? 6 : i === 1 ? 8 : -6, i === 1 ? -2 : i === 0 ? 4 : 12]} horgony={i === 2 ? "end" : "start"} />;
        })}
      {Gcimke && <EroNyil3 v={v} pont={[Lx / 2, lap ? 0 : H / 2, Lz / 2]} F={[0, -1, 0]} leptek={44} cimke={Gcimke} cimkeEltolas={[10, 12]} horgony="start" />}
      {Fpont && <EroNyil3 v={v} pont={Fpont} F={[-1, 0, 0]} leptek={40} cimke={Fcimke} cimkeEltolas={[lap ? -6 : -32, -14]} horgony="middle" />}
      <Meret3 v={v} a={[0, -3, Lz]} b={[Lx, -3, Lz]} eltolas={[0, 20]} cimke={`${sz(Lx, 0)} m`} />
      <Meret3 v={v} a={[Lx, -3, Lz]} b={[Lx + 2, -3, Lz]} eltolas={[0, 20]} cimke="2 m" />
      {!lap && <Meret3 v={v} a={[Lx + 2.6, 0, 0]} b={[Lx + 2.6, H, 0]} eltolas={[0, 0]} cimke={`${sz(H, H % 1 ? 1 : 0)} m`} />}
      {lap && Fpont && <Meret3 v={v} a={[0.7, 0, 0]} b={[0.7, Fpont[1], 0]} eltolas={[0, 0]} cimke={`${sz(Fpont[1], Fpont[1] % 1 ? 1 : 0)} m`} />}
      <Meret3 v={v} a={[Lx + 2.6, -3, 0]} b={[Lx + 2.6, 0, 0]} eltolas={[0, 0]} cimke="3 m" />
      <Meret3 v={v} a={[Lx + 2, -3, 0]} b={[Lx + 2, -3, Lz]} eltolas={[14, 12]} cimke={`${sz(Lz, 0)} m`} />
      {/* a talajszint vázlata */}
      <Seged3 v={v} a={[0, -3, Lz]} b={[Lx + 2, -3, Lz]} />
      <Seged3 v={v} a={[Lx + 2, -3, Lz]} b={[Lx + 2, -3, 0]} />
      <Seged3 v={v} a={[Lx + 2, -3, 0]} b={[0, -3, 0]} />
      <Seged3 v={v} a={[0, -3, 0]} b={[0, -3, Lz]} />
      {magyarazat.map((sor, i) => (
        <Felirat key={i} x={w / 2} y={h - 8 - (magyarazat.length - 1 - i) * 15} meret={11.5} vastag={false} szin="#475569">
          {sor}
        </Felirat>
      ))}
    </Svg>
  );
}

/* ------------------------------------------------------------------ */
/* Térbeli rácsos tartó (GYF‑6)                                         */
/* ------------------------------------------------------------------ */

export const RACSOS_CSOMOPONTOK = { D: [2, 3, 2], E: [4, 3, 2], A: [0, 0, 0], B: [6, 0, 0], C: [0, 0, 4], G: [6, 0, 4] };
export const RACSOS_RUDAK = [
  ["1", "D", "A"],
  ["2", "D", "C"],
  ["3", "D", "B"],
  ["4", "D", "E"],
  ["5", "E", "B"],
  ["6", "E", "G"],
];

export function RacsosRajz({ terhek = [{ cs: "E", F: [0, -12, 0], cimke: "12 kN" }, { cs: "D", F: [0, -8, 0], cimke: "8 kN" }], rudErok = null, kiemeltCsomopont, cim, magyarazat = [], w = 600, h = 380, ox = 200, oy = 270, s = 40 }) {
  const v = axono({ ox, oy, s });
  const P = RACSOS_CSOMOPONTOK;
  const hh = h + Math.max(0, magyarazat.length - 1) * 16; // több magyarázó sor: a rajz alatt több hely
  const szakaszok = RACSOS_RUDAK.map(([, a, b]) => [v(P[a]), v(P[b])]);
  const foglalt = []; // a már elhelyezett feliratok (rövid vízszintes szakaszok), hogy a következők ne üljenek rájuk
  return (
    <Svg w={w} h={hh}>
      {cim && (
        <Felirat x={w / 2} y={22} meret={13}>
          {cim}
        </Felirat>
      )}
      <Tengelyek3 v={v} hossz={[7.5, 4.6, 5.5]} />
      {/* a talp téglalapja */}
      <Seged3 v={v} a={P.A} b={P.B} />
      <Seged3 v={v} a={P.B} b={P.G} />
      <Seged3 v={v} a={P.G} b={P.C} />
      <Seged3 v={v} a={P.C} b={P.A} />
      {RACSOS_RUDAK.map(([id, a, b]) => {
        const S = rudErok ? rudErok[id] : null;
        const szin = S == null ? SZ.tarto : Math.abs(S) < 1e-6 ? SZ.seged : S < 0 ? SZ.nyomott : SZ.huzott;
        // a rúd száma a rúd mellett, a többi rúdtól távol (a 3-as rúd felezőpontja pl. épp a 6-os rúdra esik a rajzon)
        const kozep = [(P[a][0] + P[b][0]) / 2, (P[a][1] + P[b][1]) / 2, (P[a][2] + P[b][2]) / 2];
        const [Xk, Yk] = v(kozep);
        const [Xo, Yo] = v([3, 1.2, 2]);
        const elonyH = Math.hypot(Xk - Xo, Yk - Yo) || 1;
        const probak = S != null ? (nx, ny) => [[nx * 17 + (nx > 0.3 ? 14 : nx < -0.3 ? -14 : 0), ny * 17], [nx * 17 + (nx > 0.3 ? 28 : nx < -0.3 ? -28 : 0), ny * 17]] : null;
        const hely = cimkeHely(v(P[a]), v(P[b]), [...szakaszok.filter((_, j) => RACSOS_RUDAK[j][0] !== id), ...foglalt], 13, [(Xk - Xo) / elonyH, (Yk - Yo) / elonyH], undefined, probak);
        const { nx, ny } = hely;
        const X = hely.x - nx * 13;
        const Y = hely.y - ny * 13;
        foglalt.push([[hely.x - 9, hely.y], [hely.x + 9, hely.y]]);
        if (S != null) foglalt.push([[X + nx * 30 - 26, Y + ny * 30], [X + nx * 30 + 26, Y + ny * 30]]);
        const halvany = kiemeltCsomopont && a !== kiemeltCsomopont && b !== kiemeltCsomopont;
        return (
          <g key={id} opacity={halvany ? 0.35 : 1}>
            <Rud3 v={v} a={P[a]} b={P[b]} vastag={4} szin={szin} />
            <circle cx={X + nx * 13} cy={Y + ny * 13} r="8.5" fill="white" stroke={szin} strokeWidth="1.2" />
            <Felirat x={X + nx * 13} y={Y + ny * 13 + 4} meret={10.5} szin={szin}>
              {id}
            </Felirat>
            {S != null && (
              <Felirat x={X + nx * 30} y={Y + ny * 30 + 4} meret={10.5} szin={szin} horgony={nx > 0.3 ? "start" : nx < -0.3 ? "end" : "middle"}>
                {sz(S, 2)}
              </Felirat>
            )}
          </g>
        );
      })}
      {["A", "B", "C", "G"].map((id) => (
        <Gomb3 key={id} v={v} p={P[id]} r={5} cimke={id} cimkeEltolas={id === "A" || id === "C" ? [-16, 4] : [12, 4]} />
      ))}
      {["D", "E"].map((id) => (
        <g key={id}>
          <circle cx={v(P[id])[0]} cy={v(P[id])[1]} r="4.5" fill={kiemeltCsomopont === id ? SZ.sarga : "white"} stroke={SZ.tarto} strokeWidth="2" />
          <Felirat x={v(P[id])[0] + (id === "D" ? -12 : 12)} y={v(P[id])[1] - 8} meret={12} dolt>
            {id}
          </Felirat>
        </g>
      ))}
      {terhek.map((t) => (
        <EroNyil3 key={t.cs} v={v} pont={P[t.cs]} F={t.F} leptek={4} cimke={t.cimke} cimkeEltolas={[t.cs === "D" ? -22 : 22, -6]} />
      ))}
      {magyarazat.map((sor, i) => (
        <Felirat key={i} x={w / 2} y={hh - 8 - (magyarazat.length - 1 - i) * 15} meret={11.5} vastag={false} szin="#475569">
          {sor}
        </Felirat>
      ))}
    </Svg>
  );
}

/* ------------------------------------------------------------------ */
/* Keresztmetszet-kép a hat igénybevétellel                             */
/* ------------------------------------------------------------------ */

/**
 * nezet: { vizsz: "z", fugg: "y", normal: "x", normalBefele: true, fuggLefele?: false } – a rajz síkjának két tengelye és a normális;
 *        fuggLefele: a függőleges tengely pozitív iránya a papíron lefelé mutat (pl. felülnézet: x jobbra, z lefelé, y a néző felé — jobbkezes).
 * ertekek: { N, T, [V_vizsz], [V_fugg], [M_vizsz], [M_fugg] } – a komponensek előjeles értéke (null: nincs kiírva).
 * Az erők nyilai a pozitív tengelyirányba mutatnak, ha az érték pozitív; N és T: ⊙ (a néző felé) vagy ⊗ (befelé).
 */
export function KeresztmetszetKep({ nezet, ertekek, cim, cx = 150, cy = 148, r = 44, w = 300, h = 300, csoport = false, magyarazat = [] }) {
  const { vizsz, fugg, normal, normalBefele, fuggLefele = false } = nezet;
  const bef = normalBefele ? 1 : -1; // +normál irány a néző felé (−1) vagy befelé (+1)
  const fj = fuggLefele ? -1 : 1; // a függőleges tengely pozitív iránya a papíron: felfelé (+1) vagy lefelé (−1)
  const jel = (ertek) => (ertek > 0 ? 1 : ertek < 0 ? -1 : 0);
  const Vv = ertekek[`V_${vizsz}`];
  const Vf = ertekek[`V_${fugg}`];
  const Mv = ertekek[`M_${vizsz}`];
  const Mf = ertekek[`M_${fugg}`];
  const N = ertekek.N;
  const T = ertekek.T;
  const nevelo = normal === "z" ? "a" : "az";
  const szimbolum = (x, y, ertek, cimke, szin, lx, ly, horgony) => {
    if (ertek == null) return null;
    const j = jel(ertek) * bef; // +1: befelé (⊗), −1: kifelé (⊙)
    const nulla = jel(ertek) === 0;
    const sz2 = nulla ? SZ.seged : szin;
    return (
      <g>
        <circle cx={x} cy={y} r="8" fill="white" stroke={sz2} strokeWidth="1.8" />
        {!nulla && j > 0 && (
          <>
            <line x1={x - 5} y1={y - 5} x2={x + 5} y2={y + 5} stroke={szin} strokeWidth="1.8" />
            <line x1={x - 5} y1={y + 5} x2={x + 5} y2={y - 5} stroke={szin} strokeWidth="1.8" />
          </>
        )}
        {!nulla && j < 0 && <circle cx={x} cy={y} r="2.6" fill={szin} />}
        <line x1={x - 8} y1={y + (ly > y ? 8 : -8)} x2={lx + 4} y2={ly - 4} stroke={sz2} strokeWidth="0.8" />
        <Felirat x={lx} y={ly} meret={11} szin={sz2} horgony={horgony}>
          {cimke} = {sz(ertek, 2)}
        </Felirat>
      </g>
    );
  };
  const tartalom = (
    <g>
      {cim && (
        <Felirat x={cx} y={22} meret={12.5}>
          {cim}
        </Felirat>
      )}
      <circle cx={cx} cy={cy} r={r} fill="rgba(245,158,11,0.18)" stroke={SZ.sarga} strokeWidth="2" />
      {/* tengelyek */}
      <line x1={cx - r - 26} y1={cy} x2={cx + r + 26} y2={cy} stroke={SZ.meret} strokeWidth="1.2" markerEnd="url(#tr-tengely)" />
      <line x1={cx} y1={cy + fj * (r + 26)} x2={cx} y2={cy - fj * (r + 26)} stroke={SZ.meret} strokeWidth="1.2" markerEnd="url(#tr-tengely)" />
      <Felirat x={cx + r + 28} y={cy - 5} meret={12} szin={SZ.meret} dolt horgony="start">
        {vizsz}
      </Felirat>
      <Felirat x={cx + 8} y={cy - fj * (r + 26) + (fj > 0 ? 0 : 4)} meret={12} szin={SZ.meret} dolt horgony="start">
        {fugg}
      </Felirat>
      {/* nyíróerők */}
      {Vv != null && jel(Vv) !== 0 && (
        <g>
          <line x1={cx} y1={cy} x2={cx + jel(Vv) * (r - 6)} y2={cy} stroke={SZ.kek} strokeWidth="2.6" markerEnd="url(#tr-kek)" />
          <Felirat x={cx + jel(Vv) * 10} y={cy - 6} meret={11} szin={SZ.kek} horgony={jel(Vv) > 0 ? "start" : "end"}>
            V{vizsz} = {sz(Vv, 2)}
          </Felirat>
        </g>
      )}
      {Vf != null && jel(Vf) !== 0 && (
        <g>
          <line x1={cx} y1={cy} x2={cx} y2={cy - fj * jel(Vf) * (r - 6)} stroke={SZ.kek} strokeWidth="2.6" markerEnd="url(#tr-kek)" />
          <Felirat x={cx + 8} y={cy - fj * jel(Vf) * (r - 16) + 4} meret={11} szin={SZ.kek} horgony="start">
            V{fugg} = {sz(Vf, 2)}
          </Felirat>
        </g>
      )}
      {/* hajlítónyomatékok (kettős nyíl a tengellyel párhuzamosan, a körön kívül) */}
      {Mv != null && jel(Mv) !== 0 && (
        <g>
          <line x1={cx + jel(Mv) * (r + 4)} y1={cy + 22} x2={cx + jel(Mv) * (r + 36)} y2={cy + 22} stroke={SZ.nyomatek} strokeWidth="2.4" markerEnd="url(#tr-nyomatek)" />
          <line x1={cx + jel(Mv) * (r + 4)} y1={cy + 22} x2={cx + jel(Mv) * (r + 29)} y2={cy + 22} stroke={SZ.nyomatek} strokeWidth="2.4" markerEnd="url(#tr-nyomatek)" />
          <Felirat x={cx + jel(Mv) * (r + 4)} y={cy + 12} meret={11} szin={SZ.nyomatek} horgony={jel(Mv) > 0 ? "start" : "end"}>
            M{vizsz} = {sz(Mv, 2)}
          </Felirat>
        </g>
      )}
      {Mf != null && jel(Mf) !== 0 && (
        <g>
          <line x1={cx + 32} y1={cy - fj * jel(Mf) * (r + 4)} x2={cx + 32} y2={cy - fj * jel(Mf) * (r + 36)} stroke={SZ.nyomatek} strokeWidth="2.4" markerEnd="url(#tr-nyomatek)" />
          <line x1={cx + 32} y1={cy - fj * jel(Mf) * (r + 4)} x2={cx + 32} y2={cy - fj * jel(Mf) * (r + 29)} stroke={SZ.nyomatek} strokeWidth="2.4" markerEnd="url(#tr-nyomatek)" />
          <Felirat x={cx + 40} y={cy - fj * jel(Mf) * (r + 20) + 4} meret={11} szin={SZ.nyomatek} horgony="start">
            M{fugg} = {sz(Mf, 2)}
          </Felirat>
        </g>
      )}
      {/* N és T szimbólumok a körben, feliratuk kívül */}
      {szimbolum(cx - 26, cy - 26, N, "N", SZ.kek, cx - r - 6, cy - r + 2, "end")}
      {szimbolum(cx - 26, cy + 26, T, "T", SZ.nyomatek, cx - r - 6, cy + r + 2, "end")}
      <Felirat x={cx} y={cy + r + (fuggLefele ? 56 : 44)} meret={10.5} vastag={false} szin="#475569">
        ⊙ a néző felé, ⊗ befelé
      </Felirat>
      <Felirat x={cx} y={cy + r + (fuggLefele ? 70 : 58)} meret={10.5} vastag={false} szin="#475569">
        {nevelo} {normal} tengely {normalBefele ? "befelé" : "a néző felé"} mutat
      </Felirat>
      {magyarazat.map((sor, i) => (
        <Felirat key={i} x={cx} y={cy + r + (fuggLefele ? 86 : 74) + i * 14} meret={10.5} vastag={false} szin="#475569">
          {sor}
        </Felirat>
      ))}
    </g>
  );
  if (csoport) return tartalom;
  return (
    <Svg w={w} h={h}>
      {tartalom}
    </Svg>
  );
}
