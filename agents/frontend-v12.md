# PROMPT — AGENT FRONTEND — MISE À JOUR CDC V11 → V12 (CanibookStud)

## Contexte

Le client a livré une mise à jour majeure du cahier des charges : **CDC V12 remplace CDC V11**.
Tu es l'agent « Frontend et design ». Ta mission : mettre le frontend CanibookStud (Next.js 15
App Router, React 19, TypeScript strict, Tailwind) **entièrement conforme au CDC V12**, sans casser
ce qui existe déjà.

---

## 1. Documents à lire AVANT toute modification

1. `AGENTS.md` — le protocole multi-rôles (déjà chargé comme instruction du dépôt).
2. `agents/frontend.md` — ton prompt de rôle (mission, interdits, définition de terminé).
3. `docs/CDC_V12_DIFF.md` — **le rapport de comparaison V11 → V12 vérifié** (c'est ta feuille de route).
4. `source-docs/text-v2/CDC-CANIBOOKSTUD-USA-261104-DEV.txt` — le CDC V12 complet (spec de référence).
5. Les fiches détaillées dans `source-docs/text-v2/` :
   - `FICHE-BLOG-CHIEN-USA-DEV.txt` (module blog)
   - `GODPET-DEV-CHIEN-USA.txt` (module recherche de noms)
   - `FICHE-SPONSORS-CHIEN-USA-SANS-TARIFS.txt` (module sponsors)
   - `FICHE-CONTRATS-SAILLIE-CHIOT-CHIEN-USA-V2.txt` (contrats + livraison)
   - `FICHE-INSCRIPTION-MULTIPLE-CHIEN-USA.txt` (KYC + import multiple)
   - `FICHE-ADN-TARES-CHIEN-USA.txt` (ADN + tares)
6. `lib/config/pricing.ts` — **déjà réécrit en V12** (tous les tarifs y sont ; ne code JAMAIS un prix en dur).
7. `lib/config/features.ts` et `lib/config/site.ts` — **déjà mis à jour** (flag livraison, notice
   « visibilité pas leads », « pas de messagerie plateforme »).
8. `DESIGN.md` — tokens, principes, composants réutilisables (respecte le design system existant).

---

## 2. Ce qui est DÉJÀ fait (ne pas refaire, ne pas casser)

- `docs/CDC_V12_DIFF.md` existe (rapport de comparaison).
- `lib/config/pricing.ts` est en V12 : `STUD_PRICING`, `PUPPY_PRICING`, `BREEDER_SUBSCRIPTIONS`,
  `PROFESSIONAL_PRICING` (0 / 69 mensuel / 199 annuel / Boost 49), `LITTER_PRICING`,
  `SPONSOR_PRICING`, `CLUB_PRICING`, `GODPET_PRICING`, `AFFILIATE_PRICING`, `DELIVERY`.
- `lib/config/site.ts` : la notice marketplace dit désormais « visibilité pas leads + livraison option transporteur agréé ».
- `lib/config/features.ts` : flags `delivery`, `messaging` (pas de chat), `ads.leadPromises: "never"`.
- Le blog et GODPET sont **peut-être déjà en cours** : vérifie l'état de `app/blog/`, `app/godpet/`,
  `lib/data/demo/articles.ts` avant de recommencer ; complète ce qui manque au lieu de dupliquer.

Si tu vois un écart entre ces fichiers et ce prompt, **les fichiers déjà écrits font foi** ; signale
l'écart dans ta passation au lieu de revenir en arrière.

---

## 3. TA MISSION — liste complète, par ordre de priorité

### P1 — Blog (module 6)
- Routes `/blog` et `/blog/[slug]`.
- **15 articles figés** (liste exacte dans `CDC_V12_DIFF.md` §7). Slugs imposés :
  `german-shepherd-stubborn`, `french-bulldog-breathing-loud-boa`, `french-bulldog-puppy-cost`,
  `labrador-puppy-cost`, `labrador-vs-golden-retriever`, `japanese-names-german-shepherd-female`,
  `top-20-names-french-bulldog`, `labrador-pulls-on-leash`, `mdr1-australian-shepherd`,
  `brucellosis-in-dogs`, `license-to-breed-dogs-california-ab-702`, `8-weeks-rule-puppy`,
  `eic-in-labrador`, `reputable-german-shepherd-breeder`, `best-food-french-bulldog`.
- Structure par article : title, metaTitle, metaDescription, h1, excerpt, content (4-6 H2), faq
  (3 questions), category (Sante/Comportement/Race-Cout-Achat/Noms-GODPET/Loi-Admin), tags, author,
  coverImage, publishedAt, readingTime, ctaGodpet + ctaBreeders, relatedArticles (3).
- Corps rédigé, factuel, **aucun fait santé inventé** (brucellose, BOAS, MDR1, EIC, AB 702 : reformule
  prudemment depuis le CDC, signale « demo editorial »). En préview tu peux viser ~300-500 mots de corps
  + FAQ, au lieu de 800-1200.
- Garde `/articles` fonctionnel (pointe vers les mêmes données ou redirige).

### P1 — GODPET (module 5)
- Routes `/godpet` et `/godpet/certificate/[id]`.
- Formulaire : email + breed + sex + personality (max 2) + style + optionnels (color, origin, length,
  letterPref). **Pas de photo au début.**
- Génération **mock locale** (PAS d'API GPT) : 6 noms déterministes par race/style, avec prononciation,
  signification, pourquoi, score + 5 sous-scores, `instagramAvailable`, `domainAvailable`.
- 1 régénération gratuite. Interdits : ordres (Sit, Stay, Come, Down, No, Heel, Fetch, Leave, Sid, Kit,
  Bo, Beau, Moe, Joe, Flo) et top 10 sauf style Classique (Max, Bella, Charlie, Luna, Cooper, Bailey,
  Daisy, Lola, Sadie, Rocky).
- Tip : **un seul champ libre 1-50 USD**, aucun bouton de montant prédéfini. Boutons « Tipper » /
  « Non merci, je passe ». Photo demandée **uniquement à la fin** (avant le certificat).
- Page certificat publique : photo ou placeholder, nom en grand, race+sexe+couleur, signification +
  prononciation, 5 scores, bouton « Télécharger PDF » (désactivé, libellé « PDF disponible en
  production »), boutons Partager (liens statiques). `GODPET_PRICING` : **PDF gratuit même si tip = 0**.

### P1 — Sponsors (module 8) — le plus gros
- **Réservation type Airbnb** : emplacements `sidebar 300x250` / `topBanner 728x90` / `pinDoré`, par
  race + page + dates. Calendrier vert (libre) / rouge (pris) / gris (indisponible), blocage 15 min,
  file d'attente, 1 seul sponsor par emplacement par mois.
- Tunnel sponsor site (7 étapes) : canal → emplacement → formulaire → upload visuels → paiement →
  validation → TDB. Renouvellement mensuel auto (aperçu).
- Tunnel sponsor événement (7 étapes) : **proposition** → le club accepte/refuse/négocie → refus ou
  non-réponse 7 j = **remboursement 100 % auto**. Split 50/50 (`SPONSOR_PRICING.eventSplitLabel`).
- **Pas de messagerie plateforme** : afficher les emails des deux parties, échanges par email direct.
- Addendum email club : dans `/dashboard/club/events/[id]`, bouton « Copier le modèle d'email de
  sollicitation sponsors » (modèle EN-US dans `FICHE-SPONSORS` §addendum / CDC §11).
- TDB Sponsor : vues, clics, CTR, conversions (après, jamais promis avant), coût/clic, top pages/races,
  boutons changer visuel / prolonger / annuler. TDB Admin : revenu total, sponsors actifs/en attente/
  refusés, taux d'occupation, alertes (libre 7 j, retard paiement, CTR <0.2 %).

### P1 — Contrats : livraison (modules 3-4)
- Contrat chiot : ajouter `deliveryMode` (pick-up / transporteur agréé), `deliveryFee`,
  `deliveryTransporter`, `pickupDate` / `deliveryDate`, `escrowReleaseAt` (livraison + 48 h).
- Par défaut **pick-up**. Livraison = option **désactivée** tant que l'admin n'a pas validé la liste des
  transporteurs + prix (flag `FEATURES.delivery.enabled = false`).
- Corriger le copy : le contact se débloque après le **deposit 400** (pas 300), le solde 1600 est en
  **escrow** (pas de paiement hors plateforme), service saillie 300 non remboursable, total femelle 2300.

### P2 — Pros : carte interactive (module 7)
- Points **GRIS** (inactif) / **COULEUR** par métier / **DORÉ** (Boost), couleurs exactes dans le CDC §10.
- `PROFESSIONAL_PRICING` : 0 Gratuit (invisible, numéro cadenassé) / 69 $/mois Standard / 199 $/an
  Premium / Boost +49 $/mois. Vérification IA licence en mock (badge vert/orange/refus).

### P2 — Inscription : KYC + ADN/tares (modules 1-2)
- UI de l'import multiple + tableau de vérification (puce regex `^\d{15}$`, âge <10 mois warning,
  race ADN ≠ déclarée warning, brucellose positif blocage, filtre multi-races).
- Panneau ADN : labo (Embark/Wisdom/UC Davis/Autre), % race (>95 % vert / 90-95 % orange / <90 % rouge),
  panel tares par race, badge « non reproducteur » si tare homozygote positive. En préview : champs +
  états, pas de vraie IA.

---

## 4. Contraintes non négociables

1. **`tsc --noEmit` ET `next build` doivent passer à la fin.** Lance
   `node node_modules/typescript/bin/tsc --noEmit` puis le build.
2. **Aucun prix en dur.** Tout depuis `lib/config/pricing.ts`.
3. **Aucun secret, aucune donnée personnelle réelle, aucun fait inventé.** Tout contenu santé/légal est
   signalé « demo » et reformulé prudemment.
4. **Disclosure de prévisualisation** sur chaque écran non branché (auth/paiement/upload/PDF/GPT).
5. **Zéro publicité** sur : fiches animaux, fiches pro (détail), galerie, contrats, paiement, checkout,
   tableau de bord (respecte `AD_POLICY`).
6. **Pas de messagerie plateforme** (afficher les emails, pas de chat).
7. **Jamais de promesse de leads** (vues/clics constatés après diffusion uniquement).
8. **Ton V12** : « Le système doit / L'utilisateur peut », aucune histoire/persona, aucun prix fictif.
9. Suis le design system (`DESIGN.md`, composants `components/ui/`, tokens Tailwind) — ne réinvente pas.

---

## 5. Définition de terminé + passation

Une tâche est terminée quand :
- typecheck + build verts ;
- la route est listée dans `README.md` §Routes (ou ajoutée) ;
- les états sont nommés (pas de faux « succès ») ;
- aucun prix hors config, aucune pub sur page interdite.

À la fin, écris ta passation au format `AGENTS.md` §4 (dans le document de ton rôle) :

```md
## Passation — Frontend — AAAA-MM-JJ
- État :     …
- Fait :     … (avec les commandes exécutées)
- Bloqué :   … (décision O-nn / backend absent / admin)
- Décision : D-nnn / O-nn, ou « aucune »
- Suivant :  la prochaine action concrète
```

## 6. Premier message à coller pour démarrer

> Lis AGENTS.md, puis agents/frontend.md, puis docs/CDC_V12_DIFF.md et le prompt de mission. Dis-moi
> en 5 lignes : ce que tu as compris, ce qui est déjà fait sur le disque, et ce que tu proposes de
> faire en premier. Ne modifie rien avant ma validation.
