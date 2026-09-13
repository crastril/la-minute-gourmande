"use client";

import Link from "next/link";
import { usePanier } from "@/components/cart-provider";
import { prix } from "@/lib/format";

/** Rappel de panier ancré en bas de la carte, une fois un article ajouté. */
export function PanierFlottant() {
  const { nombreArticles, total, hydrate } = usePanier();
  const visible = hydrate && nombreArticles > 0;

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 px-4 pb-4 transition-all duration-500 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <div className="mx-auto flex max-w-[560px] items-center justify-between gap-4 rounded-ticket border border-orange/30 bg-carte/95 py-3 pr-3 pl-5 shadow-[0_18px_50px_-12px_rgba(23,21,19,0.22)] backdrop-blur-xl">
        <p className="text-sm text-encre-douce">
          <span className="chiffres text-encre">{nombreArticles}</span>{" "}
          {nombreArticles > 1 ? "articles" : "article"}
          <span className="mx-2 text-encre/25">·</span>
          <span className="chiffres text-orange-fonce">{prix(total)}</span>
        </p>
        <Link
          href="/panier"
          tabIndex={visible ? 0 : -1}
          className="rounded-ticket bg-orange px-5 py-2.5 text-sm font-medium text-encre transition-colors hover:bg-orange-vif"
        >
          Voir le panier
        </Link>
      </div>
    </div>
  );
}
