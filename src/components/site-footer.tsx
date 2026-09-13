import Link from "next/link";
import { IconeAdresse, IconeEmail, IconeInstagram, IconeTelephone } from "@/components/icones";
import { Logo } from "@/components/logo";
import { Epi } from "@/components/ornement";
import { HORAIRES, RESTAURANT } from "@/data/restaurant";

/** Bandeau noir déchiré, comme le pied de l'affiche et de l'enseigne. */
export function SiteFooter() {
  return (
    <footer className="bord-dechire mt-32 bg-encre pt-8 text-papier [--sur-titre-couleur:var(--color-orange)]">
      <div className="mx-auto grid max-w-[1240px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div className="flex flex-col gap-5">
          <Logo taille={76} clair />
          <p className="font-script text-2xl text-sable">{RESTAURANT.baseline}</p>
          <p className="font-display text-sm font-semibold tracking-[0.2em] text-orange uppercase">
            {RESTAURANT.activites.join(" · ")}
          </p>
        </div>

        <div>
          <h2 className="sur-titre mb-5">Horaires</h2>
          <ul className="flex flex-col gap-2">
            {HORAIRES.map((h) => (
              <li
                key={h.jour}
                className="flex items-baseline justify-between gap-4 border-b border-dashed border-papier/12 pb-2"
              >
                <span className="text-sable">{h.jour}</span>
                <span
                  className={`chiffres text-right ${
                    "ferme" in h && h.ferme ? "text-orange" : "text-papier"
                  }`}
                >
                  {h.service}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="sur-titre mb-5">Nous trouver</h2>
          <address className="flex flex-col gap-4 not-italic">
            <span className="flex items-start gap-3">
              <IconeAdresse className="mt-0.5 size-5 shrink-0 text-orange" />
              <span>
                {RESTAURANT.adresse}
                <br />
                {RESTAURANT.codePostal} {RESTAURANT.ville} — {RESTAURANT.region}
              </span>
            </span>
            <a
              href={`tel:${RESTAURANT.telephoneLien}`}
              className="flex items-center gap-3 transition-colors hover:text-orange"
            >
              <IconeTelephone className="size-5 shrink-0 text-orange" />
              <span className="chiffres text-lg">{RESTAURANT.telephone}</span>
            </a>
            <a
              href={`mailto:${RESTAURANT.email}`}
              className="flex items-center gap-3 transition-colors hover:text-orange"
            >
              <IconeEmail className="size-5 shrink-0 text-orange" />
              {/* Retour à la ligne autorisé avant « @ », jamais au milieu d'un mot. */}
              <span>
                {RESTAURANT.email.split("@")[0]}
                <wbr />@{RESTAURANT.email.split("@")[1]}
              </span>
            </a>
            <a
              href={RESTAURANT.instagram}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center gap-3 transition-colors hover:text-orange"
            >
              <IconeInstagram className="size-5 shrink-0 text-orange" />@{RESTAURANT.instagramPseudo}
            </a>
          </address>
        </div>
      </div>

      <div className="flex justify-center pb-6">
        <Epi className="h-6 w-60 text-sable/50" />
      </div>

      <div className="border-t border-papier/10">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-3 px-5 py-6 text-sm text-sable/80 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="font-display tracking-wide">
            © {new Date().getFullYear()} {RESTAURANT.nom} {RESTAURANT.suffixe}
          </p>
          <nav className="flex gap-5 font-display tracking-wide">
            <Link href="/cgv" className="transition-colors hover:text-orange">
              CGV
            </Link>
            <Link href="/mentions-legales" className="transition-colors hover:text-orange">
              Mentions légales
            </Link>
            <Link href="/contact" className="transition-colors hover:text-orange">
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
