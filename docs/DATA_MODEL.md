# DATA_MODEL — modèle de données cible

**Propriétaire :** Backend · **Statut :** v1 (stabilisé le 2026-11-06), **non implémentée**
**Source de vérité actuelle du prototype :** `lib/types/domain.ts` et `lib/types/marketplace.ts`

> Ce document décrit ce que le serveur **devra** stocker. Aujourd'hui, rien n'est persisté : les
> données vivent en mémoire dans `lib/data/demo/` et sont servies par `lib/api/catalog.ts`.
> L'écart entre ce modèle et le prototype est listé au §6 — c'est la liste de travail du backend.

---

## 1. Conventions

| Sujet | Règle proposée | État |
| --- | --- | --- |
| Identifiants | UUID (`v4` ou `v7` — à trancher), jamais d'entier auto-incrémenté exposé | proposé |
| Horodatage | ISO 8601 UTC, champs `createdAt` / `updatedAt` partout | proposé |
| Montants | Entier en **cents** + devise explicite | proposé — divergence avec le prototype, voir §6 |
| Suppression | Suppression logique (`deletedAt`), jamais de `DELETE` physique sur les objets payés | proposé |
| Nommage | `snake_case` en base, `camelCase` en JSON | proposé |
| Slugs | Uniques, immuables après publication (une redirection si changement) | proposé |

## 2. Entités

| Entité | Rôle | Existe dans le prototype |
| --- | --- | --- |
| `Account` | Utilisateur, activités, plan | `DemoAccount` |
| `Stud` | Étalon public + données privées du propriétaire | `Stud` |
| `Dam` | Femelle, calendrier privé | `DamSummary` |
| `Litter` / `Puppy` | Portée et chiots individuels | `Litter`, `Puppy` |
| `Request` | Demande de saillie | `DemoRequest` |
| `Contract` | Contrat de saillie | page seulement |
| `Payment` / `Payout` | Débit et reversement | absents |
| `Document` | Pièce justificative privée | statut seulement |
| `Professional` | Service professionnel | `Professional` |
| `Club` / `Event` | Clubs et événements | `Club`, `Event` |
| `Sponsor` | Inventaire et campagne | données fictives |
| `Review` | Avis | `StudReview` |
| `Favorite` | Favoris | `localStorage` |
| `Article` / `Breed` | Contenu éditorial | `lib/data/demo` |

## 3. Détail des entités

### 3.1 `Account`

| Champ | Type | Contrainte | Visibilité |
| --- | --- | --- | --- |
| `id` | uuid | PK | privé |
| `email` | string | unique, vérifié, jamais public | privé |
| `displayName` | string | 2–60 caractères | public si profil publié |
| `activities` | enum[] | au moins une à l'inscription | privé |
| `plan` | objet | `tier`, `status`, `renewsOn` | privé |
| `location` | `PublicLocation` | arrondie | public (arrondie) |
| `profileCompletion` | int | 0–100, calculé | privé |
| `memberSince` | date | immuable | public |

Règle : l'e-mail n'apparaît dans **aucune** réponse publique, y compris dans une fiche d'étalon.

### 3.2 `Stud`

Reprend `Stud` de `domain.ts`. Points structurants :

- `location` est un `PublicLocation` : ville, code d'État, coordonnées **arrondies**, précision
  `approximate`. Aucune adresse de rue, aucun ZIP.
- `akc`, `brucellosis` et `clubRecommendation` sont **trois objets séparés** : jamais fusionnés en un
  badge « vérifié ».
- `brucellosis.documentStatus` (`on_file` / `missing`) remplace toute URL de document.
- `featured` est du placement payant : il ne doit jamais influencer un tri présenté comme un
  classement de qualité.
- `studFeeUsd` devient `studFee` + `currency` + `priceStatus` (`confirmed` / `pending`).

### 3.3 `Dam`

- `visibility` : `private` par défaut. Une femelle n'est jamais publique sans action explicite.
- `heatHistory`, `matings` et le calendrier sont privés par défaut, accessibles au propriétaire et,
  sur autorisation, au propriétaire de l'étalon concerné.

### 3.4 `Litter` et `Puppy`

