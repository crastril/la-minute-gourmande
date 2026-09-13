/**
 * Catalogue produits.
 *
 * ⚠️ PLACEHOLDER — noms et prix de démonstration, sauf les deux plats du menu
 * (Poulet frites, Riz poisson frit) donnés par le client. Les prix restent à
 * fournir : aucun support ne les indique.
 *
 * La STRUCTURE ci-dessous est la bonne et ne bougera plus :
 *
 *   — une catégorie `commandable: false` est une VITRINE : le produit est
 *     montré sur le site mais ne peut pas être mis au panier (viennoiseries,
 *     snacking, pâtisseries). Les frais fixes de paiement rendraient une vente
 *     à 1,30 € absurde : ces produits s'achètent au comptoir.
 *
 *   — une catégorie `commandable: true` peut être réservée en ligne, puis
 *     payée au choix en ligne ou au retrait (menus, plats, boissons).
 *
 *   — un produit avec une `composition` est un MENU : on le compose dans une
 *     fenêtre (plat au choix, boisson au choix, dessert en supplément) avant
 *     de l'ajouter au panier. Les choix proposés référencent d'autres produits
 *     du catalogue par leur identifiant.
 */

export const CATEGORIES = [
  {
    id: "menus",
    nom: "Menus",
    intro: "Plat et boisson au choix, dessert en option. À réserver pour le midi.",
    commandable: true,
  },
  {
    id: "plats",
    nom: "Burgers & plats",
    intro: "Préparés à la commande, prêts pour votre créneau de retrait.",
    commandable: true,
  },
  {
    id: "boissons",
    nom: "Boissons",
    intro: "À ajouter à votre commande.",
    commandable: true,
  },
  {
    id: "snacking",
    nom: "Snacking salé",
    intro: "Au comptoir, toute la journée.",
    commandable: false,
  },
  {
    id: "viennoiseries",
    nom: "Viennoiseries & pains",
    intro: "Faits maison, à prendre au comptoir.",
    commandable: false,
  },
  {
    id: "patisseries",
    nom: "Pâtisseries",
    intro: "La vitrine sucrée, à emporter au comptoir.",
    commandable: false,
  },
] as const;

export type CategorieId = (typeof CATEGORIES)[number]["id"];

/** Catégories dont au moins un article est exigé pour valider une commande. */
export const CATEGORIES_PRINCIPALES: CategorieId[] = ["menus", "plats"];

/** Les choix faits par le client en composant un menu. */
export type ChoixMenu = {
  plat: string;
  boisson: string;
  /** Optionnel : un dessert ajoute `supplementDessert` au prix du menu. */
  dessert?: string;
};

/** Ce qu'un menu propose, par identifiants de produits du catalogue. */
export type CompositionMenu = {
  plats: string[];
  boissons: string[];
  desserts: string[];
  /** Supplément en centimes quand un dessert est choisi. */
  supplementDessert: number;
};

