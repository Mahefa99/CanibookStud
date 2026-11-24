# AGENTS — protocole de travail multi-rôles

**Mission :** CanibookStud, marketplace US (studs, portées, services professionnels).
**Instance :** ce dépôt, branche `feat/frontend-foundation`.

---

## 0. Le principe

Une discussion DSH ne voit pas l'historique d'une autre discussion. Le dépôt est donc le **seul canal**
entre les rôles : ce qui n'est pas écrit dans un fichier n'existe pas pour les autres.

C'est la raison d'être des documents de ce dépôt. Ils ne sont pas de la documentation décorative :
ce sont la mémoire et la sortie de chaque rôle. Une information qui doit circuler finit dans un
fichier, avec un identifiant (`D-nnn`, `T-nnn`, `R-nnn`).

Corollaire : « je l'ai dit dans l'autre discussion » n'est pas une réponse acceptable.

---

## 1. Ouvrir une discussion de rôle

Premier message à coller, en remplaçant `<role>` par le nom de fichier dans `agents/` :

> Lis `AGENTS.md`, puis `agents/<role>.md`, puis `docs/TASKS.md` et les documents listés dans ton
> rôle. Avant toute modification, réponds en 5 lignes : ta compréhension de la mission, les tâches
> qui te concernent, ce qui te manque pour commencer.

N'ouvrir que les discussions utiles. Une discussion ouverte « au cas où » se désynchronise et coûte
plus qu'elle ne rapporte.

---

## 2. Les rôles

| Rôle | Prompt | Documents maintenus | Ne touche pas à |
| --- | --- | --- | --- |
| Pilotage (hub) | [agents/pilotage.md](agents/pilotage.md) | [docs/PROJECT.md](docs/PROJECT.md), [docs/DECISIONS.md](docs/DECISIONS.md), [docs/TASKS.md](docs/TASKS.md) | le code |
| Analyse et conception | [agents/analyse.md](agents/analyse.md) | `PROJECT.md` §7 (règles), `DECISIONS.md` (propositions) | l'implémentation |
| Frontend et design | [agents/frontend.md](agents/frontend.md) | [DESIGN.md](DESIGN.md) | le modèle de données |
| Backend et données | [agents/backend.md](agents/backend.md) | [docs/DATA_MODEL.md](docs/DATA_MODEL.md), [docs/API_CONTRACT.md](docs/API_CONTRACT.md) | les écrans |
| Testeur | [agents/testeur.md](agents/testeur.md) | [docs/TESTS.md](docs/TESTS.md) | le code produit |
| Relecteur | [agents/relecteur.md](agents/relecteur.md) | [docs/REVIEW.md](docs/REVIEW.md) | le code (il constate, il ne réécrit pas) |
| Mise en ligne | [agents/mise-en-ligne.md](agents/mise-en-ligne.md) | [docs/DEPLOY.md](docs/DEPLOY.md) | la configuration produit |

---

## 3. Règles

1. **Lecture avant action.** Aucune modification avant d'avoir lu son prompt de rôle, `TASKS.md` et
   les documents qu'il référence. Si un document manque, le signaler — ne pas l'inventer.
2. **Un propriétaire par document.** Un rôle n'écrit que dans ses documents. Personne d'autre ne
   modifie un document dont il n'est pas propriétaire : il ouvre un constat dans `REVIEW.md` ou une
   proposition dans `DECISIONS.md`.
3. **`TASKS.md` : on ajoute, on ne réordonne pas.** Tout rôle peut ajouter une ligne `T-nnn` en fin de
   tableau. Seul le Pilotage change les priorités, les propriétaires et les statuts.
4. **Toute décision a un identifiant.** Une décision non écrite dans `DECISIONS.md` n'existe pas.
   Pas de décision implicite, pas de « on avait dit ».
5. **Aucun fait inventé.** Pas de prix non confirmé présenté comme un tarif, pas de badge
   « vérifié » sans règle, pas de politique légale présentée comme définitive, pas de logo ou de
   chiffre de sponsor fictif présenté comme réel. C'est la règle produit la plus importante du projet.
6. **Une session finit par une passation** (§4). Sans passation, la tâche n'est pas terminée.
7. **Git.** Une branche par sujet (`feat/<role>-<sujet>`), messages de commit au format existant
   (`feat(frontend): …`). Aucun push sans validation du Pilotage.

