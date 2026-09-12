"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { usePanier } from "@/components/cart-provider";
import { CRENEAUX, RESTAURANT } from "@/data/restaurant";
import { prix } from "@/lib/format";

function Stepper({
  valeur,
  onChange,
  libelle,
}: {
  valeur: number;
  onChange: (n: number) => void;
  libelle: string;
}) {
  return (
    <div className="flex items-center gap-1 rounded-ticket border border-creme/15">
      <button
        type="button"
        onClick={() => onChange(valeur - 1)}
        aria-label={`Retirer un ${libelle}`}
        className="grid size-8 place-items-center text-creme-doux transition-colors hover:text-beurre"
      >
        −
      </button>
      <span className="chiffres w-6 text-center text-sm text-creme" aria-live="polite">
        {valeur}
      </span>
      <button
        type="button"
        onClick={() => onChange(valeur + 1)}
        disabled={valeur >= 20}
        aria-label={`Ajouter un ${libelle}`}
        className="grid size-8 place-items-center text-creme-doux transition-colors hover:text-beurre disabled:opacity-30"
      >
        +
      </button>
    </div>
  );
}

const champ =
  "w-full rounded-ticket border border-creme/15 bg-noir px-4 py-3 text-sm text-creme placeholder:text-creme-tres-doux transition-colors focus:border-beurre/60 focus:outline-none";

