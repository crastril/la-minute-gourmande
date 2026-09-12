import Image from "next/image";
import type { Produit } from "@/data/menu";

/**
 * Visuel d'un produit.
 * Si `produit.image` est renseigné (photo déposée dans /public), on l'affiche.
 * Sinon on génère une assiette abstraite déterministe : pas de photo cassée,
 * et la carte reste présentable tant que le client n'a pas fourni ses visuels.
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

  // Teinte stable dérivée du nom : deux produits n'ont jamais la même assiette.
  const graine = [...produit.id].reduce((n, c) => n + c.charCodeAt(0), 0);
  const teinte = 18 + (graine % 58);
  const rotation = graine % 360;

  return (
    <div
      aria-hidden
      className={`absolute inset-0 ${className}`}
      style={{
        background: `
          radial-gradient(120% 90% at 30% 20%, hsl(${teinte} 48% 26%) 0%, transparent 62%),
          radial-gradient(90% 80% at 78% 78%, hsl(${teinte + 14} 38% 17%) 0%, transparent 58%),
          linear-gradient(${rotation}deg, #211b14, #17130f)
        `,
      }}
    >
      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 size-full opacity-90"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id={`assiette-${produit.id}`} cx="38%" cy="32%">
            <stop offset="0%" stopColor={`hsl(${teinte} 62% 58%)`} stopOpacity="0.55" />
            <stop offset="100%" stopColor={`hsl(${teinte} 45% 22%)`} stopOpacity="0.1" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="58" fill={`url(#assiette-${produit.id})`} />
        <circle
          cx="100"
          cy="100"
          r="58"
          fill="none"
          stroke="#f5eee2"
          strokeOpacity="0.16"
          strokeWidth="0.75"
        />
        <circle
          cx="100"
          cy="100"
          r="44"
          fill="none"
          stroke="#f5eee2"
          strokeOpacity="0.1"
          strokeWidth="0.5"
          strokeDasharray="2 5"
        />
        <circle
          cx="100"
          cy="100"
          r="72"
          fill="none"
          stroke="#e7a33c"
          strokeOpacity="0.14"
          strokeWidth="0.5"
        />
      </svg>
    </div>
  );
}
