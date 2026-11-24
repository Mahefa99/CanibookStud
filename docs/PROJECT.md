# PROJECT — périmètre et objectifs

**Propriétaire :** Pilotage · **Dernière mise à jour :** 2026-11-06
**Statut :** référence de périmètre du dépôt. Ne remplace ni le CDC client ni les décisions
(`D-nnn` / `O-nn`).

---

## 1. Le produit

CanibookStud est une marketplace américaine pour l'élevage canin. Elle réunit sur une seule place :
la recherche d'un étalon (stud), les portées (litters) et chiots, les services professionnels
(vétérinaire, toiletteur, éducation…), les clubs, les événements, et des comparateurs (alimentation,
assurance).

- Marché : États-Unis · Anglais (US) · USD
- Site public : `canibookstud.com`
- Dépôt distant identifié : `https://github.com/Mahefa99/CanibookStud` (métadonnées GitHub lues le
  2026-11-06 : public, branche par défaut `main`, taille déclarée 0 ; contenu non synchronisé ici).
- Copie locale : aucun dépôt Git détecté le 2026-11-06 (`git rev-parse --show-toplevel` échoue ;
  `.git` absent). `feat/frontend-foundation` est une branche annoncée dans les documents, pas une
  branche courante vérifiée. Rattachement et historique à traiter sous `T-036`.

## 2. Objectif de la mission en cours

Le **frontend V12 de démonstration est livré pour revue**. La prochaine tâche est `T-025` : aligner
le modèle et le contrat d'API sur cette livraison, puis préparer l'implémentation locale `T-026`
selon `D-018`. Deux exigences structurantes restent applicables :

1. **Chaque état est explicite.** Paiement en attente, échoué, confirmé, refusé, expiré, indisponible
   sont nommés — jamais fondus dans un « succès » générique.
2. **Aucun fait n'est inventé.** Un prix non confirmé n'est pas un tarif, un numéro d'AKC au bon
   format n'est pas une vérification AKC, une page légale en brouillon n'est pas une politique.

Le frontend doit pouvoir être branché sur un backend réel **sans réécrire les écrans** : c'est le rôle
de la frontière `lib/api/catalog.ts`, aujourd'hui limitée aux étalons et races. Son extension est
prévue par `T-015`/`T-026` ; les autres écrans utilisent encore des données de démonstration.

## 3. Périmètre livré (frontend)

| Domaine | État | Remarque |
| --- | --- | --- |
| Système visuel, shell responsive, navigation | Livré | Tokens, logo, en-tête/pied, menu mobile, focus |
| Accueil | Livré | Recherche, sélections, liens transverses |
| Annuaire des étalons | Livré | Filtres en URL, tri, pagination, liste + carte, états vides/chargement/erreur |
| Fiche étalon | Livré | Galerie, signaux séparés, records, disponibilités, avis, carte, sans publicité |
| Demande de saillie | Livré (démo) | Détail du prix, états bloqués, paiement désactivé, formulaire brouillon |
| Chiots et portées | Livré | États individuels, règle de disponibilité, réservation désactivée |
| Services professionnels | Livré | 7 catégories, liste + carte, vérification, contacts non inventés |
| Clubs, événements | Livré | Profils, recommandations, fuseaux horaires, billetterie en aperçu |
| Comparateurs, sponsoring | Livré (démo) | Tables fictives, actions affiliées inertes, inventaire en aperçu |
| Calendrier de chaleurs | Livré (local) | Vue privée, estimations signalées comme estimations |
| Tableau de bord | Livré (démo) | Vue d'ensemble, animaux, annonces, demandes, contrats, préférences |
| Formulaires de création | Livré (démo) | Portée, professionnel, club, événement, étalon/femelle |
| Authentification | Aperçu | Aucun compte, aucune session |
| Checkout et contrats | Aperçu | Montants affichés, aucun débit, aucun contrat signé |
| Administration | Démo ouverte | Actions désactivées, aucune automatisation |
| Pages légales | Brouillon | En attente de revue juridique |
| SEO | Aperçu | Métadonnées et sitemap présents, indexation désactivée par défaut |
| Blog V12 | Livré pour revue | 15 articles sourcés de 890 à 936 mots ; validation experte non acquise |
| GODPET | Livré (démo locale) | Noms simulés et certificat navigateur ; aucun PDF/QR/service IA réel |
| Import KYC/animaux et ADN | Livré (démo locale) | CSV et contrôles locaux ; ni KYC vérifié, ni OCR/XLSX serveur |

