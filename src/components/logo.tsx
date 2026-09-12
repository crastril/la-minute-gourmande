import { RESTAURANT } from "@/data/restaurant";

/**
 * ⚠️ PLACEHOLDER — logotype provisoire.
 *
 * Pour brancher le vrai logo du client :
 *   1. déposer le fichier dans `public/brand/` (SVG de préférence, sinon PNG ×2)
 *   2. remplacer le contenu de ce composant par :
 *        <Image src="/brand/logo.svg" alt={RESTAURANT.nom} width={180} height={40} priority />
 * Aucun autre fichier n'a besoin d'être modifié : en-tête, pied de page et
 * page de confirmation utilisent tous ce composant.
 */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="group flex items-center gap-2.5 leading-none">
      <span
        aria-hidden
        className="relative grid size-7 shrink-0 place-items-center rounded-full border border-beurre/60"
      >
        <span className="h-2 w-px origin-bottom translate-y-[-1px] bg-beurre transition-transform duration-700 group-hover:rotate-[360deg]" />
        <span className="absolute size-1 rounded-full bg-beurre" />
      </span>
      <span className="flex flex-col">
        <span className="font-display text-[0.95rem] tracking-tight text-creme">
          La Minute <span className="italic text-beurre">Gourmande</span>
        </span>
        {!compact && (
          <span className="chiffres text-[0.55rem] tracking-[0.3em] text-creme-tres-doux uppercase">
            {RESTAURANT.ville} · depuis {RESTAURANT.fondation}
          </span>
        )}
      </span>
    </span>
  );
}
