import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { RESTAURANT } from "@/data/restaurant";

export const metadata: Metadata = {
  title: "La maison",
  description:
    "Une petite maison de cuisine ouverte en 2019 à Bordeaux : circuit court, tout fait maison, rien de congelé.",
};

const REPERES = [
  {
    annee: "2019",
    titre: "Le comptoir ouvre",
    texte: "Douze couverts, une carte au tableau noir, et déjà la règle du fait-maison.",
  },
  {
    annee: "2021",
    titre: "Le service traiteur",
    texte: "Les clients du midi demandent des buffets pour leurs bureaux. On dit oui.",
  },
  {
    annee: "2023",
    titre: "La commande en ligne",
    texte: "Pour supprimer la file du midi sans jamais préparer les plats à l'avance.",
  },
];

const PRINCIPES = [
  { t: "Rien de congelé", d: "Pas de surgelé, pas de sous-vide industriel, pas de sauce en poudre." },
  { t: "Trente kilomètres", d: "L'essentiel des produits vient de producteurs à moins de 30 km." },
  { t: "Carte courte", d: "Six plats maximum par service : c'est ce qui permet de tout faire soi-même." },
  { t: "Prix lisibles", d: "Service compris, pas de supplément caché à la caisse." },
];

export default function APropos() {
  return (
    <>
      <section className="mx-auto max-w-[1240px] px-5 pt-16 pb-10 sm:px-8 sm:pt-24">
        <p className="sur-titre animate-rise">Depuis {RESTAURANT.fondation}</p>
        <h1 className="animate-veil mt-6 max-w-[15ch] text-[clamp(2.6rem,8vw,6rem)] leading-[0.9]">
          Une petite maison de <span className="text-beurre italic">cuisine</span>.
        </h1>
      </section>

      <section className="mx-auto grid max-w-[1240px] gap-12 px-5 pb-20 sm:px-8 lg:grid-cols-[1fr_0.85fr]">
        <Reveal className="flex flex-col gap-5 text-lg leading-relaxed text-creme-doux">
          <p>
            {RESTAURANT.nom} est née d&apos;un constat banal : entre le sandwich
            sous plastique et le restaurant à une heure et demie, il ne restait
            rien pour déjeuner correctement quand on a quarante minutes devant
            soi.
          </p>
          <p>
            Nous avons donc construit l&apos;inverse d&apos;une chaîne. Une carte
            courte, écrite chaque matin après le marché. Une cuisine ouverte sur
            la salle, parce qu&apos;on n&apos;a rien à cacher. Et une promesse
            simple : votre commande part en cuisine au moment où vous la passez,
            pas trois heures avant.
          </p>
          <p className="text-creme">
            Aucune assiette ne sort d&apos;ici sans avoir été cuisinée le jour
            même, à {RESTAURANT.adresse}.
          </p>
        </Reveal>

        <Reveal delai={140}>
          <div className="relative aspect-[4/5] overflow-hidden rounded-ticket border border-creme/10">
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(75% 60% at 35% 25%, rgba(231,163,60,0.26) 0%, transparent 62%),
                  linear-gradient(155deg, #251e16, #14110d)
                `,
              }}
            />
            <p className="chiffres absolute bottom-5 left-5 text-[0.6rem] tracking-[0.2em] text-creme-tres-doux uppercase">
              ⚠ Visuel provisoire — portrait du chef à venir
            </p>
          </div>
        </Reveal>
      </section>

      <section className="filet bg-encre/40">
        <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8">
          <Reveal>
            <p className="sur-titre">Nos quatre règles</p>
          </Reveal>
          <dl className="mt-10 grid gap-px overflow-hidden rounded-ticket bg-creme/10 sm:grid-cols-2">
            {PRINCIPES.map((p, i) => (
              <Reveal key={p.t} delai={i * 90}>
                <div className="h-full bg-noir p-8">
                  <dt className="font-display text-2xl text-creme">{p.t}</dt>
                  <dd className="mt-3 text-sm leading-relaxed text-creme-doux">{p.d}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8">
        <Reveal>
          <p className="sur-titre">Quelques repères</p>
        </Reveal>
        <ol className="mt-10 flex flex-col">
          {REPERES.map((r, i) => (
            <Reveal as="li" key={r.annee} delai={i * 110}>
              <div className="grid items-baseline gap-3 border-t border-creme/10 py-8 sm:grid-cols-[7rem_1fr]">
                <span className="chiffres text-beurre">{r.annee}</span>
                <div>
                  <h2 className="font-display text-2xl text-creme">{r.titre}</h2>
                  <p className="mt-2 max-w-[52ch] text-sm leading-relaxed text-creme-doux">
                    {r.texte}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-12">
          <Link
            href="/carte"
            className="inline-block rounded-ticket bg-beurre px-7 py-4 text-sm font-medium text-noir transition-colors hover:bg-beurre-clair"
          >
            Voir la carte du jour
          </Link>
        </Reveal>
      </section>
    </>
  );
}
