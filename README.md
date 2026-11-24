# CanibookStud — frontend

US marketplace frontend for stud discovery. This repository contains the **frontend
implementation** of the CanibookStud scope: the visual system, stud directory and profile, puppy
litters, pet services, clubs, events, comparators, sponsors, the dashboard, the registration
forms, checkout states, draft legal pages and a demo administration area.

> **Preview status.** Profiles, reviews and metrics are fictional sample data. Platform fees follow the V12 configuration; example listing amounts are not live offers. There is no
> authentication, backend, file storage, payment, messaging or email integration. The UI labels
> every simulated area and never unlocks contact details from a redirect.

- Market: United States · English (US) · USD
- Public site: `canibookstud.com`
- Repository: `https://github.com/Mahefa99/CanibookStud`
- Working branch: `feat/frontend-foundation`
- Design reference: [DESIGN.md](./DESIGN.md)

## What is implemented

| Area | Status | Notes |
| --- | --- | --- |
| Visual system & responsive shell | Done | Tokens, logo, header/footer, mobile navigation, focus states |
| Home | Done | Hero, search, featured studs and litters, services/clubs/events/compare links |
| Stud directory | Done | URL filters, sort, pagination, list/map views, empty/loading/error states |
| Stud profile | Done | Gallery, separate signals, records, availability, reviews, map, no ads |
| Request summary | Done | Price breakdown, blocked states, disabled payment, draft request form |
| Puppies & litters | Done | Individual puppy states, readiness rule, disabled reservation checkout, create-litter form |
| Pet services | Done | Seven categories, list/map, verification states, configured V12 plans, no fake contacts, business onboarding |
| Clubs | Done | Profiles, recommendations, events, registration form, document-review and parent-club claim separation |
| Events | Done | Time zones, capacity, ticket breakdown, ticket states, event creation, sponsorship link |
| Comparators | Done | Three sample tables, disclosures, disabled affiliate actions |
| Sponsorship | Done | Site/event plans, creative review, local application draft, inventory previews |
| Heat calendar | Done | Private month view, local heat/mating entries, 182-day estimate, +63-day due estimate |
| Dashboard | Done | Overview, animals, listings, requests, messages, contracts, favorites, billing, settings |
| Stud & dam forms | Done | 4 steps, validation, local draft restore, consent, in-review state |
| Creation flows | Done | Litter, professional, club and event forms with validation and manual-review states |
| Auth previews | Preview only | Login/signup, verify email, forgot password; no account or session |
| Checkout & contract states | Preview only | $400/$3,600 summaries, pending/failed/confirmed layouts, access denied, draft contract |
| Administration | Demo gate | Overview, verifications, content, users, reports, transactions, sponsors, events |
| Legal pages | Draft | Terms, privacy and no-delivery, explicitly pending legal review |
| Editorial | Sample | Breed guides and articles, labelled as editorial demo content |
| SEO | Preview | Metadata, `sitemap.xml`, indexation gated by env; preview is noindex |
| Payments / uploads / messaging / real auth / AI | **Not implemented** | Explicitly disabled |

## Stack

- Next.js 15.5 (App Router), React 19, TypeScript strict
- Tailwind CSS 3.4 with project tokens in `app/globals.css` and `tailwind.config.ts`
- Leaflet 1.9.4 with local US Atlas geometry for interactive maps; no third-party tiles
- Playwright Core + axe-core for local UI verification

The source specification names Next.js, Supabase, Leaflet, Stripe and associated services. That is a
proposal, not a validated installation. This delivery uses a **replaceable in-memory repository**
(`lib/api/catalog.ts`) so the screens do not depend on demo data. The map uses Leaflet with local US Atlas geometry and no third-party tiles.

## Getting started

Requirements: Node.js 20+ and npm. The project was developed and verified on Node 24 / Windows.

```bash
npm install
npm run dev
# http://localhost:3000
```

Production check:

