"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import { CATALOGUE, type Produit } from "@/data/menu";

const CLE_STOCKAGE = "lmg.panier.v1";

export type LignePanier = { id: string; quantite: number };

export type LigneDetaillee = LignePanier & {
  produit: Produit;
  sousTotal: number;
};

/* ————————————————————————————————————————————————————————————
 * Le panier vit hors de React : un petit store externe, lu via
 * useSyncExternalStore. Avantages sur un état local + useEffect :
 *  — pas de rendu en cascade à l'hydratation,
 *  — synchronisation automatique entre les onglets ouverts.
 * ———————————————————————————————————————————————————————————— */

const VIDE: LignePanier[] = [];

let etat: LignePanier[] = VIDE;
let chargeDepuisStockage = false;
const abonnes = new Set<() => void>();

function lireStockage(): LignePanier[] {
  try {
    const brut = window.localStorage.getItem(CLE_STOCKAGE);
    if (!brut) return VIDE;
    const donnees: unknown = JSON.parse(brut);
    if (!Array.isArray(donnees)) return VIDE;

    const lignes = donnees
      .filter(
        (l): l is LignePanier =>
          typeof l === "object" &&
          l !== null &&
          typeof (l as LignePanier).id === "string" &&
          typeof (l as LignePanier).quantite === "number",
      )
      // Un produit retiré de la carte ne doit pas ressusciter depuis le stockage.
      .filter((l) => CATALOGUE.has(l.id) && l.quantite > 0)
      .map((l) => ({ id: l.id, quantite: Math.min(Math.floor(l.quantite), 20) }));

    return lignes.length > 0 ? lignes : VIDE;
  } catch {
    return VIDE;
  }
}

function ecrireStockage() {
  try {
    window.localStorage.setItem(CLE_STOCKAGE, JSON.stringify(etat));
  } catch {
    // Stockage indisponible (navigation privée) : le panier reste en mémoire.
  }
}

function publier(nouvelEtat: LignePanier[]) {
  etat = nouvelEtat;
  ecrireStockage();
  for (const notifier of abonnes) notifier();
}

function surStockageExterne(evenement: StorageEvent) {
  if (evenement.key !== null && evenement.key !== CLE_STOCKAGE) return;
  etat = lireStockage();
  for (const notifier of abonnes) notifier();
}

function abonner(notifier: () => void) {
  if (!chargeDepuisStockage) {
    etat = lireStockage();
    chargeDepuisStockage = true;
  }
  if (abonnes.size === 0) {
    window.addEventListener("storage", surStockageExterne);
  }
  abonnes.add(notifier);

  return () => {
    abonnes.delete(notifier);
    if (abonnes.size === 0) {
      window.removeEventListener("storage", surStockageExterne);
    }
  };
}

const instantane = () => etat;
const instantaneServeur = () => VIDE;

const vraiClient = () => true;
const fauxServeur = () => false;

/* ——— Mutations ——— */

function ajouter(id: string, quantite = 1) {
  if (!CATALOGUE.has(id)) return;
  const existante = etat.find((l) => l.id === id);
  publier(
    existante
      ? etat.map((l) =>
          l.id === id ? { ...l, quantite: Math.min(l.quantite + quantite, 20) } : l,
        )
      : [...etat, { id, quantite: Math.min(quantite, 20) }],
  );
}

function definirQuantite(id: string, quantite: number) {
  publier(
    quantite <= 0
      ? etat.filter((l) => l.id !== id)
      : etat.map((l) => (l.id === id ? { ...l, quantite: Math.min(quantite, 20) } : l)),
  );
}

function retirer(id: string) {
  publier(etat.filter((l) => l.id !== id));
}

function vider() {
  publier(VIDE);
}

/* ——— Exposition React ——— */

type ContexteP = {
  lignes: LignePanier[];
  detail: LigneDetaillee[];
  nombreArticles: number;
  total: number;
  /** false pendant le rendu serveur et l'hydratation, true ensuite. */
  hydrate: boolean;
  ajouter: typeof ajouter;
  definirQuantite: typeof definirQuantite;
  retirer: typeof retirer;
  vider: typeof vider;
};

const Contexte = createContext<ContexteP | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const lignes = useSyncExternalStore(abonner, instantane, instantaneServeur);
  const hydrate = useSyncExternalStore(abonner, vraiClient, fauxServeur);

  const detail = useMemo<LigneDetaillee[]>(
    () =>
      lignes.flatMap((ligne) => {
        const produit = CATALOGUE.get(ligne.id);
        if (!produit) return [];
        return [{ ...ligne, produit, sousTotal: produit.prix * ligne.quantite }];
      }),
    [lignes],
  );

  const valeur = useMemo<ContexteP>(
    () => ({
      lignes,
      detail,
      nombreArticles: detail.reduce((n, l) => n + l.quantite, 0),
      total: detail.reduce((n, l) => n + l.sousTotal, 0),
      hydrate,
      ajouter,
      definirQuantite,
      retirer,
      vider,
    }),
    [lignes, detail, hydrate],
  );

  return <Contexte.Provider value={valeur}>{children}</Contexte.Provider>;
}

export function usePanier(): ContexteP {
  const contexte = useContext(Contexte);
  if (!contexte) {
    throw new Error("usePanier doit être utilisé à l'intérieur de <CartProvider>");
  }
  return contexte;
}
