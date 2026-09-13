import type { Metadata } from "next";
import Link from "next/link";
import Stripe from "stripe";
import { ViderPanier } from "@/components/vider-panier";
import { RESTAURANT } from "@/data/restaurant";
import { prix } from "@/lib/format";
import { resoudreCleSecrete } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Commande confirmée",
  robots: { index: false, follow: false },
};

type Etat =
  | { type: "comptoir"; ref?: string; creneau?: string; total?: number }
  | { type: "payee"; ref: string; creneau: string; total: number }
  | { type: "validation"; ref: string; creneau: string; total: number }
  | { type: "non-aboutie" }
  | { type: "introuvable" };

/**
 * Pour un paiement en ligne, on ne croit jamais l'URL : on demande à Stripe
 * l'état réel de la session. Un `session_id` recopié ou inventé n'affiche pas
 * « payé ». Seule la clé secrète est nécessaire pour cette relecture.
 */
async function etatPaiement(sessionId: string): Promise<Etat> {
  const cleStripe = resoudreCleSecrete();
  if (cleStripe.etat !== "ok" || !sessionId.startsWith("cs_")) return { type: "introuvable" };

  try {
    const session = await new Stripe(cleStripe.cle).checkout.sessions.retrieve(sessionId);
    const infos = {
      ref: session.metadata?.reference || "—",
      creneau: session.metadata?.creneau || "—",
      total: session.amount_total ?? 0,
    };

    if (session.status === "complete" && session.payment_status === "paid") {
      return { type: "payee", ...infos };
    }
    // Session terminée mais argent pas encore encaissé (moyen de paiement différé).
    if (session.status === "complete") return { type: "validation", ...infos };
    return { type: "non-aboutie" };
  } catch {
    return { type: "introuvable" };
  }
}

export default async function Confirmee({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; creneau?: string; total?: string; session_id?: string }>;
}) {
  const { ref, creneau, total, session_id } = await searchParams;

  const etat: Etat = session_id
    ? await etatPaiement(session_id)
    : { type: "comptoir", ref, creneau, total: Number(total) };

  if (etat.type === "non-aboutie" || etat.type === "introuvable") {
    return (
      <section className="mx-auto max-w-[640px] px-5 pt-20 pb-32 text-center sm:px-8 sm:pt-28">
        <p className="sur-titre">
          {etat.type === "non-aboutie" ? "Paiement non abouti" : "Paiement introuvable"}
        </p>
        <h1 className="mt-5 text-[clamp(2rem,6vw,3rem)] leading-tight">
          Aucun montant n&apos;a été débité.
        </h1>
        <p className="mx-auto mt-5 max-w-[44ch] text-encre-douce">
          Votre panier est intact : vous pouvez réessayer, ou choisir de régler au
          retrait. Un doute ? Appelez-nous au{" "}
          <a href={`tel:${RESTAURANT.telephoneLien}`} className="chiffres text-orange-fonce">
            {RESTAURANT.telephone}
          </a>
          .
        </p>
        <Link
          href="/panier"
          className="mt-9 inline-block rounded-full bg-orange px-7 py-4 font-display font-semibold tracking-[0.08em] text-encre uppercase transition-colors hover:bg-orange-vif"
        >
          Retour au panier
        </Link>
      </section>
    );
  }

  const montant = etat.total ?? 0;
  const libelles = {
    comptoir: { surTitre: "Commande enregistrée", reglement: "À régler au comptoir" },
    payee: { surTitre: "Paiement accepté", reglement: "Payé en ligne" },
    validation: { surTitre: "Paiement en cours de validation", reglement: "En cours de validation" },
  }[etat.type];

  return (
    <>
      <ViderPanier />

      <section className="mx-auto max-w-[640px] px-5 pt-20 pb-32 sm:px-8 sm:pt-28">
        <div className="perfore animate-rise rounded-ticket border border-encre/12 bg-carte/60">
          <header className="border-b border-dashed border-encre/20 px-7 py-7 text-center">
            <p className="sur-titre">{libelles.surTitre}</p>
            <h1 className="mt-4 font-display text-[clamp(2rem,6vw,2.9rem)] leading-tight text-encre">
              C&apos;est parti en cuisine.
            </h1>
          </header>

          <dl className="divide-y divide-dashed divide-encre/12">
            {[
              { cle: "Référence", valeur: etat.ref ?? "—" },
              { cle: "Retrait à", valeur: etat.creneau ?? "—" },
              {
                cle: "Montant",
                valeur: Number.isFinite(montant) && montant > 0 ? prix(montant) : "—",
              },
              { cle: "Règlement", valeur: libelles.reglement },
            ].map((item) => (
              <div key={item.cle} className="flex items-baseline justify-between gap-6 px-7 py-4">
                <dt className="chiffres text-[0.65rem] tracking-[0.18em] text-encre-pale uppercase">
                  {item.cle}
                </dt>
                <dd className="chiffres text-sm text-encre">{item.valeur}</dd>
              </div>
            ))}
          </dl>

          <div className="border-t border-dashed border-encre/20 px-7 py-7">
            <p className="text-sm leading-relaxed text-encre-douce">
              Présentez votre référence au comptoir, {RESTAURANT.adresse},{" "}
              {RESTAURANT.codePostal} {RESTAURANT.ville}. Un empêchement ? Appelez-nous au{" "}
              <a
                href={`tel:${RESTAURANT.telephoneLien}`}
                className="chiffres text-orange-fonce transition-colors hover:text-encre"
              >
                {RESTAURANT.telephone}
              </a>
              .
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="/carte"
            className="rounded-ticket border border-encre/20 px-6 py-3 text-sm text-encre transition-colors hover:border-orange/60 hover:text-orange-fonce"
          >
            Retour à la carte
          </Link>
          <Link
            href="/"
            className="rounded-ticket bg-orange px-6 py-3 text-sm font-medium text-encre transition-colors hover:bg-orange-vif"
          >
            Accueil
          </Link>
        </div>
      </section>
    </>
  );
}
