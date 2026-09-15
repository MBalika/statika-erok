"use client";
import { useEffect, useMemo, useState } from "react";
import { levezetes, igenybevetelSzoveg } from "@/lib/tarto/levezetes";
import { M as Keplet, MB } from "@/components/ui/Keplet";

// a terhek narancs, a reakciók lila színétől eltérő: N zöld, V kék, M bordó
const SZINEK = { N: "#059669", V: "#0369a1", M: "#be123c" };

/**
 * A kalkulátor „Levezetés” panelje: a tankönyv receptje szerinti, lépésenként
 * felfedhető levezetés (elkülönítés → kijelentés → egyismeretlenes egyenletek →
 * ellenőrzés → eredményvázlat), majd szakaszonként az igénybevételi függvények.
 *
 * props: modell (a bemeneti modell), eredmeny (elemez() kimenete),
 *        onKiemel?(fopont | null) – az aktuális lépés főpontja a rajz számára
 */
export default function TartoLevezetes({ modell, eredmeny, onKiemel }) {
  const adat = useMemo(() => {
    try {
      return {
        lv: levezetes(modell, eredmeny),
        fv: igenybevetelSzoveg(eredmeny.igenybevetelek, eredmeny.modell),
      };
    } catch (e) {
      return { hiba: e.message };
    }
  }, [modell, eredmeny]);

  const [nyitva, setNyitva] = useState(false);
  const [mutatott, setMutatott] = useState(1);
  const [fvNyitva, setFvNyitva] = useState(false);

  const osszes = adat.lv?.lepesek.length ?? 0;

  // ha változik a szerkezet, a felfedett lépések számát nem vesszük vissza,
  // de a főpont-kiemelést frissítjük
  useEffect(() => {
    if (!onKiemel) return;
    if (!nyitva || !adat.lv) { onKiemel(null); return; }
    const utolso = adat.lv.lepesek[Math.min(mutatott, osszes) - 1];
    onKiemel(utolso?.fopont ?? null);
  }, [nyitva, mutatott, adat, osszes, onKiemel]);

  if (adat.hiba) return null;
  const { lv, fv } = adat;
  const lathato = lv.lepesek.slice(0, Math.min(mutatott, osszes));
  const kesz = mutatott >= osszes;

  return (
    <div className="border-t border-[color:var(--keret)]">
      {/* fejléc / nyitó gomb */}
      <button
        type="button"
        onClick={() => setNyitva((v) => !v)}
        className="flex w-full flex-wrap items-center gap-x-3 gap-y-1 px-5 py-3.5 text-left transition hover:bg-petrol-50/60"
        aria-expanded={nyitva}
      >
        <span className="rounded-md bg-violet-600 px-2 py-0.5 text-[10.5px] font-bold tracking-[0.14em] text-white uppercase">Levezetés</span>
        <span className="text-[14px] font-semibold text-petrol-900">Így írnád le a gyakorlaton — lépésről lépésre</span>
        <span className="ml-auto text-[12px] text-petrol-500">
          {lv.testekSzama > 1 ? `${lv.testekSzama} merev test · ` : ""}
          {lv.ismeretlenek.length} ismeretlen · {osszes} lépés
          <span className="ml-2 inline-block text-petrol-400">{nyitva ? "▲" : "▼"}</span>
        </span>
      </button>

      {nyitva && (
        <div className="border-t border-[color:var(--keret)] bg-white px-4 py-4 sm:px-5">
          <p className="text-[13px] text-petrol-600">
            A program itt <em>nem</em> a merevségi módszerrel számol, hanem azt írja le, amit a gyakorlaton neked is le kell írnod:
            egyensúlyi egyenletekből, egyismeretlenes lépésekben. A két út végeredményének egyeznie kell — ez a beépített ellenőrzés.
          </p>

          <ol className="mt-4 space-y-3">
            {lathato.map((l, i) => (
              <Lepes key={i} szam={i + 1} lepes={l} aktiv={i === lathato.length - 1} />
            ))}
          </ol>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {!kesz ? (
              <>
                <button
                  type="button"
                  onClick={() => setMutatott((n) => Math.min(osszes, n + 1))}
                  className="rounded-lg bg-petrol-800 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-petrol-700"
                >
                  Következő lépés →
                </button>
                <button
                  type="button"
                  onClick={() => setMutatott(osszes)}
                  className="rounded-lg bg-white px-4 py-2 text-[13px] font-semibold text-petrol-700 ring-1 ring-petrol-200 transition hover:bg-petrol-50"
                >
                  Mutasd az egészet
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setMutatott(1)}
                className="rounded-lg bg-white px-4 py-2 text-[13px] font-semibold text-petrol-700 ring-1 ring-petrol-200 transition hover:bg-petrol-50"
              >
                ↺ Elölről, lépésenként
              </button>
            )}
            <span className="text-[12px] text-petrol-400">{Math.min(mutatott, osszes)} / {osszes}</span>
          </div>

          {/* igénybevételi függvények */}
          <div className="mt-6 rounded-xl border border-[color:var(--keret)]">
            <button
              type="button"
              onClick={() => setFvNyitva((v) => !v)}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left"
              aria-expanded={fvNyitva}
            >
              <span className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">Igénybevételi függvények szakaszonként</span>
              <span className="ml-auto text-petrol-400">{fvNyitva ? "▲" : "▼"}</span>
            </button>
            {fvNyitva && (
              <div className="border-t border-[color:var(--keret)] px-4 py-3">
                <p className="text-[12.5px] text-petrol-600">
                  A reakciók ismeretében a tartót szakaszokra bontjuk: minden koncentrált erő, nyomaték, megoszló teher kezdete–vége és
                  csomópont új szakaszt nyit. Egy szakaszon belül a függvények „szépek”: <Keplet>{"V"}</Keplet> egy fokkal,{" "}
                  <Keplet>{"M"}</Keplet> két fokkal magasabb a teherfüggvénynél (<Keplet>{"\\tfrac{dM}{dx}=V"}</Keplet>,{" "}
                  <Keplet>{"\\tfrac{dV}{dx}=-p"}</Keplet>).
                </p>
                <div className="mt-3 space-y-3">
                  {fv.map((r) => (
                    <div key={r.rud} className="rounded-lg bg-petrol-50/70 p-3">
                      <p className="text-[13px] font-semibold text-petrol-900">{r.cim}</p>
                      <p className="mt-0.5 text-[11.5px] text-petrol-500">{r.megjegyzes}</p>
                      <div className="mt-2 overflow-x-auto">
                        <table className="w-full min-w-[420px] text-[12.5px]">
                          <thead className="text-[10.5px] tracking-wider text-petrol-500 uppercase">
                            <tr>
                              <th className="py-1 pr-3 text-left">Szakasz</th>
                              <th className="py-1 pr-3 text-left" style={{ color: SZINEK.N }}>N</th>
                              <th className="py-1 pr-3 text-left" style={{ color: SZINEK.V }}>V</th>
                              <th className="py-1 text-left" style={{ color: SZINEK.M }}>M</th>
                            </tr>
                          </thead>
                          <tbody>
                            {r.szakaszok.map((s, i) => (
                              <tr key={i} className="border-t border-petrol-100 align-top">
                                <td className="py-1.5 pr-3 whitespace-nowrap"><Keplet>{s.tartomany}</Keplet></td>
                                <td className="py-1.5 pr-3 whitespace-nowrap"><Keplet>{s.N}</Keplet></td>
                                <td className="py-1.5 pr-3 whitespace-nowrap"><Keplet>{s.V}</Keplet></td>
                                <td className="py-1.5 whitespace-nowrap"><Keplet>{s.M}</Keplet></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-[11.5px] text-petrol-500">
                  Az x mindig a rúd kezdőpontjától mért koordináta (m), nem a szakasz elejétől; az együtthatók kN, kN/m, kN/m² egységben.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/** A prózában előforduló jelöléseket (A_x, M_A, O_1, C_y) képletként szedjük. */
function Szoveg({ children }) {
  const darabok = String(children).split(/(\b[A-Z][a-z]?_[A-Za-z0-9]+\b)/g);
  return darabok.map((d, i) =>
    /^[A-Z][a-z]?_[A-Za-z0-9]+$/.test(d)
      ? <Keplet key={i}>{d.replace(/_(\w+)/, "_{$1}")}</Keplet>
      : <span key={i}>{d}</span>
  );
}

function Lepes({ szam, lepes: l, aktiv }) {
  const ellenorzo = l.cim.startsWith("Ellenőrzés");
  const eredmeny = l.cim.startsWith("Eredmény");
  const hatarozatlan = !!l.hatarozatlan || l.cim.startsWith("Az egyensúlyi");
  const szin = hatarozatlan ? "border-amber-300 bg-amber-50/60" : ellenorzo ? "border-emerald-200 bg-emerald-50/50" : eredmeny ? "border-naracs-200 bg-naracs-50/50" : aktiv ? "border-violet-300 bg-violet-50/40" : "border-[color:var(--keret)] bg-white";
  return (
    <li className={`rounded-xl border p-3.5 transition ${szin}`}>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-petrol-800 text-[11.5px] font-bold text-white">{szam}</span>
        <div className="min-w-0 flex-1">
          <p className="text-[13.5px] font-semibold text-petrol-900"><Szoveg>{l.cim}</Szoveg></p>
          {l.szoveg && <p className="mt-1 text-[12.5px] leading-relaxed text-petrol-600"><Szoveg>{l.szoveg}</Szoveg></p>}

          {l.felsorolas && l.felsorolas.length > 0 && (
            <ul className="mt-2 grid gap-1 sm:grid-cols-2">
              {l.felsorolas.map((f, i) => (
                <li key={i} className="flex items-baseline gap-2 rounded-lg bg-white/80 px-2.5 py-1.5 text-[12.5px] ring-1 ring-petrol-100">
                  <span className="shrink-0 font-semibold text-violet-700"><Keplet>{f.jel}</Keplet></span>
                  <span className="text-petrol-600">{f.leiras}</span>
                </li>
              ))}
            </ul>
          )}

          {l.terhek && l.terhek.length > 0 && (
            <ul className="mt-2 grid gap-1 sm:grid-cols-2">
              {l.terhek.map((t, i) => (
                <li key={i} className="flex items-baseline gap-2 rounded-lg bg-white/80 px-2.5 py-1.5 text-[12.5px] ring-1 ring-petrol-100">
                  <span className="shrink-0 font-semibold text-naracs-600"><Keplet>{t.nev}</Keplet></span>
                  <span className="text-petrol-600">{t.leiras}</span>
                </li>
              ))}
            </ul>
          )}

          {l.kepletek && l.kepletek.map((k, i) => (
            <MB key={i} className="mt-1 text-[15px] [&_.katex-display]:my-1.5">{k}</MB>
          ))}
        </div>
      </div>
    </li>
  );
}
