# CDC V11 → V12 — comparaison vérifiée

**Propriétaire :** Analyse · **Date :** 2026-11-06
**Sources :** `source-docs/text-v2/FICHE-CHANGEMENTS-CDC-USA-261104-POUR-DEV.txt` (liste officielle des
changements) et `source-docs/text-v2/CDC-CANIBOOKSTUD-USA-261104-DEV.txt` (CDC V12). Le CDC **V12
remplace V11** ; ne plus coder sur V11.

> Les nouveaux fichiers reçus : CDC V12 · FICHE-ADN-TARES · FICHE-BLOG · FICHE-CHANGEMENTS ·
> FICHE-CONTRATS V2 · FICHE-INSCRIPTION-MULTIPLE · FICHE-SPONSORS (sans tarifs) · GODPET.

---

## 0. Ton et périmètre

- **Ton** : V12 parle au développeur (« Le système doit »), plus d'histoires/personas. Sans effet code.
- **Périmètre** : CHIEN USA, EN-US, USD. Inchangé. Stack confirmée Next.js + Supabase + Stripe +
  SendGrid + Leaflet + Vercel + Cloudflare. Stripe Tax non activé pour l'instant.

## 1. Règles générales nouvelles

| # | Règle V12 | État frontend actuel | Action |
| --- | --- | --- | --- |
| G1 | **Aucune promesse de leads** : on vend de la visibilité, pas des leads | `features.ts` a `ads.soldCampaigns: 0` mais pas de règle « jamais de leads promis » | Ajouter la règle + l'appliquer au TDB sponsor |
| G2 | **Aucune messagerie plateforme club↔sponsor** : emails affichés, échanges par email | `messaging.enabled: false` (déjà) | Reformuler : pas de chat, emails des deux côtés |
| G3 | **Réservation sponsor type Airbnb** (race+page+dates+format, calendrier, blocage 15 min, 1 sponsor/emplacement/mois) | Sponsor = inventaire en aperçu seulement | Construire le tunnel + calendrier |
| G4 | **Sponsor événement = proposition** : le club décide ; refus/sans réponse 7 j = remboursement 100 % auto | Aperçu seulement | Construire le tunnel proposition/acceptation |
| G5 | **Tous les prix en variables de config** | Partiel : `pricing.ts` existe mais contient encore d'anciens prix V11 | Réécrire `pricing.ts` en V12 |
| G6 | **Adresse privée jamais publique + ville floue + offset carte** (`lat = city_lat + (rand-0.5)*0.04`) | `PublicLocation.precision: "approximate"`, offset non précisé | Préciser l'offset (1-2 miles) |
| G7 | **Animal first, ads second** (zéro pub sur fiches animaux, contrats, paiement, checkout, TDB, galerie) | `AD_POLICY` déjà aligné | Confirmer + étendre à `/stud/[id]` etc. déjà couverts |

## 2. Tarifs V12 (source : CDC §3)

### 2.1 Conservés de V11 — NE PAS CHANGER
- Éleveurs : service saillie **300**, service chiot **600**, stud fee **2000**, deposit **400**, solde **1600**, puppy **3000**, total saillie **2300**, total chiot **3600**.
- Abonnements : Gratuit 1 chien / **Starter 29/mois, 199/an** / **Pro 59/mois, 499/an** / **Unlimited 99/mois, 799/an**.
- Annonce portée : Free 7 j / Premium **99/mois**. Sponsors : Site Officiel **149/mois**, Site Premium **400/mois**, Événement **149 / 400**, split 50/50 **74.50 / 200**.
- Club : inscription **0**, billetterie **2/billet**. GODPET : gratuit + tip libre **1-50**, Godfather Club **9.99/mois**.

### 2.2 Pros — corrigé (était faux dans le frontend)
- **0 Gratuit** (invisible, point GRIS, numéro cadenassé) · **69/mois Standard** · **199/an Premium** · **Boost +49/mois** (point GROS et DORÉ 30 j).
- État actuel : `PROFESSIONAL_PRICING` = `unconfirmed` (deux variantes contradictoires). **Action : confirmer 0/69/199/49.**

### 2.3 Comparateurs — correction des prix d'affiliation (étaient faux)
- Insurance : **Lemonade 15/vente · Trupanion 25/vente · 1/devis**.
- Dog Food : **Chewy 4 %** (~2.80 sur 70, ~3.40 sur 85) · **Amazon Associates 3 %** (~1.80 sur 60) · **15 flat** nouveau client Chewy.
- Ne PAS coder « 30-50/lead » ni « 5-10/vente » (faux).

## 3. Contrats (CDC §6-7)

