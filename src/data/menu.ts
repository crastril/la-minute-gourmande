/**
 * Catalogue produits.
 *
 * Source : le menu imprimé affiché en boutique (photo transmise par le client).
 * Noms et prix en sont repris tels quels. Ce menu ne donne ni descriptions ni
 * allergènes : aucun n'est inventé ici.
 *
 * ⚠️ Points à confirmer avec le client :
 *  — « Burger » et « Cheeseburger » sont imprimés dans le bloc Paninis : ils
 *    sont traités ici comme des burgers (restauration, réservables en ligne) ;
 *  — « Didier » puis « Nature 50 cl » et « Aromatisée 50 cl » : repris en trois
 *    lignes, faute de savoir à quel format correspond la première ;
 *  — le « Riz poisson frit » demandé pour le menu est rapproché du « Poisson
 *    frit mariné » de la carte (10,00 €) ;
 *  — le prix du menu : aucune règle fournie, il vaut donc la somme des choix.
 *    Ajuster le champ `remise` quand le client aura donné son prix de menu.
 *
 * Structure :
 *   — `commandable: false` : VITRINE, visible sur le site mais achetée au
 *     comptoir (les frais fixes de paiement rendraient absurde une vente en
 *     ligne à 1,40 €) ;
 *   — `commandable: true` : réservable en ligne, payée en ligne ou au retrait ;
 *   — `affichage: "liste"` : liste de prix compacte, comme le menu imprimé,
 *     plutôt que de grandes cartes illustrées ;
 *   — `composition` : MENU à composer dans une fenêtre (plat, boisson, dessert
 *     en option), par identifiants d'autres produits du catalogue.
 */

export const CATEGORIES = [
  {
    id: "menus",
    nom: "Menus",
    intro: "Votre plat et votre boisson au choix, une glace en dessert si vous voulez. À réserver pour le midi.",
    commandable: true,
    affichage: "cartes",
  },
  {
    id: "plats",
    nom: "Plats chauds",
    intro: "Préparés pour votre créneau de retrait du midi.",
    commandable: true,
    affichage: "cartes",
  },
  {
    id: "burgers",
    nom: "Burgers",
    intro: "À réserver en ligne pour le midi.",
    commandable: true,
    affichage: "cartes",
  },
  {
    id: "boissons",
    nom: "Boissons",
    intro: "À ajouter à votre commande.",
    commandable: true,
    affichage: "liste",
  },
  {
    id: "sandwichs",
    nom: "Sandwichs",
    intro: "Au comptoir, toute la journée.",
    commandable: false,
    affichage: "liste",
  },
  {
    id: "paninis",
    nom: "Paninis & hot-dog",
    intro: "Au comptoir, toute la journée.",
    commandable: false,
    affichage: "liste",
  },
  {
    id: "viennoiseries",
    nom: "Viennoiseries",
    intro: "Faites maison, à prendre au comptoir.",
    commandable: false,
    affichage: "liste",
  },
  {
    id: "glaces",
    nom: "Glaces",
    intro: "Au comptoir, et en dessert dans les menus.",
    commandable: false,
    affichage: "liste",
  },
] as const;

export type CategorieId = (typeof CATEGORIES)[number]["id"];

/** Catégories dont au moins un article est exigé pour valider une commande. */
export const CATEGORIES_PRINCIPALES: CategorieId[] = ["menus", "plats", "burgers"];

/** Les choix faits par le client en composant un menu. */
export type ChoixMenu = {
  plat: string;
  boisson: string;
  /** Optionnel : facturé à son prix de la carte. */
  dessert?: string;
};

/** Ce qu'un menu propose, par identifiants de produits du catalogue. */
export type CompositionMenu = {
  plats: string[];
  boissons: string[];
  /** Desserts proposés en option, facturés à leur prix de la carte. */
  desserts: string[];
  /**
   * Remise en centimes sur la somme plat + boisson + dessert.
   * ⚠️ 0 tant que le client n'a pas indiqué le prix de ses menus.
   */
  remise: number;
};

