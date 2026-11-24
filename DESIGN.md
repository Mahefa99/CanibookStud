# DESIGN — CanibookStud frontend reference

**Status:** proposed design direction for the frontend scope. Derived from the supplied logo
and the brief. Not presented as a client-approved identity. Prices and policies are not validated
here; those live in [docs/DECISIONS_OPEN.md](./docs/DECISIONS_OPEN.md).

**Scope of this reference:** visual identity, tokens, reusable components, implemented screens and
their states, responsive behaviour, accessibility rules and the advertising boundary.

---

## 1. Design direction

**Editorial warmth, clinical clarity.** The product deals with animal welfare, health documents and
money. The interface should feel calm and human, but never vague. A warm paper background and a
literary serif for headings carry the "breeder's record book" feeling; a sober sans-serif, dense
tabular numbers and explicit status labels carry the facts.

Principles:

1. **Animal first, ads second.** No advertising on animal profiles, galleries, contracts, checkout
   or personal spaces. Inventory previews render on permitted pages only; no campaign is sold or measured.
2. **Three signals, never one badge.** Paid placement, document review and club recommendation are
   visually and semantically distinct.
3. **Say what is known.** "AKC number format checked" is not "AKC verified". A test date is not a
   health guarantee. An estimate is labelled an estimate.
4. **Private by default.** Approximate location, no contact details in public data, female profiles
   and heat calendars private.
5. **States are named.** Awaiting payment, failed, confirmed, declined, expired, unavailable. No
   single green "success" that hides which state actually happened.
6. **No invented facts.** No fake sponsor logos, no invented impressions or clicks, no ranking
   presented as quality, no legal policy presented as final.

### Logo

The supplied logo is rendered using a faithful vector trace (`public/brand/canibookstud-logo.svg`) on the existing white tile. The original JPG is retained.
The wordmark is set in Fraunces, with "Stud" in a darker orange that passes contrast on cream.

- The SVG retains the 798 × 751 viewBox and original contours, using the existing navy/orange tokens. It contains paths, no embedded raster. Vectorization is not client approval of the identity.
- The header keeps the full lockup; the footer uses the same lockup on navy with a white tile.

---

## 2. Colour

Brand colors sampled from the logo: **navy `#002B58`** and **orange `#FF6E01`**.

| Token | Hex | Use |
| --- | --- | --- |
| `navy-900` | `#001731` | Footer, dark panels, deepest text |
| `navy-700` | `#002B58` | Primary actions, headings, brand |
| `navy-600` | `#0B4276` | Hover on navy |
| `navy-500` | `#1F5A92` | Small secondary labels on light |
| `navy-300` | `#8AAFD2` | Decorative icons only, never text on light |
| `orange-500` | `#FF6E01` | Brand accent surface, pins, highlights |
| `orange-700` | `#B64A00` | Orange text on light backgrounds |
| `cream-50` | `#FCFAF6` | Page background |
| `cream-100` | `#F7F2E9` | Soft section background |
| `line` | `#E5DED2` | Borders |
| `ink` | `#0B1B2B` | Body text |
| `muted` | `#556274` | Secondary text |

Status colors: success `#176B4D` on `#E7F4EE`; warning `#8A4B00` on `#FFF2D6`; danger `#A32318`
on `#FDECEA`; info `#1D4E89` on `#EAF2FB`; plum `#6B3F69` on `#F4EDF5`.

### Contrast rules

Measured pairs (WCAG relative luminance):

| Pair | Ratio | Rule |
| --- | --- | --- |
| White on navy-700 | 14.13:1 | Canonical primary button |
| Navy-700 on cream-50 | 13.34:1 | Body and headings |
| Navy-900 on orange-500 | 5.03:1 | Allowed accent button / chip |
| Orange-700 on cream-50 | 5.08:1 | The only orange used for text on light |
| Muted on cream-50 | 5.86:1 | Secondary copy |
| White on orange-500 | 2.81:1 | **Forbidden** |
| Orange-500 on cream | 2.65:1 | **Forbidden for text** |

Orange is therefore a surface and accent color, not a text color on light. Focus outline is navy
on light surfaces and orange on navy (5.03:1). Status is always written in words; color is never
the only carrier.

---

## 3. Typography

| Role | Family | Specimen |
| --- | --- | --- |
| Display / headings | Fraunces (Google Fonts, 400/500/600) | H1 44–70 px, line-height 0.98–1.05, tracking −0.02/−0.03 em |
| Body / UI | Inter (Google Fonts, variable) | 14–16 px, line-height 1.55–1.75 |
| Numbers | Inter with `font-variant-numeric: tabular-nums` | Prices, fees, dates, counters |
| Eyebrow | Inter 11 px, 600, uppercase, 0.16 em | Preceded by a 24 px orange rule |

Headlines are sentence case, not title case. Max measure is ~65 characters. The serif is never used
for form labels, buttons or data tables.

---

## 4. Spacing, shape, elevation

- Base unit **4 px**. Section padding 56–80 px desktop, 40–56 px mobile.
- Shell max width **1280 px**, gutters 20 px mobile / 32 px tablet / 40 px desktop.
- Radii: buttons and chips full pill; inputs 12 px; cards 16 px; feature panels 28–32 px.
- Borders are warm (`#E5DED2`), 1 px. Shadows are low-contrast and warm, never neon.
- Motion: 150–420 ms, ease-out; hover lift 2 px maximum. `prefers-reduced-motion` disables all
  transitions and smooth scrolling.

---

## 5. Components

### 5.1 Buttons — `components/ui/button.tsx`

`Button` and `ButtonLink` share `buttonClasses`.

