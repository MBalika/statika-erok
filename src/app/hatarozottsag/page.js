import Hamarosan from "@/components/Hamarosan";

export const metadata = { title: "Statikai határozottság" };

export default function Oldal() {
  return (
    <Hamarosan
      szam={8}
      cim="Statikai határozottság"
      leiras="Mikor oldható meg a feladat az egyensúlyi egyenletekkel: ismeretlenek és egyenletek, kritikus elrendezés, mechanizmus és határozatlan tartó. (Tankönyv 7. fejezet.)"
      tartalom={[
        "Az egyenletrendszer megoldhatósága; a feladat és a tartó határozottsága",
        "Síkban 3 · testek = kényszerek; rácsos tartón r + k = 2c",
        "A kivételek: kritikus elrendezés (párhuzamos vagy egy ponton átmenő hatásvonalak)",
        "Szerkezet-építő: támaszok ki-be, élő számláló, összecsukló mechanizmus",
        "„Stabil vagy mozog?” játék",
        "Határozatlan tartó: miért kell a merevség (Szilárdságtan)",
      ]}
    />
  );
}
