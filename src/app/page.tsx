import Image from "next/image";
import Link from "next/link";
import {
  IconeAdresse,
  IconeCroissant,
  IconeEmail,
  IconeGlace,
  IconeInstagram,
  IconeSac,
  IconeSandwich,
  IconeSmartphone,
  IconeTelephone,
  IconeToque,
} from "@/components/icones";
import { MenuCard } from "@/components/menu-card";
import { Epi, Rameau } from "@/components/ornement";
import { Reveal } from "@/components/reveal";
import { PRODUITS, produitsDuJour } from "@/data/menu";
import { DATE_OUVERTURE, RESTAURANT } from "@/data/restaurant";
import { prix } from "@/lib/format";

/**
 * ⚠️ Textes à faire relire par le client. Ils reprennent autant que possible
 * les formulations de l'affiche, de l'enseigne et du menu imprimé.
 */

// Lu dans le catalogue : le bandeau suit automatiquement les vrais prix.
const PRIX_MENU_MINIMUM = Math.min(
  ...PRODUITS.filter((p) => p.categorie === "menus").map((p) => p.prix),
);

const INFOS = [
  { cle: "Retrait", valeur: "11h30 – 13h30" },
  { cle: "Préparation", valeur: `${RESTAURANT.delaiRetrait} min` },
  { cle: "Menus", valeur: `dès ${prix(PRIX_MENU_MINIMUM)}` },
  { cle: "Règlement", valeur: "En ligne ou sur place" },
];

const DEFILEMENT = [
  "Fait maison avec passion",
  "Sandwicherie",
  "Pâtisserie",
  "Restauration rapide",
  "Réservation du midi",
  "Le François · Martinique",
];

const ETAPES = [
  {
    numero: "01",
    Icone: IconeSmartphone,
    titre: "Vous réservez",
    texte:
      "Menus, plats et burgers du midi se commandent en ligne. Vous choisissez l'heure à laquelle vous passez.",
  },
  {
    numero: "02",
    Icone: IconeToque,
    titre: "On prépare",
    texte: "Votre commande est préparée pour votre créneau, au moment où la cuisine tourne.",
  },
  {
    numero: "03",
    Icone: IconeSac,
    titre: "Vous récupérez",
    texte: "Elle vous attend au comptoir, à votre nom. Vous passez devant la file, vous repartez.",
  },
];

// Repris du menu imprimé en boutique.
const VITRINE = [
  {
    Icone: IconeCroissant,
    titre: "Viennoiseries",
    texte: "Pains au chocolat, pommes cannelle, beignets, pâtés banane ou goyave.",
  },
  {
    Icone: IconeSandwich,
    titre: "Sandwichs & paninis",
    texte: "Jambon fromage, poulet, thon mayonnaise, morue… et hot-dogs.",
  },
  {
    Icone: IconeGlace,
    titre: "Glaces",
    texte: "Cornetto, Magnum, Floup et Mister Friz.",
  },
];

const CONTACTS = [
  {
    Icone: IconeAdresse,
    libelle: "Adresse",
    valeur: `${RESTAURANT.adresse}, ${RESTAURANT.codePostal} ${RESTAURANT.ville}`,
    href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${RESTAURANT.adresse} ${RESTAURANT.codePostal} ${RESTAURANT.ville} ${RESTAURANT.region}`,
    )}`,
    externe: true,
  },
  {
    Icone: IconeTelephone,
    libelle: "Téléphone",
    valeur: RESTAURANT.telephone,
    href: `tel:${RESTAURANT.telephoneLien}`,
    externe: false,
  },
  {
    Icone: IconeEmail,
    libelle: "E-mail",
    valeur: RESTAURANT.email,
    href: `mailto:${RESTAURANT.email}`,
    externe: false,
  },
  {
    Icone: IconeInstagram,
    libelle: "Instagram",
    valeur: `@${RESTAURANT.instagramPseudo}`,
    href: RESTAURANT.instagram,
    externe: true,
  },
];

const boutonPlein =
  "inline-block rounded-full bg-orange px-7 py-4 font-display text-[1.05rem] font-semibold tracking-[0.08em] text-encre uppercase transition-colors hover:bg-orange-vif";
