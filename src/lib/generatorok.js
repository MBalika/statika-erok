"use client";

/**
 * A modulok gyakorló generátorai, kvízkérdései és hibakereső feladatai egy helyen,
 * hogy a hibanapló cím / szöveg alapján újra elő tudja keresni őket.
 *
 * Csak a kész modulokból olvasunk (a Zh-szimulátor importjainak mintájára);
 * új modul felvételéhez a MODULOK tömbbe kell egy sor.
 */

import { GENERATOROK as V1 } from "@/components/vektorok/GyakorloSzekcio";
import { EXTRA_GENERATOROK as V2 } from "@/components/vektorok/GyakorloExtra";
import { GENERATOROK as N1 } from "@/components/nyomatek/GyakorloSzekcio";
import { EXTRA_GENERATOROK as N2 } from "@/components/nyomatek/GyakorloExtra";
import { GENERATOROK as M1 } from "@/components/megoszlo/GyakorloSzekcio";
import { EXTRA_GENERATOROK as M2 } from "@/components/megoszlo/GyakorloExtra";
import { GENERATOROK as S1 } from "@/components/sulypont/GyakorloSzekcio";
import { EXTRA_GENERATOROK as S2 } from "@/components/sulypont/GyakorloExtra";
import { GENERATOROK as T1 } from "@/components/tartok/GyakorloSzekcio";
import { EXTRA_GENERATOROK as T2 } from "@/components/tartok/GyakorloExtra";
import { GENERATOROK as O1 } from "@/components/osszetett/GyakorloSzekcio";
import { EXTRA_GENERATOROK as O2 } from "@/components/osszetett/GyakorloExtra";
import { GENERATOROK as R1 } from "@/components/racsos/GyakorloSzekcio";
import { EXTRA_GENERATOROK as R2 } from "@/components/racsos/GyakorloExtra";
import { GENERATOROK as H1 } from "@/components/hatarozottsag/GyakorloSzekcio";
import { EXTRA_GENERATOROK as H2 } from "@/components/hatarozottsag/GyakorloExtra";
import { GENERATOROK as I1 } from "@/components/igenybevetel/GyakorloSzekcio";
import { EXTRA_GENERATOROK as I2 } from "@/components/igenybevetel/GyakorloExtra";
import { GENERATOROK as X1 } from "@/components/terbeli/GyakorloSzekcio";
import { EXTRA_GENERATOROK as X2 } from "@/components/terbeli/GyakorloExtra";

import { KVIZ as VK, HIBAK as VH } from "@/components/vektorok/KvizAdatok";
import { KVIZ as NK, HIBAK as NH } from "@/components/nyomatek/KvizAdatok";
import { KVIZ as MK, HIBAK as MH } from "@/components/megoszlo/KvizAdatok";
import { KVIZ as SK, HIBAK as SH } from "@/components/sulypont/KvizAdatok";
import { KVIZ as TK, HIBAK as TH } from "@/components/tartok/KvizAdatok";
import { KVIZ as OK, HIBAK as OH } from "@/components/osszetett/KvizAdatok";
import { KVIZ as RK, HIBAK as RH } from "@/components/racsos/KvizAdatok";
import { KVIZ as HK, HIBAK as HH } from "@/components/hatarozottsag/KvizAdatok";
import { KVIZ as IK, HIBAK as IH } from "@/components/igenybevetel/KvizAdatok";
import { KVIZ as XK, HIBAK as XH } from "@/components/terbeli/KvizAdatok";

import { jsxSzoveg } from "@/lib/hibanaplo";

export const MODULOK = [
  { slug: "/vektorok", nev: "Vektorok", gen: [...V1, ...V2], kviz: VK, hibak: VH },
  { slug: "/nyomatek", nev: "Nyomaték, eredő", gen: [...N1, ...N2], kviz: NK, hibak: NH },
  { slug: "/megoszlo", nev: "Megoszló erők", gen: [...M1, ...M2], kviz: MK, hibak: MH },
  { slug: "/sulypont", nev: "Súlypont", gen: [...S1, ...S2], kviz: SK, hibak: SH },
  { slug: "/tartok", nev: "Tartók reakciói", gen: [...T1, ...T2], kviz: TK, hibak: TH },
  { slug: "/osszetett", nev: "Összetett tartók", gen: [...O1, ...O2], kviz: OK, hibak: OH },
  { slug: "/racsos", nev: "Rácsos tartók", gen: [...R1, ...R2], kviz: RK, hibak: RH },
  { slug: "/hatarozottsag", nev: "Statikai határozottság", gen: [...H1, ...H2], kviz: HK, hibak: HH },
  { slug: "/igenybevetel", nev: "Igénybevételi ábrák", gen: [...I1, ...I2], kviz: IK, hibak: IH },
  { slug: "/terbeli", nev: "Térbeli tartók", gen: [...X1, ...X2], kviz: XK, hibak: XH },
];

/** Az összes generátor egy tömbben: [{ cim, fn, modul }]. */
export const OSSZES_GENERATOR = MODULOK.flatMap((m) =>
  m.gen.map((g) => ({ ...g, modul: m.slug })),
);

/**
 * Generátor a GyakorloDoboz `cim`-je alapján. Ha a modul is ismert, azon belül
 * keresünk először (két modulban elvileg lehet azonos cím).
 * Visszatérés: { cim, fn, modul } vagy null.
 */
export function generatorCimAlapjan(cim, modul) {
  if (!cim) return null;
  const c = String(cim).trim();
  if (modul) {
    const t = OSSZES_GENERATOR.find((g) => g.modul === modul && g.cim === c);
    if (t) return t;
  }
  return OSSZES_GENERATOR.find((g) => g.cim === c) || null;
}

/** Kvízkérdés a kérdés szövege (jsxSzoveg) alapján: { k, v, helyes, magyarazat } vagy null. */
export function kvizKerdesAlapjan(szoveg, modul) {
  if (!szoveg) return null;
  const s = String(szoveg).replace(/\s+/g, " ").trim();
  const jeloltek = modul ? MODULOK.filter((m) => m.slug === modul) : MODULOK;
  for (const m of [...jeloltek, ...MODULOK]) {
    const q = (m.kviz || []).find((x) => jsxSzoveg(x.k).replace(/\s+/g, " ").trim() === s);
    if (q) return q;
  }
  return null;
}

/** Hibakereső feladat a címe alapján: { cim, feladat, lepesek, tanulsag } vagy null. */
export function hibakeresoCimAlapjan(cim, modul) {
  if (!cim) return null;
  const c = String(cim).trim();
  const jeloltek = modul ? MODULOK.filter((m) => m.slug === modul) : MODULOK;
  for (const m of [...jeloltek, ...MODULOK]) {
    const f = (m.hibak || []).find((x) => x.cim === c);
    if (f) return f;
  }
  return null;
}
