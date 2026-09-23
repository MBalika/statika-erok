import EpitoOldal from "@/components/epito/EpitoOldal";
import Kihivas from "@/components/epito/Kihivas";
import Szabalyok from "@/components/epito/Szabalyok";
import { Szakasz, Kartya, Kiemelo } from "@/components/ui/Elemek";
import { M } from "@/components/ui/Keplet";

export const metadata = {
  title: "Tartóépítő és ábrarajzoló",
  description:
    "Építs tetszőleges síkbeli tartót (rudak, csuklók, támaszok, terhek), rajzold meg rá a nyíróerő- és nyomatéki ábrát, a program pedig ellenőrzi és megmondja, mit rontottál el. Fokozatos segítség, korlátlan újrapróbálkozás, kihívás mód.",
};

export default function EpitoOldalLap() {
  return (
    <>
      <div className="racs-hatter border-b border-petrol-800 bg-linear-to-br from-petrol-900 via-petrol-800 to-petrol-700">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-naracs-500 text-[15px] font-bold text-white">✎</span>
            <span className="text-[11px] font-semibold tracking-[0.2em] text-petrol-300 uppercase">Gyakorló eszköz</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">Tartóépítő és ábrarajzoló</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-petrol-200">
            Itt nem a program rajzol, hanem te. Építs egy tetszőleges tartót — gerendát, Gerber-tartót, ferde rudat, keretet —, tedd fel a terheket,
            aztán rajzold meg rá a nyíróerő- és a nyomatéki ábrát a fogópontokkal. A program a számítómaggal ellenőrzi, és nem csak azt mondja meg,
            hogy rossz, hanem azt is, <em>miért</em>: melyik szabály sérült, hol, és mennyivel.
          </p>
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
            {["1 · Építés: rudak, csuklók, támaszok, terhek", "2 · Rajzolás: V, M (és N) a rúdra merőlegesen", "3 · Ellenőrzés: konkrét hibák, fokozatos segítség", "Kihívás mód: öt véletlen tartó, pontozva"].map((t) => (
              <li key={t} className="flex items-center gap-2 text-[13px] text-petrol-200">
                <span className="h-1 w-1 rounded-full bg-naracs-400" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Szakasz id="epito" cimke="Eszköz" cim="Építsd meg, rajzold meg, ellenőrizd" bevezeto="A nyomatéki és nyíróerő-ábra akkor rögzül, ha sokat rajzolod — és minden hibádról azonnal megtudod, melyik szabályt sértette. Ez a lap ehhez ad korlátlan, mindig más feladatot.">
        <Kiemelo tipus="tipp" cim="Hogyan használd">
          <ol className="list-decimal space-y-1 pl-5">
            <li><strong>Építs:</strong> a <em>Csomópont / rúd</em> eszközzel kattints a rácsra, húzz rudat egyik csomópontból a másikba (ferde is lehet). A <em>Támasz</em> eszköz csomópontra kattintva ciklikusan görgőt → csuklót → befogást tesz; a <em>Csukló</em> belső csuklót; a <em>Teher</em> csomópontra vagy rúdra erőt, rúd mentén húzva megoszló terhet. Vagy tölts be egy sablont, esetleg kérj véletlen tartót.</li>
            <li><strong>Figyeld az állapotjelzőt:</strong> csak határozott és terhelt tartót lehet rajzolni — a jelző megmondja, hány kényszer hiányzik vagy fölös.</li>
            <li><strong>Rajzolj:</strong> a program megadja a töréspontokat, te a fogópontokat húzod a helyes értékre (a rúdra merőlegesen; a pozitív érték mindhárom ábrán a tartó „+” jellel jelölt pozitív oldalán — vízszintes rúdnál alul, mint a nyomatéknál). Ahol ugrás lehet, két fogópont van. Megoszló teher alatt válassz alakot, és jelöld be a szélsőértéket, ha a V ott előjelet vált.</li>
            <li><strong>Ellenőrizz:</strong> a pont 100-ból indul, a hibák súlyuk szerint vonnak le. Ha elakadsz, a segítség három fokozatban jön — a harmadik ráúsztatja a pontos ábrát. Javíts és próbáld újra, ahányszor csak akarod.</li>
          </ol>
        </Kiemelo>

        <EpitoOldal />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 [&>*]:min-w-0">
          <Kartya cimke="Mit ellenőriz" cim="Nem csak számokat, szabályokat">
            <p className="text-[14px] leading-relaxed text-petrol-600">
              Az értékeken túl a program megnézi az ugrásokat (koncentrált erőnél a V-nek pontosan <M>{"F"}</M>-fel kell ugrania), a belső csuklót (M = 0),
              a szabad véget és a szélső támaszt, a sarkot (a nyomaték „átfordul”), az M lejtését (<M>{"dM/dx = V"}</M>), a parabola irányát és a
              szélsőérték helyét (V = 0). Minden hibához a szabály és egy tipp jár.
            </p>
          </Kartya>
          <Kartya cimke="Pontozás" cim="Hogyan számol a pont">
            <p className="text-[14px] leading-relaxed text-petrol-600">
              Egy érték jó, ha az eltérés legfeljebb 10 % (vagy az ábra maximumának 4 %-a). Súlyos hiba (előjel, ugrás, csukló, szabad vég, támasz, sarok) −12,
              a többi −6, a tolerancia közelében lévő apró eltérés −2. A segítség −5, −15, a pontos ábra megmutatása 0 pont; a megmutatott reakciók −20 %.
              A pont sosem több, mint a jól beállított fogópontok aránya (az eleve nulla értékűek fél súllyal számítanak) — az üresen hagyott rajz tehát keveset ér.
              A hibanaplóba a kihívás kerül be, ha 60 pont alatt marad.
            </p>
          </Kartya>
        </div>
      </Szakasz>

      <Szakasz id="kihivas" cimke="Játék" cim="Kihívás mód" bevezeto="Öt kör, körönként új véletlen tartó a választott nehézségen — vagy a saját, elmentett tartóid közül. A kör pontja az első ellenőrzésé.">
        <Kihivas />
      </Szakasz>

      <Szakasz id="szabalyok" cimke="Puska" cim="Az ábrarajzolás szabályai" bevezeto="Ugyanez a puska a rajzolás közben is előhúzható a rajzoló alatt.">
        <Szabalyok nyitva />
        <Kiemelo tipus="kulcs" cim="Mire jó ez tanuláskor">
          <p>
            A vizsgán nem a program rajzol. Az ábrákat úgy tanulja meg az ember, hogy sokféle tartón, sokszor megrajzolja, és minden hibájánál rájön,
            melyik szabály sérült. Itt bármilyen tartót összerakhatsz — a feladatsor tartóit is —, és azonnal megtudod, hol tévedtél. Ha egy hibatípus
            visszatér (például mindig kihagyod a szélsőértéket), építs olyan tartókat, ahol pont az dönt, és rajzold újra, amíg ösztönös nem lesz.
          </p>
        </Kiemelo>
      </Szakasz>
    </>
  );
}
