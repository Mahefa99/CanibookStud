# DECISIONS — journal des décisions

**Propriétaire :** Pilotage · **Statut :** journal unique des décisions du projet

> **Règle d'or :** une décision qui n'est pas écrite ici n'existe pas. Pas de décision implicite, pas
> de « on avait dit ». Une décision a un identifiant, une date, un statut et une conséquence.

---

## 1. Format

| ID | Date | Décision | Statut | Conséquence | Décidé par | Docs impactés |
| --- | --- | --- | --- | --- | --- | --- |

Statuts autorisés :

- `proposée` — écrite par un rôle, pas encore arbitrée ;
- `validée` — arbitrée par la personne indiquée dans « Décidé par » ;
- `provisoire (frontend)` — choix d'implémentation réversible, visible pour revue ;
- `abandonnée` — écartée, avec la raison.

Toute décision `proposée` qui touche un prix, un engagement client ou une règle légale reste
`proposée` jusqu'à validation explicite du client. Le Pilotage ne peut pas s'auto-valider.

---

## 2. Décisions prises

### 2.1 Choix d'implémentation provisoires (réversibles)

Ces choix structurent le code actuel. Ils sont réversibles et n'engagent ni le client ni le juridique.

| ID | Date | Décision | Statut | Conséquence | Docs impactés |
| --- | --- | --- | --- | --- | --- |
| D-001 | 2026-11-04 | Next.js 15 App Router + TypeScript strict + Tailwind 3.4 | provisoire (frontend) | Toute page doit passer `tsc --noEmit` | README |
| D-002 | 2026-11-04 | Dépôt en mémoire derrière `CatalogRepository` (`lib/api/catalog.ts`) | provisoire (frontend) | Aucun écran n'appelle une API directement | API_NEEDS |
| D-003 | 2026-11-04 | Carte schématique depuis la géométrie US Atlas, pas de tuiles tierces | abandonnée | Remplacée par D-019 : Leaflet et géométrie locale, toujours sans fournisseur de tuiles | DESIGN |
| D-004 | 2026-11-04 | Portraits illustratifs au lieu de photographies | provisoire (frontend) | Aucune photo réelle n'est revendiquée | DESIGN |
| D-005 | 2026-11-04 | Fraunces + Inter ; palette navy `#002B58` / orange `#FF6E01` / crème | provisoire (frontend) | Tokens dans `tailwind.config.ts` | DESIGN |
| D-006 | 2026-11-04 | Pagination à 6 cartes, tri `featured` par défaut, libellé « placement payant » | provisoire (frontend) | `featured` n'est jamais présenté comme une qualité | DESIGN |
| D-007 | 2026-11-04 | Brouillons et favoris en `localStorage`, pas de persistance serveur | provisoire (frontend) | Les brouillons disparaissent hors du navigateur | README |
| D-008 | 2026-11-04 | Tout prix non confirmé est « Pricing to be confirmed » ou masqué | provisoire (frontend) | Aucun total n'est calculé sur un prix `pending` | DESIGN, PROJECT §5 |

### 2.2 Décisions de méthode

| ID | Date | Décision | Statut | Conséquence | Décidé par |
| --- | --- | --- | --- | --- | --- |
| D-009 | 2026-11-05 | Protocole multi-rôles dans `AGENTS.md` : 7 rôles, un propriétaire par document | validée | Tout travail passe par une discussion de rôle | Client |
| D-010 | 2026-11-05 | Langue : français pour le pilotage, anglais pour les livrables | validée | `AGENTS.md`, `agents/`, `docs/` en français ; `README`, `DESIGN`, `API_NEEDS` en anglais | Pilotage |
| D-011 | 2026-11-05 | `DECISIONS_OPEN.md` reste la liste héritée des `O-nn` ; une ligne tranchée migre ici | validée | Migration non achevée : D-012 à D-017 et §3 priment sur les lignes V11 ; nettoyage suivi par T-038, sans rouvrir les choix | Pilotage |

---