```bash
npm run typecheck
npm run build
npm start
```

`npm run build` uses the Next.js production compiler. On this Windows host, the DSH sandbox blocks
the worker pipes used by Next; the build was therefore run outside the sandbox during verification.
This is an environment constraint, not a project requirement.

### Dependency layout note

`.npmrc` sets `node-linker=hoisted`. With Node 24, pnpm's isolated symlink layout was not followed
by Next's CommonJS require hook (`styled-jsx`, `@swc/helpers`), which broke the build. A flat
`node_modules` is the reproducible fix. `package-lock.json` is generated with npm.

### Environment

Copy `.env.example` to `.env.local` if you need to override the demo settings. No variable is
required for the demo, and **no secret belongs in this repository**.

| Variable | Default | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_DATA_MODE` | `demo` | Marks the replaceable demo data mode |
| `NEXT_PUBLIC_DEMO_DELAY_MS` | `0` | Artificial repository delay for loading-state review |
| `NEXT_PUBLIC_ALLOW_INDEXING` | `false` | Keeps the fictional preview out of search engines |
| `NEXT_PUBLIC_SITE_URL` | `https://example.com` | Metadata base URL |

## Routes

Public:

| Route | Description |
| --- | --- |
| `/` | Home, search, featured studs and litters, marketplace links, process, safety |
| `/studs` | Directory with `q`, `breed`, `state`, `maxPrice`, `brucellosis`, `color`, `minAge`, `maxAge`, `ofa`, `akc`, `origin`, `radius`, `sort`, `view`, `page` |
| `/studs/[slug]` | Stud profile; no advertising; approximate location only |
| `/studs/[slug]/request` | Request summary and disabled payment state; blocked when the test is not current |
| `/map` | Compatibility redirect → `/studs?view=map` |
| `/stud`, `/stud/[slug]` | Compatibility redirects → `/studs` and `/studs/[slug]` |
| `/pet-services-map`, `/vets` | Compatibility redirects → services map / vet filter |
| `/breed/[breed]` | Compatibility redirect → `/breeds/[slug]` |
| `/puppies` | Litter directory with `q`, `breed`, `state`, `status`, `ready`, `sort` |
| `/puppies/[slug]` | Litter with individually identified puppies and per-puppy states |
| `/puppies/[slug]/reserve` | Reservation summary; payment and reservation disabled |
| `/dashboard/import` | Owner KYC simulation, local CSV import, editable/paginated animal review, local autosave, eligibility gates |
| `/dashboard/club/events/[id]` | Sample club sponsor invitation template; copy only, no email sent |
| `/blog`, `/blog/[slug]` | Fifteen sourced drafts (890–936 body words each), thematic covers, contents links and FAQ; human review remains required |
| `/godpet`, `/godpet/certificate/[id]` | Local name selection and free certificate preview; PDF and real availability checks disabled |
| `/dashboard/litters/new` | Create a litter with individual puppy records; review state |
| `/dashboard/services/new` | Professional onboarding; manual document review, no AI |
| `/clubs/new` | Club registration; manual review, no AI/domain check |
| `/events/new` | Event creation; no ticket sales or payment |
| `/pet-services` | Seven-category directory with `category`, `state`, `emergency`, `view` |
| `/pet-services/[slug]` | Business profile; document review, emergency declaration, configured V12 plans |
| `/clubs`, `/clubs/[slug]` | Club directory and profile with recommendations/events |
| `/events`, `/events/[slug]` | Event list and detail with time zone, capacity and ticket states |
| `/compare` | Comparator hub |
| `/compare/insurance`, `/compare/dog-food`, `/compare/cat-food` | Sample tables, labelled affiliate actions |
| `/sponsors` | Site/event plans and a seven-step local sponsor booking draft |
| `/breeds`, `/breeds/[slug]` | Sample breed guides |
| `/articles`, `/articles/[slug]` | Sample editorial notes |
| `/checkout`, `/checkout/pending`, `/checkout/failed`, `/checkout/confirmed` | Payment states, no provider |
| `/checkout/stud/[slug]`, `/checkout/litter/[slug]` | $400 and $3,600 order summaries with disabled payment |
| `/contracts/[id]` | Draft contract preview, unsigned |
| `/access-denied` | 403 state |
| `/legal/terms`, `/legal/privacy`, `/legal/no-delivery` | Draft legal pages, pending review |
| `/login`, `/signup`, `/verify-email`, `/forgot-password` | Auth previews (no credentials collected) |
| `/admin` and `/admin/*` | Demo-gated administration; access denied by default |
| `/demo` | What is real, what is simulated, open decisions |
| `/sitemap.xml` | Public routes for production SEO; preview is noindex |
| `/robots.txt` | Disallows indexing while the content is fictional |