- `primary`: navy background, white text. Default for one main action per view.
- `secondary`: white with warm border. Neutral alternative.
- `accent`: orange background with **navy** text. Used sparingly (dark panels, billing CTA).
- `ghost`: no border, navy text. Low-emphasis actions.
- `danger`: dark red, white text. Destructive, always confirmed elsewhere.
- Sizes `sm` (36 px min height), `md` (44 px), `lg` (48 px). `fullWidth` for forms.
- States: hover, focus-visible, disabled (no hover), loading (`aria-busy`, spinner).
- Pill shape is reserved for actions and status; cards remain rounded rectangles.

### 5.2 Badges and signals — `components/ui/badge.tsx`, `components/domain/signal-badges.tsx`

Base `Badge` is text-first, optional icon, optional `description` exposed as a title and to screen
readers. Tones: neutral, navy, accent, success, warning, danger, info, plum.

The following are **separate components on purpose**:

| Component | Meaning | Visual treatment |
| --- | --- | --- |
| `PlanBadge` | Basic/Premium subscription; paid visibility | Navy outline + star (Premium) or paw (Basic) |
| `DocumentationBadge` | Review state of uploaded documents | Blue/amber/danger file or clock icon |
| `BrucellosisBadge` | Test date and freshness within the listing window | Green shield, amber clock, neutral warning |
| `AkcBadge` | Registration number **format** check only | Blue file icon; wording never says "verified" |
| `ClubRecommendationBadge` | Opinion from a listed club | Warm gold award icon |
| `RequestStatusBadge` | Request/payment state | Text + icon; no combined "confirmed" |

`SignalLegend` explains the three categories wherever they first appear.

### 5.3 Stud card — `components/domain/stud-card.tsx`

- Illustration ratio 4:3, favourite button top-right, plan badge top-left, "Illustration" caption.
- Body: breed, age, name, city/state, 2-line headline, signal badges, stud fee, view link.
- `compact` variant for the map sidebar: 80 px thumbnail, name, price, location, test badge.
- The card never contains contact details or exact address.
- The favourite control is an independent button, not nested inside the profile link.

### 5.4 Map — `components/domain/market-map.tsx`

Interactive Leaflet map using local public-domain US Atlas geometry, with zoom, pan, keyboard controls, clickable markers and a parallel accessible listing.

- Pins are keyboard-operable Leaflet markers with linked popups. Premium/sponsor pins use the configured gold treatment; standard studs use navy.
- No tile provider, no API key, no IP sent to a map vendor in this delivery.
- The interactive map has a labelled region and a separate expandable list of links. Loading and failure are announced; retry and fit-to-results buttons are available.
- Caption states that locations are approximate and exact addresses are private.
- `compact` removes the legend but keeps the caption and list.

### 5.5 Gallery — `components/domain/stud-gallery.tsx`

Main portrait, thumbnail rail, previous/next buttons, arrow-key navigation, polite "Photo N of M"
announcement. Illustrations are labelled. No lightbox in this slice.

### 5.6 Filters, sort, pagination

- `StudFilters`: native GET form (works without JS), collapsible on mobile, always open on desktop.
  Fields: search, breed, state, max stud fee, current brucellosis test. Reset link.
- `ResultsToolbar`: sort select submits the form, list/map links preserve the query. When the sort is
  "Featured placement", the UI discloses that it is paid visibility, not a ranking.
- `Pagination`: server links, `aria-current="page"`, disabled prev/next rendered as text, result
  count. No infinite scroll.
- Active filters are removable chips with descriptive accessible names.

### 5.7 Forms — `components/forms/*`

- `TextField`, `SelectField`, `TextareaField`, `CheckboxField`: real `<label>`, hint and error linked
  with `aria-describedby`, `aria-invalid`, required marker.
- `FormErrorSummary` at the top of the form, focusable, linking to each field.
- `FileDropzone`: real focusable file input, drag-and-drop surface, accepted types and size check,
  file list with remove buttons. Files never leave the browser in this preview.
- `AnimalRegistrationForm`: 4 steps, per-step validation, native step tabs (completed steps
  clickable), local draft autosave and restore, discard action, review summary.
- `RequestForm`: native validation, consent checkboxes, local "draft ready" state; it never implies
  a request was sent.

### 5.8 Feedback and states

`Alert` (info/success/warning/danger/neutral, status or alert role), `EmptyState`, `StatCard`,
loading skeletons (`app/studs/loading.tsx`), route error boundaries, `not-found`, disabled and
blocked states. Data states covered in this slice: loading, empty, error, success, forbidden
(demo login note), in review, expired/missing documents, awaiting payment, payment unavailable,
request declined, profile unavailable.

### 5.9 Navigation

- Public header: logo, primary nav, log in, create account, mobile disclosure. Sticky on scroll.
- Mobile menu locks background scroll, closes on route change and Escape, returns focus to trigger.
- Dashboard: desktop sidebar grouped by Workspace/Account/Activity; mobile wrapping chip strip.
  Activity-specific items appear only when the demo account holds the activity.
- Breadcrumbs on profile, request, form and auth-adjacent screens.

---

### 5.10 Litters and puppies — `components/domain/marketplace-cards.tsx`, `marketplace-badges.tsx`

- Litter card: 4:3 illustration, plan badge, sold-out/expired badge, breeder, readiness badge,
  available count, and the exact breakdown **puppy price + service fee = total**.
- Puppy status is per animal: Available, Reservation pending, Reserved, Sold. A reservation is never
  presented as applying to the whole litter.
- The readiness date is labelled as a configurable platform rule; the free seven-day listing has no
  reserve action.
- The reservation screen shows the full total and disables payment. It never labels a $3,600 debit
  as a $600 charge.

