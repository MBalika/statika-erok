"use client";

/*
 * Az ellenőrzés eredményének megjelenítése: pont, összefoglaló, a hibák listája.
 * A fokozatos segítség szintje dönti el, mennyit mutatunk:
 *   0 – csak a hibák fajtája (hol van, azt neked kell megtalálnod)
 *   1 – hol a hiba (a listában a hely, a rajzon piros/zöld jelek; kattintásra villog)
 *   2 – a szabály és a helyes érték (szöveggel)
 *   3 – a pontos ábra ráúszik (a kör 0 pont, a rajz megmarad tanuláshoz)
 */

const KOD_NEV = {
  ertek: "Rossz érték",
  elojel: "Fordított előjel",
  ugras_hianyzik: "Hiányzó ugrás",
  ugras_rossz: "Rossz ugrás",
  ugras_felesleges: "Fölösleges ugrás",
  csuklo_M: "Nyomaték a belső csuklóban",
  szabad_veg: "Szabad vég",
  tamasz_veg_M: "Nyomaték a szélső támasznál",
  alak: "Rossz alak",
  meredekseg: "Az M lejtése nem a V",
  szelso: "Szélsőérték",
  sarok: "Sarok / csomópont",
  reakcio: "Reakció",
};
const JEL_SZIN = { N: "text-emerald-700", V: "text-sky-700", M: "text-rose-700", R: "text-violet-700" };

export default function Ertekeles({ eredmeny, segitseg, kiemelt, onKiemel, probak, kihivas = false }) {
  if (!eredmeny) return null;
  const { pont, hibak, joPontok, osszefoglalo } = eredmeny;
  const szin = pont >= 80 ? "emerald" : pont >= 50 ? "amber" : "rose";
  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-[color:var(--keret)] bg-white">
      <div className="flex flex-wrap items-center gap-3 border-b border-[color:var(--keret)] px-4 py-3">
        <span className={`szamok rounded-lg px-3 py-1.5 text-[18px] font-bold ${szin === "emerald" ? "bg-emerald-100 text-emerald-800" : szin === "amber" ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"}`}>
          {pont} pont
        </span>
        <p className="min-w-0 flex-1 text-[13px] leading-relaxed text-petrol-700">{osszefoglalo}</p>
        <span className="szamok text-[11.5px] text-petrol-500">
          {probak}. próbálkozás · {joPontok.length} jó pont{segitseg > 0 ? ` · segítség: ${segitseg}. szint` : ""}{kihivas ? " · a kör pontja az első próbálkozásé" : ""}
        </span>
      </div>
      {hibak.length > 0 && (
        <ul className="divide-y divide-[color:var(--keret)]">
          {hibak.map((h, i) => {
            const aktiv = kiemelt === h;
            return (
              <li key={i} className={`px-4 py-2.5 ${aktiv ? "bg-amber-50" : ""}`}>
                <button type="button" onClick={() => onKiemel(aktiv ? null : h)} disabled={segitseg < 1 || h.kod === "reakcio"} className="flex w-full flex-wrap items-baseline gap-x-2 gap-y-0.5 text-left disabled:cursor-default">
                  <span className={`rounded px-1.5 py-0.5 text-[10.5px] font-bold tracking-wide uppercase ${h.sulyos ? "bg-rose-100 text-rose-800" : h.apro ? "bg-petrol-100 text-petrol-700" : "bg-amber-100 text-amber-800"}`}>
                    {h.sulyos ? "−12" : h.apro ? "−2" : "−6"}
                  </span>
                  <span className={`text-[12px] font-bold ${JEL_SZIN[h.jel] ?? "text-petrol-700"}`}>{h.jel === "R" ? "reakció" : `${h.jel}-ábra`}</span>
                  <span className="text-[13px] font-semibold text-petrol-900">{segitseg >= 1 ? h.cim : KOD_NEV[h.kod]}</span>
                  {segitseg >= 1 && h.kod !== "reakcio" && <span className="ml-auto text-[11px] text-amber-700">{aktiv ? "villog a rajzon" : "mutasd a rajzon"}</span>}
                </button>
                {segitseg >= 2 && (
                  <div className="mt-1.5 space-y-1 text-[12.5px] leading-relaxed text-petrol-700">
                    <p>{h.magyarazat}</p>
                    <p className="rounded-md bg-petrol-50 px-2.5 py-1.5 text-petrol-800"><strong>Szabály:</strong> {h.szabaly}</p>
                    {h.tipp && <p className="text-petrol-600"><strong>Tipp:</strong> {h.tipp}</p>}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
      {hibak.length === 0 && (
        <p className="px-4 py-3 text-[13px] text-emerald-800">Minden ellenőrzött pont a tolerancián belül van. Ha maradt N-fül, azt is megrajzolhatod — vagy építs egy nehezebb tartót!</p>
      )}
    </div>
  );
}