## 3. Décisions en attente d'arbitrage

Les 32 références historiques `O-01` à `O-32` restent dans
[DECISIONS_OPEN.md](DECISIONS_OPEN.md). **Ce nombre n'est plus un décompte de décisions ouvertes.**
Réconciliation au 2026-11-06 : les décisions V12 ci-dessous priment sur les formulations V11.
`T-025` peut avancer sans les arbitrages résiduels ; ceux-ci bloquent les modules indiqués.

| Bloquant | Question à trancher | Qui décide | Décisions ouvertes |
| --- | --- | --- | --- |
| B-1 | Résolu par D-012 : collecte 3 600 $, réservation par chiot ; retirer les anciennes dépendances de conception | Backend applique | `O-01`, `O-19` → T-025 |
| B-2 | Résolu par D-013 : 0/69/199/49 et gratuit inactif/contact verrouillé | Backend applique | `O-06`, `O-07` → T-025 |
| B-3 | D-014 fixe 48 h/72 h et seconde chance ; refus après paiement et chevauchement restent à formaliser, voir D-020 | Client + juridique, Analyse propose | `O-03`, `O-04` partiel, `O-05` → T-024/T-027 |
| B-4 | 90 jours confirmé ; quels quotas, bénéficiaires, date de départ et sortie de l'essai ? D-021 | Client | `O-11` partiel ; seule activation Founder bloquée |
| B-5 | D-015 fixe une règle plateforme ; libellés, fraîcheur exacte et adéquation santé/légal à revoir | Analyse + expert | `O-12` partiel → T-024/T-029 |
| B-6 | D-016 interdit la pub sur fiches animaux/pros ; inventaire et concurrence serveur à définir selon CDC §11 | Backend, Client pour ambiguïtés | `O-10` résolu ; `O-16` technique → T-025/T-028 |
| B-7 | D-017 fixe Supabase Auth/Stripe Connect ; matrice des permissions et session restent une conception Backend | Backend | `O-23`, `O-26` partiels → T-025/T-026 |

Les écrans restent démonstratifs parce que les services serveur sont absents. Les choix déjà
confirmés ne doivent plus être utilisés comme blocages généraux. Les autres `O-nn` restent des
questions à instruire dans leur domaine ; aucune validation commerciale/légale supplémentaire
n'est déduite de cette réconciliation. `T-024`, `T-025`, `T-038` réconcilieront les détails hérités.

### 3.1 Résolues par le CDC V12 (reçu 2026-11-06)

Le CDC V12 (`source-docs/text-v2/`) tranche la plupart des blocages. Détail vérifié dans
[CDC_V12_DIFF.md](CDC_V12_DIFF.md).

| Bloquant | Réponse V12 | Décision |
| --- | --- | --- |
| B-1 | 600 $ service + 3 000 $ chiot = 3 600 $ total via Stripe ; réservation au niveau du chiot (`puppyId`) | `D-012` |
| B-2 | Pros : 0 $ Gratuit (invisible, numéro cadenassé) / 69 $/mois Standard / 199 $/an Premium / Boost +49 $/mois | `D-013` |
| B-3 | Escrow Stripe : déblocage 48 h après pick-up/livraison, remboursement si réclamation véto 72 h ; 2e chance = 1 seule gratuite | `D-014` |
| B-5 | Brucellose < 14 j = règle de la plateforme (blocage) | `D-015` |
| B-6 | Publicité interdite sur fiches animaux **et** fiches pro (détail) ; autorisée listes/blog/comparateurs/accueil | `D-016` |
| B-7 | Auth = Supabase Auth + Stripe Connect ; rôles admin listés au CDC §12 | `D-017` |
| B-4 | Founder 90 jours confirmé, quotas « à configurer » → reste partiellement ouvert | `O-11` (partiel) |

Les décisions `D-012` à `D-017` sont consignées en §2.3 ci-dessous.

---

## 2.3 Décisions produit validées par CDC V12