Les tunnels sponsors, pins professionnels gris/couleur/doré, filtres étalons et logo SVG sont
livrés en démonstration ; `T-011`/`T-019`/`T-020`/`T-021` attendent la revue. Les indicateurs sponsors
ne constituent pas des mesures réelles. La référence détaillée est la dernière passation de
[DESIGN.md §11–12](../DESIGN.md#handoff-pilotage).

## 4. Capacités absentes de la livraison frontend

Ces éléments sont **absents**, pas « presque finis » :

- paiement, webhooks, remboursements, séquestre, échéances ;
- authentification et gestion de session ;
- backend, base de données, migrations ;
- upload réel et stockage de fichiers ;
- messagerie, e-mails, notifications ;
- signature électronique de contrat ;
- toute IA (vérification AKC, modération, détection, recommandation automatique) ;
- flux affiliés et prix réels des comparateurs ;
- toute politique légale définitive.

`D-018` attribue la préparation et l'implémentation locale serveur au Backend sous `T-025` à
`T-030`, avec dépendances par module. Cela ne rend aucune de ces capacités opérationnelle et
n'autorise ni création de compte fournisseur, ni souscription, ni transaction réelle, ni publication.

## 5. Contraintes non négociables

Ces règles viennent du produit, pas des préférences d'implémentation. Elles priment sur la vitesse.

1. **Déblocage de contact confirmé côté serveur.** Une redirection de paiement n'est jamais une
   preuve. Les coordonnées ne sortent qu'après un webhook signé ou un état de paiement vérifié, dans
   une réponse authentifiée et autorisée.
2. **Aucune donnée privée en réponse publique.** Jamais d'adresse de rue, de ZIP, de coordonnées
   exactes, de téléphone, d'e-mail, d'URL de document ni d'identifiant propriétaire.
3. **Documents privés.** On expose leur statut, leur type et leurs dates ; jamais une URL publique.
   Les URL signées de courte durée sont réservées aux propriétaires et admins autorisés.
4. **Autorisation par ressource et par activité.** Être connecté ne suffit pas à modifier un étalon,
   lire une demande ou télécharger un contrat.
5. **Quatre états distincts.** Paiement, acceptation, contrat et reversement ne sont jamais un seul
   champ `status`.
6. **Tout prix porte son statut.** Un prix non confirmé ne peut pas être débité, et n'est jamais
   présenté comme un tarif.
7. **Frontière démo/production nette.** En production, aucune donnée de démonstration ne doit être
   indiscernable d'une donnée réelle.

S'y ajoute une règle produit : **trois signaux, jamais un badge** — placement payant, revue de
documents et recommandation de club restent visuellement et sémantiquement séparés.

## 6. Acteurs

| Acteur | Responsabilité | Décide de |
| --- | --- | --- |
| Client / propriétaire produit | Le périmètre commercial et les tarifs | Prix, offres, commissions |
| Pilotage | Priorités, décisions, cohérence documentaire | Ordre du backlog |
| Frontend | Écrans, design system, accessibilité | Détails d'interface |
| Backend | Modèle de données, contrat d'API, sécurité puis implémentation locale selon D-018 | Forme des données, autorisations ; aucun arbitrage commercial |
| Juridique | Conditions, confidentialité, mentions | Textes légaux |
| Éditorial | Guides de races, articles | Contenu éditorial |

## 7. Règles métier

**Réconciliation V12 par Pilotage ; validation santé/juridique sous T-024 par Analyse.** Les
décisions produit ci-dessous ne prouvent ni conformité légale ni disponibilité d'un fournisseur.
Source primaire : `source-docs/text-v2/CDC-CANIBOOKSTUD-USA-261104-DEV.txt` ; synthèse dans
[CDC_V12_DIFF.md](CDC_V12_DIFF.md). Les anciens libellés V11 ne sont plus les règles actives.

| Règle | Source | Conséquence UI | Statut |
| --- | --- | --- | --- |
| 600 $ de service + 3 000 $ chiot = 3 600 $, réservation par chiot | CDC §3/§6/§13 ; D-012 | Devis serveur et `puppyId` ; aucun débit dans la démo | décidé produit |
| Ancien partage 15 % / 5 % | CDC §3 définit le paiement acheteur ; O-02 reste à réconcilier par Analyse | Ne pas réintroduire ce partage comme règle active | question résiduelle, T-024 |
| Refus après paiement et frais déjà encaissés | O-03 ; CDC §6 | Aucun remboursement réel avant politique explicite | ouvert, T-024/T-027 |
| Chiot : libération 48 h après remise confirmée ; réclamation véto dans 72 h | CDC §6/§7/§12 ; D-014 | États séparés ; aucun reversement automatique avant arbitrage du chevauchement | délais décidés ; articulation ouverte D-020 |
| Saillie : dépôt 400 $, solde 1 600 $, service 300 $ ; reversement après confirmation de saillie | CDC §3/§6 ; configuration V12 | Ne pas appliquer le délai chiot aux saillies ; paiement/accord/signature/remise/reversement distincts | règle source à formaliser par T-025 |
| Une seconde chance sous 6 mois, preuve véto et conditions d'éligibilité | CDC §6 ; D-014 | Ne pas transformer une mention de contrat en garantie absolue | principe décidé ; revue T-024 |
| Pros : 0 / 69 $ mensuel / 199 $ annuel ; Boost +49 $ mensuel | CDC §3/§10 ; D-013 | Gratuit inactif, contact verrouillé ; statut abonnement distinct du contrôle des documents | décidé produit |
| Brucellose négative <14 jours | CDC §6 ; D-015 | Règle plateforme, jamais présentée comme loi ; frontière temporelle exacte à préciser | principe décidé ; revue T-024 |
| Chiot : âge de remise ≥56 jours | CDC §6 ; O-20 | Règle produit configurable ; conformité par État à faire vérifier | revue santé/légal T-024 |
| Founder : 90 jours | CDC §3 ; O-11, D-021 | Offre désactivée tant que quotas/éligibilité ne sont pas décidés | partiellement décidé |
| « Vérifié », panels ADN, résultat clinique/génétique | O-13/O-14 ; CDC §4/§5/§10 | Paiement, revue documentaire et recommandation restent séparés | revue T-024 |
| Publicité absente des fiches animales et professionnelles | CDC §2 ; D-016 | Refus serveur et UI ; inventaire commercial distinct | décidé produit |
| Supabase Auth et Stripe Connect | CDC §1/§12 ; D-017 | Auth/permissions à implémenter ; aucun compte ni paiement réel aujourd'hui | choix décidé, capacité absente |
| Livraison facultative via transporteur agréé | CDC §2.6/§7 | Pick-up par défaut ; livraison désactivée avant liste et prix admin approuvés | règle source ; activation bloquée |

Règles de méthode : une règle sans source citée est `non vérifiée` ; deux sources opposées donnent
`contradictoire` et une décision ouverte — jamais un choix silencieux.

## 8. État vérifiable

Dernière exécution rapportée par le Frontend le 2026-11-06 dans
[DESIGN.md §11](../DESIGN.md#11-journal--frontend), comparée aux JSON existants durant T-023.
**Aucune suite produit n'a été relancée par le Pilotage.** Le relevé
[VERIFICATION.md](VERIFICATION.md) du 2026-11-04 et la passation Testeur à 191 contrôles sont historiques.

| Élément | Valeur |
| --- | --- |
| Typecheck et build | Dernière passation : 0 erreur, build exit 0, 119 pages générées |
| Smoke test HTTP | 105 routes, 0 non-200 |
| Checks Playwright | 6 suites : 50 + 49 + 50 + 42 + 23 + 52 = 266 ; 0 échec final rapporté |
| axe-core | 0 violation sur les scans exécutés de la dernière passe ; aucune certification globale |
| Articles | JSON éditorial : 15 articles, 890–936 mots ; sources présentes, revue experte non acquise |
| Navigateurs et accessibilité | Chromium ; Firefox/Safari, lecteur d'écran et zoom natif non testés ; 200 % CSS seulement |

Preuves : [résultats de finition](../artifacts/frontend-finish/results.json),
[mesures éditoriales](../artifacts/frontend-finish/editorial.json). Réception indépendante à produire
dans `TESTS.md` sous `T-031`, puis verdict distinct démo/production dans `REVIEW.md` sous `T-032`.

## 9. Risques connus

1. **La livraison frontend n'est pas une marketplace opérationnelle.** Paiement, contrats et
   contacts réels dépendent de `T-026` à `T-030`, puis du branchement `T-034`.
2. **Les sept anciens blocages sont réconciliés dans DECISIONS §3.** T-025 peut démarrer ; les
   arbitrages résiduels bloquent seulement les modules concernés, notamment le reversement 48 h/72 h.
3. **Risque réputationnel sur les badges.** Un badge « vérifié » mal placé transforme une promesse
   commerciale en allégation de santé animale.
4. **Risque juridique.** Les pages légales sont des brouillons ; rien ne doit être publié en l'état.
5. **Risque de dérive documentaire.** Trois documents hérités (`README`, `API_NEEDS`,
   `DECISIONS_OPEN`) peuvent diverger du code ; c'est un constat de revue récurrent.

## 10. Documents liés

- [DECISIONS.md](DECISIONS.md) — journal des décisions
- [TASKS.md](TASKS.md) — backlog
- [DATA_MODEL.md](DATA_MODEL.md), [API_CONTRACT.md](API_CONTRACT.md) — modèle et contrat
- [TESTS.md](TESTS.md), [REVIEW.md](REVIEW.md), [DEPLOY.md](DEPLOY.md) — qualité et mise en ligne
- [../README.md](../README.md), [../DESIGN.md](../DESIGN.md) — livrables frontend

## 11. Journal

## Passation — Pilotage — 2026-11-06

- État : réconciliation documentaire de `T-023` effectuée ; `T-025` est prêt, le frontend livré
  reste en revue et la production n'est pas autorisée.
- Fait : lecture des passations Frontend/Backend/Testeur et du journal Relecteur ; décisions V12
  reportées en §7 ; JSON de finition/éditorial lus, sans nouvelle exécution produit. Contrôle local
  `git rev-parse --show-toplevel` : aucun dépôt ; métadonnées GitHub du dépôt distant confirmées
  en lecture seule par le coordinateur. Statuts et dépendances réconciliés dans `TASKS.md`.
- Bloqué : rattachement/historique Git (`T-036`), médias et marque approuvés (`T-037`), tuiles et
  géocodage production (`T-012`), quotas Founder et articulation 48 h/72 h ; aucun de ces points
  n'empêche la conception `T-025`. Aucun service externe n'est provisionné.
- Décision : `D-018` coordination et périmètre local Backend ; `D-019` carte de prévisualisation ;
  `D-020` à `D-024` suivent les arbitrages et vérifications restants sans inventer d'accord client.
- Suivant : Backend, exécute `T-025` en traduisant V12 en requêtes/réponses, autorisations,
  erreurs et exemples ; laisse les politiques non arbitrées explicites et prépare `T-026`.
