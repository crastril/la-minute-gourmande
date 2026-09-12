import type { Metadata } from "next";
import { FormulaireContact } from "@/components/formulaire-contact";
import { Reveal } from "@/components/reveal";
import { RESTAURANT } from "@/data/restaurant";

export const metadata: Metadata = {
  title: "Traiteur & événements",
  description:
    "Buffets, cocktails et repas assis de 10 à 120 couverts. Menus sur mesure préparés le jour même et dressés sur place.",
};

const PRESTATIONS = [
  {
    titre: "Buffet froid",
    texte: "Plateaux dressés, pièces salées et sucrées, vaisselle comprise.",
    prix: "dès 18 € / pers.",
  },
  {
    titre: "Cocktail dînatoire",
    texte: "Douze à seize pièces par convive, service en salle possible.",
    prix: "dès 28 € / pers.",
  },
  {
    titre: "Repas assis",
    texte: "Entrée, plat, dessert dressés à l'assiette, brigade sur place.",
    prix: "dès 42 € / pers.",
  },
];

export default function Traiteur() {
  return (
    <>
      <section className="mx-auto max-w-[1240px] px-5 pt-16 pb-8 sm:px-8 sm:pt-24">
        <p className="sur-titre animate-rise">Événements · {RESTAURANT.ville} et 40 km alentour</p>
        <h1 className="animate-veil mt-6 max-w-[13ch] text-[clamp(2.6rem,8vw,6rem)] leading-[0.9]">
          On déplace la <span className="text-pistache italic">cuisine</span>.
        </h1>
        <p
          className="animate-rise mt-7 max-w-[54ch] text-lg leading-relaxed text-creme-doux"
          style={{ animationDelay: "220ms" }}
        >
          Même exigence qu&apos;au comptoir, à plus grande échelle : produits
          achetés la veille, tout préparé le matin même, dressé chez vous. De dix
          à cent vingt couverts, avec ou sans service.
        </p>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8">
        <div className="grid gap-px overflow-hidden rounded-ticket bg-creme/10 md:grid-cols-3">
          {PRESTATIONS.map((p, i) => (
            <Reveal key={p.titre} delai={i * 100}>
              <div className="flex h-full flex-col gap-3 bg-noir p-8">
                <h2 className="font-display text-2xl text-creme">{p.titre}</h2>
                <p className="text-sm leading-relaxed text-creme-doux">{p.texte}</p>
                <p className="chiffres mt-auto pt-5 text-sm text-pistache">{p.prix}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 grid gap-8 sm:grid-cols-3">
          {[
            { t: "72 h", d: "de délai minimum pour toute commande" },
            { t: "30 %", d: "d'acompte à la réservation, solde le jour J" },
            { t: "Sur mesure", d: "végétarien, sans gluten, halal sur demande" },
          ].map((stat) => (
            <div key={stat.t} className="border-l border-creme/12 pl-5">
              <p className="font-display text-3xl text-creme">{stat.t}</p>
              <p className="mt-2 text-sm text-creme-doux">{stat.d}</p>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="mx-auto max-w-[840px] px-5 pb-24 sm:px-8">
        <Reveal>
          <div className="rounded-ticket border border-creme/12 bg-encre/50 p-7 sm:p-10">
            <p className="sur-titre">Parlons de votre événement</p>
            <h2 className="mt-4 mb-8 text-[clamp(1.8rem,4vw,2.6rem)] leading-tight">
              Demander un devis
            </h2>
            <FormulaireContact sujet="traiteur" />
          </div>
        </Reveal>
      </section>
    </>
  );
}
