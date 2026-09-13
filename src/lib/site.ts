import { RESTAURANT } from "@/data/restaurant";

/**
 * URL publique du site, par ordre de priorité :
 *  1. NEXT_PUBLIC_SITE_URL, à définir une fois le domaine choisi ;
 *  2. l'URL de production Vercel, fournie automatiquement au build ;
 *  3. le domaine prévu, en dernier recours.
 * Sans le point 2, les aperçus de lien partagés (WhatsApp, Instagram…)
 * pointeraient vers un domaine qui n'existe pas encore.
 */
export function urlSite(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return RESTAURANT.url;
}

/**
 * Le site n'est indexé par les moteurs de recherche que sur demande explicite
 * (`AUTORISER_INDEXATION=true`). Tant que prix et horaires sont provisoires,
 * une version de validation ne doit pas apparaître dans Google sous le vrai
 * nom de la boutique.
 */
export function indexationAutorisee(): boolean {
  return process.env.AUTORISER_INDEXATION === "true";
}
