"use client";

import { useEffect, useRef, useState } from "react";
import { usePanier } from "@/components/cart-provider";
import type { Produit } from "@/data/menu";

export function AddToCart({
  produit,
  variante = "ligne",
}: {
  produit: Produit;
  variante?: "ligne" | "plein";
}) {
  const { ajouter } = usePanier();
  const [confirme, setConfirme] = useState(false);
  const minuteur = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(minuteur.current), []);

  if (produit.epuise) {
    return (
      <span className="chiffres rounded-ticket border border-creme/10 px-3 py-2 text-[0.7rem] text-creme-tres-doux uppercase">
        Épuisé
      </span>
    );
  }

  const onClick = () => {
    ajouter(produit.id);
    setConfirme(true);
    window.clearTimeout(minuteur.current);
    minuteur.current = window.setTimeout(() => setConfirme(false), 1600);
  };

  const base =
    "group/btn relative overflow-hidden rounded-ticket text-sm transition-all duration-300 active:scale-[0.97]";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Ajouter ${produit.nom} au panier`}
      className={
        variante === "plein"
          ? `${base} w-full bg-beurre px-5 py-3 font-medium text-noir hover:bg-beurre-clair`
          : `${base} border border-creme/15 px-4 py-2 text-creme hover:border-beurre/60 hover:bg-beurre/10 hover:text-beurre-clair`
      }
    >
      <span
        aria-hidden
        className={`flex items-center justify-center gap-1.5 transition-transform duration-300 ${
          confirme ? "-translate-y-7" : ""
        }`}
      >
        Ajouter
        <span className="text-base leading-none">+</span>
      </span>
      <span
        aria-hidden
        className={`chiffres absolute inset-0 flex items-center justify-center text-[0.7rem] tracking-widest uppercase transition-transform duration-300 ${
          confirme ? "translate-y-0" : "translate-y-7"
        }`}
      >
        Au panier ✓
      </span>
      <span role="status" aria-live="polite" className="sr-only">
        {confirme ? `${produit.nom} ajouté au panier` : ""}
      </span>
    </button>
  );
}
