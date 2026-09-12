import type { Metadata } from "next";
import { FormulaireContact } from "@/components/formulaire-contact";
import { Reveal } from "@/components/reveal";
import { HORAIRES, RESTAURANT } from "@/data/restaurant";

export const metadata: Metadata = {
  title: "Contact",
  description: `Adresse, horaires et formulaire de contact de ${RESTAURANT.nom} à ${RESTAURANT.ville}.`,
};

export default function Contact() {
  return (
    <section className="mx-auto max-w-[1240px] px-5 pt-16 pb-24 sm:px-8 sm:pt-24">
      <p className="sur-titre animate-rise">Nous écrire</p>
      <h1 className="animate-veil mt-6 text-[clamp(2.6rem,8vw,6rem)] leading-[0.9]">Contact</h1>

      <div className="mt-14 grid gap-12 lg:grid-cols-[0.85fr_1fr] lg:items-start">
        <Reveal className="flex flex-col gap-10">
          <div>
            <h2 className="sur-titre mb-4">L&apos;adresse</h2>
            <address className="flex flex-col gap-2 text-lg text-creme not-italic">
              <span>{RESTAURANT.adresse}</span>
              <span>
                {RESTAURANT.codePostal} {RESTAURANT.ville}
              </span>
            </address>
            <div className="mt-4 flex flex-col gap-1">
              <a
                href={`tel:${RESTAURANT.telephoneLien}`}
                className="chiffres text-sm text-beurre transition-colors hover:text-beurre-clair"
              >
                {RESTAURANT.telephone}
              </a>
              <a
                href={`mailto:${RESTAURANT.email}`}
                className="text-sm text-creme-doux transition-colors hover:text-beurre"
              >
                {RESTAURANT.email}
              </a>
            </div>
          </div>

          <div>
            <h2 className="sur-titre mb-4">Les horaires</h2>
            <ul className="flex flex-col gap-2">
              {HORAIRES.map((h) => (
                <li
                  key={h.jour}
                  className="flex items-baseline justify-between gap-4 border-b border-creme/8 pb-2 text-sm"
                >
                  <span className="text-creme-doux">{h.jour}</span>
                  <span
                    className={`chiffres text-right text-[0.78rem] ${
                      "ferme" in h && h.ferme ? "text-brique" : "text-creme"
                    }`}
                  >
                    {h.service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="perfore rounded-ticket border border-creme/12 bg-encre/50 p-6">
            <p className="text-sm leading-relaxed text-creme-doux">
              Pour une commande du jour, le téléphone reste le plus rapide —
              nous décrochons entre les services. Pour un devis traiteur,
              utilisez plutôt le formulaire dédié.
            </p>
          </div>
        </Reveal>

        <Reveal delai={120}>
          <div className="rounded-ticket border border-creme/12 bg-encre/50 p-7 sm:p-9">
            <h2 className="mb-8 font-display text-2xl text-creme">Un message ?</h2>
            <FormulaireContact sujet="contact" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
