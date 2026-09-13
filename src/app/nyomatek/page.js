import Hamarosan from "@/components/Hamarosan";

export const metadata = { title: "Nyomaték, eredő, redukálás" };

export default function Oldal() {
  return (
    <Hamarosan
      szam={2}
      cim="Nyomaték, eredő, redukálás"
      leiras="Forgatónyomaték síkban és térben, erőpár, erőrendszer redukálása egy pontra, és az eredő három lehetséges esete."
      tartalom={[
        "Forgatónyomaték definíciója, erőkar, előjelszabály",
        "Térbeli nyomaték vektoriális szorzattal (r × F)",
        "Erőpár és nyomatéki vektor",
        "Erőrendszer redukálása az origóra: R és M⁰",
        "Az eredő három esete: erő, forgatónyomaték, zérusrendszer",
        "Az eredő hatásvonalának helye (MR = R · k)",
      ]}
    />
  );
}
