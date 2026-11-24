# Verification record — frontend scope

**Date:** November 4, 2026
**Environment:** local production build, Windows, Node 24, Chrome (headless via Playwright)
**Branch:** `feat/frontend-foundation` (local commits, not pushed)

This file records checks that were actually run. It is not a promise that untested routes or
browsers work.

---

## Commands

```bash
npm run typecheck
npm run build
npm start                            # http://127.0.0.1:3000
npm run verify:ui                    # core suite
node scripts/verify-marketplace.mjs  # puppies, services, clubs, events, compare, sponsors
node scripts/verify-remaining.mjs    # admin, checkout, legal, auth, editorial
node scripts/verify-cdc.mjs          # redirects, heat calendar, creation forms, ads, sitemap
node scripts/check-routes.mjs        # HTTP route smoke check
```

The scripts need Chrome at the default Windows path or `CHROME_PATH` set. Screenshots and JSON
results are written to `artifacts/` (gitignored). The DSH sandbox on this host blocks the browser
pipe and Next's worker pipes, so verification and builds were run with the environment's full-access
mode. This is a host constraint, not an application requirement.

## Results

| Check | Result |
| --- | --- |
| `tsc --noEmit` (strict) | Pass, 0 errors |
| `next build` | Pass, exit 0 |
| Generated routes | 67 manifest entries (63 page routes + icon/robots/sitemap assets) |
| Core Playwright suite | **50 checks, 0 failures** |
| Marketplace suite | **49 checks, 0 failures** |
| Remaining-scope suite | **50 checks, 0 failures** |
| CDC-compatibility suite | **42 checks, 0 failures** |
| **Total** | **191 checks, 0 failures** |
| Route smoke check | **105 routes, 0 non-200 responses** |
| axe-core WCAG 2.0/2.1 A/AA | **0 violations across 38 page scans** |
| Browser console | Only the intentional 404 document request for `/this-page-does-not-exist` (recorded twice by duplicate listeners); no unexpected errors |
| Uncaught page errors | 0 |
| Horizontal overflow at 390 × 844 | None on 15 checked public, dashboard and admin-adjacent pages |
| Mobile menu | Opens with `aria-expanded="true"`, navigates to `/studs` |
| Keyboard first Tab | Reaches "Skip to main content" |
| Favorites | Heart toggles and the saved profile appears in `/dashboard/favorites` |
| Request payment | `Pay $400` button present and disabled; no unlock |
| Paused profile | Romeo's expired test disables the request CTA and explains it on the request page |
| Directory filters | `breed=French Bulldog` returns 4 profiles; page 2 shows 4 remaining cards |
| Map | 10 stud pins and 8 professional pins, all links with accessible labels |
| Registration form | Validation summary + field link, step navigation, local draft restore, review, consent, demo submission |
| Request form | Consent validation, draft state labelled "not submitted" |
| Puppies | 4 litters, breed filter, individual puppy state, full $3,600 total, disabled reservation |
| Services | 8 businesses, category filter, 8 map pins, no 24/7 claim, no phone number |
| Clubs/events | Club recommendation, event time zone, $27 ticket total, ticket state gallery |
| Comparators | 5 rows, filter, sample score, affiliate link labelled, no live link |
| Sponsors | Sample inventory, no campaign metric, local draft application |
| Admin | Locked by default, admin data absent before unlock, demo gate opens, all eight sections render |
| Checkout/contract | $400 and $3,600 summaries, pending/failed/confirmed states, no real unlock, draft contract, disabled signature |
| CDC routes | `/map`, `/stud`, `/stud/[slug]`, `/pet-services-map`, `/vets`, `/breed/[breed]`, `/dashboard/reservations` redirect correctly |
| Heat calendar | Private month view, local heat + mating entries, +63-day due estimate, no pregnancy claim |
| Creation forms | Litter, professional, club and event forms validate and reach a manual-review state |
| Advertising | Inventory preview present on six allowed paths; absent from stud/litter detail, checkout, contract and dashboard |
| Sitemap | `/sitemap.xml` 200 and includes stud/comparator URLs; preview remains noindex |
| Legal/auth/editorial | Draft banners, neutral password response, breed/article content, axe clean |
| Footer encoding | No mojibake after fixing `·`/`©` encoding |

### axe pages scanned (38)

Core (11): `/`, `/studs`, `/studs?view=map`, `/studs/marlo-northshore`,
`/studs/marlo-northshore/request`, `/dashboard`, `/dashboard/animals/new/stud` (error and success),
`/login`, `/signup`, `/demo`.

Marketplace (14): `/`, `/puppies`, `/puppies/cedar-stone-fall-litter`,
`/puppies/cedar-stone-fall-litter/reserve`, `/pet-services`, `/pet-services?view=map`,
`/pet-services/blue-ridge-emergency-veterinary`, `/clubs`, `/clubs/lone-star-french-bulldog-club`,
`/events`, `/events/frenchie-meetup-austin`, `/compare/insurance`, `/compare/dog-food`, `/sponsors`.

