import Link from "next/link";
import { MenuCard } from "@/components/menu-card";
import { Reveal } from "@/components/reveal";
import { produitsDuJour } from "@/data/menu";
import { RESTAURANT } from "@/data/restaurant";

/**
 * ⚠️ Textes de démonstration : structure validée, formulations à faire
 * relire par le client avant mise en ligne.
 */

const ETAPES = [
  {
    numero: "01",
    titre: "Vous réservez",
    texte:
      "Menus et plats du midi se commandent en ligne, jusqu'au matin même. Vous choisissez l'heure à laquelle vous passez.",
  },
  {
    numero: "02",
    titre: "On prépare",
    texte:
      "Tout est fait sur place : le pain le matin, les plats à l'heure de votre créneau. Rien n'attend sous une lampe.",
  },
  {
    numero: "03",
    titre: "Vous récupérez",
    texte:
      "Votre nom est sur le comptoir à l'heure dite. Vous passez devant la file, vous repartez.",
  },
];

const TEMOIGNAGES = [
  {
    citation:
      "Quarante minutes de pause et cent cinquante élèves devant moi : sans la réservation, je ne déjeunais jamais.",
    auteur: "Nathalie",
    role: "Professeure au lycée",
  },
  {
    citation: "Les parts de pizza à la sortie des cours, c'est une institution ici.",
    auteur: "Yanis",
    role: "Terminale",
  },
  {
    citation: "On commande à huit pour la salle des profs, tout est prêt et étiqueté à 12h15.",
    auteur: "Marc",
    role: "Habitué du vendredi",
  },
];

const DEFILEMENT = [
  "Cuit sur place",
  "Viennoiseries pur beurre",
  "Menus du midi",
  "Sans file d'attente",
  "En face du lycée",
  "Réservation en ligne",
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
            {RESTAURANT.ville} · Boulangerie & restauration
          </p>

          <h1 className="mt-7 max-w-[16ch] text-[clamp(2.9rem,9.5vw,7.5rem)] leading-[0.88]">
            <span className="animate-veil block">Commandez le matin,</span>
            <span
              className="animate-veil block pl-[0.08em] text-beurre italic"
              style={{ animationDelay: "160ms" }}
            >
              mangez à midi.
            </span>
          </h1>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-end">
            <p
              className="animate-rise max-w-[48ch] text-lg leading-relaxed text-creme-doux"
              style={{ animationDelay: "320ms" }}
            >
              La boulangerie en face du lycée. Viennoiseries, parts de pizza et
              sandwichs au comptoir toute la journée — et, pour le midi,{" "}
              <span className="text-creme">
                des menus et des plats à réserver en ligne
              </span>{" "}
              que vous récupérez à l&apos;heure que vous avez choisie.
            </p>

            <div
              className="animate-rise flex flex-wrap items-center gap-3"
              style={{ animationDelay: "440ms" }}
            >
              <Link
                href="/carte"
                className="group relative overflow-hidden rounded-ticket bg-beurre px-7 py-4 text-sm font-medium text-noir transition-colors duration-300 hover:bg-beurre-clair"
              >
                Réserver mon déjeuner
                <span className="chiffres ml-3 text-[0.7rem] opacity-70">→</span>
              </Link>
              <Link
                href="/carte#viennoiseries"
                className="rounded-ticket border border-creme/20 px-7 py-4 text-sm text-creme transition-colors duration-300 hover:border-beurre/60 hover:text-beurre-clair"
              >
                Voir la vitrine
              </Link>
            </div>
          </div>

          {/* Bandeau « ticket de passe » */}
          <div
            className="animate-rise perfore filet mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-ticket bg-creme/10 md:grid-cols-4"
            style={{ animationDelay: "560ms" }}
          >
            {[
              { cle: "Retrait", valeur: "11h30 — 13h30" },
              { cle: "Préparation", valeur: `${RESTAURANT.delaiRetrait} min` },
              { cle: "Menus", valeur: "dès 8,90 €" },
              { cle: "Règlement", valeur: "en ligne ou sur place" },
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
          <p className="sur-titre">La réservation du midi</p>
          <h2 className="mt-4 max-w-[18ch] text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.02]">
            Trois gestes, <span className="text-beurre italic">zéro file</span>.
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

      {/* ——— À réserver aujourd'hui ——— */}
      <section className="mx-auto max-w-[1240px] px-5 pb-24 sm:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="sur-titre">Pour le midi</p>
            <h2 className="mt-4 text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.02]">
              À réserver aujourd&apos;hui
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

      {/* ——— La vitrine, au comptoir ——— */}
      <section className="filet relative overflow-hidden bg-encre/50">
        <div className="mx-auto grid max-w-[1240px] gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <Reveal>
            <p className="sur-titre">Sans réservation</p>
            <h2 className="mt-4 text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.02]">
              La vitrine,
              <span className="block text-pistache italic">toute la journée.</span>
            </h2>
            <p className="mt-6 max-w-[48ch] leading-relaxed text-creme-doux">
              Viennoiseries pur beurre, parts de pizza, sandwichs, pâtisseries :
              tout ça se prend directement au comptoir, sans commander à
              l&apos;avance. Plusieurs fournées par jour, y compris pour la
              sortie des cours.
            </p>
            <dl className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-3">
              {[
                { t: "06h30", d: "première fournée" },
                { t: "Dès 1,20 €", d: "la viennoiserie" },
                { t: "Sur place", d: "pain, snacking, pâtisserie" },
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
              href="/carte#viennoiseries"
              className="mt-10 inline-block rounded-ticket border border-pistache/45 px-7 py-4 text-sm text-pistache transition-colors duration-300 hover:bg-pistache hover:text-noir"
            >
              Découvrir la vitrine
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
            <p className="sur-titre">Retraits de 11h30 à 13h30</p>
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
