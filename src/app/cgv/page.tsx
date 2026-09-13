import type { Metadata } from "next";
import Link from "next/link";
import { CGV, DATE_CGV } from "@/data/cgv";
import { CRENEAUX, RESTAURANT } from "@/data/restaurant";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  description: `Conditions générales de vente des commandes à emporter passées sur le site de ${RESTAURANT.nom}.`,
};

/**
 * ⚠️ Modèle de CGV pour de la vente à emporter avec retrait sur place.
 * Les passages entre crochets sont à compléter par le client, les règles
 * d'annulation (src/data/cgv.ts) à valider, et l'ensemble à faire relire par
 * un professionnel du droit avant d'encaisser des paiements.
 */

const SOMMAIRE = [
  { id: "objet", titre: "Objet" },
  { id: "vendeur", titre: "Vendeur" },
  { id: "produits", titre: "Produits et allergènes" },
  { id: "prix", titre: "Prix" },
  { id: "commande", titre: "Commande" },
  { id: "paiement", titre: "Paiement" },
  { id: "retrait", titre: "Retrait" },
  { id: "retractation", titre: "Absence de droit de rétractation" },
  { id: "annulation", titre: "Annulation et indisponibilité" },
  { id: "reclamations", titre: "Réclamations" },
  { id: "donnees", titre: "Données personnelles" },
  { id: "mediation", titre: "Médiation et droit applicable" },
];

function Article({ id, numero, titre, children }: { id: string; numero: number; titre: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-encre/10 pt-8">
      <h2 className="font-display text-xl font-bold tracking-[0.02em] text-encre">
        <span className="chiffres mr-2 text-orange-fonce">{String(numero).padStart(2, "0")}</span>
        {titre}
      </h2>
      <div className="mt-4 flex flex-col gap-3 text-[0.95rem] leading-relaxed text-encre-douce">
        {children}
      </div>
    </section>
  );
}

const lien = "text-orange-fonce underline underline-offset-2 transition-colors hover:text-encre";

