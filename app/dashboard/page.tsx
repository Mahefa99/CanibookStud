import Link from "next/link";
import type { Metadata } from "next";
import { DemoPortrait } from "@/components/domain/demo-portrait";
import { PlanBadge, BrucellosisBadge, DocumentationBadge, ClubRecommendationBadge } from "@/components/domain/signal-badges";
import { RequestStatusBadge } from "@/components/domain/request-status-badge";
import { Alert, StatCard } from "@/components/ui/feedback";
import { ButtonLink } from "@/components/ui/button";
import { Icon, type IconName } from "@/components/ui/icon";
import { DEMO_REFERENCE_DATE } from "@/lib/config/site";
import { DEMO_ACCOUNT, DEMO_DAMS } from "@/lib/data/demo/account";
import { DEMO_STUDS } from "@/lib/data/demo/studs";
import { ageInYears, formatDate, formatUsd, pluralize } from "@/lib/utils";

export const metadata: Metadata = { title: "Overview" };

const QUICK_ACTIONS: Array<{ label: string; href: string; icon: IconName; note: string }> = [
  { label: "Add a male", href: "/dashboard/animals/new/stud", icon: "paw", note: "Stud profile" },
  { label: "Add a female", href: "/dashboard/animals/new/dam", icon: "heart", note: "Private by default" },
  { label: "Browse studs", href: "/studs", icon: "search", note: "Public directory" },
  { label: "Billing", href: "/dashboard/billing", icon: "card", note: "Preview only" },
];

