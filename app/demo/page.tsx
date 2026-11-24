import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { PageHeader } from "@/components/ui/page-header";
import { DEMO_DISCLOSURE, DEMO_SNAPSHOT_LABEL, MARKETPLACE_NOTICE, SITE } from "@/lib/config/site";
import { FEATURES } from "@/lib/config/features";

export const metadata: Metadata = {
  title: "About this preview",
  description: "What is implemented, what is simulated and which decisions are still open.",
};

const WORKING = [
  "Responsive public shell with keyboard-accessible mobile navigation",
  "Stud directory with URL-based filters, sort, pagination and list/map views",
  "Stud profile with gallery, separate signal badges, records and availability",
  "Puppy directory with individually identified puppies and a disabled reservation checkout",
  "Pet-services directory and map with seven categories, no fabricated contacts",
  "Clubs, events, ticket state gallery and sponsorship application",
  "Three sample comparator tables with disclosures and no live affiliate links",
  "Dashboard shell, overview, animals, listings, requests, favorites and billing",
  "Multi-step stud and dam forms with validation, local draft restore and review states",
  "Private heat calendar with local heat/mating entries and an estimated due date",
  "Creation forms for litters, professionals, clubs and events with manual-review states",
  "Checkout summaries for the $400 request and the $3,600 litter total, payment disabled",
  "Draft legal pages, authentication previews, checkout states and demo admin gate",
  "Labelled sponsor-inventory previews only on allowed pages; no ad on forbidden pages",
  "Breed guides and sample editorial articles",
  "Preview map from US Atlas geometry with approximate city pins — no third-party tiles",
  "Sitemap and environment-gated indexing for production review",
];

const SIMULATED = [
  "Accounts and sessions — no authentication is connected",
  "Animal profiles, reviews and metrics — all fictional sample data",
  "Payments, subscriptions, payouts, refunds and escrow — not implemented",
  "Puppy reservations, event tickets, sponsor purchases and contract signatures",
  "File uploads — files stay in the browser and disappear on refresh",
  "Messaging, contracts, email and notifications — not connected",
  "Document review and AKC checks — statuses are illustrative, not registry calls",
  "Founder trial, professional prices, litter fee collection and sponsor inventory",
  "Admin decisions — the admin area uses an open demo gate and disables every action",
  "Heat-calendar save, notifications and veterinary interpretation",
];

const OPEN_DECISIONS = [
  "Whether the $3,600 litter total or only the $600 service fee is collected on-platform",
  "Refund and payout handling when a request is refused after payment",
  "Professional plan prices ($0/$69/$199 versus $99/month, $690/year and $99 boost)",
  "Contact visibility on the free professional plan and publication during review",
  "Founder 90-day trial terms and quotas",
  "Advertising on professional profile pages",
  "The exact 14-day brucellosis listing rule and its legal review",
];

