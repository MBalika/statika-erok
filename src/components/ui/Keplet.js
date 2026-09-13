import katex from "katex";

const beallitasok = {
  throwOnError: false,
  strict: false,
  trust: true,
  macros: {
    "\\vect": "\\underline{#1}",
  },
};

/**
 * A magyar tizedesvesszőt a KaTeX felsorolásjelnek veszi, és szóközt tesz
 * utána (4,9 → „4, 9”). A {,} alak ezt megszünteti, ezért minden számbeli
 * tizedesvesszőt automatikusan erre cserélünk.
 */
function tizedesvesszo(keplet) {
  return String(keplet).replace(/(\d),(?=\d)/g, "$1{,}");
}

/** Sorba illeszkedő képlet: <M>{"F_x = F\\cos\\alpha"}</M> */
export function M({ children }) {
  const html = katex.renderToString(tizedesvesszo(children), {
    ...beallitasok,
    displayMode: false,
  });
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

/** Kiemelt, önálló sorban álló képlet. */
export function MB({ children, className = "" }) {
  const html = katex.renderToString(tizedesvesszo(children), {
    ...beallitasok,
    displayMode: true,
  });
  return (
    <div
      className={`finom-gorgeto overflow-x-auto ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/**
 * Képlet keretben, opcionális magyarázó felirattal.
 * A „behelyettesítve” változat mutatja a számokkal kitöltött alakot is.
 */
export function KepletDoboz({ keplet, behelyettesitve, eredmeny, cimke }) {
  return (
    <div className="my-4 overflow-hidden rounded-xl border border-petrol-200 bg-white">
      {cimke && (
        <div className="border-b border-petrol-100 bg-petrol-50 px-4 py-1.5 text-[11px] font-semibold tracking-wider text-petrol-600 uppercase">
          {cimke}
        </div>
      )}
      <div className="px-4 py-3">
        <MB>{keplet}</MB>
        {behelyettesitve && (
          <div className="mt-1 border-t border-dashed border-petrol-100 pt-2">
            <MB className="text-petrol-700">{behelyettesitve}</MB>
          </div>
        )}
        {eredmeny && (
          <div className="mt-2 rounded-lg bg-naracs-50 px-3 py-2">
            <MB>{eredmeny}</MB>
          </div>
        )}
      </div>
    </div>
  );
}
