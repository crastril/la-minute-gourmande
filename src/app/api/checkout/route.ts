import { NextResponse } from "next/server";
import Stripe from "stripe";
import { CATALOGUE, estCommandable, estPrincipal } from "@/data/menu";
import { CRENEAUX, RESTAURANT } from "@/data/restaurant";
import { numeroCommande } from "@/lib/format";
import { resoudreCleStripe } from "@/lib/stripe";

/** Le client choisit de régler tout de suite ou au moment du retrait. */
type ModePaiement = "enligne" | "comptoir";

type Corps = {
  lignes?: { id: string; quantite: number }[];
  creneau?: string;
  note?: string;
  paiement?: ModePaiement;
  client?: { prenom?: string; nom?: string; email?: string; telephone?: string };
};

function origine(req: Request): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    req.headers.get("origin") ??
    new URL(req.url).origin
  );
}

export async function POST(req: Request) {
  let corps: Corps;
  try {
    corps = (await req.json()) as Corps;
  } catch {
    return NextResponse.json({ erreur: "Requête illisible." }, { status: 400 });
  }

  const { lignes, creneau, note, client, paiement } = corps;

  if (!Array.isArray(lignes) || lignes.length === 0) {
    return NextResponse.json({ erreur: "Votre panier est vide." }, { status: 400 });
  }

  if (!creneau || !CRENEAUX.includes(creneau as (typeof CRENEAUX)[number])) {
    return NextResponse.json(
      { erreur: "Merci de choisir un créneau de retrait." },
      { status: 400 },
    );
  }

  if (!client?.prenom?.trim() || !client?.telephone?.trim()) {
    return NextResponse.json(
      { erreur: "Prénom et téléphone sont nécessaires pour préparer la commande." },
      { status: 400 },
    );
  }

  // Les prix et le droit de commander sont toujours relus côté serveur : ce que
  // le navigateur envoie n'est jamais utilisé pour calculer le montant, et un
  // produit de vitrine (viennoiserie, snacking) ne peut pas être glissé dans
  // une commande en forgeant la requête.
  const articles = lignes.flatMap((ligne) => {
    const produit = CATALOGUE.get(ligne.id);
    const quantite = Math.floor(Number(ligne.quantite));
    if (!produit || !estCommandable(produit) || !Number.isFinite(quantite)) return [];
    if (quantite < 1 || quantite > 20) return [];
    return [{ produit, quantite }];
  });

  if (articles.length === 0) {
    return NextResponse.json(
      { erreur: "Aucun produit valide dans la commande." },
      { status: 400 },
    );
  }

  // La boulangerie se vend au comptoir : une commande en ligne doit porter sur
  // au moins un menu ou un plat, pas sur une boisson seule.
  if (!articles.some(({ produit }) => estPrincipal(produit))) {
    return NextResponse.json(
      {
        erreur:
          "Une commande doit contenir au moins un menu ou un plat. Les boissons seules se prennent au comptoir.",
      },
      { status: 400 },
    );
  }

  const reference = numeroCommande();
  const total = articles.reduce((n, a) => n + a.produit.prix * a.quantite, 0);
  const cleStripe = resoudreCleStripe();

  const journaliser = (reglement: string) =>
    console.info(
      `[commande ${reference}] ${articles.length} article(s), ${(total / 100).toFixed(2)} € — retrait ${creneau} — ${reglement} — ${client.prenom} ${client.telephone}${note ? ` — note : ${note}` : ""}`,
    );

  const confirmation = `/commande/confirmee?ref=${reference}&creneau=${encodeURIComponent(creneau)}&total=${total}`;

  // Règlement au retrait : rien à encaisser maintenant, la commande part
  // directement en préparation.
  if (paiement === "comptoir") {
    journaliser("à régler au comptoir");
    return NextResponse.json({ mode: "comptoir", url: confirmation });
  }

  // Clé présente mais inutilisable : on ne bascule pas silencieusement sur le
  // règlement au comptoir, ce serait masquer une erreur de configuration.
  if (cleStripe.etat === "refusee") {
    console.error(`[checkout] configuration Stripe invalide — ${cleStripe.raison}`);
    return NextResponse.json(
      { erreur: "Le paiement est momentanément indisponible. Réessayez ou appelez-nous." },
      { status: 503 },
    );
  }

  // Aucune clé Stripe configurée : le paiement en ligne n'existe pas encore,
  // toute commande se règle au comptoir.
  if (cleStripe.etat === "absente") {
    journaliser("à régler au comptoir (paiement en ligne non configuré)");
    return NextResponse.json({ mode: "comptoir", url: confirmation });
  }

  try {
    const stripe = new Stripe(cleStripe.cle);
    const base = origine(req);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "fr",
      customer_email: client.email?.trim() || undefined,
      line_items: articles.map(({ produit, quantite }) => ({
        quantity: quantite,
        price_data: {
          currency: "eur",
          unit_amount: produit.prix,
          product_data: {
            name: produit.nom,
            description: produit.description.slice(0, 300),
          },
        },
      })),
      metadata: {
        reference,
        creneau,
        note: (note ?? "").slice(0, 480),
        client: `${client.prenom ?? ""} ${client.nom ?? ""}`.trim().slice(0, 120),
        telephone: (client.telephone ?? "").slice(0, 30),
        etablissement: RESTAURANT.nom,
      },
      success_url: `${base}/commande/confirmee?ref=${reference}&creneau=${encodeURIComponent(creneau)}&total=${total}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/panier?annule=1`,
    });

    if (!session.url) {
      throw new Error("Stripe n'a pas renvoyé d'URL de paiement.");
    }

    // La commande n'est pas encore payée à ce stade : le client part vers
    // Stripe, la confirmation arrive au retour sur /commande/confirmee.
    journaliser("paiement en ligne engagé");
    return NextResponse.json({ mode: "stripe", url: session.url });
  } catch (erreur) {
    console.error("[checkout] échec de création de session Stripe", erreur);
    return NextResponse.json(
      { erreur: "Le paiement est momentanément indisponible. Réessayez ou appelez-nous." },
      { status: 502 },
    );
  }
}
