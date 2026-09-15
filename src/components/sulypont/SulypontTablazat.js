import { sz } from "@/lib/szamok";

/**
 * A tankönyv 9.5. ábrájának táblázata: i, A_i, y_i, z_i, A_i·y_i, A_i·z_i,
 * összegsor, majd az osztás. Szerver- és kliensoldalon is használható.
 *
 *   sorok: [{ nev?, A, y, z }]   – A előjeles (a kivont rész negatív)
 *   egyseg: "mm" | "cm"
 *   tizedes: { A?, k?, S? }      – tizedesjegyek a területhez, a koordinátákhoz, a nyomatékhoz
 *   csakZ: true → az y oszlopok elrejtése (szimmetrikus idomnál)
 */
export default function SulypontTablazat({ sorok, egyseg = "mm", tizedes = {}, csakZ = false, kicsi = false }) {
  const tA = tizedes.A ?? 0;
  const tK = tizedes.k ?? 2;
  const tS = tizedes.S ?? 0;
  const A = sorok.reduce((s, r) => s + r.A, 0);
  const Sz = sorok.reduce((s, r) => s + r.A * r.y, 0);
  const Sy = sorok.reduce((s, r) => s + r.A * r.z, 0);
  const e2 = `${egyseg}²`;
  const e3 = `${egyseg}³`;
  const ezres = (v, t) => {
    const s = sz(v, t);
    const [eg, tort] = s.split(",");
    const neg = eg.startsWith("-");
    const szam = (neg ? eg.slice(1) : eg).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return (neg ? "−" : "") + szam + (tort ? "," + tort : "");
  };
  const th = "px-2 py-1 text-right font-semibold";
  const td = "px-2 py-1 text-right";
  return (
    <div className={`my-3 overflow-x-auto rounded-xl border border-petrol-200 bg-white ${kicsi ? "text-[12px]" : "text-[13px]"}`}>
      <table className="szamok w-full text-petrol-800">
        <thead className="bg-petrol-50 text-[10.5px] tracking-wider text-petrol-500 uppercase">
          <tr>
            <th className="px-2 py-1 text-left font-semibold">i</th>
            <th className={th}>Aᵢ [{e2}]</th>
            {!csakZ && <th className={th}>yᵢ [{egyseg}]</th>}
            <th className={th}>zᵢ [{egyseg}]</th>
            {!csakZ && <th className={th}>Aᵢ·yᵢ [{e3}]</th>}
            <th className={th}>Aᵢ·zᵢ [{e3}]</th>
          </tr>
        </thead>
        <tbody>
          {sorok.map((r, i) => (
            <tr key={i} className="border-t border-petrol-100">
              <td className="px-2 py-1 text-left font-semibold text-petrol-700">
                {i + 1}.
                {r.nev ? <span className="ml-1 font-normal text-petrol-400">{r.nev}</span> : null}
              </td>
              <td className={`${td} ${r.A < 0 ? "text-rose-700" : ""}`}>{ezres(r.A, tA)}</td>
              {!csakZ && <td className={td}>{sz(r.y, tK)}</td>}
              <td className={td}>{sz(r.z, tK)}</td>
              {!csakZ && <td className={`${td} ${r.A < 0 ? "text-rose-700" : ""}`}>{ezres(r.A * r.y, tS)}</td>}
              <td className={`${td} ${r.A < 0 ? "text-rose-700" : ""}`}>{ezres(r.A * r.z, tS)}</td>
            </tr>
          ))}
          <tr className="border-t-2 border-petrol-300 bg-petrol-50/60 font-semibold text-petrol-900">
            <td className="px-2 py-1 text-left">Σ</td>
            <td className={td}>A = {ezres(A, tA)}</td>
            {!csakZ && <td className={td}>–</td>}
            <td className={td}>–</td>
            {!csakZ && <td className={td}>Sz = {ezres(Sz, tS)}</td>}
            <td className={td}>Sy = {ezres(Sy, tS)}</td>
          </tr>
          <tr className="border-t border-petrol-100 font-semibold text-naracs-700">
            <td className="px-2 py-1 text-left">÷ A</td>
            <td className={td}></td>
            {!csakZ && <td className={td}></td>}
            <td className={td}></td>
            {!csakZ && <td className={td}>yₛ = {sz(Sz / A, tK)}</td>}
            <td className={td}>zₛ = {sz(Sy / A, tK)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
