const EUROS = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

/** Formate un prix stocké en centimes : 1690 → "16,90 €". */
export function prix(centimes: number): string {
  return EUROS.format(centimes / 100);
}

/** Numéro de commande lisible côté comptoir : "LMG-4F2A". */
export function numeroCommande(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffixe = "";
  for (let i = 0; i < 4; i += 1) {
    suffixe += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `LMG-${suffixe}`;
}
