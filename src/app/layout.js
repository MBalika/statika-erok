import AbraIllesztes from "@/components/AbraIllesztes";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata = {
  title: {
    default: "Statika – lépésről lépésre",
    template: "%s · Statika",
  },
  description:
    "Interaktív tananyag a BME Építőmérnöki Kar Statika tárgyának teljes félévéhez: erőrendszerek, nyomaték, megoszló erők, súlypont, tartók reakciói, rácsos tartók, igénybevételi ábrák, térbeli szerkezetek. Elmélet, kidolgozott feladatok filmmel, kalkulátorok, játékok és gyakorlás.",
};

export const viewport = {
  themeColor: "#1d3c48",
};

export default function RootLayout({ children }) {
  return (
    <html lang="hu" className="h-full" suppressHydrationWarning>
      <head>
        {/* a mentett téma a festés előtt, hogy ne villanjon */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("statika-tema")==="sotet"){document.documentElement.classList.add("dark")}}catch(e){}`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <AbraIllesztes />
        <SiteFooter />
      </body>
    </html>
  );
}
