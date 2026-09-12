import type { Metadata } from "next";
import { Suspense } from "react";
import { PanierClient } from "@/components/panier-client";

export const metadata: Metadata = {
  title: "Votre panier",
  description: "Vérifiez votre commande, choisissez votre créneau de retrait et validez.",
  robots: { index: false, follow: false },
};

export default function Panier() {
  return (
    <section className="mx-auto max-w-[1240px] px-5 pt-16 pb-24 sm:px-8 sm:pt-24">
      <p className="sur-titre">Étape finale</p>
      <h1 className="mt-5 text-[clamp(2.4rem,6vw,4.4rem)] leading-[0.95]">
        Votre <span className="text-beurre italic">commande</span>
      </h1>

      <div className="mt-12">
        <Suspense
          fallback={<p className="chiffres text-sm text-creme-tres-doux">Chargement du panier…</p>}
        >
          <PanierClient />
        </Suspense>
      </div>
    </section>
  );
}