export type Produit = {
  id: string;
  nom: string;
  description: string;
  /** Prix TTC en centimes, pour éviter toute erreur d'arrondi. */
  prix: number;
  categorie: CategorieId;
  /** Chemin d'une photo dans /public (ex. "/photos/burger.jpg"). Optionnel. */
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

export const PRODUITS: Produit[] = [
  /* ——— Menus (commandables, à composer) ——— */
  {
    id: "menu-du-midi",
    nom: "Menu du midi",
    description: "Votre plat et votre boisson au choix. Ajoutez un dessert pour un petit supplément.",
    prix: 1050,
    categorie: "menus",
    tags: ["Plat + boisson", "Dessert en option"],
    populaire: true,
    duJour: true,
    composition: {
      plats: ["poulet-frites", "riz-poisson-frit"],
      boissons: ["canette", "eau", "jus"],
      desserts: ["eclair", "flan", "cookie"],
      supplementDessert: 150,
    },
  },

  /* ——— Burgers & plats (commandables) ——— */
  {
    id: "poulet-frites",
    nom: "Poulet frites",
    description: "Poulet grillé servi avec ses frites.",
    prix: 850,
    categorie: "plats",
    duJour: true,
  },
  {
    id: "riz-poisson-frit",
    nom: "Riz poisson frit",
    description: "Poisson frit servi avec du riz.",
    prix: 950,
    categorie: "plats",
    duJour: true,
    allergenes: ["Poisson"],
  },
  {
    id: "burger-classique",
    nom: "Burger classique",
    description: "Steak haché, cheddar, salade, tomate, oignons, sauce maison. Frites incluses.",
    prix: 750,
    categorie: "plats",
    populaire: true,
    allergenes: ["Gluten", "Lait", "Œuf", "Moutarde"],
  },
  {
    id: "burger-poulet",
    nom: "Burger poulet croustillant",
    description: "Poulet pané, cheddar, salade, sauce burger. Frites incluses.",
    prix: 790,
    categorie: "plats",
    allergenes: ["Gluten", "Lait", "Œuf"],
  },
  {
    id: "burger-vege",
    nom: "Burger végétarien",
    description: "Galette de légumes, cheddar, roquette, sauce au yaourt. Frites incluses.",
    prix: 750,
    categorie: "plats",
    tags: ["Végétarien"],
    allergenes: ["Gluten", "Lait", "Œuf"],
  },

  /* ——— Boissons (commandables, en accompagnement) ——— */
  {
    id: "canette",
    nom: "Canette 33 cl",
    description: "Sodas et boissons fraîches au choix.",
    prix: 180,
    categorie: "boissons",
  },
  {
    id: "eau",
    nom: "Bouteille d'eau 50 cl",
    description: "Plate ou pétillante.",
    prix: 100,
    categorie: "boissons",
  },
  {
    id: "jus",
    nom: "Jus de fruits",
    description: "Orange, pomme ou multifruits.",
    prix: 220,
    categorie: "boissons",
  },
  {
    id: "cafe",
    nom: "Café",
    description: "Expresso ou allongé.",
    prix: 120,
    categorie: "boissons",
  },

  /* ——— Snacking salé (vitrine) ——— */
  {
    id: "part-pizza",
    nom: "Part de pizza",
    description: "Margherita, reine ou chorizo, selon la fournée du jour.",
    prix: 320,
    categorie: "snacking",
    populaire: true,
    allergenes: ["Gluten", "Lait"],
  },
  {
    id: "sandwich-jambon-beurre",
    nom: "Jambon-beurre",
    description: "Baguette tradition, beurre doux, jambon blanc.",
    prix: 420,
    categorie: "snacking",
    allergenes: ["Gluten", "Lait"],
  },
  {
    id: "panini",
    nom: "Panini",
    description: "Jambon-fromage ou poulet-crudités, passé au grill.",
    prix: 450,
    categorie: "snacking",
    allergenes: ["Gluten", "Lait"],
  },
  {
    id: "quiche",
    nom: "Part de quiche lorraine",
    description: "Pâte brisée maison, lardons, crème, œufs.",
    prix: 380,
    categorie: "snacking",
    allergenes: ["Gluten", "Lait", "Œuf"],
  },

  /* ——— Viennoiseries & pains (vitrine) ——— */
  {
    id: "pain-au-chocolat",
    nom: "Pain au chocolat",
    description: "Pur beurre, deux barres de chocolat noir.",
    prix: 130,
    categorie: "viennoiseries",
    populaire: true,
    allergenes: ["Gluten", "Lait", "Œuf"],
  },
  {
    id: "croissant",
    nom: "Croissant",
    description: "Pur beurre, feuilletage maison.",
    prix: 120,
    categorie: "viennoiseries",
    allergenes: ["Gluten", "Lait", "Œuf"],
  },
  {
    id: "pain-aux-raisins",
    nom: "Pain aux raisins",
    description: "Crème pâtissière et raisins macérés.",
    prix: 150,
    categorie: "viennoiseries",
    allergenes: ["Gluten", "Lait", "Œuf"],
  },
  {
    id: "baguette",
    nom: "Baguette tradition",
    description: "Pétrie et cuite sur place.",
    prix: 130,
    categorie: "viennoiseries",
    allergenes: ["Gluten"],
  },

  /* ——— Pâtisseries (vitrine, et desserts des menus) ——— */
  {
    id: "eclair",
    nom: "Éclair au chocolat",
    description: "Pâte à choux, crème pâtissière au chocolat noir.",
    prix: 250,
    categorie: "patisseries",
    allergenes: ["Gluten", "Lait", "Œuf"],
  },
  {
    id: "flan",
    nom: "Part de flan",
    description: "Vanille, cuisson longue.",
    prix: 220,
    categorie: "patisseries",
    allergenes: ["Gluten", "Lait", "Œuf"],
  },
  {
    id: "cookie",
    nom: "Cookie",
    description: "Pépites de chocolat.",
    prix: 150,
    categorie: "patisseries",
    populaire: true,
    allergenes: ["Gluten", "Lait", "Œuf"],
  },
];

export const CATALOGUE = new Map(PRODUITS.map((p) => [p.id, p]));

const COMMANDABLES = new Set(
  CATEGORIES.filter((c) => c.commandable).map((c) => c.id as CategorieId),
);

/** Un produit de vitrine se consulte en ligne mais s'achète au comptoir. */
export function estCommandable(produit: Produit): boolean {
  return COMMANDABLES.has(produit.categorie) && !produit.epuise;
}

/** Une commande doit contenir au moins un menu ou un plat. */
export function estPrincipal(produit: Produit): boolean {
  return CATEGORIES_PRINCIPALES.includes(produit.categorie);
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

/** Prix d'une unité, supplément dessert compris pour un menu. */
export function prixUnitaire(produit: Produit, choix?: ChoixMenu): number {
  const supplement =
    produit.composition && choix?.dessert ? produit.composition.supplementDessert : 0;
  return produit.prix + supplement;
}

/** « Poulet frites · Canette 33 cl · Éclair au chocolat », ou null hors menu. */
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
