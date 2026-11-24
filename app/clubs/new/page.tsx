import type { Metadata } from "next";
import { ClubCreateForm } from "@/components/forms/club-create-form";
import { Alert } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import { Breadcrumbs } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Register a club",
  robots: { index: false, follow: false },
};

export default function NewClubPage() {
  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Clubs", href: "/clubs" },
          { label: "Register a club" },
        ]}
      />

      <header className="mt-4">
        <p className="eyebrow">Club · preview</p>
        <h1 className="mt-2 font-display text-4xl leading-tight text-navy-900">Register a club</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Club registration is free. A person reviews the domain, club email and supporting documents
          before a public profile is published. No AI and no automatic approval.
        </p>
      </header>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <ClubCreateForm />

        <aside className="space-y-4 lg:sticky lg:top-24">
          <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
            <h2 className="font-display text-xl text-navy-900">Free club profile</h2>
            <ul className="mt-3 space-y-2 text-[11px] leading-relaxed text-muted">
              {[
                "A public club page once reviewed",
                "Recommended studs and professionals with attribution",
                "Events and ticket listings",
                "A parent-club claim that stays separate from verification",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Icon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-navy-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <Alert tone="warning" title="No automatic verification">
            The .org website and email are format-checked only. The parent-club claim is not verified
            here, and there is no AI step.
          </Alert>

          <div className="rounded-2xl border border-line bg-white p-5">
            <h2 className="font-display text-xl text-navy-900">Contact privacy</h2>
            <p className="mt-2 text-[11px] leading-relaxed text-muted">
              The club email is not shown publicly in this preview. A public contact route would be
              defined with the club owner.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
