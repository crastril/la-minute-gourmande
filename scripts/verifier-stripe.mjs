/**
 * Affiche à quel compte Stripe la clé configurée appartient réellement.
 *
 *   npm run stripe:verifier
 *
 * À lancer après avoir renseigné STRIPE_SECRET_KEY, et à chaque fois qu'un
 * doute existe sur le compte utilisé. C'est le contrôle qui évite d'encaisser
 * les commandes de ce site sur le Stripe d'un autre projet.
 *
 * Lecture seule : le script n'écrit rien et ne crée aucun paiement.
 */
import Stripe from "stripe";

const cle = process.env.STRIPE_SECRET_KEY?.trim();

if (!cle) {
  console.log("\n  Aucune STRIPE_SECRET_KEY trouvée dans .env.local.");
  console.log("  Le site fonctionne en mode « règlement au comptoir ».\n");
  process.exit(0);
}

const mode = cle.startsWith("sk_live_")
  ? "LIVE (paiements réels)"
  : cle.startsWith("sk_test_")
    ? "TEST (aucun débit réel)"
    : "FORMAT INATTENDU";

try {
  const stripe = new Stripe(cle);
  const compte = await stripe.accounts.retrieve();

  const ligne = (etiquette, valeur) =>
    console.log(`  ${etiquette.padEnd(22)} ${valeur ?? "—"}`);

  console.log("\n  ── Compte Stripe branché sur ce site ──\n");
  ligne("Mode de la clé", mode);
  ligne("Identifiant", compte.id);
  ligne("Nom commercial", compte.business_profile?.name);
  ligne("Site déclaré", compte.business_profile?.url);
  ligne("E-mail du compte", compte.email);
  ligne("Pays / devise", `${compte.country ?? "—"} / ${compte.default_currency?.toUpperCase() ?? "—"}`);
  ligne("Encaissements actifs", compte.charges_enabled ? "oui" : "NON");
  ligne("Virements actifs", compte.payouts_enabled ? "oui" : "NON");

  const banques = compte.external_accounts?.data?.filter((c) => c.object === "bank_account");
  if (banques?.length) {
    for (const banque of banques) {
      ligne("Compte bancaire", `${banque.bank_name ?? "banque"} •••• ${banque.last4}`);
    }
  } else {
    ligne("Compte bancaire", "non exposé par l'API — à vérifier dans le dashboard");
  }

  console.log(
    "\n  ⚠ Vérifiez que le nom ci-dessus est bien celui du client,\n" +
      "    et non celui d'un autre de vos projets Stripe.\n",
  );
} catch (erreur) {
  console.error("\n  Impossible d'interroger Stripe avec cette clé.");
  console.error(`  ${erreur instanceof Error ? erreur.message : erreur}\n`);
  process.exit(1);
}
