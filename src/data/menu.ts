/**
 * Catalogue produits.
 *
 * ⚠️ PLACEHOLDER — contenu de démonstration.
 * Les noms et les prix seront remplacés par ceux des flyers du client.
 * En revanche la STRUCTURE ci-dessous est la bonne et ne bougera plus :
 *
 *   — une catégorie `commandable: false` est une VITRINE : le produit est
 *     montré sur le site mais ne peut pas être mis au panier. C'est le cas de
 *     la boulangerie (viennoiseries, snacking, pâtisseries) : les frais fixes
 *     de paiement rendraient une vente à 1,30 € absurde, et ces produits
 *     s'achètent au comptoir.
 *
 *   — une catégorie `commandable: true` peut être réservée en ligne, puis
 *     payée au choix en ligne ou au retrait. C'est la partie restauration
 *     (menus, plats) plus les boissons qui les accompagnent.
 *
 * Pour rendre une catégorie commandable, il suffit de basculer son drapeau :
 * la carte, le panier et l'API s'alignent automatiquement.
 */

export const CATEGORIES = [
  {
    id: "menus",
    nom: "Menus",
    intro: "Plat, boisson et dessert. À réserver en ligne pour le midi.",
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
    intro: "Cuits sur place, plusieurs fournées par jour.",
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
};

export const PRODUITS: Produit[] = [
  /* ——— Menus (commandables) ——— */
  {
    id: "menu-burger",
    nom: "Menu burger",
    description: "Le burger de votre choix, une boisson et une pâtisserie du jour.",
    prix: 950,
    categorie: "menus",
    tags: ["Burger + boisson + dessert"],
    populaire: true,
    duJour: true,
    allergenes: ["Gluten", "Lait", "Œuf", "Moutarde"],
  },
  {
    id: "menu-du-midi",
    nom: "Menu du midi",
    description: "Le plat du jour, une boisson et une pâtisserie.",
    prix: 890,
    categorie: "menus",
    tags: ["Plat + boisson + dessert"],
    duJour: true,
    allergenes: ["Gluten", "Lait"],
  },
  {
    id: "menu-vege",
    nom: "Menu végétarien",
    description: "Burger végétarien ou plat du jour sans viande, boisson et dessert.",
    prix: 890,
    categorie: "menus",
    tags: ["Végétarien"],
    allergenes: ["Gluten", "Lait", "Œuf"],
  },

  /* ——— Burgers & plats (commandables) ——— */
  {
    id: "burger-classique",
    nom: "Burger classique",
    description: "Steak haché, cheddar, salade, tomate, oignons, sauce maison. Frites incluses.",
    prix: 750,
    categorie: "plats",
    populaire: true,
    duJour: true,
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
  {
    id: "plat-du-jour",
    nom: "Plat du jour",
    description: "Change chaque jour, affiché le matin en vitrine et sur le site.",
    prix: 790,
    categorie: "plats",
    allergenes: ["À préciser selon le plat"],
  },
  {
    id: "salade-cesar",
    nom: "Salade César",
    description: "Poulet grillé, croûtons, copeaux de parmesan, sauce César.",
    prix: 720,
    categorie: "plats",
    allergenes: ["Gluten", "Lait", "Œuf", "Poisson"],
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
    description: "Pétrie et cuite sur place, plusieurs fournées par jour.",
    prix: 130,
    categorie: "viennoiseries",
    allergenes: ["Gluten"],
  },

  /* ——— Pâtisseries (vitrine) ——— */
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
    description: "Vanille de Madagascar, cuisson longue.",
    prix: 220,
    categorie: "patisseries",
    allergenes: ["Gluten", "Lait", "Œuf"],
  },
  {
    id: "cookie",
    nom: "Cookie",
    description: "Pépites de chocolat, cuit le matin même.",
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

export function produitsParCategorie(categorie: CategorieId): Produit[] {
  return PRODUITS.filter((p) => p.categorie === categorie);
}

export function produitsDuJour(): Produit[] {
  return PRODUITS.filter((p) => p.duJour);
}
