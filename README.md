# Minute Gourmande FWI

Sandwicherie, pâtisserie et restauration rapide au François (Martinique), en face d'un lycée. Le site sert de vitrine à l'ensemble des produits, et permet de réserver en ligne les repas du midi (click & collect), réglés sur le site ou au retrait.

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

Un produit qui porte une `composition` est un **menu** : le bouton « Composer mon menu » ouvre une fenêtre où l'on choisit son **plat** et, en option, une **glace** en dessert. La **boisson est incluse** : elle ne se choisit pas en ligne. Le menu n'est ajouté au panier qu'une fois le plat choisi.

```ts
composition: {
  plats: ["poulet-frites", "poisson-frit-marine"],
  desserts: GLACES.map((g) => g.id),   // les glaces, facturées à leur prix
  supplementMenu: 0,                   // centimes ajoutés au plat pour la boisson incluse
}
```

**Prix du menu** : prix du plat + `supplementMenu` + glace éventuelle. Le « dès … » affiché est celui du plat le moins cher, recalculé automatiquement depuis les prix de la carte. Tant que le client n'a pas donné le prix de ses menus, le supplément vaut 0 : le menu coûte le prix du plat, boisson incluse.

Deux menus composés différemment occupent deux lignes du panier ; deux menus identiques fusionnent.

### Règles appliquées côté serveur

Toutes appliquées par `/api/checkout`, et pas seulement dans l'interface :

1. un produit de vitrine est rejeté, même si la requête est forgée à la main ;
2. une commande doit contenir au moins un **menu, un plat ou un burger** ; une boisson seule ne suffit pas ;
3. le créneau doit appartenir à la liste du midi (11h30 → 13h30) ;
4. la composition d'un menu est revérifiée (plat et dessert doivent figurer dans le menu) et son prix recalculé ;
5. les **conditions générales de vente** doivent avoir été acceptées ; leur version est enregistrée avec la commande.