Dashboard (`/dashboard`, no real session — clearly labelled demo workspace):

`/dashboard`, `/dashboard/animals`, `/dashboard/animals/new/stud`, `/dashboard/animals/new/dam`,
`/dashboard/animals/[id]/heat`, `/dashboard/litters/new`, `/dashboard/services/new`,
`/dashboard/listings`, `/dashboard/requests`, `/dashboard/messages`, `/dashboard/contracts`,
`/dashboard/favorites`, `/dashboard/billing`, `/dashboard/settings`, plus activity-specific pages
`/dashboard/business`, `/dashboard/club`, `/dashboard/events`, `/dashboard/sponsorships`.

The demo account holds Stud owner, Dam owner and Buyer activities. The activity-specific pages are
implemented but hidden from its sidebar; direct links show a clearly labelled preview.

The V12 frontend includes local CSV review, health panels, sponsorship and delivery previews. Remaining integration work includes real auth, payment provider,
uploads, direct email notifications, contract signature, affiliate feeds and admin actions. Club/sponsor communication is direct email, not a planned platform chat.

## Project structure

```text
app/                     Next.js routes, layout, global styles, error/not-found
components/
  admin/                 Admin nav and table shells
  domain/                Cards, galleries, maps, badges, filters, request/reservation forms
  forms/                 Reusable fields, file picker, registration, sponsor, auth forms
  layout/                Header, footer, logo, auth/legal layouts, demo banner
  ui/                    Button, badge, icon, pagination, feedback, page header
lib/
  admin/                 Demo admin session helper (not authentication)
  api/                   Replaceable repository boundary
  config/                Site, navigation, pricing, categories, feature flags
  data/                  Fictional demo records, breeds, articles, admin samples
  search/                URL parsing, filtering, sorting, pagination
  types/                 Public/private domain types
  utils.ts               Formatting, dates, contrast-safe helpers
scripts/                 Playwright + axe verification suites
docs/                    API needs, open decisions, verification record
```

## Architecture rules

1. **Replaceable data layer.** Screens call `catalogRepository`, never `DEMO_STUDS`. See
   [docs/API_NEEDS.md](./docs/API_NEEDS.md).
2. **Central commercial configuration.** Prices, pending statuses and the founder flag live in
   `lib/config/pricing.ts`. A pending price is never used as a total.
3. **Feature flags.** `lib/config/features.ts` disables payments, uploads, messaging, installments,
   escrow and advertising. Contact unlocking requires server confirmation by rule.
4. **Signal separation.** `PlanBadge`, `DocumentationBadge`, `BrucellosisBadge`,
   `AkcBadge` and `ClubRecommendationBadge` are separate components. No combined "verified" badge.
5. **Privacy by data shape.** Public animal types have no street address, ZIP, phone or email.
   Exact addresses never enter the public data. Documents have status, not public URLs.
6. **No advertising on forbidden pages.** `components` currently render no ad slots. The policy and
   placement allow-list are in `lib/config/features.ts`; any future slot must opt in per page.
