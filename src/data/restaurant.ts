/**
 * Informations de l'établissement.
 * ⚠️ Valeurs de démonstration : à remplacer par les données réelles du client
 * (adresse, téléphone, horaires exacts, SIRET, réseaux sociaux).
 */
export const RESTAURANT = {
  nom: "La Minute Gourmande",
  baseline: "Boulangerie et restauration, en face du lycée.",
  ville: "Bordeaux",
  adresse: "18 rue des Faussets",
  codePostal: "33000",
  telephone: "05 56 00 00 00",
  telephoneLien: "+33556000000",
  email: "bonjour@laminutegourmande.fr",
  url: "https://laminutegourmande.fr",
  instagram: "https://instagram.com/laminutegourmande",
  facebook: "https://facebook.com/laminutegourmande",
  fondation: 2019,
  /** Temps de préparation annoncé pour une commande de restauration. */
  delaiRetrait: 15,
} as const;

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
