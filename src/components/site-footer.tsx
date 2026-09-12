import Link from "next/link";
import { Logo } from "@/components/logo";
import { HORAIRES, RESTAURANT } from "@/data/restaurant";

export function SiteFooter() {
  return (
    <footer className="filet mt-32 bg-encre/40">
      <div className="mx-auto grid max-w-[1240px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div className="flex flex-col gap-5">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-creme-doux">
            {RESTAURANT.baseline} Une cuisine de saison préparée chaque matin, à
            emporter en {RESTAURANT.delaiRetrait} minutes.
          </p>
          <div className="flex gap-4">
            <a
              href={RESTAURANT.instagram}
              className="chiffres text-[0.7rem] tracking-[0.16em] text-creme-tres-doux uppercase transition-colors hover:text-beurre"
              rel="noreferrer noopener"
              target="_blank"
            >
              Instagram
            </a>
            <a
              href={RESTAURANT.facebook}
              className="chiffres text-[0.7rem] tracking-[0.16em] text-creme-tres-doux uppercase transition-colors hover:text-beurre"
              rel="noreferrer noopener"
              target="_blank"
            >
              Facebook
            </a>
          </div>
        </div>

        <div>
          <h2 className="sur-titre mb-5">Le service</h2>
          <ul className="flex flex-col gap-2">
            {HORAIRES.map((h) => (
              <li key={h.jour} className="flex items-baseline justify-between gap-4 text-sm">
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

        <div>
          <h2 className="sur-titre mb-5">Nous trouver</h2>
          <address className="flex flex-col gap-3 text-sm text-creme-doux not-italic">
            <span>
              {RESTAURANT.adresse}
              <br />
              {RESTAURANT.codePostal} {RESTAURANT.ville}
            </span>
            <a
              href={`tel:${RESTAURANT.telephoneLien}`}
              className="chiffres text-creme transition-colors hover:text-beurre"
            >
              {RESTAURANT.telephone}
            </a>
            <a
              href={`mailto:${RESTAURANT.email}`}
              className="transition-colors hover:text-beurre"
            >
              {RESTAURANT.email}
            </a>
          </address>
        </div>
      </div>

      <div className="filet">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-3 px-5 py-6 text-[0.7rem] text-creme-tres-doux sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="chiffres">
            © {new Date().getFullYear()} {RESTAURANT.nom} — Tous droits réservés
          </p>
          <nav className="flex gap-5">
            <Link href="/mentions-legales" className="transition-colors hover:text-creme">
              Mentions légales
            </Link>
            <Link href="/contact" className="transition-colors hover:text-creme">
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
