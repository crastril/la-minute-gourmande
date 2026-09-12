import Link from "next/link";
import { MenuCard } from "@/components/menu-card";
import { Reveal } from "@/components/reveal";
import { produitsDuJour } from "@/data/menu";
import { RESTAURANT } from "@/data/restaurant";

const ETAPES = [
  {
    numero: "01",
    titre: "Vous commandez",
    texte:
      "La carte change chaque matin selon le marché. Vous choisissez, vous payez en ligne, c'est réglé.",
  },
  {
    numero: "02",
    titre: "On cuisine",
    texte:
      "Rien n'est préparé à l'avance : votre commande part en cuisine dès qu'elle tombe sur le passe.",
  },
  {
    numero: "03",
    titre: "Vous récupérez",
    texte: `Quinze minutes plus tard, votre nom est sur le comptoir. Pas de file, pas d'attente.`,
  },
];

const TEMOIGNAGES = [
  {
    citation:
      "Le seul endroit du quartier où je peux déjeuner correctement en vingt minutes montre en main.",
    auteur: "Camille R.",
    role: "Habituée du mardi",
  },
  {
    citation:
      "On leur a confié le buffet des 40 ans de l'agence. Quarante-cinq couverts, zéro fausse note.",
    auteur: "Thomas B.",
    role: "Client traiteur",
  },
  {
    citation: "La blanquette est exactement celle de ma grand-mère. Je ne dis jamais ça.",
    auteur: "Sofia M.",
    role: "Cliente depuis 2021",
  },
];

const DEFILEMENT = [
  "Fait maison",
  "Produits de saison",
  "Circuit court",
  "Prêt en 15 minutes",
  "Zéro conservateur",
  "Cuisine ouverte",
];