const boutonContour =
  "inline-block rounded-full border-2 border-encre px-7 py-[14px] font-display text-[1.05rem] font-semibold tracking-[0.08em] text-encre uppercase transition-colors hover:bg-encre hover:text-papier";

export default function Accueil() {
  const duJour = produitsDuJour();

  return (
    <>
      {/* ——— Hero ——— */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-[1240px] items-center gap-14 px-5 pt-12 pb-14 sm:px-8 sm:pt-16 lg:grid-cols-[1.15fr_0.85fr] lg:pt-20 lg:pb-20">
          <div>
            <p className="sur-titre animate-rise">{RESTAURANT.activites.join(" · ")}</p>

            <h1 className="mt-6 text-[clamp(3rem,8.6vw,6.6rem)] leading-[0.92]">
              <span className="animate-veil block">Commandez</span>
              <span className="animate-veil block" style={{ animationDelay: "120ms" }}>
                le matin,
              </span>
              <span
                className="animate-veil mt-1 block font-script text-[0.7em] leading-[1.2] text-orange"
                style={{ animationDelay: "260ms" }}
              >
                mangez à midi !
              </span>
            </h1>

            <p
              className="animate-rise mt-7 max-w-[46ch] text-lg leading-relaxed text-encre-douce"
              style={{ animationDelay: "360ms" }}
            >
              Sandwicherie, pâtisserie et restauration rapide au François, en
              face du lycée. La vitrine est ouverte toute la journée — et pour le
              midi,{" "}
              <strong className="font-semibold text-encre">
                menus, plats et burgers se réservent en ligne
              </strong>
              , prêts à l&apos;heure que vous choisissez.
            </p>

            <div
              className="animate-rise mt-9 flex flex-wrap gap-3"
              style={{ animationDelay: "460ms" }}
            >
              <Link href="/carte" className={boutonPlein}>
                Réserver mon déjeuner →
              </Link>
              <Link href="/carte#viennoiseries" className={boutonContour}>
                Voir la vitrine
              </Link>
            </div>
          </div>

          <div
            className="animate-rise relative isolate mx-auto w-full max-w-[440px]"
            style={{ animationDelay: "200ms" }}
          >
            {/* Coups de pinceau orange, repris de l'enseigne */}
            <svg
              aria-hidden
              viewBox="0 0 400 400"
              fill="none"
              className="absolute inset-0 -z-10 size-full scale-125 text-orange"
            >
              <path
                d="M30 262 C 120 130, 262 70, 372 96"
                stroke="currentColor"
                strokeWidth="50"
                strokeLinecap="round"
                opacity="0.92"
              />
              <path
                d="M64 330 C 168 236, 282 208, 366 228"
                stroke="currentColor"
                strokeWidth="22"
                strokeLinecap="round"
                opacity="0.5"
              />
              <path
                d="M318 34 l40 -16 M334 64 l50 -8 M340 98 l40 6"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
              />
            </svg>
            <Image
              src="/brand/logo.png"
              alt={`Logo ${RESTAURANT.nom} ${RESTAURANT.suffixe}`}
              width={640}
              height={640}
              sizes="(max-width: 1024px) 80vw, 440px"
              className="relative w-full -rotate-6 drop-shadow-[0_28px_40px_rgba(23,21,19,0.25)]"
            />
            <p className="ruban absolute -bottom-3 left-1/2 w-max -translate-x-1/2 rotate-2 bg-encre px-8 py-3 font-display text-[0.95rem] font-semibold tracking-[0.16em] text-papier uppercase">
              Ouvert depuis le {DATE_OUVERTURE}
            </p>
          </div>
        </div>

        {/* Bandeau d'infos, noir comme le bas de l'enseigne */}
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <div
            className="animate-rise grid grid-cols-2 gap-px overflow-hidden rounded-[18px] bg-papier/15 md:grid-cols-4"
            style={{ animationDelay: "560ms" }}
          >
            {INFOS.map((item) => (
              <div key={item.cle} className="bg-encre px-6 py-5 text-papier">
                <p className="font-display text-[0.75rem] font-semibold tracking-[0.2em] text-orange uppercase">
                  {item.cle}
                </p>
                <p className="mt-1 font-display text-[1.35rem] leading-tight font-bold uppercase">
                  {item.valeur}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Bandeau défilant ——— */}
      <section aria-hidden className="mt-16 overflow-hidden bg-orange py-3.5 text-encre">
        <div className="animate-defile flex w-max gap-8 whitespace-nowrap">
          {[...DEFILEMENT, ...DEFILEMENT, ...DEFILEMENT, ...DEFILEMENT].map((mot, i) => (
            <span
              key={`${mot}-${i}`}
              className="flex items-center gap-8 font-display text-[1rem] font-semibold tracking-[0.2em] uppercase"
            >
              {mot}
              <span className="text-xl leading-none">•</span>
            </span>
          ))}
        </div>
      </section>

      {/* ——— La réservation en trois étapes ——— */}
      <section className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8">
        <Reveal className="flex flex-col items-start gap-4">
          <p className="sur-titre">La réservation du midi</p>
          <h2 className="max-w-[16ch] text-[clamp(2.2rem,5vw,3.8rem)] leading-[0.95]">
            Trois étapes, <span className="font-script text-orange">zéro file !</span>
          </h2>
        </Reveal>

        <ol className="mt-14 grid gap-5 md:grid-cols-3">
          {ETAPES.map(({ numero, Icone, titre, texte }, i) => (
            <Reveal as="li" key={numero} delai={i * 110}>
              <div className="relative h-full rounded-[18px] border-2 border-dashed border-encre/20 bg-carte p-8">
                <span
                  aria-hidden
                  className="absolute top-6 right-7 font-titre text-4xl text-encre/10"
                >
                  {numero}
                </span>
                <span className="grid size-16 place-items-center rounded-full border-2 border-orange text-orange-fonce">
                  <Icone className="size-8" />
                </span>
                <h3 className="mt-6 text-2xl text-encre">{titre}</h3>
                <p className="mt-2 leading-relaxed text-encre-douce">{texte}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ——— À réserver aujourd'hui ——— */}
      <section className="mx-auto max-w-[1240px] px-5 pb-24 sm:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col items-start gap-4">
            <p className="sur-titre">Pour le midi</p>
            <h2 className="text-[clamp(2.2rem,5vw,3.8rem)] leading-[0.95]">
              À réserver <span className="font-script text-orange">aujourd&apos;hui</span>
            </h2>
          </div>
          <Link
            href="/carte"
            className="group flex items-center gap-2 font-display font-semibold tracking-[0.14em] text-encre uppercase transition-colors hover:text-orange-fonce"
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

      {/* ——— La vitrine (framboise, comme l'affiche d'ouverture) ——— */}
      <section className="relative overflow-hidden bg-sable/50">
        <Rameau className="pointer-events-none absolute -top-4 left-[4%] h-40 w-28 -rotate-12 text-framboise/25" />
        <Rameau className="pointer-events-none absolute right-[5%] bottom-6 h-36 w-24 rotate-[160deg] text-framboise/20" />

        <div className="relative mx-auto max-w-[1240px] px-5 py-24 sm:px-8">
          <Reveal className="flex flex-col items-center text-center [--sur-titre-couleur:var(--color-framboise-fonce)]">
            <p className="sur-titre">Sans réservation</p>
            <h2 className="mt-4 text-[clamp(2.2rem,5vw,3.8rem)] leading-[0.95]">
              La vitrine
              <span className="block font-script text-framboise">toute la journée</span>
            </h2>
            <Epi className="mt-5 h-6 w-60 text-encre/55" />
            <p className="mt-5 max-w-[52ch] leading-relaxed text-encre-douce">
              Pas besoin de commander à l&apos;avance : tout ce qui suit se prend
              directement au comptoir.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-12 md:grid-cols-3 md:gap-0 md:divide-x-2 md:divide-dashed md:divide-framboise/30">
            {VITRINE.map(({ Icone, titre, texte }, i) => (
              <Reveal key={titre} delai={i * 110} className="flex flex-col items-center px-8 text-center">
                <span className="grid size-20 place-items-center rounded-full border-2 border-framboise bg-carte text-framboise-fonce">
                  <Icone className="size-10" />
                </span>
                <h3 className="mt-5 text-xl text-encre">{titre}</h3>
                <p className="mt-2 max-w-[30ch] text-sm leading-relaxed text-encre-douce">{texte}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-14 flex justify-center">
            <Link
              href="/carte#viennoiseries"
              className="rounded-full border-2 border-framboise-fonce px-7 py-[14px] font-display text-[1.05rem] font-semibold tracking-[0.08em] text-framboise-fonce uppercase transition-colors hover:bg-framboise-fonce hover:text-papier"
            >
              Découvrir la vitrine
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ——— Nous trouver ——— */}
      <section className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <Reveal>
            <div className="rounded-[22px] bg-encre p-8 text-papier sm:p-10 [--sur-titre-couleur:var(--color-orange)]">
              <p className="sur-titre">Nous trouver</p>
              <ul className="mt-7 flex flex-col gap-5">
                {CONTACTS.map(({ Icone, libelle, valeur, href, externe }) => (
                  <li key={libelle}>
                    <a
                      href={href}
                      {...(externe ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                      className="group flex items-center gap-4"
                    >
                      <span className="grid size-12 shrink-0 place-items-center rounded-full bg-orange text-encre">
                        <Icone className="size-6" />
                      </span>
                      <span className="flex min-w-0 flex-col">
                        <span className="font-display text-[0.75rem] font-semibold tracking-[0.18em] text-sable uppercase">
                          {libelle}
                        </span>
                        <span className="text-lg text-papier transition-colors group-hover:text-orange">
                          {/* Dans une adresse e-mail, la coupure tombe avant « @ », pas au milieu d'un mot. */}
                          {valeur.indexOf("@") > 0 ? (
                            <>
                              {valeur.slice(0, valeur.indexOf("@"))}
                              <wbr />
                              {valeur.slice(valeur.indexOf("@"))}
                            </>
                          ) : (
                            valeur
                          )}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delai={140} className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <p className="sur-titre">Grande ouverture</p>
            <h2 className="mt-4 text-[clamp(2.2rem,5vw,3.6rem)] leading-[0.95]">
              Le {DATE_OUVERTURE}
            </h2>
            <p className="mt-3 font-script text-3xl text-framboise">Rejoignez l&apos;aventure !</p>
            <p className="mt-5 max-w-[42ch] leading-relaxed text-encre-douce">
              Suivez l&apos;actualité de la boutique sur Instagram.
            </p>
            <a
              href={RESTAURANT.instagram}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-7 inline-flex items-center gap-2 rounded-full border-2 border-encre px-6 py-3 font-display font-semibold tracking-[0.08em] uppercase transition-colors hover:bg-encre hover:text-papier"
            >
              <IconeInstagram className="size-5" />@{RESTAURANT.instagramPseudo}
            </a>
          </Reveal>
        </div>
      </section>

      {/* ——— Appel final ——— */}
      <section className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-[24px] bg-encre px-8 py-16 text-center text-papier sm:px-16 [--sur-titre-couleur:var(--color-orange)]">
            <svg
              aria-hidden
              viewBox="0 0 400 200"
              preserveAspectRatio="none"
              fill="none"
              className="absolute inset-0 -z-10 size-full text-orange"
            >
              <path
                d="M-20 178 C 90 120, 180 152, 262 110 S 382 58, 430 28"
                stroke="currentColor"
                strokeWidth="34"
                strokeLinecap="round"
                opacity="0.2"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <p className="sur-titre">Retraits de 11h30 à 13h30</p>
            <h2 className="mx-auto mt-5 max-w-[18ch] text-[clamp(2.2rem,5vw,3.8rem)] leading-[0.95] text-papier">
              Votre déjeuner
              <span className="block font-script text-orange">vous attend !</span>
            </h2>
            <Link href="/carte" className={`mt-9 ${boutonPlein}`}>
              Composer ma commande
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
