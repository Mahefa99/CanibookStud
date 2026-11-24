# API needs — frontend coordination input

**Status:** proposal from the frontend team, to be reconciled with [DATA_MODEL.md](./DATA_MODEL.md)
and [API_CONTRACT.md](./API_CONTRACT.md) — both now exist as v0 drafts. No endpoint below is
implemented or live. Route names are suggestions, not a
contract; the backend owner decides the final shape. The frontend currently reads the in-memory
repository in `lib/api/catalog.ts`.

The purpose of this document is to list what the implemented screens need, which states must be
server-authoritative, and which fields must never appear in a public response.

---

## 1. Non-negotiable backend rules

These are product/security requirements, not frontend preferences:

1. **Contact unlock is server-confirmed.** A payment redirect is never proof. Contact details are
   released only after a signed webhook / verified payment state, and the API must return them only
   in an authenticated, authorised response.
2. **Public animal payloads never contain** a street address, ZIP, exact coordinates, phone, email,
   private document URL or internal owner identifier.
3. **Documents are private.** Return status, type and dates; provide short-lived signed URLs only to
   authorised owners/admins, never in public listings.
4. **Authorisation is per resource and per activity.** Being signed in is not enough to edit a
   stud, read a request, or download a contract. The API must enforce ownership and role.
5. **Payment, acceptance, contract and payout are separate state fields.** Do not collapse them into
   one `status`.
6. **Every price response includes its status.** Pending/unconfirmed prices must not be charged.
7. **No public endpoint may return demo/real data indistinguishably.** The preview identifies sample
   records with a flag in the UI layer; production must have a clear environment boundary.

---

## 2. Public data shapes needed

### 2.1 Stud (public profile)

Proposed response fields (names illustrative):

```json
{
  "id": "uuid",
  "slug": "marlo-northshore",
  "name": "Marlo",
  "breed": "French Bulldog",
  "sex": "male",
  "birthDate": "2023-03-18",
  "weightLb": 27,
  "color": "Blue",
  "location": {
    "city": "Austin",
    "stateCode": "TX",
    "stateName": "Texas",
    "lat": 30.2672,
    "lng": -97.7431,
    "precision": "approximate"
  },
  "headline": "…",
  "description": "…",
  "akc": {
    "numberMasked": "DN•••••482",
    "formatStatus": "format_checked",
    "checkedAt": "2026-10-28"
  },
  "brucellosis": {
    "testDate": "2026-10-27",
    "status": "current",
    "documentStatus": "on_file",
    "reviewStatus": "approved"
  },
  "healthTests": [
    { "id": "…", "name": "OFA hips", "result": "Good", "testedOn": "2025-04-11", "reviewStatus": "approved" }
  ],
  "pedigree": { "sire": "…", "dam": "…", "championBloodline": true },
  "studFeeUsd": 2000,
  "plan": "premium",
  "subscriptionStatus": "active",
  "featured": true,
  "clubRecommendation": { "clubName": "…", "clubSlug": "…", "recommendedOn": "2026-09-14" },
  "photos": [{ "id": "…", "url": "…", "alt": "…" }],
  "availability": [{ "startDate": "2026-11-12", "endDate": "2026-11-26", "status": "available" }],
  "reviews": [{ "id": "…", "authorLabel": "Dam owner · Texas", "rating": 5, "date": "…", "body": "…" }],
  "listingStatus": "active",
  "createdAt": "…"
}
```

Rules:

- `lat`/`lng` are the **approximate city coordinates** or a server-generated offset. Never the exact
  address. The frontend does not compute privacy offsets client-side.
- `numberMasked` is masked; the full AKC number is not public.
- `documentStatus` is a status, never a URL.
- `featured` and `plan` are paid visibility and must not be used as a quality score by the backend.
- `clubRecommendation` is optional and independent.

### 2.2 Search query and result

Query parameters used by the frontend: `q`, `breed`, `state`, `maxPrice`, `brucellosis`, `sort`
(`featured|price_asc|price_desc|youngest`), `page`, `view` (`list|map`).

Proposed `GET /api/studs`:

