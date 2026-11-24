# DEPLOY — procédure de mise en ligne

**Propriétaire :** Mise en ligne · **Dernière mise à jour :** 2026-11-05

> **Statut : aucun environnement n'est déployé.** Rien n'est publié, il n'existe ni domaine, ni
> hébergeur, ni backend. Tout ce qui suit est une procédure **proposée et non testée** : chaque étape
> qui n'a pas été exécutée au moins une fois est marquée ainsi. Ne pas présenter ce document comme
> une procédure validée.

---

## 1. État actuel

| Élément | État |
| --- | --- |
| Environnement déployé | aucun |
| Domaine | aucun (`NEXT_PUBLIC_SITE_URL` = `https://example.com`) |
| Backend | absent — données en mémoire |
| Secrets configurés | aucun, et aucun ne doit entrer dans le dépôt |
| Indexation | désactivée (`NEXT_PUBLIC_ALLOW_INDEXING=false`) |
| Branche | `feat/frontend-foundation`, commits locaux non poussés |

## 2. Prérequis avant tout déploiement

1. `npm run typecheck` et `npm run build` passent sur le commit exact à déployer.
2. Les suites de [TESTS.md](TESTS.md) §1 passent, ou chaque échec est écrit et accepté.
3. [REVIEW.md](REVIEW.md) porte un verdict `GO` ou `GO avec réserves` **avec réserves acceptées**.
4. Les variables d'environnement de §3 sont renseignées dans la plateforme, pas dans le dépôt.
5. Le commit est poussé et tagué (`v0.x.y`).
6. Une décision `D-nnn` autorise explicitement la mise en ligne.

## 3. Variables d'environnement

Source : `.env.example`. Aucune n'est obligatoire pour la démo ; toutes sont obligatoires pour un
environnement réel exposé au public.

| Variable | Rôle | Requis en prod | Valeur de démo | Propriétaire |
| --- | --- | --- | --- | --- |
| `NEXT_PUBLIC_DATA_MODE` | Source de données (`demo` = dépôt en mémoire) | oui | `demo` | Backend |
| `NEXT_PUBLIC_DEMO_DELAY_MS` | Délai artificiel pour les états de chargement | non | `0` | Frontend |
| `NEXT_PUBLIC_ALLOW_INDEXING` | Autorise l'indexation par les moteurs | oui — `false` jusqu'à validation contenu + légal | `false` | Pilotage |
| `NEXT_PUBLIC_SITE_URL` | URL canonique utilisée par les métadonnées | oui | `https://example.com` | Pilotage |
| `NEXT_PUBLIC_MAP_TILE_URL` | Fond de plan | non — lié à `O-24` | — | Backend |
| `NEXT_PUBLIC_MAP_ATTRIBUTION` | Attribution du fournisseur de carte | non — lié à `O-24` | — | Backend |
| `SUPABASE_URL` / `SUPABASE_ANON_KEY` | Base et stockage | oui si Supabase retenu (`O-23`) | — | Backend |
| `STRIPE_PUBLISHABLE_KEY` / `STRIPE_SECRET_KEY` | Paiement | oui si paiement activé | — | Backend |
| `STRIPE_WEBHOOK_SECRET` | Vérification de signature du webhook | oui si paiement activé | — | Backend |
| `EMAIL_API_KEY` | Envoi d'e-mails (`O-25`) | oui si notifications activées | — | Backend |

**Règle :** une clé secrète ne quitte jamais l'environnement de la plateforme. `.env` est ignoré par
Git ; `.env.example` ne contient que des noms et des valeurs fictives.

## 4. Étapes (proposées — non testées)

1. **Vérifier localement** — `npm ci`, `npm run typecheck`, `npm run build`, puis les suites.
2. **Tager** — `git tag v0.1.0 && git push origin v0.1.0` (après validation du Pilotage).
3. **Choisir la cible** — décision à prendre : hébergement Node (sortie `next start`) ou plateforme
   managée. Aucune n'est validée aujourd'hui.
4. **Configurer l'environnement** — variables du §3, secrets dans le coffre de la plateforme.
5. **Déployer** — à partir du tag, jamais d'une branche mouvante.
6. **Vérifier** — checklist du §5.
7. **Laisser l'indexation désactivée** tant que le contenu et le légal ne sont pas validés.

## 5. Vérifications post-déploiement

- [ ] `/` répond 200 et affiche le bandeau de démonstration.
- [ ] `/studs` répond 200 et la pagination fonctionne.
- [ ] Une route inconnue renvoie la page 404 de l'application.
- [ ] `robots.txt` interdit l'indexation si `NEXT_PUBLIC_ALLOW_INDEXING=false`.
- [ ] `sitemap.xml` répond 200 et contient les URLs attendues.
- [ ] Aucune erreur console inattendue sur `/`, `/studs`, `/studs/[slug]`.
- [ ] Les en-têtes de sécurité attendus sont présents (`poweredByHeader: false` déjà actif).
- [ ] Aucune réponse publique ne contient de champ privé (adresse exacte, e-mail, téléphone).

## 6. Retour arrière

- Redéployer le tag précédent (`v0.1.0` ← `v0.0.x`).
- Aucune migration de base aujourd'hui : le retour arrière est purement applicatif.
- Dès qu'une base existera, toute migration devra être réversible et testée sur une copie avant
  déploiement — ce point devient bloquant.

## 7. Ce qui bloque un déploiement utile aujourd'hui

| Blocage | Conséquence | Débloqué par |
| --- | --- | --- |
| Pas de backend | Paiement, contact, contrat et réservation restent inactifs | `T-002`, `T-003` |
| Pas d'authentification | Tableau de bord et admin ouverts en démonstration | `O-23`, `T-009` |
| Pages légales en brouillon | Publication publique risquée juridiquement | `T-008` |
| Pas de domaine | `NEXT_PUBLIC_SITE_URL` reste fictif | Décision `D-nnn` |
| Aucune décision d'hébergement | La cible du §4.3 n'existe pas | Décision `D-nnn` |

Un déploiement de démonstration (lecture seule, indexation désactivée) est possible **avant** ces
déblocages. Un déploiement public ne l'est pas.
