"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* ---------- segédfüggvények animációhoz ---------- */

export const simit = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u)); // smoothstep
export const beKi = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : 0.5 - 0.5 * Math.cos(Math.PI * u));
export const rugo = (u) => {
  if (u <= 0) return 0;
  if (u >= 1) return 1;
  const c = 1.70158 + 1;
  return 1 + c * Math.pow(u - 1, 3) + (c - 1) * Math.pow(u - 1, 2);
};

/** 0→1 arány t0 és t1 között, simítással. */
export function arany(t, t0, t1, gorbe = simit) {
  if (t1 <= t0) return t >= t0 ? 1 : 0;
  return gorbe((t - t0) / (t1 - t0));
}

export const lerp = (a, b, u) => a + (b - a) * u;

/** Kezdőponttól a végpontig „húzódó” szakasz végpontja. */
export function huzas(x1, y1, x2, y2, u) {
  return { x: lerp(x1, x2, u), y: lerp(y1, y2, u) };
}

/** Lüktetés 0..1 között (a másodpercek alapján). */
export const lukteto = (t, per = 1) => 0.5 + 0.5 * Math.sin((2 * Math.PI * t) / per);

/* ---------- az idővonal hook ---------- */

export function useIdovonal(hossz, { autoStart = false } = {}) {
  const [t, setT] = useState(0);
  const [jatszik, setJatszik] = useState(autoStart);
  const [sebesseg, setSebesseg] = useState(1);
  const tRef = useRef(0);
  const utolso = useRef(null);
  const raf = useRef(null);
  const sebRef = useRef(1);
  sebRef.current = sebesseg;

  useEffect(() => {
    if (!jatszik) {
      utolso.current = null;
      return undefined;
    }
    const lepes = (most) => {
      if (utolso.current == null) utolso.current = most;
      const dt = ((most - utolso.current) / 1000) * sebRef.current;
      utolso.current = most;
      let uj = tRef.current + dt;
      if (uj >= hossz) {
        uj = hossz;
        tRef.current = uj;
        setT(uj);
        setJatszik(false);
        return;
      }
      tRef.current = uj;
      setT(uj);
      raf.current = requestAnimationFrame(lepes);
    };
    raf.current = requestAnimationFrame(lepes);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [jatszik, hossz]);

  const ugras = useCallback(
    (ertek) => {
      const uj = Math.max(0, Math.min(hossz, ertek));
      tRef.current = uj;
      setT(uj);
    },
    [hossz],
  );

  const inditas = useCallback(() => {
    if (tRef.current >= hossz - 1e-6) {
      tRef.current = 0;
      setT(0);
    }
    setJatszik(true);
  }, [hossz]);

  const szunet = useCallback(() => setJatszik(false), []);
  const ujra = useCallback(() => {
    tRef.current = 0;
    setT(0);
    setJatszik(true);
  }, []);

  return { t, jatszik, sebesseg, setSebesseg, inditas, szunet, ujra, ugras };
}