export type Produit = {
  id: string;
  nom: string;
  /** Prix TTC en centimes. Pour un menu : calculé (composition la moins chère). */
  prix: number;
  categorie: CategorieId;
  description?: string;
  /** Chemin d'une photo dans /public (ex. "/photos/poulet-frites.jpg"). Optionnel. */
  image?: string;
  tags?: string[];
  allergenes?: string[];
  populaire?: boolean;
  /** Mis en avant sur la page d'accueil. */
  duJour?: boolean;
  epuise?: boolean;
  /** Présent uniquement sur les menus à composer. */
  composition?: CompositionMenu;
};

const BOISSONS: Produit[] = [
  { id: "caprisone", nom: "Caprisone", prix: 100, categorie: "boissons" },
  { id: "chanflor-50cl", nom: "Chanflor 50 cl", prix: 100, categorie: "boissons" },
  { id: "chanflor-1l", nom: "Chanflor 1 L", prix: 150, categorie: "boissons" },
  { id: "chanflor-1-5l", nom: "Chanflor 1,5 L", prix: 220, categorie: "boissons" },
  { id: "the-aromatise", nom: "Thé aromatisé", prix: 150, categorie: "boissons" },
  { id: "joker", nom: "Joker", prix: 160, categorie: "boissons" },
  { id: "didier", nom: "Didier", prix: 200, categorie: "boissons" },
  { id: "didier-nature-50cl", nom: "Didier nature 50 cl", prix: 220, categorie: "boissons" },
  { id: "didier-aromatisee-50cl", nom: "Didier aromatisée 50 cl", prix: 200, categorie: "boissons" },
  { id: "coca-cola", nom: "Coca-Cola", prix: 200, categorie: "boissons" },
  { id: "soda", nom: "Soda", prix: 200, categorie: "boissons" },
  { id: "amigo", nom: "Amigo", prix: 200, categorie: "boissons" },
  { id: "sprite", nom: "Sprite", prix: 200, categorie: "boissons" },
  { id: "ordinaire", nom: "Ordinaire", prix: 200, categorie: "boissons" },
  { id: "schweppes", nom: "Schweppes", prix: 200, categorie: "boissons" },
  { id: "orangina", nom: "Orangina", prix: 200, categorie: "boissons" },
  { id: "oasis", nom: "Oasis", prix: 200, categorie: "boissons" },
  { id: "caresse-antillaise", nom: "Caresse antillaise", prix: 200, categorie: "boissons" },
  { id: "mont-pele", nom: "Mont Pelé", prix: 200, categorie: "boissons" },
  { id: "jus-royal", nom: "Jus Royal", prix: 220, categorie: "boissons" },
  { id: "jus-local", nom: "Jus local", prix: 300, categorie: "boissons" },
  { id: "malta", nom: "Malta", prix: 300, categorie: "boissons" },
];

const GLACES: Produit[] = [
  { id: "floup", nom: "Floup", prix: 80, categorie: "glaces" },
  { id: "mister-friz", nom: "Mister Friz", prix: 80, categorie: "glaces" },
  { id: "cornetto", nom: "Cornetto", prix: 200, categorie: "glaces" },
  { id: "magnum", nom: "Magnum", prix: 200, categorie: "glaces" },
];

