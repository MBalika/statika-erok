import ZhSzimulator from "@/components/zh/ZhSzimulator";

export const metadata = {
  title: "Zh-szimulátor",
  description: "Tíz véletlen statikafeladat órával, segítség nélkül — mint a zárthelyin. Eredmény, levezetés, mentett előzmények.",
};

export default function ZhOldal() {
  return (
    <>
      <div className="racs-hatter border-b border-petrol-800 bg-linear-to-br from-petrol-900 via-petrol-800 to-petrol-700">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-naracs-500 text-[15px] font-bold text-white">zh</span>
            <span className="text-[11px] font-semibold tracking-[0.2em] text-petrol-300 uppercase">Próbazárthelyi</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">Zh-szimulátor</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-petrol-200">
            Tíz feladat, egy minden modulból, órával és visszajelzés nélkül — ahogy a zárthelyin. A végén
            mezőnként látod az eredményt, és megnézheted a levezetést. Az eredmények a böngésződben megmaradnak.
          </p>
        </div>
      </div>
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <ZhSzimulator />
      </section>
    </>
  );
}
