import Hamarosan from "@/components/Hamarosan";

export const metadata = { title: "Igénybevételi ábrák" };

export default function Oldal() {
  return (
    <Hamarosan
      szam={9}
      cim="Igénybevételi ábrák"
      leiras="Normálerő, nyíróerő, hajlítónyomaték: számítás egy keresztmetszetben, függvények és ábrák, differenciális összefüggések, ferde és tört tengelyű tartó, Gerber-tartó. (Tankönyv 8. fejezet, H09–H12.) Az Ábrakalkulátor már most használható."
      tartalom={[
        "N, V, M definíciója és előjelszabálya (a követő tartórész)",
        "Igénybevétel számítása egy keresztmetszetben",
        "dV/dx = −q, dM/dx = V és következményeik",
        "„Vágd el a tartót” felfedező és ábrarajzoló játék",
        "Ferde és tört tengelyű tartó, elágazás, Gerber-tartó ábrái",
        "A tankönyv 8.4 tippjei és trükkjei filmen",
      ]}
    />
  );
}