export const PRODUITS: Produit[] = [
  /* ——— Menus (commandables, à composer) ——— */
  {
    id: "menu-du-midi",
    nom: "Menu du midi",
    description: "Votre plat et votre boisson au choix. Ajoutez une glace en dessert si vous voulez.",
    prix: 0, // calculé plus bas : composition la moins chère
    categorie: "menus",
    tags: ["Plat + boisson", "Glace en option"],
    duJour: true,
    composition: {
      plats: ["poulet-frites", "poisson-frit-marine"],
      boissons: BOISSONS.map((b) => b.id),
      desserts: GLACES.map((g) => g.id),
      remise: 0,
    },
  },

  /* ——— Plats chauds (commandables) ——— */
  { id: "barquette-frites", nom: "Barquette de frites", prix: 300, categorie: "plats" },
  { id: "poulet-frites", nom: "Poulet frites", prix: 790, categorie: "plats", duJour: true },
  { id: "cote-porc", nom: "Côte de porc", prix: 900, categorie: "plats" },
  { id: "ribs", nom: "Ribs", prix: 900, categorie: "plats" },
  {
    id: "poisson-frit-marine",
    nom: "Poisson frit mariné",
    prix: 1000,
    categorie: "plats",
    duJour: true,
  },

  /* ——— Burgers (commandables) ——— */
  { id: "burger", nom: "Burger", prix: 600, categorie: "burgers" },
  { id: "cheeseburger", nom: "Cheeseburger", prix: 650, categorie: "burgers" },

  /* ——— Boissons (commandables) ——— */
  ...BOISSONS,

  /* ——— Sandwichs (vitrine) ——— */
  { id: "sandwich-jambon-fromage", nom: "Jambon fromage", prix: 450, categorie: "sandwichs" },
  { id: "sandwich-poulet", nom: "Poulet", prix: 550, categorie: "sandwichs" },
  { id: "sandwich-thon-mayonnaise", nom: "Thon mayonnaise", prix: 550, categorie: "sandwichs" },
  { id: "sandwich-morue", nom: "Morue", prix: 500, categorie: "sandwichs" },
  { id: "sandwich-saucisson-fromage", nom: "Saucisson fromage", prix: 550, categorie: "sandwichs" },
  { id: "sandwich-poisson", nom: "Poisson", prix: 590, categorie: "sandwichs" },

  /* ——— Paninis & hot-dog (vitrine) ——— */
  { id: "panini-jambon-fromage", nom: "Panini jambon fromage", prix: 500, categorie: "paninis" },
  { id: "panini-thon-mayonnaise", nom: "Panini thon mayonnaise", prix: 550, categorie: "paninis" },
  { id: "panini-poulet", nom: "Panini poulet", prix: 600, categorie: "paninis" },
  { id: "panini-steak", nom: "Panini steak", prix: 600, categorie: "paninis" },
  { id: "panini-merguez", nom: "Panini merguez", prix: 600, categorie: "paninis" },
  { id: "panini-kebab", nom: "Panini kebab", prix: 600, categorie: "paninis" },
  { id: "hot-dog", nom: "Hot-dog", prix: 300, categorie: "paninis" },

  /* ——— Viennoiseries (vitrine) ——— */
  { id: "pain-au-chocolat", nom: "Pain au chocolat", prix: 140, categorie: "viennoiseries" },
  { id: "pomme-cannelle", nom: "Pomme cannelle", prix: 140, categorie: "viennoiseries" },
  { id: "pomme-cannelle-pepite", nom: "Pomme cannelle pépite", prix: 150, categorie: "viennoiseries" },
  { id: "feuillete-saucisse", nom: "Feuilleté saucisse", prix: 140, categorie: "viennoiseries" },
  { id: "croissant-jambon-fromage", nom: "Croissant jambon fromage", prix: 150, categorie: "viennoiseries" },
  { id: "pain-aux-raisins", nom: "Pain aux raisins", prix: 150, categorie: "viennoiseries" },
  { id: "croissant-nature", nom: "Croissant nature", prix: 110, categorie: "viennoiseries" },
  { id: "torsade-chocolat", nom: "Torsade chocolat", prix: 200, categorie: "viennoiseries" },
  { id: "beignet-pommes", nom: "Beignet aux pommes", prix: 150, categorie: "viennoiseries" },
  { id: "beignet-chocolat", nom: "Beignet chocolat", prix: 150, categorie: "viennoiseries" },
  { id: "pate-banane", nom: "Pâté banane", prix: 140, categorie: "viennoiseries" },
  { id: "pate-goyave", nom: "Pâté goyave", prix: 140, categorie: "viennoiseries" },
  { id: "pain-au-chocolat-maxi", nom: "Pain au chocolat maxi", prix: 220, categorie: "viennoiseries" },
  { id: "pain-brioche-saucisse", nom: "Pain brioché saucisse", prix: 220, categorie: "viennoiseries" },

  /* ——— Glaces (vitrine, et desserts des menus) ——— */
  ...GLACES,
];

