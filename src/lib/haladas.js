"use client";

import { useEffect, useState } from "react";

/**
 * Haladás-nyilvántartás a böngészőben (localStorage), modulonként.
 *
 *   {
 *     "/vektorok": { feladat: 12, kviz: 7, kvizOsszes: 8, jatek: 84, film: 2 },
 *     ...
 *   }
 *
 *   feladat   – hibátlanul megoldott gyakorló feladatok száma
 *   kviz      – a fogalmi kvíz legjobb eredménye (helyes válaszok)
 *   kvizOsszes – ugyanennek a kérdésszáma
 *   jatek     – a modul játékának legjobb pontszáma (0–100)
 *
 * A modult a hívó adja meg (általában az útvonal: usePathname()).
 */

const KULCS = "statika-haladas";
const ESEMENY = "statika-haladas-valtozott";

export function haladasOlvas() {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KULCS) || "{}") || {};
  } catch {
    return {};
  }
}

function haladasIr(adat) {
  try {
    window.localStorage.setItem(KULCS, JSON.stringify(adat));
    window.dispatchEvent(new CustomEvent(ESEMENY));
  } catch {
    /* privát mód, tele tároló – nem baj */
  }
}

/** Egy hibátlan gyakorló feladat rögzítése. */
export function feladatMegoldva(modul) {
  if (!modul) return;
  const a = haladasOlvas();
  const m = a[modul] || {};
  m.feladat = (m.feladat || 0) + 1;
  a[modul] = m;
  haladasIr(a);
}

/** Kvíz eredménye (csak a legjobbat tartjuk meg). */
export function kvizEredmeny(modul, helyes, osszes) {
  if (!modul) return;
  const a = haladasOlvas();
  const m = a[modul] || {};
  if ((m.kviz || 0) <= helyes) {
    m.kviz = helyes;
    m.kvizOsszes = osszes;
  }
  a[modul] = m;
  haladasIr(a);
}

/** Játék pontszáma 0–100 skálán (csak a legjobbat tartjuk meg). */
export function jatekEredmeny(modul, pont) {
  if (!modul) return;
  const a = haladasOlvas();
  const m = a[modul] || {};
  m.jatek = Math.max(m.jatek || 0, Math.round(pont));
  a[modul] = m;
  haladasIr(a);
}

export function haladasTorles() {
  haladasIr({});
}

/** Élő nézet a haladásra (a kezdőlap kártyáihoz). */
export function useHaladas() {
  const [adat, setAdat] = useState({});
  useEffect(() => {
    const frissit = () => setAdat(haladasOlvas());
    frissit();
    window.addEventListener(ESEMENY, frissit);
    window.addEventListener("storage", frissit);
    return () => {
      window.removeEventListener(ESEMENY, frissit);
      window.removeEventListener("storage", frissit);
    };
  }, []);
  return adat;
}

/**
 * Egy modul „készültsége” 0–100 %-ban:
 *   40 % – 10 hibátlan gyakorló feladat, 30 % – kvíz, 30 % – játék.
 */
export function modulSzazalek(m) {
  if (!m) return 0;
  const f = Math.min(1, (m.feladat || 0) / 10) * 40;
  const k = m.kvizOsszes ? (m.kviz / m.kvizOsszes) * 30 : 0;
  const j = ((m.jatek || 0) / 100) * 30;
  return Math.round(f + k + j);
}

/** Jelvények egy modulhoz. */
export function jelvenyek(m) {
  if (!m) return [];
  const lista = [];
  if ((m.feladat || 0) >= 5) lista.push({ jel: "✎", cim: "5 feladat" });
  if ((m.feladat || 0) >= 20) lista.push({ jel: "✎✎", cim: "20 feladat" });
  if (m.kvizOsszes && m.kviz === m.kvizOsszes) lista.push({ jel: "★", cim: "Hibátlan kvíz" });
  if ((m.jatek || 0) >= 80) lista.push({ jel: "🏆", cim: "Játék 80+" });
  return lista;
}
