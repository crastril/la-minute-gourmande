import { AddToCart } from "@/components/add-to-cart";
import { DishVisual } from "@/components/dish-visual";
import type { Produit } from "@/data/menu";
import { prix } from "@/lib/format";

export function MenuCard({ produit }: { produit: Produit }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-ticket border border-creme/10 bg-encre/60 transition-colors duration-500 hover:border-beurre/35">
      <div className="relative aspect-[5/3] overflow-hidden">
        <DishVisual
          produit={produit}
          className="transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {produit.populaire && (
          <span className="chiffres absolute top-3 left-3 z-10 rounded-ticket bg-noir/75 px-2 py-1 text-[0.6rem] tracking-[0.18em] text-beurre uppercase backdrop-blur-sm">
            Le préféré
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-display text-xl text-creme">{produit.nom}</h3>
          <span className="chiffres shrink-0 text-sm text-beurre">{prix(produit.prix)}</span>
        </div>

        <p className="text-sm leading-relaxed text-creme-doux">{produit.description}</p>

        {(produit.tags?.length || produit.allergenes?.length) && (
          <p className="chiffres flex flex-wrap gap-x-2 gap-y-1 text-[0.6rem] tracking-[0.12em] text-creme-tres-doux uppercase">
            {produit.tags?.map((tag) => (
              <span key={tag} className="text-pistache">
                {tag}
              </span>
            ))}
            {produit.allergenes?.length ? (
              <span>Allergènes : {produit.allergenes.join(", ")}</span>
            ) : null}
          </p>
        )}

        <div className="mt-auto pt-2">
          <AddToCart produit={produit} />
        </div>
      </div>
    </article>
  );
}
