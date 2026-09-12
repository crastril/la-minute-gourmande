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

1. Récupérer les clés sur https://dashboard.stripe.com/apikeys
2. Renseigner `STRIPE_SECRET_KEY` dans `.env.local` (et dans Vercel)
3. La commande redirige alors vers Stripe Checkout ; le retour se fait sur `/commande/confirmee`

La référence de commande, le créneau, la note cuisine et le téléphone sont transmis en `metadata` de la session Stripe — visibles directement dans le dashboard.

**Non implémenté à ce stade** (à décider avec le client) : webhook Stripe de confirmation, e-mail de confirmation au client, back-office de suivi des commandes, gestion des ruptures de stock en temps réel.

---

## Déploiement

```bash
npx vercel
```

Variables à créer côté Vercel : `NEXT_PUBLIC_SITE_URL` (URL de production), `STRIPE_SECRET_KEY`, et si besoin `RESEND_API_KEY` / `CONTACT_EMAIL` / `CONTACT_FROM`.