| ID | Date | Décision | Statut | Conséquence | Docs impactés |
| --- | --- | --- | --- | --- | --- |
| D-012 | 2026-11-06 | Paiement chiot : 600 $ service + 3 000 $ chiot = 3 600 $, réservation par chiot | validée (CDC V12) | `PUPPY_PRICING`, `reservations.puppyId` | pricing, DATA_MODEL |
| D-013 | 2026-11-06 | Pros : 0 / 69 $ mensuel / 199 $ annuel / Boost 49 $ mensuel | validée (CDC V12) | `PROFESSIONAL_PRICING` confirmé | pricing |
| D-014 | 2026-11-06 | Escrow : déblocage 48 h après pick-up/livraison ; remboursement si réclamation véto 72 h ; 2e chance unique | validée (CDC V12) | `reservations.escrowReleaseAt` | pricing, DATA_MODEL |
| D-015 | 2026-11-06 | Brucellose < 14 j = règle plateforme (blocage) | validée (CDC V12) | règle de listing | PROJECT, DATA_MODEL |
| D-016 | 2026-11-06 | Pub interdite sur fiches animaux et fiches pro ; autorisée listes/blog/comparateurs/accueil | validée (CDC V12) | `AD_POLICY` | features |
| D-017 | 2026-11-06 | Auth Supabase + Stripe Connect ; rôles admin du CDC §12 | validée (CDC V12) | modèle auth | API_CONTRACT, DATA_MODEL |

---

## 4. Trancher une décision

1. Reformuler la question en une phrase, sans option implicite.
2. Obtenir la réponse de la personne indiquée dans « Qui décide ».
3. Créer `D-nnn` ici : date, décision, statut `validée`, conséquence, documents impactés.
4. Supprimer ou barrer la ligne `O-nn` correspondante dans `DECISIONS_OPEN.md`.
5. Mettre à jour les documents impactés et créer les tâches `T-nnn` nécessaires.

Une décision qui contredit un document existant doit citer le document à corriger. Sinon la décision
ne sera pas appliquée.

## 5. Journal — réconciliation Pilotage du 2026-11-06

### D-018 — suite locale et propriété des travaux

