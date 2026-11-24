import type { Metadata } from "next";
import { LitterCreateForm } from "@/components/forms/litter-create-form";
import { Alert } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import { Breadcrumbs } from "@/components/ui/page-header";
import { DEMO_REFERENCE_DATE } from "@/lib/config/site";
import { DEMO_DAMS } from "@/lib/data/demo/account";
import { DEMO_STUDS } from "@/lib/data/demo/studs";

export const metadata: Metadata = {
  title: "Create a litter",
  robots: { index: false, follow: false },
};

export default function NewLitterPage() {
  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "My Listings", href: "/dashboard/listings" },
          { label: "New litter" },
        ]}
      />

      <header className="mt-4">
        <p className="eyebrow">Litter · preview</p>
        <h1 className="mt-2 font-display text-4xl leading-tight text-navy-900">Create a litter</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Prepare a litter listing with individual puppy records. Nothing is published or charged
          until review and a confirmed payment.
        </p>
      </header>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <LitterCreateForm dams={DEMO_DAMS} studs={DEMO_STUDS} referenceDate={DEMO_REFERENCE_DATE} />

        <aside className="space-y-4 lg:sticky lg:top-24">
          <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
            <h2 className="font-display text-xl text-navy-900">Before publishing</h2>
            <ul className="mt-3 space-y-2.5 text-[12px] leading-relaxed text-muted">
              {[
                "One record per puppy, with a name, collar or mark, sex and status.",
                "A readiness window of 56 days in this sample — a configurable rule, not legal advice.",
                "At least one photo per puppy in production; the preview uses local images only.",
                "Pick-up only. The platform does not deliver animals.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Icon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-navy-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-line bg-white p-5">
            <h2 className="font-display text-xl text-navy-900">Review states</h2>
            <ol className="mt-3 space-y-2 text-[11px] leading-relaxed text-muted">
              <li><strong className="text-ink">Draft</strong> — saved locally, not public.</li>
              <li><strong className="text-ink">In review</strong> — content and puppy identities checked.</li>
              <li><strong className="text-ink">Published</strong> — only after approval and payment.</li>
            </ol>
          </div>

          <Alert tone="warning" title="No payment / no upload">
            This preview does not store photos, start a subscription or collect the service fee.
          </Alert>
        </aside>
      </div>
    </div>
  );
}
