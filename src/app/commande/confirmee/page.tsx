import type { Metadata } from "next";
import Link from "next/link";
import { ViderPanier } from "@/components/vider-panier";
import { RESTAURANT } from "@/data/restaurant";
import { prix } from "@/lib/format";

export const metadata: Metadata = {
  title: "Commande confirmée",
  robots: { index: false, follow: false },
};

export default async function Confirmee({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; creneau?: string; total?: string; session_id?: string }>;
}) {
  const { ref, creneau, total, session_id } = await searchParams;
  const montant = Number(total);
  const paye = Boolean(session_id);

  return (
    <>
      <ViderPanier />

      <section className="mx-auto max-w-[640px] px-5 pt-20 pb-32 sm:px-8 sm:pt-28">
        <div className="perfore animate-rise rounded-ticket border border-creme/12 bg-encre/60">
          <header className="border-b border-dashed border-creme/20 px-7 py-7 text-center">
            <p className="sur-titre">
              {paye ? "Paiement accepté" : "Commande enregistrée"}
            </p>
            <h1 className="mt-4 font-display text-[clamp(2rem,6vw,2.9rem)] leading-tight text-creme">
              C&apos;est parti en cuisine.
            </h1>
          </header>

          <dl className="divide-y divide-dashed divide-creme/12">
            {[
              { cle: "Référence", valeur: ref ?? "—" },
              { cle: "Retrait à", valeur: creneau ?? "—" },
              {
                cle: "Montant",
                valeur: Number.isFinite(montant) && montant > 0 ? prix(montant) : "—",
              },
              {
                cle: "Règlement",
                valeur: paye ? "Payé en ligne" : "À régler au comptoir",
              },
            ].map((item) => (
              <div key={item.cle} className="flex items-baseline justify-between gap-6 px-7 py-4">
                <dt className="chiffres text-[0.65rem] tracking-[0.18em] text-creme-tres-doux uppercase">
                  {item.cle}
                </dt>
                <dd className="chiffres text-sm text-creme">{item.valeur}</dd>
              </div>
            ))}
          </dl>

          <div className="border-t border-dashed border-creme/20 px-7 py-7">
            <p className="text-sm leading-relaxed text-creme-doux">
              Présentez votre référence au comptoir, {RESTAURANT.adresse},{" "}
              {RESTAURANT.codePostal} {RESTAURANT.ville}. Un empêchement ? Appelez-nous au{" "}
              <a
                href={`tel:${RESTAURANT.telephoneLien}`}
                className="chiffres text-beurre transition-colors hover:text-beurre-clair"
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
            className="rounded-ticket border border-creme/20 px-6 py-3 text-sm text-creme transition-colors hover:border-beurre/60 hover:text-beurre-clair"
          >
            Retour à la carte
          </Link>
          <Link
            href="/"
            className="rounded-ticket bg-beurre px-6 py-3 text-sm font-medium text-noir transition-colors hover:bg-beurre-clair"
          >
            Accueil
          </Link>
        </div>
      </section>
    </>
  );
}