**Stack** : Next.js 16 (App Router, React Compiler, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 · Stripe (Checkout Sessions + Payment Element) · Resend · déploiement Vercel.

---

## Démarrer

```bash
npm install
cp .env.example .env.local
npm run dev
```

Le site tourne sur http://localhost:3000. **Aucune clé n'est nécessaire pour développer** : sans clés Stripe, la commande bascule en « règlement au retrait » ; sans `RESEND_API_KEY`, les e-mails (commandes, contact) s'écrivent dans les logs serveur.

| Commande | Effet |
| --- | --- |
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run lint` | ESLint (règles React Compiler incluses) |
| `npx tsc --noEmit` | Vérification des types |
| `npm run stripe:verifier` | Affiche le compte Stripe réellement branché et contrôle la configuration |

---

## ⚠️ Ce qui reste à confirmer ou fournir

**Déjà intégré** : logo, palette, typographies, coordonnées, date d'ouverture (dossier `identité/`), **produits et prix du menu imprimé**, et un **modèle de CGV** pour la vente à emporter. Le détail de l'identité visuelle est dans [`public/brand/LISEZ-MOI.md`](public/brand/LISEZ-MOI.md).

| À fournir | Où ça se branche |
| --- | --- |
| **Prix des menus** (ce que la boisson incluse ajoute au prix du plat) | `src/data/menu.ts`, champ `supplementMenu` du `menu-du-midi` |
| **Compléments des CGV** : forme juridique, SIRET, immatriculation, TVA, médiateur de la consommation, moyens de paiement acceptés au comptoir | passages entre crochets de `src/app/cgv/page.tsx` |
| **Validation des règles d'annulation** (délai d'annulation, conservation d'une commande non retirée) | `src/data/cgv.ts` |
| **Relecture des CGV** par un professionnel du droit | avant d'encaisser des paiements |
| **Mentions légales complètes** | `src/app/mentions-legales/page.tsx` |
| **Allergènes** (information obligatoire en restauration) | `src/data/menu.ts`, champ `allergenes` de chaque produit |
| **Photos et descriptions** des plats | `public/photos/` puis champs `image` et `description` |
| **Horaires d'ouverture** | `src/data/restaurant.ts` |
| **Domaine du site** | `src/data/restaurant.ts` (`url`) et `NEXT_PUBLIC_SITE_URL` |
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
    panier/                     Récapitulatif + créneau + règlement + paiement intégré
    commande/confirmee/         Confirmation (paiement revérifié auprès de Stripe)
    cgv/  a-propos/  contact/  mentions-legales/
    api/checkout/route.ts       Création de la commande (session Stripe ou e-mail au retrait)
    api/stripe/webhook/route.ts Webhook Stripe : commande payée → e-mail à la boutique
    api/contact/route.ts        Contact (Resend ou logs)
    sitemap.ts  robots.ts  not-found.tsx
    icon.png  apple-icon.png  favicon.ico  opengraph-image.png
  components/
    cart-provider.tsx           Panier (store externe + useSyncExternalStore)
    composer-menu.tsx           Fenêtre de composition d'un menu (<dialog>)
    paiement-integre.tsx        Champs de paiement Stripe aux couleurs du site + Link
    site-header.tsx  site-footer.tsx  logo.tsx
    menu-card.tsx               Produit en carte illustrée ou en ligne de prix
    add-to-cart.tsx  dish-visual.tsx
    panier-client.tsx  panier-flottant.tsx  vider-panier.tsx
    formulaire-contact.tsx  reveal.tsx
    icones.tsx  ornement.tsx    Pictogrammes et ornements de la charte
  data/
    menu.ts                     Catalogue, menus à composer, prix et validation
    restaurant.ts               Coordonnées, horaires, créneaux du midi
    cgv.ts                      Version des CGV et règles d'annulation
  lib/
    commande.ts                 Récapitulatif de commande (texte et HTML de l'e-mail)
    email.ts                    Envoi d'e-mail via Resend (ou logs)
    format.ts                   Prix en euros, référence de commande
    stripe.ts                   Résolution et garde-fous des clés Stripe
    site.ts                     URL publique, autorisation d'indexation
public/brand/                   Logo et fiche d'identité visuelle
scripts/
  verifier-stripe.mjs           `npm run stripe:verifier`
```

### Panier

Le panier vit dans un **store externe** lu via `useSyncExternalStore`, pas dans un `useState` + `useEffect`. Conséquences : pas de rendu en cascade à l'hydratation, et le panier reste synchronisé entre les onglets ouverts. Il est persisté dans `localStorage` sous la clé `lmg.panier.v2` (les lignes de menu y portent leur composition), et purgé automatiquement des produits retirés de la carte comme des compositions qui ne sont plus proposées.

### Sécurité des prix

`/api/checkout` **ne fait jamais confiance aux prix envoyés par le navigateur**. Il relit chaque produit dans `src/data/menu.ts`, rejette les identifiants inconnus, les produits épuisés, les quantités hors bornes (1 à 20) et les compositions de menu invalides, puis recalcule le montant côté serveur. Tous les champs saisis sont nettoyés et bornés ; ils sont échappés avant d'être insérés dans l'e-mail. Les formulaires publics sont protégés par un pot de miel anti-robot.

---

## Conditions générales de vente

La page `/cgv` est un **modèle pour la vente à emporter avec retrait sur place** : identification du vendeur, produits et allergènes, prix, commande, paiement, retrait, absence de droit de rétractation, annulation, réclamations, données personnelles, médiation.

- **Pas de droit de rétractation** : l'article L221-28 du Code de la consommation l'exclut pour les denrées périssables et la restauration fournie à une date déterminée. Les CGV le disent explicitement, et la case du panier le rappelle.
- **Acceptation obligatoire** : une case à cocher dans le panier, revérifiée par `/api/checkout`. La version acceptée (`CGV.version`) est enregistrée dans les métadonnées de la commande Stripe.
- **Règles commerciales paramétrables** dans `src/data/cgv.ts` : délai d'annulation, conservation d'une commande non retirée, délai de remboursement. Toute modification des CGV impose de changer `version`.

---

## Paiement en ligne

### Paiement intégré au site

Le paiement se fait **sur le site, sans redirection** : Stripe Checkout Sessions en `ui_mode: "elements"`, avec le Payment Element.

- les champs de carte sont des iframes Stripe : **les données bancaires ne touchent jamais notre serveur** ;
- **Link** : le champ e-mail (Contact Details Element) reconnaît les clients inscrits, qui retrouvent leur carte après un code de vérification ;
- **3D Secure** est géré par Stripe ;
- les champs reprennent la charte (crème, encre, orange, police Barlow) ;
- Apple Pay et Google Pay s'affichent quand ils sont activés et que le domaine est enregistré chez Stripe.

### Déroulé d'une commande payée en ligne

1. Le client remplit le retrait, accepte les CGV et choisit « Payer maintenant ».
2. `/api/checkout` recalcule le montant et crée une session Stripe ; le navigateur reçoit son `client_secret`.
3. Le panier est figé et les champs de paiement remplacent le formulaire.
4. Après validation, Stripe renvoie vers `/commande/confirmee?session_id=…`. La page **relit la session chez Stripe** : un identifiant recopié ou inventé n'affiche jamais « payé ».
5. Stripe envoie l'événement `checkout.session.completed` à `/api/stripe/webhook`, qui vérifie la signature et **envoie l'e-mail de commande à la boutique**. C'est la seule source fiable : elle fonctionne même si le client ferme l'onglet.

Une commande **à régler au retrait** envoie l'e-mail immédiatement. Si l'envoi échoue, le client en est averti plutôt que de recevoir une confirmation que personne ne lirait. Côté webhook, un échec renvoie une erreur à Stripe, qui réessaie plus tard : un e-mail peut arriver en double, une commande ne peut pas être perdue.

### Annulations et remboursements

Une commande payée en ligne ne s'« annule » pas dans Stripe : **on la rembourse**, en totalité ou en partie. L'e-mail de chaque commande payée contient un **lien direct vers le paiement** dans le tableau de bord Stripe.

Pour rembourser : ouvrir le lien de l'e-mail (ou Stripe → Paiements → retrouver le paiement), menu « … » → **Rembourser le paiement**, laisser le montant total ou saisir un montant partiel, choisir un motif, valider.

| Situation | Que faire |
| --- | --- |
| Le client annule **avant** le délai prévu par les CGV | remboursement total |
| Le client annule **après** ce délai, ou ne vient pas | pas de remboursement (CGV, denrées préparées) ; geste commercial possible |
| Un produit n'est **plus disponible** | appeler le client : remplacement, ou remboursement **partiel** du produit concerné (ou total si le client annule) |
| **Erreur de la boutique**, fermeture exceptionnelle | remboursement total |
| Commande **à régler au retrait** | rien à rembourser : prévenir le client par téléphone |

À savoir :

- **Stripe ne restitue pas ses frais** sur un remboursement : chaque remboursement coûte les frais de la transaction d'origine ;
- le remboursement est **prélevé sur le solde Stripe** ; si le solde est insuffisant, il reste en attente jusqu'aux prochains encaissements ;
- le client voit le remboursement sur son compte après un délai qui dépend de sa banque ;
- la version des CGV acceptée et la référence de commande figurent dans les métadonnées du paiement.

### Un compte Stripe dédié

Le site est branché sur **le compte Stripe de Minute Gourmande**, séparé de tout autre projet. Aucun identifiant de compte n'est écrit dans le code : le compte utilisé découle uniquement des variables d'environnement.

Garde-fous de `src/lib/stripe.ts` :

- clé secrète ou publique au format inattendu ;
- clé `sk_live_` hors production (pas de vrai débit pendant les tests) ;
- clé publique manquante, ou de **mode différent** de la clé secrète (test / live) : le paiement en ligne n'est plus proposé.

Le webhook et la page de confirmation n'utilisent que la clé secrète : une clé publique mal configurée coupe l'affichage du paiement, mais pas la transmission des commandes déjà payées.

`npm run stripe:verifier` affiche le compte réellement branché et contrôle la configuration locale.

### Tester en local

Dans `.env.local` : `STRIPE_SECRET_KEY=sk_test_…` et `STRIPE_PUBLISHABLE_KEY=pk_test_…` du même compte. Cartes de test Stripe : `4242 4242 4242 4242` (paiement accepté), `4000 0027 6000 3184` (validation 3D Secure demandée), n'importe quelle date future et n'importe quel CVC.

### Passage en production

À faire dans cet ordre, **avant** d'annoncer le paiement en ligne :

1. **Activer le compte Stripe** : vérification d'identité terminée et RIB renseigné (`npm run stripe:verifier` doit afficher « Encaissements actifs : oui »).
2. **Compléter et faire relire les CGV**, compléter les **mentions légales** : obligatoires pour vendre en ligne, et contrôlées par Stripe.
3. **Créer le webhook live** dans Stripe → Développeurs → Webhooks :
   - URL : `https://la-minute-gourmande.vercel.app/api/stripe/webhook` (puis le domaine définitif) ;
   - événements : `checkout.session.completed` et `checkout.session.async_payment_succeeded` ;
   - copier le secret de signature `whsec_…`.
4. **Créer un compte Resend** avec l'adresse qui doit recevoir les commandes, et générer une clé API.
5. **Renseigner les variables** dans Vercel → Settings → Environment Variables, en environnement *Production* : `STRIPE_SECRET_KEY` (`sk_live_…`), `STRIPE_PUBLISHABLE_KEY` (`pk_live_…`), `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `COMMANDES_EMAIL`.
6. **Redéployer** : les variables d'environnement ne s'appliquent qu'au déploiement suivant.
7. **Faire le ménage des moyens de paiement** dans Stripe → Paramètres → Moyens de paiement : garder carte, Link, Apple Pay et Google Pay ; désactiver ceux qui ne servent pas en Martinique (Bancontact, EPS, Klarna, MB Way, Satispay…).
8. **Enregistrer le domaine** pour Apple Pay et Google Pay (Paramètres → Domaines des moyens de paiement).
9. **Tester avec une vraie carte** sur une petite commande, vérifier la réception de l'e-mail, puis rembourser depuis le lien de l'e-mail.

**Non implémenté à ce stade** (à décider avec le client) : e-mail de confirmation au client (les reçus Stripe peuvent être activés dans les paramètres du compte), bouton de remboursement intégré au site, back-office de suivi des commandes, gestion des ruptures de stock en temps réel.

---

## Déploiement

Le projet est déployé sur Vercel avec la CLI :

```bash
vercel deploy --prod
```

- **Lien à partager** : `https://la-minute-gourmande.vercel.app`. Les URL propres à chaque déploiement (`la-minute-gourmande-xxxx-….vercel.app`) sont protégées par l'authentification Vercel et ne s'ouvrent pas pour un visiteur.
- **Rien de sensible n'est envoyé** : `.vercelignore` exclut les fichiers `.env*` (dont les clés locales) et les fichiers bruts du dossier `identité/`.
- **Aperçus de lien** : sans domaine défini, les URL absolues (image d'aperçu WhatsApp / Instagram) utilisent automatiquement l'URL de production Vercel (`src/lib/site.ts`).
- **Pas d'indexation par défaut** : tant que `AUTORISER_INDEXATION` n'est pas à `true`, le site demande aux moteurs de recherche de ne pas l'indexer (`robots.txt` + balise `noindex`).

Variables d'environnement côté Vercel :

| Variable | Rôle |
| --- | --- |
| `STRIPE_SECRET_KEY` | clé secrète Stripe (`sk_live_…` en production) |
| `STRIPE_PUBLISHABLE_KEY` | clé publique du même compte et du même mode (`pk_live_…`) |
| `STRIPE_WEBHOOK_SECRET` | secret de signature du webhook (`whsec_…`) |
| `RESEND_API_KEY` | envoi des e-mails de commande et de contact |
| `COMMANDES_EMAIL` | adresse qui reçoit les commandes |
| `CONTACT_EMAIL`, `CONTACT_FROM` | formulaire de contact, expéditeur des e-mails |
| `NEXT_PUBLIC_SITE_URL` | une fois le domaine définitif branché |
| `AUTORISER_INDEXATION=true` | à la vraie mise en ligne seulement |
