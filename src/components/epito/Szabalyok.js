"use client";

import { useState } from "react";
import { M, MB } from "@/components/ui/Keplet";

/** Összecsukható puska: az ábrarajzolás szabályai (a rajzolás közben is előhúzható). */
export default function Szabalyok({ nyitva: kezdoNyitva = false, tomor = false }) {
  const [nyitva, setNyitva] = useState(kezdoNyitva);
  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-[color:var(--keret)] bg-white">
      <button type="button" onClick={() => setNyitva((n) => !n)} className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[13px] font-semibold text-petrol-800 hover:bg-petrol-50" aria-expanded={nyitva}>
        <span className={`inline-block transition-transform ${nyitva ? "rotate-90" : ""}`}>▸</span>
        Az ábrarajzolás szabályai — puska
        <span className="ml-auto text-[11px] font-normal text-petrol-500">{nyitva ? "becsuk" : "kinyit"}</span>
      </button>
      {nyitva && (
        <div className={`grid gap-3 border-t border-[color:var(--keret)] px-4 py-4 text-[13.5px] leading-relaxed text-petrol-700 ${tomor ? "" : "sm:grid-cols-2"} [&>*]:min-w-0`}>
          <div>
            <p className="mb-1 text-[10.5px] font-bold tracking-[0.14em] text-petrol-500 uppercase">A három differenciális összefüggés</p>
            <MB>{"\\frac{dV}{dx} = -q(x), \\qquad \\frac{dM}{dx} = V(x), \\qquad \\frac{d^2M}{dx^2} = -q(x)"}</MB>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li><strong>Terheletlen szakasz:</strong> V állandó (vízszintes), M egyenes — a lejtése a V.</li>
              <li><strong>Egyenletes megoszló teher:</strong> V ferde egyenes, M parabola, amely <em>a teher irányába domborodik</em>.</li>
              <li><strong>Szélsőérték:</strong> ahol V = 0 (előjelet vált), ott M szélsőértékű: <M>{"x_0 = V_1 / q"}</M>, és <M>{"M_{max} = M_1 + V_1 x_0 / 2"}</M>.</li>
            </ul>
          </div>
          <div>
            <p className="mb-1 text-[10.5px] font-bold tracking-[0.14em] text-petrol-500 uppercase">Ugrások, csukló, végek</p>
            <ul className="list-disc space-y-1 pl-5">
              <li><strong>Koncentrált erő</strong> (<M>{"F"}</M>): a V pontosan <M>{"F"}</M>-fel ugrik, az erő irányában; az M-nek ott törése van.</li>
              <li><strong>Koncentrált nyomaték</strong> (<M>{"M_0"}</M>): az M ugrik <M>{"M_0"}</M>-lal, a V nem változik.</li>
              <li><strong>Belső csukló:</strong> M = 0 (a V és az N átmegy rajta).</li>
              <li><strong>Szabad vég:</strong> teher nélkül N = V = M = 0; ha a végen erő/nyomaték hat, pontosan azzal egyenlő.</li>
              <li><strong>Csuklós/görgős szélső támasz:</strong> M = 0; <strong>befogás:</strong> M = a befogási nyomaték.</li>
              <li><strong>Merev sarok:</strong> a két rúdvég nyomatéka egyenlő — az M-ábra „átfordul” a sarkon.</li>
            </ul>
          </div>
          <div className={tomor ? "" : "sm:col-span-2"}>
            <p className="mb-1 text-[10.5px] font-bold tracking-[0.14em] text-petrol-500 uppercase">Előjelek (tankönyv 8.1.2.2)</p>
            <p>
              <M>{"N"}</M> pozitív, ha húz. A pozitív <M>{"V"}</M> iránya a pozitív <M>{"N"}</M> irányának óramutató szerinti 90°-os elforgatása — vízszintes, balról jobbra haladó rúdon: <em>a bal oldali rész felfelé mutató erőinek összege</em>. Az <M>{"M"}</M>-et a <em>húzott oldalra</em> rajzoljuk: vízszintes rúdnál alul pozitív; ferde és függőleges rúdnál a kezdőponttól a végpont felé haladva a jobb oldal a pozitív. Az ábrákat mindig <em>a rúdra merőlegesen</em> mérjük fel.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
