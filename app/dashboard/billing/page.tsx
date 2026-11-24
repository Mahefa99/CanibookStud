import type { Metadata } from "next";
import { Alert } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";

import { Button } from "@/components/ui/button";
import { BREEDER_SUBSCRIPTIONS } from "@/lib/config/pricing";
import { DEMO_ACCOUNT } from "@/lib/data/demo/account";
import { formatDate, formatUsd } from "@/lib/utils";

export const metadata: Metadata = { title: "Billing" };

export default function BillingPage() {
  const account = DEMO_ACCOUNT;
  const plans = BREEDER_SUBSCRIPTIONS;
  const currentPlan = plans.find((plan) => plan.id === "free")!;

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Billing</p>
        <h1 className="mt-2 font-display text-4xl leading-tight text-navy-900">
          Billing
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Subscription billing only. Request fees and stud fees are separate and
          are not charged here.
        </p>
      </header>

      <Alert tone="warning" title="Payment provider not connected">
        No card, invoice or payout account exists. Buttons on this page are
        disabled so the preview cannot imply a real subscription.
      </Alert>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <section
          aria-labelledby="plan-heading"
          className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2
                id="plan-heading"
                className="font-display text-2xl text-navy-900"
              >
                Current plan
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="font-semibold">
                  {currentPlan.name} ? demo selection
                </span>
                <span className="text-[11px] text-muted">
                  Renews{" "}
                  {account.plan.renewsOn
                    ? formatDate(account.plan.renewsOn)
                    : "—"}
                </span>
              </div>
            </div>
            <p className="tabular font-display text-3xl text-navy-900">
              {formatUsd(currentPlan.monthlyUsd ?? 0)}
              <span className="text-xs font-normal text-muted">/mo</span>
            </p>
          </div>

          <ul className="mt-4 grid gap-2 text-[12px] text-muted sm:grid-cols-2">
            {[
              "1 dog",
              "Across all breeds",
              "Records stay independent",
              "Upgrade after provider connection",
            ].map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <Icon name="check" className="h-3.5 w-3.5 text-success-600" />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" disabled>
              Change plan
            </Button>
            <Button size="sm" variant="ghost" disabled>
              Cancel subscription
            </Button>
          </div>
          <p className="mt-3 text-[10px] text-muted">
            A plan controls visibility and photo limits. It never changes
            document review status or verification signals.
          </p>
        </section>

        <section
          aria-labelledby="payment-heading"
          className="rounded-2xl border border-line bg-white p-5 shadow-card"
        >
          <h2
            id="payment-heading"
            className="font-display text-2xl text-navy-900"
          >
            Payment method
          </h2>
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-dashed border-line bg-cream-50 p-4">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-navy-500">
              <Icon name="card" className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[13px] font-semibold text-ink">
                No card on file
              </p>
              <p className="text-[11px] text-muted">
                Not configured in this preview.
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-3 rounded-xl border border-dashed border-line bg-cream-50 p-4">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-navy-500">
              <Icon name="lock" className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[13px] font-semibold text-ink">
                Payout account
              </p>
              <p className="text-[11px] text-muted">
                Not connected. Payout timing is still being confirmed.
              </p>
            </div>
          </div>
        </section>
      </div>

      <section aria-labelledby="plans-heading">
        <h2 id="plans-heading" className="font-display text-2xl text-navy-900">
          Breeder subscriptions
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {plans.map((plan) => {
            const current = plan.id === currentPlan.id;
            return (
              <article
                key={plan.id}
                className={
                  current
                    ? "rounded-2xl border-2 border-navy-700 bg-white p-5"
                    : "rounded-2xl border border-line bg-white p-5"
                }
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-navy-900">
                    {plan.name}
                  </h3>
                  {current ? (
                    <span className="rounded-full bg-navy-50 px-2 py-0.5 text-[10px] font-semibold text-navy-800">
                      Current
                    </span>
                  ) : null}
                </div>
                <p className="tabular mt-2 font-display text-3xl text-navy-900">
                  {formatUsd(plan.monthlyUsd ?? 0)}
                  <span className="text-xs font-normal text-muted">/mo</span>
                </p>
                <p className="mt-1 text-[11px] text-muted">
                  {plan.dogLimit ?? "Unlimited"} dogs /{" "}
                  {plan.annualUsd
                    ? `${formatUsd(plan.annualUsd)}/year`
                    : "Free"}
                </p>
                <Button size="sm" variant="secondary" className="mt-4" disabled>
                  {current ? "Current plan" : "Switch plan"}
                </Button>
              </article>
            );
          })}
        </div>
      </section>

      <section
        aria-labelledby="invoices-heading"
        className="rounded-2xl border border-line bg-white shadow-card"
      >
        <div className="border-b border-line px-5 py-4">
          <h2
            id="invoices-heading"
            className="font-display text-xl text-navy-900"
          >
            Invoices
          </h2>
        </div>
        <div className="px-5 py-8 text-center">
          <p className="text-sm font-semibold text-ink">No invoices</p>
          <p className="mt-1 text-[12px] text-muted">
            Invoices will be generated by the billing provider once it is
            connected.
          </p>
        </div>
      </section>

      <p className="rounded-xl border border-line bg-cream-50 p-4 text-[11px] leading-relaxed text-muted">
        Open decisions: refunds, payout timing and the treatment of a refusal
        after payment. These are not presented as final policy on this page.
      </p>
    </div>
  );
}
