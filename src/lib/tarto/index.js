/**
 * Tartószerkezeti igénybevétel-számító — nyilvános felület.
 *
 *   import { elemez } from "@/lib/tarto";
 *   const eredmeny = elemez(modell);
 *
 * A modell alakját a modell.js fejléce írja le. Minden mértékegység kN, m, kNm.
 */

import { normalizal, fokszamMerleg } from "./modell.js";
import { megoldSzerkezet } from "./megold.js";
import { rudIgenybevetel, ertekek, mintak, ugrasok } from "./igenybevetel.js";

export { normalizal, fokszamMerleg } from "./modell.js";
export { rudIgenybevetel, ertekek, mintak, ugrasok } from "./igenybevetel.js";

/** Egy megoszló teherrész integráljai: ∫q dξ és ∫ξq dξ. */
function integralok(q1, q2, a1, a2) {
  const dL = a2 - a1;
  const m = (q2 - q1) / dL;
  const I0 = q1 * dL + (m * dL * dL) / 2;
  const I1 = a1 * q1 * dL + (a1 * m * dL * dL) / 2 + (q1 * dL * dL) / 2 + (m * dL * dL * dL) / 3;
  return { I0, I1 };
}

/** Az összes aktív teher eredője és nyomatéka az origóra. */
export function teherEredo(m) {
  let Fx = 0, Fy = 0, M = 0;
  m.csomopontiTerhek.forEach((t, i) => {
    const cs = m.csomopontok[i];
    Fx += t.Fx; Fy += t.Fy;
    M += cs.x * t.Fy - cs.y * t.Fx + t.M;
  });
  for (const r of m.rudak) {
    const { cos: c, sin: s, x1, y1 } = r;
    for (const p of r.pontTerhek) {
      const gx = p.Px * c - p.Py * s;
      const gy = p.Px * s + p.Py * c;
      const px = x1 + p.a * c;
      const py = y1 + p.a * s;
      Fx += gx; Fy += gy;
      M += px * gy - py * gx + p.Mz;
    }
    for (const mm of r.megoszlok) {
      const x = integralok(mm.qx1, mm.qx2, mm.a1, mm.a2);
      const y = integralok(mm.qy1, mm.qy2, mm.a1, mm.a2);
      Fx += x.I0 * c - y.I0 * s;
      Fy += x.I0 * s + y.I0 * c;
      M += (x1 * s - y1 * c) * x.I0 + (x1 * c + y1 * s) * y.I0 + y.I1;
    }
  }
  return { Fx, Fy, M };
}

/** Teljes elemzés: reakciók, igénybevételi függvények, ellenőrzés. */
export function elemez(be) {
  const m = normalizal(be);
  if (m.hibak.length > 0) {
    return { ok: false, hibak: m.hibak, modell: m };
  }
  const merleg = fokszamMerleg(m);
  const megoldas = megoldSzerkezet(m);
  if (!megoldas.ok && megoldas.eltolodasok === null) {
    return { ok: false, hibak: megoldas.hibak, modell: m, merleg };
  }

  const igenybevetelek = megoldas.rudVegErok.map(({ rud, p }) => ({
    ...rudIgenybevetel(rud, p),
    rudVegErok: p,
    szogFok: rud.szogFok,
    kezdo: [rud.x1, rud.y1],
    veg: [rud.x2, rud.y2],
    pozitivOldal: rud.pozitivOldal,
  }));

  // ---- ellenőrzés: a terhek és a reakciók együtt egyensúlyi erőrendszert alkotnak ----
  const teher = teherEredo(m);
  let rFx = 0, rFy = 0, rM = 0;
  for (const r of megoldas.reakciok) {
    const cs = m.csomopontok.find((c) => c.id === r.csomopont);
    const fx = r.Fx ?? 0, fy = r.Fy ?? 0;
    rFx += fx; rFy += fy;
    rM += cs.x * fy - cs.y * fx + (r.M ?? 0);
  }
  const nagysag = Math.max(
    1,
    Math.abs(teher.Fx), Math.abs(teher.Fy), Math.abs(teher.M),
    Math.abs(rFx), Math.abs(rFy), Math.abs(rM),
  );
  const ellenorzes = {
    SzFx: teher.Fx + rFx,
    SzFy: teher.Fy + rFy,
    SzM: teher.M + rM,
    rendben:
      Math.abs(teher.Fx + rFx) < 1e-6 * nagysag &&
      Math.abs(teher.Fy + rFy) < 1e-6 * nagysag &&
      Math.abs(teher.M + rM) < 1e-6 * nagysag,
  };

  const tipus =
    merleg.fok < 0 ? "mechanizmus" : merleg.fok === 0 ? "hatarozott" : "hatarozatlan";

  return {
    ok: true,
    hibak: megoldas.hibak,
    modell: m,
    merleg: { ...merleg, tipus },
    reakciok: megoldas.reakciok,
    igenybevetelek,
    ellenorzes,
    // határozatlan szerkezetnél az eredmény függ az EI/EA aránytól
    merevsegfuggo: merleg.fok > 0,
  };
}
