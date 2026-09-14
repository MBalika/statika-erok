import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata = {
  title: {
    default: "Statika – Erők és erőrendszerek",
    template: "%s · Statika",
  },
  description:
    "Interaktív tananyag a BME Építőmérnöki Kar Statika tárgyának első heteihez: vektorok, nyomaték és eredő, megoszló erők, súlypont. Elmélet, kidolgozott feladatok, kalkulátorok és gyakorlás.",
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
        <SiteFooter />
      </body>
    </html>
  );
}
