import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { Icon } from "@/components/ui/icon";
import {
  DEMO_SNAPSHOT_LABEL,
  FOOTER_NAV,
  LEGAL_DRAFT_NOTICE,
  MARKETPLACE_NOTICE,
  SITE,
} from "@/lib/config/site";

export function SiteFooter() {
  return (
    <footer className="on-dark mt-20 bg-navy-900 text-navy-100">
      <div className="shell py-12 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_0.9fr]">
          <div>
            <Logo variant="on-dark" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-navy-200">
              A US marketplace for responsible stud discovery. Clear records, private contact
              details, and one account for every role.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-navy-100">
                <Icon name="pin" className="h-3 w-3" /> United States
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-navy-100">
                Prices in USD
              </span>
            </div>
          </div>

          {FOOTER_NAV.map((group) => (
            <div key={group.heading}>
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-orange-300">
                {group.heading}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-navy-100 underline-offset-4 hover:text-white hover:underline"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-orange-300">
              Policies
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-navy-200">
              <li>
                <Link href="/legal/terms" className="underline-offset-4 hover:text-white hover:underline">
                  Terms <span className="text-[10px] uppercase tracking-wide text-navy-300">draft</span>
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="underline-offset-4 hover:text-white hover:underline">
                  Privacy <span className="text-[10px] uppercase tracking-wide text-navy-300">draft</span>
                </Link>
              </li>
              <li>
                <Link href="/legal/no-delivery" className="underline-offset-4 hover:text-white hover:underline">
                  No-delivery policy <span className="text-[10px] uppercase tracking-wide text-navy-300">draft</span>
                </Link>
              </li>
            </ul>
            <p className="mt-4 text-[11px] leading-relaxed text-navy-300">
              Not published as final legal terms.
            </p>
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-orange-300">
            <Icon name="shield" className="h-3.5 w-3.5" />
            Marketplace notice · draft
          </p>
          <p className="mt-2 max-w-4xl text-xs leading-relaxed text-navy-200">{MARKETPLACE_NOTICE}</p>
          <p className="mt-2 text-[11px] text-navy-300">{LEGAL_DRAFT_NOTICE}</p>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-6 text-[11px] text-navy-300 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 {SITE.name}. Frontend preview for {SITE.domain}.
          </p>
          <p>
            {DEMO_SNAPSHOT_LABEL} · No real profiles, prices or payouts are represented.
          </p>
        </div>
      </div>
    </footer>
  );
}