```json
{
  "items": [ /* public Stud summaries */ ],
  "total": 10,
  "page": 1,
  "pageSize": 6,
  "pageCount": 2
}
```

- Reject unknown sort values with a stable 400 error, or ignore them and return the default. The
  frontend normalises the URL today; the contract must agree.
- Server must apply the same public-field filtering as the detail endpoint.
- Map view needs all matching pins (the frontend requests a large page size); if the dataset grows,
  provide a dedicated `GET /api/studs/map` with bounded/aggregated results.

### 2.3 Public supporting data

- `GET /api/breeds` → canonical breed list for filters/forms.
- `GET /api/states` → code/name, or a static frontend list (currently static).
- `GET /api/clubs/:slug` → public club profile for recommendation context.

---

## 3. Account, activities and dashboard

### 3.1 Account

`GET /api/me` (authenticated) needs:

```json
{
  "id": "…",
  "firstName": "…",
  "lastName": "…",
  "displayName": "…",
  "email": "…",
  "activities": ["stud_owner", "dam_owner", "buyer"],
  "plan": { "tier": "premium", "status": "active", "renewsOn": "…" },
  "profileCompletion": 68,
  "memberSince": "…"
}
```

- The frontend uses `activities` to decide which dashboard sections to render. The server must also
  authorise each section; hiding a link is not access control.
- `email` is private and never included in public payloads.

### 3.2 Dashboard summary

Proposed `GET /api/dashboard` or separate calls:

- active listings count
- open requests count
- unread messages count
- profile completion
- attention items: missing/expired documents, payout not connected
- recent requests (public-safe summaries)
- owned animals (male public, female private)
- subscription, document and club signals **as separate fields**

### 3.3 Animals

- `GET /api/me/studs`, `POST /api/me/studs`, `PATCH /api/me/studs/:id`
- `GET /api/me/dams`, `POST /api/me/dams`, `PATCH /api/me/dams/:id`

Input for a stud (frontend form): name, breed, birth date, weight, color, city, state, headline,
description, AKC number, brucellosis test date, OFA optional, photo references, plan interest.
Input for a dam: same identity/records plus last heat date, cycle length, privacy setting.

Server-side validation must repeat the frontend checks (AKC format, date not in future, cycle range,
required files). The frontend must not be trusted for document validity or plan activation.

### 3.4 Heat calendar

- `GET /api/me/dams/:id/heat` → entries: `{startDate, endDate, matingDate?, studId?, litterId?, pregnant?}`
- `POST /api/me/dams/:id/heat` → log heat
- `POST /api/me/dams/:id/matings` → log mating; due estimate computed server-side
- `POST /api/me/dams/:id/pregnancy` → record optional confirmation
- `GET /api/me/dams/:id/notifications` → planned reminders

Rules: estimates are estimates; a recorded mating does not confirm pregnancy; the 182-day cycle is a
default, not a diagnosis. The UI shows a three-month private calendar, a next-heat estimate and a
mating + 63-day due estimate. Local entries in the preview are not persisted. A future save endpoint
must keep the calendar private and return only to the owner or an explicitly authorised request.

---

## 4. Requests and payments

### 4.1 Create request

`POST /api/studs/:slug/requests` (authenticated)

Input:

```json
{ "damId": "…", "message": "…", "preferredDate": "2026-11-20" }
```

Response:

```json
{
  "requestId": "…",
  "state": "awaiting_payment",
  "amountUsd": 400,
  "platformFeeUsd": 80,
  "ownerAllocationUsd": 320,
  "payment": { "provider": "…", "clientSecret": "…" }
}
```

- `400` validation; `401` unauthenticated; `403` dam not owned / stud paused; `409` duplicate open
  request; `422` listing rule unmet (test missing/expired).
- The server must re-check availability and document freshness at request creation **and** before
  accepting payment, not only on page load.
- Amounts come from server config. Ignore any client-supplied amount.
- Do not use the words "deposit on the stud fee"; the $400 is a request/contact fee.

### 4.2 States

Suggested request state machine:

