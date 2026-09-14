/** Újrahasznosítható tartalmi elemek: szakasz, kártya, kiemelő doboz, ábra-keret. */

export function Szakasz({ id, cimke, cim, bevezeto, children, className = "" }) {
  return (
    <section id={id} className={`scroll-mt-32 py-10 ${className}`}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {cimke && (
          <p className="text-[11px] font-semibold tracking-[0.18em] text-naracs-600 uppercase">
            {cimke}
          </p>
        )}
        {cim && (
          <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-petrol-900 sm:text-3xl">
            {cim}
          </h2>
        )}
        {bevezeto && (
          <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-petrol-600">
            {bevezeto}
          </p>
        )}
        <div className={cim || bevezeto ? "mt-7" : ""}>{children}</div>
      </div>
    </section>
  );
}

export function Kartya({ cim, cimke, children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-[color:var(--keret)] bg-white p-5 shadow-sm shadow-petrol-900/[0.03] sm:p-6 ${className}`}
    >
      {cimke && (
        <p className="text-[10.5px] font-semibold tracking-[0.16em] text-petrol-400 uppercase">
          {cimke}
        </p>
      )}
      {cim && (
        <h3 className="mt-0.5 mb-3 text-lg font-semibold text-petrol-900">
          {cim}
        </h3>
      )}
      {children}
    </div>
  );
}

const kiemeloStilusok = {
  definicio: {
    keret: "border-petrol-300 bg-petrol-50",
    cimke: "text-petrol-700",
    jel: "bg-petrol-600",
    alap: "Definíció",
  },
  kulcs: {
    keret: "border-naracs-300 bg-naracs-50",
    cimke: "text-naracs-800",
    jel: "bg-naracs-500",
    alap: "Ezt jegyezd meg",
  },
  tipp: {
    keret: "border-emerald-300 bg-emerald-50",
    cimke: "text-emerald-800",
    jel: "bg-emerald-600",
    alap: "Tipp",
  },
  figyelem: {
    keret: "border-rose-300 bg-rose-50",
    cimke: "text-rose-800",
    jel: "bg-rose-500",
    alap: "Gyakori hiba",
  },
};

export function Kiemelo({ tipus = "definicio", cim, children }) {
  const s = kiemeloStilusok[tipus] ?? kiemeloStilusok.definicio;
  return (
    <div className={`my-5 rounded-xl border ${s.keret} p-4 sm:p-5`}>
      <div className="mb-2 flex items-center gap-2">
        <span className={`h-1.5 w-1.5 rounded-full ${s.jel}`} />
        <span
          className={`text-[10.5px] font-bold tracking-[0.16em] uppercase ${s.cimke}`}
        >
          {cim ?? s.alap}
        </span>
      </div>
      <div className="proza text-[14.5px] leading-relaxed text-petrol-800">
        {children}
      </div>
    </div>
  );
}

/** Ábra keretben, sorszámmal és képaláírással. */
export function AbraKeret({ szam, cim, children, jobbSav }) {
  return (
    <figure className="my-6 overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white">
      <div className="racs-vilagos flex items-center justify-center px-3 py-5 sm:px-6">
        <div className="w-full max-w-2xl">{children}</div>
      </div>
      {(cim || jobbSav) && (
        <figcaption className="flex flex-wrap items-baseline gap-x-2 gap-y-1 border-t border-[color:var(--keret)] bg-petrol-50/60 px-4 py-2.5">
          {szam && (
            <span className="text-[11px] font-bold tracking-wider text-naracs-600 uppercase">
              {szam}. ábra
            </span>
          )}
          <span className="text-[12.5px] text-petrol-600">{cim}</span>
          {jobbSav && <span className="ml-auto">{jobbSav}</span>}
        </figcaption>
      )}
    </figure>
  );
}

/** Kétoszlopos elrendezés: bal oldalon szöveg, jobb oldalon ábra vagy eszköz. */
export function KetOszlop({ children, forditott = false }) {
  return (
    <div
      className={`grid items-start gap-6 lg:grid-cols-2 [&>*]:min-w-0 ${
        forditott ? "lg:[&>*:first-child]:order-2" : ""
      }`}
    >
      {children}
    </div>
  );
}

export function Cimke({ children, szin = "petrol" }) {
  const szinek = {
    petrol: "bg-petrol-100 text-petrol-700",
    naracs: "bg-naracs-100 text-naracs-800",
    zold: "bg-emerald-100 text-emerald-800",
    lila: "bg-violet-100 text-violet-800",
  };
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${szinek[szin]}`}
    >
      {children}
    </span>
  );
}