export default function Accueil() {
  const duJour = produitsDuJour();

  return (
    <>
      {/* ——— Hero ——— */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background: `
              radial-gradient(70% 55% at 72% 12%, rgba(231,163,60,0.16) 0%, transparent 62%),
              radial-gradient(50% 40% at 8% 78%, rgba(169,192,92,0.09) 0%, transparent 60%)
            `,
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.55]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(245,238,226,0.05) 1px, transparent 1px)",
            backgroundSize: "clamp(80px, 12vw, 160px) 100%",
          }}
        />

        <div className="mx-auto max-w-[1240px] px-5 pt-16 pb-24 sm:px-8 sm:pt-24 lg:pt-28">
          <p className="sur-titre animate-rise">
            {RESTAURANT.ville} · Traiteur & cuisine du jour
          </p>

          <h1 className="mt-7 max-w-[16ch] text-[clamp(2.9rem,9.5vw,7.5rem)] leading-[0.88]">
            <span className="animate-veil block">Le fait-maison,</span>
            <span
              className="animate-veil block pl-[0.08em] text-beurre italic"
              style={{ animationDelay: "160ms" }}
            >
              à la minute.
            </span>
          </h1>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-end">
            <p
              className="animate-rise max-w-[46ch] text-lg leading-relaxed text-creme-doux"
              style={{ animationDelay: "320ms" }}
            >
              Une petite maison de cuisine qui prépare tout le matin même, achète
              à trente kilomètres à la ronde, et vous rend votre déjeuner chaud{" "}
              <span className="text-creme">
                {RESTAURANT.delaiRetrait} minutes après votre commande
              </span>
              . Rien de congelé, rien de réchauffé.
            </p>

            <div
              className="animate-rise flex flex-wrap items-center gap-3"
              style={{ animationDelay: "440ms" }}
            >
              <Link
                href="/carte"
                className="group relative overflow-hidden rounded-ticket bg-beurre px-7 py-4 text-sm font-medium text-noir transition-colors duration-300 hover:bg-beurre-clair"
              >
                Commander maintenant
                <span className="chiffres ml-3 text-[0.7rem] opacity-70">→</span>
              </Link>
              <Link
                href="/traiteur"
                className="rounded-ticket border border-creme/20 px-7 py-4 text-sm text-creme transition-colors duration-300 hover:border-beurre/60 hover:text-beurre-clair"
              >
                Devis traiteur
              </Link>
            </div>
          </div>

          {/* Bandeau « ticket de passe » */}
          <div
            className="animate-rise perfore filet mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-ticket bg-creme/10 md:grid-cols-4"
            style={{ animationDelay: "560ms" }}
          >
            {[
              { cle: "Retrait", valeur: `${RESTAURANT.delaiRetrait} min` },
              { cle: "Carte", valeur: "Renouvelée chaque jour" },
              { cle: "Formule", valeur: "dès 13,50 €" },
              { cle: "Traiteur", valeur: "jusqu'à 120 couverts" },
            ].map((item) => (
              <div key={item.cle} className="bg-noir px-5 py-6">
                <p className="chiffres text-[0.6rem] tracking-[0.2em] text-creme-tres-doux uppercase">
                  {item.cle}
                </p>
                <p className="mt-2 font-display text-xl text-creme">{item.valeur}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Bandeau défilant ——— */}
      <section aria-hidden className="filet overflow-hidden border-b border-creme/10 py-5">
        <div className="animate-defile flex w-max gap-10 whitespace-nowrap">
          {[...DEFILEMENT, ...DEFILEMENT, ...DEFILEMENT, ...DEFILEMENT].map((mot, i) => (
            <span
              key={`${mot}-${i}`}
              className="chiffres flex items-center gap-10 text-[0.7rem] tracking-[0.28em] text-creme-tres-doux uppercase"
            >
              {mot}
              <span className="text-beurre">✳</span>
            </span>
          ))}
        </div>
      </section>

      {/* ——— Le service en trois gestes ——— */}
      <section className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8">
        <Reveal>
          <p className="sur-titre">Comment ça marche</p>
          <h2 className="mt-4 max-w-[18ch] text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.02]">
            Trois gestes, <span className="text-beurre italic">quinze minutes</span>.
          </h2>
        </Reveal>

        <ol className="mt-14 grid gap-px overflow-hidden rounded-ticket bg-creme/10 md:grid-cols-3">
          {ETAPES.map((etape, i) => (
            <Reveal as="li" key={etape.numero} delai={i * 110}>
              <div className="group h-full bg-noir p-8 transition-colors duration-500 hover:bg-encre">
                <span className="chiffres text-[3.4rem] leading-none text-creme/10 transition-colors duration-500 group-hover:text-beurre/40">
                  {etape.numero}
                </span>
                <h3 className="mt-6 font-display text-2xl text-creme">{etape.titre}</h3>
                <p className="mt-3 text-sm leading-relaxed text-creme-doux">{etape.texte}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ——— La carte du jour ——— */}
      <section className="mx-auto max-w-[1240px] px-5 pb-24 sm:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="sur-titre">Aujourd&apos;hui au passe</p>
            <h2 className="mt-4 text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.02]">
              La carte du jour
            </h2>
          </div>
          <Link
            href="/carte"
            className="chiffres group flex items-center gap-2 text-[0.7rem] tracking-[0.18em] text-creme-doux uppercase transition-colors hover:text-beurre"
          >
            Voir toute la carte
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {duJour.map((produit, i) => (
            <Reveal key={produit.id} delai={i * 90}>
              <MenuCard produit={produit} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ——— Traiteur ——— */}
      <section className="filet relative overflow-hidden bg-encre/50">
        <div className="mx-auto grid max-w-[1240px] gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <Reveal>
            <p className="sur-titre">Événements</p>
            <h2 className="mt-4 text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.02]">
              On déplace la cuisine
              <span className="block text-pistache italic">chez vous.</span>
            </h2>
            <p className="mt-6 max-w-[48ch] leading-relaxed text-creme-doux">
              Anniversaires, séminaires, mariages, pots de départ : nous
              construisons un menu sur mesure, dressé sur place, avec le même
              principe qu&apos;au comptoir — tout est préparé le jour même.
            </p>
            <dl className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-3">
              {[
                { t: "10 à 120", d: "couverts" },
                { t: "72 h", d: "de délai minimum" },
                { t: "Sur mesure", d: "menus & régimes" },
              ].map((stat) => (
                <div key={stat.t}>
                  <dt className="font-display text-2xl text-creme">{stat.t}</dt>
                  <dd className="chiffres mt-1 text-[0.65rem] tracking-[0.16em] text-creme-tres-doux uppercase">
                    {stat.d}
                  </dd>
                </div>
              ))}
            </dl>
            <Link
              href="/traiteur"
              className="mt-10 inline-block rounded-ticket border border-pistache/45 px-7 py-4 text-sm text-pistache transition-colors duration-300 hover:bg-pistache hover:text-noir"
            >
              Demander un devis
            </Link>
          </Reveal>

          <Reveal delai={140} className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-ticket border border-creme/10">
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background: `
                    radial-gradient(80% 60% at 30% 22%, rgba(169,192,92,0.28) 0%, transparent 65%),
                    radial-gradient(70% 60% at 78% 80%, rgba(231,163,60,0.22) 0%, transparent 62%),
                    linear-gradient(160deg, #241e17, #14110d)
                  `,
                }}
              />
              <svg
                aria-hidden
                viewBox="0 0 100 125"
                className="absolute inset-0 size-full"
                preserveAspectRatio="xMidYMid slice"
              >
                {[0, 1, 2, 3, 4].map((i) => (
                  <circle
                    key={i}
                    cx={22 + i * 14}
                    cy={40 + (i % 2) * 34}
                    r={11 - i * 0.9}
                    fill="none"
                    stroke="#f5eee2"
                    strokeOpacity={0.16 - i * 0.015}
                    strokeWidth="0.4"
                  />
                ))}
              </svg>
              <p className="chiffres absolute bottom-5 left-5 text-[0.6rem] tracking-[0.2em] text-creme-tres-doux uppercase">
                ⚠ Visuel provisoire — photo client à venir
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— Témoignages ——— */}
      <section className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8">
        <Reveal>
          <p className="sur-titre">Ils reviennent</p>
        </Reveal>
        <div className="mt-12 grid gap-px overflow-hidden rounded-ticket bg-creme/10 md:grid-cols-3">
          {TEMOIGNAGES.map((t, i) => (
            <Reveal as="article" key={t.auteur} delai={i * 110}>
              <figure className="flex h-full flex-col justify-between gap-8 bg-noir p-8">
                <blockquote className="font-display text-xl leading-snug text-creme">
                  <span className="text-beurre">«</span> {t.citation}{" "}
                  <span className="text-beurre">»</span>
                </blockquote>
                <figcaption className="chiffres text-[0.65rem] tracking-[0.16em] text-creme-tres-doux uppercase">
                  {t.auteur} — {t.role}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ——— CTA final ——— */}
      <section className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <Reveal>
          <div className="perfore relative overflow-hidden rounded-ticket border border-beurre/25 bg-gradient-to-br from-beurre/12 to-transparent px-8 py-16 text-center sm:px-16">
            <p className="sur-titre">Le service du midi ouvre à 11h30</p>
            <h2 className="mx-auto mt-5 max-w-[16ch] text-[clamp(2rem,5vw,3.6rem)] leading-[1.02]">
              Votre déjeuner vous attend.
            </h2>
            <Link
              href="/carte"
              className="mt-9 inline-block rounded-ticket bg-beurre px-8 py-4 text-sm font-medium text-noir transition-colors duration-300 hover:bg-beurre-clair"
            >
              Composer ma commande
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
