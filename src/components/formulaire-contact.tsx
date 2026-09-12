"use client";

import { useState } from "react";

const champ =
  "w-full rounded-ticket border border-creme/15 bg-noir px-4 py-3 text-sm text-creme placeholder:text-creme-tres-doux transition-colors focus:border-beurre/60 focus:outline-none";

export function FormulaireContact({ sujet }: { sujet: "contact" | "traiteur" }) {
  const [etat, setEtat] = useState<"repos" | "envoi" | "envoye">("repos");
  const [erreur, setErreur] = useState<string | null>(null);

  async function onSubmit(evenement: React.FormEvent<HTMLFormElement>) {
    evenement.preventDefault();
    setErreur(null);
    setEtat("envoi");

    const donnees = Object.fromEntries(new FormData(evenement.currentTarget));

    try {
      const reponse = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...donnees, sujet }),
      });
      const resultat: { ok?: boolean; erreur?: string } = await reponse.json();

      if (!reponse.ok || !resultat.ok) {
        setErreur(resultat.erreur ?? "L'envoi a échoué.");
        setEtat("repos");
        return;
      }
      setEtat("envoye");
    } catch {
      setErreur("Connexion impossible. Réessayez dans un instant.");
      setEtat("repos");
    }
  }

  if (etat === "envoye") {
    return (
      <div
        role="status"
        className="perfore rounded-ticket border border-pistache/35 bg-pistache/8 px-7 py-12 text-center"
      >
        <p className="font-display text-2xl text-creme">Message reçu.</p>
        <p className="mx-auto mt-3 max-w-[38ch] text-sm text-creme-doux">
          {sujet === "traiteur"
            ? "Nous revenons vers vous sous 48 h ouvrées avec une proposition chiffrée."
            : "Nous vous répondons sous 24 h ouvrées."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
      {/* Pot de miel : invisible pour l'utilisateur, rempli par les robots. */}
      <input
        type="text"
        name="societe"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <label>
        <span className="sr-only">Nom</span>
        <input name="nom" required placeholder="Nom *" className={champ} autoComplete="name" />
      </label>
      <label>
        <span className="sr-only">E-mail</span>
        <input
          name="email"
          type="email"
          required
          placeholder="E-mail *"
          className={champ}
          autoComplete="email"
        />
      </label>
      <label className={sujet === "traiteur" ? "" : "sm:col-span-2"}>
        <span className="sr-only">Téléphone</span>
        <input name="telephone" type="tel" placeholder="Téléphone" className={champ} autoComplete="tel" />
      </label>

      {sujet === "traiteur" && (
        <>
          <label>
            <span className="sr-only">Type d&apos;événement</span>
            <select name="typeEvenement" className={champ} defaultValue="">
              <option value="" disabled>
                Type d&apos;événement
              </option>
              {["Anniversaire", "Séminaire", "Mariage", "Pot de départ", "Autre"].map((t) => (
                <option key={t} value={t} className="bg-noir">
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">Nombre de convives</span>
            <input
              name="convives"
              type="number"
              min={10}
              max={120}
              placeholder="Nombre de convives"
              className={champ}
            />
          </label>
          <label>
            <span className="sr-only">Date souhaitée</span>
            <input name="date" type="date" placeholder="Date souhaitée" className={champ} />
          </label>
        </>
      )}

      <label className="sm:col-span-2">
        <span className="sr-only">Message</span>
        <textarea
          name="message"
          required
          rows={5}
          maxLength={4000}
          placeholder={
            sujet === "traiteur"
              ? "Décrivez votre événement : lieu, ambiance, contraintes alimentaires… *"
              : "Votre message *"
          }
          className={`${champ} resize-none`}
        />
      </label>

      {erreur && (
        <p
          role="alert"
          className="rounded-ticket border border-brique/40 bg-brique/10 px-4 py-3 text-sm text-brique sm:col-span-2"
        >
          {erreur}
        </p>
      )}

      <button
        type="submit"
        disabled={etat === "envoi"}
        className="rounded-ticket bg-beurre px-7 py-4 text-sm font-medium text-noir transition-colors hover:bg-beurre-clair disabled:opacity-60 sm:col-span-2"
      >
        {etat === "envoi" ? "Envoi…" : sujet === "traiteur" ? "Demander un devis" : "Envoyer le message"}
      </button>
    </form>
  );
}
