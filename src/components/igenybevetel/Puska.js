import { M, MB } from "@/components/ui/Keplet";

/** A 9. modul (igénybevételi ábrák) puska-lapja: a Doboz komponenst a puska-oldal adja. */
export default function Puska({ Doboz }) {
  return (
    <>
      <Doboz cim="Igénybevételek és előjelük (8.1.2)">
        <p>
          A keresztmetszet belső erőrendszere: <strong>N</strong> normálerő (tengelyirányú), <strong>V</strong> nyíróerő (a keresztmetszet síkjában), <strong>M</strong> hajlítónyomaték. Bal és jobb oldali részre azonos előjel és
          nagyság → nincs b/j index.
        </p>
        <ul className="list-disc space-y-0.5 pl-4">
          <li><M>{"N > 0"}</M>: kifelé mutat, <strong>húz</strong>.</li>
          <li><M>{"V > 0"}</M>: a pozitív <M>{"N"}</M> irányát az óramutató <strong>szerint</strong> 90°-kal elforgatva (bal részen lefelé, jobb részen felfelé).</li>
          <li><M>{"M > 0"}</M>: a kijelölt pozitív oldal (vízszintesnél az <strong>alsó</strong>) húzott; az ábra <strong>a húzott oldalra</strong>.</li>
        </ul>
        <p>
          <strong>A rajz oldala (8.3.2):</strong> mindhárom ábrát a tartó ugyanazon pozitív oldalára rajzoljuk — arra, amelyiket a nyomaték pozitív definíciójához választottunk (vízszintes tartónál alulra). Így a pozitív{" "}
          <M>{"N"}</M>, <M>{"V"}</M> és <M>{"M"}</M> mindig a tartó alatt, a negatív fölötte van (8.9. ábra); a „+” jel a tengely alatt.
        </p>
        <p>Bal rész, óramutató szerint pozitív egyenlet: <M>{"\\Mj{K} +A_y x_K - F(x_K - x_F) - M_K = 0"}</M>; <M>{"\\Fy A_y - F - V_K = 0"}</M>; <M>{"\\Fx A_x + F_x + N_K = 0"}</M>.</p>
      </Doboz>
      <Doboz cim="Teher → V → M alak (8.3.3 táblázat)">
        <table className="w-full text-[11.5px]">
          <thead><tr className="text-left"><th>szakasz terhe</th><th>N</th><th>V</th><th>M</th></tr></thead>
          <tbody>
            <tr><td>terheletlen</td><td>áll.</td><td>áll.</td><td>lineáris (áll., ha V = 0)</td></tr>
            <tr><td>tengelyirányú egyenletes</td><td>lineáris</td><td>áll.</td><td>lineáris</td></tr>
            <tr><td>merőleges egyenletes</td><td>áll.</td><td>lineáris</td><td>parabola (2.)</td></tr>
            <tr><td>ferde egyenletes</td><td>lineáris</td><td>lineáris</td><td>parabola (2.)</td></tr>
            <tr><td>lineárisan változó</td><td>áll.</td><td>parabola (2.)</td><td>3. fokú</td></tr>
          </tbody>
        </table>
        <MB>{"\\frac{\\mathrm{d}N}{\\mathrm{d}x} = -p,\\quad \\frac{\\mathrm{d}V}{\\mathrm{d}x} = -q,\\quad \\frac{\\mathrm{d}M}{\\mathrm{d}x} = V,\\quad \\frac{\\mathrm{d}^2M}{\\mathrm{d}x^2} = -q"}</MB>
        <p>Az M szélsőértéke ott, ahol <M>{"V = 0"}</M>. A parabola a teher irányába „lóg” (kötélalak), belógása a húrtól <M>{"q\\ell^2/8"}</M>.</p>
      </Doboz>
      <Doboz cim="Töréspont-szabályok (koncentrált hatások)">
        <ul className="list-disc space-y-0.5 pl-4">
          <li><strong>Merőleges erő</strong>: V ugrik az erővel, M <strong>törik</strong> (a törés konvex oldala az erő nyilának konvex oldalán).</li>
          <li><strong>Tengelyirányú erő</strong>: N ugrik, V és M változatlan.</li>
          <li><strong>Ferde erő</strong>: N és V ugrik, M törik.</li>
          <li><strong>Koncentrált nyomaték</strong>: M ugrik <M>{"M_0"}</M>-lal, V nem változik → az érintők párhuzamosak. Balról jobbra: ↶ nyomaték <strong>csökkenti</strong>, ↷ növeli az M-et.</li>
          <li><strong>Tartóvég</strong>: erő (reakció) nélkül V = 0, nyomaték nélkül M = 0. Görgő/csukló: M = 0, V = reakció. Befogás: M ≠ 0.</li>
          <li><strong>Belső csukló</strong>: M = 0 (kivéve, ha közvetlenül mellette koncentrált nyomaték hat); V ≠ 0.</li>
        </ul>
        <p>Szakaszhatár még: megoszló teher kezdete/vége/törése, a tengely törése, elágazás.</p>
      </Doboz>
      <Doboz cim="Alapképletek (fejből)">
        <MB>{"\\text{kéttámaszú, } p:\\ A = B = \\tfrac{pL}{2},\\ M_{\\max} = \\tfrac{pL^2}{8}\\ (\\text{középen, } V = 0)"}</MB>
        <MB>{"\\text{kéttámaszú, } F \\text{ középen}:\\ A = B = \\tfrac{F}{2},\\ M_{\\max} = \\tfrac{FL}{4};\\quad F \\text{ az } a\\text{-nál}:\\ M = \\tfrac{Fab}{L}"}</MB>
        <MB>{"\\text{konzol, } F \\text{ a végén}:\\ M_A = -FL,\\ V = F;\\qquad \\text{konzol, } p:\\ M_A = -\\tfrac{pL^2}{2},\\ V_A = pL"}</MB>
        <p>Két szimmetrikus F (a-ra a támaszoktól): közöttük <M>{"V = 0"}</M>, <M>{"M = Fa"}</M> állandó. Konzol: felül húzott, az ábra fent.</p>
      </Doboz>
      <Doboz cim="Ferde tengelyű tartó (8.4.3)">
        <p>
          Reakciók a szokásos módon (vízszintes/függőleges karok). <M>{"N"}</M>, <M>{"V"}</M>: a bal rész eredőjét (<M>{"R"}</M>, felfelé +) bontsd a tengely irányába és arra merőlegesen:
        </p>
        <MB>{"N = -R\\sin\\alpha,\\qquad V = R\\cos\\alpha,\\qquad M = \\text{vízszintes karokkal, mint vízszintes tartón}"}</MB>
        <p>
          Függőleges teher ferde tartón <strong>normálerőt is ad</strong>. Megoszló teher: hossz mentén vagy vetületre? (<M>{"q_\\perp = p\\cos\\alpha"}</M>, parabola-belógás <M>{"q_\\perp\\ell^2/8"}</M> a ferde hosszal.) Az N és V ábra
          a rúdra merőlegesen mérve, az M-mel azonos (pozitív) oldalra.
        </p>
      </Doboz>
      <Doboz cim="Tört tengely, sarok, elágazás (8.4.3–8.4.4)">
        <p>
          A törés az N és V ábrán <strong>mindig szakaszhatár</strong> (az irányuk változik). A sarokban (koncentrált nyomaték nélkül) a két csonk nyomatéka <strong>egyenlő nagyságú</strong>, ellentétesen forgat → az ábra
          <strong> befordul</strong>: mindkét oldalon a külső, vagy mindkét oldalon a belső oldalon. Alul befogott oszlop: felülről számolj; a sarok alatti oszlopban <M>{"N"}</M> = a gerenda függőleges terhe (nyomott),{" "}
          <M>{"V"}</M> = a vízszintes erők. Elágazásnál a csomópontra rajzolt félköríves nyilak nyomatéki egyensúlya az ellenőrzés (8.12. ábra).
        </p>
      </Doboz>
      <Doboz cim="Gerber-tartó és összetett tartó (8.4.5–8.4.6)">
        <ol className="list-decimal space-y-0.5 pl-4">
          <li>Befüggesztett rész: kéttámaszú tartó a csuklón és a görgőn → görgőreakció, csuklóerő.</li>
          <li>A csuklóerő <strong>ellentettje</strong> teherként a fix rész konzolvégén → egyszerű tartó.</li>
          <li>Ábrák egy közös rajzba, azonos léptékkel: a csuklónál folytonosan csatlakoznak, az M a csuklón <strong>átmegy a tengelyen</strong>.</li>
          <li>Ellenőrzés: balról a csuklóig felírt nyomaték = 0; a támasz fölött M negatív (felül húzott).</li>
        </ol>
        <p>Bármely keresztmetszet legalább négyféleképp számolható (testek × oldalak) — válaszd a legegyszerűbbet, a többi ellenőrzés.</p>
      </Doboz>
      <Doboz cim="Tipikus hibák" szeles>
        <ul className="list-disc space-y-0.5 pl-4">
          <li>V előjel: „felfelé pozitív” — nem: a bal részen a <em>felfelé</em> mutató erők adnak +V-t, a jobb részen a lefelé mutatók. És a rajzon a +V nem fölé, hanem a tartó <em>alá</em> kerül, ugyanoda, ahová a +M.</li>
          <li>A bal részről az <strong>A reakció lemarad</strong> („csak a terheket írom”), vagy a megoszló teherből a K-ig eső darab hiányzik.</li>
          <li>Megoszló teher alatt egyenes M (parabola helyett), vagy a parabola a rossz irányba domborodik — a kötélalak a teher irányába lóg.</li>
          <li>Koncentrált nyomatéknál az ugrás iránya tippelve — számold a másik oldalról is.</li>
          <li>Gerber: M ≠ 0 a csuklóban; a befüggesztett részt konzolként kezelni.</li>
          <li>Konzol ábrája a rossz végről indul: a szabad végen V = M = 0 (ha nincs ott koncentrált hatás).</li>
          <li>Ferde tartón N = 0 „mert csak függőleges a teher” — nem: <M>{"N = -R\\sin\\alpha"}</M>.</li>
          <li>Sarokban a két csonk nyomatéka különböző, vagy az ábra átmegy a tengelyen a sarkon.</li>
          <li>Az M ábra a nyomott oldalra rajzolva, vagy az N és V ábra a nyomatékkal ellentétes oldalra; a vizsgán a helyes N, V, M ábra együtt ér pontot — részpont nincs.</li>
        </ul>
      </Doboz>
    </>
  );
}