### 5.11 Professional cards and badges

- Category chip (seven categories) and a business address. Emergency is a red **declared** badge,
  never “Open 24/7”.
- Document review is a separate blue/amber badge. Plan status is always “Pricing to be confirmed”.
- Contact details are omitted: free-plan phone visibility is an open decision, so no fake number is
  shown.
- The services map shares the Leaflet component: grey inactive pins (20 px), category-coloured active pins (30 px), gold Boost pins (45 px). Addresses are not exposed in marker payloads.

### 5.12 Clubs, events and tickets

- Club cards use a monogram, a document-review state and a separate “parent club claim · sample”
  label. A recommendation is attributed to the club and never merged with verification.
- Event cards show the local month/day, explicit time zone, capacity, remaining tickets and the
  ticket + fee = total breakdown.
- The ticket state gallery shows valid, checked-in, already-used and invalid states with fake,
  non-scannable codes.
- The sponsorship block separates announced 50/50 split from contract terms.

### 5.13 Comparators

- Three tables: insurance, dog food, cat food. Server-side filter, responsive scroll container.
- Every table is marked “Sample data · not a quote”; the rating is “demo” and affiliate actions are
  non-interactive.
- No real brand, price, rating or partnership is presented as verified.

### 5.14 Administration — `components/admin/*`

- Demo-gated layout with a persistent “Admin · demo” bar and a lock action.
- Overview metrics, verification queue, content queue, users, reports, transactions, sponsors and
  events.
- Tables scroll inside a focusable region (`tabIndex=0`) so keyboard users can reach hidden columns.
- Every decision action is visibly disabled. No approve/reject/refund action is simulated as working.
- The gate is an open demo cookie and says so; it is not authentication.

### 5.15 Checkout, contract and access states

- A state hub links to pending, failed, confirmed, access-denied and contract screens.
- Each state names what is and is not unlocked. “Confirmed” explicitly says the server webhook is
  required and that no real payment occurred.
- Contract page shows draft clauses, unsigned parties and disabled signature/download actions.

### 5.16 Legal and editorial pages

- Legal pages use a draft banner and short, non-final sections. They never claim to be binding.
- Breed guides and articles are marked sample editorial; they avoid AKC, legal and veterinary claims.
- Article and breed pages reuse the editorial prose width and avoid advertising.

### 5.17 Heat calendar — `components/forms/heat-tracker.tsx`

- Private month view (three months from the latest recorded heat), heat windows in red, mating days
  in navy, estimated due date in plum, today outlined.
- Local-only entry of a heat (14-day sample window) and a mating (stud select). Values disappear on
  refresh; no notification, save or public visibility.
- Next heat uses the 182-day setting; due date is mating + 63 days, explicitly labelled an estimate.
- The screen says a recorded mating does not confirm pregnancy.
- Notification cards (14 days before, day of, 7 days after) are visibly marked “Not connected”.

### 5.18 Creation flows

- Litter: title, breed, dam, sire, birth/readiness, puppy count, price + $600 service fee, photos,
  description, Free/Premium plan (V12 Premium monthly pricing configured), accuracy/pick-up confirmations.
- Professional: category, identity, address, contact (private), hours, services, licence/insurance
  files, emergency declaration, manual-review confirmation. Plan is “Pricing to be confirmed”.
- Club: name, .org website/email, city/state, breed focus, description, logo/proof, parent-club claim
  (unverified), manual-review confirmation. No AI/domain lookup.
- Event: club, date/time/time zone, venue, capacity, ticket + $2 fee, description, sponsor interest.
  No ticket or payment is created.
- Every form validates in place, keeps values on error, and ends in a clearly labelled review state.

### 5.19 Sponsor inventory preview — `components/domain/ad-slot.tsx`

- The only ad-like component. It renders a dashed “Sponsored placement · sample” card with no brand,
  creative, impression or click.
- The component itself calls `isAdAllowedForPath`; each page must opt in. It is used on home, stud
  list, services, compare, event and breed pages.
- The stud map also supports a gold **sample sponsor pin**; the tooltip says no campaign is live.
- No slot is imported on `/studs/[slug]`, `/puppies/[slug]`, checkout, contract, dashboard or admin.

## 6. Screens and states

| Screen | Implemented states |
| --- | --- |
| Home | Default; featured studs and litters; marketplace cards; no live metrics |
| Directory | Default list, map, filtered, empty, pagination, loading skeleton, route error |
| Stud profile | Active, expired test (requests paused), missing test (requests paused), no reviews, related/empty |
| Request | Available, blocked by missing/expired test, payment disabled, validation errors, draft ready |
| Puppies | Default, filtered, empty, ready/not-ready, sold out, free listing without reserve |
| Puppy detail | Available/reserved/pending/sold puppies, blocked reservation, price breakdown |
| Reservation | Disabled payment, invalid puppy, open collection rule, no request created |
| Pet services | List/map, seven categories, empty filter, document review, emergency declared, V12 subscription pricing configured |
| Business profile | Contact hidden, emergency declaration, no 24/7 claim, no advertising |
| Clubs | Directory, profile, recommendation, in-review/not-submitted, parent-club claim |
| Events | On sale, sold out, capacity, past; ticket state gallery; sample sponsor |
| Comparators | Three types, filter, sample rows, affiliate disclosure |
| Sponsorship | Site/event plans, local application draft, no campaign metrics |
| Checkout | Hub, pending, failed, confirmed, access denied, contract |
| Admin | Locked, overview, verification/content/users/reports/transactions/sponsors/events |
| Dashboard overview | Populated demo, needs-attention, signals, billing preview |
| My Animals | Male/public, female/private, missing record warning, empty cards |
| My Listings | Public, private, draft, state glossary |
| Requests | Contact unlocked, awaiting payment, declined |
| Messages | Empty + locked state, no invented conversation |
| Contracts | Empty + separate contract states + draft preview |
| Favorites | Hydrating skeleton, empty, populated, remove |
| Billing | Active plan, no payment method, no invoices, plan comparison |
| Settings | Form validation, local save, activity preview, email not connected, delete disabled |
| Activity pages | Business, club, events and sponsorships previews; hidden without activity |
| Registration | Step errors, restored draft, saving/saved, per-step review, submitted-for-review, discard |
| Auth | Login/signup, verify email, forgot password; no credentials collected |
| Editorial | Breed guides and articles, sample content |
| Legal | Terms, privacy, no-delivery; draft banner |
| Heat calendar | Private calendar, local heat/mating entries, estimated due date, disabled notifications |
| Creation flows | Litter/professional/club/event forms, validation, manual-review success states |
| 404 / 403 / error | Recovery actions, no stack details |
| Demo | Real vs simulated, open decisions |