export function PanierClient() {
  const { detail, total, nombreArticles, definirQuantite, retirer, hydrate } = usePanier();
  const parametres = useSearchParams();
  const annule = parametres.get("annule") === "1";

  const [creneau, setCreneau] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function onSubmit(evenement: React.FormEvent<HTMLFormElement>) {
    evenement.preventDefault();
    setErreur(null);
    setEnvoi(true);

    const donnees = new FormData(evenement.currentTarget);

    try {
      const reponse = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lignes: detail.map((l) => ({ id: l.id, quantite: l.quantite })),
          creneau: donnees.get("creneau"),
          note: donnees.get("note"),
          client: {
            prenom: donnees.get("prenom"),
            nom: donnees.get("nom"),
            email: donnees.get("email"),
            telephone: donnees.get("telephone"),
          },
        }),
      });

      const resultat: { url?: string; erreur?: string } = await reponse.json();

      if (!reponse.ok || !resultat.url) {
        setErreur(resultat.erreur ?? "La commande n'a pas pu être envoyée.");
        setEnvoi(false);
        return;
      }

      window.location.href = resultat.url;
    } catch {
      setErreur("Connexion impossible. Vérifiez votre réseau et réessayez.");
      setEnvoi(false);
    }
  }

  if (!hydrate) {
    return (
      <p className="chiffres py-20 text-sm text-creme-tres-doux">Chargement du panier…</p>
    );
  }

  if (nombreArticles === 0) {
    return (
      <div className="perfore rounded-ticket border border-creme/12 bg-encre/50 px-8 py-20 text-center">
        <p className="font-display text-3xl text-creme">Votre panier est vide.</p>
        <p className="mx-auto mt-4 max-w-[36ch] text-sm text-creme-doux">
          La carte change chaque matin — il y a sûrement quelque chose pour vous
          aujourd&apos;hui.
        </p>
        <Link
          href="/carte"
          className="mt-8 inline-block rounded-ticket bg-beurre px-7 py-3.5 text-sm font-medium text-noir transition-colors hover:bg-beurre-clair"
        >
          Découvrir la carte
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-start">
      {/* Le ticket */}
      <section aria-label="Articles commandés" className="perfore rounded-ticket border border-creme/12 bg-encre/50">
        <header className="flex items-baseline justify-between border-b border-dashed border-creme/20 px-6 py-5">
          <span className="chiffres text-[0.65rem] tracking-[0.2em] text-creme-tres-doux uppercase">
            Bon de commande
          </span>
          <span className="chiffres text-[0.65rem] text-creme-tres-doux">
            {nombreArticles} art.
          </span>
        </header>

        <ul className="divide-y divide-dashed divide-creme/12">
          {detail.map((ligne) => (
            <li key={ligne.id} className="flex flex-wrap items-center gap-4 px-6 py-5">
              <div className="min-w-[9rem] flex-1">
                <p className="font-display text-lg text-creme">{ligne.produit.nom}</p>
                <p className="chiffres mt-1 text-[0.7rem] text-creme-tres-doux">
                  {prix(ligne.produit.prix)} l&apos;unité
                </p>
              </div>

              <Stepper
                valeur={ligne.quantite}
                libelle={ligne.produit.nom}
                onChange={(n) => definirQuantite(ligne.id, n)}
              />

              <span className="chiffres w-[4.5rem] text-right text-sm text-beurre">
                {prix(ligne.sousTotal)}
              </span>

              <button
                type="button"
                onClick={() => retirer(ligne.id)}
                aria-label={`Retirer ${ligne.produit.nom} du panier`}
                className="text-creme-tres-doux transition-colors hover:text-brique"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>

        <footer className="flex items-baseline justify-between border-t border-dashed border-creme/20 px-6 py-6">
          <span className="font-display text-xl text-creme">Total</span>
          <span className="chiffres text-2xl text-beurre">{prix(total)}</span>
        </footer>
      </section>

      {/* Le retrait */}
      <form onSubmit={onSubmit} className="rounded-ticket border border-creme/12 bg-encre/50 p-6 sm:p-8">
        <h2 className="font-display text-2xl text-creme">Votre retrait</h2>
        <p className="mt-2 text-sm text-creme-doux">
          {RESTAURANT.adresse}, {RESTAURANT.codePostal} {RESTAURANT.ville} — comptez{" "}
          {RESTAURANT.delaiRetrait} minutes de préparation.
        </p>

        {annule && (
          <p className="mt-5 rounded-ticket border border-beurre/30 bg-beurre/10 px-4 py-3 text-sm text-beurre-clair">
            Paiement interrompu — votre panier est intact, vous pouvez réessayer.
          </p>
        )}

        <fieldset className="mt-7">
          <legend className="sur-titre mb-3">Créneau souhaité</legend>
          <div className="flex flex-wrap gap-2">
            {CRENEAUX.map((c) => (
              <label
                key={c}
                className={`chiffres cursor-pointer rounded-ticket border px-3.5 py-2 text-[0.8rem] transition-colors ${
                  creneau === c
                    ? "border-beurre bg-beurre text-noir"
                    : "border-creme/15 text-creme-doux hover:border-beurre/50 hover:text-creme"
                }`}
              >
                <input
                  type="radio"
                  name="creneau"
                  value={c}
                  checked={creneau === c}
                  onChange={() => setCreneau(c)}
                  required
                  className="sr-only"
                />
                {c}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <label className="sm:col-span-1">
            <span className="sr-only">Prénom</span>
            <input name="prenom" required placeholder="Prénom *" className={champ} autoComplete="given-name" />
          </label>
          <label className="sm:col-span-1">
            <span className="sr-only">Nom</span>
            <input name="nom" placeholder="Nom" className={champ} autoComplete="family-name" />
          </label>
          <label className="sm:col-span-1">
            <span className="sr-only">Téléphone</span>
            <input
              name="telephone"
              type="tel"
              required
              placeholder="Téléphone *"
              className={champ}
              autoComplete="tel"
            />
          </label>
          <label className="sm:col-span-1">
            <span className="sr-only">E-mail</span>
            <input
              name="email"
              type="email"
              placeholder="E-mail"
              className={champ}
              autoComplete="email"
            />
          </label>
          <label className="sm:col-span-2">
            <span className="sr-only">Note pour la cuisine</span>
            <textarea
              name="note"
              rows={3}
              maxLength={480}
              placeholder="Allergies, intolérances, précisions pour la cuisine…"
              className={`${champ} resize-none`}
            />
          </label>
        </div>

        {erreur && (
          <p role="alert" className="mt-5 rounded-ticket border border-brique/40 bg-brique/10 px-4 py-3 text-sm text-brique">
            {erreur}
          </p>
        )}

        <button
          type="submit"
          disabled={envoi}
          className="mt-7 w-full rounded-ticket bg-beurre px-6 py-4 text-sm font-medium text-noir transition-colors hover:bg-beurre-clair disabled:cursor-not-allowed disabled:opacity-60"
        >
          {envoi ? "Envoi en cours…" : `Valider la commande · ${prix(total)}`}
        </button>

        <p className="chiffres mt-4 text-[0.65rem] leading-relaxed text-creme-tres-doux">
          En validant, vous acceptez d&apos;être contacté au numéro indiqué si la
          cuisine a besoin d&apos;une précision.
        </p>
      </form>
    </div>
  );
}
