"use client";

import { useState } from "react";

const champ =
  "w-full rounded-ticket border border-encre/15 bg-papier px-4 py-3 text-sm text-encre placeholder:text-encre-pale transition-colors focus:border-orange/60 focus:outline-none";

export function FormulaireContact() {
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
        body: JSON.stringify(donnees),
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
        className="perfore rounded-ticket border border-framboise/35 bg-framboise/8 px-7 py-12 text-center"
      >
        <p className="font-display text-2xl text-encre">Message reçu.</p>
        <p className="mx-auto mt-3 max-w-[38ch] text-sm text-encre-douce">
          Nous vous répondons sous 24 h ouvrées. Pour une commande du jour, le
          téléphone reste plus rapide.
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
      <label className="sm:col-span-2">
        <span className="sr-only">Téléphone</span>
        <input name="telephone" type="tel" placeholder="Téléphone" className={champ} autoComplete="tel" />
      </label>

      <label className="sm:col-span-2">
        <span className="sr-only">Message</span>
        <textarea
          name="message"
          required
          rows={5}
          maxLength={4000}
          placeholder="Votre message *"
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
        className="rounded-ticket bg-orange px-7 py-4 text-sm font-medium text-encre transition-colors hover:bg-orange-vif disabled:opacity-60 sm:col-span-2"
      >
        {etat === "envoi" ? "Envoi…" : "Envoyer le message"}
      </button>
    </form>
  );
}
