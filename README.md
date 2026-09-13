# Minute Gourmande FWI

Sandwicherie, pâtisserie et restauration rapide au François (Martinique), en face d'un lycée. Le site sert de vitrine à l'ensemble des produits, et permet de réserver en ligne les repas du midi (click & collect).

**Version de validation** : https://la-minute-gourmande.vercel.app (non indexée par les moteurs de recherche).

## Les deux univers du catalogue

C'est la règle structurante du projet, encodée dans `src/data/menu.ts`. Noms et prix sont repris du **menu imprimé affiché en boutique**.

| | Vitrine | Commandable |
| --- | --- | --- |
| Catégories | sandwichs, paninis & hot-dog, viennoiseries, glaces | menus, plats chauds, burgers, boissons |
| Sur le site | liste de prix | ajoutable au panier |
| Achat | au comptoir uniquement | réservation en ligne |

La vitrine n'est pas commandable **par choix économique** : avec ~0,25 € de frais fixes par transaction, vendre un pain au chocolat à 1,40 € en ligne coûterait près de 20 % du prix. Ces produits se prennent au comptoir.

Menus, plats chauds et burgers s'affichent en grandes cartes ; les autres catégories en **liste de prix compacte**, comme sur le menu imprimé (champ `affichage` de chaque catégorie).

### Menus à composer

Un produit qui porte une `composition` est un **menu** : le bouton « Composer mon menu » ouvre une fenêtre où l'on choisit son **plat**, sa **boisson**, et, en option, une **glace** en dessert. Le menu n'est ajouté au panier qu'une fois plat et boisson choisis.

```ts
composition: {
  plats: ["poulet-frites", "poisson-frit-marine"],
  boissons: BOISSONS.map((b) => b.id),   // toutes les boissons de la carte
  desserts: GLACES.map((g) => g.id),     // les glaces, facturées à leur prix
  remise: 0,                             // centimes, à régler selon le prix du menu
}
```

**Prix du menu** : somme plat + boisson + dessert, moins la `remise`. Le « dès … » affiché est celui de la composition la moins chère, recalculé automatiquement depuis les prix de la carte. Tant que le client n'a pas donné sa règle de prix, la remise vaut 0.

Deux menus composés différemment occupent deux lignes du panier ; deux menus identiques fusionnent.

### Règles appliquées côté serveur

Toutes appliquées par `/api/checkout`, et pas seulement dans l'interface :

1. un produit de vitrine est rejeté, même si la requête est forgée à la main ;
2. une commande doit contenir au moins un **menu, un plat ou un burger** ; une boisson seule ne suffit pas ;
3. le créneau doit appartenir à la liste du midi (11h30 → 13h30) ;
4. la composition d'un menu est revérifiée (plat, boisson et dessert doivent figurer dans le menu) et son prix recalculé.

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

## ⚠️ Ce qui reste à confirmer ou fournir

**Déjà intégré** : logo, palette, typographies, coordonnées, date d'ouverture (dossier `identité/`) et **produits et prix du menu imprimé**. Le détail de l'identité visuelle est dans [`public/brand/LISEZ-MOI.md`](public/brand/LISEZ-MOI.md).

| À fournir | Où ça se branche |
| --- | --- |
| **Prix des menus** (remise par rapport aux prix à la carte) | `src/data/menu.ts`, champ `remise` du `menu-du-midi` |
| **Allergènes** (information obligatoire en restauration) | `src/data/menu.ts`, champ `allergenes` de chaque produit |
| **Photos et descriptions** des plats | `public/photos/` puis champs `image` et `description` |
| **Horaires d'ouverture** | `src/data/restaurant.ts` |
| **Domaine du site** | `src/data/restaurant.ts` (`url`) et `NEXT_PUBLIC_SITE_URL` |
| **Mentions légales** (SIRET, RCS, TVA…) | `src/app/mentions-legales/page.tsx` |
| **Logo vectoriel** (optionnel) | `public/brand/`, le logo actuel est une image extraite du PDF |

Lectures du menu imprimé **à faire confirmer** par le client :

- « Burger » et « Cheeseburger » sont imprimés dans le bloc Paninis : ils sont traités comme des burgers réservables en ligne ;
- « Didier » puis « Nature 50 cl » et « Aromatisée 50 cl » : repris en trois lignes ;
- le « Riz poisson frit » demandé pour le menu est rapproché du « Poisson frit mariné » (10,00 €) ;
- les parts de pizza et les salades évoquées ailleurs ne figurent pas sur le menu imprimé, donc pas sur le site.

Les textes de l'accueil et de « La boutique » reprennent les formulations de l'affiche et de l'enseigne, mais restent **à faire valider**. Aucun témoignage, historique, description ou allergène n'est inventé. Sans photo, chaque produit affiche une assiette dessinée avec le pictogramme de sa catégorie.

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
    menu-card.tsx               Produit en carte illustrée ou en ligne de prix
    add-to-cart.tsx  dish-visual.tsx
    panier-client.tsx  panier-flottant.tsx  vider-panier.tsx
    formulaire-contact.tsx  reveal.tsx
    icones.tsx  ornement.tsx    Pictogrammes et ornements de la charte
  data/
    menu.ts                     Catalogue, menus à composer, prix et validation
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

`/api/checkout` **ne fait jamais confiance aux prix envoyés par le navigateur**. Il relit chaque produit dans `src/data/menu.ts`, rejette les identifiants inconnus, les produits épuisés, les quantités hors bornes (1 à 20) et les compositions de menu invalides, puis recalcule le montant côté serveur. Les formulaires publics sont protégés par un pot de miel anti-robot.

La composition des menus figure dans la description de chaque ligne Stripe et dans le journal serveur, par exemple : `2× Menu du midi (Poulet frites · Coca-Cola · Magnum)`.

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

- **Lien à partager** : `https://la-minute-gourmande.vercel.app`. Les URL propres à chaque déploiement (`la-minute-gourmande-xxxx-….vercel.app`) sont protégées par l'authentification Vercel et ne s'ouvrent pas pour un visiteur.
- **Rien de sensible n'est envoyé** : `.vercelignore` exclut les fichiers `.env*` (dont la clé Stripe locale) et les fichiers bruts du dossier `identité/`.
- **Aperçus de lien** : sans domaine défini, les URL absolues (image d'aperçu WhatsApp / Instagram) utilisent automatiquement l'URL de production Vercel (`src/lib/site.ts`).
- **Pas d'indexation par défaut** : tant que `AUTORISER_INDEXATION` n'est pas à `true`, le site demande aux moteurs de recherche de ne pas l'indexer (`robots.txt` + balise `noindex`).

Variables d'environnement côté Vercel :

| Variable | Quand la définir |
| --- | --- |
| `STRIPE_SECRET_KEY` | pour activer le paiement en ligne (sinon règlement au retrait uniquement) |
| `NEXT_PUBLIC_SITE_URL` | une fois le domaine définitif branché |
| `AUTORISER_INDEXATION=true` | à la vraie mise en ligne seulement |
| `RESEND_API_KEY`, `CONTACT_EMAIL`, `CONTACT_FROM` | pour recevoir les messages du formulaire par e-mail |
