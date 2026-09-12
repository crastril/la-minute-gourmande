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
    default: `${RESTAURANT.nom} — Traiteur & cuisine du jour à ${RESTAURANT.ville}`,
    template: `%s · ${RESTAURANT.nom}`,
  },
  description:
    "Cuisine maison préparée chaque matin, commande en ligne et retrait en 15 minutes. Plats du jour, formules déjeuner et service traiteur pour vos événements.",
  keywords: [
    "traiteur",
    RESTAURANT.ville,
    "plat du jour",
    "click and collect",
    "cuisine maison",
    "commande en ligne",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: RESTAURANT.nom,
    title: `${RESTAURANT.nom} — le fait-maison, à la minute`,
    description:
      "Commandez votre déjeuner en ligne, récupérez-le chaud 15 minutes plus tard.",
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
