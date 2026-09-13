/**
 * Paramètres des conditions générales de vente.
 *
 * ⚠️ Les règles commerciales ci-dessous (délai d'annulation, conservation d'une
 * commande non retirée…) sont des valeurs proposées par défaut : elles doivent
 * être validées par le client. Les CGV complètes sont à faire relire par un
 * professionnel du droit avant d'encaisser des paiements.
 *
 * `version` est enregistrée avec chaque commande (métadonnées Stripe) : changer
 * les CGV impose de changer la version.
 */
export const CGV = {
  version: "2026-09-13",
  /** Annulation gratuite possible jusqu'à ce délai avant l'heure de retrait. */
  delaiAnnulationMinutes: 30,
  /** Durée pendant laquelle une commande est conservée après l'heure de retrait. */
  conservationMinutes: 30,
  /** Délai maximal pour effectuer un remboursement accordé. */
  delaiRemboursementJours: 14,
} as const;

export const DATE_CGV = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
  timeZone: "America/Martinique",
}).format(new Date(`${CGV.version}T12:00:00-04:00`));
