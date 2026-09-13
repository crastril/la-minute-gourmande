import { RESTAURANT } from "@/data/restaurant";

/**
 * - `envoye` : Resend a accepté l'e-mail ;
 * - `journal` : aucune clé Resend configurée, le contenu est écrit dans les logs
 *   (développement) ;
 * - `echec` : une clé existe mais l'envoi a échoué : l'appelant doit le signaler,
 *   car la boutique ne recevra pas l'information.
 */
export type ResultatEmail = "envoye" | "journal" | "echec";

/**
 * Envoie un e-mail à la boutique via Resend.
 * Destinataire : COMMANDES_EMAIL, sinon CONTACT_EMAIL, sinon l'e-mail de la boutique.
 *
 * ⚠️ Sans domaine vérifié chez Resend, l'expéditeur par défaut
 * (onboarding@resend.dev) ne peut écrire qu'à l'adresse du compte Resend :
 * créer ce compte avec l'adresse qui doit recevoir les commandes.
 */
export async function envoyerEmail({
  sujet,
  texte,
  html,
  repondreA,
}: {
  sujet: string;
  texte: string;
  html?: string;
  repondreA?: string;
}): Promise<ResultatEmail> {
  const cle = process.env.RESEND_API_KEY?.trim();

  if (!cle) {
    console.info(`[e-mail non envoyé : RESEND_API_KEY absente] ${sujet}\n${texte}`);
    return "journal";
  }

  const destinataire =
    process.env.COMMANDES_EMAIL?.trim() || process.env.CONTACT_EMAIL?.trim() || RESTAURANT.email;

  try {
    const reponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cle}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM?.trim() || `Site ${RESTAURANT.nom} <onboarding@resend.dev>`,
        to: [destinataire],
        subject: sujet,
        text: texte,
        ...(html ? { html } : {}),
        ...(repondreA ? { reply_to: repondreA } : {}),
      }),
    });

    if (!reponse.ok) {
      console.error(`[e-mail] Resend a répondu ${reponse.status} : ${await reponse.text()}`);
      return "echec";
    }
    return "envoye";
  } catch (erreur) {
    console.error("[e-mail] envoi impossible", erreur);
    return "echec";
  }
}
