# La Minute Gourmande

Site vitrine + commande en ligne (click & collect) et demande de devis traiteur.

**Stack** — Next.js 16 (App Router, React Compiler, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 · Stripe Checkout · déploiement Vercel.

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

---

## ⚠️ Ce qui reste à brancher (contenu client)

Le code est terminé ; il attend les éléments réels. Tout est regroupé pour qu'une seule passe suffise :

| À fournir | Où ça se branche |
| --- | --- |
| **Logo** (SVG) | `src/components/logo.tsx` — voir `public/brand/LISEZ-MOI.md` |
| **Charte** (couleurs, polices) | bloc `@theme` de `src/app/globals.css` + `src/app/layout.tsx` |
| **Produits & prix** (flyers) | `src/data/menu.ts` — le reste du site lit uniquement ce fichier |
| **Photos des plats** | `public/photos/`, puis champ `image` de chaque produit |
| **Coordonnées, horaires, créneaux** | `src/data/restaurant.ts` |
| **Mentions légales** (SIRET, RCS, TVA…) | `src/app/mentions-legales/page.tsx` |

Les textes actuels (accueil, traiteur, « la maison », témoignages) sont rédigés mais **fictifs** : à faire valider ou réécrire avec le client.

Tant qu'aucune photo n'est fournie, chaque produit affiche une assiette générée en dégradé, stable et différente par produit — rien ne casse.

---

## Architecture

```
src/
  app/
    page.tsx                    Accueil
    carte/                      Carte complète, ancres par catégorie
    panier/                     Récapitulatif + créneau + coordonnées
    commande/confirmee/         Ticket de confirmation
    traiteur/                   Prestations + formulaire de devis
    a-propos/  contact/  mentions-legales/
    api/checkout/route.ts       Création de la commande (Stripe ou comptoir)
    api/contact/route.ts        Contact & devis (Resend ou logs)
    sitemap.ts  robots.ts  not-found.tsx
  components/
    cart-provider.tsx           Panier (store externe + useSyncExternalStore)
    site-header.tsx  site-footer.tsx  logo.tsx
    menu-card.tsx  add-to-cart.tsx  dish-visual.tsx
    panier-client.tsx  panier-flottant.tsx  vider-panier.tsx
    formulaire-contact.tsx  reveal.tsx
  data/
    menu.ts                     Catalogue produits
    restaurant.ts               Coordonnées, horaires, créneaux
  lib/format.ts                 Prix en euros, référence de commande
```

### Panier

Le panier vit dans un **store externe** lu via `useSyncExternalStore`, pas dans un `useState` + `useEffect`. Conséquences : pas de rendu en cascade à l'hydratation, et le panier reste synchronisé entre les onglets ouverts. Il est persisté dans `localStorage` sous la clé `lmg.panier.v1`, et purgé automatiquement des produits retirés de la carte.

### Sécurité des prix

`/api/checkout` **ne fait jamais confiance aux prix envoyés par le navigateur**. Il relit chaque produit dans `src/data/menu.ts`, rejette les identifiants inconnus, les produits épuisés et les quantités hors bornes (1 à 20), puis recalcule le montant côté serveur. Les formulaires publics sont protégés par un pot de miel anti-robot.

---

## Paiement en ligne

Ce site est branché sur **un compte Stripe dédié**, celui de La Minute Gourmande, totalement séparé de tout autre projet. Aucun identifiant de compte n'est écrit dans le code : le compte utilisé découle uniquement de la valeur de `STRIPE_SECRET_KEY`, définie séparément en local (`.env.local`) et sur le projet Vercel de ce site.

1. Le **client** crée son compte sur https://dashboard.stripe.com/register, à son nom et avec son RIB
2. Il vous invite en *Developer* : Dashboard → Settings → Team
3. Récupérer la clé sur https://dashboard.stripe.com/apikeys **en étant connecté sur son compte**
4. Renseigner `STRIPE_SECRET_KEY` dans `.env.local`, puis dans Vercel
5. **Vérifier le compte** : `npm run stripe:verifier`

```
  ── Compte Stripe branché sur ce site ──

  Mode de la clé         LIVE (paiements réels)
  Identifiant            acct_…
  Nom commercial         La Minute Gourmande
  Virements actifs       oui
```

C'est ce contrôle qui garantit qu'on n'encaisse pas les commandes de ce site sur le Stripe d'un autre projet.

Deux garde-fous complètent la vérification, dans `src/lib/stripe.ts` :

- une clé au format inattendu (clé publiable, valeur tronquée) est **refusée** — HTTP 503, et non un repli silencieux sur le règlement au comptoir, qui masquerait l'erreur ;
- une clé `sk_live_` **hors production est refusée**, pour ne pas encaisser de vrais paiements pendant les tests.

La référence de commande, le créneau, la note cuisine et le téléphone sont transmis en `metadata` de la session Stripe — visibles directement dans le dashboard du client.

**Non implémenté à ce stade** (à décider avec le client) : webhook Stripe de confirmation, e-mail de confirmation au client, back-office de suivi des commandes, gestion des ruptures de stock en temps réel.

---

## Déploiement

```bash
npx vercel
```

Variables à créer côté Vercel : `NEXT_PUBLIC_SITE_URL` (URL de production), `STRIPE_SECRET_KEY`, et si besoin `RESEND_API_KEY` / `CONTACT_EMAIL` / `CONTACT_FROM`.
