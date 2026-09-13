import { NextResponse } from "next/server";
import Stripe from "stripe";
import {
  CATALOGUE,
  estCommandable,
  estPrincipal,
  libelleChoix,
  prixUnitaire,
  validerChoix,
  type ChoixMenu,
  type Produit,
} from "@/data/menu";
import { CRENEAUX, RESTAURANT } from "@/data/restaurant";
import { sujetTicket, ticketHtml, ticketTexte, type Ticket } from "@/lib/commande";
import { envoyerEmail } from "@/lib/email";
import { numeroCommande } from "@/lib/format";
import { resoudreCleStripe } from "@/lib/stripe";

type Corps = {
  lignes?: { id?: unknown; quantite?: unknown; choix?: unknown }[];
  creneau?: unknown;
  note?: unknown;
  paiement?: unknown;
  client?: { prenom?: unknown; nom?: unknown; email?: unknown; telephone?: unknown };
};

type Article = {
  produit: Produit;
  quantite: number;
  choix?: ChoixMenu;
  prixUnitaire: number;
};

/** Texte saisi par le client : toujours une chaîne nettoyée et bornée. */
function champ(valeur: unknown, max: number): string {
  return typeof valeur === "string" ? valeur.trim().slice(0, max) : "";
}

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

  const lignes = corps.lignes;
  const creneau = champ(corps.creneau, 10);
  const note = champ(corps.note, 480);
  const paiement = corps.paiement === "comptoir" ? "comptoir" : "enligne";
  const client = {
    prenom: champ(corps.client?.prenom, 60),
    nom: champ(corps.client?.nom, 60),
    email: champ(corps.client?.email, 120),
    telephone: champ(corps.client?.telephone, 30),
  };

  if (!Array.isArray(lignes) || lignes.length === 0) {
    return NextResponse.json({ erreur: "Votre panier est vide." }, { status: 400 });
  }

  if (!CRENEAUX.includes(creneau as (typeof CRENEAUX)[number])) {
    return NextResponse.json(
      { erreur: "Merci de choisir un créneau de retrait." },
      { status: 400 },
    );
  }

  if (!client.prenom || !client.telephone) {
    return NextResponse.json(
      { erreur: "Prénom et téléphone sont nécessaires pour préparer la commande." },
      { status: 400 },
    );
  }

  // Les prix, le droit de commander et la composition des menus sont toujours
  // relus côté serveur : ce que le navigateur envoie n'est jamais utilisé pour
  // calculer le montant, et une requête forgée ne peut glisser ni un produit de
  // vitrine, ni un plat absent du menu, ni un dessert sans son supplément.
  const articles: Article[] = [];
  for (const ligne of lignes) {
    const produit = typeof ligne?.id === "string" ? CATALOGUE.get(ligne.id) : undefined;
    const quantite = Math.floor(Number(ligne?.quantite));
    if (!produit || !estCommandable(produit) || !Number.isFinite(quantite)) continue;
    if (quantite < 1 || quantite > 20) continue;

    let choix: ChoixMenu | undefined;
    if (produit.composition) {
      const valide = validerChoix(produit, ligne.choix);
      if (!valide) {
        return NextResponse.json(
          { erreur: `La composition du « ${produit.nom} » est incomplète ou invalide.` },
          { status: 400 },
        );
      }
      choix = valide;
    }

    articles.push({ produit, quantite, choix, prixUnitaire: prixUnitaire(produit, choix) });
  }

  if (articles.length === 0) {
    return NextResponse.json(
      { erreur: "Aucun produit valide dans la commande." },
      { status: 400 },
    );
  }

  // La boulangerie se vend au comptoir : une commande en ligne doit porter sur
  // au moins un menu, un plat ou un burger, pas sur une boisson seule.
  if (!articles.some(({ produit }) => estPrincipal(produit))) {
    return NextResponse.json(
      {
        erreur:
          "Une commande doit contenir au moins un menu, un plat ou un burger. Les boissons seules se prennent au comptoir.",
      },
      { status: 400 },
    );
  }

  const reference = numeroCommande();
  const total = articles.reduce((n, a) => n + a.prixUnitaire * a.quantite, 0);
  const cleStripe = resoudreCleStripe();

  // Le détail des menus composés est ce dont la cuisine a besoin.
  const detailCuisine = articles
    .map((a) => `${a.quantite}× ${a.produit.nom}${a.choix ? ` (${libelleChoix(a.choix)})` : ""}`)
    .join(", ");

  const journaliser = (reglement: string) =>
    console.info(
      `[commande ${reference}] ${detailCuisine} — ${(total / 100).toFixed(2)} € — retrait ${creneau} — ${reglement} — ${client.prenom} ${client.telephone}${note ? ` — note : ${note}` : ""}`,
    );

  /**
   * Commande à régler au retrait : rien à encaisser, mais la boutique doit en
   * être informée tout de suite. Si l'e-mail échoue, on le dit au client plutôt
   * que de lui confirmer une commande que personne ne recevra.
   */
  const transmettreCommandeComptoir = async (mention: string) => {
    journaliser(mention);

    const ticket: Ticket = {
      reference,
      creneau,
      reglement: "À régler au retrait",
      total,
      client,
      note,
      lignes: articles.map((a) => ({
        quantite: a.quantite,
        nom: a.produit.nom,
        detail: libelleChoix(a.choix),
        montant: a.prixUnitaire * a.quantite,
      })),
    };

    const envoi = await envoyerEmail({
      sujet: sujetTicket(ticket),
      texte: ticketTexte(ticket),
      html: ticketHtml(ticket),
      repondreA: client.email || undefined,
    });

    if (envoi === "echec") {
      return NextResponse.json(
        {
          erreur: `Votre commande n'a pas pu être transmise à la boutique. Appelez-nous au ${RESTAURANT.telephone} pour la passer.`,
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      mode: "comptoir",
      url: `/commande/confirmee?ref=${reference}&creneau=${encodeURIComponent(creneau)}&total=${total}`,
    });
  };

  if (paiement === "comptoir") {
    return transmettreCommandeComptoir("à régler au comptoir");
  }

  // Clés présentes mais inutilisables : on ne bascule pas silencieusement sur le
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
    return transmettreCommandeComptoir("à régler au comptoir (paiement en ligne non configuré)");
  }

  try {
    const stripe = new Stripe(cleStripe.cle);

    // Paiement intégré au site (ui_mode "elements") : pas de redirection vers
    // une page Stripe. Le navigateur reçoit un client_secret et affiche les
    // champs de paiement ; la commande n'est considérée payée qu'à la réception
    // du webhook (voir /api/stripe/webhook).
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      ui_mode: "elements",
      line_items: articles.map(({ produit, quantite, choix, prixUnitaire: unitaire }) => ({
        quantity: quantite,
        price_data: {
          currency: "eur",
          unit_amount: unitaire,
          product_data: {
            name: produit.nom,
            // Pour un menu, la composition remplace la description : c'est ce
            // que le client et la cuisine doivent relire. Stripe refuse une
            // description vide : on l'omet quand le produit n'en a pas.
            description: (libelleChoix(choix) ?? produit.description)?.slice(0, 300) || undefined,
          },
        },
      })),
      metadata: {
        reference,
        creneau,
        note,
        prenom: client.prenom,
        nom: client.nom,
        telephone: client.telephone,
        etablissement: RESTAURANT.nom,
      },
      // Après validation (3D Secure compris), Stripe renvoie ici ; la page
      // relit la session côté serveur avant d'afficher « payé ».
      return_url: `${origine(req)}/commande/confirmee?session_id={CHECKOUT_SESSION_ID}`,
    });

    if (!session.client_secret) {
      throw new Error("Stripe n'a pas renvoyé de client_secret.");
    }

    journaliser("paiement en ligne engagé");
    return NextResponse.json({
      mode: "stripe",
      clientSecret: session.client_secret,
      clePublique: cleStripe.clePublique,
      email: client.email,
      reference,
    });
  } catch (erreur) {
    console.error("[checkout] échec de création de session Stripe", erreur);
    return NextResponse.json(
      { erreur: "Le paiement est momentanément indisponible. Réessayez ou appelez-nous." },
      { status: 502 },
    );
  }
}
