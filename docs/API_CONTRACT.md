# API_CONTRACT — contrat d'API

**Propriétaire :** Backend · **Statut :** v1 (stabilisé le 2026-11-06) — **aucun endpoint n'est implémenté**

> Ne pas confondre les deux documents :
> - [API_NEEDS.md](API_NEEDS.md) = **ce dont le frontend a besoin** (entrée, rédigé par le frontend) ;
> - ce document = **le contrat proposé** (sortie, rédigé par le backend).
>
> Les formes de champs détaillées restent dans `API_NEEDS.md` §2 tant que le contrat n'est pas
> stabilisé. Ici : conventions, endpoints, erreurs, webhooks, autorisation.

---

## 1. Conventions transverses

| Sujet | Règle proposée |
| --- | --- |
| Base | `/api/v1` |
| Format | JSON UTF-8, `camelCase` |
| Dates | ISO 8601 UTC (`2026-11-04T18:00:00Z`) ; les fuseaux d'affichage sont des champs `timeZone` IANA |
| Montants | Entier en cents + `currency: "USD"` |
| Authentification | `Authorization: Bearer <token>` — forme exacte liée à `O-23` |
| Pagination | `?page=1&pageSize=12` → `{ items, total, page, pageCount, pageSize }` |
| Tri | `?sort=field` ou `?sort=-field` (préfixe `-` = décroissant), liste blanche par endpoint |
| Erreurs | Problem details : `{ type, title, status, code, detail, fields? }` |
| Idempotence | `Idempotency-Key` obligatoire sur les `POST` de paiement, contrat et réservation |
| Limitation | `429` + `Retry-After` |
| Cache | `Cache-Control: public, max-age=60` sur les catalogues publics uniquement, jamais sur `/me/*` |
| Versionnage | La version vit dans le chemin ; une rupture de contrat impose `/api/v2` |

## 2. Autorisation

| Rôle | Portée |
| --- | --- |
| `anonymous` | Lecture des ressources publiques |
| `authenticated` | Ses propres ressources (`/me/*`) |
| `owner` | Objet dont il est propriétaire (étalon, femelle, portée, demande) |
| `club_manager` | Ses clubs et événements |
| `admin` | Modération et vérification, jamais la lecture d'un document privé sans justification tracée |

Règles :

1. Être authentifié ne donne accès à rien : l'autorisation est **par ressource et par activité**.
2. Pour une ressource qui ne lui appartient pas, le serveur renvoie `404`, pas `403` — cela évite
   d'énumérer les identifiants existants.
3. Toute action admin est journalisée (acteur, cible, avant/après).

## 3. Endpoints

### 3.1 Public (sans authentification)

| Méthode | Chemin | Notes |
| --- | --- | --- |
| GET | `/studs` | Filtres : `q`, `breed`, `stateCode`, `maxPrice`, `hasCurrentBrucellosis`, `page`, `sort`, `view` |
| GET | `/studs/{slug}` | Fiche publique ; aucun champ privé |
| GET | `/breeds` | Liste canonique (`O-28`) |
| GET | `/breeds/{slug}` | Guide de race |
| GET | `/litters` | `status`, `breed`, `stateCode`, `page` |
| GET | `/litters/{slug}` | Portée + chiots |
| GET | `/professionals` | `category`, `stateCode`, `q`, `page` |
| GET | `/professionals/{slug}` | Adresse publique : politique `O-29` |
| GET | `/clubs` · `/clubs/{slug}` | |
| GET | `/events` · `/events/{slug}` | `startsAt` en UTC + `timeZone` |
| GET | `/comparators/{type}` | `insurance` · `dog_food` · `cat_food` |
| GET | `/sponsors/plans` | Inventaire en aperçu, prix `pending` |
| GET | `/articles` · `/articles/{slug}` | Contenu éditorial |

### 3.2 Authentifié — `/me/*`

