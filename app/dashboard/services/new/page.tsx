import type { Metadata } from "next";
import { ProfessionalCreateForm } from "@/components/forms/professional-create-form";
import { Alert } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import { Breadcrumbs } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Add a business",
  robots: { index: false, follow: false },
};

export default function NewProfessionalPage() {
  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "My Business", href: "/dashboard/business" },
          { label: "Add a business" },
        ]}
      />

      <header className="mt-4">
        <p className="eyebrow">Professional · preview</p>
        <h1 className="mt-2 font-display text-4xl leading-tight text-navy-900">Add a business</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Submit a business profile for a manual document review. No AI, no automatic approval, no plan
          payment and no public contact details in this preview.
        </p>
      </header>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <ProfessionalCreateForm />

        <aside className="space-y-4 lg:sticky lg:top-24">
          <Alert tone="warning" title="Manual review only">
            Documents are reviewed by a person against a checklist. There is no automatic licence
            check. A paid plan would never create a verified badge.
          </Alert>

          <div className="rounded-2xl border border-line bg-white p-5">
            <h2 className="font-display text-xl text-navy-900">What review checks</h2>
            <ul className="mt-3 space-y-2 text-[11px] leading-relaxed text-muted">
              {[
                "Business name and address consistency",
                "Document legibility and expiry, when applicable",
                "Category and declared emergency acceptance",
                "The services and hours shown publicly",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Icon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-navy-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-line bg-white p-5">
            <h2 className="font-display text-xl text-navy-900">Contact visibility</h2>
            <p className="mt-2 text-[11px] leading-relaxed text-muted">
              Whether a free profile shows a phone number is still an open decision. The preview keeps
              business phone numbers out of the public page.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
