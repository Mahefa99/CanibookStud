import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export const metadata: Metadata = {
  title: "Access denied",
  robots: { index: false, follow: false },
};

export default function AccessDeniedPage() {
  return (
    <div className="shell flex min-h-[60vh] flex-col items-start justify-center py-16">
      <span className="grid h-16 w-16 place-items-center rounded-full border border-line bg-cream-100 text-danger-700">
        <Icon name="lock" className="h-7 w-7" />
      </span>
      <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
        403 · Access denied
      </p>
      <h1 className="mt-3 max-w-xl font-display text-4xl leading-tight text-navy-900">
        This area is not available to your account.
      </h1>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">
        This state is shown when a signed-in user reaches a resource they do not own or a section
        their activities do not grant. Hiding a link is not access control — the server must return
        this result.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/dashboard"
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-navy-700 px-5 text-sm font-semibold text-white hover:bg-navy-800"
        >
          Back to dashboard
          <Icon name="arrow-right" className="h-4 w-4" />
        </Link>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-full border border-line bg-white px-5 text-sm font-semibold text-navy-800"
        >
          Public home
        </Link>
      </div>
      <p className="mt-6 text-[11px] text-muted">
        The admin area uses a separate, clearly labelled demo gate. It is not a security boundary.
      </p>
    </div>
  );
}
