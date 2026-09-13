import { AddToCart } from "@/components/add-to-cart";
import { ComposerMenu } from "@/components/composer-menu";
import { DishVisual } from "@/components/dish-visual";
import { estCommandable, type Produit } from "@/data/menu";
import { prix } from "@/lib/format";

export function MenuCard({ produit }: { produit: Produit }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-ticket border border-encre/10 bg-carte/60 transition-colors duration-500 hover:border-orange/35">
      <div className="relative aspect-[5/3] overflow-hidden">
        <DishVisual
          produit={produit}
          className="transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {produit.populaire && (
          <span className="chiffres absolute top-3 left-3 z-10 rounded-ticket bg-papier/75 px-2 py-1 text-[0.6rem] tracking-[0.18em] text-orange-fonce uppercase backdrop-blur-sm">
            Le préféré
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-display text-xl text-encre">{produit.nom}</h3>
          <span className="chiffres shrink-0 text-sm text-orange-fonce">
            {produit.composition ? `dès ${prix(produit.prix)}` : prix(produit.prix)}
          </span>
        </div>

        <p className="text-sm leading-relaxed text-encre-douce">{produit.description}</p>

        {(produit.tags?.length || produit.allergenes?.length) && (
          <p className="chiffres flex flex-wrap gap-x-2 gap-y-1 text-[0.6rem] tracking-[0.12em] text-encre-pale uppercase">
            {produit.tags?.map((tag) => (
              <span key={tag} className="text-framboise-fonce">
                {tag}
              </span>
            ))}
            {produit.allergenes?.length ? (
              <span>Allergènes : {produit.allergenes.join(", ")}</span>
            ) : null}
          </p>
        )}

        <div className="mt-auto pt-2">
          {!estCommandable(produit) ? (
            <span className="chiffres inline-block rounded-ticket border border-encre/10 px-3 py-2 text-[0.65rem] tracking-[0.14em] text-encre-pale uppercase">
              {produit.epuise ? "Épuisé" : "Au comptoir"}
            </span>
          ) : produit.composition ? (
            <ComposerMenu produit={produit} />
          ) : (
            <AddToCart produit={produit} />
          )}
        </div>
      </div>
    </article>
  );
}
