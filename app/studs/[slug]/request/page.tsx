import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RequestForm } from "@/components/domain/request-form";
import { Alert } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import { Breadcrumbs } from "@/components/ui/page-header";
import { catalogRepository } from "@/lib/api/catalog";
import { STUD_PRICING } from "@/lib/config/pricing";
import { DEMO_DAMS } from "@/lib/data/demo/account";
import { DEMO_REFERENCE_DATE } from "@/lib/config/site";
import { getRequestAvailability } from "@/lib/stud-status";
import { formatUsd } from "@/lib/utils";

type RequestPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: RequestPageProps): Promise<Metadata> {
  const { slug } = await params;
  const stud = await catalogRepository.getStudBySlug(slug);
  return {
    title: stud ? `Request ${stud.name}` : "Request a stud",
    robots: { index: false, follow: false },
  };
}

const STEPS = [
  { label: "Request details", state: "current" as const },
  { label: "Payment", state: "unavailable" as const },
  { label: "Confirmation", state: "later" as const },
];

export default async function StudRequestPage({ params }: RequestPageProps) {
  const { slug } = await params;
  const stud = await catalogRepository.getStudBySlug(slug);
  if (!stud) notFound();

  const { canRequest, reason } = getRequestAvailability(stud);

  return (
    <>
      <div className="border-b border-line bg-cream-50">
        <div className="shell py-6 lg:py-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Studs", href: "/studs" },
              { label: stud.name, href: `/studs/${stud.slug}` },
              { label: "Request" },
            ]}
          />

          <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <p className="eyebrow">Request · preview</p>
              <h1 className="mt-3 text-balance font-display text-4xl leading-tight text-navy-900 sm:text-5xl">
                Request contact &amp; breeding
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                A {formatUsd(STUD_PRICING.depositUsd)} deposit — escrowed and applied toward the stud
                fee — unlocks contact and the breeding request. It does not confirm a pregnancy.
              </p>
            </div>

            <ol className="flex items-center gap-2 text-[11px]">
              {STEPS.map((step, index) => (
                <li
                  key={step.label}
                  aria-current={step.state === "current" ? "step" : undefined}
                  className="flex items-center gap-2"
                >
                  <span
                    className={
                      step.state === "current"
                        ? "grid h-6 w-6 place-items-center rounded-full bg-navy-700 text-[10px] font-semibold text-white"
                        : "grid h-6 w-6 place-items-center rounded-full border border-line bg-white text-[10px] font-semibold text-muted"
                    }
                  >
                    {index + 1}
                  </span>
                  <span
                    className={
                      step.state === "current" ? "font-semibold text-navy-900" : "text-muted"
                    }
                  >
                    {step.label}
                  </span>
                  {index < STEPS.length - 1 ? (
                    <Icon name="chevron-right" className="h-3 w-3 text-navy-200" />
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <div className="shell py-8 lg:py-10">
        {!canRequest ? (
          <div className="max-w-2xl">
            <Alert tone="warning" title="Requests are paused for this profile">
              {reason}
            </Alert>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              The profile remains visible so the document state is transparent. No payment can be
              started while the listing rule is unmet.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href={`/studs/${stud.slug}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-navy-700 px-5 text-sm font-semibold text-white hover:bg-navy-800"
              >
                <Icon name="arrow-left" className="h-4 w-4" />
                Back to profile
              </Link>
              <Link
                href="/studs"
                className="inline-flex min-h-11 items-center rounded-full border border-line bg-white px-5 text-sm font-semibold text-navy-800"
              >
                Browse other studs
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
            <div>
              <RequestForm
                studName={stud.name}
                studSlug={stud.slug}
                dams={DEMO_DAMS}
                referenceDate={DEMO_REFERENCE_DATE}
              />
            </div>

            <aside className="space-y-4 lg:sticky lg:top-24">
              <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
                <h2 className="font-display text-xl text-navy-900">Price summary</h2>
                <dl className="mt-4 space-y-2.5 text-sm">
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="text-muted">Deposit (escrowed)</dt>
                    <dd className="tabular font-semibold text-ink">{formatUsd(STUD_PRICING.depositUsd)}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-3 pl-3 text-[11px]">
                    <dt className="text-muted">Applied toward the stud fee</dt>
                    <dd className="tabular text-muted">{formatUsd(STUD_PRICING.depositUsd)}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-3 pl-3 text-[11px]">
                    <dt className="text-muted">Service fee (non-refundable)</dt>
                    <dd className="tabular text-muted">{formatUsd(STUD_PRICING.serviceFeeUsd)}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-3 border-t border-line pt-3">
                    <dt className="font-semibold text-ink">Due now (deposit)</dt>
                    <dd className="tabular font-display text-2xl text-navy-900">
                      {formatUsd(STUD_PRICING.depositUsd)}
                    </dd>
                  </div>
                </dl>

                <div className="mt-4 rounded-xl bg-cream-50 p-3">
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="text-muted">Balance (escrowed)</span>
                    <span className="tabular font-semibold text-ink">{formatUsd(STUD_PRICING.balanceUsd)}</span>
                  </div>
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="text-muted">Total (dam owner)</span>
                    <span className="tabular font-semibold text-ink">{formatUsd(STUD_PRICING.totalUsd)}</span>
                  </div>
                  <p className="mt-1 text-[10px] leading-relaxed text-muted">
                    Stud fee {formatUsd(STUD_PRICING.studFeeUsd)} = deposit {formatUsd(STUD_PRICING.depositUsd)} + balance{" "}
                    {formatUsd(STUD_PRICING.balanceUsd)}. The {formatUsd(STUD_PRICING.serviceFeeUsd)} service fee is
                    non-refundable and paid by the dam owner.
                  </p>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    disabled
                    className="inline-flex min-h-11 w-full cursor-not-allowed items-center justify-center gap-2 rounded-full border border-navy-200 bg-navy-50 px-5 text-sm font-semibold text-navy-600"
                  >
                    <Icon name="lock" className="h-4 w-4" />
                    Pay {formatUsd(STUD_PRICING.depositUsd)} deposit — unavailable
                  </button>
                  <p className="mt-2 text-center text-[10px] leading-relaxed text-muted">
                    Payments are disabled in this preview. No card details are collected.
                  </p>
                  <Link
                    href={`/checkout/stud/${stud.slug}`}
                    className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-[11px] font-semibold text-navy-800 hover:border-navy-300"
                  >
                    Preview checkout breakdown
                    <Icon name="arrow-right" className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl border border-line bg-white p-5">
                <h3 className="text-sm font-semibold text-navy-900">What happens after payment</h3>
                <ol className="mt-3 space-y-3 text-[12px] leading-relaxed text-muted">
                  <li className="flex gap-2.5">
                    <span className="tabular grid h-5 w-5 shrink-0 place-items-center rounded-full bg-navy-50 text-[10px] font-semibold text-navy-800">1</span>
                    The server confirms the payment, not the browser redirect.
                  </li>
                  <li className="flex gap-2.5">
                    <span className="tabular grid h-5 w-5 shrink-0 place-items-center rounded-full bg-navy-50 text-[10px] font-semibold text-navy-800">2</span>
                    Contact details are released to both parties and a message thread opens.
                  </li>
                  <li className="flex gap-2.5">
                    <span className="tabular grid h-5 w-5 shrink-0 place-items-center rounded-full bg-navy-50 text-[10px] font-semibold text-navy-800">3</span>
                    The owner accepts or declines. The contract remains a separate state.
                  </li>
                </ol>
              </div>

              <Alert tone="info" title="Still being confirmed">
                Refund handling, payout timing and what happens after a refusal are open decisions.
                The interface shows those states without inventing a policy.
              </Alert>
            </aside>
          </div>
        )}
      </div>
    </>
  );
}