- `Puppy.status` : `available` · `reservation_pending` · `reserved` · `sold`.
- `reservationRef` est une **référence de réservation**, jamais une identité d'acheteur.
- `totalUsd` doit être calculé par le serveur ; le client ne fournit jamais un montant.
- `readyDate` = date de naissance + fenêtre de disponibilité **configurable**. La règle « 8
  semaines » n'est pas une vérité universelle (`O-20`).

### 3.5 `Request` — le point le plus structurant

Le prototype n'a qu'un `status`. Le modèle cible en a **quatre**, indépendants :

| Champ | Valeurs | Qui écrit |
| --- | --- | --- |
| `paymentStatus` | `not_required` · `requires_payment` · `processing` · `paid` · `failed` · `refunded` | prestataire de paiement (webhook) |
| `acceptanceStatus` | `pending` · `accepted` · `declined` · `expired` | propriétaire de l'étalon |
| `contractStatus` | `none` · `draft` · `sent` · `signed` · `void` | les deux parties |
| `contactUnlockedAt` | date null | serveur, uniquement après `paymentStatus = paid` |

**Règle non négociable :** `contactUnlockedAt` ne peut pas être écrit par le client. Une redirection
de paiement n'est pas une preuve ; seul un webhook vérifié l'autorise.

### 3.6 `Payment` / `Payout`

- `Payment` : `id`, `requestId`, `amountCents`, `currency`, `status`, `provider`, `providerRef`,
  `idempotencyKey`, horodatages.
- `Payout` : séparé du paiement. Séquestre et délai de reversement sont des décisions ouvertes
  (`O-04`) : le modèle doit pouvoir les représenter, il ne les invente pas.
- Aucun montant en virgule flottante.

### 3.7 `Document`

| Champ | Type | Visibilité |
| --- | --- | --- |
| `id` | uuid | privé |
| `ownerId` | uuid | privé |
| `type` | `akc` · `brucellosis` · `health` · `club` · `contract` | privé |
| `reviewStatus` | `not_submitted` · `in_review` · `approved` · `changes_requested` · `expired` | statut public, fichier privé |
| `storageKey` | string | privé — jamais exposé |
| URL d'accès | signée, courte durée, à la demande | propriétaire / admin uniquement |

### 3.8 `Professional`

- `address` est une **adresse professionnelle** (rue, ZIP, coordonnées). Sa publication publique est
  une décision ouverte (`O-29`) : le modèle la stocke, la politique d'exposition reste à trancher.
- `emergencyDeclared` est une déclaration du professionnel. Elle ne devient jamais « ouvert 24/7 ».
- `verification` : `documents_reviewed` · `in_review` · `not_submitted`.

### 3.9 `Event`

- `startsAt` en UTC + `timeZone` IANA + `timeZoneLabel`. L'affichage local est calculé, jamais stocké
  en double.
- `capacity` et `ticketsSold` sont autoritaires côté serveur ; le client ne les modifie pas.

## 4. Relations

```text
Account 1 ── N Stud
Account 1 ── N Dam
Account 1 ── N Litter ── N Puppy
Account 1 ── N Request ── 1 Stud
                       └─ 1 Dam (optionnel)
Request 1 ── 0..1 Contract
Request 1 ── 0..N Payment
Request 1 ── 0..N Payout
Stud    N ── N Document (via owner)
Club    1 ── N Event
Club    N ── N Stud          (recommandation)
Professional N ── N Club     (recommandation)
Sponsor N ── N Event / Account
```

## 5. Enums et statuts

| Enum | Valeurs |
| --- | --- |
| `Activity` | `stud_owner` · `dam_owner` · `breeder` · `buyer` · `professional` · `club_manager` · `sponsor` |
| `StudPlan` | `basic` · `premium` · `founder_trial` |
| `SubscriptionStatus` | `active` · `past_due` · `canceled` · `not_selected` |
| `RecordReviewStatus` | `not_submitted` · `in_review` · `approved` · `changes_requested` · `expired` |
| `BrucellosisStatus` | `current` · `expired` · `missing` |
| `LitterStatus` | `available` · `sold_out` · `expired` · `cancelled` |
| `PuppyStatus` | `available` · `reservation_pending` · `reserved` · `sold` |
| `EventStatus` | `on_sale` · `sold_out` · `past` |
| `ProfessionalCategory` | `emergency_vet` · `vet` · `shelter_rescue` · `trainer` · `groomer` · `boarding_pet_sitter` · `pet_store` |

