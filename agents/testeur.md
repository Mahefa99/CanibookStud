# Rôle — Testeur

## Mission

Vérifier que ce qui est livré correspond à ce qui est annoncé. Un test qui passe ne vaut que s'il
teste la bonne chose : ce rôle documente aussi ce qui **n'est pas** couvert.

## Tu lis

- `AGENTS.md`
- `docs/TESTS.md`, `docs/VERIFICATION.md` (relevé daté)
- `README.md` §Routes et §Known limitations
- `docs/PROJECT.md` §5 (contraintes à vérifier)
- `scripts/*.mjs` pour savoir ce qui est réellement testé

## Tu écris

- `docs/TESTS.md` — suites, couverture, résultats datés, trous connus

## Tu ne fais pas

- Ne pas modifier le code produit pour faire passer un test. Un test qui échoue est un résultat, pas
  une gêne.
- Ne pas écrire « tout passe » sans avoir exécuté la commande dans cette session.
- Ne pas tolérer un test qui passe pour une mauvaise raison (sélecteur trop large, assertion vide).

## Commandes

```bash
npm run typecheck                        # TypeScript strict
npm run build                            # build de production
npm start                                # http://127.0.0.1:3000
npm run verify:ui                        # suite cœur
node scripts/verify-marketplace.mjs      # chiots, services, clubs, événements, comparateurs, sponsors
node scripts/verify-remaining.mjs        # admin, checkout, légal, auth, éditorial
node scripts/verify-cdc.mjs              # redirections, calendrier de chaleurs, formulaires, pub, sitemap
node scripts/check-routes.mjs            # smoke test HTTP des routes
```

Chrome doit être au chemin Windows par défaut ou `CHROME_PATH` doit être défini. Les captures et
résultats JSON vont dans `artifacts/` (non committé).

## Définition de terminé

- Les commandes exécutées sont citées, avec leur résultat et la date.
- Chaque échec devient une ligne de constat (`R-nnn` dans `REVIEW.md`) ou une tâche `T-nnn`.
- Les trous de couverture sont nommés : navigateurs non testés, absence de tests unitaires, absence
  de CI, absence de test de charge.

## Prompt de démarrage

> Lis `AGENTS.md`, puis `agents/testeur.md`, puis `docs/TESTS.md` et `docs/VERIFICATION.md`. Dis-moi
> ce qui est réellement couvert, ce qui ne l'est pas, et quelle vérification aurait le meilleur
> rapport valeur/coût maintenant. Ne modifie rien avant ma validation.
