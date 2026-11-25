import type { Activity } from "@/lib/types/domain";
import type { IconName } from "@/components/ui/icon";

export interface DashboardNavItem {
  label: string;
  href: string;
  icon: IconName;
  /** False while the section belongs to a later delivery slice. */
  available: boolean;
  /** When present, the item is only shown for these account activities. */
  activities?: Activity[];
}

export interface DashboardNavGroup {
  heading: string;
  items: DashboardNavItem[];
}

/**
 * Dashboard navigation.
 *
 * Items not delivered yet are rendered as disabled "Soon" entries rather than
 * dead links. Activity-specific sections only render when the account holds the
 * matching activity; the demo account exercises stud owner, dam owner and buyer.
 */
export const DASHBOARD_NAV: DashboardNavGroup[] = [
  {
    heading: "Workspace",
    items: [
      { label: "Overview", href: "/dashboard", icon: "list", available: true },
      { label: "Import & KYC", href: "/dashboard/import", icon: "file", available: true },
      { label: "My Animals", href: "/dashboard/animals", icon: "paw", available: true },
      { label: "My Listings", href: "/dashboard/listings", icon: "file", available: true },
      {
        label: "Requests & Reservations",
        href: "/dashboard/requests",
        icon: "message",
        available: true,
      },
      { label: "Messages", href: "/dashboard/messages", icon: "message", available: true },
      { label: "Contracts", href: "/dashboard/contracts", icon: "file", available: true },
      { label: "Favorites", href: "/dashboard/favorites", icon: "heart", available: true },
    ],
  },
  {
    heading: "Account",
    items: [
      { label: "Paid reservations", href: "/dashboard/reservations", icon: "card", activities: ["breeder"], available: true },
      { label: "Identity verification", href: "/dashboard/verification", icon: "shield", available: true },
      { label: "Billing", href: "/dashboard/billing", icon: "card", available: true },
      { label: "Settings", href: "/dashboard/settings", icon: "settings", available: true },
    ],
  },
  {
    heading: "Activity",
    items: [
      {
        label: "My Business",
        href: "/dashboard/business",
        icon: "pin",
        available: true,
        activities: ["professional"],
      },
      {
        label: "My Club",
        href: "/dashboard/club",
        icon: "award",
        available: true,
        activities: ["club_manager"],
      },
      {
        label: "My Events",
        href: "/dashboard/events",
        icon: "calendar",
        available: true,
        activities: ["club_manager"],
      },
      {
        label: "Sponsorships",
        href: "/dashboard/sponsorships",
        icon: "star",
        available: true,
        activities: ["sponsor", "club_manager"],
      },
    ],
  },
];
