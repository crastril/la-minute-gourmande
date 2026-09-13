# Minute Gourmande FWI

Sandwicherie, pâtisserie et restauration rapide au François (Martinique), en face d'un lycée. Le site sert de vitrine à l'ensemble des produits, et permet de réserver en ligne les repas du midi (click & collect).

## Les deux univers du catalogue

C'est la règle structurante du projet, encodée dans `src/data/menu.ts` :

| | Vitrine | Commandable |
| --- | --- | --- |
| Catégories | viennoiseries, snacking, pâtisseries | menus, plats, boissons |
| Sur le site | consultable, prix affiché | ajoutable au panier |
| Achat | au comptoir uniquement | réservation en ligne |

La vitrine n'est pas commandable **par choix économique** : avec ~0,25 € de frais fixes par transaction, vendre un pain au chocolat à 1,30 € en ligne coûterait ~22 % du prix. Ces produits se prennent au comptoir.

### Menus à composer

Un produit qui porte une `composition` est un **menu** : le bouton « Composer mon menu » ouvre une fenêtre où l'on choisit son **plat**, sa **boisson**, et, pour un supplément, un **dessert**. Le menu n'est ajouté au panier qu'une fois plat et boisson choisis.

```ts
composition: {
  plats: ["poulet-frites", "riz-poisson-frit"],
  boissons: ["canette", "eau", "jus"],
  desserts: ["eclair", "flan", "cookie"],   // pris dans les pâtisseries
  supplementDessert: 150,                    // centimes
}
```

Les choix référencent d'autres produits du catalogue : pour ajouter un plat au menu, il suffit d'ajouter son identifiant à la liste. Deux menus composés différemment occupent deux lignes du panier ; deux menus identiques fusionnent.

### Règles appliquées côté serveur

Toutes appliquées par `/api/checkout`, et pas seulement dans l'interface :

1. un produit de vitrine est rejeté, même si la requête est forgée à la main ;
2. une commande doit contenir au moins un **menu ou un plat**, une boisson seule ne suffit pas ;
3. le créneau doit appartenir à la liste du midi (11h30 → 13h30) ;
4. la composition d'un menu est revérifiée (plat, boisson et dessert doivent figurer dans le menu) et le supplément dessert est recalculé.

Le client choisit ensuite son règlement : **en ligne** (Stripe Checkout) ou **au retrait**. Sans clé Stripe configurée, l'option « payer maintenant » est affichée comme bientôt disponible et seul le règlement au retrait est possible.