---

## 7. Responsive behaviour

Breakpoints: `sm` 640 px, `md` 768 px, `lg` 1024 px, `xl` 1280 px.

- Public header nav becomes a disclosure below 1280 px (six destinations plus account actions).
- Hero stacks at 1024 px; the map panel becomes full width.
- Directory: filters above results below 1024 px; two-column cards from 640 px; one column below.
- Profile: single column below 1024 px, price/request card after the gallery and before the long
  details; sticky sidebar only on large screens.
- Dashboard: sidebar becomes a wrapping chip strip below 1024 px; all content stays within the
  viewport (verified at 390 × 844).
- Admin: sidebar becomes a wrapping chip strip; tables scroll inside a focusable region.
- Event/checkout/contract: single column below 1024 px; sticky summary only on large screens.
- Tables scroll inside their own container, never the page.
- Buttons have a minimum 36–44 px target; the primary mobile actions are full-width where practical.
- The maps never rely on hover: pins are links, the list view is always available.

---

## 8. Advertising boundary

The build now renders **clearly labelled inventory previews**, not live campaigns. The policy is
encoded in `lib/config/features.ts`:

- Allowed placements: home top banner, native card on the stud list, map sidebar, breed sidebar,
  services sidebar, comparator top, event page.
- Rendered in this delivery: home banner, stud list native, map sidebar, services sidebar, comparator
  top, event page, breed sidebar.
- Forbidden: `/studs/[slug]`, `/puppies/[slug]`, `/dashboard/**`, checkout/contracts, admin, and any
  animal gallery. These routes import no `AdSlot`.
- Professional profile ads are **undecided** and are omitted.
- The gold sponsor pin is a sample placement marker; it has no link or brand.
- A global layout must never inject an ad; each page opts in, and `isAdAllowedForPath` checks the
  path before rendering.

No sponsor logo, impression, click, audience metric or partner is invented in this build.

---

## 9. Accessibility checklist

Implemented and verified in Chromium:

- Landmarks: header, nav, main, footer; skip link as first tab stop.
- Visible focus: 3 px outline, 3 px offset, navy on light and orange on dark.
- All form fields labelled; errors associated and summarised; focus moves to the summary.
- Status text never depends on colour; disabled controls are still understandable.
- Mobile menu: `aria-expanded`, `aria-controls`, Escape close, focus return.
- Gallery: labelled buttons, arrow-key support, live count.
- Map: interactive Leaflet region plus accessible list; caption describes approximation, retry and fit-to-results actions are keyboard accessible.
- `lang="en-US"`, metadata present, `robots: noindex` on preview and personal routes.
- axe-core is run by four Playwright suites covering public sections, dashboard/forms, checkout,
  admin, legal, editorial, redirects, heat calendar and creation forms. See
  [docs/VERIFICATION.md](./docs/VERIFICATION.md).

Not yet verified: screen-reader testing (NVDA/VoiceOver), Safari/Firefox, zoom at 200–400%,
high-contrast mode, reduced-data conditions.

---

## 10. Design decisions still open

- Client approval of the traced logo and proposed palette/typography; the vector asset is implemented.
- Whether animal photography replaces the illustrative portraits, and where it is stored.
- Leaflet is implemented with local vector geometry. Third-party tile-provider configuration remains unselected.
- Whether the sample sponsor inventory becomes real inventory, and which placements are sold.
- No advertising on professional detail profiles, as resolved by D-016. Keep the same restriction in the backend ad service.
- Whether the heat estimate should use a different algorithm or a veterinarian-defined window.
- Icon library and illustration system at scale.
- Dark mode (not proposed; the brand reads best on warm paper).
- Exact empty/error copy for backend failures once real endpoints exist.
- The 14-day brucellosis listing rule and its legal review.
- Remaining unresolved decisions in [docs/DECISIONS_OPEN.md](./docs/DECISIONS_OPEN.md), reconciled against the V12 resolutions D-012–D-017 before treating an older conflict as still open.

---

## 11. Journal — Frontend

### Passation — Frontend — 2026-11-06

