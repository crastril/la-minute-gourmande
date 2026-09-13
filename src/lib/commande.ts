import { RESTAURANT } from "@/data/restaurant";
import { prix } from "@/lib/format";

/**
 * Récapitulatif d'une commande, tel que la boutique le reçoit par e-mail.
 * Même format pour une commande à régler au retrait (envoyée par l'API de
 * commande) et pour une commande payée en ligne (envoyée par le webhook Stripe).
 */
export type Ticket = {
  reference: string;
  creneau: string;
  reglement: "Payée en ligne" | "À régler au retrait";
  /** Total en centimes. */
  total: number;
  client: {
    prenom?: string | null;
    nom?: string | null;
    telephone?: string | null;
    email?: string | null;
  };
  note?: string | null;
  lignes: { quantite: number; nom: string; detail?: string | null; montant: number }[];
  /**
   * Lien vers le paiement dans le tableau de bord Stripe : c'est de là qu'on
   * rembourse une commande annulée ou un produit indisponible.
   */
  lienStripe?: string | null;
};

/** Les champs saisis par le client sont insérés dans du HTML : on les échappe. */
function echapper(texte: string): string {
  return texte.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c,
  );
}

function nomClient(ticket: Ticket): string {
  return [ticket.client.prenom, ticket.client.nom].filter(Boolean).join(" ") || "—";
}

export function sujetTicket(ticket: Ticket): string {
  return `Commande ${ticket.reference} · retrait ${ticket.creneau} · ${ticket.reglement}`;
}

export function ticketTexte(ticket: Ticket): string {
  return [
    `COMMANDE ${ticket.reference}`,
    `Retrait : ${ticket.creneau}`,
    `Règlement : ${ticket.reglement}`,
    "",
    ...ticket.lignes.map(
      (l) => `${l.quantite} × ${l.nom}${l.detail ? ` (${l.detail})` : ""} — ${prix(l.montant)}`,
    ),
    "",
    `TOTAL : ${prix(ticket.total)}`,
    "",
    `Client : ${nomClient(ticket)}`,
    `Téléphone : ${ticket.client.telephone || "—"}`,
    ticket.client.email ? `E-mail : ${ticket.client.email}` : null,
    ticket.note ? `\nNote pour la cuisine : ${ticket.note}` : null,
    ticket.lienStripe ? `\nPaiement dans Stripe (remboursement) : ${ticket.lienStripe}` : null,
  ]
    .filter((ligne): ligne is string => ligne !== null)
    .join("\n");
}

export function ticketHtml(ticket: Ticket): string {
  const paye = ticket.reglement === "Payée en ligne";
  const lignes = ticket.lignes
    .map(
      (l) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px dashed #d9cdbd;font-size:15px;color:#171513">
            <strong>${l.quantite} × ${echapper(l.nom)}</strong>
            ${l.detail ? `<br><span style="color:#4b423a;font-size:14px">${echapper(l.detail)}</span>` : ""}
          </td>
          <td style="padding:10px 0;border-bottom:1px dashed #d9cdbd;text-align:right;font-size:15px;color:#171513;white-space:nowrap">
            ${prix(l.montant)}
          </td>
        </tr>`,
    )
    .join("");

  return `<!doctype html>
<html lang="fr">
  <body style="margin:0;background:#faf0e7;font-family:Arial,Helvetica,sans-serif">
    <div style="max-width:560px;margin:0 auto;padding:24px">
      <div style="background:#171513;color:#faf0e7;border-radius:14px 14px 0 0;padding:20px 24px">
        <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#f4d8b3">${echapper(RESTAURANT.nom)} · nouvelle commande</div>
        <div style="font-size:26px;font-weight:bold;margin-top:6px">Retrait à ${echapper(ticket.creneau)}</div>
        <div style="margin-top:10px;display:inline-block;padding:4px 12px;border-radius:999px;font-size:13px;font-weight:bold;background:${paye ? "#de5321" : "#f4d8b3"};color:#171513">
          ${paye ? "PAYÉE EN LIGNE" : "À RÉGLER AU RETRAIT"}
        </div>
      </div>
      <div style="background:#fffaf4;border:1px solid #e8dccb;border-top:0;border-radius:0 0 14px 14px;padding:20px 24px">
        <div style="font-size:13px;color:#6f6254">Référence <strong style="color:#171513">${echapper(ticket.reference)}</strong></div>
        <table style="width:100%;border-collapse:collapse;margin-top:12px">${lignes}</table>
        <div style="display:flex;justify-content:space-between;margin-top:14px;font-size:18px;font-weight:bold;color:#171513">
          <span>Total</span><span style="color:#b8410f">&nbsp;${prix(ticket.total)}</span>
        </div>
        <div style="margin-top:20px;padding-top:16px;border-top:1px dashed #d9cdbd;font-size:15px;color:#171513;line-height:1.6">
          <strong>${echapper(nomClient(ticket))}</strong><br>
          Téléphone : ${ticket.client.telephone ? `<a href="tel:${echapper(ticket.client.telephone)}" style="color:#b8410f">${echapper(ticket.client.telephone)}</a>` : "—"}
          ${ticket.client.email ? `<br>E-mail : ${echapper(ticket.client.email)}` : ""}
        </div>
        ${
          ticket.note
            ? `<div style="margin-top:16px;padding:12px 14px;border-radius:10px;background:#f4d8b3;font-size:15px;color:#171513"><strong>Note pour la cuisine :</strong><br>${echapper(ticket.note)}</div>`
            : ""
        }
        ${
          ticket.lienStripe
            ? `<div style="margin-top:20px;font-size:13px;color:#6f6254">Annulation ou produit indisponible : <a href="${echapper(ticket.lienStripe)}" style="color:#b8410f">ouvrir le paiement dans Stripe pour rembourser</a></div>`
            : ""
        }
      </div>
    </div>
  </body>
</html>`;
}
