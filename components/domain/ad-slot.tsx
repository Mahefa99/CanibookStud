import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { FEATURES, isAdAllowedForPath, type AdPlacement } from "@/lib/config/features";
import { cn } from "@/lib/utils";

/**
 * Sponsor-inventory preview.
 *
 * The guard is the important part: no slot renders unless the page explicitly
 * opts into an allowed placement and the current path is not on the forbidden
 * list. Animal profiles, galleries, contracts, checkout, admin and dashboard
 * never render this component.
 *
 * There is no sponsor brand, creative, impression or click in the preview.
 */
export function AdSlot({
  placement,
  pathname,
  variant = "banner",
  className,
}: {
  placement: AdPlacement;
  pathname: string;
  variant?: "banner" | "sidebar" | "native";
  className?: string;
}) {
  if (!FEATURES.ads.enabled) return null;
  if (!isAdAllowedForPath(pathname, placement)) return null;

  const isSidebar = variant === "sidebar";
  const isNative = variant === "native";

  return (
    <aside
      data-ad-placement={placement}
      aria-label="Sponsor inventory preview"
      className={cn(
        "rounded-2xl border border-dashed border-[#CFC6B8] bg-cream-50 p-4",
        isSidebar && "p-4",
        isNative && "p-4",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Badge tone="neutral" icon="star">
          Sponsored placement · sample
        </Badge>
        <Link
          href="/sponsors"
          className="text-[10px] font-semibold text-navy-800 underline underline-offset-2"
        >
          Sponsor inventory
        </Link>
      </div>

      <div className={cn("mt-2 flex items-start gap-3", isSidebar && "flex-col")}>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-navy-700 shadow-sm">
          <Icon name="star" className="h-4 w-4" />
        </span>
        <div>
          <p className={cn("font-display text-navy-900", isSidebar ? "text-lg leading-tight" : "text-xl leading-tight")}>
            {isSidebar ? "Sidebar space" : isNative ? "Native card space" : "Banner space"}
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted">
            {isSidebar
              ? "300 × 250 placement preview. No campaign is live."
              : isNative
                ? "A native card would appear here after creative approval."
                : "728 × 90 placement preview. No campaign is live."}
          </p>
        </div>
      </div>

      <p className="mt-2 text-[10px] leading-relaxed text-muted">
        {FEATURES.ads.note} No brand, impression or click is represented.
      </p>
    </aside>
  );
}
