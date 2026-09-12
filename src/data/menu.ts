/**
 * Catalogue produits.
 *
 * ⚠️ PLACEHOLDER — contenu de démonstration.
 * À remplacer par les produits réels extraits des flyers du client
 * (nom, description, prix TTC en centimes, catégorie, allergènes).
 * Le reste du site (carte, panier, paiement) lit uniquement ce fichier :
 * remplacer le tableau suffit, aucun composant à modifier.
 */

export const CATEGORIES = [
  { id: "formules", nom: "Formules", intro: "Entrée + plat + dessert, pensées pour la pause déjeuner." },
  { id: "entrees", nom: "Entrées", intro: "Petites assiettes de saison, préparées le matin même." },
  { id: "plats", nom: "Plats", intro: "Le cœur de la carte, mijoté ou saisi à la commande." },
  { id: "desserts", nom: "Desserts", intro: "Pâtisserie maison, sans conservateur." },
  { id: "boissons", nom: "Boissons", intro: "Limonades artisanales et vins de petits producteurs." },
] as const;

export type CategorieId = (typeof CATEGORIES)[number]["id"];

export type Produit = {
  id: string;
  nom: string;
  description: string;
  /** Prix TTC en centimes, pour éviter toute erreur d'arrondi. */
  prix: number;
  categorie: CategorieId;
  /** Chemin d'une photo dans /public (ex. "/photos/blanquette.jpg"). Optionnel. */
  image?: string;
  tags?: string[];
  allergenes?: string[];
  populaire?: boolean;
  /** Produit mis en avant sur la page d'accueil. */
  duJour?: boolean;
  epuise?: boolean;
};

export const PRODUITS: Produit[] = [
  {
    id: "formule-du-midi",
    nom: "Formule du midi",
    description: "L'entrée, le plat et le dessert du jour, choisis le matin au marché.",
    prix: 1690,
    categorie: "formules",
    tags: ["Entrée + plat + dessert"],
    populaire: true,
    duJour: true,
  },
  {
    id: "formule-express",
    nom: "Formule express",
    description: "Le plat du jour et un dessert, prêts en quinze minutes chrono.",
    prix: 1350,
    categorie: "formules",
    tags: ["Plat + dessert"],
  },
  {
    id: "formule-vegetale",
    nom: "Formule végétale",
    description: "Une version entièrement végétarienne de la formule du midi.",
    prix: 1590,
    categorie: "formules",
    tags: ["Végétarien"],
  },
  {
    id: "veloute-butternut",
    nom: "Velouté de butternut",
    description: "Courge rôtie au four, crème de sarrasin torréfié, huile de noisette.",
    prix: 650,
    categorie: "entrees",
    tags: ["Végétarien"],
    allergenes: ["Lait", "Fruits à coque"],
  },
  {
    id: "oeuf-parfait",
    nom: "Œuf parfait",
    description: "Cuit soixante-quatre minutes, lard fumé, jeunes pousses, pain grillé.",
    prix: 790,
    categorie: "entrees",
    allergenes: ["Œuf", "Gluten"],
    populaire: true,
  },
  {
    id: "terrine-maison",
    nom: "Terrine de campagne",
    description: "Terrine du chef, cornichons maison, moutarde à l'ancienne, pain de seigle.",
    prix: 720,
    categorie: "entrees",
    allergenes: ["Gluten", "Moutarde"],
  },
  {
    id: "poireaux-vinaigrette",
    nom: "Poireaux vinaigrette",
    description: "Poireaux fondants, vinaigrette aux herbes, éclats de noisette.",
    prix: 620,
    categorie: "entrees",
    tags: ["Végétalien"],
    allergenes: ["Fruits à coque", "Moutarde"],
  },
  {
    id: "blanquette",
    nom: "Blanquette de veau",
    description: "Mijotée trois heures, riz pilaf, carottes fanes, champignons de Paris.",
    prix: 1690,
    categorie: "plats",
    populaire: true,
    duJour: true,
    allergenes: ["Lait", "Céleri"],
  },
  {
    id: "cabillaud",
    nom: "Dos de cabillaud",
    description: "Pêche du jour, beurre blanc citronné, écrasé de pommes de terre à l'huile d'olive.",
    prix: 1890,
    categorie: "plats",
    duJour: true,
    allergenes: ["Poisson", "Lait"],
  },
  {
    id: "risotto-champignons",
    nom: "Risotto aux champignons",
    description: "Carnaroli crémeux, poêlée de champignons de saison, parmesan affiné 24 mois.",
    prix: 1550,
    categorie: "plats",
    tags: ["Végétarien"],
    allergenes: ["Lait", "Sulfites"],
  },
  {
    id: "poulet-fermier",
    nom: "Poulet fermier rôti",
    description: "Volaille des Landes, jus corsé au thym, gratin dauphinois.",
    prix: 1750,
    categorie: "plats",
    allergenes: ["Lait"],
  },
  {
    id: "curry-legumes",
    nom: "Curry de légumes d'hiver",
    description: "Lait de coco, citron vert, riz complet, coriandre fraîche.",
    prix: 1450,
    categorie: "plats",
    tags: ["Végétalien"],
  },
  {
    id: "tarte-citron",
    nom: "Tarte au citron meringuée",
    description: "Pâte sablée, crème de citron de Menton, meringue passée au chalumeau.",
    prix: 680,
    categorie: "desserts",
    populaire: true,
    allergenes: ["Gluten", "Œuf", "Lait"],
  },
  {
    id: "moelleux-chocolat",
    nom: "Moelleux au chocolat",
    description: "Chocolat noir 70 %, cœur coulant, fleur de sel de Guérande.",
    prix: 650,
    categorie: "desserts",
    allergenes: ["Gluten", "Œuf", "Lait"],
  },
  {
    id: "riz-au-lait",
    nom: "Riz au lait vanillé",
    description: "Vanille de Madagascar, caramel au beurre salé, pointe de fleur d'oranger.",
    prix: 590,
    categorie: "desserts",
    allergenes: ["Lait"],
  },
  {
    id: "limonade",
    nom: "Limonade artisanale",
    description: "Citron, gingembre, menthe fraîche. Brassée à trente kilomètres d'ici.",
    prix: 420,
    categorie: "boissons",
    tags: ["Bio"],
  },
  {
    id: "vin-verre",
    nom: "Verre de vin",
    description: "Sélection du mois, domaines en agriculture biologique. 12 cl.",
    prix: 550,
    categorie: "boissons",
    allergenes: ["Sulfites"],
  },
  {
    id: "cafe",
    nom: "Café de spécialité",
    description: "Torréfaction locale, note de cacao et d'agrume.",
    prix: 250,
    categorie: "boissons",
  },
];

export const CATALOGUE = new Map(PRODUITS.map((p) => [p.id, p]));

export function produitsParCategorie(categorie: CategorieId): Produit[] {
  return PRODUITS.filter((p) => p.categorie === categorie);
}

export function produitsDuJour(): Produit[] {
  return PRODUITS.filter((p) => p.duJour);
}
