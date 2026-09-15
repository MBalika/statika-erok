import Utvonal from "@/components/Utvonal";

export const metadata = {
  title: "Tanulási útvonal",
  description:
    "Hetekre bontott tanulási útvonal az egész félévre: mit olvass a tankönyvben, mit nézz meg az oldalon, mit gyakorolj – a haladásoddal együtt.",
};

export default function UtvonalOldal() {
  return (
    <>
      <div className="racs-hatter border-b border-petrol-800 bg-linear-to-br from-petrol-900 via-petrol-800 to-petrol-700">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-naracs-500 text-[15px] font-bold text-white">13</span>
            <span className="text-[11px] font-semibold tracking-[0.2em] text-petrol-300 uppercase">Hét a félévben</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">Tanulási útvonal</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-petrol-200">
            Hétről hétre: mit olvass a tankönyvben, mit nézz meg itt az oldalon, és melyik szintemelő feladatsort gyakorold.
            Állítsd be, hol tartasz, és a haladásod a modulok játékaiból, kvízeiből és gyakorló feladataiból magától összeáll.
            A kiosztás javaslat — a tanszéki ütemezés eltérhet tőle.
          </p>
        </div>
      </div>
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <Utvonal />
      </section>
    </>
  );
}
