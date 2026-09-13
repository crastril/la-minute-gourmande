import type { Metadata, Viewport } from "next";
import { Anton, Barlow, Barlow_Condensed, Kaushan_Script } from "next/font/google";
import { CartProvider } from "@/components/cart-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { RESTAURANT } from "@/data/restaurant";
import "./globals.css";

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

const kaushan = Kaushan_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-kaushan",
  display: "swap",
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(RESTAURANT.url),
  title: {
    default: `${RESTAURANT.nom} — Sandwicherie, pâtisserie & restauration rapide au François`,
    template: `%s · ${RESTAURANT.nom}`,
  },
  description:
    "Sandwicherie, pâtisserie et restauration rapide au François, en Martinique. Viennoiseries et snacking au comptoir, menus et plats du midi à réserver en ligne.",
  keywords: [
    "sandwicherie",
    "pâtisserie",
    "restauration rapide",
    "boulangerie",
    RESTAURANT.ville,
    RESTAURANT.region,
    "click and collect",
    "réservation repas",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: `${RESTAURANT.nom} ${RESTAURANT.suffixe}`,
    title: `${RESTAURANT.nom} — commandez le matin, mangez à midi`,
    description:
      "Réservez votre déjeuner en ligne et récupérez-le à l'heure choisie, sans faire la file. Le François, Martinique.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#faf0e7",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${anton.variable} ${kaushan.variable} ${barlow.variable} ${barlowCondensed.variable}`}
    >
      <body className="grain min-h-dvh bg-papier text-encre antialiased">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-orange focus:px-5 focus:py-2 focus:font-display focus:font-semibold focus:text-encre focus:uppercase"
        >
          Aller au contenu
        </a>
        <CartProvider>
          <SiteHeader />
          <main id="contenu">{children}</main>
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