- État : mise à jour CDC V11→V12 engagée ; le chantier Blog + GODPET est livré, build vert.
- Fait : routes `/blog` (+ 15 articles SSG), `/blog/[slug]`, `/godpet`, `/godpet/certificate/[id]`.
  `node node_modules/typescript/bin/tsc --noEmit` OK (0 erreur) ; `next build` OK. 15 articles
  statiquement générés. Génération GODPET mock déterministe (pas d'appel GPT), PDF gratuit même si
  tip=0, tip champ libre 1-50 sans boutons prédéfinis, photo uniquement à l'étape finale. Sitemap et
  footer étendus (`/blog`, `/godpet`).
- Bloqué : aucun backend — le certificat GODPET est stocké uniquement dans le navigateur (payload
  encodé en URL + photo en `localStorage`), PDF/QR/partage réels non branchés.
- Décision : aucune nouvelle (repose sur `O-23` auth, `O-01`/`O-19` paiement portée).
- Suivant : traiter le chantier « contrats + livraison » (corriger le split 80/320 de
  `STUD_REQUEST_FEE` dans 5 écrans, ajouter les champs `deliveryMode`/`deliveryFee`/`escrowReleaseAt`
  au contrat chiot), puis sponsors, pros, KYC/ADN.

### Passation — Frontend — 2026-11-06 (passe 2)

- État : contrats + livraison migrés en V12 (deposit escrow), couleurs de carte pros en hex CDC V12,
  build vert.
- Fait : migration de 5 écrans de `STUD_REQUEST_FEE` vers `STUD_PRICING` (deposit 400 escrow appliqué
  au stud fee, service 300 non remboursable, balance 1600 escrow, total 2300) ; suppression du split
  80/320. Section « Delivery » ajoutée au checkout portée (`deliveryMode`, `deliveryFee`,
  `deliveryTransporter`, `pickupDate`/`deliveryDate`, `escrowReleaseAt` = livraison +48 h, option
  désactivée). Couleurs pins pros en hex V12 (Vet #E53935, Emergency #B71C1C, Groomer #1E88E5,
  Trainer #43A047, Boarding #FB8C00, Shelter #8E24AA, Pet Store #FDD835) via `professionalCategoryColor`.
  `tsc --noEmit` OK, `next build` OK.
- Bloqué : GRIS/DORÉ des pins et badge licence IA nécessitent un champ `plan` sur `Professional`
  (type + `lib/data/demo/professionals.ts` + consommateurs) — non fait pour éviter la régression.
  Sponsors et KYC/ADN non entamés (volume important).
- Décision : aucune nouvelle.
- Suivant : ajouter le champ `plan` (`free`/`standard`/`premium`/`boost`) à `Professional` pour les
  pins GRIS/DORÉ + badge licence, puis sponsors (réservation Airbnb + 2 tunnels + 2 TDB), puis KYC/ADN.

### Passation — Frontend — 2026-11-06 (corrections et prévisualisation V12)

- État : correction du frontend V12 disponible localement sur `http://127.0.0.1:3000` ; toutes les intégrations absentes restent explicitement démonstratives.
- Fait : cartes Leaflet 1.9.4 avec géométrie locale US Atlas, zoom/déplacement, marqueurs accessibles et lien sponsor fictif ; filtres étalon couleur/âge/records/rayon depuis cinq villes de démonstration ; remplacement des choix Basic/Premium V11 dans l'inscription et la facturation par Free/Starter/Pro/Unlimited. Fiches professionnelles gratuites inactives, rue/ZIP retirés des fiches publiques, pins gris/couleur/doré aux tailles V12. Les coordonnées des pins professionnels sont approximatives.
- Fait : `/dashboard/import` propose une simulation KYC propriétaire, import CSV local avec modèle, contrôle des puces/doublons/dates/brucellose/ADN, édition, duplication, suppression, pagination et sauvegarde locale ; aucun OCR, XLSX ou scan URL n'est prétendu actif. Panneau ADN/tares dans le formulaire animal. Les coches d'éligibilité restent des déclarations de démonstration, jamais des preuves vérifiées.
- Fait : tunnel sponsor local à sept étapes avec choix race/page/mois/format, calendrier illustratif, délai local de quinze minutes, aperçu de file d'attente, fichiers locaux, paiement désactivé, décisions événement simulées et indicateurs sans chiffres inventés. Email club copiable dans `/dashboard/club` et `/dashboard/club/events/[id]`. Aucune disponibilité réelle, exclusivité concurrente, proposition, campagne, statistique ou opération de remboursement n'est créée.
- Fait : dépôt appliqué au stud fee, service séparé, contrat saillie corrigé ; aperçu distinct du contrat chiot `/contracts/CB-PUPPY-2026-1042`, accessible depuis le tableau des contrats. Champs de handover/livraison et estimation de date, transporteur désactivé. Aucun formulaire ne déclenche un déblocage de contact, une signature ou une libération d'escrow.
- Fait : quinze articles de démonstration enrichis à six sections, temps de lecture calculé, couverture de marque et CTA GODPET/éleveur ; contenus encore abrégés, sans prétendre satisfaire la longueur éditoriale finale 800–1 200 mots ni disposer d'une relecture experte. GODPET exclut les commandes proches par distance de Levenshtein, identifie les disponibilités sociales comme simulées et contrôle format/taille de la photo ; PDF/QR et bonus payants restent non branchés conformément au périmètre de prévisualisation.
- Vérifié : `node node_modules/typescript/bin/tsc --noEmit` (0 erreur) ; `node node_modules/next/dist/bin/next build` (exit 0, 119 pages générées) ; `node scripts/verify-ui.mjs` (50/50), `node scripts/verify-marketplace.mjs` (49/49), `node scripts/verify-remaining.mjs` (50/50), `node scripts/verify-cdc.mjs` (42/42), `node scripts/verify-v12.mjs` (23/23). Total 214 contrôles, aucun échec, aucune violation axe sur les scans exécutés ; `node scripts/check-routes.mjs` : 105 routes, aucun échec. Huit URL contrôlées en complément, dont les nouvelles routes, répondent 200. Captures courantes dans `artifacts/` et `artifacts/v12/`, dont carte, import mobile et tunnel sponsor, inspectées pendant la session. Les assertions de marqueurs attendent désormais Leaflet ; celle des tarifs professionnels suit V12.
- Bloqué : backend/auth/stockage/paiement/IA/PDF/signature absents ; calendrier sponsor illustratif et réservation exclusive à implémenter côté serveur ; clauses santé/légal et longueur finale des articles à finaliser avant publication. Le chevauchement entre libération à 48 h et réclamation à 72 h doit être arbitré. Aucun dépôt Git détectable dans ce dossier : aucun commit ni push effectué. Audit Python du skill non exécuté, interpréteur Python indisponible ; ne pas confondre les tests exécutés avec une certification globale de conformité.
- Décision : aucune nouvelle décision commerciale ; application des tarifs V12 déjà consignés et conservation du mode démonstration.
- Suivant : faire relire ces écrans via `T-022`, faire actualiser les statuts par le Pilotage, puis brancher les services réels sous `T-003`/`T-015` et terminer la validation éditoriale avant toute publication.


### Passation — Frontend — 2026-11-06 (finalisation et transfert aux rôles)

- État : finitions frontend livrées et vérifiées en prévisualisation locale ; les intégrations réelles et validations externes sont transférées dans T-023 à T-035, détaillées en section 12.
- Fait : logo SVG fidèle et transparent, JPG original conservé ; cinq illustrations éditoriales SVG et versions PNG 1200 × 630 pour partage. Quinze articles de 890 à 936 mots de corps chacun, six sections, trois FAQ, sources et date de vérification, sommaire ancré, métadonnées et couvertures. Cent suggestions japonaises distinctes et vingt suggestions French Bulldog sont présentes. Aucune validation vétérinaire/juridique/linguistique n'est revendiquée ; trois anciens articles sont conservés.
- Fait : filtres couleur/âge/records/rayon visibles et supprimables, bornes d'âge/coordonnées normalisées, tri conservant tous les filtres et pagination réinitialisée, recherche effaçable avec retour du focus, villes du catalogue ajoutées. Carte avec reprise après échec, annulation de requête et recentrage. Calendrier sponsor correct selon mois/année bissextile, retour du focus lors des étapes et erreurs associées aux champs. ADN hors 0–100 et fichier incorrect signalés. CSV mal formé refusé sans altérer les brouillons ; restauration locale validée, erreurs de sauvegarde annoncées, filtre sans résultat récupérable et pagination bornée. Suppression du qualificatif « Verified » dans le titre global du site.
- Vérifié : `node node_modules/typescript/bin/tsc --noEmit` sans erreur ; `node node_modules/next/dist/bin/next build` exit 0, 119 pages générées. Sur ce build : `verify-ui.mjs` 50/50, `verify-marketplace.mjs` 49/49, `verify-remaining.mjs` 50/50, `verify-cdc.mjs` 42/42, `verify-v12.mjs` 23/23, `verify-frontend-finish.mjs` 52/52 : **266 contrôles, zéro échec final et zéro violation axe sur les scans exécutés**. `node scripts/check-routes.mjs` : 105 routes, zéro échec. Le test historique de navigation vers request attend désormais l'URL et le bouton cible, au lieu de conclure après un délai fixe ; son premier passage prématuré a échoué, le passage final réussit sans réduire les assertions. Formatter Prettier exécuté sur les fichiers modifiés ; liens locaux de README/DESIGN/TASKS vérifiés.
- Preuves : `artifacts/frontend-finish/results.json`, `editorial.json`, captures desktop/mobile et des autres suites ; `artifacts/logo-vector-comparison.png` inspecté. SVG sans raster embarqué ; comparaison de silhouette 99,51 % selon le traceur. Images du blog, carte et tunnel sponsor inspectées. Serveur de production local relancé sur `http://127.0.0.1:3000`.
- Bloqué : API/auth/paiements/stockage/IA/PDF/signatures non implémentés ; photos réelles et identité finale à approuver ; relectures santé/légales/linguistiques et règle 48 h/72 h à finaliser. Firefox/Safari, lecteurs d'écran et zoom natif restent non testés ; le test 200 % est une émulation CSS de mise en page. L'auditeur Python du skill n'a pas pu s'exécuter (interpréteur absent). Google Fonts a subi des délais réseau en développement ; le build final a réussi, le déploiement doit vérifier sa reproductibilité. Aucun Git détectable, aucun commit/push ni déploiement externe effectué.
- Décision : aucune nouvelle décision commerciale ; application des D-012 à D-017 existantes. La vectorisation et les illustrations restent dans la direction visuelle proposée.
- Suivant : Pilotage, traite T-023 et attribue l'implémentation serveur ; Analyse, traite T-024 ; Backend, commence T-025 ; Testeur/Relecteur, exécute T-031/T-032 ; Mise en ligne, prépare T-033 sans publier. Reviens au Frontend avec les contrats acceptés et constats pour T-034/T-035.

## 12. Role handoff: frontend V12 finalization

This is the shared transfer record requested by the owner. The receiving roles have **not** executed these tasks merely because they are listed here. Read DOC/V11 first for history, then DOC2/V12 for superseding requirements. Client documents remain uncommitted. Existing task statuses are left to Pilotage. New tasks T-023 to T-035 link here.

### Reading order and acceptance boundary

Read AGENTS.md, your role prompt, docs/TASKS.md, docs/DECISIONS.md (especially D-012 to D-017), docs/CDC_V12_DIFF.md and the relevant source-docs/text-v2 fiche. Older API_NEEDS/PROJECT/API_CONTRACT statements may still reflect V11; resolve against decisions, do not silently restore outdated behavior. A working demonstration is not a functioning marketplace. No public deployment, real payment, real identity collection, external message or provider provisioning was performed in this pass.

### Handoff Pilotage

**T-023; owner: agents/pilotage.md.** Update PROJECT, DECISIONS and TASKS after reviewing the frontend evidence. Reconcile T-011/T-014/T-019/T-020/T-021 with the delivered code and T-022/T-032 review; do not mark integrations complete. D-012 to D-017 already resolve several old blockers, but PROJECT section 7 and portions of API_NEEDS/API_CONTRACT still say pending/contradictory. Reconcile these through their owners. Confirm actual Git repository and intended branch; no .git was detectable and no commit/push was made. Obtain approved photos, usage rights and identity approval; SVG tracing does not create approval. Resolve O-24 tile/geocoding provider, budgets/keys and privacy policy; local map geometry remains sufficient for preview. Clarify Founder quotas under O-11 and track the 48-hour release / 72-hour claim overlap with Analyse. The current Backend role prompt is design-only: assign implementation ownership explicitly before T-026 to T-030 begin. **Acceptance:** every remaining blocker has a decision ID, owner, dependency and next action; existing statuses cite evidence, no simulated feature is marked production-ready.

### Handoff Analysis

**T-024; owner: agents/analyse.md.** Update PROJECT section 7 and proposed DECISIONS entries, not frontend code. Review the 15 articles in lib/data/demo/articles.ts, blog-context.ts and blog-sources.ts, their linked primary sources, exact title promises and fact-check dates. Obtain competent veterinary/legal/editorial review before removing draft disclosures. Do not equate a source check with expert approval. Verify AB 702 session/status, state-specific transfer/licensing rules and cost examples against their stated scope; preserve the distinction between platform rules and law. Validate genetic versus clinical tests in components/forms/animal-health-panel.tsx (BOAS/EPI and homozygous-result labels particularly need review), breed panels, DNA threshold/mismatch, carrier handling, outcross policy, KYC/licensing thresholds and test freshness boundaries. Propose an explicit rule for claims arriving after the 48-hour release but within the 72-hour window; clarify second-chance eligibility and required evidence. **Acceptance:** each rule cites file/section or official source, status and UI/server consequence; conflicting rules have a proposed decision and no fabricated resolution.

### Handoff Backend

**Owner: agents/backend.md.** First deliver T-025 within the current role's design scope. T-026 to T-030 require Pilotage to assign server implementation ownership. Do not edit frontend screens or infer API behavior from a local demo success.

- **T-025 - contract alignment.** Reconcile DATA_MODEL and API_CONTRACT with V12 and D-012 to D-017. Document every request/response/authorization/error with examples. Reconcile the existing Problem Details error envelope in API_CONTRACT with the older error object in API_NEEDS; choose one contract through the maintained document and provide an adapter plan. Server money uses integer cents/USD; frontend preview prices are USD values and require explicit conversion. Specify independent payment, acceptance, signature, fulfillment and payout states. Add color, age, AKC-format, orthopaedic-record and approximate radius filters; document the reference date, units, normalization and pagination. Nationwide city/ZIP lookup, facets, marker payload limits and geocoding policy must replace the bounded preview city list. Public DTOs must omit exact location, street/ZIP, contacts, microchips, private documents and owner IDs unless a separately authorized endpoint requires them. **Acceptance:** fixtures cover success, empty, validation 422, auth 401/403, conflict 409, throttling 429 and retryable failure; no unresolved V11 price/contact rule survives as an active default.
- **T-026 - auth and catalog.** Implement Supabase Auth/session/role enforcement and server-side ownership checks; the demo cookie is not authentication. Extend lib/api/catalog.ts beyond studs/breeds to litters, professionals, clubs, events, account, favorites and mutations; return public location options through a facet endpoint rather than fetching all profiles for geography. Replace direct demo imports by module with Frontend. **Acceptance:** cross-account access is denied server-side, private routes are guarded, paging/filtering are stable, invalid query values are normalized, no private fields leak in HTML/RSC/JSON. Tests demonstrate two distinct users and an admin role.
- **T-027 - orders/contracts/delivery.** Use config-backed server quotes; enforce one puppy reservation atomically and idempotency on orders/webhooks. Contact unlock follows server-confirmed deposit, never a success redirect. Implement authorized contract data, versioned PDF, signatures and audit evidence; keep payment, agreement and payout independent. Source UI: app/contracts/[id]/page.tsx, checkout/stud, checkout/litter, components/forms/delivery-options.tsx. Keep pickup default and transport disabled until approved transporters/prices exist. Actual handover confirmation, not a planned date in the form, drives release. **Acceptance:** repeated webhooks cannot double charge/reserve/refund, failure never unlocks contact, authorized contract access and signed URL expiry are tested, refund/release race follows T-024, no live transaction is used to test.
- **T-028 - sponsors.** Source UI: components/forms/sponsor-booking.tsx, app/dashboard/sponsorships, app/admin/sponsors, app/dashboard/club/events/[id]. Define unique breed/page/month/format inventory, atomic 15-minute hold with authoritative expiresAt, expired/conflict responses and waitlist. Separate creative review, payment, proposal and campaign states; implement club accept/refuse/negotiate and seven-day timeout/refund exactly once. Configure the event 50/50 split from approved pricing. Provide authorized direct email contacts and notification templates, no platform chat. Enforce forbidden ad paths on the server. Report measured views/clicks/CTR/conversions/cost-per-click/top pages only, with zero versus unavailable distinguished and accessible export. **Acceptance:** two simultaneous clients cannot acquire the same slot; expiry, failed payment, rejected creative, refused/expired proposal and duplicate refunds have automated tests. Illustrative calendar colors are replaced only when the real inventory API exists.
- **T-029 - identity/import/health.** Source UI: components/forms/bulk-import-workspace.tsx, animal-health-panel.tsx and animal-registration-form.tsx. One KYC review per owner, private storage, authorized expiring file access, MIME/content/size scanning, explicit retention and audit trail. Implement XLSX/OCR/URL jobs only after provider and ingestion rules are approved; the current CSV import is local and accepts the documented simple format. Server must revalidate microchip format and global uniqueness, birth dates, breed consistency, test dates/status and licensing; local checkboxes are never evidence. Import needs per-row errors, job progress, retry, duplicate resolution and idempotent publication. **Acceptance:** malformed/oversized inputs, reused chips, stale/positive tests, missing evidence and unauthorized documents cannot publish; no private KYC data enters public responses or logs.
- **T-030 - GODPET.** Source UI: components/forms/godpet-form.tsx, components/domain/godpet-certificate.tsx, lib/data/demo/godpet.ts. Define generation service, validated output shape, quotas/rate limits, banned and command-similar names; enforce one free regeneration server-side. Treat social/domain availability as unknown until a real source confirms it. Separate optional tip from free certificate access. Define consent, public certificate payload, removal and photo storage; email/private fields never appear in a public certificate. Produce PDF/QR referencing the canonical certificate URL. **Acceptance:** zero tip still permits the free PDF, failed payment does not block free entitlement, malicious model output is validated, quota bypass and unauthorized certificate edits fail, photo consent/removal are testable.

### Handoff Tester

**T-031; owner: agents/testeur.md; extends T-005/T-007/T-010.** Run typecheck, production build and all six verification suites from README on the same build, then check-routes. Preserve dated JSON/screenshots under artifacts and record actual results in TESTS. New script scripts/verify-frontend-finish.mjs covers coordinate/age parsing, pagination reset, filter chips/clear focus, map fetch failure/retry, invalid DNA/file, leap-year calendar, five axe scans, narrow layouts and 200% CSS zoom layout. CSS zoom is not native browser zoom testing. Add Firefox, Safari on a supported real host, native 200-400% zoom, high contrast, NVDA/VoiceOver and keyboard-only select/calendar/form flows. Review the long editorial pages and map popups on mobile; exercise error/retry, empty and long content. No supported Firefox/Safari runtime or Python interpreter was available in this pass. Add CI after Git ownership is settled. **Acceptance:** browser/version/OS, exact command, count, failures and untested scope recorded; no skipped capability is represented as passed. Backend payment/concurrency/security tests become mandatory as each integration lands.

### Handoff Reviewer

**T-032; owner: agents/relecteur.md; completes T-022/T-004 review.** Inspect changed frontend and written evidence against DOC then DOC2. Check retained demonstration disclosures, faithful vector logo, no invented sponsors/metrics/real animal photos, private street/ZIP omission, separate paid/document/club signals, forbidden ad pages, configured prices, disabled payment/delivery/PDF, article sources and absence of false expert approval. Review URL/RSC payloads as well as visible screens. Review form failure focus and labels, local-storage limitations and all enabled actions. Check README/DESIGN/API document drift and relative links. **Acceptance:** each finding has R-nnn, severity, file:line, evidence, target owner and expected fix; conclude separately on local preview readiness and production readiness. A preview GO is not authorization to take payments or publish legal claims.

### Handoff Release

**T-033; owner: agents/mise-en-ligne.md; extends T-006.** Prepare DEPLOY with reproducible Node/npm installation, build/start, dependency audit triage, env ownership and rollback. Review .env.example, next.config.ts, asset serving (SVG and /maps/us-states.json), noindex, security headers and browser cache. Separate demo, staging and production configuration. Keep provider secrets server-only and never copy client documents or artifacts into public output. After repository/commit confirmation and review GO, prepare an isolated preview with fake data and disabled external side effects. Smoke-test public and demo routes, missing/error states, maps and asset loading, then record URL/build/commit/date and rollback verification. **Acceptance:** explicit Pilotage release decision before external publication; untouched production data, tested rollback or clearly marked untested steps. Local localhost preview is not a deployment.

### Handoff Frontend

**T-034/T-035; owner: agents/frontend.md.** Stay available for the receiver findings. Integrate accepted fixtures/API module by module after T-025; use typed adapters for cents, Problem Details, authorization and states. Preserve form values on failure, announce loading/empty/conflict/session-expiry, prevent duplicate submissions and remove only simulations replaced by tested services. Keep the existing UI primitives and no-ad boundary. Replace sample location options with the approved geocoder/facets; add bounded marker loading/clustering when real dataset volume is known. Replace fictional animal portraits only with approved, licensed, correctly attributed media from T-023; never label generated/sample dogs as real listings. **Acceptance:** tests against the real staging API (including failure/403/409) pass and DESIGN/README disclose the remaining boundaries per module. Genuine animal photographs, final legal approval and real provider capabilities remain dependencies, not cosmetic frontend switches.

### Shared UI behavior maintained in this pass

Existing components/ui/button.tsx owns actions; components/forms/fields.tsx and existing form-input/field-label classes own field appearance. Native select and date/month controls remain platform-owned, as in sibling forms; do not claim custom popup rendering. English US/USD remains the active product locale. app/globals.css owns tokens, focus, reduced motion and the global visible scrollbar baseline; overflow surfaces do not opt into a separate theme. Search uses an explicit GET submission, URL-restored filters and immediate clear; no remote typeahead race is introduced. Map fetches are canceled on disposal, with independent loading/error/retry states. Editorial covers are local SVG illustrations by category, not animal photographs. No new production dependency was added for these finishing changes.
