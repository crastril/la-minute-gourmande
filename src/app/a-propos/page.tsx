import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Epi } from "@/components/ornement";
import { Reveal } from "@/components/reveal";
import { DATE_OUVERTURE, RESTAURANT } from "@/data/restaurant";

export const metadata: Metadata = {
  title: "La boutique",
  description:
    "Sandwicherie, pâtisserie et restauration rapide au François, en Martinique. Fait maison avec passion.",
};

/**
 * ⚠️ Textes à faire valider par le client. Ils ne reprennent que ce que
 * l'affiche et l'enseigne annoncent déjà — aucun historique n'est inventé.
 */
const PILIERS = [
  {
    titre: "Pâtisseries maison",
    texte: "Viennoiseries et gâteaux faits maison, en vitrine chaque jour.",
  },
  {
    titre: "Snacking gourmand",
    texte: "Sandwichs, paninis, salades et hot-dogs, à prendre au comptoir.",
  },
  {
    titre: "Restauration rapide",
    texte: "Burgers et plats pour le midi, à réserver en ligne pour éviter la file.",
  },
  {
    titre: "Boissons fraîches",
    texte: "Jus, boissons fraîches et cafés pour accompagner le tout.",
  },
];

export default function APropos() {
  return (
    <>
      <section className="mx-auto grid max-w-[1240px] items-center gap-14 px-5 pt-14 pb-20 sm:px-8 sm:pt-20 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="sur-titre animate-rise">Ouverte le {DATE_OUVERTURE}</p>
          <h1 className="animate-veil mt-6 text-[clamp(2.8rem,8vw,6rem)] leading-[0.92]">
            Fait maison
            <span className="block font-script text-[0.78em] leading-[1.2] text-orange">
              avec passion
            </span>
          </h1>

          <div
            className="animate-rise mt-8 flex max-w-[54ch] flex-col gap-5 text-lg leading-relaxed text-encre-douce"
            style={{ animationDelay: "240ms" }}
          >
            <p>
              {RESTAURANT.nom}, c&apos;est une sandwicherie, une pâtisserie et un
              comptoir de restauration rapide, au {RESTAURANT.adresse}, au
              François — en face du lycée.
            </p>
            <p>
              Le matin et à la récré, c&apos;est la vitrine qui travaille :
              viennoiseries, gâteaux, sandwichs et paninis, à prendre au comptoir.
              À midi, la cuisine prend le relais avec les burgers et les plats.
            </p>
            <p className="text-encre">
              Et parce qu&apos;à midi la file déborde vite, les menus et les plats
              se réservent en ligne : vous choisissez votre heure, votre commande
              vous attend.
            </p>
          </div>
        </div>

        <div
          className="animate-rise relative mx-auto w-full max-w-[400px]"
          style={{ animationDelay: "160ms" }}
        >
          <Image
            src="/brand/logo.png"
            alt={`Logo ${RESTAURANT.nom} ${RESTAURANT.suffixe}`}
            width={640}
            height={640}
            sizes="(max-width: 1024px) 80vw, 400px"
            className="w-full rotate-3 drop-shadow-[0_28px_40px_rgba(23,21,19,0.22)]"
          />
        </div>
      </section>

      <section className="bg-sable/50">
        <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8">
          <Reveal className="flex flex-col items-center text-center">
            <p className="sur-titre">Ce qu&apos;on vous propose</p>
            <Epi className="mt-4 h-6 w-56 text-encre/55" />
          </Reveal>

          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PILIERS.map((pilier, i) => (
              <Reveal as="li" key={pilier.titre} delai={i * 90}>
                <div className="h-full rounded-[18px] border-2 border-dashed border-encre/20 bg-carte p-7">
                  <h2 className="font-display text-xl font-bold tracking-[0.02em] text-encre">
                    {pilier.titre}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-encre-douce">{pilier.texte}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 py-20 text-center sm:px-8">
        <Reveal className="flex flex-col items-center">
          <h2 className="text-[clamp(2rem,4.5vw,3.2rem)] leading-[0.95]">
            Passez nous voir
            <span className="block font-script text-framboise">ou réservez votre midi</span>
          </h2>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              href="/carte"
              className="rounded-full bg-orange px-7 py-4 font-display text-[1.05rem] font-semibold tracking-[0.08em] text-encre uppercase transition-colors hover:bg-orange-vif"
            >
              Voir la carte
            </Link>
            <Link
              href="/contact"
              className="rounded-full border-2 border-encre px-7 py-[14px] font-display text-[1.05rem] font-semibold tracking-[0.08em] text-encre uppercase transition-colors hover:bg-encre hover:text-papier"
            >
              Nous contacter
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
