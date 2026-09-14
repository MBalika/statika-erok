"use client";

export default function NyomtatasGomb() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="nyomtatasban-rejtve rounded-xl bg-naracs-500 px-5 py-2.5 text-[14px] font-bold text-white shadow-md shadow-naracs-500/25 transition hover:bg-naracs-600"
    >
      Nyomtatás / PDF mentése
    </button>
  );
}
