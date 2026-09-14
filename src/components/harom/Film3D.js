"use client";

import dynamic from "next/dynamic";

/* A 3D jelenetek csak a böngészőben töltődnek be (Three.js), és csak azon az oldalon, ahol kellenek. */

function Betoltes() {
  return (
    <div className="flex h-[420px] w-full items-center justify-center rounded-2xl border border-[color:var(--keret)] bg-white text-[13px] text-petrol-500">
      A 3D jelenet betöltése…
    </div>
  );
}

export const Film3DTerbeliOsszeg = dynamic(() => import("./FilmTerbeliOsszeg"), { ssr: false, loading: Betoltes });
export const Film3DVektorSzorzat = dynamic(() => import("./FilmVektorSzorzat"), { ssr: false, loading: Betoltes });
export const Film3DHasab = dynamic(() => import("./FilmHasab"), { ssr: false, loading: Betoltes });
export const Film3DTeherLepel = dynamic(() => import("./FilmTeherLepel"), { ssr: false, loading: Betoltes });
export const Film3DKeresztmetszet = dynamic(() => import("./FilmKeresztmetszet"), { ssr: false, loading: Betoltes });
