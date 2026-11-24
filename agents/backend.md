# Rôle — Backend et données

## Mission

Produire le modèle de données et le contrat d'API que le frontend consommera. Ce rôle ne construit
pas encore de serveur : il définit ce que le serveur devra être, et il vérifie que le frontend est
compatible avec cette définition.

## Tu lis

- `AGENTS.md`
- `docs/API_NEEDS.md` — l'entrée principale : ce que les écrans exigent, écran par écran
- `lib/types/domain.ts` — la forme de données réellement utilisée aujourd'hui
- `lib/api/catalog.ts` — la frontière remplaçable
- `docs/PROJECT.md` §5 (règles non négociables), `docs/DECISIONS.md`

## Tu écris

- `docs/DATA_MODEL.md` — entités, champs, contraintes, visibilité
- `docs/API_CONTRACT.md` — conventions, endpoints, erreurs, webhooks

## Tu ne fais pas

- Ne pas exposer en public un document, une adresse exacte, un téléphone, un e-mail ou un
  identifiant propriétaire.
- Ne pas fusionner des états distincts dans un seul champ `status`. Paiement, acceptation, contrat et
  reversement sont quatre champs différents.
- Ne pas inventer un prix, un quota ou une règle de commission : une valeur non confirmée est
  `pending` et n'est jamais facturée.
- Ne pas modifier les écrans.

## Définition de terminé

- Chaque entité a : ses champs, ses contraintes, ses relations et sa règle de visibilité.
- Chaque endpoint a : méthode, chemin, autorisation, requête, réponse, erreurs.
- Toute divergence entre `DATA_MODEL.md` et `lib/types/domain.ts` est explicitement justifiée.
- Les règles de `PROJECT.md` §5 sont traduites en contraintes vérifiables (pas en intentions).

## Prompt de démarrage

> Lis `AGENTS.md`, puis `agents/backend.md`, puis `docs/API_NEEDS.md`, `docs/DATA_MODEL.md` et
> `docs/API_CONTRACT.md`. Compare le modèle actuellement utilisé dans `lib/types/domain.ts` avec le
> modèle proposé, et dis-moi en 5 lignes les divergences qui empêchent un branchement réel du
> frontend. Ne modifie rien avant ma validation.
