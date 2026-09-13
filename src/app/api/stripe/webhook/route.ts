import { NextResponse } from "next/server";
import Stripe from "stripe";
import { sujetTicket, ticketHtml, ticketTexte, type Ticket } from "@/lib/commande";
import { envoyerEmail } from "@/lib/email";
import { resoudreCleSecrete } from "@/lib/stripe";

/**
 * Webhook Stripe : la seule source fiable pour savoir qu'une commande est payée.
 * Le retour du client sur la page de confirmation ne suffit pas (onglet fermé,
 * réseau coupé, paiement validé plus tard par la banque).
 *
 * À déclarer dans Stripe → Développeurs → Webhooks :
 *   URL         https://<site>/api/stripe/webhook
 *   Événements  checkout.session.completed
 *               checkout.session.async_payment_succeeded
 * puis copier le secret de signature (whsec_…) dans STRIPE_WEBHOOK_SECRET.
 *
 * Seule la clé secrète est nécessaire ici : une clé publique mal configurée ne
 * doit pas empêcher de transmettre à la boutique une commande déjà payée.
 *
 * En cas d'échec (Stripe injoignable, e-mail refusé), on répond 500 : Stripe
 * renvoie alors l'événement plus tard. Un renvoi peut produire un e-mail en
 * double, jamais une commande perdue.
 */
export async function POST(req: Request) {
  const cleStripe = resoudreCleSecrete();
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();

  if (cleStripe.etat !== "ok" || !secret) {
    console.error("[webhook] configuration incomplète (STRIPE_SECRET_KEY ou STRIPE_WEBHOOK_SECRET)");
    return NextResponse.json({ erreur: "Webhook non configuré." }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ erreur: "Signature absente." }, { status: 400 });
  }

  // Corps brut indispensable : la signature porte sur les octets exacts reçus.
  const corps = await req.text();
  const stripe = new Stripe(cleStripe.cle);

  let evenement: Stripe.Event;
  try {
    evenement = stripe.webhooks.constructEvent(corps, signature, secret);
  } catch (erreur) {
    console.error("[webhook] signature invalide", erreur);
    return NextResponse.json({ erreur: "Signature invalide." }, { status: 400 });
  }

  if (
    evenement.type !== "checkout.session.completed" &&
    evenement.type !== "checkout.session.async_payment_succeeded"
  ) {
    return NextResponse.json({ recu: true });
  }

  const sessionRecue = evenement.data.object as Stripe.Checkout.Session;

  // Un moyen de paiement asynchrone peut terminer la session avant que l'argent
  // soit encaissé : on attendra alors checkout.session.async_payment_succeeded.
  if (sessionRecue.payment_status !== "paid") {
    return NextResponse.json({ recu: true, enAttente: true });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionRecue.id, {
      expand: ["line_items.data.price.product"],
    });
    const meta = session.metadata ?? {};

    const ticket: Ticket = {
      reference: meta.reference || session.id,
      creneau: meta.creneau || "—",
      reglement: "Payée en ligne",
      // Lien direct vers le paiement : c'est de là que la boutique rembourse.
      lienStripe:
        typeof session.payment_intent === "string"
          ? `https://dashboard.stripe.com/${session.livemode ? "" : "test/"}payments/${session.payment_intent}`
          : null,
      total: session.amount_total ?? 0,
      client: {
        prenom: meta.prenom,
        nom: meta.nom,
        telephone: meta.telephone,
        email: session.customer_details?.email,
      },
      note: meta.note,
      lignes: (session.line_items?.data ?? []).map((ligne) => {
        const produit = ligne.price?.product;
        // La composition d'un menu est portée par la description du produit Stripe.
        const detail =
          typeof produit === "object" && produit !== null && "description" in produit
            ? produit.description
            : null;
        return {
          quantite: ligne.quantity ?? 1,
          nom: ligne.description ?? "Article",
          detail,
          montant: ligne.amount_total,
        };
      }),
    };

    const envoi = await envoyerEmail({
      sujet: sujetTicket(ticket),
      texte: ticketTexte(ticket),
      html: ticketHtml(ticket),
      repondreA: session.customer_details?.email ?? undefined,
    });

    if (envoi === "echec") {
      return NextResponse.json({ erreur: "E-mail non transmis." }, { status: 500 });
    }

    console.info(`[webhook] commande ${ticket.reference} payée — e-mail ${envoi}`);
    return NextResponse.json({ recu: true });
  } catch (erreur) {
    console.error("[webhook] traitement impossible, Stripe réessaiera", erreur);
    return NextResponse.json({ erreur: "Traitement impossible." }, { status: 500 });
  }
}
