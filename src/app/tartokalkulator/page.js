import TartoKalkulator from "@/components/tarto/TartoKalkulator";
import { Szakasz, Kartya, Kiemelo } from "@/components/ui/Elemek";
import { M, MB } from "@/components/ui/Keplet";

export const metadata = {
  title: "Igénybevételi ábrák – kalkulátor",
  description:
    "Tetszőleges tartó normálerő-, nyíróerő- és nyomatéki ábrája: reakciók, szélsőértékek, metszetérték. A tankönyv előjelszabályaival, a nyomatéki ábra a húzott oldalon.",
};

export default function TartoKalkulatorOldal() {
  return (
    <>
      <div className="racs-hatter border-b border-petrol-800 bg-linear-to-br from-petrol-900 via-petrol-800 to-petrol-700">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-naracs-500 text-[15px] font-bold text-white">
              ⌇
            </span>
            <span className="text-[11px] font-semibold tracking-[0.2em] text-petrol-300 uppercase">
              Eszköz
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Igénybevételi ábrák
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-petrol-200">
            Válassz szerkezetet, állítsd a méreteket és a terheket, és nézd, hogyan alakul a
            normálerő, a nyíróerő és a hajlítónyomaték. A metszet-csúszkával bárhol leolvashatod
            a három igénybevételt — ugyanúgy, ahogy a feladatban is elvágnád a tartót.
          </p>
        </div>
      </div>

      <Szakasz
        id="kalkulator"
        cimke="Eszköz"
        cim="Számold ki, aztán ellenőrizd magad"
        bevezeto="A kalkulátor nem helyettesíti a kézi számolást: arra való, hogy a saját eredményedet ellenőrizd vele, és hogy ráérezz, mitől hogyan változik az ábra."
      >
        <TartoKalkulator />

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Kartya cimke="Előjelek" cim="A tankönyv szabályai szerint">
            <p className="text-[14px] leading-relaxed text-petrol-600">
              A normálerő akkor pozitív, ha <strong>húzza</strong> a keresztmetszetet. A pozitív
              nyíróerő iránya a pozitív normálerő irányának óramutató szerinti 90°-os elforgatása.
              A hajlítónyomatékot a <strong>húzott oldalra</strong> rajzoljuk, ezért az ábrából
              ránézésre látszik, hol feszül és hol nyomódik a tartó.
            </p>
          </Kartya>
          <Kartya cimke="Ellenőrzés" cim="Amit mindig érdemes megnézni">
            <p className="text-[14px] leading-relaxed text-petrol-600">
              A nyomaték ott szélsőérték, ahol a nyíróerő előjelet vált (<M>{"dM/dx = V"}</M>),
              a csuklóban a nyomaték nulla, a szabad végen pedig mindhárom igénybevétel nulla,
              ha ott nincs teher. Az oldal minden számítást ellenőriz: a terhek és a reakciók
              együtt egyensúlyi erőrendszert alkotnak.
            </p>
          </Kartya>
        </div>

        <Kiemelo tipus="tipp" cim="Mire jó ez tanuláskor">
          <p>
            Először old meg a feladatot kézzel: reakciók, majd szakaszonként az igénybevételek.
            Utána állítsd be itt ugyanazt, és hasonlítsd össze. Ha eltér, nem a végeredményt
            nézd, hanem azt, <em>hol</em> válik el a két ábra — ott van a hiba. A kalkulátor
            alján a <strong>Levezetés</strong> lépésenként mutatja, hogyan jönnek ki a reakciók
            egyensúlyi egyenletekből (elkülönítés, kijelentés, egyismeretlenes egyenletek főpontokkal,
            ellenőrzés), és szakaszonként kiírja az <em>N(x), V(x), M(x)</em> függvényeket is —
            így nemcsak az ábrát, hanem a saját levezetésedet is össze tudod vetni. A differenciális
            összefüggések ebben sokat segítenek:
          </p>
          <MB>{"\\frac{dV}{dx} = -q(x), \\qquad \\frac{dM}{dx} = V(x), \\qquad \\frac{d^2M}{dx^2} = -q(x)"}</MB>
          <p>
            Ezért lesz teher nélküli szakaszon a nyíróerő állandó és a nyomaték lineáris,
            egyenletes teher alatt a nyomaték parabola, lineárisan változó teher alatt pedig
            harmadfokú görbe.
          </p>
        </Kiemelo>
      </Szakasz>
    </>
  );
}