---

## 4. Format de passation

À écrire à la fin de la section « Journal » du document du rôle, et à résumer en une ligne dans
`TASKS.md` si la suite change :

```md
## Passation — <rôle> — AAAA-MM-JJ

- État :        où on en est, en une phrase
- Fait :        ce qui est terminé et vérifié (avec la commande ou le fichier)
- Bloqué :      ce qui empêche d'avancer, et pourquoi
- Décision :    D-nnn / O-nn à trancher, ou « aucune »
- Suivant :     la prochaine action concrète, à l'impératif
```

Le champ « Suivant » est obligatoire. Une passation sans prochaine action est un échec de passation.

---

## 5. Cycle d'une tâche

```text
Pilotage              Rôle concerné              Relecteur          Mise en ligne
   │                        │                        │                    │
   ├─ T-nnn dans TASKS ────▶│                        │                    │
   │                        ├─ travail + docs        │                    │
   │                        ├─ passation ───────────▶│                    │
   │◀─ repriorisation ──────┤                        ├─ R-nnn dans REVIEW │
   │                        │◀── correction ─────────┤                    │
   │                        │                        ├─ GO ──────────────▶│
   │◀────────────────────── déploiement documenté ──────────────────────┤
```

---

## 6. Sous-agents et workflows

- **Sous-agent** : tâche bornée, jetable, lancée depuis une discussion de rôle. Le sous-agent ne voit
  pas la discussion : lui coller les extraits de documents nécessaires, jamais « lis le dépôt ».
  Utiliser quand la tâche tient en une passe et n'a pas besoin du contexte long.
- **Workflow** : N sous-agents en parallèle, pour un audit ou une migration sur beaucoup de fichiers.
  Ne pas l'utiliser pour deux ou trois tâches.
- **Règle d'or :** jamais deux agents qui écrivent le même fichier en même temps. En cas de doute,
  sérialiser.

---

## 7. Conventions

- **Langue.** Documents de pilotage et prompts de rôle : français. Documents livrables (`README.md`,
  `DESIGN.md`, `docs/API_NEEDS.md`) : anglais, comme aujourd'hui.
- **Montants.** USD, entiers, dans le prototype. Le backend doit fixer l'unité (cents recommandé) —
  voir [docs/DATA_MODEL.md](docs/DATA_MODEL.md).
- **Données.** Aucun secret, aucune donnée personnelle réelle, aucun document client committé. Les
  données de démonstration sont fictives et signalées.
- **Chemins.** Les liens relatifs entre documents sont vérifiés : un lien mort est un bug.

---

## 8. État vérifiable au 2026-11-05

| Élément | État |
| --- | --- |
| Frontend | 67 entrées de build, 105 routes en 200, 191 checks Playwright, 0 violation axe |
| Backend | absent — `lib/api/catalog.ts` est un dépôt en mémoire remplaçable |
| Authentification | absente — tableau de bord et admin en démonstration ouverte |
| Paiement | absent — boutons désactivés, aucun débit |
| Déploiement | aucun environnement déployé |
| Décisions | 32 ouvertes, dont 7 bloquantes pour la prochaine tranche |

---

## 9. Arborescence

```text
AGENTS.md                  ce protocole
agents/                    un prompt par rôle (7)
docs/
  PROJECT.md               périmètre, objectifs, contraintes      (Pilotage)
  DECISIONS.md             journal des décisions D-nnn           (Pilotage)
  TASKS.md                 backlog T-nnn                         (Pilotage)
  DECISIONS_OPEN.md        les 32 décisions non tranchées (O-nn) (hérité)
  DATA_MODEL.md            entités, champs, règles de visibilité (Backend)
  API_CONTRACT.md          conventions, endpoints, erreurs       (Backend)
  API_NEEDS.md             besoins du frontend (input Backend)   (hérité)
  TESTS.md                 suites, résultats, trous              (Testeur)
  REVIEW.md                constats R-nnn                        (Relecteur)
  DEPLOY.md                procédure de déploiement              (Mise en ligne)
  VERIFICATION.md          relevé de vérification daté           (hérité)
DESIGN.md                  référence design du frontend          (Frontend)
```
