import Hamarosan from "@/components/Hamarosan";

export const metadata = { title: "Térbeli tartók" };

export default function Oldal() {
  return (
    <Hamarosan
      szam={10}
      cim="Térbeli tartók"
      leiras="Térbeli kényszerek és hat egyensúlyi egyenlet, háromlábú bakállvány, befogott térbeli konzol, térbeli rácsos tartó, térbeli igénybevételek — forgatható 3D jelenetekkel. (Tankönyv 9. fejezet, H13.)"
      tartalom={[
        "Térbeli kényszerek és a hat egyensúlyi egyenlet",
        "Síkba vetítés: a térbeli feladat síkbeli rajzai",
        "Háromlábú bakállvány rúderői (3D felfedező)",
        "Mereven befogott térbeli konzol reakciói",
        "Térbeli rácsos tartó",
        "N, V_y, V_z, T, M_y, M_z egy keresztmetszeten (3D elvágás)",
      ]}
    />
  );
}
