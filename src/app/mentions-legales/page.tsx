import type { Metadata } from "next";
import { RESTAURANT } from "@/data/restaurant";

export const metadata: Metadata = {
  title: "Mentions légales",
  robots: { index: false, follow: true },
};

/**
 * ⚠️ PLACEHOLDER — à compléter avec les informations légales réelles du client
 * (raison sociale, SIRET, TVA intracommunautaire, hébergeur, assurance RC pro,
 * médiateur de la consommation) avant toute mise en ligne.
 */
const SECTIONS = [
  {
    titre: "Éditeur du site",
    contenu: `${RESTAURANT.nom} — ${RESTAURANT.adresse}, ${RESTAURANT.codePostal} ${RESTAURANT.ville}. Téléphone : ${RESTAURANT.telephone}. E-mail : ${RESTAURANT.email}. [Forme juridique, capital social, RCS, SIRET et numéro de TVA à compléter.]`,
  },
  {
    titre: "Directeur de la publication",
    contenu: "[Nom et qualité du représentant légal à compléter.]",
  },
  {
    titre: "Hébergement",
    contenu:
      "Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis — vercel.com",
  },
  {
    titre: "Données personnelles",
    contenu:
      "Les informations collectées lors d'une commande (nom, téléphone, e-mail, créneau de retrait) servent uniquement à préparer et remettre la commande. Elles ne sont ni revendues ni utilisées à des fins publicitaires. Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression en écrivant à " +
      RESTAURANT.email +
      ".",
  },
  {
    titre: "Paiement en ligne",
    contenu:
      "Les paiements sont traités par Stripe Payments Europe Ltd. Aucune donnée bancaire ne transite ni n'est stockée sur ce site.",
  },
  {
    titre: "Propriété intellectuelle",
    contenu:
      "L'ensemble des contenus de ce site (textes, photographies, identité visuelle) est la propriété de " +
      RESTAURANT.nom +
      ", sauf mention contraire. Toute reproduction est interdite sans autorisation écrite.",
  },
];

export default function MentionsLegales() {
  return (
    <section className="mx-auto max-w-[760px] px-5 pt-16 pb-24 sm:px-8 sm:pt-24">
      <p className="sur-titre">Informations légales</p>
      <h1 className="mt-5 text-[clamp(2.2rem,6vw,3.6rem)] leading-[0.95]">Mentions légales</h1>

      <div className="mt-12 flex flex-col gap-10">
        {SECTIONS.map((section) => (
          <div key={section.titre} className="border-t border-encre/10 pt-7">
            <h2 className="font-display text-xl text-encre">{section.titre}</h2>
            <p className="mt-3 text-sm leading-relaxed text-encre-douce">{section.contenu}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
