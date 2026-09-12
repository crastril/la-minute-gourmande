import type { Metadata, Viewport } from "next";
import { DM_Mono, Fraunces, Instrument_Sans } from "next/font/google";
import { CartProvider } from "@/components/cart-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { RESTAURANT } from "@/data/restaurant";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-dm-mono",
  display: "swap",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(RESTAURANT.url),
  title: {
    default: `${RESTAURANT.nom} — Boulangerie & restauration à ${RESTAURANT.ville}`,
    template: `%s · ${RESTAURANT.nom}`,
  },
  description:
    "Boulangerie artisanale et restauration du midi. Viennoiseries et snacking au comptoir, menus et plats à réserver en ligne pour un retrait entre 11h30 et 13h30.",
  keywords: [
    "boulangerie",
    RESTAURANT.ville,
    "plat du jour",
    "click and collect",
    "viennoiserie",
    "burger",
    "commande en ligne",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: RESTAURANT.nom,
    title: `${RESTAURANT.nom} — commandez le matin, mangez à midi`,
    description:
      "Réservez votre déjeuner en ligne et récupérez-le à l'heure que vous avez choisie, sans faire la file.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#14110d",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${instrument.variable} ${dmMono.variable}`}>
      <body className="grain min-h-dvh bg-noir antialiased">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-ticket focus:bg-beurre focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-noir"
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