export default function DashboardOverviewPage() {
  const account = DEMO_ACCOUNT;
  const marlo = DEMO_STUDS.find((stud) => stud.slug === "marlo-northshore");
  const openRequests = account.requests.filter((request) => request.status !== "declined");
  const currentTests = DEMO_DAMS.filter((dam) => dam.brucellosis.status === "current").length + (marlo?.brucellosis.status === "current" ? 1 : 0);
  const animalCount = DEMO_DAMS.length + (marlo ? 1 : 0);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Overview</p>
          <h1 className="mt-2 font-display text-4xl leading-tight text-navy-900">
            Workspace overview
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            Here is what needs attention across your stud and dam profiles. Sample metrics are
            labelled and do not represent a live account.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ButtonLink href="/dashboard/animals/new/stud" size="sm" iconLeft={<Icon name="plus" className="h-4 w-4" />}>
            Add a male
          </ButtonLink>
          <ButtonLink href="/dashboard/animals/new/dam" size="sm" variant="secondary" iconLeft={<Icon name="plus" className="h-4 w-4" />}>
            Add a female
          </ButtonLink>
        </div>
      </header>

      <Alert tone="info" title="Sample workspace">
        This dashboard uses a fictional account. Payments, messages and document uploads are
        disabled. Verification, subscription and club signals are shown separately on purpose.
      </Alert>

      <section aria-label="Account metrics" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active listings"
          value={marlo ? "1" : "0"}
          hint="One sample stud profile is published."
          icon="file"
        />
        <StatCard
          label="Open requests"
          value={String(openRequests.length)}
          hint="Includes one awaiting payment."
          icon="message"
        />
        <StatCard
          label="Unread messages"
          value={String(account.unreadMessages)}
          hint="Messaging is not connected in the preview."
          icon="message"
        />
        <StatCard
          label="Profile completion"
          value={`${account.profileCompletion}%`}
          hint="Sample completion score."
          icon="user"
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(260px,0.75fr)]">
        <div className="space-y-6">
          <section aria-labelledby="attention-heading" className="rounded-2xl border border-line bg-white shadow-card">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 id="attention-heading" className="font-display text-xl text-navy-900">
                Needs attention
              </h2>
              <span className="rounded-full bg-warning-50 px-2 py-0.5 text-[10px] font-semibold text-warning-700">
                2 items
              </span>
            </div>
            <ul className="divide-y divide-line">
              <li className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-3">
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-warning-50 text-warning-700">
                    <Icon name="warning" className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">Willa has no brucellosis test</p>
                    <p className="mt-1 text-[12px] leading-relaxed text-muted">
                      Female profiles are private, but a request cannot proceed without a current
                      test on file.
                    </p>
                  </div>
                </div>
                <Link
                  href="/dashboard/animals"
                  className="shrink-0 text-[12px] font-semibold text-navy-800 underline underline-offset-4"
                >
                  Open My Animals
                </Link>
              </li>
              <li className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-3">
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-info-50 text-info-700">
                    <Icon name="card" className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">Payout account not connected</p>
                    <p className="mt-1 text-[12px] leading-relaxed text-muted">
                      A payment account is required before any real payout. Stripe Connect is not
                      connected in this preview.
                    </p>
                  </div>
                </div>
                <Link
                  href="/dashboard/billing"
                  className="shrink-0 text-[12px] font-semibold text-navy-800 underline underline-offset-4"
                >
                  Open Billing
                </Link>
              </li>
            </ul>
          </section>

          <section aria-labelledby="requests-heading" className="rounded-2xl border border-line bg-white shadow-card">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 id="requests-heading" className="font-display text-xl text-navy-900">
                Recent requests
              </h2>
              <Link href="/dashboard/requests" className="text-[11px] font-semibold text-navy-800 underline underline-offset-2">
                View all
              </Link>
            </div>
            <ul className="divide-y divide-line">
              {account.requests.map((request) => (
                <li key={request.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink">
                      {request.damName} → {request.studName}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted">
                      {formatDate(request.createdAt)} · {formatUsd(request.amountUsd)} escrow deposit
                    </p>
                  </div>
                  <RequestStatusBadge status={request.status} />
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="animals-heading" className="rounded-2xl border border-line bg-white shadow-card">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 id="animals-heading" className="font-display text-xl text-navy-900">
                Your animals
              </h2>
              <Link href="/dashboard/animals" className="text-[11px] font-semibold text-navy-800 underline underline-offset-2">
                Manage
              </Link>
            </div>
            <ul className="divide-y divide-line">
              {marlo ? (
                <li className="flex items-center gap-3 px-5 py-4">
                  <span className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-cream-100">
                    <DemoPortrait photo={marlo.photos[0]!} className="h-full w-full" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink">
                      {marlo.name} <span className="font-normal text-muted">· {marlo.breed}</span>
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted">
                      Male · {ageInYears(marlo.birthDate, DEMO_REFERENCE_DATE)} years · Public profile
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      <PlanBadge plan={marlo.plan} status={marlo.subscriptionStatus} />
                      <BrucellosisBadge record={marlo.brucellosis} referenceDate={DEMO_REFERENCE_DATE} />
                    </div>
                  </div>
                  <Link
                    href={`/studs/${marlo.slug}`}
                    className="shrink-0 text-[11px] font-semibold text-navy-800 underline underline-offset-2"
                  >
                    View
                  </Link>
                </li>
              ) : null}
              {DEMO_DAMS.map((dam) => (
                <li key={dam.id} className="flex items-center gap-3 px-5 py-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-navy-50 font-display text-lg text-navy-700">
                    {dam.name[0]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink">
                      {dam.name} <span className="font-normal text-muted">· {dam.breed}</span>
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted">
                      Female · {ageInYears(dam.birthDate, DEMO_REFERENCE_DATE)} years · Private by default
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      <BrucellosisBadge record={dam.brucellosis} referenceDate={DEMO_REFERENCE_DATE} />
                      <span className="inline-flex items-center gap-1 rounded-full border border-line bg-cream-50 px-2.5 py-1 text-[11px] font-semibold text-muted">
                        <Icon name="lock" className="h-3 w-3" />
                        Private profile
                      </span>
                    </div>
                  </div>
                  <Link
                    href="/dashboard/animals"
                    className="shrink-0 text-[11px] font-semibold text-navy-800 underline underline-offset-2"
                  >
                    Manage
                  </Link>
                </li>
              ))}
            </ul>
            <p className="border-t border-line px-5 py-3 text-[10px] text-muted">
              {animalCount} sample {pluralize(animalCount, "animal")} · {currentTests} with a test
              inside the listing window
            </p>
          </section>
        </div>

        <div className="space-y-4">
          <section aria-labelledby="signals-heading" className="rounded-2xl border border-line bg-white p-5 shadow-card">
            <h2 id="signals-heading" className="font-display text-xl text-navy-900">
              Signals on your account
            </h2>
            <p className="mt-1 text-[11px] leading-relaxed text-muted">
              Three separate records. None of these is a combined “verified” status.
            </p>

            <dl className="mt-4 space-y-4">
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted">Subscription</dt>
                <dd className="mt-1.5">
                  <PlanBadge plan={account.plan.tier} status={account.plan.status} />
                  <p className="mt-1 text-[11px] text-muted">
                    {formatUsd(100)}/month · renews {account.plan.renewsOn ? formatDate(account.plan.renewsOn) : "—"}
                  </p>
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted">Document review</dt>
                <dd className="mt-1.5">
                  <DocumentationBadge status="in_review" />
                  <p className="mt-1 text-[11px] text-muted">
                    One health certificate is waiting for a clearer copy.
                  </p>
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted">Club recommendation</dt>
                <dd className="mt-1.5">
                  {marlo?.clubRecommendation ? (
                    <ClubRecommendationBadge recommendation={marlo.clubRecommendation} />
                  ) : (
                    <span className="text-[11px] text-muted">None</span>
                  )}
                  <p className="mt-1 text-[11px] text-muted">
                    An opinion from a listed club, not a verification.
                  </p>
                </dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="billing-preview-heading" className="rounded-2xl border border-line bg-navy-900 p-5 text-white">
            <h2 id="billing-preview-heading" className="font-display text-xl text-white">
              Billing preview
            </h2>
            <p className="mt-1 text-[11px] leading-relaxed text-navy-200">
              Free breeder subscription in this demo. No card is on file and no invoice is generated in this
              preview.
            </p>
            <ButtonLink href="/dashboard/billing" variant="accent" size="sm" className="mt-4">
              Open billing
            </ButtonLink>
          </section>

          <section aria-labelledby="quick-heading" className="rounded-2xl border border-line bg-white p-5 shadow-card">
            <h2 id="quick-heading" className="font-display text-xl text-navy-900">
              Quick actions
            </h2>
            <ul className="mt-3 space-y-1">
              {QUICK_ACTIONS.map((action) => (
                <li key={action.href}>
                  <Link
                    href={action.href}
                    className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm text-ink hover:bg-cream-50"
                  >
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-cream-100 text-navy-700">
                      <Icon name={action.icon} className="h-4 w-4" />
                    </span>
                    <span className="flex-1">
                      <span className="block text-[13px] font-medium">{action.label}</span>
                      <span className="block text-[10px] text-muted">{action.note}</span>
                    </span>
                    <Icon name="chevron-right" className="h-4 w-4 text-navy-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

