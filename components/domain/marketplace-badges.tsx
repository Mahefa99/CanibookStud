import { PROFESSIONAL_PRICING } from "@/lib/config/pricing";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import type { IconName } from "@/components/ui/icon";
import type {
  EventStatus,
  Litter,
  Professional,
  PuppyStatus,
} from "@/lib/types/marketplace";
import { formatDate } from "@/lib/utils";

/** Status and plan badges for the marketplace sections. */

export function LitterPlanBadge({ plan }: { plan: Litter["listingPlan"] }) {
  if (plan === "premium") {
    return (
      <Badge
        tone="navy"
        icon="star"
        description="Paid listing visibility. The configured V12 monthly subscription is separate from the puppy service fee."
      >
        Premium listing
      </Badge>
    );
  }
  return (
    <Badge
      tone="neutral"
      icon="clock"
      description="Free seven-day listing. It has no reserve button and does not accept a paid reservation."
    >
      Free 7-day listing
    </Badge>
  );
}

export function PendingPriceBadge() {
  return (
    <Badge
      tone="warning"
      icon="clock"
      description="V12 prices are configured. No price is charged in this preview."
    >
      V12 pricing / payment preview
    </Badge>
  );
}

const PUPPY_STATUS: Record<
  PuppyStatus,
  { label: string; tone: BadgeTone; icon: IconName; description: string }
> = {
  available: {
    label: "Available",
    tone: "success",
    icon: "check",
    description:
      "This puppy is not reserved. A reservation still requires an agreed checkout rule.",
  },
  reservation_pending: {
    label: "Reservation pending",
    tone: "warning",
    icon: "clock",
    description:
      "A reservation exists but is not confirmed. Do not treat it as reserved.",
  },
  reserved: {
    label: "Reserved",
    tone: "navy",
    icon: "lock",
    description:
      "Reserved for a buyer. The reservation is separate from a contract and from payment settlement.",
  },
  sold: {
    label: "Sold",
    tone: "neutral",
    icon: "check",
    description: "Placed. No further reservation is possible.",
  },
};

export function PuppyStatusBadge({ status }: { status: PuppyStatus }) {
  const config = PUPPY_STATUS[status];
  return (
    <Badge
      tone={config.tone}
      icon={config.icon}
      description={config.description}
    >
      {config.label}
    </Badge>
  );
}

export function LitterStatusBadge({ status }: { status: Litter["status"] }) {
  const labels = {
    available: "Available",
    sold_out: "Sold out",
    expired: "Listing expired",
    cancelled: "Cancelled",
  } as const;
  const tones: Record<Litter["status"], BadgeTone> = {
    available: "success",
    sold_out: "neutral",
    expired: "warning",
    cancelled: "danger",
  };
  return <Badge tone={tones[status]}>{labels[status]}</Badge>;
}

export function ReadinessBadge({
  readyDate,
  referenceDate,
}: {
  readyDate: string;
  referenceDate: string;
}) {
  const ready = readyDate <= referenceDate;
  return (
    <Badge
      tone={ready ? "success" : "warning"}
      icon={ready ? "check" : "clock"}
      description="The readiness window is a configurable platform rule in this prototype, not a verified legal minimum."
    >
      {ready ? "Ready now" : `Not ready until ${formatDate(readyDate)}`}
    </Badge>
  );
}

export function ProfessionalVerificationBadge({
  status,
}: {
  status: Professional["verification"];
}) {
  const config = {
    documents_reviewed: {
      label: "Documents reviewed",
      tone: "info" as BadgeTone,
      icon: "file" as IconName,
      description:
        "Business documents were reviewed against the platform checklist. Not a licence guarantee.",
    },
    in_review: {
      label: "Documents in review",
      tone: "warning" as BadgeTone,
      icon: "clock" as IconName,
      description: "The business is waiting for manual document review.",
    },
    not_submitted: {
      label: "Documents not submitted",
      tone: "neutral" as BadgeTone,
      icon: "file" as IconName,
      description: "No documents have been submitted for review.",
    },
  }[status];
  return (
    <Badge
      tone={config.tone}
      icon={config.icon}
      description={config.description}
    >
      {config.label}
    </Badge>
  );
}

/** Mock AI licence check (CDC V12 §10). Independent of the plan; not a legal verification. */
export function ProfessionalLicenseBadge({
  status,
}: {
  status: Professional["licenseCheck"];
}) {
  const config = {
    verified: {
      label: "Licence check passed",
      tone: "success" as BadgeTone,
      icon: "shield" as IconName,
      description:
        "Mock AI licence check only. Not a legal verification of the business licence.",
    },
    in_review: {
      label: "Licence check in review",
      tone: "warning" as BadgeTone,
      icon: "clock" as IconName,
      description:
        "The mock AI check has not finished. Not a legal verification.",
    },
    refused: {
      label: "Licence check refused",
      tone: "danger" as BadgeTone,
      icon: "warning" as IconName,
      description:
        "The mock AI check flagged the licence. Not a legal determination.",
    },
  }[status];
  return (
    <Badge
      tone={config.tone}
      icon={config.icon}
      description={config.description}
    >
      {config.label}
    </Badge>
  );
}

export function ProfessionalPlanBadge({
  plan,
}: {
  plan: Professional["plan"];
}) {
  const config = {
    free: {
      label: "Free plan",
      tone: "neutral" as BadgeTone,
      description: "Invisible listing, grey pin, locked number. No calls.",
    },
    standard: {
      label: "Standard",
      tone: "info" as BadgeTone,
      description: `${PROFESSIONAL_PRICING.standard.amountUsd} USD/month. Visible listing, coloured pin, simple profile.`,
    },
    premium: {
      label: "Premium",
      tone: "navy" as BadgeTone,
      description: `${PROFESSIONAL_PRICING.premium.amountUsd} USD/year. Top of city, detailed profile and booking.`,
    },
    boost: {
      label: "Boost",
      tone: "warning" as BadgeTone,
      description: `+${PROFESSIONAL_PRICING.boost.amountUsd} USD/month. Large gold pin at the top of the city for 30 days.`,
    },
  }[plan];
  return (
    <Badge tone={config.tone} description={config.description}>
      {config.label}
    </Badge>
  );
}

export function EmergencyBadge() {
  return (
    <Badge
      tone="danger"
      icon="warning"
      description="The business declared that it accepts emergencies. This does not mean it is open 24/7."
    >
      Accepts emergencies · declared
    </Badge>
  );
}

export function EventStatusBadge({ status }: { status: EventStatus }) {
  const config = {
    on_sale: { label: "On sale", tone: "success" as BadgeTone },
    sold_out: { label: "Sold out", tone: "neutral" as BadgeTone },
    past: { label: "Past event", tone: "warning" as BadgeTone },
  }[status];
  return <Badge tone={config.tone}>{config.label}</Badge>;
}
