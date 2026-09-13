import Link from "next/link";
import { kurzus, modulok } from "@/lib/oldalterkep";

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-[color:var(--keret)] bg-petrol-950 text-petrol-200">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="text-[15px] font-semibold tracking-[0.14em] text-white uppercase">
            {kurzus.cim}
          </p>
          <p className="mt-1 text-[13px] text-petrol-300">{kurzus.alcim}</p>
          <p className="mt-4 max-w-sm text-[12.5px] leading-relaxed text-petrol-300/80">
            Interaktív tananyag a statika első heteihez. A kidolgozott feladatok
            a gyakorlat hivatalos megoldássorát követik, a gyakorlófeladatok
            minden indításkor új számokkal generálódnak.
          </p>
        </div>

        <div>
          <p className="text-[11px] font-semibold tracking-wider text-petrol-400 uppercase">
            Modulok
          </p>
          <ul className="mt-3 space-y-1.5">
            {modulok.map((m) => (
              <li key={m.slug}>
                <Link
                  href={m.slug}
                  className="text-[13px] text-petrol-200 transition hover:text-naracs-300"
                >
                  {m.szam !== null ? `${m.szam}. ` : ""}
                  {m.rovid}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[11px] font-semibold tracking-wider text-petrol-400 uppercase">
            Háttéranyag
          </p>
          <p className="mt-3 text-[13px] leading-relaxed text-petrol-300">
            {kurzus.tankonyv}
          </p>
          <p className="mt-3 text-[12px] leading-relaxed text-petrol-400">
            {kurzus.tanszek}
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-4 text-[11.5px] text-petrol-400 sm:px-6">
          Oktatási segédanyag · a tananyag a tankönyvet és a gyakorlatot
          kiegészíti, nem helyettesíti.
        </div>
      </div>
    </footer>
  );
}
