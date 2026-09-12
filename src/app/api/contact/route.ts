import { NextResponse } from "next/server";
import { RESTAURANT } from "@/data/restaurant";

type Corps = {
  sujet?: "contact" | "traiteur";
  nom?: string;
  email?: string;
  telephone?: string;
  message?: string;
  /** Champs spécifiques au devis traiteur. */
  convives?: string;
  date?: string;
  typeEvenement?: string;
  /** Pot de miel anti-robot : rempli = requête ignorée. */
  societe?: string;
};

const EMAIL_VALIDE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: Request) {
  let corps: Corps;
  try {
    corps = (await req.json()) as Corps;
  } catch {
    return NextResponse.json({ erreur: "Requête illisible." }, { status: 400 });
  }

  // Les robots remplissent tous les champs : on répond OK sans rien traiter.
  if (corps.societe) return NextResponse.json({ ok: true });

  const nom = corps.nom?.trim();
  const email = corps.email?.trim();
  const message = corps.message?.trim();

  if (!nom || !email || !message) {
    return NextResponse.json(
      { erreur: "Nom, e-mail et message sont obligatoires." },
      { status: 400 },
    );
  }

  if (!EMAIL_VALIDE.test(email)) {
    return NextResponse.json({ erreur: "Cette adresse e-mail semble invalide." }, { status: 400 });
  }

  const sujet =
    corps.sujet === "traiteur"
      ? `Demande de devis traiteur — ${nom}`
      : `Message du site — ${nom}`;

  const corpsTexte = [
    `Nom : ${nom}`,
    `E-mail : ${email}`,
    corps.telephone ? `Téléphone : ${corps.telephone}` : null,
    corps.typeEvenement ? `Type d'événement : ${corps.typeEvenement}` : null,
    corps.convives ? `Nombre de convives : ${corps.convives}` : null,
    corps.date ? `Date souhaitée : ${corps.date}` : null,
    "",
    message.slice(0, 4000),
  ]
    .filter(Boolean)
    .join("\n");

  const cleResend = process.env.RESEND_API_KEY;
  const destinataire = process.env.CONTACT_EMAIL ?? RESTAURANT.email;

  // Sans fournisseur d'e-mail configuré, le message est tracé dans les logs
  // serveur : le formulaire reste fonctionnel en développement.
  if (!cleResend) {
    console.info(`[contact] ${sujet}\n${corpsTexte}`);
    return NextResponse.json({ ok: true, mode: "journal" });
  }

  try {
    const reponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cleResend}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM ?? `Site ${RESTAURANT.nom} <onboarding@resend.dev>`,
        to: [destinataire],
        reply_to: email,
        subject: sujet,
        text: corpsTexte,
      }),
    });

    if (!reponse.ok) {
      throw new Error(`Resend a répondu ${reponse.status}`);
    }

    return NextResponse.json({ ok: true, mode: "email" });
  } catch (erreur) {
    console.error("[contact] envoi impossible", erreur);
    return NextResponse.json(
      { erreur: "L'envoi a échoué. Vous pouvez nous appeler directement." },
      { status: 502 },
    );
  }
}
