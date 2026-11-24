import type { ReactNode } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function AdminPageHeader({
  title,
  description,
  eyebrow = "Administration",
  action,
}: {
  title: string;
  description: string;
  eyebrow?: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-2 font-display text-3xl leading-tight text-navy-900 sm:text-4xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{description}</p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}

export function AdminStat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4 shadow-card">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
      <p className="tabular mt-2 font-display text-3xl leading-none text-navy-900">{value}</p>
      <p className="mt-2 text-[11px] leading-relaxed text-muted">{hint}</p>
    </div>
  );
}

export function AdminTableShell({
  title,
  description,
  count,
  children,
}: {
  title: string;
  description?: string;
  count?: number;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line px-5 py-4">
        <div>
          <h2 className="font-display text-xl text-navy-900">{title}</h2>
          {description ? <p className="mt-0.5 text-[11px] text-muted">{description}</p> : null}
        </div>
        {typeof count === "number" ? (
          <Badge tone="neutral" size="sm">
            {count} sample {count === 1 ? "item" : "items"}
          </Badge>
        ) : null}
      </div>
      <div
        className="overflow-x-auto"
        tabIndex={0}
        role="region"
        aria-label={`${title} table`}
      >
        {children}
      </div>
    </section>
  );
}

export function AdminStatusPill({
  label,
  tone,
}: {
  label: string;
  tone: "neutral" | "info" | "success" | "warning" | "danger";
}) {
  return <Badge tone={tone} size="sm">{label}</Badge>;
}

export function AdminDemoAction({ label = "Action disabled" }: { label?: string }) {
  return (
    <button
      type="button"
      disabled
      title="Administration actions are not connected in this preview."
      className="inline-flex min-h-8 cursor-not-allowed items-center rounded-full border border-line bg-cream-50 px-3 text-[10px] font-semibold text-muted"
    >
      {label}
    </button>
  );
}

export function AdminNotice() {
  return (
    <div className="rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-[11px] leading-relaxed text-orange-900">
      Demo administration. All records are fictional. Approve, reject, refund and payout actions are
      disabled; no decision here changes any public page.
    </div>
  );
}

export function AdminLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className={cn("text-[11px] font-semibold text-navy-800 underline underline-offset-2 hover:text-navy-900")}
    >
      {children}
    </Link>
  );
}
