"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Konfetti from "@/components/ui/Konfetti";
import { haladasOlvas, jatekEredmeny } from "@/lib/haladas";
import { hibaRogzit, hibaMegoldvaKulcs } from "@/lib/hibanaplo";

/**
 * Közös játék-keret: fejléc, pontszám, körszámláló, legjobb eredmény, konfetti.
 *
 *   cim, leiras   – fejléc
 *   pont          – aktuális pontszám (0–100 skálán értelmezve a „legjobb”-hoz)
 *   kor, osszKor  – hányadik kör / összesen
 *   kesz          – a játék véget ért (ekkor rögzítjük a legjobb eredményt)
 *   onUj          – „Új játék” gomb
 *   uzenet        – rövid visszajelzés-sáv (JSX), pl. „2,3 mm-re voltál – szép!”
 *   children      – maga a játéktér
 *
 * Hibanapló: ha a kör végén (kesz) a pont < 60, a játék (a címe alapján) a naplóba kerül;
 * 60 pont fölött a nyitott bejegyzés egy „javítást” kap.
 */
const JATEK_HATAR = 60;
export default function JatekKeret({ cim, leiras, pont = 0, kor = 1, osszKor = 5, kesz = false, onUj, uzenet, children }) {
  const utvonal = usePathname();
  const [legjobb, setLegjobb] = useState(0);
  const [konfetti, setKonfetti] = useState(false);
  const konfettiVege = useCallback(() => setKonfetti(false), []);

  useEffect(() => {
    setLegjobb(haladasOlvas()[utvonal]?.jatek || 0);
  }, [utvonal]);

  useEffect(() => {
    if (!kesz) return;
    jatekEredmeny(utvonal, pont);
    setLegjobb((l) => Math.max(l, Math.round(pont)));
    if (pont >= 80) setKonfetti(true);
    if (cim && utvonal) {
      if (pont < JATEK_HATAR) {
        hibaRogzit({ tipus: "jatek", modul: utvonal, cim, azonosito: cim, reszlet: Math.round(pont) });
      } else {
        hibaMegoldvaKulcs({ tipus: "jatek", modul: utvonal, azonosito: cim });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kesz]);

  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white shadow-sm shadow-petrol-900/[0.04]">
      <Konfetti aktiv={konfetti} onVege={konfettiVege} />
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-b border-[color:var(--keret)] bg-linear-to-r from-violet-800 to-petrol-700 px-5 py-3.5">
        <span className="rounded-md bg-naracs-500 px-2 py-0.5 text-[10.5px] font-bold tracking-[0.14em] text-white uppercase">
          Játék
        </span>
        <h3 className="text-[15px] font-semibold text-white">{cim}</h3>
        <div className="szamok ml-auto flex items-center gap-2 text-[12px] text-white">
          <span className="rounded-full bg-white/10 px-2.5 py-1">
            {Math.min(kor, osszKor)} / {osszKor}. kör
          </span>
          <span className="rounded-full bg-white/10 px-2.5 py-1 font-semibold">{Math.round(pont)} pont</span>
          {legjobb > 0 && (
            <span className="hidden rounded-full bg-naracs-500/90 px-2.5 py-1 font-semibold sm:inline">
              Legjobb: {legjobb}
            </span>
          )}
        </div>
      </div>

      <div className="px-4 py-4 sm:px-5">
        {leiras && <p className="mb-3 text-[13px] text-petrol-500">{leiras}</p>}
        {children}
        {uzenet && (
          <div className="mt-3 rounded-xl border border-petrol-200 bg-petrol-50 px-4 py-2.5 text-[13.5px] text-petrol-800">
            {uzenet}
          </div>
        )}
        {kesz && (
          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-naracs-200 bg-naracs-50 px-4 py-3">
            <span className="text-[14px] font-semibold text-petrol-900">
              Vége: {Math.round(pont)} pont.{" "}
              {pont >= 90 ? "Ez már mérnöki szem!" : pont >= 70 ? "Szép, még pár kör és ösztönös lesz." : "Játssz még — a szem is tanul."}
            </span>
            {onUj && (
              <button
                type="button"
                onClick={onUj}
                className="ml-auto rounded-lg bg-naracs-500 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-naracs-600"
              >
                Új játék ↻
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
