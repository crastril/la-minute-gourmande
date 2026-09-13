/**
 * Résolution des clés Stripe du projet.
 *
 * Ce site est branché sur **un seul compte Stripe**, celui de Minute Gourmande,
 * via les variables d'environnement `STRIPE_SECRET_KEY` (serveur) et
 * `STRIPE_PUBLISHABLE_KEY` (affichage des champs de paiement). Aucun identifiant
 * de compte n'est écrit en dur : l'isolation vis-à-vis d'un autre projet Stripe
 * tient entièrement à la valeur de ces variables, définies séparément en local
 * (.env.local) et sur Vercel (projet distinct).
 *
 * Deux niveaux de vérification :
 *  - `resoudreCleSecrete()` : la clé secrète seule, suffisante pour les
 *    opérations serveur (webhook, relecture d'une session de paiement) ;
 *  - `resoudreCleStripe()` : clé secrète ET clé publique cohérente, nécessaires
 *    pour proposer le paiement sur le site.
 * Ainsi une clé publique mal copiée coupe l'affichage du paiement, mais pas la
 * transmission à la boutique des commandes déjà payées.
 *
 * Pour vérifier *à quel compte* les clés appartiennent : `npm run stripe:verifier`.
 */
export type CleSecreteStripe =
  | { etat: "absente" }
  | { etat: "refusee"; raison: string }
  | { etat: "ok"; cle: string; live: boolean };

export type CleStripe =
  | { etat: "absente" }
  | { etat: "refusee"; raison: string }
  | { etat: "ok"; cle: string; clePublique: string; live: boolean };

/** Clé secrète seule : pour le webhook et la relecture d'une session. */
export function resoudreCleSecrete(): CleSecreteStripe {
  const cle = process.env.STRIPE_SECRET_KEY?.trim();

  if (!cle) return { etat: "absente" };

  const live = cle.startsWith("sk_live_");
  const test = cle.startsWith("sk_test_");

  if (!live && !test) {
    return {
      etat: "refusee",
      raison:
        "STRIPE_SECRET_KEY n'a pas le format attendu (sk_test_… ou sk_live_…). Clé publiable ou valeur tronquée ?",
    };
  }

  // Une clé live hors production encaisserait de vrais paiements pendant les
  // tests : on refuse plutôt que de laisser passer.
  if (live && process.env.NODE_ENV !== "production") {
    return {
      etat: "refusee",
      raison:
        "Clé Stripe live détectée hors production. Utilisez une clé sk_test_… en développement.",
    };
  }

  return { etat: "ok", cle, live };
}

/** Clé secrète et clé publique cohérente : pour proposer le paiement sur le site. */
export function resoudreCleStripe(): CleStripe {
  const secrete = resoudreCleSecrete();
  if (secrete.etat !== "ok") return secrete;

  const clePublique = process.env.STRIPE_PUBLISHABLE_KEY?.trim();

  if (!clePublique) {
    return {
      etat: "refusee",
      raison:
        "STRIPE_PUBLISHABLE_KEY manquante : sans clé publique, les champs de paiement ne peuvent pas s'afficher.",
    };
  }

  const publiqueLive = clePublique.startsWith("pk_live_");
  const publiqueTest = clePublique.startsWith("pk_test_");

  if (!publiqueLive && !publiqueTest) {
    return {
      etat: "refusee",
      raison: "STRIPE_PUBLISHABLE_KEY n'a pas le format attendu (pk_test_… ou pk_live_…).",
    };
  }

  // Une clé publique de test avec une clé secrète live (ou l'inverse) fait
  // échouer chaque paiement : on le signale plutôt que de le laisser au client.
  if (publiqueLive !== secrete.live) {
    return {
      etat: "refusee",
      raison:
        "Clé publique et clé secrète de modes différents : utilisez pk_test_ avec sk_test_, ou pk_live_ avec sk_live_.",
    };
  }

  return { etat: "ok", cle: secrete.cle, clePublique, live: secrete.live };
}
