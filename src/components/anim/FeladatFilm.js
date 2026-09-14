"use client";

import { useMemo } from "react";
import { useIdovonal } from "./Idovonal";
import { MB } from "@/components/ui/Keplet";

/**
 * Lépésenként felépülő megoldás-film.
 *   cim        – a film címe
 *   hossz      – teljes hossz másodpercben
 *   fejezetek  – [{ t0, cim, szoveg, kepletek?: string[] }]  (t0: mikor kezdődik)
 *   rajz       – (t) => JSX  (a teljes SVG az adott időpillanatban)
 *   arany      – a rajz oldal aránya a rácsban (alapértelmezés: 1.25fr / 1fr)
 */
export default function FeladatFilm({ cim, hossz, fejezetek, rajz, megjegyzes }) {
  const { t, jatszik, sebesseg, setSebesseg, inditas, szunet, ujra, ugras } = useIdovonal(hossz);

  const aktiv = useMemo(() => {
    let i = 0;
    fejezetek.forEach((f, j) => {
      if (t >= f.t0 - 1e-6) i = j;
    });
    return i;
  }, [t, fejezetek]);

  const elozo = () => {
    const cel = fejezetek.filter((f) => f.t0 < t - 0.3).pop();
    ugras(cel ? cel.t0 : 0);
  };
  const kovetkezo = () => {
    const cel = fejezetek.find((f) => f.t0 > t + 1e-3);
    ugras(cel ? cel.t0 : hossz);
  };

  const Gomb = ({ onClick, children, cimke, kiemelt = false }) => (
    <button
      type="button"
      onClick={onClick}
      aria-label={cimke}
      title={cimke}
      className={`flex h-9 items-center justify-center rounded-lg px-3 text-[13px] font-semibold transition ${
        kiemelt
          ? "bg-naracs-500 text-white shadow-sm hover:bg-naracs-600"
          : "bg-white text-petrol-700 ring-1 ring-petrol-200 hover:bg-petrol-50"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white shadow-sm shadow-petrol-900/[0.04]">
      <div className="flex flex-wrap items-center gap-2 border-b border-[color:var(--keret)] bg-linear-to-r from-petrol-800 to-petrol-700 px-4 py-2.5">
        <span className="rounded-md bg-naracs-500 px-2 py-0.5 text-[10.5px] font-bold tracking-[0.14em] text-white uppercase">
          Film
        </span>
        <span className="text-[13px] font-semibold text-white">{cim}</span>
        <span className="ml-auto text-[11.5px] text-petrol-200">
          {fejezetek.length} fejezet · {Math.round(hossz)} s
        </span>
      </div>

      <div className="grid lg:grid-cols-[1.25fr_1fr]">
        {/* rajz */}
        <div className="racs-vilagos relative flex flex-col justify-center border-b border-[color:var(--keret)] p-3 lg:border-r lg:border-b-0">
          {rajz(t)}
          {!jatszik && t < 0.01 && (
            <button
              type="button"
              onClick={inditas}
              className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[1px] transition hover:bg-white/55"
              aria-label="Lejátszás"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-naracs-500 text-white shadow-lg shadow-naracs-500/30 ring-4 ring-white/80">
                <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7" fill="currentColor" aria-hidden="true">
                  <path d="M7 5v14l12-7z" />
                </svg>
              </span>
            </button>
          )}
        </div>

        {/* fejezetek */}
        <div className="finom-gorgeto max-h-[460px] overflow-y-auto p-3 sm:p-4">
          <ol className="space-y-1.5">
            {fejezetek.map((f, i) => {
              const allapot = i < aktiv ? "kesz" : i === aktiv ? "aktiv" : "var";
              return (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => ugras(f.t0)}
                    className={`w-full rounded-xl border px-3 py-2 text-left transition ${
                      allapot === "aktiv"
                        ? "border-naracs-300 bg-naracs-50"
                        : allapot === "kesz"
                          ? "border-petrol-100 bg-petrol-50/60"
                          : "border-transparent bg-transparent hover:bg-petrol-50/60"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10.5px] font-bold ${
                          allapot === "aktiv"
                            ? "bg-naracs-500 text-white"
                            : allapot === "kesz"
                              ? "bg-petrol-600 text-white"
                              : "bg-petrol-100 text-petrol-500"
                        }`}
                      >
                        {allapot === "kesz" ? "✓" : i + 1}
                      </span>
                      <span
                        className={`text-[13px] font-semibold ${
                          allapot === "var" ? "text-petrol-400" : "text-petrol-900"
                        }`}
                      >
                        {f.cim}
                      </span>
                    </div>
                    {allapot === "aktiv" && (
                      <div className="mt-2 pl-7">
                        {f.szoveg && (
                          <p className="text-[13.5px] leading-relaxed text-petrol-700">{f.szoveg}</p>
                        )}
                        {f.kepletek?.map((k, j) => (
                          <div key={j} className="szamok -my-1 text-[13px] text-petrol-900">
                            <MB>{k}</MB>
                          </div>
                        ))}
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ol>
          {megjegyzes && <p className="mt-3 text-[12px] text-petrol-500">{megjegyzes}</p>}
        </div>
      </div>

      {/* vezérlők */}
      <div className="border-t border-[color:var(--keret)] bg-petrol-50/70 px-3 py-2.5 sm:px-4">
        <div className="flex flex-wrap items-center gap-2">
          <Gomb onClick={jatszik ? szunet : inditas} cimke={jatszik ? "Szünet" : "Lejátszás"} kiemelt>
            {jatszik ? "❚❚ Szünet" : t >= hossz - 1e-6 ? "▶ Újra" : "▶ Lejátszás"}
          </Gomb>
          <Gomb onClick={elozo} cimke="Előző fejezet">⏮</Gomb>
          <Gomb onClick={kovetkezo} cimke="Következő fejezet">⏭</Gomb>
          <Gomb onClick={ujra} cimke="Elölről">↺</Gomb>
          <div className="ml-auto flex items-center gap-1 rounded-lg bg-white p-0.5 ring-1 ring-petrol-200">
            {[0.5, 1, 2].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSebesseg(s)}
                className={`rounded-md px-2 py-1 text-[11.5px] font-semibold ${
                  sebesseg === s ? "bg-petrol-700 text-white" : "text-petrol-600 hover:bg-petrol-50"
                }`}
              >
                {String(s).replace(".", ",")}×
              </button>
            ))}
          </div>
        </div>
        {/* idősáv */}
        <div className="relative mt-2.5 h-6">
          <input
            type="range"
            min={0}
            max={hossz}
            step={0.05}
            value={t}
            onChange={(e) => ugras(Number(e.target.value))}
            className="absolute inset-x-0 top-1/2 z-10 w-full -translate-y-1/2 accent-naracs-500"
            aria-label="Idővonal"
          />
          {fejezetek.map((f, i) => (
            <span
              key={i}
              className="pointer-events-none absolute top-0 h-1.5 w-0.5 rounded bg-petrol-400"
              style={{ left: `calc(${(f.t0 / hossz) * 100}% + ${8 - (f.t0 / hossz) * 16}px)` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
