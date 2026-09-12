/**
 * Informations de l'établissement.
 * ⚠️ Valeurs de démonstration : à remplacer par les données réelles du client
 * (adresse, téléphone, horaires, SIRET, réseaux sociaux).
 */
export const RESTAURANT = {
  nom: "La Minute Gourmande",
  baseline: "Le fait-maison, à la minute.",
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
  delaiRetrait: 15,
} as const;

export const HORAIRES = [
  { jour: "Lundi", service: "11h30 — 14h30" },
  { jour: "Mardi", service: "11h30 — 14h30 · 18h30 — 21h00" },
  { jour: "Mercredi", service: "11h30 — 14h30 · 18h30 — 21h00" },
  { jour: "Jeudi", service: "11h30 — 14h30 · 18h30 — 21h00" },
  { jour: "Vendredi", service: "11h30 — 14h30 · 18h30 — 21h30" },
  { jour: "Samedi", service: "10h00 — 15h00" },
  { jour: "Dimanche", service: "Fermé", ferme: true },
] as const;

/** Créneaux de retrait proposés au moment de la commande. */
export const CRENEAUX = [
  "11h45",
  "12h00",
  "12h15",
  "12h30",
  "12h45",
  "13h00",
  "13h15",
  "13h30",
  "18h45",
  "19h00",
  "19h15",
  "19h30",
] as const;
