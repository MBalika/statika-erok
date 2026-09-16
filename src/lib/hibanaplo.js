"use client";

import { useEffect, useState } from "react";

/**
 * Hibanapló a böngészőben (localStorage): amit a hallgató elront, ide gyűlik,
 * és a /hibanaplo oldalon újra megkapja ugyanazt a típust.
 *
 *   [
 *     {
 *       id:        "h_k3f9…",         – belső azonosító
 *       tipus:     "feladat" | "kviz" | "hibakereso" | "jatek",
 *       modul:     "/tartok",          – az oldal útvonala, ahol a hiba történt
 *       cim:       "Befogott konzol",  – amit a listában mutatunk
 *       azonosito: "Befogott konzol",  – amivel újra elő lehet keresni
 *                                        (generátor címe / kérdés szövege / hibakereső címe / játék címe)
 *       reszlet:   { … } | szám | null – típusfüggő extra (a kvíznél a kérdés+válaszok szövege,
 *                                        a hibakeresőnél a feladat szöveges változata, a játéknál a pont)
 *       datum:     "2026-09-15T10:22:31.000Z" – az utolsó rontás ideje
 *       db:        2,                  – hányszor rontotta el
 *       javitva:   0 | 1 | 2,          – hány sikeres ismétlés van mögötte
 *       kesz:      false,              – 2 sikeres ismétlés után igaz: kikerül a nyitott listából
 *     },
 *     …
 *   ]
 *
 * Ugyanaz a (tipus, modul, azonosito) hármas egyetlen bejegyzés: újabb rontásnál
 * a `db` nő, a `javitva` nullázódik. A haladás-nyilvántartás (haladas.js) mintáját
 * követi: minden írás után saját eseményt küld, a `useHibanaplo` hook erre frissül.
 */

const KULCS = "statika-hibanaplo";
const ESEMENY = "statika-hibanaplo-valtozott";
const MAX_NYITOTT = 200;
const MAX_KESZ = 60;
export const JAVITAS_CEL = 2; // ennyi sikeres ismétlés után kerül ki a hiba

export const TIPUS_NEV = {
  feladat: "Gyakorló feladat",
  kviz: "Kvízkérdés",
  hibakereso: "Hibakereső",
  jatek: "Játék",
};

/* ---------- olvasás / írás ---------- */

export function hibakOlvas() {
  if (typeof window === "undefined") return [];
  try {
    const t = JSON.parse(window.localStorage.getItem(KULCS) || "[]");
    return Array.isArray(t) ? t : [];
  } catch {
    return [];
  }
}

function hibakIr(lista) {
  try {
    window.localStorage.setItem(KULCS, JSON.stringify(lista));
    window.dispatchEvent(new CustomEvent(ESEMENY));
  } catch {
    /* privát mód, tele tároló – nem baj */
  }
}

function ujId() {
  return "h_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function kulcsEgyezik(h, tipus, modul, azonosito) {
  return h.tipus === tipus && h.modul === modul && h.azonosito === azonosito;
}

/** Csak a még nyitott (nem javított) hibák, a legfrissebb elöl. */
export function nyitottHibak(lista = hibakOlvas()) {
  return lista.filter((h) => !h.kesz).sort((a, b) => (a.datum < b.datum ? 1 : -1));
}

/**
 * Egy hiba rögzítése. Ha ugyanaz a (tipus, modul, azonosito) már szerepel,
 * a bejegyzés frissül (db++, javitva = 0, kesz = false), nem duplázódik.
 */
