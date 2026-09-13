/**
 * Contrôle la configuration de paiement du site.
 *
 *   npm run stripe:verifier
 *
 * Affiche à quel compte Stripe la clé secrète appartient réellement (c'est le
 * contrôle qui évite d'encaisser les commandes sur le Stripe d'un autre projet),
 * puis vérifie ce dont le paiement intégré a besoin : clé publique cohérente,
 * secret du webhook, webhook déclaré chez Stripe, envoi des e-mails de commande.
 *
 * Lecture seule : le script n'écrit rien et ne crée aucun paiement.
 * Il lit .env.local ; pour contrôler la production, lancer-le avec les
 * variables de production.
 */
import Stripe from "stripe";

const cle = process.env.STRIPE_SECRET_KEY?.trim();
const clePublique = process.env.STRIPE_PUBLISHABLE_KEY?.trim();
const secretWebhook = process.env.STRIPE_WEBHOOK_SECRET?.trim();
const cleResend = process.env.RESEND_API_KEY?.trim();

const ligne = (etiquette, valeur) => console.log(`  ${etiquette.padEnd(29)} ${valeur ?? "—"}`);
const alertes = [];

if (!cle) {
  console.log("\n  Aucune STRIPE_SECRET_KEY trouvée dans .env.local.");
  console.log("  Le site fonctionne en mode « règlement au retrait ».\n");
  process.exit(0);
}

/** "live", "test", ou null si le format est inattendu. */
function modeDe(valeur, prefixe) {
  if (valeur.startsWith(`${prefixe}_live_`)) return "live";
  if (valeur.startsWith(`${prefixe}_test_`)) return "test";
  return null;
}

const mode = modeDe(cle, "sk");

try {
  const stripe = new Stripe(cle);
  const compte = await stripe.accounts.retrieve();

  console.log("\n  ── Compte Stripe branché sur ce site ──\n");
  ligne("Mode de la clé", mode === "live" ? "LIVE (paiements réels)" : mode === "test" ? "TEST (aucun débit réel)" : "FORMAT INATTENDU");
  ligne("Identifiant", compte.id);
  ligne("Nom commercial", compte.business_profile?.name);
  ligne("Site déclaré", compte.business_profile?.url);
  ligne("E-mail du compte", compte.email);
  ligne("Pays / devise", `${compte.country ?? "—"} / ${compte.default_currency?.toUpperCase() ?? "—"}`);
  ligne("Encaissements actifs", compte.charges_enabled ? "oui" : "NON");
  ligne("Virements actifs", compte.payouts_enabled ? "oui" : "NON");

  if (!mode) alertes.push("STRIPE_SECRET_KEY n'a pas le format attendu (sk_test_… ou sk_live_…).");
  if (mode === "live" && !compte.charges_enabled) {
    alertes.push("Encaissements inactifs : terminer l'activation du compte (identité, RIB) avant de vendre.");
  }

  console.log("\n  ── Configuration du paiement intégré ──\n");

  const modePublique = clePublique ? modeDe(clePublique, "pk") : null;
  if (!clePublique) {
    ligne("Clé publique", "ABSENTE");
    alertes.push("STRIPE_PUBLISHABLE_KEY absente : les champs de paiement ne s'afficheront pas.");
  } else if (!modePublique) {
    ligne("Clé publique", "FORMAT INATTENDU");
    alertes.push("STRIPE_PUBLISHABLE_KEY n'a pas le format attendu (pk_test_… ou pk_live_…).");
  } else if (modePublique !== mode) {
    ligne("Clé publique", `${modePublique} ≠ clé secrète ${mode} : INCOHÉRENTE`);
    alertes.push("Clé publique et clé secrète de modes différents : utilisez pk_test_ avec sk_test_, pk_live_ avec sk_live_.");
  } else {
    ligne("Clé publique", `${modePublique}, cohérente avec la clé secrète`);
  }

  if (!secretWebhook) {
    ligne("Secret du webhook", "ABSENT");
    alertes.push("STRIPE_WEBHOOK_SECRET absent : les commandes payées ne seront pas transmises à la boutique.");
  } else if (secretWebhook.startsWith("whsec_local_")) {
    ligne("Secret du webhook", "secret local de test");
    if (mode === "live") alertes.push("Secret de webhook local utilisé avec une clé live : copier le vrai whsec_… du webhook live.");
  } else {
    ligne("Secret du webhook", "présent");
  }

  ligne(
    "E-mails de commande",
    cleResend
      ? `activés → ${process.env.COMMANDES_EMAIL?.trim() || process.env.CONTACT_EMAIL?.trim() || "e-mail de la boutique"}`
      : "INACTIFS (écrits dans les logs)",
  );
  if (!cleResend) alertes.push("RESEND_API_KEY absente : la boutique ne recevra aucune commande par e-mail.");

  const points = await stripe.webhookEndpoints.list({ limit: 100 });
  const webhooks = points.data.filter((p) => p.url.endsWith("/api/stripe/webhook"));
  const evenementsRequis = ["checkout.session.completed", "checkout.session.async_payment_succeeded"];

  if (webhooks.length === 0) {
    ligne("Webhook déclaré chez Stripe", `AUCUN (mode ${mode})`);
    alertes.push(
      mode === "live"
        ? "Aucun webhook /api/stripe/webhook déclaré en mode live."
        : "Aucun webhook déclaré en mode test (normal en local : les tests signent leurs propres événements).",
    );
  }
  for (const point of webhooks) {
    const manquants = evenementsRequis.filter(
      (evenement) => !point.enabled_events.includes(evenement) && !point.enabled_events.includes("*"),
    );
    ligne("Webhook déclaré chez Stripe", `${point.url} (${point.status})`);
    if (manquants.length) alertes.push(`Webhook ${point.url} : événements manquants ${manquants.join(", ")}.`);
    if (point.status !== "enabled") alertes.push(`Webhook ${point.url} désactivé.`);
  }

  console.log("");
  if (alertes.length === 0) {
    console.log("  ✓ Configuration complète.\n");
  } else {
    console.log("  ── À corriger ──\n");
    for (const alerte of alertes) console.log(`  • ${alerte}`);
    console.log("");
  }

  console.log(
    "  ⚠ Vérifiez que le nom commercial ci-dessus est bien celui du client,\n" +
      "    et non celui d'un autre de vos projets Stripe.\n",
  );
} catch (erreur) {
  console.error("\n  Impossible d'interroger Stripe avec cette clé.");
  console.error(`  ${erreur instanceof Error ? erreur.message : erreur}\n`);
  process.exit(1);
}
