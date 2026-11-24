# Open decisions

**Status:** decisions that this frontend delivery does **not** make. Owners are the pilot/client, the
backend team, or both, as indicated. Until a decision is recorded in DECISIONS, the prototype keeps
the behaviour described below and does not present an option as approved.

**Numbering:** the rows below are referenced `O-01` … `O-32` from [DECISIONS.md](./DECISIONS.md).
When a row is decided, it moves to `DECISIONS.md` as a `D-nnn` and is removed here.

| # | Decision | Why it is open | Prototype behaviour | Owner |
| --- | --- | --- | --- | --- |
| 1 | Litter payment collection: $600 service fee only, or $3,600 total on-platform | Sources conflict; changes checkout, refunds, taxes and payouts | Not implemented. A demo breakdown exists in `lib/config/pricing.ts`; no litter route yet. Never display "Pay $600" if the debit is $3,600. | Client + backend |
| 2 | Buyer/seller split of the $600 service fee | The 15% buyer + 5% seller split is described but not validated | Stored as unconfirmed; no split shown as final | Client |
| 3 | Refund policy when a request is declined after payment | Sources describe non-refundable after mating and a free repeat, but not a refused-after-payment policy | UI shows "declined" and "refund policy pending"; no promise | Client/legal |
| 4 | Payout timing / escrow | "Escrow 48h" is a source claim, not an acquired capability | Payout timing labelled "to be confirmed"; no escrow promise | Client + payments |
| 5 | Free repeat breeding within six months | Appears in sources; conditions and enforceability unverified | Mentioned only as a draft contract topic; not presented as a guaranteed right | Client/legal |
| 6 | Professional plan prices | Sources conflict: $0/$69/$199 versus $99/month, $690/year, $99 boost | Centralised as `PROFESSIONAL_PRICING` with `pending`; no choice made | Client |
| 7 | Professional contact visibility on the free plan | Sources conflict ("invisible number" vs a usable free listing) | Not implemented; no promise | Client |
| 8 | Publication during professional review | Sources allow visible-while-pending in one variant | Not implemented; no decision | Client + backend |
| 9 | Professional "Other" category | Appears in one source only | Kept as an open question; seven categories used elsewhere | Client |
| 10 | Advertising on professional profile pages | Explicitly marked "optional but better zero" | Omitted; policy marks it pending | Client |
| 11 | Founder 90-day trial: duration, quotas, eligibility | Source offer; terms unconfirmed | Config exists with `enabled: false`; never shown as available | Client |
| 12 | 14-day brucellosis window as a hard listing rule | Health/legal claims in the documents are not verified | Implemented as a configurable **listing rule** and labelled as under review, not law | Client/legal + backend |
| 13 | AKC verification depth | Source proposes an AKC API and AI; no credential or contract exists | Only number **format** is checked, labelled "not an AKC registration confirmation" | Client + backend |
| 14 | "Verified" badge semantics | Sources attach it to paid plans and AI checks | Never awarded for payment; document review, subscription and club recommendation are separate | Client |
| 15 | Club verification and AKC Parent Club list | Requires a maintained source and legal review | Club pages not built; no auto-verification | Client + backend |
| 16 | Advertisement inventory and sponsor pricing | Price list exists but no sponsor contracts or inventory definition | No ads rendered; placement allow-list centralised | Client |
| 17 | Event sponsorship 50/50 split | Described as announced, not contracted | Stored as "announced, to be confirmed"; events not built | Client + backend |
| 18 | Installment payments (Klarna/Afterpay/Affirm) | May conflict with animal-sale rules; provider approval unknown | Disabled; no installment wording presented as available | Client/legal + payments |
| 19 | Puppy reservation unit (one puppy vs whole litter) | Source schema is litter-level; brief requires puppy-level clarity | Deferred; no reservation UI. Must be resolved before litter build | Client + backend |
| 20 | Puppy availability threshold | Source 8-week claim is legal/health sensitive | Not presented as a universal verified rule; make it configurable | Client/legal |
| 21 | Delivery | Brief says pick-up only; source legal wording | No delivery offered; pick-up stated; no shipping copy | Client |
| 22 | Terms, privacy and no-delivery policy text | Not legally reviewed | Footer says drafts in preparation; marketplace notice labelled draft | Client/legal |
| 23 | Authentication and session model | No auth provider is connected | Login/signup are previews; dashboard is an open demo workspace | Backend |
| 24 | Map provider and tile licence | Leaflet is a proposal; no key or provider decision | Schematic US map with no third-party tiles; replaceable | Client + backend |
| 25 | Email/SMS provider and notification timing | SendGrid proposed, not validated | Nothing sent; notification preferences disabled | Backend |
| 26 | Admin roles and audit requirements | Not specified in detail | Admin not built; no fake admin access | Client + backend |
| 27 | Data retention and deletion | Requires legal/payment input | Settings shows a disabled delete action | Client/legal |
| 28 | US state/breed canonical lists | Forms need a canonical source | Common static lists in `lib/data`; backend should own the source | Backend |
| 29 | Public display of professional business addresses | Needed for a services directory, but the privacy rule only covers animals | Sample business addresses are shown with a caption; confirm before launch | Client/legal |
| 30 | Affiliate partners and data feed for comparators | Prices, ratings and partnerships must be sourced, not invented | All comparator rows are fictional and all affiliate actions are inert | Client |
| 31 | Editorial ownership of breed guides and articles | Content needs an owner and a review process | Marked sample editorial, not AKC/veterinary advice | Client/editorial |
| 32 | Photography and illustration assets | Current portraits are deliberately illustrative | No real animal or business photo is claimed | Client/design |

---

## Decisions provisionally made by the frontend (not commercial/legal)

These are implementation choices, visible for review, and reversible:

- Next.js 15 App Router + TypeScript strict + Tailwind 3.4.
- In-memory repository behind `CatalogRepository`; no backend calls.
- Schematic map from public-domain US Atlas geometry instead of Leaflet tiles, to avoid an
  unapproved provider/API key and third-party requests in the preview.
- Illustrative animal portraits instead of unlicensed photography.
- Fraunces + Inter typography and the navy/orange/cream palette derived from the logo.
- A 6-card page size for the directory and a `featured` default sort, explicitly labelled as paid
  placement.
- Local draft persistence (`localStorage`) and local favorites; no server persistence.
- All prices that are not confirmed are shown as "Pricing to be confirmed" or not shown at all.

## What must be confirmed before the next slice

1. Litter fee collection and the reservation unit.
2. Professional pricing and free-plan contact visibility.
3. Refund/payout treatment after refusal.
4. Founder terms.
5. Whether the 14-day test rule is a platform rule and its exact wording.
6. Advertising inventory and professional-profile ads.
7. Auth/session ownership and admin roles.

Until then, the relevant screens stay demonstrative, disabled, or out of the navigation. The frontend
will not invent a policy to make a flow look finished.