export default function ConditionsGeneralesDeVente() {
  return (
    <section className="mx-auto max-w-[760px] px-5 pt-16 pb-24 sm:px-8 sm:pt-24">
      <p className="sur-titre">Informations légales</p>
      <h1 className="mt-5 text-[clamp(2.2rem,6vw,3.6rem)] leading-[0.95]">
        Conditions générales <span className="font-script text-orange">de vente</span>
      </h1>
      <p className="mt-5 text-sm text-encre-pale">En vigueur au {DATE_CGV}.</p>

      <nav aria-label="Sommaire" className="mt-10 rounded-[18px] border-2 border-dashed border-encre/20 bg-carte p-6">
        <p className="sur-titre mb-4">Sommaire</p>
        <ol className="grid gap-x-8 gap-y-1.5 text-sm sm:grid-cols-2">
          {SOMMAIRE.map((entree, i) => (
            <li key={entree.id}>
              <a href={`#${entree.id}`} className="text-encre-douce transition-colors hover:text-orange-fonce">
                <span className="chiffres mr-2 text-encre-pale">{String(i + 1).padStart(2, "0")}</span>
                {entree.titre}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-12 flex flex-col gap-10">
        <Article id="objet" numero={1} titre="Objet">
          <p>
            Les présentes conditions générales de vente (CGV) s&apos;appliquent aux
            commandes passées sur ce site auprès de {RESTAURANT.nom}, pour des
            produits alimentaires à emporter, retirés sur place. Aucune livraison
            n&apos;est proposée.
          </p>
          <p>
            Le client déclare avoir pris connaissance des CGV et les accepter avant
            de valider sa commande. Les CGV applicables sont celles en vigueur au
            moment de la commande.
          </p>
        </Article>

        <Article id="vendeur" numero={2} titre="Vendeur">
          <p>
            {RESTAURANT.nom} — {RESTAURANT.adresse}, {RESTAURANT.codePostal}{" "}
            {RESTAURANT.ville}, {RESTAURANT.region}.
            <br />
            Téléphone :{" "}
            <a href={`tel:${RESTAURANT.telephoneLien}`} className={lien}>
              {RESTAURANT.telephone}
            </a>{" "}
            · E-mail :{" "}
            <a href={`mailto:${RESTAURANT.email}`} className={lien}>
              {RESTAURANT.email}
            </a>
          </p>
          <p>
            [Forme juridique, capital social, numéro SIRET, immatriculation (RCS ou
            répertoire des métiers) et numéro de TVA intracommunautaire à compléter.]
          </p>
        </Article>

        <Article id="produits" numero={3} titre="Produits et allergènes">
          <p>
            Les produits sont préparés par la boutique. Leur disponibilité dépend de
            la production du jour. Les photographies et illustrations du site ne
            sont pas contractuelles.
          </p>
          <p>
            <strong className="font-semibold text-encre">Allergènes.</strong> La liste
            des allergènes présents dans chaque produit est disponible sur simple
            demande, au comptoir ou par téléphone, avant toute commande. Le client
            souffrant d&apos;une allergie ou d&apos;une intolérance doit le signaler
            avant de commander. Les produits étant préparés dans une cuisine commune,
            l&apos;absence de traces d&apos;allergènes ne peut pas être garantie.
          </p>
        </Article>

        <Article id="prix" numero={4} titre="Prix">
          <p>
            Les prix sont indiqués en euros, toutes taxes comprises. Le prix
            applicable est celui affiché au moment de la validation de la commande.
            Aucun frais de service ni de réservation n&apos;est ajouté.
          </p>
          <p>
            Le prix d&apos;un menu dépend du plat choisi et, le cas échéant, du
            dessert ajouté ; la boisson est incluse. La boutique peut modifier ses
            prix à tout moment, sans effet sur les commandes déjà validées.
          </p>
        </Article>

        <Article id="commande" numero={5} titre="Commande">
          <p>
            Le client compose son panier, choisit un créneau de retrait (de{" "}
            {CRENEAUX[0]} à {CRENEAUX[CRENEAUX.length - 1]}), renseigne ses
            coordonnées, choisit son mode de règlement, accepte les présentes CGV
            puis valide sa commande. Une commande en ligne doit comporter au moins
            un menu, un plat ou un burger.
          </p>
          <p>
            La commande est confirmée à l&apos;écran, avec une référence à présenter au
            retrait. Le contrat est conclu à cette confirmation.
          </p>
          <p>
            La boutique peut refuser une commande anormale (quantités inhabituelles,
            commande précédente non retirée ou non réglée) ; le client en est alors
            informé et, s&apos;il a déjà payé, intégralement remboursé.
          </p>
        </Article>

        <Article id="paiement" numero={6} titre="Paiement">
          <p>Deux modes de règlement sont proposés :</p>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>
              <strong className="font-semibold text-encre">en ligne</strong>, par
              carte bancaire ou Link, au moment de la commande. Le paiement est
              traité par la société Stripe ; les données bancaires sont chiffrées et
              ne sont jamais transmises à la boutique. Une authentification
              renforcée (3D Secure) peut être demandée par la banque ;
            </li>
            <li>
              <strong className="font-semibold text-encre">au retrait</strong>, en
              boutique, selon les moyens de paiement acceptés sur place [à
              préciser].
            </li>
          </ul>
        </Article>

        <Article id="retrait" numero={7} titre="Retrait">
          <p>
            La commande est à retirer au {RESTAURANT.adresse}, {RESTAURANT.codePostal}{" "}
            {RESTAURANT.ville}, au créneau choisi, en présentant la référence de
            commande ou le nom indiqué. Le délai de préparation est d&apos;environ{" "}
            {RESTAURANT.delaiRetrait} minutes.
          </p>
          <p>
            La commande est conservée {CGV.conservationMinutes} minutes après
            l&apos;heure de retrait choisie. Passé ce délai, et s&apos;agissant de
            denrées préparées spécialement pour le client et rapidement périssables,
            une commande payée en ligne et non retirée n&apos;est pas remboursée.
            Pour une commande à régler au retrait et non retirée, la boutique peut
            refuser les commandes suivantes à régler sur place.
          </p>
        </Article>

        <Article id="retractation" numero={8} titre="Absence de droit de rétractation">
          <p>
            Conformément à l&apos;article L221-28 du Code de la consommation, le droit
            de rétractation ne s&apos;applique pas aux biens susceptibles de se
            détériorer ou de se périmer rapidement, ni aux prestations de
            restauration fournies à une date ou à une période déterminée. Les
            commandes passées sur ce site ne bénéficient donc pas du délai de
            rétractation de quatorze jours.
          </p>
        </Article>

        <Article id="annulation" numero={9} titre="Annulation et indisponibilité">
          <p>
            <strong className="font-semibold text-encre">À l&apos;initiative du client.</strong>{" "}
            Le client peut annuler ou modifier sa commande en appelant la boutique
            au{" "}
            <a href={`tel:${RESTAURANT.telephoneLien}`} className={lien}>
              {RESTAURANT.telephone}
            </a>{" "}
            au plus tard {CGV.delaiAnnulationMinutes} minutes avant l&apos;heure de
            retrait. Une commande payée en ligne est alors intégralement remboursée.
            Au-delà, la préparation étant engagée, la commande ne peut plus être
            annulée ni remboursée.
          </p>
          <p>
            <strong className="font-semibold text-encre">Produit indisponible.</strong>{" "}
            Si un produit commandé ne peut finalement pas être fourni, la boutique
            contacte le client au numéro indiqué et lui propose, à son choix, un
            produit de remplacement ou le remboursement du produit concerné. Le
            client peut également demander l&apos;annulation et le remboursement de
            l&apos;ensemble de sa commande.
          </p>
          <p>
            <strong className="font-semibold text-encre">À l&apos;initiative de la boutique.</strong>{" "}
            En cas de fermeture exceptionnelle ou d&apos;impossibilité de préparer la
            commande, la boutique en informe le client et rembourse intégralement
            une commande payée en ligne.
          </p>
          <p>
            Tout remboursement accordé est effectué sur le moyen de paiement utilisé
            lors de la commande, dans un délai maximal de{" "}
            {CGV.delaiRemboursementJours} jours. Le délai d&apos;apparition sur le
            compte du client dépend ensuite de sa banque.
          </p>
        </Article>

        <Article id="reclamations" numero={10} titre="Réclamations">
          <p>
            Le client est invité à vérifier sa commande au moment du retrait et à
            signaler immédiatement toute erreur ou tout produit manquant au comptoir.
            Toute autre réclamation peut être adressée par téléphone ou par e-mail à{" "}
            <a href={`mailto:${RESTAURANT.email}`} className={lien}>
              {RESTAURANT.email}
            </a>
            , en précisant la référence de la commande.
          </p>
          <p>
            Les produits bénéficient de la garantie légale de conformité (articles
            L217-3 et suivants du Code de la consommation) et de la garantie des
            vices cachés (articles 1641 et suivants du Code civil).
          </p>
        </Article>

        <Article id="donnees" numero={11} titre="Données personnelles">
          <p>
            Les informations demandées lors de la commande (nom, téléphone, e-mail,
            note) servent uniquement à préparer la commande, à contacter le client à
            son sujet et à traiter un éventuel remboursement. Elles ne sont ni
            cédées ni utilisées à des fins publicitaires.
          </p>
          <p>
            Conformément au règlement général sur la protection des données, le
            client dispose d&apos;un droit d&apos;accès, de rectification et
            d&apos;effacement de ses données, qu&apos;il exerce en écrivant à{" "}
            <a href={`mailto:${RESTAURANT.email}`} className={lien}>
              {RESTAURANT.email}
            </a>
            . Voir aussi les{" "}
            <Link href="/mentions-legales" className={lien}>
              mentions légales
            </Link>
            .
          </p>
        </Article>

        <Article id="mediation" numero={12} titre="Médiation et droit applicable">
          <p>
            En cas de litige, le client s&apos;adresse d&apos;abord à la boutique afin de
            rechercher une solution amiable. À défaut, il peut recourir gratuitement
            au médiateur de la consommation dont relève la boutique : [nom et
            coordonnées du médiateur à compléter], conformément aux articles L612-1
            et suivants du Code de la consommation.
          </p>
          <p>
            Les présentes CGV sont soumises au droit français. À défaut de solution
            amiable, le litige est porté devant les juridictions compétentes dans les
            conditions prévues par la loi.
          </p>
        </Article>
      </div>
    </section>
  );
}