```text
draft
  └─> awaiting_payment ──> payment_pending ──> contact_unlocked
         │                      │
         └──> payment_failed <──┘
contact_unlocked ──> accepted ──> contract_pending ──> contract_signed
                 └─> declined
accepted/declined ──> refund_pending / refunded (policy to be confirmed)
```

The UI currently renders `awaiting_payment`, `payment_pending`, `payment_failed`,
`contact_unlocked` and `declined`. Additional states must be agreed before implementation.

### 4.3 Contact details

`GET /api/requests/:id` (authenticated, participant only):

- Before `contact_unlocked`: no phone/email fields at all (not hidden fields, not base64).
- After server confirmation: `contact: { phone, email }` plus message thread id.
- The frontend must handle `403` with an access-denied state, not a blank page.

### 4.4 Payment webhook

- Signed webhook is the authority for `contact_unlocked`.
- Idempotency required; replay must not re-unlock or double-allocate.
- Store provider event id, amount, fee, allocation and timestamps.
- The client may poll or receive a realtime update; a success page is only a hint.
- Refund/payout timing remains an open policy decision; the backend should expose a state, not a
  guessed date.

---

## 5. Favorites, messages, contracts, billing

- `GET/POST/DELETE /api/me/favorites` → stud ids, authenticated. The preview uses localStorage and
  must be replaced.
- `GET /api/me/messages` → threads; `GET/POST /api/threads/:id/messages`. Access only after
  `contact_unlocked`. Moderation/report endpoint required.
- `GET /api/me/contracts`; `GET /api/contracts/:id` only for participants; short-lived signed PDF
  URL; e-signature audit fields (who, when, IP, version). This is not implemented.
- `GET /api/me/billing` → plan, status, renewal, invoices, payment method summary. Never return card
  data. Payout account state is a separate field.
- `POST /api/billing/checkout` is not implemented; the preview has no payment provider.

---

## 6. Litters, services, clubs, events, sponsors, comparisons and admin

These public screens are implemented against demo data. The following contracts are needed before
they can be wired to the backend.

### 6.1 Litters and puppies

- `GET /api/litters` with `q`, `breed`, `state`, `status`, `ready`, `sort`.
- `GET /api/litters/:slug` returns the litter and an array of **individual puppies**:
  `{id, name, sex, color, mark, status, reservationId?}`.
- `POST /api/litters` / `PATCH /api/litters/:id` for the breeder.
- `POST /api/litters/:id/puppies` to add an individual puppy.
- `POST /api/puppies/:id/reservations` — reservation for **one puppy**, not the whole litter.
- `GET /api/puppies/:id/reservation` returns the state and a checkout summary.
- Puppy states: `available`, `reservation_pending`, `reserved`, `sold`; litter states:
  `available`, `sold_out`, `expired`, `cancelled`.
- Readiness is a configurable platform rule (56 days in the sample), not a legal claim.
- The open collection decision ($600 vs $3,600) must be server config; do not let the client
  construct the amount. The response should expose `puppyPrice`, `serviceFee`, `total` and
  `collectOnPlatform` once decided.

### 6.2 Professionals

- `GET /api/professionals` with `q`, `category`, `state`, `emergency`, `view`.
- `GET /api/professionals/:slug` with business address, hours, services, photos, document-review
  state, declared emergency flag and plan status.
- `POST/PATCH` for an authorised professional owner.
- Categories: emergency_vet, vet, shelter_rescue, trainer, groomer, boarding_pet_sitter, pet_store.
  “Other” remains an open question.
- Contact fields must be omitted until the free-plan visibility rule is decided.
- Plan pricing is pending; do not return a plan amount as active.
- Emergency declaration must never be expanded into “open 24/7”.

### 6.3 Clubs and recommendations

- `GET /api/clubs`, `GET /api/clubs/:slug`.
- `GET/POST /api/clubs/:id/recommendations` (stud/professional) with club attribution.
- `GET/POST /api/clubs/:id/events`.
- Club verification fields: domain check, parent-club source, document review — kept separate from a
  paid plan. A “parent club claim” is a claim until verified.
- Authorised manager roles and audit logs are required for every mutation.

