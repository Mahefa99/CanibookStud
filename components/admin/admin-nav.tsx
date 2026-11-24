"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { ADMIN_NAV } from "@/lib/config/admin-nav";
import { cn } from "@/lib/utils";

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Administration sections">
      <ul className="flex flex-wrap gap-1 lg:block lg:space-y-0.5">
        {ADMIN_NAV.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-9 items-center gap-2 whitespace-nowrap rounded-lg px-2.5 py-2 text-[13px] font-medium",
                  active
                    ? "bg-navy-700 text-white"
                    : "text-[#3E4A59] hover:bg-cream-50 hover:text-navy-900",
                )}
              >
                <Icon name={item.icon} className={cn("h-4 w-4", active ? "text-white" : "text-navy-300")} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
