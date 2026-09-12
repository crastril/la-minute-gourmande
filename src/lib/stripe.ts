/**
 * Résolution de la clé Stripe du projet.
 *
 * Ce site est branché sur **un seul compte Stripe**, celui de La Minute
 * Gourmande, via la variable d'environnement `STRIPE_SECRET_KEY`. Aucun
 * identifiant de compte n'est écrit en dur : l'isolation vis-à-vis d'un autre
 * projet Stripe tient entièrement à la valeur de cette variable, définie
 * séparément en local (.env.local) et sur Vercel (projet distinct).
 *
 * Les garde-fous ci-dessous existent parce qu'une clé copiée depuis le mauvais
 * dashboard est l'erreur la plus facile à commettre quand on gère plusieurs
 * comptes Stripe. Pour vérifier *à quel compte* la clé appartient réellement :
 * `npm run stripe:verifier`.
 */
export type CleStripe =
  | { etat: "absente" }
  | { etat: "refusee"; raison: string }
  | { etat: "ok"; cle: string; live: boolean };

export function resoudreCleStripe(): CleStripe {
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