- Statut : **validée (coordination Pilotage)**, 2026-11-06.
- Source : demande utilisateur « ok lance le suivant » après la passation frontend finale ;
  [DESIGN.md §12](../DESIGN.md#handoff-backend), tâches T-023 à T-030.
- Décision : lancer T-025 dans le périmètre de conception existant. Attribuer au Backend la
  préparation puis l'implémentation locale de T-026 à T-030, module par module après contrat et
  dépendances propres satisfaits. Cette attribution précise la restriction « ne construit pas
  encore de serveur » de `agents/backend.md` ; elle ne permet pas de modifier les écrans.
- Limites : aucune création de compte fournisseur, dépense, transaction réelle, collecte de
  pièces d'identité réelles, publication ou push n'est autorisée par cette décision. Les accès
  absents sont des dépendances explicites ; la conception et les tests locaux peuvent avancer.
- Documentation héritée : Pilotage prend en charge le nettoyage `DECISIONS_OPEN.md` sous T-038 ;
  Frontend maintient `API_NEEDS.md` sous T-039. Aucun de ces fichiers n'est modifié dans T-023.
- Conséquence : PROJECT/TASKS actualisés ; T-025 n'attend plus les choix V11 résolus. T-026 attend
  le contrat T-025, pas une nouvelle confirmation routinière de son propriétaire.

### D-019 — carte actuelle de prévisualisation

- Statut : **provisoire (frontend)**, constat du 2026-11-06 ; remplace D-003.
- Source : passation finale DESIGN §11 et `components/domain/interactive-map.tsx`.
- Décision : reconnaître Leaflet avec géométrie locale US Atlas, zoom/déplacement et positions
  approximatives comme solution de démonstration. Aucun fournisseur de tuiles/géocodage n'est choisi.
- Conséquence : D-022/O-24 reste ouvert pour la production, sans bloquer T-025.

### D-020 — articulation des réclamations et reversements

- Statut : **proposée — arbitrage requis**, 2026-11-06 ; O-03/O-04/O-05, T-024/T-027.
- Source exacte : `source-docs/text-v2/CDC-CANIBOOKSTUD-USA-261104-DEV.txt` §6, §7 et §12
  (lignes 63, 73 et 108) ; D-014 conserve les délais 48 h/72 h.
- Question au Client/juridique : que doit faire le serveur si une réclamation recevable arrive
  entre la libération à 48 h et la fin de la fenêtre de 72 h ; qui finance et autorise le
  remboursement/remplacement ? Quel traitement pour un refus après paiement et des frais encaissés ?
- Suivant : Analyse, propose la machine d'états et la politique avec sources ; Backend, représente
  ce blocage explicitement sans choisir un délai différent ni automatiser un reversement.

### D-021 — activation Founder

- Statut : **proposée — arbitrage requis**, 2026-11-06 ; O-11.
- Source exacte : CDC V12 §3, ligne 26 (« Free 90 jours … à configurer ») ;
  `lib/config/pricing.ts`, `FOUNDER_PROGRAM.enabled = false`.
- Question au Client : quels quotas, critères d'éligibilité, point de départ, échéance et plan de
  sortie appliquer ? Les 90 jours sont confirmés ; aucun quota n'est déduit.
- Suivant : Pilotage, obtenir ces paramètres ; conserver l'offre désactivée jusque-là.

### D-022 — carte de production

- Statut : **proposée — arbitrage requis**, 2026-11-06 ; O-24, T-012.
- Source exacte : CDC V12 §1/§12 nomme Leaflet mais ne fixe ni fond de plan ni géocodeur ;
  DESIGN §12, Handoff Pilotage/Backend.
- Question au Client : quels fournisseurs de tuiles et géocodage, budget, compte responsable,
  licences/attributions et règles de confidentialité autoriser ? Aucune clé n'est requise pour
  continuer la prévisualisation locale.
- Suivant : Pilotage, faire préciser ce choix ; Backend, garder un adaptateur et des limites
  de requête documentés sous T-025 sans provisionner un service.

### D-023 — état Git vérifié et remise en cohérence

- Statut : **validée (coordination Pilotage)**, 2026-11-06 ; T-036.
- Sources : `git rev-parse --show-toplevel` échoue localement et `.git` absent ;
  [contrôle distant en lecture seule](../artifacts/pilotage-git-check.json) exécuté par le coordinateur :
  dépôt `Mahefa99/CanibookStud` public, branche par défaut déclarée `main`, taille 0 ;
  `git -c http.lowSpeedLimit=1 -c http.lowSpeedTime=10 ls-remote https://github.com/Mahefa99/CanibookStud.git`
  retourne exit 0 et aucune référence.
- Décision : ne pas présenter `feat/frontend-foundation` ni le HEAD historique `4049e1b` comme
  vérifiés dans cette copie ; conserver fichiers et historique éventuel avant tout rattachement.
- Suivant : Pilotage, rechercher la copie Git d'origine ou documenter l'initialisation locale
  nécessaire, fixer la branche par sujet et les exclusions de documents client/secrets. Aucun push.

### D-024 — médias et identité finale

- Statut : **proposée — arbitrage requis**, 2026-11-06 ; O-32, T-037/T-035.
- Source : DESIGN §11 dernière passation et §12 Handoff Pilotage/Frontend.
- Question au Client : quels portraits/photos et éléments de marque sont approuvés, avec quels
  droits d'usage et crédits ? Le logo SVG livré ne constitue pas une approbation de marque.
- Suivant : Pilotage, recueillir les médias autorisés et leurs droits ; Frontend, effectuer T-035
  après réception. Conserver les illustrations clairement démonstratives en attendant.

Passation de coordination : [PROJECT.md, Journal](PROJECT.md#11-journal). Les décisions D-020,
D-021, D-022 et D-024 sont ouvertes ; aucune réponse client n'est inventée.
