import { requireAccess } from "@/src/lib/supabase/require-access";
import type { Metadata } from "next";
import Link from "next/link";
import { AdminNav } from "@/components/admin/admin-nav";
import { Icon } from "@/components/ui/icon";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAccess("/admin");
  return (
    <div className="min-h-screen border-t border-line bg-[#F8F5EF]">
      <div className="on-dark bg-navy-900 text-white">
        <div className="shell flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex flex-wrap items-center gap-2 text-[11px]">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-300/40 bg-orange-500/10 px-2 py-0.5 font-semibold uppercase tracking-wide text-orange-200">
              <Icon name="shield" className="h-3 w-3" />
              Administration
            </span>
          </p>
          <div className="flex items-center gap-3 text-[11px]">
            <Link href="/" className="text-navy-100 underline underline-offset-2 hover:text-white">
              Public site
            </Link>
          </div>
        </div>
      </div>

      <div className="shell py-6 lg:py-8">
        <div className="grid min-w-0 gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8">
          <aside className="min-w-0">
            <div className="rounded-2xl border border-line bg-white p-3 shadow-card lg:sticky lg:top-24">
              <AdminNav />
              <p className="mt-3 hidden border-t border-line pt-3 text-[10px] leading-relaxed text-muted lg:block">
                Content, reports, sponsors and events are preview sections.
              </p>
            </div>
          </aside>
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}