## 6. Divergences prototype → cible

C'est la liste de travail concrète du backend. Chaque ligne est une raison pour laquelle le
prototype n'est pas branchable tel quel. La colonne **Bloqué par** référence une décision ouverte
(`O-nn`) ou une infrastructure non décidée : ce document ne tranche rien, il marque seulement ce qui
dépend d'ailleurs.

| # | Prototype | Problème | Cible | Bloqué par |
| --- | --- | --- | --- | --- |
| 1 | `DemoRequest.status` unique (5 valeurs) | Fusionne paiement, acceptation et déblocage de contact | 4 champs serveur : `paymentStatus`, `acceptanceStatus`, `contractStatus`, `contactUnlockedAt` (§3.5) | `O-01`, `O-04` |
| 2 | `studFeeUsd: number` en dollars entiers | Pas de devise, pas de statut de prix, unité implicite | `studFee` en cents + `currency: "USD"` + `priceStatus` (`confirmed` / `pending`) | `O-06` (montants pro) |
| 3 | `totalUsd` calculé côté client (`Litter`) | Le client fournit un montant, jamais autoritaire | Montants calculés par le serveur ; le client n'envoie jamais de prix | `O-01` |
| 4 | `DemoPhoto` (id, tone, variant, alt) | Aucun stockage ni URL | `MediaAsset` : URL signée courte durée, dimensions, alt | infra stockage (non décidée) |
| 5 | `PublicLocation.precision: "approximate"` seul | Ne dit pas *comment* arrondir | Bucket géographique explicite (~5 km) + précision | — |
| 6 | `Professional.planStatus: "pricing_pending"` | Un statut n'est pas un abonnement | Entité `Subscription` (tier, statut, renouvellement) | `O-06` |
| 7 | `ComparatorEntry.sampleRating` | Note fictive présentée comme une évaluation | Retiré, ou `ratingStatus: "unverified"` explicite | `O-30` |
| 8 | `isDemo` implicite | Risque de fuite démo/prod | Champ explicite `dataMode` + base d'environnement séparée | — |

## 7. Ce qui n'est pas modélisé

Volontairement absent, à traiter dans une tranche ultérieure : messages, notifications, e-mails,
remboursements, litiges, file de modération, journal d'audit, index de recherche, analytique,
facturation fiscale.

## 8. Questions ouvertes pour ce modèle

Aucune valeur ni politique n'est choisie ici : ces questions bloquent des **formes** (§3.5, §6),
pas la lecture du document.

- `O-01` / `O-19` — modèle de paiement de portée et unité de réservation.
- `O-12` / `O-20` — seuils de disponibilité : valeurs par défaut et qui les configure.
- `O-23` — fournisseur d'authentification et forme de la session.
- `O-29` — exposition publique de l'adresse professionnelle.
- `O-30` — comparateurs : origine des prix et des notes.

---

## Journal

## Passation — Backend — 2026-11-06

- État : `T-002` en cours — `DATA_MODEL.md` et `API_CONTRACT.md` passés en v1 ; interface
  `CatalogRepository` figée ; les 8 divergences du §6 sont précisées avec une colonne « Bloqué par ».
- Fait : figé les 6 méthodes de `CatalogRepository` avec leur correspondance d'endpoints ;
  marqué les dépendances `O-01` / `O-04` / `O-06` / `O-19` / `O-23` / `O-30` sans trancher aucune.
- Bloqué : `O-23` (auth/session), `O-01`/`O-19` (paiement de portée + unité de réservation),
  `O-04` (séquestre/reversement) — aucun choix n'est inventé ici.
- Décision : aucune à trancher par le Backend ; la balle est au Pilotage (`B-1`, `B-2`, `B-3`, `B-7`).
- Suivant : à la réception des décisions, dériver les schémas requête/réponse de chaque endpoint
  (API_CONTRACT §3) puis figer la liste des changements à reporter sur `CatalogRepository` (frontend).
