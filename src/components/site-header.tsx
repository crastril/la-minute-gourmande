"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { usePanier } from "@/components/cart-provider";
import { IconeAdresse, IconeInstagram, IconeTelephone } from "@/components/icones";
import { Logo } from "@/components/logo";
import { RESTAURANT } from "@/data/restaurant";

const LIENS = [
  { href: "/carte", libelle: "La carte" },
  { href: "/a-propos", libelle: "La boutique" },
  { href: "/contact", libelle: "Contact" },
];

/** Horloge : clin d'œil au « Minute » du nom. */
function Horloge() {
  const [heure, setHeure] = useState<string | null>(null);

  useEffect(() => {
    const maj = () =>
      setHeure(
        new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" }).format(
          new Date(),
        ),
      );
    const premier = window.requestAnimationFrame(maj);
    const timer = window.setInterval(maj, 15_000);
    return () => {
      window.cancelAnimationFrame(premier);
      window.clearInterval(timer);
    };
  }, []);

  if (!heure) return <span className="chiffres w-11 text-sm" aria-hidden />;

  const [h, m] = heure.split(":");
  return (
    <span className="chiffres text-sm text-encre-douce" aria-label={`Il est ${h} h ${m}`}>
      {h}
      <span className="animate-tick mx-px text-orange-fonce">:</span>
      {m}
    </span>
  );
}

export function SiteHeader() {
  const chemin = usePathname();
  const { nombreArticles, hydrate } = usePanier();
  const [defile, setDefile] = useState(false);

  // Le menu mémorise la page sur laquelle il a été ouvert : changer de page
  // le referme naturellement, sans effet de synchronisation.
  const [ouvertSur, setOuvertSur] = useState<string | null>(null);
  const ouvert = ouvertSur === chemin;

  useEffect(() => {
    const onScroll = () => setDefile(window.scrollY > 44);
    const premier = window.requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(premier);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      {/* Bandeau noir, comme le bas de l'enseigne : téléphone et adresse. */}
      <div className="bg-encre text-papier">
        <div className="mx-auto flex h-9 max-w-[1240px] items-center justify-between gap-4 px-5 text-[0.85rem] sm:px-8">
          <span className="hidden items-center gap-2 font-display font-medium tracking-wide sm:flex">
            <IconeAdresse className="size-4 text-orange" />
            {RESTAURANT.adresse} · {RESTAURANT.ville}, {RESTAURANT.region}
          </span>
          <span className="font-display font-semibold tracking-[0.14em] text-sable uppercase sm:hidden">
            Retraits 11h30 – 13h30
          </span>
          <div className="flex items-center gap-4">
            <a
              href={`tel:${RESTAURANT.telephoneLien}`}
              className="flex items-center gap-1.5 font-display font-semibold tracking-wide transition-colors hover:text-orange"
            >
              <IconeTelephone className="size-4 text-orange" />
              {RESTAURANT.telephone}
            </a>
            <a
              href={RESTAURANT.instagram}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`Instagram ${RESTAURANT.instagramPseudo}`}
              className="transition-colors hover:text-orange"
            >
              <IconeInstagram className="size-[18px]" />
            </a>
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-40 transition-[background-color,box-shadow] duration-500 ${
          defile || ouvert
            ? "bg-papier/92 shadow-[0_1px_0_rgba(23,21,19,0.1)] backdrop-blur-xl"
            : "bg-papier"
        }`}
      >
        <div className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between gap-6 px-5 sm:px-8">
          <Link href="/" aria-label={`${RESTAURANT.nom} — accueil`}>
            <Logo />
          </Link>

          <nav aria-label="Navigation principale" className="hidden items-center gap-1 lg:flex">
            {LIENS.map((lien) => {
              const actif = chemin === lien.href || chemin.startsWith(`${lien.href}/`);
              return (
                <Link
                  key={lien.href}
                  href={lien.href}
                  aria-current={actif ? "page" : undefined}
                  className={`group relative px-3.5 py-2 font-display text-[1rem] font-semibold tracking-[0.12em] uppercase transition-colors ${
                    actif ? "text-encre" : "text-encre-douce hover:text-encre"
                  }`}
                >
                  {lien.libelle}
                  <span
                    className={`absolute inset-x-3.5 bottom-0.5 h-[3px] origin-left rounded-full bg-orange transition-transform duration-300 ${
                      actif ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden md:flex">
              <Horloge />
            </span>

            <Link
              href="/panier"
              className="group flex items-center gap-2.5 rounded-full bg-encre py-1.5 pr-1.5 pl-4 font-display text-[0.95rem] font-semibold tracking-[0.1em] text-papier uppercase transition-colors hover:bg-orange hover:text-encre"
            >
              Panier
              <span
                className={`chiffres grid size-7 place-items-center rounded-full text-[0.8rem] transition-colors ${
                  hydrate && nombreArticles > 0
                    ? "bg-orange text-encre group-hover:bg-encre group-hover:text-papier"
                    : "bg-papier/15 text-papier group-hover:bg-encre/15 group-hover:text-encre"
                }`}
              >
                {hydrate ? nombreArticles : 0}
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setOuvertSur(ouvert ? null : chemin)}
              aria-expanded={ouvert}
              aria-controls="menu-mobile"
              className="grid size-10 place-items-center rounded-full border-2 border-encre lg:hidden"
            >
              <span className="sr-only">{ouvert ? "Fermer le menu" : "Ouvrir le menu"}</span>
              <span aria-hidden className="flex w-4 flex-col gap-[3px]">
                <span
                  className={`h-0.5 w-full rounded bg-encre transition-transform duration-300 ${
                    ouvert ? "translate-y-[5px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`h-0.5 w-full rounded bg-encre transition-opacity ${ouvert ? "opacity-0" : ""}`}
                />
                <span
                  className={`h-0.5 w-full rounded bg-encre transition-transform duration-300 ${
                    ouvert ? "-translate-y-[5px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>

        <div id="menu-mobile" hidden={!ouvert} className="border-t border-encre/10 bg-papier lg:hidden">
          <nav aria-label="Navigation mobile" className="mx-auto max-w-[1240px] px-5 py-4 sm:px-8">
            {LIENS.map((lien, i) => (
              <Link
                key={lien.href}
                href={lien.href}
                className="flex items-baseline justify-between border-b border-dashed border-encre/15 py-4 font-titre text-3xl text-encre uppercase last:border-0"
              >
                {lien.libelle}
                <span className="chiffres text-sm text-orange-fonce">0{i + 1}</span>
              </Link>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
}
