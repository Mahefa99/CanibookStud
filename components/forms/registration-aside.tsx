import Link from "next/link";
import { Alert } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import { FOUNDER_PROGRAM, STUD_PLANS } from "@/lib/config/pricing";
import { formatUsd } from "@/lib/utils";

/** Contextual guidance beside the registration form. */
export function RegistrationAside({ mode }: { mode: "stud" | "dam" }) {
  const isStud = mode === "stud";

  return (
    <aside className="space-y-4 lg:sticky lg:top-24">
      <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
        <h2 className="font-display text-xl text-navy-900">What you will need</h2>
        <ul className="mt-3 space-y-2.5 text-[12px] leading-relaxed text-muted">
          {[
            "Registered name, breed and date of birth",
            "City and state only — never a street address",
            "AKC registration number (format checked)",
            "Brucellosis test date and a private copy",
            isStud ? "At least one representative photo" : "Last heat date and average cycle length",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Icon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-navy-400" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
        <h2 className="font-display text-xl text-navy-900">Review states</h2>
        <ol className="mt-3 space-y-3 text-[12px] leading-relaxed text-muted">
          <li className="flex gap-2.5">
            <span className="tabular grid h-5 w-5 shrink-0 place-items-center rounded-full bg-navy-50 text-[10px] font-semibold text-navy-800">1</span>
            Draft saved locally — not public.
          </li>
          <li className="flex gap-2.5">
            <span className="tabular grid h-5 w-5 shrink-0 place-items-center rounded-full bg-navy-50 text-[10px] font-semibold text-navy-800">2</span>
            Documents reviewed separately from the plan.
          </li>
          <li className="flex gap-2.5">
            <span className="tabular grid h-5 w-5 shrink-0 place-items-center rounded-full bg-navy-50 text-[10px] font-semibold text-navy-800">3</span>
            {isStud ? "Plan activated only after a confirmed payment." : "Private profile available to you."}
          </li>
        </ol>
      </div>

      {isStud ? (
        <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
          <h2 className="font-display text-xl text-navy-900">Listing plans</h2>
          <ul className="mt-3 space-y-2">
            {STUD_PLANS.map((plan) => (
              <li key={plan.id} className="flex items-baseline justify-between gap-3 text-[12px]">
                <span className="text-muted">
                  {plan.name} · {plan.photoLimit} photos
                </span>
                <span className="tabular font-semibold text-ink">
                  {formatUsd(plan.monthlyUsd)}/mo
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 border-t border-line pt-3 text-[11px] leading-relaxed text-muted">
            {FOUNDER_PROGRAM.label}: not available. {FOUNDER_PROGRAM.description}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
          <h2 className="font-display text-xl text-navy-900">Free, and private</h2>
          <p className="mt-2 text-[12px] leading-relaxed text-muted">
            Adding a female has no subscription. The profile and heat calendar are private by
            default; you decide what to share with a stud owner.
          </p>
        </div>
      )}

      <Alert tone="neutral" title="Nothing is uploaded">
        This preview keeps your inputs in the browser. Do not enter real identity documents or
        sensitive personal data.
      </Alert>

      <Link
        href="/dashboard/animals"
        className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-navy-800 underline underline-offset-4"
      >
        <Icon name="arrow-left" className="h-3.5 w-3.5" />
        Back to My Animals
      </Link>
    </aside>
  );
}
