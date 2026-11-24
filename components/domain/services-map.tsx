import type { Professional } from "@/lib/types/marketplace";
import { InteractiveMap } from "./interactive-map";
import {
  PROFESSIONAL_PIN,
  professionalCategoryColor,
} from "@/lib/config/professional-categories";
export function ServicesMap({
  professionals,
  compact = false,
}: {
  professionals: Professional[];
  compact?: boolean;
}) {
  const points = professionals.map((p) => ({
    id: p.id,
    name: p.name,
    city: p.address.city,
    lat: Math.round(p.address.lat * 10) / 10,
    lng: Math.round(p.address.lng * 10) / 10,
    href:
      p.plan === "free" ? "/dashboard/services/new" : `/pet-services/${p.slug}`,
    color:
      p.plan === "free"
        ? PROFESSIONAL_PIN.inactive
        : p.plan === "boost"
          ? PROFESSIONAL_PIN.boost
          : professionalCategoryColor(p.category),
    size: p.plan === "boost" ? 45 : p.plan === "free" ? 20 : 30,
    inactive: p.plan === "free",
  }));
  return (
    <div>
      <InteractiveMap points={points} compact={compact} />
      <p className="mt-2 text-xs text-muted">
        Grey: inactive, locked contact. Category colour: active. Large gold:
        Boost placement, not verification.
      </p>
    </div>
  );
}
