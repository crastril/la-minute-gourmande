import Link from "next/link";

export default function Introuvable() {
  return (
    <section className="mx-auto flex min-h-[62vh] max-w-[640px] flex-col items-center justify-center px-5 py-24 text-center sm:px-8">
      <p className="sur-titre">Erreur 404</p>
      <h1 className="mt-5 text-[clamp(2.2rem,7vw,4rem)] leading-[0.95]">
        Ce plat n&apos;est plus <span className="text-beurre italic">à la carte</span>.
      </h1>
      <p className="mt-6 max-w-[40ch] text-creme-doux">
        La page que vous cherchez a été retirée du passe. La carte du jour, elle,
        est toujours là.
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Link
          href="/carte"
          className="rounded-ticket bg-beurre px-6 py-3.5 text-sm font-medium text-noir transition-colors hover:bg-beurre-clair"
        >
          Voir la carte
        </Link>
        <Link
          href="/"
          className="rounded-ticket border border-creme/20 px-6 py-3.5 text-sm text-creme transition-colors hover:border-beurre/60 hover:text-beurre-clair"
        >
          Accueil
        </Link>
      </div>
    </section>
  );
}
