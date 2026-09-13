/**
 * Informations de l'établissement.
 *
 * Coordonnées reprises de l'enseigne extérieure et de l'affiche d'ouverture
 * fournies par le client (dossier `identité/`).
 * ⚠️ Restent à confirmer : le domaine du site et les horaires d'ouverture.
 */
export const RESTAURANT = {
  nom: "Minute Gourmande",
  /** Mention du logo (French West Indies). */
  suffixe: "FWI",
  baseline: "Fait maison avec passion.",
  activites: ["Sandwicherie", "Pâtisserie", "Restauration rapide"],
  ville: "Le François",
  region: "Martinique",
  adresse: "16 rue Frantz Fanon",
  codePostal: "97240",
  telephone: "0696 10 19 47",
  telephoneLien: "+596696101947",
  email: "minutegourmande.fwi@gmail.com",
  instagram: "https://instagram.com/minutegourmande.fwi",
  instagramPseudo: "minutegourmande.fwi",
  /** ⚠️ Domaine non encore réservé : à confirmer avant la mise en ligne. */
  url: "https://minutegourmande.fr",
  /** Grande ouverture annoncée sur l'affiche. */
  ouverture: "2026-09-03",
  /** Temps de préparation annoncé pour une commande de restauration. */
  delaiRetrait: 15,
} as const;

/** Date d'ouverture lisible, calculée dans le fuseau de la Martinique. */
export const DATE_OUVERTURE = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
  timeZone: "America/Martinique",
}).format(new Date(`${RESTAURANT.ouverture}T12:00:00-04:00`));

/** ⚠️ Horaires non communiqués : valeurs provisoires à remplacer. */
export const HORAIRES = [
  { jour: "Lundi", service: "06h30 — 19h00" },
  { jour: "Mardi", service: "06h30 — 19h00" },
  { jour: "Mercredi", service: "06h30 — 19h00" },
  { jour: "Jeudi", service: "06h30 — 19h00" },
  { jour: "Vendredi", service: "06h30 — 19h00" },
  { jour: "Samedi", service: "07h00 — 13h00" },
  { jour: "Dimanche", service: "Fermé", ferme: true },
] as const;

/**
 * Créneaux de retrait proposés pour les commandes de restauration.
 * Le service du midi uniquement : c'est le seul moment où la cuisine tourne.
 */
export const CRENEAUX = [
  "11h30",
  "11h45",
  "12h00",
  "12h15",
  "12h30",
  "12h45",
  "13h00",
  "13h15",
  "13h30",
] as const;