| Méthode | Chemin | Notes |
| --- | --- | --- |
| GET | `/me` | Profil, activités, plan |
| GET | `/me/animals` | Étalons et femelles possédés |
| GET | `/me/listings` | Portées et annonces |
| GET | `/me/requests` | Demandes reçues et envoyées |
| GET | `/me/contracts` | Contrats |
| GET | `/me/favorites` | Favoris (aujourd'hui en `localStorage`) |
| GET | `/me/billing` | Abonnement — `O-06` |

### 3.3 Actions (mutations)

| Méthode | Chemin | Idempotent | Règle |
| --- | --- | --- | --- |
| POST | `/requests` | oui | Crée une demande `pending`, sans payer |
| POST | `/requests/{id}/payment-intent` | oui | Renvoie un identifiant de paiement, **ne débloque rien** |
| POST | `/requests/{id}/accept` · `/decline` | oui | Propriétaire de l'étalon uniquement |
| POST | `/contracts/{id}/sign` | oui | Signature des deux parties, traçable |
| POST | `/litters/{id}/reserve` | oui | Unité de réservation : `O-19` |
| POST | `/events/{id}/tickets` | oui | Capacité vérifiée côté serveur |
| POST | `/studs/{id}/contact-unlock` | **non** | Refusé : le déblocage n'est jamais une action cliente |

### 3.4 Administration

| Méthode | Chemin | Notes |
| --- | --- | --- |
| GET | `/admin/verifications` | File de revue de documents |
| POST | `/admin/verifications/{id}/review` | `approved` / `changes_requested` |
| GET | `/admin/transactions` | Paiements et reversements |
| GET | `/admin/reports` | Signalements |
| GET | `/admin/users` | Comptes |
| POST | `/admin/users/{id}/role` | Changement de rôle, journalisé |

## 4. Règles de réponse

1. Aucune réponse publique ne contient : adresse de rue, ZIP, coordonnées exactes, téléphone,
   e-mail, URL de document, identifiant interne du propriétaire.
2. Tout montant porte son statut. Un prix `pending` n'est jamais retourné dans un champ facturable.
3. Une réponse de liste est toujours `{ items, total, page, pageCount, pageSize }`.
4. Aucune donnée de démonstration ne doit être indiscernable d'une donnée réelle en production.

## 5. Codes d'erreur

| Code | Sens |
| --- | --- |
| `unauthenticated` | 401 — jeton absent ou expiré |
| `forbidden` | 403 — authentifié mais action interdite sur une ressource connue |
| `not_found` | 404 — ressource absente **ou** non possédée |
| `conflict` | 409 — état incompatible (paiement déjà traité, réservation prise) |
| `validation_failed` | 422 — `fields` détaille chaque erreur |
| `rate_limited` | 429 |
| `provider_error` | 502 — prestataire de paiement ou d'e-mail indisponible |

## 6. Webhooks

| Événement | Effet serveur |
| --- | --- |
| `payment.succeeded` | `paymentStatus = paid` ; débloque le contact **si** la politique l'autorise |
| `payment.failed` | `paymentStatus = failed` ; aucune autre transition |
| `payment.refunded` | `paymentStatus = refunded` ; ne révoque pas un contrat signé sans règle explicite |
| `checkout.session.expired` | `paymentStatus = not_required` si aucune tentative aboutie |

Règles : signature vérifiée, traitement idempotent par `providerRef`, réponse `2xx` rapide puis
traitement asynchrone, aucune confiance dans un paramètre de redirection.

## 7. Compatibilité frontend — interface figée

`lib/api/catalog.ts` expose `CatalogRepository`, **seul point d'entrée des écrans**. Le client HTTP
qui remplacera `demoCatalogRepository` doit conserver ces six signatures à l'identique :

```ts
interface CatalogRepository {
  searchStuds(query: StudSearchQuery): Promise<StudSearchResult>;
  getStudBySlug(slug: string): Promise<Stud | null>;
  getFeaturedStuds(limit: number): Promise<Stud[]>;
  getRelatedStuds(slug: string, limit: number): Promise<Stud[]>;
  listBreeds(): Promise<string[]>;
  listStudSlugs(): Promise<string[]>;
}
```

Correspondance endpoints (proposée, non implémentée) :

| Méthode du dépôt | Endpoint |
| --- | --- |
| `searchStuds` | `GET /studs` (filtres `q`, `breed`, `stateCode`, `maxPrice`, `hasCurrentBrucellosis`, `page`, `pageSize`, `sort`, `view`) |
| `getStudBySlug` | `GET /studs/{slug}` |
| `getFeaturedStuds` | `GET /studs` avec tri/paramètre `featured` (forme exacte à trancher) |
| `getRelatedStuds` | dérivé de `GET /studs` par `breed`/`stateCode`, calculé serveur |
| `listBreeds` | `GET /breeds` |
| `listStudSlugs` | endpoint de slugs pour la génération statique |

**Écart constaté :** `CatalogRepository` ne couvre aujourd'hui que `studs` et `breeds`. Les écrans
marketplace (portées, services, clubs, événements, comparateurs) et **toutes les mutations**
(`/requests`, `/contracts`, paiements, réservations) ne sont pas derrière cette frontière. Étendre
l'interface avant branchement est un travail frontend ; c'est signalé ici comme divergence de
compatibilité, pas résolu par ce document.

**Règle :** une signature modifiée = un changement de contrat = une décision `D-nnn` avant
implémentation.

## 8. Ce qui reste à décider

Aucune de ces décisions n'est prise dans ce document : les endpoints et champs ci-dessus sont des
contraintes de forme, pas des choix de produit.

| Décision | Ce qu'elle bloque |
| --- | --- |
| `O-23` (fournisseur d'auth, forme du jeton, session) | `Authorization: Bearer`, tout `/me/*` et `/admin/*` |
| `O-01` / `O-19` (paiement de portée, unité de réservation) | la sémantique de `paymentStatus` et `POST /litters/{id}/reserve` |
| `O-04` (séquestre, délai de reversement) | `Payout` et la transition `refunded` |
| `O-24` (fournisseur de carte) | aucun endpoint (champs de géométrie uniquement) |
| `O-25` (fournisseur e-mail, déclencheurs) | les notifications (aucun endpoint défini) |
| `O-28` (listes canoniques États/races) | `GET /breeds` et `stateCode` (source des valeurs) |

## Implemented account actions (Lot 1)

| Operation | Inputs | Result |
| --- | --- | --- |
| signUp | display_name, email, password, one or more marketplace activities | Pending email confirmation or authenticated dashboard |
| signIn | email, password | Session cookies and dashboard, or generic failure |
| signOut | current session | End current session and return to login |
| GET /auth/confirm | one-time email token_hash | Confirm signup and redirect to dashboard, or HTTP 400 |

Profiles expose only their owner's record. The authenticated role can update
display_name. Email follows Auth. Account activities and KYC records are readable
only by their owner; clients cannot issue KYC decisions or assign staff privileges.
