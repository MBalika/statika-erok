"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Egy {x, y} célértékhez „úszó” érték: ha a cél változik, az aktuális érték
 * simán (requestAnimationFrame-mel) követi. SVG-vonalak animálásához, mert az
 * x1/y1/x2/y2 attribútumokra a CSS-átmenet nem minden böngészőben működik.
 *
 *   const p = useUszo({ x: 3, y: 2 }, 350);   // 350 ms alatt ér oda
 */
export default function useUszo(cel, ido = 350) {
  const [ertek, setErtek] = useState(cel);
  const ref = useRef({ aktualis: cel, keret: null });

  useEffect(() => {
    const indulo = { ...ref.current.aktualis };
    const t0 = performance.now();
    if (ref.current.keret) cancelAnimationFrame(ref.current.keret);
    const lep = (most) => {
      const u = Math.min(1, (most - t0) / ido);
      const s = u * u * (3 - 2 * u); // smoothstep
      const uj = { x: indulo.x + (cel.x - indulo.x) * s, y: indulo.y + (cel.y - indulo.y) * s };
      ref.current.aktualis = uj;
      setErtek(uj);
      if (u < 1) ref.current.keret = requestAnimationFrame(lep);
    };
    ref.current.keret = requestAnimationFrame(lep);
    return () => {
      if (ref.current.keret) cancelAnimationFrame(ref.current.keret);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cel.x, cel.y, ido]);

  return ertek;
}

/** Ugyanez egyetlen számra. */
export function useUszoSzam(cel, ido = 350) {
  const p = useUszo({ x: cel, y: 0 }, ido);
  return p.x;
}