Remaining (12): `/admin` (locked), `/admin` (overview), `/admin/verifications`,
`/checkout/confirmed`, `/contracts/CB-2026-1042`, `/legal/terms`, `/verify-email`, `/forgot-password`,
`/breeds`, `/breeds/french-bulldog`, `/articles`, `/dashboard/business`.

CDC adaptation (1): `/dashboard/animals/dam-sable/heat`.

### Screenshots

Written to `artifacts/` (gitignored, available on the build host):

- Core: `home-desktop`, `studs-list-desktop`, `studs-map-desktop`, `stud-detail-desktop`,
  `request-desktop`, `dashboard-desktop`, `form-errors-desktop`, `form-review-desktop`,
  `form-success-desktop`, `home-mobile`, `menu-mobile`, `studs-mobile`, `stud-detail-mobile`,
  `dashboard-mobile`.
- Marketplace: `home`, `puppies`, `puppy-detail`, `puppy-reserve`, `services`, `services-map`,
  `service-detail`, `clubs`, `club-detail`, `events`, `event-detail`, `compare-insurance`,
  `compare-dog-food`, `sponsors`, plus six mobile captures.
- Remaining: `admin-locked`, `admin-overview`, `admin-verifications`, `checkout`,
  `checkout-confirmed`, `contract`, `legal-terms`, `forgot-password`, `breeds`, `breed-detail`,
  `dashboard-business`, plus four mobile captures.
- CDC: `map`, `heat`, `litter-create`, `checkout-stud`, `checkout-litter`, plus three mobile captures.

### Fixes made because of verification

1. Logo wordmark orange (`#E05C00`) failed contrast on cream → `#B64A00` (5.08:1).
2. Principle numbers and small labels used `navy-300` (2.2:1) → `navy-500`.
3. Small legal notes used `navy-400` on cream (4.05:1) → `muted` (5.86:1).
4. Logo link `aria-label` overrode visible text → removed.
5. Disabled pagination used `opacity-60` (2.56:1) → removed opacity.
6. Placeholder text darkened to `#6B7280`.
7. Mobile dashboard navigation caused horizontal blow-out → wrapping item strip + `min-w-0`.
8. Profile table could widen the page → constrained with `min-w-0`.
9. Multi-step form: "Continue" was replaced by the submit button mid-click, causing a premature
   submit → `preventDefault` + step guard.
10. Draft step restored from a stale debounce → step changes persist immediately.
11. Footer legal "draft" labels used `navy-400` on navy (4.25:1) → `navy-300`.
12. Contract "Not signed" used `navy-400` on cream → `muted`.
13. Admin table scroll containers were not keyboard-focusable → `tabIndex=0` + labelled region.
14. Admin overview queue tables clipped status badges → converted to wrapping lists.
15. Footer `·` and `©` were corrupted by a PowerShell encoding round-trip → restored and checked.
16. Dashboard activity pages (business/club/events/sponsorships) added and linked by activity.
17. Added CDC compatibility redirects for `/map`, `/stud`, `/pet-services-map`, `/vets`,
    `/breed/[breed]` and dashboard aliases.
18. Added the private heat calendar with local heat/mating entries and estimate labels.
19. Added litter, professional, club and event creation forms with manual-review states.
20. Added `/checkout/stud/[slug]` and `/checkout/litter/[slug]` summaries; payment stays disabled.
21. Added policy-guarded sponsor inventory slots and a sample sponsor pin; forbidden pages remain
    ad-free.
22. Added `sitemap.xml` and environment-gated robots indexing; removed the dead sitemap reference.

## Not covered

- Firefox and Safari; iOS/Android real devices.
- Screen-reader walkthrough (NVDA/VoiceOver), 200–400% zoom, Windows high-contrast mode.
- Any backend, webhook, payment, upload, email or messaging behaviour — none exists.
- Admin decisions, sponsor purchases, ticket issuance, reservations, contract signature or payouts.
- AI verification and automation (explicitly excluded by the client).
- Live affiliate links, real sponsor campaigns or comparator data (none is sold or live).
- Load/performance testing; the preview is deliberately noindexed.

## Reproduce the result

```bash
npm install
npm run typecheck
npm run build
npm start
npm run verify:ui
node scripts/verify-marketplace.mjs
node scripts/verify-remaining.mjs
node scripts/verify-cdc.mjs
node scripts/check-routes.mjs
```

Expected summaries:

```json
{ "failures": 0, "checks": 50, "axeViolations": 0, "pageErrors": [] }
{ "failures": 0, "checks": 49, "axeViolations": 0, "pageErrors": [] }
{ "failures": 0, "checks": 50, "axeViolations": 0, "pageErrors": [] }
{ "failures": 0, "checks": 42, "axeViolations": 0, "pageErrors": [] }
```
