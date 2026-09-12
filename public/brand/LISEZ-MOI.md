# Éléments de marque du client

Déposer ici les fichiers fournis par **La Minute Gourmande** :

| Fichier attendu | Usage | Où il est branché |
| --- | --- | --- |
| `logo.svg` (ou `logo.png` ×2) | En-tête, pied de page, ticket de commande | `src/components/logo.tsx` |
| `logo-mono.svg` | Version monochrome sur fond clair | idem |
| `og.jpg` (1200×630) | Aperçu réseaux sociaux | `src/app/layout.tsx` → `openGraph.images` |
| `favicon.ico` / `icon.png` | Onglet navigateur | à placer dans `src/app/` |

Les **photos de plats** vont dans `public/photos/`, puis se branchent produit par
produit via le champ `image` de `src/data/menu.ts` :

```ts
{ id: "blanquette", nom: "Blanquette de veau", image: "/photos/blanquette.jpg", ... }
```

Sans photo, le site génère une assiette abstraite : rien ne casse.

## Couleurs et typographies

Tout est centralisé dans le bloc `@theme` de `src/app/globals.css`.
Remplacer les valeurs suffit pour appliquer la charte réelle :

```css
--color-noir / --color-encre / --color-creme   /* fonds et texte */
--color-beurre                                  /* accent principal */
--color-pistache                                /* accent secondaire (traiteur) */
--color-brique                                  /* alertes */
--font-display / --font-sans / --font-mono      /* typographies */
```

Les polices actuelles (Fraunces, Instrument Sans, DM Mono) sont chargées dans
`src/app/layout.tsx` via `next/font/google` — à remplacer par les polices de la
charte (fichiers `.woff2` + `next/font/local` si ce sont des polices sous licence).
