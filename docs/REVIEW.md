# REVIEW — constats de relecture

**Propriétaire :** Relecteur · **Dernière mise à jour :** 2026-11-05

> Le relecteur **constate**, il ne corrige pas. Une correction passe par une tâche `T-nnn` assignée au
> rôle concerné. Un constat sans action attendue est inutile.

---

## 1. Format d'un constat

| ID | Sévérité | Fichier:ligne | Constat | Action attendue | Rôle cible | Statut |
| --- | --- | --- | --- | --- | --- | --- |

**Sévérités**

| Niveau | Sens | Effet |
| --- | --- | --- |
| `P0` | Fait inventé, fuite de données, ou promesse trompeuse | Bloque la livraison |
| `P1` | Erreur fonctionnelle, accessibilité cassée, dérive documentaire majeure | À corriger dans la tranche |
| `P2` | Dette, incohérence, manque de test | Planifiable |
| `P3` | Cosmétique, formulation | Optionnel |

**Statuts** : `ouvert` · `en correction` · `corrigé` · `accepté` (assumé, avec justification) ·
`faux positif` (avec la raison).

## 2. Checklist

Chaque revue reprend ces huit points. Un point non vérifié est écrit « non vérifié », pas « OK ».

1. **Fait inventé** — un prix, un badge, un logo, un chiffre, une politique présentés comme réels
   alors qu'ils ne sont pas confirmés. Sévérité maximale, sans exception.
2. **Fuite de données** — adresse exacte, ZIP, coordonnées précises, téléphone, e-mail, URL de
   document ou identifiant interne dans une réponse ou un rendu public.
3. **État fusionné** — un `status` unique qui masque paiement / acceptation / contrat / reversement.
4. **Accessibilité** — état porté par la couleur seule, focus absent ou invisible, erreur de
   formulaire non liée au champ, ordre de tabulation incohérent.
5. **Dérive documentaire** — `README.md`, `DESIGN.md`, `API_NEEDS.md` ou `PROJECT.md` ne décrivent
   plus ce que fait le code.
6. **Lien mort** — un chemin relatif vers un fichier inexistant, dans le code ou la documentation.
7. **Secret ou donnée réelle** — clé, jeton, donnée personnelle, document client committé.
8. **Promesse non tenue** — bouton actif qui ne fait rien, texte qui annonce un service absent, état
   « démo » non signalé.

## 3. Verdict de tranche

En fin de revue :

```md
## Verdict — <tranche> — AAAA-MM-JJ

- Verdict : GO | GO avec réserves | NO-GO
- Constats bloquants ouverts : R-nnn, R-nnn
- Réserves : …
- Relu par : Relecteur
```

`GO` est interdit s'il reste un `P0` ouvert. `GO avec réserves` exige que chaque réserve soit écrite
et acceptée par le Pilotage.

## 4. Journal

| ID | Sévérité | Fichier:ligne | Constat | Action attendue | Rôle cible | Statut |
| --- | --- | --- | --- | --- | --- | --- |
| R-001 | P2 | `README.md` §Coordination | Le README annonçait que le dépôt ne remplace pas PROJECT/DECISIONS/TASKS/DATA_MODEL/API_CONTRACT/TESTS/REVIEW, mais ne pointait ni vers ces documents ni vers le protocole | Ajout des liens vers `AGENTS.md` et les huit documents | Frontend | corrigé |
| R-002 | P3 | `docs/API_NEEDS.md` §introduction | Le document demandait une réconciliation avec « DATA_MODEL » et « API_CONTRACT » sans pointer de document | Statut mis à jour avec liens vers les deux brouillons v0 | Backend | corrigé |
| R-003 | P2 | `docs/VERIFICATION.md` | Relevé daté du 2026-11-04 : plus aucun relevé depuis les nouveaux documents de pilotage | Relancer `typecheck` + `build` + suites et ajouter une ligne au registre `TESTS.md` §7 | Testeur | corrigé |

> Aucune revue complète n'a encore été enregistrée. La première doit couvrir la tâche `T-004`
> (faits inventés, fuites de données, états fusionnés, accessibilité) sur l'ensemble du frontend
> livré. Les trois constats ci-dessus sont des écarts documentaires constatés à la création du
> protocole.
