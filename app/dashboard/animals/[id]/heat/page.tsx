import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HeatTracker } from "@/components/forms/heat-tracker";
import { Alert } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import { Breadcrumbs } from "@/components/ui/page-header";
import { DEMO_REFERENCE_DATE } from "@/lib/config/site";
import { DEMO_DAMS } from "@/lib/data/demo/account";
import { DEMO_STUDS } from "@/lib/data/demo/studs";
import { addDays, ageInYears, formatDate } from "@/lib/utils";

type HeatPageProps = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return DEMO_DAMS.map((dam) => ({ id: dam.id }));
}

export async function generateMetadata({ params }: HeatPageProps): Promise<Metadata> {
  const { id } = await params;
  const dam = DEMO_DAMS.find((entry) => entry.id === id);
  return {
    title: dam ? `${dam.name} — heat calendar` : "Heat calendar",
    robots: { index: false, follow: false },
  };
}

export default async function HeatPage({ params }: HeatPageProps) {
  const { id } = await params;
  const dam = DEMO_DAMS.find((entry) => entry.id === id);
  if (!dam) notFound();

  const nextHeat = addDays(dam.lastHeatDate, dam.cycleLengthDays);
  const studNames = DEMO_STUDS.map((stud) => `${stud.name} · ${stud.breed}`);

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "My Animals", href: "/dashboard/animals" },
          { label: dam.name, href: "/dashboard/animals" },
          { label: "Heat calendar" },
        ]}
      />

      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Private · heat calendar</p>
          <h1 className="mt-2 font-display text-4xl leading-tight text-navy-900">
            {dam.name}&apos;s cycle
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            {dam.breed} · {ageInYears(dam.birthDate, DEMO_REFERENCE_DATE)} years ·{" "}
            {dam.location.city}, {dam.location.stateCode}. This calendar is private by default and is
            not part of the public profile.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-line bg-white px-3 py-1.5 text-[11px] font-semibold text-muted">
          <Icon name="lock" className="h-3.5 w-3.5" />
          Private
        </span>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          <HeatTracker dam={dam} studNames={studNames} referenceDate={DEMO_REFERENCE_DATE} />
        </div>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-line bg-white p-5 shadow-card">
            <h2 className="font-display text-xl text-navy-900">Cycle summary</h2>
            <dl className="mt-3 space-y-2 text-[12px]">
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Last heat</dt>
                <dd className="font-medium text-ink">{formatDate(dam.lastHeatDate)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Average cycle</dt>
                <dd className="tabular font-medium text-ink">{dam.cycleLengthDays} days</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Next estimate</dt>
                <dd className="font-medium text-ink">{formatDate(nextHeat)}</dd>
              </div>
            </dl>
            <p className="mt-3 text-[10px] leading-relaxed text-muted">
              Estimates only. Change the cycle in the female&apos;s profile when your records differ.
            </p>
          </section>

          <section className="rounded-2xl border border-line bg-white p-5">
            <h2 className="font-display text-lg text-navy-900">Notifications</h2>
            <p className="mt-1 text-[11px] leading-relaxed text-muted">
              Planned reminders are shown for review; no email or push message is sent.
            </p>
            <ul className="mt-3 space-y-2 text-[11px] text-muted">
              {[
                [`14 days before ${formatDate(nextHeat)}`, "Find a stud and check records."],
                [`On ${formatDate(nextHeat)}`, "Log the heat if it starts."],
                ["7 days after the start", "Review the cycle notes."],
              ].map(([title, body]) => (
                <li key={title} className="rounded-lg border border-line bg-cream-50 p-2.5">
                  <p className="font-semibold text-ink">{title}</p>
                  <p className="mt-0.5">{body}</p>
                  <span className="mt-1 inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wide text-muted">
                    <Icon name="lock" className="h-2.5 w-2.5" />
                    Not connected
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <Alert tone="warning" title="Estimates are not diagnoses">
            A recorded mating does not confirm pregnancy. The due date is an estimate (mating + 63
            days) and must not be treated as a veterinary finding.
          </Alert>
        </aside>
      </div>

      <Link
        href="/dashboard/animals"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-800 underline underline-offset-4"
      >
        <Icon name="arrow-left" className="h-4 w-4" />
        Back to My Animals
      </Link>
    </div>
  );
}
