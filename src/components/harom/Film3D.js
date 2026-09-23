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

/* Interaktív 3D felfedezők (csúszkás), szintén csak a böngészőben. */
export const TengelyNyomatekFelfedezo3D = dynamic(() => import("./TengelyNyomatekFelfedezo"), { ssr: false, loading: Betoltes });
export const TeherLepelFelfedezo3D = dynamic(() => import("./TeherLepelFelfedezo"), { ssr: false, loading: Betoltes });
export const JobbkezFelfedezo3D = dynamic(() => import("./JobbkezFelfedezo"), { ssr: false, loading: Betoltes });

/* 10. modul – térbeli tartók (interaktív jelenetek, filmek, játék). */
export const TerbeliSzabadtest3D = dynamic(() => import("./TerbeliSzabadtest"), { ssr: false, loading: Betoltes });
export const TerbeliBakallvany3D = dynamic(() => import("./TerbeliBakallvany"), { ssr: false, loading: Betoltes });
export const TerbeliKonzolVagas3D = dynamic(() => import("./TerbeliKonzolVagas"), { ssr: false, loading: Betoltes });
export const TerbeliRacsos3D = dynamic(() => import("./TerbeliRacsos"), { ssr: false, loading: Betoltes });
export const TerbeliFilmKonzol3D = dynamic(() => import("./TerbeliFilmKonzol"), { ssr: false, loading: Betoltes });
export const TerbeliFilmBakallvany3D = dynamic(() => import("./TerbeliFilmBakallvany"), { ssr: false, loading: Betoltes });
export const TerbeliJatek3D = dynamic(() => import("./TerbeliJatek"), { ssr: false, loading: Betoltes });
