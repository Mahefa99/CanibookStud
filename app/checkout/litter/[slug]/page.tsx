import { DeliveryOptions } from "@/components/forms/delivery-options";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Alert } from "@/components/ui/feedback";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Breadcrumbs } from "@/components/ui/page-header";
import { DEMO_LITTERS } from "@/lib/data/demo/litters";
import { DELIVERY } from "@/lib/config/pricing";
import { FEATURES } from "@/lib/config/features";
import { formatUsd } from "@/lib/utils";

type CheckoutLitterPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ puppy?: string }>;
};

export const metadata: Metadata = {
  title: "Litter reservation checkout",
  robots: { index: false, follow: false },
};

export default async function CheckoutLitterPage({ params, searchParams }: CheckoutLitterPageProps) {
  const { slug } = await params;
  const { puppy: puppyId } = await searchParams;
  const litter = DEMO_LITTERS.find((entry) => entry.slug === slug);
  if (!litter) notFound();
  const puppy = litter.puppies.find((entry) => entry.id === puppyId);

  return (
    <div className="shell py-8 lg:py-12"><DeliveryOptions />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Checkout", href: "/checkout" },
          { label: litter.title },
        ]}
      />

      <div className="mx-auto mt-6 grid max-w-4xl gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <p className="eyebrow">Reservation checkout · preview</p>
          <h1 className="mt-2 font-display text-4xl leading-tight text-navy-900">
            {litter.title}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {puppy ? `${puppy.name} · ${puppy.color} · ${puppy.mark}` : "One identified puppy"} ·{" "}
            {litter.breederName}
          </p>

          <div className="mt-5">
            <Alert tone="warning" title="Collection rule is not decided">
              The source documents disagree on whether the platform collects the $600 service fee only
              or the full {formatUsd(litter.totalUsd)}. No payment is taken. The full total is shown so
              the screen never says “Pay $600” for a $3,600 debit.
            </Alert>
          </div>

          <section className="mt-5 rounded-2xl border border-line bg-white p-5 shadow-card">
            <h2 className="font-display text-xl text-navy-900">Before paying in production</h2>
            <ul className="mt-3 space-y-2 text-[12px] leading-relaxed text-muted">
              {[
                "Confirm that the named puppy is the one being reserved.",
                "Review the health record and the pick-up plan.",
                "A reservation is for one puppy, not the whole litter.",
                "Delivery is pick-up by default; an approved transporter is optional and not yet available.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Icon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-navy-400" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-5 rounded-2xl border border-line bg-white p-5 shadow-card">
            <h2 className="font-display text-xl text-navy-900">Delivery</h2>
            <dl className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-cream-50 p-3">
                <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted">Delivery mode</dt>
                <dd className="mt-1 text-sm font-semibold text-ink">Pick-up (default)</dd>
              </div>
              <div className="rounded-xl bg-cream-50 p-3">
                <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted">Transporter</dt>
                <dd className="mt-1 text-sm font-semibold text-ink">Approved transporter — not validated</dd>
              </div>
              <div className="rounded-xl bg-cream-50 p-3">
                <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted">Delivery fee</dt>
                <dd className="mt-1 text-sm font-semibold text-ink">Pricing to be confirmed</dd>
              </div>
              <div className="rounded-xl bg-cream-50 p-3">
                <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted">Escrow release</dt>
                <dd className="mt-1 text-sm font-semibold text-ink">Delivery + 48 h</dd>
              </div>
            </dl>
            <p className="mt-3 text-[11px] leading-relaxed text-muted">
              Optional delivery via an approved transporter is available once the admin validates the
              transporter list and prices. Currently {FEATURES.delivery.enabled ? "enabled" : "disabled"} in this
              preview; the default mode is {DELIVERY.defaultMode}.
            </p>
          </section>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href={`/puppies/${litter.slug}${puppy ? `/reserve?puppy=${puppy.id}` : ""}`}
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line bg-white px-4 text-sm font-semibold text-navy-800"
            >
              Back to reservation
            </Link>
            <Link
              href="/checkout/pending"
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line bg-white px-4 text-sm font-semibold text-navy-800"
            >
              Preview pending state
            </Link>
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-line bg-white p-5 shadow-card lg:sticky lg:top-24">
          <h2 className="font-display text-xl text-navy-900">Summary</h2>
          <dl className="mt-3 space-y-2 text-[12px]">
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Puppy price by breeder</dt>
              <dd className="tabular font-medium text-ink">{formatUsd(litter.puppyPriceUsd)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Platform service fee</dt>
              <dd className="tabular font-medium text-ink">{formatUsd(litter.serviceFeeUsd)}</dd>
            </div>
            <div className="flex justify-between gap-3 border-t border-line pt-2">
              <dt className="font-semibold text-ink">Total</dt>
              <dd className="tabular font-display text-2xl text-navy-900">{formatUsd(litter.totalUsd)}</dd>
            </div>
          </dl>
          <div className="mt-4">
            <Button fullWidth size="lg" disabled>
              Pay {formatUsd(litter.totalUsd)} — unavailable
            </Button>
            <p className="mt-2 text-center text-[10px] text-muted">
              No payment provider or instalment plan is connected.
            </p>
          </div>
          <p className="mt-3 text-[10px] leading-relaxed text-muted">
            The $600 portion is the platform fee, not necessarily the amount debited. Taxes, refunds
            and payout timing are not defined.
          </p>
        </aside>
      </div>
    </div>
  );
}
