"use client";

import { useEffect } from "react";

/**
 * Ábra-illesztő: minden `svg.abra` viewBoxát úgy tágítja, hogy egyetlen felirat,
 * vonal vagy nyíl se lógjon ki a rajzból. A kézzel írt ábráknál könnyű elszámolni a
 * címkék helyét — ez a védőháló az egész oldalon egyszerre kezeli.
 *
 * Csak tágít (soha nem szűkít), és legfeljebb 60 % szélességi / 80 % magassági
 * növekedést enged meg — az ennél nagyobb „kilógás” szándékos (pl. berepülő
 * animációs elem), azt békén hagyja. A láthatatlan (opacity ≈ 0) elemeket kihagyja.
 * Az interaktív ábrák újrarendereléskor visszaállíthatják a viewBoxot, ezért egy
 * MutationObserver figyeli a változásokat és újraszámol.
 */

const FIGYELT = "text, line, path, rect, circle, ellipse, polyline, polygon, image";

function lathato(el) {
  let e = el;
  while (e && e.tagName !== "svg") {
    const st = window.getComputedStyle(e);
    if (st.display === "none" || st.visibility === "hidden" || Number(st.opacity) < 0.05) return false;
    e = e.parentElement;
  }
  return true;
}

function illeszt(svg) {
  const vb = svg.viewBox?.baseVal;
  if (!vb || !vb.width || !vb.height) return;
  const most = svg.getAttribute("viewBox");
  // ha nem mi írtuk az aktuális értéket (a komponens állította át), az az új „eredeti”, és elölről kezdjük
  if (!svg.dataset.vbEredeti || (most !== svg.dataset.vbUtolso && most !== svg.dataset.vbEredeti)) {
    svg.dataset.vbEredeti = `${vb.x} ${vb.y} ${vb.width} ${vb.height}`;
    svg.dataset.vbUtolso = svg.dataset.vbEredeti;
  }
  const [ox, oy, ow, oh] = svg.dataset.vbEredeti.split(" ").map(Number);
  // az alap a legutóbb beállított keret: csak tágítunk, sosem szűkítünk vissza — így nincs
  // oda-vissza ugrálás (a szöveg mért mérete a lépték függvényében kicsit változhat)
  const [ax, ay, aw, ah] = svg.dataset.vbUtolso.split(" ").map(Number);
  let x1 = ax, y1 = ay, x2 = ax + aw, y2 = ay + ah;
  // az elemek koordinátáit a viewBox (felhasználói) rendszerébe visszük: a getCTM a
  // viewport (képernyő-pixel) rendszerbe vinne, ami a rajz megjelenített méretétől függ
  const gyokerInv = svg.getScreenCTM()?.inverse();
  if (!gyokerInv) return;
  const elemek = svg.querySelectorAll(FIGYELT);
  for (const el of elemek) {
    if (el.closest("defs, marker, clipPath, mask, pattern")) continue;
    if (!lathato(el)) continue;
    let b;
    try { b = el.getBBox(); } catch { continue; }
    if (!b || (!b.width && !b.height)) continue;
    const sm = el.getScreenCTM();
    if (!sm) continue;
    const m = gyokerInv.multiply(sm);
    const sarkok = [[b.x, b.y], [b.x + b.width, b.y], [b.x, b.y + b.height], [b.x + b.width, b.y + b.height]];
    for (const [px, py] of sarkok) {
      const p = svg.createSVGPoint();
      p.x = px; p.y = py;
      const q = p.matrixTransform(m);
      if (q.x < x1) x1 = q.x;
      if (q.x > x2) x2 = q.x;
      if (q.y < y1) y1 = q.y;
      if (q.y > y2) y2 = q.y;
    }
  }
  const M = 5; // margó a vonalvastagságnak, nyílhegynek
  const T = 3; // ennyi (viewBox-egység) kilógás alatt nem nyúlunk hozzá
  const nx1 = x1 < ax - T ? Math.floor(x1 - M) : ax;
  const ny1 = y1 < ay - T ? Math.floor(y1 - M) : ay;
  const nx2 = x2 > ax + aw + T ? Math.ceil(x2 + M) : ax + aw;
  const ny2 = y2 > ay + ah + T ? Math.ceil(y2 + M) : ay + ah;
  const ujW = nx2 - nx1, ujH = ny2 - ny1;
  if (ujW === aw && ujH === ah && nx1 === ax && ny1 === ay) return; // nincs változás
  if (ujW > ow * 1.6 || ujH > oh * 1.8) return; // szándékosan kívül lévő elem – békén hagyjuk
  const uj = `${nx1} ${ny1} ${ujW} ${ujH}`;
  svg.dataset.vbUtolso = uj;
  svg.setAttribute("viewBox", uj);
}

function mindetIlleszt(csakLathato = false) {
  document.querySelectorAll("svg.abra").forEach((svg) => {
    if (csakLathato) {
      const r = svg.getBoundingClientRect();
      if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
    }
    try { illeszt(svg); } catch { /* egy hibás ábra ne állítsa le a többit */ }
  });
}

export default function AbraIllesztes() {
  useEffect(() => {
    let idozito = null;
    const kesobb = () => {
      if (idozito) return;
      idozito = window.setTimeout(() => { idozito = null; mindetIlleszt(true); }, 150);
    };
    mindetIlleszt();
    const t1 = window.setTimeout(mindetIlleszt, 600);
    const t2 = window.setTimeout(mindetIlleszt, 2500);
    if (document.fonts?.ready) document.fonts.ready.then(mindetIlleszt).catch(() => {});
    const figyelo = new MutationObserver((valtozasok) => {
      // a saját viewBox-írásunkra ne reagáljunk (végtelen ciklus lenne)
      const idegen = valtozasok.some((v) => v.type !== "attributes" || v.target.getAttribute("viewBox") !== v.target.dataset?.vbUtolso);
      if (idegen) kesobb();
    });
    // csak a viewBox-visszaállítást és az új elemeket figyeljük (az animációk attribútum-változásait nem,
    // az drága lenne); a felhasználói beavatkozás után a képernyőn lévő ábrákat számoljuk újra
    figyelo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["viewBox"] });
    window.addEventListener("resize", kesobb);
    document.addEventListener("input", kesobb, true);
    document.addEventListener("click", kesobb, true);
    document.addEventListener("pointerup", kesobb, true);
    return () => {
      window.clearTimeout(t1); window.clearTimeout(t2); if (idozito) window.clearTimeout(idozito);
      figyelo.disconnect();
      window.removeEventListener("resize", kesobb);
      document.removeEventListener("input", kesobb, true);
      document.removeEventListener("click", kesobb, true);
      document.removeEventListener("pointerup", kesobb, true);
    };
  }, []);
  return null;
}
