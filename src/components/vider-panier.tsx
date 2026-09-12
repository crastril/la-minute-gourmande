"use client";

import { useEffect } from "react";
import { usePanier } from "@/components/cart-provider";

/** Vide le panier une fois la commande confirmée. */
export function ViderPanier() {
  const { vider, hydrate } = usePanier();

  useEffect(() => {
    if (hydrate) vider();
  }, [hydrate, vider]);

  return null;
}
