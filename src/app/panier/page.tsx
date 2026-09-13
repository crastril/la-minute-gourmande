import type { Metadata } from "next";
import { Suspense } from "react";
import { PanierClient } from "@/components/panier-client";
import { resoudreCleStripe } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Votre panier",
  description: "Vérifiez votre commande, choisissez votre créneau de retrait et validez.",
  robots: { index: false, follow: false },
};

// La disponibilité du paiement dépend d'une variable d'environnement : sans
// rendu dynamique, elle serait figée au moment du build et ajouter la clé
// Stripe plus tard n'aurait aucun effet tant qu'on ne redéploie pas.
export const dynamic = "force-dynamic";

export default function Panier() {
  // Décidé côté serveur : le navigateur n'a pas à savoir si une clé Stripe
  // existe, seulement si l'option « payer maintenant » doit être proposée.
  const paiementEnLigneDisponible = resoudreCleStripe().etat === "ok";

  return (
    <section className="mx-auto max-w-[1240px] px-5 pt-16 pb-24 sm:px-8 sm:pt-24">
      <p className="sur-titre">Étape finale</p>
      <h1 className="mt-5 text-[clamp(2.4rem,6vw,4.4rem)] leading-[0.95]">
        Votre <span className="font-script normal-case text-orange">commande</span>
      </h1>

      <div className="mt-12">
        <Suspense
          fallback={<p className="chiffres text-sm text-encre-pale">Chargement du panier…</p>}
        >
          <PanierClient paiementEnLigneDisponible={paiementEnLigneDisponible} />
        </Suspense>
      </div>
    </section>
  );
}
