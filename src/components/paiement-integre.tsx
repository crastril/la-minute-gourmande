"use client";

import {
  CheckoutElementsProvider,
  ContactDetailsElement,
  PaymentElement,
  useCheckoutElements,
} from "@stripe/react-stripe-js/checkout";
import { loadStripe, type Appearance, type Stripe } from "@stripe/stripe-js";
import { useState } from "react";
import { prix } from "@/lib/format";

/**
 * Paiement intégré au site (Checkout Sessions en `ui_mode: "elements"`).
 *
 * - Les champs de carte sont des iframes Stripe : les données bancaires ne
 *   touchent jamais notre serveur.
 * - Le champ e-mail (Contact Details Element) active Link : un client déjà
 *   inscrit reçoit un code et retrouve sa carte enregistrée.
 * - 3D Secure est géré par Stripe ; après validation, Stripe renvoie vers la
 *   page de confirmation, qui revérifie le paiement côté serveur.
 */

// loadStripe ne doit être appelé qu'une fois par clé : le fournisseur refuse
// qu'on change son instance Stripe en cours de route.
const instances = new Map<string, Promise<Stripe | null>>();

function chargerStripe(clePublique: string): Promise<Stripe | null> {
  let instance = instances.get(clePublique);
  if (!instance) {
    instance = loadStripe(clePublique, { locale: "fr" });
    instances.set(clePublique, instance);
  }
  return instance;
}

/** Les champs Stripe reprennent la charte : crème, encre, orange de l'enseigne. */
const APPARENCE: Appearance = {
  theme: "stripe",
  variables: {
    colorPrimary: "#de5321",
    colorBackground: "#fffaf4",
    colorText: "#171513",
    colorTextSecondary: "#4b423a",
    colorDanger: "#b3261e",
    fontFamily: "Barlow, system-ui, sans-serif",
    // 16 px minimum : en dessous, Safari iOS zoome sur le champ au toucher.
    fontSizeBase: "16px",
    borderRadius: "10px",
  },
  rules: {
    ".Input": { border: "1px solid rgba(23, 21, 19, 0.18)", boxShadow: "none" },
    ".Input:focus": {
      borderColor: "#de5321",
      boxShadow: "0 0 0 3px rgba(222, 83, 33, 0.18)",
    },
    ".Label": { fontWeight: "600", color: "#4b423a" },
    ".Tab--selected": { borderColor: "#de5321" },
  },
};

const POLICES = [
  { cssSrc: "https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600&display=swap" },
];

export function PaiementIntegre({
  clientSecret,
  clePublique,
  email,
  total,
  onRetour,
}: {
  clientSecret: string;
  clePublique: string;
  /** E-mail saisi dans le formulaire, pour pré-remplir le champ Link. */
  email: string;
  /** Total en centimes, recalculé par le serveur à la création de la session. */
  total: number;
  onRetour: () => void;
}) {
  return (
    <CheckoutElementsProvider
      stripe={chargerStripe(clePublique)}
      options={{
        clientSecret,
        elementsOptions: { appearance: APPARENCE, fonts: POLICES },
        ...(email ? { defaultValues: { email } } : {}),
      }}
    >
      <FormulairePaiement total={total} onRetour={onRetour} />
    </CheckoutElementsProvider>
  );
}

function FormulairePaiement({ total, onRetour }: { total: number; onRetour: () => void }) {
  const etat = useCheckoutElements();
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  if (etat.type === "loading") {
    return (
      <div className="rounded-ticket border border-encre/12 bg-carte/50 p-8">
        <p className="chiffres text-sm text-encre-pale" aria-live="polite">
          Chargement du paiement sécurisé…
        </p>
      </div>
    );
  }

  if (etat.type === "error") {
    return (
      <div role="alert" className="rounded-ticket border border-brique/40 bg-brique/10 p-6 sm:p-8">
        <p className="font-display text-xl text-encre">Le paiement n&apos;a pas pu s&apos;afficher.</p>
        <p className="mt-2 text-sm text-encre-douce">{etat.error.message}</p>
        <button
          type="button"
          onClick={onRetour}
          className="mt-5 rounded-full border-2 border-encre px-5 py-2.5 font-display text-sm font-semibold tracking-[0.08em] uppercase transition-colors hover:bg-encre hover:text-papier"
        >
          Revenir à la commande
        </button>
      </div>
    );
  }

  const { checkout } = etat;

  async function payer(evenement: React.FormEvent<HTMLFormElement>) {
    evenement.preventDefault();
    setErreur(null);
    setEnvoi(true);

    // En cas de succès, Stripe redirige vers la page de confirmation : on
    // n'arrive ici qu'en cas d'erreur immédiate (carte refusée, champ incomplet…).
    const resultat = await checkout.confirm();
    if (resultat.type === "error") {
      setErreur(resultat.error.message);
      setEnvoi(false);
    }
  }

  return (
    <form onSubmit={payer} className="rounded-ticket border border-encre/12 bg-carte/50 p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="sur-titre">Paiement sécurisé</p>
          <h2 className="mt-2 font-display text-2xl text-encre">Réglez votre commande</h2>
        </div>
        <button
          type="button"
          onClick={onRetour}
          disabled={envoi}
          className="shrink-0 text-sm text-encre-douce underline underline-offset-4 transition-colors hover:text-orange-fonce disabled:opacity-40"
        >
          Modifier
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-5">
        <ContactDetailsElement />
        <PaymentElement options={{ layout: "tabs" }} />
      </div>

      {erreur && (
        <p
          role="alert"
          className="mt-5 rounded-ticket border border-brique/40 bg-brique/10 px-4 py-3 text-sm text-brique"
        >
          {erreur}
        </p>
      )}

      <button
        type="submit"
        disabled={envoi}
        className="mt-7 w-full rounded-full bg-orange px-6 py-4 font-display text-[1.05rem] font-semibold tracking-[0.08em] text-encre uppercase transition-colors hover:bg-orange-vif disabled:cursor-not-allowed disabled:opacity-60"
      >
        {envoi ? "Paiement en cours…" : `Payer ${prix(total)}`}
      </button>

      <p className="mt-4 text-[0.78rem] leading-relaxed text-encre-pale">
        Paiement chiffré et traité par Stripe : vos données bancaires ne passent
        jamais par nos serveurs. Votre banque peut vous demander une validation
        (3D Secure).
      </p>
    </form>
  );
}
