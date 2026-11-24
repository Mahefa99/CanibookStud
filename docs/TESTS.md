# TESTS — stratégie et registre

**Propriétaire :** Testeur · **Dernière mise à jour :** 2026-11-06

> Un test qui passe ne vaut que s'il teste la bonne chose. Ce document dit aussi ce qui **n'est pas**
> couvert — c'est la partie la plus utile.

---

## 1. Ce qui est réellement testé aujourd'hui

Jeu Playwright + axe-core, exécuté sur un build de production local.

| Suite | Commande | Portée | Checks | Résultat |
| --- | --- | --- | --- | --- |
| Types | `npm run typecheck` | Tout le dépôt, `strict` | — | 0 erreur |
| Build | `npm run build` | Compilation de production | 67 entrées | exit 0 |
| Cœur | `npm run verify:ui` | Accueil, annuaire, fiche, tableau de bord, formulaires, auth, mobile | 50 | 0 échec |
| Marketplace | `node scripts/verify-marketplace.mjs` | Chiots, services, clubs, événements, comparateurs, sponsors | 49 | 0 échec |
| Reste du périmètre | `node scripts/verify-remaining.mjs` | Admin, checkout, légal, auth, éditorial | 50 | 0 échec |
| Compatibilité CDC | `node scripts/verify-cdc.mjs` | Redirections, calendrier de chaleurs, formulaires, publicité, sitemap | 42 | 0 échec |
| **Total** | | | **191** | **0 échec** |
| Routes | `node scripts/check-routes.mjs` | Toutes les routes en HTTP | 105 routes | 0 non-200 |
| Accessibilité | inclus dans les suites | 38 pages, WCAG 2.0/2.1 A/AA | — | 0 violation |

Relevé complet et daté : [VERIFICATION.md](VERIFICATION.md) (2026-11-04, branche
`feat/frontend-foundation`). Re-vérifié le 2026-11-06 : résultats identiques.

## 2. Ce qui n'est pas testé

| Trous | Risque | Priorité |
| --- | --- | --- |
| Aucun test unitaire | Les fonctions de `lib/search` et `lib/utils` (filtres, tri, pagination, dates, contrastes) ne sont vérifiées qu'indirectement par l'UI | `T-010` |
| Aucune CI | Rien ne garantit que les 191 checks tournent avant un push | `T-005` |
| Safari et Firefox | Le code n'est vérifié que sur Chromium | `T-007` |
| Lecteur d'écran réel | L'accessibilité est vérifiée par axe, pas par navigation vocale | `T-007` |
| Appareils mobiles réels | Vérifié en émulation 390 × 844 uniquement | P2 |
| Test de charge / performance | Aucun budget de performance mesuré | P2 |
| Sécurité applicative | Pas de test d'injection, d'autorisation ou d'énumération — normal sans backend, à prévoir avec lui | P1 avec `T-003` |
| Intégrité des données de démo | Aucun test ne vérifie la cohérence des jeux fictifs | P3 |
| Contenu et liens | Pas de vérification automatique des liens morts dans la documentation | P2 |

## 3. Pyramide cible

```text
        ┌───────────────┐
        │  manuel       │  lecteur d'écran, Safari/Firefox, mobile réel
        ├───────────────┤
        │  e2e          │  Playwright — 191 checks aujourd'hui
        ├───────────────┤
        │  intégration  │  route handlers + webhooks (à créer avec le backend)
        ├───────────────┤
        │  unitaires    │  lib/search, lib/utils, lib/config — 0 aujourd'hui
        └───────────────┘
```

Aujourd'hui la pyramide est inversée : presque tout le poids est sur l'e2e et rien sur les unitaires.
C'est acceptable pour une maquette navigable, pas pour une base de production.

## 4. Règles d'écriture

1. **Un bug corrigé = un test qui échouait avant.** Pas de correction sans test de non-régression.
2. **Sélecteurs par rôle ou libellé**, jamais par classe CSS : un test ne doit pas casser sur une
   retouche visuelle.
3. **Pas de dépendance à l'ordre** : chaque test prépare son état.
4. **Une assertion vide est un test mort.** Un `expect` qui ne peut pas échouer est supprimé.
5. **Aucune capture committée.** `artifacts/` est ignoré par Git ; il ne contient que des preuves
   locales.
6. **Tout échec est daté et attribué** : une ligne de constat `R-nnn` dans [REVIEW.md](REVIEW.md) ou
   une tâche `T-nnn`.

## 5. Environnement

- Node.js 20+ (développé et vérifié sur Node 24).
- Chrome au chemin Windows par défaut, ou `CHROME_PATH` défini.
- Le sandbox de l'hôte bloque le pipe du navigateur et les pipes de workers de Next : les suites et
  le build doivent tourner en accès complet. C'est une contrainte d'environnement, pas de
  l'application.
- `npm start` sert `http://127.0.0.1:3000` ; les scripts attendent cet hôte.

## 6. Ajouter une suite

1. Partir d'un scénario utilisateur réel, pas d'une fonction.
2. Vérifier au minimum : un état nominal, un état vide, un état d'erreur, et un cas mobile si la page
   est publique.
3. Écrire les captures dans `artifacts/<suite>/`.
4. Écrire un `verification.json` avec le nombre de checks et les échecs.
5. Ajouter la ligne au tableau §1 et l'entrée de commande dans `VERIFICATION.md`.

## 7. Registre des exécutions

| Date | Commit | Suites exécutées | Résultat |
| --- | --- | --- | --- |
| 2026-11-04 | `4049e1b` | typecheck, build, 4 suites, routes, axe | 191 checks / 0 échec, 105 routes / 0 non-200 |
| 2026-11-06 | `4049e1b` (re-vérifié) | typecheck, build, 4 suites, routes | 191 checks / 0 échec, 105 routes / 0 non-200, axe 0 violation / 38 pages |

Toute nouvelle exécution ajoute une ligne. Une ligne sans résultat chiffré n'est pas un relevé.

---

## 8. Journal de passation

## Passation — Testeur — 2026-11-06

- État : baseline complète exécutée sur le HEAD actuel (`4049e1b`), tous les contrôles verts.
- Fait : typecheck 0 erreur ; build exit 0 ; 4 suites = 191 checks / 0 échec (50 + 49 + 50 + 42) ;
  `check-routes` 105 routes / 0 échec ; axe 0 violation / 38 pages. Résultats identiques au relevé du
  2026-11-04.
- Bloqué : aucun. Seul aléa rencontré — le port 3000 était occupé par un `next start` obsolète
  (PID 21632, lancé le 04-Nov) — résolu en l'arrêtant et en servant le build frais.
- Décision : aucune.
- Suivant : combler les trous du §2 — en priorité `T-010` (tests unitaires `lib/search` + `lib/utils`)
  puis `T-005` (CI), sur validation du Pilotage.