export function hibaRogzit({ tipus, modul, cim, azonosito, reszlet = null }) {
  if (typeof window === "undefined") return null;
  if (!tipus || !modul || !azonosito) return null;
  const most = new Date().toISOString();
  const lista = hibakOlvas();
  const i = lista.findIndex((h) => kulcsEgyezik(h, tipus, modul, azonosito));
  let bejegyzes;
  if (i >= 0) {
    bejegyzes = {
      ...lista[i],
      cim: cim || lista[i].cim,
      reszlet: reszlet ?? lista[i].reszlet,
      datum: most,
      db: (lista[i].db || 1) + 1,
      javitva: 0,
      kesz: false,
    };
    lista[i] = bejegyzes;
  } else {
    bejegyzes = {
      id: ujId(),
      tipus,
      modul,
      cim: cim || String(azonosito),
      azonosito: String(azonosito),
      reszlet,
      datum: most,
      db: 1,
      javitva: 0,
      kesz: false,
    };
    lista.push(bejegyzes);
  }
  hibakIr(nyes(lista));
  return bejegyzes.id;
}

/** Ha túl sok a bejegyzés, a legrégebbieket elengedjük. */
function nyes(lista) {
  const nyitott = lista.filter((h) => !h.kesz).sort((a, b) => (a.datum < b.datum ? 1 : -1));
  const kesz = lista.filter((h) => h.kesz).sort((a, b) => (a.datum < b.datum ? 1 : -1));
  return [...nyitott.slice(0, MAX_NYITOTT), ...kesz.slice(0, MAX_KESZ)];
}

/** Sikeres ismétlés: javitva++, a második után a hiba „kész” (kikerül a nyitottak közül). */
export function hibaMegoldva(id) {
  if (!id) return;
  const lista = hibakOlvas();
  const i = lista.findIndex((h) => h.id === id);
  if (i < 0) return;
  const javitva = Math.min(JAVITAS_CEL, (lista[i].javitva || 0) + 1);
  lista[i] = { ...lista[i], javitva, kesz: javitva >= JAVITAS_CEL, javitasDatum: new Date().toISOString() };
  hibakIr(lista);
}

/**
 * Ugyanez kulcs alapján: a komponensek hívják, ha a hallgató a modul oldalán
 * (vagy az ismétlésnél) helyesen old meg valamit, ami a naplóban nyitva van.
 * Visszaadja, volt-e ilyen nyitott bejegyzés.
 */
export function hibaMegoldvaKulcs({ tipus, modul, azonosito }) {
  if (typeof window === "undefined") return false;
  const h = hibakOlvas().find((x) => !x.kesz && kulcsEgyezik(x, tipus, modul, String(azonosito)));
  if (!h) return false;
  hibaMegoldva(h.id);
  return true;
}

export function hibaTorol(id) {
  hibakIr(hibakOlvas().filter((h) => h.id !== id));
}

export function hibakTorles() {
  hibakIr([]);
}

/** Élő nézet a naplóra (a lista, a jelvény és az ismétlő mód használja). */
export function useHibanaplo() {
  const [lista, setLista] = useState([]);
  const [betoltve, setBetoltve] = useState(false);
  useEffect(() => {
    const frissit = () => {
      setLista(hibakOlvas());
      setBetoltve(true);
    };
    frissit();
    window.addEventListener(ESEMENY, frissit);
    window.addEventListener("storage", frissit);
    return () => {
      window.removeEventListener(ESEMENY, frissit);
      window.removeEventListener("storage", frissit);
    };
  }, []);
  return { lista, nyitott: nyitottHibak(lista), betoltve };
}

/* ---------- segéd: JSX → egyszerű szöveg ---------- */

/**
 * A kvízkérdések és a hibakereső lépései JSX-ek (KaTeX-szel); a naplóba csak
 * szöveg kerülhet. Ez a függvény kiszedi a szöveget; a képletekből a KaTeX-forrás
 * marad (pl. „F\sin 25^\circ”), ami a listában és az azonosításhoz elég.
 */
export function jsxSzoveg(node) {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(jsxSzoveg).join("");
  if (typeof node === "object" && node.props) {
    const gy = node.props.children;
    if (gy == null && typeof node.props.keplet === "string") return node.props.keplet;
    return jsxSzoveg(gy);
  }
  return "";
}

/** Rövidített, egysoros változat a listához. */
export function rovidSzoveg(node, max = 110) {
  const s = jsxSzoveg(node).replace(/\s+/g, " ").trim();
  return s.length > max ? s.slice(0, max - 1).trimEnd() + "…" : s;
}
