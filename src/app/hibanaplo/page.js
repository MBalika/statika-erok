import Hibanaplo from "@/components/Hibanaplo";

export const metadata = {
  title: "Hibanapló",
  description:
    "Amit elrontottál — gyakorló feladat, kvízkérdés, hibakereső —, itt gyűlik modulonként, és itt ismételheted ugyanazt a típust, amíg nem megy.",
};

export default function HibanaploOldal() {
  return (
    <>
      <div className="racs-hatter border-b border-petrol-800 bg-linear-to-br from-petrol-900 via-petrol-800 to-petrol-700">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-rose-500 text-[15px] font-bold text-white">✗</span>
            <span className="text-[11px] font-semibold tracking-[0.2em] text-petrol-300 uppercase">Ismétléses tanulás</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">Hibanapló</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-petrol-200">
            A statikát nem az érti meg, aki sosem téved, hanem aki a tévedéseit még egyszer megcsinálja — jól. Amit a gyakorló
            feladatokban, a kvízekben vagy a hibakeresőkben elrontasz, ide kerül; az „Ismételd a hibáidat” gomb sorban újra
            felteszi ugyanazt a feladattípust új számokkal. Két sikeres ismétlés után a hiba javítva.
          </p>
        </div>
      </div>
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <Hibanaplo />
      </section>
    </>
  );
}
