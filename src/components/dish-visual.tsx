import Image from "next/image";
import {
  IconeBurger,
  IconeCroissant,
  IconeCupcake,
  IconeGobelet,
  IconeSandwich,
} from "@/components/icones";
import { CATEGORIES, type CategorieId, type Produit } from "@/data/menu";

const ICONE_PAR_CATEGORIE: Record<CategorieId, typeof IconeBurger> = {
  menus: IconeBurger,
  plats: IconeBurger,
  boissons: IconeGobelet,
  snacking: IconeSandwich,
  viennoiseries: IconeCroissant,
  patisseries: IconeCupcake,
};

/**
 * Visuel d'un produit.
 * Si `produit.image` est renseigné (photo déposée dans /public), on l'affiche.
 * Sinon : une assiette dessinée avec le pictogramme de la catégorie, teintée
 * orange pour ce qui se commande et framboise pour la vitrine — rien ne casse
 * tant que le client n'a pas fourni ses photos.
 */
export function DishVisual({
  produit,
  className = "",
  sizes = "(max-width: 768px) 100vw, 33vw",
}: {
  produit: Produit;
  className?: string;
  sizes?: string;
}) {
  if (produit.image) {
    return (
      <Image
        src={produit.image}
        alt={produit.nom}
        fill
        sizes={sizes}
        className={`object-cover ${className}`}
      />
    );
  }

  const commandable =
    CATEGORIES.find((c) => c.id === produit.categorie)?.commandable ?? false;
  const Icone = ICONE_PAR_CATEGORIE[produit.categorie];

  // Position stable dérivée de l'identifiant : deux produits voisins ne se
  // ressemblent jamais tout à fait.
  const graine = [...produit.id].reduce((n, c) => n + c.charCodeAt(0), 0);
  const x = 22 + (graine % 30);
  const y = 18 + ((graine >> 3) % 28);
  const accent = commandable ? "222,83,33" : "212,74,98";

  return (
    <div
      aria-hidden
      className={`absolute inset-0 ${className}`}
      style={{
        background: `
          radial-gradient(70% 65% at ${x}% ${y}%, rgba(${accent},0.26) 0%, transparent 62%),
          radial-gradient(80% 70% at ${100 - x}% ${100 - y / 2}%, rgba(244,216,179,0.95) 0%, transparent 70%),
          linear-gradient(${graine % 360}deg, #f6e3c9, #fbf2e6)
        `,
      }}
    >
      <svg
        viewBox="0 0 200 120"
        className="absolute inset-0 size-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <circle cx="100" cy="60" r="40" fill="#fffaf4" fillOpacity="0.75" />
        <circle
          cx="100"
          cy="60"
          r="40"
          fill="none"
          stroke="#171513"
          strokeOpacity="0.16"
          strokeWidth="0.8"
        />
        <circle
          cx="100"
          cy="60"
          r="32"
          fill="none"
          stroke="#171513"
          strokeOpacity="0.12"
          strokeWidth="0.6"
          strokeDasharray="2 4"
        />
        <circle
          cx="100"
          cy="60"
          r="50"
          fill="none"
          stroke={commandable ? "#de5321" : "#d44a62"}
          strokeOpacity="0.4"
          strokeWidth="0.8"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <Icone
          className={`size-12 ${commandable ? "text-orange-fonce/75" : "text-framboise-fonce/75"}`}
        />
      </div>
    </div>
  );
}
