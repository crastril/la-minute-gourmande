"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import {
  CATALOGUE,
  cleLigne,
  libelleChoix,
  prixUnitaire,
  validerChoix,
  type ChoixMenu,
  type Produit,
} from "@/data/menu";

// v2 : les lignes de menu portent la composition choisie par le client.
const CLE_STOCKAGE = "lmg.panier.v2";

export type LignePanier = { id: string; quantite: number; choix?: ChoixMenu };

export type LigneDetaillee = LignePanier & {
  /** Identifie la ligne : un même menu composé autrement est une autre ligne. */
  cle: string;
  produit: Produit;
  prixUnitaire: number;
  sousTotal: number;
  /** « Poulet frites · Canette 33 cl » pour un menu, null sinon. */
  composition: string | null;
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

/**
 * Valide une ligne venue du stockage ou d'un ajout. Un produit retiré de la
 * carte, ou un menu dont la composition n'est plus proposée, est écarté.
 */
function normaliser(brut: unknown): LignePanier | null {
  if (typeof brut !== "object" || brut === null) return null;
  const { id, quantite, choix } = brut as Record<string, unknown>;
  if (typeof id !== "string" || typeof quantite !== "number") return null;

  const produit = CATALOGUE.get(id);
  const q = Math.min(Math.floor(quantite), 20);
  if (!produit || !(q >= 1)) return null;

  if (produit.composition) {
    const valide = validerChoix(produit, choix);
    return valide ? { id, quantite: q, choix: valide } : null;
  }
  return { id, quantite: q };
}

function lireStockage(): LignePanier[] {
  try {
    const brut = window.localStorage.getItem(CLE_STOCKAGE);
    if (!brut) return VIDE;
    const donnees: unknown = JSON.parse(brut);
    if (!Array.isArray(donnees)) return VIDE;
    const lignes = donnees.flatMap((l) => {
      const ligne = normaliser(l);
      return ligne ? [ligne] : [];
    });
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

/** Ajoute un produit ; un menu exige sa composition (`choix`). */
function ajouter(id: string, quantite = 1, choix?: ChoixMenu) {
  const nouvelle = normaliser({ id, quantite, choix });
  if (!nouvelle) return;

  const cle = cleLigne(nouvelle.id, nouvelle.choix);
  const existante = etat.find((l) => cleLigne(l.id, l.choix) === cle);
  publier(
    existante
      ? etat.map((l) =>
          cleLigne(l.id, l.choix) === cle
            ? { ...l, quantite: Math.min(l.quantite + nouvelle.quantite, 20) }
            : l,
        )
      : [...etat, nouvelle],
  );
}

function definirQuantite(cle: string, quantite: number) {
  publier(
    quantite <= 0
      ? etat.filter((l) => cleLigne(l.id, l.choix) !== cle)
      : etat.map((l) =>
          cleLigne(l.id, l.choix) === cle ? { ...l, quantite: Math.min(quantite, 20) } : l,
        ),
  );
}

function retirer(cle: string) {
  publier(etat.filter((l) => cleLigne(l.id, l.choix) !== cle));
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
        const unitaire = prixUnitaire(produit, ligne.choix);
        return [
          {
            ...ligne,
            cle: cleLigne(ligne.id, ligne.choix),
            produit,
            prixUnitaire: unitaire,
            sousTotal: unitaire * ligne.quantite,
            composition: libelleChoix(ligne.choix),
          },
        ];
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