- **Conservé** : contrat saillie + chiot obligatoires, PDF auto, signature checkbox+timestamp+IP, escrow Stripe, brucellose <14 j, tares négatif, ADN >95 %, 2e chance (1 seule gratuite, 6 mois, preuve véto écho 30 j + progestérone), âge 8 semaines = 56 j, garantie santé 72 h, garantie génétique 1 an, assurance 30 j, licences USDA/Pet Dealer, platform not party.
- **Changé — Livraison (nouveau module §7)** : par défaut **pick-up**, mais **option livraison avec transporteur agréé uniquement**, prix défini par l'admin, acheteur paie 100 %. Champs : `deliveryMode` (pick-up / transporteur agréé), `deliveryFee`, `deliveryTransporter`, `pickupDate`/`deliveryDate`, `escrowReleaseAt` = livraison +48 h. **Désactivée tant que l'admin n'a pas validé liste + prix.**
- **Supprimé** : solde 1600 payé hors plateforme (maintenant **escrow avant saillie**) ; contact 300 $ (utiliser **400 deposit**) ; livraison PuppySpot avion.

## 4. Inscription multiple + KYC (CDC §4)

- 1 **KYC par owner** (pas par chien), score **≥80 %** sinon blocage, **W9** obligatoire, licences USDA (si >4 femelles) + Pet Dealer CA/NY/FL/TX/PA + AKC.
- Tableau de vérification : puce regex `^\d{15}$` + unique, âge <10 mois = warning, race ADN ≠ race déclarée = warning, brucellose positif = **blocage**, filtre multi-races, **blocage saillie inter-races sauf outcross AKC autorisé**.

## 5. ADN + tares mortelles (CDC §5) — nouveau

- Labos : Embark 139 / Wisdom 130 / UC Davis 50. % race **>95 %** (badge vert) · 90-95 % (orange) · <90 % (rouge, croisé = blocage). Race ADN ≠ déclarée = blocage fraude.
- Panel tares : MDR1/DM/EIC/PRA/vWD/HUU + panels par race. Positif homozygote = **blocage reproduction**.

## 6. GODPET (CDC §8) — nouveau module

- Formulaire email+breed+sex+personality(≤2)+style → 6 noms + 1 régénération gratuite + tip libre 1-50 **sans boutons prédéfinis** + photo seulement à la fin + **PDF gratuit même si tip=0**.
- Page publique `/godpet/certificate/[id]`. URLs `/godpet`, `/godpet/certificate/[id]`, `/blog`, `/blog/[slug]`.

## 7. Blog (CDC §9) — nouveau

- **15 articles figés** (German Shepherd stubborn, French Bulldog BOAS, coût chiot FB 3500 $, coût chiot Labrador 1800 $, Labrador vs Golden, 100 noms japonais GS, Top 20 noms FB, Labrador tire la laisse, MDR1 Australian Shepherd, Brucellose, licence CA AB 702, règle 8 semaines, EIC Labrador, éleveur GS réputé, meilleure nourriture FB). Structure 800-1200 mots, FAQ, schema.org, CTA GODPET + éleveurs.

## 8. Sponsors (CDC §11) — le plus gros changement

- Tunnel site 7 étapes + tunnel événement 7 étapes (proposition → acceptation/refus/négociation par email → remboursement 100 % auto 7 j). **Pas de messagerie plateforme.**
- Addendum email club (bouton « Copier le modèle d'email » dans `/dashboard/club/events/[id]`).
- TDB Sponsor (vues, clics, CTR, conversions, top pages/races, export) + TDB Admin (revenus, taux d'occupation, alertes CTR <0.2 %…).

## 9. Pro (CDC §10)

- Points **GRIS** (inactif) / **COULEUR** par métier / **DORÉ** (Boost). Vérification IA licence. Couleurs précises par métier dans le CDC.

---

## État du frontend actuel vs V12 — synthèse

| Zone | État | Priorité |
| --- | --- | --- |
| `pricing.ts` | anciens prix V11, pros non confirmés, comparaison d'affiliation absente | **P0** |
| `site.ts` (notice « no delivery ») | contredit V12 (livraison = option) | **P0** |
| Contrats | brouillon, sans champs livraison | P1 |
| Sponsors | inventaire en aperçu, pas de réservation ni tunnel | P1 |
| Blog | `/articles` sample, pas `/blog` ni les 15 articles | P1 |
| GODPET | absent | P1 |
| Inscription multiple / KYC / ADN | partiel (formulaires), pas de scoring ni panel tares | P2 |
| Pros map | points existants, pas GRIS/COULEUR/DORÉ ni Boost | P2 |
| Tableaux de bord sponsor/admin | absents | P2 |

---

## Plan d'implémentation

1. **P0 — Config** : réécrire `pricing.ts` (tous les tarifs V12), corriger `site.ts` (livraison option,
   zéro leads, zéro messagerie) et `features.ts` (flag livraison).
2. **P1 — Modules manquants** : blog (15 articles + `/blog`), GODPET (formulaire + certificat + tip),
   sponsors (réservation Airbnb + tunnel proposition), contrats (champs livraison).
3. **P2 — Affinage** : pros GRIS/COULEUR/DORÉ + Boost, KYC/ADN/tares, TDB sponsor/admin.
4. **Re-vérification** : typecheck + build + suites Playwright sur le nouveau HEAD.

> Les détails exacts (champs, couleurs, modèles d'email, 15 titres) sont dans le CDC V12
> (`source-docs/text-v2/CDC-CANIBOOKSTUD-USA-261104-DEV.txt`) et les fiches correspondantes.
