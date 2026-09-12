"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { usePanier } from "@/components/cart-provider";
import { Logo } from "@/components/logo";

const LIENS = [
  { href: "/carte", libelle: "La carte" },
  { href: "/traiteur", libelle: "Traiteur" },
  { href: "/a-propos", libelle: "La maison" },
  { href: "/contact", libelle: "Contact" },
];

/** Horloge de service : le fil rouge « à la minute » de l'identité. */
function Horloge() {
  const [heure, setHeure] = useState<string | null>(null);

  useEffect(() => {
    const maj = () =>
      setHeure(
        new Intl.DateTimeFormat("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date()),
      );
    maj();
    const timer = window.setInterval(maj, 15_000);
    return () => window.clearInterval(timer);
  }, []);

  if (!heure) return <span className="chiffres w-11 text-xs" aria-hidden />;

  const [h, m] = heure.split(":");
  return (
    <span className="chiffres text-xs text-creme-doux" aria-label={`Il est ${h} h ${m}`}>
      {h}
      <span className="animate-tick mx-px text-beurre">:</span>
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
    const onScroll = () => setDefile(window.scrollY > 24);
    const premier = window.requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(premier);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-500 ${
        defile || ouvert
          ? "border-b border-creme/10 bg-noir/85 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between gap-6 px-5 sm:px-8">
        <Link href="/" aria-label="La Minute Gourmande — accueil">
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
                className={`relative rounded-ticket px-3.5 py-2 text-sm transition-colors duration-300 ${
                  actif ? "text-creme" : "text-creme-doux hover:text-creme"
                }`}
              >
                {lien.libelle}
                <span
                  className={`absolute inset-x-3.5 bottom-1 h-px origin-left bg-beurre transition-transform duration-400 ${
                    actif ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-2 md:flex">
            <Horloge />
          </span>

          <Link
            href="/panier"
            className="group relative flex items-center gap-2 rounded-ticket border border-creme/15 px-3.5 py-2 text-sm text-creme transition-colors duration-300 hover:border-beurre/60 hover:bg-beurre/5"
          >
            <span>Panier</span>
            <span
              className={`chiffres grid size-5 place-items-center rounded-full text-[0.65rem] transition-colors ${
                hydrate && nombreArticles > 0
                  ? "bg-beurre text-noir"
                  : "bg-creme/10 text-creme-doux"
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
            className="grid size-9 place-items-center rounded-ticket border border-creme/15 lg:hidden"
          >
            <span className="sr-only">{ouvert ? "Fermer le menu" : "Ouvrir le menu"}</span>
            <span aria-hidden className="flex w-4 flex-col gap-[3px]">
              <span
                className={`h-px w-full bg-creme transition-transform duration-300 ${
                  ouvert ? "translate-y-[4px] rotate-45" : ""
                }`}
              />
              <span className={`h-px w-full bg-creme transition-opacity ${ouvert ? "opacity-0" : ""}`} />
              <span
                className={`h-px w-full bg-creme transition-transform duration-300 ${
                  ouvert ? "-translate-y-[4px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        id="menu-mobile"
        hidden={!ouvert}
        className="border-t border-creme/10 bg-noir/95 backdrop-blur-xl lg:hidden"
      >
        <nav aria-label="Navigation mobile" className="mx-auto max-w-[1240px] px-5 py-4 sm:px-8">
          {LIENS.map((lien, i) => (
            <Link
              key={lien.href}
              href={lien.href}
              className="flex items-baseline justify-between border-b border-creme/8 py-3.5 font-display text-2xl text-creme last:border-0"
            >
              {lien.libelle}
              <span className="chiffres text-[0.6rem] text-creme-tres-doux">
                0{i + 1}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