export const CATALOGUE = new Map(PRODUITS.map((p) => [p.id, p]));

const COMMANDABLES = new Set(
  CATEGORIES.filter((c) => c.commandable).map((c) => c.id as CategorieId),
);

/** Un produit de vitrine se consulte en ligne mais s'achète au comptoir. */
export function estCommandable(produit: Produit): boolean {
  return COMMANDABLES.has(produit.categorie) && !produit.epuise;
}

/** Une commande doit contenir au moins un menu, un plat ou un burger. */
export function estPrincipal(produit: Produit): boolean {
  return CATEGORIES_PRINCIPALES.includes(produit.categorie);
}

function prixDe(id: string): number {
  return CATALOGUE.get(id)?.prix ?? 0;
}

/**
 * Prix d'un menu selon les choix faits : somme plat + boisson + dessert, moins
 * la remise. Un choix pas encore fait compte pour l'option la moins chère, ce
 * qui donne le « dès … » affiché avant composition.
 */
export function prixMenu(produit: Produit, choix: Partial<ChoixMenu>): number {
  const composition = produit.composition;
  if (!composition) return produit.prix;

  const moinsCher = (ids: string[]) => Math.min(...ids.map(prixDe));
  const plat = choix.plat ? prixDe(choix.plat) : moinsCher(composition.plats);
  const boisson = choix.boisson ? prixDe(choix.boisson) : moinsCher(composition.boissons);
  const dessert = choix.dessert ? prixDe(choix.dessert) : 0;
  return Math.max(0, plat + boisson + dessert - composition.remise);
}

// Le prix affiché d'un menu suit automatiquement les prix de la carte.
for (const produit of PRODUITS) {
  if (produit.composition) produit.prix = prixMenu(produit, {});
}

/**
 * Vérifie une composition de menu contre ce que le menu propose.
 * Partagée entre le navigateur et l'API : un choix forgé à la main (plat
 * absent du menu, dessert inconnu…) est rejeté des deux côtés.
 */
export function validerChoix(produit: Produit, choix: unknown): ChoixMenu | null {
  const composition = produit.composition;
  if (!composition || typeof choix !== "object" || choix === null) return null;

  const { plat, boisson, dessert } = choix as Record<string, unknown>;
  if (typeof plat !== "string" || !composition.plats.includes(plat)) return null;
  if (typeof boisson !== "string" || !composition.boissons.includes(boisson)) return null;

  const sansDessert = dessert === undefined || dessert === null || dessert === "";
  if (sansDessert) return { plat, boisson };
  if (typeof dessert !== "string" || !composition.desserts.includes(dessert)) return null;
  return { plat, boisson, dessert };
}

/** Prix d'une unité : prix de la carte, ou prix du menu selon sa composition. */
export function prixUnitaire(produit: Produit, choix?: ChoixMenu): number {
  return produit.composition && choix ? prixMenu(produit, choix) : produit.prix;
}

/** « Poulet frites · Coca-Cola · Magnum », ou null hors menu. */
export function libelleChoix(choix?: ChoixMenu): string | null {
  if (!choix) return null;
  return [choix.plat, choix.boisson, choix.dessert]
    .filter((id): id is string => Boolean(id))
    .map((id) => CATALOGUE.get(id)?.nom ?? id)
    .join(" · ");
}

/** Deux menus composés différemment occupent deux lignes distinctes du panier. */
export function cleLigne(id: string, choix?: ChoixMenu): string {
  return choix ? `${id}|${choix.plat}|${choix.boisson}|${choix.dessert ?? ""}` : id;
}

export function produitsParCategorie(categorie: CategorieId): Produit[] {
  return PRODUITS.filter((p) => p.categorie === categorie);
}

export function produitsDuJour(): Produit[] {
  return PRODUITS.filter((p) => p.duJour);
}
