import Link from "next/link";
import type { Metadata } from "next";
import { RequestStatusBadge } from "@/components/domain/request-status-badge";
import { Alert } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import { DEMO_ACCOUNT } from "@/lib/data/demo/account";
import { formatDate, formatUsd } from "@/lib/utils";

export const metadata: Metadata = { title: "Requests & Reservations" };

const STATUS_HELP: Record<string, string> = {
  contact_unlocked:
    "Payment was confirmed by the server. Contact details and messaging are available; contract and acceptance remain separate states.",
  awaiting_payment:
    "The request exists but no payment is confirmed. Contact details stay private. In production a payment link would be offered here.",
  declined:
    "The owner declined the request. Refund handling is an open decision and is not described as a policy here.",
};

export default function RequestsPage() {
  const requests = DEMO_ACCOUNT.requests;

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Requests &amp; Reservations</p>
        <h1 className="mt-2 font-display text-4xl leading-tight text-navy-900">
          Requests &amp; reservations
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Payment, owner acceptance, contract and payout are four different states. Nothing here is
          merged into a single “confirmed” badge.
        </p>
      </header>

      <Alert tone="info" title="Simulated inbox">
        No request was sent and no payment exists. Payment confirmation is server-side in
        production; a success redirect alone would never unlock contact details.
      </Alert>

      <section aria-labelledby="request-list-heading">
        <div className="flex items-center justify-between">
          <h2 id="request-list-heading" className="font-display text-2xl text-navy-900">
            All requests
          </h2>
          <span className="text-[11px] text-muted">{requests.length} sample</span>
        </div>

        <div className="mt-3 space-y-3">
          {requests.map((request) => (
            <article key={request.id} className="rounded-2xl border border-line bg-white p-4 shadow-card sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                    Request #{request.id.replace("req-", "")} · {formatDate(request.createdAt)}
                  </p>
                  <h3 className="mt-1 font-display text-xl text-navy-900">
                    {request.damName} → {request.studName}
                  </h3>
                  <p className="mt-1 text-[11px] text-muted">
                    Breeding request · {formatUsd(request.amountUsd)} escrow deposit applied toward stud fee ·{" "}
                    {formatUsd(80)} platform fee included
                  </p>
                </div>
                <RequestStatusBadge status={request.status} />
              </div>

              <p className="mt-3 rounded-xl bg-cream-50 p-3 text-[12px] leading-relaxed text-muted">
                {STATUS_HELP[request.status] ?? "State under review."}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px]">
                {request.status === "contact_unlocked" ? (
                  <Link
                    href="/dashboard/messages"
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-navy-700 px-3.5 font-semibold text-white hover:bg-navy-800"
                  >
                    <Icon name="message" className="h-3.5 w-3.5" />
                    Open messages
                  </Link>
                ) : null}
                {request.status === "awaiting_payment" ? (
                  <span className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-line bg-cream-50 px-3.5 font-semibold text-muted">
                    <Icon name="lock" className="h-3.5 w-3.5" />
                    Payment not connected
                  </span>
                ) : null}
                <Link
                  href={`/studs/${request.studSlug}`}
                  className="font-semibold text-navy-800 underline underline-offset-4"
                >
                  View stud profile
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Request", "Submitted by the dam owner."],
          ["Payment", "Confirmed by the payment provider and webhook."],
          ["Acceptance", "Owner accepts or declines the request."],
          ["Contract", "Separate agreement; not created by payment."],
        ].map(([label, description], index) => (
          <div key={label} className="rounded-2xl border border-line bg-white p-4">
            <p className="tabular text-[10px] font-semibold text-navy-500">0{index + 1}</p>
            <p className="mt-1 text-sm font-semibold text-ink">{label}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted">{description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
