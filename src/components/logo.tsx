import Image from "next/image";
import { RESTAURANT } from "@/data/restaurant";

/**
 * Badge rond du client, extrait de `identité/Gourmande 2.pdf` et détouré
 * (public/brand/logo.png). À côté, un rappel horizontal du lettrage du logo :
 * « MINUTE » en capitales espacées, « Gourmande » en script.
 */
export function Logo({
  taille = 52,
  avecNom = true,
  clair = false,
}: {
  taille?: number;
  avecNom?: boolean;
  /** Version pour fond noir (pied de page). */
  clair?: boolean;
}) {
  return (
    <span className="flex items-center gap-3 leading-none">
      <Image
        src="/brand/logo.png"
        // Quand le nom est écrit à côté, le badge est décoratif pour les lecteurs d'écran.
        alt={avecNom ? "" : `${RESTAURANT.nom} ${RESTAURANT.suffixe}`}
        width={taille}
        height={taille}
        className="shrink-0 rounded-full"
      />
      {avecNom && (
        <span className="flex flex-col">
          <span
            className={`font-display text-[0.64rem] font-semibold tracking-[0.34em] uppercase ${
              clair ? "text-sable" : "text-encre-douce"
            }`}
          >
            Minute
          </span>
          <span
            className={`font-script text-[1.4rem] leading-[1.1] ${clair ? "text-papier" : "text-encre"}`}
          >
            Gourmande
          </span>
        </span>
      )}
    </span>
  );
}
