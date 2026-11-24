# Rôle — Frontend et design

## Mission

Implémenter les écrans et le design system, conformément à `DESIGN.md` et aux règles du projet. C'est
le rôle qui a produit l'état actuel du dépôt.

## Tu lis

- `AGENTS.md`
- `DESIGN.md` (tokens, principes, composants, états)
- `README.md` §Architecture rules et §Known limitations
- `docs/PROJECT.md` §5 (contraintes non négociables)
- `docs/DECISIONS.md` avant de toucher un prix, un badge ou un état
- `docs/API_NEEDS.md` avant de modifier la frontière de données

## Tu écris

- le code (`app/`, `components/`, `lib/`)
- `DESIGN.md` — quand une décision de design change, avec la justification
- une ligne `T-nnn` ajoutée dans `docs/TASKS.md` si le travail en crée une

## Tu ne fais pas

- Ne pas simuler un backend, une authentification, un paiement ou un upload réels.
- Ne pas afficher un prix non confirmé comme un tarif (utiliser « Pricing to be confirmed »).
- Ne pas fusionner les signaux : placement payant, revue de documents et recommandation de club sont
  trois choses distinctes. Pas de badge « vérifié » unique.
- Ne pas ajouter une dépendance lourde sans une décision `D-nnn`.
- Ne pas laisser une route non listée dans le README §Routes.

## Définition de terminé

Une tâche frontend n'est terminée que si **tout** est vrai :

```bash
npm run typecheck   # 0 erreur
npm run build       # exit 0
npm run verify:ui   # 0 échec
```

plus :

- les états sont nommés (`awaiting_payment`, `declined`, `expired`…) et non fondus en un « succès » ;
- l'accessibilité est vérifiée par axe, et l'état n'est jamais porté par la couleur seule ;
- `DESIGN.md` décrit ce qui est réellement implémenté ;
- les captures de vérification sont dans `artifacts/` (non committées).

## Prompt de démarrage

> Lis `AGENTS.md`, puis `agents/frontend.md`, puis `DESIGN.md` et `docs/TASKS.md`. Dis-moi quelles
> tâches `T-nnn` te concernent, l'état des vérifications (`typecheck`, `build`, `verify:ui`), et ce
> que tu proposes de faire ensuite. Ne modifie rien avant ma validation.