7. **Server-confirmed states.** The interface treats `awaiting_payment`, `payment_pending`,
   `payment_failed`, `contact_unlocked`, `declined`, contract and payout as distinct states.

## Demo data

- 10 fictional studs, 2 fictional dams, 4 litters with individual puppies, 8 professionals,
  3 clubs, 3 events, 3 sample requests and 2 sample sponsors.
- The snapshot date is **Nov 4, 2026**. Document statuses and readiness dates are computed against
  that date so the preview is stable.
- Portraits are **illustrations**, labelled as such, not photographs of the animals or businesses.
- The logo is the supplied client asset at `public/brand/canibookstud-logo.jpg`.
- No real personal data, bank data, identity documents or secrets are committed.

## Accessibility

- Keyboard skip link, visible 3px focus ring, real labels, `aria-invalid` + described errors,
  error summary links, native form controls, status text independent of color.
- Mobile menu is a labelled disclosure; Escape closes it and returns focus.
- Gallery is button-driven with a polite image counter and arrow-key support.
- Leaflet maps have an accessible listing, linked marker popups, fit-to-results and retry actions. Locations remain approximate.
- Axe scans are part of `npm run verify:ui`. See [docs/VERIFICATION.md](./docs/VERIFICATION.md).

## Verification

```bash
npm run typecheck   # strict TypeScript
npm run build       # production build
npm start           # in another terminal
npm run verify:ui   # core: studs, dashboard, forms, auth, mobile
node scripts/verify-marketplace.mjs   # puppies, services, clubs, events, compare, sponsors
node scripts/verify-remaining.mjs     # admin gate, checkout states, legal, editorial
node scripts/verify-cdc.mjs           # redirects, heat calendar, creation forms, ads, sitemap
node scripts/verify-v12.mjs           # V12 import, sponsor, health and editorial preview
node scripts/verify-frontend-finish.mjs # search boundaries, recovery, calendar, accessibility, mobile
node scripts/check-routes.mjs         # HTTP smoke check
```

The verification scripts need Chrome. Set `CHROME_PATH` if it is not at the default Windows path.
Screenshots are written to `artifacts/` (gitignored). Results are recorded in
[docs/VERIFICATION.md](./docs/VERIFICATION.md).

Latest frontend pass (2026-11-06): typecheck and production build pass (119 generated pages); the six suites above pass 266 checks combined and the route smoke test passes 105 URLs. Current evidence and transfer are in [DESIGN.md](./DESIGN.md); the Tester-owned historical report is not silently overwritten. Chromium only, with no axe violations on the executed scans; this is not a certification of complete accessibility or production readiness.

## Known limitations

- Authentication is not implemented; the dashboard is an open, labelled demo workspace. Production
  must gate each route server-side and render an access-denied state.
- The admin area uses an open **demo cookie gate**: anyone can enter. It is not a security boundary.
  Admin approve/reject/refund actions are disabled, and there is **no AI or automation**.
- Payments, webhooks, payouts, refunds, escrow and installments are not implemented.
- Puppy reservations, event tickets, sponsor purchases and contract signatures are preview screens
  only; no reservation, ticket, campaign or signed document is created.
- Advertising is displayed as clearly labelled **inventory preview** on allowed pages only. No
  sponsor brand, campaign, impression or click is represented; forbidden pages render no slot.
- The heat calendar entries are local-only and disappear on refresh. Estimates are not diagnoses.
- Uploads stay in browser memory; drafts (non-file fields) use `localStorage`.
- Messaging and contracts are empty/draft states, not working features.
- Maps use local vector geometry and approximate/sample coordinates. Radius search uses straight-line distance from a selected sample city, not driving distance. Public professional pages omit street/ZIP. Nationwide city/ZIP lookup and a tile provider still need backend/product configuration.
- Comparator rows, ratings and affiliate relationships are fictional and inactive.
- The legal pages are drafts pending legal review and are not final policy.
- `sitemap.xml` exists, but the preview is deliberately noindexed. Set
  `NEXT_PUBLIC_ALLOW_INDEXING=true` only after content/legal approval.
