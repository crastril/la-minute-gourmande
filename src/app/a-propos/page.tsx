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
    titre: "La boulangerie ouvre",
    texte: "Le fournil, la vitrine, et une file qui déborde sur le trottoir dès la récréation.",
  },
  {
    annee: "2022",
    titre: "La restauration du midi",
    texte:
      "Burgers et plats du jour arrivent à la carte, pour ceux qui veulent autre chose qu'un sandwich.",
  },
  {
    annee: "2024",
    titre: "La réservation en ligne",
    texte:
      "Pour que les profs et le personnel puissent déjeuner sans passer leur pause entière dans la file.",
  },
];

const PRINCIPES = [
  { t: "Cuit sur place", d: "Le pain, les viennoiseries et les pâtisseries sortent de notre fournil." },
  { t: "Plusieurs fournées", d: "Le matin, avant la récréation et avant la sortie des cours." },
  { t: "Rien de congelé", d: "Pas de sauce en poudre, pas de plat réchauffé sous une lampe." },
  { t: "Prix lisibles", d: "Affichés en vitrine comme en ligne, sans supplément à la caisse." },
];

export default function APropos() {
  return (
    <>
      <section className="mx-auto max-w-[1240px] px-5 pt-16 pb-10 sm:px-8 sm:pt-24">
        <p className="sur-titre animate-rise">Depuis {RESTAURANT.fondation}</p>
        <h1 className="animate-veil mt-6 max-w-[15ch] text-[clamp(2.6rem,8vw,6rem)] leading-[0.9]">
          La boulangerie d&apos;en <span className="text-beurre italic">face</span>.
        </h1>
      </section>

      <section className="mx-auto grid max-w-[1240px] gap-12 px-5 pb-20 sm:px-8 lg:grid-cols-[1fr_0.85fr]">
        <Reveal className="flex flex-col gap-5 text-lg leading-relaxed text-creme-doux">
          <p>
            {RESTAURANT.nom}, c&apos;est la boulangerie en face du lycée. Le
            fournil tourne dès six heures et demie, la vitrine se remplit avant
            la première récréation, et à midi la cuisine prend le relais avec
            les burgers et le plat du jour.
          </p>
          <p>
            Le problème, on le voit tous les jours : à midi, la file sort sur le
            trottoir. Un élève a dix minutes, un professeur en a quarante. La
            réservation en ligne est née de là — vous commandez votre repas, on
            le prépare pour l&apos;heure que vous avez choisie, vous n&apos;avez
            plus qu&apos;à passer le prendre.
          </p>
          <p className="text-creme">
            La viennoiserie et le snacking, eux, restent au comptoir : c&apos;est
            là qu&apos;ils sont les meilleurs, chauds et tout juste sortis du four.
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
