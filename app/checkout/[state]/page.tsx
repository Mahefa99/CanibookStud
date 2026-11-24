import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import { Breadcrumbs } from "@/components/ui/page-header";
import { STUD_PRICING } from "@/lib/config/pricing";
import { formatUsd } from "@/lib/utils";

const VALID_STATES = ["pending", "failed", "confirmed"] as const;
type CheckoutState = (typeof VALID_STATES)[number];

const CONFIG: Record<
  CheckoutState,
  { title: string; badge: string; tone: "warning" | "danger" | "success"; body: string; next: string }
> = {
  pending: {
    title: "Payment pending",
    badge: "Pending",
    tone: "warning",
    body: "The payment is processing. The server has not confirmed it, so contact details and messaging remain locked.",
    next: "The interface should keep polling or wait for a realtime update. Do not show contact details from a redirect.",
  },
  failed: {
    title: "Payment failed",
    badge: "Failed",
    tone: "danger",
    body: "The payment did not succeed. Nothing was unlocked and the request can be retried with a new payment attempt.",
    next: "The request remains awaiting payment. A failure must not cancel the request automatically.",
  },
  confirmed: {
    title: "Confirmed state",
    badge: "Preview only",
    tone: "success",
    body: "This is the layout for a server-confirmed payment. No payment was made. In production, this state would release contact details and open a message thread — not the contract or the payout.",
    next: "A signed webhook is required. The success page alone is never sufficient.",
  },
};

type PaymentStatePageProps = { params: Promise<{ state: string }> };

export function generateStaticParams() {
  return VALID_STATES.map((state) => ({ state }));
}

export async function generateMetadata({ params }: PaymentStatePageProps): Promise<Metadata> {
  const { state } = await params;
  const config = VALID_STATES.includes(state as CheckoutState)
    ? CONFIG[state as CheckoutState]
    : null;
  return {
    title: config ? config.title : "Payment state",
    robots: { index: false, follow: false },
  };
}

export default async function PaymentStatePage({ params }: PaymentStatePageProps) {
  const { state } = await params;
  if (!VALID_STATES.includes(state as CheckoutState)) notFound();
  const config = CONFIG[state as CheckoutState];

  return (
    <div className="shell py-8 lg:py-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Checkout preview", href: "/checkout" },
          { label: config.title },
        ]}
      />

      <div className="mx-auto mt-6 max-w-2xl">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-white text-navy-700 shadow-card">
          <Icon
            name={config.tone === "success" ? "check" : config.tone === "danger" ? "warning" : "clock"}
            className="h-6 w-6"
          />
        </span>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge tone={config.tone}>{config.badge}</Badge>
          <Badge tone="neutral" icon="info">
            Demo state · no payment
          </Badge>
        </div>
        <h1 className="mt-3 font-display text-4xl leading-tight text-navy-900">{config.title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">{config.body}</p>

        <div className="mt-5 rounded-2xl border border-line bg-white p-5 shadow-card">
          <h2 className="font-display text-xl text-navy-900">Request</h2>
          <dl className="mt-3 space-y-2 text-[12px]">
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Reference</dt>
              <dd className="tabular font-medium text-ink">REQ-DEMO-1042</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Amount</dt>
              <dd className="tabular font-medium text-ink">{formatUsd(STUD_PRICING.depositUsd)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Escrow balance</dt>
              <dd className="tabular font-medium text-ink">{formatUsd(STUD_PRICING.balanceUsd)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Contact details</dt>
              <dd className="font-medium text-ink">{state === "confirmed" ? "Would unlock after webhook" : "Locked"}</dd>
            </div>
          </dl>
        </div>

        <Alert tone="info" className="mt-4" title="What the UI must do next">
          {config.next}
        </Alert>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/checkout"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-navy-700 px-5 text-sm font-semibold text-white hover:bg-navy-800"
          >
            <Icon name="arrow-left" className="h-4 w-4" />
            All states
          </Link>
          <Link
            href="/demo"
            className="inline-flex min-h-11 items-center rounded-full border border-line bg-white px-5 text-sm font-semibold text-navy-800"
          >
            What is simulated?
          </Link>
        </div>
      </div>
    </div>
  );
}