**Stack** : Next.js 16 (App Router, React Compiler, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 · Stripe Checkout · déploiement Vercel.

---

## Démarrer

```bash
npm install
cp .env.example .env.local
npm run dev
```

Le site tourne sur http://localhost:3000. **Aucune clé n'est nécessaire pour développer** : sans `STRIPE_SECRET_KEY`, la commande bascule en « règlement au comptoir » ; sans `RESEND_API_KEY`, les formulaires s'écrivent dans les logs serveur.

| Commande | Effet |
| --- | --- |
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run lint` | ESLint (règles React Compiler incluses) |
| `npx tsc --noEmit` | Vérification des types |
| `npm run stripe:verifier` | Affiche le compte Stripe réellement branché |

---

## ⚠️ Ce qui reste à brancher (contenu client)

Le code est terminé ; il attend les éléments réels. Tout est regroupé pour qu'une seule passe suffise :

| À fournir | Où ça se branche |
| --- | --- |
| **Produits & prix** | `src/data/menu.ts`, le reste du site lit uniquement ce fichier. Les supports fournis ne donnent aucun prix |
| **Prix du menu et du supplément dessert** | `src/data/menu.ts`, produit `menu-du-midi` |
| **Photos des plats** | `public/photos/`, puis champ `image` de chaque produit |
| **Horaires d'ouverture** | `src/data/restaurant.ts` |
| **Domaine du site** | `src/data/restaurant.ts` (`url`) et `NEXT_PUBLIC_SITE_URL` |
| **Mentions légales** (SIRET, RCS, TVA…) | `src/app/mentions-legales/page.tsx` |
| **Logo vectoriel** (optionnel) | `public/brand/`, le logo actuel est une image extraite du PDF |

**Déjà intégré** depuis le dossier `identité/` : logo, palette, typographies, adresse, téléphone, e-mail, Instagram et date d'ouverture. Le détail de l'identité visuelle est dans [`public/brand/LISEZ-MOI.md`](public/brand/LISEZ-MOI.md). Les deux plats du menu (Poulet frites, Riz poisson frit) ont été donnés par le client.

Les textes de l'accueil et de « La boutique » reprennent les formulations de l'affiche et de l'enseigne, mais restent **à faire valider** par le client. Aucun témoignage ni historique n'est inventé.

Tant qu'aucune photo n'est fournie, chaque produit affiche une assiette dessinée avec le pictogramme de sa catégorie : rien ne casse.

---

## Architecture

```
src/
  app/
    page.tsx                    Accueil
    carte/                      Carte complète, ancres par catégorie
    panier/                     Récapitulatif + créneau + règlement
    commande/confirmee/         Ticket de confirmation
    a-propos/  contact/  mentions-legales/
    api/checkout/route.ts       Création de la commande (Stripe ou comptoir)
    api/contact/route.ts        Contact (Resend ou logs)
    sitemap.ts  robots.ts  not-found.tsx
    icon.png  apple-icon.png  favicon.ico  opengraph-image.png
  components/
    cart-provider.tsx           Panier (store externe + useSyncExternalStore)
    composer-menu.tsx           Fenêtre de composition d'un menu (<dialog>)
    site-header.tsx  site-footer.tsx  logo.tsx
    menu-card.tsx  add-to-cart.tsx  dish-visual.tsx
    panier-client.tsx  panier-flottant.tsx  vider-panier.tsx
    formulaire-contact.tsx  reveal.tsx
    icones.tsx  ornement.tsx    Pictogrammes et ornements de la charte
  data/
    menu.ts                     Catalogue, menus à composer, règles de validation
    restaurant.ts               Coordonnées, horaires, créneaux du midi
  lib/
    format.ts                   Prix en euros, référence de commande
    stripe.ts                   Résolution et garde-fous de la clé Stripe
    site.ts                     URL publique, autorisation d'indexation
public/brand/                   Logo et fiche d'identité visuelle
scripts/
  verifier-stripe.mjs           `npm run stripe:verifier`
```

### Panier

Le panier vit dans un **store externe** lu via `useSyncExternalStore`, pas dans un `useState` + `useEffect`. Conséquences : pas de rendu en cascade à l'hydratation, et le panier reste synchronisé entre les onglets ouverts. Il est persisté dans `localStorage` sous la clé `lmg.panier.v2` (les lignes de menu y portent leur composition), et purgé automatiquement des produits retirés de la carte comme des compositions qui ne sont plus proposées.

### Sécurité des prix

`/api/checkout` **ne fait jamais confiance aux prix envoyés par le navigateur**. Il relit chaque produit dans `src/data/menu.ts`, rejette les identifiants inconnus, les produits épuisés, les quantités hors bornes (1 à 20) et les compositions de menu invalides, puis recalcule le montant côté serveur, supplément dessert compris. Les formulaires publics sont protégés par un pot de miel anti-robot.

La composition des menus figure dans la description de chaque ligne Stripe et dans le journal serveur, par exemple : `2× Menu du midi (Poulet frites · Canette 33 cl · Éclair au chocolat)`.

---

## Paiement en ligne

Ce site est branché sur **un compte Stripe dédié**, celui de Minute Gourmande, totalement séparé de tout autre projet. Aucun identifiant de compte n'est écrit dans le code : le compte utilisé découle uniquement de la valeur de `STRIPE_SECRET_KEY`, définie séparément en local (`.env.local`) et sur le projet Vercel de ce site.

1. Le **client** crée son compte sur https://dashboard.stripe.com/register, à son nom et avec son RIB
2. Il vous invite en *Developer* : Dashboard → Settings → Team
3. Récupérer la clé sur https://dashboard.stripe.com/apikeys **en étant connecté sur son compte**
4. Renseigner `STRIPE_SECRET_KEY` dans `.env.local`, puis dans Vercel
5. **Vérifier le compte** : `npm run stripe:verifier`

```
  ── Compte Stripe branché sur ce site ──

  Mode de la clé         LIVE (paiements réels)
  Identifiant            acct_…
  Nom commercial         Minute Gourmande
  Virements actifs       oui
```

C'est ce contrôle qui garantit qu'on n'encaisse pas les commandes de ce site sur le Stripe d'un autre projet.

Deux garde-fous complètent la vérification, dans `src/lib/stripe.ts` :

- une clé au format inattendu (clé publiable, valeur tronquée) est **refusée** : HTTP 503, et non un repli silencieux sur le règlement au comptoir, qui masquerait l'erreur ;
- une clé `sk_live_` **hors production est refusée**, pour ne pas encaisser de vrais paiements pendant les tests.

La référence de commande, le créneau, la note cuisine et le téléphone sont transmis en `metadata` de la session Stripe, visibles directement dans le dashboard du client.

**Non implémenté à ce stade** (à décider avec le client) : webhook Stripe de confirmation, e-mail de confirmation au client, back-office de suivi des commandes, gestion des ruptures de stock en temps réel.

---

## Déploiement

Le projet est déployé sur Vercel avec la CLI :

```bash
vercel deploy --prod
```

- **Rien de sensible n'est envoyé** : `.vercelignore` exclut les fichiers `.env*` (dont la clé Stripe locale) et les fichiers bruts du dossier `identité/`.
- **URL de partage** : sans domaine défini, les URL absolues (image d'aperçu des liens WhatsApp / Instagram) utilisent automatiquement l'URL de production Vercel (`src/lib/site.ts`).
- **Pas d'indexation par défaut** : tant que `AUTORISER_INDEXATION` n'est pas à `true`, le site demande aux moteurs de recherche de ne pas l'indexer (`robots.txt` + balise `noindex`). Une version de validation, avec des prix provisoires, ne doit pas apparaître dans Google sous le nom de la boutique.

Variables d'environnement côté Vercel :

| Variable | Quand la définir |
| --- | --- |
| `STRIPE_SECRET_KEY` | pour activer le paiement en ligne (sinon règlement au retrait uniquement) |
| `NEXT_PUBLIC_SITE_URL` | une fois le domaine définitif branché |
| `AUTORISER_INDEXATION=true` | à la vraie mise en ligne seulement |
| `RESEND_API_KEY`, `CONTACT_EMAIL`, `CONTACT_FROM` | pour recevoir les messages du formulaire par e-mail |
