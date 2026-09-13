import Link from "next/link";
import { Szakasz, Kartya, Kiemelo, AbraKeret, Cimke } from "@/components/ui/Elemek";
import { M, MB } from "@/components/ui/Keplet";
import { modulok, kurzus } from "@/lib/oldalterkep";

export const metadata = {
  title: "Erők és erőrendszerek – interaktív tananyag",
};

export default function Kezdolap() {
  return (
    <>
      {/* ---------- Nyitókép ---------- */}
      <div className="racs-hatter relative overflow-hidden bg-linear-to-br from-petrol-950 via-petrol-800 to-petrol-600">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <p className="text-[11.5px] font-semibold tracking-[0.2em] text-naracs-300 uppercase">
              {kurzus.targy}
            </p>
            <h1 className="mt-3 text-4xl leading-[1.1] font-bold tracking-tight text-white sm:text-5xl">
              Erők és erőrendszerek
            </h1>
            <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-petrol-100">
              A statika első heteinek anyaga egy helyen: mozgatható ábrákkal
              magyarázott elmélet, a gyakorlat feladatai lépésről lépésre
              kidolgozva, kalkulátorok a számoláshoz és végtelen sok
              gyakorlófeladat, minden indításkor új számokkal.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/vektorok"
                className="rounded-xl bg-naracs-500 px-5 py-3 text-[14px] font-semibold text-white shadow-lg shadow-naracs-900/20 transition hover:bg-naracs-600"
              >
                Kezdés az 1. modullal →
              </Link>
              <a
                href="#utmutato"
                className="rounded-xl border border-white/25 px-5 py-3 text-[14px] font-semibold text-white transition hover:bg-white/10"
              >
                Hogyan használd?
              </a>
            </div>
          </div>

          <div className="hidden lg:block">
            <NyitoAbra />
          </div>
        </div>
      </div>

      {/* ---------- Útmutató ---------- */}
      <Szakasz
        id="utmutato"
        cimke="Bevezetés"
        cim="Útmutató ehhez az anyaghoz"
        bevezeto="Minden modul ugyanazt a négy lépést járja végig. A sorrend nem véletlen: a megértés az ábráknál kezdődik, és csak a gyakorlásnál rögzül."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              szam: "1",
              cim: "Elmélet",
              szoveg:
                "Rövid, ábrás magyarázat. A legtöbb ábrát meg tudod mozgatni: húzd a nyilakat, állítsd a csúszkákat, és nézd, mi változik.",
            },
            {
              szam: "2",
              cim: "Kidolgozott feladatok",
              szoveg:
                "A gyakorlat hivatalos feladatai, lépésenként feltárható megoldással. Először próbáld meg magad, és csak utána nyisd ki a lépéseket.",
            },
            {
              szam: "3",
              cim: "Kalkulátor",
              szoveg:
                "Ugyanaz a számítás tetszőleges adatokkal. Arra jó, hogy a saját házi feladatod eredményét ellenőrizd, vagy ráérezz az összefüggésekre.",
            },
            {
              szam: "4",
              cim: "Gyakorlás",
              szoveg:
                "Véletlen számokkal generált feladatok azonnali javítással. Addig nyomd az „új feladat” gombot, amíg magabiztos nem leszel.",
            },
          ].map((l) => (
            <Kartya key={l.szam}>
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-petrol-800 text-[14px] font-bold text-white">
                {l.szam}
              </span>
              <h3 className="mt-3 text-[15px] font-semibold text-petrol-900">
                {l.cim}
              </h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-petrol-600">
                {l.szoveg}
              </p>
            </Kartya>
          ))}
        </div>

        <Kiemelo tipus="tipp" cim="Hogyan tanulj ebből">
          <p>
            A statika nem képletgyűjtemény, hanem néhány gondolat sokszori
            alkalmazása. Ha egy feladatnál elakadsz, ne a képletet keresd, hanem
            azt kérdezd meg magadtól: <em>mit is akarok kiszámolni, és milyen
            egyensúlyi vagy egyenértékűségi kijelentést tudok felírni?</em> A
            kidolgozott feladatokban ez mindig az első lépés.
          </p>
        </Kiemelo>
      </Szakasz>

      {/* ---------- Jelölések ---------- */}
      <Szakasz
        id="jelolesek"
        cimke="Alapok"
        cim="Jelölésrendszer"
        bevezeto="Ezeket a jelöléseket használjuk végig az egész anyagban, ugyanúgy, ahogy a tankönyv és a gyakorlat."
        className="bg-white"
      >
        <div className="overflow-hidden rounded-2xl border border-[color:var(--keret)]">
          <table className="w-full text-[14px]">
            <thead className="bg-petrol-50 text-[11px] tracking-wider text-petrol-500 uppercase">
              <tr>
                <th className="px-4 py-2.5 text-left font-semibold">Jelölés</th>
                <th className="px-4 py-2.5 text-left font-semibold">Jelentés</th>
                <th className="hidden px-4 py-2.5 text-left font-semibold sm:table-cell">
                  Megjegyzés
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {[
                [
                  "\\underline{F}",
                  "Erővektor",
                  "Aláhúzással jelöljük, hogy vektorról van szó.",
                ],
                [
                  "F",
                  "Az erő nagysága",
                  "Aláhúzás nélkül mindig skalár, sosem negatív.",
                ],
                [
                  "F_x,\\ F_y,\\ F_z",
                  "Az erő komponensei",
                  "Előjeles számok: a tengely iránya dönti el.",
                ],
                [
                  "\\alpha",
                  "Irányszög",
                  "Az x tengelytől az óramutatóval ellentétesen mérve.",
                ],
                ["\\underline{R}", "Eredő", "Az egész erőrendszert helyettesíti."],
                [
                  "M^{(P)}",
                  "Nyomaték a P pontra",
                  "Síkban előjeles skalár, térben vektor.",
                ],
                [
                  "(\\underline{F}_1,\\ \\underline{F}_2) \\doteq \\underline{R}",
                  "Egyenértékűségi kijelentés",
                  "„Az erőrendszer helyettesíthető az eredővel.”",
                ],
                ["p", "Megoszló teher intenzitása", "Mértékegysége kN/m."],
              ].map(([jel, jelentes, megj]) => (
                <tr key={jel} className="border-t border-petrol-100">
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <M>{jel}</M>
                  </td>
                  <td className="px-4 py-2.5 text-petrol-800">{jelentes}</td>
                  <td className="hidden px-4 py-2.5 text-[13px] text-petrol-500 sm:table-cell">
                    {megj}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Kiemelo tipus="figyelem" cim="A leggyakoribb félreértés">
          <p>
            Az <M>{"F"}</M> nagyság és az <M>{"F_x"}</M> komponens két külön
            dolog. A nagyság mindig pozitív, a komponens viszont lehet negatív is
            — az mondja meg, hogy a tengely iránya szerint merre mutat. Ha egy
            feladatban azt kapod, hogy <M>{"F_x = -86{,}04\\ \\text{N}"}</M>, az
            nem hiba: azt jelenti, hogy az erő balra mutat.
          </p>
        </Kiemelo>
      </Szakasz>

      {/* ---------- Koordinátarendszer ---------- */}
      <Szakasz
        id="koordinata"
        cimke="Alapok"
        cim="Koordináta-rendszer"
        bevezeto="A statikában két elrendezéssel fogsz találkozni, és fontos, hogy mindig tudd, éppen melyikben dolgozol."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <Kartya cimke="Síkbeli feladatok" cim="x jobbra, y felfelé">
            <p className="text-[14px] leading-relaxed text-petrol-600">
              Ezt használjuk erőrendszereknél, vektorműveleteknél. A szögeket az
              x tengelytől az óramutató járásával ellentétesen mérjük, a pozitív
              nyomaték ebben a rendszerben az óramutatóval ellentétes forgatás.
            </p>
            <div className="mt-4 flex justify-center">
              <KoordAbra tipus="sik" />
            </div>
          </Kartya>

          <Kartya cimke="Tartók, igénybevételek" cim="x jobbra, z lefelé">
            <p className="text-[14px] leading-relaxed text-petrol-600">
              Tartóknál a z tengely lefelé mutat, mert a terhek túlnyomó része
              lefelé hat — így a gyakori terhelés pozitív előjelet kap. A
              megoszló erőknél már ezt fogod látni.
            </p>
            <div className="mt-4 flex justify-center">
              <KoordAbra tipus="tarto" />
            </div>
          </Kartya>
        </div>
      </Szakasz>

      {/* ---------- Mértékegységek ---------- */}
      <Szakasz
        id="mertekegysegek"
        cimke="Alapok"
        cim="Mértékegységek és számítási pontosság"
        className="bg-white"
      >
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <div className="proza text-[14.5px] leading-relaxed text-petrol-700">
              <p>
                Az erő egysége a newton (N), a gyakorlatban leginkább a
                kilonewton (kN). A nyomaték egysége ennek megfelelően Nm vagy
                kNm, a megoszló teher intenzitásáé kN/m. Egy átlagos ember súlya
                nagyjából 0,8 kN, egy személyautóé 15 kN körül van — érdemes
                ilyen viszonyítási pontokat fejben tartani, mert azonnal
                kiszűrik a nagyságrendi hibákat.
              </p>
              <p>
                A számítás során végig négy értékes jeggyel dolgozunk, és csak a
                végeredményt kerekítjük. Ha közben kerekítesz, a hiba
                felhalmozódik: egy háromlépéses feladatnál ez már a második
                tizedesjegyet is elronthatja.
              </p>
            </div>

            <Kiemelo tipus="kulcs" cim="Ökölszabály">
              <p>
                A részeredményeket hagyd a számológép memóriájában, és csak a
                válasznál kerekíts. A leadott eredménynél mindig írd ki a
                mértékegységet is — nélküle a szám önmagában értelmetlen.
              </p>
            </Kiemelo>
          </div>

          <Kartya cim="Átváltások, amik folyton kellenek">
            <div className="space-y-3">
              {[
                ["1\\ \\text{kN} = 1000\\ \\text{N}", "erő"],
                ["1\\ \\text{kNm} = 1000\\ \\text{Nm}", "nyomaték"],
                [
                  "1\\ \\text{kN/m} \\cdot \\text{m} = 1\\ \\text{kN}",
                  "megoszló teher eredője",
                ],
                [
                  "G = m\\,g,\\quad g = 9{,}81\\ \\text{m/s}^2",
                  "tömegből súlyerő",
                ],
                [
                  "G = V \\rho\\, g = V \\gamma",
                  "térfogatból súly (γ: térfogatsúly)",
                ],
              ].map(([k, cimke]) => (
                <div
                  key={k}
                  className="rounded-lg border border-petrol-100 bg-petrol-50/60 px-3.5 py-2.5"
                >
                  <MB className="!my-1">{k}</MB>
                  <p className="text-[12px] text-petrol-500">{cimke}</p>
                </div>
              ))}
            </div>
          </Kartya>
        </div>
      </Szakasz>

      {/* ---------- Modulok ---------- */}
      <Szakasz
        id="modulok"
        cimke="Tartalom"
        cim="A négy modul"
        bevezeto="Az anyag a gyakorlat felépítését követi. Érdemes sorban haladni, mert minden modul az előzőre épít."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {modulok
            .filter((m) => m.szam !== null)
            .map((m) => (
              <Link
                key={m.slug}
                href={m.slug}
                className="group relative overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white p-5 transition hover:border-petrol-300 hover:shadow-lg hover:shadow-petrol-900/5"
              >
                <div className="flex items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-linear-to-br from-petrol-700 to-petrol-500 text-[18px] font-bold text-white">
                    {m.szam}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-[16px] font-semibold text-petrol-900">
                        {m.cim}
                      </h3>
                      {m.kesz ? (
                        <Cimke szin="zold">elérhető</Cimke>
                      ) : (
                        <Cimke>hamarosan</Cimke>
                      )}
                    </div>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-petrol-600">
                      {m.leiras}
                    </p>
                  </div>
                </div>
                <span className="absolute right-5 bottom-4 text-[13px] font-semibold text-naracs-600 opacity-0 transition group-hover:opacity-100">
                  Megnyitás →
                </span>
              </Link>
            ))}
        </div>
      </Szakasz>
    </>
  );
}

/* ---------------- ábrák ---------------- */

function NyitoAbra() {
  return (
    <svg viewBox="0 0 420 320" className="abra w-full" aria-hidden="true">
      <defs>
        <marker
          id="ny-feher"
          viewBox="0 0 10 10"
          refX="8.5"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 9 5 L 0 9 z" fill="#fdba74" />
        </marker>
        <marker
          id="ny-eredo2"
          viewBox="0 0 10 10"
          refX="8.5"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 9 5 L 0 9 z" fill="#ffffff" />
        </marker>
      </defs>

      {/* tengelyek */}
      <line x1="60" y1="250" x2="380" y2="250" stroke="rgba(255,255,255,.3)" strokeWidth="1.5" />
      <line x1="60" y1="250" x2="60" y2="40" stroke="rgba(255,255,255,.3)" strokeWidth="1.5" />

      {/* láncszabály */}
      <line x1="60" y1="250" x2="185" y2="185" stroke="#fdba74" strokeWidth="3" strokeLinecap="round" markerEnd="url(#ny-feher)" />
      <line x1="185" y1="185" x2="265" y2="205" stroke="#fdba74" strokeWidth="3" strokeLinecap="round" markerEnd="url(#ny-feher)" />
      <line x1="265" y1="205" x2="320" y2="105" stroke="#fdba74" strokeWidth="3" strokeLinecap="round" markerEnd="url(#ny-feher)" />

      {/* eredő */}
      <line x1="60" y1="250" x2="320" y2="105" stroke="#ffffff" strokeWidth="3.6" strokeLinecap="round" markerEnd="url(#ny-eredo2)" strokeDasharray="0" />

      <text x="118" y="205" fill="#fed7aa" fontSize="13" fontWeight="600">F₁</text>
      <text x="222" y="210" fill="#fed7aa" fontSize="13" fontWeight="600">F₂</text>
      <text x="300" y="163" fill="#fed7aa" fontSize="13" fontWeight="600">F₃</text>
      <text x="196" y="163" fill="#ffffff" fontSize="15" fontWeight="700">R</text>
    </svg>
  );
}

function KoordAbra({ tipus }) {
  const tarto = tipus === "tarto";
  return (
    <svg viewBox="0 0 220 170" className="abra w-full max-w-[220px]">
      <defs>
        <marker
          id={`k-${tipus}`}
          viewBox="0 0 10 10"
          refX="8.5"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 9 5 L 0 9 z" fill="#475569" />
        </marker>
      </defs>
      <line
        x1="55"
        y1={tarto ? 55 : 120}
        x2="195"
        y2={tarto ? 55 : 120}
        stroke="#475569"
        strokeWidth="1.6"
        markerEnd={`url(#k-${tipus})`}
      />
      <line
        x1="55"
        y1={tarto ? 55 : 120}
        x2="55"
        y2={tarto ? 150 : 25}
        stroke="#475569"
        strokeWidth="1.6"
        markerEnd={`url(#k-${tipus})`}
      />
      <text x="200" y={tarto ? 60 : 125} fontSize="14" fontStyle="italic" fill="#1d3c48">
        x
      </text>
      <text x="44" y={tarto ? 165 : 22} fontSize="14" fontStyle="italic" fill="#1d3c48">
        {tarto ? "z" : "y"}
      </text>

      {tarto ? (
        <>
          <line x1="80" y1="55" x2="80" y2="95" stroke="#e2590a" strokeWidth="2.4" markerEnd={`url(#k-${tipus})`} />
          <line x1="110" y1="55" x2="110" y2="95" stroke="#e2590a" strokeWidth="2.4" markerEnd={`url(#k-${tipus})`} />
          <line x1="140" y1="55" x2="140" y2="95" stroke="#e2590a" strokeWidth="2.4" markerEnd={`url(#k-${tipus})`} />
          <text x="150" y="112" fontSize="12" fill="#e2590a" fontWeight="600">
            pozitív teher
          </text>
        </>
      ) : (
        <>
          <line x1="55" y1="120" x2="150" y2="62" stroke="#e2590a" strokeWidth="2.8" markerEnd={`url(#k-${tipus})`} />
          <path
            d="M 90 120 A 35 35 0 0 0 76 100"
            fill="none"
            stroke="#64748b"
            strokeWidth="1.2"
          />
          <text x="96" y="110" fontSize="12" fill="#64748b">
            α
          </text>
          <text x="152" y="58" fontSize="13" fill="#e2590a" fontWeight="600">
            F
          </text>
        </>
      )}
    </svg>
  );
}
