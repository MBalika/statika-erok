import { PELDAK, sablon } from "@/lib/racsos";

/*
 * A 7. modul kidolgozott feladatainak modelljei (GYF‑1 … GYF‑7). Külön, "use client" nélküli
 * fájl, hogy a szerver-komponens (Gyf.js) és a kliens-komponensek (ábrák, filmek) is használhassák.
 */

const cimkez = (m, cimkek) => {
  m.terhek = m.terhek.map((t, i) => ({ ...t, cimke: cimkek[i] ?? t.cimke }));
  return m;
};

/** GYF‑1: a tankönyv 6.1. ábrája — Warren, a = 1,5 m, h = 2 m, F = 10 kN 60°-ban lefelé az 5. csomóponton. */
export const M_GYF1 = cimkez(PELDAK.tk61(1.5, 2, 10, -60), ["F = 10 kN"]);
/** GYF‑2: a tankönyv 6.6. ábrája — párhuzamos övű, a = 2 m, b = 1,5 m, F = 12 kN a 4. csomóponton. */
export const M_GYF2 = cimkez(PELDAK.tk66(2, 1.5, 12), ["F = 12 kN"]);
/** GYF‑3: H07 — a = 2 m, b = 1,5 m, F₁ = 10 kN (3), F₂ = 6 kN (4). */
export const M_GYF3 = cimkez(PELDAK.h07(2, 1.5, 10, 6), ["F₁ = 10 kN", "F₂ = 6 kN"]);
/** GYF‑4: H08/1 — b = 2 m, a = 1,5 m, F₁ = F₂ = 10 kN. */
export const M_GYF4 = cimkez(PELDAK.h08a(2, 1.5, 10, 10), ["F₁ = 10 kN", "F₂ = 10 kN"]);
/** GYF‑5: H08/2 — b = 2 m, a = 2 m, a felső öv emelkedése 2 m, F₁ = 12 kN (3), F₂ = 8 kN (9). */
export const M_GYF5 = cimkez(PELDAK.h08b(2, 2, 2, 12, 8), ["F₁ = 12 kN", "F₂ = 8 kN"]);
/** GYF‑6: vizsgaminta — 8 kN a 3. csomóponton, 4 × 5 m, magasság 5 → 9 m. */
export const M_GYF6 = cimkez(PELDAK.vizsga(8), ["8 kN"]);
/** GYF‑7: rúdján terhelt — a GYF‑1 tartója, P = 8 kN a 3–5 rúd közepén (helyettesítve 4–4 kN a 3. és 5. csomóponton). */
export const M_GYF7 = (() => {
  const m = sablon("warren", { n: 3, a: 1.5, h: 2 });
  m.terhek = [
    { csomopont: "3", Fx: 0, Fy: -4, cimke: "P/2 = 4 kN" },
    { csomopont: "5", Fx: 0, Fy: -4, cimke: "P/2 = 4 kN" },
  ];
  return m;
})();
export const M_GYF7_EREDETI = (() => {
  const m = sablon("warren", { n: 3, a: 1.5, h: 2 });
  m.terhek = [];
  return m;
})();

