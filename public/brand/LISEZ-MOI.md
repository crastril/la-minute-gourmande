# Identité visuelle — Minute Gourmande FWI

L'identité du site part des supports **déjà utilisés** par le client (dossier `identité/`) :
le logo rond, l'enseigne extérieure et l'affiche de grande ouverture. Le but est de rester
dans leur continuité, pas d'inventer une nouvelle marque.

## Fichiers

| Fichier | Origine | Usage |
| --- | --- | --- |
| `public/brand/logo.png` | extrait de `identité/Gourmande 2.pdf`, détouré en rond, fond transparent | en-tête, pied de page, accueil, « La boutique » |
| `src/app/favicon.ico`, `icon.png`, `apple-icon.png` | générés depuis le logo | onglet navigateur, écran d'accueil mobile |
| `src/app/opengraph-image.png` | logo sur fond crème, 1200×630 | aperçu des liens partagés (WhatsApp, Instagram…) |

Le logo fourni est une **image** (1254 px), pas un fichier vectoriel. S'il existe une version
SVG ou PDF vectorielle chez le graphiste, la déposer ici en `logo.svg` et remplacer le `src`
dans `src/components/logo.tsx` : le rendu sera plus net sur écrans haute densité.

## Couleurs

Valeurs **mesurées** sur les supports, définies dans le bloc `@theme` de `src/app/globals.css`.

| Token | Valeur | Relevée sur | Rôle sur le site |
| --- | --- | --- | --- |
| `papier` | `#faf0e7` | fond de l'affiche | fond général |
| `sable` | `#f4d8b3` | fond du badge logo | sections douces |
| `encre` | `#171513` | bandeaux noirs enseigne / affiche | texte, bandeaux, pied de page |
| `orange` | `#de5321` | enseigne extérieure | **tout ce qui se commande** : boutons, panier |
| `framboise` | `#d44a62` | affiche d'ouverture | **la vitrine** : viennoiseries, pâtisseries |
| `orange-fonce` | `#b8410f` | — | orange assombri pour le petit texte |
| `framboise-fonce` | `#a8324a` | — | framboise assombri pour le petit texte |

Règle d'accessibilité : l'orange et la framboise d'origine ne sont lisibles **qu'en grand**
(titres) sur fond crème. Pour du texte courant, utiliser les variantes `-fonce`. Les boutons
orange portent un texte **noir**, pas blanc. Toutes les combinaisons utilisées passent le
niveau WCAG AA.

## Typographies

Aucune police n'a été fournie : ce sont les plus proches des supports, chargées via
`next/font/google` dans `src/app/layout.tsx`.

| Police | Rappelle | Utilisée pour |
| --- | --- | --- |
| **Anton** | « OUVERTURE ! », « SANDWICHERIE » | grands titres en capitales |
| **Kaushan Script** | « Gourmande », « Grande » | le mot mis en valeur dans un titre |
| **Barlow Condensed** | « RESTAURATION RAPIDE », « PÂTISSERIES MAISON » | sur-titres, boutons, prix, noms de produits |
| **Barlow** | textes de l'affiche | texte courant |

Si le graphiste connaît les polices exactes du logo et de l'affiche, les remplacer ici.

## Motifs graphiques

Tous repris des supports :

- **Titre mixte** capitales + script (`Grande OUVERTURE !`) → `<h1>` en Anton, mot clé en `font-script`.
- **Bandeaux noirs** du bas de l'enseigne et de l'affiche → barre d'infos en haut du site, bandeau d'infos de l'accueil, pied de page au bord déchiré (`bord-dechire`).
- **Ruban coup de pinceau** (`LE 3 SEPTEMBRE 2026`) → utilitaire `ruban`.
- **Coups de pinceau orange** de l'enseigne → derrière le logo sur l'accueil.
- **Épi et rameau** du logo → `src/components/ornement.tsx`.
- **Pictogrammes cerclés** de l'affiche → `src/components/icones.tsx`.
- **Encadrés en pointillés** de l'affiche → cartes « étapes » et « ce qu'on vous propose ».

## Photos

Les photos de l'affiche et de l'enseigne sont trop basse définition (captures WhatsApp) pour le
site. Déposer les vraies photos dans `public/photos/`, puis les brancher produit par produit via
le champ `image` de `src/data/menu.ts`. Sans photo, chaque produit affiche une assiette dessinée
avec le pictogramme de sa catégorie.
