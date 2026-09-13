import Hamarosan from "@/components/Hamarosan";

export const metadata = { title: "Megoszló erők" };

export default function Oldal() {
  return (
    <Hamarosan
      szam={3}
      cim="Megoszló erők"
      leiras="Vonal mentén megoszló teher eredőjének nagysága és helye, felbontási technikák, ferde és szakaszos terhek."
      tartalom={[
        "A megoszló teher fogalma, intenzitás (kN/m)",
        "Az eredő nagysága = a teherábra területe",
        "Az eredő helye = a teherábra súlypontja",
        "Trapéz teher kétféle felbontása",
        "Szakaszos és váltakozó irányú terhek",
        "Ferde vonal mentén megoszló erő",
      ]}
    />
  );
}
