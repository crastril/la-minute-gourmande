"use client";

import { useEffect, useRef, useState } from "react";
import { usePanier } from "@/components/cart-provider";
import { CATALOGUE, type Produit } from "@/data/menu";
import { prix } from "@/lib/format";

const carteChoix =
  "cursor-pointer rounded-[14px] border-2 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-orange-fonce";

function classeChoix(actif: boolean) {
  return actif
    ? "border-orange bg-orange/10"
    : "border-dashed border-encre/20 hover:border-orange/60";
}

/**
 * Bouton « Composer mon menu » + fenêtre modale de composition :
 * plat au choix, boisson au choix, dessert en supplément.
 * Utilise <dialog> natif : focus piégé, Échap et retour du focus gérés par le
 * navigateur.
 */
export function ComposerMenu({ produit }: { produit: Produit }) {
  const { ajouter } = usePanier();
  const dialogue = useRef<HTMLDialogElement>(null);
  const minuteur = useRef<number | undefined>(undefined);

  const [plat, setPlat] = useState<string | null>(null);
  const [boisson, setBoisson] = useState<string | null>(null);
  const [dessert, setDessert] = useState("");
  const [confirme, setConfirme] = useState(false);

  useEffect(() => () => window.clearTimeout(minuteur.current), []);

  const composition = produit.composition;
  if (!composition) return null;

  const complet = plat !== null && boisson !== null;
  const total = produit.prix + (dessert ? composition.supplementDessert : 0);

  const ouvrir = () => {
    setPlat(null);
    setBoisson(null);
    setDessert("");
    dialogue.current?.showModal();
  };

  const fermer = () => dialogue.current?.close();

  const valider = () => {
    if (plat === null || boisson === null) return;
    ajouter(produit.id, 1, { plat, boisson, ...(dessert ? { dessert } : {}) });
    fermer();
    setConfirme(true);
    window.clearTimeout(minuteur.current);
    minuteur.current = window.setTimeout(() => setConfirme(false), 1800);
  };

  return (
    <>
      <button
        type="button"
        onClick={ouvrir}
        aria-haspopup="dialog"
        className="rounded-ticket border border-encre/15 px-4 py-2 text-sm text-encre transition-all duration-300 hover:border-orange/60 hover:bg-orange/10 hover:text-orange-fonce active:scale-[0.97]"
      >
        {confirme ? "Menu ajouté ✓" : "Composer mon menu"}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {confirme ? `${produit.nom} ajouté au panier` : ""}
      </span>

      <dialog
        ref={dialogue}
        aria-labelledby={`titre-menu-${produit.id}`}
        onClick={(evenement) => {
          // Un clic sur le fond (hors du contenu) ferme la fenêtre.
          if (evenement.target === evenement.currentTarget) fermer();
        }}
        className="m-auto w-[min(640px,calc(100vw-2rem))] max-w-none overflow-hidden rounded-[22px] bg-papier p-0 text-encre shadow-[0_30px_80px_-20px_rgba(23,21,19,0.45)] backdrop:bg-encre/60 backdrop:backdrop-blur-sm"
      >
        <div className="flex max-h-[calc(100dvh-2rem)] flex-col">
          <header className="flex items-start justify-between gap-4 border-b border-dashed border-encre/20 px-6 py-5">
            <div>
              <p className="sur-titre">Composez votre menu</p>
              <h2 id={`titre-menu-${produit.id}`} className="mt-2 text-3xl leading-none">
                {produit.nom}
              </h2>
              <p className="mt-2 text-sm text-encre-douce">
                Plat et boisson inclus · dessert en supplément (
                {`+${prix(composition.supplementDessert)}`})
              </p>
            </div>
            <button
              type="button"
              onClick={fermer}
              aria-label="Fermer"
              className="grid size-10 shrink-0 place-items-center rounded-full border-2 border-encre text-lg leading-none transition-colors hover:bg-encre hover:text-papier"
            >
              ✕
            </button>
          </header>

          <div className="flex-1 space-y-8 overflow-y-auto px-6 py-6">
            <fieldset>
              <legend className="sur-titre mb-3">1 · Votre plat</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {composition.plats.map((id) => {
                  const choix = CATALOGUE.get(id);
                  if (!choix) return null;
                  return (
                    <label key={id} className={`${carteChoix} flex flex-col gap-1 p-4 ${classeChoix(plat === id)}`}>
                      <input
                        type="radio"
                        name={`${produit.id}-plat`}
                        value={id}
                        checked={plat === id}
                        onChange={() => setPlat(id)}
                        className="sr-only"
                      />
                      <span className="font-display text-lg font-bold tracking-[0.02em] uppercase">
                        {choix.nom}
                      </span>
                      <span className="text-sm text-encre-douce">{choix.description}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <fieldset>
              <legend className="sur-titre mb-3">2 · Votre boisson</legend>
              <div className="flex flex-wrap gap-2">
                {composition.boissons.map((id) => {
                  const choix = CATALOGUE.get(id);
                  if (!choix) return null;
                  return (
                    <label
                      key={id}
                      className={`${carteChoix} rounded-full px-4 py-2 text-sm font-medium ${classeChoix(boisson === id)}`}
                    >
                      <input
                        type="radio"
                        name={`${produit.id}-boisson`}
                        value={id}
                        checked={boisson === id}
                        onChange={() => setBoisson(id)}
                        className="sr-only"
                      />
                      {choix.nom}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <fieldset>
              <legend className="sur-titre mb-3">3 · Un dessert ?</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {[{ id: "", nom: "Sans dessert" }, ...composition.desserts.map((id) => ({
                  id,
                  nom: CATALOGUE.get(id)?.nom ?? id,
                }))].map((option) => (
                  <label
                    key={option.id || "aucun"}
                    className={`${carteChoix} flex items-center justify-between gap-3 px-4 py-3 text-sm font-medium ${classeChoix(dessert === option.id)}`}
                  >
                    <input
                      type="radio"
                      name={`${produit.id}-dessert`}
                      value={option.id}
                      checked={dessert === option.id}
                      onChange={() => setDessert(option.id)}
                      className="sr-only"
                    />
                    {option.nom}
                    {option.id && (
                      <span className="chiffres text-orange-fonce">
                        +{prix(composition.supplementDessert)}
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-dashed border-encre/20 bg-carte px-6 py-4">
            <div>
              <p className="font-display text-[0.75rem] font-semibold tracking-[0.18em] text-encre-pale uppercase">
                Total du menu
              </p>
              <p className="chiffres text-2xl text-orange-fonce">{prix(total)}</p>
            </div>
            <button
              type="button"
              onClick={valider}
              disabled={!complet}
              className="rounded-full bg-orange px-6 py-3.5 font-display text-[1rem] font-semibold tracking-[0.08em] text-encre uppercase transition-colors hover:bg-orange-vif disabled:cursor-not-allowed disabled:opacity-50"
            >
              {complet ? "Ajouter au panier" : "Choisissez plat et boisson"}
            </button>
          </footer>
        </div>
      </dialog>
    </>
  );
}
