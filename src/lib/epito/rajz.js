/**
 * A rajzolt (tipp) és a pontos görbék mintavételezése, léptékek — tiszta függvények.
 * A görbék pontjai [x, érték] párok a rúd lokális ívhosszán; a képernyőre a rúd
 * normálisa mentén kerülnek (lásd RajzoloRajz.js).
 */

import { ertek } from "../tarto/polinom.js";

export const LEPES_ERTEK = (hatar) => (hatar > 40 ? 1 : 0.5);

/** „Szép” felső határ a rajzoló sávhoz: a pontos maximum fölé kerekítve, hogy ne árulja el a választ. */
export function szepHatar(max) {
  const cel = Math.max(max * 1.3, 2);
  const lehet = [2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 40, 50, 60, 80, 100, 120, 150, 200, 250, 300, 400, 500];
  return lehet.find((v) => v >= cel) ?? Math.ceil(cel / 100) * 100;
}

/** Osztásköz a sáv feliratozásához. */
export function szepLepes(hatar) {
  const cel = hatar / 2.5;
  const lehet = [0.5, 1, 2, 2.5, 5, 10, 20, 25, 50, 100, 200];
  return lehet.reduce((l, v) => (Math.abs(v - cel) < Math.abs(l - cel) ? v : l), lehet[0]);
}

/** A rajz-sávok léptéke: hatar[jel], leptek[jel] (px / egység), lepes[jel] (a fogópont lépésköze). */
export function rajzLeptekek(f, amp = 56) {
  const ki = { hatar: {}, leptek: {}, lepes: {} };
  for (const jel of ["N", "V", "M"]) {
    const h = szepHatar(f.maxE[jel]);
    ki.hatar[jel] = h;
    ki.leptek[jel] = amp / h;
    ki.lepes[jel] = LEPES_ERTEK(h);
  }
  return ki;
}

/** A rajzolt görbe szakaszonként (rúdanként tömb): [[x, v], …]. */
export function tippGorbe(f, rajz, alakok, szelsok, jel, n = 20) {
  const ki = {};
  for (const r of f.rudak) {
    ki[r.rud] = r.szakaszok.map((s, k) => {
      const v1 = rajz[jel][r.rud][s.iKezd]?.jobb ?? 0;
      const v2 = rajz[jel][r.rud][s.iVeg]?.bal ?? 0;
      const sz_ = jel === "M" ? szelsok?.[r.rud]?.[k] ?? null : null;
      const alak = jel === "M" && !sz_ ? alakok?.[r.rud]?.[k] ?? "egyenes" : "egyenes";
      let fMag = Math.abs(s.q) * s.hossz * s.hossz / 8;
      if (fMag < 1e-9) fMag = 0.12 * f.maxE.M;
      const elojel = alak === "U" ? 1 : -1;
      const ts = sz_ ? Math.min(0.95, Math.max(0.05, (sz_.x - s.x1) / s.hossz)) : 0.5;
      const vs = sz_ ? sz_.ertek : 0;
      const pontok = [];
      for (let i = 0; i <= n; i++) {
        const t = i / n;
        let v;
        if (sz_) v = (v1 * (t - ts) * (t - 1)) / ((0 - ts) * (0 - 1)) + (vs * t * (t - 1)) / (ts * (ts - 1)) + (v2 * t * (t - ts)) / (1 - ts);
        else {
          v = v1 + (v2 - v1) * t;
          if (alak !== "egyenes") v += elojel * fMag * 4 * t * (1 - t);
        }
        pontok.push([s.x1 + s.hossz * t, v]);
      }
      return pontok;
    });
  }
  return ki;
}

/** A pontos görbe ugyanazon az x-rácson. */
export function pontosGorbe(f, jel, n = 20) {
  const ki = {};
  for (const r of f.rudak) {
    ki[r.rud] = r.szakaszok.map((s) => {
      const pontok = [];
      for (let i = 0; i <= n; i++) {
        const x = s.x1 + s.hossz * (i / n);
        pontok.push([x, ertek(s[jel], x)]);
      }
      return pontok;
    });
  }
  return ki;
}

/** A két görbe keveréke (anim 0 = tipp, 1 = pontos). */
export function kevertGorbe(tipp, pontos, anim) {
  const ki = {};
  for (const id of Object.keys(tipp)) ki[id] = tipp[id].map((szak, k) => szak.map((p, i) => [p[0], p[1] + (pontos[id][k][i][1] - p[1]) * anim]));
  return ki;
}
