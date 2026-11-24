import type { ReactNode } from "react";
import { Alert } from "@/components/ui/feedback";
import { PageHeader } from "@/components/ui/page-header";

/** Shared shell for the draft legal pages. */
export function LegalPage({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <>
      <PageHeader
        eyebrow="Legal · draft"
        title={title}
        description={description}
        actions={
          <span className="rounded-full border border-warning-600/25 bg-warning-50 px-3 py-1.5 text-[11px] font-semibold text-warning-700">
            Draft · legal review pending
          </span>
        }
      />
      <div className="shell py-8 lg:py-12">
        <div className="max-w-2xl">
          <Alert tone="warning" title="This is not a final legal document">
            The text below is a design draft for review. It is not legal advice, not a binding policy
            and not a substitute for a lawyer&apos;s review. Last edited November 4, 2026.
          </Alert>
          <div className="mt-6 space-y-6">{children}</div>
        </div>
      </div>
    </>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-2xl text-navy-900">{title}</h2>
      <div className="mt-2 space-y-3 text-[14px] leading-7 text-muted">{children}</div>
    </section>
  );
}
