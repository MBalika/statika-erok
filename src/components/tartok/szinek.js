/**
 * A tartós rajzelemek színei. Külön, „use client” nélküli modul, hogy a
 * szerver-komponensek (statikus ábrák) is a tényleges értékeket kapják:
 * egy "use client" fájlból importált sima objektum a szerveren csak
 * kliens-hivatkozás, a mezői undefined-ek (eltűnő rúd- és nyílvonalak).
 */
export const SZIN = {
  tarto: "#1d3c48",
  tamasz: "#475569",
  teher: "var(--color-jel-ero)",
  reakcio: "var(--color-jel-eredo)",
  nyomatek: "#9f1239",
  meret: "#64748b",
  rud: "#2563eb",
};
