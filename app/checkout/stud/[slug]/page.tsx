import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Alert } from "@/components/ui/feedback";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Breadcrumbs } from "@/components/ui/page-header";
import { DEMO_STUDS } from "@/lib/data/demo/studs";
import { STUD_PRICING } from "@/lib/config/pricing";
import { formatUsd } from "@/lib/utils";

type CheckoutStudPageProps = { params: Promise<{ slug: string }> };

export const metadata: Metadata = {
  title: "Stud request checkout",
  robots: { index: false, follow: false },
};

export default async function CheckoutStudPage({ params }: CheckoutStudPageProps) {
  const { slug } = await params;
  const stud = DEMO_STUDS.find((entry) => entry.slug === slug);
  if (!stud) notFound();

  return (
    <div className="shell py-8 lg:py-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Checkout", href: "/checkout" },
          { label: `Request ${stud.name}` },
        ]}
      />

      <div className="mx-auto mt-6 grid max-w-4xl gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <p className="eyebrow">Checkout · preview</p>
          <h1 className="mt-2 font-display text-4xl leading-tight text-navy-900">
            Request contact &amp; breeding
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {stud.name} · {stud.breed} · {stud.location.city}, {stud.location.stateCode}
          </p>

          <div className="mt-5">
            <Alert tone="warning" title="Payment is disabled">
              No payment provider is connected and no card is collected. The amount is shown so the
              price breakdown can be reviewed.
            </Alert>
          </div>

          <section className="mt-5 rounded-2xl border border-line bg-white p-5 shadow-card">
            <h2 className="font-display text-xl text-navy-900">What the $400 deposit covers</h2>
            <ul className="mt-3 space-y-2 text-[12px] leading-relaxed text-muted">
              {[
                "Contact with the stud owner after server confirmation",
                "The breeding request record",
                "A message thread and contract tooling",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Icon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-navy-400" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[11px] leading-relaxed text-muted">
              The {formatUsd(STUD_PRICING.depositUsd)} deposit is escrowed and applied toward the{" "}
              {formatUsd(STUD_PRICING.studFeeUsd)} stud fee — not an extra fee. It does not confirm a
              pregnancy. The {formatUsd(STUD_PRICING.serviceFeeUsd)} service fee is non-refundable.
            </p>
          </section>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href={`/studs/${stud.slug}/request`}
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line bg-white px-4 text-sm font-semibold text-navy-800"
            >
              Back to request
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
              <dt className="text-muted">Deposit (escrowed)</dt>
              <dd className="tabular font-medium text-ink">{formatUsd(STUD_PRICING.depositUsd)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Service fee (non-refundable)</dt>
              <dd className="tabular font-medium text-ink">{formatUsd(STUD_PRICING.serviceFeeUsd)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Balance (escrowed)</dt>
              <dd className="tabular font-medium text-ink">{formatUsd(STUD_PRICING.balanceUsd)}</dd>
            </div>
            <div className="flex justify-between gap-3 border-t border-line pt-2">
              <dt className="font-semibold text-ink">Total (dam owner)</dt>
              <dd className="tabular font-display text-2xl text-navy-900">
                {formatUsd(STUD_PRICING.totalUsd)}
              </dd>
            </div>
          </dl>
          <div className="mt-4">
            <Button fullWidth size="lg" disabled>
              Pay {formatUsd(STUD_PRICING.depositUsd)} deposit — unavailable
            </Button>
            <p className="mt-2 text-center text-[10px] text-muted">
              Payment methods, including instalments, are not enabled.
            </p>
          </div>
          <p className="mt-3 text-[10px] leading-relaxed text-muted">
            Contact details would unlock only after a signed server webhook. Visiting a success page
            would never unlock them.
          </p>
        </aside>
      </div>
    </div>
  );
}
