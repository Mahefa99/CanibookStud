# TASKS — backlog

**Propriétaire :** Pilotage · **Dernière mise à jour :** 2026-11-06

> **Règle :** tout rôle peut ajouter une ligne `T-nnn` en fin de tableau. Seul le Pilotage change les
> priorités, les propriétaires, l'ordre et les statuts.

---

## Légende

**Priorité**

- `P0` — bloque la tranche suivante ; rien d'autre ne devrait avancer avant.
- `P1` — nécessaire pour considérer la tranche terminée.
- `P2` — utile, planifiable.
- `P3` — cosmétique.

**Statut** : `À faire` · `En cours` · `En revue` · `Bloqué` · `Fait` · `En attente`

---

## Backlog

| ID | P | Tâche | Rôle | Docs impactés | Statut | Bloqué par |
| --- | --- | --- | --- | --- | --- | --- |
| T-001 | P0 | Trancher les sept décisions bloquantes `B-1` à `B-7` | Pilotage | DECISIONS | Bloqué | Client |
| T-002 | P0 | Écrire le modèle de données cible et le contrat d'API v1 | Backend | DATA_MODEL, API_CONTRACT | Fait | — |
| T-003 | P0 | Brancher le frontend sur un backend réel (ou un serveur de test) sans réécrire les écrans | Backend + Frontend | API_CONTRACT | Bloqué | `O-23`, T-015 |
| T-004 | P1 | Revue complète du frontend livré : faits inventés, fuites de données, états fusionnés, accessibilité | Relecteur | REVIEW | À faire | — |
| T-005 | P1 | Mettre une CI : `typecheck` + `build` + suites de vérification à chaque push | Testeur | TESTS | À faire | — |
| T-006 | P1 | Documenter la procédure de déploiement, les variables et le retour arrière | Mise en ligne | DEPLOY | À faire | — |
| T-007 | P1 | Vérifier Safari et Firefox, plus un lecteur d'écran sur les parcours clés | Testeur | TESTS | À faire | — |
| T-008 | P2 | Relecture juridique des pages légales (conditions, confidentialité, non-livraison) | Analyse + Pilotage | DECISIONS | Bloqué | Client / juridique |
| T-009 | P2 | Authentification réelle et garde serveur de chaque route privée | Backend | API_CONTRACT | En attente | `O-23` |
| T-010 | P2 | Tests unitaires sur `lib/search` et `lib/utils` (filtres, tri, pagination, dates) | Testeur | TESTS | À faire | — |
| T-011 | P2 | Vectoriser le logo en SVG (le raster a un fond blanc) | Frontend | DESIGN | À faire | — |
| T-012 | P2 | Décider du fournisseur de carte et du fond de plan | Pilotage | DECISIONS | En attente | `O-24` |
| T-013 | P2 | Consolider les règles métier de `PROJECT.md` §7 avec leurs sources citées | Analyse | PROJECT | À faire | — |
| T-014 | P3 | Aligner `README.md` §Routes avec la liste réelle des routes générées | Frontend | README | À faire | — |
| T-015 | P1 | Étendre `CatalogRepository` au périmètre complet (marketplace + mutations) ; aujourd'hui limité à studs+breeds | Backend + Frontend | API_CONTRACT §7 | À faire | — |
| T-016 | P1 | Blog V12 : 15 articles + `/blog` + `/blog/[slug]` | Frontend | — | Fait | — |
| T-017 | P1 | GODPET : formulaire + certificat + tip libre | Frontend | — | Fait | — |
| T-018 | P1 | Contrats/livraison : champs livraison + copy deposit 400 escrow (supprimer split 80/320) | Frontend | pricing, checkout, contracts | Fait | — |
| T-019 | P1 | Sponsors : réservation Airbnb + tunnels + TDB sponsor/admin | Frontend | sponsors, dashboard | En cours | — |
| T-020 | P2 | Pros : points GRIS/COULEUR/DORÉ + Boost + vérif IA | Frontend | pet-services | En cours | — |
| T-021 | P2 | KYC + ADN/tares : tableau vérification + panneau ADN | Frontend | forms | En cours | — |
| T-022 | P1 | Relire la correction Frontend V12 : cartes Leaflet, confidentialité pros, abonnements, import local, sponsors et contrats ; contrôler les limites de démonstration | Relecteur | REVIEW, DESIGN | À faire | Passation Frontend du 2026-11-06 |
| T-023 | P0 | Réconcilier décisions V12, périmètre des rôles et statuts hérités ; confirmer Git, médias et fournisseur carte — [détail](../DESIGN.md#handoff-pilotage) | Pilotage | PROJECT, DECISIONS, TASKS | À faire | Passation frontend finale |
| T-024 | P1 | Valider les règles santé/légal et les 15 articles sourcés ; arbitrer 48 h/72 h et panels ADN — [détail](../DESIGN.md#handoff-analysis) | Analyse | PROJECT §7, DECISIONS (propositions) | À faire | Validation client / vétérinaire / juridique pour publication |
| T-025 | P0 | Aligner DATA_MODEL et API_CONTRACT sur V12, nouveaux filtres et erreurs frontend — [détail](../DESIGN.md#handoff-backend) | Backend | DATA_MODEL, API_CONTRACT | À faire | D-012 à D-017 ; T-023 |
| T-026 | P1 | Préparer puis implémenter auth, autorisations et repository catalogue complet ; reprise T-003/T-009/T-015 — [détail](../DESIGN.md#handoff-backend) | Backend | API_CONTRACT, DATA_MODEL | Bloqué | T-025 ; extension du rôle Backend conception vers implémentation par Pilotage |
| T-027 | P1 | Paiements, réservations chiot/saillie, contrats signés et remise/livraison : états et exécution serveur — [détail](../DESIGN.md#handoff-backend) | Backend | API_CONTRACT, DATA_MODEL | Bloqué | T-024, T-026 ; comptes fournisseurs de test |
| T-028 | P1 | Inventaire sponsor atomique, hold 15 min, propositions 7 j, remboursement et mesures réelles — [détail](../DESIGN.md#handoff-backend) | Backend | API_CONTRACT, DATA_MODEL | Bloqué | T-025, T-026, T-027 |
| T-029 | P1 | KYC propriétaire, stockage privé, import XLSX/OCR et contrôles animaux côté serveur — [détail](../DESIGN.md#handoff-backend) | Backend | API_CONTRACT, DATA_MODEL | Bloqué | T-024, T-026 ; fournisseurs et règles de conservation |
| T-030 | P2 | GODPET réel : génération, quotas, certificats publics consentis, PDF/QR et tip facultatif — [détail](../DESIGN.md#handoff-backend) | Backend | API_CONTRACT, DATA_MODEL | Bloqué | T-025, T-026 ; fournisseur et consentement |
| T-031 | P1 | Exécuter réception frontend finale, compléter navigateurs/lecteur écran et CI T-005/T-007/T-010 — [détail](../DESIGN.md#handoff-tester) | Testeur | TESTS | À faire | Build final ; CI après confirmation Git T-023 |
| T-032 | P1 | Relire la tranche finale et publier verdict GO/NO-GO distinguant démo/production — [détail](../DESIGN.md#handoff-reviewer) | Relecteur | REVIEW | À faire | T-022, T-031 ; validation éditoriale T-024 pour production |
| T-033 | P1 | Préparer déploiement reproductible, variables, noindex, vérifications et rollback — [détail](../DESIGN.md#handoff-release) | Mise en ligne | DEPLOY | À faire | Publication externe : T-023, T-032 et validation Pilotage |
| T-034 | P1 | Brancher les écrans aux contrats acceptés, couvrir erreurs/réessai/conflits/session et supprimer simulations validées — [détail](../DESIGN.md#handoff-frontend) | Frontend | DESIGN, README | Bloqué | T-025 à T-030 livrés par module |
| T-035 | P2 | Remplacer les portraits démo par des médias autorisés et valider l'identité finale — [détail](../DESIGN.md#handoff-frontend) | Frontend | DESIGN | Bloqué | Médias/licences et validation de marque via T-023 |

---

## Règles d'ajout

1. Une tâche est une action **vérifiable**, pas une intention. « Améliorer les performances » n'est
   pas une tâche ; « ramener le LCP de `/studs` sous 2,5 s » en est une.
2. Chaque tâche a un rôle propriétaire. « Équipe » n'est pas un propriétaire.
3. Un `P0` non fait interdit de déclarer la tranche terminée.
4. Une tâche `Bloqué` doit nommer ce qui la bloque : une décision `O-nn`, une tâche `T-nnn`, ou un
   acteur externe.
5. Une tâche terminée reste dans le tableau avec le statut `Fait` : l'historique fait partie du
   document.