- Browser verification covered Chromium only; Safari/Firefox, screen readers and real mobile devices
  are still to be checked.

## Coordination

This repository is the **DESIGN/frontend reference** for the mission. It does not replace PROJECT,
DECISIONS, TASKS, DATA_MODEL, API_CONTRACT, TESTS or REVIEW. The items that must be transmitted to
the other teams are listed at the end of [docs/API_NEEDS.md](./docs/API_NEEDS.md) and
[docs/DECISIONS_OPEN.md](./docs/DECISIONS_OPEN.md). No other discussion has automatically received
these files or decisions.

The latest detailed transfer to all six receiving roles is in [DESIGN.md — role handoff](./DESIGN.md#12-role-handoff-frontend-v12-finalization). Work is queued in `docs/TASKS.md`; writing a handoff does not mean the receiving agent has executed it.

The working protocol is in [AGENTS.md](./AGENTS.md): one discussion per role, one owner per document,
and a written handover at the end of every session. The documents it governs are
[docs/PROJECT.md](./docs/PROJECT.md), [docs/DECISIONS.md](./docs/DECISIONS.md),
[docs/TASKS.md](./docs/TASKS.md), [docs/DATA_MODEL.md](./docs/DATA_MODEL.md),
[docs/API_CONTRACT.md](./docs/API_CONTRACT.md), [docs/TESTS.md](./docs/TESTS.md),
[docs/REVIEW.md](./docs/REVIEW.md) and [docs/DEPLOY.md](./docs/DEPLOY.md).

No Git metadata was detectable in this workspace during this frontend pass. No commit or push was performed; Pilotage must confirm the repository/branch before integration.

## Supabase account setup

Apply `supabase/migrations/001_initial_schema.sql` once to a fresh application schema.
Set the project's URL and publishable key in `.env.local`. Enable Email authentication
and Confirm email in Supabase Auth. Set Site URL to the app origin (locally
`http://localhost:3000`). In the Confirm signup email template use this link:

```html
<a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}">Confirm email</a>
```

The account trigger provisions the profile and selected activities in the same
transaction as signup. Staff privileges come only from administrator-managed
Auth app metadata. KYC results are read-only for account holders.

## Litter listings

After migrations 001 and 002, apply `supabase/migrations/003_litter_publication.sql`
in Supabase SQL Editor. The migration also creates the private litter-photos
bucket and its object policies. Existing published litters younger than 56
days return to draft. Existing listings start with an empty photo array.

Sign in and visit /dashboard/animals/new/litter. The server rejects underage
litters and stores USD as integer cents. The free listing runs for seven days.
Public detail URLs use the litter UUID. Only published, unexpired litters are
visible to the anonymous catalog. Up to four JPEG, PNG or WebP photos are
accepted per listing, with a limit of 1 MiB per file.

## Stripe Connect sandbox

Apply migrations through 004_stripe_foundation.sql. Set the Stripe test publishable
and secret keys, Supabase server-side secret/service_role key, and NEXT_PUBLIC_SITE_URL
in .env.local. For local testing set the URL to http://localhost:3000. Enable Connect
on the US platform sandbox. Install Stripe CLI and run:

```powershell
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe --forward-connect-to localhost:3000/api/webhooks/stripe
```

Copy the listener's whsec_ value to STRIPE_WEBHOOK_SECRET. Use a distinct
STRIPE_CONNECT_WEBHOOK_SECRET only for a separately signed Connect endpoint.
Restart Next and open /dashboard/billing as a breeder. Complete Express onboarding.
To smoke-test signature delivery in a second terminal use
`stripe trigger payment_intent.succeeded`. This fixture has no marketplace
reservation and must not grant access or release funds.
