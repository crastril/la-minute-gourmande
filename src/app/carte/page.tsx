import type { Metadata } from "next";
import { MenuCard } from "@/components/menu-card";
import { PanierFlottant } from "@/components/panier-flottant";
import { Reveal } from "@/components/reveal";
import { CATEGORIES, produitsParCategorie } from "@/data/menu";
import { RESTAURANT } from "@/data/restaurant";

export const metadata: Metadata = {
  title: "La carte",
  description:
    "Viennoiseries, snacking et pâtisseries au comptoir ; menus et plats du midi à réserver en ligne et à récupérer entre 11h30 et 13h30.",
};

export default function Carte() {
  return (
    <>
      <section className="mx-auto max-w-[1240px] px-5 pt-16 pb-10 sm:px-8 sm:pt-24">
        <p className="sur-titre animate-rise">
          Carte du {new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date())}
        </p>
        <h1 className="animate-veil mt-6 max-w-[14ch] text-[clamp(2.6rem,8vw,6rem)] leading-[0.9]">
          La carte
        </h1>
        <p
          className="animate-rise mt-7 max-w-[56ch] leading-relaxed text-creme-doux"
          style={{ animationDelay: "220ms" }}
        >
          Les <span className="text-creme">menus, plats et boissons</span> se
          réservent en ligne pour le service du midi, et se règlent au choix
          maintenant ou au retrait. Le reste — viennoiseries, snacking,
          pâtisseries — s&apos;achète directement au comptoir, sans commander à
          l&apos;avance.
        </p>
      </section>

      {/* Sommaire collant */}
      <nav
        aria-label="Catégories de la carte"
        className="sticky top-[72px] z-30 border-y border-creme/10 bg-noir/85 backdrop-blur-xl"
      >
        <ul className="mx-auto flex max-w-[1240px] gap-1 overflow-x-auto px-5 py-3 sm:px-8 [scrollbar-width:none]">
          {CATEGORIES.map((categorie) => (
            <li key={categorie.id}>
              <a
                href={`#${categorie.id}`}
                className="chiffres block rounded-ticket px-4 py-2 text-[0.7rem] tracking-[0.16em] whitespace-nowrap text-creme-doux uppercase transition-colors hover:bg-creme/5 hover:text-beurre"
              >
                {categorie.nom}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mx-auto max-w-[1240px] px-5 pb-32 sm:px-8">
        {CATEGORIES.map((categorie) => {
          const produits = produitsParCategorie(categorie.id);
          if (produits.length === 0) return null;

          return (
            <section
              key={categorie.id}
              id={categorie.id}
              className="scroll-mt-[140px] pt-20"
              aria-labelledby={`titre-${categorie.id}`}
            >
              <Reveal className="flex flex-wrap items-end justify-between gap-x-10 gap-y-3 border-b border-creme/10 pb-6">
                <h2
                  id={`titre-${categorie.id}`}
                  className="text-[clamp(1.8rem,4vw,2.8rem)] leading-none"
                >
                  {categorie.nom}
                </h2>
                <p className="max-w-[42ch] text-sm text-creme-doux">{categorie.intro}</p>
              </Reveal>

              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {produits.map((produit, i) => (
                  <Reveal key={produit.id} delai={i * 70}>
                    <MenuCard produit={produit} />
                  </Reveal>
                ))}
              </div>
            </section>
          );
        })}

        <p className="chiffres mt-20 max-w-[60ch] text-[0.7rem] leading-relaxed text-creme-tres-doux">
          Prix TTC, service compris. La liste des allergènes est indiquée sous
          chaque produit ; en cas d&apos;allergie sévère, signalez-le en note de
          commande ou appelez-nous au {RESTAURANT.telephone}.
        </p>
      </div>

      <PanierFlottant />
    </>
  );
}
