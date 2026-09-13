/** Magyar tizedesvesszős számformázás és szögkezelés az ábrákhoz. */

export function sz(ertek, tizedes = 2) {
  if (!Number.isFinite(ertek)) return "–";
  const k = Number(ertek).toFixed(tizedes);
  // A -0,00 alakot 0,00-ra javítjuk
  const tiszta = Math.abs(Number(k)) < 5e-9 ? (0).toFixed(tizedes) : k;
  return tiszta.replace(".", ",");
}

/** Előjeles alak, mindig kiírt + vagy − jellel (összegzések szemléltetéséhez). */
export function szEl(ertek, tizedes = 2) {
  const s = sz(Math.abs(ertek), tizedes);
  return `${ertek < 0 ? "−" : "+"}${s}`;
}

/**
 * Ugyanaz, de KaTeX-be szánva: a tizedesvesszőt {,} alakban adjuk át,
 * különben a KaTeX felsorolásjelnek veszi és szóközt tesz utána.
 */
export function szK(ertek, tizedes = 2) {
  return sz(ertek, tizedes).replace(",", "{,}");
}

export function szElK(ertek, tizedes = 2) {
  return szEl(ertek, tizedes).replace(",", "{,}");
}

/** Negatív számot zárójelbe tesz, hogy a hatványozás egyértelmű legyen: (−6)². */
export function zarojel(ertek, tizedes = 2) {
  const s = sz(ertek, tizedes);
  return ertek < 0 ? `(${s})` : s;
}

/** Számok összegláncát írja ki helyes előjelekkel: „5 − 3 + 8”. */
export function osszegLanc(ertekek, tizedes = 0) {
  return ertekek
    .map((e, i) =>
      i === 0 ? sz(e, tizedes) : `${e < 0 ? "-" : "+"} ${sz(Math.abs(e), tizedes)}`,
    )
    .join(" ");
}

export const FOK = Math.PI / 180;

export function fokRad(fok) {
  return fok * FOK;
}

export function radFok(rad) {
  return rad / FOK;
}

/** 0–360° közé normalizált szög. */
export function normalizalSzog(fok) {
  return ((fok % 360) + 360) % 360;
}

/** Vektor hossza és iránya a komponensekből. */
export function polaris(x, y) {
  return {
    nagysag: Math.hypot(x, y),
    szog: normalizalSzog(radFok(Math.atan2(y, x))),
  };
}

/** Komponensek a nagyságból és az irányszögből. */
export function derekszogu(nagysag, szogFok) {
  const r = fokRad(szogFok);
  return { x: nagysag * Math.cos(r), y: nagysag * Math.sin(r) };
}

/** Melyik síknegyedben van az adott irányszög. */
export function siknegyed(szogFok) {
  const s = normalizalSzog(szogFok);
  if (s < 90) return { szam: "I.", jelek: "Fx > 0, Fy > 0" };
  if (s < 180) return { szam: "II.", jelek: "Fx < 0, Fy > 0" };
  if (s < 270) return { szam: "III.", jelek: "Fx < 0, Fy < 0" };
  return { szam: "IV.", jelek: "Fx > 0, Fy < 0" };
}
