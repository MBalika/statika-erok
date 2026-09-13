import Link from "next/link";

export default function Hamarosan({ szam, cim, leiras, tartalom = [] }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <div className="rounded-3xl border border-[color:var(--keret)] bg-white p-8 text-center sm:p-12">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-petrol-100 text-[20px] font-bold text-petrol-600">
          {szam}
        </span>
        <h1 className="mt-5 text-2xl font-bold text-petrol-900 sm:text-3xl">
          {cim}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-petrol-600">
          {leiras}
        </p>

        {tartalom.length > 0 && (
          <div className="mx-auto mt-8 max-w-md rounded-2xl bg-petrol-50 p-5 text-left">
            <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">
              Ebbe a modulba kerül
            </p>
            <ul className="mt-3 space-y-2">
              {tartalom.map((t) => (
                <li
                  key={t}
                  className="flex items-start gap-2.5 text-[13.5px] text-petrol-700"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-naracs-400" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/vektorok"
            className="rounded-xl bg-naracs-500 px-5 py-2.5 text-[13.5px] font-semibold text-white transition hover:bg-naracs-600"
          >
            Ugrás az elkészült modulra
          </Link>
          <Link
            href="/"
            className="rounded-xl px-5 py-2.5 text-[13.5px] font-semibold text-petrol-600 ring-1 ring-petrol-200 transition hover:bg-petrol-50"
          >
            Vissza a bevezetéshez
          </Link>
        </div>
      </div>
    </div>
  );
}
