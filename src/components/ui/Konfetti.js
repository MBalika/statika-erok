"use client";

import { useEffect, useRef } from "react";

/** Rövid konfetti-zápor a képernyő tetejéről. Saját canvas, könyvtár nélkül. */
export default function Konfetti({ aktiv, onVege, ido = 1900 }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!aktiv) return undefined;
    const c = ref.current;
    if (!c) return undefined;
    const ctx = c.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = window.innerWidth * dpr;
    c.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);
    const W = window.innerWidth;
    const H = window.innerHeight;
    const szinek = ["#f97316", "#3a8798", "#7c3aed", "#15803d", "#fbbf24", "#e11d48"];
    const db = Math.min(180, Math.round(W / 7));
    const r = [];
    for (let i = 0; i < db; i++) {
      r.push({
        x: Math.random() * W,
        y: -20 - Math.random() * H * 0.3,
        vx: (Math.random() - 0.5) * 2.2,
        vy: 2.5 + Math.random() * 3.5,
        w: 6 + Math.random() * 6,
        h: 8 + Math.random() * 8,
        f: Math.random() * Math.PI * 2,
        vf: (Math.random() - 0.5) * 0.25,
        sz: szinek[Math.floor(Math.random() * szinek.length)],
      });
    }
    let raf;
    const kezd = performance.now();
    const rajzol = (most) => {
      const t = most - kezd;
      ctx.clearRect(0, 0, W, H);
      const halv = t > ido - 500 ? 1 - (t - (ido - 500)) / 500 : 1;
      r.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.f += p.vf;
        p.vy += 0.05;
        ctx.save();
        ctx.globalAlpha = Math.max(0, halv);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.f);
        ctx.fillStyle = p.sz;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      if (t < ido) raf = requestAnimationFrame(rajzol);
      else {
        ctx.clearRect(0, 0, W, H);
        onVege?.();
      }
    };
    raf = requestAnimationFrame(rajzol);
    return () => cancelAnimationFrame(raf);
  }, [aktiv, ido, onVege]);

  if (!aktiv) return null;
  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 z-[100]"
      style={{ width: "100vw", height: "100vh" }}
      aria-hidden="true"
    />
  );
}
