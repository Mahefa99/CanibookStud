import type { Stud } from "@/lib/types/domain";
import { hashString } from "@/lib/utils";
import { InteractiveMap, type MapPoint } from "./interactive-map";
export function MarketMap({
  studs,
  className,
  compact = false,
  ariaLabel,
  showSponsorPin = false,
}: {
  studs: Stud[];
  className?: string;
  compact?: boolean;
  ariaLabel?: string;
  showSponsorPin?: boolean;
}) {
  const points: MapPoint[] = studs.map((s) => ({
    id: s.id,
    name: s.name,
    city: s.location.city,
    lat: s.location.lat + ((hashString(s.id) % 1000) / 1000 - 0.5) * 0.04,
    lng:
      s.location.lng + ((hashString(s.id + "lng") % 1000) / 1000 - 0.5) * 0.04,
    href: `/studs/${s.slug}`,
    color: s.featured ? "#FFD700" : "#002B58",
    size: s.featured ? 48 : 32,
  }));
  if (showSponsorPin)
    points.push({
      id: "sample-sponsor",
      name: "Sample sponsor pin - no live campaign",
      city: "Denver, CO",
      lat: 39.74,
      lng: -104.99,
      href: "/sponsors",
      color: "#FFD700",
      size: 48,
      sponsored: true,
    });
  return (
    <div className={className}>
      <InteractiveMap points={points} compact={compact} />
      {ariaLabel ? (
        <p className="mt-2 text-xs text-muted">
          {ariaLabel.replace(/Schematic|schematic/g, "Interactive")}
        </p>
      ) : null}
      {showSponsorPin ? (
        <p className="mt-2 text-xs text-muted">
          Sponsor placements available. No campaign is live.
        </p>
      ) : null}
    </div>
  );
}
