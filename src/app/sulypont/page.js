import Hamarosan from "@/components/Hamarosan";

export const metadata = { title: "Súlypont" };

export default function Oldal() {
  return (
    <Hamarosan
      szam={4}
      cim="Súlypont"
      leiras="Statikai nyomaték, összetett síkidomok súlypontja, kivonásos módszer és köríves alakzatok."
      tartalom={[
        "Statikai nyomaték (Sy, Sz) és a súlypont képlete",
        "Összetett idom felbontása részekre",
        "Kivonásos módszer: lyukak és kivágások",
        "Szimmetria kihasználása",
        "Negyedkör és körcikk súlypontja (4r/3π)",
        "Szelvény-súlypont kalkulátor",
      ]}
    />
  );
}