### 6.4 Events and tickets

- `GET /api/events`, `GET /api/events/:slug`.
- `POST /api/events/:id/tickets` creates a ticket after a server-side payment confirmation.
- Ticket record: `{code, eventId, status: valid|used|refunded|cancelled, checkedInAt?}`.
- A check-in endpoint must be atomic: first scan marks used, a second scan returns the original
  check-in time. Admin check-in requires the admin role.
- Capacity and remaining count must be computed server-side; overbooking is a 409.
- Event prices: ticket + fee = total; the example is $25 + $2 = $27.
- Time zone and start timestamp are stored separately; render in the event zone.

### 6.5 Sponsors

- `GET /api/sponsors/plans` from config; site monthly and event one-time.
- `POST /api/sponsor-applications` with company, contact, plan, period, creative reference and
  event id when applicable.
- Application states: `draft`, `submitted`, `creative_review`, `pending_payment`, `active`,
  `rejected`, `expired`.
- Approval of a creative and confirmation of payment are separate. No banner goes live on
  application alone.
- Reporting must return real measured values only; no placeholder impressions/clicks.
- Event split (50/50 announced) must be contractual configuration, not hard-coded UI.
- Ad placement configuration must be server-owned or env-owned: allowed paths, forbidden paths,
  creative dimensions and campaign status. The frontend `AdSlot` guard is a second line of defence,
  not the only control. No ad may be served by a global layout.

### 6.6 Comparators

- `GET /api/comparators/:type` returns rows, columns, filter values, price `asOf`, affiliate flag and
  disclosure text. The frontend must not invent a quote or rating.
- Affiliate redirects should be server-side, labelled and measured; no live links exist yet.

### 6.7 Administration

- Role-protected endpoints for verification queue, content, users, reports, transactions, sponsor
  creatives and event inventory.
- Every decision records actor, timestamp, resource version and reason. Admin actions are disabled in
  the preview, so no endpoint can be inferred from a working action.
- The demo cookie gate is **not** authentication and must be removed in production.
- Never return private document URLs, card data or full personal data in admin lists; use short-lived
  authorised links and a separate detail endpoint.

The frontend pages exist so these contracts can be reviewed against a real layout. Their presence is
not proof that the backend capability exists.

---

## 7. Error model expected by the UI

```json
{
  "error": {
    "code": "DOCUMENT_EXPIRED",
    "message": "A current brucellosis test is required before a request can be accepted.",
    "field": "brucellosisDate",
    "requestId": "optional"
  }
}
```

- Stable `code` for UI branching; human `message` in English (US).
- `field` for form errors when applicable.
- HTTP status: 400 validation, 401 auth, 403 forbidden, 404 missing, 409 conflict, 422 business rule,
  429 rate limit, 500 unexpected.
- Never include stack traces, secrets or private document URLs in errors.
- The frontend preserves typed values after an error where possible; the API must not require a
  full reload to retry.

---

## 8. Frontend repository mapping

`lib/api/catalog.ts` defines `CatalogRepository`:

- `searchStuds(query)`
- `getStudBySlug(slug)`
- `getFeaturedStuds(limit)`
- `getRelatedStuds(slug, limit)`
- `listBreeds()`
- `listStudSlugs()` (static generation)

Replacing the demo export with an HTTP client is the intended integration point. Dashboard data is
currently imported directly from `lib/data/demo/account.ts`; it must join the same boundary when the
backend lands.

---

## 9. What to transmit to the backend team

1. This document and the public/private field rules.
2. The state machines above, especially **payment ≠ acceptance ≠ contract ≠ payout**.
3. The server-confirmed unlock rule and the webhook authority.
4. The request for masked AKC numbers and private document status (no public links).
5. The listing-rule configuration (14-day window) as configurable policy, not a hard-coded legal
   claim.
6. The open pricing decisions in `docs/DECISIONS_OPEN.md` — the frontend must not choose them.
7. The missing backend responsibilities: auth, uploads, messaging, email, map provider, contract
   generation, payouts, admin.

No other discussion has automatically received these points.
