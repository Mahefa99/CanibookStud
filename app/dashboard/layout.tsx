import { requireAccess } from "@/src/lib/supabase/require-access";
import type { Metadata } from "next";
import Link from "next/link";
import { signOut } from "@/src/features/auth/actions/sign-out";
import { Icon } from "@/components/ui/icon";
import { DEMO_DISCLOSURE } from "@/lib/config/site";
import { DASHBOARD_NAV } from "@/lib/config/dashboard-nav";
import { createClient } from "@/src/lib/supabase/server";


export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};


export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireAccess("/dashboard");
  const db = createClient();
  // RLS limits both reads to the authenticated profile.
  const [profile, memberships] = await Promise.all([
    db.from("profiles").select("display_name,email").single(),
    db.from("account_activities").select("activity"),
  ]);
  if (profile.error || memberships.error) throw new Error("Unable to load account profile.");
  const account = profile.data;
  const roles = memberships.data.map(row => row.activity);
  const navActivities = new Set<string>(roles);
  if (navActivities.has("breeder")) {
    navActivities.add("stud_owner");
    navActivities.add("dam_owner");
  }
  if (navActivities.has("club")) navActivities.add("club_manager");
  const visibleGroups = DASHBOARD_NAV.map((group) => ({
    ...group,
    items: group.items.filter(
      (item) =>
        !item.activities ||
        item.activities.some((activity) => navActivities.has(activity)),
    ),
  })).filter((group) => group.items.length > 0);
  const flatItems = visibleGroups.flatMap((group) => group.items);

  function renderItem(item: (typeof flatItems)[number]) {
    return item.available ? (
      <Link
        href={item.href}
        className="flex min-h-9 items-center gap-2 whitespace-nowrap rounded-lg px-2.5 py-2 text-[13px] font-medium text-[#3E4A59] hover:bg-cream-50 hover:text-navy-900"
      >
        <Icon name={item.icon} className="h-4 w-4 text-navy-300" />
        {item.label}
      </Link>
    ) : (
      <span
        aria-disabled="true"
        title="Planned for a later delivery slice"
        className="flex min-h-9 cursor-not-allowed items-center gap-2 whitespace-nowrap rounded-lg px-2.5 py-2 text-[13px] font-medium text-muted"
      >
        <Icon name={item.icon} className="h-4 w-4" />
        {item.label}
        <span className="ml-auto rounded-full bg-cream-100 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wide">
          Soon
        </span>
      </span>
    );
  }

  return (
    <div className="min-h-screen border-t border-line bg-[#F8F5EF]">
      <div className="border-b border-line bg-white">
        <div className="shell flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-navy-700 text-sm font-semibold text-white">
              {account.display_name[0]}
              
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-navy-900">{account.display_name}</p>
              <p className="truncate text-[11px] text-muted">{account.email}</p>
            </div>
            <form action={signOut}><button className="underline" type="submit">Sign out</button></form>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-orange-800">
              <Icon name="info" className="h-3 w-3" />
              Demo workspace
            </span>
            <span className="hidden text-[11px] text-muted sm:inline">
              {DEMO_DISCLOSURE}
            </span>
          </div>
        </div>
      </div>

      <div className="shell py-6 lg:py-8">
        <div className="grid min-w-0 gap-6 lg:grid-cols-[232px_minmax(0,1fr)] lg:gap-8">
          <aside aria-label="Dashboard navigation" className="min-w-0">
            <div className="rounded-2xl border border-line bg-white p-3 shadow-card lg:sticky lg:top-24">
              <div className="mb-3 hidden rounded-xl bg-cream-50 p-3 lg:block">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                  Activities on this account
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {roles.map((activity) => (
                    <span
                      key={activity}
                      className="rounded-full border border-line bg-white px-2 py-0.5 text-[10px] font-medium text-navy-800"
                    >
                      {activity}
                    </span>
                  ))}
                </div>
                <Link
                  href="/dashboard/settings"
                  className="mt-2 inline-flex text-[10px] font-semibold text-navy-700 underline underline-offset-2"
                >
                  Manage activities
                </Link>
              </div>

              <nav aria-label="Dashboard sections" className="min-w-0">
                {/* Mobile: a wrapping strip avoids a horizontally blown-out grid. */}
                <ul className="flex flex-wrap gap-1 pb-1 lg:hidden">
                  {flatItems.map((item) => (
                    <li key={item.href}>{renderItem(item)}</li>
                  ))}
                </ul>

                <div className="hidden space-y-4 lg:block">
                  {visibleGroups.map((group) => (
                    <div key={group.heading}>
                      <p className="px-2 pb-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-navy-500">
                        {group.heading}
                      </p>
                      <ul className="space-y-0.5">
                        {group.items.map((item) => (
                          <li key={item.href}>{renderItem(item)}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </nav>

              <div className="mt-4 hidden rounded-xl border border-line bg-cream-50 p-3 text-[10px] leading-relaxed text-muted lg:block">
                <p className="font-semibold text-ink">Preview data</p>
                <p className="mt-1">
                  Requests, messages and payments are simulated. Your profile and session are live.
                </p>
              </div>
            </div>
          </aside>

          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}


