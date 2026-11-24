import type { Metadata } from "next";
import Link from "next/link";
import { Alert } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import { PageHeader } from "@/components/ui/page-header";
import { STUD_PRICING } from "@/lib/config/pricing";
import { formatUsd } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Checkout preview",
  robots: { index: false, follow: false },
};

const STATES = [
  { href: "/checkout/pending", label: "Payment pending", body: "Processing; contact stays locked." },
  { href: "/checkout/failed", label: "Payment failed", body: "Nothing is unlocked; retry is possible." },
  { href: "/checkout/confirmed", label: "Confirmed state", body: "Server-confirmed layout. No real payment." },
  { href: "/access-denied", label: "Access denied", body: "A signed-in user without permission." },
  { href: "/contracts/CB-2026-1042", label: "Contract", body: "Draft agreement, separate from payment." },
];

export default function CheckoutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Checkout · preview"
        title="Payment states, without a payment."
        description="The checkout itself is not connected. These screens document the states the interface must handle before a provider is chosen."
        actions={
          <Link
            href="/studs/marlo-northshore/request"
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line bg-white px-5 text-sm font-semibold text-navy-800 hover:border-navy-300"
          >
            Back to a request
            <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
        }
      />

      <div className="shell py-8 lg:py-10">
        <Alert tone="warning" title="No payment is possible here">
          No card fields are collected. The {formatUsd(STUD_PRICING.depositUsd)} deposit (escrowed,
          applied toward the stud fee) is a layout value only. Contact details are never unlocked by
          visiting a success page.
        </Alert>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Link
            href="/checkout/stud/marlo-northshore"
            className="rounded-2xl border border-line bg-white p-5 shadow-card hover:border-navy-300"
          >
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Stud request</p>
            <p className="mt-1 font-display text-2xl text-navy-900">{formatUsd(STUD_PRICING.depositUsd)}</p>
            <p className="mt-1 text-[11px] text-muted">Deposit escrow · contact + breeding request</p>
          </Link>
          <Link
            href="/checkout/litter/cedar-stone-fall-litter"
            className="rounded-2xl border border-line bg-white p-5 shadow-card hover:border-navy-300"
          >
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Litter reservation</p>
            <p className="mt-1 font-display text-2xl text-navy-900">$3,600</p>
            <p className="mt-1 text-[11px] text-muted">Full total · collection rule pending</p>
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STATES.map((state) => (
            <Link
              key={state.href}
              href={state.href}
              className="rounded-2xl border border-line bg-white p-5 shadow-card transition-[border,transform] hover:-translate-y-0.5 hover:border-navy-300"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-cream-100 text-navy-700">
                <Icon name={state.href.includes("failed") ? "warning" : state.href.includes("confirmed") ? "check" : "clock"} className="h-4 w-4" />
              </span>
              <h2 className="mt-3 font-display text-xl text-navy-900">{state.label}</h2>
              <p className="mt-1 text-[12px] leading-relaxed text-muted">{state.body}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-navy-800">
                Review state
                <Icon name="arrow-right" className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>

        <section className="mt-8 rounded-2xl border border-line bg-cream-50 p-5">
          <h2 className="font-display text-xl text-navy-900">What a real checkout must guarantee</h2>
          <ul className="mt-3 grid gap-2 text-[12px] leading-relaxed text-muted sm:grid-cols-2">
            {[
              "The server creates the amount; the client cannot set it.",
              "The payment intent metadata carries the request and dam IDs.",
              "A signed webhook is the only source of the confirmed state.",
              "A failed or abandoned payment leaves the request open with nothing unlocked.",
              "A redirect to a success URL is treated as a hint, not proof.",
              "Contact details, contracts and payouts remain separate states.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Icon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-navy-400" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
