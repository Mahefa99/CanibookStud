import type { IconName } from "@/components/ui/icon";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: IconName;
}

export const ADMIN_NAV: AdminNavItem[] = [
  { label: "Overview", href: "/admin", icon: "list" },
  { label: "Verifications", href: "/admin/verifications", icon: "shield" },
  { label: "Content", href: "/admin/content", icon: "file" },
  { label: "Users", href: "/admin/users", icon: "user" },
  { label: "Reports", href: "/admin/reports", icon: "warning" },
  { label: "Transactions", href: "/admin/transactions", icon: "card" },
  { label: "Sponsors", href: "/admin/sponsors", icon: "star" },
  { label: "Events", href: "/admin/events", icon: "calendar" },
];
