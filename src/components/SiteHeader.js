"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { kurzus, modulok, extraOldalak } from "@/lib/oldalterkep";
import SotetKapcsolo from "@/components/SotetKapcsolo";

function Logo({ className = "" }) {
  // Erőháromszög: két komponens és az eredőjük – az egész anyag alapgondolata
  return (
    <svg viewBox="0 0 44 40" className={className} aria-hidden="true">
      <path
        d="M6 34 H36"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path
        d="M6 34 V10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path
        d="M6 34 L33 12"
        stroke="var(--color-naracs-400)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M33 12 l-6.5 0.6 l3.6 3.9 z"
        fill="var(--color-naracs-400)"
        stroke="var(--color-naracs-400)"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Nyilacska({ nyitva }) {
  return (
    <svg
      viewBox="0 0 12 12"
      className={`h-2.5 w-2.5 transition-transform duration-200 ${
        nyitva ? "rotate-180" : ""
      }`}
      aria-hidden="true"
    >
      <path
        d="M2 4.5 L6 8.5 L10 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function SiteHeader() {
  const utvonal = usePathname();
  const [mobilNyitva, setMobilNyitva] = useState(false);
  const [nyitottFul, setNyitottFul] = useState(null);

  return (
    <header className="sticky top-0 z-50">
      {/* Felső, sötét sáv */}
      <div className="racs-hatter bg-linear-to-r from-petrol-950 via-petrol-800 to-petrol-700">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 text-white">
            <Logo className="h-7 w-7 shrink-0 text-white" />
            <span className="text-[16px] font-semibold tracking-[0.16em] uppercase">
              {kurzus.cim}
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setMobilNyitva((v) => !v)}
            className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 text-white transition hover:bg-white/10 lg:hidden"
            aria-label="Menü"
            aria-expanded={mobilNyitva}
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true">
              {mobilNyitva ? (
                <path
                  d="M5 5 L15 15 M15 5 L5 15"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M3 6 H17 M3 10 H17 M3 14 H17"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Alsó, világos navigációs sáv – asztali nézet */}
      <nav className="hidden border-b border-[color:var(--keret)] bg-white/95 backdrop-blur lg:block">
        <div className="mx-auto flex max-w-7xl items-stretch gap-1 px-4 sm:px-6">
          {modulok.map((m) => {
            const aktiv =
              m.slug === "/" ? utvonal === "/" : utvonal.startsWith(m.slug);
            return (
              <div
                key={m.slug}
                className="relative"
                onMouseEnter={() => setNyitottFul(m.slug)}
                onMouseLeave={() => setNyitottFul(null)}
              >
                <Link
                  href={m.slug}
                  className={`flex h-12 items-center gap-1.5 border-b-2 px-2 text-[13.5px] font-medium whitespace-nowrap transition 2xl:px-3 ${
                    aktiv
                      ? "border-naracs-500 text-petrol-900"
                      : "border-transparent text-petrol-600 hover:border-petrol-200 hover:text-petrol-900"
                  }`}
                >
                  {m.szam !== null && (
                    <span
                      className={`grid h-5 w-5 place-items-center rounded text-[11px] font-bold ${
                        aktiv
                          ? "bg-naracs-500 text-white"
                          : "bg-petrol-100 text-petrol-600"
                      }`}
                    >
                      {m.szam}
                    </span>
                  )}
                  <span className="hidden 2xl:inline">{m.rovid}</span>
                  <span className="2xl:hidden">{m.menu ?? m.rovid}</span>
                  {!m.kesz && (
                    <span className="rounded bg-petrol-100 px-1.5 py-0.5 text-[9.5px] font-semibold tracking-wide text-petrol-500 uppercase">
                      hamarosan
                    </span>
                  )}
                  <Nyilacska nyitva={nyitottFul === m.slug} />
                </Link>

                {nyitottFul === m.slug && (
                  <div className="absolute top-full left-0 w-72 rounded-b-xl border border-t-0 border-[color:var(--keret)] bg-white p-2 shadow-xl shadow-petrol-900/5">
                    <p className="px-2.5 pt-1.5 pb-2 text-[11.5px] leading-snug text-petrol-500">
                      {m.leiras}
                    </p>
                    {m.szakaszok.map((sz) => (
                      <Link
                        key={sz.id}
                        href={`${m.slug === "/" ? "" : m.slug}#${sz.id}`}
                        className="block rounded-lg px-2.5 py-1.5 text-[13px] text-petrol-700 transition hover:bg-petrol-50 hover:text-petrol-900"
                      >
                        {sz.cim}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <div className="ml-auto flex items-center gap-1">
            {extraOldalak.map((o) => {
              const aktiv = utvonal.startsWith(o.slug);
              return (
                <Link
                  key={o.slug}
                  href={o.slug}
                  title={o.leiras}
                  className={`my-2 rounded-lg px-2.5 py-1.5 text-[12.5px] font-semibold whitespace-nowrap transition 2xl:px-3 ${
                    aktiv ? "bg-naracs-500 text-white" : "bg-petrol-50 text-petrol-700 ring-1 ring-petrol-200 hover:bg-petrol-100"
                  }`}
                >
                  <span className="hidden 2xl:inline">{o.rovid}</span>
                  <span className="2xl:hidden">{o.menu ?? o.rovid}</span>
                </Link>
              );
            })}
            <SotetKapcsolo />
          </div>
        </div>
      </nav>

      {/* Mobil menü */}
      {mobilNyitva && (
        <nav className="border-b border-[color:var(--keret)] bg-white shadow-lg lg:hidden">
          <div className="max-h-[70vh] overflow-y-auto px-4 py-3">
            {modulok.map((m) => {
              const aktiv =
                m.slug === "/" ? utvonal === "/" : utvonal.startsWith(m.slug);
              return (
                <div key={m.slug} className="border-b border-petrol-50 py-2 last:border-0">
                  <Link
                    href={m.slug}
                    onClick={() => setMobilNyitva(false)}
                    className={`flex items-center gap-2 text-[15px] font-semibold ${
                      aktiv ? "text-naracs-600" : "text-petrol-900"
                    }`}
                  >
                    {m.szam !== null && (
                      <span className="grid h-5 w-5 place-items-center rounded bg-petrol-100 text-[11px] font-bold text-petrol-600">
                        {m.szam}
                      </span>
                    )}
                    {m.cim}
                  </Link>
                  <div className="mt-1.5 flex flex-wrap gap-1.5 pl-7">
                    {m.szakaszok.map((sz) => (
                      <Link
                        key={sz.id}
                        href={`${m.slug === "/" ? "" : m.slug}#${sz.id}`}
                        onClick={() => setMobilNyitva(false)}
                        className="rounded-full bg-petrol-50 px-2.5 py-1 text-[12px] text-petrol-600"
                      >
                        {sz.cim}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
            <div className="flex flex-wrap items-center gap-2 pt-3">
              {extraOldalak.map((o) => (
                <Link
                  key={o.slug}
                  href={o.slug}
                  onClick={() => setMobilNyitva(false)}
                  className="rounded-lg bg-petrol-50 px-3 py-1.5 text-[13px] font-semibold text-petrol-700 ring-1 ring-petrol-200"
                >
                  {o.rovid}
                </Link>
              ))}
              <SotetKapcsolo />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
