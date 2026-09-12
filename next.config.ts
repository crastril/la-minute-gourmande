import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Ancre la racine du projet : sans ça, Turbopack remonte jusqu'au
  // package-lock.json du dossier utilisateur et émet un avertissement.
  turbopack: { root: import.meta.dirname },
};

export default nextConfig;