export default function DemoPage() {
  return (
    <>
      <PageHeader
        eyebrow="Preview build"
        title="What is real in this preview — and what is not."
        description={`This build exists to review the frontend and design direction before the backend is connected. ${DEMO_DISCLOSURE}`}
        actions={
          <Link
            href="/studs"
            className="inline-flex min-h-10 items-center gap-2 rounded-full bg-navy-700 px-5 text-sm font-semibold text-white hover:bg-navy-800"
          >
            Explore the directory
            <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
        }
      >
        <div className="mt-6 flex flex-wrap gap-2">
          <Badge tone="navy" icon="info">
            {DEMO_SNAPSHOT_LABEL}
          </Badge>
          <Badge tone="neutral" icon="lock">
            No secrets or real personal data
          </Badge>
          <Badge tone="warning" icon="warning">
            No payment is processed
          </Badge>
        </div>
      </PageHeader>

      <div className="shell py-10 lg:py-14">
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-success-50 text-success-700">
              <Icon name="check" className="h-5 w-5" />
            </span>
            <h2 className="mt-4 font-display text-2xl text-navy-900">Working in this build</h2>
            <p className="mt-1 text-[12px] text-muted">
              Frontend behaviour that can be reviewed without a server.
            </p>
            <ul className="mt-4 space-y-2.5">
              {WORKING.map((item) => (
                <li key={item} className="flex items-start gap-2 text-[13px] leading-relaxed text-muted">
                  <Icon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success-600" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-warning-50 text-warning-700">
              <Icon name="info" className="h-5 w-5" />
            </span>
            <h2 className="mt-4 font-display text-2xl text-navy-900">Simulated or absent</h2>
            <p className="mt-1 text-[12px] text-muted">
              These areas are labelled in the interface and must not be read as capabilities.
            </p>
            <ul className="mt-4 space-y-2.5">
              {SIMULATED.map((item) => (
                <li key={item} className="flex items-start gap-2 text-[13px] leading-relaxed text-muted">
                  <Icon name="close" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning-700" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="mt-8 rounded-2xl border border-line bg-white p-6 shadow-card">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl text-navy-900">Open decisions</h2>
              <p className="mt-1 max-w-2xl text-[12px] leading-relaxed text-muted">
                These are consciously not settled by the frontend. No option is presented as
                approved, and no price marked “pending” is used to charge anything.
              </p>
            </div>
            <Badge tone="accent" icon="clock">
              Awaiting pilot/client
            </Badge>
          </div>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {OPEN_DECISIONS.map((decision) => (
              <li key={decision} className="flex items-start gap-2 rounded-xl bg-cream-50 p-3 text-[12px] leading-relaxed text-muted">
                <Icon name="chevron-right" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-600" />
                {decision}
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
            <h2 className="font-display text-2xl text-navy-900">Data and privacy rules</h2>
            <ul className="mt-3 space-y-2.5 text-[13px] leading-relaxed text-muted">
              <li>
                Public animal records contain no exact address, ZIP, phone number or email. This is
                enforced by the data shape, not by hiding elements with CSS.
              </li>
              <li>
                Uploaded documents are represented by a status only. No permanent public link is
                generated.
              </li>
              <li>
                The map uses approximate city coordinates and a public-domain US outline; no tile
                provider receives a visitor IP in the preview.
              </li>
              <li>
                Contact details are never unlocked by a redirect. The production rule is a
                server-confirmed payment state.
              </li>
            </ul>
            <p className="mt-4 rounded-xl bg-cream-50 p-3 text-[11px] leading-relaxed text-muted">
              {MARKETPLACE_NOTICE}
              <span className="mt-1 block text-[10px] text-muted">
                Draft wording, pending legal review.
              </span>
            </p>
          </section>

          <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
            <h2 className="font-display text-2xl text-navy-900">Build notes</h2>
            <dl className="mt-3 space-y-2 text-[12px]">
              <div className="flex justify-between gap-3 border-b border-line py-2">
                <dt className="text-muted">Framework</dt>
                <dd className="font-medium text-ink">Next.js 15 · App Router</dd>
              </div>
              <div className="flex justify-between gap-3 border-b border-line py-2">
                <dt className="text-muted">Language</dt>
                <dd className="font-medium text-ink">TypeScript · strict</dd>
              </div>
              <div className="flex justify-between gap-3 border-b border-line py-2">
                <dt className="text-muted">Styling</dt>
                <dd className="font-medium text-ink">Tailwind CSS · local tokens</dd>
              </div>
              <div className="flex justify-between gap-3 border-b border-line py-2">
                <dt className="text-muted">Data</dt>
                <dd className="font-medium text-ink">In-memory demo repository</dd>
              </div>
              <div className="flex justify-between gap-3 border-b border-line py-2">
                <dt className="text-muted">Payments</dt>
                <dd className="font-medium text-ink">Disabled</dd>
              </div>
              <div className="flex justify-between gap-3 py-2">
                <dt className="text-muted">Uploads</dt>
                <dd className="font-medium text-ink">Local only</dd>
              </div>
            </dl>
            <p className="mt-3 text-[11px] leading-relaxed text-muted">
              The stack named in the source specification (Next.js, Supabase, Leaflet, Stripe) is a
              proposal, not an installation. This build uses a replaceable data boundary so the
              backend can be connected without rewriting the screens.
            </p>
            <p className="mt-3 text-[11px] text-muted">
              Questions or corrections:{" "}
              <a href={`mailto:${SITE.supportEmail}`} className="font-semibold text-navy-800 underline underline-offset-2">
                {SITE.supportEmail}
              </a>{" "}
              (placeholder address).
            </p>
          </section>
        </div>

        <p className="mt-8 text-center text-[11px] text-muted">
          Feature flags in this build: data mode <code className="rounded bg-cream-100 px-1 py-0.5">{FEATURES.dataMode}</code>, payments{" "}
          <code className="rounded bg-cream-100 px-1 py-0.5">{FEATURES.payments.enabled ? "on" : "off"}</code>, uploads{" "}
          <code className="rounded bg-cream-100 px-1 py-0.5">{FEATURES.uploads.enabled ? "on" : "off"}</code>.
        </p>
      </div>
    </>
  );
}
